import {expectedSourceHashAfterUxContent} from './ux-content-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/waterworks-release-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact published-source or exact reviewed-input successor; no wildcard bypass. */
export function expectedSourceHashAfterWaterworks(path:string,parentSha256:string):string{
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterUxContent(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': waterworks requires exact predecessor');return expectedSourceHashAfterUxContent(path,row.afterSha256);
}
