/** Unlimited-powers screening. Original toy rules, not a player or a fun score.
 * No action consumes a concept. The search horizon is a diagnostic limit only.
 * Run: node experiments/god-world-screen.ts
 */
export {};
type V = [number, number];
type Body = { id: string; p: V; v: V; home: 'upper' | 'lower'; exit?: 'home' | 'miss' };
type Sky = { bodies: Body[]; stars: V[]; lost: string | null; fusions: number };
type Power = { id: string; kind: 'sun' | 'wind' | 'nebula'; at: V; direction?: V };
type SkyCase = { id: string; initial: Sky };
const copy = <T>(x: T): T => structuredClone(x);
const length = (v: V) => Math.hypot(...v);
const distance = (a: V, b: V) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const round = (x: number) => Math.round(x * 10000) / 10000;
const sunPositions: V[] = [[-1.1, -1.3], [-1.1, 1.3], [0, -1.3], [0, 1.3], [1.1, -1.3], [1.1, 1.3]];
const SKY_POWERS: Power[] = [
  ...sunPositions.map((at, i): Power => ({ id: `sun-${i}`, kind: 'sun', at })),
  ...([[1, 0], [-1, 0], [0, 1], [0, -1]] as V[]).map((direction, i): Power => ({ id: `wind-${i}`, kind: 'wind', at: [0, 0], direction })),
  ...([[-1, 0], [0, 0], [1, 0]] as V[]).map((at, i): Power => ({ id: `nebula-${i}`, kind: 'nebula', at })),
];
function skyStep(before: Sky, power: Power | null): Sky {
  const s = copy(before); if (power) s.fusions++;
  if (s.lost || s.bodies.every(b => b.exit)) return s;
  if (power?.kind === 'sun') s.stars.push(copy(power.at));
  if (power?.kind === 'wind') for (const b of s.bodies) if (!b.exit) {
    b.v[0] += power.direction![0] * .32; b.v[1] += power.direction![1] * .32;
  }
  // A nebula is a local drag field during this response, not stored fuel.
  const dt = .025;
  for (let tick = 0; tick < 40 && !s.lost; tick++) {
    for (const b of s.bodies) if (!b.exit) {
      let ax = 0, ay = 0;
      for (const star of s.stars) {
        const dx = star[0] - b.p[0], dy = star[1] - b.p[1];
        const r = Math.hypot(dx, dy);
        if (r < .12) { s.lost = `${b.id} struck a sun`; break; }
        const f = .30 / Math.pow(r * r + .10, 1.5); ax += dx * f; ay += dy * f;
      }
      if (power?.kind === 'nebula') {
        const drag = .95 / (1 + distance(b.p, power.at) ** 2 * 2);
        ax -= b.v[0] * drag; ay -= b.v[1] * drag;
      }
      b.v[0] += ax * dt; b.v[1] += ay * dt;
      b.p[0] += b.v[0] * dt; b.p[1] += b.v[1] * dt;
      if (length(b.p) < .48) s.lost = `${b.id} struck the dark world`;
      if (Math.abs(b.p[1]) > 2.1 || b.p[0] < -3) { b.exit = 'miss'; s.lost = `${b.id} left the sky`; }
      if (b.p[0] >= 2.8) {
        const inGate = b.home === 'upper' ? b.p[1] > .58 && b.p[1] < 1.65 : b.p[1] < -.58 && b.p[1] > -1.65;
        b.exit = inGate ? 'home' : 'miss'; if (!inGate) s.lost = `${b.id} missed its passage`;
      }
    }
    const [a, b] = s.bodies;
    if (!a.exit && !b.exit && distance(a.p, b.p) < .15) s.lost = 'the wandering worlds collided';
  }
  return s;
}
const skyWin = (s: Sky) => !s.lost && s.bodies.every(b => b.exit === 'home');
const coastCache = new WeakMap<Sky, Sky | null>();
function skyCoast(s: Sky): Sky | null {
  if (coastCache.has(s)) return coastCache.get(s)!;
  let future = s;
  // This is an unassisted-trajectory test, never a player wait/craft action.
  for (let seconds = 0; seconds <= 8; seconds++) {
    if (skyWin(future)) { coastCache.set(s, future); return future; }
    if (future.lost) break;
    future = skyStep(future, null);
  }
  coastCache.set(s, null); return null;
}
const skySummary = (s: Sky) => ({ lost: s.lost, win: skyWin(s), stars: s.stars, bodies: s.bodies.map(b => ({ id: b.id, p: b.p.map(round), v: b.v.map(round), exit: b.exit ?? null })) });
function skyMerit(s: Sky): number {
  if (s.lost) return -1e5;
  return s.bodies.reduce((n, b) => n + (b.exit === 'home' ? 100 : b.p[0] * 3 - Math.abs(b.p[1] - (b.home === 'upper' ? 1 : -1)) * 3), 0);
}
function skyPlan(initial: Sky, opening?: Power, depth = 7, allowed = SKY_POWERS): { path: string[]; final: ReturnType<typeof skySummary> } | null {
  type Node = { s: Sky; path: string[] };
  let beam: Node[] = [{ s: opening ? skyStep(initial, opening) : copy(initial), path: opening ? [opening.id] : [] }];
  for (let turn = beam[0].path.length; turn <= depth; turn++) {
    const won = beam.find(n => skyCoast(n.s)); if (won) return { path: won.path, final: skySummary(skyCoast(won.s)!) };
    if (turn === depth) break;
    const next: Node[] = [];
    for (const node of beam) if (!node.s.lost) for (const action of allowed) {
      const s = skyStep(node.s, action); if (!s.lost) next.push({ s, path: [...node.path, action.id] });
    }
    next.sort((a, b) => skyMerit(b.s) - skyMerit(a.s));
    beam = next.slice(0, 150); if (!beam.length) break;
  }
  return null;
}
function skyRun(initial: Sky, policy: (s: Sky, turn: number) => Power, steps = 10) {
  let s = copy(initial); const trace: { action: string; after: ReturnType<typeof skySummary> }[] = [];
  for (let turn = 0; turn < steps && !s.lost && !skyCoast(s); turn++) {
    const a = policy(s, turn); s = skyStep(s, a); trace.push({ action: a.id, after: skySummary(s) });
  }
  return { win: !!skyCoast(s), trace };
}
const skyCaseData: [string, number, number, number?][] = [
  ['level', 0, 0], ['upper-falling', -.23, 0], ['lower-rising', 0, .23], ['converging', -.23, .23],
  ['diverging', .12, -.12], ['upper-fast', -.12, .08], ['lower-fast', -.08, .12], ['crosswind', .18, .18],
  ['near-upper-falling', -.20, 0, -1.10], ['near-lower-rising', 0, .20, -1.10],
  ['strong-crosswind', .45, .45], ['opposing-crosswind', -.45, -.45],
];
const skyCases: SkyCase[] = skyCaseData.map(([id, upperVy, lowerVy, startX = -2]) => ({
  id, initial: { bodies: [
    { id: 'dawn', p: [startX, .6], v: [1, upperVy], home: 'upper' },
    { id: 'dusk', p: [startX, -.6], v: [1, lowerVy], home: 'lower' },
  ], stars: [], lost: null, fusions: 0 },
}));

