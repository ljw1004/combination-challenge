import {existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import type {Diagnostic, Story} from '../story/types.ts';
import {sourceMap} from '../story/source-map.ts';

/** Filesystem checks belong to CLI lint; browser diagnostics never fetch artwork. */
export function lintStoryImages(story: Story, markdown: string): Diagnostic[] {
  const items = Object.values(story.items);
  const prose = [...story.chapters.flatMap(chapter => [chapter.intro, chapter.skipped]), ...items.flatMap(item => item.wonders.map(wonder => wonder.markdown))];
  const images = new Set([
    ...story.chapters.flatMap(chapter => chapter.image ? [chapter.image] : []),
    ...prose.flatMap(text => [...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1])),
    ...items.flatMap(item => [item.icon, ...item.slots.map(slot => slot.icon)].flatMap(icon => icon ? [icon.url] : [])),
  ]);
  const locations = sourceMap(markdown, story.source.file), diagnostics: Diagnostic[] = [];
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const image = match[1].trim();
    if (!images.has(image) || /^https?:\/\//i.test(image) || existsSync(resolve(dirname(story.source.file), image))) continue;
    const from = match.index! + match[0].indexOf('](') + 2 + match[1].length - match[1].trimStart().length;
    const source = locations.range(from, from + image.length);
    diagnostics.push({severity: 'error', code: 'missing-image', message: `Image not found: ${image}`, source, span: source.span!, stage: 'fast'});
  }
  return diagnostics;
}
