import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marsObjectsWorld, stepMarsObjects } from '../../experiments/logical-mars-objects.ts';
import { progressiveCampGoals } from '../../experiments/logical-mars-progressive-camp.ts';
import { progressiveSourceHashes, verifyProgressiveCapture } from '../../experiments/mars-progressive-camp-play.ts';

// Read-only audit of an already finished real pilot. Writes new verification only.
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const session = 'fun-camp-persistent-ordinary-1';
const capturePath = `results/mars-progressive-camp-players/${session}.jsonl`;
const promptPath = `results/mars-progressive-camp-prompts/${session}.json`;
const read = path => readFileSync(resolve(root, path));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const captureBytes = read(capturePath), captureHash = digest(captureBytes);
const events = captureBytes.toString('utf8').trim().split('\n').map(line => JSON.parse(line));
assert.equal(events.at(-1).finished, true, 'Never inspect an unfinished pilot here.');
const verified = verifyProgressiveCapture(events);
assert.equal(verified.finished, true);
assert.equal(events.length, 9);
assert.deepEqual(events[0].metadata.supplied, JSON.parse(read(promptPath)));
assert.equal(events[0].metadata.id, session);
assert.equal(events[0].metadata.catalogue, 'ordinary');
assert.equal(events[0].metadata.supplied.participant.id, '/root/play_persistent_camp_pilot');
const freeze = JSON.parse(read('results/mars-progressive-camp-preplay/freeze-manifest.json'));
const checkedFrozen = Object.entries(freeze.sourceHashes).map(([path, hash]) => {
  assert.equal(digest(read(path)), hash, path);
  return { path, sha256: hash, matches: true };
});
const recovered = JSON.parse(read('results/recovery-2026-10-26/mars-recovery.json')).recovered;
const checkedOriginals = recovered.map(({ file, sha256 }) => {
  assert.equal(digest(read(file)), sha256, file);
  return { path: file, sha256, matches: true };
});
const actions = events.filter(event => event.command === 'act');
const join = (a, b) => ({ type: 'combine', a, b });
assert.deepEqual(actions.map(event => event.argument), [
  join('frame', 'clear-sheet'), join('clear-shell', 'world:camp'),
  join('solar-panel', 'cable'), join('solar-lead', 'lamp'), join('solar-lamp', 'world:camp'),
]);
assert.equal(actions.filter(event => !event.state.camp.accepted).length, 0);
assert.deepEqual(events.map(event => event.command), ['init', 'act', 'act', 'checkpoint', 'act', 'act', 'act', 'report', 'finish']);
const checkpoint = events[3];
assert.equal(checkpoint.argument.question, 'What is your immediate aim, chosen action, expected result and confidence?');
assert.equal(checkpoint.state.camp.combines, 2);
assert.deepEqual(checkpoint.state.milestones, { firstGardenAt: 2, firstProjectAt: null });
assert.deepEqual(checkpoint.state, events[2].state);
assert.equal(events[4].state.camp.combines, 3);
assert.ok(Date.parse(checkpoint.at) < Date.parse(events[4].at));
const finalReport = events[7];
assert.equal(finalReport.argument.question, 'What, if anything, was worth doing here, and what felt routine or unnecessary?');
assert.deepEqual(finalReport.state, events[6].state);
assert.equal(events.filter(event => event.command === 'report').length, 1);
assert.equal(events.filter(event => event.command === 'checkpoint').length, 1);

