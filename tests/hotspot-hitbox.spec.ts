import {test,expect,type Page} from '@playwright/test';

const manuscript=`# A visible connection
## Power
background: ![room](room.svg)
Fit the lead, then charge at the panels.
**Goals**
- Charge the battery -- Charged
**Hotspots**
- Panels (at 50%, 30%)
  - icon: ![panels](panels.svg)
  - hitbox: (at 25%, 30%) (size 20%, 12%)
**Items**
- Panels (compound)
  - icon: ![panels](panels.svg)
  - unnamed slot: accepts Cable, icon: ![long connected cable](cable-fitted.svg)
- Cable
  - icon: ![cable](cable.svg) (at 70%, 65%)
- Battery
  - icon: ![battery](battery.svg) (at 45%, 65%)
- Charged
  - icon: ![charged](battery.svg)
**Combinations**
- Battery [transform] @ Panels[Cable] -> Charged (tutorial)`;

async function drag(page:Page,source:string,x:number,y:number){
  const box=(await page.locator(source).boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();await page.mouse.move(x,y,{steps:10});await page.mouse.up();
}

async function openFixture(page:Page,text=manuscript){
  await page.route('**/hitbox-fixture/story.md',route=>route.fulfill({contentType:'text/markdown',body:text}));
  await page.route('**/hitbox-fixture/*.svg',route=>{
    const file=new URL(route.request().url()).pathname.split('/').at(-1)!;
    const background=file==='room.svg',large=file==='panels.svg'||file==='cable-fitted.svg';
    const [w,h]=background?[780,1688]:large?[1200,400]:[160,160];
    const shape=file==='cable-fitted.svg'?'<path d="M320 240H1100" stroke="#c40" stroke-width="30"/>':`<rect width="${w}" height="${h}" fill="${background?'#dbd2b5':'#577a91'}"/>`;
    return route.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${shape}</svg>`});
  });
  await page.goto('/make-something.html?story=hitbox-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
}

for(const width of [390,320])test(`receiving bounds remain independent from cable artwork at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});
  await openFixture(page);
  const station=page.locator('[data-hotspot="name:Panels"]'),art=station.locator('.item-icon');
  await expect(station).toBeVisible();
  const receiver=(await station.boundingBox())!,initialArt=(await art.boundingBox())!;
  expect(receiver.width).toBeCloseTo(78,1);expect(receiver.height).toBeCloseTo(101.28,1);
  expect(initialArt.width).toBe(300);expect(initialArt.height).toBe(100);
  expect(initialArt.x+initialArt.width/2-(receiver.x+receiver.width/2)).toBeCloseTo(97.5,2);
  const target={x:receiver.x+receiver.width/2,y:receiver.y+receiver.height/2};
  const cableOnly={x:initialArt.x+270,y:initialArt.y+60};
  expect(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.closest<HTMLElement>('[data-hotspot]')?.dataset.hotspot,cableOnly)).toBeUndefined();
  await page.mouse.click(cableOnly.x,cableOnly.y);
  await expect(station).not.toHaveClass(/pressed/);
  await drag(page,'[data-item="name:Cable"]',target.x,target.y);
  await expect(station.locator('[data-icon-slot="name:Cable"]')).toBeVisible();
  const fitted=(await station.locator('[data-icon-slot="name:Cable"]').boundingBox())!;
  expect(fitted).toEqual(initialArt);
  await page.mouse.move(target.x,target.y);
  await expect(station.locator('.icon-name')).toBeVisible();
  const label=(await station.locator('.icon-name').boundingBox())!;
  expect(label.y+label.height).toBeLessThanOrEqual(receiver.y+.1);
  expect(label.x).toBeGreaterThanOrEqual(0);expect(label.x+label.width).toBeLessThanOrEqual(width+.1);
  await drag(page,'[data-item="name:Battery"]',cableOnly.x,cableOnly.y);
  await expect(page.locator('[data-item="name:Charged"]')).toHaveCount(0);
  await drag(page,'[data-item="name:Battery"]',target.x,target.y);
  await expect(page.locator('[data-item="name:Charged"]')).toBeVisible();
  expect(await art.boundingBox()).toEqual(initialArt);
  await page.reload();
  await expect(station.locator('[data-icon-slot="name:Cable"]')).toBeVisible();
  expect(await station.boundingBox()).toEqual(receiver);
  expect(await art.boundingBox()).toEqual(initialArt);
});

test('small authored receivers retain a 44px target and invalid rectangles fall back to artwork',async({page})=>{
  await openFixture(page,manuscript.replace('(size 20%, 12%)','(size 1%, 1%)'));
  const station=page.locator('[data-hotspot="name:Panels"]');
  const box=(await station.boundingBox())!;
  expect(box.width).toBe(44);expect(box.height).toBe(44);
  const expanded={x:box.x+2,y:box.y+2};
  expect(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.closest<HTMLElement>('[data-hotspot]')?.dataset.hotspot,expanded)).toBe('name:Panels');
  const context=await page.context().browser()!.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:390,height:844}});
  try{
    const invalid=await context.newPage();
    await openFixture(invalid,manuscript.replace('(size 20%, 12%)','(size -1%, 12%)'));
    const fallback=invalid.locator('[data-hotspot="name:Panels"]');
    await expect(fallback).not.toHaveClass(/hotspot-hitbox/);
    const fallbackBox=(await fallback.boundingBox())!;
    expect(fallbackBox.width).toBe(300);expect(fallbackBox.height).toBe(100);
  }finally{await context.close();}
});
