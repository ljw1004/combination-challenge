import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {LIVING_CONCEPTS,LIVING_PRIMITIVES,LIVING_RECIPES,createLiving,stepLiving,observeLiving,livingActions,livingRules,livingGoal,livingPhysicalKey,livingBoardWitness} from './logical-living-works.ts';
import type {State as BaseState,Action as BaseAction,Event} from './logical-living-works.ts';
import {createLiving2,stepLiving2,observeLiving2,living2Goal,living2Rules} from './logical-living-works-2.ts';
import type {State as SlowState} from './logical-living-works-2.ts';
import {createLiving3,stepLiving3,observeLiving3,living3Goal,living3Rules} from './logical-living-works-3.ts';
import type {State as IntermittentState} from './logical-living-works-3.ts';

/** Campaign composition only: imported concepts, dynamics and five predicates are frozen. */
export const LIVING_ATLAS_VERSION='living-atlas-1';
export const LIVING_ATLAS_SCENARIOS=['open'];
export const LIVING_ATLAS_LEVELS=['crossing','alternation','publication','slow-alternation','intermittent-publication'] as const;
export type LevelId=typeof LIVING_ATLAS_LEVELS[number];
export type Action=Omit<BaseAction,'type'> & {type:'combine'|'wait'|'select-level'|'finish';level?:LevelId};
export type World={kind:'base';state:BaseState}|{kind:'slow';state:SlowState}|{kind:'intermittent';state:IntermittentState};
export type Goal=ReturnType<typeof livingGoal>|ReturnType<typeof living2Goal>|ReturnType<typeof living3Goal>;
export interface Certificate {level:LevelId;command:number;beatWithinCommand:number;tick:number;totalTicks:number;known:string[];physicalState:string;goal:Goal}
export interface Board {id:LevelId;world:World;visits:number;firstVisitCommand:number|null;knownOnFirstVisit:string[];firstAchievement:Certificate|null}
export interface State {version:string;scenarioId:'open';active:LevelId;known:string[];boards:Record<LevelId,Board>;actions:Action[];status:'playing'|'ended';totalTicks:number;events:Event[]}
const clone=<T>(x:T):T=>structuredClone(x);
export function livingAtlasBase(board:Board):BaseState{return board.world.kind==='base'?board.world.state:board.world.state.base;}
function worldGoal(world:World):Goal{return world.kind==='base'?livingGoal(world.state):world.kind==='slow'?living2Goal(world.state):living3Goal(world.state);}
function worldObservation(world:World){return world.kind==='base'?observeLiving(world.state):world.kind==='slow'?observeLiving2(world.state):observeLiving3(world.state);}
function worldStep(world:World,a:BaseAction):World{return world.kind==='base'?{kind:'base',state:stepLiving(world.state,a)}:world.kind==='slow'?{kind:'slow',state:stepLiving2(world.state,a)}:{kind:'intermittent',state:stepLiving3(world.state,a)};}
function initialWorld(id:LevelId,seed:number):World{
 if(id==='slow-alternation')return {kind:'slow',state:createLiving2('slow',seed)};
 if(id==='intermittent-publication')return {kind:'intermittent',state:createLiving3('intermittent',seed)};
 // V2 exposes V1's ordinary untouched alternation initialization. Its returned board
 // has tick 0, no actions/works/controller; no completed tutorial arrangement is retained.
 const base=id==='alternation'?createLiving2('slow',seed).base:createLiving(id==='publication'?'reverse':'sequence',seed);
 base.order=[id];base.levelIndex=0;return {kind:'base',state:base};
}
export function createLivingAtlas(scenario='open',seed=0):State{
 if(scenario!=='open')throw new Error('Use open.');
 const boards=Object.fromEntries(LIVING_ATLAS_LEVELS.map(id=>{
  const board:Board={id,world:initialWorld(id,seed),visits:id==='crossing'?1:0,firstVisitCommand:id==='crossing'?0:null,knownOnFirstVisit:id==='crossing'?[...LIVING_PRIMITIVES]:[],firstAchievement:null};
  const base=livingAtlasBase(board);base.known=[...LIVING_PRIMITIVES];base.knownOnEntry=[...board.knownOnFirstVisit];
  return [id,board];
 })) as Record<LevelId,Board>;
 return {version:LIVING_ATLAS_VERSION,scenarioId:'open',active:'crossing',known:[...LIVING_PRIMITIVES],boards,actions:[],status:'playing',totalTicks:0,events:[]};
}
export function livingAtlasGoal(s:State){return worldGoal(s.boards[s.active].world);}
function certificateStamp(c:Certificate){return {level:c.level,command:c.command,beatWithinCommand:c.beatWithinCommand,tick:c.tick,totalTicks:c.totalTicks,known:c.known,goal:{id:c.goal.id,achieved:c.goal.achieved},cyclePeriod:'cycle' in c.goal?c.goal.cycle?.period??null:null,physicalStateSha256:createHash('sha256').update(c.physicalState).digest('hex')};}
function certify(s:State,beatWithinCommand:number){
 const board=s.boards[s.active],goal=worldGoal(board.world);if(board.firstAchievement||!goal.achieved)return;
 const base=livingAtlasBase(board);
 board.firstAchievement={level:s.active,command:s.actions.length,beatWithinCommand,tick:base.tick,totalTicks:s.totalTicks,known:[...s.known],physicalState:livingPhysicalKey(base),goal:clone(goal)};
 s.events.push({kind:'first-achievement',at:s.active,after:certificateStamp(board.firstAchievement)});
}
export function stepLivingAtlas(state:State,a:Action):State{
 if(state.version!==LIVING_ATLAS_VERSION||state.status!=='playing')throw new Error('This atlas is not playing.');
 const s=clone(state);s.actions.push(clone(a));s.events=[];
 if(a.type==='finish'){s.status='ended';s.events=[{kind:'finish'}];return s;}
 if(a.type==='select-level'){
  if(!a.level||!LIVING_ATLAS_LEVELS.includes(a.level))throw new Error('Select one of the five displayed level IDs.');
  const previous=s.active;s.active=a.level;const board=s.boards[s.active],base=livingAtlasBase(board);
  if(board.firstVisitCommand===null){board.firstVisitCommand=s.actions.length;board.knownOnFirstVisit=[...s.known];base.knownOnEntry=[...s.known];}
  if(previous!==s.active)board.visits++;
  base.known=[...s.known];s.events=[{kind:'select-level',before:previous,after:s.active}];return s;
 }
 if(a.type!=='combine'&&a.type!=='wait')throw new Error('Use combine, wait, select-level or finish; next is not an Atlas action.');
 if(a.type==='wait'&&a.beats!==undefined&&(!Number.isInteger(a.beats)||a.beats<1||a.beats>24))throw new Error('Wait beats must be an integer from 1 to 24; this is a recording batch, not a budget.');
 const board=s.boards[s.active];livingAtlasBase(board).known=[...s.known];
 const priorActions=clone(livingAtlasBase(board).actions),events:Event[]=[];
 const count=a.type==='wait'?a.beats??1:1;
 for(let beat=1;beat<=count;beat++){
  board.world=worldStep(board.world,a.type==='wait'?{type:'wait'}:a as BaseAction);
  const base=livingAtlasBase(board);s.totalTicks++;s.known=[...base.known];events.push(...base.events);s.events.push(...base.events);certify(s,beat);
 }
 if(a.type==='wait'){
  // The inner world receives the exact same beats; restore the original single
  // command and accumulated events so batch bookkeeping also matches its engine.
  const base=livingAtlasBase(board);base.actions=[...priorActions,clone(a) as BaseAction];base.events=events;
 }
 return s;
}
export function statusLivingAtlas(s:State){return s.status;}
export function livingAtlasActions(s:State):Action[]{
 if(s.status!=='playing')return [];
 const board=clone(s.boards[s.active]);livingAtlasBase(board).known=[...s.known];
 const physical=livingActions(livingAtlasBase(board)).filter(a=>a.type==='combine'||a.type==='wait') as Action[];
 return [...physical,...LIVING_ATLAS_LEVELS.filter(level=>level!==s.active).map(level=>({type:'select-level' as const,level})),{type:'finish'}];
}
export function livingAtlasKey(s:State){return JSON.stringify(s);}
export function livingAtlasOutcome(s:State){
 const completed=LIVING_ATLAS_LEVELS.filter(id=>!!s.boards[id].firstAchievement),current=LIVING_ATLAS_LEVELS.filter(id=>worldGoal(s.boards[id].world).achieved);
 return {terminal:s.status==='ended',goal:completed.length===LIVING_ATLAS_LEVELS.length,objectives:LIVING_ATLAS_LEVELS.map(id=>({id,value:s.boards[id].firstAchievement?1:0,direction:'higher' as const})),properties:{level:s.active,currentGoal:livingAtlasGoal(s),knownCount:s.known.length,conceptCount:LIVING_CONCEPTS.length,known:s.known,completedLevels:completed,currentlyAchievedLevels:current,allFiveCompletedEver:completed.length===5,allFiveCurrentlyAchieved:current.length===5}};
}
export function observeLivingAtlas(s:State){
 const board=s.boards[s.active],previous=worldObservation(board.world),outcome=livingAtlasOutcome(s);
 const goalCards=LIVING_ATLAS_LEVELS.map(id=>{
  const b=s.boards[id],goal=worldGoal(b.world),base=livingAtlasBase(b);
  return {id,statement:goal.statement,currentlyAchieved:goal.achieved,completedEver:!!b.firstAchievement,visited:b.firstVisitCommand!==null,visits:b.visits,tick:base.tick,firstAchievement:b.firstAchievement?certificateStamp(b.firstAchievement):null,sources:base.cells.filter(c=>c.source).map(c=>({at:c.id,identity:c.source===1?'A':'B',schedule:c.sourceSchedule,nextPhase:base.tick%c.sourceSchedule.length}))};
 });
 return {...previous,version:LIVING_ATLAS_VERSION,scenario:'open',status:s.status,level:s.active,levelNumber:LIVING_ATLAS_LEVELS.indexOf(s.active)+1,order:[...LIVING_ATLAS_LEVELS],orderIsRequired:false,totalTicks:s.totalTicks,known:s.known,knownOnEntry:board.knownOnFirstVisit,goal:livingAtlasGoal(s),goalCards,
  completed:LIVING_ATLAS_LEVELS.flatMap(id=>{const b=s.boards[id];return b.firstAchievement?[{level:id,goal:{id:b.firstAchievement.goal.id,achieved:true},knownOnEntry:b.knownOnFirstVisit,knownOnExit:b.firstAchievement.known,tick:b.firstAchievement.tick,firstAchievement:certificateStamp(b.firstAchievement)}]:[];}),
  campaign:{allFiveCompletedEver:outcome.properties.allFiveCompletedEver,allFiveCurrentlyAchieved:outcome.properties.allFiveCurrentlyAchieved,completedEver:outcome.properties.completedLevels,currentlyAchieved:outcome.properties.currentlyAchievedLevels},events:s.events,
  actionSchema:{...previous.actionSchema,type:'combine | wait | select-level | finish',level:'select-level only: crossing | alternation | publication | slow-alternation | intermittent-publication'},
  inspect:'All five goal cards and all 24 concept recipes are public from the start. Begin with six inexhaustible primitives. Select any board at any time, without completing another goal: select-level is navigation, not a combination or beat. Known concepts are shared; actual places, works, records, fields and source phases belong to their board and stay paused while it is inactive. Revisiting resumes that exact arrangement with current shared knowledge. Goal cards distinguish current satisfaction from an immutable first-achievement certificate. Certificate stamps show the exact command/beat and physical-state hash; the full certificate is retained in saved state. Any legal construction is accepted. Finish is always available, including before any or all goals.'};
}
export function previewLivingAtlas(s:State,a:Action){try{return {legal:true,...observeLivingAtlas(stepLivingAtlas(s,a))};}catch(error){return {legal:false,reason:(error as Error).message};}}
export function livingAtlasRules(){
 const old=livingRules();return {...old,version:LIVING_ATLAS_VERSION,
  creation:old.creation.replace('Known designs persist across next; material boards do not.','Known designs are shared across all five boards. Each board retains its own actual arrangements; knowledge transfer creates no component, record, route or work.'),
  time:'A combine advances one beat on the selected board only. Wait advances 1..24 actual beats there, checking every beat. Inactive boards are fully paused, including flow and source phases. select-level changes selection only; it requires no goal, creates no arrangement, and advances no beat. Finish ends the campaign whenever wanted; next is not an action. Existing cycle predicates inspect actual full repeated physical states, with at most 256 preceding states retained for cycle detection. World edits invalidate the relevant cycle proof.',
  goals:{...old.goals,'slow-alternation':living2Rules().goals.slowAlternation,'intermittent-publication':living3Rules().goals.intermittentPublication},
  scenarios:'One open atlas. Crossing is selected first; crossing, ordinary alternation, publication, slow alternation and intermittent publication are all selectable immediately. Start with the same six primitives shared across the five boards. Each board starts with its provided initial map/fields, no player work. Ordinary and slow alternation are separate retained worlds with different goals. Intermittent publication uses A2 [2,2,0,0] and E2 [0,0,2,2]; other source schedules remain as displayed.',
  completion:'The first actual beat satisfying a board predicate creates an immutable certificate with outer command, beat within that command, local tick, exact physical state and goal evidence. A completed-ever badge never asserts continued satisfaction: later changes can make its current goal false. Cycle goals require their entire actual repeated state cycle, while crossing and ordinary publication retain their original instantaneous predicates. Campaign goal means all five have been achieved at least once; stopping sooner is always valid. Selecting a board neither certifies nor advances it.'};
}
export function replayLivingAtlas(actions:Action[],scenario='open'){return actions.reduce(stepLivingAtlas,createLivingAtlas(scenario));}

