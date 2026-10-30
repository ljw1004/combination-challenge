import {scenario as reviewed} from './divinity-reviewed-reading-scenes.ts';
import {applyDivinityCalvinAssertion} from './divinity-calvin-assertion.ts';
/** Single-label nonblind-review repair; preserves v4, v5 and v6 unchanged. */
export const scenario=applyDivinityCalvinAssertion(reviewed);
scenario.id='divinity-final-reading-scenes-v7';
for(const chapter of scenario.chapters)if(chapter.entryCue)chapter.entryCue.id=`${scenario.id}:${chapter.id}:entry-v1`;
scenario.notes!.push('Case9 input now states Calvin’s biblical-permission and Christ-role criteria explicitly. This is a nonblind-review wording repair, not a repaired blind or human-comprehension pass.');
