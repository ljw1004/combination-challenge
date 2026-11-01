// Mechanical extraction, sizing and page composition for the retained station art.
// Source paintings and generation requests are preserved separately.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {pageFrame} from '../../page-composition/tools/page-frame.mjs';

const root=path.resolve(import.meta.dirname,'../../../..');
const project=path.join(root,'projects/cookbook-study/rework-art');
const original=path.join(root,'projects/cookbook-study/pencil-stations/production');
const runtime=path.join(root,'stories/cookbook/assets/rework');
const scratch=path.join(root,'runs/cookbook-art/stations');
await fs.mkdir(scratch,{recursive:true});
const stationFiles=new Map();
const registration=JSON.parse(await fs.readFile(path.join(original,'registration.json'),'utf8'));
const data=async file=>'data:image/png;base64,'+(await fs.readFile(file)).toString('base64');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:800,height:1700},deviceScaleFactor:1});
const records={reference:{width:390,height:844},stationFile:{width:528,height:384},stationDisplay:{width:132,height:96},stations:[],pages:[]};
const render=async(markup,file)=>{
 await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${markup}`);
 await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(el=>new Promise((ok,no)=>{const image=new Image();image.onload=ok;image.onerror=no;image.src=el.getAttribute('href')}))));
 await page.locator('body > svg').screenshot({path:file,omitBackground:true});
};
const stationSpecs=[
 {name:'cookstove',original:'stove'},
 {name:'warm-shelf',original:'warm-shelf'},
 {name:'oven',original:'oven'},
 {name:'mushroom-pan',original:'frying-pan'},
 ...['fruit-press','butter-churn','freezing-churn','hob'].map(name=>({name,opacity:.68})),
];
try{
 for(const spec of stationSpecs){
  let source,crop,opacity=spec.opacity;
  if(spec.original){const old=registration.stations[spec.original];source=path.resolve(original,old.source);crop=old.body;opacity=old.opacity;}
  else source=path.join(project,'sources/stations',spec.name+'.png');
  const sourceData=await data(source);
  const measured=await page.evaluate(async src=>{
   const image=new Image();image.src=src;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let left=canvas.width,top=canvas.height,right=0,bottom=0;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>32){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
   return {size:{width:canvas.width,height:canvas.height},crop:{x:left,y:top,width:right-left+1,height:bottom-top+1}};
  },sourceData);
  crop??=measured.crop;
  const fit=Math.min(118/crop.width,82/crop.height),width=crop.width*fit,height=crop.height*fit;
  const x=(132-width)/2,y=89-height;
  const standalone=['mushroom-pan','freezing-churn','hob'].includes(spec.name);
  const file=path.join(standalone?path.join(runtime,'stations'):scratch,spec.name+'.png');
  stationFiles.set(spec.name,file);
  await render(`<svg xmlns="http://www.w3.org/2000/svg" width="528" height="384" viewBox="0 0 132 96"><svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${crop.x} ${crop.y} ${crop.width} ${crop.height}" overflow="hidden" opacity="${opacity}"><image href="${sourceData}" width="${measured.size.width}" height="${measured.size.height}"/></svg></svg>`,file);
  records.stations.push({name:spec.name,source:path.relative(root,source),reused:!!spec.original,sourceSize:measured.size,crop,opacity,paintedBounds:{x,y,width,height},...(standalone?{file:path.relative(root,file)}:{embeddedOnly:true})});
 }
 await render('<svg xmlns="http://www.w3.org/2000/svg" width="528" height="384" viewBox="0 0 132 96"></svg>',path.join(runtime,'stations/receiving-area.png'));
 const scenes=[
  {name:'breakfast',source:path.join(project,'sources/backgrounds/breakfast.png'),offset:0,stations:[{name:'cookstove',id:'name:Cookstove',x:.27,y:.175},{name:'fruit-press',id:'name:Fruit press',x:.73,y:.175}]},
  {name:'dairy',source:path.join(root,'projects/cookbook-study/page-composition/images/milk-and-golden-butter.png'),offset:45,stations:[{name:'warm-shelf',id:'name:Warm shelf',x:.27,y:.17654028},{name:'butter-churn',id:'name:Butter churn',x:.73,y:.175}]},
  {name:'beef-wellington',source:path.join(project,'sources/backgrounds/beef-wellington.png'),offset:130,customFade:[660,690],stations:[{name:'hob',id:'id:wellington-hob',x:.27,y:.175},{name:'oven',id:'id:wellington-oven',x:.73,y:.175}]},
 ];
 for(const scene of scenes){
  const sourceData=await data(scene.source);
  let painting=pageFrame(sourceData,scene.offset);
  if(scene.customFade){const oldStart=(620+scene.offset-40)/844,oldEnd=(620+scene.offset)/844;painting=painting.replace(`offset="${oldStart}"`,`offset="${scene.customFade[0]/844}"`).replace(`offset="${oldEnd}"`,`offset="${scene.customFade[1]/844}"`);}
  const stations=await Promise.all(scene.stations.map(async station=>`<image href="${await data(stationFiles.get(station.name))}" x="${station.x*390-66}" y="${station.y*844-48}" width="132" height="96"/>`));
  const png=path.join(project,'production',scene.name+'.png'),webp=path.join(runtime,'backgrounds',scene.name+'.webp');
  await render(`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1688" viewBox="0 0 390 844">${painting}${stations.join('')}</svg>`,png);
  execFileSync('cwebp',['-q','94','-m','6','-quiet',png,'-o',webp]);
  records.pages.push({name:scene.name,source:path.relative(root,scene.source),frameOffset:scene.offset,...(scene.customFade?{fadeStart:scene.customFade[0],fadeEnd:scene.customFade[1]}:{}),png:path.relative(root,png),file:path.relative(root,webp),stationArtworkEmbedded:true,hotspots:scene.stations.map(station=>({...station,rectangle:{x:station.x*390-66,y:station.y*844-48,width:132,height:96},receivingIcon:'assets/rework/stations/receiving-area.png'}))});
 }
 await fs.writeFile(path.join(project,'production/stations-and-pages.json'),JSON.stringify(records,null,2)+'\n');
}finally{await browser.close();}
console.log('Exported eight station drawings, one transparent receiving rectangle, and three composed pages.');
