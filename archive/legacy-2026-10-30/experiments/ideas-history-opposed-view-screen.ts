/** Source-exposed scenario-data control only. No engine edits, player or integrated-learning claim. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const files=['experiments/geometric-materials-engine.ts','experiments/geometric-materials-types.ts','experiments/geometric-materials-content.ts','experiments/geometric-materials-geometry.ts'];
const source=Object.fromEntries(files.map(p=>[p,readFileSync(p)]));const hash=(b:Buffer)=>createHash('sha256').update(b).digest('hex');
const {createGeometricMaterials,stepGeometricMaterials,selectGeometricMaterials,geometricMaterialsWorld}=await import('./geometric-materials-engine.ts');
const {MAPS}=await import('./geometric-materials-content.ts');
import type {Action,State} from './geometric-materials-types.ts';
const turn:[[number,number,number],[number,number,number],[number,number,number]]=[[-1,0,0],[0,-1,0],[0,0,1]];
// This additional public target fixture exists only inside this isolated process; existing maps/files are unchanged.
MAPS.push({id:'opposed-control',label:'Source-exposed opposed-ray fixture',targets:[{id:'east',center:[5,0,.5],front:[-1,0,0]},{id:'west',center:[-5,0,.5],front:[1,0,0]}],places:[],goals:[],access:[],initial:[]});
function run(){let s=selectGeometricMaterials(createGeometricMaterials({catalogue:'complete'}),'opposed-control');const entries:unknown[]=[];const act=(a:Action)=>{const before=s;const next=stepGeometricMaterials(s,a);entries.push({action:a,accepted:next.accepted,response:next.response,before:geometricMaterialsWorld(before),after:geometricMaterialsWorld(next)});s=next;return s;};return {get state(){return s;},entries,act};}
const place=(design:string,at:[number,number,number],rotation?:typeof turn):Action=>({type:'combine',a:design,b:'place:floor',context:{operation:'move',at,...(rotation?{rotation}:{})}});
const observe=(id:string,t:string):Action=>({type:'combine',a:id,b:'target:'+t,context:{operation:'observe'}});
const current=(s:State)=>s.boards.find(b=>b.id==='opposed-control')!;
const single=run();single.act(place('camera',[0,0,0]));const camera=current(single.state).objects[0]!.id;single.act(observe(camera,'east'));single.act(place(camera,[0,0,0],turn));single.act(observe(camera,'west'));
const dual=run();dual.act(place('camera',[0,0,0]));const dc=current(dual.state).objects[0]!.id;dual.act(place('record-plate',[1,0,0],turn));const dp=current(dual.state).objects[1]!.id;dual.act({type:'combine',a:dc,b:dp,context:{operation:'attach'}});dual.act(observe(dc,'east'));dual.act(place(dc,[0,0,0],turn));dual.act(observe(dc,'west'));
const coincident=run();coincident.act(place('camera',[0,0,0]));coincident.act(place('camera',[0,0,0],turn));
const separate=run();separate.act(place('camera',[2,0,0]));const ec=current(separate.state).objects[0]!.id;separate.act(place('camera',[-2,0,0],turn));const wc=current(separate.state).objects[1]!.id;separate.act(observe(ec,'east'));separate.act(observe(wc,'west'));
const results={singleRotating:single.entries,fixedOppositePlates:dual.entries,coincidentCameras:coincident.entries,separateOutwardCameras:separate.entries};
assert.deepEqual(single.entries.map((e:any)=>e.accepted),[true,true,true,true]);
assert.deepEqual(dual.entries.map((e:any)=>e.accepted),[true,true,true,false,true,false]);
assert.deepEqual(coincident.entries.map((e:any)=>e.accepted),[true,false]);
assert.deepEqual(separate.entries.map((e:any)=>e.accepted),[true,true,true,true]);
const singleRecords=current(single.state).objects.flatMap(o=>o.parts.flatMap(p=>p.records));assert.equal(singleRecords.length,2);assert(singleRecords.every(r=>JSON.stringify(r.center)==='[0,0,0.5]'));
const separateRecords=current(separate.state).objects.flatMap(o=>o.parts.flatMap(p=>p.records));assert.equal(separateRecords.length,2);assert.notDeepEqual(separateRecords[0]!.center,separateRecords[1]!.center);
for(const p of files)if(hash(readFileSync(p))!==hash(source[p]!))throw Error('Physical source changed during control: '+p);
const summary={at:new Date().toISOString(),kind:'source-exposed fixed target fixture, not integrated engine or player',sourceHashes:Object.fromEntries(files.map(p=>[p,hash(source[p]!)])),counts:Object.fromEntries(Object.entries(results).map(([name,entries])=>[name,{accepted:entries.filter((e:any)=>e.accepted).length,rejected:entries.filter((e:any)=>!e.accepted).length}])),findings:['Whole camera rotation makes both opposed observations from the same center.','Two fixed opposing opaque plates block both tested incoming views.','Coincident camera bodies collide.','Separate outward-facing fixed cameras produce both observations from different centers; remains lawful where common-center service is not required.'],limitations:'One explicit center/fixture and construction classes; no global impossibility, learning value or length proof. Historical observations are not simultaneous current views.'};
const out='results/ideas-history-opposed-view-control';mkdirSync(out+'/snapshot',{recursive:true});for(const p of files){const dest=out+'/snapshot/'+p;mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});writeFileSync(dest,source[p]!);}writeFileSync(out+'/capture.json',JSON.stringify(results,null,2)+'\n');writeFileSync(out+'/summary.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
