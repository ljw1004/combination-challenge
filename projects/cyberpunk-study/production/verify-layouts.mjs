import {mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('runs/harbour-verification/art-final',{recursive:true});
import {chromium} from '@playwright/test';import {writeFileSync} from 'node:fs';import {loadStory} from '../../../src/story/load.ts';import {jumpToChapter} from '../../../tests/debug-helpers.ts';
const {story,hash}=loadStory('projects/cyberpunk-study/harbour.md');const browser=await chromium.launch();const results=[],errors=[];
for(const [width,height] of (process.argv.includes('--short')?[[320,568]]:[[320,568],[390,844],[1440,900]])){
 const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});p.setDefaultTimeout(15000);await p.emulateMedia({reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4182/make-something.html?story=projects/cyberpunk-study/harbour.md');await p.getByRole('button',{name:'Start',exact:true}).waitFor();await p.locator('.scene-art').evaluate(el=>el.decode());await p.screenshot({path:`runs/harbour-verification/art-final/cover-${width}.png`});await p.getByRole('button',{name:'Start',exact:true}).click();await p.getByRole('button',{name:'Begin',exact:true}).click();
 for(let c=0;c<story.chapters.length-1;c++){
  if(c) {await jumpToChapter(p,story.chapters[c].name,true);await p.getByRole('button',{name:'Begin',exact:true}).click();}
  const summary=await p.locator('.chapter-panel').last().evaluate(panel=>{
   const nodes=[...panel.querySelectorAll('[data-item],[data-hotspot]')];const goals=document.querySelector('.hud-stack,.chapter-next')?.getBoundingClientRect();
   return nodes.map(el=>{const r=el.getBoundingClientRect();let exposed=false;for(const dx of [.15,.3,.5,.7,.85])for(const dy of [.15,.3,.5,.7,.85]){const x=r.x+r.width*dx,y=r.y+r.height*dy;const hit=document.elementFromPoint(x,y)?.closest('[data-item],[data-hotspot]');if(hit===el)exposed=true;}return {id:el.getAttribute('data-item')||el.getAttribute('data-hotspot'),x:r.x,y:r.y,width:r.width,height:r.height,exposed,offscreen:r.x<-.5||r.y<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5,goalsOverlap:!!goals&&r.bottom>goals.top&&r.right>goals.left&&r.left<goals.right};});
  });results.push({width,height,chapter:c+1,items:summary});
  if([8,14,15,16,18,19,20,24,25,26].includes(c))await p.screenshot({path:`runs/harbour-verification/art-final/layout-${width}-${c+1}.png`});
 }
 await p.close();console.log('checked',width,height);
}
await browser.close();writeFileSync('runs/harbour-verification/layout-outcome.json',JSON.stringify({hash,results,errors},null,2));console.log(JSON.stringify({hash,boards:results.length,errors,problems:results.flatMap(r=>r.items.filter(i=>!i.exposed||i.offscreen||i.goalsOverlap).map(i=>({viewport:r.width,chapter:r.chapter,...i})))}));
assert.deepEqual(errors,[], 'Browser reported page errors');
assert(results.every(r=>r.items.every(i=>i.exposed&&!i.offscreen&&!i.goalsOverlap)), 'An item is concealed, offscreen or overlaps the goals control');
