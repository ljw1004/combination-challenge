/**
 * Name the remaining reused runtime images after their current subjects.
 * Run after new survival artwork is integrated. Original assets are retained.
 *
 * node .../rename-reused.mjs --dry-run [--json]
 * node .../rename-reused.mjs --write
 * Optional --story and --production paths support isolated preparation.
 * No arguments means dry-run; importing this module never writes anything.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../../../../../../src/story/parser.ts';
import {matchingChapters} from '../../../../../../src/story/chapters.ts';
import {semantics} from '../../tools/story-semantics.mjs';

export const production = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const root = path.resolve(production, '../../../../..');
export const defaultStory = path.join(root, 'projects/mars-study/mars-v12/mars.md');
export const digest = value => crypto.createHash('sha256').update(value).digest('hex');
export const relativePath = value => path.relative(root, value).split(path.sep).join('/');
export const itemKey = id => id.replace(/^(?:id:|name:)/, '');
export const slug = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'artwork';
export const chapterKey = chapter => chapter.id.startsWith('id:') ? chapter.id.slice(3) : slug(chapter.name);
const imagePattern = () => /!\[[^\]\r\n]*\]\(([^)\r\n]+)\)/g;

export function options(args = process.argv.slice(2)) {
  const result = {story: defaultStory, production, write: false, json: false};
  let mode;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--write' || arg === '--dry-run') {
      assert(!mode || mode === arg, 'Choose --write or --dry-run, not both.');
      mode = arg; result.write = arg === '--write';
    } else if (arg === '--json') result.json = true;
    else if (arg === '--story' || arg === '--production') {
      assert(args[index + 1] && !args[index + 1].startsWith('--'), `Missing value after ${arg}`);
      result[arg.slice(2)] = path.resolve(args[++index]);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return result;
}

/** Only explicit chapter markers or leading chapter numbers, not CO2/r2/390x844. */
export function isNumberedAsset(url) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) return false;
  const filename = path.posix.basename(url.split(/[?#]/)[0]);
  if (['breathing-gas-supply.png','clean-service-hose.png','delivered-solar-array.png','excavated-regolith.png','straightened-antenna.png'].includes(filename)) return true;
  return /(?:^|[-_])ch(?:apter)?[-_]?\d+(?=[-_.]|$)/i.test(filename) || /^\d{1,3}[-_]/.test(filename);
}

/** Locate actual image syntax; comments and code examples are not runtime assets. */
export function collectArtwork(markdown, filename = defaultStory) {
  const comments = new Set();
  const story = parseStory(markdown, {file: filename, onComment: source => comments.add(source.line)});
  assert.equal(story.diagnostics.filter(d => d.severity === 'error').length, 0,
    `Fix manuscript parser errors before cataloguing or renaming: ${story.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join('; ')}`);
  const chapterKeys = story.chapters.map(chapterKey);
  assert.equal(new Set(chapterKeys).size, chapterKeys.length, 'Chapter titles/IDs need distinct semantic catalogue keys.');
  const referencesByLine = new Map();
  for (const ref of story.sourceReferences) {
    const list = referencesByLine.get(ref.source.line) ?? [];
    list.push(ref); referencesByLine.set(ref.source.line, list);
  }
  const presentations = new Map();
  for (const item of Object.values(story.items)) for (const p of item.presentations) if (p.icon) {
    const matches = matchingChapters(story, p.chapter);
    assert.equal(matches.length, 1, `Unresolved appearance chapter for ${item.name}`);
    presentations.set(p.icon.source.line, chapterKey(matches[0]));
  }
  const chaptersByLine = new Map(story.chapters.map(chapter => [chapter.source.line, chapter]));
  const references = [];
  let chapter, section, owner, fence, offset = 0;
  for (const [index, line] of markdown.split(/\r\n?|\n/).entries()) {
    const lineNumber = index + 1;
    const advance = () => { offset += line.length + (markdown.startsWith('\r\n', offset + line.length) ? 2 : 1); };
    if (comments.has(lineNumber)) { advance(); continue; }
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = undefined;
      advance(); continue;
    }
    if (fence) { advance(); continue; }
    if (chaptersByLine.has(lineNumber)) { chapter = chaptersByLine.get(lineNumber); section = owner = undefined; }
    const sectionMatch = /^\s*\*\*(Goals|Hotspots|Items|Combinations)\*\*\s*$/.exec(line);
    if (sectionMatch) { section = sectionMatch[1]; owner = undefined; }
    const lineReferences = referencesByLine.get(lineNumber) ?? [];
    if (/^[-*]\s/.test(line) && (section === 'Items' || section === 'Hotspots')) {
      owner = lineReferences.filter(r => r.kind !== 'chapter').sort((a, b) => a.source.span.from - b.source.span.from)[0]?.id;
    }
    const codeSpans = [...line.matchAll(/(`+)[^`]*?\1/g)].map(m => [m.index, m.index + m[0].length]);
    for (const match of line.matchAll(imagePattern())) {
      if (line[match.index - 1] === '\\' || codeSpans.some(([a, b]) => match.index >= a && match.index < b)) continue;
      const url = match[1].trim();
      const from = offset + match.index + match[0].indexOf('](') + 2 + (match[1].length - match[1].trimStart().length);
      let kind = 'illustration';
      if (!section && chapter?.image === url) kind = 'scene';
      else if (!chapter && story.cover === url) kind = 'cover';
      else if (/^\s*- (?:unnamed )?slot:/.test(line)) kind = 'slot';
      else if (presentations.has(lineNumber)) kind = 'appearance';
      else if (/^\s*- icon:/.test(line)) kind = section === 'Hotspots' ? 'hotspot' : 'item';
      const slot = kind === 'slot' ? lineReferences.find(r => r.role === 'slot')?.id : undefined;
      references.push({url, from, to: from + url.length, line: lineNumber, kind,
        ...(chapter ? {chapter: chapterKey(chapter), chapterTitle: chapter.name} : {}),
        ...(owner ? {item: itemKey(owner)} : {}),
        ...(slot ? {accepts: itemKey(slot)} : {}),
        ...(presentations.has(lineNumber) ? {appearanceFrom: presentations.get(lineNumber)} : {}),
        alt: match[0].slice(2, match[0].indexOf(']('))});
    }
    advance();
  }
  return {story, references};
}

export function replaceURLs(markdown, references, replacement) {
  let output = markdown;
  for (const ref of [...references].sort((a, b) => b.from - a.from)) {
    const url = replacement(ref);
    if (url !== undefined && url !== ref.url) output = output.slice(0, ref.from) + url + output.slice(ref.to);
  }
  return output;
}

function normalizeReadings(value) {
  if (typeof value === 'string') return value.replace(imagePattern(), match => match.replace(/\]\([^)]+\)/, '](artwork-url)'));
  if (Array.isArray(value)) return value.map(normalizeReadings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeReadings(child)]));
  return value;
}

