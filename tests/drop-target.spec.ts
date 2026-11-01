import {test, expect, type Page, type Locator} from '@playwright/test';

async function openFixture(page:Page,icons=true,station=false,circular=false) {
  const text=`# Drop workshop
## Work
![room](room.svg)
Arrange and combine.
**Goals**
- Make X -- X
${station?'**Hotspots**\n- Oven (at 70%, 60%)\n  - icon: ![Oven](station.svg)'+(circular?' (circular)':''):''}
**Items**
${['A','B','C','Blocker'].map((name,i)=>`- ${name}${icons?`\n  - icon: ![${name}](tile.svg) (at ${15+i*22}%, 20%)`:''}`).join('\n')}
- X
- Y
**Combinations**
${station?'- A [transform] @ Oven -> X':'- A [transform] + B [preserve] -> X\n- A [transform] + C [preserve] -> Y'}
`;
  await page.route('**/drop-fixture/story.md',route=>route.fulfill({contentType:'text/markdown',body:text}));
  await page.route('**/drop-fixture/*.svg',route=>{
    const size=route.request().url().endsWith('station.svg')?320:224;
    return route.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#c3ab81"/></svg>`});
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/combinations.html?story=drop-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
}
const item=(page:Page,name:string)=>page.locator(`[data-item="name:${name}"]`);
async function pickup(page:Page,tile:Locator) {
  const box=(await tile.boundingBox())!;
  await page.mouse.move(box.x+7,box.y+11);await page.mouse.down();
}
async function place(page:Page,tile:Locator,x:number,y:number) {
  await pickup(page,tile);await page.mouse.move(x+7,y+11);await page.mouse.up();
}

for(const icons of [false,true])for(const mode of ['overlap','cursor','stacking'] as const)test(`${icons?'icon':'text'} drops choose by compatibility, cursor and stacking (${mode})`,async({page})=>{
  await openFixture(page,icons);
  const a=item(page,'A'),b=item(page,'B'),c=item(page,'C'),blocker=item(page,'Blocker');
  await place(page,a,20,650);
  await place(page,b,100,400);
  const width=(await b.boundingBox())!.width;
  await place(page,c,100+width/2,400);
  await place(page,blocker,65,400); // The frontmost incompatible target must not block either recipe.
  const pointerX=mode==='overlap'?90:mode==='cursor'?110:105+width/2;
  await pickup(page,a);await page.mouse.move(pointerX,415);
  const winner=mode==='cursor'?b:c,other=mode==='cursor'?c:b;
  await expect(winner).toHaveClass(/will-create/);await expect(other).not.toHaveClass(/will-create/);
  await expect(blocker).not.toHaveClass(/will-create/);
  await page.mouse.up();
  await expect(item(page,mode==='cursor'?'X':'Y')).toBeVisible();
  await expect(item(page,mode==='cursor'?'Y':'X')).toHaveCount(0);
});

for(const circular of [false,true])test(`station overlap respects its ${circular?'circle':'rectangle'} and matches release`,async({page})=>{
  await openFixture(page,true,true,circular);
  const a=item(page,'A'),oven=page.locator('[data-hotspot="name:Oven"]');
  const target=(await oven.boundingBox())!,source=(await a.boundingBox())!;
  // Only a 4px square in the station's bounding corner overlaps A.
  await pickup(page,a);
  await page.mouse.move(target.x+4-source.width+7,target.y+4-source.height+11);
  if(circular)await expect(oven).not.toHaveClass(/will-create/);else await expect(oven).toHaveClass(/will-create/);
  const preview=await a.boundingBox();await page.mouse.up();
  if(circular){
    expect(await a.boundingBox()).toEqual(preview);await expect(item(page,'X')).toHaveCount(0);
    await pickup(page,a);await page.mouse.move(target.x-source.width+15,target.y+target.height/2);
    await expect(oven).toHaveClass(/will-create/);await page.mouse.up();
  }
  await expect(item(page,'X')).toBeVisible();
});

test('hovering another item replaces release feedback immediately and survives its former deadline',async({page})=>{
  await page.clock.install();await openFixture(page);
  const a=item(page,'A'),b=item(page,'B'),c=item(page,'C');
  await a.click();await b.hover();
  expect(await b.evaluate(el=>el.classList.contains('pressed'))).toBe(true);
  await expect(c).not.toHaveClass(/possible/);
  await page.clock.runFor(450);
  await expect(b).toHaveClass(/pressed/);await expect(a).toHaveClass(/possible/);
  await c.hover();await expect(c).toHaveClass(/pressed/);
});

test('rapid releases use their final coordinates, retain capture through tile updates, and save the drop',async({page})=>{
  await openFixture(page);
  const blocker=item(page,'Blocker'),cdp=await page.context().newCDPSession(page);
  for(const move of [false,true]){
    const before=(await blocker.boundingBox())!,start={x:before.x+7,y:before.y+11};
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',...start,button:'left',buttons:1,clickCount:1});
    if(move){
      await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:100,y:450,button:'left',buttons:1});
      // Reconciliation can move a tile within its panel. Capture belongs to the stable app.
      await blocker.evaluate(el=>el.parentElement!.prepend(el));
    }
    // Neither the prior paint nor an intermediate move is authoritative at release.
    const destination={x:move?260:180,y:move?610:500};
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',...destination,button:'left',buttons:0,clickCount:1});
    const after=(await blocker.boundingBox())!;
    expect(after.x).toBeCloseTo(destination.x-7,1);expect(after.y).toBeCloseTo(destination.y-11,1);
    await page.reload();await expect(blocker).toBeVisible();expect(await blocker.boundingBox()).toEqual(after);
  }
});

