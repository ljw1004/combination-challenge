import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {expectedSourceHashAfterArrivals} from '../experiments/tangible-campaign/integration/arrival-source-guard.ts';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/arrivals/source-successors.json',root),'utf8')) as {files:Record<string,{beforeSha256:string;afterSha256:string}>};
const digest=(text:string)=>createHash('sha256').update(text).digest('hex');
test('arrival successor guard pins each complete reviewed file and rejects unreviewed source drift',()=>{
 for(const [path,row] of Object.entries(manifest.files)){
  const source=readFileSync(new URL(path,root),'utf8'),expected=expectedSourceHashAfterArrivals(path,row.beforeSha256);
  assert.equal(digest(source),expected,path);assert.notEqual(digest(source+'\n// unreviewed drift\n'),expected,path);
  assert.notEqual(row.afterSha256,row.beforeSha256,path);
 }
});
test('arrival successor guard cannot silently replace a historical freeze or exempt unrelated source',()=>{
 for(const path of Object.keys(manifest.files))assert.throws(()=>expectedSourceHashAfterArrivals(path,'0'.repeat(64)),/historical freeze was not replaced/);
 const historical='a'.repeat(64);assert.equal(expectedSourceHashAfterArrivals('experiments/tangible-campaign/ui/save-codec.ts',historical),historical);
});

test('grouped-arrival successor preserves the exact live217 chain, frozen engine and all added geometry sources',()=>{
 const grouped=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/grouped-arrivals/source-successors.json',root),'utf8'));
 assert.equal(grouped.baseCommit,'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c');
 for(const [path,row]of Object.entries(manifest.files))assert.equal(grouped.files[path].beforeSha256,row.afterSha256,path);
 for(const [path,hash]of Object.entries(grouped.addedFiles))assert.equal(digest(readFileSync(new URL(path,root),'utf8')),expectedSourceHashAfterArrivals(path,hash as string),path);
 const frozen='experiments/tangible-campaign/reviews/grouped-arrivals/predecessor/engine/model.ts';
 assert.equal(digest(readFileSync(new URL(frozen,root),'utf8')),manifest.files['experiments/tangible-campaign/engine/model.ts'].afterSha256);
});

test('already-earned chapter acknowledgement is a narrow exact successor, never a rewritten grouped freeze',()=>{
 const grouped=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/grouped-arrivals/source-successors.json',root),'utf8'));
 const next=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/chapter-acknowledgement/source-successors.json',root),'utf8'));
 assert.deepEqual(Object.keys(next.files).sort(),['experiments/tangible-campaign/ui/campaign-controller.test.ts','experiments/tangible-campaign/ui/campaign-main.ts']);
 for(const [path,row]of Object.entries(next.files) as [string,{beforeSha256:string;afterSha256:string}][]){assert.equal(row.beforeSha256,grouped.files[path].afterSha256);const current=expectedSourceHashAfterArrivals(path,manifest.files[path].beforeSha256);assert.equal(digest(readFileSync(new URL(path,root),'utf8')),current);assert.notEqual(digest(readFileSync(new URL(path,root),'utf8')+'unreviewed'),current);}
});
