/**
 * Catalogue the current manuscript through the shared parser, including local
 * fixed appearances, scenes and recipes. Explicit semantic chapter IDs are used
 * when present; otherwise keys come from titles, never chapter ordinals.
 *
 * node .../catalogue.mjs --dry-run [--json]
 * node .../catalogue.mjs --write
 * Optional --story and --production paths have the same meaning as rename-reused.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {matchingChapters} from '../../../../../../src/story/chapters.ts';
import {chapterKey, collectArtwork, defaultStory, digest, itemKey, options, production,
  relativePath, writeAtomic} from './rename-reused.mjs';

const optionalJSON = filename => fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, 'utf8')) : undefined;
const reference = value => ({id: itemKey(value.id), slots: value.slots.map(itemKey)});
const ingredient = value => value && ({...reference(value.ref), fate: value.fate, explicitFate: value.explicit});
const icon = value => value && ({asset: value.url, circular: value.circular, ...(value.position ? {position: value.position} : {})});
const inputIds = recipe => [...new Set([recipe.a?.ref.id, recipe.b?.ref.id, recipe.at?.ref.id, recipe.hotspot].filter(Boolean))];

export function buildCatalogue(config = {story: defaultStory, production}) {
  const markdown = fs.readFileSync(config.story, 'utf8');
  const {story, references} = collectArtwork(markdown, config.story);
  const load = filename => optionalJSON(path.join(config.production, filename));
  // Only current survival briefs may supply descriptions. Old material briefs
  // contain superseded case/traction/excavator assumptions and are not inherited.
  const brief = load('subject-briefs.json') ?? {};
  const registration = load('registration.json');
  const reused = load('reused-assets.json');
  if (reused) {
    assert.equal(reused.schemaVersion, 1, 'Unsupported reuse provenance schema.');
    assert(Array.isArray(reused.assets), 'Expected reused-assets.assets array.');
  }
  const reuseByAsset = new Map((reused?.assets ?? []).map(entry => [entry.asset, entry]));
  const registeredScenes = registration?.scenes ?? [];
  const registeredPortables = registration?.portables ?? [];
  const declaredChapter = line => [...story.chapters].reverse().find(chapter => chapter.source.line <= line);
  const resolveChapter = ref => {
    const matches = matchingChapters(story, ref);
    assert.equal(matches.length, 1, `Unresolved chapter presentation: ${ref.value}`);
    return chapterKey(matches[0]);
  };
  const provenanceFor = asset => {
    const reuse = reuseByAsset.get(asset);
    if (reuse) return {kind: 'byte-identical reused artwork', source: reuse.source, sha256: reuse.sha256,
      mapping: 'reused-assets.json'};
    return {kind: asset?.startsWith('assets/survival/') ? 'survival runtime export' : 'preceding runtime artwork',
      ...(registration ? {registration: 'registration.json'} : {}),
      note: 'Runtime reference and provenance do not establish visual approval.'};
  };
  const registeredFor = id => ({
    scenes: registeredScenes.flatMap(scene => (scene.regions ?? []).filter(region => region.id === id || region.id === `id:${id}`)
      .map(region => ({chapter: scene.chapter, source: scene.source, cell: region.cell}))),
    portable: registeredPortables.find(portable => portable.id === id || portable.id === `id:${id}`),
  });
  const scenes = story.chapters.map(chapter => {
    const key = chapterKey(chapter);
    const registered = registeredScenes.filter(scene => scene.chapter === key || scene.chapter === chapter.id || scene.title === chapter.name);
    return {key, ...(chapter.id.startsWith('id:') ? {id: itemKey(chapter.id)} : {}), title: chapter.name,
      sourceLine: chapter.source.line, background: chapter.image,
      ...(brief.families?.[key] ? {depiction: brief.families[key]} : {}),
      ...(registered.length ? {registration: registered.map(scene => ({source: scene.source, sourceSize: scene.sourceSize}))} : {}),
      hotspots: chapter.hotspots.map(id => {
        const target = chapter.hotspotDefinitions?.[id] ?? story.hotspots[id];
        assert(target, `Missing fixed presentation: ${key}/${id}`);
        return {id: itemKey(id), name: story.items[id]?.name ?? target.name,
          ...(target.x === undefined ? {} : {x: target.x}), ...(target.y === undefined ? {} : {y: target.y}),
          ...icon(target.icon), placements: (target.placements ?? []).map(placement => ({...reference(placement.item), x: placement.x, y: placement.y}))};
      }),
      suppliesAndDeclarations: chapter.items.map(reference),
      goals: chapter.goals.map(goal => ({text: goal.text, next: goal.next, operator: goal.operator,
        conditions: goal.conditions.map(condition => ({...reference(condition.item), ...(condition.hotspot ? {at: itemKey(condition.hotspot)} : {})}))})),
      goalOperator: chapter.goalOperator};
  });
  const itemEntries = Object.values(story.items).map(item => {
    const id = itemKey(item.id), fixedIn = scenes.filter(scene => scene.hotspots.some(target => target.id === id)).map(scene => scene.key);
    const declaredIn = story.chapters.filter(chapter => chapter.items.some(value => value.id === item.id)).map(chapterKey);
    const source = registeredFor(id);
    const explicitBrief = brief.items?.[id];
    const readings = item.wonders.map(wonder => ({markdown: wonder.markdown, requires: wonder.requires.map(itemKey)}));
    return {id, parserIdentity: item.id, name: item.name, compound: item.compound,
      kind: fixedIn.length ? 'fixed scene object or state' : 'portable object, supply or sample',
      fixedIn, declaredIn, depiction: explicitBrief ?? (readings.map(reading => reading.markdown).join('\n\n') || item.name),
      ...icon(item.icon), readings,
      presentations: item.presentations.map(presentation => ({chapter: resolveChapter(presentation.chapter),
        ...(presentation.name === undefined ? {} : {name: presentation.name}), ...icon(presentation.icon)})),
      fixedPresentations: scenes.flatMap(scene => scene.hotspots.filter(target => target.id === id)
        .map(target => ({chapter: scene.key, ...target}))),
      createsFrom: story.recipes.filter(recipe => recipe.result.id === item.id && !recipe.installation).map(recipe => inputIds(recipe).map(itemKey)),
      usedBy: [...new Set(story.recipes.filter(recipe => inputIds(recipe).includes(item.id)).map(recipe => itemKey(recipe.result.id)))],
      slots: item.slots.map(slot => ({name: slot.name, accepts: itemKey(slot.accepts), ...icon(slot.icon)})),
      provenance: {...provenanceFor(item.icon?.url),
        ...(source.scenes.length ? {registeredScenes: source.scenes} : {}),
        ...(source.portable ? {portableSource: source.portable.source, displayLongEdge: source.portable.display} : {})}};
  });
  const recipes = story.recipes.map(recipe => ({
    id: recipe.id, chapter: chapterKey(declaredChapter(recipe.source.line)), sourceLine: recipe.source.line,
    a: ingredient(recipe.a), ...(recipe.b ? {b: ingredient(recipe.b)} : {}),
    ...(recipe.at ? {at: ingredient(recipe.at)} : recipe.hotspot ? {at: {id: itemKey(recipe.hotspot), fate: 'preserve'}} : {}),
    result: reference(recipe.result), ...(recipe.installation ? {installation: itemKey(recipe.installation)} : {})}));
  const groupedAssets = new Map();
  for (const ref of references) {
    const group = groupedAssets.get(ref.url) ?? []; group.push(ref); groupedAssets.set(ref.url, group);
  }
  const assets = [...groupedAssets].map(([asset, uses]) => ({asset, provenance: provenanceFor(asset),
    uses: uses.map(({url, from, to, ...use}) => use)})).sort((a, b) => a.asset.localeCompare(b.asset));
  const catalogue = {schemaVersion: 2, manuscript: relativePath(config.story), manuscriptSHA256: digest(markdown),
    reference: [390, 844], iconScale: 4,
    style: 'Established Mars expedition illustration: finite compact original equipment, plain local iron bodies, minimal ceramic supports, cleared ground and no decorative hardware. The live design brief owns physical and narrative intent.',
    designBrief: relativePath(path.join(path.dirname(config.story), 'design-brief.md')),
    ...(Object.keys(brief).length ? {physicalBriefs: 'subject-briefs.json'} : {}),
    ...(registration ? {registration: 'registration.json'} : {}), ...(reused ? {reuseProvenance: 'reused-assets.json'} : {}),
    scenes, items: itemEntries, recipes, assets};
  return {catalogue, output: path.join(config.production, 'catalogue.json')};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = options(), {catalogue, output} = buildCatalogue(config);
  if (config.write) writeAtomic(output, JSON.stringify(catalogue, null, 2) + '\n');
  if (config.json) console.log(JSON.stringify(catalogue, null, 2));
  else console.log(`${config.write ? 'Catalogued' : 'Would catalogue'} ${catalogue.items.length} current identities, ${catalogue.scenes.length} scenes, ${catalogue.recipes.length} recipes and ${catalogue.assets.length} runtime assets. ${config.write ? relativePath(output) : 'No files written.'}`);
}
