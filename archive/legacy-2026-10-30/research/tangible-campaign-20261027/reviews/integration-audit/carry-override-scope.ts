import fs from 'node:fs';import assert from 'node:assert/strict';import * as E from '../../frozen/v5/engine/model.ts';
const root=new URL('../../',import.meta.url);const s=JSON.parse(fs.readFileSync(new URL('ideas/revision-v6/scenario.json',root),'utf8'));const route=JSON.parse(fs.readFileSync(new URL('ideas/revision-v6/goal-route.json',root),'utf8'));
let g=E.createGame(s);const evidence=[];
for(const a of route){const r=E.applyAction(s,g,a);assert.ok(r.accepted);g=r.game;if(a.type==='advance'&&['anatomy','inference'].includes(s.stages[g.state.stage].id)){
 const st=s.stages[g.state.stage],automatic={...st};delete automatic.carry;const dynamic=E.sceneCarry(s,g.state,automatic),current=g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>t.id),extra=current.filter(k=>!dynamic.includes(k));
 assert.deepEqual(extra,[]);const recipes=s.recipes.filter((r:any)=>r.id.startsWith(st.id+'-'));assert.ok(recipes.every((r:any)=>dynamic.includes(r.out)),`${st.id} has optional local recipe excluded by dynamic carry`);
 evidence.push({stage:st.id,currentLocal:current,allAuthoredSceneRecipeOutputsAreGoalConnected:true,localItemsExcludedByDynamicCarry:extra});
 }}
fs.writeFileSync(new URL('./carry-override-scope-results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
