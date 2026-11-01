import {overlapsHotspot, type Rect, type HotspotRegion} from './hotspot-view.ts';

export interface ArrivalTile extends Rect {
  id: string;
  fresh: boolean;
  /** Last occupied chapter, captured before the engine carries the object. */
  fromChapter?: number;
  start?: {x: number; y: number};
  fixed?: boolean;
}
export interface ArrivalOptions {
  bounds: Rect;
  /** Top of the measured goals, in scene coordinates. */
  goalsTop: number;
  previousChapter?: number;
  hotspots: HotspotRegion[];
  /** Logical developer replays have no previous measured spatial arrangement. */
  checkpoint?: boolean;
}
export interface ArrivalLayout {
  positions: Map<string, {x: number; y: number}>;
  divider?: number;
  crowded: boolean;
}
const EPS = 1e-6, GAP = 28, EDGE = 12;
const area = (r: Rect) => r.width * r.height;
const bottom = (r: Rect) => r.y + r.height;
const right = (r: Rect) => r.x + r.width;
const intersection = (a: Rect, b: Rect) => ({x: Math.max(a.x,b.x), y: Math.max(a.y,b.y), width: Math.min(right(a),right(b))-Math.max(a.x,b.x), height: Math.min(bottom(a),bottom(b))-Math.max(a.y,b.y)});
const touches = (a: Rect, b: Rect) => {const r=intersection(a,b); return r.width>EPS && r.height>EPS;};
const fits = (r: Rect, bounds: Rect) => r.x>=bounds.x-EPS && r.y>=bounds.y-EPS && right(r)<=right(bounds)+EPS && bottom(r)<=bottom(bounds)+EPS;
const distance = (a: Rect, b: Rect) => (a.x-b.x)**2 + (a.y-b.y)**2;
const centrality = (r: Rect, bounds: Rect) => (r.x+r.width/2-bounds.x-bounds.width/2)**2+(r.y+r.height/2-bounds.y-bounds.height/2)**2;

/** Union, rather than a sum or a pairwise test: several neighbours share one budget. */
export function coveredFraction(tile: Rect, others: Rect[]): number {
  const clips=others.map(r=>intersection(tile,r)).filter(r=>r.width>EPS&&r.height>EPS);
  const xs=[...new Set(clips.flatMap(r=>[r.x,right(r)]))].sort((a,b)=>a-b);
  let covered=0;
  for(let i=1;i<xs.length;i++) {
    const spans=clips.filter(r=>r.x<xs[i]&&right(r)>xs[i-1]).map(r=>[r.y,bottom(r)]).sort((a,b)=>a[0]-b[0]);
    let end=-Infinity,height=0;
    for(const [start,stop] of spans){height+=Math.max(0,stop-Math.max(start,end));end=Math.max(end,stop);}
    covered+=(xs[i]-xs[i-1])*height;
  }
  return covered/Math.max(EPS,area(tile));
}

function acceptable(tile: Rect, placed: Rect[], threshold: number) {
  if(coveredFraction(tile,placed)>threshold+EPS)return false;
  // Authored/fixed objects can already overlap; never worsen that pre-existing excess.
  return placed.every((r,i)=>!touches(tile,r)||coveredFraction(r,[...placed.filter((_,j)=>i!==j),tile])<=Math.max(threshold,coveredFraction(r,placed.filter((_,j)=>i!==j)))+EPS);
}

/** At a given height, subtract the exact forbidden horizontal intervals. */
function freeIntervals(tile: Rect, y: number, bounds: Rect, obstacles: HotspotRegion[]) {
  let intervals=[[bounds.x,right(bounds)-tile.width]];
  for(const h of obstacles) {
    let left=h.x-tile.width,end=right(h);
    if(h.circular){
      const cy=h.y+h.height/2,dy=Math.max(y-cy,cy-y-tile.height,0),radius=h.width/2;
      if(dy>=radius-EPS)continue;
      const dx=Math.sqrt(radius*radius-dy*dy),cx=h.x+radius;
      left=cx-dx-tile.width;end=cx+dx;
    }else if(y>=bottom(h)-EPS||y+tile.height<=h.y+EPS)continue;
    intervals=intervals.flatMap(([a,b])=>end<=a+EPS||left>=b-EPS?[[a,b]]:[...(left>=a-EPS?[[a,Math.min(b,left)]]:[]),...(end<=b+EPS?[[Math.max(a,end),b]]:[])]);
  }
  return intervals.filter(([a,b])=>b>=a-EPS);
}

