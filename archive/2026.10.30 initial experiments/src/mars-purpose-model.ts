/** Browser geometry and interaction adapter over the independently audited logical engine. */
import * as E from '../experiments/mars-next/model.ts';
import type {RoverSlot} from '../experiments/mars-next/content.ts';
export const SAVE_KEY='mars-purpose-checkpoint-v1', VERSION='mars-purpose-1';
export type Point={x:number;y:number};
export type Token=E.Token & Point;
export type State=Omit<E.State,'tokens'> & {tokens:Token[]};
export type Action={type:'combine';a:string;b:string;at?:string}|{type:'use-location';token:string;location:string}|{type:'place';token:string;location:string|null;x?:number;y?:number}|{type:'advance'};
export type Result={accepted:boolean;state:State;message:string;created?:string;updated?:string;installed?:{rover:string;slot:RoverSlot;retained:boolean};origin?:Point;recipe?:string;displaced?:string;moved?:string;nudged?:{id:string;from:Point}[]};
export type Play={version:1;state:State;history:State[];debug:string|null;notice:Omit<Result,'state'|'accepted'>|null;welcome:boolean;purpose:boolean};
export const concept=E.concept, hasCapability=E.hasCapability;
export const token=(s:State,id:string)=>s.tokens.find(t=>t.id===id);
export const level=(s:State)=>E.levels[s.level];
export const location=(id:string)=>E.locations.find(p=>p.id===id);
export const visibleTokens=(s:State)=>s.tokens;
export const roverSlots=(t:Pick<Token,'kind'|'slots'>)=>t.kind==='rover'?E.slots.filter(slot=>slot.id!=='wheels'&&(slot.required||!!t.slots?.[slot.id])).map(slot=>({...slot,label:t.slots?.[slot.id]?concept(t.slots[slot.id]!).label:slot.label,filled:!!t.slots?.[slot.id]})):[];
export const tokenSize=(t:Pick<Token,'kind'|'slots'>)=>({width:10,height:t.kind==='rover'?6+3*roverSlots(t).length:6});
// Reserve all future locations from the beginning: reveals never move older things.
const positions:Record<string,Point>={'contact-ridge':{x:83,y:25},glacier:{x:20,y:78},'warm-habitat':{x:57,y:78}};
export const mapPositions=(_s:State)=>positions;
function point(s:State,t:Token):Point{return t.location?positions[t.location]:t;}
function collision(a:Point,as:{width:number;height:number},b:Point,bs:{width:number;height:number},gap=.6){return Math.abs(a.x-b.x)<(as.width+bs.width)/2+gap-1e-7&&Math.abs(a.y-b.y)<(as.height+bs.height)/2+gap-1e-7;}
function locationBounds(s:State){return Object.entries(mapPositions(s)).map(([id,p])=>{const occupant=s.tokens.find(t=>t.location===id),size=occupant?tokenSize(occupant):{width:0,height:0};return {point:p,size:{width:Math.max(12,size.width+2),height:Math.max(16,size.height+2)}};});}
function candidates(s:State,size:{width:number;height:number}):Point[]{const points:Point[]=[],bounds=locationBounds(s);for(let y=Math.max(12,(size.width===20?30:size.height)/2+2);y<=Math.min(93,98-(size.width===20?30:size.height)/2);y+=2)for(let x=Math.max(8,size.width/2+2);x<=Math.min(92,98-size.width/2);x+=2)if(bounds.every(p=>!collision({x,y},size,p.point,p.size,0)))points.push({x,y});return points;}
function freePoint(s:State,preferred:Point={x:50,y:52},ignore?:string,shape:Pick<Token,'kind'|'slots'>={kind:''}):Point{const size=tokenSize(shape),occupied=s.tokens.filter(t=>t.id!==ignore&&!t.location);const found=candidates(s,size).sort((a,b)=>Math.hypot(a.x-preferred.x,a.y-preferred.y)-Math.hypot(b.x-preferred.x,b.y-preferred.y)).find(p=>occupied.every(t=>!collision(p,size,t,tokenSize(t))));if(!found)throw Error('Move a few loose things apart to make room.');return found;}
/** Variable-card geometry: reserve the real Rover footprint, never an invisible ordinary-card proxy. */
function nearbyGap(s:State,preferred:Point,anchor:Point,ignore?:string,fixed:string[]=[],movementOrigins?:Map<string,Point>,shape:Pick<Token,'kind'|'slots'>={kind:''}):Point{
 const size=tokenSize(shape),radius=shape.kind==='rover'?42:32;
 const anchored=s.tokens.find(t=>fixed.includes(t.id)&&point(s,t).x===anchor.x&&point(s,t).y===anchor.y),as=anchored?tokenSize(anchored):{width:12,height:16},dx=(size.width+as.width)/2+.6,dy=(size.height+as.height)/2+.6;
 const adjacent=[...Array.from({length:Math.floor(dy)},(_,i)=>i-Math.floor(dy/2)).flatMap(offset=>[{x:anchor.x-dx,y:anchor.y+offset},{x:anchor.x+dx,y:anchor.y+offset}]),...Array.from({length:Math.floor(dx)},(_,i)=>i-Math.floor(dx/2)).flatMap(offset=>[{x:anchor.x+offset,y:anchor.y-dy},{x:anchor.x+offset,y:anchor.y+dy}])].filter(p=>p.x>=Math.max(8,size.width/2+2)&&p.x<=Math.min(92,98-size.width/2)&&p.y>=Math.max(12,(size.width===20?30:size.height)/2+2)&&p.y<=Math.min(93,98-(size.width===20?30:size.height)/2)&&locationBounds(s).every(q=>!collision(p,size,q.point,q.size,0)));
 const spots=[...adjacent,...candidates(s,size)].filter(p=>Math.hypot(p.x-anchor.x,p.y-anchor.y)<=radius).sort((a,b)=>Number(!adjacent.includes(a))-Number(!adjacent.includes(b))||Math.hypot(a.x-anchor.x,a.y-anchor.y)-Math.hypot(b.x-anchor.x,b.y-anchor.y)||Math.hypot(a.x-preferred.x,a.y-preferred.y)-Math.hypot(b.x-preferred.x,b.y-preferred.y));
 const movable=()=>s.tokens.filter(t=>!t.location&&t.id!==ignore);
 const moveAside=(t:Token,reserved:{point:Point;size:{width:number;height:number}}[],visited:Set<string>,depth:number):boolean=>{
  if(fixed.includes(t.id)||visited.has(t.id))return false;const ts=tokenSize(t),origin=movementOrigins?.get(t.id)??t,old={x:t.x,y:t.y};
  const ps=candidates(s,ts).filter(p=>Math.hypot(p.x-origin.x,p.y-origin.y)<=40&&reserved.every(r=>!collision(p,ts,r.point,r.size))).sort((a,b)=>Math.hypot(a.x-old.x,a.y-old.y)-Math.hypot(b.x-old.x,b.y-old.y));
  for(const p of ps){if(movable().every(o=>o.id===t.id||!collision(p,ts,o,tokenSize(o)))){Object.assign(t,p);return true;}}
  if(!depth)return false;for(const p of ps.slice(0,24)){const blockers=movable().filter(o=>o.id!==t.id&&collision(p,ts,o,tokenSize(o)));if(blockers.length>3||blockers.some(o=>fixed.includes(o.id)||visited.has(o.id)))continue;const backup=s.tokens.map(o=>({id:o.id,x:o.x,y:o.y}));if(blockers.every(o=>moveAside(o,[...reserved,{point:p,size:ts}],new Set([...visited,t.id]),depth-1))){Object.assign(t,p);return true;}for(const old of backup)Object.assign(token(s,old.id)!,{x:old.x,y:old.y});}return false;
 };
 for(const p of spots){const blockers=movable().filter(t=>collision(p,size,t,tokenSize(t)));if(!blockers.length)return p;if(blockers.length>5||blockers.some(t=>fixed.includes(t.id)))continue;const backup=s.tokens.map(t=>({id:t.id,x:t.x,y:t.y}));if(blockers.every(t=>moveAside(t,[{point:p,size}],new Set(),5)))return p;for(const old of backup)Object.assign(token(s,old.id)!,{x:old.x,y:old.y});}throw Error('There is no safe nearby space yet. Move a few loose things apart and try again.');
}

