import {pathToFileURL} from 'node:url';

/** A separate experiment: preserve relations-1 state hashes and captured games. */
export const RELATIONS_VERSION='relations-2';
export type RelationsOp='all'|'either';
export type RelationsAction={type:'combine';op:RelationsOp;a:string;b:string};
export type RelationsExpression={source:string}|{op:RelationsOp;a:RelationsExpression;b:RelationsExpression};
export interface RelationsCase {id:string;signals:boolean[];required:'accept'|'reject'}
export interface RelationsConcept {id:string;label:string;accepts:string;expression:RelationsExpression}
export interface RelationsScenario {id:string;title:string;meaning:string}
export interface RelationsState {
  version:string;scenario:string;seed:number;cases:RelationsCase[];concepts:RelationsConcept[];
  status:'playing'|'won';winner?:string;active:string|null;actions:RelationsAction[];message:string;
}
export interface RelationsPreview {id:string;label:string;accepts:string;novel:boolean;wins:boolean}
export const scenarios:RelationsScenario[]=[
  {id:'complete-coalitions',title:'Complete coalitions',meaning:'Some complete coalitions suffice. An incomplete coalition does not gain the missing relationship merely by collecting an unrelated input. The complete public cases specify which support combinations are sufficient.'},
  {id:'essential-anchor',title:'An essential anchor',meaning:'One input is indispensable. Other inputs provide either direct support or a jointly sufficient substitute. The public cases identify the anchor and these alternative relationships.'},
  {id:'neighboring-links',title:'Neighboring links',meaning:'Some pairs make a sufficient link, while other pairs do not. Any world containing a sufficient link is acceptable. The public cases show every pairing and larger combination.'},
];
const names=['A','B','C','D'];
const judgments:Record<string,(v:boolean[])=>boolean>={
  'complete-coalitions':([a,b,c,d])=>a&&b||c&&d,
  'essential-anchor':([a,b,c,d])=>a&&(b||c&&d),
  'neighboring-links':([a,b,c,d])=>a&&b||b&&c||c&&d,
};
const bits=(a:string,b:string,op:RelationsOp)=>[...a].map((v,i)=>op==='all'?v==='1'&&b[i]==='1'?'1':'0':v==='1'||b[i]==='1'?'1':'0').join('');
const wins=(state:RelationsState,accepts:string)=>state.cases.every((c,i)=>(accepts[i]==='1')===(c.required==='accept'));
function updateStatus(state:RelationsState):RelationsState {const winner=state.concepts.find(c=>wins(state,c.accepts));state.status=winner?'won':'playing';if(winner)state.winner=winner.id;else delete state.winner;return state;}
function getScenario(id:string){const scenario=scenarios.find(s=>s.id===id);if(!scenario)throw new Error('Unknown relations-2 scenario.');return scenario;}
function shuffled(values:number[],seed:number){let n=seed>>>0;if(!n)return values;for(let i=values.length-1;i>0;i--){n^=n<<13;n^=n>>>17;n^=n<<5;const j=(n>>>0)%(i+1);[values[i],values[j]]=[values[j],values[i]];}return values;}
export function createRelations(scenario:string|RelationsScenario='complete-coalitions',seed=0):RelationsState {
  const id=typeof scenario==='string'?scenario:scenario.id;getScenario(id);
  const cases=shuffled(Array.from({length:16},(_,i)=>i),seed).map(world=>{const signals=names.map((_,i)=>!!(world&(1<<i)));return {id:`case-${world+1}`,signals,required:judgments[id](signals)?'accept' as const:'reject' as const};});
  const concepts=names.map((label,i)=>({id:label,label,accepts:cases.map(c=>c.signals[i]?'1':'0').join(''),expression:{source:label}}));
  return updateStatus({version:RELATIONS_VERSION,scenario:id,seed,cases,concepts,status:'playing',active:null,actions:[],message:''});
}
export function inspectRelations(state:RelationsState,action:RelationsAction):RelationsPreview {
  if(state.version!==RELATIONS_VERSION)throw new Error('Different relations rules version.');
  if(action.type!=='combine'||!['all','either'].includes(action.op))throw new Error('Combine with ALL or EITHER.');
  const a=state.concepts.find(c=>c.id===action.a),b=state.concepts.find(c=>c.id===action.b);if(!a||!b)throw new Error('Both inputs must be established concepts.');
  const accepts=bits(a.accepts,b.accepts,action.op),known=state.concepts.find(c=>c.accepts===accepts);
  return {id:known?.id??`condition:${accepts}`,label:known?.label??`(${a.label} ${action.op==='all'?'AND':'OR'} ${b.label})`,accepts,novel:!known,wins:wins(state,accepts)};
}
export function stepRelations(state:RelationsState,action:RelationsAction):RelationsState {
  const preview=inspectRelations(state,action),next=structuredClone(state);
  if(preview.novel){const a=next.concepts.find(c=>c.id===action.a)!,b=next.concepts.find(c=>c.id===action.b)!;next.concepts.push({id:preview.id,label:preview.label,accepts:preview.accepts,expression:{op:action.op,a:structuredClone(a.expression),b:structuredClone(b.expression)}});}
  next.active=preview.id;next.actions.push(structuredClone(action));next.message=preview.novel?`${preview.label} established.`:'That condition already exists. Both inputs remain.';return updateStatus(next);
}
export function observeRelations(state:RelationsState){
  const scenario=getScenario(state.scenario);
  return {version:state.version,scenario:state.scenario,title:scenario.title,status:state.status,winner:state.winner,active:state.active,
    goal:{meaning:scenario.meaning},
    rules:[
      'A case is a possible set of present supports A–D. Its required acceptance is a public goal constraint. This is a construction puzzle, not a claim about how real societies should judge evidence.',
      'Every concept is a condition: the cases it accepts. ALL accepts exactly the intersection of two inputs; EITHER accepts exactly their union.',
      'Establish a condition that accepts every required-accept case and rejects every required-reject case. All sixteen cases and every immediate combination consequence are inspectable.',
      'Both inputs and every discovery remain. Equal resulting conditions reuse the same concept. There are no resource stocks, action quotas, gate limits or deadlines.',
    ],
    actionSchema:{type:'combine',op:['all','either'],a:'current concept id',b:'current concept id'},legalActions:'Any two current concepts with ALL or EITHER. These rules determine every preview.',
    caseOrder:state.cases.map(c=>c.id),cases:state.cases.map(c=>({id:c.id,signals:Object.fromEntries(names.map((name,i)=>[name,c.signals[i]])),required:c.required})),concepts:state.concepts.map(c=>({id:c.id,label:c.label,accepts:c.accepts})),message:state.message};
}
export function legalRelationsActions(state:RelationsState):RelationsAction[]{const actions:RelationsAction[]=[];for(let a=0;a<state.concepts.length;a++)for(let b=a;b<state.concepts.length;b++)for(const op of ['all','either']as const)actions.push({type:'combine',op,a:state.concepts[a].id,b:state.concepts[b].id});return actions;}
export function replayRelations(scenario:string,actions:RelationsAction[],seed=0){return actions.reduce(stepRelations,createRelations(scenario,seed));}

