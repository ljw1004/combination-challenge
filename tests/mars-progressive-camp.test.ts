import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join as pathJoin } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { legalMarsObjectsActions, marsObjectsWorld, replayMarsObjects } from '../experiments/logical-mars-objects.ts';
import { createProgressiveCamp, observeProgressiveCamp, previewProgressiveCamp, progressiveCampGoals, progressiveCampWitnesses, replayProgressiveCamp, stepProgressiveCamp } from '../experiments/logical-mars-progressive-camp.ts';
import { hashProgressiveRecord, progressiveSourceHashes, verifyProgressiveCapture } from '../experiments/mars-progressive-camp-play.ts';
import type { CaptureEvent } from '../experiments/mars-progressive-camp-play.ts';
import { runProgressiveCampScreen } from '../experiments/mars-progressive-camp-screen.ts';

const witnesses = progressiveCampWitnesses();
const join = (a: string, b: string) => ({ type: 'combine' as const, a, b });

test('progressive camp: both goals are public initially; no physical or catalogue law changes', () => {
  const state = createProgressiveCamp(), view = observeProgressiveCamp(state);
  assert.deepEqual(view.goals, { gardenNow: false, located: false, projectCompleteNow: false });
  assert.deepEqual(view.milestones, { firstGardenAt: null, firstProjectAt: null });
  assert.match(view.goal, /observer locate it/);
  assert.match(view.goal, /both together/);
  assert.equal(view.status, 'playing');
  assert.deepEqual(view.legalActions, legalMarsObjectsActions(state.camp));
  assert.equal(view.recipes.length, 6);
  assert.equal(view.allConcepts.length, 12);
  assert.throws(() => createProgressiveCamp('bogus' as 'ordinary'));
});

test('progressive camp: earlier actual shell survives milestone and remains useful to an attached actual lamp', () => {
  const garden = replayProgressiveCamp(witnesses.incremental.slice(0, 2)), finished = replayProgressiveCamp(witnesses.incremental);
  assert.equal(garden.camp.status, 'won');
  assert.equal(observeProgressiveCamp(garden).status, 'playing');
  assert.deepEqual(garden.milestones, { firstGardenAt: 2, firstProjectAt: null });
  assert.deepEqual(finished.milestones, { firstGardenAt: 2, firstProjectAt: 5 });
  assert.deepEqual(finished.camp.installations[0], garden.camp.installations[0]);
  assert.equal(finished.camp.installations[1].id, '2');
  assert.equal(finished.camp.installations[1].builtFrom, 'solar-lead');
  assert.equal(finished.camp.installations[1].power?.lamp, true);
  assert.ok(finished.camp.known.includes('solar-lamp'));
  assert.deepEqual(finished.camp, replayMarsObjects(witnesses.incremental, 'garden'));
});

test('progressive camp: a universal ordinary construction can earn both milestones on the same action', () => {
  const state = replayProgressiveCamp(witnesses.universal);
  assert.deepEqual(state.milestones, { firstGardenAt: 5, firstProjectAt: 5 });
  assert.equal(observeProgressiveCamp(state).status, 'complete');
  assert.equal(state.camp.installations.length, 1);
});

test('progressive camp: one known prefab placement is allowed and retains its canonical components', () => {
  const state = replayProgressiveCamp(witnesses.completePrefab, 'complete');
  assert.deepEqual(state.milestones, { firstGardenAt: 1, firstProjectAt: 1 });
  assert.equal(state.camp.installations[0].shell?.frame, true);
  assert.equal(state.camp.installations[0].power?.lamp, true);
  assert.equal(state.camp.combines, 1);
});

test('progressive camp: temporary garden loss is recoverable and milestones retain actual first indices', () => {
  const dark = replayProgressiveCamp(witnesses.repurpose.slice(0, 3));
  assert.deepEqual(progressiveCampGoals(dark), { gardenNow: false, located: true, projectCompleteNow: false });
  assert.deepEqual(dark.milestones, { firstGardenAt: 2, firstProjectAt: null });
  assert.deepEqual(dark.camp.installations[0].shell?.layers, ['clear', 'reflective']);
  const restored = replayProgressiveCamp(witnesses.repurpose);
  assert.deepEqual(restored.milestones, { firstGardenAt: 2, firstProjectAt: 6 });
  assert.equal(progressiveCampGoals(restored).projectCompleteNow, true);
});

