import type {ChapterEntryCue, LocationDefinition, LocationVisit, Scenario} from '../../schema/campaign.ts';
import {applyMilestones} from '../current-campaign.ts';
import {physicalLocationData} from './physical-location-data.ts';

type PhysicalWorld=keyof typeof physicalLocationData;
/** New save identity and opt-in geography; never retrofit an archived board. */
export function physicalLocationSuccessor(base:Scenario,world:PhysicalWorld,id:string):Scenario {
 const s=structuredClone(applyMilestones(base)),data=physicalLocationData[world];s.id=id;
 const locationForChapter=new Map<string,string>(data.chapters.map(c=>[c.currentChapterId,c.locationPhases[0]]));
 const initialSource=s.initialItems.slice(),sourceRows=s.chapters.flatMap(ch=>(ch.caches??[]).map(cache=>({...cache})));
 const locations:LocationDefinition[]=data.locations.map(location=>({
  id:location.id,label:location.name,travelText:location.sceneDescription,
  background:{stableKey:location.id,sceneBrief:location.sceneDescription,asset:`/assets/locations/${location.id}.webp`,focalPoint:{x:.5,y:.5}},
  stockBatches:[],hotspots:[],
 }));
 for(const location of locations){
  const local=(id:string)=>(data.sourceAssignments as Record<string,string>)[id]===location.id;
  if(initialSource.some(local))location.stockBatches.push({id:`${world}-opening@${location.id}`,label:`${location.label} supplies`,narrative:location.travelText,items:initialSource.filter(local)});
  for(const source of sourceRows)if(source.items.some(local))location.stockBatches.push({...source,id:`${source.id}@${location.id}`,items:source.items.filter(local)});
  location.hotspots=s.chapters.filter(ch=>locationForChapter.get(ch.id)===location.id).flatMap(ch=>ch.hotspots??[]);
 }
 const visits:LocationVisit[]=[],counts=new Map<string,number>();
 for(const chapter of s.chapters){
  const authored=data.chapters.find(ch=>ch.currentChapterId===chapter.id)!;
  if(!authored)throw Error(`Missing physical chapter ${world}/${chapter.id}`);
  const location=locations.find(l=>l.id===authored.locationPhases[0])!;
  let visit=visits.at(-1);
  if(!visit||visit.locationId!==location.id){const n=(counts.get(location.id)??0)+1;counts.set(location.id,n);visit={id:`${location.id}-visit-${n}`,locationId:location.id,chapterIds:[]};visits.push(visit);}
  const arrival=!visit.chapterIds.length;visit.chapterIds.push(chapter.id);
  const format:ChapterEntryCue['format']=/radio/i.test(authored.popupType)?'radio':/dialogue|voice/i.test(authored.popupType)?'speech-bubble':'silent-title-card';
  const voice=world==='mars'?chapter.id==='signal'?'Last received message · orbital control':/orbital control/i.test(authored.popupType)?'Orbital control':/crew/i.test(authored.popupType)?'Survey crew':'Expedition journal':world==='elements'?'By the river':world==='copy'?chapter.id==='sample'?'Print-shop keeper':chapter.id==='commission'?'Display customer':'Travelling printer':format==='speech-bubble'?chapter.speaker:'The kitchen caravan';
  chapter.location={id:location.id,label:location.label,travelText:location.travelText};chapter.visitId=visit.id;
  chapter.entryCue={id:`${id}:${chapter.id}:entry-v1`,mode:arrival?'arrival-and-beat':'beat',format,voice,sourceCaption:location.label,text:arrival?`${location.travelText}\n\n${authored.popupScript}`:authored.popupScript};
  chapter.speaker=voice;chapter.motivation=chapter.entryCue.text;
  delete chapter.caches;delete chapter.hotspots;delete chapter.carry;
 }
 s.initialItems=[];s.locationPlan={locations,visits,panel:{width:390,height:844}};
 // Old generic source descriptions named the chapter that used to grant them.
 // Correct only those placeholders; preserve substantive apparatus/source text.
 for(const location of locations)for(const batch of location.stockBatches)for(const id of batch.items){const item=s.items.find(i=>i.id===id)!;if(/^Recovered .+ from /u.test(item.description??''))item.description=`Available with the equipment at ${location.label} from the first arrival.`;}
 s.notes=[...(s.notes??[]),'Opt-in persistent-location successor: chapter beats do not grant stock, import objects, or rearrange the board. Fixed 390×844-reference panels retain all surviving objects; current density acceptance is recorded separately.'];
 return s;
}
