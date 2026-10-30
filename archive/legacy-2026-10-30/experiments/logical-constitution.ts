import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';

/** Binding wills, not allocating material. Original toy rules, not social science. */
export const CONSTITUTION_VERSION='constitution-1';
export const SCENARIO_IDS=['harbor','observatory','refuge'] as const;
type Town='a'|'b'|'c'|'d';
type Policy='open'|'shelter';
export type Action={type:'combine';a:string;b:string};
export interface Council {members:Town[];founder:Town}
export interface Concept {id:string;members:Town[];founder:Town;label:string}
export interface Episode {id:string;needs:Record<Town,Policy>}
export interface Outcome {
  success:boolean;requirements:{requirement:string;met:boolean}[];
  works:{id:string;name:string;ends:Town[];completed:boolean}[];
  episodes:{id:string;policies:Record<Town,Policy>;protected:Town[];harmed:Town[]}[];
}
export interface State {
  version:string;scenario:string;seed:number;councils:Council[];concepts:Concept[];
  status:'playing'|'won'|'lost';actions:Action[];message:string;outcome?:Outcome;
}
const towns:Town[]=['a','b','c','d'];
const episodes:Episode[]=[
  {id:'first-climate',needs:{a:'open',b:'shelter',c:'open',d:'shelter'}},
  {id:'changed-climate',needs:{a:'shelter',b:'shelter',c:'open',d:'open'}},
];
const works=[
  {id:'bridge-ab',name:'Harbor bridge',ends:['a','b'] as Town[]},
  {id:'observatory-ac',name:'Shared observatory',ends:['a','c'] as Town[]},
  {id:'refuge-cd',name:'Common refuge',ends:['c','d'] as Town[]},
  {id:'canal-bd',name:'Storm canal',ends:['b','d'] as Town[]},
];
const scenarioData:Record<string,{title:string;work:string;protectedTown:Town}>={
  harbor:{title:'A harbor that can change',work:'bridge-ab',protectedTown:'a'},
  observatory:{title:'A shared sky, a changing shore',work:'observatory-ac',protectedTown:'a'},
  refuge:{title:'An enduring refuge',work:'refuge-cd',protectedTown:'c'},
};
function clone<T>(value:T):T{return structuredClone(value);}
const order=(a:Council,b:Council)=>a.members.join('').localeCompare(b.members.join(''));
const councilId=(c:Council)=>c.members.length===1?c.members[0]:`council:${c.members.join('')}:${c.founder}`;
function groupOf(state:State,town:Town){return state.councils.find(c=>c.members.includes(town))!;}
function policy(council:Council,episode:Episode):Policy {
  const open=council.members.filter(t=>episode.needs[t]==='open').length;
  if(open*2===council.members.length)return episodes[0].needs[council.founder];
  return open*2>council.members.length?'open':'shelter';
}
/** Public consequences of the current constitution, whether sealed or not. */
export function forecast(state:State,binding=true):Outcome {
  const scenario=scenarioData[state.scenario];
  const completedWorks=works.map(work=>({...clone(work),completed:groupOf(state,work.ends[0]).members.includes(work.ends[1])}));
  const resolved=episodes.map(episode=>{
    const policies=Object.fromEntries(towns.map(t=>[t,binding?policy(groupOf(state,t),episode):episode.needs[t]])) as Record<Town,Policy>;
    return {id:episode.id,policies,protected:towns.filter(t=>policies[t]===episode.needs[t]),harmed:towns.filter(t=>policies[t]!==episode.needs[t])};
  });
  const requirements=[
    {requirement:`Complete ${works.find(w=>w.id===scenario.work)!.name}`,met:completedWorks.some(w=>w.id===scenario.work&&w.completed)},
    {requirement:`Keep ${scenario.protectedTown.toUpperCase()} habitable in BOTH climates`,met:resolved.every(e=>e.protected.includes(scenario.protectedTown))},
  ];
  return {success:requirements.every(r=>r.met),requirements,works:completedWorks,episodes:resolved};
}
export function createConstitution(scenario='harbor',seed=0):State {
  if(!scenarioData[scenario])throw new Error('Unknown constitution encounter.');
  const councils=towns.map(t=>({members:[t],founder:t}));
  return {version:CONSTITUTION_VERSION,scenario,seed,councils,concepts:councils.map(c=>({...clone(c),id:councilId(c),label:`Council ${c.members[0].toUpperCase()}`})),status:'playing',actions:[],message:'Four independent wills. Every binding and its complete consequences are inspectable.'};
}
export function stepConstitution(state:State,action:Action):State {
  if(state.version!==CONSTITUTION_VERSION)throw new Error('Different constitution rules version.');
  if(state.status!=='playing')throw new Error('This constitution is sealed; the encounter has ended.');
  if(!action||action.type!=='combine'||typeof action.a!=='string'||typeof action.b!=='string')throw new Error('Use combine with two displayed concept IDs.');
  const next=clone(state);
  if(new Set([action.a,action.b]).size===2&&[action.a,action.b].includes('world')&&[action.a,action.b].includes('constitution')){
    next.outcome=forecast(next);next.status=next.outcome.success?'won':'lost';next.actions.push(clone(action));next.message=next.status==='won'?'The constitution meets the encounter requirements. Its benefits and harms remain visible.':'The constitution fails a stated requirement. No material was spent; the binding arrangement did not achieve this encounter.';return next;
  }
  const a=next.concepts.find(c=>c.id===action.a),b=next.concepts.find(c=>c.id===action.b);
  if(!a||!b)throw new Error('Choose two known councils, or combine constitution with world to seal.');
  const left=groupOf(next,a.members[0]),right=groupOf(next,b.members[0]);
  if(left===right)throw new Error('Those ingredients already belong to one binding will. Repeating the union changes nothing.');
  const joined:Council={members:[...left.members,...right.members].sort() as Town[],founder:left.founder};
  next.councils=next.councils.filter(c=>c!==left&&c!==right).concat(joined).sort(order);
  const id=councilId(joined);
  if(!next.concepts.some(c=>c.id===id))next.concepts.push({...clone(joined),id,label:`Binding council ${joined.members.join('').toUpperCase()} · founding voice ${joined.founder.toUpperCase()}`});
  next.actions.push(clone(action));next.message=`${joined.members.join(', ').toUpperCase()} now act as one will. Both ingredient concepts remain known, but binding is transitive and cannot be dissolved inside this encounter. ${joined.founder.toUpperCase()}'s original purpose settles ties.`;
  return next;
}
export function legalActions(state:State):Action[] {
  if(state.status!=='playing')return [];
  const actions:Action[]=[];
  // One public representative for every distinct ordered union consequence.
  for(const a of state.councils)for(const b of state.councils)if(a!==b)actions.push({type:'combine',a:a.founder,b:b.founder});
  actions.push({type:'combine',a:'constitution',b:'world'});return actions;
}
export function semanticKey(state:State):string {
  return JSON.stringify([state.version,state.scenario,state.status,state.councils.map(c=>[c.members.join(''),c.founder])]);
}
export function outcomeProfile(state:State){
  const result=state.outcome??forecast(state);
  return {terminal:state.status!=='playing',status:state.status,feasible:result.success,
    dimensions:[
      {id:'completed-joint-works',value:result.works.filter(w=>w.completed).length,direction:'max' as const},
      {id:'protected-in-first-climate',value:result.episodes[0].protected.length,direction:'max' as const},
      {id:'protected-in-changed-climate',value:result.episodes[1].protected.length,direction:'max' as const},
    ],consequences:result};
}
export function observeConstitution(state:State){
  return {version:CONSTITUTION_VERSION,scenario:state.scenario,title:scenarioData[state.scenario].title,status:state.status,
    goal:forecast(state).requirements.map(r=>r.requirement),
    meaning:'Combine means bind several independent wills into one enduring actor. The question is what to join, what to leave independent, and which purpose should resolve a tie.',
    rules:[
      'All four councils and every discovered council remain available as concepts. There are no material supplies, credits, action limits, deadlines or scores.',
      'Combining councils binds their CURRENT political groups. All members of a group act together under one policy. Binding is transitive and irreversible inside the encounter; selecting an old ingredient does not detach its members.',
      'For each announced climate, members vote for their local need. The majority chooses the shared policy. A tie preserves the founding voice’s ORIGINAL first-climate need. In an ordered combine A+B, the current group containing A keeps its founding voice.',
      'A joint work is completed exactly when both endpoints belong to one binding group. More political union enables more joint works, but a shared policy can mismatch different local needs.',
      'Policies do not consume anything. A town is protected when its group policy matches its local need for that climate. Both future climate and complete forecasts are public now.',
      'Combine constitution + world when you choose to seal this arrangement. Both announced climates resolve automatically; no waiting or repeated maintenance is required.',
      'Meeting the two named encounter requirements wins. There is no single weighted best ending: inspect which works happen and which towns are protected or harmed. More of one benefit can forfeit another.',
      'These are invented binding-will rules, not a claim that real cooperation must require centralized uniformity. Consultation without binding is deliberately a different tested counterfactual.',
    ],
    climates:clone(episodes),jointWorks:clone(works),councils:clone(state.councils),
    concepts:[...clone(state.concepts),{id:'constitution',label:'The current binding arrangement'},{id:'world',label:'The announced world: seal and resolve'}],
    actionSchema:{type:'combine',a:'known council id (founding voice survives)',b:'known council id; or constitution + world to seal'},
    legalActions:legalActions(state),consequencesIfSealed:forecast(state),message:state.message};
}
export function previewConstitution(state:State,action:Action){
  const after=stepConstitution(state,action);
  return {status:after.status,councils:clone(after.councils),newConcepts:after.concepts.filter(c=>!state.concepts.some(old=>old.id===c.id)),consequencesIfSealed:forecast(after),message:after.message};
}
export const status=(state:State)=>state.status;

