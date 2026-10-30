export type Cell = [number,number];
export interface Part {id:string;name:string;cells:Cell[];color:string;cellColors?:string[];parts?:string[];}
export interface Piece extends Part {x:number;y:number;parts:string[];cellColors:string[];}
export interface JoineryLevel {id:string;title:string;target:Cell[];stock:Part[];}
export interface JoineryState {version:string;level:string;pieces:Piece[];known:Part[];nextId:number;joins:number;status:'playing'|'won';notice:string;}
export type Source={pieceId?:string;stockId?:string};
export type JoineryAction={type:'take';stockId:string;x:number;y:number}|{type:'move';pieceId:string;x:number;y:number}|{type:'rotate';pieceId:string}|{type:'join';source:Source;targetId:string;offset:{x:number;y:number};x:number;y:number};
export const JOINERY_VERSION='joinery-2';
const colors=['#cb8e66','#6fa7b0','#9aa966','#b395bd'];
const corner:Cell[]=[[0,0],[1,0],[0,1]],bar:Cell[]=[[0,0],[1,0]];
const stock=():Part[]=>[corner,corner,bar,bar].map((cells,i)=>({id:`part-${i+1}`,name:i<2?['Amber corner','Blue corner'][i]:['Green bar','Lilac bar'][i-2],cells:structuredClone(cells),color:colors[i]}));
export const JOINERY_LEVELS:JoineryLevel[]=[
  {id:'first-join',title:'An elbow',target:[[0,0],[0,1],[0,2],[1,2]],stock:[{id:'part-1',name:'Amber bar',cells:[[0,0],[0,1]],color:colors[0]},{id:'part-2',name:'Blue bar',cells:structuredClone(bar),color:colors[1]}]},
  {id:'the-key',title:'The key',target:[[0,0],[1,0],[0,1],[1,1],[2,1],[0,2],[1,2],[0,3],[1,3],[0,4]],stock:stock()},
  {id:'the-crossing',title:'The crossing',target:[[0,0],[1,0],[2,0],[3,0],[2,1],[1,2],[2,2],[3,2],[4,2],[3,3]],stock:stock()},
];
const key=(c:Cell)=>`${c[0]},${c[1]}`;
export function normalize(cells:Cell[]):Cell[]{
  if(!cells.length)throw new Error('A piece needs at least one square.');
  const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));
  return cells.map(([x,y])=>[x-minX,y-minY] as Cell).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
}
export function shapeKey(cells:Cell[]):string{return normalize(cells).map(key).join(';');}
export function turn(cells:Cell[]):Cell[]{return normalize(cells.map(([x,y])=>[-y,x]));}
export function orientations(cells:Cell[]):Cell[][]{const result=new Map<string,Cell[]>();let c=normalize(cells);for(let i=0;i<4;i++){result.set(shapeKey(c),c);c=turn(c);}return [...result.values()];}
export function canonical(cells:Cell[]):string{return orientations(cells).map(shapeKey).sort()[0];}
export function levelOf(s:JoineryState):JoineryLevel {const level=JOINERY_LEVELS.find(l=>l.id===s.level);if(!level)throw new Error('Unknown shape challenge.');return level;}
function unit(v:number):number{if(!Number.isFinite(v))throw new Error('A position must be finite.');return Math.max(0,Math.min(1,v));}
function normalizeColored(cells:Cell[],cellColors:string[]):{cells:Cell[];cellColors:string[]}{
  const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));
  const entries=cells.map(([x,y],i)=>({cell:[x-minX,y-minY] as Cell,color:cellColors[i]})).sort((a,b)=>a.cell[1]-b.cell[1]||a.cell[0]-b.cell[0]);
  return {cells:entries.map(e=>e.cell),cellColors:entries.map(e=>e.color)};
}
export function createJoinery(level='first-join'):JoineryState{
  const spec=JOINERY_LEVELS.find(l=>l.id===level);if(!spec)throw new Error('Unknown shape challenge.');
  const initial=spec.stock.slice(0,2).map((part,i)=>({ ...structuredClone(part),id:`piece-${i+1}`,cells:normalize(part.cells),cellColors:part.cells.map(()=>part.color),parts:[part.id],x:i?.55:.25,y:i?.45:.30}));
  return {version:JOINERY_VERSION,level,pieces:initial,known:structuredClone(spec.stock),nextId:3,joins:0,status:'playing',notice:''};
}
export function resolveSource(s:JoineryState,source:Source):Piece|Part {
  if(!!source.pieceId===!!source.stockId)throw new Error('Pick exactly one ingredient.');
  if(source.pieceId){const p=s.pieces.find(p=>p.id===source.pieceId);if(!p)throw new Error('That piece is no longer on the table.');return p;}
  const part=s.known.find(p=>p.id===source.stockId);if(!part)throw new Error('That form is not known yet.');return part;
}
export interface JoinPreview {valid:boolean;cells:Cell[];fit:boolean;offset:{x:number;y:number};cellColors?:string[];reason?:string;}
export function previewJoin(s:JoineryState,source:Source,targetId:string,offset:{x:number;y:number}):JoinPreview {
  const fallback={valid:false,cells:[] as Cell[],fit:false,offset};
  if(!Number.isInteger(offset.x)||!Number.isInteger(offset.y))return {...fallback,reason:'Line up the squares.'};
  const target=s.pieces.find(p=>p.id===targetId);if(!target)return {...fallback,reason:'Bring it to a piece on the table.'};
  let piece:Piece|Part;try{piece=resolveSource(s,source);}catch(e){return {...fallback,reason:(e as Error).message};}
  if(source.pieceId===targetId)return {...fallback,reason:'Choose two different pieces.'};
  const shifted=piece.cells.map(([x,y])=>[x+offset.x,y+offset.y] as Cell);const targetSet=new Set(target.cells.map(key));
  if(shifted.some(c=>targetSet.has(key(c))))return {...fallback,reason:'Touch edges; the squares cannot overlap.'};
  const adjacent=shifted.some(([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(c=>targetSet.has(key(c as Cell))));
  if(!adjacent)return {...fallback,reason:'Bring an edge into contact.'};
  const aColors=target.cellColors,bColors=piece.cellColors??piece.cells.map(()=>piece.color);
  const union=normalizeColored([...target.cells,...shifted],[...aColors,...bColors]);
  return {valid:true,...union,fit:canonical(union.cells)===canonical(levelOf(s).target),offset};
}
export function legalOffsets(target:Cell[],source:Cell[]):{x:number;y:number}[]{
  const candidates=new Map<string,{x:number;y:number}>();
  for(const [ax,ay]of target)for(const [bx,by]of source)for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){
    const offset={x:ax+dx-bx,y:ay+dy-by};candidates.set(`${offset.x},${offset.y}`,offset);
  }
  const occupied=new Set(target.map(key));
  return [...candidates.values()].filter(o=>!source.some(([x,y])=>occupied.has(`${x+o.x},${y+o.y}`))).sort((a,b)=>a.y-b.y||a.x-b.x);
}
export function joineryStep(s:JoineryState,a:JoineryAction):JoineryState {
  if(s.version!==JOINERY_VERSION)throw new Error('Different joining rules version.');
  const next=structuredClone(s);next.notice='';
  if(a.type==='take'){
    const part=resolveSource(s,{stockId:a.stockId});
    next.pieces.push({...structuredClone(part),id:`piece-${next.nextId++}`,x:unit(a.x),y:unit(a.y),parts:[...(part.parts??[part.id])],cells:normalize(part.cells),cellColors:[...(part.cellColors??part.cells.map(()=>part.color))]});
  }else if(a.type==='move'){
    const p=next.pieces.find(p=>p.id===a.pieceId);if(!p)throw new Error('Choose a piece on the table.');p.x=unit(a.x);p.y=unit(a.y);
  }else if(a.type==='rotate'){
    const p=next.pieces.find(p=>p.id===a.pieceId);if(!p)throw new Error('Choose a piece on the table.');
    const turned=normalizeColored(p.cells.map(([x,y])=>[-y,x]),p.cellColors);p.cells=turned.cells;p.cellColors=turned.cellColors;
  }else if(a.type==='join'){
    const result=previewJoin(s,a.source,a.targetId,a.offset);if(!result.valid)throw new Error(result.reason);
    const source=resolveSource(s,a.source),target=s.pieces.find(p=>p.id===a.targetId)!;
    const parts=[...target.parts,...(source.parts??[source.id])];
    next.pieces=next.pieces.filter(p=>p.id!==a.targetId&&p.id!==a.source.pieceId);
    next.pieces.push({id:`piece-${next.nextId++}`,name:'Joined piece',cells:result.cells,cellColors:result.cellColors!,parts,color:target.color,x:unit(a.x),y:unit(a.y)});next.joins++;
    if(!next.known.some(p=>canonical(p.cells)===canonical(result.cells))){
      const width=Math.max(...result.cells.map(c=>c[0]))+1,height=Math.max(...result.cells.map(c=>c[1]))+1;
      const name=width*height===result.cells.length?(width===height?'Square':width===1||height===1?'Long bar':'Rectangle'):`${result.cells.length}-square form`;
      next.known.push({id:`form-${canonical(result.cells)}`,name,cells:structuredClone(result.cells),cellColors:[...result.cellColors!],parts:[...parts],color:target.color});
    }
    next.notice=result.fit?'That is the shape.':'Joined. The new piece moves as one.';
    if(result.fit)next.status='won';
  }else throw new Error('Unknown joining action.');
  if(next.status!=='won'&&next.pieces.some(p=>canonical(p.cells)===canonical(levelOf(next).target))){next.status='won';next.notice='That is the shape.';}
  if(next.status!=='won'&&next.pieces.length===1&&next.pieces[0].cells.length>=levelOf(next).target.length)next.notice='This is a different shape. Bring another copy from Things, or undo a join.';
  return next;
}
/** Reversing a physical experiment never revokes an established capability. */
export function undoJoinery(current:JoineryState,previous:JoineryState):JoineryState {
  const restored=structuredClone(previous);const ids=new Set(restored.known.map(p=>p.id));
  for(const form of current.known)if(!ids.has(form.id)){restored.known.push(structuredClone(form));ids.add(form.id);}
  return restored;
}
export function joineryHash(s:JoineryState):string {let h=2166136261;const value=JSON.stringify(s);for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,'0');}
export interface JoineryCapture {schema:1;version:string;id:string;level:string;player:string;decisions:{index:number;action:JoineryAction|{type:'undo'};before:string;after:string}[];interactions:{at:number;kind:string;[key:string]:unknown}[];}
export function replayJoinery(run:JoineryCapture):JoineryState {
  if(run.schema!==1||run.version!==JOINERY_VERSION||!Array.isArray(run.decisions)||run.decisions.length>5000)throw new Error('Unsupported joining replay.');
  let s=createJoinery(run.level);const history:JoineryState[]=[];
  for(const [i,d]of run.decisions.entries()){
    if(d.index!==i||d.before!==joineryHash(s))throw new Error(`Joining replay diverged before action ${i}.`);
    if(d.action.type==='undo'){const previous=history.pop();if(!previous)throw new Error('Nothing to undo.');s=undoJoinery(s,previous);}
    else {const before=s;s=joineryStep(s,d.action);if(d.action.type!=='move')history.push(before);}
    if(d.after!==joineryHash(s))throw new Error(`Joining replay diverged after action ${i}.`);
  }return s;
}
