/** The shared, source-located Markdown model. No browser or Node dependencies. */
/** UTF-16 offsets: inclusive start and exclusive end, matching browser editors. */
export interface TextSpan { from: number; to: number }
export interface Source { file: string; line: number; column?: number; span?: TextSpan }
export interface RelatedLocation extends Source { message: string; span: TextSpan }
export interface Diagnostic { severity: 'error' | 'warning'; code: string; message: string; source: Source; span: TextSpan; stage?: 'fast' | 'deep'; related?: RelatedLocation[] }
export interface Ref { id: string; slots: string[] }
export type Fate = 'preserve' | 'consume' | 'transform';
export interface Ingredient { ref: Ref; fate: Fate; explicit: boolean }
export interface Slot { name?: string; accepts: string; source: Source }
export interface Wonder { markdown: string; requires: string[]; source: Source }
export interface Item {
  id: string; name: string; compound: boolean; slots: Slot[]; wonders: Wonder[];
  exclusiveWith?: string; renames: { chapter: string; name: string }[]; source: Source;
}
export interface Hotspot { id: string; name: string; x?: number; y?: number; source: Source }
export interface Condition { item: Ref; hotspot?: string; source: Source }
export interface Goal {
  id: string; text: string; next: boolean; operator: 'and' | 'or'; conditions: Condition[]; source: Source;
}
export interface Chapter {
  id: string; name: string; image?: string; intro: string; skipped: string;
  hotspots: string[]; items: Ref[]; goals: Goal[]; goalOperator: 'and' | 'or'; source: Source; goalsSource?: Source;
}
export interface Recipe {
  id: string; a: Ingredient; b?: Ingredient; hotspot?: string; result: Ref;
  /** Implicit installation preserves the owner's other fitted contents. */
  installation?: string; source: Source;
}
export interface Story {
  id: string; title: string; description: string; chapters: Chapter[];
  items: Record<string, Item>; hotspots: Record<string, Hotspot>; recipes: Recipe[];
  diagnostics: Diagnostic[]; source: Source;
}
