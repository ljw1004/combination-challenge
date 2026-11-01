import type {Hotspot, Story} from '../story/types.ts';
import {escape} from './markdown.ts';

export interface Rect {x: number; y: number; width: number; height: number}
export interface HotspotRegion extends Rect {circular?: boolean}
export interface HotspotMeasurement {id: string; chapter: number; width: number; height: number; circular?: boolean}
export interface HotspotVisual {className: string; style: string; html: string}

export function iconDimensions(width: number, height: number) {
  const fit = Math.min(1, 1448 / width);
  return {width: width / 4 * fit, height: height / 4 * fit};
}
const referenceBounds = {x: 0, y: 0, width: 390, height: 844};
export function hotspotCentre(hotspot: Hotspot, index: number, bounds = referenceBounds) {
  return {
    x: hotspot.x === undefined ? bounds.x + (.19 + index % 3 * .31) * bounds.width : hotspot.x * 390,
    y: hotspot.y === undefined ? (.70 + Math.floor(index / 3) * .13) * bounds.height : hotspot.y * 844,
  };
}
export function hotspotRect(hotspot: Hotspot, index: number, size: {width: number; height: number; circular?: boolean}, scale = 1, bounds = referenceBounds): HotspotRegion {
  const centre = hotspotCentre(hotspot, index, bounds);
  if (size.circular ?? hotspot.icon?.circular) {
    const diameter = Math.max(Math.min(size.width, size.height), 44 / scale);
    return {x: centre.x - diameter / 2, y: centre.y - diameter / 2, width: diameter, height: diameter, circular: true};
  }
  const width = Math.max(size.width, 44 / scale), height = Math.max(size.height, 44 / scale);
  return {x: centre.x - width / 2, y: centre.y - height / 2, width, height};
}
export function containsPoint(rect: HotspotRegion, point: {x: number; y: number}) {
  // Keep authored boundary points inclusive despite floating-point percentage conversion.
  if (rect.circular) return Math.hypot(point.x - rect.x - rect.width / 2, point.y - rect.y - rect.height / 2) <= rect.width / 2 + 1e-7;
  return point.x >= rect.x - 1e-7 && point.x <= rect.x + rect.width + 1e-7 && point.y >= rect.y - 1e-7 && point.y <= rect.y + rect.height + 1e-7;
}

/** Positive-area intersection; touching a station's boundary is permitted. */
export function overlapsHotspot(item: Rect, hotspot: HotspotRegion): boolean {
  if (!hotspot.circular) return item.x < hotspot.x + hotspot.width && item.x + item.width > hotspot.x && item.y < hotspot.y + hotspot.height && item.y + item.height > hotspot.y;
  const cx = hotspot.x + hotspot.width / 2, cy = hotspot.y + hotspot.height / 2;
  const x = Math.max(item.x, Math.min(item.x + item.width, cx)), y = Math.max(item.y, Math.min(item.y + item.height, cy));
  return Math.hypot(x - cx, y - cy) < hotspot.width / 2 - 1e-7;
}
export function hotspotHTML(h: Hotspot, index: number, visual: HotspotVisual, bounds = referenceBounds) {
  const {x, y} = hotspotCentre(h, index, bounds);
  return `<div class="hotspot ${visual.className}" data-hotspot="${escape(h.id)}" tabindex="0" role="img" aria-label="${escape(h.name)}" style="left:${x-bounds.x}px;top:${y}px;${visual.style}">${visual.html}</div>`;
}

/** All declared surfaces, including unvisited ones, at the canonical 390px width. */
export function hotspotProbeHTML(story: Story, visual: (h: Hotspot) => HotspotVisual) {
  return story.chapters.map((chapter, i) => `<section class="chapter-panel" data-chapter="${i}">${chapter.hotspots.filter(id => story.hotspots[id].placements?.length).map(id => hotspotHTML(story.hotspots[id], chapter.hotspots.indexOf(id), visual(story.hotspots[id]))).join('')}</section>`).join('');
}

/** Self-contained so CLI Chromium and the live editor use the same DOM measurement. */
export function measureHotspots(root: ParentNode): HotspotMeasurement[] {
  return [...root.querySelectorAll<HTMLElement>('[data-hotspot]')].map(el => {
    const {width, height} = el.getBoundingClientRect();
    return {id: el.dataset.hotspot!, chapter: Number(el.closest<HTMLElement>('[data-chapter]')!.dataset.chapter), width, height, circular: el.classList.contains('hotspot-circular')};
  });
}
