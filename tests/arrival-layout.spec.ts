import {test,expect,type Page} from '@playwright/test';
import {jumpToChapter} from './debug-helpers.ts';

const manuscript=`# Arrival workshop
## First
background: ![room](room.svg)

Put the bowl at the station.
**Goals**
- Park -- Bowl @ Station
**Hotspots**
- Station (at 50%, 35%)
  - icon: ![station](station.svg) (circular)
**Items**
- Station
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
background: ![room](room.svg)

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
  await page.goto('/make-something.html?story=arrival-fixture/story.md');
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

test('debug checkpoint jumps centre measured cards and icons and save their arrangement',async({page})=>{
  const story=`# Centred workshop
## First
background: ![room](room.svg)
**Goals**
- Prepare -- Mixture
**Items**
- Bowl
  - icon: ![bowl](bowl.svg)
- Spoon
**Combinations**
- Mixture
- Bowl [preserve] + Spoon [preserve] -> Mixture
## Second
background: ![room](room.svg)

Finish the preparation.
**Hotspots**
- Station (at 50%, 15%)
  - icon: ![station](station.svg)
**Items**
- Station
- Flour
**Goals**
- Finish -- Finished
**Combinations**
- Finished
- Bowl [preserve] + Flour -> Finished
- Mixture [preserve] + Spoon [preserve] -> Finished`;
  await page.route('**/centred-fixture/story.md',r=>r.fulfill({contentType:'text/markdown',body:story}));
  await page.route('**/centred-fixture/*.svg',r=>r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><circle cx="160" cy="160" r="150" fill="tan"/></svg>'}));
  for(const viewport of [{width:390,height:844},{width:320,height:550},{width:1024,height:844}]){
    await page.setViewportSize(viewport);
    await page.goto('/make-something.html?story=centred-fixture/story.md');
    await jumpToChapter(page,'Second',true);
    await page.getByRole('button',{name:'Begin',exact:true}).click();
    const panel=page.locator('.chapter-panel').last();
    const positions=()=>panel.locator('.thing').evaluateAll(els=>els.map(el=>{
      const r=el.getBoundingClientRect(),label=el.querySelector<HTMLElement>('.icon-name');
      let headroom=0;
      if(label){const style=label.style.cssText;label.style.display='block';label.style.visibility='hidden';headroom=label.getBoundingClientRect().height;label.style.cssText=style;}
      return {x:r.x,y:r.y-headroom,right:r.right,bottom:r.bottom};
    }));
    const placed=await positions(),board=(await panel.boundingBox())!,station=(await panel.locator('[data-hotspot]').boundingBox())!;
    expect(placed.length).toBeGreaterThan(1);
    const centreY=(Math.min(...placed.map(t=>t.y))+Math.max(...placed.map(t=>t.bottom)))/2;
    const centreX=(Math.min(...placed.map(t=>t.x))+Math.max(...placed.map(t=>t.right)))/2;
    expect(Math.abs(centreY-(board.y+board.height/2))).toBeLessThan(2);
    expect(Math.abs(centreX-(board.x+board.width/2))).toBeLessThan(2);
    for(const t of placed){
      expect(t.bottom<=station.y||t.y>=station.y+station.height||t.right<=station.x||t.x>=station.x+station.width).toBe(true);
      for(const other of placed.filter(p=>p!==t))expect(t.bottom<=other.y||t.y>=other.bottom||t.right<=other.x||t.x>=other.right).toBe(true);
    }
    await page.reload();
    await expect.poll(positions).toEqual(placed);
  }
});

test('wrapped icon badges fit a narrow checkpoint and edge badges stay inside the scene',async({page})=>{
  const names=['Charged emergency reserve','Insulated service loop','Running process installation','Station operating controls'];
  const sizes=[[144,114],[183,192],[230,167],[177,182]];
  const manuscript=`# Badge clearances
## Supplies
background: ![room](room.svg)
Equipment is ready.
**Hotspots**
- Separate propellant service connections (at 82.5%, 27%)
  - icon: ![ports](ports.svg)
