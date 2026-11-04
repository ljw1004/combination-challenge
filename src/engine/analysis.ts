import type { Story, Ref, Condition, Recipe, Goal, Chapter } from '../story/types.ts';
import type { State } from './types.ts';
import {activeHotspots, isFixed, recipeIngredients} from './fixed-items.ts';
export {activeHotspots} from './fixed-items.ts';

export interface Index { producers: Map<string, Recipe[]>; primitives: Set<string>; pairs: [string, string][]; operands: Map<string, Recipe[]> }
const indices = new WeakMap<Story, Index>();
function operandKey(a: string, b?: string, hotspot?: string): string {
  return JSON.stringify([b ? [a, b].sort() : [a], hotspot ?? '']);
}
export function indexStory(story: Story): Index {
  let index = indices.get(story); if (index) return index;
  const producers = new Map<string, Recipe[]>(), operands = new Map<string, Recipe[]>();
  for (const r of story.recipes) {
    if (!r.installation) { const list = producers.get(r.result.id) ?? []; list.push(r); producers.set(r.result.id, list); }
    const key = operandKey(r.a.ref.id, r.b?.ref.id, r.hotspot), matches = operands.get(key) ?? [];
    matches.push(r); operands.set(key, matches);
  }
  const primitives = new Set(Object.keys(story.items).filter(id => !producers.has(id)));
  const pairs: [string, string][] = [];
  for (const item of Object.values(story.items)) if (item.exclusiveWith && item.id < item.exclusiveWith) pairs.push([item.id, item.exclusiveWith]);
  index = { producers, primitives, pairs, operands }; indices.set(story, index); return index;
}
export function recipeCandidates(story: Story, a: string, b?: string, hotspot?: string): readonly Recipe[] {
  return indexStory(story).operands.get(operandKey(a, b, hotspot)) ?? [];
}
/** Only primitive declarations request chapter supplies; derived declarations are metadata. */
export function chapterSupplies(story: Story, chapter: number): Ref[] {
  const primitives = indexStory(story).primitives;
  return story.chapters[chapter].items.filter(ref => primitives.has(ref.id));
}
/** `next:` groups display stages; every stage remains a requirement. */
export function goalChains(goals: Goal[]): Goal[][] {
  const chains: Goal[][] = [];
  for (const goal of goals) { if (!goal.next || !chains.length) chains.push([]); chains.at(-1)!.push(goal); }
  return chains;
}
export function chapterGoalsSatisfied(chapter: Chapter, satisfied: (goal: Goal) => boolean): boolean {
  const chains = goalChains(chapter.goals), complete = (chain: Goal[]) => chain.every(satisfied);
  return !chains.length || (chapter.goalOperator === 'and' ? chains.every(complete) : chains.some(complete));
}
export function background(story: Story, chapter: number): string | undefined {
  for (let i = chapter; i >= 0; i--) if (story.chapters[i].image) return story.chapters[i].image;
}
export function hasRef(available: Map<string, Set<string>>, ref: Ref): boolean {
  const slots = available.get(ref.id); return !!slots && ref.slots.every(id => slots.has(id));
}
export function goalPossible(goal: Goal, available: Map<string, Set<string>>, hotspots: Set<string>, fixed: Set<string> = hotspots): boolean {
  const check = (c: Condition) => hasRef(available, c.item) && (!c.hotspot || !fixed.has(c.item.id) && hotspots.has(c.hotspot) && available.has(c.hotspot));
  return goal.conditions.length > 0 && (goal.operator === 'and' ? goal.conditions.every(check) : goal.conditions.some(check));
}

/** Monotone planning closure for a fixed set of permanent exclusive choices.
 * All resources are infinite; retention keeps those needed for future work visible.
 * Hidden tokens stay hidden under the needs rules, and future hotspots enter in order.
 */
export function continuationPossible(story: Story, state: State, removed: Set<string> = new Set(), includeCurrentItems=false): boolean {
  return possibility(story,state,removed,includeCurrentItems);
}
export interface ContinuationBlocker {chapter:number; goal?:Goal; supply?:Ref}
/** Explain the same closure used by retention, without running a second planner. */
export function analyzeContinuation(story: Story, state: State): {possible:boolean; blockers:ContinuationBlocker[]} {
  const blockers = new Map<string,ContinuationBlocker>();
  const possible = possibility(story,state,new Set(),true,undefined,blocker => {
    blockers.set(blocker.goal?.id ?? `${blocker.chapter}:${JSON.stringify(blocker.supply)}`,blocker);
  });
  return {possible,blockers:possible ? [] : [...blockers.values()]};
}
/** Can these preparations coexist on a remaining branch? Missing does not mean retired.
 * Reuse the planning closure without requiring unrelated goals to be complete. */