test('progressive camp: current reception can cease without undoing valid project completion', () => {
  const state = replayProgressiveCamp(witnesses.clearSourceCut);
  assert.equal(marsObjectsWorld(state.camp).observer.receiving, false);
  assert.deepEqual(progressiveCampGoals(state), { gardenNow: true, located: true, projectCompleteNow: true });
  assert.deepEqual(state.milestones, { firstGardenAt: 2, firstProjectAt: 5 });
});

test('progressive camp: earned completion cannot substitute for current garden illumination', () => {
  const state = replayProgressiveCamp(witnesses.reflectiveSourceCut);
  assert.deepEqual(progressiveCampGoals(state), { gardenNow: false, located: true, projectCompleteNow: false });
  assert.deepEqual(state.milestones, { firstGardenAt: 2, firstProjectAt: 6 });
  assert.equal(observeProgressiveCamp(state).status, 'playing');
});

test('progressive camp: post-success construction remains legal and creates fresh independent components', () => {
  let state = replayProgressiveCamp(witnesses.incremental);
  for (let i = 0; i < 12; i++) state = stepProgressiveCamp(state, join('solar-lamp', 'world:camp'));
  assert.equal(state.camp.installations.length, 14);
  assert.deepEqual(state.milestones, { firstGardenAt: 2, firstProjectAt: 5 });
  const cut = stepProgressiveCamp(state, join('reflective-cover', 'world:solar:2'));
  assert.equal(marsObjectsWorld(cut.camp).power[0].lampLit, false);
  assert.equal(marsObjectsWorld(cut.camp).power[1].lampLit, true);
});

test('progressive camp: all witness-prefix previews include truthful goals, milestones and unchanged base physics', () => {
  for (const [name, actions] of Object.entries(witnesses)) {
    let state = createProgressiveCamp(name === 'completePrefab' ? 'complete' : 'ordinary');
    for (const action of actions) {
      const before = structuredClone(state), view = observeProgressiveCamp(state);
      for (const entry of view.previews) {
        const next = stepProgressiveCamp(state, entry.action);
        assert.deepEqual(entry.world, marsObjectsWorld(next.camp));
        assert.deepEqual(entry.goals, progressiveCampGoals(next));
        assert.deepEqual(entry.milestones, next.milestones);
        assert.deepEqual(stepProgressiveCamp(state, { ...entry.action, a: entry.action.b, b: entry.action.a }), next);
        assert.equal(entry.status, next.milestones.firstProjectAt !== null && progressiveCampGoals(next).projectCompleteNow ? 'complete' : 'playing');
      }
      assert.deepEqual(state, before);
      state = stepProgressiveCamp(state, action);
    }
    assert.deepEqual(replayProgressiveCamp(actions, name === 'completePrefab' ? 'complete' : 'ordinary'), state);
  }
});

test('progressive camp: invalid and unknown actions neither reset the camp nor earn milestones', () => {
  const state = replayProgressiveCamp(witnesses.incremental.slice(0, 2));
  for (const action of [null, {}, [], { type: 'next' }, join('frame', 'clear-sheet'), join('lamp', 'world:lead:99'),
    { ...join('solar-panel', 'cable'), extra: true }]) {
    const before = structuredClone(state), next = stepProgressiveCamp(state, action);
    assert.equal(next.camp.accepted, false);
    assert.deepEqual(next.milestones, state.milestones);
    assert.deepEqual(next.camp.installations, state.camp.installations);
    assert.deepEqual(next.camp.known, state.camp.known);
    assert.equal(next.camp.combines, state.camp.combines);
    assert.deepEqual(state, before);
    assert.equal(previewProgressiveCamp(state, action).accepted, false);
  }
});

test('progressive camp: returned observations cannot mutate physical state or milestones', () => {
  const state = replayProgressiveCamp(witnesses.incremental);
  const before = structuredClone(state), view = observeProgressiveCamp(state);
  view.installations[0].shell!.layers.push('reflective');
  view.milestones.firstGardenAt = 99;
  view.world.observer.campLocated = false;
  view.previews[0].installations[0].shell!.layers.push('reflective');
  assert.deepEqual(state, before);
});

