import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMarsObjects, legalMarsObjectsActions, marsObjectsWitnesses, marsObjectsWorld,
  observeMarsObjects, previewMarsObjects, replayMarsObjects, runMarsObjectsScreen, stepMarsObjects,
} from '../experiments/logical-mars-objects.ts';
import type { Action, State } from '../experiments/logical-mars-objects.ts';

const join = (a: string, b: string): Action => ({ type: 'combine', a, b });
const physical = (state: State) => ({ known: state.known, installations: state.installations,
  combines: state.combines, observer: state.observer, status: state.status });
const witnesses = marsObjectsWitnesses();

test('Mars: same laws, different actual goal conditions; both simplest shells are viable for their own goal', () => {
  const garden = replayMarsObjects(witnesses.daylightGarden, 'garden');
  const sameAsSignal = replayMarsObjects(witnesses.daylightGarden, 'signal');
  assert.equal(garden.status, 'won');
  assert.equal(sameAsSignal.status, 'playing');
  assert.deepEqual(marsObjectsWorld(garden), marsObjectsWorld(sameAsSignal));
  const reflector = replayMarsObjects(witnesses.reflectedSignal, 'signal');
  assert.equal(reflector.status, 'won');
  assert.equal(replayMarsObjects(witnesses.reflectedSignal, 'garden').status, 'playing');
  assert.equal(marsObjectsWorld(reflector).camp.enclosed, true);
  assert.equal(marsObjectsWorld(reflector).camp.illuminated, false);
  assert.deepEqual(marsObjectsWorld(reflector).observer.received.map(r => r.source), ['sun']);
});

test('Mars: powered opaque garden and bare lamp signal are real alternatives', () => {
  const garden = replayMarsObjects(witnesses.poweredGarden, 'garden');
  assert.equal(garden.status, 'won');
  assert.deepEqual(marsObjectsWorld(garden).camp.interiorSources, ['lamp:1']);
  assert.deepEqual(garden.installations[0].power, { panel: true, cable: true, lamp: true, sourceLayers: [] });
  assert.equal(garden.installations[0].shell?.frame, true);
  const signal = replayMarsObjects(witnesses.lampSignal, 'signal');
  assert.equal(signal.status, 'won');
  assert.equal(marsObjectsWorld(signal).camp.enclosed, false);
  assert.deepEqual(marsObjectsWorld(signal).observer.received.map(r => r.source), ['lamp:1']);
});

test('Mars: universal lit clear enclosure and build-everything legitimately solve both', () => {
  for (const scenario of ['garden', 'signal'] as const) {
    assert.equal(replayMarsObjects(witnesses.universal, scenario).status, 'won');
    assert.equal(witnesses.universal.length, 5);
    assert.equal(replayMarsObjects(witnesses.buildEverything, scenario).status, 'won');
    assert.equal(witnesses.buildEverything.length, 12);
  }
});

test('Mars: repurposing same shell shades tray and signals, then a retained exterior source restores light', () => {
  const initial = replayMarsObjects(witnesses.daylightGarden);
  const covered = stepMarsObjects(initial, join('reflective-cover', 'world:shell:1'));
  assert.equal(initial.status, 'won');
  assert.equal(covered.status, 'playing');
  assert.deepEqual(covered.installations[0].shell?.layers, ['clear', 'reflective']);
  assert.equal(covered.installations[0].builtFrom, 'clear-shell'); // name cannot override actual layers
  assert.equal(marsObjectsWorld(covered).observer.receiving, true);
  assert.equal(covered.observer.campLocated, true);
  const repaired = replayMarsObjects(witnesses.repurpose);
  assert.equal(repaired.status, 'won');
  assert.deepEqual(marsObjectsWorld(repaired).camp.interiorSources, ['lamp:2']);
});

test('Mars: shading actual powered-garden panel breaks illumination, not enclosure or concept access', () => {
  const state = replayMarsObjects(witnesses.poweredGarden);
  const cut = stepMarsObjects(state, join('reflective-cover', 'world:solar:1'));
  assert.equal(cut.accepted, true);
  assert.equal(cut.status, 'playing');
  assert.equal(marsObjectsWorld(cut).camp.enclosed, true);
  assert.equal(marsObjectsWorld(cut).camp.illuminated, false);
  assert.equal(marsObjectsWorld(cut).power[0].lampLit, false);
  assert.deepEqual(cut.known, state.known);
});

test('Mars: source cutoff stops current signal but does not erase acquired information', () => {
  const state = replayMarsObjects(witnesses.lampSignal, 'signal');
  const cut = stepMarsObjects(state, join('reflective-cover', 'world:solar:1'));
  assert.equal(marsObjectsWorld(cut).observer.receiving, false);
  assert.equal(cut.observer.campLocated, true);
  assert.deepEqual(cut.observer.firstReception, state.observer.firstReception);
  assert.equal(cut.status, 'won');
});

test('Mars: shaded lead before lamp attachment cannot generate a signal merely by acquiring its name', () => {
  const actions = [join('solar-panel', 'cable'), join('solar-lead', 'world:camp'),
    join('reflective-cover', 'world:solar:1'), join('lamp', 'world:lead:1')];
  const state = replayMarsObjects(actions, 'signal');
  assert.equal(state.accepted, true);
  assert.ok(state.known.includes('solar-lamp'));
  assert.equal(state.installations[0].power?.lamp, true);
  assert.equal(marsObjectsWorld(state).power[0].lampLit, false);
  assert.equal(state.observer.campLocated, false);
  assert.equal(state.status, 'playing');
});

