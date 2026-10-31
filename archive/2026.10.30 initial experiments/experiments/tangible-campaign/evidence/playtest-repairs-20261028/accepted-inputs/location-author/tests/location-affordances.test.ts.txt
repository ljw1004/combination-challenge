// Logical model evidence only; no native browser, touch or layout validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {fixture} from '../experiments/tangible-campaign/engine/fixture.ts';
import {scenarios,featuredScenarioIds} from '../experiments/tangible-campaign/ui/scenarios.ts';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';
const mars=scenarios.find(s=>s.id===featuredScenarioIds[0])!;
const before=(s:Scenario,predicate:(a:Action)=>boolean)=>{const actions=s.checkpoints!.find(c=>c.id==='complete')!.actions;const index=actions.findIndex(predicate);assert(index>=0);return M.replay(s,actions.slice(0,index));};
const step=(s:Scenario,g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,r.message);return r.game;};

test('location affordances: screenshot Solar radio and Refuge signal mast are reciprocal unmet-goal hints, not recipes',()=>{
 const g=before(mars,a=>a.type==='place'&&a.item==='solar-radio'&&a.location==='refuge-contact-mast'),snapshot=structuredClone(g);
 assert.equal(mars.stages[g.state.stage].title,'Somewhere to come back to');
 assert(M.objectiveStates(mars,g.state).some(o=>o.item==='propagator'&&o.satisfied));
 assert(M.objectiveStates(mars,g.state).some(o=>o.item==='insulated-vestibule'&&o.satisfied));
 const radio=M.partners(mars,g.state,'solar-radio'),mast=M.partners(mars,g.state,'@refuge-contact-mast');
 assert(radio.placements.includes('@refuge-contact-mast'));assert(!radio.partners.includes('@refuge-contact-mast'));assert(mast.placements.includes('solar-radio'));assert.equal(radio.message,null);
 assert.deepEqual(g,snapshot);assert(!JSON.stringify(mast).includes('rescue-route'));
 const placed=step(mars,g,M.dropAction(mars,g.state,'solar-radio','@refuge-contact-mast'));
 assert.equal(placed.state.metrics.combinations,g.state.metrics.combinations);assert.equal(placed.state.metrics.creations,g.state.metrics.creations);
 assert(!M.partners(mars,placed.state,'solar-radio').placements.includes('@refuge-contact-mast'));assert(!M.partners(mars,placed.state,'@refuge-contact-mast').placements.includes('solar-radio'));
 const undone=M.undo(placed).game;assert(M.partners(mars,undone.state,'solar-radio').placements.includes('@refuge-contact-mast'));
 const moved=step(mars,placed,{type:'move',item:'solar-radio',x:200,y:450});assert(M.partners(mars,moved.state,'@refuge-contact-mast').placements.includes('solar-radio'));
 assert.deepEqual(M.partners(mars,M.createGame(mars).state,'@refuge-contact-mast').placements,[]);
});

test('location affordances: capability readiness, visible goal dependencies and current area constrain placement hints',()=>{
 let g=step(fixture,M.createGame(fixture),{type:'combine',a:'frame',b:'wheels'});
 assert.deepEqual(M.partners(fixture,g.state,'rover').placements,[]);
 g=step(fixture,g,{type:'combine',a:'motor',b:'rover'});g=step(fixture,g,{type:'combine',a:'charger',b:'rover'});
 assert.deepEqual(M.partners(fixture,g.state,'rover').placements,['@ridge']);assert.deepEqual(M.partners(fixture,g.state,'@ridge').placements,['rover']);
 const hidden=structuredClone(fixture);hidden.stages[0].objectives.unshift({id:'gate',kind:'create',item:'ice',text:'Find ice',intermediate:true});hidden.stages[0].objectives[1].after=['gate'];
 assert.deepEqual(M.partners(hidden,g.state,'rover').placements,[]);
 assert.deepEqual(M.partners(fixture,{...g.state,currentArea:'unavailable'},'@ridge').placements,[]);
});

