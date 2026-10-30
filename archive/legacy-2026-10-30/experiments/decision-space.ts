/** Mechanical counterfactual evidence. This module does not estimate enjoyment. */
export interface Objective {id:string;value:number;direction:'max'|'min'}
export interface Ending {key:string;feasible:boolean;objectives:Objective[];meaning:unknown}
export interface DecisionDomain {
  actions(state:unknown):unknown[];
  step(state:unknown,action:unknown):unknown;
  key(state:unknown):string;
  terminal(state:unknown):boolean;
  canStop?(state:unknown):boolean;
  ending(state:unknown):Ending;
}
export function dominates(a:Objective[],b:Objective[]):boolean {
  if(!a.length||a.length!==b.length||a.some((value,i)=>value.id!==b[i].id||value.direction!==b[i].direction))return false;
  const difference=a.map((value,i)=>(value.value-b[i].value)*(value.direction==='max'?1:-1));
  return difference.every(value=>value>=0)&&difference.some(value=>value>0);
}
export function exploreEndings(domain:DecisionDomain,start:unknown,limit=2000){
  const queue=[{state:start,path:[] as unknown[]}],seen=new Set([domain.key(start)]),endings:{ending:Ending;path:unknown[]}[]=[];
  let cursor=0,truncated=false;
  while(cursor<queue.length){
    const node=queue[cursor++];
    if(domain.canStop?.(node.state)||domain.terminal(node.state))endings.push({ending:domain.ending(node.state),path:node.path});
    if(domain.terminal(node.state))continue;
    for(const action of domain.actions(node.state)){
      const state=domain.step(node.state,action),key=domain.key(state);if(seen.has(key))continue;
      if(seen.size>=limit){truncated=true;continue;}
      seen.add(key);queue.push({state,path:[...node.path,action]});
    }
  }
  return {complete:!truncated,states:seen.size,endings};
}
export function analyzeDecision(domain:DecisionDomain,state:unknown,limit=2000){
  const branches=domain.actions(state).map(action=>{
    const next=domain.step(state,action),search=exploreEndings(domain,next,limit);
    return {action,immediateKey:domain.key(next),complete:search.complete,states:search.states,
      feasibleEndings:search.endings.filter(item=>item.ending.feasible),infeasibleEndings:search.endings.filter(item=>!item.ending.feasible).length};
  });
  const all=branches.flatMap(branch=>branch.feasibleEndings.map(item=>item.ending));
  const unique=[...new Map(all.map(ending=>[ending.key,ending])).values()];
  const frontier=unique.filter(ending=>!unique.some(other=>dominates(other.objectives,ending.objectives)));
  const signatures=branches.map(branch=>[...new Set(branch.feasibleEndings.map(item=>item.ending.key))].sort().join('|'));
  return {complete:branches.every(branch=>branch.complete),branches,distinctImmediateEffects:new Set(branches.map(branch=>branch.immediateKey)).size,
    feasibleEndings:unique,nondominatedEndings:frontier,
    sameFeasibleFutures:signatures.length>1&&signatures.every(signature=>signature===signatures[0]),
    interpretation:'Different outcomes or Pareto profiles establish a choice structure, not player interest. Identical feasible futures can locate a later commitment; setup may still support exploration or construction.'};
}

export type RepetitionJudgment='valued'|'unwanted'|'neutral'|'unknown';
export function repetitionFinding(judgment:unknown,changedRole:boolean|null){
  const report=['valued','unwanted','neutral','unknown'].includes(String(judgment))?judgment as RepetitionJudgment:'unknown';
  return {report,changedRole,
    conclusion:report==='valued'?'Player reports value; preserve it independently of novelty.':report==='unwanted'?'Player reports burden; do not invent significance to erase it.':changedRole===true?'A functional role changed; enjoyment remains unestablished.':'No inference about pleasure or burden follows from repetition alone.'};
}