export function preparationPossible(story: Story, state: State, required: readonly Ref[]): boolean {
  return possibility(story,state,new Set(),false,required);
}
function possibility(story: Story, state: State, removed: Set<string>, includeCurrentItems:boolean, required?:readonly Ref[], onFailure?:(blocker:ContinuationBlocker)=>void):boolean {
  const index = indexStory(story), banned = new Set(state.excluded);
  for (const token of Object.values(state.tokens)) if (token.status !== 'available' && token.status !== 'installed') banned.add(token.id);
  for (const id of removed) banned.add(id);
  const unresolved = index.pairs.filter(([a,b]) => !banned.has(a) && !banned.has(b) && !state.tokens[a] && !state.tokens[b]);
  // This explicit authoring limit avoids turning incomplete search into a safety claim.
  if (unresolved.length > 12) throw new Error('More than 12 unresolved exclusive pairs exceed the exact branch-analysis limit. Split this story or reduce exclusivity.');
  function check(denied: Set<string>): boolean {
    const available = new Map<string, Set<string>>();
    for (const token of Object.values(state.tokens)) if (!denied.has(token.id) && !removed.has(token.id) && token.status === 'available') available.set(token.id, new Set(token.slots));
    // Installed parts remain inside their owner; they cannot act as outside reagents.
    for (const primitive of index.primitives) if (!denied.has(primitive) && !state.tokens[primitive]) available.set(primitive, new Set());
    const fixed = new Set(Object.values(state.tokens).filter(token => isFixed(story, token)).map(token => token.id));
    for (let chapter = state.chapter; chapter < story.chapters.length; chapter++) {
      const current = story.chapters[chapter];
      if (chapter > state.chapter && current.goals.length && chapterGoalsSatisfied(current, g => state.achieved.includes(g.id))) continue;
      const hotspots = new Set(activeHotspots(story, chapter));
      for (const id of hotspots) if (available.has(id)) fixed.add(id);
      const usable = (ref: Ref) => hasRef(available, ref) && (!fixed.has(ref.id) || hotspots.has(ref.id));
      let changed = true;
      while (changed) {
        changed = false;
        for (const r of story.recipes) {
          if (denied.has(r.result.id) || (state.tokens[r.result.id]?.status && state.tokens[r.result.id].status !== 'available') || (r.hotspot && !hotspots.has(r.hotspot))) continue;
          if (!recipeIngredients(r).every(input => usable(input.ref))) continue;
          // With one receiving fixed operand, the other must be draggable.
          if (r.hotspot && fixed.has(r.a.ref.id) && (!r.b || fixed.has(r.b.ref.id))) continue;
          if (!r.hotspot && r.b && fixed.has(r.a.ref.id) && fixed.has(r.b.ref.id)) continue;
          let slots = available.get(r.result.id);
          if (!slots) { slots = new Set(); available.set(r.result.id, slots); changed = true; }
          if (hotspots.has(r.result.id)) fixed.add(r.result.id);
          for (const slot of r.result.slots) if (!slots.has(slot)) { slots.add(slot); changed = true; }
        }
      }
      const c = story.chapters[chapter];
      const checkGoal = (g: Goal) => state.achieved.includes(g.id) || goalPossible(g, available, hotspots, fixed);
      if (!required && !chapterGoalsSatisfied(c, checkGoal)) {
        if (onFailure) for (const goal of c.goals) if (!checkGoal(goal)) onFailure({chapter,goal});
        return false;
      }
      // Excluded optional alternatives do not become mandatory through an Items listing.
      if (!required && (chapter > state.chapter || includeCurrentItems) && chapterSupplies(story, chapter).some(r => {
        const token = state.tokens[r.id];
        const excludedChoice = state.excluded.includes(r.id) || index.pairs.some(pair => pair.includes(r.id) && denied.has(r.id) && !banned.has(r.id));
        const alreadyRetired = token && token.status !== 'available' && !removed.has(r.id);
        const missing = !excludedChoice && !alreadyRetired && !hasRef(available,r);
        if (missing) onFailure?.({chapter,supply:r});
        return missing;
      })) return false;
    }
    return !required || required.every(ref=>hasRef(available,ref));
  }
  function choose(i: number, denied: Set<string>): boolean {
    if (i === unresolved.length) return check(denied);
    const [a,b] = unresolved[i];
    return choose(i + 1, new Set([...denied,a])) || choose(i + 1, new Set([...denied,b]));
  }
  return choose(0, banned);
}

/** Backward needs union, with cycle detection and actual creation/retirement state. */
export function chapterNeeds(story: Story, state: State, chapter: number): Set<string> {
  const index = indexStory(story), needed = new Set<string>(), expanded = new Set<string>();
  const fixed = new Set(activeHotspots(story, chapter));
  function need(ref: Ref) {
    if (state.excluded.includes(ref.id)) return;
    const token = state.tokens[ref.id];
    if (token && token.status !== 'available') return;
    if (isFixed(story, token) && !fixed.has(ref.id)) return;
    needed.add(ref.id);
    for (const slot of ref.slots) if (!token?.slots.includes(slot)) need({ id: slot, slots: [] });
    if (token || expanded.has(ref.id)) return;
    expanded.add(ref.id);
    for (const recipe of index.producers.get(ref.id) ?? []) {
      if (recipe.hotspot && !fixed.has(recipe.hotspot)) continue;
      const operands = recipeIngredients(recipe);
      if (operands.some(i => state.excluded.includes(i.ref.id) || (state.tokens[i.ref.id] && state.tokens[i.ref.id].status !== 'available'))) continue;
      if (operands.some(i => isFixed(story, state.tokens[i.ref.id]) && !fixed.has(i.ref.id))) continue;
      if (fixed.has(recipe.a.ref.id) && (!recipe.b || fixed.has(recipe.b.ref.id))) continue;
      for (const input of operands) need(input.ref);
    }
  }
  const c = story.chapters[chapter];
  for (const id of fixed) if (state.tokens[id]?.status === 'available') need({id, slots: []});
  for (const ref of chapterSupplies(story, chapter)) need(ref);
  for (const g of c.goals) if (!state.achieved.includes(g.id)) for (const cond of g.conditions) {
    need(cond.item);
    if(cond.hotspot&&fixed.has(cond.hotspot))need({id:cond.hotspot,slots:[]});
  }
  return needed;
}
