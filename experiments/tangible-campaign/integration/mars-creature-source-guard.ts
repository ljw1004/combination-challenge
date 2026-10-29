import {expectedSourceHashAfterAuthenticityRelease} from './authenticity-release-source-guard.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../reviews/mars-creature-field-scenes/source-successors.json',import.meta.url),'utf8'));
export function expectedSourceHashAfterMarsCreature(path:string,parentSha256:string):string{const row=manifest.files[path];if(!row)return expectedSourceHashAfterAuthenticityRelease(path,parentSha256);assert.equal(row.beforeSha256,parentSha256,path+': optional creature requires exact wider-cadence predecessor');return expectedSourceHashAfterAuthenticityRelease(path,row.afterSha256);}
