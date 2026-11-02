import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { openDebugPanel as openEditor, jumpToChapter } from './debug-helpers.ts';

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

const manuscript = `# Editor fixture

A small story for live editing.

## Workshop

![workshop](assets/bg.svg)

Workshop introduction.

**Goals**
- Build the kit -- \`kit\`

**Items**
- \`frame\` Frame

  Frame explanation.

- \`tool\` Tool
- \`kit\` Kit

**Combinations**
- \`frame\` [preserve] + \`tool\` [preserve] -> \`kit\`

## Field

![field](assets/field.svg)

Field introduction.

**Goals**
- Test the kit -- \`tested\`

**Items**
- \`kit\`
- \`probe\` Probe
- \`tested\` Tested kit

**Combinations**
- \`kit\` [preserve] + \`probe\` [preserve] -> \`tested\`
`;

async function serveFixture(page: Page, text = manuscript) {
  await page.route('**/fixture/story.md', route => route.fulfill({ contentType: 'text/markdown', body: text }));
  await page.route('**/fixture/assets/*.svg', route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"><rect width="390" height="844" fill="#d6dbc2"/></svg>',
  }));
}

async function openFixture(page: Page, text = manuscript) {
  await serveFixture(page, text);
  await page.goto('/combinations.html?story=fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await openEditor(page);
}

async function edit(page: Page, text: string) {
  await page.getByRole('textbox', { name: 'Story Markdown' }).focus();
  await page.keyboard.press('ControlOrMeta+A');
  if (text) await page.keyboard.insertText(text);
  else await page.keyboard.press('Backspace');
}

async function savedText(page: Page, text: string): Promise<boolean> {
  return page.evaluate(expected => Object.entries(localStorage).some(([key, raw]) => {
    if (!key.startsWith('combination-draft-v1:')) return false;
    try { return JSON.parse(raw).text === expected; } catch { return false; }
  }), text);
}

async function expectTextOverlay(bulb: ReturnType<Page['locator']>) {
  await bulb.scrollIntoViewIfNeeded();
  const geometry = await bulb.evaluate(control => {
    const row = control.closest('.cm-line,.editor-diagnostic-row')!;
    const range = document.createRange();
    const text = row.querySelector('.editor-diagnostic-text');
    if (text) range.selectNodeContents(text);
    else { range.selectNodeContents(row); range.setEndBefore(control.parentElement!); }
    const end = [...range.getClientRects()].filter(rect => rect.width > 0).at(-1)!;
    const bounds = control.getBoundingClientRect(), before = row.getBoundingClientRect().height;
    (control as HTMLElement).style.display = 'none';
    const after = row.getBoundingClientRect().height;
    (control as HTMLElement).style.removeProperty('display');
    return {left: bounds.left, bottom: bounds.bottom, textRight: end.right, textBottom: end.bottom, before, after};
  });
  expect(geometry.before).toBe(geometry.after);
  expect(Math.abs(geometry.left - geometry.textRight)).toBeLessThan(2);
  expect(Math.abs(geometry.bottom - geometry.textBottom)).toBeLessThan(6);
}

async function beginDelayedDeletion(page: Page) {
  let release!: () => void;
  let requested!: () => void;
  const responseGate = new Promise<void>(resolve => { release = resolve; });
  const requestStarted = new Promise<void>(resolve => { requested = resolve; });
  await page.route('**/fixture/story.md', async route => {
    requested();
    await responseGate;
    await route.fulfill({contentType: 'text/markdown', body: manuscript});
  }, {times: 1});
  await page.getByRole('button', {name: 'Delete draft…', exact: true}).click();
  await page.getByRole('button', {name: 'Delete saved draft', exact: true}).click();
  await requestStarted;
  return release;
}

test('live edits update the current view and survive temporary deletion of its chapter', async ({ page }) => {
  await openFixture(page);
  const card = page.locator('[data-item="id:frame"]');
  const geometry = await card.evaluate(element => ({ left: (element as HTMLElement).style.left, top: (element as HTMLElement).style.top }));
  const scroll = await page.locator('.viewport').evaluate(element => { element.scrollTop = 20; return element.scrollTop; });
  const image = await page.locator('.scene-art').elementHandle();
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  const popup = await page.locator('dialog').elementHandle();
  const revised = manuscript
    .replace('Workshop introduction.', 'The workshop has changed.')
    .replace('`frame` Frame', '`frame` Polished frame')
    .replace('Frame explanation.', 'A newly revised explanation.')
    .replace('Build the kit', 'Assemble the kit')
    .replace('assets/bg.svg', 'assets/revised.svg');
  await edit(page, revised);
  await expect(page.locator('dialog')).toContainText('The workshop has changed.');
  await expect(card.locator('.item-label')).toHaveText('Polished frame');
  await expect(page.locator('.objective-line')).toContainText('Assemble the kit');
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/fixture\/assets\/revised\.svg$/);
  expect(await image!.evaluate(element => element.isConnected)).toBe(true);
  expect(await popup!.evaluate(element => element.isConnected)).toBe(true);
  expect(await card.evaluate(element => ({ left: (element as HTMLElement).style.left, top: (element as HTMLElement).style.top }))).toEqual(geometry);
  expect(await page.locator('.viewport').evaluate(element => element.scrollTop)).toBe(scroll);

  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await card.dblclick();
  await expect(page.locator('dialog')).toContainText('A newly revised explanation.');
  const explained = revised.replace('A newly revised explanation.', 'This reading also updates live.');
  await edit(page, explained);
  await expect(page.locator('dialog')).toContainText('This reading also updates live.');
  await page.getByRole('button', { name: 'Close', exact: true }).click();

  await edit(page, explained.replace('Assemble the kit -- `kit`', 'Assemble the kit -- `frame`'));
  await expect(page.getByRole('button', { name: 'Continue story' })).toBeVisible();
  await expect(page.locator('dialog')).toHaveCount(0);
  await card.dblclick();
  await expect(page.locator('dialog')).toContainText('This reading also updates live.');
  await page.getByRole('button', {name: 'Close', exact: true}).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Index', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await edit(page, explained.replace('Polished frame', 'Live despite error') + '\n**Goals**\n- Missing condition\n');
  await expect(card.locator('.item-label')).toHaveText('Live despite error');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.locator('.editor-diagnostic[data-severity="error"]')).not.toHaveCount(0);
  await edit(page, explained);
  await expect(card.locator('.item-label')).toHaveText('Polished frame');

  await jumpToChapter(page, 'Field');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(1);
  const withoutField = explained.split('\n## Field')[0];
  await edit(page, withoutField);
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
  await edit(page, explained);
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(1);

  // A deliberate game action establishes a new anchor; text recovery must not
  // jump back past it when the deleted chapter is subsequently restored.
  await edit(page, withoutField);
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
  await card.dragTo(page.locator('.viewport'), { targetPosition: { x: 260, y: 520 } });
  await edit(page, explained);
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
});

