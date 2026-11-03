import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFile,execFileSync} from 'node:child_process';
import {promisify} from 'node:util';
import {workshop} from './fixtures/adventure.ts';

const cwd=resolve(import.meta.dirname,'..');
function workspace() {
  const folder=mkdtempSync(join(tmpdir(),'combination-runner-test-'));
  const env={...process.env,COMBINATION_RUNS_DIR:join(folder,'runs')};
  const run=(script:string,args:string[],input='')=>execFileSync(process.execPath,[script,...args],{cwd,env,input,encoding:'utf8',stdio:['pipe','pipe','pipe']});
  return {folder,env,run};
}
const player=`let text='';for await(const chunk of process.stdin)text+=chunk;const q=JSON.parse(text);
if(typeof q.guidance!=='string')throw Error('Missing player guidance');
if(q.criteria || q.adventure.options.some(p=>'result' in p))throw Error('Output leak');
const step=q.adventure.step,reflection=q.reflectionRequired?{effect:'The result leaves the next task.',reaction:'Nothing notable.'}:{};
let reply;
if(q.request==='final-report') reply={...reflection,step,report:Object.fromEntries(['mostWorthwhile','leastWorthwhile','surprise','arbitrary','continue'].map(k=>[k,{text:'Synthetic protocol fixture only.',steps:q.history.length?[1]:[]}]))};
else if(q.adventure.options.some(o=>o.choice==='L'))reply={step,choice:'L'};
else reply={...reflection,step,reason:'Synthetic fixture.',choice:q.history.length===0&&!q.correction?999:1,expectation:'A construction.',alternatives:[]};
console.log(JSON.stringify(reply));`;
const grader=`let text='';for await(const chunk of process.stdin)text+=chunk;const q=JSON.parse(text);
if(typeof q.guidance!=='string')throw Error('Missing grader guidance');
if('model' in q || 'elapsedMs' in q || !q.verification.replayVerified)throw Error('Bad packet');
console.log(JSON.stringify({verdict:'Synthetic grader fixture.',decisions:q.turns.map(t=>({step:t.reply.step,meaningful:false,reason:'Routine fixture.'})),fun:{meaningful:0,total:q.turns.length,ratio:q.turns.length?0:null,explanation:'Fixture only.'},hook:{score:q.final?'low':null,reason:'No interest expressed.',steps:[]},strongest:{text:'No claim.',steps:[]},weakest:{text:'No claim.',steps:[]},limits:'Fixture only.'}));`;

