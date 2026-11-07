#!/usr/bin/env node
// Insert presentation metadata into the authored manuscript; gameplay stays in the shared parser.
import fs from 'node:fs';
import path from 'node:path';
const [input,catalogueFile,output,...flags]=process.argv.slice(2);
if(!output)throw new Error('Usage: integrate_art.mjs INPUT CATALOGUE OUTPUT [--partial]');
const partial=flags.includes('--partial'), directory=path.dirname(output);
const catalogue=JSON.parse(fs.readFileSync(catalogueFile,'utf8'));
const items=new Map(catalogue.items.map(i=>[i.id,i]));
const available=id=>fs.existsSync(path.join(directory,'assets/items',id+'.webp'));
const chapterPages={c01:'morning',c02:'morning',c03:'mechanisms',c04:'mechanisms',c05:'mechanisms',c06:'mechanisms',c07:'light',c08:'light',c09:'mechanisms',c10:'mechanisms',c11:'mechanisms',c12:'mechanisms','c-air-1':'morning','c-air-2':'morning','c-film-1':'light','c-film-2':'light',c13:'mechanisms',c14:'morning',c15:'evening',c16:'evening',c17:'invention',c18:'invention',c19:'invention',c20:'invention',c21:'invention',c22:'invention',c23:'garden',c24:'garden',c25:'evening',c26:'evening'};
const rewards=new Set(['pinwheel','wind-racer','pinball-table','crank-dragon','periscope','kaleidoscope','lifting-crane','wave-machine','pneumatic-grabber','animation-drum','drawing-rover','shadow-theatre','balanced-lift','fair-in-the-air']);
// The whale's registered 1200px canvas includes substantial transparent space.
// Receive parts on the actual workpiece, leaving that space available to supplies.
// Bounds use background pixels; neither the image nor its centre is changed.
const whaleReceiver=(chapter,id)=>{
 if(['c19','c20','c21','c22'].includes(chapter))return '(center 423.75px, 512.5px) (size 491.5px, 365px)';
 // Low-flight c23 reserves its full canvas for the later inspection views;
 // c25 reserves it for the whale's final rise above the garden.
 if(chapter==='c24')return '(center 368px, 574.5px) (size 214px, 191px)';
 return null;
};
let section='',chapter='',owner='',firstBackground=true;const lines=[],seenRewards=new Set();
for(const line of fs.readFileSync(input,'utf8').split('\n')){
 const ch=line.match(/^## `([^`]+)`/);if(ch)chapter=ch[1];
 if(line.startsWith('**'))section=line;
 if(line.startsWith('# ![')){lines.push('# ![An orange paper pinwheel](icon.png) A Fair in the Air');continue;}
 if(line.startsWith('background: ')){
  lines.push(firstBackground?'background: ![An invitation on the garden workbench](assets/cover.webp)':`background: ![${chapterPages[chapter]??'morning'} workshop page](assets/backgrounds/${chapterPages[chapter]??'morning'}.svg)`);
  firstBackground=false;continue;
 }
 const entry=line.match(/^- `([^`]+)`(?: (.*))?$/);
 if(entry&&items.has(entry[1])&&(section==='**Items**'||section==='**Hotspots**')){
  const id=entry[1],item=items.get(id);owner=id;
  if(!available(id)){
   if(!partial)throw new Error('Missing item artwork: '+id);
   lines.push(line);continue;
  }
  if(section==='**Hotspots**'){
   const variant=id==='whale-running-fair'&&chapter==='c23'?'-garden':'';
   const asset=`assets/hotspots/${id}${variant}.webp`;
   if(!fs.existsSync(path.join(directory,asset))){if(!partial)throw new Error('Missing fixed artwork: '+asset);lines.push(line);continue;}
   lines.push('- `'+id+'` (center 390px, 530px)');lines.push('  - icon: !['+item.name+']('+asset+')');
   const receiver=whaleReceiver(chapter,id);if(receiver)lines.push('  - hitbox: '+receiver);
  }else{
   lines.push(line);lines.push('  - icon: !['+item.name+'](assets/items/'+id+'.webp)');
   if(rewards.has(id)&&!seenRewards.has(id)){
    const asset='assets/rewards/'+id+'.webp';
    if(fs.existsSync(path.join(directory,asset))){lines.push('','  !['+item.name+' in the garden]('+asset+')');seenRewards.add(id);}
    else if(!partial)throw new Error('Missing reward image: '+id);
   }
  }
  continue;
 }
 const slot=line.match(/^(  - slot: .*accepts `([^`]+)`)$/);
 if(slot&&available(owner)){
  const asset=`assets/overlays/${owner}--${slot[2]}.webp`;
  if(!fs.existsSync(path.join(directory,asset))){if(!partial)throw new Error('Missing overlay: '+asset);lines.push(line);continue;}
  lines.push(slot[1]+', icon: !['+items.get(slot[2]).name+']('+asset+')');continue;
 }
 lines.push(line);
}
fs.writeFileSync(output,lines.join('\n'));
console.log(`Integrated ${seenRewards.size} reward scenes into ${output}${partial?' (partial preview)':''}`);
