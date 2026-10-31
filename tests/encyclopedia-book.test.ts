import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStory } from '../src/story/parser.ts';
import { newGame } from '../src/engine/game.ts';
import { encyclopediaBook } from '../src/web/encyclopedia-book.ts';

const story = parseStory(`# Book fixture
## Workshop
**Items**
- Stone

  A stone explanation.

  *Authored emphasis.*

- Grain

  A grain explanation.
`, { id: 'book-fixture' });

test('book markup keeps index and detail together with page-local Close controls and a separate Back control', () => {
  const state = newGame(story);
  const empty = encyclopediaBook(story, state, undefined, false, path => path);
  assert.match(empty, /class="encyclopedia-index"/);
  assert.match(empty, /class="encyclopedia-detail"/);
  assert.match(empty, /<nav class="encyclopedia-index"[^>]*><header class="encyclopedia-header"><h1>Index<\/h1><button data-command="close">Close<\/button><\/header>/);
  assert.match(empty, /class="encyclopedia-spine" aria-hidden="true"/);
  assert.match(empty, /<section class="encyclopedia-detail"[^>]*><header[^>]*><button data-command="encyclopedia-back"/);
  assert.doesNotMatch(empty, /<h1>Encyclopedia<\/h1>/);
  assert.match(empty, /Choose an item from the index\./);
  assert.match(empty, /data-command="encyclopedia-back" hidden/);
  assert.equal((empty.match(/data-command="close"/g) ?? []).length, 2);
  const selected = encyclopediaBook(story, state, 'name:Stone', true, path => path);
  assert.match(selected, /class="encyclopedia-pages show-detail"/);
  assert.match(selected, /data-reading="name:Stone" aria-current="true"/);
  assert.match(selected, /<h2>Workshop<\/h2>/);
  assert.match(selected, /<p>A stone explanation\.<\/p><p><em>Authored emphasis\.<\/em><\/p>/);
  assert.equal((selected.match(/data-command="close"/g) ?? []).length, 2);
  assert.equal((selected.match(/data-command="encyclopedia-back"/g) ?? []).length, 1);
  assert.doesNotMatch(selected, /open-book|wonder-book|result-caption/);
});

test('returning to index retains selected entry and prose; index labels remain escaped', () => {
  const renamed = structuredClone(story), state = newGame(renamed);
  renamed.items['name:Stone'].name = '<Stone & rock>';
  const returned = encyclopediaBook(renamed, state, 'name:Stone', false, path => path);
  assert.doesNotMatch(returned, /show-detail/);
  assert.match(returned, /data-reading="name:Stone" aria-current="true">&lt;Stone &amp; rock&gt;<\/a>/);
  assert.match(returned, /A stone explanation\./);
  assert.doesNotMatch(returned, /<Stone & rock>/);
});
