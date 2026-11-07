import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {chromium, expect} from '@playwright/test';
import {parseStory} from '../../../src/story/parser.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';

// Source-aware browser coverage, not a fresh-player or enjoyment test.
// Run against this version’s Vite preview config on port 5174. Every story action uses ordinary UI controls/drags.
const source=fs.readFileSync(new URL('./mars.md',import.meta.url),'utf8');
const story=parseStory(source,{id:'mars'});
const route=checkpoint(story,story.chapters.length).actions;
const output=path.resolve(process.argv[2]??'runs/mars-rewrite/browser');
if(!output.startsWith(path.resolve('runs')+path.sep))throw Error('Output must stay under runs/');
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch();
const summaries=[];
try{
  for(const width of [390,320]){
    const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
    const page=await context.newPage();
    page.setDefaultTimeout(5000);
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:5174/combinations.html?story=mars.md');
    await page.getByRole('button',{name:'Start',exact:true}).click();
    const state=()=>page.evaluate(()=>{
      const key=Object.keys(localStorage).find(k=>k.startsWith('combination-progress-v2:'));
      return key?JSON.parse(localStorage.getItem(key)).state:null;
    });
    await expect.poll(state).not.toBeNull();
    const item=id=>page.locator(`[data-item=${JSON.stringify(id)}]`);
    const hotspot=(id,chapter)=>page.locator(`.chapter-panel[data-chapter="${chapter}"] [data-hotspot=${JSON.stringify(id)}]`);
    let captures=0,peak=0;
    async function inspect(tag){
      const current=await state();
      const geometry=await page.locator(`.chapter-panel[data-chapter="${current.chapter}"] .thing`).evaluateAll(els=>els.map(el=>{
        const b=el.getBoundingClientRect();
        return {id:el.dataset.item,x:b.x,y:b.y,w:b.width,h:b.height,clipped:el.scrollWidth>el.clientWidth};
      }));
      peak=Math.max(peak,geometry.length);
      for(const box of geometry){
        assert(!box.clipped,`Clipped text: ${box.id}`);
        assert(box.x>=-1&&box.x+box.w<=width+1,`Horizontal overflow: ${box.id}`);
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflow');
      await page.screenshot({path:path.join(output,`${width}-${String(captures++).padStart(2,'0')}-${tag}.png`)});
    }
    async function drag(from,to){
      await from.scrollIntoViewIfNeeded();
      const a=await from.boundingBox(),b=await to.boundingBox();
      assert(a&&b,'Missing drag operand');
      await page.mouse.move(a.x+a.width/2,a.y+a.height/2);
      await page.mouse.down();
      await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});
      await page.mouse.up();
    }
    for(let index=0;index<route.length;index++){
      const action=route[index],before=await state();
      const count=before.actions.length;
      if(action.type==='dismiss'){
        await page.locator('dialog [data-command="dismiss"]').click();
        if(!((await state()).pending.length))await inspect(`chapter-${before.chapter}`);
      }else if(action.type==='advance'){
        await page.getByRole('button',{name:'Continue story',exact:true}).click();
      }else if(action.type==='move'){
        let operand=action.item;
        // Exercise the reciprocal receiver for contextual two-input recipes.
        const next=route[index+1];
        if(width===320&&next?.type==='combine'&&next.b&&next.hotspot===action.hotspot&&next.b===operand)operand=next.a;
        assert(action.hotspot,'Witness unexpectedly needs a free placement');
        if(before.tokens[operand]?.hotspot===action.hotspot&&before.tokens[operand]?.chapter===action.chapter)continue;
        await drag(item(operand),hotspot(action.hotspot,action.chapter));
      }else if(action.type==='combine'){
        let a=action.a,b=action.b;
        if(width===320&&b){[a,b]=[b,a];}
        await drag(item(a),b?item(b):hotspot(action.hotspot,before.chapter));
      }else throw Error(`Unsupported witness action: ${action.type}`);
      await expect.poll(async()=>(await state()).actions.length).toBe(count+1);
      const after=await state();
      const actual=after.actions.at(-1);
      if(action.type==='move'&&actual.type==='combine'){
        // Dropping onto an occupied hotspot can perform the next combination
        // directly; the logical planner sometimes lists a preparatory move.
        const next=route[++index];
        assert.equal(next?.type,'combine');
        assert.equal(actual.hotspot,next.hotspot);
        assert.deepEqual([actual.a,actual.b].sort(),[next.a,next.b].sort());
      }else assert.equal(actual.type,action.type,`Wrong action at ${index}`);
      if(action.type==='combine'&&!after.pending.length)await inspect(`result-${index}`);
      if(action.type==='combine'&&index%3===0){
        const logical=JSON.stringify(after);
        await page.reload();
        await expect.poll(async()=>JSON.stringify(await state())).toBe(logical);
      }
    }
    const final=await state();
    assert(final.completed,'The ordinary browser route did not finish');
    assert.deepEqual(errors,[]);
    await inspect('ending');
    summaries.push({width,completed:final.completed,combinations:final.actions.filter(a=>a.type==='combine').length,placements:final.actions.filter(a=>a.type==='move').length,peak,captures,pageErrors:errors});
    await context.close();
  }
}finally{await browser.close();}
fs.writeFileSync(path.join(output,'outcomes.json'),JSON.stringify(summaries,null,2)+'\n');
console.log(JSON.stringify(summaries,null,2));
