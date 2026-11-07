// Focused legal replay checks. Run from the repository root; output is a concise outcome.
// These checks use the shared engine/planner and do not certify artwork or exhaustive state coverage.
import assert from 'node:assert/strict';
import {loadStory} from '../../../../../../src/story/load.ts';
import {checkpoint} from '../../../../../../src/debug/checkpoint.ts';
import {act, chapterComplete, newGame, recipeFor, replay} from '../../../../../../src/engine/game.ts';
import {isFixed, presentHotspots} from '../../../../../../src/engine/fixed-items.ts';
import {lintStory} from '../../../../../../src/lint/lint.ts';
import {lintStoryImages} from '../../../../../../src/lint/images.ts';
import type {Action, State} from '../../../../../../src/engine/types.ts';

const {story, markdown}=loadStory('projects/mars-study/mars-v12/mars.md');
const fast=[...lintStory(story,{analysis:false}),...lintStoryImages(story,markdown)];
assert.deepEqual(fast.filter(d=>d.severity==='error'),[],'fast semantic/image errors');
const key=(s:string)=>'id:'+s;
const live=(s:State,i:string)=>s.tokens[key(i)]?.status==='available';
function tidy(s:State){while(s.pending.length)s=act(story,s,{type:'dismiss'});return s;}
function count(s:State){for(const n of s.visited)assert(presentHotspots(story,s,n).length<=3,'more than three targets in '+story.chapters[n].name);return s;}
function apply(s:State,a:Extract<Action,{type:'combine'}>,expected?:string){
  s=tidy(s);assert(recipeFor(story,s,a),'unavailable '+JSON.stringify(a));s=count(tidy(act(story,s,a)));
  if(expected)assert(live(s,expected),'missing '+expected);return s;
}
const h=(s:State,a:string,t:string,e?:string)=>apply(s,{type:'combine',a:key(a),hotspot:key(t),chapter:s.chapter},e);
const b=(s:State,a:string,t:string,e?:string)=>apply(s,{type:'combine',a:key(a),b:key(t)},e);
function no(s:State,a:string,t:string,fixed=true){assert(!recipeFor(story,s,{type:'combine',a:key(a),...(fixed?{hotspot:key(t),chapter:s.chapter}:{b:key(t)})}),'premature '+a+' → '+t);}
function permutations<T>(xs:T[]):T[][]{return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];}

// One legal full route supplies actual arrival states. No synthesized token injection.
const full=checkpoint(story,story.chapters.length);
assert(full.completed,'full route');
const arrivals=new Map<string,State>();
let witness=newGame(story);arrivals.set(story.chapters[0].name,structuredClone(witness));
for(const action of full.actions){const before=witness.chapter;witness=count(act(story,witness,action));if(witness.chapter!==before)arrivals.set(story.chapters[witness.chapter].name,structuredClone(witness));}
assert.deepEqual(witness,full,'full replay');
function start(name:string){const s=arrivals.get(name);assert(s,'missing chapter '+name);return tidy(structuredClone(s));}
let branches=0;
const groups:Record<string,number>={};
function finish(s:State,group:string){
  assert(chapterComplete(story,s),group+' unfinished');
  const ending=checkpoint(story,story.chapters.length,tidy(s));
  assert(ending.completed,group+' continuation');
  assert.deepEqual(replay(story,ending.actions),ending,group+' replay');
  branches++;groups[group]=(groups[group]??0)+1;
}

