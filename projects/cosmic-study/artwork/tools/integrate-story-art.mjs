import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {parseStory} from '../../../../src/story/parser.ts';
import {lintStory} from '../../../../src/lint/lint.ts';
import {lintStoryImages} from '../../../../src/lint/images.ts';

const project = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const root = path.resolve(project, '../..');
const manuscript = path.join(project, 'galaxies.md');
const registrationFile = path.join(project, 'artwork/scene-registration.json');
const scratch = path.join(root, 'runs/cosmic-art-integration');
const originalSha256 = 'f2704f1286627903e2b2a1cc963b584d38e6d0a9f77354cae697f93bdbcfa5c2';
const assetBase = 'assets/lights-that-remain';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await readFile(file, 'utf8'));
const parse = markdown => parseStory(markdown, {id: 'cosmic', file: manuscript});
const bare = id => id.replace(/^id:/, '');
const withoutSources = value => JSON.parse(JSON.stringify(value, (key, child) => key === 'source' ? undefined : child));

// Keep names, prose, authored roles and logical structure; omit only artwork,
// artwork coordinates and source locations that move when metadata is added.
function semantics(story) {
  return withoutSources({
    title: story.title, description: story.description,
    items: Object.values(story.items).map(({id, name, compound, slots, wonders, exclusiveWith, presentations}) => ({
      id, name, compound, slots: slots.map(({icon, ...slot}) => slot), wonders, exclusiveWith,
      names: presentations.filter(change => change.name !== undefined).map(({icon, ...change}) => change),
    })),
    chapters: story.chapters.map(chapter => ({
      id: chapter.id, name: chapter.name, intro: chapter.intro, skipped: chapter.skipped,
      explicitBackground: Boolean(chapter.image), hotspots: chapter.hotspots, items: chapter.items,
      goals: chapter.goals, goalOperator: chapter.goalOperator,
      fixed: Object.values(chapter.hotspotDefinitions ?? {}).map(({id, name, placements}) => ({id, name, placements})),
    })),
    recipes: story.recipes, tutorials: story.tutorials,
    references: story.sourceReferences.filter(reference => reference.role !== 'appearance' && (reference.kind !== 'chapter' || reference.declaration)),
  });
}

const catalogue = await json(path.join(project, 'artwork/catalogue.json'));
const scenePlan = await json(path.join(project, 'artwork/background-scenes.json'));
const sceneForChapter = new Map(scenePlan.scenes.flatMap(scene => scene.chapters.map(chapter => [chapter, scene.id])));
for (const [chapter, scene] of [['a-ch1', 'first-crossing'], ['c-ch6', 'nuclear-entry'], ['c-ch8', 'nuclear-entry']]) sceneForChapter.set(chapter, scene);
const portable = new Set(catalogue.items.filter(item => item.defaultPortableIconRequired).map(item => item.id));
const variants = new Map(catalogue.items.filter(item => item.proposedPresentationVariants.length).map(item => [item.id, item.proposedPresentationVariants]));
const mode = process.argv[2] ?? '--check';
assert(['--stage', '--apply', '--check'].includes(mode), 'Use --stage, --apply or --check');
const original = await readFile(manuscript, 'utf8');
const before = parse(original);

