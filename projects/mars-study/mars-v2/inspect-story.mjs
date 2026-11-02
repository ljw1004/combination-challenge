import fs from 'node:fs';
import path from 'node:path';
import {parseStory} from '../../../src/story/parser.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';
import {newGame, act, availableTokens, label} from '../../../src/engine/game.ts';

// Source-aware developer witness; never supply this route to a fresh player.
const source=fs.readFileSync(new URL('./mars.md',import.meta.url),'utf8');
const story=parseStory(source,{id:'mars'});
const witness=checkpoint(story,story.chapters.length);
let state=newGame(story);
const counts=story.chapters.map(c=>({chapter:c.name,newSupplies:[],arrival:0,peak:0,combinations:0,placements:0}));
const packets=story.chapters.map(()=>[]);
const introduced=new Set();
function recordArrival(){
  const n=state.chapter,c=story.chapters[n];
  const visible=availableTokens(state).filter(t=>t.chapter===n);
  counts[n].arrival=visible.length;
  counts[n].newSupplies=state.newItems.map(id=>story.items[id].name);
  packets[n].push(...(n===0?[story.title,story.description]:[]),c.intro,'Visible goals: '+c.goals.filter(g=>!g.next).map(g=>g.text).join('; '));
}
recordArrival();
for(const action of witness.actions){
  const chapter=state.chapter,before=state;
  if(action.type==='combine'){
    counts[chapter].combinations++;
    packets[chapter].push('Action: use '+label(story,state,action.a)+(action.b?' with '+label(story,state,action.b):'')+(action.hotspot?' at '+story.hotspots[action.hotspot].name:'')+'.');
  }
  if(action.type==='move'){
    counts[chapter].placements++;
    packets[chapter].push('Action: place '+label(story,state,action.item)+(action.hotspot?' at '+story.hotspots[action.hotspot].name:' on the working surface')+'.');
  }
  state=act(story,state,action);
  for(const notice of state.pending.filter(n=>n.kind==='wonder'))if(!introduced.has(notice.key)){
    introduced.add(notice.key);packets[chapter].push(notice.markdown);
  }
  if(state.chapter!==before.chapter)recordArrival();
  const visible=availableTokens(state).filter(t=>t.chapter===state.chapter);
  counts[state.chapter].peak=Math.max(counts[state.chapter].peak,visible.length,counts[state.chapter].arrival);
}
console.log(JSON.stringify({completed:state.completed,chapters:story.chapters.length,items:Object.keys(story.items).length,explicitRecipes:story.recipes.filter(r=>!r.installation).length,counts},null,2));
const packetDir=process.argv[2];
if(packetDir){
  if(!path.resolve(packetDir).startsWith(path.resolve('runs')+path.sep))throw Error('Review packets must stay under runs/');
  fs.mkdirSync(packetDir,{recursive:true});
  packets.forEach((parts,i)=>fs.writeFileSync(path.join(packetDir,String(i+1).padStart(2,'0')+'.txt'),parts.filter(Boolean).join('\n\n')+'\n'));
}
