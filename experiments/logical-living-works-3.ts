import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {LIVING_CONCEPTS,createLiving,stepLiving,observeLiving,livingActions,livingRules,livingKey,livingPhysicalKey,livingGoal} from './logical-living-works.ts';
import type {State as BaseState,Action as BaseAction,Event} from './logical-living-works.ts';

export const LIVING3_VERSION='living-works-3';
export const LIVING3_SCENARIOS=['intermittent'];
export type Action=BaseAction;
export interface Sample {tick:number;A:number;B:number;squareWater:number;squareExact:number;squareFragment:number;dryPath:string[]|null;sourceAOn:boolean;sourceBOn:boolean}
export interface Cycle {startTick:number;endTick:number;period:number;boundary:string;samples:Sample[]}
export interface State {version:string;scenarioId:'intermittent';base:BaseState;orbit:{tick:number;key:string;sample:Sample}[];cycle:Cycle|null}
const clone=<T>(x:T):T=>structuredClone(x);
const mark=(n:number)=>[n&1?'A':'',n&2?'B':''].filter(Boolean).join('+')||'-';
export function createLiving3(scenario='intermittent',seed=0):State{
 if(scenario!=='intermittent')throw new Error('Use intermittent.');
 const base=createLiving('reverse',seed);
 base.order=['publication'];base.levelIndex=0;base.known=[...LIVING_CONCEPTS];base.knownOnEntry=[...LIVING_CONCEPTS];base.actions=[];base.completed=[];base.levelActionStart=0;base.events=[];base.totalTicks=0;base.tick=0;base.sinceEdit=0;base.recent=[];base.orbit=[];base.cycle=null;
 for(const c of base.cells){if(c.id==='A2')c.sourceSchedule=[2,2,0,0];if(c.id==='E2')c.sourceSchedule=[0,0,2,2];base.field[c.id]={water:0,exact:0,fragment:0,seeds:false,flooded:false,outlets:[]};}
 return {version:LIVING3_VERSION,scenarioId:'intermittent',base,orbit:[],cycle:null};
}
function sample(s:State):Sample{
 const base=s.base,old=livingGoal(base),square=base.field.C2;
 return {tick:base.tick,A:base.cells.find(c=>c.id==='B1')!.memory,B:base.cells.find(c=>c.id==='D1')!.memory,squareWater:square.water,squareExact:square.exact,squareFragment:square.fragment,dryPath:old.id==='publication'?old.dryPath??null:null,sourceAOn:base.cells.find(c=>c.id==='A2')!.sourceSchedule[(base.tick-1)%4]>0,sourceBOn:base.cells.find(c=>c.id==='E2')!.sourceSchedule[(base.tick-1)%4]>0};
}
function recordCycle(s:State){if(s.cycle)return;const key=livingPhysicalKey(s.base),now=sample(s),prior=s.orbit.findIndex(x=>x.key===key);if(prior>=0){const start=s.orbit[prior];s.cycle={startTick:start.tick,endTick:s.base.tick,period:s.base.tick-start.tick,boundary:key,samples:[...s.orbit.slice(prior+1).map(x=>x.sample),now]};}else{s.orbit.push({tick:s.base.tick,key,sample:now});if(s.orbit.length>256)s.orbit.shift();}}
export function living3Goal(s:State){
 const frames=s.cycle?.samples??[],observed=frames.length>0;
 const originals=observed&&frames.every(f=>f.A===1&&f.B===2),continuousFragments=observed&&frames.every(f=>f.squareWater>0&&(f.squareFragment&3)===3&&f.squareExact===0),dryConnection=observed&&frames.every(f=>!!f.dryPath);
 return {id:'intermittent-publication',achieved:!!s.cycle&&originals&&continuousFragments&&dryConnection,
 statement:'Throughout the entire exact repeating physical cycle, retain an exact A-only original at B1 and B-only original at D1; continuously deliver A+B fragments and no exact identity to square C2, with an unflooded A2-to-E2 walk in every phase. Sources have the displayed intermittent schedules. Any legal architecture meeting the result is accepted.',
 cycle:s.cycle,checks:{exactPhysicalCycle:!!s.cycle,originalsThroughoutCycle:originals,continuousCombinedFragments:continuousFragments,dryConnectionThroughoutCycle:dryConnection},
 current:{B1:mark(s.base.cells.find(c=>c.id==='B1')!.memory),D1:mark(s.base.cells.find(c=>c.id==='D1')!.memory),square:{water:s.base.field.C2.water,exact:mark(s.base.field.C2.exact),fragment:mark(s.base.field.C2.fragment)}},
 explanation:'The requirement applies to every phase of the established repeating cycle, not to initial construction transients. Equality includes all actual fields, outlets, records, roots, controllers and source phases. World edits invalidate the old proof.'};
}
export function stepLiving3(state:State,a:Action):State{
 if(state.version!==LIVING3_VERSION)throw new Error('Wrong Living Works 3 version.');
 if(a.type==='next')throw new Error('This board has no next action; finish whenever ready.');
 const s=clone(state),priorActions=clone(s.base.actions);
 if(a.type==='finish'){s.base=stepLiving(s.base,a);return s;}
 if(a.type==='combine'){s.orbit=[];s.cycle=null;s.base=stepLiving(s.base,a);recordCycle(s);return s;}
 // Sample every actual beat inside a public wait batch, then restore its single-command bookkeeping.
 if(a.type==='wait'){
  if(a.beats!==undefined&&(!Number.isInteger(a.beats)||a.beats<1||a.beats>24))throw new Error('Wait beats must be an integer from 1 to 24; this is a recording batch, not a budget.');
  const events:Event[]=[];
  for(let i=0;i<(a.beats??1);i++){s.base=stepLiving(s.base,{type:'wait'});events.push(...s.base.events);recordCycle(s);}
  s.base.actions=[...priorActions,clone(a)];s.base.events=events;return s;
 }
 // Delegate invalid action validation to the unchanged shared engine.
 s.base=stepLiving(s.base,a);return s;
}
export function statusLiving3(s:State){return s.base.status;}
export function living3Actions(s:State){return livingActions(s.base).filter(a=>a.type!=='next');}
export function living3Key(s:State){return JSON.stringify({version:s.version,world:livingKey(s.base),cycle:s.cycle?{period:s.cycle.period,boundary:s.cycle.boundary,samples:s.cycle.samples.map(({tick:_,...frame})=>frame)}:null});}
export function living3Outcome(s:State){const goal=living3Goal(s);return {terminal:s.base.status==='ended',goal:goal.achieved,objectives:[{id:goal.id,value:goal.achieved?1:0,direction:'higher' as const}],properties:{level:goal.id,currentGoal:goal,knownCount:s.base.known.length,conceptCount:LIVING_CONCEPTS.length,known:s.base.known}};}
export function observeLiving3(s:State){const previous=observeLiving(s.base);return {...previous,version:LIVING3_VERSION,scenario:'intermittent',level:'intermittent-publication',levelNumber:1,order:['intermittent-publication'],goal:living3Goal(s),completed:[],actionSchema:{...previous.actionSchema,type:'combine | wait | finish'},inspect:'All 24 designs and actual laws are public. Source schedules are pressure arrays indexed by tick modulo their lengths: A2 [2,2,0,0], E2 [0,0,2,2]. Verify continuous combined fragment delivery, separate originals and dry walking throughout the exact repeating cycle. Any valid construction is accepted; finish is always available.'};}
export function previewLiving3(s:State,a:Action){try{return {legal:true,...observeLiving3(stepLiving3(s,a))};}catch(error){return {legal:false,reason:(error as Error).message};}}
export function living3Rules(){const old=livingRules();return {...old,version:LIVING3_VERSION,
 goals:{intermittentPublication:'Over every phase of the exact repeated physical cycle: B1 retains A only, D1 B only; C2 receives water carrying both A+B fragments and no exact identity continuously; A2-to-E2 remains unflooded and walkable. Initial construction transients are not an all-history failure. No particular component or recipe is required.'},
 scenarios:'One publication board; all 24 concepts are known, with no work or controller already constructed. Sources A2 and E2 use the explicit schedules [2,2,0,0] and [0,0,2,2]. Index the next emission by current tick modulo 4. This changes input conditions, not the common propagation law.',
 verification:'The actual entire physical state, including source phases, must repeat. Every phase between identical states is checked. Up to 256 prior physical states are retained to find a cycle; an unseen longer period is unverified. A world edit invalidates the cycle. Every real beat inside a wait batch is checked, not just its endpoint.',
 time:old.time.replace('Alternation succeeds only after an actual exact repeated physical state; its entire cycle must satisfy the goal.','This goal succeeds only after an actual exact repeated physical state; its entire cycle must satisfy the goal.').replace('Next is legal only after the current goal and moves to the next explicit board while retaining all known concepts; it is counted separately from combinations.','This board has no next action. Finish is always valid.')};}
