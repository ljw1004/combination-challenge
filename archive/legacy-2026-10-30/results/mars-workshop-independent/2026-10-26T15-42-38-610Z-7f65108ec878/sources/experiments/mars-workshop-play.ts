import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  catalogueMarsWorkshop, createMarsWorkshop, inspectMarsWorkshop, observeMarsWorkshop,
  partnersMarsWorkshop, previewMarsWorkshop, selectMarsWorkshop, stepMarsWorkshop, undoMarsWorkshop,
} from './logical-mars-workshop.ts';
import type { CreateOptions, State } from './mars-workshop-types.ts';

/** Public adapter only: no witness, policy, solution, or automatic action selection. */
export const MARS_WORKSHOP_PROTOCOL = 'mars-workshop-cli-1';
export const MARS_WORKSHOP_CAPTURE_DIRECTORY = 'results/mars-workshop-players';
export const hashWorkshopRecord = (value: unknown): string => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const serializeWorkshopOutput = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const sources = {
  engine: './logical-mars-workshop.ts', content: './mars-workshop-content.ts', types: './mars-workshop-types.ts',
  adapter: './mars-workshop-play.ts', evaluationProtocol: '../docs/long-play-evaluation-protocol.md',
  campaignProposal: '../docs/full-length-campaign-proposal.md',
};
export function workshopSourceHashes(): Record<string, string> {
  return Object.fromEntries(Object.entries(sources).map(([name, file]) => [name,
    createHash('sha256').update(readFileSync(new URL(file, import.meta.url))).digest('hex')]));
}
// A long-lived caller must not label cached engine code with newly edited source bytes.
const loadedSourceHashes = workshopSourceHashes();

