import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { openDebugPanel, jumpToChapter } from './debug-helpers.ts';

const manuscript = `# Landing fixture
## Workshop
![workshop](assets/bg.svg)

Workshop introduction.

**Goals**
- Build the kit -- Kit
**Items**
- Frame
- Tool
- Kit
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit

## Field
![field](assets/field.svg)

Field introduction.

**Goals**
- Finish -- Final
**Items**
- Kit
- Probe
- Final
**Combinations**
- Kit [preserve] + Probe [preserve] -> Final
`;

async function openFixture(page: Page, text = manuscript) {
  await page.route('**/landing-fixture/story.md', route => route.fulfill({ contentType: 'text/markdown', body: text }));
  await page.route('**/landing-fixture/assets/*.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"><rect width="390" height="844" fill="#d6dbc2"/></svg>' }));
  await page.goto('/combinations.html?story=landing-fixture/story.md');
}
async function progressKeys(page: Page) {
  return page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('combination-progress-v2:')));
}
async function expectLanding(page: Page) {
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  await expect(page.locator('[data-item]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Read this chapter' })).toHaveCount(0);
  await expect(page.locator('.game-dialog-layer dialog')).toHaveCount(0);
}

test('fresh story shows background and centered Start without saving; reload before and after Start respects the gate', async ({ page }) => {
  await openFixture(page);
  await expectLanding(page);
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/landing-fixture\/assets\/bg\.svg$/);
  const start = (await page.getByRole('button', { name: 'Start', exact: true }).boundingBox())!;
  const app = (await page.locator('#app').boundingBox())!;
  expect(start.x + start.width / 2).toBeCloseTo(app.x + app.width / 2, 0);
  expect(start.y + start.height / 2).toBeCloseTo(app.y + app.height / 2, 0);
  expect(await progressKeys(page)).toEqual([]);
  await page.reload();
  await expectLanding(page);
  expect(await progressKeys(page)).toEqual([]);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Begin', exact: true })).toBeVisible();
  await expect(page.locator('[data-item="name:Frame"]')).toHaveCount(1);
  expect((await progressKeys(page)).length).toBe(1);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Begin', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  await expect(page.locator('.game-dialog-layer dialog')).toHaveCount(0);
  await expect(page.locator('[data-item="name:Frame"]')).toHaveCount(1);
});

test('resize and live editing cannot expose gameplay before Start or create progress', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await openFixture(page);
  await openDebugPanel(page);
  const editor = page.getByRole('textbox', { name: 'Story Markdown' });
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(manuscript.replace('Workshop introduction.', 'Edited introduction.'));
  await expect(page.getByRole('button', { name: 'Toggle debug panel' })).toHaveClass(/edit-indicator/);
  await expectLanding(page);
  expect(await progressKeys(page)).toEqual([]);
  await page.setViewportSize({ width: 320, height: 600 });
  await expectLanding(page);
  expect(await progressKeys(page)).toEqual([]);
  await page.reload(); await expectLanding(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('.reading-text')).toContainText('Edited introduction.');
});

test('chapter reset starts its ordinary intro; confirmed story restart clears progress and returns to Start', async ({ page }) => {
  await openFixture(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  const frame = page.locator('[data-item="name:Frame"]');
  await frame.dragTo(page.locator('.viewport'), { targetPosition: { x: 200, y: 500 } });
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart this chapter' }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await frame.dragTo(page.locator('[data-item="name:Tool"]'));
  await page.getByRole('button', { name: 'Continue story' }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await expectLanding(page);
  expect(await progressKeys(page)).toEqual([]);
  await page.reload(); await expectLanding(page);
});

test('only a leading standalone description image supplies the cover; Start switches to the chapter background', async ({ page }) => {
  await openFixture(page, manuscript.replace('# Landing fixture\n', '# Landing fixture\n\n![cover](assets/cover.svg)\n\nStory description.\n\n'));
  await expectLanding(page);
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/landing-fixture\/assets\/cover\.svg$/);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Begin', exact: true })).toBeVisible();
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/landing-fixture\/assets\/bg\.svg$/);
  await page.evaluate(() => localStorage.clear());
  await openFixture(page, manuscript.replace('# Landing fixture\n', '# Landing fixture\n\nStory description first.\n\n![later illustration](assets/later.svg)\n\n'));
  await expectLanding(page);
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/landing-fixture\/assets\/bg\.svg$/);
});

test('editing before Start rebuilds fresh inventory rather than preserving an unplayed primitive', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await openFixture(page);
  await openDebugPanel(page);
  const editor = page.getByRole('textbox', { name: 'Story Markdown' });
  const revised = manuscript.replace('**Combinations**\n', '**Combinations**\n- Ore [preserve] + Tool [preserve] -> Frame\n');
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(revised);
  await expect(page.getByRole('button', { name: 'Toggle debug panel' })).toHaveClass(/edit-indicator/);
  await expectLanding(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(page.locator('[data-item="name:Frame"]')).toHaveCount(0);
  await expect(page.locator('[data-item="name:Ore"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close debug panel' }).click();
  await page.locator('[data-item="name:Ore"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await expect(page.locator('[data-item="name:Frame"]')).toHaveCount(1);
});

test('an explicit debug checkpoint bypasses Start even for chapter one', async ({ page }) => {
  await openFixture(page);
  await expectLanding(page);
  await jumpToChapter(page, 'Workshop', true);
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Begin', exact: true })).toBeVisible();
  await expect(page.locator('[data-item="name:Frame"]')).toHaveCount(1);
  await expect(page.getByText('Generated checkpoint', { exact: true })).toHaveCount(0);
});