/** Privileged mechanical construction, excluded from public onboarding. */
export function livingAtlasWitness(order:readonly LevelId[]=LIVING_ATLAS_LEVELS,intermittent:'broadcast'|'circulation'='circulation'){
 let state=createLivingAtlas();const actions:Action[]=[],levels:{id:LevelId;knownOnEntry:string[];knownOnExit:string[];goal:Goal;firstAchievement:Certificate|null}[]=[];
 const apply=(a:Action)=>{actions.push(a);state=stepLivingAtlas(state,a);};
 const ensure=(id:string)=>{if(state.known.includes(id))return;const r=LIVING_RECIPES.find(r=>r.out===id);if(!r||r.mode!=='concept')throw new Error(`Actual work needed for ${id}.`);ensure(r.a);ensure(r.b);apply({type:'combine',a:r.a,b:r.b});};
 for(const id of order){
  if(state.active!==id)apply({type:'select-level',level:id});
  const knownOnEntry=[...state.known];
  if(id!=='intermittent-publication'){
   const w=livingBoardWitness(livingAtlasBase(state.boards[id]));for(const action of w.actions)apply(action as Action);
  }else{
   ensure(intermittent==='broadcast'?'beacon':'archive');ensure('channel');ensure('rootbed');
   apply({type:'combine',a:intermittent==='broadcast'?'beacon':'archive',b:'B1'});apply({type:'combine',a:intermittent==='broadcast'?'beacon':'archive',b:'D1'});apply({type:'wait',beats:6});
   apply({type:'combine',a:'rootbed',b:'B2'});apply({type:'combine',a:'rootbed',b:'D2'});
   apply({type:'combine',a:'channel',b:'B1',ports:['south']});apply({type:'combine',a:'channel',b:'D1',ports:['south']});
   apply({type:'combine',a:'channel',b:'B2',ports:intermittent==='circulation'?['north','east']:['east']});apply({type:'combine',a:'channel',b:'D2',ports:intermittent==='circulation'?['north','west']:['west']});apply({type:'wait',beats:24});
  }
  const goal=livingAtlasGoal(state);if(!goal.achieved)throw new Error(`Atlas witness did not complete ${id}.`);
  levels.push({id,knownOnEntry,knownOnExit:[...state.known],goal,firstAchievement:state.boards[id].firstAchievement});
 }
 return {actions,state,levels};
}
export function screenLivingAtlas(){
 const orders=[LIVING_ATLAS_LEVELS,[...LIVING_ATLAS_LEVELS].reverse()];
 const witnesses=orders.map(order=>{const w=livingAtlasWitness(order);return {order,actions:w.actions,levels:w.levels,counts:{combines:w.actions.filter(a=>a.type==='combine').length,waitCommands:w.actions.filter(a=>a.type==='wait').length,waitBeats:w.actions.filter(a=>a.type==='wait').reduce((n,a)=>n+(a.beats??1),0),selectLevel:w.actions.filter(a=>a.type==='select-level').length},outcome:livingAtlasOutcome(w.state),replayExact:JSON.stringify(replayLivingAtlas(w.actions))===JSON.stringify(w.state)};});
 const states=[createLivingAtlas()],complete=livingAtlasWitness().state;
 for(const level of LIVING_ATLAS_LEVELS)states.push(stepLivingAtlas(complete,{type:'select-level',level}));
 let forecasts=0;for(const s of states){const before=JSON.stringify(s);for(const a of livingAtlasActions(s)){const p=previewLivingAtlas(s,a),next=stepLivingAtlas(s,a);if(JSON.stringify(p)!==JSON.stringify({legal:true,...observeLivingAtlas(next)}))throw new Error('Atlas forecast mismatch');forecasts++;}if(before!==JSON.stringify(s))throw new Error('Atlas input mutated');}
 return {version:LIVING_ATLAS_VERSION,kind:'privileged consolidation witnesses, not player evidence',witnesses,validation:{forecasts,inputPreserved:true,replaysExact:witnesses.every(w=>w.replayExact)},limits:['The five existing goals and 24 concepts are consolidated, not expanded.','Open access and persistent world arrangements do not establish elective appetite or enjoyment.','Campaign completion does not establish a measured human play duration or that every branch was useful.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const screen=screenLivingAtlas();mkdirSync('results',{recursive:true});writeFileSync('results/logical-living-atlas-screen.json',JSON.stringify(screen,null,2));console.log(JSON.stringify({version:screen.version,witnesses:screen.witnesses.map(w=>({order:w.order,counts:w.counts,allFive:w.outcome.goal,certificates:w.levels.map(l=>({level:l.id,tick:l.firstAchievement?.tick,command:l.firstAchievement?.command,beat:l.firstAchievement?.beatWithinCommand})),known:w.outcome.properties.knownCount})),validation:screen.validation},null,2));}
