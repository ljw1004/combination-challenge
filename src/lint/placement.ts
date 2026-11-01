import type {Diagnostic, Story} from '../story/types.ts';
import {containsPoint, hotspotRect, type HotspotMeasurement} from '../web/hotspot-view.ts';

/** Geometry is supplied by the renderer, never inferred from text length or image filenames. */
export function lintPlacementGeometry(story: Story, measurements: HotspotMeasurement[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const size of measurements) {
    const hotspot = story.hotspots[size.id], chapter = story.chapters[size.chapter];
    const rect = hotspotRect(hotspot, chapter.hotspots.indexOf(hotspot.id), size);
    for (const place of hotspot.placements ?? []) {
      if (![place.x, place.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) continue;
      if (containsPoint(rect, {x: place.x * 390, y: place.y * 844})) continue;
      diagnostics.push({severity: 'error', code: 'place-outside-hotspot', message: `The prescribed centre is outside ${hotspot.name}'s hit ${rect.circular ? 'circle' : 'rectangle'} in ${chapter.name}.`, source: place.source, span: place.source.span!, stage: 'fast'});
    }
  }
  return diagnostics;
}