/** Nearby positions, boundary contacts and a fine grid; circles use exact x clearance. */
function candidates(tile: Rect, bounds: Rect, obstacles: HotspotRegion[], neighbours: Rect[], step=12, screen=bounds): Rect[] {
  if(tile.width>bounds.width+EPS||tile.height>bounds.height+EPS)return [];
  const clampY=(y:number)=>Math.max(bounds.y,Math.min(bottom(bounds)-tile.height,y));
  const edges=[...obstacles,...neighbours];
  const ys=new Set([clampY(tile.y),bounds.y,bottom(bounds)-tile.height,...edges.flatMap(r=>[r.y-tile.height,bottom(r),r.y-tile.height-GAP,bottom(r)+GAP]).map(clampY)]);
  for(let y=bounds.y;y<bottom(bounds)-tile.height;y+=step)ys.add(y);
  const xs=[tile.x,bounds.x+(bounds.width-tile.width)/2,...edges.flatMap(r=>[r.x-tile.width,right(r),r.x-tile.width-EDGE,right(r)+EDGE])];
  for(let x=bounds.x;x<right(bounds)-tile.width;x+=step)xs.push(x);
  const result:Rect[]=[];
  for(const y of ys)for(const [left,end] of freeIntervals(tile,y,bounds,obstacles)) {
    for(const x of new Set([left,end,...xs.map(x=>Math.max(left,Math.min(end,x)))]))result.push({...tile,x,y});
  }
  return result.sort((a,b)=>distance(a,tile)-distance(b,tile)||centrality(a,screen)-centrality(b,screen)||a.y-b.y||a.x-b.x);
}

/** Find even a narrow station-free pocket before permitting a pathological overlap.
 * A rectangle of possible top-lefts is rejected only when one convex forbidden
 * region contains all four corners. Subdivision handles unions of stations. */
function hotspotSpace(tile: Rect, bounds: Rect, hotspots: HotspotRegion[]): Rect | undefined {
  if(tile.width>bounds.width||tile.height>bounds.height)return;
  const queue=[{x:bounds.x,y:bounds.y,width:bounds.width-tile.width,height:bounds.height-tile.height}];
  while(queue.length){
    const cell=queue.pop()!,corners=[{...tile,x:cell.x,y:cell.y},{...tile,x:right(cell),y:cell.y},{...tile,x:cell.x,y:bottom(cell)},{...tile,x:right(cell),y:bottom(cell)}];
    const clear=corners.find(p=>hotspots.every(h=>!overlapsHotspot(p,h)));if(clear)return clear;
    if(hotspots.some(h=>corners.every(p=>overlapsHotspot(p,h))))continue;
    if(cell.width<EPS&&cell.height<EPS)continue;
    if(cell.width>=cell.height){const width=cell.width/2;queue.push({...cell,width},{...cell,x:cell.x+width,width});}
    else {const height=cell.height/2;queue.push({...cell,height},{...cell,y:cell.y+height,height});}
  }
}

function shelves(tiles: ArrivalTile[], width: number): ArrivalTile[] {
  let x=0,y=0,height=0;
  return tiles.map(tile=>{
    if(x&&x+tile.width>width){x=0;y+=height+GAP;height=0;}
    const placed={...tile,x,y};x+=tile.width+EDGE;height=Math.max(height,tile.height);return placed;
  });
}

