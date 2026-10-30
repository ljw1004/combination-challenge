import type {LocationDefinition} from '../../schema/campaign.ts';
import {scenario as merged} from './mars-locations.ts';
import {scenario as beforeLocations} from './mars-return-cargo.ts';
import {physicalLocationData} from './physical-location-data.ts';
/** Restore useful field-work cadence while retaining the newer observation,
 * specimen collection, recovery travel and orbital-destination corrections. */
export const scenario=structuredClone(merged);
scenario.id='mars-field-scenes-v6';
export const marsFieldScenes=[
 {chapter:'signal',id:'M01',setting:'landing-site',label:'Contact ridge',brief:'The contact ridge looks over the landing site.'},
 {chapter:'habitat',id:'M02',setting:'landing-site',label:'Surviving habitat',brief:'Back below the ridge, the surviving cabin and its torn outer entry need attention.'},
 {chapter:'rover',id:'M03-sled-build',setting:'landing-site',label:'Cargo-sled assembly area',brief:'Beside the landed cargo sled, there is room to assemble the vehicle and look out along the route.'},
 {chapter:'outcrop',id:'M04',setting:'ice-outcrop',label:'Ice-outcrop field station',brief:'At the outcrop, the expedition sampling case is opened beside the exposed layers.'},
 {chapter:'weather',id:'M05',setting:'weather-station',label:'Weather-station apron',brief:'The disused weather station has its own service apron and instrument stores.'},
 {chapter:'relay',id:'M06',setting:'relay-knoll',label:'Relay knoll',brief:'The relay mast stands beyond the station on its rocky knoll.'},
 {chapter:'rescue',id:'M07',setting:'crawler-recovery',label:'Stranded crawler',brief:'The crew wait in their intact cabin beside the crawler’s failed drive.'},
 {chapter:'camp',id:'M08-workcourt',setting:'recovery-camp',label:'Sheltered workcourt',brief:'With the crew settled, we move round the refuge to its sheltered workcourt.'},
 {chapter:'cargo-return',id:'M08-sled-path',setting:'recovery-camp',label:'Furniture-sled path',brief:'A short path leads from camp to the crew’s furniture sled and its belongings locker.'},
 {chapter:'night',id:'M08-thermal-bay',setting:'recovery-camp',label:'Thermal test bay',brief:'After dark, the camp’s separate thermal test bay becomes the next work area.',time:'After dark'},
 {chapter:'waterworks',id:'M09',setting:'ice-works',label:'Enclosed ice works',brief:'The enclosed ice-processing site lies beyond camp, with its drained circulation loop.'},
 {chapter:'garden',id:'M10',setting:'camp-greenhouse',label:'Greenhouse growing bed',brief:'Inside the greenhouse, the main growing bed and its cultivation stores are ready for work.'},
 {chapter:'nursery',id:'M10-propagation-bench',setting:'camp-greenhouse',label:'Propagation bench',brief:'Across the greenhouse, the smaller propagation bench has its own test shelf and nursery stores.'},
 {chapter:'workshop',id:'M11',setting:'camp-machine-shop',label:'Camp machine shop',brief:'The guarded machine and crawler parts wait in the enclosed machine shop.'},
 {chapter:'traverse',id:'M12',setting:'lava-rim-station',label:'Lava-rim scout station',brief:'The scout’s equipment is stored at the lava-rim station, overlooking the next traverse.'},
 {chapter:'crossing',id:'M13',setting:'channel-approach',label:'Channel survey station',brief:'At the channel approach, we open the ground-survey case beside the possible crossing.'},
 {chapter:'buried-story',id:'M14',setting:'layered-basin',label:'Basin coring station',brief:'In the layered basin, the field laboratory is unpacked beside the core site.'},
 {chapter:'contrast',id:'M14-gravel-edge',setting:'layered-basin',label:'Ripple and gravel edge',brief:'A closer station at the ripple-and-gravel edge gives the comparison kit a separate working surface.'},
 {chapter:'depot-way',id:'M15',setting:'depot-approach',label:'Depot marker line',brief:'Beyond the basin, the old marker line leads past the depot’s stored cargo hauler.'},
 {chapter:'oxygen',id:'M16-oxygen-bay',setting:'ascent-depot',label:'Oxygen-plant service bay',brief:'At the ascent depot, the oxygen-plant service bay is separate from the vehicle assembly area.'},
 {chapter:'ascent',id:'M16-cabin-bay',setting:'ascent-depot',label:'Cabin preparation bay',brief:'Across the depot, the cabin preparation bay holds the stored shell and its replacement fittings.'},
 {chapter:'rendezvous',id:'M17',setting:'clear-sky-station',label:'Clear-sky station',brief:'A separate observation station has the clear view and navigation instruments for the orbital meeting.'},
 {chapter:'departure',id:'M08-packing-bay',setting:'recovery-camp',label:'Camp return-packing alcove',brief:'Back at camp, the return-packing alcove opens for our final service before departure.',time:'Before departure'},
 {chapter:'homebound',id:'M16-launchpad',setting:'ascent-depot',label:'Final assembly pad',brief:'We return to the depot’s final assembly pad, where the qualified ascent stage and launch equipment wait.'},
] as const;
const oldLocation=(id:string)=>merged.locationPlan!.locations.find(l=>l.id===id)!;
const allStock=merged.locationPlan!.locations.flatMap(l=>l.stockBatches);
const baseId=(chapter:string)=>merged.chapters.find(c=>c.id===chapter)!.location.id;
const currentItems=new Set(scenario.items.map(i=>i.id));
const locations:LocationDefinition[]=marsFieldScenes.map(scene=>{
 const original=beforeLocations.chapters.find(c=>c.id===scene.chapter)!;
 const batches=scene.chapter==='signal'?allStock.filter(b=>b.id==='mars-opening@M01'):allStock.filter(b=>(original.caches??[]).some(c=>b.id.startsWith(c.id+'@')));
 const stockBatches=batches.filter(b=>scene.chapter!=='rescue'||b.id.endsWith('@M07')).map(b=>({...structuredClone(b),id:b.id.split('@')[0]+'@'+scene.id,items:b.items.filter(id=>currentItems.has(id))}));
 const hotspots=scene.chapter==='homebound'?[]:[...(original.hotspots??[])];
 return {id:scene.id,settingId:scene.setting,label:scene.label,travelText:scene.brief,...('time'in scene?{timeLabel:scene.time}:{}),background:{...structuredClone(oldLocation(baseId(scene.chapter)).background),stableKey:scene.id,sceneBrief:scene.brief,asset:`/assets/locations/${scene.id}.webp`},stockBatches,hotspots};
});
const restoredProvenance:Record<string,string>={
 'outcrop-cache':'At the outcrop, the expedition sampling case is opened with its scoop, jar, core tube and labels, handling enclosure and glove ports.',
 'cargo-return-cache':'The furniture sled’s belongings locker contains protective padding and the crew’s picture roll.',
 'night-cache':'The separate camp thermal bay holds its wall sample, measured template and removable screen kit beside the fixed thermal chamber.',
 'crossing-cache':'At the channel survey station, the opened field case holds the ground probe, map overlay and crossing marker.',
 'buried-story-cache':'The field laboratory unpacked at the basin core site contains the coring, handling and observation instruments, with its specimen log.',
 'contrast-cache':'The comparison case is opened at the ripple-and-gravel edge. A loose chip must still be collected visibly from the gravel ledge.',
 'departure-cache':'The camp return-packing alcove holds the stored cargo protection, archive materials and handover equipment for the final service.',
};
for(const location of locations)for(const batch of location.stockBatches){const narrative=restoredProvenance[batch.id.split('@')[0]];if(narrative)batch.narrative=narrative;}
// The refuge and orbital rendezvous are still earned internal travel, not free
// scene changes or inventory destinations. Their stock is never duplicated.
const refuge=structuredClone(oldLocation('M08'));refuge.settingId='recovery-camp';refuge.label='Service refuge';refuge.travelText='The nearby service refuge has its own shelter and bedding stores, apart from the workcourt and thermal bay.';refuge.stockBatches=refuge.stockBatches.filter(b=>b.id==='rescue-cache@M08');refuge.hotspots=[];refuge.background.sceneBrief=refuge.travelText;
const orbit=structuredClone(oldLocation('M18'));orbit.settingId='orbital-rendezvous';locations.push(refuge,orbit);
scenario.locationPlan={locations,visits:marsFieldScenes.map(scene=>({id:scene.id+'-visit-1',locationId:scene.id,chapterIds:[scene.chapter]})),panel:{width:390,height:844}};
for(const scene of marsFieldScenes){const chapter=scenario.chapters.find(c=>c.id===scene.chapter)!;chapter.location={id:scene.id,label:scene.label,travelText:scene.brief};chapter.visitId=scene.id+'-visit-1';const curated=beforeLocations.chapters.find(c=>c.id===chapter.id)!.carry;if(curated)scenario.locationPlan!.visits.find(v=>v.id===chapter.visitId)!.carry=[...curated];delete chapter.carry;
 const plot=physicalLocationData.mars.chapters.find(c=>c.currentChapterId===scene.chapter)!.popupScript;
 const text=scene.brief+' '+plot;chapter.entryCue={...chapter.entryCue!,id:`${scenario.id}:${chapter.id}:entry-v1`,mode:'arrival-and-beat',text,sourceCaption:scene.label};chapter.motivation=text;
}
const recovery=scenario.chapters.find(c=>c.id==='rescue')!.travel!;
recovery.carry=['crawler','towed-crawler','heater','pressure-patch','toolkit','spare-drive','drive-coupling','serviced-drive','replacement-drive'];
recovery.entryCue={...recovery.entryCue,id:`${scenario.id}:${recovery.id}:entry-v1`,sourceCaption:'Service refuge',text:'The crew have reached the nearby service refuge. Its shelter and bedding stores are here; first I need to make it warm and welcoming.'};
const ascent=scenario.chapters.find(c=>c.id==='homebound')!.travel!;ascent.entryCue.id=`${scenario.id}:${ascent.id}:entry-v1`;
// Generic placeholder provenance should name the actual source work area.
for(const location of locations)for(const batch of location.stockBatches)for(const id of batch.items){const item=scenario.items.find(i=>i.id===id)!;if(/^Available with the equipment at /u.test(item.description??''))item.description=`Available with the equipment at ${location.label} from the first arrival.`;}
scenario.notes!.push('29 October field-scene density successor: prior source groups return at genuine distinct working areas, including separate nursery, thermal, comparison, packing, oxygen, cabin and launch workstations. The restored cadence retains current streamlined core observation, visibly collected gravel and earned recovery/orbital travel. No new item, recipe or goal; no travel deletion. The rescue travel carry now concerns only the recovery/refuge leg, not three later camp chapters.');
