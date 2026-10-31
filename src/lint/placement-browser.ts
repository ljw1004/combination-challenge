import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {chromium, type Browser} from '@playwright/test';
import type {Diagnostic, Story} from '../story/types.ts';
import {escape} from '../web/markdown.ts';
import {hotspotProbeHTML, iconDimensions, measureHotspots} from '../web/hotspot-view.ts';
import {lintPlacementGeometry} from './placement.ts';

const css = ['style.css', 'item-artwork.css'].map(file => readFileSync(new URL(`../web/${file}`, import.meta.url), 'utf8')).join('\n');

/** Reuse one browser across manuscripts. Only stories with place: need geometry lint. */
export class PlacementBrowser {
  private browser?: Browser;

  async lint(story: Story): Promise<Diagnostic[]> {
    const placements = Object.values(story.hotspots).flatMap(h => h.placements ?? []);
    if (!placements.length) return [];
    const failure = (message: string): Diagnostic[] => placements.map(p => ({severity: 'error', code: 'place-geometry', message, source: p.source, span: p.source.span!, stage: 'fast'}));
    try { this.browser ??= await chromium.launch(); }
    catch { return failure('Cannot verify hotspot hit rectangles. Install the lint/test browser with npx playwright install chromium, then rerun lint.'); }
    const page = await this.browser.newPage({viewport: {width: 390, height: 844}});
    try {
      const markup = hotspotProbeHTML(story, h => {
        if (!h.icon) return {className: '', style: '', html: escape(h.name)};
        let url = h.icon.url;
        if (!/^https?:\/\//i.test(url)) {
          const mime = /\.svg$/i.test(url) ? 'image/svg+xml' : /\.webp$/i.test(url) ? 'image/webp' : /\.jpe?g$/i.test(url) ? 'image/jpeg' : /\.gif$/i.test(url) ? 'image/gif' : 'image/png';
          url = `data:${mime};base64,${readFileSync(resolve(dirname(story.source.file), url)).toString('base64')}`;
        }
        return {className: `hotspot-icon${h.icon.circular ? ' hotspot-circular' : ''}`, style: '', html: `<span class="icon-stack"><img src="${escape(url)}"></span>`};
      });
      await page.setContent(`<style>${css}</style><div class="board fixed-locations" style="--board-scale:1">${markup}</div>`, {waitUntil: 'domcontentloaded'});
      const images = await page.locator('[data-hotspot] img').evaluateAll(async images => Promise.all(images.map(async node => {
        const img = node as HTMLImageElement;
        await Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]);
        return {id: img.closest<HTMLElement>('[data-hotspot]')!.dataset.hotspot!, width: img.naturalWidth, height: img.naturalHeight};
      })));
      if (images.some(image => !image.width || !image.height)) return failure('Cannot verify placement because hotspot artwork could not be decoded.');
      await page.evaluate(sizes => {
        for (const el of document.querySelectorAll<HTMLElement>('[data-hotspot]')) {
          const size = sizes.find(s => s.id === el.dataset.hotspot);
          if (size) { el.style.setProperty('--icon-width', `${size.width}px`); el.style.setProperty('--icon-height', `${size.height}px`); }
        }
      }, images.map(image => ({id: image.id, ...iconDimensions(image.width, image.height)})));
      return lintPlacementGeometry(story, await page.evaluate(measureHotspots, await page.evaluateHandle(() => document)));
    } catch (error) { return failure(`Cannot verify hotspot placement geometry: ${(error as Error).message}`); }
    finally { await page.close(); }
  }

  async close() { await this.browser?.close(); }
}
