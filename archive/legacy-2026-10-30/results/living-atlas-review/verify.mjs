// RECOVERY NOTICE: context-reconstructed historical verifier, not executed in this recovery.
// Original raw captures/full freeze inputs are missing. No original script hash retained.
// Syntax checking this file is NOT replay verification. See ../../RECOVERY.md.
/** Reviewer-only reconstruction. Does not modify frozen source or player captures.
 * Run from repository root: node results/living-atlas-review/verify.mjs
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {replayLogical} from '../../experiments/logical-games.ts';
import {LIVING_RECIPES,livingPhysicalKey,livingGoal,stepLiving} from '../../experiments/logical-living-works.ts';
import {living2Goal,stepLiving2} from '../../experiments/logical-living-works-2.ts';
import {living3Goal,stepLiving3} from '../../experiments/logical-living-works-3.ts';
import {createLivingAtlas,stepLivingAtlas,observeLivingAtlas,livingAtlasBase,livingAtlasGoal,livingAtlasOutcome,LIVING_ATLAS_LEVELS,livingAtlasRules} from '../../experiments/logical-living-atlas.ts';
const sha=x=>createHash('sha256').update(x).digest('hex');
const fileHash=p=>sha(readFileSync(p));
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const ids=['fun-atlas-assigned-1','fun-atlas-choice-1'];
const paths=['experiments/logical-living-works.ts','experiments/logical-living-works-2.ts','experiments/logical-living-works-3.ts','experiments/logical-living-atlas.ts','experiments/logical-play.ts','experiments/logical-games.ts','experiments/fun-evaluator.ts','experiments/fun-evaluate.ts',...ids.map(id=>`results/logical-players/${id}.json`)];
const beforeHashes=Object.fromEntries(paths.map(p=>[p,fileHash(p)]));
const preplayFreeze=readFileSync('results/atlas-preplay/frozen-sha256.txt','utf8').trim().split('\n').map(line=>{const [sha256,path]=line.split(/\s+/);assert.equal(fileHash(path),sha256);return {path,sha256,unchanged:true};});
const frozen=['8647032f9697c901b11302223cc327a370596be3fc6695ec7b74d84bbd83d6d2','a3da674164943462dd01431fba6655a632afe43dbe66343978a2db4a0a6f4696','7b8d1a520e90c95e940d2a714a260c1c802103687e3e8c1a98ce2b32905127c6','8af85e4d84e79a223939b37e2bdada54fa629da2cf864389b75211890f79a5b4'];
frozen.forEach((h,i)=>assert.equal(beforeHashes[paths[i]],h));
const base=w=>w.kind==='base'?w.state:w.state.base;
const goal=w=>w.kind==='base'?livingGoal(w.state):w.kind==='slow'?living2Goal(w.state):living3Goal(w.state);
const innerStep=(w,a)=>w.kind==='base'?{kind:w.kind,state:stepLiving(w.state,a)}:w.kind==='slow'?{kind:w.kind,state:stepLiving2(w.state,a)}:{kind:w.kind,state:stepLiving3(w.state,a)};
const physical=w=>livingPhysicalKey(base(w));
const count=decisions=>({combines:decisions.filter(d=>d.action.type==='combine').length,waitCommands:decisions.filter(d=>d.action.type==='wait').length,waitBeats:decisions.filter(d=>d.action.type==='wait').reduce((n,d)=>n+(d.action.beats??1),0),selectLevel:decisions.filter(d=>d.action.type==='select-level').length,finish:decisions.filter(d=>d.action.type==='finish').length,totalCommands:decisions.length});
const sessions=[];
for(const id of ids){
 const capture=`results/logical-players/${id}.json`,r=read(capture),initial=createLivingAtlas(r.scenario,r.seed);
 const exactReplay=replayLogical(r);let s=initial;const states=[s],navigation=[],construction=[],byLevel={},frames=Object.fromEntries(LIVING_ATLAS_LEVELS.map(id=>[id,new Map([[0,structuredClone(initial.boards[id].world)]])])),achievements=[];
 assert.equal(r.attempts.length,0);assert.equal(r.previews.length,0);
 for(const d of r.decisions){
  const a=d.action,prior=s,id=s.active;
  s=stepLivingAtlas(s,a);states.push(s);
  assert.deepEqual(observeLivingAtlas(s),d.observation);
  for(const l of LIVING_ATLAS_LEVELS)if(prior.boards[l].firstAchievement)assert.deepEqual(s.boards[l].firstAchievement,prior.boards[l].firstAchievement);
  if(a.type==='select-level'){
   assert.equal(s.totalTicks,prior.totalTicks);
   for(const l of LIVING_ATLAS_LEVELS)assert.equal(physical(s.boards[l].world),physical(prior.boards[l].world));
   assert.deepEqual(s.known,prior.known);assert.deepEqual(s.boards[s.active].knownOnFirstVisit,s.known);
   assert.equal(physical(s.boards[s.active].world),physical(initial.boards[s.active].world));
   navigation.push({decisionIndex:d.index,from:id,to:s.active,knownOnEntry:s.boards[s.active].knownOnFirstVisit,cleanPhysicalStart:true,noBeat:true,priorWorldRetained:true});continue;
  }
  if(a.type==='finish'){assert.deepEqual(s.boards,prior.boards);assert.equal(s.totalTicks,prior.totalTicks);continue;}
  for(const other of LIVING_ATLAS_LEVELS.filter(x=>x!==id))assert.deepEqual(s.boards[other],prior.boards[other]);
  assert.deepEqual(s.boards[id].world,innerStep(prior.boards[id].world,a));
  const list=byLevel[id]??=[];list.push(d);byLevel[id]=list;
  let w=structuredClone(prior.boards[id].world);
  const beats=a.type==='wait'?a.beats??1:1;
  for(let beat=1;beat<=beats;beat++){
   w=innerStep(w,a.type==='wait'?{type:'wait'}:a);frames[id].set(base(w).tick,structuredClone(w));
   if(goal(w).achieved&&!achievements.some(x=>x.level===id))achievements.push({level:id,command:d.index+1,beatWithinCommand:beat,tick:base(w).tick,totalTicks:prior.totalTicks+beat,known:[...base(w).known],physicalState:physical(w),goal:goal(w)});
  }
  assert.equal(physical(w),physical(s.boards[id].world));assert.deepEqual(goal(w),goal(s.boards[id].world));
  if(a.type==='combine'){
   const learned=s.known.filter(x=>!prior.known.includes(x)),recipe=LIVING_RECIPES.find(x=>[x.a,x.b].sort().join('|')===[a.a,a.b].sort().join('|'));
   const kind=learned.length?(a.at?'acquire-and-install':'pure-design-acquisition'):'already-known-world-application';
   assert.ok(prior.known.every(x=>s.known.includes(x)));
   construction.push({decisionIndex:d.index,level:id,action:a,kind,learned,recipeOutput:recipe?.out??null,physicalEffects:s.events.filter(e=>e.kind!=='acquire'),prediction:d.prediction});
  }
 }
 assert.deepEqual(s,exactReplay);
 const levels=[];
 for(const l of LIVING_ATLAS_LEVELS){
  const board=s.boards[l],g=goal(board.world),cert=board.firstAchievement,first=achievements.find(a=>a.level===l);
  if(cert){assert.deepEqual(cert,first);const stamp=observeLivingAtlas(s).goalCards.find(c=>c.id===l).firstAchievement;assert.equal(stamp.physicalStateSha256,sha(cert.physicalState));}
  else assert.equal(first,undefined);
  let cycleVerification=null;
  if(g.cycle){
   const c=g.cycle,f=frames[l];assert.equal(physical(f.get(c.startTick)),physical(f.get(c.endTick)));assert.equal(physical(f.get(c.endTick)),c.boundary);
   const phaseChecks=c.samples.map(sample=>{
    const b=base(f.get(sample.tick));
    if(l==='intermittent-publication'){
     assert.equal(sample.A,b.cells.find(c=>c.id==='B1').memory);assert.equal(sample.B,b.cells.find(c=>c.id==='D1').memory);assert.equal(sample.squareWater,b.field.C2.water);assert.equal(sample.squareExact,b.field.C2.exact);assert.equal(sample.squareFragment,b.field.C2.fragment);assert.deepEqual(sample.dryPath,livingGoal(b).dryPath);
     for(const [cell,key]of [['A2','sourceAOn'],['E2','sourceBOn']]){const cellState=b.cells.find(c=>c.id===cell);assert.equal(sample[key],cellState.sourceSchedule[(b.tick-1)%4]>0);}
     assert.equal(sample.A,1);assert.equal(sample.B,2);assert.equal(sample.squareWater,1);assert.equal(sample.squareExact,0);assert.equal(sample.squareFragment,3);assert.ok(sample.dryPath);
    }else{for(const [key,cell,field]of [['upperWet','C2','water'],['lowerWet','C4','water'],['upperFlooded','C2','flooded'],['lowerFlooded','C4','flooded']])assert.equal(sample[key],field==='water'?b.field[cell][field]>0:b.field[cell][field]);assert.equal(sample.upperWet&&sample.lowerWet,false);assert.equal(sample.upperFlooded||sample.lowerFlooded,false);}
    return sample;
   });
   const extra=innerStep(board.world,{type:'wait',beats:c.period});assert.equal(physical(extra),physical(board.world));assert.equal(goal(extra).achieved,true);
   cycleVerification={startTick:c.startTick,endTick:c.endTick,period:c.period,exactBoundaryIncludingSourcePhase:true,actualFrameChecks:phaseChecks,extraFullPeriodRepeats:true,cyclicRuns:g.cyclicRuns??null};
  }
  levels.push({level:l,visited:board.firstVisitCommand!==null,visits:board.visits,knownOnEntry:board.knownOnFirstVisit,counts:count(byLevel[l]??[]),finalTick:base(board.world).tick,knownAtFirstAchievement:cert?.known??null,currentlyAchieved:g.achieved,completedEver:!!cert,firstAchievement:cert?{...cert,physicalState:undefined,physicalStateSha256:sha(cert.physicalState)}:null,certificateExactAndEarliest:!!cert,cycleVerification,works:base(board.world).works,finalPhysicalState:JSON.parse(physical(board.world))});
 }
 const intents=(r.continuations??[]).map(c=>{
  const at=Date.parse(c.recordedAt),next=r.decisions[c.decisionIndex],previous=r.decisions[c.decisionIndex-1];assert.ok(at>=Date.parse(r.startedAt)+previous.atMs);assert.ok(at<=Date.parse(r.startedAt)+next.atMs);assert.equal(next.action.type,'select-level');assert.equal(livingAtlasGoal(states[c.decisionIndex]).achieved,true);
  const end=(r.continuations??[]).find(x=>x.decisionIndex>c.decisionIndex)?.decisionIndex??r.decisions.length;
  return {...c,completedPriorGoal:states[c.decisionIndex].active,nextLevel:next.action.level,recordedBeforeNavigation:true,recordedAfterPriorGoal:true,millisecondsBeforeNextAction:Date.parse(r.startedAt)+next.atMs-at,counts:count(r.decisions.slice(c.decisionIndex,end))};
 });
 const prefinish=states.at(-2);assert.equal(s.status,'ended');assert.equal(livingAtlasOutcome(s).terminal,true);assert.equal(prefinish.status,'playing');
 const cert=structuredClone(prefinish.boards.crossing.firstAchievement);let changed=stepLivingAtlas(prefinish,{type:'select-level',level:'crossing'});changed=stepLivingAtlas(changed,{type:'combine',a:'earth',b:'B2'});assert.equal(livingAtlasGoal(changed).achieved,false);assert.deepEqual(changed.boards.crossing.firstAchievement,cert);assert.equal(observeLivingAtlas(changed).goalCards.find(c=>c.id==='crossing').completedEver,true);
 sessions.push({id,capture,sha256:beforeHashes[capture],condition:r.condition,protocolVersion:r.protocolVersion,exactHashAndObservationReplay:true,initialKnown:r.initialObservation.known,finalKnown:s.known,counts:{...count(r.decisions),totalBeats:s.totalTicks,attempts:r.attempts.length,previews:r.previews.length},acquisitionVsApplication:{newConcepts:s.known.length-initial.known.length,pureDesignAcquisitions:construction.filter(c=>c.kind==='pure-design-acquisition').length,acquireAndInstall:construction.filter(c=>c.kind==='acquire-and-install').length,knownWorldApplications:construction.filter(c=>c.kind==='already-known-world-application').length},navigation,inactiveBoardsUnchangedDuringEveryPhysicalCommand:true,construction,levels,intents,checkpoints:r.checkpoints,electiveCombines:construction.filter(c=>r.decisions[c.decisionIndex].phase==='elective').length,finish:{status:s.status,boardsAndTimeUnchanged:true,valid:true,allFiveEver:livingAtlasOutcome(s).goal,completed:livingAtlasOutcome(s).properties.completedLevels,currentlyAchieved:livingAtlasOutcome(s).properties.currentlyAchievedLevels},unexperiencedCurrentEverProbe:{destructiveEarthAtB2MakesCurrentFalse:true,firstAchievementUnchanged:true,completedEverRemainsTrue:true,attribution:'Reviewer-only counterfactual, not player activity'},playerRevisits:0});
}
const beaconPublic={recipe:LIVING_RECIPES.find(r=>r.out==='beacon').effect,flowRule:livingAtlasRules().flow,numericalOutputDisclosed:false,sourceImplementation:'experiments/logical-living-works.ts:79',actualLaw:'If a Beacon has a retained record before the beat, set outgoing field water to 2 and union the record into exact identities. New records acquired during that beat enter retained memory after output calculation.',limitation:'Public prose says republish retained identities but omits numerical pressure2 and precise one-beat retained-memory emission ordering. Actual views/previews expose effects; no claim of complete ex ante numerical disclosure.'};
for(const p of paths)assert.equal(fileHash(p),beforeHashes[p]);
const ledger={version:'living-atlas-play-verification-1',doctrine:'docs/history/what-is-fun/revision-8.md',protocol:'docs/living-atlas-play-protocol.md',method:'Exact raw hash/observation replay; independent frozen-inner-engine command equivalence and per-beat wait reconstruction; earliest certificate/physical-state equality; full-cycle phase checks and extra repeat; prospective-intention timestamps; navigation/knowledge/pause/finish checks. All reviewer probes excluded from player actions.',sourceHashes:paths.filter(p=>!p.startsWith('results/')).map(path=>({path,sha256:beforeHashes[path]})),preplayFreeze,identicalInitialObservations:JSON.stringify(read(`results/logical-players/${ids[0]}.json`).initialObservation)===JSON.stringify(read(`results/logical-players/${ids[1]}.json`).initialObservation),sessions,beaconPublic,sourceAndCapturesUnchanged:true,script:'results/living-atlas-review/verify.mjs'};
writeFileSync('results/living-atlas-play-verification.json',JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({sessions:sessions.map(s=>({id:s.id,counts:s.counts,acquisition:s.acquisitionVsApplication,electiveCombines:s.electiveCombines,finish:s.finish,levels:s.levels.map(l=>({id:l.level,counts:l.counts,first:l.firstAchievement?{command:l.firstAchievement.command,beat:l.firstAchievement.beatWithinCommand,tick:l.firstAchievement.tick}:null,cycle:l.cycleVerification?{start:l.cycleVerification.startTick,end:l.cycleVerification.endTick,period:l.cycleVerification.period}:null}))})),unchanged:ledger.sourceAndCapturesUnchanged},null,2));
