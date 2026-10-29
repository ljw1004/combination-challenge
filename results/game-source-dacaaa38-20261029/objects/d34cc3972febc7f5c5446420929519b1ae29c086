// Author rerun of the independent reviewer’s unchanged goal-directed algorithm against repaired v2; not a new independent review.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scenario as s} from '../../ui/stories/atlas-civilization-reviewed.ts';
import * as M from '../../engine/campaign.ts';
const receipts:any[]=[];
for(const seedStart of [1,2,19,101,20261029]) {
 let seed=seedStart,g=M.createGame(s),attempts=0,created:string[]=[],chapters:string[]=[],last=-1;
 const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 while(!g.state.completed) {
  if(++attempts>1000)throw new Error('loop');
  const c=s.chapters[g.state.chapter];if(last!==g.state.chapter){chapters.push(c.id);last=g.state.chapter;}
  if(M.chapterComplete(s,g.state)){const r=M.applyAction(s,g,{type:'advance'});assert.equal(r.accepted,true);g=r.game;continue;}
  const wanted=new Set(M.objectiveStates(s,g.state).filter(o=>!o.satisfied).map(o=>o.item).filter(Boolean));
  let count=0;while(wanted.size!==count){count=wanted.size;for(const r of s.recipes)if(r.out&&wanted.has(r.out)&&!g.state.discovered.includes(r.out)){wanted.add(r.a);wanted.add(r.b);}}
  const operand=(id:string)=>id.startsWith('@')?g.state.hotspots.some(h=>'@'+h.id===id&&h.location===g.state.currentLocation)?id:null:g.state.tokens.find(t=>t.kind===id&&t.location===g.state.currentLocation)?.id;
  const choices=s.recipes.filter(r=>r.out&&wanted.has(r.out)&&!g.state.discovered.includes(r.out)).map(r=>({r,a:operand(r.a),b:operand(r.b)})).filter(x=>x.a&&x.b);
  assert.ok(choices.length,`No goal-making action in ${c.id}`);
  const x=choices[Math.floor(rand()*choices.length)],r=M.applyAction(s,g,{type:'combine',a:x.a!,b:x.b!});assert.equal(r.accepted,true,x.r.id);g=r.game;created.push(x.r.id);
 }
 receipts.push({seed:seedStart,completed:g.state.completed,entered:chapters.length,skipped:g.state.skippedChapters,combinations:created.length,civicRecipes:created.filter(x=>x.startsWith('civ-'))});
}
fs.writeFileSync(new URL('./goal-directed-rerun.json',import.meta.url),JSON.stringify(receipts,null,2));console.log(JSON.stringify(receipts,null,2));
