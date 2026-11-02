import {test, expect, type Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

async function pixelDifference(page: Page, before: Buffer, after: Buffer) {
  return page.evaluate(async images => {
    const pixels = await Promise.all(images.map(async data => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height).data;
    }));
    return pixels[0].reduce((max, value, i) => Math.max(max, Math.abs(value - pixels[1][i])), 0);
  }, [before.toString('base64'), after.toString('base64')]);
}

async function openFixture(page: Page, icons = false) {
  await page.emulateMedia({reducedMotion: 'reduce'});
  const manuscript = `# Goal layers
## Workshop
![room](room.svg)

Arrange the pieces.
**Goals**
- Put the finished piece on the workbench -- D @ Bench
**Items**
${['A', 'B', 'D'].map(id => `- ${id}${icons ? `\n  - icon: ![${id}](tile.svg)` : ''}`).join('\n')}
**Hotspots**
- Bench (at 85%, 95%)
**Combinations**
- A [preserve] + B [preserve] -> D
`;
  await page.route('**/goal-layers/story.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.route('**/goal-layers/room.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"><rect width="390" height="844" fill="#507a83"/></svg>'}));
  await page.route('**/goal-layers/tile.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224"><rect width="224" height="224" fill="#b8ad80"/></svg>'}));
  await page.goto('/combinations.html?story=goal-layers/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('.scene-art').evaluate((image: HTMLImageElement) => image.decode());
  return manuscript;
}

for (const icons of [false, true]) test(`${icons ? 'icons' : 'cards'} stay above goals during pickup, movement and release without leaving cutouts`, async ({page}) => {
  await page.setViewportSize(icons ? {width: 320, height: 740} : {width: 390, height: 844});
  await openFixture(page, icons);
  const goals = page.getByRole('button', {name: 'Read this chapter'}), tile = page.locator('[data-item="name:A"]');
  const dock = (await goals.boundingBox())!, source = (await tile.boundingBox())!;
  const line = (await page.locator('.objective-line').boundingBox())!;
  const clearGoals = await page.screenshot({clip: line});
  const pickup = {x: source.x + source.width / 2, y: source.y + source.height / 2};
  const destination = {x: dock.x + dock.width / 2, y: dock.y + dock.height / 2};
  await page.mouse.move(pickup.x, pickup.y); await page.mouse.down();
  await page.mouse.move(destination.x, destination.y, {steps: 4});
  await expect(tile).toHaveClass(/dragging/);
  const overlap = (await tile.boundingBox())!;
  const x = Math.max(overlap.x + 4, line.x), y = Math.max(overlap.y + 4, line.y);
  const clip = {x, y, width: Math.min(overlap.x + overlap.width - 4, line.x + line.width) - x, height: Math.min(overlap.y + overlap.height - 4, line.y + line.height) - y};
  expect(clip.width).toBeGreaterThan(0); expect(clip.height).toBeGreaterThan(0);
  const dragged = await page.screenshot({clip});
  const unobscuredTile = await page.screenshot({clip, style: '.hud-stack {visibility:hidden!important}'});
  expect(await pixelDifference(page, dragged, unobscuredTile)).toBeLessThanOrEqual(1);
  await page.mouse.up();
  expect(await pixelDifference(page, dragged, await page.screenshot({clip}))).toBeLessThanOrEqual(1);
  expect(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-item]')?.dataset.item, destination)).toBe('name:A');

  // Move away but keep holding: goals must repaint immediately, before release.
  await page.mouse.move(destination.x, destination.y); await page.mouse.down();
  await page.mouse.move(pickup.x, pickup.y, {steps: 4});
  await expect(tile).toHaveClass(/dragging/);
  expect(await pixelDifference(page, clearGoals, await page.screenshot({clip: line}))).toBeLessThanOrEqual(1);
  await page.mouse.up();
  expect(await pixelDifference(page, clearGoals, await page.screenshot({clip: line}))).toBeLessThanOrEqual(1);

  // The fixed workbench also sits over the goals and owns the overlapping input.
  const station = (await page.locator('[data-hotspot="name:Bench"]').boundingBox())!;
  const point = {x: Math.min(dock.x + dock.width - 8, station.x + station.width / 2), y: dock.y + dock.height / 2};
  expect(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-hotspot]')?.dataset.hotspot, point)).toBe('name:Bench');
  await goals.click({position: {x: 12, y: dock.height / 2}});
  await expect(page.getByRole('button', {name: 'Close', exact: true})).toBeVisible();
});

test('bug and red pencil stay fully visible during dragging and sit beneath overlapping items', async ({page}) => {
  await page.setViewportSize({width: 1100, height: 844});
  const manuscript = await openFixture(page);
  const debug = page.locator('.debug-toggle'), tile = page.locator('[data-item="name:A"]');
  for (const edited of [false, true]) {
    if (edited) {
      await openDebugPanel(page);
      const editor = page.getByRole('textbox', {name: 'Story Markdown'});
      await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText(manuscript.replace('Arrange the pieces.', 'Arrange these pieces.'));
      await expect(debug).toHaveClass(/edit-indicator/);
      await page.getByRole('button', {name: 'Close debug panel'}).click();
    } else await expect(debug).not.toHaveClass(/edit-indicator/);
    const source = (await tile.boundingBox())!, control = (await debug.boundingBox())!;
    const pickup = {x: source.x + source.width / 2, y: source.y + source.height / 2};
    const destination = {x: control.x + control.width / 2, y: control.y + control.height / 2};
    await page.mouse.move(pickup.x, pickup.y);
    const visible = await page.screenshot({clip: control});
    await page.mouse.down();
    await page.mouse.move(pickup.x, pickup.y - 80, {steps: 4});
    await expect(tile).toHaveClass(/dragging/);
    await expect(debug).toHaveCSS('opacity', '1');
    expect(await pixelDifference(page, visible, await page.screenshot({clip: control}))).toBeLessThanOrEqual(1);
    await page.mouse.move(destination.x, destination.y, {steps: 4}); await page.mouse.up();
    expect(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-item]')?.dataset.item, destination)).toBe('name:A');
    await page.mouse.down(); await page.mouse.move(pickup.x, pickup.y, {steps: 4});
    await expect(debug).toHaveCSS('opacity', '1');
    expect(await pixelDifference(page, visible, await page.screenshot({clip: control}))).toBeLessThanOrEqual(1);
    await page.mouse.up();
  }
});
