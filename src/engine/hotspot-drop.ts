import type {Story} from '../story/types.ts';
import type {State, Action} from './types.ts';
import {legalActions} from './game.ts';
import {presentHotspots} from './fixed-items.ts';

type Combination = Extract<Action, {type: 'combine'}>;

/** A hotspot is another way to target an actual occupant, never an ingredient store. */
export function hotspotDrop(story: Story, state: State, item: string, hotspot: string, chapter: number, actions: Combination[] = legalActions(story, state)): {action?: Combination; ambiguous: string[]} {
  if (!state.visited.includes(chapter) || !presentHotspots(story,state,chapter).includes(hotspot)) return {ambiguous: []};
  const candidates = actions.filter(a => a.a === item && (a.hotspot === hotspot || (!a.hotspot && a.b === hotspot)));
  const occupants = candidates.filter(a => a.hotspot && a.b && state.tokens[a.b]?.chapter === chapter);
  if (occupants.length > 1) return {ambiguous: [...new Set(occupants.map(a => a.b!))]};
  const action = occupants[0] ?? candidates.find(a => !a.b || !a.hotspot);
  return {action: action && {...action, ...(action.hotspot ? {chapter} : {})}, ambiguous: []};
}
