import type {Story} from '../story/types.ts';
import type {Action, State} from '../engine/types.ts';
import {act, newGame, recipeFor} from '../engine/game.ts';
import {checkpoint} from '../debug/checkpoint.ts';

export interface CheckpointMeasurement {requestedChapter: number; chapter: number; name: string; items: number}
export interface ItemPersistence {id: string; chapters: number; chapterPath: number[]}
export interface RouteMeasurement {
  completed: boolean;
  visitedChapters: number[];
  checkpoints: CheckpointMeasurement[];
  items: ItemPersistence[];
  combinations: number;
}

/** Count distinct combination chapters along one causal path, not elapsed span
 * or the union of unrelated branches. Paths use progression time, not placement.
 */
export function measureRoute(story: Story, actions: readonly Action[] = checkpoint(story, story.chapters.length).actions): RouteMeasurement {
  let state = newGame(story), combinations = 0;
  const entries = new Map<number, number>(), ancestry = new Map<string, number[]>();
  function observe(current: State) {
    for (const token of Object.values(current.tokens)) if (!ancestry.has(token.id)) ancestry.set(token.id, []);
    if (story.chapters[current.chapter] && !entries.has(current.chapter)) {
      entries.set(current.chapter, Object.values(current.tokens).filter(t => t.status === 'available' && t.chapter === current.chapter).length);
    }
  }
  observe(state);
  for (const action of actions) {
    if (action.type === 'combine') {
      const recipe = recipeFor(story, state, action);
      if (!recipe) throw new Error('Reference replay contains an unavailable combination.');
      const paths = [recipe.a.ref.id, ...(recipe.b ? [recipe.b.ref.id] : [])].map(id => {
        const previous = ancestry.get(id)!;
        return previous.at(-1) === state.chapter ? previous : [...previous, state.chapter];
      });
      // Values are immutable: fitting an owner later cannot rewrite the history
      // of an earlier result made using that owner.
      ancestry.set(recipe.result.id, paths.reduce((a, b) => a.length >= b.length ? a : b));
      combinations++;
    }
    state = act(story, state, action);
    observe(state);
  }
  if (!state.completed) throw new Error('Reference replay did not complete the story.');
  // checkpoint(story, target) stops on the first entry at or after target.
  // A full checkpoint replay has exactly those same prefixes: count them once
  // instead of replaying every earlier chapter separately for each target.
  const checkpoints = story.chapters.map((_, requestedChapter) => {
    const chapter = [...entries.keys()].find(index => index >= requestedChapter) ?? state.chapter;
    return {requestedChapter, chapter, name: story.chapters[chapter].name, items: entries.get(chapter) ?? 0};
  });
  return {
    completed: state.completed, visitedChapters: state.visited, checkpoints, combinations,
    items: [...ancestry].map(([id, chapterPath]) => ({id, chapters: chapterPath.length, chapterPath})),
  };
}
