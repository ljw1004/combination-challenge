import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import {expectedSourceHashAfterUxContent} from '../experiments/tangible-campaign/integration/ux-content-source-guard.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync as originalReadFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterWaterworks} from '../experiments/tangible-campaign/integration/waterworks-source-guard.ts';
const root=new URL('../',import.meta.url),R='experiments/tangible-campaign/reviews/waterworks-release-20261029/',read=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
test('all 2411 published source entries have exact preservation or full pinned successor rows, never deletion/exemption',()=>{
 const base=read(R+'predecessor-source-manifest.json'),delta=read(R+'source-successors.json');assert.equal(sha(R+'predecessor-source-manifest.json'),'7629a2f122270c3b08a19a24e6251ae63f2f0178639b7576258b15ae003a4395');assert.equal(delta.parentSourceSealSha256,sha(R+'predecessor-source-manifest.json'));assert.equal(Object.keys(base.files).length,2411);
 for(const [path,row]of Object.entries<any>(base.files))assert.equal(sha(path),expectedSourceHashAfterWaterworks(path,row.sha256),path);
 for(const [path,row]of Object.entries<any>(delta.files)){assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);assert.equal(sha(path),expectedSourceHashAfterUxContent(path,row.afterSha256),path);assert.throws(()=>expectedSourceHashAfterWaterworks(path,'0'.repeat(64)),/exact predecessor/);}
 assert.equal(sha('experiments/tangible-campaign/ui/pre-waterworks-scenarios.ts'),base.files['experiments/tangible-campaign/ui/current-scenarios.ts'].sha256);
});
test('all three author inputs, independent review and original phase judgments retain pinned bytes',()=>{
 assert.equal(sha(R+'author-source-manifest.json'),'96499324891d5f92fd4c576bf1e67526cdd1153a0f395eff580f05ee0dfda506');const full=read(R+'author-source-manifest.json'),inputs=read(R+'accepted-author-inputs.json');assert.equal(Object.keys(full.files).length,2415);assert.equal(inputs.files.length,3);
 for(const row of inputs.files){assert.equal(sha(row.snapshotPath),row.sha256,row.path);assert.equal(sha(row.path),expectedSourceHashAfterWaterworks(row.path,row.sha256),row.path);}
 for(const [path,row]of Object.entries<any>(full.files)){if(path==='experiments/tangible-campaign/integration/source-manifest.json'){assert.equal(sha(R+'predecessor-source-manifest.json'),row.sha256);continue;}assert.equal(sha(path),expectedSourceHashAfterWaterworks(path,row.sha256),path);}
 assert.equal(sha('experiments/tangible-campaign/ui/stories/elements-waterworks-v1.ts'),'88af6d2cb22125b140ae458abed69025fa5bb5c1a11dcb2736142e6615df9d40');assert.equal(sha(R+'independent-review/REVIEW.md'),'0a12cf697d88faaa9bf03fae24c97eecb8f7ac366db6ae06087901aea901deda');
 const receipt=read(R+'SOURCE-RECEIPT.json');for(const row of receipt.priorIndependentReviewCopies)assert.equal(sha(R+row.path.replace('evidence/','')),row.sha256,row.path);
});
test('shared runtime/schema/controller and separate optional creature page/art are exact published bytes or explicitly pinned UI successors; old creature source and art stay exact',()=>{
 const base=read(R+'predecessor-source-manifest.json');const paths=['vite.config.ts','mars-ice-creature.html','experiments/tangible-campaign/engine/campaign.ts','experiments/tangible-campaign/schema/scenario.ts','experiments/tangible-campaign/schema/campaign.ts','experiments/tangible-campaign/schema/location-plan.ts','experiments/tangible-campaign/ui/campaign-main.ts','experiments/tangible-campaign/ui/campaign.css','experiments/tangible-campaign/ui/campaign-page-catalogue.ts','experiments/tangible-campaign/ui/mars-creature-entry.ts','experiments/tangible-campaign/ui/stories/mars-creature-field-scenes.ts','public/assets/discoveries/mars-ice-creature.png'];for(const path of paths)assert.equal(sha(path),expectedSourceHashAfterWaterworks(path,base.files[path].sha256),path);
});
