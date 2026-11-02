import {test, expect, type Page, type Locator} from '@playwright/test';
import {jumpToChapter} from './debug-helpers.ts';

const background = "![room](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='390' height='844'%3E%3Crect width='390' height='844' fill='%23eee2cb'/%3E%3C/svg%3E)";
const story = `# Hotspot tutorial
## First
${background}
Try making things.
**Goals**
- Make C -- C
- Make F -- F
- next: Make G -- G
**Hotspots**
- Bench (at 35%, 24%)
- Pan (at 75%, 24%)
**Items**
- A
- B
- C
- D
- E
- F
- G
**Combinations**
- A + B -> C (tutorial)
- D + E @ Bench -> F
- D @ Pan -> G
## Second
Another opportunity.
**Goals**
- Make F -- F
- next: Make G -- G
`;
const tile = (page: Page, name: string) => page.locator(`[data-item="name:${name}"]`);
const station = (page: Page, name: string) => page.locator('.chapter-panel').last().locator(`[data-hotspot="name:${name}"]`);
const cue = (page: Page, kind: string) => page.locator(`.tutorial-overlay[data-tutorial="${kind}"]`);
async function open(page: Page, text = story) {
  await page.route('**/hotspot-tutorial/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.goto('/combinations.html?story=hotspot-tutorial/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
}
async function drag(page: Page, source: Locator, target: Locator) {
  const a = (await source.boundingBox())!, b = (await target.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, {steps: 5}); await page.mouse.up();
}
async function accomplishments(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(key => key.startsWith('combination-tutorial-'))!) ?? '{}'));
}

test('opening, hotspot and goals cues take priority; either first placement leaves only the remaining move', async ({page}) => {
  await open(page);
  await expect(cue(page, 'drag')).toBeVisible();
  await drag(page, tile(page, 'A'), tile(page, 'B'));
  await expect(cue(page, 'hotspot')).toBeVisible();
  await expect(page.locator('.tutorial-path')).toHaveCount(2);
  await expect(page.locator('.tutorial-copy')).toHaveText(['D', 'E']);
  // Another successful mechanic must not dismiss the two-item hotspot lesson.
  await drag(page, tile(page, 'D'), station(page, 'Pan'));
  await expect(tile(page, 'G')).toHaveCount(1);
  await expect(cue(page, 'hotspot')).toBeVisible();
  expect((await accomplishments(page)).hotspotDone).toBe(false);
  await drag(page, tile(page, 'E'), station(page, 'Bench'));
  await expect(page.locator('.tutorial-path')).toHaveCount(1);
  await expect(page.locator('.tutorial-copy')).toHaveText('D');
  await page.reload();
  await expect(cue(page, 'hotspot')).toBeVisible();
  await expect(page.locator('.tutorial-copy')).toHaveText('D');
  await drag(page, tile(page, 'D'), tile(page, 'E'));
  await expect(tile(page, 'F')).toHaveCount(1);
  expect((await accomplishments(page)).hotspotDone).toBe(true);
  await expect(cue(page, 'hotspot')).toBeHidden();
  // Old saves can restore the accomplishment from actual accepted actions.
  await page.evaluate(() => { for (const key of Object.keys(localStorage)) if (key.startsWith('combination-tutorial-')) localStorage.removeItem(key); });
  await page.reload();
  await expect(cue(page, 'hotspot')).toBeHidden();
  expect((await accomplishments(page)).hotspotDone).toBe(true);
});

test('paired animation parks its first ghost through the second gesture, yields to touch and supports reduced motion', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  const page = await context.newPage();
  await page.clock.install({time: new Date('2026-11-01T12:00:00Z')});
  await open(page, story.replace(' (tutorial)', ''));
  await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 100));
  await expect(cue(page, 'hotspot')).toBeVisible();
  // Pause in the second drag: the first ghost has arrived and remains visible.
  await page.clock.runFor(3600);
  const first = (await page.locator('.tutorial-ghost').nth(0).boundingBox())!;
  const target = (await station(page, 'Bench').boundingBox())!;
  expect(first.x + first.width / 2).toBeCloseTo(target.x + target.width / 2);
  expect(first.y + first.height / 2).toBeCloseTo(target.y + target.height / 2);
  expect(await page.locator('.tutorial-ghost').nth(0).evaluate(el => Number((el as HTMLElement).style.opacity))).toBeGreaterThan(.4);
  expect(await page.locator('.tutorial-ghost').nth(1).evaluate(el => Number((el as HTMLElement).style.opacity))).toBeGreaterThan(.1);
  await page.emulateMedia({reducedMotion: 'reduce'}); await page.clock.runFor(32);
  for (const ghost of await page.locator('.tutorial-ghost').all()) await expect(ghost).toBeHidden();
  for (const path of await page.locator('.tutorial-path').all()) await expect(path).toBeVisible();
  const session = await context.newCDPSession(page), a = (await tile(page, 'D').boundingBox())!;
  await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: a.x + a.width / 2, y: a.y + a.height / 2}]});
  for (const path of await page.locator('.tutorial-path').all()) await expect(path).toBeHidden();
  await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: target.x + target.width / 2, y: target.y + target.height / 2}]});
  await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await page.clock.runFor(32);
  await expect(page.locator('.tutorial-copy')).toHaveText('E');
  await expect(page.locator('.tutorial-path')).toBeVisible();
  await context.close();
});

