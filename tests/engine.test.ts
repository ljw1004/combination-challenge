import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BASE_CONCEPTS, CONCEPTS, RULES, SCENARIOS } from '../src/data.ts';
import type { ConceptId, Pulse } from '../src/data.ts';
import { actionError, availableRecipes, branch, cellAt, createState, horizon, legalActions, newRun, observe, preview, pulseAt, record, replay, stateHash, step } from '../src/engine.ts';
import type { Action, Run, State } from '../src/engine.ts';

function fixture(waves: Pulse[], rules = 'rooted'): State {
  const s = createState('headwaters', 1, rules);
  s.waves = structuredClone(waves); s.health = [100, 100];
  return s;
}
function object(s: State, row: number, col: number, concept: ConceptId, remaining: number | null = CONCEPTS[concept].capacity ?? null, age = 1): void {
  cellAt(s, { row, col })!.structure = { concept, remaining, age };
  if (!s.known.includes(concept)) s.known.push(concept);
}
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
function playRecorded(actions: Action[], scenario = 'headwaters', rules = 'breathing'): { state: State; run: Run } {
  let state = createState(scenario, 7, rules); let run = newRun(state, 'verification', 'unit-test');
  for (const action of actions) ({ state, run } = record(state, run, action));
  return { state, run };
}

test('seeded public forecasts reproduce exactly and preserve each bank’s total rainfall', () => {
  for (const scenario of SCENARIOS) {
    for (const seed of [0, 1, 12, 4294967295]) {
      const state = createState(scenario.id, seed);
      assert.deepEqual(state, createState(scenario.id, seed));
      for (let row = 0; row < 3; row++) assert.equal(state.waves.reduce((n, p) => n + p[row], 0), scenario.waves.reduce((n, p) => n + p[row], 0));
      assert.deepEqual(observe(state).forecast.map(x => x.pulse), state.waves);
    }
  }
  for (const seed of [-1, 1.5, 4294967296, NaN]) assert.throws(() => createState('headwaters', seed), /uint32/);
  assert.throws(() => createState('missing'), /scenario/);
  assert.throws(() => createState('headwaters', 1, 'missing'), /rules/);
});

test('all advertised legal actions execute, and every preview exactly predicts the complete transition', () => {
  for (const scenario of SCENARIOS) for (const rules of Object.keys(RULES)) {
    const s = createState(scenario.id, 3, rules);
    s.known = [...new Set([...s.known, 'clay', 'brick', 'reeds', 'grove', 'channel', 'basin', 'steam', 'glass', 'levee', 'pump'] as ConceptId[])];
    for (const action of legalActions(s)) {
      assert.equal(actionError(s, action), null);
      assert.deepEqual(preview(s, action), step(s, action));
    }
  }
});

test('transition and preview preserve frozen input states and actions', () => {
  const state = frozen(createState('headwaters', 2));
  const action: Action = frozen({ type: 'discover', recipe: 'grow-reeds', at: { row: 0, col: 0 } });
  const before = JSON.stringify(state); const aBefore = JSON.stringify(action);
  step(state, action); preview(state, action); observe(state);
  assert.equal(JSON.stringify(state), before); assert.equal(JSON.stringify(action), aBefore);
});

test('legal actions exclude bedrock, unknown deployments, ingredient placement, and repeated outputs', () => {
  const s = createState('confluence', 1);
  assert.match(actionError(s, { type: 'deploy', concept: 'soil', at: { row: 1, col: 1 } })!, /Bedrock/);
  assert.match(actionError(s, { type: 'deploy', concept: 'pump', at: { row: 0, col: 0 } })!, /established/);
  assert.match(actionError(s, { type: 'deploy', concept: 'water', at: { row: 0, col: 0 } })!, /ingredient/);
  assert.match(actionError(s, { type: 'deploy', concept: 'soil', at: { row: -1, col: 0 } })!, /Bedrock/);
  assert.match(actionError(s, { type: 'deploy', concept: 'soil', at: { row: 0, col: 0.5 } })!, /bank/);
  assert.match(actionError(s, null as unknown as Action)!, /Invalid/);
  assert.match(actionError(s, { type: 'surprise' } as unknown as Action)!, /Unknown/);
  s.known.push('brick');
  assert.equal(availableRecipes(s).filter(r => r.output === 'channel').length, 2);
  const learned = step(s, { type: 'discover', recipe: 'cut-channel' }).state;
  assert.equal(availableRecipes(learned).filter(r => r.output === 'channel').length, 0);
  assert.match(actionError(learned, { type: 'discover', recipe: 'brick-channel' })!, /available/);
});

