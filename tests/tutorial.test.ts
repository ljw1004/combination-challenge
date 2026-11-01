import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {newGame} from '../src/engine/game.ts';
import {tutorialAction} from '../src/engine/tutorial.ts';
import {TutorialProgress} from '../src/web/tutorial-progress.ts';

const recipe = 'A [preserve] + B [preserve] -> C';
const fixture = (rules: string) => `# Tutorial\n## First\n![room](room.webp)\n**Goals**\n- Make C -- C\n**Items**\n- A\n- B\n- C\n**Combinations**\n${rules}`;
const errors = (text: string) => lintStory(parseStory(text), {opportunities: false}).filter(d => d.code.startsWith('tutorial-'));

test('tutorial markers preserve identities, source spans and authored occurrences through recipe deduplication', () => {
  const text = fixture(`- ${recipe}\n- ${recipe} (tutorial)\n- ${recipe} (tutorial)`).replaceAll('\n', '\r\n');
  const story = parseStory(text);
  assert.equal(story.recipes.length, 1);
  assert.equal(story.tutorials?.length, 2);
  assert.equal(story.items['name:C'].name, 'C');
  for (const marker of story.tutorials!) {
    assert.equal(text.slice(marker.source.span!.from, marker.source.span!.to), '(tutorial)');
    assert.equal(text.split('\r\n')[marker.source.line - 1].slice(marker.source.column! - 1, marker.source.column! + 9), '(tutorial)');
  }
  const duplicate = errors(text)[0];
  assert.equal(duplicate.code, 'tutorial-count');
  assert.equal(duplicate.related?.length, 1);
  assert.equal(errors(fixture(`- ${recipe} (tutorial) (tutorial)`))[0].code, 'tutorial-count');
  const named = parseStory(fixture('- A [preserve] + B [preserve] -> "C (tutorial)"'));
  assert.equal(named.tutorials, undefined);
  assert(named.items['name:C (tutorial)']);
  const nested = parseStory('# Nested\n## First\n**Items**\n- A\n  - + B [preserve] -> C (tutorial)');
  assert.equal(nested.tutorials?.[0].recipe, nested.recipes[0].id);
  assert.equal(nested.recipes[0].a.ref.id, 'name:A');
  const inline = parseStory('# Inline\n## First\n**Goals**\n- Make C -- A [preserve] + B [preserve] -> C (tutorial)');
  assert.equal(inline.tutorials?.length, 1);
  assert.equal(inline.chapters[0].goals[0].conditions[0].item.id, 'name:C');
  assert.deepEqual(errors(fixture(`- ${recipe}\t(tutorial)   `)), []);
  const reordered = parseStory(`# Order\n## First\n**Combinations**\n- ${recipe} (tutorial)\n**Goals**\n- Make C -- ${recipe} (tutorial)`);
  assert(reordered.tutorials![0].source.line < reordered.tutorials![1].source.line, 'first marker means source order, regardless of section parsing order');
});

test('lint requires one opening marker and a legal first drag without preparation', () => {
  assert.deepEqual(errors(fixture(`- ${recipe}`)).map(d => d.code), ['tutorial-count']);
  assert.deepEqual(errors(fixture(`- ${recipe} (tutorial)`)), []);
  assert.equal(tutorialAction(parseStory(fixture(`- ${recipe} (tutorial)`)), newGame(parseStory(fixture(`- ${recipe} (tutorial)`))))?.a, 'name:A');
  assert.deepEqual(errors(fixture(`- ${recipe}\n## Later\n**Combinations**\n- ${recipe} (tutorial)`)).map(d => d.code), ['tutorial-chapter']);
  const dependent = fixture(`- D\n- ${recipe}\n- C [preserve] + B [preserve] -> D (tutorial)`);
  assert.equal(errors(dependent)[0].code, 'tutorial-unavailable');
  const context = fixture(`- A [preserve] + B [preserve] @ Bench -> C (tutorial)`).replace('**Combinations**', '**Hotspots**\n- Bench\n**Combinations**');
  assert.equal(errors(context)[0].code, 'tutorial-unavailable', 'receiving placement must already hold');
  const single = fixture('- A [preserve] @ Bench -> C (tutorial)').replace('**Combinations**', '**Hotspots**\n- Bench\n**Combinations**');
  assert.deepEqual(errors(single), [], 'a direct item-to-hotspot operation needs no prior placement');
});

test('tutorial accomplishments persist independently per manuscript and reset without touching progress or drafts', () => {
  const records = new Map<string, string>([['game', 'keep'], ['draft', 'keep']]);
  const storage = () => ({getItem: (key: string) => records.get(key) ?? null, setItem: (key: string, value: string) => {records.set(key, value);}, removeItem: (key: string) => {records.delete(key);}});
  const first = new TutorialProgress('https://example.test/one.md', assert.fail, storage);
  first.finish('goalsDone');
  assert.deepEqual(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion, {dragDone: false, goalsDone: true});
  first.finish('dragDone');
  const second = new TutorialProgress('https://example.test/two.md', assert.fail, storage);
  assert.deepEqual(second.completion, {dragDone: false, goalsDone: false});
  second.finish('dragDone'); first.reset();
  assert.deepEqual(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion, {dragDone: false, goalsDone: false});
  assert.equal(new TutorialProgress('https://example.test/two.md', assert.fail, storage).completion.dragDone, true);
  assert.equal(records.get('game'), 'keep'); assert.equal(records.get('draft'), 'keep');
  const warnings: string[] = [];
  const unavailable = new TutorialProgress('unavailable', message => warnings.push(message), () => {throw Error('Unavailable');});
  unavailable.finish('dragDone'); assert.equal(unavailable.completion.dragDone, true);
  unavailable.reset(); assert.equal(unavailable.completion.dragDone, false);
  assert.equal(warnings.length, 3);
});
