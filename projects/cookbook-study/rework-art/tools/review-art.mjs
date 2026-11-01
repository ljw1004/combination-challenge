// Disposable unnamed, actual-display-size material for independent recognition.
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
const root=path.resolve(import.meta.dirname,'../../../..');
const dir=path.join(root,'stories/cookbook/assets/rework/items');
const output=path.join(root,'runs/cookbook-art');
await fs.mkdir(output,{recursive:true});
const slugs=['seared-beef-fillet','tea-leaves','white-roux','bread-and-butter','mushrooms','sweetened-brown-butter','unbaked-wellington','pot-of-tea','ravioli-with-brown-butter','jar-opener','cheese-sauce','brown-butter-biscuits','mushroom-coated-beef','boiling-water','buttered-noodles','bechamel','beef-fillet','biscuit-dough','noodles-with-toasted-crumbs','chopped-mushrooms','brown-butter','beef-wellington','mushroom-filling'];
const pictures=await Promise.all(slugs.map(async (slug,i)=>`<figure><figcaption>${String.fromCharCode(65+i)}</figcaption><img src="data:image/png;base64,${(await fs.readFile(path.join(dir,slug+'.png'))).toString('base64')}"></figure>`));
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:600,height:800},deviceScaleFactor:1});
 await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:14px;background:#f4eee1;display:grid;grid-template-columns:repeat(4,140px);gap:4px;font:13px sans-serif}figure{height:118px;margin:0;display:flex;align-items:center;justify-content:center;flex-direction:column;border:1px solid #ddd4c5}figcaption{height:22px}img{object-fit:contain}</style>${pictures.join('')}`);
 await page.evaluate(async()=>{for(const im of document.images){await im.decode();im.style.width=im.naturalWidth/4+'px';im.style.height=im.naturalHeight/4+'px';}});
 await page.screenshot({path:path.join(output,'anonymous-items.png'),fullPage:true});
 await fs.writeFile(path.join(output,'anonymous-key.json'),JSON.stringify(Object.fromEntries(slugs.map((slug,i)=>[String.fromCharCode(65+i),slug])),null,2)+'\n');
} finally {await browser.close();}
