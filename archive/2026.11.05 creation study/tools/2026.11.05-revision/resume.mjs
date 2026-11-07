#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,existsSync,mkdirSync,renameSync,copyFileSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {CliTransport,auditEvents,isTransportDiagnostic,ContaminationError} from './transport.mjs';
import {PacedPool} from './pacing.mjs';
import {verifyCampaign} from './verify.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const atomic=(p,v)=>{const t=p+'.'+randomUUID()+'.tmp';writeFileSync(t,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');renameSync(t,p);};
const stripCorrection=packet=>{const x=structuredClone(packet);delete x.correction;return x;};

export async function loadResume(scratch) {
  scratch=resolve(scratch);const manifest=json(join(scratch,'manifest.json'));
  const load=p=>import(pathToFileURL(join(scratch,'frozen/source',p)).href);
  const parts=await Promise.all(['src/story/parser.ts','src/playtest/session.ts','src/playtest/chapter-session.ts','src/playtest/grading.ts','src/playtest/project-files.ts','src/playtest/report.ts'].map(load));
  const api=Object.assign({},...parts),protocol=await import(pathToFileURL(join(scratch,'protocol.mjs')).href);
  const markdown=readFileSync(join(scratch,'frozen/story.md'),'utf8');
  assert.equal(hash(markdown),manifest.storyHash);assert.equal(api.runtimeHash(),manifest.runtimeHash);assert.equal(hash(manifest.guidance),manifest.guidanceHash);
  for(const [file,digest] of Object.entries(manifest.runnerHashes))assert.equal(hash(readFileSync(join(scratch,file))),digest,`Original frozen runner changed: ${file}`);
  const story=api.parseStory(markdown,{id:manifest.story}),records=[];
  for(const file of readdirSync(scratch).filter(f=>/^c\d+-p\d+-[a-z0-9]+\.json$/.test(f))) {
    const session=json(join(scratch,file)),player=Number(/^c\d+-p(\d+)-/.exec(session.id)[1]);
    assert.equal(session.storyHash,manifest.storyHash);assert.equal(session.runtimeHash,manifest.runtimeHash);assert.equal(session.guidance,manifest.guidance);assert.equal(session.playStyle,manifest.mode);
    api.verifyChapterSession(session,story);
    const outputs=api.playerOutputs(session),retained=json(join(manifest.directory,`chapter${session.chapter}_playtest${player}.json`));
    assert.deepEqual(retained,outputs,'Retained outputs do not match canonical session');
    records.push({player,session,baseline:structuredClone(outputs)});
  }
  assert.equal(records.length,manifest.chapters.length*3,'Resume requires every original player checkpoint');
  for(const chapter of manifest.chapters)assert.deepEqual(records.filter(r=>r.session.chapter===chapter).map(r=>r.player).sort(),[1,2,3]);
  const synthesisRubric=readFileSync(join(scratch,'frozen/source/docs/fun-and-evaluation.md'),'utf8').split('### Chapter synthesis grader\n')[1];
  return{scratch,manifest,api,protocol,story,records,synthesisRubric};
}

