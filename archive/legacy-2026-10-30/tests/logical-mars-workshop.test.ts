import test from 'node:test';
import assert from 'node:assert/strict';
import {
  catalogueMarsWorkshop, createMarsWorkshop, inspectMarsWorkshop, marsWorkshopGoals,
  marsWorkshopWorld, observeMarsWorkshop, partnersMarsWorkshop, previewMarsWorkshop,
  replayMarsWorkshop, selectMarsWorkshop, stepMarsWorkshop, undoMarsWorkshop,
} from '../experiments/logical-mars-workshop.ts';
import { WORKSHOP_MAPS, WORKSHOP_PRIMITIVES, WORKSHOP_RECIPES } from '../experiments/mars-workshop-content.ts';
import { workshopWitness } from '../experiments/mars-workshop-screen.ts';
import type { Action, Assembly, CreateOptions, Part, State } from '../experiments/mars-workshop-types.ts';

// These are mechanical public-law regressions, not player sessions or a length/fun grade.
// In particular, no test demands the author's witness, all recipes, or 200 interventions.
const combine = (a: string, b: string, context?: Action['context']): Action =>
  ({ type: 'combine', a, b, ...(context ? { context } : {}) });
const board = (s: State, map = s.map) => s.boards.find(b => b.id === map)!;
const object = (s: State, id: string): Assembly => board(s).objects.find(o => o.id === id)!;
const allParts = (p: Part): Part[] => [p, ...p.children.flatMap(c => allParts(c.part))];
const geometry = (p: Part): unknown => ({
  kind: p.kind, label: p.label, pose: p.pose, facing: p.facing,
  children: p.children.map(c => ({ relation: c.relation, part: geometry(c.part) })),
});
const rowObject = (s: State, id: string, row = 0) => marsWorkshopWorld(s).rows[row].objects.find(o => o.id === id)!;
const goal = (s: State, id: string) => marsWorkshopGoals(s).find(g => g.id === id)!;

function apply(s: State, a: Action): State {
  const before = structuredClone(s), input = structuredClone(a);
  const preview = previewMarsWorkshop(s, a), next = stepMarsWorkshop(s, a);
  assert.deepEqual(s, before, 'step/preview must not mutate their input state');
  assert.deepEqual(a, input, 'step/preview must not mutate their action');
  assert.deepEqual(preview.state, next, 'preview is the exact transition, not an estimate');
  assert.deepEqual(preview.observation, observeMarsWorkshop(next));
  assert.equal(next.accepted, true, `${s.map}: ${JSON.stringify(a)}: ${next.response.join('; ')}`);
  assert.equal(next.interventions, s.interventions + 1);
  assert.equal(Object.values(next.ledger).reduce((a, b) => a + b, 0), next.interventions);
  return next;
}
function reject(s: State, a: unknown, reason?: RegExp): State {
  const before = structuredClone(s), input = structuredClone(a);
  const next = stepMarsWorkshop(s, a);
  assert.equal(next.accepted, false, `Expected atomic rejection: ${JSON.stringify(a)}`);
  if (reason) assert.match(next.response.join('; '), reason);
  assert.deepEqual(s, before);
  assert.deepEqual(a, input);
  assert.deepEqual({ ...next, accepted: s.accepted, response: s.response }, s,
    'rejection may change only accepted/response, not IDs, designs, counters, goals or physical state');
  assert.deepEqual(previewMarsWorkshop(s, a).state, next);
  return next;
}
function rig(map = 'landing', options: CreateOptions = { catalogue: 'complete' }) {
  let state = selectMarsWorkshop(createMarsWorkshop(options), map);
  return {
    get state() { return state; },
    act(a: string, b: string, context?: Action['context']) { state = apply(state, combine(a, b, context)); },
    place(design: string, place: string) {
      const ids = new Set(board(state).objects.map(o => o.id));
      state = apply(state, combine(design, `place:${place}`));
      return board(state).objects.find(o => !ids.has(o.id))!.id;
    },
    self(id: string, operation: 'aim' | 'fold' | 'open' | 'close', direction?: 'east' | 'west' | 'north' | 'south', part?: string) {
      state = apply(state, combine(id, id, { operation, ...(direction ? { direction } : {}), ...(part ? { part } : {}) }));
    },
    connect(a: string, b: string, channel: 'power' | 'water' | 'light') {
      state = apply(state, combine(a, b, { operation: 'connect', channel }));
    },
    event(id: string, place: string, operation: 'observe' | 'transmit' | 'sample' | 'span') {
      state = apply(state, combine(id, `place:${place}`, { operation }));
    },
  };
}

