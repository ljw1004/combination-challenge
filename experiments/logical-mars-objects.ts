import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Independent whole-object toy, not Mars survival physics. No import-time effects. */
export const MARS_OBJECTS_VERSION = 'mars-objects-1';
export const MARS_OBJECTS_SCENARIO_IDS = ['garden', 'signal'] as const;
export type Scenario = typeof MARS_OBJECTS_SCENARIO_IDS[number];
export type Skin = 'clear' | 'reflective';
export type Direction = 'north' | 'east' | 'south' | 'west';
const BASE = ['frame', 'clear-sheet', 'reflective-cover', 'solar-panel', 'cable', 'lamp'] as const;
export const MARS_OBJECTS_RECIPES = [
  { a: 'frame', b: 'clear-sheet', result: 'clear-shell', effect: 'A complete transmitting enclosure.' },
  { a: 'frame', b: 'reflective-cover', result: 'reflective-shell', effect: 'A complete opaque enclosure; its fixed shape reflects east-going sun north.' },
  { a: 'solar-panel', b: 'cable', result: 'solar-lead', effect: 'An exterior panel and connected cable, with no lamp yet.' },
  { a: 'solar-lead', b: 'lamp', result: 'solar-lamp', effect: 'A lamp connected to that exterior solar source.' },
  { a: 'clear-shell', b: 'solar-lamp', result: 'lit-clear-shell', effect: 'The same clear enclosure containing the lamp, with panel outside and cable through a sealed fitting.' },
  { a: 'reflective-shell', b: 'solar-lamp', result: 'lit-reflective-shell', effect: 'The same opaque enclosure containing the lamp, with panel outside and cable through a sealed fitting.' },
] as const;
export type Concept = typeof BASE[number] | typeof MARS_OBJECTS_RECIPES[number]['result'];
const ALL: Concept[] = [...BASE, ...MARS_OBJECTS_RECIPES.map(r => r.result)];
export interface Assembly {
  id: string;
  builtFrom: Concept;
  shell?: { frame: true; layers: Skin[] };
  power?: { panel: true; cable: true; lamp: boolean; sourceLayers: Skin[] };
}
export interface Ray { source: string; direction: Direction; path: string[] }
export type Action = { type: 'combine'; a: string; b: string };
export interface State {
  version: string;
  scenarioId: Scenario;
  catalogue: 'ordinary' | 'complete' | 'carryover';
  known: Concept[];
  installations: Assembly[];
  combines: number;
  observer: { campLocated: boolean; firstReception?: { combine: number; rays: Ray[] } };
  status: 'playing' | 'won';
  accepted: boolean;
  response: string[];
}
export interface CreateOptions { catalogue?: 'ordinary' | 'complete'; known?: Concept[] }
const clone = <T>(x: T): T => structuredClone(x);
const samePair = (action: Action, a: string, b: string) =>
  (action.a === a && action.b === b) || (action.a === b && action.b === a);
const assemblyConcept = (id: string) => MARS_OBJECTS_RECIPES.some(r => r.result === id);

function structure(concept: Concept, id: string): Assembly {
  const assembly: Assembly = { id, builtFrom: concept };
  if (concept.includes('shell')) assembly.shell = { frame: true, layers: [concept.includes('reflective') ? 'reflective' : 'clear'] };
  if (concept === 'solar-lead' || concept === 'solar-lamp' || concept.startsWith('lit-'))
    assembly.power = { panel: true, cable: true, lamp: concept !== 'solar-lead', sourceLayers: [] };
  return assembly;
}

