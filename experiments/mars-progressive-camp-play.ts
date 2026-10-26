import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createProgressiveCamp, observeProgressiveCamp, previewProgressiveCamp, stepProgressiveCamp } from './logical-mars-progressive-camp.ts';
import type { Catalogue, ProgressiveState } from './logical-mars-progressive-camp.ts';

export const PROGRESSIVE_CAMP_PROTOCOL = 'mars-progressive-camp-cli-1';
export const hashProgressiveRecord = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const sources = {
  base: './logical-mars-objects.ts', wrapper: './logical-mars-progressive-camp.ts', adapter: './mars-progressive-camp-play.ts',
  baseProtocol: '../docs/mars-objects-play-protocol.md', operatorGuide: '../docs/mars-progressive-camp.md', proposal: '../docs/mars-progressive-camp-proposal.md',
};
export function progressiveSourceHashes() {
  return Object.fromEntries(Object.entries(sources).map(([name, file]) => [name,
    createHash('sha256').update(readFileSync(new URL(file, import.meta.url))).digest('hex')]));
}
interface Metadata { protocol: string; id: string; catalogue: Catalogue; sourceHashes: Record<string, string>; supplied: Record<string, unknown> }
export interface CaptureEvent {
  seq: number; at: string; command: string; argument: unknown; metadata?: Metadata;
  previousEventHash: string | null; beforeHash: string | null; afterHash: string;
  state: ProgressiveState; finished: boolean; output: unknown; eventHash: string;
}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function requireObject(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Report/metadata must be a JSON object.');
}
function requireSuppliedMetadata(value: unknown): asserts value is Record<string, unknown> {
  requireObject(value);
  if (typeof value.publicPrompt !== 'string' || !value.publicPrompt.trim()) throw new Error('Capture the exact public prompt in metadata.publicPrompt.');
  requireObject(value.participant);
  if (typeof value.participant.id !== 'string' || !value.participant.id.trim()) throw new Error('Record the actual participant identifier in metadata.participant.id.');
}
function result(command: string, argument: unknown, before: ProgressiveState, finished: boolean) {
  if (finished && command !== 'view' && command !== 'preview') throw new Error('Session finished.');
  let state = before, output: unknown;
  if (command === 'view') output = observeProgressiveCamp(state);
  else if (command === 'preview') output = previewProgressiveCamp(state, argument);
  else if (command === 'act') { state = stepProgressiveCamp(state, argument); output = observeProgressiveCamp(state); }
  else if (command === 'checkpoint' || command === 'report') { requireObject(argument); output = { recorded: true }; }
  else if (command === 'finish') { finished = true; output = { finished: true, observation: observeProgressiveCamp(state) }; }
  else throw new Error('Commands: init, view, preview, act, checkpoint, report, finish, verify. There is no next/reset command.');
  return { state, output, finished };
}
function seal(event: Omit<CaptureEvent, 'eventHash'>): CaptureEvent { return { ...event, eventHash: hashProgressiveRecord(event) }; }

/** Replays exact events, including all delivered observations and preview results. Does not write. */
export function verifyProgressiveCapture(events: CaptureEvent[], hashes = progressiveSourceHashes()) {
  if (!events.length) throw new Error('Empty capture.');
  const initial = events[0], metadata = initial.metadata;
  if (!metadata || metadata.protocol !== PROGRESSIVE_CAMP_PROTOCOL || !same(metadata.sourceHashes, hashes)) throw new Error('Source/protocol freeze mismatch.');
  requireSuppliedMetadata(metadata.supplied);
  let state = createProgressiveCamp(metadata.catalogue), finished = false;
  for (const [index, event] of events.entries()) {
    const { eventHash, ...unsigned } = event;
    if (event.seq !== index || event.eventHash !== hashProgressiveRecord(unsigned)
      || event.previousEventHash !== (index ? events[index - 1].eventHash : null)) throw new Error(`Broken event integrity at ${index}.`);
    if (event.beforeHash !== (index ? hashProgressiveRecord(state) : null)) throw new Error(`Before-state mismatch at ${index}.`);
    let output: unknown;
    if (!index) {
      if (event.command !== 'init' || event.argument !== metadata.catalogue) throw new Error('Invalid initial event.');
      output = observeProgressiveCamp(state);
    } else {
      if (event.metadata) throw new Error(`Unexpected metadata replacement at ${index}.`);
      const next = result(event.command, event.argument, state, finished);
      state = next.state; finished = next.finished; output = next.output;
    }
    if (!same(event.state, state) || event.afterHash !== hashProgressiveRecord(state)
      || event.finished !== finished || !same(event.output, output)) throw new Error(`Replay mismatch at ${index}.`);
  }
  return { verified: true, events: events.length, stateHash: hashProgressiveRecord(state), finished, state };
}

