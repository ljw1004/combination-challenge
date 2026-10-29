import type {LocationDefinition, LocationVisit} from '../../schema/campaign.ts';
import {scenario as mergedLocations} from './elements-locations.ts';

/** A separate save identity: the published merged clearing remains unchanged.
 * Restore the proven opening carry cadence at real neighbouring viewpoints.
 * No recipe, stock, lifecycle, goal or already-complete policy changes here. */
export const scenario = structuredClone(mergedLocations);
scenario.id = 'elements-small-scenes-v3';

const openingScenes = [
  {chapter:'beginnings',id:'E01',label:'River clearing',brief:'An open clearing beside the river holds the four beginnings.',text:'Four beginnings lie beside the river. There is room here to see what they can become.'},
  {chapter:'supper',id:'E01-orchard-edge',label:'Orchard edge',brief:'The orchard path opens into a grassy place for supper, away from the first material experiments.',text:'At the orchard edge, there is a quiet place for supper before the walk ahead.'},
  {chapter:'shelter',id:'E01-home-site',label:'Cottage site',brief:'Beyond the orchard path, a sheltered clearing has room for a first home.',text:'The orchard path ends at a sheltered cottage site. There is still no roof for the night.'},
  {chapter:'crossing',id:'E01-stream-bank',label:'Stream bank',brief:'A close view of the brook shows the two banks and a bare working space beside the water.',text:'The brook divides the clearing. A bridge and cart would be easier.'},
];

const plan = scenario.locationPlan!;
const oldOpening = plan.locations.find(location=>location.id==='E01')!;
const locations:LocationDefinition[] = openingScenes.map((scene,index)=>({
  id:scene.id,label:scene.label,travelText:scene.brief,settingId:'first-river-valley',
  background:{stableKey:scene.id,sceneBrief:scene.brief,asset:`/assets/locations/${scene.id}.webp`,focalPoint:{x:.5,y:.5}},
  // Only the actual opening has stock: the same four beginnings, once.
  stockBatches:index===0?oldOpening.stockBatches:[],
  hotspots:index===0?oldOpening.hotspots:[],
}));
const visits:LocationVisit[] = openingScenes.map(scene=>({id:`${scene.id}-visit-1`,locationId:scene.id,chapterIds:[scene.chapter]}));
plan.locations=[...locations,...plan.locations.filter(location=>location.id!=='E01')];
plan.visits=[...visits,...plan.visits.filter(visit=>visit.locationId!=='E01')];

// Cue IDs belong to this successor, including the as-yet unchanged later beats.
for(const chapter of scenario.chapters)if(chapter.entryCue)chapter.entryCue.id=`${scenario.id}:${chapter.id}:entry-v1`;
for(const scene of openingScenes){
  const chapter=scenario.chapters.find(chapter=>chapter.id===scene.chapter)!;
  chapter.location={id:scene.id,label:scene.label,travelText:scene.brief};
  chapter.visitId=`${scene.id}-visit-1`;
  chapter.entryCue={...chapter.entryCue!,mode:'arrival-and-beat',sourceCaption:scene.label,text:scene.text};
  chapter.motivation=scene.text;
}
scenario.notes!.push('29 October human playtest: restore the pre-consolidation opening cadence as four genuine river-valley viewpoints. Each arrival uses state-sensitive current-scene carry; earlier food, house and material experiments remain tangible in their earlier scrollback panels. Canonical entries are 4/5/6/6 things; canonical peaks are 7/13/15/14, not a claimed strict ten-object cap. Later merged locations are unchanged pending separate measured restoration.');

export const elementsOpeningSceneBriefs=openingScenes;
