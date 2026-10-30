import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pilot as s} from './pilot.ts';
import type {Action,Scenario} from '../runtime/schema/scenario.ts';
import * as M from '../runtime/engine/model.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../runtime/schema/lifecycle.ts';
const old:Scenario=JSON.parse(readFileSync(new URL('../second-probe/pilot.json',import.meta.url),'utf8'));
const oldRoutes:Record<string,Action[]>=JSON.parse(readFileSync(new URL('../second-probe/routes.json',import.meta.url),'utf8'));
const routes:Record<string,Action[]>=JSON.parse(readFileSync(new URL('./routes.json',import.meta.url),'utf8'));
const startSpec=JSON.parse(readFileSync(new URL('./third-job-checkpoint.json',import.meta.url),'utf8'));
const atGate=(name='both-pierce-crate')=>M.replay(s,oldRoutes[name]);

test('all current content/lifecycle/goal/compound contracts pass',()=>{
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateContentLifecycles([s]),[]);
 assert.deepEqual(validateConstructionContinuity([s]),[]);assert.deepEqual(validateObjectiveFlow([s]),[]);
});
test('v2 source hashes, prior recipes/stages and initial supply remain unchanged',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../second-probe/manifest.json',import.meta.url),'utf8'));
 for(const [file,expected] of Object.entries(manifest.sha256))assert.equal(createHash('sha256').update(readFileSync(new URL('../second-probe/'+file,import.meta.url))).digest('hex'),expected,file);
 assert.deepEqual(s.recipes.slice(0,old.recipes.length).map(r=>r.id==='pierce-crate'?(({preserve,...rest})=>rest)(r):r),old.recipes);
 assert.deepEqual(s.stages.slice(0,old.stages.length),old.stages);
 assert.deepEqual(s.initialItems,old.initialItems);assert.notEqual(s.id,old.id);
 assert.equal(s.recipes.length-old.recipes.length,3);assert.deepEqual(s.stages[2].caches,[]);
});
test('all five exact old completion routes now reach the third job legally',()=>{
 for(const [name,actions] of Object.entries(oldRoutes)){
  const g=M.replay(s,actions);assert.equal(g.state.stage,2,name);assert(!g.state.completed);
  assert(M.token(g.state,'sorted-gravel'));assert(M.token(g.state,'rope'));
 }
});
test('ten complete witnesses cover both solutions after every established v2 route',()=>{
 assert.equal(Object.keys(routes).length,10);
 for(const [name,actions] of Object.entries(routes))assert(M.replay(s,actions).state.completed,name);
});
test('crate reuse adds one visible tie installation, not a replacement; basket weight adds one creation',()=>{
 const baseline=atGate().state.metrics.combinations;
 const prop=M.replay(s,routes['both-pierce-crate--prop']);
 assert.equal(prop.state.metrics.combinations,baseline+1);
 assert.equal(prop.state.metrics.creations,atGate().state.metrics.creations);
 assert.equal(prop.state.metrics.installations,1);
 assert.equal(M.replay(s,routes['both-pierce-crate--weight']).state.metrics.combinations,baseline+1);
});
test('gate checkpoint contains real earned creations, never injected replacements',()=>{
 const g=M.checkpoint(s,startSpec.checkpointId);assert.deepEqual(g.state,M.replay(s,startSpec.earnedPrefix).state);
 for(const id of ['basket','pierced-crate','sorted-gravel','rope']){
  assert(M.token(g.state,id),id);assert(g.events.some(e=>e.created===id&&e.stage<2),id+' must be earned earlier');
 }
 assert(!s.initialItems.includes('stone-basket'));
});
test('empty basket and loose gravel can be placed but do not hold the gate open',()=>{
 for(const id of ['basket','sorted-gravel']){
  const g=atGate(),r=M.applyAction(s,g,M.dropAction(s,g.state,id,'@gate'));
  assert(r.accepted);assert(!M.stageComplete(s,r.game.state));assert.equal(M.playerView(s,r.game).completionText,null);
 }
});
test('both old crate forms provide secured rigid support without a new name or transformation',()=>{
 for(const [name,id] of [['crate-then-new-basket','crate'],['crate','pierced-crate']]){
  const g=atGate(name),before=M.token(g.state,id)!;let r=M.applyAction(s,g,M.dropAction(s,g.state,id,'@gate'));
  assert(r.accepted);assert(!M.stageComplete(s,r.game.state));assert.equal(r.created,undefined);
  r=M.applyAction(s,r.game,M.dropAction(s,r.game.state,'rope',id));
  assert(r.accepted);assert(M.stageComplete(s,r.game.state));assert.equal(r.created,undefined);
  const after=M.token(r.game.state,id)!;assert(before.incorporated.every(k=>after.incorporated.includes(k)));
  assert.equal(after.slots['gate-tie'],'rope');assert(M.playerView(s,r.game).things.find(t=>t.id===id)!.slots.some(sl=>sl.label==='Rope coil'));
  assert(M.capabilities(s,after).includes('rigid-prop'));
 }
});
test('weight transforms the actual earlier basket in place, preserves material, and does not duplicate it',()=>{
 const g=atGate(),basket=M.token(g.state,'basket')!,gravel=M.token(g.state,'sorted-gravel')!;
 const r=M.applyAction(s,g,M.dropAction(s,g.state,'sorted-gravel','basket'));assert(r.accepted);
 const changed=M.token(r.game.state,'stone-basket')!;
 assert(!M.token(r.game.state,'basket'));assert.equal(changed.x,basket.x);assert.equal(changed.y,basket.y);
 assert.deepEqual(M.token(r.game.state,'sorted-gravel'),gravel,'shared pile is retained, not a quantity budget');
 assert(changed.incorporated.includes('basket'));assert(changed.incorporated.includes('willow'));
 assert(M.capabilities(s,changed).includes('hanging-weight'));assert(!M.stageComplete(s,r.game.state));
});
test('a weight must be deployed; possessing it alone is not the human result',()=>{
 let g=atGate();g=M.applyAction(s,g,{type:'combine',a:'sorted-gravel',b:'basket'}).game;
 assert(!M.stageComplete(s,g.state));const r=M.applyAction(s,g,M.dropAction(s,g.state,'stone-basket','@gate'));
 assert(r.accepted);assert(M.stageComplete(s,r.game.state));
});
test('trying empty basket at gate then filling it is a legal natural recovery',()=>{
 let g=atGate();g=M.applyAction(s,g,M.dropAction(s,g.state,'basket','@gate')).game;
 assert(!M.stageComplete(s,g.state));g=M.applyAction(s,g,M.dropAction(s,g.state,'sorted-gravel','basket')).game;
 assert(M.stageComplete(s,g.state));assert.equal(M.token(g.state,'stone-basket')!.location,'gate');
});
test('the successful scene narrates an observable human action, not only a capability badge',()=>{
 for(const name of ['both-pierce-crate--prop','both-pierce-crate--weight']){
  const g=M.replay(s,routes[name]);const v=M.playerView(s,g);
  assert(v.completed);assert.match(v.completionText!,/gate stops dropping/i);
  assert.match(v.completionText!,/Two carriers walk through together/);assert.match(v.completionText!,/both hands/);
 }
});
test('removing earlier creations blocks both gate solutions; raw leftovers cannot bypass them',()=>{
 for(const name of Object.keys(oldRoutes)){
  let g=atGate(name);const earlier=new Set(g.events.flatMap(e=>e.created?[e.created]:[]));
  g.state.tokens=g.state.tokens.filter(t=>!earlier.has(t.kind));
  for(const r of s.recipes){const result=M.applyAction(s,g,{type:'combine',a:r.a,b:r.b});assert(!result.accepted,name+' '+r.id);}
  assert(!M.stageComplete(s,g.state));
 }
});
test('undo restores the earlier basket and all old goal history',()=>{
 const g=atGate(),r=M.applyAction(s,g,{type:'combine',a:'sorted-gravel',b:'basket'}),u=M.undo(r.game);
 assert(u.accepted);assert.deepEqual(u.game.state.tokens,g.state.tokens);assert(!M.token(u.game.state,'stone-basket'));
 assert(M.token(u.game.state,'sorted-gravel'));
});
test('all checkpoints and route prefixes restore; 320/360/600 widths remain legal',()=>{
 for(const c of s.checkpoints??[])assert(M.checkpoint(s,c.id));
 for(const actions of Object.values(routes)){
  for(let n=0;n<=actions.length;n++){const g=M.replay(s,actions.slice(0,n));assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}
  for(const width of [320,360,600])assert(M.replay(s,actions,width).state.completed);
 }
});
test('both property routes remain available from every one of v2’s 22 canonical terminal states',()=>{
 type Entry={game:M.Game;early:string[];usedEarlier:boolean;actions:Action[]};
 const queue:Entry[]=[{game:M.createGame(old),early:[],usedEarlier:false,actions:[]}],seen=new Set<string>(),terminals:Entry[]=[];
 while(queue.length){
  const q=queue.shift()!,g=q.game;
  const key=JSON.stringify({stage:g.state.stage,completed:g.state.completed,tokens:g.state.tokens.map(t=>[t.kind,t.area,t.location]).sort(),discovered:[...g.state.discovered].sort(),used:[...g.state.recipesUsed].sort(),early:q.early,dependency:q.usedEarlier});
  if(seen.has(key))continue;seen.add(key);if(g.state.completed){terminals.push(q);continue;}
  const local=g.state.tokens.filter(t=>t.area===g.state.currentArea),candidates:Action[]=[];
  for(let i=0;i<local.length;i++)for(let j=i+1;j<local.length;j++)candidates.push(M.dropAction(old,g.state,local[i].id,local[j].id));
  if(g.state.stage===0)for(const t of local)candidates.push(M.dropAction(old,g.state,t.id,'@quarry'));
  if(M.stageComplete(old,g.state))candidates.push({type:'advance'});
  for(const action of candidates){
   const r=M.applyAction(old,g,action);if(!r.accepted)continue;
   let early=q.early;if(g.state.stage===0&&action.type==='advance')early=[...new Set(g.events.filter(e=>e.stage===0&&e.created).map(e=>e.created!))].sort();
   const usedEarlier=q.usedEarlier||(g.state.stage===1&&action.type==='combine'&&[action.a,action.b].some(x=>early.includes(x)));
   queue.push({game:r.game,early,usedEarlier,actions:[...q.actions,action]});
  }
 }
 assert.equal(seen.size,142);assert.equal(terminals.length,22);
 const evidence:any[]=[];
 for(const [i,q] of terminals.entries())for(const solution of ['prop','weight']){
  let g=M.replay(s,q.actions);const continuation:Action[]=[];
  const act=(a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,`${i} ${solution}: ${r.message}`);g=r.game;continuation.push(a);};
  let target:string;
  if(solution==='prop'){
   target=M.token(g.state,'crate')?'crate':M.token(g.state,'pierced-crate')?'pierced-crate':'crate';
   if(!M.token(g.state,target))act(M.dropAction(s,g.state,'boards','rope'));
  }else{
   if(!M.token(g.state,'basket'))act(M.dropAction(s,g.state,'willow','rope'));
   act(M.dropAction(s,g.state,'sorted-gravel','basket'));target='stone-basket';
  }
  act(M.dropAction(s,g.state,target,'@gate'));
  if(solution==='prop')act(M.dropAction(s,g.state,'rope',target));
  assert(M.stageComplete(s,g.state));act({type:'advance'});assert(g.state.completed);
  evidence.push({priorTerminal:i+1,solution,prefix:q.actions,continuation,completed:true});
 }
 writeFileSync(new URL('./prior-terminal-coverage.json',import.meta.url),JSON.stringify({kind:'source-aware semantic-state coverage, not a player study',priorStates:seen.size,priorTerminalStates:terminals.length,gateContinuations:evidence.length,allPassed:true,scope:'Same canonical unordered item-pair/quarry-drop/advance closure used by v2. Geometry and optional travel are not exhaustively enumerated.',witnesses:evidence},null,2)+'\n');
});
