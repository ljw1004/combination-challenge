import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdtempSync,readFileSync,readdirSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename,join} from 'node:path';
import {promisify} from 'node:util';
import {appendChapterReview,createPlaytest,reservePlayer,writePlayerOutputs} from '../src/playtest/project-files.ts';
import type {ChapterReview} from '../src/playtest/project-files.ts';
import type {Grade} from '../src/playtest/grading.ts';

function fixture(t:{after:(cleanup:()=>void)=>void}) {
  const project = mkdtempSync(join(tmpdir(),'combination-playtest-files-'));
  t.after(() => rmSync(project,{recursive:true,force:true}));
  return project;
}
const start = new Date('2026-11-02T07:08:09Z');
function grade(meaningful:boolean):Grade {
  return {verdict:meaningful ? 'The discovery mattered.' : 'The choice felt routine.',
    decisions:[{step:1,meaningful,reason:meaningful ? 'A useful inference.' : 'Only one obvious choice.'}],
    fun:{meaningful:Number(meaningful),total:1,ratio:Number(meaningful),explanation:meaningful ? 'The choice tested an idea.' : 'No meaningful inference.'},
    hook:{score:meaningful ? 'high' : 'low',reason:meaningful ? 'The next question is inviting.' : 'Little curiosity remains.',steps:[1]},
    strongest:{text:'A concrete result.',steps:[1]},weakest:{text:'Limited alternatives.',steps:[1]},limits:'One synthetic player; text interface only.'};
}
function review(graderId:string,meaningful:boolean):ChapterReview {
  return {session:'player-one',story:'stories/fixture.md',graderId,model:`model-${graderId}`,grade:grade(meaningful),
    lookedAgainSteps:[2],playerElapsedMs:1200,graderElapsedMs:800,outcome:'completed'};
}

test('batch timestamps use explicit Los Angeles time, including midnight and daylight saving',t => {
  const project = fixture(t);
  assert.equal(basename(createPlaytest(project,{startedAt:start})),'2026.11.01_23.08.09');
  assert.equal(basename(createPlaytest(project,{startedAt:new Date('2026-07-02T07:00:00Z')})),'2026.07.02_00.00.00');
  assert.equal(basename(createPlaytest(project,{startedAt:start,timeZone:'UTC'})),'2026.11.02_07.08.09');
  assert.throws(() => createPlaytest(project,{startedAt:new Date(NaN)}),/valid date/);
  assert.throws(() => createPlaytest(project,{startedAt:start,timeZone:'invalid/timezone'}),RangeError);
});

test('batch and player reservations reject collisions and require existing valid directories',t => {
  const project = fixture(t),directory = createPlaytest(project,{startedAt:start}),target = {directory,player:1};
  assert.throws(() => createPlaytest(project,{startedAt:start}),{code:'EEXIST'});
  assert.throws(() => createPlaytest(join(project,'missing')),{code:'ENOENT'});
  reservePlayer(target,2);
  assert.throws(() => reservePlayer(target,2),{code:'EEXIST'});
  assert.equal(readFileSync(join(directory,'chapter2_playtest1.json'),'utf8'),'[]\n');
  for (const value of [0,-1,1.5,NaN,Infinity]) {
    assert.throws(() => reservePlayer({...target,player:value},2),/positive integer/);
    assert.throws(() => reservePlayer(target,value),/positive integer/);
  }
  assert.throws(() => reservePlayer({...target,directory:project},2),/existing playtests/);
  const invalid = join(project,'playtests','2026.02.30_12.00.00');mkdirSync(invalid);
  assert.throws(() => reservePlayer({...target,directory:invalid},2),/existing playtests/);
  const file = join(project,'file');writeFileSync(file,'');
  assert.throws(() => createPlaytest(file),/directory must already exist/);
});

test('player outputs are the exact response array and failed serialization preserves prior output',t => {
  const project = fixture(t),directory = createPlaytest(project,{startedAt:start}),target = {directory,player:2};
  assert.throws(() => writePlayerOutputs(target,3,[]),{code:'ENOENT'});
  reservePlayer(target,3);
  const outputs = [{step:1,reason:'Try the joint.',choice:1,expectation:'A frame.',alternatives:[],lookedAgain:false},{step:2,effect:'The frame is ready.',reaction:'Nothing notable.',reason:'Fit the panel.',choice:1,expectation:'An enclosure.',alternatives:[],lookedAgain:true}];
  writePlayerOutputs(target,3,outputs);
  const file = join(directory,'chapter3_playtest2.json');
  assert.deepEqual(JSON.parse(readFileSync(file,'utf8')),outputs);
  const before = readFileSync(file,'utf8'),cycle:unknown[] = [];cycle.push(cycle);
  assert.throws(() => writePlayerOutputs(target,3,cycle),/circular/i);
  assert.equal(readFileSync(file,'utf8'),before);
  assert.deepEqual(readdirSync(directory),['chapter3_playtest2.json']);
});

