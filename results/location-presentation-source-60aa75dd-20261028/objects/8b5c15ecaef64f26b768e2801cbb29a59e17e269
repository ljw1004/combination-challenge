import {expectedSourceHashAfterLocationHotspot} from './location-hotspot-source-guard.ts';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import type {Scenario} from '../schema/scenario.ts';
const manifest=JSON.parse(readFileSync(new URL('../reviews/iron-quarry-label/source-successors.json',import.meta.url),'utf8'));
export function expectedSourceHashAfterIronQuarry(path:string,parentSha256:string):string{
 const row=manifest.files[path];if(!row)return expectedSourceHashAfterLocationHotspot(path,parentSha256);assert.equal(row.beforeSha256,parentSha256,path+': Iron quarry successor requires exact LIVE61 predecessor');return expectedSourceHashAfterLocationHotspot(path,row.afterSha256);
}
/** Historical assertion only. Runtime displays the actual current authored label. */
export function beforeIronQuarryLabel(source:Scenario):Scenario{
 if(source.id!=='elements-house-and-craft-v1')return source;
 const s=structuredClone(source),place=s.locations.find(p=>p.id==='quarry')!;assert.equal(place.label,'Iron quarry');place.label='Red quarry';return s;
}
