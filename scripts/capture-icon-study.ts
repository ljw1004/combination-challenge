/** Capture every playable style from a fresh opening, then assemble a labelled gallery.
 * Start the game server first. Run: node scripts/capture-icon-study.ts
 * Optional: ICON_STUDY_URL=http://127.0.0.1:4173 node scripts/capture-icon-study.ts
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium, expect} from '@playwright/test';

const styles = [
  ['woodcut-color', 'Coloured woodcut'],
  ['woodcut', 'Wood engraving'],
  ['riso', 'Risograph'],
  ['medieval', 'Medieval manuscript'],
  ['traditional-game', 'Traditional · 20% circles'],
  ['japanese-edo', 'Japanese Edo'],
  ['diderot', 'Encyclopedic engraving'],
];
const directory = resolve('docs/icon-study/screenshots');
const baseURL = process.env.ICON_STUDY_URL ?? 'http://127.0.0.1:5173';
const viewport = {width: 390, height: 844};
mkdirSync(directory, {recursive: true});
const browser = await chromium.launch();
const captures: {style: string; title: string; file: string; items: number}[] = [];
try {
  for (const [style, title] of styles) {
    const context = await browser.newContext({viewport, deviceScaleFactor: 2, reducedMotion: 'reduce'});
    try {
      const page = await context.newPage(), errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);});
      await page.goto(new URL(`/combinations.html?story=icon-test-${style}`, baseURL).href);
      await page.getByRole('button', {name: 'Start', exact: true}).click();
      await page.getByRole('button', {name: 'Begin', exact: true}).click();
      await expect(page.locator('.icon-thing')).toHaveCount(20);
      await page.mouse.move(389, 843);
      await page.evaluate(async () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode()));
      });
      await expect(page.locator('.icon-name:visible')).toHaveCount(0);
      await expect(page.locator('dialog')).toHaveCount(0);
      const dimensions = await page.locator('.icon-thing').evaluateAll(items => items.map(item => {
        const rect = item.getBoundingClientRect(), image = item.querySelector('img')!;
        return {width: rect.width, height: rect.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight};
      }));
      if (dimensions.some(item => Math.abs(item.width - item.naturalWidth / 4) > .1 || Math.abs(item.height - item.naturalHeight / 4) > .1)) throw Error(`${style}: unexpected image scale`);
      if (errors.length) throw Error(`${style}: ${errors.join('; ')}`);
      const file = `${style}.png`;
      await page.screenshot({path: resolve(directory, file), animations: 'disabled'});
      captures.push({style, title, file, items: dimensions.length});
      console.log(`Captured ${title}`);
    } finally {await context.close();}
  }

  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Icon styles — side by side</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#e9e4da;color:#292d25;font:16px/1.5 system-ui,sans-serif}
main{max-width:1656px;margin:auto;padding:24px}header{margin-bottom:24px}h1{font:600 30px/1.2 Georgia,serif;margin:0 0 8px}p{margin:0 0 16px;color:#54594e}
nav{display:flex;flex-wrap:wrap;gap:8px;align-items:center}button,nav a{font:inherit;border:1px solid #a2a596;border-radius:6px;padding:7px 13px;color:inherit;background:#faf8f1;text-decoration:none;cursor:pointer}button[aria-pressed="true"]{background:#34483d;color:white;border-color:#34483d}a:focus-visible,button:focus-visible{outline:3px solid #aa6429;outline-offset:3px}
.gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;align-items:start}figure{margin:0;background:#faf8f1;border-radius:6px;overflow:hidden;box-shadow:0 2px 5px #30251d20}figcaption{padding:9px 12px;font-weight:600;font-size:15px;line-height:22px}.gallery img{display:block;width:100%;height:auto}.gallery a{display:block}footer{font-size:13px;color:#606457;margin-top:20px}
body.strip main{max-width:none}body.strip .gallery{grid-template-columns:repeat(${styles.length},390px);overflow-x:auto;padding-bottom:12px}
@media(max-width:1100px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr))}main{padding:16px}}@media(max-width:480px){.gallery{grid-template-columns:1fr}}
</style>
<main><header><h1>Icon styles — side by side</h1><p>The same twenty belongings, each with its matching background.</p>
<nav aria-label="Comparison layout"><button id="overview" aria-pressed="true">Overview</button><button id="strip" aria-pressed="false">Side by side · phone size</button><a href="comparison.png" download>Download overview</a><a href="side-by-side.png" download>Download single row</a></nav></header>
<section class="gallery" aria-label="Seven art styles">${captures.map(({title, file}) => `<figure><figcaption>${title}</figcaption><a href="${file}" target="_blank" rel="noopener" aria-label="Open full-size ${title} screenshot"><img src="${file}" width="780" height="1688" alt="${title}: opening scene with all twenty objects and the first house-fitting goal"></a></figure>`).join('\n')}</section>
<footer>Fresh opening states · 390 × 844 viewport · click any image for the full-resolution capture</footer></main>
<script>
for(const id of ['overview','strip'])document.getElementById(id).addEventListener('click',()=>{document.body.classList.toggle('strip',id==='strip');for(const other of ['overview','strip'])document.getElementById(other).setAttribute('aria-pressed',String(other===id));});
</script></html>\n`;
  writeFileSync(resolve(directory, 'index.html'), html);
  const page = await browser.newPage({viewport: {width: 1656, height: 1000}, deviceScaleFactor: 1});
  await page.goto(pathToFileURL(resolve(directory, 'index.html')).href);
  await page.evaluate(async () => {await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode()));});
  await page.screenshot({path: resolve(directory, 'comparison.png'), fullPage: true});
  await page.getByRole('button', {name: 'Side by side · phone size', exact: true}).click();
  await page.setViewportSize({width: 7 * 390 + 6 * 16 + 48, height: 1000});
  await page.screenshot({path: resolve(directory, 'side-by-side.png'), fullPage: true});
  writeFileSync(resolve(directory, 'manifest.json'), JSON.stringify({
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(),
    capturedAt: new Date().toISOString(), browser: browser.version(), viewport, deviceScaleFactor: 2,
    state: 'Fresh opening after Start and Begin; no combinations, hover labels or readers.', captures,
  }, null, 2) + '\n');
  console.log(`Gallery saved to ${directory}`);
} finally {await browser.close();}