/** Reconstruct the original process audit, which otherwise writes only at shutdown. */
export function recoverRequestAudit(scratch,protocol) {
  const existing=existsSync(join(scratch,'transport-audit.json'))?json(join(scratch,'transport-audit.json')):[];
  const audit=new Map(existing.map(a=>[`${a.requestId}:${a.attempt}`,a])),requests=[],assignments=[];
  const root=join(scratch,'requests');if(!existsSync(root))return{audit:existing,requests,assignments};
  for(const name of readdirSync(root)) {
    const match=/^(.+)-(decision|final-report|grade|synthesis)-([a-f0-9-]{36})$/.exec(name);if(!match)continue;
    const folder=join(root,name),[,assignment,phase,requestId]=match;
    const packet=existsSync(join(folder,'packet.json'))?json(join(folder,'packet.json')):null;
    const schema=existsSync(join(folder,'schema.json'))?json(join(folder,'schema.json')):null;
    if(packet)assignments.push({assignment,phase,packet});
    for(const eventFile of readdirSync(folder).filter(f=>/^attempt\d+-events\.jsonl$/.test(f))) {
      const attempt=Number(/^attempt(\d+)/.exec(eventFile)[1]),key=`${requestId}:${attempt}`,raw=readFileSync(join(folder,eventFile),'utf8');
      const stderrFile=join(folder,`attempt${attempt}-stderr.txt`),stderr=existsSync(stderrFile)?readFileSync(stderrFile,'utf8'):'';
      const events=auditEvents(raw),completion=events.find(e=>e.type==='turn.completed'),output=join(folder,`attempt${attempt}-response.json`);
      const failed=events.some(e=>['turn.failed','error'].includes(e.type)&&!isTransportDiagnostic(e));let accepted=!!completion&&!failed&&existsSync(output),value;
      if(accepted){try{value=json(output);protocol.validateSchema(value,schema);}catch{accepted=false;}}
      if(!audit.has(key))audit.set(key,{assignment,phase,requestId,attempt,model:['grade','synthesis'].includes(phase)?'gpt-6-astra':'gpt-6.1-terra',effort:['grade','synthesis'].includes(phase)?'high':'medium',elapsedMs:Math.max(0,statSync(join(folder,eventFile)).mtimeMs-statSync(folder).birthtimeMs),code:accepted?0:1,toolEvents:0,threadId:events.find(e=>e.type==='thread.started')?.thread_id,usage:completion?.usage??null,accepted,transportDiagnostics:events.filter(isTransportDiagnostic).map(e=>e.message??e.item.message),internalTransportRetries:(stderr.match(/stream disconnected - retrying sampling request/g)??[]).length,...(!accepted?{error:(stderr||raw).slice(-2000),interrupted:true}:{})});
      if(accepted)requests.push({assignment,phase,packet,raw:readFileSync(output,'utf8'),value,elapsedMs:audit.get(key).elapsedMs});
    }
  }
  return{audit:[...audit.values()],requests,assignments};
}

