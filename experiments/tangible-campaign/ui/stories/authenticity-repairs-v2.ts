import type {Action} from '../../schema/campaign.ts';
import {elements as v1,mars,atlas} from './authenticity-repairs-v1.ts';
export {mars,atlas};
/** Independent review B1: remove the unearned bell/mould branch, not repair it
 * with a foundry checklist. The sealed v1 candidate remains an exact source. */
export const elements=structuredClone(v1);
elements.id='elements-material-repairs-v6';
for(const c of elements.chapters){if(c.entryCue)c.entryCue.id=`${elements.id}:${c.id}:entry-v1`;if(c.travel)c.travel.entryCue.id=`${elements.id}:${c.travel.id}:entry-v1`;}
const removed=new Set(['bell','dinner-bell']);
elements.items=elements.items.filter(i=>!removed.has(i.id));
elements.recipes=elements.recipes.filter(r=>!removed.has(r.id));
const timekeeping=elements.chapters.find(c=>c.id==='timekeeping')!;
timekeeping.objectives=timekeeping.objectives.filter(o=>o.item!=='dinner-bell');
timekeeping.completionText='The keeper reads the return times aloud and calls the boats in order. The first homeward passengers wave from the steps, while others settle in for the evening. No one has to leave before their own boat is called.';
const iron=elements.milestones!.find(m=>m.id==='elements-iron')!;
iron.text='From stubborn rock comes metal we can shape. Edges, hinges and fastenings lie within reach.';
// On the canonical route the basket and jar are already made when the bowl is
// fired. No later consumer now keeps an unfired duplicate alive. The ordinary
// event-local lifecycle can retire it at that firing action without a new rule.
elements.recipes.find(r=>r.id==='glazed-bowl')!.lifecycle!['bowl'].reason='The same formed clay vessel is glazed and fired. Retain a dry shaping form only while an unfinished basket or jar still independently needs it; there is no later metalworking use.';
const isRemovedAction=(a:Action)=>a.type==='combine'&&((new Set([a.a,a.b]).has('iron')&&new Set([a.a,a.b]).has('bowl'))||[a.a,a.b].some(i=>removed.has(i)));
for(const cp of elements.checkpoints??[])cp.actions=cp.actions.filter(a=>!isRemovedAction(a));
// M2: every observational consumer names the same relative level, never a new
// calibrated rainfall amount. No recipe, record, scale or measurement step added.
elements.items.find(i=>i.id==='rain-record')!.description='Written comparisons of repeated relative collector levels, using the same vessel over equal collection intervals.';
elements.items.find(i=>i.id==='weather-record')!.description='An account bringing relative collected-rain levels and wind observations together.';
elements.items.find(i=>i.id==='wind-record')!.description='Notes of the windsock’s changing direction and lift. A relative level from the rain collector can complete the weather record.';
elements.recipes.find(r=>r.id==='rain-record')!.description='Record the clear collector’s relative fill level, comparing the same vessel over equal collection intervals.';
elements.recipes.find(r=>r.id==='wind-record')!.description='Record how the windsock turns and lifts, leaving room beside the wind notes for relative collector levels.';
elements.recipes.find(r=>r.id==='weather-from-wind-record')!.description='The relative collector level joins the wind notes: both observations now appear in the weather record.';
elements.notes!.push('Independent-review successor: remove the Bell and Dinner bell wrappers and their terminal goal rather than invent an unfired-clay metalworking mould. The keeper calls departures from the timetable. Formed bowl now has only its early basket/jar-form and kiln-firing consumers; relative-rain record language is consistent. No new recipe, tool, location, stock or processing chore.');
export const authenticitySuccessors=[mars,atlas,elements];
