/** Abstract game adapters. No renderer, pointer input, timing or browser state. */
import { constellationStep, createConstellation } from '../src/constellation-model.ts';
import type { ConstellationState } from '../src/constellation-model.ts';
import { JOINERY_LEVELS } from '../src/joinery-model.ts';
import type { Cell } from '../src/joinery-model.ts';
import { RELATIONS_VERSION, createRelations, observeRelations, stepRelations, inspectRelations, scenarios as relationScenarios } from './logical-relations.ts';
import type { RelationsState, RelationsAction } from './logical-relations.ts';
import { LAB_VERSION, LAB_SCENARIO_IDS, createLaboratory, observeLaboratory, stepLaboratory } from './logical-laboratory.ts';
import type { LaboratoryState, LaboratoryAction } from './logical-laboratory.ts';
import { RELATIONS_VERSION as RELATIONS2_VERSION, createRelations as createRelations2, observeRelations as observeRelations2, stepRelations as stepRelations2, inspectRelations as inspectRelations2, scenarios as relation2Scenarios } from './logical-relations-2.ts';
import type { RelationsState as Relations2State, RelationsAction as Relations2Action } from './logical-relations-2.ts';
import { PROGRESSION_VERSION, createProgression, observeProgression, stepProgression } from './logical-progression.ts';
import type { ProgressionState } from './logical-progression.ts';
import { PROCESS_VERSION, PROCESS_SCENARIO_IDS, createProcess, observeProcess, stepProcess, previewProcess, legalProcessActions, processSemanticKey, processOutcome } from './logical-process.ts';
import type { State as ProcessState, Action as ProcessAction } from './logical-process.ts';
import { CONSTITUTION_VERSION, SCENARIO_IDS as constitutionScenarios, createConstitution, observeConstitution, stepConstitution, previewConstitution, legalActions as constitutionActions, semanticKey as constitutionKey, outcomeProfile as constitutionProfile } from './logical-constitution.ts';
import type { State as ConstitutionState, Action as ConstitutionAction } from './logical-constitution.ts';
import type { DecisionDomain } from './decision-space.ts';
import { BELL_VERSION, BELL_SCENARIO_IDS, createBellOrchard, observeBellOrchard, stepBellOrchard, previewBellOrchard, legalBellActions, bellOutcome, bellSemanticKey } from './logical-bell-orchard.ts';
import type { State as BellState, Action as BellAction } from './logical-bell-orchard.ts';
import { MNEME_VERSION, SCENARIO_IDS as mnemeScenarios, createMneme, observeMneme, stepMneme, previewMneme, legalActions as mnemeActions, semanticKey as mnemeKey, outcomeProfile as mnemeProfile } from './logical-mneme.ts';
import type { State as MnemeState, Action as MnemeAction } from './logical-mneme.ts';
import { BELL2_VERSION, BELL2_SCENARIO_IDS, createBellOrchard2, observeBellOrchard2, stepBellOrchard2, previewBellOrchard2, legalBellActions2, bellOutcome2, bellSemanticKey2 } from './logical-bell-orchard-2.ts';
import type { State as Bell2State } from './logical-bell-orchard-2.ts';
import { MNEME_VERSION as MNEME2_VERSION, SCENARIO_IDS as mneme2Scenarios, createMneme as createMneme2, observeMneme as observeMneme2, stepMneme as stepMneme2, previewMneme as previewMneme2, legalActions as mneme2Actions, semanticKey as mneme2Key, outcomeProfile as mneme2Profile } from './logical-mneme-2.ts';
import type { State as Mneme2State } from './logical-mneme-2.ts';
import { CONFLUENCE_VERSION, CONFLUENCE_SCENARIO_IDS, createConfluence, observeConfluence, stepConfluence, previewConfluence, legalConfluenceActions, confluenceRulesObservation } from './logical-confluence.ts';
import type { State as ConfluenceState, Action as ConfluenceAction } from './logical-confluence.ts';
import {FIELD_VERSION,createField,stepField,observeField,previewField,fieldRules,fieldAvailability} from './logical-field.ts';
import type {State as FieldState} from './logical-field.ts';
import {IMPRINT_VERSION,IMPRINT_SCENARIOS,createImprints,observeImprints,stepImprints,previewImprints,imprintsActions,imprintsRules} from './logical-imprints.ts';
import type {State as ImprintState,Action as ImprintAction} from './logical-imprints.ts';
import {RESONANCE_VERSION,RESONANCE_SCENARIOS,createResonance,observeResonance,stepResonance,previewResonance,resonanceRules,resonanceActions} from './logical-resonance.ts';
import type {State as ResonanceState,Action as ResonanceAction} from './logical-resonance.ts';
import {FRONTIER_VERSION,FRONTIER_SCENARIOS,createFrontier,observeFrontier,stepFrontier,previewFrontier,frontierActions,frontierRules,statusFrontier} from './logical-frontier.ts';
import type {State as FrontierState,Action as FrontierAction} from './logical-frontier.ts';
import {FACULTIES_VERSION,FACULTIES_SCENARIOS,createFaculties,observeFaculties,stepFaculties,previewFaculties,facultiesActions,facultiesRules} from './logical-faculties.ts';
import type {State as FacultiesState,Action as FacultiesAction} from './logical-faculties.ts';

