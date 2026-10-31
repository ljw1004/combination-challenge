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
const active=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const recipes=active.flatMap(s=>s.recipes.map(r=>{
 const row=byKey.get(s.id+':'+r.id);assert(row,'Missing audited recipe '+s.id+':'+r.id);
 assert.deepEqual(row.lifecycles??row.lifecycle??row.decisions,r.lifecycle,'Exact authored lifecycle '+s.id+':'+r.id);return row;
}));
assert.equal(recipes.length,byKey.size,'No historical audit row may disappear');
export const lifecycleAudit={...prior,scope:'Exact current catalogue with immutable prior lifecycle rows plus explicit new-world additions.',counts:Object.fromEntries(active.map(s=>[s.id,{recipes:s.recipes.length}])),activeScenarios:active.length,activeRecipes:recipes.length,recipes};
