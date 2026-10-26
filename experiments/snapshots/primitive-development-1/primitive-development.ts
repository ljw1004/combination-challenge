/** Specific checked developments, not a causal inference engine or a meaningfulness score. */
import {LOGICAL_GAMES,replayLogical} from './logical-games.ts';
import type {LogicalRun} from './logical-games.ts';
import {legalConfluenceActions,stepConfluence} from './logical-confluence.ts';
import type {State as Valley,Action} from './logical-confluence.ts';
import type {State as FieldState} from './logical-field.ts';
import type {State as ImprintState} from './logical-imprints.ts';

export interface SourceAccount {sourcePath:string;value:unknown}
export interface FunctionalProjection {
  places?:Record<string,unknown>;links?:Record<string,unknown>;actors?:Record<string,unknown>;
  [key:string]:unknown;
}
export interface FunctionalDelta {path:string;before:unknown;after:unknown}
export interface EffectAssertion {
  prefix:number;path:string;expected:unknown;actual:unknown;pass:boolean;
  source:'reconstructed-functional-state';stateKind:'actual-prefix'|'alternative-result';
}
export interface PrimitiveTransition {
  decision:number;action:unknown;before:FunctionalProjection;after:FunctionalProjection;changes:FunctionalDelta[];
  capturedPublic:{beforeSourcePath:string;afterSourcePath:string};
}
export interface CheckedDevelopment {
  id:string;kind:'regulator-to-source'|'stored-witness-publication-repair'|'mneme-policy-without-institution';
  claim:string;status:'verified'|'unresolved';decisions:number[];
  checks:EffectAssertion[];
  laws:{source:string;symbol:string;statement:string}[];
  lawDependence:{scope:string;alternatives:{prefix:number;actions:Action[];legal:boolean;after:FunctionalProjection;checks:EffectAssertion[]}[];unchecked:string[]};
  changedRole:null|{object:string;earlierDecision:number;laterDecision:number;beforeRole:string;afterRole:string;verified:boolean};
  claimBoundary:{claim:string;status:'contradicted'|'not-established';reason:string}[];
  playerAccounts:{predictions:SourceAccount[];notice:SourceAccount[];value:SourceAccount[]};
  interpretation:string;
}
export interface PrimitiveDevelopmentEvidence {
  version:'primitive-development-1';supported:boolean;adapter:string|null;
  reconstruction:{replay:'pass'|'not-supported';visibility:string;transitions:PrimitiveTransition[]};
  publicInformation:{initialObservationSourcePath:string;queries:SourceAccount[];previews:SourceAccount[];interpretation:string};
  developments:CheckedDevelopment[];
  principleEvidence:{F3:{coverage:'partially-checked'|'not-checked';developmentIds:string[];scope:string};F7:{coverage:'partially-checked'|'not-checked';developmentIds:string[];scope:string}};
  counts:{transitions:number;verifiedDevelopments:number;effectAssertions:number;singleBranchComparisons:number};
  limits:string[];
}
const copy=<T>(value:T):T=>structuredClone(value);
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const object=(value:unknown):Record<string,unknown>=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const ids=(mask:number)=>['bell','mneme','maker','chorus'].filter((_,i)=>mask&(1<<i));
function at(value:unknown,path:string):unknown {
  return path.replace(/\[(\d+)\]/g,'.$1').split('.').reduce<unknown>((current,key)=>{
    if(['__proto__','prototype','constructor'].includes(key)||!current||typeof current!=='object')return undefined;
    return Object.hasOwn(current,key)?(current as Record<string,unknown>)[key]:undefined;
  },value);
}
function accounts(run:LogicalRun,paths:string[]):SourceAccount[]{
  return paths.flatMap(sourcePath=>{const value=at(run,sourcePath);return value===undefined?[]:[{sourcePath,value:copy(value)}];});
}
function notes(run:LogicalRun,prefix:number,keys:string[]):string[]{
  return (run.notes??[]).flatMap((note,i)=>note.decisionIndex===prefix?keys.map(key=>`notes[${i}].account.${key}`):[]);
}
function valleyProjection(world:Valley):FunctionalProjection {
  return {
    places:Object.fromEntries(world.places.map(p=>[p.id,{...copy(p),hasRecord:p.record>0,recordOrigins:ids(p.record),field:copy(world.field[p.id]),
      voiceOrigins:ids(world.field[p.id].voice),exactOrigins:ids(world.field[p.id].exact),publicOrigins:ids(world.field[p.id].publicVoice),
      hasPublicVoice:world.field[p.id].publicVoice>0,publicExactOrigins:ids(world.field[p.id].publicVoice&world.field[p.id].exact)}])),
    links:Object.fromEntries(world.links.map(link=>[link.id,copy(link)])),
    actors:Object.fromEntries(world.actors.map(actor=>[actor.id,copy(actor)])),
    bellAwake:world.bellAwake,phase:world.phase,capabilities:copy(world.known),conditions:copy(world.milestones),status:world.status,
  };
}
function project(game:string,state:unknown):FunctionalProjection {
  if(game==='field')return valleyProjection((state as FieldState).world);
  if(game==='confluence')return valleyProjection(state as Valley);
  const s=state as ImprintState;
  return {places:Object.fromEntries(s.cells.map(cell=>[cell.id,{...copy(cell),field:copy(s.field[cell.id])}])),
    actors:Object.fromEntries(s.walkers.map(walker=>[walker.id,copy(walker)])),time:s.time,status:s.status};
}
function differences(before:unknown,after:unknown,path=''):FunctionalDelta[]{
  if(same(before,after))return [];
  if(before&&after&&typeof before==='object'&&typeof after==='object'&&!Array.isArray(before)&&!Array.isArray(after)){
    return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(key=>differences(object(before)[key],object(after)[key],path?`${path}.${key}`:key));
  }
  return [{path,before:copy(before),after:copy(after)}];
}
function check(projections:FunctionalProjection[],prefix:number,path:string,expected:unknown):EffectAssertion {
  const actual=at(projections[prefix],path);return {prefix,path,expected:copy(expected),actual:copy(actual),pass:same(actual,expected),source:'reconstructed-functional-state',stateKind:'actual-prefix'};
}
const worldAt=(game:string,states:unknown[],prefix:number)=>game==='field'?(states[prefix] as FieldState).world:states[prefix] as Valley;
function isAction(action:unknown,a:string,b:string,target:string,mode?:string){
  const x=object(action);return x.type==='combine'&&[x.a,x.b].sort().join('+')===[a,b].sort().join('+')&&x.at===target&&(mode===undefined||x.mode===mode);
}
function alternative(world:Valley,prefix:number,actions:Action[],expectations:[string,unknown][]){
  let next=world,legal=true;
  for(const action of actions){
    if(!legalConfluenceActions(next).some(candidate=>same(candidate,action))){legal=false;break;}
    next=stepConfluence(next,action);
  }
  const after=valleyProjection(next),checks=expectations.map(([path,expected])=>check([after],0,path,expected));
  // These assertions concern the alternative result, not a captured future prefix.
  return {prefix,actions:copy(actions),legal,after,checks:checks.map(item=>({...item,prefix,stateKind:'alternative-result' as const}))};
}
const publicInfo=(run:LogicalRun)=>({initialObservationSourcePath:'initialObservation',
  queries:(run.queries??[]).map((value,i)=>({sourcePath:`queries[${i}]`,value:copy(value)})),
  previews:(run.previews??[]).map((value,i)=>({sourcePath:`previews[${i}]`,value:copy(value)})),
  interpretation:'Captured observation references and access logs are available information, not proof it was read or understood. Reconstructed origin masks/history must not be attributed to an earlier compact observer.'});

