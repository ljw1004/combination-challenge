import {test, expect, type Page} from '@playwright/test';
import {openDebugPanel} from './debug-helpers.ts';

const manuscript = `# Icon workshop
## Shelter
![room](assets/background.svg)

A small shelter.

**Goals**
- Fit the shelter -- House[Window,Mat]

**Items**
- House (compound)
  - icon: ![house](assets/house.svg)
  - unnamed slot: accepts Window, icon: ![fitted window](assets/house-window.svg)
  - unnamed slot: accepts Mat, icon: ![fitted mat](assets/house-mat.svg)
- Window
  - icon: ![window](assets/window.svg) (circular)
- Mat
  - icon: ![mat](assets/mat.svg)
- Air
  - icon: ![air](assets/air.svg) (circular)
`;

async function openFixture(page: Page, text = manuscript) {
  await page.route('**/icon-fixture/story.md', route => route.fulfill({contentType: 'text/markdown', body: text}));
  await page.route('**/icon-fixture/assets/*.svg', route => {
    const filename = new URL(route.request().url()).pathname.split('/').at(-1)!;
    if (filename === 'missing.svg') return route.fulfill({status: 404, body: 'Missing artwork'});
    const [width, height] = filename === 'background.svg' ? [390, 844] : filename.startsWith('location') ? [384, 320] : filename === 'house-large.svg' ? [560, 400] : filename.startsWith('house') ? [416, 288] : filename === 'mat.svg' ? [160, 224] : [224, 224];
    const shape = filename==='location-empty.svg' ? '' : filename.includes('-window') ? '<rect x="270" y="90" width="70" height="70" fill="#8ab8b0"/>' : filename.includes('-mat') ? '<rect x="50" y="230" width="170" height="40" fill="#79764d"/>' : `<rect width="${width}" height="${height}" rx="24" fill="#b8ad80"/>`;
    return route.fulfill({contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${shape}</svg>`});
  });
  await page.goto('/combinations.html?story=icon-fixture');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', {name: 'Begin', exact: true}).click();
}

test('icons use intrinsic quarter sizes, partner name badges and circular selection outlines', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), window = page.locator('[data-item="name:Window"]'), mat = page.locator('[data-item="name:Mat"]');
  const houseBox = (await house.boundingBox())!, windowBox = (await window.boundingBox())!, matBox = (await mat.boundingBox())!;
  expect([houseBox.width, houseBox.height]).toEqual([104, 72]);
  expect([windowBox.width, windowBox.height]).toEqual([56, 56]);
  expect([matBox.width, matBox.height]).toEqual([40, 56]);
  await expect(house.locator('.icon-name')).toBeHidden();
  await expect(window.locator('.icon-name')).toBeHidden();
  await window.hover();
  await expect(window.locator('.icon-name')).toHaveText('Window');
  await expect(window.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(mat.locator('.icon-name')).toBeHidden();
  expect(await window.evaluate(element => ({style: getComputedStyle(element, '::after').borderStyle, radius: getComputedStyle(element, '::after').borderRadius}))).toEqual({style: 'dotted', radius: '50%'});
  expect(await house.evaluate(element => getComputedStyle(element, '::after').borderRadius)).toBe('8px');
  await window.click(); await page.mouse.move(5, 600);
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeHidden({timeout: 1500});
  await house.focus();
  await expect(house.locator('.icon-name')).toBeVisible();
  await expect(window.locator('.icon-name')).toBeVisible();
});

test('installing compound icons retains base and fitted nodes, alignment and only the base name', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), base = await house.locator('.item-icon').elementHandle();
  const before = (await house.boundingBox())!;
  await house.dragTo(page.locator('[data-item="name:Window"]'));
  await expect(house.locator('.slot-icon')).toHaveCount(1);
  const windowOverlay = await house.locator('[data-icon-slot="name:Window"]').elementHandle();
  await page.locator('[data-item="name:Mat"]').dragTo(house);
  await expect(house.locator('.slot-icon')).toHaveCount(2);
  expect(await base!.evaluate(image => image.isConnected)).toBe(true);
  expect(await windowOverlay!.evaluate(image => image.isConnected)).toBe(true);
  await house.hover();
  await expect(house.locator('.icon-name')).toHaveText('House');
  await expect(house.locator('.slot')).toHaveCount(0);
  const layers = await house.locator('.icon-stack img').evaluateAll(images => images.map(image => {
    const rect = image.getBoundingClientRect(); return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
  }));
  expect(layers).toEqual(Array(3).fill({x: before.x, y: before.y, width: 104, height: 72}));
  await page.reload();
  await expect(house.locator('.slot-icon')).toHaveCount(2);
  expect(await house.boundingBox()).toEqual(before);
});

test('rectangular icon dragging preserves the pickup point and narrow resizing preserves placements', async ({page}) => {
  await openFixture(page);
  const house = page.locator('[data-item="name:House"]'), before = (await house.boundingBox())!;
  await page.mouse.move(before.x + 7, before.y + 11); await page.mouse.down();
  await page.mouse.move(230, 520, {steps: 6}); await page.mouse.up();
  const moved = (await house.boundingBox())!;
  expect(moved.x).toBeCloseTo(223, 1); expect(moved.y).toBeCloseTo(509, 1);
  await page.setViewportSize({width: 320, height: 740});
  await expect.poll(async () => (await house.boundingBox())!.width).toBeCloseTo(104 * 320 / 390, 1);
  const narrow = (await house.boundingBox())!;
  expect(narrow.width).toBeCloseTo(104 * 320 / 390, 1);
  expect(narrow.height).toBeCloseTo(72 * 320 / 390, 1);
  expect(narrow.x).toBeCloseTo(moved.x * 320 / 390, 1);
  expect(narrow.y).toBeCloseTo(moved.y * 320 / 390, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for(const icons of [true,false])test(`quick mouse releases place ${icons?'icons':'text cards'} even before a drag move event arrives`,async({page})=>{
  const described=manuscript.replace('- Mat\n','\n  A plain four-pane window.\n\n- Mat\n');
  await openFixture(page,icons?described:described.replace(/^  - icon:.*\n/gm,'').replace(/, icon:.*$/gm,''));
  const window=page.locator('[data-item="name:Window"]'),house=page.locator('[data-item="name:House"]'),cdp=await page.context().newCDPSession(page);
  async function quickRelease(x:number,y:number,smallMove=false){
    const before=(await window.boundingBox())!,start={x:before.x+7,y:before.y+11};
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',...start,button:'left',buttons:1,clickCount:1});
    // Exercise both no move report and a final move report still inside click tolerance.
    if(smallMove)await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:start.x+2,y:start.y+1,button:'left',buttons:1});
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',buttons:0,clickCount:1});
  }
  for(const [x,y,smallMove] of [[180,500,false],[220,600,true]] as const){
    // A preceding click must not turn the quick drag into a double-click reading.
    await window.click();await quickRelease(x,y,smallMove);
    await expect(page.locator('dialog')).toHaveCount(0);
    const placed=(await window.boundingBox())!;
    expect(placed.x).toBeCloseTo(x-7,1);expect(placed.y).toBeCloseTo(y-11,1);
    await page.reload();await expect(window).toBeVisible();expect(await window.boundingBox()).toEqual(placed);
  }
  await window.dblclick();await expect(page.locator('dialog .reading-text')).toHaveText('A plain four-pane window.');
  await page.getByRole('button',{name:'Close',exact:true}).click();
  const target=(await house.boundingBox())!;
  await quickRelease(target.x+target.width/2,target.y+target.height/2);
  await expect(window).toHaveCount(0);
  await expect(house.locator(icons?'.slot-icon':'.slot.filled')).toHaveCount(1);
});

test('right-edge drops use each icon width and match the drag preview through reload', async ({page}) => {
  await openFixture(page);
  for(const [name,y] of [['House',440],['Mat',560],['Air',680]] as const){
    const item=page.locator(`[data-item="name:${name}"]`),before=(await item.boundingBox())!;
    await page.mouse.move(before.x+7,before.y+11);await page.mouse.down();
    await page.mouse.move(388,y,{steps:6});
    const preview=(await item.boundingBox())!;
    expect(preview.x+preview.width).toBeCloseTo(390,1);
    await page.mouse.up();expect(await item.boundingBox()).toEqual(preview);
    await page.reload();expect(await item.boundingBox()).toEqual(preview);
  }
});

for(const icons of [true,false])test(`creation placement uses measured ${icons?'icons':'text cards'} and the receiver's computed disposition`,async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const resultName='A much larger finished construction';
  for(const kind of ['preserve','transform','consume','protected'] as const){
    const manuscript=`# Result placement
## Work
![room](assets/background.svg)
Make the construction.
**Goals**
- Make it -- ${resultName}
**Items**
- Input
  - icon: ![input](assets/window.svg)
- Receiver
  - icon: ![receiver](assets/mat.svg)
- ${resultName}
  - icon: ![result](assets/house-large.svg)
**Combinations**
- Input [transform] + Receiver [${kind==='protected'?'transform':kind}] -> ${resultName}
${kind==='protected'?`## Later
![room](assets/background.svg)
**Goals**
- Keep working -- Further work
**Items**
- Tool
  - icon: ![tool](assets/air.svg)
- Further work
  - icon: ![further work](assets/air.svg)
**Combinations**
- Receiver [preserve] + Tool [preserve] -> Further work`:''}`;
    await page.setViewportSize({width:kind==='consume'?320:390,height:844});
    if(kind!=='preserve')await page.evaluate(()=>localStorage.clear());
    await openFixture(page,icons?manuscript:manuscript.replace(/^  - icon:.*\n/gm,''));
    const input=page.locator('[data-item="name:Input"]'),receiver=page.locator('[data-item="name:Receiver"]'),result=page.locator(`[data-item="name:${resultName}"]`);
    const board=(await page.locator('.chapter-panel').boundingBox())!,scale=board.width/390,initial=(await receiver.boundingBox())!;
    await page.mouse.move(initial.x+5,initial.y+7);await page.mouse.down();
    await page.mouse.move(kind==='consume'?board.x+board.width-2:board.x+300*scale,kind==='consume'?board.y+board.height-2:board.y+530*scale,{steps:5});await page.mouse.up();
    const target=(await receiver.boundingBox())!;
    await input.dragTo(receiver);await expect(result).toBeVisible();await expect(input).toHaveCount(0);
    const created=(await result.boundingBox())!,survives=kind==='preserve'||kind==='protected';
    if(survives){
      expect(await receiver.boundingBox()).toEqual(target);
      expect(created.x+created.width<=target.x+.1||created.x>=target.x+target.width-.1||created.y+created.height<=target.y+.1||created.y>=target.y+target.height-.1).toBe(true);
      expect(Math.hypot(created.x+created.width/2-target.x-target.width/2,created.y+created.height/2-target.y-target.height/2)).toBeLessThan(200*scale);
    }else{
      await expect(receiver).toHaveCount(0);
      expect(created.x).toBeCloseTo(Math.max(board.x,Math.min(board.x+board.width-created.width,target.x+(target.width-created.width)/2)),0);
      expect(created.y).toBeCloseTo(Math.max(board.y,Math.min(board.y+board.height-created.height,target.y+(target.height-created.height)/2)),0);
    }
    await page.reload();await expect(result).toBeVisible();expect(await result.boundingBox()).toEqual(created);
  }
});

test('failed icon artwork falls back to readable text and usable compound slots', async ({page}) => {
  await openFixture(page, manuscript.replace('assets/house.svg', 'assets/missing.svg'));
  const house = page.locator('[data-item="name:House"]');
  await expect(house).toHaveClass(/text-thing/);
  await expect(house.locator('.item-label')).toHaveText('House');
  await page.locator('[data-item="name:Window"]').dragTo(house);
  await expect(house.locator('.slot.filled')).toHaveText('Window');
  await expect(page.locator('[data-item="name:Mat"]')).toHaveClass(/icon-thing/);
});

test('touches use the expanded small-icon target and cancellation keeps the original placement', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 320, height: 740}, hasTouch: true, isMobile: true});
  const page = await context.newPage();
  await openFixture(page);
  const mat = page.locator('[data-item="name:Mat"]'), house = page.locator('[data-item="name:House"]'), before = (await mat.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: before.x - 3, y: before.y + before.height / 2}]});
  await expect(mat.locator('.icon-name')).toBeVisible();
  await expect(house.locator('.icon-name')).toBeVisible();
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 180, y: 520}]});
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
  expect(await mat.boundingBox()).toEqual(before);
  await expect(house.locator('.slot-icon')).toHaveCount(0);
  await expect(mat.locator('.icon-name')).toBeHidden();
  await cdp.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:before.x+5,y:before.y+10}]});
  await cdp.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:318,y:520}]});
  const preview=(await mat.boundingBox())!;
  expect(preview.x+preview.width).toBeCloseTo(320,1);
  await cdp.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
  expect(await mat.boundingBox()).toEqual(preview);
  await page.reload();expect(await mat.boundingBox()).toEqual(preview);
  await context.close();
});

