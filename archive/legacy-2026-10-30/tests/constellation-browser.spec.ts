import {test,expect} from '@playwright/test';
import type {Locator,Page} from '@playwright/test';
import type {ConstellationState,ConstellationCapture} from '../src/constellation-model.ts';

interface CanvasViewport {x:number;y:number;zoom:number;width:number;height:number;rendered:number}
interface CanvasDebug {
  getState():ConstellationState;getViewport():CanvasViewport;exportRun():string;exportAllRuns():string;
  fit():void;focus(id:string):void;
}
declare global {interface Window {constellation:CanvasDebug}}
const node=(page:Page,id:string)=>page.locator(`[data-node=${JSON.stringify(id)}]`);
const state=(page:Page)=>page.evaluate(()=>window.constellation.getState());
const viewport=(page:Page)=>page.evaluate(()=>window.constellation.getViewport());
const capture=(page:Page)=>page.evaluate(()=>JSON.parse(window.constellation.exportRun()) as ConstellationCapture&{interactions:{kind:string;[key:string]:unknown}[]});
async function center(locator:Locator){const b=await locator.boundingBox();if(!b)throw new Error('The concept is not visible.');return {x:b.x+b.width/2,y:b.y+b.height/2};}
async function hold(page:Page,source:Locator,to:Locator|{x:number;y:number}){
  const a=await center(source),b='x' in to?to:await center(to);
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:16});
}
async function blend(page:Page,a:string,b:string){await hold(page,node(page,a),node(page,b));await page.mouse.up();}
async function holdForm(page:Page,a:string,b:string,offset:{x:number;y:number}){
  const s=await state(page),source=s.nodes.find(n=>n.id===a)!,target=s.nodes.find(n=>n.id===b)!;
  const shapeSize=(cells:[number,number][])=>({w:Math.max(...cells.map(c=>c[0]))+1,h:Math.max(...cells.map(c=>c[1]))+1});
  const ss=shapeSize(source.cells!),ts=shapeSize(target.cells!),z=(await viewport(page)).zoom,c=await center(node(page,b));
  await hold(page,node(page,a),{x:c.x+((ss.w-ts.w)/2+offset.x)*26*z,y:c.y+((ss.h-ts.h)/2+offset.y)*26*z});
}

test.beforeEach(async({page})=>{await page.goto('/?experiment=constellation&mode=alchemy');await expect(page.locator('[data-constellation-workspace]')).toBeVisible();});

test('one shared canvas holds one node per concept with no separate index',async({page})=>{
  const s=await state(page);expect(s.nodes).toHaveLength(6);expect(new Set(s.nodes.map(n=>n.id)).size).toBe(s.nodes.length);
  await expect(page.locator('[data-node]')).toHaveCount(6);await expect(page.locator('aside,[data-stock],[data-recipe]')).toHaveCount(0);
  await node(page,'soil').hover();await expect(node(page,'water')).toHaveClass(/cv-compatible/);await expect(node(page,'water')).toContainText('→ Clay');
  expect(await state(page)).toEqual(s);
  await page.screenshot({path:'results/constellation-ui/elements-initial.png'});
});

test('the default route opens the shared canvas',async({page})=>{
  await page.goto('/');await expect(page.locator('[data-constellation-workspace]')).toBeVisible();await expect(page.locator('[data-node]')).toHaveCount(6);
});

test('selecting a second form chooses it for rotation without making an arbitrary join',async({page})=>{
  await page.getByRole('button',{name:'Forms',exact:true}).click();
  await node(page,'corner-a').click();await node(page,'corner-b').click();
  expect((await state(page)).mixes).toBe(0);await expect(node(page,'corner-b')).toHaveAttribute('aria-pressed','true');
  const before=(await state(page)).nodes.find(n=>n.id==='corner-b')!;await page.keyboard.press('r');
  const after=await state(page);expect(after.mixes).toBe(0);expect(after.nodes.find(n=>n.id==='corner-b')?.cells).not.toEqual(before.cells);
  await expect(page.locator('[data-goal] svg')).toBeVisible();
  const outline=(await page.locator('[data-goal] svg').boundingBox())!;expect(outline.height).toBeGreaterThan(70);
});

