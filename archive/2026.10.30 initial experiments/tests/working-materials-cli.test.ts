import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWorkingMaterials, observeWorkingMaterials, stepWorkingMaterials, undoWorkingMaterials } from '../experiments/logical-working-materials.ts';
import {
  compactMaterialsView, hashMaterialsRecord, WORKING_MATERIALS_CAPTURE_DIRECTORY, serializeMaterialsOutput,
  verifyMaterialsCapture, materialsSourceHashes, MATERIALS_PUBLIC_INTERFACE,
} from '../experiments/working-materials-play.ts';
import type { MaterialsCaptureEvent } from '../experiments/working-materials-play.ts';

const cli = fileURLToPath(new URL('../experiments/working-materials-play.ts', import.meta.url));
const jsonValue=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
const combine = (a: string, b: string) => ({ type: 'combine' as const, a, b });
const metadata = {
  publicPrompt: 'Mechanical capture test only. Select public actions or stop whenever you choose. This is not a player session.',
  participant: { id: 'automated-cli-integrity-test', kind: 'mechanical test', model: null },
  exposureHistory: ['test implementation and source'], condition: 'mechanical integrity test', actor: 'operator',
};
function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'working-materials-cli-'));
  const capturePath = (id = 'test') => join(cwd, WORKING_MATERIALS_CAPTURE_DIRECTORY, `${id}.jsonl`);
  const raw = (...args: string[]) => execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
  const run = (...args: string[]) => JSON.parse(raw(...args));
  const fail = (...args: string[]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
    assert.notEqual(result.status, 0, result.stdout);
    return result.stderr;
  };
  const events = (id = 'test'): MaterialsCaptureEvent[] => readFileSync(capturePath(id), 'utf8').trim().split('\n').map(line => JSON.parse(line));
  return { cwd, capturePath, raw, run, fail, events, close: () => rmSync(cwd, { recursive: true, force: true }) };
}
function reseal(event: MaterialsCaptureEvent) {
  const { eventHash: _hash, ...unsigned } = event;
  event.eventHash = hashMaterialsRecord(unsigned);
}

test('materials CLI: exact delivered output, append-only replay, source/setup/identity and honest workload classes', () => {
  const f = fixture();
  try {
    f.fail('init', 'absent');
    f.fail('init', 'absent', JSON.stringify({ publicPrompt: 'Not enough metadata.' }));
    const initText = f.raw('init', 'test', JSON.stringify(metadata));
    const initial = f.events()[0];
    assert.equal(initial.delivered, initText);
    assert.deepEqual(initial.metadata!.setup.options, { catalogue: 'ordinary' });
    assert.deepEqual(initial.metadata!.supplied, metadata);
    assert.deepEqual(initial.metadata!.sourceHashes, materialsSourceHashes());
    assert.equal(initial.metadata!.engineVersion, createWorkingMaterials().version);
    assert.deepEqual(initial.evidence.state,jsonValue(createWorkingMaterials()));
    assert.deepEqual(initial.evidence.observation,jsonValue(observeWorkingMaterials(createWorkingMaterials())));
    assert.equal(initial.metadata!.setup.offeredMaps.length, createWorkingMaterials().boards.length);
    assert.ok(initial.metadata!.runtime.node);
    const firstBytes = readFileSync(f.capturePath(), 'utf8');
    const viewText = f.raw('view', 'test');
    assert.equal(f.events().at(-1)!.delivered, viewText);
    const action = combine('frame', 'clear-film');
    const forecast = f.run('preview', 'test', JSON.stringify(action), 'world');
    assert.equal(forecast.accepted, true);
    const forecastEvent = f.events().at(-1)!;
    assert.deepEqual(forecastEvent.evidence.preview!.state,jsonValue(stepWorkingMaterials(createWorkingMaterials(),action)));
    assert.deepEqual(forecastEvent.evidence.preview!.observation,jsonValue(observeWorkingMaterials(forecastEvent.evidence.preview!.state)));
    assert.ok(!('state' in forecast), 'normal forecast must not dump replay state');
    const after = f.run('combine', 'test', JSON.stringify(action));
    assert.equal(after.accepted, true);
    assert.deepEqual(f.events().at(-1)!.evidence.state,forecastEvent.evidence.preview!.state);
    assert.deepEqual(f.events().at(-1)!.evidence.observation,forecastEvent.evidence.preview!.observation);
    assert.ok(!('campaign' in after.observation));
    assert.ok(!('requirement' in after.observation.goals[0]));
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
    assert.doesNotMatch(initText + viewText + JSON.stringify(MATERIALS_PUBLIC_INTERFACE), /\b(180|200|220|240)\b/);
    assert.match(f.fail('init', 'test', 'complete', JSON.stringify(metadata)), /already exists/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes);
  } finally { f.close(); }
});

