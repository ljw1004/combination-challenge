import test from 'node:test';
import assert from 'node:assert/strict';
import { canonical,createJoinery,JOINERY_LEVELS,JOINERY_VERSION,joineryHash,joineryStep,legalOffsets,normalize,previewJoin,replayJoinery,shapeKey } from '../src/joinery-model.ts';
import type { Cell,JoineryAction,JoineryState } from '../src/joinery-model.ts';
import { captureActions,findExtension,findTiling,findUnlimitedCompletion,findWinningActions } from '../experiments/joinery-solver.ts';
import { screenJoinery } from '../experiments/joinery-screen.ts';

const key=([x,y]:Cell)=>`${x},${y}`;
function freeze<T>(value:T):T{if(value&&typeof value==='object'){Object.freeze(value);Object.values(value).forEach(freeze);}return value;}
function connected(cells:Cell[]):boolean {
  const pending=new Set(cells.map(key)),queue=[cells[0]];pending.delete(key(cells[0]));
  for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const c of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]as Cell[])if(pending.delete(key(c)))queue.push(c);}
  return !pending.size;
}
function invariants(state:JoineryState){
  const level=JOINERY_LEVELS.find(l=>l.id===state.level)!;assert.equal('available'in state,false);
  assert.equal(new Set(state.known.map(p=>p.id)).size,state.known.length);
  for(const raw of level.stock)assert.ok(state.known.some(p=>p.id===raw.id&&canonical(p.cells)===canonical(raw.cells)));
  const colors=new Set(level.stock.map(p=>p.color));
  for(const p of state.pieces){assert.ok(connected(p.cells));assert.equal(new Set(p.cells.map(key)).size,p.cells.length);assert.equal(p.cellColors.length,p.cells.length);assert.deepEqual(p.cells,normalize(p.cells));assert.ok(p.cellColors.every(c=>colors.has(c)));}
}
function checkedStep(state:JoineryState,action:JoineryAction){
  const before=state.pieces.reduce((n,p)=>n+p.cells.length,0),next=joineryStep(state,action),after=next.pieces.reduce((n,p)=>n+p.cells.length,0);
  const added=action.type==='take'?state.known.find(p=>p.id===action.stockId)!.cells.length:action.type==='join'&&action.source.stockId?state.known.find(p=>p.id===action.source.stockId)!.cells.length:0;
  assert.equal(after,before+added);for(const p of state.known)assert.deepEqual(next.known.find(q=>q.id===p.id),p);invariants(next);return next;
}
function solved(level='the-key'){
  let state=createJoinery(level);const actions=findWinningActions(state);assert.ok(actions);
  for(const a of actions)state=checkedStep(state,a);assert.equal(state.status,'won');return {state,actions};
}

test('every shipped target is reachable using actual actions with permanently available materials',()=>{
  for(const level of JOINERY_LEVELS){const {state,actions}=solved(level.id);assert.ok(state.pieces.some(p=>canonical(p.cells)===canonical(level.target)));assert.deepEqual(replayJoinery(captureActions(level.id,actions,`unlimited-test-${level.id}`)),state);}
});

test('unlimited completion repeats one template as needed and preserves anchor geometry',()=>{
  const bar:Cell[]=[[0,0],[1,0]],target:Cell[]=[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]];
  assert.equal(findTiling([bar],target),null);const repeated=findUnlimitedCompletion([bar],target);assert.ok(repeated);assert.equal(repeated.additions.length,3);assert.ok(repeated.additions.every(p=>p.index===0));
  const extension=findExtension(bar,[bar],target);assert.ok(extension?.anchor);assert.equal(extension.additions.length,2);
  const compound:Cell[]=[[0,0],[1,0],[0,1]],shapeBefore=structuredClone(compound);assert.equal(findExtension(compound,[bar],target),null);assert.deepEqual(compound,shapeBefore);
});