test('described icons retain the pressed book cue and hold-to-drag without opening a reading', async ({page}) => {
  const described = manuscript.replace('- Mat\n', '\n  A plain four-pane window.\n\n- Mat\n');
  await openFixture(page, described);
  const window = page.locator('[data-item="name:Window"]'), book = window.locator('.reading-indicator');
  await window.hover();
  await expect(book).toBeHidden();
  const before = (await window.boundingBox())!;
  await page.mouse.move(before.x + 8, before.y + 12); await page.mouse.down();
  await expect(book).toBeVisible();
  await page.waitForTimeout(650);
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.mouse.move(230, 520, {steps: 6}); await page.mouse.up();
  const after = (await window.boundingBox())!;
  expect(after.x).toBeCloseTo(222, 1); expect(after.y).toBeCloseTo(508, 1);
  await expect(book).toBeVisible();
  await page.mouse.move(5, 700);
  await expect(book).toBeHidden();
  await window.dblclick();
  await expect(page.locator('dialog .reading-text')).toHaveText('A plain four-pane window.');
  await expect(page.locator('dialog .open-book')).toHaveCount(0);
});

test('live icon edits replace artwork sizes without replacing the image node or moving the item', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 800});
  await openFixture(page); await openDebugPanel(page);
  const house = page.locator('[data-item="name:House"]'), before = (await house.boundingBox())!, image = await house.locator('.item-icon').elementHandle();
  await page.getByRole('textbox', {name: 'Story Markdown'}).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(manuscript.replace('assets/house.svg', 'assets/house-large.svg'));
  await expect(house.locator('.item-icon')).toHaveAttribute('src', /house-large\.svg$/);
  await expect.poll(async () => (await house.boundingBox())!.width).toBe(140);
  expect(await image!.evaluate(element => element.isConnected)).toBe(true);
  const after = (await house.boundingBox())!;
  expect(after.x).toBe(before.x); expect(after.y).toBe(before.y); expect(after.height).toBe(100);
});

