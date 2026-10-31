/** Board coordinates are unscaled; the browser knows the actual artwork/card size. */
export function fitOnBoard(x: number, y: number, width: number, height: number) {
  return {
    x: Math.max(0, Math.min(Math.max(0, 390 - width), x)),
    y: Math.max(0, Math.min(Math.max(0, 844 - height), y)),
  };
}

export interface BoardRect {x:number;y:number;width:number;height:number}

/** Fill a retired receiver's space, or put a new result beside a surviving receiver. */
export function placeCreation(receiver:BoardRect,result:{width:number;height:number},replace:boolean){
  const x=receiver.x+(receiver.width-result.width)/2,y=receiver.y+(receiver.height-result.height)/2;
  const fit=(position:{x:number;y:number})=>fitOnBoard(position.x,position.y,result.width,result.height);
  if(replace)return fit({x,y});
  // Leave room above a newly created icon for its transient name.
  const candidates=[
    {x,y:receiver.y+receiver.height+28},
    {x:receiver.x+receiver.width+12,y},
    {x:receiver.x-result.width-12,y},
    {x,y:receiver.y-result.height-28},
  ].map(fit);
  const clear=(p:{x:number;y:number})=>p.x+result.width<=receiver.x || receiver.x+receiver.width<=p.x || p.y+result.height<=receiver.y || receiver.y+receiver.height<=p.y;
  return candidates.find(clear)??candidates[0];
}
