import {currentMarsRouteActions} from '../experiments/tangible-campaign/integration/current-mars-route-actions.ts';
import '../experiments/tangible-campaign/reviews/lifecycle/objective-flow.test.ts';
import '../experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts';
import '../experiments/tangible-campaign/reviews/persistence/save-autosave.test.ts';
import '../experiments/tangible-campaign/engine/model.test.ts';
import '../experiments/tangible-campaign/tests/independent-engine.test.ts';
import '../experiments/tangible-campaign/ui/campaign-controller.test.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {scenarios} from '../experiments/tangible-campaign/ui/pre-location-scenarios-v1.ts';
import {validateScenario,replay,checkpoint} from '../experiments/tangible-campaign/engine/model.ts';
for(const s of scenarios)test('Shared browser data: '+s.id+' exact historical or declared current route and checkpoints',()=>{assert.deepEqual(validateScenario(s),[]);const evidence=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8'));const currentMars=s.id==='mars-connected-survival-v4-return-cargo-research',game=replay(s,currentMars?currentMarsRouteActions(evidence.actionsLog):evidence.actionsLog);assert(game.state.completed);assert.equal(game.state.metrics.combinations,evidence.combinations+(currentMars?1:0));for(const c of s.checkpoints??[])assert(checkpoint(s,c.id));});

import '../experiments/tangible-campaign/reviews/lifecycle/event-local.test.ts';
