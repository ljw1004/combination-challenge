import type {Hotspot, Story} from '../story/types.ts';
import {escape} from './markdown.ts';

export interface Rect {x: number; y: number; width: number; height: number}
export interface HotspotMeasurement {id: string; chapter: number; width: number; height: number}
export interface HotspotVisual {className: string; style: string; html: string}

export function iconDimensions(width: number, height: number) {
  const fit = Math.min(1, 1448 / width);
  return {width: width / 4 * fit, height: height / 4 * fit};
}
export function hotspotCentre(hotspot: Hotspot, index: number) {
  return {x: (hotspot.x ?? (.19 + index % 3 * .31)) * 390, y: (hotspot.y ?? (.70 + Math.floor(index / 3) * .13)) * 844};
}
export function hotspotRect(hotspot: Hotspot, index: number, size: {width: number; height: number}, scale = 1): Rect {
  const centre = hotspotCentre(hotspot, index);
  const width = Math.max(size.width, 44 / scale), height = Math.max(size.height, 44 / scale);
  return {x: centre.x - width / 2, y: centre.y - height / 2, width, height};
}
export function containsPoint(rect: Rect, point: {x: number; y: number}) {
  // Keep authored boundary points inclusive despite floating-point percentage conversion.
  return point.x >= rect.x - 1e-7 && point.x <= rect.x + rect.width + 1e-7 && point.y >= rect.y - 1e-7 && point.y <= rect.y + rect.height + 1e-7;
}
export function hotspotHTML(h: Hotspot, index: number, visual: HotspotVisual) {
  const {x, y} = hotspotCentre(h, index);
  return `<div class="hotspot ${visual.className}" data-hotspot="${escape(h.id)}" tabindex="0" role="img" aria-label="${escape(h.name)}" style="left:${x}px;top:${y}px;${visual.style}">${visual.html}</div>`;
}

/** All declared surfaces, including unvisited ones, at the canonical 390px width. */
export function hotspotProbeHTML(story: Story, visual: (h: Hotspot) => HotspotVisual) {
  return story.chapters.map((chapter, i) => `<section class="chapter-panel" data-chapter="${i}">${chapter.hotspots.filter(id => story.hotspots[id].placements?.length).map(id => hotspotHTML(story.hotspots[id], chapter.hotspots.indexOf(id), visual(story.hotspots[id]))).join('')}</section>`).join('');
}

/** Self-contained so CLI Chromium and the live editor use the same DOM measurement. */
export function measureHotspots(root: ParentNode): HotspotMeasurement[] {
  return [...root.querySelectorAll<HTMLElement>('[data-hotspot]')].map(el => {
    const {width, height} = el.getBoundingClientRect();
    return {id: el.dataset.hotspot!, chapter: Number(el.closest<HTMLElement>('[data-chapter]')!.dataset.chapter), width, height};
  });
}
