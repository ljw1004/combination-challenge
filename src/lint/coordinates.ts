import type {Diagnostic, Source, Story} from '../story/types.ts';
import {validCentre, type ImageSize, type Point} from '../story/coordinates.ts';
import {chapterNeeds, indexStory} from '../engine/analysis.ts';
import type {State} from '../engine/types.ts';

export interface BackgroundMeasurement extends ImageSize {chapter: number}
interface CoordinateEntry {chapter: number; source: Source; code: string; point: Point; size?: ImageSize}

/** Include every possible primitive arrival, even when goals supply it before its listing. */
export function coordinateEntries(story: Story): CoordinateEntry[] {
  const entries: CoordinateEntry[] = [], primitives = indexStory(story).primitives;
  const positioned = new Set(Object.values(story.items).filter(item => item.icon?.position && primitives.has(item.id)).map(item => item.id));
  const uncreated: State = {version:1,storyId:story.id,chapter:0,tokens:{},achieved:[],excluded:[],visited:[],newItems:[],arrivalDivider:false,seen:[],pending:[],completed:false,actions:[]};
  for (const [chapter, c] of story.chapters.entries()) {
    for (const h of Object.values(c.hotspotDefinitions ?? {})) {
      if (h.x !== undefined && h.y !== undefined) entries.push({chapter,source:h.source,code:'hotspot-position',point:{x:h.x,y:h.y}});
      if (h.hitbox) entries.push({chapter,source:h.hitbox.source,code:'hitbox-position',point:h.hitbox,size:h.hitbox});
      for (const place of h.placements ?? []) entries.push({chapter,source:place.source,code:'place-position',point:place});
    }
    for (const id of positioned.size ? chapterNeeds(story,uncreated,chapter) : []) {
      const icon = story.items[id]?.icon;
      if (positioned.has(id) && icon?.position) entries.push({chapter,source:icon.source,code:'icon-position',point:icon.position});
    }
  }
  return entries;
}

/** Upper bounds need decoded backgrounds; syntax and nonnegative checks remain synchronous. */
export function lintCoordinateGeometry(story: Story, measurements: BackgroundMeasurement[]): Diagnostic[] {
  if (!measurements.length) return [];
  const diagnostics: Diagnostic[] = [];
  for (const entry of coordinateEntries(story)) {
    const image = measurements.find(m => m.chapter === entry.chapter);
    if (!image) continue; // The live editor is still loading dimensions.
    let message: string | undefined, code = entry.code;
    if (!(image.width > 0 && image.height > 0)) {
      code = 'coordinate-geometry';
      message = `Cannot verify background-pixel coordinates in ${story.chapters[entry.chapter].name}: its background image could not be decoded.`;
    } else if (validCentre(entry.point) && (!entry.size || [entry.size.width,entry.size.height].every(n => Number.isFinite(n) && n > 0)) &&
      (!validCentre(entry.point,image) || entry.size && (entry.size.width > image.width || entry.size.height > image.height))) {
      message = `Coordinates must fit the ${image.width} × ${image.height}px background in ${story.chapters[entry.chapter].name}; hitbox dimensions must not exceed the image dimensions. px means background pixels, not CSS pixels.`;
    }
    if (message) diagnostics.push({severity:'error',code,message,source:entry.source,span:entry.source.span!,stage:'fast'});
  }
  return diagnostics;
}
