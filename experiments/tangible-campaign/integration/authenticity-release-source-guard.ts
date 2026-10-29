import {expectedSourceHashAfterJourneyCleanup} from './journey-cleanup-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/authenticity-release-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact published-source or exact reviewed-input successor; no wildcard bypass. */
export function expectedSourceHashAfterAuthenticityRelease(path:string,parentSha256:string):string{
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterJourneyCleanup(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': authenticity release requires exact predecessor');return expectedSourceHashAfterJourneyCleanup(path,row.afterSha256);
}
