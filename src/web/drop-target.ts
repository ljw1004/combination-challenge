import type {Story} from '../story/types.ts';
import type {State, Action} from '../engine/types.ts';
import {legalActions} from '../engine/game.ts';
import {placementHints} from '../engine/placement-hints.ts';
import {hotspotDrop} from '../engine/hotspot-drop.ts';
import {containsPoint, overlapsHotspot, type Rect, type HotspotRegion} from './hotspot-view.ts';

export interface DropTarget<T> {
  value: T;
  item?: string;
  hotspot?: string;
  chapter: number;
  region: HotspotRegion;
  zIndex: number;
}
export interface DropResolution<T> {
  target?: T;
  action?: Extract<Action, {type: 'combine'}>;
  usefulPlacement?: boolean;
  ambiguous: string[];
}

/** Snapshot legal choices once per gesture; geometry remains live during scrolling. */
export function createDropResolver(story: Story, state: State, item: string) {
  const actions = legalActions(story, state).filter(action => action.a === item);
  const placements = new Set(placementHints(story, state).filter(hint => hint.item === item).map(hint => hint.hotspot));
  return <T>(point: {x: number; y: number}, rectangle: Rect, targets: DropTarget<T>[]): DropResolution<T> => {
    const ranked = targets.filter(target => target.item !== item).map((target, order) => ({
      ...target, order, underPointer: containsPoint(target.region, point),
    })).filter(target => target.underPointer || overlapsHotspot(rectangle, target.region))
      .sort((a,b) => Number(b.underPointer) - Number(a.underPointer) || b.zIndex - a.zIndex || b.order - a.order);
    const resolved = ranked.map<DropResolution<T>>(target => {
      if (target.item) return {target: target.value, action: actions.find(action => action.b === target.item), ambiguous: []};
      const result = hotspotDrop(story, state, item, target.hotspot!, target.chapter, actions);
      return {target: target.value, ...result, usefulPlacement: placements.has(target.hotspot!)};
    });
    // Incompatible objects and unresolved stations cannot mask an unambiguous useful drop.
    return resolved.find(result => result.action || (result.usefulPlacement && !result.ambiguous.length))
      ?? resolved.find(result => result.ambiguous.length)
      ?? resolved.find((_, index) => ranked[index].hotspot)
      ?? {ambiguous: []};
  };
}
