import {runDirectory} from '../../../tools/run-output.mjs';
const run=await runDirectory();
// Deterministic native SVG framing/export of generated raster sources. Run from
// anywhere; missing atlases are reported and a later invocation fills them in.
import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,relative,extname} from 'node:path';
import {createHash} from 'node:crypto';

const production=resolve(import.meta.dirname,'..'),root=resolve(production,'../../../..');
const catalogue=JSON.parse(await readFile(resolve(production,'catalogue/catalogue.json'),'utf8'));
const overrides=JSON.parse(await readFile(resolve(production,'tools/framing-overrides.json'),'utf8'));
const only=process.argv.find(a=>a.startsWith('--batch='))?.slice(8);
const force=process.argv.includes('--force'),proofsOnly=process.argv.includes('--proofs-only');
const preview=process.argv.includes('--preview');
const itemDir=preview?resolve(run,'items'):resolve(root,'stories/cookbook/assets/cooks-pen/items'),slotDir=preview?resolve(run,'slots'):resolve(root,'stories/cookbook/assets/cooks-pen/slots');
const proofDir=resolve(run,'item-sheets');
for(const dir of [itemDir,slotDir,proofDir])await mkdir(dir,{recursive:true});
const readJson=async(path,fallback)=>{try{return JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw e;}};
const manifest=await readJson(resolve(production,'item-manifest.json'),{schemaVersion:1,items:{},slots:{},proofs:{},sources:{}});
const geometry=await readJson(resolve(production,'geometry.json'),{schemaVersion:1,atlases:{}});
const missing=[];
const exists=async p=>{try{await stat(p);return true;}catch{return false;}};
const hash=async p=>createHash('sha256').update(await readFile(p)).digest('hex');
const pathFromRoot=p=>relative(root,p).replaceAll('\\','/');
const server=createServer(async(req,res)=>{
 try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(root,'.'+pathname);if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
  const content=await readFile(path);const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-store'});res.end(content);
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const url=p=>origin+'/'+pathFromRoot(p);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1500,height:1400},deviceScaleFactor:1});
const reset=async()=>{await page.goto(url(resolve(production,'tools/renderer.html')));await page.waitForFunction(()=>window.ready);};
const screenshot=async path=>page.locator('#asset').screenshot({path,omitBackground:true,animations:'disabled'});
const write=async(path,value)=>{if(!preview)await writeFile(path,JSON.stringify(value,null,2)+'\n');};
await reset();
try{
 for(const batch of catalogue.batches){
  if(only&&batch.id!==only)continue;
  const source=resolve(production,`artwork/items-${batch.id}.png`);
  if(!await exists(source)){missing.push(batch.id);continue;}
  const sourceHash=await hash(source),settingsHash=createHash('sha256').update(JSON.stringify(overrides.atlases[batch.id]??{})).digest('hex');
  let g=geometry.atlases[batch.id];
  const remeasure=force||g?.sourceHash!==sourceHash||g?.settingsHash!==settingsHash;
  if(remeasure){g=await page.evaluate(({source,options})=>window.measure(source,options),{source:url(source),options:{columns:batch.columns,rows:batch.rows,count:batch.count,overrides:overrides.atlases[batch.id]??{}}});g.sourceHash=sourceHash;g.settingsHash=settingsHash;g.source=pathFromRoot(source);geometry.atlases[batch.id]=g;}
  for(const asset of batch.assets){
   const item=catalogue.items.find(i=>i.id===asset.id),output=resolve(itemDir,item.slug+'.png'),frame=g.frames[asset.index];
   const old=manifest.items[item.id];
   if(!proofsOnly&&(remeasure||!old||!await exists(output))){
    const size=await page.evaluate(args=>window.render(args),{source:url(source),geometry:g,frame,extent:item.display.longestEdge*4});
    await screenshot(output);
    manifest.items[item.id]={id:item.id,name:item.name,slug:item.slug,batch:batch.id,source:pathFromRoot(source),sourceHash,cell:asset.index,path:pathFromRoot(output),storyPath:'assets/cooks-pen/items/'+item.slug+'.png',intrinsicWidth:size.width,intrinsicHeight:size.height,displayWidth:size.width/4,displayHeight:size.height/4,intendedLongestEdge:item.display.longestEdge,frame,warnings:frame.warnings??[]};
   }
  }
  console.log(`Exported ${batch.id}: ${batch.count} subjects`);
  await write(resolve(production,'geometry.json'),geometry);await write(resolve(production,'item-manifest.json'),manifest);
 }

 // Targeted regenerated drawings replace individual subjects without changing
 // neighbouring illustrations or the frozen first-recognition inputs.
 const repairs=await readJson(resolve(production,'tools/source-overrides.json'),[]);
 geometry.repairs??={};
 for(const repair of repairs){
  const source=resolve(production,repair.source);
  if(!await exists(source)){missing.push(repair.id);continue;}
  const sourceHash=await hash(source);
  let g=geometry.repairs[repair.id];
  const remeasure=force||g?.sourceHash!==sourceHash;
  if(remeasure){g=await page.evaluate(({source,options})=>window.measure(source,options),{source:url(source),options:{columns:repair.columns,rows:repair.rows,count:repair.assets.length}});g.sourceHash=sourceHash;g.source=pathFromRoot(source);geometry.repairs[repair.id]=g;}
  for(const [index,id] of repair.assets.entries()){
   const item=catalogue.items.find(i=>i.id===id),old=manifest.items[id],output=resolve(itemDir,item.slug+'.png'),frame=g.frames[index];
   if(!proofsOnly&&(remeasure||old?.sourceHash!==sourceHash||!await exists(output))){
    const size=await page.evaluate(args=>window.render(args),{source:url(source),geometry:g,frame,extent:item.display.longestEdge*4});await screenshot(output);
    manifest.items[id]={...old,source:pathFromRoot(source),sourceHash,cell:index,repair:repair.id,intrinsicWidth:size.width,intrinsicHeight:size.height,displayWidth:size.width/4,displayHeight:size.height/4,frame,warnings:frame.warnings??[]};
   }
  }
 }

 const trolleySource=resolve(production,'artwork/equipment-trolley.png'),trolleyOutput=resolve(itemDir,'supper-trolley.png');
 if(await exists(trolleySource)){
  const sourceHash=await hash(trolleySource);
  let tg=geometry.trolley;
  const remeasure=force||tg?.sourceHash!==sourceHash;
  if(remeasure){tg=await page.evaluate(({source,options})=>window.measure(source,options),{source:url(trolleySource),options:{columns:1,rows:1,count:1,overrides:{0:overrides.trolley}}});tg.sourceHash=sourceHash;tg.source=pathFromRoot(trolleySource);geometry.trolley=tg;}
  if(!proofsOnly&&(remeasure||!await exists(trolleyOutput))){
   // 180px drawing inside 190px square allows real top-shelf food to rise above
   // the handles. The actual shelf positions are inspected in the composite.
   const size=await page.evaluate(args=>window.render(args),{source:url(trolleySource),geometry:tg,frame:tg.frames[0],extent:720,canvas:{width:760,height:760}});
   await screenshot(trolleyOutput);
   manifest.items['name:Supper trolley']={id:'name:Supper trolley',name:'Supper trolley',slug:'supper-trolley',batch:'standalone-trolley-base',source:pathFromRoot(trolleySource),sourceHash,path:pathFromRoot(trolleyOutput),storyPath:'assets/cooks-pen/items/supper-trolley.png',intrinsicWidth:size.width,intrinsicHeight:size.height,displayWidth:190,displayHeight:190,intendedLongestEdge:190,frame:tg.frames[0],drawingLongestEdge:180,warnings:[],registrationNote:'Nearly frontal drawing framed inside190px square with top headroom; food positions derived from visible shelf surfaces.'};
  }
 }

 // Coordinates follow the inspected generated shelves, not the catalogue's
 // earlier conceptual placement. Both cakes fit separately on the middle shelf.
 const slotLayout=[
  {name:'Bean stew and soda bread',rect:{x:26,y:3,width:76,height:42}},
  {name:'Apple juice',rect:{x:125,y:5,width:26,height:40}},
  {name:'Processed bean-stew tin',rect:{x:83,y:122,width:29,height:33}},
  {name:'Vanilla sandwich cake',rect:{x:24,y:62,width:56,height:42}},
  {name:'Iced chocolate cake',rect:{x:92,y:62,width:56,height:42}},
 ];
 if(manifest.items['name:Supper trolley']&&slotLayout.every(s=>manifest.items['name:'+s.name])){
  for(let index=0;index<slotLayout.length;index++){
   const slot=slotLayout[index],item=manifest.items['name:'+slot.name],output=resolve(slotDir,'supper-trolley-'+item.slug+'.png');
   await page.evaluate(args=>window.layer(args),{width:760,height:760,layers:[{source:url(resolve(root,item.path)),x:slot.rect.x*4,y:slot.rect.y*4,width:slot.rect.width*4,height:slot.rect.height*4}]});await screenshot(output);
   manifest.slots[item.id]={accepts:item.id,index,path:pathFromRoot(output),storyPath:'assets/cooks-pen/slots/supper-trolley-'+item.slug+'.png',intrinsicWidth:760,intrinsicHeight:760,displayBounds:slot.rect};
  }
  await mkdir(resolve(run,'trolley-masks'),{recursive:true});
  for(let mask=0;mask<32;mask++){
   const selected=Object.values(manifest.slots).filter(s=>mask&(1<<s.index));
   await page.evaluate(args=>window.layer(args),{width:760,height:760,layers:[{source:url(trolleyOutput)},...selected.map(s=>({source:url(resolve(root,s.path))}))]});
   await screenshot(resolve(run,`trolley-masks/${String(mask).padStart(2,'0')}.png`));
  }
  manifest.compound={base:'name:Supper trolley',width:760,height:760,displayWidth:190,displayHeight:190,configurationCount:32,slots:slotLayout,registrationStatus:'Derived from source shelf geometry; inspect temporary all-state proof before accepting changes.'};
 }

 // These are actual display-size proofs, not uniformly enlarged thumbnails.
 const makeProof=async({key,title,items,columns=4,numberedOnly=false})=>{
  await reset();const size=await page.evaluate(args=>window.proof(args),{title,subtitle:'B1 Cook’s Pen · reference display sizes · source artwork framed without repainting',items,columns,numberedOnly});
  // Chromium clips a screenshot region to its viewport; grow the viewport so
  // tall proofs retain the final rows instead of silently ending at 1400px.
  await page.setViewportSize({width:Math.ceil(size.width),height:Math.ceil(size.height)});
  const output=resolve(numberedOnly?run:proofDir,key+'.png');await page.screenshot({path:output,fullPage:true,animations:'disabled'});
 };
 for(const batch of catalogue.batches){
  if(only&&batch.id!==only)continue;
  if(!batch.assets.every(a=>manifest.items[a.id]))continue;
  const items=batch.assets.map((a,i)=>{const m=manifest.items[a.id];return{code:String(i+1).padStart(2,'0'),name:m.name,source:url(resolve(root,m.path)),width:m.displayWidth,height:m.displayHeight};});
  await makeProof({key:batch.id+'-labelled',title:batch.id,items});
  await makeProof({key:batch.id+'-numbered',title:'Cook’s Pen · unnamed subjects',items,numberedOnly:true});
 }
 if(manifest.compound){
  const items=Array.from({length:32},(_,mask)=>({code:String(mask).padStart(2,'0'),name:slotLayout.filter((s,i)=>mask&(1<<i)).map(s=>s.name).join(' + ')||'Empty',source:url(resolve(run,`trolley-masks/${String(mask).padStart(2,'0')}.png`)),width:190,height:190}));
  await makeProof({key:'trolley-all-32',title:'Supper trolley · all 32 independent fitting states',items,columns:4,numberedOnly:true});
 }
 manifest.summary={itemCount:Object.keys(manifest.items).length,expectedItems:230,slotCount:Object.keys(manifest.slots).length,missingAtlases:missing,complete:Object.keys(manifest.items).length===230&&Object.keys(manifest.slots).length===5};
 await write(resolve(production,'geometry.json'),geometry);await write(resolve(production,'item-manifest.json'),manifest);
 console.log(JSON.stringify(manifest.summary));
}finally{await browser.close();await new Promise(r=>server.close(r));}
