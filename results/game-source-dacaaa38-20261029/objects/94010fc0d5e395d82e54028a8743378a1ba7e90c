import type {LocationDefinition} from '../../schema/campaign.ts';
import {divinityLocations as merged} from './intellectual-locations.ts';
import {scenario as beforeLocations} from './divinity-disputed-questions.ts';
import {divinityCueProse} from './intellectual-cue-prose.ts';

/** Restore fourteen substantive manuscript workstations, not fourteen sparse
 * puzzles. The current source/recipe/goal vocabulary is deliberately untouched;
 * a separate content author owns the theological clarity overlay. */
export const scenario=structuredClone(merged);
scenario.id='divinity-reading-scenes-v4';
export const divinityReadingScenes=[
 {chapter:'wound-and-meal',id:'divinity-augustine-study',setting:'augustine-collection',label:'Handbook reading desk',asset:'divinity-augustine-study',brief:'A broad study desk holds the handbook’s attributed extracts and the wound and meal cases; the grace collection has its own alcove.',arrival:'Begin at the handbook desk.'},
 {chapter:'promise-and-infant',id:'divinity-grace-alcove',setting:'augustine-collection',label:'Grace manuscripts alcove',asset:'divinity-grace-alcove',brief:'Across the study, a separate alcove desk holds the grace-controversy manuscripts and the promise and infant cases.',arrival:'Across the study, the grace manuscripts have their own desk.'},
 {chapter:'opposed-origins',id:'divinity-medieval-disputation-desk',setting:'medieval-manuscript-hall',label:'Two Principles desk',asset:'divinity-medieval-disputation-desk',brief:'A manuscript-hall desk displays the attributed Book of Two Principles extracts and their cases, distinct from the neighbouring Aquinas stations.',arrival:'The manuscript hall opens at the Two Principles desk.'},
 {chapter:'reason-and-fire',id:'divinity-cause-comparison-bench',setting:'medieval-manuscript-hall',label:'Natural causes comparison bench',asset:'divinity-cause-comparison-bench',brief:'A separate window-side bench in the manuscript hall pairs Aquinas’s natural-cause examples with the limits of that argument.',arrival:'Move to the window-side comparison bench.'},
 {chapter:'three-and-one',id:'divinity-trinity-lectern',setting:'medieval-manuscript-hall',label:'Trinity comparison lectern',asset:'divinity-trinity-lectern',brief:'An adjoining two-sided reading station compares relational language and the limits of ordinary examples in the Trinity texts.',arrival:'The adjoining lectern sets the relationship examples beside the Trinity texts.'},
 {chapter:'hands-and-book',id:'divinity-ritual-comparison-room',setting:'rite-comparison-gallery',label:'Lyon ritual display desk',asset:'divinity-ritual-comparison-room',brief:'The gallery’s first demonstration desk is dedicated to the Lyon manuscript and its bodily rite; neighbouring stations remain separate.',arrival:'The rite gallery begins with the Lyon manuscript’s display desk.'},
 {chapter:'axe-and-water',id:'divinity-baptism-bench',setting:'rite-comparison-gallery',label:'Baptism comparison bench',asset:'divinity-baptism-bench',brief:'Beside the gallery window, a distinct teaching bench holds the craftsperson-and-tool case and Aquinas’s baptism extracts.',arrival:'Beside the gallery window, a different bench compares tools and baptism.'},
 {chapter:'bread-and-body',id:'divinity-eucharist-table',setting:'rite-comparison-gallery',label:'Eucharist reading table',asset:'divinity-eucharist-table',brief:'Beyond the gallery arch, a quiet reading table holds the bread case and the Eucharistic account, separate from the baptism demonstration.',arrival:'Beyond the arch, the Eucharistic texts have a quiet reading table.'},
 {chapter:'coin-and-supper',id:'divinity-reformation-print-table',setting:'reformation-printshop',label:'Indulgence pamphlet table',asset:'divinity-reformation-print-table',brief:'The printshop’s front worktable holds Luther’s early pamphlet extracts and the one-coin household case.',arrival:'At the printshop’s front table, the pamphlets meet a household case.'},
 {chapter:'gift-and-neighbour',id:'divinity-liberty-bench',setting:'reformation-printshop',label:'Christian Liberty binding bench',asset:'divinity-liberty-bench',brief:'A separate binding bench at the back of the printshop holds the later Christian Liberty extracts and their neighbour-service cases.',arrival:'At the back of the printshop, the binding bench holds a later work.'},
 {chapter:'marburg-table',id:'divinity-confessions-table',setting:'assembly-archive',label:'Marburg articles desk',asset:'divinity-confessions-table',brief:'The assembly archive’s front desk presents separately dated Marburg texts and signed articles, not a meeting with later councils.',arrival:'The assembly archive’s first desk opens the Marburg papers.'},
 {chapter:'response-and-growth',id:'divinity-trent-decree-desk',setting:'assembly-archive',label:'Trent decree desk',asset:'divinity-trent-decree-desk',brief:'An adjoining archive desk presents Trent’s 1547 decree and earlier texts for comparison, explicitly separate from the Marburg collection.',arrival:'An adjoining archive desk opens Trent’s separately dated decree.'},
 {chapter:'friend-and-saint',id:'divinity-prayer-and-provenance-bench',setting:'prayer-provenance-study',label:'Calvin cases bench',asset:'divinity-prayer-and-provenance-bench',brief:'A chapel-side study bench holds Calvin’s extracts alongside three distinct prayer, picture and fragment cases.',arrival:'At the chapel-side bench, Calvin’s objections meet three distinct cases.'},
 {chapter:'prayer-panel-fragment',id:'divinity-reply-records-desk',setting:'prayer-provenance-study',label:'Replies and records desk',asset:'divinity-reply-records-desk',brief:'Across the study, a separate replies desk holds Trent’s extracts and receives one new record for the invented fragment case.',arrival:'Across the study, the replies and incoming record have their own desk.'},
] as const;

