import {test, expect} from '@playwright/test';

// An opaque landscape replacement and the unchanged scene must render the same
// authored colour. Comparing screenshot bytes catches compositor-only washes
// that a source-image diff or canvas drawImage check cannot see.
for (const width of [390, 320]) {
  test(`registered scenery retains matching rendered pixels at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 844});
    await page.route('**/scene-continuity/story.md', route => route.fulfill({contentType: 'text/markdown', body: `# A changing place
## Ground
background: ![ground](ground.svg)

**Goals**
- Build here -- Built

**Hotspots**
- Site (at 50%, 30%)
  - icon: ![same ground](patch.svg)

**Items**
- Site
- Block
  - icon: ![block](block.svg)
- Built
  - icon: ![built](block.svg)

**Combinations**
- Block [consume] @ Site -> Built
`}));
    await page.route('**/scene-continuity/*.svg', route => {
      const background = route.request().url().endsWith('/ground.svg');
      const [w,h] = background ? [780,1688] : [400,400];
      return route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#7c3e20"/></svg>`});
    });
    await page.goto('/make-something.html?story=scene-continuity/story.md');
    await page.getByRole('button', {name: 'Start', exact: true}).click();
    const patch = page.locator('[data-hotspot="name:Site"]');
    await expect(patch).toBeVisible();
    await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>('.scene-art,.hotspot img')].every(image => image.complete && image.naturalWidth));
    await page.mouse.move(0,0);
    const box = (await patch.boundingBox())!;
    const y = Math.floor(box.y + box.height/2 - 8);
    const unchanged = await page.screenshot({clip: {x: 24, y, width: 16, height: 16}});
    const replaced = await page.screenshot({clip: {x: Math.floor(box.x + box.width/2 - 8), y, width: 16, height: 16}});
    expect(replaced.equals(unchanged), 'replacement and background must contain identical rendered pixels').toBe(true);
    await page.evaluate(() => {
      const reference = document.createElement('div');
      reference.style.cssText = 'position:fixed;left:0;top:0;width:16px;height:16px;background:#7c3e20;z-index:99999';
      document.body.append(reference);
    });
    const authoredColour = await page.screenshot({clip: {x: 0, y: 0, width: 16, height: 16}});
    expect(unchanged.equals(authoredColour), 'the game must preserve the authored background colour without a runtime wash').toBe(true);
  });
}
