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

/** Fill a retired receiver's space, or overlap a surviving receiver's corner.
 * Occupied rectangles exclude the receiver, whose small overlap is deliberate. */
export function placeCreation(receiver:BoardRect,result:{width:number;height:number},replace:boolean,bounds=referenceBoard,occupied:BoardRect[]=[]){
  const x=receiver.x+(receiver.width-result.width)/2,y=receiver.y+(receiver.height-result.height)/2;
  const fit=(position:{x:number;y:number})=>fitOnBoard(position.x,position.y,result.width,result.height,bounds);
  if(replace)return fit({x,y});
  const overlapX=.1*Math.min(receiver.width,result.width),overlapY=.1*Math.min(receiver.height,result.height);
  const left=receiver.x-result.width+overlapX,right=receiver.x+receiver.width-overlapX;
  const top=receiver.y-result.height+overlapY,bottom=receiver.y+receiver.height-overlapY;
  const centrality=(p:{x:number;y:number})=>(p.x+result.width/2-bounds.x-bounds.width/2)**2+(p.y+result.height/2-bounds.y-bounds.height/2)**2;
  const inward=(a:{x:number;y:number},b:{x:number;y:number})=>centrality(a)-centrality(b);
  const diagonals=[{x:left,y:top},{x:right,y:top},{x:left,y:bottom},{x:right,y:bottom}].sort(inward);
  const sides=[{x:left,y},{x:right,y},{x,y:top},{x,y:bottom}].sort(inward);
  const overlap=(p:{x:number;y:number},r:BoardRect)=>Math.max(0,Math.min(p.x+result.width,r.x+r.width)-Math.max(p.x,r.x))*Math.max(0,Math.min(p.y+result.height,r.y+r.height)-Math.max(p.y,r.y));
  const clear=(p:{x:number;y:number})=>p.x>=bounds.x&&p.y>=bounds.y&&p.x+result.width<=bounds.x+bounds.width&&p.y+result.height<=bounds.y+bounds.height&&occupied.every(r=>overlap(p,r)<=1e-6);
  const neighbour=diagonals.find(clear)??sides.find(clear);
  if(neighbour)return neighbour;
  // In a crowded scene, compare all eight positions by total intersected area,
  // including the parent. Fit only here: clamping can enlarge its 10% overlap.
  const crowded=[...diagonals,...sides].map(fit).map(position=>({position,area:[receiver,...occupied].reduce((sum,r)=>sum+overlap(position,r),0)}));
  crowded.sort((a,b)=>a.area-b.area||inward(a.position,b.position));
  return crowded[0].position;
}
