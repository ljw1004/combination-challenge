import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {availableTokens,replay} from '../src/engine/game.ts';
import {choose,startAdventure,renderFrame} from '../src/playtest/adventure.ts';
import {detailedObjects} from '../src/playtest/detailed.ts';
import {parseCommand,resolveName} from '../src/playtest/commands.ts';
import {completeCommandLine} from '../src/playtest/terminal-input.ts';
import {submitReply,verifyChapterSession,playerRequest} from '../src/playtest/chapter-session.ts';
import type {ChapterSession} from '../src/playtest/chapter-session.ts';
import type {DetailedChoice} from '../src/playtest/commands.ts';
import {rubric} from '../src/playtest/rubrics.ts';
import {digest} from '../src/playtest/session.ts';
import {graderPacket,validateGrade} from '../src/playtest/grading.ts';
import {workshop} from './fixtures/adventure.ts';

const station = parseStory(`# Station
## Work
**Goals**
- Finish -- Finished
**Hotspots**
- Warm hearth
**Items**
- Warm dough
- Cold water
- Starter
- Salt
- Finished
- Bread
- Salty bread
- Paste
**Combinations**
- Warm dough [transform] + Starter [preserve] @ Warm hearth -> Bread
- Warm dough [transform] + Salt [preserve] @ Warm hearth -> Salty bread
- Warm dough [transform] + Cold water [preserve] -> Paste
- Bread [transform] + Cold water [preserve] -> Finished
- Salty bread [transform] + Cold water [preserve] -> Finished
- Paste [transform] + Starter [preserve] -> Finished
`);
const start = (story=station) => startAdventure(story,{mode:'chapter',playStyle:'detailed'});
const result = (a:ReturnType<typeof start>) => a.frame.messages.map(m=>m.text).join('\n');

test('detailed hints reveal current partners without outputs or contextual third ingredients',()=>{
  const initial=start();assert.equal(initial.frame.options.length,0);
  assert.doesNotMatch(renderFrame(initial.frame),/\d+\. Warm dough|Salty bread|Can combine/);
  const inspected=choose(station,initial,1,{inspect:'Warm dough'});
  assert.equal(inspected.frame.step,2);assert.deepEqual(inspected.state,initial.state);
  assert.match(result(inspected),/Can combine with:\n- Warm hearth\n- Cold water/);
  assert.doesNotMatch(result(inspected),/Starter|Salt|Bread|Paste/);
  const hotspot=choose(station,initial,1,{inspect:'Warm hearth'});
  assert.match(result(hotspot),/- Warm dough\n- Starter\n- Salt/);
  assert.doesNotMatch(result(hotspot),/Cold water|Bread/);
  const failed=choose(station,initial,1,{combine:'Warm dough',with:'Salt'});
  assert.equal(failed.frame.step,2);assert.deepEqual(failed.state,initial.state);
  assert.match(result(failed),/^Cannot be combined\nCan combine with:/);
});

test('either item–hotspot direction executes a complete reaction in manuscript order and clears occupancy',()=>{
  for (const command of [{combine:'Warm dough',with:'Warm hearth'},{combine:'Warm hearth',with:'Warm dough'}]) {
    const initial=start(),made=choose(station,initial,1,command);
    assert.match(result(made),/Combined this together with: Starter/);
    assert.match(result(made),/Transformed into: Bread/);
    assert(!made.state.tokens['name:Salty bread']);
    assert(availableTokens(made.state).every(t=>!t.hotspot));
    assert.deepEqual(replay(station,made.state.actions),made.state);
    assert(made.state.actions.length>initial.state.actions.length+1,'automatic moves belong to one decision');
    assert.equal(made.frame.step,2);
  }
});

test('a sole inspection executes once, including contextual reactions, compounds and placement-only goals',()=>{
  const s=parseStory(workshop);let a=start(s);
  a=choose(s,a,1,{inspect:'Sheet'});assert.match(result(a),/Transformed into: Case\[\]/);
  a=choose(s,a,2,{inspect:'Lid'});assert.match(result(a),/Slotted in: Case\[Lid\]/);
  a=choose(s,a,3,{combine:'Shelf',with:'Case'});assert.match(result(a),/Placed: Case\[Lid\] at Shelf/);
  assert.equal(a.frame.phase,'complete');assert.equal(a.frame.step,4);
  assert(availableTokens(a.state).every(t=>!t.hotspot));assert.deepEqual(replay(s,a.state.actions),a.state);
  const contextual=choose(station,start(),1,{inspect:'Salt'});
  assert.match(result(contextual),/Combined this together with: Warm dough/);
  assert.match(result(contextual),/Transformed into: Salty bread/);
});

