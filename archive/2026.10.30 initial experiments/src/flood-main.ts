import { BUILD_VERSION, CONCEPTS, DEFAULT_RULES, RECIPES, RULES, SCENARIOS } from './data.ts';
import type { ConceptId } from './data.ts';
import { actionError, actionLabel, availableRecipes, branch, cellAt, conceptFor, createState, horizon, isDeployable, newRun, preview, record, replay, rulesOf, settledForecast } from './engine.ts';
import type { Action, Run, State } from './engine.ts';
import { mountGame } from './ui.ts';
import type { GameAPI, GameView, Preview } from './ui.ts';
import './style.css';
document.title='After the Rain · Archived experiment';

const STORAGE='after-the-rain-run-1';
let state=createState();let run=newRun(state);let cursor=0;
try {const stored=localStorage.getItem(STORAGE);if(stored){const imported=JSON.parse(stored) as Run;const checked=replay(imported);state=checked;run=imported;cursor=run.decisions.length;}}catch{ /* An older or damaged local replay starts a fresh game. */ }
const listeners=new Set<()=>void>();
const emit=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(run));}catch{ /* The game also works without browser storage. */ }listeners.forEach(f=>f());};
function action(id:string,target?:{lane:number;slot:number}):Action {
  if(id==='wait')return {type:'wait'};
  const at=target?{row:target.lane,col:target.slot}:undefined;
  if(id.startsWith('recipe:'))return {type:'discover',recipe:id.slice(7),...(at?{at}:{})};
  if(id.startsWith('deploy:')){if(!at)throw new Error('Choose a bank first.');return {type:'deploy',concept:id.slice(7) as ConceptId,at};}
  throw new Error('Unknown action.');
}
function view(s:State):GameView {
  const spec=SCENARIOS.find(x=>x.id===s.scenario)!;const waiting=s.status==='playing'?preview(s):null;
  const settled=settledForecast(s);
  const cap=(id:ConceptId)=>{const c=conceptFor(s,id);return {id:c.id,name:c.name,description:`${c.description} ${c.detail}`,symbol:c.icon,...(isDeployable(id)?{actionId:`deploy:${id}`,requiresTarget:true,preservesStructure:c.effect==='evaporate'}:{})};};
  return {
    scenarioId:s.scenario,scenarioTitle:spec.title,scenarioDescription:spec.description,scenarioIndex:SCENARIOS.indexOf(spec),scenarios:SCENARIOS.map(x=>({id:x.id,name:x.title,description:x.lesson})),
    seed:s.seed,variant:s.rules,variants:Object.values(RULES).map(r=>({id:r.id,name:r.name,description:r.description})),turn:s.turn,maxTurns:horizon(s),status:s.status,
    goal:'Keep both settlements above zero health until the rain passes.',known:s.known.map(cap),
    recipes:availableRecipes(s).map(r=>({actionId:`recipe:${r.id}`,inputs:r.inputs.map(i=>CONCEPTS[i].name),result:{...cap(r.output),description:`${conceptFor(s,r.output).description} ${conceptFor(s,r.output).detail}`},requiresTarget:rulesOf(s).discoverPlaces&&isDeployable(r.output)})),
    cells:s.cells.map(c=>{
      const f=waiting?.flow.find(x=>x.row===c.row&&x.col===c.col);const obj=c.structure;const def=obj?conceptFor(s,obj.concept):null;
      const detail=obj?`${def!.description}${obj.remaining!==null?` ${obj.concept==='basin'?'Space':'Capacity'}: ${obj.remaining}.`:''}${obj.concept==='grove'?(obj.age===0?' Saplings.':' Mature.'):''}`:undefined;
      return {lane:c.row,slot:c.col,label:`${['North','Middle','South'][c.row]} ${['upstream','midstream','downstream'][c.col]}`,pressure:f?.incoming??0,terrain:c.blocked?'Bedrock':'Open bank',blocked:c.blocked,
        ...(obj?{structure:{name:def!.name,description:detail,kind:obj.concept}}:{}),
        ...(c.col===2&&c.row<2?{asset:{name:spec.assetNames[c.row],health:Math.max(0,s.health[c.row]),maxHealth:spec.health[c.row]}}:{}),
        ...(c.row===2&&c.col===2?{outlet:true}:{}),effects:c.blocked?['No building here']:f&&f.diverted?[`${f.diverted} diverted next pulse`]:[]};
    }),
    forecast:Array.from({length:horizon(s)},(_,i)=>{const pulse=s.waves[i-rulesOf(s).grace]??[0,0,0];return {turn:i+1,amount:pulse[0]+pulse[1]+pulse[2],pulse:[...pulse] as [number,number,number],label:i<rulesOf(s).grace?'Preparation':`North ${pulse[0]} · Middle ${pulse[1]} · South ${pulse[2]}`};}),
    eventLog:run.decisions.slice(0,cursor).flatMap(d=>[`Turn ${d.turn+1}: ${actionLabel(d.action)}.`,...d.events.map(e=>e.text)]),
    history:{cursor,length:run.decisions.length},waitActionId:'wait',laneNames:['North bank','Middle bank','South outlet'],
    ...(settled.settled?{finishForecast:{pulses:settled.pulses}}:{}),
    outcome:s.status==='won'?`Both ${spec.assetNames[0]} and ${spec.assetNames[1]} survived. Try another construction, or take what you learned into the next watershed.`:s.status==='lost'?'Inspect an earlier decision with Undo or the replay slider. Your other branch remains inspectable until you commit a new action.':undefined,
    buildLabel:`Build ${BUILD_VERSION} · ${s.rules} · seed ${s.seed}`,
  };
}
const api:GameAPI={
  getView:()=>view(state),
  act:(id,target)=>{
    const a=action(id,target);const error=actionError(state,a);if(error)throw new Error(error);
    if(cursor<run.decisions.length){const b=branch(run,cursor);run=b.run;state=b.state;}
    const result=record(state,run,a);state=result.state;run=result.run;cursor=run.decisions.length;emit();
  },
  preview:(id,target):Preview|null=>{
    if(state.status!=='playing')return null;
    let a:Action;try{a=action(id,target);}catch{return null;}
    const error=actionError(state,a);if(error)return {title:'Choose a different bank',lines:[error]};
    const t=preview(state,a);const spec=SCENARIOS.find(x=>x.id===state.scenario)!;
    const lines=[`${spec.assetNames[0]}: ${t.damage[0]} damage → ${Math.max(0,t.state.health[0])} health. ${spec.assetNames[1]}: ${t.damage[1]} damage → ${Math.max(0,t.state.health[1])} health.`];
    if(a.type!=='wait'&&a.at){const old=cellAt(state,a.at)?.structure;const id=a.type==='deploy'?a.concept:RECIPES.find(r=>r.id===a.recipe)!.output;
      if(old&&CONCEPTS[id].effect!=='evaporate')lines.push(`Replaces ${CONCEPTS[old.concept].name} on this bank.`);
    }
    lines.push(...t.events.filter(e=>!['weather','damage'].includes(e.kind)).map(e=>e.text).slice(0,5));
    return {title:'Exact next response',lines,cells:t.flow.map(f=>({lane:f.row,slot:f.col,pressure:f.incoming,description:`${f.absorbed} absorbed · ${f.diverted} diverted · ${f.outgoing} east`})),status:t.state.status};
  },
  reset:({scenario,seed,variant})=>{state=createState(scenario,seed,variant);run=newRun(state);cursor=0;emit();},
  undo:()=>{if(cursor>0){cursor--;state=replay(run,cursor);emit();}},
  seek:(index)=>{if(!Number.isInteger(index)||index<0||index>run.decisions.length)throw new Error('Invalid replay turn.');cursor=index;state=replay(run,cursor);emit();},
  exportRun:()=>JSON.stringify(run,null,2),
  finishForecast:()=>{
    if(!settledForecast(state).settled)throw new Error('The remaining storm can still cause damage.');
    if(cursor<run.decisions.length){const b=branch(run,cursor);run=b.run;state=b.state;}
    while(state.status==='playing'){const result=record(state,run,{type:'wait'},undefined,'forecast');state=result.state;run=result.run;}
    cursor=run.decisions.length;emit();
  },
  importRun:(text)=>{if(text.length>2_000_000)throw new Error('Replay is too large.');const imported=JSON.parse(text) as Run;const checked=replay(imported);state=checked;run=imported;cursor=run.decisions.length;emit();},
  subscribe:(render)=>{listeners.add(render);return ()=>listeners.delete(render);},
};
mountGame(document.querySelector<HTMLElement>('#app')!,api);
// Public observation/action adapter for browser diagnostics; no hidden game information.
Object.assign(window,{watershed:api});
