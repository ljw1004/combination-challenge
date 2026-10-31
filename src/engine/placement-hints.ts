import type {Story,Ref} from '../story/types.ts';
import type {State} from './types.ts';
import {activeHotspots,preparationPossible} from './analysis.ts';
import {canCreateResult} from './game.ts';

/** Each link sets an unsatisfied location prerequisite for a still-possible task. */
export function placementHints(story:Story,state:State):{item:string;hotspot:string}[] {
  if(state.completed)return [];
  const visited=new Set(state.visited.flatMap(chapter=>activeHotspots(story,chapter)));
  const links=new Map<string,{item:string;hotspot:string}>();
  const candidate=(ref:Ref,hotspot:string)=>{
    const token=state.tokens[ref.id];
    return visited.has(hotspot)&&token?.status==='available'&&token.hotspot!==hotspot;
  };
  const add=(ref:Ref,hotspot:string)=>{if(candidate(ref,hotspot))links.set(JSON.stringify([ref.id,hotspot]),{item:ref.id,hotspot});};
  for(const recipe of story.recipes){
    // A single-item operation executes on drop; only a two-item context has a
    // receiving placement to prepare separately from completing the operation.
    if(!recipe.hotspot || !recipe.b)continue;
    const refs=[recipe.a.ref,recipe.b.ref];
    if(!refs.some(ref=>candidate(ref,recipe.hotspot!)) || !canCreateResult(story,state,recipe))continue;
    // A missing ingredient or fitting may be made later; a retired/excluded one cannot.
    const excluded=story.items[recipe.result.id]?.exclusiveWith;
    const branch=excluded?{...state,excluded:[...state.excluded,excluded]}:state;
    if(preparationPossible(story,branch,refs))refs.forEach(ref=>add(ref,recipe.hotspot!));
  }
  // Goals latch independently of which next: step is currently displayed.
  for(const chapter of story.chapters)for(const goal of chapter.goals){
    if(state.achieved.includes(goal.id))continue;
    for(const condition of goal.conditions){
      if(condition.hotspot && candidate(condition.item,condition.hotspot) && preparationPossible(story,state,[condition.item]))add(condition.item,condition.hotspot);
    }
  }
  return [...links.values()];
}
