/** Current-live successor evidence. Source/data only: no renderer, controller, browser or external research reads. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {scenarios} from '../ui/pre-location-scenarios-v1.ts';
import {archivedScenarioIds,incorporations} from '../schema/lifecycle.ts';
import {evidenceRoot,digest} from './reviewed-routes.ts';
const revision=new URL('kitchen-atlas-20261028/',evidenceRoot);
const prior=JSON.parse(readFileSync(new URL('parent-lifecycle-audit.json',revision),'utf8'));
const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const recipes=active.flatMap(s=>s.recipes.map(r=>{
 const previous=prior.recipes.find((x:any)=>x.world===s.id&&x.recipe===r.id);
 if(previous)return previous;
 return {world:s.id,recipe:r.id,inputs:[r.a,r.b].join(' + '),output:r.out??r.install?.target??'—',incorporated:r.install?r.install.component:incorporations(r).map(x=>x.item).sort().join(', ')||'—',retained:Object.entries(r.lifecycle??{}).filter(([,v])=>v.role==='retain').map(([k])=>k).sort().join(', ')||'—',lifecycles:r.lifecycle,provenance:'Exact accepted human-checkpoint authored lifecycle declaration, checked by current runtime with exact reviewed arrival successor; not a new independent lifecycle review or human-play result.'};
}));
for(const old of prior.recipes){const current=recipes.find((r:any)=>r.world===old.world&&r.recipe===old.recipe);if(JSON.stringify(current)!==JSON.stringify(old))throw Error('Changed or missing prior lifecycle audit row '+old.world+':'+old.recipe);}
writeFileSync(new URL('../reviews/lifecycle/audit.json',import.meta.url),JSON.stringify({...prior,counts:Object.fromEntries(active.map(s=>[s.id,{recipes:s.recipes.length}])),activeScenarios:active.length,activeRecipes:recipes.length,recipes},null,2)+'\n');
const output=new URL('../../../../results/kitchen-atlas-20261028/',evidenceRoot);mkdirSync(output,{recursive:true});
writeFileSync(new URL('audit-preservation.json',output),JSON.stringify({parentCommit:'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c',parentAuditSha256:digest(readFileSync(new URL('parent-lifecycle-audit.json',revision))),exactPriorRows:prior.recipes.length,addedRows:recipes.length-prior.recipes.length,activeScenarios:active.length,activeRecipes:recipes.length,allPriorRowsExact:true},null,2)+'\n');
console.log(`Lifecycle audit: ${prior.recipes.length} old rows exact; ${recipes.length-prior.recipes.length} additive; ${active.length} active scenarios, ${recipes.length} recipes.`);
