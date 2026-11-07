import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Add generated sources to the extraction manifest, never altering the subject plan.
const artwork = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const plan = JSON.parse(await readFile(path.join(artwork, 'production-batches.json')));
const generated = JSON.parse(await readFile(path.join(artwork, 'production-generation-records.json')));
const manifestFile = path.join(artwork, 'production/portable-extraction-manifest.json');
const manifest = JSON.parse(await readFile(manifestFile));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let added = 0;
for (const source of generated) {
  const batch = plan.batches.find(entry => entry.id === source.id);
  if (!batch || batch.kind !== 'circular-atlas') continue;
  const bytes = await readFile(source.sourceOriginalPath), sourceSha256 = sha(bytes);
  const existing = manifest.atlases.find(entry => entry.id === source.id);
  if (existing) {
    if (existing.sourceSha256 !== sourceSha256) throw new Error(`Source selection changed for ${source.id}; retain the old master and explicitly select replacement cells.`);
    continue;
  }
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error(`PNG source required: ${source.id}`);
  const name = `${source.id}-${sourceSha256.slice(0, 12)}.png`;
  await copyFile(source.sourceOriginalPath, path.join(artwork, 'masters', name));
  const references = [];
  for (const originalPath of source.referencedImagePaths ?? []) references.push({ originalPath, sha256: sha(await readFile(originalPath)) });
  const cells = Array.from({ length: batch.columns * batch.rows }, (_, index) => {
    const cell = batch.cells.find(entry => entry.cell === index + 1);
    if (!cell?.item) return null;
    return { id: `${cell.item}${cell.fromChapter ? `--from-${cell.fromChapter}` : ''}`, key: cell.key };
  });
  manifest.atlases.push({ id: source.id, anonymousLabel: source.id, sourceFile: `../masters/${name}`, sourceOriginalPath: source.sourceOriginalPath, sourceSha256, promptReference: `../production-prompts.json#${source.promptId}`, batchReference: `../production-batches.json#${source.id}`, referenceInputs: references, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), columns: batch.columns, rows: batch.rows, cells });
  added++;
}
await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Staged ${added} new circular atlases; ${manifest.atlases.length} selected source atlases total`);
