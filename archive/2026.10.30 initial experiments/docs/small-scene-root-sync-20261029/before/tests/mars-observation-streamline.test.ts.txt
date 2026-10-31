import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame,toLegacyScenario} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {scenario as mars} from '../experiments/tangible-campaign/ui/stories/mars-locations.ts';
import {scenario as oldMars} from '../experiments/tangible-campaign/ui/stories/mars-return-cargo.ts';
import {scenarios as historical} from '../experiments/tangible-campaign/ui/pre-location-scenarios.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {lifecycleAudit} from '../experiments/tangible-campaign/integration/current-lifecycle-audit.ts';
import {scenarios as current} from '../experiments/tangible-campaign/ui/current-scenarios.ts';

const root=new URL('../',import.meta.url),review='experiments/tangible-campaign/reviews/mars-observation-streamline/';
// Only whole-Site provenance SHA reads are contextual. Gameplay/controller/lifecycle imports and data remain actual root.
const sourcePaths=JSON.parse(readFileSync(new URL('docs/location-hotspot-root-sync-20261028/test-context-map.json',root),'utf8')).siteSourceInputPathBySitePath;

const retired=['scale-card','specimen-rack','core-rack','scaled-core','scaled-gravel-view'];
const route=mars.checkpoints!.find(c=>c.id==='complete')!.actions;
const match=(s:Scenario,a:Action)=>a.type==='combine'?s.recipes.find(r=>[r.a,r.b].sort().join('|')===[a.a,a.b].sort().join('|')):undefined;
const withoutMetrics=(state:M.State)=>{const {metrics,...rest}=state;return rest;};
const act=(g:M.Game,a:Action)=>{const r=M.applyAction(mars,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
const before=(id:string,width=375)=>M.replay(mars,route.slice(0,route.findIndex(a=>match(mars,a)?.id===id)),width);
function towRoute():Action[]{
 const start=route.findIndex(a=>match(mars,a)?.id==='rescue-6-serviced-drive');
 assert(start>=0);
 return route.slice(0,start).concat([{type:'combine',a:'recovery-rope',b:'tow-eye'},{type:'combine',a:'rover',b:'tow-line'},{type:'combine',a:'rover',b:'damaged-crawler'}],route.slice(start+3).flatMap(a=>a.type==='combine'&&a.a==='crawler'&&a.b==='rest-refuge'?[{...a,a:'towed-crawler'},{type:'combine',a:'spare-drive',b:'toolkit'},{type:'combine',a:'serviced-drive',b:'drive-coupling'},{type:'combine',a:'replacement-drive',b:'towed-crawler'}] as Action[]:[a]));
}
function assertSaved(g:M.Game){
 assert.deepEqual(M.restore(mars,JSON.stringify(g)),g,'canonical JSON including complete Undo history');
 const envelope={game:toLegacyGame(g),tops:Object.fromEntries(g.state.locations.map((l,i)=>[l.id,i*844])),seen:[]};
 for(const save of [JSON.stringify(envelope),encodeSave(envelope)])assert.deepEqual(M.restore(mars,JSON.stringify(decodeSave(save).game)),g,'v1 JSON/CCSP1 including history');
}

test('exact frozen source lineage, all forty historical scenario objects and old observation chains stay unchanged',()=>{
 const manifest=JSON.parse(readFileSync(new URL(review+'source-successors.json',root),'utf8'));
 assert.equal(manifest.parentSourceSealSha256,'60aa75dd30d776867324f738b900ed86e5c5188558c148666c0e6111e2b1b9be');
 const sha=(path:string)=>createHash('sha256').update(readFileSync(new URL(sourcePaths[path]??path,root))).digest('hex');
 for(const [path,row]of Object.entries<any>(manifest.files)){assert.equal(sha(path),row.afterSha256,path);assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);}
 const prior=JSON.parse(readFileSync(new URL(review+'historical-scenario-hashes.json',root),'utf8'));assert.equal(historical.length,40);
 for(const s of historical)assert.equal(createHash('sha256').update(JSON.stringify(s)).digest('hex'),prior[s.id],s.id);
 for(const id of retired)assert(oldMars.items.some(i=>i.id===id));
 assert(oldMars.recipes.some(r=>r.id==='contrast-scale'));assert(oldMars.recipes.some(r=>r.id==='outcrop-12-core-rack'));
});
test('retired family has no remaining item, recipe, stock, carry, checkpoint, goal or milestone references',()=>{
 const exactReferences:string[]=[];const visit=(v:unknown)=>{if(typeof v==='string'&&retired.includes(v))exactReferences.push(v);else if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){visit(k);visit(x);}};visit(mars);assert.deepEqual(exactReferences,[]);
 for(const field of ['items','recipes','chapters','locationPlan'] as const)assert(!/Scaled core|Scaled gravel view|Scale card|specimen rack|pebble dimensions can be interpreted/i.test(JSON.stringify(mars[field])));
 assert.equal(route.length,229);assert.equal(mars.recipes.length,oldMars.recipes.length+1-3+1); // earned chip, three cuts, supported-camera alias
 assert.deepEqual(mars.milestones?.map(m=>m.id),['mars-rover','mars-water','mars-oxygen']);
 const legacy=toLegacyScenario(mars);for(const errors of [M.validateScenario(mars),validateContentLifecycles([legacy]),validateObjectiveFlow([legacy]),validateConstructionContinuity([legacy]),validateLifecycleGraph([legacy])])assert.deepEqual(errors,[]);
});