test('a child created beside an edge contact is brought fully into view',async({page})=>{
  await hold(page,node(page,'water'),{x:1330,y:170});await page.mouse.up();
  const before=await state(page),camera=await viewport(page);await blend(page,'soil','water');await expect(node(page,'clay')).toBeInViewport({ratio:1});
  const after=await state(page);for(const id of ['soil','water'])expect(after.nodes.find(n=>n.id===id)).toEqual(before.nodes.find(n=>n.id===id));
  // Showing a new edge discovery needs only a small correction, not a jump
  // that centers it and throws the rest of the working set off the screen.
  const moved=await viewport(page);expect(Math.abs(moved.x-camera.x)*camera.zoom).toBeLessThan(200);expect(Math.abs(moved.y-camera.y)*camera.zoom).toBeLessThan(200);
});

test('keyboard joining uses the actual arranged edges instead of an automatic offset',async({page})=>{
  await page.getByRole('button',{name:'Forms',exact:true}).click();
  await node(page,'bar-a').focus();await page.keyboard.press('Enter');
  for(let i=0;i<8;i++)await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');await page.keyboard.press('ArrowUp');
  expect((await state(page)).mixes).toBe(0);
  await page.keyboard.press('Tab');await expect(node(page,'bar-b')).toBeFocused();await page.keyboard.press('Enter');
  expect((await state(page)).goal?.status).toBe('won');expect((await state(page)).mixes).toBe(1);
});

test('physical contact creates one new concept and keeps both parents at their exact positions',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const before=await state(page);
  await hold(page,node(page,'soil'),node(page,'water'));
  await expect(page.locator('.cv-drag-ghost')).toBeVisible();await expect(node(page,'soil')).toHaveClass(/cv-being-dragged/);
  await expect(node(page,'water')).toHaveClass(/cv-in-contact/);await expect(page.locator('[data-contact-preview]')).toContainText('Clay');
  expect((await state(page)).mixes).toBe(0);await page.screenshot({path:'results/constellation-ui/elements-contact.png'});
  await page.mouse.up();await expect(node(page,'clay')).toBeVisible();const after=await state(page);
  expect(after.nodes).toHaveLength(before.nodes.length+1);expect(after.nodes.find(n=>n.id==='soil')).toEqual(before.nodes.find(n=>n.id==='soil'));expect(after.nodes.find(n=>n.id==='water')).toEqual(before.nodes.find(n=>n.id==='water'));
  expect(after.mixes).toBe(1);await expect(page.locator('[data-node="clay"]')).toHaveCount(1);
  expect((await capture(page)).interactions.map(e=>e.kind)).toEqual(expect.arrayContaining(['drag-start','contact-preview','drop','fusion']));expect(errors).toEqual([]);
  await page.waitForTimeout(850);await page.screenshot({path:'results/constellation-ui/elements-created.png'});
});

test('completed combinations stop glowing and repeating one finds the existing result',async({page})=>{
  await blend(page,'soil','water');await expect(node(page,'clay')).toBeVisible();const before=await state(page);
  await node(page,'soil').hover();await expect(node(page,'water')).not.toHaveClass(/cv-compatible/);await expect(node(page,'water').locator('[data-partner-result]')).toBeEmpty();
  await hold(page,node(page,'soil'),node(page,'water'));await expect(page.locator('[data-contact-preview]')).toContainText('Already connected');await page.mouse.up();
  const after=await state(page);expect(after.nodes).toEqual(before.nodes);expect(after.mixes).toBe(before.mixes);await expect(node(page,'clay')).toHaveCount(1);await expect(node(page,'clay')).toBeFocused();
});

