import test from 'node:test';import assert from 'node:assert/strict';
import {createGeometricMaterials,stepGeometricMaterials} from '../experiments/geometric-materials-engine.ts';
import {MAPS} from '../experiments/geometric-materials-content.ts';
import {rotation} from '../experiments/geometric-materials-geometry.ts';
import {faithfulViews} from '../experiments/geometric-materials-live-view.ts';
import type {State,Action,Target} from '../experiments/geometric-materials-types.ts';
const board=(s:State)=>s.boards.find(b=>b.id===s.map)!;
const act=(s:State,a:Action)=>{const n=stepGeometricMaterials(s,a);assert(n.accepted,n.response.join(';'));return n;};
const move=(a:string,at:[number,number,number],quarter=0):Action=>({type:'combine',a,b:'place:floor',context:{operation:'move',at,rotation:rotation('z',quarter)}});
const opposed:Target[]=[{id:'east',center:[15,10,.5],front:[-1,0,0]},{id:'west',center:[5,10,.5],front:[1,0,0]}];
test('pure default live view matches newly recorded optics and survives duplicate novelty rejection',()=>{
 let s=createGeometricMaterials({catalogue:'complete'});s=act(s,move('camera',[2,1,0]));const id=board(s).objects.at(-1)!.id;
 const before=JSON.stringify(s),maps=JSON.stringify(MAPS),views=faithfulViews(s);assert.equal(JSON.stringify(s),before);assert.equal(JSON.stringify(MAPS),maps);assert.equal(views.length,1);
 const a:Action={type:'combine',a:id,b:'target:beacon',context:{operation:'observe'}};s=act(s,a);const record=board(s).objects.at(-1)!.parts.flatMap(p=>p.records)[0]!;const {object,...view}=views[0]!;const {id:rid,intervention,...actual}=record;assert.deepEqual(view,actual);assert.deepEqual(faithfulViews(s),views);assert.equal(stepGeometricMaterials(s,a).accepted,false);assert.deepEqual(faithfulViews(s),views);
 // Returned witnesses do not alias target or state objects.
 views[0]!.target[0]=999;assert.equal(faithfulViews(s)[0]!.target[0],5);
});
test('explicit live targets do not mutate old maps; direct half-turn reuses same actual camera',()=>{
 let s=createGeometricMaterials({catalogue:'complete'});s=act(s,move('camera',[10,10,0]));const id=board(s).objects.at(-1)!.id,maps=JSON.stringify(MAPS);assert.deepEqual(faithfulViews(s,opposed).map(v=>v.subject),['east']);
 s=act(s,move(id,[10,10,0],2));assert.deepEqual(faithfulViews(s,opposed).map(v=>v.subject),['west']);s=act(s,move(id,[10,10,0]));assert.deepEqual(faithfulViews(s,opposed).map(v=>v.subject),['east']);assert.equal(JSON.stringify(MAPS),maps);assert.equal(board(s).objects.at(-1)!.parts.flatMap(p=>p.records).length,0);
});
test('actual obstruction invalidates live service despite retained old observation',()=>{
 let s=createGeometricMaterials({catalogue:'complete'});s=act(s,move('camera',[2,1,0]));const id=board(s).objects.at(-1)!.id;s=act(s,{type:'combine',a:id,b:'target:beacon',context:{operation:'observe'}});s=act(s,move('clay',[3,1,0]));assert.equal(faithfulViews(s).length,0);assert.equal(board(s).objects.find(o=>o.id===id)!.parts.flatMap(p=>p.records).length,1);
 const obstacle=board(s).objects.at(-1)!.id;s=act(s,move(obstacle,[3,3,0]));assert.equal(faithfulViews(s).length,1);
});
test('separate outward cameras stay valid for separate-front purpose, not same viewpoint',()=>{
 let s=createGeometricMaterials({catalogue:'complete'});s=act(s,move('camera',[12,10,0]));s=act(s,move('camera',[8,10,0],2));const views=faithfulViews(s,opposed);assert.equal(views.length,2);assert.notDeepEqual(views[0]!.center,views[1]!.center);
});
test('live target validation rejects malformed or duplicate targets without state mutation',()=>{const s=createGeometricMaterials();assert.throws(()=>faithfulViews(s,[opposed[0]!,opposed[0]!]));assert.throws(()=>faithfulViews(s,[{id:'bad',center:[0,0,0],front:[1,1,0]}]));});
test('frozen repaired internal optical-path rule is retained for opaque and clear panels',()=>{
 for(const material of ['foil','clear-film']){
  let s=createGeometricMaterials({catalogue:'complete'});s=act(s,move('camera',[2,1,0]));const camera=board(s).objects.at(-1)!.id;
  s=act(s,{type:'combine',a:material,b:'place:floor',context:{operation:'move',at:[0,1,.5],rotation:rotation('y',1)}});
  const live=faithfulViews(s);const observed=stepGeometricMaterials(s,{type:'combine',a:camera,b:'target:beacon',context:{operation:'observe'}});
  assert.equal(observed.accepted,material==='clear-film');assert.equal(live.length,material==='clear-film'?1:0);
  if(live.length)assert(live[0]!.focalBoundaries!.length>0);
 }
});
test('Fresh cardinal pose/target cases differentially agree with frozen observation acceptance',()=>{
 let checked=0;
 for(const x of [-2,0,2])for(const y of [1,3,6])for(const quarter of [0,1,2,3]){
  let s=createGeometricMaterials({catalogue:'complete'});const placed=stepGeometricMaterials(s,move('camera',[x,y,0],quarter));if(!placed.accepted)continue;s=placed;const camera=board(s).objects.at(-1)!.id;
  for(const target of MAPS.find(m=>m.id===s.map)!.targets){const expected=faithfulViews(s).some(v=>v.object===camera&&v.subject===target.id);const n=stepGeometricMaterials(s,{type:'combine',a:camera,b:'target:'+target.id,context:{operation:'observe'}});assert.equal(n.accepted,expected,JSON.stringify({x,y,quarter,target:target.id}));checked++;}
 }
 assert(checked>=50,`Only ${checked} legal pose-target controls`);
});
