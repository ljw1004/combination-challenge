/** Opt-in, one-time vertical scene-entry placement. Not a render/resize helper. */
export type SceneEntryBox={id:string;x:number;y:number;w:number;h:number;/** Reserve a known authored upgrade without adding visual weight. */reserveH?:number};
export type SceneEntryPlan={positions:Map<string,{x:number;y:number}>;dividerY?:number;targetY:number;centerY:number;compressionRatio:number;clamped:boolean};
type Line={base:number;slope:number};
const EPS=1e-7;
/** Reproducible area-weighted tile approximation, not human visual judgement. */
export function sceneEntryCenter(boxes:SceneEntryBox[]):number{
 const weight=boxes.reduce((sum,b)=>sum+b.w*b.h,0);
 return weight?boxes.reduce((sum,b)=>sum+b.y*b.w*b.h,0)/weight:0;
}
/** Move only the supplied movable items. Fixed hotspots are obstacles, never
 * weights or translated scenery. Keep x, occupied bands, full card sizes and
 * existing overlaps intact. Only globally empty vertical gaps may shrink,
 * by a common proportion; the arrival divider's gap is locked.
 *
 * Choose the feasible center nearest one third; among equally good centers,
 * remove the least empty space. Dense scenes may have a clamped center. If no
 * safe placement exists, return null rather than clipping or adding overlap. */
export function centeredSceneEntryPlan(boxes:SceneEntryBox[],height:number,options:{top?:number;bottom?:number;dividerY?:number;fixed?:SceneEntryBox[]}={}):SceneEntryPlan|null{
 if(!boxes.length)return null;
 const top=options.top??34,bottom=options.bottom??height-12,targetY=height/3,fixed=options.fixed??[];
 const extent=(b:SceneEntryBox)=>Math.max(b.h,b.reserveH??b.h);
 if(!Number.isFinite(height)||height<=0||!Number.isFinite(top)||!Number.isFinite(bottom)||top>=bottom||[...boxes,...fixed].some(b=>![b.x,b.y,b.w,b.h,extent(b)].every(Number.isFinite)||b.w<=0||b.h<=0))return null;
 const bands:{lo:number;hi:number}[]=[];
 for(const b of [...boxes].sort((a,b)=>a.y-extent(a)/2-(b.y-extent(b)/2))){const lo=b.y-extent(b)/2,hi=b.y+extent(b)/2,last=bands.at(-1);if(last&&lo<=last.hi+EPS)last.hi=Math.max(last.hi,hi);else bands.push({lo,hi});}
 const gaps=bands.slice(1).map((b,i)=>{const lo=bands[i].hi,hi=b.lo,locked=options.dividerY!==undefined&&options.dividerY>=lo-EPS&&options.dividerY<=hi+EPS;return {lo,hi,space:locked?0:Math.max(0,hi-lo-4)};});
 const removed=(y:number)=>gaps.filter(g=>g.hi<=y+EPS).reduce((sum,g)=>sum+g.space,0);
 const offset=new Map(boxes.map(b=>[b.id,removed(b.y-extent(b)/2)]));
 const center=sceneEntryCenter(boxes),weight=boxes.reduce((n,b)=>n+b.w*b.h,0),meanRemoved=boxes.reduce((n,b)=>n+offset.get(b.id)!*b.w*b.h,0)/weight;
 const wanted:Line={base:targetY-center,slope:meanRemoved};
 const lower=boxes.map(b=>({base:top+extent(b)/2-b.y,slope:offset.get(b.id)!})),upper=boxes.map(b=>({base:bottom-extent(b)/2-b.y,slope:offset.get(b.id)!}));
 const forbidden:{lo:Line;hi:Line}[]=[];
 for(const b of boxes)for(const f of fixed)if(Math.abs(b.x-f.x)<(b.w+f.w)/2-EPS){
  // New-panel hotspots are fixed obstacles, not carried overlap clusters.
  const distance=(b.h+f.h)/2;
  if(distance>EPS)forbidden.push({lo:{base:f.y-distance-b.y,slope:offset.get(b.id)!},hi:{base:f.y+distance-b.y,slope:offset.get(b.id)!}});
 }
 const at=(line:Line,r:number)=>line.base+line.slope*r;
 // Feasible translations form intervals whose endpoints are linear in the
 // compression fraction. Their ordering/nearest-target choice changes only
 // at an endpoint intersection, so no pixel stepping or arbitrary search cap.
 const lines=[...new Map([wanted,...lower,...upper,...forbidden.flatMap(f=>[f.lo,f.hi])].map(l=>[l.base+':'+l.slope,l])).values()],ratios=new Set([0,1]);
 for(let i=0;i<lines.length;i++)for(let j=i+1;j<lines.length;j++){const a=lines[i],b=lines[j],d=a.slope-b.slope;if(Math.abs(d)>EPS){const r=(b.base-a.base)/d;if(r>0&&r<1)ratios.add(r);}}
 let best:{ratio:number;shift:number;error:number}|undefined;
 for(const ratio of [...ratios].sort((a,b)=>a-b)){
  const min=Math.max(...lower.map(l=>at(l,ratio))),max=Math.min(...upper.map(l=>at(l,ratio)));if(min>max+EPS)continue;
  const target=at(wanted,ratio),blocked=forbidden.map(f=>({lo:at(f.lo,ratio),hi:at(f.hi,ratio)}));
  const candidates=[Math.max(min,Math.min(max,target)),...blocked.flatMap(f=>[f.lo,f.hi])].filter(y=>y>=min-EPS&&y<=max+EPS&&!blocked.some(f=>y>f.lo+EPS&&y<f.hi-EPS));
  for(const shift of candidates){const error=Math.abs(shift-target);if(!best||error<best.error-EPS||Math.abs(error-best.error)<=EPS&&(ratio<best.ratio-EPS||Math.abs(ratio-best.ratio)<=EPS&&Math.abs(shift)<Math.abs(best.shift)))best={ratio,shift,error};}
  if(best&&best.error<EPS)break; // Ratios are ordered: exact center, least compression.
 }
 if(!best)return null;
 const {ratio,shift}=best,positions=new Map(boxes.map(b=>[b.id,{x:b.x,y:b.y-offset.get(b.id)!*ratio+shift}]));
 return {positions,...options.dividerY===undefined?{}:{dividerY:options.dividerY-removed(options.dividerY)*ratio+shift},targetY,centerY:center-meanRemoved*ratio+shift,compressionRatio:ratio,clamped:best.error>1e-5};
}

