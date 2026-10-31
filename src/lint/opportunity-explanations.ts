import type { Recipe, Ref, RelatedLocation, Source, Story } from '../story/types.ts';
import type { State } from '../engine/types.ts';
import { activeHotspots, indexStory } from '../engine/analysis.ts';
import { matches, recipeFor } from '../engine/game.ts';
import { localClosure } from './opportunity-state.ts';

export interface OpportunityExplanation { message: string; related: RelatedLocation[] }
interface Blocker {
  item?: string;
  kind: 'retired' | 'merge' | 'installed' | 'earlier' | 'excluded' | 'supply' | 'hotspot' | 'cycle' | 'order';
  message: string;
  source: Source;
  retiring?: Recipe[];
}
interface Candidate { score: number; chapter: number; blockers: Blocker[] }

/** Explanations are examples of observed blockers, not a second reachability
 * analysis. They never determine whether an item passes or fails lint.
 */
export class OpportunityExplanations {
  private readonly story: Story;
  private readonly best = new Map<string, Candidate>();
  constructor(story: Story) { this.story = story; }

  consider(state: State, possiblyUncreated: ReadonlySet<string>, targets: Iterable<string>, attempted = false): void {
    const story = this.story, index = indexStory(story), hotspots = new Set(activeHotspots(story, state.chapter));
    const upper = localClosure(story, state);
    const blocker = (id: string, kind: Blocker['kind'], message: string): Blocker => ({item: id, kind, message, source: story.items[id].source,
      ...(['retired', 'merge', 'installed'].includes(kind) ? {retiring: story.recipes.filter(recipe => state.tokens[recipe.result.id]
        && [recipe.a, ...(recipe.b ? [recipe.b] : [])].some(input => input.ref.id === id && input.fate !== 'preserve')).slice(-2)} : {})});
    const context = (recipe: Recipe): Blocker[] => recipe.hotspot && !hotspots.has(recipe.hotspot)
      ? [{kind: 'hotspot', message: `${story.hotspots[recipe.hotspot].name} is not active on this chapter's board`, source: story.hotspots[recipe.hotspot].source}] : [];
    const difficulty = (reasons: Blocker[]) => reasons.length + reasons.filter(b => b.kind === 'hotspot').length * 10;
    const reasonsFor = (ref: Ref, trail: Set<string>): Blocker[] => {
      const id = ref.id, name = story.items[id].name, token = state.tokens[id];
      if (state.excluded.includes(id)) return [blocker(id, 'excluded', `${name} is ruled out by an earlier exclusive choice`)];
      if (token && token.status !== 'available') {
        if (possiblyUncreated.has(id)) return [blocker(id, 'merge', `${name} may already have been constructed and retired on an earlier goal route; the merged history therefore blocks recreating it`)];
        if (token.status === 'installed') return [blocker(id, 'installed', `${name} is installed in another object and cannot be used as a standalone ingredient`)];
        return [blocker(id, 'retired', `${name} has already been consumed or transformed and cannot be recreated`)];
      }
      if (token && token.chapter !== state.chapter) return [blocker(id, 'earlier', `${name} is left on an earlier board; this check does not retrieve it from scrollback`)];
      if (matches(token, ref)) return [];
      if (token) return ref.slots.filter(slot => !token.slots.includes(slot)).flatMap(slot => reasonsFor({id: slot, slots: []}, trail));
      if (index.primitives.has(id)) return [blocker(id, 'supply', `${name} is not supplied on this board by its goals or primitive Items entries`)];
      if (upper.has(id) && !ref.slots.length) return [];
      if (trail.has(id)) return [blocker(id, 'cycle', `${name} depends on a construction cycle with no available starting item`)];
      const next = new Set([...trail, id]);
      const alternatives = (index.producers.get(id) ?? []).map(recipe => [...context(recipe),
        ...[recipe.a, ...(recipe.b ? [recipe.b] : [])].flatMap(input => reasonsFor(input.ref, next))]);
      return alternatives.sort((a, b) => difficulty(a) - difficulty(b))[0] ?? [];
    };
    for (const target of targets) for (const recipe of index.producers.get(target) ?? []) {
      const inputs = [recipe.a, ...(recipe.b ? [recipe.b] : [])];
      const blockers = [...new Map([...context(recipe), ...inputs.flatMap(input => reasonsFor(input.ref, new Set([target]))) ]
        .map(reason => [reason.message, reason] as const)).values()];
      if (!blockers.length) {
        if (!attempted) continue;
        const selected = recipeFor(story, state, {type: 'combine', a: recipe.a.ref.id,
          ...(recipe.b ? {b: recipe.b.ref.id} : {}), ...(recipe.hotspot ? {hotspot: recipe.hotspot, chapter: state.chapter} : {})});
        blockers.push(selected && selected.id !== recipe.id
          ? {kind: 'order', message: `the matching combination produces ${story.items[selected.result.id].name} before ${story.items[target].name}`, source: selected.source}
          : {kind: 'order', message: 'the attempted dependency order stalled; cleanup, filled slots or an earlier matching recipe prevented the remaining construction', source: recipe.source});
      }
      const ready = inputs.filter(input => matches(state.tokens[input.ref.id], input.ref) && state.tokens[input.ref.id].chapter === state.chapter
        || !state.tokens[input.ref.id] && upper.has(input.ref.id)).length;
      const authoredChapter = story.chapters.findLastIndex(chapter => chapter.source.line <= recipe.source.line);
      // Prefer a usable location and inputs, then a concrete stalled probe or
      // the authored scene. Do not select an arbitrary distant empty board.
      const score = blockers.filter(b => b.kind === 'hotspot').length * 10000 - ready * 1000
        + Math.abs(authoredChapter - state.chapter) * 10 - Number(attempted) + blockers.length;
      const previous = this.best.get(target);
      if (!previous || score < previous.score) this.best.set(target, {score, chapter: state.chapter, blockers});
    }
  }

  get(target: string): OpportunityExplanation | undefined {
    const candidate = this.best.get(target);
    if (!candidate) return;
    const related: RelatedLocation[] = [];
    const add = (source: Source, message: string) => related.push({...source, span: source.span ?? {from: 0, to: 0}, message});
    for (const blocker of candidate.blockers) {
      add(blocker.source, blocker.message + '.');
      if (blocker.kind === 'retired' || blocker.kind === 'merge' || blocker.kind === 'installed') {
        // These are declared causes that can retire the ingredient, not claims
        // that one particular rule fired on every history represented here.
        for (const recipe of blocker.retiring ?? []) add(recipe.source, `${this.story.items[blocker.item!].name} can be ${recipe.installation ? 'installed' : 'consumed or transformed'} when making ${this.story.items[recipe.result.id].name}.`);
      }
    }
    return {message: `Blocking example in “${this.story.chapters[candidate.chapter].name}”: ${candidate.blockers.map(b => b.message).join('; ')}.`, related};
  }
}
