import type {Story} from '../story/types.ts';
import type {State, Action} from './types.ts';
import {recipeFor} from './game.ts';

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
