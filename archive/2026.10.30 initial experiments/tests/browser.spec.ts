import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { GameAPI } from '../src/ui.ts';

declare global { interface Window { watershed: GameAPI } }

const turn = (page: Page) => page.evaluate(() => window.watershed.getView().turn);
const cell = (page: Page, lane: number, slot: number) => page.locator(`[data-cell][data-lane="${lane}"][data-slot="${slot}"]`);
const recipe = (page: Page, id: string) => page.locator(`[data-recipe="recipe:${id}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto('/?experiment=flood');
  await expect(page.locator('.board-cell')).toHaveCount(9);
});

test('a revealed recipe can be inspected freely, then placed with the keyboard', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await recipe(page, 'grow-reeds').click();
  await expect(recipe(page, 'grow-reeds')).toHaveAttribute('aria-pressed', 'true');
  await cell(page, 0, 0).hover();
  await expect(page.locator('[data-preview]')).toContainText('Exact next response');
  expect(await turn(page)).toBe(0);
  await cell(page, 0, 0).focus();
  await page.keyboard.press('Enter');
  expect(await turn(page)).toBe(1);
  await expect(cell(page, 0, 0).locator('.cell-name')).toHaveText('Reeds');
  await expect(cell(page, 0, 0)).toBeFocused();
  expect(errors).toEqual([]);
});

test('undo retains a future for inspection, then a new action branches it', async ({ page }) => {
  await recipe(page, 'grow-reeds').click();
  await cell(page, 0, 0).click();
  await page.locator('[data-undo]').first().click();
  expect(await turn(page)).toBe(0);
  await expect(page.locator('.replay-notice')).toContainText('new branch');
  await page.locator('.lab-panel > summary').click();
  await page.locator('[data-seek]').focus();
  await page.keyboard.press('End');
  expect(await turn(page)).toBe(1);
  await page.keyboard.press('Home');
  expect(await turn(page)).toBe(0);
  await recipe(page, 'cut-channel').click();
  await cell(page, 0, 1).click();
  const run = await page.evaluate(() => JSON.parse(window.watershed.exportRun()));
  expect(run.decisions).toHaveLength(1);
  expect(run.decisions[0].action.recipe).toBe('cut-channel');
  await expect(page.locator('.replay-notice')).toHaveCount(0);
});

test('forecast preserves the three banks and bedrock refuses placement', async ({ page }) => {
  await expect(page.locator('.pulse-lanes')).toHaveCount(8);
  await expect(page.locator('.pulse-lanes').first()).toHaveAttribute('aria-label', /North \d+, middle \d+, south \d+/);
  await expect(page.locator('.board-legend')).toContainText('Next pulse: incoming water if you wait');
  await page.locator('[data-scenario="confluence"]').click();
  await recipe(page, 'grow-reeds').click();
  await cell(page, 1, 1).hover();
  await expect(page.locator('[data-preview]')).toContainText('Bedrock');
  await cell(page, 1, 1).click();
  expect(await turn(page)).toBe(0);
  await expect(cell(page, 1, 1)).toHaveClass(/is-blocked/);
});

test('replacing a structure is explicit and established ingredients are disabled', async ({ page }) => {
  await recipe(page, 'grow-reeds').click();
  await cell(page, 0, 0).click();
  await recipe(page, 'cut-channel').click();
  await cell(page, 0, 0).hover();
  await expect(page.locator('[data-preview]')).toContainText('Replaces Reeds');
  expect(await turn(page)).toBe(1);
  await page.locator('[data-tab="deploy"]').click();
  await expect(page.locator('[data-capability="water"]')).toBeDisabled();
  await expect(page.locator('[data-capability="heat"]')).toBeEnabled();
  await page.locator('[data-capability="heat"]').click();
  await cell(page, 0, 0).hover();
  await expect(page.locator('[data-preview]')).not.toContainText('Replaces Reeds');
});

test('a downloaded replay imports with its exact choices and responses', async ({ page }, testInfo) => {
  await recipe(page, 'grow-reeds').click();
  await cell(page, 0, 0).click();
  await page.locator('.lab-panel > summary').click();
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const download = await downloadEvent;
  const destination = testInfo.outputPath('replay.json');
  await download.saveAs(destination);
  const expected = JSON.parse(await readFile(destination, 'utf8'));
  await page.locator('[data-reset]').first().click();
  expect(await turn(page)).toBe(0);
  await page.locator('[data-import]').setInputFiles(destination);
  await expect.poll(() => turn(page)).toBe(1);
  const actual = await page.evaluate(() => JSON.parse(window.watershed.exportRun()));
  expect(actual).toEqual(expected);
  await expect(page.locator('.notice')).toContainText('Replay imported');
});

test('completion can resolve a proven safe forecast and records all remaining turns', async ({ page }) => {
  // A public adapter lets this test reach the same short constructive sequence without a solver.
  await recipe(page, 'grow-reeds').click();
  await cell(page, 0, 0).click();
  await recipe(page, 'grow-grove').click();
  await cell(page, 0, 1).click();
  const finish = page.locator('[data-finish-forecast]');
  for (let i = 0; i < 6 && await finish.count() === 0 && await turn(page) < 7; i++) {
    await page.locator('[data-wait]').click();
  }
  await expect(finish).toBeVisible();
  const before = await turn(page);
  await finish.click();
  await expect(page.locator('.outcome-card.won')).toBeVisible();
  const run = await page.evaluate(() => JSON.parse(window.watershed.exportRun()));
  expect(run.outcome).toBe('won');
  expect(run.decisions.length).toBeGreaterThan(before);
  expect(run.decisions.slice(before).every((decision: { action: { type: string } }) => decision.action.type === 'wait')).toBe(true);
  await page.locator('[data-next]').click();
  expect(await page.evaluate(() => window.watershed.getView().scenarioId)).toBe('confluence');
  expect(await turn(page)).toBe(0);
});

test('a lost encounter offers a working retry', async ({ page }) => {
  for (let i = 0; i < 8 && await page.evaluate(() => window.watershed.getView().status) === 'playing'; i++) await page.locator('[data-wait]').click();
  await expect(page.locator('.outcome-card.lost')).toBeVisible();
  await page.getByRole('button', { name: 'Try again ↻' }).click();
  expect(await turn(page)).toBe(0);
  await expect(page.locator('.outcome-card')).toHaveCount(0);
});

test('desktop decision board fits within a 900px viewport', async ({ page }) => {
  const box = await page.locator('.board-grid').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThan(900);
  await page.screenshot({ path: 'results/desktop-initial.png', fullPage: true });
});

test('mobile preserves the board, forecast and placement without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.locator('.pulse-lanes')).toHaveCount(8);
  await recipe(page, 'grow-reeds').click();
  await cell(page, 0, 0).click();
  expect(await turn(page)).toBe(1);
  await expect(cell(page, 0, 0).locator('.cell-name')).toHaveText('Reeds');
  await page.screenshot({ path: 'results/mobile-game.png', fullPage: true });
});