export function marsObjectsWorld(state: State) {
  const shells = state.installations.filter(a => a.shell);
  const reflective = shells.some(a => a.shell!.layers.includes('reflective'));
  const power = state.installations.filter(a => a.power).map(a => ({
    installation: a.id,
    source: `solar:${a.id}`,
    panelLit: !a.power!.sourceLayers.includes('reflective'),
    cableConnected: a.power!.cable,
    lampAttached: a.power!.lamp,
    lampLit: a.power!.lamp && a.power!.cable && !a.power!.sourceLayers.includes('reflective'),
  }));
  const interiorSources = [
    ...(!reflective ? ['sun'] : []),
    ...power.filter(p => p.lampLit).map(p => `lamp:${p.installation}`),
  ];
  const rays: Ray[] = [{ source: 'sun', direction: reflective ? 'north' : 'east',
    path: reflective ? ['sun enters from west', 'reflective shell turns light north'] : ['sun enters from west', 'open or transmitting camp', 'light exits east'] }];
  if (!reflective) for (const p of power.filter(p => p.lampLit)) for (const direction of ['north', 'east', 'south', 'west'] as Direction[])
    rays.push({ source: `lamp:${p.installation}`, direction, path: [p.source, 'actual panel is lit', 'cable', 'interior lamp', 'open or transmitting camp'] });
  const received = rays.filter(ray => ray.direction === 'north');
  return {
    sun: { direction: 'east', entersFrom: 'west', lit: true },
    camp: { designatedTray: true, enclosed: shells.length > 0, boundaryTransmits: !reflective,
      interiorSources, illuminated: interiorSources.length > 0 },
    power, rays,
    observer: { direction: 'north', receiving: received.length > 0, received,
      state: state.observer.campLocated ? 'camp-located' : 'searching', ...clone(state.observer) },
  };
}

function settle(state: State): void {
  const world = marsObjectsWorld(state);
  if (!state.observer.campLocated && world.observer.receiving) {
    state.observer.campLocated = true;
    state.observer.firstReception = { combine: state.combines, rays: clone(world.observer.received) };
  }
  state.status = (state.scenarioId === 'garden'
    ? world.camp.enclosed && world.camp.illuminated
    : state.observer.campLocated) ? 'won' : 'playing';
}

export function createMarsObjects(id: string = 'garden', options: CreateOptions = {}): State {
  if (!MARS_OBJECTS_SCENARIO_IDS.includes(id as Scenario)) throw new Error(`Unknown Mars Objects scenario: ${id}`);
  if (options.known?.some(c => !ALL.includes(c))) throw new Error('Unknown carried concept.');
  const known = options.catalogue === 'complete' ? [...ALL] : [...new Set<Concept>([...BASE, ...(options.known ?? [])])];
  const state: State = { version: MARS_OBJECTS_VERSION, scenarioId: id as Scenario,
    catalogue: options.catalogue === 'complete' ? 'complete' : options.known ? 'carryover' : 'ordinary',
    known, installations: [], combines: 0, observer: { campLocated: false }, status: 'playing', accepted: true,
    response: ['The camp is open to sunlight. The northern observer is searching.'] };
  settle(state); return state;
}

export function legalMarsObjectsActions(state: State): Action[] {
  const actions: Action[] = [];
  const add = (a: string, b: string) => actions.push({ type: 'combine', a, b });
  for (const r of MARS_OBJECTS_RECIPES) if (state.known.includes(r.a) && state.known.includes(r.b) && !state.known.includes(r.result)) add(r.a, r.b);
  for (const c of state.known) if (assemblyConcept(c)) add(c, 'world:camp');
  for (const a of state.installations) {
    if (a.power && !a.power.lamp) add('lamp', `world:lead:${a.id}`);
    for (const [concept, skin] of [['clear-sheet', 'clear'], ['reflective-cover', 'reflective']] as const) {
      if (a.shell && !a.shell.layers.includes(skin)) add(concept, `world:shell:${a.id}`);
      if (a.power && !a.power.sourceLayers.includes(skin)) add(concept, `world:solar:${a.id}`);
    }
  }
  return actions;
}

