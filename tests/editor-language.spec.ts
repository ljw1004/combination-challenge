import {test, expect} from '@playwright/test';
import type {Locator, Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

test.use({viewport: {width: 1280, height: 900}, reducedMotion: 'reduce'});

const manuscript = '# Language fixture\n\n## Workshop\n\nFrame in prose is not a reference.\n\n**Goals**\n- Build -- Kit\n\n**Items**\n- Frame\n\n  A sturdy frame.\n\n- Tool\n\n**Combinations**\n- Frame [preserve] + Tool [preserve] -> Kit\n- Kit [preserve] + Tool [preserve] -> Final\n';

async function open(page: Page, text = manuscript) {
  await page.route('**/language/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.goto('/combinations.html?story=language/story.md');
  await openDebugPanel(page);
}

async function point(line: Locator, text: string) {
  return line.evaluate((line, text) => {
    const from = line.textContent!.indexOf(text), to = from + text.length;
    if (from < 0) throw new Error(`Missing ${text}`);
    const range = document.createRange(), walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    let offset = 0, start = false;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const end = offset + node.textContent!.length;
      if (!start && from < end) { range.setStart(node, from - offset); start = true; }
      if (to <= end) { range.setEnd(node, to - offset); break; }
      offset = end;
    }
    const rect = range.getBoundingClientRect();
    return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
  }, text);
}

async function cmdClick(page: Page, line: Locator, text: string) {
  const position = await point(line, text);
  await page.mouse.move(position.x, position.y);
  await page.keyboard.down('ControlOrMeta');
  await page.mouse.click(position.x, position.y);
  await page.keyboard.up('ControlOrMeta');
}

test('hover describes parsed symbols and modifier navigation goes to declarations or references', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page);
  const recipe = page.locator('.cm-line').filter({hasText: /^- Frame \[preserve\] \+ Tool/});
  const position = await point(recipe, 'Frame');
  await page.mouse.move(position.x, position.y);
  const hover = page.getByRole('region', {name: 'Frame information'});
  await expect(hover).toBeVisible();
  await expect(hover).toContainText('A sturdy frame.');
  await expect(hover).toContainText('Used as a reagent');
  await expect(hover).toContainText('Frame [preserve] + Tool [preserve] → Kit');
  await page.keyboard.down('ControlOrMeta');
  await expect(page.locator('.cm-symbol-link')).toHaveText('Frame');
  await page.keyboard.up('ControlOrMeta');
  await expect(page.locator('.cm-symbol-link')).toHaveCount(0);
  await cmdClick(page, recipe, 'Frame');
  await expect(page.locator('.cm-activeLine')).toHaveText('- Frame');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('Frame');
  await cmdClick(page, page.locator('.cm-activeLine'), 'Frame');
  const references = page.getByRole('region', {name: 'References', exact: true});
  await expect(references).toBeVisible();
  await expect(references.getByRole('heading')).toHaveText('Frame · 2 references');
  await references.getByRole('button').filter({hasText: 'reagent'}).click();
  await expect(page.locator('.cm-activeLine')).toContainText('Frame [preserve] + Tool');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('Frame');
  await references.getByRole('button', {name: 'Close references'}).click();
  await cmdClick(page, recipe, 'Kit');
  await expect(references.getByRole('heading')).toHaveText('Kit · 3 references');
  await references.getByRole('button').filter({hasText: 'goal'}).click();
  await expect(page.locator('.cm-activeLine')).toHaveText('- Build -- Kit');
  await references.getByRole('button', {name: 'Close references'}).click();
  const prose = page.locator('.cm-line').filter({hasText: /^Frame in prose/});
  await cmdClick(page, prose, 'Frame');
  await expect(references).toHaveCount(0);
  await expect(page.locator('.cm-symbol-link')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('reference lists refresh source positions after edits and remain separate from Find', async ({page}) => {
  await open(page);
  await cmdClick(page, page.locator('.cm-line').filter({hasText: /^- Frame$/}), 'Frame');
  const references = page.getByRole('region', {name: 'References', exact: true});
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.insertText('\n\n');
  await expect(references.locator('.editor-reference-location').first()).toContainText('13:3');
  await references.getByRole('button').filter({hasText: 'declaration'}).click();
  await expect(page.locator('.cm-activeLine')).toHaveText('- Frame');
  await page.keyboard.press('ControlOrMeta+f');
  await expect(page.getByRole('textbox', {name: 'Find', exact: true})).toBeVisible();
  await expect(references).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(references).toBeVisible();
  await editor.focus(); await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.insertText('\n- Frame + Tool -> Extra\n');
  await expect(references.getByRole('heading')).toHaveText('Frame · 3 references');
  await references.getByRole('button').filter({hasText: 'Extra'}).click();
  await expect(page.locator('.cm-activeLine')).toHaveText('- Frame + Tool -> Extra');
  await page.keyboard.press('F12');
  await expect(page.locator('.cm-activeLine')).toHaveText('- Frame');
  await page.keyboard.press('Shift+F12');
  await expect(references.getByRole('heading')).toHaveText('Frame · 3 references');
  await page.keyboard.press('Escape');
  await expect(references).toHaveCount(0);
  await expect(editor).toBeFocused();
});

test('undeclared references and unused declarations update live without blocking draft saves', async ({page}) => {
  const source = '# Names\n## Workshop\n![room](assets/room.svg)\n**Goals**\n- Repair -- Radio\n**Items**\n- Wire\n- Battery\n- Radio\n- Relic\n**Combinations**\n- Wire [preserve] + Battery [preserve] -> Radio (tutorial)\n';
  await page.route('**/language/assets/room.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"/>'}));
  await open(page, source);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  const errors = page.locator('.editor-diagnostic[data-severity="error"]');
  const unused = page.locator('.editor-diagnostic').filter({hasText: '[unused-declaration] Relic'});
  await expect(unused).toBeVisible();
  await expect(errors).toHaveCount(0);
  const typo = source.replace('Repair -- Radio', 'Repair -- Raido');
  await editor.focus(); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.insertText(typo);
  await expect.poll(() => page.evaluate(text => Object.entries(localStorage).some(([key, value]) => key.startsWith('combination-draft-v1:') && JSON.parse(value).text === text), typo)).toBe(true);
  await expect(errors).toHaveCount(1);
  await expect(errors).toContainText('[undeclared-item] Raido');
  await errors.click();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('Raido');
  await expect(page.locator('.cm-lintRange-error')).toHaveText('Raido');
  await page.keyboard.press('ControlOrMeta+End'); await page.keyboard.insertText('\n- Raido\n');
  await expect(errors).toHaveCount(0);
  await expect(unused).toBeVisible();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(errors).toHaveCount(1);
  await errors.click(); await page.keyboard.insertText('Radio');
  await expect(errors).toHaveCount(0);
  await page.reload();
  await expect(editor).toContainText('Repair -- Radio');
  await expect(unused).toBeVisible();
  await expect(errors).toHaveCount(0);
});

