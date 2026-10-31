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
  assert.deepEqual(encyclopediaEntries(story, after).map(e => e.name), ['Flour', 'Grain', 'Stone']);
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

test('alphabetical order uses current readable names rather than opaque identities', () => {
  const renamed = structuredClone(story), state = newGame(renamed);
  renamed.items['name:Stone'].renames.push({ chapter: 'Workshop', name: 'A whetstone' });
  assert.deepEqual(encyclopediaEntries(renamed, state), [
    { id: 'name:Stone', name: 'A whetstone' },
    { id: 'name:Grain', name: 'Grain' },
  ]);
});
