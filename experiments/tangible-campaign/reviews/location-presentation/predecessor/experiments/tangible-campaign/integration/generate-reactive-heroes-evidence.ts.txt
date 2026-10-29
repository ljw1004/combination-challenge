/** Current composed-world evidence only. Historical source/route artifacts are never rewritten. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import * as M from '../engine/model.ts';
import {scenarios,featuredScenarioIds} from '../ui/scenarios.ts';
import {getPlayableScenario} from '../ui/campaign-milestones.ts';
import {routeSpecs,routeActions,digest} from './reviewed-routes.ts';
import {decodeSave,encodeSave} from '../ui/save-codec.ts';
const out=new URL('../../../results/reactive-heroes-release-20261028/composed-worlds/',import.meta.url);mkdirSync(out,{recursive:true});
const rawBefore=JSON.stringify(scenarios),rows=[];
for(const [index,id]of featuredScenarioIds.entries()){
 const s=getPlayableScenario(id,scenarios)!;assert(s);assert(s.stages.every(st=>st.onAlreadyComplete));assert.deepEqual(M.validateScenario(s),[]);
 const key=['mars','atlas','elements','food','purpose','doctrine'][index],spec=routeSpecs.find(x=>x.key===key)!;
 const actions=routeActions(spec.source),game=M.replay(s,actions);assert(game.state.completed);
 assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game,tops:{},seen:[]})).game)),game);
 const checkpoints=[];for(const cp of s.checkpoints??[]){const g=M.checkpoint(s,cp.id);assert.equal(M.pendingMilestone(s,g),null);assert.equal(M.pendingChapterBridges(s,g).length,0);assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game:g,tops:{},seen:[]})).game)),g);checkpoints.push({id:cp.id,stage:g.state.stage,complete:g.state.completed,combinations:g.state.metrics.combinations,historyAcknowledged:true});}
 rows.push({scenarioId:id,sourceWitness:spec.source,completed:true,combinations:game.state.metrics.combinations,chapters:s.stages.length,policies:s.stages.map(st=>({stage:st.id,...st.onAlreadyComplete})),heroes:s.milestones??[],earnedHeroIds:game.state.milestones?.map(m=>m.id)??[],checkpoints});
}
assert.equal(JSON.stringify(scenarios),rawBefore);
const paths=['../engine/model.ts','../schema/scenario.ts','../ui/campaign-main.ts','../ui/campaign-milestones.ts','../ui/campaign-reactivity.ts'];
const report={scope:'Current source-informed composed UI/logical scenarios: canonical routes, compact saves and historical checkpoint acknowledgements; not browser/native/human testing',sourceHashes:Object.fromEntries(paths.map(p=>[p,digest(readFileSync(new URL(p,import.meta.url)))])),featuredWorlds:6,heroCount:rows.reduce((n,r)=>n+r.heroes.length,0),chapterPolicies:rows.reduce((n,r)=>n+r.policies.length,0),rows,rawCatalogueUnchanged:true};
writeFileSync(new URL('current-composed-worlds.json',out),JSON.stringify(report,null,2)+'\n');console.log(`PASS ${rows.length} composed canonical worlds, ${report.heroCount} hero declarations, ${report.chapterPolicies} explicit chapter policies; all checkpoints/save identities preserved.`);
