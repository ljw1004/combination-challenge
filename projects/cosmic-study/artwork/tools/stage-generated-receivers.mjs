import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const artwork = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const plan = JSON.parse(await readFile(path.join(artwork, 'production-batches.json')));
const generated = JSON.parse(await readFile(path.join(artwork, 'production-generation-records.json')));
const manifestFile = path.join(artwork, 'production/receiver-extraction-manifest.json');
const manifest = JSON.parse(await readFile(manifestFile));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const browser = await chromium.launch();
let added = 0;
try {
  const page = await browser.newPage();
  for (const source of generated) {
    const batch = plan.batches.find(entry => entry.id === source.id);
    if (!batch || batch.kind !== 'receiver-atlas') continue;
    const bytes = await readFile(source.sourceOriginalPath), sourceSha256 = sha(bytes);
    const existing = manifest.atlases.find(entry => entry.id === source.id);
    if (existing) { if (existing.sourceSha256 !== sourceSha256) throw new Error(`Select replacement cells explicitly: ${source.id}`); continue; }
    const name = `${source.id}-${sourceSha256.slice(0, 12)}.png`;
    await copyFile(source.sourceOriginalPath, path.join(artwork, 'masters', name));
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    const rectangles = await page.evaluate(async ({ data, columns, rows }) => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
      return Array.from({ length: columns * rows }, (_, index) => {
        const col = index % columns, row = Math.floor(index / columns);
        const x0 = Math.round(col * image.width / columns), y0 = Math.round(row * image.height / rows), w = Math.round((col + 1) * image.width / columns) - x0, h = Math.round((row + 1) * image.height / rows) - y0;
        const rgba = ctx.getImageData(x0, y0, w, h).data;
        let left = w, top = h, right = -1, bottom = -1;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rgba[(y * w + x) * 4 + 3] >= 16) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
        if (right < 0) return null;
        left = Math.max(0, left - 16); top = Math.max(0, top - 16); right = Math.min(w - 1, right + 16); bottom = Math.min(h - 1, bottom + 16);
        return [x0 + left, y0 + top, right - left + 1, bottom - top + 1];
      });
    }, { data: bytes.toString('base64'), columns: batch.columns, rows: batch.rows });
    const cells = rectangles.map((rect, index) => {
      const cell = batch.cells.find(entry => entry.cell === index + 1);
      if (!cell?.item) return null;
      if (!rect) throw new Error(`Occupied receiver cell is empty: ${source.id} cell ${index + 1}`);
      return { id: cell.item, key: cell.key, rect };
    });
    manifest.atlases.push({ id: source.id, anonymousLabel: source.id, sourceFile: `../masters/${name}`, sourceOriginalPath: source.sourceOriginalPath, sourceSha256, promptReference: `../production-prompts.json#${source.promptId}`, batchReference: `../production-batches.json#${source.id}`, cropMethod: 'Alpha>=16 bounds plus16sourcepixels, constrained to declared gridcell; no alpha changes', width, height, columns: batch.columns, rows: batch.rows, cells });
    added++;
  }
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Staged ${added} receiver atlases`);
} finally { await browser.close(); }
