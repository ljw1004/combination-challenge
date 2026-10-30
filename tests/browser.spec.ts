import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {jumpToChapter, openDebugPanel} from './debug-helpers.ts';
const chapter = (story: string, index: number) => [...readFileSync(`stories/${story}/story.md`, 'utf8').matchAll(/^## (.+)$/gm)][index][1];
async function openMars(page:import('@playwright/test').Page){await page.goto('/#mars');await page.getByRole('button',{name:'Begin',exact:true}).click();}
test('real pointer combine, surviving source, undo, reload and chapter reset without instructions',async({page})=>{
  await openMars(page);const radio=page.locator('[data-item="name:Broken radio"]'),cable=page.locator('[data-item="name:Cable"]');const a=(await radio.boundingBox())!,b=(await cable.boundingBox())!;
  await page.mouse.move(a.x+20,a.y+20);await page.mouse.down();await expect(cable).toHaveClass(/possible/);await page.mouse.move(b.x+20,b.y+20,{steps:6});await expect(cable).toHaveClass(/will-create/);await page.mouse.up();await expect(page.locator('[data-item="name:Radio"]')).toHaveCount(1);
  await page.reload();await expect(page.locator('[data-item="name:Radio"]')).toHaveCount(1);await openDebugPanel(page);await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(radio).toHaveCount(1);
  await expect(page.locator('.objective-line')).toHaveCount(1);
  await page.getByRole('button',{name:'Read this chapter'}).click();await page.getByRole('button',{name:'Restart this chapter'}).click();await expect(page.getByRole('button',{name:'Begin',exact:true})).toBeVisible();await expect(page.locator('dialog button')).toHaveCount(1);await expect(page.getByText('How to play',{exact:true})).toHaveCount(0);
});
test('touch dragging moves a card while empty-space touch scrolls the story',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await openMars(page);
  await jumpToChapter(page,chapter('mars',1),true);await page.getByRole('button',{name:'Begin',exact:true}).tap();
  const cdp=await context.newCDPSession(page),card=page.locator('.chapter-panel').last().locator('.thing').first(),box=(await card.boundingBox())!;
  const start={x:box.x+20,y:box.y+20};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:250,y:710}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const after=(await card.boundingBox())!;expect(Math.abs(after.y-box.y)).toBeGreaterThan(50);
  const before=await page.locator('.viewport').evaluate(el=>el.scrollTop);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:8,y:300}]});for(let y=320;y<=650;y+=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:8,y}]});await page.waitForTimeout(16);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(()=>page.locator('.viewport').evaluate(el=>el.scrollTop)).toBeLessThan(before);
  await context.close();
});
test('generated checkpoint has readable cards and assets at phone width',async({page})=>{
  await page.setViewportSize({width:320,height:740});await openMars(page);await jumpToChapter(page,chapter('mars',3),true);await page.getByRole('button',{name:'Begin',exact:true}).click();await expect(page.getByText('Generated checkpoint',{exact:true})).toBeVisible();
  expect(await page.locator('.scene-art').evaluateAll(images=>images.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const cards=page.locator('.chapter-panel').last().locator('.thing');await expect(cards.filter({hasText:'Wheels'})).toBeVisible();
  expect(await cards.evaluateAll(els=>els.every(el=>el.scrollWidth<=el.clientWidth&&el.getBoundingClientRect().height>=43))).toBe(true);
});

test('manual recovery controls are conditional and story restart requires confirmation',async({page})=>{
  await openMars(page);
  await page.getByRole('button',{name:'Read this chapter'}).click();
  await expect(page.locator('dialog button')).toHaveCount(1);
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await jumpToChapter(page,chapter('mars',1),true);
  await expect(page.locator('dialog button')).toHaveCount(1);await page.getByRole('button',{name:'Begin',exact:true}).click();
  await page.getByRole('button',{name:'Read this chapter'}).click();await expect(page.getByRole('button',{name:'Restart this chapter'})).toHaveCount(0);
  await page.getByRole('button',{name:'Restart story',exact:true}).click();await expect(page.getByText(/This removes all progress in this story/)).toBeVisible();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();await expect(page.getByRole('button',{name:'Restart story',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Close',exact:true}).click();
  const card=page.locator('.chapter-panel').last().locator('.thing').first(),before=(await card.boundingBox())!;
  await card.dragTo(page.locator('.chapter-panel').last(),{targetPosition:{x:220,y:500}});
  await page.reload();await page.getByRole('button',{name:'Read this chapter'}).click();
  await expect(page.getByRole('button',{name:'Restart story',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Restart this chapter'}).click();await page.getByRole('button',{name:'Begin',exact:true}).click();
  const restored=(await card.boundingBox())!;expect(restored.x).toBeCloseTo(before.x,1);expect(restored.y).toBeCloseTo(before.y,1);
  await page.getByRole('button',{name:'Read this chapter'}).click();await page.getByRole('button',{name:'Restart story',exact:true}).click();await page.getByRole('button',{name:'Restart story',exact:true}).click();
  await expect(page.locator('.chapter-panel')).toHaveCount(1);await expect(page.locator('dialog button')).toHaveCount(1);await expect(page.getByRole('button',{name:'Begin',exact:true})).toBeVisible();
});

test('a card covering centered goals keeps native pointer precedence',async({page})=>{
  await openMars(page);
  const card=page.locator('[data-item="name:Broken radio"]'),goals=page.getByRole('button',{name:'Read this chapter'});
  const initial=(await card.boundingBox())!,dock=(await goals.boundingBox())!;
  await page.mouse.move(initial.x+initial.width/2,initial.y+initial.height/2);await page.mouse.down();await page.mouse.move(dock.x+dock.width/2,dock.y+dock.height/2,{steps:6});await page.mouse.up();
  const overlap=(await card.boundingBox())!;
  await page.mouse.move(overlap.x+overlap.width/2,overlap.y+overlap.height/2);await page.mouse.down();await page.mouse.move(290,400,{steps:6});await page.mouse.up();
  expect((await card.boundingBox())!.y).toBeLessThan(overlap.y-100);await expect(page.locator('dialog')).toHaveCount(0);
  await goals.click();await expect(page.getByRole('button',{name:'Restart this chapter'})).toBeVisible();
});

test('long hold reader survives release and closes on the next deliberate click',async({page})=>{
  await page.goto('/');await page.locator('[data-story="elements"]').click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  await jumpToChapter(page,chapter('elements',18),true);await page.getByRole('button',{name:'Begin',exact:true}).click();
  const plant=page.locator('[data-item="name:Plant"]');await plant.scrollIntoViewIfNeeded();const box=(await plant.boundingBox())!;
  await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.waitForTimeout(650);
  await expect(page.locator('dialog')).toBeVisible();await page.mouse.up();await expect(page.locator('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Close',exact:true}).click();await expect(page.locator('dialog')).toHaveCount(0);
});
test('first-release partner highlights linger after the pointer leaves the card',async({page})=>{
  await openMars(page);const radio=page.locator('[data-item="name:Broken radio"]'),cable=page.locator('[data-item="name:Cable"]');
  await radio.click();await page.mouse.move(5,600);await expect(cable).toHaveClass(/possible/);
  await page.waitForTimeout(450);await expect(cable).not.toHaveClass(/possible/);
});
