import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogueDescription, renderCatalogue } from '../src/build/catalogue.ts';

test('catalogue cover and prose image paths belong to their story, including a site subdirectory', () => {
  const html = catalogueDescription('![cover](assets/cover.webp)\n\nAuthored description.\n\n![remote](https://example.com/picture.webp)', 'stories/my-story/alternate.md');
  const cover = html.match(/src="([^"]+)"/)![1];
  assert.equal(new URL(cover, 'https://example.org/games/index.html').href, 'https://example.org/games/stories/my-story/assets/cover.webp');
  assert.match(html, /<p>Authored description.<\/p>/);
  assert.match(html, /src="https:\/\/example.com\/picture.webp"/);
});

test('invalid catalogue artwork cannot break every story card', () => {
  const html = catalogueDescription('![bad](javascript:alert)\n\nStill readable.', 'stories/story/story.md');
  assert.doesNotMatch(html, /src="javascript:/);
  assert.match(html, /Still readable/);
});

test('baked catalogue uses portable story links and escaped authored text without bundling artwork', () => {
  const path = 'stories/shared/another story.md';
  const html = renderCatalogue([{path, title: '<A & B>', description: '![cover](assets/a%20b.webp)\n\n![root](/shared/root.webp)\n\n![remote](https://example.com/cover.webp)\n\n<script>alert(1)</script>'}]);
  assert.match(html, /href="make-something.html\?story=stories\/shared\/another%20story.md"/);
  assert.match(html, /&lt;A &amp; B&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /src="stories\/shared\/assets\/a%20b.webp"/);
  assert.match(html, /src="\/shared\/root.webp"/);
  assert.match(html, /src="https:\/\/example.com\/cover.webp"/);
  for (const base of ['https://example.org/', 'https://example.org/make-something/']) {
    const link = new URL(html.match(/href="([^"]+)"/)![1], base);
    assert.equal(new URL(link.searchParams.get('story')!, link).href, new URL(path, base).href);
    assert.equal(new URL(html.match(/src="([^"]+)"/)![1], base).href, new URL('stories/shared/assets/a%20b.webp', base).href);
  }
});