export function assertOnlyImageURLsChanged(before, after, filename = defaultStory) {
  const a = collectArtwork(before, filename), b = collectArtwork(after, filename);
  assert.equal(replaceURLs(before, a.references, () => 'artwork-url'), replaceURLs(after, b.references, () => 'artwork-url'),
    'Rename attempted to alter text, alt text, metadata, comments or recipe syntax outside image URLs.');
  assert.deepEqual(normalizeReadings(semantics(a.story, {includeProse: true})), normalizeReadings(semantics(b.story, {includeProse: true})),
    'Rename changed prose or gameplay.');
}

function localAsset(storyPath, url) {
  assert(url.startsWith('assets/') && !/[?#]/.test(url), `Expected a plain story-local assets/ URL: ${url}`);
  const assetRoot = path.resolve(path.dirname(storyPath), 'assets'), filename = path.resolve(path.dirname(storyPath), url);
  assert(filename.startsWith(assetRoot + path.sep), `Asset escapes the story assets directory: ${url}`);
  return filename;
}

function preferredName(refs) {
  const priority = {scene: 0, cover: 1, item: 2, appearance: 3, slot: 4, hotspot: 5, illustration: 6};
  const ref = [...refs].sort((a, b) => priority[a.kind] - priority[b.kind] ||
    `${a.item ?? ''}/${a.appearanceFrom ?? a.chapter ?? ''}`.localeCompare(`${b.item ?? ''}/${b.appearanceFrom ?? b.chapter ?? ''}`))[0];
  if (ref.kind === 'scene') return `scene-${slug(ref.chapter)}`;
  if (ref.kind === 'cover') return 'mission-to-mars-cover';
  const subject = slug(ref.item ?? ref.alt ?? ref.chapterTitle ?? 'artwork');
  if (ref.kind === 'appearance') return `${subject}--${slug(ref.appearanceFrom)}`;
  if (ref.kind === 'hotspot') return `${subject}--${slug(ref.chapter)}`;
  if (ref.kind === 'slot') return `${subject}--${slug(ref.accepts ?? 'fitting')}`;
  if (ref.kind === 'illustration') return `${subject}--detail`;
  return subject;
}

/** Prepare everything, including assertions and conflict checks, without mutation. */
export function planRenames(config = {story: defaultStory, production}) {
  const markdown = fs.readFileSync(config.story, 'utf8');
  const {references} = collectArtwork(markdown, config.story);
  const manifestPath = path.join(config.production, 'reused-assets.json');
  const previousText = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : null;
  const previous = previousText ? JSON.parse(previousText) : {schemaVersion: 1, manuscript: relativePath(config.story), assets: []};
  assert.equal(previous.schemaVersion, 1, 'Unsupported reused-assets schema.');
  assert(Array.isArray(previous.assets), 'Expected reused-assets.assets array.');
  assert.equal(previous.manuscript, relativePath(config.story), 'Reuse provenance belongs to a different manuscript.');
  const oldMappings = new Map(previous.assets.map(entry => [entry.source, entry]));
  assert.equal(oldMappings.size, previous.assets.length, 'Duplicate reuse provenance sources.');
  const groups = new Map();
  for (const ref of references.filter(ref => isNumberedAsset(ref.url))) {
    const group = groups.get(ref.url) ?? []; group.push(ref); groups.set(ref.url, group);
  }
  const reserved = new Map(previous.assets.map(entry => [entry.asset, entry.sha256]));
  const proposed = [...groups].map(([source, refs]) => ({source, refs, name: preferredName(refs)})).sort((a, b) => a.source.localeCompare(b.source));
  const names = new Map();
  for (const entry of proposed) names.set(entry.name, (names.get(entry.name) ?? 0) + 1);
  const mappings = [];
  for (const {source, refs, name} of proposed) {
    const sourceFile = localAsset(config.story, source);
    assert(fs.statSync(sourceFile).isFile(), `Missing reused image: ${source}`);
    const bytes = fs.readFileSync(sourceFile), sha256 = digest(bytes);
    const old = oldMappings.get(source);
    if (old) assert.equal(old.sha256, sha256, `Original reused image changed since provenance was recorded: ${source}`);
    const extension = path.extname(source).toLowerCase();
    const context = slug(refs.map(ref => ref.appearanceFrom ?? ref.chapter ?? '').filter(Boolean).sort()[0] ?? 'variant');
    const stem = names.get(name) > 1 ? `${name}--${context}` : name;
    let asset = old?.asset ?? `assets/survival/reused/${stem}${extension}`;
    assert(asset.startsWith('assets/survival/reused/'), `Invalid reuse destination: ${asset}`);
    const conflicts = candidate => {
      if (reserved.has(candidate) && reserved.get(candidate) !== sha256) return true;
      const filename = localAsset(config.story, candidate);
      if (!fs.existsSync(filename)) return false;
      assert(fs.lstatSync(filename).isFile(), `Reuse destination must be a regular file: ${candidate}`);
      return digest(fs.readFileSync(filename)) !== sha256;
    };
    if (conflicts(asset)) {
      assert(!old, `Recorded reuse destination changed: ${asset}`);
      asset = `assets/survival/reused/${stem}--${sha256.slice(0, 12)}${extension}`;
    }
    assert(!conflicts(asset), `Conflicting reuse destination: ${asset}`);
    assert(!isNumberedAsset(asset), `Destination still carries a chapter number: ${asset}`);
    reserved.set(asset, sha256);
    mappings.push({source, asset, sha256, bytes: bytes.length,
      uses: refs.map(({from, to, url, ...use}) => use)});
  }
  const bySource = new Map(mappings.map(entry => [entry.source, entry.asset]));
  const updated = replaceURLs(markdown, references, ref => bySource.get(ref.url));
  assertOnlyImageURLsChanged(markdown, updated, config.story);
  assert.equal(collectArtwork(updated, config.story).references.filter(ref => isNumberedAsset(ref.url)).length, 0,
    'Some numbered runtime references remain.');
  const allMappings = new Map(previous.assets.map(entry => [entry.source, entry]));
  for (const mapping of mappings) allMappings.set(mapping.source, mapping);
  const manifest = {schemaVersion: 1, manuscript: relativePath(config.story),
    policy: 'Byte-identical copies of currently referenced artwork; original sources retained. Filenames do not certify visual suitability.',
    assets: [...allMappings.values()].sort((a, b) => a.source.localeCompare(b.source))};
  return {config, markdown, updated, manifestPath, previousText, manifest, mappings,
    referencesChanged: references.filter(ref => bySource.has(ref.url)).length};
}

export function writeAtomic(filename, content) {
  fs.mkdirSync(path.dirname(filename), {recursive: true});
  if (fs.existsSync(filename) && fs.readFileSync(filename, 'utf8') === content) return;
  const temporary = `${filename}.tmp-${process.pid}`;
  try { fs.writeFileSync(temporary, content, {flag: 'wx'}); fs.renameSync(temporary, filename); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

export function applyPlan(plan) {
  if (!plan.mappings.length) return;
  assert.equal(fs.readFileSync(plan.config.story, 'utf8'), plan.markdown, 'Manuscript changed after planning; rerun.');
  const currentManifest = fs.existsSync(plan.manifestPath) ? fs.readFileSync(plan.manifestPath, 'utf8') : null;
  assert.equal(currentManifest, plan.previousText, 'Reuse provenance changed after planning; rerun.');
  for (const mapping of plan.mappings) {
    const source = localAsset(plan.config.story, mapping.source), destination = localAsset(plan.config.story, mapping.asset);
    assert.equal(digest(fs.readFileSync(source)), mapping.sha256, `Source changed after planning: ${mapping.source}`);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    if (!fs.existsSync(destination)) fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(digest(fs.readFileSync(destination)), mapping.sha256, `Copied bytes differ: ${mapping.asset}`);
  }
  // Record recoverable provenance before switching runtime references.
  writeAtomic(plan.manifestPath, JSON.stringify(plan.manifest, null, 2) + '\n');
  assert.equal(fs.readFileSync(plan.config.story, 'utf8'), plan.markdown, 'Manuscript changed during copying; assets retained, story not overwritten.');
  writeAtomic(plan.config.story, plan.updated);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = options(), plan = planRenames(config);
  if (config.write) applyPlan(plan);
  const summary = {mode: config.write ? 'write' : 'dry-run', sourceImages: plan.mappings.length,
    referencesChanged: plan.referencesChanged, manuscript: relativePath(config.story),
    provenance: relativePath(plan.manifestPath), checks: 'URL-only edit; prose and gameplay unchanged; originals retained', mappings: plan.mappings};
  if (config.json) console.log(JSON.stringify(summary, null, 2));
  else console.log(`${config.write ? 'Renamed' : 'Would rename'} ${summary.sourceImages} reused images across ${summary.referencesChanged} runtime references. Prose/gameplay assertions passed. ${config.write ? 'Originals retained.' : 'No files written.'}`);
}
