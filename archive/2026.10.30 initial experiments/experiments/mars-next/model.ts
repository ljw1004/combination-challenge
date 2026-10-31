/** Isolated v4 logical candidate. No deployed UI, geometry, save migration or frozen-host edits. */
import {NAMED_CONCEPTS as concepts,NAMED_RECIPES as recipes,NAMED_GOALS as goals,NAMED_LEVELS as levels,NAMED_LOCATIONS as locations,NAMED_STARTING_SUPPLIES as supplies,ROVER_SLOTS as slots} from './content.ts';
import type {NamedCapability,NamedGoal,NamedRecipe,RoverSlot} from './content.ts';
export type Token={id:string;kind:string;location:string|null;slots?:Partial<Record<RoverSlot,string>>};
export type State={tokens:Token[];known:string[];retired:string[];level:number;revealed:string[];achieved:string[];actions:number;nextId:number};
export type Action={type:'combine';a:string;b:string;at?:string}|{type:'place';kind:string;location:string|null}|{type:'advance'};
export const concept=(kind:string)=>concepts.find(c=>c.id===kind)!;
export function hasCapability(t:Token,cap:NamedCapability):boolean {
 if(t.kind!=='rover')return concept(t.kind).capabilities.includes(cap);
 const radio=t.slots?.radio,radioCaps=radio?concept(radio).capabilities:[],charger=t.slots?.charger==='solar-charger';
 if(cap==='solar-travel')return !!(charger&&t.slots?.engine==='motor'&&t.slots?.wheels==='wheels');
 if(cap==='working-radio'||cap==='long-range-radio')return radioCaps.includes(cap);
 if(cap==='solar-radio')return radioCaps.includes(cap)||(radioCaps.includes('working-radio')&&charger);
 return false;
}
export function satisfiesGoal(s:State,g:NamedGoal):boolean {
 if(g.kind==='discover')return s.known.includes(g.concept);
 if(g.kind==='function')return (g.requires??[]).every(cap=>s.tokens.some(t=>hasCapability(t,cap)));
 return s.tokens.some(t=>t.location===g.location&&(g.capability?hasCapability(t,g.capability):t.kind===g.concept));
}
function settle(s:State){for(const g of goals)if(satisfiesGoal(s,g)&&!s.achieved.includes(g.id))s.achieved.push(g.id);for(const id of levels[s.level].goals){const g=goals.find(g=>g.id===id)!;for(const loc of g.requiredLocations)if(!s.revealed.includes(loc))s.revealed.push(loc);if(!s.achieved.includes(id))break;}}
function add(s:State,kind:string){if(s.tokens.some(t=>t.kind===kind)||s.retired.includes(kind))throw Error('Already exists or was incorporated/evolved; no duplicate reconstruction.');const t:Token={id:`v4-${s.nextId++}`,kind,location:null,...kind==='rover'?{slots:{wheels:'wheels'}}:{}};s.tokens.push(t);if(!s.known.includes(kind))s.known.push(kind);return t;}
export function create():State{const s:State={tokens:[],known:[],retired:[],level:0,revealed:[],achieved:[],actions:0,nextId:1};for(const k of supplies)add(s,k);settle(s);return s;}
const pair=(r:NamedRecipe,a:string,b:string)=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a);
export function recipeFor(a:string,b:string,at?:string){return recipes.find(r=>pair(r,a,b)&&r.at===at)??recipes.find(r=>pair(r,a,b)&&!r.at);}
const exists=(s:State,k:string)=>s.tokens.some(t=>t.kind===k)||s.retired.includes(k);
/** Future compatible slots matter even before their chassis is built. No stock/depletion puzzle. */
export function hasFurtherUse(s:State,kind:string,result?:string):boolean{
 if(recipes.some(r=>r.result!==result&&!exists(s,r.result)&&r.id!=='rover-from-cart'&&(r.a===kind||r.b===kind)))return true;
 const rover=s.tokens.find(t=>t.kind==='rover');
 if(slots.some(slot=>slot.accepts.includes(kind)&&!(result==='rover'&&slot.id==='wheels')&&(!rover||!rover.slots?.[slot.id])))return true;
 return goals.some(g=>g.kind==='place'&&g.capability&&concept(kind).capabilities.includes(g.capability)&&!s.tokens.some(t=>t.kind!==kind&&hasCapability(t,g.capability!)));
}
function retire(s:State,kind:string){s.tokens=s.tokens.filter(t=>t.kind!==kind);if(!s.retired.includes(kind))s.retired.push(kind);}
/** Retained incorporated representatives are reconsidered only when the same physical module is used again. Never sweep unused ingredients. */
export function step(state:State,action:Action):{accepted:boolean;state:State;message:string;recipe?:string}{
 const s=structuredClone(state);try{
 if(action.type==='advance'){if(!levels[s.level].goals.every(id=>s.achieved.includes(id)))throw Error('Complete this purpose first.');if(s.level===levels.length-1)throw Error('Already at final purpose.');s.level++;settle(s);return {accepted:true,state:s,message:levels[s.level].intro};}
 if(action.type==='place'){const t=s.tokens.find(t=>t.kind===action.kind);if(!t)throw Error('Missing thing.');if(action.location&&!s.revealed.includes(action.location))throw Error('Unrevealed location.');const old=s.tokens.find(t=>t.location===action.location&&action.location);if(old)old.location=null;t.location=action.location;s.actions++;settle(s);return {accepted:true,state:s,message:'Placed freely; no ingredients accumulated.'};}
 const a=s.tokens.find(t=>t.kind===action.a),b=s.tokens.find(t=>t.kind===action.b),place=action.b.startsWith('place:')?action.b.slice(6):null;
 if(!a||(!b&&!place)||a===b)throw Error('Two available operands required.');if(place&&!s.revealed.includes(place))throw Error('Unrevealed location.');
 const at=b?.location??undefined;if(action.at&&action.at!==at)throw Error('Setting must be the actual target location.');
 const rover=a.kind==='rover'?a:b?.kind==='rover'?b:undefined,part=rover===a?b:a,slot=rover&&part?slots.find(slot=>slot.accepts.includes(part.kind)):undefined;
 if(rover&&part&&slot){const installed=rover.slots?.[slot.id];if(installed){if(slot.id!=='radio'||installed===part.kind||!concept(installed).capabilities.every(c=>concept(part.kind).capabilities.includes(c)))throw Error('Slot already filled; not an enhanced compatible module.');}
 rover.slots={...rover.slots,[slot.id]:part.kind};if(!hasFurtherUse(s,part.kind))retire(s,part.kind);s.actions++;settle(s);return {accepted:true,state:s,message:`Installed ${part.kind} in typed ${slot.id} slot.`,recipe:'install-'+slot.id};}
 const r=recipeFor(a.kind,action.b,at);if(!r)throw Error('No combination in this setting.');if(exists(s,r.result))throw Error('Result already exists or evolved; no duplicate.');
 for(const k of r.retire??[])if(k===a.kind||k===b?.kind)retire(s,k);
 for(const k of r.incorporate??[])if((k===a.kind||k===b?.kind)&&!hasFurtherUse(s,k,r.result))retire(s,k);
 add(s,r.result);s.actions++;settle(s);return {accepted:true,state:s,message:`Created ${r.result}. Surviving operands retain their placements.`,recipe:r.id};
 }catch(e){return {accepted:false,state,message:(e as Error).message};}
}
export function partners(s:State,kind:string):string[]{return [...s.tokens.map(t=>t.kind),...s.revealed.map(p=>'place:'+p)].filter(b=>step(s,{type:'combine',a:kind,b}).accepted);}
export const currentGoals=(s:State)=>levels[s.level].goals.map(id=>{const g=goals.find(g=>g.id===id)!;return {...g,current:satisfiesGoal(s,g),achieved:s.achieved.includes(g.id)};});
export {concepts,recipes,goals,levels,locations,supplies,slots};
