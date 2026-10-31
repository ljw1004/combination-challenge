// RECOVERY NOTICE: context-reconstructed historical verifier, not executed in this recovery.
// Original raw captures/full freeze inputs are missing. No original script hash retained.
// Syntax checking this file is NOT replay verification. See ../../RECOVERY.md.
/** Reviewer-only exact replay of the two frozen public-player captures.
 * Run from repository root: node results/mars-objects-play-review/verify.mjs
 * Does not execute the CLI or alter sources/captures/tests/evaluator.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createMarsObjects,observeMarsObjects,stepMarsObjects,previewMarsObjects,marsObjectsWorld,MARS_OBJECTS_RECIPES,replayMarsObjects} from '../../experiments/logical-mars-objects.ts';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const fileHash=p=>sha(readFileSync(p));
const stateHash=s=>sha(JSON.stringify(s));
const frozen=read('results/mars-objects-preplay/freeze.json');
const files=Object.entries(frozen.hashes).map(([path,sha256])=>{assert.equal(fileHash(path),sha256);return {path,sha256,unchanged:true};});
const captures=['fun-mars-ordinary-1','fun-mars-complete-1'];
const historical=['experiments/fun-evaluator.ts','experiments/logical-games.ts','results/fun-evaluation.json'];
const protectedPaths=[...files.map(f=>f.path),...captures.map(id=>`results/mars-objects-players/${id}.json`),...historical];
const beforeHashes=Object.fromEntries(protectedPaths.map(p=>[p,fileHash(p)]));
const sessions=[];
for(const id of captures){
 const path=`results/mars-objects-players/${id}.json`,r=read(path);
 assert.equal(r.id,id);assert.equal(r.protocol,'mars-objects-cli-1');assert.equal(r.modelSha256,frozen.hashes['experiments/logical-mars-objects.ts']);
 assert.ok(Date.parse(r.startedAt)>Date.parse(frozen.frozenAt));
 let state=createMarsObjects('garden',{catalogue:r.catalogue}),finished=false,lastAt=Date.parse(r.startedAt);const boards=[],actions=[],checkpoints=[],previews=[],reports=[],eventChecks=[];
 let boardStart=structuredClone(state),boardActions=[],firstWin=null,transition=null;
 const endBoard=()=>{
  const exact=replayMarsObjects(boardActions,state.scenarioId,boardStart.catalogue==='carryover'?{known:boardStart.known}:{catalogue:boardStart.catalogue});assert.deepEqual(exact,state);
  boards.push({scenario:state.scenarioId,knownOnEntry:boardStart.known,knownAtEnd:state.known,combines:state.combines,actions:boardActions,firstWin,finalStateHash:stateHash(state),status:state.status,installations:state.installations,world:marsObjectsWorld(state),exactSeparateBoardReplay:true});
 };
 for(const [i,e]of r.events.entries()){
  assert.ok(Date.parse(e.at)>=lastAt);lastAt=Date.parse(e.at);assert.equal(finished,false);
  if(e.type==='init'){
   assert.equal(i,0);assert.deepEqual(e.state,state);assert.deepEqual(e.observation,observeMarsObjects(state));
  }else if(e.type==='act'){
   assert.deepEqual(e.before,state);assert.equal(e.beforeHash,stateHash(state));const prior=structuredClone(state),a=e.action,next=stepMarsObjects(state,a);assert.deepEqual(state,prior);assert.equal(next.accepted,true);
   assert.equal(e.afterHash,stateHash(next));assert.deepEqual(e.after,next);assert.deepEqual(e.observation,observeMarsObjects(next));
   const recipe=MARS_OBJECTS_RECIPES.find(x=>[x.a,x.b].sort().join('|')===[a.a,a.b].sort().join('|'));
   assert.ok(prior.known.every(c=>next.known.includes(c)));if(recipe)assert.deepEqual(prior.installations,next.installations);
   const kind=recipe?'blueprint-synthesis':'known-whole-object-placement';assert.ok(recipe||a.a==='world:camp'||a.b==='world:camp');
   actions.push({eventIndex:i,at:e.at,scenario:state.scenarioId,action:a,kind,newConcepts:next.known.filter(x=>!prior.known.includes(x)),beforeHash:e.beforeHash,afterHash:e.afterHash,world:marsObjectsWorld(next)});boardActions.push(a);state=next;
   if(state.status==='won'&&!firstWin)firstWin={eventIndex:i,boardCombine:state.combines};
  }else if(e.type==='next'){
   assert.equal(state.scenarioId,'garden');assert.equal(state.status,'won');assert.deepEqual(e.before,state);endBoard();
   const prior=structuredClone(state);state=createMarsObjects('signal',{known:[...prior.known]});assert.deepEqual(e.after,state);assert.deepEqual(e.observation,observeMarsObjects(state));assert.deepEqual(state.known,prior.known);assert.deepEqual(state.installations,[]);assert.equal(state.observer.campLocated,false);assert.equal(state.combines,0);assert.equal(state.status,'playing');
   transition={eventIndex:i,from:'garden',to:'signal',priorGoalWon:true,known:state.known,onlyKnowledgeCarried:true,installationsReset:true,observerReset:true,combineCounterReset:true};boardStart=structuredClone(state);boardActions=[];firstWin=null;
  }else if(e.type==='checkpoint'||e.type==='report'){
   assert.equal(e.stateHash,stateHash(state));const row={eventIndex:i,at:e.at,scenario:state.scenarioId,combines:state.combines,status:state.status,report:e.report,stateHash:e.stateHash};
   if(e.type==='checkpoint')checkpoints.push(row);else reports.push(row);
  }else if(e.type==='preview'){
   assert.equal(e.stateHash,stateHash(state));assert.deepEqual(e.result,previewMarsObjects(state,e.action));previews.push({eventIndex:i,action:e.action});
  }else if(e.type==='finish'){
   assert.equal(i,r.events.length-1);assert.equal(state.status,'won');assert.equal(e.stateHash,stateHash(state));assert.deepEqual(e.observation,observeMarsObjects(state));finished=true;
  }else assert.fail(`Unexpected event ${e.type}`);
  eventChecks.push({eventIndex:i,type:e.type,exact:true});
 }
 assert.equal(finished,true);assert.equal(r.finished,true);assert.deepEqual(r.state,state);endBoard();assert.equal(boards.length,2);
 const garden=boards[0],signal=boards[1];
 assert.equal(garden.world.camp.enclosed,true);assert.equal(garden.world.camp.illuminated,true);assert.equal(garden.world.camp.boundaryTransmits,true);assert.deepEqual(garden.world.camp.interiorSources,['sun']);assert.equal(garden.world.observer.receiving,false);assert.equal(garden.world.observer.campLocated,false);
 assert.equal(signal.world.camp.enclosed,true);assert.equal(signal.world.camp.illuminated,false);assert.equal(signal.world.camp.boundaryTransmits,false);assert.deepEqual(signal.world.camp.interiorSources,[]);assert.equal(signal.world.observer.receiving,true);assert.equal(signal.world.observer.campLocated,true);assert.equal(signal.world.observer.firstReception.combine,signal.firstWin.boardCombine);
 for(const b of boards){assert.equal(b.installations.length,1);assert.deepEqual(b.world.power,[]);assert.equal(b.status,'won');}
 const predictions=checkpoints.filter(c=>c.report.expectedEffect).map(c=>{
  const nextAct=actions.find(a=>a.eventIndex>c.eventIndex),board=boards.find(b=>b.scenario===c.scenario);assert.ok(nextAct&&nextAct.scenario===c.scenario);assert.ok(Date.parse(c.at)<Date.parse(nextAct.at));
  assert.equal(c.combines,0);assert.equal(c.status,'playing');return {...c,recordedBeforeFirstBoardAction:true,sourcePath:`events[${c.eventIndex}].report`,review:'Prediction concerns the installed result, not blueprint acquisition alone. Its enclosure/transmission or reflection/dark-interior consequences match the actual completed board.',actualWorld:board.world};
 });
 assert.equal(predictions.length,2);
 sessions.push({id,path,sha256:beforeHashes[path],catalogue:r.catalogue,protocol:r.protocol,startedAfterFreeze:true,counts:{combines:actions.length,blueprintSynthesis:actions.filter(a=>a.kind==='blueprint-synthesis').length,knownWholeObjectPlacements:actions.filter(a=>a.kind==='known-whole-object-placement').length,next:1,finish:1,checkpoints:checkpoints.length,reports:reports.length,explicitPreviewCalls:previews.length,capturedInvalidActions:0,totalRecordedEvents:r.events.length},initialKnown:boards[0].knownOnEntry,finalKnown:state.known,allEventsReplayExactly:true,eventChecks,actions,boards,transition,predictions,checkpoints,reports,finish:{finished:true,worldStatus:'won',stateUnchanged:true},limits:['Public observations already include every legal exact preview; zero explicit preview calls does not imply unexposed predictions.','Known clear-shell carries to signal but is never used there; no acquired composite or physical installation is reused across these two constructions.','No repairs, source cuts, same-object repurposing, powered-lamp construction, or elective continuation is observed.','Finish is adapter session closure; model status remains won, not ended.']});
}
for(const p of protectedPaths)assert.equal(fileHash(p),beforeHashes[p]);
const ledger={version:'mars-objects-play-verification-1',protocol:'docs/mars-objects-play-protocol.md',model:'mars-objects-1',method:'Direct module replay of every init/action/next/checkpoint/report/finish event; exact before/after states, hashes and full public observations; independent per-board action replay; source/protocol/adapter freeze checks; prospective prediction ordering and concrete consequence assertions. No source/capture edits.',frozenAt:frozen.frozenAt,freezeFiles:files,sessions,excludedSmokeCapture:'results/mars-objects-players/reviewer-mars-cli-smoke-1.json',smokeIsBlindPlay:false,genericEvaluator:{applied:false,reason:'Standalone adapter evidence; historical registry and evaluator remain frozen.',unchangedFiles:historical.map(path=>({path,sha256:beforeHashes[path]}))},sourcesCapturesTestsAndHistoricalEvaluationUnchanged:true,script:'results/mars-objects-play-review/verify.mjs'};
writeFileSync('results/mars-objects-play-verification.json',JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({sessions:sessions.map(s=>({id:s.id,counts:s.counts,goals:s.boards.map(b=>({scenario:b.scenario,status:b.status,combines:b.combines})),exact:s.allEventsReplayExactly})),freezeFiles:files.length,allProtectedFilesUnchanged:true},null,2));
