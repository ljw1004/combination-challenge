import {archivedScenarioIds,incorporations,validateContentLifecycles,validateRecipeLifecycle,validateConstructionContinuity} from '../../schema/lifecycle.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenarios,integratedScenarios,featuredScenarioIds} from '../../ui/scenarios.ts';
import {lifecycleAudit} from '../../integration/current-lifecycle-audit.ts';
import * as M from '../../engine/model.ts';
import {fixture} from '../../engine/fixture.ts';
import type {Scenario} from '../../schema/scenario.ts';
const mars=scenarios.find(s=>s.id==='mars-cargo-revision-v2')!;
const evidence=JSON.parse(readFileSync(new URL('../../evidence/'+mars.id+'-route-evidence.json',import.meta.url),'utf8'));
const soupIndex=evidence.actionsLog.findIndex((a:any)=>a.type==='combine'&&[a.a,a.b].includes('prepared-soup'));
const prefix=evidence.actionsLog.slice(0,soupIndex);

test('real Mars soup pouch transforms once, heater survives, and soup is incorporated into flask',()=>{
 const before=M.replay(mars,prefix),pouch=structuredClone(M.token(before.state,'prepared-soup'))!,heater=structuredClone(M.token(before.state,'heater'))!;
 assert(pouch&&heater);const r=M.applyAction(mars,before,evidence.actionsLog[soupIndex]);assert(r.accepted,r.message);
 assert(!M.token(r.game.state,'prepared-soup'));const soup=M.token(r.game.state,'warm-soup')!;
 assert.deepEqual([soup.x,soup.y,soup.location],[pouch.x,pouch.y,pouch.location]);assert.deepEqual(M.token(r.game.state,'heater'),heater);
 assert(soup.incorporated.includes('prepared-soup'));
 const packed=M.applyAction(mars,r.game,{type:'combine',a:'warm-soup',b:'insulated-flask'});assert(packed.accepted,packed.message);
 assert(!M.token(packed.game.state,'warm-soup'));assert(!M.token(packed.game.state,'insulated-flask'));
 assert(M.token(packed.game.state,'soup-flask')!.incorporated.includes('prepared-soup'));
 assert.deepEqual(M.undo(r.game).game.state.tokens,before.state.tokens);
});
test('unmarked legacy soup save preserves ambiguous physical copies and progress without resetting',()=>{
 const old=structuredClone(mars);old.recipes.find(r=>r.id==='rescue-4-warm-soup')!.lifecycle=undefined;old.recipes.find(r=>r.id==='rescue-4-warm-soup')!.retire=[];
 const legacy=M.replay(old,evidence.actionsLog.slice(0,soupIndex+1));assert(M.token(legacy.state,'prepared-soup'));
 delete legacy.lifecycleVersion;const restored=M.restore(mars,JSON.stringify(legacy));assert(M.token(restored.state,'prepared-soup'),'No retrospective deletion from an unversioned historical lifecycle');assert(M.token(restored.state,'warm-soup'));assert(M.token(restored.state,'heater'));
 assert.equal(restored.state.stage,legacy.state.stage);assert.deepEqual(restored.events,legacy.events);
 assert.deepEqual(restored.state.recipesUsed,legacy.state.recipesUsed);assert.equal(restored.history.length,legacy.history.length);
 assert.deepEqual(M.restore(mars,JSON.stringify(restored)),restored);
 assert(M.token(M.undo(restored).game.state,'prepared-soup'));
 const next=M.applyAction(mars,restored,{type:'combine',a:'warm-soup',b:'insulated-flask'});assert(next.accepted,next.message);
});
test('outside supply retained at an earlier event stays after a later non-consuming use',()=>{
 const s:Scenario=structuredClone(fixture);s.initialItems=['frame','wheels','charger'];
 s.recipes=[{id:'first',a:'frame',b:'wheels',out:'ice',retire:[{item:'frame',reason:'Material enters first product'}]},
 {id:'second',a:'frame',b:'charger',out:'radio'}];
 s.stages=[{...s.stages[0],objectives:[{id:'done',text:'Make radio',kind:'create',item:'radio'}]}];
 let g=M.createGame(s);g=M.applyAction(s,g,{type:'combine',a:'frame',b:'wheels'}).game;assert(M.token(g.state,'frame'));
 const r=M.applyAction(s,g,{type:'combine',a:'frame',b:'charger'});assert(r.accepted);assert(M.token(r.game.state,'frame'));assert(!r.retired?.includes('frame'));
 assert(M.token(r.game.state,'wheels'));assert(M.token(r.game.state,'charger'));assert(!M.token(r.game.state,'ice')!.incorporated.includes('frame'));
 assert(M.token(M.undo(r.game).game.state,'frame'));
});
test('bearing map retains reusable instrument and replaces the old map, not its source photograph',()=>{
 const r=mars.recipes.find(r=>r.id==='rover-11-bearing-map')!;assert.deepEqual(incorporations(r).map(x=>x.item),['survey-map']);
 const annotation=mars.recipes.find(r=>r.id==='outcrop-8-annotated-map')!;assert.deepEqual(incorporations(annotation).map(x=>x.item),['bearing-map']);
 assert(!incorporations(mars.recipes.find(r=>r.id==='outcrop-3-ice-photograph')!).length);
});
test('every active recipe has reviewed lifecycle metadata; locations never become consumed ingredients',()=>{
 const audit=lifecycleAudit;
 const priorAudit=JSON.parse(readFileSync(new URL('./audit.json',import.meta.url),'utf8'));
 for(const row of priorAudit.recipes)assert.deepEqual(audit.recipes.find((r:any)=>r.world===row.world&&r.recipe===row.recipe),row,'Historical lifecycle rows must stay exact');
 const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
 assert.equal(audit.activeScenarios,active.length);assert.equal(audit.activeRecipes,active.reduce((n,s)=>n+s.recipes.length,0));
 assert.deepEqual(Object.keys(audit.counts),active.map(s=>s.id));
 for(const s of active)assert.equal(audit.counts[s.id].recipes,s.recipes.length,s.id);
 assert.deepEqual(featuredScenarioIds,integratedScenarios.map(s=>s.id));assert.equal(new Set(featuredScenarioIds).size,6);
 for(const prefixes of [['mars-'],['atlas-'],['elements-'],['hearth-','kitchen-caravan-'],['causation-','copy-workroom-'],['doctrine-','divinity-']])assert.equal(featuredScenarioIds.filter(id=>prefixes.some(prefix=>id.startsWith(prefix))).length,1,prefixes.join('|')+' featured focus');
 for(const id of featuredScenarioIds)assert(active.some(s=>s.id===id),id+' must be validated, never exempted');
 const expected:string[]=[];for(const s of active)for(const r of s.recipes){
  const entry=audit.recipes.find((row:any)=>row.world===s.id&&row.recipe===r.id);assert(entry,s.id+':'+r.id);
  assert.equal(entry.inputs,r.a+' + '+r.b);assert.equal(entry.incorporated,r.install?r.install.component:incorporations(r).map(x=>x.item).sort().join(', ')||'—');
  expected.push(s.id+':'+r.id);assert.deepEqual(validateRecipeLifecycle(r,true),[],s.id+':'+r.id+' needs an explicit decision');
  for(const ret of incorporations(r)){assert([r.a,r.b].includes(ret.item));assert(!ret.item.startsWith('@'));assert(ret.reason.trim());}
 }
 assert.deepEqual(audit.recipes.map((r:any)=>r.world+':'+r.recipe),expected);assert.equal(expected.length,audit.activeRecipes);
});

