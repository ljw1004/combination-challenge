import {test,expect,type Locator,type Page} from '@playwright/test';

async function drag(page:Page,source:Locator,target:Locator){
  const a=(await source.boundingBox())!, b=(await target.boundingBox())!;
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});await page.mouse.up();
}

for(const notation of ['@','+'])test(`constructed fixed items accept ${notation} recipes, replace in place and release occupants`,async({page})=>{
  const text=`# Fixed constructions
## Workshop
background: ![room](room.svg)
Build and repair the station.
**Items**
- Frame
- Tool
- Patch
- Camera
- Station
- Repaired station
**Hotspots**
- Station (center 253.5px, 379.8px)
- Repaired station
**Goals**
- Build -- Station
- next: Put camera down -- Camera @ Station
- next: Repair -- Repaired station
**Combinations**
- Frame [consume] + Tool [preserve] -> Station (tutorial)
- Patch [consume] ${notation} Station [consume] -> Repaired station
## End
Finished.`;
  await page.route('**/fixed-fixture/story.md',route=>route.fulfill({contentType:'text/markdown',body:text}));
  await page.route('**/fixed-fixture/room.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"><rect width="390" height="844" fill="#eadfc8"/></svg>'}));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/make-something.html?story=fixed-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const item=(name:string)=>page.locator(`[data-item="name:${name}"]`);
  const station=page.locator('[data-hotspot="name:Station"]'), repaired=page.locator('[data-hotspot="name:Repaired station"]');
  await expect(station).toHaveCount(0);await expect(repaired).toHaveCount(0);
  await drag(page,item('Frame'),item('Tool'));
  await expect(station).toBeVisible();await expect(item('Station')).toHaveCount(0);
  const position=(await station.boundingBox())!;
  await page.mouse.move(position.x+position.width/2,position.y+position.height/2);await page.mouse.down();
  await page.mouse.move(40,100,{steps:8});await page.mouse.up();
  expect(await station.boundingBox()).toEqual(position);
  await drag(page,item('Camera'),station);
  const camera=(await item('Camera').boundingBox())!;
  await drag(page,item('Patch'),station);
  await expect(station).toHaveCount(0);await expect(repaired).toBeVisible();
  const replacement=(await repaired.boundingBox())!;
  expect(replacement.x+replacement.width/2).toBeCloseTo(position.x+position.width/2,0);
  expect(replacement.y+replacement.height/2).toBeCloseTo(position.y+position.height/2,0);
  expect(await item('Camera').boundingBox()).toEqual(camera);
  await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();
  await page.reload();
  await expect(repaired).toBeVisible();await expect(station).toHaveCount(0);await expect(item('Camera')).toBeVisible();
});

for(const notation of ['+','@'])test(`fixed compounds accept fittings and produce movable results with ${notation}`,async({page})=>{
  const text=`# Fixed fittings
## Workshop
background: ![room](room.svg)
Fit and use the machine.
**Items**
- A
  - icon: ![input](part.svg)
- Part
  - icon: ![part](part.svg)
- H (compound)
  - icon: ![machine](machine.svg)
  - unnamed slot: accepts Part, icon: ![fitted](fitted.svg)
- C
  - icon: ![result](part.svg)
**Hotspots**
- H (center 145.6px, 100.8px)
**Goals**
- Fit -- H[Part]
- Make -- C
**Combinations**
- A [consume] ${notation} H[Part] [preserve] -> C`;
  await page.route('**/fittings-fixture/story.md',route=>route.fulfill({contentType:'text/markdown',body:text}));
  await page.route('**/fittings-fixture/*.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224"><rect width="224" height="224" fill="tan"/></svg>'}));
  await page.goto('/make-something.html?story=fittings-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const h=page.locator('[data-hotspot="name:H"]');
  await expect(h.locator('.item-icon')).toBeVisible();
  await drag(page,page.locator('[data-item="name:Part"]'),h);
  await expect(h.locator('.slot-icon')).toHaveCount(1);
  const location=(await h.boundingBox())!;
  await drag(page,page.locator('[data-item="name:A"]'),h);
  const result=page.locator('[data-item="name:C"]');
  await expect(result).toBeVisible();
  const position=(await result.boundingBox())!;
  expect(position.x+position.width/2).toBeCloseTo(location.x+location.width/2,0);
  expect(position.y+position.height/2).toBeCloseTo(location.y+location.height/2,0);
  await expect(h).toBeVisible();
});
