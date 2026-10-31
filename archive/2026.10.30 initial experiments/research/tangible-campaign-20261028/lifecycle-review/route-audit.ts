import {readFileSync,writeFileSync} from 'node:fs';
import * as M from './baseline/engine/model.ts';
import {incorporations,archivedScenarioIds} from './baseline/schema/lifecycle.ts';
import {scenarios} from '/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/ui/scenarios.ts';
const root='/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/evidence/';
const summary:any[]=[];const details:any[]=[];
for(const s of scenarios){
 let actions;try{actions=JSON.parse(readFileSync(root+s.id+'-route-evidence.json','utf8')).actionsLog;}catch(e){summary.push({id:s.id,blocked:String(e)});continue;}
 let g=M.createGame(s),outside=0,retainOverride=0,noCombine=0,missingPreserve=0,preservedWhileSourceRetained=0,accepted=0,restoreChanges=0;const found:any[]=[];
 for(let i=0;i<actions.length;i++){
  const a=actions[i],before=g,r=M.applyAction(s,g,a);if(!r.accepted)throw Error(s.id+' '+i+' '+r.message);g=r.game;accepted++;
  const recipe=s.recipes.find(x=>x.id===r.recipe),eligible=recipe?.install?[recipe.install.component]:recipe?incorporations(recipe).map(x=>x.item):[];
  const extraneous=(r.retired??[]).filter(k=>!eligible.includes(k));
  if(extraneous.length){outside+=extraneous.length;if(a.type!=='combine')noCombine+=extraneous.length;retainOverride+=extraneous.filter(k=>recipe?.lifecycle?.[k]?.role==='retain').length;
   found.push({actionIndex:i+1,action:a,currentRecipe:r.recipe,retiredOutsideCurrentDeclaration:extraneous,owners:extraneous.map(k=>({source:k,sourceArea:M.token(before.state,k)?.area,owners:g.state.tokens.filter(t=>t.incorporated.includes(k)).map(t=>({id:t.id,area:t.area}))}))});
  }
  if(recipe?.preserve?.length&&(r.created||r.updated)){const output=M.token(g.state,r.created??r.updated!)!;for(const k of recipe.preserve){const source=M.token(before.state,k);if(!source)continue;const expected=[...Object.values(source.slots),...source.components??[]];const missing=expected.filter(k=>!output.components?.includes(k));if(M.token(g.state,k))preservedWhileSourceRetained++;if(missing.length){missingPreserve++;found.push({actionIndex:i+1,action:a,currentRecipe:r.recipe,retainedSource:!!M.token(g.state,k),preserveSource:k,missingVisibleParts:missing,output});}}
   const loaded=M.restore(s,JSON.stringify(g));if(JSON.stringify(loaded.state.tokens)!==JSON.stringify(g.state.tokens)){restoreChanges++;found.push({actionIndex:i+1,saveRestoreChangedCurrentTokens:true});}
  }
 }
 summary.push({id:s.id,archived:archivedScenarioIds.has(s.id),actions:accepted,completed:g.state.completed,deletionsOutsideCurrentDeclaration:outside,currentRetainOverridden:retainOverride,nonCombineDeletions:noCombine,preservedWhileSourceRetained,missingPreserve,restoreChangesAfterPreserve:restoreChanges});details.push({id:s.id,findings:found});
}
writeFileSync(new URL('./route-audit-results.json',import.meta.url),JSON.stringify({summary,details},null,2)+'\n');console.log(JSON.stringify(summary,null,2));