test('current audit uses exact successor lifecycle rows without discarding the retired unpublished evidence',()=>{
 const rows=lifecycleAudit.recipes.filter((r:any)=>r.world===mars.id);
 assert.equal(rows.length,mars.recipes.length);
 for(const r of mars.recipes){const row=rows.find((x:any)=>x.recipe===r.id)!;assert(row);assert.deepEqual(row.inputs,[r.a,r.b]);assert.deepEqual(row.lifecycles,r.lifecycle);}
 assert.deepEqual(lifecycleAudit.supersededUnpublishedRecipes.map((r:any)=>r.recipe),['outcrop-12-core-rack','outcrop-13-scaled-core','contrast-scale']);
 assert(current.some(s=>s.id===mars.id));assert.equal(historical.length,40);
});

for(const width of [320,375,390,600])for(const name of ['canonical','tow','field-camera-and-reversed-pair'] as const)test(`${width}px ${name}: full story, bounds, arrivals, both internal journeys, save and Undo`,()=>{
 const actions=name==='tow'?towRoute():name==='canonical'?route:route.map(a=>match(mars,a)?.id==='outcrop-14-core-profile'?{type:'combine' as const,a:'field-camera',b:'ice-core'}:match(mars,a)?.id==='contrast-pair'?{type:'combine' as const,a:'gravel-view',b:'ripple-view'}:a);
 let g=M.createGame(mars,width);const area=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(mars,a)+M.tokenHeight(mars,b))/2-Math.abs(a.y-b.y));
 for(const [i,a]of actions.entries()){
  const previous=g;g=act(g,a);let origin=previous.state;
  if((g.state.enteredTravels?.length??0)>(previous.state.enteredTravels?.length??0)){const noTravel=structuredClone(mars);for(const c of noTravel.chapters)delete c.travel;const stopped=M.applyAction(noTravel,previous,a);assert(stopped.accepted);origin=stopped.game.state;}
  for(const l of g.state.locations)assert.deepEqual(M.locationFootprint(mars,g.state,l.id).outOfBounds,[],`${i} ${l.id}`);
  for(const t of g.state.tokens.filter(t=>M.token(origin,t.id)&&M.token(origin,t.id)!.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location&&M.token(origin,b.id))){const oldA=M.token(origin,t.id)!,oldB=M.token(origin,b.id)!;assert(area(t,b)<=(oldA.location===oldB.location?area(oldA,oldB):0)+.01,`new carry overlap ${i} ${t.id}/${b.id}`);}
  if(previous.state.chapter!==g.state.chapter||previous.state.storyLocation!==g.state.storyLocation){
   if(previous.state.storyLocation===g.state.storyLocation){assert.deepEqual(g.state.tokens,previous.state.tokens);assert.deepEqual(g.state.hotspots,previous.state.hotspots);}
   assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(previous.state));
   assert.deepEqual(M.restore(mars,JSON.stringify(toLegacyGame(g))).state,g.state);
   if(g.state.openedCaches.length>previous.state.openedCaches.length){const fresh=g.state.tokens.filter(t=>t.location===g.state.storyLocation&&g.state.arrival?.supplies.some(x=>x.item===t.id)),old=g.state.tokens.filter(t=>t.location===g.state.storyLocation&&!fresh.includes(t));if(fresh.length&&old.length){assert(g.state.arrivalLayout?.active,'delivery divider');const divider=g.state.arrivalLayout!.dividerY;assert(fresh.every(t=>t.y-M.tokenHeight(mars,t)/2>divider),'fresh group below divider');assert(old.every(t=>t.y+M.tokenHeight(mars,t)/2<divider),'old group above divider');}}
  }
 }
 assert(g.state.completed);assert.equal(g.state.enteredTravels!.filter(id=>id==='crawler-to-recovery-camp').length,1);assert.equal(g.state.enteredTravels!.filter(id=>id==='ascent-to-orbital-rendezvous').length,1);
 for(const recipe of ['buried-story-11-layer-interpretation','departure-6-complete-field-archive','contrast-context','contrast-revise'])assert(g.events.some(e=>e.recipe===recipe),recipe+' remains meaningful');
 assertSaved(g);
});