test('numbered AI, two isolated graders, timings and frozen replay work end to end',async()=>{
  const {folder,env,run}=workspace();
  try {
    const manuscript=join(folder,'story.md'),agent=join(folder,'agent.mjs'),gradeAgent=join(folder,'grader.mjs');
    const guidance='Designed as a high-school study assistant.\nConnect ideas to concrete cases.';
    const withGuidanceCheck=(script:string)=>script.replace('const q=JSON.parse(text);',`const q=JSON.parse(text);if(q.guidance!==${JSON.stringify(guidance)})throw Error('Guidance changed');`);
    writeFileSync(manuscript,workshop);writeFileSync(agent,withGuidanceCheck(player));writeFileSync(gradeAgent,withGuidanceCheck(grader));
    const batch=run('src/playtest/run-ai.ts',['start',folder]).trim();
    assert.match(batch,/playtests\/\d{4}\.\d{2}\.\d{2}_\d{2}\.\d{2}\.\d{2}$/);
    run('src/playtest/run-ai.ts',['--guidance',guidance,'--story',manuscript,'--session','protocol','--model','protocol-fixture','--playtest',batch,'--player','1','--agent',JSON.stringify([process.execPath,agent])]);
    const session=JSON.parse(readFileSync(join(folder,'runs/protocol/session.json'),'utf8'));
    assert.equal(session.guidance,guidance);assert.equal(session.version,5);
    assert.equal(session.outcome,'completed');assert.equal(session.turns.length,3);assert.equal(session.requests.length,7);assert.equal(session.requests.filter((r:{error?:string})=>r.error).length,1);
    assert(session.elapsedMs>0);assert(session.requests.every((r:{elapsedMs:number})=>r.elapsedMs>=0));assert.equal(session.final.reaction,'Nothing notable.');
    assert.deepEqual(session.turns.map((t:{lookedAgain:boolean})=>t.lookedAgain),[false,true,true]);assert(session.turns.every((t:{reply:{choice:unknown}})=>typeof t.reply.choice==='number'));
    const outputs=JSON.parse(readFileSync(join(batch,'chapter1_playtest1.json'),'utf8'));
    assert.deepEqual(outputs,[...session.turns.map((t:{reply:object;lookedAgain:boolean})=>({...t.reply,lookedAgain:t.lookedAgain})),{...session.final,lookedAgain:false}]);
    assert.throws(()=>run('src/playtest/cli.ts',['init','collision',manuscript,'--guidance','','--playtest',batch,'--player','1']),/EEXIST/);
    assert.throws(()=>run('src/playtest/cli.ts',['init','incomplete',manuscript,'--guidance','','--player','2']),/together/);
    assert.equal(session.adventure.state.chapter,0);assert.equal(session.adventure.state.pending.length,0);
    const packet=JSON.parse(run('src/playtest/evaluate-cli.ts',['protocol','--packet']));assert.equal(packet.guidance,guidance);assert.equal(packet.verification.protocolRejections,1);assert.equal(packet.protocolIssues[0].reply.choice,999);assert(!JSON.stringify(packet).includes('protocol-fixture'));
    // Reports name the tested chapter even when the live manuscript has been edited.
    writeFileSync(manuscript,workshop.replace('## Make a case','## A later chapter title'));
    for(const model of ['grader-one','grader-two']) {
      const report=JSON.parse(run('src/playtest/evaluate-cli.ts',['protocol','--agent',JSON.stringify([process.execPath,gradeAgent]),'--model',model,'--output',`${model}.json`]));
      assert.equal(report.replayVerified,true);assert.equal(report.grade.fun.total,3);assert.equal(report.grade.fun.ratio,0);assert.equal(report.grade.hook.score,'low');assert(report.grader.elapsedMs>0);
    }
    const combined=readFileSync(join(batch,'chapter1_report.md'),'utf8');
    assert(combined.startsWith(`# Chapter 1: Make a case\n\nStory: ${manuscript}\n`));
    for(const name of ['grader-one','grader-two']) assert(combined.includes(name));
    assert(combined.includes('> Designed as a high-school study assistant.\n> Connect ideas to concrete cases.'));
    assert.equal((combined.match(/Fun: 0 \/ 3/g)||[]).length,2);
    assert.match(combined,/Look-again requests: 2; steps: 2, 3/);
    const raceAgent=join(folder,'race-grader.mjs');
    writeFileSync(raceAgent,"await new Promise(r=>setTimeout(r,300));"+grader.replace("verdict:'Synthetic grader fixture.'","verdict:process.argv[2]"));
    const races=await Promise.allSettled(['first','second'].map(label=>promisify(execFile)(process.execPath,['src/playtest/evaluate-cli.ts','protocol','--agent',JSON.stringify([process.execPath,raceAgent,label]),'--output','race-grade.json'],{cwd,env,encoding:'utf8'})));
    const won=races.find(r=>r.status==='fulfilled'),lost=races.find(r=>r.status==='rejected');
    assert(won?.status==='fulfilled');assert(lost?.status==='rejected');assert.match(String(lost.reason),/EEXIST/);
    const winner=JSON.parse(won.value.stdout).grade.verdict;
    assert.equal(JSON.parse(readFileSync(join(folder,'runs/protocol/race-grade.json'),'utf8')).grade.verdict,winner);
    assert(readFileSync(join(batch,'chapter1_report.md'),'utf8').includes(`\n${winner}\n`));
    const evaluation=join(folder,'runs/protocol/grader-one.json'), retained=readFileSync(evaluation,'utf8');
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['protocol','--verify-only'])).replayVerified,true);assert.equal(readFileSync(evaluation,'utf8'),retained);
    const ungraded=JSON.parse(run('src/playtest/evaluate-cli.ts',['protocol']));assert.equal(ungraded.grade,null);
    // Frozen instructions are part of the runtime hash, not silently live documents.
    writeFileSync(join(folder,'runs/protocol/source/docs/fun-and-evaluation.md'),'tampered');
    assert.throws(()=>run('src/playtest/evaluate-cli.ts',['protocol','--verify-only']),/Frozen runtime hash mismatch/);
  } finally {rmSync(folder,{recursive:true,force:true});}
});

