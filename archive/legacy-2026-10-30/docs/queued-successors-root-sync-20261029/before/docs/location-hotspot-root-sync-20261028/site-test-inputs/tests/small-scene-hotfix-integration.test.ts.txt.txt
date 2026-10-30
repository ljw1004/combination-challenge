import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenarios,featuredScenarioIds,presentationFor} from '../experiments/tangible-campaign/ui/current-scenarios.ts';
import {scenario as v2} from '../experiments/tangible-campaign/ui/stories/elements-locations.ts';
import {scenario as v3} from '../experiments/tangible-campaign/ui/stories/elements-small-scenes.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {lifecycleAudit} from '../experiments/tangible-campaign/integration/current-lifecycle-audit.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {acceptedTestRoute} from '../experiments/tangible-campaign/integration/accepted-current-test-routes.ts';
import {toLegacyScenario,toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
test('featured small opening is distinct from exact retained v2 object, direct route and save identity',()=>{
 assert.equal(scenarios.find(s=>s.id===v2.id),v2);assert.equal(scenarios.find(s=>s.id===v3.id),v3);
 assert(featuredScenarioIds.includes(v3.id));assert(!featuredScenarioIds.includes(v2.id));assert.match(presentationFor(v2).title,/^Snapshot:/);
 assert.deepEqual(v3.recipes,v2.recipes);assert.deepEqual(v3.milestones,v2.milestones);
 for(const s of [v2,v3]){
  const accepted=acceptedTestRoute(toLegacyScenario(s));assert.equal(accepted.source.kind,'authored-complete-checkpoint');assert.equal(accepted.actions.length,s.checkpoints!.find(c=>c.id==='complete')!.actions.length);
  const saved=JSON.stringify({game:toLegacyGame(M.createGame(s)),seen:[],tops:{}});
  const h=locationHarness(s,saved,{worlds:scenarios,search:'?world='+s.id});
  assert.equal(h.key,'tangible-campaign-v1:'+s.id);assert.equal(h.state().scenarioId,s.id);
  assert.throws(()=>M.restore(s===v2?v3:v2,JSON.stringify(h.state())),/Invalid campaign save/);
 }
});
test('new audit rows inherit all 226 v2 declarations exactly without replacing history',()=>{
 const before=lifecycleAudit.recipes.filter((r:any)=>r.world===v2.id),after=lifecycleAudit.recipes.filter((r:any)=>r.world===v3.id);
 assert.equal(before.length,v2.recipes.length);assert.equal(after.length,226);
 assert.deepEqual(after.map((r:any)=>({...r,world:v2.id})),before);
 const doc=readFileSync(new URL('../DESIGN_PRINCIPLES.md',import.meta.url),'utf8');
 assert.match(doc,/## The working set is a clue, not just a space budget/);
 assert.match(doc,/not a universal hard cap/);assert.match(doc,/Leave unrelated creations tangible/);
});
