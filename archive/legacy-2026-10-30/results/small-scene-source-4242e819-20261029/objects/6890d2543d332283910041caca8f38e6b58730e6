import {expectedSourceHashAfterSmallSceneHotfix} from './small-scene-hotfix-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/rendering-intertitles-20261029/source-successors.json',import.meta.url),'utf8'));
/** Exact UI-only successor of the published final-v4 source. Frozen seals stay intact. */
export function expectedSourceHashAfterRenderingIntertitles(path:string,parentSha256:string):string {
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterSmallSceneHotfix(path,parentSha256);
 assert.equal(row.beforeSha256,parentSha256,path+': rendering/intertitles requires exact published final-v4 predecessor');return expectedSourceHashAfterSmallSceneHotfix(path,row.afterSha256);
}
