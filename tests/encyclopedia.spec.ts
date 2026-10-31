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
  await page.goto('/combinations.html?story=library-fixture');
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
}

test('retired discoveries unlock the manual encyclopedia; reading, Back, global Close, reload and reset preserve their boundaries', async ({ page }) => {
  await openFixture(page);
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await expect(page.getByRole('button', { name: 'Encyclopedia', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await expect(page.locator('dialog.wonder .open-book')).toHaveCount(0);
  await expect(page.locator('dialog.wonder .wonder-book button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  await expect(page.locator('.encyclopedia-list a')).toHaveText(['Grain', 'Stone', 'Flour']);
  await page.getByRole('link', { name: 'Grain', exact: true }).click();
  await expect(page.locator('dialog .reading-text')).toHaveText('A grain explanation.');
  await expect(page.locator('dialog.wonder .open-book')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
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
  await page.mouse.move(70, 550, { steps: 4 });
  await expect(book).toBeVisible();
  await page.mouse.up(); await page.mouse.move(5, 700);
  await expect(book).toBeVisible();
  await page.waitForTimeout(450);
  await expect(book).toBeHidden();
  await grain.dblclick();
  await expect(page.locator('dialog.wonder .open-book')).toHaveCount(0);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(book).toBeHidden();
});

test('long mobile encyclopedia scrolls without horizontal overflow and supports stable pages, Back scroll/focus and Escape', async ({ page }) => {
  const entries = Array.from({ length: 30 }, (_, i) => `- Entry ${String(i).padStart(2, '0')}\n\n  Description ${i}.`).join('\n\n');
  await page.setViewportSize({ width: 320, height: 600 });
  await openFixture(page, manuscript.replace('- Tool\n', `${entries}\n\n- Tool\n`));
  await page.getByRole('button', { name: 'Read this chapter' }).click();
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
  await page.getByRole('button', { name: 'Back', exact: true }).focus();
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

test('two touch taps still open a direct reading and Close returns to the board', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await openFixture(page);
  const grain = page.locator('[data-item="name:Grain"]'), box = (await grain.boundingBox())!;
  await page.touchscreen.tap(box.x + 20, box.y + 20);
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.touchscreen.tap(box.x + 20, box.y + 20);
  await expect(page.locator('dialog .reading-text')).toHaveText('A grain explanation.');
  await expect(page.locator('dialog .open-book')).toHaveCount(0);
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(page.locator('dialog')).toHaveCount(0);
  await context.close();
});

test('facing pages adapt to actual dialog width without losing selection; global Close exits from detail', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page, manuscript.replace('- Tool\n', '- Extra\n\n  Extra description.\n\n- Tool\n'));
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Encyclopedia', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Encyclopedia', exact: true });
  const index = page.locator('.encyclopedia-index'), detail = page.locator('.encyclopedia-detail');
  await expect(dialog).not.toHaveClass(/book-narrow/);
  await page.getByRole('link', { name: 'Stone', exact: true }).click();
  await expect(index).toHaveAttribute('aria-hidden', 'false');
  await expect(detail).toHaveAttribute('aria-hidden', 'false');
  expect(await index.evaluate(el => (el as HTMLElement).inert)).toBe(false);
  expect(await detail.evaluate(el => (el as HTMLElement).inert)).toBe(false);
  const left = (await index.boundingBox())!, right = (await detail.boundingBox())!;
  expect(right.x).toBeGreaterThanOrEqual(left.x + left.width - 1);
  expect(await page.locator('.encyclopedia-track').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  const node = (await dialog.elementHandle())!;
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog).toHaveClass(/book-narrow/);
  await expect(index).toHaveAttribute('aria-hidden', 'true');
  await expect(detail.locator('.reading-text')).toHaveText('A stone explanation.');
  expect(await node.evaluate(el => el.isConnected)).toBe(true);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Stone', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(dialog).not.toHaveClass(/book-narrow/);
  await expect(detail).toHaveAttribute('aria-hidden', 'false');
  await expect(detail.locator('.reading-text')).toHaveText('A stone explanation.');
  await page.getByRole('link', { name: 'Grain', exact: true }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Read this chapter' })).toBeEnabled();
});
