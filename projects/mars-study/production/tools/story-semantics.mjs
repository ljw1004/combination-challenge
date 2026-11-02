/** Logical artwork-conversion invariant, excluding images and source positions. */
export function semantics(story) {
  const explicitResults = new Set(story.recipes.filter(r => !r.installation).map(r => r.result.id));
  const recipe = r => ({a: {ref: r.a.ref, fate: r.a.fate, explicit: r.a.explicit}, b: r.b && {ref: r.b.ref, fate: r.b.fate, explicit: r.b.explicit}, hotspot: r.hotspot, result: r.result, installation: r.installation});
  return {
    title: story.title, description: story.description,
    items: Object.values(story.items).sort((a,b)=>a.id.localeCompare(b.id)).map(i => ({id:i.id,name:i.name,compound:i.compound,exclusiveWith:i.exclusiveWith,renames:i.renames,slots:i.slots.map(s=>({name:s.name,accepts:s.accepts})),wonders:i.wonders.map(w=>({markdown:w.markdown,requires:w.requires}))})),
    hotspots: Object.values(story.hotspots).sort((a,b)=>a.id.localeCompare(b.id)).map(h=>({id:h.id,name:h.name})),
    chapters: story.chapters.map(c=>({name:c.name,intro:c.intro,skipped:c.skipped,hotspots:c.hotspots,primitiveSupplies:c.items.filter(i=>!explicitResults.has(i.id)),goalOperator:c.goalOperator,goals:c.goals.map(g=>({text:g.text,next:g.next,operator:g.operator,conditions:g.conditions.map(x=>({item:x.item,hotspot:x.hotspot}))}))})),
    recipes: story.recipes.map(recipe),
    tutorials: (story.tutorials??[]).map(t=>({chapter:t.chapter,recipe:recipe(story.recipes.find(r=>r.id===t.recipe))})),
  };
}
