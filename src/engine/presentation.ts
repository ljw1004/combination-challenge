import type {Hotspot, Icon, Ref, Story} from '../story/types.ts';
import type {State} from './types.ts';
import {chapterIndex} from '../story/chapters.ts';
import {hotspotDefinition} from './fixed-items.ts';

/** Names and icons advance independently, by story order rather than declaration order. */
export function itemPresentation(story: Story, chapter: number, id: string): {name: string; icon?: Icon} {
  const item = story.items[id];
  if (!item) return {name: story.hotspots[id]?.name ?? id};
  let name = item.name, icon = item.icon, nameChapter = -1, iconChapter = -1;
  for (const change of item.presentations) {
    const index = chapterIndex(story, change.chapter);
    if (index < 0 || index > chapter) continue;
    if (change.name !== undefined && index > nameChapter) { name = change.name; nameChapter = index; }
    if (change.icon && index > iconChapter) { icon = change.icon; iconChapter = index; }
  }
  return {name, icon};
}

/** Token records and their fitted contents survive consumption and transformation. */
export function hasCreated(state: Pick<State, 'tokens'>, ref: Ref): boolean {
  const token = state.tokens[ref.id];
  return !!token && ref.slots.every(id => token.slots.includes(id)) ||
    !ref.slots.length && Object.values(state.tokens).some(owner => owner.slots.includes(ref.id));
}

/** Scene-local icon choices use manuscript order, not the order of discoveries. */
export function hotspotPresentation(story: Story, state: Pick<State, 'chapter' | 'tokens'>, chapter: number, id: string): Hotspot {
  const definition = hotspotDefinition(story, chapter, id), item = itemPresentation(story, state.chapter, id);
  let icon = definition.icon ?? item.icon;
  for (const change of definition.iconChanges ?? []) if (hasCreated(state, change.after)) icon = change.icon;
  return {...definition, name: item.name, icon, ...(state.tokens[id]?.fixedPosition ?? {})};
}

/** Conservative artwork variants for geometry validation; no playthrough search. */
export function hotspotIconVariants(story: Story, chapter: number, id: string): (Icon | undefined)[] {
  const definition = hotspotDefinition(story, chapter, id);
  const icons = [definition.icon ?? itemPresentation(story, chapter, id).icon,
    ...(!definition.icon ? story.chapters.slice(chapter + 1).map((_, offset) => itemPresentation(story, chapter + offset + 1, id).icon) : []),
    ...(definition.iconChanges ?? []).map(change => change.icon)];
  return [...new Map(icons.map(icon => [JSON.stringify(icon && [icon.url, icon.circular]), icon])).values()];
}