function dominates(a:number[],b:number[]){return a.every((v,i)=>v>=b[i])&&a.some((v,i)=>v>b[i]);}
function enumerate(scenario:string){
  const initial=createConstitution(scenario),queue=[{state:initial,path:[] as Action[]}],seen=new Set([semanticKey(initial)]),terminals:{state:State;path:Action[]}[]=[];
  for(const node of queue)for(const action of legalActions(node.state)){
    const state=stepConstitution(node.state,action),key=semanticKey(state);if(seen.has(key))continue;seen.add(key);const path=[...node.path,action];
    if(state.status==='playing')queue.push({state,path});else terminals.push({state,path});
  }
  return {nodes:queue,terminals};
}
/** Exact model diagnosis. Objective profiles are world facts, not fun scores. */
export function screenConstitution(){
  const screens=SCENARIO_IDS.map(scenario=>{
    const graph=enumerate(scenario),viable=graph.terminals.filter(t=>t.state.status==='won');
    const frontier=viable.filter(candidate=>!viable.some(other=>dominates(outcomeProfile(other.state).dimensions.map(d=>d.value),outcomeProfile(candidate.state).dimensions.map(d=>d.value))));
    const uniqueProfiles=new Map<string,typeof frontier[number]>();for(const node of frontier)uniqueProfiles.set(JSON.stringify(outcomeProfile(node.state).dimensions.map(d=>d.value)),node);
    const allUnion=graph.terminals.filter(t=>t.state.councils.length===1).map(t=>({founder:t.state.councils[0].founder,...outcomeProfile(t.state)}));
    return {scenario,reachablePlayingStates:graph.nodes.length,terminalStates:graph.terminals.length,viableTerminalStates:viable.length,
      nondominatedDistinctProfiles:uniqueProfiles.size,nondominatedWitnesses:[...uniqueProfiles.values()].map(t=>({path:t.path,councils:t.state.councils,outcome:outcomeProfile(t.state)})),allUnion};
  });
  const baseline=enumerate('harbor').terminals.map(t=>{
    const result=forecast(t.state,false);return {partition:t.state.councils.map(c=>c.members.join('')).join('|'),vector:[result.works.filter(w=>w.completed).length,...result.episodes.map(e=>e.protected.length)]};
  });
  const baselineFrontier=baseline.filter(c=>!baseline.some(other=>dominates(other.vector,c.vector)));
  const sharedPartitions=enumerate('harbor').terminals.filter(t=>SCENARIO_IDS.every(s=>forecast({...t.state,scenario:s}).success));
  const mistaken=stepConstitution(createConstitution('harbor'),{type:'combine',a:'b',b:'a'});
  const repaired=stepConstitution(mistaken,{type:'combine',a:'b',b:'c'});
  const cautious=stepConstitution(createConstitution('harbor'),{type:'combine',a:'a',b:'b'});
  const immutable=createConstitution(),saved=JSON.stringify(immutable),one=stepConstitution(immutable,{type:'combine',a:'a',b:'b'}),preview=previewConstitution(immutable,{type:'combine',a:'a',b:'b'});
  if(JSON.stringify(immutable)!==saved)throw new Error('Constitution transition mutated input.');
  if(JSON.stringify(preview.consequencesIfSealed)!==JSON.stringify(forecast(one)))throw new Error('Preview mismatch.');
  if(!immutable.concepts.every(c=>one.concepts.some(next=>next.id===c.id)))throw new Error('A concept was spent.');
  return {version:CONSTITUTION_VERSION,hypothesis:'Binding independent wills can create informed, nonresource tradeoffs between joint action, local fit and adaptation to a public change.',
    iteration:{baseline:'Consultation enables the same joint works while every town still follows its local need.',baselineNondominatedPartitions:[...new Set(baselineFrontier.map(c=>c.partition))],baselineConclusion:'All-union dominates every lesser partition. Reject this no-downside version.',
      revision:'Binding now means one shared policy per group. Only this causal rule changes; concepts remain inexhaustible and no quota is introduced.'},
    screens,onePartitionWinsEveryContext:sharedPartitions.length>0,sharedPartitionCount:sharedPartitions.length,
    recoverableCommitment:{mistake:{action:{type:'combine',a:'b',b:'a'},outcome:outcomeProfile(mistaken)},repair:{action:{type:'combine',a:'b',b:'c'},outcome:outcomeProfile(repaired)},cautiousAlternative:{action:{type:'combine',a:'a',b:'b'},outcome:outcomeProfile(cautious)},interpretation:'The wrong founding voice first fails A’s present protection. Adding C restores both stated requirements, but C then loses protection in the changed climate. Recovery is another binding relation, not an extra material payment or an Undo.'},
    verification:{immutableInput:true,exactPreview:true,parentsRetained:true},
    limitations:['Pareto profiles establish incompatible consequences, not enjoyable decisions.','There are only four towns and three correlated encounters. Observatory has one viable binding group, so it is a teaching/constraint case rather than an expressive-choice claim.','An unrestricted federation that coordinates projects while preserving every local policy would dominate this toy operator. The premise is fusion into one will, not all possible political organization.','No agent or human play evidence is included in this screen.','Sealing is an endpoint commitment, not an additional interesting synthesis; count it separately in decision-density analysis.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenConstitution();mkdirSync('results',{recursive:true});writeFileSync('results/logical-constitution-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