test('workshop: all six maps, twelve exact goal cards, rows and initial objects are public at zero interventions', () => {
  const s = createMarsWorkshop(), original = structuredClone(s), view = observeMarsWorkshop(s);
  assert.equal(WORKSHOP_PRIMITIVES.length, 15);
  assert.equal(WORKSHOP_RECIPES.length, 27);
  assert.equal(s.known.length, 18, 'supplied greenhouse, camera and sample-case are reusable capabilities');
  assert.equal(createMarsWorkshop({ catalogue: 'complete' }).known.length, 42);
  assert.equal(view.campaign.length, 6);
  assert.equal(view.campaign.flatMap(m => m.goals).length, 12);
  const actualIds: string[] = [];
  for (const m of WORKSHOP_MAPS) {
    const selected = selectMarsWorkshop(s, m.id), inspected = inspectMarsWorkshop(selected);
    assert.ok('map' in inspected);
    assert.deepEqual(inspected.map, m);
    assert.equal(selected.interventions, 0);
    assert.deepEqual(selected.boards, s.boards);
    assert.deepEqual(marsWorkshopWorld(selected).rows.map(r => r.id), m.phases.map(r => r.id));
    const goals = marsWorkshopGoals(selected);
    assert.deepEqual(goals.map(g => g.id), m.goals.map(g => g.id));
    assert.ok(goals.every(g => g.requirement && Object.keys(g.checks).length && !g.current && !g.achieved));
    assert.ok(goals.every(g => !('unimplemented goal' in g.checks)));
    assert.deepEqual(board(selected).objects.map(o => o.initialKey), m.initial.map(o => o.key));
    for (const o of board(selected).objects) {
      actualIds.push(o.id, ...allParts(o.root).map(p => p.id), ...o.records.map(r => r.id));
      assert.ok(selected.known.includes(o.design));
      assert.ok(o.records.every(r => r.camera === o.id && r.intervention === 0 && r.source.length));
    }
  }
  assert.equal(new Set(actualIds).size, actualIds.length);
  assert.deepEqual(s, original);
});

test('workshop: every canonical combination retains its actual tree; known concepts are inexhaustible', () => {
  let s = createMarsWorkshop({ catalogue: 'complete' });
  for (const recipe of WORKSHOP_RECIPES) {
    // Reversed operands must use the same declared canonical containment, not swap the container.
    s = apply(s, combine(recipe.b, recipe.a));
    const made = board(s).objects.at(-1)!, inspected = inspectMarsWorkshop(s, recipe.result);
    assert.ok('root' in inspected);
    assert.equal(made.design, recipe.result);
    assert.deepEqual(geometry(made.root), geometry(inspected.root!));
    assert.ok(s.known.includes(recipe.a) && s.known.includes(recipe.b) && s.known.includes(recipe.result));
  }
  const known = [...s.known];
  s = apply(s, combine('greenhouse', 'place:camp'));
  const first = board(s).objects.at(-1)!;
  s = apply(s, combine('greenhouse', 'place:camp'));
  const second = board(s).objects.at(-1)!;
  assert.deepEqual(s.known, known);
  assert.deepEqual(geometry(first.root), geometry(second.root));
  assert.ok(allParts(first.root).every(p => !allParts(second.root).some(q => q.id === p.id)));
});

