import {test, expect, type Page} from '@playwright/test';
import {jumpToChapter} from './debug-helpers.ts';

const story = `# Tutorial fixture
## First
![room](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='390' height='844'%3E%3Crect width='390' height='844' fill='%23eee2cb'/%3E%3C/svg%3E)
Try making things.
**Goals**
- Make C -- C
- Make E -- E
**Items**
- A
- B
- D
- C

  The first discovery.

- E

  Another discovery.

**Combinations**
- A [preserve] + B [preserve] -> C (tutorial)
- A [preserve] + D [preserve] -> E
## Second
Keep exploring.
**Goals**
- Make F -- F
**Combinations**
- C [preserve] + G [preserve] -> F
`;

async function open(page: Page, text = story) {
  await page.route('**/tutorial-*/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.goto('/combinations.html?story=tutorial-one/story.md');
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
}
const tile = (page: Page, name: string) => page.locator(`[data-item="name:${name}"]`);
const cue = (page: Page, kind: string) => page.locator(`.tutorial-overlay[data-tutorial="${kind}"]`);
async function combine(page: Page, a: string, b: string) {
  const source = (await tile(page, a).boundingBox())!, target = (await tile(page, b).boundingBox())!;
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2); await page.mouse.down();
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, {steps: 5}); await page.mouse.up();
}

const alignmentCases = [
  {name: 'text card', item: 'Broken radio', declaration: '- Broken radio'},
  {name: 'wrapped compound', item: 'A particularly tall radio cabinet', declaration: '- A particularly tall radio cabinet (compound)\n  - unnamed slot: accepts Panel\n  - unnamed slot: accepts Shelf'},
  {name: 'fractional-size icon', item: 'Radio icon', declaration: `- Radio icon\n  - icon: ![radio](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='173' height='119'%3E%3Crect width='173' height='119' fill='%23765'/%3E%3C/svg%3E)`},
];
for (const {name, item, declaration} of alignmentCases) test(`tutorial copy starts exactly over its ${name}, including after resizing`, async ({page}) => {
  // Control animation frames from startup, including those scheduled before the cue appears.
  await page.clock.install({time: new Date('2026-10-31T12:00:00Z')});
  await open(page, story.replace(/\bA\b/g, item).replace(`- ${item}\n`, `${declaration}\n`));
  await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 1000));
  for (const width of [390, 320, 390]) {
    await page.setViewportSize({width, height: 844});
    await page.clock.runFor(32);
    // Resize events can arrive between frames. Observe the actual pickup pause instead
    // of assuming a fixed delay is still before travel begins.
    let pairs: {element: string; source: number[]; copy?: number[]}[] | undefined;
    for (let elapsed = 0; elapsed < 3600 && !pairs; elapsed += 100) {
      await page.clock.runFor(100);
      pairs = await tile(page, item).evaluate(source => {
        const gesture = document.querySelector<HTMLElement>('.tutorial-gesture')!;
        const start = source.getBoundingClientRect(), pointer = gesture.getBoundingClientRect();
        if (Number(gesture.style.opacity) < .1 || Math.abs(pointer.x - start.x - start.width / 2) > .1 || Math.abs(pointer.y - start.y - start.height / 2) > .1) return;
        const copy = document.querySelector('.tutorial-copy')!;
        const selector = '.item-label:not(.icon-name),.slot,.icon-stack,.icon-stack img';
        const originals = [source, ...source.querySelectorAll(selector)], copies = [copy, ...copy.querySelectorAll(selector)];
        return originals.map((original, index) => {
          const a = original.getBoundingClientRect(), b = copies[index]?.getBoundingClientRect();
          return {element: original.className, source: [a.x, a.y, a.width, a.height], copy: b && [b.x, b.y, b.width, b.height]};
        });
      });
    }
    await expect(page.locator('.tutorial-ghost')).toBeVisible();
    expect(pairs, `${name}: pickup pause at ${width}px`).toBeDefined();
    for (const pair of pairs!) {
      expect(pair.copy, `${name}: ${pair.element} at ${width}px`).toBeDefined();
      pair.source.forEach((value, index) => expect(Math.abs(pair.copy![index] - value), `${name}: ${pair.element}, dimension ${index} at ${width}px`).toBeLessThan(.1));
    }
  }
});

test('drag demonstration follows both operands and yields to any real drag, cancellation and resize', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page); await expect(cue(page, 'drag')).toBeVisible();
  await expect(cue(page, 'drag')).toHaveAttribute('data-modality', 'mouse');
  expect(await page.locator('.tutorial-overlay [data-item],.tutorial-overlay button').count()).toBe(0);
  for (const item of ['A', 'B', 'D']) {
    const before = await page.locator('.tutorial-path').getAttribute('d'), box = (await tile(page, item).boundingBox())!;
    await page.mouse.move(box.x + 15, box.y + 15); await page.mouse.down();
    await expect(page.locator('.tutorial-ghost')).toBeHidden();
    await page.mouse.move(box.x + 15, box.y + 120, {steps: 4});
    await expect(page.locator('.tutorial-path')).toBeHidden();
    await expect(page.locator('.tutorial-arrow')).toBeHidden();
    await expect(page.locator('.tutorial-target')).toBeHidden();
    if (item !== 'D') await expect(page.locator('.tutorial-path')).not.toHaveAttribute('d', before!);
    await page.mouse.up(); await expect(cue(page, 'drag')).toBeVisible();
    await expect(page.locator('.tutorial-ghost')).toBeVisible();
    await expect(page.locator('.tutorial-path')).toBeVisible();
  }
  const box = (await tile(page, 'A').boundingBox())!;
  await page.mouse.move(box.x + 15, box.y + 15); await page.mouse.down();
  await page.mouse.move(box.x + 15, box.y + 55);
  await page.evaluate(() => window.dispatchEvent(new Event('blur'))); await page.mouse.up();
  await expect(page.locator('.tutorial-ghost')).toBeVisible();
  expect((await tile(page, 'A').boundingBox())!.y).toBeCloseTo(box.y);
  await page.setViewportSize({width: 320, height: 740}); await expect(cue(page, 'drag')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('any combination completes dragging; wonders delay goals, and both accomplishments survive chapter restart and reload', async ({page}) => {
  await open(page); await combine(page, 'A', 'D');
  await expect(tile(page, 'E')).toHaveCount(1); await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.reload(); await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Continue', exact: true}).click();
  await expect(cue(page, 'goals')).toBeVisible();
  await expect(page.locator('.tutorial-overlay')).toHaveText('');
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Restart this chapter'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.reload(); await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.goto('/combinations.html?story=tutorial-two/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'drag')).toBeVisible();
});

