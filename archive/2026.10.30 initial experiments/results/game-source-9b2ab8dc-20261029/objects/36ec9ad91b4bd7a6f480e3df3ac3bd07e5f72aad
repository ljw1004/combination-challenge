import type {Action,Recipe,Scenario} from '../../schema/campaign.ts';
/** Bounded early-journey survey successor. Later scout/channel/depot work is
 * deliberately preserved for a separate story-purpose review. */
export function withMarsPurposefulSurvey(before:Scenario,id:string):Scenario{
 const s=structuredClone(before);s.id=id;
 const item=(id:string)=>s.items.find(i=>i.id===id)!;
 const recipe=(id:string)=>s.recipes.find(r=>r.id===id)!;
 const chapter=(id:string)=>s.chapters.find(c=>c.id===id)!;
 const pair=(a:string,b:string)=>[a,b].sort().join('|');
 const removedItems=new Set(['survey-map','bearing-scope','compass-module','binoculars','annotated-map','weather-route-map']);
 const removedRecipes=new Set(['rover-10-bearing-scope','rover-11-bearing-map','outcrop-8-annotated-map','weather-13-weather-route-map']);
 const optionalRouteRecipes=new Set(['outcrop-4-telescope','outcrop-5-field-telescope','outcrop-6-telescope-camera','outcrop-7-cliff-photograph']);
 const skipPairs=new Set(s.recipes.filter(r=>removedRecipes.has(r.id)||optionalRouteRecipes.has(r.id)).map(r=>pair(r.a,r.b)));
 const replace=(r:Recipe,old:string,next:string,reason:string,role:'retain'|'transform'='retain')=>{if(r.a===old)r.a=next;if(r.b===old)r.b=next;delete r.lifecycle![old];r.lifecycle![next]={role,reason};};
 s.items=s.items.filter(i=>!removedItems.has(i.id));s.recipes=s.recipes.filter(r=>!removedRecipes.has(r.id));
 Object.assign(item('terrain-sheet'),{label:'Regional map',description:'The expedition’s existing map, prepared from orbital imagery and the known mission sites. It shows the ice outcrop, weather station, relay and depot, but not every local obstacle.'});
 Object.assign(item('panorama'),{label:'Outcrop approach view',description:'The visible outcrop and surrounding landmarks, photographed from the landed sled’s overlook. This view helps locate the approach on the regional map; it does not certify all the ground ahead.'});
 Object.assign(item('bearing-map'),{label:'Route to the outcrop',description:'The expedition map with our starting point and the approach to the visible ice outcrop marked from the local view. The same regional map remains useful later.'});
 recipe('rover-8-panorama').description='Photograph the outcrop and the landmarks between it and our landed sled.';
 const choose=recipe('rover-9-survey-map');choose.out='bearing-map';choose.description='Match the outcrop and nearby landmarks in the view to the regional map, and mark the approach from our landed sled.';choose.lifecycle!['terrain-sheet']={role:'transform',exclusive:true,reason:'The existing expedition map now records this immediate approach. No separate survey-map or bearing-map paperwork is required.'};
 chapter('rover').objectives.find(o=>o.item==='bearing-map')!.text='Find route to the outcrop';
 chapter('rover').entryCue!.text='The expedition map already shows the ice outcrop and stations beyond it. From the sled I can match those landmarks to the ground in front of us, then take the rover toward the missing crew.';chapter('rover').motivation=chapter('rover').entryCue!.text;
 chapter('rover').completionText='The rover is ready, and our map shows the approach to the outcrop. We can follow it away from the landing site.';
 // Cliff photography is an optional observation, never a mandatory navigation
 // proof or a scientific premise about the unrelated basin specimen.
 chapter('outcrop').objectives=chapter('outcrop').objectives.filter(o=>o.item!=='annotated-map');
 for(const camera of ['camera','field-camera'])s.recipes.push({id:`outcrop-cliff-${camera}`,a:camera,b:'@distant-lookout',out:'cliff-photograph',description:'Photograph the visible cliff and its layers. This broad view does not establish a passable route, buried ice quantity or the history of another site.',lifecycle:{[camera]:{role:'retain',reason:'The camera remains usable after taking this optional cliff view.'}}});
 item('cliff-photograph').description='An optional photograph of the visible cliff and its layers. It is not a route certificate or evidence about a different site.';
 chapter('outcrop').completionText=s.items.some(i=>i.id==='creature-core')?'The sealed core and its layer photograph are secure. We can examine the specimen at the field laboratory.':'The ice sample is labelled, and the photographs record the specimen and core layers. We can carry those observations without pretending we know the whole story.';
 const jarPhoto=recipe('outcrop-3-ice-photograph');if(jarPhoto){const alt=structuredClone(jarPhoto);alt.id='outcrop-ice-photograph-field-camera';replace(alt,'camera','field-camera','The already-mounted camera can photograph the same labelled specimen without dismantling its support.');s.recipes.push(alt);}
 // The observed weather interval is the useful result. It is not another type
 // of map, and it does not establish a permanently safe route.
 const weather=chapter('weather');weather.objectives.find(o=>o.item==='weather-route-map')!.item='weather-record';weather.objectives.find(o=>o.item==='weather-record')!.text='Find a clear interval';weather.completionText='The station record shows an interval of better visibility, and the spare controller is protected. We can continue to the relay.';
 item('weather-record').description='The restored station’s recorded interval of local conditions, showing when visibility improves. It does not predict every later condition.';
 const rescue=recipe('relay-13-rescue-route');replace(rescue,'weather-route-map','bearing-map','The existing regional map locates the crew’s reported landmark and remains available for the later traverse.');rescue.description='Match the crew’s reported landmark to our regional map and locate their stranded crawler.';
 item('rescue-route').label='Route to the crew';item('rescue-route').description='The crew’s reported location and the approach to their stranded crawler, ready for the rover’s navigation display.';
 const rover=item('rover');rover.slots!.push({id:'rescue-route',accepts:['rescue-route'],required:false,capabilities:['crew-route-loaded']});
 s.recipes.push({id:'relay-load-crew-route',a:'rover',b:'rescue-route',install:{target:'rover',slot:'rescue-route',component:'rescue-route'},requires:[{item:'rover',capability:'solar-travel'}],description:'Load the crew’s location into this rover. We can now follow the route to their stranded crawler.',lifecycle:{rover:{role:'retain',reason:'The same working rover receives the route, keeping its drive, power supply, harness and every fitted part.'},'rescue-route':{role:'incorporate',reason:'The directions are now loaded in the rover’s navigation display; no loose duplicate route is needed.'}}});
 const relay=chapter('relay'),goal=relay.objectives.find(o=>o.item==='rescue-route')!;delete goal.item;goal.capability='crew-route-loaded';goal.text='Set rover course to the crew';relay.completionText='Their cabin is intact; its drive has failed. Their location is loaded into our rover. We can go to them.';
 chapter('rescue').location.travelText='We follow the route loaded in our rover to the survey crew’s stranded crawler.';
 const rescueLocation=s.locationPlan!.locations.find(l=>l.id===chapter('rescue').location.id)!;rescueLocation.travelText=chapter('rescue').location.travelText;
 // One later map consumer remains: update the same expedition map using the
 // scout’s actual terrain observations. No deleted precursor is still required.
 replace(recipe('traverse-8-traverse-map'),'annotated-map','bearing-map','The existing expedition map is updated with the scout’s local terrain observations.','transform');
 const mapId=(id:string)=>['survey-map','annotated-map','weather-route-map'].includes(id)?'bearing-map':id;
 const list=(ids:string[])=>[...new Set(ids.filter(i=>!['bearing-scope','compass-module','binoculars'].includes(i)).map(mapId))];
 for(const c of s.chapters){if(c.carry)c.carry=list(c.carry);if(c.travel)c.travel.carry=list(c.travel.carry);for(const b of c.caches??[])b.items=list(b.items);if(c.entryCue)c.entryCue.id=`${id}:${c.id}:entry-v1`;if(c.travel)c.travel.entryCue.id=`${id}:${c.travel.id}:entry-v1`;}
 s.initialItems=list(s.initialItems);for(const l of s.locationPlan!.locations)for(const b of l.stockBatches)b.items=list(b.items);for(const v of s.locationPlan!.visits){if(v.carry)v.carry=list(v.carry);if(v.carryAlong)v.carryAlong=list(v.carryAlong);}
 // Names in the sled inventory reflect equipment actually available on arrival.
 for(const l of s.locationPlan!.locations)for(const b of l.stockBatches)if(b.items.includes('terrain-sheet'))b.narrative='The landed sled holds the rover parts, the expedition’s regional map, a camera and supported-viewing equipment. The map already records known mission sites.';
 for(const cp of s.checkpoints??[])cp.actions=cp.actions.flatMap((a):Action[]=>{
  if(a.type==='combine'){
   if(skipPairs.has(pair(a.a,a.b)))return [];
   let next={...a,a:mapId(a.a),b:mapId(a.b)};
   if(['ice-core','creature-core','catalogued-ice-sample'].some(i=>[next.a,next.b].includes(i))&&[next.a,next.b].includes('camera'))next={...next,a:next.a==='camera'?'field-camera':next.a,b:next.b==='camera'?'field-camera':next.b};
   if(pair(next.a,next.b)===pair('distress-recording','bearing-map'))return [next,{type:'combine',a:'rover',b:'rescue-route'}];return [next];
  }
  if(a.type==='visit'&&a.carry)return [{...a,carry:list(a.carry)}];return [a];
 });
 s.notes=[...(s.notes??[]),'29 October bounded survey-purpose successor: existing orbital regional map plus local landmarks selects the immediate outcrop approach. Remove compass/bearing and generic annotated/weather map wrappers. Cliff photography remains optional; no unrelated basin evidence gate. The weather record identifies a visibility interval. Crew directions are loaded into the same working rover before travel to the crawler. Late scout/channel/depot map wrappers are preserved pending their own review.'];
 return s;
}
