import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {Worker} from 'node:worker_threads';
import {createAutosave, type SaveWorker} from '../../ui/save-autosave.ts';
import {encodeSave, decodeSave, type SaveEnvelope} from '../../ui/save-codec.ts';
import type {SaveRequest} from '../../ui/save-worker-core.ts';
import * as M from '../../frozen/v5/engine/model.ts';
import type {Action, Scenario} from '../../frozen/v5/schema/scenario.ts';

const cases = [
 ['mars', 'mars/story-expansion/scenario.json', 'mars/story-expansion/results/goal-route.json'],
 ['ideas', 'ideas/revision-v6/scenario.json', 'ideas/revision-v6/goal-route.json'],
 ['elements', 'elements/revision-v5/scenario.json', 'elements/revision-v5/solution-actions.json'],
];
const results: unknown[] = [];
for (const [name, scenarioPath, routePath] of cases) {
 const root = new URL('../../', import.meta.url);
 const scenario: Scenario = JSON.parse(readFileSync(new URL(scenarioPath, root), 'utf8'));
 const route = JSON.parse(readFileSync(new URL(routePath, root), 'utf8'));
 const actions: Action[] = Array.isArray(route) ? route : route.actions;
 const game = M.replay(scenario, actions, 360);
 assert(game.state.completed); assert.equal(game.history.length, 100);
 const value: SaveEnvelope = {game, tops: {a: 0, b: 40.5}, seen: [0, 2], debugName: 'Δ 🚀 "test"\n'};
 let start = performance.now(); const expected = encodeSave(value); const baselineEncodeMs = performance.now() - start;
 start = performance.now(); structuredClone(value); const structuredCloneMs = performance.now() - start;
 let raw: string | undefined, captures = 0, posts = 0, postMs = 0, heartbeatTicks = 0, maxHeartbeatGapMs = 0, previous = performance.now();
 const heartbeat = setInterval(() => {const now = performance.now(); heartbeatTicks++; maxHeartbeatGapMs = Math.max(maxHeartbeatGapMs, now - previous); previous = now;}, 10);
 const save = createAutosave({key: 'node-test', storage: {setItem(_key, encoded) {raw = encoded;}}, createWorker: () => {
  const worker = new Worker(new URL('./save-worker-node-fixture.ts', import.meta.url));
  const port: SaveWorker = {
   onmessage: null, onerror: null, onmessageerror: null,
   postMessage(request: SaveRequest) {const now = performance.now(); worker.postMessage(request); postMs += performance.now() - now; posts++;},
   terminate() {void worker.terminate();},
  };
  worker.on('message', data => port.onmessage?.({data} as MessageEvent));
  worker.on('error', error => port.onerror?.({message: error.message, preventDefault() {}} as ErrorEvent));
  worker.on('messageerror', () => port.onmessageerror?.({} as MessageEvent));
  return port;
 }});
 start = performance.now();
 save.enqueue(() => {captures++; return value;}); save.enqueue(() => {captures++; return value;}); save.enqueue(() => {captures++; return value;});
 const enqueueThreeMs = performance.now() - start;
 start = performance.now(); await save.flush(); const asyncSaveWallMs = performance.now() - start;
 clearInterval(heartbeat);
 assert.equal(captures, 1); assert.equal(posts, 1); assert.equal(save.getStatus().state, 'saved'); assert.equal(save.getStatus().savedRevision, 3);
 assert.equal(raw, expected, 'real worker bytes must match synchronous codec exactly');
 const decoded = decodeSave(raw!); assert.deepEqual(decoded, value);
 assert.deepEqual(M.restore(scenario, JSON.stringify(decoded.game)), M.restore(scenario, JSON.stringify(game)));
 for (const width of [320, 600, 375]) {
  let actual = M.resizeGame(decoded.game as M.Game, width), original = M.resizeGame(game, width), undos = 0;
  while (actual.history.length) {actual = M.undo(actual).game; original = M.undo(original).game; assert.deepEqual(actual, original); undos++;}
  assert.equal(undos, 100);
 }
 assert.deepEqual(decoded, value, 'resize/undo must not mutate either original or decoded data');
 save.enqueue(() => value); start = performance.now(); assert(save.flushSync()); const flushSyncMs = performance.now() - start;
 assert.equal(raw, expected); save.dispose();
 const rounded = (n: number) => +n.toFixed(2);
 const row = {name, actions: actions.length, history: game.history.length, baselineEncodeMs: rounded(baselineEncodeMs), structuredCloneMs: rounded(structuredCloneMs), enqueueThreeMs: rounded(enqueueThreeMs), postMessageMs: rounded(postMs), asyncSaveWallMs: rounded(asyncSaveWallMs), heartbeatTicksWhileSaving: heartbeatTicks, maxHeartbeatGapMs: rounded(maxHeartbeatGapMs), flushSyncMs: rounded(flushSyncMs), encodedUtf16Bytes: expected.length * 2};
 results.push(row); console.log(JSON.stringify(row));
}
const report = {
 passed: true, nodeVersion: process.version, platform: process.platform, engine: 'frozen/v5', cases: results,
 assertions: 'Real worker_threads using exact SaveRequest/encodeSaveRequest/SaveReply protocol; exact bytes, semantic restore, widths 320/600/375 and all 100 undos at each width for every route.',
 limitations: [
  'Single local Node run; not browser/native mobile timing. In-memory storage spy is not localStorage and does not measure storage quota or storage-write latency.',
  'Native postMessage object cloning still runs on the main thread and may exceed a frame budget. Factory mode avoids an extra structuredClone and defers capture/dispatch until after controller rendering.',
  'Async wall time includes worker startup and codec execution. Heartbeat shows main event loop progress during worker encoding, not browser frame rate.',
  'Synchronous lifecycle fallback is intentionally expensive and best-effort; mobile OS termination may omit visibilitychange/pagehide/beforeunload.',
 ],
};
writeFileSync(new URL('./worker-performance-evidence.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
