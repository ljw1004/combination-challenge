import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {M,L} from '../revision-v5-baghdad-calculation/runtime.mjs';
const root=import.meta.dirname;
const base=JSON.parse(fs.readFileSync(root+'/../revision-v5-baghdad-calculation/scenario.json'));
const s=JSON.parse(fs.readFileSync(root+'/scenario.json'));
const patch=JSON.parse(fs.readFileSync(root+'/motion-id-patch.json'));
const baseHash=crypto.createHash('sha256').update(fs.readFileSync(root+'/../revision-v5-baghdad-calculation/scenario.json')).digest('hex');
assert.equal(baseHash,patch.baseSha256);
const candidateHash=crypto.createHash('sha256').update(fs.readFileSync(root+'/scenario.json')).digest('hex');
assert.equal(candidateHash,patch.candidateSha256);
const applied=structuredClone(base);
for(const op of patch.operations){
 const collection=applied[op.collection],old=collection.find(x=>x.id===op.id);
 if(op.op==='add'&&!op.field){assert.equal(old,undefined);collection.push(op.value);continue;}
 assert.ok(old);if(op.op==='replace')assert.deepEqual(old[op.field],op.before);else assert.equal(old[op.field],undefined);
 old[op.field]=op.value;
}
assert.deepEqual(applied,s);
const localIds=new Set(['position-times','direction-diagram','fall-record','mass-comparison','orbit-distances','force-rule','motion-differences','acceleration-record','force-comparison','orbital-geometry','orbit-model','cross-orbit-check','terrestrial-account','shared-motion-account','scope-of-law','mathematical-treatise']);
assert.deepEqual(base.items.map(x=>x.id),s.items.map(x=>x.id));
assert.deepEqual(base.recipes.map(x=>x.id),s.recipes.map(x=>x.id));
for(const b of base.items){const a=s.items.find(x=>x.id===b.id);if(!localIds.has(b.id))assert.deepEqual(a,b);else {const strip=o=>Object.fromEntries(Object.entries(o).filter(([k])=>!['label','description','sources','reading'].includes(k)));assert.deepEqual(strip(a),strip(b));}}
for(const b of base.recipes){const a=s.recipes.find(x=>x.id===b.id);if(!localIds.has(b.out))assert.deepEqual(a,b);else {const strip=o=>Object.fromEntries(Object.entries(o).filter(([k])=>!['description','sources'].includes(k)));assert.deepEqual(strip(a),strip(b));}}
for(const b of base.stages){const a=s.stages.find(x=>x.id===b.id);if(b.id!=='motion')assert.deepEqual(a,b);else {
 assert.deepEqual(a.carry,b.carry);assert.deepEqual(a.area,b.area);assert.deepEqual(a.caches.map(x=>x.items),b.caches.map(x=>x.items));
 assert.deepEqual(a.objectives.map(({text,...x})=>x),b.objectives.map(({text,...x})=>x));
}}
for(const key of Object.keys(base))if(!['items','recipes','stages','sources'].includes(key))assert.deepEqual(s[key],base[key]);
for(const source of base.sources)assert.deepEqual(s.sources.find(x=>x.id===source.id),source);
const errors=[...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])];assert.deepEqual(errors,[]);
for(const collection of ['items','recipes','stages','sources'])assert.equal(new Set(s[collection].map(x=>x.id)).size,s[collection].length);
const sources=new Set(s.sources.map(x=>x.id));for(const collection of ['items','recipes'])for(const x of s[collection])for(const id of x.sources??[])assert.ok(sources.has(id),id);
const historical=JSON.parse(fs.readFileSync(root+'/../revision-v5-baghdad-calculation/author-route.json'));
let game=M.createGame(s),checkpoint=null,fullActions=0;
for(const action of historical){if(s.stages[game.state.stage]?.id==='motion'&&!checkpoint)checkpoint=game;const result=M.applyAction(s,game,action);assert.equal(result.accepted,true,result.message);game=result.game;fullActions++;}
assert.equal(game.state.completed,true);assert.ok(checkpoint);
const local=s.recipes.filter(r=>localIds.has(r.out));assert.equal(local.length,10);
let orders=[];
function enumerate(used,available,route){if(route.length===10){orders.push(route);return;}for(const r of local)if(!used.has(r.id)&&available.has(r.a)&&available.has(r.b)){enumerate(new Set([...used,r.id]),new Set([...available,r.out]),[...route,r.id]);}}
enumerate(new Set(),new Set(checkpoint.state.tokens.filter(t=>t.area===checkpoint.state.currentArea).map(t=>t.kind)),[]);
assert.equal(orders.length,35);
const localStates=new Set();let localRuns=0;
for(const reverse of [false,true])for(const order of orders){let g=checkpoint;localStates.add('');for(const id of order){const r=local.find(x=>x.id===id);const action={type:'combine',a:reverse?r.b:r.a,b:reverse?r.a:r.b};const result=M.applyAction(s,g,action);assert.equal(result.accepted,true,result.message);g=result.game;localStates.add(local.filter(x=>g.state.discovered.includes(x.out)).map(x=>x.id).sort().join('|'));}assert.equal(M.stageComplete(s,g.state),true);const adv=M.applyAction(s,g,{type:'advance'});assert.equal(adv.accepted,true);assert.equal(s.stages[adv.game.state.stage].id,'longitude');localRuns++;}
assert.equal(localStates.size,23);
const R=6.37e6,r=60*R,T=27.3*86400,dt=1,ground=4.90;
const orbitalDeparture=2*Math.PI**2*r*(dt/T)**2;
const scaledDeparture=ground/60**2;
const report={kind:'Content/author-known engine diagnostics; not source-blind play, UI/browser testing, or enjoyment evidence',baseSha256:baseHash,candidateSha256:candidateHash,checks:{idAddressedPatchReproducesCandidate:true,unrelatedItemsRecipesAnd28StagesUnchanged:true,allGraphEdgesAndLifecycleContractsUnchanged:true,allBaseSourceRecordsUnchanged:true,validationErrors:errors,fullExistingAuthorRouteAccepted:true,fullRouteActions:fullActions,fullRouteCombinations:game.state.metrics.combinations,allLocalOrderings:orders.length,bothInputDirectionsRuns:localRuns,distinctChapter14LogicalStates:localStates.size,noReadingActionsOrNewSteps:true,nextChapter:'longitude'},case:{EarthRadiusMetres:R,MoonRadiusMetres:r,periodSeconds:T,surfaceFallMetresIn1Second:ground,surfaceAccelerationMetresPerSecondSquared:9.80,orbitDerivedDepartureMetresIn1Second:orbitalDeparture,inverseSquareDepartureMetresIn1Second:scaledDeparture,bothRoundedMillimetres:Number((orbitalDeparture*1000).toFixed(2)),relativeDifference:(scaledDeparture-orbitalDeparture)/orbitalDeparture,displacementsNotAccelerations:true,comparisonApproximateNotExact:true},limits:['Every route used author-known recipe availability. No claim of independent discoverability, voluntary continuation, layout fit or fun.','Highlighting remains ordinary designed gameplay; no highlight use is counted as cheating or a proxy fun metric.','No UI, engine, schema, publication, base or integration write.']};
assert.equal(Number((scaledDeparture*1000).toFixed(2)),report.case.bothRoundedMillimetres);
fs.writeFileSync(root+'/validation.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(root+'/all-logical-routes.json',JSON.stringify(orders,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