function regulatorSource(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  if(run.game!=='field')return [];
  const grown=run.decisions.find(d=>isAction(d.action,'seed','water','orchard')&&worldAt(run.game,states,d.index).field.orchard.flooded&&!worldAt(run.game,states,d.index+1).field.orchard.flooded);
  if(!grown)return [];
  const routed=run.decisions.find(d=>d.index>grown.index&&isAction(d.action,'seed','channel','orchard-village')&&!worldAt(run.game,states,d.index).places.find(p=>p.id==='village')!.grown&&worldAt(run.game,states,d.index+1).places.find(p=>p.id==='village')!.grown);
  if(!routed)return [];
  const checks=[check(projections,grown.index,'places.orchard.field.flooded',true),check(projections,grown.index+1,'places.orchard.form','grove'),
    check(projections,grown.index+1,'places.orchard.field.water',1),check(projections,grown.index+1,'places.orchard.field.flooded',false),
    check(projections,routed.index,'places.orchard.form','grove'),check(projections,routed.index,'places.orchard.field.seed',true),check(projections,routed.index,'places.village.grown',false),
    check(projections,routed.index+1,'links.orchard-village.form','reed'),check(projections,routed.index+1,'places.village.form','raw'),
    check(projections,routed.index+1,'places.village.grown',true),check(projections,routed.index+1,'places.village.field.water',1),check(projections,routed.index+1,'places.village.field.living',true)];
  const contrast=alternative(worldAt(run.game,states,routed.index),routed.index,[{type:'combine',a:'earth',b:'water',at:'orchard-village'}],
    [['places.village.field.water',1],['places.village.field.seed',false],['places.village.grown',false]]);
  const verified=checks.every(c=>c.pass)&&contrast.legal&&contrast.checks.every(c=>c.pass);
  return [{id:`orchard-source-${routed.index}`,kind:'regulator-to-source',claim:'The orchard made safe earlier supplies water and seeds through reeds, growing a raw village without another planting command.',status:verified?'verified':'unresolved',decisions:[grown.index,routed.index],checks,
    laws:[{source:'experiments/logical-confluence.ts',symbol:'CONFLUENCE_RULES.places.grove / links.reed / sources',statement:'A wet grove softens water and emits seeds; reeds carry both; gentle water and seeds establish a raw descendant.'}],
    lawDependence:{scope:'One legal canal alternative at the same actual prefix isolates water delivery without seed transport in this configuration.',alternatives:[contrast],unchecked:['Other routes, initial arrangements, feasible future endings and subjective difficulty are not enumerated.']},
    changedRole:{object:'place:orchard',earlierDecision:grown.index,laterDecision:routed.index,beforeRole:'local flood regulator',afterRole:'source of a descendant at another place',verified},
    claimBoundary:[{claim:'This demonstrates a difficult tradeoff or sustained interest.',status:'not-established',reason:'The player describes obvious best fits and chooses closure after the extension.'}],
    playerAccounts:{predictions:accounts(run,[`decisions[${grown.index}].prediction`,`decisions[${routed.index}].prediction`]),
      notice:accounts(run,['report.mainExperience','report.responseMattered','report.causality',...notes(run,routed.index+1,['worldResponse','causesAndHistory','oldConstructionUsedDifferently'])]),
      value:accounts(run,[...notes(run,grown.index+1,['valued','challenge']),...notes(run,routed.index+1,['valued','routine','stoppingReason']),'report.stopping'])},
    interpretation:'A specific functional role change is checked. The reported appreciation and the choice to stop remain player accounts, not conclusions from the deltas.'}];
}

