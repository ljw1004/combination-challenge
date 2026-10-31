import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseStory } from '../src/story/parser.ts';
import { lintStory } from '../src/lint/lint.ts';
import { lintStoryImages } from '../src/lint/images.ts';

const manuscript = (description: string, intro = '![room](https://example.com/room.webp)\n\nOpening words.') =>
  `# A story\n\n${description}\n\n## First\n${intro}\n`;

test('cover uses the leading standalone description image while retaining the full description', () => {
  const description = '![cover](assets/cover.webp)\n\nA story worth exploring.\n\n![later](assets/later.webp)';
  const story = parseStory(manuscript('\n \n' + description).replaceAll('\n', '\r\n'));
  assert.equal(story.cover, 'assets/cover.webp');
  assert.equal(story.description, description);
  assert.equal(story.chapters[0].image, 'https://example.com/room.webp');
  assert.equal(story.chapters[0].intro, 'Opening words.');
});

test('later, inline and same-paragraph images are not covers or chapter backgrounds', () => {
  for (const prose of [
    'Words first.\n\n![later](later.webp)',
    '![inline](inline.webp) and prose.',
    '![inline](inline.webp)\nMore in this paragraph.',
    'Before ![inline](inline.webp)',
    '![one](one.webp)\n![two](two.webp)',
    '',
  ]) {
    const story = parseStory(manuscript(prose, prose));
    assert.equal(story.cover, undefined, prose);
    assert.equal(story.chapters[0].image, undefined, prose);
    assert.equal(story.description, prose);
  }
  const coverOnly = parseStory(manuscript('![cover](cover.webp)', 'Opening words.'));
  assert(lintStory(coverOnly, { analysis: false }).some(d => d.code === 'missing-opening-image'),
    'a story cover does not replace the required first chapter setting');
});

test('CLI cover artwork checks resolve relative to the manuscript and preserve CRLF source spans', () => {
  const folder = mkdtempSync(join(tmpdir(), 'combination-cover-'));
  try {
    const markdown = manuscript('![cover](assets/cover.webp)\n\nDescription.').replaceAll('\n', '\r\n');
    const story = parseStory(markdown, { file: join(folder, 'story.md') });
    const missing = lintStoryImages(story, markdown);
    assert.deepEqual(missing.map(d => [d.code, markdown.slice(d.span.from, d.span.to)]), [['missing-image', 'assets/cover.webp']]);
    mkdirSync(join(folder, 'assets'));
    writeFileSync(join(folder, 'assets/cover.webp'), 'artwork placeholder for existence check');
    assert.deepEqual(lintStoryImages(story, markdown), []);
    const remote = manuscript('![cover](https://example.com/cover.webp)');
    assert.deepEqual(lintStoryImages(parseStory(remote, { file: join(folder, 'story.md') }), remote), []);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
