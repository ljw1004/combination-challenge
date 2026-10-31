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
export function expectedSourceHashAfterArrivals(path:string,historicalSha256:string):string{
 const successor=manifest.files[path];if(!successor)return historicalSha256;
 assert.equal(successor.beforeSha256,historicalSha256,path+': historical freeze was not replaced');
 return successor.afterSha256;
}
