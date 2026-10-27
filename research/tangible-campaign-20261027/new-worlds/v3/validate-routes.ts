import fs from 'node:fs';
import path from 'node:path';
import {createGame,applyAction,stageComplete,objectiveStates,validateScenario} from '../../engine/model.ts';
const dir=import.meta.dirname, reports=[];
for(const file of ['food','theology','causation','literature','chinese-thought','restoration','shoreline'].map(x=>x+'.json')){
 const s=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));let g=createGame(s),actions=[],checkpoints=[],maxVisible=0;
 const act=(a)=>{const r=applyAction(s,g,a); if(!r.accepted)throw Error(JSON.stringify(a)+': '+r.message);g=r.game;actions.push(a);maxVisible=Math.max(maxVisible,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);};
 const make=(id,stack=[])=>{if(g.state.tokens.some(x=>x.kind===id))return;if(stack.includes(id))throw Error('Cycle '+id);const r=s.recipes.find(r=>r.out===id);if(!r)throw Error('Unavailable primitive '+id);for(const k of [r.a,r.b])if(!k.startsWith('@'))make(k,[...stack,id]);
  const target=r.b.startsWith('@')?r.b.slice(1):r.b; const source=r.a.startsWith('@')?r.b:r.a;
  if(r.at)act({type:'place',item:r.b,location:r.at});
  const a=r.a.startsWith('@')?{type:'combine',a:r.b,b:r.a}:{type:'combine',a:r.a,b:r.b};act(a);
 };
 let error=null;
 try {for(let i=0;i<s.stages.length;i++){checkpoints.push({id:'chapter-'+(i+1),label:s.stages[i].title,actions:structuredClone(actions)});for(const o of s.stages[i].objectives){make(o.item);if(o.kind==='place')act({type:'place',item:o.item,location:o.location});}if(!stageComplete(s,g.state))throw Error('Stage incomplete '+i);act({type:'advance'});}}catch(e){error=e.message;}
 const result={scenario:s.id,validation:validateScenario(s),completed:g.state.completed,error,recipesTotal:s.recipes.length,combinations:g.state.metrics.combinations,actions:actions.length,maxVisibleItems:maxVisible,metrics:g.state.metrics,limits:'Author-aware legal route. Not a blind playtest, UI verification, historical verification, or evidence of fun.'};
 reports.push(result);fs.writeFileSync(path.join(dir,s.id+'-route-evidence.json'),JSON.stringify({...result,actionsLog:actions,checkpoints},null,2)+'\n');
 if(!error){s.checkpoints=checkpoints;fs.writeFileSync(path.join(dir,file),JSON.stringify(s,null,2)+'\n');}
}
fs.writeFileSync(path.join(dir,'route-summary.json'),JSON.stringify(reports,null,2)+'\n');console.log(JSON.stringify(reports,null,2));
