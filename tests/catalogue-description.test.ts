import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogueDescription } from '../src/web/catalogue-description.ts';

test('catalogue cover and prose image paths belong to their story, including a site subdirectory', () => {
  const html = catalogueDescription('![cover](assets/cover.webp)\n\nAuthored description.\n\n![remote](https://example.com/picture.webp)', 'my-story/alternate.md', 'https://example.org/games/index.html');
  assert.match(html, /src="https:\/\/example.org\/games\/my-story\/assets\/cover.webp"/);
  assert.match(html, /<p>Authored description.<\/p>/);
  assert.match(html, /src="https:\/\/example.com\/picture.webp"/);
});

test('invalid catalogue artwork cannot break every story card', () => {
  const html = catalogueDescription('![bad](javascript:alert)\n\nStill readable.', 'story/story.md', 'https://example.org/');
  assert.doesNotMatch(html, /src="javascript:/);
  assert.match(html, /Still readable/);
});
