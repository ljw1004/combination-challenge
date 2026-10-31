/** Exact reversible authored data delta. Historical packets remain immutable. */
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import type {Scenario} from '../schema/scenario.ts';
const delta=JSON.parse(readFileSync(new URL('../reviews/intuitive-story-alternatives/semantic-delta.json',import.meta.url),'utf8'));
function patch(source:Scenario,reverse:boolean):Scenario {
 const world=delta.worlds.find((w:any)=>w.world===source.id);if(!world)return source;
 const s=structuredClone(source),changes=reverse?[...world.changes].reverse():world.changes;
 for(const c of changes){const parts=c.path.slice(1).split('/').map((p:string)=>p.replace(/~1/g,'/').replace(/~0/g,'~'));let target:any=s;for(const p of parts.slice(0,-1))target=target[p];const key=parts.at(-1),before=reverse?c.after:c.before,after=reverse?c.before:c.after;
  assert.deepEqual(target[key],before,`${source.id}${c.path}: exact ${reverse?'successor':'predecessor'} required`);
  if(after===undefined){if(Array.isArray(target))target.splice(Number(key),1);else delete target[key];}else target[key]=structuredClone(after);
 }
 return s;
}
export const applyIntuitiveAlternatives=(s:Scenario)=>patch(s,false);
export const beforeIntuitiveAlternatives=(s:Scenario)=>patch(s,true);
