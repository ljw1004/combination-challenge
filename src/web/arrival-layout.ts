import {overlapsHotspot, type Rect, type HotspotRegion} from './hotspot-view.ts';

export interface ArrivalTile extends Rect {
  id: string;
  fresh: boolean;
  /** Last occupied chapter, captured before the engine carries the object. */
  fromChapter?: number;
  start?: {x: number; y: number};
  fixed?: boolean;
  /** Measured transient icon badge above the image, in scene coordinates. */
  headroom?: number;
}
export interface ArrivalOptions {
  bounds: Rect;
  scene?: {width:number;height:number};
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
const overlapArea = (a: Rect, b: Rect) => {const r=intersection(a,b);return Math.max(0,r.width)*Math.max(0,r.height);};

/** Exact circle/rectangle intersection, so exposed circular corners stay useful. */
function hotspotOverlap(tile: Rect, hotspot: HotspotRegion): number {
  if(!overlapsHotspot(tile,hotspot))return 0;
  if(!hotspot.circular)return overlapArea(tile,hotspot);
  const radius=hotspot.width/2,cx=hotspot.x+radius,cy=hotspot.y+radius;
  const integral=(x:number)=>(x*Math.sqrt(Math.max(0,radius*radius-x*x))+radius*radius*Math.asin(x/radius))/2;
  // Area from the circle centre to (x,y), reflected into the first quadrant.
  const quadrant=(x:number,y:number)=>{
    const sign=Math.sign(x)*Math.sign(y);
    x=Math.min(radius,Math.abs(x));y=Math.min(radius,Math.abs(y));
    const flat=Math.min(x,Math.sqrt(Math.max(0,radius*radius-y*y)));
    return sign*(flat*y+integral(x)-integral(flat));
  };
  return Math.max(0,quadrant(right(tile)-cx,bottom(tile)-cy)-quadrant(tile.x-cx,bottom(tile)-cy)-quadrant(right(tile)-cx,tile.y-cy)+quadrant(tile.x-cx,tile.y-cy));
}

interface PlacementPreferences {
  softHotspots?: HotspotRegion[];
  goals?: Rect;
  /** Only for artwork physically larger than the visible panel. Never shrink it. */
  overflow?: boolean;
}
type Cost = [itemOverlap:number,hotspotOverlap:number,goalOverlap:number,displacement:number];
const compareCost = (a: Cost,b: Cost) => a[0]-b[0]||a[1]-b[1]||a[2]-b[2]||a[3]-b[3];
const addCost = (a: Cost,b: Cost): Cost => [a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]];
function placementCost(tile: Rect, preferred: Rect, occupied: Rect[], threshold: number, preferences: PlacementPreferences): Cost {
  return [threshold>.1?coveredFraction(tile,occupied)+occupied.reduce((sum,r)=>sum+overlapArea(tile,r)/Math.max(EPS,area(r)),0):0,
    (preferences.softHotspots??[]).reduce((sum,h)=>sum+hotspotOverlap(tile,h),0),
    preferences.goals?overlapArea(tile,preferences.goals):0,distance(tile,preferred)];
}

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

/** Find even a narrow station-free pocket when testing a clearance constraint.
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

function shelves(tiles: ArrivalTile[], width: number, gap=EDGE): ArrivalTile[] {
  let x=0,y=0,height=0;
  return tiles.map(tile=>{
    if(x&&x+tile.width>width){x=0;y+=height+GAP;height=0;}
    const placed={...tile,x,y};x+=tile.width+gap;height=Math.max(height,tile.height);return placed;
  });
}

/** Checkpoint replays have no player arrangement to preserve. Centre each row,
 * then centre the retained/new-supply groups together in the visible scene. */
