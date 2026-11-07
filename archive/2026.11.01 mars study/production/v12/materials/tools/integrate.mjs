/** Update artwork only; compare the shared parser's full prose/game projection. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../../../../../../src/story/parser.ts';
import {semantics} from '../../tools/story-semantics.mjs';
const production=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(production,'../../../../..');
const storyPath=path.join(root,'projects/mars-study/mars-v12/mars.md');
const before=fs.readFileSync(storyPath,'utf8');
const reuse=JSON.parse(fs.readFileSync(path.join(production,'reuse-artwork.json'),'utf8'));
const selected=JSON.parse(fs.readFileSync(path.join(production,'artwork.json'),'utf8'));
const oldFixed=JSON.parse(fs.readFileSync(path.join(production,'../fixed-items/artwork.json'),'utf8'));
const defaults={...reuse.items,...selected.items};
defaults['unseated-antenna']=reuse.items['straightened-antenna'];
for(const [id,item] of Object.entries(oldFixed.items)) if(item.slots && !defaults[id]?.slots) {
 defaults[id]={...defaults[id],slots:Object.fromEntries(item.slots.map(s=>[s.accepts,s.icon]))};
}
const chapters={...reuse.chapters,...selected.chapters};
const replaceImage=(line,url)=>{
 assert(url,`Missing artwork for ${chapter}/${section}/${identity}: ${line}`);
 assert(fs.existsSync(path.join(path.dirname(storyPath),url)),`Missing asset ${url}`);
 return line.replace(/(!\[[^\]]*\]\()[^)]+(\))/,(_,a,b)=>a+url+b);
};
let chapter='',section='',identity='';
const lines=before.split('\n').map(line=>{
 const ch=/^## `([^`]+)`/.exec(line);
 if(ch){chapter=ch[1];section='';identity='';return line;}
 if(line.startsWith('![') && chapters[chapter]?.image)return replaceImage(line,chapters[chapter].image);
 const sec=/^\*\*([^*]+)\*\*$/.exec(line);if(sec){section=sec[1];identity='';return line;}
 const decl=/^- `([^`]+)`/.exec(line);
 if(decl && ['Items','Hotspots'].includes(section)) {
  identity=decl[1];
  if(section==='Hotspots') {
   const a=chapters[chapter]?.fixed[identity];assert(a,`No fixed artwork for ${chapter}/${identity}`);
   return line.replace(/\(at [^)]+\)/,`(at ${a.x}%, ${a.y}%)`);
  }
 }
 if(!line.includes('![') || !identity)return line;
 if(section==='Hotspots' && /^  - icon:/.test(line))return replaceImage(line,chapters[chapter]?.fixed[identity]?.icon);
 if(section!=='Items')return line;
 const presentation=/^  - from chapter `([^`]+)` icon:/.exec(line);
 if(presentation){const p=defaults[identity]?.presentations?.[presentation[1]];return replaceImage(line,typeof p==='string'?p:p?.icon);}
 const slot=/^  - slot: .* accepts `([^`]+)`/.exec(line);
 if(slot)return replaceImage(line,defaults[identity]?.slots?.[slot[1]]);
 if(/^  - icon:/.test(line))return replaceImage(line,defaults[identity]?.icon);
 return line;
});
const after=lines.join('\n');
const withoutArt=text=>text.replace(/(!\[[^\]]*\]\()[^)]+(?=\))/g,'$1ARTWORK').replace(/\(at [0-9.]+%, [0-9.]+%\)/g,'(at POSITION)');
assert.equal(withoutArt(after),withoutArt(before),'Integration changed text beyond artwork URLs and coordinates.');
assert(!after.includes('assets/placeholders/'),'Unreplaced draft art');
assert.deepEqual(semantics(parseStory(after),{includeProse:true}),semantics(parseStory(before),{includeProse:true}),'Artwork update changed story prose or gameplay');
if(process.argv.includes('--dry-run')) {
 const out=path.join(root,'runs/mars-material-art/preview.md');fs.writeFileSync(out,after);console.log('Semantics/prose preserved; preview',out);
}else{fs.writeFileSync(storyPath,after);console.log('Artwork integrated; full parsed prose and game semantics preserved.');}
