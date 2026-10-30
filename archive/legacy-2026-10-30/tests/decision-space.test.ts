import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDecision, dominates, repetitionFinding } from '../experiments/decision-space.ts';
import type { DecisionDomain } from '../experiments/decision-space.ts';
function domain(graph:Record<string,Record<string,string>>,values:Record<string,[number,number]>):DecisionDomain {
  return {actions:state=>Object.keys(graph[state as string]??{}),step:(state,action)=>graph[state as string][action as string],key:String,
    terminal:state=>!graph[state as string],ending:state=>({key:String(state),feasible:true,objectives:[{id:'freedom',value:values[state as string][0],direction:'max'},{id:'coordination',value:values[state as string][1],direction:'max'}],meaning:state})};
}
test('cosmetic action names with one continuation do not create consequential alternatives',()=>{
  const evidence=analyzeDecision(domain({start:{red:'end',blue:'end'}},{end:[1,1]}),'start');
  assert.equal(evidence.distinctImmediateEffects,1);assert.equal(evidence.nondominatedEndings.length,1);assert.equal(evidence.sameFeasibleFutures,true);
});
test('a later harmless accumulation defeats an apparent immediate tradeoff',()=>{
  const evidence=analyzeDecision(domain({start:{left:'a',right:'b'},a:{learnOther:'both'},b:{learnOther:'both'}},{both:[2,2]}),'start');
  assert.equal(evidence.distinctImmediateEffects,2);assert.equal(evidence.nondominatedEndings.length,1);assert.equal(evidence.sameFeasibleFutures,true);
});
test('real incompatible endings remain distinct without a weighted best score',()=>{
  const evidence=analyzeDecision(domain({start:{bind:'union',separate:'independent'}},{union:[1,3],independent:[3,1]}),'start');
  assert.equal(evidence.nondominatedEndings.length,2);assert.equal(evidence.sameFeasibleFutures,false);
});
test('bounded enumeration never claims complete feasibility evidence',()=>{
  const evidence=analyzeDecision(domain({start:{a:'one'},one:{b:'two'},two:{c:'end'}},{end:[1,1]}),'start',1);
  assert.equal(evidence.complete,false);assert.equal(evidence.feasibleEndings.length,0);
});
test('dominance compares declared directions and matching dimensions only',()=>{
  assert.equal(dominates([{id:'harm',value:0,direction:'min'}],[{id:'harm',value:2,direction:'min'}]),true);
  assert.equal(dominates([{id:'harm',value:0,direction:'min'}],[{id:'beauty',value:2,direction:'min'}]),false);
});
test('mastered execution and reported ritual are not automatically burden',()=>{
  assert.equal(repetitionFinding('valued',false).report,'valued');assert.match(repetitionFinding('valued',false).conclusion,/preserve/);
  assert.equal(repetitionFinding(undefined,false).report,'unknown');assert.match(repetitionFinding('unwanted',true).conclusion,/burden/);
});
