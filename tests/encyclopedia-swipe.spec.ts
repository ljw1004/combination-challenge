import { test, expect, type Page, type CDPSession } from '@playwright/test';

const entries = Array.from({ length: 30 }, (_, i) => `- Entry ${i}\n\n  ${i === 15
  ? Array.from({ length: 25 }, () => 'A paragraph about **making** things with a [source](https://example.com/reading).').join('\n\n  ')
  : `Description ${i}.`}`).join('\n\n');
const manuscript = `# Swipe fixture
## Workshop
A workshop.
**Goals**
- Finish -- Result
**Items**
${entries}
- Result
**Combinations**
- Entry 0 + Entry 1 -> Result
`;

async function openBook(page: Page) {
  await page.route('**/swipe-fixture.md', route => route.fulfill({ contentType: 'text/markdown', body: manuscript }));
  await page.goto('/make-something.html?story=swipe-fixture.md');
  await page.getByRole('button', { name: 'Start', exact: true }).tap();
  await page.getByRole('button', { name: 'Begin', exact: true }).tap();
  await page.locator('[data-item="name:Entry 15"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
  await settled(page);
}

async function settled(page: Page) {
  await expect.poll(() => page.locator('.encyclopedia-track').evaluate(el => el.getAnimations().length)).toBe(0);
}

function touch(cdp: CDPSession) {
  return {
    start: (x: number, y: number) => cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }),
    move: (x: number, y: number) => cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }),
    end: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
    cancel: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }),
    async swipe(x: number, y: number, dx: number, dy = 0) {
      await this.start(x, y);
      for (let step = 1; step <= 6; step++) {
        await this.move(x + dx * step / 6, y + dy * step / 6);
        await new Promise(resolve => setTimeout(resolve, 16));
      }
      await this.end();
    },
  };
}

