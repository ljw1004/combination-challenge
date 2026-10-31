
// Root context: exact whole-Site provenance bytes resolve explicit immutable snapshots; gameplay imports remain active.
const sourcePaths=JSON.parse(readFileSync(new URL('docs/location-hotspot-root-sync-20261028/test-context-map.json',new URL('../',import.meta.url)),'utf8')).siteSourceInputPathBySitePath;
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {expectedSourceHashAfterSmallSceneHotfix} from '../experiments/tangible-campaign/integration/small-scene-hotfix-source-guard.ts';
const root=new URL('../',import.meta.url),sha=(p:string)=>createHash('sha256').update(readFileSync(new URL(sourcePaths[p]??p,root))).digest('hex');
test('small-scene integration preserves exact predecessor bytes and rejects lineage drift',()=>{
 const dir='experiments/tangible-campaign/reviews/small-scene-hotfix-20261029/';
 const m=JSON.parse(readFileSync(new URL(dir+'source-successors.json',root),'utf8'));
 assert.equal(sha(dir+'predecessor-source-manifest.json'),m.parentSourceSeal);
 for(const [p,r] of Object.entries<any>(m.files)){assert.equal(sha(r.predecessorSnapshotPath),r.beforeSha256,p);assert.equal(sha(p),expectedSourceHashAfterSmallSceneHotfix(p,r.beforeSha256),p);assert.throws(()=>expectedSourceHashAfterSmallSceneHotfix(p,'0'.repeat(64)),/exact predecessor/);}
 assert.equal(expectedSourceHashAfterSmallSceneHotfix('untouched.ts','a'.repeat(64)),'a'.repeat(64));
});