test('workshop: generic assembly/inside eligibility and low-place fit are uniform across construction routes', () => {
  const r = rig('arch');
  reject(r.state, combine('lamp', 'seed', { operation: 'inside' }), /supported covering/);
  const tray = r.place('tray', 'start');
  reject(r.state, combine(tray, 'seed', { operation: 'inside' }), /supported covering/);
  reject(r.state, combine('greenhouse', 'place:low-west'), /fit/);
  reject(r.state, combine('rootbed', 'clear-shell', { at: 'low-west' }), /fit/);
  const plate = r.place('record-plate', 'low-west');
  reject(r.state, combine(plate, 'greenhouse'), /fit/);
  const shell = r.place('clear-shell', 'start');
  r.act(shell, 'seed', { operation: 'inside' });
  assert.equal(rowObject(r.state, shell).parts.find(p => p.kind === 'seed')!.enclosed, true);
  r.act('mesh-screen', 'sample-tray', { operation: 'inside', at: 'start' });
  const screened = board(r.state).objects.at(-1)!;
  assert.equal(rowObject(r.state, screened.id).dustProtected, true);
  assert.equal(rowObject(r.state, screened.id).enclosed, false, 'mesh is a supported dust boundary, not a sealed enclosure');
  const frame = r.place('folding-frame', 'start');
  r.self(frame, 'fold');
  reject(r.state, combine(frame, 'place:low-west'), /frame plus wheels/);
  r.act(frame, 'wheels');
  r.act(frame, 'place:low-west');
  reject(r.state, combine(frame, frame, { operation: 'close' }), /fit/);
  const foldedCopy = r.place(object(r.state, frame).design, 'low-east');
  assert.equal(rowObject(r.state, foldedCopy).shape.folded, true);
});

test('workshop: containment shades the actual cell, not adjacent objects or exterior panels', () => {
  const r = rig(), shell = r.place('clear-shell', 'ridge');
  r.act(shell, 'solar-lamp', { operation: 'inside' });
  const neighbor = r.place('solar-lamp', 'ridge');
  assert.deepEqual(rowObject(r.state, shell).power, ['sun:day:ridge']);
  r.act(shell, 'foil');
  assert.deepEqual(rowObject(r.state, shell).power, []);
  assert.equal(rowObject(r.state, shell).parts.find(p => p.kind === 'lamp')!.lit, false);
  assert.deepEqual(rowObject(r.state, shell).light, ['sun:day:ridge'], 'the exposed foil can still reflect real sunlight');
  assert.deepEqual(rowObject(r.state, neighbor).power, ['sun:day:ridge']);
  assert.ok(rowObject(r.state, neighbor).light.length);
  r.act(shell, 'solar-lead', { operation: 'outside' });
  assert.deepEqual(rowObject(r.state, shell).power, ['sun:day:ridge']);
  assert.equal(rowObject(r.state, shell).parts.find(p => p.kind === 'lamp')!.lit, true);
  assert.ok(rowObject(r.state, shell).parts.some(p => p.kind === 'solar-cell' && p.lit && !p.enclosed));
});

test('workshop: water, warmth and growth depend on real sources and disclosed purification, not result labels', () => {
  const r = rig('ice'), source = r.place('solar-heater', 'dirty-ice');
  r.act(source, 'tube');
  assert.equal(rowObject(r.state, source).warm, true);
  assert.equal(rowObject(r.state, source).water, 'dirty');
  const garden = r.place('greenhouse', 'bed');
  r.act(garden, 'lamp');
  r.connect(source, garden, 'power');
  r.connect(source, garden, 'water');
  assert.equal(rowObject(r.state, garden).growing, false);
  assert.equal(rowObject(r.state, garden).water, 'dirty');
  const filter = r.place('filtered-passage', 'ledge');
  r.connect(source, filter, 'water');
  assert.equal(rowObject(r.state, filter).water, 'clean');
  assert.deepEqual(rowObject(r.state, filter).waterSources, ['water:dirty-ice']);
  // A second clean source does not silently erase an existing dirty contact.
  r.connect(filter, garden, 'water');
  assert.equal(rowObject(r.state, garden).water, 'dirty');
  const cleanGarden = r.place('greenhouse', 'bed');
  r.act(cleanGarden, 'lamp');
  r.connect(source, cleanGarden, 'power');
  r.connect(filter, cleanGarden, 'water');
  assert.equal(rowObject(r.state, cleanGarden).growing, true);
  assert.deepEqual(rowObject(r.state, cleanGarden).waterSources, ['water:dirty-ice']);
  assert.equal(goal(r.state, 'still').current, true);
  const darkHeater = r.place('solar-heater', 'bed');
  assert.equal(rowObject(r.state, darkHeater).warm, false);
  assert.equal(rowObject(r.state, darkHeater).water, 'none');
});

