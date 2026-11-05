import type {HotspotHitbox} from './types.ts';

/** Invalid live edits fall back to the ordinary artwork-shaped receiver. */
export function validHitbox(box: HotspotHitbox | undefined): box is HotspotHitbox {
  return !!box && [box.x, box.y, box.width, box.height].every(Number.isFinite)
    && box.x >= 0 && box.x <= 1 && box.y >= 0 && box.y <= 1
    && box.width > 0 && box.width <= 1 && box.height > 0 && box.height <= 1;
}
