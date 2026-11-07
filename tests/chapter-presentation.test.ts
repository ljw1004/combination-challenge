import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Text} from '@codemirror/state';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintStoryImages} from '../src/lint/images.ts';
import {itemPresentation} from '../src/engine/presentation.ts';
import {act, label, newGame, replay} from '../src/engine/game.ts';
import {checkpoint} from '../src/debug/checkpoint.ts';
import {board} from '../src/playtest/adventure.ts';
import {detailedObjects, detailedTurn} from '../src/playtest/detailed.ts';
import {currentArtwork, lookaheadArtwork, scrollbackArtwork} from '../src/web/artwork-plan.ts';
import {chapterHeadings} from '../src/web/editor-chapters.ts';
import {reconcileLiveStory} from '../src/web/live-story.ts';
import {changingArray} from './fixtures/chapter-presentation.ts';

const errors = (text: string) => lintStory(parseStory(text), {analysis: false}).filter(d => d.severity === 'error');

test('chapter progress resolves independent names and icons in story order, including legal replay and text players', () => {
  const story = parseStory(changingArray);
  assert.deepEqual(errors(changingArray), []);
  assert.deepEqual(story.chapters.map(c => [c.id, c.name]), [['chapter:0','Landing'], ['id:storm','Amber: Dawn'], ['chapter:2','Aftermath'], ['id:clear','Clear skies']]);
  const expected = ['Solar array', 'Dust-covered solar array', 'Weathered solar array', 'Array in clear skies'];
  for (const [chapter, name] of expected.entries()) {
    const state = checkpoint(story, chapter);
    assert.equal(state.chapter, chapter);
    assert.equal(label(story, state, 'id:array'), name);
    assert.equal(itemPresentation(story, chapter, 'id:array').icon?.url, `assets/${chapter ? 'dusty' : 'clean'}.svg`);
    assert.equal(label(story, replay(story, state.actions), 'id:array'), name);
    assert(board(story, state).includes(name));
    assert(detailedObjects(story, state).some(object => object.id === 'id:array' && object.name === name));
    assert.deepEqual(story.items['id:array'].wonders.map(w => w.popup), ['A permanent account of the array.']);
  }
  let storm = checkpoint(story, 1);
  while (storm.pending.length) storm = act(story, storm, {type:'dismiss'});
  assert.equal(detailedTurn(story, storm, {combine: 'Dust-covered solar array', with: 'Storm bench'}).state.achieved.includes(story.chapters[1].goals[0].id), true);
  assert.throws(() => detailedTurn(story, storm, {inspect: 'Solar array'}), /name|match|unknown/i);
});

test('crossing a skipped chapter applies its changes; replaying an earlier state restores earlier appearances', () => {
  const story = parseStory(changingArray.replace('- Inspect -- `array` @ Storm bench', '- Already done -- Started'));
  const state = checkpoint(story, 2);
  assert(!state.visited.includes(1));
  assert.equal(itemPresentation(story, state.chapter, 'id:array').icon?.url, 'assets/dusty.svg');
  assert.equal(label(story, newGame(story), 'id:array'), 'Solar array');
  assert.equal(itemPresentation(story, 0, 'id:array').icon?.url, 'assets/clean.svg');
});

test('artwork planning selects current and scrollback variants and preloads changes to carried items', () => {
  const story = parseStory(changingArray), landing = checkpoint(story, 0), storm = checkpoint(story, 1);
  assert(!currentArtwork(story, landing).includes('assets/dusty.svg'));
  assert(lookaheadArtwork(story, landing, true).includes('assets/dusty.svg'));
  assert(currentArtwork(story, storm).includes('assets/dusty.svg'));
  assert(scrollbackArtwork(story, storm).includes('assets/dusty.svg'));
  assert.equal(storm.tokens['id:relic'].chapter, 0);
  assert(lintStoryImages(story, changingArray).some(d => d.code === 'missing-image' && changingArray.slice(d.span.from, d.span.to) === 'assets/dusty.svg'));
});

