import test from 'node:test';
import assert from 'node:assert/strict';
import { screenCanvas } from '../experiments/constellation-screen.ts';
test('all canvas goals remain reachable with unique concepts and both ingredients retained',()=>{
  const result=screenCanvas();
  assert.equal(result.levels.length,3);
  for(const level of result.levels){assert.equal(level.won,true);assert.equal(level.nodes,4+level.fusions);}
});
