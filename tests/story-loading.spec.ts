import { test, expect } from '@playwright/test';

const manuscript = `# Shared artwork
## Workshop
![scene](assets/bg.svg)

Build a kit.

**Goals**
- Build -- Kit
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit
`;

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