export function createNamed():State{const base=E.create(),s:State={...base,tokens:[]};for(const t of base.tokens)s.tokens.push({...t,...freePoint(s,{x:20+(s.tokens.length%5)*14,y:18+Math.floor(s.tokens.length/5)*13})});return s;}
export function goalStates(s:State,index=s.level){return E.levels[index].goals.map(id=>{const g=E.goals.find(g=>g.id===id)!;return {...g,current:E.satisfiesGoal(s,g),achieved:s.achieved.includes(id)};});}
export function stepNamed(state:State,action:Action):Result{
 try{
 const a=action.type==='combine'?token(state,action.a):action.type==='place'||action.type==='use-location'?token(state,action.token):undefined;
 const b=action.type==='combine'?token(state,action.b):undefined;
 let logical:E.Action;
 if(action.type==='advance')logical=action;
 else {if(!a)throw Error('Choose an available thing.');
 if(action.type==='place')logical={type:'place',kind:a.kind,location:action.location};
 else logical={type:'combine',a:a.kind,b:action.type==='use-location'?'place:'+action.location:b?.kind??action.b,...action.type==='combine'&&action.at?{at:action.at}:{}};}
 const result=E.step(state,logical);if(!result.accepted)return {...result,state};
 const s=result.state as State, origin=b?point(state,b):action.type==='use-location'?positions[action.location]:undefined;
 const added=s.tokens.find(t=>!token(state,t.id));
 if(added)Object.assign(added,nearbyGap(s,origin!,origin!,added.id,[a!.id,...b?[b.id]:[]],undefined,added));
 if(action.type==='place'){
 const t=token(s,a!.id)!;
 if(action.location===null&&action.x!==undefined&&action.y!==undefined){if(!Number.isFinite(action.x)||!Number.isFinite(action.y))throw Error('Invalid board position.');Object.assign(t,{x:Math.max(8,Math.min(92,action.x)),y:Math.max(12,Math.min(93,action.y))});}
 for(const old of state.tokens.filter(t=>t.location&&t.id!==a!.id)){const now=token(s,old.id);if(now&&!now.location)Object.assign(now,freePoint(s,old,old.id,old));}
 }
 const rover=s.tokens.find(t=>t.kind==='rover'),oldRover=state.tokens.find(t=>t.kind==='rover');
 const slot=rover&&oldRover?E.slots.find(slot=>rover.slots?.[slot.id]!==oldRover.slots?.[slot.id]):undefined;
 if(slot&&rover){const rp=point(s,rover);for(const t of s.tokens.filter(t=>t.id!==rover.id&&!t.location&&collision(rp,tokenSize(rover),t,tokenSize(t)))){if(t.id===a?.id||t.id===b?.id)throw Error('Move Rover away from that part before installing it.');Object.assign(t,freePoint(s,t,t.id,t));}}
 const removed=state.tokens.filter(t=>!token(s,t.id));
 const message=added?`${concept(added.kind).label} created. ${removed.length?removed.map(t=>concept(t.kind).label).join(', ')+' moved into its successor or assembly. ':''}Surviving inputs stay where they began.`:slot&&rover?`${concept(rover.slots![slot.id]!).label} installed in Rover. ${removed.length?'The part moved inside.':'A reusable copy stays outside for another use.'} ${E.hasCapability(rover,'solar-travel')?'Ready to drive.':'Not ready to drive. Explore the remaining spaces.'}`:result.message;
 const nudged=s.tokens.flatMap(t=>{const old=token(state,t.id);return old&&!old.location&&!t.location&&(t.x!==old.x||t.y!==old.y)&&!(action.type==='place'&&t.id===action.token)?[{id:t.id,from:{x:old.x,y:old.y}}]:[];});
 return {accepted:true,state:s,message,recipe:result.recipe,created:added?.id,origin,updated:slot?rover?.id:undefined,installed:slot&&rover?{rover:rover.id,slot:slot.id,retained:!!s.tokens.find(t=>t.kind===rover.slots![slot.id])}:undefined,nudged};
 }catch(e){return {accepted:false,state,message:(e as Error).message};}
}
export function creation(s:State,a:string,target:string){const r=stepNamed(s,target.startsWith('place:')?{type:'use-location',token:a,location:target.slice(6)}:{type:'combine',a,b:target});return r.accepted&&(r.created||r.updated)?r:null;}
/** First click/source moves onto second click/target. Never reverse a pair or invent context. */
export function gestureAction(s:State,a:string,target:string):Action{if(target.startsWith('place:'))return creation(s,a,target)?{type:'use-location',token:a,location:target.slice(6)}:{type:'place',token:a,location:target.slice(6)};return {type:'combine',a,b:target};}
export function compatibility(s:State,id:string){return [...s.tokens.filter(t=>t.id!==id).map(t=>t.id),...s.revealed.map(p=>'place:'+p)].map(other=>({id:other,outgoing:!!creation(s,id,other),incoming:!other.startsWith('place:')&&!!creation(s,other,id)})).filter(p=>p.outgoing||p.incoming);}
/** A setting hint is a placement opportunity, never a creation promise.
 * Only a newly enabled explicit-context recipe counts, not ordinary recipes that
 * happen to remain legal after moving. Actual target placement still owns context. */
