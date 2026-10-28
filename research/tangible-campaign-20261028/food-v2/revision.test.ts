import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {s,plans,readRoute,earlyOpening,witness} from './verify.ts';
import {applyAction,checkpoint,dropAction,gold,playerView,replay,stageComplete,token} from './engine/model.ts';
import type {Scenario,Action} from './schema/scenario.ts';
const old:Scenario=JSON.parse(readFileSync(new URL('../food/scenario.json',import.meta.url),'utf8'));

test('All 125 archived v1 files, its frozen trial and its evidence remain byte-identical',()=>{
 const files=JSON.parse(readFileSync(new URL('./evidence/protected-v1.json',import.meta.url),'utf8'));assert.equal(files.length,125);
 for(const f of files)assert.equal(createHash('sha256').update(readFileSync(f.path)).digest('hex'),f.sha256,f.path);
 assert.notEqual(s.id,old.id);
});
test('The first 17 canonical chapters and the 42-step custard-through-chocolate block are unchanged',()=>{
 assert.deepEqual(s.checkpoints!.find(c=>c.id==='cannery')!.actions,old.checkpoints!.find(c=>c.id==='cannery')!.actions);
 const a=s.checkpoints!.find(c=>c.id==='custard')!.actions.length,b=s.checkpoints!.find(c=>c.id==='quickbread')!.actions.length;
 assert.equal(readRoute('canonical').slice(a,b).filter(a=>a.type==='combine').length,42);
});
test('Every remaining v1 combination retains its operands, settings, construction and input roles',()=>{
 const structural=(r:Scenario['recipes'][number])=>({a:r.a,b:r.b,out:r.out,at:r.at,install:r.install,requires:r.requires,roles:Object.fromEntries(Object.entries(r.lifecycle??{}).map(([id,l])=>[id,l.role]))});
 for(const r of s.recipes)assert.deepEqual(structural(r),structural(old.recipes.find(x=>x.id===r.id)!));
 assert.deepEqual(old.recipes.filter(r=>!s.recipes.some(x=>x.id===r.id)).map(r=>r.id),['humoral-menu','annotated-menu']);
});
test('A real sealed tin completes the cannery, travels intact, and is explicitly opened for the hungry shift',()=>{
 const start=s.checkpoints!.find(c=>c.id==='cannery')!,next=s.checkpoints!.find(c=>c.id==='precision')!;
 let g=checkpoint(s,'cannery');
 for(const a of readRoute('canonical').slice(start.actions.length,next.actions.length-1)){const r=applyAction(s,g,a);assert(r.accepted);g=r.game;}
 const tin=token(g.state,'processed-stew-tin')!;assert(tin);assert.equal(tin.area,'cannery-area');assert(stageComplete(s,g.state));assert(gold(s,g.state).items.includes(tin.id));
 assert(!token(g.state,'processed-fruit-jar'),'The fruit remains the tasting demonstration');
 const advanced=applyAction(s,g,{type:'advance'});assert(advanced.accepted);g=advanced.game;
 assert.equal(token(g.state,tin.id)!.area,'precision-area');assert(!gold(s,g.state).items.includes(tin.id));
 assert(g.events.at(-1)?.transfers?.some(t=>t.item===tin.id&&t.from==='cannery-area'&&t.to==='precision-area'));
 const opened=applyAction(s,g,dropAction(s,g.state,'opener',tin.id));assert(opened.accepted);assert.equal(opened.recipe,'opened-stew');assert(!token(opened.game.state,tin.id));assert(token(opened.game.state,'opened-stew'));
});
for(const width of [320,360,600])test(`Opening the provision early remains recoverable @ ${width}`,()=>{const r=witness(earlyOpening(),width);assert(r.completed);assert.equal(r.metrics.combinations,180);});
test('The production batch and creme, not display-cake quotas, complete the station preparation',()=>{
 const st=s.stages.find(st=>st.id==='precision')!;assert.deepEqual(st.objectives.map(o=>o.item),['canned-lunch','vanilla-filling','golden-sponge']);
 assert(st.objectives.every(o=>!o.after&&!o.intermediate));
 assert.deepEqual(plans.find((p:any)=>p.id==='precision').optionalRecipes,['buttercream','vanilla-buttercream','vanilla-sandwich','water-icing','iced-chocolate-cake']);
 const g=checkpoint(s,'snack');for(const id of ['golden-sponge','vanilla-filling']){assert.equal(token(g.state,id)!.area,g.state.currentArea);assert(g.state.recipesUsed.includes(id));}
 const completed=replay(s,readRoute('canonical'));assert(completed.state.completed);for(const id of ['vanilla-sandwich','iced-chocolate-cake'])assert(!completed.state.discovered.includes(id));
});
test('Skipped optional cheese straws remain recoverable with the existing cheese after automatic handoff',()=>{
 let g=checkpoint(s,'sauce');const cheese=token(g.state,'grated-cheese')!;assert.equal(cheese.area,g.state.currentArea);
 const back=applyAction(s,g,{type:'visit',area:'pastry-area',carry:['grated-cheese']});assert(back.accepted);g=back.game;
 for(const [a,b] of [['grated-cheese','laminated-dough'],['cheese-straw-dough','@pastry-oven']]){const r=applyAction(s,g,dropAction(s,g.state,a,b));assert(r.accepted);g=r.game;}
 assert(token(g.state,'cheese-straws'));
});
test('The frozen fresh pastry gestures still complete; continuing sauce never requires a second saucepan placement',()=>{
 const doc=JSON.parse(readFileSync(new URL('../food/fresh-pastry-v1/pilots/sessions/fresh_pastry_a.json',import.meta.url),'utf8'));
 let g=checkpoint(s,'pastry'),attempts=0;
 for(const e of doc.interactions){if(e.command!=='drop')continue;const [a,b]=e.args;if(a==='white-roux'&&b==='@saucepan')continue;const r=applyAction(s,g,dropAction(s,g.state,a,b));attempts++;g=r.game;if(r.accepted&&stageComplete(s,g.state))g=applyAction(s,g,{type:'advance'}).game;}
 assert.equal(attempts,22);assert.equal(g.state.stage,8);assert(g.state.discovered.includes('veloute'));
 for(const liquid of ['milk','broth'])for(const reverse of [false,true]){
  let g=checkpoint(s,'sauce');g=applyAction(s,g,dropAction(s,g.state,'butter','@saucepan')).game;g=applyAction(s,g,dropAction(s,g.state,'flour','butter')).game;
  assert.equal(token(g.state,'white-roux')!.location,null);const r=applyAction(s,g,dropAction(s,g.state,reverse?'white-roux':liquid,reverse?liquid:'white-roux'));assert(r.accepted);
 }
});
