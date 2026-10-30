import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMarsWorkshop, observeMarsWorkshop, stepMarsWorkshop, undoMarsWorkshop } from '../experiments/logical-mars-workshop.ts';
import {
  hashWorkshopRecord, MARS_WORKSHOP_CAPTURE_DIRECTORY, serializeWorkshopOutput,
  verifyWorkshopCapture, workshopSourceHashes, WORKSHOP_PUBLIC_INTERFACE,
} from '../experiments/mars-workshop-play.ts';
import type { WorkshopCaptureEvent } from '../experiments/mars-workshop-play.ts';

const cli = fileURLToPath(new URL('../experiments/mars-workshop-play.ts', import.meta.url));
const combine = (a: string, b: string) => ({ type: 'combine' as const, a, b });
const metadata = {
  publicPrompt: 'Mechanical capture test only. Select public actions or stop whenever you choose. This is not a player session.',
  participant: { id: 'automated-cli-integrity-test', kind: 'mechanical test', model: null },
  exposureHistory: ['test implementation and source'], condition: 'mechanical integrity test', actor: 'operator',
};
function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'mars-workshop-cli-'));
  const capturePath = (id = 'test') => join(cwd, MARS_WORKSHOP_CAPTURE_DIRECTORY, `${id}.jsonl`);
  const raw = (...args: string[]) => execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
  const run = (...args: string[]) => JSON.parse(raw(...args));
  const fail = (...args: string[]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
    assert.notEqual(result.status, 0, result.stdout);
    return result.stderr;
  };
  const events = (id = 'test'): WorkshopCaptureEvent[] => readFileSync(capturePath(id), 'utf8').trim().split('\n').map(line => JSON.parse(line));
  return { cwd, capturePath, raw, run, fail, events, close: () => rmSync(cwd, { recursive: true, force: true }) };
}
function reseal(event: WorkshopCaptureEvent) {
  const { eventHash: _hash, ...unsigned } = event;
  event.eventHash = hashWorkshopRecord(unsigned);
}

test('workshop CLI: exact delivered output, append-only replay, source/setup/identity and honest workload classes', () => {
  const f = fixture();
  try {
    f.fail('init', 'absent');
    f.fail('init', 'absent', JSON.stringify({ publicPrompt: 'Not enough metadata.' }));
    const initText = f.raw('init', 'test', JSON.stringify(metadata));
    const initial = f.events()[0];
    assert.equal(initial.delivered, initText);
    assert.deepEqual(initial.metadata!.setup.options, { catalogue: 'ordinary' });
    assert.deepEqual(initial.metadata!.supplied, metadata);
    assert.deepEqual(initial.metadata!.sourceHashes, workshopSourceHashes());
    assert.equal(initial.metadata!.engineVersion, createMarsWorkshop().version);
    assert.equal(initial.metadata!.setup.offeredMaps.length, createMarsWorkshop().boards.length);
    assert.ok(initial.metadata!.runtime.node);
    const firstBytes = readFileSync(f.capturePath(), 'utf8');
    const viewText = f.raw('view', 'test');
    assert.equal(f.events().at(-1)!.delivered, viewText);
    const action = combine('frame', 'clear-film');
    const forecast = f.run('preview', 'test', JSON.stringify(action), 'world');
    assert.equal(forecast.accepted, true);
    assert.ok(!('state' in forecast), 'normal forecast must not dump replay state');
    const after = f.run('combine', 'test', JSON.stringify(action));
    assert.equal(after.accepted, true);
    assert.deepEqual(forecast.observation, after.observation);
    assert.deepEqual(forecast.inspection, f.run('inspect', 'test', 'world'));
    assert.equal(forecast.stateHash, f.events().at(-1)!.afterHash);
    assert.equal(f.run('act', 'test', JSON.stringify(combine('not-known', 'also-not-known'))).accepted, false);
    const maps = initial.metadata!.setup.offeredMaps;
    f.run('select', 'test', maps[1]);
    f.run('inspect', 'test', 'cli');
    f.run('checkpoint', 'test', JSON.stringify({ question: 'What are you trying?', response: 'Preserve exact punctuation.\nSecond line.', intentionSource: 'assigned' }));
    assert.ok(readFileSync(f.capturePath(), 'utf8').startsWith(firstBytes));
    const bytes = readFileSync(f.capturePath(), 'utf8');
    const verified = f.run('verify', 'test');
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes, 'verify is read-only');
    assert.equal(verified.verified, true);
    assert.deepEqual(verified.counts, {
      gameAttempts: 2, acceptedCombines: 1, acceptedPlayerCombines: 0, acceptedOperatorCombines: 1,
      rejectedGameAttempts: 1, queries: 4, navigation: 1, undoCommands: 0, successfulUndos: 0,
      reporting: 1, administrative: 1, invalidCommands: 0, automaticBeats: 0,
    });
    for (const event of f.events().filter(event => event.kind === 'query')) assert.equal(event.beforeHash, event.afterHash);
    const view = JSON.parse(viewText);
    assert.ok(!('previews' in view), 'no automatic preview sweep');
    assert.doesNotMatch(initText + viewText + JSON.stringify(WORKSHOP_PUBLIC_INTERFACE), /\b(180|200|220|240)\b/);
    assert.match(f.fail('init', 'test', 'complete', JSON.stringify(metadata)), /already exists/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes);
  } finally { f.close(); }
});

