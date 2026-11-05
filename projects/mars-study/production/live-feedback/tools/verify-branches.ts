// Run from the repository root with node. This checks legal engine routes, not
// image recognition, geometry, scientific claims, or exhaustive state coverage.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loadStory} from '../../../../../src/story/load.ts';
import {checkpoint} from '../../../../../src/debug/checkpoint.ts';
import {act, chapterComplete, newGame, recipeFor, replay, visibleGoals} from '../../../../../src/engine/game.ts';
import {isFixed, presentHotspots} from '../../../../../src/engine/fixed-items.ts';
import {lintStory} from '../../../../../src/lint/lint.ts';
import type {Action, State} from '../../../../../src/engine/types.ts';

const {story, markdown} = loadStory('stories/mars/mars.md');
const fast = lintStory(story, {analysis: false});
assert.deepEqual(fast.filter(d => d.severity === 'error'), [], 'fast semantic errors');
const key = (id: string) => `id:${id}`;
const live = (s: State, id: string) => s.tokens[key(id)]?.status === 'available';
function tidy(s: State) {
  while (s.pending.length) s = act(story, s, {type: 'dismiss'});
  return s;
}
function checkTargets(s: State) {
  for (const chapter of s.visited) {
    assert(presentHotspots(story, s, chapter).length <= 3,
      `More than three targets in ${story.chapters[chapter].name}`);
  }
  return s;
}
type Combine = Extract<Action, {type: 'combine'}>;
function apply(s: State, action: Combine, expected?: string) {
  s = tidy(s);
  assert(recipeFor(story, s, action), `Unavailable: ${JSON.stringify(action)}`);
  s = checkTargets(tidy(act(story, s, action)));
  if (expected) assert(live(s, expected), `Missing result: ${expected}`);
  return s;
}
const h = (s: State, item: string, target: string, result?: string) => apply(s,
  {type: 'combine', a: key(item), hotspot: key(target), chapter: s.chapter}, result);
const b = (s: State, item: string, target: string, result?: string) => apply(s,
  {type: 'combine', a: key(item), b: key(target)}, result);
function no(s: State, item: string, target: string, fixed = true) {
  assert(!recipeFor(story, s, {type: 'combine', a: key(item),
    ...(fixed ? {hotspot: key(target), chapter: s.chapter} : {b: key(target)})}),
  `Unexpected operation: ${item} -> ${target}`);
}
function gone(s: State, ...ids: string[]) {
  for (const id of ids) assert(!live(s, id), `Obsolete state survives: ${id}`);
}
function currentTargets(s: State, expected: string[]) {
  assert.deepEqual([...presentHotspots(story, s, s.chapter)].sort(), expected.map(key).sort());
}
function permutations<T>(xs: T[]): T[][] {
  return xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => i !== j))
    .map(rest => [x, ...rest])) : [[]];
}

// Every branch starts with a real arrival from this complete legal replay.
const full = checkpoint(story, story.chapters.length);
assert(full.completed, 'Full route must finish');
const arrivals = new Map<string, State>();
let witness = newGame(story);
arrivals.set(story.chapters[0].name, structuredClone(witness));
for (const action of full.actions) {
  if (action.type === 'combine') assert(recipeFor(story, witness, action), 'Full route legal');
  const before = witness.chapter;
  witness = checkTargets(act(story, witness, action));
  if (witness.chapter !== before) arrivals.set(story.chapters[witness.chapter].name, structuredClone(witness));
}
assert.deepEqual(witness, full, 'Full replay matches planner');
assert.equal(arrivals.size, story.chapters.length, 'Full route visits every chapter');
function start(name: string) {
  const state = arrivals.get(name);
  assert(state, `Missing arrival: ${name}`);
  return tidy(structuredClone(state));
}
const groups: Record<string, number> = {};
function finish(s: State, group: string) {
  assert(chapterComplete(story, s), `${group}: chapter incomplete`);
  const ending = checkpoint(story, story.chapters.length, tidy(s));
  assert(ending.completed, `${group}: continuation incomplete`);
  assert.deepEqual(replay(story, ending.actions), ending, `${group}: continuation replay`);
  groups[group] = (groups[group] ?? 0) + 1;
}

