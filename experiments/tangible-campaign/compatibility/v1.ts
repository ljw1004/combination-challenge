/** Explicit, lossless v1 boundary. Never recursively rename arbitrary keys: item
 * ids, lifecycle dictionaries, labels, quotations and source URLs are opaque.
 * The wire/save format stays v1 so old builds can still read new progress.
 */
import type * as Old from '../schema/scenario.ts';
import type * as Current from '../schema/campaign.ts';
import type * as Legacy from '../engine/model.ts';
import type * as Runtime from '../engine/campaign.ts';
type Fields = Record<string,string>;
const reverse=(fields:Fields):Fields=>Object.fromEntries(Object.entries(fields).map(([a,b])=>[b,a]));
/** Keep order and optional-field presence as well as values. Malformed values
 * pass through to the existing semantic validator rather than being repaired. */
function map(value:any,names:Fields,children:Record<string,(v:any)=>any>={}):any {
 if(!value||typeof value!=='object'||Array.isArray(value))return value;
 const seen=new Set<string>();
 return Object.fromEntries(Object.entries(value).map(([key,v])=>{
  const target=Object.hasOwn(names,key)?names[key]:key;
  if(seen.has(target))throw new Error('Invalid campaign save/schema: mixed vocabulary field '+target);
  seen.add(target);return [target,Object.hasOwn(children,key)?children[key](v):v];
 }));
}
const optional=(f:(v:any)=>any)=>(v:any)=>{try{return f(v);}catch(e){if(e instanceof Error&&e.message.startsWith('Invalid campaign save/schema: mixed vocabulary field '))return null;throw e;}};
const each=(f:(v:any)=>any)=>(v:any)=>Array.isArray(v)?v.map(f):v;
const chapterNames={area:'location',locations:'hotspots'},objectiveNames={location:'hotspot'};
export const fromLegacyObjective=(o:Old.Objective):Current.Objective=>map(o,objectiveNames);
export const toLegacyObjective=(o:Current.Objective):Old.Objective=>map(o,reverse(objectiveNames));
export function fromLegacyAction(a:Old.Action):Current.Action {return map(a,a?.type==='place'?{location:'hotspot'}:a?.type==='visit'?{area:'location'}:{});}
export function toLegacyAction(a:Current.Action):Old.Action {return map(a,a?.type==='place'?{hotspot:'location'}:a?.type==='visit'?{location:'area'}:{});}
export const fromLegacyChapter=(s:Old.Stage):Current.Chapter=>map(s,chapterNames,{objectives:each(fromLegacyObjective)});
export const toLegacyChapter=(s:Current.Chapter):Old.Stage=>map(s,reverse(chapterNames),{objectives:each(toLegacyObjective)});
export function fromLegacyScenario(s:Old.Scenario):Current.Scenario {
 const out=map(s,{locations:'hotspots',stages:'chapters'},{stages:each(fromLegacyChapter),checkpoints:each(c=>map(c,{},{actions:each(fromLegacyAction)}))});
 return out&&typeof out==='object'?{...out,schemaVersion:out.schemaVersion===1?2:out.schemaVersion}:out;
}
export function toLegacyScenario(s:Current.Scenario):Old.Scenario {
 const out=map(s,{hotspots:'locations',chapters:'stages'},{chapters:each(toLegacyChapter),checkpoints:each(c=>map(c,{},{actions:each(toLegacyAction)}))});
 return out&&typeof out==='object'?{...out,schemaVersion:out.schemaVersion===2?1:out.schemaVersion}:out;
}
const tokenNames={area:'location',location:'hotspot'};
export const fromLegacyToken=(t:Legacy.Token):Runtime.Token=>map(t,tokenNames);
export const toLegacyToken=(t:Runtime.Token):Legacy.Token=>map(t,reverse(tokenNames));
const locationNames={enteredAtStage:'enteredAtChapter'},hotspotNames={area:'location'},entryNames={stage:'chapter'},arrivalNames={stage:'chapter',area:'location'},supplyNames={sourceStage:'sourceChapter',area:'location'};
export const fromLegacyArrival=(a:Legacy.Arrival):Runtime.Arrival=>map(a,arrivalNames,{supplies:each(x=>map(x,supplyNames))});
export const toLegacyArrival=(a:Runtime.Arrival):Legacy.Arrival=>map(a,reverse(arrivalNames),{supplies:each(x=>map(x,reverse(supplyNames)))});
export const fromLegacyArrivalLayout=(a:Legacy.ArrivalLayout):Runtime.ArrivalLayout=>map(a,arrivalNames);
export const toLegacyArrivalLayout=(a:Runtime.ArrivalLayout):Legacy.ArrivalLayout=>map(a,reverse(arrivalNames));
const stateNames={stage:'chapter',currentArea:'currentLocation',areas:'locations',places:'hotspots'};
export const fromLegacyState=(s:Legacy.State):Runtime.State=>map(s,stateNames,{tokens:each(fromLegacyToken),areas:each(a=>map(a,locationNames)),places:each(p=>map(p,hotspotNames)),arrival:optional(fromLegacyArrival),arrivalLayout:optional(fromLegacyArrivalLayout),arrivalLayouts:each(optional(fromLegacyArrivalLayout)),chapterEntry:optional(e=>map(e,entryNames))});
export const toLegacyState=(s:Runtime.State):Legacy.State=>map(s,reverse(stateNames),{tokens:each(toLegacyToken),locations:each(a=>map(a,reverse(locationNames))),hotspots:each(p=>map(p,reverse(hotspotNames))),arrival:optional(toLegacyArrival),arrivalLayout:optional(toLegacyArrivalLayout),arrivalLayouts:each(optional(toLegacyArrivalLayout)),chapterEntry:optional(e=>map(e,reverse(entryNames)))});
const legacyMessages:Record<string,string>={"That location has not been reached.": "That area has not been reached.", "Carry only things physically in your current location.": "Carry only things physically in your current area.", "Choose a thing in this location.": "Choose a thing in this area.", "That hotspot is not in this location.": "That place is not in this area.", "Choose another thing or hotspot in this location.": "Choose another thing or place in this area.", "No new combinations with things currently in this location": "No new combinations with things currently in this area"};
export const toLegacyMessage=(s:string)=>Object.hasOwn(legacyMessages,s)?legacyMessages[s]:s;
const currentMessages=reverse(legacyMessages);
const fromLegacyMessage=(s:string)=>Object.hasOwn(currentMessages,s)?currentMessages[s]:s;
export const fromLegacyEvent=(e:Legacy.Event):Runtime.Event=>map(e,entryNames,{action:fromLegacyAction,message:fromLegacyMessage});
export const toLegacyEvent=(e:Runtime.Event):Legacy.Event=>map(e,reverse(entryNames),{action:toLegacyAction,message:toLegacyMessage});
export function fromLegacyGame(g:Legacy.Game):Runtime.Game {
 const out=map(g,{},{state:fromLegacyState,history:each(fromLegacyState),events:each(fromLegacyEvent)});
 return out&&typeof out==='object'?{...out,version:out.version===1?2:out.version}:out;
}
export function toLegacyGame(g:Runtime.Game):Legacy.Game {
 const out=map(g,{},{state:toLegacyState,history:each(toLegacyState),events:each(toLegacyEvent)});
 return out&&typeof out==='object'?{...out,version:out.version===2?1:out.version}:out;
}
export const toLegacyObjectiveState=(o:ReturnType<typeof import('../engine/campaign.ts').objectiveStates>[number])=>map(o,{hotspot:'location',hotspots:'places'}) as Old.Objective&{satisfied:boolean;witnesses:string[];places:string[]};
export function toLegacyPartners(h:ReturnType<typeof import('../engine/campaign.ts').partners>){return map(h,{},{message:toLegacyMessage,directions:each(x=>map(x,{hotspot:'location'})),settingHelp:each(x=>map(x,{hotspot:'location'}))}) as Omit<typeof h,'directions'|'settingHelp'>&{directions:{source:string;target:string;location?:string;text:string}[];settingHelp:{source:string;target:string;location:string;text:string}[]};}
export function toLegacyPlayerView(v:ReturnType<typeof import('../engine/campaign.ts').playerView>){
 return map(v,{chapter:'stage',location:'area',locations:'areas',hotspots:'locations'},{location:x=>map(x,reverse(locationNames)),things:each(x=>map(x,{hotspot:'location'})),hotspots:each(x=>map(x,reverse(hotspotNames)))}) as Omit<typeof v,'chapter'|'location'|'locations'|'hotspots'|'things'>&{stage:typeof v.chapter;area:Legacy.Area|undefined;areas:typeof v.locations;locations:(Omit<typeof v.hotspots[number],'location'>&{area:string})[];things:(Omit<typeof v.things[number],'hotspot'>&{location:string|null})[]};
}