test('workshop: no solar/lamp feedback loop creates light or power without an environmental source', () => {
  const r = rig(), a = r.place('solar-lamp', 'bed'), b = r.place('solar-lamp', 'bed');
  for (const [from, to] of [[a, b], [b, a]]) {
    r.connect(from, to, 'power');
    r.connect(from, to, 'light');
  }
  for (const id of [a, b]) {
    assert.deepEqual(rowObject(r.state, id).power, []);
    assert.deepEqual(rowObject(r.state, id).light, []);
    assert.ok(rowObject(r.state, id).parts.every(p => !p.lit && p.source.length === 0));
  }
  const source = r.place('solar-lead', 'ridge');
  r.connect(source, a, 'power');
  for (const id of [a, b]) {
    assert.deepEqual(rowObject(r.state, id).power, ['sun:day:ridge']);
    assert.deepEqual(rowObject(r.state, id).light, ['sun:day:ridge']);
  }
  // Cutting the actual source by aiming away recomputes the least fixed point from empty.
  r.self(source, 'aim', 'west');
  for (const id of [a, b]) assert.deepEqual([rowObject(r.state, id).power, rowObject(r.state, id).light], [[], []]);
});

test('workshop: the ice job requires a whole dry walking route, not merely dry endpoints', () => {
  const r = rig('ice'), source = r.place('solar-heater', 'clean-ice');
  r.act(source, 'tube');
  const garden = r.place('greenhouse', 'bed');
  r.act(garden, 'lamp'); r.connect(source, garden, 'power'); r.connect(source, garden, 'water');
  assert.equal(goal(r.state, 'still').current, true);
  const spill = r.place('tray', 'alcove');
  r.connect(source, spill, 'water');
  const places = marsWorkshopWorld(r.state).rows[0].places;
  assert.ok(places.filter(p => ['walk-start', 'walk-end'].includes(p.id)).every(p => !p.wet));
  assert.equal(places.find(p => p.id === 'alcove')!.wet, true);
  assert.equal(goal(r.state, 'still').checks['a complete dry walk connects walk-start to walk-end'], false);
  assert.equal(goal(r.state, 'still').current, false);
  assert.equal(goal(r.state, 'still').achieved, true);
  // Containing the water interface is legal; no prescribed purification recipe is required.
  r.act(spill, 'tube');
  assert.equal(goal(r.state, 'still').current, true);
});

test('workshop: parameterized part aiming changes only that actual part and its real row coverage', () => {
  const r = rig('dust'), source = r.place('solar-lead', 'ridge');
  r.act(source, 'solar-lead');
  const panels = allParts(object(r.state, source).root).filter(p => p.kind === 'solar-cell');
  assert.equal(panels.length, 2);
  assert.ok(marsWorkshopWorld(r.state).rows.filter(r => r.sun === 'west').every(row => row.objects.find(o => o.id === source)!.power.length === 0));
  r.self(source, 'aim', 'west', panels[0].id);
  const actualPanels = allParts(object(r.state, source).root).filter(p => p.kind === 'solar-cell');
  assert.deepEqual(actualPanels.map(p => [p.id, p.facing]), [[panels[0].id, 'west'], [panels[1].id, 'east']]);
  assert.equal(object(r.state, source).root.facing, 'east');
  assert.ok(marsWorkshopWorld(r.state).rows.every(row => row.objects.find(o => o.id === source)!.power.length > 0));
  reject(r.state, combine(source, source, { operation: 'aim', direction: 'north', part: 'missing' }), /Unknown actual part/);
});

