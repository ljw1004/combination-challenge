import {encodeSave, MAX_SAVE_CHARACTERS, type SaveEnvelope} from './save-codec.ts';
import type {SaveRequest} from './save-worker-core.ts';

export type SaveStatus = Readonly<{
 state: 'idle' | 'saving' | 'saved' | 'error';
 revision: number;
 savedRevision: number;
 message: string;
}>;
export interface SaveWorker {
 onmessage: ((event: MessageEvent) => void) | null;
 onerror: ((event: ErrorEvent) => void) | null;
 onmessageerror: ((event: MessageEvent) => void) | null;
 postMessage(request: SaveRequest): void;
 terminate(): void;
}
export interface AutosaveOptions {
 key: string;
 storage?: Pick<Storage, 'setItem'>;
 createWorker?: () => SaveWorker;
 onStatus?: (status: SaveStatus) => void;
 /** Detect unavailable/hung workers; never replace a failed save with partial data. */
 timeoutMs?: number;
}
export interface Autosave {
 /** Factory form is recommended: coalesced, deferred, one native worker clone.
  * It reads CURRENT state when dispatched, not historical state at enqueue time.
  * Keep it pure/synchronous; enqueue every controller mutation. A supplied value
  * instead is cloned immediately, for callers requiring an exact captured value.
  */
 enqueue(snapshot: SaveEnvelope | (() => SaveEnvelope)): number;
 getStatus(): SaveStatus;
 /** Resolves only once this revision (or a newer one) has reached localStorage. */
 flush(): Promise<void>;
 /** Last-chance/manual fallback only: full codec is synchronous and may be slow. */
 flushSync(): boolean;
 retry(): void;
 /** Does NOT save. Await flush before normal teardown; dirty waiters reject. */
 dispose(): void;
}
type Pending = {revision: number; capture: () => SaveEnvelope};
type Waiter = {revision: number; resolve: () => void; reject: (error: Error) => void};

/** One active encode and one newest pending capture; stale worker replies never
 * reach storage. No trimming, delta history, silent fallback, or aliased decode.
 */
