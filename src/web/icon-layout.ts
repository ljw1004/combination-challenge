interface Tile { id: string; x: number; y: number; width: number; height: number; fresh: boolean }

/** Keep carried relationships and reserve room below icon rows for transient names. */
export function iconArrival(tiles: Tile[]): {positions: Map<string, {x: number; y: number}>; divider?: number; crowded: boolean} {
  const positions = new Map<string, {x: number; y: number}>();
  const placed: Tile[] = [], carried = tiles.filter(tile => !tile.fresh).sort((a, b) => a.y - b.y);
  const clear = (tile: Tile) => placed.every(other => tile.x + tile.width + 12 <= other.x || other.x + other.width + 12 <= tile.x || tile.y + tile.height + 28 <= other.y || other.y + other.height + 28 <= tile.y);
  let bottom = 82;
  for (const tile of carried) {
    const next = {...tile, x: Math.max(14, Math.min(376 - tile.width, tile.x)), y: Math.max(82, tile.y - carried[0].y + 82)};
    if (!clear(next)) {
      const candidates = Array.from({length: 18}, (_, row) => [14, 139, 264].map(x => ({...next, x: Math.min(x, 376 - next.width), y: 82 + row * 64}))).flat();
      const available = candidates.sort((a, b) => Math.abs(a.x - tile.x) + Math.abs(a.y - tile.y) - Math.abs(b.x - tile.x) - Math.abs(b.y - tile.y)).find(clear);
      if (available) { next.x = available.x; next.y = available.y; }
      else { next.x = 14; next.y = bottom; }
    }
    placed.push(next); positions.set(next.id, {x: next.x, y: next.y}); bottom = Math.max(bottom, next.y + next.height + 32);
  }
  const arrivals = tiles.filter(tile => tile.fresh), rows: Tile[][] = [];
  let width = 0;
  for (const tile of arrivals) {
    const cell = Math.max(112, tile.width);
    if (!rows.length || width + 13 + cell > 362) { rows.push([]); width = 0; }
    rows.at(-1)!.push(tile); width += (width ? 13 : 0) + cell;
  }
  const firstArrival = bottom;
  for (const row of rows) {
    let x = 14;
    for (const tile of row) {
      const cell = Math.max(112, tile.width), next = {...tile, x: x + (cell - tile.width) / 2, y: bottom};
      positions.set(tile.id, {x: next.x, y: next.y}); placed.push(next); x += cell + 13;
    }
    bottom += Math.max(...row.map(tile => tile.height)) + 32;
  }
  const centre = placed.reduce((sum, tile) => sum + tile.y + tile.height / 2, 0) / Math.max(1, placed.length);
  const min = Math.min(82, ...placed.map(tile => tile.y)), max = Math.max(82, ...placed.map(tile => tile.y + tile.height));
  const shift = Math.max(65 - min, Math.min(281 - centre, 745 - max));
  for (const position of positions.values()) position.y += shift;
  return {positions, ...(carried.length && arrivals.length ? {divider: firstArrival + shift - 18} : {}), crowded: max + shift > 760};
}