const hotspotManuscript = `# Fixed location
## Shore
![shore](assets/background.svg)

Prepare the stone, then bring it to the landing.

**Goals**
- Make a marker -- Marker
- next: Place the marker -- Marker @ Landing

**Hotspots**
- Landing (at 77%, 65%)
  - icon: ![landing](assets/location.svg)

**Items**
- Stone

**Combinations**
- Stone [transform] @ Landing -> Marker
`;

for(const transparent of [false,true])test(`${transparent?'fully transparent':'painted'} hotspot icons keep their centre, accept operations and placements, and retain their image`, async ({page}) => {
  await openFixture(page, transparent?hotspotManuscript.replace('location.svg','location-empty.svg'):hotspotManuscript);
  const hotspot=page.locator('[data-hotspot="name:Landing"]'), panel=page.locator('.chapter-panel');
  const before=(await hotspot.boundingBox())!, board=(await panel.boundingBox())!, image=await hotspot.locator('img').elementHandle();
  expect([before.width,before.height]).toEqual([96,80]);
  expect(before.x+before.width/2-board.x).toBeCloseTo(390*.77,1);
  expect(before.y+before.height/2-board.y).toBeCloseTo(844*.65,1);
  await page.locator('[data-item="name:Stone"]').hover();
  await expect(hotspot).toHaveClass(/possible/);
  await expect(hotspot.locator('.icon-name')).toBeVisible();
  await page.locator('[data-item="name:Stone"]').dragTo(hotspot);
  const marker=page.locator('[data-item="name:Marker"]');
  await expect(marker).toBeVisible();
  expect(await image!.evaluate(node=>node.isConnected)).toBe(true);
  // A created result may occupy its receiving location already; ordinary movement remains reversible.
  const mb=(await marker.boundingBox())!;
  await page.mouse.move(mb.x+mb.width/2,mb.y+mb.height/2);await page.mouse.down();await page.mouse.move(120,420,{steps:5});await page.mouse.up();
  await marker.dragTo(hotspot);
  expect(await hotspot.boundingBox()).toEqual(before);
  await page.setViewportSize({width:320,height:740});
  await expect.poll(async()=>(await hotspot.boundingBox())!.width).toBeCloseTo(96*320/390,1);
  expect(await image!.evaluate(node=>node.isConnected)).toBe(true);
});

