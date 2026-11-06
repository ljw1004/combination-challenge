import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {chromium, type Browser} from '@playwright/test';
import type {Diagnostic, Story} from '../story/types.ts';
import {escape} from '../web/markdown.ts';
import {hotspotProbeHTML, iconDimensions, measureHotspots} from '../web/hotspot-view.ts';
import {lintPlacementGeometry} from './placement.ts';
import {background} from '../engine/analysis.ts';
import {hotspotDefinition} from '../engine/fixed-items.ts';
import {sceneSize} from '../web/board-geometry.ts';

const css = ['style.css', 'item-artwork.css'].map(file => readFileSync(new URL(`../web/${file}`, import.meta.url), 'utf8')).join('\n');

/** Reuse one browser across manuscripts. Only stories with place: need geometry lint. */
export class PlacementBrowser {
  private browser?: Browser;

  async lint(story: Story): Promise<Diagnostic[]> {
    const placements = story.chapters.flatMap(chapter=>Object.values(chapter.hotspotDefinitions??{})).flatMap(h => h.placements ?? []);
    if (!placements.length) return [];
    const failure = (message: string): Diagnostic[] => placements.map(p => ({severity: 'error', code: 'place-geometry', message, source: p.source, span: p.source.span!, stage: 'fast'}));
    try { this.browser ??= await chromium.launch(); }
    catch { return failure('Cannot verify hotspot hit areas. Install the lint/test browser with npx playwright install chromium, then rerun lint.'); }
    const page = await this.browser.newPage({viewport: {width: 390, height: 844}});
    try {
      const imageURL = (path:string) => {
        if (/^https?:\/\//i.test(path)) return path;
        const mime = /\.svg$/i.test(path) ? 'image/svg+xml' : /\.webp$/i.test(path) ? 'image/webp' : /\.jpe?g$/i.test(path) ? 'image/jpeg' : /\.gif$/i.test(path) ? 'image/gif' : 'image/png';
        return `data:${mime};base64,${readFileSync(resolve(dirname(story.source.file), path)).toString('base64')}`;
      };
      const backgrounds = [...new Set(story.chapters.flatMap((chapter,i) => chapter.hotspots.some(id => hotspotDefinition(story,i,id)?.placements?.length) ? [background(story,i)].filter((path):path is string=>!!path) : []))];
      const sizes = await page.evaluate(async urls => Promise.all(urls.map(async url => {
        const image = new Image(); image.src=url;
        await Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,8000))]);
        return {width:image.naturalWidth,height:image.naturalHeight};
      })), backgrounds.map(imageURL));
      if (sizes.some(size=>!size.width||!size.height)) return failure('Cannot verify placement because background artwork could not be decoded.');
      const markup = hotspotProbeHTML(story, h => {
        if (!h.icon) return {className: '', style: '', html: escape(h.name)};
        const url = imageURL(h.icon.url);
        return {className: `hotspot-icon${h.icon.circular ? ' hotspot-circular' : ''}`, style: '', html: `<span class="icon-stack"><img src="${escape(url)}"></span>`};
      }, chapter => sceneSize(sizes[backgrounds.indexOf(background(story,chapter)!)]));
      await page.setContent(`<style>${css}</style><div class="board fixed-locations" style="--board-scale:1">${markup}</div>`, {waitUntil: 'domcontentloaded'});
      const images = await page.locator('[data-hotspot] img').evaluateAll(async images => Promise.all(images.map(async node => {
        const img = node as HTMLImageElement;
        await Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]);
        return {id: img.closest<HTMLElement>('[data-hotspot]')!.dataset.hotspot!, chapter: Number(img.closest<HTMLElement>('[data-chapter]')!.dataset.chapter), variant: Number(img.closest<HTMLElement>('[data-icon-variant]')!.dataset.iconVariant), width: img.naturalWidth, height: img.naturalHeight};
      })));
      if (images.some(image => !image.width || !image.height)) return failure('Cannot verify placement because hotspot artwork could not be decoded.');
      await page.evaluate(sizes => {
        for (const el of document.querySelectorAll<HTMLElement>('[data-hotspot]')) {
          const size = sizes.find(s => s.id === el.dataset.hotspot && s.chapter === Number(el.closest<HTMLElement>('[data-chapter]')!.dataset.chapter) && s.variant === Number(el.closest<HTMLElement>('[data-icon-variant]')!.dataset.iconVariant));
          if (size) { el.style.setProperty('--icon-width', `${size.width}px`); el.style.setProperty('--icon-height', `${size.height}px`); }
        }
      }, images.map(image => ({id: image.id, chapter:image.chapter, variant:image.variant, ...iconDimensions(image.width, image.height, true)})));
      return lintPlacementGeometry(story, await page.evaluate(measureHotspots, await page.evaluateHandle(() => document)));
    } catch (error) { return failure(`Cannot verify hotspot placement geometry: ${(error as Error).message}`); }
    finally { await page.close(); }
  }

  async close() { await this.browser?.close(); }
}
