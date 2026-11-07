import {test, expect, type Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

const manuscript = `# ![Story icon](icon.png) Workshop & Wonders
## Workshop
Make a kit.

**Items**
- Frame
- Tool
- Kit
**Goals**
- Build -- Kit
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit
`;

// Desktop Chromium cannot emulate display-mode through Emulation.setEmulatedMedia.
// Stub only that signal; navigation, markup, artwork and manifest parsing are real.
async function standaloneWindow(page: Page, apple = false) {
  await page.addInitScript(apple => {
    if (apple) { Object.defineProperty(navigator, 'standalone', {value: true}); return; }
    const match = window.matchMedia.bind(window);
    let standalone = true;
    window.matchMedia = query => {
      const result = match(query);
      if (query === '(display-mode: standalone)') {
        Object.defineProperty(result, 'matches', {get: () => standalone});
        window.addEventListener('test-display-mode', event => {
          standalone = (event as CustomEvent<boolean>).detail;
          result.dispatchEvent(new Event('change'));
        });
      }
      return result;
    };
  }, apple);
}

async function browserManifest(page: Page) {
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /^data:application\/manifest\+json,/);
  const client = await page.context().newCDPSession(page);
  try {
    const result = await client.send('Page.getAppManifest');
    expect(result.errors).toEqual([]);
    expect(result.manifest?.display).toBe('kStandalone');
    expect((await client.send('Page.getInstallabilityErrors')).installabilityErrors).toEqual([]);
    return result.manifest!;
  } finally { await client.detach(); }
}

test('Chromium accepts inline catalogue and story manifests with existing icons and distinct stable identities', async ({page}) => {
  await page.goto('/');
  const origin = new URL(page.url()).origin;
  const catalogue = await browserManifest(page);
  expect(catalogue).toMatchObject({name: 'Make Something', id: origin + '/index.html', startUrl: origin + '/', scope: origin + '/'});
  expect(catalogue.icons).toEqual([{url: origin + '/icon.png', sizes: '256x256', type: ''}]);
  await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Make Something');

  await page.route('**/stories/cookbook/*.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.goto('/make-something.html?story=stories/cookbook/cookbook.md&home=show#chapter');
  const first = await browserManifest(page);
  expect(first.name).toBe('Workshop & Wonders');
  expect(first.id).toBe(origin + '/stories/cookbook/cookbook.md');
  expect(first.icons?.[0]?.url).toBe(origin + '/stories/cookbook/icon.png');
  const launch = new URL(first.startUrl!);
  expect(launch.searchParams.get('story')).toBe('/stories/cookbook/cookbook.md');
  expect(launch.searchParams.has('home')).toBe(false);
  expect(launch.hash).toBe('');
  await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', first.name!);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', first.icons![0].url);
  await expect(page).toHaveTitle('Make Something Worthwhile');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', './icon.png');

  await page.goto(first.startUrl!);
  expect((await browserManifest(page)).id).toBe(first.id);
  await page.goto('/make-something.html?story=stories/cookbook/alternate.md');
  expect((await browserManifest(page)).id).not.toBe(first.id);
});

test('standalone catalogue adds Home, survives reload and returns without losing story progress', async ({page}) => {
  await standaloneWindow(page);
  await page.route('**/stories/cookbook/cookbook.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.goto('/');
  const card = page.locator('[data-story="stories/cookbook/cookbook.md"]');
  await expect(card).toHaveAttribute('href', /&home=show$/);
  await card.click();
  const home = page.getByRole('link', {name: 'Home', exact: true});
  await expect(home).toBeVisible();
  await page.reload();
  await expect(home).toBeVisible();
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();
  const box = await home.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box!.x).toBeLessThan(25);
  expect(box!.y).toBeLessThan(25);
  await home.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/index.html$/);
  await card.click();
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();
  await expect(home).toBeVisible();
  // Visiting that same story directly in another installed context has no Home.
  await page.goto('/make-something.html?story=stories/cookbook/cookbook.md');
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();
  await expect(home).toHaveCount(0);
});

test('ordinary browser visits never gain Home, even with a copied catalogue-app URL', async ({page}) => {
  await page.route('**/stories/cookbook/cookbook.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.goto('/index.html');
  const card = page.locator('[data-story="stories/cookbook/cookbook.md"]');
  await expect(card).toHaveAttribute('href', 'make-something.html?story=stories/cookbook/cookbook.md');
  await card.click();
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
  await expect(page.locator('.story-home')).toHaveCount(0);
  await page.goto(page.url() + '&home=show');
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
  await expect(page.locator('.story-home')).toHaveCount(0);
});

test('Apple standalone detection also carries Home through legacy catalogue bookmarks and load errors', async ({page}) => {
  await standaloneWindow(page, true);
  await page.route('**/stories/cookbook/cookbook.md', route => route.fulfill({status: 404, body: 'Missing'}));
  await page.goto('/index.html#cookbook');
  await expect(page).toHaveURL(/make-something.html\?story=stories%2Fcookbook%2Fcookbook.md&home=show$/);
  await expect(page.getByText('Story could not be loaded')).toBeVisible();
  await page.getByRole('link', {name: 'Home', exact: true}).click();
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Make Something Worthwhile');
});

test('display-mode changes update catalogue links and the story Home control', async ({page}) => {
  await standaloneWindow(page);
  const changeMode = (value: boolean) => page.evaluate(standalone => window.dispatchEvent(new CustomEvent('test-display-mode', {detail: standalone})), value);
  await page.goto('/');
  const card = page.locator('[data-story="stories/cookbook/cookbook.md"]');
  await expect(card).toHaveAttribute('href', /home=show/);
  await changeMode(false);
  await expect(card).not.toHaveAttribute('href', /home=show/);
  await changeMode(true);
  await page.route('**/stories/cookbook/cookbook.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await card.click();
  await expect(page.locator('.story-home')).toBeVisible();
  await changeMode(false);
  await expect(page.locator('.story-home')).toHaveCount(0);
  await changeMode(true);
  await expect(page.locator('.story-home')).toBeVisible();
});

test('live title edits replace installation metadata without waiting for older icon downloads', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 844});
  let release!: () => void;
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/stories/cookbook/slow.png', async route => { await waiting; await route.fulfill({path: 'stories/cookbook/icon.png'}); });
  const draft = manuscript.replace('(icon.png)', '(slow.png)');
  await page.route('**/stories/cookbook/cookbook.md', route => route.fulfill({contentType: 'text/markdown', body: draft}));
  try {
    await page.goto('/make-something.html?story=stories/cookbook/cookbook.md', {waitUntil: 'domcontentloaded'});
    await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
    await openDebugPanel(page);
    const editor = page.getByRole('textbox', {name: 'Story Markdown'});
    await editor.fill(manuscript.replace('Workshop & Wonders', 'Revised title'));
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Revised title');
    const manifest = await browserManifest(page);
    expect(manifest.name).toBe('Revised title');
    expect(manifest.icons![0].url).toMatch(/\/stories\/cookbook\/icon.png$/);
    release();
    await page.evaluate(async () => {
      const oldIcon = new Image(); oldIcon.src = '/stories/cookbook/slow.png';
      await oldIcon.decode();
    });
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
    expect((await browserManifest(page)).name).toBe('Revised title');
  } finally { release(); }
});
