import {expectedSourceHashAfterIntellectualWorlds} from './intellectual-worlds-source-guard.ts';
/** Exact final successor over the immutable milestone/Atlas source, with accepted author inputs archived separately. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const release=JSON.parse(readFileSync(new URL('../reviews/reactive-heroes/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(release.schemaVersion,1);
for(const row of Object.values(release.files))for(const hash of [row.beforeSha256,row.afterSha256])assert.match(hash,/^[a-f0-9]{64}$/);
export function expectedSourceHashAfterReactiveHeroes(path:string,parentSha256:string):string {
 const row=release.files[path];if(!row)return expectedSourceHashAfterIntellectualWorlds(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': release must preserve exact milestone/Atlas predecessor');
 return expectedSourceHashAfterIntellectualWorlds(path,row.afterSha256);
}
