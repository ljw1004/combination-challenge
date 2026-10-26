import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createState,apply,preview,offers,RECIPES,solved,goals,personalAuthority,gardenAuthority} from '../experiments/logical-ideas-history-futures.ts';
import type {State} from '../experiments/logical-ideas-history-futures.ts';
const step=(s:State,a:string,b:string)=>{const p=preview(s,{a,b}),r=apply(s,{a,b});assert.deepEqual(p,r);assert(p.accepted,p.reason);return p.state;};
function fullShelf(){let s=createState();for(const r of RECIPES)if(!s.things.some(t=>t.id===r.id))s=step(s,r.a,r.b);for(const mode of ['individual','joint']){s=step(s,'compact',`${mode}-authority`);for(const scope of ['garden','personal','all'])s=step(s,`template-${mode}`,`${scope}-scope`);}for(const scope of ['garden','personal','all'])s=step(s,'release-mandate',`${scope}-scope`);return step(s,'promise-constellations','garden-promise');}
const key=(s:State)=>JSON.stringify([s.world.identity,s.world.authorities,s.world.keeper,s.world.memoriesShared,s.world.merged]);
function compactState(s:State){return {key:key(s),goals:goals(s),keeper:s.world.keeper,expedition:s.world.expedition,survey:s.world.actors.mara.survey,revision:s.world.gardenRevision};}
test('complete reachable institutional graph: actor policies, bidirectional previews, legal alternatives, and universal scoped repair',()=>{
 const seed=fullShelf(),queue=[seed],seen=new Set([key(seed)]);let transitions=0,refusals=0;const results=[];
 for(let cursor=0;cursor<queue.length;cursor++){
  const s=queue[cursor],before=structuredClone(s),w=s.world;
  assert.equal(w.gate,'open');assert(['mara','ibis'].includes(w.keeper));assert.equal(w.actors[w.keeper].task,'keeping the garden accessible');
  assert.equal(w.actors.mara.survey,personalAuthority(w)?'individual refusal':'joint acceptance');assert.equal(w.actors.lio.survey,w.actors.mara.survey);
  assert.equal(w.gardenRevision,w.memoriesShared?(gardenAuthority(w)?'accepted':'waiting for authorized voice'):'waiting for shared knowledge');
  for(const o of offers(s)){
   const p=preview(s,{a:o.a,b:o.b}),r=apply(s,{a:o.a,b:o.b}),reverse=preview(s,{a:o.b,b:o.a});
   assert.deepEqual(p,r);assert.equal(p.accepted,reverse.accepted);assert.deepEqual(p.state.world,reverse.state.world);assert.deepEqual(o.responses,p.responses);assert.deepEqual(o.goals,p.goals);
   if(!p.accepted){refusals++;assert.deepEqual(p.state,s);continue;}
   transitions++;const k=key(p.state);if(!seen.has(k)){seen.add(k);queue.push(p.state);}
  }
  assert.deepEqual(s,before);
  let repaired=s;for(const a of ['reunion','covenant-individual-personal','covenant-joint-garden'])repaired=apply(repaired,{a,b:'family'}).state;
  assert(solved(repaired));results.push({...compactState(s),repairCombines:repaired.moves-s.moves});
 }
 writeFileSync('results/ideas-history-futures-review/state-graph.json',JSON.stringify({sourceHash:createHash('sha256').update(readFileSync('experiments/logical-ideas-history-futures.ts')).digest('hex'),access:'white-box exhaustive reachable institutional graph with all reusable shelf capabilities already materialized; not fresh play',preparationCombines:seed.moves,states:queue.length,acceptedTransitions:transitions,refusedOrRedundantContacts:refusals,universalRepair:['reunion + family','covenant-individual-personal + family','covenant-joint-garden + family'],results},null,2)+'\n');
});
test('short successful route really has two world-changing adoption combines, and does not revise the promise object',()=>{
 let s=createState();const oldPromise=structuredClone(s.things.find(t=>t.id==='garden-promise'));const changed=[];
 for(const [a,b] of [['consent','federalism'],['compact','individual-authority'],['template-individual','personal-scope'],['covenant-individual-personal','family'],['memory-sharing','restoration'],['reunion','family']]){
  const before=structuredClone(s.world);s=step(s,a,b);const after=structuredClone(s.world);before.events=[];after.events=[];if(JSON.stringify(before)!==JSON.stringify(after))changed.push([a,b]);
 }
 assert(solved(s));assert.equal(changed.length,2);assert.deepEqual(s.things.find(t=>t.id==='garden-promise'),oldPromise);
});
test('accepted garden revision and expedition participation are recomputed current projections, not durable completed acts',()=>{
 let s=fullShelf();s=step(s,'reunion','family');s=step(s,'covenant-individual-personal','family');assert(solved(s));
 s=step(s,'covenant-individual-garden','family');assert.equal(s.world.gardenRevision,'waiting for authorized voice');assert.equal(s.world.actors.lio.task,'joined the expedition');
 s=step(s,'covenant-joint-personal','family');assert.equal(s.world.actors.lio.task,'at home');assert.equal(s.world.actors.lio.survey,'joint acceptance');
});
