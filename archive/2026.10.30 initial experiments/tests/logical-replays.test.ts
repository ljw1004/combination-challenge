import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOGICAL_GAMES, replayLogical } from '../experiments/logical-games.ts';
import type { LogicalRun } from '../experiments/logical-games.ts';
for(const id of ['logic-shape-a','logic-shape-b','logic-rule-a','logic-rule-b','logic-rule-c','logic-rule-d','logic-rule-e','logic-rule-f','logic-progress-a']){
  test(`saved abstract player ${id} remains exactly replayable`,()=>{
    const run=JSON.parse(readFileSync(`results/logical-players/${id}.json`,'utf8')) as LogicalRun;
    assert.equal(LOGICAL_GAMES[run.game].status(replayLogical(run)),'won');
  });
}