function screenSky() {
  const cases = skyCases.map(c => {
    const openings = SKY_POWERS.map(a => {
      const after = skyStep(c.initial, a);
      const found = after.lost ? null : skyPlan(c.initial, a);
      return { action: a.id, firstResponse: skySummary(after), found };
    });
    const repeated = SKY_POWERS.map(a => ({ action: a.id, ...skyRun(c.initial, () => a) }));
    const greedy = skyRun(c.initial, s => SKY_POWERS.map(a => ({ a, score: skyMerit(skyStep(s, a)) })).sort((a, b) => b.score - a.score)[0].a);
    const foundPlan = skyPlan(c.initial);
    const substitutions = foundPlan?.path.map((id, skipped) => {
      let s = copy(c.initial);
      for (let i = 0; i < foundPlan.path.length && !s.lost; i++) s = skyStep(s, i === skipped ? null : SKY_POWERS.find(a => a.id === foundPlan.path[i])!);
      return { fusion: skipped + 1, action: id, succeedsWithEffectRemovedButTimePreserved: !!skyCoast(s) };
    });
    const singlePowerFamilies = (['sun', 'wind', 'nebula'] as const).map(kind => ({ kind, found: skyPlan(c.initial, undefined, 7, SKY_POWERS.filter(a => a.kind === kind)) }));
    return { id: c.id, initial: skySummary(c.initial), alreadyCoastsHome: !!skyCoast(c.initial), foundPlan, substitutions, singlePowerFamilies, openings, repeated, greedy };
  });
  // Strong reversal: a found successful continuation, versus immediate death in
  // the other context. A failed bounded search is NEVER called infeasibility.
  let reversal: unknown = null;
  outer: for (const a of cases) for (const b of cases) if (a.id !== b.id) {
    const aa = a.openings.find(x => x.found && b.openings.find(y => y.action === x.action)?.firstResponse.lost);
    const bb = b.openings.find(x => x.found && a.openings.find(y => y.action === x.action)?.firstResponse.lost);
    if (aa && bb) { reversal = { contextA: a.id, contextB: b.id, openingA: aa.action, openingB: bb.action, witnessA: aa.found, witnessB: bb.found }; break outer; }
  }
  return {
    rules: { concepts: ['Earth', 'Fire', 'Air', 'Water', 'Sun', 'Wind', 'Nebula'], recipes: ['Earth + Fire = Sun (persistent attraction at contact)', 'Air + Fire = Wind (a shared directional impulse)', 'Water + Sun = Nebula (local drag during the response)'], worldResponse: 'Each committed fusion advances the same world by one second. No wait action; no extra recipe prerequisite; all powers available in full-information screen. If the unassisted trajectories already reach both passages, resolve them without another player action.', endpoint: 'Both wandering worlds must leave through their own visible passage; collision or a wrong exit is terminal.', supplies: 'Every concept is inexhaustible. Suns coexist and their attraction adds. No cap, cost, score or stock.' },
    powers: SKY_POWERS, search: { depth: 7, beamWidth: 150, warning: 'A found path is a witness. No path is only a bounded-search failure; beam search is not a proof of impossibility. Fusions are not capped by game rules.' },
    summary: { foundPlans: cases.filter(c => c.foundPlan).length, cases: cases.length, alreadySuccessfulWithoutActing: cases.filter(c => c.alreadyCoastsHome).length, activeChallengeCases: cases.filter(c => !c.alreadyCoastsHome).length, activeChallengeFoundPlans: cases.filter(c => !c.alreadyCoastsHome && c.foundPlan).length, greedyWins: cases.filter(c => c.greedy.win).length, activeChallengeGreedyWins: cases.filter(c => !c.alreadyCoastsHome && c.greedy.win).length, universalRepeatedActions: SKY_POWERS.filter(a => cases.every(c => c.repeated.find(r => r.action === a.id)!.win)).map(a => a.id) },
    reversal, cases,
  };
}

