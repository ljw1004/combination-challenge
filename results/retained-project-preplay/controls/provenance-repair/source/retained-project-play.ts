import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  catalogueRetainedProject, createRetainedProject, inspectRetainedProject, observeRetainedProject,
  partnersRetainedProject, previewRetainedProject, selectRetainedProject, stepRetainedProject, undoRetainedProject, retainedProjectGoals,
} from './logical-retained-project.ts';
import type { CreateOptions, State } from './retained-project-types.ts';

/** Public adapter only: no witness, policy, solution, or automatic action selection. */
export const RETAINED_PROJECT_PROTOCOL = 'retained-project-cli-1';
export const RETAINED_PROJECT_CAPTURE_DIRECTORY = 'results/retained-project-players';
export const hashRetainedRecord = (value: unknown): string => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const serializeRetainedOutput = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const sources = {
  engine: './logical-retained-project.ts', content: './retained-project-content.ts', types: './retained-project-types.ts',
  adapter: './retained-project-play.ts', transformations: './retained-project-transformations.ts', publicGuide:'../docs/retained-project.md',
  evaluationProtocol: '../docs/long-play-evaluation-protocol.md',

};
export function retainedSourceHashes(): Record<string, string> {
  return Object.fromEntries(Object.entries(sources).map(([name, file]) => [name,
    createHash('sha256').update(readFileSync(new URL(file, import.meta.url))).digest('hex')]));
}
// A long-lived caller must not label cached engine code with newly edited source bytes.
const loadedSourceHashes = retainedSourceHashes();

export const RETAINED_PUBLIC_INTERFACE = {
  commands: {
    init: 'init ID [ordinary|complete|OPTIONS_JSON] METADATA_JSON — start a new capture; default ordinary; metadata records the exact assignment and participant',
    view: 'view ID — compact current board, objects, and goal progress',
    goals: 'goals ID — full public requirements, checks, rows, and completion modes for the current board',
    campaign: 'campaign ID — full public goal cards and progress across all available boards',
    inspect: 'inspect ID [object/design/place ID] — public detail; omit the operand for full current world/rules; use cli for this guide',
    catalogue: 'catalogue ID [SECTION|all] — index every public section by default; explicitly read a full section or all. No section is hidden.',
    sections: 'sections ID SOURCE — list every available section and exact line counts for catalogue, world, goals, view, or inspect:PUBLIC_ID',
    chunk: 'chunk ID SOURCE SECTION START COUNT — exact 1-based lossless JSON line slice; SECTION all includes the full source; count is 1–200. Returns total/hash/nextStart; every chunk is captured.',
    partners: 'partners ID OPERAND — compatible recipes and contextual operations; not a recommended plan',
    preview: 'preview ID ACTION_JSON [DETAIL_ID] — exact single-action forecast; optional world/object/place detail of the predicted result',
    combine: 'combine ID ACTION_JSON — select and commit one combination; act is an alias',
    select: 'select ID MAP_ID — visit another retained board, without a game intervention',
    undo: 'undo ID — undo the latest still-applied accepted combination under the public editing rules',
    checkpoint: 'checkpoint ID REPORT_JSON — record the exact question/response or current intention',
    report: 'report ID REPORT_JSON — record a remark, report, choice, or technical interruption verbatim',
    finish: 'finish ID [REPORT_JSON] — stop whenever you choose, whether complete or not',
    verify: 'verify ID — read-only capture, source-freeze, and deterministic-replay verification',
  },
  action: { type: 'combine', a: 'actual operand', b: 'actual operand', context: 'optional public operation/at/channel/direction/part/toolPart/recipe/via fields' },
  transforms: 'Use context.operation transform with selected material and catalyst operands; context.part selects a material leaf, context.toolPart selects a form/record tool part, and context.recipe selects a disclosed compatible process when needed. A fit operation combines an actual formed surface with a matching place; inspect exposes exact requirements, local traits, form, provenance and actual events.',
  normalOutput: 'Committed actions and previews show concise changed objects, learned designs, and current-board goal progress. Full public observations and deterministic states remain in the capture. Use goals, campaign, inspect, catalogue, or partners for unrestricted public detail.',
  operands: 'Known design IDs, actual object IDs o:N, and places place:ID are distinct. Inspect or query partners for their public conditions.',
  undo: 'Editing undo restores the physical boards, records, achievements, and engine counters from before the latest still-applied accepted combination, using the engine editing operation. Learned capabilities and saved designs remain known, the current map stays selected, and the identity serial never decreases. Queries, rejected actions, and navigation do not add undo entries. Repeated undo walks accepted combinations backward; a new accepted combination branches from the edited state. There is no redo. The append-only session evidence and cumulative workload counts are never erased, and undo is counted separately, not as a combination.',
  attribution: 'A trailing --actor=player or --actor=operator explicitly attributes a recorded command; otherwise the session metadata actor is used (default player). This does not change game behavior. Operator actions are not counted as player combinations.',
  movement: 'Optional context.via lists public place IDs as waypoints for a chosen route. The entire submitted journey is one combination, not one intervention per traversed edge.',
  queries: 'Inspection, catalogue, partners, view, and preview are world-read-only. Their delivered observations are captured and counted separately from gameplay. No catalogue or preview sweep is performed automatically.',
  stopping: 'You may finish early or after completion. Reporting and public queries remain available after finishing; further gameplay, navigation, and undo do not.',
} as const;

