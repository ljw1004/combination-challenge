/** Pure chapter-entry geometry. Never used during render, resize or restore. */
export type ArrivalBox={id:string;x:number;y:number;w:number;h:number};
export type GroupedArrivalPlan={positions:Map<string,{x:number;y:number}>;dividerY:number;compressedBy:number};
const TOP=34,GAP=10,DIVIDER_GAP=46;
/** Keep every old x coordinate and every occupied vertical band intact. Only
 * globally empty y gaps can shrink, all by the same proportion, and only when
 * the natural layout would exceed the soft 500px scene budget. Dense boards
 * simply scroll; a viewport fraction is never assigned to either group. */
export function groupedArrivalPlan(old:ArrivalBox[],supplies:ArrivalBox[],width:number,softHeight=500,spacing:{gap?:number;dividerGap?:number}={}):GroupedArrivalPlan|null{
 const gap=spacing.gap??GAP,dividerGap=spacing.dividerGap??DIVIDER_GAP;
 if(!old.length||!supplies.length)return null;
 const cols=Math.max(1,Math.floor((width-8)/100)),positions=new Map<string,{x:number;y:number}>();
 let newHeight=0;
 for(let i=0;i<supplies.length;i+=cols){const row=supplies.slice(i,i+cols),height=Math.max(...row.map(t=>t.h));
  for(const [col,t]of row.entries())positions.set(t.id,{x:52+col*100,y:newHeight+height/2});
  newHeight+=height+(i+cols<supplies.length?gap:0);
 }
 const bands:{lo:number;hi:number}[]=[];
 for(const box of [...old].sort((a,b)=>(a.y-a.h/2)-(b.y-b.h/2))){const lo=box.y-box.h/2,hi=box.y+box.h/2,last=bands.at(-1);if(last&&lo<=last.hi)last.hi=Math.max(last.hi,hi);else bands.push({lo,hi});}
 const gaps=bands.map((b,i)=>({end:b.lo,available:Math.max(0,b.lo-(i?bands[i-1].hi+gap:TOP))}));
 const bottom=bands.at(-1)!.hi,available=gaps.reduce((sum,g)=>sum+g.available,0);
 const compressedBy=Math.min(available,Math.max(0,bottom+dividerGap+newHeight+12-softHeight)),ratio=available?compressedBy/available:0;
 for(const box of old){const removed=gaps.filter(g=>g.end<=box.y-box.h/2+.000001).reduce((sum,g)=>sum+g.available*ratio,0);positions.set(box.id,{x:box.x,y:box.y-removed});}
 const oldBottom=Math.max(...old.map(t=>positions.get(t.id)!.y+t.h/2)),dividerY=oldBottom+Math.min(20,dividerGap/2);
 for(const supply of supplies)positions.get(supply.id)!.y+=oldBottom+dividerGap;
 return {positions,dividerY,compressedBy};
}
