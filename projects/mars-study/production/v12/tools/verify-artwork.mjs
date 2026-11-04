import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {parseStory} from '../../../../../src/story/parser.ts';
import {lintStoryImages} from '../../../../../src/lint/images.ts';
import {checkpoint} from '../../../../../src/debug/checkpoint.ts';
import {assertSameStory, artworkId} from './story-semantics.mjs';
import {options, loadArtwork} from './artwork-manifests.mjs';

// Asset decoding is deliberately separate from gameplay verification. Legal
// replay uses the shared checkpoint planner; this script implements no moves.
let browser;
try {
  const config = options(undefined, ['skip-checkpoints']), artwork = loadArtwork(config);
  const markdown = fs.readFileSync(config.story, 'utf8');
  const story = parseStory(markdown, {file: config.story});
  const baseline = parseStory(fs.readFileSync(config.baseline, 'utf8'));
  assert.equal(story.diagnostics.filter(value => value.severity === 'error').length, 0, 'Manuscript has parser errors.');
  assertSameStory(story, baseline);
  const missing = lintStoryImages(story, markdown);
  assert.equal(missing.length, 0, missing.map(value => value.message).join('\n'));
  assert.deepEqual(Object.keys(story.items).sort(), [...artwork.items.keys()].sort(), 'Catalogue identity coverage differs.');
  assert.equal(story.chapters.length, artwork.sceneManifest.scenes.length, 'Scene coverage differs.');
  assert.equal(Object.values(story.items).reduce((sum, item) => sum + item.slots.length, 0), artwork.slots.size, 'Fitted-layer coverage differs.');
  assert.equal(Object.values(story.items).reduce((sum, item) => sum + item.presentations.filter(value => value.icon).length, 0), artwork.variants.length, 'Appearance coverage differs.');
  for (const asset of artwork.paths) assert(fs.existsSync(path.resolve(path.dirname(config.story), asset)), `Missing production asset: ${asset}`);

  browser = await chromium.launch({headless: true});
  const page = await browser.newPage(), cache = new Map();
  async function inspect(asset) {
    if (cache.has(asset)) return cache.get(asset);
    const filename = path.resolve(path.dirname(config.story), asset);
    const mime = {'.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}[path.extname(filename).toLowerCase()];
    assert(mime, `Unsupported bitmap format: ${asset}`);
    const stats = await page.evaluate(async data => {
      const image = new Image(); image.src = data; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', {willReadFrequently: true}); context.drawImage(image, 0, 0);
      const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let min = 255, max = 0, left = canvas.width, top = canvas.height, right = -1, bottom = -1;
      for (let pixel = 0; pixel < canvas.width * canvas.height; pixel++) {
        const alpha = rgba[pixel * 4 + 3]; min = Math.min(min, alpha); max = Math.max(max, alpha);
        if (alpha <= 24) continue;
        const x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
        left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
      return {width: canvas.width, height: canvas.height, alphaMin: min, alphaMax: max,
        visibleLongEdge: right < 0 ? 0 : Math.max(right - left + 1, bottom - top + 1)};
    }, `data:${mime};base64,${fs.readFileSync(filename).toString('base64')}`);
    cache.set(asset, stats); return stats;
  }
  const scale = artwork.catalogue.sourceScale;
  assert.equal(scale, 4, 'The player displays icon pixels at quarter size.');
  for (const entry of [...artwork.items.values(), ...artwork.variants]) {
    const item = story.items[artworkId(entry.owner ?? entry.id)];
    if (entry.owner) {
      assert(item.presentations.some(value => value.icon?.url === entry.asset && value.chapter.kind === 'name' && value.chapter.value === entry.fromChapter), `Missing appearance metadata: ${entry.name}`);
    } else assert.equal(item.icon?.url, entry.asset, `Incorrect default icon: ${entry.name}`);
    const stats = await inspect(entry.asset), visible = stats.visibleLongEdge / scale;
    assert(stats.alphaMin === 0 && stats.alphaMax > 24, `Icon must have visible artwork and transparency: ${entry.asset}`);
    assert(stats.width % scale === 0 && stats.height % scale === 0, `Icon dimensions must encode whole display pixels: ${entry.asset}`);
    assert(Math.abs(visible - entry.visibleLongEdgePx) <= 1, `Visible scale differs for ${entry.name}: ${visible.toFixed(2)}px, expected ${entry.visibleLongEdgePx}px`);
    assert(visible >= artwork.catalogue.minimumVisibleLongEdgePx - 1 && visible <= artwork.catalogue.maximumVisibleLongEdgePx + 1, `Visible size outside catalogue range: ${entry.name}`);
  }
  for (const [key, asset] of artwork.slots) {
    const [owner, accepts] = key.split('\0'), item = story.items[owner];
    assert.equal(item.slots.find(value => value.accepts === accepts)?.icon?.url, asset, `Missing fitted overlay for ${key}`);
    const base = await inspect(item.icon.url), overlay = await inspect(asset);
    assert.deepEqual([overlay.width, overlay.height], [base.width, base.height], `Overlay dimensions differ from base: ${asset}`);
    assert(overlay.alphaMin === 0 && overlay.alphaMax > 24, `Overlay must contain visible transparent artwork: ${asset}`);
  }
  for (const scene of artwork.sceneManifest.scenes) {
    assert.equal(story.chapters[scene.chapterIndex].name, scene.name);
    assert.equal(story.chapters[scene.chapterIndex].image, scene.background, `Wrong scene: ${scene.name}`);
    const stats = await inspect(scene.background), expected = artwork.sceneManifest.exportDimensions;
    assert.deepEqual([stats.width, stats.height], [expected.width, expected.height], `Background dimensions differ: ${scene.background}`);
    assert.equal(stats.alphaMin, 255, `Background has transparent gaps: ${scene.background}`);
    assert.deepEqual([...story.chapters[scene.chapterIndex].hotspots].sort(), scene.hotspots.map(value => value.id).sort(), `Hotspot coverage differs: ${scene.name}`);
  }
  for (const hotspot of artwork.hotspots.values()) {
    const actual = story.hotspots[hotspot.id], stats = await inspect(hotspot.icon);
    assert.equal(actual?.icon?.url, hotspot.icon, `Missing hotspot icon: ${hotspot.name}`);
    assert(Math.abs(actual.x * 100 - hotspot.x) < 1e-8 && Math.abs(actual.y * 100 - hotspot.y) < 1e-8, `Hotspot registration differs: ${hotspot.name}`);
    assert.deepEqual([stats.width, stats.height], [hotspot.width * scale, hotspot.height * scale], `Hotspot size differs: ${hotspot.name}`);
    assert.equal(stats.alphaMax, 0, `Painted landscape target must be fully transparent: ${hotspot.name}`);
  }
  if (story.cover) await inspect(story.cover);
  await browser.close(); browser = undefined;
  console.log(`Artwork checks pass: ${artwork.items.size} default icons, ${artwork.variants.length} appearances, ${artwork.slots.size} fitted layers, ${artwork.sceneManifest.scenes.length} chapter scenes, ${artwork.hotspots.size} registered targets; ${cache.size} unique bitmaps decoded.`);

  if (!config['skip-checkpoints']) {
    for (let index = 0; index < story.chapters.length; index++) {
      const state = checkpoint(story, index);
      assert.equal(state.chapter, index, `Checkpoint skipped ${story.chapters[index].name}`);
    }
    const completed = checkpoint(story, story.chapters.length);
    assert(completed.completed, 'Final shared checkpoint did not complete the story.');
    console.log(`All ${story.chapters.length} chapter checkpoints and final completion pass through the shared planner. This is legal replay, not a fresh playtest or visual-recognition trial.`);
  }
  console.log('Gameplay matches v11 through the two documented crop-ID aliases. Run the shared story lint and browser checks for the remaining integration checks.');
} catch (error) {
  console.error(error.message); process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}