test('combined reviews retain independent fun, hook, evidence and classifications without duplicate entries',t => {
  const project = fixture(t),directory = createPlaytest(project,{startedAt:start}),target = {directory,player:1};
  appendChapterReview(target,2,review('first',true));
  const file = join(directory,'chapter2_report.md'),first = readFileSync(file,'utf8');
  appendChapterReview(target,2,review('second',false));
  const combined = readFileSync(file,'utf8');
  assert(combined.startsWith(first));
  assert.match(combined,/Player 1 — Grader first/);assert.match(combined,/Player 1 — Grader second/);
  assert.match(combined,/Fun: 1 \/ 1 meaningful decisions; ratio: 1/);
  assert.match(combined,/Fun: 0 \/ 1 meaningful decisions; ratio: 0/);
  assert.match(combined,/Hook: high/);assert.match(combined,/Hook: low/);
  assert.match(combined,/Step 1: \*\*meaningful\*\*/);assert.match(combined,/Step 1: \*\*not meaningful\*\*/);
  for (const value of ['The discovery mattered.','The choice felt routine.','A concrete result.','Limited alternatives.',
    'One synthetic player; text interface only.','Look-again requests: 1; steps: 2','Player elapsed: 1200 ms','Grader elapsed: 800 ms']) assert(combined.includes(value));
  assert.throws(() => appendChapterReview(target,2,review('first',false)),/already exists/);
  assert.equal(readFileSync(file,'utf8'),combined);
  const unassessed = grade(false);
  unassessed.decisions=[];unassessed.fun={meaningful:0,total:0,ratio:null,explanation:'No decisions.'};unassessed.hook={score:null,reason:'No final report.',steps:[]};
  appendChapterReview({...target,player:2},2,{session:'player-two',story:'stories/fixture.md',graderId:'first',model:'fixture',grade:unassessed,lookedAgainSteps:[]});
  const final = readFileSync(file,'utf8');assert(final.startsWith(combined));
  assert.match(final,/Player 2 — Grader first/);assert.match(final,/ratio: unknown \(no gameplay decisions\)/);assert.match(final,/Hook: unknown/);
  assert.deepEqual(readdirSync(directory),['chapter2_report.md']);
});

test('separate grader processes safely append to the same chapter review',async t => {
  const project = fixture(t),directory = createPlaytest(project,{startedAt:start}),target = {directory,player:1};
  const module = new URL('../src/playtest/project-files.ts',import.meta.url).href;
  const run = promisify(execFile),script = `import {appendChapterReview} from ${JSON.stringify(module)};appendChapterReview(JSON.parse(process.argv[1]),1,JSON.parse(process.argv[2]));`;
  await Promise.all(['a','b','c','d'].map(id => run(process.execPath,['--input-type=module','--eval',script,JSON.stringify(target),JSON.stringify(review(id,id === 'a'))])));
  const file = join(directory,'chapter1_report.md'),combined = readFileSync(file,'utf8');
  assert.equal((combined.match(/^# Chapter 1 playtest report$/gm) ?? []).length,1);
  for (const id of ['a','b','c','d']) assert.equal((combined.match(new RegExp(`^## Player 1 — Grader ${id}$`,'gm')) ?? []).length,1);
  const duplicate = await Promise.allSettled([1,2].map(() => run(process.execPath,['--input-type=module','--eval',script,JSON.stringify(target),JSON.stringify(review('same',true))])));
  assert.equal(duplicate.filter(result => result.status === 'fulfilled').length,1);
  assert.equal(duplicate.filter(result => result.status === 'rejected').length,1);
  assert.equal((readFileSync(file,'utf8').match(/^## Player 1 — Grader same$/gm) ?? []).length,1);
  assert.deepEqual(readdirSync(directory),['chapter1_report.md']);
});
