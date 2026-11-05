import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve, dirname} from 'node:path';
import {repoRoot, storyPath} from './production-paths.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = repoRoot(here);
const {parseStory} = await import(pathToFileURL(resolve(root, 'src/story/parser.ts')).href);
const manuscriptPath = storyPath(here);
if (process.argv.length !== 3 || process.argv[2].startsWith('--')) {
  throw new Error('Usage: node verify-art-integration.mjs PATH_TO_PRE_ART_BASELINE.md (disposable baseline must be supplied explicitly)');
}
const baselinePath = resolve(process.argv[2]);
const baseline = readFileSync(baselinePath, 'utf8');
const manuscript = readFileSync(manuscriptPath, 'utf8');
const snapshot = 'c4ff6efebe2229d8e273d5109420a985b0c1b8d3540a5775f95cf0a78816a2c4';
assert.equal(createHash('sha256').update(baseline).digest('hex'), snapshot, 'Wrong baseline manuscript.');
const plan = JSON.parse(readFileSync(resolve(here, 'background-plan.json'), 'utf8'));
const catalogue = JSON.parse(readFileSync(resolve(here, 'visual-catalogue.json'), 'utf8'));
const before = parseStory(baseline, {id: 'creation'});
const after = parseStory(manuscript, {id: 'creation'});
const stripSource = value => {
  if (Array.isArray(value)) return value.map(stripSource);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== 'source' && key !== 'icon')
    .map(([key, child]) => [key, stripSource(child)]));
  return value;
};
const descriptionText = value => value.replace(/^!\[[^\]]*\]\([^\n]*\)\s*/gm, '').trim();
const semantics = story => ({
  title: story.title,
  description: descriptionText(story.description),
  items: Object.values(story.items).map(item => stripSource({
    id: item.id, name: item.name, compound: item.compound,
    exclusiveWith: item.exclusiveWith, slots: item.slots,
    wonders: item.wonders, presentations: item.presentations,
  })),
  hotspots: Object.values(story.hotspots).map(({id, name}) => ({id, name})),
  chapters: story.chapters.map(chapter => stripSource({
    id: chapter.id, name: chapter.name, intro: chapter.intro, skipped: chapter.skipped,
    hotspots: chapter.hotspots, items: chapter.items, goals: chapter.goals,
    goalOperator: chapter.goalOperator,
  })),
  recipes: story.recipes.map(stripSource),
  tutorials: story.tutorials?.map(stripSource),
  references: story.sourceReferences.map(({source: _source, ...reference}) => reference),
});
assert.deepEqual(semantics(after), semantics(before), 'Parsed gameplay or prose changed.');
// Also compare the authored text after removing only the introduced artwork and
// position syntax, and normalizing blank spacing around those insertions.
const proseAndRules = text => text
  .split('\n')
  .filter(line => !line.startsWith('background:') && !/^\s+- icon:/.test(line) && !line.startsWith('!['))
  .map(line => line.replace(/ \(at 50%, 20%\)$/, ''))
  .join('\n').replace(/\n{3,}/g, '\n\n').trim();
assert.equal(proseAndRules(manuscript), proseAndRules(baseline), 'Non-artwork manuscript text changed.');
assert.equal(after.chapters.length, 28);
assert.equal(after.cover, plan.cover.file);
assert.ok(after.description.includes(`assets/backgrounds/${plan.catalogueThumbnail.file}`));
const assetPaths = new Set([after.cover, `assets/backgrounds/${plan.catalogueThumbnail.file}`]);
let fixedAppearances = 0;
for (const entry of catalogue.entries) {
  const item = after.items[entry.identity];
  assert.equal(item.icon?.url, `assets/icons/${entry.slug}.webp`);
  assert.equal(item.icon.circular, true);
  assetPaths.add(item.icon.url);
}
for (const [index, chapter] of after.chapters.entries()) {
  assert.equal(chapter.image, plan.backgrounds[plan.chapterBackgrounds[index].background].file);
  assetPaths.add(chapter.image);
  for (const id of chapter.hotspots) {
    const definition = chapter.hotspotDefinitions?.[id];
    const entry = catalogue.entries.find(item => item.identity === id);
    assert.equal(definition?.icon?.url, `assets/icons/fixed-${entry.slug}.webp`);
    assert.equal(definition.icon.circular, true);
    assert.equal(definition.x, .5);
    assert.equal(definition.y, .2);
    assetPaths.add(definition.icon.url);
    fixedAppearances++;
  }
}
for (const path of assetPaths) assert.ok(existsSync(resolve(dirname(manuscriptPath), path)), `Missing artwork: ${path}`);
assert.equal(fixedAppearances, 17);
assert.ok(!manuscript.includes('assets/backgrounds/draft.svg'));
assert.equal(after.diagnostics.filter(diagnostic => diagnostic.severity === 'error').length, 0);
console.log(JSON.stringify({result: 'pass', manuscript: manuscriptPath, baselineSha256: snapshot,
  manuscriptSha256: createHash('sha256').update(manuscript).digest('hex'),
  identities: catalogue.entries.length, combinations: after.recipes.length,
  chapters: after.chapters.length, fixedAppearances, referencedAssets: assetPaths.size,
  semanticEquality: 'All parsed prose, identities, recipes, goals, supplies, references and tutorials unchanged.',
  presentationException: 'The ending now has its own background, intentionally clearing inherited fixed presentation.',
  scope: 'Structural artwork integration and equality with the supplied pre-art baseline; no recognition, visual-quality or browser-geometry verdict.',
}, null, 2));
