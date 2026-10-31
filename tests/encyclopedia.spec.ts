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

test('retired discoveries unlock the manual encyclopedia; reading, Close, reload and reset preserve their boundaries', async ({ page }) => {
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
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await expect(page.locator('dialog button')).toHaveCount(1);
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

test('long mobile encyclopedia scrolls without horizontal overflow and supports keyboard reading/Close and Escape', async ({ page }) => {
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
  await page.getByRole('link', { name: 'Stone', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog .reading-text')).toHaveText('A stone explanation.');
  await page.getByRole('button', { name: 'Close', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Encyclopedia', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Stone', exact: true }).click();
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
