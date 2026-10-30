/** Exact opt-in successor overlay for compatibility assertions; never edits frozen inputs. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Scenario} from '../schema/scenario.ts';
export const solarLampContinuityDelta=JSON.parse(readFileSync(new URL('../reviews/solar-lamp-continuity/source-delta.json',import.meta.url),'utf8'));
export function applySolarLampContinuity(source:Scenario):Scenario {
 const s=structuredClone(source);assert.equal(s.id,solarLampContinuityDelta.scenarioId);
 for(const c of solarLampContinuityDelta.changes){const section=(s as any)[c.section] as any[];const index=section.findIndex(x=>x.id===c.id);assert.deepEqual(index<0?null:section[index],c.before,c.id+': exact predecessor required');if(index<0)section.splice(c.index,0,structuredClone(c.after));else section[index]=structuredClone(c.after);}
 return s;
}
export function beforeSolarLampContinuity(source:Scenario):Scenario {
 const s=structuredClone(source);assert.equal(s.id,solarLampContinuityDelta.scenarioId);
 for(const c of [...solarLampContinuityDelta.changes].reverse()){const section=(s as any)[c.section] as any[];const index=section.findIndex(x=>x.id===c.id);assert.deepEqual(section[index],c.after,c.id+': exact successor required');if(c.before===null)section.splice(index,1);else section[index]=structuredClone(c.before);}
 return s;
}
