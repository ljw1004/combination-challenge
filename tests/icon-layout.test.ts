import {test} from 'node:test';
import assert from 'node:assert/strict';
import {iconArrival,clearArrivalHotspots} from '../src/web/icon-layout.ts';

const tile=(id:string,x:number,y:number,fresh=false)=>({id,x,y,width:56,height:56,fresh});

test('chapter entry without new supplies preserves all placements, including moved authored icons',()=>{
  const tiles=[{...tile('fire',324,771),start:{x:.75,y:.36}},tile('air',189,31),tile('water',320,650)];
  const result=iconArrival(tiles);
  for(const item of tiles)assert.deepEqual(result.positions.get(item.id),{x:item.x,y:item.y});
  assert.equal(result.divider,undefined);assert.equal(result.crowded,false);
});

test('new supplies fit beneath carried icons without moving them when space is available',()=>{
  const carried=[tile('fire',324,350),tile('water',42,120)],fresh=tile('earth',0,0,true);
  const result=iconArrival([...carried,fresh]);
  for(const item of carried)assert.deepEqual(result.positions.get(item.id),{x:item.x,y:item.y});
  const bottom=Math.max(...carried.map(item=>item.y+item.height));
  assert(result.divider!>bottom);assert(result.positions.get('earth')!.y>result.divider!);
});

test('making room for arrivals shifts the carried group only as far as necessary',()=>{
  const carried=[tile('fire',324,650),tile('water',42,400)];
  const result=iconArrival([...carried,tile('earth',0,0,true)]);
  const shift=result.positions.get('fire')!.y-carried[0].y;
  assert(shift<0);
  for(const item of carried){assert.equal(result.positions.get(item.id)!.x,item.x);assert.equal(result.positions.get(item.id)!.y-item.y,shift);}
  assert.equal(result.positions.get('earth')!.y+56,745);
  assert.equal(result.crowded,false);
});

test('upper stations remain clear on arrival without moving other ingredients or shrinking artwork',()=>{
  const tiles=[{...tile('millstone',139,124),width:128,height:110},tile('apples',165,266),{...tile('press',14,394),width:136,height:168}];
  const hotspot={x:115,y:90,width:160,height:114};
  const result=clearArrivalHotspots(tiles,iconArrival(tiles),[hotspot],{x:0,y:0,width:390,height:667});
  const moved={...tiles[0],...result.positions.get('millstone')!};
  for(const r of [hotspot,...tiles.slice(1)])assert(moved.x+moved.width<=r.x||r.x+r.width<=moved.x||moved.y+moved.height<=r.y||r.y+r.height<=moved.y);
  for(const t of tiles.slice(1))assert.deepEqual(result.positions.get(t.id),{x:t.x,y:t.y});
  assert(moved.y+moved.height<=607);assert.equal(result.crowded,false);
});

test('station clearance respects authored primitive starts and reports an impossible fit',()=>{
  const anchored={...tile('water',160,140,true),start:{x:.5,y:.2}};
  const wholeBoard={x:0,y:0,width:390,height:844};
  const automatic=tile('flour',0,0,true),input=[anchored,automatic],initial=iconArrival(input);
  const result=clearArrivalHotspots(input,initial,[wholeBoard]);
  assert.deepEqual(result.positions.get('water'),initial.positions.get('water'));
  assert.equal(result.crowded,true);
});
