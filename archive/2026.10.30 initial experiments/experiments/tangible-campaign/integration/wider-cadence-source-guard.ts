import {expectedSourceHashAfterMarsCreature} from './mars-creature-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/wider-cadence-integration-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact wider-cadence successor; no historical hashes are exempted. */
export function expectedSourceHashAfterWiderCadence(path:string,parentSha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterMarsCreature(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': wider cadence requires exact published hotfix predecessor');return expectedSourceHashAfterMarsCreature(path,row.afterSha256);
}
