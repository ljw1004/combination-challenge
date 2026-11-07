import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintCoordinateGeometry} from '../src/lint/coordinates.ts';
import {scenePoint, sceneSize} from '../src/web/board-geometry.ts';
import {recoverPreviewStory, restoreLiveState} from '../src/web/live-story.ts';
import {act, newGame} from '../src/engine/game.ts';
import {hotspotPresentation} from '../src/engine/presentation.ts';
import {hotspotCentre} from '../src/web/hotspot-view.ts';

const source = `# Pixels
## Room
background: ![room](room.png)
**Hotspots**
- H (center 512px, 384px)
  - hitbox: (center 512.5px, 384.25px) (size 200px, 100px)
  - place: Result (center 520px, 390px)
**Goals**
- Build -- Result
**Items**
- H
- A
  - icon: ![A](a.png) (center 1024px, 768px)
- Result
**Combinations**
- A [consume] @ H [transform] -> Result (tutorial)`;

test('obsolete anchors, percentage units and missing units fail in every coordinate context', () => {
  for (const suffix of ['(at 20%, 30%)','(at 20px, 30px)','(center 20%, 30%)','(center 20, 30px)']) {
    for (const [before, code] of [
      ['(center 512px, 384px)','coordinate-syntax'],
      ['(center 1024px, 768px)','icon-syntax'],
      ['(center 520px, 390px)','place-syntax'],
      ['(center 512.5px, 384.25px)','hitbox-syntax'],
    ]) {
      const story = parseStory(source.replace(before,suffix));
      assert(story.diagnostics.some(d => d.code === code), `${code}: ${suffix}`);
      assert.deepEqual(Object.keys(story.items).sort(), ['name:A','name:H','name:Result']);
    }
  }
  assert(parseStory(source.replace('(size 200px, 100px)','(size 20%, 30%)')).diagnostics.some(d => d.code === 'hitbox-syntax'));
});

test('background dimensions govern pixel bounds and conversion, including fractions and image edges', () => {
  const story = parseStory(source), measurements = [{chapter:0,width:1024,height:768}];
  assert.deepEqual(lintCoordinateGeometry(story,measurements),[]);
  assert.equal(recoverPreviewStory(story),story,'valid pixel coordinates must not be clamped to 0–1');
  const scene = sceneSize(measurements[0]);
  assert.deepEqual(scenePoint({x:1024,y:768},scene),{x:390,y:292.5});
  assert.deepEqual(hotspotCentre(story.hotspots['name:H'],0,undefined,scene),scenePoint({x:512.5,y:384.25},scene));
  for (const [before,after,code] of [
    ['center 512px','center 1024.01px','hotspot-position'],
    ['center 1024px, 768px','center 1024px, 768.01px','icon-position'],
    ['center 520px','center 1025px','place-position'],
    ['size 200px','size 1025px','hitbox-position'],
  ]) {
    const edited = parseStory(source.replace(before,after));
    assert.deepEqual(lintCoordinateGeometry(edited,[]),[],'unknown dimensions are not guessed');
    assert.deepEqual(lintCoordinateGeometry(edited,measurements).map(d => d.code),[code]);
  }
  assert(lintCoordinateGeometry(story,[{chapter:0,width:0,height:0}]).every(d => d.code === 'coordinate-geometry'));
});

test('initial position checks cover inherited backgrounds and supplies pulled forward by goals', () => {
  const story = parseStory(`# Pixels
## First
background: ![room](room.png)
**Goals**
- Make B -- B
**Items**
- Tool
**Combinations**
- A [consume] + Tool [preserve] -> B
## Later
**Items**
- A
  - icon: ![A](a.png) (center 650px, 200px)
- B`);
  const diagnostics = lintCoordinateGeometry(story,[{chapter:0,width:640,height:360},{chapter:1,width:640,height:360}]);
  assert.equal(diagnostics.length,2);
  assert(diagnostics.every(d => d.code === 'icon-position'));
  assert(diagnostics[0].message.includes('First'));
  assert(diagnostics[1].message.includes('Later'));
});

test('fixed replacements and edited snapshots preserve pixel centers and automatic anchors', () => {
  for (const authored of [true,false]) {
    const story = parseStory(source.replace('  - hitbox: (center 512.5px, 384.25px) (size 200px, 100px)\n','')
      .replace('**Goals**','- Result\n**Goals**').replace(authored ? 'UNUSED' : ' (center 512px, 384px)',''));
    let state = newGame(story);
    state = act(story,state,{type:'combine',a:'name:A',hotspot:'name:H'});
    const position = state.tokens['name:Result'].fixedPosition!;
    assert.deepEqual(position,authored ? {x:512,y:384} : {x:.19,y:.70,relativePosition:true});
    const restored = restoreLiveState(story,JSON.parse(JSON.stringify(state)))!;
    assert(restored);
    const surface = hotspotPresentation(story,restored,0,'name:Result');
    assert.deepEqual(hotspotCentre(surface,1,undefined,sceneSize({width:1024,height:768})),authored ? {x:195,y:146.25} : {x:74.1,y:204.75});
  }
});