export function stepMarsObjects(before: State, input: unknown): State {
  if (before.version !== MARS_OBJECTS_VERSION) throw new Error('Different Mars Objects model version.');
  const state = clone(before);
  const invalid = () => { state.accepted = false; state.response = ['Not a currently legal combination. Inspect all public partners and results.']; return state; };
  if (!input || typeof input !== 'object' || Array.isArray(input)) return invalid();
  const raw = input as Record<string, unknown>;
  if (raw.type !== 'combine' || typeof raw.a !== 'string' || typeof raw.b !== 'string' || Object.keys(raw).some(k => !['type', 'a', 'b'].includes(k))) return invalid();
  const action = raw as Action;
  const legal = legalMarsObjectsActions(before).find(a => samePair(action, a.a, a.b));
  if (!legal) return invalid();
  state.accepted = true; state.combines += 1;
  const recipe = MARS_OBJECTS_RECIPES.find(r => samePair(action, r.a, r.b));
  if (recipe) {
    state.known.push(recipe.result); state.response = [`${recipe.a} + ${recipe.b} → ${recipe.result}. ${recipe.effect}`];
  } else if (legal.b === 'world:camp') {
    const a = structure(legal.a as Concept, String(state.installations.length + 1));
    state.installations.push(a); state.response = [`Joined ${legal.a} to the camp as installation ${a.id}; its constituent structure is retained.`];
  } else {
    const [, target, id] = legal.b.split(':');
    const a = state.installations.find(a => a.id === id)!;
    if (target === 'lead') {
      a.power!.lamp = true;
      if (!state.known.includes('solar-lamp')) state.known.push('solar-lamp');
      state.response = [`Connected lamp to installation ${id}'s actual panel and cable.`];
    } else {
      const skin: Skin = legal.a === 'clear-sheet' ? 'clear' : 'reflective';
      if (target === 'shell') a.shell!.layers.push(skin); else a.power!.sourceLayers.push(skin);
      state.response = [`Added ${skin} layer to ${target} of installation ${id}; existing layers remain.`];
    }
  }
  settle(state); return state;
}

export function previewMarsObjects(state: State, action: unknown) {
  const next = stepMarsObjects(state, action);
  return { accepted: next.accepted, newConcepts: next.known.filter(c => !state.known.includes(c)),
    installations: clone(next.installations), world: marsObjectsWorld(next), status: next.status, response: [...next.response] };
}

export function observeMarsObjects(state: State) {
  const legal = legalMarsObjectsActions(state);
  return { version: state.version, scenarioId: state.scenarioId, catalogue: state.catalogue, status: state.status,
    goal: state.scenarioId === 'garden' ? 'Enclose the designated tray and illuminate it with an actual source.' : 'Let the northern observer receive camp light and locate the camp.',
    known: [...state.known], allConcepts: [...ALL], recipes: clone(MARS_OBJECTS_RECIPES), installations: clone(state.installations),
    world: marsObjectsWorld(state), combines: state.combines, accepted: state.accepted, response: [...state.response],
    rules: [
      'This is a toy, not real Mars safety advice. There are no inventories, action limits, power budgets, hidden recipes or timers.',
      'All concepts are inexhaustible. Combining named concepts establishes a reusable structured blueprint; both parents stay known. Installing it creates fresh component instances, not transferred identities from earlier installations.',
      'Sunlight travels west to east. A clear shell encloses and transmits. Any reflective shell layer blocks transmission and redirects this sunlight north, using the fixed frame geometry.',
      'All installed shells enclose the same designated camp and nest as layers. All lamps are inside all shells. At least one shell makes the toy enclosure; no air, temperature or biology is simulated.',
      'Solar panels stay outside all camp shells. Their individual covers determine exposure. Each cable includes a sealed fitting. An uncovered/clear-covered panel powers only its connected lamp; power has no quantity or storage.',
      'A powered interior lamp illuminates the tray. Its light also exits north/east/south/west if every shell layer transmits; any reflective layer blocks outward lamp light.',
      'The northern observer receives northward rays and permanently remembers locating the camp. Current reception can later stop. This same receiver policy runs on both boards.',
      'Known composite + world:camp installs a fresh actual copy without repeating its prerequisites. This places a known whole object; it does not show that the player synthesized its internal construction. Arbitrarily many copies remain legal.',
      'Lamp + world:lead:ID connects a lamp to that installed lead. Clear sheet/reflective cover + world:shell:ID adds a boundary layer; + world:solar:ID covers that specific panel.',
      'Existing layers remain: a clear sheet does not remove an opaque cover. An identical added layer on the same target has no new modeled effect and is not reoffered; new copies remain unlimited.',
      'All legal actions and their exact results are public. Invalid actions do not alter construction or knowledge. Success does not prohibit further combinations.',
    ], actionSchema: { type: 'combine', a: 'known concept or world operand', b: 'known concept or world operand; either order' },
    legalActions: legal, previews: legal.map(action => ({ action, ...previewMarsObjects(state, action) })) };
}