test('drafts save before preview, reopen on desktop, and only explicit deletion removes them', async ({ page }) => {
  await openFixture(page);
  const toggle = page.getByRole('button', {name: 'Toggle debug panel'});
  const deleteDraft = page.getByRole('button', {name: 'Delete draft…', exact: true});
  await expect(deleteDraft).toBeHidden();
  await expect(toggle).toHaveCount(1);
  await expect(toggle).not.toHaveClass(/edit-indicator/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('complementary', {name: 'Debug panel'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Story editor'})).toHaveCount(0);
  await expect(page.getByRole('button', {name: /^(Copy Markdown|Download|Generate checkpoint|Restart story|Stories|Undo|Export save)$/})).toHaveCount(0);
  await expect(page.locator('.editor-save-status')).toBeHidden();
  await expect(page.getByText('Recipe inspector', {exact: true})).toHaveCount(0);
  await page.setViewportSize({width: 1600, height: 800});
  expect((await page.locator('#app').boundingBox())!.width).toBe(390);
  expect((await page.locator('.story-editor').boundingBox())!.width).toBe(1210);
  await page.setViewportSize({width: 1000, height: 800});
  expect((await page.locator('#app').boundingBox())!.width).toBe(390);
  expect((await page.locator('.story-editor').boundingBox())!.width).toBe(610);
  await page.setViewportSize({width: 1280, height: 800});
  expect(await savedText(page, manuscript)).toBe(false);
  await page.reload();
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toBeVisible();
  await page.getByRole('button', {name: 'Close debug panel'}).click();
  await page.reload();
  await expect(page.locator('.story-editor')).toHaveCount(0);
  await openEditor(page);
  const changed = manuscript.replace('Workshop introduction.', 'A durable draft introduction.');
  await edit(page, changed);
  await expect(deleteDraft).toBeVisible();
  await expect(toggle).toHaveClass(/edit-indicator/);
  await expect(toggle).toHaveCount(1);
  await toggle.click();
  await expect(page.locator('.story-editor')).toBeHidden();
  await toggle.click();
  await expect(page.locator('.story-editor')).toBeVisible();
  await expect(page.locator('.editor-save-status')).toBeHidden();
  const editorNode = await page.getByRole('textbox', {name: 'Story Markdown'}).elementHandle();
  await page.setViewportSize({width: 390, height: 800});
  await expect(page.locator('.story-editor')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveClass(/edit-indicator/);
  await jumpToChapter(page, 'Field');
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(1);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.setViewportSize({width: 1280, height: 800});
  await expect(page.locator('.story-editor')).toBeVisible();
  expect(await editorNode!.evaluate(element => element.isConnected)).toBe(true);
  await expect(page.getByRole('button', {name: 'Chapter', exact: true})).toHaveText('2. Field');
  await expect(page.locator('.cm-activeLine')).toHaveText('## Field');
  await expect(page.locator('.cm-activeLine')).toBeInViewport();
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toContainText('A durable draft introduction.');
  await page.getByRole('textbox', {name: 'Story Markdown'}).focus();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toContainText('Workshop introduction.');
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toContainText('A durable draft introduction.');
  await jumpToChapter(page, 'Workshop');
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  expect(await savedText(page, changed)).toBe(true);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('A durable draft introduction.');
  await expect(deleteDraft).toBeVisible();

  await page.getByRole('button', { name: 'Close debug panel' }).click();
  await expect(page.locator('.story-editor')).toBeHidden();
  expect(await savedText(page, changed)).toBe(true);
  await page.reload();
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toBeVisible();
  await page.getByRole('button', {name: 'Close debug panel'}).click();
  await jumpToChapter(page, 'Workshop');
  await expect(page.locator('dialog')).toContainText('A durable draft introduction.');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await openEditor(page);

  const invalid = changed + '\n'.repeat(80) + '**Goals**\n- Missing condition\n';
  await edit(page, invalid);
  const diagnostic = page.locator('.editor-diagnostic[data-severity="error"]').filter({ hasText: 'empty-goal' }).first();
  await expect(diagnostic).toBeVisible();
  await diagnostic.click();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toBeFocused();
  await expect(page.locator('.cm-activeLine')).toContainText('Missing condition');
  expect(await page.locator('.cm-scroller').evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  const diagnosticLine = Number(await diagnostic.getAttribute('data-line'));
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.insertText('\n\n');
  expect(Number(await diagnostic.getAttribute('data-line'))).toBe(diagnosticLine + 2);
  await diagnostic.click();
  await expect(page.locator('.cm-activeLine')).toContainText('Missing condition');

  await edit(page, '');
  expect(await savedText(page, '')).toBe(true);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toHaveText('');

  const releaseLocalDelete = await beginDelayedDeletion(page);
  const newer = changed.replace('A durable draft introduction.', 'New edit made during deletion.');
  await edit(page, newer);
  expect(await savedText(page, newer)).toBe(true);
  releaseLocalDelete();
  await expect(page.locator('.editor-save-status')).toContainText('Deletion cancelled');
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('New edit made during deletion.');

  const localBeforeRemote = newer + '\n> NOTE: Retained in this tab.\n';
  await edit(page, localBeforeRemote);
  expect(await savedText(page, localBeforeRemote)).toBe(true);
  const otherTab = await page.context().newPage();
  await serveFixture(otherTab);
  await otherTab.goto('/combinations.html?story=fixture/story.md');
  await expect(otherTab.getByRole('textbox', { name: 'Story Markdown' })).toBeVisible();
  const releaseRemoteDelete = await beginDelayedDeletion(page);
  const remoteEdit = localBeforeRemote.replace('New edit made during deletion.', 'A newer copy from another tab.');
  await edit(otherTab, remoteEdit);
  expect(await savedText(otherTab, remoteEdit)).toBe(true);
  await expect.poll(() => savedText(page, remoteEdit)).toBe(true);
  releaseRemoteDelete();
  await expect(page.locator('.editor-save-status')).toContainText('Deletion cancelled');
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('New edit made during deletion.');
  expect(await savedText(page, localBeforeRemote)).toBe(true);
  await otherTab.close();

  await page.getByRole('button', { name: 'Delete draft…', exact: true }).click();
  expect(await savedText(page, localBeforeRemote)).toBe(true);
  await page.getByRole('button', { name: 'Delete saved draft', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('Workshop introduction.');
  await expect(toggle).not.toHaveClass(/edit-indicator/);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('combination-draft-v1:')))).toEqual([]);
  await expect(deleteDraft).toBeHidden();
});

test('same-directory loading, missing-story errors and failed storage keep the editing boundary clear', async ({ page }) => {
  await serveFixture(page);
  await page.route('**/fixture/combinations.html', async route => {
    const response = await route.fetch({url: new URL('/combinations.html', route.request().url()).href});
    await route.fulfill({response});
  });
  await page.goto('/fixture/combinations.html');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/fixture\/assets\/bg\.svg$/);
  await openEditor(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('combination-draft-v1:')) throw new DOMException('Full storage', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  const unsaved = manuscript.replace('Workshop introduction.', 'Still available in this editor.');
  await edit(page, unsaved);
  await expect(page.locator('.editor-save-status')).toHaveAttribute('data-state', 'error');
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('Still available in this editor.');
  await page.getByRole('textbox', { name: 'Story Markdown' }).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.keyboard.press('ControlOrMeta+C');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(unsaved);

  page.on('dialog', dialog => dialog.accept());
  await page.route('**/missing/story.md', route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Missing' }));
  await page.goto('/combinations.html?story=missing/story.md');
  await expect(page.getByText(/Could not load the story.*HTTP 404/)).toBeVisible();
  await expect(page.locator('.chapter-panel')).toHaveCount(0);
});

test('diagnostics keep source order and scroll while their related locations navigate and track edits', async ({ page }) => {
  const text = manuscript.replace('- Build the kit -- `kit`', '- Build the kit -- `kit`\n- Keep the frame -- `frame`\n- Keep the tool -- `tool`')
    + '\n- `frame` [consume] + `probe` [preserve] -> Scrap\n- `frame` [transform] + `tool` [preserve] -> Shaped frame\n- `tool` [consume] + `probe` [preserve] -> Toolbox\n'
    + '\n**Goals**\n' + Array.from({length: 12}, (_, i) => `- Incomplete goal ${i}\n`).join('');
  await serveFixture(page, text.replaceAll('\n', '\r\n'));
  await page.goto('/combinations.html?story=fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await openEditor(page);
  const entries = page.locator('.editor-diagnostic');
  const list = page.locator('.editor-diagnostics-list');
  const last = entries.filter({hasText: 'empty-goal'}).last();
  await last.scrollIntoViewIfNeeded();
  const order = await entries.allTextContents();
  const lastNode = await last.elementHandle();
  const scroll = await list.evaluate(element => element.scrollTop);
  expect(scroll).toBeGreaterThan(0);
  await last.click();
  await expect(page.locator('.cm-activeLine')).toContainText('Incomplete goal 11');
  expect(await entries.allTextContents()).toEqual(order);
  expect(await lastNode!.evaluate(element => element.isConnected)).toBe(true);
  expect(await list.evaluate(element => element.scrollTop)).toBe(scroll);

  const goals = entries.filter({hasText: 'many-visible-goals'}).filter({hasText: 'Workshop'});
  await goals.click();
  await expect(page.locator('.cm-activeLine')).toHaveText('**Goals**');
  expect(await entries.allTextContents()).toEqual(order);

  const mixed = entries.filter({hasText: 'Frame has mixed fates'});
  await expect(mixed).toContainText('preserve (1), consume (1), transform (1)');
  await expect(mixed).toContainText('Frame has mixed fates: preserve (1), consume (1), transform (1)');
  await expect(mixed).toContainText('visibility and placement hints');
  await expect(mixed).toContainText('can be intentional');
  const group = page.locator('.editor-diagnostic-entry').filter({hasText: 'Frame has mixed fates'});
  await mixed.click();
  await expect(mixed).toHaveAttribute('aria-pressed', 'true');
  await expect(group.locator('.editor-related-locations')).toBeVisible();
  await mixed.click();
  await expect(mixed).toHaveAttribute('aria-pressed', 'true');
  await expect(group.locator('.editor-related-locations')).toBeHidden();
  const mixedBulb = group.locator('.editor-diagnostic-fix');
  await mixedBulb.click();
  await expect(page.getByRole('menu', {name: 'Frame', exact: true})).toBeVisible();
  await expect(group.locator('.editor-related-locations')).toBeHidden();
  await mixedBulb.click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(mixedBulb).toHaveAttribute('aria-expanded', 'false');
  await expect(group.locator('.editor-related-locations')).toBeHidden();
  await mixed.click();
  await mixedBulb.click();
  await expect(group.locator('.editor-related-locations')).toBeVisible();
  await mixedBulb.click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(group.locator('.editor-related-locations')).toBeVisible();
  const tool = entries.filter({hasText: 'Tool has mixed fates'});
  await tool.click();
  await expect(group.locator('.editor-related-locations')).toBeHidden();
  expect(await list.locator('.editor-related-locations:visible').count()).toBe(1);
  await mixed.click();
  const transform = group.locator('.editor-related-location').filter({hasText: 'transform (explicit)'});
  await transform.scrollIntoViewIfNeeded();
  const relatedScroll = await list.evaluate(element => element.scrollTop);
  const line = Number(await transform.getAttribute('data-line'));
  await transform.click();
  await expect(page.locator('.cm-activeLine')).toContainText('`frame` [transform]');
  expect(await list.evaluate(element => element.scrollTop)).toBe(relatedScroll);
  expect(await entries.allTextContents()).toEqual(order);
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.insertText('\n\n');
  expect(Number(await transform.getAttribute('data-line'))).toBe(line + 2);
  await expect(group.locator('.editor-related-locations')).toBeVisible();
  await transform.click();
  await expect(page.locator('.cm-activeLine')).toContainText('`frame` [transform]');

  // Hover details expose the same links as the diagnostics panel.
  await mixed.click();
  await mixed.click();
  await page.locator('.cm-activeLine .cm-lintRange-warning').first().hover();
  const tooltip = page.locator('.cm-tooltip-lint');
  await expect(tooltip).toContainText('consume (explicit)');
  await tooltip.locator('.editor-related-location:visible').filter({hasText: 'consume (explicit)'}).click();
  await expect(page.locator('.cm-activeLine')).toContainText('`frame` [consume]');

  const toolGroup = page.locator('.editor-diagnostic-entry').filter({hasText: 'Tool has mixed fates'});
  await toolGroup.locator('.editor-diagnostic-fix').click();
  const menu = page.getByRole('menu', {name: 'Tool', exact: true});
  await expect(menu.getByRole('heading', {name: 'Tool', exact: true})).toBeVisible();
  await expect(group.locator('.editor-related-locations')).toBeVisible();
  await expect(toolGroup.locator('.editor-related-locations')).toBeHidden();
  expect(await menu.getByRole('menuitem').allTextContents()).toEqual(['always preserve', 'always consume']);
  await menu.getByRole('menuitem', {name: 'always consume', exact: true}).click();
  await expect(tool).toHaveCount(0);
  expect(await savedText(page, '\n\n' + text.replaceAll('`tool` [preserve]', '`tool` [consume]'))).toBe(true);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(tool).toBeVisible();
  expect(await savedText(page, '\n\n' + text)).toBe(true);
  await tool.click();
  const sourceFix = page.locator('.cm-activeLine .editor-source-fix[aria-label*="Tool has mixed fates"]');
  await expect(sourceFix).toBeVisible();
  await sourceFix.scrollIntoViewIfNeeded();
  const geometry = await page.locator('.cm-activeLine').evaluate(line => {
    const bulbs = [...line.querySelectorAll<HTMLElement>('.editor-source-fix')];
    const withIcons = line.getBoundingClientRect().height;
    const bounds = bulbs.map(bulb => bulb.getBoundingClientRect());
    bulbs.forEach(bulb => bulb.style.display = 'none');
    const withoutIcons = line.getBoundingClientRect().height;
    bulbs.forEach(bulb => bulb.style.removeProperty('display'));
    return {withIcons, withoutIcons, overlap: bounds.some((a, i) => bounds.slice(i + 1).some(b => a.left < b.right && b.left < a.right))};
  });
  expect(geometry.withIcons).toBe(geometry.withoutIcons);
  expect(geometry.overlap).toBe(false);
  await page.keyboard.press('ControlOrMeta+.');
  const rowMenu = page.getByRole('menu', {name: 'Quick actions', exact: true});
  await expect(rowMenu).toBeVisible();
  await page.keyboard.press('End');
  await expect(rowMenu.getByRole('menuitem', {name: 'Tool: always consume', exact: true})).toBeFocused();
  await page.keyboard.press('Home');
  await expect(rowMenu.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await sourceFix.click();
  await expect(menu).toBeVisible();
  await sourceFix.click();
  await expect(menu).toHaveCount(0);
  await expect(sourceFix).toHaveAttribute('aria-expanded', 'false');
  await sourceFix.click();
  await expect(menu.getByRole('heading', {name: 'Tool', exact: true})).toBeVisible();
  expect(await menu.getByRole('menuitem').allTextContents()).toEqual(['always preserve', 'always consume']);
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', {name: 'always consume', exact: true})).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(tool).toHaveCount(0);
  expect(await savedText(page, '\n\n' + text.replaceAll('`tool` [consume]', '`tool` [preserve]'))).toBe(true);
  const longName = 'A tool with an unusually long title that explains its place in this story in considerable detail';
  await edit(page, text.replace('`tool` Tool', '`tool` ' + longName));
  await page.locator('.editor-diagnostic-entry').filter({hasText: `${longName} has mixed fates`}).locator('.editor-diagnostic-fix').click();
  const longHeading = page.getByRole('menu', {name: longName, exact: true}).getByRole('heading');
  await expect(longHeading).toHaveAttribute('title', longName);
  expect(await longHeading.evaluate(heading => heading.scrollWidth > heading.clientWidth)).toBe(true);
  expect((await longHeading.boundingBox())!.width).toBeLessThanOrEqual(350);
});

test('chapter heading checkpoint buttons use live text and preserve the draft and editor position', async ({ page }) => {
  await openFixture(page);
  const edited = manuscript.replace('Workshop introduction.', 'A saved checkpoint draft.');
  await edit(page, edited);
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  await page.locator('.cm-search input[name="search"]').pressSequentially('## Field');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  const heading = page.locator('.cm-chapter-heading').filter({hasText: '## Field'});
  const jump = heading.getByRole('button', {name: 'Jump to checkpoint: Field', exact: true});
  await heading.hover();
  await expect(jump).toHaveCSS('opacity', '1');
  await expectTextOverlay(jump);
  const scroll = await page.locator('.cm-scroller').evaluate(element => element.scrollTop);
  await jump.click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(jump).toHaveAttribute('aria-expanded', 'true');
  await jump.click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(jump).toHaveAttribute('aria-expanded', 'false');
  await jump.click();
  await page.getByRole('menuitem', {name: 'Jump to checkpoint', exact: true}).click();
  await expect(page.locator('dialog')).toContainText('Field introduction.');
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(1);
  expect(await savedText(page, edited)).toBe(true);
  expect(await page.locator('.cm-scroller').evaluate(element => element.scrollTop)).toBe(scroll);
  await expect(page.getByText('Generated checkpoint', {exact: true})).toHaveCount(0);
});

test('opening the editor reveals the current gameplay chapter without resetting progress', async ({page}) => {
  const text = manuscript.replace('## Field', '\n'.repeat(80) + '## Field').replaceAll('\n', '\r\n');
  await serveFixture(page, text);
  await page.goto('/combinations.html?story=fixture/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="id:frame"]').dragTo(page.locator('[data-item="id:tool"]'));
  await page.getByRole('button', {name: 'Continue story'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="id:probe"]').dragTo(page.locator('[data-item="id:kit"]'));
  await expect(page.locator('[data-item="id:tested"]')).toHaveCount(1);

  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  const dropdown = page.getByRole('button', {name: 'Chapter', exact: true});
  const scroller = page.locator('.cm-scroller');
  async function expectCurrentChapter() {
    await expect(dropdown).toHaveText('2. Field');
    const heading = page.locator('.cm-activeLine');
    await expect(heading).toHaveText('## Field');
    await expect(heading).toBeInViewport();
    expect(await scroller.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await editor.focus();
    await expect.poll(() => heading.evaluate(element => {
      const selection = window.getSelection()!;
      const range = document.createRange(); range.selectNodeContents(element);
      range.setEnd(selection.focusNode!, selection.focusOffset);
      return {collapsed: selection.isCollapsed, beforeCaret: range.toString()};
    })).toEqual({collapsed: true, beforeCaret: '## Field'});
    await expect(page.locator('[data-item="id:tested"]')).toHaveCount(1);
    await expect(page.locator('dialog')).toHaveCount(0);
    expect(await savedText(page, text)).toBe(false);
  }

  await openEditor(page);
  await expectCurrentChapter();
  // An existing editor can be left at a different chapter with unrelated scroll.
  await page.keyboard.press('ControlOrMeta+Home');
  await expect(dropdown).toHaveText('Chapter');
  await page.getByRole('button', {name: 'Close debug panel'}).click();
  await openEditor(page);
  await expectCurrentChapter();
  // A remembered open pane must use restored game progress during construction.
  await page.reload();
  await expectCurrentChapter();
});

test('chapter dropdown follows the caret and jumps with only the necessary editor movement', async ({page}) => {
  await openFixture(page, manuscript.replaceAll('\n', '\r\n'));
  const dropdown = page.getByRole('button', {name: 'Chapter', exact: true});
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await expect(dropdown).toHaveText('1. Workshop');
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+End');
  await expect(dropdown).toHaveText('2. Field');
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
  const scroller = page.locator('.cm-scroller');
  const scroll = await scroller.evaluate(element => element.scrollTop);
  const selection = () => editor.evaluate(element => {
    const selection = window.getSelection()!;
    const range = document.createRange(); range.selectNodeContents(element); range.setEnd(selection.focusNode!, selection.focusOffset);
    return range.toString();
  });
  const before = await selection();
  await dropdown.click();
  await expect(page.getByRole('option', {name: '2. Field', exact: true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog')).toContainText('Field introduction.');
  expect(await scroller.evaluate(element => element.scrollTop)).toBe(scroll);
  await editor.focus();
  expect(await selection()).toBe(before);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="id:probe"]').dragTo(page.locator('[data-item="id:kit"]'));
  await expect(page.locator('[data-item="id:tested"]')).toHaveCount(1);
  await dropdown.click();
  await page.getByRole('option', {name: '2. Field', exact: true}).click();
  await expect(page.locator('[data-item="id:tested"]')).toHaveCount(0);
  expect(await scroller.evaluate(element => element.scrollTop)).toBe(scroll);

  await dropdown.click();
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog')).toContainText('Workshop introduction.');
  await expect(dropdown).toHaveText('1. Workshop');
  await expect(page.locator('.cm-activeLine')).toHaveText('## Workshop');
  await expect(editor).toBeFocused();
  await page.keyboard.insertText(' revised');
  await expect(dropdown).toHaveText('1. Workshop revised');
  await expect.poll(() => savedText(page, manuscript.replace('## Workshop', '## Workshop revised'))).toBe(true);
  await dropdown.click();
  await expect(page.getByRole('option', {name: '1. Workshop revised', exact: true})).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(dropdown).toBeFocused();

  // Rebuild source locations synchronously, including CRLF loading and structural edits.
  await edit(page, manuscript.replace('## Field', '## Field revised'));
  await dropdown.click();
  await page.getByRole('option', {name: '1. Workshop', exact: true}).click();
  await expect(page.locator('.cm-activeLine')).toHaveText('## Workshop');
  await edit(page, '# No chapters yet\n');
  await expect(dropdown).toBeDisabled();
  await edit(page, manuscript);
  await expect(dropdown).toBeEnabled();
  await dropdown.click();
  await page.getByRole('option', {name: '1. Workshop', exact: true}).click();
  await expect(page.locator('dialog')).toContainText('Workshop introduction.');
});

test('mobile chapter navigation is a compact scrolling list and creates checkpoints', async ({page}) => {
  await page.setViewportSize({width: 390, height: 640});
  const extra = Array.from({length: 18}, (_, index) => `\n## Chapter ${index + 3}\n\n**Goals**\n- Keep the kit -- \`kit\`\n`).join('');
  await serveFixture(page, manuscript + extra);
  await page.goto('/combinations.html?story=fixture/story.md');
  await openEditor(page);
  const dialog = page.getByRole('dialog', {name: 'Jump to chapter'});
  const list = dialog.getByRole('list');
  await expect(dialog).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(dialog.getByRole('button', {name: '1. Workshop', exact: true})).toBeFocused();
  expect(await list.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  const geometry = await list.getByRole('button').evaluateAll(buttons => buttons.slice(0, 2).map(button => {
    const rect = button.getBoundingClientRect(), css = getComputedStyle(button);
    return {top: rect.top, bottom: rect.bottom, height: rect.height, border: css.borderWidth, radius: css.borderRadius};
  }));
  expect(geometry[1].top).toBe(geometry[0].bottom);
  expect(geometry[0].height).toBe(44);
  expect(geometry[0].border).toBe('0px');
  expect(geometry[0].radius).toBe('0px');
  await list.getByRole('button').last().scrollIntoViewIfNeeded();
  expect(await list.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await dialog.getByRole('button', {name: '2. Field', exact: true}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('dialog')).toContainText('Field introduction.');
  await expect(page.locator('[data-item="id:kit"]')).toHaveCount(1);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await openEditor(page);
  await expect(dialog.getByRole('button', {name: '2. Field', exact: true})).toHaveAttribute('aria-current', 'step');
  await expect(dialog.getByRole('button', {name: '2. Field', exact: true})).toBeFocused();
  await dialog.getByRole('button', {name: '1. Workshop', exact: true}).click();
  await expect(page.locator('dialog')).toContainText('Workshop introduction.');
  await expect(page.locator('[data-item="id:kit"]')).toHaveCount(0);
});

test('find counts selected matches and navigates from the current caret', async ({page}) => {
  const text = manuscript.replace('Workshop introduction.', 'needle first.\n\nNeedle second.\n\nneedlework third.\n\nLiteral [x].* and \\n markers.')
    .replace('Field introduction.', 'needle fourth.');
  await openFixture(page, text);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  const panel = page.locator('.cm-search');
  const find = panel.getByRole('textbox', {name: 'Find', exact: true});
  const count = panel.getByRole('status', {name: 'Search matches'});
  const next = panel.getByRole('button', {name: 'Next match'});
  const previous = panel.getByRole('button', {name: 'Previous match'});
  await expect(find).toBeFocused();
  await expect(panel.getByRole('checkbox')).toHaveCount(1);
  await expect(panel.getByRole('button', {name: /^(all|select all matches)$/i})).toHaveCount(0);
  await expect(panel.getByText(/^(regexp|by word)$/i)).toHaveCount(0);
  await find.fill('needle');
  await expect(count).toHaveText('1 of 4');
  await find.press('Enter');
  await expect(count).toHaveText('2 of 4');
  await next.click();
  await expect(count).toHaveText('3 of 4');
  await previous.click();
  await expect(count).toHaveText('2 of 4');
  await find.press('Shift+Enter');
  await expect(count).toHaveText('1 of 4');
  await find.press('Shift+Enter');
  await expect(count).toHaveText('4 of 4');
  await next.click();
  await expect(count).toHaveText('1 of 4');

  await page.locator('.cm-line').filter({hasText: /^Needle second\.$/}).click();
  await page.keyboard.press('End');
  await expect(count).toHaveText('? of 4');
  await next.click();
  await expect(count).toHaveText('3 of 4');
  await previous.click();
  await expect(count).toHaveText('2 of 4');
  await panel.getByRole('checkbox', {name: 'Match case'}).check();
  await expect(count).toHaveText('? of 3');
  await next.click();
  await expect(count).toHaveText('2 of 3');

  await find.fill('[x].*');
  await expect(count).toHaveText('1 of 1');
  await find.press('Enter');
  await expect(count).toHaveText('1 of 1');
  await find.fill('\\n');
  await expect(count).toHaveText('1 of 1');
  await find.fill('no such text');
  await expect(count).toHaveText('0 of 0');
  await expect(next).toBeDisabled();
  await expect(previous).toBeDisabled();
  await find.fill('');
  await expect(count).toHaveText('');
  await find.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(editor).toBeFocused();
});

test('find follows each typed letter from the current match and Escape keeps the found location', async ({page}) => {
  const text = manuscript.replace('Workshop introduction.', 'quill first.\n\nquest second.\n\nquill third.\n\nqueue fourth.')
    .replace('Field introduction.', `${'A filler line.\n\n'.repeat(40)}quartz last.`);
  await openFixture(page, text);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  const panel = page.locator('.cm-search');
  const find = panel.getByRole('textbox', {name: 'Find', exact: true});
  const count = panel.getByRole('status', {name: 'Search matches'});
  const selected = editor.locator('.cm-searchMatch-selected');
  for (const query of ['q', 'qu']) {
    await find.pressSequentially(query.at(-1)!);
    await expect(find).toHaveValue(query);
    await expect(find).toBeFocused();
    await expect(selected).toHaveText(query);
    await expect(count).toHaveText('1 of 5');
    await expect(page.locator('.cm-activeLine')).toHaveText('quill first.');
  }
  await find.pressSequentially('e');
  await expect(selected).toHaveText('que');
  await expect(count).toHaveText('1 of 2');
  await expect(page.locator('.cm-activeLine')).toHaveText('quest second.');
  await find.press('Backspace');
  await expect(selected).toHaveText('qu');
  await expect(count).toHaveText('2 of 5');
  for (const query of ['qui', 'quil', 'quill']) {
    await find.pressSequentially(query.at(-1)!);
    await expect(selected).toHaveText(query);
    await expect(count).toHaveText('2 of 2');
    await expect(page.locator('.cm-activeLine')).toHaveText('quill third.');
  }
  // Changing the query wraps forward when no later occurrence matches.
  await find.fill('quest');
  await expect(selected).toHaveText('quest');
  await expect(page.locator('.cm-activeLine')).toHaveText('quest second.');
  await find.fill('qu');
  for (const query of ['qua', 'quar', 'quart', 'quartz']) {
    await find.pressSequentially(query.at(-1)!);
    await expect(selected).toHaveText(query);
    await expect(count).toHaveText('1 of 1');
    await expect(selected).toBeInViewport();
    await expect(page.locator('.cm-activeLine')).toHaveText('quartz last.');
  }
  // A failed or empty query leaves the last found location intact.
  await find.pressSequentially('!');
  await expect(count).toHaveText('0 of 0');
  await expect(page.locator('.cm-activeLine')).toHaveText('quartz last.');
  await find.press('Backspace');
  await expect(selected).toHaveText('quartz');
  await find.fill('');
  await expect(count).toHaveText('');
  await expect(page.locator('.cm-activeLine')).toHaveText('quartz last.');
  await find.fill('quartz');
  await expect(selected).toHaveText('quartz');
  await find.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(editor).toBeFocused();
  expect(await editor.evaluate(() => window.getSelection()?.toString())).toBe('quartz');
  await expect(page.locator('.cm-activeLine')).toHaveText('quartz last.');
  await expect(page.locator('.cm-activeLine')).toBeInViewport();
  expect(await page.locator('.cm-scroller').evaluate(element => element.scrollTop)).toBeGreaterThan(0);
});

test('find totals stay current after replacements, edits and reopening from a selection', async ({page}) => {
  const text = manuscript.replace('Workshop introduction.', 'signal signal signal.');
  await openFixture(page, text);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  const panel = page.locator('.cm-search');
  const find = panel.getByRole('textbox', {name: 'Find', exact: true});
  const count = panel.getByRole('status', {name: 'Search matches'});
  await find.fill('signal');
  await expect(count).toHaveText('1 of 3');
  await panel.getByRole('textbox', {name: 'Replace', exact: true}).fill('echo');
  await panel.getByRole('button', {name: 'Replace', exact: true}).click();
  await expect(count).toHaveText('1 of 2');
  await expect.poll(() => savedText(page, text.replace('signal signal signal.', 'echo signal signal.'))).toBe(true);
  await panel.getByRole('button', {name: 'Replace all', exact: true}).click();
  await expect(count).toHaveText('0 of 0');
  await expect.poll(() => savedText(page, text.replaceAll('signal', 'echo'))).toBe(true);
  await editor.focus(); await page.keyboard.press('ControlOrMeta+z');
  await expect(count).toHaveText('1 of 2');
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.insertText('\nsignal');
  await expect(count).toHaveText('? of 3');

  // Cmd+F seeds Find from the current selection even while the panel is open.
  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('ControlOrMeta+f');
  await expect(find).toHaveValue('signal');
  await expect(count).toHaveText('3 of 3');
  await panel.getByRole('button', {name: 'Close search'}).click();
  await page.keyboard.press('ControlOrMeta+f');
  await expect(count).toHaveText('3 of 3');
});

test('three-goal quick actions select the reason, save and undo, and remove a stale wrapped acknowledgment', async ({page}) => {
  const text = manuscript.replace('- Build the kit -- `kit`', '- Build the kit -- `kit`\n- Keep the frame -- `frame`\n- Keep the tool -- `tool`');
  await serveFixture(page, text.replaceAll('\n', '\r\n'));
  await page.goto('/combinations.html?story=fixture/story.md');
  await openEditor(page);
  const group = page.locator('.editor-diagnostic-entry').filter({hasText: 'many-visible-goals'});
  await expectTextOverlay(group.locator('.editor-diagnostic-fix'));
  await group.locator('.editor-diagnostic').click();
  const bulb = page.locator('.cm-activeLine .editor-source-fix');
  await expectTextOverlay(bulb);
  await page.keyboard.press('ControlOrMeta+.');
  const choice = page.getByRole('menuitem', {name: 'Suppress warning with an explanation', exact: true});
  await expect(choice).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toBeFocused();
  expect(await savedText(page, text)).toBe(false);
  await page.keyboard.press('ControlOrMeta+.');
  await page.keyboard.press('Enter');
  const inserted = text.replace('**Goals**', '**Goals**\n- (three goals are a lot but okay here because <REASON>)');
  await expect.poll(() => savedText(page, inserted)).toBe(true);
  await expect(page.locator('.editor-diagnostic').filter({hasText: 'goal-acknowledgment-reason'})).toBeVisible();
  const reason = 'the shared tools make three independent preparations clear, while a forced sequence would hide their relationship';
  await page.keyboard.insertText(reason);
  const explained = inserted.replace('<REASON>', reason);
  await expect.poll(() => savedText(page, explained)).toBe(true);
  await expect(group).toHaveCount(0);
  await expect(page.locator('.editor-diagnostic').filter({hasText: 'goal-acknowledgment-reason'})).toHaveCount(0);
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(() => savedText(page, inserted)).toBe(true);
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(() => savedText(page, text)).toBe(true);

  await edit(page, explained.replace('- Keep the tool -- `tool`\n', ''));
  await page.setViewportSize({width: 1000, height: 800});
  const stale = page.locator('.editor-diagnostic-entry').filter({hasText: 'stale-goal-acknowledgment'});
  await stale.locator('.editor-diagnostic').click();
  await expectTextOverlay(stale.locator('.editor-diagnostic-fix'));
  await expectTextOverlay(page.locator('.cm-activeLine .editor-source-fix'));
  await page.keyboard.press('ControlOrMeta+.');
  await page.keyboard.press('Enter');
  await expect(stale).toHaveCount(0);
  await expect.poll(() => savedText(page, text.replace('- Keep the tool -- `tool`\n', ''))).toBe(true);
});

test('checkpoint quick actions open at the caret and require a keyboard menu choice', async ({page}) => {
  await openFixture(page);
  await page.getByRole('textbox', {name: 'Story Markdown'}).focus();
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('ControlOrMeta+f');
  await page.locator('.cm-search input[name="search"]').pressSequentially('## Field');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(page.locator('.cm-activeLine')).toHaveText('## Field');
  await page.keyboard.press('ControlOrMeta+.');
  const choice = page.getByRole('menuitem', {name: 'Jump to checkpoint', exact: true});
  await expect(choice).toBeFocused();
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('textbox', {name: 'Story Markdown'})).toBeFocused();
  await page.keyboard.press('ControlOrMeta+.');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog')).toContainText('Field introduction.');
});

test('successive renames keep readers live and edited play retains its reset baseline', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const chain = `# Editing a construction

## Workshop

![workshop](assets/bg.svg)

Build a two-stage construction.

**Goals**
- Finish the chain -- E

**Items**
- Frame

  First explanation.

- Tool
- C
- D
- E

**Combinations**
- Frame [preserve] + Tool [preserve] -> C
- C [preserve] + Tool [preserve] -> D
- D [preserve] + Tool [preserve] -> E
`;
  await serveFixture(page, chain);
  await page.goto('/combinations.html?story=fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await openEditor(page);
  await page.locator('[data-item="name:Frame"]').dblclick();
  await expect(page.locator('dialog')).toContainText('First explanation.');
  const renamed = chain.replaceAll('Frame', 'First rename').replace('First explanation.', 'Second explanation.');
  await edit(page, renamed);
  await expect(page.locator('dialog')).toContainText('Second explanation.');
  const renamedAgain = renamed.replaceAll('First rename', 'Second rename').replace('Second explanation.', 'Third explanation.');
  await edit(page, renamedAgain);
  await expect(page.locator('dialog')).toContainText('Third explanation.');
  await expect(page.locator('[data-item="name:Second rename"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close', exact: true }).click();

  const combine = async (a: string, b: string) => page.locator(`[data-item="name:${a}"]`).dragTo(page.locator(`[data-item="name:${b}"]`));
  await combine('Second rename', 'Tool');
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(1);
  await edit(page, renamedAgain.replace('Finish the chain', 'Complete the chain'));
  await expect(page.locator('.objective-line')).toContainText('Complete the chain');
  await combine('C', 'Tool');
  await expect(page.locator('[data-item="name:D"]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-item="name:D"]')).toHaveCount(1);

  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart this chapter' }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('Complete the chain');
  await combine('Second rename', 'Tool');
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(1);
  await jumpToChapter(page, 'Workshop');
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(0);
  await expect(page.locator('[data-item="name:Second rename"]')).toHaveCount(1);

  // Incomplete experiments may exceed the engine's explicit analysis bound.
  // The preview must remain usable rather than throw from hover/drag handlers.
  const limit = ['# Analysis limit', '## Workshop', '**Goals**'];
  for (let i = 0; i < 14; i++) limit.push(`- Finish ${i} -- Done ${i}`);
  limit.push('**Combinations**');
  for (let i = 0; i < 14; i++) limit.push(
    `- Seed ${i} [preserve] + Left tool ${i} [preserve] -> A ${i} (exclusive with B ${i})`,
    `- Seed ${i} [preserve] + Right tool ${i} [preserve] -> B ${i} (exclusive with A ${i})`,
    `- A ${i} [preserve] + Join tool ${i} [preserve] -> Done ${i}`,
    `- B ${i} [preserve] + Join tool ${i} [preserve] -> Done ${i}`,
  );
  await edit(page, limit.join('\n'));
  await page.locator('[data-item="name:Seed 0"]').hover();
  await expect(page.locator('.editor-preview-status')).toContainText('exact branch-analysis limit');
  expect(errors).toEqual([]);
});
