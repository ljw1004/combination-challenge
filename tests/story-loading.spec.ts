import { test, expect } from '@playwright/test';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';

const manuscript = `# Shared artwork
## Workshop
background: ![scene](assets/bg.svg)

Build a kit.

**Goals**
- Build -- Kit
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit
`;

test('catalogue cards are usable HTML without JavaScript or a catalogue data request', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  try {
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('/index.html');
    const mars = page.locator('[data-story="stories/mars/mars.md"]');
    await expect(mars).toBeVisible();
    await expect(mars).toHaveAttribute('href', 'combinations.html?story=stories/mars/mars.md');
    expect(requests.some(url => url.includes('stories.json'))).toBe(false);
    await expect.poll(() => page.locator('.chooser img').evaluateAll(images => images.length > 0 && images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  } finally { await context.close(); }
});

test('two manuscripts share assets but keep progress separate; adjacent and default routes load their own files', async ({ page }) => {
  await page.route(url => /^\/shared\/[^/]+\.md$/.test(url.pathname), route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.route('**/story.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.route('**/assets/bg.svg', route => route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"/>'}));
  await page.goto('/combinations.html?story=shared/first.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();

  await page.goto('/combinations.html?story=shared/second.md');
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
  await expect(page.locator('[data-item="name:Kit"]')).toHaveCount(0);
  await expect(page.locator('.scene-art')).toHaveAttribute('src', /\/shared\/assets\/bg\.svg$/);
  await expect.poll(() => page.locator('.scene-art').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);

  await page.goto('/shared/combinations.html?story=first.md');
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();
  for (const folder of ['shared/', '']) {
    const requested = page.waitForRequest(request => new URL(request.url()).pathname === `/${folder}story.md`);
    await page.goto(`/${folder}combinations.html`);
    await requested;
    await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
    await expect(page.locator('.scene-art')).toHaveAttribute('src', new RegExp(`/${folder}assets/bg\\.svg$`));
  }
});

test('a missing named manuscript returns 404 instead of the development HTML fallback', async ({ page }) => {
  const response = page.waitForResponse('**/missing/absent.md');
  await page.goto('/combinations.html?story=missing/absent.md');
  expect((await response).status()).toBe(404);
  await expect(page.getByText(/Could not load the story.*HTTP 404/)).toBeVisible();
});

test('repository drafts and their artwork load relative to the player page without public-directory rewriting',async({page,request})=>{
  const scratch=resolve('runs');mkdirSync(scratch,{recursive:true});
  const folder=mkdtempSync(join(scratch,'draft preview ')),path=relative(process.cwd(),folder).replaceAll('\\','/');
  try {
    mkdirSync(join(folder,'assets'));
    writeFileSync(join(folder,'draft.md'),manuscript);
    writeFileSync(join(folder,'assets/bg.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"/>');
    await page.goto(`/combinations.html?story=${encodeURIComponent(path+'/draft.md')}`);
    await expect(page.getByRole('button',{name:'Start',exact:true})).toBeVisible();
    await expect.poll(()=>page.locator('.scene-art').first().evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
    const asset=await page.locator('.scene-art').first().getAttribute('src');
    expect(decodeURIComponent(asset!)).toContain('/'+path+'/assets/bg.svg');
    await page.goto(`/${path}/combinations.html?story=draft.md`);
    await expect(page.getByRole('button',{name:'Start',exact:true})).toBeVisible();
    expect(decodeURIComponent((await page.locator('.scene-art').first().getAttribute('src'))!)).toContain('/'+path+'/assets/bg.svg');
    const absent=await request.get('/'+path+'/missing.md');expect(absent.status()).toBe(404);
    const catalogue=await (await request.get('/index.html')).text();
    expect(catalogue).not.toContain(path+'/draft.md');
    expect(catalogue).toContain('data-story="stories/mars/mars.md"');
  } finally {rmSync(folder,{recursive:true,force:true});}
});
