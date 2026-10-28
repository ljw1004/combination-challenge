import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pilot as s} from './pilot.ts';
import type {Action} from './runtime/schema/scenario.ts';
import {applyAction, capabilities, checkpoint, createGame, gold, matches, objectiveStates, playerView, replay, restore, stageComplete, token, undo, validateScenario} from './runtime/engine/model.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from './runtime/schema/lifecycle.ts';

const route:Action[]=JSON.parse(readFileSync(new URL('./route.json',import.meta.url),'utf8'));
const at=(n:number)=>replay(s,route.slice(0,n));

test('schema, explicit lifecycles, objective flow and compound rules pass',()=>{
 assert.deepEqual(validateScenario(s),[]);
 assert.deepEqual(validateContentLifecycles([s]),[]);
 assert.deepEqual(validateObjectiveFlow([s]),[]);
 assert.deepEqual(validateConstructionContinuity([s]),[]);
});

test('complete exact route and all earned checkpoints',()=>{
 const g=replay(s,route);assert(g.state.completed);assert.equal(g.state.metrics.combinations,6);
 for(const c of s.checkpoints??[])assert(checkpoint(s,c.id));
 assert.equal(checkpoint(s,'chapter-2').state.stage,1);
});

test('four independent build orders/directions yield the same first success',()=>{
 const variants:Action[][]=[
  route.slice(0,3),
  [route[1],route[0],route[2]],
  [{type:'combine',a:'hoops',b:'staves'},{type:'combine',a:'rag',b:'pitch'},{type:'combine',a:'seal-pad',b:'shell'}],
  [{type:'combine',a:'rag',b:'pitch'},{type:'combine',a:'hoops',b:'staves'},{type:'combine',a:'seal-pad',b:'shell'}],
 ];
 for(const v of variants){const g=replay(s,[...v,route[3]]);assert(stageComplete(s,g.state));}
});

test('a leaky shell is not sufficient, no early stage advance',()=>{
 let g=at(1);let r=applyAction(s,g,{type:'place',item:'shell',location:'leak'});
 assert(r.accepted);assert(!stageComplete(s,r.game.state));
 r=applyAction(s,r.game,{type:'advance'});assert(!r.accepted);
});

test('first success requires using the bucket, not merely making it',()=>{
 assert(!stageComplete(s,at(3).state));assert(stageComplete(s,at(4).state));
});

test('same created bucket—not stock or a supplied replacement—crosses chapters',()=>{
 const g=at(5);assert(token(g.state,'bucket'));assert(!s.initialItems.includes('bucket'));
 assert(!s.stages[1].caches?.some(c=>c.items.includes('bucket')));
 const transfers=g.events.at(-1)!.transfers??[];assert(transfers.some(t=>t.item==='bucket'&&t.from==='workshop'&&t.to==='spring-yard'));
 assert(!gold(s,g.state).items.includes('bucket'));
});

test('removing the earlier created bucket blocks every later production',()=>{
 let g=at(5);g.state.tokens=g.state.tokens.filter(t=>t.id!=='bucket');
 for(const a of route.slice(5,8)){const r=applyAction(s,g,a);assert(!r.accepted);g=r.game;}
 assert(!stageComplete(s,g.state));
});

test('criterion inversion is in actual capability data, not only narrative',()=>{
 const old=token(at(5).state,'bucket')!,later=token(at(6).state,'pierced-bucket')!;
 assert(capabilities(s,old).includes('holds-water'));
 assert(!capabilities(s,old).includes('through-flow-sieve'));
 assert(capabilities(s,later).includes('through-flow-sieve'));
 assert(!capabilities(s,later).includes('holds-water'));
 assert(matches(s,old,s.stages[0].objectives[0]));assert(!matches(s,later,s.stages[0].objectives[0]));
 const blank=structuredClone(s);blank.premise='';for(const st of blank.stages){st.motivation='';st.completionText='';}
 assert(!matches(blank,later,blank.stages[0].objectives[0]),'erasing explanatory words does not erase physical contrast');
});

