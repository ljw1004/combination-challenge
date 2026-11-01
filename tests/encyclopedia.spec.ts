import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

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
  await page.goto('/combinations.html?story=library-fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
}

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

test('two touch taps open an encyclopedia entry below the unlock threshold and Close returns to the board', async ({ browser }) => {
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
  await context.close();
});

test('one whole page and facing sliver at desktop and phone widths; page-local controls slide with it', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page, manuscript.replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n'));
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  const glyph = page.getByRole('button', { name: 'Encyclopedia', exact: true }).locator('.open-book');
  expect(await glyph.evaluate(el => [getComputedStyle(el).width, getComputedStyle(el).height])).toEqual(['25px', '23px']);
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Encyclopedia', exact: true });
  const index = page.locator('.encyclopedia-index'), detail = page.locator('.encyclopedia-detail');
  const pages = page.locator('.encyclopedia-pages'), spine = page.locator('.encyclopedia-spine');
  const node = (await dialog.elementHandle())!;
  for (const width of [1100, 390]) {
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
    expect(await page.locator('.encyclopedia-track').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
    await expect(detail.locator('.reading-text')).toHaveText('A stone explanation.');
    expect(await node.evaluate(el => el.isConnected)).toBe(true);
    await page.getByRole('button', { name: 'Index', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Stone', exact: true })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Stone', exact: true })).toHaveAttribute('aria-current', 'true');
  }
  await page.getByRole('link', { name: 'Grain', exact: true }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Read this chapter' })).toBeEnabled();
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
