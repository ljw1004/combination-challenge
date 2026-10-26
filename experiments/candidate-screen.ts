/** Exploratory candidate screen; intentionally independent from the playable engine.
 * Run: node experiments/candidate-screen.ts
 * These model-informed policies are mechanical diagnostics, not blind players.
 */
type Kind = 'flood' | 'hero';
type Action = { type: 'discover'; concept: string } | { type: 'deploy'; concept: string; lane: number } | { type: 'wait' };
type Recipe = { output: string; inputs: string[] };
type State = {
  kind: Kind; seed: number; turn: number; horizon: number; known: string[];
  water: number[]; drains: number[]; walls: number[]; buffers: number[]; damage: number[];
  heroLane: number; heroProgress: number; gate: boolean;
};
const recipes: Recipe[] = [
  { output: 'mud', inputs: ['earth', 'water'] },
  { output: 'roots', inputs: ['seed', 'water'] },
  { output: 'brick', inputs: ['mud', 'fire'] },
  { output: 'channel', inputs: ['brick', 'water'] },
  { output: 'wetland', inputs: ['roots', 'mud'] },
  { output: 'gate', inputs: ['roots', 'brick'] },
];
const deployments = ['mud', 'roots', 'brick', 'channel', 'wetland', 'gate'];
function initial(kind: Kind, seed: number): State {
  return { kind, seed, turn: 0, horizon: 10, known: ['earth', 'water', 'fire', 'seed'],
    water: [0, 0, 0], drains: [0, 0, 0], walls: [0, 0, 0], buffers: [0, 0, 0], damage: [0, 0, 0],
    heroLane: seed % 3, heroProgress: 0, gate: false };
}
function terminal(s: State) { return s.gate || s.turn >= s.horizon || s.heroProgress >= 7 || s.damage.some(x => x >= 3); }
function won(s: State) { return s.kind === 'hero' ? s.gate || (s.turn >= s.horizon && s.heroProgress < 7) : s.turn >= s.horizon && s.damage.every(x => x < 3); }
function actions(s: State): Action[] {
  if (terminal(s)) return [];
  const list: Action[] = recipes.filter(r => !s.known.includes(r.output) && r.inputs.every(x => s.known.includes(x)))
    .filter(r => s.kind !== 'flood' || r.output !== 'gate').map(r => ({ type: 'discover', concept: r.output }));
  for (const concept of s.known.filter(x => deployments.includes(x))) {
    if (s.kind === 'flood' && concept === 'gate') continue;
    if (s.kind === 'hero' && ['channel', 'wetland'].includes(concept)) continue;
    for (let lane = 0; lane < 3; lane++) {
      if (concept === 'gate' && lane !== 1) continue;
      if (s.kind === 'flood' && concept === 'channel' && s.drains[lane] >= 2) continue;
      if (s.kind === 'flood' && concept === 'roots' && s.drains[lane] >= 1) continue;
      if (s.kind === 'flood' && concept === 'wetland' && s.drains[lane] >= 2) continue;
      list.push({ type: 'deploy', concept, lane });
    }
  }
  return [...list, { type: 'wait' }];
}
function pulse(s: State): { lane: number; amount: number } {
  // Only next pulse needs to be shown to a player; this screening planner has
  // privileged access to this deterministic schedule through the model.
  return { lane: (s.seed + Math.floor(s.turn / 2) + (s.seed % 2) * s.turn) % 3, amount: 2 + ((s.seed * 7 + s.turn * 3) % 5 === 0 ? 1 : 0) };
}
function step(s: State, a: Action): State {
  const n = structuredClone(s);
  if (terminal(s)) return n;
  if (a.type === 'discover') n.known.push(a.concept);
  if (a.type === 'deploy') {
    const l = a.lane;
    if (n.kind === 'flood') {
      if (a.concept === 'mud') n.buffers[l] += 3;
      if (a.concept === 'roots') n.drains[l] = Math.max(n.drains[l], 1);
      if (a.concept === 'brick') n.walls[l] = 2;
      if (a.concept === 'channel') n.drains[l] = 2;
      if (a.concept === 'wetland') { n.drains[l] = 2; n.buffers[l] += 1; }
    } else {
      if (a.concept === 'mud') n.walls[l] = Math.max(n.walls[l], 1);
      if (a.concept === 'brick') n.walls[l] = Math.max(n.walls[l], 2);
      if (a.concept === 'roots') n.walls[l] = Math.max(n.walls[l], 2);
      if (a.concept === 'gate') n.gate = true;
    }
  }
  if (n.kind === 'flood') {
    const p = pulse(n);
    let incoming = p.amount;
    if (n.walls[p.lane] > 0) {
      // A levee redirects one unit; it does not delete water.
      incoming -= 1;
      n.water[(p.lane + 1) % 3] += 1;
      n.walls[p.lane] -= 1;
    }
    n.water[p.lane] += incoming;
    for (let l = 0; l < 3; l++) {
      const soaked = Math.min(n.water[l], n.buffers[l]);
      n.water[l] -= soaked; n.buffers[l] -= soaked;
      n.water[l] = Math.max(0, n.water[l] - n.drains[l]);
      if (n.water[l] > 3) { n.damage[l] += n.water[l] - 3; n.water[l] = 3; }
    }
  } else if (!n.gate) {
    const lane = n.heroLane;
    if (n.walls[lane] > 0) {
      const other = [lane - 1, lane + 1].filter(l => l >= 0 && l < 3).sort((a, b) => n.walls[a] - n.walls[b] || a - b)[0];
      if (n.walls[other] < n.walls[lane]) n.heroLane = other; // Detour costs this turn.
      else n.walls[lane] -= 1; // Break a blocking construction.
    } else n.heroProgress += 1;
  }
  n.turn += 1;
  return n;
}
function score(s: State): number {
  if (s.kind === 'flood') return (won(s) ? 10000 : 0) - s.damage.reduce((a, b) => a + b, 0) * 100
    - s.water.reduce((a, b) => a + b, 0) * 3 + s.drains.reduce((a, b) => a + b, 0) * 2
    + s.buffers.reduce((a, b) => a + b, 0) * 0.1 + s.known.length * 0.05;
  return (won(s) ? 10000 : 0) - (s.heroProgress >= 7 ? 10000 : 0) - s.heroProgress * 10
    + s.walls.reduce((a, b) => a + b, 0) * 0.5 + s.known.length * 0.05;
}
function planned(s: State): Action {
  let beam: { s: State; first: Action; value: number }[] = actions(s).map(a => ({ s: step(s, a), first: a, value: score(step(s, a)) }));
  // Depth four, beam 18, known deterministic model; not a fair blind AI result.
  for (let depth = 1; depth < 4; depth++) {
    const children: typeof beam = [];
    for (const node of beam.sort((a, b) => b.value - a.value).slice(0, 18)) {
      if (terminal(node.s)) children.push(node);
      else for (const a of actions(node.s)) { const next = step(node.s, a); children.push({ s: next, first: node.first, value: score(next) }); }
    }
    beam = children;
  }
  return beam.sort((a, b) => b.value - a.value)[0]?.first ?? { type: 'wait' };
}
function greedy(s: State): Action {
  return actions(s).map(a => ({ a, score: score(step(s, a)) })).sort((a, b) => b.score - a.score)[0].a;
}
function goalDirected(s: State): Action {
  const legal = actions(s);
  if (s.kind === 'hero') {
    for (const concept of ['mud', 'roots', 'brick', 'gate']) {
      const discovery = legal.find(a => a.type === 'discover' && a.concept === concept);
      if (discovery) return discovery;
    }
    return legal.find(a => a.type === 'deploy' && a.concept === 'gate') ?? greedy(s);
  }
  // Simple goal policy: establish permanent drainage across all three lanes.
  if (!s.known.includes('roots')) return legal.find(a => a.type === 'discover' && a.concept === 'roots') ?? greedy(s);
  const endangered = s.water.map((water, lane) => ({ lane, water: water + (pulse(s).lane === lane ? pulse(s).amount : 0) }))
    .filter(x => s.drains[x.lane] < 1).sort((a, b) => b.water - a.water)[0];
  if (endangered) return { type: 'deploy', concept: 'roots', lane: endangered.lane };
  return greedy(s);
}
function random(seed: number) { let x = seed + 1; return () => { x = Math.imul(x, 1664525) + 1013904223 | 0; return (x >>> 0) / 4294967296; }; }
function run(kind: Kind, seed: number, policy: string, opening?: Action) {
  let s = initial(kind, seed); const rng = random(seed * 31 + 8); const trace: { turn: number; action: Action; water: number[]; damage: number[]; hero: number; lane: number }[] = [];
  while (!terminal(s)) {
    const legal = actions(s);
    const a = s.turn === 0 && opening ? opening : policy === 'random' ? legal[Math.floor(rng() * legal.length)] : policy === 'greedy' ? greedy(s) : policy === 'goal' ? goalDirected(s) : planned(s);
    s = step(s, a); trace.push({ turn: s.turn, action: a, water: s.water, damage: s.damage, hero: s.heroProgress, lane: s.heroLane });
  }
  const repeats = trace.filter((x, i) => i > 0 && JSON.stringify(x.action) === JSON.stringify(trace[i - 1].action)).length;
  return { kind, seed, policy, win: won(s), turns: s.turn, damage: s.damage.reduce((a, b) => a + b, 0), discoveries: s.known.length - 4, repeats, trace };
}
const runs = (['flood', 'hero'] as Kind[]).flatMap(kind => ['random', 'greedy', 'goal', 'planning'].flatMap(policy => Array.from({ length: 12 }, (_, i) => run(kind, i + 1, policy))));
const summary = (['flood', 'hero'] as Kind[]).flatMap(kind => ['random', 'greedy', 'goal', 'planning'].map(policy => {
  const selected = runs.filter(r => r.kind === kind && r.policy === policy);
  return { kind, policy, wins: selected.filter(r => r.win).length, n: selected.length,
    meanTurns: selected.reduce((n, r) => n + r.turns, 0) / selected.length,
    meanDiscoveries: selected.reduce((n, r) => n + r.discoveries, 0) / selected.length,
    meanAdjacentRepeats: selected.reduce((n, r) => n + r.repeats, 0) / selected.length };
}));
const branches = (['flood', 'hero'] as Kind[]).map(kind => ({ kind, seed: 4, alternatives: [
  run(kind, 4, 'planning', { type: 'discover', concept: 'mud' }),
  run(kind, 4, 'planning', { type: 'discover', concept: 'roots' }),
] }));
console.log(JSON.stringify({ experiment: 'candidate-screen-v1', seeds: Array.from({ length: 12 }, (_, i) => i + 1),
  condition: 'Model-informed mechanical policies. Two different rule sets: exploratory comparison, no causal or enjoyment conclusion.',
  summary, branches }, null, 2));
