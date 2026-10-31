import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, basename, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { parseStory } from './parser.ts';
export const storyRoot = resolve(import.meta.dirname, '../../stories');
/** Manuscripts, including those sharing a directory, are identified by their file paths. */
export function storyIds(root = storyRoot): string[] {
  return readdirSync(root, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile() && /\.md$/i.test(entry.name))
    .map(entry => relative(root, join(entry.parentPath, entry.name)).replaceAll('\\', '/')).sort();
}
export function loadStory(id: string, root = storyRoot) {
  const paths = storyIds(root);
  const matches = paths.includes(id) ? [id] : paths.filter(path => basename(path).replace(/\.md$/i, '') === id);
  if (!matches.length) throw new Error(`Unknown story ${id}. Choose ${paths.join(', ')}.`);
  if (matches.length > 1) throw new Error(`Ambiguous story ${id}. Choose ${matches.join(', ')}.`);
  const path = matches[0], file = join(root, path), markdown = readFileSync(file, 'utf8');
  return { story: parseStory(markdown, { id, file: relative(process.cwd(), file) }), path, hash: createHash('sha256').update(markdown).digest('hex'), markdown };
}
