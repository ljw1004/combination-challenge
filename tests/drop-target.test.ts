import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {newGame, act} from '../src/engine/game.ts';
import {createDropResolver, type DropTarget} from '../src/web/drop-target.ts';

const story = parseStory(`# Drops
## Work
background: ![room](room.svg)
**Goals**
- Make X -- X
**Hotspots**
- Bench
- Oven
**Items**
- Bench
- Oven
- A
- B
- C
- Unrelated
- X
- Y
- Z
**Combinations**
- A [preserve] + B [preserve] -> X
- A [preserve] + C [preserve] -> Y
- A [preserve] @ Oven -> Z
`);
const box = (x:number,y:number,width=50,height=50)=>({x,y,width,height});
const item = (name:string,x:number,y:number,zIndex:number):DropTarget<string> => ({value:name,item:`name:${name}`,chapter:0,region:box(x,y),zIndex});
const station = (name:string,x:number,y:number):DropTarget<string> => ({value:name,hotspot:`name:${name}`,chapter:0,region:box(x,y),zIndex:1});
const resolve = ()=>createDropResolver(story,newGame(story),'name:A');

test('only the cursor-to-centre rectangle targets a partner, even over an incompatible card',()=>{
  const choose=resolve(),point={x:90,y:110},dragged=box(80,100,100);
  assert.equal(choose(point,dragged,[item('B',120,100,3)]).action?.b,'name:B');
  assert.equal(choose(point,dragged,[item('B',120,100,3),item('Unrelated',80,100,8)]).action?.b,'name:B');
  assert.equal(choose(point,box(80,100),[item('B',120,100,3)]).action,undefined, 'the outer edge of A alone is insufficient');
  assert.equal(choose({x:60,y:110},box(60,100,60),[item('B',120,100,3)]).action,undefined);
});
test('the rectangle between cursor and centre counts even when neither endpoint hits, in every direction',()=>{
  const choose=resolve(),target={...item('B',100,130,3),region:box(100,130,10,10)};
  for(const point of [{x:90,y:90},{x:150,y:90},{x:90,y:150},{x:150,y:150}]){
    const centre={x:240-point.x,y:240-point.y};
    assert.equal(choose(point,box(centre.x-70,centre.y-70,140,140),[target]).action?.b,'name:B');
  }
});
test('collapsed horizontal, vertical and point regions include contact with rectangular and circular targets',()=>{
  const choose=resolve();
  for(const circular of [false,true]){
    const target=station('Oven',100,100);target.region.circular=circular;
    const accepts=(point:{x:number;y:number},rectangle:ReturnType<typeof box>)=>choose(point,rectangle,[target]).action?.hotspot;
    assert.equal(accepts({x:90,y:125},box(60,25,200,200)),'name:Oven'); // Horizontal, both ends outside.
    assert.equal(accepts({x:125,y:90},box(25,60,200,200)),'name:Oven'); // Vertical, both ends outside.
    assert.equal(accepts({x:125,y:125},box(75,75,100,100)),'name:Oven'); // Centre pickup.
    assert.equal(accepts({x:100,y:125},box(50,75,100,100)),'name:Oven'); // Point on the boundary.
    assert.equal(accepts({x:99,y:125},box(49,75,100,100)),undefined);
    assert.equal(accepts({x:90,y:100},box(60,0,200,200)),'name:Oven'); // Tangent horizontal line.
    assert.equal(accepts({x:90,y:99},box(60,-1,200,200)),undefined);
    assert.equal(accepts({x:100,y:90},box(0,60,200,200)),'name:Oven'); // Tangent vertical line.
    assert.equal(accepts({x:99,y:90},box(-1,60,200,200)),undefined);
  }
});
test('cursor containment outranks stacking; stacking resolves both kinds of overlap',()=>{
  const choose=resolve(),targets=[item('B',100,100,3),item('C',140,100,8)];
  assert.equal(choose({x:110,y:110},box(100,100,100),targets).action?.b,'name:B');
  assert.equal(choose({x:145,y:110},box(100,100,100),targets).action?.b,'name:C');
  assert.equal(choose({x:90,y:110},box(80,100,140),targets).action?.b,'name:C');
  assert.equal(choose({x:90,y:110},box(80,100,140),[...targets,item('A',80,100,99)]).action?.b,'name:C');
});
test('fixed stations participate; ordinary parking cannot mask a useful combination',()=>{
  const choose=resolve(),point={x:90,y:110},dragged=box(80,100,100);
  assert.equal(choose(point,dragged,[station('Oven',120,100)]).action?.hotspot,'name:Oven');
  assert.equal(choose(point,dragged,[station('Bench',80,100),item('B',120,100,3)]).action?.b,'name:B');
  assert.equal(choose(point,dragged,[station('Bench',120,100)]).target,'Bench');
});
test('circular station corners do not count, but overlap with the circle does',()=>{
  const choose=resolve(),target=station('Oven',100,100);target.region.circular=true;
  assert.equal(choose({x:101,y:101},box(95,95,8,8),[target]).target,undefined);
  assert.equal(choose({x:90,y:120},box(90,115,15,15),[target]).target,undefined, 'only the full tile overlaps the circle');
  assert.equal(choose({x:90,y:120},box(90,115,40,30),[target]).action?.hotspot,'name:Oven');
});
test('useful preparatory placements compete with combinations using the same cursor priority',()=>{
  const contextual=parseStory(`# Preparation
## Work
background: ![room](room.svg)
**Goals**
- Make X -- X
**Hotspots**
- Bench
**Items**
- Bench
- A
- B
- C
- X
- Y
**Combinations**
- A [preserve] + B [preserve] @ Bench -> X
- A [preserve] + C [preserve] -> Y`);
  const choose=createDropResolver(contextual,newGame(contextual),'name:A');
  const result=choose({x:90,y:110},box(80,100,100),[station('Bench',80,100),item('C',120,100,5)]);
  assert.equal(result.target,'Bench');assert.equal(result.usefulPlacement,true);assert.equal(result.action,undefined);
});
test('an ambiguous station requires a geometrically targeted occupant and uses its receiving surface',()=>{
  const contextual=parseStory(`# Context
## Work
background: ![room](room.svg)
**Goals**
- Make X -- X
**Hotspots**
- Bench
**Items**
- Bench
- A
- B
- C
- X
- Y
**Combinations**
- A [preserve] + B [preserve] @ Bench -> X
- A [preserve] + C [preserve] @ Bench -> Y`);
  let state=newGame(contextual);
  for(const name of ['B','C'])state=act(contextual,state,{type:'move',item:`name:${name}`,chapter:0,x:200,y:200,hotspot:'name:Bench'});
  const choose=createDropResolver(contextual,state,'name:A'),point={x:90,y:110},dragged=box(80,100,100),bench=station('Bench',80,100);
  assert.deepEqual(choose(point,dragged,[bench]).ambiguous.sort(),['name:B','name:C']);
  assert.equal(choose(point,dragged,[bench,item('B',120,100,3)]).action?.b,'name:B');
  assert.equal(choose(point,dragged,[{...bench,chapter:1}]).action,undefined);
});