test('missing hotspot artwork keeps a named usable fixed target', async ({page}) => {
  await openFixture(page,hotspotManuscript.replace('assets/location.svg','assets/missing.svg'));
  const hotspot=page.locator('[data-hotspot="name:Landing"]');
  await expect(hotspot).not.toHaveClass(/hotspot-icon/);
  await expect(hotspot).toHaveText('Landing');
  await page.locator('[data-item="name:Stone"]').dragTo(hotspot);
  await expect(page.locator('[data-item="name:Marker"]')).toBeVisible();
});

const cellarManuscript=`# Baking
## Cellar
![room](assets/background.svg)
Let the dough rise in the warm cellar.
**Goals**
- Let the dough rise -- Risen dough
**Hotspots**
- Warm cellar (at 75%, 65%)
  - icon: ![cellar](assets/location.svg)
**Items**
- Dough
  - icon: ![dough](assets/dough.svg) (at 20%, 25%)
- Wild starter
  - icon: ![starter](assets/starter.svg) (at 65%, 25%)
- Salt
  - icon: ![salt](assets/salt.svg) (at 20%, 45%)
- Risen dough
  - icon: ![risen dough](assets/risen.svg)
**Combinations**
- Wild starter [preserve] + Dough [transform] @ Warm cellar -> Risen dough
`;

