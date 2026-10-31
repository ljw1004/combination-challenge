/** Canonical location/hotspot/chapter runtime. Legacy callers use model.ts. */
import {fromLegacyGame,toLegacyGame} from '../compatibility/v1.ts';
import {validateLocationPlan} from '../schema/location-plan.ts';
import {groupedArrivalPlan} from './arrival-layout.ts';
import {firstSceneEntryPlan} from './scene-entry-layout.ts';
import {incorporations,transformedInput,validateRecipeLifecycle} from '../schema/lifecycle.ts';
import type {Action, Item, Objective, Recipe, Scenario, Chapter, ChapterEntryCue} from '../schema/campaign.ts';
export type Point={x:number;y:number};
export type Token=Point&{id:string;kind:string;location:string;hotspot:string|null;slots:Record<string,string>;incorporated:string[];components?:string[]};
export type HotspotPosition=Point&{id:string;location:string};
export type LocationState={id:string;label:string;enteredAtChapter:number};
export type Metrics={attempts:number;accepted:number;combinations:number;creations:number;installations:number;moves:number;placements:number;advances:number;visits:number};
/** A bounded chapter-entry snapshot, not a reconstruction from the event log.
 * IDs remain here after use so the challenge can explain an arrival later. */
export type Arrival={chapter:number;location:string;supplies:{item:string;cache:string;sourceChapter?:number;location?:string}[];carried:{item:string;from:string}[];here:string[]};
export type ArrivalLayout={chapter:number;location:string;dividerY:number;active:boolean};
export type State={chapter:number;currentLocation:string;locations:LocationState[];hotspots:HotspotPosition[];tokens:Token[];discovered:string[];recipesUsed:string[];openedCaches:string[];width:number;metrics:Metrics;completed:boolean;arrival?:Arrival;arrivalLayout?:ArrivalLayout;arrivalLayouts?:ArrivalLayout[];chapterEntry?:{chapter:number;alreadyComplete:boolean};skippedChapters?:string[];milestones?:MilestoneAchievement[];entryFacts?:{id:string;text:string}[];storyLocation?:string;enteredTravels?:string[];travelCue?:ChapterEntryCue};
export type MilestoneAchievement={id:string;components:string[]};
export type Event={seq:number;action:Action|{type:'undo'};accepted:boolean;message:string;chapter:number;recipe?:string;created?:string;installed?:boolean;retired?:string[];transfers?:{item:string;from:string;to:string}[];skippedChapters?:string[]};
/** lifecycleVersion 2 records event-local removals and immutable construction snapshots. */
export type Game={version:2;lifecycleVersion?:2;scenarioId:string;state:State;history:State[];events:Event[];milestonesSeen?:string[];bridgesSeen?:string[];entryCuesSeen?:string[]};
export type Result={accepted:boolean;game:Game;message:string;created?:string;updated?:string;recipe?:string;origin?:Point;retired?:string[]};
const clone=<T>(x:T):T=>structuredClone(x);
const ZERO:Metrics={attempts:0,accepted:0,combinations:0,creations:0,installations:0,moves:0,placements:0,advances:0,visits:0};
export const item=(s:Scenario,id:string)=>s.items.find(x=>x.id===id);
export const token=(s:State,id:string)=>s.tokens.find(x=>x.id===id);
const hotspot=(s:State,id:string)=>s.hotspots.find(x=>x.id===id);
const unique=(a:string[])=>new Set(a).size===a.length;
export function validateScenario(s:Scenario):string[]{
 const errors:string[]=[];const bad=(m:string)=>errors.push(m);
 if(!s||s.schemaVersion!==2||!s.id||!s.title||!s.premise)return ['Scenario header/schemaVersion missing'];
 for(const key of ['items','hotspots','initialItems','recipes','chapters'] as const)if(!Array.isArray(s[key]))return [`${key} must be array`];
 for(const key of ['items','hotspots','recipes','chapters'] as const)if(!unique(s[key].map(x=>x.id)))bad(`Duplicate ${key} id`);
 const kinds=new Set(s.items.map(x=>x.id)),locs=new Set(s.hotspots.map(x=>x.id));
 if([...kinds].some(x=>locs.has(x)))bad('Item and hotspot ids must be disjoint');
 const operand=(x:string)=>x?.startsWith('@')?locs.has(x.slice(1)):kinds.has(x);
 const pairKeys=new Set<string>();
 if(!s.chapters.length)bad('No chapters');if(!unique(s.initialItems))bad('Duplicate starting item');
 for(const id of s.initialItems)if(!kinds.has(id))bad(`Unknown initial item ${id}`);
 for(const x of s.items){if(!x.label)bad(`Missing item label ${x.id}`);if(x.labelAfterCreated!==undefined&&(!x.labelAfterCreated||!kinds.has(x.labelAfterCreated.item)||x.labelAfterCreated.item===x.id||typeof x.labelAfterCreated.label!=='string'||!x.labelAfterCreated.label.trim()||x.labelAfterCreated.label===x.label))bad(`Invalid conditional label ${x.id}`);if(x.reading!==undefined&&(!x.reading||typeof x.reading.text!=='string'||!x.reading.text.trim()||typeof x.reading.attribution!=='string'||!x.reading.attribution.trim()))bad(`Reading needs text and attribution ${x.id}`);if(x.slots){if(!unique(x.slots.map(y=>y.id)))bad(`Duplicate slot ${x.id}`);for(const slot of x.slots){if(!slot.accepts.length||slot.accepts.some(k=>!kinds.has(k)))bad(`Unknown/empty slot accepts ${x.id}.${slot.id}`);}}}
 const knownLabelLocations=new Set([...s.chapters.flatMap(ch=>[ch.location?.id,...(ch.travel?[ch.travel.locationId]:[])]),...(Array.isArray(s.locationPlan?.locations)?s.locationPlan.locations.map(location=>location.id):[])]);
 for(const def of s.items)if(def.labelByLocation!==undefined){const labels=def.labelByLocation;if(!labels||typeof labels!=='object'||Array.isArray(labels)||Object.entries(labels).some(([location,label])=>!location.trim()||!knownLabelLocations.has(location)||typeof label!=='string'||!label.trim()))bad(`Invalid location labels ${def.id}`);}
 for(const r of s.recipes){
  if(!operand(r.a)||!operand(r.b)||r.a===r.b||r.a.startsWith('@')&&r.b.startsWith('@'))bad(`Invalid operands ${r.id}`);
  if(!!r.out===!!r.install)bad(`Exactly one out/install required ${r.id}`);
  if(r.out&&!kinds.has(r.out))bad(`Unknown output ${r.id}`);
  if(r.out===r.a||r.out===r.b)bad(`Unchanged creation ${r.id}`);
  if(r.at&&!locs.has(r.at))bad(`Unknown catalyst ${r.id}`);
  const key=[r.a,r.b].sort().join('|')+'|'+(r.at??'');if(pairKeys.has(key))bad(`Ambiguous pair/setting ${r.id}`);pairKeys.add(key);
  if(r.install){const ins=r.install,def=item(s,ins.target)?.slots?.find(x=>x.id===ins.slot);if(![r.a,r.b].includes(ins.target)||![r.a,r.b].includes(ins.component)||!def?.accepts.includes(ins.component))bad(`Invalid installation ${r.id}`);}
  for(const req of r.requires??[])if(![r.a,r.b].includes(req.item)||!req.capability)bad(`Readiness must describe an operand ${r.id}`);
  for(const error of validateRecipeLifecycle(r))bad(error);
  for(const ret of incorporations(r))if(![r.a,r.b].includes(ret.item)||!ret.reason?.trim())bad(`Unjustified retirement ${r.id}`);
 }
 const objectives=new Set<string>(),cacheIds=new Set<string>(),revealed=new Set<string>();
 errors.push(...validateLocationPlan(s));
 for(const st of s.chapters){
  if(s.locationPlan)for(const location of [st.location.id,...(st.travel?[st.travel.locationId]:[])])for(const h of s.locationPlan.locations.find(l=>l.id===location)?.hotspots??[])revealed.add(h);
  if(!st.id||!st.title||!st.speaker||!st.motivation||!st.location?.id||!st.location.label||!st.location.travelText)bad(`Missing chapter narrative ${st.id}`);
  if(!Array.isArray(st.objectives)||!st.objectives.length)bad(`Empty objectives ${st.id}`);
  const policy=st.onAlreadyComplete;
  if(policy!==undefined&&(!policy||!['skip','bridge'].includes(policy.mode)||policy.mode==='bridge'&&(typeof policy.text!=='string'||!policy.text.trim())))bad(`Invalid already-complete policy ${st.id}`);
  for(const l of st.hotspots??[]){if(!locs.has(l))bad(`Unknown chapter hotspot ${l}`);if(revealed.has(l))bad(`Hotspot revealed twice ${l}; old hotspots cannot teleport`);revealed.add(l);}
  for(const c of st.caches??[]){if(!c.id||cacheIds.has(c.id))bad(`Duplicate/missing cache ${c.id}`);cacheIds.add(c.id);if(!c.label||!c.narrative||!c.items.length)bad(`Unmotivated/empty cache ${c.id}`);for(const k of c.items)if(!kinds.has(k))bad(`Unknown cache item ${k}`);}
  for(const k of st.carry??[])if(!kinds.has(k))bad(`Unknown carry item ${k}`);
  for(const hotspot of new Set((st.objectives??[]).filter(o=>o.kind==='place').map(o=>o.hotspot))){const goals=st.objectives.filter(o=>o.kind==='place'&&o.hotspot===hotspot);if(goals.length>1&&!s.items.some(it=>goals.every(o=>o.item?o.item===it.id:[...(it.capabilities??[]),...(it.slots??[]).flatMap(sl=>[...(sl.capabilities??[]),...Object.values(sl.grants??{}).flat()])].includes(o.capability!))))bad(`Objectives require an unreadable pile at ${hotspot}`);}
  for(const o of st.objectives??[]){if(objectives.has(o.id))bad(`Duplicate objective ${o.id}`);objectives.add(o.id);if(!o.text||!['create','place'].includes(o.kind)||!!o.item===!!o.capability)bad(`Invalid objective ${o.id}`);if(o.intermediate&&(o.kind!=='create'||!o.item))bad(`Intermediate objective must name a created item ${o.id}`);if(o.item&&!kinds.has(o.item))bad(`Unknown goal item ${o.id}`);if(o.kind==='place'&&(!o.hotspot||!locs.has(o.hotspot)))bad(`Invalid placement goal ${o.id}`);if(o.kind==='place'&&!revealed.has(o.hotspot!))bad(`Placement goal before hotspot reveal ${o.id}`);}
 }
 for(const st of s.chapters){
  const goals=new Map(st.objectives.map(o=>[o.id,o]));
  for(const o of st.objectives){
   if(o.intermediate!==undefined&&typeof o.intermediate!=='boolean')bad(`Invalid intermediate flag ${o.id}`);
   if(o.after!==undefined&&(!Array.isArray(o.after)||!unique(o.after)||o.after.some(id=>id===o.id||!goals.has(id))))bad(`Invalid goal reveal prerequisites ${o.id}`);
  }
  const complete=new Set<string>(),visiting=new Set<string>();
  const visit=(id:string)=>{if(visiting.has(id)){bad(`Cyclic goal reveal prerequisites ${st.id}`);return;}if(complete.has(id))return;visiting.add(id);for(const dep of goals.get(id)?.after??[])if(goals.has(dep))visit(dep);visiting.delete(id);complete.add(id);};
  for(const id of goals.keys())visit(id);
 }
 if(s.milestones!==undefined){
  if(!Array.isArray(s.milestones))bad('Milestones must be an array');
  else {
   if(!unique(s.milestones.map(m=>m.id)))bad('Duplicate milestone id');
   for(const m of s.milestones){
    const def=item(s,m.item),caps=def?[...(def.capabilities??[]),...(def.slots??[]).flatMap(sl=>[...(sl.capabilities??[]),...Object.values(sl.grants??{}).flat()])]:[];
    if(!m.id||!def||!m.title?.trim()||!m.text?.trim()||!['created','functional'].includes(m.when))bad(`Invalid milestone ${m.id}`);
    if(m.when==='functional'&&(!m.capability||!caps.includes(m.capability)))bad(`Milestone needs an actual functional capability ${m.id}`);
    if(m.when==='created'&&(m.capability!==undefined||!s.recipes.some(r=>r.out===m.item)))bad(`Creation milestone needs a recipe output ${m.id}`);
    if(m.presentation!==undefined&&!['explanation','celebration'].includes(m.presentation))bad(`Invalid milestone presentation ${m.id}`);
    if(m.eyebrow!==undefined&&(typeof m.eyebrow!=='string'||!m.eyebrow.trim()))bad(`Invalid milestone eyebrow ${m.id}`);
    if(m.artwork&&(!/^assets\/discoveries\/[a-zA-Z0-9._-]+\.(png|webp|jpg)$/.test(m.artwork.src)||!m.artwork.alt?.trim()||![m.artwork.width,m.artwork.height].every(n=>Number.isInteger(n)&&n>0&&n<=8192)))bad(`Invalid milestone artwork ${m.id}`);
   }
  }
 }
 for(const c of s.checkpoints??[])if(!c.id||!Array.isArray(c.actions))bad('Invalid checkpoint');
 return errors;
}
function assertScenario(s:Scenario){const errors=validateScenario(s);if(errors.length)throw Error(errors.join('\n'));}
export function functional(s:Scenario,t:Token){return (item(s,t.kind)?.slots??[]).filter(x=>x.required).every(x=>!!t.slots[x.id]);}
export function capabilities(s:Scenario,t:Token):string[]{
 if(!functional(s,t))return [];
 const def=item(s,t.kind)!;
 return [...new Set([...(def.capabilities??[]),...(def.slots??[]).filter(x=>!!t.slots[x.id]).flatMap(x=>[...(x.capabilities??[]),...(x.grants?.[t.slots[x.id]]??[])])])];
}
export function matches(s:Scenario,t:Token,o:Objective){return o.item?t.kind===o.item:capabilities(s,t).includes(o.capability!);}
export function objectiveStates(s:Scenario,state:State){return s.chapters[state.chapter].objectives.map(o=>{const witnesses=state.tokens.filter(t=>matches(s,t,o)&&(o.kind==='create'||t.hotspot===o.hotspot));return {...o,satisfied:o.intermediate?state.discovered.includes(o.item!):witnesses.length>0,witnesses:witnesses.map(x=>x.id),hotspots:o.kind==='place'&&witnesses.length?[o.hotspot!]:[]};});}
/** The current step replaces an achieved intermediate; later steps reveal only when their prerequisites are achieved. */
export function visibleObjectives(s:Scenario,state:State){
 const all=objectiveStates(s,state);
 return all.filter(o=>(!o.intermediate||!o.satisfied)&&(o.after??[]).every(id=>all.find(prior=>prior.id===id)?.satisfied));
}
export function gold(s:Scenario,state:State){if(state.completed&&state.skippedChapters?.includes(s.chapters[state.chapter].id))return {items:[] as string[],hotspots:[] as string[]};const final=visibleObjectives(s,state).filter(o=>!o.intermediate);return {items:[...new Set(final.flatMap(o=>o.witnesses))],hotspots:[...new Set(final.flatMap(o=>o.hotspots))]};}
export const chapterComplete=(s:Scenario,state:State)=>objectiveStates(s,state).every(o=>o.satisfied);
type LabelState=Pick<State,'discovered'>&Partial<Pick<State,'tokens'>>;
export const componentLabels=(s:Scenario,t:Token,state?:LabelState)=>(t.components??[]).filter(k=>!Object.values(t.slots).includes(k)).map(k=>state?itemDisplayLabel(s,state,k,t.location):item(s,k)!.label);
function preserveConstruction(r:Recipe,owner:Token,input:Token){if(!r.preserve?.includes(input.kind))return;owner.components=[...new Set([...(owner.components??[]),...(r.lifecycle?.[input.kind]?.role==='incorporate'?[input.kind]:[]),...Object.values(input.slots),...(input.components??[])])];}
/** Presentation only: an earned creation can change a label without changing identity or save data. */
export function itemDisplayLabel(s:Scenario,state:LabelState,kind:string,ownerLocation?:string):string{
 const def=item(s,kind);if(!def)return kind;
 const location=ownerLocation??state.tokens?.find(t=>t.kind===kind)?.location;
 if(location&&def.labelByLocation&&Object.hasOwn(def.labelByLocation,location))return def.labelByLocation[location];
 return def.labelAfterCreated&&state.discovered.includes(def.labelAfterCreated.item)?def.labelAfterCreated.label:def.label;
}
/** Conservative 12px Arial advances keep browser and packing layouts aligned. */
export function itemLabelLines(label:string):string[]{
 const advance=(c:string)=>/\s/u.test(c)?3.5:/[ilI.,'!:;|]/u.test(c)?3.5:/[mwMW@%]/u.test(c)?11.5:/[frt()[\]{}]/u.test(c)?5:/[A-Z]/u.test(c)?9.5:/[a-z0-9-]/u.test(c)?7:(c.codePointAt(0)??0)>0xffff?16:14;
 const measure=(text:string)=>Array.from(text).reduce((n,c)=>n+advance(c),0);
 const lines:string[]=[];let line='';
 for(const word of label.trim().split(/\s+/u)){
  if(line&&measure(line+' '+word)<=84){line+=' '+word;continue;}
  if(line){lines.push(line);line='';}
  for(const c of Array.from(word)){if(line&&measure(line+c)>84){lines.push(line);line='';}line+=c;}
 }
 if(line)lines.push(line);return lines.length?lines:[''];
}
/** Ordinary two-line names keep their existing styling. Longer observations,
 * arguments and sources share the same explicit text layout, not fake readings. */
export function itemLabelLayout(def:Item):string[]|null{const lines=itemLabelLines(def.label);return def.reading||lines.length>2?lines:null;}
export const tokenHeight=(s:Scenario,t:Token)=>{const def=item(s,t.kind),labels=def?[def, ...(def.labelAfterCreated?[{...def,label:def.labelAfterCreated.label}]:[]),...Object.values(def.labelByLocation??{}).map(label=>({...def,label}))]:[],lines=labels.map(itemLabelLayout).sort((a,b)=>(b?.length??0)-(a?.length??0))[0]??null;return Math.max(44,(lines?10+(def?.reading&&!s.locationPlan?12:0)+lines.length*14:38)+((def?.slots??[]).filter(x=>x.required||t.slots[x.id]).length+componentLabels(s,t).length)*21);};
/** Reserve the shape of an actual authored upgrade when placing an arriving
 * construction, so fitting its known compartments need not move its anchor. */
export function placementHeight(s:Scenario,t:Token):number{
 if(!s.locationPlan)return tokenHeight(s,t);
 const seen=new Set<string>();
 const components=(kind:string,trail=new Set<string>()):string[]=>{
  if(trail.has(kind))return [];const next=new Set(trail);next.add(kind);
  const def=item(s,kind),slotInputs=(def?.slots??[]).flatMap(sl=>sl.accepts),result=[...slotInputs,...slotInputs.flatMap(input=>components(input,next))];
  for(const r of s.recipes.filter(r=>r.out===kind))for(const input of r.preserve??[]){if(r.lifecycle?.[input]?.role==='incorporate')result.push(input);result.push(...components(input,next));}
  return [...new Set(result)];
 };
 const visit=(current:Token):number=>{if(seen.has(current.kind))return tokenHeight(s,current);seen.add(current.kind);const def=item(s,current.kind),filled={...current,slots:{...current.slots,...Object.fromEntries((def?.slots??[]).filter(sl=>sl.accepts.length).map(sl=>[sl.id,sl.accepts[0]]))},components:[...new Set([...(current.components??[]),...components(current.kind)])]};let height=tokenHeight(s,filled);for(const r of s.recipes)if(r.out&&transformedInput(r)===current.kind){const preserved=(r.preserve??[]).flatMap(input=>[...(r.lifecycle?.[input]?.role==='incorporate'?[input]:[]),...(input===current.kind?[...Object.values(current.slots),...(current.components??[])]:components(input))]);const next={...current,id:r.out,kind:r.out,slots:{},components:[...new Set(preserved)]};height=Math.max(height,visit(next));}return height;};
 return visit(t);
}

const size=(s:Scenario,t:Token)=>({w:96,h:tokenHeight(s,t)});
function occupied(s:Scenario,state:State,location:string){return [...state.tokens.filter(t=>t.location===location).map(t=>({...t,...size(s,t)})),...state.hotspots.filter(p=>p.location===location).map(p=>({...p,w:106,h:82}))];}
function overlap(a:Point,w:number,h:number,b:Point&{w:number;h:number}){return Math.max(0,(w+b.w)/2-Math.abs(a.x-b.x))*Math.max(0,(h+b.h)/2-Math.abs(a.y-b.y));}
function adjacent(s:Scenario,state:State,near:Point,location:string,out:Token,targetSize:{w:number;h:number},segment?:'old'|'new'):Point{
 const {w,h}=size(s,out),dx=(w+targetSize.w)/2+2,dy=(h+targetSize.h)/2+2;
 const candidates=[[dx,dy],[-dx,dy],[dx,-dy],[-dx,-dy],[0,dy],[dx,0],[-dx,0],[0,-dy]].map(([x,y])=>({x:Math.max(w/2+4,Math.min(state.width-w/2-4,near.x+x)),y:Math.max(h/2+30,near.y+y)}));
 const divider=arrivalDivisions(state).find(d=>d.location===location),used=occupied(s,state,location);
 if(divider?.active&&divider.location===location&&segment){
  const fits=(p:Point)=>segment==='old'?p.y+h/2<=divider.dividerY-20:p.y-h/2>=divider.dividerY+26;
  // The lower segment can move down intact when an upper creation grows.
  // It must not make a crowded upper birth choose an overlapping old tile.
  const fixed=segment==='old'?used.filter(t=>t.y<divider.dividerY):used;
  const cost=(p:Point)=>fixed.reduce((sum,b)=>sum+overlap(p,w,h,b),0);
  const nearest=(points:Point[])=>points.sort((a,b)=>cost(a)-cost(b)||Math.hypot(a.x-near.x,a.y-near.y)-Math.hypot(b.x-near.x,b.y-near.y))[0];
  const inside=candidates.filter(p=>fits(p)&&cost(p)===0);if(inside.length)return nearest(inside);
  const free=candidates.filter(p=>cost(p)===0&&(segment==='old'||fits(p)));if(free.length)return nearest(free);
  // There is always more scrollable board below: do not introduce an overlap
  // merely to keep a creation in a fixed-size partition.
  return {x:Math.max(w/2+4,Math.min(state.width-w/2-4,near.x)),y:Math.max(...fixed.map(t=>t.y+t.h/2),segment==='new'?divider.dividerY+26:30)+h/2+2};
 }
 return candidates.map((p,i)=>({p,i,cost:used.reduce((a,b)=>a+overlap(p,w,h,b),0)})).sort((a,b)=>a.cost-b.cost||a.i-b.i)[0].p;
}
const panelHeight=(s:Scenario)=>s.locationPlan?.panel.height;
function availableBottom(s:Scenario,state:State,location:string):number|undefined{
 const height=panelHeight(s);if(height===undefined)return undefined;const pending=s.chapters.filter(ch=>ch.location.id===location&&ch.sourceUpdate&&!state.openedCaches.includes(ch.sourceUpdate.id)).flatMap(ch=>ch.sourceUpdate!.items);if(!pending.length)return height;const cols=Math.max(1,Math.floor((state.width-8)/100)),heights=pending.map(kind=>placementHeight(s,{id:kind,kind,location,hotspot:null,slots:{},incorporated:[],x:0,y:0})).sort((a,b)=>b-a);let room=58;for(let i=0;i<heights.length;i+=cols)room+=Math.max(...heights.slice(i,i+cols))+10;return height-room;
}
function panelPoint(s:Scenario,state:State,p:Point,h:number,w=96,reserve=false,location=state.currentLocation):Point{
 const bottom=reserve?availableBottom(s,state,location):panelHeight(s);return {x:Math.max(w/2+4,Math.min(state.width-w/2-4,p.x)),y:Math.max(30+h/2,Math.min(bottom===undefined?Infinity:bottom-12-h/2,p.y))};
}
/** Finite-panel births may overlap minimally, never enlarge the location. */
function boundedBirth(s:Scenario,state:State,t:Token,near:Point,ignore:string[]=[]):Point{
 if(!s.locationPlan)return near;
 const w=96,h=placementHeight(s,t);if(h>s.locationPlan.panel.height-42)throw Error('This object is taller than its location.');
 const used=occupied(s,state,t.location).filter(b=>!ignore.includes(b.id)&&b.id!==t.id);
 const bottom=availableBottom(s,state,t.location)!;const candidates:Point[]=[panelPoint(s,state,near,h,96,true,t.location)];
 for(let y=30+h/2;y<=bottom-12-h/2;y+=18)for(let x=52;x<=state.width-52;x+=Math.max(24,(state.width-104)/4))candidates.push({x,y});
 const cover=(p:Point,b:Point&{w:number;h:number})=>overlap(p,w,h,b)>=Math.min(w*h,b.w*b.h)-.1;
 const preferred=candidates[0];if(!used.some(b=>cover(preferred,b)))return preferred;
 return candidates.map((p,i)=>({p,i,cover:used.filter(b=>cover(p,b)).length,cost:used.reduce((a,b)=>a+overlap(p,w,h,b)/(w*h)*40,0)+Math.hypot(p.x-near.x,p.y-near.y)})).sort((a,b)=>a.cover-b.cover||a.cost-b.cost||a.i-b.i)[0].p;
}
/** Diagnostic, not a claim of phone usability or a licence to cull things. */
export function locationFootprint(s:Scenario,state:State,location:string){
 const boxes=[...state.hotspots.filter(p=>p.location===location).map(p=>({...p,w:106,h:82})),...state.tokens.filter(t=>t.location===location).map(t=>({...t,w:96,h:tokenHeight(s,t)}))],height=panelHeight(s)??Math.max(0,...boxes.map(b=>b.y+b.h/2));
 return {location,width:state.width,height,count:boxes.length,bottom:Math.max(0,...boxes.map(b=>b.y+b.h/2)),outOfBounds:boxes.filter(b=>b.x-b.w/2<0||b.x+b.w/2>state.width||b.y-b.h/2<0||b.y+b.h/2>height).map(b=>b.id),overlapPairs:boxes.flatMap((b,i)=>boxes.slice(i+1).filter(c=>overlap(b,b.w,b.h,c)>0).map(c=>[b.id,c.id])),fullyCovered:boxes.filter((b,i)=>boxes.slice(i+1).some(c=>Math.abs(b.x-c.x)+b.w/2<=c.w/2&&Math.abs(b.y-c.y)+b.h/2<=c.h/2)).map(b=>b.id)};
}
function supplyPosition(s:Scenario,state:State,location:string,height=44):Point{
 const cols=Math.max(1,Math.floor((state.width-8)/100));const used=occupied(s,state,location),bottom=availableBottom(s,state,location);
 for(let row=0;row<1000;row++)for(let col=0;col<cols;col++){const p={x:52+col*100,y:34+height/2+row*(s.locationPlan?4:50)};if(bottom!==undefined&&p.y+height/2>bottom-12)break;if(used.every(o=>overlap(p,96,height,o)===0))return p;}
 if(s.locationPlan){const fake:Token={id:'__layout__',kind:s.items.find(i=>!i.slots&&!i.reading)?.id??s.items[0].id,location,hotspot:null,slots:{},incorporated:[],x:52,y:34+height/2};const candidates:Point[]=[];for(let y=34+height/2;y<=bottom!-12-height/2;y+=18)for(let x=52;x<=state.width-52;x+=Math.max(24,(state.width-104)/4))candidates.push({x,y});return candidates.sort((a,b)=>used.reduce((n,o)=>n+overlap(a,96,height,o)-overlap(b,96,height,o),0))[0]??panelPoint(s,state,fake,height,96,true,location);}
 throw Error('Supply layout exhausted');
}
type ArrivalBox=Point&{w:number;h:number};
/** Smallest deterministic translation clearing fixed obstacles; no board-wide reflow. */
function arrivalTranslation(group:ArrivalBox[],used:ArrivalBox[],width:number,compact=false):Point{
 const left=52-Math.min(...group.map(t=>t.x)),right=width-52-Math.max(...group.map(t=>t.x));
 const xs=new Set([Math.max(left,Math.min(right,0)),left,right]);
 for(const t of group)for(const o of used)for(const sign of [-1,1]){const x=o.x+sign*((t.w+o.w)/2+2)-t.x;if(x>=left&&x<=right)xs.add(x);}
 let best:Point|undefined,bestCost=Infinity;
 for(const x of [...xs].sort((a,b)=>Math.abs(a)-Math.abs(b)||a-b)){
  const intervals=group.flatMap(t=>used.filter(o=>Math.abs(t.x+x-o.x)<(t.w+o.w)/2+2).map(o=>({lo:o.y-(t.h+o.h)/2-2-t.y,hi:o.y+(t.h+o.h)/2+2-t.y}))).sort((a,b)=>a.lo-b.lo||a.hi-b.hi);
  let y=0;for(const r of intervals)if(r.lo<y&&r.hi>y)y=r.hi;
  const bottom=Math.max(...group.map(t=>t.y+t.h/2+y),...used.map(t=>t.y+t.h/2),0);const cost=(compact?bottom*bottom*1000000:0)+x*x+y*y;if(cost<bestCost){best={x,y};bestCost=cost;}
 }
 return best!;
}
function hotspotPlacementHeight(s:Scenario,id:string):number{
 if(!s.locationPlan)return 82;return Math.max(82,...s.recipes.filter(r=>r.out&&[r.a,r.b].includes('@'+id)).map(r=>placementHeight(s,{id:r.out!,kind:r.out!,location:'',hotspot:null,slots:{},incorporated:[],x:0,y:0})+32));
}
/** Actual travel may close empty gaps inside an arriving source group; x/order,
 * overlapping bands and every still-resident object's position stay intact. */
function closeArrivalGaps(boxes:ArrivalBox[],budget:number){
 const bands:{lo:number;hi:number}[]=[];for(const b of [...boxes].sort((a,b)=>a.y-a.h/2-(b.y-b.h/2))){const lo=b.y-b.h/2,hi=b.y+b.h/2,last=bands.at(-1);if(last&&lo<=last.hi)last.hi=Math.max(last.hi,hi);else bands.push({lo,hi});}
 const gaps=bands.map((b,i)=>({end:b.lo,space:Math.max(0,b.lo-(i?bands[i-1].hi+4:34))})),available=gaps.reduce((n,g)=>n+g.space,0),need=Math.max(0,(bands.at(-1)?.hi??0)-budget),ratio=available?Math.min(1,need/available):0;
 for(const b of boxes)b.y-=gaps.filter(g=>g.end<=b.y-b.h/2+.001).reduce((n,g)=>n+g.space*ratio,0);
}
function freshStockHeight(s:Scenario,state:State,location:string){
 const ids=locationDefinition(s,location)?.stockBatches.filter(b=>!state.openedCaches.includes(b.id)).flatMap(b=>b.items.filter(id=>!state.discovered.includes(id)))??[],cols=Math.max(1,Math.floor((state.width-8)/100)),heights=ids.map(kind=>placementHeight(s,{id:kind,kind,location,hotspot:null,slots:{},incorporated:[],x:0,y:0})).sort((a,b)=>b-a);let height=0;for(let i=0;i<heights.length;i+=cols)height+=Math.max(...heights.slice(i,i+cols))+10;return height;
}
/** Rigid-cluster free-space fallback for travel into an already occupied place.
 * Keep every pre-existing overlap cluster intact; only translate clusters. No
 * resident moves, no new overlap, no card shrinking or invisible overflow. */
function packArrivingClusters(s:Scenario,state:State,location:string,original:Token[],carried:Token[]):boolean{
 const boxes=original.map(t=>({...t,...size(s,t)})),parent=boxes.map((_,i)=>i),root=(i:number):number=>parent[i]===i?i:parent[i]=root(parent[i]);
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)if(boxes[i].location===boxes[j].location&&overlap(boxes[i],boxes[i].w,boxes[i].h,boxes[j])>0)parent[root(j)]=root(i);
 const groups=[...new Set(boxes.map((_,i)=>root(i)))].map(id=>boxes.filter((_,i)=>root(i)===id)).sort((a,b)=>Math.max(...b.map(t=>t.h))-Math.max(...a.map(t=>t.h))||b.length-a.length);
 const ids=new Set(carried.map(t=>t.id)),fixed:ArrivalBox[]=occupied(s,state,location).filter(b=>!ids.has(b.id)),positions=new Map<string,Point>();let attempts=0;
 function place(index:number,used:ArrivalBox[]):boolean{
  if(index===groups.length)return true;if(++attempts>12000)return false;const group=groups[index];
  const left=4-Math.min(...group.map(b=>b.x-b.w/2)),right=state.width-4-Math.max(...group.map(b=>b.x+b.w/2));
  const top=Math.max(...group.map(b=>placementHeight(s,b)/2-b.y)),bottom=Math.min(...group.map(b=>s.locationPlan!.panel.height-placementHeight(s,b)/2-b.y));if(left>right||top>bottom)return false;
  const xs=new Set<number>([Math.max(left,Math.min(right,0)),left,right]),ys=new Set<number>([top]);
  for(const b of group)for(const o of used){for(const sign of [-1,1]){const x=o.x+sign*((b.w+o.w)/2+2)-b.x;if(x>=left&&x<=right)xs.add(x);const y=o.y+sign*((b.h+o.h)/2+2)-b.y;if(y>=top&&y<=bottom)ys.add(y);}}
  const candidates=[...xs].flatMap(x=>[...ys].map(y=>({x,y}))).filter(d=>group.every(b=>used.every(o=>overlap({x:b.x+d.x,y:b.y+d.y},b.w,b.h,o)===0))).sort((a,b)=>(a.x*a.x+(a.y-top)*(a.y-top))-(b.x*b.x+(b.y-top)*(b.y-top)));
  for(const d of candidates){const placed=group.map(b=>({...b,x:b.x+d.x,y:b.y+d.y}));for(const b of placed)positions.set(b.id,{x:b.x,y:b.y});if(place(index+1,[...used,...placed]))return true;for(const b of placed)positions.delete(b.id);}
  return false;
 }
 if(!place(0,fixed))return false;for(const t of carried)Object.assign(t,positions.get(t.id),{location,hotspot:null});return true;
}
/** Only arrivals move: preserve source groups unless their rigid placement would waste a row. */
function arrive(s:Scenario,state:State,location:string,carried:Token[],preserveGroup=false){
 const original=carried.map(t=>structuredClone(t));const residentIds=new Set(state.tokens.filter(t=>t.location===location&&!carried.includes(t)).map(t=>t.id));
 const used:ArrivalBox[]=occupied(s,state,location),groups=[...new Set(carried.map(t=>t.location))].map(from=>carried.filter(t=>t.location===from));
 for(const group of groups){
  const arrivalSize=(t:Token)=>({w:96,h:s.locationPlan?placementHeight(s,t):tokenHeight(s,t)});const minTop=Math.min(...group.map(t=>t.y-arrivalSize(t).h/2)),boxes:ArrivalBox[]=group.map(t=>({...t,y:34+t.y-minTop,...arrivalSize(t)}));
  // An old birth or player pile may already coincide inside a source group.
  // Repair only complete hiding; ordinary partial birth overlaps stay intact.
  for(let i=0;i<boxes.length;i++){
   const b=boxes[i],others=boxes.slice(0,i);
   if(others.some(o=>Math.abs(b.x-o.x)<.001&&Math.abs(b.y-o.y)<=Math.abs(b.h-o.h)/2)){
    const d=arrivalTranslation([b],others,state.width);b.x+=d.x;b.y+=d.y;
   }
  }
  if(s.locationPlan)closeArrivalGaps(boxes,Math.max(100,s.locationPlan.panel.height-58-freshStockHeight(s,state,location)));
  const delta=arrivalTranslation(boxes,used,state.width,!!s.locationPlan),bottom=(a:ArrivalBox[])=>Math.max(0,...a.map(t=>t.y+t.h/2));
  const oldBottom=bottom(used),baseBottom=bottom(boxes),rigidBottom=Math.max(oldBottom,baseBottom+delta.y);
  // Compare with compact local placement only when a whole-group shift costs >one row.
  // Unaffected siblings keep their preferred relative positions whenever possible.
  if(!preserveGroup&&rigidBottom>Math.max(oldBottom,baseBottom)+50){
   const local:ArrivalBox[]=[],fixed=[...used];
   for(const b of boxes){const d=arrivalTranslation([b],fixed,state.width),placed={...b,x:b.x+d.x,y:b.y+d.y};local.push(placed);fixed.push(placed);}
   if(bottom(local)<baseBottom+delta.y-2){boxes.splice(0,boxes.length,...local);delta.x=delta.y=0;}
  }
  for(let i=0;i<group.length;i++){const t=group[i],b=boxes[i];t.location=location;t.hotspot=null;t.x=b.x+delta.x;t.y=b.y+delta.y;if(s.locationPlan&&(t.x<52||t.x>state.width-52||t.y-tokenHeight(s,t)/2<30||t.y+tokenHeight(s,t)/2>s.locationPlan.panel.height-12))Object.assign(t,boundedBirth(s,state,t,t,carried.filter(c=>c!==t).map(c=>c.id)));used.push({...t,...size(s,t)});}
 }
 if(s.locationPlan){
  const prior=new Map(original.map(t=>[t.id,t])),moving=new Set(carried.map(t=>t.id));
  const increased=carried.some(t=>state.tokens.some(b=>b.id!==t.id&&b.location===location&&(moving.has(b.id)||residentIds.has(b.id))&&overlap(t,96,tokenHeight(s,t),{...b,...size(s,b)})>(prior.has(b.id)&&prior.get(b.id)!.location===prior.get(t.id)!.location?overlap(prior.get(t.id)!,96,tokenHeight(s,t),{...prior.get(b.id)!,...size(s,b)}):0)+.001));
  if(increased&&!packArrivingClusters(s,state,location,original,carried))throw Error('This location needs room for the arriving objects. Move a few things to an earlier location.');
 }
}
function addItem(s:Scenario,state:State,kind:string,location:string){if(state.discovered.includes(kind))return false;const t:Token={id:kind,kind,location,hotspot:null,slots:{},incorporated:[],x:0,y:0};Object.assign(t,supplyPosition(s,state,location,placementHeight(s,t)));state.tokens.push(t);state.discovered.push(kind);return true;}
/** A safeguard at the current recipe event, never a pending retirement schedule. */
function needed(s:Scenario,state:State,t:Token,excluding?:string):boolean{
 if(s.recipes.some(r=>r.id!==excluding&&!state.recipesUsed.includes(r.id)&&(!r.out||!state.discovered.includes(r.out))&&[r.a,r.b].includes(t.kind)))return true;
 return s.chapters.slice(state.chapter).some(st=>st.objectives.some(o=>!(o.intermediate&&state.discovered.includes(o.item!))&&matches(s,t,o)&&!state.tokens.some(x=>x.id!==t.id&&matches(s,x,o)&&(o.kind==='create'||x.hotspot===o.hotspot))));
}
/** Chapter-local packing intent. Includes alternative prerequisite routes, never future goals. */
export function sceneCarry(s:Scenario,state:State,st:Chapter):string[]{
 if(st.carry)return [...new Set(st.carry)];
 const want=new Set<string>();
 const need=(kind:string,forceConstruction=false)=>{if(want.has(kind))return;want.add(kind);const def=item(s,kind),existing=token(state,kind);
  if(existing){if(forceConstruction||!functional(s,existing))for(const slot of def?.slots??[])if(slot.required&&!existing.slots[slot.id])for(const k of slot.accepts)need(k);return;}
  for(const r of s.recipes.filter(r=>r.out===kind)){for(const k of [r.a,r.b])if(!k.startsWith('@'))need(k);for(const q of r.requires??[])needCapability(q.capability,q.item);}
  for(const slot of def?.slots??[])if(slot.required)for(const k of slot.accepts)need(k);
 };
 const needCapability=(cap:string,only?:string)=>{for(const def of s.items.filter(it=>!only||it.id===only)){const slots=(def.slots??[]).filter(sl=>(sl.capabilities??[]).includes(cap)||Object.values(sl.grants??{}).some(c=>c.includes(cap)));if(!(def.capabilities??[]).includes(cap)&&!slots.length)continue;need(def.id,true);const existing=token(state,def.id);for(const slot of slots)if(!existing?.slots[slot.id]||!capabilities(s,existing).includes(cap)){const accepted=Object.entries(slot.grants??{}).filter(([,caps])=>caps.includes(cap)).map(([k])=>k);for(const k of accepted.length?accepted:slot.accepts)need(k);}}};
 for(const o of st.objectives.filter(o=>!o.intermediate||!state.discovered.includes(o.item!)))if(o.item)need(o.item);else needCapability(o.capability!);
 return [...want];
}
/** Fixed place panels are authored independently of content height. */
export const locationPanelHeight=(s:Scenario)=>s.locationPlan?.panel.height??null;
export const locationDefinition=(s:Scenario,id:string)=>s.locationPlan?.locations.find(l=>l.id===id);
const stockBatches=(s:Scenario,chapter:number)=>s.locationPlan?[...(s.locationPlan.locations.flatMap(l=>l.stockBatches)),...s.chapters.slice(0,chapter+1).flatMap(ch=>ch.sourceUpdate?[ch.sourceUpdate]:[])]:s.chapters.slice(0,chapter+1).flatMap(ch=>ch.caches??[]);
/** Whole imminent visit closure includes alternatives, never later visits. */
export function visitCarry(s:Scenario,state:State,visitId:string):string[]{
 const visit=s.locationPlan?.visits.find(v=>v.id===visitId);if(!visit)return [];
 const work=visit.carry??visit.chapterIds.flatMap(id=>sceneCarry(s,state,{...s.chapters.find(ch=>ch.id===id)!,carry:undefined}));
 return [...new Set([...work,...(visit.carryAlong??[])])];
}
/** Minimum vertical height with x and existing overlap clusters held fixed.
 * Difference constraints preserve every pair's column order and never introduce
 * a new overlap. This removes per-column whitespace that global bands miss. */
