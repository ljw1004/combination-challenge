import {existsSync} from 'node:fs';
import {dirname, resolve, join} from 'node:path';

export function repoRoot(start) {
  let candidate = resolve(start);
  while (true) {
    if (existsSync(join(candidate, 'package.json')) && existsSync(join(candidate, 'src/story/parser.ts'))) return candidate;
    const parent = dirname(candidate);
    if (parent === candidate) throw new Error(`Cannot locate repository above ${start}`);
    candidate = parent;
  }
}

export function storyPath(production) {
  const root = repoRoot(production);
  for (const candidate of [join(root, 'stories/creation/creation.md'), resolve(production, '../creation.md')]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('Creation manuscript missing from stories/creation and the adjacent study');
}
