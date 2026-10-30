/**
 * Two cheap rejection screens, not player simulations or enjoyment measures.
 * Run: node experiments/ideas-challenge-screen.ts
 * No deadline, stock, action credit or recipe secrecy is present.
 */
export {};
type Recipe = { id: string; parents: readonly [string, string]; child: string };
const initial = ["ai", "mathematics", "genome", "logic", "experiment"];
const recipes: Recipe[] = [
  { id: "machine-mathematics", parents: ["ai", "mathematics"], child: "machine-mathematics" },
  { id: "regulation-prediction", parents: ["ai", "genome"], child: "regulation-prediction" },
  { id: "perturbation-assay", parents: ["genome", "experiment"], child: "perturbation-assay" },
  { id: "proof-workflow", parents: ["machine-mathematics", "logic"], child: "proof-workflow" },
  { id: "model-comparison", parents: ["regulation-prediction", "perturbation-assay"], child: "model-comparison" },
];
function legal(known: ReadonlySet<string>): Recipe[] {
  return recipes.filter(r => !known.has(r.child) && r.parents.every(p => known.has(p)));
}
function satisfied(known: ReadonlySet<string>, targets: readonly string[]): boolean {
  return targets.every(t => known.has(t));
}
function shortest(targets: readonly string[]): string[] {
  const queue = [{ known: new Set(initial), path: [] as string[] }];
  const seen = new Set<string>();
  for (const item of queue) {
    if (satisfied(item.known, targets)) return item.path;
    for (const r of legal(item.known)) {
      const known = new Set([...item.known, r.child]);
      const key = [...known].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ known, path: [...item.path, r.id] });
    }
  }
  throw new Error("Unreachable target in the authored screen");
}
function novelty(targets: readonly string[]): string[] {
  const known = new Set(initial);
  const path: string[] = [];
  while (!satisfied(known, targets)) {
    const next = legal(known)[0];
    if (!next) throw new Error("Closure failed");
    known.add(next.child);
    path.push(next.id);
  }
  return path;
}
function directOnly(targets: readonly string[]): boolean {
  const known = new Set(initial);
  for (;;) {
    if (satisfied(known, targets)) return true;
    const next = legal(known).find(r => targets.includes(r.child));
    if (!next) return false;
    known.add(next.child);
  }
}
const targetSets = Array.from({ length: (1 << recipes.length) - 1 }, (_, i) =>
  recipes.filter((_, bit) => ((i + 1) & (1 << bit)) !== 0).map(r => r.child));
const toolkitCases = targetSets.map(targets => ({
  targets,
  planner: shortest(targets),
  novelty: novelty(targets),
  directOnlyWins: directOnly(targets),
}));

// An invented Boolean laboratory. These are public competing toy mechanisms,
// not assertions about real genes. Hidden state is which mechanism is true;
// recipe legality and every candidate's prediction are fully visible.
type Condition = "A" | "B" | "AB";
type Predictions = readonly [number, number, number];
type Family = { id: string; models: { id: string; predictions: Predictions }[] };
const conditions: Condition[] = ["A", "B", "AB"];
const families: Family[] = [
  { id: "pair-gates", models: [
    { id: "AND", predictions: [0, 0, 1] },
    { id: "OR", predictions: [1, 1, 1] },
    { id: "XOR", predictions: [1, 1, 0] },
  ] },
  { id: "relays-and-interaction", models: [
    { id: "relay-A", predictions: [1, 0, 1] },
    { id: "relay-B", predictions: [0, 1, 1] },
    { id: "XOR", predictions: [1, 1, 0] },
  ] },
];
const prediction = (family: Family, model: number, condition: Condition): number =>
  family.models[model]!.predictions[conditions.indexOf(condition)]!;