test('Undo changes the arrangement while learned concepts and reload persistence remain',async({page})=>{
  await blend(page,'soil','water');await expect(node(page,'clay')).toBeVisible();const before=await state(page);
  await hold(page,node(page,'clay'),{x:1150,y:650});await page.mouse.up();expect((await state(page)).nodes.find(n=>n.id==='clay')).not.toEqual(before.nodes.find(n=>n.id==='clay'));
  await page.getByRole('button',{name:'Undo last arrangement'}).click();expect((await state(page)).nodes).toEqual(before.nodes);expect((await state(page)).mixes).toBe(1);
  await page.reload();await expect(node(page,'clay')).toBeVisible();expect((await state(page)).nodes).toEqual(before.nodes);expect((await state(page)).mixes).toBe(1);
});

test('background dragging pans and wheel zoom preserves the world point under the pointer',async({page})=>{
  const before=await viewport(page),r=(await page.locator('[data-constellation-workspace]').boundingBox())!;
  const p={x:r.x+r.width*.8,y:r.y+r.height*.8};
  const worldBefore={x:before.x+(p.x-r.x-r.width/2)/before.zoom,y:before.y+(p.y-r.y-r.height/2)/before.zoom};
  await page.mouse.move(p.x,p.y);await page.mouse.wheel(0,-350);await expect.poll(async()=>(await viewport(page)).zoom).toBeGreaterThan(before.zoom);
  const zoomed=await viewport(page);expect(zoomed.x+(p.x-r.x-r.width/2)/zoomed.zoom).toBeCloseTo(worldBefore.x,5);expect(zoomed.y+(p.y-r.y-r.height/2)/zoomed.zoom).toBeCloseTo(worldBefore.y,5);
  const empty={x:r.x+r.width-80,y:r.y+r.height-110};expect(await page.evaluate(p=>!!document.elementFromPoint(p.x,p.y)?.closest('[data-node]'),empty)).toBe(false);
  await page.mouse.move(empty.x,empty.y);await page.mouse.down();await page.mouse.move(empty.x-150,empty.y-30,{steps:12});await page.mouse.up();
  const panned=await viewport(page);expect(panned.x).toBeCloseTo(zoomed.x+150/zoomed.zoom,4);expect(panned.y).toBeCloseTo(zoomed.y+30/zoomed.zoom,4);
  await page.getByRole('button',{name:'Fit all concepts on the canvas'}).click();for(const id of (await state(page)).nodes.map(n=>n.id))await expect(node(page,id)).toBeInViewport({ratio:1});
});

test('switching disciplines preserves each board and reload opens the selected board',async({page})=>{
  await blend(page,'soil','water');const elements=await state(page);
  await page.getByRole('button',{name:'Ideas',exact:true}).click();await expect(node(page,'ai')).toBeVisible();await blend(page,'ai','mathematics');await expect(node(page,'proof-search')).toBeVisible();const ideas=await state(page);
  await page.getByRole('button',{name:'Elements',exact:true}).click();expect(await state(page)).toEqual(elements);
  await page.getByRole('button',{name:'Ideas',exact:true}).click();expect(await state(page)).toEqual(ideas);
  // An explicit mode URL intentionally wins over the saved mode; the plain route resumes it.
  await page.goto('/?experiment=constellation');await expect(node(page,'proof-search')).toBeVisible();expect(await state(page)).toEqual(ideas);
  await page.waitForTimeout(850);await page.screenshot({path:'results/constellation-ui/ideas-created.png'});
});

