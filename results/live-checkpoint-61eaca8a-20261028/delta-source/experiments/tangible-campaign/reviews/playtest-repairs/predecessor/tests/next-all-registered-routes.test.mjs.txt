// Headless extraction of the catalogue route/checkpoint coverage from the mixed tangible-campaign aggregate.
// No controller, DOM, browser, layout or touch imports. Evidence output is self-created.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {scenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
const root=new URL('../',import.meta.url),output=new URL('results/content-next-playtest-20261028/catalogue/',root);
fs.mkdirSync(output,{recursive:true});
for(const s of scenarios)test(`Registered route and retained save identity: ${s.id}`,()=>{
 assert.deepEqual(M.validateScenario(s),[]);
 const evidence=JSON.parse(fs.readFileSync(new URL(`experiments/tangible-campaign/evidence/${s.id}-route-evidence.json`,root),'utf8'));
 const game=M.replay(s,evidence.actionsLog);assert(game.state.completed);assert.equal(game.state.metrics.combinations,evidence.combinations);
 assert.deepEqual(M.restore(s,JSON.stringify(game)),game);
 const checkpoints=[];for(const c of s.checkpoints??[]){const earned=M.checkpoint(s,c.id);assert.deepEqual(M.restore(s,JSON.stringify(earned)),earned);checkpoints.push({id:c.id,stage:earned.state.stage,completed:earned.state.completed,combinations:earned.state.metrics.combinations});}
 fs.writeFileSync(new URL(s.id+'.json',output),JSON.stringify({scenarioId:s.id,completed:true,combinations:game.state.metrics.combinations,saveRestoreExact:true,checkpoints,limits:'Current-source replay of documented routes; not UI/browser or fresh-player evidence.'},null,2)+'\n');
});
