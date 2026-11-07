import {test, expect} from '@playwright/test';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {parseStory} from '../src/story/parser.ts';
import {ArtworkBrowser} from '../src/lint/artwork-browser.ts';
import {openDebugPanel} from './debug-helpers.ts';

test('CLI decodes square, non-square and broken heading artwork without requiring placements', async () => {
  test.setTimeout(30000);
  const directory = mkdtempSync(resolve('runs/story-icons-'));
  const checker = new ArtworkBrowser();
  try {
    const story = (file: string) => parseStory(`# ![icon](${file}) Story\n## First`, {file: join(directory, 'story.md')});
    writeFileSync(join(directory, 'small.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"/>');
    writeFileSync(join(directory, 'large.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"/>');
    writeFileSync(join(directory, 'wide.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="256"/>');
    writeFileSync(join(directory, 'broken.png'), 'not an image');
    for (const file of ['small.svg', 'large.svg']) expect(await checker.lint(story(file))).toEqual([]);
    expect((await checker.lint(story('wide.svg'))).map(d => d.code)).toEqual(['story-icon-square']);
    expect((await checker.lint(story('broken.png'))).map(d => d.code)).toEqual(['story-icon-image']);
  } finally { await checker.close(); rmSync(directory, {recursive: true, force: true}); }
});

test('catalogue heading icons load at 64 CSS pixels on narrow and wide screens without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();
  try {
    for (const width of [320, 960]) {
      await page.setViewportSize({width, height: 844});
      await page.goto('/');
      await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
      const cards = page.locator('a[data-story]');
      const icons = cards.locator('.story-title img');
      expect(await icons.count()).toBe(await cards.count());
      expect(await icons.count()).toBeGreaterThan(0);
      for (const icon of await icons.all()) {
        await expect(icon).toBeVisible();
        expect(await icon.evaluate((image: HTMLImageElement) => ({loaded: image.complete && image.naturalWidth > 0, square: image.naturalWidth === image.naturalHeight, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height}))).toEqual({loaded: true, square: true, width: 64, height: 64});
        const alignment = await icon.evaluate(image => {
          // A zero-height inline box exposes the line's actual text baseline.
          const probe = document.createElement('span');
          probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
          image.after(probe);
          const artwork = image.getBoundingClientRect(), baseline = probe.getBoundingClientRect();
          const result = {display: getComputedStyle(image).display, gap: Math.abs(artwork.bottom - baseline.top), toLeft: artwork.right <= baseline.left};
          probe.remove();
          return result;
        });
        expect(alignment.display).toBe('inline');
        expect(alignment.gap).toBeLessThan(1);
        expect(alignment.toLeft).toBe(true);
      }
      expect(await page.evaluate(() => document.querySelector('.chooser')!.scrollWidth <= innerWidth)).toBe(true);
    }
  } finally { await context.close(); }
});

test('live authoring measures heading art and clears old shape diagnostics after editing', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 844});
  const text = '# ![icon](wide.svg) Icon draft\n## Start\nbackground: ![room](room.svg)\n\nAn opening.\n\n**Items**\n- A\n- B\n- C\n**Goals**\n- Make C -- C\n**Combinations**\n- A [preserve] + B [preserve] -> C (tutorial)';
  await page.route('**/icon-draft/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.route('**/icon-draft/*.svg', route => {
    const width = route.request().url().endsWith('/wide.svg') ? 512 : 256;
    return route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="256"/>`});
  });
  await page.goto('/make-something.html?story=icon-draft/story.md');
  await openDebugPanel(page);
  const shapeError = page.locator('.editor-diagnostic-text').filter({hasText: 'Story icons must be square'});
  await expect(shapeError).toHaveCount(1);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  const edit = async (value: string) => {
    await editor.focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(value);
  };
  await edit(text.replace('wide.svg', 'square.svg'));
  await expect(shapeError).toHaveCount(0);
  await edit(text.replace('![icon](wide.svg) ', ''));
  await expect(page.locator('.editor-diagnostic-text').filter({hasText: 'Include a square Markdown image'})).toHaveCount(1);
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
});
