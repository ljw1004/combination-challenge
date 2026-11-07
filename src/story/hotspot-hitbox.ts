import type {HotspotHitbox} from './types.ts';
import {validCentre, type ImageSize} from './coordinates.ts';

/** Invalid live edits fall back to the ordinary artwork-shaped receiver. */
export function validHitbox(box: HotspotHitbox | undefined, image?: ImageSize): box is HotspotHitbox {
  return !!box && [box.x, box.y, box.width, box.height].every(Number.isFinite)
    && validCentre(box, image) && box.width > 0 && box.height > 0
    && (!image || box.width <= image.width && box.height <= image.height);
}
