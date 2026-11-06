import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { openDebugPanel } from './debug-helpers.ts';

const manuscript = `# Library fixture
## Workshop
Workshop introduction.

**Goals**
- Finish -- Final

**Items**
- Grain

  A grain explanation.

- Stone

  A stone explanation.

- Flour

  A flour explanation.

- Tool
- Final

**Combinations**
- Grain [transform] + Stone [consume] -> Flour
- Flour [preserve] + Tool [preserve] -> Final
`;

async function openFixture(page: Page, text = manuscript) {
  await page.route('**/library-fixture/story.md', route => route.fulfill({ contentType: 'text/markdown', body: text }));
  await page.goto('/make-something.html?story=library-fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
}

for (const variant of [
  {name: 'split', popup: 'Freshly milled.', entry: 'A longer explanation with a [source](https://example.com/flour).'},
  {name: 'encyclopedia only', popup: '', entry: 'A longer explanation with a [source](https://example.com/flour).'},
  {name: 'popup only', popup: 'Freshly milled.', entry: ''},
]) {
  test(`${variant.name} wonders keep creation, rereading and encyclopedia unlock independent`, async ({page}) => {
    const reading = `${variant.popup}\n\n---\n\n${variant.entry}`.split('\n').join('\n  ');
    await openFixture(page, manuscript.replace('A flour explanation.', reading));
    await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
    const flour = page.locator('[data-item="name:Flour"]');
    await expect(flour).toBeVisible();
    if (variant.popup) {
      await expect(page.locator('dialog.wonder .reading-text')).toHaveText(variant.popup);
      await page.reload();
      await expect(page.locator('dialog.wonder .reading-text')).toHaveText(variant.popup);
      await page.getByRole('button', {name: 'Continue', exact: true}).click();
    } else {
      await expect(page.locator('dialog')).toHaveCount(0);
    }
    await expect(flour.locator('.reading-indicator')).toHaveCount(variant.entry ? 1 : 0);
    await flour.dblclick();
    if (variant.entry) {
      await expect(page.locator('.encyclopedia-reading')).toHaveText('A longer explanation with a source.');
      await expect(page.locator('.encyclopedia-reading a')).toHaveAttribute('href', 'https://example.com/flour');
      await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone', 'Flour']);
      await page.getByRole('button', {name: 'Close', exact: true}).click();
    } else {
      await expect(page.locator('dialog')).toHaveCount(0);
    }
    await page.reload();
    await expect(page.locator('dialog')).toHaveCount(0);
    await page.getByRole('button', {name: 'Read this chapter'}).click();
    await expect(page.getByRole('button', {name: 'Encyclopedia', exact: true})).toHaveCount(variant.entry ? 1 : 0);
  });
}

test('only the reopened chapter dismisses on backdrop clicks, with a top-right Close and right-aligned recovery', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.route('**/library-fixture/story.md', route => route.fulfill({ contentType: 'text/markdown', body: manuscript }));
  await page.goto('/make-something.html?story=library-fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  const backdrop = page.locator('.game-dialog-layer');
  const outside = () => backdrop.click({ position: { x: 4, y: 4 } });
  await outside();
  await expect(page.getByRole('button', { name: 'Begin', exact: true })).toBeVisible();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  const goals = page.getByRole('button', { name: 'Read this chapter' });
  await goals.click();
  const dialog = page.locator('dialog'), close = page.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toHaveText('×');
  await expect(page.getByRole('button', { name: 'Encyclopedia', exact: true })).toHaveCount(0);
  const popup = (await dialog.boundingBox())!, x = (await close.boundingBox())!;
  expect(x.x).toBeGreaterThan(popup.x + popup.width / 2);
  expect(x.y - popup.y).toBeLessThan(12);
  const recovery = (await page.getByRole('button', { name: 'Restart story', exact: true }).boundingBox())!;
  const footer = (await page.locator('.chapter-actions').boundingBox())!;
  expect(recovery.x + recovery.width).toBeCloseTo(footer.x + footer.width, 0);
  await page.locator('.chapter-popup .reading-text').click();
  await expect(dialog).toBeVisible();
  // A text-selection gesture ending outside must not become a backdrop dismissal.
  const prose = (await page.locator('.chapter-popup .reading-text').boundingBox())!;
  await page.mouse.move(prose.x + 10, prose.y + 10); await page.mouse.down();
  await page.mouse.move(4, 4); await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.down(); await page.mouse.move(prose.x + 10, prose.y + 10); await page.mouse.up();
  await expect(dialog).toBeVisible();
  await outside();
  await expect(dialog).toHaveCount(0);
  await expect(goals).toBeFocused();
  await goals.click(); await close.click();
  await expect(dialog).toHaveCount(0);
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await outside();
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await goals.click();
  await expect(page.getByRole('button', { name: 'Restart this chapter' })).toBeVisible();
  const restart = (await page.getByRole('button', { name: 'Restart this chapter' }).boundingBox())!;
  const row = (await page.locator('.chapter-actions').boundingBox())!;
  expect(restart.x + restart.width).toBeCloseTo(row.x + row.width, 0);
});

test('the compact chapter row opens the book through either its icon or label and keeps long prose scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  const text = manuscript.replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n')
    .replace('Workshop introduction.', Array.from({ length: 20 }, () => 'Workshop introduction.').join('\n\n'));
  await openFixture(page, text);
  const goals = page.getByRole('button', { name: 'Read this chapter' });
  await goals.click();
  const book = page.getByRole('button', { name: 'Encyclopedia', exact: true });
  const label = book.locator('.chapter-book-label');
  const body = page.locator('.chapter-popup .reading-text');
  expect(await body.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await body.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
  await expect(book).toBeInViewport();
  const left = (await book.boundingBox())!, row = (await page.locator('.chapter-actions').boundingBox())!;
  const right = (await page.getByRole('button', { name: 'Restart story', exact: true }).boundingBox())!;
  expect(left.x).toBeCloseTo(row.x, 0);
  expect(right.x + right.width).toBeCloseTo(row.x + row.width, 0);
  expect(right.x).toBeGreaterThan(left.x + left.width);
  expect(left.y + left.height / 2).toBeCloseTo(right.y + right.height / 2, 0);
  const prose = (await body.boundingBox())!;
  expect(row.y).toBeGreaterThanOrEqual(prose.y + prose.height);
  expect(await label.evaluate(el => getComputedStyle(el).textDecorationLine)).toBe('underline');
  await label.hover();
  expect(await label.evaluate(el => getComputedStyle(el).textDecorationLine)).toBe('underline');
  expect(await book.evaluate(el => getComputedStyle(el).borderWidth)).toBe('0px');
  await book.locator('.chapter-book-icon').click();
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await goals.click(); await label.click();
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await goals.click();
  await page.getByRole('button', { name: 'Close', exact: true }).focus();
  await page.keyboard.press('Tab');
  // Chromium exposes the scrollable prose as a keyboard scroll target.
  await expect(body).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(book).toBeFocused();
  expect(await book.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
});

test('retired discoveries unlock the manual encyclopedia; reading, Index, page-local Close, reload and reset preserve their boundaries', async ({ page }) => {
  await openFixture(page);
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await expect(page.getByRole('button', { name: 'Encyclopedia', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await expect(page.locator('dialog.wonder .open-book')).toHaveCount(0);
  await expect(page.locator('dialog.wonder')).toBeVisible();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Index', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone', 'Flour']);
  await page.getByRole('link', { name: 'Grain', exact: true }).click();
  await expect(page.locator('dialog .reading-text')).toHaveText('A grain explanation.');
  await expect(page.locator('dialog.wonder .open-book')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Index', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Grain', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart this chapter' }).click();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await expect(page.getByRole('button', { name: 'Encyclopedia', exact: true })).toHaveCount(0);
});

test('only pressed described items get a book, through drag and lingering release, including below unlock threshold', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page);
  const grain = page.locator('[data-item="name:Grain"]'), stone = page.locator('[data-item="name:Stone"]');
  const book = grain.locator('.reading-indicator');
  await grain.hover();
  await expect(book).toBeHidden();
  const box = (await grain.boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down();
  await expect(book).toBeVisible();
  await expect(stone).toHaveClass(/possible/);
  await expect(stone.locator('.reading-indicator')).toBeHidden();
  expect(await book.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await book.locator('.open-book').evaluate(el => [getComputedStyle(el).width, getComputedStyle(el).height])).toEqual(['12.5px', '11.5px']);
  expect(await book.evaluate(el => getComputedStyle(el).opacity)).toBe('0.7');
  expect(await book.evaluate(el => getComputedStyle(el).filter)).toBe('saturate(0.3)');
  await page.mouse.move(70, 550, { steps: 4 });
  await expect(book).toBeVisible();
  await page.mouse.up(); await page.mouse.move(5, 700);
  await expect(book).toBeVisible();
  await page.waitForTimeout(450);
  await expect(book).toBeHidden();
  await grain.dblclick();
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
  await expect(page.locator('.encyclopedia-reading')).toHaveText('A grain explanation.');
  await expect(page.locator('dialog .open-book')).toHaveCount(0);
  await page.getByRole('button', { name: 'Index', exact: true }).click();
  await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone']);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(book).toBeHidden();
});

test('long mobile encyclopedia scrolls without horizontal overflow and supports stable pages, Index scroll/focus and Escape', async ({ page }) => {
  const entries = Array.from({ length: 30 }, (_, i) => `- Entry ${String(i).padStart(2, '0')}\n\n  Description ${i}.`).join('\n\n');
  await page.setViewportSize({ width: 320, height: 600 });
  await openFixture(page, manuscript.replace('- Tool\n', `${entries}\n\n- Tool\n`));
  // This deliberately overcrowded inventory is only a long-index fixture.
  await page.getByRole('button', { name: 'Read this chapter' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  const list = page.locator('.encyclopedia-list');
  expect(await list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await list.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await list.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const dialogNode = (await page.locator('dialog').elementHandle())!;
  const indexNode = (await page.locator('.encyclopedia-index').elementHandle())!;
  const entry = page.getByRole('link', { name: 'Entry 29', exact: true });
  await entry.focus();
  const scroll = await list.evaluate(el => el.scrollTop);
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog .reading-text')).toHaveText('Description 29.');
  expect(await dialogNode.evaluate(el => el.isConnected)).toBe(true);
  expect(await indexNode.evaluate(el => el.isConnected)).toBe(true);
  await expect(page.locator('.encyclopedia-index')).toHaveAttribute('inert', '');
  await expect(page.locator('.encyclopedia-index')).toHaveAttribute('aria-hidden', 'true');
  const back = page.getByRole('button', { name: 'Index', exact: true });
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
  await expect(page.locator('.encyclopedia-detail [data-command="close"]')).toHaveCount(1);
  await back.focus();
  const inactiveClose = page.locator('.encyclopedia-index [data-command="close"]');
  await inactiveClose.evaluate(el => (el as HTMLElement).focus());
  await expect(inactiveClose).not.toBeFocused();
  await expect(back).toBeFocused();
  // Enter must activate Index, never the off-page index Close.
  await page.keyboard.press('Enter');
  await expect(entry).toBeFocused();
  expect(await list.evaluate(el => el.scrollTop)).toBeCloseTo(scroll, 0);
  await expect(entry).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.encyclopedia-detail')).toHaveAttribute('inert', '');
  await expect(page.locator('.encyclopedia-detail')).toHaveAttribute('aria-hidden', 'true');
  await entry.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
});

test('touch opens an encyclopedia entry below threshold and dismisses reopened goals through their backdrop', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await openFixture(page);
  const grain = page.locator('[data-item="name:Grain"]'), box = (await grain.boundingBox())!;
  await page.touchscreen.tap(box.x + 20, box.y + 20);
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.touchscreen.tap(box.x + 20, box.y + 20);
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await expect(page.locator('dialog .reading-text')).toHaveText('A grain explanation.');
  await expect(page.locator('dialog .open-book')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Index', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Read this chapter' }).tap();
  await expect(page.locator('dialog.chapter-popup')).toBeVisible();
  await page.touchscreen.tap(4, 4);
  await expect(page.locator('dialog')).toHaveCount(0);
  await context.close();
});

test('mobile inner edges stay square; resizing reveals two accessible pages with only the right Close', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page, manuscript.replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n'));
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  const glyph = page.getByRole('button', { name: 'Encyclopedia', exact: true }).locator('.open-book');
  expect(await glyph.evaluate(el => [getComputedStyle(el).width, getComputedStyle(el).height])).toEqual(['20px', '18px']);
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Encyclopedia', exact: true });
  const index = page.locator('.encyclopedia-index'), detail = page.locator('.encyclopedia-detail');
  const pages = page.locator('.encyclopedia-pages'), spine = page.locator('.encyclopedia-spine');
  const node = (await dialog.elementHandle())!;
  for (const width of [320, 639]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(index).toHaveAttribute('aria-hidden', 'false');
    await expect(detail).toHaveAttribute('aria-hidden', 'true');
    expect(await detail.evaluate(el => (el as HTMLElement).inert)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Index', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
    expect(await page.getByRole('heading', { name: 'Index', exact: true }).evaluate(el => !!el.closest('.encyclopedia-index .encyclopedia-header'))).toBe(true);
    expect(await page.getByRole('button', { name: 'Close', exact: true }).evaluate(el => !!el.closest('.encyclopedia-index'))).toBe(true);
    const viewport = (await pages.boundingBox())!, left = (await index.boundingBox())!, fold = (await spine.boundingBox())!, right = (await detail.boundingBox())!;
    expect(left.width).toBeCloseTo(viewport.width - 24, 0);
    expect(fold.width).toBeCloseTo(12, 0);
    expect(right.x - viewport.x).toBeCloseTo(viewport.width - 12, 0);
    expect(await dialog.evaluate(el => [getComputedStyle(el).borderTopRightRadius, getComputedStyle(el).borderBottomRightRadius])).toEqual(['0px', '0px']);
    await page.getByRole('link', { name: 'Stone', exact: true }).click();
    await expect(index).toHaveAttribute('aria-hidden', 'true');
    await expect(detail).toHaveAttribute('aria-hidden', 'false');
    expect(await index.evaluate(el => (el as HTMLElement).inert)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Index', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
    await expect(detail.locator('[data-command="close"]')).toHaveCount(1);
    expect(await page.getByRole('button', { name: 'Index', exact: true }).evaluate(el => !!el.closest('.encyclopedia-detail .encyclopedia-header'))).toBe(true);
    const closeBox = (await page.getByRole('button', { name: 'Close', exact: true }).boundingBox())!;
    const indexBox = (await page.getByRole('button', { name: 'Index', exact: true }).boundingBox())!;
    expect(closeBox.x).toBeGreaterThan(indexBox.x + indexBox.width);
    expect(closeBox.y).toBeCloseTo(indexBox.y, 0);
    const turned = (await detail.boundingBox())!;
    expect(turned.x - viewport.x).toBeCloseTo(24, 0);
    expect(turned.width).toBeCloseTo(viewport.width - 24, 0);
    expect(await dialog.evaluate(el => [getComputedStyle(el).borderTopLeftRadius, getComputedStyle(el).borderBottomLeftRadius])).toEqual(['0px', '0px']);
    expect(await page.locator('.encyclopedia-track').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
    await expect(detail.locator('.reading-text')).toHaveText('A stone explanation.');
    expect(await node.evaluate(el => el.isConnected)).toBe(true);
    await page.getByRole('button', { name: 'Index', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Stone', exact: true })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Stone', exact: true })).toHaveAttribute('aria-current', 'true');
  }
  await page.getByRole('link', { name: 'Grain', exact: true }).click();
  for (const width of [640, 1100]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(index).toHaveAttribute('aria-hidden', 'false');
    await expect(detail).toHaveAttribute('aria-hidden', 'false');
    expect(await index.evaluate(el => (el as HTMLElement).inert)).toBe(false);
    expect(await detail.evaluate(el => (el as HTMLElement).inert)).toBe(false);
    await expect(page.getByRole('button', { name: 'Index', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
    await expect(detail.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
    const viewport = (await pages.boundingBox())!, left = (await index.boundingBox())!, right = (await detail.boundingBox())!;
    expect(left.x).toBeCloseTo(viewport.x, 0);
    expect(left.width).toBeCloseTo((viewport.width - 12) / 2, 0);
    expect(right.x).toBeCloseTo(left.x + left.width + 12, 0);
    expect(right.x + right.width).toBeCloseTo(viewport.x + viewport.width, 0);
    await page.getByRole('link', { name: 'Stone', exact: true }).click();
    await expect(detail.locator('.reading-text')).toHaveText('A stone explanation.');
    await expect(page.getByRole('link', { name: 'Stone', exact: true })).toBeFocused();
    expect(await node.evaluate(el => el.isConnected)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(index).toHaveAttribute('inert', '');
  await expect(page.getByRole('button', { name: 'Index', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(page.getByRole('link', { name: 'Stone', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Read this chapter' })).toBeEnabled();
  // A wide browser still has a narrow game area alongside the authoring pane.
  await openDebugPanel(page);
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  await expect(index).toHaveAttribute('aria-hidden', 'false');
  await expect(detail).toHaveAttribute('inert', '');
  await expect(index.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
});

test('chapter opening chooses first, previous selection, then latest shown wonder; mobile always opens the index', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await openFixture(page, manuscript.replace('Finish -- Final', 'Finish -- Unfinished')
    .replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n')
    .replace('- Final\n', '- Final\n\n  Final explanation.\n\n- Unfinished\n')
    + '- Final [preserve] + Tool [preserve] -> Unfinished\n');
  const openBook = async () => {
    await page.getByRole('button', { name: 'Read this chapter' }).click();
    await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  };
  const close = () => page.getByRole('button', { name: 'Close', exact: true }).click();
  const selected = page.locator('.encyclopedia-list [aria-current]');
  await openBook();
  await expect(selected).toHaveText('Grain');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('A grain explanation.');
  await page.getByRole('link', { name: 'Stone', exact: true }).click();
  await close(); await openBook();
  await expect(selected).toHaveText('Stone');
  await close(); await page.reload(); await openBook();
  await expect(selected).toHaveText('Stone');
  await close();
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('[data-item="name:Extra"]').dblclick();
  await expect(selected).toHaveText('Extra');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('Extra description.');
  await close(); await page.reload(); await openBook();
  await expect(selected).toHaveText('Flour');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('A flour explanation.');
  await close();
  await page.setViewportSize({ width: 390, height: 844 });
  await openBook();
  await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
  await expect(page.locator('.encyclopedia-detail')).toHaveAttribute('inert', '');
  await close();
  await page.locator('[data-item="name:Flour"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.locator('[data-item="name:Extra"]').dblclick();
  await expect(selected).toHaveText('Extra');
  await close(); await page.reload(); await openBook();
  await expect(selected).toHaveText('Final');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('Final explanation.');
});

test('story restart clears wonder history and the previous selection', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  const text = manuscript.replace('- Grain [transform] + Stone [consume] -> Flour', '- Grain [preserve] + Stone [preserve] -> Flour')
    .replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n');
  await openFixture(page, text);
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('[data-item="name:Stone"]').dblclick();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart this chapter' }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  // Flour's reading is no longer encountered, so the previous Stone visit wins.
  await expect(page.locator('.encyclopedia-list [aria-current]')).toHaveText('Stone');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  await expect(page.locator('.encyclopedia-list [aria-current]')).toHaveText('Grain');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('A grain explanation.');
  const history = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(key => key.startsWith('combination') && JSON.parse(localStorage.getItem(key)!).state);
    return key && JSON.parse(localStorage.getItem(key)!).encyclopedia;
  });
  expect(history).toEqual({ selected: 'name:Grain' });
});

test('opening a late entry selects it and scrolls the index into view in the spread', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  const entries = Array.from({ length: 30 }, (_, i) => `- Entry ${String(i).padStart(2, '0')}\n\n  Description ${i}.`).join('\n\n');
  await openFixture(page, manuscript.replace('- Tool\n', `${entries}\n\n- Tool\n`));
  // Keyboard activation avoids the intentionally crowded fixture's overlapping tiles.
  await page.locator('[data-item="name:Entry 29"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.encyclopedia-reading')).toHaveText('Description 29.');
  const selected = page.getByRole('link', { name: 'Entry 29', exact: true });
  await expect(selected).toHaveAttribute('aria-current', 'true');
  const row = (await selected.boundingBox())!, list = (await page.locator('.encyclopedia-list').boundingBox())!;
  expect(row.y).toBeGreaterThanOrEqual(list.y);
  expect(row.y + row.height).toBeLessThanOrEqual(list.y + list.height + 1);
  expect(await page.locator('.encyclopedia-list').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.locator('.encyclopedia-pages').evaluate(el => el.scrollLeft)).toBe(0);
});

test('keyboard activation opens the same entry below threshold; Index and Escape reveal only encountered descriptions', async ({ page }) => {
  await openFixture(page);
  const grain = page.locator('[data-item="name:Grain"]');
  await grain.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
  await expect(page.locator('.encyclopedia-reading')).toHaveText('A grain explanation.');
  await page.getByRole('button', { name: 'Index', exact: true }).click();
  await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone']);
  await expect(page.getByRole('link', { name: 'Grain', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await grain.focus(); await page.keyboard.press('Space');
  await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
  await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone']);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
});

test('book focus has no rectangle while keyboard controls and links keep a visible text cue', async ({ page }) => {
  await openFixture(page);
  await page.locator('[data-item="name:Grain"]').dblclick();
  const index = page.getByRole('button', { name: 'Index', exact: true });
  const close = page.getByRole('button', { name: 'Close', exact: true });
  const noRectangle = async (control: typeof index) => {
    expect(await control.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
    expect(await control.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
  };
  await expect(index).toBeFocused();
  await noRectangle(index);
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await noRectangle(close);
  expect(await close.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
  await page.keyboard.press('Shift+Tab');
  await expect(index).toBeFocused();
  await noRectangle(index);
  expect(await index.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
  await page.keyboard.press('Enter');
  const entry = page.getByRole('link', { name: 'Grain', exact: true });
  await expect(entry).toBeFocused();
  await noRectangle(entry);
  expect(await entry.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
});
