import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../../../src/story/parser.ts';

const out='runs/mars-artwork';
fs.mkdirSync(out,{recursive:true});
const captures=process.argv.includes('--captures');
const baseURL=process.env.MARS_REVIEW_URL ?? 'http://127.0.0.1:5173';
const manuscript=fs.readFileSync('stories/mars/mars.md','utf8');
const chapters=parseStory(manuscript).chapters;
const headings=chapters.map(chapter=>chapter.name);
const chapterIndices=chapters.flatMap((chapter,index)=>chapter.image ? [index] : []);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];const missing=[];const results=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)missing.push(`${response.status()} ${response.url()}`);});
page.setDefaultTimeout(20000);
const item=name=>page.locator(`[data-item=${JSON.stringify(`name:${name}`)}]`);
const hotspot=name=>page.locator(`[data-hotspot=${JSON.stringify(`name:${name}`)}]`);
async function dismiss(){for(const label of ['Begin','Continue']){const b=page.getByRole('button',{name:label,exact:true});if(await b.isVisible())await b.click();}}
async function loaded(){await expect(page.locator('.chapter-panel').last()).toBeVisible();await page.locator('.chapter-panel').last().locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})));});}
async function drop(a,b){await a.dragTo(b);await loaded();await dismiss();}
async function inspect(index,width,height){
 await loaded();
 const data=await page.locator('.chapter-panel').last().evaluate(panel=>{
  const rect=panel.getBoundingClientRect();
  const box=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
  const items=[...panel.querySelectorAll('.thing')].map(el=>({id:el.dataset.item,...box(el),icon:el.classList.contains('icon-thing'),images:[...el.querySelectorAll('img')].map(i=>({url:i.src,loaded:i.complete&&i.naturalWidth>0}))}));
  const targets=[...panel.querySelectorAll('.hotspot')].map(el=>({id:el.dataset.hotspot,...box(el)}));
  const offBoard=items.filter(i=>i.x < -.6 || i.x+i.width>innerWidth+.6 || i.y<rect.y-.6 || i.y+i.height>rect.bottom+.6);
  const overlaps=[];for(const i of items)for(const h of targets){const w=Math.min(i.x+i.width,h.x+h.width)-Math.max(i.x,h.x),v=Math.min(i.y+i.height,h.y+h.height)-Math.max(i.y,h.y);if(w>.5&&v>.5)overlaps.push({item:i.id,target:h.id,area:w*v});}
  return{items:items.length,targets:targets.length,iconsOnly:items.every(i=>i.icon),failedImages:items.flatMap(i=>i.images.filter(a=>!a.loaded)),offBoard,overlaps,overflow:document.documentElement.scrollWidth>innerWidth};
 });
 assert(data.iconsOnly,`Text fallback in chapter ${index}`);assert.equal(data.failedImages.length,0);assert.equal(data.offBoard.length,0,`Offboard chapter ${index}: ${JSON.stringify(data.offBoard)}`);assert(!data.overflow);assert.deepEqual(data.overlaps,[],`Hotspot overlap in chapter ${index}`);
 results.push({chapter:index,name:headings[index],width,height,...data});
 if(captures&&[0,1,3,11,13,18,19,22,24,26].includes(index)&&width===390)await page.screenshot({path:`${out}/chapter-${String(index).padStart(2,'0')}.png`});
}
async function jump(index){
 await page.getByRole('button',{name:'Toggle debug panel'}).focus();await page.keyboard.press('Enter');
 await page.locator('.mobile-debug-chapters button').nth(index).click();
 await expect(page.getByRole('button',{name:'Begin',exact:true})).toBeVisible();await dismiss();await loaded();
}
try{
 await page.goto(`${baseURL}/combinations.html?story=mars/mars.md`);
 await page.getByRole('button',{name:'Start',exact:true}).click();await dismiss();await loaded();
 await inspect(0,390,844);
 await drop(item('Broken radio'),item('Cable'));await expect(item('Radio')).toHaveCount(1);
 await drop(item('Solar panel'),item('Battery'));await expect(item('Solar charger')).toHaveCount(1);
 await drop(item('Radio'),item('Solar charger'));await expect(item('Solar radio')).toHaveCount(1);
 await drop(item('Solar radio'),hotspot('Contact ridge'));
 const savedBefore=await item('Solar radio').boundingBox();await page.reload();await loaded();await expect(item('Solar radio')).toHaveCount(1);assert.deepEqual(await item('Solar radio').boundingBox(),savedBefore);
 const state=await page.evaluate(()=>JSON.parse(Object.entries(localStorage).find(([k])=>k.startsWith('combination-progress-v2:'))[1]).state);
 assert.equal(state.tokens['name:Solar radio'].hotspot,'name:Contact ridge');
 results.push({interaction:'radio repair, solar-power construction, landscape placement, reload position and hotspot membership',pass:true});
 await jump(3);await drop(item('Support frame'),item('Wheels'));await drop(item('Drive motor'),item('Motor controller'));await drop(item('Drive unit'),item('Rover'));await drop(item('Solar charger'),item('Rover'));await drop(item('Seat harness'),item('Rover'));
 await expect(item('Rover').locator('.slot-icon')).toHaveCount(3);await page.reload();await loaded();await expect(item('Rover').locator('.slot-icon')).toHaveCount(3);
 results.push({interaction:'rover construction, three independent fittings, reload layers',pass:true});
 for(const index of chapterIndices){await jump(index);await inspect(index,390,844);}
 await page.setViewportSize({width:320,height:740});
 for(const index of chapterIndices){await jump(index);await inspect(index,320,740);}
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(`${out}/browser-verification.json`,JSON.stringify({results,errors,missing},null,2));
 console.log(JSON.stringify({checks:results.length,pageErrors:errors.length,failedRequests:missing.length,hotspotOverlaps:results.filter(r=>r.overlaps?.length).map(r=>({chapter:r.chapter,width:r.width,overlaps:r.overlaps}))},null,2));
}catch(error){fs.writeFileSync(`${out}/browser-verification.json`,JSON.stringify({results,errors,missing,failure:error.stack},null,2));if(captures)await page.screenshot({path:`${out}/failure.png`});throw error;}finally{await browser.close();}
