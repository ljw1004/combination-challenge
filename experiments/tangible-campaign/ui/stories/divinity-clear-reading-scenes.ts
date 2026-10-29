import {scenario as readingScenes} from './divinity-reading-scenes.ts';
import {applyDivinityClarity} from './divinity-clarity.ts';
/** Explicit combined edition; neither the density-only v4 nor wording overlay
 * is mutated. Independent input-only review remains a release prerequisite. */
export const scenario=applyDivinityClarity(readingScenes);
scenario.id='divinity-clear-reading-scenes-v5';
for(const chapter of scenario.chapters)if(chapter.entryCue)chapter.entryCue.id=`${scenario.id}:${chapter.id}:entry-v1`;
scenario.notes!.push('29 October clarity edition: plain-language item labels, reading openings and goals are composed after the fourteen-desk cadence successor. Sources, quotations, recipe semantics, geographical data and stock provenance remain unchanged. Logical completion does not certify human comprehension.');