test('workshop CLI: public queries expose rules, catalogue, partners and object detail without world mutation', () => {
  const f = fixture();
  try {
    f.run('init', 'test', 'ordinary', JSON.stringify(metadata));
    for (const [command, operand] of [['inspect'], ['catalogue'], ['partners', 'frame'], ['inspect', 'frame']] as string[][]) {
      const result = operand ? f.run(command, 'test', operand) : f.run(command, 'test');
      assert.ok(result && !result.error, JSON.stringify(result));
      const event = f.events().at(-1)!;
      assert.equal(event.beforeHash, event.afterHash);
      assert.equal(event.kind, 'query');
      assert.equal(event.delivered, serializeWorkshopOutput(result));
    }
    assert.equal(f.run('verify', 'test').counts.acceptedCombines, 0);
  } finally { f.close(); }
});

test('workshop CLI: engine-owned undo retains learned capabilities, current navigation and cumulative evidence', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify(metadata));
    const initial = createMarsWorkshop();
    f.run('combine', 'test', JSON.stringify(combine('frame', 'clear-film')));
    const beforeSecond = verifyWorkshopCapture(f.events()).state;
    f.run('act', 'test', JSON.stringify(combine('frame', 'wheels')));
    f.run('view', 'test');
    f.run('act', 'test', '{}');
    const selectedMap = initial.boards[1].id;
    f.run('select', 'test', selectedMap);
    const beforeUndo = verifyWorkshopCapture(f.events()).state;
    const firstUndo = f.run('undo', 'test');
    assert.equal(firstUndo.undone, true);
    assert.equal(firstUndo.revertedEvent, 2);
    let checked = verifyWorkshopCapture(f.events());
    assert.deepEqual(checked.state, undoMarsWorkshop(beforeSecond, beforeUndo));
    assert.equal(checked.state.map, selectedMap);
    assert.ok(checked.state.known.includes('cart'));
    assert.equal(checked.state.serial, beforeUndo.serial);
    const beforeUndoAgain = checked.state;
    assert.equal(f.run('undo', 'test').revertedEvent, 1);
    checked = verifyWorkshopCapture(f.events());
    assert.deepEqual(checked.state, undoMarsWorkshop(initial, beforeUndoAgain));
    assert.equal(checked.counts.acceptedCombines, 2, 'undo cannot erase cumulative accepted combinations');
    assert.equal(checked.counts.successfulUndos, 2);
    assert.equal(checked.undoDepth, 0);
    assert.equal(f.run('undo', 'test').undone, false);
    assert.equal(f.run('combine', 'test', JSON.stringify(combine('frame', 'mesh'))).accepted, true);
    checked = verifyWorkshopCapture(f.events());
    assert.equal(checked.undoDepth, 1);
    assert.equal(checked.counts.acceptedCombines, 3);
    assert.ok(checked.state.serial > beforeUndo.serial, 'new branch never reuses an actual identity');
  } finally { f.close(); }
});