export function replayLiving3(actions:Action[]){return actions.reduce(stepLiving3,createLiving3());}
export function living3Witness(kind:'direct'|'broadcast'|'circulation'='broadcast'){
 let s=createLiving3();const actions:Action[]=[];const apply=(a:Action)=>{actions.push(a);s=stepLiving3(s,a);};
 apply({type:'combine',a:kind==='broadcast'?'beacon':'archive',b:'B1'});
 apply({type:'combine',a:kind==='broadcast'?'beacon':'archive',b:'D1'});
 apply({type:'wait',beats:6});
 apply({type:'combine',a:'rootbed',b:'B2'});apply({type:'combine',a:'rootbed',b:'D2'});
 if(kind!=='direct'){apply({type:'combine',a:'channel',b:'B1',ports:['south']});apply({type:'combine',a:'channel',b:'D1',ports:['south']});}
 apply({type:'combine',a:'channel',b:'B2',ports:kind==='circulation'?['north','east']:['east']});
 apply({type:'combine',a:'channel',b:'D2',ports:kind==='circulation'?['north','west']:['west']});
 apply({type:'wait',beats:24});return {kind,actions,state:s,goal:living3Goal(s)};
}
export function screenLiving3(){
 const witnesses=(['direct','broadcast','circulation'] as const).map(kind=>{const w=living3Witness(kind),period=w.state.cycle!.period;return {kind,actions:w.actions,goal:w.goal,observation:observeLiving3(w.state),replayExact:JSON.stringify(replayLiving3(w.actions))===JSON.stringify(w.state),cycleReplayExact:livingPhysicalKey(stepLiving3(w.state,{type:'wait',beats:period}).base)===livingPhysicalKey(w.state.base),beaconPlaces:w.state.base.cells.filter(c=>c.beacon).map(c=>c.id)};});
 let forecasts=0;for(const s of [createLiving3(),living3Witness('direct').state,living3Witness('broadcast').state,living3Witness('circulation').state]){const before=JSON.stringify(s);for(const a of living3Actions(s)){const p=previewLiving3(s,a),next=stepLiving3(s,a);if(JSON.stringify(p)!==JSON.stringify({legal:true,...observeLiving3(next)}))throw new Error('V3 forecast mismatch');forecasts++;}if(before!==JSON.stringify(s))throw new Error('V3 input mutated');}
 return {version:LIVING3_VERSION,kind:'privileged input/goal-variation witnesses, not player evidence',witnesses,validation:{forecasts,inputPreserved:true,replaysExact:witnesses.every(w=>w.replayExact),cycleReplaysExact:witnesses.every(w=>w.cycleReplayExact)},limits:['Same ontology and engine, changed input schedules and full-cycle delivery objective.','Both retained-record broadcast and genuine recirculating signal storage are accepted; no Beacon label requirement.','This is one bounded goal, not evidence of a large catalogue experience or human enjoyment.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenLiving3();mkdirSync('results',{recursive:true});writeFileSync('results/logical-living-works-3-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,witnesses:result.witnesses.map(w=>({kind:w.kind,achieved:w.goal.achieved,period:w.goal.cycle!.period,checks:w.goal.checks,beacons:w.beaconPlaces,squareByPhase:w.goal.cycle!.samples.map(f=>({tick:f.tick,exact:f.squareExact,fragment:f.squareFragment,water:f.squareWater}))})),validation:result.validation},null,2));}
