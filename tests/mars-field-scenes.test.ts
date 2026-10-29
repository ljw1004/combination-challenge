import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync as originalReadFileSync} from 'node:fs';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame,toLegacyScenario} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {scenario as s,marsFieldScenes} from '../experiments/tangible-campaign/ui/stories/mars-field-scenes.ts';
import {scenario as merged} from '../experiments/tangible-campaign/ui/stories/mars-locations.ts';
import {scenario as prior} from '../experiments/tangible-campaign/ui/stories/mars-return-cargo.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
const route=s.checkpoints!.at(-1)!.actions;
const step=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+' '+r.message);return r.game;};
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===g.state.storyLocation);
const noMetrics=({metrics,...rest}:M.State)=>rest;

test('Mars successor changes geography and provenance, not recipes, earned travel, authentic stock or save identities',()=>{
 assert.equal(s.id,'mars-field-scenes-v6');assert.equal(merged.id,'mars-persistent-locations-v5');assert.deepEqual(s.recipes,merged.recipes);assert.deepEqual(s.hotspots,merged.hotspots);assert.deepEqual(s.milestones,merged.milestones);
 assert.deepEqual(s.items.map(({description,...x})=>x),merged.items.map(({description,...x})=>x));assert.deepEqual(s.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]),merged.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]));
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort(),merged.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort());assert.equal(s.locationPlan!.locations.length,26);assert.equal(s.locationPlan!.visits.length,24);
 assert(s.locationPlan!.visits.every(v=>v.chapterIds.length===1));for(const c of prior.chapters.filter(c=>c.carry))assert.deepEqual(s.locationPlan!.visits.find(v=>v.chapterIds.includes(c.id))!.carry,c.carry,'preserve exact authored narrow carry');
 for(const l of s.locationPlan!.locations){assert.equal(l.background.stableKey,l.id);assert(readFileSync(new URL('../public'+l.background.asset,import.meta.url)).length>1000);}
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.hotspots).sort(),s.hotspots.map(h=>h.id).sort());
 for(const id of ['scale-card','specimen-rack','core-rack','scaled-core','scaled-gravel-view','orbital-cabin'])assert(!s.items.some(i=>i.id===id));
 assert.equal(s.recipes.find(r=>r.id==='homebound-12-docked-vehicle')!.b,'@orbital-cabin');assert(s.recipes.some(r=>r.id==='collect-gravel-chip'));
 const legacy=toLegacyScenario(s);for(const errors of [M.validateScenario(s),validateContentLifecycles([legacy]),validateObjectiveFlow([legacy]),validateConstructionContinuity([legacy]),validateLifecycleGraph([legacy])])assert.deepEqual(errors,[]);
 for(const old of [prior,merged]){const g=M.createGame(old);assert.deepEqual(M.restore(old,JSON.stringify(toLegacyGame(g))),g);assert.throws(()=>M.restore(s,JSON.stringify(g)),/Invalid campaign save/);}
});
for(const width of [320,375,390])for(const mode of ['combine','drop','reverse-ordinary-drop'])test(`Mars229 ${width}/${mode}: new-panel ownership, carry overlap, bounds, earned travel, save and Undo`,()=>{
 let g=M.createGame(s,width);const rows:{entry:number;peak:number}[]=[];
 for(const source of route){const row=rows[g.state.chapter]??={entry:local(g).length,peak:0};row.peak=Math.max(row.peak,local(g).length);
  const reverse=source.type==='combine'&&mode==='reverse-ordinary-drop'&&!source.a.startsWith('@')&&!source.b.startsWith('@')&&!s.recipes.some(r=>r.at&&[r.a,r.b].includes(source.a)&&[r.a,r.b].includes(source.b));
  const a:Action=source.type==='combine'&&mode!=='combine'?{type:'drop',item:reverse?source.b:source.a,target:reverse?source.a:source.b}:source;
  const before=g;g=step(g,a);
  if(a.type==='advance'||g.state.enteredTravels?.length!==before.state.enteredTravels?.length){
   if(a.type==='advance')for(const t of before.state.tokens){assert(M.token(g.state,t.id),'travel deleted a surviving item');if(M.token(g.state,t.id)!.location===t.location)assert.deepEqual(M.token(g.state,t.id),t,'left-behind token moved');}
   assert.deepEqual(noMetrics(M.undo(g).game.state),noMetrics(before.state));assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))).state,g.state);
   const area=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));
   for(const t of g.state.tokens.filter(t=>M.token(before.state,t.id)&&M.token(before.state,t.id)!.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location&&M.token(before.state,b.id))){const a0=M.token(before.state,t.id)!,b0=M.token(before.state,b.id)!;assert(area(t,b)<=(a0.location===b0.location?area(a0,b0):0)+.01,`${t.id}/${b.id}: new carry overlap`);}
  }
  for(const t of g.state.tokens){assert(t.x>=48&&t.x<=g.state.width-48);assert(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844);}
 }
 assert(g.state.completed);assert.equal(g.state.locations.length,26);assert.equal(Math.max(...rows.map(r=>r.entry)),15);assert.equal(Math.max(...rows.map(r=>r.peak)),16);
 assert.deepEqual(rows.map(r=>[r.entry,r.peak]),[[9,9],[15,16],[14,14],[12,14],[8,8],[5,5],[9,9],[10,10],[6,7],[7,9],[7,7],[12,12],[8,8],[9,9],[7,7],[5,7],[10,14],[9,14],[9,13],[5,5],[6,6],[8,13],[15,15],[10,10]]);
 assert.deepEqual(g.state.enteredTravels,['crawler-to-recovery-camp','ascent-to-orbital-rendezvous']);
});