test('all 25 successor checkpoints use the shortened route, and neither camera choice strands a later use',()=>{
 for(const c of mars.checkpoints!){const g=M.checkpoint(mars,c.id,375);assert.deepEqual(M.restore(mars,JSON.stringify(toLegacyGame(g))).state,g.state);}
 for(const id of ['outcrop-14-core-profile','outcrop-core-photograph-field-camera','contrast-pair']){
  const recipe=mars.recipes.find(r=>r.id===id)!;assert(!recipe.requires&&!recipe.at&&!recipe.install);
  for(const width of [320,375,390,600])for(const reverse of [false,true]){
   const g=before(id==='contrast-pair'?id:'outcrop-14-core-profile',width),a=reverse?recipe.b:recipe.a,b=reverse?recipe.a:recipe.b;
   assert(M.partners(mars,g.state,a).directions.some(d=>d.source===a&&d.target===b));
   const made=act(g,{type:'drop',item:a,target:b});assert(M.token(made.state,recipe.out!));assert.deepEqual(M.token(made.state,a),M.token(g.state,a));assert.deepEqual(M.token(made.state,b),M.token(g.state,b));
   assert.deepEqual(withoutMetrics(M.undo(made).game.state),withoutMetrics(g.state));assertSaved(made);
   const duplicate=M.applyAction(mars,made,{type:'drop',item:a,target:b});assert(!duplicate.accepted);assert.equal(duplicate.game.history.length,made.history.length);
  }
 }
});

for(const width of [320,375,390,600])test(`${width}px: actual visible goals and photo labels, no prose/Read needed for the pair`,()=>{
 const core=before('outcrop-14-core-profile',width),h=locationHarness(mars,JSON.stringify({game:core,tops:{},seen:[]}),{width});
 assert(h.app.innerHTML.includes('Photograph core layers'));assert(!h.app.innerHTML.includes('Scaled core'));
 const pair=before('contrast-pair',width),p=locationHarness(mars,JSON.stringify({game:pair,tops:{},seen:[]}),{width});
 assert(p.app.innerHTML.includes('Compare basin photographs'));assert(p.app.innerHTML.includes('Ripple photograph'));assert(p.app.innerHTML.includes('Gravel photograph'));assert(!p.app.innerHTML.includes('Scaled gravel view'));
 const made=act(pair,{type:'combine',a:'ripple-view',b:'gravel-view'}),next=locationHarness(mars,JSON.stringify({game:made,tops:{},seen:[]}),{width});assert(next.app.innerHTML.includes('Save basin comparison'));assert(!next.app.innerHTML.includes('Compare basin photographs'));
});

test('photographs compare offsite as records, without pretending to recapture or scale them',()=>{
 let g=before('contrast-pair');g=act(g,{type:'visit',location:'M13',carry:['ripple-view','gravel-view']});assert.equal(M.token(g.state,'field-camera')!.location,'M14');g=act(g,{type:'combine',a:'ripple-view',b:'gravel-view'});assert(M.token(g.state,'paired-terrain-views'));assert.match(mars.recipes.find(r=>r.id==='contrast-pair')!.description!,/No calibrated pebble dimensions/);
});

for(const width of [320,375,390,600])test(`${width}px: controller creation/reload/Undo and cross-panel photograph comparison`,()=>{
 const core=before('outcrop-14-core-profile',width),h=locationHarness(mars,JSON.stringify({game:core,tops:{},seen:[]}),{width});
 // The earned replay prefix includes the rover milestone; dismiss the actual
 // celebration rather than pretending a modal-covered scene is interactive.
 while(h.button('milestone-continue'))h.click(h.button('milestone-continue'));
 h.click(h.button('close'));h.click(h.thing('ice-core'));h.click(h.thing('camera'));
 assert(h.app.innerHTML.includes('Core layer photograph'));
 const loaded=locationHarness(mars,h.saved.get(h.key),{width});assert(loaded.app.innerHTML.includes('Core layer photograph'));
 // Reload completes the ordinary ready-chapter handoff. Undo that actual entry,
 // then the preceding creation; neither event is hidden or collapsed.
 assert.equal(M.restore(mars,JSON.stringify(loaded.state())).state.chapter,core.state.chapter+1);
 loaded.click(loaded.button('close'));loaded.click(loaded.button('undo'));assert(M.token(M.restore(mars,JSON.stringify(loaded.state())).state,'core-profile'));
 loaded.click(loaded.button('undo'));assert(!M.token(M.restore(mars,JSON.stringify(loaded.state())).state,'core-profile'));assert(loaded.app.innerHTML.includes('Photograph core layers'));
 let g=before('contrast-pair',width);g=act(g,{type:'relocate',item:'gravel-view',location:'M13',x:170,y:400});const prior=g;
 g=act(g,{type:'drop',item:'ripple-view',target:'gravel-view'});assert.equal(M.token(g.state,'paired-terrain-views')!.location,'M13');assert.deepEqual(M.token(g.state,'ripple-view'),M.token(prior.state,'ripple-view'));assert.deepEqual(g.history.at(-1),prior.state);assertSaved(g);assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(prior.state));
});
