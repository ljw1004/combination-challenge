import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenarios} from '../ui/scenarios.ts';
import {archivedScenarioIds} from '../schema/lifecycle.ts';
/** Historical audit bytes stay frozen. This successor adds only new world rows,
 * then presents the exact current catalogue order without rewriting old rows. */
const prior=JSON.parse(readFileSync(new URL('../reviews/lifecycle/audit.json',import.meta.url),'utf8'));
const added=JSON.parse(readFileSync(new URL('../reviews/intellectual-worlds/lifecycle-additions.json',import.meta.url),'utf8'));
const byKey=new Map<string,any>();
for(const row of [...prior.recipes,...added.recipes]){
 const key=row.world+':'+row.recipe;assert(!byKey.has(key),'Duplicate lifecycle audit row '+key);byKey.set(key,row);
}
const historicalRecipes=[...byKey.values()];
const lifecycleSuccessor=JSON.parse(readFileSync(new URL('../reviews/mars-natural-orders/lifecycle-delta.json',import.meta.url),'utf8'));
for(const c of lifecycleSuccessor.changes){
 const key=c.world+':'+c.recipe,previous=byKey.get(key);
 assert.deepEqual(previous?(previous.lifecycles??previous.lifecycle??previous.decisions):null,c.before,'Exact lifecycle predecessor '+key);
 byKey.set(key,{world:c.world,recipe:c.recipe,inputs:c.inputs,output:c.output,lifecycles:c.after,incorporated:Object.entries<any>(c.after).filter(([,v])=>v.role!=='retain').map(([k])=>k).sort().join(', ')||'—',retained:Object.entries<any>(c.after).filter(([,v])=>v.role==='retain').map(([k])=>k).sort().join(', ')||'—'});
}
const intuitiveAdditions=JSON.parse(readFileSync(new URL('../reviews/intuitive-story-alternatives/lifecycle-additions.json',import.meta.url),'utf8'));
for(const row of intuitiveAdditions.recipes){const key=row.world+':'+row.recipe;assert(!byKey.has(key),'Duplicate alternative lifecycle row '+key);byKey.set(key,row);}
const playtestRepairsSuccessor=JSON.parse(readFileSync(new URL('../reviews/playtest-repairs/lifecycle-delta.json',import.meta.url),'utf8'));
for(const c of playtestRepairsSuccessor.changes){
 const key=c.world+':'+c.recipe,previous=byKey.get(key);
 assert.deepEqual(previous?(previous.lifecycles??previous.lifecycle??previous.decisions):null,c.before,'Exact lifecycle predecessor '+key);
 byKey.set(key,{world:c.world,recipe:c.recipe,inputs:c.inputs,output:c.output,lifecycles:c.after,incorporated:Object.entries<any>(c.after).filter(([,v])=>v.role!=='retain').map(([k])=>k).sort().join(', ')||'—',retained:Object.entries<any>(c.after).filter(([,v])=>v.role==='retain').map(([k])=>k).sort().join(', ')||'—'});
}
const locationAdditions=JSON.parse(readFileSync(new URL('../reviews/location-presentation/lifecycle-additions.json',import.meta.url),'utf8'));
for(const row of locationAdditions.recipes){const key=row.world+':'+row.recipe;assert(!byKey.has(key),'Duplicate location recipe '+key);byKey.set(key,row);}
// This explicit pre-publication delta retires processing rows from current v5,
// not from an archived/live scenario. Their exact original bytes remain in the
// frozen location additions and in the successor's before/after evidence.
const observationSuccessor=JSON.parse(readFileSync(new URL('../reviews/mars-observation-streamline/lifecycle-delta.json',import.meta.url),'utf8'));
const supersededUnpublishedRecipes=[];
for(const change of observationSuccessor.changes){
 const row=change.after??change.before,key=row.world+':'+row.recipe;
 assert.equal(row.world,'mars-persistent-locations-v5','Only the unpublished Mars successor may change');
 assert.deepEqual(byKey.get(key)??null,change.before,'Exact observation lifecycle predecessor '+key);
 if(change.after)byKey.set(key,change.after);else{supersededUnpublishedRecipes.push(change.before);byKey.delete(key);}
}
const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const recipes=active.flatMap(s=>s.recipes.map(r=>{
 const row=byKey.get(s.id+':'+r.id);assert(row,'Missing audited recipe '+s.id+':'+r.id);
 assert.deepEqual(row.lifecycles??row.lifecycle??row.decisions,r.lifecycle,'Exact authored lifecycle '+s.id+':'+r.id);return row;
}));
assert.equal(recipes.length,byKey.size,'No historical audit row may disappear');
export const lifecycleAudit={...prior,scope:'Exact current catalogue with immutable historical rows, explicit lifecycle successors and seven location successors, including the unpublished Mars observation simplification.',historicalRecipes,lifecycleSuccessor,playtestRepairsSuccessor,observationSuccessor,supersededUnpublishedRecipes,counts:Object.fromEntries(active.map(s=>[s.id,{recipes:s.recipes.length}])),activeScenarios:active.length,activeRecipes:recipes.length,recipes};
