import type {Ref, Story} from '../story/types.ts';
import type {Action, State} from '../engine/types.ts';
import {activeHotspots, background, chapterNeeds, indexStory} from '../engine/analysis.ts';
import {availableTokens, chapterComplete, legalActions, recipeFor} from '../engine/game.ts';
import {hotspotIconVariants, hotspotPresentation, itemPresentation} from '../engine/presentation.ts';
import {markdown} from './markdown.ts';
import {hotspotDefinition, presentHotspots} from '../engine/fixed-items.ts';

function itemImages(story: Story, chapter: number, ref: Ref): string[] {
  const item = story.items[ref.id];
  return [itemPresentation(story, chapter, ref.id).icon?.url, ...(item?.slots.filter(slot => ref.slots.includes(slot.accepts)).map(slot => slot.icon?.url) ?? [])].filter((url): url is string => !!url);
}
function readingImages(text: string): string[] {
  const paths: string[] = [];
  markdown(text, path => { paths.push(path); return path; });
  return paths;
}
function sceneImages(story: Story, chapter: number, state: State, declared = false): string[] {
  const ids = declared ? activeHotspots(story,chapter) : presentHotspots(story,state,chapter);
  return [background(story, chapter), ...ids.map(id => hotspotPresentation(story,state,chapter,id).icon?.url)].filter((url): url is string => !!url);
}

export function coverArtwork(story: Story): string[] {
  const cover = story.cover ?? background(story, 0);
  return cover ? [cover] : [];
}

/** Only the chapter being laid out and the reading about to appear can block entry. */
export function currentArtwork(story: Story, state: State): string[] {
  return [...sceneImages(story, state.chapter, state),
    ...availableTokens(state).filter(token => token.chapter === state.chapter).flatMap(token => itemImages(story, state.chapter, token)),
    ...readingImages(state.pending[0]?.markdown ?? '')];
}

/** A discovery or newly supplied primitive can change an earlier board too. */
export function changedHotspotArtwork(story: Story, before: State, after: State): string[] {
  return after.visited.flatMap(chapter => presentHotspots(story,after,chapter).flatMap(id => {
    const previous = hotspotPresentation(story,before,chapter,id).icon?.url, next = hotspotPresentation(story,after,chapter,id).icon?.url;
    return next && next !== previous ? [next] : [];
  }));
}

export function lookaheadArtwork(story: Story, state: State, started: boolean): string[] {
  if (!started) return currentArtwork(story, state);
  const paths = legalActions(story, state).flatMap(action => resultArtwork(story, state, action));
  let chapter = state.chapter + 1;
  while (chapter < story.chapters.length && story.chapters[chapter].goals.length && chapterComplete(story, state, chapter)) chapter++;
  if (chapter < story.chapters.length) {
    const primitives = indexStory(story).primitives;
    const arriving = {...state, chapter, tokens: {...state.tokens}};
    for (const id of chapterNeeds(story, state, chapter)) {
      if (primitives.has(id) && !state.tokens[id] && !state.excluded.includes(id)) {
        paths.push(...itemImages(story, chapter, {id, slots: []}));
        arriving.tokens[id] = {id, slots: [], chapter, status: 'available', x: 0, y: 0};
      }
      const token = state.tokens[id];
      if (token?.status === 'available' && itemPresentation(story, chapter, id).icon?.url !== itemPresentation(story, state.chapter, id).icon?.url) paths.push(...itemImages(story, chapter, token));
    }
    paths.push(...sceneImages(story, chapter, arriving, true), ...readingImages(story.chapters[chapter].intro));
  }
  return paths;
}

export function resultArtwork(story: Story, state: State, action: Action): string[] {
  if (action.type !== 'combine') return [];
  const recipe = recipeFor(story, state, action);
  if (!recipe) return [];
  const ref = {id: recipe.result.id, slots: [...recipe.result.slots,
    ...(recipe.installation ? state.tokens[recipe.result.id]?.slots ?? [] : [])]};
  const receivingChapter=state.tokens[action.b??action.hotspot??action.a].chapter;
  // Project only creation/fitting for artwork. No cleanup or continuation search is needed.
  const after = {...state, tokens: {...state.tokens, [ref.id]: {
    ...(recipe.installation ? state.tokens[ref.id] : {chapter: receivingChapter, x: 0, y: 0}), ...ref, status: 'available' as const,
  }}};
  const fixedIcon=activeHotspots(story,receivingChapter).includes(ref.id)?hotspotPresentation(story,after,receivingChapter,ref.id).icon?.url:undefined;
  const changed = changedHotspotArtwork(story,state,after);
  return [...changed, ...(fixedIcon?[fixedIcon]:[]), ...itemImages(story, state.chapter, ref), ...story.items[ref.id].wonders
    .filter(wonder => wonder.requires.every(slot => ref.slots.includes(slot)) && !state.seen.includes(`wonder:${ref.id}:${wonder.source.line}`))
    .flatMap(wonder => readingImages(wonder.markdown))];
}

/** Restored scrollback sizes are filled in after the current chapter is usable. */
export function scrollbackArtwork(story: Story, state: State): string[] {
  return [...state.visited.filter(chapter => chapter !== state.chapter).flatMap(chapter => sceneImages(story, chapter, state)),
    ...availableTokens(state).filter(token => token.chapter !== state.chapter).flatMap(token => itemImages(story, state.chapter, token))];
}

/** Geometry lint only needs declared placement surfaces, and runs when the editor is open. */
export function placementArtwork(story: Story): string[] {
  return story.chapters.flatMap((c, chapter) => c.hotspots.flatMap(id => {
    const h = hotspotDefinition(story,chapter,id);
    return h.placements?.length ? [background(story,chapter), ...hotspotIconVariants(story,chapter,id).map(icon => icon?.url)].filter((url):url is string=>!!url) : [];
  }));
}
