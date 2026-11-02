import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arrivalLayout,coveredFraction,type ArrivalTile,type ArrivalOptions} from '../src/web/arrival-layout.ts';
import {containsPoint,hotspotRect,overlapsHotspot} from '../src/web/hotspot-view.ts';
import {parseStory} from '../src/story/parser.ts';
import {lintPlacementGeometry} from '../src/lint/placement.ts';

const options:ArrivalOptions={bounds:{x:0,y:0,width:390,height:844},goalsTop:790,previousChapter:3,hotspots:[]};
const tile=(id:string,x:number,y:number,extra:Partial<ArrivalTile>={}):ArrivalTile=>({id,x,y,width:56,height:56,fresh:false,fromChapter:3,...extra});
function layout(tiles:ArrivalTile[],config:Partial<ArrivalOptions>={}){
  const settings={...options,...config},result=arrivalLayout(tiles,settings);
  const placed=tiles.map(t=>({...t,...result.positions.get(t.id)!}));
  for(const t of placed){
    if(t.fixed||t.fresh&&t.start)continue;
    assert(settings.hotspots.every(h=>!overlapsHotspot(t,h)),`${t.id} covers a hotspot`);
    assert(t.x>=settings.bounds.x&&t.y>=settings.bounds.y);
    assert(t.x+t.width<=settings.bounds.x+settings.bounds.width+1e-6);
    assert(t.y+t.height<settings.goalsTop,`${t.id} covers goals`);
    if(!result.crowded)assert(coveredFraction(t,placed.filter(p=>p.id!==t.id))<=.100001,`${t.id} exceeds its overlap allowance`);
  }
  return {result,placed};
}

test('mixed chapter positions are reconciled even with no new supplies; the latest arrangement wins',()=>{
  const recent=tile('recent',160,200),old=tile('old',160,200,{fromChapter:1});
  const {result}=layout([old,recent]);
  assert.deepEqual(result.positions.get('recent'),{x:160,y:200});
  assert.notDeepEqual(result.positions.get('old'),result.positions.get('recent'));
  assert.deepEqual(result,arrivalLayout([old,recent],options),'deterministic arrival');
});

test('new supplies have reserved room above goals; recent items move minimally and old rectangles stay in the top two-thirds',()=>{
  const tiles=[tile('recent',40,640),tile('old',220,660,{fromChapter:1}),tile('new',0,0,{fresh:true,width:120,height:100})];
  const {result,placed}=layout(tiles);
  const old=placed.find(t=>t.id==='old')!,fresh=placed.find(t=>t.fresh)!;
  assert(old.y+old.height<=844*2/3);
  assert(fresh.y>=Math.max(...placed.filter(t=>!t.fresh).map(t=>t.y+t.height))+28-1e-6);
  assert(fresh.y+fresh.height<=options.goalsTop-28);
  assert(result.positions.get('recent')!.y<640);
  assert.equal(result.crowded,false);
});

test('the final supply lift stops at a hotspot instead of crossing into it',()=>{
  const {placed}=layout([tile('recent',30,40),tile('fresh',0,0,{fresh:true,width:180,height:110})],{hotspots:[{x:0,y:130,width:390,height:180}]});
  assert(placed[1].y>=310);
});

test('explicit primitive starts and inherited hotspot occupants are fixed obstacles',()=>{
  const anchored=tile('authored',0,0,{fresh:true,start:{x:.5,y:.2}}),fixed=tile('occupant',180,280,{fixed:true});
  const {result}=layout([anchored,fixed,tile('other',180,280)],{hotspots:[{x:120,y:100,width:180,height:250}]});
  assert.deepEqual(result.positions.get('authored'),{x:195-28,y:844*.2-28});
  assert.deepEqual(result.positions.get('occupant'),{x:180,y:280});
  assert.notDeepEqual(result.positions.get('other'),{x:180,y:280});
});

test('short and cropped viewports use actual text-card dimensions and goals clearance',()=>{
  const tiles=[tile('long card',100,510,{width:112,height:130}),tile('old',130,520,{fromChapter:0,height:95}),tile('new',0,0,{fresh:true,width:112,height:95})];
  layout(tiles,{bounds:{x:45,y:0,width:300,height:590},goalsTop:525,hotspots:[{x:90,y:15,width:100,height:90}]});
});

test('overlap budgets use the union and protect smaller neighbours',()=>{
  const a={x:0,y:0,width:100,height:100};
  assert.equal(coveredFraction(a,[{x:0,y:0,width:10,height:100},{x:90,y:0,width:10,height:100}]),.2);
  assert.equal(coveredFraction(a,[{x:0,y:0,width:10,height:100},{x:0,y:0,width:10,height:100}]),.1);
  const {placed}=layout([tile('small',120,140,{width:20,height:20}),tile('large',120,140,{width:150,height:150})]);
  for(const p of placed)assert(coveredFraction(p,placed.filter(t=>t!==p))<=.100001);
});

