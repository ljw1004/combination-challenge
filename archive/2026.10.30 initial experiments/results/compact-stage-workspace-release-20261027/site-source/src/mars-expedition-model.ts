/** Browser geometry and interaction adapter over the independently audited logical engine. */
import * as E from '../experiments/mars-remote-next/model.ts';
import type {RoverSlot} from '../experiments/mars-remote-next/content.ts';
export const SAVE_KEY='mars-expedition-checkpoint-v3', VERSION='mars-expedition-3';
export type Point={x:number;y:number};
export type Token=E.Token & Point;
export type State=Omit<E.State,'tokens'> & {tokens:Token[];places:Record<string,Point>;areas:{level:number;top:number}[]};
export type Action=({type:'combine';a:string;b:string;at?:string}|{type:'use-location';token:string;location:string}|{type:'place';token:string;location:string|null;x?:number;y?:number}|{type:'advance'}) & {boardWidth?:number};
export type Result={accepted:boolean;state:State;message:string;created?:string;updated?:string;installed?:{rover:string;slot:RoverSlot;retained:boolean};origin?:Point;recipe?:string;displaced?:string;moved?:string;nudged?:{id:string;from:Point}[]};
export type Play={version:1;state:State;history:State[];debug:string|null;notice:Omit<Result,'state'|'accepted'>|null;welcome:boolean;purpose:boolean};
export const concept=E.concept, hasCapability=E.hasCapability;
export const token=(s:State,id:string)=>s.tokens.find(t=>t.id===id);
export const level=(s:State)=>E.levels[s.level];
export const location=(id:string)=>E.locations.find(p=>p.id===id);
/** Tangible survivors never disappear. Future usefulness only decides what travels. */
export const visibleTokens=(s:State)=>s.tokens;
export function carryTokens(s:State,nextLevel=s.level){return s.tokens.filter(t=>{
 const made=(kind:string)=>s.tokens.some(t=>t.kind===kind)||s.retired.includes(kind);
 if(E.recipes.some(r=>(r.a===t.kind||r.b===t.kind)&&!made(r.result)&&!s.retired.includes(r.a)&&!s.retired.includes(r.b)))return true;
 const rover=s.tokens.find(t=>t.kind==='rover');
 if(t.kind==='rover'&&E.slots.some(slot=>slot.accepts.some(kind=>!s.retired.includes(kind)&&(!t.slots?.[slot.id]||(slot.id==='radio'&&t.slots.radio!==kind&&concept(t.slots.radio!).capabilities.every(c=>concept(kind).capabilities.includes(c)))))))return true;
 if(E.slots.some(slot=>slot.accepts.includes(t.kind)&&(!rover?.slots?.[slot.id]||(slot.id==='radio'&&rover.slots.radio!==t.kind&&concept(rover.slots.radio!).capabilities.every(c=>concept(t.kind).capabilities.includes(c))))))return true;
 return E.goals.some(g=>E.levels.slice(nextLevel).some(l=>l.goals.includes(g.id))&&(g.concept===t.kind||(g.capability&&hasCapability(t,g.capability))||(g.requires??[]).some(cap=>hasCapability(t,cap))));
 });}
