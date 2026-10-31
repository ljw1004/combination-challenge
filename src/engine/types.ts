export interface Token {
  id: string; slots: string[]; chapter: number; x: number; y: number; hotspot?: string;
  /** Immutable encounter history, separate from mutable placement. Null marks unknown legacy/deleted history. */
  firstSeen?: { chapter: number | null; order: number };
  /** Visibility/incorporation of an infinite resource, never a depleted quantity. */
  status: 'available' | 'consume' | 'transform' | 'installed';
}
export interface Notice { key: string; kind: 'chapter' | 'wonder'; markdown: string; item?: string }
export interface State {
  version: 1; storyId: string; chapter: number; tokens: Record<string, Token>;
  achieved: string[]; excluded: string[]; visited: number[]; newItems: string[]; arrivalDivider: boolean;
  seen: string[]; pending: Notice[]; completed: boolean; actions: Action[];
}
export type Action =
  | { type: 'combine'; a: string; b?: string; hotspot?: string; chapter?: number }
  | { type: 'move'; item: string; chapter: number; x: number; y: number; hotspot?: string }
  | { type: 'advance' }
  | { type: 'dismiss' };
