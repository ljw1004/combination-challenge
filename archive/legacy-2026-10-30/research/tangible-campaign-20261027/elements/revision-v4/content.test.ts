import assert from 'node:assert/strict';import fs from 'node:fs';import {validateScenario,replay,objectiveStates} from '../../engine/model.ts';
const read=(name:string)=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url),'utf8'));
const s=read('scenario.json'),pilot=read('pilot-scenario.json');
assert.deepEqual(validateScenario(s),[]);assert.deepEqual(validateScenario(pilot),[]);
assert.equal(s.items.length,204);assert.equal(s.recipes.length,200);assert.equal(s.stages.length,30);
assert(s.items.every((i:any)=>typeof i.description==='string'&&i.description.length>=20));assert.equal(new Set(s.items.map((i:any)=>i.description)).size,204);
assert.equal(s.items.find((i:any)=>i.id==='axle').label,'Wheelset');
assert.deepEqual([s.recipes.find((r:any)=>r.id==='hinge').a,s.recipes.find((r:any)=>r.id==='hinge').b],['iron','nails']);
assert.deepEqual([s.recipes.find((r:any)=>r.id==='hammer').a,s.recipes.find((r:any)=>r.id==='hammer').b],['stone','water']);
assert(!s.stages.some((st:any)=>st.id==='mapping'));assert(s.stages.find((st:any)=>st.id==='stars').objectives.some((o:any)=>o.item==='navigation-chart'));
for(const [scenario,file,total] of [[s,'solution-actions.json',196],[pilot,'pilot-actions.json',19]] as const){const g=replay(scenario,read(file),360);assert(g.state.completed);assert(objectiveStates(scenario,g.state).every(o=>o.satisfied));assert.equal(g.state.metrics.creations,total);assert.equal(g.state.metrics.visits,0);assert.equal(new Set(g.state.discovered).size,g.state.discovered.length);assert.equal(g.state.discovered.length,total+scenario.initialItems.length);}
const old=read('../pilot-frozen-v1.json');assert.deepEqual(pilot.initialItems,old.initialItems);assert.deepEqual(pilot.recipes,old.recipes);assert.deepEqual(pilot.stages.map((st:any)=>st.objectives),old.stages.map((st:any)=>st.objectives));
console.log('v4 content checks passed: complete unique descriptions, causal recipe changes, merged navigation goal, full/pilot replay, and original pilot recipe/starting-state preservation.');