test('discovery permanently expands concept access, keeps ingredients, and permits immediate placement only in its variant', () => {
  const base = fixture([[2, 0, 0], [2, 0, 0]], 'separate');
  const before = [...base.known];
  assert.match(actionError(base, { type: 'discover', recipe: 'grow-reeds', at: { row: 0, col: 0 } })!, /separates/);
  const learned = step(base, { type: 'discover', recipe: 'grow-reeds' });
  assert.deepEqual(learned.damage, [2, 0]);
  assert.deepEqual(learned.state.known, [...before, 'reeds']);
  assert.equal(cellAt(learned.state, { row: 0, col: 0 })!.structure, null);
  const placed = step(learned.state, { type: 'deploy', concept: 'reeds', at: { row: 0, col: 0 } });
  assert.deepEqual(placed.damage, [1, 0]);
  const field = step(fixture([[2, 0, 0]], 'field'), { type: 'discover', recipe: 'grow-reeds', at: { row: 0, col: 0 } });
  assert.deepEqual(field.damage, [1, 0]);
  assert.ok(BASE_CONCEPTS.every(id => field.state.known.includes(id)));
  assert.ok(field.state.known.includes('reeds'));
});

test('a consumed bank can be redeployed directly without reconstructing its ingredient chain', () => {
  const s = fixture([[3, 0, 0], [3, 0, 0]]); s.known.push('clay');
  const first = step(s, { type: 'deploy', concept: 'clay', at: { row: 0, col: 0 } });
  assert.deepEqual(first.damage, [0, 0]);
  assert.equal(cellAt(first.state, { row: 0, col: 0 })!.structure, null);
  assert.ok(first.state.known.includes('clay'));
  const replace = { type: 'deploy', concept: 'clay', at: { row: 0, col: 0 } } as const;
  assert.equal(actionError(first.state, replace), null);
  assert.deepEqual(step(first.state, replace).damage, [0, 0]);
  assert.equal(availableRecipes(first.state).some(r => r.output === 'clay'), false);
});

test('a channel saves the upper asset while adding exactly its diverted water to the lower asset', () => {
  const s = fixture([[3, 1, 0]]); object(s, 0, 1, 'channel');
  const result = step(s, { type: 'wait' });
  assert.deepEqual(result.damage, [1, 3]);
  assert.deepEqual(result.flow.find(c => c.row === 0 && c.col === 1), { row: 0, col: 1, incoming: 3, absorbed: 0, diverted: 2, outgoing: 1, stored: 0 });
  assert.equal(result.flow.find(c => c.row === 1 && c.col === 1)!.incoming, 3);
});

test('water joins the lower lane at the diversion column and cannot run backward through an earlier defence', () => {
  const late = fixture([[2, 0, 0]]); object(late, 0, 1, 'channel'); object(late, 1, 0, 'soil');
  const lateResult = step(late, { type: 'wait' });
  assert.deepEqual(lateResult.damage, [0, 2]);
  assert.equal(cellAt(lateResult.state, { row: 1, col: 0 })!.structure!.remaining, 2);
  const early = fixture([[2, 0, 0]]); object(early, 0, 0, 'channel'); object(early, 1, 0, 'soil');
  const earlyResult = step(early, { type: 'wait' });
  assert.deepEqual(earlyResult.damage, [0, 0]);
  assert.equal(cellAt(earlyResult.state, { row: 1, col: 0 })!.structure, null);
});

test('a vertical chain routes water through both lower lanes to the sea in the same pulse', () => {
  const s = fixture([[3, 0, 0]]);
  for (let row = 0; row < 3; row++) object(s, row, 0, 'channel');
  const result = step(s, { type: 'wait' });
  assert.deepEqual(result.damage, [1, 0]);
  for (let row = 0; row < 3; row++) assert.equal(result.flow.find(c => c.row === row && c.col === 0)!.diverted, 2);
  assert.equal(result.flow.find(c => c.row === 2 && c.col === 2)!.outgoing, 0);
});

test('a pump drains locally without transferring its flow to another protected asset', () => {
  const s = fixture([[3, 1, 0]]); object(s, 0, 0, 'pump');
  const result = step(s, { type: 'wait' });
  assert.deepEqual(result.damage, [1, 1]);
  assert.equal(result.flow.find(c => c.row === 1 && c.col === 0)!.incoming, 1);
});

