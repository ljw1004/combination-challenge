import type {Icon, Story} from '../story/types.ts';
import {chapterIndex} from '../story/chapters.ts';

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
