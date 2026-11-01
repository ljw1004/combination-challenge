export interface BoardRect {x:number;y:number;width:number;height:number}
const referenceBoard: BoardRect = {x: 0, y: 0, width: 390, height: 844};

/** Fill the portrait viewport, cropping the reference scene at its sides and bottom. */
export function viewportBoard(width: number, height: number) {
  const visibleWidth = Math.min(390, width);
  const scale = Math.max(visibleWidth / 390, height / 844);
  const bounds = {x: (390 - visibleWidth / scale) / 2, y: 0, width: visibleWidth / scale, height: height / scale};
  return {scale, width: visibleWidth, height, bounds};
}

/** Coordinates remain in the reference scene; only the visible drop bounds change. */
export function fitOnBoard(x: number, y: number, width: number, height: number, bounds = referenceBoard) {
  return {
    x: Math.max(bounds.x, Math.min(bounds.x + Math.max(0, bounds.width - width), x)),
    y: Math.max(bounds.y, Math.min(bounds.y + Math.max(0, bounds.height - height), y)),
  };
}

/** An authored centre is exact: an occupied or out-of-board rectangle falls back. */
export function placeAtCentre(centre: {x:number;y:number}, size: {width:number;height:number}, occupied: BoardRect[], bounds = referenceBoard) {
  const x = centre.x - size.width / 2, y = centre.y - size.height / 2;
  if (![x,y,size.width,size.height].every(Number.isFinite) || x < bounds.x || y < bounds.y || x + size.width > bounds.x + bounds.width || y + size.height > bounds.y + bounds.height) return;
  if (occupied.some(r => x < r.x+r.width && x+size.width > r.x && y < r.y+r.height && y+size.height > r.y)) return;
  return {x,y};
}

/** Fill a retired receiver's space, or put a new result beside a surviving receiver. */
export function placeCreation(receiver:BoardRect,result:{width:number;height:number},replace:boolean,bounds=referenceBoard,occupied:BoardRect[]=[]){
  const x=receiver.x+(receiver.width-result.width)/2,y=receiver.y+(receiver.height-result.height)/2;
  const fit=(position:{x:number;y:number})=>fitOnBoard(position.x,position.y,result.width,result.height,bounds);
  if(replace)return fit({x,y});
  // Leave room above a newly created icon for its transient name.
  const candidates=[
    {x,y:receiver.y+receiver.height+28},
    {x:receiver.x+receiver.width+12,y},
    {x:receiver.x-result.width-12,y},
    {x,y:receiver.y-result.height-28},
  ].map(fit);
  const apart=(p:{x:number;y:number},r:BoardRect)=>p.x+result.width<=r.x || r.x+r.width<=p.x || p.y+result.height<=r.y || r.y+r.height<=p.y;
  const clear=(p:{x:number;y:number})=>apart(p,receiver)&&occupied.every(r=>apart(p,r));
  const neighbour=candidates.find(clear);
  if(neighbour)return neighbour;
  // Search near the drop before falling back to an overlap. Only the new
  // result moves; every surviving ingredient retains its settled position.
  const edges=[receiver,...occupied];
  const xs=[bounds.x,bounds.x+bounds.width-result.width,x,...edges.flatMap(r=>[r.x-result.width-12,r.x+r.width+12])];
  const ys=[Math.max(bounds.y,65),bounds.y+bounds.height-result.height,y,...edges.flatMap(r=>[r.y-result.height-28,r.y+r.height+28])];
  const spaces=xs.flatMap(x=>ys.map(y=>fit({x,y}))).sort((a,b)=>Math.abs(a.x-x)+Math.abs(a.y-y)-Math.abs(b.x-x)-Math.abs(b.y-y));
  return spaces.find(clear)??candidates.find(p=>apart(p,receiver))??candidates[0];
}