// Sequential disclosure remains independent of the communications chain, and
// physically available later work may be done early without bypassing a goal.
for (const order of permutations(['solar', 'scrubber', 'battery', 'comms'])
  .filter(xs => xs.indexOf('solar') < xs.indexOf('battery'))) {
  let s = start('Air');
  assert(!live(s, 'steel-pin'), 'Steel pin must not invite early cable combination');
  const goals = story.chapters[s.chapter].goals;
  assert.deepEqual(visibleGoals(story, s).map(g => g.text), ['Restore solar power', 'Restore comms']);
  no(s, 'reserve-battery', 'station-power');
  for (const task of order) {
    if (task === 'solar') {
      s = h(s, 'solar-panels', 'solar-array-base', 'deployed-solar-array');
      s = h(s, 'power-cable', 'deployed-solar-array', 'station-power');
      gone(s, 'solar-array-base', 'deployed-solar-array');
    } else if (task === 'scrubber') s = b(s, 'power-cable', 'habitat-scrubber');
    else if (task === 'battery') s = h(s, 'reserve-battery', 'station-power', 'charged-reserve-battery');
    else s = b(s, 'unseated-antenna', 'antenna-mount');
    const firstPower = goals.slice(0, 3).find(g => !s.achieved.includes(g.id));
    const comms = goals[3];
    assert.deepEqual(visibleGoals(story, s).map(g => g.id),
      [firstPower, !s.achieved.includes(comms.id) ? comms : undefined].filter(Boolean).map(g => g!.id));
  }
  finish(s, 'solar/scrubber/battery/comms orders');
}

for (const route of ['load-pot-first', 'park-pot-first', 'dig-then-park']) {
  for (const filterFirst of [true, false]) {
    let s = start('Water');
    assert(live(s, 'steel-pin'), 'Steel pin is recovered in the outdoor water chapter');
    currentTargets(s, ['visible-ice', 'heater']);
    const filter = (state: State) => b(state, 'fabric', 'reclaimed-water-cartridge', 'water-filter');
    if (filterFirst) s = filter(s);
    if (route === 'park-pot-first') s = h(s, 'empty-pot', 'heater', 'pot-on-heater');
    s = h(s, 'shovel', 'visible-ice', 'ice-chunks');
    if (route === 'load-pot-first') {
      s = b(s, 'ice-chunks', 'empty-pot', 'pot-of-ice');
      s = h(s, 'pot-of-ice', 'heater', 'meltwater');
    } else {
      if (route === 'dig-then-park') s = h(s, 'empty-pot', 'heater', 'pot-on-heater');
      currentTargets(s, ['visible-ice', 'heater', 'pot-on-heater']);
      s = h(s, 'ice-chunks', 'pot-on-heater', 'meltwater');
    }
    currentTargets(s, ['visible-ice', 'heater']);
    gone(s, 'empty-pot', 'pot-on-heater', 'pot-of-ice', 'ice-chunks');
    assert(isFixed(story, s.tokens[key('heater')]), 'Heater stays fixed');
    assert(!isFixed(story, s.tokens[key('meltwater')]), 'Meltwater remains portable');
    if (!filterFirst) s = filter(s);
    s = b(s, 'water-filter', 'meltwater', 'clean-water');
    gone(s, 'meltwater');
    assert(live(s, 'water-filter'), 'Filter preserved for later service');
    finish(s, 'both pot routes and filter timing');
  }
}

for (const insulationFirst of [true, false]) {
  let s = start('A bed under the hill');
  no(s, 'cabin-mattress', 'berth-alcove');
  if (insulationFirst) s = b(s, 'packing-foil', 'insulation-felt', 'reflective-insulation');
  s = h(s, 'ceramic-blocks', 'berth-alcove', 'ceramic-berth');
  no(s, 'cabin-mattress', 'ceramic-berth');
  if (!insulationFirst) s = b(s, 'packing-foil', 'insulation-felt', 'reflective-insulation');
  s = h(s, 'reflective-insulation', 'ceramic-berth', 'insulated-ceramic-berth');
  s = h(s, 'cabin-mattress', 'insulated-ceramic-berth', 'cave-berth');
  gone(s, 'berth-alcove', 'ceramic-berth', 'insulated-ceramic-berth');
  finish(s, 'insulation precedes mattress');
}

