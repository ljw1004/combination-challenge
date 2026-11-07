import type {Story} from '../story/types.ts';
import type {State, Action} from './types.ts';
import {act, availableTokens, chapterComplete, legalActions, visibleGoals} from './game.ts';
import {isFixed, presentHotspots, recipeIngredients} from './fixed-items.ts';
import {hotspotDrop} from './hotspot-drop.ts';

export interface GoalDistance {id: string; steps: number | null}

/** Logical identity only: coordinates, readings and history do not affect distance.
 * Keep retired identities, placements, fittings and latches: all affect legal work. */
export function goalDistanceKey(state: State): string {
  return JSON.stringify([
    Object.values(state.tokens).sort((a,b) => a.id.localeCompare(b.id)).map(t => [t.id,t.status,t.chapter,t.hotspot,[...t.slots].sort()]),
    [...state.achieved].sort(), [...state.excluded].sort(),
  ]);
}

/** One combination/fitting or one useful placement per edge. Ordinary board
 * rearrangement and reading cost nothing; future chapters are never entered. */
function actions(story: Story, state: State): Action[] {
  const combinations = legalActions(story,state), moves = new Map<string, Action>();
  const surfaces = state.visited.flatMap(chapter => presentHotspots(story,state,chapter).map(hotspot => ({chapter,hotspot})));
  const available = new Set(availableTokens(state).filter(t => !isFixed(story,t)).map(t => t.id));
  function place(item: string, hotspot: string) {
    if (!available.has(item)) return;
    const token = state.tokens[item];
    for (const surface of surfaces.filter(s => s.hotspot === hotspot)) {
      if (token.hotspot === hotspot && token.chapter === surface.chapter) continue;
      const drop = hotspotDrop(story,state,item,hotspot,surface.chapter,combinations);
      if (drop.action || drop.ambiguous.length) continue;
      const move: Action = {type:'move',item,...surface,x:0,y:0};
      moves.set(JSON.stringify([item,hotspot,surface.chapter]),move);
    }
  }
  // Missing fittings can be installed after positioning their owner. Include
  // later stages too: early placement can survive construction and latch goals.
  for (const chapter of story.chapters) for (const goal of chapter.goals) {
    if (!state.achieved.includes(goal.id)) for (const condition of goal.conditions) {
      if (condition.hotspot) place(condition.item.id,condition.hotspot);
    }
  }
  for (const recipe of story.recipes) if (recipe.hotspot && recipe.b) {
    for (const input of recipeIngredients(recipe).slice(0,2)) place(input.ref.id,recipe.hotspot);
  }
  return [...combinations,...moves.values()];
}

/** Breadth-first search stops after the first successful depth, checking every
 * tie in displayed order. A bounded/incomplete search returns the top goal with
 * unknown distance, never an unreachable claim or a partially ranked winner.
 * Geometry (including optional authored result snaps) is deliberately excluded. */
export function nearestGoal(story: Story, initial: State, maxTransitions = 2000): GoalDistance | undefined {
  if (chapterComplete(story,initial) || initial.completed) return;
  const goals = visibleGoals(story,initial);
  if (!goals.length) return;
  const fallback: GoalDistance = {id:goals[0].id,steps:null};
  if (goals.length === 1) return fallback;
  const compact = (state: State): State => ({...state,actions:[],pending:[],seen:[],newItems:[]});
  let frontier = [compact(initial)], transitions = 0;
  const seen = new Set([goalDistanceKey(initial)]);
  for (let steps = 1; frontier.length; steps++) {
    const next: State[] = [];
    let best = goals.length;
    for (const state of frontier) for (const action of actions(story,state)) {
      if (++transitions > maxTransitions) return fallback;
      let result: State;
      try { result = compact(act(story,state,action)); }
      catch { continue; } // An unavailable branch is not a route to the goal.
      const found = goals.findIndex(g => result.achieved.includes(g.id));
      if (found >= 0) best = Math.min(best,found);
      // The top displayed goal cannot lose a tie at this depth.
      if (best === 0) return {id:goals[0].id,steps};
      if (best < goals.length) continue;
      const identity = goalDistanceKey(result);
      if (!seen.has(identity)) {seen.add(identity); next.push(result);}
    }
    if (best < goals.length) return {id:goals[best].id,steps};
    frontier = next;
  }
  return fallback;
}
