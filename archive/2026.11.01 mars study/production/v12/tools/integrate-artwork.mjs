import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../../../../../src/story/parser.ts';
import {identityAliases, artworkId, assertSameStory} from './story-semantics.mjs';
import {options, loadArtwork, root} from './artwork-manifests.mjs';

const parse = text => parseStory(text);
const imageUrl = line => /!\[[^\]]*\]\(([^)]+)\)/.exec(line)?.[1];
const image = (name, asset) => `![${name.replaceAll('[', '').replaceAll(']', '')}](${asset})`;

function identifyCrops(text) {
  const story = parse(text), changes = new Map();
  for (const reference of story.sourceReferences) {
    const id = identityAliases[reference.id];
    if (!id || reference.implicit || reference.kind !== 'item') continue;
    assert(!story.items[id], `Cannot alias ${reference.id}: ${id} already exists.`);
    const {from, to} = reference.source.span;
    const replacement = `\`${id.slice(3)}\`${reference.declaration ? ` ${story.items[reference.id].name}` : ''}`;
    changes.set(`${from}:${to}`, {from, to, replacement});
  }
  let previous = text.length;
  for (const change of [...changes.values()].sort((a, b) => b.from - a.from)) {
    assert(change.to <= previous, 'Overlapping parsed identity references.');
    text = text.slice(0, change.from) + change.replacement + text.slice(change.to);
    previous = change.from;
  }
  return text;
}

function topLevelItems(text, story) {
  const refs = new Map();
  for (const reference of story.sourceReferences) if (reference.kind === 'item' && reference.role === 'declaration' && reference.declaration && !reference.implicit) {
    const list = refs.get(reference.source.line) ?? [];
    list.push(reference); refs.set(reference.source.line, list);
  }
  const found = new Map(); let section = '';
  text.split('\n').forEach((line, index) => {
    if (line.startsWith('## ')) section = '';
    if (/^\*\*\w+\*\*$/.test(line)) section = line;
    if (section !== '**Items**' || !line.startsWith('- ')) return;
    const declarations = refs.get(index + 1) ?? [];
    // The item's own reference starts immediately after the bullet. Nested
    // exclusions/slots have later source columns and are never icon owners.
    const owner = declarations.sort((a, b) => a.source.span.from - b.source.span.from)[0];
    if (owner) found.set(index + 1, owner.id);
  });
  return found;
}

