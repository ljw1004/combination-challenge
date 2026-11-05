import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act, newGame} from '../src/engine/game.ts';
import {observe} from '../src/playtest/observe.ts';
import {partnerHints} from '../src/web/partner-hints.ts';

const context = parseStory(`# A workshop
## Work
background: ![room](room.webp)
**Goals**
- Discover something -- Secret parcel
**Hotspots**
- Bench
**Items**
- Bench
- A
- B
- Secret parcel
**Combinations**
- A [consume] + B [preserve] @ Bench -> Secret parcel
> NOTE: An author-only explanation.
## Later
background: ![room](later.webp)
**Hotspots**
- Unvisited kiln

**Items**
- Unvisited kiln

`);

test('logical observations offer the browser’s preparatory hotspot drags without revealing the result', () => {
  const state = newGame(context), before = structuredClone(state);
  const observation = observe(context, state);
  const moves = observation.partners.filter(a => a.type === 'move');
  assert.deepEqual(new Set(moves.map(a => a.item)), partnerHints(context, state, {kind: 'hotspot', id: 'name:Bench'}).items);
  assert.equal(moves.length, 2);
  assert(moves.every(a => a.hotspot === 'name:Bench' && a.chapter === 0));
  assert(!JSON.stringify(observation).includes('Secret parcel'));
  assert(!JSON.stringify(observation).includes('author-only'));
  assert(!JSON.stringify(observation).includes('Unvisited kiln'));
  assert.deepEqual(state, before);
  const placed = act(context, state, moves.find(a => a.item === 'name:B')!);
  const ready = observe(context, placed).partners;
  const combination = ready.find(a => a.type === 'combine' && a.a === 'name:A' && a.b === 'name:B');
  assert(combination);
  assert(!ready.some(a => a.type === 'move' && a.item === 'name:A'), 'the occupied hotspot would combine, not just park A');
  const made = act(context, placed, combination);
  assert(observe(context, made).items.some(i => i.name === 'Secret parcel'));
});

test('logical hints preserve compound fitting and placement affordances while hiding unnamed requirements and future outputs', () => {
  const story = parseStory(`# A box
## Work
**Goals**
- Make something -- Hidden parcel
- next: Store the finished box -- Box[Lid] @ Shelf
**Hotspots**
- Bench
- Shelf
- Kiln
**Items**
- Bench
- Shelf
- Kiln
- Box (compound)
  - unnamed slot: accepts Lid
- Lid
- Tool
- Hidden parcel
- Hidden fired box
**Combinations**
- Box[Lid] [preserve] + Tool [preserve] @ Bench -> Hidden parcel
- Box[Lid] [preserve] @ Kiln -> Hidden fired box
`);
  const state = newGame(story), observation = observe(story, state);
  const box = observation.items.find(i => i.name === 'Box')!;
  assert.deepEqual(box.slots, [{name: '', filled: false}]);
  assert.deepEqual(new Set(observation.partners.filter(a => a.type === 'move' && a.item === box.id).map(a => a.hotspot)), partnerHints(story, state, {kind: 'item', id: box.id}).hotspots);
  assert(!observation.partners.some(a => a.hotspot === 'name:Kiln'));
  const fit = observation.partners.find(a => a.type === 'combine' && a.a === 'name:Lid' && a.b === box.id);
  assert(fit);
  assert(!JSON.stringify(observation).includes('Hidden parcel'));
  assert(!JSON.stringify(observation).includes('Hidden fired box'));
  const fitted = observe(story, act(story, state, fit));
  assert.deepEqual(fitted.items.find(i => i.id === box.id)!.slots, [{name: 'Lid', filled: true}]);
  assert(fitted.partners.some(a => a.type === 'combine' && a.hotspot === 'name:Kiln'));
});

test('useful placement can precede another ingredient’s creation without exposing that ingredient', () => {
  const story = parseStory(`# Bread
## Work
**Goals**
- Make breakfast -- Hidden loaf
**Hotspots**
- Cellar
**Items**
- Cellar
- Flour
- Water
- Dough
- Hidden starter
- Hidden loaf
**Combinations**
- Flour [transform] + Water [preserve] -> Hidden starter
- Hidden starter [preserve] + Dough [transform] @ Cellar -> Hidden loaf
`);
  const state = newGame(story), observation = observe(story, state);
  assert(observation.partners.some(a => a.type === 'move' && a.item === 'name:Dough' && a.hotspot === 'name:Cellar'));
  assert(!observation.partners.some(a => a.type === 'move' && a.item === 'name:Flour'));
  assert(!JSON.stringify(observation).includes('Hidden starter'));
  assert(!JSON.stringify(observation).includes('Hidden loaf'));
  state.tokens['name:Flour'].status = 'consume';
  assert(!observe(story, state).partners.some(a => a.type === 'move'), 'a blocked future preparation cannot justify a placement hint');
});

test('logical hotspot actions honor the browser’s occupied-target priority', () => {
  const story = parseStory(`# Occupied bench
## Work
**Goals**
- Make either thing
  - either: Secret pair
  - or: Secret single
**Hotspots**
- Bench
**Items**
- Bench
- A
- B
- Secret pair
- Secret single
**Combinations**
- A [consume] + B [preserve] @ Bench -> Secret pair
- A [consume] @ Bench -> Secret single
`);
  let state = act(story, newGame(story), {type: 'move', item: 'name:B', chapter: 0, hotspot: 'name:Bench', x: 20, y: 30});
  const partners = observe(story, state).partners;
  assert(partners.some(a => a.type === 'combine' && a.a === 'name:A' && a.b === 'name:B'));
  assert(!partners.some(a => a.type === 'combine' && a.a === 'name:A' && !a.b), 'dropping A at the occupied bench cannot bypass its occupant');
  state = act(story, state, {type: 'move', item: 'name:B', chapter: 0, x: 100, y: 100});
  assert(observe(story, state).partners.some(a => a.type === 'combine' && a.a === 'name:A' && !a.b && a.hotspot === 'name:Bench'));
});
