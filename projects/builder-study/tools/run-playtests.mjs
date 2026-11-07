#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync,existsSync,renameSync,rmSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {codexReply,CODEX} from './codex-adapter.mjs';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const project=join(root,'projects/builder-study');
const scratch=join(root,'runs/builder-study');
process.env.COMBINATION_RUNS_DIR=scratch;
const [{createChapterSession,needsReport,playerRequest,saveChapterSession,submitReply},
  {createPlaytest,appendChapterReview},{assemblePlaytestReport},{digest}, {loadStory}]=await Promise.all([
  import('../../../src/playtest/chapter-session.ts'),import('../../../src/playtest/project-files.ts'),
  import('../../../src/playtest/report.ts'),import('../../../src/playtest/session.ts'),import('../../../src/story/load.ts'),
]);

function options(argv) {
  const result={};
  for(let i=0;i<argv.length;i++) {
    if(['--fast','--detailed','--technical','--keep-scratch','--help'].includes(argv[i]))result[argv[i]]=true;
    else if(['--story','--chapters','--players','--concurrency','--guidance','--max-turns','--timeout-seconds','--label'].includes(argv[i])) {
      if(argv[i+1]===undefined)throw new Error(`Missing value for ${argv[i]}`);
      result[argv[i]]=argv[++i];
    } else throw new Error(`Unknown option: ${argv[i]}`);
  }
  return result;
}
function positive(value,fallback,name) {
  const n=value===undefined?fallback:Number(value);
  if(!Number.isSafeInteger(n)||n<1)throw new Error(`${name} must be a positive integer.`);
  return n;
}
function atomic(file,text) {
  const temporary=`${file}.${randomUUID()}.tmp`;
  writeFileSync(temporary,text);renameSync(temporary,file);
}
function chaptersFrom(value,total) {
  if(!value||value==='all')return Array.from({length:total},(_,i)=>i+1);
  const result=new Set();
  for(const part of value.split(',')) {
    const match=/^(\d+)(?:-(\d+))?$/.exec(part);
    if(!match)throw new Error('Chapters must be all or comma-separated numbers/ranges.');
    const first=Number(match[1]),last=Number(match[2]??first);
    if(first<1||last<first||last>total)throw new Error(`Invalid chapter range ${part}.`);
    for(let n=first;n<=last;n++)result.add(n);
  }
  return [...result].sort((a,b)=>a-b);
}
function synthesisRubric(text) {
  const start=text.indexOf('### Chapter synthesis grader\n');
  if(start<0)throw new Error('Missing chapter synthesis rubric.');
  return text.slice(start);
}
function validateSynthesis(text,mode) {
  const starts=text.match(/<!-- chapter-synthesis:start -->/g)??[];
  const ends=text.match(/<!-- chapter-synthesis:end -->/g)??[];
  if(starts.length!==1||ends.length!==1)throw new Error('Synthesis needs exactly one marker pair.');
  const [before,rest]=text.split('<!-- chapter-synthesis:start -->');
  const [block,after]=rest.split('<!-- chapter-synthesis:end -->');
  if(!before.trim()||after.trim())throw new Error('Put detailed judgments before the synthesis and nothing after it.');
  const labels=[...block.matchAll(/^(Worthwhile|Fun|Hook|Strongest moments|Weakest moments):/gm)].map(m=>m[1]);
  if(labels.join('|')!=='Worthwhile|Fun|Hook|Strongest moments|Weakest moments')throw new Error('Synthesis must contain the five categories in order.');
  if(mode==='fast'&&!/^Fun: not measured \(--fast\)/m.test(block))throw new Error('Fast Fun must be not measured.');
  for(const label of ['Strongest moments','Weakest moments'])if(!block.includes(`\n\n${label}:`))throw new Error(`Missing blank line before ${label}.`);
  if(/^# Chapter|^Story:|^Play style:/m.test(text))throw new Error('Do not repeat the immutable report header.');
}

async function main() {
  const args=options(process.argv.slice(2));
  if(args['--help']) {
    console.log('node projects/builder-study/tools/run-playtests.mjs --story PATH (--fast|--detailed) --guidance TEXT [--chapters all|1,3-5] [--players 1|3] [--concurrency 4] [--label NAME] [--technical] [--keep-scratch]');return;
  }
  if(!args['--story']||!!args['--fast']===!!args['--detailed']||typeof args['--guidance']!=='string')throw new Error('Supply --story, exactly one playstyle, and explicit --guidance (including "").');
  const mode=args['--fast']?'fast':'detailed',players=positive(args['--players'],1,'players');
  if(![1,3].includes(players))throw new Error('This experiment supports exactly one or three players per chapter.');
  const concurrency=positive(args['--concurrency'],4,'concurrency');
  const timeoutMs=positive(args['--timeout-seconds'],300,'timeout-seconds')*1000;
  const maxTurns=positive(args['--max-turns'],100,'max-turns');
  const storyPath=relative(root,resolve(args['--story']));
  const {story:original,hash:storyHash}=loadStory(storyPath);
  const chapters=chaptersFrom(args['--chapters'],original.chapters.length);
  const label=args['--label']??`${mode}-${Date.now()}`;
  if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,39}$/.test(label))throw new Error('Label must be 1–40 letters, digits, underscores or hyphens.');
  mkdirSync(scratch,{recursive:true});
  const scratchRun=join(scratch,label);
  if(existsSync(scratchRun))throw new Error('Run label already used; select a fresh label.');
  mkdirSync(scratchRun);
  const runProject=args['--technical']?scratchRun:project;
  const directory=createPlaytest(runProject);
  const guide=readFileSync(join(root,'docs/fun-and-evaluation.md'),'utf8');
  const states=new Map(),jobs=[],failures=[];
  const metadata={story:storyPath,storyHash,mode,players,concurrency,guidance:args['--guidance'],label,directory,
    playerModel:'gpt-6.1-terra',playerEffort:'medium',graderModel:'gpt-6-astra',graderEffort:'high',codex:CODEX,
    technicalOnly:!!args['--technical'],startedAt:new Date().toISOString()};
  const status=()=>atomic(join(scratchRun,'status.json'),JSON.stringify({...metadata,chapters:chapters.map(n=>({chapter:n,players:states.get(n)?.records.map(r=>({player:r.player,session:r.session.id,status:r.status,error:r.error}))})),failures},null,2)+'\n');
  console.log(JSON.stringify({event:'started',directory,scratch:scratchRun,...metadata}));
  // Freeze every assignment before any calls: subsequent source edits cannot mix versions.
  let frozenRuntimeHash;
  for(const chapter of chapters) {
    const state={chapter,title:original.chapters[chapter-1].name,records:[]};states.set(chapter,state);
    for(let player=1;player<=players;player++) {
      const id=`${label}-c${chapter}-p${player}`;
      const {session,story}=createChapterSession(id,storyPath,{chapter,playStyle:mode,guidance:args['--guidance'],
        model:'gpt-6.1-terra / medium',playtest:{directory,player}});
      if(session.storyHash!==storyHash)throw new Error('Story changed while initializing assignments; discard this round.');
      frozenRuntimeHash??=session.runtimeHash;
      if(session.runtimeHash!==frozenRuntimeHash)throw new Error('Runtime or rubric changed while initializing assignments; discard this round.');
      const record={session,story,player,status:'queued'};state.records.push(record);
      jobs.push({kind:'player',record,state});
    }
  }
  status();

  async function play(record) {
    const {session,story}=record,started=performance.now();
    record.status='playing';let correction,invalid=0;
    try {
      while(!session.final) {
        if(session.turns.length>=maxTurns&&!needsReport(session))session.outcome='budget';
        const packet={...playerRequest(session),...(correction?{correction}:{})};
        const step=session.adventure.frame.step,requestStarted=performance.now();
        let reply;
        try {reply=await codexReply(packet,{role:'player',timeoutMs});}
        catch(error) {session.requests.push({step,elapsedMs:performance.now()-requestStarted,error:error.message});throw error;}
        const timing={step,elapsedMs:performance.now()-requestStarted};
        try {submitReply(session,story,reply);session.requests.push(timing);correction=undefined;invalid=0;}
        catch(error) {
          correction=error.message;session.requests.push({...timing,error:correction,reply});
          if(++invalid>=3)throw new Error(`Three invalid replies: ${correction}`);
        }
        session.elapsedMs=performance.now()-started;saveChapterSession(session);
        console.log(JSON.stringify({event:'turn',session:session.id,step,accepted:!correction}));
      }
    } catch(error) {
      session.outcome='technical-interruption';record.error=error.message;
      if(error.message.includes('tool call'))throw error;
    } finally {session.elapsedMs=performance.now()-started;saveChapterSession(session);}
    record.status='awaiting-grade';
  }

  async function grade(record,state) {
    record.status='grading';
    const folder=join(scratch,record.session.id),session=record.session;
    const frozen=path=>import(pathToFileURL(join(folder,'source/src',path)).href);
    const [{parseStory},{runtimeHash},{verifyChapterSession},{graderPacket,validateGrade}]=await Promise.all([
      frozen('story/parser.ts'),frozen('playtest/session.ts'),frozen('playtest/chapter-session.ts'),frozen('playtest/grading.ts')]);
    const markdown=readFileSync(join(folder,'story.md'),'utf8');
    if(digest(markdown)!==session.storyHash||runtimeHash()!==session.runtimeHash)throw new Error('Frozen evidence hash mismatch.');
    verifyChapterSession(session,parseStory(markdown,{id:session.story}));
    const packet=graderPacket(session),started=performance.now();
    record.packet=packet;writeFileSync(join(folder,'grading-packet.json'),JSON.stringify(packet,null,2));
    let assessed,correction;
    for(let attempt=1;attempt<=3;attempt++) {
      const raw=await codexReply({...packet,...(correction?{correction}:{})},{role:'grader',timeoutMs});
      writeFileSync(join(folder,`grade-attempt-${attempt}.json`),JSON.stringify(raw,null,2));
      try {assessed=validateGrade(raw,session);break;}catch(error){correction=error.message;}
    }
    if(!assessed)throw new Error(`Independent grade invalid: ${correction}`);
    record.grade=assessed;record.graderElapsedMs=performance.now()-started;
    writeFileSync(join(folder,'evaluation.json'),JSON.stringify({grade:assessed,replayVerified:true,elapsedMs:record.graderElapsedMs},null,2));
    appendChapterReview(session.playtest,state.chapter,{session:session.id,story:storyPath,chapterTitle:state.title,
      graderId:'astra-high',model:'gpt-6-astra / high',grade:assessed,guidance:session.guidance,playStyle:mode,
      playerElapsedMs:session.elapsedMs,graderElapsedMs:record.graderElapsedMs,
      lookedAgainSteps:session.turns.filter(t=>t.lookedAgain).map(t=>t.reply.step),outcome:session.outcome});
    record.status='graded';
  }

  async function synthesize(state) {
    const file=join(directory,`chapter${state.chapter}_report.md`);
    const independent=readFileSync(file,'utf8');
    const meta=`\n## Run metadata\n\n- Experiment: ${label}; ${args['--technical']?'technical adapter trial only':'chapter playtest'}.\n- Story SHA-256: ${storyHash}\n- Runtime SHA-256: ${state.records[0].session.runtimeHash}\n- Guidance SHA-256: ${state.records[0].session.guidanceHash}\n- Players: gpt-6.1-terra / medium; independent graders and synthesis: gpt-6-astra / high.\n- Record count: ${players}; completed: ${state.records.filter(r=>r.session.outcome==='completed').length}.\n- Capacity: ${concurrency} concurrent CLI assignments, completion-driven player → grader → synthesis scheduling.\n- Isolation: fresh ephemeral CLI invocation per packet; only exact public history carries a player's chapter memory; user config, project instructions, skills, tools and external sources disabled. No thread resume or cross-assignment memory. This is process/context isolation, not a claim of an OS filesystem jail.\n- Timing: player total includes requests, retries and final reporting; grader timing excludes replay verification. Model latency is not human play duration.\n- Scope: ${players===1?'one-player screening, not a complete three-player synthesis':'three independent chapter players'}; chapter checkpoint tests do not establish cumulative whole-story attachment, factual authenticity, browser interaction or human enjoyment.\n`;
    const packet={instructions:synthesisRubric(guide),guidance:args['--guidance'],playStyle:mode,
      chapter:state.chapter,chapterTitle:state.title,story:storyPath,
      experimentDesign:players===1?'Explicit one-player screening design. Use only the one record, label every aggregate across 1 player, and state that cross-player comparisons are unavailable. This is not a three-player synthesis.':'Three independent players, one fresh grader each.',
      delivery:'The organizer preserves every independent assessment and exact run metadata as an immutable report prefix. Return only your additions in the report field: attributed per-player worthwhile action breakdowns and counts, comparisons (or their absence), evidence limits, then the final Chapter synthesis section with the exact required markers and five categories. Do not repeat the overall chapter title, Story line or Play style line. Your additions complete the required chapter report. Keep the independent meaningfulness classifications unchanged. Cite the actual action and local step for every worthwhile/story-value judgment.',
      immutableReportPrefix:independent+meta,
      records:state.records.map(r=>({player:r.player,publicRecord:r.packet,independentGrade:r.grade}))};
    writeFileSync(join(scratchRun,`chapter${state.chapter}-synthesis-packet.json`),JSON.stringify(packet,null,2));
    const started=performance.now();let report,correction;
    for(let attempt=1;attempt<=3;attempt++) {
      const response=await codexReply({...packet,...(correction?{correction}:{})},{role:'synthesis',timeoutMs});
      writeFileSync(join(scratchRun,`chapter${state.chapter}-synthesis-${attempt}.json`),JSON.stringify(response,null,2));
      try {validateSynthesis(response.report,mode);report=response.report;break;}catch(error){correction=error.message;}
    }
    if(!report)throw new Error(`Invalid synthesis: ${correction}`);
    atomic(file,independent+meta+`- Synthesis elapsed: ${Math.round(performance.now()-started)} ms.\n\n`+report.trim()+'\n');
    state.complete=true;
    console.log(JSON.stringify({event:'chapter-complete',chapter:state.chapter,file}));
    // This callback runs immediately after the final chapter report is saved.
    if(chapters.every(n=>states.get(n).complete)) {
      const result=assemblePlaytestReport(directory,join(scratch,state.records[0].session.id,'source/docs/fun-and-evaluation.md'));
      console.log(JSON.stringify({event:'report-assembled',file:result}));
    }
  }

  await new Promise(resolveQueue=>{
    let active=0;
    const dispatch=()=>{
      while(active<concurrency&&jobs.length) {
        const job=jobs.shift();active++;
        const task=job.kind==='player'?play(job.record):job.kind==='grader'?grade(job.record,job.state):synthesize(job.state);
        console.log(JSON.stringify({event:'assignment-started',kind:job.kind,chapter:job.state.chapter,...(job.record?{player:job.record.player}:{})}));
        status();
        task.then(()=>{
          if(job.kind==='player')jobs.unshift({kind:'grader',record:job.record,state:job.state});
          if(job.kind==='grader'&&job.state.records.every(r=>r.status==='graded')&&!job.state.synthesisQueued) {
            job.state.synthesisQueued=true;jobs.unshift({kind:'synthesis',state:job.state});
          }
        }).catch(error=>{
          const failure={kind:job.kind,chapter:job.state.chapter,...(job.record?{player:job.record.player}:{}),error:error.message};
          failures.push(failure);if(job.record){job.record.status='failed';job.record.error=error.message;}
          console.error(JSON.stringify({event:'failed',...failure}));
        }).finally(()=>{active--;status();dispatch();});
      }
      if(!active&&!jobs.length)resolveQueue();
    };dispatch();
  });
  if(failures.length)throw new Error(`${failures.length} assignment(s) failed; partial outputs and scratch retained at ${scratchRun}.`);
  const records=[...states.values()].flatMap(state=>state.records);
  console.log(JSON.stringify({event:'completed',directory,technicalOnly:!!args['--technical'],
    completedPlayers:records.filter(r=>r.session.outcome==='completed').length,totalPlayers:records.length,
    interruptedPlayers:records.filter(r=>r.session.outcome==='technical-interruption').length}));
  if(!args['--keep-scratch']) {
    for(const state of states.values())for(const record of state.records)rmSync(join(scratch,record.session.id),{recursive:true,force:true});
    rmSync(scratchRun,{recursive:true,force:true});
  }
}

try {await main();}catch(error){console.error(error.stack??error.message);process.exitCode=1;}
