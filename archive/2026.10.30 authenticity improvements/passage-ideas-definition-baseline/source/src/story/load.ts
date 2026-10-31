import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { parseStory } from './parser.ts';
export const storyRoot = resolve(import.meta.dirname, '../../stories');
export function storyIds(): string[] { return readdirSync(storyRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort(); }
export function loadStory(id: string) {
  if (!storyIds().includes(id)) throw new Error(`Unknown story ${id}. Choose ${storyIds().join(', ')}.`);
  const file = join(storyRoot, id, 'story.md'), markdown = readFileSync(file, 'utf8');
  return { story: parseStory(markdown, { id, file: `stories/${id}/story.md` }), hash: createHash('sha256').update(markdown).digest('hex'), markdown };
}
