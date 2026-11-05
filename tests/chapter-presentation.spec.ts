import {test, expect} from '@playwright/test';
import {jumpToChapter} from './debug-helpers.ts';
import {changingArray} from './fixtures/chapter-presentation.ts';

test.use({viewport: {width: 1280, height: 900}, reducedMotion: 'reduce'});

test('chapter changes update names and icons on current and old boards, survive reload and reset at an earlier checkpoint', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/chapter-presentation/story.md', route => route.fulfill({contentType: 'text/markdown', body: changingArray}));
  await page.route('**/chapter-presentation/assets/*.svg', route => {
    const file = new URL(route.request().url()).pathname.split('/').at(-1);
    const [width, height] = file === 'room.svg' ? [390,844] : file === 'dusty.svg' ? [320,240] : [224,224];
    return route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="tan"/></svg>`});
  });
  await page.goto('/make-something.html?story=chapter-presentation/story.md');
  await page.getByRole('button', {name: 'Start', exact: true}).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  const array = page.locator('[data-item="id:array"]'), spare = page.locator('[data-item="id:relic"]');
  await expect(array).toHaveAttribute('aria-label', 'Solar array');
  await expect(array.locator('.item-icon')).toHaveAttribute('src', /\/clean.svg$/);
  await jumpToChapter(page, 'Amber: Dawn', true);
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
  await expect(array).toHaveAttribute('aria-label', 'Dust-covered solar array');
  await expect(array.locator('.item-icon')).toHaveAttribute('src', /\/dusty.svg$/);
  await expect(array).toHaveClass(/icon-circular/);
  await expect(spare.locator('.item-icon')).toHaveAttribute('src', /\/dusty.svg$/);
  await expect(spare.locator('..')).toHaveAttribute('data-chapter', '0');
  expect(await array.evaluate(element => [element.clientWidth, element.clientHeight])).toEqual([80,60]);
  await page.reload();
  await expect(array).toHaveAttribute('aria-label', 'Dust-covered solar array');
  await expect(array.locator('.item-icon')).toHaveAttribute('src', /\/dusty.svg$/);
  await expect(spare.locator('.item-icon')).toHaveAttribute('src', /\/dusty.svg$/);
  await jumpToChapter(page, 'Aftermath', true);
  await expect(array).toHaveAttribute('aria-label', 'Weathered solar array');
  await expect(array.locator('.item-icon')).toHaveAttribute('src', /\/dusty.svg$/);
  await jumpToChapter(page, 'Landing', true);
  await expect(array).toHaveAttribute('aria-label', 'Solar array');
  await expect(array.locator('.item-icon')).toHaveAttribute('src', /\/clean.svg$/);
  await expect(spare.locator('.item-icon')).toHaveAttribute('src', /\/clean.svg$/);
  expect(errors).toEqual([]);
});
