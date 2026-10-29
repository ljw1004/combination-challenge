import type {LocationDefinition,LocationVisit} from '../../schema/campaign.ts';
import {scenario as previous} from './food-kitchen-caravan.ts';
import {physicalLocationSuccessor} from './physical-location-plan.ts';
/** Genuine commercial workstations, authorized after the six-place density probe.
 * Each station persists across several services and exposes its ordinary stock on arrival.
 * Existing six-place proposal and old v6 save data remain separate evidence. */
export const scenario=physicalLocationSuccessor(previous,'kitchen','kitchen-caravan-stations-v7');
const stations=[
 {id:'K01',label:'Roadside hearth',chapters:['hearth'],brief:'The caravan’s grain, apples and everyday equipment stand beside a roadside hearth.'},
 {id:'K02',label:'Orchard farm kitchen',chapters:['dairy','orchard'],brief:'The farm kitchen joins its dairy and bakehouse, with ordinary stores ready for breakfast and the harvest lunch.'},
 {id:'K03',label:'Market inn kitchen',chapters:['soup','salads'],brief:'The inn’s kitchen shelters the rainbound caravan beside its vegetable pantry, stove and oven.'},
 {id:'K04',label:'Market cookshop · dough bench',chapters:['noodles','pastry'],brief:'The cookshop’s broad dough bench sits beside its pasta pots and pastry oven, with rolling and cutting tools ready for service.'},
 {id:'K04-hot-line',label:'Market cookshop · hot-food range',chapters:['sauce','sugar'],brief:'Across the cookshop, the hot-food range has saucepans, a steamer and an oven beside the fruit-preserving shelf.'},
 {id:'K05',label:'Fair bakery · confectionery bench',chapters:['confection','custard'],brief:'The bakery’s confectionery bench has a sugar pan and custard oven beside the stocked nut, fruit and egg shelves.'},
 {id:'K05-bakehouse',label:'Fair bakery · pastry ovens',chapters:['choux','sponge'],brief:'The adjoining pastry station has a working pan, baking oven and broad cooling bench, ready for choux and the birthday cakes.'},
 {id:'K06',label:'Station kitchen · tea counter',chapters:['chocolate','quickbread'],brief:'The station tea counter has a chocolate pan and baking oven beside the serving counter, ready for the waiting passengers.'},
 {id:'K06-dessert',label:'Station kitchen · dessert workbench',chapters:['ice','meringue'],brief:'The cold-dessert workbench has a freezing churn, a meringue oven and chilled preparation space for the long afternoon service.'},
 {id:'K06-supper',label:'Station kitchen · supper bench',chapters:['cannery','precision','snack'],brief:'The supper bench stands beside the controlled preserving lines, the waiting trolley and the dining-car service hatch.'},
];
const scripts:Record<string,string>={
 noodles:'The lunch queue is longer than expected. The dough bench has room for both pasta and pastry; our earlier preparations can help with both services.',
 sauce:'The stallholders are closing up, but they have not eaten. Bring our useful preparations across to the hot-food range; the fruit stores are here for preserving too.',
 confection:'The fair will keep this confectionery bench busy. Nuts, fruit, egg stocks and custard equipment are ready for the whole service.',
 choux:'The pastry counter needs filling again. Our custard and cream can come across to the ovens, where the baking tools are already waiting.',
 chocolate:'The family’s train leaves this evening. Their cake can come to the tea counter, and we can prepare something for the other waiting passengers too.',
 ice:'The platform is still hot. At the dessert workbench, the churn and oven are ready for cold sweets now and meringues later.',
 cannery:'The train’s catering cart has been delayed. At the supper bench, we can send a fresh meal and a sealed reserve through the waiting service hatch.',
};
const locations:LocationDefinition[]=stations.map(station=>({id:station.id,label:station.label,travelText:station.brief,background:{stableKey:station.id,sceneBrief:station.brief,asset:`/assets/locations/${station.id}.webp`,focalPoint:{x:.5,y:.5}},stockBatches:station.chapters.flatMap(id=>(previous.chapters.find(c=>c.id===id)!.caches??[]).filter(c=>c.items.length).map(c=>({...structuredClone(c),id:`${c.id}@${station.id}`}))),hotspots:station.chapters.flatMap(id=>previous.chapters.find(c=>c.id===id)!.hotspots??[])}));
locations[0].stockBatches.unshift({id:'kitchen-opening@K01',label:'Roadside caravan stores',narrative:stations[0].brief,items:[...previous.initialItems]});
for(const location of locations)for(const batch of location.stockBatches){batch.label=`${location.label} stores`;batch.narrative=`The ordinary ingredients and tools for this station are here on arrival and remain available throughout its services.`;}
const visits:LocationVisit[]=stations.map(station=>({id:`${station.id}-visit-1`,locationId:station.id,chapterIds:[...station.chapters]}));
for(const station of stations)for(const [index,id] of station.chapters.entries()){
 const chapter=scenario.chapters.find(c=>c.id===id)!;chapter.location={id:station.id,label:station.label,travelText:station.brief};chapter.visitId=`${station.id}-visit-1`;
 const beat=scripts[id]??chapter.entryCue!.text.split('\n\n').at(-1)!;
 chapter.entryCue={...chapter.entryCue!,id:`${scenario.id}:${id}:entry-v1`,mode:index?'beat':'arrival-and-beat',sourceCaption:station.label,text:index?beat:`${station.brief}\n\n${beat}`};chapter.motivation=chapter.entryCue.text;
}
scenario.locationPlan={locations,visits,panel:{width:390,height:844}};
scenario.notes!.push('The user’s later explicit commercial-station direction supersedes the six-location proposal: ten substantial workstations, not chapter-sized cupboards. Every non-opening station has two or three services, complete ordinary stock at its first arrival, and persistent prior boards. No recipe, lifecycle, terminal object or ingredient timing within a station is altered to fake a fit.');
export const kitchenStationArtBriefs=stations.map(({id,label,brief,chapters})=>({id,label,sceneDescription:brief,chapters}));