test('location affordances: direct operands, catalysts and existing results use one reciprocal query without output spoilers',()=>{
 const s=structuredClone(fixture);s.initialItems=['scoop','dough','starter'];s.stages=[{...s.stages[2],locations:['outcrop','cellar']}];let g=M.createGame(s);
 assert.deepEqual(M.partners(s,g.state,'@outcrop').incoming,['scoop']);assert.deepEqual(M.partners(s,g.state,'@cellar').settings.sort(),['dough','starter']);
 assert(!JSON.stringify(M.partners(s,g.state,'@cellar')).includes('risen'));
 g=step(s,g,{type:'place',item:'dough',location:'cellar'});
 assert(M.partners(s,g.state,'dough').incoming.includes('starter'));assert(!M.partners(s,g.state,'dough').outgoing.includes('starter'));
 g=step(s,g,{type:'combine',a:'starter',b:'dough'});assert.deepEqual(M.partners(s,g.state,'@cellar').settings,[]);
 g=step(s,g,{type:'combine',a:'scoop',b:'@outcrop'});assert.deepEqual(M.partners(s,g.state,'@outcrop').incoming,[]);
 assert.equal(M.dropAction(s,g.state,'scoop','@outcrop').type,'place');
 const missing={...g.state,tokens:g.state.tokens.filter(t=>t.id!=='starter')};assert.deepEqual(M.partners(s,missing,'@cellar').settings,[]);
});

for(const [source,location,result] of [['telescope-camera','distant-lookout','cliff-photograph'],['weather-station','weather-apron','weather-record']])test('location birth: actual Mars '+source+' creates '+result+' inside target and stays portable',()=>{
 for(const width of [320,360,600]){
  const actions=mars.checkpoints!.find(c=>c.id==='complete')!.actions,index=actions.findIndex(a=>a.type==='combine'&&a.a===source&&a.b==='@'+location);assert(index>=0);
  let g=M.replay(mars,actions.slice(0,index),width),original=structuredClone(M.token(g.state,source)),p=structuredClone(g.state.places.find(p=>p.id===location)!);
  const r=M.applyAction(mars,g,M.dropAction(mars,g.state,source,'@'+location));assert(r.accepted,r.message);assert.equal(r.created,result);const out=M.token(r.game.state,result)!;
  assert.deepEqual(M.token(r.game.state,source),original);assert.deepEqual(r.game.state.places.find(x=>x.id===location),p);
  assert.equal(out.x,p.x);assert(out.y-M.tokenHeight(mars,out)/2>=p.y-41);assert(out.y+M.tokenHeight(mars,out)/2<=p.y+41);assert.equal(out.location,null);
  assert.deepEqual(r.origin,{x:p.x,y:p.y});assert.equal(M.dropAction(mars,r.game.state,source,'@'+location).type,'place');
  const repeated=M.applyAction(mars,r.game,{type:'combine',a:source,b:'@'+location});assert(!repeated.accepted);assert.equal(repeated.game.state.tokens.filter(t=>t.id===result).length,1);
  g=step(mars,r.game,{type:'move',item:result,x:250,y:p.y+200});assert.equal(M.token(g.state,result)!.location,null);assert.equal(M.token(g.state,result)!.y,p.y+200);
 }
});

test('location birth: existing occupant and successive outputs do not push new things outside or alter source/occupants',()=>{
 const s=structuredClone(fixture);s.initialItems=['scoop','radio'];s.stages[0].locations=['ridge'];s.recipes=[{id:'first',a:'scoop',b:'@ridge',out:'ice'},{id:'second',a:'radio',b:'@ridge',out:'jar'}];
 let g=step(s,M.createGame(s),{type:'place',item:'scoop',location:'ridge'});const source=structuredClone(M.token(g.state,'scoop'));
 g=step(s,g,{type:'combine',a:'scoop',b:'@ridge'});const first=structuredClone(M.token(g.state,'ice'));
 g=step(s,g,{type:'combine',a:'radio',b:'@ridge'});const second=M.token(g.state,'jar')!;
 assert.deepEqual(M.token(g.state,'scoop'),source);assert.deepEqual(M.token(g.state,'ice'),first);assert.deepEqual([second.x,second.y],[first!.x,first!.y]);assert.equal(second.location,null);
});
