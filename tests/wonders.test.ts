import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act, newGame, replay} from '../src/engine/game.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintStoryImages} from '../src/lint/images.ts';
import {observe, readItem} from '../src/playtest/observe.ts';
import {choose, renderFrame, startAdventure} from '../src/playtest/adventure.ts';
import {encyclopediaEntries} from '../src/web/encyclopedia.ts';
import {encyclopediaBook} from '../src/web/encyclopedia-book.ts';
import {currentArtwork, resultArtwork} from '../src/web/artwork-plan.ts';
import {reconcileLiveStory} from '../src/web/live-story.ts';
import {StoryLanguageDocument} from '../src/story/language-service.ts';

const manuscript = (reading: string) => `# Wonders
## Workshop
background: ![room](room.webp)
**Goals**
- Make it -- Result
**Items**
- A
- B
- Result
${reading.split('\n').map(line => `  ${line}`).join('\n')}
**Combinations**
- A [preserve] + B [preserve] -> Result (tutorial)
## The End
Finished.
`;
const combination = {type: 'combine' as const, a: 'name:A', b: 'name:B'};

test('shared, split, one-sided and empty wonders drive independent creation and deliberate readings', () => {
  const cases = [
    {text: 'Shared.', popup: 'Shared.', encyclopedia: 'Shared.'},
    {text: 'Brief.\n\n---\n\nFull explanation.', popup: 'Brief.', encyclopedia: 'Full explanation.'},
    {text: 'Brief.\n---\n> NOTE: no reference entry', popup: 'Brief.', encyclopedia: ''},
    {text: '> NOTE: no interruption\n---\nFull explanation.', popup: '', encyclopedia: 'Full explanation.'},
    {text: '\n---\n  \n> NOTE: intentionally empty', popup: '', encyclopedia: ''},
    {text: '---\n![Diagram](diagram.svg)', popup: '', encyclopedia: '![Diagram](diagram.svg)'},
    {text: '![Discovery](discovery.svg)\n---', popup: '![Discovery](discovery.svg)', encyclopedia: ''},
    {text: 'An inline --- stays in the prose.', popup: 'An inline --- stays in the prose.', encyclopedia: 'An inline --- stays in the prose.'},
  ];
  for (const {text, popup, encyclopedia} of cases) {
    const story = parseStory(manuscript(text));
    assert.deepEqual(story.diagnostics, [], text);
    const state = act(story, newGame(story), combination);
    assert.deepEqual(state.pending.map(notice => notice.markdown), popup ? [popup] : [], text);
    assert.deepEqual(encyclopediaEntries(story, state).map(entry => entry.id), encyclopedia ? ['name:Result'] : [], text);
    assert.equal(readItem(story, state, 'name:Result').text, encyclopedia || 'No further explanation.');
    assert.equal(observe(story, state).items.find(item => item.id === 'name:Result')!.canRead, !!encyclopedia);
    assert.deepEqual(replay(story, state.actions), state);
  }
});

test('extra dividers are fast lint errors at their exact source spans, with the first split retained in preview', () => {
  for (const newline of ['\n', '\r\n']) {
    const text = manuscript('Brief.\n---\nExplanation.\n---\nMore.\n---\nLast.').replaceAll('\n', newline);
    const story = parseStory(text), errors = lintStory(story, {analysis: false}).filter(d => d.code === 'wonder-divider');
    assert.equal(errors.length, 2);
    for (const error of errors) {
      assert.equal(error.severity, 'error');
      assert.equal(error.stage, 'fast');
      assert.equal(text.slice(error.span.from, error.span.to), '---');
    }
    assert.equal(errors[0].span.from, text.indexOf('---', text.indexOf('Explanation.')));
    assert.equal(story.items['name:Result'].wonders[0].popup, 'Brief.');
    assert.equal(story.items['name:Result'].wonders[0].encyclopedia, 'Explanation.\nMore.\nLast.');
  }
  const commented = parseStory(manuscript('Brief.\n---\n> NOTE: these are author notes\n> ---\n> ---\nExplanation.'));
  assert.deepEqual(commented.diagnostics, []);
});

