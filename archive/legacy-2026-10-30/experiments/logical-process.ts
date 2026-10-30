import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Invented causal transformations, not a model of real signal-processing equipment. */
export const PROCESS_VERSION='process-1';
export const PROCESS_OPERATORS=['amplify','sieve','remember','settle','contrast'] as const;
export type Operator=typeof PROCESS_OPERATORS[number];
export interface ProcessScenario {id:string;title:string;meaning:string;raw:number[];target:number[]}
export const PROCESS_SCENARIOS:ProcessScenario[]=[
  {id:'first-voice',title:'The first voice',meaning:'Make a strong response only at the first faint arrival. Later activity should not echo it.',raw:[0,1,1,0,2,0],target:[0,2,0,0,0,0]},
  {id:'sustained-whisper',title:'The sustained whisper',meaning:'Respond strongly when the faint arrival has persisted into its second beat. Reject the isolated later spike.',raw:[0,1,1,0,2,0],target:[0,0,2,0,0,0]},
  {id:'late-flash',title:'The late flash',meaning:'Keep only the isolated strong arrival; the faint earlier activity is irrelevant in this encounter.',raw:[0,1,1,0,2,0],target:[0,0,0,0,2,0]},
  {id:'bridge',title:'Bridge an interruption',meaning:'Create a sustained response across the central interruption while keeping the initial and final beats quiet.',raw:[0,2,0,2,0,0],target:[0,0,2,2,2,0]},
  {id:'separate-arrivals',title:'Separate arrivals',meaning:'Respond strongly to each new rise, without repeating a response on the following sustained beat.',raw:[0,1,1,0,2,0],target:[0,2,0,0,2,0]},
];
export const PROCESS_SCENARIO_IDS=PROCESS_SCENARIOS.map(s=>s.id);
export type ProcessAction={type:'combine';a:string;b:string};
export type Action=ProcessAction;
export interface ProcessState {
  version:string;scenarioId:string;world:number[];status:'playing'|'won'|'lost';
  actions:ProcessAction[];visited:string[];feedback:string;
}
export type State=ProcessState;
const signature=(world:number[])=>world.join('');
const same=(a:number[],b:number[])=>signature(a)===signature(b);
const scenario=(id:string)=>{const result=PROCESS_SCENARIOS.find(s=>s.id===id);if(!result)throw new Error('Unknown process scenario.');return result;};
const descriptions:Record<Operator,string>={
  amplify:'Double every value, capped at2. Faint1 and strong2 both become2; that distinction is erased.',
  sieve:'Keep strong2; replace faint1 with0. This removes faint events as well as faint noise.',
  remember:'At each beat take max(current, previous). The previous value before the first beat is0. Responses spread into the next beat.',
  settle:'At each beat take min(current, previous). Previous before the first beat is0. A response must persist to survive; isolated arrivals disappear.',
  contrast:'At each beat take max(0,current−previous). Previous before the first beat is0. Keep increases, remove sustained portions and decreases.',
};
/** Each transformation reads the complete old trace simultaneously, never an in-place sweep. */
export function transformProcess(world:number[],operator:Operator):number[] {
  if(world.length!==6||world.some(value=>![0,1,2].includes(value)))throw new Error('A process world has six values in0,1,2.');
  return world.map((value,index)=>{
    const previous=index?world[index-1]:0;
    switch(operator){
      case 'amplify':return Math.min(2,value*2);
      case 'sieve':return value===2?2:0;
      case 'remember':return Math.max(value,previous);
      case 'settle':return Math.min(value,previous);
      case 'contrast':return Math.max(0,value-previous);
      default:throw new Error('Unknown process.');
    }
  });
}
function operatorOf(action:ProcessAction):Operator {
  if(!action||action.type!=='combine'||typeof action.a!=='string'||typeof action.b!=='string')throw new Error('Use a combine action.');
  const id=action.a==='world'?action.b:action.b==='world'?action.a:null;
  if(!id||!PROCESS_OPERATORS.includes(id as Operator))throw new Error('Combine world with one named process. All five legal processes are public.');
  return id as Operator;
}
function status(world:number[],target:number[]):ProcessState['status'] {
  return same(world,target)?'won':world.every(value=>value===0)&&target.some(Boolean)?'lost':'playing';
}
export function createProcess(id='first-voice',_seed=0):ProcessState {
  const spec=scenario(id);return {version:PROCESS_VERSION,scenarioId:id,world:[...spec.raw],status:status(spec.raw,spec.target),actions:[],visited:[signature(spec.raw)],feedback:'Processes are inexhaustible. Combining changes the world, not a supply count.'};
}
export function processProfile(world:number[],target:number[]){
  const retained=world.reduce((sum,value,i)=>sum+Math.min(value,target[i]),0);
  const intrusion=world.reduce((sum,value,i)=>sum+(target[i]===0?value:0),0);
  const overshoot=world.reduce((sum,value,i)=>sum+(target[i]>0?Math.max(0,value-target[i]):0),0);
  return {retainedTargetSignal:retained,unwantedSignal:intrusion,targetOvershoot:overshoot,targetSignal:target.reduce((a,b)=>a+b,0)};
}
export function legalProcessActions(state:ProcessState):ProcessAction[]{
  if(state.status!=='playing')return [];
  return PROCESS_OPERATORS.filter(operator=>!same(state.world,transformProcess(state.world,operator))).map(operator=>({type:'combine',a:'world',b:operator}));
}
export function previewProcess(state:ProcessState,action:ProcessAction){
  if(state.version!==PROCESS_VERSION)throw new Error('Different process version.');
  const operator=operatorOf(action),world=transformProcess(state.world,operator),target=scenario(state.scenarioId).target;
  return {operator,world,status:status(world,target),profile:processProfile(world,target),changed:!same(world,state.world),previouslySeen:state.visited.includes(signature(world))};
}
export function stepProcess(state:ProcessState,action:ProcessAction):ProcessState {
  if(state.status!=='playing')throw new Error('This world has reached its outcome; start another encounter.');
  const preview=previewProcess(state,action);
  if(!preview.changed)throw new Error('That process changes nothing here. It is not an available action.');
  return {...structuredClone(state),world:preview.world,status:preview.status,actions:[...state.actions,structuredClone(action)],visited:[...new Set([...state.visited,signature(preview.world)])],feedback:`${preview.operator} changed the world to ${preview.world.join(' ')}.${preview.status==='won'?' The target pattern is established.':preview.status==='lost'?' Silence is absorbing: these processes cannot recreate a vanished signal.':''}`};
}
export function observeProcess(state:ProcessState){
  const spec=scenario(state.scenarioId);
  return {version:state.version,scenario:state.scenarioId,title:spec.title,status:state.status,goal:{meaning:spec.meaning,target:spec.target},world:state.world,
    rules:[
      'The world is one six-beat causal trace:0 absent,1 faint,2 strong. The target specifies the desired trace exactly.',
      'Combine world with a process. The process changes the current world; it does not make a parallel copy. All process capabilities remain available forever.',
      'No material is spent. There is no action allowance, score, player clock or waiting action. The six beats are the phenomenon being shaped, not a deadline for the player.',
      'All five process laws and immediate results are public. Each reads the old trace simultaneously. No-op processes are omitted.',
      'Processing may erase distinctions irreversibly. Previous traces are remembered as evidence but cannot be substituted for the current world. A fresh encounter resets the world.',
      'An all-zero world is absorbing and loses if the target is nonzero. Other failures of reachability are not announced by an oracle; reason from the public causal laws.',
    ],
    concepts:[{id:'world',label:'Current world'},...PROCESS_OPERATORS.map(id=>({id,label:id,law:descriptions[id]}))],
    actionSchema:{type:'combine',a:'world',b:'a named process; either pair order accepted'},
    profile:processProfile(state.world,spec.target),legalActions:legalProcessActions(state),previews:legalProcessActions(state).map(action=>({action,...previewProcess(state,action)})),feedback:state.feedback,
  };
}
export function processSemanticKey(state:ProcessState):string{return `${state.scenarioId}:${signature(state.world)}`;}
export function processOutcome(state:ProcessState){
  const values=processProfile(state.world,scenario(state.scenarioId).target);
  return {status:state.status,terminal:state.status!=='playing',semanticKey:processSemanticKey(state),objectives:[
    {id:'retainedTargetSignal',value:values.retainedTargetSignal,direction:'higher' as const,ideal:values.targetSignal},
    {id:'unwantedSignal',value:values.unwantedSignal,direction:'lower' as const,ideal:0},
    {id:'targetOvershoot',value:values.targetOvershoot,direction:'lower' as const,ideal:0},
  ],properties:{world:state.world},interpretation:'These dimensions are exact components of one desired output, not independent player values or handpicked reward weights. The final exact target dominates other outputs; local transitions may trade preservation against intrusion.'};
}
/** Exact single-world reachability, at most3^6 states. Privileged evaluator only. */
export function processReachability(world:number[],target:number[]){
  const queue=[world],seen=new Map<string,{world:number[];path:Operator[]}>([[signature(world),{world,path:[]}]]);
  for(const current of queue){
    const before=seen.get(signature(current))!;
    for(const operator of PROCESS_OPERATORS){const next=transformProcess(current,operator),key=signature(next);if(seen.has(key))continue;seen.set(key,{world:next,path:[...before.path,operator]});queue.push(next);}
  }
  return {reachable:seen.has(signature(target)),witness:seen.get(signature(target))?.path??null,states:seen.size,all:[...seen.values()]};
}
export function replayProcess(id:string,actions:ProcessAction[]){return actions.reduce(stepProcess,createProcess(id));}
function dominates(a:ReturnType<typeof processProfile>,b:ReturnType<typeof processProfile>){return a.retainedTargetSignal>=b.retainedTargetSignal&&a.unwantedSignal<=b.unwantedSignal&&a.targetOvershoot<=b.targetOvershoot&&(a.retainedTargetSignal>b.retainedTargetSignal||a.unwantedSignal<b.unwantedSignal||a.targetOvershoot<b.targetOvershoot);}
export function screenProcess(){
  const rows=PROCESS_SCENARIOS.map(spec=>{
    const initial=createProcess(spec.id),reach=processReachability(initial.world,spec.target);
    const openings=legalProcessActions(initial).map(action=>{const next=stepProcess(initial,action),profile=processProfile(next.world,spec.target),future=processReachability(next.world,spec.target);return {action,world:next.world,profile,canStillReachTarget:future.reachable,continuation:future.witness};});
    const localFrontier=openings.filter(a=>!openings.some(b=>dominates(b.profile,a.profile))).map(a=>a.action.b);
    const witness=reach.witness?.map(operator=>({type:'combine' as const,a:'world',b:operator}));
    const replay=witness?replayProcess(spec.id,witness):null;
    const greedy=[];let g=initial;const visited=new Set<string>();
    while(g.status==='playing'&&!visited.has(processSemanticKey(g))){visited.add(processSemanticKey(g));const actions=legalProcessActions(g);if(!actions.length)break;const ranked=actions.map(action=>({action,preview:previewProcess(g,action)})).sort((a,b)=>{
      const error=(p:typeof a.preview)=>p.profile.targetSignal-p.profile.retainedTargetSignal+p.profile.unwantedSignal+p.profile.targetOvershoot;
      return error(a.preview)-error(b.preview)||a.action.b.localeCompare(b.action.b);
    });const action=ranked[0].action;g=stepProcess(g,action);greedy.push({action,world:g.world,status:g.status});}
    return {id:spec.id,raw:spec.raw,target:spec.target,reachableStates:reach.states,witness,witnessWon:replay?.status==='won',openings,localParetoFrontier:localFrontier,greedy:{won:g.status==='won',trace:greedy},noncommutingExamples:PROCESS_OPERATORS.flatMap(a=>PROCESS_OPERATORS.filter(b=>a!==b).map(b=>({first:a,second:b,forward:transformProcess(transformProcess(spec.raw,a),b),reverse:transformProcess(transformProcess(spec.raw,b),a)}))).filter(e=>!same(e.forward,e.reverse)).slice(0,5)};
  });
  // Same raw trace with conflicting desired meanings defeats a single fixed final process.
  // A common long trajectory might still pass through several targets before ending.
  const shared=PROCESS_SCENARIOS.filter(s=>same(s.raw,PROCESS_SCENARIOS[0].raw)),allMask=(1<<shared.length)-1;
  const queue=[{world:shared[0].raw,mask:0,path:[] as Operator[]}],seen=new Set<string>();let common:Operator[]|null=null;
  for(const node of queue){let mask=node.mask;for(let i=0;i<shared.length;i++)if(same(node.world,shared[i].target))mask|=1<<i;const key=`${signature(node.world)}:${mask}`;if(seen.has(key))continue;seen.add(key);if(mask===allMask){common=node.path;break;}for(const operator of PROCESS_OPERATORS){const world=transformProcess(node.world,operator);if(!same(world,node.world))queue.push({world,mask,path:[...node.path,operator]});}}
  const first=createProcess('first-voice'),sieved=stepProcess(first,{type:'combine',a:'world',b:'sieve'}),recoverable=stepProcess(first,{type:'combine',a:'world',b:'contrast'});
  const input=JSON.stringify(first);previewProcess(first,{type:'combine',a:'world',b:'remember'});const after=stepProcess(first,{type:'combine',a:'world',b:'remember'});
  return {version:PROCESS_VERSION,hypothesis:'Public causal processes can make order and information loss matter without finite supplies or player-time scarcity. A local plausible improvement may destroy a desired distinction; another imperfect move can remain recoverable.',rows,
    sharedInputFixedFinalProcessCannotSolveAll:shared.some(s=>!same(s.target,shared[0].target)),commonTrajectoryVisitingAllSharedTargets:common,
    informationLoss:{sieveFirstForFirstVoice:{world:sieved.world,targetReachable:processReachability(sieved.world,scenario('first-voice').target).reachable},contrastFirstRecoverable:{world:recoverable.world,witness:processReachability(recoverable.world,scenario('first-voice').target).witness}},
    invariants:{previewAndStepPreserveInput:input===JSON.stringify(first),capabilitiesRemain:observeProcess(after).concepts.length===6,allWitnessesReplay:rows.every(row=>row.witnessWon),noPlayerBudget:true},
    limitations:['The desired output is exact, so there is one final best result. Local tradeoff profiles do not demonstrate strategic value pluralism.','This is a short causal transformation puzzle, not signal-processing advice or established human fun.','Time inside the modeled trace is causal history, not a player deadline; no operation advances a scarce player clock.','Past world states are not reusable parallel artefacts. Concept capabilities persist, while world transformations can be irreversible.','Greedy error is an explicitly disclosed diagnostic weight sum, not the player reward or a fun score.'],
  };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenProcess();mkdirSync('results',{recursive:true});writeFileSync('results/logical-process-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
