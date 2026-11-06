import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Reproduce the accepted pilot's two resampling/padding stages exactly.
const manifestPath = path.resolve(process.argv[2]);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const base = path.dirname(manifestPath), output = path.resolve(process.argv[3]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir('runs', { recursive: true });
await mkdir(output, { recursive: true });
const scratch = await mkdtemp(path.resolve('runs/cosmic-receiver-export-'));
const browser = await chromium.launch();
try {
  const temporary = { ...manifest, recordFile: 'base-record.json', output: { width: 512, height: 380, padding: 8 }, comparison: { sizes: [], columns: 3, background: '#f3f1eb' }, atlases: manifest.atlases.map(atlas => ({ ...atlas, sourceFile: path.resolve(base, atlas.sourceFile) })) };
  const temporaryManifest = path.join(scratch, 'manifest.json');
  await writeFile(temporaryManifest, JSON.stringify(temporary));
  execFileSync(process.execPath, [fileURLToPath(new URL('./extract-atlas.mjs', import.meta.url)), temporaryManifest, scratch], { stdio: 'pipe' });
  const extracted = JSON.parse(await readFile(path.join(scratch, 'base-record.json'), 'utf8'));
  const record = { schemaVersion: 1, manifestSha256: sha(await readFile(manifestPath)), scriptSha256: sha(await readFile(fileURLToPath(import.meta.url))), extractorSha256: extracted.scriptSha256, chromium: browser.version(), outputDimensions: [640, 672], intermediateDimensions: [512, 380], enlargedCanvas: [640, 480], enlargedDrawRect: [0, 2.5, 640, 475], finalOffset: [0, 96], operation: 'Selected rectangular crop →512×380 contain export →PNG decode →640×475 on640×480 →PNG decode →copy at0,96 on640×672. No painting or masks.', files: [] };
  const page = await browser.newPage();
  const ids = new Set();
  for (const atlas of extracted.atlases) for (const cell of atlas.cells) {
    if (!cell.outputFile) continue;
    if (ids.has(cell.id)) throw new Error(`Multiple selected sources for ${cell.id}`);
    ids.add(cell.id);
    const original = await readFile(path.join(scratch, cell.outputFile));
    if (sha(original) !== cell.outputSha256) throw new Error(`Intermediate hash mismatch: ${cell.id}`);
    const encoded = await page.evaluate(async data => {
      const load = async data => { const i = new Image(); i.src = `data:image/png;base64,${data}`; await i.decode(); return i; };
      const image = await load(data), enlarged = document.createElement('canvas'); enlarged.width = 640; enlarged.height = 480;
      const ctx = enlarged.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(image, 0, 2.5, 640, 475);
      const stage = await load(enlarged.toDataURL('image/png').split(',')[1]);
      const final = document.createElement('canvas'); final.width = 640; final.height = 672; final.getContext('2d').drawImage(stage, 0, 96);
      const rgba = final.getContext('2d').getImageData(0, 0, 640, 672).data;
      let boundaryMaxAlpha = 0;
      for (let y = 0; y < 672; y++) for (let x = 0; x < 640; x++) if (x === 0 || x === 639 || y === 0 || y === 671) boundaryMaxAlpha = Math.max(boundaryMaxAlpha, rgba[(y * 640 + x) * 4 + 3]);
      if (boundaryMaxAlpha !== 0) throw new Error('Nontransparent receiver boundary');
      return final.toDataURL('image/png').split(',')[1];
    }, original.toString('base64'));
    const bytes = Buffer.from(encoded, 'base64'), outputSha256 = sha(bytes);
    const expected = manifest.atlases.find(a => a.id === atlas.id).cells.find(c => c?.id === cell.id)?.expectedOutputSha256;
    if (expected && outputSha256 !== expected) throw new Error(`Accepted pilot output mismatch: ${cell.id}`);
    const file = `${cell.id}.png`;
    await writeFile(path.join(output, file), bytes);
    record.files.push({ id: cell.id, sourceFile: manifest.atlases.find(a => a.id === atlas.id).sourceFile, sourceOriginalPath: atlas.sourceOriginalPath, sourceSha256: atlas.sourceSha256, sourceDimensions: atlas.sourceDimensions, cell: cell.cell, sourceRect: cell.rect, sourceAlpha: cell.sourceAlpha, intermediateRect: cell.destinationRect, intermediateScale: cell.scale, intermediateSha256: cell.outputSha256, outputFile: file, outputSha256, matchesAcceptedPilot: Boolean(expected) });
  }
  await writeFile(path.join(base, 'receiver-extraction-record.json'), `${JSON.stringify(record, null, 2)}\n`);
  console.log(`Exported ${record.files.length} padded receivers to ${output}`);
} finally {
  await browser.close();
  await rm(scratch, { recursive: true, force: true });
}
