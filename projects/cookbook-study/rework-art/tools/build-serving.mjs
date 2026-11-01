// Frame intact generated raster art and register the movable serving assemblies.
// Run from the repository root. No repainting, background removal or pixel editing.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from '@playwright/test';

const root=path.resolve(import.meta.dirname,'../../../..');
const project=path.join(root,'projects/cookbook-study/rework-art');
const live=path.join(root,'stories/cookbook/assets/rework');
const old=path.join(root,'stories/cookbook/assets/cooks-pen/items');
const scratch=path.join(root,'runs/cookbook-art');
await fs.mkdir(scratch,{recursive:true});
const data=async p=>'data:image/png;base64,'+(await fs.readFile(p)).toString('base64');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1600,height:1800},deviceScaleFactor:1});
const registration={sources:{},compounds:{}};
const onlyBases=process.argv.includes('--bases-only');
try {
  const frame=async (file,rect)=>{
    const source=await data(file);
    const bounds=await page.evaluate(async source=>{
      const im=new Image();im.src=source;await im.decode();
      const c=document.createElement('canvas');c.width=im.width;c.height=im.height;
      const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const rgba=ctx.getImageData(0,0,c.width,c.height).data;
      let l=c.width,t=c.height,r=0,b=0,transparent=0;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const a=rgba[(y*c.width+x)*4+3];if(a===0)transparent++;if(a>24){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}}
      if(transparent<c.width*c.height*.01)throw new Error('Expected genuine transparent source');
      l=Math.max(0,l-4);t=Math.max(0,t-4);r=Math.min(c.width,r+5);b=Math.min(c.height,b+5);
      return {x:l,y:t,width:r-l,height:b-t,sourceWidth:im.width,sourceHeight:im.height};
    },source);
    registration.sources[path.relative(root,file)]=bounds;
    const [x,y,w,h]=rect;
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" preserveAspectRatio="xMidYMid meet"><image href="${source}" width="${bounds.sourceWidth}" height="${bounds.sourceHeight}"/></svg>`;
  };
  const render=async (file,w,h,markup,scale=4)=>{
    await page.setViewportSize({width:Math.max(800,w*scale),height:Math.max(900,h*scale)});
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="${w*scale}" height="${h*scale}" viewBox="0 0 ${w} ${h}">${markup}</svg>`);
    await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(async e=>{const im=new Image();im.src=e.getAttribute('href');await im.decode();})));
    await page.locator('body > svg').screenshot({path:file,omitBackground:true});
  };
  for(const [slug,source] of [['afternoon-parlour','afternoon-parlour-final'],['dining-room','dining-room']]){
    const png=path.join(scratch,slug+'.png');
    await render(png,390,844,`<image href="${await data(path.join(project,'sources',source+'.png'))}" width="390" height="844" preserveAspectRatio="xMidYMid slice"/>`,2);
    execFileSync('cwebp',['-q','94','-m','6','-quiet',png,'-o',path.join(live,'backgrounds',slug+'.webp')]);
  }
  const defs=[
    {name:'tea-stand',source:'tea-stand',w:220,h:240,rect:[4,3,212,234],slots:[
      ['bread-and-butter',[26,169,77,43]],['scones',[121,102,66,43]],['brown-butter-biscuits',[34,108,65,37]],['sponge-cake',[79,30,68,46]],['soft-set-fruit-jam',[128,174,47,39]],
    ]},
    {name:'feast-table',source:'feast-table-elevated',w:320,h:260,rect:[4,37,312,215],slots:[
      ['beef-wellington',[26,27,86,49]],['bean-pie',[123,29,76,48]],['green-salad-with-croutons',[221,30,72,47]],
      ['apple-juice',[41,72,54,57]],['fruit-cream-tart',[119,83,82,49]],['chocolate-profiteroles',[218,84,76,48]],
      ['vanilla-sandwich-cake',[76,128,78,49]],['iced-chocolate-cake',[176,128,78,49]],
    ]},
  ];
  for(const def of defs){
    const base=await frame(path.join(project,'sources',def.source+'.png'),def.rect);
    const baseFile=path.join(live,'compounds',def.name+'.png');
    await render(baseFile,def.w,def.h,base);
    const layers=[];
    registration.compounds[def.name]={width:def.w*4,height:def.h*4,baseRect:def.rect,slots:[]};
    if(!onlyBases)for(const [slug,rect] of def.slots){
      let file=path.join(live,'items',slug+'.png');
      try{await fs.access(file);}catch{file=path.join(old,slug+'.png');}
      const layer=await frame(file,rect);layers.push(layer);
      const filename=(def.name==='feast-table'?'table':def.name)+'-'+slug+'.png';
      await render(path.join(live,'compounds',filename),def.w,def.h,layer);
      registration.compounds[def.name].slots.push({item:slug,source:path.relative(root,file),file:filename,rect});
    }
    await render(path.join(scratch,def.name+'-filled.png'),def.w,def.h,base+layers.join(''),1);
    if(!onlyBases){
      // Empty, each single fitting, incremental assembly, either cake and both cakes.
      const masks=new Set([0,(1<<layers.length)-1,...layers.map((_,i)=>1<<i),...layers.map((_,i)=>(1<<(i+1))-1)]);
      if(def.name==='feast-table'){masks.add(127);masks.add(191);}
      const cells=[];let index=0;
      for(const mask of masks){
        const selected=layers.filter((_,i)=>mask&(1<<i));
        cells.push(`<g transform="translate(${(index%4)*(def.w+12)} ${Math.floor(index/4)*(def.h+22)})"><rect width="${def.w}" height="${def.h}" fill="#f4eee1"/>${base}${selected.join('')}<text y="${def.h+14}" font-size="11">${mask}</text></g>`);index++;
      }
      await render(path.join(scratch,def.name+'-states.png'),4*(def.w+12),Math.ceil(cells.length/4)*(def.h+22),cells.join(''),1);
    }
  }
  await fs.writeFile(path.join(project,'serving-registration.json'),JSON.stringify(registration,null,2)+'\n');
} finally {await browser.close();}
console.log('Serving artwork exported; review composites in runs/cookbook-art.');