export const WORKSHOP_PUBLIC_INTERFACE = {
  commands: {
    init: 'init ID [ordinary|complete|OPTIONS_JSON] METADATA_JSON — start a new capture; default ordinary; metadata records the exact assignment and participant',
    view: 'view ID — compact current board, objects, and goals',
    inspect: 'inspect ID [object/design/place ID] — public detail; omit the operand for rules; use cli for this guide',
    catalogue: 'catalogue ID — all public recipes and available designs, including reusable assemblies',
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
  action: { type: 'combine', a: 'actual operand', b: 'actual operand', context: 'optional public operation/at/channel/direction/part/via fields' },
  operands: 'Known design IDs, actual object IDs o:N, and places place:ID are distinct. Inspect or query partners for their public conditions.',
  undo: 'Editing undo restores the physical boards, records, achievements, and engine counters from before the latest still-applied accepted combination, using the engine editing operation. Learned capabilities and saved designs remain known, the current map stays selected, and the identity serial never decreases. Queries, rejected actions, and navigation do not add undo entries. Repeated undo walks accepted combinations backward; a new accepted combination branches from the edited state. There is no redo. The append-only session evidence and cumulative workload counts are never erased, and undo is counted separately, not as a combination.',
  attribution: 'A trailing --actor=player or --actor=operator explicitly attributes a recorded command; otherwise the session metadata actor is used (default player). This does not change game behavior. Operator actions are not counted as player combinations.',
  movement: 'Optional context.via lists public place IDs as waypoints for a chosen route. The entire submitted journey is one combination, not one intervention per traversed edge.',
  queries: 'Inspection, catalogue, partners, view, and preview are world-read-only. Their delivered observations are captured and counted separately from gameplay. No catalogue or preview sweep is performed automatically.',
  stopping: 'You may finish early or after completion. Reporting and public queries remain available after finishing; further gameplay, navigation, and undo do not.',
} as const;

type Actor = 'player' | 'operator';
export interface WorkshopMetadata {
  protocol: string;
  id: string;
  sourceHashes: Record<string, string>;
  engineVersion: string;
  runtime: { node: string; platform: string; architecture: string };
  supplied: Record<string, unknown>;
  setup: { options: CreateOptions; initialStateHash: string; initialMap: string; offeredMaps: string[] };
  actor: Actor;
}
export type WorkshopEventKind = 'init' | 'gameplay' | 'query' | 'navigation' | 'undo' | 'reporting' | 'finish' | 'interface-error';
export interface WorkshopCaptureEvent {
  seq: number;
  at: string;
  command: string;
  /** Exact argument strings as submitted to the CLI, including malformed requests. */
  arguments: string[];
  actor: Actor;
  metadata?: WorkshopMetadata;
  previousEventHash: string | null;
  beforeHash: string | null;
  afterHash: string;
  kind: WorkshopEventKind;
  accepted?: boolean;
  undoneEventSeq?: number;
  finished: boolean;
  /** Exact bytes written to stdout. Full states are replayed, not repeated here. */
  delivered: string;
  eventHash: string;
}
export interface WorkshopWorkload {
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
interface Transition extends Runtime { output: unknown; kind: WorkshopEventKind; accepted?: boolean; undoneEventSeq?: number }
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
function transition(command: string, args: string[], runtime: Runtime, seq: number): Transition {
  const { state: before, finished, history } = runtime;
  let state = before;
  try {
    if (finished && ['combine', 'act', 'select', 'undo', 'finish'].includes(command)) throw new Error('Session finished; public queries and reports remain available, but gameplay cannot resume in this capture.');
    if (command === 'view') { noArgs(args); return { ...runtime, output: observeMarsWorkshop(state), kind: 'query' }; }
    if (command === 'inspect') {
      if (args.length > 1) throw new Error('inspect takes at most one public ID.');
      return { ...runtime, output: args[0] === 'cli' ? WORKSHOP_PUBLIC_INTERFACE : inspectMarsWorkshop(state, args[0]), kind: 'query' };
    }
    if (command === 'catalogue') { noArgs(args); return { ...runtime, output: catalogueMarsWorkshop(state), kind: 'query' }; }
    if (command === 'partners') return { ...runtime, output: partnersMarsWorkshop(state, oneArg(args)), kind: 'query' };
    if (command === 'preview') {
      if (args.length < 1 || args.length > 2) throw new Error('preview takes ACTION_JSON and an optional public inspection ID (for example world).');
      const forecast = previewMarsWorkshop(state, JSON.parse(args[0]));
      // The forecast is exact, but the private replay representation is not a default UI dump.
      const output = { accepted: forecast.accepted, response: forecast.response, observation: forecast.observation, stateHash: hashWorkshopRecord(forecast.state),
        ...(args[1] === undefined ? {} : { inspection: inspectMarsWorkshop(forecast.state, args[1]) }) };
      return { ...runtime, output, kind: 'query' };
    }
    if (command === 'combine' || command === 'act') {
      state = stepMarsWorkshop(before, JSON.parse(oneArg(args)));
      return { state, finished, history: state.accepted ? [...history, { seq, state: before }] : history,
        output: { accepted: state.accepted, response: state.response, observation: observeMarsWorkshop(state) }, kind: 'gameplay', accepted: state.accepted };
    }
    if (command === 'select') {
      state = selectMarsWorkshop(before, oneArg(args));
      return { state, finished, history, output: observeMarsWorkshop(state), kind: 'navigation' };
    }
    if (command === 'undo') {
      noArgs(args);
      const previous = history.at(-1);
      if (!previous) return { ...runtime, output: { undone: false, reason: 'No accepted combination remains to undo.' }, kind: 'undo', accepted: false };
      state = undoMarsWorkshop(previous.state, before);
      return { state, finished, history: history.slice(0, -1), output: { undone: true, revertedEvent: previous.seq, observation: observeMarsWorkshop(state) },
        kind: 'undo', accepted: true, undoneEventSeq: previous.seq };
    }
    if (command === 'checkpoint' || command === 'report') {
      reportArg(args);
      return { ...runtime, output: { recorded: true }, kind: 'reporting' };
    }
    if (command === 'finish') {
      const report = reportArg(args, true);
      return { ...runtime, finished: true, output: { finished: true, outcome: state.status === 'complete' ? 'completed' : 'early-stop', report, observation: observeMarsWorkshop(state) }, kind: 'finish' };
    }
    throw new Error('Unknown command. Use inspect ID cli for the public command guide.');
  } catch (error) {
    // Failed syntax/requests are evidence too. No engine state is committed on an exception.
    return { ...runtime, output: { error: error instanceof Error ? error.message : String(error), accepted: false }, kind: 'interface-error', accepted: false };
  }
}
function seal(event: Omit<WorkshopCaptureEvent, 'eventHash'>): WorkshopCaptureEvent { return { ...event, eventHash: hashWorkshopRecord(event) }; }
function workload(events: WorkshopCaptureEvent[]): WorkshopWorkload {
  const counts: WorkshopWorkload = { gameAttempts: 0, acceptedCombines: 0, acceptedPlayerCombines: 0, acceptedOperatorCombines: 0,
    rejectedGameAttempts: 0, queries: 0, navigation: 0, undoCommands: 0, successfulUndos: 0, reporting: 0, administrative: 0, invalidCommands: 0, automaticBeats: 0 };
  for (const event of events) {
    if (event.kind === 'interface-error') counts.invalidCommands++;
    if (event.command === 'combine' || event.command === 'act') {
      counts.gameAttempts++;
      if (event.kind === 'gameplay' && event.accepted) { counts.acceptedCombines++; counts[event.actor === 'player' ? 'acceptedPlayerCombines' : 'acceptedOperatorCombines']++; }
      else counts.rejectedGameAttempts++;
    } else if (['view', 'inspect', 'catalogue', 'partners', 'preview'].includes(event.command)) counts.queries++;
    else if (event.command === 'select') counts.navigation++;
    else if (event.command === 'undo') { counts.undoCommands++; if (event.kind === 'undo' && event.accepted) counts.successfulUndos++; }
    else if (event.command === 'report' || event.command === 'checkpoint') counts.reporting++;
    else if (event.command === 'init' || event.command === 'finish') counts.administrative++;
  }
  return counts;
}
function replayCapture(events: WorkshopCaptureEvent[], hashes: Record<string, string>) {
  if (!events.length) throw new Error('Empty capture.');
  const metadata = events[0].metadata;
  if (!metadata || metadata.protocol !== MARS_WORKSHOP_PROTOCOL || !same(metadata.sourceHashes, hashes)) throw new Error('Source/protocol freeze mismatch; preserve this capture and use its frozen source.');
  validateSupplied(metadata.supplied);
  validateOptions(metadata.setup.options);
  if (metadata.actor !== (metadata.supplied.actor ?? 'player')) throw new Error('Participant actor mismatch.');
  const initial = createMarsWorkshop(metadata.setup.options);
  if (metadata.engineVersion !== initial.version || metadata.setup.initialStateHash !== hashWorkshopRecord(initial)
    || metadata.setup.initialMap !== initial.map || !same(metadata.setup.offeredMaps, initial.boards.map(board => board.id))) throw new Error('Initial setup mismatch.');
  let runtime: Runtime = { state: initial, finished: false, history: [] };
  for (const [index, event] of events.entries()) {
    const { eventHash, ...unsigned } = event;
    if (event.seq !== index || eventHash !== hashWorkshopRecord(unsigned)
      || event.previousEventHash !== (index ? events[index - 1].eventHash : null)) throw new Error(`Broken event integrity at ${index}.`);
    if (typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))) throw new Error(`Invalid event timestamp at ${index}.`);
    const attributed = splitActor(event.arguments, metadata.actor);
    if (event.actor !== attributed.actor || event.beforeHash !== (index ? hashWorkshopRecord(runtime.state) : null)) throw new Error(`Before-state/actor mismatch at ${index}.`);
    let next: Transition;
    if (!index) {
      if (event.command !== 'init') throw new Error('First event must be initialization.');
      const parsed = parseInit(attributed.args);
      if (!same(parsed.options, metadata.setup.options) || !same(parsed.supplied, metadata.supplied)) throw new Error('Initial arguments/metadata mismatch.');
      next = { ...runtime, output: { observation: observeMarsWorkshop(initial), interface: WORKSHOP_PUBLIC_INTERFACE }, kind: 'init' };
    } else {
      if (event.metadata) throw new Error(`Unexpected metadata replacement at ${index}.`);
      next = transition(event.command, attributed.args, runtime, index);
    }
    if (event.afterHash !== hashWorkshopRecord(next.state) || event.finished !== next.finished || event.kind !== next.kind
      || event.accepted !== next.accepted || event.undoneEventSeq !== next.undoneEventSeq || event.delivered !== serializeWorkshopOutput(next.output)) {
      throw new Error(`Deterministic state/output replay mismatch at ${index}.`);
    }
    runtime = { state: next.state, finished: next.finished, history: next.history };
  }
  return { runtime, metadata, counts: workload(events) };
}
/** Exact replay validates each delivered output, not merely the final accepted action list. Never writes. */
export function verifyWorkshopCapture(events: WorkshopCaptureEvent[], hashes = workshopSourceHashes()) {
  const { runtime, counts, metadata } = replayCapture(events, hashes);
  return { verified: true, protocol: MARS_WORKSHOP_PROTOCOL, id: metadata.id, events: events.length,
    headHash: events.at(-1)!.eventHash, stateHash: hashWorkshopRecord(runtime.state), finished: runtime.finished,
    status: runtime.state.status, undoDepth: runtime.history.length, counts, state: runtime.state };
}
function readCapture(path: string): WorkshopCaptureEvent[] {
  const bytes = readFileSync(path, 'utf8');
  if (!bytes.endsWith('\n')) throw new Error('Capture has an incomplete final record; preserve it as a technical interruption rather than silently repairing it.');
  return bytes.trimEnd().split('\n').map(line => JSON.parse(line));
}
/** Append-only session writer. Existing captures and frozen sources can never be replaced by init. */
export function runMarsWorkshopCli(args: string[]): unknown {
  const [command, id, ...commandArgs] = args;
  if (!command || !id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Use COMMAND and a simple session ID.');
  const path = `${MARS_WORKSHOP_CAPTURE_DIRECTORY}/${id}.jsonl`;
  const hashes = workshopSourceHashes();
  if (!same(hashes, loadedSourceHashes)) throw new Error('Source changed since the adapter loaded; use a process and capture matched to the frozen source.');
  if (command === 'verify') {
    noArgs(splitActor(commandArgs).args);
    const events = readCapture(path);
    if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
    const { state: _state, ...verified } = verifyWorkshopCapture(events, hashes);
    return verified;
  }
  mkdirSync(MARS_WORKSHOP_CAPTURE_DIRECTORY, { recursive: true });
  const lock = `${path}.lock`, descriptor = openSync(lock, 'wx');
  try {
    let event: WorkshopCaptureEvent;
    if (command === 'init') {
      if (existsSync(path)) throw new Error('Session already exists; never overwrite a capture.');
      const { options, supplied } = parseInit(splitActor(commandArgs).args), state = createMarsWorkshop(options);
      const actor = (supplied.actor ?? 'player') as Actor;
      const eventActor = splitActor(commandArgs, actor).actor;
      const metadata: WorkshopMetadata = { protocol: MARS_WORKSHOP_PROTOCOL, id, sourceHashes: hashes, engineVersion: state.version,
        runtime: { node: process.version, platform: process.platform, architecture: process.arch }, supplied, actor,
        setup: { options, initialStateHash: hashWorkshopRecord(state), initialMap: state.map, offeredMaps: state.boards.map(board => board.id) } };
      event = seal({ seq: 0, at: new Date().toISOString(), command, arguments: commandArgs, actor: eventActor, metadata,
        previousEventHash: null, beforeHash: null, afterHash: hashWorkshopRecord(state), kind: 'init', finished: false,
        delivered: serializeWorkshopOutput({ observation: observeMarsWorkshop(state), interface: WORKSHOP_PUBLIC_INTERFACE }) });
      if (!same(hashes, workshopSourceHashes())) throw new Error('Source changed during the command; no capture record was committed.');
      writeFileSync(path, `${JSON.stringify(event)}\n`, { flag: 'wx' });
    } else {
      const events = readCapture(path);
      if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
      const { runtime, metadata } = replayCapture(events, hashes);
      const attributed = splitActor(commandArgs, metadata.actor);
      const next = transition(command, attributed.args, runtime, events.length);
      event = seal({ seq: events.length, at: new Date().toISOString(), command, arguments: commandArgs, actor: attributed.actor,
        previousEventHash: events.at(-1)!.eventHash, beforeHash: hashWorkshopRecord(runtime.state), afterHash: hashWorkshopRecord(next.state),
        kind: next.kind, ...(next.accepted === undefined ? {} : { accepted: next.accepted }),
        ...(next.undoneEventSeq === undefined ? {} : { undoneEventSeq: next.undoneEventSeq }),
        finished: next.finished, delivered: serializeWorkshopOutput(next.output) });
      if (!same(hashes, workshopSourceHashes())) throw new Error('Source changed during the command; no capture record was committed.');
      appendFileSync(path, `${JSON.stringify(event)}\n`);
    }
    return JSON.parse(event.delivered);
  } finally { closeSync(descriptor); rmSync(lock); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.stdout.write(serializeWorkshopOutput(runMarsWorkshopCli(process.argv.slice(2)))); }
  catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
