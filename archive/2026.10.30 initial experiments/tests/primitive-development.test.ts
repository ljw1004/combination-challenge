import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {primitiveDevelopmentEvidence} from '../experiments/primitive-development.ts';
import {LOGICAL_GAMES,createLogicalRun,logicalAct} from '../experiments/logical-games.ts';
import type {LogicalRun} from '../experiments/logical-games.ts';
import type {CheckedDevelopment,FunctionalProjection} from '../experiments/primitive-development.ts';

const captured=(id:string)=>JSON.parse(readFileSync(`results/logical-players/${id}.json`,'utf8')) as LogicalRun;
const place=(projection:FunctionalProjection,id:string)=>projection.places![id] as {form:string;charter:string;record:number;grown:boolean;field:{water:number;seed:boolean;living:boolean;flooded:boolean;exact:number;receivedExact:number};publicExactOrigins:string[]};
const development=(records:CheckedDevelopment[],kind:CheckedDevelopment['kind'])=>{
  const found=records.find(record=>record.kind===kind);assert.ok(found,`Missing ${kind}`);return found;
};
function source(value:unknown,path:string):unknown {
  return path.replace(/\[(\d+)\]/g,'.$1').split('.').reduce<unknown>((current,key)=>current&&typeof current==='object'?(current as Record<string,unknown>)[key]:undefined,value);
}

test('actual field chain verifies a retained regulator becoming a source against a legal water-only alternative',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-field-1'));
  assert.equal(evidence.reconstruction.replay,'pass');
  assert.equal(evidence.reconstruction.transitions.length,2);
  const record=development(evidence.developments,'regulator-to-source');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[0,1]);
  assert.equal(record.changedRole!.object,'place:orchard');assert.equal(record.changedRole!.verified,true);
  assert.ok(record.checks.every(check=>check.pass));
  const branch=record.lawDependence.alternatives[0];
  assert.equal(branch.prefix,1);assert.equal(branch.legal,true);
  assert.deepEqual(branch.actions,[{type:'combine',a:'earth',b:'water',at:'orchard-village'}]);
  assert.equal(place(branch.after,'village').field.water,1);
  assert.equal(place(branch.after,'village').field.seed,false);
  assert.equal(place(branch.after,'village').grown,false);
  assert.equal(place(evidence.reconstruction.transitions[1].after,'village').grown,true);
  assert.ok(branch.checks.every(check=>check.pass&&check.stateKind==='alternative-result'));
  assert.equal(evidence.principleEvidence.F3.coverage,'partially-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'partially-checked');
  assert.ok(record.playerAccounts.notice.some(account=>account.sourcePath==='notes[1].account.causesAndHistory'));
  assert.ok(record.playerAccounts.value.some(account=>account.sourcePath==='notes[1].account.valued'));
  assert.ok(record.claimBoundary.some(boundary=>boundary.status==='not-established'&&/sustained interest/.test(boundary.claim)));
});

test('actual witness episode separates publicity, new delivery, stored quotation and selective erasure',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-confluence-interest-1'));
  const record=development(evidence.developments,'stored-witness-publication-repair');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[13,14,15]);
  assert.ok(record.checks.every(check=>check.pass));
  const published=place(evidence.reconstruction.transitions[13].after,'meeting');
  assert.equal(published.field.flooded,true);assert.deepEqual(published.publicExactOrigins,['bell','mneme']);
  const translated=place(evidence.reconstruction.transitions[14].after,'meeting');
  assert.equal(translated.field.receivedExact,0);assert.equal(translated.record,3);
  assert.equal(translated.field.exact,3);assert.equal(translated.field.flooded,true);
  const transformed=evidence.reconstruction.transitions[15].after;
  assert.equal(place(transformed,'meeting').record,0);assert.equal(place(transformed,'meeting').field.flooded,false);
  assert.equal(place(transformed,'archive').record,3);assert.equal(place(transformed,'village').charter,'open');
  const contrast=record.lawDependence.alternatives[0];
  assert.equal(contrast.legal,true);assert.equal(contrast.actions.length,2);
  assert.equal(place(contrast.after,'meeting').record,3);assert.equal(place(contrast.after,'meeting').field.flooded,false);
  assert.ok(contrast.checks.every(check=>check.pass));
  assert.deepEqual(record.changedRole,{object:'link:archive-meeting',earlierDecision:10,laterDecision:14,beforeRole:'delivery of exact witness testimony',afterRole:'boundary translating fresh testimony while a historical local copy remains',verified:true});
  assert.equal(evidence.counts.singleBranchComparisons,1);
  assert.ok(record.playerAccounts.predictions.some(account=>account.sourcePath==='decisions[14].prediction'));
});