function witnessRepair(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  if(run.game!=='confluence')return [];
  const published=run.decisions.find(d=>isAction(d.action,'voice','freedom','village','institution')&&worldAt(run.game,states,d.index).places.find(p=>p.id==='meeting')!.record>0&&!worldAt(run.game,states,d.index).field.meeting.flooded&&worldAt(run.game,states,d.index+1).field.meeting.flooded);
  if(!published)return [];
  const route=run.decisions.find(d=>d.index>published.index&&isAction(d.action,'seed','channel','archive-meeting'));
  if(!route)return [];
  const erased=run.decisions.find(d=>d.index>route.index&&isAction(d.action,'seed','water','meeting'));
  if(!erased)return [];
  const prior=worldAt(run.game,states,published.index),stored=prior.places.find(p=>p.id==='meeting')!.record;
  const original=worldAt(run.game,states,erased.index).places.find(p=>p.id==='archive')!.record;
  const earlier=run.decisions.find(d=>d.index<published.index&&isAction(d.action,'earth','air','archive-meeting'));
  const checks=[check(projections,published.index,'places.meeting.charter','witness'),check(projections,published.index,'places.meeting.field.flooded',false),
    check(projections,published.index+1,'places.meeting.publicExactOrigins',ids(stored)),check(projections,published.index+1,'places.meeting.field.flooded',true),check(projections,route.index+1,'links.archive-meeting.form','reed'),
    check(projections,route.index+1,'places.meeting.field.receivedExact',0),check(projections,route.index+1,'places.meeting.record',stored),
    check(projections,route.index+1,'places.meeting.field.exact',stored),check(projections,route.index+1,'places.meeting.field.flooded',true),check(projections,erased.index+1,'places.meeting.record',0),
    check(projections,erased.index+1,'places.meeting.field.flooded',false),check(projections,erased.index+1,'places.meeting.field.riverContact',true),
    check(projections,erased.index,'places.archive.hasRecord',true),check(projections,erased.index+1,'places.archive.record',original),
    check(projections,erased.index+1,'places.village.charter','open'),check(projections,erased.index+1,'places.village.hasPublicVoice',true),
    ...(earlier?[check(projections,earlier.index+1,'links.archive-meeting.form','bridge'),check(projections,earlier.index+1,'places.meeting.field.receivedExact',stored)]:[])];
  const contrast=alternative(prior,published.index,[{type:'combine',a:'earth',b:'law',at:'meeting',mode:'institution'},run.decisions[published.index].action as Action],
    [['places.meeting.field.flooded',false],['places.meeting.field.exact',0],['places.meeting.record',stored],['places.village.charter','open']]);
  const verified=checks.every(c=>c.pass)&&contrast.legal&&contrast.checks.every(c=>c.pass);
  return [{id:`witness-publication-${published.index}`,kind:'stored-witness-publication-repair',claim:'Publicity reaches a stored exact witness; changing fresh transmission alone leaves the copy dangerous, while relinquishing the local copy restores contact and preserves the original elsewhere.',status:verified?'verified':'unresolved',decisions:[published.index,route.index,erased.index],checks,
    laws:[{source:'experiments/logical-confluence.ts',symbol:'localTransform / transfer / resolve',statement:'Publicity follows origin through fragment translation; witness quotes stored exact origins after living transformation; shared exact/public origins call rain; grove transformation erases the local record.'}],
    lawDependence:{scope:'A two-step legal alternative removes witness quotation before repeating publication. It checks the stored-record interaction in this actual prefix, not every possible cause of rain.',alternatives:[contrast],unchecked:['The old public wording did not clearly disclose every origin interaction. Replay does not establish what the player understood before publication.','No complete alternative or future-ending search was performed.']},
    changedRole:earlier?{object:'link:archive-meeting',earlierDecision:earlier.index,laterDecision:route.index,beforeRole:'delivery of exact witness testimony',afterRole:'boundary translating fresh testimony while a historical local copy remains',verified}:null,
    claimBoundary:[{claim:'Replacing the route erases the historical local copy.',status:'contradicted',reason:'The checked reed result retains the exact record and flood.'}],
    playerAccounts:{predictions:accounts(run,[`decisions[${published.index}].prediction`,`decisions[${route.index}].prediction`,`decisions[${erased.index}].prediction`]),
      notice:accounts(run,['report.tacticalAndCreativeChallenge','report.combinationMeanings.law']),value:accounts(run,['report.ambitionSources.selfGenerated','report.appreciation.positive',...notes(run,run.decisions.length,['selfGeneratedAmbitions','usefulRepeatedMeaning'])])},
    interpretation:'The checked alternatives establish a local law interaction and later use of an existing relation. Choosing to retain publication and valuing that arrangement are separately sourced player reports.'}];
}

