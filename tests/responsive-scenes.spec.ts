import {test,expect,type Page} from '@playwright/test';

const story=`# Responsive scenes
## First
background: ![portrait](portrait.svg)
**Goals**
- Build -- Kit
**Items**
- Frame
- Tool
**Combinations**
- Frame [preserve] + Tool [preserve] -> Kit
## Second
background: ![wide](wide.svg)
**Goals**
- Finish -- Final
**Items**
- Kit
- Probe
- Station
**Hotspots**
- Station (at 75%, 25%)
**Combinations**
- Kit [preserve] + Probe [preserve] -> Final
`;
async function open(page:Page,wide=false){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/responsive/story.md',r=>r.fulfill({contentType:'text/plain',body:wide?story.replace('portrait.svg','wide.svg'):story}));
  await page.route('**/responsive/*.svg',r=>{
    const [width,height]=r.request().url().endsWith('wide.svg')?[1024,768]:[780,1688];
    return r.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#567"/><path d="M0 0H${width}V${height}H0Z" fill="none" stroke="#fc0" stroke-width="12"/></svg>`});
  });
  await page.goto('/combinations.html?story=responsive/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
}
const box=(page:Page,selector:string)=>page.locator(selector).last().boundingBox();

test('the cream catalogue scrolls at the browser edge on phones, tablets and desktops',async({page})=>{
  await page.goto('/index.html');
  for(const size of [{width:390,height:664},{width:1024,height:768},{width:1600,height:1000}]){
    await page.setViewportSize(size);
    const layout=await page.locator('#app').evaluate(el=>{
      const chooser=el.querySelector<HTMLElement>('.chooser')!,style=getComputedStyle(el);
      return {width:el.getBoundingClientRect().width,x:el.getBoundingClientRect().x,background:style.backgroundColor,overflow:style.overflowY,contentOverflow:getComputedStyle(chooser).overflowY,scrollable:el.scrollHeight>el.clientHeight};
    });
    expect(layout).toEqual({width:size.width,x:0,background:'rgb(243, 237, 223)',overflow:'auto',contentOverflow:'visible',scrollable:expect.any(Boolean)});
    expect(await page.locator('#app').evaluate(el=>{el.scrollTop=el.scrollHeight;return el.scrollTop>0;})).toBe(layout.scrollable);
  }
});

test('phones fill all portrait widths, desktops enlarge the full scene and its cards, landscape phones fit',async({page})=>{
  await open(page);
  for(const size of [{width:390,height:664},{width:440,height:956},{width:484,height:1112}]){
    await page.setViewportSize(size);
    await expect.poll(async()=>Math.round((await box(page,'.chapter-panel'))!.width)).toBe(size.width);
    expect((await box(page,'.chapter-panel'))!.height).toBeCloseTo(size.height,1);
    expect((await box(page,'.chapter-panel'))!.x).toBeCloseTo(0,1);
  }
  await page.setViewportSize({width:1920,height:1200});
  await expect.poll(async()=>(await box(page,'.chapter-panel'))!.width).toBeCloseTo(390*1200/844,1);
  const scene=(await box(page,'.chapter-panel'))!,image=(await box(page,'.scene-art'))!;
  expect(image.width).toBeCloseTo(scene.width,1); expect(image.height).toBeCloseTo(scene.height,1);
  expect(scene.x).toBeCloseTo((1920-scene.width)/2,1);
  expect((await box(page,'[data-item="name:Frame"]'))!.width).toBeCloseTo(112*1200/844,1);
  expect(await page.locator('#app').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)');
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await expect(page.locator('[data-item="name:Kit"]')).toBeVisible();
  await page.setViewportSize({width:844,height:390});
  await expect.poll(async()=>(await box(page,'.scene-art'))!.height).toBeCloseTo(390,1);
  expect((await box(page,'.chapter-panel'))!.width).toBeCloseTo(390*390/844,1);
  expect((await box(page,'[data-item="name:Tool"]'))!.width).toBeCloseTo(112*390/844,1);
});

test('landscape artwork always fits and places percentage anchors on the image',async({page})=>{
  await open(page,true);
  for(const size of [{width:390,height:844},{width:1200,height:800}]){
    await page.setViewportSize(size);
    const width=Math.min(size.width,size.height*4/3),height=width*3/4;
    await expect.poll(async()=>(await box(page,'.chapter-panel'))!.height).toBeCloseTo(height,1);
    const scene=(await box(page,'.chapter-panel'))!,image=(await box(page,'.scene-art'))!;
    expect(scene.width).toBeCloseTo(width,1);expect(image.width/image.height).toBeCloseTo(4/3,3);
    expect(scene.y).toBeCloseTo((size.height-height)/2,1);
  }
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await page.getByRole('button',{name:'Continue story'}).click();
  const scene=(await box(page,'.chapter-panel'))!,station=(await box(page,'[data-hotspot="name:Station"]'))!;
  expect(station.x+station.width/2).toBeCloseTo(scene.x+scene.width*.75,1);
  expect(station.y+station.height/2).toBeCloseTo(scene.y+scene.height*.25,1);
  const kit=page.locator('[data-item="name:Kit"]');
  await kit.dragTo(page.locator('[data-item="name:Probe"]'));
  await expect(page.locator('[data-item="name:Final"]')).toBeVisible();
});

test('the desktop editor narrows its game pane into phone framing',async({page})=>{
  await page.setViewportSize({width:1600,height:1000});
  await open(page);
  await expect.poll(async()=>(await box(page,'.chapter-panel'))!.width).toBeCloseTo(390*1000/844,1);
  await page.locator('.debug-toggle').click();
  await expect(page.locator('.story-editor')).toBeVisible();
  await expect.poll(async()=>(await box(page,'#app'))!.width).toBe(390);
  expect((await box(page,'.chapter-panel'))!.width).toBeCloseTo(390,1);
  expect((await box(page,'.scene-art'))!.width).toBeGreaterThan(390);
  await page.locator('.debug-toggle').click();
  await expect.poll(async()=>(await box(page,'.chapter-panel'))!.width).toBeCloseTo(390*1000/844,1);
});

test('an older item crosses between chapters with different scene scales',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:1600,height:1000});
  await open(page);
  await page.locator('[data-item="name:Frame"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await page.getByRole('button',{name:'Continue story'}).click();
  const viewport=page.locator('.viewport');
  await viewport.evaluate(el=>{el.scrollTop=0;});
  const frame=page.locator('[data-item="name:Frame"]'),first=(await frame.boundingBox())!;
  await page.mouse.move(first.x+first.width/2,first.y+first.height/2);await page.mouse.down();
  await viewport.evaluate(el=>{el.scrollTop=1000;});
  await page.mouse.move(400,220);
  expect((await frame.boundingBox())!.width).toBeCloseTo(112*1000/292.5,1);
  await page.mouse.up();
  await expect(page.locator('.chapter-panel[data-chapter="1"] [data-item="name:Frame"]')).toBeVisible();
  expect((await frame.boundingBox())!.width).toBeCloseTo(112*1000/292.5,1);
  expect(errors).toEqual([]);
});