test('Mneme custody prose is not credited as a changed institution or blocked existing record',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-confluence-interest-1'));
  const record=development(evidence.developments,'mneme-policy-without-institution');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[12]);
  const transition=evidence.reconstruction.transitions[12];
  assert.deepEqual(transition.before.places,transition.after.places);
  assert.equal(place(transition.after,'archive').charter,'witness');
  assert.equal(place(transition.after,'archive').field.exact,3);
  assert.equal((transition.after.actors!.mneme as {policy:string}).policy,'chosen-custody');
  assert.equal(record.claimBoundary[0].status,'contradicted');
  assert.equal(record.changedRole,null);assert.equal(record.lawDependence.alternatives.length,0);
  assert.ok(record.playerAccounts.notice.some(account=>account.sourcePath==='decisions[12].observation.response'&&JSON.stringify(account.value).includes('chooses to keep')));
  assert.ok(record.lawDependence.unchecked.some(scope=>scope.includes('future source-policy')));
});

test('long diagnostic gains only checked local consequence coverage, not reuse credit from its many deltas',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-confluence-long-1'));
  assert.equal(evidence.reconstruction.transitions.length,43);
  assert.equal(evidence.developments.length,1);
  assert.equal(evidence.developments[0].kind,'mneme-policy-without-institution');
  assert.equal(evidence.developments[0].status,'verified');
  assert.equal(evidence.principleEvidence.F3.coverage,'partially-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
  assert.equal(place(evidence.reconstruction.transitions[31].after,'archive').charter,'open');
});