test('a mouse release still drops after capture ends before pointerup',async({page})=>{
  await openFixture(page);
  const blocker=item(page,'Blocker'),cdp=await page.context().newCDPSession(page);
  const before=(await blocker.boundingBox())!;
  await page.evaluate(()=>window.dragTrace!.start());
  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:before.x+7,y:before.y+11,button:'left',buttons:1,clickCount:1});
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:120,y:550,button:'left',buttons:1});
  // The reported Chrome sequence: capture ends on a move with no buttons,
  // then pointerup arrives. This must not discard the active drag.
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:180,y:650,button:'none',buttons:0});
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:210,y:660,button:'left',buttons:0,clickCount:1});
  const trace=await page.evaluate(()=>JSON.parse(window.dragTrace!.stop()));
  const kinds=trace.entries.map((entry:{type:string})=>entry.type);
  expect(kinds.indexOf('event:lostpointercapture')).toBeGreaterThan(kinds.indexOf('drag:recognized'));
  expect(kinds.indexOf('event:lostpointercapture')).toBeLessThan(kinds.indexOf('event:pointerup'));
  expect(trace.entries.filter((entry:{type:string})=>entry.type==='commit:applied')).toHaveLength(1);
  const after=(await blocker.boundingBox())!;
  expect(after.x).toBeCloseTo(203,1);expect(after.y).toBeCloseTo(649,1);
  await expect(blocker).not.toHaveClass(/dragging/);
  await page.reload();await expect(blocker).toBeVisible();expect(await blocker.boundingBox()).toEqual(after);
});

for(const interruption of ['pointercancel','capture loss while pressed'])test(`${interruption} still cancels without saving the drag`,async({page})=>{
  await openFixture(page);
  const blocker=item(page,'Blocker'),before=await blocker.boundingBox();
  await page.evaluate(()=>window.dragTrace!.start());
  await pickup(page,blocker);await page.mouse.move(180,650);
  await page.evaluate(interruption=>{
    const trace=JSON.parse(window.dragTrace!.json());
    const pointerId=trace.entries.find((entry:{type:string})=>entry.type==='drag:begin').state.drag.pointer;
    if(interruption==='pointercancel')document.dispatchEvent(new PointerEvent('pointercancel',{pointerId,pointerType:'mouse'}));
    else document.querySelector('#app')!.releasePointerCapture(pointerId);
  },interruption);
  // Flush the capture change with the button still held before releasing it.
  await page.mouse.move(190,650);await page.mouse.up();
  expect(await blocker.boundingBox()).toEqual(before);await expect(blocker).not.toHaveClass(/dragging/);
  const trace=await page.evaluate(()=>JSON.parse(window.dragTrace!.stop()));
  expect(trace.entries.filter((entry:{type:string})=>entry.type==='commit:applied')).toHaveLength(0);
  await place(page,blocker,190,650); // Cancellation cannot leave the next gesture stuck.
  const after=(await blocker.boundingBox())!;
  expect(after.x).toBeCloseTo(190,1);expect(after.y).toBeCloseTo(650,1);
});

