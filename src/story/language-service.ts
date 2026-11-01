import {parseStory} from './parser.ts';
import type {SourceReference} from './source-reference.ts';
import type {Ingredient, Ref, Source, Story, TextSpan} from './types.ts';

export interface SymbolIdentity { id: string; kind: SourceReference['kind']; name: string }
export interface ReferenceLocation extends SourceReference { chapter?: string; excerpt: string }
export interface HoverRule { text: string; source: Source; implicit: boolean }
export interface SymbolHover {
  kind: 'symbol';
  range: TextSpan;
  symbol: SymbolIdentity;
  declaration: boolean;
  definitions: readonly ReferenceLocation[];
  descriptions: readonly {text: string; requires: readonly string[]}[];
  properties: readonly string[];
  createdBy: readonly HoverRule[];
  usedBy: readonly HoverRule[];
  goals: readonly {text: string; chapter: string; source: Source}[];
  referenceCount: number;
}
export interface ImageHover { kind: 'image'; range: TextSpan; url: string; alt: string }
export type HoverInformation = SymbolHover | ImageHover;
export interface SemanticToken { range: TextSpan; kind: 'item' | 'hotspot' | 'comment' }

/** LSP operations over one immutable document; UTF-16 offsets and typed values, no transport encoding. */
export interface StoryLanguageService {
  hover(position: number): HoverInformation | undefined;
  definition(position: number): readonly ReferenceLocation[];
  references(target: number | SymbolIdentity, context: {includeDeclaration: boolean}): readonly ReferenceLocation[];
  semanticTokens(): readonly SemanticToken[];
}

/** Parsing and symbol resolution live here; clients decide how to display and navigate results. */
export class StoryLanguageDocument implements StoryLanguageService {
  readonly story: Story;
  private occurrences: ReferenceLocation[];
  private bySymbol = new Map<string, ReferenceLocation[]>();
  private tokens: SemanticToken[];
  private images: ImageHover[];