for(const icons of [true,false])test(`${icons?'icon':'text'} hotspot hints connect both ingredients before placement and keep context required`,async({page})=>{
  await openFixture(page,icons?cellarManuscript:cellarManuscript.replace(/^  - icon:.*\n/gm,''));
  const dough=page.locator('[data-item="name:Dough"]'),starter=page.locator('[data-item="name:Wild starter"]'),cellar=page.locator('[data-hotspot="name:Warm cellar"]'),salt=page.locator('[data-item="name:Salt"]'),risen=page.locator('[data-item="name:Risen dough"]');
  for(const [selected,partner] of [[dough,starter],[starter,dough]]){
    await selected.hover();await expect(cellar).toHaveClass(/possible/);await expect(partner).not.toHaveClass(/possible/);await expect(salt).not.toHaveClass(/possible/);
    if(icons)await expect(cellar.locator('.icon-name')).toBeVisible();
  }
  await cellar.hover();await expect(dough).toHaveClass(/possible/);await expect(starter).toHaveClass(/possible/);
  if(icons){await expect(dough.locator('.icon-name')).toBeVisible();await expect(starter.locator('.icon-name')).toBeVisible();}
  await page.mouse.move(5,700);await expect(dough).not.toHaveClass(/possible/);
  await cellar.focus();await expect(dough).toHaveClass(/possible/);await expect(starter).toHaveClass(/possible/);
  await starter.dragTo(dough);await expect(risen).toHaveCount(0);
  await dough.dragTo(cellar);await expect(risen).toHaveCount(0);
  await expect(cellar).not.toHaveClass(/possible/);
  await expect(dough).not.toHaveClass(/pressed/);
  await page.mouse.move(5,700);
  await dough.hover();await expect(starter).toHaveClass(/possible/);
  const placed=(await dough.boundingBox())!;
  await page.mouse.move(placed.x+5,placed.y+5);await page.mouse.down();await page.mouse.move(placed.x-20,placed.y+5);
  await expect(starter).not.toHaveClass(/possible/);
  await page.mouse.move(placed.x+5,placed.y+5);await page.mouse.up();
  await starter.dragTo(dough);await expect(risen).toBeVisible();
});