// A+B creates the one AB node; Probe+condition creates its one observation.
// Originals remain. AB's first observation takes two fusions, other probes one.
const fusionCost = (condition: Condition): number => condition === "AB" ? 2 : 1;
type Policy = { expectedFusions: number; expectedQueries: number; condition?: Condition; branches?: Record<string, Policy> };
function branches(family: Family, possible: readonly number[], q: Condition): number[][] {
  return [0, 1].map(value => possible.filter(m => prediction(family, m, q) === value)).filter(xs => xs.length);
}
function planner(family: Family, possible: readonly number[], unused: readonly Condition[]): Policy {
  if (possible.length <= 1) return { expectedFusions: 0, expectedQueries: 0 };
  let best: Policy | undefined;
  for (const q of unused) {
    const parts = branches(family, possible, q);
    if (parts.length === 1) continue;
    const continuations = parts.map(part => planner(family, part, unused.filter(x => x !== q)));
    const expectedFusions = fusionCost(q) + continuations.reduce((sum, next, i) =>
      sum + next.expectedFusions * parts[i]!.length / possible.length, 0);
    if (!best || expectedFusions < best.expectedFusions - 1e-9) {
      best = { expectedFusions,
        expectedQueries: 1 + continuations.reduce((sum, next, i) => sum + next.expectedQueries * parts[i]!.length / possible.length, 0),
        condition: q, branches: Object.fromEntries(parts.map((part, i) =>
        [String(prediction(family, part[0]!, q)), continuations[i]!])) };
    }
  }
  if (!best) throw new Error("Indistinguishable authored mechanisms");
  return best;
}
function greedy(family: Family, possible: readonly number[], unused: readonly Condition[]): Policy {
  if (possible.length <= 1) return { expectedFusions: 0, expectedQueries: 0 };
  const ranked = unused.map(q => {
    const parts = branches(family, possible, q);
    const expectedRemaining = parts.reduce((sum, part) => sum + part.length ** 2 / possible.length, 0);
    return { q, parts, score: (possible.length - expectedRemaining) / fusionCost(q) };
  }).sort((a, b) => b.score - a.score);
  const best = ranked[0]!;
  if (best.score === 0) throw new Error("No informative query");
  const children = best.parts.map(part => greedy(family, part, unused.filter(x => x !== best.q)));
  return { condition: best.q,
    expectedFusions: fusionCost(best.q) + children.reduce((sum, child, i) =>
      sum + child.expectedFusions * best.parts[i]!.length / possible.length, 0),
    expectedQueries: 1 + children.reduce((sum, child, i) => sum + child.expectedQueries * best.parts[i]!.length / possible.length, 0),
    branches: Object.fromEntries(best.parts.map((part, i) =>
      [String(prediction(family, part[0]!, best.q)), children[i]!])),
  };
}
function permutations<T>(xs: readonly T[]): T[][] {
  return xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => i !== j)).map(rest => [x, ...rest])) : [[]];
}
function fixedSchedule(family: Family, order: readonly Condition[]): { meanFusions: number; worstFusions: number; meanQueries: number; worstQueries: number; wins: number } {
  const totals = family.models.map((_, truth) => {
    let possible = family.models.map((__, i) => i);
    let fusions = 0;
    let queries = 0;
    for (const q of order) {
      if (possible.length === 1) break;
      fusions += fusionCost(q);
      queries += 1;
      const observed = prediction(family, truth, q);
      possible = possible.filter(m => prediction(family, m, q) === observed);
    }
    return { fusions, queries, won: possible.length === 1 };
  });
  return { meanFusions: totals.reduce((sum, x) => sum + x.fusions, 0) / totals.length,
    meanQueries: totals.reduce((sum, x) => sum + x.queries, 0) / totals.length,
    worstQueries: Math.max(...totals.map(x => x.queries)),
    worstFusions: Math.max(...totals.map(x => x.fusions)), wins: totals.filter(x => x.won).length };
}
const laboratoryCases = families.map(family => {
  const possible = family.models.map((_, i) => i);
  const schedules = permutations(conditions).map(order => ({ order, ...fixedSchedule(family, order) }));
  return { id: family.id, models: family.models, planner: planner(family, possible, conditions),
    informationGreedy: greedy(family, possible, conditions),
    uniformRandomScheduleMeanFusions: schedules.reduce((sum, x) => sum + x.meanFusions, 0) / schedules.length,
    uniformRandomScheduleMeanQueries: schedules.reduce((sum, x) => sum + x.meanQueries, 0) / schedules.length,
    bestFixedSchedule: [...schedules].sort((a, b) => a.meanFusions - b.meanFusions)[0],
  };
});
const sharedSchedules = permutations(conditions).map(order => ({ order,
  cases: families.map(family => ({ id: family.id, ...fixedSchedule(family, order) })),
}));