function compactArrivalClusters(boxes:(ArrivalBox&{id:string})[]):Map<string,Point>{
 const parent=boxes.map((_,i)=>i),root=(i:number):number=>parent[i]===i?i:parent[i]=root(parent[i]);
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)if(overlap(boxes[i],boxes[i].w,boxes[i].h,boxes[j])>0)parent[root(j)]=root(i);
 const groups=[...new Set(boxes.map((_,i)=>root(i)))],index=boxes.map((_,i)=>groups.indexOf(root(i))),dy=groups.map((_,g)=>34-Math.min(...boxes.filter((_,i)=>index[i]===g).map(b=>b.y-b.h/2)));
 const constraints:{a:number;b:number;gap:number}[]=[];
 for(let i=0;i<boxes.length;i++)for(let j=0;j<boxes.length;j++)if(index[i]!==index[j]){const a=boxes[i],b=boxes[j],empty=b.y-b.h/2-(a.y+a.h/2);if(Math.abs(a.x-b.x)<(a.w+b.w)/2&&empty>=0)constraints.push({a:index[i],b:index[j],gap:-empty+Math.min(4,empty)});}
 for(let pass=0;pass<groups.length;pass++){let changed=false;for(const c of constraints)if(dy[c.b]<dy[c.a]+c.gap){dy[c.b]=dy[c.a]+c.gap;changed=true;}if(!changed)break;}
 return new Map(boxes.map((b,i)=>[b.id,{x:b.x,y:b.y+dy[index[i]]}]));
}
/** Separate real new stock without ever translating settled residents. */
function separateLocationArrival(s:Scenario,state:State,arrival:Arrival,firstArrival:boolean){
 const location=arrival.location,fresh=new Set(arrival.supplies.map(x=>x.item));
 const old=state.tokens.filter(t=>t.location===location&&!fresh.has(t.id)),supplies=state.tokens.filter(t=>t.location===location&&fresh.has(t.id)),hotspots=state.hotspots.filter(h=>h.location===location);
 if(!old.length||!supplies.length)return;
 if(firstArrival){
  const oldBoxes=[...old.map(t=>({...t,...size(s,t)})),...hotspots.map(h=>({...h,id:'@'+h.id,w:106,h:82}))];
  const plan=groupedArrivalPlan(oldBoxes,supplies.map(t=>({...t,...size(s,t)})).sort((a,b)=>b.h-a.h||placementHeight(s,b)-placementHeight(s,a)),state.width,s.locationPlan!.panel.height-12,{gap:4,dividerGap:28})!;
  // Prefer the original group arrangement. On genuine first arrival only,
  // remove per-column empty gaps between rigid clusters if it cannot fit.
  const prior=oldBoxes.map(b=>({...b,...plan.positions.get(b.id)!}));
  for(const compact of [false,true]){
   const positions=new Map([...plan.positions].map(([id,p])=>[id,{...p}])),edge=(p:Point,h:number)=>({...p,y:Math.max(h/2,Math.min(s.locationPlan!.panel.height-h/2,p.y))});
   if(compact)for(const [id,p]of compactArrivalClusters(prior))positions.set(id,p);
   for(const t of old)positions.set(t.id,edge(positions.get(t.id)!,placementHeight(s,t)));
   for(const h of hotspots)positions.set('@'+h.id,edge(positions.get('@'+h.id)!,hotspotPlacementHeight(s,h.id)));
   if(compact){const boxes=oldBoxes.map(b=>({...b,...positions.get(b.id)!}));if(boxes.some((b,i)=>boxes.slice(i+1).some((c,j)=>overlap(b,b.w,b.h,c)>overlap(prior[i],prior[i].w,prior[i].h,prior[i+j+1])+.001)))continue;}
   const floor=Math.max(30,...old.map(t=>positions.get(t.id)!.y+tokenHeight(s,t)/2),...hotspots.map(h=>positions.get('@'+h.id)!.y+41)),shift=floor+28-Math.min(...supplies.map(t=>positions.get(t.id)!.y-tokenHeight(s,t)/2));
   for(const t of supplies){const preferred={...positions.get(t.id)!,y:positions.get(t.id)!.y+shift},bounded=edge(preferred,placementHeight(s,t));positions.set(t.id,{x:bounded.x,y:Math.max(floor+28+tokenHeight(s,t)/2,bounded.y)});}
   const freshBoxes=supplies.map(t=>({...t,...size(s,t),...positions.get(t.id)!}));
   if(supplies.every(t=>positions.get(t.id)!.y+tokenHeight(s,t)/2<=s.locationPlan!.panel.height)&&!freshBoxes.some((b,i)=>freshBoxes.slice(i+1).some(c=>overlap(b,b.w,b.h,c)>0))){
    for(const t of [...old,...supplies])Object.assign(t,positions.get(t.id));for(const h of hotspots)Object.assign(h,positions.get('@'+h.id));state.arrivalLayout={chapter:state.chapter,location,dividerY:floor+14,active:true};return;
   }
  }
 }
 const floor=Math.max(30,...old.map(t=>t.y+tokenHeight(s,t)/2),...hotspots.map(h=>h.y+41));
 const arranged:Point[]=[];const fixed:ArrivalBox[]=[...old.map(t=>({...t,...size(s,t)})),...hotspots.map(h=>({...h,w:106,h:82}))];
 for(const t of supplies){const {w,h}=size(s,t);let found:Point|undefined;for(let y=floor+36+h/2;y<=s.locationPlan!.panel.height-12-h/2&&!found;y+=18)for(let x=52;x<=state.width-52;x+=100){const p={x,y};if(fixed.every(b=>overlap(p,w,h,b)===0)){found=p;break;}}if(!found)throw Error('This location needs room for the new supplies. Move a few things to an earlier location.');arranged.push(found);fixed.push({...found,w,h});}
 supplies.forEach((t,i)=>Object.assign(t,arranged[i]));state.arrivalLayout={chapter:state.chapter,location,dividerY:floor+16,active:true};
}
/** First entry only: movable items target one third while newly introduced
 * hotspots settle independently into a lower playable band. Neither operation
 * is a render rule or permission to reflow residents/saves/ordinary creations. */