test('chapter references accept the existing quoting and emphasis delimiters, never bare names or numbers', () => {
  for (const target of ['`storm`', '"Amber: Dawn"', "'Amber: Dawn'", '*Amber: Dawn*', '_Amber: Dawn_', '**Amber: Dawn**', '__Amber: Dawn__']) {
    const text = changingArray.replace('from chapter `storm`: Dust-covered', `from chapter ${target} : Dust-covered`);
    assert.deepEqual(errors(text), [], target);
    assert.equal(itemPresentation(parseStory(text), 1, 'id:array').name, 'Dust-covered solar array');
  }
  for (const target of ['3', 'Amber Dawn', '`missing`', '"Missing"', '``', '""', '`storm` Extra']) {
    const text = changingArray.replace('from chapter `storm`: Dust-covered', `from chapter ${target}: Dust-covered`);
    assert(errors(text).some(d => ['from-chapter-syntax','unknown-chapter'].includes(d.code)), target);
  }
});

test('lint rejects identity collisions, ambiguous titles, conflicting changes, missing item IDs and obsolete renames', () => {
  const cases: [string, string][] = [
    [changingArray.replace('## `clear` Clear skies', '## `storm` Clear skies'), 'duplicate-chapter-id'],
    [changingArray.replace('`array` Solar array', '`storm` Solar array'), 'namespace-clash'],
    [changingArray.replace('- Storm bench', '- `storm` Storm bench'), 'namespace-clash'],
    [changingArray.replace('## Aftermath', '## Amber: Dawn'), 'ambiguous-chapter'],
    [changingArray.replace('  - from chapter `clear`:', '  - from chapter `storm`:'), 'conflicting-presentation'],
    [changingArray.replace('  - from chapter `storm`: Dust-covered solar array', '  - from chapter `storm` icon: ![other](assets/other.svg)'), 'conflicting-presentation'],
    [changingArray.replace('`array` Solar array', 'Solar array'), 'from-chapter-item-id'],
    [changingArray.replace('- Inspect -- `array`', '- Inspect -- Solar array'), 'presentation-item-reference'],
    [changingArray.replace('- Inspect -- `array`', '- Inspect -- Dust-covered solar array'), 'presentation-item-reference'],
    [changingArray.replace('- `array` Solar array', '- `array` Solar array (or from chapter "Aftermath", Dusty)'), 'obsolete-rename'],
    [changingArray.replace('from chapter `storm`: Dust-covered', 'after chapter `storm`: Dust-covered'), 'from-chapter-syntax'],
    [changingArray.replace('(circular)', '(center 195px, 422px)'), 'icon-position'],
    [changingArray.replace('## `storm` Amber: Dawn', '## `storm`'), 'chapter-heading'],
    [changingArray.replace(': Dust-covered solar array', ': ** **'), 'from-chapter-syntax'],
    [changingArray.replace('  - from chapter `storm`: Dust-covered solar array', '- from chapter `storm`: Dust-covered solar array'), 'from-chapter-context'],
  ];
  for (const [text, code] of cases) assert(errors(text).some(d => d.code === code), `${code}: ${errors(text).map(d => d.code).join(', ')}`);
  const identical = changingArray.replace('  - from chapter `storm`: Dust-covered solar array', '  - from chapter `storm`: Dust-covered solar array\n  - from chapter "Amber: Dawn": Dust-covered solar array');
  assert.deepEqual(errors(identical), []);
  assert.equal(Object.keys(parseStory(changingArray).items).some(id => id.includes('from chapter')), false);
  const unknown = changingArray.replace('from chapter `storm`: Dust-covered', 'from chapter `unknown`: Dust-covered').replaceAll('\n', '\r\n');
  const diagnostic = errors(unknown).find(d => d.code === 'unknown-chapter')!;
  assert.equal(unknown.slice(diagnostic.span.from, diagnostic.span.to), '`unknown`');
});

test('chapter IDs preserve live progress through simultaneous title changes and chapter reordering', () => {
  const before = parseStory(changingArray), state = checkpoint(before, 1);
  const first = changingArray.indexOf('## `storm`'), second = changingArray.indexOf('## Aftermath'), last = changingArray.indexOf('## `clear`');
  const reordered = changingArray.slice(0, first) + changingArray.slice(second, last) + changingArray.slice(first, second) + changingArray.slice(last);
  const text = reordered.replaceAll('Amber: Dawn', 'Red noon');
  const after = parseStory(text), update = reconcileLiveStory(before, after, state);
  assert.equal(update.chapters.get(1), 2);
  assert.equal(update.state.chapter, 2);
  assert.equal(label(after, update.state, 'id:array'), 'Dust-covered solar array');
  assert.deepEqual(chapterHeadings(Text.of(text.split('\n'))).map(c => c.heading), ['Landing','Aftermath','Red noon','Clear skies']);
});