test('workshop: one actual garden must work in every required row; past certificates do not fake current growth', () => {
  const r = rig('twin'), eastGarden = r.place('greenhouse', 'bed'), westGarden = r.place('greenhouse', 'bed');
  r.act(eastGarden, 'lamp'); r.act(westGarden, 'lamp');
  const east = r.place('solar-lead', 'east-ridge'), west = r.place('solar-lead', 'west-ridge');
  r.self(west, 'aim', 'west');
  r.connect(east, eastGarden, 'power'); r.connect(west, westGarden, 'power');
  assert.ok(marsWorkshopWorld(r.state).rows.every(row => row.objects.some(o => o.growing)));
  assert.equal(goal(r.state, 'two-skies').current, false, 'different one-row gardens do not certify one two-row garden');
  r.connect(west, eastGarden, 'power');
  assert.equal(goal(r.state, 'two-skies').current, true);
  const certificate = goal(r.state, 'two-skies').firstIntervention;
  r.act(eastGarden, 'foil');
  assert.equal(goal(r.state, 'two-skies').current, false);
  assert.equal(goal(r.state, 'two-skies').achieved, true);
  assert.equal(goal(r.state, 'two-skies').firstIntervention, certificate);
});

test('workshop: observations require visible illuminated subjects and disclose the actual light provenance', () => {
  const r = rig(), camera = r.place('camera', 'signal-perch');
  reject(r.state, combine(camera, 'place:bed', { operation: 'observe' }), /illuminated/);
  const lamp = r.place('lamp', 'bed'), source = r.place('solar-lead', 'ridge');
  r.connect(source, lamp, 'power');
  r.event(camera, 'bed', 'observe');
  const record = structuredClone(object(r.state, camera).records[0]);
  assert.equal(record.subject, 'place:bed');
  assert.equal(record.viewpoint, 'signal-perch');
  assert.equal(record.camera, camera);
  assert.deepEqual(record.source, ['sun:day:ridge']);
  r.event(camera, 'receiver', 'transmit');
  assert.deepEqual(board(r.state).received, [record]);
  reject(r.state, combine(camera, 'place:bed', { operation: 'observe' }), /already/);
  reject(r.state, combine(camera, 'place:receiver', { operation: 'transmit' }), /already/);
  r.place('reflective-shell', 'bed');
  const farCamera = r.place('camera', 'ridge');
  reject(r.state, combine(farCamera, 'place:receiver', { operation: 'observe' }), /unobstructed/);
});

test('workshop: one moved camera can record both viewpoints; saved copies cannot inherit observations', () => {
  const r = rig('twin'), camera = r.place('clear-shell', 'west-view');
  r.act(camera, 'camera', { operation: 'inside' }); r.act(camera, 'wheels');
  r.event(camera, 'landmark', 'observe');
  const originalRecords = structuredClone(object(r.state, camera).records);
  assert.equal(originalRecords.length, 2, 'both public rows are certified automatically in one combine');
  const copy = r.place(object(r.state, camera).design, 'east-view');
  assert.deepEqual(object(r.state, copy).records, []);
  r.act(camera, 'place:east-view');
  r.event(camera, 'landmark', 'observe');
  assert.equal(object(r.state, camera).records.length, 4);
  assert.deepEqual(object(r.state, camera).records.slice(0, 2), originalRecords);
  r.act(camera, 'place:alcove');
  assert.equal(goal(r.state, 'viewpoints').current, true);
  assert.deepEqual([...new Set(object(r.state, camera).records.map(e => e.viewpoint))], ['west-view', 'east-view']);
});

test('workshop: actual sample contact stays with its support, not a colocated object or copied design', () => {
  const r = rig('ice'), dry = r.place('sample-tray', 'table'), neighbor = r.place('sample-tray', 'table');
  reject(r.state, combine(dry, 'place:alcove', { operation: 'sample' }), /actual contact/);
  r.event(dry, 'table', 'sample');
  assert.deepEqual(object(r.state, dry).samples, ['table']);
  assert.deepEqual(object(r.state, neighbor).samples, []);
  const copy = r.place(object(r.state, dry).design, 'table');
  assert.deepEqual(object(r.state, copy).samples, []);
  const dark = r.place('sample-case', 'alcove');
  assert.equal(goal(r.state, 'preservation').current, false);
  r.event(dark, 'alcove', 'sample');
  assert.equal(goal(r.state, 'preservation').current, true);
  r.act(dark, 'wheels'); r.act(dark, 'place:table');
  assert.deepEqual(object(r.state, dark).samples, ['alcove']);
  assert.equal(goal(r.state, 'preservation').current, false);
});