export const caches=[
 {label:'Lander wreck · emergency salvage',story:'You are outside the damaged lander. Emergency electronics, a portable lamp and workshop salvage survived beside the hatch. Repair a radio or build a directed optical signal.',items:['broken-radio','cable','solar-panel','battery','lamp','foil','frame','tripod','toolkit']},
 {label:'Habitat locker · living and lab supplies',story:'Contact restored: Mission Control guides you into the nearby habitat. Its locker holds water, growing and repair equipment, together with a small sampling and contained-work kit.',items:['heater','water-filter','canister','seeds','planting-tray','clear-cover','habitat-fabric','sealant','scoop','sample-jar','sealed-box','gloves']},
 {label:'Cargo sled · vehicle and survey equipment',story:'Beyond the habitat you recover the lander’s cargo sled: vehicle parts, a dish and a mixed survey kit with spare optics.',items:['wheels','motor','dish','map','binoculars','camera','lens','tube']},
 {label:'Distant lookout · a new view',story:'Your mapped route leads to a distant lookout. A fresh ice outcrop lies beside this viewpoint. Collect a specimen here and use your recovered equipment to record the cliff.',items:[]}
];
export const roverSlots=(t:Pick<Token,'kind'|'slots'>)=>t.kind==='rover'?E.slots.filter(slot=>slot.id!=='wheels'&&(slot.required||!!t.slots?.[slot.id])).map(slot=>({...slot,label:t.slots?.[slot.id]?concept(t.slots[slot.id]!).label:slot.label,filled:!!t.slots?.[slot.id]})):[];
export const tokenSize=(t:Pick<Token,'kind'|'slots'>)=>({width:10.8,height:t.kind==='rover'?4.4+2.1*roverSlots(t).length:4.4});
export const WORLD_UNIT=10, WORLD_WIDTH=36;
export function locationSize(s:State,id:string){const occupant=s.tokens.find(t=>t.location===id&&t.kind==='rover');return {width:occupant?11.7:10.8,height:occupant?Math.max(7,tokenSize(occupant).height+1.6):7};}
export function worldSize(s:State){return {width:WORLD_WIDTH,height:Math.max(1,...s.tokens.filter(t=>!t.location).map(t=>t.y+tokenSize(t).height/2+2),...Object.entries(s.places).filter(([id])=>s.revealed.includes(id)).map(([id,p])=>p.y+locationSize(s,id).height/2+2))};}
export const currentAreaHeight=(s:State)=>(worldSize(s).height-areaTop(s))*WORLD_UNIT;
/** Native vertical pan on blank space; a held card travels at either vertical edge. */
export function edgePan(_x:number,y:number,r:{left:number;top:number;width:number;height:number}){const band=Math.min(80,r.height/4),speed=y<r.top+band?-Math.ceil(18*Math.min(1,(r.top+band-y)/band)):y>r.top+r.height-band?Math.ceil(18*Math.min(1,(y-r.top-r.height+band)/band)):0;return {x:0,y:speed};}
export const mapPositions=(s:State)=>s.places;
function point(s:State,t:Token):Point{return t.location?s.places[t.location]:t;}
export const areaTop=(s:State)=>s.areas.at(-1)?.top??0;
/** Fill gaps with new salvage only. Existing pieces are never individually repacked. */
function availablePoint(s:State,width=10.8,height=4.4):Point{
 for(let row=0;row<10000;row++)for(const x of [6,18,30]){
  const p={x,y:areaTop(s)+3+row*.2};
  const occupied=s.tokens.map(t=>({p:point(s,t),size:tokenSize(t)})).concat(Object.entries(s.places).map(([id,p])=>({p,size:locationSize(s,id)})));
  if(occupied.every(q=>Math.abs(p.x-q.p.x)>=(width+q.size.width)/2+.2-1e-6||Math.abs(p.y-q.p.y)>=(height+q.size.height)/2+.2-1e-6))return p;
 }
 throw Error('Board extent exceeded.');
}
function revealPlaces(s:State){for(const id of s.revealed)if(!s.places[id])s.places[id]=availablePoint(s,10.8,7);}
function grantCache(s:State,index:number){const originals=E.create().tokens;for(const kind of caches[index].items){
 const original=originals.find(t=>t.kind===kind)!;
 if(!original||s.tokens.some(t=>t.kind===kind)||s.retired.includes(kind))continue;
 s.tokens.push({...original,...availablePoint(s)});if(!s.known.includes(kind))s.known.push(kind);
 }}
/** Shared translation, compacting only empty bands without introducing overlaps. */
function nextArea(s:State){
 const carried=carryTokens(s),top=worldSize(s).height+2;
 const origins=carried.map(t=>({t,p:point(s,t)}));
 const min=origins.length?Math.min(...origins.map(({p})=>p.y)):0;
 // One shared monotonic map removes only genuinely empty horizontal bands.
 // It cannot introduce a new vertical overlap or shuffle a user's ordering.
 const intervals=origins.map(({t,p})=>({lo:p.y-tokenSize(t).height/2,hi:p.y+tokenSize(t).height/2})).sort((a,b)=>a.lo-b.lo);
 const gaps:{end:number;amount:number}[]=[];let end=intervals[0]?.hi??0;
 for(const i of intervals){if(i.lo>end+.2)gaps.push({end:i.lo,amount:i.lo-end-.2});end=Math.max(end,i.hi);}
 const compact=(y:number)=>y-gaps.filter(g=>g.end<=y).reduce((sum,g)=>sum+g.amount,0);
 const minCompact=origins.length?Math.min(...origins.map(({t,p})=>compact(p.y)-tokenSize(t).height/2)):0;
 s.areas.push({level:s.level,top});
 for(const {t,p} of origins){t.x=p.x;t.y=top+.8+compact(p.y)-minCompact;t.location=null;}
 grantCache(s,s.level);revealPlaces(s);
}
/** Creation stays attached to its target visually. Crowding permits a small,
 * least-bad overlap rather than sending the result away across the board. */
