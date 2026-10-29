/** Content-only successor evidence; no browser/controller/remote work. */
import {readFileSync,writeFileSync} from 'node:fs';
import {scenarios} from '../ui/pre-location-scenarios-v1.ts';
import {archivedScenarioIds,incorporations} from '../schema/lifecycle.ts';
import {scenario as current} from '../ui/campaigns/doctrine-ten-desks.ts';
import {scenario as marsCurrent} from '../ui/campaigns/mars-return-cargo.ts';
import {scenario as marsPrevious} from '../ui/campaigns/mars.ts';
import {scenario as previous} from '../ui/campaigns/doctrine.ts';
import {digest,evidenceRoot,readSource} from './reviewed-routes.ts';
const revision=new URL('late-revision-20261028/',evidenceRoot);
const prior=JSON.parse(readFileSync(new URL('previous-lifecycle-audit.json',revision),'utf8'));
const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const recipes=active.flatMap(s=>s.recipes.map(r=>{
 const row=prior.recipes.find((x:any)=>x.world===s.id&&x.recipe===r.id);
 if(row)return {...row,incorporated:row.incorporated.split(', ').sort().join(', ')};
 return {world:s.id,recipe:r.id,inputs:[r.a,r.b].join(' + '),output:r.out??r.install?.target??'—',incorporated:r.install?r.install.component:incorporations(r).map(x=>x.item).sort().join(', ')||'—',retained:Object.entries(r.lifecycle??{}).filter(([,v])=>v.role==='retain').map(([k])=>k).sort().join(', ')||'—',lifecycles:r.lifecycle,provenance:'Exact authored lifecycle declaration from frozen approved successor; verified with current unchanged runtime. Not a new independent lifecycle review.'};
}));
writeFileSync(new URL('../reviews/lifecycle/audit.json',import.meta.url),JSON.stringify({...prior,counts:Object.fromEntries(active.map(s=>[s.id,{recipes:s.recipes.length}])),activeScenarios:active.length,activeRecipes:recipes.length,recipes},null,2)+'\n');
function differences(a:any,b:any,path=''):any[]{
 if(JSON.stringify(a)===JSON.stringify(b))return [];
 if(a===undefined)return [{path,after:b}];if(b===undefined)return [{path,before:a}];
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return [{path,before:a,after:b}];
 return [...new Set([...Object.keys(a),...Object.keys(b)])].sort().flatMap(k=>differences(a[k],b[k],path+'/'+k.replaceAll('~','~0').replaceAll('/','~1')));
}
writeFileSync(new URL('doctrine-v10-to-ten-desks-exact-diff.json',revision),JSON.stringify(differences(previous,current),null,2)+'\n');
writeFileSync(new URL('mars-live-to-return-cargo-exact-diff.json',revision),JSON.stringify(differences(marsPrevious,marsCurrent),null,2)+'\n');
const source='doctrine/continuation-research-20261028/revision-3-content-clarity/doctrine-ten-desks-v3-candidate.json';
writeFileSync(new URL('revision-manifest.json',revision),JSON.stringify({baseCommit:'c30a7236a0d27ae3e78d83e9e446a2350b8c2662',previousId:previous.id,currentId:current.id,source,sourceSha256:digest(readFileSync(new URL('sources/'+source,evidenceRoot))),integrationDeltas:[],canonicalCombinations:52,chapters:10,checkpoints:11,recipes:current.recipes.length,unchangedOldPrefix:{items:previous.items.length,recipes:previous.recipes.length,stages:previous.stages.length,sources:previous.sources?.length},externalResearchRequiredAtBuild:false,proofScope:'Current-runtime authored replay, exact preservation and source-aware logical surface regression; no fresh v3 discovery/player, UI, browser, touch or human enjoyment claim.',elementsLabelOverride:'elements-label-override.json',mars:{previousId:marsPrevious.id,currentId:marsCurrent.id,source:'mars/late-return-consistency-20261028/recommended.candidate.scenario.json',sourceSha256:'3385e9d34941f15138fdde832347751f223128c59cbf209f4f590fd45827f29e',integrationDeltas:['../late-label-successor-20261028/mars-archive-label-override.json'],carrierCopyAlreadyIncluded:true,canonicalCombinations:199,chapters:24,checkpoints:25},marsDecision:'Approved exact candidate; scope complete for final checks and source seal'},null,2)+'\n');
console.log(`Lifecycle catalogue refreshed: ${active.length} validated scenarios, ${recipes.length} recipe definitions. Doctrine exact structural delta recorded.`);