test('opt-in drag tracing captures native input, immutable positions and the committed drop, then stops',async({page})=>{
  await openFixture(page);
  expect(await page.evaluate(()=>JSON.parse(window.dragTrace!.json()).entries)).toEqual([]);
  const blocker=item(page,'Blocker'),before=(await blocker.boundingBox())!;
  await page.evaluate(()=>window.dragTrace!.start());
  await pickup(page,blocker);await page.mouse.move(180,650);await page.mouse.up();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(window.dragTrace!.json()).entries.some((e:{type:string})=>e.type==='drop:after-frame'))).toBe(true);
  const exported=await page.evaluate(()=>window.dragTrace!.stop()),trace=JSON.parse(exported);
  const kinds=trace.entries.map((entry:{type:string})=>entry.type);
  for(const kind of ['event:pointerdown','event:pointermove','event:mousemove','event:pointerup','drag:begin','drag:recognized','drag:preview','drop:resolved','commit:applied','drop:after-frame'])expect(kinds).toContain(kind);
  // Preventing pointerdown suppresses compatibility mousedown/up; the trace must not invent them.
  expect(kinds).not.toContain('event:mousedown');expect(kinds).not.toContain('event:mouseup');
  const begin=trace.entries.find((entry:{type:string})=>entry.type==='drag:begin');
  expect(parseFloat(begin.state.tile.left)).toBeCloseTo(before.x,1);
  const release=trace.entries.find((entry:{type:string})=>entry.type==='event:pointerup');
  expect(release.details).toMatchObject({clientX:180,clientY:650,buttons:0,pointerType:'mouse',trusted:true});
  const applied=trace.entries.find((entry:{type:string})=>entry.type==='commit:applied');
  expect(applied.details.action).toMatchObject({type:'move',item:'name:Blocker',x:173,y:639});
  expect(applied.state.item).toMatchObject({x:173,y:639});
  expect(kinds.indexOf('event:pointerup')).toBeLessThan(kinds.indexOf('drop:resolved'));
  await page.mouse.move(5,800);
  expect(await page.evaluate(()=>window.dragTrace!.json())).toBe(exported);
});

test('drag tracing identifies cancellation and preserves the last trace across a development reload',async({page})=>{
  await openFixture(page);
  const blocker=item(page,'Blocker'),before=await blocker.boundingBox();
  await page.evaluate(()=>window.dragTrace!.start());
  await pickup(page,blocker);await page.mouse.move(180,650);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();
  expect(await blocker.boundingBox()).toEqual(before);
  await page.reload();await expect(blocker).toBeVisible();
  const trace=await page.evaluate(()=>JSON.parse(window.dragTrace!.stop()));
  const canceled=trace.entries.find((entry:{type:string;details:{reason?:string}})=>entry.type==='gesture:cancel'&&entry.details.reason==='window-blur');
  expect(canceled.state.drag).toMatchObject({id:'name:Blocker',moved:true});
  expect(trace.entries.some((entry:{type:string})=>entry.type==='commit:applied')).toBe(false);
  expect(trace.entries.at(-1).type).toBe('event:pagehide');
  await page.evaluate(()=>window.dragTrace!.start());
  expect(await page.evaluate(()=>JSON.parse(window.dragTrace!.stop()).entries.map((entry:{type:string})=>entry.type))).toEqual(['trace:start','trace:stop']);
});
