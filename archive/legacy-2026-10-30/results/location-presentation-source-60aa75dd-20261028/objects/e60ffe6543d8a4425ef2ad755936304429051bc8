import type {Scenario,LocationDefinition,LocationVisit,Chapter} from '../../schema/campaign.ts';
import {applyMilestones} from '../current-campaign.ts';
import {scenario as atlas} from './atlas-intellectual-history.ts';
import {scenario as divinity} from './divinity-disputed-questions.ts';
import {scenario as light} from './divinity-light-text-workshop.ts';
import {atlasStations} from './intellectual-stations.ts';
import {locationCardLabels} from './location-card-labels.ts';
import {intellectualLocationData} from './intellectual-location-data.ts';
const endings={atlas:'The last page does not describe a perfect civilization. It keeps the instruments, arguments and disagreements that made this world possible—and leaves its people a way to change it.',divinity:'The request, the panel and the fragment are still the same cases. Better evidence has changed one question without settling every disagreement. You can now say where these accounts meet, and where they remain opposed.',light:'The exhibit is up. A stranger stops; a father steps outside; a crowd eats. The headline survived only by changing. Four panels—and room for another visitor to ask a better question.'};
function successor(key:keyof typeof intellectualLocationData,original:Scenario):Scenario{
 const source=structuredClone(applyMilestones(original)),data=structuredClone(intellectualLocationData[key]);
 const locations=data.locations as unknown as LocationDefinition[],visits=data.visits as unknown as LocationVisit[];
 // Preserve real source labels/attribution in the provenance ledger, but never
 // append these legacy cache paragraphs to the one authored chapter cue.
 for(const location of locations)for(const batch of location.stockBatches){const old=source.chapters.flatMap(c=>c.caches??[]).find(c=>c.id===batch.id);if(old){batch.label=old.label;batch.narrative=old.narrative;}}
 const overrides=key==='atlas'?atlasStations(source,locations,visits):{};
 const labels={...(data.labels as Record<string,string>),...(key==='atlas'?locationCardLabels:{})};
 return {...source,id:data.id,locationPlan:{locations,visits,panel:{width:390,height:844}},items:source.items.map(item=>({...item,...labels[item.id]?{label:labels[item.id]}:{}})),chapters:source.chapters.map((chapter,index)=>{
  const original=data.chapters.find(c=>c.id===chapter.id)! as unknown as Pick<Chapter,'title'|'visitId'|'entryCue'|'sourceUpdate'|'objectives'>;
  const entry={...original,...overrides[chapter.id]};if(overrides[chapter.id]?.entryCue)entry.entryCue={...entry.entryCue!,id:data.id+':'+chapter.id+':station-entry-v1',sourceCaption:original.entryCue?.sourceCaption};
  const visit=visits.find(v=>v.id===entry.visitId)!,location=locations.find(l=>l.id===visit.locationId)!;
  return {...chapter,...entry,location:{id:location.id,label:location.label,travelText:location.travelText},hotspots:[],caches:[],carry:[],...(index===source.chapters.length-1?{completionText:endings[key]}:{})};
 }),notes:[...(source.notes??[]),'Location successor: stable fixed 390 × 844 reference panels; chapters preserve all objects and arrangement. Sources are comparative reading settings, not a claim that all represented authors met there. Artwork and popup presentation do not certify phone usability.']};
}
export const atlasLocations=successor('atlas',atlas);
export const divinityLocations=successor('divinity',divinity);
export const lightLocations=successor('light',light);
export const intellectualLocationScenarios=[atlasLocations,divinityLocations,lightLocations];