test('groves require a growth pulse before absorption and mature groves can be overwhelmed', () => {
  const s = fixture([[2, 0, 0], [2, 0, 0], [5, 0, 0]]); s.known.push('grove');
  const planted = step(s, { type: 'deploy', concept: 'grove', at: { row: 0, col: 0 } });
  assert.deepEqual(planted.damage, [2, 0]);
  assert.ok(planted.events.some(e => e.kind === 'growth'));
  const grown = step(planted.state, { type: 'wait' });
  assert.deepEqual(grown.damage, [0, 0]);
  const surge = step(grown.state, { type: 'wait' });
  assert.deepEqual(surge.damage, [3, 0]);
  assert.equal(cellAt(surge.state, { row: 0, col: 0 })!.structure, null);
  assert.ok(surge.state.known.includes('grove'));
});

test('preparation turns permit a grove to mature but do not advance the advertised storm', () => {
  const s = fixture([[2, 0, 0]], 'breathing');
  const planted = step(s, { type: 'discover', recipe: 'grow-grove', at: { row: 0, col: 0 } });
  assert.deepEqual(planted.damage, [0, 0]);
  assert.deepEqual(pulseAt(planted.state), [0, 0, 0]);
  const prepared = step(planted.state, { type: 'wait' });
  assert.deepEqual(pulseAt(prepared.state), [2, 0, 0]);
  assert.deepEqual(step(prepared.state, { type: 'wait' }).damage, [0, 0]);
});

test('rooted reeds remove recurring maintenance while the baseline exhausts after two absorbed units', () => {
  for (const rooted of [false, true]) {
    let s = fixture([[1, 0, 0], [1, 0, 0], [1, 0, 0]], rooted ? 'rooted' : 'field');
    s.known.push('reeds');
    s = step(s, { type: 'deploy', concept: 'reeds', at: { row: 0, col: 0 } }).state;
    s = step(s, { type: 'wait' }).state;
    assert.equal(cellAt(s, { row: 0, col: 0 })!.structure !== null, rooted);
    const third = step(s, { type: 'wait' });
    assert.deepEqual(third.damage, rooted ? [0, 0] : [1, 0]);
    assert.ok(third.state.known.includes('reeds'));
  }
});

test('overwhelmed reeds and levees perform their final intervention before destruction', () => {
  const reeds = fixture([[4, 0, 0]]); object(reeds, 0, 0, 'reeds');
  const r = step(reeds, { type: 'wait' });
  assert.deepEqual(r.damage, [3, 0]);
  assert.equal(cellAt(r.state, { row: 0, col: 0 })!.structure, null);
  const levee = fixture([[5, 0, 0]]); object(levee, 0, 0, 'levee');
  const l = step(levee, { type: 'wait' });
  assert.deepEqual(l.damage, [2, 3]);
  assert.equal(cellAt(l.state, { row: 0, col: 0 })!.structure, null);
});

test('a full basin stays in place, passes excess water, and keeps captured water safe at the endpoint', () => {
  const s = fixture([[3, 0, 0], [2, 0, 0]]); object(s, 0, 0, 'basin', 4);
  const first = step(s, { type: 'wait' });
  assert.deepEqual(first.damage, [0, 0]); assert.equal(cellAt(first.state, { row: 0, col: 0 })!.structure!.remaining, 1);
  const full = step(first.state, { type: 'wait' });
  assert.deepEqual(full.damage, [1, 0]); assert.equal(cellAt(full.state, { row: 0, col: 0 })!.structure!.remaining, 0);
  assert.equal(full.state.status, 'won');
});

test('heat empties stored water first, uses its remaining power on the pulse, and preserves the basin', () => {
  const s = fixture([[3, 0, 0]]); object(s, 0, 0, 'basin', 3);
  const r = step(s, { type: 'deploy', concept: 'heat', at: { row: 0, col: 0 } });
  assert.deepEqual(r.damage, [0, 0]);
  const flow = r.flow.find(c => c.row === 0 && c.col === 0)!;
  assert.equal(flow.absorbed, 1); assert.equal(flow.stored, 2);
  assert.equal(cellAt(r.state, { row: 0, col: 0 })!.structure!.concept, 'basin');
  assert.equal(cellAt(r.state, { row: 0, col: 0 })!.structure!.remaining, 2);
  assert.ok(r.events.some(e => e.kind === 'storage' && e.text.includes('emptied 1')));
});