function mnemeActs(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  if(!['field','confluence'].includes(run.game))return [];
  return run.decisions.flatMap(d=>{
    const before=worldAt(run.game,states,d.index),after=worldAt(run.game,states,d.index+1),a=before.actors.find(a=>a.id==='mneme')!,b=after.actors.find(a=>a.id==='mneme')!;
    if(a.ownAct||!b.ownAct)return [];
    const checks=[check(projections,d.index,'actors.mneme.ownAct',false),check(projections,d.index+1,'actors.mneme.ownAct',true),
      check(projections,d.index+1,'actors.mneme.policy','chosen-custody'),check(projections,d.index+1,'places',projections[d.index].places)];
    const verified=checks.every(c=>c.pass);
    return [{id:`mneme-policy-${d.index}`,kind:'mneme-policy-without-institution' as const,claim:'Mneme marks his one-time chosen testimony policy without changing any place charter, record or derived carrier field in this transition.',status:verified?'verified' as const:'unresolved' as const,decisions:[d.index],checks,
      laws:[{source:'experiments/logical-confluence.ts',symbol:'resolve (Mneme own-act) / actorSource',statement:'The own act sets ownAct and chosen-custody; actorSource then withholds future exact personal testimony unless the listening-invitation condition is satisfied. It does not install custody or erase existing records.'}],
      lawDependence:{scope:'Actual before/after actor policy and complete place/field equality are checked; no alternate future testimony configuration is executed.',alternatives:[],unchecked:['The future source-policy distinction follows the named engine rule, not a demonstrated new institution or a sampled future delivery.','This does not infer whether the player noticed the mismatch or valued it.']},
      changedRole:null,claimBoundary:[{claim:'This act creates silent custody or blocks all previously quoted exact testimony.',status:verified?'contradicted' as const:'not-established' as const,reason:verified?'Place configurations, records and carrier fields are identical before and after; only the actor policy/own-act state changes.':'The specific no-place-effect check did not pass; inspect this different situation.'}],
      playerAccounts:{predictions:accounts(run,[`decisions[${d.index}].prediction`]),notice:accounts(run,[`decisions[${d.index}].observation.response`,'report.combinationMeanings.purpose','report.strongestSpans']),value:accounts(run,['report.appreciation','report.philosophicalDifferences'])},
      interpretation:'The printed custody claim is retained as captured prose, not treated as a verified institutional effect. A source-policy change can matter later without enacting that stronger claim now.'}];
  });
}