test('all25 checkpoints and26 persistent panels retain old creations and correct backgrounds',()=>{
 for(const c of s.checkpoints!){const g=M.replay(s,c.actions,375);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}
 const g=M.replay(s,route,375),h=locationHarness(s,JSON.stringify({game:toLegacyGame(g),seen:[],tops:{}}),{width:375});for(const l of s.locationPlan!.locations)assert(h.app.innerHTML.includes(`data-background="${l.id}"`));for(const t of g.state.tokens)assert(h.thing(t.id),t.id);assert.match(h.app.innerHTML,/height:21944px/);
});

test('both recovery paths retain optional repair kit; core camera alternative and reverse photograph comparison stay usable',()=>{
 const start=route.findIndex(a=>a.type==='combine'&&a.a==='spare-drive'&&a.b==='toolkit');
 const tow:Action[]=route.slice(0,start).concat([{type:'combine',a:'recovery-rope',b:'tow-eye'},{type:'combine',a:'rover',b:'tow-line'},{type:'combine',a:'rover',b:'damaged-crawler'}],route.slice(start+3).flatMap(a=>a.type==='combine'&&a.a==='crawler'&&a.b==='rest-refuge'?[{...a,a:'towed-crawler'},{type:'combine',a:'spare-drive',b:'toolkit'},{type:'combine',a:'serviced-drive',b:'drive-coupling'},{type:'combine',a:'replacement-drive',b:'towed-crawler'}] as Action[]:[a]));
 const camera=route.map(a=>a.type==='combine'&&a.a==='ice-core'&&a.b==='camera'?{...a,a:'ice-core',b:'field-camera'}:a.type==='combine'&&a.a==='ripple-view'&&a.b==='gravel-view'?{...a,a:a.b,b:a.a}:a);
 for(const actions of [tow,camera])for(const width of [320,375,390]){const g=M.replay(s,actions,width);assert(g.state.completed);assert.deepEqual(g.state.enteredTravels,['crawler-to-recovery-camp','ascent-to-orbital-rendezvous']);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}
});

test('cover-first or water-first seedlings and heater-or-charger melt routes finish through later nursery',()=>{
 const seed=route.findIndex(a=>a.type==='combine'&&a.a==='seed-tray'&&a.b==='water-canister');assert(seed>=0);
 const orders:Action[][]=[
  [{type:'combine',a:'seed-tray',b:'clear-cover'},{type:'combine',a:'covered-seed-tray',b:'water-canister'},{type:'combine',a:'watered-covered-tray',b:'@warm-habitat'}],
  [{type:'combine',a:'seed-tray',b:'water-canister'},{type:'combine',a:'watered-seed-tray',b:'clear-cover'},{type:'combine',a:'watered-covered-tray',b:'@warm-habitat'}],
 ];
 for(const order of orders)for(const heater of [false,true])for(const reverse of [false,true]){
  const actions=route.flatMap((a,i):Action[]=>{if(i===seed)return order;if(i===seed+1||i===seed+2)return[];return[a.type==='combine'&&a.b==='@sheltered-ice'&&heater?{...a,a:'heater'}:a];}).map(a=>a.type==='combine'&&reverse&&!a.a.startsWith('@')&&!a.b.startsWith('@')&&!s.recipes.some(r=>r.at&&[r.a,r.b].includes(a.a)&&[r.a,r.b].includes(a.b))?{...a,a:a.b,b:a.a}:a);
  const g=M.replay(s,actions,375);assert(g.state.completed);assert(M.token(g.state,'greenhouse')?.slots);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
 }

});

test('four legal independent preparation orders complete every current chapter without future-source imports',()=>{
 const blocks:Action[][]=[[]];for(const a of route){if(a.type==='advance')blocks.push([]);else blocks.at(-1)!.push(a);}blocks.pop();
 for(const seed of [1,7,29,101]){let n=seed,g=M.createGame(s,375);const rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};for(const actions of blocks){let pending=[...actions];while(pending.length){const start=Math.floor(rand()*pending.length);let chosen=-1,next:M.Game|undefined;for(let i=0;i<pending.length;i++){const index=(start+i)%pending.length,r=M.applyAction(s,g,pending[index]);if(r.accepted){chosen=index;next=r.game;break;}}assert(chosen>=0,`seed${seed}, chapter${g.state.chapter}: no legal preparation`);pending.splice(chosen,1);g=next!;}g=step(g,{type:'advance'});}assert(g.state.completed);}
});
