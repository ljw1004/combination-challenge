import {test, expect} from '@playwright/test';

test('fixed scene artwork keeps its registered scale and declaration order after construction and reload', async ({page}) => {
  const story=`# Registered scenery
## Work
![room](room.svg)
Build the assembly.
**Items**
- Parts
  - icon: ![parts](part.svg) (at 25%, 65%)
- Tool
  - icon: ![tool](part.svg) (at 75%, 65%)
- Rear
  - icon: ![rear](rear.svg)
- Front
  - icon: ![front](front.svg)
**Hotspots**
- Rear (at 50%, 25%)
- Front (at 50%, 25%)
**Goals**
- Build the rear assembly -- Rear
**Combinations**
- Parts [consume] + Tool [preserve] -> Rear
## End
Done.`;
  await page.route('**/registered-fixture/story.md', r=>r.fulfill({contentType:'text/markdown',body:story}));
  await page.route('**/registered-fixture/*.svg', r=>{
    const file=new URL(r.request().url()).pathname.split('/').pop();
    const [w,h,fill]=file==='rear.svg'?[1560,800,'red']:file==='front.svg'?[400,400,'blue']:file==='room.svg'?[780,1688,'tan']:[160,160,'green'];
    return r.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${fill}"/></svg>`});
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/combinations.html?story=registered-fixture/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  const front=page.locator('[data-hotspot="name:Front"]'),rear=page.locator('[data-hotspot="name:Rear"]');
  await expect(front).toBeVisible();await expect(rear).toHaveCount(0);
  await page.locator('[data-item="name:Parts"]').dragTo(page.locator('[data-item="name:Tool"]'));
  await expect(rear).toBeVisible();
  for (const reload of [false,true]) {
    if(reload){await page.reload();await expect(rear).toBeVisible();}
    const b=(await rear.boundingBox())!;
    expect(b.width).toBeCloseTo(390,4);expect(b.height).toBeCloseTo(200,4);expect(b.x).toBeCloseTo(0,4);
    expect(b.y+b.height/2).toBeCloseTo(844*.25,4);
    expect(await page.evaluate(()=>document.elementFromPoint(195,211)?.closest<HTMLElement>('[data-hotspot]')?.dataset.hotspot)).toBe('name:Front');
    expect(await page.locator('[data-hotspot]').evaluateAll(es=>es.map(e=>(e as HTMLElement).dataset.hotspot))).toEqual(['name:Rear','name:Front']);
  }
});
