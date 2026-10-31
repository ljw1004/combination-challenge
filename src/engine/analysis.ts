import type { Story, Ref, Condition, Recipe, Goal, Chapter } from '../story/types.ts';
import type { State } from './types.ts';

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
export function activeHotspots(story: Story, chapter: number): string[] {
  const c = story.chapters[chapter]; return !c ? [] : c.image || !chapter ? c.hotspots : activeHotspots(story, chapter - 1);
}
export function background(story: Story, chapter: number): string | undefined {
  for (let i = chapter; i >= 0; i--) if (story.chapters[i].image) return story.chapters[i].image;
}
export function hasRef(available: Map<string, Set<string>>, ref: Ref): boolean {
  const slots = available.get(ref.id); return !!slots && ref.slots.every(id => slots.has(id));
}
export function goalPossible(goal: Goal, available: Map<string, Set<string>>, hotspots: Set<string>): boolean {
  const check = (c: Condition) => hasRef(available, c.item) && (!c.hotspot || hotspots.has(c.hotspot));
  return goal.conditions.length > 0 && (goal.operator === 'and' ? goal.conditions.every(check) : goal.conditions.some(check));
}

/** Monotone planning closure for a fixed set of permanent exclusive choices.
 * All resources are infinite; retention keeps those needed for future work visible.
 * Hidden tokens stay hidden under the needs rules, and future hotspots enter in order.
 */
export function continuationPossible(story: Story, state: State, removed: Set<string> = new Set(), includeCurrentItems=false): boolean {
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
    const hotspots = new Set(state.visited.flatMap(i => activeHotspots(story, i)));
    for (let chapter = state.chapter; chapter < story.chapters.length; chapter++) {
      const current = story.chapters[chapter];
      if (chapter > state.chapter && current.goals.length && chapterGoalsSatisfied(current, g => state.achieved.includes(g.id))) continue;
      activeHotspots(story, chapter).forEach(h => hotspots.add(h));
      let changed = true;
      while (changed) {
        changed = false;
        for (const r of story.recipes) {
          if (denied.has(r.result.id) || (state.tokens[r.result.id]?.status && state.tokens[r.result.id].status !== 'available') || (r.hotspot && !hotspots.has(r.hotspot))) continue;
          if (!hasRef(available, r.a.ref) || (r.b && !hasRef(available, r.b.ref))) continue;
          let slots = available.get(r.result.id);
          if (!slots) { slots = new Set(); available.set(r.result.id, slots); changed = true; }
          for (const slot of r.result.slots) if (!slots.has(slot)) { slots.add(slot); changed = true; }
        }
      }
      const c = story.chapters[chapter];
      const checkGoal = (g: Goal) => state.achieved.includes(g.id) || goalPossible(g, available, hotspots);
      if (!chapterGoalsSatisfied(c, checkGoal)) return false;
      // Excluded optional alternatives do not become mandatory through an Items listing.
      if ((chapter > state.chapter || includeCurrentItems) && chapterSupplies(story, chapter).some(r => {
        const token = state.tokens[r.id];
        const excludedChoice = state.excluded.includes(r.id) || index.pairs.some(pair => pair.includes(r.id) && denied.has(r.id) && !banned.has(r.id));
        const alreadyRetired = token && token.status !== 'available' && !removed.has(r.id);
        return !excludedChoice && !alreadyRetired && !hasRef(available,r);
      })) return false;
    }
    return true;
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
  function need(ref: Ref) {
    if (state.excluded.includes(ref.id)) return;
    const token = state.tokens[ref.id];
    if (token && token.status !== 'available') return;
    needed.add(ref.id);
    for (const slot of ref.slots) if (!token?.slots.includes(slot)) need({ id: slot, slots: [] });
    if (token || expanded.has(ref.id)) return;
    expanded.add(ref.id);
    for (const recipe of index.producers.get(ref.id) ?? []) {
      const operands = [recipe.a, ...(recipe.b ? [recipe.b] : [])];
      if (operands.some(i => state.excluded.includes(i.ref.id) || (state.tokens[i.ref.id] && state.tokens[i.ref.id].status !== 'available'))) continue;
      for (const input of operands) need(input.ref);
    }
  }
  const c = story.chapters[chapter];
  for (const ref of chapterSupplies(story, chapter)) need(ref);
  for (const g of c.goals) if (!state.achieved.includes(g.id)) for (const cond of g.conditions) need(cond.item);
  return needed;
}
