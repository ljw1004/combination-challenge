import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {artworkId} from './story-semantics.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
export const production = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const defaults = {
  story: path.join(root, 'projects/mars-study/mars-v12/mars.md'),
  baseline: path.join(root, 'projects/mars-study/mars-v11/mars.md'),
  catalogue: path.join(production, 'catalogue.json'),
  scenes: path.join(production, 'scene-manifest.json'),
  assemblies: path.join(production, 'assembly-manifest.json'),
};

export function options(args = process.argv.slice(2), flags = []) {
  const result = {...defaults};
  for (let index = 0; index < args.length; index++) {
    const key = args[index].replace(/^--/, '');
    if (flags.includes(key)) { result[key] = true; continue; }
    assert(key in defaults || key === 'output', `Unknown option: ${args[index]}`);
    assert(args[index + 1] && !args[index + 1].startsWith('--'), `Missing value for ${args[index]}`);
    result[key] = path.resolve(args[++index]);
  }
  return result;
}

export function loadArtwork(config) {
  const json = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
  const catalogue = json(config.catalogue), sceneManifest = json(config.scenes), assemblies = json(config.assemblies);
  assert(Array.isArray(catalogue.items) && Array.isArray(sceneManifest.scenes), 'Expected catalogue.items and scene-manifest.scenes arrays.');
  assert(Array.isArray(assemblies.items) && Array.isArray(assemblies.slots), 'Expected assembly-manifest.items and .slots arrays.');
  const items = new Map(catalogue.items.map(value => [artworkId(value.id), value]));
  assert.equal(items.size, catalogue.items.length, 'Duplicate catalogue identities.');
  for (const value of assemblies.items) {
    const item = items.get(artworkId(value.id));
    assert(item, `Unknown compound base ${value.id}`);
    assert.equal(value.path, item.asset, `Compound base path must agree with catalogue: ${value.id}`);
  }
  const slots = new Map();
  for (const value of assemblies.slots) {
    const key = `${artworkId(value.owner)}\0${artworkId(value.accepts)}`;
    assert(!slots.has(key), `Duplicate slot registration: ${value.owner} / ${value.accepts}`);
    slots.set(key, value.path);
  }
  const variants = catalogue.variants ?? [];
  for (const value of variants) assert(items.has(artworkId(value.owner)), `Unknown appearance owner: ${value.owner}`);
  const hotspots = new Map();
  for (const scene of sceneManifest.scenes) for (const value of scene.hotspots ?? []) {
    assert(value.id && value.name && value.icon && value.feature, `Incomplete hotspot registration in ${scene.name}`);
    for (const coordinate of ['x', 'y']) assert(Number.isFinite(value[coordinate]) && value[coordinate] >= 0 && value[coordinate] <= 100, `Invalid ${coordinate} for ${value.name}`);
    const registered = {id: value.id, name: value.name, x: value.x, y: value.y, width: value.width, height: value.height, icon: value.icon, circular: !!value.circular};
    if (hotspots.has(value.id)) assert.deepEqual(registered, hotspots.get(value.id), `Repeated hotspot ${value.name} must use the same global position and icon.`);
    else hotspots.set(value.id, registered);
  }
  const paths = new Set([...items.values()].map(value => value.asset));
  for (const value of variants) paths.add(value.asset);
  for (const value of slots.values()) paths.add(value);
  for (const value of hotspots.values()) paths.add(value.icon);
  for (const value of sceneManifest.scenes) paths.add(value.background);
  for (const value of paths) assert(typeof value === 'string' && value.length && !/^https?:/i.test(value), `Expected a local artwork path: ${value}`);
  return {catalogue, sceneManifest, assemblies, items, variants, slots, hotspots, paths};
}
