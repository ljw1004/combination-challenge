import type { Story } from '../story/types.ts';
import type { State } from '../engine/types.ts';
import { act, chapterComplete, matches, newGame } from '../engine/game.ts';
import { indexStory } from '../engine/analysis.ts';
import { canonicalState, conditionMet, localClosure, localTransitions, type Transition } from './opportunity-state.ts';
import { historyGroupKey, inventoryGroupKey, historyRetirementCheck, OptionalHistory } from './optional-history.ts';
import { ConstructionPlans, planKey, recipeFacts, type ConstructionPlan } from './construction-plans.ts';
import { OpportunityExplanations, type OpportunityExplanation } from './opportunity-explanations.ts';

export interface OpportunityOptions {
  /** Bound distinct construction alternatives, including chapter frontiers. */
  maxFrontier?: number;
}
export const MAX_OPPORTUNITY_FRONTIER = 100;
export interface OpportunityStats {
  constructionSets: number;
  goalSets: number; probeSets: number; transitions: number;
  peakFrontier: number; elapsedMs: number; peakOptionalItems: number;
  activeChapter: number; phase: 'frontiers' | 'opportunities';
  chapters: {chapter: number; entries: number; constructionSets: number; endings: number}[];
}
export interface OpportunityReport {
  complete: boolean;
  limit?: string;
  /** First certifying chapter, zero-based. Missing items are findings only when complete. */
  opportunities: Map<string, number>;
  explanations: Map<string, OpportunityExplanation>;
  stats: OpportunityStats;
}
interface Entry { state: State; possiblyUncreated?: ReadonlySet<string> }
class OpportunityLimit extends Error {}

/** Goal-directed construction sets with pessimistic chapter histories.
 * This authoring check deliberately rejects some fragile opportunities;
 * it is neither an exhaustive play search nor a gameplay retention policy.
 */
