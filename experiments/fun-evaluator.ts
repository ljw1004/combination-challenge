/** Experience hypotheses and counterfactual evidence; never a measured human-fun score. */
import { analyzeDecision, repetitionFinding } from './decision-space.ts';
import { LOGICAL_GAMES, replayLogical } from './logical-games.ts';
import type { LogicalRun } from './logical-games.ts';
import { normalizeExperienceReport } from './player-experience.ts';
import { primitiveDevelopmentEvidence } from './primitive-development.ts';

export interface FunDesign {
  id:string;registration:string;source:string;
  proposedPleasures:string[];experienceEngine:string;
  valuedObject:string|null;narrativeQuestion:string|null;renewalPromise:string|null;
  combining:{semantics:string;skill:string;consequences:string;meaning:string};
  falsifiers:string[];nextExperiment:string;
  requestedScope?:{decisionRange:[number,number];pacingAssumptionSeconds:number;intendedMinutes:[number,number]};
  expression?:{vehicle:'primitive-state'|'authored-prose'|'mixed'|'abstract-symbols';status:'active'|'historical-control'|'superseded';rationale:string};
}
export interface ExperienceReview {
  critic:string;source:string;
  hypotheses:{claim:string;decision:'keep'|'change'|'reject'|'untested';support:string[];counterevidence:string[];interpretation:string}[];
  nextExperiment:{proposal:string;because:string[];prediction:string;limitations:string};
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
  const choices=run.continuations?.length?run.continuations:run.continuation?[run.continuation]:[];
  const intervals=choices.map((choice,i)=>{
    const end=choices[i+1]?.decisionIndex??run.decisions.length;
    const valid=Number.isInteger(choice.decisionIndex)&&choice.decisionIndex>=0&&choice.decisionIndex<=run.decisions.length&&end>=choice.decisionIndex&&typeof choice.intention==='string'&&!!choice.intention.trim()&&!!run.checkpoints?.some(point=>point.decisionIndex<=choice.decisionIndex);
    const actions=valid?run.decisions.filter(decision=>decision.phase==='elective'&&decision.index>=choice.decisionIndex&&decision.index<end):[];
    const construction=actions.filter(decision=>record(decision.action).type==='combine').map(decision=>decision.index),closure=actions.filter(decision=>record(decision.action).type==='finish').map(decision=>decision.index);
    const waits=actions.filter(decision=>record(decision.action).type==='wait').map(decision=>decision.index);
    const otherActions=actions.filter(decision=>!['combine','wait','finish'].includes(String(record(decision.action).type))).map(decision=>decision.index);
    const linked=choice.nextSession?otherRuns.find(other=>other.id===choice.nextSession):undefined;
    const provenance=linked&&valid&&choice.recordedAt&&linked.startedAt&&Date.parse(linked.startedAt)>=Date.parse(choice.recordedAt)&&linked.condition===`elective-after-${run.id}`&&linked.electiveOrigin?.run===run.id&&linked.electiveOrigin.decisionIndex===choice.decisionIndex&&linked.electiveOrigin.recordedAt===choice.recordedAt;
    const inspections=(run.previews??[]).filter(preview=>{
      if(!valid||preview.phase!=='elective')return false;
      const next=choices[i+1];
      if(preview.recordedAt&&choice.recordedAt)return Date.parse(preview.recordedAt)>=Date.parse(choice.recordedAt)&&(!next?.recordedAt||Date.parse(preview.recordedAt)<Date.parse(next.recordedAt));
      return preview.decisionIndex>=choice.decisionIndex&&(i===choices.length-1?preview.decisionIndex<=end:preview.decisionIndex<end);
    });
    return {choice,valid,construction,closure,waits,otherActions,inspectionCalls:inspections.length,
      linked:linked?{id:linked.id,provenanceVerified:!!provenance,constructionActions:provenance?linked.decisions.filter(decision=>record(decision.action).type==='combine').length:0,
        waitActions:provenance?linked.decisions.filter(decision=>record(decision.action).type==='wait').length:0}:null};
  });
  const inWorld=intervals.flatMap(interval=>interval.construction),actualActions=inWorld.length+intervals.reduce((sum,interval)=>sum+(interval.linked?.constructionActions??0),0);
  const report=record(run.report),normalized=normalizeExperienceReport(report);
  return {checkpoints:run.checkpoints??null,intentionRecordedBeforeElectivePlay:choices.at(-1)??null,intervals,electiveDecisionIndices:inWorld,
    closureDecisionIndices:intervals.flatMap(interval=>interval.closure),electiveInspectionCalls:intervals.reduce((sum,interval)=>sum+interval.inspectionCalls,0),
    electiveWaitDecisionIndices:intervals.flatMap(interval=>interval.waits),electiveOtherDecisionIndices:intervals.flatMap(interval=>interval.otherActions),
    actualElectiveActions:actualActions,reportedFutureWish:report.wantAnother??normalized.forwardWishes,
    reportedRenewedIntention:Object.hasOwn(report,'renewedIntention')?report.renewedIntention:null,
    renewalRelatedAccounts:normalized.renewal,ambitionOrigins:normalized.intentionOrigins,
    reportedClosure:report.closure??report.stoppingReason??normalized.closure,
    finding:actualActions?'Elective construction occurred under the test prompt, following a corresponding recorded intention.':choices.length?'A further intention was recorded, but no verified elective construction followed it; inspections and closure are separate.':run.checkpoints?.length?'The assigned exposure ended without recorded elective continuation.':'No stopping/continuation protocol was recorded; instructed completion establishes no appetite.',
    limitation:'This is behavior under an agent task, not voluntary human enjoyment. A stated wish, satisfying closure and actual elective construction are separate evidence.'};
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
function strings(value:unknown,path:string):{path:string;text:string}[]{
  if(typeof value==='string')return [{path,text:value}];
  if(Array.isArray(value))return value.flatMap((item,index)=>strings(item,`${path}[${index}]`));
  if(value&&typeof value==='object')return Object.entries(value).flatMap(([key,item])=>strings(item,`${path}.${key}`));
  return [];
}
export function narrativeDisclosure(run:LogicalRun){
  const available=new Map<string,string>();for(const item of strings(run.initialObservation,'initialObservation'))if(item.text.length>=40&&!available.has(item.text))available.set(item.text,item.path);
  const passages:{decision:number;text:string;enactedAt:string;earliestVerbatimExposure:string;alreadyAvailable:boolean}[]=[];
  for(const decision of run.decisions){
    for(const [index,preview]of (run.previews??[]).entries())if(preview.decisionIndex<=decision.index)for(const item of strings(preview.result,`previews[${index}].result`))if(item.text.length>=40&&!available.has(item.text))available.set(item.text,item.path);
    const observation=record(decision.observation),prefix=`decisions[${decision.index}].observation`;
    const enacted=['response','lastResponse','events'].flatMap(key=>Object.hasOwn(observation,key)?strings(observation[key],`${prefix}.${key}`):[]);
    for(const item of enacted.filter(item=>item.text.length>=40)){
      const earlier=available.get(item.text);passages.push({decision:decision.index,text:item.text,enactedAt:item.path,earliestVerbatimExposure:earlier??item.path,alreadyAvailable:!!earlier});
    }
    for(const item of strings(decision.observation,`decisions[${decision.index}].observation`))if(item.text.length>=40&&!available.has(item.text))available.set(item.text,item.path);
  }
  return {passages,interpretation:'Exact passage matching establishes availability, not that it was read. A new verbatim passage can paraphrase an already known fact; it is not automatic semantic revelation. Appreciation of enactment survives prior disclosure.'};
}
export function evaluateFun(run:LogicalRun,design:FunDesign,otherRuns:LogicalRun[]=[],searchLimit=2000,review?:ExperienceReview){
  const game=LOGICAL_GAMES[run.game],final=replayLogical(run),report=record(run.report),episodes=episodeAccounts(run),predictions=checkPredictions(run);
  const continuation=continuationEvidence(run,otherRuns),reuse=structuralReuse(run),normalized=normalizeExperienceReport(report);
  const primitiveDevelopments=primitiveDevelopmentEvidence(run);
  const repetitions=normalized.repetitions.map(item=>({...item,...repetitionFinding(item.judgment,item.changedRole)}));
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
  const narrative=report.narrative??report.narrativeOrConceptThatMattered??(normalized.narrative.length?normalized.narrative:null);
  const closureWithoutRenewal=normalized.explicit.noRenewedIntention.length>0||normalized.explicit.satisfiedClosure.some(item=>item.value)||normalized.explicit.wantsAnother.some(item=>item.value===false);
  const experience={
    designPromise:{proposedPleasures:design.proposedPleasures,engine:design.experienceEngine,valuedObject:design.valuedObject,narrativeQuestion:design.narrativeQuestion,renewalPromise:design.renewalPromise},
    intentionsBeforeActions:intentions,reportedExperience:normalized.experience.length?normalized.experience:normalized.responses,
    checkpointAccounts:(run.notes??[]).map((note,index)=>({sourcePath:`notes[${index}].account`,decisionIndex:note.decisionIndex,recordedAt:note.recordedAt,account:note.account})),
    noticedResponsesFromEpisodes:episodes.reported.flatMap(item=>{const e=record(item);return e.noticedResponse?[e.noticedResponse]:[];}),
    narrativeOrConceptualReport:narrative,noticedResponses:normalized.responses,closure:normalized.closure,renewal:normalized.renewal,forwardWishes:normalized.forwardWishes,ambitionOrigins:normalized.intentionOrigins,unclassifiedPlayerFields:normalized.unclassifiedFields,continuation,
    liveQuestionAccount:{designerQuestion:{source:design.source,value:design.narrativeQuestion},
      gameInvitations:[run.initialObservation,...run.decisions.map(decision=>decision.observation)].flatMap((observation,index)=>{const o=record(observation),response=record(o.lastResponse);return o.invitations||o.optionalPursuit||response.unresolvedQuestion?[{availableAfterDecision:index-1,invitations:o.invitations??o.optionalPursuit??null,characterQuestion:response.unresolvedQuestion??null}]:[];}),
      adoptedElectiveIntentions:continuation.intervals.filter(interval=>interval.valid).map(interval=>({source:'recorded player choice under protocol',value:interval.choice.intention,atDecision:interval.choice.decisionIndex,actualConstructiveActions:interval.construction})),
      playerOriginAccount:report.furtherProjectSource??report.intentionSource??report.suppliedPossibilityVsPersonalPurpose??null,
      closureOrRenewalAccounts:[...normalized.closure,...normalized.renewal],
      limitation:'A printed invitation is not an adopted question. A chosen authored possibility can still be sincerely valued. Origin and adoption above are reports or protocol events, not inferred intrinsic motivation.'},
    provisionalInterpretation:continuation.actualElectiveActions>0?'Verified elective construction followed a corresponding recorded intention in this agent protocol; inspect the world response without inferring what caused the choice or attributing absorption.':closureWithoutRenewal?'This player reports closure or no renewed intention after the local outcome. Narrative appreciation and continuing absorption are distinct; keep the specific reports visible.':'Interest across time remains an open hypothesis; preserve specific appreciation and stopping reasons without inferring them from victory.',
  };
  return {version:'fun-evidence-4',doctrine:'docs/history/what-is-fun/revision-7.md',run:run.id,game:run.game,modelVersion:run.version,design,
    currentDirection:{ownerConstraint:'History must emerge from game primitives and be expressed through game building blocks; little authored narrative.',source:'docs/design-contract.md#current-correction-the-world-carries-its-history',
      declaredExpression:design.expression??null,interpretation:'This declaration records design fit, not demonstrated readability or visual quality. Historical appreciation reports remain evidence of their original scope.'},
    experienceAcrossTime:experience,
    evidence:{mechanical:{replay:'pass',status:game.status(final),publicInitialObservation:run.initialObservation,counterfactuals,structuralReuse:reuse,primitiveDevelopments},
      player:{report:run.report??null,episodes,repetitions,assertionChecks:predictions,unscoredPredictionDecisions:run.decisions.filter(decision=>decision.prediction!==undefined).length-new Set(predictions.map(check=>check.decision)).size},
      access:{condition:run.condition,protocol:run.protocolVersion??'legacy',previewCalls:run.previews?.length??null,narrativeDisclosure:narrativeDisclosure(run),embeddedForecastsAreAvailableInformation:true,understandingIsNotInferredFromAvailability:true}},
    attention:{committedActions:run.decisions.length,annotatedEpisodeIds:episodes.annotated.length,reportedEpisodeAccounts:episodes.reported.length,
      constructiveActions:run.decisions.filter(decision=>record(decision.action).type==='combine').length,
      waitActions:run.decisions.filter(decision=>record(decision.action).type==='wait').length,
      explicitlyRequestedBeats:run.decisions.filter(decision=>record(decision.action).type==='wait').reduce((sum,decision)=>sum+(typeof record(decision.action).beats==='number'?record(decision.action).beats as number:1),0),
      finishActions:run.decisions.filter(decision=>record(decision.action).type==='finish').length,
      requestedScope:design.requestedScope?{...design.requestedScope,
        reachedLowerActionCount:run.decisions.filter(decision=>record(decision.action).type==='combine').length>=design.requestedScope.decisionRange[0],
        quantityUnit:'constructive commands',interestingDecisionOpportunities:null,
        interpretation:'The range is a production/test target derived from the owner’s hypothetical pace. Meeting an action count would establish neither meaningful decisions nor human duration; failing it identifies a scope shortfall.'}:null,
      humanPlaytime:null,agentElapsedMs:run.decisions.at(-1)?.atMs??null,meaning:'Action and episode counts have named units. Agent elapsed time includes deliberation and tool delays. Neither is a human fun-per-minute estimate; batching commands earns no automatic improvement.'},
    principleCoverage:[
      {id:'F1',implementation:'Named pleasure hypotheses and falsifiers in the design; no universal tradeoff gate.'},
      {id:'F2',implementation:'Available observations and previews separated from checked assertions and unscored player accounts.'},
      {id:'F3',implementation:game.decisionDomain?'Counterfactual continuation graphs and meaningful ending keys; completeness disclosed.':primitiveDevelopments.supported?'Reconstructed primitive transitions, captured public information and specific reviewed consequence checks are separate. Unchecked alternatives/futures remain unknown.':'No consequence adapter: counterfactual consequences remain unknown.'},
      {id:'F4',implementation:'Pareto structure is mechanical only. Construction, narrative and valued enactment claims do not fail for lacking multiple optimal endings.'},
      {id:'F5',implementation:episodes.boundaryStatus},
      {id:'F6',implementation:'Explicit repetition reports preserved separately from changed roles. Determinism and repeated syntax carry no penalty.'},
      {id:'F7',implementation:'Prior-result uses, previous-stage winners and specifically checked later roles of retained places/relations are separate; no novelty or reuse-count reward.'},
      {id:'F8',implementation:'No fun total or human pacing estimate. Specific units, expertise/access limits and absence of evidence remain explicit.'},
      {id:'F9',implementation:'Design source, registration timing, falsifiers and a next design experiment retained for independent review.'},
      {id:'F10',implementation:'Semantics, skill, consequences and meaning are separately specified. Narrative value can exist with an unchanged algebra.'},
    ].map(item=>{
      const coverage:Record<string,string>={F1:'declared-design',F2:predictions.length?'partially-checked':'available-information-only',F3:game.decisionDomain?'partially-checked':primitiveDevelopments.principleEvidence.F3.coverage,F4:review?'reviewed-report':'not-checked',F5:review&&episodes.reported.length?'reviewed-report':episodes.annotated.length?'player-account-only':'not-checked',F6:review&&repetitions.length?'reviewed-report':repetitions.length?'player-account-only':'not-checked',F7:reuse.uses.length?'partially-checked':primitiveDevelopments.principleEvidence.F7.coverage,F8:'mechanically-checked',F9:review?'reviewed-report':'not-checked',F10:review?'partially-checked':'declared-design'};
      return {...item,coverage:coverage[item.id],evidence:{reviewSource:review?.source??null,implementationFixtures:['tests/fun-evaluator.test.ts','tests/decision-space.test.ts','tests/player-experience.test.ts'],scope:'Coverage labels are limited: extracted accounts and ending graphs do not automatically establish the full experiential principle.'}};
    }),
    reviewedHypotheses:review??{status:'not reviewed',reason:'An implementation profile is not an independent interpretation of the experience.'},
    nextDesignExperiment:design.expression?.status==='superseded'?{
      proposal:'Retain any valued causal relationship as a primitive-level hypothesis; express and test its consequences through places, processes or actors, with little authored story.',
      because:['The owner rejected the prose-led vehicle after trying the stories.','Agent appreciation does not override the owner’s desired experience.'],
      prediction:'A player can pursue and explain a consequential change from game state and reusable laws without needing an authored scene to supply it.',
      limitations:'The earlier review remains historical; a successful prose branch is not evidence for the new expression requirement.'}:review?.nextExperiment??{proposal:continuation.actualElectiveActions?'Retain the observed intention-response sequence provisionally and test whether a later response is followed by another adopted intention.':closureWithoutRenewal&&design.renewalPromise?'Preserve the valued stopping point; test a further consequence in the same primitive world.':design.nextExperiment,
      because:closureWithoutRenewal?['Explicit player closure/no-renewal report','No verified elective construction in this capture']:['Current played trace; no reviewed interpretation yet'],
      prediction:'Record an adopted question before an optional action, or a concrete reason for satisfied stopping.',limitations:'Provisional generated design lead, not a validated enjoyment prediction.'},
    priorDesignerProposal:design.nextExperiment,
    limits:['AI report and elective behavior do not establish human enjoyment.','Narrative/aesthetic value is recorded as a player account; no mechanical frontier can verify it.','No overall enjoyment verdict follows from passing the safeguards. The independent critic must inspect the proposed and observed experience.']};
}
