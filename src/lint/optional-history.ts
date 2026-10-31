import type { Story } from '../story/types.ts';
import type { State, Token } from '../engine/types.ts';
import { canonicalState, relevantItems } from './opportunity-state.ts';
import {activeHotspots, continuationPossible} from '../engine/analysis.ts';
import type { RetirementCheck } from '../engine/game.ts';

function historyState(story: Story, input: State): State {
  const state = canonicalState(input);
  const futureHotspots = new Set(story.chapters.slice(state.chapter).flatMap((_, i) => activeHotspots(story, state.chapter + i)));
  const goalHotspots = new Set(story.chapters.slice(state.chapter).flatMap(c => c.goals.flatMap(g => g.conditions.flatMap(c => c.hotspot ? [c.hotspot] : []))));
  for (const token of Object.values(state.tokens)) {
    if (token.chapter < state.chapter) {
      token.chapter = -1;
      if (token.hotspot && !futureHotspots.has(token.hotspot) && !goalHotspots.has(token.hotspot)) delete token.hotspot;
    }
  }
  return state;
}

/** Construction grouping: collapse retirement and placement differences within
 * the same relevant construction history. */
export function historyGroupKey(story: Story, input: State): string {
  const state = historyState(story, input), relevant = relevantItems(story, state);
  return JSON.stringify([
    state.chapter, state.visited, state.excluded.filter(id => relevant.has(id)).sort(),
    state.achieved.filter(id => story.chapters.slice(state.chapter).some(c => c.goals.some(g => g.id === id))).sort(),
    Object.keys(state.tokens).filter(id => relevant.has(id)).sort().map(id => [id, [...state.tokens[id].slots].sort()]),
  ]);
}

/** Inventory grouping: equal live inventories can forget distinctions between
 * retired and never-created intermediates while retaining creation uncertainty. */
export function inventoryGroupKey(story: Story, input: State): string {
  const state = historyState(story, input);
  return JSON.stringify([
    state.chapter, state.visited, [...state.excluded].sort(),
    state.achieved.filter(id => story.chapters.slice(state.chapter).some(c => c.goals.some(g => g.id === id))).sort(),
    Object.values(state.tokens).filter(token => token.status === 'available' || token.status === 'installed')
      .sort((a, b) => a.id.localeCompare(b.id)).map(token => [token.id, token.status, [...token.slots].sort(), token.chapter, token.hotspot ?? '']),
  ]);
}

/** Possible noncreation is relevant to retention, but never permits the
 * construction planner or chapter supply code to recreate a blocked identity.
 */
export function historyRetirementCheck(story: Story, possiblyUncreated: ReadonlySet<string>): RetirementCheck {
  return (state, removed) => {
    if (!possiblyUncreated.size) return continuationPossible(story, state, removed);
    const tokens = {...state.tokens};
    for (const id of possiblyUncreated) delete tokens[id];
    return continuationPossible(story, {...state, tokens}, removed);
  };
}

/** A product of independent item histories. Multiple values mean OPTIONAL,
 * including available versus retired, not merely present versus uncreated.
 * No complete historical inventory is selected as a representative.
 */
export class OptionalHistory {
  private readonly items = new Map<string, Map<string, Token | undefined>>();
  private readonly goals = new Map<string, Set<boolean>>();
  private readonly visits = new Map<number, Set<boolean>>();
  private readonly storyId: string;
  private readonly story: Story;
  readonly chapter: number;

  constructor(story: Story, state: State, possiblyUncreated: ReadonlySet<string> = new Set()) {
    this.story = story;
    this.storyId = state.storyId;
    this.chapter = state.chapter;
    for (const id of Object.keys(story.items)) this.items.set(id, new Map());
    for (const c of story.chapters.slice(this.chapter)) for (const goal of c.goals) this.goals.set(goal.id, new Set());
    for (let c = 0; c <= this.chapter; c++) this.visits.set(c, new Set());
    this.add(state, possiblyUncreated);
  }

  add(input: State, possiblyUncreated: ReadonlySet<string> = new Set()): void {
    if (input.chapter !== this.chapter || input.completed) throw new Error('OPTIONAL histories must share a live chapter.');
    const state = historyState(this.story, input);
    for (const [id, values] of this.items) {
      const token = state.tokens[id];
      values.set(token ? JSON.stringify([token.status, [...token.slots].sort(), token.chapter, token.hotspot ?? '']) : 'uncreated', token);
      if (possiblyUncreated.has(id)) values.set('uncreated', undefined);
    }
    for (const [id, values] of this.goals) values.add(state.achieved.includes(id));
    for (const [chapter, values] of this.visits) values.add(state.visited.includes(chapter));
  }

  get optionalItems(): number { return [...this.items.values()].filter(values => values.size > 1).length; }
  get possiblyUncreated(): Set<string> {
    return new Set([...this.items].filter(([, values]) => values.has('uncreated') && values.size > 1).map(([id]) => id));
  }

  /** One pessimistic state per construction set. Never expand a Cartesian
   * product of retirement or placement possibilities.
   */
  collapse(): State {
    const state: State = {version: 1, storyId: this.storyId, chapter: this.chapter, tokens: {}, achieved: [], excluded: [], visited: [], newItems: [], arrivalDivider: false, seen: [], pending: [], completed: false, actions: []};
    const possible: State = {...state, tokens: {}};
    for (const [id, values] of this.items) {
      const tokens = [...values.values()].filter((t): t is Token => !!t);
      const available = tokens.filter(t => t.status === 'available');
      const token = available.find(t => t.chapter === this.chapter) ?? available[0] ?? tokens[0];
      if (token) possible.tokens[id] = {...token, slots: [...new Set(available.flatMap(t => t.slots))]};
    }
    const relevant = relevantItems(this.story, possible);
    for (const [id, alternatives] of this.items) {
      const all = [...alternatives.values()];
      const retired = relevant.has(id) ? all.find(token => token?.status === 'consume' || token?.status === 'transform') : undefined;
      // Chapter-boundary pessimism: possible retirement is treated as actual
      // retirement, never as absence that permits resupply or recreation.
      const first = all[0];
      if (!first && !retired) continue;
      const token = {...(retired ?? first)!};
      if (relevant.has(id)) token.slots = [...new Set(all.flatMap(value => value?.slots ?? []))];
      if (retired) { token.status = 'consume'; token.chapter = -1; delete token.hotspot; }
      else if (relevant.has(id)) {
        if (all.some(value => value?.status === 'installed')) token.status = 'installed';
        if (all.some(value => value?.chapter !== token.chapter)) token.chapter = -1;
        if (all.some(value => value?.hotspot !== token.hotspot)) delete token.hotspot;
      }
      state.tokens[id] = token;
    }
    for (const [id, values] of this.goals) if (values.size === 1 && values.has(true)) state.achieved.push(id);
    for (const [chapter, values] of this.visits) if (values.size === 1 && values.has(true)) state.visited.push(chapter);
    state.excluded = Object.keys(state.tokens).flatMap(id => this.story.items[id].exclusiveWith ? [this.story.items[id].exclusiveWith!] : []);
    return state;
  }
}