export async function resumeCampaign(prepared,{slots=4,minIntervalMs=2000,cooldownMs=30000,maxAttempts=8,transport:providedTransport,onEvent=e=>console.log(JSON.stringify(e))}={}) {
  const{scratch,manifest,api,protocol,story,records,synthesisRubric}=prepared,directory=manifest.directory;
  const recovered=recoverRequestAudit(scratch,protocol),stateFile=join(scratch,'resume-state.json');
  const state=existsSync(stateFile)?json(stateFile):{players:{},chapters:{},superseded:[],resumptions:[]};
  const resumeId=new Date().toISOString().replaceAll(/[:.]/g,'-'),runFolder=join(scratch,'resume-runs',resumeId);mkdirSync(runFolder,{recursive:true});
  const resumeHashes={};for(const file of ['resume.mjs','pacing.mjs','transport.mjs','verify.mjs','protocol.mjs','tool-free-models.json',...(prepared.extraRunnerFiles??[])]){copyFileSync(join(import.meta.dirname,file),join(runFolder,file));resumeHashes[file]=hash(readFileSync(join(runFolder,file)));}
  const entry={id:resumeId,startedAt:new Date().toISOString(),slots,minIntervalMs,cooldownMs,maxAttempts,hashes:resumeHashes,baseline:records.map(r=>({id:r.session.id,player:r.player,chapter:r.session.chapter,accepted:r.baseline.length,hash:hash(JSON.stringify(r.baseline))}))};
  state.resumptions.push(entry);atomic(stateFile,state);
  const completed=new Set(),failures=[],started=Date.now();
  let transport;
  const saveAudit=()=>atomic(join(scratch,'transport-audit.json'),[...recovered.audit,...(transport?.audit??[])]);
  const log=e=>{onEvent(e);atomic(join(scratch,'resume-status.json'),{resumeId,directory,chapterReports:[...completed].sort((a,b)=>a-b),failures,activeRequests:pool.active,queuedRequests:pool.queue.length,slots:pool.limit,cooldownUntil:pool.cooldownUntil,elapsedMs:Date.now()-started});};
  const pool=new PacedPool({limit:slots,minIntervalMs,cooldownMs,onEvent:log});
  transport=providedTransport??new CliTransport({scratch:join(scratch,'requests'),pool,maxAttempts,timeoutMs:manifest.timeoutSeconds*1000,onEvent:e=>{saveAudit();if(/429|rate.limit|too many requests/i.test(e.error??''))pool.rateLimited();else if(e.accepted)pool.succeeded();log({event:'request',...e});}});
  const persist=r=>{atomic(join(scratch,r.session.id+'.json'),r.session);api.writePlayerOutputs({directory,player:r.player},r.session.chapter,api.playerOutputs(r.session));};
  const checkpoint=()=>{atomic(stateFile,state);saveAudit();};
  const oldIndexes=new Map();for(const c of manifest.chapters){const p=join(scratch,`chapter${c}-records.json`);if(existsSync(p))for(const r of json(p))oldIndexes.set(r.id,r);}
  const gradePacketHash=s=>hash(JSON.stringify(api.graderPacket(s)));
  const gradePacketHashes=s=>new Set([gradePacketHash(s),...(prepared.previousGradePackets?.(s)??[]).map(p=>hash(JSON.stringify(p)))]);
  const matchesGradePacket=(s,packet)=>gradePacketHashes(s).has(hash(JSON.stringify(stripCorrection(packet))));
  function existingGrade(r) {
    const s=r.session,path=join(scratch,s.id+'-grade.json');
    if(!existsSync(path)) {
      const recoveredGrade=recovered.requests.find(q=>{if(q.phase!=='grade'||!q.assignment.startsWith(s.id+'-grader-')||!matchesGradePacket(s,q.packet))return false;try{api.validateGrade(q.value,s);return true;}catch{return false;}});
      if(!recoveredGrade)return false;atomic(path,recoveredGrade.raw);
    }
    const raw=readFileSync(path,'utf8'),grade=JSON.parse(raw);api.validateGrade(grade,s);
    const stored=state.players[s.id],old=oldIndexes.get(s.id),request=recovered.requests.find(q=>q.phase==='grade'&&q.assignment.startsWith(s.id+'-grader-')&&JSON.stringify(q.value)===JSON.stringify(grade)&&matchesGradePacket(s,q.packet));
    if(stored?.gradePacketHash)assert(gradePacketHashes(s).has(stored.gradePacketHash),'Existing grade belongs to a different player record');
    assert(stored?.graderId||old?.graderId||request?.assignment,'Cannot establish original grader assignment');
    Object.assign(r,{grade,gradeRaw:raw,graderId:stored?.graderId??old?.graderId??request.assignment,graderElapsedMs:stored?.graderElapsedMs??old?.graderElapsedMs??request?.elapsedMs??0,playerElapsedMs:s.elapsedMs??0});return true;
  }
  function supersede(r) {
    const s=r.session,folder=join(scratch,'superseded',resumeId,s.id);mkdirSync(folder,{recursive:true});
    copyFileSync(join(scratch,s.id+'.json'),join(folder,'session.json'));
    const grade=join(scratch,s.id+'-grade.json');if(existsSync(grade)){existingGrade(r);renameSync(grade,join(folder,'original-grade.json'));}
    const previous=state.players[s.id]??oldIndexes.get(s.id)??{};
    state.superseded.push({resumeId,player:s.id,reason:'Technical interruption resumed at the canonical checkpoint; any partial grade applies only to the saved prior record.',previousGraderId:r.graderId??previous.graderId??null,previousOutcome:s.outcome,previousActions:s.turns.length,folder});
    delete state.players[s.id];delete r.grade;delete r.gradeRaw;
  }
  async function playerAndGrade(r) {
    const s=r.session,id=s.id;let meta=state.players[id]??=oldIndexes.get(id)?{...oldIndexes.get(id)}:{};
    if(!s.final&&s.outcome==='technical-interruption'){supersede(r);delete s.outcome;meta=state.players[id]={};persist(r);checkpoint();}
    if(!s.final) {
      const baseElapsed=s.elapsedMs??0,playerStarted=Date.now();let invalid=0,correction;
      const lastRejection=[...s.requests].reverse().find(q=>q.reply&&q.error&&q.step===s.adventure.frame.step);
      if(lastRejection)correction={message:lastRejection.error,rejectedReply:lastRejection.reply};
      try {
        while(!s.final) {
          if(s.turns.length>=manifest.maxTurns&&!api.needsReport(s))s.outcome='budget';
          const packet=api.playerRequest(s),step=packet.adventure.step,at=Date.now();
          const response=await transport.ask({assignment:id,phase:packet.request,packet:{...packet,...(correction?{correction}:{})},schema:protocol.playerSchema(packet),model:manifest.playerModel,effort:manifest.playerEffort,envelope:true});
          try{api.submitReply(s,story,response.value);s.requests.push({step,elapsedMs:Date.now()-at});correction=undefined;invalid=0;}
          catch(error){correction={message:error.message,rejectedReply:response.value};s.requests.push({step,elapsedMs:Date.now()-at,error:error.message,reply:response.value});if(++invalid>=3)throw error;}
          s.elapsedMs=baseElapsed+Date.now()-playerStarted;persist(r);checkpoint();
        }
      } catch(error) {
        if(error instanceof ContaminationError)throw error;
        s.outcome='technical-interruption';s.requests.push({step:s.adventure.frame.step,elapsedMs:0,error:`Resume transport/protocol interruption: ${error.message}`});
        throw error;
      } finally{s.elapsedMs=baseElapsed+Date.now()-playerStarted;persist(r);checkpoint();}
    }
    api.verifyChapterSession(s,story);r.playerElapsedMs=s.elapsedMs??0;
    if(existingGrade(r)){log({event:'grade-reused',chapter:s.chapter,player:r.player,graderId:r.graderId});return r;}
    meta=state.players[id]??={};
    prepared.beforeNewGrade?.(s,meta);
    const priorAssignment=recovered.assignments.find(q=>q.phase==='grade'&&q.assignment.startsWith(id+'-grader-')&&hash(JSON.stringify(stripCorrection(q.packet)))===gradePacketHash(s));
    meta.graderId??=priorAssignment?.assignment??`${id}-grader-${randomUUID().slice(0,8)}`;r.graderId=meta.graderId;checkpoint();
    const packet=api.graderPacket(s),gradeStarted=Date.now();let correction;
    for(let attempt=1;attempt<=3;attempt++) {
      const response=await transport.ask({assignment:r.graderId,phase:'grade',packet:{...packet,...(correction?{correction}:{})},schema:protocol.gradeSchema,model:manifest.graderModel,effort:manifest.graderEffort});
      try{api.validateGrade(response.value,s);r.grade=response.value;r.gradeRaw=response.raw;break;}catch(error){if(attempt===3)throw error;correction={message:error.message,rejectedReply:response.value};}
    }
    r.graderElapsedMs=(meta.graderElapsedMs??0)+Date.now()-gradeStarted;Object.assign(meta,{gradePacketHash:gradePacketHash(s),graderElapsedMs:r.graderElapsedMs});
    atomic(join(scratch,id+'-grade.json'),r.gradeRaw);checkpoint();log({event:'graded',chapter:s.chapter,player:r.player,graderId:r.graderId});return r;
  }
  const definitions=prepared.definitionsFile??join(scratch,'frozen/source/docs/fun-and-evaluation.md');
  const assembleIfComplete=()=>{if(completed.size===manifest.chapters.length)api.assemblePlaytestReport(directory,definitions);};
  for(const chapter of manifest.chapters) {
    const path=join(directory,`chapter${chapter}_report.md`);if(!existsSync(path))continue;
    const group=records.filter(r=>r.session.chapter===chapter);
    if(!group.every(r=>r.session.final)) {
      const folder=join(scratch,'superseded',resumeId,`chapter${chapter}`);mkdirSync(folder,{recursive:true});
      renameSync(path,join(folder,'partial-report.md'));
      const synthesis=join(scratch,`chapter${chapter}-synthesis.json`);if(existsSync(synthesis))renameSync(synthesis,join(folder,'partial-synthesis.json'));
      delete state.chapters[chapter];state.superseded.push({resumeId,chapter,reason:'A prior partial chapter report is superseded by completion of the same interrupted player assignments; original report and synthesis preserved.',folder});checkpoint();continue;
    }
    for(const r of group)assert(existingGrade(r),'Retained report lacks its original grade');
    protocol.validateSynthesis(json(join(scratch,`chapter${chapter}-synthesis.json`)),group);completed.add(chapter);
  }
  assembleIfComplete();
  async function chapterWork(chapter) {
    const group=records.filter(r=>r.session.chapter===chapter).sort((a,b)=>a.player-b.player);
    const results=await Promise.allSettled(group.map(playerAndGrade));const errors=results.filter(x=>x.status==='rejected');if(errors.length)throw new AggregateError(errors.map(x=>x.reason),`Chapter ${chapter} unfinished; checkpoints preserved`);
    const index=group.map(r=>({id:r.session.id,player:r.player,graderId:r.graderId,playerElapsedMs:r.playerElapsedMs,graderElapsedMs:r.graderElapsedMs}));atomic(join(scratch,`chapter${chapter}-records.json`),index);
    const meta=state.chapters[chapter]??={},synthesisPath=join(scratch,`chapter${chapter}-synthesis.json`);let synthesis;
    prepared.beforeNewSynthesis?.(chapter,meta,existsSync(synthesisPath));
    const currentRecords=group.map(r=>({player:r.player,record:api.graderPacket(r.session),independentGrade:r.grade}));
    if(!existsSync(synthesisPath)&&prepared.completedSynthesis){const prior=prepared.completedSynthesis(group);if(prior){protocol.validateSynthesis(prior.value,group);atomic(synthesisPath,prior.raw);Object.assign(meta,{synthesisId:prior.assignment,elapsedMs:prior.elapsedMs,instructionHash:prior.instructionHash});}}
    const matchesSynthesis=q=>q.phase==='synthesis'&&q.packet.chapter===chapter&&JSON.stringify(q.packet.records)===JSON.stringify(currentRecords);
    if(!existsSync(synthesisPath)) {
      const recoveredSynthesis=recovered.requests.find(q=>{if(!matchesSynthesis(q))return false;try{protocol.validateSynthesis(q.value,group);return true;}catch{return false;}});
      if(recoveredSynthesis){atomic(synthesisPath,recoveredSynthesis.raw);meta.synthesisId=recoveredSynthesis.assignment;meta.elapsedMs=recoveredSynthesis.elapsedMs;}
    }
    if(existsSync(synthesisPath))synthesis=protocol.validateSynthesis(json(synthesisPath),group);
    else {
      meta.synthesisId??=recovered.assignments.find(matchesSynthesis)?.assignment??`c${chapter}-synthesis-${randomUUID().slice(0,8)}`;checkpoint();
      const packet={playStyle:manifest.mode,guidance:manifest.guidance,instructions:synthesisRubric,delivery:'Return structured reviewer additions only. Include concrete comparisons across players using action names and each player’s local step references; explain whether similar or different choices support meaningful reasoning, ordinary execution, confusion, or inconclusive evidence. Preserve individual classifications. Classify storyHookValue true/false/null for every actual gameplay action and give its action name and evidence reason. The organizer preserves the original independent grades verbatim, calculates worthwhile as independent meaningful OR your supported story/hook value, averages raw counts, aggregates categorical hook labels, and renders the canonical Markdown report. Put scope caveats in limits, outside moment paragraphs. No desired score is supplied.',story:manifest.story,chapter,chapterTitle:story.chapters[chapter-1].name,records:group.map(r=>({player:r.player,record:api.graderPacket(r.session),independentGrade:r.grade}))};
      let correction;const at=Date.now();
      for(let attempt=1;attempt<=3;attempt++){
        const response=await transport.ask({assignment:meta.synthesisId,phase:'synthesis',packet:{...packet,...(correction?{correction}:{})},schema:protocol.synthesisSchema,model:manifest.synthesizerModel,effort:manifest.synthesizerEffort});
        try{synthesis=protocol.validateSynthesis(response.value,group);atomic(synthesisPath,response.raw);break;}catch(error){if(attempt===3)throw error;correction={message:error.message,rejectedReply:response.value};}
      }
      meta.elapsedMs=(meta.elapsedMs??0)+Date.now()-at;checkpoint();
    }
    const ids=new Set(group.flatMap(r=>[r.session.id,r.graderId]).concat(meta.synthesisId??[]));
    const audit=[...recovered.audit,...(transport.audit??[])].filter(a=>ids.has(a.assignment));
    const interruptions=group.flatMap(r=>r.session.requests.filter(q=>q.error).map(q=>`Player ${r.player}, step ${q.step}: ${q.error.replaceAll(/\s+/g,' ').slice(-700)}`));
    const superseded=state.superseded.filter(x=>group.some(r=>r.session.id===x.player));
    const report=protocol.renderChapter({records:group,synthesis,mode:manifest.mode,story:manifest.story,chapter,title:story.chapters[chapter-1].name,guidance:manifest.guidance,metadata:[
      ...(prepared.versionMetadata?.(group,entry,meta)??[
        `Story SHA-256: ${manifest.storyHash}. Frozen runtime SHA-256: ${manifest.runtimeHash}. Original run began: ${manifest.createdAt}.`,
        `Checkpoint resumption: ${entry.startedAt}; same run directory, player assignment IDs, frozen story/runtime/guidance, accepted responses and pending looks. Completed grades and reports were reused without rewriting. No participant received other assignments or pre-interruption criticism.`,
      ]),
      `Capacity: original ${manifest.slots} request slots; resumed with at most ${slots}, globally spaced by at least ${minIntervalMs} ms, adaptive concurrency/cooldown after HTTP 429 (at least ${cooldownMs} ms), at most ${maxAttempts} attempts per request. Every finished player immediately makes its grader eligible; third grade makes chapter synthesis eligible; final chapter save immediately assembles report.md.`,
      `Transport: HTTPS-only, isolated ephemeral CLI requests with empty working directories and credential homes, tool-free catalog, unchanged requested models/efforts. Accepted responses are schema validated and all model events audited. Known transport notices are retained separately from tool-event rejection. CLI ${manifest.cli.version}; binary SHA-256 ${manifest.cli.sha256}.`,
      `Resume implementation SHA-256: ${JSON.stringify(resumeHashes)}. Timing accumulates active run segments including queuing and retries; stopped-process downtime is excluded. Synthesis assignment: ${meta.synthesisId??'recovered completed synthesis'}; elapsed ${meta.elapsedMs??0} ms.`,
      `Transport attempts for these final assignments: ${audit.length}; failed/interrupted attempts: ${audit.filter(a=>!a.accepted).length}; 429 attempts: ${audit.filter(a=>/429|rate.limit|too many requests/i.test(a.error??'')).length}.`,
      ...interruptions.map(x=>'Preserved protocol/technical diagnostic: '+x),
      ...superseded.map(x=>`Superseded partial assessment: ${x.player}, previous grader ${x.previousGraderId??'not yet assigned'}, ${x.previousActions} actions. ${x.reason} The final-record assessment uses a fresh independent grader; the partial grade is excluded from all current counts and synthesis.`),
    ]});
    writeFileSync(join(directory,`chapter${chapter}_report.md`),report,{flag:'wx'});completed.add(chapter);assembleIfComplete();checkpoint();log({event:'chapter-reported',chapter,completedChapters:completed.size,totalChapters:manifest.chapters.length});
  }
  log({event:'resume-start',scratch,directory,mode:manifest.mode,players:records.length,completedPlayers:records.filter(r=>r.session.final).length,reusedChapterReports:[...completed],slots});
  const outcomes=await Promise.allSettled(manifest.chapters.filter(c=>!completed.has(c)).map(chapterWork));
  for(const outcome of outcomes)if(outcome.status==='rejected')failures.push(outcome.reason.stack??String(outcome.reason));
  checkpoint();for(const r of records)assert.deepEqual(api.playerOutputs(r.session).slice(0,r.baseline.length),r.baseline,'Resume altered an accepted prior response');
  const complete=completed.size===manifest.chapters.length,verification=complete?await(prepared.verifyCampaign??verifyCampaign)(scratch,{allowFixture:!!providedTransport}):null;
  entry.finishedAt=new Date().toISOString();entry.complete=complete;entry.failures=failures;checkpoint();log({event:'resume-end',complete,directory,failures:failures.length,verification:verification?.verified??false});
  return{complete,directory,scratch,failures,verification,state};
}