test('each conditional wonder has its own split; both halves wait for the same fittings', () => {
  const story = parseStory(`# Fittings
## Workshop
**Goals**
- Finish -- Box[Motor]
**Items**
- Box (compound)
  - slot: power, accepts Motor

  [Motor] It runs.

  ---

  How the motor works.

- Box

  [Motor]
  ---
  ![Motor diagram](motor.svg)

- Motor
`);
  assert.deepEqual(story.diagnostics, []);
  let state = newGame(story);
  assert.deepEqual(encyclopediaEntries(story, state), []);
  state = act(story, state, {type: 'combine', a: 'name:Motor', b: 'name:Box'});
  assert.deepEqual(state.pending.map(notice => notice.markdown), ['It runs.']);
  assert.deepEqual(encyclopediaEntries(story, state).map(entry => entry.name), ['Box']);
  const html = encyclopediaBook(story, state, 'name:Box', true, path => path);
  assert.match(html, /How the motor works/);
  assert.match(html, /src="motor.svg"/);
  assert.doesNotMatch(html, /It runs|---/);
});

test('live popup edits refresh only that half, remove empty popups, and retain acknowledgments', () => {
  const before = parseStory(manuscript('Brief.\n---\nExplanation.'));
  const built = act(before, newGame(before), combination);
  const edited = parseStory(manuscript('Updated.\n---\nExpanded explanation.'));
  assert.deepEqual(reconcileLiveStory(before, edited, built).state.pending.map(n => n.markdown), ['Updated.']);
  const silent = parseStory(manuscript('---\nExpanded explanation.'));
  const updated = reconcileLiveStory(before, silent, built);
  assert.equal(updated.state.pending.length, 0);
  assert.deepEqual(encyclopediaEntries(silent, updated.state).map(entry => entry.name), ['Result']);
  const dismissed = act(before, built, {type: 'dismiss'});
  const restored = reconcileLiveStory(silent, edited, reconcileLiveStory(before, silent, dismissed).state).state;
  assert.equal(restored.pending.length, 0);
  assert.equal(restored.seen.filter(key => key.startsWith('wonder:')).length, 1);
});

test('text play and completed checkpoint history expose only the popup half', () => {
  for (const text of ['Brief.\n---\nReference only.', '---\nReference only.']) {
    const story = parseStory(manuscript(text));
    for (const playStyle of ['fast', 'detailed'] as const) {
      const start = startAdventure(story, {mode: 'chapter', playStyle});
      const after = choose(story, start, 1, playStyle === 'fast' ? 1 : {combine: 'A', with: 'B'});
      const history = startAdventure(story, {chapter: 2, playStyle});
      for (const frame of [after.frame, history.frame]) {
        assert.doesNotMatch(renderFrame(frame), /Reference only|---/);
        assert.deepEqual(frame.messages.filter(message => message.kind === 'wonder').map(message => message.text.trim()), text.startsWith('Brief.') ? ['Brief.'] : []);
      }
    }
  }
});

test('creation preloads popup illustrations only, while image lint checks both halves', () => {
  const text = manuscript('![Popup](popup.svg)\n---\n![Reference](reference.svg)');
  const story = parseStory(text), state = newGame(story);
  assert.deepEqual(resultArtwork(story, state, combination), ['popup.svg']);
  const created = currentArtwork(story, act(story, state, combination));
  assert(created.includes('popup.svg'));
  assert(!created.includes('reference.svg'));
  assert.deepEqual(lintStoryImages(story, text).map(d => text.slice(d.span.from, d.span.to)), ['room.webp', 'popup.svg', 'reference.svg']);
});

test('author hover distinguishes different reading purposes and omits empty halves', () => {
  for (const text of ['Brief.\n---\nExplanation.', '---\nExplanation.']) {
    const source = manuscript(text), document = new StoryLanguageDocument(source);
    const hover = document.hover(source.indexOf('Result'))!;
    assert.equal(hover.kind, 'symbol');
    if (hover.kind !== 'symbol') continue;
    assert.deepEqual(hover.descriptions.map(d => [d.purpose, d.text]), [
      ...(text.startsWith('Brief.') ? [['Popup', 'Brief.']] : []), ['Encyclopedia', 'Explanation.'],
    ]);
  }
});
