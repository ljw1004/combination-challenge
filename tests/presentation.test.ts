import {test} from 'node:test';
import assert from 'node:assert/strict';
import {goalPresentation,readingBody} from '../src/web/presentation.ts';

test('goals wait for every pending wonder, then leave once before arrow settles',()=>{
  let view=goalPresentation(undefined,'elements:3',false,false,false);
  assert.equal(view.phase,'goals');
  view=goalPresentation(view,'elements:3',true,true,false);assert.equal(view.phase,'goals');
  view=goalPresentation(view,'elements:3',true,true,false);assert.equal(view.phase,'goals');
  view=goalPresentation(view,'elements:3',true,false,false);assert.equal(view.phase,'leaving');
  assert.equal(goalPresentation(view,'elements:3',true,false,false),view);
  view.phase='entering';assert.equal(goalPresentation(view,'elements:3',true,false,false),view);
  view.phase='arrow';assert.equal(goalPresentation(view,'elements:3',true,false,false),view);
  // An optional later wonder does not reintroduce an already earned arrow.
  assert.equal(goalPresentation(view,'elements:3',true,true,false),view);
});
test('readiness interruption, new chapter, reload and reduced motion do not replay stale entrances',()=>{
  const leaving=goalPresentation({key:'a:0',phase:'goals'},'a:0',true,false,false);
  assert.equal(goalPresentation(leaving,'a:0',true,true,false).phase,'goals');
  assert.equal(goalPresentation(leaving,'a:0',false,false,false).phase,'goals');
  assert.equal(goalPresentation(leaving,'a:1',false,true,false).phase,'goals');
  assert.equal(goalPresentation(undefined,'a:0',true,false,false).phase,'arrow');
  assert.equal(goalPresentation(leaving,'a:0',true,false,true).phase,'arrow');
});
test('reading body preserves exactly authored paragraphs and does not invent an item caption',()=>{
  const body=readingBody('Plants provide food.\n\n*Plant*');
  assert.equal(body,'<div class="reading-text"><p>Plants provide food.</p><p><em>Plant</em></p></div>');
  assert.equal(readingBody('Only an explanation.'),'<div class="reading-text"><p>Only an explanation.</p></div>');
});
