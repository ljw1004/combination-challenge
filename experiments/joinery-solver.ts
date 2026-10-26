/** Exact mechanical diagnostics. These helpers are not a blind player or fun grader. */
import { createJoinery, joineryHash, joineryStep, levelOf, normalize, replayJoinery, shapeKey, turn, undoJoinery, JOINERY_VERSION } from '../src/joinery-model.ts';
import type { Cell, JoineryAction, JoineryCapture, JoineryState } from '../src/joinery-model.ts';

export interface TilingPlacement { index:number;turns:number;cells:Cell[];x:number;y:number; }
const pointKey=([x,y]:Cell)=>`${x},${y}`;
const shift=(cells:Cell[],x:number,y:number):Cell[]=>cells.map(([a,b])=>[a+x,b+y]);

/** Place every rigid shape exactly once, rotating but never reflecting it. */
export function findTiling(shapes:Cell[][],target:Cell[]):TilingPlacement[]|null {
  if(!target.length)return shapes.length===0?[]:null;
  if(shapes.some(s=>!s.length)||shapes.reduce((n,s)=>n+s.length,0)!==target.length)return null;
  if([...shapes,target].some(s=>s.some(c=>c.length!==2||c.some(v=>!Number.isInteger(v)))||new Set(s.map(pointKey)).size!==s.length))return null;
  const goal=normalize(target),indices=new Map(goal.map((c,i)=>[pointKey(c),i]));
  const width=Math.max(...goal.map(c=>c[0]))+1,height=Math.max(...goal.map(c=>c[1]))+1;
  const options=shapes.map((shape,index)=>{
    const result:{placement:TilingPlacement;mask:bigint}[]=[],seen=new Set<string>();let cells=normalize(shape);
    for(let turns=0;turns<4;turns++,cells=turn(cells)){
      const signature=shapeKey(cells);if(seen.has(signature))continue;seen.add(signature);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const moved=shift(cells,x,y),bits=moved.map(c=>indices.get(pointKey(c)));if(bits.some(i=>i===undefined))continue;
        result.push({placement:{index,turns,cells:structuredClone(cells),x,y},mask:bits.reduce<bigint>((m,i)=>m|(1n<<BigInt(i!)),0n)});
      }
    }return result;
  });
  if(options.some(o=>!o.length))return null;
  const answer:TilingPlacement[]=new Array(shapes.length),failed=new Set<string>(),all=(1n<<BigInt(goal.length))-1n;
  function visit(usedShapes:bigint,covered:bigint):boolean {
    if(covered===all)return true;
    const stateKey=`${usedShapes}/${covered}`;if(failed.has(stateKey))return false;
    // Cover the most constrained uncovered square; identical stock permutations
    // remain harmless but do not receive any interpretation as alternative play.
    let choices:{index:number;placement:TilingPlacement;mask:bigint}[]|undefined;
    for(let cell=0;cell<goal.length;cell++)if(!(covered&(1n<<BigInt(cell)))){
      const fitting=options.flatMap((opts,index)=>(usedShapes&(1n<<BigInt(index)))?[]:opts.filter(o=>!(o.mask&covered)&&!!(o.mask&(1n<<BigInt(cell)))).map(o=>({index,...o})));
      if(!fitting.length){failed.add(stateKey);return false;}if(!choices||fitting.length<choices.length)choices=fitting;
    }
    for(const {index,placement,mask}of choices!){answer[index]=placement;if(visit(usedShapes|(1n<<BigInt(index)),covered|mask))return true;}
    failed.add(stateKey);return false;
  }
  return visit(0n,0n)?answer:null;
}

/** A witness consisting solely of actual engine actions from the supplied state. */
interface MaskedPlacement {placement:TilingPlacement;mask:bigint;}
export interface UnlimitedCompletion {anchor?:TilingPlacement;additions:TilingPlacement[];}
function allPlacements(shape:Cell[],target:Cell[],index:number):MaskedPlacement[]{
  if(!shape.length||shape.some(c=>c.some(v=>!Number.isInteger(v)))||new Set(shape.map(pointKey)).size!==shape.length)return [];
  const indices=new Map(target.map((c,i)=>[pointKey(c),i])),width=Math.max(...target.map(c=>c[0]))+1,height=Math.max(...target.map(c=>c[1]))+1,result:MaskedPlacement[]=[],seen=new Set<string>();let cells=normalize(shape);
  for(let turns=0;turns<4;turns++,cells=turn(cells)){
    const signature=shapeKey(cells);if(seen.has(signature))continue;seen.add(signature);
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const bits=shift(cells,x,y).map(c=>indices.get(pointKey(c)));if(bits.some(i=>i===undefined))continue;
      result.push({placement:{index,turns,cells:structuredClone(cells),x,y},mask:bits.reduce<bigint>((m,i)=>m|(1n<<BigInt(i!)),0n)});
    }
  }return result;
}

