import {expectedSourceHashAfterPlaytestRepairs} from './playtest-repairs-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
/** Exact opt-in successor; earlier source freezes are never rewritten. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/mars-natural-orders/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(manifest.schemaVersion,1);
export function expectedSourceHashAfterMarsNaturalOrders(path:string,parentSha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterPlaytestRepairs(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': natural orders must preserve exact live predecessor');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);return expectedSourceHashAfterPlaytestRepairs(path,row.afterSha256);
}