function arrangeNewLocationEntry(s:Scenario,state:State,location:string){
 if(s.locationPlan?.entryLayout!=='weighted-third')return;
 const tokens=state.tokens.filter(t=>t.location===location),hotspots=state.hotspots.filter(h=>h.location===location);
 const boxes=tokens.map(t=>({...t,...size(s,t),reserveH:placementHeight(s,t)})),fixed=hotspots.map(h=>({...h,id:'@'+h.id,w:106,h:82,reserveH:hotspotPlacementHeight(s,h.id)}));
 const divider=state.arrivalLayout?.location===location?state.arrivalLayout:undefined;
 const plan=firstSceneEntryPlan(boxes,fixed,s.locationPlan.panel.height,{bottom:availableBottom(s,state,location)!-12,dividerY:divider?.dividerY});
 if(!plan)return; // Dense reserved shapes retain the existing bounded arrival.
 for(const t of tokens)Object.assign(t,plan.positions.get(t.id));
 for(const h of hotspots)Object.assign(h,plan.hotspotPositions.get('@'+h.id));
 if(divider&&plan.dividerY!==undefined)divider.dividerY=plan.dividerY;
}
/** A genuine physical leg is earned by work, including work completed ahead
 * of its chapter. It never recreates an already-made vehicle or its contents. */