function checkpointPreferences(tiles: ArrivalTile[], bounds: Rect, screen: Rect): ArrivalTile[] {
  const groups=[tiles.filter(t=>!t.fresh),tiles.filter(t=>t.fresh)];
  const preferred:ArrivalTile[]=[];
  let height=0;
  for(const group of groups){
    const rows=shelves(group,bounds.width,GAP);
    for(const y of new Set(rows.map(t=>t.y))){
      const row=rows.filter(t=>t.y===y),width=Math.max(...row.map(right)),rowHeight=Math.max(...row.map(t=>t.height));
      preferred.push(...row.map(t=>({...t,x:t.x+bounds.x+(bounds.width-width)/2,y:height+y+(rowHeight-t.height)/2})));
    }
    if(rows.length)height+=Math.max(...rows.map(bottom))+GAP;
  }
  height=Math.max(0,height-GAP);
  const top=Math.max(bounds.y,Math.min(bottom(bounds)-height,screen.y+(screen.height-height)/2));
  return preferred.map(t=>({...t,y:t.y+top}));
}

function arrivalResult(placed: ArrivalTile[], crowded: boolean): ArrivalLayout {
  const positions=new Map(placed.map(t=>[t.id,{x:t.x,y:t.y}]));
  const newTiles=placed.filter(t=>t.fresh),oldTiles=placed.filter(t=>!t.fresh);
  const first=Math.min(...newTiles.map(t=>t.y)),last=Math.max(...oldTiles.map(bottom));
  return {positions,crowded,divider:newTiles.length&&oldTiles.length&&first>=last+GAP-EPS?first-18:undefined};
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
function placeGroup(group: ArrivalTile[], fixed: ArrivalTile[], bounds: Rect, hotspots: HotspotRegion[], threshold: number, screen: Rect, gap=0, preferences: PlacementPreferences={}) {
  const orders=[group,[...group].sort((a,b)=>area(b)-area(a)||a.id.localeCompare(b.id))];
  let best:{placed:ArrivalTile[];cost:Cost}|undefined;
  for(const order of orders){
    let states=[{placed:[] as ArrivalTile[],cost:[0,0,0,0] as Cost}];
    for(const tile of order){
      const next:typeof states=[];
      for(const state of states){
        const occupied=[...fixed,...state.placed];
        const available=preferences.overflow?{...bounds,width:Math.max(bounds.width,tile.width),height:Math.max(bounds.height,tile.height)}:bounds;
        const choices=candidates(tile,available,hotspots,[...occupied,...group,...(preferences.softHotspots??[])],12,screen);
        // A visible badge may use the top comfort margin without displacing an
        // already settled image. Keep all real board and obstacle constraints.
        if(tile.headroom&&tile.y<bounds.y){
          const top=Math.max(screen.y,bounds.y-tile.headroom);
          if(fits(tile,{...bounds,y:top,height:bottom(bounds)-top})&&hotspots.every(h=>!overlapsHotspot(tile,h)))choices.unshift(tile);
        }
        const ranked=choices.map(p=>({p,cost:placementCost(p,tile,occupied,threshold,preferences)}));
        if(threshold>.1||preferences.softHotspots?.length||preferences.goals)ranked.sort((a,b)=>compareCost(a.cost,b.cost)||centrality(a.p,screen)-centrality(b.p,screen));
        let count=0;
        for(const {p,cost} of ranked){
          if(gap&&occupied.some(r=>touches({x:p.x-gap,y:p.y-gap,width:p.width+2*gap,height:p.height+2*gap},r)))continue;
          if(!acceptable(p,occupied,threshold))continue;
          next.push({placed:[...state.placed,{...tile,...p}],cost:addCost(state.cost,cost)});
          if(++count===3)break;
        }
      }
      states=next.sort((a,b)=>compareCost(a.cost,b.cost)||a.placed.reduce((n,t)=>n+centrality(t,screen),0)-b.placed.reduce((n,t)=>n+centrality(t,screen),0)).slice(0,4);
      if(!states.length)break;
    }
    if(states[0]&&(!best||compareCost(states[0].cost,best.cost)<0))best=states[0];
    if(best?.cost.every(value=>value===0))break;
  }
  return best?.placed;
}

/** Retry a blocked arrival as a whole before accepting avoidable overlap.
 * Corner preferences offer compact alternatives to the local displacement beam;
 * compare whole arrangements by coverage, then actual displacement. */
function repackGroup(group: ArrivalTile[], fixed: ArrivalTile[], bounds: Rect, hotspots: HotspotRegion[], screen: Rect, threshold=.1, preferences: PlacementPreferences={}) {
  if(!preferences.overflow&&group.some(t=>!hotspotSpace(t,bounds,hotspots)))return;
  const nearby=placeGroup(group,fixed,bounds,hotspots,threshold,screen,0,preferences);
  if(nearby&&threshold<=.1&&!preferences.softHotspots?.length&&!preferences.goals)return nearby;
  const original=new Map(group.map(t=>[t.id,t]));
  const costOf=(placed:ArrivalTile[])=>placed.reduce((sum,t)=>addCost(sum,placementCost(t,original.get(t.id)!,[...fixed,...placed.filter(p=>p!==t)],threshold,preferences)),[0,0,0,0] as Cost);
  let best=nearby?{placed:nearby,cost:costOf(nearby)}:undefined;
  for(const farX of [false,true])for(const farY of [false,true]){
    const seed=group.map(t=>({...t,x:farX?right(bounds)-t.width:bounds.x,y:farY?bottom(bounds)-t.height:bounds.y}));
    // Compact alternatives can sacrifice a little goal space for one item to
    // expose much more of a hotspot for another. Score them only as a whole.
    const placed=placeGroup(seed,fixed,bounds,hotspots,threshold,screen,0,{overflow:preferences.overflow});
    if(!placed)continue;
    const cost=costOf(placed);
    if(!best||compareCost(cost,best.cost)<0)best={placed,cost};
  }
  return best?.placed;
}

/** Try the usual supply reservation and chapter priorities without concealing items. */
function tryArrival(tiles: ArrivalTile[], options: ArrivalOptions, working: Rect, fixed: ArrivalTile[]): ArrivalLayout | undefined {
  const {bounds,hotspots,previousChapter}=options;
  if(options.checkpoint){
    const preferred=checkpointPreferences(tiles.filter(t=>!t.fixed&&!(t.fresh&&t.start)),working,bounds);
    // Spend spare room on separation before accepting the ordinary overlap
    // allowance. Fixed authored starts and inherited occupants never move.
    for(const gap of [GAP,EDGE,0]){
      const placed=placeGroup(preferred,fixed,working,hotspots,0,bounds,gap);
      if(placed)return arrivalResult([...fixed,...placed],false);
    }
    // Dense scenes retain the ordinary reservation, with central preferences.
    const seed=new Map(preferred.map(t=>[t.id,t]));
    tiles=tiles.map(t=>seed.get(t.id)??t);
  }
  const fresh=tiles.filter(t=>t.fresh&&!t.start&&!t.fixed),carried=tiles.filter(t=>!t.fresh&&!t.fixed);
  let reservation=reserveSupplies(fresh,fixed,carried,working,hotspots);
  if(!reservation){
    // Reserve actual pockets when a separate lower strip cannot fit. A failed
    // group retries with more space; never place its members independently.
    const preferred=fresh.map(tile=>({...tile,x:working.x+(working.width-tile.width)/2,y:bottom(working)-tile.height-EDGE}));
    const supplies=repackGroup(preferred,fixed,working,hotspots,bounds);
    if(!supplies)return;
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
    let result=placeGroup(group,placed,region,obstacles,.1,bounds);
    // The upper two-thirds are a preference, not a reason to conceal an object.
    if(!result&&region.height<upper.height)result=placeGroup(group,placed,upper,obstacles,.1,bounds);
    if(!result){
      const ordered=[...carried].sort((a,b)=>(b.fromChapter??previousChapter??-1)-(a.fromChapter??previousChapter??-1));
      const joint=repackGroup(ordered,fixed,upper,obstacles,bounds);
      if(!joint)return;
      placed.splice(fixed.length,placed.length-fixed.length,...joint);
      break;
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
  return arrivalResult(placed,false);
}

function layoutFootprints(tiles: ArrivalTile[], options: ArrivalOptions): ArrivalLayout {
  const {bounds,hotspots}=options,scene=options.scene??{width:390,height:844};
  const fixed=tiles.filter(t=>t.fixed||t.fresh&&t.start).map(t=>t.fresh&&t.start?{...t,x:t.start.x*scene.width-t.width/2,y:t.start.y*scene.height-t.height/2}:{...t});
  const movable=tiles.filter(t=>!t.fixed&&!(t.fresh&&t.start));
  // A wide item may consume the side comfort inset without covering the goals.
  const inset=movable.some(t=>t.width>bounds.width-16)?0:8;
  const working=(gap:number):Rect=>({x:bounds.x+inset,y:bounds.y+EDGE,width:Math.max(0,bounds.width-2*inset),height:Math.max(0,Math.min(bottom(bounds)-2*EDGE,options.goalsTop-gap)-bounds.y-EDGE)});
  const preferred=(region:Rect)=>{
    if(options.checkpoint)return checkpointPreferences(movable,region,bounds);
    const fresh=checkpointPreferences(movable.filter(t=>t.fresh),region,region);
    const shift=fresh.length?bottom(region)-Math.max(...fresh.map(bottom)):0;
    const supplies=new Map(fresh.map(t=>[t.id,{...t,y:t.y+shift}]));
    return movable.map(t=>supplies.get(t.id)??t);
  };
  // Give up the goal gap before the goals themselves, and retry all movable
  // objects if their separate chapter/supply reservations cannot coexist.
  for(const gap of [GAP,EDGE,0]){
    const region=working(gap),ordinary=tryArrival(tiles,options,region,fixed);
    if(ordinary)return ordinary;
    const joint=repackGroup(preferred(region),fixed,region,hotspots,bounds);
    if(joint)return arrivalResult([...fixed,...joint],false);
  }
  const goals={x:bounds.x,y:Math.max(bounds.y,options.goalsTop),width:bounds.width,height:Math.max(0,bottom(bounds)-Math.max(bounds.y,options.goalsTop))};
  const seed=preferred(working(0));
  const overGoals=repackGroup(seed,fixed,bounds,hotspots,bounds,.1,{goals});
  if(overGoals)return arrivalResult([...fixed,...overGoals],true);
  // Expose as much of each receiving area as possible before accepting greater
  // item overlap. These positions are visual only; no hotspot action is made.
  for(const threshold of [.1,.15,.25,.4,.6,1]){
    const placed=repackGroup(seed,fixed,bounds,[],bounds,threshold,{goals,softHotspots:hotspots,overflow:threshold===1});
    if(placed)return arrivalResult([...fixed,...placed],true);
  }
  // At allowance 1 and with oversized artwork admitted, every candidate fits.
  throw new Error('Arrival packing exhausted the visible board');
}

/** Pack the visible image-and-badge footprint, returning image positions.
 * Authored centres and inherited occupants retain their exact image anchors. */
export function arrivalLayout(tiles: ArrivalTile[], options: ArrivalOptions): ArrivalLayout {
  const headroom = new Map(tiles.map(tile => [tile.id, tile.headroom ?? 0]));
  const footprints = tiles.map(tile => {
    const above = headroom.get(tile.id)!;
    return {...tile, y: tile.y - above, height: tile.height + above,
      start: tile.start && {...tile.start, y: tile.start.y - above / (2 * (options.scene?.height ?? 844))}};
  });
  const layout = layoutFootprints(footprints, options);
  return {...layout, positions: new Map([...layout.positions].map(([id, position]) => [id, {...position, y: position.y + headroom.get(id)!}]))};
}