test('raw changes and eloquent reports alone do not establish a checked development or changed role',()=>{
  const run=captured('fun-field-1');run.decisions=run.decisions.slice(0,1);
  run.report={mainExperience:'A profound emergent history with endless meaningful reuse.',wantAnother:true};
  const evidence=primitiveDevelopmentEvidence(run);
  assert.ok(evidence.reconstruction.transitions[0].changes.length>0);
  assert.equal(evidence.developments.length,0);
  assert.equal(evidence.principleEvidence.F3.coverage,'not-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
});

test('public evidence uses original capture paths, while reconstructed masks remain reviewer information',()=>{
  const run=captured('fun-confluence-interest-1'),evidence=primitiveDevelopmentEvidence(run);
  const transition=evidence.reconstruction.transitions[13];
  assert.equal(transition.capturedPublic.beforeSourcePath,'decisions[12].observation');
  assert.equal(transition.capturedPublic.afterSourcePath,'decisions[13].observation');
  assert.equal(source(run,transition.capturedPublic.afterSourcePath),run.decisions[13].observation);
  assert.equal(Object.hasOwn(run.decisions[13].observation as object,'board'),false);
  assert.ok(place(transition.after,'meeting').publicExactOrigins.length>0);
  assert.match(evidence.reconstruction.visibility,/not a claim.*public observer/);
  for(const record of evidence.developments)for(const category of Object.values(record.playerAccounts))for(const account of category){
    assert.notEqual(source(run,account.sourcePath),undefined);assert.deepEqual(account.value,source(run,account.sourcePath));
  }
});

test('evidence and sampled branches are deterministic, detached and leave the capture unchanged',()=>{
  const run=captured('fun-field-1'),before=structuredClone(run);
  const evidence=primitiveDevelopmentEvidence(run);
  assert.deepEqual(run,before);assert.deepEqual(evidence,primitiveDevelopmentEvidence(run));
  (evidence.reconstruction.transitions[0].action as {a:string}).a='changed';
  (evidence.developments[0].playerAccounts.predictions[0].value as {intention:string}).intention='changed';
  assert.deepEqual(run,before);
});

test('a changed capture fails exact replay rather than silently receiving richer evidence',()=>{
  const run=captured('fun-field-1');(run.decisions[1].observation as {status:string}).status='won';
  assert.throws(()=>primitiveDevelopmentEvidence(run),/Replay diverged/);
});

test('unadapted games return explicit unknown coverage without invented primitive evidence',()=>{
  const run=captured('fun-bell-2'),evidence=primitiveDevelopmentEvidence(run);
  assert.equal(evidence.supported,false);assert.equal(evidence.adapter,null);
  assert.equal(evidence.reconstruction.replay,'not-supported');assert.deepEqual(evidence.developments,[]);
  assert.equal(evidence.principleEvidence.F3.coverage,'not-checked');assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
});

test('imprints supports reconstructed transitions without unreviewed causal or reuse claims',()=>{
  let run=createLogicalRun(LOGICAL_GAMES.imprints,'imprint-transition-fixture','board',0,'mechanical fixture');
  run=logicalAct(run,{type:'combine',a:'earth',b:'water',at:'A1',toward:'east'}).run;
  const evidence=primitiveDevelopmentEvidence(run);
  assert.equal(evidence.supported,true);assert.equal(evidence.reconstruction.replay,'pass');
  assert.equal(evidence.reconstruction.transitions.length,1);assert.ok(evidence.reconstruction.transitions[0].changes.length>0);
  assert.equal(evidence.developments.length,0);assert.equal(evidence.principleEvidence.F3.coverage,'not-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
});

test('Frontier reconstructs cells, fronts and counterpart while retaining the original compact public sources',()=>{
  const run=captured('fun-frontier-interest-1'),evidence=primitiveDevelopmentEvidence(run);
  assert.equal(evidence.version,'primitive-development-2');assert.equal(evidence.supported,true);
  assert.equal(evidence.adapter,'frontier/frontier-2');assert.equal(evidence.reconstruction.replay,'pass');
  assert.equal(evidence.counts.transitions,6);
  const contact=evidence.reconstruction.transitions[3];
  assert.equal(contact.capturedPublic.beforeSourcePath,'decisions[2].observation');
  assert.equal(contact.capturedPublic.afterSourcePath,'decisions[3].observation');
  assert.equal(source(run,contact.capturedPublic.afterSourcePath),run.decisions[3].observation);
  assert.equal(source(run,'decisions[3].observation.cells'),undefined);
  assert.equal(Object.keys(contact.after.cells as object).length,99);
  assert.deepEqual(contact.after.counterpart,source(run,'decisions[3].observation.counterpart'));
  assert.equal(source(contact.after,'eventsAt.G5[1].kind'),'halt');
  assert.ok(!(source(run,'decisions[3].observation.changes') as {kind:string}[]).some(e=>e.kind==='halt'));
  assert.match(evidence.reconstruction.visibility,/not a claim.*public observer/);
  for(const record of evidence.developments)for(const category of Object.values(record.playerAccounts))for(const account of category){
    assert.notEqual(source(run,account.sourcePath),undefined);assert.deepEqual(account.value,source(run,account.sourcePath));
  }
});

test('Frontier verifies the retained D5 bridge gate becoming a live hearth corner, not background circuit counts',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-frontier-interest-1'));
  const record=development(evidence.developments,'frontier-gate-to-hearth');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[0,2,3]);
  assert.ok(record.checks.every(c=>c.pass&&c.stateKind==='actual-prefix'));
  assert.deepEqual(source(evidence.reconstruction.transitions[0].after,'cells.D5.exits'),['E']);
  assert.deepEqual(source(evidence.reconstruction.transitions[3].after,'cells.D5.exits'),['W']);
  assert.equal(source(evidence.reconstruction.transitions[3].after,'cells.D5.terrain'),'stone');
  assert.ok((source(evidence.reconstruction.transitions[3].after,'circuits.blue') as string[][]).some(c=>JSON.stringify(c)===JSON.stringify(['C4','C5','D4','D5'])));
  assert.equal(record.changedRole!.object,'cell:D5');assert.equal(record.changedRole!.earlierDecision,0);
  assert.equal(record.changedRole!.laterDecision,3);assert.equal(record.changedRole!.verified,true);
  assert.equal(evidence.principleEvidence.F3.coverage,'partially-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'partially-checked');
  assert.deepEqual(evidence.principleEvidence.F7.developmentIds,['frontier-gate-hearth-3','frontier-boundary-4']);
  assert.ok(record.playerAccounts.understanding!.some(a=>a.sourcePath==='report.thoughtful'));
  assert.ok(record.claimBoundary.some(c=>c.status==='not-established'&&/indicator/.test(c.claim)));
});

test('Frontier checks the actual equal Flame contact, vanished fronts and retained G5 scar without inventing a social decision',()=>{
  const evidence=primitiveDevelopmentEvidence(captured('fun-frontier-interest-1'));
  const record=development(evidence.developments,'frontier-equal-contact-scar');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[3]);assert.equal(record.changedRole,null);
  assert.ok(record.checks.every(c=>c.pass));
  const after=evidence.reconstruction.transitions[3].after;
  assert.equal(source(after,'cells.G5.owner'),null);assert.equal(source(after,'tipCounts.G5'),0);
  assert.deepEqual(source(after,'cells.G5.history'),['E','W']);
  assert.deepEqual(source(after,'cells.G5.contacts'),['amber','blue']);
  assert.deepEqual(source(after,'eventsAt.G5[1].after'),['amber:flame','blue:flame']);
  assert.equal(source(evidence.reconstruction.transitions[4].after,'cells.G5.owner'),'amber');
  assert.ok(record.playerAccounts.notice.some(a=>a.sourcePath==='notes[0].account.noticedResponses'));
  assert.ok(!evidence.principleEvidence.F7.developmentIds.includes(record.id));
  assert.ok(record.claimBoundary.some(c=>/permanent peace/.test(c.claim)&&c.status==='not-established'));
});

