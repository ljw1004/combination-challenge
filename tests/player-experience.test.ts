import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeExperienceReport } from '../experiments/player-experience.ts';
import type { Evidence } from '../experiments/player-experience.ts';

function capturedReport(name: 'bell' | 'mneme' | 'council' | 'progress',version=1): Record<string, unknown> {
  const run = JSON.parse(readFileSync(new URL(`../results/logical-players/fun-${name}-${version}.json`, import.meta.url), 'utf8'));
  return run.report;
}
const at = (evidence: Evidence[], sourcePath: string) => evidence.find(item => item.sourcePath === sourcePath);

test('actual Bell report preserves the noticed story, closure, explicit absence and zero optional combinations', () => {
  const report = capturedReport('bell'), normalized = normalizeExperienceReport(report);
  assert.equal(normalized.experience.length, 5);
  assert.equal(at(normalized.experience, 'report.experienceSequence[0]')?.value, (report.experienceSequence as unknown[])[0]);
  assert.equal(normalized.responses.length, 3);
  assert.equal(at(normalized.narrative, 'report.passageThatMattered')?.value, report.passageThatMattered);
  assert.equal(at(normalized.narrative, 'report.storyAppreciation')?.value, report.storyAppreciation);
  assert.equal(at(normalized.closure, 'report.closure')?.value, report.closure);
  assert.deepEqual(normalized.explicit.noRenewedIntention, [{ sourcePath: 'report.renewedIntention', value: true }]);
  assert.deepEqual(normalized.explicit.optionalActions, [{ sourcePath: 'report.optionalCombinations', value: 0 }]);
  assert.deepEqual(normalized.explicit.satisfiedClosure, []); // Prose is preserved, not sentiment-classified.
  assert.equal(at(normalized.forwardWishes, 'report.wantToDiscoverNext')?.value, report.wantToDiscoverNext);
  assert.equal(at(normalized.unclassifiedFields, 'report.logicalChallenge')?.value, report.logicalChallenge);
  assert.ok(normalized.repetitions.every(entry => entry.judgment === 'unknown'));
});

test('actual Mneme report distinguishes an ending intention from renewed intention', () => {
  const report = capturedReport('mneme'), normalized = normalizeExperienceReport(report);
  const closure = report.renewedIntentionOrClosure as Record<string, unknown>;
  assert.equal(at(normalized.responses, 'report.noticedWorldAndCharacter')?.value, report.noticedWorldAndCharacter);
  assert.equal(at(normalized.narrative, 'report.meaningfulConceptOrPassage')?.value, report.meaningfulConceptOrPassage);
  assert.equal(at(normalized.narrative, 'report.storyAppreciation')?.value, report.storyAppreciation);
  assert.equal(at(normalized.closure, 'report.renewedIntentionOrClosure.intention')?.value, closure.intention);
  assert.equal(at(normalized.closure, 'report.renewedIntentionOrClosure.reasonForStopping')?.value, closure.reasonForStopping);
  assert.equal(at(normalized.renewal, 'report.renewedIntentionOrClosure.intention'), undefined);
  assert.deepEqual(normalized.explicit.satisfiedClosure, [{ sourcePath: 'report.renewedIntentionOrClosure.state', value: true }]);
  assert.deepEqual(normalized.explicit.optionalActions, [{ sourcePath: 'report.renewedIntentionOrClosure.optionalActions', value: 0 }]);
  assert.deepEqual(normalized.explicit.noRenewedIntention, []); // Closure does not assert this different field.
  assert.deepEqual(normalized.explicit.wantsAnother, []); // "Low" is not parsed as a boolean.
  assert.equal(at(normalized.forwardWishes, 'report.wantingMore')?.value, report.wantingMore);
});

