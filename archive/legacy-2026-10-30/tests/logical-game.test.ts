import test from 'node:test';
import assert from 'node:assert/strict';
import { LOGICAL_GAMES, createLogicalRun, logicalAct, replayLogical } from '../experiments/logical-games.ts';

test('abstract shape actions preserve reusable concepts and can reach a goal without handling inputs',()=>{
  const game=LOGICAL_GAMES.forms,run=createLogicalRun(game,'test','first-join',1,'mechanical test');
  const result=logicalAct(run,{type:'combine',a:'n1',b:'n2',dx:0,dy:-2},{expectedStatus:'won'});
  const observation=game.observe(result.state) as {status:string;concepts:unknown[]};
  assert.equal(observation.status,'won');assert.equal(observation.concepts.length,5);
  assert.equal(run.decisions.length,0);assert.equal(result.run.decisions.length,1);
  assert.deepEqual(replayLogical(result.run),result.state);
});

test('abstract previews expose the literal immediate result without changing a session',()=>{
  const game=LOGICAL_GAMES.forms,run=createLogicalRun(game,'test','first-join',1,'mechanical test'),state=replayLogical(run),saved=structuredClone(state);
  const preview=game.preview!(state,{type:'combine',a:'n1',b:'n2',dx:0,dy:-2}) as {status:string};
  assert.equal(preview.status,'won');assert.deepEqual(state,saved);
  assert.throws(()=>logicalAct(run,{type:'combine',a:'n1',b:'n2',dx:0,dy:0}),/overlap/);
  assert.deepEqual(replayLogical(run),saved);
});

test('logical captures reject modified actions, state hashes and public observations',()=>{
  const run=logicalAct(createLogicalRun(LOGICAL_GAMES.forms,'test','first-join',1,'mechanical test'),{type:'combine',a:'n1',b:'n2',dx:0,dy:-2}).run;
  const hash=structuredClone(run);hash.decisions[0].after='changed';assert.throws(()=>replayLogical(hash),/diverged/);
  const publicState=structuredClone(run);publicState.decisions[0].observation={status:'lost'};assert.throws(()=>replayLogical(publicState),/diverged/);
  const action=structuredClone(run);(action.decisions[0].action as {dy:number}).dy=-3;assert.throws(()=>replayLogical(action));
});

test('the laboratory reveals candidate forecasts without leaking which world was selected',()=>{
  const game=LOGICAL_GAMES.laboratory,a=game.create('pair-gates',0),b=game.create('pair-gates',1);
  assert.deepEqual(game.observe(a),game.observe(b));assert.notDeepEqual(a,b);assert.equal(game.preview,undefined);
  let run=createLogicalRun(game,'lab-test','pair-gates',0,'mechanical test');
  run=logicalAct(run,{type:'combine',a:'probe',b:'A'}).run;
  assert.equal(game.status(replayLogical(run)),'won');
  assert.throws(()=>logicalAct(run,{type:'combine',a:'unknown',b:'A'}),/already/);
});

test('logical progression reuses established conditions without rebuilding or erasing them',()=>{
  const game=LOGICAL_GAMES.progression;let run=createLogicalRun(game,'progression-test','sequence',0,'mechanical test');
  const act=(op:string,a:string,b:string)=>{
    run=logicalAct(run,{type:'combine',op,a,b}).run;
    return (game.observe(replayLogical(run)) as {active:string}).active;
  };
  const ab=act('all','A','B'),cd=act('all','C','D'),coalition=act('either',ab,cd);
  let observation=game.observe(replayLogical(run)) as {stage:number;concepts:{id:string}[];completed:unknown[]};
  assert.equal(observation.stage,2);const firstKnowledge=observation.concepts.map(c=>c.id);
  act('all',coalition,'A');observation=game.observe(replayLogical(run)) as typeof observation;
  assert.equal(observation.stage,3);assert.ok(firstKnowledge.every(id=>observation.concepts.some(c=>c.id===id)));
  const bc=act('all','B','C');act('either',coalition,bc);
  assert.equal(game.status(replayLogical(run)),'won');assert.equal(run.decisions.length,6);
  assert.equal((game.observe(replayLogical(run)) as typeof observation).completed.length,3);
});

test('a future relation discovered early satisfies its stage without compulsory recrafting',()=>{
  const game=LOGICAL_GAMES.progression;let run=createLogicalRun(game,'early-discovery','sequence',17,'mechanical test');
  const act=(op:string,a:string,b:string)=>{run=logicalAct(run,{type:'combine',op,a,b}).run;return (game.observe(replayLogical(run)) as {active:string}).active;};
  const cd=act('all','C','D'),alternative=act('either','B',cd);act('all','A',alternative);
  const ab=act('all','A','B');act('either',ab,cd);
  const observation=game.observe(replayLogical(run)) as {stage:number;completed:{atCombination:number}[]};
  assert.equal(observation.stage,3);assert.equal(observation.completed.length,2);
  assert.deepEqual(observation.completed.map(stage=>stage.atCombination),[5,5]);
});
