/** Back-to-front presentation order, independent of recipes and hint state. */
export function restoreItemOrder(ids: string[], saved: unknown, remap?: ReadonlyMap<string, string>): string[] {
  const current = new Set(ids);
  const previous = Array.isArray(saved)
    ? saved.filter((id): id is string => typeof id === 'string').map(id => remap?.get(id) ?? id)
    : [];
  return [...new Set([...previous.filter(id => current.has(id)), ...ids])];
}
