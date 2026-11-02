import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chromium, expect} from '@playwright/test';
import {runDirectory} from '../../../tools/run-output.mjs';
import {parseStory} from '../../../../../src/story/parser.ts';
import {activeHotspots, background} from '../../../../../src/engine/analysis.ts';
import {overlapsHotspot} from '../../../../../src/web/hotspot-view.ts';
import {coveredFraction} from '../../../../../src/web/arrival-layout.ts';
import {jumpToChapter} from '../../../../../tests/debug-helpers.ts';

const project = path.resolve(import.meta.dirname, '..'), root = path.resolve(project, '../../../..');
const markdown = await fs.readFile(path.join(root, 'stories/cookbook/cookbook.md'), 'utf8');
const story = parseStory(markdown, {id: 'cookbook'});
const storySha256 = createHash('sha256').update(markdown).digest('hex');
const plan = JSON.parse(await fs.readFile(path.join(project, 'registration.json'), 'utf8'));
const originalStations = plan.chapters.flatMap(chapter => chapter.hotspots);
const rework = JSON.parse(await fs.readFile(path.resolve(project, '../../rework-art/production/stations-and-pages.json'), 'utf8'));
const reworkStations = rework.pages.flatMap(page => page.hotspots.map(h => ({
  id: h.id, url: h.receivingIcon, x: h.x * 390, y: h.y * 844,
  width: rework.stationDisplay.width, height: rework.stationDisplay.height,
})));
for(const [id,slug,x,y] of [['id:afternoon-tea-kettle','kettle',.5,.22],['id:mushroom-pan','mushroom-pan',.5,.175],['name:Freezing churn','freezing-churn',.5,.175]]) {
  const display=rework.stations.find(station=>station.name===slug)?.display??rework.stationDisplay;
  reworkStations.push({id,url:`assets/rework/stations/${slug}.png`,x:x*390,y:y*844,...display});
}
const requested = process.argv.find(a => a.startsWith('--chapters='))?.slice(11).split(',').map(Number);
const deviceSelection = process.argv.find(a => a.startsWith('--devices='))?.slice(10).split(',');
const allDevices = [
  {name: 'desktop', width: 1280, height: 844, touch: false},
  {name: 'phone', width: 375, height: 812, touch: true},
  {name: 'short-phone', width: 390, height: 667, touch: true},
  {name: 'tall-phone', width: 430, height: 932, touch: true},
];
const devices = allDevices.filter(d => deviceSelection ? deviceSelection.includes(d.name) : d.name !== 'tall-phone');
assert(devices.length && (!deviceSelection || deviceSelection.every(name => allDevices.some(d => d.name === name))), 'Unknown or empty device selection');
const chapters = [...new Set(requested ?? story.chapters.map((_, i) => i))];
assert(chapters.length && chapters.every(i => Number.isInteger(i) && story.chapters[i]), 'Chapter indices must identify current chapters');
const slug = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const filename = index => `${String(index).padStart(2, '0')}-${slug(story.chapters[index].name)}`;
const isEnding = index => index === story.chapters.length - 1 && !story.chapters[index].goals.length;
const origin = process.env.COOKBOOK_STUDY_ORIGIN || 'http://127.0.0.1:5174';
const storyURL = new URL('/cookbook/cookbook.md', origin);
const assets = [...new Set([
  story.cover, ...story.chapters.map(chapter => chapter.image),
  ...Object.values(story.hotspots).map(hotspot => hotspot.icon?.url),
  ...Object.values(story.items).flatMap(item => [item.icon?.url, ...item.slots.map(slot => slot.icon?.url)]),
].filter(Boolean))].map(asset => new URL(asset, storyURL).href);

const run = await runDirectory(), proofs = path.join(run, 'game');
await fs.mkdir(proofs, {recursive: true});
const previous = requested || deviceSelection
  ? await fs.readFile(path.join(run, 'browser-review.json'), 'utf8').then(JSON.parse).catch(() => ({results: []}))
  : {results: []};
