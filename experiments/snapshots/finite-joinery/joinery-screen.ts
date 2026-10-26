/** Unlimited-material mechanical screen. An abandoned compound is never a lost session. */
import { writeFileSync,mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { canonical,createJoinery,JOINERY_LEVELS,joineryStep,legalOffsets,normalize,orientations,previewJoin,replayJoinery } from '../src/joinery-model.ts';
import type { Cell,JoineryAction,JoineryState } from '../src/joinery-model.ts';
import { captureActions,findExtension,findWinningActions } from './joinery-solver.ts';

const cellKey=([x,y]:Cell)=>`${x},${y}`;
function locallyFits(shape:Cell[],target:Cell[]):boolean {
  const goal=normalize(target),occupied=new Set(goal.map(cellKey)),width=Math.max(...goal.map(c=>c[0]))+1,height=Math.max(...goal.map(c=>c[1]))+1;
  return orientations(shape).some(s=>{for(let x=0;x<width;x++)for(let y=0;y<height;y++)if(s.every(([a,b])=>occupied.has(`${a+x},${b+y}`)))return true;return false;});
}
function completedCapture(level:string,actions:JoineryAction[],id:string){
  const state=replayJoinery(captureActions(level,actions,`${id}-opening`)),continuation=findWinningActions(state);
  if(!continuation)throw new Error('Unlimited shelf access must still permit another construction.');
  return captureActions(level,[...actions,...continuation],id);
}
function areaCompatible(area:number,sizes:number[]):boolean {
  if(area<0)return false;const reachable=new Set([0]);for(let i=1;i<=area;i++)if(sizes.some(n=>reachable.has(i-n)))reachable.add(i);return reachable.has(area);
}
interface Opening {signature:string;actions:JoineryAction[];shape:Cell[];locallyFits:boolean;areaCompatible:boolean;extendable:boolean;}

/** All first raw joins including same-template copies; collapse rotations and symmetric offsets. */
function openings(levelId:string):Opening[]{
  const initial=createJoinery(levelId),level=JOINERY_LEVELS.find(l=>l.id===levelId)!,result=new Map<string,Opening>();
  for(let a=0;a<level.stock.length;a++)for(let b=a;b<level.stock.length;b++){
    let base=initial;const setup:JoineryAction[]=[];
    for(const index of [a,b]){const action:JoineryAction={type:'take',stockId:level.stock[index].id,x:.6,y:.6};setup.push(action);base=joineryStep(base,action);}
    const targetId=base.pieces.at(-2)!.id,sourceId=base.pieces.at(-1)!.id;
    for(let ar=0;ar<4;ar++)for(let br=0;br<4;br++){
      let state=base;const rotations:JoineryAction[]=[];
      for(const [id,count]of [[targetId,ar],[sourceId,br]]as [string,number][])for(let i=0;i<count;i++){const action:JoineryAction={type:'rotate',pieceId:id};rotations.push(action);state=joineryStep(state,action);}
      for(const offset of legalOffsets(state.pieces.find(p=>p.id===targetId)!.cells,state.pieces.find(p=>p.id===sourceId)!.cells)){
        const action:JoineryAction={type:'join',source:{pieceId:sourceId},targetId,offset,x:.4,y:.45},preview=previewJoin(state,action.source,targetId,offset);
        if(!preview.valid)throw new Error('legalOffsets disagrees with previewJoin');
        const signature=canonical(preview.cells);if(result.has(signature))continue;
        result.set(signature,{signature,actions:[...setup,...rotations,action],shape:preview.cells,locallyFits:locallyFits(preview.cells,level.target),areaCompatible:areaCompatible(level.target.length-preview.cells.length,level.stock.map(p=>p.cells.length)),extendable:!!findExtension(preview.cells,level.stock.map(p=>p.cells),level.target)});
      }
    }
  }return [...result.values()];
}

/** Only local geometric containment is consulted; future exact-cover viability is not. */
function localOptions(state:JoineryState,targetId:string):{actions:JoineryAction[];shape:Cell[];key:string}[]{
  const target=state.pieces.find(p=>p.id===targetId)!,goal=JOINERY_LEVELS.find(l=>l.id===state.level)!.target,result=new Map<string,{actions:JoineryAction[];shape:Cell[];key:string}>();
  for(const stock of state.known){
    const take:JoineryAction={type:'take',stockId:stock.id,x:.7,y:.5};let sourceState=joineryStep(state,take);const sourceId=sourceState.pieces.at(-1)!.id,rotations:JoineryAction[]=[],seen=new Set<string>();
    for(let r=0;r<4;r++){
      const source=sourceState.pieces.find(p=>p.id===sourceId)!,sourceKey=canonical(source.cells)+':'+JSON.stringify(source.cells);
      if(!seen.has(sourceKey)){seen.add(sourceKey);for(const offset of legalOffsets(target.cells,source.cells)){
        const preview=previewJoin(sourceState,{pieceId:sourceId},targetId,offset);if(!preview.valid||!locallyFits(preview.cells,goal))continue;
        const key=canonical(preview.cells);if(result.has(key))continue;
        result.set(key,{key,shape:preview.cells,actions:[take,...rotations,{type:'join',source:{pieceId:sourceId},targetId,offset,x:.4,y:.45}]});
      }}
      const rotate:JoineryAction={type:'rotate',pieceId:sourceId};rotations.push(rotate);sourceState=joineryStep(sourceState,rotate);
    }
  }return [...result.values()];
}

function localAttempt(level:string,policy:'local-greedy'|'local-area-greedy'|'local-random',seed:number){
  let state=createJoinery(level),targetId=state.pieces[0].id,randomState=seed>>>0;const actions:JoineryAction[]=[];let firstUnextendable:number|null=null;
  const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
  while(state.status!=='won'){
    const spec=JOINERY_LEVELS.find(l=>l.id===level)!;
    const options=localOptions(state,targetId).filter(o=>policy!=='local-area-greedy'||areaCompatible(spec.target.length-o.shape.length,spec.stock.map(p=>p.cells.length)));if(!options.length)break;
    const chosen=policy==='local-random'?options[Math.floor(random()*options.length)]:options.sort((a,b)=>b.shape.length-a.shape.length||a.key.localeCompare(b.key))[0];
    for(const action of chosen.actions){state=joineryStep(state,action);actions.push(action);}targetId=state.pieces.at(-1)!.id;
    if(firstUnextendable===null&&!findExtension(state.pieces.at(-1)!.cells,spec.stock.map(p=>p.cells),spec.target))firstUnextendable=state.joins;
  }
  return {policy,seed,attemptCompleted:state.status==='won',attemptStoppedReason:state.status==='won'?'target completed':'no further join fits this compound inside the target; fresh copies remain available',joins:state.joins,firstUnextendable,finalCompound:state.pieces.find(p=>p.id===targetId)!.cells,capture:captureActions(level,actions,`${level}-${policy}-${seed}`)};
}

export function screenJoinery(){
  const levels=JOINERY_LEVELS.map(level=>{
    const actions=findWinningActions(createJoinery(level.id));if(!actions)throw new Error(`No unlimited-material solution: ${level.id}`);
    const witness=captureActions(level.id,actions,`unlimited-witness-${level.id}`),branches=openings(level.id),unextendable=branches.find(o=>o.locallyFits&&o.areaCompatible&&!o.extendable)??branches.find(o=>o.locallyFits&&!o.extendable),extendable=branches.find(o=>o.extendable);
    const branchEvidence=unextendable&&extendable?{
      meaning:'Both joins are legal and locally fit the target. One compound cannot be completed using unlimited raw templates; another can. The session remains solvable in either case.',
      unextendable:{shape:unextendable.shape,signature:unextendable.signature,remainingAreaCanBeFilled:unextendable.areaCompatible,capture:captureActions(level.id,unextendable.actions,`unextendable-compound-${level.id}`)},
      extendable:{shape:extendable.shape,signature:extendable.signature,capture:captureActions(level.id,extendable.actions,`extendable-compound-${level.id}`),completion:completedCapture(level.id,extendable.actions,`extension-completion-${level.id}`)},
      continueWithFreshCopies:completedCapture(level.id,unextendable.actions,`continue-from-unextendable-${level.id}`),
      scope:'The continuation sets aside an unextendable object. It proves permanent material access, not strategic recovery from depleted stock.'
    }:null;
    return {id:level.id,target:level.target,catalogue:level.stock,reachable:replayJoinery(witness).status==='won',witness,normalizedOpeningCount:branches.length,extendableOpeningCount:branches.filter(o=>o.extendable).length,locallyFittingUnextendableCount:branches.filter(o=>o.locallyFits&&!o.extendable).length,areaFeasibleUnextendableCount:branches.filter(o=>o.locallyFits&&o.areaCompatible&&!o.extendable).length,branchEvidence,openings:branches,localGreedy:localAttempt(level.id,'local-greedy',1),localAreaGreedy:localAttempt(level.id,'local-area-greedy',1),localRandom:[1,2,3,4].map(seed=>localAttempt(level.id,'local-random',seed))};
  });
  let reversal:unknown=null;
  for(let i=0;i<levels.length&&!reversal;i++)for(let j=i+1;j<levels.length&&!reversal;j++){
    const a=levels[i],b=levels[j];if(a.catalogue.map(p=>canonical(p.cells)).sort().join('|')!==b.catalogue.map(p=>canonical(p.cells)).sort().join('|'))continue;
    const inA=a.openings.find(o=>o.extendable&&b.openings.some(p=>p.signature===o.signature&&p.locallyFits&&p.areaCompatible&&!p.extendable)),inB=b.openings.find(o=>o.extendable&&a.openings.some(p=>p.signature===o.signature&&p.locallyFits&&p.areaCompatible&&!p.extendable));
    if(inA&&inB)reversal={sameUnlimitedCatalogue:true,changedPublicContext:'Only the target silhouette changes.',a:{level:a.id,extendable:inA.signature,unextendable:inB.signature,completion:completedCapture(a.id,inA.actions,`unlimited-reversal-${a.id}`)},b:{level:b.id,extendable:inB.signature,unextendable:inA.signature,completion:completedCapture(b.id,inB.actions,`unlimited-reversal-${b.id}`)}};
  }
  const greedyCompleted=levels.filter(l=>l.localGreedy.attemptCompleted).length,areaGreedyCompleted=levels.filter(l=>l.localAreaGreedy.attemptCompleted).length;
  return {experiment:'joinery-production-2-unlimited',scope:'Actual joinery-2 engine. Every original and discovered concept is permanently copyable; no physical-material counts, costs or gameplay limits. Exact cover bounds only the mathematical target region.',normalization:'First-join geometry collapses translation, global rotation, symmetric offsets and color-equivalent duplicate templates. Reflections remain distinct. No finite remaining-stock state is used.',levels,contextReversal:reversal,localGreedySummary:{completed:greedyCompleted,areaAwareCompleted:areaGreedyCompleted,attempts:levels.length},recommendation:areaGreedyCompleted===levels.length?'Concern: local containment plus remaining-area arithmetic completes every shipped target. No deeper spatial-planning claim is justified; seek a visible counterexample or discard the challenge without adding scarcity.':'Some current-compound choices require more than local containment and remaining-area arithmetic. Retain only for a browser test of that specific spatial inference; whole-session failure is not part of the challenge.',enjoyment:'unknown',limits:['Only first-join geometry is exhaustively enumerated; complete construction sequences are not counted as human strategies.','Local policies receive full rules and containment checks; they are mechanical diagnostics, not blind players.','Each local-policy run follows one growing compound until completion or no locally fitting addition; it does not impose a gameplay action budget or a session loss.','Four seeded local-random attempts per level are a small diagnostic, not a statistical sample.','Known composites cannot add tiling feasibility beyond their constituent raw templates, but can reduce the number of joins. No join count is a gameplay cost or enjoyment score.','A leftover area that cannot be expressed using template sizes is arithmetic evidence, not spatial-planning evidence.']};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const report=screenJoinery();mkdirSync('results',{recursive:true});writeFileSync('results/joinery-screen.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({file:'results/joinery-screen.json',levels:report.levels.map(l=>({id:l.id,reachable:l.reachable,openings:l.normalizedOpeningCount,extendable:l.extendableOpeningCount,locallyFittingUnextendable:l.locallyFittingUnextendableCount,greedyCompleted:l.localGreedy.attemptCompleted})),contextReversal:!!report.contextReversal,recommendation:report.recommendation}));
}