test('placing Dough in the cellar prepares a later combination before Wild starter exists',async({page})=>{
  const preparation=cellarManuscript.replace(' (at 65%, 25%)','').replace('**Items**',`**Items**
- Flour
  - icon: ![flour](assets/flour.svg) (at 65%, 25%)
- Air
  - icon: ![air](assets/air.svg) (at 65%, 45%)`).replace('**Combinations**','**Combinations**\n- Flour [preserve] + Air [preserve] -> Wild starter');
  await openFixture(page,preparation);
  const dough=page.locator('[data-item="name:Dough"]'),flour=page.locator('[data-item="name:Flour"]'),starter=page.locator('[data-item="name:Wild starter"]'),cellar=page.locator('[data-hotspot="name:Warm cellar"]');
  await expect(starter).toHaveCount(0);
  await cellar.hover();await expect(dough).toHaveClass(/possible/);await expect(flour).not.toHaveClass(/possible/);
  await dough.hover();await expect(cellar).toHaveClass(/possible/);
  await dough.dragTo(cellar);await expect(cellar).not.toHaveClass(/possible/);await expect(starter).toHaveCount(0);
  await flour.dragTo(page.locator('[data-item="name:Air"]'));
  await expect(starter).toBeVisible();
  await expect(flour).not.toHaveClass(/pressed/);
  await starter.hover();await expect(dough).toHaveClass(/possible/);
  await starter.dragTo(dough);await expect(page.locator('[data-item="name:Risen dough"]')).toBeVisible();
});

test('touching a hotspot shows ingredient hints through release and clears them on cancellation',async({browser})=>{
  const context=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true});
  const page=await context.newPage();await openFixture(page,cellarManuscript);
  const cellar=page.locator('[data-hotspot="name:Warm cellar"]'),dough=page.locator('[data-item="name:Dough"]'),starter=page.locator('[data-item="name:Wild starter"]'),before=(await cellar.boundingBox())!;
  const cdp=await context.newCDPSession(page),point={x:before.x+before.width/2,y:before.y+before.height/2};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
  await expect(dough).toHaveClass(/possible/);await expect(starter).toHaveClass(/possible/);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(dough).toHaveClass(/possible/);await expect(dough).not.toHaveClass(/possible/);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
  await expect(dough).toHaveClass(/possible/);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  await expect(dough).not.toHaveClass(/possible/);await expect(starter).not.toHaveClass(/possible/);
  expect(await cellar.boundingBox()).toEqual(before);
  await context.close();
});

const positionedManuscript = `# Positioned workshop
## First
![room](assets/background.svg)

Make steam.

**Goals**
- Make Steam -- Steam
**Items**
- Water
  - icon: ![water](assets/water.svg) (circular) (at 90%, 20%)
- Fire
  - icon: ![fire](assets/fire.svg) (at 25%, 70%)
- Air
  - icon: ![air](assets/air.svg)
- Steam
  - icon: ![steam](assets/steam.svg)
**Combinations**
- Water [preserve] + Fire [preserve] -> Steam
## Later
![room](assets/background.svg)

Make a cloud.

**Goals**
- Make Cloud -- Cloud
**Items**
- Wind
  - icon: ![wind](assets/wind.svg) (at 80%, 55%)
- Cloud
  - icon: ![cloud](assets/cloud.svg)
**Combinations**
- Steam [transform] + Water [preserve] -> Cloud
`;

