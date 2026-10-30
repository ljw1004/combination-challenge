import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {newGame,act,replay,legalActions} from '../src/engine/game.ts';
import {observe} from '../src/playtest/observe.ts';
import {evaluate} from '../src/playtest/evaluate.ts';
import {loadStory,storyIds} from '../src/story/load.ts';
import {checkpoint} from '../src/debug/checkpoint.ts';
import type {Story} from '../src/story/types.ts';
const fixture=(content:string)=>parseStory(`# Test\n\n## Start\n\n![room](room.webp)\n\n${content}`,{id:'test'});
const combine=(s:Story,state:ReturnType<typeof newGame>,a:string,b:string)=>act(s,state,{type:'combine',a:`name:${a}`,b:`name:${b}`});

test('Markdown shorthands compile with source locations, scoped hotspots and hidden author notes',()=>{
  const s=fixture(`A room.\n\n> NOTE: not for players\n> secret continuation\n\n**Goals**\n- Make C -- C\n**Hotspots**\n- Bench (at 25%, 75%)\n  - A [preserve] + B [preserve] -> C\n**Items**\n- A\n  + ignored prose\n- B\n- C\n\n  A useful explanation.`);
  assert.equal(s.recipes[0].hotspot,'name:Bench');assert.equal(s.hotspots['name:Bench'].x,.25);assert(!s.chapters[0].intro.includes('secret'));assert.equal(s.items['name:C'].wonders[0].markdown,'A useful explanation.');assert(s.recipes[0].source.line>1);
  assert.deepEqual(s.diagnostics,[]);
});
test('nested recipes, quoted punctuation, backtick declarations and compound qualifiers',()=>{
  const s=fixture('**Goals**\n- Make machine -- Box[Motor]\n**Items**\n- `q` "A + B"\n  - + Tool [preserve] -> Part\n    - + Wheel [preserve] -> Motor\n- Box (compound)\n  - unnamed slot: accepts Motor\n\n  [Motor] It works.');
  assert.equal(s.recipes[0].a.ref.id,'id:q');assert.equal(s.items['id:q'].name,'A + B');assert.equal(s.recipes[1].a.ref.id,'name:Part');assert(s.recipes.some(r=>r.installation==='name:Motor'));assert.deepEqual(s.items['name:Box'].wonders[0].requires,['name:Motor']);
});
test('lint catches malformed goal composition, asymmetric exclusions and explicit single-use fates',()=>{
  const s=fixture('**Goals**\n- next: Finish -- C\n  - A\n**Items**\n- A (exclusive with B)\n**Combinations**\n- A + Tool -> C');
  const codes=new Set(lintStory(s).map(d=>d.code));for(const code of ['first-next','mixed-goal-form','asymmetric-exclusion','single-use-fate'])assert(codes.has(code),code);
});
test('single event protection considers simultaneous removal of two alternative witnesses',()=>{
  const s=fixture('**Goals**\n- Make C -- C\n**Combinations**\n- A [consume] + B [consume] -> C\n\n## Later\n\n![room](room.webp)\n\n**Goals**\n- Keep a witness\n  - either: A\n  - or: B');
  let state=newGame(s);state=combine(s,state,'A','B');
  // Future goals latch as soon as the visible witness exists, so test a future
  // downstream operation whose alternative reagents are both still needed.
  const t=fixture('**Goals**\n- Make C -- C\n**Combinations**\n- A [consume] + B [consume] -> C\n- A [preserve] + X [preserve] -> D\n- B [preserve] + X [preserve] -> D\n\n## Later\n\n![room](room.webp)\n\n**Goals**\n- Make D -- D');
  const after=combine(t,newGame(t),'A','B');assert(['A','B'].some(n=>after.tokens[`name:${n}`].status==='available'));assert(['A','B'].some(n=>after.tokens[`name:${n}`].status==='consume'));
});
test('permanent exclusive choices survive transformation; no reverse branch is offered',()=>{
  const s=fixture('**Goals**\n- Reach Z -- Z\n**Combinations**\n- Base [transform] + Tool [preserve] -> A (exclusive with B)\n- Base [transform] + Other [preserve] -> B (exclusive with A)\n- A [transform] + Tool [preserve] -> Z\n- B [transform] + Other [preserve] -> Z');
  let state=combine(s,newGame(s),'Base','Tool');state=combine(s,state,'A','Tool');assert(state.excluded.includes('name:B'));assert(!legalActions(s,state).some(a=>a.b==='name:Other'));assert.deepEqual(replay(s,state.actions),state);
});
test('slots install in either order, retain other slots, and transformation wraps details',()=>{
  const s=fixture('**Goals**\n- Make final -- Final\n**Items**\n- Box (compound)\n  - slot: power, accepts Motor\n  - unnamed slot: accepts Battery\n**Combinations**\n- Frame [transform] + Wheel [consume] -> Box\n- Box[Motor,Battery] [transform] + Cover [consume] -> Final');
  for(const parts of [['Motor','Battery'],['Battery','Motor']]){let state=combine(s,newGame(s),'Frame','Wheel');for(const part of parts)state=combine(s,state,part,'Box');assert.deepEqual([...state.tokens['name:Box'].slots].sort(),['name:Battery','name:Motor']);state=combine(s,state,'Box','Cover');assert.deepEqual(state.tokens['name:Final'].slots,[]);}
});
test('future intermediate goals protect a reagent even when final goal has a shortcut',()=>{
  const s=fixture('**Goals**\n- Make flour -- Flour\n**Combinations**\n- Grain [transform] + Stone [preserve] -> Flour\n- Grain [transform] + Pot [preserve] -> Porridge\n- Porridge [consume] + Fruit [preserve] -> Feast\n- Bread [consume] + Fruit [preserve] -> Feast\n\n## Dinner\n\n![room](room.webp)\n\n**Goals**\n- Cook -- Porridge\n- next: Eat -- Feast');
  const state=combine(s,newGame(s),'Grain','Stone');assert.equal(state.tokens['name:Grain'].status,'available');
});
test('placement achievement latches; old copy stays where dragged from on combination',()=>{
  const s=fixture('**Goals**\n- Place A -- A @ Bench\n- Make C -- C\n**Hotspots**\n- Bench\n**Combinations**\n- A [preserve] + B [preserve] -> C');
  let state=newGame(s);state=act(s,state,{type:'move',item:'name:A',chapter:0,x:80,y:500,hotspot:'name:Bench'});state=act(s,state,{type:'move',item:'name:A',chapter:0,x:20,y:100});assert(state.achieved.includes(s.chapters[0].goals[0].id));state=combine(s,state,'A','B');assert.equal(state.tokens['name:A'].x,20);assert.equal(state.tokens['name:A'].y,100);
});
test('fresh observations have partners but no future recipe output or author notes',()=>{
  const s=fixture('**Goals**\n- Discover something -- Secret invention\n**Combinations**\n- A [preserve] + B [preserve] -> Secret invention\n> NOTE: secret note');
  const text=JSON.stringify(observe(s,newGame(s)));assert(!text.includes('Secret invention'));assert(!text.includes('secret note'));assert(text.includes('name:A'));
});
test('a hotspot operand creates its result at the receiving chapter, even when its source came from scrollback',()=>{
  const s=fixture('**Goals**\n- First -- C\n**Combinations**\n- A [consume] + B [consume] -> C\n\n## Workshop\n\n![room](room.webp)\n\n**Goals**\n- Finish -- D\n**Hotspots**\n- Bench\n**Combinations**\n- Raw [transform] @ Bench -> D');
  let state=combine(s,newGame(s),'A','B');while(state.pending.length)state=act(s,state,{type:'dismiss'});state=act(s,state,{type:'advance'});state=act(s,state,{type:'move',item:'name:Raw',chapter:0,x:20,y:100});state=act(s,state,{type:'combine',a:'name:Raw',hotspot:'name:Bench',chapter:1});assert.equal(state.tokens['name:D'].chapter,1);assert.equal(state.tokens['name:D'].hotspot,'name:Bench');assert.equal(state.tokens['name:Raw'].status,'transform');
});
test('all manuscripts lint and have legal complete replay witnesses',()=>{
  for(const id of storyIds()){const {story}=loadStory(id);assert.deepEqual(lintStory(story).filter(d=>d.severity==='error'),[],id);const state=checkpoint(story,story.chapters.length);assert(state.completed,id);assert.deepEqual(replay(story,state.actions),state,id);}
});
