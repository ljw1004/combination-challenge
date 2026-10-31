import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act,newGame,legalActions} from '../src/engine/game.ts';
import {partnerHints} from '../src/web/partner-hints.ts';
import {loadStory} from '../src/story/load.ts';
import {checkpoint} from '../src/debug/checkpoint.ts';

const story=parseStory(`# Cellar
## Bread
![room](room.webp)
**Goals**
- Let the dough rise -- Risen dough
**Hotspots**
- Warm cellar
**Items**
- Salt
**Combinations**
- Wild starter [preserve] + Dough [transform] @ Warm cellar -> Risen dough
## Later
![room](other.webp)
**Goals**
- Make a loaf -- Loaf
**Hotspots**
- Oven
**Combinations**
- Risen dough [transform] @ Oven -> Loaf`);
const item=(id:string)=>({kind:'item' as const,id:`name:${id}`});
const hotspot=(id:string)=>({kind:'hotspot' as const,id:`name:${id}`});

test('context hints offer preparatory placement, then the item drag that actually combines',()=>{
  const state=newGame(story),before=structuredClone(state);
  for(const selected of ['Dough','Wild starter']){
    const hints=partnerHints(story,state,item(selected));
    assert.equal(hints.items.size,0);assert.deepEqual([...hints.hotspots],['name:Warm cellar']);
  }
  assert.deepEqual(partnerHints(story,state,hotspot('Warm cellar')).items,new Set(['name:Wild starter','name:Dough']));
  assert.deepEqual(state,before);assert.equal(legalActions(story,state).length,0);
  const action={type:'combine' as const,a:'name:Wild starter',b:'name:Dough',hotspot:'name:Warm cellar'};
  assert.throws(()=>act(story,state,action));
  const placed=act(story,state,{type:'move',item:'name:Dough',chapter:0,x:100,y:500,hotspot:'name:Warm cellar'});
  assert(legalActions(story,placed).some(a=>a.a===action.a&&a.b===action.b));
  assert.deepEqual(partnerHints(story,placed,item('Dough')).items,new Set(['name:Wild starter']));
  assert.equal(partnerHints(story,placed,item('Dough'),'from').items.size,0);
  assert.deepEqual(partnerHints(story,placed,item('Wild starter'),'from').items,new Set(['name:Dough']));
  assert(!partnerHints(story,placed,hotspot('Warm cellar')).items.has('name:Dough'),'already placed is not progress');
  const made=act(story,placed,action);
  assert.equal(partnerHints(story,made,hotspot('Warm cellar')).items.size,0);
  assert.equal(partnerHints(story,made,item('Risen dough')).hotspots.size,0,'unvisited oven must not be hinted');
});

test('preparatory placements survive missing ingredients but not retired ingredients or forbidden/existing results',()=>{
  const missing=newGame(story);delete missing.tokens['name:Dough'];
  assert.deepEqual(partnerHints(story,missing,hotspot('Warm cellar')).items,new Set(['name:Wild starter']));
  for(const change of ['hidden','excluded','created']){
    const state=newGame(story);
    if(change==='hidden')state.tokens['name:Dough'].status='consume';
    if(change==='excluded')state.excluded.push('name:Risen dough');
    if(change==='created')state.tokens['name:Risen dough']={...state.tokens['name:Dough'],id:'name:Risen dough'};
    assert.equal(partnerHints(story,state,hotspot('Warm cellar')).items.size,0,change);
    assert.equal(partnerHints(story,state,item('Wild starter')).hotspots.size,0,change);
  }
});

test('unfinished compounds can be placed before fitting, including for a later next goal',()=>{
  const compound=parseStory(`# Fitted box
## Work
**Goals**
- Make parcel -- Parcel
- next: Place the fitted box -- Box[Lid] @ Shelf
**Hotspots**
- Shelf
- Bench
- Kiln
**Items**
- Box (compound)
  - unnamed slot: accepts Lid
**Combinations**
- Box[Lid] [preserve] + Tool [preserve] @ Bench -> Parcel
- Box[Lid] [preserve] @ Kiln -> Fired box`);
  let state=newGame(compound);
  for(const id of ['Shelf','Bench'])assert(partnerHints(compound,state,hotspot(id)).items.has('name:Box'));
  assert.equal(partnerHints(compound,state,hotspot('Kiln')).items.size,0,'an unready single-item operation has no receiving placement to prepare');
  assert(!legalActions(compound,state).some(a=>a.hotspot==='name:Bench'));
  state=act(compound,state,{type:'move',item:'name:Box',chapter:0,x:50,y:500,hotspot:'name:Shelf'});
  assert.equal(partnerHints(compound,state,hotspot('Shelf')).items.size,0);
  state=act(compound,state,{type:'combine',a:'name:Lid',b:'name:Box'});
  assert(state.achieved.includes(compound.chapters[0].goals[1].id));
  assert.deepEqual(partnerHints(compound,state,item('Box')).hotspots,new Set(['name:Bench','name:Kiln']));
});

test('Dough prepares the cellar before Wild starter exists, while Flour is only a precursor',()=>{
  const text=`# Preparation
## Bake
**Goals**
- Raise dough -- Risen dough
**Hotspots**
- Warm cellar
**Combinations**
- Flour [transform] + Water [preserve] -> Wild starter
- Wild starter [preserve] + Dough [transform] @ Warm cellar -> Risen dough`;
  const prep=parseStory(text),state=newGame(prep);
  assert(!state.tokens['name:Wild starter']);
  assert.deepEqual(partnerHints(prep,state,hotspot('Warm cellar')).items,new Set(['name:Dough']));
  assert.deepEqual(partnerHints(prep,state,item('Dough')).hotspots,new Set(['name:Warm cellar']));
  assert.equal(partnerHints(prep,state,item('Flour')).hotspots.size,0);
  state.tokens['name:Flour'].status='consume';
  assert.equal(partnerHints(prep,state,hotspot('Warm cellar')).items.size,0,'blocked starter preparation cannot justify placement');
});

test('Settlement bread chapter hints Dough before creating its Wild starter',()=>{
  const {story:settlement}=loadStory('settlement');
  const chapter=settlement.chapters.findIndex(c=>c.name==='Bread for the journey'),state=checkpoint(settlement,chapter);
  assert.equal(state.tokens['name:Dough']?.status,'available');
  assert.equal(state.tokens['name:Flour']?.status,'available');
  assert(!state.tokens['name:Wild starter']);
  const hints=partnerHints(settlement,state,hotspot('Warm cellar'));
  assert(hints.items.has('name:Dough'));assert(!hints.items.has('name:Flour'));
});