export type FirstSceneEntryPlan=SceneEntryPlan&{hotspotPositions:Map<string,{x:number;y:number}>;hotspotsLowered:boolean};
/** New hotspots are all local arrivals. Settle their rigid group below the
 * movable working set, near the lower playable band, not below the panel.
 * Their geometry is fixed after this call. Future artwork-anchored hotspots
 * must be authored as fixed obstacles instead of using this provisional rule. */
export function firstSceneEntryPlan(boxes:SceneEntryBox[],hotspots:SceneEntryBox[],height:number,options:{top?:number;bottom?:number;dividerY?:number}={}):FirstSceneEntryPlan|null{
 const top=options.top??34,bottom=options.bottom??height-12;
 if(!hotspots.length){const plan=centeredSceneEntryPlan(boxes,height,options);return plan?{...plan,hotspotPositions:new Map(),hotspotsLowered:false}:null;}
 const extent=(b:SceneEntryBox)=>Math.max(b.h,b.reserveH??b.h),min=top-Math.min(...hotspots.map(b=>b.y-extent(b)/2)),max=bottom-Math.max(...hotspots.map(b=>b.y+extent(b)/2));
 if(min>max)return null;
 const desired=Math.max(min,Math.min(max,height*.72-sceneEntryCenter(hotspots)));
 // A small finite set of meaningful lower anchors: preferred band, lowest
 // safe group, then its unchanged position. No scattering of hotspot frames.
 const shifts=[...new Set([desired,max,Math.max(min,Math.min(max,0))])];
 let best:FirstSceneEntryPlan|null=null,bestCost=Infinity;
 for(const shift of shifts){
  const fixed=hotspots.map(b=>({...b,y:b.y+shift}));
  const plan=boxes.length?centeredSceneEntryPlan(boxes,height,{...options,fixed}):{positions:new Map<string,{x:number;y:number}>(),targetY:height/3,centerY:height/3,compressionRatio:0,clamped:false};
  if(!plan)continue;
  const itemBottom=Math.max(top,...boxes.map(b=>plan.positions.get(b.id)!.y+b.h/2)),hotspotTop=Math.min(...fixed.map(b=>b.y-b.h/2));
  // Prefer a genuine lower furniture band; only dense exceptions interleave
  // horizontally disjoint things and hotspots or clamp the item centroid.
  const cost=Math.abs(plan.centerY-plan.targetY)*1000+Math.max(0,itemBottom+12-hotspotTop)*10+Math.abs(shift-desired);
  if(cost<bestCost-EPS){bestCost=cost;best={...plan,hotspotPositions:new Map(fixed.map(b=>[b.id,{x:b.x,y:b.y}])),hotspotsLowered:shift>EPS};}
 }
 return best;
}