/** Repeated templates are unlimited; the finite target area bounds exact-cover search only. */
export function findUnlimitedCompletion(templates:Cell[][],target:Cell[],anchor?:Cell[]):UnlimitedCompletion|null {
  if(!target.length||target.some(c=>c.some(v=>!Number.isInteger(v)))||new Set(target.map(pointKey)).size!==target.length)return null;
  const goal=normalize(target),all=(1n<<BigInt(goal.length))-1n,seenMasks=new Set<bigint>();
  const options=templates.flatMap((shape,index)=>allPlacements(shape,goal,index)).filter(o=>{if(seenMasks.has(o.mask))return false;seenMasks.add(o.mask);return true;});
  const perCell=goal.map((_,i)=>options.filter(o=>!!(o.mask&(1n<<BigInt(i))))),failed=new Set<bigint>();
  function cover(covered:bigint):TilingPlacement[]|null {
    if(covered===all)return [];if(failed.has(covered))return null;
    let choices:MaskedPlacement[]|undefined;
    for(let i=0;i<goal.length;i++)if(!(covered&(1n<<BigInt(i)))){const fitting=perCell[i].filter(o=>!(o.mask&covered));if(!fitting.length){failed.add(covered);return null;}if(!choices||fitting.length<choices.length)choices=fitting;}
    for(const option of choices!){const rest=cover(covered|option.mask);if(rest)return [option.placement,...rest];}
    failed.add(covered);return null;
  }
  if(anchor){for(const option of allPlacements(anchor,goal,-1)){const additions=cover(option.mask);if(additions)return {anchor:option.placement,additions};}return null;}
  const additions=cover(0n);return additions?{additions}:null;
}

export function findExtension(anchor:Cell[],templates:Cell[][],target:Cell[]):UnlimitedCompletion|null{return findUnlimitedCompletion(templates,target,anchor);}

/** Solve using unlimited shelf copies. An unextendable object may be left aside. */
export function findWinningActions(initial:JoineryState):JoineryAction[]|null {
  if(initial.status==='won')return [];
  let state=structuredClone(initial);const actions:JoineryAction[]=[],level=levelOf(initial),catalogue=initial.known;
  const apply=(a:JoineryAction)=>{state=joineryStep(state,a);actions.push(a);};
  let solution:UnlimitedCompletion|null=null,accumulator='';
  for(const piece of [...state.pieces].sort((a,b)=>b.cells.length-a.cells.length)){const extension=findExtension(piece.cells,catalogue.map(p=>p.cells),level.target);if(extension){solution=extension;accumulator=piece.id;break;}}
  if(!solution){solution=findUnlimitedCompletion(catalogue.map(p=>p.cells),level.target);if(!solution)return null;const first=solution.additions.shift()!;apply({type:'take',stockId:catalogue[first.index].id,x:.35,y:.45});accumulator=state.pieces.at(-1)!.id;solution.anchor=first;}
  const anchor=solution.anchor!;for(let i=0;i<anchor.turns;i++)apply({type:'rotate',pieceId:accumulator});
  let minX=anchor.x,minY=anchor.y;const covered=shift(anchor.cells,minX,minY),pending=[...solution.additions];
  while(pending.length){
    const occupied=new Set(covered.map(pointKey)),index=pending.findIndex(p=>shift(p.cells,p.x,p.y).some(([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(c=>occupied.has(pointKey(c as Cell)))));
    if(index<0)return null;const p=pending.splice(index,1)[0];apply({type:'take',stockId:catalogue[p.index].id,x:.7,y:.5});const sourceId=state.pieces.at(-1)!.id;
    for(let i=0;i<p.turns;i++)apply({type:'rotate',pieceId:sourceId});
    apply({type:'join',source:{pieceId:sourceId},targetId:accumulator,offset:{x:p.x-minX,y:p.y-minY},x:.4,y:.45});
    accumulator=state.pieces.at(-1)!.id;covered.push(...shift(p.cells,p.x,p.y));minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);
  }return state.status==='won'?actions:null;
}

/** Exact replay capture; move actions deliberately do not add an Undo checkpoint. */
export function captureActions(level:string,actions:(JoineryAction|{type:'undo'})[],id:string):JoineryCapture {
  let state=createJoinery(level);const history:JoineryState[]=[];
  const capture:JoineryCapture={schema:1,version:JOINERY_VERSION,id,level,player:'privileged mechanical witness',decisions:[],interactions:[]};
  for(const action of actions){
    const before=joineryHash(state);
    if(action.type==='undo'){const previous=history.pop();if(!previous)throw new Error('Nothing to undo.');state=undoJoinery(state,previous);}
    else {const previous=state;state=joineryStep(state,action);if(action.type!=='move')history.push(previous);}
    capture.decisions.push({index:capture.decisions.length,action:structuredClone(action),before,after:joineryHash(state)});
  }
  replayJoinery(capture);return capture;
}
