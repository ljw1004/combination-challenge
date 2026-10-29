import {expectedSourceHashAfterMilestoneAtlas} from './milestone-atlas-source-guard.ts';
/** Preserve the content-only release's frozen hashes. The later, explicitly
 * requested arrival UI is an exact successor, never a blanket source exemption. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const manifest=JSON.parse(readFileSync(new URL('../reviews/arrivals/source-successors.json',import.meta.url),'utf8')) as {
 schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>;
};
const reviewedPaths=[
 'experiments/tangible-campaign/engine/model.ts',
 'experiments/tangible-campaign/ui/campaign-controller.test.ts',
 'experiments/tangible-campaign/ui/campaign-main.ts',
 'experiments/tangible-campaign/ui/campaign.css',
];
assert.equal(manifest.schemaVersion,1);
assert.deepEqual(Object.keys(manifest.files).sort(),reviewedPaths);
for(const row of Object.values(manifest.files))for(const hash of [row.beforeSha256,row.afterSha256])assert.match(hash,/^[a-f0-9]{64}$/);
const grouped=JSON.parse(readFileSync(new URL('../reviews/grouped-arrivals/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>;addedFiles:Record<string,string>};
assert.equal(grouped.schemaVersion,1);
assert.deepEqual(Object.keys(grouped.files).sort(),reviewedPaths);
for(const [path,row]of Object.entries(grouped.files)){
 assert.equal(row.beforeSha256,manifest.files[path].afterSha256,path+': grouped arrival successor must start at the exact published arrival source');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);
}
const acknowledgement=JSON.parse(readFileSync(new URL('../reviews/chapter-acknowledgement/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(acknowledgement.schemaVersion,1);
assert.deepEqual(Object.keys(acknowledgement.files).sort(),['experiments/tangible-campaign/ui/campaign-controller.test.ts','experiments/tangible-campaign/ui/campaign-main.ts']);
for(const [path,row]of Object.entries(acknowledgement.files)){
 assert.equal(row.beforeSha256,grouped.files[path].afterSha256,path+': acknowledgement fix must preserve exact grouped-arrival predecessor');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);
}
// The explicitly requested milestone layer follows the complete current acknowledgement fix.
const milestones=JSON.parse(readFileSync(new URL('../reviews/milestones/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(milestones.schemaVersion,1);
for(const path of reviewedPaths){
 const row=milestones.files[path];assert(row,path+': missing milestone successor');
 assert.equal(row.beforeSha256,acknowledgement.files[path]?.afterSha256??grouped.files[path].afterSha256,path+': milestone successor must preserve the exact current source chain');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);
}
export function expectedSourceHashAfterArrivals(path:string,historicalSha256:string):string{
 const successor=manifest.files[path];
 if(!successor){
  const milestone=milestones.files[path];if(!milestone)return historicalSha256;
  assert.equal(milestone.beforeSha256,historicalSha256,path+': historical freeze was not replaced');
  return expectedSourceHashAfterMilestoneAtlas(path,milestone.afterSha256);
 }
 assert.equal(successor.beforeSha256,historicalSha256,path+': historical freeze was not replaced');
 return expectedSourceHashAfterMilestoneAtlas(path,milestones.files[path].afterSha256);
}