function supplyIconDeclarations(text) {
  const story = parse(text), present = new Set(topLevelItems(text, story).values());
  const derived = new Set(story.recipes.filter(recipe => !recipe.installation).map(recipe => recipe.result.id));
  const additions = new Map();
  for (const item of Object.values(story.items)) if (!present.has(item.id)) {
    assert(derived.has(item.id), `No top-level icon declaration for primitive ${item.name}; refuse to invent its supply chapter.`);
    const chapter = story.chapters.findLastIndex(value => value.source.line <= item.source.line);
    assert(chapter >= 0, `No declaration chapter for ${item.name}`);
    const list = additions.get(chapter) ?? [];
    list.push(`- ${item.id.startsWith('id:') ? `\`${item.id.slice(3)}\` ` : ''}${item.name}`);
    additions.set(chapter, list);
  }
  const lines = text.split('\n');
  for (const [index, entries] of [...additions].sort((a, b) => b[0] - a[0])) {
    const start = story.chapters[index].source.line, end = story.chapters[index + 1]?.source.line - 1 || lines.length;
    const itemHeading = lines.findIndex((line, position) => position >= start && position < end && line === '**Items**');
    let insertion = end;
    if (itemHeading >= 0) {
      const next = lines.findIndex((line, position) => position > itemHeading && position < end && /^\*\*\w+\*\*$/.test(line));
      if (next >= 0) insertion = next;
    } else {
      const combinations = lines.findIndex((line, position) => position >= start && position < end && line === '**Combinations**');
      if (combinations >= 0) insertion = combinations;
    }
    lines.splice(insertion, 0, ...(itemHeading < 0 ? ['**Items**'] : []), ...entries.flatMap(entry => [entry, '']), '');
  }
  return lines.join('\n');
}

export function integrate(original, artwork) {
  const before = parse(original);
  let text = identifyCrops(original).split('\n').flatMap(line => {
    if (/^  > NOTE: Mars v12 artwork target:/.test(line)) return [];
    if (/^  - (?:icon:|from chapter .+ icon:)/.test(line) && artwork.paths.has(imageUrl(line))) return [];
    if (/^  - (?:unnamed )?slot:/.test(line) && artwork.paths.has(imageUrl(line))) line = line.replace(/, icon: !\[[^\]]*\]\([^)]+\)(?: \(circular\))?$/, '');
    return [line];
  }).join('\n');
  text = supplyIconDeclarations(text);
  const story = parse(text), itemLines = topLevelItems(text, story);
  assert.equal(artwork.sceneManifest.scenes.length, story.chapters.length, 'Every chapter needs a scene registration.');
  assert.deepEqual([...artwork.items.keys()].sort(), Object.keys(story.items).sort(), 'Catalogue must cover exactly the manuscript identities.');
  const sceneByChapter = new Map();
  for (const scene of artwork.sceneManifest.scenes) {
    assert(!sceneByChapter.has(scene.chapterIndex), `Duplicate scene chapter ${scene.chapterIndex}`);
    assert.equal(story.chapters[scene.chapterIndex]?.name, scene.name, 'Scene chapter index/title disagree.');
    assert.deepEqual((scene.hotspots ?? []).map(value => value.id).sort(), [...story.chapters[scene.chapterIndex].hotspots].sort(), `Hotspot coverage differs in ${scene.name}`);
    sceneByChapter.set(scene.chapterIndex, scene);
  }
  const hotspotLines = new Map(story.sourceReferences.filter(value => value.kind === 'hotspot' && value.declaration).map(value => [value.source.line, value.id]));
  const seen = new Set(), output = [];
  let chapter = -1, section = '', owner, slotIndex = 0, background = false;
  text.split('\n').forEach((raw, index) => {
    let line = raw;
    if (line.startsWith('## ')) { chapter++; section = ''; owner = undefined; background = false; }
    if (/^\*\*\w+\*\*$/.test(line)) section = line;
    const scene = sceneByChapter.get(chapter);
    if (scene && !section && !background && line.startsWith('![')) {
      line = image(scene.name, scene.background); background = true;
    }
    if (section === '**Hotspots**' && hotspotLines.has(index + 1)) {
      const id = hotspotLines.get(index + 1), hotspot = scene.hotspots.find(value => value.id === id);
      assert(hotspot, `Unregistered hotspot ${id}`);
      line = line.replace(/ \(at [^)]+\)$/, '') + ` (at ${hotspot.x}%, ${hotspot.y}%)`;
      output.push(line, `  - icon: ${image(hotspot.name, hotspot.icon)}${hotspot.circular ? ' (circular)' : ''}`,
        `  > NOTE: Mars v12 artwork target: ${hotspot.feature} Centre ${hotspot.x}%, ${hotspot.y}%; transparent hit area ${hotspot.width} × ${hotspot.height}px at 390 × 844.`);
      return;
    }
    if (section === '**Items**' && itemLines.has(index + 1)) {
      owner = itemLines.get(index + 1); slotIndex = 0;
      if (!seen.has(owner)) {
        const item = artwork.items.get(owner);
        output.push(line, `  - icon: ${image(item.name, item.asset)}`);
        for (const variant of artwork.variants.filter(value => artworkId(value.owner) === owner)) {
          assert(owner.startsWith('id:'), `Appearance changes require an explicit ID: ${owner}`);
          assert(!variant.fromChapter.includes('"'), 'Quote-bearing chapter titles need explicit chapter identifiers.');
          output.push(`  - from chapter "${variant.fromChapter}" icon: ${image(variant.name, variant.asset)}`);
        }
        seen.add(owner); return;
      }
    }
    if (/^  - (?:unnamed )?slot:/.test(line)) {
      const slot = story.items[owner]?.slots[slotIndex++];
      assert(slot, `No parsed slot owner at line ${index + 1}`);
      const asset = artwork.slots.get(`${owner}\0${slot.accepts}`);
      assert(asset, `Missing fitted artwork: ${owner} / ${slot.accepts}`);
      line += `, icon: ${image(`fitted ${story.items[slot.accepts].name}`, asset)}`;
    }
    output.push(line);
  });
  assert.equal(seen.size, artwork.items.size, 'Not every item received an icon.');
  const revised = output.join('\n'), after = parse(revised);
  assert.equal(after.diagnostics.filter(value => value.severity === 'error').length, 0, 'Generated manuscript has parser errors.');
  for (const scene of artwork.sceneManifest.scenes) assert.equal(after.chapters[scene.chapterIndex].image, scene.background, `No replaceable background in ${scene.name}`);
  assertSameStory(after, before, {includeProse: true});
  return revised;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const config = options(undefined, ['dry-run']), artwork = loadArtwork(config);
    const original = fs.readFileSync(config.story, 'utf8'), revised = integrate(original, artwork);
    assertSameStory(parse(revised), parse(fs.readFileSync(config.baseline, 'utf8')));
    assert.equal(integrate(revised, artwork), revised, 'Integration is not idempotent.');
    if (!config['dry-run']) for (const asset of artwork.paths) assert(fs.existsSync(path.resolve(path.dirname(config.story), asset)), `Missing artwork: ${asset}`);
    const destination = config['dry-run'] ? config.output ?? path.join(root, 'runs/mars-v12-artwork/integrated-preview.md') : config.story;
    if (config['dry-run']) assert(destination !== config.story && destination !== config.baseline, 'Dry run cannot overwrite a manuscript.');
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, revised);
    console.log(`${config['dry-run'] ? 'Prepared dry run' : 'Integrated artwork'}: ${artwork.items.size} icons, ${artwork.variants.length} appearances, ${artwork.slots.size} fitted layers and ${artwork.sceneManifest.scenes.length} chapters. Prose unchanged; gameplay matches v11 through the two documented crop-ID aliases.\n${path.relative(root, destination)}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