assert(!story.items[key('sheet')], 'No separate sheet supply');
for (const beds of permutations(['potato', 'soybean', 'lettuce'])) for (const coverFirst of [true, false]) {
  let s = start('One room for roots');
  currentTargets(s, ['potato-plot', 'soybean-plot', 'lettuce-plot']);
  s = b(s, 'fired-granules', 'clean-water', 'growing-medium');
  s = b(s, 'packing-foil', 'fabric', 'foil-backed-cloth');
  for (const crop of beds) {
    no(s, 'drip-line', `${crop}-plot`);
    s = h(s, 'ceramic-blocks', `${crop}-plot`, `${crop}-bed-walls`);
    s = h(s, 'fabric', `${crop}-bed-walls`, `lined-${crop}-bed`);
    s = h(s, 'growing-medium', `lined-${crop}-bed`, `filled-${crop}-bed`);
    s = h(s, 'drip-line', `filled-${crop}-bed`, `watered-${crop}-bed`);
    if (crop === 'potato') {
      for (const item of coverFirst ? ['foil-backed-cloth', 'seed-potatoes'] : ['seed-potatoes', 'foil-backed-cloth'])
        s = b(s, item, 'watered-potato-bed');
    } else {
      no(s, 'foil-backed-cloth', `watered-${crop}-bed`, false);
      s = b(s, `${crop}-seeds`, `watered-${crop}-bed`);
    }
    gone(s, `${crop}-plot`, `${crop}-bed-walls`, `lined-${crop}-bed`, `filled-${crop}-bed`);
  }
  assert.deepEqual([...s.tokens[key('watered-potato-bed')].slots].sort(), ['foil-backed-cloth', 'seed-potatoes'].map(key).sort());
  finish(s, 'three independent beds and potato cover');
}

{
  let s = start('What the water carries');
  assert(isFixed(story, s.tokens[key('water-filter')]), 'Original filter returns as fixed service point');
  no(s, 'fabric', 'water-filter');
  s = h(s, 'empty-microscope-slide', 'water-filter', 'sludge-microscope-slide');
  s = h(s, 'sludge-microscope-slide', 'laboratory-microscope', 'examined-sludge-slide');
  gone(s, 'sludge-microscope-slide');
  finish(s, 'sludge slide');
  s = start('The ground we know');
  s = h(s, 'core-drill', 'visible-ice', 'sealed-source-core');
  s = b(s, 'sealed-source-core', 'reflective-insulation', 'stored-source-core');
  gone(s, 'sealed-source-core');
  finish(s, 'local core and reused insulation');
  s = start('Across the gully');
  no(s, 'core-drill', 'reached-ice-bank');
  s = h(s, 'rover-winch', 'bedrock-anchor', 'anchored-winch');
  no(s, 'core-drill', 'reached-ice-bank');
  s = h(s, 'expedition-rover', 'anchored-winch', 'reached-ice-bank');
  gone(s, 'anchored-winch');
  s = h(s, 'core-drill', 'reached-ice-bank', 'remote-ice-core');
  finish(s, 'crossing before remote sampling');
  s = start('Something whole');
  const original = structuredClone(s.tokens[key('remote-ice-core')]);
  no(s, 'remote-ice-core', 'laboratory-microscope');
  s = b(s, 'empty-microscope-slide', 'remote-ice-core', 'sectioned-ice-core');
  assert.deepEqual(s.tokens[key('remote-ice-core')], original, 'Sampling preserves original remote core');
  s = h(s, 'sectioned-ice-core', 'laboratory-microscope', 'examined-ice-core');
  gone(s, 'sectioned-ice-core');
  assert.deepEqual(s.tokens[key('remote-ice-core')], original, 'Viewing preserves original remote core');
  finish(s, 'ice slide preserves parent core');
}

