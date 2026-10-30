// Focused author-aware branch regressions adapted from reviewed candidate packets.
// Not a new discovery trial or native browser test; runtime is the shared current engine.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';
import {scenarioFor,routeActions,readSource} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
import {predecessorScenarios} from '../experiments/tangible-campaign/ui/campaigns/predecessors-20261028.ts';
// These source-specific v4 branch regressions keep testing the preserved v4 route after Atlas advances.
const elements=scenarioFor('elements'),food=scenarioFor('food'),atlas=predecessorScenarios.find(s=>s.id==='atlas-connected-questions-v4-methods-and-agreement-research')??scenarioFor('atlas');
const combine=(a:string,b:string):Action=>({type:'combine',a,b});
const act=(s:Scenario,g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
const ec=(n:number)=>M.checkpoint(elements,`chapter-${n}`);
test('Elements: both basin choices transform the same table and undo reversibly',()=>{for(const bowl of ['bowl','glazed-bowl']){const g=ec(22),table=M.token(g.state,'table')!,made=act(elements,g,combine(bowl,'table')),w=M.token(made.state,'washstand')!;assert.deepEqual([w.x,w.y],[table.x,table.y]);assert(M.token(M.undo(made).game.state,'table'));}});
function water(g:M.Game){for(const a of [combine('sand','charcoal'),combine('filter-bed','hollow-pipe'),combine('water','water-filter'),combine('filtered-water','fire')])g=act(elements,g,a);return g;}
test('Elements: all four documented bottle routes remain legal and retain reusable filter',()=>{for(const path of ['fill-first','cover-first','bowl-pour','legacy']){let g=water(ec(22));if(path==='fill-first'){g=act(elements,g,combine('boiled-water','glazed-bottle'));g=act(elements,g,combine('filled-water-bottle','jar-lid'));}else if(path==='cover-first'){g=act(elements,g,combine('glazed-bottle','jar-lid'));g=act(elements,g,combine('boiled-water','covered-urn'));}else{g=act(elements,g,combine('boiled-water','glazed-bowl'));if(path==='bowl-pour'){g=act(elements,g,combine('drinking-water','glazed-bottle'));g=act(elements,g,combine('filled-water-bottle','jar-lid'));assert(M.token(g.state,'drinking-water'));}else{g=act(elements,g,combine('glazed-bottle','jar-lid'));g=act(elements,g,combine('drinking-water','covered-urn'));}}assert(M.token(g.state,'water-urn'));assert(M.token(g.state,'water-filter'));}});
test('Elements: either cooking appliance/order feeds the actual feast; cold cooking still rejected',()=>{for(const appliance of ['stove','pot'])for(const order of [['grain','fruit'],['fruit','grain']]){let g=ec(24);assert(!elements.stages[23].objectives.some(o=>o.item==='stove'));assert(!M.applyAction(elements,g,combine('grain','glazed-bowl')).accepted);if(appliance==='stove')g=act(elements,g,combine('brick','iron'));else{g=act(elements,g,combine('iron','glazed-bowl'));assert(!M.applyAction(elements,g,combine('grain','cooking-pot')).accepted);g=act(elements,g,{type:'place',item:'cooking-pot',location:'kitchen-hearth'});}for(const ingredient of order)g=act(elements,g,combine(ingredient,appliance==='stove'?'stove':'cooking-pot'));g=act(elements,g,combine('porridge','compote'));g=act(elements,g,combine('feast','tiled-table'));assert(M.stageComplete(elements,g.state));}});
test('Elements current policy: warm feast does not retroactively absorb outside bread into old picnic basket',()=>{let g=ec(24);const bread=structuredClone(M.token(g.state,'bread'))!,picnic=structuredClone(M.token(g.state,'picnic-basket'))!;assert(bread&&picnic);for(const a of [combine('brick','iron'),combine('grain','stove'),combine('fruit','stove'),combine('porridge','compote')])g=act(elements,g,a);assert.deepEqual(M.token(g.state,'bread'),bread);assert.deepEqual(M.token(g.state,'picnic-basket'),picnic);assert.deepEqual(M.token(M.restore(elements,JSON.stringify(g)).state,'bread'),bread);});
const foodActions=routeActions('food-v3/routes/canonical.json');
for(const reverse of [false,true])for(const width of [320,360,600])test(`Food: portable fitted injector/packing works without a location, reverse=${reverse} width=${width}`,()=>{
 let g=M.checkpoint(food,'snack',width);assert.equal(food.stages.at(-1)!.locations?.length,0);const prefix=food.checkpoints!.find(c=>c.id==='snack')!.actions.length;
 for(const a of foodActions.slice(prefix)){const r=a.type==='combine'&&reverse?combine(a.b,a.a):a;g=act(food,g,r);}
 assert(g.state.completed);assert.equal(M.token(g.state,'injector')!.slots.creme,'vanilla-filling');assert(!M.token(g.state,'loaded-injector'));assert(M.token(g.state,'twinkie'));assert(M.token(g.state,'injector'));assert(!M.token(g.state,'printed-wrapper'));assert(!M.undo(g).game.state.completed);
});
test('Food: no unsupported filling gates or empty-injector substitution; retained tools survive',()=>{
 assert(!food.recipes.some(r=>r.at==='filling-line'));let g=M.checkpoint(food,'snack');assert(M.token(g.state,'golden-sponge'));assert(M.token(g.state,'injector'));assert(!M.token(g.state,'injector')!.slots.creme);assert(!M.applyAction(food,g,combine('golden-sponge','injector')).accepted);
 g=M.replay(food,foodActions);for(const id of ['millstone','press','churn','whisk','freezing-churn','opener','packaging-printer'])assert(M.token(g.state,id));assert.match(food.items.find(i=>i.id==='twinkie')!.description!,/not a reconstruction/);
});
const atlasActions=routeActions('atlas/revision-v4-methods-and-agreement/author-route.json');
function enter(id:string){let g=M.createGame(atlas);for(const a of atlasActions){if(atlas.stages[g.state.stage].id===id)return g;g=act(atlas,g,a);}throw Error(id);}
for(const mode of ['ordinary','observe-then-ordinary','observe-then-alternative'])for(const reverse of [false,true])test(`Atlas: independent clock correction ${mode}, reverse=${reverse}`,()=>{
 let g=enter('longitude');const c=(a:string,b:string)=>{g=act(atlas,g,reverse?combine(b,a):combine(a,b));};
 for(const [a,b] of [['rotation-card','merchant-manual'],['sea-clock','equation-time'],['apparent-clock','local-noon'],['time-difference','time-angle-rule'],['lunar-distance','lunar-clearing'],['nautical-table','predictive-sky-record'],['cleared-lunar-angle','lunar-time-scale'],['lunar-reference-time','local-noon'],['lunar-time-difference','time-angle-rule']])c(a,b);
 if(mode!=='ordinary'){c('clock-longitude','lunar-longitude');assert(M.token(g.state,'clock-moon-discrepancy'));assert(!M.token(g.state,'corrected-clock-position'));}
 g=act(atlas,g,{type:'place',item:reverse?'sea-clock':'rough-voyage',location:'sea-trial'});c('sea-clock','rough-voyage');c('voyage-clock-record',mode==='observe-then-alternative'?'clock-moon-discrepancy':'clock-longitude');c('corrected-clock-position','lunar-longitude');c('position-comparison','chart');assert(M.stageComplete(atlas,g.state));
});
for(const reverse of [false,true])test(`Atlas: future city uses current seasonal agreement and retains metabolic assembly, reverse=${reverse}`,()=>{
 let g=enter('future-city');const chapter=readSource('atlas/revision-v4-methods-and-agreement/chapters.json').find((c:any)=>c.id==='future-city');for(const id of chapter.recipes){const r=atlas.recipes.find(r=>r.id===id)!;g=act(atlas,g,reverse?combine(r.b,r.a):combine(r.a,r.b));}assert(M.stageComplete(atlas,g.state));assert(M.token(g.state,'evolving-city')!.components?.includes('metabolic-partnership'));assert(M.token(g.state,'seasonal-city-rule'));
});
