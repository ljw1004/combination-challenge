import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

// Mechanical framing only: native SVG scales the intact generated raster.
// Run from the repository root after generating the retained source PNGs.
const project = 'projects/cookbook-study/rework-art';
const runtime = 'stories/cookbook/assets/rework/items';
const entries = [
  ['brown-butter',320,240], ['sweetened-brown-butter',320,240],
  ['biscuit-dough',320,240], ['brown-butter-biscuits',320,240],
  ['tea-leaves',320,240], ['boiling-water',320,240],
  ['pot-of-tea',320,240], ['jar-opener',320,240],
  ['white-roux',380,260], ['bechamel',380,260], ['cheese-sauce',380,260],
  ['bread-and-butter',416,276],
];
const browser = await chromium.launch();
const page = await browser.newPage({deviceScaleFactor:1});
const manifest = [];
try {
  for (const [slug,width,height] of entries) {
    const source = `${project}/sources/${slug}.png`;
    const bytes = await fs.readFile(source);
    const data = `data:image/png;base64,${bytes.toString('base64')}`;
    const measured = await page.evaluate(async data => {
      const image = new Image(); image.src=data; await image.decode();
      const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
      const context=c.getContext('2d');context.drawImage(image,0,0);
      const pixels=context.getImageData(0,0,c.width,c.height).data;
      let left=c.width,top=c.height,right=-1,bottom=-1,transparent=0;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
        const a=pixels[(y*c.width+x)*4+3];
        if(a===0)transparent++;
        if(a>3){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
      }
      if(right<left||transparent<100)throw new Error('Invalid or nontransparent source');
      return {sourceWidth:c.width,sourceHeight:c.height,transparentPixels:transparent,bounds:{x:left,y:top,width:right-left+1,height:bottom-top+1}};
    },data);
    const padding=8;
    const b=measured.bounds;
    const scale=Math.min((width-padding*2)/b.width,(height-padding*2)/b.height);
    const x=(width-b.width*scale)/2-b.x*scale;
    const y=(height-b.height*scale)/2-b.y*scale;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="${data}" x="${x}" y="${y}" width="${measured.sourceWidth*scale}" height="${measured.sourceHeight*scale}"/></svg>`;
    await page.setViewportSize({width,height});
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await page.locator('svg image').evaluate(async e=>{const i=new Image();i.src=e.getAttribute('href');await i.decode();});
    const output=`${runtime}/${slug}.png`;
    await page.screenshot({path:output,omitBackground:true});
    const editInputs={
      'white-roux':[`${project}/sources/saucepan-structural-source.png`],
      'bechamel':[`${project}/sources/saucepan-structural-source.png`],
      'cheese-sauce':[`${project}/sources/bechamel.png`],
      'bread-and-butter':['stories/cookbook/assets/cooks-pen/items/bread-and-butter.png'],
      'biscuit-dough':[`${project}/sources/biscuit-dough-before-repair.png`],
      'jar-opener':[`${project}/sources/jar-opener-before-repair.png`],
    };
    const revised=['white-roux','biscuit-dough','jar-opener'].includes(slug);
    manifest.push({slug,source,prompt:`${project}/prompts/${slug}${revised?'-revision':''}.txt`,editInputs:editInputs[slug]??[],output,width,height,displayWidth:width/4,displayHeight:height/4,padding,scale,...measured,sourceSha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  await fs.writeFile(`${project}/tea-sauce-manifest.json`,JSON.stringify({generator:'Built-in image_gen',framing:'Native SVG scaling and padding; no painted changes',items:manifest},null,2)+'\n');
  await fs.mkdir('runs/cookbook-art',{recursive:true});
  const cells=[];
  for(const m of manifest){const d=await fs.readFile(m.output);cells.push(`<figure><div style="height:76px;display:flex;align-items:center;justify-content:center"><img src="data:image/png;base64,${d.toString('base64')}" width="${m.displayWidth}" height="${m.displayHeight}"></div><figcaption>${m.slug}</figcaption></figure>`);}
  await page.setViewportSize({width:720,height:510});
  await page.setContent(`<html><body style="margin:0;padding:18px;background:#f6f0df;color:#493f31;font:12px Georgia"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${cells.join('')}</div><style>figure{margin:0;padding:12px 4px;border:1px solid #d9ceba;text-align:center}figcaption{margin-top:10px}</style></body></html>`);
  await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
  await page.screenshot({path:'runs/cookbook-art/tea-sauce-at-size.png'});
  console.log(`Exported ${manifest.length} tea/sauce icons and manifest.`);
} finally {await browser.close();}
