/** Lint separately; this checks final replay, complete artwork and actual browser decoding. */
import {readFileSync,readdirSync} from 'node:fs';
import {join,relative} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {loadStory} from '../../../src/story/load.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';
import {replay} from '../../../src/engine/game.ts';

const {story,hash}=loadStory('projects/cyberpunk-study/harbour.md');
const finish=checkpoint(story,story.chapters.length);
assert(finish.completed);assert.deepEqual(replay(story,finish.actions),finish);
assert(Object.values(story.items).every(i=>i.icon));
const base='projects/cyberpunk-study/harbour-assets';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(join(dir,d.name)):[join(dir,d.name)]);
const assets=files(base).sort(),digest=createHash('sha256');
for(const file of assets)digest.update(relative(base,file)+'\0').update(readFileSync(file));
const browser=await chromium.launch();
try{
  const page=await browser.newPage();
  const url=process.env.HARBOUR_PREVIEW_URL||'http://127.0.0.1:4182/';
  await page.setContent(`<meta charset="utf-8">${assets.map(f=>`<img width="60" height="60" src="${new URL(f,url).href}">`).join('')}`);
  const bad=await page.locator('img').evaluateAll(async images=>{
    const results=await Promise.allSettled(images.map(i=>i.decode()));
    return results.flatMap((r,i)=>r.status==='rejected'||!images[i].naturalWidth?[images[i].src]:[]);
  });
  assert.deepEqual(bad,[]);
}finally{await browser.close();}
console.log(JSON.stringify({hash,assetHash:digest.digest('hex'),decoded:assets.length,items:Object.keys(story.items).length,recipes:story.recipes.length,referenceCombinations:finish.actions.filter(a=>a.type==='combine').length,completed:finish.completed}));
