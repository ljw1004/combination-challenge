import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const project = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node build-review-sheets.mjs [--compact] [output-directory] [asset-manifest.json]\nDefault: per-source verification sheets under runs/cosmic-production-review.\n--compact: three authoring contact sheets under artwork/contact-sheets.');
  process.exit(0);
}
const compact = args.includes('--compact');
const positional = args.filter(arg => arg !== '--compact');
const manifest = JSON.parse(await readFile(positional[1] ?? path.join(project, 'artwork/production/asset-manifest.json')));
const output = path.resolve(positional[0] ?? (compact ? path.join(project, 'artwork/contact-sheets') : 'runs/cosmic-production-review'));
await mkdir(output, { recursive: true });
const previous = await readFile(path.join(output, 'sheets.json'), 'utf8').then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
const groups = new Map();
for (const asset of manifest.assets) {
  const group = compact ? asset.kind : `${asset.kind}-${asset.sourceId}`;
  if (!groups.has(group)) groups.set(group, []);
  const bytes = await readFile(path.resolve(project, asset.file));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Stale manifest: ${asset.file}`);
  groups.get(group).push({ ...asset, data: bytes.toString('base64') });
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const records = [];
  for (const [name, assets] of groups) {
    const kind = assets[0].kind;
    const width = kind === 'backgrounds' ? (compact ? 195 : 390) : kind === 'hotspots' ? 160 : 80;
    const columns = compact ? (kind === 'icons' ? 12 : 7) : kind === 'backgrounds' ? 3 : kind === 'hotspots' && assets.length !== 8 ? 3 : 4;
    const result = await page.evaluate(async ({ assets, width, columns, title }) => {
      const margin = 16, labelHeight = 40, heading = 30;
      const height = width * assets[0].dimensions[1] / assets[0].dimensions[0];
      const cellWidth = Math.max(width + 24, 168), cellHeight = height + labelHeight + 16;
      const canvas = document.createElement('canvas'); canvas.width = margin * 2 + Math.min(columns, assets.length) * cellWidth; canvas.height = margin * 2 + heading + Math.ceil(assets.length / columns) * cellHeight;
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#f3f1eb'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#292d31'; ctx.font = '14px sans-serif'; ctx.fillText(`${title} · ${width} × ${height} px`, margin, margin + 15);
      const rects = [];
      for (let index = 0; index < assets.length; index++) {
        const asset = assets[index], x = margin + index % columns * cellWidth + (cellWidth - width) / 2, y = margin + heading + Math.floor(index / columns) * cellHeight;
        const image = new Image(); image.src = `data:image/png;base64,${asset.data}`; await image.decode(); ctx.drawImage(image, x, y, width, height);
        ctx.fillStyle = '#292d31'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        const parts = asset.id.match(/.{1,25}(?:-|$)|.{1,25}/g) ?? [asset.id];
        parts.forEach((part, line) => ctx.fillText(part, x + width / 2, y + height + 16 + line * 13));
        rects.push({ file: asset.file, sha256: asset.sha256, rect: [x, y, width, height] });
      }
      return { png: canvas.toDataURL('image/png').split(',')[1], dimensions: [canvas.width, canvas.height], rects };
    }, { assets, width, columns, title: manifest.reviewTitle ?? (compact ? `Selected ${kind === 'icons' ? 'circular appearances' : kind === 'hotspots' ? 'fixed receivers' : 'backgrounds'} (${assets.length})` : 'Final exports') });
    const file = compact ? `${kind === 'icons' ? 'circles' : kind === 'hotspots' ? 'receivers' : kind}-${width}px.png` : `${name}.png`;
    const bytes = Buffer.from(result.png, 'base64');
    await writeFile(path.join(output, file), bytes);
    records.push({ file, sha256: createHash('sha256').update(bytes).digest('hex'), dimensions: result.dimensions, assets: result.rects });
  }
  await writeFile(path.join(output, 'sheets.json'), `${JSON.stringify(records, null, 2)}\n`);
  const current = new Set(records.map(record => record.file));
  for (const old of previous) if (!current.has(old.file) && path.basename(old.file) === old.file) await rm(path.join(output, old.file), { force: true });
  console.log(`Created ${records.length} final-export review sheets in ${output}`);
} finally {
  await browser.close();
}
