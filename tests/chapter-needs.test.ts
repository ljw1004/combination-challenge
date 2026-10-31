import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act, newGame} from '../src/engine/game.ts';

test('primitive caches protect future supplies and introduce optional worldbuilding materials', () => {
  const markdown = `# Supply caches
## Timber
![room](room.webp)
**Goals**
- Saw planks -- Planks
**Combinations**
- Wood [transform] + Saw [preserve] -> Planks
## Painting supplies
![room](room.webp)
**Goals**
- Raise a flag -- Flag
**Items**
- Wood
- Pigment
**Combinations**
- Cloth [consume] + Pole [preserve] -> Flag
- Wood [preserve] + Pigment [preserve] -> Painted sign`;
  const story = parseStory(markdown, {id: 'caches'});
  let state = act(story, newGame(story), {type: 'combine', a: 'name:Wood', b: 'name:Saw'});
  assert.equal(state.tokens['name:Wood'].status, 'available', 'the later primitive cache protects Wood');
  assert(!state.tokens['name:Pigment']);
  state = act(story, state, {type: 'advance'});
  assert.equal(state.tokens['name:Wood'].chapter, 1);
  assert(!state.newItems.includes('name:Wood'), 'an existing supply is carried, not created again');
  assert(state.newItems.includes('name:Pigment'), 'a primitive cache supplies material unrelated to goals');
  state = act(story, state, {type: 'combine', a: 'name:Wood', b: 'name:Pigment'});
  assert(state.tokens['name:Painted sign'], 'the cache supports optional content with ordinary gameplay rules');

  const withoutWoodCache = parseStory(markdown.replace('**Items**\n- Wood\n', '**Items**\n'), {id: 'no-wood-cache'});
  const cleaned = act(withoutWoodCache, newGame(withoutWoodCache), {type: 'combine', a: 'name:Wood', b: 'name:Saw'});
  assert.equal(cleaned.tokens['name:Wood'].status, 'transform');
});

test('needs carry a primitive compound and supply missing goal components through global recipes', () => {
  const story = parseStory(`# Packing
## Prepare
![room](room.webp)
**Goals**
- Get ready -- Ready
**Items**
- Box (compound)
  - slot: fitting, accepts Part
- Badge
**Combinations**
- Seed [consume] + Tool [preserve] -> Ready
- Pigment [consume] + Tool [preserve] -> Badge
## Pack
![room](room.webp)
**Goals**
- Install the part -- Box[Part]
- next: Wrap the box -- Wrapped box
**Combinations**
- Box[Part] [transform] + Ribbon [consume] -> Wrapped box`, {id: 'packing'});
  let state = newGame(story);
  assert(state.tokens['name:Box'], 'implicit installation does not make its owner derived');
  assert(!state.tokens['name:Part'], 'a bare compound supply does not supply its slots');
  assert(!state.tokens['name:Pigment'], 'a derived metadata declaration supplies no ingredients');
  state = act(story, state, {type: 'combine', a: 'name:Seed', b: 'name:Tool'});
  state = act(story, state, {type: 'advance'});
  assert.equal(state.tokens['name:Box'].chapter, 1);
  assert.deepEqual(state.newItems.toSorted(), ['name:Part', 'name:Ribbon']);
  state = act(story, state, {type: 'combine', a: 'name:Box', b: 'name:Part'});
  assert.deepEqual(state.tokens['name:Box'].slots, ['name:Part']);
  assert.equal(state.tokens['name:Part'].status, 'installed');
  state = act(story, state, {type: 'combine', a: 'name:Box', b: 'name:Ribbon'});
  assert(state.tokens['name:Wrapped box']);
  assert.equal(state.tokens['name:Box'].status, 'transform');
});