for (const tankAt of ['empty-cell', 'first-fill', 'both-fills']) {
  for (const gases of permutations(['hydrogen', 'oxygen'])) {
    let s = start('Two gases from water');
    currentTargets(s, []);
    assert(!isFixed(story, s.tokens[key('salvaged-cell-internals')]), 'Insert begins as a movable item');
    s = b(s, 'iron-stock', 'salvaged-cell-internals', 'water-electrolysis-cell');
    no(s, 'empty-gas-tank', 'water-electrolysis-cell');
    no(s, 'power-cable', 'water-electrolysis-cell', false);
    if (tankAt === 'empty-cell') s = h(s, 'iron-stock', 'water-electrolysis-cell', 'empty-gas-tank');
    s = h(s, 'clean-water', 'water-electrolysis-cell', 'hydrogen-cell');
    gone(s, 'water-electrolysis-cell');
    currentTargets(s, ['hydrogen-cell']);
    assert(live(s, 'clean-water'), 'Same water supply supports the second filling');
    if (tankAt === 'first-fill') s = h(s, 'iron-stock', 'hydrogen-cell', 'empty-gas-tank');
    s = h(s, 'clean-water', 'hydrogen-cell', 'oxygen-outlet');
    currentTargets(s, ['hydrogen-cell', 'oxygen-outlet']);
    if (tankAt === 'both-fills') s = h(s, 'iron-stock', 'hydrogen-cell', 'empty-gas-tank');
    for (const gas of gases) {
      s = h(s, 'empty-gas-tank', gas === 'hydrogen' ? 'hydrogen-cell' : 'oxygen-outlet', `${gas}-cylinder`);
      assert(live(s, 'empty-gas-tank'), 'Common empty tank survives each collection');
      assert(!isFixed(story, s.tokens[key(`${gas}-cylinder`)]), `${gas} tank is portable`);
    }
    finish(s, 'tank before/after fills and either gas first');
  }
}
for (const tankBeforeFill of [true, false]) {
  let s = start('Two gases from water');
  s = b(s, 'iron-stock', 'salvaged-cell-internals', 'water-electrolysis-cell');
  if (tankBeforeFill) s = h(s, 'iron-stock', 'water-electrolysis-cell', 'empty-gas-tank');
  s = h(s, 'clean-water', 'water-electrolysis-cell', 'hydrogen-cell');
  if (!tankBeforeFill) s = h(s, 'iron-stock', 'hydrogen-cell', 'empty-gas-tank');
  s = h(s, 'empty-gas-tank', 'hydrogen-cell', 'hydrogen-cylinder');
  assert(!chapterComplete(story, s), 'Early hydrogen does not skip second water fill');
  s = h(s, 'clean-water', 'hydrogen-cell', 'oxygen-outlet');
  s = h(s, 'empty-gas-tank', 'oxygen-outlet', 'oxygen-cylinder');
  finish(s, 'early hydrogen before second fill');
}

for (const order of permutations(['capture', 'hydrogen-cylinder', 'carbon-dioxide-cylinder', 'power-cable'])
  .filter(xs => xs.indexOf('capture') < xs.indexOf('carbon-dioxide-cylinder'))) {
  let s = start('Fuel from air and water');
  const emptyEncounter = s.tokens[key('empty-gas-tank')].firstSeen;
  assert.equal(emptyEncounter?.chapter, 13, 'Empty tank was made in the water-cell chapter');
  assert(s.tokens[key('iron-stock')].chapter !== s.chapter, 'No iron work in methane chapter');
  assert(s.tokens[key('oxygen-cylinder')].chapter !== s.chapter, 'Oxygen stays out of methane scene');
  no(s, 'oxygen-cylinder', 'fuel-assembly', false);
  no(s, 'iron-stock', 'fuel-assembly', false);
  for (const component of order) {
    no(s, 'empty-gas-tank', 'fuel-assembly');
    if (component === 'capture') s = h(s, 'empty-gas-tank', 'habitat-scrubber', 'carbon-dioxide-cylinder');
    else s = b(s, component, 'fuel-assembly');
  }
  assert.deepEqual([...s.tokens[key('fuel-assembly')].slots].sort(),
    ['hydrogen-cylinder', 'carbon-dioxide-cylinder', 'power-cable'].map(key).sort());
  s = h(s, 'empty-gas-tank', 'fuel-assembly', 'methane-cylinder');
  assert.deepEqual(s.tokens[key('empty-gas-tank')].firstSeen, emptyEncounter, 'Same empty-tank resource reused');
  assert(live(s, 'empty-gas-tank') && live(s, 'oxygen-cylinder'), 'Empty tank and separate oxygen survive');
  finish(s, 'three methane fittings and CO2 capture orders');
}

for (const order of permutations(['reserve-power-selector', 'water-service-control'])) {
  let s = start('Amber noon');
  currentTargets(s, ['reserve-power-selector', 'water-service-control']);
  for (const target of order) s = h(s, 'service-key', target);
  currentTargets(s, ['reserve-power-selected', 'water-service-secured']);
  finish(s, 'two storm selectors in either order');
}

for (const order of permutations(['screen', 'covers'])) {
  let s = start('Keep the roots alive');
  for (const task of order) {
    if (task === 'screen') {
      s = b(s, 'reflective-insulation', 'fabric', 'farm-thermal-screen');
      s = h(s, 'farm-thermal-screen', 'growing-room-service-rail', 'screened-growing-area');
    } else s = h(s, 'fabric', 'crop-canopy-supports', 'covered-crops');
  }
  currentTargets(s, ['screened-growing-area', 'covered-crops']);
  gone(s, 'growing-room-service-rail', 'crop-canopy-supports');
  finish(s, 'storm screen and close covers either order');
}