test('transformation keeps exact location in either drag direction and no old version',()=>{
 const g=at(5),old=token(g.state,'bucket')!;
 for(const [a,b] of [['bucket','drill'],['drill','bucket']]){
  const r=applyAction(s,g,{type:'combine',a,b});assert(r.accepted);
  const changed=token(r.game.state,'pierced-bucket')!;
  assert.equal(changed.x,old.x);assert.equal(changed.y,old.y);assert.equal(changed.area,old.area);
  assert(!token(r.game.state,'bucket'));assert(token(r.game.state,'drill'));
  assert(changed.incorporated.includes('staves'));assert(changed.incorporated.includes('hoops'));
 }
});

test('intermediate goal disappears, does not gild its reagent, and stays recorded',()=>{
 let g=at(5);assert.deepEqual(playerView(s,g).objectives.map(o=>o.text),['Make a washing sieve.']);
 g=at(6);assert.deepEqual(playerView(s,g).objectives.map(o=>o.text),['Wash out the grit.']);
 assert(!gold(s,g.state).items.includes('pierced-bucket'));
 g=at(7);assert(!token(g.state,'pierced-bucket'));assert(objectiveStates(s,g.state).find(o=>o.id==='make-sieve')!.satisfied);
 assert(!stageComplete(s,g.state));
});

test('tools survive, finite ingredients disappear, and no multiple bucket versions coexist',()=>{
 const lineage=['staves','shell','bucket','pierced-bucket','loaded-bucket','washed-bucket'];
 for(let n=1;n<=route.length;n++){
  const g=at(n);assert.equal(g.state.tokens.filter(t=>lineage.includes(t.kind)).length,1,'one evolving bucket at prefix '+n);
 }
 const g=at(8);assert(token(g.state,'seal-pad'));assert(token(g.state,'drill'));assert(!token(g.state,'gravel'));
 assert(token(g.state,'washed-bucket')!.incorporated.includes('gravel'));
});

test('unfinished or wrong combinations do not award the final goal',()=>{
 let g=at(5);for(const a of [
  {type:'combine',a:'bucket',b:'@spring'},
  {type:'combine',a:'bucket',b:'seal-pad'},
  {type:'combine',a:'drill',b:'gravel'},
 ] as Action[]){const r=applyAction(s,g,a);assert(!r.accepted);assert(!stageComplete(s,r.game.state));g=r.game;}
});

test('undo restores bucket form and intermediate goal; redo is exact',()=>{
 const g=at(6),u=undo(g);assert(u.accepted);assert(token(u.game.state,'bucket'));assert(!token(u.game.state,'pierced-bucket'));
 assert.deepEqual(playerView(s,u.game).objectives.map(o=>o.text),['Make a washing sieve.']);
 const r=applyAction(s,u.game,route[5]);assert(r.accepted);assert(token(r.game.state,'pierced-bucket'));
});

test('save/restore at every prefix preserves state',()=>{
 for(let n=0;n<=route.length;n++){const g=at(n);assert.deepEqual(restore(s,JSON.stringify(g)).state,g.state);}
});

test('320, 360 and 600 widths complete the exact route',()=>{
 for(const width of [320,360,600])assert(replay(s,route,width).state.completed);
});

test('final washed object is still perforated and inappropriate for catching water',()=>{
 const g=at(8),t=token(g.state,'washed-bucket')!;assert(capabilities(s,t).includes('through-flow-sieve'));
 assert(!matches(s,t,s.stages[0].objectives[0]));assert(gold(s,g.state).items.includes('washed-bucket'));
});

test('repeated input does not clone transformations or make redundant success',()=>{
 const g=at(6),r=applyAction(s,g,route[5]);assert(!r.accepted);
 const done=replay(s,route),again=applyAction(s,done,{type:'advance'});assert(!again.accepted);
});

test('purpose and causal vocabulary never become inventory ingredients',()=>{
 assert(!s.items.some(i=>/purpose|final cause|formal cause|efficient cause|material cause/i.test(i.label)));
 assert(s.stages.slice(1).every(st=>st.carry?.includes('bucket')));
 assert(!s.items.some(i=>i.slots));
});
