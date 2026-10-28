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
