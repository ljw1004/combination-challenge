import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {chromium, type Browser} from '@playwright/test';
import type {Diagnostic, Story} from '../story/types.ts';
import {escape} from '../web/markdown.ts';
import {hotspotProbeHTML, iconDimensions, measureHotspots} from '../web/hotspot-view.ts';
import {lintPlacementGeometry} from './placement.ts';
import {background} from '../engine/analysis.ts';
import {sceneSize} from '../web/board-geometry.ts';
import {storyIconDiagnostics} from './story-icons.ts';
import {coordinateEntries, lintCoordinateGeometry} from './coordinates.ts';

const css = ['style.css', 'item-artwork.css'].map(file => readFileSync(new URL(`../web/${file}`, import.meta.url), 'utf8')).join('\n');

function imageURL(story: Story, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const mime = /\.svg$/i.test(path) ? 'image/svg+xml' : /\.webp$/i.test(path) ? 'image/webp' : /\.jpe?g$/i.test(path) ? 'image/jpeg' : /\.gif$/i.test(path) ? 'image/gif' : 'image/png';
  return `data:${mime};base64,${readFileSync(resolve(dirname(story.source.file), path)).toString('base64')}`;
}

/** Reuse the browser for story-icon dimensions and optional hotspot geometry. */
export class ArtworkBrowser {
  private browser?: Browser;

  async lint(story: Story): Promise<Diagnostic[]> {
    return [...await this.lintIcons(story), ...await this.lintGeometry(story)];
  }

  private async lintIcons(story: Story): Promise<Diagnostic[]> {
    const images = story.titleImages ?? [];
    if (!images.length) return []; // Presence is checked by ordinary fast lint.
    try { this.browser ??= await chromium.launch(); }
    catch {
      return images.map(image => ({severity: 'error', code: 'story-icon-image', message: 'Cannot verify story icons. Install the lint/test browser with npx playwright install chromium, then rerun lint.', source: image.source, span: image.source.span!, stage: 'fast'}));
    }
    const page = await this.browser.newPage();
    try {
      const urls = images.map(image => {
        try { return imageURL(story, image.url); }
        catch { return ''; }
      });
      const sizes = await page.evaluate(async urls => Promise.all(urls.map(async url => {
        if (!url) return {width: 0, height: 0};
        const image = new Image(); image.src = url;
        await Promise.race([image.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]);
        return {width: image.naturalWidth, height: image.naturalHeight};
      })), urls);
      return storyIconDiagnostics(story, images.map((image, i) => ({url: image.url, ...sizes[i]})));
    } finally { await page.close(); }
  }

  private async lintGeometry(story: Story): Promise<Diagnostic[]> {
    const placements = story.chapters.flatMap(chapter=>Object.values(chapter.hotspotDefinitions??{})).flatMap(h => h.placements ?? []);
    const coordinates = coordinateEntries(story);
    if (!placements.length && !coordinates.length) return [];
    const failure = (message: string, code = 'coordinate-geometry'): Diagnostic[] => (code === 'place-geometry' ? placements : coordinates).map(p => ({severity: 'error', code, message, source: p.source, span: p.source.span!, stage: 'fast'}));
    try { this.browser ??= await chromium.launch(); }
    catch { return failure('Cannot verify hotspot hit areas. Install the lint/test browser with npx playwright install chromium, then rerun lint.'); }
    const page = await this.browser.newPage({viewport: {width: 390, height: 844}});
    try {
      const asset = (path: string) => imageURL(story, path);
      const chapters = [...new Set(coordinates.map(entry => entry.chapter))];
      const backgrounds = [...new Set(chapters.map(chapter => background(story,chapter)))];
      const sizes = await page.evaluate(async urls => Promise.all(urls.map(async url => {
        if (!url) return {width:0,height:0};
        const image = new Image(); image.src=url;
        await Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,8000))]);
        return {width:image.naturalWidth,height:image.naturalHeight};
      })), backgrounds.map(path => {try { return path ? asset(path) : ''; } catch { return ''; }}));
      const boundsDiagnostics = lintCoordinateGeometry(story, chapters.map(chapter => ({chapter,...sizes[backgrounds.indexOf(background(story,chapter))]})));
      if (!placements.length || sizes.some(size=>!size.width||!size.height)) return boundsDiagnostics;
      const markup = hotspotProbeHTML(story, h => {
        if (!h.icon) return {className: '', style: '', html: escape(h.name)};
        const url = asset(h.icon.url);
        return {className: `hotspot-icon${h.icon.circular ? ' hotspot-circular' : ''}`, style: '', html: `<span class="icon-stack"><img src="${escape(url)}"></span>`};
      }, chapter => sceneSize(sizes[backgrounds.indexOf(background(story,chapter)!)]));
      await page.setContent(`<style>${css}</style><div class="board fixed-locations" style="--board-scale:1">${markup}</div>`, {waitUntil: 'domcontentloaded'});
      const images = await page.locator('[data-hotspot] img').evaluateAll(async images => Promise.all(images.map(async node => {
        const img = node as HTMLImageElement;
        await Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]);
        return {id: img.closest<HTMLElement>('[data-hotspot]')!.dataset.hotspot!, chapter: Number(img.closest<HTMLElement>('[data-chapter]')!.dataset.chapter), variant: Number(img.closest<HTMLElement>('[data-icon-variant]')!.dataset.iconVariant), width: img.naturalWidth, height: img.naturalHeight};
      })));
      if (images.some(image => !image.width || !image.height)) return [...boundsDiagnostics, ...failure('Cannot verify placement because hotspot artwork could not be decoded.', 'place-geometry')];
      await page.evaluate(sizes => {
        for (const el of document.querySelectorAll<HTMLElement>('[data-hotspot]')) {
          const size = sizes.find(s => s.id === el.dataset.hotspot && s.chapter === Number(el.closest<HTMLElement>('[data-chapter]')!.dataset.chapter) && s.variant === Number(el.closest<HTMLElement>('[data-icon-variant]')!.dataset.iconVariant));
          if (size) { el.style.setProperty('--icon-width', `${size.width}px`); el.style.setProperty('--icon-height', `${size.height}px`); }
        }
      }, images.map(image => ({id: image.id, chapter:image.chapter, variant:image.variant, ...iconDimensions(image.width, image.height, true)})));
      return [...boundsDiagnostics, ...lintPlacementGeometry(story, await page.evaluate(measureHotspots, await page.evaluateHandle(() => document)))];
    } catch (error) { return failure(`Cannot verify hotspot placement geometry: ${(error as Error).message}`, placements.length ? 'place-geometry' : 'coordinate-geometry'); }
    finally { await page.close(); }
  }

  async close() { await this.browser?.close(); }
}
