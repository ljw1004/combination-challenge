/** Current-live successor evidence. Source/data only: no renderer, controller, browser or external research reads. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {scenarios} from '../ui/scenarios.ts';
import {archivedScenarioIds,incorporations} from '../schema/lifecycle.ts';
import {evidenceRoot,digest} from './reviewed-routes.ts';
const revision=new URL('milestone-atlas-20261028/',evidenceRoot);
const prior=JSON.parse(readFileSync(new URL('parent-lifecycle-audit.json',revision),'utf8'));
const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const recipes=active.flatMap(s=>s.recipes.map(r=>{
 const previous=prior.recipes.find((x:any)=>x.world===s.id&&x.recipe===r.id);
 if(previous)return previous;
 return {world:s.id,recipe:r.id,inputs:[r.a,r.b].join(' + '),output:r.out??r.install?.target??'—',incorporated:r.install?r.install.component:incorporations(r).map(x=>x.item).sort().join(', ')||'—',retained:Object.entries(r.lifecycle??{}).filter(([,v])=>v.role==='retain').map(([k])=>k).sort().join(', ')||'—',lifecycles:r.lifecycle,provenance:'Exact reviewed Atlas-repair authored lifecycle declaration checked by current combined runtime; author independent authenticity addendum is separate evidence, not this generated lifecycle row.'};
}));
for(const old of prior.recipes){const current=recipes.find((r:any)=>r.world===old.world&&r.recipe===old.recipe);if(JSON.stringify(current)!==JSON.stringify(old))throw Error('Changed or missing prior lifecycle audit row '+old.world+':'+old.recipe);}
writeFileSync(new URL('../reviews/lifecycle/audit.json',import.meta.url),JSON.stringify({...prior,counts:Object.fromEntries(active.map(s=>[s.id,{recipes:s.recipes.length}])),activeScenarios:active.length,activeRecipes:recipes.length,recipes},null,2)+'\n');
const output=new URL('../../../../results/milestone-atlas-20261028/',evidenceRoot);mkdirSync(output,{recursive:true});
writeFileSync(new URL('audit-preservation.json',output),JSON.stringify({parentSourceSealSha256:'141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa',parentAuditSha256:digest(readFileSync(new URL('parent-lifecycle-audit.json',revision))),exactPriorRows:prior.recipes.length,addedRows:recipes.length-prior.recipes.length,activeScenarios:active.length,activeRecipes:recipes.length,allPriorRowsExact:true},null,2)+'\n');
console.log(`Lifecycle audit: ${prior.recipes.length} old rows exact; ${recipes.length-prior.recipes.length} additive; ${active.length} active scenarios, ${recipes.length} recipes.`);

const atlas=scenarios.find(s=>s.id==='atlas-connected-questions-v9-evidence-repair-research')!;
const {auditRoute,routeActions}=await import('./reviewed-routes.ts');
const actions=routeActions('atlas-evidence-repair-v9/author-route.json'),audit=auditRoute(atlas,actions);
if(!audit.game.state.completed||audit.missing.length)throw Error('Repaired Atlas route incomplete/disconnected');
const report={scenario:atlas.id,title:atlas.title,kind:'Current combined-runtime replay of the accepted Atlas author witness; source-aware logical evidence only',parentSourceSealSha256:'141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa',sourceWitness:'atlas-evidence-repair-v9/author-route.json',sourceScenarioSha256:'161f0eeb59d1ef55d22ef4b8d8427c8b7d918953ae39a9d73a6d4bd55f809e8e',runtimeSha256:digest(readFileSync(new URL('../engine/model.ts',import.meta.url))),actionsLog:actions,combinations:audit.game.state.metrics.combinations,goalContinuity:audit.rows,stageEntries:audit.stageEntries,completed:true,limits:['No browser/native UI testing','No fresh player or enjoyment claim','Bounded consistency repair, not a full Atlas redesign']};
writeFileSync(new URL('../evidence/'+atlas.id+'-route-evidence.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('Repaired Atlas',report.combinations,'combinations;',audit.rows.length-1,'later goal-connected chapters.');