test('progressive camp: full prospective witness screen and analyst counterfactual match predictions', () => {
  const report = runProgressiveCampScreen();
  assert.equal(report.traces.length, 7);
  assert.ok(report.checkedPreviews > 100);
  assert.equal(report.traces.find(t => t.name === 'buildEverything')!.milestones.firstProjectAt, 10);
  assert.equal(report.currentStateCounterfactual.goalsWithoutEarlierShell.gardenNow, false);
  assert.equal(report.currentStateCounterfactual.goalsWithoutEarlierShell.located, true);
  assert.equal(report.sourceHashes.base, '4347c9f71ae6fe8b6d13f807b63a40bffea7adfc391521d18c3cccb782542f4c');
});

test('progressive camp CLI: append-only captures preserve observations, exact replay and early/session completion boundaries', () => {
  const cwd = mkdtempSync(pathJoin(tmpdir(), 'mars-progressive-test-'));
  const cli = fileURLToPath(new URL('../experiments/mars-progressive-camp-play.ts', import.meta.url));
  const run = (...args: string[]) => JSON.parse(execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' }));
  const fail = (...args: string[]) => assert.notEqual(spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' }).status, 0);
  const path = pathJoin(cwd, 'results/mars-progressive-camp-players/mechanical-test.jsonl');
  try {
    const metadata = JSON.stringify({ publicPrompt: 'Automated CLI integrity test, not a player assignment.', participant: { id: 'mechanical-test', kind: 'automated test' } });
    fail('init', 'missing-metadata', 'ordinary');
    run('init', 'mechanical-test', 'ordinary', metadata);
    const initialBytes = readFileSync(path, 'utf8');
    run('view', 'mechanical-test');
    run('preview', 'mechanical-test', JSON.stringify(witnesses.incremental[0]));
    for (const action of witnesses.incremental) run('act', 'mechanical-test', JSON.stringify(action));
    run('checkpoint', 'mechanical-test', '{"expected":"supplied test annotation"}');
    run('report', 'mechanical-test', '{"response":"supplied test report"}');
    assert.ok(readFileSync(path, 'utf8').startsWith(initialBytes));
    fail('init', 'mechanical-test', 'complete');
    fail('next', 'mechanical-test');
    fail('report', 'mechanical-test', '[]');
    run('finish', 'mechanical-test');
    const beforeVerify = readFileSync(path, 'utf8');
    assert.equal(run('verify', 'mechanical-test').verified, true);
    assert.equal(readFileSync(path, 'utf8'), beforeVerify);
    fail('act', 'mechanical-test', JSON.stringify(join('solar-lamp', 'world:camp')));
    fail('finish', 'mechanical-test');
    const events: CaptureEvent[] = readFileSync(path, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.equal(events[1].command, 'view');
    assert.equal(events[2].command, 'preview');
    assert.equal(events[2].beforeHash, events[2].afterHash);
    assert.equal(verifyProgressiveCapture(events).finished, true);
    assert.deepEqual(events.at(-1)!.state.milestones, { firstGardenAt: 2, firstProjectAt: 5 });
    const corrupted = structuredClone(events); corrupted[3].state.camp.combines = 99;
    assert.throws(() => verifyProgressiveCapture(corrupted), /integrity/);
    const resealed = structuredClone(events);
    resealed.at(-1)!.output = { finished: false };
    const { eventHash: _hash, ...unsigned } = resealed.at(-1)!;
    resealed.at(-1)!.eventHash = hashProgressiveRecord(unsigned);
    assert.throws(() => verifyProgressiveCapture(resealed), /Replay mismatch/);
    assert.throws(() => verifyProgressiveCapture(events, { ...progressiveSourceHashes(), wrapper: 'changed' }), /freeze mismatch/);
    run('init', 'early-stop', 'ordinary', metadata);
    const ended = run('finish', 'early-stop');
    assert.equal(ended.observation.status, 'playing');
    assert.equal(run('verify', 'early-stop').finished, true);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