function enterEarnedTravel(s:Scenario,state:State,created?:string){
 const travel=s.chapters[state.chapter].travel;
 if(!s.locationPlan||!travel||state.enteredTravels?.includes(travel.id)||!(created?travel.afterCreated.includes(created):travel.afterCreated.some(id=>state.discovered.includes(id))))return [] as {item:string;from:string;to:string}[];
   const definition=locationDefinition(s,travel.locationId)!;const existing=state.locations.some(l=>l.id===definition.id);
   if(!existing)state.locations.push({id:definition.id,label:definition.label,enteredAtChapter:state.chapter});
   const carried=state.tokens.filter(t=>travel.carry.includes(t.kind)&&t.location!==definition.id);
   const transfers=carried.map(t=>({item:t.id,from:t.location,to:definition.id}));
   const arrival:Arrival={chapter:state.chapter,location:definition.id,supplies:[],carried:carried.map(t=>({item:t.id,from:t.location})),here:state.tokens.filter(t=>t.location===definition.id).map(t=>t.id)};
   arrive(s,state,definition.id,carried,true);
   if(!existing){for(const id of definition.hotspots){const p=supplyPosition(s,state,definition.id,hotspotPlacementHeight(s,id));state.hotspots.push({id,location:definition.id,...panelPoint(s,state,p,82,106)});}for(const batch of definition.stockBatches){for(const k of batch.items)if(addItem(s,state,k,definition.id))arrival.supplies.push({item:k,cache:batch.id,sourceChapter:state.chapter,location:definition.id});state.openedCaches.push(batch.id);}}
   state.currentLocation=definition.id;state.storyLocation=definition.id;state.arrival=arrival;delete state.arrivalLayout;delete state.arrivalLayouts;
   separateLocationArrival(s,state,arrival,!existing);if(!existing)arrangeNewLocationEntry(s,state,definition.id);state.enteredTravels=[...(state.enteredTravels??[]),travel.id];state.travelCue=travel.entryCue;
   return transfers;
}
function enterLocationChapter(s:Scenario,state:State,first=false,inherited?:Arrival){
 const st=s.chapters[state.chapter],definition=locationDefinition(s,st.location.id)!;
 const location=definition.id,prior=s.chapters[state.chapter-1],sameVisit=!first&&(prior?.visitId===st.visitId||state.storyLocation===location);
 // The viewed/current board can be an older storage location. Chapter geography
 // is authored by the visit, not inferred from the last tile inspected or moved.
 const existing=state.locations.some(l=>l.id===location);
 const priorArrival=state.arrival,priorDivisions=arrivalDivisions(state).map(d=>({...d,chapter:state.chapter}));
 if(!existing)state.locations.push({id:location,label:definition.label,enteredAtChapter:state.chapter});
 const wanted=first||sameVisit?[]:visitCarry(s,state,st.visitId!);
 const carried=state.tokens.filter(t=>wanted.includes(t.kind)&&t.location!==location&&!st.objectives.some(o=>o.kind==='place'&&t.hotspot===o.hotspot&&matches(s,t,o)));
 const transfers=carried.map(t=>({item:t.id,from:t.location,to:location}));
 const arrival:Arrival={chapter:state.chapter,location,supplies:[],carried:transfers.map(({item,from})=>({item,from})),here:state.tokens.filter(t=>t.location===location).map(t=>t.id)};
 if(carried.length)arrive(s,state,location,carried,true);
 state.currentLocation=location;state.storyLocation=location;delete state.travelCue;
 if(!existing){
  for(const id of definition.hotspots){const pos=supplyPosition(s,state,location,hotspotPlacementHeight(s,id));state.hotspots.push({id,location,...panelPoint(s,state,pos,82,106)});}
  if(first)for(const k of s.initialItems)if(addItem(s,state,k,location))arrival.here.push(k);
 }
 const batches=[...(!existing?definition.stockBatches:[]),...(st.sourceUpdate?[st.sourceUpdate]:[])];
 for(const batch of batches)if(!state.openedCaches.includes(batch.id)){for(const k of batch.items)if(addItem(s,state,k,location))arrival.supplies.push({item:k,cache:batch.id,sourceChapter:state.chapter,location});state.openedCaches.push(batch.id);}
 if(sameVisit&&!arrival.supplies.length){
  // Exact no-mutation beat: retain grouping, all placements and their provenance.
  state.arrival=priorArrival?{...priorArrival,chapter:state.chapter}:arrival;
  const active=priorDivisions.find(d=>d.location===location);
  if(active)state.arrivalLayout=active;else delete state.arrivalLayout;
  const others=priorDivisions.filter(d=>d.location!==location);if(others.length)state.arrivalLayouts=others;else delete state.arrivalLayouts;
 }else{
  if(inherited){const incoming=inherited.supplies.filter(x=>state.tokens.some(t=>t.id===x.item));arrival.supplies=[...incoming.map(x=>({...x,sourceChapter:x.sourceChapter??inherited.chapter,location:token(state,x.item)?.location??inherited.location})),...arrival.supplies];const fresh=new Set(arrival.supplies.map(x=>x.item));arrival.here=arrival.here.filter(id=>!fresh.has(id));arrival.carried=arrival.carried.filter(x=>!fresh.has(x.item));}
  state.arrival=arrival;delete state.arrivalLayout;delete state.arrivalLayouts;
  separateLocationArrival(s,state,arrival,!existing);
  if(!existing)arrangeNewLocationEntry(s,state,location);
 }
 transfers.push(...enterEarnedTravel(s,state));
 if(st.onAlreadyComplete)state.chapterEntry={chapter:state.chapter,alreadyComplete:chapterComplete(s,state)};else delete state.chapterEntry;
 return transfers;
}
export function currentEntryCue(s:Scenario,g:Game){return g.state.completed?null:g.state.travelCue??s.chapters[g.state.chapter].entryCue??null;}
export function pendingEntryCue(s:Scenario,g:Game){const cue=currentEntryCue(s,g);return cue&&!g.entryCuesSeen?.includes(cue.id)?cue:null;}
export function acknowledgeEntryCue(s:Scenario,g:Game,id:string):Game{const cue=currentEntryCue(s,g);return cue?.id===id?{...g,entryCuesSeen:[...new Set([...(g.entryCuesSeen??[]),id])]}:g;}
function enterChapter(s:Scenario,state:State,first=false,inherited?:Arrival){
 if(s.locationPlan)return enterLocationChapter(s,state,first,inherited);
 const st=s.chapters[state.chapter],location=st.location.id,existing=state.locations.find(x=>x.id===location);
 if(!existing)state.locations.push({id:location,label:st.location.label,enteredAtChapter:state.chapter});
 const wanted=first?[]:sceneCarry(s,state,st),carried=state.tokens.filter(t=>wanted.includes(t.kind)&&t.location!==location&&!(st.onAlreadyComplete&&st.objectives.some(o=>o.kind==='place'&&t.hotspot===o.hotspot&&matches(s,t,o))));
 const transfers=carried.map(t=>({item:t.id,from:t.location,to:location}));
 const arrival:Arrival={chapter:state.chapter,location,supplies:[],carried:transfers.map(({item,from})=>({item,from})),here:state.tokens.filter(t=>t.location===location).map(t=>t.id)};
 // A real delivery gets its own lower segment. Preserve the user's source
 // groups rigidly before compressing only empty vertical bands, never reflow.
 const fresh=!!inherited?.supplies.some(x=>state.tokens.some(t=>t.id===x.item&&(t.location===location||carried.includes(t))))||(st.caches??[]).some(c=>!state.openedCaches.includes(c.id)&&c.items.some(k=>!state.discovered.includes(k)));
 arrive(s,state,location,carried,fresh);
 state.currentLocation=location;
 for(const id of st.hotspots??[]){if(state.hotspots.some(p=>p.id===id))continue;const pos=supplyPosition(s,state,location);state.hotspots.push({id,location,x:pos.x,y:pos.y+25});}
 for(const c of st.caches??[])if(!state.openedCaches.includes(c.id)){for(const k of c.items)if(addItem(s,state,k,location))arrival.supplies.push({item:k,cache:c.id});state.openedCaches.push(c.id);}
 if(first)for(const k of s.initialItems)if(addItem(s,state,k,location))arrival.here.push(k);
 // A skipped delivery is still new when the next real chapter appears.
 // Retain its original cache/chapter even when carried through another location.
 if(inherited){
  arrival.supplies=[...inherited.supplies.map(x=>({...x,sourceChapter:x.sourceChapter??inherited.chapter,location:token(state,x.item)?.location??inherited.location})),...arrival.supplies];
  const freshIds=new Set(arrival.supplies.map(x=>x.item));
  arrival.carried=[...new Map([...inherited.carried,...arrival.carried].filter(x=>!freshIds.has(x.item)&&token(state,x.item)?.location===location).reverse().map(x=>[x.item,x])).values()].reverse();
  arrival.here.push(...arrival.carried.filter(x=>x.from===location).map(x=>x.item));
  arrival.carried=arrival.carried.filter(x=>x.from!==location);
  const carriedIds=new Set(arrival.carried.map(x=>x.item));
  arrival.here=arrival.here.filter(id=>!freshIds.has(id)&&!carriedIds.has(id));
  const retained=arrivalDivisions(state).filter(d=>d.location!==location&&state.tokens.some(t=>t.location===d.location&&freshIds.has(t.id))&&state.tokens.some(t=>t.location===d.location&&!freshIds.has(t.id))).map(d=>({...d,chapter:state.chapter}));
  if(retained.length)state.arrivalLayouts=retained;else delete state.arrivalLayouts;
 }else delete state.arrivalLayouts;
 state.arrival=arrival;
 delete state.arrivalLayout;
 const newIds=new Set(arrival.supplies.map(x=>x.item)),old=state.tokens.filter(t=>t.location===location&&!newIds.has(t.id)),supplies=state.tokens.filter(t=>t.location===location&&newIds.has(t.id));
 // Hotspots belong to the existing setting, never to the new-items cache.
 // An all-new or all-old scene needs neither an empty segment nor relocation.
 if(old.length&&supplies.length){
  const hotspots=state.hotspots.filter(p=>p.location===location),plan=groupedArrivalPlan([...old.map(t=>({...t,...size(s,t)})),...hotspots.map(p=>({...p,id:'@'+p.id,w:106,h:82}))],supplies.map(t=>({...t,...size(s,t)})),state.width)!;
  for(const t of [...old,...supplies])Object.assign(t,plan.positions.get(t.id));
  for(const p of hotspots)Object.assign(p,plan.positions.get('@'+p.id));
  state.arrivalLayout={chapter:state.chapter,location,dividerY:plan.dividerY,active:true};
 }
 if(st.onAlreadyComplete)state.chapterEntry={chapter:state.chapter,alreadyComplete:chapterComplete(s,state)};
 else delete state.chapterEntry;
 return transfers;
}
/** Dividers may span several locations when a cascade includes real deliveries. */
export function arrivalDivisions(state:State):ArrivalLayout[]{return [...(state.arrivalLayout?[state.arrivalLayout]:[]),...(state.arrivalLayouts??[])];}
/** Entry resolution is bounded and shared by UI, replay and logical players.
 * Ordinary completion does not retroactively make a chapter 'already complete'.
 * It performs only genuine chapter effects: no fake combinations or rewards. */
