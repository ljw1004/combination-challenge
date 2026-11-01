import type { Source, TextSpan } from './types.ts';

export type ReferenceRole = 'declaration' | 'reference' | 'reagent' | 'result' | 'goal' | 'context' | 'slot' | 'fitted' | 'exclusion' | 'placement' | 'reading';

/** Authored occurrences, independent of recipe deduplication and editor state. */
export interface SourceReference {
  id: string;
  kind: 'item' | 'hotspot';
  role: ReferenceRole;
  declaration: boolean;
  implicit?: boolean;
  source: Source & {span: TextSpan};
}