test('Mars: duplicate installations are unlimited independent sources, not a hidden attachment quota', () => {
  let state = replayMarsObjects(witnesses.lampSignal, 'signal');
  for (let i = 0; i < 20; i++) state = stepMarsObjects(state, join('solar-lamp', 'world:camp'));
  assert.equal(state.installations.length, 21);
  const shaded = stepMarsObjects(state, join('reflective-cover', 'world:solar:1'));
  assert.equal(marsObjectsWorld(shaded).power[0].lampLit, false);
  assert.equal(marsObjectsWorld(shaded).power[1].lampLit, true);
  assert.equal(marsObjectsWorld(shaded).observer.receiving, true);
  assert.equal(shaded.known.filter(c => c === 'solar-lamp').length, 1);
});

test('Mars: transparent source layers transmit but do not undo an opaque layer; identical layering is idempotent', () => {
  let state = replayMarsObjects(witnesses.lampSignal);
  state = stepMarsObjects(state, join('clear-sheet', 'world:solar:1'));
  assert.equal(marsObjectsWorld(state).power[0].lampLit, true);
  state = stepMarsObjects(state, join('reflective-cover', 'world:solar:1'));
  assert.equal(marsObjectsWorld(state).power[0].lampLit, false);
  const repeat = stepMarsObjects(state, join('clear-sheet', 'world:solar:1'));
  assert.equal(repeat.accepted, false);
  assert.deepEqual(physical(repeat), physical(state));
  const reverseLayers = replayMarsObjects([...witnesses.lampSignal,
    join('reflective-cover', 'world:solar:1'), join('clear-sheet', 'world:solar:1')]);
  assert.equal(marsObjectsWorld(reverseLayers).power[0].lampLit, false);
});

test('Mars: every public preview matches commitment and leaves input unchanged, including reversed operands', () => {
  for (const actions of Object.values(witnesses)) {
    let state = createMarsObjects();
    for (const action of actions) {
      const before = JSON.stringify(state);
      for (const legal of legalMarsObjectsActions(state)) {
        const preview = previewMarsObjects(state, legal), next = stepMarsObjects(state, legal);
        const reverse = stepMarsObjects(state, { ...legal, a: legal.b, b: legal.a });
        assert.deepEqual(next, reverse);
        assert.equal(preview.accepted, true);
        assert.deepEqual(preview.world, marsObjectsWorld(next));
        assert.deepEqual(preview.installations, next.installations);
        assert.equal(preview.status, next.status);
      }
      assert.equal(JSON.stringify(state), before);
      state = stepMarsObjects(state, action);
    }
  }
});

test('Mars: malformed, unknown, repeated and wrong-target actions are non-mutating rejections', () => {
  const state = replayMarsObjects(witnesses.daylightGarden);
  for (const action of [null, undefined, [], 1, {}, { type: 'finish' },
    { type: 'combine', a: 'frame', b: 'lamp', at: 'north' },
    join('frame', 'unknown'), join('lit-clear-shell', 'world:camp'), join('frame', 'clear-sheet'),
    join('lamp', 'world:lead:1'), join('reflective-cover', 'world:solar:99'), join('lamp', 'world:camp')]) {
    const snapshot = JSON.stringify(state), next = stepMarsObjects(state, action);
    assert.equal(next.accepted, false);
    assert.deepEqual(physical(next), physical(state));
    assert.equal(JSON.stringify(state), snapshot);
  }
  assert.throws(() => createMarsObjects('bogus'));
});

test('Mars: ordinary, complete and knowledge carryover change access, not physics; whole assembly retains components', () => {
  const ordinary = replayMarsObjects(witnesses.universal);
  const complete = replayMarsObjects([join('lit-clear-shell', 'world:camp')], 'garden', { catalogue: 'complete' });
  assert.deepEqual(ordinary.installations, complete.installations);
  assert.deepEqual(marsObjectsWorld(ordinary).camp, marsObjectsWorld(complete).camp);
  assert.deepEqual(marsObjectsWorld(ordinary).power, marsObjectsWorld(complete).power);
  assert.equal(complete.combines, 1);
  const carried = createMarsObjects('signal', { known: ordinary.known });
  assert.equal(carried.installations.length, 0);
  assert.equal(carried.observer.campLocated, false);
  assert.equal(stepMarsObjects(carried, join('lit-clear-shell', 'world:camp')).status, 'won');
  const initial = createMarsObjects();
  const view = observeMarsObjects(initial);
  assert.equal(view.allConcepts.length, 12);
  assert.equal(view.recipes.length, 6);
  assert.ok(view.recipes.some(r => r.result === 'lit-reflective-shell'));
  view.known.push('solar-lamp');
  assert.equal(initial.known.includes('solar-lamp'), false);
});

test('Mars: saved deterministic screen has exact replays and goal-sensitive outcomes without concealing universal answers', () => {
  const report = runMarsObjectsScreen();
  assert.equal(report.traces.length, 14);
  assert.ok(report.checkedPreviews > 300);
  for (const trace of report.traces) {
    assert.equal(trace.exactReplay, true);
    assert.deepEqual(replayMarsObjects(trace.actions, trace.scenario), trace.frames.at(-1)!.state);
  }
  assert.equal(report.traces.find(t => t.scenario === 'garden' && t.name === 'buildEverything')!.firstSuccess, 7);
  assert.equal(report.traces.find(t => t.scenario === 'signal' && t.name === 'buildEverything')!.firstSuccess, 8);
});