**Items**
- Separate propellant service connections
${names.slice(0,3).map((name,index)=>`- ${name}\n  - icon: ![equipment](${index}.svg)`).join('\n')}
- Commissioned process enclosure
  - icon: ![enclosure](enclosure.svg)
**Combinations**
- ${names[0]} [preserve] @ Separate propellant service connections -> Commissioned process enclosure
## Controls
background: ![room](room.svg)
Select the systems.
**Goals**
- Select emergency operation -- ${names[3]}[${names.slice(0,3).join(', ')}]
**Items**
- ${names[3]} (compound)
  - icon: ![panel](3.svg)
${names.slice(0,3).map(name=>`  - slot: ${name}, accepts ${name}, icon: ![selected](selected.svg)`).join('\n')}`;
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/badge-fixture/story.md',route=>route.fulfill({contentType:'text/markdown',body:manuscript}));
  await page.route('**/badge-fixture/*.svg',route=>{
    const filename=new URL(route.request().url()).pathname.split('/').at(-1)!;
    const size=filename==='ports.svg'?[60,68]:filename==='room.svg'?[390,844]:filename==='enclosure.svg'?[240,480]:filename==='selected.svg'?sizes[3]:sizes[Number(filename[0])];
    return route.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size[0]*4}" height="${size[1]*4}"><rect width="100%" height="100%" fill="tan"/></svg>`});
  });
  await page.goto('/make-something.html?story=badge-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const station=page.locator('[data-hotspot]');await station.hover();
  await expect(station.locator('.icon-name')).toBeVisible();
  const stationName=await station.locator('.icon-name').boundingBox();
  expect(stationName).not.toBeNull();expect(stationName!.x).toBeGreaterThanOrEqual(-.5);expect(stationName!.x+stationName!.width).toBeLessThanOrEqual(320.5);
  await page.getByRole('button',{name:names[0],exact:true}).dragTo(station);
  const enclosure=page.getByRole('button',{name:'Commissioned process enclosure',exact:true});
  await expect(enclosure).toBeVisible();
  const image=(await enclosure.boundingBox())!,createdName=(await enclosure.locator('.icon-name').boundingBox())!;
  expect(image.height).toBeCloseTo(480*740/844,1);
  expect(createdName.y).toBeGreaterThanOrEqual(-.5);
  expect(createdName.y+createdName.height).toBeLessThanOrEqual(image.y+.5);
  await page.mouse.move(image.x+image.width/2,image.y+image.height/2);await page.mouse.down();
  await page.mouse.move(1,1,{steps:6});
  const draggedName=(await enclosure.locator('.icon-name').boundingBox())!;
  expect(draggedName.x).toBeGreaterThanOrEqual(-.5);expect(draggedName.y).toBeGreaterThanOrEqual(-.5);
  await page.mouse.up();
  await jumpToChapter(page,'Controls',true);
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const current=page.locator('.chapter-panel').last();
  const positions=()=>current.locator('.thing').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
  for(const name of names){
    const item=current.getByRole('button',{name,exact:true});await item.hover();
    await expect(item.locator('.icon-name')).toBeVisible();
    const badge=await item.locator('.icon-name').boundingBox();
    expect(badge).not.toBeNull();expect(badge!.y).toBeGreaterThanOrEqual(-.5);
    expect(badge!.x).toBeGreaterThanOrEqual(-.5);expect(badge!.x+badge!.width).toBeLessThanOrEqual(320.5);
  }
  const before=await positions();await page.reload();await expect.poll(positions).toEqual(before);
  const item=current.getByRole('button',{name:names[0],exact:true}),box=(await item.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(1,box.y+box.height/2,{steps:5});
  const badge=(await item.locator('.icon-name').boundingBox())!;
  expect(badge.x).toBeGreaterThanOrEqual(-.5);expect(badge.x+badge.width).toBeLessThanOrEqual(320.5);
  await page.mouse.up();
});