test('direct hotspot reactions take priority, report actual fates, and missing ingredients are not invented',()=>{
  const s=parseStory(`# Direct
## Work
**Goals**
- Finish -- End
**Hotspots**
- H
**Items**
- A
- B
- Tool
- C
- D
- End
**Combinations**
- A [transform] + B [consume] @ H -> D
- A [transform] @ H -> C
- C [transform] + B [consume] -> End
- D [transform] + Tool [preserve] -> End
`);
  let a=choose(s,start(s),1,{combine:'H',with:'A'});
  assert.match(result(a),/Transformed into: C/);assert.doesNotMatch(result(a),/Combined this together/);
  a=choose(s,a,2,{combine:'C',with:'B'});
  assert.match(result(a),/Consumed: B\.\nTransformed into: End/);
  const missing=parseStory(`# Missing
## Work
**Goals**
- Finish -- C
**Hotspots**
- H
**Items**
- A
- Tool
- B
- C
**Combinations**
- A + Tool -> B
- A + B @ H -> C
`);
  const attempt=choose(missing,start(missing),1,{combine:'A',with:'H'});
  assert.match(result(attempt),/Cannot be combined/);assert(!attempt.state.tokens['name:C']);
  assert(availableTokens(attempt.state).every(t=>!t.hotspot));
});

test('joint placement goals can complete without leaving station occupancy between commands',()=>{
  const s=parseStory(`# Place
## Work
**Goals**
- Put both away
  - both: A @ H
  - and: B @ J
**Hotspots**
- H
- J
**Items**
- A
- B
`);
  const a=choose(s,start(s),1,{combine:'A',with:'H'});
  assert.equal(a.frame.phase,'complete');assert.match(result(a),/Placed: B at J/);
  assert(availableTokens(a.state).every(t=>!t.hotspot));assert.deepEqual(replay(s,a.state.actions),a.state);
});

test('name resolution uses full-word prefixes across objects and hotspots, and terminal completion is textual',()=>{
  const objects=detailedObjects(station,start().state);
  assert.equal(resolveName('Cold',objects).name,'Cold water');
  assert.throws(()=>resolveName('Col',objects),/No available/);
  assert.throws(()=>resolveName('Warm',objects),/Ambiguous.*Warm dough.*Warm hearth/);
  assert.equal(completeCommandLine('i',objects),'inspect ');
  assert.equal(completeCommandLine('c',objects),'combine ');
  assert.equal(completeCommandLine('combine W',objects),'combine W');
  assert.equal(completeCommandLine('combine Cold',objects),'combine "Cold water" with ');
  assert.equal(completeCommandLine('combine "Cold water" with Sa',objects),'combine "Cold water" with "Salt"');
  assert.equal(completeCommandLine('inspect Sta',objects),'inspect "Starter"');
  assert.deepEqual(parseCommand('c "Warm dough" with "Warm hearth"'),{combine:'Warm dough',with:'Warm hearth'});
  assert.deepEqual(parseCommand('inspect Cold water'),{inspect:'Cold water'});
  assert.deepEqual(parseCommand('combine "Thing with a name" with "A \\"quote\\""'),{combine:'Thing with a name',with:'A "quote"'});
  assert.deepEqual(parseCommand(''),{look:true});assert.throws(()=>parseCommand('combine A'),/Use inspect/);
});

function session():ChapterSession {
  const adventure=start();
  return {version:6,playStyle:'detailed',guidance:'',guidanceHash:digest(''),id:'fixture',story:'station',storyHash:'',runtimeHash:'',createdAt:'',chapter:1,playerRubric:rubric('player','detailed'),graderRubric:rubric('grader','detailed'),initial:adventure.frame,adventure,turns:[],pendingLook:false,requests:[]};
}
function reply(s:ChapterSession,choice:DetailedChoice) {
  return {...(s.turns.length ? {effect:'Fixture observation.',reaction:'Nothing notable.'} : {}),step:s.adventure.frame.step,choice,reason:'Fixture decision.',expectation:'Fixture expectation.',alternatives:[]};
}

test('detailed sessions count inspections and failed attempts, exclude errors and looks, and verify public and engine replay',()=>{
  const s=session(),before=JSON.stringify(s);
  for (const choice of [{inspect:'Warm'},{inspect:'Missing'},{combine:'Cold',with:'Warm'}]) {
    assert.throws(()=>submitReply(s,station,reply(s,choice)),/Ambiguous|No available/);assert.equal(JSON.stringify(s),before);
  }
  submitReply(s,station,reply(s,{inspect:'Warm dough'}));
  const looked=submitReply(s,station,{step:2,choice:{look:true}});assert.deepEqual(looked,{step:2,choice:{look:true}});
  assert.equal(s.turns.length,1);assert(playerRequest(s).previousResult);
  submitReply(s,station,reply(s,{combine:'Warm dough',with:'Salt'}));
  submitReply(s,station,reply(s,{combine:'Warm hearth',with:'Warm dough'}));
  submitReply(s,station,reply(s,{combine:'Bread',with:'Cold'}));
  assert.equal(s.turns.length,4);assert.deepEqual(s.turns.map(t=>t.lookedAgain),[false,true,false,false]);
  assert(verifyChapterSession(s,station));assert.equal(graderPacket(s).verification.decisions,4);
  const grade={verdict:'Fixture',decisions:s.turns.map(t=>({step:t.reply.step,meaningful:false,reason:'Fixture'})),fun:{meaningful:0,total:4,ratio:0,explanation:'Fixture'},hook:{score:null,reason:'No report',steps:[]},strongest:{text:'Fixture',steps:[]},weakest:{text:'Fixture',steps:[]},limits:'Fixture'};
  assert.equal(validateGrade(grade,s).fun.total,4);
  const damaged=structuredClone(s);damaged.turns[0].result.messages[0].text='Invented hint';
  assert.throws(()=>verifyChapterSession(damaged,station),/does not match replay/);
});