export function analyzeOpportunities(story: Story, options: OpportunityOptions = {}): OpportunityReport {
  const started = performance.now(), maxFrontier = options.maxFrontier ?? MAX_OPPORTUNITY_FRONTIER;
  const stats: OpportunityStats = {constructionSets: 0, goalSets: 0, probeSets: 0, transitions: 0,
    peakFrontier: 0, peakOptionalItems: 0, elapsedMs: 0, activeChapter: 0, phase: 'frontiers', chapters: []};
  const opportunities = new Map<string, number>(), explanations = new Map<string, OpportunityExplanation>();
  const explanationCandidates = new OpportunityExplanations(story);
  const report: OpportunityReport = {complete: false, opportunities, explanations, stats};
  const unexplained = () => Object.keys(story.items).filter(id => !opportunities.has(id));
  const index = indexStory(story);
  const frontierVisit = (size: number) => {
    stats.peakFrontier = Math.max(stats.peakFrontier, size);
    if (size > maxFrontier) throw new OpportunityLimit(`Opportunity analysis exceeded its ${maxFrontier}-element construction-set limit`);
  };
  const observe = ({state}: Entry) => {
    for (const id of Object.keys(state.tokens)) if (!opportunities.has(id)) opportunities.set(id, state.chapter);
  };
  const advance = (entry: Entry): Entry => {
    stats.transitions++;
    return {state: canonicalState(act(story, entry.state, {type: 'advance'})), possiblyUncreated: entry.possiblyUncreated};
  };

  const constructed = (state: State, fact: string) => {
    const [id, slot] = JSON.parse(fact) as string[];
    return !!state.tokens[id] && (!slot || state.tokens[id].slots.includes(slot));
  };
  /** Evaluate one construction set, updating one state in dependency order.
   * There is no queue of partial inventories or alternative action orderings.
   */
  const evaluateConstruction = (entry: State, plan: ConstructionPlan, goalOnly: boolean, possiblyUncreated: ReadonlySet<string> = new Set(), target?: string): State | undefined => {
    stats.constructionSets++; stats[goalOnly ? 'goalSets' : 'probeSets']++;
    let state = entry;
    const retirementCheck = historyRetirementCheck(story, possiblyUncreated);
    observe({state});
    const recipes = [...plan.recipes.values()].sort((a, b) => recipeFacts(b).length - recipeFacts(a).length
      || a.source.line - b.source.line || a.id.localeCompare(b.id));
    for (;;) {
      // A required placement can latch a goal before another construction hides
      // that item. Each pass is bounded by the selected conditions, not moves.
      for (const condition of plan.conditions.values()) {
        if (!condition.hotspot || conditionMet(state, condition)) continue;
        if (!matches(state.tokens[condition.item.id], condition.item) || state.tokens[condition.item.id].chapter !== state.chapter) continue;
        stats.transitions++;
        state = canonicalState(act(story, state, {type: 'move', item: condition.item.id, chapter: state.chapter, x: 0, y: 0, hotspot: condition.hotspot}));
      }
      const built = [...plan.facts].every(fact => constructed(state, fact));
      if (built) return !goalOnly || chapterComplete(story, state) ? state : undefined;
      if (goalOnly && chapterComplete(story, state)) return;
      let next: Transition | undefined;
      for (const recipe of recipes) {
        if (recipeFacts(recipe).every(fact => constructed(state, fact))) continue;
        for (const transition of localTransitions(story, state, [recipe], retirementCheck)) { next = transition; break; }
        if (next) break;
      }
      if (!next) {
        if (target) explanationCandidates.consider(state, possiblyUncreated, [target], true);
        return;
      }
      stats.transitions++; state = next.state; observe({state});
    }
  };

  /** Assess retirement against the completed construction set, with the set's
   * other constructed resources available. This deliberately permits more
   * retirement than one particular ordering might have allowed. It never
   * promotes an optional target to a game goal or restores a retired entry item.
   */
  const pessimisticEnding = (entry: State, ending: State, plan: ConstructionPlan, possiblyUncreated: ReadonlySet<string>): State => {
    const result = canonicalState(ending), available = canonicalState(ending);
    for (const token of Object.values(available.tokens)) {
      if (!entry.tokens[token.id] || entry.tokens[token.id].status === 'available') token.status = 'available';
    }
    const retired = new Set<string>();
    const retirementCheck = historyRetirementCheck(story, possiblyUncreated);
    for (const recipe of plan.recipes.values()) for (const input of [recipe.a, ...(recipe.b ? [recipe.b] : [])]) {
      if (input.fate === 'preserve' || input.ref.id === recipe.result.id) continue;
      const token = result.tokens[input.ref.id];
      if (!token || token.status !== 'available') continue;
      if (retirementCheck(available, new Set([input.ref.id]))) {
        token.status = recipe.installation ? 'installed' : input.fate;
        retired.add(token.id);
      }
    }
    stats.peakOptionalItems = Math.max(stats.peakOptionalItems, retired.size);
    // Receiver choice is not an authored construction alternative. Unspecified
    // context placements cannot be relied on for inherited-hotspot carry.
    const goalLocations = new Map<string, Set<string>>();
    for (const condition of plan.conditions.values()) if (condition.hotspot) {
      const locations = goalLocations.get(condition.item.id) ?? new Set();
      locations.add(condition.hotspot); goalLocations.set(condition.item.id, locations);
    }
    for (const recipe of plan.recipes.values()) if (recipe.hotspot && recipe.b) {
      for (const input of [recipe.a, recipe.b]) {
        const token = result.tokens[input.ref.id];
        if (token?.status === 'available' && !goalLocations.has(token.id)) delete token.hotspot;
      }
    }
    for (const [id, locations] of goalLocations) if (locations.size > 1 && result.tokens[id]) delete result.tokens[id].hotspot;
    return result;
  };

  try {
    const first: Entry = {state: canonicalState(newGame(story))};
    const histories = new Map<number, Map<string, OptionalHistory>>();
    const inventories = new WeakMap<OptionalHistory, string>();
    const join = (groups: Map<string, OptionalHistory>, state: State, possiblyUncreated: ReadonlySet<string> = new Set()) => {
      let pending = new OptionalHistory(story, state, possiblyUncreated);
      for (;;) {
        const collapsed = pending.collapse(), key = historyGroupKey(story, collapsed), inventory = inventoryGroupKey(story, collapsed);
        // Merge by construction history first, then by identical live stock
        // when only retired-versus-uncreated intermediates differ.
        const match = groups.has(key) ? [key, groups.get(key)!] as const
          : [...groups].find(([, history]) => inventories.get(history) === inventory);
        if (!match) { groups.set(key, pending); inventories.set(pending, inventory); break; }
        groups.delete(match[0]);
        match[1].add(collapsed, pending.possiblyUncreated);
        pending = match[1];
      }
      frontierVisit(groups.size);
    };
    const add = ({state, possiblyUncreated}: Entry) => {
      if (state.completed) return;
      let groups = histories.get(state.chapter);
      if (!groups) { groups = new Map(); histories.set(state.chapter, groups); }
      join(groups, state, possiblyUncreated);
    };
    if (first.state.completed) observe(first);
    else add(first);
    for (let chapter = 0; chapter < story.chapters.length; chapter++) {
      const groups = histories.get(chapter);
      if (!groups) continue;
      const chapterStats = {chapter, entries: 0, constructionSets: 0, endings: 0};
      stats.chapters.push(chapterStats);
      const endings = new Map<string, OptionalHistory>();
      stats.activeChapter = chapter;
      for (const history of groups.values()) {
        stats.peakOptionalItems = Math.max(stats.peakOptionalItems, history.optionalItems);
        const state = history.collapse(), possiblyUncreated = history.possiblyUncreated;
        chapterStats.entries++;
        frontierVisit(chapterStats.entries);
        const planner = new ConstructionPlans(story, state, frontierVisit);
        stats.phase = 'frontiers';
        const plans = planner.goals();
        for (const plan of plans) {
          chapterStats.constructionSets++;
          const ending = evaluateConstruction(state, plan, true, possiblyUncreated);
          if (ending) {
            chapterStats.endings++;
            explanationCandidates.consider(ending, possiblyUncreated, unexplained());
            join(endings, pessimisticEnding(state, ending, plan, possiblyUncreated), possiblyUncreated);
          }
        }
        stats.phase = 'opportunities';
        const upper = localClosure(story, state), evaluated = new Set<string>();
        for (const target of Object.keys(story.items)) {
          if (opportunities.has(target) || index.primitives.has(target) || !upper.has(target)) continue;
          const targets = planner.reference({id: target, slots: []});
          const examine = (candidates: ConstructionPlan[]) => {
            for (const plan of candidates) {
              const key = planKey(plan) + JSON.stringify([...plan.conditions.keys()].sort());
              if (!evaluated.has(key)) { evaluated.add(key); evaluateConstruction(state, plan, false, possiblyUncreated, target); }
              if (opportunities.has(target)) return true;
            }
            return false;
          };
          if (!examine(targets)) examine(planner.together(targets, plans));
        }
        explanationCandidates.consider(state, possiblyUncreated, unexplained());
      }
      // Merge and resolve possible retirement before calculating the next
      // chapter's supplies and carry. The pessimistic state remains historical:
      // retired things are not treated as never-created things.
      for (const history of endings.values()) {
        const state = history.collapse();
        if (!chapterComplete(story, state)) throw new Error('A goal-only ending lost its goal latches.');
        const next = advance({state, possiblyUncreated: history.possiblyUncreated});
        if (next.state.completed) observe(next);
        else add(next);
      }
      if (opportunities.size === Object.keys(story.items).length) break;
      histories.delete(chapter);
    }
    report.complete = true;
  } catch (error) {
    if (!(error instanceof OpportunityLimit)) throw error;
    report.limit = `${error.message}; no absent-item conclusions were drawn. Inspect the differing histories before increasing limits.`;
  }
  if (report.complete) for (const target of unexplained()) {
    const explanation = explanationCandidates.get(target);
    if (explanation) explanations.set(target, explanation);
  }
  stats.elapsedMs = performance.now() - started;
  return report;
}
