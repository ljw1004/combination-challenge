import {stepWorkingMaterials} from '../experiments/logical-working-materials.ts';
import {MATERIAL_TRANSFORMS} from '../experiments/working-materials-transformations.ts';
import type {Action,State} from '../experiments/working-materials-types.ts';
export const operations=['attach','inside','outside','connect','aim','fold','open','close','observe','transmit','sample','span','transform','fit'] as const;
const cache=new WeakMap<State,Map<string,{title:string;action:Action}[]>>();
export function pairActions(state:State,a:string,b:string):{title:string;action:Action}[]{
 const key=JSON.stringify([a,b]),cached=cache.get(state)?.get(key);if(cached)return cached;
 const base:Action={type:'combine',a,b}; const candidates=[{title:'Combine / deploy / move',action:base}];
 const actual=state.boards.find(x=>x.id===state.map)!.objects.some(o=>o.id===a||o.id===b);
 for(const operation of operations){if(!actual&&operation!=='transform')continue;if(operation==='connect')for(const channel of ['power','water','light'] as const)candidates.push({title:`Connect ${channel}`,action:{...base,context:{operation,channel}}});
 else if(operation==='aim')for(const direction of ['north','east','south','west'] as const)candidates.push({title:`Aim ${direction}`,action:{...base,context:{operation,direction}}});
 else if(operation==='transform')for(const t of MATERIAL_TRANSFORMS)candidates.push({title:`Transform → ${t.result}`,action:{...base,context:{operation,recipe:t.id}}});
 else candidates.push({title:operation,action:{...base,context:{operation}}});}
 const seen=new Set<string>();const result=candidates.filter(c=>{const next=stepWorkingMaterials(state,c.action);if(!next.accepted)return false;const signature=JSON.stringify([next.known,next.designs,next.boards]);if(seen.has(signature))return false;seen.add(signature);return true;});let entries=cache.get(state);if(!entries){entries=new Map();cache.set(state,entries);}entries.set(key,result);return result;
}