test('workshop: saved assemblies copy exact arrangement/pose/facing but not identity, provenance, history or external links', () => {
  const r = rig('twin'), camera = r.place('clear-shell', 'west-view');
  r.act(camera, 'camera', { operation: 'inside' }); r.act(camera, 'wheels'); r.act(camera, 'hinge');
  r.event(camera, 'landmark', 'observe');
  r.self(camera, 'aim', 'west'); r.self(camera, 'fold');
  const source = r.place('solar-lead', 'west-ridge');
  r.connect(source, camera, 'power');
  const donor = structuredClone(object(r.state, camera)), copy = r.place(donor.design, 'east-view');
  const copied = object(r.state, copy);
  assert.deepEqual(geometry(copied.root), geometry(donor.root));
  assert.notEqual(copy, camera);
  assert.ok(allParts(copied.root).every(p => !allParts(donor.root).some(q => q.id === p.id)));
  assert.deepEqual(copied.records, []); assert.deepEqual(copied.samples, []);
  assert.deepEqual(copied.history, { places: ['east-view'], spanned: [] });
  assert.equal(copied.initialKey, undefined); assert.equal(copied.members, undefined);
  assert.ok(board(r.state).connections.every(c => c.a !== copy && c.b !== copy));
  r.act(camera, 'place:east-view');
  assert.ok(board(r.state).connections.every(c => c.a !== camera && c.b !== camera));
  assert.deepEqual(object(r.state, camera).records, donor.records);
});

test('workshop: carry requires the supplied actual garden, including when it is merged as the guest', () => {
  const r = rig('arch'), garden = board(r.state).objects.find(o => o.initialKey === 'garden')!;
  const rootIds = allParts(garden.root).map(p => p.id);
  r.place('greenhouse', 'destination');
  assert.equal(goal(r.state, 'carry').current, false, 'a growing copy at destination is not the initial garden');
  const host = r.place('cart', 'start');
  r.act(host, garden.id);
  assert.ok(object(r.state, host).members!.some(m => m.id === garden.id && m.initialKey === 'garden'));
  assert.ok(rootIds.every(id => allParts(object(r.state, host).root).some(p => p.id === id)));
  r.act(garden.id, 'hinge'); // member aliases still address the actual merged construction
  r.self(host, 'fold'); r.act(host, 'place:destination'); r.self(host, 'close');
  assert.equal(goal(r.state, 'carry').current, true);
  assert.ok(rootIds.every(id => allParts(object(r.state, host).root).some(p => p.id === id)));
});

test('workshop: deploy/recover checks actual post-span low-route history and a physically remaining span', () => {
  const r = rig('arch'), cart = r.place('cart', 'gap-west');
  r.act(cart, 'hinge'); r.event(cart, 'gap-east', 'span');
  const spare = r.place('frame', 'gap-west'); r.event(spare, 'gap-east', 'span');
  // Crossing directly is legal, but it does not satisfy the separately public low-route requirement.
  r.act(cart, 'place:gap-east');
  assert.equal(goal(r.state, 'deploy-recover').current, false);
  r.self(cart, 'fold');
  r.act(cart, 'place:gap-west', { via: ['lower-east', 'lower-west'] });
  r.act(cart, 'place:gap-east', { via: ['lower-west', 'lower-east'] });
  assert.equal(goal(r.state, 'deploy-recover').current, true);
  assert.ok(object(r.state, cart).history.afterSpanPlaces!.includes('lower-west'));
  assert.ok(object(r.state, cart).history.afterSpanPlaces!.includes('lower-east'));
  assert.equal(board(r.state).spans.some(s => s.object === cart), false, 'movement removes the old physical span');
  r.act(spare, 'hinge'); r.self(spare, 'fold');
  assert.equal(goal(r.state, 'deploy-recover').current, false, 'folding the only remaining span removes its support');
  assert.equal(goal(r.state, 'deploy-recover').achieved, true);
  r.self(spare, 'close');
  assert.equal(goal(r.state, 'deploy-recover').current, true);
});

