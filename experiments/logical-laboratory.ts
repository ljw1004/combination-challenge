import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** A headless experiment-design candidate. Importing this module does no work. */
export const LAB_VERSION = "logical-laboratory-1";
export const LAB_SCENARIO_IDS = ["pair-gates", "relays", "opposed-gates", "one-sided"] as const;
export type LaboratoryScenarioId = typeof LAB_SCENARIO_IDS[number];
export type LaboratoryCondition = "A" | "B" | "AB";
type Bit = 0 | 1;
type Predictions = readonly [Bit, Bit, Bit];
export type LaboratoryAction = { type: "combine"; a: string; b: string };
export type Action = LaboratoryAction;
type Mechanism = { id: string; rule: string; predictions: Predictions };
type Scenario = { id: LaboratoryScenarioId; title: string; description: string; mechanisms: readonly Mechanism[] };
const SCENARIOS: readonly Scenario[] = [
  { id: "pair-gates", title: "Both, either, or disagreement?",
    description: "A fictional device may require both signals, either signal, or exactly one signal.",
    mechanisms: [
      { id: "AND", rule: "1 exactly when A and B are both active", predictions: [0, 0, 1] },
      { id: "OR", rule: "1 when at least one of A and B is active", predictions: [1, 1, 1] },
      { id: "XOR", rule: "1 exactly when one of A and B is active", predictions: [1, 1, 0] },
    ] },
  { id: "relays", title: "A relay or an interaction?",
    description: "The same contacts now face different possible mechanisms: A alone controls it, B alone controls it, or their disagreement controls it.",
    mechanisms: [
      { id: "relay-A", rule: "Output follows A; B has no effect", predictions: [1, 0, 1] },
      { id: "relay-B", rule: "Output follows B; A has no effect", predictions: [0, 1, 1] },
      { id: "XOR", rule: "1 exactly when one of A and B is active", predictions: [1, 1, 0] },
    ] },
  { id: "opposed-gates", title: "The quiet response matters",
    description: "A complementary version of the first family. This is a response-reading variation, not a new inference structure.",
    mechanisms: [
      { id: "NAND", rule: "0 exactly when A and B are both active", predictions: [1, 1, 0] },
      { id: "NOR", rule: "1 exactly when neither A nor B is active", predictions: [0, 0, 0] },
      { id: "XNOR", rule: "1 exactly when A and B have equal activation", predictions: [0, 0, 1] },
    ] },
  { id: "one-sided", title: "An exclusive route or a joint route?",
    description: "Possible mechanisms distinguish A alone, B alone, and the joint condition. Two negative observations can establish the joint explanation without performing that final probe.",
    mechanisms: [
      { id: "A-without-B", rule: "1 exactly when A is active and B is inactive", predictions: [1, 0, 0] },
      { id: "B-without-A", rule: "1 exactly when B is active and A is inactive", predictions: [0, 1, 0] },
      { id: "AND", rule: "1 exactly when A and B are both active", predictions: [0, 0, 1] },
    ] },
];
const CONDITIONS: readonly LaboratoryCondition[] = ["A", "B", "AB"];
const PAIRS = [
  { a: "A", b: "B", child: "AB", condition: undefined },
  { a: "probe", b: "A", child: "observation:A", condition: "A" },
  { a: "probe", b: "B", child: "observation:B", condition: "B" },
  { a: "probe", b: "AB", child: "observation:AB", condition: "AB" },
] as const;
export type LaboratoryState = {
  version: typeof LAB_VERSION;
  scenarioId: LaboratoryScenarioId;
  /** Private world state. Adapters must expose observeLaboratory(), not this object. */
  mechanismId: string;
  concepts: string[];
  observations: Partial<Record<LaboratoryCondition, Bit>>;
  completedPairs: string[];
  combinations: number;
  status: "playing" | "won";
  feedback: { kind: "start" | "created" | "observed" | "unchanged" | "invalid"; message: string };
};
export type State = LaboratoryState;
const pairKey = (a: string, b: string): string => [a, b].sort().join("+");
function scenario(id: string): Scenario {
  const found = SCENARIOS.find(s => s.id === id);
  if (!found) throw new Error(`Unknown laboratory scenario: ${id}`);
  return found;
}
function predicts(mechanism: Mechanism, condition: LaboratoryCondition): Bit {
  return mechanism.predictions[CONDITIONS.indexOf(condition)]!;
}
function remaining(state: LaboratoryState): Mechanism[] {
  return scenario(state.scenarioId).mechanisms.filter(m => CONDITIONS.every(condition =>
    state.observations[condition] === undefined || predicts(m, condition) === state.observations[condition]));
}
export function createLaboratory(id: string = LAB_SCENARIO_IDS[0], seed = 0): LaboratoryState {
  const spec = scenario(id);
  const index = ((Math.trunc(seed) % spec.mechanisms.length) + spec.mechanisms.length) % spec.mechanisms.length;
  return { version: LAB_VERSION, scenarioId: spec.id, mechanismId: spec.mechanisms[index]!.id,
    concepts: ["probe", "A", "B"], observations: {}, completedPairs: [], combinations: 0, status: "playing",
    feedback: { kind: "start", message: "Make an observation that separates explanations. Every contact and every candidate forecast is public." } };
}
export function observeLaboratory(state: LaboratoryState) {
  const spec = scenario(state.scenarioId);
  const candidates = remaining(state);
  const legal = PAIRS.filter(p => state.concepts.includes(p.a) && state.concepts.includes(p.b) &&
    !state.completedPairs.includes(pairKey(p.a, p.b)));
  return {
    version: LAB_VERSION, scenarioId: spec.id, title: spec.title, description: spec.description,
    goal: "Produce observations that leave exactly one public mechanism consistent with the evidence. No mechanism-name guessing action is needed.",
    rules: [
      "All recipes are listed. Parents remain after combining; each child occurs at most once.",
      "A means A active and B inactive. B means B active and A inactive. AB means both active simultaneously.",
      "Each probe measures one condition in a fresh identical test of this fixed world. It returns one bit, not the full truth table.",
      "The hidden fact is which listed mechanism governs this world. Recipe legality is never hidden.",
      "Completed pairs add no new observation and receive no further invitation.",
      "There is no material depletion, action allowance, deadline, score or loss condition. A redundant observation is recoverable.",
    ],
    actionSchema: { type: "combine", a: "known concept id", b: "known concept id", order: "Either order is accepted" },
    recipes: PAIRS.map(p => ({ a: p.a, b: p.b, child: p.child,
      result: p.condition ? `Observation of ${p.condition}; the value is measured from the world` : "Joint condition: A and B active simultaneously" })),
    publicMechanisms: spec.mechanisms.map(m => ({ id: m.id, rule: m.rule,
      predictions: { A: m.predictions[0], B: m.predictions[1], AB: m.predictions[2] } })),
    concepts: state.concepts.map(id => ({ id, label: id === "probe" ? "Probe" :
      id.startsWith("observation:") ? `Observation ${id.slice(12)} = ${state.observations[id.slice(12) as LaboratoryCondition]}` : id })),
    observations: { ...state.observations }, remainingCandidates: candidates.map(m => m.id),
    completedPairs: [...state.completedPairs], combinations: state.combinations,
    legalActions: legal.map(p => ({ type: "combine" as const, a: p.a, b: p.b })),
    previews: legal.map(p => ({ action: { type: "combine" as const, a: p.a, b: p.b }, child: p.child,
      predictions: p.condition ? candidates.map(m => ({ mechanism: m.id, value: predicts(m, p.condition) })) : undefined,
      informative: p.condition ? new Set(candidates.map(m => predicts(m, p.condition))).size > 1 : undefined })),
    status: state.status,
    currentOutcome: state.status === "won" ? `Evidence identifies ${candidates[0]!.id}` : `${candidates.length} explanations remain`,
    feedback: { ...state.feedback },
  };
}
export function stepLaboratory(state: LaboratoryState, action: LaboratoryAction): LaboratoryState {
  if (!action || action.type !== "combine" || typeof action.a !== "string" || typeof action.b !== "string") {
    return { ...state, feedback: { kind: "invalid", message: "Use {type:'combine', a:knownId, b:knownId}." } };
  }
  if (!state.concepts.includes(action.a) || !state.concepts.includes(action.b)) {
    return { ...state, feedback: { kind: "invalid", message: "Both concepts must already be present. Nothing changed." } };
  }
  const key = pairKey(action.a, action.b);
  const recipe = PAIRS.find(p => pairKey(p.a, p.b) === key);
  if (!recipe) return { ...state, feedback: { kind: "invalid", message: "That pair has no recipe; the complete public recipe list shows the legal contacts." } };
  if (state.completedPairs.includes(key)) return { ...state, feedback: { kind: "unchanged", message: "This pair is complete. Its child remains and the world has not changed; repeating it adds no information." } };
  const next: LaboratoryState = { ...state, concepts: [...state.concepts, recipe.child],
    observations: { ...state.observations }, completedPairs: [...state.completedPairs, key], combinations: state.combinations + 1 };
  if (recipe.condition) {
    const truth = scenario(state.scenarioId).mechanisms.find(m => m.id === state.mechanismId)!;
    const value = predicts(truth, recipe.condition);
    next.observations[recipe.condition] = value;
    const candidates = remaining(next);
    next.status = candidates.length === 1 ? "won" : "playing";
    next.feedback = { kind: "observed", message: `${recipe.condition} produced ${value}. ${candidates.length === 1 ? `Only ${candidates[0]!.id} remains consistent.` : `${candidates.length} explanations remain.`}` };
  } else next.feedback = { kind: "created", message: "AB is now available: both conditions active simultaneously. A and B remain." };
  return next;
}

