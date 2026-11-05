import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act} from '../src/engine/game.ts';
import {board,choose,choices,itemName,renderFrame,startAdventure} from '../src/playtest/adventure.ts';
import {playerRequest,reflectionDue,submitReply,verifyChapterSession} from '../src/playtest/chapter-session.ts';
import type {ChapterSession} from '../src/playtest/chapter-session.ts';
import {digest} from '../src/playtest/session.ts';
import {rubric} from '../src/playtest/rubrics.ts';
import {graderPacket,validateGrade} from '../src/playtest/grading.ts';
import {workshop} from './fixtures/adventure.ts';

const story = parseStory(workshop,{id:'workshop'});
function session():ChapterSession {
  const adventure = startAdventure(story,{mode:'chapter'});
  return {version:6,playStyle:'fast',guidance:'',guidanceHash:digest(''),id:'fixture',story:'workshop',storyHash:'',runtimeHash:'',createdAt:'',chapter:1,playerRubric:rubric('player'),graderRubric:rubric('grader'),initial:adventure.frame,adventure,turns:[],pendingLook:false,requests:[]};
}
function decision(s:ChapterSession) {
  return {...(reflectionDue(s) ? {effect:'No change.',reaction:'Nothing notable.'} : {}),step:s.adventure.frame.step,reason:'Synthetic protocol fixture.',choice:1,expectation:'A construction.',alternatives:[]};
}
function final(s:ChapterSession) {
  return {...(reflectionDue(s) ? {effect:'The case is stored.',reaction:'Nothing notable.'} : {}),step:s.adventure.frame.step,report:Object.fromEntries(['mostWorthwhile','leastWorthwhile','surprise','arbitrary','continue'].map(key => [key,{text:'Synthetic protocol fixture, not enjoyment evidence.',steps:s.turns.length ? [1] : []}]))};
}
function completed() {
  const s=session();
  while (s.adventure.frame.phase === 'choose') submitReply(s,story,decision(s));
  submitReply(s,story,final(s)); return s;
}
function grade(s:ChapterSession) {
  return {verdict:'Synthetic grader fixture.',decisions:s.turns.map(t => ({step:t.reply.step,meaningful:false,reason:'Routine fixture.'})),fun:{meaningful:0,total:s.turns.length,ratio:s.turns.length ? 0 : null,explanation:'No meaningful fixture decisions.'},hook:{score:s.final ? 'low' : null,reason:'No expressed interest.',steps:[]},strongest:{text:'No enjoyment claim.',steps:[]},weakest:{text:'No enjoyment claim.',steps:[]},limits:'A test fixture, not an independent judgment.'};
}