test('Frontier separates the actual F5 boundary from one legal, unexperienced wait before finish',()=>{
  const run=captured('fun-frontier-interest-1'),evidence=primitiveDevelopmentEvidence(run);
  const record=development(evidence.developments,'frontier-remembered-boundary');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[2,4]);assert.ok(record.checks.every(c=>c.pass));
  assert.deepEqual(source(evidence.reconstruction.transitions[4].after,'cells.F5.closed'),['E']);
  assert.equal(record.changedRole!.object,'cell:F5');assert.equal(record.changedRole!.verified,true);
  assert.equal(record.lawDependence.alternatives.length,1);
  const branch=record.lawDependence.alternatives[0];
  assert.equal(branch.prefix,5);assert.equal(branch.legal,true);assert.deepEqual(branch.actions,[{type:'wait'}]);
  assert.ok(branch.checks.every(c=>c.pass&&c.stateKind==='alternative-result'&&c.prefix===5));
  assert.equal(source(branch.after,'time'),6);assert.equal(source(branch.after,'status'),'playing');
  assert.equal(source(evidence.reconstruction.transitions[5].after,'time'),5);
  assert.equal(source(evidence.reconstruction.transitions[5].after,'status'),'ended');
  assert.deepEqual(source(branch.after,'cells.F5'),source(evidence.reconstruction.transitions[4].after,'cells.F5'));
  assert.deepEqual(source(branch.after,'tipsByKey.amber:G5:W'),{lineage:'amber',at:'G5',heading:'W',kind:'shell',path:'straight'});
  assert.equal(source(branch.after,'tipCounts.F5'),0);assert.equal(source(branch.after,'eventsAt.G5[0].lineage'),'amber');
  assert.equal(source(evidence.reconstruction.transitions[5].after,'cells.G5.kind'),'flame');
  assert.ok(record.playerAccounts.notice.some(a=>a.sourcePath==='report.noticedResponses'&&String(a.value).includes('ended before seeing')));
  assert.ok(record.playerAccounts.value.some(a=>a.sourcePath==='notes[0].account.renewedIntention'));
  assert.ok(record.playerAccounts.understanding!.some(a=>a.sourcePath==='report.unclear'&&String(a.value).includes('long-run')));
  assert.ok(record.claimBoundary.some(c=>c.status==='not-established'&&/permanent/.test(c.claim)));
  assert.equal(evidence.counts.singleBranchComparisons,1);
  assert.equal(run.previews!.length,0);
});

