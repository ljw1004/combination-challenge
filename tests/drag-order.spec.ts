import {test, expect, type Page, type Locator} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

async function openFixture(page: Page, icons = false) {
  const items = ['A', 'B', 'C', 'D'].map(id => `- ${id}${icons ? `\n  - icon: ![${id}](tile.svg)` : ''}`).join('\n');
  const text = `# Overlapping items
## Workshop
Arrange the pieces.
**Goals**
- Make D -- D
**Items**
${items}
**Combinations**
- C [preserve] + B [preserve] -> D
`;
  await page.route('**/drag-order/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.route('**/drag-order/tile.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224"><rect width="224" height="224" rx="12" fill="#b8ad80"/></svg>'}));
  await page.goto('/combinations.html?story=drag-order/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  return text;
}
const item = (page: Page, id: string) => page.locator(`[data-item="name:${id}"]`);
const zIndex = (tile: Locator) => tile.evaluate(el => Number(getComputedStyle(el).zIndex));
const topAt = (page: Page, point: {x: number; y: number}) => page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-item]')?.dataset.item, point);
async function moveTo(page: Page, tile: Locator, x: number, y: number) {
  const box = (await tile.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + 10); await page.mouse.down();
  await page.mouse.move(x + 10, y + 10, {steps: 4}); await page.mouse.up();
}

for (const icons of [false, true]) test(`${icons ? 'icons' : 'cards'} keep incompatible drops, stable overlap, and highlights within each item layer`, async ({page}) => {
  await openFixture(page, icons);
  const a = item(page, 'A'), b = item(page, 'B'), c = item(page, 'C');
  await moveTo(page, b, 150, 360);
  await moveTo(page, c, 20, 560);
  const receiver = (await b.boundingBox())!, source = (await a.boundingBox())!;
  const destination = {x: receiver.x + receiver.width / 3, y: receiver.y};
  await page.mouse.move(source.x + 10, source.y + 10); await page.mouse.down();
  expect(await zIndex(a)).toBeGreaterThan(await zIndex(b));
  await page.mouse.move(destination.x + 10, destination.y + 10, {steps: 4});
  const preview = (await a.boundingBox())!;
  await expect(b).not.toHaveClass(/will-create/);
  await page.mouse.up();
  expect(await a.boundingBox()).toEqual(preview);
  expect(preview.x).toBeCloseTo(destination.x, 1); expect(preview.y).toBeCloseTo(destination.y, 1);
  expect(await b.boundingBox()).toEqual(receiver);

  const overlap = {x: destination.x + 12, y: destination.y + 20};
  const exposed = {x: receiver.x + 5, y: receiver.y + 20};
  expect(await topAt(page, overlap)).toBe('name:A');
  await page.waitForTimeout(450); // Let the release-feedback window end before hovering B.
  await page.mouse.move(exposed.x, exposed.y);
  await expect(b).toHaveClass(/pressed/); await expect(c).toHaveClass(/possible/);
  expect(await topAt(page, overlap)).toBe('name:A');
  expect(await zIndex(b)).toBeLessThan(await zIndex(a));
  await b.focus();
  expect(await topAt(page, overlap)).toBe('name:A');
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Close', exact: true}).click();
  expect(await topAt(page, overlap)).toBe('name:A');

  await page.reload(); await expect(a).toBeVisible();
  expect(await a.boundingBox()).toEqual(preview);
  expect(await topAt(page, overlap)).toBe('name:A');
  await page.setViewportSize({width: 320, height: 844});
  await expect.poll(async () => (await page.locator('.chapter-panel').boundingBox())!.width).toBeCloseTo(320, 1);
  expect(await zIndex(b)).toBeLessThan(await zIndex(a));
  await page.setViewportSize({width: 390, height: 844});
  await expect.poll(async () => (await a.boundingBox())!.x).toBeCloseTo(preview.x, 1);

  // B is partly covered by A. Its amber combination cue must stay beneath A too.
  const ingredient = (await c.boundingBox())!;
  await page.mouse.move(ingredient.x + 10, ingredient.y + 10); await page.mouse.down();
  await page.mouse.move(exposed.x, exposed.y, {steps: 4});
  await expect(b).toHaveClass(/will-create/);
  expect(await zIndex(b)).toBeLessThan(await zIndex(a));
  expect(await topAt(page, overlap)).toBe('name:A');
  await page.mouse.up();
  const created = item(page, 'D'); await expect(created).toBeVisible();
  for (const existing of [a, b, c]) expect(await zIndex(created)).toBeGreaterThan(await zIndex(existing));
  expect(await b.boundingBox()).toEqual(receiver);

  // Picking the overlap moves A; B can only be picked at its exposed edge.
  await page.mouse.move(overlap.x, overlap.y); await page.mouse.down();
  expect(await zIndex(a)).toBeGreaterThan(await zIndex(created));
  await page.mouse.move(overlap.x + 20, overlap.y, {steps: 3}); await page.mouse.up();
  expect((await a.boundingBox())!.x).toBeCloseTo(preview.x + 20, 1);
  expect(await b.boundingBox()).toEqual(receiver);
  await page.mouse.move(exposed.x, exposed.y); await page.mouse.down();
  expect(await topAt(page, {x: overlap.x + 20, y: overlap.y})).toBe('name:B');
  expect(await zIndex(b)).toBeGreaterThan(await zIndex(a));
  await page.mouse.up();
  await page.reload(); await expect(b).toBeVisible();
  expect(await topAt(page, {x: overlap.x + 20, y: overlap.y})).toBe('name:B');
});

test('live renaming and draft reload preserve stacking; chapter reset restores arrival order', async ({page}) => {
  await page.setViewportSize({width: 1100, height: 844});
  const text = await openFixture(page); await openDebugPanel(page);
  const a = item(page, 'A'), b = item(page, 'B'), c = item(page, 'C'), renamed = item(page, 'Bee');
  const arrival = await a.boundingBox();
  expect(await zIndex(a)).toBeLessThan(await zIndex(b));
  expect(await zIndex(b)).toBeLessThan(await zIndex(c));
  await moveTo(page, b, 150, 360); await moveTo(page, a, 180, 360);
  const placed = await a.boundingBox(), overlap = {x: 200, y: 380};
  expect(await topAt(page, overlap)).toBe('name:A');
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(text.replace(/\bB\b/g, 'Bee'));
  await expect(renamed).toBeVisible(); await expect(b).toHaveCount(0);
  expect(await topAt(page, overlap)).toBe('name:A');
  expect(await zIndex(renamed)).toBeLessThan(await zIndex(a));
  await page.reload(); await expect(renamed).toBeVisible();
  expect(await a.boundingBox()).toEqual(placed);
  expect(await topAt(page, overlap)).toBe('name:A');
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart this chapter'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  expect(await a.boundingBox()).toEqual(arrival);
  expect(await zIndex(a)).toBeLessThan(await zIndex(renamed));
  expect(await zIndex(renamed)).toBeLessThan(await zIndex(c));
});

test('touch overlap stays at release and cancellation restores position without undoing pickup order', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 320, height: 844}, isMobile: true, hasTouch: true});
  const page = await context.newPage(); await openFixture(page, true);
  const a = item(page, 'A'), b = item(page, 'B'), cdp = await context.newCDPSession(page);
  const before = (await a.boundingBox())!, receiver = (await b.boundingBox())!;
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: before.x + 8, y: before.y + 10}]});
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: receiver.x + 18, y: receiver.y + 10}]});
  const preview = (await a.boundingBox())!;
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  expect(await a.boundingBox()).toEqual(preview);
  expect(preview.x).toBeCloseTo(receiver.x + 10, 1);
  expect(await b.boundingBox()).toEqual(receiver);
  const overlap = {x: preview.x + 10, y: preview.y + 20};
  expect(await topAt(page, overlap)).toBe('name:A');
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: receiver.x + 3, y: receiver.y + 20}]});
  expect(await topAt(page, overlap)).toBe('name:B');
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 200, y: 520}]});
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
  expect(await b.boundingBox()).toEqual(receiver);
  expect(await topAt(page, overlap)).toBe('name:B');
  await page.reload(); await expect(a).toBeVisible();
  expect(await a.boundingBox()).toEqual(preview);
  expect(await b.boundingBox()).toEqual(receiver);
  expect(await topAt(page, overlap)).toBe('name:B');
  await context.close();
});
