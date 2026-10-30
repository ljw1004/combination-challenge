import {expectedSourceHashAfterWiderCadence} from './wider-cadence-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/small-scene-hotfix-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact post-rendering successor. No historical frozen manifest is rewritten. */
export function expectedSourceHashAfterSmallSceneHotfix(path:string,parentSha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterWiderCadence(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': small-scene hotfix requires exact predecessor');return expectedSourceHashAfterWiderCadence(path,row.afterSha256);
}
