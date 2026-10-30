import { CONSTELLATION_VERSION, constellationHash, constellationStep, createConstellation, previewConstellation, replayConstellation } from './constellation-model.ts';
import type { ConstellationAction, ConstellationCapture, ConstellationState, Mode } from './constellation-model.ts';
import { JOINERY_LEVELS } from './joinery-model.ts';
import { mountConstellation } from './constellation-view.ts';
import type { ConstellationAPI } from './constellation-view.ts';

const STORAGE='combination-constellation-1';
const modes:Mode[]=['alchemy','forms','ideas'];
const params=new URLSearchParams(location.search);
const requested=params.get('mode');
let mode:Mode=modes.includes(requested as Mode)?requested as Mode:'alchemy';
type Capture=ConstellationCapture & {interfaceVersion:string;interactions:Record<string,unknown>[]};
interface Board {state:ConstellationState;run:Capture;history:ConstellationState[]}
const createBoard=(mode:Mode):Board=>{
  const state=createConstellation(mode);
  return {state,history:[],run:{schema:1,version:CONSTELLATION_VERSION,interfaceVersion:'canvas-1',id:`canvas-${mode}-${Date.now()}`,player:'browser',mode,decisions:[],interactions:[]}};
};
const boards=Object.fromEntries(modes.map(mode=>[mode,createBoard(mode)])) as Record<Mode,Board>;
try {
  const raw=localStorage.getItem(STORAGE);
  if(raw){
    const saved=JSON.parse(raw) as {mode:Mode;runs:Capture[]};
    for(const run of saved.runs){
      if(!modes.includes(run.mode))continue;
      const state=replayConstellation(run),history:ConstellationState[]=[];
      let previous=createConstellation(run.mode,run.goalId);
      for(const decision of run.decisions){
        if(decision.action.type==='move'||decision.action.type==='rotate')history.push(previous);
        if(decision.action.type==='restore-layout')history.pop();
        previous=constellationStep(previous,decision.action);
      }
      boards[run.mode]={state,run:{...run,interactions:run.interactions??[]},history};
    }
    if(!requested&&modes.includes(saved.mode))mode=saved.mode;
  }
}catch{/* Old or corrupt optional browser data does not prevent a fresh board. */}
const listeners=new Set<()=>void>();
const board=()=>boards[mode];
function persist(){
  try{localStorage.setItem(STORAGE,JSON.stringify({mode,runs:modes.map(mode=>boards[mode].run)}));}catch{/* The canvas also works without local storage. */}
}
function emit(){persist();listeners.forEach(listener=>listener());}
function apply(action:ConstellationAction){
  const current=board(),before=current.state,next=constellationStep(before,action);
  if(action.type==='move'||action.type==='rotate')current.history.push(before);
  current.state=next;
  current.run.decisions.push({index:current.run.decisions.length,action:structuredClone(action),before:constellationHash(before),after:constellationHash(next)});
  emit();
}
function nextGoalId(){
  const state=board().state;
  if(state.mode!=='forms'||state.goal?.status!=='won')return undefined;
  return JOINERY_LEVELS[JOINERY_LEVELS.findIndex(level=>level.id===state.goal?.id)+1]?.id;
}
const api:ConstellationAPI={
  getView:()=>{
    const current=board(),nextId=nextGoalId();
    return {...current.state,historyLength:current.history.length,
      ...(current.state.goal?{goal:{...current.state.goal,nextTitle:JOINERY_LEVELS.find(level=>level.id===nextId)?.title}}:{})};
  },
  preview:(a,b,offset)=>{const preview=previewConstellation(board().state,a,b,offset);return preview.valid?preview:null;},
  combine:(a,b,at,offset)=>apply({type:'blend',a,b,at,...(offset?{offset}:{})}),
  move:(id,x,y)=>apply({type:'move',id,x,y}),
  rotate:id=>apply({type:'rotate',id}),
  undo:()=>{const previous=board().history.pop();if(previous)apply({type:'restore-layout',previous});},
  reset:requestedMode=>{if(requestedMode&&modes.includes(requestedMode)){mode=requestedMode;emit();}},
  nextGoal:()=>{const id=nextGoalId();if(id)apply({type:'goal',id});},
  subscribe:render=>{listeners.add(render);return ()=>listeners.delete(render);},
  interaction:event=>{board().run.interactions.push({...event,decisionIndex:board().run.decisions.length,at:Math.round(performance.now())});persist();},
};
document.title='Combination · One shared canvas';
const mount=mountConstellation(document.querySelector<HTMLElement>('#app')!,api);
Object.assign(window,{constellation:{
  exportRun:()=>JSON.stringify(board().run,null,2),
  exportAllRuns:()=>JSON.stringify(modes.map(mode=>boards[mode].run),null,2),
  getState:()=>structuredClone(board().state),getViewport:mount.getViewport,fit:mount.fit,focus:mount.focus,
}});