test('AI session creation requires explicit guidance, preserves empty guidance and rejects later changes',()=>{
  const {folder,run}=workspace();
  try {
    const manuscript=join(folder,'story.md');writeFileSync(manuscript,workshop);
    const batch=run('src/playtest/run-ai.ts',['start',folder]).trim();
    assert.throws(()=>run('src/playtest/run-ai.ts',['--story',manuscript,'--session','missing']),/--guidance is required/);
    assert.throws(()=>run('src/playtest/cli.ts',['init','missing',manuscript,'--playtest',batch,'--player','1']),/--guidance is required/);
    assert(!existsSync(join(folder,'runs/missing')));assert(!existsSync(join(batch,'chapter1_playtest1.json')));
    assert.throws(()=>run('src/playtest/cli.ts',['init','missing',manuscript,'--guidance']),/--guidance needs a value/);
    assert.throws(()=>run('--input-type=module',['--eval',`import {createChapterSession} from './src/playtest/chapter-session.ts';createChapterSession('missing',${JSON.stringify(manuscript)});`]),/--guidance is required/);
    const opened=JSON.parse(run('src/playtest/cli.ts',['init','empty',manuscript,'--guidance','']));
    assert.equal(opened.guidance,'');
    assert.equal(JSON.parse(run('src/playtest/cli.ts',['view','empty'])).guidance,'');
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['empty','--packet'])).guidance,'');
    assert.throws(()=>run('src/playtest/cli.ts',['view','empty','--guidance','replacement']),/belongs to init/);
    const file=join(folder,'runs/empty/session.json'),saved=JSON.parse(readFileSync(file,'utf8'));
    saved.guidance='Changed after play began.';writeFileSync(file,JSON.stringify(saved));
    assert.throws(()=>run('src/playtest/cli.ts',['view','empty']),/Frozen guidance mismatch/);
    assert.throws(()=>run('src/playtest/evaluate-cli.ts',['empty','--packet']),/Frozen guidance mismatch/);
  } finally {rmSync(folder,{recursive:true,force:true});}
});

test('AI checkpoints use performed history without a recap, and budgets exclude looking again',()=>{
  const {folder,run}=workspace();
  try {
    const manuscript=join(folder,'story.md'),agent=join(folder,'agent.mjs');
    writeFileSync(manuscript,workshop);writeFileSync(agent,player);
    const opened=JSON.parse(run('src/playtest/cli.ts',['init','no-context',manuscript,'--guidance','','--chapter','2']));assert(!('storySoFar' in opened));assert.match(JSON.stringify(opened.adventure),/Sheet \+ Tool -> Case/);
    run('src/playtest/run-ai.ts',['--guidance','','--story',manuscript,'--session','later','--chapter','2','--agent',JSON.stringify([process.execPath,agent])]);
    const later=JSON.parse(readFileSync(join(folder,'runs/later/session.json'),'utf8'));assert.equal(later.turns.length,1);assert.equal(later.chapter,2);assert.equal(later.outcome,'completed');
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['later','--verify-only'])).replayVerified,true);
    run('src/playtest/run-ai.ts',['--guidance','','--story',manuscript,'--session','limited','--max-turns','1','--agent',JSON.stringify([process.execPath,agent])]);
    const limited=JSON.parse(readFileSync(join(folder,'runs/limited/session.json'),'utf8'));assert.equal(limited.outcome,'budget');assert.equal(limited.turns.length,1);assert(limited.final);assert.equal(limited.final.step,2);
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['limited','--verify-only'])).replayVerified,true);
  } finally {rmSync(folder,{recursive:true,force:true});}
});

