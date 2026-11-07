import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Only rectangular copying, uniform resizing, transparent padding and sheet layout.
// No colour changes, masks, clipping paths, or new illustration content.
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node extract-atlas.mjs [manifest.json] [output-directory]\nWith no arguments, rebuild the selected production circles in assets/lights-that-remain.\nWith a custom manifest, output defaults to its directory. Use runs/ for trial exports.\nSchema and measured-grid guidance: artwork/tools/README.md; live example: artwork/production/portable-extraction-manifest.json.');
  process.exit(0);
}
const manifestPath = path.resolve(args[0] ?? fileURLToPath(new URL('../production/portable-extraction-manifest.json', import.meta.url)));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const base = path.dirname(manifestPath);
const output = path.resolve(args[1] ?? (args[0] ? base : fileURLToPath(new URL('../../assets/lights-that-remain', import.meta.url))));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const safeName = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(value);
assert(manifest.schemaVersion === 1, 'Unsupported manifest version');
const { padding } = manifest.output;
const outputWidth = manifest.output.width ?? manifest.output.size;
const outputHeight = manifest.output.height ?? manifest.output.size;
assert([outputWidth, outputHeight].every(n => Number.isInteger(n) && n > 0) && Number.isInteger(padding) && padding >= 0 && 2 * padding < Math.min(outputWidth, outputHeight), 'Invalid output geometry');
assert(Number.isInteger(manifest.comparison.columns) && manifest.comparison.columns > 0, 'Invalid comparison columns');
for (const key of ['boundaryMaxAlpha', 'blankMaxAlpha']) assert(Number.isInteger(manifest.alphaValidation[key]) && manifest.alphaValidation[key] >= 0 && manifest.alphaValidation[key] <= 255, `Invalid ${key}`);
await mkdir(output, { recursive: true });
const atlasIds = new Set();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const record = {
    schemaVersion: 1,
    processingVersion: 2,
    scriptSha256: sha(await readFile(fileURLToPath(import.meta.url))),
    manifestSha256: sha(await readFile(manifestPath)),
    chromium: browser.version(),
    operation: 'Copy cell rectangle to isolated canvas; uniform contain resize; transparent padding. No alpha thresholding, circle masks, or repainting.',
    output: manifest.output,
    atlases: [],
    comparisons: [],
  };
  const allExports = [];
  const outputFiles = new Set();
  for (const atlas of manifest.atlases) {
    assert(safeName(atlas.id) && !atlasIds.has(atlas.id), `Invalid or repeated atlas id: ${atlas.id}`);
    atlasIds.add(atlas.id);
    assert(Number.isInteger(atlas.width) && atlas.width > 0 && Number.isInteger(atlas.height) && atlas.height > 0, `Invalid dimensions: ${atlas.id}`);
    assert(Number.isInteger(atlas.columns) && atlas.columns > 0 && Number.isInteger(atlas.rows) && atlas.rows > 0, `Invalid grid: ${atlas.id}`);
    assert(atlas.cells.length === atlas.columns * atlas.rows, `Every occupied or blank cell must be listed: ${atlas.id}`);
    const cuts = (supplied, count, extent) => {
      const result = supplied ?? Array.from({ length: count + 1 }, (_, i) => Math.round(i * extent / count));
      assert(result.length === count + 1 && result[0] === 0 && result.at(-1) === extent && result.every((v, i) => Number.isInteger(v) && (i === 0 || v > result[i - 1])), `Invalid measured grid boundaries: ${atlas.id}`);
      return result;
    };
    const xCuts = cuts(atlas.columnBoundaries, atlas.columns, atlas.width);
    const yCuts = cuts(atlas.rowBoundaries, atlas.rows, atlas.height);
    const bytes = await readFile(path.resolve(base, atlas.sourceFile));
    assert(sha(bytes) === atlas.sourceSha256, `Source hash mismatch: ${atlas.sourceFile}`);
    const cellIds = new Set();
    const cells = atlas.cells.map((cell, index) => {
      if (cell !== null) {
        assert(safeName(cell.id) && !cellIds.has(cell.id), `Invalid or repeated cell id in ${atlas.id}`);
        cellIds.add(cell.id);
      }
      const column = index % atlas.columns;
      const row = Math.floor(index / atlas.columns);
      const left = xCuts[column];
      const top = yCuts[row];
      const rect = cell?.rect ?? [left, top, xCuts[column + 1] - left, yCuts[row + 1] - top];
      assert(rect.length === 4 && rect.every(Number.isInteger), `Invalid rectangle in ${atlas.id} cell ${index + 1}`);
      const [x, y, w, h] = rect;
      assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= atlas.width && y + h <= atlas.height, `Rectangle outside source in ${atlas.id} cell ${index + 1}`);
      // Explicit rectangles must remain inside their declared grid cell.
      assert(x >= left && y >= top && x + w <= xCuts[column + 1] && y + h <= yCuts[row + 1], `Rectangle crosses cell boundary in ${atlas.id} cell ${index + 1}`);
      return { id: cell?.id ?? null, ...(cell?.key ? { key: cell.key } : {}), cell: index + 1, row, column, rect, ...(cell?.selected === false ? { selected: false } : {}) };
    });
    const result = await page.evaluate(async ({ data, atlas, cells, outputWidth, outputHeight, padding, alpha }) => {
      const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
      const stats = c => {
        const d = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height).data;
        const bounds = [1, 16, 128].map(threshold => ({ threshold, x: c.width, y: c.height, right: -1, bottom: -1 }));
        let transparent = 0, partial = 0, opaque = 0, maxAlpha = 0, boundaryMaxAlpha = 0, boundaryNonzero = 0;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
          const a = d[(y * c.width + x) * 4 + 3];
          if (a === 0) transparent++; else if (a === 255) opaque++; else partial++;
          maxAlpha = Math.max(maxAlpha, a);
          if (x === 0 || y === 0 || x === c.width - 1 || y === c.height - 1) { boundaryMaxAlpha = Math.max(boundaryMaxAlpha, a); if (a) boundaryNonzero++; }
          for (const b of bounds) if (a >= b.threshold) { b.x = Math.min(b.x, x); b.y = Math.min(b.y, y); b.right = Math.max(b.right, x); b.bottom = Math.max(b.bottom, y); }
        }
        return { transparent, partial, opaque, maxAlpha, boundaryMaxAlpha, boundaryNonzero, bounds: bounds.map(b => ({ threshold: b.threshold, rect: b.right < 0 ? null : [b.x, b.y, b.right - b.x + 1, b.bottom - b.y + 1] })) };
      };
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      if (image.width !== atlas.width || image.height !== atlas.height) throw new Error(`Source dimensions mismatch: ${atlas.id}`);
      const entries = [];
      for (const cell of cells) {
        const [x, y, w, h] = cell.rect;
        const crop = canvas(w, h);
        crop.getContext('2d').drawImage(image, x, y, w, h, 0, 0, w, h);
        const sourceAlpha = stats(crop);
        if (cell.selected === false) { entries.push({ ...cell, sourceAlpha }); continue; }
        if (cell.id === null) {
          if (sourceAlpha.maxAlpha > alpha.blankMaxAlpha) throw new Error(`Blank cell contains artwork: ${atlas.id} ${cell.cell}`);
          entries.push({ ...cell, sourceAlpha, blank: true }); continue;
        }
        if (sourceAlpha.maxAlpha < 128 || sourceAlpha.transparent === 0) throw new Error(`Missing content or transparency: ${atlas.id} ${cell.id}`);
        if (sourceAlpha.boundaryMaxAlpha > alpha.boundaryMaxAlpha) throw new Error(`Visible content reaches crop boundary: ${atlas.id} ${cell.id} alpha=${sourceAlpha.boundaryMaxAlpha}`);
        const scale = Math.min((outputWidth - 2 * padding) / w, (outputHeight - 2 * padding) / h);
        const destinationRect = [(outputWidth - w * scale) / 2, (outputHeight - h * scale) / 2, w * scale, h * scale];
        const final = canvas(outputWidth, outputHeight);
        const ctx = final.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(crop, ...destinationRect);
        const outputAlpha = stats(final);
        if (outputAlpha.boundaryMaxAlpha !== 0 || outputAlpha.transparent === 0) throw new Error(`Export loses clear exterior: ${atlas.id} ${cell.id}`);
        entries.push({ ...cell, sourceAlpha, scale, destinationRect, outputAlpha, png: final.toDataURL('image/png').split(',')[1] });
      }
      return entries;
    }, { data: bytes.toString('base64'), atlas, cells, outputWidth, outputHeight, padding, alpha: { ...manifest.alphaValidation, ...atlas.alphaValidation } });
    const atlasRecord = { id: atlas.id, anonymousLabel: atlas.anonymousLabel, sourceFile: atlas.sourceFile, sourceOriginalPath: atlas.sourceOriginalPath, sourceSha256: atlas.sourceSha256, promptReference: atlas.promptReference, batchReference: atlas.batchReference, referenceInputs: atlas.referenceInputs, sourceDimensions: [atlas.width, atlas.height], columns: atlas.columns, rows: atlas.rows, columnBoundaries: xCuts, rowBoundaries: yCuts, cells: [] };
    for (const entry of result) {
      const { png, ...metadata } = entry;
      if (png) {
        const file = manifest.output.flat ? `icons/${entry.id}.png` : `icons/${atlas.id}/${entry.id}.png`;
        assert(!outputFiles.has(file), `Multiple selected sources would overwrite ${file}`);
        outputFiles.add(file);
        const exported = Buffer.from(png, 'base64');
        await mkdir(path.dirname(path.join(output, file)), { recursive: true });
        await writeFile(path.join(output, file), exported);
        Object.assign(metadata, { outputFile: file, outputSha256: sha(exported) });
        allExports.push({ file, data: png, label: `${atlas.anonymousLabel}${entry.cell}`, cell: entry.cell, atlas: atlas.id });
      }
      atlasRecord.cells.push(metadata);
    }
    record.atlases.push(atlasRecord);
  }
  // Layout uses final exports. Font and labels live outside the image rectangles.
  for (const displaySize of manifest.comparison.sizes) {
    assert(Number.isInteger(displaySize) && displaySize > 0, 'Invalid comparison size');
    const displayHeight = displaySize * outputHeight / outputWidth;
    const sheet = await page.evaluate(async ({ allExports, atlases, displaySize, displayHeight, background, columns }) => {
      const margin = 20, gap = 16, labelHeight = 21, heading = 32, sectionGap = 24;
      const width = 2 * margin + columns * displaySize + (columns - 1) * gap;
      const counts = atlases.map(atlas => allExports.filter(item => item.atlas === atlas.id).length);
      const sectionHeights = counts.map(count => heading + Math.ceil(count / columns) * (displayHeight + labelHeight + gap));
      const height = 2 * margin + sectionHeights.reduce((a, b) => a + b, 0) + (atlases.length - 1) * sectionGap;
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      const ctx = c.getContext('2d'); ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      let top = margin;
      const imageRects = [];
      for (let a = 0; a < atlases.length; a++) {
        const atlas = atlases[a]; ctx.fillStyle = '#292d31'; ctx.textAlign = 'left'; ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${atlas.anonymousLabel} · ${displaySize === displayHeight ? displaySize : `${displaySize} × ${displayHeight}`} px`, margin, top + 17);
        const items = allExports.filter(item => item.atlas === atlas.id);
        for (let i = 0; i < items.length; i++) {
          const x = margin + i % columns * (displaySize + gap), y = top + heading + Math.floor(i / columns) * (displayHeight + labelHeight + gap);
          const image = new Image(); image.src = `data:image/png;base64,${items[i].data}`; await image.decode();
          ctx.drawImage(image, x, y, displaySize, displayHeight);
          ctx.fillStyle = '#292d31'; ctx.textAlign = 'center'; ctx.font = '12px sans-serif';
          ctx.fillText(items[i].label, x + displaySize / 2, y + displayHeight + 16);
          imageRects.push({ label: items[i].label, source: items[i].file, rect: [x, y, displaySize, displayHeight] });
        }
        top += sectionHeights[a] + sectionGap;
      }
      return { width, height, imageRects, png: c.toDataURL('image/png').split(',')[1] };
    }, { allExports, atlases: manifest.atlases, displaySize, displayHeight, background: manifest.comparison.background, columns: manifest.comparison.columns });
    const { png, ...metadata } = sheet;
    const file = `comparison-${displaySize}px.png`, bytes = Buffer.from(png, 'base64');
    await writeFile(path.join(output, file), bytes);
    record.comparisons.push({ file, sha256: sha(bytes), displaySize, background: manifest.comparison.background, ...metadata });
  }
  await mkdir(output, { recursive: true });
  const recordPath = manifest.recordFile ? path.resolve(base, manifest.recordFile) : path.join(output, 'extraction-record.json');
  await mkdir(path.dirname(recordPath), { recursive: true });
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`);
  console.log(`Exported ${allExports.length} icons and ${record.comparisons.length} comparison sheets to ${output}`);
} finally {
  await browser.close();
}
