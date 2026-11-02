import type {Story} from '../story/types.ts';
import type {Action, State} from '../engine/types.ts';
import {act, newGame, recipeFor} from '../engine/game.ts';
import {checkpoint} from '../debug/checkpoint.ts';

export interface ChapterMeasurement {index: number; name: string; newPrimitives: number; combinations: number; peakBoard: number}
export interface ItemPersistence {id: string; chapters: number; chapterPath: number[]}
export interface RouteMeasurement {
  completed: boolean;
  visitedChapters: number[];
  chapters: ChapterMeasurement[];
  items: ItemPersistence[];
  combinations: number;
}

/** Count distinct combination chapters along one causal path, not elapsed span
 * or the union of unrelated branches. Paths use progression time, not placement.
 */
export function measureRoute(story: Story, actions: readonly Action[] = checkpoint(story, story.chapters.length).actions): RouteMeasurement {
  let state = newGame(story), combinations = 0;
  const chapters = new Map<number, ChapterMeasurement>(), ancestry = new Map<string, number[]>();
  function observe(current: State) {
    for (const token of Object.values(current.tokens)) if (!ancestry.has(token.id)) ancestry.set(token.id, []);
    const terminal = current.chapter === story.chapters.length - 1 && !story.chapters[current.chapter]?.goals.length;
    if (terminal || !story.chapters[current.chapter]) return;
    let chapter = chapters.get(current.chapter);
    if (!chapter) {
      chapter = {index: current.chapter, name: story.chapters[current.chapter].name, newPrimitives: current.newItems.length, combinations: 0, peakBoard: 0};
      chapters.set(current.chapter, chapter);
    }
    chapter.peakBoard = Math.max(chapter.peakBoard, Object.values(current.tokens).filter(t => t.status === 'available' && t.chapter === current.chapter).length);
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
      const chapter = chapters.get(state.chapter);
      if (chapter) chapter.combinations++;
    }
    state = act(story, state, action);
    observe(state);
  }
  if (!state.completed) throw new Error('Reference replay did not complete the story.');
  return {
    completed: state.completed, visitedChapters: state.visited, chapters: [...chapters.values()], combinations,
    items: [...ancestry].map(([id, chapterPath]) => ({id, chapters: chapterPath.length, chapterPath})),
  };
}
