import type {Action} from '../../schema/campaign.ts';
import {elements as before} from './elements-journey-cleanup-v2.ts';

/** Isolated, unregistered successor. Preserve v8 and every earlier identity.
 * Replace the generic two-step pump with a directly understandable water lift.
 * Ordinary fixing/shaping is compressed; no extra inventory or fitting chores. */
export const elements=structuredClone(before);
elements.id='elements-waterworks-v9';
for(const chapter of elements.chapters){
 if(chapter.entryCue)chapter.entryCue.id=`${elements.id}:${chapter.id}:entry-v1`;
 if(chapter.travel)chapter.travel.entryCue.id=`${elements.id}:${chapter.travel.id}:entry-v1`;
}
const removed=new Set(['pump','water-pump']);
elements.items=elements.items.filter(item=>!removed.has(item.id));
elements.recipes=elements.recipes.filter(recipe=>!removed.has(recipe.id));
elements.items.push({id:'water-lifting-wheel',label:'Waterwheel with jars',description:'Glazed jars fixed around the paddled wheel scoop water from the stream and tip it into the raised reservoir as the current turns the wheel.'});
elements.recipes.push({
 id:'water-lifting-wheel',a:'waterwheel',b:'glazed-bottle',out:'water-lifting-wheel',
 description:'Fix open glazed jars around the rim of the paddled waterwheel. The current turns the wheel; the jars scoop, lift and tip the water into the basin above the beds.',
 caveat:'Ordinary attachment and positioning are compressed. The existing pottery supply represents multiple fired vessels, not a single jar copied into several objects. No claim of a particular lift height, flow rate or engineering specification.',
 sources:['fao-noria'],
 lifecycle:{
  waterwheel:{role:'transform',reason:'The existing paddled wheel is fitted with water-carrying jars. Keep an outside wheel only while an unfinished independent mill-drive use still needs the shared woodworking supply.'},
  'glazed-bottle':{role:'incorporate',reason:'Fired glazed jars from the existing pottery supply become the scoops. Independent cider, float and water-service uses still retain their own outside vessel supply.'},
 },
});
const fill=elements.recipes.find(recipe=>recipe.id==='filled-reservoir')!;
fill.b='water-lifting-wheel';
delete fill.lifecycle!['water-pump'];
fill.lifecycle!['water-lifting-wheel']={role:'retain',reason:'The jar-fitted wheel keeps lifting stream water after filling the basin; it remains reusable waterworks equipment.'};
fill.description='The stream-driven jars tip their water into the basin at the top of the wheel, above the growing beds.';
elements.items.find(item=>item.id==='reservoir')!.description='A clay-lined brick storage basin set above the growing beds, ready to receive water lifted from the stream.';
elements.items.find(item=>item.id==='filled-reservoir')!.description='A raised storage basin supplied by the waterwheel’s scooping jars rather than carried buckets.';
const chapter=elements.chapters.find(chapter=>chapter.id==='waterworks')!;
chapter.motivation='The stream runs below the growing beds. Lifting its water into a raised basin would spare us the climb with every bucket.';
chapter.entryCue!.text=chapter.motivation;
elements.sources!.push({id:'fao-noria',title:'FAO: Water lifting devices, section 3.4.1 — bucket elevators, Persian wheels and norias',url:'https://www.fao.org/4/ah810e/AH810E05.htm',note:'A water-powered noria carries pots, buckets or bamboo containers around the wheel rim. Supports the direct-lift mechanism, not dimensions, performance or the game’s complete construction.'});
const pair=(a:string,b:string)=>[a,b].sort().join('|');
export function rewriteWaterworksRoute(actions:Action[]):Action[]{
 return actions.flatMap(action=>{
  if(action.type!=='combine')return [action];
  const p=pair(action.a,action.b);
  if(p===pair('wheel','hollow-pipe'))return [];
  if(p===pair('pump','waterwheel'))return [{type:'combine',a:'waterwheel',b:'glazed-bottle'} as Action];
  if(p===pair('reservoir','water-pump'))return [{type:'combine',a:'reservoir',b:'water-lifting-wheel'} as Action];
  return [action];
 });
}
for(const checkpoint of elements.checkpoints??[])checkpoint.actions=rewriteWaterworksRoute(checkpoint.actions);
elements.notes!.push('Unregistered waterworks review successor: challenge the generic pump finding against ordinary assembly first. A smooth wheel plus open wooden conduit does not visibly choose a lifting principle, so consolidate Pump and Water pump into one noria-style Waterwheel with jars using the existing fired ceramic supply. Keep the reservoir, delivery channel and irrigated-garden payoff; no premade equipment, extra stock, valve/fastener recipes, new place or unrelated Stone hammer/Telescope edits. Prior findings and versions remain immutable. Physical performance, browser pixels and human enjoyment require separate evidence.');
export const scenario=elements;
