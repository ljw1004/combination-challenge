import {test, expect} from '@playwright/test';
import {jumpToChapter} from './debug-helpers.ts';
import {conditionalWorld} from './fixtures/conditional-hotspot.ts';

test('a hotspot waits for its conditional artwork, keeps its identity and position, and restores creation history', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  let releaseImpact!: () => void, impactRequested = false;
  const impactReady = new Promise<void>(resolve => {releaseImpact = resolve;});
  await page.route('**/conditional-world/story.md', route => route.fulfill({contentType:'text/markdown',body:conditionalWorld}));
  await page.route('**/conditional-world/*.svg', async route => {
    const file = new URL(route.request().url()).pathname.split('/').at(-1);
    if (file === 'impact.svg') {impactRequested = true; await impactReady;}
    const [width,height] = file === 'space.svg' ? [390,844] : file === 'impact.svg' ? [480,320] : [224,224];
    await route.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="tan"/></svg>`});
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  try {
    await page.goto('/make-something.html?story=conditional-world/story.md');
    await page.getByRole('button',{name:'Start',exact:true}).click();
    await page.getByRole('button',{name:'Begin',exact:true}).click();
    const world = page.locator('[data-hotspot="id:world"]'), moon = page.locator('[data-item="id:moon"]');
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/before.svg$/);
    const before = (await world.boundingBox())!;
    await world.evaluate(el => {
      const memory = window as unknown as {worldNode: Element; worldImage: Element | null};
      memory.worldNode = el; memory.worldImage = el.querySelector('.item-icon');
    });
    await expect.poll(()=>impactRequested).toBe(true);
    await page.locator('[data-item="id:asteroid"]').dragTo(world);
    await expect(moon).toHaveCount(0);
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/before.svg$/);
    releaseImpact();
    await expect(moon).toBeVisible();
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/impact.svg$/);
    const after = (await world.boundingBox())!;
    expect(after.width).toBeCloseTo(120,4); expect(after.height).toBeCloseTo(80,4);
    expect(after.x+after.width/2).toBeCloseTo(before.x+before.width/2,4);
    expect(after.y+after.height/2).toBeCloseTo(before.y+before.height/2,4);
    expect(await world.evaluate(el => {
      const memory = window as unknown as {worldNode: Element; worldImage: Element | null};
      return memory.worldNode === el && memory.worldImage === el.querySelector('.item-icon');
    })).toBe(true);
    await moon.dragTo(page.locator('[data-item="id:sun"]'));
    await expect(moon).toHaveCount(0);
    await expect(page.locator('[data-item="id:remnant"]')).toBeVisible();
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/impact.svg$/);
    await page.reload();
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/impact.svg$/);
    await expect(moon).toHaveCount(0);
    await jumpToChapter(page,'Formation',true);
    await page.getByRole('button',{name:'Begin',exact:true}).click();
    await expect(world.locator('.item-icon')).toHaveAttribute('src',/before.svg$/);
    await expect(page.locator('[data-item="id:asteroid"]')).toBeVisible();
    expect(errors).toEqual([]);
  } finally {releaseImpact();}
});
