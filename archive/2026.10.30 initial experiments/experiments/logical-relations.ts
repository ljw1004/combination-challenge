import {pathToFileURL} from 'node:url';

/** A transparent algebra of judgments, with no resource or action budget. */
export const RELATIONS_VERSION='relations-1';
export interface RelationsScenario {
  id:string;title:string;families:number[];threshold:number;
}
export const scenarios:RelationsScenario[]=[
  {id:'echo-left',title:'One chorus, four independent sources',families:[0,0,0,1,2,3],threshold:2},
  {id:'echo-right',title:'The echo moves',families:[0,1,2,3,3,3],threshold:2},
  {id:'interleaved',title:'Interleaved echoes',families:[0,1,0,2,1,3],threshold:2},
  {id:'stricter-judgment',title:'Three independent sources',families:[0,1,0,2,1,3],threshold:3},
];
export type RelationsOp='all'|'either';
export type RelationsAction={type:'combine';op:RelationsOp;a:string;b:string};
export interface RelationsCase {id:string;signals:boolean[];required:'accept'|'reject'}
export type RelationsExpression={source:string}|{op:RelationsOp;a:RelationsExpression;b:RelationsExpression};
export interface RelationsConcept {id:string;label:string;accepts:string;expression:RelationsExpression}
export interface RelationsState {
  version:string;scenario:string;seed:number;cases:RelationsCase[];concepts:RelationsConcept[];
  status:'playing'|'won';winner?:string;active:string|null;actions:RelationsAction[];message:string;
}
export interface RelationsPreview {id:string;accepts:string;label:string;novel:boolean;wins:boolean}
const names=['A','B','C','D','E','F'];
const combineBits=(a:string,b:string,op:RelationsOp)=>[...a].map((value,i)=>op==='all'?value==='1'&&b[i]==='1'?'1':'0':value==='1'||b[i]==='1'?'1':'0').join('');
const matches=(cases:RelationsCase[],signature:string)=>cases.every((c,i)=>(signature[i]==='1')===(c.required==='accept'));
const conceptId=(signature:string)=>`condition:${signature}`;
function random(seed:number){let value=(seed>>>0)||1;return ()=>{value^=value<<13;value^=value>>>17;value^=value<<5;return (value>>>0)/4294967296;};}
function sourceOrder(seed:number){const order=[0,1,2,3,4,5],r=random(seed);if(!seed)return order;for(let i=order.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return order;}
function getScenario(scenario:string|RelationsScenario):RelationsScenario {
  const found=typeof scenario==='string'?scenarios.find(s=>s.id===scenario):scenario;
  if(!found)throw new Error('Unknown relations context.');
  if(found.families.length!==6||found.families.some(n=>!Number.isInteger(n)||n<0||n>3))throw new Error('Six signals must refer to four explicitly modeled sources.');
  return found;
}
export function createRelations(scenario:string|RelationsScenario='echo-left',seed=0):RelationsState {
  const selected=getScenario(scenario),order=sourceOrder(seed);
  const cases=Array.from({length:16},(_,world)=>{
    const independent=Array.from({length:4},(_,i)=>!!(world&(1<<i)));
    return {id:`case-${world+1}`,signals:order.map(index=>independent[selected.families[index]]),required:independent.filter(Boolean).length>=selected.threshold?'accept' as const:'reject' as const};
  });
  const concepts=names.map((label,i)=>({id:label,label,accepts:cases.map(c=>c.signals[i]?'1':'0').join(''),expression:{source:label}}));
  const state:RelationsState={version:RELATIONS_VERSION,scenario:selected.id,seed,cases,concepts,status:'playing',active:null,actions:[],message:''};
  return updateStatus(state);
}
function updateStatus(state:RelationsState):RelationsState {
  const winner=state.concepts.find(concept=>matches(state.cases,concept.accepts));
  state.status=winner?'won':'playing';if(winner)state.winner=winner.id;else delete state.winner;return state;
}
export function inspectRelations(state:RelationsState,action:RelationsAction):RelationsPreview {
  if(state.version!==RELATIONS_VERSION)throw new Error('Different relations rules version.');
  if(action.type!=='combine'||!['all','either'].includes(action.op))throw new Error('Combine with ALL or EITHER.');
  const a=state.concepts.find(c=>c.id===action.a),b=state.concepts.find(c=>c.id===action.b);
  if(!a||!b)throw new Error('Both inputs must be established concepts.');
  const accepts=combineBits(a.accepts,b.accepts,action.op),known=state.concepts.find(c=>c.accepts===accepts);
  return {id:known?.id??conceptId(accepts),accepts,label:known?.label??`(${a.label} ${action.op==='all'?'AND':'OR'} ${b.label})`,novel:!known,wins:matches(state.cases,accepts)};
}
export function stepRelations(state:RelationsState,action:RelationsAction):RelationsState {
  const preview=inspectRelations(state,action),next=structuredClone(state);
  if(preview.novel){const a=next.concepts.find(c=>c.id===action.a)!,b=next.concepts.find(c=>c.id===action.b)!;next.concepts.push({id:preview.id,label:preview.label,accepts:preview.accepts,expression:{op:action.op,a:structuredClone(a.expression),b:structuredClone(b.expression)}});}
  next.active=preview.id;next.actions.push(structuredClone(action));next.message=preview.novel?`${preview.label} established.`:'That condition already exists. Both inputs remain.';
  return updateStatus(next);
}
export function legalRelationsActions(state:RelationsState):RelationsAction[] {
  const actions:RelationsAction[]=[];
  for(let a=0;a<state.concepts.length;a++)for(let b=a;b<state.concepts.length;b++)for(const op of ['all','either'] as const)actions.push({type:'combine',op,a:state.concepts[a].id,b:state.concepts[b].id});
  return actions;
}
export function observeRelations(state:RelationsState){
  const scenario=getScenario(state.scenario);
  return {
    version:state.version,scenario:state.scenario,title:scenario.title,status:state.status,winner:state.winner,active:state.active,
    rules:[
      'Each condition is a set of the public cases it accepts. Every legal input and its consequences can be inspected.',
      'ALL accepts a case exactly when both inputs accept it. EITHER accepts a case when at least one input accepts it.',
      'Establish one condition that accepts every required-accept case and rejects every required-reject case.',
      'Inputs and discoveries remain forever. Identical resulting conditions share one concept. No stock, gate budget, turn deadline or action quota exists.',
      'The contexts concern repeated observations of independent sources. Repeated columns are echoes, not additional independent support; the complete case table is authoritative.',
    ],
    actionSchema:{type:'combine',op:['all','either'],a:'current concept id',b:'current concept id'},
    legalActions:'Any two current concept ids, with either operator. The ALL/EITHER rules completely specify every preview.',
    caseOrder:state.cases.map(c=>c.id),cases:state.cases.map(c=>({id:c.id,signals:Object.fromEntries(names.map((name,i)=>[name,c.signals[i]])),required:c.required})),
    concepts:state.concepts.map(c=>({id:c.id,label:c.label,accepts:c.accepts})),message:state.message,
  };
}
export function replayRelations(scenario:string,actions:RelationsAction[],seed=0):RelationsState {return actions.reduce(stepRelations,createRelations(scenario,seed));}

interface ExpressionEntry {bits:string;expression:RelationsExpression;cost:number}
function evaluateExpression(expression:RelationsExpression,initial:RelationsState):string {
  if('source'in expression)return initial.concepts.find(c=>c.id===expression.source)!.accepts;
  return combineBits(evaluateExpression(expression.a,initial),evaluateExpression(expression.b,initial),expression.op);
}
/** Exact minimum expression-tree size; circuit reuse may take fewer actions. */
function closure(initial:RelationsState){
  const known=new Map<string,ExpressionEntry>();for(const c of initial.concepts)if(!known.has(c.accepts))known.set(c.accepts,{bits:c.accepts,expression:c.expression,cost:0});
  let changed=true,rounds=0;
  while(changed){changed=false;rounds++;const entries=[...known.values()];
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++)for(const op of ['all','either'] as const){
      const a=entries[i],b=entries[j],bits=combineBits(a.bits,b.bits,op),cost=a.cost+b.cost+1,old=known.get(bits);
      if(!old||cost<old.cost){known.set(bits,{bits,expression:{op,a:a.expression,b:b.expression},cost});changed=true;}
    }
  }
  return {known,rounds};
}
function program(initial:RelationsState,expression:RelationsExpression){
  let state=initial;const actions:RelationsAction[]=[];
  function build(e:RelationsExpression):string {
    const signature=evaluateExpression(e,initial),known=state.concepts.find(c=>c.accepts===signature);if(known)return known.id;
    if('source'in e)return e.source;
    const a=build(e.a),b=build(e.b),action:RelationsAction={type:'combine',op:e.op,a,b};state=stepRelations(state,action);actions.push(action);return state.active!;
  }
  build(expression);return {state,actions};
}
function fold(initial:RelationsState,ids:string[],op:RelationsOp){let state=initial,id=ids[0];for(const b of ids.slice(1)){const a:RelationsAction={type:'combine',op,a:id,b};state=stepRelations(state,a);id=state.active!;}return {state,id,correct:matches(state.cases,state.concepts.find(c=>c.id===id)!.accepts)};}
function saturate(initial:RelationsState){
  let state=initial,firstWin:number|null=null,rounds=0;
  for(;;){let added=0;rounds++;const ids=state.concepts.map(c=>c.id);
    for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)for(const op of ['all','either'] as const){const action:RelationsAction={type:'combine',op,a:ids[i],b:ids[j]};if(!inspectRelations(state,action).novel)continue;state=stepRelations(state,action);added++;if(state.status==='won'&&firstWin===null)firstWin=state.actions.length;}
    if(!added)return {state,firstWin,rounds};
  }
}
function substitute(expression:RelationsExpression,from:string,to:string):RelationsExpression {
  if('source'in expression)return {source:expression.source===from?to:expression.source};
  return {op:expression.op,a:substitute(expression.a,from,to),b:substitute(expression.b,from,to)};
}
function errorsFor(state:RelationsState,id:string){
  const bits=state.concepts.find(c=>c.id===id)!.accepts;
  return {falseAccept:state.cases.filter((c,i)=>c.required==='reject'&&bits[i]==='1').length,falseReject:state.cases.filter((c,i)=>c.required==='accept'&&bits[i]==='0').length};
}
function sharedCaseConflict(a:RelationsState,b:RelationsState){
  for(const one of a.cases)for(const two of b.cases)if(one.signals.join('')===two.signals.join('')&&one.required!==two.required)return {signals:one.signals,a:{scenario:a.scenario,case:one.id,required:one.required},b:{scenario:b.scenario,case:two.id,required:two.required}};
  return null;
}
function thresholdTemplate(initial:RelationsState,pairing=[0,1,2,3]):RelationsExpression {
  const independent=initial.concepts.filter((c,i,all)=>all.findIndex(other=>other.accepts===c.accepts)===i);
  const [a,b,c,d]=pairing.map(index=>independent[index].expression),dual=getScenario(initial.scenario).threshold===3;
  const inner:RelationsOp=dual?'all':'either',outer:RelationsOp=dual?'either':'all';
  const make=(op:RelationsOp,a:RelationsExpression,b:RelationsExpression):RelationsExpression=>({op,a,b});
  return make(inner,make(inner,make(outer,make(inner,a,b),make(inner,c,d)),make(outer,a,b)),make(outer,c,d));
}
export function screenRelations(){
  const rows=scenarios.map(scenario=>{
    const initial=createRelations(scenario),space=closure(initial),target=[...space.known.values()].find(e=>matches(initial.cases,e.bits))!;
    const witness=program(initial,target.expression),saturation=saturate(initial),and=fold(initial,names,'all'),or=fold(initial,names,'either');
    const allKnownAnd=fold(saturation.state,saturation.state.concepts.map(c=>c.id),'all'),allKnownOr=fold(saturation.state,saturation.state.concepts.map(c=>c.id),'either');
    const substitutions=[];
    for(let i=0;i<initial.concepts.length;i++)for(let j=i+1;j<initial.concepts.length;j++)if(initial.concepts[i].accepts===initial.concepts[j].accepts){const changed=substitute(target.expression,names[i],names[j]);substitutions.push({from:names[i],to:names[j],sameJudgment:evaluateExpression(changed,initial)===target.bits});}
    const replay=replayRelations(scenario.id,witness.actions),crossScenario=scenarios.map(other=>({scenario:other.id,works:matches(createRelations(other).cases,evaluateExpression(target.expression,createRelations(other)))}));
    const alternatives=[[0,1,2,3],[0,2,1,3],[0,3,1,2]].map(pairing=>{
      const construction=program(initial,thresholdTemplate(initial,pairing));return {pairing,actions:construction.actions.length,won:construction.state.status==='won',program:construction.actions};
    });
    return {scenario:scenario.id,independentInputConditions:new Set(initial.concepts.map(c=>c.accepts)).size,allGuardsCorrect:and.correct,eitherEverySignalCorrect:or.correct,allKnownAndCorrect:allKnownAnd.correct,allKnownOrCorrect:allKnownOr.correct,blanketErrors:{all:errorsFor(and.state,and.id),either:errorsFor(or.state,or.id)},reachableConditions:space.known.size,minimumExpressionTreeOperations:target.cost,witnessActions:witness.actions.length,witness:witness.actions,replayWon:replay.status==='won',saturation:{firstWin:saturation.firstWin,totalNovelActions:saturation.state.actions.length,rounds:saturation.rounds,alwaysWins:saturation.state.status==='won'},substitutions,crossScenario,adaptiveThresholdTemplate:{won:alternatives[0].won,actions:alternatives[0].actions,requiresContextInference:'Find four distinct source columns; infer the required threshold from the public judgments. Reuse the same symmetric threshold construction after that.'},alternatives};
  });
  const first=createRelations(scenarios[0]),second=createRelations(scenarios[1]);
  const stageInitial=createRelations('interleaved'),stageTarget=createRelations('stricter-judgment'),stageWitness=program(stageInitial,thresholdTemplate(stageInitial));
  const changeJudgments=(state:RelationsState)=>updateStatus({...structuredClone(state),scenario:stageTarget.scenario,cases:structuredClone(stageTarget.cases),status:'playing'});
  const warm=changeJudgments(stageWitness.state),warmTarget=[...closure(warm).known.values()].find(entry=>matches(warm.cases,entry.bits))!,continuation=program(warm,warmTarget.expression);
  const saturated=changeJudgments(saturate(stageInitial).state);
  return {
    version:RELATIONS_VERSION,hypothesis:'Transparent predicate composition can move difficulty from recipe search to inference about overlapping and independent cases.',rows,
    contextBlindImpossibilityWitness:sharedCaseConflict(first,second),
    stagedCounterfactual:{from:'interleaved',to:'stricter-judgment',note:'Same signals and cases, changed required judgments. This is an analysis of possible progression, not an implemented automatic campaign.',firstStageActions:stageWitness.actions.length,secondGoalAlreadyPresentAfterIntentionalFirstStage:warm.status==='won',additionalIntentionalActions:continuation.actions.length,continuation:continuation.actions,replayWon:continuation.state.status==='won',secondGoalAlreadyPresentAfterFullSaturation:saturated.status==='won'},
    assessment:{
      allSafeguardsShortcutRejected:rows.every(r=>!r.allGuardsCorrect&&!r.eitherEverySignalCorrect),
      saturationStillUniversal:rows.every(r=>r.saturation.alwaysWins),
      saturationInterpretation:'Generic exhaustive solvability, not a short winning routine: first win takes157–158 novel actions versus7 intentional actions in this enumeration order.',
      commonAdaptiveRoutine:rows.every(r=>r.adaptiveThresholdTemplate.won),
      commonAdaptiveRoutineInterpretation:'After identifying the independent columns and required threshold, a symmetric seven-combination construction works in every context. That may be learned abstraction or repetitive ceremony; first-play observation must distinguish them.',
      promotion:'Unproven logical construction probe. Survives blanket AND/OR and fixed-expression shortcuts. Requires a fresh player assessment before any fun or progression claim.',
    },
  };
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(screenRelations(),null,2));
