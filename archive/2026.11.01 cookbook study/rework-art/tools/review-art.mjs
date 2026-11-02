// Disposable unnamed, actual-display-size material for independent recognition.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
const root=path.resolve(import.meta.dirname,'../../../..');
const project=path.join(root,'projects/cookbook-study/rework-art');
const output=path.join(root,'runs/cookbook-art');
await fs.mkdir(output,{recursive:true});
const catalogue=JSON.parse(await fs.readFile(path.join(project,'item-sizes.json'),'utf8'));
const records=(await Promise.all(['savory','tea-sauce'].map(async family=>JSON.parse(await fs.readFile(path.join(project,family+'-manifest.json'),'utf8')).items))).flat();
const bySlug=new Map(records.map(record=>[record.slug,record]));
if(bySlug.size!==records.length)throw new Error('Duplicate standalone entries in the export manifests');
for(const slug of Object.keys(catalogue.items))if(!bySlug.has(slug))throw new Error(`Export missing for ${slug}`);
for(const record of records)if(catalogue.items[record.slug]?.longestEdge!==record.intendedLongestEdge)throw new Error(`Export size is stale for ${record.slug}`);
// A stable mixed order avoids grouping related preparations or depending on an
// obsolete hand-maintained list. Names are confined to the separate answer key.
const order=slug=>createHash('sha256').update(slug).digest('hex');
const items=records.toSorted((a,b)=>order(a.slug).localeCompare(order(b.slug)));
const pictures=await Promise.all(items.map(async (item,index)=>{
 const bytes=await fs.readFile(path.join(root,item.output));
 return `<figure><figcaption>${index+1}</figcaption><img src="data:image/png;base64,${bytes.toString('base64')}" width="${item.displayWidth}" height="${item.displayHeight}" data-intrinsic-width="${item.width}" data-intrinsic-height="${item.height}"></figure>`;
}));
const columns=4,gap=8,padding=14;
const cellWidth=Math.ceil(Math.max(...items.map(item=>item.displayWidth)))+24;
const cellHeight=Math.ceil(Math.max(...items.map(item=>item.displayHeight)))+42;
const width=columns*cellWidth+(columns-1)*gap+padding*2;
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:${padding}px;background:#f4eee1;display:grid;grid-template-columns:repeat(${columns},${cellWidth}px);gap:${gap}px;font:13px sans-serif}figure{height:${cellHeight}px;margin:0;display:flex;align-items:center;justify-content:center;flex-direction:column;border:1px solid #ddd4c5}figcaption{height:22px}img{flex:none}</style>${pictures.join('')}`);
 await page.evaluate(async multiplier=>{
  for(const image of document.images){
   await image.decode();
   if(image.naturalWidth!==Number(image.dataset.intrinsicWidth)||image.naturalHeight!==Number(image.dataset.intrinsicHeight))throw new Error('Runtime dimensions do not match the export manifest');
   const bounds=image.getBoundingClientRect(),cell=image.closest('figure').getBoundingClientRect();
   if(Math.abs(bounds.width-image.naturalWidth/multiplier)>0.01||Math.abs(bounds.height-image.naturalHeight/multiplier)>0.01)throw new Error('Proof is not at reference display size');
   if(bounds.left<cell.left||bounds.right>cell.right||bounds.top<cell.top||bounds.bottom>cell.bottom)throw new Error('Proof cell clips an illustration');
  }
 },catalogue.intrinsicMultiplier);
 await page.screenshot({path:path.join(output,'anonymous-items.png'),fullPage:true});
 await fs.writeFile(path.join(output,'anonymous-key.json'),JSON.stringify(Object.fromEntries(items.map((item,index)=>[index+1,item.slug])),null,2)+'\n');
 console.log(`Prepared ${items.length} anonymous icons at their current display sizes; no clipping or manifest-size mismatches.`);
} finally {await browser.close();}
