import {expectedSourceHashAfterIronQuarry} from './iron-quarry-label.ts';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
/** Exact test-contract successor after the preserved98a6 source checkpoint. No runtime/content edits. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/playtest-contract-final/source-successors.json',import.meta.url),'utf8'));
export function expectedSourceHashAfterPlaytestContractFinal(path:string,predecessorSha256:string):string{
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterIronQuarry(path,predecessorSha256);
 assert.equal(row.beforeSha256,predecessorSha256,path+': final contract successor requires exact98a6 predecessor');return expectedSourceHashAfterIronQuarry(path,row.afterSha256);
}