test('reference colors and subdued notes follow the grammar through live edits', async ({page}) => {
  await open(page, manuscript + '\n> NOTE: **Frame** is only prose here.\n> This note continues.\n\n> An ordinary quotation.\n');
  const declaration = page.locator('.cm-line').filter({hasText: /^- Frame$/});
  await expect(declaration.locator('.cm-story-reference')).toHaveCSS('color', 'rgb(4, 81, 165)');
  await expect(page.locator('.cm-line').filter({hasText: /^Frame in prose/}).locator('.cm-story-reference')).toHaveCount(0);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+End');
  const note = page.locator('.cm-story-note').filter({hasText: 'NOTE:'});
  await expect(note).toHaveCSS('color', 'rgb(116, 116, 109)');
  await expect(note).toHaveCSS('font-style', 'italic');
  await expect(note.locator('span').filter({hasText: /^Frame$/})).toHaveCSS('color', 'rgb(116, 116, 109)');
  await expect(page.locator('.cm-story-note').filter({hasText: 'This note continues.'})).toBeVisible();
  await expect(page.locator('.cm-line').filter({hasText: '> An ordinary quotation.'}).locator('.cm-story-note')).toHaveCount(0);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText('# Revised\n## Room\n**Items**\n- `tool` Tool\n  - + Frame -> Kit\n');
  await expect(page.locator('.cm-story-note')).toHaveCount(0);
  const item = page.locator('.cm-line').filter({hasText: /^- `tool` Tool$/});
  await expect(item.locator('.cm-story-reference')).toHaveText('`tool` Tool');
  await expect(item.locator('.cm-story-reference')).toHaveCSS('color', 'rgb(4, 81, 165)');
  await expect(page.locator('.cm-line').filter({hasText: /^  - \+ Frame/}).locator('.cm-story-reference')).toHaveText(['Frame', 'Kit']);
});

test('image hover resolves story-relative artwork and handles unavailable previews', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/language/assets/diagram.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#97bad4"/></svg>'}));
  await page.route('**/language/assets/missing.svg', route => route.fulfill({status: 404, body: ''}));
  await open(page, manuscript.replace('Frame in prose is not a reference.', 'An illustration ![Diagram](assets/diagram.svg).\n\nA missing image ![Missing](assets/missing.svg).'));
  const line = page.locator('.cm-line').filter({hasText: /^An illustration/});
  const position = await point(line, 'assets/diagram.svg');
  await page.mouse.move(position.x, position.y);
  const preview = page.getByRole('region', {name: 'Image preview'});
  const image = preview.getByRole('img', {name: 'Diagram'});
  await expect(image).toHaveAttribute('src', /\/language\/assets\/diagram\.svg$/);
  await expect(preview.getByRole('status')).toHaveText('1200 × 800');
  const rect = (await image.boundingBox())!;
  expect(rect.width).toBeLessThanOrEqual(420); expect(rect.height).toBeLessThanOrEqual(300);
  await page.keyboard.down('ControlOrMeta');
  await expect(page.locator('.cm-symbol-link')).toHaveCount(0);
  await page.keyboard.up('ControlOrMeta');
  await page.mouse.move(50, 50);
  await expect(preview).toHaveCount(0);
  const missing = await point(page.locator('.cm-line').filter({hasText: /^A missing image/}), 'assets/missing.svg');
  await page.mouse.move(missing.x, missing.y);
  await expect(preview.getByRole('status')).toHaveText('Image preview unavailable.');
  await expect(preview.locator('img')).toHaveCount(0);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText('# Story\n## Room\n![Bad](javascript:alert)\n');
  const bad = await point(page.locator('.cm-line').filter({hasText: /^!\[Bad\]/}), 'javascript:alert');
  await page.mouse.move(bad.x, bad.y);
  await expect(preview.getByRole('status')).toHaveText('Image preview unavailable.');
  await expect(preview.locator('img')).toHaveCount(0);
  expect(errors).toEqual([]);
});