test('materials CLI: public queries expose rules, catalogue, partners and object detail without world mutation', () => {
  const f = fixture();
  try {
    f.run('init', 'test', 'ordinary', JSON.stringify(metadata));
    for (const [command, operand] of [['inspect'], ['catalogue'], ['partners', 'frame'], ['inspect', 'frame']] as string[][]) {
      const result = operand ? f.run(command, 'test', operand) : f.run(command, 'test');
      assert.ok(result && !result.error, JSON.stringify(result));
      const event = f.events().at(-1)!;
      assert.equal(event.beforeHash, event.afterHash);
      assert.equal(event.kind, 'query');
      assert.equal(event.delivered, serializeMaterialsOutput(result));
    }
    assert.equal(f.run('verify', 'test').counts.acceptedCombines, 0);
  } finally { f.close(); }
});

test('materials CLI: engine-owned undo retains learned capabilities, current navigation and cumulative evidence', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify(metadata));
    const initial = createWorkingMaterials();
    f.run('combine', 'test', JSON.stringify(combine('frame', 'clear-film')));
    const beforeSecond = verifyMaterialsCapture(f.events()).state;
    f.run('act', 'test', JSON.stringify(combine('frame', 'wheels')));
    f.run('view', 'test');
    f.run('act', 'test', '{}');
    const selectedMap = initial.boards[1].id;
    f.run('select', 'test', selectedMap);
    const beforeUndo = verifyMaterialsCapture(f.events()).state;
    const firstUndo = f.run('undo', 'test');
    assert.equal(firstUndo.undone, true);
    assert.equal(firstUndo.revertedEvent, 2);
    let checked = verifyMaterialsCapture(f.events());
    assert.deepEqual(checked.state, undoWorkingMaterials(beforeSecond, beforeUndo));
    assert.equal(checked.state.map, selectedMap);
    assert.ok(checked.state.known.includes('cart'));
    assert.equal(checked.state.serial, beforeUndo.serial);
    const beforeUndoAgain = checked.state;
    assert.equal(f.run('undo', 'test').revertedEvent, 1);
    checked = verifyMaterialsCapture(f.events());
    assert.deepEqual(checked.state, undoWorkingMaterials(initial, beforeUndoAgain));
    assert.equal(checked.counts.acceptedCombines, 2, 'undo cannot erase cumulative accepted combinations');
    assert.equal(checked.counts.successfulUndos, 2);
    assert.equal(checked.undoDepth, 0);
    assert.equal(f.run('undo', 'test').undone, false);
    assert.equal(f.run('combine', 'test', JSON.stringify(combine('frame', 'mesh'))).accepted, true);
    checked = verifyMaterialsCapture(f.events());
    assert.equal(checked.undoDepth, 1);
    assert.equal(checked.counts.acceptedCombines, 3);
    assert.ok(checked.state.serial > beforeUndo.serial, 'new branch never reuses an actual identity');
  } finally { f.close(); }
});

test('materials CLI: incomplete finish is a valid player choice; exact reports and failed requests remain captured', () => {
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
    const checked = verifyMaterialsCapture(f.events());
    assert.equal(checked.finished, true);
    assert.equal(checked.counts.acceptedCombines, 0);
    assert.equal(checked.counts.rejectedGameAttempts, 2);
    assert.equal(checked.counts.invalidCommands, 7);
    assert.equal(checked.counts.reporting, 2);
    assert.equal(f.events()[1].arguments[0], '{malformed');
    assert.deepEqual(checked.state, createWorkingMaterials());
  } finally { f.close(); }
});


