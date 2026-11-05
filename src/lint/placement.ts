import type {Diagnostic, Story} from '../story/types.ts';
import {containsPoint, hotspotRect, type HotspotMeasurement} from '../web/hotspot-view.ts';
import {activeHotspots, hotspotDefinition} from '../engine/fixed-items.ts';

/** Geometry is supplied by the renderer, never inferred from text length or image filenames. */
export function lintPlacementGeometry(story: Story, measurements: HotspotMeasurement[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const size of measurements) {
    const hotspot = hotspotDefinition(story,size.chapter,size.id), chapter = story.chapters[size.chapter];
    const scene = size.scene ?? {width:390,height:844};
    const rect = hotspotRect(hotspot, activeHotspots(story,size.chapter).indexOf(hotspot.id), size, 1, {x:0,y:0,...scene}, scene);
    for (const place of hotspot.placements ?? []) {
      if (![place.x, place.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) continue;
      if (containsPoint(rect, {x: place.x * scene.width, y: place.y * scene.height})) continue;
      diagnostics.push({severity: 'error', code: 'place-outside-hotspot', message: `The prescribed centre is outside ${hotspot.name}'s hit ${rect.circular ? 'circle' : 'rectangle'} in ${chapter.name}.`, source: place.source, span: place.source.span!, stage: 'fast'});
    }
  }
  return diagnostics;
}
