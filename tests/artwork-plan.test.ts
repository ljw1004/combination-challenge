import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act, newGame} from '../src/engine/game.ts';
import {coverArtwork, currentArtwork, lookaheadArtwork, placementArtwork} from '../src/web/artwork-plan.ts';

const text = `# Loading frontier
background: ![cover](cover.svg)

## First
background: ![first](first.svg)

**Goals**
- Build D -- D
**Items**
- A
  - icon: ![A](a.svg)
- B
  - icon: ![B](b.svg)
- C
  - icon: ![C](c.svg)
- D
  - icon: ![D](d.svg)
**Combinations**
- A [preserve] + B [preserve] -> C
- C [preserve] + B [preserve] -> D
## Second
background: ![second](second.svg)

**Goals**
- Build R -- R
**Hotspots**
- Bench
  - icon: ![bench](bench.svg)
**Items**
- Bench
- P
  - icon: ![P](p.svg)
- R
  - icon: ![R](r.svg)
**Combinations**
- C [preserve] + P [preserve] -> R
## Third
background: ![third](third.svg)

**Goals**
- Build S -- S
**Items**
- Q
  - icon: ![Q](q.svg)
- S
  - icon: ![S](s.svg)
**Combinations**
- R [preserve] + Q [preserve] -> S
`;

test('cover, one-combination frontier and next-chapter primitives remain separate and advance with play', () => {
  const story = parseStory(text);
  let state = newGame(story);
  assert.deepEqual(coverArtwork(story), ['cover.svg']);
  assert.deepEqual(new Set(lookaheadArtwork(story, state, false)), new Set(['first.svg', 'a.svg', 'b.svg']));
  assert.deepEqual(new Set(lookaheadArtwork(story, state, true)), new Set(['c.svg', 'second.svg', 'bench.svg', 'p.svg']));
  state = act(story, state, {type: 'combine', a: 'name:A', b: 'name:B'});
  assert.deepEqual(new Set(lookaheadArtwork(story, state, true)), new Set(['d.svg', 'second.svg', 'bench.svg', 'p.svg']));
  state = act(story, state, {type: 'combine', a: 'name:C', b: 'name:B'});
  state = act(story, state, {type: 'advance'});
  assert.deepEqual(new Set(currentArtwork(story, state)), new Set(['second.svg', 'bench.svg', 'c.svg', 'p.svg']));
  assert.deepEqual(new Set(lookaheadArtwork(story, state, true)), new Set(['r.svg', 'third.svg', 'q.svg']));
});

test('fixed result artwork is prefetched and placement probes use fallback item artwork',()=>{
  const story=parseStory('# Fixed art\n## Work\nbackground: ![scene](room.svg)\n**Items**\n- A\n- B\n- H\n  - icon: ![default](default.svg)\n**Hotspots**\n- H\n  - icon: ![fixed](fixed.svg)\n  - place: A (at 50%, 50%)\n**Goals**\n- Build -- H\n**Combinations**\n- A + B -> H\n## Revisit\nbackground: ![scene](room.svg)\n**Hotspots**\n- H\n  - place: A (at 50%, 50%)');
  assert(lookaheadArtwork(story,newGame(story),true).includes('fixed.svg'));
  assert.deepEqual(placementArtwork(story),['fixed.svg','default.svg']);
});

test('slot overlays preload only when a fitting is available, including conditional result readings', () => {
  const story = parseStory(`# Fittings
## Workshop
**Goals**
- Fit -- House[Window,Door]
**Items**
- House (compound)
  - icon: ![house](house.svg)
  - unnamed slot: accepts Window, icon: ![fitted](window-overlay.svg)
  - unnamed slot: accepts Door, icon: ![fitted](door-overlay.svg)

  [Window] ![guide](window-guide.svg)

- Window
  - icon: ![window](window.svg)
- Door
  - icon: ![door](door.svg)
- Timber
  - icon: ![timber](timber.svg)
**Combinations**
- Timber [preserve] + Window [preserve] -> Door
`);
  const state = newGame(story), current = currentArtwork(story, state), next = lookaheadArtwork(story, state, true);
  assert.equal(current.includes('window-overlay.svg'), false);
  assert.ok(next.includes('window-overlay.svg'));
  assert.ok(next.includes('window-guide.svg'));
  assert.equal(next.includes('door-overlay.svg'), false, 'producing a component does not preload its later installation');
  assert.ok(next.includes('door.svg'));
});
