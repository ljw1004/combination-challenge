import {test,expect} from '@playwright/test';
import type {Page,Locator} from '@playwright/test';
import type {WorkbenchAPI} from '../src/workbench-view.ts';
import type {TableState,TableCapture} from '../src/workbench-model.ts';

declare global { interface Window {combination:WorkbenchAPI&{getState():TableState;exportRun():string};} }
const piece=(page:Page,concept:string)=>page.locator(`[data-piece][data-concept="${concept}"]`);
const shelf=(page:Page,concept:string)=>page.locator(`[data-stock="${concept}"]`);
const state=(page:Page)=>page.evaluate(()=>window.combination.getState());
const capture=(page:Page)=>page.evaluate(()=>JSON.parse(window.combination.exportRun()) as TableCapture);
async function center(locator:Locator){const box=await locator.boundingBox();if(!box)throw new Error('The object is not visible.');return {x:box.x+box.width/2,y:box.y+box.height/2};}
async function dragTo(page:Page,from:Locator,to:Locator|{x:number;y:number},release=true){const a=await center(from);const b='x' in to?to:await center(to);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:16});if(release)await page.mouse.up();}

test.beforeEach(async({page})=>{await page.goto('/?experiment=hands');await expect(page.locator('[data-workspace]')).toBeVisible();});

test('the first screen contains things to handle, without a recipe or goal dashboard',async({page})=>{
  await expect(page.getByRole('heading',{name:'Combination',exact:true})).toBeVisible();
  await expect(piece(page,'soil')).toBeVisible();await expect(piece(page,'water')).toBeVisible();
  await expect(page.locator('[data-stock]')).toHaveCount(6);
  await expect(page.locator('[data-recipe]')).toHaveCount(0);
  await expect(page.locator('.mission,.workbench-tabs,.board-grid')).toHaveCount(0);
  await page.screenshot({path:'results/hands-initial.png',fullPage:true});
});

test('a held object follows the pointer and reveals its reaction at physical contact before release',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const before=await state(page);const target=before.pieces.find(p=>p.concept==='water')!;
  await dragTo(page,piece(page,'soil'),piece(page,'water'),false);
  await expect(page.locator('.wb-drag-ghost')).toBeVisible();
  await expect(piece(page,'water')).toHaveClass(/wb-in-contact/);
  await expect(page.locator('[data-contact-preview]')).toContainText('Earth + Water');
  await expect(page.locator('[data-contact-preview]')).toContainText('Clay');
  expect((await state(page)).mixes).toBe(0);
  await page.waitForTimeout(180);await page.screenshot({path:'results/hands-contact.png'});
  await page.mouse.up();await expect(piece(page,'clay')).toBeVisible();
  const after=await state(page);expect(after.pieces).toHaveLength(1);expect(after.pieces[0].x).toBe(target.x);expect(after.pieces[0].y).toBe(target.y);expect(after.mixes).toBe(1);
  await expect(shelf(page,'clay')).toBeVisible();
  await page.waitForTimeout(650);await page.screenshot({path:'results/hands-clay.png'});
  const events=(await capture(page)).interactions.map(e=>e.kind);
  expect(events).toEqual(expect.arrayContaining(['drag-start','contact-preview','drop','fusion']));
  expect(errors).toEqual([]);
});

test('shelf copies can be brought to the table or combined directly onto another thing',async({page})=>{
  await dragTo(page,piece(page,'soil'),piece(page,'water'));
  await dragTo(page,shelf(page,'heat'),piece(page,'clay'),false);
  await expect(page.locator('[data-contact-preview]')).toContainText('Heat + Clay');
  await expect(page.locator('[data-contact-preview]')).toContainText('Brick');
  await page.mouse.up();await expect(piece(page,'brick')).toBeVisible();
  expect((await state(page)).mixes).toBe(2);
  const workspace=await page.locator('[data-workspace]').boundingBox();
  await dragTo(page,shelf(page,'seed'),{x:workspace!.x+workspace!.width*.25,y:workspace!.y+workspace!.height*.7});
  await expect(piece(page,'seed')).toBeVisible();expect((await state(page)).mixes).toBe(2);
  await expect(shelf(page,'seed')).toBeVisible();
});