test('materials CLI: explicit per-event attribution separates operator setup/repair from participant actions', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify({ ...metadata, actor: 'player' }), '--actor=operator');
    f.run('combine', 'test', JSON.stringify(combine('frame', 'clear-film')));
    f.run('combine', 'test', JSON.stringify(combine('frame', 'wheels')), '--actor=operator');
    f.run('report', 'test', JSON.stringify({ question: 'Exact operator checkpoint question.' }), '--actor=operator');
    f.run('combine', 'test', '{malformed', '--actor=operator');
    const events = f.events(), checked = verifyMaterialsCapture(events);
    assert.deepEqual(events.map(event => event.actor), ['operator', 'player', 'operator', 'operator', 'operator']);
    assert.equal(checked.counts.acceptedPlayerCombines, 1);
    assert.equal(checked.counts.acceptedOperatorCombines, 1);
    assert.equal(checked.counts.gameAttempts, 3);
    assert.equal(checked.counts.rejectedGameAttempts, 1);
    assert.equal(events[2].arguments.at(-1), '--actor=operator');
    const changed = structuredClone(events); changed.at(-1)!.actor = 'player'; reseal(changed.at(-1)!);
    assert.throws(() => verifyMaterialsCapture(changed), /actor mismatch/);
  } finally { f.close(); }
});

test('materials CLI: complete and saved-assembly starts are explicit reproducible conditions', () => {
  const f = fixture();
  try {
    f.run('init', 'complete', 'complete', JSON.stringify(metadata));
    const complete = verifyMaterialsCapture(f.events('complete'));
    assert.equal(complete.state.catalogue, 'complete');
    assert.ok(complete.state.known.length > createWorkingMaterials().known.length);
    const made = stepWorkingMaterials(createWorkingMaterials(), combine('frame', 'clear-film'));
    const options = { known: made.known, designs: made.designs };
    f.run('init', 'saved', JSON.stringify(options), JSON.stringify(metadata));
    const saved = verifyMaterialsCapture(f.events('saved'));
    assert.deepEqual(saved.state, createWorkingMaterials(options));
    assert.ok(saved.state.known.includes('clear-shell'));
    assert.equal(saved.counts.acceptedCombines, 0, 'supplied capabilities are setup, not this participant gameplay');
  } finally { f.close(); }
});

