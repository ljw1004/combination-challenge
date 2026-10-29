import {currentMarsRouteActions} from './current-mars-route-actions.ts';
/** Current shared-entry replay evidence; never rewrites historical source or route artifacts. */
import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import * as M from '../engine/model.ts';import {scenarios,featuredScenarioIds,optionalIntellectualScenarios} from '../ui/pre-location-scenarios-v1.ts';
import {getPlayableScenario} from '../ui/campaign-milestones.ts';import {decodeSave,encodeSave} from '../ui/save-codec.ts';
import {digest} from './reviewed-routes.ts';import {lifecycleAudit} from './current-lifecycle-audit.ts';
const out=new URL('../../../results/playtest-repairs-20261028/composed-worlds/',import.meta.url);mkdirSync(out,{recursive:true});
const raw=JSON.stringify(scenarios),rows=[];
for(const id of [...featuredScenarioIds,...optionalIntellectualScenarios.map(s=>s.id)]){
 const s=getPlayableScenario(id,scenarios)!;assert(s);assert(s.stages.every(st=>st.onAlreadyComplete));assert.deepEqual(M.validateScenario(s),[]);
 const evidence=JSON.parse(readFileSync(new URL('../evidence/'+id+'-route-evidence.json',import.meta.url),'utf8'));const actions=id==='mars-connected-survival-v4-return-cargo-research'?currentMarsRouteActions(evidence.actionsLog):evidence.actionsLog;const g=M.replay(s,actions);assert(g.state.completed);assert.equal(g.state.metrics.combinations,evidence.combinations+(id==='mars-connected-survival-v4-return-cargo-research'?1:0));
 assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game:g,tops:{},seen:[]})).game)),g);
 const checkpoints=[];for(const cp of s.checkpoints??[]){const c=M.checkpoint(s,cp.id);assert.equal(M.pendingMilestone(s,c),null);assert.deepEqual(M.pendingChapterBridges(s,c),[]);assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game:c,tops:{},seen:[]})).game)),c);checkpoints.push({id:cp.id,stage:c.state.stage,complete:c.state.completed,combinations:c.state.metrics.combinations});}
 rows.push({scenarioId:id,featured:featuredScenarioIds.includes(id),completed:true,combinations:g.state.metrics.combinations,chapters:s.stages.length,policyCount:s.stages.length,heroIds:(s.milestones??[]).map(x=>x.id),earnedHeroIds:g.state.milestones?.map(x=>x.id)??[],checkpoints});
}
assert.equal(JSON.stringify(scenarios),raw);
const paths=['../engine/model.ts','../schema/scenario.ts','../ui/campaign-main.ts','../ui/campaign-milestones.ts','../ui/campaign-reactivity.ts','../ui/pre-location-scenarios-v1.ts'];
const report={scope:'Source-informed shared UI/logical entry checks; not browser/native/human evidence.',sourceHashes:Object.fromEntries(paths.map(p=>[p,digest(readFileSync(new URL(p,import.meta.url)))])),featuredWorlds:featuredScenarioIds.length,optionalWorlds:optionalIntellectualScenarios.length,heroCount:rows.reduce((n,r)=>n+r.heroIds.length,0),chapterPolicies:rows.reduce((n,r)=>n+r.policyCount,0),auditedRecipes:lifecycleAudit.recipes.length,rows,rawCatalogueUnchanged:true};
writeFileSync(new URL('current-composed-worlds.json',out),JSON.stringify(report,null,2)+'\n');console.log(`PASS ${rows.length} canonical shared-entry worlds, ${report.heroCount} heroes, ${report.chapterPolicies} chapter policies, ${report.auditedRecipes} lifecycle audit rows.`);