test.describe('encyclopedia touch swipes', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test.beforeEach(async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Touch injection uses Chromium CDP.');
  });

  test('pages follow the finger in both directions, retaining selection, scroll and accessible navigation', async ({ page, context }) => {
    await openBook(page);
    const finger = touch(await context.newCDPSession(page));
    const track = page.locator('.encyclopedia-track'), index = page.locator('.encyclopedia-list');
    const reading = page.locator('.encyclopedia-reading');
    await reading.evaluate(el => { el.scrollTop = 200; });
    const indexScroll = await index.evaluate(el => el.scrollTop);
    const start = (await track.boundingBox())!.x;
    await finger.start(100, 400); await finger.move(200, 400);
    expect((await track.boundingBox())!.x).toBeCloseTo(start + 100, 0);
    await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
    await finger.end(); await settled(page);
    await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
    await expect(page.locator('.encyclopedia-detail')).toHaveAttribute('inert', '');
    await expect(page.getByRole('link', { name: 'Entry 15', exact: true })).toBeFocused();
    expect(await index.evaluate(el => el.scrollTop)).toBe(indexScroll);

    // Start on a different index link: dragging it must not select or activate it.
    const other = page.getByRole('link', { name: 'Entry 16', exact: true });
    const box = (await other.boundingBox())!;
    await finger.start(box.x + 160, box.y + box.height / 2);
    await finger.move(box.x + 40, box.y + box.height / 2);
    expect((await track.boundingBox())!.x).toBeLessThan(0);
    await finger.end(); await settled(page);
    await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
    await expect(index.locator('[aria-current]')).toHaveText('Entry 15');
    expect(await reading.evaluate(el => el.scrollTop)).toBe(200);
    await expect(page.locator('.encyclopedia-index')).toHaveAttribute('inert', '');
    await expect(page.getByRole('button', { name: 'Index', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
    await page.getByRole('link', { name: 'Entry 16', exact: true }).tap();
    await expect(reading).toHaveText('Description 16.');
    await page.getByRole('button', { name: 'Close', exact: true }).tap();
    await expect(page.locator('dialog')).toHaveCount(0);
  });

  test('short, reversed and outward swipes settle back; vertical and diagonal touches scroll both pages', async ({ page, context }) => {
    await openBook(page);
    const finger = touch(await context.newCDPSession(page));
    const track = page.locator('.encyclopedia-track'), pages = page.locator('.encyclopedia-pages');
    const start = (await track.boundingBox())!.x;
    await finger.swipe(150, 400, 25); await settled(page);
    expect((await track.boundingBox())!.x).toBeCloseTo(start, 0);
    await finger.start(100, 400); await finger.move(250, 400); await finger.move(110, 400); await finger.end();
    await settled(page);
    expect((await track.boundingBox())!.x).toBeCloseTo(start, 0);
    await finger.swipe(200, 400, -100); await settled(page);
    expect((await track.boundingBox())!.x).toBeCloseTo(start, 0);
    await finger.swipe(150, 600, 30, -220);
    await expect.poll(() => page.locator('.encyclopedia-reading').evaluate(el => el.scrollTop)).toBeGreaterThan(100);
    await expect(pages).toHaveClass(/show-detail/);
    await page.getByRole('button', { name: 'Index', exact: true }).tap(); await settled(page);
    const list = page.locator('.encyclopedia-list');
    await list.evaluate(el => { el.scrollTop = 0; });
    await finger.swipe(150, 600, 0, -200);
    await expect.poll(() => list.evaluate(el => el.scrollTop)).toBeGreaterThan(100);
    await expect(pages).not.toHaveClass(/show-detail/);
  });

  test('selection and long presses retain the reading; ordinary source taps still work', async ({ page, context }) => {
    await openBook(page);
    const finger = touch(await context.newCDPSession(page));
    await page.locator('.reading-text strong').first().evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    });
    await finger.swipe(100, 400, 160);
    await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
    await page.evaluate(() => getSelection()?.removeAllRanges());
    await finger.start(100, 400); await page.waitForTimeout(450); await finger.move(270, 400); await finger.end();
    await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
    await page.evaluate(() => getSelection()?.removeAllRanges());
    // Observe activation without leaving the fixture or requesting the external URL.
    await page.evaluate(() => {
      document.querySelector('.encyclopedia-reading')!.addEventListener('click', event => {
        if ((event.target as Element).closest('a')) {
          event.preventDefault(); document.body.dataset.sourceTapped = 'true';
        }
      });
    });
    await page.getByRole('link', { name: 'source', exact: true }).first().tap();
    await expect(page.locator('body')).toHaveAttribute('data-source-tapped', 'true');
  });

  test('interrupted swipes never navigate and the next gesture still works', async ({ page, context }) => {
    await openBook(page);
    const cdp = await context.newCDPSession(page), finger = touch(cdp);
    for (const interruption of ['cancel', 'capture', 'blur', 'resize', 'multitouch']) {
      await finger.start(100, 400); await finger.move(200, 400); await finger.move(240, 400);
      if (interruption === 'cancel') await finger.cancel();
      else {
        if (interruption === 'capture') {
          await page.evaluate(() => {
            const root = document.querySelector<HTMLElement>('.game-dialog-layer')!;
            root.addEventListener('pointermove', event => root.releasePointerCapture(event.pointerId), { once: true });
          });
          await finger.move(250, 400); await finger.move(260, 400);
        }
        if (interruption === 'blur') await page.evaluate(() => window.dispatchEvent(new Event('blur')));
        if (interruption === 'resize') await page.setViewportSize({ width: 380, height: 830 });
        if (interruption === 'multitouch') await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 240, y: 400 }, { x: 180, y: 500 }] });
        await finger.end();
      }
      await settled(page);
      await expect(page.locator('.encyclopedia-pages')).toHaveClass(/show-detail/);
      expect(await page.locator('.encyclopedia-track').getAttribute('style')).toBeFalsy();
    }
    await finger.swipe(100, 400, 160); await settled(page);
    await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
  });

  test('reduced motion switches only on release, and the wide spread does not swipe', async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openBook(page);
    const finger = touch(await context.newCDPSession(page)), track = page.locator('.encyclopedia-track');
    const start = (await track.boundingBox())!.x;
    await finger.start(100, 400); await finger.move(260, 400);
    expect((await track.boundingBox())!.x).toBe(start);
    await finger.end();
    await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
    await expect(track).toHaveCSS('transition-duration', '0s');
    await page.setViewportSize({ width: 1000, height: 844 });
    await expect(page.locator('.encyclopedia-detail')).toHaveAttribute('aria-hidden', 'false');
    await finger.swipe(250, 400, -160);
    await expect(track).toHaveCSS('transform', 'none');
    await expect(page.locator('.encyclopedia-pages')).not.toHaveClass(/show-detail/);
  });
});