export interface LogicalGame {
  id:string;version:string;scenarios:string[];
  create(scenario:string,seed:number):unknown;
  observe(state:unknown):unknown;
  step(state:unknown,action:unknown):unknown;
  status(state:unknown):string;
  preview?(state:unknown,action:unknown):unknown;
  decisionDomain?:DecisionDomain;
  rules?():unknown;
  actions?(state:unknown):unknown[];
}
export const logicalHash=(state:unknown):string=>{
  let value=2166136261;
  for(const char of JSON.stringify(state)){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}
  return (value>>>0).toString(16).padStart(8,'0');
};
function grid(cells:Cell[]):string[] {
  const width=Math.max(...cells.map(cell=>cell[0]))+1,height=Math.max(...cells.map(cell=>cell[1]))+1;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>cells.some(cell=>cell[0]===x&&cell[1]===y)?'#':'.').join(''));
}
interface FormAction {type:'combine';a:string;b:string;turnA?:number;turnB?:number;dx:number;dy:number}
const formNode=(state:ConstellationState,id:string)=>{
  if(!/^n[1-9][0-9]*$/.test(id))throw new Error('Choose a displayed concept ID such as n1.');
  const node=state.nodes[Number(id.slice(1))-1];if(!node)throw new Error('Unknown form.');return node;
};
function formsStep(raw:unknown,input:unknown):ConstellationState {
  let state=raw as ConstellationState;const a=input as FormAction;
  if(a.type!=='combine')throw new Error('Use a combine action.');
  const first=formNode(state,a.a),second=formNode(state,a.b);
  for(const [id,turns]of [[first.id,a.turnA??0],[second.id,a.turnB??0]] as [string,number][]){
    if(!Number.isInteger(turns)||turns<0||turns>3)throw new Error('turnA and turnB are clockwise quarter-turns, 0–3.');
    for(let i=0;i<turns;i++)state=constellationStep(state,{type:'rotate',id});
  }
  return constellationStep(state,{type:'blend',a:first.id,b:second.id,at:{x:2000,y:300},offset:{x:a.dx,y:a.dy}});
}
function formsObservation(raw:unknown){
  const state=raw as ConstellationState;
  return {game:'forms',scenario:state.goal!.id,status:state.goal!.status,
    goal:{description:'Create a form exactly matching this target, allowing rotation but not reflection.',cells:state.goal!.cells,rows:grid(state.goal!.cells)},
    concepts:state.nodes.map((node,index)=>({id:`n${index+1}`,name:node.name,cells:node.cells,rows:grid(node.cells!)})),
    rules:[
      'Combining is the union of two rigid shapes. They must touch along at least one edge and may not overlap.',
      'Both parent concepts remain forever. A new shape becomes a reusable concept. Mistakes spend nothing; set them aside and use the parents again.',
      'Turn either shape clockwise before combining. Then shift A by (dx,dy) relative to the top-left square-grid origin of B. Negative offsets are allowed.',
      'There is one concept per established geometry up to rotation. Repeating a known result creates no duplicate. The four starting colored concepts are distinct reusable sources.',
      'A concept cannot combine with itself. Different existing concepts may be reused indefinitely. No move count, piece stock or time limit exists.',
      'All union rules and results are public. Optional preview gives the exact immediate union. Your task is global geometric composition.'
    ],actionSchema:{type:'combine',a:'n1',b:'n2',turnA:'0–3; default0',turnB:'0–3; default0',dx:'integer',dy:'integer'},
    lastConsequence:state.notice};
}
const forms:LogicalGame={id:'forms',version:'logical-forms-1',scenarios:JOINERY_LEVELS.map(level=>level.id),
  create:scenario=>createConstellation('forms',scenario),observe:formsObservation,step:formsStep,
  status:raw=>(raw as ConstellationState).goal!.status,
  preview:(raw,action)=>formsObservation(formsStep(raw,action)),
};
const relations:LogicalGame={id:'relations',version:RELATIONS_VERSION,scenarios:relationScenarios.map(scenario=>scenario.id),
  create:(scenario,seed)=>createRelations(scenario,seed),observe:raw=>observeRelations(raw as RelationsState),
  step:(raw,action)=>stepRelations(raw as RelationsState,action as RelationsAction),status:raw=>(raw as RelationsState).status,
  preview:(raw,action)=>inspectRelations(raw as RelationsState,action as RelationsAction),
};
const laboratory:LogicalGame={id:'laboratory',version:LAB_VERSION,scenarios:[...LAB_SCENARIO_IDS],
  create:(scenario,seed)=>createLaboratory(scenario,seed),observe:raw=>observeLaboratory(raw as LaboratoryState),
  step:(raw,action)=>{const next=stepLaboratory(raw as LaboratoryState,action as LaboratoryAction);if(next.feedback.kind==='invalid')throw new Error(next.feedback.message);return next;},
  status:raw=>(raw as LaboratoryState).status,
};
const relations2:LogicalGame={id:'relations2',version:RELATIONS2_VERSION,scenarios:relation2Scenarios.map(scenario=>scenario.id),
  create:(scenario,seed)=>createRelations2(scenario,seed),observe:raw=>observeRelations2(raw as Relations2State),
  step:(raw,action)=>stepRelations2(raw as Relations2State,action as Relations2Action),status:raw=>(raw as Relations2State).status,
  preview:(raw,action)=>inspectRelations2(raw as Relations2State,action as Relations2Action),
};
const progression:LogicalGame={id:'progression',version:PROGRESSION_VERSION,scenarios:['sequence'],
  create:createProgression,observe:raw=>observeProgression(raw as ProgressionState),
  step:(raw,action)=>stepProgression(raw as ProgressionState,action as Relations2Action),status:raw=>(raw as ProgressionState).status,
  preview:(raw,action)=>observeProgression(stepProgression(raw as ProgressionState,action as Relations2Action)),
};
const process:LogicalGame={id:'process',version:PROCESS_VERSION,scenarios:PROCESS_SCENARIO_IDS,
  create:createProcess,observe:raw=>observeProcess(raw as ProcessState),step:(raw,action)=>stepProcess(raw as ProcessState,action as ProcessAction),
  status:raw=>(raw as ProcessState).status,preview:(raw,action)=>previewProcess(raw as ProcessState,action as ProcessAction),
  decisionDomain:{actions:raw=>legalProcessActions(raw as ProcessState),step:(raw,action)=>stepProcess(raw as ProcessState,action as ProcessAction),key:raw=>processSemanticKey(raw as ProcessState),terminal:raw=>(raw as ProcessState).status!=='playing',
    ending:raw=>{const result=processOutcome(raw as ProcessState);return {key:result.semanticKey,feasible:result.status==='won',objectives:result.objectives.map(value=>({id:value.id,value:value.value,direction:value.direction==='higher'?'max' as const:'min' as const})),meaning:result};}},
};
const constitution:LogicalGame={id:'constitution',version:CONSTITUTION_VERSION,scenarios:[...constitutionScenarios],
  create:createConstitution,observe:raw=>observeConstitution(raw as ConstitutionState),step:(raw,action)=>stepConstitution(raw as ConstitutionState,action as ConstitutionAction),status:raw=>(raw as ConstitutionState).status,
  preview:(raw,action)=>previewConstitution(raw as ConstitutionState,action as ConstitutionAction),
  decisionDomain:{actions:raw=>constitutionActions(raw as ConstitutionState),step:(raw,action)=>stepConstitution(raw as ConstitutionState,action as ConstitutionAction),key:raw=>constitutionKey(raw as ConstitutionState),terminal:raw=>(raw as ConstitutionState).status!=='playing',
    ending:raw=>{const result=constitutionProfile(raw as ConstitutionState);return {key:JSON.stringify(result.consequences),feasible:result.feasible,objectives:result.dimensions,meaning:result};}},
};
const bell:LogicalGame={id:'bell',version:BELL_VERSION,scenarios:BELL_SCENARIO_IDS,
  create:createBellOrchard,observe:raw=>observeBellOrchard(raw as BellState),step:(raw,action)=>stepBellOrchard(raw as BellState,action as BellAction),status:raw=>(raw as BellState).status,
  preview:(raw,action)=>previewBellOrchard(raw as BellState,action as BellAction),
  decisionDomain:{actions:raw=>legalBellActions(raw as BellState),step:(raw,action)=>stepBellOrchard(raw as BellState,action as BellAction),key:raw=>bellSemanticKey(raw as BellState),terminal:raw=>(raw as BellState).status==='won',
    ending:raw=>{const result=bellOutcome(raw as BellState);return {key:JSON.stringify(result.properties),feasible:result.properties.orchardSafe,objectives:[{id:'initial-orchard-aim',value:Number(result.properties.orchardSafe),direction:'max'}],meaning:result};}},
};
const mneme:LogicalGame={id:'mneme',version:MNEME_VERSION,scenarios:[...mnemeScenarios],
  create:createMneme,observe:raw=>observeMneme(raw as MnemeState),step:(raw,action)=>stepMneme(raw as MnemeState,action as MnemeAction),status:raw=>(raw as MnemeState).status,
  preview:(raw,action)=>previewMneme(raw as MnemeState,action as MnemeAction),
  decisionDomain:{actions:raw=>mnemeActions(raw as MnemeState),step:(raw,action)=>stepMneme(raw as MnemeState,action as MnemeAction),key:raw=>mnemeKey(raw as MnemeState),terminal:raw=>(raw as MnemeState).phase==='finished',canStop:raw=>(raw as MnemeState).baselineAchieved,
    ending:raw=>{const result=mnemeProfile(raw as MnemeState);return {key:JSON.stringify(result.consequences),feasible:result.feasible,objectives:result.dimensions,meaning:result};}},
};
const bell2:LogicalGame={id:'bell2',version:BELL2_VERSION,scenarios:BELL2_SCENARIO_IDS,
  create:createBellOrchard2,observe:raw=>observeBellOrchard2(raw as Bell2State),step:(raw,action)=>stepBellOrchard2(raw as Bell2State,action as BellAction),status:raw=>(raw as Bell2State).status,
  preview:(raw,action)=>previewBellOrchard2(raw as Bell2State,action as BellAction),
  decisionDomain:{actions:raw=>legalBellActions2(raw as Bell2State),step:(raw,action)=>stepBellOrchard2(raw as Bell2State,action as BellAction),key:raw=>bellSemanticKey2(raw as Bell2State),terminal:raw=>(raw as Bell2State).status==='won',
    ending:raw=>{const result=bellOutcome2(raw as Bell2State);return {key:JSON.stringify(result.properties),feasible:result.properties.orchardSafe,objectives:[{id:'initial-orchard-aim',value:Number(result.properties.orchardSafe),direction:'max'}],meaning:result};}},
};
const mneme2:LogicalGame={id:'mneme2',version:MNEME2_VERSION,scenarios:[...mneme2Scenarios],
  create:createMneme2,observe:raw=>observeMneme2(raw as Mneme2State),step:(raw,action)=>stepMneme2(raw as Mneme2State,action as MnemeAction),status:raw=>(raw as Mneme2State).status,
  preview:(raw,action)=>previewMneme2(raw as Mneme2State,action as MnemeAction),
  decisionDomain:{actions:raw=>mneme2Actions(raw as Mneme2State),step:(raw,action)=>stepMneme2(raw as Mneme2State,action as MnemeAction),key:raw=>mneme2Key(raw as Mneme2State),terminal:raw=>mneme2Profile(raw as Mneme2State).terminal,canStop:raw=>(raw as Mneme2State).baselineAchieved,
    ending:raw=>{const result=mneme2Profile(raw as Mneme2State);return {key:JSON.stringify(result.consequences),feasible:result.feasible,objectives:result.dimensions,meaning:result};}},
};
const confluence:LogicalGame={id:'confluence',version:CONFLUENCE_VERSION,scenarios:CONFLUENCE_SCENARIO_IDS,
  create:createConfluence,observe:raw=>({...observeConfluence(raw as ConfluenceState),inspect:'Use rules SESSION and actions SESSION [JSON_FILTER] in the public CLI. All legal combinations are available; suggestions are only a shortlist.'}),
  step:(raw,action)=>stepConfluence(raw as ConfluenceState,action as ConfluenceAction),status:raw=>(raw as ConfluenceState).status,
  preview:(raw,action)=>previewConfluence(raw as ConfluenceState,action as ConfluenceAction),rules:confluenceRulesObservation,actions:raw=>legalConfluenceActions(raw as ConfluenceState),
};
const field:LogicalGame={id:'field',version:FIELD_VERSION,scenarios:CONFLUENCE_SCENARIO_IDS,
  create:createField,observe:raw=>observeField(raw as FieldState),step:(raw,action)=>stepField(raw as FieldState,action as ConfluenceAction),
  status:raw=>(raw as FieldState).world.status,preview:(raw,action)=>previewField(raw as FieldState,action as ConfluenceAction),rules:fieldRules,
  actions:raw=>[...fieldAvailability(raw as FieldState),...legalConfluenceActions((raw as FieldState).world).filter(action=>action.type==='finish')],
};
const imprints:LogicalGame={id:'imprints',version:IMPRINT_VERSION,scenarios:IMPRINT_SCENARIOS,
  create:createImprints,observe:raw=>({...observeImprints(raw as ImprintState),inspect:'Use rules SESSION and actions SESSION [JSON_FILTER] in the public CLI. Every current pair and place catalyst is available.'}),
  step:(raw,action)=>stepImprints(raw as ImprintState,action as ImprintAction),status:raw=>(raw as ImprintState).status,
  preview:(raw,action)=>previewImprints(raw as ImprintState,action as ImprintAction),rules:imprintsRules,actions:raw=>imprintsActions(raw as ImprintState),
};
const resonance:LogicalGame={id:'resonance',version:RESONANCE_VERSION,scenarios:RESONANCE_SCENARIOS,
  create:createResonance,observe:raw=>({...observeResonance(raw as ResonanceState),inspect:'Use rules SESSION, actions SESSION [JSON_FILTER], and one-action preview in the public CLI.'}),
  step:(raw,action)=>stepResonance(raw as ResonanceState,action as ResonanceAction),status:raw=>(raw as ResonanceState).status,
  preview:(raw,action)=>previewResonance(raw as ResonanceState,action as ResonanceAction),rules:resonanceRules,actions:raw=>resonanceActions(raw as ResonanceState),
};
const frontier:LogicalGame={id:'frontier',version:FRONTIER_VERSION,scenarios:FRONTIER_SCENARIOS,
  create:createFrontier,observe:raw=>({...observeFrontier(raw as FrontierState),inspect:'Public CLI: rules SESSION; actions SESSION [JSON_FILTER]; preview SESSION JSON_ACTION. The other lineage’s announced action is part of the public state.'}),
  step:(raw,action)=>stepFrontier(raw as FrontierState,action as FrontierAction),status:raw=>statusFrontier(raw as FrontierState),
  preview:(raw,action)=>previewFrontier(raw as FrontierState,action as FrontierAction),rules:frontierRules,actions:raw=>frontierActions(raw as FrontierState),
};
const faculties:LogicalGame={id:'faculties',version:FACULTIES_VERSION,scenarios:FACULTIES_SCENARIOS,
  create:createFaculties,observe:raw=>({...observeFaculties(raw as FacultiesState),
    actionSchema:{type:'combine | wait | finish',a:'concept, trace ID or faculty ID',b:'concept, trace ID or faculty ID',at:'place ID',toward:'Earth+Water only: east/south/split/closed'},
    inspect:'Public CLI: rules SESSION; actions SESSION [JSON_FILTER]; preview SESSION JSON_ACTION. Source traces, live composition sites and maker bindings are public state.'}),
  step:(raw,action)=>stepFaculties(raw as FacultiesState,action as FacultiesAction),status:raw=>(raw as FacultiesState).status,
  preview:(raw,action)=>previewFaculties(raw as FacultiesState,action as FacultiesAction),rules:facultiesRules,actions:raw=>facultiesActions(raw as FacultiesState),
};
export const LOGICAL_GAMES:Record<string,LogicalGame>={forms,relations,relations2,progression,laboratory,process,constitution,bell,mneme,bell2,mneme2,confluence,field,imprints,resonance,frontier,faculties};

