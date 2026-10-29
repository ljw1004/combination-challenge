import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import {expectedSourceHashAfterJourneyCleanup} from '../experiments/tangible-campaign/integration/journey-cleanup-source-guard.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync as originalReadFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterAuthenticityRelease} from '../experiments/tangible-campaign/integration/authenticity-release-source-guard.ts';
import {expectedSourceHashAfterMarsCreature} from '../experiments/tangible-campaign/integration/mars-creature-source-guard.ts';
const root=new URL('../',import.meta.url),R='experiments/tangible-campaign/reviews/authenticity-release-20261029/',read=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
test('authenticity release pins every exact optional-creature baseline file or explicit full-source successor',()=>{
 const manifest=read(R+'source-successors.json'),base=read(R+'predecessor-source-manifest.json');assert.equal(sha(R+'predecessor-source-manifest.json'),manifest.parentSourceSealSha256);assert.equal(manifest.parentSourceSealSha256,'03b7847ef5c4e5dae32f1f5bf029635131fe78ca60e0e346a93a9a628a7c84d8');
 for(const [path,row]of Object.entries<any>(base.files))assert.equal(sha(path),expectedSourceHashAfterAuthenticityRelease(path,row.sha256),path);
 for(const [path,row]of Object.entries<any>(manifest.files)){assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);assert.equal(sha(path),expectedSourceHashAfterJourneyCleanup(path,row.afterSha256),path);assert.throws(()=>expectedSourceHashAfterAuthenticityRelease(path,'0'.repeat(64)),/exact predecessor/);}
 assert.equal(sha('experiments/tangible-campaign/ui/pre-authenticity-scenarios.ts'),base.files['experiments/tangible-campaign/ui/current-scenarios.ts'].sha256);
});
test('all ten accepted author inputs and full v2 seal retain exact originals with only declared candidate-test successor contracts',()=>{
 assert.equal(sha(R+'author-v2-source-manifest.json'),'bab7052d4b503b9bd73e80c48cfee0cd09a0ec577f4f78417199a7a983beda53');const full=read(R+'author-v2-source-manifest.json'),inputs=read(R+'accepted-author-inputs.json');assert.equal(Object.keys(full.files).length,2297);assert.equal(inputs.files.length,10);
 for(const row of inputs.files){assert.equal(sha(row.snapshotPath),row.sha256,row.path);assert.equal(sha(row.path),expectedSourceHashAfterAuthenticityRelease(row.path,row.sha256),row.path);}
 for(const [path,row]of Object.entries<any>(full.files)){if(path==='experiments/tangible-campaign/integration/source-manifest.json'){assert.equal(sha(R+'dacaaa-source-manifest.json'),row.sha256);continue;}assert.equal(sha(path),expectedSourceHashAfterMarsCreature(path,row.sha256),path);}
});
test('generic engine/controller/carryAlong/artwork and the optional creature page remain byte-exact',()=>{
 const base=read(R+'predecessor-source-manifest.json');const paths=['vite.config.ts','mars-ice-creature.html','experiments/tangible-campaign/engine/campaign.ts','experiments/tangible-campaign/schema/scenario.ts','experiments/tangible-campaign/schema/campaign.ts','experiments/tangible-campaign/schema/location-plan.ts','experiments/tangible-campaign/ui/campaign-main.ts','experiments/tangible-campaign/ui/campaign.css','experiments/tangible-campaign/ui/campaign-page-catalogue.ts','experiments/tangible-campaign/ui/mars-creature-entry.ts','experiments/tangible-campaign/ui/stories/mars-creature-field-scenes.ts','public/assets/discoveries/mars-ice-creature.png'];
 for(const path of paths){assert(base.files[path],path);assert.equal(sha(path),base.files[path].sha256,path);}
});
