import test from 'node:test';
import assert from 'node:assert/strict';
import {createAutosave, installSaveLifecycle, type SaveStatus, type SaveWorker} from '../../ui/save-autosave.ts';
import {decodeSave, encodeSave, type SaveEnvelope} from '../../ui/save-codec.ts';
import {encodeSaveRequest, type SaveRequest, type SaveReply} from '../../ui/save-worker-core.ts';

const tick = (ms = 8) => new Promise(resolve => setTimeout(resolve, ms));
const wrap = (n = 0): SaveEnvelope => ({game: {n, history: Array.from({length: 100}, () => ({tokens: [{id: 'x', slots: {one: 'a'}}]}))}, tops: {a: n}, seen: [n], debugName: '雪 🚀'});
class FakeWorker implements SaveWorker {
 onmessage: SaveWorker['onmessage'] = null;
 onerror: SaveWorker['onerror'] = null;
 onmessageerror: SaveWorker['onmessageerror'] = null;
 requests: SaveRequest[] = [];
 terminated = false;
 failPost = false;
 postMessage(request: SaveRequest) { if (this.failPost) throw new Error('DataCloneError'); this.requests.push(structuredClone(request)); }
 terminate() { this.terminated = true; }
 reply(index = 0) { this.emit(encodeSaveRequest(this.requests[index])); }
 emit(reply: unknown) { this.onmessage?.({data: reply} as MessageEvent); }
 crash() { this.onerror?.({message: 'Worker crashed', preventDefault() {}} as ErrorEvent); }
}
function harness(extra = {}) {
 const writes: {key: string; raw: string}[] = [], statuses: SaveStatus[] = [], workers: FakeWorker[] = [];
 let failWrite = false;
 const storage = {setItem(key: string, raw: string) { if (failWrite) throw new Error('QuotaExceededError'); writes.push({key, raw}); }};
 const save = createAutosave({key: 'campaign:test', storage, createWorker: () => {const worker = new FakeWorker(); workers.push(worker); return worker;}, onStatus: status => statuses.push(status), ...extra});
 return {save, writes, statuses, workers, storage, failWrites: (value: boolean) => {failWrite = value;}};
}
test('construction/idle does not claim saved or invoke callbacks; factory capture deferred and coalesced', async () => {
 const h = harness(); assert.equal(h.statuses.length, 0); assert.equal(h.save.getStatus().state, 'idle');
 await h.save.flush(); assert.equal(h.workers.length, 0);
 let captures = 0, current = wrap(1);
 h.save.enqueue(() => {captures++; return current;}); current = wrap(2);
 h.save.enqueue(() => {captures++; return current;}); current = wrap(3);
 h.save.enqueue(() => {captures++; return current;});
 assert.equal(captures, 0); assert.equal(h.save.getStatus().state, 'saving'); assert.equal(h.writes.length, 0);
 await tick(); assert.equal(captures, 1); assert.equal(h.workers.length, 1); assert.equal(h.workers[0].requests.length, 1);
 assert.equal(h.workers[0].requests[0].revision, 3);
 let flushed = false; const pending = h.save.flush().then(() => {flushed = true;}); await Promise.resolve(); assert(!flushed);
 h.workers[0].reply(); await pending; assert(flushed); assert.equal(h.save.getStatus().state, 'saved'); assert.equal(h.save.getStatus().savedRevision, 3);
 assert.deepEqual(decodeSave(h.writes[0].raw), current); h.save.dispose();
});
test('delayed/out-of-order/duplicate responses never store superseded snapshots; latest wins once', async () => {
 const h = harness(); h.save.enqueue(wrap(1)); await tick(); const worker = h.workers[0];
 const firstFlush = h.save.flush(); h.save.enqueue(wrap(2)); h.save.enqueue(wrap(3)); const latestFlush = h.save.flush();
 worker.emit({type: 'encoded', revision: 3, encoded: encodeSave(wrap(99))}); assert.equal(h.writes.length, 0, 'unsolicited future reply ignored');
 worker.reply(0); assert.equal(h.writes.length, 0, 'superseded reply ignored'); await tick();
 assert.deepEqual(worker.requests.map(r => r.revision), [1, 3]);
 worker.reply(0); worker.emit({type: 'encoded', revision: 2, encoded: encodeSave(wrap(2))}); assert.equal(h.writes.length, 0);
 worker.reply(1); await Promise.all([firstFlush, latestFlush]); worker.reply(0); worker.reply(1);
 assert.equal(h.writes.length, 1); assert.deepEqual(decodeSave(h.writes[0].raw), wrap(3)); h.save.dispose();
});
test('value capture and worker clone isolate mutations; full 100 history decoded with no shared identities', async () => {
 const h = harness(); const value = wrap(5); h.save.enqueue(value);
 (value.game as any).n = 99; (value.game as any).history[0].tokens[0].slots.one = 'mutated'; value.seen.push(9);
 await tick(); h.workers[0].reply(); await h.save.flush();
 const decoded = decodeSave(h.writes[0].raw); assert.deepEqual(decoded, wrap(5));
 const history = (decoded.game as any).history; assert.equal(history.length, 100);
 history[0].tokens[0].slots.one = 'changed'; assert.equal(history[99].tokens[0].slots.one, 'a');
 h.save.enqueue(() => value); await tick(); (value.game as any).n = 100; h.workers[0].reply(1);
 assert.equal((decodeSave(h.writes[1].raw).game as any).n, 99, 'postMessage captured the factory result'); h.save.dispose();
});
test('storage error keeps previous saved value, rejects flush and supports explicit retry', async () => {
 const h = harness(); h.save.enqueue(wrap(1)); await tick(); h.workers[0].reply();
 const original = h.writes[0].raw; h.failWrites(true); h.save.enqueue(wrap(2)); await tick();
 const rejected = assert.rejects(h.save.flush(), /Quota/); h.workers[0].reply(1); await rejected;
 assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.save.getStatus().savedRevision, 1); assert.equal(h.writes.length, 1); assert.equal(h.writes[0].raw, original);
 await assert.rejects(h.save.flush(), /not saved/); h.failWrites(false); h.save.retry(); await tick(); h.workers[1].reply(); await h.save.flush();
 assert.equal(h.save.getStatus().savedRevision, 2); assert.deepEqual(decodeSave(h.writes[1].raw), wrap(2)); h.save.dispose();
});
test('stale encode errors do not hide the pending newest save; current encode errors surface', async () => {
 const h = harness(); h.save.enqueue(wrap(1)); await tick(); const worker = h.workers[0]; h.save.enqueue(wrap(2));
 worker.emit({type: 'encode-error', revision: 1, message: 'stale error'}); await tick(); assert.equal(h.save.getStatus().state, 'saving');
 const rejection = assert.rejects(h.save.flush(), /encode failed/);
 worker.emit({type: 'encode-error', revision: 2, message: 'encode failed'}); await rejection;
 assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.writes.length, 0); assert(worker.terminated); h.save.dispose();
});
test('worker creation failure is honest and retry recovers without main-thread codec fallback', async () => {
 let attempts = 0; const worker = new FakeWorker();
 const h = harness({createWorker: () => {if (++attempts === 1) throw new Error('Worker blocked by policy'); return worker;}});
 h.save.enqueue(wrap(1)); const rejection = assert.rejects(h.save.flush(), /blocked/); await tick(); await rejection;
 assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.writes.length, 0);
 h.save.retry(); await tick(); worker.reply(); await h.save.flush(); assert.equal(h.writes.length, 1); h.save.dispose();
});
test('postMessage, crash, messageerror, and malformed reply failures preserve dirty state', async () => {
 for (const mode of ['post', 'crash', 'message', 'malformed']) {
  const worker = new FakeWorker(); if (mode === 'post') worker.failPost = true;
  const h = harness({createWorker: () => worker}); h.save.enqueue(wrap(1));
  const rejection = assert.rejects(h.save.flush()); await tick();
  if (mode === 'crash') worker.crash();
  if (mode === 'message') worker.onmessageerror?.({} as MessageEvent);
  if (mode === 'malformed') worker.emit({type: 'nonsense', revision: 1});
  await rejection; assert.equal(h.save.getStatus().state, 'error', mode); assert.equal(h.save.getStatus().savedRevision, 0); assert.equal(h.writes.length, 0); h.save.dispose();
 }
});
test('timeout retires worker; retry ignores responses from the retired worker generation', async () => {
 const h = harness({timeoutMs: 20}); h.save.enqueue(wrap(1)); await tick(); const retired = h.workers[0].onmessage!;
 await assert.rejects(h.save.flush(), /timed out/); assert.equal(h.save.getStatus().state, 'error');
 h.save.retry(); await tick(); retired({data: encodeSaveRequest(h.workers[0].requests[0])} as MessageEvent);
 assert.equal(h.writes.length, 0); h.workers[1].reply(); await h.save.flush(); assert.equal(h.writes.length, 1); h.save.dispose();
});
test('flushSync stores newest full snapshot and retires every late async response', async () => {
 const h = harness(); let current = wrap(1); h.save.enqueue(() => current); await tick(); const retired = h.workers[0].onmessage!;
 current = wrap(2); h.save.enqueue(() => current); const waiter = h.save.flush(); assert(h.save.flushSync()); await waiter;
 assert.equal(h.save.getStatus().state, 'saved'); assert.deepEqual(decodeSave(h.writes[0].raw), wrap(2));
 retired({data: encodeSaveRequest(h.workers[0].requests[0])} as MessageEvent); await tick(); assert.equal(h.writes.length, 1);
 assert(h.save.flushSync()); assert.equal(h.writes.length, 1, 'clean lifecycle calls do not rewrite'); h.save.dispose();
});
test('sync storage/capture failure cannot claim saved, and explicit retry retains the latest factory', async () => {
 const h = harness(); let broken = true;
 h.save.enqueue(() => {if (broken) throw new Error('snapshot unavailable'); return wrap(2);}); assert.equal(h.save.flushSync(), false);
 assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.writes.length, 0);
 broken = false; h.failWrites(true); assert.equal(h.save.flushSync(), false); assert.equal(h.writes.length, 0);
 h.failWrites(false); assert(h.save.flushSync()); assert.equal(h.save.getStatus().savedRevision, 1); h.save.dispose();
});
test('hidden/pagehide save newest, beforeunload prompts on failure, cleanup removes listeners', () => {
 const h = harness(); const win = new EventTarget(), doc = Object.assign(new EventTarget(), {visibilityState: 'visible'});
 const cleanup = installSaveLifecycle(h.save, win as any, doc as any);
 h.save.enqueue(wrap(1)); doc.dispatchEvent(new Event('visibilitychange')); assert.equal(h.writes.length, 0);
 doc.visibilityState = 'hidden'; doc.dispatchEvent(new Event('visibilitychange')); assert.equal(h.writes.length, 1);
 h.save.enqueue(wrap(2)); win.dispatchEvent(new Event('pagehide')); assert.equal(h.writes.length, 2);
 h.save.enqueue(wrap(3)); h.failWrites(true); const event = new Event('beforeunload', {cancelable: true}); win.dispatchEvent(event);
 assert(event.defaultPrevented); assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.writes.length, 2);
 h.failWrites(false); cleanup(); win.dispatchEvent(new Event('pagehide')); assert.equal(h.writes.length, 2); h.save.dispose();
});
test('dispose rejects outstanding flush, cancels dispatch and never saves or reopens', async () => {
 const h = harness(); h.save.enqueue(wrap(1)); const rejection = assert.rejects(h.save.flush(), /disposed/); h.save.dispose(); await rejection; await tick();
 assert.equal(h.workers.length, 0); assert.equal(h.writes.length, 0); assert.throws(() => h.save.enqueue(wrap(2)), /disposed/); assert.equal(h.save.flushSync(), false);
 await assert.rejects(h.save.flush(), /disposed/); h.save.retry();
});
test('observer exceptions do not turn successfully persisted bytes into a save error', async () => {
 const h = harness({onStatus: () => {throw new Error('UI failure');}}); h.save.enqueue(wrap(1)); await tick(); h.workers[0].reply();
 await h.save.flush(); assert.equal(h.save.getStatus().state, 'saved'); assert.equal(h.writes.length, 1); h.save.dispose();
});
test('invalid value snapshot fails without saving a previous revision as the new one', () => {
 const h = harness(); h.save.enqueue(wrap(1)); h.save.enqueue({...wrap(2), game: {executable() {}}});
 assert.equal(h.save.getStatus().state, 'error'); assert.equal(h.save.flushSync(), false); assert.equal(h.writes.length, 0); h.save.dispose();
});
test('worker protocol handles invalid envelopes/errors, legacy JSON remains readable', () => {
 const result: SaveReply = encodeSaveRequest({type: 'encode', revision: 7, snapshot: wrap(4)});
 assert.equal(result.type, 'encoded'); if (result.type === 'encoded') assert.deepEqual(decodeSave(result.encoded), wrap(4));
 assert.equal(encodeSaveRequest({type: 'bad', revision: 7} as any).type, 'encode-error');
 assert.equal(encodeSaveRequest({type: 'encode', revision: 7, snapshot: {game: {}, tops: {}, seen: [-1]}}).type, 'encode-error');
 assert.deepEqual(decodeSave(JSON.stringify(wrap(4))), wrap(4));
});
test('browser dispatch gives a paint opportunity; hidden/throttled animation frames have a bounded fallback', async () => {
 const originalRequest = globalThis.requestAnimationFrame, originalCancel = globalThis.cancelAnimationFrame;
 let frame: FrameRequestCallback | undefined, cancellations = 0;
 globalThis.requestAnimationFrame = callback => {frame = callback; return 7;};
 globalThis.cancelAnimationFrame = () => {cancellations++; frame = undefined;};
 try {
  const h = harness(); h.save.enqueue(() => wrap(1)); await tick(); assert.equal(h.workers.length, 0, 'not posted before paint callback');
  frame!(0); await tick(); h.workers[0].reply(); await h.save.flush(); h.save.dispose();
  const hidden = harness(); hidden.save.enqueue(() => wrap(2)); await tick(120);
  assert.equal(hidden.workers.length, 1, 'timer fallback works if frame never arrives'); assert(cancellations > 0);
  hidden.workers[0].reply(); await hidden.save.flush(); hidden.save.dispose();
  const lifecycle = harness(); lifecycle.save.enqueue(() => wrap(3)); const canceledBefore = cancellations;
  assert(lifecycle.save.flushSync()); assert.equal(cancellations, canceledBefore + 1, 'flush cancels scheduled paint callback once');
  assert(lifecycle.save.flushSync()); await tick(120);
  assert.equal(lifecycle.workers.length, 0, 'flush also canceled timer fallback'); assert.equal(lifecycle.writes.length, 1); lifecycle.save.dispose();
 } finally {
  if (originalRequest) globalThis.requestAnimationFrame = originalRequest; else delete (globalThis as any).requestAnimationFrame;
  if (originalCancel) globalThis.cancelAnimationFrame = originalCancel; else delete (globalThis as any).cancelAnimationFrame;
 }
});
