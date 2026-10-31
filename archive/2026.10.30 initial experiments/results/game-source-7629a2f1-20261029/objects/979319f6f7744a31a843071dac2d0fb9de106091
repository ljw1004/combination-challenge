import {elements as sourceOnly} from './elements-journey-cleanup-v1.ts';
/** Tested successor of the frozen source-only review candidate. Keep v7 exact.
 * The only design delta is removal of stale map-directions setting copy. */
export const elements=structuredClone(sourceOnly);
elements.id='elements-journey-cleanup-v8';
for(const c of elements.chapters){
 if(c.entryCue)c.entryCue.id=`${elements.id}:${c.id}:entry-v1`;
 if(c.travel)c.travel.entryCue.id=`${elements.id}:${c.travel.id}:entry-v1`;
}
const timekeeping=elements.chapters.find(c=>c.id==='timekeeping')!;
const brief='The following morning brings a clear working space at the landing for return-boat departure times.';
timekeeping.location.travelText=brief;
const location=elements.locationPlan!.locations.find(l=>l.id===timekeeping.location.id)!;
location.travelText=brief;location.background.sceneBrief=brief;
export const scenario=elements;
