import {test,expect,type Page} from '@playwright/test';

const manuscript=`# Arrival workshop
## First
![room](room.svg)

Put the bowl at the station.
**Goals**
- Park -- Bowl @ Station
**Hotspots**
- Station (at 50%, 35%)
  - icon: ![station](station.svg) (circular)
**Items**
- Bowl
- Spoon
## Inherited
Use the same station.
**Goals**
- Mix -- Mixture
**Combinations**
- Mixture
- Bowl [preserve] + Spoon [preserve] -> Mixture
## New room
![room](room.svg)

A new setting.
**Hotspots**
- Station
**Goals**
- Finish -- Finished
**Items**
- Flour
**Combinations**
- Finished
- Bowl [preserve] + Flour [preserve] -> Finished`;

async function open(page:Page){
  await page.route('**/arrival-fixture/story.md',r=>r.fulfill({contentType:'text/markdown',body:manuscript}));
  await page.route('**/arrival-fixture/*.svg',r=>r.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320"></svg>`}));
  await page.goto('/combinations.html?story=arrival-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
}
const saved=(page:Page)=>page.evaluate(()=>JSON.parse(Object.entries(localStorage).find(([key])=>key.startsWith('combination-progress-v2:'))![1]).state);
async function drop(page:Page,item:string,x:number,y:number){
  const box=(await page.locator(`[data-item="name:${item}"]`).boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(x,y,{steps:5});await page.mouse.up();
}

test('circular hotspot corners reject pointer hits and drops; inherited occupants stay put until an explicit new background',async({page})=>{
  await open(page);
  const station=page.locator('[data-hotspot="name:Station"]'),bowl=page.locator('[data-item="name:Bowl"]');
  const h=(await station.boundingBox())!,corner={x:h.x+12,y:h.y+3};
  expect(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.closest('[data-hotspot]')!==null,corner)).toBe(false);
  await page.mouse.move(corner.x,corner.y);
  await expect(station).not.toHaveClass(/pressed/);
  // The dragged rectangle reaches only the unused top-left corner of the
  // circle's bounding square. This also exercises overlap-based drop targeting.
  const b=(await bowl.boundingBox())!;
  await drop(page,'Bowl',h.x+(h.width-h.height)/2+5-b.width/2,h.y+5-b.height/2);
  expect((await saved(page)).tokens['name:Bowl'].hotspot).toBeUndefined();
  await expect(page.getByRole('button',{name:'Continue story'})).toHaveCount(0);
  await drop(page,'Bowl',h.x+h.width/2,h.y+h.height/2);
  const before=(await bowl.boundingBox())!;
  expect((await saved(page)).tokens['name:Bowl'].hotspot).toBe('name:Station');
  await page.getByRole('button',{name:'Continue story'}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  expect(await bowl.boundingBox()).toEqual(before);
  expect((await saved(page)).tokens['name:Bowl'].hotspot).toBe('name:Station');
  await page.reload();await expect(bowl).toBeVisible();
  expect(await bowl.boundingBox()).toEqual(before);
  await page.locator('[data-item="name:Spoon"]').dragTo(bowl);
  await page.getByRole('button',{name:'Continue story'}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  expect((await saved(page)).tokens['name:Bowl'].hotspot).toBeUndefined();
  const moved=(await bowl.boundingBox())!,current=page.locator('.chapter-panel').last(),target=(await current.locator('[data-hotspot]').boundingBox())!;
  const cx=target.x+target.width/2,cy=target.y+target.height/2;
  expect(Math.hypot(cx-Math.max(moved.x,Math.min(moved.x+moved.width,cx)),cy-Math.max(moved.y,Math.min(moved.y+moved.height,cy)))).toBeGreaterThanOrEqual(40-.01);
});

test('short viewport arrivals keep measured text cards above multi-line goals and remain stable on reload',async({page})=>{
  await page.setViewportSize({width:320,height:550});
  await open(page);
  const goals=(await page.locator('.hud-stack').boundingBox())!;
  const positions=await page.locator('.thing').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,bottom:r.bottom,right:r.right};}));
  for(const p of positions){expect(p.bottom).toBeLessThan(goals.y-10);expect(p.right).toBeLessThanOrEqual(320);expect(p.x).toBeGreaterThanOrEqual(0);}
  await page.reload();
  await expect.poll(()=>page.locator('.thing').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,bottom:r.bottom,right:r.right};}))).toEqual(positions);
});
