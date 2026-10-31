import type { Condition, Recipe, Ref, Story } from '../story/types.ts';
import type { Action, State } from '../engine/types.ts';
import { act, matches, recipeFor, type RetirementCheck } from '../engine/game.ts';
import { activeHotspots, chapterSupplies, hasRef } from '../engine/analysis.ts';

/** Reading dismissal, pixel positions and UI bookkeeping do not affect logical opportunities. */
export function canonicalState(input: State): State {
  return {
    ...input, actions: [], pending: [], seen: [], newItems: [], arrivalDivider: false,
    tokens: Object.fromEntries(Object.entries(input.tokens).map(([id, token]) => [id, {...token, x: 0, y: 0}])),
  };
}

const futureItems = new WeakMap<Story, Map<number, Set<string>>>();
function forwardItems(story: Story, initial: Set<string>): Set<string> {
  const items = new Set(initial);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of Object.values(story.items)) {
      // Creation exclusions and filled slots can block a new result even when
      // their owners are on an old board. Retain those historical facts too.
      if ((item.exclusiveWith && items.has(item.exclusiveWith)) || item.slots.some(slot => items.has(slot.accepts))) {
        if (!items.has(item.id)) { items.add(item.id); changed = true; }
      }
    }
    for (const recipe of story.recipes) {
      const refs = [recipe.a.ref, ...(recipe.b ? [recipe.b.ref] : [])];
      if (!refs.every(ref => [ref.id, ...ref.slots].every(id => items.has(id)))) continue;
      for (const id of [recipe.result.id, ...recipe.result.slots]) if (!items.has(id)) { items.add(id); changed = true; }
    }
  }
  return items;
}

/** Future requirements include every producer alternative, then every optional
 * forward construction from those ingredients. No branch choice is used to prune.
 * Old items outside this set cannot be carried by a requirement or affect its
 * continuation check. Current-board extras cover inherited-hotspot carry too.
 */
export function relevantItems(story: Story, state: State): Set<string> {
  let chapters = futureItems.get(story);
  if (!chapters) { chapters = new Map(); futureItems.set(story, chapters); }
  let base = chapters.get(state.chapter);
  if (!base) {
    const items = new Set<string>();
    const visit = (ref: Ref) => {
      for (const slot of ref.slots) visit({id: slot, slots: []});
      if (items.has(ref.id)) return;
      items.add(ref.id);
      for (const recipe of story.recipes) if (!recipe.installation && recipe.result.id === ref.id) {
        visit(recipe.a.ref); if (recipe.b) visit(recipe.b.ref);
      }
    };
    for (let c = state.chapter; c < story.chapters.length; c++) {
      chapterSupplies(story, c).forEach(visit);
      for (const goal of story.chapters[c].goals) for (const condition of goal.conditions) visit(condition.item);
    }
    base = forwardItems(story, items);
    chapters.set(state.chapter, base);
  }
  const extras = Object.values(state.tokens).filter(t => t.status === 'available' && t.chapter === state.chapter && [t.id, ...t.slots].some(id => !base.has(id)));
  return extras.length ? forwardItems(story, new Set([...base, ...extras.flatMap(t => [t.id, ...t.slots])])) : base;
}

export interface Transition { state: State; recipe: Recipe }

export function conditionMet(state: State, condition: Condition): boolean {
  const token = state.tokens[condition.item.id];
  return matches(token, condition.item) && (!condition.hotspot || token?.hotspot === condition.hotspot);
}

/** All combinations on the current board, including both drag orientations. No fetching from scrollback. */
export function* localTransitions(story: Story, state: State, recipes: readonly Recipe[], retirementCheck?: RetirementCheck): Generator<Transition> {
  if (state.completed) return;
  const hotspots = new Set(activeHotspots(story, state.chapter));
  const here = (ref: Ref) => matches(state.tokens[ref.id], ref) && state.tokens[ref.id].chapter === state.chapter;
  for (const recipe of recipes) {
    if (!here(recipe.a.ref) || (recipe.b && !here(recipe.b.ref)) || (recipe.hotspot && !hotspots.has(recipe.hotspot))) continue;
    const interchangeable = recipe.b && state.tokens[recipe.a.ref.id].hotspot === state.tokens[recipe.b.ref.id].hotspot
      && (!recipe.hotspot || state.tokens[recipe.a.ref.id].hotspot === recipe.hotspot);
    const orientations = recipe.b && !interchangeable
      ? [[recipe.a.ref.id, recipe.b.ref.id], [recipe.b.ref.id, recipe.a.ref.id]]
      : [[recipe.a.ref.id, recipe.b?.ref.id]];
    for (const [a, b] of orientations) {
      let prepared = state;
      if (recipe.hotspot && b && state.tokens[b].hotspot !== recipe.hotspot) {
        const move: Action = {type: 'move', item: b, chapter: state.chapter, x: 0, y: 0, hotspot: recipe.hotspot};
        const moved = act(story, prepared, move);
        prepared = canonicalState(moved);
      }
      const action: Extract<Action, {type: 'combine'}> = {
        type: 'combine', a: a!, ...(b ? {b} : {}),
        ...(recipe.hotspot ? {hotspot: recipe.hotspot, chapter: state.chapter} : {}),
      };
      // Match the game's recipe precedence, including ambiguous authored input pairs.
      if (recipeFor(story, prepared, action)?.id !== recipe.id) continue;
      let result: State;
      try { result = act(story, prepared, action, retirementCheck); }
      catch (error) {
        // Independent OPTIONAL histories can include combinations of facts with
        // no viable continuation. The game rejects these actions too.
        if (error instanceof Error && /^This (action|exclusive choice) would remove every continuation/.test(error.message)) continue;
        throw error;
      }
      yield {state: canonicalState(result), recipe};
    }
  }
}

/** An optimistic bound only: cleanup, unresolved exclusions and slot consumption are ignored.
 * Every actual local construction is in this closure; membership is never a positive witness.
 */
export function localClosure(story: Story, state: State): Set<string> {
  const available = new Map<string, Set<string>>();
  if (state.completed) return new Set();
  for (const token of Object.values(state.tokens)) {
    if (token.status === 'available' && token.chapter === state.chapter) available.set(token.id, new Set(token.slots));
  }
  const hotspots = new Set(activeHotspots(story, state.chapter)), excluded = new Set(state.excluded);
  let changed = true;
  while (changed) {
    changed = false;
    for (const recipe of story.recipes) {
      if (excluded.has(recipe.result.id) || (recipe.hotspot && !hotspots.has(recipe.hotspot))) continue;
      if (!recipe.installation && state.tokens[recipe.result.id]) continue;
      if (!hasRef(available, recipe.a.ref) || (recipe.b && !hasRef(available, recipe.b.ref))) continue;
      let slots = available.get(recipe.result.id);
      if (!slots) { slots = new Set(); available.set(recipe.result.id, slots); changed = true; }
      for (const slot of recipe.result.slots) if (!slots.has(slot)) { slots.add(slot); changed = true; }
    }
  }
  return new Set(available.keys());
}