test('numbered adventure hides future results and notes, drains cards, and deduplicates equivalent drags',()=>{
  const a=startAdventure(story,{mode:'chapter'}), text=renderFrame(a.frame);
  assert.equal(a.state.pending.length,0);assert.equal(a.frame.options.length,1);
  assert.match(text,/Sheet \+ Tool/);assert.doesNotMatch(text,/private recipe|folded metal|Now address|Label|Case\[/);
  assert.equal(a.frame.messages.filter(m=>m.kind==='board').length,1);
  const made=choose(story,a,1,1), result=renderFrame(made.frame);
  assert.equal(made.state.pending.length,0);assert.match(result,/Created: Case\[\]/);
  assert.match(result,/Empty slots: closure/);
  assert(result.indexOf('Created:')<result.indexOf('folded metal'));
  assert(result.indexOf('folded metal')<result.indexOf('What combination will you make for step number 2?'));
  assert(!made.frame.messages.some(m=>m.kind==='board'));
  assert.match(result,/Case\[\] \+ Lid|Lid \+ Case\[\]/);
  const fitted=choose(story,made,2,1);
  assert.match(renderFrame(fitted.frame),/Fitted Lid into Case\[Lid\]/);
  assert.match(renderFrame(fitted.frame),/Goal completed: Close the case/);
  assert.match(renderFrame(fitted.frame),/New goal: Put it away/);
  assert.equal(itemName(story,fitted.state,'name:Case'),'Case[Lid]');
  const stored=choose(story,fitted,3,1);
  assert.match(renderFrame(stored.frame),/Case\[Lid\] is now at Shelf/);
  assert.equal(stored.frame.phase,'complete');assert.equal(stored.frame.options.length,0);
  assert(!renderFrame(stored.frame).includes('Now address'));
});

test('human adventure advances automatically, shows the new chapter and board, and reaches the ending',()=>{
  let a=startAdventure(story);
  for(let i=0;i<3;i++) a=choose(story,a,a.frame.step,1);
  const text=renderFrame(a.frame);
  assert(text.indexOf('All goals completed')<text.indexOf('Dispatch'));
  assert(text.indexOf('Now address')<text.indexOf('Items:'));
  assert.match(text,/Label/);assert.equal(a.frame.phase,'choose');
  a=choose(story,a,a.frame.step,1);
  assert.equal(a.frame.phase,'complete');assert.match(renderFrame(a.frame),/van disappears/);assert.match(renderFrame(a.frame),/Story completed/);
  assert.equal(a.state.pending.length,0);
});

test('checkpoint starts give humans and AI the same performed combinations and goal history',()=>{
  const human=startAdventure(story,{chapter:2}), text=renderFrame(human.frame);
  assert.match(text,/The parcel\nA small workshop adventure/);
  const expected=['delivery van is due','Goals:','Hotspots:','Items:','Step 1 combination: Sheet + Tool -> Case[]','folded metal','Step 2 combination: Lid + Case[] -> Case[Lid]','Goal completed: Close the case','New goal: Put it away','Step 3 preparation: Place Case[Lid] at Shelf','Goal completed: Put it away','All goals completed','Dispatch','Now address'];
  let previous=-1;for(const fragment of expected){const at=text.indexOf(fragment);assert(at>previous,fragment);previous=at;}
  const ai=startAdventure(story,{chapter:2,mode:'chapter'});
  assert.deepEqual(ai.frame,human.frame);
  assert.equal(human.frame.messages.find(m=>m.kind==='board')!.text,startAdventure(story).frame.messages.find(m=>m.kind==='board')!.text);
  assert(ai.state.actions.some(a=>a.type==='combine'));
  assert(!JSON.stringify(ai.frame).includes('actions'));
  assert(!('chapter' in ai.frame));assert.doesNotMatch(text,/private recipe/i);
  assert.match(text,/## Chapter 1\. Make a case/);assert.match(text,/## Chapter 2\. Dispatch/);
  const endingHistory=renderFrame(startAdventure(story,{chapter:3}).frame);
  assert.equal((endingHistory.match(/Step 1 combination:/g)||[]).length,2,'history step numbers restart in each chapter');
  assert.throws(()=>startAdventure(story,{chapter:0}),/Chapter must/);
});

test('L refreshes the board once per step and is hidden on each chapter’s first move',()=>{
  const initial=startAdventure(story), initialBoard=initial.frame.messages.find(m=>m.kind==='board')!.text;
  assert.deepEqual(initialBoard,board(story,initial.state));
  assert(initialBoard.indexOf('Goals:')<initialBoard.indexOf('Hotspots:'));
  assert(initialBoard.indexOf('Hotspots:')<initialBoard.indexOf('Items:'));
  assert.doesNotMatch(initialBoard,/primitive description|chapter \d/i);
  assert(!initial.frame.options.some(o=>o.kind==='look'));
  assert.throws(()=>choose(story,initial,1,'L'),/current menu/);
  const made=choose(story,initial,1,1), look=made.frame.options.at(-1)!;
  assert.equal(look.choice,'L');assert.equal(look.text,"[Look again at what's available]");
  const refreshed=choose(story,made,2,'L');
  assert.equal(refreshed.frame.step,2);assert.deepEqual(refreshed.state,made.state);
  assert.equal(refreshed.frame.messages[0].text,board(story,made.state));
  assert.doesNotMatch(refreshed.frame.messages[0].text,/folded metal|primitive description/);
  assert(!refreshed.frame.options.some(o=>o.kind==='look'));
  assert.throws(()=>choose(story,refreshed,2,'L'),/current menu/);
  const fitted=choose(story,refreshed,2,1);assert(fitted.frame.options.some(o=>o.choice==='L'));
  const next=choose(story,fitted,3,1);assert.equal(next.state.chapter,1);
  assert.equal(next.frame.step,1);
  assert(!next.frame.options.some(o=>o.kind==='look'),'a human’s next chapter starts without L');
  assert.match(renderFrame(made.frame),/\nL\. \[Look again at what's available\]/);
  assert.doesNotMatch(renderFrame(initial.frame),/Enter an option number|q to quit/);
  assert(!startAdventure(story,{chapter:2,mode:'chapter'}).frame.options.some(o=>o.kind==='look'));
});

test('boards omit empty hotspot sections in live play, refreshes and checkpoint history',()=>{
  const s=parseStory(`# No stations\n## First\n**Goals**\n- Build -- C\n- next: Finish -- D\n**Items**\n- A\n- B\n- C\n- D\n**Combinations**\n- A + B -> C\n- C + B -> D\n## Second\n**Goals**\n- Complete -- E\n**Items**\n- E\n**Combinations**\n- D + B -> E\n`);
  let a=startAdventure(s,{mode:'chapter'});
  assert.doesNotMatch(renderFrame(a.frame),/Hotspots:/);assert.match(renderFrame(a.frame),/Goals:[\s\S]*Items:/);
  a=choose(s,a,1,1);a=choose(s,a,2,'L');
  assert.doesNotMatch(renderFrame(a.frame),/Hotspots:/);assert.match(renderFrame(a.frame),/Goals:[\s\S]*Items:/);
  assert.doesNotMatch(renderFrame(startAdventure(s,{chapter:2}).frame),/Hotspots:/);
});

test('looks annotate the next actual response without creating action entries or consuming reflection',()=>{
  const s=session();
  const look=()=>submitReply(s,story,{step:s.adventure.frame.step,choice:'L'});
  const initial=JSON.stringify(s);assert.throws(look,/current menu/);assert.equal(JSON.stringify(s),initial);
  submitReply(s,story,decision(s));assert.equal(playerRequest(s).reflectionRequired,true);
  assert.equal(s.turns[0].lookedAgain,false);
  const actions=JSON.stringify(s.turns), engine=JSON.stringify(s.adventure.state);
  look();assert.equal(JSON.stringify(s.turns),actions);assert.equal(JSON.stringify(s.adventure.state),engine);
  assert.equal(s.pendingLook,true);assert.equal(s.adventure.frame.step,2);assert.equal(playerRequest(s).reflectionRequired,true);
  assert.equal(playerRequest(s).history.length,1);assert(verifyChapterSession(s,story));
  const before=JSON.stringify(s);assert.throws(look,/current menu/);assert.equal(JSON.stringify(s),before);
  const incomplete={...decision(s)};delete (incomplete as {effect?:string}).effect;
  assert.throws(()=>submitReply(s,story,incomplete),/exactly/);assert.equal(JSON.stringify(s),before);
  const response=decision(s), refreshed=structuredClone(s.adventure.frame);
  submitReply(s,story,response);
  assert.deepEqual(s.turns[1].reply,response,'the actual structured response is retained verbatim, not merged');
  assert.equal(s.turns[1].lookedAgain,true);assert.deepEqual(s.turns[1].lookView,refreshed);assert.equal(s.pendingLook,false);
  assert.deepEqual(playerRequest(s).history[1].lookView,refreshed);
  look();submitReply(s,story,decision(s));submitReply(s,story,final(s));assert(verifyChapterSession(s,story));
  assert.equal(s.turns.length,3);assert(s.turns.every(t=>typeof t.reply.choice==='number'));
  assert.deepEqual(s.turns.map(t=>t.lookedAgain),[false,true,true]);
  assert.equal(validateGrade(grade(s),s).fun.total,3);
  assert.equal(graderPacket(s).verification.looks,2);
  const damaged=structuredClone(s);damaged.turns[1].lookView!.messages[0].text='Invented board';
  assert.throws(()=>verifyChapterSession(damaged,story),/Look view.*does not match replay/);
  s.turns[1].lookedAgain=false;assert.throws(()=>verifyChapterSession(s,story),/Look metadata/);
});

test('an interrupted look remains pending and does not invent a structured gameplay response',()=>{
  const s=session();submitReply(s,story,decision(s));
  assert.throws(()=>submitReply(s,story,{...decision(s),choice:'L'}),/Look request must contain exactly/);
  submitReply(s,story,{step:2,choice:'L'});s.outcome='technical-interruption';
  const restored=JSON.parse(JSON.stringify(s)) as ChapterSession;
  assert(verifyChapterSession(restored,story));assert.equal(restored.turns.length,1);
  const packet=graderPacket(restored);assert.equal(packet.verification.decisions,1);assert.equal(packet.verification.looks,1);
  assert.equal(packet.unfinishedStep?.step,2);assert.equal(packet.unfinishedStep?.lookedAgain,true);
  assert.equal(packet.turns[0].lookedAgain,false);assert.equal(packet.final,null);
});

test('completed history places each queued wonder immediately after its own actual combination',()=>{
  const s=parseStory(`# History\n## Build\nStart here.\n**Goals**\n- Finish -- D\n**Items**\n- A\n- B\n- C\n\n  First wonder.\n\n- D\n\n  Second wonder.\n\n- Unmade alternative\n**Combinations**\n- A [preserve] + B [preserve] -> C\n- C [preserve] + B [preserve] -> D\n- C [preserve] + A [preserve] -> Unmade alternative\n## End\nDone.\n`);
  const text=renderFrame(startAdventure(s,{chapter:2,mode:'chapter'}).frame);
  const expected=['A + B -> C','First wonder.','C + B -> D','Second wonder.','Goal completed: Finish','All goals completed','End'];
  let previous=-1;for(const fragment of expected){const at=text.indexOf(fragment);assert(at>previous,fragment);previous=at;}
  assert.doesNotMatch(text,/Unmade alternative/);
  assert.equal((text.match(/First wonder/g)||[]).length,1);
});

test('creation feedback uses a colon, omits retirement notices and keeps wonders compact and indented',()=>{
  const s=parseStory(workshop.replace('The folded metal makes a rigid shell.','The folded metal makes a rigid shell.\n  A second line.\n\n  Another paragraph.'));
  const made=choose(s,startAdventure(s,{mode:'chapter'}),1,1), text=renderFrame(made.frame);
  assert.match(text,/Created: Case\[\]\. Empty slots: closure\.\n  The folded metal makes a rigid shell\. A second line\. Another paragraph\./);
  assert.equal(made.frame.messages.find(m=>m.kind==='wonder')!.text,'  The folded metal makes a rigid shell. A second line. Another paragraph.');
  assert.doesNotMatch(text,/no longer a separate available item|Sheet is|\nCase\[\]\n/);
  const past=renderFrame(startAdventure(s,{chapter:2,mode:'chapter'}).frame);
  assert.match(past,/Sheet \+ Tool -> Case\[\]\n  The folded metal makes a rigid shell\. A second line\. Another paragraph\./);
});

test('history preserves skip bridges once and does not turn receiving locations into contextual recipes',()=>{
  const s=parseStory(`# Past\n## First\nStart.\n**Goals**\n- Place it -- B @ H\n- next: Make it -- C @ H\n**Hotspots**\n- H\n**Items**\n- H\n- A\n- B\n- C\n**Combinations**\n- A [preserve] + B [consume] -> C\n## Skipped\nAn unplayed normal intro.\n\n[If skipped] We already prepared this.\n\n**Goals**\n- Already have it -- C\n## Next\nContinue here.\n**Goals**\n- Finish -- D\n**Items**\n- Tool\n- D\n**Combinations**\n- C [transform] + Tool [preserve] -> D\n## End\nDone.\n`);
  assert.equal(s.chapters[1].skipped,'We already prepared this.');
  for(const chapter of [3,4]) {
    const text=renderFrame(startAdventure(s,{chapter,mode:'chapter'}).frame);
    assert.match(text,/A \+ B -> C/);assert.doesNotMatch(text,/A \+ B @ H/);
    assert.doesNotMatch(text,/unplayed normal intro/);
    assert.equal((text.match(/We already prepared this/g)||[]).length,1);
    assert(text.indexOf('We already prepared this')<text.indexOf('Continue here'));
  }
});

test('the active board and menu exclude earlier rooms while preserving current hotspot recipes',()=>{
  const s=parseStory(`# Rooms\n## Old room\nbackground: ![room](old.webp)\n**Goals**\n- Make a piece -- C\n**Hotspots**\n- Old bench\n**Items**\n- Old bench\n- A\n- B\n- Spare\n- C\n- Unmade old result\n**Combinations**\n- A [preserve] + B [preserve] @ Old bench -> C\n- A [preserve] + Spare [preserve] -> Unmade old result\n## New room\nbackground: ![room](new.webp)\n**Goals**\n- Finish -- D\n**Hotspots**\n- New bench\n**Items**\n- New bench\n- Tool\n- D\n**Combinations**\n- C [transform] + Tool [preserve] @ New bench -> D\n## End\nDone.\n`);
  let a=startAdventure(s,{chapter:2,mode:'chapter'});
  const text=a.frame.messages.filter(m=>m.kind==='board').at(-1)!.text;
  assert.match(text,/Hotspots:\n- New bench/);assert.doesNotMatch(text,/Old bench|Spare|Unmade old result|\n- A\b|\n- B\b/);
  assert(a.state.tokens['name:A'].status==='available' && a.state.tokens['name:A'].chapter===0,'the old item still exists internally');
  assert(a.frame.options.every(o=>!o.text.includes('Old bench')&&!o.text.includes('Spare')));
  assert.equal(a.frame.step,1);assert(!a.frame.options.some(o=>o.choice==='L'));
  a=choose(s,a,1,a.frame.options[0].choice);
  const combine=a.frame.options.find(o=>o.text.includes(' + '))!;
  assert.match(combine.text,/@ New bench$/);
  a=choose(s,a,2,combine.choice);
  assert.equal(a.frame.phase,'complete');assert.equal(a.frame.messages[0].text,'Created: D.');
});

test('different receiving locations still offer just one authored pair, and compound fitting is one action',()=>{
  const a=startAdventure(story,{mode:'chapter'});
  const moved=act(story,a.state,{type:'move',item:'name:Sheet',chapter:0,hotspot:'name:Shelf',x:0,y:0});
  const pairs=choices(story,moved).filter(a=>a.type==='combine');
  assert.equal(pairs.length,1);assert.equal(pairs[0].a,'name:Sheet');assert.equal(pairs[0].b,'name:Tool');
  const made=choose(story,a,1,1);
  assert.equal(choices(story,made.state).filter(a=>a.type==='combine').length,1);
});

test('one authored direction is offered even when reversal would inherit a different hotspot',()=>{
  const s=parseStory(`# Destination\n## Work\n**Goals**\n- First -- A @ H\n- next: Second -- B @ H\n- next: Finish -- C @ H\n**Hotspots**\n- H\n**Items**\n- H\n- A\n- B\n- C\n**Combinations**\n- A [consume] + B [preserve] -> C\n`);
  let a=startAdventure(s,{mode:'chapter'});
  for(const name of ['A','B']) {
    const option=a.frame.options.find(o=>o.text.startsWith(`Place ${name} at`))!;
    assert(option);a=choose(s,a,a.frame.step,option.choice);
  }
  assert(a.frame.options.some(o=>o.text.startsWith('A + B')));
  assert(a.frame.options.filter(o=>o.kind==='action' && o.text.includes('+')).every(o=>!o.text.includes('@')));
  assert.equal(a.frame.options.filter(o=>o.text.includes(' + ')).length,1);
  assert(!a.frame.options.some(o=>o.text.startsWith('B + A')));
  a=choose(s,a,a.frame.step,a.frame.options.find(o=>o.text.startsWith('A + B'))!.choice);
  const placement=a.frame.options.find(o=>o.text==='Place C at H')!;assert(placement);
  a=choose(s,a,a.frame.step,placement.choice);
  assert.equal(a.frame.phase,'complete');assert.equal(a.state.tokens['name:C'].hotspot,'name:H');
});

test('a contextual recipe uses the reverse direction when only that direction is legal',()=>{
  const s=parseStory(`# Context\n## Work\n**Goals**\n- Finish -- C\n**Hotspots**\n- H\n**Items**\n- H\n- A\n- B\n- C\n**Combinations**\n- A + B @ H -> C\n`);
  const initial=startAdventure(s,{mode:'chapter'});
  const state=act(s,initial.state,{type:'move',item:'name:A',chapter:0,hotspot:'name:H',x:0,y:0});
  const pairs=choices(s,state).filter(a=>a.type==='combine');
  assert.equal(pairs.length,1);assert.equal(pairs[0].a,'name:B');assert.equal(pairs[0].b,'name:A');
  assert(act(s,state,pairs[0]).tokens['name:C']);
});

test('clearing a hotspot restores an alternative hidden by its occupant',()=>{
  const s=parseStory(`# Either\n## Work\n**Goals**\n- Make either\n  - either: C\n  - or: D\n**Hotspots**\n- H\n**Items**\n- H\n- A\n- B\n- C\n- D\n**Combinations**\n- A [consume] @ H -> D\n- A [consume] + B [preserve] @ H -> C\n`);
  let a=startAdventure(s,{mode:'chapter'});
  const place=a.frame.options.find(o=>o.text.startsWith('Place B at'))!;assert(place);
  a=choose(s,a,a.frame.step,place.choice);
  assert(!a.frame.options.some(o=>o.text.startsWith('A @')));
  const clear=a.frame.options.find(o=>o.text.startsWith('Move B off'))!;assert(clear);
  a=choose(s,a,a.frame.step,clear.choice);
  const single=a.frame.options.find(o=>o.text.startsWith('A @'))!;assert(single);
  a=choose(s,a,a.frame.step,single.choice);assert.equal(a.frame.phase,'complete');assert(a.state.tokens['name:D']);
});

test('malformed, stale, out-of-menu and missing-reflection responses cannot mutate a trial',()=>{
  const s=session(), before=JSON.stringify(s), valid=decision(s);
  for(const reply of [{...valid,step:9},{...valid,choice:99},{...valid,reason:''},{...valid,action:{type:'dismiss'}},{...valid,alternatives:[{choice:1,reason:'Same option'}]}]) {
    assert.throws(()=>submitReply(s,story,reply));assert.equal(JSON.stringify(s),before);
  }
  submitReply(s,story,valid);const second=JSON.stringify(s);
  assert.throws(()=>submitReply(s,story,{...valid,step:2}),/effect, reaction/);assert.equal(JSON.stringify(s),second);
  submitReply(s,story,decision(s));submitReply(s,story,decision(s));
  const report=final(s);report.report.continue.steps=[999];const done=JSON.stringify(s);
  assert.throws(()=>submitReply(s,story,report),/existing gameplay steps/);assert.equal(JSON.stringify(s),done);
  submitReply(s,story,final(s));assert.equal(s.final?.reaction,'Nothing notable.');
  assert.equal(playerRequest(s).request,'closed');assert.throws(()=>submitReply(s,story,final(s)),/closed/);
  assert(verifyChapterSession(s,story));
  s.turns[0].result.messages[0].text='Invented result';assert.throws(()=>verifyChapterSession(s,story),/does not match replay/);
});

test('fun grading covers each actual choice, validates arithmetic and refs, and leaves missing reports unscored',()=>{
  const s=completed(), g=grade(s), validated=validateGrade(g,s);
  assert.equal(validated.fun.total,3);assert.equal(validated.fun.ratio,0);assert.equal(validated.hook.score,'low');
  assert.throws(()=>validateGrade({...g,decisions:[g.decisions[0],g.decisions[0],g.decisions[2]]},s),/exactly once/);
  assert.throws(()=>validateGrade({...g,fun:{...g.fun,ratio:1}},s),/counts and ratio/);
  assert.throws(()=>validateGrade({...g,fun:{...g.fun,ratio:-0.0001}},s),/counts and ratio/);
  assert.throws(()=>validateGrade({...g,strongest:{text:'Invented citation',steps:[99]}},s),/existing gameplay steps/);
  const missing={...s,final:undefined};assert.equal(validateGrade(grade(missing),missing).hook.score,null);
  assert.throws(()=>validateGrade(g,missing),/null without/);
  assert.equal(validateGrade(grade(session()),session()).fun.ratio,null);
  s.model='SECRET_MODEL';s.elapsedMs=123456;const packet=JSON.stringify(graderPacket(s));
  assert(!packet.includes('SECRET_MODEL'));assert(!packet.includes('123456'));assert(!packet.includes('storyHash'));
  assert(packet.includes('Nothing notable.'));
});

test('no-goal chapters and skipped chapters preserve engine prose without additional decisions',()=>{
  const story=parseStory(`# A pause\n## Quiet\nA quiet start.\n## Work\nMake something.\n**Goals**\n- Make -- C\n**Items**\n- A\n- B\n- C\n**Combinations**\n- A + B -> C\n## Already done\nThis intro is skipped.\n\n[If skipped] We already have what we need.\n\n**Goals**\n- Have -- C\n## End\nHome again.\n`);
  let a=startAdventure(story);assert.equal(a.state.chapter,1);assert.equal(a.frame.step,1);
  a=choose(story,a,1,1);const text=renderFrame(a.frame);
  assert.equal(a.frame.phase,'complete');assert.match(text,/Home again/);assert.doesNotMatch(text,/This intro is skipped/);
  assert.match(text,/We already have what we need/);
});