function reserveSupplies(fresh: ArrivalTile[], fixed: ArrivalTile[], carried: ArrivalTile[], bounds: Rect, hotspots: HotspotRegion[]) {
  if(!fresh.length)return {supplies:[] as ArrivalTile[],barrier:undefined as Rect|undefined};
  const orders=[fresh,[...fresh].sort((a,b)=>b.height-a.height||a.id.localeCompare(b.id)),[...fresh].sort((a,b)=>b.width-a.width||a.id.localeCompare(b.id))];
  let best:{supplies:ArrivalTile[];barrier:Rect}|undefined;
  // Leave enough room beneath supplies for a nearby creation as well as the
  // goals. If space is tight, reduce this comfort margin before losing a row.
  const margin=Math.max(48,Math.min(120,Math.max(...fresh.map(t=>t.height))+GAP));
  for(const extra of [margin,EDGE,0]){
    const supplyBounds={...bounds,height:Math.max(0,bounds.height-extra)};
    for(const width of [bounds.width,bounds.width*.75,bounds.width*.5])for(const order of orders){
      const template=shelves(order,width),w=Math.max(...template.map(right)),h=Math.max(...template.map(bottom));
      const block={x:bounds.x+(bounds.width-w)/2,y:bottom(bounds)-h-EDGE,width:w,height:h};
      const locations=candidates(block,supplyBounds,[],[...fixed,...hotspots]).sort((a,b)=>b.y-a.y||centrality(a,bounds)-centrality(b,bounds));
      for(const location of locations){
        if(best&&location.y<best.barrier.y+GAP-EPS)break;
        const supplies=template.map(t=>({...t,x:t.x+location.x,y:t.y+location.y}));
        if(supplies.some(t=>hotspots.some(h=>overlapsHotspot(t,h))||fixed.some(r=>touches(t,r))))continue;
        const barrier={x:bounds.x,y:location.y-GAP,width:bounds.width,height:bottom(bounds)-location.y+GAP};
        const upper={...bounds,height:Math.max(0,barrier.y-bounds.y)};
        // Do not reserve a strip that makes an otherwise placeable retained object impossible.
        if(carried.some(t=>!hotspotSpace(t,upper,hotspots)))continue;
        best={supplies,barrier};break;
      }
    }
    if(best)break;
  }
  return best;
}

/** Small deterministic beam search protects each chapter's arrangement before relaxing overlap. */
function placeGroup(group: ArrivalTile[], fixed: ArrivalTile[], bounds: Rect, hotspots: HotspotRegion[], threshold: number, screen: Rect) {
  const orders=[group,[...group].sort((a,b)=>area(b)-area(a)||a.id.localeCompare(b.id))];
  let best:{placed:ArrivalTile[];cost:number}|undefined;
  for(const order of orders){
    let states=[{placed:[] as ArrivalTile[],cost:0}];
    for(const tile of order){
      const next:typeof states=[];
      for(const state of states){
        const occupied=[...fixed,...state.placed];
        const choices=candidates(tile,bounds,hotspots,[...occupied,...group],12,screen);
        let count=0;
        for(const p of choices){
          if(!acceptable(p,occupied,threshold))continue;
          next.push({placed:[...state.placed,{...tile,...p}],cost:state.cost+distance(p,tile)});
          if(++count===3)break;
        }
      }
      states=next.sort((a,b)=>a.cost-b.cost||a.placed.reduce((n,t)=>n+centrality(t,screen),0)-b.placed.reduce((n,t)=>n+centrality(t,screen),0)).slice(0,4);
      if(!states.length)break;
    }
    if(states[0]&&(!best||states[0].cost<best.cost))best=states[0];
    if(best?.cost===0)break;
  }
  return best?.placed;
}