test('free movement is separate from mixing and does not spend or unlock anything',async({page})=>{
  const workspace=(await page.locator('[data-workspace]').boundingBox())!;const before=await state(page);
  await dragTo(page,piece(page,'soil'),{x:workspace.x+workspace.width*.2,y:workspace.y+workspace.height*.25});
  const after=await state(page);expect(after.mixes).toBe(0);expect(after.known).toEqual(before.known);expect(after.pieces).toHaveLength(2);
  expect(after.pieces.find(p=>p.concept==='soil')!.x).toBeCloseTo(.2,2);
});

test('an incompatible pair remains two separate physical things without consuming either',async({page})=>{
  await page.locator('[data-wb-action="clear"]').click();
  await shelf(page,'sand').click();await expect(piece(page,'sand')).toBeVisible();
  await dragTo(page,shelf(page,'seed'),piece(page,'sand'));
  const current=await state(page);expect(current.mixes).toBe(0);expect(current.pieces.map(p=>p.concept).sort()).toEqual(['sand','seed']);expect(current.known).toHaveLength(6);
  const a=await center(piece(page,'sand')),b=await center(piece(page,'seed'));expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeGreaterThan(90);
  await expect(page.locator('[data-announcement]')).toContainText('stay separate');
  expect((await capture(page)).interactions.some(e=>e.kind==='separate')).toBe(true);
});

test('keyboard picks actual pieces, previews the partner, combines, and retains useful focus',async({page})=>{
  await piece(page,'soil').focus();await page.keyboard.press('Enter');
  await expect(piece(page,'soil')).toHaveAttribute('aria-pressed','true');
  await piece(page,'water').focus();await expect(page.locator('[data-contact-preview]')).toContainText('Clay');
  await page.keyboard.press('Enter');await expect(piece(page,'clay')).toBeFocused();
  expect((await state(page)).mixes).toBe(1);
  await page.keyboard.press('ArrowLeft');await expect(piece(page,'clay')).toBeFocused();
  expect((await state(page)).mixes).toBe(1);
});

test('undo restores the two ingredients and reload preserves a physically made result',async({page})=>{
  await dragTo(page,piece(page,'soil'),piece(page,'water'));const mixed=await state(page);
  await page.reload();await expect(piece(page,'clay')).toBeVisible();expect(await state(page)).toEqual(mixed);
  await page.locator('[data-wb-action="undo"]').click();await expect(piece(page,'soil')).toBeVisible();await expect(piece(page,'water')).toBeVisible();
  expect((await state(page)).mixes).toBe(0);await expect(shelf(page,'clay')).toHaveCount(0);
});

test('mobile keeps the shelf and tabletop visible and edge drops remain retrievable',async({page})=>{
  await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await expect(shelf(page,'heat')).toBeVisible();
  const workspace=(await page.locator('[data-workspace]').boundingBox())!;
  await dragTo(page,piece(page,'soil'),{x:workspace.x+1,y:workspace.y+workspace.height*.3});
  const object=(await piece(page,'soil').boundingBox())!;expect(object.x).toBeGreaterThanOrEqual(workspace.x);expect(object.x+object.width).toBeLessThanOrEqual(workspace.x+workspace.width);
  await page.waitForTimeout(350);await page.screenshot({path:'results/hands-mobile.png',fullPage:true});
});

test('a touch user can pick two things directly without a recipe menu',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();await page.goto('http://127.0.0.1:5173/?experiment=hands');await expect(piece(page,'soil')).toBeVisible();
  const a=await center(piece(page,'soil')),b=await center(piece(page,'water'));await page.touchscreen.tap(a.x,a.y);await expect(piece(page,'soil')).toHaveAttribute('aria-pressed','true');await page.touchscreen.tap(b.x,b.y);await expect(piece(page,'clay')).toBeVisible();expect((await state(page)).mixes).toBe(1);await context.close();
});

