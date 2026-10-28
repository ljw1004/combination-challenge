import {expectedSourceHashAfterIntellectualWorlds} from '../experiments/tangible-campaign/integration/intellectual-worlds-source-guard.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {expectedSourceHashAfterReactiveHeroes} from '../experiments/tangible-campaign/integration/reactive-heroes-source-guard.ts';
import {applyMilestones,getPlayableScenario,campaignMilestones} from '../experiments/tangible-campaign/ui/campaign-milestones.ts';
import {applyChapterPolicies,campaignChapterPolicies} from '../experiments/tangible-campaign/ui/campaign-reactivity.ts';
import {scenarios,featuredScenarioIds} from '../experiments/tangible-campaign/ui/scenarios.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)),sha=(p:string)=>createHash('sha256').update(read(p)).digest('hex');
const e='experiments/tangible-campaign/evidence/integration-20261028/reactive-heroes-release-20261028/';
const parent=JSON.parse(read(e+'authoring-parent-source-inventory.json').toString());
const release=JSON.parse(read('experiments/tangible-campaign/reviews/reactive-heroes/source-successors.json').toString());
test('final exact successor preserves every previous source freeze and rejects wrong predecessors',()=>{
 for(const [path,row]of Object.entries<any>(release.files)){assert.equal(row.beforeSha256,parent.files[path].sha256,path);assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path);assert.equal(sha(path),expectedSourceHashAfterIntellectualWorlds(path,row.afterSha256),path);assert.equal(expectedSourceHashAfterReactiveHeroes(path,row.beforeSha256),expectedSourceHashAfterIntellectualWorlds(path,row.afterSha256));assert.throws(()=>expectedSourceHashAfterReactiveHeroes(path,'0'.repeat(64)),/exact milestone\/Atlas predecessor/);assert.notEqual(createHash('sha256').update(read(path)).update('unreviewed').digest('hex'),row.afterSha256);}
 assert.equal(expectedSourceHashAfterReactiveHeroes('unrelated/source.ts','a'.repeat(64)),'a'.repeat(64));
 for(const [path,row]of Object.entries<any>(parent.files))if(path.startsWith('experiments/tangible-campaign/ui/campaigns/')||path.endsWith('/source-successors.json'))assert.equal(sha(path),row.sha256,path+' historical bytes must remain exact');
});
test('UI and logical players share one composed active-world entry with both story and invention metadata',()=>{
 const raw=JSON.stringify(scenarios);assert.equal(featuredScenarioIds.length,6);assert.equal(Object.values(campaignMilestones).flat().length,12);
 for(const id of featuredScenarioIds){const original=scenarios.find(s=>s.id===id)!,s=getPlayableScenario(id,scenarios)!;assert.deepEqual(s,applyMilestones(original));assert.deepEqual(s.stages,applyChapterPolicies(original).stages);assert(s.stages.every(st=>st.onAlreadyComplete));assert.deepEqual(s.milestones??[],original.milestones??campaignMilestones[id]??[]);assert.deepEqual(M.validateScenario(s),[]);if(campaignChapterPolicies[id])assert.equal(Object.keys(campaignChapterPolicies[id]).length,s.stages.length);else assert(original.stages.every(st=>st.onAlreadyComplete),'New worlds directly author every chapter policy');}
 assert.equal(JSON.stringify(scenarios),raw,'decorators must not mutate saved historical content');
 const ui=read('experiments/tangible-campaign/ui/campaign-main.ts').toString();assert.match(ui,/start\(applyMilestones\(scenario\)\)/);assert(!ui.includes('applyChapterPolicies('),'no UI-only second decorator');
});