test('nursery continues the same protected tray rather than requiring an obsolete duplicate',()=>{
 const covers=mars.recipes.find(r=>r.id==='habitat-6-propagator')!,labels=mars.recipes.find(r=>r.id==='nursery-label')!;
 assert(incorporations(covers).some(x=>x.item==='sprouted-tray'));assert.equal(labels.a,'propagator');assert(incorporations(labels).some(x=>x.item==='propagator'));
});

test('content validator rejects unannotated inputs, highlights last-use candidates, and accepts explicit retention',()=>{
 const s=structuredClone(fixture);s.recipes=[{id:'power-radio',a:'radio',b:'charger',out:'rover'}];
 const missing=validateContentLifecycles([s]);assert(missing.some(e=>e.includes('unannotated input "radio"')));assert(missing.some(e=>e.includes('no other recipe uses')));
 s.recipes[0].lifecycle={radio:{role:'transform',reason:'The same radio gains power'},charger:{role:'incorporate',reason:'Power unit fitted inside radio'}};
 assert.deepEqual(validateContentLifecycles([s]),[]);
 s.recipes[0].lifecycle.charger={role:'retain',reason:'A reusable external charging unit'};assert.deepEqual(validateContentLifecycles([s]),[]);
 delete s.recipes[0].lifecycle.radio;assert(validateContentLifecycles([s]).some(e=>e.includes('unannotated input "radio"')));
});
test('lifecycle validation rejects duplicate transformations, wrong input names, empty reasons and conflicting legacy rules',()=>{
 const r={id:'bad',a:'radio',b:'charger',out:'rover',lifecycle:{radio:{role:'transform' as const,reason:'Radio gains power'},charger:{role:'transform' as const,reason:'Charger changes'}}};
 assert(validateRecipeLifecycle(r,true).some(e=>e.includes('at most one')));
 assert(validateRecipeLifecycle({...r,lifecycle:{unknown:{role:'retain',reason:''}}},true).some(e=>e.includes('not an object input')));
 assert(validateRecipeLifecycle({...r,lifecycle:{unknown:{role:'retain',reason:''}}},true).some(e=>e.includes('explain')));
 assert(validateRecipeLifecycle({...r,retire:[]},true).some(e=>e.includes('second retire list')));
});
test('declared transformed object determines result position regardless of drag direction or recipe operand order',()=>{
 const s=structuredClone(fixture);s.initialItems=['radio','charger'];s.items.push({id:'powered-radio',label:'Powered radio'});
 s.recipes=[{id:'power',a:'charger',b:'radio',out:'powered-radio',lifecycle:{radio:{role:'transform',reason:'The existing radio is upgraded'},charger:{role:'incorporate',reason:'The battery is fitted inside'}}}];
 s.stages=[{...s.stages[0],objectives:[{id:'done',text:'Power radio',kind:'create',item:'powered-radio'}]}];
 for(const reverse of [false,true]){const g=M.createGame(s),radio=M.token(g.state,'radio')!,charger=M.token(g.state,'charger')!;assert.notDeepEqual([radio.x,radio.y],[charger.x,charger.y]);
  const r=M.applyAction(s,g,{type:'combine',a:reverse?'radio':'charger',b:reverse?'charger':'radio'});assert(r.accepted,r.message);
  const out=M.token(r.game.state,'powered-radio')!;assert.deepEqual([out.x,out.y],[radio.x,radio.y]);assert(!M.token(r.game.state,'radio'));assert(!M.token(r.game.state,'charger'));
 }
 const light=mars.recipes.find(r=>r.id==='garden-8-powered-grow-light')!;assert.equal(light.lifecycle!['grow-light'].role,'transform');
});

