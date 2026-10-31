import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createMarsObjects, observeMarsObjects, stepMarsObjects, previewMarsObjects } from './logical-mars-objects.ts';
import type { State } from './logical-mars-objects.ts';

// Separate public interface: does not alter any frozen historical registry.
const [command, id, argument] = process.argv.slice(2);
if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Use a simple session ID.');
const directory = 'results/mars-objects-players';
const path = `${directory}/${id}.json`;
const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const stamp = () => new Date().toISOString();
interface Session {
  protocol: string; id: string; catalogue: 'ordinary' | 'complete'; startedAt: string;
  modelSha256: string; state: State; finished: boolean;
  events: Array<Record<string, unknown>>;
}
const sourceHash = createHash('sha256').update(readFileSync(new URL('./logical-mars-objects.ts', import.meta.url))).digest('hex');
let session: Session;
if (command === 'init') {
  if (existsSync(path)) throw new Error('Session already exists; never overwrite a capture.');
  if (argument !== 'ordinary' && argument !== 'complete') throw new Error('Catalogue must be ordinary or complete.');
  session = { protocol: 'mars-objects-cli-1', id, catalogue: argument, startedAt: stamp(), modelSha256: sourceHash,
    state: createMarsObjects('garden', { catalogue: argument }), finished: false, events: [] };
  mkdirSync(directory, { recursive: true });
  session.events.push({ type: 'init', at: stamp(), observation: observeMarsObjects(session.state), state: session.state });
} else {
  session = JSON.parse(readFileSync(path, 'utf8'));
  if (sourceHash !== session.modelSha256) throw new Error('Model changed since session start.');
}
let output: unknown;
let write = command === 'init';
if (command === 'view' || command === 'init') output = observeMarsObjects(session.state);
else if (command === 'preview') {
  const action = JSON.parse(argument); output = previewMarsObjects(session.state, action);
  session.events.push({ type: 'preview', at: stamp(), stateHash: hash(session.state), action, result: output }); write = true;
}
else if (command === 'act') {
  if (session.finished) throw new Error('Session finished.');
  const action = JSON.parse(argument), before = structuredClone(session.state);
  session.state = stepMarsObjects(before, action);
  output = observeMarsObjects(session.state);
  session.events.push({ type: 'act', at: stamp(), action, beforeHash: hash(before), before,
    afterHash: hash(session.state), after: session.state, observation: output }); write = true;
} else if (command === 'next') {
  if (session.finished || session.state.scenarioId !== 'garden') throw new Error('No next board.');
  const before = structuredClone(session.state);
  session.state = createMarsObjects('signal', { known: [...before.known] });
  output = observeMarsObjects(session.state);
  session.events.push({ type: 'next', at: stamp(), before, after: session.state, observation: output }); write = true;
} else if (command === 'checkpoint' || command === 'report') {
  const report = JSON.parse(argument);
  session.events.push({ type: command, at: stamp(), stateHash: hash(session.state), report });
  output = { recorded: true }; write = true;
} else if (command === 'finish') {
  if (session.finished) throw new Error('Already finished.');
  session.finished = true;
  session.events.push({ type: 'finish', at: stamp(), stateHash: hash(session.state), observation: observeMarsObjects(session.state) });
  output = { finished: true, observation: observeMarsObjects(session.state) }; write = true;
} else throw new Error('Commands: init ID ordinary|complete; view ID; preview/act ID JSON; next ID; checkpoint/report ID JSON; finish ID.');
if (write) writeFileSync(path, JSON.stringify(session, null, 2) + '\n');
console.log(JSON.stringify(output, null, 2));
