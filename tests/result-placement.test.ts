import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act,newGame,replay} from '../src/engine/game.ts';
import {placeCreation} from '../src/web/board-geometry.ts';

test('all nine dispositions follow the drop receiver across chapters and recipe operand orders',()=>{
  for(const a of ['preserve','transform','consume'])for(const b of ['preserve','transform','consume'])for(const reverse of [false,true])for(const contextual of [false,true]){
    const operands=[`A [${a}]`,`B [${b}]`];if(reverse)operands.reverse();
    const story=parseStory(`# Placement
## Earlier
![room](first.webp)
**Goals**
- Begin -- Signal
**Hotspots**
- Source
**Items**
- A
- B
**Combinations**
- Switch [preserve] + Hand [preserve] -> Signal
## Work
![room](second.webp)
**Goals**
- Make C -- C
**Hotspots**
- Destination
**Combinations**
- ${operands.join(' + ')}${contextual?' @ Destination':''} -> C`);
    let state=act(story,newGame(story),{type:'combine',a:'name:Switch',b:'name:Hand'});
    state=act(story,state,{type:'advance'});
    state=act(story,state,{type:'move',item:'name:A',chapter:0,x:30,y:150,hotspot:'name:Source'});
    state=act(story,state,{type:'move',item:'name:B',chapter:1,x:230,y:510,hotspot:'name:Destination'});
    const after=act(story,state,{type:'combine',a:'name:A',b:'name:B',...(contextual?{hotspot:'name:Destination'}:{})}),result=after.tokens['name:C'];
    assert.equal(after.tokens['name:A'].status,a==='preserve'?'available':a);
    assert.equal(after.tokens['name:B'].status,b==='preserve'?'available':b);
    assert.deepEqual({...after.tokens['name:A'],status:state.tokens['name:A'].status},state.tokens['name:A']);
    assert.deepEqual({...after.tokens['name:B'],status:state.tokens['name:B'].status},state.tokens['name:B']);
    assert.equal(result.chapter,1);
    assert.equal(result.x,b==='preserve'?242:230);assert.equal(result.y,b==='preserve'?552:510);
    assert.equal(result.hotspot,b==='preserve'?undefined:'name:Destination');
    assert.deepEqual(replay(story,after.actions),after);
  }
});

test('protection of future ingredients determines replacement rather than authored fate',()=>{
  for(const protectedItem of ['A','B']){
    const story=parseStory(`# Protected
## First
**Goals**
- Make C -- C
**Combinations**
- A [transform] + B [consume] -> C
- ${protectedItem} [preserve] + Tool [preserve] -> D
## Later
**Goals**
- Make D -- D`);
    let state=newGame(story);
    state=act(story,state,{type:'move',item:'name:A',chapter:0,x:30,y:150});
    state=act(story,state,{type:'move',item:'name:B',chapter:0,x:230,y:510});
    const after=act(story,state,{type:'combine',a:'name:A',b:'name:B'});
    assert.equal(after.tokens[`name:${protectedItem}`].status,'available');
    assert.equal(after.tokens['name:C'].x,protectedItem==='B'?242:230);
    assert.equal(after.tokens['name:C'].y,protectedItem==='B'?552:510);
  }
});

test('measured replacements preserve the receiver centre and fit larger results at board edges',()=>{
  const receiver={x:210,y:390,width:40,height:56},result={width:140,height:100};
  const position=placeCreation(receiver,result,true);
  assert.equal(position.x+result.width/2,receiver.x+receiver.width/2);
  assert.equal(position.y+result.height/2,receiver.y+receiver.height/2);
  assert.deepEqual(placeCreation({...receiver,x:0,y:0},result,true),{x:0,y:0});
  assert.deepEqual(placeCreation({...receiver,x:350,y:788},result,true),{x:250,y:744});
});

test('new results stay clear of surviving receivers even beside each board edge',()=>{
  const result={width:140,height:100};
  for(const [x,y] of [[200,400],[0,0],[350,0],[0,788],[350,788]]){
    const receiver={x,y,width:40,height:56},position=placeCreation(receiver,result,false);
    assert(position.x>=0&&position.x+result.width<=390&&position.y>=0&&position.y+result.height<=844);
    assert(position.x+result.width<=x||position.x>=x+receiver.width||position.y+result.height<=y||position.y>=y+receiver.height);
    assert(Math.hypot(position.x+result.width/2-x-receiver.width/2,position.y+result.height/2-y-receiver.height/2)<200);
  }
});

test('a new ingredient avoids unrelated ingredients when its receiver survives',()=>{
  const receiver={x:134,y:120,width:128,height:120};
  const apples={x:175,y:268,width:60,height:60};
  const other={x:274,y:130,width:104,height:108};
  const occupied=[receiver,apples,other],before=structuredClone(occupied),result={width:68,height:52};
  const position=placeCreation(receiver,result,false,undefined,occupied);
  for(const r of occupied)assert(position.x+result.width<=r.x||r.x+r.width<=position.x||position.y+result.height<=r.y||r.y+r.height<=position.y);
  assert.deepEqual(occupied,before,'existing placements stay untouched');
  assert(position.x>=0&&position.x+result.width<=390&&position.y>=0&&position.y+result.height<=844);
});
