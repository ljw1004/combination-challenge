import type {Diagnostic, Story} from '../story/types.ts';
import type {SourceReference} from '../story/source-reference.ts';

/** Resolve against the whole manuscript, independently of chapter supply and recipe deduplication. */
export function declarationDiagnostics(story: Story): Diagnostic[] {
  const groups = new Map<string, SourceReference[]>();
  for (const reference of story.sourceReferences) {
    if (reference.kind === 'chapter') continue;
    const key = reference.id;
    const group = groups.get(key) ?? [];
    group.push(reference); groups.set(key, group);
  }
  const hotspots = new Set(story.chapters.flatMap(chapter => chapter.hotspots));
  const diagnostics: Diagnostic[] = [];
  const changingNames = new Map(Object.values(story.items).filter(item => item.id.startsWith('id:') && item.presentations.length)
    .flatMap(item => [item.name, ...item.presentations.flatMap(change => change.name === undefined ? [] : [change.name])].map(name => [name, item.id] as const)));
  for (const references of groups.values()) {
    references.sort((a, b) => a.source.span.from - b.source.span.from);
    const {id, kind} = references[0];
    // Hotspots annotate an item; their names never supply its item declaration.
    const declarations = references.filter(reference => reference.declaration && reference.kind === 'item');
    const name = (kind === 'item' ? story.items[id] : story.hotspots[id])?.name ?? id.replace(/^(?:id|name):/, '');
    let code: string | undefined, message = '';
    const changingItem = kind === 'item' && id.startsWith('name:') ? changingNames.get(id.slice(5)) : undefined;
    if (changingItem) {
      code = 'presentation-item-reference'; message = `${name} has chapter-dependent presentation. Refer to it by its backtick identifier \`${changingItem.slice(3)}\`.`;
    } else if (references.some(reference => reference.kind === 'hotspot') && !hotspots.has(id)) {
      code = 'undeclared-hotspot'; message = `${name} has no Hotspots declaration. Check its spelling or declare it on the intended chapter surface.`;
    } else if (!declarations.length) {
      code = id.startsWith('id:') ? 'undeclared-id' : 'undeclared-item';
      message = id.startsWith('id:')
        ? `Backtick identifier ${id.slice(3)} has no declaration with a display name. Check its spelling or add an identifier-plus-name declaration.`
        : `${name} has no explicit item declaration. Check its spelling or add a standalone item entry; recipe results and goals do not declare items.`;
    }
    if (code) {
      // Point to every authored use, never a whole shorthand row or generated installation.
      for (const reference of references.filter(reference => !reference.implicit)) diagnostics.push({
        severity: 'error', code, message, source: reference.source, span: reference.source.span, stage: 'fast',
      });
      continue;
    }
    // An inline named-ID declaration may also be a genuine recipe/goal/etc. use.
    // Slot-owner provenance describes metadata, not an independent use of that owner.
    const used = references.some(reference => (reference.kind === 'hotspot' || !reference.declaration || reference.role !== 'declaration')
      && !(reference.implicit && reference.role === 'slot'));
    if (!used) {
      const source = declarations[0].source;
      diagnostics.push({severity: 'warning', code: 'unused-declaration', stage: 'fast', source, span: source.span,
        message: `${name} is declared but has no references outside its declarations. Review whether this ${kind} is intentional or a misspelling.`,
        ...(declarations.length > 1 ? {related: declarations.slice(1).map(reference => ({...reference.source, message: 'Another declaration of the same identity.'}))} : {}),
      });
    }
  }
  return diagnostics.sort((a, b) => a.span.from - b.span.from || a.span.to - b.span.to);
}