test('hovering a thing reveals compatible outcomes on other things without making anything',async({page})=>{
  const before=await state(page);await shelf(page,'soil').hover();
  await expect(shelf(page,'water')).toContainText('→ Clay');
  await expect(shelf(page,'seed')).toContainText('→ Grove');
  await expect(shelf(page,'stone')).toContainText('→ Basin');
  expect(await state(page)).toEqual(before);
});

test('a table thing dropped onto a glowing shelf partner combines at that side of the table',async({page})=>{
  await dragTo(page,piece(page,'soil'),piece(page,'water'));const old=(await state(page)).pieces[0];
  await dragTo(page,piece(page,'clay'),shelf(page,'heat'),false);
  await expect(shelf(page,'heat')).toHaveClass(/wb-in-contact/);
  await expect(page.locator('[data-contact-preview]')).toContainText('Clay + Heat');
  await expect(page.locator('[data-contact-preview]')).toContainText('Brick');
  expect((await state(page)).mixes).toBe(1);
  await page.waitForTimeout(150);await page.screenshot({path:'results/hands-shelf-contact.png'});
  await page.mouse.up();await expect(piece(page,'brick')).toBeVisible();
  const current=await state(page);expect(current.mixes).toBe(2);expect(current.pieces).toHaveLength(1);expect(current.pieces[0].x).toBeGreaterThan(old.x+.1);
  expect((await capture(page)).interactions.some(e=>e.kind==='drop'&&e.targetShelf==='heat')).toBe(true);
});

test('a terminal thing gives a truthful hint instead of promising nonexistent glowing partners',async({page})=>{
  await dragTo(page,shelf(page,'stone'),piece(page,'water'));await piece(page,'channel').hover();
  await expect(page.locator('[data-hand-hint]')).toHaveText('This stays as it is for now. Try another thing.');
  await expect(page.locator('.wb-compatible')).toHaveCount(0);
  await piece(page,'channel').click();await expect(page.locator('[data-announcement]')).toHaveText('This stays as it is for now. Try another thing.');
});

test('an overflowing shelf has a visible scroll control and brings a new discovery into view',async({page})=>{
  await page.setViewportSize({width:500,height:500});
  await expect(page.locator('[data-shelf-scroll]')).toBeVisible();
  await expect(page.locator('[data-shelf-scroll] button')).toHaveText('More things ↓');
  await dragTo(page,piece(page,'soil'),piece(page,'water'));
  await expect.poll(()=>page.locator('.wb-shelf-items').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  await expect(shelf(page,'clay')).toBeInViewport({ratio:1});
  await expect(page.locator('[data-shelf-scroll] button')).toHaveText('Back to top ↑');
  await page.locator('[data-shelf-scroll] button').click();
  await expect.poll(()=>page.locator('.wb-shelf-items').evaluate(el=>el.scrollTop)).toBe(0);
});

test('touch drags combine shelf→table and table→shelf through actual contact',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();await page.goto('http://127.0.0.1:5173/?experiment=hands');await expect(piece(page,'soil')).toBeVisible();
  const touch=await context.newCDPSession(page);
  const touchDrag=async(from:Locator,to:Locator)=>{
    const a=await center(from),b=await center(to);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});
    for(let i=1;i<=12;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/12,y:a.y+(b.y-a.y)*i/12}]});
    await expect(page.locator('[data-contact-preview]')).toBeVisible();await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(550);
  };
  await touchDrag(shelf(page,'water'),piece(page,'soil'));await expect(piece(page,'clay')).toBeVisible();
  await touchDrag(piece(page,'clay'),shelf(page,'heat'));await expect(piece(page,'brick')).toBeVisible();expect((await state(page)).mixes).toBe(2);
  expect((await capture(page)).interactions.filter(e=>e.kind==='drag-start'&&e.pointerType==='touch')).toHaveLength(2);
  await page.screenshot({path:'results/hands-touch-both-directions.png'});await context.close();
});