test('early goals clicks count, and confirmed story restart from chapter one clears both tutorials', async ({page}) => {
  await open(page);
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Close', exact: true}).click();
  await expect(cue(page, 'drag')).toBeVisible();
  await combine(page, 'A', 'B'); await page.getByRole('button', {name: 'Continue', exact: true}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart this chapter'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart story', exact: true}).click();
  await expect(page.getByText(/item positions and tutorial progress/)).toBeVisible();
  await page.getByRole('button', {name: 'Cancel', exact: true}).click();
  await page.getByRole('button', {name: 'Close', exact: true}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart story', exact: true}).click();
  await page.getByRole('button', {name: 'Restart story', exact: true}).click();
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'drag')).toBeVisible();
  await combine(page, 'A', 'B'); await page.getByRole('button', {name: 'Continue', exact: true}).click();
  await expect(cue(page, 'goals')).toBeVisible();
});

test('goals lesson waits for a later chapter when the first combination completes the opening chapter', async ({page}) => {
  await open(page, story.replace('- Make E -- E\n', ''));
  await combine(page, 'A', 'B'); await page.getByRole('button', {name: 'Continue', exact: true}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Continue story'}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'goals')).toBeVisible();
});

test('touch Start selects a contact ring and a real touch drag remains unobstructed; reduced motion stays static', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  const page = await context.newPage();
  await page.route('**/tutorial-one/story.md', route => route.fulfill({contentType: 'text/markdown', body: story}));
  await page.goto('/combinations.html?story=tutorial-one/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).tap();
  await page.getByRole('button', {name: 'Begin', exact: true}).tap();
  await expect(cue(page, 'drag')).toHaveAttribute('data-modality', 'touch');
  await expect(page.locator('.tutorial-cursor')).toBeHidden();
  const session = await context.newCDPSession(page), a = (await tile(page, 'A').boundingBox())!, b = (await tile(page, 'B').boundingBox())!;
  await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: a.x + 20, y: a.y + 20}]});
  await expect(page.locator('.tutorial-ghost')).toBeHidden();
  await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: b.x + 20, y: b.y + 20}]});
  await expect(page.locator('.tutorial-path')).toBeHidden();
  await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await expect(tile(page, 'C')).toHaveCount(1);
  await page.getByRole('button', {name: 'Continue', exact: true}).tap();
  await expect(cue(page, 'goals')).toBeVisible();
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(page.locator('.tutorial-gesture')).toBeHidden();
  await expect(page.locator('.tutorial-arrow')).toBeHidden();
  await expect(page.locator('.tutorial-target')).toBeVisible();
  await page.getByRole('button', {name: 'Read this chapter'}).tap();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await context.close();
});

test('keyboard Start, old saves and changed manuscripts preserve evidence without counting checkpoint actions', async ({page}) => {
  let text = story;
  await page.route('**/tutorial-one/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.goto('/combinations.html?story=tutorial-one/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).focus(); await page.keyboard.press('Enter');
  await page.getByRole('button', {name: 'Begin', exact: true}).focus(); await page.keyboard.press('Enter');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(cue(page, 'drag')).toBeVisible(); await expect(page.locator('.tutorial-ghost')).toBeHidden();
  await combine(page, 'A', 'B'); await page.getByRole('button', {name: 'Continue', exact: true}).click();
  // Emulate a pre-tutorial save: only the actual game actions remain.
  await page.evaluate(() => { for (const key of Object.keys(localStorage)) if (key.startsWith('combination-tutorial-')) localStorage.removeItem(key); });
  await page.reload(); await expect(cue(page, 'goals')).toBeVisible();
  text = story.replace('Try making things.', 'Try combining the things here.');
  await page.reload(); await expect(cue(page, 'goals')).toBeVisible();
  await jumpToChapter(page, 'Second', true); await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.evaluate(() => { for (const key of Object.keys(localStorage)) if (key.startsWith('combination-tutorial-')) localStorage.removeItem(key); });
  await page.reload(); await expect(page.locator('.tutorial-overlay')).toBeHidden();
  expect(await page.evaluate(() => Object.keys(localStorage).some(key => key.startsWith('combination-tutorial-')))).toBe(false);
});

test('a tutorial-only storage failure remains visible after a successful game save', async ({page}) => {
  await page.addInitScript(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('combination-tutorial-')) throw new DOMException('Full', 'QuotaExceededError');
      write.call(this, key, value);
    };
  });
  await open(page); await combine(page, 'A', 'B');
  await page.getByRole('button', {name: 'Continue', exact: true}).click();
  await expect(page.locator('.save-alert')).toContainText('Tutorial progress could not be saved');
  await expect(cue(page, 'goals')).toBeVisible();
});
