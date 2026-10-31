import {test,expect} from '@playwright/test';
import type {Locator,Page} from '@playwright/test';
import type {JoineryAPI} from '../src/joinery-view.ts';
import type {JoineryState,JoineryCapture} from '../src/joinery-model.ts';

declare global {interface Window {joinery:JoineryAPI&{getState():JoineryState;exportRun():string}}}
const piece=(page:Page,id:string)=>page.locator(`[data-joinery-piece="${id}"]`);
const stock=(page:Page,id:string)=>page.locator(`[data-joinery-stock="${id}"]`);
const state=(page:Page)=>page.evaluate(()=>window.joinery.getState());
const capture=(page:Page)=>page.evaluate(()=>JSON.parse(window.joinery.exportRun()) as JoineryCapture);
async function box(node:Locator){const result=await node.boundingBox();if(!result)throw new Error('Shape is not visible.');return result;}
async function scale(page:Page){return page.locator('#app').evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--jn-cell')));}
async function holdAt(page:Page,source:Locator,target:Locator,offset:{x:number;y:number},shelf=false){
  if(shelf)await source.scrollIntoViewIfNeeded();
  const [a,b,cell]=await Promise.all([box(source),box(target),scale(page)]);
  const start=shelf?{x:a.x+a.width/2,y:a.y+a.height/2}:{x:a.x+cell/2,y:a.y+cell/2};
  // Shelf picks hold their full-size shape by its centre; table picks preserve the grabbed cell.
  const grab=shelf?await source.locator('.jn-stock-art').evaluate(node=>({w:Number((node as HTMLElement).style.getPropertyValue('--shape-w')),h:Number((node as HTMLElement).style.getPropertyValue('--shape-h'))})):{w:1,h:1};
  await page.mouse.move(start.x,start.y);await page.mouse.down();
  await page.mouse.move(b.x+(offset.x+grab.w/2)*cell,b.y+(offset.y+grab.h/2)*cell,{steps:16});
}
async function winFirst(page:Page){await holdAt(page,piece(page,'piece-2'),piece(page,'piece-1'),{x:0,y:2});await page.mouse.up();await expect.poll(async()=>(await state(page)).status).toBe('won');}

test.beforeEach(async({page})=>{await page.goto('/?experiment=joinery&level=first-join');await expect(page.locator('[data-joinery-workspace]')).toBeVisible();});

test('one visible shape, a right-hand unlimited shelf, and truthful hover show the joining rules',async({page})=>{
  await expect(page.locator('.jn-target')).toHaveCount(1);await expect(page.locator('[data-recipe],.mission,.board-grid')).toHaveCount(0);
  const [workspace,shelf]=await Promise.all([box(page.locator('[data-joinery-workspace]')),box(page.locator('.jn-shelf'))]);expect(shelf.x).toBeGreaterThanOrEqual(workspace.x+workspace.width);
  const before=await state(page);await piece(page,'piece-1').hover();
  await expect(piece(page,'piece-2')).toHaveClass(/jn-partner/);await expect(piece(page,'piece-2')).toContainText('Join at a touching edge');
  await expect(stock(page,'part-1')).toBeEnabled();await expect(stock(page,'part-2')).toBeEnabled();
  await expect(page.locator('.jn-shelf')).toContainText('Take copies freely');await expect(page.locator('.jn-shelf')).not.toContainText('One of each');
  await expect(page.locator('[data-joinery-stock].jn-partner')).toHaveCount(0);expect(await state(page)).toEqual(before);
  await stock(page,'part-1').hover();await expect(piece(page,'piece-1')).toHaveClass(/jn-partner/);await expect(piece(page,'piece-2')).toHaveClass(/jn-partner/);
  await expect(page.locator('[data-joinery-stock].jn-partner')).toHaveCount(0);
  await page.screenshot({path:'results/joinery-initial.png'});
});

test('the held pieces reveal an exact fit before release and become one coloured rigid object',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await holdAt(page,piece(page,'piece-2'),piece(page,'piece-1'),{x:0,y:2});
  await expect(page.locator('.jn-drag-ghost')).toBeVisible();await expect(piece(page,'piece-1')).toHaveClass(/jn-in-contact/);
  await expect(page.locator('[data-joinery-preview]')).toContainText('Fits the outline');expect((await state(page)).joins).toBe(0);
  await page.screenshot({path:'results/joinery-fit-contact.png'});await page.mouse.up();
  await expect.poll(async()=>(await state(page)).status).toBe('won');
  const result=await state(page);expect(result.pieces).toHaveLength(1);expect(result.pieces[0].cells).toHaveLength(4);expect(new Set(result.pieces[0].cellColors).size).toBe(2);
  await expect(page.locator('[data-joinery-action="next"]')).toBeVisible();await expect(page.locator('[data-joinery-hint]')).toContainText('This shape fits');
  expect((await capture(page)).interactions.map(i=>i.kind)).toEqual(expect.arrayContaining(['drag-start','join-preview','join']));expect(errors).toEqual([]);
  await page.waitForTimeout(350);await page.screenshot({path:'results/joinery-fit.png'});
});

