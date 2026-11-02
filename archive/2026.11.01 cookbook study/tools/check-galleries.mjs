import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.env.COOKBOOK_STUDY_ORIGIN||'http://127.0.0.1:5174';
const browser=await chromium.launch();
let images=0;
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/cookbook-study/contact-sheets/','/cookbook-stations/','/cookbook-pages/','/cookbook-hotspots/','/cookbook-backgrounds/']){
  await page.goto(origin+route);await page.waitForFunction(()=>window.galleryReady);
  const articles=page.locator('article');
  for(let n=0;n<await articles.count();n++){
   const article=articles.nth(n),selector=article.locator('select');
   for(const file of await selector.locator('option').evaluateAll(options=>options.map(o=>o.value))){
    await selector.selectOption(file);await article.locator('img').evaluate(im=>im.decode());
    assert(await article.locator('img').evaluate(im=>im.naturalWidth>0));images++;
   }
  }
  for(const [width,columns] of [[1600,'3'],[1600,'4'],[375,'auto']]){
   await page.setViewportSize({width,height:1000});await page.locator('#columns').selectOption(columns);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('#cards')).gridTemplateColumns.split(' ').length}));
   assert(!layout.overflow,route+' must fit the viewport');assert.equal(layout.columns,width===375?1:Number(columns));
  }
  for(const href of await page.locator('a').evaluateAll(links=>[...new Set(links.map(a=>a.href))])){
   const response=await page.request.get(href);assert(response.ok(),href);
  }
  await page.setViewportSize({width:1600,height:1000});console.log(route+' passed');
 }
 for(const chapter of [0,2,11,32]){
  await page.setViewportSize({width:390,height:844});await page.goto(origin+'/cookbook-stations/play.html?chapter='+chapter);
  await page.locator('#loading').waitFor({state:'hidden',timeout:60000});
  await page.frameLocator('iframe').locator(`.chapter-panel[data-chapter="${chapter}"]`).waitFor();
 }
 assert.deepEqual(errors,[]);console.log(`${images} artwork views, responsive columns, links and four current chapter previews passed.`);
}finally{await browser.close();}
