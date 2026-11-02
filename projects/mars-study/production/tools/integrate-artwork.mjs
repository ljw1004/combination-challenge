import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../../../../src/story/parser.ts';
import {semantics} from './story-semantics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const production = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filename = path.join(root, 'stories/mars/mars.md');
const catalogue = JSON.parse(fs.readFileSync(path.join(production, 'catalogue.json'), 'utf8'));
const sceneFile = path.join(production, 'scene-manifest.json');
const dryRun=process.argv.includes('--dry-run');
const suppliedManifest=process.argv.slice(2).find(arg=>!arg.startsWith('--'));
const assemblyFile = suppliedManifest ? path.resolve(suppliedManifest) : path.join(production, 'assemblies/manifest.json');
const scenesDocument = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
const scenes = Array.isArray(scenesDocument) ? scenesDocument : scenesDocument.scenes;
const assemblyDocument = JSON.parse(fs.readFileSync(assemblyFile, 'utf8'));
const assemblies = Array.isArray(assemblyDocument) ? assemblyDocument : assemblyDocument.assemblies ?? assemblyDocument.items;

function assetExists(asset) {
  assert.equal(typeof asset, 'string', 'Asset path must be a string');
  if (!dryRun) assert(fs.existsSync(path.join(root, 'stories/mars', asset)), `Missing runtime artwork: ${asset}`);
  return asset;
}

const original = fs.readFileSync(filename, 'utf8');
const before = parseStory(original);
const itemByName = new Map(catalogue.items.map(i=>[i.name,i]));
const fitted = new Map();
for (const assembly of assemblies) {
  const name = assembly.name ?? assembly.itemName;
  const base = assembly.base ?? assembly.icon ?? assembly.asset ?? assembly.path;
  if (base) itemByName.get(name).asset = assetExists(base);
  for (const overlay of assembly.slots ?? assembly.overlays ?? []) {
    const accepts = overlay.accepts ?? overlay.itemId;
    const acceptedName = before.items[accepts]?.name ?? overlay.itemName ?? overlay.name;
    fitted.set(`${name}\0${acceptedName}`, assetExists(overlay.icon ?? overlay.asset ?? overlay.path));
  }
}
for (const overlay of assemblyDocument.slots ?? []) {
  const ownerName=before.items[overlay.owner].name;
  const acceptedName=before.items[overlay.accepts].name;
  fitted.set(`${ownerName}\0${acceptedName}`,assetExists(overlay.path));
}
for (const state of assemblyDocument.states ?? []) {
  itemByName.get(state.name).asset = assetExists(state.icon ?? state.asset);
}
for (const item of catalogue.items) assetExists(itemByName.get(item.name).asset);
const sceneByName = new Map(scenes.map(s=>[s.name??s.chapterName,s]));
const hotspotByName = new Map(scenes.flatMap(s=>s.hotspots??[]).map(h=>[h.name,h]));
for (const scene of scenes) assetExists(scene.background);

// Remove only this production pass's generated metadata before reapplying it.
const lines = original.split('\n').filter(line=>!/^\s+- icon: .*\(assets\/expedition\//.test(line)&&!/^  > NOTE: Mars artwork target:/.test(line)).map(line=>line.replace(/, icon: !\[[^\]]*\]\(assets\/expedition\/[^)]+\)/,''));
const seen = new Set();
const output = [];
let chapterName='', section='', currentItem='';
for (const rawLine of lines) {
  let line=rawLine;
  if (line.startsWith('## ')) {chapterName=line.slice(3);section='';currentItem='';}
  if (line.startsWith('**')) {
    // The one inline-declared result needs an explicit Items site for artwork.
    if (section==='**Items**' && line==='**Combinations**' && chapterName==='Basin coring station' && !seen.has('Fine–coarse–fine; spectrum inconclusive')) {
      const item=itemByName.get('Fine–coarse–fine; spectrum inconclusive');
      output.push('- `sediment-comparison` "Fine–coarse–fine; spectrum inconclusive"',`  - icon: ![${item.name}](${item.asset})`,'');
      seen.add(item.name);
    }
    section=line;
  }
  if (line.startsWith('![') && !section) {
    const scene=sceneByName.get(chapterName);
    if (scene) line=line.replace(/\]\([^)]+\)$/, `](${scene.background})`);
  }
  if (section==='**Hotspots**' && line.startsWith('- ')) {
    const name=line.slice(2).replace(/ \(at [^)]+\)$/,'');
    const hotspot=hotspotByName.get(name);
    assert(hotspot,`No scene registration for hotspot ${name}`);
    output.push(`- ${name} (at ${hotspot.x}%, ${hotspot.y}%)`, `  - icon: ![${name}](${assetExists(hotspot.icon)})${hotspot.circular?' (circular)':''}`,`  > NOTE: Mars artwork target: ${hotspot.feature} Centre ${hotspot.x}%, ${hotspot.y}%; transparent hit area ${hotspot.width} × ${hotspot.height}px at the 390 × 844 reference viewport.`);
    continue;
  }
  if (section==='**Items**' && line.startsWith('- ')) {
    const identity=line.slice(2).replace(/ \(compound\)$/,'');
    const name=identity.startsWith('`sediment-comparison`')?'Fine–coarse–fine; spectrum inconclusive':identity;
    currentItem=name;
    const item=itemByName.get(name);
    if (item && !seen.has(name)) {
      output.push(line,`  - icon: ![${name}](${item.asset})`);
      seen.add(name);
      continue;
    }
  }
  if (/^  - (unnamed )?slot:/.test(line)) {
    const acceptedName=line.match(/accepts (.+)$/)?.[1];
    const icon=fitted.get(`${currentItem}\0${acceptedName}`);
    assert(icon,`Missing fitted overlay: ${currentItem} / ${acceptedName}`);
    line+=`, icon: ![fitted ${acceptedName}](${icon})`;
  }
  output.push(line);
}
assert.equal(seen.size,catalogue.items.length,'Not every item received icon metadata');
const revised=output.join('\n');
const after=parseStory(revised);
assert.deepEqual(semantics(after),semantics(before),'Artwork integration changed story semantics');
assert.equal(Object.values(after.items).filter(i=>i.icon).length,catalogue.items.length);
assert(Object.values(after.items).every(i=>i.slots.every(slot=>slot.icon)));
assert(Object.values(after.hotspots).every(h=>h.icon&&h.x!==undefined&&h.y!==undefined));
const outputFile=dryRun?path.join(root,'runs/mars-artwork/mars-artwork-preview.md'):filename;
fs.writeFileSync(outputFile,revised);
console.log(`${dryRun?'Prepared temporary preview for':'Integrated'} ${seen.size} item icons, ${fitted.size} fittings, ${hotspotByName.size} landscape hotspots and ${scenes.length} scenes; semantic projection unchanged.${dryRun?' Missing image files permitted in this preview.':''}`);
