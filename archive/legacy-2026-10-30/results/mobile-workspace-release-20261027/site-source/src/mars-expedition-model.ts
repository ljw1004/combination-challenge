/** Browser geometry and interaction adapter over the independently audited logical engine. */
import * as E from '../experiments/mars-remote-next/model.ts';
import type {RoverSlot} from '../experiments/mars-remote-next/content.ts';
export const SAVE_KEY='mars-expedition-checkpoint-v2', VERSION='mars-expedition-2';
export type Point={x:number;y:number};
export type Token=E.Token & Point;
export type State=Omit<E.State,'tokens'> & {tokens:Token[];places:Record<string,Point>};
export type Action={type:'combine';a:string;b:string;at?:string}|{type:'use-location';token:string;location:string}|{type:'place';token:string;location:string|null;x?:number;y?:number}|{type:'advance'};
export type Result={accepted:boolean;state:State;message:string;created?:string;updated?:string;installed?:{rover:string;slot:RoverSlot;retained:boolean};origin?:Point;recipe?:string;displaced?:string;moved?:string;nudged?:{id:string;from:Point}[]};
export type Play={version:1;state:State;history:State[];debug:string|null;notice:Omit<Result,'state'|'accepted'>|null;welcome:boolean;purpose:boolean};
export const concept=E.concept, hasCapability=E.hasCapability;
export const token=(s:State,id:string)=>s.tokens.find(t=>t.id===id);
export const level=(s:State)=>E.levels[s.level];
export const location=(id:string)=>E.locations.find(p=>p.id===id);
/** Presentation only: preserve every canonical token, including hidden achievements.
 * Check all future recipes and upgrades, not just currently available partners. */
export function visibleTokens(s:State){return s.tokens.filter(t=>{
 const made=(kind:string)=>s.tokens.some(t=>t.kind===kind)||s.retired.includes(kind);
 if(E.recipes.some(r=>(r.a===t.kind||r.b===t.kind)&&!made(r.result)&&!s.retired.includes(r.a)&&!s.retired.includes(r.b)))return true;
 const rover=s.tokens.find(t=>t.kind==='rover');
 if(t.kind==='rover'&&E.slots.some(slot=>slot.accepts.some(kind=>!s.retired.includes(kind)&&(!t.slots?.[slot.id]||(slot.id==='radio'&&t.slots.radio!==kind&&concept(t.slots.radio!).capabilities.every(c=>concept(kind).capabilities.includes(c)))))))return true;
 if(E.slots.some(slot=>slot.accepts.includes(t.kind)&&(!rover?.slots?.[slot.id]||(slot.id==='radio'&&rover.slots.radio!==t.kind&&concept(rover.slots.radio!).capabilities.every(c=>concept(t.kind).capabilities.includes(c))))))return true;
 return E.goals.some(g=>!s.achieved.includes(g.id)&&(g.concept===t.kind||(g.capability&&hasCapability(t,g.capability))||(g.requires??[]).some(cap=>hasCapability(t,cap))));
 });}
export const caches=[
 {label:'Lander wreck · emergency salvage',story:'You are outside the damaged lander. Emergency electronics, a portable lamp and workshop salvage survived beside the hatch. Repair a radio or build a directed optical signal.',items:['broken-radio','cable','solar-panel','battery','lamp','foil','frame','tripod','toolkit']},
 {label:'Habitat locker · living and lab supplies',story:'Contact restored: Mission Control guides you into the nearby habitat. Its locker holds water, growing and repair equipment, together with a small sampling and contained-work kit.',items:['heater','water-filter','canister','seeds','planting-tray','clear-cover','habitat-fabric','sealant','scoop','sample-jar','sealed-box','gloves']},
 {label:'Cargo sled · vehicle and survey equipment',story:'Beyond the habitat you recover the lander’s cargo sled: vehicle parts, a dish and a mixed survey kit with spare optics.',items:['wheels','motor','dish','map','binoculars','camera','lens','tube']},
 {label:'Distant lookout · a new view',story:'Your mapped route leads to a distant lookout. Use the equipment you have recovered to record the cliff and bring back observations.',items:[]}
];
export const roverSlots=(t:Pick<Token,'kind'|'slots'>)=>t.kind==='rover'?E.slots.filter(slot=>slot.id!=='wheels'&&(slot.required||!!t.slots?.[slot.id])).map(slot=>({...slot,label:t.slots?.[slot.id]?concept(t.slots[slot.id]!).label:slot.label,filled:!!t.slots?.[slot.id]})):[];
export const tokenSize=(t:Pick<Token,'kind'|'slots'>)=>({width:10,height:t.kind==='rover'?6+3*roverSlots(t).length:6});
export const WORLD_UNIT=10, WORLD_WIDTH=36;
export function worldSize(s:State){return {width:WORLD_WIDTH,height:Math.max(1,...visibleTokens(s).filter(t=>!t.location).map(t=>t.y+tokenSize(t).height/2+2),...Object.entries(s.places).filter(([id])=>s.revealed.includes(id)).map(([,p])=>p.y+10))};}
/** Native vertical pan on blank space; a held card travels at either vertical edge. */
export function edgePan(_x:number,y:number,r:{left:number;top:number;width:number;height:number}){const band=Math.min(80,r.height/4),speed=y<r.top+band?-Math.ceil(18*Math.min(1,(r.top+band-y)/band)):y>r.top+r.height-band?Math.ceil(18*Math.min(1,(y-r.top-r.height+band)/band)):0;return {x:0,y:speed};}
export const mapPositions=(s:State)=>s.places;
function point(s:State,t:Token):Point{return t.location?s.places[t.location]:t;}
function revealPlaces(s:State){for(const id of s.revealed)if(!s.places[id])s.places[id]={x:18,y:Math.max(28,...visibleTokens(s).map(t=>t.y+18),...Object.values(s.places).map(p=>p.y+22))};}
function grantCache(s:State,index:number){const originals=E.create().tokens;const start=Math.max(6,...visibleTokens(s).map(t=>t.y+12),...Object.values(s.places).map(p=>p.y+18));for(const [i,kind] of caches[index].items.entries()){
 const original=originals.find(t=>t.kind===kind)!;
 if(!original||s.tokens.some(t=>t.kind===kind)||s.retired.includes(kind))continue;
 s.tokens.push({...original,x:5.5+(i%3)*12.5,y:start+Math.floor(i/3)*9});if(!s.known.includes(kind))s.known.push(kind);
 }}
