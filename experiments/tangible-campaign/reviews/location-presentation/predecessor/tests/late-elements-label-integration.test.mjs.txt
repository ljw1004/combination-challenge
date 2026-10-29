// Single approved copy override only; current-runtime authored replay, not player/UI evidence.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {scenario as current} from '../experiments/tangible-campaign/ui/campaigns/elements.ts';
import {scenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {readSource,routeActions,routeSpecs,evidenceRoot,digest} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
fs.mkdirSync(new URL('../results/content-late-20261028/',import.meta.url),{recursive:true});
const override=JSON.parse(fs.readFileSync(new URL('late-revision-20261028/elements-label-override.json',evidenceRoot),'utf8')),old=readSource(override.source);
test('Elements override is one label, keeping description, all semantics, scenario identity and sole registration exact',()=>{
 assert.equal(override.changes.length,1);assert.equal(digest(fs.readFileSync(new URL('sources/'+override.source,evidenceRoot))),override.sourceSha256);
 const inverse=structuredClone(current),item=inverse.items.find(i=>i.id==='sealed-crock'),change=override.changes[0];assert.equal(item.label,'Lidded crock');assert.equal(item.description,'A storage crock fitted with its cover.');item.label=change.before;assert.deepEqual(inverse,old);assert.equal(current.id,old.id);assert.equal(scenarios.filter(s=>s.id===current.id).length,1);
});
test('Every accepted canonical action has exactly the same engine state; old saves restore and new visible label appears at creation',()=>{
 let a=M.createGame(old),b=M.createGame(current),seen=false;const actions=routeActions('elements/candidates/v7/elements-gathering-refinement-v7-route-evidence.json');let restores=0;
 for(const action of actions){const ar=M.applyAction(old,a,action),br=M.applyAction(current,b,action);assert(ar.accepted);assert(br.accepted);a=ar.game;b=br.game;assert.deepEqual(b.state,a.state);assert.deepEqual(b.history,a.history);assert.deepEqual({...b,events:b.events.map(e=>e.recipe==='sealed-crock'?{...e,message:e.message.replace('Lidded crock.','Sealed crock.')}:e)},a);assert.deepEqual(M.restore(current,JSON.stringify(a)),a);restores++;
  if(br.created==='sealed-crock'){assert.equal(M.playerView(current,b).things.find(t=>t.id==='sealed-crock').label,'Lidded crock');seen=true;}
 }
 assert(seen);assert(b.state.completed);assert.equal(b.state.metrics.combinations,196);
 fs.writeFileSync(new URL('../results/content-late-20261028/elements-label-regression.json',import.meta.url),JSON.stringify({scenarioId:current.id,changedFields:1,canonicalCombinations:196,statesAndOldSaveRestoresChecked:restores,exactStateAndHistoryEquality:true,eventCopyDeltaOnly:"The authored label is also reflected in the sealed-crock creation message.",oldSavesCompatible:true,newIdOrDuplicateRegistration:false,freshCorrectedCopyPlayer:false,UI:false},null,2)+'\n');
});
