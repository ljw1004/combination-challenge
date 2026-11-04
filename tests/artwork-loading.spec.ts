import {test, expect, type Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

const manuscript = `# Incremental artwork
![cover](art/cover.svg)

## Workshop
![workshop](art/workshop.svg)

Build things.
**Goals**
- Build D -- D
**Items**
- A
  - icon: ![A](art/a.svg)
- B
  - icon: ![B](art/b.svg)
- C
  - icon: ![C](art/c.svg)
- D
  - icon: ![D](art/d.svg)
**Combinations**
- A [preserve] + B [preserve] -> C
- C [preserve] + B [preserve] -> D
## Field
![field](art/field.svg)

Finish outside.
**Goals**
- Build R -- R
**Hotspots**
- Bench
  - icon: ![bench](art/bench.svg)
**Items**
- Bench
- P
  - icon: ![P](art/p.svg)
- R
  - icon: ![R](art/r.svg)
**Combinations**
- D [preserve] + P [preserve] -> R
## Later
![later](art/later.svg)

**Goals**
- Keep Q -- Q
**Items**
- Q
  - icon: ![Q](art/q.svg)
`;
const svg = (name: string) => {
  const [width, height] = ['cover.svg', 'workshop.svg', 'field.svg', 'later.svg'].includes(name) ? [390, 844] : name === 'c.svg' ? [640, 320] : [320, 160];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#d6dbc2"/></svg>`;
};
async function storyRoute(page: Page) {
  await page.route('**/incremental/story.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
}
function gate() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => { release = resolve; });
  return {promise, release};
}