function prepare() {
  assert.equal(sha(original), originalSha256, 'Integration requires the reviewed pre-art manuscript');
  const actualPortable = new Set(before.chapters.flatMap(chapter => chapter.items.filter(item => !chapter.hotspots.includes(item.id)).map(item => bare(item.id))));
  assert.deepEqual([...actualPortable].sort(), [...portable].sort(), 'Catalogue portable roles changed');
  const added = new Set();
  let chapter, section;
  let pendingIcons = [];
  const lines = original.split('\n').flatMap(line => {
    const prefix = line.trim() && !/^[ \t]/.test(line) ? pendingIcons : [];
    if (prefix.length) pendingIcons = [];
    const heading = line.match(/^## `([^`]+)`/);
    if (heading) { chapter = before.chapters.find(value => value.id === `id:${heading[1]}`); section = undefined; }
    const sectionHeading = line.match(/^\*\*(.+)\*\*$/);
    if (sectionHeading) section = sectionHeading[1];
    if (line.startsWith('background:')) {
      const scene = sceneForChapter.get(bare(chapter.id));
      assert(scene, `No scene selected for ${chapter.id}`);
      return [...prefix, `background: ![${scene.replaceAll('-', ' ')}](${assetBase}/backgrounds/${scene}.png)`];
    }
    const declaration = line.match(/^- `([^`]+)`/);
    if (declaration && section === 'Hotspots') {
      const id = declaration[1], index = chapter.hotspots.indexOf(`id:${id}`);
      assert(index >= 0 && chapter.hotspots.length <= 2);
      const x = chapter.hotspots.length === 1 ? 50 : index === 0 ? 25 : 75;
      return [...prefix, `${line} (at ${x}%, 40%)`, `  - icon: ![${before.items[`id:${id}`].name}](${assetBase}/hotspots/${id}.png)`];
    }
    if (declaration && section === 'Items' && portable.has(declaration[1]) && !added.has(declaration[1])) {
      const id = declaration[1];
      added.add(id);
      // Append after the existing description: four-space prose placed after
      // a two-space icon bullet would become that metadata bullet's prose.
      pendingIcons = [`  - icon: ![${before.items[`id:${id}`].name}](${assetBase}/icons/${id}.png) (circular)`,
        ...(variants.get(id) ?? []).map(variant => `  - from chapter \`${variant.fromChapter}\` icon: ![${before.items[`id:${id}`].name}](${assetBase}/icons/${id}--from-${variant.fromChapter}.png) (circular)`),
        '',
      ];
      return [...prefix, line];
    }
    return [...prefix, line.replace('Selected material-history game; backgrounds are temporary.', 'Selected material-history game.')];
  });
  assert.deepEqual([...added].sort(), [...portable].sort(), 'A portable declaration lacks an icon');
  const markdown = [...lines, ...pendingIcons].join('\n');
  assert.deepEqual(semantics(parse(markdown)), semantics(before), 'Artwork changed story semantics');
  return markdown;
}

const markdown = mode === '--check' ? original : prepare();
const story = parse(markdown);
const semanticSha256 = sha(JSON.stringify(semantics(story)));
const fast = lintStory(story, {analysis: false});
assert.deepEqual(fast.filter(diagnostic => diagnostic.severity === 'error'), [], 'Fast lint errors');

function registration() {
  let inherited;
  const chapters = story.chapters.map(chapter => {
    const background = chapter.image ?? inherited.background;
    const inheritsFrom = chapter.image ? null : inherited.chapter;
    const hotspots = chapter.image ? Object.values(chapter.hotspotDefinitions ?? {}) : inherited.hotspots;
    const result = {
      chapter: bare(chapter.id), background, inheritsFrom,
      hotspots: hotspots.map(hotspot => ({
        item: bare(hotspot.id), file: hotspot.icon.url, centrePercent: [hotspot.x * 100, hotspot.y * 100],
      })),
    };
    inherited = {background, chapter: bare(chapter.id), hotspots};
    return result;
  });
  return {
    schemaVersion: 1,
    status: 'Author integration geometry; full browser and independent artwork reviews are recorded separately.',
    manuscript: 'galaxies.md', preArtworkSha256: originalSha256, manuscriptSha256: sha(markdown), semanticSha256,
    semanticCheck: 'Shared-parser equality preserves titles, readings, names, goals, supplies, recipes, tutorial and fixed/portable roles; only artwork, source locations and artwork coordinates are omitted.',
    assetManifest: 'production/asset-manifest.json',
    transforms: 'Source bounds, source hashes and complete extraction transforms are owned by the linked asset manifest and extraction records. The receiver art field is centred vertically in the common transparent canvas.',
    referenceViewport: [390, 844], backgroundPixels: [780, 1688], portablePixels: [320, 320], portableDisplayPixels: [80, 80],
    commonReceiver: {
      circular: false, canvasPixels: [640, 672], displayPixels: [160, 168],
      artFieldPixels: [640, 480], artFieldOffsetPixels: [0, 96], displayArtFieldPixels: [160, 120],
    },
    cover: 'Implicit first-chapter background; no separate cover declaration.',
    visibility: 'Hotspot artwork does not supply or construct identities. Every fixed presentation preserves the existing derived-item visibility and retirement rules.',
    chapters,
  };
}

