import {test, expect, type Page} from '@playwright/test';

const manuscript = `# Viewport
## Workshop
![room](room.svg)

An opening reading.
**Goals**
- Build -- Kit
**Items**
- Frame
- Tool
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit
## Field
![field](field.svg)

A second reading.
**Goals**
- Finish -- Final
**Items**
- Kit
- Probe
**Combinations**
- Kit [preserve] + Probe [preserve] -> Final
## Home
A last reading.
**Goals**
- Pack -- Packed
**Items**
- Final
- Bag
**Combinations**
- Final [preserve] + Bag [preserve] -> Packed
`;

async function openFixture(page: Page) {
  await page.route('**/viewport/story.md', route => route.fulfill({contentType: 'text/markdown', body: manuscript}));
  await page.route('**/viewport/*.svg', route => route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1688"><defs><pattern id="grid" width="78" height="84.4" patternUnits="userSpaceOnUse"><rect width="78" height="84.4" fill="#d6dbc2"/><path d="M0 84.4V0H78" fill="none" stroke="#345" stroke-width="5"/></pattern></defs><rect width="780" height="1688" fill="url(#grid)"/><circle cx="390" cy="120" r="80" fill="#e8b465"/></svg>`}));
  await page.goto('/combinations.html?story=viewport/story.md');
  await expect(page.getByRole('button', {name: 'Start', exact: true})).toBeVisible();
}

async function expectCurrentFits(page: Page, count: number) {
  const height = page.viewportSize()!.height;
  await expect.poll(() => page.locator('.viewport').evaluate(el => ({height: el.clientHeight, total: el.scrollHeight, top: el.scrollTop})))
    .toEqual({height, total: count * height, top: (count - 1) * height});
  // CSS resizes the viewport before the resize handler updates the chapter scene.
  const panel = page.locator('.chapter-panel').last();
  await expect.poll(async () => (await panel.boundingBox())?.height).toBeCloseTo(height, 1);
  expect((await panel.boundingBox())!.y).toBeCloseTo(0, 1);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Even deliberate attempts cannot reveal extra background below the active scene.
  expect(await page.locator('.viewport').evaluate(el => { el.scrollTop += 1000; return el.scrollTop; })).toBe((count - 1) * height);
}

test('cover and chapter use identical pixels and cannot scroll at short, reference and tall phone sizes', async ({page}) => {
  const sceneryOnly = '.story-start,.thing,.hud-stack,.debug-toggle,.tutorial-overlay {visibility:hidden!important}';
  for (const viewport of [{width:390,height:664}, {width:390,height:844}, {width:320,height:740}]) {
    await page.setViewportSize(viewport);
    await openFixture(page);
    await page.locator('.scene-art').evaluate((el: HTMLImageElement) => el.decode());
    await expectCurrentFits(page, 1);
    const image = await page.locator('.scene-art').elementHandle();
    const before = await page.locator('.world').screenshot({style: sceneryOnly});
    await page.getByRole('button', {name:'Start',exact:true}).click();
    await page.getByRole('button', {name:'Begin',exact:true}).click();
    expect(await image!.evaluate(el => el === document.querySelector('.scene-art'))).toBe(true);
    await expectCurrentFits(page, 1);
    const after = await page.locator('.world').screenshot({style: sceneryOnly});
    // PNG encodings may differ; compare pixels, allowing one colour level for raster rounding.
    const difference = await page.evaluate(async images => {
      const pixels = await Promise.all(images.map(async data => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
        const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      }));
      return pixels[0].reduce((max, value, i) => Math.max(max, Math.abs(value - pixels[1][i])), 0);
    }, [before.toString('base64'), after.toString('base64')]);
    expect(difference).toBeLessThanOrEqual(1);
    await page.evaluate(() => localStorage.clear());
  }
});

test('advancing and resizing keep the latest chapter at the bottom while scrollback remains available', async ({page}) => {
  await page.setViewportSize({width:390,height:664});
  await openFixture(page);
  await page.getByRole('button', {name:'Start',exact:true}).click();
  await page.getByRole('button', {name:'Begin',exact:true}).click();
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await page.getByRole('button', {name:'Continue story'}).click();
  await expectCurrentFits(page, 2);
  // Browser chrome changing height must also work with the chapter reading open.
  await page.setViewportSize({width:390,height:760});
  await expectCurrentFits(page, 2);
  await page.getByRole('button', {name:'Begin',exact:true}).click();
  await page.locator('[data-item="name:Kit"]').dragTo(page.locator('[data-item="name:Probe"]'));
  await page.getByRole('button', {name:'Continue story'}).click();
  await page.getByRole('button', {name:'Begin',exact:true}).click();
  await expectCurrentFits(page, 3);
  await page.setViewportSize({width:320,height:740});
  await expectCurrentFits(page, 3);
  await page.reload(); await expectCurrentFits(page, 3);
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find(key => key.startsWith('combination-progress-v2:'))!;
    const saved = JSON.parse(localStorage.getItem(key)!);
    delete saved.anchor.viewportHeight; saved.anchor.scrollTop = 1200;
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload(); await expectCurrentFits(page, 3);
  await page.mouse.move(8, 400); await page.mouse.wheel(0, -300);
  await expect.poll(() => page.locator('.viewport').evaluate(el => el.scrollTop)).toBeLessThan(1480);
  await page.locator('.viewport').evaluate(el => { el.scrollTop = 740; });
  await expect.poll(() => page.locator('.viewport').evaluate(el => el.scrollTop)).toBe(740);
  await page.setViewportSize({width:390,height:664});
  await expect.poll(() => page.locator('.viewport').evaluate(el => el.scrollTop)).toBe(664);
  await page.reload();
  await expect.poll(() => page.locator('.viewport').evaluate(el => el.scrollTop)).toBe(664);
  await page.mouse.move(8, 400); await page.mouse.wheel(0, 5000);
  await expectCurrentFits(page, 3);
  const final = page.locator('[data-item="name:Final"]'), source = (await final.boundingBox())!;
  await page.mouse.move(source.x+10,source.y+10); await page.mouse.down();
  await page.locator('.viewport').evaluate(el => { el.scrollTop = 664; });
  await page.mouse.move(200,450,{steps:4}); await page.mouse.up();
  await expect(page.locator('.chapter-panel[data-chapter="1"] [data-item="name:Final"]')).toBeVisible();
  const moved = (await final.boundingBox())!;
  expect(moved.x).toBeCloseTo(190,1); expect(moved.y).toBeCloseTo(440,1);
});