test('exact-cover helpers respect holes, exact area, rigid rotations and chirality',()=>{
  const corner:Cell[]=[[0,0],[0,1],[0,2],[1,2]],mirror:Cell[]=[[1,0],[1,1],[1,2],[0,2]];
  assert.equal(findTiling([corner],mirror),null);assert.equal(findUnlimitedCompletion([corner],mirror),null);assert.ok(findTiling([corner],[[0,0],[1,0],[2,0],[0,1]]));
  assert.equal(findTiling([[[0,0],[1,0]]],[[0,0],[2,0]]),null);assert.equal(findUnlimitedCompletion([[[0,0],[1,0]]],[[0,0],[2,0]]),null);
  assert.equal(findTiling([[[0,0],[0,0]]],[[0,0],[1,0]]),null);assert.equal(findTiling([[[.5,0]]],[[0,0]]),null);assert.deepEqual(findTiling([],[]),[]);
  for(const level of JOINERY_LEVELS){const input=structuredClone(level.stock.map(p=>p.cells)),before=structuredClone(input),tiling=findTiling(input,level.target);assert.ok(tiling);assert.deepEqual(input,before);const cells=tiling.flatMap(p=>p.cells.map(([x,y])=>[x+p.x,y+p.y]as Cell));assert.equal(new Set(cells.map(key)).size,cells.length);assert.equal(shapeKey(cells),shapeKey(level.target));}
});