const locations:LocationDefinition[]=divinityReadingScenes.map(scene=>{
 const original=beforeLocations.chapters.find(c=>c.id===scene.chapter)!;
 const update=new Set(scenario.chapters.find(c=>c.id===scene.chapter)!.sourceUpdate?.items??[]);
 return {id:scene.id,settingId:scene.setting,label:scene.label,travelText:scene.brief,background:{stableKey:scene.id,sceneBrief:scene.brief,asset:`/assets/locations/${scene.asset}.webp`,focalPoint:{x:.5,y:.5}},stockBatches:(original.caches??[]).map(batch=>({...structuredClone(batch),id:`${batch.id}@${scene.id}`,items:batch.items.filter(id=>!update.has(id))})).filter(batch=>batch.items.length),hotspots:[...original.hotspots??[]]};
});
scenario.initialItems=[...beforeLocations.initialItems];
scenario.locationPlan={locations,visits:divinityReadingScenes.map(scene=>({id:`${scene.id}-visit-1`,locationId:scene.id,chapterIds:[scene.chapter]})),panel:{width:390,height:844}};
for(const scene of divinityReadingScenes){
 const chapter=scenario.chapters.find(c=>c.id===scene.chapter)!;
 chapter.location={id:scene.id,label:scene.label,travelText:scene.brief};chapter.visitId=`${scene.id}-visit-1`;
 const text=`${scene.arrival} ${divinityCueProse[scene.chapter]}`;
 chapter.entryCue={...chapter.entryCue!,id:`${scenario.id}:${chapter.id}:entry-v1`,mode:chapter.sourceUpdate?'source-update-and-beat':'arrival-and-beat',text};
 chapter.motivation=text;delete chapter.caches;delete chapter.hotspots;delete chapter.carry;
}
scenario.notes!.push('29 October density successor: fourteen genuinely distinct manuscript workstations in six larger settings restore the pre-consolidation state-sensitive carry cadence. Each workstation exposes all its authored source leaves on arrival; the sole later new-record update remains explicit. No source leaf is invented, no surviving argument is deleted, and no manuscript tile is shortened by this geography overlay. Earlier desks remain in scrollback. Historical/source chronology and doctrinal attribution remain in the short prose; this is a comparative reading journey, not a claim that its authors met.');
