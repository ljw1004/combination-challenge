import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {act, newGame, legalActions} from '../src/engine/game.ts';
import {fixedCentre, presentHotspots} from '../src/engine/fixed-items.ts';
import {chapterNeeds} from '../src/engine/analysis.ts';
import {observe} from '../src/playtest/observe.ts';
import {detailedObjects} from '../src/playtest/detailed.ts';
import {startAdventure, renderFrame, choices} from '../src/playtest/adventure.ts';

const parse = (text:string) => parseStory(`# ![icon](https://example.com/icon.png) Fixed items\n## Opening\nbackground: ![scene](scene.png)\n${text}`);
const errors = (text:string) => lintStory(parse(text),{analysis:false}).filter(d=>d.severity==='error');
const advance = (story:ReturnType<typeof parse>, state:ReturnType<typeof newGame>) => {
  while(state.pending.length) state=act(story,state,{type:'dismiss'});
  return act(story,state,{type:'advance'});
};

test('a hotspot annotation requires a separate item declaration',()=>{
  const text='**Items**\n- A\n- C\n**Hotspots**\n- H\n**Goals**\n- Finish -- C\n**Combinations**\n- A [preserve] @ H -> C (tutorial)';
  assert(errors(text).some(d=>d.code==='undeclared-item'&&d.message.startsWith('H ')));
  assert(!errors(text.replace('- A\n','- A\n- H\n')).some(d=>d.code==='undeclared-item'||d.code==='namespace-clash'));
});

test('global @ recipes wait for a chapter that fixes the same movable item',()=>{
  const story=parse('**Items**\n- A\n- H\n- X\n- Y\n- Ready\n- C\n**Goals**\n- Prepare -- Ready\n**Combinations**\n- X [consume] + Y [consume] -> Ready (tutorial)\n- A [consume] @ H -> C\n## Installed\nbackground: ![scene](scene.png)\n**Hotspots**\n- H\n**Goals**\n- Finish -- C');
  let state=newGame(story);
  assert.equal(state.tokens['name:H'].chapter,0);
  assert(!legalActions(story,state).some(a=>a.hotspot==='name:H'));
  state=act(story,state,{type:'combine',a:'name:X',b:'name:Y'});
  state=advance(story,state);
  assert.deepEqual(presentHotspots(story,state,1),['name:H']);
  assert.throws(()=>act(story,state,{type:'move',item:'name:H',chapter:0,x:1,y:1}),/fixed/);
  state=act(story,state,{type:'combine',a:'name:A',hotspot:'name:H',chapter:1});
  assert.equal(state.tokens['name:C'].status,'available');
});

test('derived fixed items only become targets after construction',()=>{
  const story=parse('**Items**\n- A\n- X\n- Y\n- H\n- C\n**Hotspots**\n- H (center 117px, 337.6px)\n**Goals**\n- Finish -- C\n**Combinations**\n- X [consume] + Y [consume] -> H (tutorial)\n- A [consume] @ H -> C');
  let state=newGame(story);
  assert.equal(state.tokens['name:H'],undefined);
  assert.deepEqual(presentHotspots(story,state,0),[]);
  assert(!observe(story,state).hotspots.length);
  state=act(story,state,{type:'combine',a:'name:X',b:'name:Y'});
  assert.deepEqual(presentHotspots(story,state,0),['name:H']);
  assert.deepEqual(fixedCentre(story,state.tokens['name:H']),{x:117,y:337.6});
  assert(!legalActions(story,state).some(a=>a.a==='name:H'));
  assert(!observe(story,state).items.some(item=>item.id==='name:H'));
  assert(observe(story,state).hotspots.some(item=>item.id==='name:H'));
  assert.equal(detailedObjects(story,state).find(item=>item.id==='name:H')?.kind,'hotspot');
  state=act(story,state,{type:'combine',a:'name:A',hotspot:'name:H'});
  assert.equal(state.tokens['name:C'].status,'available');
});

test('later goals cannot rely on optional earlier work with a fixed item',()=>{
  const text='**Items**\n- X\n- Y\n- Ready\n- H\n- A\n- C\n**Hotspots**\n- H\n**Goals**\n- Prepare -- Ready\n**Combinations**\n- X [consume] + Y [consume] -> Ready (tutorial)\n- A [preserve] @ H -> C\n## Later\nbackground: ![scene](scene.png)\n**Goals**\n- Finish -- C';
  assert(lintStory(parse(text)).some(d=>d.code==='fixed-carry'));
  const required=text.replace('- Prepare -- Ready','- Prepare -- Ready\n- Prepare C -- C');
  assert(!lintStory(parse(required)).some(d=>d.severity==='error'));
  const relisted=text.replace('## Later\nbackground: ![scene](scene.png)','## Later\nbackground: ![scene](scene.png)\n**Hotspots**\n- H');
  assert(!lintStory(parse(relisted)).some(d=>d.severity==='error'));
});