function resolveEntryState(s:Scenario,state:State){
 const skipped:string[]=[],transfers:{item:string;from:string;to:string}[]=[];
 for(let remaining=s.chapters.length;remaining>0&&!state.completed;remaining--){
  const st=s.chapters[state.chapter],entry=state.chapterEntry;
  if(!st.onAlreadyComplete||!entry||entry.chapter!==state.chapter||!entry.alreadyComplete||!chapterComplete(s,state))break;
  if(st.sourceUpdate)state.entryFacts=[...new Map([...(state.entryFacts??[]),{id:st.sourceUpdate.id,text:st.sourceUpdate.arrivalFact}].map(f=>[f.id,f])).values()];
  skipped.push(st.id);state.skippedChapters=[...new Set([...(state.skippedChapters??[]),st.id])];
  if(state.chapter===s.chapters.length-1){state.completed=true;break;}
  const arrival=state.arrival;state.chapter++;transfers.push(...enterChapter(s,state,false,arrival));
 }
 return {skipped,transfers};
}
export function resolveChapterEntry(s:Scenario,g:Game):Game{
 if(g.scenarioId!==s.id)throw Error('Scenario/save mismatch');
 if(g.state.completed||!g.state.chapterEntry?.alreadyComplete)return g;
 const state=clone(g.state);const {skipped}=resolveEntryState(s,state);
 return skipped.length?{...g,state}:g;
}
/** Bridge facts follow Undo; dismissals, like invention celebrations, do not. */
export function pendingChapterBridges(s:Scenario,g:Game){
 return [...(g.state.entryFacts??[]).filter(f=>!g.bridgesSeen?.includes(f.id)).map(f=>({id:f.id,text:s.chapters.find(ch=>ch.sourceUpdate?.id===f.id)?.sourceUpdate?.presentationText??f.text})),...(g.state.skippedChapters??[]).filter(id=>!g.bridgesSeen?.includes(id)).flatMap(id=>{const chapter=s.chapters.find(st=>st.id===id);return chapter?.onAlreadyComplete?.mode==='bridge'?[{id,text:chapter.onAlreadyComplete.text}]:[];})];
}
export function acknowledgeChapterBridges(s:Scenario,g:Game,ids:string[]):Game{
 const pending=new Set(pendingChapterBridges(s,g).map(b=>b.id)),accepted=ids.filter(id=>pending.has(id));
 return accepted.length?{...g,bridgesSeen:[...new Set([...(g.bridgesSeen??[]),...accepted])]}:g;
}
export function createGame(s:Scenario,width=360):Game{
 assertScenario(s);const state:State={chapter:0,currentLocation:s.chapters[0].location.id,locations:[],hotspots:[],tokens:[],discovered:[],recipesUsed:[],openedCaches:[],width:Math.max(320,Math.min(s.locationPlan?390:600,width)),metrics:clone(ZERO),completed:false};enterChapter(s,state,true);return resolveChapterEntry(s,{version:2,lifecycleVersion:2,scenarioId:s.id,state,history:[],events:[]});
}
function resolveRecipe(s:Scenario,state:State,a:Token,b:Token|HotspotPosition,isHotspot:boolean):Recipe|undefined{
 const bk=isHotspot?'@'+b.id:(b as Token).kind;
 const candidates=s.recipes.filter(r=>(r.requires??[]).every(req=>{const t=token(state,req.item);return !!t&&capabilities(s,t).includes(req.capability);})&&((r.a===a.kind&&r.b===bk)||(r.b===a.kind&&r.a===bk))&&(!r.at||!isHotspot&&(b as Token).hotspot===r.at));
 return candidates.sort((x,y)=>Number(!!y.at)-Number(!!x.at)).find(r=>r.out?!state.discovered.includes(r.out):!state.recipesUsed.includes(r.id));
}
/** Resolve the same drag gesture for browser and logical player surfaces. */
export function dropAction(s:Scenario,state:State,a:string,b:string):Action{
 if(!b.startsWith('@'))return {type:'combine',a,b};
 const source=token(state,a),target=hotspot(state,b.slice(1));
 if(source&&target&&source.location===state.currentLocation&&target.location===state.currentLocation&&resolveRecipe(s,state,source,target,true))return {type:'combine',a,b};
 return {type:'place',item:a,hotspot:b.slice(1)};
}
function errorResult(g:Game,a:Action,message:string):Result{
 const game=clone(g);game.state.metrics.attempts++;game.events.push({seq:game.events.length+1,action:a,accepted:false,message,chapter:game.state.chapter});game.state.metrics=cumulativeMetrics(game.events);return {accepted:false,game,message};
}
export function applyAction(s:Scenario,g:Game,a:Action):Result{
 if(g.scenarioId!==s.id)throw Error('Scenario/save mismatch');
 if(a.type==='drop'){
  if(!s.locationPlan)return errorResult(g,a,'Direct target drops are for fixed location panels.');
  const original=token(g.state,a.item),target=a.target.startsWith('@')?hotspot(g.state,a.target.slice(1)):token(g.state,a.target);
  if(!original||!target||original.id===target.id)return errorResult(g,a,'Choose another thing or hotspot.');
  const staged=clone(g);const source=token(staged.state,a.item)!;source.location=target.location;source.hotspot=null;staged.state.currentLocation=target.location;
  const action=dropAction(s,staged.state,a.item,a.target),result=applyAction(s,staged,action);
  if(!result.accepted)return errorResult(g,a,result.message);
  const state=result.game.state,r=result.recipe?s.recipes.find(r=>r.id===result.recipe):undefined;
  const earnedTravel=(state.enteredTravels?.length??0)>(g.state.enteredTravels?.length??0),travelMoves=new Set(earnedTravel?(result.game.events.at(-1)?.transfers??[]).map(t=>t.item):[]);
  if(action.type==='combine'){
   const retained=token(state,original.id);if(retained&&!travelMoves.has(retained.id))Object.assign(retained,{x:original.x,y:original.y,location:original.location,hotspot:original.hotspot});
   if(r?.out&&result.retired?.includes(original.id)&&transformedInput(r)===original.kind&&!a.target.startsWith('@')){const transformed=token(state,r.out);if(transformed&&!travelMoves.has(transformed.id))Object.assign(transformed,{x:original.x,y:original.y,location:original.location,hotspot:original.hotspot});}
  }
  const changed=token(state,result.updated??result.created??'');if(changed&&(changed.y-tokenHeight(s,changed)/2<0||changed.y+tokenHeight(s,changed)/2>s.locationPlan.panel.height))return errorResult(g,a,'Make room around the object before enlarging it.');
  const after=token(state,original.id),transfers=after&&after.location!==original.location?[{item:after.id,from:original.location,to:after.location}]:[];
  const last=result.game.events.at(-1)!;const event:Event={...last,seq:g.events.length+1,action:clone(a)};const allTransfers=[...(earnedTravel?last.transfers??[]:[]),...transfers];if(allTransfers.length)event.transfers=allTransfers;else delete event.transfers;
  const game:Game={...result.game,state,history:[...g.history,g.state].slice(-100),events:[...g.events,event]};game.state.metrics=cumulativeMetrics(game.events);
  return {...result,game};
 }
 const state=clone(g.state);let message='',created:string|undefined,updated:string|undefined,recipe:string|undefined,origin:Point|undefined;const retired:string[]=[],skippedChapters:string[]=[];let transfers:{item:string;from:string;to:string}[]=[];
 try{
  if(a.type==='advance'){
   if(!chapterComplete(s,state))throw Error('Finish the current objectives before moving on.');
   if(state.chapter===s.chapters.length-1){if(state.completed)throw Error('This journey is already complete.');state.completed=true;message=s.chapters[state.chapter].completionText??'Journey complete.';}else {state.chapter++;transfers=enterChapter(s,state);const entry=resolveEntryState(s,state);transfers.push(...entry.transfers);skippedChapters.push(...entry.skipped);message=state.completed?(s.chapters[state.chapter].completionText??'Journey complete.'):s.chapters[state.chapter].location.travelText+(transfers.length?' We collect the things needed for this scene along the way.':'');}state.metrics.advances++;
  }else if(a.type==='relocate'){
   if(!s.locationPlan)throw Error('Direct relocation is for fixed location panels.');
   const moving=token(state,a.item);if(!moving||!state.locations.some(l=>l.id===a.location)||!Number.isFinite(a.x)||!Number.isFinite(a.y))throw Error('Move an existing thing to a reached location.');
   const from=moving.location;moving.location=a.location;moving.hotspot=null;Object.assign(moving,panelPoint(s,state,a,tokenHeight(s,moving)));state.currentLocation=a.location;state.metrics.moves++;if(from!==a.location)transfers.push({item:moving.id,from,to:a.location});
   if(state.arrival)for(const supply of state.arrival.supplies)if(supply.item===moving.id)supply.location=a.location;
   message='Moved.';
  }else if(a.type==='visit'){
   if(!state.locations.some(x=>x.id===a.location))throw Error('That location has not been reached.');
   const take=(a.carry??[]).map(id=>token(state,id));if(take.some(t=>!t||t.location!==state.currentLocation))throw Error('Carry only things physically in your current location.');
   if(a.location!==state.currentLocation)arrive(s,state,a.location,take as Token[]);state.currentLocation=a.location;state.metrics.visits++;message=`Travelled to ${state.locations.find(x=>x.id===a.location)!.label}.`;
  }else{
   const id=a.type==='combine'?a.a:a.item,first=token(state,id);if(!first||first.location!==state.currentLocation)throw Error('Choose a thing in this location.');
   if(a.type==='move'||a.type==='place'){
    if(a.type==='place'&&a.hotspot){const p=hotspot(state,a.hotspot);if(!p||p.location!==state.currentLocation)throw Error('That hotspot is not in this location.');Object.assign(first,{x:p.x,y:p.y+16,hotspot:p.id});if(s.locationPlan)Object.assign(first,panelPoint(s,state,first,tokenHeight(s,first)));state.metrics.placements++;message='Placed.';}
    else {if(!Number.isFinite(a.x)||!Number.isFinite(a.y))throw Error('Supply finite x and y coordinates for an ordinary move.');first.x=Math.max(52,Math.min(state.width-52,a.x!));first.y=Math.max(30,a.y!);if(s.locationPlan)Object.assign(first,panelPoint(s,state,first,tokenHeight(s,first)));first.hotspot=null;state.metrics.moves++;message='Moved.';}
   }else if(a.type==='combine'){
    const isHotspot=a.b.startsWith('@'),second=isHotspot?hotspot(state,a.b.slice(1)):token(state,a.b);if(!second||second.location!==state.currentLocation||first.id===second.id)throw Error('Choose another thing or hotspot in this location.');
    const r=resolveRecipe(s,state,first,second,isHotspot);if(!r){const hints=partners(s,state,first.id),incoming=hints.directions.find(h=>h.source===second.id&&h.target===first.id&&h.hotspot),advice=hints.settingHelp.find(h=>h.source===first.id&&h.target===second.id);throw Error(incoming?incoming.text+' Only the receiving thing needs to be placed there.':advice?.text??'No new combination here.');}recipe=r.id;origin={x:second.x,y:second.y};
    if(r.install){const target=token(state,r.install.target),component=token(state,r.install.component);if(!target||!component)throw Error('Both component and construction must be available.');if(target.slots[r.install.slot]===component.kind)throw Error('That component is already fitted.');target.slots[r.install.slot]=component.kind;updated=target.id;state.metrics.installations++;message=`${itemDisplayLabel(s,state,component.kind)} fitted to ${itemDisplayLabel(s,state,target.kind)}.`;preserveConstruction(r,target,component);if(!needed(s,state,component,r.id)){target.incorporated.push(component.kind);state.tokens=state.tokens.filter(t=>t.id!==component.id);retired.push(component.id);}}
    else {const division=arrivalDivisions(state).find(d=>d.location===state.currentLocation),side=(p:Point)=>division&&p.y<division.dividerY?'old':'new';
     const segment=division?.active&&division.location===state.currentLocation&&side(first)===side(second)?side(first):undefined;
     const out:Token={id:r.out!,kind:r.out!,location:state.currentLocation,hotspot:null,slots:{},incorporated:[],x:0,y:0};for(const kind of r.preserve??[]){const source=token(state,kind);if(source)preserveConstruction(r,out,source);}Object.assign(out,isHotspot?{x:second.x,y:second.y+Math.max(0,Math.min(16,38-tokenHeight(s,out)/2))}:adjacent(s,state,origin,state.currentLocation,out,size(s,second as Token),segment));state.tokens.push(out);state.discovered.push(out.kind);created=out.kind;state.metrics.creations++;message=`${itemDisplayLabel(s,state,out.kind)}. ${r.description??item(s,out.kind)?.description??''}`.trim();
     // A declared single object takes one upgrade path. Shared supplies retain the conservative future-use safeguard.
     for(const ret of incorporations(r)){const t=token(state,ret.item);if(t&&(r.lifecycle?.[ret.item]?.exclusive===true||!needed(s,state,t,r.id))){out.incorporated.push(t.kind,...t.incorporated);state.tokens=state.tokens.filter(x=>x.id!==t.id);retired.push(t.id);}}
     // A replacement inherits the removed object's physical spot. Prefer the
     // drop target when both inputs disappear; keep its placement identity too.
     const primary=transformedInput(r);
     const replaced=primary?(primary===first.kind&&retired.includes(first.id)?first:!isHotspot&&primary===(second as Token).kind&&retired.includes(second.id)?second as Token:undefined):!isHotspot&&retired.includes(second.id)?second as Token:retired.includes(first.id)?first:undefined;
     if(isHotspot&&replaced){
      // The carried object transforms at the destination (e.g. a tray
      // sprouting in a habitat). A reusable tool producing a separate object
      // has no retired input: its separate output is born inside the hotspot,
      // but is not attached to it. Existing contents do not offset new births.
      Object.assign(out,{x:second.x,y:second.y+16,location:second.location,hotspot:second.id});origin={x:out.x,y:out.y};
     }else if(replaced){Object.assign(out,{x:replaced.x,y:replaced.y,location:replaced.location,hotspot:replaced.hotspot});origin={x:out.x,y:out.y};}
    }
    if(s.locationPlan){const changed=created?token(state,created):updated?token(state,updated):undefined;if(changed){const replacement=!!updated||!!created&&!!transformedInput(r)&&retired.includes(transformedInput(r)!);const clamped=panelPoint(s,state,changed,tokenHeight(s,changed));if(replacement&&(changed.x<48||changed.x>state.width-48||changed.y-tokenHeight(s,changed)/2<0||changed.y+tokenHeight(s,changed)/2>s.locationPlan.panel.height))throw Error('Make room around the object before enlarging it.');if(created&&!replacement&&!isHotspot)Object.assign(changed,boundedBirth(s,state,changed,clamped));else if(!replacement)Object.assign(changed,clamped);}}
    state.recipesUsed.push(r.id);state.metrics.combinations++;
   }
  }
  // Dismiss only a committed cross-segment decision. An unsuccessful recipe,
  // cancelled/transient drag, selection, visit, resize or reload cannot do it.
  // A successful cross-group combine is intentional mixing even when a
  // reusable source returns to its original position after the gesture.
  const division=arrivalDivisions(g.state).find(d=>d.location===g.state.currentLocation),nextDivision=arrivalDivisions(state).find(d=>d.location===division?.location);
  if(division?.active&&division.chapter===state.chapter&&nextDivision?.active){
   const side=(p:Point&{location:string})=>p.location===division.location?(p.y<division.dividerY?'old':'new'):null;
   if(a.type==='move'||a.type==='place'||a.type==='relocate'){
    const before=token(g.state,a.item),after=token(state,a.item);
    if(before&&after&&side(before)&&(after.location!==before.location||side(after)&&side(before)!==side(after)))nextDivision.active=false;
   }else if(a.type==='combine'){
    const source=token(g.state,a.a),target=a.b.startsWith('@')?hotspot(g.state,a.b.slice(1)):token(g.state,a.b);
    if(source&&target&&side(source)&&side(target)&&side(source)!==side(target))nextDivision.active=false;
   }
  }
  if(!s.locationPlan&&nextDivision?.active&&division?.active&&a.type==='combine'){
   const changed=created?token(state,created):updated?token(state,updated):undefined;
   const source=token(g.state,a.a),target=a.b.startsWith('@')?hotspot(g.state,a.b.slice(1)):token(g.state,a.b);
   if(changed&&source&&target&&source.location===division.location&&target.location===division.location&&source.y<division.dividerY&&target.y<division.dividerY){
    const extra=Math.max(0,changed.y+tokenHeight(s,changed)/2+20-division.dividerY);
    if(extra){
     // Growing an upper creation must not silently masquerade as a delivery.
     // Keep its exact replacement spot and every existing upper object fixed.
     // Only the intact lower segment and its separator move down together.
     for(const t of state.tokens)if(t.id!==changed.id&&t.location===division.location){const before=token(g.state,t.id);if(before&&before.y>=division.dividerY)t.y+=extra;}
     for(const p of state.hotspots)if(p.location===division.location&&p.y>=division.dividerY)p.y+=extra;
     nextDivision.dividerY+=extra;
    }
   }
  }
  if(a.type!=='advance'&&state.chapter===g.state.chapter&&!chapterComplete(s,g.state)&&chapterComplete(s,state)&&s.chapters[state.chapter].completionText)message+=' '+s.chapters[state.chapter].completionText;
  if(a.type==='combine'){
   const changed=created?token(state,created):updated?token(state,updated):undefined;
   for(const m of s.milestones??[]){
    if(!changed||changed.kind!==m.item||state.milestones?.some(x=>x.id===m.id))continue;
    const before=token(g.state,changed.id);
    const achieved=m.when==='created'?!!created:capabilities(s,changed).includes(m.capability!)&&(!before||!capabilities(s,before).includes(m.capability!));
    if(achieved)state.milestones=[...(state.milestones??[]),{id:m.id,components:[...new Set([...Object.values(changed.slots),...(changed.components??[])])]}];
   }
  }
  transfers.push(...enterEarnedTravel(s,state,created));
  state.metrics.attempts++;state.metrics.accepted++;
  const event:Event={seq:g.events.length+1,action:clone(a),accepted:true,message,chapter:state.chapter,...recipe?{recipe}:{},...created?{created}:{},...updated?{installed:true}:{},...retired.length?{retired}:{},...transfers.length?{transfers}:{},...skippedChapters.length?{skippedChapters}:{}};
  const game:Game={...g,state,history:[...g.history,g.state].slice(-100),events:[...g.events,event]};game.state.metrics=cumulativeMetrics(game.events);return {accepted:true,game,message,created,updated,recipe,origin,retired};
 }catch(e){return errorResult(g,a,(e as Error).message);}
}
/** Earned facts follow Undo; acknowledgements do not. A triumph is never repeated in this run. */
export function pendingMilestone(s:Scenario,g:Game){
 for(const earned of g.state.milestones??[]){const m=s.milestones?.find(m=>m.id===earned.id);if(m&&!g.milestonesSeen?.includes(m.id))return {...m,components:earned.components};}
 return null;
}
export function acknowledgeMilestone(s:Scenario,g:Game,id:string):Game{
 if(pendingMilestone(s,g)?.id!==id)return g;
 return {...g,milestonesSeen:[...new Set([...(g.milestonesSeen??[]),id])]};
}
export function undo(g:Game):Result{if(!g.history.length)return {accepted:false,game:g,message:'Nothing to undo.'};const game={...g,state:clone(g.history.at(-1)!),history:g.history.slice(0,-1),events:[...g.events,{seq:g.events.length+1,action:{type:'undo'} as const,accepted:true,message:'Undone.',chapter:g.history.at(-1)!.chapter}]};game.state.metrics=cumulativeMetrics(game.events);return {accepted:true,game,message:'Undone.'};}
/** Supply arrivals are not creation effects. No cue is inferred from caches,
 * recipe availability, a visited location, or a truncated undo/event history. */
