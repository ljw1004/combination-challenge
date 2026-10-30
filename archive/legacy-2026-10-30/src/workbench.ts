import { CONCEPTS, RECIPES } from './data.ts';
import type { ConceptId } from './data.ts';
import { createTable, HANDS_VERSION, reaction, replayTable, TABLE_DESCRIPTIONS, tableHash, tableStep } from './workbench-model.ts';
import type { TableAction, TableCapture, TableState } from './workbench-model.ts';
import { mountWorkbench } from './workbench-view.ts';
import type { WorkbenchAPI, WorkbenchItem } from './workbench-view.ts';
import './workbench.css';

const STORAGE='combination-hands-1';
const UI_VERSION='contact-2';
let state=createTable();let history:TableState[]=[];
let capture:TableCapture={schema:1,version:HANDS_VERSION,uiVersion:UI_VERSION,id:`table-${Date.now()}`,decisions:[],interactions:[]};
try {
  const saved=localStorage.getItem(STORAGE);
  if(saved){const data=JSON.parse(saved) as {capture:TableCapture};state=replayTable(data.capture);capture=data.capture;
    let s=createTable();for(const d of capture.decisions){if(d.action.type==='undo')s=history.pop()!;else {const old=s;s=tableStep(s,d.action);if(d.action.type!=='move')history.push(old);}}
  }
}catch {state=createTable();history=[];}
const listeners=new Set<()=>void>();
function emit(){try{localStorage.setItem(STORAGE,JSON.stringify({capture}));}catch{/* Optional local persistence. */}listeners.forEach(f=>f());}
const item=(id:ConceptId):WorkbenchItem=>({id,name:CONCEPTS[id].name,icon:CONCEPTS[id].icon,color:CONCEPTS[id].color,description:TABLE_DESCRIPTIONS[id]});
function apply(action:TableAction){
  const before=state;const next=tableStep(before,action);
  if(action.type!=='move')history.push(before);
  state=next;capture.decisions.push({index:capture.decisions.length,action,before:tableHash(before),after:tableHash(next)});emit();
}
const api:WorkbenchAPI={
  getView:()=>({known:state.known.map(item),pieces:state.pieces.map(p=>({...p})),recipes:RECIPES.map(r=>({inputs:r.inputs,output:r.output})),historyLength:history.length,notice:state.notice,mixes:state.mixes,...(state.lastResult?{lastResult:state.lastResult}:{})}),
  spawn:(concept,x,y)=>apply({type:'take',concept:concept as ConceptId,x,y}),
  move:(piece,x,y)=>apply({type:'move',piece,x,y}),
  combine:(first,second)=>apply({type:'mix',first,second}),
  combineFromShelf:(concept,target,x?:number,y?:number)=>apply({type:'mix-from-shelf',concept:concept as ConceptId,target,...(x!==undefined&&y!==undefined?{at:{x,y}}:{})}),
  preview:(a,b)=>{const output=reaction(a,b);return output?item(output):null;},
  undo:()=>{const next=history.pop();if(!next)return;const before=state;state=next;capture.decisions.push({index:capture.decisions.length,action:{type:'undo'},before:tableHash(before),after:tableHash(next)});emit();},
  clear:()=>apply({type:'clear'}),
  reset:()=>{state=createTable();history=[];capture={schema:1,version:HANDS_VERSION,uiVersion:UI_VERSION,id:`table-${Date.now()}`,decisions:[],interactions:[]};emit();},
  subscribe:(render)=>{listeners.add(render);return ()=>listeners.delete(render);},
  interaction:(event)=>{capture.interactions.push({...event,uiVersion:UI_VERSION,decisionIndex:event.kind==='fusion'?capture.decisions.length-1:capture.decisions.length,at:Math.round(performance.now())});try{localStorage.setItem(STORAGE,JSON.stringify({capture}));}catch{/* Optional local capture. */}},
};
mountWorkbench(document.querySelector<HTMLElement>('#app')!,api);
Object.assign(window,{combination:{...api,exportRun:()=>JSON.stringify(capture,null,2),getState:()=>structuredClone(state)}});