test('a contextual combination can consume and replace its fixed context',()=>{
  const story=parse('**Items**\n- A\n- B\n- H\n- Repaired H\n**Hotspots**\n- H (center 78px, 590.8px)\n- Repaired H\n**Goals**\n- Finish -- Repaired H\n**Combinations**\n- A [consume] + B [consume] @ H [consume] -> Repaired H');
  let state=newGame(story);
  state=act(story,state,{type:'move',item:'name:B',chapter:0,x:10,y:20,hotspot:'name:H'});
  state=act(story,state,{type:'combine',a:'name:A',b:'name:B',hotspot:'name:H'});
  assert.equal(state.tokens['name:H'].status,'consume');
  assert.deepEqual(fixedCentre(story,state.tokens['name:Repaired H']),{x:78,y:590.8});
  assert.deepEqual(presentHotspots(story,state,0),['name:Repaired H']);
});

test('retiring a fixed receiver replaces it in place and releases parked occupants',()=>{
  const story=parse('**Items**\n- Patch\n- Tent\n- Repaired tent\n- Camera\n**Hotspots**\n- Tent (center 136.5px, 506.4px)\n- Repaired tent\n**Goals**\n- Put camera down -- Camera @ Tent\n- Repair -- Repaired tent\n**Combinations**\n- Patch [consume] @ Tent [consume] -> Repaired tent (tutorial)');
  let state=newGame(story);
  state=act(story,state,{type:'move',item:'name:Camera',chapter:0,x:80,y:90,hotspot:'name:Tent'});
  state=act(story,state,{type:'combine',a:'name:Patch',hotspot:'name:Tent'});
  assert.equal(state.tokens['name:Tent'].status,'consume');
  assert.deepEqual(presentHotspots(story,state,0),['name:Repaired tent']);
  assert.deepEqual(fixedCentre(story,state.tokens['name:Repaired tent']),{x:136.5,y:506.4});
  assert.equal(state.tokens['name:Camera'].hotspot,undefined);
  assert.equal(state.tokens['name:Camera'].x,80);
  assert(state.achieved.includes(story.chapters[0].goals[0].id));
});

test('fixed items are not inferred carry but an explicit later hotspot can present them again',()=>{
  const text='**Items**\n- X\n- Y\n- Ready\n- H\n- A\n- C\n**Hotspots**\n- H\n**Goals**\n- Prepare -- Ready\n**Combinations**\n- X [consume] + Y [consume] -> Ready (tutorial)\n- A [consume] + H [preserve] -> C\n- Seed [consume] @ J -> A\n## Later\nbackground: ![scene](scene.png)\n**Items**\n- Seed\n- J\n**Hotspots**\n- J\n**Goals**\n- Finish -- C';
  for(const revisit of [false,true]){
    const story=parse(revisit?text.replace('## Later\nbackground: ![scene](scene.png)','## Later\nbackground: ![scene](scene.png)\n**Hotspots**\n- H'):text);
    let state=newGame(story);
    assert.equal(chapterNeeds(story,state,1).has('name:H'),revisit);
    assert.equal(lintStory(story,{opportunities:false}).some(d=>d.code==='no-continuation'),!revisit);
    if(!revisit) continue;
    state=act(story,state,{type:'combine',a:'name:X',b:'name:Y'});
    state=advance(story,state);
    assert.equal(state.tokens['name:H'].chapter,revisit?1:0);
  }
});

test('conflicting ordinary recipes and mixed +/@ recipes are declaration errors',()=>{
  const base='**Items**\n- A\n- B\n- C\n- D\n**Hotspots**\n- B\n**Combinations**\n- A [preserve] + B [preserve] -> C (tutorial)\n';
  assert(errors(base+'- B [preserve] + A [preserve] -> D').some(d=>d.code==='conflicting-recipe'));
  assert(errors(base+'- A [preserve] @ B -> D').some(d=>d.code==='mixed-recipe-notation'));
  assert(errors(base+'- A [preserve] @ B -> C').some(d=>d.code==='mixed-recipe-notation'));
  assert(!errors(base+'- B [preserve] + A [preserve] -> C').some(d=>d.code==='conflicting-recipe'));
  const repeated=parse('**Items**\n- A\n- B\n- C\n**Goals**\n- Make -- C\n**Combinations**\n- A [consume] + B [preserve] -> C (tutorial)\n- B + A [consume] -> C');
  assert(!lintStory(repeated).some(d=>d.code==='no-recipe-opportunity'));
});

