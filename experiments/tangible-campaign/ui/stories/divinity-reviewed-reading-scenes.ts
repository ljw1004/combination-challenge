import {scenario as clearReadingScenes} from './divinity-clear-reading-scenes.ts';
import {applyDivinityClarityRepairs} from './divinity-clarity-repairs.ts';
/** The fresh input-only review's specific repairs form another additive edition;
 * the original wording and its uncorrected review evidence remain preserved. */
export const scenario=applyDivinityClarityRepairs(clearReadingScenes);
scenario.id='divinity-reviewed-reading-scenes-v6';
for(const chapter of scenario.chapters)if(chapter.entryCue)chapter.entryCue.id=`${scenario.id}:${chapter.id}:entry-v1`;
scenario.notes!.push('Fresh input-only review repairs: visible plain-language scope, the exact nature quotation with a gloss, and the already-required baptism explanation as an intermediate before comparison. No new recipe or additional mandatory combination.');
