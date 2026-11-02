import {chromium} from '@playwright/test';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
import {createHash} from 'node:crypto';
import {exportItem,displayProof} from './item-framing.mjs';

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
 'ravioli-with-brown-butter':'projects/cookbook-study/rework-art/sources/ravioli-with-brown-butter-before-herbs.png',
 'seared-beef-fillet':'projects/cookbook-study/rework-art/sources/beef-fillet.png',
};
await mkdir(output,{recursive:true});await mkdir(scratch,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:960,height:800},deviceScaleFactor:1});
const records=[];
try{
 for(const slug of slugs){
  const path=resolve(project,'sources',slug+'.png'),bytes=await readFile(path),data='data:image/png;base64,'+bytes.toString('base64');
  const framed=await exportItem(page,{data,slug,output:resolve(output,slug+'.png')});
  const promptSlug=slug==='ravioli-with-brown-butter'?slug+'-herbs':slug;
  records.push({slug,source:relative(root,path),sha256:createHash('sha256').update(bytes).digest('hex'),prompt:'projects/cookbook-study/rework-art/prompts/'+promptSlug+'.txt',reference:references[slug]??null,method:'built-in image_gen',output:relative(root,resolve(output,slug+'.png')),...framed,intrinsic:[framed.width,framed.height],display:[framed.displayWidth,framed.displayHeight],...(slug==='noodles-with-toasted-crumbs'?{revision:2,superseded:{source:'projects/cookbook-study/rework-art/sources/noodles-with-toasted-crumbs-v1.png',prompt:'projects/cookbook-study/rework-art/prompts/noodles-with-toasted-crumbs-v1.txt',reference:'stories/cookbook/assets/cooks-pen/items/noodles-with-toasted-crumbs.png',reason:'Dense dark topping was mistaken for meat sauce. Revision uses a lighter sparse dry breadcrumb scattering and exposed noodles.'}}:{}),...(slug==='ravioli-with-brown-butter'?{revision:2,superseded:{source:references[slug],prompt:'projects/cookbook-study/rework-art/prompts/ravioli-with-brown-butter.txt',reference:'stories/cookbook/assets/cooks-pen/items/ravioli-with-herb-butter.png',reason:'Add the sage leaves now used when finishing the ravioli in brown butter.'}}:{})});
 }
 await writeFile(resolve(project,'savory-manifest.json'),JSON.stringify({schemaVersion:2,sizeCatalogue:'projects/cookbook-study/rework-art/item-sizes.json',method:'Visible alpha bounds above 16 set each intended extent; natural proportions, faint-mark crop above alpha 3 and 1px display padding. Native SVG rendering at 4× display size; no repainting.',items:records},null,2)+'\n');
 await displayProof(page,{items:records.map(record=>({...record,output:resolve(root,record.output)})),output:resolve(scratch,'savory-display-proof.png')});
 console.log(`Exported ${records.length} savoury icons at their individual intended sizes, with transparency checked.`);
}finally{await browser.close();}
