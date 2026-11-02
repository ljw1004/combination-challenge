import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../../../../src/story/parser.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const production = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manuscript = fs.readFileSync(path.join(root, 'stories/mars/mars.md'), 'utf8');
const story = parseStory(manuscript);
const rows = fs.readFileSync(path.join(production, 'subjects.tsv'), 'utf8').trim().split('\n').slice(1);
const subjects = rows.map(line => {
  const [name, size, family, depiction, distinction] = line.split('\t');
  if (!name || !Number.isFinite(Number(size)) || !distinction) throw new Error(`Invalid subject: ${line}`);
  return {name, visibleLongEdgePx: Number(size), family, depiction, distinction};
});
const byName = new Map(Object.values(story.items).map(item => [item.name, item]));
const slug = name => name.normalize('NFKD').replace(/[^\x00-\x7F]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const assemblyStates = new Set(['Disabled crawler', 'Recovered crawler', 'Depot cargo shuttle', 'Secured cart', 'Specimen transport cart', 'Ascent cabin shell', 'Ascent vehicle', 'Loaded ascent vehicle', 'Flight ready vehicle', 'Ascending vehicle', 'Docked vehicle', 'Capsule dock', 'Loaded capsule dock']);
const sourceLines = manuscript.split('\n');
const catalogue = subjects.map(subject => {
  const item = byName.get(subject.name);
  if (!item) throw new Error(`Unrecognized subject ${subject.name}`);
  const literal = item.id.startsWith('name:') ? subject.name : `\`${item.id.replace(/^id:/, '')}\``;
  const declarationIndex = sourceLines.findIndex(line => line.startsWith('- ') && (line.slice(2) === literal || line.slice(2).startsWith(`${literal} (`) || line.slice(2).startsWith(`${literal} \"`)));
  const chapter = story.chapters.findLast(c => c.source.line <= (declarationIndex < 0 ? item.source.line : declarationIndex + 1));
  return {
    id: item.id, ...subject, slug: slug(subject.name),
    asset: `assets/expedition/items/${slug(subject.name)}.png`,
    owner: item.compound || assemblyStates.has(subject.name) ? 'assemblies' : 'ordinary',
    compound: item.compound, firstDeclarationLine: declarationIndex < 0 ? null : declarationIndex + 1,
    declarationChapter: chapter.name,
    createsFrom: story.recipes.filter(r => !r.installation && r.result.id === item.id).map(r => ({a: story.items[r.a.ref.id].name, ...(r.b ? {b: story.items[r.b.ref.id].name} : {}), ...(r.hotspot ? {hotspot: story.hotspots[r.hotspot].name} : {})})),
    usedBy: [...new Set(story.recipes.filter(r => r.a.ref.id === item.id || r.b?.ref.id === item.id).map(r => story.items[r.result.id].name))],
    slots: item.slots.map(slot => ({name: slot.name ?? null, accepts: slot.accepts, itemName: story.items[slot.accepts].name})),
  };
});
if (catalogue.length !== Object.keys(story.items).length) throw new Error('Subject coverage differs from story');
if (new Set(catalogue.map(item => item.slug)).size !== catalogue.length) throw new Error('Output slug collision');
const generated = new Set();
const groups = [];
for (const file of fs.readdirSync(path.join(production, 'atlases')).filter(name => /^0[1-5]-.+\.prompt\.txt$/.test(name)).sort()) {
  const names = [...fs.readFileSync(path.join(production, 'atlases', file), 'utf8').matchAll(/^\d+\. ([^:\n]+):/gm)].map(match => match[1]);
  if (names.length !== 16) throw new Error(`Expected sixteen original atlas entries: ${file}`);
  names.forEach(name => generated.add(name));
  groups.push({id: file.replace('.prompt.txt', ''), columns: 4, rows: 4, names});
}
const remaining = catalogue.filter(item => item.owner === 'ordinary' && !generated.has(item.name));
for (let offset = 0; offset < remaining.length; offset += 16) {
  const items = remaining.slice(offset, offset + 16);
  const first = items[0].family, last = items.at(-1).family;
  groups.push({id: `${String(groups.length + 1).padStart(2, '0')}-${first}${last === first ? '' : `-and-${last}`}`, columns: items.length <= 3 ? items.length : 4, rows: items.length <= 3 ? 1 : 4, names: items.map(item => item.name)});
}
const planned = new Set(groups.flatMap(g => g.names));
if (planned.size !== catalogue.filter(i => i.owner === 'ordinary').length) throw new Error('Atlas coverage mismatch');
for (const group of groups) group.assets = group.names.map(name => catalogue.find(item => item.name === name).asset);
fs.writeFileSync(path.join(production, 'catalogue.json'), `${JSON.stringify({referenceViewport: {width: 390, height: 844},sourceScale: 4,minimumVisibleLongEdgePx: 60,maximumVisibleLongEdgePx: 230,items: catalogue}, null, 2)}\n`);
fs.writeFileSync(path.join(production, 'atlas-groups.json'), `${JSON.stringify(groups, null, 2)}\n`);
console.log(`${catalogue.length} items; ${groups.length} ordinary atlases; ${catalogue.filter(i=>i.owner==='assemblies').length} assembly-owned items`);
console.log(groups.filter(g=>Number(g.id.slice(0,2))>=5).map(g=>`${g.id}: ${g.names.join(' | ')}`).join('\n'));
