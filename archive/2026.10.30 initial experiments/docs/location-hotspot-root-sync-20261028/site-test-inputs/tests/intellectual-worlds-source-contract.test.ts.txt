import {expectedSourceHashAfterMarsNaturalOrders} from '../experiments/tangible-campaign/integration/mars-natural-orders-source-guard.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterIntellectualWorlds} from '../experiments/tangible-campaign/integration/intellectual-worlds-source-guard.ts';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)),sha=(p:string)=>createHash('sha256').update(read(p)).digest('hex');
const base='experiments/tangible-campaign/evidence/intellectual-worlds-20261028/';
const parent=JSON.parse(read(base+'parent-source-inventory.json').toString());
const next=JSON.parse(read('experiments/tangible-campaign/reviews/intellectual-worlds/source-successors.json').toString());
test('intellectual worlds exact source successor keeps all c85 before bytes and rejects unknown ancestry',()=>{
 assert.equal(next.baseCommit,'c85b48cfd4006fe00eae90f7e22d7984201a534d');
 for(const [path,row]of Object.entries<any>(next.files)){
  assert.equal(row.beforeSha256,parent[path].sha256,path);assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);
  assert.equal(sha(path),expectedSourceHashAfterMarsNaturalOrders(path,row.afterSha256),path);assert.equal(expectedSourceHashAfterIntellectualWorlds(path,row.beforeSha256),expectedSourceHashAfterMarsNaturalOrders(path,row.afterSha256));
  assert.throws(()=>expectedSourceHashAfterIntellectualWorlds(path,'0'.repeat(64)),/exact c85 predecessor/);
 }
 for(const [path,row]of Object.entries<any>(parent))if(path.startsWith('experiments/tangible-campaign/ui/campaigns/')||path.endsWith('/source-successors.json')||path.startsWith('experiments/tangible-campaign/engine/')||path.startsWith('experiments/tangible-campaign/schema/')||path.startsWith('experiments/tangible-campaign/ui/campaign-')||path==='experiments/tangible-campaign/reviews/lifecycle/audit.json')assert.equal(sha(path),expectedSourceHashAfterIntellectualWorlds(path,row.sha256),path+' preserved c85 bytes or exact declared successor');
 assert.equal(expectedSourceHashAfterIntellectualWorlds('unrelated','a'.repeat(64)),'a'.repeat(64));
});
test('all three integrated modules follow exact accepted author bytes through declared successors, with old snapshots intact',()=>{
 const expected:{[key:string]:string}={
 'atlas-intellectual-history.ts':'c308422e0f8264eb0771192b3ca904bc34d33f38e82fbc7f9561030cbe972a78',
 'divinity-disputed-questions.ts':'b330846d4a799985dfd0e380106e7fcdf0aaecc558c93da722a42f38f7d49b6b',
 'divinity-light-text-workshop.ts':'c194d6adb98fc32e812e0e9d10ad2e65ad921bea2bc42eb97b7f74360f616b0c'};
 for(const [name,h]of Object.entries(expected)){const path='experiments/tangible-campaign/ui/campaigns/'+name;assert.equal(sha(path),expectedSourceHashAfterMarsNaturalOrders(path,h),name);}
 const snapshots=JSON.parse(read(base+'input-snapshots.json').toString());
 for(const group of Object.values<any>(snapshots))for(const row of Array.isArray(group.files)?group.files:Object.values<any>(group.files))assert.equal(sha(row.snapshotPath),row.sha256,row.snapshotPath);
});