test('workshop CLI: incomplete finish is a valid player choice; exact reports and failed requests remain captured', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify({ ...metadata, actor: 'player' }));
    assert.ok(f.run('combine', 'test', '{malformed').error);
    assert.ok(f.run('not-a-command', 'test').error);
    assert.ok(f.run('report', 'test', '[]').error);
    const report = { reason: 'I chose to stop here.', response: 'Exact final reflection.', intentionSource: 'player-selected' };
    const finish = f.run('finish', 'test', JSON.stringify(report));
    assert.equal(finish.finished, true);
    assert.equal(finish.outcome, 'early-stop');
    assert.deepEqual(finish.report, report);
    for (const command of ['combine', 'select', 'undo', 'finish']) assert.match(f.run(command, 'test').error, /Session finished/);
    f.run('report', 'test', JSON.stringify({ question: 'What would you change?', response: 'No unrecorded follow-up.' }));
    f.run('view', 'test');
    const checked = verifyWorkshopCapture(f.events());
    assert.equal(checked.finished, true);
    assert.equal(checked.counts.acceptedCombines, 0);
    assert.equal(checked.counts.rejectedGameAttempts, 2);
    assert.equal(checked.counts.invalidCommands, 7);
    assert.equal(checked.counts.reporting, 2);
    assert.equal(f.events()[1].arguments[0], '{malformed');
    assert.deepEqual(checked.state, createMarsWorkshop());
  } finally { f.close(); }
});


test('workshop CLI: explicit per-event attribution separates operator setup/repair from participant actions', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify({ ...metadata, actor: 'player' }), '--actor=operator');
    f.run('combine', 'test', JSON.stringify(combine('frame', 'clear-film')));
    f.run('combine', 'test', JSON.stringify(combine('frame', 'wheels')), '--actor=operator');
    f.run('report', 'test', JSON.stringify({ question: 'Exact operator checkpoint question.' }), '--actor=operator');
    f.run('combine', 'test', '{malformed', '--actor=operator');
    const events = f.events(), checked = verifyWorkshopCapture(events);
    assert.deepEqual(events.map(event => event.actor), ['operator', 'player', 'operator', 'operator', 'operator']);
    assert.equal(checked.counts.acceptedPlayerCombines, 1);
    assert.equal(checked.counts.acceptedOperatorCombines, 1);
    assert.equal(checked.counts.gameAttempts, 3);
    assert.equal(checked.counts.rejectedGameAttempts, 1);
    assert.equal(events[2].arguments.at(-1), '--actor=operator');
    const changed = structuredClone(events); changed.at(-1)!.actor = 'player'; reseal(changed.at(-1)!);
    assert.throws(() => verifyWorkshopCapture(changed), /actor mismatch/);
  } finally { f.close(); }
});

test('workshop CLI: complete and saved-assembly starts are explicit reproducible conditions', () => {
  const f = fixture();
  try {
    f.run('init', 'complete', 'complete', JSON.stringify(metadata));
    const complete = verifyWorkshopCapture(f.events('complete'));
    assert.equal(complete.state.catalogue, 'complete');
    assert.ok(complete.state.known.length > createMarsWorkshop().known.length);
    const made = stepMarsWorkshop(createMarsWorkshop(), combine('frame', 'clear-film'));
    const options = { known: made.known, designs: made.designs };
    f.run('init', 'saved', JSON.stringify(options), JSON.stringify(metadata));
    const saved = verifyWorkshopCapture(f.events('saved'));
    assert.deepEqual(saved.state, createMarsWorkshop(options));
    assert.ok(saved.state.known.includes('clear-shell'));
    assert.equal(saved.counts.acceptedCombines, 0, 'supplied capabilities are setup, not this participant gameplay');
  } finally { f.close(); }
});

test('workshop CLI: corruption, re-sealed wrong outputs, source drift, truncated records and capture-ID substitution are rejected', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify(metadata));
    f.run('view', 'test');
    const events = f.events();
    const hashes = workshopSourceHashes();
    assert.throws(() => verifyWorkshopCapture(events, { ...hashes, content: 'changed' }), /freeze mismatch/);
    const corrupt = structuredClone(events); corrupt[1].delivered += ' ';
    assert.throws(() => verifyWorkshopCapture(corrupt), /integrity/);
    reseal(corrupt[1]);
    assert.throws(() => verifyWorkshopCapture(corrupt), /replay mismatch/);
    const wrongState = structuredClone(events); wrongState[1].afterHash = 'wrong'; reseal(wrongState[1]);
    assert.throws(() => verifyWorkshopCapture(wrongState), /replay mismatch/);
    const wrongIdentity = structuredClone(events); wrongIdentity[0].metadata!.supplied.participant = { id: '' }; reseal(wrongIdentity[0]);
    assert.throws(() => verifyWorkshopCapture(wrongIdentity), /participant/);
    const bytes = readFileSync(f.capturePath(), 'utf8');
    writeFileSync(f.capturePath('substitution'), bytes);
    assert.match(f.fail('verify', 'substitution'), /ID mismatch/);
    writeFileSync(f.capturePath(), bytes.slice(0, -1));
    assert.match(f.fail('view', 'test'), /incomplete final record/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes.slice(0, -1));
    writeFileSync(f.capturePath(), bytes);
    writeFileSync(`${f.capturePath()}.lock`, 'existing writer');
    assert.match(f.fail('view', 'test'), /EEXIST/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes);
  } finally { f.close(); }
});