type Actor = 'player' | 'operator';
export interface RetainedMetadata {
  protocol: string;
  id: string;
  sourceHashes: Record<string, string>;
  engineVersion: string;
  runtime: { node: string; platform: string; architecture: string };
  supplied: Record<string, unknown>;
  setup: { options: CreateOptions; initialStateHash: string; initialMap: string; offeredMaps: string[] };
  actor: Actor;
}
export type RetainedEventKind = 'init' | 'gameplay' | 'query' | 'navigation' | 'undo' | 'reporting' | 'finish' | 'interface-error';
export interface RetainedCaptureEvent {
  seq: number;
  at: string;
  command: string;
  /** Exact argument strings as submitted to the CLI, including malformed requests. */
  arguments: string[];
  actor: Actor;
  metadata?: RetainedMetadata;
  previousEventHash: string | null;
  beforeHash: string | null;
  afterHash: string;
  kind: RetainedEventKind;
  accepted?: boolean;
  undoneEventSeq?: number;
  finished: boolean;
  /** Full exact engine evidence, retained independently of concise stdout. */
  evidence: { observation: ReturnType<typeof observeRetainedProject>; state?: State; preview?: ReturnType<typeof previewRetainedProject>; publicSource?:unknown };
  /** Exact bytes written to stdout. */
  delivered: string;
  eventHash: string;
}
export interface RetainedWorkload {
  gameAttempts: number;
  acceptedCombines: number;
  acceptedPlayerCombines: number;
  acceptedOperatorCombines: number;
  rejectedGameAttempts: number;
  queries: number;
  navigation: number;
  undoCommands: number;
  successfulUndos: number;
  reporting: number;
  administrative: number;
  invalidCommands: number;
  automaticBeats: number;
}
interface HistoryEntry { seq: number; state: State }
interface Runtime { state: State; finished: boolean; history: HistoryEntry[] }
interface Transition extends Runtime { output: unknown; preview?:ReturnType<typeof previewRetainedProject>; publicSource?:unknown; kind: RetainedEventKind; accepted?: boolean; undoneEventSeq?: number }
function object(value: unknown, message = 'Expected a JSON object.'): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(message);
}
function nonempty(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(message);
}
function validateSupplied(value: unknown): asserts value is Record<string, unknown> {
  object(value, 'Initialization requires metadata with the exact public assignment and actual participant.');
  nonempty(value.publicPrompt, 'Record the exact public assignment in metadata.publicPrompt.');
  object(value.participant, 'Record actual participant metadata, not an invented identity.');
  nonempty(value.participant.id, 'Record the actual participant identifier in metadata.participant.id.');
  nonempty(value.participant.kind, 'Record metadata.participant.kind (for example agent or mechanical test).');
  nonempty(value.condition, 'Record the actual session condition in metadata.condition.');
  if (!(typeof value.exposureHistory === 'string' && value.exposureHistory.trim())
    && !(Array.isArray(value.exposureHistory) && value.exposureHistory.every(item => typeof item === 'string'))) {
    throw new Error('Record actual exposure history as metadata.exposureHistory (text or an explicit array).');
  }
  if (value.actor !== undefined && value.actor !== 'player' && value.actor !== 'operator') throw new Error('Metadata actor must be player or operator.');
}
function validateOptions(value: unknown): asserts value is CreateOptions {
  object(value, 'Setup must be ordinary, complete, or a JSON CreateOptions object.');
  if (Object.keys(value).some(key => !['catalogue', 'known', 'designs'].includes(key))) throw new Error('Unknown setup option.');
  if (value.catalogue !== undefined && value.catalogue !== 'ordinary' && value.catalogue !== 'complete') throw new Error('Catalogue must be ordinary or complete.');
  if (value.known !== undefined && (!Array.isArray(value.known) || !value.known.every(id => typeof id === 'string'))) throw new Error('Known designs must be an array of IDs.');
  if (value.designs !== undefined && !Array.isArray(value.designs)) throw new Error('Saved designs must be an array.');
}
function parseInit(args: string[]): { options: CreateOptions; supplied: Record<string, unknown> } {
  if (args.length < 1 || args.length > 2) throw new Error('init ID [ordinary|complete|OPTIONS_JSON] METADATA_JSON. Omitted setup defaults to ordinary.');
  const setup = args.length === 2 ? args[0] : 'ordinary';
  const options: unknown = setup === 'ordinary' || setup === 'complete' ? { catalogue: setup } : JSON.parse(setup);
  validateOptions(options);
  const supplied: unknown = JSON.parse(args.at(-1)!);
  validateSupplied(supplied);
  return { options, supplied };
}
function splitActor(args: string[], fallback: Actor = 'player'): { args: string[]; actor: Actor } {
  const flag = args.at(-1);
  if (flag === '--actor=player' || flag === '--actor=operator') return { args: args.slice(0, -1), actor: flag.slice('--actor='.length) as Actor };
  return { args, actor: fallback };
}
function noArgs(args: string[]): void { if (args.length) throw new Error('This command takes no additional arguments.'); }
function oneArg(args: string[]): string {
  if (args.length !== 1) throw new Error('This command requires exactly one argument.');
  return args[0];
}
function reportArg(args: string[], optional = false): unknown {
  if (optional && !args.length) return null;
  const parsed: unknown = JSON.parse(oneArg(args));
  object(parsed, 'Reports must be JSON objects; preserve exact question/response text in their fields.');
  return parsed;
}
/** Public summaries do not replace or alter the exact engine evidence. */
const goalSummary=(state:State)=>{const goals=retainedProjectGoals(state);return {satisfied:goals.filter(g=>g.satisfied).length,total:goals.length,current:goals.filter(g=>g.current).length,earned:goals.filter(g=>g.achieved).length};};
const goalProgress=(state:State)=>retainedProjectGoals(state).map(g=>({id:g.id,current:g.current,achieved:g.achieved,satisfied:g.satisfied,checks:g.checks}));
export function compactRetainedView(state: State) {
  const full=observeRetainedProject(state);
  return {map:full.map,status:full.status,interventions:full.interventions,goalSummary:goalSummary(state),objects:full.objects,connections:full.connections,spans:full.spans,received:full.received};
}
function compactDelta(before:State,after:State) {
 const prior=observeRetainedProject(before),view=compactRetainedView(after),oldGoals=goalProgress(before);
 const beforeObjects=before.boards.find(b=>b.id===after.map)?.objects??[],afterObjects=after.boards.find(b=>b.id===after.map)?.objects??[];
 return {map:view.map,status:view.status,interventions:view.interventions,goalSummary:view.goalSummary,
 goalChanges:goalProgress(after).filter(g=>!same(g,oldGoals.find(old=>old.id===g.id))),
 objects:view.objects.filter(item=>!same(afterObjects.find(o=>o.id===item.id),beforeObjects.find(o=>o.id===item.id))),
 removedObjects:prior.objects.filter(item=>!view.objects.some(next=>next.id===item.id)).map(item=>item.id),learned:after.known.filter(id=>!before.known.includes(id)),
 ...(same(view.connections,prior.connections)?{}:{connections:view.connections}),...(same(view.spans,prior.spans)?{}:{spans:view.spans}),...(same(view.received,prior.received)?{}:{received:view.received})};
}
function publicSource(state:State,name:string):unknown {
 if(name==='catalogue')return catalogueRetainedProject(state);
 if(name==='world')return inspectRetainedProject(state);
 if(name==='goals')return retainedProjectGoals(state);
 if(name==='view')return observeRetainedProject(state);
 if(name.startsWith('inspect:'))return inspectRetainedProject(state,name.slice(8));
 throw Error('SOURCE must be catalogue, world, goals, view, or inspect:PUBLIC_ID.');
}
function sectionValue(source:unknown,key:string):unknown {
 if(key==='all')return source;
 if(!source||typeof source!=='object'||Array.isArray(source)||!Object.hasOwn(source,key))throw Error('Unknown section. Use sections to list all public fields.');
 return (source as Record<string,unknown>)[key];
}
function sourceIndex(source:unknown,name:string) {
 const keys=source&&typeof source==='object'&&!Array.isArray(source)?Object.keys(source):[];
 return {source:name,sections:['all',...keys].map(section=>{const value=sectionValue(source,section),bytes=serializeRetainedOutput(value);return {section,lines:bytes.trimEnd().split('\n').length,sha256:createHash('sha256').update(bytes).digest('hex')};}),help:'Read catalogue ID SECTION, or chunk ID SOURCE SECTION START COUNT. No fields are omitted from this index. Chunks are lossless, recorded public queries; use nextStart until null.'};
}
function initialOutput(state:State) {
  return { protocol:RETAINED_PROJECT_PROTOCOL, observation:compactRetainedView(state),
    maps:state.boards.map(board => board.id),
    help:'Use goals for complete requirements, catalogue for its section index, sections/chunk for lossless public detail, inspect for rules/world/parts, and inspect ID cli for command syntax. All rules and exact previews are public. You may stop whenever you choose.' };
}
function evidenceFor(state:State, command:string, preview?:ReturnType<typeof previewRetainedProject>, publicSource?:unknown):RetainedCaptureEvent['evidence'] {
  return { observation:observeRetainedProject(state),
    ...(['init','combine','act','undo'].includes(command) ? {state} : {}), ...(preview ? {preview} : {}),...(publicSource===undefined?{}:{publicSource}) };
}
function transition(command: string, args: string[], runtime: Runtime, seq: number): Transition {
  const { state: before, finished, history } = runtime;
  let state = before;
  try {
    if (finished && ['combine', 'act', 'select', 'undo', 'finish'].includes(command)) throw new Error('Session finished; public queries and reports remain available, but gameplay cannot resume in this capture.');
    if (command === 'view') { noArgs(args); return { ...runtime, output: compactRetainedView(state), kind: 'query' }; }
    if (command === 'goals') { noArgs(args); return {...runtime, output:retainedProjectGoals(state), kind:'query'}; }
    if (command === 'campaign') { noArgs(args); return {...runtime, output:state.boards.map(board => ({map:board.id,goals:retainedProjectGoals(state,board.id)})), kind:'query'}; }
    if (command === 'inspect') {
      if (args.length > 1) throw new Error('inspect takes at most one public ID.');
      return { ...runtime, output: args[0] === 'cli' ? RETAINED_PUBLIC_INTERFACE : inspectRetainedProject(state, args[0]), kind: 'query' };
    }
    if(command==='catalogue'){if(args.length>1)throw Error('catalogue takes at most a section name or all.');const full=catalogueRetainedProject(state);return {...runtime,output:args[0]?sectionValue(full,args[0]):sourceIndex(full,'catalogue'),publicSource:full,kind:'query'};}
    if(command==='sections'){const name=oneArg(args),full=publicSource(state,name);return {...runtime,output:sourceIndex(full,name),publicSource:full,kind:'query'};}
    if(command==='chunk'){
      if(args.length!==4)throw Error('chunk requires SOURCE SECTION START COUNT.');const [name,key,startText,countText]=args,start=Number(startText),count=Number(countText);
      if(!Number.isSafeInteger(start)||start<1||!Number.isSafeInteger(count)||count<1||count>200)throw Error('START is 1-based; COUNT must be an integer from 1 to 200.');
      const full=publicSource(state,name),value=sectionValue(full,key),bytes=serializeRetainedOutput(value),lines=bytes.slice(0,-1).split('\n');if(start>lines.length)throw Error('START exceeds total lines.');const end=Math.min(lines.length,start+count-1);
      return {...runtime,output:{source:name,section:key,start,end,totalLines:lines.length,nextStart:end<lines.length?end+1:null,sha256:createHash('sha256').update(bytes).digest('hex'),content:lines.slice(start-1,end).join('\n')+'\n'},publicSource:full,kind:'query'};
    }
    if (command === 'partners') return { ...runtime, output: partnersRetainedProject(state, oneArg(args)), kind: 'query' };
    if (command === 'preview') {
      if (args.length < 1 || args.length > 2) throw new Error('preview takes ACTION_JSON and an optional public inspection ID (for example world).');
      const forecast = previewRetainedProject(state, JSON.parse(args[0]));
      // The forecast is exact, but the private replay representation is not a default UI dump.
      const output = { accepted: forecast.accepted, response: forecast.response, observation: compactDelta(state,forecast.state), stateHash: hashRetainedRecord(forecast.state),
        ...(args[1] === undefined ? {} : { inspection: inspectRetainedProject(forecast.state, args[1]) }) };
      return { ...runtime, output, preview:forecast, kind: 'query' };
    }
    if (command === 'combine' || command === 'act') {
      state = stepRetainedProject(before, JSON.parse(oneArg(args)));
      return { state, finished, history: state.accepted ? [...history, { seq, state: before }] : history,
        output: { accepted: state.accepted, response: state.response, observation: compactDelta(before,state) }, kind: 'gameplay', accepted: state.accepted };
    }
    if (command === 'select') {
      state = selectRetainedProject(before, oneArg(args));
      return { state, finished, history, output: compactRetainedView(state), kind: 'navigation' };
    }
    if (command === 'undo') {
      noArgs(args);
      const previous = history.at(-1);
      if (!previous) return { ...runtime, output: { undone: false, reason: 'No accepted combination remains to undo.' }, kind: 'undo', accepted: false };
      state = undoRetainedProject(previous.state, before);
      return { state, finished, history: history.slice(0, -1), output: { undone: true, revertedEvent: previous.seq, observation: compactDelta(before,state) },
        kind: 'undo', accepted: true, undoneEventSeq: previous.seq };
    }
    if (command === 'checkpoint' || command === 'report') {
      reportArg(args);
      return { ...runtime, output: { recorded: true }, kind: 'reporting' };
    }
    if (command === 'finish') {
      const report = reportArg(args, true);
      return { ...runtime, finished: true, output: { finished: true, outcome: state.status === 'complete' ? 'completed' : 'early-stop', report, observation: compactRetainedView(state) }, kind: 'finish' };
    }
    throw new Error('Unknown command. Use inspect ID cli for the public command guide.');
  } catch (error) {
    // Failed syntax/requests are evidence too. No engine state is committed on an exception.
    return { ...runtime, output: { error: error instanceof Error ? error.message : String(error), accepted: false }, kind: 'interface-error', accepted: false };
  }
}
function seal(event: Omit<RetainedCaptureEvent, 'eventHash'>): RetainedCaptureEvent { return { ...event, eventHash: hashRetainedRecord(event) }; }
function workload(events: RetainedCaptureEvent[]): RetainedWorkload {
  const counts: RetainedWorkload = { gameAttempts: 0, acceptedCombines: 0, acceptedPlayerCombines: 0, acceptedOperatorCombines: 0,
    rejectedGameAttempts: 0, queries: 0, navigation: 0, undoCommands: 0, successfulUndos: 0, reporting: 0, administrative: 0, invalidCommands: 0, automaticBeats: 0 };
  for (const event of events) {
    if (event.kind === 'interface-error') counts.invalidCommands++;
    if (event.command === 'combine' || event.command === 'act') {
      counts.gameAttempts++;
      if (event.kind === 'gameplay' && event.accepted) { counts.acceptedCombines++; counts[event.actor === 'player' ? 'acceptedPlayerCombines' : 'acceptedOperatorCombines']++; }
      else counts.rejectedGameAttempts++;
    } else if (['view', 'goals', 'campaign', 'inspect', 'catalogue', 'partners', 'preview','sections','chunk'].includes(event.command)) counts.queries++;
    else if (event.command === 'select') counts.navigation++;
    else if (event.command === 'undo') { counts.undoCommands++; if (event.kind === 'undo' && event.accepted) counts.successfulUndos++; }
    else if (event.command === 'report' || event.command === 'checkpoint') counts.reporting++;
    else if (event.command === 'init' || event.command === 'finish') counts.administrative++;
  }
  return counts;
}
function replayCapture(events: RetainedCaptureEvent[], hashes: Record<string, string>) {
  if (!events.length) throw new Error('Empty capture.');
  const metadata = events[0].metadata;
  if (!metadata || metadata.protocol !== RETAINED_PROJECT_PROTOCOL || !same(metadata.sourceHashes, hashes)) throw new Error('Source/protocol freeze mismatch; preserve this capture and use its frozen source.');
  validateSupplied(metadata.supplied);
  validateOptions(metadata.setup.options);
  if (metadata.actor !== (metadata.supplied.actor ?? 'player')) throw new Error('Participant actor mismatch.');
  const initial = createRetainedProject(metadata.setup.options);
  if (metadata.engineVersion !== initial.version || metadata.setup.initialStateHash !== hashRetainedRecord(initial)
    || metadata.setup.initialMap !== initial.map || !same(metadata.setup.offeredMaps, initial.boards.map(board => board.id))) throw new Error('Initial setup mismatch.');
  let runtime: Runtime = { state: initial, finished: false, history: [] };
  for (const [index, event] of events.entries()) {
    const { eventHash, ...unsigned } = event;
    if (event.seq !== index || eventHash !== hashRetainedRecord(unsigned)
      || event.previousEventHash !== (index ? events[index - 1].eventHash : null)) throw new Error(`Broken event integrity at ${index}.`);
    if (typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) throw new Error(`Invalid event timestamp at ${index}.`);
    const attributed = splitActor(event.arguments, metadata.actor);
    if (event.actor !== attributed.actor || event.beforeHash !== (index ? hashRetainedRecord(runtime.state) : null)) throw new Error(`Before-state/actor mismatch at ${index}.`);
    let next: Transition;
    if (!index) {
      if (event.command !== 'init') throw new Error('First event must be initialization.');
      const parsed = parseInit(attributed.args);
      if (!same(parsed.options, metadata.setup.options) || !same(parsed.supplied, metadata.supplied)) throw new Error('Initial arguments/metadata mismatch.');
      next = { ...runtime, output: initialOutput(initial), kind: 'init' };
    } else {
      if (event.metadata) throw new Error(`Unexpected metadata replacement at ${index}.`);
      next = transition(event.command, attributed.args, runtime, index);
    }
    if (event.afterHash !== hashRetainedRecord(next.state) || event.finished !== next.finished || event.kind !== next.kind
      || event.accepted !== next.accepted || event.undoneEventSeq !== next.undoneEventSeq || event.delivered !== serializeRetainedOutput(next.output)
      || !same(event.evidence,evidenceFor(next.state,event.command,next.preview,next.publicSource))) {
      throw new Error(`Deterministic state/output replay mismatch at ${index}.`);
    }
    runtime = { state: next.state, finished: next.finished, history: next.history };
  }
  return { runtime, metadata, counts: workload(events) };
}
/** Exact replay validates each delivered output, not merely the final accepted action list. Never writes. */
export function verifyRetainedCapture(events: RetainedCaptureEvent[], hashes = retainedSourceHashes()) {
  if(!same(hashes,loadedSourceHashes)) throw new Error('Source/protocol freeze mismatch; verifier code must match its loaded source.');
  const { runtime, counts, metadata } = replayCapture(events, hashes);
  return { verified: true, protocol: RETAINED_PROJECT_PROTOCOL, id: metadata.id, events: events.length,
    headHash: events.at(-1)!.eventHash, stateHash: hashRetainedRecord(runtime.state), finished: runtime.finished,
    status: runtime.state.status, undoDepth: runtime.history.length, counts, state: runtime.state };
}
function readCapture(path: string): RetainedCaptureEvent[] {
  const bytes = readFileSync(path, 'utf8');
  if (!bytes.endsWith('\n')) throw new Error('Capture has an incomplete final record; preserve it as a technical interruption rather than silently repairing it.');
  return bytes.trimEnd().split('\n').map(line => JSON.parse(line));
}
/** Append-only session writer. Existing captures and frozen sources can never be replaced by init. */
export function runRetainedProjectCli(args: string[]): unknown {
  const [command, id, ...commandArgs] = args;
  if (!command || !id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Use COMMAND and a simple session ID.');
  const path = `${RETAINED_PROJECT_CAPTURE_DIRECTORY}/${id}.jsonl`;
  const hashes = retainedSourceHashes();
  if (!same(hashes, loadedSourceHashes)) throw new Error('Source changed since the adapter loaded; use a process and capture matched to the frozen source.');
  if (command === 'verify') {
    noArgs(splitActor(commandArgs).args);
    const events = readCapture(path);
    if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
    const { state: _state, ...verified } = verifyRetainedCapture(events, hashes);
    return verified;
  }
  mkdirSync(RETAINED_PROJECT_CAPTURE_DIRECTORY, { recursive: true });
  const lock = `${path}.lock`, descriptor = openSync(lock, 'wx');
  try {
    let event: RetainedCaptureEvent;
    if (command === 'init') {
      if (existsSync(path)) throw new Error('Session already exists; never overwrite a capture.');
      const { options, supplied } = parseInit(splitActor(commandArgs).args), state = createRetainedProject(options);
      const actor = (supplied.actor ?? 'player') as Actor;
      const eventActor = splitActor(commandArgs, actor).actor;
      const metadata: RetainedMetadata = { protocol: RETAINED_PROJECT_PROTOCOL, id, sourceHashes: hashes, engineVersion: state.version,
        runtime: { node: process.version, platform: process.platform, architecture: process.arch }, supplied, actor,
        setup: { options, initialStateHash: hashRetainedRecord(state), initialMap: state.map, offeredMaps: state.boards.map(board => board.id) } };
      event = seal({ seq: 0, at: new Date().toISOString(), command, arguments: commandArgs, actor: eventActor, metadata,
        previousEventHash: null, beforeHash: null, afterHash: hashRetainedRecord(state), kind: 'init', finished: false,
        evidence:evidenceFor(state,'init'), delivered: serializeRetainedOutput(initialOutput(state)) });
      if (!same(hashes, retainedSourceHashes())) throw new Error('Source changed during the command; no capture record was committed.');
      writeFileSync(path, `${JSON.stringify(event)}\n`, { flag: 'wx' });
    } else {
      const events = readCapture(path);
      if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
      const { runtime, metadata } = replayCapture(events, hashes);
      const attributed = splitActor(commandArgs, metadata.actor);
      const next = transition(command, attributed.args, runtime, events.length);
      event = seal({ seq: events.length, at: new Date().toISOString(), command, arguments: commandArgs, actor: attributed.actor,
        previousEventHash: events.at(-1)!.eventHash, beforeHash: hashRetainedRecord(runtime.state), afterHash: hashRetainedRecord(next.state),
        kind: next.kind, ...(next.accepted === undefined ? {} : { accepted: next.accepted }),
        ...(next.undoneEventSeq === undefined ? {} : { undoneEventSeq: next.undoneEventSeq }),
        finished: next.finished, evidence:evidenceFor(next.state,command,next.preview,next.publicSource), delivered: serializeRetainedOutput(next.output) });
      if (!same(hashes, retainedSourceHashes())) throw new Error('Source changed during the command; no capture record was committed.');
      appendFileSync(path, `${JSON.stringify(event)}\n`);
    }
    return JSON.parse(event.delivered);
  } finally { closeSync(descriptor); rmSync(lock); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.stdout.write(serializeRetainedOutput(runRetainedProjectCli(process.argv.slice(2)))); }
  catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
