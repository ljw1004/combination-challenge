import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/ux-content-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact staged predecessor or exact integrated successor; no excluded paths. */
export function expectedSourceHashAfterUxContent(path:string,parentSha256:string):string{
 const row=manifest.files[path];if(!row)return parentSha256;
 assert.equal(row.beforeSha256,parentSha256,path+': UX content requires exact predecessor');return row.afterSha256;
}
