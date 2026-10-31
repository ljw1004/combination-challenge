import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStory } from '../src/story/parser.ts';
import { act, newGame } from '../src/engine/game.ts';
import { restorePresentation, captureChapter } from '../src/web/chapter-session.ts';
import { reconcileLiveStory, restoreLiveState } from '../src/web/live-story.ts';
import type { State } from '../src/engine/types.ts';
import type { Story } from '../src/story/types.ts';

const text = `# Encounters
## First
First introduction.
**Goals**
- Make flour -- Flour
**Items**
- Grain
- Stone
**Combinations**
- Grain [transform] + Stone [consume] -> Flour

## Second
Second introduction.
**Goals**
- Finish -- Bread
**Items**
- Water
**Combinations**
- Flour [preserve] + Water [preserve] -> Bread
`;
const parse = (source = text) => parseStory(source, { id: 'encounters' });
const dismiss = (story: Story, original: State) => {
  let state = original;
  while (state.pending.length) state = act(story, state, { type: 'dismiss' });
  return state;
};
function second(story = parse()) {
  let state = act(story, newGame(story), { type: 'combine', a: 'name:Grain', b: 'name:Stone' });
  return act(story, dismiss(story, state), { type: 'advance' });
}
const encounters = (state: State) => Object.fromEntries(Object.values(state.tokens).map(t => [t.id, t.firstSeen]));

test('encounter chapter and order survive retirement, carry, placement, replay and chapter reset', () => {
  const story = parse(), entry = newGame(story), state = second(story);
  assert.equal(state.tokens['name:Grain'].status, 'transform');
  assert.equal(state.tokens['name:Stone'].status, 'consume');
  assert.equal(state.tokens['name:Flour'].chapter, 1);
  assert.equal(state.tokens['name:Flour'].firstSeen?.chapter, 0);
  assert.equal(state.tokens['name:Water'].firstSeen?.chapter, 1);
  assert.deepEqual(Object.values(state.tokens).map(t => t.firstSeen?.order), [0, 1, 2, 3]);
  const session = captureChapter(state);
  const moved = act(story, state, { type: 'move', item: 'name:Water', chapter: 0, x: 30, y: 50 });
  const made = act(story, moved, { type: 'combine', a: 'name:Flour', b: 'name:Water' });
  assert.equal(made.tokens['name:Bread'].chapter, 0, 'the result is placed in the old scene');
  assert.equal(made.tokens['name:Bread'].firstSeen?.chapter, 1, 'first encounter follows progression, not placement');
  assert.equal(made.tokens['name:Water'].firstSeen?.chapter, 1);
  const legacy = structuredClone(made);
  for (const token of Object.values(legacy.tokens)) delete token.firstSeen;
  assert.deepEqual(encounters(restorePresentation(story, legacy)), encounters(made));
  assert.deepEqual(encounters(session.entry), encounters(state));
  assert.equal(session.entry.tokens['name:Bread'], undefined);
  assert.deepEqual(encounters(newGame(story)), encounters(entry));
});

test('installation never changes the owner or component encounter history', () => {
  const story = parse(`# Box
## First
**Goals**
- Complete -- Box[Motor]
**Items**
- Box (compound)
  - slot: power, accepts Motor
- Motor
`);
  const before = newGame(story);
  const after = act(story, before, { type: 'combine', a: 'name:Motor', b: 'name:Box' });
  assert.equal(after.tokens['name:Motor'].status, 'installed');
  assert.deepEqual(encounters(after), encounters(before));
});

test('edited snapshots preserve metadata, backfill replayable old saves, and mark unknowable history explicitly', () => {
  const story = parse(), state = second(story), legacy = structuredClone(state);
  for (const token of Object.values(legacy.tokens)) delete token.firstSeen;
  legacy.tokens['name:Flour'].x = 210;
  const replayed = restoreLiveState(story, legacy)!;
  assert.deepEqual(encounters(replayed), encounters(state));
  assert.equal(replayed.tokens['name:Flour'].x, 210);
  legacy.actions = [];
  const unknown = restoreLiveState(story, legacy)!;
  assert(Object.values(unknown.tokens).every(t => t.firstSeen?.chapter === null));
  assert.deepEqual(Object.keys(unknown.tokens), Object.keys(state.tokens));
  assert.deepEqual(encounters(restoreLiveState(story, JSON.parse(JSON.stringify(unknown)))!), encounters(unknown));
  for (const invalid of [NaN, Infinity, -1, 1.5]) {
    const bad = structuredClone(state); bad.tokens['name:Flour'].firstSeen!.order = invalid;
    assert.equal(restoreLiveState(story, bad), undefined);
  }
  const badChapter = structuredClone(state); badChapter.tokens['name:Flour'].firstSeen!.chapter = 100;
  assert.equal(restoreLiveState(story, badChapter), undefined);
  const duplicate = structuredClone(state); duplicate.tokens['name:Water'].firstSeen!.order = 0;
  assert.equal(restoreLiveState(story, duplicate), undefined);
});

test('live chapter insertion/renaming remaps encounters; deletion uses unknown group and anchor restoration recovers them', () => {
  const before = parse(), anchor = second(before);
  const inserted = parse(text.replace('## First', '## Prologue\nA new opening.\n\n## First').replaceAll('Grain', 'Seed'));
  const result = reconcileLiveStory(before, inserted, anchor).state;
  assert.equal(result.tokens['name:Seed'].firstSeen?.chapter, 1);
  assert.equal(result.tokens['name:Water'].firstSeen?.chapter, 2);
  assert.equal(result.tokens['name:Seed'].firstSeen?.order, anchor.tokens['name:Grain'].firstSeen?.order);
  const deleted = parse(text.replace(/## First[\s\S]*?(?=## Second)/, ''));
  const temporary = reconcileLiveStory(before, deleted, anchor).state;
  assert.equal(temporary.tokens['name:Flour'].firstSeen?.chapter, null);
  const restored = reconcileLiveStory(before, parse(), anchor).state;
  assert.deepEqual(encounters(restored), encounters(anchor));
  const extra = parse(text.replace('- Water', '- Water\n- Salt'));
  const supplied = reconcileLiveStory(before, extra, anchor).state;
  assert.equal(supplied.tokens['name:Salt'].firstSeen?.chapter, 1);
  assert(supplied.tokens['name:Salt'].firstSeen!.order > anchor.tokens['name:Water'].firstSeen!.order);
});
