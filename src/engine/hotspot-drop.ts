import type {Story} from '../story/types.ts';
import type {State, Action} from './types.ts';
import {legalActions} from './game.ts';
import {activeHotspots} from './analysis.ts';

type Combination = Extract<Action, {type: 'combine'}>;

/** A hotspot is another way to target an actual occupant, never an ingredient store. */
export function hotspotDrop(story: Story, state: State, item: string, hotspot: string, chapter: number, actions: Combination[] = legalActions(story, state)): {action?: Combination; ambiguous: string[]} {
  if (!state.visited.includes(chapter) || !activeHotspots(story, chapter).includes(hotspot)) return {ambiguous: []};
  const candidates = actions.filter(a => a.a === item && a.hotspot === hotspot);
  const occupants = candidates.filter(a => a.b && state.tokens[a.b]?.chapter === chapter);
  if (occupants.length > 1) return {ambiguous: [...new Set(occupants.map(a => a.b!))]};
  const action = occupants[0] ?? candidates.find(a => !a.b);
  return {action: action && {...action, chapter}, ambiguous: []};
}