test('Forms snaps literal edges, retains parents and advances the goal on the same board',async({page})=>{
  await page.getByRole('button',{name:'Forms',exact:true}).click();const before=await state(page);
  await expect(page.locator('[data-goal]')).toContainText('An elbow');await expect(page.locator('[data-action="next-goal"]')).toHaveCount(0);
  await holdForm(page,'bar-a','bar-b',{x:0,y:-2});await expect(page.locator('[data-contact-preview]')).toBeVisible();await expect(node(page,'bar-b')).toHaveClass(/cv-in-contact/);
  await page.screenshot({path:'results/constellation-ui/forms-contact.png'});await page.mouse.up();
  await expect.poll(async()=>(await state(page)).goal?.status).toBe('won');const won=await state(page);
  expect(won.nodes).toHaveLength(5);expect(won.nodes.find(n=>n.id==='bar-a')).toEqual(before.nodes.find(n=>n.id==='bar-a'));expect(won.nodes.find(n=>n.id==='bar-b')).toEqual(before.nodes.find(n=>n.id==='bar-b'));
  const child=won.nodes.find(n=>!before.nodes.some(old=>old.id===n.id))!;expect(child.cells).toHaveLength(4);expect(new Set(child.cellColors).size).toBe(2);
  await expect(page.locator('[data-action="next-goal"]')).toContainText('The key');await page.locator('[data-action="next-goal"]').click();const next=await state(page);
  expect(next.goal?.id).toBe('the-key');expect(next.nodes).toEqual(won.nodes);expect(next.mixes).toBe(won.mixes);await expect(page.locator('[data-action="next-goal"]')).toHaveCount(0);
  await page.waitForTimeout(850);await page.screenshot({path:'results/constellation-ui/forms-next-goal.png'});
});

test('a held form rotates during dragging and uses its changed geometry at contact',async({page})=>{
  await page.getByRole('button',{name:'Forms',exact:true}).click();const start=await center(node(page,'bar-a'));
  await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x+50,start.y+55,{steps:8});
  await expect(page.locator('.cv-drag-ghost')).toBeVisible();await page.keyboard.press('r');
  const turned=(await state(page)).nodes.find(n=>n.id==='bar-a')!;expect(turned.cells).toEqual([[0,0],[1,0]]);
  const target=await center(node(page,'bar-b')),z=(await viewport(page)).zoom;
  await page.mouse.move(target.x+26*z,target.y+26*z,{steps:14});await expect(page.locator('[data-contact-preview]')).toBeVisible();await page.mouse.up();
  const after=await state(page);expect(after.mixes).toBe(1);const child=after.nodes.find(n=>n.id!=='bar-a'&&n.id!=='bar-b'&&n.cells?.length===4)!;
  expect(child).toBeDefined();expect(Math.max(...child.cells!.map(c=>c[0]))).toBe(2);expect(Math.max(...child.cells!.map(c=>c[1]))).toBe(1);
  expect((await capture(page)).interactions.some(e=>e.kind==='rotate'&&e.whileDragging)).toBe(true);
});

test('mobile touch physically combines concepts on the shared canvas without overflow',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),page=await context.newPage();
  await page.goto('http://127.0.0.1:5173/?experiment=constellation');await expect(node(page,'soil')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(844);
  const labelWorldSize=await node(page,'soil').locator('.cv-node-name').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));expect(labelWorldSize*(await viewport(page)).zoom).toBeGreaterThanOrEqual(11);
  const a=await center(node(page,'soil')),b=await center(node(page,'water')),touch=await context.newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});
  for(let i=1;i<=16;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/16,y:a.y+(b.y-a.y)*i/16}]});
  await expect(page.locator('[data-contact-preview]')).toContainText('Clay');await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(node(page,'clay')).toBeVisible();expect((await state(page)).nodes).toHaveLength(7);expect((await capture(page)).interactions.some(e=>e.kind==='drag-start'&&e.pointerType==='touch')).toBe(true);
  await page.getByRole('button',{name:'Fit all concepts on the canvas'}).click();for(const id of (await state(page)).nodes.map(n=>n.id))await expect(node(page,id)).toBeInViewport({ratio:1});
  await page.waitForTimeout(850);await page.screenshot({path:'results/constellation-ui/mobile-touch.png'});await context.close();
});