test('actual council repetition headings retain denial and overhead reports without affirming every heading', () => {
  const report = capturedReport('council'), normalized = normalizeExperienceReport(report);
  const repetition = report.repetition as Record<string, unknown>;
  assert.deepEqual(normalized.repetitions.map(entry => entry.sourcePath), [
    'report.repetition.valued', 'report.repetition.unwanted', 'report.repetition.neutral',
    'report.automaticResolutionOfSettledCombines',
  ]);
  assert.equal(normalized.repetitions[0].account, repetition.valued);
  assert.match(String(normalized.repetitions[0].account), /None observed/);
  assert.ok(normalized.repetitions.every(entry => entry.judgment === 'unknown'));
  assert.equal(at(normalized.responses, 'report.episodes[0].noticedResponse')?.value,
    (report.episodes as Record<string, unknown>[])[0].noticedResponse);
  assert.deepEqual(normalized.explicit.wantsAnother, [{ sourcePath: 'report.wantAnother', value: false }]);
});

test('actual progression retains valued reuse and selective future interest without inventing booleans or role changes', () => {
  const report = capturedReport('progress'), normalized = normalizeExperienceReport(report);
  assert.equal(at(normalized.experience, 'report.episodes[1]')?.value, (report.episodes as unknown[])[1]);
  assert.deepEqual(normalized.repetitions.map(entry => entry.judgment), ['neutral', 'valued', 'neutral']);
  assert.equal(normalized.repetitions[1].sourcePath, 'report.repetition[1]');
  assert.equal(normalized.repetitions[1].changedRole, null);
  assert.equal(at(normalized.forwardWishes, 'report.wantAnother')?.value, report.wantAnother);
  assert.deepEqual(normalized.explicit.wantsAnother, []);
  assert.equal(at(normalized.unclassifiedFields, 'report.choiceExamples')?.value, report.choiceExamples);
});

test('absence, explicit null, explicit false, zero and empty arrays remain distinct', () => {
  const absent = normalizeExperienceReport({});
  assert.deepEqual(absent.renewal, []);
  assert.deepEqual(absent.explicit.noRenewedIntention, []);
  assert.deepEqual(absent.explicit.wantsAnother, []);
  const present = normalizeExperienceReport({ renewedIntention: null, wantAnother: false, satisfiedClosure: false, optionalActions: 0, experience: [] });
  assert.deepEqual(present.renewal, [{ sourcePath: 'report.renewedIntention', value: null }]);
  assert.deepEqual(present.explicit.noRenewedIntention, [{ sourcePath: 'report.renewedIntention', value: true }]);
  assert.deepEqual(present.explicit.wantsAnother, [{ sourcePath: 'report.wantAnother', value: false }]);
  assert.deepEqual(present.explicit.satisfiedClosure, [{ sourcePath: 'report.satisfiedClosure', value: false }]);
  assert.deepEqual(present.explicit.optionalActions, [{ sourcePath: 'report.optionalActions', value: 0 }]);
  assert.deepEqual(present.experience, [{ sourcePath: 'report.experience', value: [] }]);
});

test('multiple narrative accounts survive together and their presence supplies no positive-appreciation flag', () => {
  const normalized = normalizeExperienceReport({
    narrative: 'This did not interest me.', storyAppreciation: 'None.',
    passageThatMattered: 'I disliked this passage.', closure: 'Satisfied',
    renewedIntention: 'None', wantAnother: { answer: 'No' },
  });
  assert.equal(normalized.narrative.length, 3);
  assert.deepEqual(normalized.explicit, { noRenewedIntention: [], satisfiedClosure: [], wantsAnother: [], optionalActions: [] });
  assert.equal('positiveAppreciation' in normalized, false);
});

test('ambiguous structured intentions and unknown nested fields remain reviewable without being called renewal', () => {
  const report = { renewedIntentionOrClosure: { state: 'undecided', intention: 'Leave things here?', optionalActions: -1, newQuestion: 'What did the player mean?' } };
  const normalized = normalizeExperienceReport(report);
  assert.deepEqual(normalized.renewal, []);
  assert.deepEqual(normalized.explicit.satisfiedClosure, []);
  assert.deepEqual(normalized.explicit.optionalActions, []);
  assert.equal(at(normalized.unclassifiedFields, 'report.renewedIntentionOrClosure.intention')?.value, 'Leave things here?');
  assert.equal(at(normalized.unclassifiedFields, 'report.renewedIntentionOrClosure.newQuestion')?.value, 'What did the player mean?');
  assert.deepEqual(normalized.experience[0].value, report.renewedIntentionOrClosure);
});

