import {test} from 'node:test';
import assert from 'node:assert/strict';
import {iconArrival} from '../src/web/icon-layout.ts';

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
