import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
/** Bounded exact successor over LIVE86. Old accepted hashes and source snapshots remain evidence. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/intuitive-story-alternatives/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(manifest.schemaVersion,1);
export function expectedSourceHashAfterIntuitiveAlternatives(path:string,beforeSha256:string):string {
 const row=manifest.files[path];if(!row)return beforeSha256;
 assert.equal(row.beforeSha256,beforeSha256,path+': alternatives must preserve exact LIVE86 predecessor');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);return row.afterSha256;
}
