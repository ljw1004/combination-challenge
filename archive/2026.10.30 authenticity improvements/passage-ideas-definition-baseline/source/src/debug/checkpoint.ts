import type { Story, Ref, Goal, Recipe } from '../story/types.ts';
import { act, newGame, matches, chapterComplete, visibleGoals, recipeFor } from '../engine/game.ts';
import type { State, Action } from '../engine/types.ts';
import { activeHotspots, indexStory } from '../engine/analysis.ts';

/** Developer-only dependency planner. Every checkpoint is a replay of real legal actions. */
export function checkpoint(story: Story, target: number, initial?: State): State {
  if (!Number.isInteger(target) || target < 0 || target > story.chapters.length) throw new Error('Checkpoint chapter is out of range.');
  let state = initial ? structuredClone(initial) : newGame(story);
  const index = indexStory(story); let budget = 20000;
  function apply(s: State, action: Action) { if (--budget < 0) throw new Error('Checkpoint planning exceeded its bounded search budget.'); return act(story,s,action); }
  function ensure(s: State, ref: Ref, visiting: Set<string>): State {
    if (matches(s.tokens[ref.id],ref)) return s;
    const key = JSON.stringify(ref); if (visiting.has(key)) throw new Error('Cyclic dependency without a starting ingredient.');
    if (s.excluded.includes(ref.id)) throw new Error('This alternative was permanently excluded.');
    const path = new Set([...visiting,key]);
    if (s.tokens[ref.id]?.status === 'available') {
      for (const component of ref.slots) if (!s.tokens[ref.id].slots.includes(component)) {
        s = ensure(s,{ id:component, slots:[] },path);
        s = apply(s,{ type:'combine',a:component,b:ref.id });
      }
      if (matches(s.tokens[ref.id],ref)) return s;
    }
    const producers = index.producers.get(ref.id) ?? []; let last = '';
    // Prefer preparations whose inputs already exist. This is a dependency-minimal
    // witness, not a promise of a globally shortest solution across chapters.
    const cost = (r: Recipe) => [r.a,r.b].filter(Boolean).reduce((n,i) => n + (matches(s.tokens[i!.ref.id],i!.ref) ? 0 : 1),0);
    for (const recipe of [...producers].sort((a,b) => cost(a)-cost(b))) {
      try {
        let candidate = ensure(s,recipe.a.ref,path);
        if (recipe.b) candidate = ensure(candidate,recipe.b.ref,path);
        if (recipe.hotspot && recipe.b) {
          const chapter = [...candidate.visited].reverse().find(i => activeHotspots(story,i).includes(recipe.hotspot!));
          if (chapter === undefined) throw new Error('Required hotspot has not been visited.');
          candidate = apply(candidate,{ type:'move',item:recipe.b.ref.id,chapter,x:90,y:620,hotspot:recipe.hotspot });
        }
        const action: Extract<Action,{type:'combine'}> = { type:'combine',a:recipe.a.ref.id,...(recipe.b?{b:recipe.b.ref.id}:{}),...(recipe.hotspot?{hotspot:recipe.hotspot}:{}) };
        if (!recipeFor(story,candidate,action)) throw new Error('This recipe is not available.');
        candidate = apply(candidate,action);
        if (matches(candidate.tokens[ref.id],ref)) return candidate;
        if (candidate.tokens[ref.id]?.status === 'available') return ensure(candidate,ref,new Set());
      } catch (error) { last = (error as Error).message; }
    }
    throw new Error(`Cannot prepare ${story.items[ref.id]?.name ?? ref.id}: ${last || 'no available producing rule or primitive'}`);
  }
  function satisfy(s: State, goal: Goal): State {
    if (s.achieved.includes(goal.id)) return s;
    let last = '';
    for (const condition of goal.conditions) {
      try {
        let next = ensure(s,condition.item,new Set());
        if (condition.hotspot) {
          const chapter = [...next.visited].reverse().find(i => activeHotspots(story,i).includes(condition.hotspot!));
          if (chapter === undefined) throw new Error('Goal hotspot has not been visited.');
          next = apply(next,{ type:'move',item:condition.item.id,chapter,x:90,y:620,hotspot:condition.hotspot });
        }
        s = next; if (goal.operator === 'or') return s;
      } catch (error) { last = (error as Error).message; if (goal.operator === 'and') throw error; }
    }
    if (!s.achieved.includes(goal.id)) throw new Error(last || `Could not satisfy ${goal.text}`);
    return s;
  }
  while (state.chapter < target && !state.completed) {
    while (state.pending.length) state = apply(state,{type:'dismiss'});
    while (!chapterComplete(story,state)) {
      const goals = visibleGoals(story,state); let moved = false, last = '';
      for (const goal of goals) {
        try { state = satisfy(state,goal); moved = true; break; }
        catch (error) { last = (error as Error).message; }
      }
      if (!moved) throw new Error(`${story.chapters[state.chapter].name}: ${last}`);
      while (state.pending.length) state = apply(state,{type:'dismiss'});
    }
    state = apply(state,{type:'advance'});
  }
  return state;
}
