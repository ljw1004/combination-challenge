import {test} from 'node:test';
import assert from 'node:assert/strict';
import {goalClipPath} from '../src/web/goal-clearance.ts';
import {saveProgress} from '../src/web/persistence.ts';
import {parseStory} from '../src/story/parser.ts';
import {newGame,act} from '../src/engine/game.ts';
import {captureChapter,chapterEntry,restorePresentation,restoreChapterSession,isNoopMove,noteChapterAction,chapterRecovery,displayedGoals} from '../src/web/chapter-session.ts';
const story=parseStory(`# Session
## First
![room](room.webp)
Start here.
**Goals**
- Make C -- C
- Place A -- A @ Bench
**Hotspots**
- Bench
**Combinations**
- A [preserve] + B [preserve] -> C
## Already done
![room](room.webp)
**Goals**
- Have C -- C
## Later
![room](room.webp)
Keep going.
**Goals**
- Make D -- D
**Combinations**
- C [preserve] + E [preserve] -> D`,{id:'session'});

test('chapter reset eligibility ignores reading and no-op movement but remembers changes through reload',()=>{
  let state=newGame(story);state.tokens['name:A'].x=40;state.tokens['name:A'].y=270;
  const session=captureChapter(state);assert.equal(chapterRecovery(session,state),undefined);
  noteChapterAction(session,state,{type:'dismiss'});assert.equal(session.changed,false);
  const noop={type:'move' as const,item:'name:A',chapter:0,x:40,y:270};
  assert(isNoopMove(state,noop));noteChapterAction(session,state,noop);assert.equal(session.changed,false);
  const move={...noop,x:90};noteChapterAction(session,state,move);state=act(story,state,move);
  assert.equal(chapterRecovery(session,state),'chapter');
  const loaded=restoreChapterSession(story,state,JSON.parse(JSON.stringify(session)))!;
  assert.equal(loaded.changed,true);assert.equal(loaded.entry.tokens['name:A'].x,40);assert.equal(loaded.entry.tokens['name:A'].y,270);
  const reset=captureChapter(loaded.entry);assert.equal(chapterRecovery(reset,reset.entry),undefined);
  assert.deepEqual(reset.entry,session.entry);
});
test('snapshot reconstruction uses actual visited boundaries including skipped chapters and preserves scrollback geometry',()=>{
  let state=newGame(story);state=act(story,state,{type:'dismiss'});
  state=act(story,state,{type:'combine',a:'name:A',b:'name:B'});
  state=act(story,state,{type:'move',item:'name:A',chapter:0,x:100,y:600,hotspot:'name:Bench'});
  state=act(story,state,{type:'advance'});assert.equal(state.chapter,2);
  const boundary=chapterEntry(story,state);assert.equal(boundary.chapter,2);assert.deepEqual(boundary.actions,state.actions);
  state.tokens['name:B'].x=71;state.tokens['name:B'].y=333;
  const session=captureChapter(state);assert.equal(chapterRecovery(session,state),'story');
  const loaded=restoreChapterSession(story,state,JSON.parse(JSON.stringify(session)))!;
  assert.equal(loaded.entry.tokens['name:B'].x,71);assert.equal(loaded.entry.tokens['name:B'].y,333);
  assert.deepEqual(restorePresentation(story,loaded.entry),loaded.entry);
  assert.equal(restoreChapterSession(story,newGame(story),session),undefined);
  assert.equal(restoreChapterSession(story,state,{entry:{},changed:false}),undefined);
});
test('partial goals retain checked rows while remaining goals are unchecked',()=>{
  let state=newGame(story);
  assert.deepEqual(displayedGoals(story,state).map(r=>r.done),[false,false]);
  state=act(story,state,{type:'combine',a:'name:A',b:'name:B'});
  assert.deepEqual(displayedGoals(story,state).map(r=>r.done),[true,false]);
});

test('failed storage reports immediately and a subsequent successful write clears the alert',()=>{
  const alerts:string[]=[];let written=false;
  const failure=saveProgress(()=>{throw new Error('Quota exceeded');},message=>alerts.push(message));
  assert.match(failure,/Progress could not be saved/);assert.deepEqual(alerts,[failure]);
  const success=saveProgress(()=>{written=true;},message=>alerts.push(message));
  assert.equal(written,true);assert.equal(success,'');assert.deepEqual(alerts,[failure,'']);
});

test('goal clearance subtracts overlapping cards as a union, leaving uncovered goals interactive',()=>{
  assert.equal(goalClipPath(100,50,[]),'none');
  assert.equal(goalClipPath(100,50,[{left:110,top:0,right:140,bottom:30}]),'none');
  assert.equal(goalClipPath(100,50,[{left:-10,top:10,right:40,bottom:30},{left:20,top:20,right:60,bottom:70}]),'path(evenodd, "M0 0H100V50H0ZM0 10H20V30H0ZM20 10H40V50H20ZM40 20H60V50H40Z")');
});
