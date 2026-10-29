import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
/** Current naming, one engine, exact v1 behavior. Logical/source tests only. */
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync as originalReadFileSync} from 'node:fs';
import * as C from '../experiments/tangible-campaign/engine/campaign.ts';
import * as V1 from '../experiments/tangible-campaign/engine/model.ts';
import * as Before from '../experiments/tangible-campaign/reviews/location-hotspot-terminology/predecessor-runtime/engine/model.ts';
import * as V from '../experiments/tangible-campaign/compatibility/v1.ts';
import type {Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import {scenarios,integratedScenarios,optionalIntellectualScenarios} from '../experiments/tangible-campaign/ui/pre-location-scenarios.ts';
import {applyMilestones,getPlayableScenario} from '../experiments/tangible-campaign/ui/current-campaign.ts';
import {currentMarsRouteActions} from '../experiments/tangible-campaign/integration/current-mars-route-actions.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root),'utf8');
const active=[...integratedScenarios,...optionalIntellectualScenarios];
for(const raw of active)test('v2/v1/current-parent exact route, save history and Undo: '+raw.id,()=>{
 const s=applyMilestones(raw),old=V.toLegacyScenario(s),evidence=JSON.parse(read('experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json')).actionsLog,actions=(s.id==='mars-connected-survival-v4-return-cargo-research'?currentMarsRouteActions(evidence):evidence).map(V.fromLegacyAction) as import('../experiments/tangible-campaign/schema/campaign.ts').Action[];
 assert(actions?.length,'Current story has an explicit route');assert.deepEqual(C.validateScenario(s),[]);assert.deepEqual(V1.validateScenario(old),[]);
 let modern=C.createGame(s),prior=Before.createGame(old);assert.deepEqual(V.toLegacyGame(modern),prior);
 for(const [i,a]of actions.entries()){
  const actual=C.applyAction(s,modern,a),expected=Before.applyAction(old,prior,V.toLegacyAction(a));
  assert.equal(actual.accepted,expected.accepted,'action '+i);assert(actual.accepted,'accepted authored route '+i);modern=actual.game;prior=expected.game;
  assert.deepEqual(V.toLegacyState(modern.state),prior.state,'complete state after action '+i);
  assert.deepEqual(V.toLegacyEvent(modern.events.at(-1)!),prior.events.at(-1),'event after action '+i);
  if(i%25===0){
   assert.deepEqual(V.toLegacyPlayerView(C.playerView(s,modern)),Before.playerView(old,prior),'player view '+i);
   const ids=[...modern.state.tokens.filter(t=>t.location===modern.state.currentLocation).slice(0,6).map(t=>t.id),...modern.state.hotspots.filter(h=>h.location===modern.state.currentLocation).slice(0,3).map(h=>'@'+h.id)];
   for(const id of ids)assert.deepEqual(V.toLegacyPartners(C.partners(s,modern.state,id)),Before.partners(old,prior.state,id),'normal hints '+i+'/'+id);
  }
 }
 assert(modern.state.completed);assert.deepEqual(V.toLegacyGame(modern),prior,'entire history/event tree');
 assert.deepEqual(C.restore(s,JSON.stringify(prior)),modern,'legacy JSON restored to canonical');
 const wire=encodeSave({game:V.toLegacyGame(modern),tops:{},seen:[modern.state.chapter]}),saved=decodeSave(wire);
 assert.deepEqual(Before.restore(old,JSON.stringify(saved.game)),prior,'new save still loads in frozen old engine');
 assert.deepEqual(C.restore(s,JSON.stringify(saved.game)),modern,'packed old-wire/current-engine round trip');
 assert.deepEqual(C.restore(s,JSON.stringify(modern)),modern,'canonical JSON round trip');
 let count=0;while(modern.history.length){modern=C.undo(modern).game;prior=Before.undo(prior).game;assert.deepEqual(V.toLegacyState(modern.state),prior.state,'Undo '+ ++count);}
 assert.deepEqual(V.toLegacyGame(modern),prior,'all available Undo history');
 for(const cp of s.checkpoints??[]){assert.deepEqual(V.toLegacyGame(C.checkpoint(s,cp.id)),Before.checkpoint(old,cp.id),'checkpoint '+cp.id);}
});
test('all retained v1 scenarios round-trip exactly without modifying author data',()=>{
 for(const s of scenarios){const old=V.toLegacyScenario(s);assert.deepEqual(V.fromLegacyScenario(old),s);assert.deepEqual(C.validateScenario(s),[]);}
});
test('current story modules reproduce exact previous data including property order and visible names',async()=>{
 for(const name of ['mars-return-cargo','elements-house-and-craft','food-kitchen-caravan','atlas-intellectual-history','divinity-disputed-questions','divinity-light-text-workshop','purpose-copy-workroom']){
  const current=await import('../experiments/tangible-campaign/ui/stories/'+name+'.ts'),old=await import('../experiments/tangible-campaign/ui/campaigns/'+name+'.ts');
  assert.equal(JSON.stringify(V.toLegacyScenario(current.scenario)),JSON.stringify(old.scenario),name);
 }
});
const fixture:Scenario={schemaVersion:2,id:'same-location-new-chapter',title:'A workshop',premise:'One location; two story beats.',items:[{id:'seed',label:'Seed'},{id:'water',label:'Water'},{id:'plant',label:'Plant'}],hotspots:[{id:'tray',label:'Tray'}],initialItems:['seed','water'],recipes:[{id:'plant',a:'seed',b:'water',at:'tray',out:'plant'}],chapters:[{id:'first',title:'Start',speaker:'Keeper',motivation:'Prepare.',location:{id:'room',label:'Workshop',travelText:'Here.'},hotspots:['tray'],objectives:[{id:'put',kind:'place',item:'seed',hotspot:'tray',text:'Put seed in tray'}]},{id:'second',title:'Grow',speaker:'Keeper',motivation:'Continue.',location:{id:'room',label:'Workshop',travelText:'Still here.'},objectives:[{id:'grow',kind:'create',item:'plant',text:'Grow plant'}],carry:[]}]};
test('location ownership never aliases hotspot binding; chapters may share a persistent location',()=>{
 let g=C.createGame(fixture);assert.equal(g.state.currentLocation,'room');assert.equal(g.state.locations.length,1);assert.equal(g.state.hotspots[0].location,'room');
 g=C.applyAction(fixture,g,{type:'place',item:'seed',hotspot:'tray'}).game;const seed=structuredClone(C.token(g.state,'seed'));
 assert.equal(seed?.location,'room');assert.equal(seed?.hotspot,'tray');assert(C.partners(fixture,g.state,'water').partners.includes('seed'));
 g=C.applyAction(fixture,g,{type:'advance'}).game;assert.equal(g.state.chapter,1);assert.equal(g.state.locations.length,1);assert.deepEqual(C.token(g.state,'seed'),seed);
 assert.equal(C.dropAction(fixture,g.state,'water','seed').type,'combine');g=C.applyAction(fixture,g,{type:'combine',a:'water',b:'seed'}).game;assert(C.token(g.state,'plant'));
 assert.equal(C.playerView(fixture,g).location?.id,'room');assert.equal(C.playerView(fixture,g).hotspots[0].id,'tray');
});
test('public authoring rejects ambiguous v1 input; v1 compatibility API accepts it explicitly',()=>{
 const old=V.toLegacyScenario(fixture);assert.deepEqual(V1.validateScenario(old),[]);assert(C.validateScenario(old as unknown as Scenario).length);
 assert.equal(V.fromLegacyAction({type:'visit',area:'room'}).type,'visit');assert.deepEqual(V.fromLegacyAction({type:'place',item:'seed',location:'tray'}),{type:'place',item:'seed',hotspot:'tray'});
 assert.deepEqual(V.toLegacyGame(C.createGame(fixture)),V1.createGame(old));
});
test('adapters leave arbitrary dictionary keys, quotations and URL strings opaque',()=>{
 const s=structuredClone(fixture);s.items[0].reading={text:'location, area and chapter are quoted words',attribution:'https://example.test/location/area'};s.items[0].slots=[{id:'area',accepts:['water'],grants:{location:['area']}}];s.recipes[0].lifecycle={location:{role:'retain',reason:'quoted location'},area:{role:'retain',reason:'quoted area'}};
 assert.deepEqual(V.fromLegacyScenario(V.toLegacyScenario(s)),s);assert.equal(V.toLegacyScenario(s).items[0].reading?.text,s.items[0].reading?.text);assert.deepEqual(V.toLegacyScenario(s).recipes[0].lifecycle,s.recipes[0].lifecycle);
});
test('UI and logical surfaces share canonical composition; platform API names and v1 save keys are preserved',()=>{
 const ui=read('experiments/tangible-campaign/ui/campaign-main.ts'),css=read('experiments/tangible-campaign/ui/campaign.css');
 assert.match(ui,/from '..\/engine\/campaign.ts'/);assert.match(ui,/from '..\/schema\/campaign.ts'/);assert.match(ui,/from '.\/campaign-page-catalogue.ts'/);const pageCatalogue=read('experiments/tangible-campaign/ui/campaign-page-catalogue.ts');assert.match(pageCatalogue,/import \* as current from '.\/current-scenarios.ts'/);assert.match(pageCatalogue,/export let scenarios=current.scenarios/);assert.match(pageCatalogue,/export let featuredScenarioIds=current.featuredScenarioIds/);assert.match(ui,/from '.\/current-campaign.ts'/);assert.match(ui,/new URLSearchParams\(location.search\)/);assert.match(ui,/location.assign\(link.href\)/);assert(!ui.includes('hotspot.search')&&!ui.includes('hotspot.assign'));
 assert.match(ui,/game:toLegacyGame\(game\)/);assert.match(ui,/tangible-campaign-v1:/);assert.match(ui,/class="hotspot /);assert.match(ui,/class="location-label"/);assert.match(css,/\.hotspot\{/);assert.match(css,/\.location-label\{/);assert.match(css,/safe-area-inset-top/);assert(!css.includes('safe-location-inset'));
 for(const s of active)assert.deepEqual(getPlayableScenario(s.id,scenarios),applyMilestones(s));
 const legacy=read('experiments/tangible-campaign/engine/model.ts');assert.match(legacy,/@deprecated V1 logical API/);assert(!legacy.includes('function resolveRecipe('),'no second rules engine');
});

test('unknown prototype-sensitive JSON keys and messages survive legacy restoration inertly',()=>{
 const old=V.toLegacyScenario(fixture);let game=Before.createGame(old);game=Before.applyAction(old,game,{type:'place',item:'seed',location:'tray'}).game;
 const extra=JSON.parse('{"__proto__":{"note":"inert"},"constructor":"opaque","toString":"opaque","hasOwnProperty":"opaque"}');
 for(const object of [game,game.state,...game.history,...game.state.tokens,...game.history.flatMap(s=>s.tokens),game.events[0].action])for(const [key,value]of Object.entries(extra))Object.defineProperty(object,key,{value,enumerable:true,writable:true,configurable:true});
 for(const message of ['__proto__','constructor','toString','hasOwnProperty']){
  game.events[0].message=message;const restored=C.restore(fixture,JSON.stringify(game));assert.deepEqual(V.toLegacyGame(restored),Before.restore(old,JSON.stringify(game)));assert.equal(restored.events[0].message,message);
 }
 assert.equal(({} as Record<string,unknown>).note,undefined);
});
test('mixed core vocabulary rejects deterministically instead of changing saved progress by key order',()=>{
 const old=V.toLegacyScenario(fixture);const game=Before.applyAction(old,Before.createGame(old),{type:'place',item:'seed',location:'tray'}).game;
 for(const aliasFirst of [false,true]){
  const mixed=structuredClone(game) as any,t=mixed.state.tokens[0];mixed.state.tokens[0]=aliasFirst?{hotspot:null,...t}:{...t,hotspot:null};
  assert.equal(Before.restore(old,JSON.stringify(mixed)).state.tokens[0].location,'tray');assert.throws(()=>C.restore(fixture,JSON.stringify(mixed)),/mixed vocabulary/);
  const history=structuredClone(game) as any;history.history[0].chapter=7;assert.throws(()=>C.restore(fixture,JSON.stringify(history)),/mixed vocabulary/);
  const event=structuredClone(game) as any;event.events[0].action.hotspot=null;assert.throws(()=>C.restore(fixture,JSON.stringify(event)),/mixed vocabulary/);
  const canonical=C.createGame(fixture) as any;canonical.state.tokens[0].area='another-place';assert.throws(()=>C.restore(fixture,JSON.stringify(canonical)),/mixed vocabulary/);
 }
});
test('damaged optional presentation metadata does not invalidate playable legacy progress',()=>{
 const old=V.toLegacyScenario(fixture),game=Before.createGame(old) as any;
 game.state.arrival={...game.state.arrival,chapter:99};game.state.arrivalLayout={stage:0,chapter:99,area:'room',dividerY:120,active:true};game.state.chapterEntry={stage:0,chapter:99,alreadyComplete:true};
 const out=C.restore(fixture,JSON.stringify(game));assert.equal(out.state.chapter,0);assert.equal(out.state.currentLocation,'room');assert.equal(out.state.arrival,undefined);assert.equal(out.state.arrivalLayout,undefined);assert.equal(out.state.chapterEntry,undefined);assert.deepEqual(out.state.tokens,V.fromLegacyState(game.state).tokens);
 const canonical=C.createGame(fixture) as any;canonical.state.arrival={...canonical.state.arrival,stage:99};assert.equal(C.restore(fixture,JSON.stringify(canonical)).state.arrival,undefined);
});

test('catalyst help keeps the imperative Place and both contextual directions match the parent',()=>{
 const old=V.toLegacyScenario(fixture),g=C.createGame(fixture),before=Before.createGame(old);
 const advice=C.partners(fixture,g.state,'water');assert(advice.settingHelp.some(h=>h.text.startsWith('Place Seed at Tray')));assert(!JSON.stringify(advice).includes('HotspotPosition'));
 assert.deepEqual(V.toLegacyPartners(advice),Before.partners(old,before.state,'water'));
 const rejected=C.applyAction(fixture,g,{type:'combine',a:'water',b:'seed'}),prior=Before.applyAction(old,before,{type:'combine',a:'water',b:'seed'});assert.equal(rejected.accepted,false);assert.equal(rejected.message,prior.message);
 const placed=C.applyAction(fixture,g,{type:'place',item:'seed',hotspot:'tray'}).game,placedBefore=Before.applyAction(old,before,{type:'place',item:'seed',location:'tray'}).game;
 for(const id of ['seed','water','@tray'])assert.deepEqual(V.toLegacyPartners(C.partners(fixture,placed.state,id)),Before.partners(old,placedBefore.state,id));
});