interface Entry {accepts:string;expression:RelationsExpression;cost:number}
function evaluate(expression:RelationsExpression,state:RelationsState):string {return 'source'in expression?state.concepts.find(c=>c.id===expression.source)!.accepts:bits(evaluate(expression.a,state),evaluate(expression.b,state),expression.op);}
function closure(initial:RelationsState){
  const known=new Map<string,Entry>(initial.concepts.map(c=>[c.accepts,{accepts:c.accepts,expression:c.expression,cost:0}]));let changed=true;
  while(changed){changed=false;const all=[...known.values()];for(let a=0;a<all.length;a++)for(let b=a+1;b<all.length;b++)for(const op of ['all','either']as const){const accepts=bits(all[a].accepts,all[b].accepts,op),cost=all[a].cost+all[b].cost+1,old=known.get(accepts);if(!old||cost<old.cost){known.set(accepts,{accepts,cost,expression:{op,a:all[a].expression,b:all[b].expression}});changed=true;}}}
  return known;
}
function build(initial:RelationsState,expression:RelationsExpression){
  let state=initial;const actions:RelationsAction[]=[];
  function visit(e:RelationsExpression):string {const signature=evaluate(e,initial),known=state.concepts.find(c=>c.accepts===signature);if(known)return known.id;if('source'in e)return e.source;const a=visit(e.a),b=visit(e.b),action:RelationsAction={type:'combine',op:e.op,a,b};state=stepRelations(state,action);actions.push(action);return state.active!;}
  const id=visit(expression);return {state,actions,id};
}
function saturate(initial:RelationsState){let state=initial,firstWin:number|null=null;for(;;){let added=0;const ids=state.concepts.map(c=>c.id);for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++)for(const op of ['all','either']as const){const action:RelationsAction={type:'combine',op,a:ids[a],b:ids[b]};if(!inspectRelations(state,action).novel)continue;state=stepRelations(state,action);added++;if(firstWin===null&&state.status==='won')firstWin=state.actions.length;}if(!added)return {state,firstWin};}}
function fold(initial:RelationsState,op:RelationsOp){let state=initial,id=initial.concepts[0].id;for(const c of initial.concepts.slice(1)){state=stepRelations(state,{type:'combine',op,a:id,b:c.id});id=state.active!;}const signature=state.concepts.find(c=>c.id===id)!.accepts;return {correct:wins(state,signature),falseAccept:state.cases.filter((c,i)=>c.required==='reject'&&signature[i]==='1').length,falseReject:state.cases.filter((c,i)=>c.required==='accept'&&signature[i]==='0').length};}
function permutations(values:number[]):number[][] {return values.length?values.flatMap((v,i)=>permutations(values.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];}
const allPermutations=permutations([0,1,2,3]);
function canonicalScenario(id:string,dual=false){return allPermutations.map(p=>Array.from({length:16},(_,world)=>{const v=p.map(i=>!!(world&(1<<i)));return (dual?!judgments[id](v.map(value=>!value)):judgments[id](v))?'1':'0';}).join('')).sort()[0];}
function minimalSufficientCases(state:RelationsState){return state.cases.filter(c=>c.required==='accept'&&!state.cases.some(other=>other.required==='accept'&&other.signals.every((value,i)=>!value||c.signals[i])&&other.signals.some((value,i)=>value!==c.signals[i]))).map(c=>names.filter((_,i)=>c.signals[i]));}
const source=(name:string):RelationsExpression=>({source:name});
const expr=(op:RelationsOp,a:RelationsExpression,b:RelationsExpression):RelationsExpression=>({op,a,b});
function directDnf(state:RelationsState){const terms=minimalSufficientCases(state).map(group=>group.map(source).reduce((a,b)=>expr('all',a,b)));return terms.reduce((a,b)=>expr('either',a,b));}
function changedGoal(state:RelationsState,scenario:string){const target=createRelations(scenario,state.seed);return updateStatus({...structuredClone(state),scenario,cases:target.cases,status:'playing'});}
export function screenRelations(){
  const rows=scenarios.map(scenario=>{const initial=createRelations(scenario),space=closure(initial),target=[...space.values()].find(entry=>wins(initial,entry.accepts))!,witness=build(initial,target.expression),saturation=saturate(initial),dnf=build(initial,directDnf(initial));
    return {scenario:scenario.id,goal:scenario.meaning,minimalSufficientCases:minimalSufficientCases(initial),requiredAcceptCases:initial.cases.filter(c=>c.required==='accept').length,all:fold(initial,'all'),either:fold(initial,'either'),reachableConditions:space.size,minimumExpressionTreeOperations:target.cost,witnessActions:witness.actions.length,witness:witness.actions,witnessExpression:target.expression,replayWon:replayRelations(scenario.id,witness.actions).status==='won',directDnf:{actions:dnf.actions.length,won:dnf.state.status==='won'},saturation:{firstWin:saturation.firstWin,novelActions:saturation.state.actions.length},crossScenario:scenarios.map(other=>({scenario:other.id,works:wins(createRelations(other.id),evaluate(target.expression,createRelations(other.id)))})),canonical:canonicalScenario(scenario.id),dualCanonical:canonicalScenario(scenario.id,true)};
  });
  const equivalence=[];for(let a=0;a<rows.length;a++)for(let b=a+1;b<rows.length;b++)equivalence.push({a:rows[a].scenario,b:rows[b].scenario,equalUpToRenaming:rows[a].canonical===rows[b].canonical,equalUpToDualityAndRenaming:rows[a].canonical===rows[b].dualCanonical});
  let stage=createRelations(scenarios[0].id);const stages=[];
  for(const scenario of scenarios){stage=changedGoal(stage,scenario.id);const alreadyPresent=stage.status==='won',target=[...closure(stage).values()].find(e=>wins(stage,e.accepts))!,construction=build(stage,target.expression);stages.push({scenario:scenario.id,alreadyPresent,additionalActions:construction.actions.length,actions:construction.actions,won:construction.state.status==='won'});stage=construction.state;}
  const full=saturate(createRelations()).state;
  return {version:RELATIONS_VERSION,hypothesis:'Changing composition topology can provide a new inference while shortening execution after the insight.',rows,equivalence,stages,saturationTransfer:scenarios.map(s=>({scenario:s.id,alreadyPresent:changedGoal(full,s.id).status==='won'})),
    assessment:{structurallyDistinct:equivalence.every(e=>!e.equalUpToRenaming&&!e.equalUpToDualityAndRenaming),allAndEitherShortcutFail:rows.every(r=>!r.all.correct&&!r.either.correct),fixedWitnessSolvesEveryContext:rows.some(r=>r.crossScenario.every(c=>c.works)),genericDnfWorksEverywhere:rows.every(r=>r.directDnf.won),genericDnfInterpretation:'Reading minimal accepted cases and OR-ing their AND-terms is one universal construction method. Factoring reduces the last two authored witnesses by one action. That method may turn these into worksheets for an experienced player.',limitation:'These are authored desired relations over a truth table, not a world whose causal relationships change. This screen can support small construction puzzles but cannot establish the intended broader game or human fun.',promotion:'Await experienced-player comparison; do not add more targets merely because the three relations are algebraically different.'}};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(screenRelations(),null,2));
