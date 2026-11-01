import {chromium} from '@playwright/test';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
import {createHash} from 'node:crypto';

// Mechanical framing only: measure alpha, crop, scale proportionally and pad.
// Source drawings are kept intact. Native SVG rasterizes the final PNGs.
const root=resolve(import.meta.dirname,'../../../..');
const project=resolve(root,'projects/cookbook-study/rework-art');
const output=resolve(root,'stories/cookbook/assets/rework/items');
const scratch=resolve(root,'runs/cookbook-art');
const slugs=['mushrooms','chopped-mushrooms','mushroom-filling','buttered-noodles','noodles-with-toasted-crumbs','ravioli-with-brown-butter','beef-fillet','seared-beef-fillet','mushroom-coated-beef','unbaked-wellington','beef-wellington'];
const references={
 'buttered-noodles':'stories/cookbook/assets/cooks-pen/items/herb-buttered-noodles.png',
 'noodles-with-toasted-crumbs':'projects/cookbook-study/rework-art/sources/noodles-with-toasted-crumbs-v1.png',
 'ravioli-with-brown-butter':'stories/cookbook/assets/cooks-pen/items/ravioli-with-herb-butter.png',
 'seared-beef-fillet':'projects/cookbook-study/rework-art/sources/beef-fillet.png',
};
await mkdir(output,{recursive:true});await mkdir(scratch,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:960,height:800},deviceScaleFactor:1});
const records=[];
try{
 for(const slug of slugs){
  const path=resolve(project,'sources',slug+'.png'),bytes=await readFile(path),data='data:image/png;base64,'+bytes.toString('base64');
  const frame=await page.evaluate(async data=>{
   const image=new Image();image.src=data;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
   const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
   const rgba=context.getImageData(0,0,image.width,image.height).data;
   let left=image.width,top=image.height,right=0,bottom=0,transparent=0;
   for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
    const a=rgba[(y*image.width+x)*4+3];if(a===0)transparent++;
    if(a>16){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
   }
   if(transparent<image.width*image.height*.01)throw new Error('Opaque source');
   const x=Math.max(0,left-5),y=Math.max(0,top-5),w=Math.min(image.width,right+6)-x,h=Math.min(image.height,bottom+6)-y;
   return {x,y,width:w,height:h,sourceWidth:image.width,sourceHeight:image.height,transparentPixels:transparent};
  },data);
  const scale=Math.min(308/frame.width,228/frame.height),w=frame.width*scale,h=frame.height*scale,x=(320-w)/2,y=(240-h)/2;
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${frame.x} ${frame.y} ${frame.width} ${frame.height}"><image href="${data}" width="${frame.sourceWidth}" height="${frame.sourceHeight}"/></svg></svg>`);
  await page.locator('svg').first().screenshot({path:resolve(output,slug+'.png'),omitBackground:true});
  records.push({slug,source:relative(root,path),sha256:createHash('sha256').update(bytes).digest('hex'),prompt:'projects/cookbook-study/rework-art/prompts/'+slug+'.txt',reference:references[slug]??null,method:'built-in image_gen',crop:frame,output:relative(root,resolve(output,slug+'.png')),intrinsic:[320,240],display:[80,60],drawing:{x,y,width:w,height:h},...(slug==='noodles-with-toasted-crumbs'?{revision:2,superseded:{source:'projects/cookbook-study/rework-art/sources/noodles-with-toasted-crumbs-v1.png',prompt:'projects/cookbook-study/rework-art/prompts/noodles-with-toasted-crumbs-v1.txt',reference:'stories/cookbook/assets/cooks-pen/items/noodles-with-toasted-crumbs.png',reason:'Dense dark topping was mistaken for meat sauce. Revision uses a lighter sparse dry breadcrumb scattering and exposed noodles.'}}:{})});
 }
 await writeFile(resolve(project,'savory-manifest.json'),JSON.stringify({schemaVersion:1,method:'Alpha measurement at threshold 16; 5px source padding; proportionate fit within 308×228 and centered on 320×240 transparent canvas. Native SVG rendering; no repainting.',items:records},null,2)+'\n');
 const cells=await Promise.all(records.map(async r=>`<div><img src="data:image/png;base64,${(await readFile(resolve(root,r.output))).toString('base64')}"/><p>${r.slug}</p></div>`));
 await page.setContent(`<style>body{margin:0;background:#f5eedb;color:#453e32;font:12px Georgia}main{display:grid;grid-template-columns:repeat(3,170px);gap:16px;padding:24px}main div{text-align:center}img{width:80px;height:60px}p{margin:6px 0 0}</style><main>${cells.join('')}</main>`);
 await page.locator('main').screenshot({path:resolve(scratch,'savory-display-proof.png')});
 console.log(`Exported ${records.length} savoury icons, each 320×240, with transparency checked.`);
}finally{await browser.close();}
