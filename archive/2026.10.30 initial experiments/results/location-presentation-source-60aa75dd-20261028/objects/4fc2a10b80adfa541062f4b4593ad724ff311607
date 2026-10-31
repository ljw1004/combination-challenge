import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {predecessorScenarios} from '../experiments/tangible-campaign/ui/campaigns/predecessors-20261028.ts';
const s=predecessorScenarios.find(s=>s.id==='causation-fitting-forms-probe-v2')!;
import type {Action} from '../experiments/tangible-campaign/schema/scenario.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';

const routes:Record<string,Action[]>=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/integration-20261028/sources/causation/second-probe/routes.json',import.meta.url),'utf8'));
const R=(key:string,n?:number)=>M.replay(s,n===undefined?routes[key]:routes[key].slice(0,n));

test('schema and all authoring contracts pass',()=>{
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateContentLifecycles([s]),[]);
 assert.deepEqual(validateObjectiveFlow([s]),[]);assert.deepEqual(validateConstructionContinuity([s]),[]);
});
test('five materially different route witnesses complete',()=>{
 for(const [name,route] of Object.entries(routes)){const g=M.replay(s,route);assert(g.state.completed,name);}
 assert.equal(R('basket').state.metrics.combinations,3);assert.equal(R('crate').state.metrics.combinations,4);
});
test('both initial forms satisfy the same end without a quota',()=>{
 for(const name of ['basket','crate']){
  const g=R(name,3);assert(M.stageComplete(s,g.state));
  assert.equal(g.state.tokens.filter(t=>['crate','basket'].includes(t.kind)).length,1);
 }
});
test('making both is allowed and either can be supplied',()=>{
 for(const name of ['both-keep-crate','both-pierce-crate'])assert(M.stageComplete(s,R(name,4).state));
});
test('basket needs no alteration and remains the same physical basket after sifting',()=>{
 const before=R('basket',4),after=R('basket',5);
 assert.deepEqual(M.token(before.state,'basket'),M.token(after.state,'basket'));
 assert(!after.state.discovered.includes('pierced-crate'));assert(M.token(after.state,'drill'));
});
test('changed need alone does not alter the closed crate',()=>{
 const before=M.token(R('crate',3).state,'crate')!,after=M.token(R('crate',4).state,'crate')!;
 assert.deepEqual(before.slots,after.slots);assert.deepEqual(before.incorporated,after.incorporated);
 assert(M.capabilities(s,after).includes('retains-fine-sand'));
 assert(!M.capabilities(s,after).includes('gravel-sieve'));
});
test('closed crate does not sift sand just because it was a successful carrier',()=>{
 const g=R('crate',4),a=M.dropAction(s,g.state,'rough-gravel','crate');
 const r=M.applyAction(s,g,a);assert(!r.accepted);assert(!M.stageComplete(s,r.game.state));
});
test('perforating crate physically removes its fine-sand-retention property',()=>{
 const before=R('crate',4),after=R('crate',5),old=M.token(before.state,'crate')!,changed=M.token(after.state,'pierced-crate')!;
 assert(!M.token(after.state,'crate'));assert(changed.incorporated.includes('boards'));
 assert.equal(changed.x,old.x);assert.equal(changed.y,old.y);assert.equal(changed.area,old.area);
 assert(M.capabilities(s,changed).includes('gravel-sieve'));assert(!M.capabilities(s,changed).includes('retains-fine-sand'));
 assert(M.token(after.state,'drill'));
});
test('using the basket instead preserves an available closed crate',()=>{
 const g=R('both-keep-crate');assert(M.token(g.state,'crate'));assert(!M.token(g.state,'pierced-crate'));
 assert(M.capabilities(s,M.token(g.state,'crate')!).includes('retains-fine-sand'));
});
test('new alternative in second scene requires the earlier-created rope',()=>{
 const g=R('crate-then-new-basket',4);assert(g.events.some(e=>e.created==='rope'&&e.stage===0));
 const r=M.applyAction(s,g,routes['crate-then-new-basket'][4]);assert(r.accepted);
 const missing=structuredClone(g);missing.state.tokens=missing.state.tokens.filter(t=>t.id!=='rope');
 assert(!M.applyAction(s,missing,routes['crate-then-new-basket'][4]).accepted);
});
test('removing every earlier creation blocks second chapter, despite supplies',()=>{
 for(const name of ['basket','crate']){
  let g=R(name,4);const old=new Set(g.events.flatMap(e=>e.created?[e.created]:[]));
  g.state.tokens=g.state.tokens.filter(t=>!old.has(t.kind));
  for(const a of routes[name].slice(4)){const r=M.applyAction(s,g,a);assert(!r.accepted);g=r.game;}
  assert(!M.stageComplete(s,g.state));
 }
});
test('second scene grants no ready-made carrier, rope or sieve',()=>{
 const granted=s.stages[1].caches!.flatMap(c=>c.items);
 assert.deepEqual(granted,['rough-gravel','drill']);
 for(const kind of ['rope','crate','basket','pierced-crate'])assert(!s.initialItems.includes(kind));
});
test('single-output alternatives consume the finite gravel once without cloning it',()=>{
 const g=R('both-pierce-crate',6);const first=M.applyAction(s,g,{type:'combine',a:'rough-gravel',b:'basket'});
 assert(first.accepted);assert(!M.token(first.game.state,'rough-gravel'));
 const again=M.applyAction(s,first.game,{type:'combine',a:'rough-gravel',b:'pierced-crate'});assert(!again.accepted);
 assert.equal(first.game.state.tokens.filter(t=>t.kind==='sorted-gravel').length,1);
});
test('DROP uses existing browser resolver for both combination and place',()=>{
 let g=M.createGame(s);assert.deepEqual(M.dropAction(s,g.state,'fiber','twister'),{type:'combine',a:'fiber',b:'twister'});
 g=R('basket',2);assert.deepEqual(M.dropAction(s,g.state,'basket','@quarry'),{type:'place',item:'basket',location:'quarry'});
 assert(M.applyAction(s,g,M.dropAction(s,g.state,'basket','@quarry')).accepted);
});
test('reverse drag directions preserve transformations and useful tools',()=>{
 const g=R('crate',4),r=M.applyAction(s,g,{type:'combine',a:'drill',b:'crate'});assert(r.accepted);
 assert(!M.token(r.game.state,'crate'));assert(M.token(r.game.state,'drill'));
 const route=routes.basket.map(a=>a.type==='combine'?{...a,a:a.b,b:a.a}:a);
 assert(M.replay(s,route).state.completed);
});
test('undo restores closed crate and its ability; replay is legal',()=>{
 const g=R('crate',5),u=M.undo(g);assert(u.accepted);assert(M.token(u.game.state,'crate'));assert(!M.token(u.game.state,'pierced-crate'));
 assert(M.capabilities(s,M.token(u.game.state,'crate')!).includes('retains-fine-sand'));
 assert(M.applyAction(s,u.game,routes.crate[4]).accepted);
});
test('all witnesses restore at every prefix and complete at three board widths',()=>{
 for(const actions of Object.values(routes)){
  for(let n=0;n<=actions.length;n++){const g=M.replay(s,actions.slice(0,n));assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}
  for(const width of [320,360,600])assert(M.replay(s,actions,width).state.completed);
 }
});
test('all earned candidate checkpoints replay',()=>{for(const c of s.checkpoints??[])assert(M.checkpoint(s,c.id));});

