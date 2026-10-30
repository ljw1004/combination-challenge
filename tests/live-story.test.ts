import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStory } from '../src/story/parser.ts';
import { act, chapterComplete, newGame, recipeFor } from '../src/engine/game.ts';
import { reconcileLiveStory, recoverPreviewStory, restoreLiveState } from '../src/web/live-story.ts';
import type { State } from '../src/engine/types.ts';
import type { Story } from '../src/story/types.ts';

const parse = (text: string) => parseStory(text, { id: 'editor', file: 'story.md' });
const dismiss = (story: Story, initial: State) => {
  let state = initial;
  while (state.pending.length) state = act(story, state, { type: 'dismiss' });
  return state;
};
const fixture = `# Test

## Workshop

![workshop](old.webp)

An old introduction.

**Goals**
- Build it -- \`result\`

**Items**
- \`wood\` Wood
- \`tool\` Tool
- \`result\` Result

  An old discovery.

**Combinations**
- \`wood\` [preserve] + \`tool\` [preserve] -> \`result\`
`;

test('live text, image and heading edits retain cards and refresh pending/seen explanations', () => {
  const before = parse(fixture), edited = parse(fixture.replace('Workshop', 'Renamed workshop').replace('old.webp', 'new.webp').replace('old introduction', 'new introduction').replace('Build it', 'Build something').replace(' Wood', ' Timber'));
  const original = newGame(before);
  original.tokens['id:wood'].x = 73; original.tokens['id:wood'].y = 291;
  const snapshot = structuredClone(original), result = reconcileLiveStory(before, edited, original);
  assert.equal(result.story.chapters[0].image, 'new.webp');
  assert.equal(result.story.items['id:wood'].name, 'Timber');
  assert.equal(result.state.tokens['id:wood'].x, 73);
  assert.equal(result.state.tokens['id:wood'].y, 291);
  assert.match(result.state.pending[0].markdown, /new introduction/);
  assert.equal(result.chapterRemoved, false);
  assert.deepEqual(original, snapshot, 'the interaction anchor remains immutable');

  const built = act(before, dismiss(before, original), { type: 'combine', a: 'id:wood', b: 'id:tool' });
  const withNewLines = parse(fixture.replace('- `result` Result', '\n\n- `result` Result').replace('An old discovery.', 'An updated discovery.'));
  const updated = reconcileLiveStory(before, withNewLines, built);
  assert.equal(updated.state.pending[0].markdown, 'An updated discovery.');
  assert.notEqual(updated.state.pending[0].key, built.pending[0].key);
  const seen = reconcileLiveStory(before, withNewLines, dismiss(before, built));
  assert(seen.state.seen.includes(updated.state.pending[0].key));
  assert.equal(seen.state.pending.length, 0);
});

test('changed conditions are re-evaluated while unchanged historical placement remains achieved', () => {
  const text = `# Test
## Workshop
![room](room.webp)
**Goals**
- Place wood -- Wood @ Bench
- Build result -- Result
**Hotspots**
- Bench
**Items**
- Wood
- Tool
**Combinations**
- Wood [preserve] + Tool [preserve] -> Result
`;
  const before = parse(text);
  let original = newGame(before);
  original = act(before, original, { type: 'move', item: 'name:Wood', chapter: 0, x: 80, y: 400, hotspot: 'name:Bench' });
  original = act(before, original, { type: 'move', item: 'name:Wood', chapter: 0, x: 19, y: 120 });
  const changed = parse(text.replace('Place wood -- Wood @ Bench', 'Place wood -- Tool @ Bench'));
  const result = reconcileLiveStory(before, changed, original);
  assert(!result.state.achieved.includes(changed.chapters[0].goals[0].id));
  assert.equal(result.state.tokens['name:Wood'].x, 19);
  const textOnly = parse(text.replace('Place wood --', 'Wood was placed --'));
  assert(reconcileLiveStory(before, textOnly, original).state.achieved.includes(textOnly.chapters[0].goals[0].id));
  const satisfied = parse(text.replace('Build result -- Result', 'Have a tool -- Tool'));
  const completed = reconcileLiveStory(before, satisfied, original);
  assert(chapterComplete(satisfied, completed.state));
  assert.equal(completed.state.chapter, 0, 'editing reveals normal continuation without unsolicited advancement');
});