export function createNamed():State{const base=E.create(),s:State={...base,tokens:[],known:[],places:{}};grantCache(s,0);revealPlaces(s);return s;}
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
 const result=E.step(state,logical);if(!result.accepted)return {...result,state,message:result.message.includes('duplicate')?'We already have that.':'Not quite. Try another pairing.'};
 const s=result.state as State, origin=b?point(state,b):action.type==='use-location'?s.places[action.location]:undefined;
 const added=s.tokens.find(t=>!token(state,t.id));
 if(added)Object.assign(added,{x:Math.max(6,Math.min(30,(origin?.x??18)+3)),y:(origin?.y??12)+8});
 if(action.type==='advance')grantCache(s,s.level);revealPlaces(s);
 if(action.type==='place'){
 const t=token(s,a!.id)!;
 if(action.location===null&&action.x!==undefined&&action.y!==undefined){if(!Number.isFinite(action.x)||!Number.isFinite(action.y))throw Error('Invalid board position.');Object.assign(t,{x:Math.max(6,Math.min(30,action.x)),y:Math.max(6,action.y)});}
 for(const old of state.tokens.filter(t=>t.location&&t.id!==a!.id)){const now=token(s,old.id);if(now&&!now.location)Object.assign(now,{x:old.x,y:old.y});}
 }
 const rover=s.tokens.find(t=>t.kind==='rover'),oldRover=state.tokens.find(t=>t.kind==='rover');
 const slot=rover&&oldRover?E.slots.find(slot=>rover.slots?.[slot.id]!==oldRover.slots?.[slot.id]):undefined;
 const removed=state.tokens.filter(t=>!token(s,t.id));
 const message=added?`${concept(added.kind).label}. ${removed.length?removed.map(t=>concept(t.kind).label).join(', ')+' is part of it now.':''}`:slot&&rover?`${concept(rover.slots![slot.id]!).label} fitted. ${removed.length?'Safely inside.':'Keep the spare handy.'} ${E.hasCapability(rover,'solar-travel')?'Ready to roll.':''}`:action.type==='place'?'That should do here.':action.type==='advance'?'Mission Control: We have your next task.':result.message;
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
export function restore(raw:string|null):Play{try{const p=JSON.parse(raw??'null');if(p?.version!==1||!p.state?.places||!Array.isArray(p.state.tokens)||!Array.isArray(p.history)||typeof p.purpose!=='boolean'||!E.levels[p.state.level])return fresh();if(p.state.tokens.some((t:Token)=>!E.concepts.some(c=>c.id===t.kind)||!Number.isFinite(t.x)||!Number.isFinite(t.y)))return fresh();return p;}catch{return fresh();}}
// Replayed expedition checkpoints: never grant outputs or achievements.
export const fixtures=[{id:'home',label:'Living foothold · arrival'},{id:'expedition',label:'Expedition · arrival'},{id:'observations',label:'Observations · arrival'},{id:'complete',label:'Observations · complete'}];
export function debugJump(id:string):Play{if(!fixtures.some(f=>f.id===id))throw Error('Unknown checkpoint');let p=fresh();p.welcome=false;const act=(a:Action)=>{const r=stepNamed(p.state,a);if(!r.accepted)throw Error('Checkpoint: '+r.message);p=apply(p,a);};const find=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;const c=(a:string,b:string)=>act(gestureAction(p.state,find(a),b.startsWith('place:')?b:find(b))),place=(k:string,location:string)=>act({type:'place',token:find(k),location});
 c('broken-radio','cable');c('solar-panel','battery');c('solar-charger','radio');place('solar-radio','contact-ridge');act({type:'advance'});
 if(id!=='home'){place('canister','glacier');c('heater','canister');c('meltwater-canister','water-filter');c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');act({type:'advance'});}
 if(id==='observations'||id==='complete'){c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');c('long-range-radio','rover');place('map','overlook');c('binoculars','map');act({type:'advance'});}
 if(id==='complete'){c('scoop','place:glacier');c('ice-sample','sample-jar');c('sealed-ice-sample','camera');c('lens','tube');c('telescope','tripod');c('field-telescope','camera');c('telescope-camera','place:distant-lookout');c('cliff-photograph','survey-map');}
 return {...p,history:[],debug:fixtures.find(f=>f.id===id)!.label,notice:null,purpose:true};}
