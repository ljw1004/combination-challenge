import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/final-test-contract-20261029/source-successors.json',import.meta.url),'utf8'));
/** Test-only successor; no historical manifest or game source is rewritten. */
export function expectedSourceHashAfterFinalTestContracts(path:string,parentSha256:string):string {
 const row=manifest.files[path];if(!row)return parentSha256;
 assert.equal(row.beforeSha256,parentSha256,path+': final test contracts require exact final-v3 predecessor');return row.afterSha256;
}