export function settingPlaces(s:State,id:string):string[]{
 const target=token(s,id);if(!target)return [];
 return s.revealed.filter(place=>{
  if(target.location===place)return false;
  const placed=E.step(s,{type:'place',kind:target.kind,location:place});if(!placed.accepted)return false;
  return s.tokens.some(source=>{
   if(source.id===id)return false;
   const action:E.Action={type:'combine',a:source.kind,b:target.kind},after=E.step(placed.state,action);
   if(!after.accepted||!E.recipes.some(r=>r.id===after.recipe&&r.at===place))return false;
   const before=E.step(s,action);return !before.accepted||before.recipe!==after.recipe;
  });
 }).map(place=>'place:'+place);
}
export const novelPartners=(s:State,id:string)=>compatibility(s,id).filter(p=>p.outgoing).map(p=>p.id);
export const fresh=():Play=>({version:1,state:createNamed(),history:[],debug:null,notice:null,welcome:true,purpose:false});
export function apply(play:Play,action:Action):Play{const r=stepNamed(play.state,action);return r.accepted?{...play,state:r.state,history:[...play.history,play.state].slice(-30),notice:r,purpose:action.type==='advance'||play.purpose}:{...play,notice:r};}
export const undo=(p:Play):Play=>p.history.length?{...p,state:p.history.at(-1)!,history:p.history.slice(0,-1),notice:null,purpose:false}:p;
export function restore(raw:string|null):Play{try{const p=JSON.parse(raw??'null');if(p?.version!==1||!p.state||!Array.isArray(p.state.tokens)||!Array.isArray(p.history)||typeof p.purpose!=='boolean'||!E.levels[p.state.level])return fresh();if(p.state.tokens.some((t:Token)=>!E.concepts.some(c=>c.id===t.kind)||!Number.isFinite(t.x)||!Number.isFinite(t.y)))return fresh();return p;}catch{return fresh();}}
// Checkpoints replay actual adapter actions; no granted outputs or forged achievements.
const route:[string,string][]=[['broken-radio','cable'],['solar-panel','battery'],['solar-charger','radio'],['solar-radio','dish']];
export const fixtures=[{id:'home',label:'Living foothold · arrival'},{id:'growing',label:'Living foothold · growing'},{id:'expedition',label:'Beyond survival · arrival'},{id:'complete',label:'Beyond survival · complete'}];
export function debugJump(id:string):Play{if(!fixtures.some(f=>f.id===id))throw Error('Unknown checkpoint');let p=fresh();p.welcome=false;const act=(a:Action)=>{const r=stepNamed(p.state,a);if(!r.accepted)throw Error('Checkpoint: '+r.message);p=apply(p,a);};const find=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;const c=(a:string,b:string)=>act(gestureAction(p.state,find(a),b.startsWith('place:')?b:find(b)));for(const [a,b]of route)c(a,b);act({type:'place',token:find('long-range-radio'),location:'contact-ridge'});act({type:'advance'});
 if(id!=='home'){act({type:'place',token:find('canister'),location:'glacier'});c('heater','canister');c('meltwater-canister','water-filter');c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');}
 if(id==='expedition'||id==='complete'){c('habitat-fabric','sealant');act({type:'advance'});}
 if(id==='complete'){c('frame','propagator');c('frame','toolkit');c('solar-charger','lamp');c('workbench','solar-lamp');c('solar-charger','heater');c('frame','wheels');c('motor','rover');c('solar-charger','rover');c('long-range-radio','rover');}
 return {...p,history:[],debug:fixtures.find(f=>f.id===id)!.label,notice:null,purpose:true};}