test('structured repetition evidence and boolean future answers are preserved without mutating reports', () => {
  const report = { repetition: [{ judgment: 'unwanted', changedRole: true, why: 'A new role still felt like work.' }], wantAnother: { answer: false, why: 'Finished' }, unknownFinding: { meaningful: false } };
  const saved = structuredClone(report), normalized = normalizeExperienceReport(report);
  assert.deepEqual(report, saved);
  assert.equal(normalized.repetitions[0].judgment, 'unwanted');
  assert.equal(normalized.repetitions[0].changedRole, true);
  assert.deepEqual(normalized.explicit.wantsAnother, [{ sourcePath: 'report.wantAnother.answer', value: false }]);
  assert.deepEqual(normalized.unclassifiedFields, [{ sourcePath: 'report.unknownFinding', value: { meaningful: false } }]);
});

test('missing and malformed report containers remain distinct without fabricating experience', () => {
  assert.deepEqual(normalizeExperienceReport(undefined).unclassifiedFields, []);
  assert.deepEqual(normalizeExperienceReport(null).unclassifiedFields, [{ sourcePath: 'report', value: null }]);
  assert.deepEqual(normalizeExperienceReport('not an object').unclassifiedFields, [{ sourcePath: 'report', value: 'not an object' }]);
  const malformed = normalizeExperienceReport({ optionalActions: '0', repetition: null, satisfiedClosure: 'yes' });
  assert.deepEqual(malformed.explicit.optionalActions, []);
  assert.deepEqual(malformed.explicit.satisfiedClosure, []);
  assert.equal(malformed.repetitions[0].judgment, 'unknown');
  assert.deepEqual(malformed.repetitions[0].account, null);
  assert.equal(at(malformed.unclassifiedFields, 'report.optionalActions')?.value, '0');
});

test('unrecognized field names with dots retain an unambiguous source path', () => {
  const normalized = normalizeExperienceReport({ 'new.finding': false, repetition: { 'other[0]': null } });
  assert.deepEqual(normalized.unclassifiedFields, [
    { sourcePath: 'report["new.finding"]', value: false },
    { sourcePath: 'report.repetition["other[0]"]', value: null },
  ]);
});

test('actual revised Bell preserves appreciation and the chosen stopping reason after curiosity',()=>{
  const report=capturedReport('bell',2),normalized=normalizeExperienceReport(report);
  assert.equal(at(normalized.narrative,'report.appreciation')?.value,report.appreciation);
  assert.equal(at(normalized.closure,'report.actualStoppingReason')?.value,report.actualStoppingReason);
});

test('actual revised Mneme preserves a prose closure without converting it into a boolean',()=>{
  const report=capturedReport('mneme',2),normalized=normalizeExperienceReport(report);
  assert.equal(at(normalized.closure,'report.renewedIntentionOrClosure')?.value,report.renewedIntentionOrClosure);
  assert.equal(at(normalized.narrative,'report.appreciation')?.value,report.appreciation);
  assert.deepEqual(normalized.explicit.satisfiedClosure,[]);
});

test('long report dialect retains closure and ambitious questions without treating them as elective play',()=>{
  const report={stoppingPoint:{choice:'stop'},satisfyingClosure:{achieved:true,description:'My valley is complete.'},continuingQuestions:'Could a later author change it?',actualElectiveConstruction:{afterRequiredCheckpoint:'None.'}};
  const normalized=normalizeExperienceReport(report);
  assert.equal(at(normalized.closure,'report.stoppingPoint')?.value,report.stoppingPoint);
  assert.deepEqual(normalized.explicit.satisfiedClosure,[{sourcePath:'report.satisfyingClosure.achieved',value:true}]);
  assert.equal(at(normalized.forwardWishes,'report.continuingQuestions')?.value,report.continuingQuestions);
  assert.equal(normalized.explicit.optionalActions.length,0);
});
test('completed or supplied ambition origins are not a prospective renewed intention',()=>{
  const provenance={completed:['Make a quiet archive'],supplied:['Protect orchard']};
  const normalized=normalizeExperienceReport({ambitionSources:provenance});
  assert.deepEqual(normalized.renewal,[]);
  assert.deepEqual(normalized.intentionOrigins,[{sourcePath:'report.ambitionSources',value:provenance}]);
});
