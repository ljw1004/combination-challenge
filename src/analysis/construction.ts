import type {Ref, Story} from '../story/types.ts';
import {indexStory} from '../engine/analysis.ts';
import {recipeIngredients} from '../engine/fixed-items.ts';

interface Construction {
  depth: number;
  depthPath: string[];
}
export interface ItemConstruction extends Construction {id: string; name: string; primitive: boolean}

/** Structural chain lengths, not an executable plan. Take the longest alternative.
 * Slot installations add versions of the owner, never owner -> owner cycles.
 */
export function constructionMetrics(story: Story): ItemConstruction[] {
  const index = indexStory(story), memo = new Map<string, Construction>(), visiting = new Set<string>();
  const name = (id: string) => story.items[id]?.name ?? id;
  const label = (ref: Ref) => `${name(ref.id)}${ref.slots.length ? `[${ref.slots.map(name).join(', ')}]` : ''}`;
  const maximum = (choices: Construction[]): Construction => {
    return choices.reduce((a, b) => a.depth >= b.depth ? a : b);
  };
  function reference(ref: Ref): Construction {
    const key = JSON.stringify([ref.id, [...new Set(ref.slots)].sort()]);
    const cached = memo.get(key);
    if (cached) return cached;
    if (visiting.has(key)) throw new Error(`Construction analysis does not support dependency cycles: ${[...visiting, key].join(' → ')}`);
    visiting.add(key);
    const item = story.items[ref.id];
    if (!item) throw new Error(`Unknown construction item ${ref.id}.`);
    for (const slot of ref.slots) if (!item.slots.some(s => s.accepts === slot)) throw new Error(`Unknown slot ${slot} on ${item.name}.`);

    const choices: Construction[] = [];
    function fit(base: Construction, alreadyFilled: string[]) {
      const missing = [...new Set(ref.slots)].filter(id => !alreadyFilled.includes(id));
      const parts = missing.map(id => ({id, ...reference({id, slots: []})})).sort((a, b) => b.depth - a.depth);
      // Installing the deepest part first maximizes the longest dependency path.
      // Other fits are still sequential owner transformations on that path.
      const deepest = parts.length && parts[0].depth > base.depth ? parts[0] : base;
      const filled = [...alreadyFilled];
      const path = [...deepest.depthPath];
      for (const part of parts) { filled.push(part.id); path.push(label({id: ref.id, slots: [...filled]})); }
      choices.push({
        depth: deepest.depth + parts.length,
        depthPath: path,
      });
    }
    if (index.primitives.has(ref.id)) fit({depth: 0, depthPath: [item.name]}, []);
    for (const recipe of index.producers.get(ref.id) ?? []) {
      const inputs = recipeIngredients(recipe).map(input=>reference(input.ref));
      const deepest = inputs.reduce((a, b) => a.depth >= b.depth ? a : b);
      fit({
        depth: deepest.depth + 1,
        depthPath: [...deepest.depthPath, label(recipe.result)],
      }, recipe.result.slots);
    }
    const result = maximum(choices);
    if (!Number.isSafeInteger(result.depth)) throw new Error(`Chain length exceeds exact integer precision for ${label(ref)}.`);
    visiting.delete(key); memo.set(key, result); return result;
  }

  // One sample per identity, taking its most elaborate actually referenced form.
  // Do not invent a state containing every slot when no reference asks for it.
  const forms = new Map(Object.keys(story.items).map(id => [id, [{id, slots: []} as Ref]]));
  const add = (ref: Ref) => { forms.get(ref.id)!.push(ref); };
  for (const chapter of story.chapters) {
    chapter.items.forEach(add);
    for (const goal of chapter.goals) for (const condition of goal.conditions) add(condition.item);
  }
  for (const recipe of story.recipes) { recipeIngredients(recipe).forEach(input=>add(input.ref)); add(recipe.result); }
  return Object.values(story.items).map(item => ({
    id: item.id, name: item.name, primitive: index.primitives.has(item.id),
    ...maximum(forms.get(item.id)!.map(reference)),
  }));
}