test('Undo restores both actual ingredients and reload preserves a physical join',async({page})=>{
  await winFirst(page);const won=await state(page);await page.reload();await expect(page.locator('[data-joinery-piece]')).toHaveCount(1);expect(await state(page)).toEqual(won);
  await page.locator('[data-joinery-action="undo"]').click();await expect(piece(page,'piece-1')).toBeVisible();await expect(piece(page,'piece-2')).toBeVisible();
  expect((await state(page)).status).toBe('playing');expect((await state(page)).joins).toBe(0);
});

test('a finished compound stays reachable, draggable, and rotatable',async({page})=>{
  await winFirst(page);const before=(await state(page)).pieces[0],cell=await scale(page),a=await box(piece(page,before.id)),workspace=await box(page.locator('[data-joinery-workspace]'));
  await page.mouse.move(a.x+cell/2,a.y+cell/2);await page.mouse.down();await page.mouse.move(workspace.x+workspace.width*.76,workspace.y+workspace.height*.64,{steps:14});await page.mouse.up();
  const moved=(await state(page)).pieces[0];expect(moved.x).toBeGreaterThan(before.x+.2);expect((await state(page)).status).toBe('won');
  await piece(page,moved.id).click();await page.keyboard.press('r');const rotated=(await state(page)).pieces[0];expect(rotated.cells).not.toEqual(moved.cells);expect(rotated.parts).toEqual(moved.parts);expect((await state(page)).status).toBe('won');
  const finalBox=await box(piece(page,moved.id));expect(finalBox.x+finalBox.width).toBeLessThanOrEqual(workspace.x+workspace.width);expect(finalBox.y+finalBox.height).toBeLessThanOrEqual(workspace.y+workspace.height);
  await holdAt(page,stock(page,'part-1'),piece(page,moved.id),{x:3,y:0},true);await expect(page.locator('[data-joinery-preview]')).toBeVisible();await page.mouse.up();
  expect((await state(page)).joins).toBe(2);expect((await state(page)).pieces[0].cells).toHaveLength(6);await expect(stock(page,'part-1')).toBeEnabled();
});

test('the same inexhaustible shelf thing makes repeated free copies and repeated direct joins',async({page})=>{
  await page.goto('/?experiment=joinery&level=the-key');await expect(stock(page,'part-3')).toBeEnabled();
  const workspace=await box(page.locator('[data-joinery-workspace]'));
  for(const x of [.18,.72]){
    const from=await box(stock(page,'part-3'));await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();
    await page.mouse.move(workspace.x+workspace.width*x,workspace.y+workspace.height*.79,{steps:14});await page.mouse.up();
  }
  expect((await state(page)).pieces).toHaveLength(4);expect((await state(page)).joins).toBe(0);await expect(stock(page,'part-3')).toBeEnabled();
  await expect(stock(page,'part-3')).not.toHaveClass(/jn-stock-used/);await expect(stock(page,'part-3')).toContainText('Drag a copy');
  await holdAt(page,stock(page,'part-3'),piece(page,'piece-1'),{x:0,y:2},true);await expect(page.locator('[data-joinery-preview]')).toContainText('One piece');await page.mouse.up();
  let current=await state(page);expect(current.joins).toBe(1);expect(current.pieces).toHaveLength(4);await expect(stock(page,'part-3')).toBeEnabled();
  const compound=current.pieces.find(p=>p.cells.length===5)!;
  await holdAt(page,stock(page,'part-3'),piece(page,compound.id),{x:0,y:3},true);await page.mouse.up();current=await state(page);expect(current.joins).toBe(2);expect(current.pieces.find(p=>p.cells.length===7)).toBeDefined();await expect(stock(page,'part-3')).toBeEnabled();
  expect(current.pieces.find(p=>p.cells.length===7)!.parts.filter(id=>id==='part-3')).toHaveLength(2);
  await page.locator('[data-joinery-action="undo"]').click();await expect(stock(page,'part-3')).toBeEnabled();expect((await state(page)).pieces.some(p=>p.cells.length===5)).toBe(true);
});