function birthPoint(s:State,t:Token,anchor:Point,targetSize={width:10.8,height:4.4},boardWidth=320):Point{
 const widthScale=320/Math.max(320,boardWidth),size={...tokenSize(t),width:10.8*widthScale};targetSize={...targetSize,width:targetSize.width*widthScale};const others=s.tokens.filter(q=>q.id!==t.id).map(q=>({p:point(s,q),size:{...tokenSize(q),width:10.8*widthScale}})).concat(Object.entries(s.places).map(([id,p])=>({p,size:{...locationSize(s,id),width:locationSize(s,id).width*widthScale}})));
 const localTop=s.areas.filter(a=>a.top<=anchor.y).at(-1)?.top??0;
 const dx=(size.width+targetSize.width)/2+.15,dy=(size.height+targetSize.height)/2+.15;
 const candidates:Point[]=[[1,1],[-1,1],[1,-1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]].map(([x,y])=>({x:Math.max(size.width/2+.3,Math.min(WORLD_WIDTH-size.width/2-.3,anchor.x+x*dx)),y:Math.max(localTop+size.height/2+.3,anchor.y+y*dy)}));
 const overlap=(p:Point)=>others.reduce((sum,q)=>sum+Math.max(0,(size.width+q.size.width)/2-Math.abs(p.x-q.p.x))*Math.max(0,(size.height+q.size.height)/2-Math.abs(p.y-q.p.y)),0);
 candidates.sort((a,b)=>Math.hypot(a.x-anchor.x,a.y-anchor.y)-Math.hypot(b.x-anchor.x,b.y-anchor.y));
 return candidates.find(p=>overlap(p)<1e-6)??candidates.reduce((best,p)=>overlap(p)<overlap(best)?p:best);
}
export function createNamed():State{const base=E.create(),s:State={...base,tokens:[],known:[],places:{},areas:[{level:0,top:0}]};grantCache(s,0);revealPlaces(s);return s;}
export type GoalCondition={id:string;label:string;satisfied:boolean;witnesses:string[];place?:string};
const conditionNames:Record<string,string>={'working-radio':'Repair a working radio','stored-water':'Store water in a closed canister','protected-growth':'Protect a living plant tray','pressure-repair':'Make a habitat pressure patch','solar-travel':'Fit Rover with motor and solar charger','long-range-radio':'Prepare long-range radio communication','route-map':'Make a map from route observations','stored-sample':'Seal an ice specimen in a jar','sample-record':'Photograph the ice specimen','annotated-route':'Add a distant cliff photograph to the survey map'};
export function goalConditions(s:State,index=s.level):GoalCondition[]{return E.levels[index].goals.flatMap(id=>{
 const g=E.goals.find(g=>g.id===id)!;
 if(g.kind==='function')return (g.requires??[]).map(cap=>{const witnesses=s.tokens.filter(t=>hasCapability(t,cap)).map(t=>t.id);return {id:id+':'+cap,label:conditionNames[cap]??cap,satisfied:!!witnesses.length,witnesses};});
 const witnesses=s.tokens.filter(t=>g.kind==='place'?t.location===g.location&&(g.capability?hasCapability(t,g.capability):t.kind===g.concept):t.kind===g.concept).map(t=>t.id);
 return [{id,label:g.id==='contact'?'Place a powered radio or optical beacon on Contact ridge':g.requirement,satisfied:E.satisfiesGoal(s,g),witnesses,...g.kind==='place'?{place:g.location}:{}}];
 });}
