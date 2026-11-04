import { test, expect, type Locator, type Page } from '@playwright/test';

const manuscript = `# Input fixture
## Workshop
A **workshop** introduction.

![Reading illustration](illustration.svg)

**Goals**
- Finish -- Final
**Items**
- Grain

  A grain explanation.

- Stone

  A stone explanation.

- Flour

  A **flour** explanation.

- Tool

  A tool explanation.

- Final
**Combinations**
- Grain [transform] + Stone [consume] -> Flour
- Flour [preserve] + Tool [preserve] -> Final
`;

async function openFixture(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/input-fixture/story.md', route => route.fulfill({ contentType: 'text/markdown', body: manuscript }));
  await page.route('**/input-fixture/illustration.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="30"><rect width="80" height="30" fill="#765"/></svg>' }));
  await page.goto('/combinations.html?story=input-fixture/story.md');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
}

async function selectedByDoubleClick(page: Page, target: Locator) {
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await target.dblclick();
  return page.evaluate(() => getSelection()?.toString().trim());
}

test('only chapter and wonder prose can be selected in all four reading views', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 844 });
  await openFixture(page);
  const prose = page.locator('.reading-text');
  expect(await selectedByDoubleClick(page, prose.locator('strong'))).toBe('workshop');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  expect(await selectedByDoubleClick(page, page.locator('.viewport'))).toBe('');
  await page.getByRole('button', { name: 'Read this chapter' }).click();
  expect(await selectedByDoubleClick(page, prose.locator('strong'))).toBe('workshop');
  // Selection can extend beyond the prose without selecting the popup controls.
  await page.evaluate(() => getSelection()?.removeAllRanges());
  const word = (await prose.locator('strong').boundingBox())!;
  await page.mouse.move(word.x + 1, word.y + word.height / 2);
  await page.mouse.down();
  await page.mouse.move(980, 830, { steps: 5 });
  await page.mouse.up();
  const selected = await page.evaluate(() => getSelection()?.toString());
  expect(selected).toContain('workshop');
  expect(selected).not.toMatch(/Restart|Encyclopedia/);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-item="name:Grain"]').dragTo(page.locator('[data-item="name:Stone"]'));
  await expect(page.locator('dialog.wonder')).toBeVisible();
  expect(await selectedByDoubleClick(page, prose.locator('strong'))).toBe('flour');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('[data-item="name:Flour"]').dblclick();
  await expect(page.locator('dialog.encyclopedia')).toBeVisible();
  expect(await selectedByDoubleClick(page, page.locator('.encyclopedia-index h1'))).toBe('');
  expect(await selectedByDoubleClick(page, page.locator('.encyclopedia-detail strong'))).toBe('flour');
});

test('Safari gesture guards preserve reading selection and single touches, including the mobile picker', async ({ page }) => {
  await openFixture(page);
  async function defaults(target: Locator) {
    return target.evaluate(element => {
      const allowed = (event: Event) => element.dispatchEvent(event);
      const options = { bubbles: true, cancelable: true };
      const touch = (type: string, count: number) => {
        // Exercise the handlers in both Chromium and WebKit, without claiming
        // that synthetic events reproduce Safari's native zoom or magnifier UI.
        const event = new Event(type, options);
        Object.defineProperty(event, 'touches', { value: Array(count).fill({}) });
        return allowed(event);
      };
      return {
        selection: allowed(new Event('selectstart', options)),
        callout: allowed(new Event('contextmenu', options)),
        drag: allowed(new Event('dragstart', options)),
        gestures: ['gesturestart', 'gesturechange', 'gestureend'].map(type => allowed(new Event(type, options))),
        single: [touch('touchstart', 1), touch('touchmove', 1)],
        pinch: [touch('touchstart', 2), touch('touchmove', 2)],
      };
    });
  }
  const blocked = { selection: false, callout: false, drag: false, gestures: [false, false, false], single: [true, true], pinch: [false, false] };
  expect(await defaults(page.locator('.game-dialog-layer'))).toEqual(blocked);
  expect(await defaults(page.locator('.reading-text strong'))).toEqual({ ...blocked, selection: true, callout: true });
  expect(await defaults(page.locator('.reading-text img'))).toEqual(blocked);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.locator('.debug-toggle').click();
  expect(await defaults(page.locator('.mobile-debug h2'))).toEqual(blocked);
});

test('touch double-taps and pinches keep the viewport scale while item double-taps still open readings', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'Real touch injection uses Chromium CDP; WebKit runs selection and event-guard checks.');
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await openFixture(page);
    const cdp = await context.newCDPSession(page);
    async function tap(x: number, y: number) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    async function tryZoom() {
      await tap(195, 400); await tap(195, 400);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 155, y: 400 }, { x: 235, y: 400 }] });
      for (let distance = 50; distance <= 120; distance += 10) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195 - distance, y: 400 }, { x: 195 + distance, y: 400 }] });
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(() => page.evaluate(() => visualViewport!.scale)).toBe(1);
    }
    await tryZoom();
    await page.getByRole('button', { name: 'Begin', exact: true }).tap();
    await tryZoom();
    const grain = (await page.locator('[data-item="name:Grain"]').boundingBox())!;
    await tap(grain.x + 10, grain.y + 10); await tap(grain.x + 10, grain.y + 10);
    await expect(page.locator('.encyclopedia-detail .reading-text')).toHaveText('A grain explanation.');
    await tryZoom();
  } finally {
    await context.close();
  }
});
