// Frame intact generated raster art and register the movable serving assemblies.
// Run from the repository root. No repainting, background removal or pixel editing.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from '@playwright/test';

const root=path.resolve(import.meta.dirname,'../../../..');
const project=path.join(root,'projects/cookbook-study/rework-art');
const live=path.join(root,'stories/cookbook/assets/rework');
const scratch=path.join(root,'runs/cookbook-art');
await fs.mkdir(scratch,{recursive:true});
const data=async p=>'data:image/png;base64,'+(await fs.readFile(p)).toString('base64');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1600,height:1800},deviceScaleFactor:1});
const registration={sources:{},compounds:{}};
const onlyBases=process.argv.includes('--bases-only');
try {
  const frame=async (file,rect,align="xMidYMid meet")=>{
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
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" preserveAspectRatio="${align}"><image href="${source}" width="${bounds.sourceWidth}" height="${bounds.sourceHeight}"/></svg>`;
  };
  const render=async (file,w,h,markup,scale=4)=>{
    await page.setViewportSize({width:Math.max(800,w*scale),height:Math.max(900,h*scale)});
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="${w*scale}" height="${h*scale}" viewBox="0 0 ${w} ${h}">${markup}</svg>`);
    await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(async e=>{const im=new Image();im.src=e.getAttribute('href');await im.decode();})));
    await page.locator('body > svg').screenshot({path:file,omitBackground:true});
  };
  for(const [slug,source] of [['afternoon-parlour','afternoon-parlour-final'],['dining-room','dining-room-bare-floor']]){
    const png=path.join(scratch,slug+'.png');
    await render(png,390,844,`<image href="${await data(path.join(project,'sources',source+'.png'))}" width="390" height="844" preserveAspectRatio="xMidYMid slice"/>`,2);
    execFileSync('cwebp',['-q','94','-m','6','-quiet',png,'-o',path.join(live,'backgrounds',slug+'.webp')]);
  }
  const defs=[
    {name:'tea-stand',source:'tea-stand',w:220,h:240,rect:[4,3,212,234],slots:[
      ['cucumber-finger-sandwiches',[31,173,70,41]],['scones',[52,96,56,44]],['brown-butter-biscuits',[64,45,92,30]],['jam-roll',[116,154,76,60]],
      ['whipped-cream',[115,87,46,43]],['soft-set-fruit-jam',[129,106,41,37]],
    ]},
    {name:'dining-table',source:'dining-table-constructed',w:300,h:290,rect:[5,20,290,267],slots:[
      ['bean-pie',[75,18,63,45]],['green-salad-with-croutons',[139,7,60,50]],['apple-juice',[208,0,45,54]],
      ['fruit-cream-tart',[109,52,59,40]],['vanilla-sandwich-cake',[176,42,73,50]],
      ['beef-wellington',[28,63,90,62]],['chocolate-profiteroles',[127,88,56,43]],['iced-chocolate-cake',[204,67,78,65]],
    ]},
  ];
  for(const def of defs){
    const base=await frame(path.join(project,'sources',def.source+'.png'),def.rect);
    const baseFile=path.join(live,'compounds',def.name+'.png');
    await render(baseFile,def.w,def.h,base);
    const layers=[];
    registration.compounds[def.name]={width:def.w*4,height:def.h*4,baseRect:def.rect,slots:[]};
    if(!onlyBases)for(const [slug,rect] of def.slots){
      const file=path.join(project,def.name==='dining-table'?'sources/fitted-dinner':'sources/fitted-tea',slug+'.png');
      const layer=await frame(file,rect,"xMidYMax meet");layers.push(layer);
      const filename=def.name==='dining-table'?`dining-table/${slug}.png`:`${def.name}-${slug}.png`;
      await fs.mkdir(path.dirname(path.join(live,'compounds',filename)),{recursive:true});
      await render(path.join(live,'compounds',filename),def.w,def.h,layer);
      registration.compounds[def.name].slots.push({item:slug,source:path.relative(root,file),file:filename,rect});
    }
    await render(path.join(scratch,def.name+'-filled.png'),def.w,def.h,base+layers.join(''),1);
    if(!onlyBases){
      // Empty, each single fitting, incremental assembly, either cake and both cakes.
      const masks=new Set([0,(1<<layers.length)-1,...layers.map((_,i)=>1<<i),...layers.map((_,i)=>(1<<(i+1))-1)]);
      if(def.name==='dining-table'){masks.add(127);masks.add(239);}
      const definitions=`<defs><g id="base">${base}</g>${layers.map((layer,i)=>`<g id="layer-${i}">${layer}</g>`).join('')}</defs>`;
      const cells=[];let index=0;
      for(const mask of masks){
        const selected=layers.flatMap((_,i)=>mask&(1<<i)?[`<use href="#layer-${i}"/>`]:[]);
        cells.push(`<g transform="translate(${(index%4)*(def.w+12)} ${Math.floor(index/4)*(def.h+22)})"><rect width="${def.w}" height="${def.h}" fill="#f4eee1"/><use href="#base"/>${selected.join('')}<text y="${def.h+14}" font-size="11">${mask}</text></g>`);index++;
      }
      await render(path.join(scratch,def.name+'-states.png'),4*(def.w+12),Math.ceil(cells.length/4)*(def.h+22),definitions+cells.join(''),1);
    }
  }
  await fs.writeFile(path.join(project,'serving-registration.json'),JSON.stringify(registration,null,2)+'\n');
} finally {await browser.close();}
console.log('Serving artwork exported; review composites in runs/cookbook-art.');
