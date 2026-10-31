import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {s,readRoute} from './verify.ts';
import {applyAction,checkpoint,dropAction,playerView,restore,stageComplete,token,undo} from './engine/model.ts';
import type {Scenario,Action} from './schema/scenario.ts';
const v2:Scenario=JSON.parse(readFileSync(new URL('../food-v2/scenario.json',import.meta.url),'utf8'));
const portable=['filled-sponge','twinkie','banana-snack'];

test('Frozen v2 candidate, trial and evidence remain byte-identical',()=>{
 const files=JSON.parse(readFileSync(new URL('./evidence/protected-v2.json',import.meta.url),'utf8'));assert(files.length>=59);
 for(const f of files)assert.equal(createHash('sha256').update(readFileSync(f.path)).digest('hex'),f.sha256,f.path);
 assert.notEqual(s.id,v2.id);
});
test('Only the three hollow setting gates are removed; real heat and specialist lines remain',()=>{
 assert.equal(s.recipes.length,v2.recipes.length);assert.equal(s.items.length,v2.items.length);
 for(const before of v2.recipes){const expected=structuredClone(before);if(portable.includes(before.id))delete expected.at;if(before.id==='filled-sponge')expected.description='The loaded injector dispenses creme into the cooled sponge; this is a process sketch, not the branded formula.';assert.deepEqual(s.recipes.find(r=>r.id===before.id),expected);}
 assert.deepEqual(s.locations,v2.locations.filter(l=>l.id!=='filling-line'));
 assert(!s.recipes.some(r=>r.at==='filling-line'||[r.a,r.b].includes('@filling-line')));
 assert.deepEqual(s.stages.at(-1)!.locations,[]);assert.equal(s.stages.at(-1)!.area.id,v2.stages.at(-1)!.area.id);
 for(const id of ['line-oven','controlled-fruit-line','controlled-stew-line'])assert(s.locations.some(l=>l.id===id));
});
test('Old canonical/exhaustive routes change only by omitting filling-line placements',()=>{
 for(const name of ['canonical','all-recipes','reverse-ready']){
  const before:Action[]=JSON.parse(readFileSync(new URL(`../food-v2/routes/${name}.json`,import.meta.url),'utf8'));
  assert.deepEqual(readRoute(name),before.filter(a=>a.type!=='place'||a.location!=='filling-line'));
 }
 assert.equal(readRoute('canonical').filter(a=>a.type==='place').length,16);
 assert.deepEqual(s.checkpoints!.find(c=>c.id==='snack')!.actions,v2.checkpoints!.find(c=>c.id==='snack')!.actions);
});
for(const width of [320,360,600])for(const reverse of [false,true])test(`Portable filling, banana sample and wrapping work without a location @ ${width}, reversed=${reverse}`,()=>{
 let g=checkpoint(s,'snack',width);assert.equal(playerView(s,g).locations.length,0);
 const act=(a:string,b:string)=>{
  assert.equal(token(g.state,a)!.location,null);assert.equal(token(g.state,b)!.location,null);
  const before=g,first=reverse?b:a,second=reverse?a:b;
  const result=applyAction(s,g,dropAction(s,g.state,first,second));assert(result.accepted,result.message);g=result.game;
  assert.deepEqual(restore(s,JSON.stringify(g)).state,g.state);
  assert.deepEqual({...undo(g).game.state,metrics:undefined},{...before.state,metrics:undefined});
  return result;
 };
 const blocked=applyAction(s,g,dropAction(s,g.state,'golden-sponge','injector'));assert(!blocked.accepted,'The earned creme capability still matters');
 act('injector','vanilla-filling');assert.equal(token(g.state,'injector')!.slots.creme,'vanilla-filling');
 act('golden-sponge','injector');assert.equal(token(g.state,'injector')!.slots.creme,'vanilla-filling');
 act('creme-filling','banana-puree');act('golden-sponge','banana-filling');
 act('wrapper','packaging-printer');const cake=token(g.state,'filled-sponge')!;const position={x:cake.x,y:cake.y};
 act('filled-sponge','printed-wrapper');assert.deepEqual({x:token(g.state,'twinkie')!.x,y:token(g.state,'twinkie')!.y},position);
 assert(!token(g.state,'filled-sponge'));assert(!token(g.state,'printed-wrapper'));assert(stageComplete(s,g.state));
 assert.equal(g.state.metrics.placements-checkpoint(s,'snack',width).state.metrics.placements,0);
 const finished=applyAction(s,g,{type:'advance'});assert(finished.accepted);assert(finished.game.state.completed);
});
test('The fresh v2 intended combinations finish in 20 drops without rejected setting gates or repairs',()=>{
 const doc=JSON.parse(readFileSync(new URL('../food-v2/pilots/sessions/fresh_train_a.json',import.meta.url),'utf8'));
 assert.equal(doc.playerActions.length,24);assert.equal(doc.playerActions.filter((a:any)=>!a.accepted).length,2);
 let g=checkpoint(s,'cannery'),attempts=0;const tried=new Set<string>();
 for(const e of doc.interactions){if(e.command!=='drop')continue;const [a,b]=e.args;if(b==='@filling-line')continue;const key=[a,b].sort().join('|');if(tried.has(key))continue;tried.add(key);
  const r=applyAction(s,g,dropAction(s,g.state,a,b));assert(r.accepted,r.message);attempts++;g=r.game;
  if(stageComplete(s,g.state)){const next=applyAction(s,g,{type:'advance'});assert(next.accepted);g=next.game;}
 }
 assert.equal(attempts,20);assert(g.state.completed);
 assert.deepEqual(g.state.discovered,doc.game.state.discovered);assert.deepEqual(g.state.recipesUsed,doc.game.state.recipesUsed);
});