test('workshop CLI: source edits prevent continuation without altering an existing capture', () => {
  const f = fixture();
  try {
    const frozen = join(f.cwd, 'frozen');
    for (const directory of ['experiments', 'docs']) mkdirSync(join(frozen, directory), { recursive: true });
    for (const name of ['logical-mars-workshop.ts', 'mars-workshop-content.ts', 'mars-workshop-types.ts', 'mars-workshop-play.ts']) {
      copyFileSync(fileURLToPath(new URL(`../experiments/${name}`, import.meta.url)), join(frozen, 'experiments', name));
    }
    for (const name of ['long-play-evaluation-protocol.md', 'full-length-campaign-proposal.md']) {
      copyFileSync(fileURLToPath(new URL(`../docs/${name}`, import.meta.url)), join(frozen, 'docs', name));
    }
    writeFileSync(join(frozen, 'package.json'), '{"type":"module"}');
    const frozenCli = join(frozen, 'experiments/mars-workshop-play.ts');
    execFileSync(process.execPath, [frozenCli, 'init', 'test', JSON.stringify(metadata)], { cwd: f.cwd });
    const bytes = readFileSync(f.capturePath(), 'utf8');
    const engine = join(frozen, 'experiments/logical-mars-workshop.ts');
    writeFileSync(engine, readFileSync(engine, 'utf8') + '\n// mechanical source drift fixture\n');
    const result = spawnSync(process.execPath, [frozenCli, 'view', 'test'], { cwd: f.cwd, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /freeze mismatch/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes);
  } finally { f.close(); }
});

test('workshop CLI: long capture stores deterministic replay inputs, not redundant full states or mandatory quotas', () => {
  const f = fixture();
  try {
    // Mechanical throughput only. Repeated test queries/actions do not establish experienced campaign length.
    const program = `
      import { runMarsWorkshopCli } from ${JSON.stringify(new URL('../experiments/mars-workshop-play.ts', import.meta.url).href)};
      runMarsWorkshopCli(['init', 'test', ${JSON.stringify(JSON.stringify(metadata))}]);
      const made = runMarsWorkshopCli(['combine', 'test', JSON.stringify({type:'combine',a:'frame',b:'hinge'})]);
      const id = made.observation.objects.find(object => object.design === 'folding-frame').id;
      for (let i = 0; i < 204; i++) {
        const result = runMarsWorkshopCli(['combine', 'test', JSON.stringify({type:'combine',a:id,b:id,context:{operation:i % 2 ? 'close' : 'fold'}})]);
        if (!result.accepted) throw Error('Rejected mechanical throughput transition: ' + JSON.stringify(result));
      }
      for (let i = 0; i < 3; i++) runMarsWorkshopCli(['view', 'test']);
      runMarsWorkshopCli(['finish', 'test', JSON.stringify({reason:'Mechanical throughput fixture ended.'})]);
      console.log(JSON.stringify(runMarsWorkshopCli(['verify', 'test'])));
    `;
    const checked = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', program], { cwd: f.cwd, encoding: 'utf8', timeout: 180_000 }));
    assert.equal(checked.events, 210);
    assert.equal(checked.counts.queries, 3);
    assert.equal(checked.counts.acceptedCombines, 205);
    assert.equal(checked.counts.acceptedPlayerCombines, 0, 'mechanical repetitions are not a player playtest');
    const events = f.events();
    assert.ok(events.every(event => !('state' in event) && !('before' in event) && !('after' in event)));
    const replayed = verifyWorkshopCapture(events).state;
    assert.equal(replayed.interventions, 205);
    assert.equal(events.at(-2)!.delivered, serializeWorkshopOutput(observeMarsWorkshop(replayed)));
    assert.ok(readFileSync(f.capturePath(), 'utf8').length < 3_000_000, 'compact fixture has no repeated full engine states');
  } finally { f.close(); }
});
