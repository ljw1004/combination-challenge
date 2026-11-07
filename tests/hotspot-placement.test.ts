import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintPlacementGeometry} from '../src/lint/placement.ts';
import {act, newGame, replay} from '../src/engine/game.ts';
import {hotspotDrop} from '../src/engine/hotspot-drop.ts';
import {placeAtCentre} from '../src/web/board-geometry.ts';

const source = `# ![icon](https://example.com/icon.png) Placement
## Work
background: ![room](room.svg)
**Goals**
- Make C -- C @ H
**Hotspots**
- H (center 195px, 422px)
  - place: A (center 175.5px, 422px)
  - place: C (center 214.5px, 422px)
**Items**
- H
- A
- B
**Combinations**
- C
- A [transform] + B [consume] @ H -> C (tutorial)`;
const errors = (text: string) => lintStory(parseStory(text), {analysis:false,backgroundMeasurements:[{chapter:0,width:390,height:844}]}).filter(d => d.severity === 'error');

test('place references resolve forwards without supplying items or defining misspelled identities', () => {
  const story = parseStory(source);
  assert.equal(errors(source).length, 0);
  assert.deepEqual(story.hotspots['name:H'].placements?.map(p => p.item.id), ['name:A', 'name:C']);
  assert.deepEqual(story.chapters[0].items.map(r => r.id), ['name:H', 'name:A', 'name:B']);
  const typo = source.replace('place: C', 'place: Typo');
  assert(!parseStory(typo).items['name:Typo']);
  assert.deepEqual(errors(typo).map(d => d.code), ['undeclared-item']);
  assert.deepEqual(errors(typo.replace('place: A', 'place: Typo')).map(d => d.code).filter(c => c === 'undeclared-item'), ['undeclared-item','undeclared-item']);
  const identified = source.replace('place: A', 'place: `a`').replace('- A\n', '- `a` A\n').replace('- A [transform]', '- `a` [transform]');
  assert.equal(errors(identified).length, 0);
});

test('placement syntax, conflicts and coordinates have source-located errors without relocating hotspot references', () => {
  for (const [before, after, code] of [
    ['place: C (center 214.5px, 422px)', 'place: C (center 393.9px, 422px)', 'place-position'],
    ['place: C (center 214.5px, 422px)', 'place: C (at fifty%, 50%)', 'place-syntax'],
    ['place: C (center 214.5px, 422px)', 'place: A (center 214.5px, 422px)', 'conflicting-place'],
    ['- Make C -- C @ H', '- Make C -- C @ H (center 351px, 759.6px)', 'coordinate-context'],
  ]) {
    const text = source.replace(before, after).replaceAll('\n','\r\n');
    const diagnostic = errors(text).find(d => d.code === code);
    assert(diagnostic, code); assert(text.slice(diagnostic.span.from, diagnostic.span.to).length > 0);
  }
  const misplaced = source.replace('- A\n', '- A\n  - place: B (center 195px, 422px)\n');
  assert(errors(misplaced).some(d => d.code === 'place-context'));
  const parsed = parseStory(source + '\n- B [preserve] @ H (center 351px, 759.6px) -> D');
  assert.equal(parsed.hotspots['name:H'].x, 195); assert.equal(parsed.hotspots['name:H'].y, 422);
});

test('geometry lint accepts the centre on a boundary and rejects an outside centre, including transparent hit areas', () => {
  const story = parseStory(source.replace('175.5px', '156px').replace('214.5px', '234px'));
  const measurements = [{id:'name:H', chapter:0, width:78, height:80}];
  assert.deepEqual(lintPlacementGeometry(story, measurements), []);
  const invalid = parseStory(source.replace('214.5px', '234.039px'));
  const diagnostics = lintPlacementGeometry(invalid, measurements);
  assert.equal(diagnostics.length,1); assert.equal(diagnostics[0].code,'place-outside-hotspot');
  assert.equal(diagnostics[0].source.line,9);
});

test('a bare hotspot resolves its unique occupant, prefers it to a unary operation, and rejects ambiguous choices', () => {
  const story = parseStory(source + '\n- B [preserve] @ H -> D\n- E [preserve] + B [preserve] @ H -> F\n**Items**\n- E');
  let state = newGame(story);
  assert.equal(hotspotDrop(story,state,'name:B','name:H',0).action?.b,undefined);
  state = act(story,state,{type:'move',item:'name:A',chapter:0,x:120,y:400,hotspot:'name:H'});
  const drop = hotspotDrop(story,state,'name:B','name:H',0);
  assert.equal(drop.action?.b,'name:A');
  assert.equal(act(story,state,drop.action!).tokens['name:C'].hotspot,'name:H');
  state = act(story,state,{type:'move',item:'name:E',chapter:0,x:240,y:400,hotspot:'name:H'});
  const ambiguous = hotspotDrop(story,state,'name:B','name:H',0);
  assert.equal(ambiguous.action,undefined); assert.deepEqual(new Set(ambiguous.ambiguous),new Set(['name:A','name:E']));
});

test('repeated hotspot surfaces only accept occupants on the selected chapter panel', () => {
  const story = parseStory(source.replace('- Make C -- C @ H','- Place A -- A @ H') + '\n## Later\n**Goals**\n- Make C -- C');
  let state = act(story,newGame(story),{type:'move',item:'name:A',chapter:0,x:100,y:400,hotspot:'name:H'});
  state = act(story,state,{type:'advance'});
  assert.equal(state.tokens['name:A'].chapter,1);
  assert.equal(hotspotDrop(story,state,'name:B','name:H',0).action,undefined);
  assert(hotspotDrop(story,state,'name:B','name:H',1).action);
  assert.throws(() => act(story,state,{type:'combine',a:'name:B',b:'name:A',hotspot:'name:H',chapter:0}));
});

test('result snapping records hotspot membership and exact replay even when the receiver survives', () => {
  const story = parseStory(source.replace('A [transform]','A [preserve]'));
  let state = act(story,newGame(story),{type:'move',item:'name:A',chapter:0,x:120,y:400,hotspot:'name:H'});
  state = act(story,state,{type:'combine',a:'name:B',b:'name:A',hotspot:'name:H',resultPlacement:{x:200,y:410}});
  assert.equal(state.tokens['name:A'].status,'available');
  assert.equal(state.tokens['name:C'].hotspot,'name:H');
  assert.equal(state.tokens['name:C'].x,200);
  assert(state.achieved.includes(story.chapters[0].goals[0].id));
  assert.deepEqual(replay(story,state.actions),state);
});

test('an authored centre uses measured rectangles, falls back for occupied or off-board destinations, and allows touching edges', () => {
  const centre = {x:200,y:400}, size = {width:60,height:80};
  assert.deepEqual(placeAtCentre(centre,size,[]),{x:170,y:360});
  assert.equal(placeAtCentre(centre,size,[{x:220,y:400,width:60,height:80}]),undefined);
  assert.deepEqual(placeAtCentre(centre,size,[{x:230,y:400,width:60,height:80}]),{x:170,y:360});
  assert.equal(placeAtCentre({x:10,y:400},size,[]),undefined);
});
