import '../experiments/tangible-campaign/reviews/persistence/save-autosave.test.ts';
import '../experiments/tangible-campaign/engine/model.test.ts';
import '../experiments/tangible-campaign/tests/independent-engine.test.ts';
import '../experiments/tangible-campaign/ui/campaign-controller.test.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {scenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {validateScenario,replay,checkpoint} from '../experiments/tangible-campaign/engine/model.ts';
for(const s of scenarios)test('Shared browser data: '+s.id+' exact authored route and checkpoints',()=>{assert.deepEqual(validateScenario(s),[]);const evidence=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8'));const game=replay(s,evidence.actionsLog);assert(game.state.completed);assert.equal(game.state.metrics.combinations,evidence.combinations);for(const c of s.checkpoints??[])assert(checkpoint(s,c.id));});
