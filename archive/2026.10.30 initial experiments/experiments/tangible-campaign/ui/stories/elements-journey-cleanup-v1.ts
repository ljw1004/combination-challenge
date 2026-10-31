import type {Action} from '../../schema/campaign.ts';
import {elements as before} from './authenticity-repairs-v2.ts';

/** Unregistered review candidate. Preserve every predecessor/save identity.
 * Cut the owner's rejected map/chest wrappers rather than rationalising them.
 * No runtime, stock, place, artwork or other world's source changes. */
export const elements=structuredClone(before);
elements.id='elements-journey-cleanup-v7';
for(const c of elements.chapters){
 if(c.entryCue)c.entryCue.id=`${elements.id}:${c.id}:entry-v1`;
 if(c.travel)c.travel.entryCue.id=`${elements.id}:${c.travel.id}:entry-v1`;
}
const removed=new Set(['crossing-map','river-map','harbour-map','navigation-chart','river-atlas','tool-chest']);
elements.items=elements.items.filter(i=>!removed.has(i.id));
elements.recipes=elements.recipes.filter(r=>!removed.has(r.id));
for(const c of elements.chapters)c.objectives=c.objectives.filter(o=>!removed.has(o.item??''));
const chapter=(id:string)=>elements.chapters.find(c=>c.id===id)!;
// Useful bridge, landing and light are outcomes, no longer map intermediates.
for(const [id,item]of [['crossing','footbridge'],['ferry','dock'],['harbour','lighthouse']]){
 delete chapter(id).objectives.find(o=>o.item===item)!.intermediate;
}
chapter('crossing').completionText='A bridge for our feet and a cart for our loads. Downstream, the miller has been watching that same water go to waste.';
chapter('ferry').completionText='A landing and a sailboat join the two banks. The river is beginning to connect our villages instead of keeping them apart.';
chapter('harbour').completionText='A light above the water and a buoy at the mooring. Now let us think about the people those boats will bring.';
// The boards-and-nails chest already does the requested storage work. Hinge is
// still available, with its mechanically different tripod use left intact.
chapter('workshop').objectives.push({id:'workshop-wooden-chest',text:'Make a wooden chest for tools',kind:'create',item:'wooden-chest'});
// The existing skip policy stays exact: pre-making the chest does not impose a
// replacement chore; pre-making both useful outcomes skips this whole beat.
const timetable=elements.recipes.find(r=>r.id==='landing-clock')!;
timetable.b='paper';
delete timetable.lifecycle!['river-map'];
timetable.lifecycle!['paper']={role:'transform',reason:'Paper becomes the written return-boat schedule; keep a paper supply only while another independent paper use still needs it.'};
timetable.description='Use the clock to agree and write three hourly morning return departures: 09:00, 10:00 and 11:00. The clock remains available to call each departure.';
const schedule=elements.items.find(i=>i.id==='landing-clock')!;
schedule.label='Return boats: 09:00 · 10:00 · 11:00';
schedule.description='A concrete hourly morning return-boat timetable, set by the landing clock. It gives departure times, not map directions.';
const timekeeping=chapter('timekeeping');
timekeeping.objectives[0].text='Schedule hourly return boats';
timekeeping.motivation='By morning, people are asking when their boats leave. The keeper needs departure times everyone can read and follow by the landing clock.';
timekeeping.entryCue!.text=timekeeping.motivation;
timekeeping.completionText='The keeper calls the nine o’clock boat, then the ten and eleven o’clock departures on the written schedule. Passengers can see when their boat leaves and wait for its turn.';
// Observing the real sky remains the payoff; no invented navigation knowledge.
const stars=chapter('stars');
stars.title='A steady view of the stars';
delete stars.objectives.find(o=>o.item==='star-chart')!.intermediate;
stars.completionText='A visitor takes a turn at the steady telescope, then points out the same star patterns on the chart. Her companions can look through the instrument and find those patterns for themselves.';
const gathering=chapter('gathering');
gathering.completionText='A lantern floats inside the sheltered landing basin. Around the table, neighbours remember the bridge, the boats and the things we made together. Someone saves your seat: from four beginnings, a river full of people and places to return to.';
// Weather book remains an optional use of actual observations, not a compulsory
// replacement anthology for the removed atlas. The finale needs no paperwork.
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const removedPairs=new Set(before.recipes.filter(r=>removed.has(r.id)).map(r=>pair(r.a,r.b)));
export function rewriteJourneyRoute(actions:Action[]):Action[]{
 let current=0;const out:Action[]=[];
 for(const a of actions){
  const id=before.chapters[current]?.id;
  if(a.type==='combine'){
   const p=pair(a.a,a.b);
   if(removedPairs.has(p))continue;
   if(id==='crossing'&&[pair('fiber','water'),pair('pulp','cloth')].includes(p))continue;
   // Make the unchanged hinge while the existing forge is actually nearby,
   // before the chest finishes this chapter. It can stay here until stargazing.
   if(id==='workshop'&&p===pair('planks','nails'))out.push({type:'combine',a:'iron',b:'nails'});
   if(id==='workshop'&&p===pair('iron','nails'))continue;
   if(id==='letters'&&p===pair('wood','kiln'))out.push({type:'combine',a:'fiber',b:'water'},{type:'combine',a:'pulp',b:'cloth'});
   if(id==='timekeeping'&&p===pair('clock','river-map')){out.push({type:'combine',a:'clock',b:'paper'});continue;}
   if(id==='stars'&&p===pair('telescope','paper'))continue;
   if(id==='gathering'&&p===pair('weather-record','bound-book'))continue;
   out.push(a);
   if(id==='stars'&&p===pair('telescope','tripod'))out.push({type:'combine',a:'mounted-telescope',b:'paper'});
  }else out.push(a);
  if(a.type==='advance')current++;
 }
 return out;
}
for(const cp of elements.checkpoints??[]){
 cp.actions=rewriteJourneyRoute(cp.actions);
 if(cp.id==='chapter-28')cp.label='28. A steady view of the stars';
}
elements.notes!.push('Unregistered journey-cleanup review candidate: remove the three compulsory maps and their navigation/atlas wrappers; finish on useful bridge/cart, dock/sailboat, lighthouse/buoy, actual star observation and the existing gathering lantern. Use Clock + Paper for an explicitly printed hourly return-boat timetable. A wooden chest already stores tools, so remove its hinge promotion and retain hinge for the tripod. No new inventory, stock, location, tool or replacement paperwork. Canonical paper preparation occurs at its first useful visit. Keep hinge preparation at the forge workshop, before its final chest goal; later visit carry should leave that future component here until it is relevant. The inherited recipe remains unrestricted by place; no claim is made that headland forging is physically complete. Arrival/peak and alternative preparation-order measurements are required before release. All predecessors and prior authenticity grades remain unchanged.');
export const scenario=elements;
