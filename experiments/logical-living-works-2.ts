import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {LIVING_CONCEPTS,createLiving,stepLiving,observeLiving,livingActions,livingRules,livingKey,livingPhysicalKey,livingBoardWitness,livingGoal} from './logical-living-works.ts';
import type {State as BaseState,Action as BaseAction} from './logical-living-works.ts';

/** Goal-only transfer probe. The imported V1 engine is frozen and remains unchanged. */
export const LIVING2_VERSION='living-works-2';
export const LIVING2_SCENARIOS=['slow'];
export type Action=BaseAction;
export interface State {version:string;scenarioId:'slow';base:BaseState}
export interface Run {wet:boolean;beats:number}
export function living2CyclicRuns(values:boolean[]):Run[]{
 if(!values.length)return [];
 const boundary=values.findIndex((value,i)=>value!==values[(i+values.length-1)%values.length]);
 if(boundary<0)return [{wet:values[0],beats:values.length}];
 const runs:Run[]=[];
 for(let n=0;n<values.length;n++){const wet=values[(boundary+n)%values.length],last=runs.at(-1);if(last?.wet===wet)last.beats++;else runs.push({wet,beats:1});}
 return runs;
}
export function createLiving2(scenario='slow',seed=0):State{
 if(scenario!=='slow')throw new Error('Use slow.');
 // Reuse V1's ordinary board initialization without presenting its tutorial as player work.
 const tutorial=livingBoardWitness(createLiving('prebuilt',seed)).state;
 const base=stepLiving(tutorial,{type:'next'});
 base.order=['alternation'];base.levelIndex=0;base.known=[...LIVING_CONCEPTS];base.knownOnEntry=[...LIVING_CONCEPTS];base.actions=[];base.completed=[];base.levelActionStart=0;base.events=[];base.totalTicks=0;
 return {version:LIVING2_VERSION,scenarioId:'slow',base};
}
export function living2Goal(s:State){
 const base=s.base,cycle=base.cycle,samples=cycle?.samples??[];
 const upper=living2CyclicRuns(samples.map(x=>x.upperWet)),lower=living2CyclicRuns(samples.map(x=>x.lowerWet));
 const bothPhases=(runs:Run[])=>runs.some(x=>x.wet)&&runs.some(x=>!x.wet);
 const allRunsLong=(runs:Run[])=>bothPhases(runs)&&runs.every(x=>x.beats>=3);
 const noOverlap=samples.length>0&&samples.every(x=>!(x.upperWet&&x.lowerWet));
 const noFlood=samples.length>0&&samples.every(x=>!x.upperFlooded&&!x.lowerFlooded);
 const living=['C2','C4'].every(id=>{const c=base.cells.find(c=>c.id===id)!;return c.grove&&c.rooted;});
 return {id:'slow-alternation',achieved:!!cycle&&noOverlap&&noFlood&&living&&allRunsLong(upper)&&allRunsLong(lower),
  statement:'During the entire exact repeating physical cycle, each living rooted grove C2/C4 needs every uninterrupted wet phase AND every uninterrupted dry phase to last at least 3 beats. Never water both simultaneously or flood either. Any construction satisfying this is valid; no named component is required.',
  cycle,cyclicRuns:{upper,lower},checks:{exactPhysicalCycle:!!cycle,noOverlap,noFlood,bothLiving:living,upperHasWetAndDry:bothPhases(upper),lowerHasWetAndDry:bothPhases(lower),upperEveryRunAtLeast3:allRunsLong(upper),lowerEveryRunAtLeast3:allRunsLong(lower)},
  explanation:'Run lengths are measured around the whole cycle, joining matching phases across its displayed start/end. This is a changed world goal, not an action allowance, ingredient stock, time limit, or command minimum.'};
}
export function living2Reason(s:State,a:Action):string|undefined{
 if(s.version!==LIVING2_VERSION)return 'Wrong Living Works 2 version.';
 if(a.type==='next')return 'This probe has one board. Finish whenever ready; next is not present.';
}
export function stepLiving2(s:State,a:Action):State{
 const invalid=living2Reason(s,a);if(invalid)throw new Error(invalid);
 return {version:s.version,scenarioId:s.scenarioId,base:stepLiving(s.base,a)};
}
export function statusLiving2(s:State){return s.base.status;}
export function living2Actions(s:State){return livingActions(s.base).filter(a=>a.type!=='next');}
export function living2Key(s:State){return JSON.stringify({version:s.version,world:livingKey(s.base)});}
export function living2Outcome(s:State){const goal=living2Goal(s);return {terminal:s.base.status==='ended',goal:goal.achieved,objectives:[{id:goal.id,value:goal.achieved?1:0,direction:'higher' as const}],properties:{level:goal.id,currentGoal:goal,knownCount:s.base.known.length,conceptCount:LIVING_CONCEPTS.length,known:s.base.known,goalOnlyVariant:true}};}
export function observeLiving2(s:State){
 const previous=observeLiving(s.base);
 return {...previous,version:LIVING2_VERSION,scenario:'slow',level:'slow-alternation',levelNumber:1,order:['slow-alternation'],goal:living2Goal(s),completed:[],
  actionSchema:{...previous.actionSchema,type:'combine | wait | finish'},
  inspect:'All 24 designs and all recipe/component/flow laws are public. The exact cycle must contain wet AND dry runs >=3 beats for each grove, counted cyclically. Any legal construction satisfying the goal is accepted. Finish is always valid.'};
}
export function previewLiving2(s:State,a:Action){try{return {legal:true,...observeLiving2(stepLiving2(s,a))};}catch(error){return {legal:false,reason:(error as Error).message};}}
export function living2Rules(){const old=livingRules();return {...old,version:LIVING2_VERSION,
 goals:{slowAlternation:'Observe a full exact repeating physical-state cycle. C2 and C4 remain living/rooted. Neither floods and they are never wet simultaneously. Each grove has wet and dry phases; EVERY cyclic wet run and EVERY cyclic dry run is >=3 beats. Matching first/last displayed runs join across the cycle boundary. No particular component, path length, number of actions or recipe is required.'},
 scenarios:'One slow-alternation board, with all 24 concepts already known. The initial world has no constructed controller or work. Any legal construction satisfying the stated goal is accepted.',
 time:old.time.replace('Next is legal only after the current goal and moves to the next explicit board while retaining all known concepts; it is counted separately from combinations.','This board has no next action. Finish is always valid.')};}
