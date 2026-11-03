import type {Ref, Story} from '../story/types.ts';
import type {Action, State} from '../engine/types.ts';
import {activeHotspots, background, chapterNeeds, indexStory} from '../engine/analysis.ts';
import {availableTokens, chapterComplete, legalActions, recipeFor} from '../engine/game.ts';
import {itemPresentation} from '../engine/presentation.ts';
import {markdown} from './markdown.ts';

function itemImages(story: Story, chapter: number, ref: Ref): string[] {
  const item = story.items[ref.id];
  return [itemPresentation(story, chapter, ref.id).icon?.url, ...(item?.slots.filter(slot => ref.slots.includes(slot.accepts)).map(slot => slot.icon?.url) ?? [])].filter((url): url is string => !!url);
}
function readingImages(text: string): string[] {
  const paths: string[] = [];
  markdown(text, path => { paths.push(path); return path; });
  return paths;
}
function sceneImages(story: Story, chapter: number): string[] {
  return [background(story, chapter), ...activeHotspots(story, chapter).map(id => story.hotspots[id].icon?.url)].filter((url): url is string => !!url);
}

export function coverArtwork(story: Story): string[] {
  const cover = story.cover ?? background(story, 0);
  return cover ? [cover] : [];
}

/** Only the chapter being laid out and the reading about to appear can block entry. */
export function currentArtwork(story: Story, state: State): string[] {
  return [...sceneImages(story, state.chapter),
    ...availableTokens(state).filter(token => token.chapter === state.chapter).flatMap(token => itemImages(story, state.chapter, token)),
    ...readingImages(state.pending[0]?.markdown ?? '')];
}

export function lookaheadArtwork(story: Story, state: State, started: boolean): string[] {
  if (!started) return currentArtwork(story, state);
  const paths = legalActions(story, state).flatMap(action => resultArtwork(story, state, action));
  let chapter = state.chapter + 1;
  while (chapter < story.chapters.length && story.chapters[chapter].goals.length && chapterComplete(story, state, chapter)) chapter++;
  if (chapter < story.chapters.length) {
    paths.push(...sceneImages(story, chapter), ...readingImages(story.chapters[chapter].intro));
    const primitives = indexStory(story).primitives;
    for (const id of chapterNeeds(story, state, chapter)) {
      if (primitives.has(id) && !state.tokens[id] && !state.excluded.includes(id)) paths.push(...itemImages(story, chapter, {id, slots: []}));
      const token = state.tokens[id];
      if (token?.status === 'available' && itemPresentation(story, chapter, id).icon?.url !== itemPresentation(story, state.chapter, id).icon?.url) paths.push(...itemImages(story, chapter, token));
    }
  }
  return paths;
}

export function resultArtwork(story: Story, state: State, action: Action): string[] {
  if (action.type !== 'combine') return [];
  const recipe = recipeFor(story, state, action);
  if (!recipe) return [];
  const ref = {id: recipe.result.id, slots: [...recipe.result.slots,
    ...(recipe.installation ? state.tokens[recipe.result.id]?.slots ?? [] : [])]};
  return [...itemImages(story, state.chapter, ref), ...story.items[ref.id].wonders
    .filter(wonder => wonder.requires.every(slot => ref.slots.includes(slot)) && !state.seen.includes(`wonder:${ref.id}:${wonder.source.line}`))
    .flatMap(wonder => readingImages(wonder.markdown))];
}

/** Restored scrollback sizes are filled in after the current chapter is usable. */
export function scrollbackArtwork(story: Story, state: State): string[] {
  return [...state.visited.filter(chapter => chapter !== state.chapter).flatMap(chapter => sceneImages(story, chapter)),
    ...availableTokens(state).filter(token => token.chapter !== state.chapter).flatMap(token => itemImages(story, state.chapter, token))];
}

/** Geometry lint only needs declared placement surfaces, and runs when the editor is open. */
export function placementArtwork(story: Story): string[] {
  return Object.values(story.hotspots).flatMap(hotspot => hotspot.placements?.length && hotspot.icon ? [hotspot.icon.url] : []);
}
