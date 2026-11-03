import type {Chapter, ChapterReference, Story} from './types.ts';

/** Shared by parsing and the editor's lightweight chapter picker. */
export function chapterHeading(text: string): {name: string; id?: string; valid: boolean} {
  const heading = text.trim();
  if (!heading.startsWith('`')) return {name: heading, valid: !!heading};
  const match = /^`([^`]+)`\s+(.+)$/.exec(heading);
  return match && match[1].trim()
    ? {id: `id:${match[1]}`, name: match[2].trim(), valid: true}
    : {name: heading, valid: false};
}

export function matchingChapters(story: Story, reference: ChapterReference) {
  return story.chapters.filter(chapter => reference.kind === 'id'
    ? chapter.id === `id:${reference.value}` : chapter.name === reference.value);
}

export function chapterSymbolID(chapter: Chapter): string {
  return chapter.id.startsWith('id:') ? chapter.id : `chapter-name:${chapter.name}`;
}

/** Ambiguous and unresolved references have no effect in incomplete previews. */
export function chapterIndex(story: Story, reference: ChapterReference): number {
  const matches = matchingChapters(story, reference);
  return matches.length === 1 ? story.chapters.indexOf(matches[0]) : -1;
}