{
  let s = start('The leg that stays');
  no(s, 'iron-stock', 'landing-footing-site');
  s = h(s, 'ceramic-blocks', 'landing-footing-site', 'ceramic-landing-footing');
  no(s, 'iron-stock', 'ceramic-landing-footing');
  s = h(s, 'shovel', 'ceramic-landing-footing', 'clear-support-gap');
  s = h(s, 'iron-stock', 'clear-support-gap', 'level-launch-platform');
  gone(s, 'landing-footing-site', 'ceramic-landing-footing', 'clear-support-gap');
  currentTargets(s, ['level-launch-platform']);
  finish(s, 'permanent leg replaces temporary supports');
}
for (const gases of permutations(['methane', 'oxygen'])) {
  let s = start('Fuel for the return');
  for (const gas of gases) {
    no(s, `${gas}-cylinder`, `lander-${gas === 'methane' ? 'oxygen' : 'methane'}-port`);
    s = h(s, `${gas}-cylinder`, `lander-${gas}-port`, `${gas}-transferred`);
    gone(s, `${gas}-cylinder`, `lander-${gas}-port`);
  }
  finish(s, 'direct separate gas transfers');
}

for (const crops of permutations(['potato', 'soybean', 'lettuce'])) for (const cookFirst of ['potato', 'soybean']) {
  let s = start('Supper from the garden');
  currentTargets(s, ['harvest-potato-bed', 'harvest-soybean-bed', 'harvest-lettuce-bed']);
  const harvests: Record<string, string> = {potato: 'harvested-potatoes', soybean: 'soybeans-on-fabric', lettuce: 'supper-lettuce'};
  for (const crop of crops) {
    s = h(s, 'lined-harvest-basket', `harvest-${crop}-bed`, harvests[crop]);
    assert(live(s, 'lined-harvest-basket'), 'Same basket survives every harvest');
  }
  no(s, 'supper-lettuce', 'clean-water', false);
  const pot = cookFirst === 'potato' ? 'pot-of-potatoes' : 'pot-of-soybeans';
  s = b(s, 'clean-water', harvests[cookFirst], pot);
  no(s, 'supper-lettuce', pot, false);
  s = b(s, pot, harvests[cookFirst === 'potato' ? 'soybean' : 'potato'], 'potatoes-and-soybeans');
  s = b(s, 'supper-lettuce', 'potatoes-and-soybeans', 'stew-and-lettuce-supper');
  gone(s, 'pot-of-potatoes', 'pot-of-soybeans', 'potatoes-and-soybeans');
  finish(s, 'independent harvest and either cooking order');
}

for (const cores of permutations(['source', 'remote'])) {
  let s = start('The things we take');
  const carried = Object.values(s.tokens).filter(t => t.status === 'available' && t.chapter === s.chapter && !isFixed(story, t));
  assert.deepEqual(carried.map(t => t.id).sort(), ['stored-source-core', 'remote-ice-core'].map(key).sort(), 'Only original cores carried');
  assert.equal(s.tokens[key('stored-source-core')].firstSeen?.chapter, 9, 'Local core provenance');
  assert.equal(s.tokens[key('remote-ice-core')].firstSeen?.chapter, 10, 'Remote core provenance');
  for (const core of cores) {
    const source = core === 'source' ? 'stored-source-core' : 'remote-ice-core';
    const target = core === 'source' ? 'water-source-core-cradle' : 'remote-band-core-cradle';
    no(s, 'examined-sludge-slide', target);
    no(s, 'examined-ice-core', target);
    s = h(s, source, target, `flight-stowed-${core}-core`);
    gone(s, source, target);
  }
  for (const slide of ['examined-sludge-slide', 'examined-ice-core'])
    assert(s.tokens[key(slide)].chapter < s.chapter, 'Slides remain in earlier laboratory');
  finish(s, 'both original cores and no slide stow');
}

console.log(JSON.stringify({
  pass: true,
  manuscriptSha256: createHash('sha256').update(markdown).digest('hex'),
  chapters: story.chapters.length,
  recipes: story.recipes.length,
  fullRouteActions: full.actions.length,
  branchContinuationsReplayed: Object.values(groups).reduce((a, b) => a + b, 0),
  groups,
  limits: 'Focused legal engine witnesses and fast semantic lint only; no exhaustive state proof, image/geometry review, science review, or player-experience claim.'
}, null, 2));