test('a new construction replaces an old one but heat acts alongside a construction', () => {
  const s = fixture([[0, 0, 0], [0, 0, 0]]); object(s, 0, 0, 'reeds');
  const heated = step(s, { type: 'deploy', concept: 'heat', at: { row: 0, col: 0 } });
  assert.equal(cellAt(heated.state, { row: 0, col: 0 })!.structure!.concept, 'reeds');
  const replaced = step(heated.state, { type: 'deploy', concept: 'soil', at: { row: 0, col: 0 } });
  assert.equal(cellAt(replaced.state, { row: 0, col: 0 })!.structure!.concept, 'soil');
  assert.ok(replaced.state.known.includes('reeds'));
});

test('each encounter ends at its finite horizon, including preparation, and rejects later actions', () => {
  for (const rules of Object.keys(RULES)) {
    let s = fixture([[0, 0, 0], [0, 0, 0]], rules); const limit = horizon(s);
    for (let turn = 0; turn < limit; turn++) { assert.equal(s.status, 'playing'); s = step(s, { type: 'wait' }).state; }
    assert.equal(s.turn, limit); assert.equal(s.status, 'won'); assert.deepEqual(legalActions(s), []);
    assert.throws(() => step(s, { type: 'wait' }), /ended/);
  }
  const doomed = fixture([[2, 0, 0], [0, 0, 0]]); doomed.health = [1, 1];
  assert.equal(step(doomed, { type: 'wait' }).state.status, 'lost');
});

test('recorded offers, actions, world responses, and state hashes replay exactly without mutating the source run', () => {
  const actions: Action[] = [{ type: 'discover', recipe: 'cut-channel', at: { row: 0, col: 0 } }, { type: 'deploy', concept: 'channel', at: { row: 1, col: 0 } }, { type: 'wait' }];
  const { state, run } = playRecorded(actions); const snapshot = JSON.stringify(run);
  assert.deepEqual(replay(run), state); assert.equal(run.decisions.length, 3);
  assert.equal(run.decisions[0].turn, 0); assert.deepEqual(run.decisions.map(d => d.action), actions);
  assert.equal(run.decisions[2].after, stateHash(state)); assert.equal(JSON.stringify(run), snapshot);
  const empty = newRun(createState()); const initialLength = empty.decisions.length;
  record(createState(), empty, { type: 'wait' }); assert.equal(empty.decisions.length, initialLength);
});

test('replay rejects changed turn/outcome metadata, hashes, offers, actions, responses, and incompatible versions', () => {
  const { run } = playRecorded([{ type: 'discover', recipe: 'grow-reeds', at: { row: 0, col: 0 } }, { type: 'wait' }, { type: 'wait' }]);
  const corruptions: ((copy: Run) => void)[] = [
    c => { c.build = 'other'; }, c => { c.data = 'other'; },
    c => { c.decisions[0].turn = 99; }, c => { c.outcome = 'won'; },
    c => { c.decisions[0].before = '00000000'; }, c => { c.decisions[0].after = '00000000'; },
    c => { c.decisions[0].offers = []; }, c => { c.decisions[0].action = { type: 'wait' }; },
    c => { c.decisions[2].damage = [99, 99]; }, c => { c.decisions[0].events[0].text = 'invented event'; },
  ];
  for (const corrupt of corruptions) { const copy = structuredClone(run); corrupt(copy); assert.throws(() => replay(copy)); }
});

test('branching restores the selected decision, supports a different legal continuation, and preserves the original replay', () => {
  const original = playRecorded([{ type: 'discover', recipe: 'cut-channel', at: { row: 0, col: 0 } }, { type: 'deploy', concept: 'channel', at: { row: 1, col: 0 } }, { type: 'wait' }]);
  const snapshot = JSON.stringify(original.run); const fork = branch(original.run, 1);
  assert.equal(fork.state.turn, 1); assert.equal(fork.run.decisions.length, 1);
  assert.equal(cellAt(fork.state, { row: 1, col: 0 })!.structure, null);
  assert.deepEqual(fork.state, replay(original.run, 1));
  const continued = record(fork.state, fork.run, { type: 'deploy', concept: 'channel', at: { row: 0, col: 2 } });
  assert.deepEqual(replay(continued.run), continued.state);
  assert.notEqual(stateHash(continued.state), stateHash(replay(original.run, 2)));
  assert.equal(JSON.stringify(original.run), snapshot); assert.deepEqual(replay(original.run), original.state);
  for (const point of [-1, 0.5, 4]) assert.throws(() => branch(original.run, point), /branch/);
});
