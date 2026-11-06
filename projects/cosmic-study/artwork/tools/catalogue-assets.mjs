import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const production = path.join(project, 'artwork/production');
const runtime = path.join(project, 'assets/lights-that-remain');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await readFile(file, 'utf8'));
const sources = new Map(), assets = [];
const add = async (kind, id, file, dimensions, outputSha256, source, geometry, key) => {
  const absolute = path.join(runtime, kind, file), bytes = await readFile(absolute);
  if (sha(bytes) !== outputSha256) throw new Error(`Output differs from extraction record: ${absolute}`);
  if (bytes.readUInt32BE(16) !== dimensions[0] || bytes.readUInt32BE(20) !== dimensions[1]) throw new Error(`Output dimensions differ: ${absolute}`);
  const master = path.resolve(production, source.file);
  if (sha(await readFile(master)) !== source.sha256) throw new Error(`Selected source changed: ${master}`);
  const sourceId = path.basename(master, '.png');
  sources.set(sourceId, { ...source, file: path.relative(project, master) });
  assets.push({ id, ...(key ? { key } : {}), kind, file: path.relative(project, absolute), dimensions, sha256: outputSha256, sourceId, ...geometry });
};
const portable = await json(path.join(production, 'portable-extraction-record.json'));
for (const atlas of portable.atlases) for (const cell of atlas.cells) if (cell.outputFile) {
  await add('icons', cell.id, path.basename(cell.outputFile), [320, 320], cell.outputSha256, { file: atlas.sourceFile, sha256: atlas.sourceSha256, originalPath: atlas.sourceOriginalPath, dimensions: atlas.sourceDimensions, promptReference: atlas.promptReference, referenceInputs: atlas.referenceInputs }, { sourceRect: cell.rect, scale: cell.scale, destinationRect: cell.destinationRect }, cell.key ?? `${cell.id}::default`);
}
const backgrounds = await json(path.join(production, 'background-extraction-record.json'));
for (const source of backgrounds.sources) for (const panel of source.panels) {
  await add('backgrounds', panel.id, panel.outputFile, panel.outputDimensions, panel.outputSha256, { file: source.file, sha256: source.sha256, originalPath: source.originalPath, dimensions: source.sourceDimensions, promptReference: source.promptReference }, { sourceRect: panel.sourceRect, scale: panel.scale, destinationRect: panel.destinationRect, status: panel.status });
}
const receivers = await json(path.join(production, 'receiver-extraction-record.json'));
const receiverManifest = await json(path.join(production, 'receiver-extraction-manifest.json'));
for (const cell of receivers.files) {
  await add('hotspots', cell.id, cell.outputFile, receivers.outputDimensions, cell.outputSha256, { file: cell.sourceFile, sha256: cell.sourceSha256, originalPath: cell.sourceOriginalPath, dimensions: cell.sourceDimensions, promptReference: receiverManifest.atlases.find(a => a.sourceFile === cell.sourceFile)?.promptReference }, { sourceRect: cell.sourceRect, intermediateDimensions: receivers.intermediateDimensions, intermediateScale: cell.intermediateScale, intermediateRect: cell.intermediateRect, intermediateSha256: cell.intermediateSha256, enlargedCanvas: receivers.enlargedCanvas, enlargedDrawRect: receivers.enlargedDrawRect, finalOffset: receivers.finalOffset, matchesAcceptedPilot: cell.matchesAcceptedPilot }, `${cell.id}::fixed`);
}
const expected = new Set(assets.map(asset => asset.file));
if (expected.size !== assets.length) throw new Error('Two records claim the same final asset');
const files = await readdir(runtime, { recursive: true });
for (const file of files.filter(file => /\.(png|webp)$/i.test(file))) if (!expected.has(path.relative(project, path.join(runtime, file)))) throw new Error(`Unrecorded/stale runtime image: ${file}`);
const plan = await json(path.join(project, 'artwork/production-batches.json'));
const coverage = { circular: assets.filter(a => a.kind === 'icons').length, expectedCircular: plan.coverage.totalCircularAppearances, fixed: assets.filter(a => a.kind === 'hotspots').length, expectedFixed: plan.coverage.fixedIdentities, backgrounds: assets.filter(a => a.kind === 'backgrounds').length };
const result = { schemaVersion: 1, status: 'Selected exported artwork; full-story artwork review and integration tracked separately.', coverage, processingRecords: ['portable-extraction-record.json', 'receiver-extraction-record.json', 'background-extraction-record.json'], sources: Object.fromEntries(sources), assets };
const encoded = `${JSON.stringify(result, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (await readFile(path.join(production, 'asset-manifest.json'), 'utf8') !== encoded) throw new Error('Asset manifest differs from the verified extraction records');
} else {
  await writeFile(path.join(production, 'asset-manifest.json'), encoded);
}
console.log(`Verified ${assets.length} final assets, ${sources.size} source masters; circular ${coverage.circular}/${coverage.expectedCircular}, fixed ${coverage.fixed}/${coverage.expectedFixed}, backgrounds ${coverage.backgrounds}`);
