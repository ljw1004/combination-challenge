import assert from 'node:assert/strict';import test from 'node:test';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
import {mars,marsCreature} from '../experiments/tangible-campaign/ui/stories/mars-water-vestibule-candidates.ts';
import {withMarsHabitatRooms} from '../experiments/tangible-campaign/ui/stories/mars-habitat-rooms.ts';
import {toLegacyScenario,toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
const bare=(state:M.State)=>{const {metrics,...rest}=state;return rest;};
for(const old of [mars,marsCreature]){
 const s=withMarsHabitatRooms(old,old.id+'-rooms'),route=s.checkpoints!.find(c=>c.id==='complete')!.actions;
 const save=(g:M.Game)=>{assert.deepEqual(M.restore(s,JSON.stringify(g)),g);const e={game:toLegacyGame(g),tops:{},seen:[]};assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave(e)).game)),g);};
 test(`${s.id}: authentic room ownership, no new inventory or recipe, original immutable`,()=>{
  assert.deepEqual(s.recipes,old.recipes);assert.deepEqual(s.items,old.items);assert.equal(old.chapters.length,24);assert.equal(s.chapters.length,25);assert.equal(route.length,old.checkpoints!.find(c=>c.id==='complete')!.actions.length+1);
  const flatten=(x:typeof s)=>x.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort();assert.deepEqual(flatten(s),flatten(old));
  const ext=s.locationPlan!.locations.find(l=>l.id==='M02-entrance')!,room=s.locationPlan!.locations.find(l=>l.id==='M02')!;
  assert.deepEqual(ext.hotspots,['sheltered-ice','refuge-contact-mast']);assert.deepEqual(room.hotspots,['warm-habitat']);assert.equal(room.background.asset,'/assets/locations/M02.webp');assert.equal(ext.background.asset,'/assets/locations/M02-entrance.webp');
  const l=toLegacyScenario(s);for(const e of [M.validateScenario(s),validateContentLifecycles([l]),validateConstructionContinuity([l]),validateObjectiveFlow([l]),validateLifecycleGraph([l])])assert.deepEqual(e,[]);
 });
 for(const width of [320,390])for(const alternative of [false,true])test(`${s.id}: ${width}px ${alternative?'wet-seed/blanket-first':'canonical'} full route, room transition, ending`,()=>{
  const actions:Action[]=route.flatMap(a=>{
   if(!alternative||a.type!=='combine')return [a];
   const p=[a.a,a.b].sort().join('|');
   if(p===['vestibule','tie-downs'].sort().join('|'))return [{type:'combine',a:'insulating-blanket',b:'vestibule'}];
   if(p===['anchored-vestibule','insulating-blanket'].sort().join('|'))return [{type:'combine',a:'tie-downs',b:'wrapped-vestibule'}];
   if(p===['seeds','planting-tray'].sort().join('|'))return [{type:'combine',a:'seeds',b:'filtered-water'}];
   if(p===['seed-tray','filtered-water'].sort().join('|'))return [{type:'combine',a:'planting-tray',b:'wet-seeds'}];return [a];
  });
  let g=M.createGame(s,width),entered=false;
  for(const a of actions){const before=g,r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+' '+r.message);g=r.game;
   if(g.state.currentLocation==='M02-entrance'&&before.state.currentLocation==='M01')assert(g.state.tokens.filter(t=>t.location==='M02-entrance').length<=10,'only useful original carry and exterior stock');
   if(g.state.currentLocation==='M02'&&before.state.currentLocation==='M02-entrance'){
    entered=true;assert.deepEqual(g.state.tokens.filter(t=>t.location==='M02').map(t=>t.kind).sort(),['clear-cover','meltwater','planting-tray','seeds','water-filter']);
    assert.equal(M.token(before.state,'meltwater')!.location,'M02-entrance');assert.equal(M.token(g.state,'meltwater')!.location,'M02');assert(g.events.at(-1)!.transfers!.some(t=>t.item==='meltwater'&&t.from==='M02-entrance'&&t.to==='M02'));
    for(const k of ['insulated-vestibule','solar-radio'])assert.deepEqual(M.token(g.state,k),M.token(before.state,k),'finished exterior stays put');
    assert.deepEqual(bare(M.undo(g).game.state),bare(before.state));save(g);
   }
   for(const l of g.state.locations)assert.deepEqual(M.locationFootprint(s,g.state,l.id).outOfBounds,[]);
  }
  assert(entered);assert(g.state.completed);save(g);if(s.id.includes('creature'))assert(M.token(g.state,'docked-vehicle')!.components!.includes('creature-core'));
 });
 test(`${s.id}: new cabin checkpoint and all original targets survive the chapter insertion`,()=>{
  for(const cp of s.checkpoints!){const g=M.checkpoint(s,cp.id,390);assert.equal(M.pendingMilestone(s,g),null);if(cp.id==='chapter-habitat-seedlings'){assert.equal(s.chapters[g.state.chapter].id,'habitat-seedlings');save(g);}else{const prior=M.checkpoint(old,cp.id,390);assert.equal(s.chapters[g.state.chapter].id,old.chapters[prior.state.chapter].id);assert.equal(g.state.completed,prior.state.completed);}}
 });
}