test('cover, one-step results and next-chapter arrivals load independently, with measured layout after a fast action', async ({page}) => {
  await storyRoute(page);
  const cover = gate(), firstItem = gate(), result = gate(), requested = new Set<string>();
  await page.route('**/incremental/art/*.svg', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
    requested.add(name);
    if (name === 'cover.svg') await cover.promise;
    if (name === 'a.svg') await firstItem.promise;
    if (name === 'c.svg') await result.promise;
    await route.fulfill({contentType: 'image/svg+xml', body: svg(name)});
  });
  await page.goto('/combinations.html?story=incremental/story.md', {waitUntil: 'domcontentloaded'});
  await expect(page.getByText('Loading story…', {exact: true})).toBeVisible();
  await page.setViewportSize({width: 390, height: 800});
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toHaveCount(0);
  expect([...requested]).toEqual(['cover.svg']);
  cover.release();
  const start = page.getByRole('button', {name: 'Start', exact: true});
  await expect(start).toBeVisible();
  expect(await page.locator('.scene-art').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect.poll(() => requested.has('a.svg') && requested.has('b.svg') && requested.has('workshop.svg')).toBe(true);
  expect(requested.has('c.svg')).toBe(false);
  expect(requested.has('field.svg')).toBe(false);
  await start.click();
  await expect(page.locator('.game-surface')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('button', {name: 'Begin', exact: true})).toHaveCount(0);
  firstItem.release();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect.poll(() => ['c.svg', 'field.svg', 'bench.svg', 'p.svg'].every(name => requested.has(name))).toBe(true);
  for (const name of ['d.svg', 'r.svg', 'later.svg', 'q.svg']) expect(requested.has(name), name).toBe(false);
  const a = page.locator('[data-item="name:A"]'), b = page.locator('[data-item="name:B"]'), c = page.locator('[data-item="name:C"]');
  await a.dragTo(b);
  await expect(page.locator('.game-surface')).toHaveAttribute('aria-busy', 'true');
  await expect(c).toHaveCount(0);
  result.release();
  await expect(c).toBeVisible();
  expect(await c.evaluate((element: HTMLElement) => [element.offsetWidth, element.offsetHeight])).toEqual([160, 80]);
  await expect.poll(() => requested.has('d.svg')).toBe(true);
  expect(requested.has('r.svg')).toBe(false);
  await page.reload();
  await expect(c).toBeVisible();
  expect(await c.evaluate((element: HTMLElement) => [element.offsetWidth, element.offsetHeight])).toEqual([160, 80]);
  await c.dragTo(b);
  await page.getByRole('button', {name: 'Continue story'}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(page.locator('[data-item="name:P"]')).toBeVisible();
  await expect.poll(() => ['r.svg', 'later.svg', 'q.svg'].every(name => requested.has(name))).toBe(true);
});

test('an intermittent image failure recovers automatically before laying out the item', async ({page}) => {
  await storyRoute(page);
  let attempts = 0;
  await page.route('**/incremental/art/*.svg', route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (name === 'a.svg' && ++attempts === 1) return route.abort('failed');
    return route.fulfill({contentType: 'image/svg+xml', body: svg(name)});
  });
  await page.goto('/combinations.html?story=incremental/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  const a = page.locator('[data-item="name:A"]');
  await expect(a).toHaveClass(/icon-thing/);
  expect(attempts).toBe(2);
  expect(await a.evaluate((element: HTMLElement) => [element.offsetWidth, element.offsetHeight])).toEqual([80, 40]);
});

test('exhausted artwork failures fall back without poisoning recovery after reconnect', async ({page}) => {
  await storyRoute(page);
  let broken = true, attempts = 0;
  await page.route('**/incremental/art/*.svg', route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (name === 'a.svg') { attempts++; if (broken) return route.abort('failed'); }
    return route.fulfill({contentType: 'image/svg+xml', body: svg(name)});
  });
  await page.goto('/combinations.html?story=incremental/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  const a = page.locator('[data-item="name:A"]');
  await expect(a).toHaveClass(/text-thing/);
  expect(attempts).toBe(3);
  broken = false;
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(a).toHaveClass(/icon-thing/);
  expect(await a.evaluate((element: HTMLElement) => [element.offsetWidth, element.offsetHeight])).toEqual([80, 40]);
  expect(attempts).toBe(4);
});

test('a resumed chapter restart prepares retired starting items that were not needed on reload', async ({page}) => {
  await page.route('**/incremental/story.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript.replace('A [preserve]', 'A [transform]')}));
  const restore = gate(); let hold = false, requested = false;
  await page.route('**/incremental/art/*.svg', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (hold && name === 'a.svg') { requested = true; await restore.promise; }
    await route.fulfill({contentType: 'image/svg+xml', body: svg(name)});
  });
  await page.goto('/combinations.html?story=incremental/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  const a = page.locator('[data-item="name:A"]');
  await a.dragTo(page.locator('[data-item="name:B"]'));
  await expect(a).toHaveCount(0);
  hold = true;
  await page.reload();
  await expect(page.locator('[data-item="name:C"]')).toBeVisible();
  expect(requested).toBe(false);
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await page.getByRole('button', {name: 'Restart this chapter'}).click();
  await expect.poll(() => requested).toBe(true);
  await expect(a).toHaveCount(0);
  restore.release();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  expect(await a.evaluate((element: HTMLElement) => [element.offsetWidth, element.offsetHeight])).toEqual([80, 40]);
});

test('editing cancels a combination waiting on artwork instead of applying it to the new preview', async ({page}) => {
  await page.setViewportSize({width: 1100, height: 844});
  await storyRoute(page);
  const result = gate();
  await page.route('**/incremental/art/*.svg', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (name === 'c.svg') await result.promise;
    await route.fulfill({contentType: 'image/svg+xml', body: svg(name)});
  });
  await page.goto('/combinations.html?story=incremental/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="name:A"]').dragTo(page.locator('[data-item="name:B"]'));
  await expect(page.locator('.game-surface')).toHaveAttribute('aria-busy', 'true');
  await openDebugPanel(page);
  const editor = page.getByRole('textbox', {name: 'Story Markdown'});
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(manuscript.replace('Build things.', 'Revised workshop.'));
  await expect(page.locator('.game-surface')).not.toHaveAttribute('aria-busy', 'true');
  result.release();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-item="name:C"]')).toHaveCount(0);
  await page.getByRole('button', {name: 'Read this chapter'}).click();
  await expect(page.locator('.reading-text')).toContainText('Revised workshop.');
});