test('legalOffsets covers all integer nonoverlapping edge contacts and previews match per-cell colors',()=>{
  for(const level of JOINERY_LEVELS)for(let ar=0;ar<4;ar++)for(let br=0;br<4;br++){
    let s=createJoinery(level.id);for(let i=0;i<ar;i++)s=joineryStep(s,{type:'rotate',pieceId:'piece-1'});for(let i=0;i<br;i++)s=joineryStep(s,{type:'rotate',pieceId:'piece-2'});
    const a=s.pieces[0],b=s.pieces[1],legal=new Set(legalOffsets(a.cells,b.cells).map(o=>`${o.x},${o.y}`));
    const aw=Math.max(...a.cells.map(c=>c[0]))+1,ah=Math.max(...a.cells.map(c=>c[1]))+1,bw=Math.max(...b.cells.map(c=>c[0]))+1,bh=Math.max(...b.cells.map(c=>c[1]))+1;
    for(let x=-bw-1;x<=aw+1;x++)for(let y=-bh-1;y<=ah+1;y++){
      const moved=b.cells.map(([a,b])=>[a+x,b+y]as Cell),occupied=new Set(a.cells.map(key)),overlap=moved.some(c=>occupied.has(key(c))),touch=moved.some(([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(c=>occupied.has(key(c as Cell))));
      const preview=previewJoin(s,{pieceId:b.id},a.id,{x,y}),valid=!overlap&&touch;assert.equal(preview.valid,valid);assert.equal(legal.has(`${x},${y}`),valid);
      if(valid){
        const next=checkedStep(s,{type:'join',source:{pieceId:b.id},targetId:a.id,offset:{x,y},x:.5,y:.5}),piece=next.pieces.at(-1)!;assert.deepEqual(piece.cells,preview.cells);assert.deepEqual(piece.cellColors,preview.cellColors);
        const union=[...a.cells,...moved],minX=Math.min(...union.map(c=>c[0])),minY=Math.min(...union.map(c=>c[1])),colors=[...a.cellColors,...b.cellColors];
        union.forEach(([x,y],i)=>assert.equal(piece.cellColors[piece.cells.findIndex(([u,v])=>u===x-minX&&v===y-minY)],colors[i]));
      }
    }
  }
});

test('shelf materials and newly joined concepts can be copied repeatedly without spending or shape-size caps',()=>{
  let state=createJoinery('the-key');for(let i=0;i<12;i++)state=checkedStep(state,{type:'take',stockId:'part-3',x:.5,y:.5});assert.equal(state.pieces.length,14);
  const offset=legalOffsets(state.pieces[0].cells,state.pieces[1].cells)[0];state=checkedStep(state,{type:'join',source:{pieceId:'piece-2'},targetId:'piece-1',offset,x:.5,y:.5});
  const compound=state.pieces.at(-1)!,known=state.known.find(p=>canonical(p.cells)===canonical(compound.cells));assert.ok(known);
  const isolatedCopy=joineryStep(state,{type:'take',stockId:known.id,x:.5,y:.5});isolatedCopy.pieces.at(-1)!.cellColors[0]='changed';isolatedCopy.pieces.at(-1)!.parts[0]='changed';assert.equal(state.pieces.at(-1)!.cellColors[0],compound.cellColors[0]);assert.notEqual(state.known.find(p=>p.id===known.id)!.cellColors?.[0],'changed');assert.notEqual(state.known.find(p=>p.id===known.id)!.parts?.[0],'changed');
  for(let i=0;i<3;i++){state=checkedStep(state,{type:'take',stockId:known.id,x:.5,y:.5});assert.deepEqual(state.pieces.at(-1)!.cells,known.cells);assert.deepEqual(state.pieces.at(-1)!.cellColors,compound.cellColors);}
  let targetId=compound.id;
  for(let i=0;i<6;i++){
    const target=state.pieces.find(p=>p.id===targetId)!,source=state.known.find(p=>p.id==='part-3')!,offset=legalOffsets(target.cells,source.cells).sort((a,b)=>Math.max(...previewJoin(state,{stockId:source.id},targetId,b).cells.map(c=>c[0]))-Math.max(...previewJoin(state,{stockId:source.id},targetId,a).cells.map(c=>c[0])))[0];
    state=checkedStep(state,{type:'join',source:{stockId:source.id},targetId,offset,x:.5,y:.5});targetId=state.pieces.at(-1)!.id;
  }assert.ok(Math.max(...state.pieces.at(-1)!.cells.map(c=>c[0]))>=10);
});

test('transitions preserve immutable input and reject overlap, fractional offsets and invalid physical sources',()=>{
  const state=freeze(createJoinery('the-key')),before=joineryHash(state),offset=legalOffsets(state.pieces[0].cells,state.pieces[1].cells)[0];joineryStep(state,{type:'join',source:{pieceId:'piece-2'},targetId:'piece-1',offset,x:.4,y:.5});
  for(const [source,targetId,offset]of [[{pieceId:'piece-2'},'piece-1',{x:0,y:0}],[{pieceId:'piece-2'},'piece-1',{x:.5,y:1}],[{pieceId:'piece-2'},'piece-1',{x:100,y:100}],[{pieceId:'piece-1'},'piece-1',{x:2,y:0}],[{pieceId:'piece-2',stockId:'part-3'},'piece-1',{x:2,y:0}]]as const){assert.equal(previewJoin(state,source,targetId,offset).valid,false);assert.throws(()=>joineryStep(state,{type:'join',source,targetId,offset,x:.5,y:.5}));}
  assert.equal(joineryHash(state),before);assert.throws(()=>joineryStep(state,{type:'move',pieceId:'piece-1',x:NaN,y:.5}),/finite/);assert.throws(()=>joineryStep({...state,version:'old'},{type:'rotate',pieceId:'piece-1'}),/version/);
});

test('a compound rotates each colored cell and all constituents together, with period four',()=>{
  let state=createJoinery('the-key');const offset=legalOffsets(state.pieces[0].cells,state.pieces[1].cells)[0];state=joineryStep(state,{type:'join',source:{pieceId:'piece-2'},targetId:'piece-1',offset,x:.3,y:.4});const before=structuredClone(state.pieces[0]);
  for(let i=0;i<4;i++){
    const old=state.pieces[0],rotated=old.cells.map(([x,y],j)=>({x:-y,y:x,color:old.cellColors[j]})),minX=Math.min(...rotated.map(c=>c.x)),minY=Math.min(...rotated.map(c=>c.y));
    state=checkedStep(state,{type:'rotate',pieceId:old.id});const next=state.pieces[0];assert.deepEqual(next.parts,before.parts);
    for(const c of rotated)assert.equal(next.cellColors[next.cells.findIndex(([x,y])=>x===c.x-minX&&y===c.y-minY)],c.color);
  }assert.deepEqual(state.pieces[0],before);
});

test('winning matches the silhouette exactly up to rotation and leaves all further handling available',()=>{
  let state=joineryStep(createJoinery(),{type:'rotate',pieceId:'piece-2'});const straight=previewJoin(state,{pieceId:'piece-2'},'piece-1',{x:0,y:2});assert.equal(straight.valid,true);assert.equal(straight.fit,false);
  const {state:won}=solved('first-join');state=checkedStep(won,{type:'move',pieceId:won.pieces.find(p=>canonical(p.cells)===canonical(JOINERY_LEVELS[0].target))!.id,x:.9,y:.8});state=checkedStep(state,{type:'rotate',pieceId:state.pieces.at(-1)!.id});assert.equal(state.status,'won');
  state=checkedStep(state,{type:'take',stockId:'part-1',x:.5,y:.5});const target=state.pieces.at(-1)!,off=legalOffsets(target.cells,state.known.find(p=>p.id==='part-1')!.cells)[0];state=checkedStep(state,{type:'join',source:{stockId:'part-1'},targetId:target.id,offset:off,x:.5,y:.5});assert.equal(state.status,'won');
});

test('capture hashes replay movement, rotation, joins and Undo while rejecting tampering',()=>{
  const initial=createJoinery('the-key'),offset=legalOffsets(initial.pieces[0].cells,initial.pieces[1].cells)[0],actions:(JoineryAction|{type:'undo'})[]=[{type:'move',pieceId:'piece-1',x:.2,y:.7},{type:'join',source:{pieceId:'piece-2'},targetId:'piece-1',offset,x:.4,y:.4},{type:'rotate',pieceId:'piece-3'},{type:'undo'},{type:'undo'}];
  const capture=captureActions('the-key',actions,'test-unlimited-undo'),replayed=replayJoinery(capture);assert.equal(replayed.pieces.length,2);assert.equal(replayed.pieces[0].x,.2);assert.equal(replayed.joins,0);
  assert.ok(replayed.known.some(p=>p.cells.length===6));const restoredCopy=joineryStep(replayed,{type:'take',stockId:replayed.known.find(p=>p.cells.length===6)!.id,x:.5,y:.5});assert.equal(restoredCopy.pieces.at(-1)!.cells.length,6);
  for(const change of [(c:typeof capture)=>{c.version='old';},(c:typeof capture)=>{c.decisions[0].before='forged';},(c:typeof capture)=>{c.decisions[0].after='forged';},(c:typeof capture)=>{c.decisions[0].index=2;},(c:typeof capture)=>{c.decisions[0].action={type:'rotate',pieceId:'piece-1'};}]){const bad=structuredClone(capture);change(bad);assert.throws(()=>replayJoinery(bad));}assert.equal(capture.version,JOINERY_VERSION);
});

test('unextendable compounds never become session dead states under permanent material access',()=>{
  const report=screenJoinery();assert.equal(report.levels.filter(l=>l.reachable).length,3);assert.equal(report.levels.filter(l=>l.branchEvidence).length,2);assert.ok(report.contextReversal);
  for(const level of report.levels)if(level.branchEvidence){
    const e=level.branchEvidence,unextendable=replayJoinery(e.unextendable.capture);assert.equal(findExtension(unextendable.pieces.at(-1)!.cells,level.catalogue.map(p=>p.cells),level.target),null);assert.ok(findWinningActions(unextendable));assert.equal(replayJoinery(e.continueWithFreshCopies).status,'won');assert.equal(replayJoinery(e.extendable.completion).status,'won');
  }
  assert.equal(report.localGreedySummary.attempts,report.levels.length);
});
