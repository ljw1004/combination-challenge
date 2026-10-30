import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_CONCEPTS, RECIPES } from '../src/data.ts';
import { createTable, HANDS_VERSION, reaction, replayTable, tableHash, tableStep } from '../src/workbench-model.ts';
import type { TableAction, TableCapture, TableState } from '../src/workbench-model.ts';

test('two physical ingredients become one result at their contact, with permanent shelf access',()=>{
  const s=createTable();Object.freeze(s);
  const next=tableStep(s,{type:'mix',first:'piece-1',second:'piece-2'});
  assert.equal(s.pieces.length,2);assert.deepEqual(s.known,BASE_CONCEPTS);
  assert.equal(next.pieces.length,1);assert.equal(next.pieces[0].concept,'clay');
  assert.equal(next.pieces[0].x,s.pieces[1].x);assert.equal(next.pieces[0].y,s.pieces[1].y);
  assert.ok(next.known.includes('soil')&&next.known.includes('water')&&next.known.includes('clay'));
  assert.equal(next.lastResult?.isNew,true);assert.equal(next.mixes,1);
});
test('every displayed pair works in either drag direction and repeats preserve conceptual access',()=>{
  for(const recipe of RECIPES)for(const [first,second]of [recipe.inputs,[...recipe.inputs].reverse()]){
    const s=createTable();s.known=[...new Set([...s.known,...recipe.inputs,recipe.output])];
    s.pieces=[{id:'a',concept:first,x:.3,y:.5},{id:'b',concept:second,x:.6,y:.5}];
    assert.equal(reaction(first,second),recipe.output);
    const next=tableStep(s,{type:'mix',first:'a',second:'b'});
    assert.equal(next.pieces[0].concept,recipe.output);assert.equal(next.lastResult?.isNew,false);
    assert.equal(next.known.length,s.known.length);
  }
});
test('a shelf ingredient physically joins a table piece without an intermediate recipe command',()=>{
  let s=tableStep(createTable(),{type:'mix',first:'piece-1',second:'piece-2'});
  s=tableStep(s,{type:'mix-from-shelf',concept:'heat',target:s.pieces[0].id});
  assert.equal(s.pieces.length,1);assert.equal(s.pieces[0].concept,'brick');assert.equal(s.mixes,2);
  const copy=tableStep(s,{type:'take',concept:'clay',x:.2,y:.7});
  assert.equal(copy.mixes,2);assert.equal(copy.pieces.length,2);
});
test('invalid pairs, unknown items and self-drops cannot erase ingredients or grant discoveries',()=>{
  const s=createTable();
  assert.throws(()=>tableStep(s,{type:'mix',first:'piece-1',second:'piece-1'}),/two different/);
  assert.throws(()=>tableStep(s,{type:'take',concept:'pump',x:.5,y:.5}),/not been discovered/);
  assert.throws(()=>tableStep(s,{type:'mix-from-shelf',concept:'sand',target:'piece-1'}),/stay separate/);
  assert.equal(s.mixes,0);assert.equal(s.pieces.length,2);assert.equal(reaction('unknown','water'),null);
});
test('free arrangement and clearing do not spend mixtures or delete known concepts',()=>{
  let s=tableStep(createTable(),{type:'mix',first:'piece-1',second:'piece-2'});
  const moved=tableStep(s,{type:'move',piece:s.pieces[0].id,x:.1,y:.9});
  assert.equal(moved.pieces[0].x,.1);assert.equal(moved.mixes,1);
  const cleared=tableStep(moved,{type:'clear'});assert.equal(cleared.pieces.length,0);assert.ok(cleared.known.includes('clay'));
  const copy=tableStep(cleared,{type:'take',concept:'clay',x:.5,y:.5});assert.equal(copy.pieces[0].concept,'clay');
  assert.throws(()=>tableStep(s,{type:'take',concept:'soil',x:NaN,y:.5}),/finite/);
});
test('recorded tabletop mixtures, movement and undo replay exactly and reject tampering',()=>{
  let s=createTable();const history:TableState[]=[];
  const capture:TableCapture={schema:1,version:HANDS_VERSION,id:'test',decisions:[],interactions:[]};
  const actions:(TableAction|{type:'undo'})[]=[{type:'mix',first:'piece-1',second:'piece-2'},{type:'move',piece:'piece-3',x:.3,y:.4},{type:'mix-from-shelf',concept:'heat',target:'piece-3'},{type:'undo'}];
  for(const action of actions){const before=tableHash(s);if(action.type==='undo')s=history.pop()!;else {const old=s;s=tableStep(s,action);if(action.type!=='move')history.push(old);}capture.decisions.push({index:capture.decisions.length,action,before,after:tableHash(s)});}
  assert.deepEqual(replayTable(capture),s);assert.equal(s.pieces[0].concept,'clay');
  const forged=structuredClone(capture);forged.decisions[0].after='wrong';assert.throws(()=>replayTable(forged),/changed/);
});
