import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {expectedSourceHashAfterMarsObservationStreamline} from './mars-observation-source-guard.ts';
/** Exact opt-in persistent-location successor. Never rewrites a historical seal. */
const manifest=JSON.parse(readFileSync(new URL('../reviews/location-presentation/source-successors.json',import.meta.url),'utf8'));
export function expectedSourceHashAfterLocationPresentation(path:string,parentSha256:string):string{
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterMarsObservationStreamline(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': location presentation requires exact terminology-v7 predecessor');return expectedSourceHashAfterMarsObservationStreamline(path,row.afterSha256);
}
