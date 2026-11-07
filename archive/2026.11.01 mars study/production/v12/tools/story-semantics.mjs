import assert from 'node:assert/strict';

// Chapter-dependent icons require explicit IDs. These two v11 name identities
// gain stable IDs only in v12; names, supplies and every operation stay the same.
export const identityAliases = Object.freeze({
  'name:Sown soybean row': 'id:soybean-row',
  'name:Sown lettuce tray': 'id:lettuce-tray',
});

export const artworkId = id => identityAliases[id] ?? id;
const originalId = id => Object.entries(identityAliases).find(([, value]) => value === id)?.[0] ?? id;
const ref = value => ({id: originalId(value.id), slots: value.slots.map(originalId)});
const ingredient = value => value && ({ref: ref(value.ref), fate: value.fate, explicit: value.explicit});
const recipe = value => ({a: ingredient(value.a), b: ingredient(value.b), hotspot: value.hotspot,
  result: ref(value.result), installation: value.installation && originalId(value.installation)});
const chapterReference = value => ({kind: value.kind, value: value.value});

/** Parser projection only: no copied transition, supply or checkpoint logic. */
export function semantics(story, {includeProse = false} = {}) {
  const explicitResults = new Set(story.recipes.filter(value => !value.installation).map(value => value.result.id));
  return {
    title: story.title, description: story.description,
    items: Object.values(story.items).map(item => ({
      id: originalId(item.id), name: item.name, compound: item.compound,
      exclusiveWith: item.exclusiveWith && originalId(item.exclusiveWith),
      slots: item.slots.map(slot => ({name: slot.name, accepts: originalId(slot.accepts)})),
      names: item.presentations.filter(value => value.name !== undefined).map(value => ({chapter: chapterReference(value.chapter), name: value.name})),
      conditionalReadings: item.wonders.filter(value => value.requires.length).map(value => value.requires.map(originalId)),
      ...(includeProse ? {readings: item.wonders.map(value => ({markdown: value.markdown, requires: value.requires.map(originalId)}))} : {}),
    })).sort((a, b) => a.id.localeCompare(b.id)),
    hotspots: Object.values(story.hotspots).map(value => ({id: value.id, name: value.name,
      placements: (value.placements ?? []).map(value => ref(value.item))})).sort((a, b) => a.id.localeCompare(b.id)),
    chapters: story.chapters.map(chapter => ({
      id: chapter.id, name: chapter.name, hotspots: chapter.hotspots,
      primitiveSupplies: chapter.items.filter(value => !explicitResults.has(value.id)).map(ref),
      goalOperator: chapter.goalOperator,
      goals: chapter.goals.map(goal => ({text: goal.text, next: goal.next, operator: goal.operator,
        conditions: goal.conditions.map(value => ({item: ref(value.item), hotspot: value.hotspot}))})),
      ...(includeProse ? {intro: chapter.intro, skipped: chapter.skipped} : {}),
    })),
    recipes: story.recipes.map(recipe),
    tutorials: (story.tutorials ?? []).map(value => ({chapter: value.chapter, recipe: recipe(story.recipes.find(recipe => recipe.id === value.recipe))})),
  };
}

export function assertSameStory(actual, expected, options) {
  assert.deepEqual(semantics(actual, options), semantics(expected, options),
    options?.includeProse ? 'Artwork integration changed prose or gameplay.' : 'v12 changed gameplay beyond the documented crop-ID aliases.');
}