// Faculty-scaling lens: test a tempting scrutiny/privacy tradeoff before
// claiming it is a challenge. This is an invented protocol, not information
// security advice or a historical claim. Each transformation creates a child;
// all previous bundles and the three inexhaustible capabilities remain.
type FacultyOperation = "scrutinize" | "redact" | "publish";
type ToyMessage = { content: number; authentic: boolean; originVisible: boolean; checked: boolean };
const facultyCases = [0, 1].flatMap(truth => [false, true].flatMap(privateWitness =>
  [false, true].map(forgery => ({ truth, privateWitness, forgery }))));
function facultyRoute(context: typeof facultyCases[number], route: readonly FacultyOperation[]): boolean {
  let focus: ToyMessage[] = [{ content: context.truth, authentic: true, originVisible: true, checked: false }];
  if (context.forgery) focus.push({ content: 1 - context.truth, authentic: false, originVisible: true, checked: false });
  const retainedParents = [focus];
  let published: ToyMessage[] | undefined;
  for (const operation of route) {
    if (operation === "scrutinize") {
      // This toy check needs visible origin; a completed check survives redaction.
      focus = focus.filter(m => m.originVisible && m.authentic).map(m => ({ ...m, checked: true }));
      retainedParents.push(focus);
    } else if (operation === "redact") {
      focus = focus.map(m => ({ ...m, originVisible: false }));
      retainedParents.push(focus);
    } else {
      // Publishing discloses this child to the world. A later transformation
      // cannot erase the already published child or retract a leaked identity.
      published = focus;
    }
  }
  if (!published?.length) return false;
  return published.every(m => m.content === context.truth) &&
    (!context.privateWitness || published.every(m => !m.originVisible));
}
const facultyRoutes = permutations<FacultyOperation>(["scrutinize", "redact", "publish"]).map(route => ({
  route, wins: facultyCases.filter(context => facultyRoute(context, route)).length,
}));
const report = {
  version: "ideas-screen-1",
  evidence: "Executed exact model screening; no browser play, human play or enjoyment measurement.",
  toolkit: { conceptCount: initial.length + recipes.length, recipes, caseCount: toolkitCases.length,
    plannerWins: toolkitCases.length, noveltyWins: toolkitCases.length,
    deliberatelyWeakDirectOnlyWins: toolkitCases.filter(x => x.directOnlyWins).length,
    commonFiveFusionSchedule: recipes.map(r => r.id), cases: toolkitCases,
    decision: "Reject as a challenge: the target is a named prerequisite list; all goals share a five-fusion saturation schedule.",
  },
  diagnosticLaboratory: { conceptCount: 7,
    publicRecipes: ["A+B → AB", "Probe+A → Observation A", "Probe+B → Observation B", "Probe+AB → Observation AB"],
    uncertainty: "Only which of the public toy mechanisms is true is hidden. Every recipe and candidate prediction is public.",
    noBudgets: true, families: laboratoryCases, sharedSchedules,
    matchedBranch: { observation: "A = 1", pairGates: { informative: "AB", redundant: "B" },
      relaysAndInteraction: { informative: "B", alsoInformativeButExtraFusion: "AB" } },
    decision: "Retain as an experiment-design tutorial hypothesis: context changes which known experiment is informative. Greedy matches optimal, and the remaining inference is a shallow comparison of two public forecasts. Do not claim a complete challenge or enjoyment. Exhaustive solvability alone is not the rejection test.",
  },
  facultyScaling: { caseCount: facultyCases.length, cases: facultyCases, routes: facultyRoutes,
    safeguardsAlwaysAvailable: true, harmlessAcquisition: true,
    decision: "Reject this scrutiny/privacy ordering puzzle as a full challenge: scrutinize, redact, publish wins all eight contexts. Acquiring optional harmless safeguards first cannot be made a meaningful sacrifice by adding an action quota. A richer relationship problem remains untested.",
  },
};
// Regression assertions guard the negative conclusion without manufacturing a fun score.
if (report.toolkit.noveltyWins !== 31) throw new Error("Unexpected toolkit closure result");
if (laboratoryCases.some(x => Math.abs(x.planner.expectedFusions - x.informationGreedy.expectedFusions) > 1e-9)) {
  throw new Error("The documented greedy/planner equivalence changed");
}
if (sharedSchedules.some(s => s.cases.some(c => c.wins !== 3))) throw new Error("A full schedule did not identify a model");
if (!facultyRoutes.some(r => r.route.join(",") === "scrutinize,redact,publish" && r.wins === 8)) {
  throw new Error("The documented universal faculty route changed");
}
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
