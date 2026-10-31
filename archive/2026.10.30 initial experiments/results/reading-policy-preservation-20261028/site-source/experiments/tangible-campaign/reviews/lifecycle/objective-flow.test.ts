import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenarios} from '../../ui/scenarios.ts';
import * as M from '../../engine/model.ts';
import {validateObjectiveFlow} from '../../schema/lifecycle.ts';
const elements=scenarios.find(s=>s.id==='elements-observation-revision-v6')!;
const actions=JSON.parse(readFileSync(new URL('../../evidence/'+elements.id+'-route-evidence.json',import.meta.url),'utf8')).actionsLog;
const breadIndex=actions.findIndex((a:any)=>a.type==='combine'&&[a.a,a.b].includes('risen-dough'));
test('intermediate bread leaves checklist and stays ordinary while picnic basket remains the final objective',()=>{
 const before=M.replay(elements,actions.slice(0,breadIndex));assert.equal(elements.stages[before.state.stage].id,'bakery');
 assert.deepEqual(M.playerView(elements,before).objectives.map(o=>o.id),['bakery-bread']);
 assert.equal(M.playerView(elements,before).objectives[0].text,'Bake bread');
 const r=M.applyAction(elements,before,actions[breadIndex]);assert(r.accepted,r.message);const g=r.game;
 assert(M.token(g.state,'bread'));assert(!M.gold(elements,g.state).items.includes('bread'));
 assert(!M.playerView(elements,g).objectives.some(o=>o.id==='bakery-bread'));assert(M.playerView(elements,g).objectives.some(o=>o.id==='bakery-picnic-basket'));
 assert.equal(M.playerView(elements,g).objectives.find(o=>o.id==='bakery-picnic-basket')!.text,'Pack a picnic basket');
 assert(!M.stageComplete(elements,g.state));assert(M.objectiveStates(elements,g.state).find(o=>o.id==='bakery-bread')!.satisfied);
 const reload=M.restore(elements,JSON.stringify(g));assert(!M.playerView(elements,reload).objectives.some(o=>o.id==='bakery-bread'));
 const undo=M.undo(g).game;assert(M.playerView(elements,undo).objectives.some(o=>o.id==='bakery-bread'));
 const consumed=structuredClone(g);consumed.state.tokens=consumed.state.tokens.filter(t=>t.kind!=='bread');
 assert(M.objectiveStates(elements,consumed.state).find(o=>o.id==='bakery-bread')!.satisfied);
});
test('finishing the basket turns only the basket gold; intermediate achievements do not demand a second copy',()=>{
 const atBasket=actions.findIndex((a:any)=>a.type==='combine'&&[a.a,a.b].includes('bread')&&[a.a,a.b].includes('basket'));
 const g=M.replay(elements,actions.slice(0,atBasket+1));assert(M.stageComplete(elements,g.state));assert.deepEqual(M.gold(elements,g.state).items,['picnic-basket']);
 assert.deepEqual(M.playerView(elements,g).objectives.map(o=>o.id),['bakery-picnic-basket']);
});
test('build rejects final objectives that are also reagents on the way to another objective',()=>{
 assert.deepEqual(validateObjectiveFlow(scenarios),[]);
 const s=structuredClone(elements);s.stages.find(st=>st.id==='bakery')!.objectives.find(o=>o.item==='bread')!.intermediate=false;
 assert(validateObjectiveFlow([s]).some(e=>e.includes('bread')&&e.includes('mark it intermediate')));
 s.stages.find(st=>st.id==='bakery')!.objectives.forEach(o=>o.intermediate=true);
 assert(validateObjectiveFlow([s]).some(e=>e.includes('needs a final objective')));
});

test('goal reveal prerequisites cannot point to missing goals or form cycles',()=>{
 const s=structuredClone(elements),stage=s.stages.find(st=>st.id==='bakery')!;stage.objectives[1].after=['missing'];
 assert(M.validateScenario(s).some(e=>e.includes('Invalid goal reveal')));
 stage.objectives[1].after=[stage.objectives[0].id];stage.objectives[0].after=[stage.objectives[1].id];
 assert(M.validateScenario(s).some(e=>e.includes('Cyclic goal reveal')));
});