test('actual grow light transforms in place without absorbing the shared power unit',()=>{
 const index=evidence.actionsLog.findIndex((a:any)=>a.type==='combine'&&[a.a,a.b].includes('grow-light'));
 assert(index>=0);const g=M.replay(mars,evidence.actionsLog.slice(0,index)),light=structuredClone(M.token(g.state,'grow-light'))!;
 const r=M.applyAction(mars,g,evidence.actionsLog[index]);assert(r.accepted,r.message);assert(!M.token(r.game.state,'grow-light'));
 const out=M.token(r.game.state,'powered-grow-light')!;assert.deepEqual([out.x,out.y,out.location],[light.x,light.y,light.location]);assert(!out.incorporated.includes('solar-charger'));assert(r.game.state.tokens.some(t=>Object.values(t.slots).includes('solar-charger')));
});

test('all authored assembly upgrades keep their fitted parts visible, including chained upgrades',()=>{
 let g=M.createGame(mars),checked=0;
 for(const action of evidence.actionsLog){
  const before=g,result=M.applyAction(mars,g,action);assert(result.accepted,result.message);g=result.game;
  const recipe=mars.recipes.find(r=>r.id===result.recipe);
  if(!recipe?.preserve?.length||!result.created)continue;
  const out=M.token(g.state,result.created)!;
  for(const kind of recipe.preserve){const source=M.token(before.state,kind);if(!source||M.token(g.state,kind))continue;const expected=[...Object.values(source.slots),...(source.components??[])];for(const k of expected)assert(out.components?.includes(k),`${recipe.id} lost ${k}`);checked++;}
  const view=M.playerView(mars,g).things.find(t=>t.id===out.id)!;
  assert(view.components.length,recipe.id+' must remain visibly compound');
  const restored=M.restore(mars,JSON.stringify(g));assert.deepEqual(M.token(restored.state,out.id)?.components,out.components);
 }
 assert.equal(checked,9);
});
test('old assembly saves recover fitted components from real history without resetting progress',()=>{
 const legacy=structuredClone(mars);legacy.recipes.forEach(r=>delete r.preserve);
 const actions=evidence.actionsLog;const index=actions.findIndex((a:any)=>a.type==='combine'&&legacy.recipes.find(r=>r.id==='depot-deliver')?.a===a.a&&legacy.recipes.find(r=>r.id==='depot-deliver')?.b===a.b);
 assert(index>=0);const old=M.replay(legacy,actions.slice(0,index+1));delete old.lifecycleVersion;const restored=M.restore(mars,JSON.stringify(old));
 const shuttle=M.token(restored.state,'depot-cargo-shuttle')!;
 assert(shuttle.components?.includes('protected-controller'));assert(shuttle.components?.includes('hauler-platform'));
 assert.equal(restored.state.stage,old.state.stage);assert.deepEqual(restored.state.metrics,old.state.metrics);assert.equal(restored.history.length,old.history.length);
});

test('build rejects compound-to-simple recipes and missing preservation later in a chain',()=>{
 assert.deepEqual(validateConstructionContinuity(scenarios),[]);
 const broken=structuredClone(mars);broken.id='active-validation-fixture';delete broken.recipes.find(r=>r.id==='homebound-9-flight-ready-vehicle')!.preserve;
 assert(validateConstructionContinuity([broken]).some(e=>e.includes('homebound-9-flight-ready-vehicle')));
});
test('large fitted assemblies arrive fully inside their new chapter',()=>{
 const g=M.checkpoint(mars,'chapter-24');
 for(const t of g.state.tokens.filter(t=>t.area===g.state.currentArea))assert(t.y-M.tokenHeight(mars,t)/2>=33.99,t.id+' protrudes above the chapter');
});