// Comparator: two creatures have intentions, rather than velocities. A fusion
// changes a place's light/shade; creatures then follow their visible arrows to
// rest. Nothing is spent, produced, accumulated toward a quota, or timed out.
const PLACES = ['left', 'crossing', 'right', 'above', 'below'] as const;
type Place = typeof PLACES[number];
const PATHS: Record<Place, Place[]> = { left: ['crossing'], crossing: ['left', 'right', 'above', 'below'], right: ['crossing'], above: ['crossing'], below: ['crossing'] };
const pathsFrom = (start: Place): Record<Place, number> => {
  const d = { [start]: 0 } as Record<Place, number>, queue: Place[] = [start];
  for (let i = 0; i < queue.length; i++) for (const n of PATHS[queue[i]]) if (!(n in d)) { d[n] = d[queue[i]] + 1; queue.push(n); }
  return d;
};
const DISTANCES = Object.fromEntries(PLACES.map(p => [p, pathsFrom(p)])) as Record<Place, Record<Place, number>>;
type SpiritState = { day: Place; night: Place; fields: Partial<Record<Place, 'light' | 'shade'>>; lost: string | null };
type SpiritAct = { id: string; at: Place; field: 'light' | 'shade' };
const SPIRIT_ACTS: SpiritAct[] = PLACES.flatMap(at => (['light', 'shade'] as const).map(field => ({ id: `${field}@${at}`, at, field })));
const spiritKey = (s: SpiritState) => `${s.day}|${s.night}|${PLACES.map(p => s.fields[p]?.[0] ?? '-').join('')}|${s.lost ?? ''}`;
const spiritWin = (s: SpiritState) => !s.lost && s.day === 'right' && s.night === 'left';
function spiritArrow(s: SpiritState, who: 'day' | 'night'): Place {
  const at = s[who], field = who === 'day' ? 'light' : 'shade';
  const preferred = PLACES.filter(p => s.fields[p] === field);
  if (!preferred.length || s.fields[at] === field) return at;
  const nearest = Math.min(...preferred.map(p => DISTANCES[at][p]));
  const destinations = preferred.filter(p => DISTANCES[at][p] === nearest);
  // A visible hesitation, not an undisclosed tie-breaking direction.
  if (destinations.length !== 1) return at;
  return PATHS[at].find(p => DISTANCES[p][destinations[0]] < nearest) ?? at;
}
function spiritStep(before: SpiritState, act: SpiritAct) {
  const s = copy(before), movement: { day: Place; night: Place }[] = [];
  if (s.lost || spiritWin(s) || s.fields[act.at] === act.field) return { s, movement };
  s.fields[act.at] = act.field;
  for (let step = 0; step < 12; step++) {
    const day = spiritArrow(s, 'day'), night = spiritArrow(s, 'night');
    if (day === s.day && night === s.night) break;
    if (day === night || day === s.night && night === s.day) {
      s.lost = 'the creatures meet before reaching their separate homes'; movement.push({ day, night }); break;
    }
    s.day = day; s.night = night; movement.push({ day, night });
  }
  return { s, movement };
}
function spiritSolve(initial: SpiritState, opening?: SpiritAct) {
  const start = opening ? spiritStep(initial, opening).s : initial;
  const queue = [{ s: start, path: opening ? [opening.id] : [] as string[] }], seen = new Set([spiritKey(start)]);
  for (let i = 0; i < queue.length; i++) {
    const n = queue[i]; if (spiritWin(n.s)) return { path: n.path, statesVisited: seen.size };
    if (n.s.lost) continue;
    for (const a of SPIRIT_ACTS) {
      const next = spiritStep(n.s, a).s, key = spiritKey(next);
      if (next.lost || seen.has(key)) continue;
      seen.add(key); queue.push({ s: next, path: [...n.path, a.id] });
    }
  }
  return null;
}
function spiritRun(initial: SpiritState, path: string[]) {
  let s = copy(initial); const trace: { action: string; state: SpiritState; movement: { day: Place; night: Place }[] }[] = [];
  for (const id of path) {
    if (s.lost || spiritWin(s)) break;
    const after = spiritStep(s, SPIRIT_ACTS.find(a => a.id === id)!); s = after.s;
    trace.push({ action: id, state: copy(s), movement: after.movement });
  }
  return { win: spiritWin(s), trace };
}
function screenSpirits() {
  const starts: { id: string; day: Place; night: Place }[] = [
    { id: 'night-blocks', day: 'left', night: 'crossing' },
    { id: 'day-blocks', day: 'crossing', night: 'right' },
    { id: 'opposite-ends', day: 'left', night: 'right' },
    { id: 'upper-crossing', day: 'above', night: 'below' },
  ];
  const cases = starts.map(c => {
    const initial: SpiritState = { day: c.day, night: c.night, fields: {}, lost: null };
    const plan = spiritSolve(initial);
    const openings = SPIRIT_ACTS.map(a => ({ action: a.id, first: spiritStep(initial, a), continuation: spiritSolve(initial, a) }));
    const greedyPath: string[] = []; let greedyState = initial;
    for (let turn = 0; turn < 10 && !greedyState.lost && !spiritWin(greedyState); turn++) {
      const options = SPIRIT_ACTS.filter(a => greedyState.fields[a.at] !== a.field).map(a => ({ a, after: spiritStep(greedyState, a).s }));
      options.sort((a, b) => {
        const value = (s: SpiritState) => s.lost ? -100 : -DISTANCES[s.day].right - DISTANCES[s.night].left;
        return value(b.after) - value(a.after);
      });
      const chosen = options[0]; greedyPath.push(chosen.a.id); greedyState = chosen.after;
    }
    return { id: c.id, initial, plan, trace: plan ? spiritRun(initial, plan.path) : null, greedy: spiritRun(initial, greedyPath), openings };
  });
  let reversal: unknown = null;
  outer: for (const a of cases) for (const b of cases) if (a.id !== b.id) {
    const aa = a.openings.find(x => x.continuation && x.first.movement.length && b.openings.find(y => y.action === x.action)?.first.s.lost);
    const bb = b.openings.find(x => x.continuation && x.first.movement.length && a.openings.find(y => y.action === x.action)?.first.s.lost);
    if (aa && bb) { reversal = { contextA: a.id, contextB: b.id, actA: aa.action, actB: bb.action, planA: aa.continuation, planB: bb.continuation }; break outer; }
  }
  const fixedPlanCoverage = cases.filter(c => c.plan).map(c => ({ from: c.id, path: c.plan!.path, wins: cases.filter(x => spiritRun(x.initial, c.plan!.path).win).map(x => x.id) }));
  const repeated = SPIRIT_ACTS.map(a => ({ action: a.id, wins: cases.filter(c => spiritRun(c.initial, Array(10).fill(a.id)).win).map(c => c.id) }));
  const commonChain = ['light@left', 'shade@right', 'shade@left', 'light@above', 'light@right', 'shade@above'];
  const commonChainResults = cases.map(c => ({ id: c.id, ...spiritRun(c.initial, commonChain) }));
  return {
    rules: { concepts: ['Earth', 'Water', 'Fire', 'Air', 'Light', 'Shade'], recipes: ['Fire + Air = Light', 'Earth + Water = Shade'], world: PATHS, intentions: 'Day seeks nearest Light; Night seeks nearest Shade. A creature at a preferred source stays. Equally near sources cause visible hesitation. Paths and intentions are inspectable. Both move together until they rest; meeting or exchanging places loses.', placeChange: 'Fusion changes one place to light or shade; the opposing quality is replaced. Existing equal quality is a no-op and advances nothing. All other qualities remain.', goal: 'Day rests at Right and Night at Left.', supplies: 'Inexhaustible concepts, no field quota, no quantities, no turn deadline or waiting action.' },
    summary: { solved: cases.filter(c => c.plan).length, cases: cases.length, greedyWins: cases.filter(c => c.greedy.win).length, anyRepeatedActWins: repeated.some(r => r.wins.length > 0), aShortestFoundPlanWinsAllContexts: fixedPlanCoverage.some(c => c.wins.length === cases.length), commonChainWinsAllContexts: commonChainResults.every(c => c.win), decision: 'Reject this four-context slice: the common synchronization chain bypasses context-dependent planning.' },
    reversal, fixedPlanCoverage, repeated, commonChain: { actions: commonChain, results: commonChainResults }, cases,
  };
}

const report = { experiment: 'god-world-screen-1', knowledge: 'Complete rules and all sampled action results; no hidden recipes, stocks or learned costs. Privileged model inspection; not human or browser play.', scope: 'This screen predates the newer unified board / exactly one instance of each concept / parents remain proposal. It requires repeat fusions and multiple active copies of concepts. It does NOT validate that newer substrate.', sky: screenSky(), spirits: screenSpirits(), limitations: ['Physics is an original toy, not an astrophysical model.', 'Continuous physical locations/directions are sampled by the harness; those samples are not restrictions on player powers.', 'This screen cannot validate the combining gesture, pleasure, readability, novelty or a human inference.', 'Repeated policy failure does not exclude adaptive uses of one power or a longer universal action sequence.', 'The sky model permits multiple Suns and repeats a completed recipe; those are incompatible with exactly one instance per concept and novel-combinations-only interaction.', 'If moving an already-created Sun controls the entire challenge, combining can become cosmetic. This model does not resolve that interaction confound.'] };
console.log(JSON.stringify(report, null, 2));