export function runProgressiveCampCli(args: string[]) {
  const [command, id, argument, metadataArgument] = args;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Use a simple session ID.');
  if (args.length > 4 || (metadataArgument !== undefined && command !== 'init')) throw new Error('Unexpected arguments.');
  const directory = 'results/mars-progressive-camp-players', path = `${directory}/${id}.jsonl`;
  const sourceHashes = progressiveSourceHashes();
  if (sourceHashes.base !== '4347c9f71ae6fe8b6d13f807b63a40bffea7adfc391521d18c3cccb782542f4c') throw new Error('Frozen Mars Objects 1 source mismatch.');
  if (command === 'verify') {
    if (argument !== undefined) throw new Error('Unexpected verify argument.');
    const events: CaptureEvent[] = readFileSync(path, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
    const { state: _state, ...checked } = verifyProgressiveCapture(events, sourceHashes);
    return checked;
  }
  mkdirSync(directory, { recursive: true });
  const lock = `${path}.lock`, descriptor = openSync(lock, 'wx');
  try {
    let event: CaptureEvent;
    if (command === 'init') {
      if (existsSync(path)) throw new Error('Session already exists; never overwrite a capture.');
      if (argument !== 'ordinary' && argument !== 'complete') throw new Error('Catalogue must be ordinary or complete.');
      const supplied: unknown = metadataArgument ? JSON.parse(metadataArgument) : {};
      requireSuppliedMetadata(supplied);
      const state = createProgressiveCamp(argument);
      event = seal({ seq: 0, at: new Date().toISOString(), command, argument,
        metadata: { protocol: PROGRESSIVE_CAMP_PROTOCOL, id, catalogue: argument, sourceHashes, supplied },
        previousEventHash: null, beforeHash: null, afterHash: hashProgressiveRecord(state),
        state, finished: false, output: observeProgressiveCamp(state) });
      writeFileSync(path, `${JSON.stringify(event)}\n`, { flag: 'wx' });
    } else {
      const events: CaptureEvent[] = readFileSync(path, 'utf8').trim().split('\n').map(line => JSON.parse(line));
      const previous = events.at(-1)!;
      if (events[0]?.metadata?.id !== id) throw new Error('Capture/session ID mismatch.');
      const verified = verifyProgressiveCapture(events, sourceHashes);
      const parsed: unknown = ['act', 'preview', 'checkpoint', 'report'].includes(command) ? JSON.parse(argument) : null;
      if (!['act', 'preview', 'checkpoint', 'report'].includes(command) && argument !== undefined) throw new Error('Unexpected command argument.');
      const next = result(command, parsed, verified.state, verified.finished);
      event = seal({ seq: events.length, at: new Date().toISOString(), command, argument: parsed,
        previousEventHash: previous.eventHash, beforeHash: hashProgressiveRecord(verified.state),
        afterHash: hashProgressiveRecord(next.state), ...next });
      appendFileSync(path, `${JSON.stringify(event)}\n`);
    }
    return event.output;
  } finally { closeSync(descriptor); rmSync(lock); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(runProgressiveCampCli(process.argv.slice(2)), null, 2));
