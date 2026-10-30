export interface Rect { left:number;top:number;right:number;bottom:number }
/** Subtract the union of card rectangles from the goals' native paint/hit area. */
export function goalClipPath(width:number,height:number,cards:Rect[]):string {
  const holes=cards.map(r=>({left:Math.max(0,r.left),top:Math.max(0,r.top),right:Math.min(width,r.right),bottom:Math.min(height,r.bottom)})).filter(r=>r.right>r.left&&r.bottom>r.top);
  if(!holes.length)return 'none';
  // Disjoint vertical strips avoid even-odd cancellation where two cards overlap.
  const xs=[...new Set(holes.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b);
  let path=`M0 0H${width}V${height}H0Z`;
  for(let i=0;i<xs.length-1;i++){
    const left=xs[i],right=xs[i+1],ranges=holes.filter(r=>r.left<right&&r.right>left).map(r=>[r.top,r.bottom]).sort((a,b)=>a[0]-b[0]);
    const merged:number[][]=[];
    for(const range of ranges){const last=merged.at(-1);if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push([...range]);}
    for(const [top,bottom] of merged)path+=`M${left} ${top}H${right}V${bottom}H${left}Z`;
  }
  return `path(evenodd, "${path}")`;
}