test('crowding can relax item overlap without ever relaxing hotspot clearance',()=>{
  for(const checkpoint of [false,true]){
    const {result}=layout([tile('one',100,100,{width:180,height:100}),tile('two',100,100,{width:180,height:100})],{bounds:{x:0,y:0,width:240,height:240},goalsTop:230,hotspots:[{x:0,y:0,width:240,height:70}],checkpoint});
    assert(result.crowded);
  }
});

test('only an impossible station layout permits a hotspot overlap',()=>{
  const tiles=[tile('one',0,0),tile('new',0,0,{fresh:true})];
  const result=arrivalLayout(tiles,{...options,hotspots:[options.bounds]});
  assert(result.crowded);assert.equal(result.positions.size,2);
});

test('checkpoint preferences spread unmeasured carried objects while preserving inherited occupants',()=>{
  const tiles=[tile('a',0,0),tile('b',0,0),tile('occupant',180,200,{fixed:true})];
  const {result}=layout(tiles,{checkpoint:true});
  assert.notEqual(result.positions.get('a')!.x,result.positions.get('b')!.x);
  assert.deepEqual(result.positions.get('occupant'),{x:180,y:200});
});

test('checkpoint rows centre the whole inventory with breathing room, including first-chapter supplies',()=>{
  for(const bounds of [options.bounds,{x:45,y:0,width:300,height:590}]){
    for(const freshOnly of [false,true]){
      const tiles=Array.from({length:6},(_,i)=>tile(`${i}`,0,0,{width:70,height:i%2?60:90,fresh:freshOnly||i>=4}));
      const settings={bounds,goalsTop:bounds.height-54,checkpoint:true};
      const {result,placed}=layout(tiles,settings);
      const left=Math.min(...placed.map(t=>t.x)),right=Math.max(...placed.map(t=>t.x+t.width));
      const top=Math.min(...placed.map(t=>t.y)),bottom=Math.max(...placed.map(t=>t.y+t.height));
      assert.equal((left+right)/2,bounds.x+bounds.width/2);
      assert.equal((top+bottom)/2,bounds.y+bounds.height/2);
      for(const a of placed)for(const b of placed.filter(t=>t.id!==a.id)){
        assert(a.x+a.width+28<=b.x||b.x+b.width+28<=a.x||a.y+a.height+28<=b.y||b.y+b.height+28<=a.y,'roomy checkpoints keep a gap between items');
      }
      if(!freshOnly){
        assert(result.divider!==undefined);
        assert(Math.min(...placed.filter(t=>t.fresh).map(t=>t.y))>=Math.max(...placed.filter(t=>!t.fresh).map(t=>t.y+t.height))+28);
      }
      assert.deepEqual(result,arrivalLayout(tiles,{...options,...settings}));
    }
  }
});

test('checkpoint centring yields to hotspots and authored anchors before overlapping items',()=>{
  const tiles=[tile('a',0,0,{width:80,height:90}),tile('b',0,0,{width:100,height:70}),tile('c',0,0,{fresh:true}),
    tile('anchor',0,0,{fresh:true,start:{x:.5,y:.5}}),tile('occupant',210,170,{fixed:true})];
  const {result,placed}=layout(tiles,{checkpoint:true,hotspots:[{x:140,y:140,width:120,height:120,circular:true},{x:20,y:380,width:100,height:130}]});
  assert.deepEqual(result.positions.get('anchor'),{x:167,y:394});
  assert.deepEqual(result.positions.get('occupant'),{x:210,y:170});
  assert.equal(result.crowded,false);
  for(const t of placed)assert.equal(coveredFraction(t,placed.filter(p=>p!==t)),0);
});

test('an item wider than the comfort inset still respects reserved supplies',()=>{
  const {placed}=layout([tile('wide',0,100,{width:380}),tile('new',0,0,{fresh:true})]);
  assert.equal(coveredFraction(placed[0],[placed[1]]),0);
});

test('circular hotspots use the inscribed circle, minimum touch diameter, and exact rectangle clearance',()=>{
  const story=parseStory('# Circle\n## Work\n![room](room.svg)\n**Hotspots**\n- H (at 50%, 50%)\n  - icon: ![round](round.svg) (circular)\n  - place: A (at 60%, 55%)\n**Items**\n- A');
  const h=story.hotspots['name:H'],circle=hotspotRect(h,0,{width:140,height:100});
  assert.equal(circle.width,100);
  assert(containsPoint(circle,{x:245,y:422}));
  assert(!containsPoint(circle,{x:240,y:467}));
  assert(!overlapsHotspot({x:circle.x,y:circle.y,width:10,height:10},circle));
  assert(overlapsHotspot({x:190,y:417,width:10,height:10},circle));
  assert.equal(hotspotRect(h,0,{width:10,height:20},2).width,22);
  assert.equal(hotspotRect(h,0,{width:140,height:100,circular:false}).circular,undefined,'failed artwork uses the rendered text rectangle');
  assert.equal(lintPlacementGeometry(story,[{id:h.id,chapter:0,width:100,height:100}]).length,1);
  const corner=tile('corner',circle.x,circle.y,{width:10,height:10});
  assert.deepEqual(layout([corner],{hotspots:[circle]}).result.positions.get('corner'),{x:corner.x,y:corner.y});
});