export function arrivalCue(state:State,id:string):'new'|'carried'|null{
 const a=state.arrival,t=token(state,id);
 if(!a||a.chapter!==state.chapter||!t||t.location!==a.location&&!a.supplies.some(x=>x.item===id&&x.location===t.location))return null;
 return a.supplies.some(x=>x.item===id)?'new':a.carried.some(x=>x.item===id)?'carried':null;
}
/** Only witnessed, already-discovered things; never recipe results or hints. */
export function arrivalView(s:Scenario,state:State){
 const a=state.arrival;if(!a||a.chapter!==state.chapter)return null;
 const known=(id:string)=>state.discovered.includes(id)&&!!item(s,id);
 return {location:state.locations.find(x=>x.id===a.location)?.label??s.chapters[state.chapter].location.label,
  supplies:a.supplies.filter(x=>known(x.item)).map(x=>({id:x.item,label:itemDisplayLabel(s,state,x.item),source:stockBatches(s,x.sourceChapter??a.chapter).find(c=>c.id===x.cache)?.label??''})),
  carried:a.carried.filter(x=>known(x.item)).map(x=>({id:x.item,label:itemDisplayLabel(s,state,x.item),from:state.locations.find(location=>location.id===x.from)?.label??''})),
  here:a.here.filter(known).map(id=>({id,label:itemDisplayLabel(s,state,id)}))};
}
export function partners(s:Scenario,state:State,id:string){
 const empty={message:'No new combinations with things currently in this location' as string|null,partners:[] as string[],outgoing:[] as string[],incoming:[] as string[],settings:[] as string[],placements:[] as string[],directions:[] as {source:string;target:string;hotspot?:string;text:string}[],settingHelp:[] as {source:string;target:string;hotspot:string;text:string}[]};
 // Placement goals are useful actions without new outputs. Keep them separate
 // from recipe partners so callers never mistake a placement for a combination.
 if(id.startsWith('@')){
  const p=hotspot(state,id.slice(1));if(!p||p.location!==state.currentLocation)return empty;
  for(const t of state.tokens.filter(t=>t.location===p.location)){
   const hints=partners(s,state,t.id);
   if(hints.outgoing.includes(id))empty.incoming.push(t.id);
   if(hints.settings.includes(id))empty.settings.push(t.id);
   if(hints.placements.includes(id))empty.placements.push(t.id);
   empty.directions.push(...hints.directions.filter(d=>d.target===id));
   empty.settingHelp.push(...hints.settingHelp.filter(h=>h.hotspot===p.id&&!empty.settingHelp.some(x=>x.source===h.source&&x.target===h.target)));
  }
  if(empty.incoming.length||empty.settings.length||empty.placements.length)empty.message=null;
  return empty;
 }
 const t=token(state,id);if(!t||t.location!==state.currentLocation)return empty;
 for(const o of visibleObjectives(s,state))if(o.kind==='place'&&!o.satisfied&&matches(s,t,o)&&hotspot(state,o.hotspot!)?.location===t.location){
  const target='@'+o.hotspot;if(!empty.placements.includes(target))empty.placements.push(target);
 }
 const things=state.tokens.filter(x=>x.location===state.currentLocation&&x.id!==id),hotspots=state.hotspots.filter(x=>x.location===state.currentLocation);
 const label=(id:string)=>id.startsWith('@')?s.hotspots.find(x=>x.id===id.slice(1))!.label:itemDisplayLabel(s,state,id);
 const legal=(a:Token,b:Token|HotspotPosition,isHotspot:boolean)=>{const r=resolveRecipe(s,state,a,b,isHotspot);return r&&(!r.install||token(state,r.install.target)?.slots[r.install.slot]!==r.install.component)?r:undefined;};
 for(const target of [...things,...hotspots]){const isHotspot=hotspots.includes(target as HotspotPosition),r=legal(t,target,isHotspot);if(r){const targetId=isHotspot?'@'+target.id:target.id;empty.outgoing.push(targetId);empty.directions.push({source:id,target:targetId,...r.at?{hotspot:r.at}:{},text:`Bring ${label(id)} onto ${label(targetId)}${r.at?' here':''}.`});}}
 for(const source of things){const r=legal(source,t,false);if(r){empty.incoming.push(source.id);if(!empty.directions.some(d=>d.source===source.id&&d.target===id))empty.directions.push({source:source.id,target:id,...r.at?{hotspot:r.at}:{},text:`Bring ${label(source.id)} onto ${label(id)}${r.at?' here':''}.`});}}
 for(const r of s.recipes){if(!r.at||![r.a,r.b].includes(t.kind)||state.recipesUsed.includes(r.id)||r.out&&state.discovered.includes(r.out)||!(r.requires??[]).every(q=>{const x=token(state,q.item);return !!x&&capabilities(s,x).includes(q.capability);}))continue;
  const p=hotspots.find(x=>x.id===r.at),other=things.find(x=>[r.a,r.b].includes(x.kind));if(!p||!other)continue;
  for(const [source,target] of [[other,t],[t,other]])if(target.hotspot!==r.at){empty.settingHelp.push({source:source.id,target:target.id,hotspot:r.at,text:`Place ${label(target.id)} at ${label('@'+r.at)}, then bring ${label(source.id)} onto ${label(target.id)}. Only the receiving thing needs to be placed there.`});}
  if(!empty.settings.includes('@'+r.at))empty.settings.push('@'+r.at);
 }
 empty.partners=empty.outgoing;if(empty.outgoing.length||empty.incoming.length||empty.settingHelp.length||empty.placements.length)empty.message=null;return empty;
}
export function playerView(s:Scenario,g:Game){
 const state=g.state,st=s.chapters[state.chapter],marks=gold(s,state);
 return {scenario:{id:s.id,title:s.title,premise:s.premise},chapter:{number:state.chapter+1,title:st.title,speaker:st.speaker,motivation:st.motivation,travelText:st.location.travelText},location:state.locations.find(a=>a.id===state.currentLocation),locations:state.locations.map(a=>({id:a.id,label:a.label,current:a.id===state.currentLocation,thingCount:state.tokens.filter(t=>t.location===a.id).length})),objectives:(state.completed&&state.skippedChapters?.includes(st.id)?[]:visibleObjectives(s,state)).map(({id,text,satisfied})=>({id,text,satisfied})),canAdvance:chapterComplete(s,state)&&!state.completed,nextAction:chapterComplete(s,state)&&!state.completed?(state.chapter===s.chapters.length-1?'Finish this journey':'Continue · '+s.chapters[state.chapter+1].title):null,completionText:chapterComplete(s,state)?st.completionText??null:null,completed:state.completed,bridges:pendingChapterBridges(s,g),
  things:state.tokens.filter(t=>t.location===state.currentLocation).map(t=>{const def=item(s,t.kind)!;return {id:t.id,label:itemDisplayLabel(s,state,t.kind),description:def.description??'',...(def.reading?{reading:{...def.reading}}:{}),x:t.x,y:t.y,hotspot:t.hotspot,gold:marks.items.includes(t.id),slots:(def.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).map((sl,index)=>({id:'slot'+(index+1),filled:!!t.slots[sl.id],label:t.slots[sl.id]?itemDisplayLabel(s,state,t.slots[sl.id],t.location):null})),components:componentLabels(s,t,state),functional:functional(s,t)};}),
  hotspots:state.hotspots.filter(p=>p.location===state.currentLocation).map(p=>({...p,label:s.hotspots.find(l=>l.id===p.id)!.label,description:s.hotspots.find(l=>l.id===p.id)!.description??'',gold:marks.hotspots.includes(p.id)})),cacheNarrative:(st.entryCue?[]:st.caches??[]).map(c=>({label:c.label,narrative:c.narrative})),metrics:state.metrics};
}
export function replay(s:Scenario,actions:Action[],width=360){let g=createGame(s,width);for(let i=0;i<actions.length;i++){const r=applyAction(s,g,actions[i]);if(!r.accepted)throw Error(`Replay action ${i+1}: ${r.message}`);g=r.game;}return g;}
export function checkpoint(s:Scenario,id:string,width=360){const c=s.checkpoints?.find(x=>x.id===id);if(!c)throw Error('Unknown checkpoint');const g=replay(s,c.actions,width);return {...g,...g.state.milestones?.length?{milestonesSeen:g.state.milestones.map(m=>m.id)}:{},...pendingChapterBridges(s,g).length?{bridgesSeen:pendingChapterBridges(s,g).map(b=>b.id)}:{}};}
export function restore(s:Scenario,raw:string):Game{
 const parsed=JSON.parse(raw);
 let g=(parsed?.version===1?fromLegacyGame(parsed):parsed) as Game;
 // Reject mixed v1/v2 core fields before accepting progress; never let key order
 // reinterpret a token binding or defer the conflict until autosave.
 if(parsed?.version===2)g=fromLegacyGame(toLegacyGame(g));
 const validState=(st:State):boolean=>{
  if(!st||!Number.isInteger(st.chapter)||!s.chapters[st.chapter]||!Number.isFinite(st.width)||st.width<320||st.width>600||typeof st.completed!=='boolean'||!Array.isArray(st.locations)||!Array.isArray(st.hotspots)||!Array.isArray(st.tokens)||!Array.isArray(st.discovered)||!Array.isArray(st.recipesUsed)||!Array.isArray(st.openedCaches)||!st.metrics)return false;
  const locationIds=st.locations.map(a=>a.id),hotspotIds=st.hotspots.map(p=>p.id);
  if(!unique(locationIds)||!locationIds.includes(st.currentLocation)||!unique(hotspotIds)||!unique(st.tokens.map(t=>t.id))||!unique(st.discovered)||!unique(st.recipesUsed)||!unique(st.openedCaches))return false;
  if(st.locations.some(a=>!s.chapters.slice(0,st.chapter+1).some(x=>x.location.id===a.id||x.travel?.locationId===a.id&&st.enteredTravels?.includes(x.travel.id)))||st.hotspots.some(p=>!s.hotspots.some(x=>x.id===p.id)||!locationIds.includes(p.location)||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return false;
  if(st.discovered.some(k=>!item(s,k))||st.recipesUsed.some(id=>!s.recipes.some(r=>r.id===id))||st.openedCaches.some(id=>!stockBatches(s,st.chapter).some(c=>c.id===id)))return false;
  if(Object.values(st.metrics).some(n=>!Number.isInteger(n)||n<0))return false;
  return st.tokens.every(t=>{const def=item(s,t.kind);if(!def||t.id!==t.kind||!st.discovered.includes(t.kind)||!locationIds.includes(t.location)||!Number.isFinite(t.x)||!Number.isFinite(t.y)||!t.slots||Array.isArray(t.slots)||!Array.isArray(t.incorporated)||t.incorporated.some(k=>!st.discovered.includes(k))||(t.components!==undefined&&(!Array.isArray(t.components)||t.components.some(k=>!st.discovered.includes(k)))))return false;
   if(t.hotspot!==null&&!st.hotspots.some(p=>p.id===t.hotspot&&p.location===t.location))return false;
   return Object.entries(t.slots).every(([id,k])=>def.slots?.some(slot=>slot.id===id&&slot.accepts.includes(k))&&st.discovered.includes(k));
  });
 };
 if(g?.version!==2||g.lifecycleVersion!==undefined&&g.lifecycleVersion!==2||g.scenarioId!==s.id||!validState(g.state)||!Array.isArray(g.events)||!Array.isArray(g.history)||!g.history.every(validState)||!g.events.every((e,i)=>e.seq===i+1&&typeof e.accepted==='boolean'&&e.action&&typeof e.message==='string'&&!!s.chapters[e.chapter]&&(!e.recipe||s.recipes.some(r=>r.id===e.recipe))&&(!e.created||!!item(s,e.created))))throw Error('Invalid campaign save');
 // Optional reward metadata must never make otherwise playable old progress fail.
 // No achievements or pending popups are inferred for pre-feature saves.
 const knownMilestones=new Set((s.milestones??[]).map(m=>m.id));
 if(g.milestonesSeen!==undefined){if(!Array.isArray(g.milestonesSeen))delete g.milestonesSeen;else g.milestonesSeen=[...new Set(g.milestonesSeen.filter(id=>knownMilestones.has(id)))];}
 for(const st of [...g.history,g.state])if(st.milestones!==undefined){
  if(!Array.isArray(st.milestones))delete st.milestones;
  else {const ids=new Set<string>();st.milestones=st.milestones.filter(m=>{if(!m||!knownMilestones.has(m.id)||ids.has(m.id)||!Array.isArray(m.components)||m.components.some(id=>!item(s,id)))return false;ids.add(m.id);return true;});}
 }
 // Provenance is optional presentation metadata. Older saves have none; do
 // not invent it or discard playable progress because it is absent/damaged.
 for(const st of [...g.history,g.state])if(st.arrival!==undefined){
  const a=st.arrival;
  const valid=!!a&&a.chapter===st.chapter&&a.location===(st.storyLocation??s.chapters[st.chapter].location.id)&&Array.isArray(a.supplies)&&Array.isArray(a.carried)&&Array.isArray(a.here)
   &&a.supplies.every(x=>x&&st.discovered.includes(x.item)&&Number.isInteger(x.sourceChapter??st.chapter)&&(x.sourceChapter??st.chapter)>=0&&(x.sourceChapter??st.chapter)<=st.chapter&&stockBatches(s,x.sourceChapter??st.chapter).some(c=>c.id===x.cache&&st.openedCaches.includes(c.id)&&c.items.includes(x.item)))
   &&a.carried.every(x=>x&&st.discovered.includes(x.item)&&x.from!==a.location&&st.locations.some(location=>location.id===x.from))
   &&a.here.every(id=>st.discovered.includes(id))&&unique([...a.supplies.map(x=>x.item),...a.carried.map(x=>x.item),...a.here]);
  if(!valid)delete st.arrival;
 }
 // Optional reactive metadata never rewrites or invalidates an old snapshot.
 const bridgeIds=new Set([...s.chapters.filter(st=>st.onAlreadyComplete?.mode==='bridge').map(st=>st.id),...s.chapters.flatMap(st=>st.sourceUpdate?[st.sourceUpdate.id]:[])]);
 const cueIds=new Set(s.chapters.flatMap(ch=>[...(ch.entryCue?[ch.entryCue.id]:[]),...(ch.travel?[ch.travel.entryCue.id]:[])]));
 if(g.entryCuesSeen!==undefined)g.entryCuesSeen=Array.isArray(g.entryCuesSeen)?[...new Set(g.entryCuesSeen.filter(id=>cueIds.has(id)))]:[];
 if(g.bridgesSeen!==undefined){if(!Array.isArray(g.bridgesSeen))delete g.bridgesSeen;else g.bridgesSeen=[...new Set(g.bridgesSeen.filter(id=>bridgeIds.has(id)))];}
 const factTexts=new Map(s.chapters.flatMap(ch=>ch.sourceUpdate?[[ch.sourceUpdate.id,ch.sourceUpdate.arrivalFact] as const]:[]));
 for(const st of [...g.history,g.state]){
  if(st.entryFacts!==undefined){if(!Array.isArray(st.entryFacts))delete st.entryFacts;else st.entryFacts=st.entryFacts.filter(f=>f&&factTexts.get(f.id)===f.text);}
  if(st.skippedChapters!==undefined){if(!Array.isArray(st.skippedChapters))delete st.skippedChapters;else st.skippedChapters=[...new Set(st.skippedChapters.filter(id=>s.chapters.slice(0,st.chapter+1).some(ch=>ch.id===id&&ch.onAlreadyComplete)))];}
  if(st.chapterEntry!==undefined&&(!st.chapterEntry||st.chapterEntry.chapter!==st.chapter||typeof st.chapterEntry.alreadyComplete!=='boolean'||!s.chapters[st.chapter].onAlreadyComplete))delete st.chapterEntry;
  if(st.arrivalLayouts!==undefined){if(!Array.isArray(st.arrivalLayouts))delete st.arrivalLayouts;else st.arrivalLayouts=st.arrivalLayouts.filter(a=>a&&a.chapter===st.chapter&&st.locations.some(location=>location.id===a.location)&&a.location!==st.arrivalLayout?.location&&!!st.arrival&&Number.isFinite(a.dividerY)&&a.dividerY>=0&&typeof a.active==='boolean');}
 }
 // Layout is independent optional presentation state. Never invent a divider
 // or move objects in an older save that predates this grouping grammar.
 for(const st of [...g.history,g.state])if(st.arrivalLayout!==undefined){
  const a=st.arrivalLayout;
  if(!a||a.chapter!==st.chapter||a.location!==(st.storyLocation??s.chapters[st.chapter].location.id)||!st.arrival||!Number.isFinite(a.dividerY)||a.dividerY<0||typeof a.active!=='boolean')delete st.arrivalLayout;
 }
 // Unmarked old saves may lack visible construction details. Recover only
 // from an observed recipe event's actual PRE-action snapshot, not a later
 // upgraded loose copy or the catalogue. Missing history is not permission
 // to invent parts. Never retrospectively retire a still-present object.
 if(g.lifecycleVersion===undefined){
  const sources=new Map<string,Token[]>();let before:State|undefined;
  for(const st of [...g.history,g.state]){
   for(const id of st.recipesUsed){
    const r=s.recipes.find(r=>r.id===id)!;if(!r.preserve?.length)continue;
    if(before&&!before.recipesUsed.includes(id))sources.set(id,r.preserve.flatMap(kind=>{const source=token(before!,kind);return source?[clone(source)]:[];}));
    const ownerKind=r.install?.target??r.out;
    const owner=ownerKind?token(st,ownerKind)??st.tokens.find(t=>t.incorporated.includes(ownerKind)):undefined;
    if(!owner||r.install&&owner.kind===r.install.target&&owner.slots[r.install.slot]!==r.install.component)continue;
    for(const source of sources.get(id)??[])preserveConstruction(r,owner,source);
   }
   before=st;
  }
  g.lifecycleVersion=2;
 }
 return resolveChapterEntry(s,g);
}
/** Presentation resize is not a counted game decision. Keep relative order. */
export function resizeGame(g:Game,width:number,s?:Scenario):Game{
 const w=Math.max(320,Math.min(s?.locationPlan?390:600,width));if(!Number.isFinite(w))throw Error('Invalid board width');
 const resize=(st:State)=>{const old=st.width;for(const t of st.tokens)t.x=52+(t.x-52)*(w-104)/(old-104);for(const p of st.hotspots)p.x=s?.locationPlan?57+(p.x-57)*(w-114)/(old-114):52+(p.x-52)*(w-104)/(old-104);st.width=w;};
 const out=clone(g);resize(out.state);out.history.forEach(resize);return out;
}

/** Lifetime effort is not erased by Undo; repeated reconstruction never inflates unique combinations. */
export function cumulativeMetrics(events:Event[]):Metrics{
 const accepted=events.filter(e=>e.accepted);return {attempts:events.length,accepted:accepted.length,combinations:new Set(accepted.flatMap(e=>e.recipe?[e.recipe]:[])).size,creations:new Set(accepted.flatMap(e=>e.created?[e.created]:[])).size,installations:new Set(accepted.filter(e=>e.installed).map(e=>e.recipe)).size,moves:accepted.filter(e=>e.action.type==='move'||e.action.type==='relocate'||e.action.type==='place'&&!e.action.hotspot).length,placements:accepted.filter(e=>e.action.type==='place'&&e.action.hotspot||e.action.type==='drop'&&e.action.target.startsWith('@')&&!e.recipe).length,advances:accepted.filter(e=>e.action.type==='advance').length,visits:accepted.filter(e=>e.action.type==='visit').length};
}