export interface LogicalDecision {
  index:number;action:unknown;prediction?:unknown;before:string;after:string;observation:unknown;
  atMs?:number;
  phase?:'assigned'|'elective';
}
export interface LogicalRun {
  schema:1;id:string;game:string;version:string;scenario:string;seed:number;condition:string;
  initialObservation:unknown;decisions:LogicalDecision[];attempts:{decisionIndex:number;action:unknown;error:string}[];
  protocolVersion?:string;previews?:{decisionIndex:number;action:unknown;result:unknown;phase?:'assigned'|'elective';recordedAt?:string}[];
  startedAt?:string;report?:Record<string,unknown>;
  checkpoints?:{decisionIndex:number;reason:string}[];
  continuation?:ContinuationChoice;continuations?:ContinuationChoice[];
  electiveOrigin?:{run:string;decisionIndex:number;recordedAt:string};
  queries?:{decisionIndex:number;kind:string;query?:unknown;phase:'assigned'|'elective';recordedAt:string}[];
  notes?:{decisionIndex:number;account:Record<string,unknown>;recordedAt:string}[];
}
export interface ContinuationChoice {decisionIndex:number;intention:string;source:string;nextSession?:string;recordedAt?:string}
export function createLogicalRun(game:LogicalGame,id:string,scenario:string,seed:number,condition:string):LogicalRun {
  if(!game.scenarios.includes(scenario))throw new Error('Choose a public scenario.');
  const state=game.create(scenario,seed);
  return {schema:1,id,game:game.id,version:game.version,scenario,seed,condition,protocolVersion:'logical-cli-5',startedAt:new Date().toISOString(),initialObservation:game.observe(state),decisions:[],attempts:[],previews:[],checkpoints:[],continuations:[]};
}
export function replayLogical(run:LogicalRun):unknown {
  const game=LOGICAL_GAMES[run.game];if(run.schema!==1||!game||game.version!==run.version)throw new Error('Unsupported logical game version.');
  let state=game.create(run.scenario,run.seed);
  if(JSON.stringify(game.observe(state))!==JSON.stringify(run.initialObservation))throw new Error('Initial observation changed.');
  for(const [index,decision]of run.decisions.entries()){
    if(decision.index!==index||decision.before!==logicalHash(state))throw new Error(`Replay diverged before decision ${index}.`);
    state=game.step(state,decision.action);
    if(decision.after!==logicalHash(state)||JSON.stringify(game.observe(state))!==JSON.stringify(decision.observation))throw new Error(`Replay diverged after decision ${index}.`);
  }
  return state;
}
export function logicalAct(run:LogicalRun,action:unknown,prediction?:unknown):{run:LogicalRun;state:unknown}{
  const game=LOGICAL_GAMES[run.game],before=replayLogical(run),state=game.step(before,action),next=structuredClone(run);
  next.decisions.push({index:run.decisions.length,action:structuredClone(action),...(prediction===undefined?{}:{prediction:structuredClone(prediction)}),...(run.startedAt?{atMs:Math.max(0,Date.now()-Date.parse(run.startedAt))}:{}),phase:run.continuation&&run.decisions.length>=run.continuation.decisionIndex?'elective':'assigned',before:logicalHash(before),after:logicalHash(state),observation:game.observe(state)});
  return {run:next,state};
}