if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)) {
  try {
    const args=process.argv.slice(2),scratch=args.shift();assert(scratch,'Usage: node projects/creation-study/tools/resume.mjs CAMPAIGN_SCRATCH [--preflight] [--slots 4] [--min-interval-ms 2000] [--cooldown-ms 30000] [--max-attempts 8]');
    const options={},keys={'--slots':'slots','--min-interval-ms':'minIntervalMs','--cooldown-ms':'cooldownMs','--max-attempts':'maxAttempts'};let preflight=false;
    while(args.length){const key=args.shift();if(key==='--preflight'){preflight=true;continue;}assert(keys[key],`Unknown ${key}`);const n=Number(args.shift());assert(Number.isSafeInteger(n)&&n>0);options[keys[key]]=n;}
    assert((options.slots??4)<=12);assert((options.cooldownMs??30000)>=30000);assert((options.maxAttempts??8)>=6);
    const prepared=await loadResume(scratch);
    if(preflight)console.log(JSON.stringify({preflight:true,scratch:prepared.scratch,directory:prepared.manifest.directory,mode:prepared.manifest.mode,players:prepared.records.length,accepted:prepared.records.reduce((n,r)=>n+r.baseline.length,0),completedPlayers:prepared.records.filter(r=>r.session.final).length,storyHash:prepared.manifest.storyHash,runtimeHash:prepared.manifest.runtimeHash}));
    else {const result=await resumeCampaign(prepared,options);if(!result.complete)process.exitCode=1;}
  }catch(error){console.error(error.stack);process.exitCode=1;}
}