export function replayLiving2(actions:Action[]){return actions.reduce(stepLiving2,createLiving2());}
const rootGroves:Action[]=[{type:'combine',a:'rootbed',b:'C2'},{type:'combine',a:'rootbed',b:'C4'}];
export function living2Witness(kind:'direct'|'whole'|'manual'='whole'){
 let s=createLiving2();const actions:Action[]=[];const apply=(a:Action)=>{actions.push(a);s=stepLiving2(s,a);};
 for(const a of rootGroves)apply(a);
 if(kind==='direct')apply({type:'combine',a:'valve',b:'C3',ports:['north','south'],control:'C2'});
 else if(kind==='whole'){
  apply({type:'combine',a:'channel',b:'channel',path:['C3','C2','D2','D3']});
  apply({type:'combine',a:'channel',b:'loop',at:'w1'});
  apply({type:'combine',a:'valve',b:'delay',at:'w2',ports:['south']});
 }else{
  apply({type:'combine',a:'valve',b:'C3',ports:['north','south'],control:'D3'});
  apply({type:'combine',a:'channel',b:'C2',ports:['east']});
  apply({type:'combine',a:'channel',b:'D2',ports:['south']});
 }
 apply({type:'wait',beats:24});
 return {kind,actions,state:s,goal:living2Goal(s),oldGoalWouldPass:livingGoal(s.base).achieved};
}
export function screenLiving2(){
 const witnesses=(['direct','whole','manual'] as const).map(kind=>{const w=living2Witness(kind);const period=w.state.base.cycle!.period;return {kind,actions:w.actions,oldGoalWouldPass:w.oldGoalWouldPass,newGoal:w.goal,observation:observeLiving2(w.state),physicalCycleRepeats:livingPhysicalKey(stepLiving2(w.state,{type:'wait',beats:period}).base)===livingPhysicalKey(w.state.base),replayExact:JSON.stringify(replayLiving2(w.actions))===JSON.stringify(w.state)};});
 let forecasts=0;for(const s of [createLiving2(),living2Witness('direct').state,living2Witness('whole').state]){const before=JSON.stringify(s);for(const a of living2Actions(s)){const p=previewLiving2(s,a),next=stepLiving2(s,a);if(JSON.stringify(p)!==JSON.stringify({legal:true,...observeLiving2(next)}))throw new Error('V2 forecast mismatch');forecasts++;}if(before!==JSON.stringify(s))throw new Error('V2 input mutated');}
 return {version:LIVING2_VERSION,kind:'privileged goal-variation witnesses, not player evidence',ontologyUnchanged:true,knownAtStart:LIVING_CONCEPTS.length,witnesses,validation:{forecasts,inputPreserved:true,replaysExact:witnesses.every(w=>w.replayExact),allCycleReplaysExact:witnesses.every(w=>w.physicalCycleRepeats)},limits:['Different explicit phase-duration goal, not a new ontology or proof of longer play.','Both whole-route and direct individual-component answers are accepted.','Matched availability does not erase the experienced player\'s prior physics/CLI knowledge.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenLiving2();mkdirSync('results',{recursive:true});writeFileSync('results/logical-living-works-2-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,witnesses:result.witnesses.map(w=>({kind:w.kind,oldGoal:w.oldGoalWouldPass,newGoal:w.newGoal.achieved,period:w.newGoal.cycle!.period,runs:w.newGoal.cyclicRuns})),validation:result.validation},null,2));}
