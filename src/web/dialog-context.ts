export type DialogContext = { kind: 'pending' | 'chapter' | 'confirm' | 'error' }
  | { kind: 'encyclopedia'; item?: string; detail?: boolean };

/** Saved authoring anchors may predate direct item reads opening the book. */
export function restoreDialogContext(value: unknown): DialogContext | undefined {
  if (!value || typeof value !== 'object' || !('kind' in value)) return undefined;
  if (value.kind === 'reading') {
    return 'item' in value && typeof value.item === 'string'
      ? { kind: 'encyclopedia', item: value.item, detail: true } : undefined;
  }
  if (value.kind === 'encyclopedia') return {
    kind: 'encyclopedia',
    item: 'item' in value && typeof value.item === 'string' ? value.item : undefined,
    detail: 'detail' in value && value.detail === true,
  };
  if (value.kind === 'pending' || value.kind === 'chapter' || value.kind === 'confirm' || value.kind === 'error') return { kind: value.kind };
  return undefined;
}
