import { createJoinery, JOINERY_LEVELS, JOINERY_VERSION, joineryHash, joineryStep, levelOf, previewJoin, replayJoinery } from './joinery-model.ts';
import type { JoineryAction, JoineryCapture, JoineryState } from './joinery-model.ts';
import { mountJoinery } from './joinery-view.ts';
import type { JoineryAPI } from './joinery-view.ts';
import './joinery.css';

const STORAGE='combination-joinery-1';
const requested=new URLSearchParams(location.search).get('level');
let state=createJoinery(requested&&JOINERY_LEVELS.some(l=>l.id===requested)?requested:undefined);
const newCapture=():JoineryCapture=>({schema:1,version:JOINERY_VERSION,id:`joinery-${Date.now()}`,level:state.level,player:'browser',decisions:[],interactions:[]});
let run=newCapture();let history:JoineryState[]=[];let archive:JoineryCapture[]=[];
try{const saved=localStorage.getItem(STORAGE);if(saved){const data=JSON.parse(saved) as {run:JoineryCapture;archive?:JoineryCapture[]};if(!requested||requested===data.run.level){state=replayJoinery(data.run);run=data.run;archive=data.archive??[];
  let s=createJoinery(run.level);for(const d of run.decisions){if(d.action.type==='undo')s=history.pop()!;else{const before=s;s=joineryStep(s,d.action);if(d.action.type!=='move')history.push(before);}}
}}}catch{state=createJoinery();run=newCapture();history=[];archive=[];}
const listeners=new Set<()=>void>();
function emit(){try{localStorage.setItem(STORAGE,JSON.stringify({run,archive}));}catch{/* Optional local persistence. */}listeners.forEach(fn=>fn());}
function apply(action:JoineryAction){const before=state;const next=joineryStep(state,action);if(action.type!=='move')history.push(before);state=next;run.decisions.push({index:run.decisions.length,action,before:joineryHash(before),after:joineryHash(next)});emit();}
function start(level:string){if(run.decisions.length)archive=[...archive,run].slice(-30);state=createJoinery(level);run=newCapture();history=[];emit();}
const api:JoineryAPI={
  getView:()=>({level:{id:state.level,title:levelOf(state).title,target:levelOf(state).target},pieces:state.pieces,stock:levelOf(state).stock.map(p=>({...p,available:state.available.includes(p.id)})),joins:state.joins,historyLength:history.length,status:state.status,notice:state.notice,levels:JOINERY_LEVELS.map(l=>({id:l.id,title:l.title})),levelIndex:JOINERY_LEVELS.findIndex(l=>l.id===state.level)}),
  take:(stockId,x,y)=>apply({type:'take',stockId,x,y}),
  move:(pieceId,x,y)=>apply({type:'move',pieceId,x,y}),
  rotate:pieceId=>apply({type:'rotate',pieceId}),
  preview:(source,targetId,offset)=>previewJoin(state,source,targetId,offset),
  join:(source,targetId,offset,x,y)=>apply({type:'join',source,targetId,offset,x,y}),
  undo:()=>{const previous=history.pop();if(!previous)return;const before=state;state=previous;run.decisions.push({index:run.decisions.length,action:{type:'undo'},before:joineryHash(before),after:joineryHash(previous)});emit();},
  retry:()=>start(state.level),
  next:()=>{const index=JOINERY_LEVELS.findIndex(l=>l.id===state.level);start(JOINERY_LEVELS[(index+1)%JOINERY_LEVELS.length].id);},
  select:start,
  subscribe:fn=>{listeners.add(fn);return ()=>listeners.delete(fn);},
  interaction:event=>{run.interactions.push({...event,decisionIndex:event.kind==='join'?run.decisions.length-1:run.decisions.length,at:Math.round(performance.now())});try{localStorage.setItem(STORAGE,JSON.stringify({run,archive}));}catch{/* Optional local capture. */}},
};
document.title='Combination · Joinery';
mountJoinery(document.querySelector<HTMLElement>('#app')!,api);
Object.assign(window,{joinery:{...api,exportRun:()=>JSON.stringify(run,null,2),exportAllRuns:()=>JSON.stringify([...archive,run],null,2),getState:()=>structuredClone(state)}});