// Semantic-state search: no hint access, no injected items, no geometry/history claims.
test('every reachable successful logical path uses an earlier creation in chapter two',()=>{
 type Entry={game:M.Game;early:string[];usedEarlier:boolean;actions:Action[]};
 const queue:Entry[]=[{game:M.createGame(s),early:[],usedEarlier:false,actions:[]}],seen=new Set<string>();
 let terminals=0,states=0,maxVisible=0;
 while(queue.length){
  const q=queue.shift()!,g=q.game;
  const key=JSON.stringify({stage:g.state.stage,completed:g.state.completed,tokens:g.state.tokens.map(t=>[t.kind,t.area,t.location]).sort(),discovered:[...g.state.discovered].sort(),used:[...g.state.recipesUsed].sort(),early:q.early,dependency:q.usedEarlier});
  if(seen.has(key))continue;seen.add(key);states++;maxVisible=Math.max(maxVisible,M.playerView(s,g).things.length);
  if(g.state.completed){terminals++;assert(q.usedEarlier,JSON.stringify(q.actions));continue;}
  const local=g.state.tokens.filter(t=>t.area===g.state.currentArea);
  const candidates:Action[]=[];
  for(let i=0;i<local.length;i++)for(let j=i+1;j<local.length;j++)candidates.push(M.dropAction(s,g.state,local[i].id,local[j].id));
  if(g.state.stage===0)for(const t of local)candidates.push(M.dropAction(s,g.state,t.id,'@quarry'));
  if(M.stageComplete(s,g.state))candidates.push({type:'advance'});
  for(const action of candidates){
   const r=M.applyAction(s,g,action);if(!r.accepted)continue;
   let early=q.early;if(g.state.stage===0&&action.type==='advance')early=[...new Set(g.events.filter(e=>e.stage===0&&e.created).map(e=>e.created!))].sort();
   const usedEarlier=q.usedEarlier||(g.state.stage===1&&action.type==='combine'&&[action.a,action.b].some(x=>early.includes(x)));
   queue.push({game:r.game,early,usedEarlier,actions:[...q.actions,action]});
  }
 }
 assert.equal(states,142);assert.equal(terminals,22);
});