const worldTimeline = events.map((event, index) => {
  const goals = progressiveCampGoals(event.state);
  const world = marsObjectsWorld(event.state.camp);
  if (index > 0 && event.command === 'act') assert.deepEqual(event.state.camp, stepMarsObjects(events[index - 1].state.camp, event.argument));
  const observation = event.command === 'finish' ? event.output.observation
    : event.output?.version === 'mars-progressive-camp-1' ? event.output : null;
  if (observation) {
    assert.deepEqual(observation.goals, goals);
    assert.deepEqual(observation.milestones, event.state.milestones);
    assert.deepEqual(observation.installations, event.state.camp.installations);
    assert.deepEqual(observation.world, world);
    assert.equal(observation.status, goals.projectCompleteNow ? 'complete' : 'playing');
  }
  if (event.state.camp.combines >= 2) {
    assert.equal(goals.gardenNow, true);
    assert.deepEqual(event.state.camp.installations[0], events[2].state.camp.installations[0]);
  }
  return { seq: event.seq, command: event.command, combine: event.state.camp.combines, goals,
    milestones: event.state.milestones, installations: event.state.camp.installations,
    currentReception: world.observer.receiving, interiorSources: world.camp.interiorSources,
    cliObservationEmitted: !!observation, automaticPreviewEntriesEmitted: observation?.previews.length ?? 0,
    observationSha256: observation ? digest(JSON.stringify(observation)) : null };
});
const last = events.at(-1).state;
assert.deepEqual(last.milestones, { firstGardenAt: 2, firstProjectAt: 5 });
assert.deepEqual(progressiveCampGoals(last), { gardenNow: true, located: true, projectCompleteNow: true });
assert.equal(last.camp.installations[0].builtFrom, 'clear-shell');
assert.equal(last.camp.installations[1].builtFrom, 'solar-lamp');
assert.equal(last.camp.installations[1].id, '2');
assert.equal(last.camp.observer.firstReception.combine, 5);
assert.deepEqual(last.camp.observer.firstReception.rays.map(ray => [ray.source, ray.direction]), [['lamp:2', 'north']]);
assert.deepEqual(last.camp.known, ['frame', 'clear-sheet', 'reflective-cover', 'solar-panel', 'cable', 'lamp', 'clear-shell', 'solar-lead', 'solar-lamp']);
assert.equal(digest(read(capturePath)), captureHash, 'Capture changed during verification.');
assert.deepEqual(progressiveSourceHashes(), events[0].metadata.sourceHashes);
const report = {
  at: new Date().toISOString(), session,
  evidence: 'Independent post-completion audit of the captured agent pilot; no human enjoyment or long-session claim.',
  capture: { path: capturePath, sha256: captureHash, events: events.length, finished: verified.finished, stateHash: verified.stateHash, exactReplay: true, unchangedDuringReview: true },
  metadata: { promptPath, promptFileSha256: digest(read(promptPath)), suppliedExactlyMatchesPromptFile: true,
    participant: events[0].metadata.supplied.participant, prospectiveCommitReportedByCoordinator: events[0].metadata.supplied.prospectiveCommit,
    remoteCommitNotIndependentlyReadByThisReview: true },
  checkedFrozen, checkedOriginals,
  counts: { acceptedCombines: actions.length, rejectedCombines: 0, explicitPreviewRequests: 0, explicitViewRequests: 0,
    emittedFullObservations: worldTimeline.filter(frame => frame.cliObservationEmitted).length,
    emittedAutomaticPreviewEntries: worldTimeline.reduce((sum, frame) => sum + frame.automaticPreviewEntriesEmitted, 0),
    checkpoints: 1, openReports: 1, followupReports: 0, finishCommands: 1, postCompletionCombines: 0 },
  worldTimeline,
  checkpoint: { seq: checkpoint.seq, prospectiveBeforeThirdCombine: true, verbatim: checkpoint.argument,
    observedNextResult: 'Solar-lead blueprint learned; prior physical shell and both world predicates unchanged.' },
  finalReport: { seq: finalReport.seq, verbatim: finalReport.argument,
    recognitionLabel: 'Volunteered within the open final response, with no second follow-up question. Initial assignment disclosed the possible earlier-work question, so not wholly unprimed.' },
  mechanics: { gardenFirstAt: 2, projectFirstAt: 5, continuouslyFunctionalAfterGarden: true,
    retainedShellId: '1', retainedShellUnmodified: true, freshLampInstallationId: '2',
    actualLeadInstallationModified: false, earnedLocationFirstAt: 5, currentReceptionAtFinish: true,
    knownBlueprintsLearned: ['clear-shell', 'solar-lead', 'solar-lamp'] },
  interpretation: { stagedPersistenceExercised: true,
    supported: 'The same earlier clear enclosure remains functional while a newly installed powered lamp completes the second goal; the agent explicitly attributes value to that relation.',
    notEstablished: ['human fun', 'comfort as a reported feeling', 'causal advantage over reset', 'unprompted demand for further projects', 'about 200 decisions', 'human duration', 'every emitted preview was read'],
    conditionalResetControl: 'Eligibility met for a separately preregistered matched qualitative control; it is not required to validate persistence mechanically and would not establish the full-scale target.' },
};
const out = `results/mars-progressive-camp-play-review/verification-${report.at.replaceAll(':', '-')}.json`;
mkdirSync(resolve(root, 'results/mars-progressive-camp-play-review'), { recursive: true });
writeFileSync(resolve(root, out), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ out, capture: report.capture, counts: report.counts, mechanics: report.mechanics }, null, 2));