test('a learned form stays freely copyable after Undo, with visible discovery and shelf scrolling',async({page})=>{
  await page.setViewportSize({width:500,height:500});await expect.poll(()=>scale(page)).toBeLessThan(43);await winFirst(page);
  const learned=await page.evaluate(()=>window.joinery.getView().stock.find(thing=>thing.cells.length===4));expect(learned).toBeDefined();
  await expect(stock(page,learned!.id)).toBeEnabled();await expect(stock(page,learned!.id)).toBeInViewport({ratio:1});
  await expect(page.locator('[data-joinery-shelf-scroll]')).toBeVisible();await expect(page.locator('[data-joinery-shelf-scroll] button')).toHaveText('Back to top ↑');
  await page.locator('[data-joinery-action="undo"]').click();await expect(stock(page,learned!.id)).toBeEnabled();expect((await state(page)).pieces).toHaveLength(2);
  await expect(page.locator('[data-joinery-shelf-scroll] button')).toHaveText('Back to top ↑');
  await page.locator('[data-joinery-shelf-scroll] button').click();await expect.poll(()=>page.locator('.jn-stock-list').evaluate(node=>node.scrollTop)).toBe(0);
  await stock(page,learned!.id).scrollIntoViewIfNeeded();await stock(page,learned!.id).click();
  let current=await state(page);expect(current.pieces).toHaveLength(3);const copy=current.pieces.find(p=>p.cells.length===4)!;expect(copy).toBeDefined();expect(new Set(copy.cellColors).size).toBe(2);
  await expect(stock(page,learned!.id)).toBeEnabled();await stock(page,learned!.id).click();current=await state(page);expect(current.pieces.filter(p=>p.cells.length===4)).toHaveLength(2);
  await expect(stock(page,learned!.id)).toBeEnabled();
});

test('keyboard moves and rotates actual pieces and Enter joins at their visible contact',async({page})=>{
  const original=(await state(page)).pieces.find(p=>p.id==='piece-2')!;
  await piece(page,'piece-2').focus();await page.keyboard.press('Enter');await expect(piece(page,'piece-2')).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-joinery-action="rotate"]')).toBeEnabled();
  await page.keyboard.press('r');expect((await state(page)).pieces.find(p=>p.id==='piece-2')!.cells).not.toEqual(original.cells);
  await page.keyboard.press('r');await page.keyboard.press('r');await page.keyboard.press('r');
  const [a,b,cell]=await Promise.all([box(piece(page,'piece-1')),box(piece(page,'piece-2')),scale(page)]);
  const dx=Math.round((a.x-b.x)/cell),dy=Math.round((a.y+2*cell-b.y)/cell);
  for(let i=0;i<Math.abs(dx);i++)await page.keyboard.press(dx<0?'ArrowLeft':'ArrowRight');
  for(let i=0;i<Math.abs(dy);i++)await page.keyboard.press(dy<0?'ArrowUp':'ArrowDown');
  await expect(page.locator('[data-joinery-preview]')).toContainText('Fits the outline');await page.keyboard.press('Enter');
  await expect.poll(async()=>(await state(page)).status).toBe('won');await expect(page.locator('[data-joinery-piece]')).toBeFocused();
});

test('a real mobile touch drag previews and joins without page overflow',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();await page.goto('http://127.0.0.1:5173/?experiment=joinery&level=first-join');await expect(piece(page,'piece-2')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(844);
  const [a,b,cell]=await Promise.all([box(piece(page,'piece-1')),box(piece(page,'piece-2')),scale(page)]),session=await context.newCDPSession(page);
  const start={x:b.x+cell/2,y:b.y+cell/2},end={x:a.x+cell/2,y:a.y+2.5*cell};
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  for(let i=1;i<=12;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/12,y:start.y+(end.y-start.y)*i/12}]});
  await expect(page.locator('[data-joinery-preview]')).toContainText('Fits the outline');await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(async()=>(await state(page)).status).toBe('won');const workspace=await box(page.locator('[data-joinery-workspace]')),result=await box(page.locator('[data-joinery-piece]'));
  expect(result.x).toBeGreaterThanOrEqual(workspace.x);expect(result.x+result.width).toBeLessThanOrEqual(workspace.x+workspace.width);expect(result.y+result.height).toBeLessThanOrEqual(workspace.y+workspace.height);
  expect((await capture(page)).interactions.some(i=>i.kind==='drag-start'&&i.pointerType==='touch')).toBe(true);await page.waitForTimeout(350);await page.screenshot({path:'results/joinery-touch-fit.png'});await context.close();
});
