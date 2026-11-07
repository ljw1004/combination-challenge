import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act,newGame} from '../src/engine/game.ts';
import {nearestGoal} from '../src/engine/nearest-goal.ts';

const parse = (body: string) => parseStory(`# Distance\n## Work\n${body}`,{id:'distance'});
const combine = (a: string,b: string) => ({type:'combine' as const,a:`name:${a}`,b:`name:${b}`});

test('nearest goal uses current progress and resolves equal distances in display order',() => {
  const story = parse(`**Goals**
- Longer -- Finished
- Shorter -- Quick
**Combinations**
- D [preserve] + E [preserve] -> Quick
- A [preserve] + B [preserve] -> Part
- Part [preserve] + Tool [preserve] -> Finished`);
  const initial = newGame(story), copy = structuredClone(initial);
  assert.deepEqual(nearestGoal(story,initial),{id:story.chapters[0].goals[1].id,steps:1});
  const progressed = act(story,initial,combine('A','B'));
  assert.deepEqual(nearestGoal(story,progressed),{id:story.chapters[0].goals[0].id,steps:1});
  assert.deepEqual(initial,copy,'planning does not mutate the player or its action history');
  assert.deepEqual(nearestGoal(story,initial,1),{id:story.chapters[0].goals[0].id,steps:null},'an unfinished tie search falls back, even after finding a lower row');
});

test('conjunction counts shared prerequisites once, while alternatives use their shortest route',() => {
  const story = parse(`**Goals**
- Four steps -- Long
- Shared work
  - and: X
  - and: Y
**Combinations**
- A [preserve] + B [preserve] -> S
- S [preserve] + A [preserve] -> X
- S [preserve] + B [preserve] -> Y
- A [preserve] + Tool [preserve] -> L1
- L1 [transform] + Tool [preserve] -> L2
- L2 [transform] + Tool [preserve] -> L3
- L3 [transform] + Tool [preserve] -> Long`);
  assert.deepEqual(nearestGoal(story,newGame(story)),{id:story.chapters[0].goals[1].id,steps:3});
  const alternative = parse(`**Goals**
- Alternatives
  - either: Long
  - or: Quick
- Two steps -- Other
**Combinations**
- A [preserve] + B [preserve] -> Part
- Part [preserve] + B [preserve] -> Other
- Other [preserve] + B [preserve] -> Long
- A [preserve] + Tool [preserve] -> Quick`);
  assert.deepEqual(nearestGoal(alternative,newGame(alternative)),{id:alternative.chapters[0].goals[0].id,steps:1});
});

test('contextual preparation and each required goal placement count as separate actions',() => {
  const story = parse(`**Goals**
- Two placements
  - and: A @ Bench
  - and: B @ Bench
- Make result -- Result
**Hotspots**
- Bench
**Items**
- Bench
- A
- B
**Combinations**
- C [preserve] + D [preserve] @ Bench -> Result`);
  const initial = newGame(story);
  assert.deepEqual(nearestGoal(story,initial),{id:story.chapters[0].goals[0].id,steps:2});
  const placed = act(story,initial,{type:'move',item:'name:D',chapter:0,hotspot:'name:Bench',x:0,y:0});
  assert.deepEqual(nearestGoal(story,placed),{id:story.chapters[0].goals[1].id,steps:1});
});

test('installed slots, retired identities and sequential display constrain the ranking',() => {
  const story = parse(`**Goals**
- Build and fit -- Case[Lid]
- next: Later -- Parcel
- Make quick -- Quick
**Items**
- Case (compound)
  - slot: closure, accepts Lid
- Lid
**Combinations**
- A [preserve] + B [preserve] -> Case
- A [preserve] + Tool [preserve] -> Quick
- Case[Lid] [preserve] + Tool [preserve] -> Parcel`);
  const initial = newGame(story);
  assert.equal(nearestGoal(story,initial)?.id,story.chapters[0].goals[2].id);
  const made = act(story,initial,combine('A','B'));
  assert.deepEqual(nearestGoal(story,made),{id:story.chapters[0].goals[0].id,steps:1});
  const fitted = act(story,made,combine('Lid','Case'));
  assert.deepEqual(nearestGoal(story,fitted),{id:story.chapters[0].goals[1].id,steps:1});
  const retired = structuredClone(made); retired.tokens['name:Case'].status = 'consume';
  const alternatives = structuredClone(story); alternatives.chapters[0].goalOperator = 'or';
  assert.equal(nearestGoal(alternatives,retired)?.id,story.chapters[0].goals[2].id,'a retired case cannot be remade, while the alternative remains legal');
});

test('a drop that automatically combines cannot be counted as a placement instead',() => {
  const story = parse(`**Goals**
- Put A on bench -- A @ Bench
- Make quick -- Quick
**Hotspots**
- Bench
**Items**
- Bench
**Combinations**
- A [preserve] @ Bench -> Changed
- B [preserve] + Tool [preserve] -> Quick`);
  assert.deepEqual(nearestGoal(story,newGame(story)),{id:story.chapters[0].goals[1].id,steps:1});
});
