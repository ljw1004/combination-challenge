import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

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

async function openFixture(page: Page) {
  await serveFixture(page);
  await page.goto('/combinations.html?story=fixture');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await openEditor(page);
}

async function openEditor(page: Page) {
  await page.getByRole('button', { name: 'Open debugging tools' }).click();
  await page.getByRole('button', { name: 'Editor', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toBeVisible();
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
  await edit(page, explained.replace('Polished frame', 'Live despite error') + '\n**Goals**\n- Missing condition\n');
  await expect(card.locator('.item-label')).toHaveText('Live despite error');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.locator('.editor-diagnostic[data-severity="error"]')).not.toHaveCount(0);
  await edit(page, explained);
  await expect(card.locator('.item-label')).toHaveText('Polished frame');

  await page.getByRole('button', { name: 'Open debugging tools' }).click();
  await page.locator('#chapter').selectOption('1');
  await page.getByRole('button', { name: 'Generate checkpoint' }).click();
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
  await card.dragTo(page.locator('.chapter-panel').first(), { targetPosition: { x: 260, y: 520 } });
  await edit(page, explained);
  await expect(page.locator('.chapter-panel[data-chapter="1"]')).toHaveCount(0);
});

test('drafts save before preview, reopen on desktop, and only explicit deletion removes them', async ({ page }) => {
  await openFixture(page);
  const changed = manuscript.replace('Workshop introduction.', 'A durable draft introduction.');
  await edit(page, changed);
  expect(await savedText(page, changed)).toBe(true);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('A durable draft introduction.');

  await page.getByRole('button', { name: 'Close editor' }).click();
  await expect(page.locator('.story-editor')).toBeHidden();
  expect(await savedText(page, changed)).toBe(true);
  await page.getByRole('button', { name: 'Open debugging tools' }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
  await page.getByRole('button', { name: 'Restart story', exact: true }).click();
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
  await expect(page.locator('.editor-save-status')).toHaveAttribute('data-state', 'saved');
  const otherTab = await page.context().newPage();
  await serveFixture(otherTab);
  await otherTab.goto('/combinations.html?story=fixture');
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
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('combination-draft-v1:')))).toEqual([]);
});

test('same-directory loading, missing-story errors and failed storage keep the editing boundary clear', async ({ page }) => {
  await serveFixture(page);
  await page.route('**/fixture/combinations.html', async route => {
    const response = await route.fetch({url: new URL('/combinations.html', route.request().url()).href});
    await route.fulfill({response});
  });
  await page.goto('/fixture/combinations.html');
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
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const downloaded = await download;
  const stream = await downloaded.createReadStream();
  let recovered = '';
  for await (const chunk of stream!) recovered += chunk.toString();
  expect(recovered).toBe(unsaved);

  page.on('dialog', dialog => dialog.accept());
  await page.route('**/missing/story.md', route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Missing' }));
  await page.goto('/combinations.html?story=missing');
  await expect(page.getByText(/Could not load the story.*HTTP 404/)).toBeVisible();
  await expect(page.locator('.chapter-panel')).toHaveCount(0);
});

test('diagnostics keep source order and scroll while their related locations navigate and track edits', async ({ page }) => {
  const text = manuscript.replace('- Build the kit -- `kit`', '- Build the kit -- `kit`\n- Keep the frame -- `frame`\n- Keep the tool -- `tool`')
    + '\n- `frame` [consume] + `probe` [preserve] -> Scrap\n- `frame` [transform] + `tool` [preserve] -> Shaped frame\n'
    + '\n**Goals**\n' + Array.from({length: 12}, (_, i) => `- Incomplete goal ${i}\n`).join('');
  await serveFixture(page, text.replaceAll('\n', '\r\n'));
  await page.goto('/combinations.html?story=fixture');
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
  const group = mixed.locator('..');
  await group.locator('summary').click();
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
  await expect(group.locator('details')).toHaveAttribute('open', '');
  await transform.click();
  await expect(page.locator('.cm-activeLine')).toContainText('`frame` [transform]');

  // Hover details expose the same links as the diagnostics panel.
  await mixed.click();
  await page.locator('.cm-activeLine .cm-lintRange-warning').first().hover();
  const tooltip = page.locator('.cm-tooltip-lint');
  await expect(tooltip).toContainText('consume (explicit)');
  await tooltip.locator('.editor-related-location').filter({hasText: 'consume (explicit)'}).click();
  await expect(page.locator('.cm-activeLine')).toContainText('`frame` [consume]');
});

test('successive renames keep readers live and edited play retains its undo and reset baselines', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const chain = `# Editing a construction

## Workshop

![workshop](assets/bg.svg)

Build a two-stage construction.

**Goals**
- Finish the chain -- D

**Items**
- Frame

  First explanation.

- Tool
- C
- D

**Combinations**
- Frame [preserve] + Tool [preserve] -> C
- C [preserve] + Tool [preserve] -> D
`;
  await serveFixture(page, chain);
  await page.goto('/combinations.html?story=fixture');
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
  const undo = async () => {
    await page.getByRole('button', { name: 'Open debugging tools' }).click();
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
  };
  await combine('Second rename', 'Tool');
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(1);
  await edit(page, renamedAgain.replace('Finish the chain', 'Complete the chain'));
  await expect(page.locator('.objective-line')).toContainText('Complete the chain');
  await combine('C', 'Tool');
  await expect(page.locator('[data-item="name:D"]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-item="name:D"]')).toHaveCount(1);
  await undo();
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(1);
  await expect(page.locator('[data-item="name:D"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Read this chapter' }).click();
  await page.getByRole('button', { name: 'Restart this chapter' }).click();
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Story Markdown' })).toContainText('Complete the chain');
  await combine('Second rename', 'Tool');
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(1);
  await undo();
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