const expected = new Map();
for (const item of portable) expected.set(`${assetBase}/icons/${item}.png`, [320, 320]);
for (const [item, changes] of variants) for (const change of changes) expected.set(`${assetBase}/icons/${item}--from-${change.fromChapter}.png`, [320, 320]);
for (const item of Object.keys(story.hotspots)) expected.set(`${assetBase}/hotspots/${bare(item)}.png`, [640, 672]);
for (const scene of new Set(sceneForChapter.values())) expected.set(`${assetBase}/backgrounds/${scene}.png`, [780, 1688]);
assert.equal(expected.size, 179);
assert.equal(Object.values(story.items).filter(item => item.icon).length, 141);
assert.equal(Object.values(story.items).flatMap(item => item.presentations.filter(change => change.icon)).length, 4);
assert.equal(story.chapters.flatMap(chapter => Object.values(chapter.hotspotDefinitions ?? {})).length, 26);
const layout = registration();
assert.equal(layout.chapters.at(-1).inheritsFrom, 'c-ch10');

if (mode === '--stage') {
  await mkdir(scratch, {recursive: true});
  await writeFile(path.join(scratch, 'galaxies.md'), markdown);
  await writeFile(path.join(scratch, 'scene-registration.json'), `${JSON.stringify(layout, null, 2)}\n`);
  console.log(`Staged metadata only; canonical untouched. Semantic SHA-256 ${semanticSha256}; ${fast.length} fast warnings.`);
} else {
  const inventory = await json(path.join(project, 'artwork/production/asset-manifest.json'));
  assert.deepEqual([...expected.keys()].sort(), inventory.assets.map(asset => asset.file).sort(), 'Final asset inventory is incomplete or differs');
  assert.deepEqual(lintStoryImages(story, markdown), [], 'Image lint errors');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const asset of inventory.assets) {
      const bytes = await readFile(path.join(project, asset.file));
      assert.equal(sha(bytes), asset.sha256, `Changed asset: ${asset.file}`);
      const dimensions = await page.evaluate(async data => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      }, bytes.toString('base64'));
      assert.deepEqual(dimensions, expected.get(asset.file), `Wrong decoded dimensions: ${asset.file}`);
    }
  } finally { await browser.close(); }
  if (mode === '--apply') {
    assert.equal(await readFile(manuscript, 'utf8'), original, 'Manuscript changed during verification');
    await mkdir(scratch, {recursive: true});
    await writeFile(path.join(scratch, 'scene-registration.json'), `${JSON.stringify(layout, null, 2)}\n`);
    await writeFile(path.join(scratch, 'galaxies.md'), markdown);
    await rename(path.join(scratch, 'scene-registration.json'), registrationFile);
    await rename(path.join(scratch, 'galaxies.md'), manuscript);
  } else {
    const retained = await json(registrationFile);
    assert.equal(semanticSha256, retained.semanticSha256, 'Semantic structure differs from the integrated baseline');
    assert.deepEqual(layout, retained, 'Registration no longer matches the manuscript');
  }
  console.log(`${mode === '--apply' ? 'Applied' : 'Verified'} 141 defaults, 4 variants, 26 fixed presentations and 13 backgrounds; all 179 assets decoded and matched their hashes. ${fast.length} fast warnings. Manuscript SHA-256 ${sha(markdown)}`);
}
