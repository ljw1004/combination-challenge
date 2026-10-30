import { expect, type Page } from '@playwright/test';

export async function openDebugPanel(page: Page) {
  if (!await page.locator('.story-editor').isVisible() && !await page.locator('.mobile-debug').isVisible()) {
    await page.getByRole('button', {name: 'Toggle debug panel'}).click();
  }
  await expect(page.locator('.story-editor:visible, .mobile-debug:visible')).toHaveCount(1);
}

export async function jumpToChapter(page: Page, heading: string, closePanel = false) {
  await openDebugPanel(page);
  if (await page.locator('.mobile-debug').isVisible()) {
    const chapters = page.locator('.mobile-debug-chapters button');
    const labels = await chapters.allTextContents();
    const index = labels.findIndex(label => label.replace(/^\d+\. /, '') === heading);
    expect(index).toBeGreaterThanOrEqual(0);
    await chapters.nth(index).click();
    return;
  }
  await page.getByRole('textbox', {name: 'Story Markdown'}).focus();
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  const search = page.locator('.cm-search input[name="search"]');
  await search.fill('');
  await search.pressSequentially(`## ${heading}`);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  const jump = page.getByRole('button', {name: `Jump to checkpoint: ${heading}`, exact: true});
  await jump.focus();
  await jump.click();
  if (closePanel) await page.getByRole('button', {name: 'Close debug panel'}).click();
}