  constructor(text: string, file = 'story.md') {
    const comments: SemanticToken[] = [];
    this.story = parseStory(text, {file,
      onComment: source => { if (source.span) comments.push({range: source.span, kind: 'comment'}); },
    });
    this.images = [...text.matchAll(/!\[([^\]\r\n]*)\]\(([^)\r\n]+)\)/g)].map(match => ({
      kind: 'image', range: {from: match.index!, to: match.index! + match[0].length}, alt: match[1], url: match[2].trim(),
    }));
    const lines = text.split(/\r\n?|\n/);
    this.occurrences = [...this.story.sourceReferences].sort((a, b) => a.source.span.from - b.source.span.from || a.source.span.to - b.source.span.to)
      .map(reference => ({...reference,
        chapter: this.story.chapters.findLast(chapter => chapter.source.line <= reference.source.line)?.name,
        excerpt: lines[reference.source.line - 1].trim(),
      }));
    this.tokens = [...comments, ...this.occurrences.filter(reference => !reference.implicit)
      .map(reference => ({range: reference.source.span, kind: reference.kind}))]
      .sort((a, b) => a.range.from - b.range.from || a.range.to - b.range.to);
    for (const occurrence of this.occurrences) {
      const key = this.key(occurrence);
      const locations = this.bySymbol.get(key) ?? [];
      locations.push(occurrence); this.bySymbol.set(key, locations);
    }
  }

  private key(symbol: Pick<SymbolIdentity, 'id' | 'kind'>) { return `${symbol.kind}:${symbol.id}`; }

  referenceAt(position: number): ReferenceLocation | undefined {
    return this.occurrences.find(reference => !reference.implicit && reference.source.span.from <= position && position < reference.source.span.to);
  }

  symbolAt(position: number): SymbolIdentity | undefined {
    const reference = this.referenceAt(position);
    if (!reference) return;
    const declaration = reference.kind === 'item' ? this.story.items[reference.id] : this.story.hotspots[reference.id];
    return {id: reference.id, kind: reference.kind, name: declaration?.name ?? reference.id.replace(/^(?:id|name):/, '')};
  }

  locations(symbol: Pick<SymbolIdentity, 'id' | 'kind'>): readonly ReferenceLocation[] {
    return this.bySymbol.get(this.key(symbol)) ?? [];
  }

  definition(position: number): readonly ReferenceLocation[] {
    const reference = this.referenceAt(position);
    return reference ? this.locations(reference).filter(location => location.declaration) : [];
  }

  references(target: number | SymbolIdentity, context: {includeDeclaration: boolean}): readonly ReferenceLocation[] {
    const reference = typeof target === 'number' ? this.referenceAt(target) : target;
    return reference ? this.locations(reference).filter(location => context.includeDeclaration || !location.declaration) : [];
  }

  semanticTokens(): readonly SemanticToken[] { return this.tokens; }

  hover(position: number): HoverInformation | undefined {
    const image = this.images.find(image => image.range.from <= position && position < image.range.to);
    if (image) return image;
    const reference = this.referenceAt(position), symbol = this.symbolAt(position);
    if (!reference || !symbol) return;
    const {story} = this;
    const item = symbol.kind === 'item' ? story.items[symbol.id] : undefined;
    const hotspot = symbol.kind === 'hotspot' ? story.hotspots[symbol.id] : undefined;
    const name = (id: string) => story.items[id]?.name ?? story.hotspots[id]?.name ?? id.replace(/^(?:id|name):/, '');
    const label = (ref: Ref) => `${name(ref.id)}${ref.slots.length ? `[${ref.slots.map(name).join(', ')}]` : ''}`;
    const input = (ingredient: Ingredient) => `${label(ingredient.ref)} [${ingredient.fate}${ingredient.explicit ? '' : ', default'}]`;
    const has = (ref: Ref) => ref.id === symbol.id || ref.slots.includes(symbol.id);
    const rules = story.recipes.map(recipe => ({recipe, info: {
      text: `${input(recipe.a)}${recipe.b ? ` + ${input(recipe.b)}` : ''}${recipe.hotspot ? ` @ ${name(recipe.hotspot)}` : ''} → ${label(recipe.result)}`,
      source: recipe.source, implicit: !!recipe.installation,
    }}));
    const properties: string[] = [];
    if (item) {
      if (item.compound) properties.push('Compound item');
      for (const slot of item.slots) properties.push(`${slot.name ? `Slot ${slot.name}` : 'Unnamed slot'}: accepts ${name(slot.accepts)}`);
      if (item.exclusiveWith) properties.push(`Exclusive with ${name(item.exclusiveWith)}`);
      for (const rename of item.renames) properties.push(`Named ${rename.name} from chapter ${rename.chapter}`);
      if (item.icon) properties.push(`Icon: ${item.icon.url}`);
    }
    if (hotspot) {
      if (hotspot.x !== undefined && hotspot.y !== undefined) properties.push(`Position: ${hotspot.x * 100}%, ${hotspot.y * 100}%`);
      for (const placement of hotspot.placements ?? []) properties.push(`Places ${label(placement.item)} at ${placement.x * 100}%, ${placement.y * 100}%`);
      if (hotspot.icon) properties.push(`Icon: ${hotspot.icon.url}`);
    }
    return {
      kind: 'symbol',
      range: reference.source.span, symbol, declaration: reference.declaration, definitions: this.definition(position),
      descriptions: item?.wonders.map(wonder => ({text: wonder.markdown, requires: wonder.requires.map(name)})) ?? [],
      properties,
      createdBy: rules.filter(({recipe}) => symbol.kind === 'item' && recipe.result.id === symbol.id).map(rule => rule.info),
      usedBy: rules.filter(({recipe}) => symbol.kind === 'hotspot' ? recipe.hotspot === symbol.id : has(recipe.a.ref) || !!recipe.b && has(recipe.b.ref)).map(rule => rule.info),
      goals: story.chapters.flatMap(chapter => chapter.goals.filter(goal => goal.conditions.some(condition =>
        symbol.kind === 'hotspot' ? condition.hotspot === symbol.id : has(condition.item)))
        .map(goal => ({text: goal.text, chapter: chapter.name, source: goal.source}))),
      referenceCount: this.references(position, {includeDeclaration: true}).length,
    };
  }
}