test('Frontier adds a negative footprint/circuit claim only when the actual capture exhibits it',()=>{
  const interest=primitiveDevelopmentEvidence(captured('fun-frontier-interest-1'));
  assert.ok(!interest.developments.some(d=>d.kind==='frontier-footprint-without-live-circuit'));
  const run=captured('fun-frontier-long-1');run.decisions=run.decisions.slice(0,11);
  const evidence=primitiveDevelopmentEvidence(run),record=development(evidence.developments,'frontier-footprint-without-live-circuit');
  assert.equal(record.status,'verified');assert.deepEqual(record.decisions,[10]);assert.ok(record.checks.every(c=>c.pass));
  const after=evidence.reconstruction.transitions[10].after;
  assert.deepEqual(source(after,'counterpart.cherished'),['I2','I3','J2','J3']);
  assert.equal(source(after,'counterpart.purpose'),'extend while keeping remembered circuit');
  assert.equal(source(after,'counterpartRelations.rememberedFootprintOwned'),true);
  assert.equal(source(after,'counterpartRelations.rememberedFootprintInLivingCircuit'),false);
  assert.equal(source(after,'counterpartRelations.hasLivingCircuit'),true);
  assert.equal(record.claimBoundary[0].status,'contradicted');assert.equal(record.changedRole,null);
  assert.deepEqual(record.playerAccounts.notice,[]);assert.deepEqual(record.playerAccounts.understanding,[]);
  assert.equal(record.lawDependence.alternatives.length,0);
  assert.equal(evidence.principleEvidence.F3.coverage,'not-checked');assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
});

test('automatic Frontier circuits and praise without a completed named development earn no effect or reuse coverage',()=>{
  const run=captured('fun-frontier-interest-1');run.decisions=run.decisions.slice(0,3);
  run.report={experience:'The circuits prove deep meaningful reuse and complete understanding of the other mind.',wantAnother:true};
  const evidence=primitiveDevelopmentEvidence(run);
  assert.ok((source(evidence.reconstruction.transitions[2].after,'circuits.blue') as string[][]).length>0);
  assert.ok(evidence.reconstruction.transitions[2].changes.length>0);
  assert.equal(evidence.developments.length,0);assert.equal(evidence.principleEvidence.F3.coverage,'not-checked');
  assert.equal(evidence.principleEvidence.F7.coverage,'not-checked');
});

test('Frontier prefixes can recompute when finish and later completed long-capture actions become available',()=>{
  const interest=captured('fun-frontier-interest-1'),prefix=structuredClone(interest);prefix.decisions=prefix.decisions.slice(0,5);
  const early=primitiveDevelopmentEvidence(prefix);
  assert.equal(early.counts.transitions,5);assert.equal(early.counts.verifiedDevelopments,3);
  assert.equal(early.counts.singleBranchComparisons,0);
  assert.equal(development(early.developments,'frontier-remembered-boundary').lawDependence.alternatives.length,0);
  assert.equal(primitiveDevelopmentEvidence(interest).counts.singleBranchComparisons,1);
  const long=captured('fun-frontier-long-1'),complete=primitiveDevelopmentEvidence(long),first=structuredClone(long);
  first.decisions=first.decisions.slice(0,11);
  const firstNegative=development(primitiveDevelopmentEvidence(first).developments,'frontier-footprint-without-live-circuit');
  const lastNegative=development(complete.developments,'frontier-footprint-without-live-circuit');
  assert.equal(complete.counts.transitions,long.decisions.length);
  assert.deepEqual(lastNegative,firstNegative);
});

test('Frontier evidence remains detached and deterministic, and rejects a changed original public observation',()=>{
  const run=captured('fun-frontier-interest-1'),before=structuredClone(run),evidence=primitiveDevelopmentEvidence(run);
  assert.deepEqual(evidence,primitiveDevelopmentEvidence(run));assert.deepEqual(run,before);
  (evidence.reconstruction.transitions[4].after.counterpart as {purpose:string}).purpose='changed';
  (evidence.developments[0].playerAccounts.understanding![0] as {value:unknown}).value='changed';
  assert.deepEqual(run,before);
  (source(run,'decisions[4].observation.counterpart') as {purpose:string}).purpose='changed';
  assert.throws(()=>primitiveDevelopmentEvidence(run),/Replay diverged/);
});
