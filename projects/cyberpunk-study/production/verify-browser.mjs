import {mkdirSync} from 'node:fs';
mkdirSync('runs/harbour-verification/art-final',{recursive:true});
import {chromium,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {loadStory} from '../../../src/story/load.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';
const {story,hash}=loadStory('projects/cyberpunk-study/harbour.md');
const end=checkpoint(story,story.chapters.length);
const width=process.argv.includes('--short')?320:390,height=width===320?568:844;const browser=await chromium.launch();const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
page.setDefaultTimeout(12000);await page.emulateMedia({reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));const missing=[];page.on('response',r=>{if(r.status()>=400)missing.push([r.status(),r.url()]);});
const save=()=>page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('combination-progress-v2:'));return k?JSON.parse(localStorage.getItem(k)).state:null;});
async function dismiss(){for(let i=0;i<20;i++){const b=page.getByRole('button',{name:/^(Begin|Continue)$/});if(!await b.count())break;await b.click();}}
async function handle(id){return page.locator(`[data-item=${JSON.stringify(id)}],[data-hotspot=${JSON.stringify(id)}]`).last();}
async function point(el){await el.scrollIntoViewIfNeeded();return el.evaluate(el=>{const r=el.getBoundingClientRect();for(const [dx,dy] of [[.5,.5],...[.12,.25,.4,.6,.75,.88].flatMap(x=>[.12,.25,.4,.6,.75,.88].map(y=>[x,y]))]){const x=r.x+r.width*dx,y=r.y+r.height*dy;const hit=document.elementFromPoint(x,y)?.closest('[data-item],[data-hotspot]');if(hit===el)return{x,y};}return null;});}
async function drag(a,b){const from=await handle(a),to=await handle(b);const start=await point(from);if(!start)throw Error('No exposed pickup point: '+a);const box=await to.boundingBox();if(!box)throw Error('Missing target: '+b);await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2,{steps:12});await page.mouse.up();}
await page.goto('http://127.0.0.1:4182/make-something.html?story=projects/cyberpunk-study/harbour.md');await page.getByRole('button',{name:'Start',exact:true}).click();await dismiss();
let combinations=0;const entries=[],readings=[];
try{
 for(const action of end.actions){
  if(action.type==='dismiss'){await dismiss();continue;}
  const before=await save();
  if(action.type==='advance'){
   await dismiss();const next=page.getByRole('button',{name:'Continue story',exact:true});
   if(await next.count())await next.click();else if(!before.completed)throw Error('No advance control in chapter '+before.chapter);
   await dismiss();const after=await save();entries.push({chapter:after.chapter+1,items:await page.locator('.chapter-panel').last().locator('[data-item],[data-hotspot]').count()});
   if([2,7,8,14,15,16,18,20,23,24,25,26,27].includes(after.chapter))await page.screenshot({path:`runs/harbour-verification/art-final/chapter-${width}-${after.chapter+1}.png`});
   console.log('chapter',after.chapter+1);continue;
  }
  if(action.type==='move'){if(action.hotspot)await drag(action.item,action.hotspot);continue;}
  if(action.type==='combine'){
   const count=before.actions.filter(a=>a.type==='combine').length;
   await drag(action.a,action.hotspot||action.b);
   await expect.poll(async()=>{const s=await save();return s.actions.filter(a=>a.type==='combine').length;},{timeout:5000}).toBe(count+1);
   const after=await save();combinations++;const performed=after.actions.filter(a=>a.type==='combine').at(-1);
   if(performed.a!==action.a||performed.b!==action.b||performed.hotspot!==action.hotspot){const expectedPair=[action.a,action.b].sort().join('|'),actualPair=[performed.a,performed.b].sort().join('|');if(expectedPair!==actualPair||performed.hotspot!==action.hotspot)throw Error('Unexpected combination: '+JSON.stringify({expected:action,actual:performed}));}
   if(after.pending.length&&[2,15,20,24,26].includes(after.chapter)){await page.screenshot({path:`runs/harbour-verification/art-final/reading-${width}-${after.chapter+1}-${combinations}.png`});readings.push(after.pending.map(x=>x.item));}
   await dismiss();
  }
 }
 const state=await save();if(!state.completed||errors.length||missing.length)throw Error('Incomplete route or browser/asset errors');writeFileSync(`runs/harbour-verification/browser-outcome-${width}.json`,JSON.stringify({hash,combinations,completed:state.completed,chapter:state.chapter,entries,errors,missing,readings},null,2));
 console.log(JSON.stringify({hash,combinations,completed:state.completed,chapter:state.chapter,errors,missing}));
}catch(e){await page.screenshot({path:'runs/harbour-verification/art-final/browser-failure.png'});console.error(e);writeFileSync(`runs/harbour-verification/browser-failure-${width}.json`,JSON.stringify({hash,combinations,error:e.message,state:await save()},null,2));process.exitCode=1;}
await browser.close();
