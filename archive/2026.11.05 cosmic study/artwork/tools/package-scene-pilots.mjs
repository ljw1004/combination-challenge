import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// Rectangular panel extraction and comparison layout; never paints scene content.
const manifestPath = path.resolve(process.argv[2]);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const base = path.dirname(manifestPath);
const output = path.resolve(process.argv[3] ?? base);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const record = { schemaVersion: 1, status: manifest.status, manifestSha256: sha(await readFile(manifestPath)), chromium: browser.version(), operation: 'Isolated rectangular crops; uniform cover resize, top aligned; sample overlays copied from exported icons. No repainting.', sources: [] };
  for (const source of manifest.sources) {
    const bytes = await readFile(path.resolve(base, source.file));
    if (sha(bytes) !== source.sha256) throw new Error(`Source hash mismatch: ${source.file}`);
    const overlays = await Promise.all(source.panels.map(async panel => Promise.all((panel.overlays ?? []).map(async overlay => {
      const data = await readFile(path.resolve(base, overlay.file));
      return { ...overlay, sha256: sha(data), data: data.toString('base64') };
    }))));
    const result = await page.evaluate(async ({ source, data, overlays }) => {
      const load = async data => { const i = new Image(); i.src = `data:image/png;base64,${data}`; await i.decode(); return i; };
      const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
      const image = await load(data);
      if (image.width !== source.width || image.height !== source.height) throw new Error('Source dimensions mismatch');
      const sheet = canvas(40 + source.panels.length * 390 + (source.panels.length - 1) * 20, 904);
      const sheetCtx = sheet.getContext('2d'); sheetCtx.fillStyle = '#f3f1eb'; sheetCtx.fillRect(0, 0, sheet.width, sheet.height);
      sheetCtx.fillStyle = '#292d31'; sheetCtx.font = 'bold 16px sans-serif'; sheetCtx.fillText(`${source.label} · composition study · 390 × 844 px`, 20, 25);
      const panels = [];
      for (let index = 0; index < source.panels.length; index++) {
        const panel = source.panels[index], [x, y, w, h] = panel.rect;
        if (![x, y, w, h].every(Number.isInteger) || x < 0 || y < 0 || w < 1 || h < 1 || x + w > image.width || y + h > image.height) throw new Error('Invalid panel rectangle');
        const crop = canvas(w, h); crop.getContext('2d').drawImage(image, x, y, w, h, 0, 0, w, h);
        const final = canvas(780, 1688), ctx = final.getContext('2d');
        const scale = Math.max(780 / w, 1688 / h), destinationRect = [(780 - w * scale) / 2, 0, w * scale, h * scale];
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(crop, ...destinationRect);
        const left = 20 + index * 410;
        sheetCtx.drawImage(final, left, 40, 390, 844);
        for (const overlay of overlays[index]) {
          const icon = await load(overlay.data);
          const width = overlay.width ?? overlay.size, height = width * icon.height / icon.width;
          sheetCtx.drawImage(icon, left + overlay.x, 40 + overlay.y, width, height);
          if (overlay.label) { sheetCtx.fillStyle = '#292d31'; sheetCtx.font = '12px sans-serif'; sheetCtx.fillText(overlay.label, left + overlay.x + width / 2 - 7, 40 + overlay.y + height + 15); }
        }
        panels.push({ id: panel.id, status: panel.status, sourceRect: panel.rect, outputDimensions: [780, 1688], scale, destinationRect, overlays: overlays[index].map(({ data, ...entry }) => entry), png: final.toDataURL('image/png').split(',')[1] });
      }
      return { panels, comparison: sheet.toDataURL('image/png').split(',')[1], comparisonDimensions: [sheet.width, sheet.height] };
    }, { source, data: bytes.toString('base64'), overlays });
    const sourceRecord = { file: source.file, originalPath: source.originalPath, promptReference: source.promptReference, sha256: source.sha256, sourceDimensions: [source.width, source.height], panels: [] };
    for (const { png, ...panel } of result.panels) {
      const requested = source.panels.find(entry => entry.id === panel.id)?.outputFile;
      const file = requested ?? `${source.id}-${panel.id}.png`, bytes = Buffer.from(png, 'base64');
      if (path.basename(file) !== file) throw new Error(`Output must be a filename: ${file}`);
      await writeFile(path.join(output, file), bytes);
      sourceRecord.panels.push({ ...panel, outputFile: file, outputSha256: sha(bytes) });
    }
    if (manifest.comparison !== false) {
      const file = `${source.id}-composition.png`, sheet = Buffer.from(result.comparison, 'base64');
      await writeFile(path.join(output, file), sheet);
      sourceRecord.comparison = { file, sha256: sha(sheet), dimensions: result.comparisonDimensions, panelDisplayDimensions: [390, 844] };
    }
    record.sources.push(sourceRecord);
  }
  const recordPath = manifest.recordFile ? path.resolve(base, manifest.recordFile) : path.join(output, 'scene-extraction-record.json');
  await mkdir(path.dirname(recordPath), { recursive: true });
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`);
  console.log(`Packaged ${record.sources.length} scene pairs in ${output}`);
} finally {
  await browser.close();
}
