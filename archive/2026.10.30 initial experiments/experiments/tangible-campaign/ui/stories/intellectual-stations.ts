import type {Chapter,LocationDefinition,LocationVisit,Scenario} from '../../schema/campaign.ts';
/** Two genuinely different working stations within persistent larger settings.
 * Four other Atlas chapter pairs still share an unchanged desk. This is not
 * per-chapter stock rationing: each station exposes its whole ordinary stock. */
export function atlasStations(source:Scenario,locations:LocationDefinition[],visits:LocationVisit[]){
 const overrides:Record<string,Partial<Chapter>>={};
 const split=(settingId:string,chapterId:string,id:string,firstLabel:string,label:string,brief:string,text:string)=>{
  const old=locations.find(l=>l.id===settingId)!,chapter=source.chapters.find(c=>c.id===chapterId)!,batchIds=new Set((chapter.caches??[]).map(c=>c.id)),hotspots=new Set(chapter.hotspots??[]);
  const stockBatches=old.stockBatches.filter(b=>batchIds.has(b.id));old.stockBatches=old.stockBatches.filter(b=>!batchIds.has(b.id));
  old.settingId=settingId;old.label=firstLabel;
  const next:LocationDefinition={id,settingId,label,travelText:brief,background:{stableKey:id,asset:`/assets/locations/${id}.webp`,sceneBrief:brief,focalPoint:{x:.5,y:.5}},stockBatches,hotspots:old.hotspots.filter(h=>hotspots.has(h))};old.hotspots=old.hotspots.filter(h=>!hotspots.has(h));locations.splice(locations.indexOf(old)+1,0,next);
  const visit=visits.find(v=>v.chapterIds.includes(chapterId))!;visit.chapterIds=visit.chapterIds.filter(c=>c!==chapterId);const newVisit={id:id+'-visit-1',locationId:id,chapterIds:[chapterId]};visits.splice(visits.indexOf(visit)+1,0,newVisit);
  overrides[chapterId]={visitId:newVisit.id,entryCue:{id:source.id+':'+chapterId+':station-entry-v1',mode:'arrival-and-beat',format:'silent-title-card',voice:'Narrator',sourceCaption:chapter.speaker,text}};
 };
 split('atlas-natural-philosophy-workshop','mechanism','atlas-mechanical-demonstration-bench','Natural philosophy · trial bench','Natural philosophy · demonstration bench','Across the same natural-philosophy workshop, a demonstration bench stands ready for mechanical, optical and anatomical comparisons.','Across the same workshop, the demonstration bench has gears, optical records and anatomical notes ready. A mechanism can copy an action—but has it explained a living creature? Bring the earlier questions about causes to this different kind of test.');
 split('atlas-library-of-copies','categories','atlas-classification-desk','Library · copies desk','Library · classification desk','An adjoining catalogue desk in the same library holds the records used to compare classifications and their consequences.','At the library’s catalogue desk, classification records and rival critiques are ready. Your copies and editions come under a different question: a useful category can also hide how it gained authority. Keep the criticism specific enough that another reader could answer it.');
 return overrides;
}