const browser = await chromium.launch(), results = [];
let assetFailures;
try {
  for (const device of devices) {
    const context = await browser.newContext({viewport: {width: device.width, height: device.height}, hasTouch: device.touch, reducedMotion: 'reduce'});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('/combinations.html?story=cookbook/cookbook.md', origin).href);
    // Failed icon loads can fall back to text, so inspect all authored images as well as visible ones.
    assetFailures ??= await page.evaluate(async sources => (await Promise.all(sources.map(src => new Promise(resolve => {
      const image = new Image();
      const finish = failed => {clearTimeout(timer); image.onload = image.onerror = null; resolve(failed ? src : null);};
      const timer = setTimeout(() => finish(true), 10000);
      image.onload = () => finish(!image.naturalWidth || !image.naturalHeight);
      image.onerror = () => finish(true);
      image.src = src;
    })))).filter(Boolean), assets);
    await page.getByRole('button', {name: 'Start', exact: true}).click();
    const firstBegin = page.getByRole('button', {name: 'Begin', exact: true});
    if (await firstBegin.isVisible()) await firstBegin.click();
    for (const index of chapters) {
      const chapter = story.chapters[index];
      // A settled item may legitimately cover the developer toggle; keyboard activation keeps the checkpoint UI accessible.
      const toggle = page.getByRole('button', {name: 'Toggle debug panel', exact: true});
      if (!await page.locator('.story-editor').isVisible() && !await page.locator('.mobile-debug').isVisible()) {
        await toggle.focus();
        await toggle.press('Enter');
      }
      await jumpToChapter(page, chapter.name, true);
      const begin = page.getByRole('button', {name: 'Begin', exact: true});
      if (await begin.isVisible()) await begin.click();
      const panel = page.locator(`.chapter-panel[data-chapter="${index}"]`);
      await panel.evaluate(el => el.scrollIntoView({block: 'start', behavior: 'instant'}));
      await page.mouse.move(1, 1);
      await panel.evaluate(async el => {
        await document.fonts.ready;
        await Promise.allSettled([...el.querySelectorAll('img')].map(image => image.decode()));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const geometry = await panel.evaluate(el => {
        const rect = element => {
          const r = element.getBoundingClientRect();
          return {x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom};
        };
        const box = rect(el), scene = el.querySelector('.scene-art')
          ?? document.querySelector(`.scene-panel[data-chapter="${el.dataset.chapter}"] .scene-art`);
        const items = [...el.querySelectorAll('.thing')].map(element => ({id: element.dataset.item, name: element.getAttribute('aria-label'), ...rect(element)}));
        const hotspots = [...el.querySelectorAll('.hotspot')].map(element => ({id: element.dataset.hotspot, name: element.getAttribute('aria-label'), circular: element.classList.contains('hotspot-circular'), ...rect(element)}));
        const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1;
        const itemOverlaps = items.flatMap((a, i) => items.slice(i + 1).filter(b => overlap(a, b)).map(b => [a.name, b.name]));
        const hotspotOverlaps = hotspots.flatMap((a, i) => hotspots.slice(i + 1).filter(b => overlap(a, b)).map(b => [a.name, b.name]));
        return {
          box, ground: scene ? rect(scene) : null, items, hotspots, itemOverlaps, hotspotOverlaps,
          outside: [...items, ...hotspots].filter(r => r.x < Math.max(0, box.x) - 1 || r.right > Math.min(innerWidth, box.right) + 1 || r.y < Math.max(0, box.y) - 1 || r.bottom > Math.min(innerHeight, box.bottom) + 1),
          failed: [...el.querySelectorAll('img')].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      const expectedHotspots = activeHotspots(story, index).map(id => story.hotspots[id]);
      geometry.itemCoverage = geometry.items.map(item => ({id: item.id, name: item.name, fraction: coveredFraction(item, geometry.items.filter(other => other !== item))}));
      geometry.itemOverlapFindings = geometry.itemCoverage.filter(item => item.fraction > .1 + 1e-6);
      assert.deepEqual(geometry.hotspots.map(h => h.id).sort(), expectedHotspots.map(h => h.id).sort(), `${chapter.name}: current hotspot identities`);
      for (const hotspot of expectedHotspots) assert.equal(geometry.hotspots.find(h => h.id === hotspot.id).name, hotspot.name, `${chapter.name}: current hotspot name`);
      assert(!background(story, index) || geometry.ground, `${chapter.name}: missing background`);
      const scale = geometry.ground ? geometry.ground.width / plan.reference.width : geometry.box.width / plan.reference.width;
      const registration = [];
      for (const hotspot of expectedHotspots) {
        // Match retained paintings by identity and asset, regardless of their chapter or revised position.
        const original = originalStations.find(h => h.id === hotspot.id && hotspot.icon?.url === `assets/cooks-pen/hotspots/${h.target}`)
          ?? reworkStations.find(h => h.id === hotspot.id && hotspot.icon?.url === h.url);
        if (!original) continue;
        const actual = geometry.hotspots.find(h => h.id === hotspot.id);
        assert(geometry.ground, `${chapter.name}: registered station needs a background`);
        const x = hotspot.x === undefined ? original.x : hotspot.x * plan.reference.width;
        const y = hotspot.y === undefined ? original.y : hotspot.y * plan.reference.height;
        const expected = {
          x: geometry.ground.x + (x - original.width / 2) * scale,
          y: geometry.ground.y + (y - original.height / 2) * scale,
          width: original.width * scale, height: original.height * scale,
        };
        for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(actual[key] - expected[key]) < .12, `${chapter.name}/${hotspot.id} ${key}`);
        registration.push({id: hotspot.id, expected, actual});
      }
      const overlaps = geometry.items.flatMap(item => geometry.hotspots.filter(hotspot => overlapsHotspot(
        {x: item.x + .5, y: item.y + .5, width: Math.max(0, item.width - 1), height: Math.max(0, item.height - 1)}, hotspot,
      )).map(hotspot => ({item: item.id, hotspot: hotspot.id, names: [item.name, hotspot.name]})));
      const endingPlacements = isEnding(index) && !chapter.image
        ? story.chapters[index - 1]?.goals.flatMap(goal => goal.conditions.filter(condition => condition.hotspot)) ?? []
        : [];
      const allowedEndingOverlaps = overlaps.filter(pair => endingPlacements.some(condition => condition.item.id === pair.item && condition.hotspot === pair.hotspot));
      geometry.stationOverlaps = overlaps.filter(pair => !allowedEndingOverlaps.includes(pair)).map(pair => pair.names);
      const png = `${filename(index)}-${device.name}.png`;
      await panel.screenshot({path: path.join(proofs, png), animations: 'disabled'});
      const hoverFiles = [];
      if (!isEnding(index) && device.name === 'desktop') for (const hotspot of expectedHotspots) {
        const station = panel.locator(`[data-hotspot=${JSON.stringify(hotspot.id)}]`);
        await station.hover();
        await expect(station.locator('.icon-name')).toBeVisible();
        await expect(station.locator('.icon-name')).toHaveText(hotspot.name);
        const file = `${filename(index)}-${slug(hotspot.id)}-hover.png`;
        await page.screenshot({path: path.join(proofs, file), clip: {x: geometry.box.x, y: Math.max(0, geometry.box.y), width: geometry.box.width, height: Math.min(250 * scale, device.height)}});
        hoverFiles.push(file);
        await page.mouse.move(1, 1);
      }
      results.push({chapter: index, name: chapter.name, ending: isEnding(index), device: device.name, png, hoverFiles, ...geometry, allowedEndingOverlaps, registration, errors: [...errors]});
      console.log(JSON.stringify({chapter: index, name: chapter.name, device: device.name, itemOverlaps: geometry.itemOverlaps.length, excessiveItemOverlaps: geometry.itemOverlapFindings.length, stationOverlaps: geometry.stationOverlaps.length, hotspotOverlaps: geometry.hotspotOverlaps.length, outside: geometry.outside.length}));
    }
    await context.close();
  }
} finally {
  await browser.close();
}
// Partial reruns may supplement only observations of this exact manuscript.
const retained = previous.storySha256 === storySha256 ? previous.results : [];
const merged = [...retained.filter(r => !results.some(n => n.chapter === r.chapter && n.device === r.device)), ...results];
await fs.writeFile(path.join(run, 'browser-review.json'), JSON.stringify({type: 'Author-informed legal chapter checkpoints; desktop and Chromium touch emulation.', storySha256, assetFailures, results: merged}, null, 2) + '\n');
assert.equal(assetFailures.length, 0, `Missing or undecodable authored artwork: ${assetFailures.join(', ')}`);
assert.equal(results.filter(r => r.failed.length || r.outside.length || r.errors.length || r.overflow || r.itemOverlapFindings.length || r.hotspotOverlaps.length || r.stationOverlaps.length).length, 0, 'Arrival geometry findings require review. Item coverage follows the UX 10% allowance; only the final inherited goal placement may occupy a station.');
