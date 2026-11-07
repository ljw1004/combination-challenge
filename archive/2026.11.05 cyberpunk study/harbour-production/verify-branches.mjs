import {mkdirSync} from 'node:fs';
mkdirSync('runs/harbour-verification/art-final',{recursive:true});
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {loadStory} from '../../../src/story/load.ts';
import {checkpoint} from '../../../src/debug/checkpoint.ts';
import {act,replay,chapterComplete,recipeFor,availableTokens} from '../../../src/engine/game.ts';
import {choices} from '../../../src/playtest/adventure.ts';
import {presentHotspots,isFixed,recipeIngredients} from '../../../src/engine/fixed-items.ts';
const {story,hash}=loadStory(process.argv[2] || 'projects/cyberpunk-study/harbour.md');
const finish=checkpoint(story,story.chapters.length);
assert(finish.completed);assert.deepEqual(replay(story,finish.actions),finish);
const settle=s=>{while(s.pending.length)s=act(story,s,{type:'dismiss'});return s;};
const key=s=>JSON.stringify([s.chapter,s.achieved,s.excluded,Object.values(s.tokens).map(t=>[t.id,t.status,t.chapter,t.hotspot||'',t.slots])]);
const covered=new Set(),problems=[],summaries=[];
for(let c=0;c<story.chapters.length-1;c++){
 const start=settle(checkpoint(story,c)); if(start.chapter!==c){summaries.push({chapter:c+1,skipped:true});continue;}
 const queue=[start],seen=new Set([key(start)]);let processed=0,edges=0,endings=0,peak=0,maxFixed=0,limited=false;
 for(let q=0;q<queue.length;q++){
  if(processed>=2500){limited=true;break;}
  const s=queue[q];processed++;
  peak=Math.max(peak,availableTokens(s).filter(t=>t.chapter===c).length);maxFixed=Math.max(maxFixed,presentHotspots(story,s,c).length);
  const acts=choices(story,s);if(!acts.length&&!chapterComplete(story,s))problems.push({chapter:c+1,kind:'deadend'});
  if(chapterComplete(story,s)){
   if(endings<4){try{assert(checkpoint(story,story.chapters.length,s).completed);}catch(e){problems.push({chapter:c+1,kind:'continuation',message:e.message});}}
   endings++;
  }
  for(const a of acts){
   const r=a.type==='combine'?recipeFor(story,s,a):null;
   const next=settle(act(story,s,a));edges++;if(r){covered.add(r.id);for(const i of recipeIngredients(r)){const old=s.tokens[i.ref.id],now=next.tokens[i.ref.id];if(i.fate!=='preserve'&&old&&isFixed(story,old)&&now?.status==='available')problems.push({chapter:c+1,kind:'fixed-retained',name:story.items[i.ref.id].name});}}
   const k=key(next);if(!seen.has(k)){seen.add(k);queue.push(next);}
  }
 }
 summaries.push({chapter:c+1,title:story.chapters[c].name,processed,edges,endings,peak,maxFixed,limited});
 console.log(JSON.stringify(summaries.at(-1)));
}
const result={hash,referenceCombinations:finish.actions.filter(a=>a.type==='combine').length,chapters:summaries,coveredRecipes:covered.size,totalRecipes:story.recipes.length,uncovered:story.recipes.filter(r=>!covered.has(r.id)).map(r=>({id:r.id,a:story.items[r.a.ref.id].name,b:r.b?story.items[r.b.ref.id].name:null,result:story.items[r.result.id]?.name})),problems};
writeFileSync('runs/harbour-verification/mechanical-outcome.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({hash,covered:covered.size,total:story.recipes.length,problems}));
assert.deepEqual(problems,[], 'Mechanical exploration found a failure');
assert.equal(covered.size,story.recipes.length, 'Some recipes were not exercised within the chapter bounds');
