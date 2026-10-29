import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import {expectedSourceHashAfterWaterworks} from '../experiments/tangible-campaign/integration/waterworks-source-guard.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync as originalReadFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterJourneyCleanup} from '../experiments/tangible-campaign/integration/journey-cleanup-source-guard.ts';
const root=new URL('../',import.meta.url),R='experiments/tangible-campaign/reviews/journey-cleanup-release-20261029/',read=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
test('all2365 published source entries have exact preservation or full pinned successor rows, never deletion/exemption',()=>{
 const base=read(R+'predecessor-source-manifest.json'),delta=read(R+'source-successors.json');assert.equal(sha(R+'predecessor-source-manifest.json'),'90106433ef62b5d0ed3af21a6b7da6333534ea70d9b41db60ce8bd5c6c77e6f3');assert.equal(delta.parentSourceSealSha256,sha(R+'predecessor-source-manifest.json'));assert.equal(Object.keys(base.files).length,2365);
 for(const [path,row]of Object.entries<any>(base.files))assert.equal(sha(path),expectedSourceHashAfterJourneyCleanup(path,row.sha256),path);
 for(const [path,row]of Object.entries<any>(delta.files)){assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);assert.equal(sha(path),expectedSourceHashAfterWaterworks(path,row.afterSha256),path);assert.throws(()=>expectedSourceHashAfterJourneyCleanup(path,'0'.repeat(64)),/exact predecessor/);}
 assert.equal(sha('experiments/tangible-campaign/ui/pre-journey-cleanup-scenarios.ts'),base.files['experiments/tangible-campaign/ui/current-scenarios.ts'].sha256);
});
test('all six author inputs and original v7 helper/packet survive exact with only explicit registration-test adaptation',()=>{
 assert.equal(sha(R+'author-source-manifest.json'),'5b0b348aa61a24a4f4cb5b61857ea129d09b2cc992afe2ec0248092181c4125e');const full=read(R+'author-source-manifest.json'),inputs=read(R+'accepted-author-inputs.json');assert.equal(Object.keys(full.files).length,2372);assert.equal(inputs.files.length,6);
 for(const row of inputs.files){assert.equal(sha(row.snapshotPath),row.sha256,row.path);assert.equal(sha(row.path),expectedSourceHashAfterJourneyCleanup(row.path,row.sha256),row.path);}
 for(const [path,row]of Object.entries<any>(full.files)){if(path==='experiments/tangible-campaign/integration/source-manifest.json'){assert.equal(sha(R+'predecessor-source-manifest.json'),row.sha256);continue;}assert.equal(sha(path),expectedSourceHashAfterJourneyCleanup(path,row.sha256),path);}
 assert.equal(sha('experiments/tangible-campaign/ui/stories/elements-journey-cleanup-v1.ts'),'d8d7c792f099f7fb4a40147391ee99f7763f51eec021da6534aed19fef332290');assert.equal(sha(R+'source-only-v7-evidence/REVIEW-PACKET.json'),'ce4c1eca91c9ba27dbcf18fcb048ef6351668e5bf2dc1cec26370d3066e35214');
});
test('shared runtime/schema/controller and separate optional creature page/art are exact published bytes or explicitly pinned UI successors; old creature source and art stay exact',()=>{
 const base=read(R+'predecessor-source-manifest.json');const paths=['vite.config.ts','mars-ice-creature.html','experiments/tangible-campaign/engine/campaign.ts','experiments/tangible-campaign/schema/scenario.ts','experiments/tangible-campaign/schema/campaign.ts','experiments/tangible-campaign/schema/location-plan.ts','experiments/tangible-campaign/ui/campaign-main.ts','experiments/tangible-campaign/ui/campaign.css','experiments/tangible-campaign/ui/campaign-page-catalogue.ts','experiments/tangible-campaign/ui/mars-creature-entry.ts','experiments/tangible-campaign/ui/stories/mars-creature-field-scenes.ts','public/assets/discoveries/mars-ice-creature.png'];for(const path of paths)assert.equal(sha(path),expectedSourceHashAfterJourneyCleanup(path,base.files[path].sha256),path);
});