export function arrivalLayout(tiles: ArrivalTile[], options: ArrivalOptions): ArrivalLayout {
  const {bounds,hotspots,previousChapter}=options;
  if(options.checkpoint){
    const seed=new Map(shelves(tiles.filter(t=>!t.fresh&&!t.fixed),bounds.width-16).map(t=>[t.id,{x:t.x+bounds.x+8,y:t.y+bounds.y+65}]));
    tiles=tiles.map(t=>({...t,...seed.get(t.id)}));
  }
  const working={x:bounds.x+8,y:bounds.y+EDGE,width:Math.max(0,bounds.width-16),height:Math.max(0,Math.min(bottom(bounds)-2*EDGE,options.goalsTop-GAP)-bounds.y-EDGE)};
  const fixed=tiles.filter(t=>t.fixed||t.fresh&&t.start).map(t=>t.fresh&&t.start?{...t,x:t.start.x*390-t.width/2,y:t.start.y*844-t.height/2}:{...t});
  const fresh=tiles.filter(t=>t.fresh&&!t.start&&!t.fixed),carried=tiles.filter(t=>!t.fresh&&!t.fixed);
  let crowded=false;
  let reservation=reserveSupplies(fresh,fixed,carried,working,hotspots);
  if(!reservation){
    // A blocked lower strip can still leave usable pockets. Reserve actual
    // rectangles there; vertical separation yields before station clearance.
    const supplies:ArrivalTile[]=[];
    for(const tile of fresh){
      const preferred={...tile,x:working.x+(working.width-tile.width)/2,y:bottom(working)-tile.height-EDGE};
      const choices=candidates(preferred,working,hotspots,[...fixed,...supplies]);
      const p=choices.find(p=>acceptable(p,[...fixed,...supplies],0))??choices.find(p=>acceptable(p,[...fixed,...supplies],.1))??choices[0]??hotspotSpace(tile,bounds,hotspots);
      supplies.push({...tile,...p});
      if(!p||!acceptable(p,[...fixed,...supplies.slice(0,-1)],.1))crowded=true;
    }
    reservation={supplies,barrier:undefined};
  }
  const reserved=reservation.barrier?[reservation.barrier]:reservation.supplies;
  const obstacles=[...hotspots,...reserved];
  const upper=reservation.barrier?{...working,height:Math.max(0,reservation.barrier.y-working.y)}:working;
  const placed=[...fixed];
  const chapters=[...new Set(carried.map(t=>t.fromChapter??previousChapter??-1))].sort((a,b)=>b-a);
  for(const chapter of chapters){
    const group=carried.filter(t=>(t.fromChapter??previousChapter??-1)===chapter);
    let region=tiles.some(t=>t.fresh)&&chapter!==previousChapter?{...upper,height:Math.max(0,Math.min(bottom(upper),bounds.y+bounds.height*2/3)-upper.y)}:upper;
    // An old object too tall for two-thirds can still fit the available board.
    if(group.some(t=>!hotspotSpace(t,region,obstacles)))region=upper;
    let result:ArrivalTile[]|undefined;
    for(const threshold of [.1,.15,.25,.4,.6,1]){
      result=placeGroup(group,placed,region,obstacles,threshold,bounds);
      if(result){if(threshold>.1)crowded=true;break;}
    }
    if(!result){
      crowded=true;
      result=group.map(t=>({...t,...(hotspotSpace(t,upper,obstacles)??hotspotSpace(t,bounds,obstacles)??hotspotSpace(t,bounds,hotspots))}));
    }
    placed.push(...result);
  }
  // Lift the reserved arrangement only to a newly validated position below the
  // carried objects. A station between the two positions can prevent the lift.
  let supplies=reservation.supplies;
  if(supplies.length&&placed.length){
    const top=Math.min(...supplies.map(t=>t.y)),desired=Math.max(working.y,...placed.map(t=>bottom(t)+GAP));
    for(let shift=Math.max(0,top-desired);shift>0;shift-=1){
      const moved=supplies.map(t=>({...t,y:t.y-shift}));
      if(moved.every(t=>fits(t,working)&&hotspots.every(h=>!overlapsHotspot(t,h))&&placed.every(p=>!touches(t,p)))){supplies=moved;break;}
    }
  }
  placed.push(...supplies);
  const positions=new Map(placed.map(t=>[t.id,{x:t.x,y:t.y}]));
  const newTiles=placed.filter(t=>t.fresh),oldTiles=placed.filter(t=>!t.fresh);
  const first=Math.min(...newTiles.map(t=>t.y)),last=Math.max(...oldTiles.map(bottom));
  return {positions,crowded,divider:newTiles.length&&oldTiles.length&&first>=last+GAP-EPS?first-18:undefined};
}