export function replayMarsObjects(actions: Action[], id: Scenario = 'garden', options: CreateOptions = {}): State {
  return actions.reduce((state, action) => stepMarsObjects(state, action), createMarsObjects(id, options));
}
const combine = (a: string, b: string): Action => ({ type: 'combine', a, b });
export function marsObjectsWitnesses() {
  const clear = combine('frame', 'clear-sheet'), reflective = combine('frame', 'reflective-cover');
  const lead = combine('solar-panel', 'cable'), lamp = combine('solar-lead', 'lamp');
  const universal = [clear, lead, lamp, combine('clear-shell', 'solar-lamp'), combine('lit-clear-shell', 'world:camp')];
  return {
    daylightGarden: [clear, combine('clear-shell', 'world:camp')],
    reflectedSignal: [reflective, combine('reflective-shell', 'world:camp')],
    poweredGarden: [reflective, lead, lamp, combine('reflective-shell', 'solar-lamp'), combine('lit-reflective-shell', 'world:camp')],
    lampSignal: [lead, lamp, combine('solar-lamp', 'world:camp')],
    universal,
    repurpose: [clear, combine('clear-shell', 'world:camp'), combine('reflective-cover', 'world:shell:1'), lead, lamp, combine('solar-lamp', 'world:camp')],
    buildEverything: [...MARS_OBJECTS_RECIPES.map(r => combine(r.a, r.b)), ...MARS_OBJECTS_RECIPES.map(r => combine(r.result, 'world:camp'))],
  };
}

export function runMarsObjectsScreen() {
  const traces = [];
  let checkedPreviews = 0;
  for (const scenario of MARS_OBJECTS_SCENARIO_IDS) for (const [name, actions] of Object.entries(marsObjectsWitnesses())) {
    let state = createMarsObjects(scenario);
    const frames = [{ action: null as Action | null, state: clone(state), world: marsObjectsWorld(state) }];
    for (const action of actions) {
      for (const legal of legalMarsObjectsActions(state)) {
        const preview = previewMarsObjects(state, legal), next = stepMarsObjects(state, legal);
        if (JSON.stringify(preview.world) !== JSON.stringify(marsObjectsWorld(next)) || preview.status !== next.status || !preview.accepted) throw new Error('Untruthful preview.');
        checkedPreviews++;
      }
      state = stepMarsObjects(state, action);
      if (!state.accepted) throw new Error(`Illegal witness ${name}`);
      frames.push({ action, state: clone(state), world: marsObjectsWorld(state) });
    }
    const replay = replayMarsObjects(actions, scenario);
    if (JSON.stringify(replay) !== JSON.stringify(state)) throw new Error('Replay mismatch.');
    traces.push({ scenario, name, actions, combines: actions.length, firstSuccess: frames.find(f => f.state.status === 'won')?.state.combines ?? null,
      status: state.status, world: marsObjectsWorld(state), frames, exactReplay: true });
  }
  return { version: MARS_OBJECTS_VERSION, evidence: 'Privileged deterministic mechanical screen, not player enjoyment or blind play.', checkedPreviews, traces,
    conclusion: 'Tailored shells have distinct functional consequences. The same five-combine lit clear enclosure and twelve-combine build-everything policy solve both goals. This permits a bounded purposeful-enactment test, not a claim of sustained strategic tension.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const screen = runMarsObjectsScreen();
  mkdirSync('results/mars-objects-preplay', { recursive: true });
  writeFileSync('results/mars-objects-preplay/mechanical-screen.json', JSON.stringify(screen, null, 2));
  console.log(JSON.stringify({ version: screen.version, checkedPreviews: screen.checkedPreviews,
    traces: screen.traces.map(({ scenario, name, combines, firstSuccess, status }) => ({ scenario, name, combines, firstSuccess, status })) }, null, 2));
}