test('human CLI refreshes on nonnumeric input without an L option, and progresses normally',()=>{
  const {folder,env,run}=workspace();
  try {
    const manuscript=join(folder,'story.md');writeFileSync(manuscript,workshop);
    const output=run('src/playtest/cli.ts',[manuscript],'999\n1\n?\nL\n1\n1\n\n1\n');
    assert.match(output,/Choose an option from the current menu/);assert.match(output,/Story completed/);
    assert(output.indexOf('All goals completed')<output.indexOf('Now address'));
    assert.equal((output.match(/What combination will you make for step number 1\?/g)||[]).length,3);
    assert.equal((output.match(/What combination will you make for step number 2\?/g)||[]).length,3);
    assert(!output.includes('Look again'));assert(!output.includes('L.'));
    assert.equal((output.match(/folded metal/g)||[]).length,1,'a refresh shows the board, not the previous wonder');
    assert(!output.includes('reason'));assert(!output.includes('storySoFar'));
    const checkpoint=run('src/playtest/cli.ts',[manuscript,'--chapter','2']);assert.match(checkpoint,/delivery van is due/);assert.match(checkpoint,/Now address/);assert.match(checkpoint,/Case\[Lid\]/);
    const npm=execFileSync('npm',['run','play',manuscript,'--chapter','2'],{cwd,env,input:'',encoding:'utf8',stdio:['pipe','pipe','pipe']});assert.match(npm,/Dispatch/);
  } finally {rmSync(folder,{recursive:true,force:true});}
});

test('manual structured responses persist only after validation',()=>{
  const {folder,run}=workspace();
  try {
    const manuscript=join(folder,'story.md');writeFileSync(manuscript,workshop);
    const batch=run('src/playtest/run-ai.ts',['start',folder]).trim(),outputs=join(batch,'chapter1_playtest1.json');
    const request=JSON.parse(run('src/playtest/cli.ts',['init','manual',manuscript,'--guidance','','--playtest',batch,'--player','1']));assert.equal(request.request,'decision');
    const file=join(folder,'runs/manual/session.json'), before=readFileSync(file,'utf8');
    assert.throws(()=>run('src/playtest/cli.ts',['respond','manual','-'],'{"step":1,"choice":99}'),/Reply must contain exactly/);assert.equal(readFileSync(file,'utf8'),before);
    const next=JSON.parse(run('src/playtest/cli.ts',['respond','manual','-'],JSON.stringify({step:1,reason:'Fixture.',choice:1,expectation:'A case.',alternatives:[]})));
    assert.equal(next.adventure.step,2);assert(!next.adventure.messages.some((m:{kind:string})=>m.kind==='board'));
    const afterAction=readFileSync(outputs,'utf8');
    const looked=JSON.parse(run('src/playtest/cli.ts',['respond','manual','-'],JSON.stringify({step:2,choice:'L'})));
    assert.equal(readFileSync(outputs,'utf8'),afterAction);assert.equal(looked.reflectionRequired,true);
    assert.deepEqual(looked.previousResult,next.adventure);
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['manual','--verify-only'])).replayVerified,true);
    assert.equal(JSON.parse(run('src/playtest/cli.ts',['view','manual'])).reflectionRequired,true);
    const second={step:2,effect:'The case is ready.',reaction:'Nothing notable.',reason:'Fit the lid.',choice:1,expectation:'A closed case.',alternatives:[]};
    run('src/playtest/cli.ts',['respond','manual','-'],JSON.stringify(second));
    assert.deepEqual(JSON.parse(readFileSync(outputs,'utf8'))[1],{...second,lookedAgain:true});
    assert.equal(JSON.parse(run('src/playtest/evaluate-cli.ts',['manual','--verify-only'])).replayVerified,true);
  } finally {rmSync(folder,{recursive:true,force:true});}
});

test('legacy frozen sessions still verify without rewriting historical evaluation',()=>{
  const {folder,run}=workspace();
  try {
    run('--input-type=module',['--eval',`import {createSession,saveSession} from './src/playtest/session.ts';const s=createSession('legacy','mars');s.outcome='stopped';s.report={criteria:{construction:{assessment:'supported',explanation:'Fixture',events:[999]}}};saveSession(s);`]);
    const report=JSON.parse(run('src/playtest/evaluate-cli.ts',['legacy']));assert.equal(report.replayVerified,true);assert.equal(report.experienceProfile.find((p:{id:string})=>p.id==='construction').assessment,'unknown');
    const file=join(folder,'runs/legacy/evaluation.json'),before=readFileSync(file,'utf8');run('src/playtest/evaluate-cli.ts',['legacy','--verify-only']);assert.equal(readFileSync(file,'utf8'),before);
  } finally {rmSync(folder,{recursive:true,force:true});}
});
