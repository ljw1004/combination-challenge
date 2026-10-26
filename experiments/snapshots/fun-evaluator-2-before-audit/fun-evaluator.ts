/** Experience hypotheses and counterfactual evidence; never a measured human-fun score. */
import { analyzeDecision, repetitionFinding } from './decision-space.ts';
import { LOGICAL_GAMES, replayLogical } from './logical-games.ts';
import type { LogicalRun } from './logical-games.ts';

export interface FunDesign {
  id:string;registration:string;source:string;
  proposedPleasures:string[];experienceEngine:string;
  valuedObject:string|null;narrativeQuestion:string|null;renewalPromise:string|null;
  combining:{semantics:string;skill:string;consequences:string;meaning:string};
  falsifiers:string[];nextExperiment:string;
}
const record=(value:unknown):Record<string,unknown>=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const concepts=(observation:unknown)=>Array.isArray(record(observation).concepts)?record(observation).concepts as {id:string}[]:[];
function lookup(value:unknown,path:string):unknown {
  return path.split('.').reduce<unknown>((current,key)=>{
    if(['__proto__','constructor','prototype'].includes(key)||!current||typeof current!=='object')return undefined;
    return Object.prototype.hasOwnProperty.call(current,key)?(current as Record<string,unknown>)[key]:undefined;
  },value);
}
export function checkPredictions(run:LogicalRun){
  return run.decisions.flatMap(decision=>{
    const prediction=record(decision.prediction),assertions=Array.isArray(prediction.assertions)?prediction.assertions:[];
    const checks=assertions.flatMap(raw=>{const assertion=record(raw);return typeof assertion.path==='string'&&Object.hasOwn(assertion,'equals')?[{path:assertion.path,equals:assertion.equals}]:[];});
    if(typeof prediction.expectedStatus==='string')checks.push({path:'status',equals:prediction.expectedStatus});
    return checks.map(check=>({decision:decision.index,path:check.path,predicted:check.equals,actual:lookup(decision.observation,check.path),correct:JSON.stringify(check.equals)===JSON.stringify(lookup(decision.observation,check.path))}));
  });
}
export function episodeAccounts(run:LogicalRun){
  const report=record(run.report),reported=Array.isArray(report.episodes)?report.episodes:[];
  const annotated=new Map<string,{id:string;decisions:number[];accounts:unknown[]}>();
  for(const decision of run.decisions){
    const account=record(decision.prediction);if(typeof account.episode!=='string')continue;
    const episode=annotated.get(account.episode)??{id:account.episode,decisions:[],accounts:[]};episode.decisions.push(decision.index);episode.accounts.push(account);annotated.set(account.episode,episode);
  }
  return {reported,annotated:[...annotated.values()],boundaryStatus:reported.length||annotated.size?'Player-supplied episode accounts; not independently inferred cognition.':'Unknown; command count is not decision-episode count.'};
}
export function continuationEvidence(run:LogicalRun,otherRuns:LogicalRun[]=[]){
  const intent=run.continuation;
  const inWorld=run.decisions.filter(decision=>decision.phase==='elective').map(decision=>decision.index);
  const linked=intent?.nextSession?otherRuns.find(other=>other.id===intent.nextSession):undefined;
  const actualActions=inWorld.length+(linked?.decisions.length??0);
  const report=record(run.report);
  return {checkpoints:run.checkpoints??null,intentionRecordedBeforeElectivePlay:intent??null,electiveDecisionIndices:inWorld,
    linkedSession:linked?{id:linked.id,decisions:linked.decisions.length,condition:linked.condition}:null,
    actualElectiveActions:actualActions,reportedFutureWish:report.wantAnother??null,reportedRenewedIntention:report.renewedIntention??null,
    reportedClosure:report.closure??report.stoppingReason??null,
    finding:actualActions&&intent?'Elective action occurred under the test prompt, following a recorded intention.':intent?'A further intention was recorded, but no elective action is present.':run.checkpoints?.length?'The assigned exposure ended without recorded elective continuation.':'No stopping/continuation protocol was recorded; instructed completion establishes no appetite.',
    limitation:'This is behavior under an agent task, not voluntary human enjoyment. A stated wish, satisfying closure and actual elective action are separate evidence.'};
}
export function structuralReuse(run:LogicalRun){
  const established=new Map<string,number>();for(const concept of concepts(run.initialObservation))established.set(concept.id,-1);
  const uses:{decision:number;concept:string;createdAt:number;priorStageWinner:boolean}[]=[];let previous=run.initialObservation;
  for(const decision of run.decisions){
    const action=record(decision.action),completed=record(previous).completed;
    const winners=Array.isArray(completed)?completed.map(item=>record(item).winner):[];
    for(const id of [action.a,action.b])if(typeof id==='string'&&established.has(id)&&established.get(id)!>=0)uses.push({decision:decision.index,concept:id,createdAt:established.get(id)!,priorStageWinner:winners.includes(id)});
    for(const concept of concepts(decision.observation))if(!established.has(concept.id))established.set(concept.id,decision.index);
    previous=decision.observation;
  }
  return {uses,interpretation:'A structural use may be a normal prerequisite. Meaningful development requires its role and player experience, not this count alone.'};
}
export function evaluateFun(run:LogicalRun,design:FunDesign,otherRuns:LogicalRun[]=[],searchLimit=2000){
  const game=LOGICAL_GAMES[run.game],final=replayLogical(run),report=record(run.report),episodes=episodeAccounts(run),predictions=checkPredictions(run);
  const continuation=continuationEvidence(run,otherRuns),reuse=structuralReuse(run);
  const repetitions=Array.isArray(report.repetition)?report.repetition.map(item=>{const r=record(item);return {account:item,...repetitionFinding(r.judgment,typeof r.changedRole==='boolean'?r.changedRole:null)};}):[];
  const counterfactuals:unknown[]=[];
  if(game.decisionDomain){
    let state=game.create(run.scenario,run.seed);
    for(const decision of run.decisions){
      const evidence=analyzeDecision(game.decisionDomain,state,searchLimit);
      const after=game.step(state,decision.action),key=game.decisionDomain.key(after),chosen=evidence.branches.find(branch=>branch.immediateKey===key);
      counterfactuals.push({decision:decision.index,complete:evidence.complete,distinctImmediateEffects:evidence.distinctImmediateEffects,
        feasibleEndingCount:evidence.feasibleEndings.length,nondominatedProfiles:[...new Set(evidence.nondominatedEndings.map(ending=>JSON.stringify(ending.objectives)))].length,
        sameFeasibleFutures:evidence.sameFeasibleFutures,chosen:chosen?{complete:chosen.complete,feasibleEndingCount:new Set(chosen.feasibleEndings.map(item=>item.ending.key)).size}:null,
        alternatives:evidence.branches.map(branch=>({action:branch.action,complete:branch.complete,feasibleEndings:branch.feasibleEndings.map(item=>({outcome:item.ending,path:item.path}))})),interpretation:evidence.interpretation});
      state=after;
    }
  }
  const intentions=run.decisions.flatMap(decision=>{const account=record(decision.prediction);return account.intention||account.question?[{decision:decision.index,intention:account.intention??account.question,expected:account.expected??account.expectedResponse??account.expectedEffect??null}]:[];});
  const narrative=report.narrative??report.narrativeOrConceptThatMattered??report.narrativeQuestion??null;
  const experience={
    designPromise:{proposedPleasures:design.proposedPleasures,engine:design.experienceEngine,valuedObject:design.valuedObject,narrativeQuestion:design.narrativeQuestion,renewalPromise:design.renewalPromise},
    intentionsBeforeActions:intentions,reportedExperience:report.experience??report.worldResponseNoticed??null,
    noticedResponsesFromEpisodes:episodes.reported.flatMap(item=>{const e=record(item);return e.noticedResponse?[e.noticedResponse]:[];}),
    narrativeOrConceptualReport:narrative,continuation,
    provisionalInterpretation:continuation.actualElectiveActions>0?'The invitation produced elective action in this agent protocol; inspect its intention and world response before attributing absorption.':report.renewedIntention===null&&report.wantAnother===false?'This player reports no renewed intention after the local outcome. The local decision and continuing absorption are distinct.':'Interest across time remains an open hypothesis; preserve specific appreciation and stopping reasons without inferring them from victory.',
  };
  return {version:'fun-evidence-2',doctrine:'docs/history/what-is-fun/revision-5.md',run:run.id,game:run.game,modelVersion:run.version,design,
    experienceAcrossTime:experience,
    evidence:{mechanical:{replay:'pass',status:game.status(final),publicInitialObservation:run.initialObservation,counterfactuals,structuralReuse:reuse},
      player:{report:run.report??null,episodes,repetitions,assertionChecks:predictions,unscoredPredictionDecisions:run.decisions.filter(decision=>decision.prediction!==undefined).length-new Set(predictions.map(check=>check.decision)).size},
      access:{condition:run.condition,protocol:run.protocolVersion??'legacy',previewCalls:run.previews?.length??null,embeddedForecastsAreAvailableInformation:true,understandingIsNotInferredFromAvailability:true}},
    attention:{committedActions:run.decisions.length,annotatedEpisodeIds:episodes.annotated.length,reportedEpisodeAccounts:episodes.reported.length,
      humanPlaytime:null,agentElapsedMs:run.decisions.at(-1)?.atMs??null,meaning:'Action and episode counts have named units. Agent elapsed time includes deliberation and tool delays. Neither is a human fun-per-minute estimate; batching commands earns no automatic improvement.'},
    principleCoverage:[
      {id:'F1',implementation:'Named pleasure hypotheses and falsifiers in the design; no universal tradeoff gate.'},
      {id:'F2',implementation:'Available observations and previews separated from checked assertions and unscored player accounts.'},
      {id:'F3',implementation:game.decisionDomain?'Counterfactual continuation graphs and meaningful ending keys; completeness disclosed.':'No exact domain adapter: counterfactual consequences remain unknown.'},
      {id:'F4',implementation:'Pareto structure is mechanical only. Construction, narrative and valued enactment claims do not fail for lacking multiple optimal endings.'},
      {id:'F5',implementation:episodes.boundaryStatus},
      {id:'F6',implementation:'Explicit repetition reports preserved separately from changed roles. Determinism and repeated syntax carry no penalty.'},
      {id:'F7',implementation:'Prior-result uses and previous-stage winners recorded; no novelty or reuse-count reward.'},
      {id:'F8',implementation:'No fun total or human pacing estimate. Specific units, expertise/access limits and absence of evidence remain explicit.'},
      {id:'F9',implementation:'Design source, registration timing, falsifiers and a next design experiment retained for independent review.'},
      {id:'F10',implementation:'Semantics, skill, consequences and meaning are separately specified. Narrative value can exist with an unchanged algebra.'},
    ],
    nextDesignExperiment:design.nextExperiment,
    limits:['AI report and elective behavior do not establish human enjoyment.','Narrative/aesthetic value is recorded as a player account; no mechanical frontier can verify it.','No overall enjoyment verdict follows from passing the safeguards. The independent critic must inspect the proposed and observed experience.']};
}