/** Gold denotes only an actually satisfied condition in this stage. */
export function goalWitnesses(s:State){const done=goalConditions(s).filter(c=>c.satisfied);return {tokens:new Set(done.flatMap(c=>c.witnesses)),places:new Set(done.filter(c=>c.place).map(c=>c.place!))};}
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
 const s=result.state as State, origin=b?{...point(state,b),y:point(state,b).y+(b.location?locationSize(state,b.location).height*.16:0)}:action.type==='use-location'?s.places[action.location]:undefined;
 const added=s.tokens.find(t=>!token(state,t.id));
 if(added)Object.assign(added,birthPoint(s,added,origin??{x:18,y:areaTop(s)+3},b?tokenSize(b):action.type==='use-location'?locationSize(state,action.location):undefined,action.boardWidth));
 if(action.type==='advance')nextArea(s);else revealPlaces(s);
 if(action.type==='place'){
 const t=token(s,a!.id)!;
 if(action.location===null&&action.x!==undefined&&action.y!==undefined){if(!Number.isFinite(action.x)||!Number.isFinite(action.y))throw Error('Invalid board position.');Object.assign(t,{x:Math.max(6,Math.min(30,action.x)),y:Math.max(6,action.y)});}
 for(const old of state.tokens.filter(t=>t.location&&t.id!==a!.id)){const now=token(s,old.id);if(now&&!now.location)Object.assign(now,{x:old.x,y:old.y});}
 }
 const rover=s.tokens.find(t=>t.kind==='rover'),oldRover=state.tokens.find(t=>t.kind==='rover');
 const slot=rover&&oldRover?E.slots.find(slot=>rover.slots?.[slot.id]!==oldRover.slots?.[slot.id]):undefined;
 const removed=state.tokens.filter(t=>!token(s,t.id));
 const message=added?`${concept(added.kind).label}. ${removed.length?removed.map(t=>concept(t.kind).label).join(', ')+' is part of it now.':''}`:slot&&rover?`${concept(rover.slots![slot.id]!).label} fitted. ${removed.length?'Safely inside.':'Keep the spare handy.'} ${E.hasCapability(rover,'solar-travel')?'Ready to roll.':''}`:action.type==='place'?'That should do here.':action.type==='advance'?'We’re taking what we need with us. Finished work stays behind — scroll back any time.':result.message;
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
export function restore(raw:string|null):Play{try{const p=JSON.parse(raw??'null');if(p?.version!==1||!p.state?.places||!Array.isArray(p.state.areas)||!Array.isArray(p.state.tokens)||!Array.isArray(p.history)||typeof p.purpose!=='boolean'||!E.levels[p.state.level])return fresh();if(p.state.tokens.some((t:Token)=>!E.concepts.some(c=>c.id===t.kind)||!Number.isFinite(t.x)||!Number.isFinite(t.y)))return fresh();return p;}catch{return fresh();}}
// Replayed expedition checkpoints: never grant outputs or achievements.
export const fixtures=[{id:'home',label:'Living foothold · arrival'},{id:'expedition',label:'Expedition · arrival'},{id:'observations',label:'Observations · arrival'},{id:'complete',label:'Observations · complete'}];
export function debugJump(id:string):Play{if(!fixtures.some(f=>f.id===id))throw Error('Unknown checkpoint');let p=fresh();p.welcome=false;const act=(a:Action)=>{const r=stepNamed(p.state,a);if(!r.accepted)throw Error('Checkpoint: '+r.message);p=apply(p,a);};const find=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;const c=(a:string,b:string)=>act(gestureAction(p.state,find(a),b.startsWith('place:')?b:find(b))),place=(k:string,location:string)=>act({type:'place',token:find(k),location});
 c('broken-radio','cable');c('solar-panel','battery');c('solar-charger','radio');place('solar-radio','contact-ridge');act({type:'advance'});
 if(id!=='home'){place('canister','glacier');c('heater','canister');c('meltwater-canister','water-filter');c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');act({type:'advance'});}
 if(id==='observations'||id==='complete'){c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');c('long-range-radio','rover');place('map','overlook');c('binoculars','map');act({type:'advance'});}
 if(id==='complete'){c('scoop','place:lookout-ice');c('ice-sample','sample-jar');c('sealed-ice-sample','camera');c('lens','tube');c('telescope','tripod');c('field-telescope','camera');c('telescope-camera','place:distant-lookout');c('cliff-photograph','survey-map');}
 return {...p,history:[],debug:fixtures.find(f=>f.id===id)!.label,notice:null,purpose:true};}
