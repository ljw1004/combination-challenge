import fs from 'node:fs';
import {scenario as integrated} from '../experiments/tangible-campaign/ui/campaigns/food-kitchen-caravan.ts';
import {scenario as retained} from '../experiments/tangible-campaign/ui/campaigns/food.ts';
import test from 'node:test';import assert from 'node:assert/strict';
import {validate,preservation,facilityCheck,finaleChecks,names,witness,s,base,read} from '../experiments/tangible-campaign/integration/kitchen-caravan-checks.ts';
import {checkpoint,createGame,applyAction,restore,playerView} from '../experiments/tangible-campaign/engine/model.ts';
test('Content/schema/lifecycle/objective/construction validation passes',()=>{assert.deepEqual(validate(),[]);});
test('184 existing food recipes and the first 18 chapters retain their cooking semantics; old inputs are protected',()=>{preservation();});
test('Ten coherent stations replace 20 isolated areas, with all supplies on arrival and no mid-kitchen movement',()=>{const r=facilityCheck();assert.equal(r.activeWorkstations,10);assert.equal(r.sameKitchenTransitions,10);});
test('The existing delightful five-supply opening remains intact',()=>{assert.deepEqual(s.initialItems,base.initialItems);assert.deepEqual(s.stages[0].caches,[]);assert.deepEqual(s.stages[0].objectives,base.stages[0].objectives);});
test('Every checkpoint is a legal prefix, with the new ending and existing save roundtrip',()=>{assert.equal(s.checkpoints!.length,21);for(const c of s.checkpoints!)assert.deepEqual(restore(s,JSON.stringify(checkpoint(s,c.id))),checkpoint(s,c.id));});
test('Finale requires real meal, juice, a cake and delivery, in either dessert choice and any loading order',()=>{const r=finaleChecks();assert.equal(r.completedOrders,144);assert.equal(r.missingCourseCases,96);assert(r.bothDessertsVisibleWithoutOverwrite);});
test('Optional historical readings remain intact and no reading action is required',()=>{assert.deepEqual(s.items.filter(i=>i.reading),base.items.filter(i=>i.reading));const sugar=checkpoint(s,'sugar');assert(playerView(s,sugar).things.find(i=>i.id==='sugar')?.reading);});
for(const name of names)test(`${name}: full cooking journey, ten stations, 10 stationary chapter handoffs, visible supper and save`,()=>{witness(name,360);});

test('Food integrated JSON is exact; author base has only the explicit 22-name bridge from played v5',()=>{assert.deepEqual(integrated,s);const bridge=JSON.parse(fs.readFileSync(new URL('../experiments/tangible-campaign/evidence/integration-20261028/kitchen-atlas-20261028/food-base-name-bridge.json',import.meta.url),'utf8'));assert.equal(bridge.changes.length,22);const copy=structuredClone(base);for(const row of bridge.changes){const x=copy.locations[row.index];assert.equal(x.id,row.id);assert.equal(x.label,row.namedPredecessorLabel);assert.equal(retained.locations[row.index].label,row.actualPlayedLabel);x.label=row.actualPlayedLabel;}assert.deepEqual(copy,retained);});
