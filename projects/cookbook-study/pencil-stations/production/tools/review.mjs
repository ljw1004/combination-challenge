import {runDirectory} from '../../../tools/run-output.mjs';
const run=await runDirectory();
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../../../../src/story/parser.ts';import {jumpToChapter} from '../../../../../tests/debug-helpers.ts';
const project=path.resolve(import.meta.dirname,'..'),root=path.resolve(project,'../../../..');
const markdown=await fs.readFile(path.join(root,'stories/cookbook/cookbook.md'),'utf8'),story=parseStory(markdown,{id:'cookbook'}),plan=JSON.parse(await fs.readFile(path.join(project,'registration.json'),'utf8'));
const requested=process.argv.find(a=>a.startsWith('--chapters='))?.slice(11).split(',').map(Number),deviceSelection=process.argv.find(a=>a.startsWith('--devices='))?.slice(10).split(',');
const devices=[{name:'desktop',width:1280,height:844,touch:false},{name:'phone',width:375,height:812,touch:true},{name:'short-phone',width:390,height:667,touch:true},{name:'tall-phone',width:430,height:932,touch:true}].filter(d=>deviceSelection?deviceSelection.includes(d.name):d.name!=='tall-phone');
const proofs=path.join(run,'game');await fs.mkdir(proofs,{recursive:true});
const previous=requested||deviceSelection?await fs.readFile(path.join(run,'browser-review.json'),'utf8').then(JSON.parse).catch(()=>({results:[]})):{results:[]};const browser=await chromium.launch(),results=[];
for(const device of devices){
 const context=await browser.newContext({viewport:{width:device.width,height:device.height},hasTouch:device.touch,reducedMotion:'reduce'}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.COOKBOOK_STUDY_ORIGIN||'http://127.0.0.1:5174')+'/combinations.html?story=cookbook/cookbook.md');await page.getByRole('button',{name:'Start',exact:true}).click();await page.getByRole('button',{name:'Begin',exact:true}).click();
 for(const index of requested??story.chapters.map((_,i)=>i)){
  await jumpToChapter(page,story.chapters[index].name,true);const begin=page.getByRole('button',{name:'Begin',exact:true});if(await begin.isVisible())await begin.click();
  const panel=page.locator(`.chapter-panel[data-chapter="${index}"]`);await panel.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.mouse.move(1,1);
  await panel.evaluate(async el=>{await document.fonts.ready;await Promise.all([...el.querySelectorAll('img')].map(im=>im.decode()));await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)))});
  const geometry=await panel.evaluate(el=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   const box=rect(el),ground=rect(el.querySelector('.scene-art')),items=[...el.querySelectorAll('.thing')].map(e=>({name:e.getAttribute('aria-label'),...rect(e)})),hotspots=[...el.querySelectorAll('.hotspot')].map(e=>({id:e.dataset.hotspot,name:e.getAttribute('aria-label'),...rect(e)}));
   const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1;
   const itemOverlaps=[];for(let a=0;a<items.length;a++)for(let b=a+1;b<items.length;b++)if(overlap(items[a],items[b]))itemOverlaps.push([items[a].name,items[b].name]);
   return {box,ground,items,hotspots,itemOverlaps,stationOverlaps:items.flatMap(i=>hotspots.filter(h=>overlap(i,h)).map(h=>[i.name,h.name])),outside:[...items,...hotspots].filter(r=>r.x<box.x-1||r.right>box.right+1||r.y<box.y-1||r.bottom>Math.min(innerHeight,box.bottom)+1),failed:[...el.querySelectorAll('img')].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  const scene=plan.chapters[Math.min(index,34)],scale=geometry.ground.width/390,registration=[];
  for(const h of scene.hotspots){const actual=geometry.hotspots.find(x=>x.id===h.id);assert(actual);const expected={x:geometry.ground.x+h.rectangle.x*scale,y:geometry.ground.y+h.rectangle.y*scale,width:h.width*scale,height:h.height*scale};for(const key of ['x','y','width','height'])assert(Math.abs(actual[key]-expected[key])<.12,`${index}/${h.id} ${key}`);registration.push({id:h.id,expected,actual});}
  const png=`${scene.slug}${index===35?'-ending':''}-${device.name}.png`;await panel.screenshot({path:path.join(proofs,png),animations:'disabled'});
  const hoverFiles=[];
  if(index<35&&device.name==='desktop')for(const h of scene.hotspots){const station=panel.locator(`[data-hotspot="${h.id}"]`);await station.hover();await expect(station.locator('.icon-name')).toBeVisible();await expect(station.locator('.icon-name')).toHaveText(h.name);const file=`${scene.slug}-${h.target.slice(0,-4)}-hover.png`;await page.screenshot({path:path.join(proofs,file),clip:{x:geometry.box.x,y:Math.max(0,geometry.box.y),width:geometry.box.width,height:250*scale}});hoverFiles.push(file);await page.mouse.move(1,1);}
  const result={chapter:index,name:story.chapters[index].name,device:device.name,png,hoverFiles,...geometry,registration,errors:[...errors]};results.push(result);console.log(JSON.stringify({chapter:index,device:device.name,itemOverlaps:geometry.itemOverlaps.length,stationOverlaps:geometry.stationOverlaps.length,outside:geometry.outside.length}));
 }
 await context.close();
}
await browser.close();const merged=[...previous.results.filter(r=>!results.some(n=>n.chapter===r.chapter&&n.device===r.device)),...results];await fs.writeFile(path.join(run,'browser-review.json'),JSON.stringify({type:'Author-informed legal chapter checkpoints; desktop and Chromium touch emulation.',storySha256:createHash('sha256').update(markdown).digest('hex'),results:merged},null,2)+'\n');
assert.equal(results.filter(r=>r.failed.length||r.outside.length||r.errors.length||r.overflow||r.itemOverlaps.length||r.chapter!==35&&r.stationOverlaps.length).length,0,'Arrival geometry findings require review. Ending trolley intentionally occupies the service hatch.');
