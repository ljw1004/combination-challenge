import type {Story} from '../story/types.ts';
import type {State, Action} from './types.ts';
import {act, matches, recipeFor} from './game.ts';
import {activeHotspots} from './analysis.ts';
import {hotspotDrop} from './hotspot-drop.ts';

/** The authored direction must itself be executable, including receiving placement. */
export function tutorialAction(story: Story, state: State): Extract<Action, {type: 'combine'}> | undefined {
  if (story.tutorials?.length !== 1 || story.tutorials[0].chapter !== 0) return;
  const recipe = story.recipes.find(recipe => recipe.id === story.tutorials![0].recipe);
  if (!recipe) return;
  const action: Extract<Action, {type: 'combine'}> = {
    type: 'combine', a: recipe.a.ref.id,
    ...(recipe.b ? {b: recipe.b.ref.id} : {}),
    ...(recipe.hotspot ? {hotspot: recipe.hotspot} : {}),
  };
  return recipeFor(story, state, action)?.id === recipe.id ? action : undefined;
}

export interface HotspotTutorial {
  recipe: string;
  hotspot: string;
  /** First park an ingredient, then bring its partner; omit preparation already done. */
  sources: string[];
  receiver?: string;
}

/** Discover a real two-item opportunity, including the preparation before it is executable. */
export function hotspotTutorials(story: Story, state: State, preferred?: string): HotspotTutorial[] {
  if (state.completed) return [];
  const hotspots = activeHotspots(story, state.chapter);
  const candidates: HotspotTutorial[] = [];
  for (const recipe of story.recipes) {
    if (!recipe.b || !recipe.hotspot || !hotspots.includes(recipe.hotspot)) continue;
    const a = state.tokens[recipe.a.ref.id], b = state.tokens[recipe.b.ref.id];
    if (a?.chapter !== state.chapter || b?.chapter !== state.chapter || a.id === b.id ||
      !matches(a, recipe.a.ref) || !matches(b, recipe.b.ref)) continue;
    // Prefer an ingredient already parked, regardless of the authored operand order.
    const orders = [[a, b], [b, a]].sort(([left], [right]) =>
      Number(right.hotspot === recipe.hotspot) - Number(left.hotspot === recipe.hotspot));
    for (const [receiver, incoming] of orders) {
      let prepared = state;
      if (receiver.hotspot !== recipe.hotspot) {
        const drop = hotspotDrop(story, state, receiver.id, recipe.hotspot, state.chapter);
        // An operation or ambiguous drop cannot demonstrate parking this ingredient.
        if (drop.action || drop.ambiguous.length) continue;
        prepared = act(story, state, {type: 'move', item: receiver.id, chapter: state.chapter,
          x: receiver.x, y: receiver.y, hotspot: recipe.hotspot});
      }
      const action = {type: 'combine' as const, a: incoming.id, b: receiver.id, hotspot: recipe.hotspot, chapter: state.chapter};
      if (recipeFor(story, prepared, action)?.id !== recipe.id) continue;
      if (prepared !== state) {
        const drop = hotspotDrop(story, prepared, incoming.id, recipe.hotspot, state.chapter);
        if (drop.action?.b !== receiver.id) continue;
      }
      // An existing receiver can be targeted directly to disambiguate other occupants.
      candidates.push({recipe: recipe.id, hotspot: recipe.hotspot,
        sources: prepared === state ? [incoming.id] : [receiver.id, incoming.id],
        ...(prepared === state ? {receiver: receiver.id} : {})});
      break;
    }
  }
  return candidates.sort((a, b) => Number(b.recipe === preferred) - Number(a.recipe === preferred));
}

/** Call only for accepted actions (including accepted actions restored from a save). */
export function completesHotspotTutorial(action: Action): boolean {
  return action.type === 'combine' && !!action.b && !!action.hotspot;
}