for(const order of permutations(['habitat','lander'])){
  let s=start('Crash landing');
  for(const task of order)if(task==='habitat'){
    s=h(s,'pressure-patch','deflated-habitat','patched-habitat');s=h(s,'air-tanks','patched-habitat','breathable-habitat');
  }else s=h(s,'rock','damaged-lander','rock-supported-lander');
  finish(s,'opening goal orders');
}
for(const order of permutations(['power-cable','unseated-antenna']))for(const early of [true,false]){
  let s=start('Air');no(s,'reserve-battery','station-power');
  const fit=(state:State,component:string)=>b(state,component,component==='power-cable'?'habitat-scrubber':'antenna-mount');
  if(early)for(const component of order)s=fit(s,component);
  s=h(s,'solar-panels','solar-array-base','deployed-solar-array');
  s=h(s,'power-cable','deployed-solar-array','station-power');
  assert(!live(s,'deployed-solar-array'),'old panel target retired');
  s=h(s,'reserve-battery','station-power','charged-reserve-battery');
  if(!early)for(const component of order)s=fit(s,component);
  finish(s,'air fitting orders');
}
for(const filterFirst of [true,false]){
  let s=start('Water');assert.equal(presentHotspots(story,s,s.chapter).length,1);
  if(filterFirst)s=b(s,'fabric','reclaimed-water-cartridge','water-filter');
  s=h(s,'heater','visible-ice','meltwater');
  if(!filterFirst)s=b(s,'fabric','reclaimed-water-cartridge','water-filter');
  s=b(s,'water-filter','meltwater','clean-water');s=b(s,'clean-water','tap-water-bag','stored-water');
  finish(s,'manual water');
}
for(const order of permutations(['bricks','granules'])){
  let s=start('Fire');
  s=h(s,'reflector-petals','reflector-base','open-reflector');s=h(s,'furnace-receiver','open-reflector','solar-furnace');
  s=b(s,'regolith','regolith-sieve','screened-regolith');
  for(const branch of order)if(branch==='bricks')s=h(s,'screened-regolith','solar-furnace','ceramic-blocks');else{
    s=b(s,'clean-water','screened-regolith','granule-charge');s=h(s,'granule-charge','solar-furnace','fired-granules');
  }finish(s,'ceramic products');
}
{
  let s=start('Earth');no(s,'grow-light-rails','pressurized-growing-room');
  s=h(s,'shovel','surveyed-cavern-floor','cleared-cavern-bay');s=h(s,'ceramic-blocks','cleared-cavern-bay','protected-cavern-floor');
  s=h(s,'folded-pressure-envelope','protected-cavern-floor','sealed-growing-room');s=h(s,'air-tanks','sealed-growing-room','pressurized-growing-room');
  s=h(s,'grow-light-rails','pressurized-growing-room','lit-growing-room');
  finish(s,'cave construction');
}
for(const order of permutations(['seed-potatoes','soybean-seeds','lettuce-seeds','foil-backed-cloth'])){
  let s=start('One room for roots');
  s=h(s,'ceramic-blocks','growing-room-floor','ceramic-bed-walls');s=h(s,'sheet','ceramic-bed-walls','lined-growing-beds');
  s=h(s,'fired-granules','clean-preparation-sink','growing-medium');s=h(s,'growing-medium','lined-growing-beds','prepared-growing-beds');
  s=h(s,'drip-line','prepared-growing-beds','irrigated-growing-beds');s=b(s,'packing-foil','fabric','foil-backed-cloth');
  for(const component of order)s=b(s,component,'irrigated-growing-beds');
  assert.equal(s.tokens[key('irrigated-growing-beds')].slots.length,4,'all planted overlays retained');
  finish(s,'independent planting and cover');
}
for(const order of permutations(['potatoes','soybeans'])){
  let s=start('Under the leaves');
  no(s,'foil-backed-cloth','growing-potato-bed');
  for(const crop of order)s=crop==='potatoes'
    ?h(s,'growing-medium','growing-potato-bed','hilled-potato-bed')
    :h(s,'cargo-mesh','growing-soybean-row','supported-soybean-row');
  s=b(s,'cargo-mesh','fabric','lined-harvest-basket');
  s=h(s,'lined-harvest-basket','lettuce-tray','first-lettuce-harvest');
  assert(live(s,'lined-harvest-basket'),'same sling basket survives first picking');
  finish(s,'hilling and net support');
}
{
  let s=start('What the water carries');assert(isFixed(story,s.tokens[key('water-filter')]),'same built filter fixed for service');
  s=h(s,'fabric','water-filter','collected-intake-residue');s=b(s,'laboratory-membrane','collected-intake-residue','particle-bearing-membrane');
  s=h(s,'particle-bearing-membrane','laboratory-microscope','first-body-on-membrane');finish(s,'filter discovery');
  s=start('Across the gully');no(s,'core-drill','reached-ice-bank');
  s=h(s,'rover-winch','bedrock-anchor','anchored-winch');no(s,'core-drill','reached-ice-bank');
  s=h(s,'expedition-rover','anchored-winch','reached-ice-bank');s=h(s,'core-drill','reached-ice-bank','remote-ice-core');finish(s,'crossing gate');
  s=start('Something whole');no(s,'remote-ice-core','cold-stage-microscope');
  s=h(s,'remote-ice-core','cold-sectioning-stage','sectioned-ice-core');s=h(s,'sectioned-ice-core','cold-stage-microscope','examined-ice-core');finish(s,'slab preparation');
}
for(const concentrateFirst of [true,false]){
  let s=start('Metal from the red ground');assert(!live(s,'hydrogen-cylinder'));
  const concentrate=(state:State)=>{if(!live(state,'separator-electromagnet'))state=b(state,'power-cable','steel-pin','separator-electromagnet');return b(state,'separator-electromagnet','iron-bearing-regolith','iron-rich-concentrate');};
  if(concentrateFirst)s=concentrate(s);
  no(s,'iron-rich-concentrate','solar-furnace');s=h(s,'laboratory-electrodes','solar-furnace','electrochemical-furnace');
  no(s,'iron-rich-concentrate','electrochemical-furnace');s=h(s,'power-cable','electrochemical-furnace','powered-reduction-furnace');
  if(!concentrateFirst)s=concentrate(s);
  s=h(s,'iron-rich-concentrate','powered-reduction-furnace','iron-stock');finish(s,'powered oxide reduction');
}
for(const services of permutations(['power-cable','clean-water']))for(const gases of permutations(['hydrogen','oxygen'])){
  let s=start('Two gases from water');
  for(const gas of gases)s=b(s,'iron-stock',gas+'-valve','empty-'+gas+'-cylinder');
  s=h(s,'iron-stock','salvaged-cell-internals','water-electrolysis-cell');
  no(s,'empty-hydrogen-cylinder','water-electrolysis-cell');no(s,'empty-oxygen-cylinder','water-electrolysis-cell');
  s=b(s,services[0],'water-electrolysis-cell');no(s,'empty-hydrogen-cylinder','water-electrolysis-cell');
  s=b(s,services[1],'water-electrolysis-cell');
  for(const gas of gases){s=h(s,'empty-'+gas+'-cylinder','water-electrolysis-cell',gas+'-cylinder');assert(!isFixed(story,s.tokens[key(gas+'-cylinder')]),'portable '+gas);}
  finish(s,'separate water gases');
}
for(const order of permutations(['iron-stock','hydrogen-cylinder','carbon-dioxide-cylinder','power-cable'])){
  let s=start('Fuel from air and water');
  assert(s.tokens[key('oxygen-cylinder')].chapter!==s.chapter,'oxygen absent from methane scene');
  s=b(s,'iron-stock','carbon-dioxide-fitting','empty-carbon-dioxide-cylinder');s=h(s,'empty-carbon-dioxide-cylinder','habitat-scrubber','carbon-dioxide-cylinder');
  s=b(s,'iron-stock','methane-fitting','empty-methane-cylinder');
  for(const component of order){no(s,'empty-methane-cylinder','fuel-assembly');s=b(s,component,'fuel-assembly');}
  s=h(s,'empty-methane-cylinder','fuel-assembly','methane-cylinder');assert(live(s,'oxygen-cylinder'),'earlier oxygen preserved');
  finish(s,'independent methane assembly');
}
{
  let s=start('The leg that stays');no(s,'iron-stock','landing-footing-site');
  s=h(s,'ceramic-blocks','landing-footing-site','ceramic-landing-footing');no(s,'iron-stock','ceramic-landing-footing');
  s=h(s,'shovel','ceramic-landing-footing','clear-support-gap');s=h(s,'iron-stock','clear-support-gap','level-launch-platform');
  finish(s,'ordered support repair');
}
for(const order of permutations(['methane','oxygen'])){
  let s=start('Fuel for the return');
  for(const gas of order){assert(live(s,gas+'-cylinder'),'actual earlier cylinder');s=b(s,'hose',gas+'-cylinder',gas+'-transfer-cylinder');s=h(s,gas+'-transfer-cylinder','lander-'+gas+'-port',gas+'-transferred');}
  finish(s,'separate flight transfers');
}
{
  let s=start('Supper from the garden');
  s=h(s,'lined-harvest-basket','harvest-ready-beds','harvested-potatoes');s=h(s,'harvested-potatoes','harvest-ready-beds','supper-lettuce');
  s=h(s,'supper-lettuce','harvest-ready-beds','soybeans-on-fabric');
  no(s,'soybeans-on-fabric','harvested-potatoes',false);no(s,'soybeans-on-fabric','supper-lettuce',false);
  s=h(s,'soybeans-on-fabric','clean-preparation-sink','prepared-soybeans');assert(!live(s,'soybeans-on-fabric'),'raw beans actually retire');
  s=b(s,'harvested-potatoes','prepared-soybeans','potatoes-and-soybeans');s=b(s,'potatoes-and-soybeans','supper-lettuce','stew-and-lettuce-supper');finish(s,'basket meal and mandatory washing');
}
for(const order of permutations(['source','slab','membrane'])){
  let s=start('The things we take');
  const input={source:['stored-source-core','water-source-core-cradle','flight-stowed-source-core'],slab:['examined-ice-core','remote-band-core-cradle','flight-stowed-remote-core'],membrane:['first-body-on-membrane','flight-specimen-locker','flight-stowed-membrane']};
  for(const specimen of order){const [a,t,e]=input[specimen as keyof typeof input];s=h(s,a,t,e);}
  finish(s,'separate specimen stow');
}
console.log(JSON.stringify({pass:true,chapters:story.chapters.length,recipes:story.recipes.length,fullRouteActions:full.actions.length,branchContinuationsReplayed:branches,groups,reviewedMixedFates:fast.filter(d=>d.code==='mixed-fates').map(d=>d.message),limits:'Scoped legal engine witnesses, not exhaustive fixed-state verification or artwork/geometry review. Full lint separately reports its bounded fixed-state analysis status.'},null,2));