test('workshop: initial records relay with unchanged IDs; copying or merging never replaces the original instruments', () => {
  const r = rig('return'), initial = board(r.state).objects;
  const a = initial.find(o => o.initialKey === 'original-a')!, b = initial.find(o => o.initialKey === 'original-b')!;
  const stranded = initial.find(o => o.initialKey === 'stranded-camera')!;
  const historical = [a, b, stranded].flatMap(o => structuredClone(o.records));
  const empty = r.place('sample-case', 'original-a');
  assert.deepEqual(object(r.state, empty).records, []);
  const relay = r.place('camera', 'junction');
  for (const o of [a, b]) { r.act(o.id, 'lens'); r.act(o.id, relay, { operation: 'transmit' }); }
  r.event(relay, 'receiver', 'transmit');
  assert.equal(goal(r.state, 'messages').current, true);
  const host = r.place('cart', 'stranded'); r.act(host, stranded.id);
  r.act(host, 'place:dock'); r.event(host, 'receiver', 'transmit');
  assert.equal(goal(r.state, 'recovery').current, true);
  assert.deepEqual(board(r.state).received, historical);
  for (const o of [a, b]) assert.equal(object(r.state, o.id).place, o.place);
  assert.ok(object(r.state, host).members!.some(m => m.id === stranded.id && m.initialKey === 'stranded-camera'));
});

test('workshop: selecting and working on another map retains every inactive physical board and global learned designs', () => {
  let s = createMarsWorkshop();
  s = apply(s, combine('frame', 'clear-film'));
  const shell = board(s).objects.at(-1)!.id;
  s = apply(s, combine(shell, 'camera', { operation: 'inside' }));
  const savedDesign = object(s, shell).design, landing = structuredClone(board(s));
  s = selectMarsWorkshop(s, 'dust');
  const otherBoards = structuredClone(s.boards.filter(b => b.id !== 'dust'));
  s = apply(s, combine(savedDesign, 'place:window'));
  assert.deepEqual(s.boards.filter(b => b.id !== 'dust'), otherBoards);
  const count = s.interventions;
  s = selectMarsWorkshop(s, 'landing');
  assert.equal(s.interventions, count);
  assert.deepEqual(board(s), landing);
  assert.ok(s.known.includes(savedDesign));
});

test('workshop: undo restores physical state but retains all learned capabilities, selected map and identity floor', () => {
  const before = createMarsWorkshop();
  let current = apply(before, combine('frame', 'clear-film'));
  const shell = board(current).objects.at(-1)!.id;
  current = apply(current, combine(shell, 'camera', { operation: 'inside' }));
  const learned = object(current, shell).design;
  current = selectMarsWorkshop(current, 'twin');
  const prior = structuredClone(before), snapshot = structuredClone(current), undone = undoMarsWorkshop(before, current);
  assert.deepEqual(before, prior); assert.deepEqual(current, snapshot);
  assert.deepEqual(undone.boards, before.boards);
  assert.deepEqual(undone.ledger, before.ledger);
  assert.equal(undone.interventions, 0); assert.equal(undone.map, 'twin');
  assert.ok(current.known.every(k => undone.known.includes(k)));
  assert.ok(undone.designs.some(d => d.id === learned));
  assert.equal(undone.serial, current.serial);
  const copied = apply(undone, combine(learned, 'place:west-view'));
  const obj = board(copied).objects.at(-1)!;
  assert.ok(Number(obj.id.split(':')[1]) > current.serial);
  assert.deepEqual(geometry(obj.root), geometry(object(selectMarsWorkshop(current, 'landing'), shell).root));
});