test('wide movable artwork fits a cropped panel without changing its aspect ratio', async ({page}) => {
  await page.route('**/wide/story.md', route => route.fulfill({contentType:'text/markdown',body: manuscript.replace('- Frame\n','- Frame\n  - icon: ![frame](wide.svg)\n')}));
  await page.route('**/wide/wide.svg', route => route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="240"><rect width="1440" height="240" fill="#765"/></svg>'}));
  await page.setViewportSize({width:320,height:844});
  await page.goto('/combinations.html?story=wide/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const rect = (await page.locator('[data-item="name:Frame"]').boundingBox())!;
  expect(rect.x).toBeCloseTo(0,1); expect(rect.width).toBeCloseTo(320,1);
  expect(rect.width/rect.height).toBeCloseTo(6,2);
  await expectCurrentFits(page,1);
});

test('a tall narrow viewport keeps automatic text rows separate and unpositioned hotspots visible', async ({page}) => {
  await page.setViewportSize({width:320,height:844});
  await page.goto('/combinations.html?story=mars/mars.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const cards = await page.locator('[data-item]').evaluateAll(elements => elements.map(el => {
    const box = el.getBoundingClientRect(); return {left:box.left,right:box.right,top:box.top,bottom:box.bottom};
  }));
  const goals=(await page.locator('.hud-stack').boundingBox())!;
  for(const [i,card] of cards.entries()){
    expect(card.left).toBeGreaterThanOrEqual(0);expect(card.right).toBeLessThanOrEqual(320);
    expect(card.bottom).toBeLessThan(goals.y);
    for(const other of cards.slice(i+1))expect(card.right<=other.left||other.right<=card.left||card.bottom<=other.top||other.bottom<=card.top).toBe(true);
  }
  const hotspot = (await page.locator('[data-hotspot]').boundingBox())!;
  expect(hotspot.x).toBeGreaterThanOrEqual(0);
  expect(hotspot.x+hotspot.width).toBeLessThanOrEqual(320);
  await expectCurrentFits(page,1);
});

test('short-screen drops and resized saved items stay reachable without adding downward scroll', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await openFixture(page);
  await page.getByRole('button', {name:'Start',exact:true}).click();
  await page.getByRole('button', {name:'Begin',exact:true}).click();
  const frame = page.locator('[data-item="name:Frame"]');
  await frame.dragTo(page.locator('.chapter-panel'), {targetPosition:{x:389,y:843}});
  const original = (await frame.boundingBox())!;
  await page.setViewportSize({width:390,height:600});
  await expectCurrentFits(page, 1);
  const fitted = (await frame.boundingBox())!;
  expect(fitted.y + fitted.height).toBeCloseTo(600, 1);
  await page.setViewportSize({width:390,height:844});
  await expectCurrentFits(page, 1);
  expect(await frame.boundingBox()).toEqual(original);
  await page.setViewportSize({width:320,height:600});
  await expectCurrentFits(page, 1);
  await frame.dragTo(page.locator('.chapter-panel'), {targetPosition:{x:1,y:599}});
  const moved = (await frame.boundingBox())!;
  expect(moved.x).toBeCloseTo(0, 1); expect(Math.abs(moved.y + moved.height - 600)).toBeLessThan(1);
  await page.reload(); await expectCurrentFits(page, 1);
  expect(await frame.boundingBox()).toEqual(moved);
});

test('phone swipes can revisit history but cannot scroll below the current chapter', async ({browser}) => {
  const context = await browser.newContext({viewport:{width:390,height:664},isMobile:true,hasTouch:true});
  try {
    const page = await context.newPage(); await openFixture(page);
    await page.getByRole('button', {name:'Start',exact:true}).tap();
    await page.getByRole('button', {name:'Begin',exact:true}).tap();
    const cdp = await context.newCDPSession(page);
    async function swipe(from: number, to: number) {
      await cdp.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:8,y:from}]});
      for (let i = 1; i <= 12; i++) {
        await cdp.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:8,y:from+(to-from)*i/12}]});
        await page.waitForTimeout(16);
      }
      await cdp.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
    }
    await swipe(580,100); await expectCurrentFits(page, 1);
    await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
    await page.getByRole('button', {name:'Continue story'}).tap();
    await page.getByRole('button', {name:'Begin',exact:true}).tap();
    await swipe(580,100); await expectCurrentFits(page, 2);
    await swipe(100,580);
    await expect.poll(() => page.locator('.viewport').evaluate(el => el.scrollTop)).toBeLessThan(664);
    await swipe(580,100); await swipe(580,100);
    await expectCurrentFits(page, 2);
  } finally { await context.close(); }
});
