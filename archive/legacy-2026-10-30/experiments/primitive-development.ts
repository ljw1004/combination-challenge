/** Specific checked developments, not a causal inference engine or a meaningfulness score. */
import {LOGICAL_GAMES,replayLogical} from './logical-games.ts';
import type {LogicalRun} from './logical-games.ts';
import {legalConfluenceActions,stepConfluence} from './logical-confluence.ts';
import type {State as Valley,Action} from './logical-confluence.ts';
import type {State as FieldState} from './logical-field.ts';
import type {State as ImprintState} from './logical-imprints.ts';
import {frontierActions,frontierOutcome,stepFrontier} from './logical-frontier.ts';
import type {State as FrontierState,Action as FrontierAction} from './logical-frontier.ts';

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
  id:string;kind:'regulator-to-source'|'stored-witness-publication-repair'|'mneme-policy-without-institution'|
    'frontier-gate-to-hearth'|'frontier-equal-contact-scar'|'frontier-remembered-boundary'|'frontier-footprint-without-live-circuit';
  claim:string;status:'verified'|'unresolved';decisions:number[];
  checks:EffectAssertion[];
  laws:{source:string;symbol:string;statement:string}[];
  lawDependence:{scope:string;alternatives:{prefix:number;actions:(Action|FrontierAction)[];legal:boolean;after:FunctionalProjection;checks:EffectAssertion[]}[];unchecked:string[]};
  changedRole:null|{object:string;earlierDecision:number;laterDecision:number;beforeRole:string;afterRole:string;verified:boolean};
  claimBoundary:{claim:string;status:'contradicted'|'not-established';reason:string}[];
  playerAccounts:{predictions:SourceAccount[];notice:SourceAccount[];value:SourceAccount[];understanding?:SourceAccount[]};
  interpretation:string;
}
export interface PrimitiveDevelopmentEvidence {
  version:'primitive-development-2';supported:boolean;adapter:string|null;
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
function frontierProjection(s:FrontierState):FunctionalProjection {
  // The engine's public outcome query is blue-specific. Relabel a detached state to
  // apply precisely the same circuit criterion to amber; no alternative play occurs.
  const relabeled=copy(s);
  for(const c of relabeled.cells)if(c.owner)c.owner=c.owner==='blue'?'amber':'blue';
  for(const t of relabeled.tips)t.lineage=t.lineage==='blue'?'amber':'blue';
  const circuits={blue:frontierOutcome(s).circuits,amber:frontierOutcome(relabeled).circuits},remembered=s.counterpart.cherished;
  return {cells:Object.fromEntries(s.cells.map(c=>[c.id,copy(c)])),tips:copy(s.tips),counterpart:copy(s.counterpart),
    tipsByKey:Object.fromEntries(s.tips.map(t=>[`${t.lineage}:${t.at}:${t.heading}`,copy(t)])),
    circuits,tipCounts:Object.fromEntries(s.cells.map(c=>[c.id,s.tips.filter(t=>t.at===c.id).length])),
    eventsAt:Object.fromEntries([...new Set(s.response.map(e=>e.at))].map(id=>[id,copy(s.response.filter(e=>e.at===id))])),
    counterpartRelations:{rememberedFootprintOwned:remembered.length>0&&remembered.every(id=>s.cells.find(c=>c.id===id)?.owner==='amber'),
      rememberedFootprintInLivingCircuit:remembered.length>0&&circuits.amber.some(c=>remembered.every(id=>c.includes(id))),hasLivingCircuit:circuits.amber.length>0},
    time:s.time,status:s.status};
}
function project(game:string,state:unknown):FunctionalProjection {
  if(game==='field')return valleyProjection((state as FieldState).world);
  if(game==='confluence')return valleyProjection(state as Valley);
  if(game==='frontier')return frontierProjection(state as FrontierState);
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

const frontierAt=(states:unknown[],prefix:number)=>states[prefix] as FrontierState;
const frontierCell=(states:unknown[],prefix:number,id:string)=>frontierAt(states,prefix).cells.find(c=>c.id===id)!;
const hearth=['C4','C5','D4','D5'];
const circuitsAt=(projections:FunctionalProjection[],prefix:number,lineage:'blue'|'amber')=>at(projections[prefix],`circuits.${lineage}`) as string[][];
const hearthIndex=(projections:FunctionalProjection[],prefix:number)=>circuitsAt(projections,prefix,'blue').findIndex(c=>same(c,hearth));
function frontierAccounts(run:LogicalRun,decisions:number[],prefixes:number[]):CheckedDevelopment['playerAccounts']{
  return {predictions:accounts(run,decisions.map(i=>`decisions[${i}].prediction`)),
    notice:accounts(run,['report.noticedResponses','report.narrativeOrConceptThatMattered','report.strongestEpisode',
      ...prefixes.flatMap(p=>notes(run,p,['noticedResponses','narrativeOrConceptThatMattered','meaningfulResponse','oldCreationNewRole']))]),
    value:accounts(run,['report.experience','report.chosenProjects','report.closure','report.actualStopReason','report.routineOrWeak','report.wantAnother','report.actualContinuationReason',
      ...prefixes.flatMap(p=>notes(run,p,['experience','closure','renewedIntention','repetition','wantAnother','actualContinuationReason']))]),
    understanding:accounts(run,['report.thoughtful','report.unclear',...prefixes.flatMap(p=>notes(run,p,['uncertaintySkill']))])};
}
function frontierGate(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  const gate=run.decisions.find(d=>frontierAt(states,d.index+1).response.some(e=>e.kind==='grow'&&e.at==='D5'&&e.from==='C5'&&e.lineage==='blue')&&frontierCell(states,d.index+1,'D5').terrain==='stone');
  if(!gate)return [];
  const turn=run.decisions.find(d=>d.index>gate.index&&isAction(d.action,'flame','right','D5')&&object(d.action).toward==='S');
  if(!turn)return [];
  const complete=run.decisions.find(d=>d.index>=turn.index&&hearthIndex(projections,d.index+1)>=0);
  if(!complete)return [];
  const checks=[check(projections,gate.index+1,'cells.D5.terrain','stone'),check(projections,gate.index+1,'cells.D5.owner','blue'),
    check(projections,gate.index+1,'cells.D5.kind','flame'),check(projections,gate.index+1,'cells.D5.exits',['E']),
    check(projections,gate.index+1,'tipsByKey.blue:D5:E',{lineage:'blue',at:'D5',heading:'E',kind:'flame',path:'straight'}),
    check(projections,turn.index,'cells.D5.exits',['E']),check(projections,turn.index+1,'cells.D5.exits',['W']),
    check(projections,complete.index+1,'cells.D5.terrain','stone'),check(projections,complete.index+1,'cells.D5.owner','blue'),
    check(projections,complete.index+1,'cells.C4.exits',['E']),check(projections,complete.index+1,'cells.D4.exits',['S']),
    check(projections,complete.index+1,'cells.C5.exits',['N']),
    check(projections,complete.index+1,`circuits.blue[${hearthIndex(projections,complete.index+1)}]`,hearth)];
  const verified=checks.every(c=>c.pass);
  return [{id:`frontier-gate-hearth-${complete.index}`,kind:'frontier-gate-to-hearth',claim:'The retained stone bridge gate D5 changes from eastward Flame passage to the westward return corner of the living four-place home hearth.',status:verified?'verified':'unresolved',decisions:[gate.index,turn.index,complete.index],checks,
    laws:[{source:'experiments/logical-frontier.ts',symbol:'applyCombination / beat / livingCircuits',statement:'Flame crosses stone; a placed faculty replaces exits; friendly fronts follow persistent exits without immediate reversal; an active directed circuit requires circulating traffic.'}],
    lawDependence:{scope:'Actual gate traffic, replaced exits and the completed live four-place circuit are checked. No alternative construction is executed.',alternatives:[],unchecked:['The player-reported need to arrange corners is not a measured difficulty or optimality result.','Other automatic circuits do not establish deliberate construction of this particular hearth.']},
    changedRole:{object:'cell:D5',earlierDecision:gate.index,laterDecision:complete.index,beforeRole:'eastward stone bridge gate',afterRole:'westward return corner of the living home hearth',verified},
    claimBoundary:[{claim:'A living-circuit indicator alone proves a demanding or sustained construction challenge.',status:'not-established',reason:'Automatic background forks also create circuits; this check concerns only the named D5 role and four-place configuration.'}],
    playerAccounts:frontierAccounts(run,[gate.index,turn.index,complete.index],[complete.index+1]),
    interpretation:'The changed direction and later circulation are reconstructed effects. Hearth meaning, appreciation and the account of planning remain separately sourced reports.'}];
}
function frontierScar(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  const meeting=run.decisions.find(d=>frontierAt(states,d.index+1).response.some(e=>e.at==='G5'&&e.kind==='halt'&&same(e.after,['amber:flame','blue:flame'])));
  if(!meeting)return [];
  const i=meeting.index,events=frontierAt(states,i+1).response.filter(e=>e.at==='G5'),halt=events.findIndex(e=>e.kind==='halt');
  const checks=[check(projections,i,'cells.G5.owner',null),check(projections,i,'cells.G5.history',[]),check(projections,i,'cells.G5.contacts',[]),
    check(projections,i,'tipsByKey.blue:F5:E',{lineage:'blue',at:'F5',heading:'E',kind:'flame',path:'straight'}),
    check(projections,i,'tipsByKey.amber:H5:W',{lineage:'amber',at:'H5',heading:'W',kind:'flame',path:'straight'}),
    check(projections,i+1,`eventsAt.G5[${halt}].kind`,'halt'),check(projections,i+1,`eventsAt.G5[${halt}].after`,['amber:flame','blue:flame']),
    check(projections,i+1,'cells.G5.owner',null),check(projections,i+1,'cells.G5.history',['E','W']),check(projections,i+1,'cells.G5.contacts',['amber','blue']),
    check(projections,i+1,'tipCounts.G5',0),check(projections,i+1,'tipCounts.F5',0)];
  const verified=checks.every(c=>c.pass);
  return [{id:`frontier-contact-scar-${i}`,kind:'frontier-equal-contact-scar',claim:'Equal opposing Flame fronts disappear at G5, leaving an unclaimed contact scar with both movement headings and lineages.',status:verified?'verified':'unresolved',decisions:[i],checks,
    laws:[{source:'experiments/logical-frontier.ts',symbol:'beat / addContact',statement:'Simultaneous hostile contact records headings and lineages before opposition resolves; equal hostile arrivals halt without a winning owner or surviving arriving front.'}],
    lawDependence:{scope:'The two actual incoming fronts, explicit halt event, remaining scar and absent fronts are checked at this one meeting.',alternatives:[],unchecked:['No alternative meeting type or future stable border is sampled.','A retained contact is not proof that either lineage intended a meeting or understood its significance.']},
    changedRole:null,claimBoundary:[{claim:'The equal meeting creates permanent peace or a negotiated boundary.',status:'not-established',reason:'The contact records history; amber occupies G5 on the next actual beat.'}],
    playerAccounts:frontierAccounts(run,[i],[i+1]),interpretation:'A specific contact law and durable primitive history are checked. The player supplies the interpretation of a terminated encounter; no counterpart social intention is inferred.'}];
}
function frontierWaitAlternative(s:FrontierState,prefix:number,expectations:[string,unknown][]){
  const action:FrontierAction={type:'wait'},legal=frontierActions(s).some(candidate=>same(candidate,action));
  const after=frontierProjection(legal?stepFrontier(s,action):s);
  return {prefix,actions:[action],legal,after,checks:expectations.map(([path,expected])=>({...check([after],0,path,expected),prefix,stateKind:'alternative-result' as const}))};
}
function frontierBoundary(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  const close=run.decisions.find(d=>isAction(d.action,'memory','shell','F5')&&hearthIndex(projections,d.index+1)>=0);
  if(!close)return [];
  const route=run.decisions.find(d=>d.index<close.index&&frontierAt(states,d.index+1).response.some(e=>e.kind==='grow'&&e.at==='F5'&&e.from==='E5'&&e.lineage==='blue'));
  if(!route)return [];
  const i=close.index,checks=[check(projections,route.index+1,'cells.F5.owner','blue'),check(projections,route.index+1,'cells.F5.exits',['E']),
    check(projections,route.index+1,'tipsByKey.blue:F5:E',{lineage:'blue',at:'F5',heading:'E',kind:'flame',path:'straight'}),
    check(projections,i,'cells.F5.history',['E']),check(projections,i,'cells.F5.closed',[]),
    check(projections,i+1,'cells.F5.owner','blue'),check(projections,i+1,'cells.F5.kind','flame'),check(projections,i+1,'cells.F5.exits',['E']),
    check(projections,i+1,'cells.F5.history',['E']),check(projections,i+1,'cells.F5.closed',['E']),
    check(projections,i+1,`circuits.blue[${hearthIndex(projections,i+1)}]`,hearth)];
  // A finish is not propagation. This sampled beat starts at the actual pre-finish
  // state and is labeled alternative-result even when its prefix number is shared.
  const finish=run.decisions.find(d=>d.index===i+1&&object(d.action).type==='finish'),alternatives:ReturnType<typeof frontierWaitAlternative>[]=[];
  if(finish){
    const p=finish.index,s=frontierAt(states,p),plan=s.counterpart.plan;
    checks.push(check(projections,p,'counterpart.plan',{type:'combine',a:'shell',b:'straight',at:'G5',toward:'W'}));
    if(isAction(plan,'shell','straight','G5')&&plan.toward==='W')alternatives.push(frontierWaitAlternative(s,p,[
      ['time',s.time+1],['status','playing'],['cells.F5',copy(frontierCell(states,p,'F5'))],['cells.G5.kind','shell'],['cells.G5.exits',['W']],
      ['eventsAt.G5[0].kind','combine'],['eventsAt.G5[0].lineage','amber'],['tipCounts.G5',1],['tipCounts.F5',0],
      ['tipsByKey.amber:G5:W',{lineage:'amber',at:'G5',heading:'W',kind:'shell',path:'straight'}],
      [`circuits.blue[${hearthIndex(projections,p)}]`,hearth]]));
  }
  const verified=checks.every(c=>c.pass)&&alternatives.every(a=>a.legal&&a.checks.every(c=>c.pass));
  return [{id:`frontier-boundary-${i}`,kind:'frontier-remembered-boundary',claim:'Memory/Shell turns the retained F5 bridge path into a closed eastward approach while keeping its earlier history and the living home hearth.',status:verified?'verified':'unresolved',decisions:[route.index,i],checks,
    laws:[{source:'experiments/logical-frontier.ts',symbol:'applyCombination (memory+shell) / beat / stepFrontier',statement:'Memory/Shell closes recorded directions in both travel directions without erasing the path or past; closed destination entry prevents contact and rests a front; the committed amber combination precedes propagation.'}],
    lawDependence:{scope:alternatives.length?'One legal wait from the actual pre-finish prefix confirms that amber performs its announced Shell combination at G5 but its front rests before closed F5. This beat was not played in the capture.':'The actual closed edge and retained hearth are checked. No immediately following finish with the specified announced response is available for a wait comparison.',alternatives,
      unchecked:['No route-around, permanent peace, policy understanding or complete future search is established.','The closed edge physically prevents this entry; there is no open-edge causal contrast in this record.','The player ended before observing the sampled response.']},
    changedRole:{object:'cell:F5',earlierDecision:route.index,laterDecision:i,beforeRole:'leading eastward Flame bridge path',afterRole:'closed eastward approach retaining its path and passage history',verified},
    claimBoundary:[{claim:'The player witnessed the announced counter being blocked or established permanent peaceful coexistence.',status:'not-established',reason:'The original next action is finish. The single wait is an explicitly labeled reviewer alternative, and no later futures are checked.'}],
    playerAccounts:frontierAccounts(run,[route.index,i],[i,i+1]),
    interpretation:'Closing the recorded edge is an actual effect and retained-construction role change. The intentional ending is a player report. A reviewer wait must not be presented as an experienced response or general safety guarantee.'}];
}
function frontierFootprintMismatch(run:LogicalRun,states:unknown[],projections:FunctionalProjection[]):CheckedDevelopment[]{
  const mismatch=run.decisions.find(d=>{
    const p=projections[d.index+1];return at(p,'counterpart.purpose')==='extend while keeping remembered circuit'&&at(p,'counterpartRelations.rememberedFootprintOwned')===true&&at(p,'counterpartRelations.rememberedFootprintInLivingCircuit')===false;
  });
  if(!mismatch)return [];
  const prefix=mismatch.index+1,remembered=frontierAt(states,prefix).counterpart.cherished;
  const prior=projections.findLastIndex((p,i)=>i<prefix&&same(at(p,'counterpart.cherished'),remembered)&&at(p,'counterpartRelations.rememberedFootprintInLivingCircuit')===true);
  if(prior<0)return [];
  const checks=[check(projections,prior,'counterpart.cherished',remembered),check(projections,prior,'counterpartRelations.rememberedFootprintInLivingCircuit',true),
    check(projections,prefix,'counterpart.cherished',remembered),check(projections,prefix,'counterpart.purpose','extend while keeping remembered circuit'),
    check(projections,prefix,'counterpartRelations.rememberedFootprintOwned',true),check(projections,prefix,'counterpartRelations.rememberedFootprintInLivingCircuit',false),
    check(projections,prefix,'counterpartRelations.hasLivingCircuit',true),...remembered.map(id=>check(projections,prefix,`cells.${id}.owner`,'amber'))];
  const verified=checks.every(c=>c.pass);
  return [{id:`frontier-footprint-circuit-mismatch-${mismatch.index}`,kind:'frontier-footprint-without-live-circuit',claim:'In this actual prefix, amber retains every remembered footprint cell and claims to keep its circuit, but those cells no longer belong together to a living circuit.',status:verified?'verified':'unresolved',decisions:[mismatch.index],checks,
    laws:[{source:'experiments/logical-frontier.ts',symbol:'updateCounterpart / livingCircuits',statement:'Purpose tests ownership of remembered IDs; reconstruction tests absence of any amber living circuit. Neither requires the remembered footprint itself to remain a living circuit.'}],
    lawDependence:{scope:'The earlier live footprint, unchanged remembered IDs, later cell ownership and absence of a living circuit containing the complete footprint are checked from actual replay. No policy ablation is executed.',alternatives:[],
      unchecked:['This necessary-condition failure refutes preservation here; a positive footprint-membership check alone would not verify preservation of its original edges.','No player notice of this mismatch or full understanding of amber policy is inferred.','This checked discrepancy alone earns no F3 consequence or F7 retained-role coverage.']},
    changedRole:null,claimBoundary:[{claim:'The unchanged purpose establishes that amber keeps its remembered circuit alive.',status:verified?'contradicted':'not-established',reason:verified?'Every remembered cell is amber, but no current living circuit includes the complete remembered footprint; other amber circuits remain.':'The specific footprint/circuit checks did not all pass.'}],
    playerAccounts:{predictions:accounts(run,[`decisions[${mismatch.index}].prediction`]),notice:[],value:[],understanding:[]},
    interpretation:'This is a checked negative against a displayed purpose in the actual capture, not fabricated player experience or a claim that the player noticed the discrepancy.'}];
}

export function primitiveDevelopmentEvidence(run:LogicalRun):PrimitiveDevelopmentEvidence {
  const supported=['field','confluence','imprints','frontier'].includes(run.game),transitions:PrimitiveTransition[]=[],developments:CheckedDevelopment[]=[];
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
    if(run.game==='frontier')developments.push(...frontierGate(run,states,projections),...frontierScar(run,states,projections),...frontierBoundary(run,states,projections),...frontierFootprintMismatch(run,states,projections));
    else if(run.game!=='imprints')developments.push(...regulatorSource(run,states,projections),...witnessRepair(run,states,projections),...mnemeActs(run,states,projections));
  }
  const verified=developments.filter(d=>d.status==='verified'),effects=verified.filter(d=>d.kind!=='frontier-footprint-without-live-circuit'),reuse=verified.filter(d=>d.changedRole?.verified);
  return {version:'primitive-development-2',supported,adapter:supported?`${run.game}/${run.version}`:null,
    reconstruction:{replay:supported?'pass':'not-supported',visibility:'Richer reconstructed functional state for review. It is not a claim about what the captured public observer disclosed or what a player understood.',transitions},
    publicInformation:publicInfo(run),developments,
    principleEvidence:{F3:{coverage:effects.length?'partially-checked':'not-checked',developmentIds:effects.map(d=>d.id),scope:'Only the named consequence assertions and explicitly sampled legal alternatives are checked. Raw deltas, complete futures, subjective meaning and understanding are not scored.'},
      F7:{coverage:reuse.length?'partially-checked':'not-checked',developmentIds:reuse.map(d=>d.id),scope:'Only a named, checked later functional role of an identified retained construction. Persistent IDs, repeated syntax, unlocks and appreciation alone earn no coverage.'}},
    counts:{transitions:transitions.length,verifiedDevelopments:verified.length,effectAssertions:developments.reduce((n,d)=>n+d.checks.length+d.lawDependence.alternatives.reduce((m,a)=>m+a.checks.length,0),0),singleBranchComparisons:developments.reduce((n,d)=>n+d.lawDependence.alternatives.length,0)},
    limits:['This adapter checks a few specified mechanisms; it does not infer arbitrary causes from co-occurring deltas.','Player notice, appreciation and closure remain source-linked reports, not mechanical findings.','No interesting-decision count, meaningfulness score, human enjoyment result or long-game claim follows.','Imprints currently has transition evidence only; no reviewed development or reuse claim is inferred.',
      'Frontier checks only the named gate, scar, boundary and actual footprint discrepancy. A one-beat wait alternative is not an experienced event, permanent peace or complete counterpart-policy understanding.']};
}
