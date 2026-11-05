import {test} from 'node:test';
import assert from 'node:assert/strict';
import {viewportBoard} from '../src/web/board-geometry.ts';

test('portrait classification includes exactly 9:16 and uses the actual pane', () => {
  assert.equal(viewportBoard(390,844,{width:900,height:1600}).cover,true);
  assert.equal(viewportBoard(390,844,{width:900,height:1599}).cover,false);
  assert.equal(viewportBoard(639,900).cover,true);
  assert.equal(viewportBoard(640,900).cover,false);
  assert.equal(viewportBoard(600,600).cover,false);
  assert.equal(viewportBoard(844,390).cover,false);
});

test('phone filling crops sides or bottom, while a desktop exposes the complete scene', () => {
  const short=viewportBoard(390,664),tall=viewportBoard(320,844),desktop=viewportBoard(1920,1200);
  assert.deepEqual(short.bounds,{x:0,y:0,width:390,height:664});
  assert.equal(tall.width,320); assert.equal(tall.bounds.x,35);
  assert.equal(desktop.width,390*1200/844);
  assert.deepEqual(desktop.bounds,{x:0,y:0,width:390,height:844});
  const landscape=viewportBoard(390,844,{width:1024,height:768});
  assert.equal(landscape.width,390); assert.equal(landscape.height,292.5);
  assert.equal(landscape.top,(844-292.5)/2);
});
