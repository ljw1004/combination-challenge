// Requested comparison deliverables. Native framing only; drawings are unchanged.
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
const project=import.meta.dirname, root=path.resolve(project,'../../..');
const items=[['flour','Flour'],['self-raising-flour','Self-raising flour'],['sugar','Sugar'],['confectioners-sugar','Confectioner’s sugar']];
const browser=await chromium.launch();
try {
 const page=await browser.newPage({deviceScaleFactor:1});
 const rows=[];
 for(const [slug,name] of items){
  const pics=[];
  for(const family of ['cooks-pen','rework']){
   const file=path.join(root,`stories/cookbook/assets/${family}/items/${slug}.png`);
   const src='data:image/png;base64,'+(await fs.readFile(file)).toString('base64');
   const size=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();return {width:im.naturalWidth/4,height:im.naturalHeight/4};},src);
   pics.push({src,...size});
  }
  rows.push({name,pics});
 }
 for(const small of [false,true]){
  const width=small?640:820, rowHeight=small?115:220, labelWidth=small?170:190;
  const content=rows.map(({name,pics})=>`<section><h2>${name}</h2>${pics.map(p=>`<div class="picture"><img src="${p.src}" style="${small?`width:${p.width}px;height:${p.height}px`:'max-width:220px;max-height:184px'}"></div>`).join('')}</section>`).join('');
  await page.setViewportSize({width,height:1100});
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#f5efdf;color:#493e30;font-family:Georgia,serif}main{width:${width}px;padding:24px}h1{font-size:${small?22:28}px;font-weight:normal;margin:0 0 10px}p{font:13px system-ui;margin:0 0 24px;color:#756851}.head,section{display:grid;grid-template-columns:${labelWidth}px 1fr 1fr;align-items:center}.head{text-align:center;font:14px system-ui;padding-bottom:12px}section{height:${rowHeight}px;border-top:1px solid #d8ceba}h2{font-weight:normal;font-size:${small?17:20}px;padding-right:16px}.picture{display:flex;align-items:center;justify-content:center}img{display:block;object-fit:contain}</style><main><h1>Flour and sugar — selected directions</h1><p>${small?'At the game’s 390 × 844 reference viewport.':'Enlarged comparison; see the companion sheet for game-size drawings.'}</p><div class="head"><span></span><span>Previous</span><span>Selected</span></div>${content}</main>`);
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await page.locator('main').screenshot({path:path.join(project,small?'selected-at-game-size.png':'selected.png')});
 }
} finally {await browser.close();}
console.log('Powder comparison sheets rendered at enlarged and game sizes.');
