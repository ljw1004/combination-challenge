/** Mechanical verification, separate from experience evaluation.
 * Run `npm run verify`; add `-- --all-rules` for 144 full solver witnesses.
 * The planner is privileged and a found witness proves reachability only.
 */
import assert from 'node:assert/strict';
import { BUILD_VERSION, DATA_VERSION, DEFAULT_RULES, RULES, SCENARIOS } from '../src/data.ts';
import { actionError, createState, horizon, legalActions, newRun, preview, record, replay, stateHash, step } from '../src/engine.ts';
import type { Action, State, Transition } from '../src/engine.ts';
import { chooseAction } from './policies.ts';

let checkedTransitions = 0;
function invariants(before: State, action: Action, result: Transition): void {
  assert.equal(actionError(before, action), null);
  assert.equal(result.state.turn, before.turn + 1);
  assert.equal(result.flow.length, 9);
  assert.equal(new Set(result.state.known).size, result.state.known.length);
  assert.ok(before.known.every(id => result.state.known.includes(id)), 'known capability was lost');
  assert.ok(result.state.turn <= horizon(result.state), 'resolution exceeded its finite horizon');
  assert.deepEqual(result.state.health, before.health.map((health, row) => health - result.damage[row]));
  for (const flow of result.flow) {
    for (const value of [flow.incoming, flow.absorbed, flow.diverted, flow.stored, flow.outgoing]) assert.ok(Number.isInteger(value) && value >= 0, 'negative or fractional water');
    assert.equal(flow.incoming, flow.absorbed + flow.diverted + flow.stored + flow.outgoing, 'water disappeared inside a cell');
  }
  for (const cell of result.state.cells) {
    assert.ok(!cell.blocked || cell.structure === null, 'construction occupied bedrock');
    if (cell.structure) { assert.ok(cell.structure.remaining === null || cell.structure.remaining >= 0); assert.ok(cell.structure.age >= 0); }
  }
  checkedTransitions++;
}

const exhaustive: { scenario: string; rules: string; firstActions: number; secondActions: number; distinctAfterTwo: number }[] = [];
// Every legal opening and every legal reply, for seed 1 of each scenario/rules
// pair. This is an exhaustive shallow check, not exhaustive game reachability.
for (const scenario of SCENARIOS) for (const rules of Object.keys(RULES)) {
  const initial = createState(scenario.id, 1, rules); const first = legalActions(initial);
  const initialHash = stateHash(initial); let secondCount = 0; const distinct = new Set<string>();
  for (const action of first) {
    const firstResult = step(initial, action); invariants(initial, action, firstResult);
    assert.deepEqual(preview(initial, action), firstResult);
    for (const reply of legalActions(firstResult.state)) {
      const replyResult = step(firstResult.state, reply); invariants(firstResult.state, reply, replyResult);
      secondCount++; distinct.add(stateHash(replyResult.state));
    }
  }
  assert.equal(stateHash(initial), initialHash, 'opening enumeration mutated initial state');
  exhaustive.push({ scenario: scenario.id, rules, firstActions: first.length, secondActions: secondCount, distinctAfterTwo: distinct.size });
}

const allRules = process.argv.includes('--all-rules');
const seeds = Array.from({ length: 12 }, (_, i) => i + 1);
const witnesses: { scenario: string; rules: string; seed: number; status: State['status']; health: [number, number]; turns: number; discoveries: number; finalHash: string; actions: Action[] }[] = [];
for (const scenario of SCENARIOS) for (const rules of Object.keys(RULES)) {
  // Default: full matched seed set for the shipped rules, one diagnostic seed
  // for each historical rules version. --all-rules expands every variant.
  const selectedSeeds = rules === DEFAULT_RULES || allRules ? seeds : [1];
  for (const seed of selectedSeeds) {
    let state = createState(scenario.id, seed, rules); let run = newRun(state, 'privileged-planner', 'mechanical-reachability-witness');
    const startKnown = state.known.length; const actions: Action[] = [];
    while (state.status === 'playing') {
      assert.ok(actions.length < horizon(state), 'solver did not resolve within the horizon');
      const action = chooseAction(state, 'planner', seed);
      const result = record(state, run, action); invariants(state, action, result.transition);
      assert.deepEqual(preview(state, action), result.transition);
      actions.push(action); state = result.state; run = result.run;
    }
    assert.deepEqual(replay(run), state, 'witness replay differs');
    witnesses.push({ scenario: scenario.id, rules, seed, status: state.status, health: state.health, turns: state.turn, discoveries: state.known.length - startKnown, finalHash: stateHash(state), actions });
  }
}
const shipped = witnesses.filter(w => w.rules === DEFAULT_RULES);
const unresolved = witnesses.filter(w => w.status !== 'won');
const report = {
  build: BUILD_VERSION, data: DATA_VERSION,
  condition: 'Mechanical verification. Planner has the complete transition model. A winning trace is a reachability witness; a planner loss does not prove unreachability. No enjoyment conclusion.',
  shallowScope: 'Every legal two-action sequence from seed 1 of all three scenarios and four historical rules versions.',
  checkedTransitions, exhaustive,
  witnessScope: allRules ? 'All four rules versions, all scenarios, seeds 1–12.' : 'Shipped rules: all scenarios, seeds 1–12. Historical rules: each scenario at seed 1.',
  shippedWitnesses: { wins: shipped.filter(w => w.status === 'won').length, n: shipped.length },
  unresolvedWitnessSearches: unresolved.map(({ scenario, rules, seed }) => ({ scenario, rules, seed })),
  witnesses,
  limitations: ['Two-turn enumeration cannot prove absence of deeper transition bugs.', 'Witnesses cover a finite seed set, not every uint32 seed.', 'Historical solver losses are unresolved searches, not evidence of unavoidable losses.', 'This validates rules and replay; human readability and enjoyment need separate evidence.'],
};
console.log(JSON.stringify(report, null, 2));
assert.equal(shipped.length, 36);
assert.ok(shipped.every(w => w.status === 'won'), 'No winning witness found for one or more shipped scenario/seed pairs; inspect report.');