export function primitiveDevelopmentEvidence(run:LogicalRun):PrimitiveDevelopmentEvidence {
  const supported=['field','confluence','imprints'].includes(run.game),transitions:PrimitiveTransition[]=[],developments:CheckedDevelopment[]=[];
  if(supported){
    // Validate the exact capture, including its original observer, before adding richer reviewer projections.
    replayLogical(run);
    const game=LOGICAL_GAMES[run.game],states:unknown[]=[game.create(run.scenario,run.seed)],projections=[project(run.game,states[0])];
    for(const decision of run.decisions){
      const next=game.step(states.at(-1),decision.action),after=project(run.game,next),before=projections.at(-1)!;
      states.push(next);projections.push(after);
      transitions.push({decision:decision.index,action:copy(decision.action),before:copy(before),after:copy(after),changes:differences(before,after),
        capturedPublic:{beforeSourcePath:decision.index?`decisions[${decision.index-1}].observation`:'initialObservation',afterSourcePath:`decisions[${decision.index}].observation`}});
    }
    if(run.game!=='imprints')developments.push(...regulatorSource(run,states,projections),...witnessRepair(run,states,projections),...mnemeActs(run,states,projections));
  }
  const verified=developments.filter(d=>d.status==='verified'),reuse=verified.filter(d=>d.changedRole?.verified);
  return {version:'primitive-development-1',supported,adapter:supported?`${run.game}/${run.version}`:null,
    reconstruction:{replay:supported?'pass':'not-supported',visibility:'Richer reconstructed functional state for review. It is not a claim about what the captured public observer disclosed or what a player understood.',transitions},
    publicInformation:publicInfo(run),developments,
    principleEvidence:{F3:{coverage:verified.length?'partially-checked':'not-checked',developmentIds:verified.map(d=>d.id),scope:'Only the named consequence assertions and explicitly sampled legal alternatives are checked. Raw deltas, complete futures, subjective meaning and understanding are not scored.'},
      F7:{coverage:reuse.length?'partially-checked':'not-checked',developmentIds:reuse.map(d=>d.id),scope:'Only a named, checked later functional role of an identified retained construction. Persistent IDs, repeated syntax, unlocks and appreciation alone earn no coverage.'}},
    counts:{transitions:transitions.length,verifiedDevelopments:verified.length,effectAssertions:developments.reduce((n,d)=>n+d.checks.length+d.lawDependence.alternatives.reduce((m,a)=>m+a.checks.length,0),0),singleBranchComparisons:developments.reduce((n,d)=>n+d.lawDependence.alternatives.length,0)},
    limits:['This adapter checks a few specified mechanisms; it does not infer arbitrary causes from co-occurring deltas.','Player notice, appreciation and closure remain source-linked reports, not mechanical findings.','No interesting-decision count, meaningfulness score, human enjoyment result or long-game claim follows.','Imprints currently has transition evidence only; no reviewed development or reuse claim is inferred.']};
}