function performCondition(state: LaboratoryState, condition: LaboratoryCondition): { state: LaboratoryState; actions: LaboratoryAction[] } {
  const actions: LaboratoryAction[] = [];
  let next = state;
  if (condition === "AB" && !next.concepts.includes("AB")) {
    const action: LaboratoryAction = { type: "combine", a: "A", b: "B" };
    actions.push(action); next = stepLaboratory(next, action);
  }
  const action: LaboratoryAction = { type: "combine", a: "probe", b: condition };
  actions.push(action); next = stepLaboratory(next, action);
  return { state: next, actions };
}
function permutations<T>(xs: readonly T[]): T[][] {
  return xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => i !== j)).map(tail => [x, ...tail])) : [[]];
}
function optimalQuery(state: LaboratoryState): LaboratoryCondition | undefined {
  const spec = scenario(state.scenarioId);
  function solve(ids: readonly string[], unused: readonly LaboratoryCondition[], jointReady: boolean): { cost: number; query?: LaboratoryCondition } {
    if (ids.length < 2) return { cost: 0 };
    let best = { cost: Infinity, query: undefined as LaboratoryCondition | undefined };
    for (const q of unused) {
      const groups = [0, 1].map(value => ids.filter(id => predicts(spec.mechanisms.find(m => m.id === id)!, q) === value)).filter(g => g.length);
      if (groups.length < 2) continue;
      const cost = (q === "AB" && !jointReady ? 2 : 1) + groups.reduce((sum, group) =>
        sum + group.length / ids.length * solve(group, unused.filter(x => x !== q), jointReady || q === "AB").cost, 0);
      if (cost < best.cost - 1e-9) best = { cost, query: q };
    }
    return best;
  }
  return solve(remaining(state).map(m => m.id), CONDITIONS.filter(q => state.observations[q] === undefined), state.concepts.includes("AB")).query;
}
/** Exact screening policies use public observations; no hidden mechanism access. */
export function runLaboratoryScreen() {
  const cases = SCENARIOS.flatMap(spec => spec.mechanisms.map((truth, seed) => {
    let state = createLaboratory(spec.id, seed);
    const informed: { action: LaboratoryAction; feedback: string }[] = [];
    let informedUsefulJoint = false;
    while (state.status !== "won") {
      const q = optimalQuery(state);
      if (!q) throw new Error("No useful experiment remains");
      for (const action of performCondition(state, q).actions) {
        const before = remaining(state).length;
        state = stepLaboratory(state, action);
        if ((action.a === "probe" && action.b === "AB") && remaining(state).length < before) informedUsefulJoint = true;
        informed.push({ action, feedback: state.feedback.message });
      }
    }
    const schedules = permutations(CONDITIONS).map(order => {
      let trial = createLaboratory(spec.id, seed);
      let redundantObservations = 0;
      for (const q of order) {
        if (trial.status === "won") break;
        const before = remaining(trial).length;
        trial = performCondition(trial, q).state;
        if (remaining(trial).length === before) redundantObservations += 1;
      }
      return { order, status: trial.status, combinations: trial.combinations, redundantObservations };
    });
    const universal = schedules.find(s => s.order.join(",") === "A,B,AB")!;
    let saturation = createLaboratory(spec.id, seed);
    let saturationInformativeObservations = 0;
    let saturationUsefulJoint = false;
    for (const q of CONDITIONS) {
      const before = remaining(saturation).length;
      saturation = performCondition(saturation, q).state;
      if (remaining(saturation).length < before) {
        saturationInformativeObservations += 1;
        if (q === "AB") saturationUsefulJoint = true;
      }
    }
    return { scenario: spec.id, truth: truth.id, seed, informed, informedCombinations: state.combinations,
      informedUsefulJoint, schedules, universal,
      saturation: { combinations: saturation.combinations, concepts: saturation.concepts.length, status: saturation.status,
        informativeObservations: saturationInformativeObservations, redundantObservations: CONDITIONS.length - saturationInformativeObservations,
        builtJoint: true, usefulJoint: saturationUsefulJoint } };
  }));
  let mistake = createLaboratory("pair-gates", 1); // OR is hidden from the player.
  const recoveryTrace: { action: LaboratoryAction; feedback: string; remaining: string[] }[] = [];
  for (const action of [
    { type: "combine", a: "probe", b: "A" },
    { type: "combine", a: "probe", b: "B" }, // legal, plausible, redundant
    { type: "combine", a: "A", b: "B" },
    { type: "combine", a: "probe", b: "AB" },
  ] as LaboratoryAction[]) {
    mistake = stepLaboratory(mistake, action);
    recoveryTrace.push({ action, feedback: mistake.feedback.message, remaining: observeLaboratory(mistake).remainingCandidates });
  }
  const byScenario = SCENARIOS.map(spec => {
    const rows = cases.filter(c => c.scenario === spec.id);
    return { scenario: spec.id, worlds: rows.length,
      informedMeanCombinations: rows.reduce((sum, r) => sum + r.informedCombinations, 0) / rows.length,
      informedUsefulJointWorlds: rows.filter(r => r.informedUsefulJoint).length,
      saturationUsefulJointWorlds: rows.filter(r => r.saturation.usefulJoint).length,
      universalMeanCombinations: rows.reduce((sum, r) => sum + r.universal.combinations, 0) / rows.length,
      universalWorstCombinations: Math.max(...rows.map(r => r.universal.combinations)),
      randomOrderMeanCombinations: rows.reduce((sum, r) => sum + r.schedules.reduce((s, x) => s + x.combinations, 0) / r.schedules.length, 0) / rows.length };
  });
  const richTrialCounterexample = SCENARIOS.map(spec => ({ scenario: spec.id,
    publicForecastSignatures: spec.mechanisms.map(m => ({ mechanism: m.id, values: m.predictions })),
    oneWholeTableTrialIdentifiesEveryMechanism: new Set(spec.mechanisms.map(m => m.predictions.join(""))).size === spec.mechanisms.length }));
  if (cases.some(c => c.universal.status !== "won" || c.universal.combinations > 4)) throw new Error("Universal short routine counterexample changed");
  if (mistake.status !== "won") throw new Error("Redundant observation was not recoverable");
  for (const spec of SCENARIOS) {
    const publicStart = JSON.stringify(observeLaboratory(createLaboratory(spec.id, 0)));
    if (spec.mechanisms.some((_, seed) => JSON.stringify(observeLaboratory(createLaboratory(spec.id, seed))) !== publicStart)) {
      throw new Error("Public start leaks the hidden mechanism");
    }
  }
  const original = createLaboratory("pair-gates", 1);
  const beforeStep = JSON.stringify(original);
  const observed = stepLaboratory(original, { type: "combine", a: "probe", b: "A" });
  if (JSON.stringify(original) !== beforeStep) throw new Error("Step mutated its input");
  const repeated = stepLaboratory(observed, { type: "combine", a: "A", b: "probe" });
  if (repeated.combinations !== observed.combinations || repeated.concepts.length !== observed.concepts.length) {
    throw new Error("A completed pair produced more material or information");
  }
  if (!original.concepts.every(id => observed.concepts.includes(id))) throw new Error("Combining consumed a parent");
  return { version: LAB_VERSION,
    evidence: "Exact deterministic model runs; no human enjoyment measurement or blind agent play.",
    byScenario, cases, recoveryTrace, richTrialCounterexample,
    invariants: { publicStartsDoNotRevealHiddenMechanism: true, pureStep: true, parentsRemain: true, completedPairDoesNotRepeat: true },
    decision: "Playable tutorial candidate only. A single-intervention probe preserves experimental choice, but a fixed A,B,AB routine solves all twelve worlds in at most four combinations. The whole-table variant collapses identification to one probe. No new Boolean construction branch is included.",
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = runLaboratoryScreen();
  const destination = resolve("results/logical-laboratory-screen.json");
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ version: report.version, result: destination,
    byScenario: report.byScenario, decision: report.decision }, null, 2)}\n`);
}