test('workshop: malformed and late-failing actions reject atomically with exact deterministic previews', () => {
  const s = createMarsWorkshop({ catalogue: 'complete' });
  const malformed: unknown[] = [
    null, [], true, 42, 'combine', {}, { type: 'build', a: 'frame', b: 'foil' },
    { type: 'combine', a: '', b: 'foil' }, { type: 'combine', a: 'frame', b: 1 },
    { ...combine('frame', 'foil'), unexpected: true },
    ...[null, [], 'inside', { operation: 'teleport' }, { channel: 'magic' }, { direction: 'up' },
      { part: 4 }, { at: 4 }, { via: 'ridge' }, { via: [4] }, { unknown: 'field' }]
      .map(context => ({ ...combine('frame', 'foil'), context })),
    combine('unknown-concept', 'frame'), combine('greenhouse', 'place:missing'),
    combine('frame', 'foil', { at: 'missing' }),
  ];
  for (const a of malformed) {
    const rejected = reject(s, a);
    assert.deepEqual(stepMarsWorkshop(s, a), rejected);
  }
  const arch = selectMarsWorkshop(s, 'arch');
  reject(arch, combine('rootbed', 'clear-shell', { at: 'low-west' }), /fit/);
  assert.throws(() => selectMarsWorkshop(s, 'missing'), /Unknown map/);
  assert.throws(() => createMarsWorkshop({ known: ['not-a-design'] }), /Unknown carried concept/);
});

test('workshop: public queries disclose unknown recipes, generic operations, exact eligibility and source effects without mutation', () => {
  const s = createMarsWorkshop(), before = structuredClone(s), catalogue = catalogueMarsWorkshop(s);
  assert.equal(catalogue.recipes.length, 27);
  assert.equal(catalogue.recipes.find(r => r.result === 'lit-greenhouse')!.known, false);
  const partner = partnersMarsWorkshop(s, 'frame');
  assert.ok(partner.descendantRecipes.some(r => r.result === 'lit-greenhouse'));
  assert.ok(partner.genericAssemblyPartners.includes('lamp'));
  assert.ok(partner.contextOptions.some(o => o.partner === 'place:bed'));
  for (const option of partner.contextOptions) {
    const next = stepMarsWorkshop(s, option.action);
    assert.equal(option.accepted, next.accepted);
    assert.deepEqual(option.effect, next.response);
  }
  const unlearned = inspectMarsWorkshop(s, 'lit-greenhouse');
  assert.ok('root' in unlearned && unlearned.root);
  assert.equal('known' in unlearned && unlearned.known, false);
  assert.match(JSON.stringify(inspectMarsWorkshop(s, 'rules')), /source|Source/);
  assert.match(JSON.stringify(inspectMarsWorkshop(s, 'rules')), /via/);
  reject(s, combine('lit-greenhouse', 'place:bed'));
  assert.deepEqual(s, before);
  const r = rig(), source = r.place('solar-lead', 'ridge');
  const inspected = inspectMarsWorkshop(r.state, source);
  assert.ok('rows' in inspected);
  const inspectedRow = inspected.rows![0];
  assert.ok('power' in inspectedRow && 'parts' in inspectedRow);
  assert.deepEqual(inspectedRow.power, ['sun:day:ridge']);
  assert.ok(inspectedRow.parts!.some(p => p.source.includes('sun:day:ridge')));
  const publicText = JSON.stringify([observeMarsWorkshop(s), catalogue, partner, inspectMarsWorkshop(s)]);
  assert.doesNotMatch(publicText, /workshopWitness|preferred next move|author witness/);
});

test('workshop: ordinary, complete, carried-assembly and alternate-order legal witnesses finish all twelve jobs and replay exactly', () => {
  const ordinary = workshopWitness('test-ordinary');
  const complete = workshopWitness('test-complete', { catalogue: 'complete' });
  const carryover = workshopWitness('test-carryover', {
    catalogue: 'complete', known: ordinary.state.known, designs: ordinary.state.designs,
  }, WORKSHOP_MAPS.map(m => m.id), ordinary.state);
  const reverse = workshopWitness('test-reverse', {}, [...WORKSHOP_MAPS.map(m => m.id)].reverse());
  for (const witness of [ordinary, complete, carryover, reverse]) {
    assert.equal(witness.state.status, 'complete');
    assert.equal(witness.state.boards.flatMap(b => marsWorkshopGoals(witness.state, b.id)).filter(g => g.achieved).length, 12);
    assert.equal(witness.state.interventions, witness.actions.filter(a => a.type === 'combine').length);
    assert.deepEqual(replayMarsWorkshop(witness.actions, witness.options), witness.state);
  }
  assert.ok(carryover.actions.some(a => a.type === 'combine' && (a.a.startsWith('assembly:') || a.b.startsWith('assembly:'))),
    'carryover check actually reuses a learned whole construction');
});
