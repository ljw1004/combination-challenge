import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {act, newGame} from '../src/engine/game.ts';
import {tutorialAction, hotspotTutorials, completesHotspotTutorial} from '../src/engine/tutorial.ts';
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
  assert.deepEqual(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion, {dragDone: false, hotspotDone: false, goalsDone: true});
  first.finish('dragDone');
  const second = new TutorialProgress('https://example.test/two.md', assert.fail, storage);
  assert.deepEqual(second.completion, {dragDone: false, hotspotDone: false, goalsDone: false});
  first.finish('hotspotDone');
  assert.equal(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion.hotspotDone, true);
  second.finish('dragDone'); first.reset();
  assert.deepEqual(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion, {dragDone: false, hotspotDone: false, goalsDone: false});
  assert.equal(new TutorialProgress('https://example.test/two.md', assert.fail, storage).completion.dragDone, true);
  assert.equal(records.get('game'), 'keep'); assert.equal(records.get('draft'), 'keep');
  const warnings: string[] = [];
  const unavailable = new TutorialProgress('unavailable', message => warnings.push(message), () => {throw Error('Unavailable');});
  unavailable.finish('dragDone'); assert.equal(unavailable.completion.dragDone, true);
  unavailable.reset(); assert.equal(unavailable.completion.dragDone, false);
  assert.equal(warnings.length, 3);
  records.set(first.key, JSON.stringify({dragDone: true, goalsDone: true}));
  assert.deepEqual(new TutorialProgress('https://example.test/one.md', assert.fail, storage).completion, {dragDone: true, hotspotDone: false, goalsDone: true}, 'old accomplishments survive the new lesson');
});

const hotspotFixture = (extra = '') => parseStory(`# Hotspot lesson
## First
![room](room.webp)
**Goals**
- Make C -- C
- Make F -- F
**Hotspots**
- Bench
**Items**
- A
- B
- C
- D
- E
- F
- Other
**Combinations**
- A + B @ Bench -> C
- D + E @ Bench -> F
${extra}`);

test('hotspot lesson starts before preparation, adapts to either order and only finishes on the right kind of success', () => {
  const story = hotspotFixture(), initial = newGame(story);
  assert.deepEqual(hotspotTutorials(story, initial)[0].sources, ['name:A', 'name:B']);
  for (const [first, second] of [['A', 'B'], ['B', 'A']]) {
    const move = {type: 'move' as const, item: `name:${first}`, hotspot: 'name:Bench', chapter: 0, x: 20, y: 20};
    const placed = act(story, initial, move);
    assert.equal(completesHotspotTutorial(move), false);
    const lesson = hotspotTutorials(story, placed)[0];
    assert.deepEqual(lesson.sources, [`name:${second}`]);
    assert.equal(lesson.receiver, `name:${first}`);
    const action = {type: 'combine' as const, a: `name:${second}`, b: `name:${first}`, hotspot: 'name:Bench'};
    const finished = act(story, placed, action);
    assert.equal(completesHotspotTutorial(action), true);
    assert.equal(hotspotTutorials(story, finished).some(candidate => candidate.recipe === lesson.recipe), false);
  }
  assert.equal(initial.tokens['name:A'].hotspot, undefined, 'planning never moves the real items');
  assert.equal(completesHotspotTutorial({type: 'combine', a: 'name:A', b: 'name:B'}), false);
  assert.equal(completesHotspotTutorial({type: 'combine', a: 'name:A', hotspot: 'name:Bench'}), false);
});

test('hotspot opportunities stay selected while valid, then switch, excluding missing fittings and unavailable results', () => {
  const story = hotspotFixture(), state = newGame(story);
  const candidates = hotspotTutorials(story, state), preferred = candidates[1].recipe;
  assert.equal(hotspotTutorials(story, state, preferred)[0].recipe, preferred);
  state.tokens['name:D'].chapter = 1;
  assert.equal(hotspotTutorials(story, state, preferred)[0].recipe, candidates[0].recipe);
  state.excluded.push('name:C');
  assert.deepEqual(hotspotTutorials(story, state), []);
  state.excluded = [];
  state.tokens['name:C'] = {...state.tokens['name:A'], id: 'name:C', status: 'consume'};
  assert.deepEqual(hotspotTutorials(story, state), [], 'retired results cannot be recreated');
  delete state.tokens['name:C'];
  story.recipes[0].a.ref.slots = ['name:Other'];
  assert.deepEqual(hotspotTutorials(story, state), [], 'a present but unfinished compound is not ready');
  state.tokens['name:A'].slots.push('name:Other');
  assert.equal(hotspotTutorials(story, state).length, 1);
});

test('hotspot demonstration avoids intercepted preparations and ambiguous station drops', () => {
  const intercepted = hotspotFixture('- A @ Bench -> Other');
  assert.deepEqual(hotspotTutorials(intercepted, newGame(intercepted))[0].sources, ['name:B', 'name:A'], 'park the other ingredient when the authored first one would perform an operation');
  const blocked = hotspotFixture('- A @ Bench -> Other\n- B @ Bench -> Other');
  assert.equal(hotspotTutorials(blocked, newGame(blocked)).some(candidate => candidate.recipe === blocked.recipes[0].id), false);
  const ambiguous = hotspotFixture('- A + D @ Bench -> Other\n- B + D @ Bench -> Other');
  const state = act(ambiguous, newGame(ambiguous), {type: 'move', item: 'name:D', hotspot: 'name:Bench', chapter: 0, x: 20, y: 20});
  assert.equal(hotspotTutorials(ambiguous, state).some(candidate => candidate.recipe === ambiguous.recipes[0].id), false);
  const parked = act(ambiguous, state, {type: 'move', item: 'name:A', hotspot: 'name:Bench', chapter: 0, x: 70, y: 20});
  assert.equal(hotspotTutorials(ambiguous, parked)[0].receiver, 'name:A', 'an existing receiver can be targeted directly despite other occupants');
});
