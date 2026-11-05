import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseStory } from '../src/story/parser.ts';
import { lintStory } from '../src/lint/lint.ts';
import { lintStoryImages } from '../src/lint/images.ts';
import { activeHotspots, background } from '../src/engine/analysis.ts';
import { coverArtwork } from '../src/web/artwork-plan.ts';

const manuscript = (description: string, intro = 'background: ![room](https://example.com/room.webp)\n\nOpening words.') =>
  `# A story\n\n${description}\n\n## First\n${intro}\n`;

const backgroundDiagnostics = (text: string) => lintStory(parseStory(text), {analysis: false})
  .filter(d => d.code.startsWith('background-'));

test('explicit backgrounds are separate from catalogue and chapter reading images, including adjacent lines and CRLF', () => {
  const description = '![catalogue](assets/catalogue.webp)\n\nA story worth exploring.';
  const intro = '![portrait](assets/portrait.webp)\n\nOpening words.';
  const text = manuscript('\n \nbackground: ![cover](assets/cover.webp)\n' + description,
    'background: ![room](assets/room.webp)\n' + intro).replaceAll('\n', '\r\n');
  const story = parseStory(text);
  assert.equal(story.cover, 'assets/cover.webp');
  assert.equal(story.description, description);
  assert.equal(story.chapters[0].image, 'assets/room.webp');
  assert.equal(story.chapters[0].intro, intro);
  assert.deepEqual(backgroundDiagnostics(text), []);
});

test('unprefixed images always remain prose, even first; a cover does not supply the opening chapter setting', () => {
  for (const prose of [
    '![first](first.webp)',
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
    assert.equal(story.chapters[0].intro, prose);
  }
  const coverOnly = parseStory(manuscript('background: ![cover](cover.webp)', '![reading](reading.webp)'));
  assert(lintStory(coverOnly, { analysis: false }).some(d => d.code === 'missing-opening-image'));
});

test('a leading popup image leaves inherited scenery and hotspots intact; cover fallback ignores catalogue art', () => {
  const story = parseStory(manuscript('![catalogue](catalogue.webp)',
    'background: ![room](room.webp)\n**Hotspots**\n- Bench\n**Items**\n- Bench')
    + '\n## Later\n![portrait](portrait.webp)\n\nRead this portrait.');
  assert.equal(story.chapters[1].image, undefined);
  assert.equal(story.chapters[1].intro, '![portrait](portrait.webp)\n\nRead this portrait.');
  assert.equal(background(story, 1), 'room.webp');
  assert.deepEqual(activeHotspots(story, 1), ['name:Bench']);
  assert.deepEqual(coverArtwork(story), ['room.webp']);
});

test('misplaced and duplicate background declarations produce located fast lint errors and never become readings or scenery', () => {
  const declaration = 'background: ![late](late.webp)';
  for (const prefix of ['Words first.\n', '![reading](reading.webp)\n', 'background: ![first](first.webp)\n', '> NOTE: author comment\n']) {
    for (const text of [manuscript(prefix + declaration), manuscript('', prefix + declaration)]) {
      const crlf = text.replace('# A story', '# 🪴 Story').replaceAll('\n', '\r\n');
      const diagnostics = backgroundDiagnostics(crlf);
      assert.deepEqual(diagnostics.map(d => [d.code, d.severity, d.stage, crlf.slice(d.span.from, d.span.to)]),
        [['background-position', 'error', 'fast', declaration]], prefix);
      const story = parseStory(crlf);
      assert.notEqual(story.cover, 'late.webp');
      assert.notEqual(story.chapters[0].image, 'late.webp');
      assert(!story.description.includes('background:'));
      assert(!story.chapters[0].intro.includes('background:'));
    }
  }
  for (const text of [
    declaration + '\n' + manuscript(''),
    manuscript('', '**Goals**\n' + declaration),
    manuscript('', '**Items**\n- Thing\n  ' + declaration),
  ]) assert.deepEqual(backgroundDiagnostics(text).map(d => d.code), ['background-position']);
  const duplicate = parseStory(manuscript('background: ![first](first.webp)\n' + declaration));
  assert.equal(duplicate.cover, 'first.webp', 'a duplicate does not replace the valid first declaration');
  const comment = manuscript('> NOTE: background: is mentioned here.\n> background: is still a comment.');
  assert.deepEqual(backgroundDiagnostics(comment), []);
});

test('background declarations require exactly one Markdown image with a nonempty path on the same line', () => {
  for (const value of ['', 'cover.webp', '![]( )', '![]()', '![](cover.webp) caption', '![](one.webp) ![](two.webp)']) {
    const text = manuscript('background: ' + value, 'background: ' + value);
    assert.deepEqual(backgroundDiagnostics(text).map(d => d.code), ['background-syntax', 'background-syntax'], value);
    const story = parseStory(text);
    assert.equal(story.cover, undefined);
    assert.equal(story.chapters[0].image, undefined);
    assert.equal(story.description, '');
    assert.equal(story.chapters[0].intro, '');
  }
  for (const declaration of ['background:![](cover.webp)', 'background : ![](cover.webp)']) {
    assert.deepEqual(backgroundDiagnostics(manuscript(declaration)).map(d => d.code), ['background-syntax']);
  }
});

test('CLI artwork checks include independent catalogue images and cover backgrounds with CRLF source spans', () => {
  const folder = mkdtempSync(join(tmpdir(), 'combination-cover-'));
  try {
    const markdown = manuscript('background: ![cover](assets/cover.webp)\n\n![catalogue](assets/catalogue.webp)\n\nDescription.').replaceAll('\n', '\r\n');
    const story = parseStory(markdown, { file: join(folder, 'story.md') });
    const missing = lintStoryImages(story, markdown);
    assert.deepEqual(missing.map(d => [d.code, markdown.slice(d.span.from, d.span.to)]),
      [['missing-image', 'assets/cover.webp'], ['missing-image', 'assets/catalogue.webp']]);
    mkdirSync(join(folder, 'assets'));
    for (const name of ['cover', 'catalogue']) writeFileSync(join(folder, `assets/${name}.webp`), 'artwork placeholder for existence check');
    assert.deepEqual(lintStoryImages(story, markdown), []);
    const remote = manuscript('background: ![cover](https://example.com/cover.webp)\n![catalogue](https://example.com/catalogue.webp)');
    assert.deepEqual(lintStoryImages(parseStory(remote, { file: join(folder, 'story.md') }), remote), []);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
