import {expectedSourceHashAfterIronQuarry} from '../experiments/tangible-campaign/integration/iron-quarry-label.ts';
/** Final test/evidence-only successor; no claim of a second whole-suite aggregate. */
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterPlaytestContractFinal} from '../experiments/tangible-campaign/integration/playtest-contract-final-source-guard.ts';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)),sha=(p:string)=>createHash('sha256').update(read(p)).digest('hex'),json=(p:string)=>JSON.parse(read(p).toString());const e='experiments/tangible-campaign/evidence/playtest-contract-final-20261028/';
test('final contract successor preserves every runtime/content/build input and all original98a6 assertions as exact predecessors',()=>{
 assert.equal(sha(e+'predecessor-source-manifest.json'),'98a6b06c306e10553b6764918db79385ae80d70ce91936083087f55b29fcab56');
 const proof=json(e+'unchanged-runtime-content-proof.json'),prior=json(e+'predecessor-source-inventory.json'),next=json('experiments/tangible-campaign/reviews/playtest-contract-final/source-successors.json');
 for(const [p,row]of Object.entries<any>(proof.exactUnchangedFiles))assert.equal(sha(p),expectedSourceHashAfterIronQuarry(p,row.sha256),p);
 assert.deepEqual(Object.keys(next.files).sort(),[...proof.changedExistingFilesExcludingSeal].sort());
 for(const [p,row]of Object.entries<any>(next.files)){assert.equal(row.beforeSha256,prior[p].sha256);assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256);assert.equal(sha(p),expectedSourceHashAfterIronQuarry(p,row.afterSha256));assert.equal(expectedSourceHashAfterPlaytestContractFinal(p,row.beforeSha256),expectedSourceHashAfterIronQuarry(p,row.afterSha256));assert.throws(()=>expectedSourceHashAfterPlaytestContractFinal(p,'0'.repeat(64)),/exact98a6/);}
});
test('all relocated exact evidence texts are genuinely included in the fresh source manifest',()=>{
 const files=json('experiments/tangible-campaign/integration/source-manifest.json').files,relocations=json(e+'evidence-path-relocations.json');assert.equal(relocations.length,3);
 for(const row of relocations){assert.equal(sha(row.afterPath),row.sha256);assert.equal(files[row.afterPath].sha256,row.sha256);assert.equal(files[row.afterPath].bytes,row.bytes);assert(!row.afterPath.split('/').includes('results'));}
});

test('lifecycle audit correction changes only input display serialization, never an identity or decision',()=>{
 const path='experiments/tangible-campaign/reviews/playtest-repairs/lifecycle-delta.json',before=json('experiments/tangible-campaign/reviews/playtest-contract-final/predecessor/'+path+'.txt'),after=json(path);
 for(const row of before.changes){assert(Array.isArray(row.inputs));assert.equal(row.inputs.length,2);row.inputs=row.inputs.join(' + ');}
 assert.deepEqual(after,before);assert.equal(after.changes.length,29);
});