test('an unfinished lesson follows the next chapter; completion survives chapter restart, while story restart resets it', async ({page}) => {
  const optional = story.replace('- Make F -- F\n- next: Make G -- G\n**Hotspots**', '**Hotspots**');
  await open(page, optional);
  await drag(page, tile(page, 'A'), tile(page, 'B'));
  await expect(cue(page, 'hotspot')).toBeVisible();
  await page.getByRole('button', {name: 'Continue story'}).click();
  await expect(page.locator('.tutorial-overlay')).toBeHidden();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'hotspot')).toBeVisible();
  await drag(page, tile(page, 'D'), station(page, 'Bench'));
  await drag(page, tile(page, 'E'), tile(page, 'D'));
  await expect(cue(page, 'goals')).toBeVisible();
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart this chapter'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'hotspot')).toBeHidden();
  await page.reload(); await expect(cue(page, 'hotspot')).toBeHidden();
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart story', exact: true}).click();
  await page.getByRole('button', {name: 'Restart story', exact: true}).click();
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await drag(page, tile(page, 'A'), tile(page, 'B'));
  await expect(cue(page, 'hotspot')).toBeVisible();
});

test('goals can teach before any combination when neither drag cue is available; checkpoint jumps award nothing', async ({page}) => {
  const unavailable = story.replace(' (tutorial)', '').replace('D + E @ Bench -> F', 'D[Missing] + E @ Bench -> F');
  await open(page, unavailable);
  await expect(cue(page, 'goals')).toBeVisible();
  expect((await accomplishments(page)).dragDone).not.toBe(true);
  // Use a valid story for checkpoint generation.
  await page.unroute('**/hotspot-tutorial/story.md');
  const checkpointStory = story.split('## Second')[0] + '## Second\nAnother opportunity.\n**Goals**\n- Make Later -- F + G -> Later\n**Items**\n- Later\n';
  await page.route('**/hotspot-tutorial/story.md', route => route.fulfill({contentType: 'text/markdown', body: checkpointStory}));
  await page.reload();
  await jumpToChapter(page, 'Second', true);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'goals')).toBeVisible();
  expect(await page.evaluate(() => {
    const key = Object.keys(localStorage).find(key => key.startsWith('combination-progress-v2:'))!;
    return JSON.parse(localStorage.getItem(key)!).state.actions.some((action: {type: string; b?: string; hotspot?: string}) => action.type === 'combine' && action.b && action.hotspot);
  })).toBe(true);
  await page.reload();
  await expect(cue(page, 'goals')).toBeVisible();
  expect((await accomplishments(page)).hotspotDone).not.toBe(true);
});

test('debug jumps expose unfinished hotspot lessons, preserve completion, and do not count generated combinations', async ({page}) => {
  // The checkpoint completes one contextual recipe, but the player has not done one.
  const text = story.split('## Second')[0] + `## Second
Another opportunity.
**Goals**
- Make Later -- F + G @ Bench -> Later
**Items**
- Later
`;
  await open(page, text);
  await jumpToChapter(page, 'Second', true);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'hotspot')).toBeVisible();
  expect((await accomplishments(page)).hotspotDone).not.toBe(true);
  await page.reload();
  await expect(cue(page, 'hotspot')).toBeVisible();
  await drag(page, tile(page, 'F'), station(page, 'Bench'));
  await drag(page, tile(page, 'G'), tile(page, 'F'));
  expect((await accomplishments(page)).hotspotDone).toBe(true);
  await jumpToChapter(page, 'Second', true);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(cue(page, 'hotspot')).toBeHidden();
});
