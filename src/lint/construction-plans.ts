import type { Condition, Recipe, Ref, Story } from '../story/types.ts';
import type { State } from '../engine/types.ts';
import {activeHotspots, goalChains} from '../engine/analysis.ts';

export interface ConstructionPlan {
  /** Newly constructed identities and installed slots, not partial executions. */
  facts: Set<string>;
  /** Alternative producers of the same construction stay in the same set. */
  recipes: Map<string, Recipe>;
  conditions: Map<string, Condition>;
}
export const itemFact = (id: string) => JSON.stringify([id]);
export const slotFact = (id: string, slot: string) => JSON.stringify([id, slot]);
export const refFacts = (ref: Ref) => [itemFact(ref.id), ...ref.slots.map(slot => slotFact(ref.id, slot))];
export const recipeFacts = (recipe: Recipe) => recipe.installation
  ? [slotFact(recipe.result.id, recipe.installation)] : refFacts(recipe.result);
export const planKey = (plan: ConstructionPlan) => JSON.stringify([...plan.facts].sort());
const empty = (): ConstructionPlan => ({facts: new Set(), recipes: new Map(), conditions: new Map()});

/** AND combines requirements; OR adds alternative construction sets. No action
 * permutations or subsets of independently completed goals are enumerated.
 */
export class ConstructionPlans {
  private readonly story: Story;
  private readonly entry: State;
  private readonly limit: (size: number) => void;
  private readonly present = new Set<string>();
  private readonly producers = new Map<string, Recipe[]>();
  private readonly memo = new Map<string, ConstructionPlan[]>();
  private cycleCuts = 0;

  constructor(story: Story, entry: State, limit: (size: number) => void) {
    this.story = story; this.entry = entry; this.limit = limit;
    for (const token of Object.values(entry.tokens)) if (token.status === 'available' && token.chapter === entry.chapter) {
      refFacts(token).forEach(fact => this.present.add(fact));
    }
    const hotspots = new Set(activeHotspots(story, entry.chapter));
    for (const recipe of story.recipes) {
      if (recipe.hotspot && !hotspots.has(recipe.hotspot)) continue;
      if (entry.excluded.includes(recipe.result.id)) continue;
      if (!recipe.installation && (entry.tokens[recipe.result.id] || Object.values(entry.tokens).some(token => token.slots.includes(recipe.result.id)))) continue;
      for (const fact of recipeFacts(recipe)) {
        const list = this.producers.get(fact) ?? [];
        list.push(recipe); this.producers.set(fact, list);
      }
    }
  }

  private compatible(plan: ConstructionPlan): boolean {
    for (const fact of plan.facts) {
      const [id, slot] = JSON.parse(fact) as string[];
      if (slot) continue;
      const excluded = this.story.items[id].exclusiveWith;
      if (excluded && (this.entry.tokens[excluded] || plan.facts.has(itemFact(excluded)))) return false;
    }
    return true;
  }

  private insert(plans: Map<string, ConstructionPlan>, plan: ConstructionPlan): void {
    if (!this.compatible(plan)) return;
    const key = planKey(plan), previous = plans.get(key);
    if (previous) {
      for (const [id, recipe] of plan.recipes) previous.recipes.set(id, recipe);
      for (const [key, condition] of plan.conditions) previous.conditions.set(key, condition);
    } else {
      plans.set(key, {facts: new Set(plan.facts), recipes: new Map(plan.recipes), conditions: new Map(plan.conditions)});
      this.limit(plans.size);
    }
  }

  alternatives(plans: Iterable<ConstructionPlan>): ConstructionPlan[] {
    const result = new Map<string, ConstructionPlan>();
    for (const plan of plans) this.insert(result, plan);
    return [...result.values()];
  }

  together(left: ConstructionPlan[], right: ConstructionPlan[]): ConstructionPlan[] {
    const result = new Map<string, ConstructionPlan>();
    for (const a of left) for (const b of right) this.insert(result, {
      facts: new Set([...a.facts, ...b.facts]), recipes: new Map([...a.recipes, ...b.recipes]),
      conditions: new Map([...a.conditions, ...b.conditions]),
    });
    return [...result.values()];
  }

  private facts(facts: string[], trail: Set<string>): ConstructionPlan[] {
    return facts.reduce((plans, fact) => this.together(plans, this.fact(fact, trail)), [empty()]);
  }

  private fact(fact: string, trail: Set<string>): ConstructionPlan[] {
    if (this.present.has(fact)) return [empty()];
    if (trail.has(fact)) { this.cycleCuts++; return []; }
    const cached = this.memo.get(fact);
    if (cached) return cached;
    const cutsBefore = this.cycleCuts;
    const result = new Map<string, ConstructionPlan>();
    const nextTrail = new Set([...trail, fact]);
    for (const recipe of this.producers.get(fact) ?? []) {
      const ingredients = [recipe.a.ref, ...(recipe.b ? [recipe.b.ref] : [])].flatMap(refFacts);
      for (const dependencies of this.facts(ingredients, nextTrail)) {
        // A construction cannot be its own prerequisite, even through a cycle.
        if (recipeFacts(recipe).some(output => dependencies.facts.has(output))) continue;
        this.insert(result, {facts: new Set([...dependencies.facts, ...recipeFacts(recipe)]),
          recipes: new Map([...dependencies.recipes, [recipe.id, recipe]]), conditions: new Map()});
      }
    }
    const plans = [...result.values()];
    // Acyclic subgraphs are independent of the caller's ancestors. Reuse them
    // across shared prerequisites instead of re-expanding a diamond graph.
    // Cycle-pruned results depend on the active path and must not be cached.
    if (this.cycleCuts === cutsBefore) this.memo.set(fact, plans);
    return plans;
  }

  reference(ref: Ref): ConstructionPlan[] { return this.facts(refFacts(ref), new Set()); }

  private condition(condition: Condition): ConstructionPlan[] {
    if (condition.hotspot && !activeHotspots(this.story, this.entry.chapter).includes(condition.hotspot)) return [];
    return this.reference(condition.item).map(plan => ({...plan,
      conditions: new Map([[JSON.stringify([condition.item, condition.hotspot ?? '']), condition]])}));
  }

  goals(): ConstructionPlan[] {
    const chapter = this.story.chapters[this.entry.chapter];
    const chains = goalChains(chapter.goals).map(chain => chain.reduce((plans, goal) => {
      if (this.entry.achieved.includes(goal.id)) return plans;
      const conditions = goal.conditions.map(condition => this.condition(condition));
      const choices = goal.operator === 'and'
        ? conditions.reduce((a, b) => this.together(a, b), [empty()]) : this.alternatives(conditions.flat());
      return this.together(plans, choices);
    }, [empty()]));
    return chapter.goalOperator === 'and'
      ? chains.reduce((a, b) => this.together(a, b), [empty()]) : this.alternatives(chains.flat());
  }
}
