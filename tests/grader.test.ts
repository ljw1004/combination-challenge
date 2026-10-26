import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createState, newRun, record, settledForecast, replay } from '../src/engine.ts';
import type { Run } from '../src/engine.ts';
import { analyzeRun, gradeFeatures, runGraderFixtures } from '../experiments/grader.ts';

test('adversarial grader fixtures reject cosmetic depth, forced chains, repair loops, luck and rhetoric',()=>{
  const fixtures=runGraderFixtures();assert.equal(fixtures.length,8);assert.ok(fixtures.every(f=>f.pass),JSON.stringify(fixtures));
});
test('eloquent but false recorded prediction remains a concrete clarity concern',()=>{
  const s=createState('confluence',4,'rooted');
  const r=record(s,newRun(s,'fixture'),{type:'wait'},{expectedEffect:'A brilliantly inventive and deeply satisfying protection of both settlements.',expectedDamage:[0,0],confidence:1});
  const result=analyzeRun(r.run);assert.equal(result.features.predictionMisses,1);assert.equal(result.cards.find(c=>c.criterion==='readable-causality')!.status,'concern');
  assert.equal(result.cards.find(c=>c.criterion==='human-enjoyment')!.status,'unknown');
});
test('settled forecast requires every actual remaining pulse to cause zero damage and records its consequences',()=>{
  let s=createState('headwaters',3,'rooted');assert.equal(settledForecast(s).settled,false);
  let r=record(s,newRun(s),{type:'discover',recipe:'grow-grove',at:{row:0,col:0}});s=r.state;let run=r.run;
  r=record(s,run,{type:'deploy',concept:'grove',at:{row:0,col:2}});s=r.state;run=r.run;
  assert.equal(settledForecast(s).settled,false,'Middle bank still takes damage, so a north-only defence is not settled.');
  r=record(s,run,{type:'deploy',concept:'grove',at:{row:1,col:0}});s=r.state;run=r.run;
  if(!settledForecast(s).settled){r=record(s,run,{type:'wait'});s=r.state;run=r.run;}
  assert.equal(settledForecast(s).settled,true);
  const remaining=settledForecast(s).pulses;const before=run.decisions.length;
  while(s.status==='playing'){r=record(s,run,{type:'wait'});s=r.state;run=r.run;}
  assert.equal(run.decisions.length-before,remaining);assert.equal(s.status,'won');assert.deepEqual(replay(run),s);
});
test('lack of measured evidence yields unknown even with high reported performance',()=>{
  assert.ok(gradeFeatures({}).every(c=>c.status==='unknown'));
});
test('late discoveries without any practical effect are reported, rather than rewarded for novelty',()=>{
  // Build a real canonical prefix: a late ingredient-only invention cannot affect any flood.
  let s=createState('headwaters',1,'rooted');let run=newRun(s);
  for(const a of [{type:'discover',recipe:'grow-grove',at:{row:0,col:0}},{type:'deploy',concept:'grove',at:{row:0,col:2}},{type:'deploy',concept:'grove',at:{row:1,col:0}}] as const){const r=record(s,run,a);s=r.state;run=r.run;}
  while(s.turn<s.waves.length-1){const r=record(s,run,{type:'wait'});s=r.state;run=r.run;}
  const r=record(s,run,{type:'discover',recipe:'fuse-glass'});
  assert.ok(analyzeRun(r.run).unusedDiscoveries.some(d=>d.id==='glass'));
});
test('replay rejects forged automatic resolution before the forecast is safe',()=>{
  const s=createState('confluence',4,'rooted');const r=record(s,newRun(s),{type:'wait'});r.run.decisions[0].input='forecast';
  assert.throws(()=>replay(r.run),/safe/);
});
test('actual solver counterexample detects solved survival despite zero waits and continuing construction',()=>{
  const run=JSON.parse(readFileSync(new URL('../results/runs/rooted-confluence-4-planner.json',import.meta.url),'utf8')) as Run;
  const report=analyzeRun(run);
  assert.equal(report.trailingWaits,0);
  assert.equal(report.earliestSafeCompletion,4);
  assert.equal(report.nonWaitActionsAfterSafeCompletion,5);
});
