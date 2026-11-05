import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, join} from 'node:path';
import {repoRoot, storyPath as locateStory} from './production-paths.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = repoRoot(here);
const {parseStory} = await import(pathToFileURL(join(root, 'src/story/parser.ts')).href);

const cataloguePath = new URL('./visual-catalogue.json', import.meta.url);
const storyPath = locateStory(here);
const catalogue = JSON.parse(readFileSync(cataloguePath, 'utf8'));
const manuscript = readFileSync(storyPath, 'utf8');
const story = parseStory(manuscript, {file: storyPath});
const entries = catalogue.entries;
const names = new Set(Object.values(story.items).map(item => item.name));
const byName = new Map(entries.map(entry => [entry.name, entry]));
const chapterRef = chapter => ({id: chapter.id.replace('id:', ''), name: chapter.name});
const recipeRecord = recipe => {
  const chapter = story.chapters.findLast(item => item.source.line <= recipe.source.line);
  return {
    id: recipe.id,
    chapter: chapterRef(chapter),
    ingredients: [recipe.a, ...(recipe.b ? [recipe.b] : [])].map(ingredient => ({
      name: story.items[ingredient.ref.id].name,
      fate: ingredient.fate,
    })),
    ...(recipe.at ? {at: story.items[recipe.at.ref.id].name, atFate: recipe.at.fate} : {}),
    result: story.items[recipe.result.id].name,
  };
};
const recipes = story.recipes.map(recipeRecord);
const withoutLine = ({line: _line, ...recipe}) => recipe;
assert.equal(entries.length, 206, 'Catalogue must contain the 206 authored identities.');
assert.equal(names.size, entries.length, 'Manuscript identity count has changed.');
assert.equal(byName.size, entries.length, 'Duplicate catalogue names.');
assert.equal(new Set(entries.map(entry => entry.slug)).size, entries.length, 'Duplicate slugs.');
assert.deepEqual(new Set(byName.keys()), names, 'Catalogue names must exactly match the parser.');
assert.equal(catalogue.source.combinationCount, recipes.length);
assert.equal(catalogue.source.chapterCount, story.chapters.length);

for (const item of Object.values(story.items)) {
  const entry = byName.get(item.name);
  const label = `${item.name}: `;
  assert.equal(entry.identity, item.id, label + 'identity differs.');
  assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, label + 'invalid slug.');
  assert.ok(entry.visualSubject.length >= 70, label + 'subject is missing or too thin.');
  assert.ok(entry.distinction.length >= 35, label + 'distinction is missing or too thin.');
  assert.ok(entry.confusingNeighbors.length > 0, label + 'neighbors are missing.');
  for (const neighbor of entry.confusingNeighbors) {
    assert.ok(names.has(neighbor) && neighbor !== item.name, label + 'invalid neighbor ' + neighbor);
  }
  assert.ok(['exact', 'family', 'context-assisted'].includes(entry.recognition.expectation), label + 'recognition expectation missing.');
  assert.ok(entry.recognition.acceptableBlindMatches.length > 0, label + 'blind match criteria missing.');
  assert.ok(entry.recognition.acceptableBlindMatches.every(match => typeof match === 'string' && match.trim()), label + 'invalid blind match.');
  if (entry.recognition.expectation === 'context-assisted') {
    assert.equal(entry.recognition.contextAssistedTarget, item.name, label + 'context target differs.');
  }
  const declared = story.chapters.filter(chapter => chapter.items.some(ref => ref.id === item.id));
  const fixed = story.chapters.filter(chapter => chapter.hotspots.includes(item.id));
  const creating = recipes.filter(recipe => recipe.result === item.name);
  const using = recipes.filter(recipe => recipe.ingredients.some(ingredient => ingredient.name === item.name) || recipe.at === item.name);
  assert.deepEqual(entry.declaredIn, declared.map(chapterRef), label + 'declaration chapters differ.');
  assert.deepEqual(entry.fixedIn, fixed.map(chapterRef), label + 'fixed chapters differ.');
  assert.deepEqual(entry.creatingCombinations.map(withoutLine), creating, label + 'creating combinations differ.');
  assert.deepEqual(entry.usingCombinations.map(withoutLine), using, label + 'using combinations differ.');
  const relevantIds = new Set([...declared, ...fixed].map(chapter => chapter.id.replace('id:', '')).concat([...creating, ...using].map(recipe => recipe.chapter.id)));
  assert.deepEqual(entry.chapterContexts, story.chapters.filter(chapter => relevantIds.has(chapter.id.replace('id:', ''))).map(chapterRef), label + 'chapter contexts differ.');
}
for (const [index, chapter] of story.chapters.entries()) {
  assert.deepEqual(catalogue.chapters[index], {
    ...chapterRef(chapter),
    intro: chapter.intro,
    declaredIdentities: chapter.items.map(ref => story.items[ref.id].name),
    fixedIdentities: chapter.hotspots.map(id => story.items[id].name),
  }, `Chapter context differs for ${chapter.name}.`);
}
const sourceUnchanged = catalogue.source.sha256 === createHash('sha256').update(manuscript).digest('hex');
console.log(JSON.stringify({
  result: 'pass',
  manuscript: storyPath,
  identities: entries.length,
  combinations: recipes.length,
  playableChapters: story.chapters.filter(chapter => chapter.items.length || chapter.goals.length).length,
  endingChapters: story.chapters.filter(chapter => !chapter.items.length && !chapter.goals.length).length,
  recognition: entries.reduce((counts, entry) => {
    const expectation = entry.recognition.expectation;
    counts[expectation] = (counts[expectation] ?? 0) + 1;
    return counts;
  }, {}),
  sourceSnapshotMatches: sourceUnchanged,
  ...(sourceUnchanged ? {} : {note: 'The manuscript text differs from the source snapshot; names, combinations and chapter contexts still match. Recorded recipe line numbers belong to the snapshot.'}),
}, null, 2));
