/** Copy the established story semantics and add only the illustrated edition's metadata. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseStory} from '../../src/story/parser.ts';
import {slug} from './catalogue.ts';
import {scenes,hotspots,geography,startingPositions} from './scenes.ts';

const original=readFileSync('stories/elements/story.md','utf8');
const model=parseStory(original), lines=original.split('\n'), declared=new Set<string>();
let section='';
for(let i=0;i<lines.length;i++){
  const heading=/^\*\*(.+)\*\*$/.exec(lines[i]);if(heading)section=heading[1];
  if(lines[i].startsWith('## '))section='';
  if(section!=='Items'||!lines[i].startsWith('- '))continue;
  const declaration=lines[i].slice(2).replace(/ \(compound\)$/,'');
  const item=Object.values(model.items).find(item=>declaration===item.name||declaration.startsWith('`'+item.id.slice(3)+'`'));
  if(item&&!declared.has(item.id)){
    const position=startingPositions[item.name];
    lines[i]+=`\n  - icon: ![${item.name}](assets/icons/${slug(item.name)}.png)${position?` (at ${position.x}%, ${position.y}%)`:''}`;
    declared.add(item.id);
  }
}
const parts=lines.join('\n').split(/(?=^## )/m);
parts[0]=parts[0].replace(/^# .+/, '# Elements - Icons').replace('Starting from four storybook elements,', 'A rustic coloured-woodcut edition. Starting from four storybook elements,')+`\n> NOTE: Rustic coloured-woodcut edition. ${geography} Scene backgrounds show the state before this chapter’s construction. Icons are separate movable objects; fixed location art is centred as documented below. The four primitive icons begin in the opening landscape: Water in the river, Air in the sky, Fire in front of the lean-to, and Earth in the open clearing. Their icon declarations give image-relative centres; subsequent movement is free.\n\n`;
const metadata=new Map<number,string[]>();
for(const item of Object.values(model.items)){
  if(declared.has(item.id))continue;
  const chapter=Math.max(0,model.chapters.findLastIndex(c=>c.source.line<=item.source.line));
  const ref=item.id.startsWith('id:')?`\`${item.id.slice(3)}\` "${item.name}"`:item.name;
  const rows=metadata.get(chapter)??[];
  rows.push(`- ${ref}\n  - icon: ![${item.name}](assets/icons/${slug(item.name)}.png)`);
  metadata.set(chapter,rows);
}
for(let c=0;c<model.chapters.length;c++){
  let text=parts[c+1];
  const scene=scenes[c];
  if(scene){
    text=text.replace(/^!\[[^\]]*\]\([^)]+\)/m,`![${model.chapters[c].name}](assets/backgrounds/${String(scene.id).padStart(2,'0')}.webp)\n\n> NOTE: Scene continuity: ${scene.scene}`);
    if(scene.hotspot){
      const h=hotspots[scene.hotspot];
      text=text.replace(`- ${scene.hotspot}\n`,`- ${scene.hotspot} (at ${h.x}%, ${h.y}%)\n  - icon: ![${scene.hotspot}](assets/hotspots/${slug(scene.hotspot)}.png)\n`);
      const comment=`> NOTE: Hotspot **${scene.hotspot}** is centred at (${h.x}%, ${h.y}%) from the background’s top-left: (${Math.round(780*h.x/100)}, ${Math.round(1688*h.y/100)}) pixels in the 780×1688 asset. The background itself depicts ${h.site}. Its separate ${h.width*4}×${h.height*4} icon is 100% transparent and defines only the ${h.width}×${h.height} hit area on the 390px board. Hover, focus and compatible drags reveal its name and outline; no separate miniature is drawn over the scenery.\n\n`;
      text=text.replace('**Hotspots**',comment+'**Hotspots**');
    }
  }
  text=text.replace(/^(  - unnamed slot: accepts (Window|Sleeping mat|Hearth))$/gm,(_,line,name)=>`${line}, icon: ![fitted ${name}](assets/icons/house-${slug(name)}.png)`);
  const entries=metadata.get(c)?.join('\n');
  if(entries){
    if(text.includes('**Items**'))text=text.replace('**Items**',`**Items**\n${entries}\n`);
    else if(text.includes('**Combinations**'))text=text.replace('**Combinations**',`**Items**\n${entries}\n\n**Combinations**`);
    else text+=`\n**Items**\n${entries}\n`;
  }
  parts[c+1]=text;
}
mkdirSync('stories/elements-icons',{recursive:true});
writeFileSync('stories/elements-icons/story.md',parts.join(''));
console.log(`Authored ${model.chapters.length} chapters, ${Object.keys(model.items).length} item icons and ${Object.keys(model.hotspots).length} hotspot icons.`);