test('fast and detailed play expose fixed receivers and their fittings under Hotspots',()=>{
  const story=parse('**Items**\n- A\n- H (compound)\n  - slot: Fitting, accepts A\n**Hotspots**\n- H\n**Goals**\n- Fit -- H[A]');
  for(const playStyle of ['fast','detailed'] as const){
    const adventure=startAdventure(story,{mode:'chapter',playStyle});
    const frame=renderFrame(adventure.frame);
    assert.match(frame,/Hotspots:\n- H\[\]; empty slots: Fitting/);
    assert.match(frame,/Items:\n- A/);
    assert.equal(detailedObjects(story,adventure.state).find(item=>item.id==='name:H')?.kind,'hotspot');
    assert(choices(story,adventure.state).some(action=>action.type==='combine'&&action.a==='name:A'&&action.b==='name:H'));
  }
});

test('lint catches a fixed retirement that depends on the player choosing the right order',()=>{
  const story=parse('**Items**\n- Patch\n- Tent\n- Repaired tent\n- Camera\n- Photograph\n**Hotspots**\n- Tent\n- Repaired tent\n**Goals**\n- Repair -- Repaired tent\n- Photograph damage -- Photograph\n**Combinations**\n- Patch [consume] @ Tent [consume] -> Repaired tent (tutorial)\n- Camera [preserve] @ Tent -> Photograph');
  const diagnostics=lintStory(story,{opportunities:false});
  assert(diagnostics.some(d=>d.code==='fixed-retirement'&&d.message.includes('Tent')));
});

test('fixed retirement checks include later supplies dragged back to an earlier board',()=>{
  const story=parse('**Items**\n- X\n- Y\n- Ready\n- H\n- C\n**Hotspots**\n- H\n**Goals**\n- Prepare -- Ready\n**Combinations**\n- X [consume] + Y [consume] -> Ready (tutorial)\n- A [consume] @ H [consume] -> C\n## Repair\nbackground: ![scene](scene.png)\n**Items**\n- A\n**Goals**\n- Repair -- C\n## Revisit\nbackground: ![scene](scene.png)\n**Items**\n- T\n**Hotspots**\n- H\n**Goals**\n- Park -- T @ H');
  assert(lintStory(story,{opportunities:false}).some(d=>d.code==='fixed-retirement'));
});

test('a goal cannot require dragging one fixed item onto another',()=>{
  const story=parse('**Items**\n- X\n- Y\n- Ready\n- H\n- J\n**Hotspots**\n- H\n- J\n**Goals**\n- Move installation -- H @ J\n**Combinations**\n- X [preserve] + Y [preserve] -> Ready (tutorial)');
  assert(lintStory(story).some(d=>d.code==='no-continuation'));
});

test('repeated fixed annotations share an item and allow different chapter presentations',()=>{
  const story=parse('**Items**\n- H\n**Hotspots**\n- H (center 78px, 253.2px)\n- H (center 78px, 253.2px)\n## Revisit\nbackground: ![scene](scene.png)\n**Hotspots**\n- H (center 273px, 675.2px)');
  let state=newGame(story);
  assert.deepEqual(presentHotspots(story,state,0),['name:H']);
  assert.deepEqual(fixedCentre(story,state.tokens['name:H']),{x:78,y:253.2});
  state=advance(story,state);
  assert.deepEqual(fixedCentre(story,state.tokens['name:H']),{x:273,y:675.2});
  assert(!lintStory(story,{analysis:false}).some(d=>d.code==='conflicting-hotspot-position'));
  assert(errors('**Hotspots**\n- H (center 78px, 253.2px)\n- H (center 273px, 675.2px)').some(d=>d.code==='conflicting-hotspot-position'));
});

test('successive fixed states count as one simultaneous hotspot',()=>{
  const story=parse('**Items**\n- Tool\n- First\n- Second\n- Third\n- Fourth\n**Hotspots**\n- First\n- Second\n- Third\n- Fourth\n**Goals**\n- Finish -- Fourth\n**Combinations**\n- Tool @ First [transform] -> Second (tutorial)\n- Tool @ Second [transform] -> Third\n- Tool @ Third [transform] -> Fourth');
  assert.deepEqual(lintStory(story,{opportunities:false}).filter(d=>d.severity==='error'),[]);
});

test('recipe opportunity lint checks alternatives individually even when their shared result is reachable',()=>{
  const story=parse('**Items**\n- A\n- H\n- X\n- Y\n- C\n- D\n**Goals**\n- Make C -- C\n**Combinations**\n- X [preserve] + Y [preserve] -> C (tutorial)\n- A [preserve] @ H -> C\n- C [preserve] + X [preserve] -> D\n## Later\nbackground: ![scene](scene.png)\n**Hotspots**\n- H\n**Goals**\n- Finish -- D');
  const diagnostics=lintStory(story);
  assert(!diagnostics.some(d=>d.severity==='error'),JSON.stringify(diagnostics));
  assert(diagnostics.some(d=>d.code==='no-recipe-opportunity'&&d.source.line===story.recipes[1].source.line));
  assert(!diagnostics.some(d=>d.code==='no-item-opportunity'&&d.message.startsWith('C ')));
});
