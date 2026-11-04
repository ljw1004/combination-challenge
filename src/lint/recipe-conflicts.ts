import type {Diagnostic, Ingredient, Recipe, Story} from '../story/types.ts';

export function recipeMeaning(recipe: Recipe): string {
  const operand = (input: Ingredient) => [input.ref.id, [...input.ref.slots].sort(), input.fate];
  const inputs = [operand(recipe.a), ...(recipe.b ? [operand(recipe.b)] : [])].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify([inputs, recipe.at ? operand(recipe.at) : recipe.hotspot, recipe.result.id, [...recipe.result.slots].sort(), recipe.installation]);
}

/** Ambiguous declarations are errors even when current chapter supplies hide the overlap. */
export function recipeConflictDiagnostics(story: Story): Diagnostic[] {
  const groups = new Map<string, Recipe[]>(), diagnostics: Diagnostic[] = [];
  for (const recipe of story.recipes) {
    // A @ H has the same physical pair as A + H. A + B @ H keeps its context.
    const pair = [recipe.a.ref.id, recipe.b?.ref.id ?? recipe.hotspot].sort();
    const key = JSON.stringify([pair, recipe.b ? recipe.hotspot : undefined]);
    const earlier = groups.get(key) ?? [];
    const conflict = earlier.find(other => {
      const mixed = !!other.b !== !!recipe.b;
      return mixed || recipeMeaning(other) !== recipeMeaning(recipe);
    });
    if (conflict) {
      const source = recipe.source;
      const mixed = !!conflict.b !== !!recipe.b;
      diagnostics.push({severity: 'error', stage: 'fast', code: mixed ? 'mixed-recipe-notation' : 'conflicting-recipe', source,
        span: source.span ?? {from: 0, to: 0},
        message: mixed ? 'The same input pair cannot have both a + combination and an @ operation. Choose one notation for this pair.'
          : 'These inputs already have a combination with a different result, fitting requirement or fate. A drag must have one authored outcome.',
        related: [{...conflict.source, span: conflict.source.span ?? {from: 0, to: 0}, message: 'Conflicting combination for the same inputs and context.'}]});
    }
    earlier.push(recipe); groups.set(key, earlier);
  }
  return diagnostics;
}
