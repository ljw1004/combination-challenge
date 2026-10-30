import type { Story, Diagnostic, Source, Ref, Fate, RelatedLocation, DiagnosticFix } from '../story/types.ts';
import { continuationPossible, indexStory, activeHotspots } from '../engine/analysis.ts';
import { newGame } from '../engine/game.ts';

export function lintStory(story: Story, options: {analysis?: boolean} = {}): Diagnostic[] {
  const diagnostics = [...story.diagnostics];
  const add = (severity: Diagnostic['severity'],code:string,message:string,source:Source,related?:RelatedLocation[],fixes?:DiagnosticFix[]) => diagnostics.push({severity,code,message,source,span:source.span??{from:0,to:0},stage:'fast',...(related?.length?{related}:{}),...(fixes?.length?{fixes}:{})});
  const error = (code:string,message:string,source:Source) => add('error',code,message,source);
  const warning = (code:string,message:string,source:Source,related?:RelatedLocation[],fixes?:DiagnosticFix[]) => add('warning',code,message,source,related,fixes);
  const related = (source: Source, message: string): RelatedLocation => ({...source, span: source.span ?? {from: 0, to: 0}, message});
  const index = indexStory(story), uses = new Map<string,{fate:Fate; explicit:boolean; implicit:boolean; source:Source; location:RelatedLocation}[]>();
  const name = (id: string) => story.items[id]?.name ?? story.hotspots[id]?.name ?? id;
  const reference = (ref: Ref) => `${name(ref.id)}${ref.slots.length ? `[${ref.slots.map(name).join(', ')}]` : ''}`;
  function checkRef(ref: Ref,source:Source) {
    const item = story.items[ref.id];
    for (const slot of ref.slots) if (!item?.slots.some(s=>s.accepts===slot)) error('unknown-slot',`${item?.name ?? ref.id} has no slot accepting ${story.items[slot]?.name ?? slot}.`,source);
  }
  for (const item of Object.values(story.items)) {
    if (story.hotspots[item.id]) error('namespace-clash',`${item.name} names both an item and a hotspot; use distinct backtick identifiers.`,item.source);
    if (item.exclusiveWith === item.id) error('self-exclusion',`${item.name} cannot exclude itself.`,item.source);
    if (item.exclusiveWith && story.items[item.exclusiveWith]?.exclusiveWith !== item.id) error('asymmetric-exclusion',`${item.name}'s exclusivity must also be declared on ${story.items[item.exclusiveWith]?.name ?? item.exclusiveWith}.`,item.source);
    if (item.slots.length && !item.compound) error('slots-on-simple-item',`${item.name} has slots but is not marked (compound).`,item.source);
    if (item.compound && !item.slots.length) error('empty-compound',`${item.name} needs one or more slot declarations.`,item.source);
    const accepted = new Set<string>();
    for (const slot of item.slots) { if (accepted.has(slot.accepts)) error('duplicate-slot',`${item.name} has two slots accepting ${story.items[slot.accepts]?.name}.`,slot.source); accepted.add(slot.accepts); }
    for (const rename of item.renames) if (!story.chapters.some(c=>c.name===rename.chapter || c.id===rename.chapter)) error('rename-chapter',`Unknown rename chapter ${rename.chapter}.`,item.source);
    for (const wonder of item.wonders) checkRef({id:item.id,slots:wonder.requires},wonder.source);
  }
  for (const recipe of story.recipes) {
    if (recipe.b?.ref.id===recipe.a.ref.id) error('self-combination','A single item cannot combine with itself; author distinct item identities.',recipe.source);
    const context = `${reference(recipe.a.ref)}${recipe.b ? ` + ${reference(recipe.b.ref)}` : ''}${recipe.hotspot ? ` @ ${name(recipe.hotspot)}` : ''} → ${reference(recipe.result)}`;
    for (const reagent of [recipe.a,...(recipe.b?[recipe.b]:[])]) {
      checkRef(reagent.ref,recipe.source);
      const list = uses.get(reagent.ref.id) ?? [];
      const origin = recipe.installation
        ? reagent === recipe.a ? 'implicit slot-owner preservation' : 'implicit slot installation'
        : reagent.explicit ? 'explicit' : 'default';
      list.push({fate:reagent.fate,explicit:reagent.explicit,implicit:!!recipe.installation,source:recipe.source,location:related(recipe.source,`${reagent.fate} (${origin}): ${context}`)});
      uses.set(reagent.ref.id,list);
    }
    checkRef(recipe.result,recipe.source);
  }
  for (const [id,list] of uses) {
    if (list.length===1 && !list[0].explicit) error('single-use-fate',`${story.items[id].name} is a reagent in only one combination. Annotate its fate explicitly.`,list[0].source);
    if (new Set(list.map(u=>u.fate==='preserve'?'preserve':'hide')).size>1) {
      const fates = (['preserve', 'consume', 'transform'] as const).filter(fate => list.some(use => use.fate === fate));
      const counts = fates.map(fate => `${fate} (${list.filter(use => use.fate === fate).length})`);
      const sites = story.fateSites?.filter(site => site.item === id);
      const fixed = new Set(list.filter(use => use.implicit).map(use => use.fate));
      const fixes: DiagnosticFix[] = fates.map(fate => {
        if ([...fixed].some(value => value !== fate)) return {
          label: fate, edits: [], disabledReason: `Slot installation fixes ${story.items[id].name} to ${[...fixed].join(' and ')}. Change the slot declarations to use ${fate} everywhere.`,
        };
        const changed = sites?.filter(site => site.fate !== fate);
        if (!sites?.length || changed?.some(site => !site.edit)) return {
          label: fate, edits: [], disabledReason: 'Some authored uses cannot be located safely in the current text.',
        };
        const edits = changed!.map(site => ({span: {...site.edit!.span}, text: `${site.edit!.prefix}[${fate}]${site.edit!.suffix}`})).sort((a, b) => a.span.from - b.span.from);
        if (edits.some((edit, i) => i > 0 && edit.span.from < edits[i - 1].span.to)) return {
          label: fate, edits: [], disabledReason: 'Some authored uses overlap in the current text.',
        };
        return {label: fate, edits};
      });
      warning('mixed-fates',`${story.items[id].name} has mixed fates: ${counts.join(', ')}`,list[0].source,list.map(use=>use.location),fixes);
    }
  }
  const declaredHotspots = new Set(story.chapters.flatMap(c=>c.hotspots));
  for (const hotspot of Object.values(story.hotspots)) {
    if (!declaredHotspots.has(hotspot.id)) error('undeclared-hotspot',`${hotspot.name} has no Hotspots declaration.`,hotspot.source);
    if ((hotspot.x!==undefined && (hotspot.x<0 || hotspot.x>1)) || (hotspot.y!==undefined && (hotspot.y<0 || hotspot.y>1))) error('hotspot-position','Hotspot coordinates must be between 0% and 100%.',hotspot.source);
  }
  for (let i=0;i<story.chapters.length;i++) {
    const c=story.chapters[i];
    if (c.hotspots.length && !c.image) error('hotspots-without-image',`${c.name} declares hotspots without an explicit chapter image.`,c.source);
    if (!i && !c.image) error('missing-opening-image','The opening chapter needs a background image.',c.source);
    const earlier = new Set(story.chapters.slice(0,i).flatMap(c=>c.items.map(r=>r.id)));
    if (i && !c.image && c.items.some(r=>index.primitives.has(r.id) && !earlier.has(r.id))) warning('new-primitives-without-image',`${c.name} introduces primitive items without a new setting image.`,c.source);
    if (c.goals.filter(g=>!g.next).length>2) warning('many-visible-goals',`${c.name} starts with more than two goal chains; consider next: for manageable presentation.`,c.goalsSource ?? c.goals[0]?.source ?? c.source);
    for (const ref of c.items) checkRef(ref,c.source);
    for (const [a,b] of index.pairs) if (c.items.some(r=>r.id===a)&&c.items.some(r=>r.id===b)) error('exclusive-needs',`${c.name} lists both mutually exclusive items ${story.items[a].name} and ${story.items[b].name}.`,c.source);
    for (const goal of c.goals) for (const cond of goal.conditions) {
      checkRef(cond.item,cond.source);
      if (cond.hotspot && !story.chapters.slice(0,i+1).some((_,j)=>activeHotspots(story,j).includes(cond.hotspot!))) error('future-goal-hotspot',`Goal ${goal.text} needs a hotspot that is not available by this chapter.`,cond.source);
      for (const id of [cond.item.id,...cond.item.slots]) {
        const later = story.chapters.slice(i+1).find(c=>c.items.some(r=>r.id===id));
        const alreadyListed = story.chapters.slice(0,i+1).some(c=>c.items.some(r=>r.id===id));
        const endLine = story.chapters[i+1]?.source.line ?? Infinity;
        const alreadyProduced = story.recipes.some(r=>!r.installation && r.result.id===id && r.source.line<endLine);
        if (later && !alreadyListed && !alreadyProduced) warning('future-supply',`Goal "${goal.text}" references ${story.items[id]?.name}, listed later in "${later.name}". Global recipes may pull later supplies into this chapter.`,cond.source,[related(later.source,`${story.items[id]?.name} is listed in the later chapter "${later.name}".`)]);
      }
    }
  }
  if (options.analysis !== false) diagnostics.push(...lintStoryAnalysis(story, diagnostics));
  return diagnostics;
}

/** Potentially expensive global reachability/exclusivity analysis. Run in the browser worker. */
export function lintStoryAnalysis(story: Story, fastDiagnostics: readonly Diagnostic[] = lintStory(story, {analysis: false})): Diagnostic[] {
  if (fastDiagnostics.some(diagnostic => diagnostic.severity === 'error')) return [];
  const error = (code: string, message: string): Diagnostic[] => [{
    severity: 'error', code, message, source: story.source,
    span: story.source.span ?? {from: 0, to: 0}, stage: 'deep',
  }];
  try {
    if (!continuationPossible(story, newGame(story), new Set(), true)) {
      return error('no-continuation', 'There is no consistent exclusive branch that can satisfy the story requirements. Check cycles, goals and top-level needs.');
    }
  } catch (exception) { return error('analysis-limit', (exception as Error).message); }
  return [];
}
