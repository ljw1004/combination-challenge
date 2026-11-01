interface Tile { id: string; x: number; y: number; width: number; height: number; fresh: boolean; start?: {x: number; y: number} }
interface Rect {x: number; y: number; width: number; height: number}
interface ArrivalLayout {positions: Map<string, {x: number; y: number}>; divider?: number; crowded: boolean}

/** On chapter entry, keep automatic supplies clear of the fixed working places. */
export function clearArrivalHotspots(tiles: Tile[], layout: ArrivalLayout, hotspots: Rect[], bounds: Rect = {x:0,y:0,width:390,height:844}): ArrivalLayout {
  if (!hotspots.length) return layout;
  const apart = (a: Rect, b: Rect) => a.x+a.width+12<=b.x || b.x+b.width+12<=a.x || a.y+a.height+28<=b.y || b.y+b.height+28<=a.y;
  const placed = tiles.map(tile => ({...tile, ...layout.positions.get(tile.id)!}));
  // Explicit primitive starts are an authoring decision. Only automatic
  // arrivals/carry positions are adjusted, never an item placed at a hotspot.
  const displaced = placed.filter(tile => !(tile.fresh&&tile.start) && hotspots.some(h=>!apart(tile,h)));
  if (!displaced.length) return layout;
  const occupied: Rect[] = [...hotspots, ...placed.filter(tile=>!displaced.includes(tile))];
  const positions = new Map(layout.positions);
  let crowded = layout.crowded;
  for (const tile of displaced) {
    const left=bounds.x+14, right=bounds.x+bounds.width-14-tile.width;
    const top=Math.max(bounds.y+65,65), bottom=Math.min(bounds.y+bounds.height-60,760)-tile.height;
    const xs=[tile.x,left,right,...occupied.flatMap(r=>[r.x-tile.width-12,r.x+r.width+12])];
    const ys=[tile.y,top,bottom,...occupied.flatMap(r=>[r.y-tile.height-28,r.y+r.height+28])];
    const candidates=xs.flatMap(x=>ys.map(y=>({...tile,x:Math.max(left,Math.min(right,x)),y:Math.max(top,Math.min(bottom,y))})))
      .filter(p=>p.x>=bounds.x&&p.y>=bounds.y&&p.x+p.width<=bounds.x+bounds.width&&p.y+p.height<=bounds.y+bounds.height)
      .sort((a,b)=>Math.abs(a.x-tile.x)+Math.abs(a.y-tile.y)-Math.abs(b.x-tile.x)-Math.abs(b.y-tile.y));
    const next=candidates.find(p=>occupied.every(r=>apart(p,r)));
    if(next){positions.set(tile.id,{x:next.x,y:next.y});occupied.push(next);}
    else {occupied.push(tile);crowded=true;}
  }
  const fresh=tiles.filter(t=>t.fresh),carried=tiles.filter(t=>!t.fresh);
  const firstFresh=Math.min(...fresh.map(t=>positions.get(t.id)!.y));
  const lastCarried=Math.max(...carried.map(t=>positions.get(t.id)!.y+t.height));
  // A divider only describes the layout while the two groups remain separate.
  const divider=fresh.length&&carried.length&&firstFresh>=lastCarried+28?firstFresh-18:undefined;
  return {positions,divider,crowded};
}

/** Keep carried relationships and reserve room between icon rows for names above them. */
export function iconArrival(tiles: Tile[]): ArrivalLayout {
  if (!tiles.some(tile => tile.fresh)) return {positions: new Map(tiles.map(tile => [tile.id, {x: tile.x, y: tile.y}])), crowded: false};
  const anchored = tiles.filter(tile => tile.fresh && tile.start);
  if (anchored.length) {
    const automatic = tiles.filter(tile => !anchored.includes(tile)), layout = iconArrival(automatic);
    const occupied = anchored.map(tile => ({...tile, x: tile.start!.x * 390 - tile.width / 2, y: tile.start!.y * 844 - tile.height / 2}));
    const clear = (tile: Tile) => occupied.every(other => tile.x + tile.width + 12 <= other.x || other.x + other.width + 12 <= tile.x || tile.y + tile.height + 28 <= other.y || other.y + other.height + 28 <= tile.y);
    for (const tile of occupied) layout.positions.set(tile.id, {x: tile.x, y: tile.y});
    for (const tile of automatic) {
      let next = {...tile, ...layout.positions.get(tile.id)!};
      if (!clear(next)) {
        const candidates = Array.from({length: 22}, (_, row) => [14, 139, 264].map(x => ({...next, x: Math.min(x, 376 - next.width), y: 65 + row * 32}))).flat();
        const space = candidates.filter(candidate => candidate.y + candidate.height <= 760).sort((a, b) => Math.abs(a.x - next.x) + Math.abs(a.y - next.y) - Math.abs(b.x - next.x) - Math.abs(b.y - next.y)).find(clear);
        if (space) next = space; else layout.crowded = true;
      }
      occupied.push(next); layout.positions.set(next.id, {x: next.x, y: next.y});
    }
    return layout;
  }
  const positions = new Map<string, {x: number; y: number}>();
  const placed: Tile[] = [], carried = tiles.filter(tile => !tile.fresh).sort((a, b) => a.y - b.y);
  const arrivals = tiles.filter(tile => tile.fresh), rows: Tile[][] = [];
  let width = 0;
  for (const tile of arrivals) {
    const cell = Math.max(112, tile.width);
    if (!rows.length || width + 13 + cell > 362) { rows.push([]); width = 0; }
    rows.at(-1)!.push(tile); width += (width ? 13 : 0) + cell;
  }
  if (carried.length) {
    const bottom = Math.max(...carried.map(tile => tile.y + tile.height)) + 32;
    const arrivalHeight = rows.reduce((height, row) => height + Math.max(...row.map(tile => tile.height)) + 32, -32);
    const shift = Math.min(0, 745 - bottom - arrivalHeight);
    // Keep exact placements whenever they fit; otherwise translate the carried group only as far as necessary.
    if (!shift || Math.min(...carried.map(tile => tile.y)) + shift >= 65) {
      carried.forEach(tile => positions.set(tile.id, {x: tile.x, y: tile.y + shift}));
      let y = bottom + shift;
      for (const row of rows) {
        let x = 14;
        for (const tile of row) { const cell = Math.max(112, tile.width); positions.set(tile.id, {x: x + (cell - tile.width) / 2, y}); x += cell + 13; }
        y += Math.max(...row.map(tile => tile.height)) + 32;
      }
      return {positions, divider: bottom + shift - 18, crowded: false};
    }
  }
  // Dense mixed arrivals need the existing compaction fallback; ordinary carry never reaches this path.
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
