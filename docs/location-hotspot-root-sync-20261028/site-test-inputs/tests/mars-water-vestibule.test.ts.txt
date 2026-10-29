import assert from 'node:assert/strict';
import test from 'node:test';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {mars as before} from '../experiments/tangible-campaign/ui/stories/authenticity-repairs-v2.ts';
import {scenario as creatureBefore} from '../experiments/tangible-campaign/ui/stories/mars-creature-field-scenes.ts';
import {mars,marsCreature} from '../experiments/tangible-campaign/ui/stories/mars-water-vestibule-candidates.ts';
import {withMarsWaterAndVestibule} from '../experiments/tangible-campaign/ui/stories/mars-water-vestibule.ts';
import {toLegacyScenario,toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const isPair=(a:Action,x:string,y:string)=>a.type==='combine'&&pair(a.a,a.b)===pair(x,y);
const combine=(a:string,b:string):Action=>({type:'combine',a,b});
const canonical=(s:Scenario)=>s.checkpoints!.find(c=>c.id==='complete')!.actions;
const bare=(state:M.State)=>{const {metrics,...rest}=state;return rest;};
function save(s:Scenario,g:M.Game){assert.deepEqual(M.restore(s,JSON.stringify(g)),g);const e={game:toLegacyGame(g),tops:{},seen:[]};for(const raw of [JSON.stringify(e),encodeSave(e)])assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(raw).game)),g);}
function perform(s:Scenario,g:M.Game,a:Action){const r=M.applyAction(s,g,a);assert(r.accepted,`${s.id}: ${JSON.stringify(a)}: ${r.message}`);return r.game;}
const modes=['plant-water-sprout-cover','plant-water-cover-sprout','plant-cover-water-sprout','wet-plant-sprout-cover','wet-plant-cover-sprout'] as const;
function route(s:Scenario,mode:typeof modes[number],blanketFirst=false,reverse=false,heater=false):Action[]{
 const actions=canonical(s),start=actions.findIndex(a=>isPair(a,'seeds','planting-tray')),end=actions.findIndex(a=>isPair(a,'habitat-fabric','sealant'));
 const seed:Action[]=mode.startsWith('wet')?[combine('filtered-water','seeds'),combine('wet-seeds','planting-tray')]:[combine('seeds','planting-tray')];
 if(mode==='plant-cover-water-sprout')seed.push(combine('seed-tray','clear-cover'),combine('covered-seed-tray','filtered-water'),combine('watered-covered-tray','@warm-habitat'));
 else {if(!mode.startsWith('wet'))seed.push(combine('seed-tray','filtered-water'));if(mode.endsWith('sprout-cover'))seed.push(combine('watered-seed-tray','@warm-habitat'),combine('sprouted-tray','clear-cover'));else seed.push(combine('watered-seed-tray','clear-cover'),combine('watered-covered-tray','@warm-habitat'));}
 return [...actions.slice(0,start),...seed,...actions.slice(end)].map(a=>{
  if(blanketFirst&&isPair(a,'vestibule','tie-downs'))a=combine('vestibule','insulating-blanket');
  else if(blanketFirst&&isPair(a,'anchored-vestibule','insulating-blanket'))a=combine('wrapped-vestibule','tie-downs');
  if(heater&&isPair(a,'solar-charger','@sheltered-ice'))a=combine('heater','@sheltered-ice');
  return reverse&&a.type==='combine'&&!a.b.startsWith('@')&&!s.recipes.find(r=>pair(r.a,r.b)===pair(a.a,a.b))?.at?{...a,a:a.b,b:a.a}:a;
 });
}
for(const [s,old]of [[mars,before],[marsCreature,creatureBefore]] as const){
 test(`${s.id}: pure additive patch and complete graph references`,()=>{
  const original=JSON.stringify(old);withMarsWaterAndVestibule(old,s.id+'-test');assert.equal(JSON.stringify(old),original);
  assert.equal(s.items.find(i=>i.id==='meltwater')!.label,'Dirty water');assert.equal(s.items.find(i=>i.id==='filtered-water')!.label,'Water');
  for(const dead of ['empty-canister','water-canister'])assert(!JSON.stringify({...s,notes:[]}).includes(`"${dead}"`),dead);
  assert.deepEqual(s.recipes.filter(r=>[r.a,r.b].includes('filtered-water')).map(r=>r.id).sort(),['habitat-4-watered-seed-tray','habitat-water-covered-tray','habitat-wet-seeds','waterworks-prime']);
  assert.equal(canonical(s).length,canonical(old).length-1);assert.equal(s.chapters.length,old.chapters.length);
  assert.deepEqual(s.locationPlan!.locations.map(l=>l.background),old.locationPlan!.locations.map(l=>l.background));
  const oldStock=old.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items));const stock=s.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items));assert.deepEqual(stock,oldStock.filter(i=>i!=='empty-canister'));assert(!stock.includes('wet-seeds'));assert(!stock.includes('wrapped-vestibule'));
  const legacy=toLegacyScenario(s);for(const errors of [M.validateScenario(s),validateContentLifecycles([legacy]),validateObjectiveFlow([legacy]),validateConstructionContinuity([legacy]),validateLifecycleGraph([legacy])])assert.deepEqual(errors,[]);
 });
 for(const mode of modes)for(const blanketFirst of [false,true])for(const reverse of [false,true])for(const heater of [false,true])test(`${s.id}: opening ${mode}, blanketFirst=${blanketFirst}, reverse=${reverse}, heater=${heater}`,()=>{
  let g=M.createGame(s,390),reachedHabitat=false;const actions=route(s,mode,blanketFirst,reverse,heater);
  for(let a of actions){
   if(a.type==='advance'&&s.chapters[g.state.chapter].id==='habitat')break;
   const prior=g,operands=a.type==='combine'?pair(a.a,a.b):undefined,recipe=operands?s.recipes.find(r=>pair(r.a,r.b)===operands):undefined;
   if(recipe&&s.chapters[g.state.chapter].id==='habitat'){
    assert(M.partners(s,g.state,a.type==='combine'?a.a:'').outgoing.includes(a.type==='combine'?a.b:''),'legal drag is highlighted');
    if(a.type==='combine'&&!a.b.startsWith('@'))assert(M.partners(s,g.state,a.b).outgoing.includes(a.a),'both existing directions highlighted');
    a=a.type==='combine'?{type:'drop',item:a.a,target:a.b}:a;
   }
   g=perform(s,g,a);
   if(s.chapters[g.state.chapter].id==='habitat')reachedHabitat=true;
   if(recipe&&/vestibule|wet-seeds|watered/.test(recipe.id)){
    const primary=Object.entries(recipe.lifecycle??{}).find(([,l])=>l.role==='transform')?.[0],p=primary?M.token(prior.state,primary):undefined,out=recipe.out?M.token(g.state,recipe.out):undefined;
    if(p&&out&&!recipe.b.startsWith('@'))assert.deepEqual({x:out.x,y:out.y,location:out.location,hotspot:out.hotspot},{x:p.x,y:p.y,location:p.location,hotspot:p.hotspot},'same physical object transforms in place');
    assert.deepEqual(bare(M.undo(g).game.state),bare(prior.state));save(s,g);
    const invalid=M.applyAction(s,g,a);assert.equal(invalid.accepted,false,'repeat cannot make a duplicate');assert.deepEqual(bare(invalid.game.state),bare(g.state));
   }
   assert(g.state.tokens.filter(t=>['planting-tray','seed-tray','watered-seed-tray','covered-seed-tray','watered-covered-tray','sprouted-tray','propagator'].includes(t.kind)).length<=1,'one physical tray');
   assert(g.state.tokens.filter(t=>['vestibule','anchored-vestibule','wrapped-vestibule','insulated-vestibule'].includes(t.kind)).length<=1,'one physical vestibule');
  }
  assert(reachedHabitat);assert(M.chapterComplete(s,g.state));assert.equal(g.state.chapter,1,'logical completion waits for explicit advance');
  const vest=M.token(g.state,'insulated-vestibule')!,plant=M.token(g.state,'propagator')!;
  assert.deepEqual([...vest.components!].sort(),['hatch-frame','insulating-blanket','tie-downs']);assert(vest.incorporated.includes('sealed-panel'));assert(vest.incorporated.includes('vestibule'));
  for(const absent of ['tie-downs','insulating-blanket','hatch-frame','seeds','wet-seeds','clear-cover','planting-tray','seed-tray','covered-seed-tray','watered-seed-tray','watered-covered-tray','sprouted-tray'])assert(!M.token(g.state,absent),absent+' has no duplicate remnant');
  assert.deepEqual(plant.components,['clear-cover']);assert(M.token(g.state,'filtered-water'));save(s,g);
  assert(!M.partners(s,g.state,vest.id).outgoing.includes(vest.id));assert.equal(M.applyAction(s,g,{type:'drop',item:vest.id,target:vest.id}).accepted,false);
 });
 for(const width of [320,390])for(const alternative of [false,true])test(`${s.id}: ${width}px full downstream ${alternative?'alternative':'canonical'} route`,()=>{
  let g=M.createGame(s,width),primed=false,nursery=false;
  const actions=alternative?route(s,'wet-plant-cover-sprout',true,true,true):canonical(s);
  for(const a of actions){const prior=g;g=perform(s,g,a);for(const l of g.state.locations)assert.deepEqual(M.locationFootprint(s,g.state,l.id).outOfBounds,[],`${l.id}: ${JSON.stringify(a)}`);
   if(g.events.at(-1)?.recipe==='waterworks-prime'){primed=true;assert.equal(M.token(prior.state,'filtered-water')!.location,g.state.storyLocation);assert(M.token(g.state,'filtered-water'));assert.deepEqual(M.token(g.state,'primed-water-loop')!.components,M.token(prior.state,'circulating-water-loop')!.components);save(s,g);assert.deepEqual(bare(M.undo(g).game.state),bare(prior.state));}
   if(g.events.at(-1)?.recipe==='nursery-label'){nursery=true;assert(M.token(g.state,'identified-seedlings')!.components!.includes('clear-cover'));}
  }
  assert(primed);assert(nursery);assert(g.state.completed);assert(M.token(g.state,'docked-vehicle'));if(s===marsCreature){assert(M.token(g.state,'docked-vehicle')!.components!.includes('creature-core'));assert(M.token(g.state,'docked-vehicle')!.components!.includes('core-tube'));}save(s,g);
 });
 test(`${s.id}: every checkpoint retains its chapter/completion destination and save paths`,()=>{
  for(const cp of s.checkpoints!){const g=M.checkpoint(s,cp.id,390),prior=M.checkpoint(old,cp.id,390);assert.equal(g.state.chapter,prior.state.chapter,cp.id);assert.equal(g.state.completed,prior.state.completed,cp.id);save(s,g);}
 });
}
