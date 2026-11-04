// Reusable checks for the current Mars v12 revision; transient output belongs under runs/.
import assert from 'node:assert/strict';
import {loadStory} from '../../../../../../src/story/load.ts';
import {checkpoint} from '../../../../../../src/debug/checkpoint.ts';
import {act,recipeFor,replay,chapterComplete,visibleGoals} from '../../../../../../src/engine/game.ts';
import {presentHotspots,isFixed} from '../../../../../../src/engine/fixed-items.ts';
import {lintStory} from '../../../../../../src/lint/lint.ts';
import type {State,Action} from '../../../../../../src/engine/types.ts';
const {story}=loadStory('projects/mars-study/mars-v12/mars.md');
const id=(s:string)=>'id:'+s;
const starts=new Map<string,State>(); let passes=0;
function tidy(s:State){while(s.pending.length)s=act(story,s,{type:'dismiss'});return s;}
function start(name:string){if(!starts.has(name)){const n=story.chapters.findIndex(c=>c.name===name);assert(n>=0,name);starts.set(name,tidy(checkpoint(story,n)));}return structuredClone(starts.get(name)!);}
function live(s:State,i:string){return s.tokens[id(i)]?.status==='available';}
function count(s:State){for(const n of s.visited)assert(presentHotspots(story,s,n).length<=3,'more than 3 targets: '+story.chapters[n].name);return s;}
function doIt(s:State,a:Extract<Action,{type:'combine'}>,expect?:string){s=tidy(s);assert(recipeFor(story,s,a),'unavailable '+JSON.stringify(a));s=tidy(act(story,s,a));if(expect)assert(live(s,expect),'missing '+expect);return count(s);}
const h=(s:State,a:string,t:string,e?:string)=>doIt(s,{type:'combine',a:id(a),hotspot:id(t),chapter:s.chapter},e);
const b=(s:State,a:string,t:string,e?:string)=>doIt(s,{type:'combine',a:id(a),b:id(t)},e);
function no(s:State,a:string,t:string,fixed=true){assert(!recipeFor(story,s,{type:'combine',a:id(a),...(fixed?{hotspot:id(t),chapter:s.chapter}:{b:id(t)})}),'premature '+a+' '+t);}
function finish(s:State,label:string){assert(chapterComplete(story,s),label+' chapter incomplete');const end=checkpoint(story,story.chapters.length,s);assert(end.completed,label+' continuation');assert.deepEqual(replay(story,end.actions),end,label+' replay');passes++;}
function perms<T>(a:T[]):T[][]{return a.length?a.flatMap((x,i)=>perms(a.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]];}
// Air: both habitat fitting orders, including fittings before panel power.
for(const order of perms(['power-cable','unseated-antenna']))for(const early of [false,true]){
 let s=start('Air');no(s,'reserve-battery','station-power');
 if(early)for(const component of order)s=b(s,component,'habitat-services');
 s=h(s,'solar-panels','solar-array-base','deployed-solar-array');
 no(s,'reserve-battery','deployed-solar-array');
 s=h(s,'power-cable','deployed-solar-array','station-power');assert(live(s,'deployed-solar-array'));assert(isFixed(story,s.tokens[id('station-power')]));
 s=h(s,'reserve-battery','station-power','charged-reserve-battery');
 if(!early)for(const component of order)s=b(s,component,'habitat-services');
 assert.equal(s.tokens[id('habitat-services')].slots.length,2);finish(s,'Air '+order+' '+early);
}
// Water: two real hose operations; first pipe retires when both routes are laid.
{
 let s=start('Water');s=h(s,'heated-extraction-head','surveyed-ice-bore','sealed-melt-well');assert(!live(s,'surveyed-ice-bore'));
 s=h(s,'hose','sealed-melt-well','raw-water-line');assert(live(s,'sealed-melt-well'));assert(!live(s,'connected-well-line'));
 s=h(s,'hose','raw-water-line','connected-well-line');assert(!live(s,'raw-water-line'));
 if(!live(s,'reflective-insulation'))s=b(s,'packing-foil','insulation-felt','reflective-insulation');
 s=h(s,'reflective-insulation','connected-well-line','insulated-water-line');assert(!live(s,'connected-well-line'));finish(s,'Water');
}
// Garden: each seed order is legal only after the actual constructed receiver exists.
for(const order of perms(['seed-potatoes','soybean-seeds','lettuce-seeds'])){
 let s=start('One room for roots');for(const seed of order)no(s,seed,'plantable-growing-beds',false);
 s=h(s,'ceramic-blocks','growing-room-floor','ceramic-bed-walls');s=h(s,'food-safe-liner-sheet','ceramic-bed-walls','lined-growing-beds');
 s=h(s,'ceramic-blocks','clean-preparation-sink','growing-medium');s=h(s,'growing-medium','lined-growing-beds','prepared-growing-beds');
 s=h(s,'drip-line','prepared-growing-beds','irrigated-growing-beds');
 if(!live(s,'foil-backed-cloth'))s=b(s,'packing-foil','clean-cover-fabric','foil-backed-cloth');
 s=h(s,'foil-backed-cloth','irrigated-growing-beds','plantable-growing-beds');
 for(const seed of order)s=b(s,seed,'plantable-growing-beds');assert.equal(s.tokens[id('plantable-growing-beds')].slots.length,3);finish(s,'Seeds '+order);
}
// Tending: all interleavings of collar then hilling with soybean support; early basket remains allowed.
for(const order of [['collar','hill','soy'],['collar','soy','hill'],['soy','collar','hill']])for(const early of [false,true]){
 let s=start('Under the leaves');
 if(early){s=b(s,'cargo-mesh','clean-cover-fabric','lined-harvest-basket');assert(visibleGoals(story,s).some(g=>g.text==='Tend the growing crops'));}
 for(const step of order){
 if(step==='collar'){if(!live(s,'foil-backed-cloth'))s=b(s,'packing-foil','clean-cover-fabric','foil-backed-cloth');s=h(s,'foil-backed-cloth','growing-potato-bed','extended-potato-bed');}
 if(step==='hill')s=h(s,'growing-medium','extended-potato-bed','hilled-potato-bed');
 if(step==='soy')s=h(s,'cargo-mesh','growing-soybean-row','supported-soybean-row');}
 if(!early)s=b(s,'cargo-mesh','clean-cover-fabric','lined-harvest-basket');
 s=h(s,'lined-harvest-basket','lettuce-tray','first-lettuce-harvest');finish(s,'Tending '+order+' '+early);
}
// Sampling: no remote core until crossing; no microscope discovery before cold preparation.
{
 let s=start('Across the gully');no(s,'core-drill','rover-beyond-gully');s=h(s,'rover-winch','bedrock-anchor','anchored-winch');no(s,'core-drill','rover-beyond-gully');
 s=h(s,'expedition-rover','anchored-winch','rover-beyond-gully');assert(live(s,'anchored-winch'));s=h(s,'core-drill','rover-beyond-gully','remote-ice-core');finish(s,'Crossing');
 s=start('Something whole');no(s,'remote-ice-core','cold-stage-microscope');s=h(s,'remote-ice-core','cold-sectioning-stage','sectioned-ice-core');
 s=h(s,'sectioned-ice-core','cold-stage-microscope','examined-ice-core');assert(live(s,'stored-source-core')||s.tokens[id('stored-source-core')]?.status==='available');finish(s,'Section');
}
// Both plant-pad branches before mounting the supplied core on its actual local frame.
for(const order of perms(['solar','reactor'])){
 let s=start('A different use for the sunlight');assert(live(s,'steel'));
 for(const branch of order)if(branch==='solar'){
 s=h(s,'shovel','industrial-array-site','cleared-array-site');s=h(s,'ceramic-blocks','cleared-array-site','solar-array-footing');s=h(s,'spare-solar-modules','solar-array-footing','industrial-solar-supply');
 }else{s=h(s,'shovel','fuel-fab-area','cleared-process-site');s=h(s,'ceramic-blocks','cleared-process-site','fuel-fab-footing');s=h(s,'steel','fuel-fab-footing','reactor-frame');s=h(s,'reactor-module','reactor-frame','mounted-reactor');}
 finish(s,'Plant pads '+order);
}
// Store paths and catalyst: 6 complete branch orders plus two interleaved construction orders.
const gas=(s:State,g:string)=>{s=h(s,'steel',g+'-store-site',g+'-store-frame');s=h(s,g+'-cold-flask',g+'-store-frame',g+'-store');return h(s,'hose',g+'-store','connected-'+g+'-store');};
for(const order of perms(['methane','oxygen','catalyst'])){
 let s=start('Fuel from air and water');for(const branch of order)s=branch==='catalyst'?h(s,'sabatier-catalyst-cartridge','mounted-reactor','operating-fuel-processor'):gas(s,branch);finish(s,'Fuel '+order);
}
for(const order of perms(['methane','oxygen'])){
 let s=start('Fuel from air and water');for(const g of order)s=h(s,'steel',g+'-store-site',g+'-store-frame');
 s=h(s,'sabatier-catalyst-cartridge','mounted-reactor','operating-fuel-processor');
 for(const g of order.toReversed())s=h(s,g+'-cold-flask',g+'-store-frame',g+'-store');
 for(const g of order)s=h(s,'hose',g+'-store','connected-'+g+'-store');finish(s,'Interleaved fuel '+order);
}
// Both independent transfer orders.
for(const order of perms(['methane','oxygen'])){let s=start('Two tanks, two liquids');for(const g of order)s=h(s,'hose','lander-'+g+'-port',g+'-transferred');finish(s,'Transfer '+order);}
// Three harvest orders; raw beans and lettuce cannot jump the prescribed meal chain.
for(const order of perms(['potato','soy','lettuce'])){
 let s=start('Supper from the garden');for(const crop of order){const a={potato:['shovel','harvested-potatoes'],soy:['lined-harvest-basket','soybeans-on-fabric'],lettuce:['clean-cover-fabric','supper-lettuce']}[crop]!;s=h(s,a[0],'harvest-ready-beds',a[1]);}
 no(s,'soybeans-on-fabric','supper-lettuce',false);no(s,'harvested-potatoes','supper-lettuce',false);no(s,'soybeans-on-fabric','harvested-potatoes',false);
 s=h(s,'soybeans-on-fabric','clean-preparation-sink','prepared-soybeans');no(s,'prepared-soybeans','supper-lettuce',false);
 s=b(s,'prepared-soybeans','harvested-potatoes','potatoes-and-soybeans');s=b(s,'potatoes-and-soybeans','supper-lettuce','stew-and-lettuce-supper');finish(s,'Meal '+order);
}
const complete=checkpoint(story,story.chapters.length);assert(complete.completed);assert.deepEqual(replay(story,complete.actions),complete);passes++;
console.log(JSON.stringify({pass:true,legalContinuationReplays:passes,chapters:story.chapters.length,recipes:story.recipes.length,covered:'Air 4, water 1, seed orders 6, tending 6, crossing 1, section 1, plant pads 2, fuel 8, transfers 2, meal 6, full route 1',limitations:'Full fixed-item verifier exceeds 20,000 states; these are scoped legal replay witnesses, not exhaustive verification or an art/geometry review.'},null,2));
