import {expectedSourceHashAfterPlaytestContractFinal} from './playtest-contract-final-source-guard.ts';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
/** Exact combined successor after the immutable Mars author branch. Actual deployment remains LIVE86. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/playtest-repairs/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(manifest.schemaVersion,1);
export function expectedSourceHashAfterPlaytestRepairs(path:string,authorParentSha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterPlaytestContractFinal(path,authorParentSha256);
 assert.equal(row.beforeSha256,authorParentSha256,path+': combined repairs must preserve exact authoring predecessor');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);return expectedSourceHashAfterPlaytestContractFinal(path,row.afterSha256);
}