test('authored centres apply on first arrival and survive movement, reload and narrow resizing', async ({page}) => {
  await openFixture(page,positionedManuscript);
  const water=page.locator('[data-item="name:Water"]'),fire=page.locator('[data-item="name:Fire"]');
  const initial=(await water.boundingBox())!;
  expect(initial.x+initial.width/2).toBeCloseTo(390*.9,1);
  expect(initial.y+initial.height/2).toBeCloseTo(844*.2,1);
  await page.reload(); expect(await water.boundingBox()).toEqual(initial);
  await page.setViewportSize({width:320,height:740});
  await expect.poll(async()=>(await water.boundingBox())!.x).toBeCloseTo(initial.x*320/390,1);
  await page.setViewportSize({width:390,height:844});
  await water.hover();
  const name=(await water.locator('.icon-name').boundingBox())!,icon=(await water.boundingBox())!;
  expect(name.y+name.height).toBeLessThanOrEqual(icon.y+.1);
  await page.mouse.move(icon.x+28,icon.y+28);await page.mouse.down();await page.mouse.move(180,440,{steps:5});await page.mouse.up();
  const moved=(await water.boundingBox())!;await page.reload();expect(await water.boundingBox()).toEqual(moved);
  await water.dragTo(fire);
  await page.getByRole('button',{name:'Continue story'}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const panel=page.locator('.chapter-panel[data-chapter="1"]'),board=(await panel.boundingBox())!,wind=(await panel.locator('[data-item="name:Wind"]').boundingBox())!;
  expect(wind.x+wind.width/2-board.x).toBeCloseTo(390*.8,1);
  expect(wind.y+wind.height/2-board.y).toBeCloseTo(844*.55,1);
  const carried=(await panel.locator('[data-item="name:Water"]').boundingBox())!;
  expect(carried.x-board.x).toBeCloseTo(moved.x,1);
  expect(carried.y-board.y).toBeCloseTo(moved.y,1);
});

test('creation names stay above new icons for 1.5 seconds and then fade, without replay on redraw', async ({page}) => {
  await openFixture(page,positionedManuscript);
  await page.locator('[data-item="name:Water"]').dragTo(page.locator('[data-item="name:Fire"]'));
  await page.mouse.move(388,10);
  const item=page.locator('[data-item="name:Steam"]'),name=item.locator('.icon-name');
  await expect(name).toBeVisible();
  const animation=await name.evaluateHandle(el=>el.getAnimations()[0]);
  await page.setViewportSize({width:320,height:740});
  expect(await animation.evaluate(a=>a.effect instanceof KeyframeEffect && a.effect.target?.getAnimations().includes(a))).toBe(true);
  await page.waitForFunction(()=>{const el=document.querySelector('[data-item="name:Steam"] .icon-name');return Number(el?.getAnimations()[0]?.currentTime)>=1300;});
  expect(await name.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  const nameBox=(await name.boundingBox())!,itemBox=(await item.boundingBox())!;
  expect(nameBox.y+nameBox.height).toBeLessThanOrEqual(itemBox.y+.1);
  await expect.poll(async()=>name.evaluate(el=>{const opacity=+getComputedStyle(el).opacity;return opacity>0&&opacity<1;}),{intervals:[16],timeout:1000}).toBe(true);
  await expect(name).toBeHidden({timeout:1000});
  await item.hover();await expect(name).toBeVisible();
});

test('main catalogue opens the illustrated Elements story with supplies placed in its landscape', async ({page}) => {
  await page.goto('/');
  const link=page.locator('[data-story="elements-icons"]');
  await expect(link).toHaveText(/Elements - Icons/);await link.click();
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  for(const [name,x,y] of [['Earth',28,53],['Water',54,24],['Air',55,7],['Fire',75,36]] as const){
    const box=(await page.locator(`[data-item="name:${name}"]`).boundingBox())!;
    expect(box.x+box.width/2).toBeCloseTo(390*x/100,1);
    expect(box.y+box.height/2).toBeCloseTo(844*y/100,1);
  }
});

test('Elements Icons carries exact placements into chapter two when no primitives arrive', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/combinations.html?story=elements-icons');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const item=(name:string)=>page.locator(`[data-item="name:${name}"]`);
  const fire=(await item('Fire').boundingBox())!;
  await page.mouse.move(fire.x+8,fire.y+10);await page.mouse.down();
  await page.mouse.move(318,510,{steps:6});await page.mouse.up();
  await item('Earth').dragTo(item('Fire'));
  await expect(item('Stone')).toBeVisible();
  expect(await item('Stone').evaluate(el=>(el as HTMLElement).offsetLeft)).toBeGreaterThan(300);
  await item('Earth').dragTo(item('Water'));
  await item('Clay').dragTo(item('Fire'));
  await expect(item('Brick')).toBeVisible();
  const placements=()=>page.locator('.thing').evaluateAll(nodes=>Object.fromEntries(nodes.map(node=>{const el=node as HTMLElement;return[el.dataset.item,{x:el.offsetLeft,y:el.offsetTop}];})));
  const before=await placements();
  expect(before['name:Fire']).toEqual({x:310,y:500});
  await page.getByRole('button',{name:'Continue story'}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  await expect(page.locator('.chapter-panel[data-chapter="1"] [data-item="name:Fire"]')).toBeVisible();
  expect(await placements()).toEqual(before);
  await page.reload();await expect.poll(placements).toEqual(before);
});
