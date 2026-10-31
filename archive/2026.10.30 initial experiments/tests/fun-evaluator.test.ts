import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOGICAL_GAMES, createLogicalRun, logicalAct } from '../experiments/logical-games.ts';
import { evaluateFun, checkPredictions, episodeAccounts, continuationEvidence, narrativeDisclosure } from '../experiments/fun-evaluator.ts';
import type { LogicalRun } from '../experiments/logical-games.ts';
import type { FunDesign } from '../experiments/fun-evaluator.ts';
const design:FunDesign={id:'fixture',registration:'fixture',source:'tests/fun-evaluator.test.ts',proposedPleasures:['insight','valued enactment'],experienceEngine:'One understood construction may be worth enacting.',valuedObject:'A created form',narrativeQuestion:null,renewalPromise:null,combining:{semantics:'union',skill:'composition',consequences:'new form',meaning:'test'},falsifiers:['Player finds no value.'],nextExperiment:'Ask about the enacted result.'};
function solved(){return logicalAct(createLogicalRun(LOGICAL_GAMES.forms,'fixture','first-join',0,'mechanical fixture'),{type:'combine',a:'n1',b:'n2',dx:0,dy:-2},{episode:'one-insight',expectedStatus:'won'}).run;}
test('an elegant unique-answer insight receives no missing-tradeoff or brevity penalty',()=>{
  const profile=evaluateFun(solved(),design);
  assert.equal(profile.evidence.mechanical.status,'won');assert.deepEqual(profile.design.proposedPleasures,['insight','valued enactment']);
  assert.equal('funScore'in profile,false);assert.equal(profile.attention.humanPlaytime,null);
});
test('eloquent appreciation and an incorrect prediction remain separate evidence',()=>{
  const run=solved();run.decisions[0].prediction={expectedStatus:'lost',description:'A profound and beautiful solution'};
  run.report={narrative:'I appreciated the known form.',repetition:[{judgment:'valued',changedRole:false}]};
  assert.equal(checkPredictions(run)[0].correct,false);
  const profile=evaluateFun(run,design);assert.equal(profile.experienceAcrossTime.narrativeOrConceptualReport,'I appreciated the known form.');
  assert.equal(profile.evidence.player.repetitions[0].report,'valued');
});
test('a plan spanning commands is one annotated episode and unknown cognition is preserved',()=>{
  const run=solved(),more=structuredClone(run);more.decisions=[...more.decisions,...more.decisions,...more.decisions];
  assert.equal(episodeAccounts(more).annotated.length,1);
  run.decisions[0].prediction=undefined;assert.match(episodeAccounts(run).boundaryStatus,/Unknown/);
});
test('required completion and a future wish are not recorded as elective play',()=>{
  const run=solved();run.report={wantAnother:true};
  assert.equal(continuationEvidence(run).actualElectiveActions,0);assert.match(continuationEvidence(run).finding,/no appetite/);
  run.checkpoints=[{decisionIndex:1,reason:'Valid stop'}];run.continuation={decisionIndex:1,intention:'Try something different',source:'test prompt'};
  assert.equal(continuationEvidence(run).actualElectiveActions,0);assert.match(continuationEvidence(run).finding,/no verified elective construction/);
});
test('elective action is observed under the protocol without being called human enjoyment',()=>{
  let run=createLogicalRun(LOGICAL_GAMES.forms,'elective','first-join',0,'fixture');
  run.checkpoints=[{decisionIndex:0,reason:'Valid stop'}];run.continuation={decisionIndex:0,intention:'Make this form',source:'test prompt'};
  run=logicalAct(run,{type:'combine',a:'n1',b:'n2',dx:0,dy:-2}).run;
  assert.equal(run.decisions[0].phase,'elective');assert.equal(continuationEvidence(run).actualElectiveActions,1);
  assert.match(continuationEvidence(run).limitation,/not voluntary human/);
});
test('elective waiting is observable phase choice and never relabeled construction',()=>{
  let run=createLogicalRun(LOGICAL_GAMES.resonance,'wait-fixture','shared-garden',0,'mechanical fixture');
  run.checkpoints=[{decisionIndex:0,reason:'Fixture stopping point'}];
  run.continuation={decisionIndex:0,intention:'Watch the phase evolve',source:'fixture'};
  run=logicalAct(run,{type:'wait',beats:6}).run;
  const continuation=continuationEvidence(run),profile=evaluateFun(run,design);
  assert.equal(continuation.actualElectiveActions,0);
  assert.deepEqual(continuation.electiveWaitDecisionIndices,[0]);
  assert.equal(profile.attention.waitActions,1);
  assert.equal(profile.attention.explicitlyRequestedBeats,6);
  assert.equal(profile.attention.constructiveActions,0);
});
test('narrative appreciation survives unchanged mechanical structure',()=>{
  const run=solved();run.report={narrative:'The meaning of a remembered shape made this worthwhile.',renewedIntention:null,wantAnother:false,closure:'Satisfied'};
  const profile=evaluateFun(run,design);
  assert.match(String(profile.experienceAcrossTime.narrativeOrConceptualReport),/remembered/);
  assert.equal(profile.experienceAcrossTime.continuation.reportedClosure,'Satisfied');
  assert.match(profile.experienceAcrossTime.provisionalInterpretation,/appreciation and continuing absorption are distinct/);
});
const captured=(id:string)=>JSON.parse(readFileSync(`results/logical-players/${id}.json`,'utf8')) as LogicalRun;
test('long diagnostic retains intermediate intentions and distinguishes a scope target from duration',()=>{
  const run=captured('fun-confluence-long-1');
  const profile=evaluateFun(run,{...design,requestedScope:{decisionRange:[180,240],pacingAssumptionSeconds:10,intendedMinutes:[30,40]}});
  assert.equal(profile.attention.committedActions,43);
  assert.equal(profile.attention.constructiveActions,42);
  assert.equal(profile.attention.finishActions,1);
  assert.equal(profile.attention.requestedScope?.reachedLowerActionCount,false);
  assert.equal(profile.attention.humanPlaytime,null);
  assert.equal(profile.experienceAcrossTime.checkpointAccounts.length,2);
  assert.deepEqual(profile.experienceAcrossTime.checkpointAccounts[0].account,run.notes![0].account);
  assert.match(profile.experienceAcrossTime.checkpointAccounts[0].sourcePath,/notes\[0\]/);
});
test('a finish command cannot satisfy a constructive-intervention scope threshold',()=>{
  const profile=evaluateFun(captured('fun-bell-1'),{...design,requestedScope:{decisionRange:[2,3],pacingAssumptionSeconds:10,intendedMinutes:[1,1]}});
  assert.equal(profile.attention.committedActions,2);
  assert.equal(profile.attention.constructiveActions,1);
  assert.equal(profile.attention.requestedScope?.reachedLowerActionCount,false);
});
test('owner rejection changes the next vehicle without erasing an earlier player’s appreciation',()=>{
  const profile=evaluateFun(captured('fun-mneme-2'),{...design,expression:{vehicle:'authored-prose',status:'superseded',rationale:'Owner correction'}});
  assert.ok(profile.experienceAcrossTime.narrativeOrConceptualReport);
  assert.equal(profile.experienceAcrossTime.continuation.actualElectiveActions,2);
  assert.match(profile.nextDesignExperiment.proposal,/primitive-level/);
  assert.equal(profile.currentDirection.declaredExpression?.status,'superseded');
});
test('a primitive-state run retains its actual causal appreciation, closure and elective construction',()=>{
  const profile=evaluateFun(captured('fun-field-1'),design);
  assert.equal(profile.experienceAcrossTime.continuation.actualElectiveActions,1);
  assert.ok(profile.experienceAcrossTime.reportedExperience.some(item=>item.sourcePath==='report.mainExperience'));
  assert.ok(profile.experienceAcrossTime.closure.some(item=>item.sourcePath==='report.stopping'));
  assert.equal(profile.evidence.access.narrativeDisclosure.passages.length,0);
});
test('actual story reports reach the experience-first account and retain satisfied stopping',()=>{
  for(const id of ['fun-bell-1','fun-mneme-1']){
    const profile=evaluateFun(captured(id),design);
    assert.ok(profile.experienceAcrossTime.narrativeOrConceptualReport);
    assert.ok(profile.experienceAcrossTime.reportedExperience.length);
    assert.ok(profile.experienceAcrossTime.closure.length);
    assert.equal(profile.experienceAcrossTime.continuation.actualElectiveActions,0);
    assert.match(profile.experienceAcrossTime.provisionalInterpretation,/closure or no renewed intention/);
  }
});
test('older elective actions are not attributed to a later unacted intention',()=>{
  const run=captured('fun-bell-1');run.decisions[0].phase='elective';run.continuation={decisionIndex:2,intention:'A later plan',source:'fixture'};
  assert.equal(continuationEvidence(run).actualElectiveActions,0);
});
test('an arbitrary older linked session does not establish elective play',()=>{
  const run=captured('fun-bell-1'),other=captured('fun-progress-1');run.continuation={decisionIndex:1,intention:'Try something',source:'fixture',nextSession:other.id};
  assert.equal(continuationEvidence(run,[other]).actualElectiveActions,0);
  assert.equal(continuationEvidence(run,[other]).intervals[0].linked?.provenanceVerified,false);
});
test('a closure action is distinct from continued constructive pursuit',()=>{
  const run=captured('fun-bell-1');run.continuation={decisionIndex:1,intention:'Leave the world here',source:'fixture'};run.decisions[1].phase='elective';
  const evidence=continuationEvidence(run);assert.equal(evidence.actualElectiveActions,0);assert.deepEqual(evidence.closureDecisionIndices,[1]);
});
test('a prospectively linked session with provenance can corroborate elective construction',()=>{
  const parent=solved(),child=solved();child.id='prospective';child.condition=`elective-after-${parent.id}`;child.startedAt='2026-10-25T00:02:00Z';
  parent.checkpoints=[{decisionIndex:1,reason:'Stop valid'}];parent.continuation={decisionIndex:1,intention:'A new construction',source:'fixture',nextSession:child.id,recordedAt:'2026-10-25T00:01:00Z'};
  child.electiveOrigin={run:parent.id,decisionIndex:1,recordedAt:parent.continuation.recordedAt!};
  assert.equal(continuationEvidence(parent,[child]).actualElectiveActions,1);
});
test('a passage already exposed in an embedded preview is not credited as a new revelation',()=>{
  const disclosure=narrativeDisclosure(captured('fun-bell-1'));
  const passage=disclosure.passages.find(item=>item.text.includes('It is not an alarm'));
  assert.ok(passage);assert.equal(passage.alreadyAvailable,true);assert.match(passage.earliestVerbatimExposure,/initialObservation.previews/);
});
test('post-play design leads change for uptake, satisfied stop and missing experience',()=>{
  const stop=evaluateFun(captured('fun-bell-1'),design),continuePlay=evaluateFun(captured('fun-bell-2'),design),missing=evaluateFun(solved(),design);
  assert.notDeepEqual(stop.nextDesignExperiment,continuePlay.nextDesignExperiment);
  assert.notDeepEqual(continuePlay.nextDesignExperiment,missing.nextDesignExperiment);
  assert.match(continuePlay.nextDesignExperiment.proposal,/Retain/);
});
test('the actual Bell revision has two elective combines, excluding its finish',()=>{
  const evidence=continuationEvidence(captured('fun-bell-2'));
  assert.equal(evidence.actualElectiveActions,2);assert.equal(evidence.closureDecisionIndices.length,1);
  assert.equal(continuationEvidence(captured('fun-mneme-2')).actualElectiveActions,2);
});
test('unperformed forecast passages are available information, never enacted results',()=>{
  const disclosure=narrativeDisclosure(captured('fun-bell-1'));
  assert.ok(disclosure.passages.length);assert.ok(disclosure.passages.every(passage=>!passage.enactedAt.includes('.previews')));
  assert.ok(disclosure.passages.every(passage=>!passage.text.startsWith('Stone closes around the bell')));
});
test('linked provenance must match the complete origin tuple',()=>{
  const parent=solved(),child=solved();child.id='wrong-origin';child.condition=`elective-after-${parent.id}`;child.startedAt='2026-10-25T00:02:00Z';
  parent.checkpoints=[{decisionIndex:1,reason:'Stop valid'}];parent.continuation={decisionIndex:1,intention:'Continue',source:'fixture',nextSession:child.id,recordedAt:'2026-10-25T00:01:00Z'};
  child.electiveOrigin={run:parent.id,decisionIndex:0,recordedAt:parent.continuation.recordedAt!};
  assert.equal(continuationEvidence(parent,[child]).actualElectiveActions,0);
});
test('elective inspections at one decision boundary belong to one chronological intention',()=>{
  const run=solved();run.checkpoints=[{decisionIndex:1,reason:'Stop valid'}];
  run.continuations=[{decisionIndex:1,intention:'First question',source:'fixture',recordedAt:'2026-10-25T00:01:00Z'},{decisionIndex:1,intention:'Second question',source:'fixture',recordedAt:'2026-10-25T00:03:00Z'}];
  run.previews=[{decisionIndex:1,action:{},result:{},phase:'elective',recordedAt:'2026-10-25T00:02:00Z'},{decisionIndex:1,action:{},result:{},phase:'elective',recordedAt:'2026-10-25T00:04:00Z'}];
  const evidence=continuationEvidence(run);assert.equal(evidence.electiveInspectionCalls,2);assert.deepEqual(evidence.intervals.map(interval=>interval.inspectionCalls),[1,1]);
});