test('materials CLI: corruption, re-sealed wrong outputs, source drift, truncated records and capture-ID substitution are rejected', () => {
  const f = fixture();
  try {
    f.run('init', 'test', JSON.stringify(metadata));
    f.run('view', 'test');
    const events = f.events();
    const hashes = materialsSourceHashes();
    assert.throws(() => verifyMaterialsCapture(events, { ...hashes, content: 'changed' }), /freeze mismatch/);
    const corrupt = structuredClone(events); corrupt[1].delivered += ' ';
    assert.throws(() => verifyMaterialsCapture(corrupt), /integrity/);
    reseal(corrupt[1]);
    assert.throws(() => verifyMaterialsCapture(corrupt), /replay mismatch/);
    const wrongState = structuredClone(events); wrongState[1].afterHash = 'wrong'; reseal(wrongState[1]);
    assert.throws(() => verifyMaterialsCapture(wrongState), /replay mismatch/);
    const wrongIdentity = structuredClone(events); wrongIdentity[0].metadata!.supplied.participant = { id: '' }; reseal(wrongIdentity[0]);
    assert.throws(() => verifyMaterialsCapture(wrongIdentity), /participant/);
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


test('materials CLI: source edits prevent continuation without altering an existing capture', () => {
  const f = fixture();
  try {
    const frozen = join(f.cwd, 'frozen');
    for (const directory of ['experiments', 'docs']) mkdirSync(join(frozen, directory), { recursive: true });
    for (const name of ['logical-working-materials.ts', 'working-materials-content.ts', 'working-materials-types.ts', 'working-materials-transformations.ts', 'working-materials-play.ts']) {
      copyFileSync(fileURLToPath(new URL(`../experiments/${name}`, import.meta.url)), join(frozen, 'experiments', name));
    }
    for (const name of ['long-play-evaluation-protocol.md','working-materials.md']) {
      copyFileSync(fileURLToPath(new URL(`../docs/${name}`, import.meta.url)), join(frozen, 'docs', name));
    }
    writeFileSync(join(frozen, 'package.json'), '{"type":"module"}');
    const frozenCli = join(frozen, 'experiments/working-materials-play.ts');
    execFileSync(process.execPath, [frozenCli, 'init', 'test', JSON.stringify(metadata)], { cwd: f.cwd });
    const bytes = readFileSync(f.capturePath(), 'utf8');
    const engine = join(frozen, 'experiments/logical-working-materials.ts');
    writeFileSync(engine, readFileSync(engine, 'utf8') + '\n// mechanical source drift fixture\n');
    const result = spawnSync(process.execPath, [frozenCli, 'view', 'test'], { cwd: f.cwd, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /freeze mismatch/);
    assert.equal(readFileSync(f.capturePath(), 'utf8'), bytes);
  } finally { f.close(); }
});

test('materials CLI: long capture preserves full evidence independently of concise output and imposes no quota', () => {
  const f = fixture();
  try {
    // Mechanical throughput only. Repeated test queries/actions do not establish experienced campaign length.
    const program = `
      import { runWorkingMaterialsCli } from ${JSON.stringify(new URL('../experiments/working-materials-play.ts', import.meta.url).href)};
      runWorkingMaterialsCli(['init', 'test', ${JSON.stringify(JSON.stringify(metadata))}]);
      const made = runWorkingMaterialsCli(['combine', 'test', JSON.stringify({type:'combine',a:'frame',b:'hinge'})]);
      const id = made.observation.objects.find(object => object.design === 'folding-frame').id;
      for (let i = 0; i < 204; i++) {
        const result = runWorkingMaterialsCli(['combine', 'test', JSON.stringify({type:'combine',a:id,b:id,context:{operation:i % 2 ? 'close' : 'fold'}})]);
        if (!result.accepted) throw Error('Rejected mechanical throughput transition: ' + JSON.stringify(result));
      }
      for (let i = 0; i < 3; i++) runWorkingMaterialsCli(['view', 'test']);
      runWorkingMaterialsCli(['finish', 'test', JSON.stringify({reason:'Mechanical throughput fixture ended.'})]);
      console.log(JSON.stringify(runWorkingMaterialsCli(['verify', 'test'])));
    `;
    const checked = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', program], { cwd: f.cwd, encoding: 'utf8', timeout: 360_000 })); // Full ten-map exact replay is CPU-heavy under parallel aggregate tests; no action/assertion is skipped.
    assert.equal(checked.events, 210);
    assert.equal(checked.counts.queries, 3);
    assert.equal(checked.counts.acceptedCombines, 205);
    assert.equal(checked.counts.acceptedPlayerCombines, 0, 'mechanical repetitions are not a player playtest');
    const events = f.events();
    assert.ok(events.filter(event => ['init','combine'].includes(event.command)).every(event => event.evidence.state));
    assert.ok(events.every(event => event.evidence.observation));
    const replayed = verifyMaterialsCapture(events).state;
    assert.equal(replayed.interventions, 205);
    assert.equal(events.at(-2)!.delivered, serializeMaterialsOutput(compactMaterialsView(replayed)));
    assert.ok(events.filter(event => event.command === 'combine').every(event => !JSON.parse(event.delivered).observation.campaign), 'normal transitions never repeat the entire campaign');
    assert.ok(readFileSync(f.capturePath(), 'utf8').length > events.map(event => event.delivered.length).reduce((a,b) => a+b,0), 'full exact evidence is additional to delivered summaries');
  } finally { f.close(); }
});


test('materials CLI: complete goal cards are opt-in; normal actions show only changed actual objects', () => {
  const f = fixture();
  try {
    f.run('init','test',JSON.stringify(metadata));
    const goals = f.run('goals','test'), campaign = f.run('campaign','test');
    assert.ok(goals.every((goal:{requirement:string;rows:string[];checks:object}) => goal.requirement && goal.rows.length && Object.keys(goal.checks).length));
    assert.equal(campaign.length,createWorkingMaterials().boards.length);
    assert.ok(campaign.every((board:{goals:unknown[]})=>board.goals.length));
    const first = f.run('combine','test',JSON.stringify(combine('frame','place:camp')));
    const id = first.observation.objects[0].id;
    const second = f.run('combine','test',JSON.stringify(combine('tray','place:camp')));
    assert.equal(second.observation.objects.length,1);
    assert.notEqual(second.observation.objects[0].id,id);
    assert.equal(second.observation.goals.length,goals.length);
    const view = f.run('view','test');
    assert.equal(view.objects.length,2);
    assert.ok(!('campaign' in view));
    const verified = verifyMaterialsCapture(f.events());
    assert.equal(verified.counts.queries,3);
    assert.equal(verified.counts.acceptedCombines,2);
  } finally { f.close(); }
});

test('materials CLI: altered full evidence is rejected even if concise stdout and hashes are re-sealed', () => {
  const f = fixture();
  try {
    f.run('init','test',JSON.stringify(metadata));
    f.run('preview','test',JSON.stringify(combine('frame','clear-film')));
    f.run('combine','test',JSON.stringify(combine('frame','clear-film')));
    for (const index of [0,1,2]) {
      const events=structuredClone(f.events());
      events[index].evidence.observation.status='complete';
      for(let i=index;i<events.length;i++) { if(i) events[i].previousEventHash=events[i-1].eventHash; reseal(events[i]); }
      assert.throws(()=>verifyMaterialsCapture(events),/replay mismatch/);
    }
    const events=structuredClone(f.events());
    events[1].evidence.preview!.state.serial++;
    for(let i=1;i<events.length;i++) {events[i].previousEventHash=events[i-1].eventHash;reseal(events[i]);}
    assert.throws(()=>verifyMaterialsCapture(events),/replay mismatch/);
  } finally { f.close(); }
});


test('materials CLI: material contexts, exact transformed preview and local public inspection are captured unchanged', () => {
  const f = fixture();
  try {
    f.run('init','test',JSON.stringify(metadata));
    const action={type:'combine',a:'fiber',b:'binder',context:{operation:'transform',recipe:'bind'}};
    const forecast=f.run('preview','test',JSON.stringify(action));
    assert.equal(forecast.accepted,true,JSON.stringify(forecast));
    const made=f.run('combine','test',JSON.stringify(action));
    assert.equal(made.accepted,true,JSON.stringify(made));
    assert.deepEqual(made.observation,forecast.observation);
    const event=f.events().at(-1)!;
    assert.equal(event.arguments[0],JSON.stringify(action));
    assert.deepEqual(event.evidence.state!.lastAction,action);
    const id=made.observation.objects[0].id;
    const inspected=f.run('inspect','test',id);
    assert.equal(inspected.selectedPart.surface.rigidity,'flexible');
    assert.equal(inspected.selectedPart.surface.permeability,'watertight');
    assert.ok(inspected.selectedPart.provenance.length);
    assert.equal(f.run('verify','test').counts.acceptedCombines,1);
  } finally { f.close(); }
});

test('materials CLI: a historical success is not displayed as current-goal completion', () => {
  const state=createWorkingMaterials();
  state.boards.find(board=>board.id==='landing')!.achieved.garden=0;
  const goal=compactMaterialsView(state).goals.find(goal=>goal.id==='garden')!;
  assert.equal(goal.mode,'current');
  assert.equal(goal.achieved,true);
  assert.equal(goal.current,false);
  assert.equal(goal.satisfied,false);
});
