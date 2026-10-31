import {expectedSourceHashAfterMarsNaturalOrders} from './mars-natural-orders-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
/** Additive exact successor over published c85. No historic expected hash is rewritten. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/intellectual-worlds/source-successors.json',import.meta.url),'utf8')) as {schemaVersion:number;files:Record<string,{beforeSha256:string;afterSha256:string}>};
assert.equal(manifest.schemaVersion,1);
export function expectedSourceHashAfterIntellectualWorlds(path:string,c85Sha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterMarsNaturalOrders(path,c85Sha256);
 assert.equal(row.beforeSha256,c85Sha256,path+': intellectual worlds must preserve exact c85 predecessor');
 assert.match(row.afterSha256,/^[a-f0-9]{64}$/);return expectedSourceHashAfterMarsNaturalOrders(path,row.afterSha256);
}
