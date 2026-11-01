import {runDirectory} from '../../../tools/run-output.mjs';
const run=await runDirectory();
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../../../../src/story/parser.ts';import {checkpoint} from '../../../../../src/debug/checkpoint.ts';import {recipeFor} from '../../../../../src/engine/game.ts';import {jumpToChapter} from '../../../../../tests/debug-helpers.ts';
import {overlapsHotspot} from '../../../../../src/web/hotspot-view.ts';
import {coveredFraction} from '../../../../../src/web/arrival-layout.ts';
const project=path.resolve(import.meta.dirname,'..'),root=path.resolve(project,'../../../..'),markdown=await fs.readFile(path.join(root,'stories/cookbook/cookbook.md'),'utf8'),story=parseStory(markdown,{id:'cookbook'});
const storySha256=createHash('sha256').update(markdown).digest('hex');
const feastCakes=process.argv.find(a=>a.startsWith('--feast-cakes='))?.slice(14);
assert(!feastCakes||['chocolate','both'].includes(feastCakes),'Use --feast-cakes=chocolate or both');
// Change only the diagnostic planner's target, never the live manuscript or game rules.
const planningStory=structuredClone(story);
if(feastCakes){
 const feast=planningStory.chapters.find(c=>c.name==='A feast for the dining room');assert(feast);
 const goal=feast.goals[0],condition=structuredClone(goal.conditions[feastCakes==='chocolate'?1:0]);
 if(feastCakes==='both')condition.item.slots.push('name:Iced chocolate cake');
 goal.conditions=[condition];
}
const requested=process.argv.find(a=>a.startsWith('--chapters='))?.slice(11).split(',').map(Number),deviceSelection=process.argv.find(a=>a.startsWith('--devices='))?.slice(10).split(',');
const defaultNames=['Breakfast','Dairy','Home-made bread','Vinegar and salad dressing','Herb toast and apple compote','Fresh pasta and mushroom filling','Pasta with butter and toasted crumbs','Shortcrust and puff pastry','Béchamel and cheese sauce','Cauliflower cheese and baked noodles','Bottling and canning','Bread pudding and fruit tarts','Jam, syrup and marmalade','Sponge cake','Scones and brown-butter biscuits','Afternoon tea','Muffins and soda bread','Ice cream and sorbet','Meringues and macarons','Sundaes and Baked Alaska','Beef Wellington','A feast for the dining room'];
const shortPhoneNames=['Breakfast','Home-made bread','Bottling and canning','Bread pudding and fruit tarts','Jam, syrup and marmalade','Sponge cake','Scones and brown-butter biscuits','Afternoon tea','Muffins and soda bread','Ice cream and sorbet','Beef Wellington','A feast for the dining room'];
const selectChapters=names=>story.chapters.flatMap((chapter,index)=>names.includes(chapter.name)?[index]:[]);
const all=selectChapters(defaultNames),shortPhone=selectChapters(shortPhoneNames);
assert(all.length&&shortPhone.length,'Default chapter names must match the current story');
assert(!requested||requested.length&&requested.every(i=>Number.isInteger(i)&&story.chapters[i]?.goals.length),'Select current chapters with playable goals');
assert(!deviceSelection||deviceSelection.length&&deviceSelection.every(name=>['desktop','phone','short-phone'].includes(name)),'Unknown or empty device selection');
const filename=index=>`${String(index).padStart(2,'0')}-${story.chapters[index].name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}${feastCakes?'-'+feastCakes:''}`;
const output=path.join(run,'actions');await fs.mkdir(output,{recursive:true});const browser=await chromium.launch(),results=[];
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
  const a=await source.boundingBox();assert(a);
  const candidates=[.5,.2,.8].flatMap(x=>[.5,.2,.8].map(y=>({x:a.x+a.width*x,y:a.y+a.height*y})));
  const from=await source.evaluate((el,points)=>{
   const visible=points.filter(p=>document.elementFromPoint(p.x,p.y)?.closest('[data-item],[data-hotspot]')===el);
   const edge=p=>Math.min(p.y,innerHeight-p.y,p.x,innerWidth-p.x);
   // Prefer an exposed point outside the edge-scroll zone; stable sorting retains the centre preference.
   return visible.sort((p,q)=>Number(edge(q)>=48)-Number(edge(p)>=48))[0];
  },candidates);
  assert(from,'The source needs an exposed pickup point');
  async function targetPoint(){
   const box=await target.boundingBox();assert(box,'The receiving target must remain visible during the drag');
   const viewport=page.viewportSize();
   const coordinate=(start,size,limit)=>{
    const centre=start+size/2,low=Math.max(start+Math.min(8,size/4),48),high=Math.min(start+size-Math.min(8,size/4),limit-48);
    return low<=high?Math.max(low,Math.min(high,centre)):Math.max(1,Math.min(limit-1,centre));
   };
   return {x:coordinate(box.x,box.width,viewport.width),y:coordinate(box.y,box.height,viewport.height)};
  }
  const cdp=touch?await context.newCDPSession(page):undefined;
  const move=point=>cdp?cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]}):page.mouse.move(point.x,point.y);
  let released=false;
  try{
   if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});
   else{await page.mouse.move(from.x,from.y);await page.mouse.down();}
   for(let n=1;n<=10;n++){
    const to=await targetPoint();
    await move({x:from.x+(to.x-from.x)*n/10,y:from.y+(to.y-from.y)*n/10});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
   }
   // Edge scrolling can move the receiver after the last motion event. Re-measure immediately before release.
   await move(await targetPoint());
   if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   else await page.mouse.up();
   released=true;
  }finally{
   if(cdp){if(!released)await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();}
   else if(!released)await page.mouse.up();
  }
 }
 for(const chapter of requested??(device==='short-phone'?shortPhone:all)){
  const result={device,chapter,name:story.chapters[chapter].name,actions:[],errors:[]};
  try{
   if(chapter!==0||requested){if(!await page.locator('.story-editor').isVisible()&&!await page.locator('.mobile-debug').isVisible()){const toggle=page.getByRole('button',{name:'Toggle debug panel',exact:true});await toggle.focus();await toggle.press('Enter');}await jumpToChapter(page,story.chapters[chapter].name,true);await dismiss();}
   const panel=page.locator(`.chapter-panel[data-chapter="${chapter}"]`);await panel.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   const initial=await save(),planned=checkpoint(planningStory,chapter+1,initial.state),route=planned.actions.slice(initial.state.actions.length);
   for(const action of route){
    if(action.type==='advance')break;if(action.type==='dismiss'){await dismiss();continue;}
    const before=await save();
    if(action.type==='move'){
     // The planner can repeat a placement already settled by an earlier operation.
     // Leave it there, even when a newer ingredient now covers its pickup area.
     const token=before.state.tokens[action.item];
     if(token?.chapter===action.chapter&&token.hotspot===action.hotspot){result.actions.push({...action,accepted:false,alreadyPlaced:true});continue;}
     assert(action.hotspot&&action.chapter===chapter,'This station trial requires a current-page target.');await drag(item(action.item),station(action.hotspot,chapter));assert.equal((await save()).state.tokens[action.item].hotspot,action.hotspot);
    }else{
     assert.equal(action.type,'combine');const recipe=recipeFor(story,before.state,action);assert(recipe,'Planned recipe must be legal in the actual browser state');await drag(item(action.a),action.b?item(action.b):station(action.hotspot,chapter));await expect.poll(async()=>!!(await save()).state.tokens[recipe.result.id],{message:recipe.result.id}).toBe(true);
    }
    await dismiss();const after=await save();const accepted=after.state.actions.length>before.state.actions.length;assert(accepted||action.type==='move'&&before.state.tokens[action.item].hotspot===action.hotspot,'Ordinary input must record an action or preserve an already settled placement');result.actions.push({...action,accepted});
   }
   await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();await page.mouse.move(1,1);await panel.screenshot({path:path.join(output,`${filename(chapter)}-${device}-complete.png`),animations:'disabled'});
   const beforeReload=await save();await page.reload();await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();assert.deepEqual((await save()).state,beforeReload.state);result.reloadPreserved=true;
   await page.getByRole('button',{name:'Continue story',exact:true}).click();await dismiss();const next=await save();assert(next.state.chapter>chapter);result.advancedTo=next.state.chapter;
   const nextPanel=page.locator(`.chapter-panel[data-chapter="${next.state.chapter}"]`);await nextPanel.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   await nextPanel.evaluate(async el=>{await document.fonts.ready;await Promise.allSettled([...el.querySelectorAll('img')].map(image=>image.decode()));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
   const arrival=await nextPanel.evaluate(el=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};},box=rect(el);
    const items=[...el.querySelectorAll('.thing')].map(e=>({id:e.dataset.item,name:e.getAttribute('aria-label'),...rect(e)})),hotspots=[...el.querySelectorAll('.hotspot')].map(e=>({id:e.dataset.hotspot,name:e.getAttribute('aria-label'),circular:e.classList.contains('hotspot-circular'),...rect(e)}));
    const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1;
    return {items,hotspots,itemOverlaps:items.flatMap((a,i)=>items.slice(i+1).filter(b=>overlap(a,b)).map(b=>[a.name,b.name])),outside:[...items,...hotspots].filter(r=>r.x<Math.max(0,box.x)-1||r.right>Math.min(innerWidth,box.right)+1||r.y<Math.max(0,box.y)-1||r.bottom>Math.min(innerHeight,box.bottom)+1),failed:[...el.querySelectorAll('img')].filter(image=>!image.complete||!image.naturalWidth).map(image=>image.src),overflow:document.documentElement.scrollWidth>innerWidth};
   });
   const overlaps=arrival.items.flatMap(i=>arrival.hotspots.filter(h=>overlapsHotspot({x:i.x+.5,y:i.y+.5,width:Math.max(0,i.width-1),height:Math.max(0,i.height-1)},h)).map(h=>({item:i.id,hotspot:h.id,names:[i.name,h.name]})));
   const ending=next.state.completed&&next.state.chapter===story.chapters.length-1&&!story.chapters[next.state.chapter].image;
   if(ending)assert(arrival.items.some(item=>item.id==='name:Feast table'),'The completed feast must remain visible in the dining room');
   const endingPlacements=ending?story.chapters[next.state.chapter-1].goals.flatMap(goal=>goal.conditions.filter(condition=>condition.hotspot)):[];
   // Only the final inherited goal placement may deliberately occupy a station.
   const allowedEndingOverlaps=overlaps.filter(pair=>endingPlacements.some(condition=>condition.item.id===pair.item&&condition.hotspot===pair.hotspot));
   const itemCoverage=arrival.items.map(item=>({id:item.id,name:item.name,fraction:coveredFraction(item,arrival.items.filter(other=>other!==item))})),itemOverlapFindings=itemCoverage.filter(item=>item.fraction>.1+1e-6);
   result.nextArrival={...arrival,itemCoverage,itemOverlapFindings,stationOverlaps:overlaps.filter(pair=>!allowedEndingOverlaps.includes(pair)).map(pair=>pair.names),allowedEndingOverlaps};
   assert.equal(result.nextArrival.stationOverlaps.length,0,'Ordinary carry must leave the new stations clear');
   assert.equal(itemOverlapFindings.length+arrival.outside.length+arrival.failed.length+Number(arrival.overflow),0,'Next arrival must fit within the UX item-overlap allowance without missing artwork');
   result.passed=true;
  }catch(error){result.error=error.stack;result.passed=false;await page.screenshot({path:path.join(output,`${filename(chapter)}-${device}-failure.png`)});}
  result.errors=[...errors];results.push(result);await fs.writeFile(path.join(output,`${filename(chapter)}-${device}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({device,chapter,name:story.chapters[chapter].name,passed:result.passed,actions:result.actions.length,error:result.error?.split('\n')[0]}));
 }
 await context.close();
}
await browser.close();let previous=[];if(requested||deviceSelection)previous=await fs.readFile(path.join(run,`interaction-review${feastCakes?'-'+feastCakes:''}.json`),'utf8').then(JSON.parse).then(r=>r.storySha256===storySha256?r.results:[]).catch(()=>[]);const merged=[...previous.filter(r=>!results.some(n=>n.device===r.device&&n.chapter===r.chapter)),...results];await fs.writeFile(path.join(run,`interaction-review${feastCakes?'-'+feastCakes:''}.json`),JSON.stringify({type:'Ordinary mouse/Chromium-emulated touch actions. Breakfast starts normally; other cases use legal UI chapter checkpoints. No inventory or post-checkpoint positions injected.',storySha256,defaultChapters:defaultNames.filter(name=>story.chapters.some(chapter=>chapter.name===name)),results:merged},null,2)+'\n');assert(results.every(r=>r.passed&&!r.errors.length),'Interaction failures need review');
