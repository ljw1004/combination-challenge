import {runDirectory} from '../../../tools/run-output.mjs';
const run=await runDirectory();
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../../../../src/story/parser.ts';import {checkpoint} from '../../../../../src/debug/checkpoint.ts';import {recipeFor} from '../../../../../src/engine/game.ts';import {jumpToChapter} from '../../../../../tests/debug-helpers.ts';
const project=path.resolve(import.meta.dirname,'..'),root=path.resolve(project,'../../../..'),story=parseStory(await fs.readFile(path.join(root,'stories/cookbook/cookbook.md'),'utf8'),{id:'cookbook'});
const output=path.join(run,'actions');await fs.mkdir(output,{recursive:true});const browser=await chromium.launch(),results=[];
const requested=process.argv.find(a=>a.startsWith('--chapters='))?.slice(11).split(',').map(Number),deviceSelection=process.argv.find(a=>a.startsWith('--devices='))?.slice(10).split(',');
const all=[0,1,2,4,5,10,11,13,14,27,28,30,31,32,34];
for(const [device,width,height,touch] of [['desktop',1280,844,false],['phone',375,812,true],['short-phone',390,667,true]]){
 if(deviceSelection&&!deviceSelection.includes(device))continue;
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.COOKBOOK_STUDY_ORIGIN||'http://127.0.0.1:5174')+'/combinations.html?story=cookbook/cookbook.md');await page.getByRole('button',{name:'Start',exact:true}).click();
 async function dismiss(){for(let n=0;n<25;n++){const button=page.getByRole('button',{name:/^(Begin|Continue)$/});if(!await button.isVisible())return;await button.click();}throw Error('Too many pending readings');}
 await dismiss();
 const save=()=>page.evaluate(()=>JSON.parse(Object.entries(localStorage).find(([k])=>k.startsWith('combination-progress-v2:'))[1]));
 const item=id=>page.locator(`.thing[data-item=${JSON.stringify(id)}]`);
 const station=(id,chapter)=>page.locator(`.chapter-panel[data-chapter="${chapter}"] [data-hotspot=${JSON.stringify(id)}]`);
 async function drag(source,target){
  const a=await source.boundingBox(),b=await target.boundingBox();assert(a&&b);const candidates=[.5,.2,.8].flatMap(x=>[.5,.2,.8].map(y=>({x:a.x+a.width*x,y:a.y+a.height*y})));
  const from=await source.evaluate((el,points)=>points.find(p=>document.elementFromPoint(p.x,p.y)?.closest('[data-item],[data-hotspot]')===el),candidates);assert(from,'The source needs an exposed pickup point');const to={x:b.x+b.width/2,y:b.y+b.height/2};
  if(touch){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});for(let n=1;n<=10;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*n/10,y:from.y+(to.y-from.y)*n/10}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
  else{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:10});await page.mouse.up();}
 }
 for(const chapter of requested??(device==='short-phone'?[0,2,27,28,32,34]:all)){
  const result={device,chapter,name:story.chapters[chapter].name,actions:[],errors:[]};
  try{
   if(chapter!==0||requested){await jumpToChapter(page,story.chapters[chapter].name,true);await dismiss();}
   const panel=page.locator(`.chapter-panel[data-chapter="${chapter}"]`);await panel.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   const initial=await save(),planned=checkpoint(story,chapter+1,initial.state),route=planned.actions.slice(initial.state.actions.length);
   for(const action of route){
    if(action.type==='advance')break;if(action.type==='dismiss'){await dismiss();continue;}
    const before=await save();
    if(action.type==='move'){
     assert(action.hotspot&&action.chapter===chapter,'This station trial requires a current-page target.');await drag(item(action.item),station(action.hotspot,chapter));assert.equal((await save()).state.tokens[action.item].hotspot,action.hotspot);
    }else{
     assert.equal(action.type,'combine');const recipe=recipeFor(story,before.state,action);assert(recipe,'Planned recipe must be legal in the actual browser state');await drag(item(action.a),action.b?item(action.b):station(action.hotspot,chapter));await expect.poll(async()=>!!(await save()).state.tokens[recipe.result.id],{message:recipe.result.id}).toBe(true);
    }
    await dismiss();const after=await save();const accepted=after.state.actions.length>before.state.actions.length;assert(accepted||action.type==='move'&&before.state.tokens[action.item].hotspot===action.hotspot,'Ordinary input must record an action or preserve an already settled placement');result.actions.push({...action,accepted});
   }
   await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();await page.mouse.move(1,1);await panel.screenshot({path:path.join(output,`${chapter}-${device}-complete.png`),animations:'disabled'});
   const beforeReload=await save();await page.reload();await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();assert.deepEqual((await save()).state,beforeReload.state);result.reloadPreserved=true;
   await page.getByRole('button',{name:'Continue story',exact:true}).click();await dismiss();const next=await save();assert(next.state.chapter>chapter);result.advancedTo=next.state.chapter;
   const nextPanel=page.locator(`.chapter-panel[data-chapter="${next.state.chapter}"]`);await nextPanel.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   result.nextArrival=await nextPanel.evaluate(el=>{const rect=e=>e.getBoundingClientRect();const items=[...el.querySelectorAll('.thing')],hotspots=[...el.querySelectorAll('.hotspot')];return {items:items.length,stationOverlaps:items.flatMap(i=>hotspots.filter(h=>{const a=rect(i),b=rect(h);return Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1}).map(h=>[i.getAttribute('aria-label'),h.getAttribute('aria-label')]))};});
   // The final trolley may deliberately remain at its inherited service hatch.
   if(!next.state.completed)assert.equal(result.nextArrival.stationOverlaps.length,0,'Ordinary carry must leave the new stations clear');
   result.passed=true;
  }catch(error){result.error=error.stack;result.passed=false;await page.screenshot({path:path.join(output,`${chapter}-${device}-failure.png`)});}
  result.errors=[...errors];results.push(result);await fs.writeFile(path.join(output,`${chapter}-${device}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({device,chapter,passed:result.passed,actions:result.actions.length,error:result.error?.split('\n')[0]}));
 }
 await context.close();
}
await browser.close();let previous=[];if(requested||deviceSelection)previous=await fs.readFile(path.join(run,'interaction-review.json'),'utf8').then(JSON.parse).then(r=>r.results).catch(()=>[]);const merged=[...previous.filter(r=>!results.some(n=>n.device===r.device&&n.chapter===r.chapter)),...results];await fs.writeFile(path.join(run,'interaction-review.json'),JSON.stringify({type:'Ordinary mouse/Chromium-emulated touch actions. Breakfast starts normally; other cases use legal UI chapter checkpoints. No inventory or post-checkpoint positions injected.',results:merged},null,2)+'\n');assert(results.every(r=>r.passed&&!r.errors.length),'Interaction failures need review');