export function createAutosave(options: AutosaveOptions): Autosave {
 let revision = 0, savedRevision = 0, disposed = false;
 let latest: Pending | null = null, active: Pending | null = null;
 let worker: SaveWorker | null = null;
 let dispatchTimer: ReturnType<typeof setTimeout> | undefined;
 let paintFrame: number | undefined;
 let watchdog: ReturnType<typeof setTimeout> | undefined;
 let status: SaveStatus = {state: 'idle', revision, savedRevision, message: ''};
 const waiters = new Set<Waiter>();
 const errorMessage = 'Progress is not saved. Retry before leaving this page.';
 const dirty = () => revision > savedRevision;
 function publish(state: SaveStatus['state'], message: string) {
  status = Object.freeze({state, revision, savedRevision, message});
  // Status rendering must never turn a successful storage write into a failure.
  try { options.onStatus?.(status); } catch { /* caller UI errors are not save failures */ }
 }
 function settle(error?: Error) {
  for (const waiter of waiters) {
   if (waiter.revision <= savedRevision) { waiters.delete(waiter); waiter.resolve(); }
   else if (error) { waiters.delete(waiter); waiter.reject(error); }
  }
 }
 function cancelDispatch() {
  if (dispatchTimer !== undefined) clearTimeout(dispatchTimer); dispatchTimer = undefined;
  if (paintFrame !== undefined) cancelAnimationFrame(paintFrame); paintFrame = undefined;
 }
 function clearWatchdog() { if (watchdog !== undefined) clearTimeout(watchdog); watchdog = undefined; }
 function stopWorker() {
  clearWatchdog(); active = null;
  const prior = worker; worker = null;
  if (prior) { prior.onmessage = prior.onerror = prior.onmessageerror = null; try { prior.terminate(); } catch { /* already terminated */ } }
 }
 function fail(error: unknown) {
  cancelDispatch(); stopWorker();
  publish('error', errorMessage);
  settle(error instanceof Error ? error : new Error(String(error)));
 }
 function write(encoded: string, jobRevision: number) {
  // setItem is synchronous: only its successful return can claim "saved".
  const storage = options.storage ?? globalThis.localStorage;
  storage.setItem(options.key, encoded);
  savedRevision = jobRevision;
  if (latest?.revision === jobRevision) latest = null;
  publish(dirty() ? 'saving' : 'saved', dirty() ? 'Saving…' : 'Saved on this device.');
  settle();
 }
 function schedule() {
  if (disposed || active || dispatchTimer !== undefined || !latest || !dirty()) return;
  // Let the controller's updated DOM paint before the remaining native clone.
  // The 100ms fallback also works when animation frames are suspended/throttled.
  if (typeof requestAnimationFrame === 'function') {
   dispatchTimer = setTimeout(dispatch, 100);
   paintFrame = requestAnimationFrame(() => {
    paintFrame = undefined;
    if (dispatchTimer !== undefined) clearTimeout(dispatchTimer);
    dispatchTimer = setTimeout(dispatch, 0);
   });
  } else dispatchTimer = setTimeout(dispatch, 0);
 }
 function getWorker(): SaveWorker {
  if (worker) return worker;
  const current = options.createWorker?.() ?? new Worker(new URL('./save-worker.ts', import.meta.url), {type: 'module', name: 'campaign-save'});
  worker = current;
  current.onmessage = event => {
   if (disposed || worker !== current || !active) return;
   const reply = event.data;
   // Duplicates, retired jobs, older sessions and out-of-order replies are inert.
   if (!reply || reply.revision !== active.revision) return;
   const job = active; active = null; clearWatchdog();
   if (job.revision !== revision || job.revision <= savedRevision) { schedule(); return; }
   if (reply.type !== 'encoded' || typeof reply.encoded !== 'string' || !reply.encoded.length || reply.encoded.length > MAX_SAVE_CHARACTERS) {
    fail(new Error(reply.type === 'encode-error' ? reply.message : 'Invalid campaign save worker response')); return;
   }
   try { write(reply.encoded, job.revision); } catch (error) { fail(error); return; }
   schedule();
  };
  current.onerror = event => {
   event.preventDefault?.();
   if (!disposed && worker === current) fail(new Error(event.message || 'Campaign save worker failed'));
  };
  current.onmessageerror = () => { if (!disposed && worker === current) fail(new Error('Campaign save worker message could not be read')); };
  return current;
 }
 function dispatch() {
  cancelDispatch();
  if (disposed || active || !latest || !dirty()) return;
  const job = latest;
  try {
   const current = getWorker();
   const snapshot = job.capture();
   active = job;
   // postMessage performs the only clone on the recommended factory path. The
   // game cannot subsequently mutate the worker's captured object graph.
   current.postMessage({type: 'encode', revision: job.revision, snapshot});
   watchdog = setTimeout(() => {
    if (!disposed && active === job && worker === current) fail(new Error('Campaign save worker timed out'));
   }, options.timeoutMs ?? 30_000);
  } catch (error) { fail(error); }
 }
 const api: Autosave = {
  enqueue(snapshot) {
   if (disposed) throw new Error('Campaign autosave is disposed');
   revision++;
   try {
    if (typeof snapshot === 'function') latest = {revision, capture: snapshot};
    else { const captured = structuredClone(snapshot); latest = {revision, capture: () => captured}; }
   } catch (error) { latest = null; fail(error); return revision; }
   publish('saving', 'Saving…'); schedule(); return revision;
  },
  getStatus: () => status,
  flush() {
   if (disposed) return Promise.reject(new Error('Campaign autosave is disposed'));
   if (!dirty()) return Promise.resolve();
   if (status.state === 'error') return Promise.reject(new Error(errorMessage));
   const promise = new Promise<void>((resolve, reject) => waiters.add({revision, resolve, reject}));
   schedule(); return promise;
  },
  flushSync() {
   if (disposed) return false;
   if (!dirty()) return true;
   cancelDispatch(); stopWorker();
   if (!latest) { fail(new Error('No valid campaign snapshot is available')); return false; }
   try { const job = latest; write(encodeSave(job.capture()), job.revision); return true; }
   catch (error) { fail(error); return false; }
  },
  retry() {
   if (disposed || !dirty() || !latest) return;
   publish('saving', 'Saving…'); schedule();
  },
  dispose() {
   if (disposed) return;
   disposed = true; cancelDispatch(); stopWorker(); latest = null;
   settle(new Error('Campaign autosave was disposed before saving'));
  },
 };
 // In particular, do not call onStatus during construction (controller may not
 // have assigned the returned autosave object yet).
 return api;
}

/** Best-effort lifecycle protection, not a promise of persistence after a
 * mobile OS kill. Hide/pagehide compact the newest full snapshot synchronously;
 * beforeunload prompts only if that write failed. Browsers may suppress prompts.
 * Explicit in-app navigation should await flush(), then navigate; on rejection,
 * stay on page and show Retry / an explicit discard choice.
 */
export function installSaveLifecycle(
 autosave: Autosave,
 win: Pick<Window, 'addEventListener' | 'removeEventListener'> = window,
 doc: Pick<Document, 'addEventListener' | 'removeEventListener' | 'visibilityState'> = document,
): () => void {
 const hide = () => { if (doc.visibilityState === 'hidden') autosave.flushSync(); };
 const pagehide = () => { autosave.flushSync(); };
 const beforeunload = (event: BeforeUnloadEvent) => {
  if (!autosave.flushSync()) { event.preventDefault(); event.returnValue = ''; }
 };
 doc.addEventListener('visibilitychange', hide);
 win.addEventListener('pagehide', pagehide);
 win.addEventListener('beforeunload', beforeunload);
 return () => {
  doc.removeEventListener('visibilitychange', hide);
  win.removeEventListener('pagehide', pagehide);
  win.removeEventListener('beforeunload', beforeunload);
 };
}
