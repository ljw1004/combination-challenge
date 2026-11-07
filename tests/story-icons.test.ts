import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {storyIconDiagnostics} from '../src/lint/story-icons.ts';
import {renderCatalogue} from '../src/build/catalogue.ts';

test('heading images retain authored placement and provenance while the story title stays textual', () => {
  const text = '\r\n# ![A small 🌍](assets/icon.png) A living world\r\nbackground: ![cover](cover.webp)\r\n\r\nDescription.\r\n\r\n## First\r\nbackground: ![scene](scene.webp)';
  const story = parseStory(text, {file: 'stories/shared/story.md'});
  assert.equal(story.title, 'A living world');
  assert.equal(story.description, 'Description.');
  assert.equal(story.cover, 'cover.webp');
  assert.equal(story.source.line, 2);
  const image = story.titleImages![0];
  assert.equal(image.alt, 'A small 🌍');
  assert.equal(image.url, 'assets/icon.png');
  assert.equal(text.slice(image.source.span!.from, image.source.span!.to), '![A small 🌍](assets/icon.png)');
  const html = renderCatalogue([{path: 'stories/shared/story.md', ...story}]);
  assert.match(html, /<h2 class="story-title"><img src="stories\/shared\/assets\/icon.png" alt="A small 🌍"> A living world<\/h2>/);
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert(!html.includes('background:'));
});

test('story icon lint requires a heading image, accepts any square size, and checks each heading image', () => {
  for (const heading of ['# Title', '# ![]( ) Title']) {
    const story = parseStory(`${heading}\n\n![body](square.png)\n\n## First`);
    assert(lintStory(story, {analysis: false}).some(d => d.code === 'missing-story-icon'));
  }
  const story = parseStory('# ![one](one.png) Title ![two](two.jpeg)\n\n## First');
  assert.equal(story.title, 'Title');
  for (const size of [32, 256, 1024]) assert.deepEqual(storyIconDiagnostics(story, [
    {url: 'one.png', width: size, height: size}, {url: 'two.jpeg', width: 512, height: 512},
  ]), []);
  const diagnostics = storyIconDiagnostics(story, [{url: 'two.jpeg', width: 512, height: 256}]);
  assert.deepEqual(diagnostics.map(d => [d.code, d.severity]), [['story-icon-square', 'error']]);
  assert.deepEqual(diagnostics[0].span, story.titleImages![1].source.span);
  assert.equal(storyIconDiagnostics(story, [{url: 'one.png', width: 0, height: 0}])[0].code, 'story-icon-image');
});

test('catalogue heading art resolves under hosting prefixes and cannot execute authored HTML or URLs', () => {
  const html = renderCatalogue([{path: 'stories/shared/story.md', title: 'Title', heading: '![icon](icon.png) <script>oops</script> ![bad](javascript:alert)', description: ''}]);
  assert(!html.includes('<script>'));
  assert(!html.includes('src="javascript:'));
  assert.equal(new URL(html.match(/src="([^"]+)"/)![1], 'https://example.org/game/index.html').pathname, '/game/stories/shared/icon.png');
});
