import type {LocationDefinition} from '../../schema/campaign.ts';
import {atlasLocations as merged} from './intellectual-locations.ts';
import {scenario as prior} from './atlas-intellectual-history.ts';
/** Preserve the rich comparison desks, but stop exposing two chapters' sources
 * at one workstation. This successor restores the actual earlier carry lists,
 * not an invented three-card simplification of intellectual history. */
export const scenario=structuredClone(merged);
scenario.id='atlas-reading-scenes-v3';
export const atlasReadingSplits=[
 {setting:'atlas-athens-argument-courtyard',chapter:'kinds',id:'atlas-lyceum-classification-bench',firstLabel:'Athens · argument courtyard',firstBrief:'The courtyard’s argument table holds the eclipse explanation and disputed rule cases; the classification bench is across the courtyard.',label:'Athens · classification bench',brief:'A shaded bench across the Athenian courtyard offers a separate place for comparing changing things and their kinds.',arrival:'Across the courtyard, a shaded classification bench opens a new set of cases.'},
 {setting:'atlas-renaissance-print-workshop',chapter:'perspective',id:'atlas-renaissance-drawing-desk',firstLabel:'Renaissance workshop · printing table',firstBrief:'The printing table stands beside the press and type cases; a separate drawing desk lies beyond it by the window.',label:'Renaissance workshop · drawing desk',brief:'Beyond the printing table, a window-side drawing desk faces the street and opens the workshop’s picture and chart comparisons.',arrival:'Beyond the printing table, the window-side drawing desk faces the street.'},
 {setting:'atlas-public-reading-room',chapter:'exchange',id:'atlas-political-economy-alcove',firstLabel:'Public reading room · public knowledge table',firstBrief:'The reading room’s central table holds the encyclopedia and rights comparisons; market and workshop accounts wait in a separate alcove.',label:'Public reading room · accounts alcove',brief:'A separate accounts alcove in the reading room holds the market and workshop comparison file.',arrival:'At the reading room’s accounts alcove, another file opens.'},
 {setting:'atlas-natural-history-cabinet',chapter:'evolution',id:'atlas-naturalists-comparison-bench',firstLabel:'Natural history · strata desk',firstBrief:'The strata desk faces the fossil cabinets; a separate garden-facing bench holds the living-kinds comparison file.',label:'Natural history · living-kinds bench',brief:'A garden-facing comparison bench beside the natural-history cabinets turns from strata to naturalists’ records of living kinds.',arrival:'Beside the cabinets, the garden-facing comparison bench turns to living kinds.'},
] as const;
const {locations,visits}=scenario.locationPlan!;
for(const scene of atlasReadingSplits){
 const old=locations.find(l=>l.id===scene.setting)!,chapter=prior.chapters.find(c=>c.id===scene.chapter)!,batchIds=new Set((chapter.caches??[]).map(c=>c.id)),hotspots=new Set(chapter.hotspots??[]);
 const stockBatches=old.stockBatches.filter(b=>batchIds.has(b.id));old.stockBatches=old.stockBatches.filter(b=>!batchIds.has(b.id));old.settingId=scene.setting;old.label=scene.firstLabel;old.travelText=scene.firstBrief;old.background.sceneBrief=scene.firstBrief;
 const next:LocationDefinition={id:scene.id,settingId:scene.setting,label:scene.label,travelText:scene.brief,background:{stableKey:scene.id,asset:`/assets/locations/${scene.id}.webp`,sceneBrief:scene.brief,focalPoint:{x:.5,y:.5}},stockBatches,hotspots:old.hotspots.filter(h=>hotspots.has(h))};old.hotspots=old.hotspots.filter(h=>!hotspots.has(h));locations.splice(locations.indexOf(old)+1,0,next);
 const visit=visits.find(v=>v.chapterIds.includes(scene.chapter))!;visit.chapterIds=visit.chapterIds.filter(c=>c!==scene.chapter);visits.splice(visits.indexOf(visit)+1,0,{id:scene.id+'-visit-1',locationId:scene.id,chapterIds:[scene.chapter]});
}
for(const chapter of scenario.chapters){
 const original=prior.chapters.find(c=>c.id===chapter.id)!,visit=visits.find(v=>v.chapterIds.includes(chapter.id))!,location=locations.find(l=>l.id===visit.locationId)!,scene=atlasReadingSplits.find(s=>s.chapter===chapter.id);
 visit.carry=[...original.carry??[]];chapter.visitId=visit.id;chapter.location={id:location.id,label:location.label,travelText:location.travelText};
 // Keep every essential date, attribution and parallel-file qualification in
 // the prose. A physical station prefix is additional, not a replacement.
 chapter.entryCue={...chapter.entryCue!,id:`${scenario.id}:${chapter.id}:entry-v1`,mode:'arrival-and-beat',...(scene?{text:scene.arrival+' '+chapter.entryCue!.text}:{})};
 delete chapter.caches;delete chapter.hotspots;delete chapter.carry;
}
scenario.notes!.push('29 October reading-station successor: four remaining paired desks become honest adjoining workstations, restoring all thirty prior source groups and curated carries. Several comparison desks intentionally exceed ten active manuscripts; this is measured restoration, not a claim that every rich intellectual scene fits the usual small-materials target. Old source leaves and creations remain in scrollback. No recipe, goal, source quotation, or historical save identity is changed.');
