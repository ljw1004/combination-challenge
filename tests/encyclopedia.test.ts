import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStory } from '../src/story/parser.ts';
import { newGame, act, replay } from '../src/engine/game.ts';
import { encyclopediaEntries } from '../src/web/encyclopedia.ts';

const story = parseStory(`# Library fixture

## Workshop

**Goals**
- Finish -- Final

**Items**
- Grain

  A grain explanation.

- Stone

  A stone explanation.

- Flour

  A flour explanation.

- Tool
- Final

**Combinations**
- Grain [transform] + Stone [consume] -> Flour
- Flour [preserve] + Tool [preserve] -> Final
`, { id: 'library-fixture' });

test('encyclopedia derives encountered descriptions, including retired inputs, and replay/reset need no ledger', () => {
  const entry = newGame(story);
  assert.deepEqual(encyclopediaEntries(story, entry).map(e => e.name), ['Grain', 'Stone']);
  const after = act(story, entry, { type: 'combine', a: 'name:Grain', b: 'name:Stone' });
  assert.equal(after.tokens['name:Grain'].status, 'transform');
  assert.equal(after.tokens['name:Stone'].status, 'consume');
  assert.deepEqual(encyclopediaEntries(story, after).map(e => e.name), ['Grain', 'Stone', 'Flour']);
  assert.deepEqual(encyclopediaEntries(story, replay(story, after.actions)), encyclopediaEntries(story, after));
  assert.deepEqual(encyclopediaEntries(story, structuredClone(entry)), encyclopediaEntries(story, newGame(story)));
  assert.equal(encyclopediaEntries(story, entry).length, 2);
});

test('installed resources remain readable; repeated identities, empty and unmet conditional readings do not count', () => {
  const compound = parseStory(`# Compound
## Workshop
**Goals**
- Finish -- Box[Motor]
**Items**
- Box (compound)
  - slot: power, accepts Motor

  [Motor] A working box.

- Motor

  A motor explanation.

- Blank
`, { id: 'compound-library' });
  let state = newGame(compound);
  assert.deepEqual(encyclopediaEntries(compound, state).map(e => e.name), ['Motor']);
  state = act(compound, state, { type: 'combine', a: 'name:Motor', b: 'name:Box' });
  assert.equal(state.tokens['name:Motor'].status, 'installed');
  assert.deepEqual(encyclopediaEntries(compound, state).map(e => e.id), ['name:Box', 'name:Motor']);
  state.tokens.alias = state.tokens['name:Motor'];
  compound.items['name:Blank'].wonders.push({ ...compound.items['name:Motor'].wonders[0], markdown: '   ' });
  assert.equal(encyclopediaEntries(compound, state).length, 2);
});

test('encounter order is stable when an item acquires an alphabetically earlier readable name', () => {
  const renamed = structuredClone(story), state = newGame(renamed);
  renamed.items['name:Stone'].renames.push({ chapter: 'Workshop', name: 'A whetstone' });
  assert.deepEqual(encyclopediaEntries(renamed, state), [
    { id: 'name:Grain', name: 'Grain', chapter: 0 },
    { id: 'name:Stone', name: 'A whetstone', chapter: 0 },
  ]);
});

test('encyclopedia groups unknown and known first-seen chapters, then encounter order, independently of placement and labels', () => {
  const grouped = parseStory(`# Groups
## First
**Items**
- Zebra

  Zebra description.

- Apple

  Apple description.

- Middle

  Middle description.

- Legacy

  Legacy description.
`, { id: 'grouped-library' });
  const state = newGame(grouped);
  state.tokens['name:Zebra'].firstSeen = { chapter: 1, order: 3 };
  state.tokens['name:Apple'].firstSeen = { chapter: 1, order: 4 };
  state.tokens['name:Middle'].firstSeen = { chapter: 0, order: 8 };
  state.tokens['name:Legacy'].firstSeen = { chapter: null, order: 20 };
  // Current placement and insertion/label order must not substitute for history.
  state.tokens['name:Zebra'].chapter = 0;
  state.tokens['name:Middle'].chapter = 2;
  state.tokens['name:Legacy'].chapter = 3;
  assert.deepEqual(encyclopediaEntries(grouped, state), [
    { id: 'name:Legacy', name: 'Legacy', chapter: null },
    { id: 'name:Middle', name: 'Middle', chapter: 0 },
    { id: 'name:Zebra', name: 'Zebra', chapter: 1 },
    { id: 'name:Apple', name: 'Apple', chapter: 1 },
  ]);
});