test('recipe changes preserve existing constructions and introduce only newly needed primitives', () => {
  const before = parse(fixture);
  const original = act(before, dismiss(before, newGame(before)), { type: 'combine', a: 'id:wood', b: 'id:tool' });
  original.tokens['id:result'].x = 212; original.tokens['id:result'].y = 387;
  const edited = parse(fixture.replace('Build it -- `result`', 'Finish -- Finished').replace('**Combinations**', '**Combinations**\n- `result` [preserve] + Paint [consume] -> Finished').replace('- `wood` [preserve] + `tool` [preserve] -> `result`', '- `wood` [transform] + `tool` [preserve] -> Different'));
  const result = reconcileLiveStory(before, edited, original);
  assert.equal(result.state.tokens['id:result'].x, 212);
  assert.equal(result.state.tokens['id:result'].y, 387);
  assert(result.state.tokens['name:Paint']);
  assert(!result.state.tokens['name:Different']);
  assert(recipeFor(edited, result.state, { type: 'combine', a: 'id:result', b: 'name:Paint' }));
  assert.deepEqual(result.state.actions, []);
  assert.deepEqual(restoreLiveState(edited, JSON.parse(JSON.stringify(result.state))), result.state);
  const malformed = structuredClone(result.state);
  malformed.tokens['id:result'].x = NaN;
  assert.equal(restoreLiveState(edited, malformed), undefined);
});

test('temporary deletion and restoration use the original anchor rather than a transient fallback', () => {
  const text = `# Test
## First
![first](first.webp)
**Goals**
- Ready -- A
**Items**
- A

## Second
![second](second.webp)

Second introduction.
**Goals**
- Build -- Result
**Combinations**
- A [preserve] + Tool [preserve] -> Result

## Third
![third](third.webp)

Third introduction.
`;
  const before = parse(text), original = act(before, dismiss(before, newGame(before)), { type: 'advance' });
  assert.equal(original.chapter, 1);
  original.tokens['name:A'].x = 49; original.tokens['name:A'].y = 267;
  const deleted = parse(text.replace(/## Second[\s\S]*?(?=## Third)/, ''));
  const temporary = reconcileLiveStory(before, deleted, original);
  assert(temporary.chapterRemoved);
  assert.equal(temporary.story.chapters[temporary.state.chapter].name, 'Third');
  const restored = reconcileLiveStory(before, parse(text), original);
  assert.equal(restored.state.chapter, 1);
  assert.equal(restored.state.tokens['name:A'].x, 49);
  assert.equal(restored.state.tokens['name:A'].y, 267);
  assert.equal(restored.state.pending[0].markdown, 'Second introduction.');

  const blank = reconcileLiveStory(before, parse(''), original);
  assert.equal(blank.story.chapters.length, 1);
  assert.equal(blank.state.chapter, 0);
  assert.deepEqual(blank.state.tokens, {});
  assert(restoreLiveState(blank.story, blank.state));
  assert.equal(recoverPreviewStory(parse('')).chapters[0].name, 'Unfinished story');
});

test('partial buffers recover available structure and declarations renamed in place keep position', () => {
  const text = '# Test\n## Room\n![room](room.webp)\n**Items**\n- Wood\n- Tool\n**Goals**\n- Finish -- Done\n**Combinations**\n- Wood [preserve] + Tool [preserve] -> Done';
  const before = parse(text), original = newGame(before);
  original.tokens['name:Wood'].x = 91;
  const renamed = parse(text.replaceAll('Wood', 'Timber'));
  const changed = reconcileLiveStory(before, renamed, original);
  assert.equal(changed.items.get('name:Wood'), 'name:Timber');
  assert.equal(changed.state.tokens['name:Timber'].x, 91);
  const partial = parse(text.replace('Finish -- Done', 'Finish'));
  assert(partial.diagnostics.some(d => d.code === 'empty-goal'));
  const recovering = reconcileLiveStory(before, partial, original);
  assert.equal(recovering.state.tokens['name:Wood'].x, 91);
  assert.equal(recovering.story.chapters[0].goals[0].conditions.length, 0);
  assert.equal(recovering.state.chapter, 0);
});

test('changing a goal-only ingredient does not rename its old witness into a new satisfied condition', () => {
  const text = '# Test\n## Room\n![room](room.webp)\n\n**Goals**\n- Place the resource -- Wood @ Bench\n**Hotspots**\n- Bench';
  const before = parse(text);
  const original = act(before, newGame(before), { type: 'move', item: 'name:Wood', chapter: 0, x: 120, y: 410, hotspot: 'name:Bench' });
  assert(original.achieved.includes(before.chapters[0].goals[0].id));
  const changed = parse(text.replace('Wood @ Bench', 'Stone @ Bench'));
  const result = reconcileLiveStory(before, changed, original);
  assert(!result.items.has('name:Wood'));
  assert(result.state.tokens['name:Stone']);
  assert.equal(result.state.tokens['name:Stone'].hotspot, undefined);
  assert(!result.state.achieved.includes(changed.chapters[0].goals[0].id));
});
