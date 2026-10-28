import test from 'node:test';
import assert from 'node:assert/strict';
import {integratedScenarios, scenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {applyChapterPolicies, campaignChapterPolicies} from '../experiments/tangible-campaign/ui/campaign-reactivity.ts';
import type {Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';

test('all 118 chapters in the six current worlds have an explicit editorial entry policy',()=>{
 assert.equal(integratedScenarios.length,6);
 assert.deepEqual(Object.keys(campaignChapterPolicies).sort(),integratedScenarios.map(s=>s.id).sort());
 let count=0,bridges=0;
 for(const s of integratedScenarios){
  assert.deepEqual(Object.keys(campaignChapterPolicies[s.id]).sort(),s.stages.map(st=>st.id).sort(),s.id);
  const playable=applyChapterPolicies(s);
  for(const st of playable.stages){
   count++;
   assert(st.onAlreadyComplete,`${s.id}/${st.id}`);
   assert(['skip','bridge'].includes(st.onAlreadyComplete.mode));
   if(st.onAlreadyComplete.mode==='bridge'){
    bridges++;
    assert(st.onAlreadyComplete.text.trim());
    assert(st.onAlreadyComplete.text.split(/\s+/).length<=60,`Keep ${st.id} a short paragraph`);
    assert(!/\n/.test(st.onAlreadyComplete.text));
    assert(!/\b(cache|recipe|objective|combine|carried|carry)\b/i.test(st.onAlreadyComplete.text),`${st.id} must be narrative, not a mechanical carry list`);
   }
  }
 }
 assert.equal(count,118);
 assert.equal(bridges,13,'Only the curated story turns leave paragraphs');
 assert(bridges<count/5,'No uniform per-chapter bridge');
});

test('ordinary fulfilled rover and Kitchen services disappear; the rescue remains a story turn',()=>{
 const mars=campaignChapterPolicies['mars-connected-survival-v4-return-cargo-research'];
 assert.equal(mars.rover.mode,'skip');
 assert.equal(mars.relay.mode,'bridge');
 assert.equal(mars.rescue.mode,'bridge');
 assert.equal(mars.garden.mode,'bridge');
 const kitchen=campaignChapterPolicies['kitchen-caravan-v6'];
 for(const id of ['salads','custard','sponge','quickbread','meringue','precision'])assert.equal(kitchen[id].mode,'skip',id);
 assert.equal(kitchen.snack.mode,'bridge','Only an actually fulfilled final trolley goal earns the departure paragraph');
});

test('policies neither mutate frozen scenario records nor touch predecessor worlds and save identities',()=>{
 for(const s of integratedScenarios){
  const before=JSON.stringify(s),playable=applyChapterPolicies(s);
  assert.equal(JSON.stringify(s),before);
  assert.equal(playable.id,s.id);
  assert.notEqual(playable,s);
  assert.notEqual(playable.stages,s.stages);
  assert.equal(playable.recipes,s.recipes);
  assert.equal(playable.items,s.items);
  assert.equal(playable.checkpoints,s.checkpoints);
  assert(s.stages.every(st=>st.onAlreadyComplete===undefined),'Raw authored snapshots remain unchanged');
 }
 for(const s of scenarios.filter(s=>!campaignChapterPolicies[s.id]))assert.equal(applyChapterPolicies(s),s,s.id);
});

test('explicit stage metadata wins; missing current-world decisions fail instead of silently skipping',()=>{
 const original=integratedScenarios[0];
 const custom:Scenario={...original,stages:original.stages.map((st,i)=>i?st:{...st,onAlreadyComplete:{mode:'bridge',text:'A deliberately authored local beat.'}})};
 assert.deepEqual(applyChapterPolicies(custom).stages[0].onAlreadyComplete,custom.stages[0].onAlreadyComplete);
 const changed:Scenario={...original,stages:[...original.stages,{...original.stages[0],id:'unauthored-new-chapter'}]};
 assert.throws(()=>applyChapterPolicies(changed),/Missing already-complete chapter policy.*unauthored-new-chapter/);
});
