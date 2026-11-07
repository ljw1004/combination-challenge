#!/usr/bin/env node
// A legal shared-engine witness exercised through real browser pointer actions.
// Usage: node THIS_FILE STORY_URL STORY_FILE SCRATCH_OUTPUT
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chromium,expect} from '@playwright/test';
import {parseStory} from '../../../src/story/parser.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';
import {act,newGame,recipeFor} from '../../../src/engine/game.ts';

const [url,file,output]=process.argv.slice(2);
if(!output)throw new Error('Expected STORY_URL STORY_FILE SCRATCH_OUTPUT');
fs.mkdirSync(output,{recursive:true});
const source=fs.readFileSync(file,'utf8'),story=parseStory(source,{id:file,file});
const witness=checkpoint(story,story.chapters.length),route=[];
let logical=newGame(story);
for(const action of witness.actions){
  const recipe=action.type==='combine'?recipeFor(story,logical,action):null;
  const after=act(story,logical,action);
  if(['combine','advance'].includes(action.type))route.push({action,chapter:logical.chapter,result:recipe?.result.id,nextChapter:after.chapter,slots:recipe?after.tokens[recipe.result.id]?.slots:null});
  logical=after;
}
if(!logical.completed)throw new Error('Shared-engine witness did not finish');

const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[],badResponses=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)badResponses.push([r.status(),r.url()]);});
await page.emulateMedia({reducedMotion:'reduce'});
const item=id=>page.locator(`[data-item="${id}"],[data-hotspot="${id}"]`).last();
const state=()=>page.evaluate(()=>{
  const key=Object.keys(localStorage).find(k=>k.startsWith('combination-progress-v2:'));
  return key?JSON.parse(localStorage[key]).state:null;
});
async function dismiss(){
  for(let i=0;i<10;i++){
    const current=await state();if(!current?.pending.length)return;
    await page.getByRole('button',{name:current.pending[0].kind==='chapter'?'Begin':'Continue',exact:true}).click();
  }
  throw new Error('Reading queue did not settle');
}
async function checkImages(){
  const broken=await page.locator('img').evaluateAll(async images=>{
    await Promise.all(images.map(im=>im.decode().catch(()=>{})));
    return images.filter(im=>!im.naturalWidth).map(im=>im.src);
  });
  expect(broken).toEqual([]);
}
let step=0;
try{
  await page.goto(url);await page.getByRole('button',{name:'Start',exact:true}).click();await dismiss();
  for(const record of route){
    if(record.action.type==='advance'){
      await page.getByRole('button',{name:'Continue story',exact:true}).click();await dismiss();await checkImages();
      await page.screenshot({path:path.join(output,`chapter-${record.nextChapter+1}.png`)});
    }else{
      const before=await state(),count=before.actions.filter(a=>a.type==='combine').length;
      await item(record.action.a).dragTo(item(record.action.b??record.action.hotspot));
      await expect.poll(async()=>((await state()).actions.filter(a=>a.type==='combine').length),{timeout:12000}).toBe(count+1);
      await expect(item(record.result)).toBeAttached();
      for(const id of record.slots??[])await expect(item(record.result).locator(`[data-icon-slot="${id}"]`)).toBeAttached();
      await checkImages();await dismiss();
    }
    console.log('STEP',++step,record.chapter+1,record.action.type,record.result??'');
  }
  const final=await state();await page.reload();
  await expect.poll(async()=>((await state())?.chapter)).toBe(final.chapter);
  expect(final.completed).toBe(true);expect(errors).toEqual([]);expect(badResponses).toEqual([]);
  await page.screenshot({path:path.join(output,'final.png')});
  const outcome={story:file,sourceSha256:createHash('sha256').update(source).digest('hex'),steps:step,completed:final.completed,chapter:final.chapter,combinations:final.actions.filter(a=>a.type==='combine').length,errors,badResponses};
  fs.writeFileSync(path.join(output,'outcome.json'),JSON.stringify(outcome,null,2)+'\n');console.log(JSON.stringify(outcome));
}catch(error){
  await page.screenshot({path:path.join(output,'failure.png')});
  fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({step,record:route[step],error:String(error),state:await state(),errors,badResponses},null,2));throw error;
}finally{await browser.close();}
