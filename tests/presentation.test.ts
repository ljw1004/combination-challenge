import {test} from 'node:test';
import assert from 'node:assert/strict';
import {goalPresentation,readingBody} from '../src/web/presentation.ts';

test('new readiness starts one concurrent goal departure and arrow entrance',()=>{
  let view=goalPresentation(undefined,'settlement:3',false,false);
  assert.equal(view.phase,'goals');
  view=goalPresentation(view,'settlement:3',true,false);assert.equal(view.phase,'leaving');
  assert.equal(goalPresentation(view,'settlement:3',true,false),view);
  view.phase='arrow';assert.equal(goalPresentation(view,'settlement:3',true,false),view);
});
test('readiness interruption, new chapter, reload and reduced motion do not replay stale entrances',()=>{
  const leaving=goalPresentation({key:'a:0',phase:'goals'},'a:0',true,false);
  assert.equal(goalPresentation(leaving,'a:0',false,false).phase,'goals');
  assert.equal(goalPresentation(leaving,'a:1',false,false).phase,'goals');
  assert.equal(goalPresentation(undefined,'a:0',true,false).phase,'arrow');
  assert.equal(goalPresentation(leaving,'a:0',true,true).phase,'arrow');
});
test('reading body preserves exactly authored paragraphs and does not invent an item caption',()=>{
  const body=readingBody('Plants provide food.\n\n*Plant*');
  assert.equal(body,'<div class="reading-text"><p>Plants provide food.</p><p><em>Plant</em></p></div>');
  assert.equal(readingBody('Only an explanation.'),'<div class="reading-text"><p>Only an explanation.</p></div>');
});
