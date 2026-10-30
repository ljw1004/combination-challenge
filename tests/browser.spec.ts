import {test,expect} from '@playwright/test';
async function openMars(page:import('@playwright/test').Page){await page.goto('/#mars');await page.getByRole('button',{name:'Let’s begin'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();}
test('real pointer combine, surviving source, undo, reload and reset from instructions',async({page})=>{
  await openMars(page);const radio=page.locator('[data-item="name:Broken radio"]'),cable=page.locator('[data-item="name:Cable"]');const a=(await radio.boundingBox())!,b=(await cable.boundingBox())!;
  await page.mouse.move(a.x+20,a.y+20);await page.mouse.down();await expect(cable).toHaveClass(/possible/);await page.mouse.move(b.x+20,b.y+20,{steps:6});await expect(cable).toHaveClass(/will-create/);await page.mouse.up();await expect(page.locator('[data-item="name:Radio"]')).toHaveCount(1);
  await page.reload();await expect(page.locator('[data-item="name:Radio"]')).toHaveCount(1);await page.getByRole('button',{name:'Open game menu'}).click();await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(radio).toHaveCount(1);
  await expect(page.locator('.objective-line')).toHaveCount(1);
  await page.getByRole('button',{name:'Open game menu'}).click();await page.getByRole('button',{name:'How to play',exact:true}).click();await page.getByRole('button',{name:'Start over',exact:true}).click();await expect(page.getByRole('button',{name:'Let’s begin'})).toBeVisible();
});
test('touch dragging moves a card while empty-space touch scrolls the story',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await openMars(page);
  await page.getByRole('button',{name:'Open game menu'}).tap();await page.locator('#chapter').selectOption('1');await page.getByRole('button',{name:'Generate checkpoint'}).tap();await page.getByRole('button',{name:'Continue',exact:true}).tap();
  const cdp=await context.newCDPSession(page),card=page.locator('.chapter-panel').last().locator('.thing').first(),box=(await card.boundingBox())!;
  const start={x:box.x+20,y:box.y+20};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:250,y:710}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const after=(await card.boundingBox())!;expect(Math.abs(after.y-box.y)).toBeGreaterThan(50);
  const before=await page.locator('.viewport').evaluate(el=>el.scrollTop);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:8,y:300}]});for(let y=320;y<=650;y+=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:8,y}]});await page.waitForTimeout(16);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(()=>page.locator('.viewport').evaluate(el=>el.scrollTop)).toBeLessThan(before);
  await context.close();
});
test('generated checkpoint has readable cards and assets at phone width',async({page})=>{
  await page.setViewportSize({width:320,height:740});await openMars(page);await page.getByRole('button',{name:'Open game menu'}).click();await page.locator('#chapter').selectOption('3');await page.getByRole('button',{name:'Generate checkpoint'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('Generated checkpoint',{exact:true})).toBeVisible();
  expect(await page.locator('.scene-art').evaluateAll(images=>images.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const cards=page.locator('.chapter-panel').last().locator('.thing');await expect(cards.filter({hasText:'Wheels'})).toBeVisible();
  expect(await cards.evaluateAll(els=>els.every(el=>el.scrollWidth<=el.clientWidth&&el.getBoundingClientRect().height>=43))).toBe(true);
});
