import type {Hotspot, Ingredient, Recipe, Story} from '../story/types.ts';
import type {State, Token} from './types.ts';

/** Declarations describe potential fixed states, including not-yet-built results. */
export function activeHotspots(story: Story, chapter: number): string[] {
  const c = story.chapters[chapter];
  return !c ? [] : c.image || !chapter ? [...new Set(c.hotspots)] : activeHotspots(story, chapter - 1);
}

export function hotspotDefinition(story: Story, chapter: number, id: string): Hotspot {
  const c = story.chapters[chapter];
  if (c && !c.image && chapter > 0) return hotspotDefinition(story, chapter - 1, id);
  return c?.hotspotDefinitions?.[id] ?? story.hotspots[id];
}

export function isFixed(story: Story, token: Token | undefined): boolean {
  return !!token && activeHotspots(story, token.chapter).includes(token.id);
}

export function presentHotspots(story: Story, state: State, chapter: number): string[] {
  return activeHotspots(story, chapter).filter(id => {
    const token = state.tokens[id];
    return token?.status === 'available' && token.chapter === chapter;
  });
}

export function fixedCentre(story: Story, token: Token): {x: number; y: number} {
  if (token.fixedPosition) return token.fixedPosition;
  const h = hotspotDefinition(story, token.chapter, token.id);
  const index = activeHotspots(story, token.chapter).indexOf(token.id);
  return {x: h.x ?? .19 + index % 3 * .31, y: h.y ?? .70 + Math.floor(index / 3) * .13};
}

export function recipeIngredients(recipe: Recipe): Ingredient[] {
  return [recipe.a, ...(recipe.b ? [recipe.b] : []), ...(recipe.at ? [recipe.at] : [])];
}
