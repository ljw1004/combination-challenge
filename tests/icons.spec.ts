import {test, expect, type Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

const manuscript = `# Icon workshop
## Shelter
![room](assets/background.svg)

A small shelter.

**Goals**
- Fit the shelter -- House[Window,Mat]

**Items**
- House (compound)
  - icon: ![house](assets/house.svg)
  - unnamed slot: accepts Window, icon: ![fitted window](assets/house-window.svg)
  - unnamed slot: accepts Mat, icon: ![fitted mat](assets/house-mat.svg)
- Window
  - icon: ![window](assets/window.svg) (circular)
- Mat
  - icon: ![mat](assets/mat.svg)
- Air
  - icon: ![air](assets/air.svg) (circular)
`;

async function openFixture(page: Page, text = manuscript) {
  await page.route('**/icon-fixture/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.route('**/icon-fixture/assets/*.svg', route => {
    const filename = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (filename === 'missing.svg') return route.fulfill({status: 404, body: 'Missing artwork'});
    const [width, height] = filename === 'background.svg' ? [390, 844] : filename === 'house-large.svg' ? [560, 400] : filename.startsWith('house') ? [416, 288] : filename === 'mat.svg' ? [160, 224] : [224, 224];
    const shape = filename.includes('-window') ? '<rect x="270" y="90" width="70" height="70" fill="#8ab8b0"/>' : filename.includes('-mat') ? '<rect x="50" y="230" width="170" height="40" fill="#79764d"/>' : `<rect width="${width}" height="${height}" rx="24" fill="#b8ad80"/>`;
    return route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${shape}</svg>`});
  });
  await page.goto('/combinations.html?story=icon-fixture');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
}

test('icons use intrinsic quarter sizes, partner name badges and circular selection outlines', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), window = page.locator('[data-item="name:Window"]'), mat = page.locator('[data-item="name:Mat"]');
  const houseBox = (await house.boundingBox())!, windowBox = (await window.boundingBox())!, matBox = (await mat.boundingBox())!;
  expect([houseBox.width, houseBox.height]).toEqual([104, 72]);
  expect([windowBox.width, windowBox.height]).toEqual([56, 56]);
  expect([matBox.width, matBox.height]).toEqual([40, 56]);
  await expect(house.locator('.icon-name')).toBeHidden();
  await expect(window.locator('.icon-name')).toBeHidden();
  await window.hover();
  await expect(window.locator('.icon-name')).toHaveText('Window');
  await expect(window.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(mat.locator('.icon-name')).toBeHidden();
  expect(await window.evaluate(element => ({style: getComputedStyle(element, '::after').borderStyle, radius: getComputedStyle(element, '::after').borderRadius}))).toEqual({style: 'dotted', radius: '50%'});
  expect(await house.evaluate(element => getComputedStyle(element, '::after').borderRadius)).toBe('8px');
  await window.click(); await page.mouse.move(5, 600);
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeHidden({timeout: 1500});
  await house.focus();
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(window.locator('.icon-name')).toBeVisible();
});

test('installing compound icons retains base and fitted nodes, alignment and only the base name', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), base = await house.locator('.item-icon').elementHandle();
  const before = (await house.boundingBox())!;
  await page.locator('[data-item="name:Window"]').dragTo(house);
  await expect(house.locator('.slot-icon')).toHaveCount(1);
  const windowOverlay = await house.locator('[data-icon-slot="name:Window"]').elementHandle();
  await page.locator('[data-item="name:Mat"]').dragTo(house);
  await expect(house.locator('.slot-icon')).toHaveCount(2);
  expect(await base!.evaluate(image => image.isConnected)).toBe(true);
  expect(await windowOverlay!.evaluate(image => image.isConnected)).toBe(true);
  await house.hover();
  await expect(house.locator('.icon-name')).toHaveText('House');
  await expect(house.locator('.slot')).toHaveCount(0);
  const layers = await house.locator('.icon-stack img').evaluateAll(images => images.map(image => {
    const rect = image.getBoundingClientRect(); return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
  }));
  expect(layers).toEqual(Array(3).fill({x: before.x, y: before.y, width: 104, height: 72}));
  await page.reload();
  await expect(house.locator('.slot-icon')).toHaveCount(2);
  expect(await house.boundingBox()).toEqual(before);
});

test('rectangular icon dragging preserves the pickup point and narrow resizing preserves placements', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), before = (await house.boundingBox())!;
  await page.mouse.move(before.x + 7, before.y + 11); await page.mouse.down();
  await page.mouse.move(230, 520, {steps: 6}); await page.mouse.up();
  const moved = (await house.boundingBox())!;
  expect(moved.x).toBeCloseTo(223, 1); expect(moved.y).toBeCloseTo(509, 1);
  await page.setViewportSize({width: 320, height: 740});
  await expect.poll(async () => (await house.boundingBox())!.width).toBeCloseTo(104 * 320 / 390, 1);
  const narrow = (await house.boundingBox())!;
  expect(narrow.width).toBeCloseTo(104 * 320 / 390, 1);
  expect(narrow.height).toBeCloseTo(72 * 320 / 390, 1);
  expect(narrow.x).toBeCloseTo(moved.x * 320 / 390, 1);
  expect(narrow.y).toBeCloseTo(moved.y * 320 / 390, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('failed icon artwork falls back to readable text and usable compound slots', async ({page}) => {
  await openFixture(page, manuscript.replace('assets/house.svg', 'assets/missing.svg'));
  const house = page.locator('[data-item="name:House"]');
  await expect(house).toHaveClass(/text-thing/);
  await expect(house.locator('.item-label')).toHaveText('House');
  await page.locator('[data-item="name:Window"]').dragTo(house);
  await expect(house.locator('.slot.filled')).toHaveText('Window');
  await expect(page.locator('[data-item="name:Mat"]')).toHaveClass(/icon-thing/);
});

test('touches use the expanded small-icon target and cancellation keeps the original placement', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 320, height: 740}, hasTouch: true, isMobile: true});
  const page = await context.newPage();
  await openFixture(page);
  const mat = page.locator('[data-item="name:Mat"]'), house = page.locator('[data-item="name:House"]'), before = (await mat.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: before.x - 3, y: before.y + before.height / 2}]});
  await expect(mat.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeVisible();
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 180, y: 520}]});
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
  expect(await mat.boundingBox()).toEqual(before);
  await expect(house.locator('.slot-icon')).toHaveCount(0);
  await expect(mat.locator('.icon-name')).toBeHidden();
  await context.close();
});

test('described icons retain the pressed book cue and hold-to-drag without opening a reading', async ({page}) => {
  const described = manuscript.replace('- Mat\n', '\n  A plain four-pane window.\n\n- Mat\n');
  await openFixture(page, described);
  const window = page.locator('[data-item="name:Window"]'), book = window.locator('.reading-indicator');
  await window.hover();
  await expect(book).toBeHidden();
  const before = (await window.boundingBox())!;
  await page.mouse.move(before.x + 8, before.y + 12); await page.mouse.down();
  await expect(book).toBeVisible();
  await page.waitForTimeout(650);
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.mouse.move(230, 520, {steps: 6}); await page.mouse.up();
  const after = (await window.boundingBox())!;
  expect(after.x).toBeCloseTo(222, 1); expect(after.y).toBeCloseTo(508, 1);
  await expect(book).toBeVisible();
  await page.mouse.move(5, 700);
  await expect(book).toBeHidden();
  await window.dblclick();
  await expect(page.locator('dialog .reading-text')).toHaveText('A plain four-pane window.');
  await expect(page.locator('dialog .open-book')).toHaveCount(0);
});

test('live icon edits replace artwork sizes without replacing the image node or moving the item', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 800});
  await openFixture(page); await openDebugPanel(page);
  const house = page.locator('[data-item="name:House"]'), before = (await house.boundingBox())!, image = await house.locator('.item-icon').elementHandle();
  await page.getByRole('textbox', {name: 'Story Markdown'}).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(manuscript.replace('assets/house.svg', 'assets/house-large.svg'));
  await expect(house.locator('.item-icon')).toHaveAttribute('src', /house-large\.svg$/);
  await expect.poll(async () => (await house.boundingBox())!.width).toBe(140);
  expect(await image!.evaluate(element => element.isConnected)).toBe(true);
  const after = (await house.boundingBox())!;
  expect(after.x).toBe(before.x); expect(after.y).toBe(before.y); expect(after.height).toBe(100);
});
