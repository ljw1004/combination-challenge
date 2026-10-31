/** Browser QA and a review gallery of legal chapter-entry checkpoints, not player evidence. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../src/story/parser.ts';
import {jumpToChapter} from '../../tests/debug-helpers.ts';
import {slug} from './catalogue.ts';

const story=parseStory(readFileSync('stories/elements-icons/story.md','utf8'));
const base=process.env.ELEMENTS_ICONS_URL??'http://127.0.0.1:5173',directory='docs/elements-icons/screenshots';
mkdirSync(directory,{recursive:true});
mkdirSync(`${directory}/hotspots`,{recursive:true});
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,reducedMotion:'reduce'}),page=await context.newPage();
const errors:string[]=[],captures:object[]=[],hotspotCaptures:{chapter:number;name:string;file:string}[]=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
try{
  await page.goto(`${base}/combinations.html?story=elements-icons`);
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  for(let chapter=0;chapter<31;chapter++){
    if(chapter){await jumpToChapter(page,story.chapters[chapter].name);await page.getByRole('button',{name:'Begin',exact:true}).click();}
    const panel=page.locator(`.chapter-panel[data-chapter="${chapter}"]`);
    await expect(panel).toBeVisible();
    await page.evaluate(async()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
    await page.mouse.move(389,843);
    const layout=await panel.locator('.thing').evaluateAll(items=>items.map(item=>({id:(item as HTMLElement).dataset.item,x:(item as HTMLElement).offsetLeft,y:(item as HTMLElement).offsetTop,width:(item as HTMLElement).offsetWidth,height:(item as HTMLElement).offsetHeight,icon:item.classList.contains('icon-thing')})));
    if(layout.some(item=>!item.icon||item.x<0||item.x+item.width>390||item.y<0||item.y+item.height>844))throw Error(`Chapter ${chapter+1}: icon fallback or out-of-board layout`);
    const points=await panel.locator('.hotspot').evaluateAll(nodes=>nodes.map(node=>({id:(node as HTMLElement).dataset.hotspot,x:parseFloat((node as HTMLElement).style.left),y:parseFloat((node as HTMLElement).style.top),icon:node.classList.contains('hotspot-icon')})));
    for(const point of points){const h=story.hotspots[point.id!];expect(point.icon).toBe(true);expect(point.x).toBeCloseTo(h.x!*390,3);expect(point.y).toBeCloseTo(h.y!*844,3);}
    const file=`${String(chapter+1).padStart(2,'0')}.jpg`;
    await page.screenshot({path:`${directory}/${file}`,type:'jpeg',quality:88,animations:'disabled'});
    captures.push({chapter:chapter+1,title:story.chapters[chapter].name,file,items:layout.length,hotspots:points.length});
    for(const point of points){
      const target=panel.locator(`[data-hotspot="${point.id}"]`),h=story.hotspots[point.id!];
      // Empty artwork must still decode, retain its authored dimensions and receive pointers.
      const artwork=await target.locator('img').evaluate((node:HTMLImageElement)=>{
        const canvas=document.createElement('canvas');canvas.width=node.naturalWidth;canvas.height=node.naturalHeight;
        const ctx=canvas.getContext('2d')!;ctx.drawImage(node,0,0);
        const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        return {width:canvas.width,height:canvas.height,transparent:pixels.every((value,i)=>i%4!==3||value===0)};
      });
      expect(artwork.transparent).toBe(true);
      const box=(await target.boundingBox())!;
      expect(box.width).toBe(artwork.width/4);expect(box.height).toBe(artwork.height/4);
      expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);
      expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(844);
      await target.hover();
      await expect(target.locator('.icon-name')).toBeVisible();
      expect(await target.evaluate(node=>{const s=getComputedStyle(node,'::after');return [s.borderStyle,s.borderColor,s.boxShadow];})).toEqual(['dotted','rgb(0, 0, 0)','none']);
      await page.screenshot({path:`${directory}/hotspots/${file}`,type:'jpeg',quality:90,animations:'disabled'});
      hotspotCaptures.push({chapter:chapter+1,name:h.name,file});
      await page.mouse.move(389,843);
    }
    // The same settled board must remain usable at the narrower reference viewport.
    await page.setViewportSize({width:320,height:740});
    await expect.poll(async()=>(await panel.boundingBox())!.width).toBeCloseTo(320,1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const point of points){
      const box=(await panel.locator(`[data-hotspot="${point.id}"]`).boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(320.1);
    }
    await page.setViewportSize({width:390,height:844});
    await expect.poll(async()=>(await panel.boundingBox())!.width).toBeCloseTo(390,1);
    console.log(`Captured ${chapter+1}: ${story.chapters[chapter].name}`);
  }
  // Check the illustrated finale as a real drop as well as an empty entry scene.
  const lantern=page.locator('[data-item="name:Floating lantern"]');
  const landing=page.locator('.chapter-panel[data-chapter="30"] [data-hotspot="name:Gathering landing"]');
  const fixed=await landing.evaluate(node=>({left:(node as HTMLElement).style.left,top:(node as HTMLElement).style.top}));
  await lantern.dragTo(landing);
  await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();
  expect(await landing.evaluate(node=>({left:(node as HTMLElement).style.left,top:(node as HTMLElement).style.top}))).toEqual(fixed);
  await page.locator('.chapter-panel[data-chapter="30"]').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}));
  const floating=(await lantern.boundingBox())!,target=(await landing.boundingBox())!;
  expect(floating.x+floating.width/2).toBeCloseTo(target.x+target.width/2,0);
  expect(floating.y+floating.height/2).toBeCloseTo(target.y+target.height/2,0);
  await page.mouse.move(5,830);
  await expect(lantern.locator('.icon-name')).toBeHidden();
  await page.screenshot({path:`${directory}/hotspots/31-placed.jpg`,type:'jpeg',quality:90,animations:'disabled'});
  if(errors.length)throw Error(errors.join('\n'));
  writeFileSync(`${directory}/manifest.json`,JSON.stringify({capturedAt:new Date().toISOString(),browser:browser.version(),viewport:{width:390,height:844},deviceScaleFactor:2,evidence:'Legal developer checkpoint entries; visual/layout checks at 390 and 320px, not a fresh-player study.',captures},null,2)+'\n');
  expect(hotspotCaptures).toHaveLength(9);
  writeFileSync(`${directory}/hotspots/manifest.json`,JSON.stringify({evidence:'All eight identities across nine chapter appearances. Fully transparent artwork, intrinsic dimensions, pointer hover, black dotted outline, readable name and board/touch bounds checked at 390px and 320px. Actual Floating lantern drop completes the final goal at the fixed inlet centre.',captures:hotspotCaptures,completedPlacement:'31-placed.jpg'},null,2)+'\n');
  const sheet=await page.evaluate(async captures=>{
    const canvas=document.createElement('canvas');canvas.width=1170;canvas.height=1392;
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#ead9b8';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#241d16';ctx.font='16px sans-serif';
    for(let i=0;i<captures.length;i++){
      const image=new Image();image.src=captures[i].data;await image.decode();
      const x=i%3*390,y=Math.floor(i/3)*464;ctx.fillText(`Chapter ${captures[i].chapter}`,x+6,y+16);
      ctx.drawImage(image,0,0,780,888,x,y+20,390,444);
    }
    return canvas.toDataURL('image/jpeg',.94);
  },hotspotCaptures.map(({chapter,file})=>({chapter,data:'data:image/jpeg;base64,'+readFileSync(`${directory}/hotspots/${file}`).toString('base64')})));
  writeFileSync('docs/elements-icons/contact-sheets/hotspots-in-context.jpg',Buffer.from(sheet.split(',')[1],'base64'));
  const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  writeFileSync('docs/elements-icons/index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Elements - Icons</title><style>
*{box-sizing:border-box}body{margin:0;background:#ead9b8;color:#31271c;font:16px/1.5 system-ui}main{max-width:1500px;margin:auto;padding:24px}h1,h2{font-family:Georgia,serif}a{color:#59401e}nav{display:flex;gap:20px;flex-wrap:wrap}.scenes{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}figure{margin:0;background:#fff8e9}figcaption{padding:8px;font-size:14px}.scenes img{width:100%;display:block}.icons{display:grid;grid-template-columns:repeat(auto-fill,minmax(135px,1fr));gap:12px}.icons figure{height:128px;display:flex;align-items:center;justify-content:flex-end;flex-direction:column;padding:8px}.icons img{object-fit:contain;max-width:128px;max-height:80px}.icons figcaption{font-size:12px;text-align:center;line-height:1.2}.icons.hide-names figcaption{visibility:hidden}.icons figure:hover figcaption{visibility:visible}button{font:inherit;padding:8px;background:#fff8e9;border:1px solid #8b714b;cursor:pointer}
</style><main><h1>Elements - Icons</h1><p>Rustic coloured woodcuts, with a generous clearing for making things.</p><nav><a href="/combinations.html?story=elements-icons">Play the story</a><a href="#scenes">31 chapter views</a><a href="#icons">Complete icon set</a><a href="#hotspots">Hotspots in their scenery</a><a href="contact-sheets/house-fittings.png">House fittings</a></nav><h2 id="scenes">Chapter views</h2><p>Legal checkpoint entries, captured at phone size. The original Elements story remains available separately.</p><div class="scenes">${story.chapters.slice(0,31).map((c,i)=>`<figure><a href="screenshots/${String(i+1).padStart(2,'0')}.jpg"><img loading="lazy" src="screenshots/${String(i+1).padStart(2,'0')}.jpg" width="780" height="1688" alt="${escape(c.name)}"></a><figcaption>${i+1}. ${escape(c.name)}</figcaption></figure>`).join('')}</div><h2 id="icons">All 201 items</h2><p><button id="names" aria-pressed="false">Hide names to try recognition</button></p><div class="icons" id="items">${Object.values(story.items).sort((a,b)=>a.name.localeCompare(b.name)).map(item=>`<figure><img loading="lazy" src="../../stories/elements-icons/assets/icons/${slug(item.name)}.png" alt="${escape(item.name)}" style="width:auto;height:auto"><figcaption>${escape(item.name)}</figcaption></figure>`).join('')}</div><h2 id="hotspots">Fixed hotspots in their scenery</h2><p>Eight locations across nine chapter appearances. Each location is part of the painted background; the hover outline shows its transparent hit area.</p><div class="scenes">${hotspotCaptures.map(h=>`<figure><a href="screenshots/hotspots/${h.file}"><img loading="lazy" src="screenshots/hotspots/${h.file}" width="780" height="1688" alt="${escape(h.name)} with its hit area outlined"></a><figcaption>Chapter ${h.chapter}: ${escape(h.name)}</figcaption></figure>`).join('')}</div><p><a href="screenshots/hotspots/31-placed.jpg">Completed floating-lantern placement</a></p><p>Prompts, scene continuity and bounded review evidence are in <a href="README.md">the production notes</a>.</p></main><script>document.getElementById('names').onclick=function(){const hidden=document.getElementById('items').classList.toggle('hide-names');this.setAttribute('aria-pressed',String(hidden));this.textContent=hidden?'Show names':'Hide names to try recognition';};</script></html>\n`);
}finally{await browser.close();}
