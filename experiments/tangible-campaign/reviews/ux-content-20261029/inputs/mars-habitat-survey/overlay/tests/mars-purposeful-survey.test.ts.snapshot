import assert from 'node:assert/strict';import test from 'node:test';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {mars,marsCreature} from '../experiments/tangible-campaign/ui/stories/mars-water-vestibule-candidates.ts';
import {withMarsHabitatRooms} from '../experiments/tangible-campaign/ui/stories/mars-habitat-rooms.ts';
import {withMarsPurposefulSurvey} from '../experiments/tangible-campaign/ui/stories/mars-purposeful-survey.ts';
import {toLegacyScenario,toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
const pair=(a:string,b:string)=>[a,b].sort().join('|'),bare=(state:M.State)=>{const {metrics,...rest}=state;return rest;};
for(const base of [mars,marsCreature]){
 const before=withMarsHabitatRooms(base,base.id+'-room-base'),s=withMarsPurposefulSurvey(before,base.id+'-survey-test'),route=s.checkpoints!.find(c=>c.id==='complete')!.actions;
 const save=(g:M.Game)=>{assert.deepEqual(M.restore(s,JSON.stringify(g)),g);const e={game:toLegacyGame(g),tops:{},seen:[]};assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave(e)).game)),g);};
 const perform=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
 test(`${s.id}: bounded delta, no dangling removed map/compass references, complete contracts`,()=>{
  const original=JSON.stringify(before);withMarsPurposefulSurvey(before,s.id+'-clone');assert.equal(JSON.stringify(before),original);
  const dead=['survey-map','bearing-scope','compass-module','binoculars','annotated-map','weather-route-map'];for(const id of dead)assert(!JSON.stringify({...s,notes:[]}).includes(`"${id}"`),id);
  assert.equal(route.length,before.checkpoints!.find(c=>c.id==='complete')!.actions.length-7);assert.equal(s.items.length,before.items.length-6);
  assert.equal(s.items.find(i=>i.id==='terrain-sheet')!.label,'Regional map');assert(s.locationPlan!.locations.flatMap(l=>l.stockBatches).some(b=>b.items.includes('terrain-sheet')));
  assert(!s.chapters.find(c=>c.id==='outcrop')!.objectives.some(o=>o.item==='cliff-photograph'));assert(!s.recipes.some(r=>r.a==='cliff-photograph'||r.b==='cliff-photograph'));
  assert.deepEqual(s.locationPlan!.locations.map(l=>l.background),before.locationPlan!.locations.map(l=>l.background));
  const l=toLegacyScenario(s);for(const e of [M.validateScenario(s),validateContentLifecycles([l]),validateConstructionContinuity([l]),validateObjectiveFlow([l]),validateLifecycleGraph([l])])assert.deepEqual(e,[]);
 });
 for(const reverse of [false,true])test(`${s.id}: map matching and route loading in both directions; actual next travel requires same equipped rover`,()=>{
  const locationRoute=route.findIndex(a=>a.type==='combine'&&pair(a.a,a.b)===pair('panorama','terrain-sheet'));let g=M.replay(s,route.slice(0,locationRoute),390);
  const map=M.token(g.state,'terrain-sheet')!,a=reverse?'terrain-sheet':'panorama',b=reverse?'panorama':'terrain-sheet';assert(M.partners(s,g.state,a).outgoing.includes(b));g=perform(g,{type:'drop',item:a,target:b});const local=M.token(g.state,'bearing-map')!;assert.deepEqual({x:local.x,y:local.y},{x:map.x,y:map.y});assert(!M.token(g.state,'terrain-sheet'));save(g);
  const load=route.findIndex(a=>a.type==='combine'&&pair(a.a,a.b)===pair('rover','rescue-route'));g=M.replay(s,route.slice(0,load),390);const prior=g,rover=structuredClone(M.token(g.state,'rover')!);
  assert(!M.chapterComplete(s,g.state));assert.equal(M.applyAction(s,g,{type:'advance'}).accepted,false,'a loose paper route does not unlock travel');
  assert(M.partners(s,g.state,'rover').outgoing.includes('rescue-route'));assert(M.partners(s,g.state,'rescue-route').outgoing.includes('rover'));
  g=perform(g,{type:'drop',item:reverse?'rescue-route':'rover',target:reverse?'rover':'rescue-route'});const fitted=M.token(g.state,'rover')!;
  for(const [slot,value]of Object.entries(rover.slots))assert.equal(fitted.slots[slot],value);assert.equal(fitted.slots['rescue-route'],'rescue-route');assert.deepEqual({id:fitted.id,x:fitted.x,y:fitted.y,location:fitted.location,components:fitted.components},{id:rover.id,x:rover.x,y:rover.y,location:rover.location,components:rover.components});assert(!M.token(g.state,'rescue-route'));assert(M.chapterComplete(s,g.state));assert.deepEqual(bare(M.undo(g).game.state),bare(prior.state));save(g);
  assert.equal(M.applyAction(s,g,{type:'drop',item:'rescue-route',target:'rover'}).accepted,false);g=perform(g,{type:'advance'});assert.equal(s.chapters[g.state.chapter].id,'rescue');assert.equal(g.state.currentLocation,'M07');assert.equal(M.token(g.state,'rover')!.location,'M07');assert.deepEqual(M.token(g.state,'rover')!.slots,fitted.slots);save(g);
 });
 test(`${s.id}: optional cliff view with available mounted camera; honest specimen photograph alternative`,()=>{
  let g=M.checkpoint(s,'chapter-4',390);assert.equal(s.chapters[g.state.chapter].id,'outcrop');assert(M.token(g.state,'field-camera'));assert(M.partners(s,g.state,'field-camera').outgoing.includes('@distant-lookout'));
  const prior=g;g=perform(g,{type:'drop',item:'field-camera',target:'@distant-lookout'});assert(M.token(g.state,'cliff-photograph'));assert.deepEqual(M.token(g.state,'field-camera'),M.token(prior.state,'field-camera'));assert(!M.partners(s,g.state,'field-camera').outgoing.includes('@distant-lookout'));save(g);assert.deepEqual(bare(M.undo(g).game.state),bare(prior.state));
 });
 for(const width of [320,390])test(`${s.id}: ${width}px full route, map reuse and creature custody`,()=>{
  let g=M.createGame(s,width),mapReuse=false;
  for(const a of route){g=perform(g,a);for(const l of g.state.locations)assert.deepEqual(M.locationFootprint(s,g.state,l.id).outOfBounds,[]);if(g.events.at(-1)?.recipe==='traverse-8-traverse-map'){mapReuse=true;assert(M.token(g.state,'traverse-map'));}}
  assert(mapReuse);assert(g.state.completed);if(s.id.includes('creature')){const ship=M.token(g.state,'docked-vehicle')!;assert(ship.components!.includes('creature-core'));assert(ship.components!.includes('core-tube'));}save(g);
 });
 for(const variant of (s.id.includes('creature')?['tow','early','early-tow']:['tow']))test(`${s.id}: full ${variant} route preserves rescue vehicle and optional specimen`,()=>{
  let actions=route;
  if(variant.includes('early'))actions=actions.flatMap((a):Action[]=>{
   if(a.type==='combine'&&pair(a.a,a.b)===pair('ice-core','lit-microscope'))return [];
   const use=a.type==='combine'?{...a,a:a.a==='ice-core'?'creature-core':a.a,b:a.b==='ice-core'?'creature-core':a.b}:a;
   if(a.type==='combine'&&pair(a.a,a.b)===pair('core-tube','@lookout-ice'))return [a,{type:'combine',a:'windowed-box',b:'glove-ports'},{type:'combine',a:'glovebox',b:'lamp'},{type:'combine',a:'ice-core',b:'illuminated-glovebox'}];return [use];
  });
  if(variant.includes('tow')){
   const start=actions.findIndex(a=>a.type==='combine'&&pair(a.a,a.b)===pair('spare-drive','toolkit'));assert(start>=0);
   actions=actions.slice(0,start).concat([{type:'combine',a:'recovery-rope',b:'tow-eye'},{type:'combine',a:'rover',b:'tow-line'},{type:'combine',a:'rover',b:'damaged-crawler'}],actions.slice(start+3).flatMap((a):Action[]=>a.type==='combine'&&pair(a.a,a.b)===pair('crawler','rest-refuge')?[{type:'combine',a:'towed-crawler',b:'rest-refuge'},{type:'combine',a:'spare-drive',b:'toolkit'},{type:'combine',a:'serviced-drive',b:'drive-coupling'},{type:'combine',a:'replacement-drive',b:'towed-crawler'}]:[a]));
  }
  const g=M.replay(s,actions,390);assert(g.state.completed);assert.equal(M.token(g.state,'rover')!.slots['rescue-route'],'rescue-route');if(s.id.includes('creature')){const ship=M.token(g.state,'docked-vehicle')!;assert(ship.components!.includes('creature-core'));assert(ship.components!.includes('core-tube'));}save(g);
 });
 test(`${s.id}: all checkpoint chapter destinations retained after cuts`,()=>{
  for(const cp of s.checkpoints!){const g=M.checkpoint(s,cp.id,390),old=M.checkpoint(before,cp.id,390);assert.equal(s.chapters[g.state.chapter].id,before.chapters[old.state.chapter].id,cp.id);assert.equal(g.state.completed,old.state.completed,cp.id);assert.equal(M.pendingMilestone(s,g),null);}
 });
}
