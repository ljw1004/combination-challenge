# Worker-backed campaign autosave

## Result

The expensive `CCSP1` codec now runs in a dedicated module Worker during normal
play. One active encode and one newest pending capture bound the queue. Replies
from superseded revisions, retired workers, and duplicate/out-of-order requests
cannot overwrite the current save. “Saved on this device” is emitted **only after
`localStorage.setItem` returns successfully**; queued, encoding, failed, or timed
out work is never reported as saved.

All 100 history snapshots remain present. The existing codec remains lossless
and expands repeated objects independently. Legacy plain JSON is still decoded
by `decodeSave`; `M.restore` remains the game-semantic validation gate. No engine,
scenario, frozen fixture, or historical size evidence was changed by this work.

## Files

- `ui/save-autosave.ts`: controller API, queue, errors, retries, lifecycle safety.
- `ui/save-worker.ts`: dedicated Worker entry, no `localStorage` access.
- `ui/save-worker-core.ts`: typed request/reply and directly tested codec handler.
- `ui/save-codec.ts`: existing codec; two explicit narrowing casts added for the
  current TypeScript checker, no format or runtime behavior changes.

The Worker constructor uses `new Worker(new URL('./save-worker.ts', import.meta.url),
{type: 'module', name: 'campaign-save'})`. Vite can bundle this standard module
Worker form. Source typechecks with `ES2022,DOM`; a separate `WebWorker` lib is not
required. Production-asset loading still needs the Site/browser integration check.

## Exact controller integration

```ts
import {decodeSave} from './save-codec.ts';
import {createAutosave, installSaveLifecycle} from './save-autosave.ts';

// Keep the controller's existing try/catch and M.restore semantic validation.
const raw = localStorage.getItem(key);
if (raw !== null) {
  const saved = decodeSave(raw);
  game = M.restore(scenario, JSON.stringify(saved.game));
  tops = saved.tops;
  seen = saved.seen;
  debugName = saved.debugName ?? '';
}

const autosave = createAutosave({
  key,
  onStatus(status) {
    // Update only the status/retry DOM, not the whole board or active gesture.
    statusElement.textContent = status.message;
    retryButton.hidden = status.state !== 'error';
  },
});
const save = () => autosave.enqueue(() => ({game, tops, seen, debugName}));
const removeLifecycle = installSaveLifecycle(autosave, window, document);
retryButton.onclick = () => autosave.retry();
```

`createAutosave` does not invoke `onStatus` during construction. The status has
`state: 'idle' | 'saving' | 'saved' | 'error'`, `revision`, `savedRevision`, and
`message`. `idle` makes no saved claim. Do not clear an error merely because
encoding was retried; wait for actual storage success.

### Snapshot capture and paint

**Use the factory overload shown above.** It reads the current controller state
when the queue dispatches, not a historical value at the moment of `enqueue`.
The factory must be pure and synchronous, and every game/UI persistence mutation
must call `save`. This matches the immutable engine-game replacement pattern.
A burst of changes captures only the newest state; native `Worker.postMessage`
then clones it once, isolating subsequent main-thread mutations. Never mutate
the snapshot from inside a factory or trigger another enqueue from that factory.

An animation frame followed by a task gives updated DOM a paint opportunity
before this native clone. A nominal 100 ms timer falls back if animation frames
are paused; browser scheduling may throttle timers too. Without animation-frame
support, a normal task is used. This is not a frame-time guarantee.

`enqueue(value)` is also available for callers that require an exact immediate
value snapshot. It performs `structuredClone` immediately, then the worker clone
later. It protects caller mutation but is deliberately **not** the recommended
large-game path, because it doubles cloning work.

### Completion, errors, and navigation

- `flush(): Promise<void>` resolves after the revision current at the call (or a
  newer revision) has actually been written. It rejects on storage/encoding/
  worker failure, or disposal while dirty. Calling it in the error state rejects
  until `retry()` or a new valid enqueue is attempted.
- `retry()` retains and retries the newest dirty capture; it never clears the
  existing stored bytes first. Failed `setItem` leaves the prior durable save.
- Worker creation, posting, message-deserialization, runtime errors, malformed
  replies, and a 30-second watchdog all produce an honest error. There is no
  silent per-action synchronous fallback, no trimming, and no partial save.
- Guard normal in-app navigation with `await autosave.flush()`; on rejection,
  stay on the page, show Retry, and only discard after explicit user choice.
  Invalidate stale navigation intents if the user plays again while awaiting.
- `dispose()` cancels timers/worker and rejects dirty waiters; it does **not** save.
  For normal teardown, flush first, remove lifecycle listeners, then dispose.
- Concurrent tabs are not coordinated; revisions order one controller instance,
  not all same-origin tabs. This adapter is not cross-tab conflict resolution.

### Reload, hide, and unload

`installSaveLifecycle` calls `flushSync()` when the document becomes hidden and
on `pagehide`. `beforeunload` also tries that full compact save; if it fails, it
requests the browser's generic unsaved-changes prompt. The fallback cancels any
scheduled paint/task and terminates/invalidate the worker before writing the
newest full snapshot, so a late reply cannot overwrite it. Repeated clean
lifecycle events do not rewrite data. A restored BFCache page can enqueue again
and lazily create a new worker.

`flushSync()` uses the lossless compact codec, not giant plain JSON and not a
shortened history. It can block for hundreds of milliseconds; it is reserved
for lifecycle/manual last-chance use, not routine gameplay. It returns `false`
on failure and preserves the prior stored value.

**Mobile OS termination can omit all lifecycle events.** Browsers can suppress
beforeunload prompts, storage can be unavailable/full/cleared, and returning from
`setItem` is not a promise of physical-disk durability. Therefore wait for the
visible Saved status before intentionally leaving. No adapter can promise the
very latest in-flight action survives an abrupt process kill. Restore decoding
and engine validation still run synchronously; this change offloads autosave
compression, not the entire boot/restore path.

## Verification

```
node --experimental-strip-types --test reviews/persistence/save-autosave.test.ts
node --experimental-strip-types reviews/persistence/save-worker.performance.ts
```

16 tests pass: deferred/burst capture, all100/no-alias restore, delayed/out-of-order/
duplicate replies, flush promises, previous-save retention after quota errors,
retry, stale errors, unavailable/crashed/hung workers, message/post failures,
invalid replies, observer exceptions, input-clone failure, disposal, lifecycle
flush, unsaved-change prompt, cleanup, paint opportunity, paused-frame fallback,
and exactly-once cancellation of both paint/fallback when a lifecycle flush wins.

The real `worker_threads` performance harness uses the exact browser worker
request/codec/reply implementation (with a Node-only transport bridge). All three
complete frozen/v5 routes compare byte-exact output, engine restore, and every
one of the 100 undos after widths 320, 600, and 375. Existing
`save-codec.test.ts`/`size-evidence.json` are retained unchanged; the new harness
writes only `worker-performance-evidence.json`.

| Local Node run | Old main encode | Standalone structuredClone | New enqueue (3 calls) | Single main postMessage clone | Async save wall time |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mars | 384.21 ms | 79.31 ms | 0.25 ms | 40.67 ms | 527.90 ms |
| Ideas | 229.55 ms | 91.87 ms | 0.05 ms | 40.65 ms | 435.83 ms |
| Elements | 141.52 ms | 40.52 ms | 0.08 ms | 23.89 ms | 292.85 ms |

During async saves, 48/39/25 main-loop 10 ms heartbeat callbacks ran respectively.
Maximum heartbeat gaps were 46.67/43.65/28.57 ms, consistent with the remaining
native clone cost. Synchronous lifecycle fallback took 236.34/296.03/136.32 ms.
This supports removing hundreds of milliseconds of compression from the main
loop, **not** claiming hitch-free animation. These are single unthrottled Node
measurements with an in-memory storage spy; not browser/mobile timings, browser
frame rates, localStorage-write timings, or device quota guarantees.

Browser integration QA belongs to the controller/Site owner: verify production
Worker assets, Saving → Saved, rapid changes ending in the newest state, reload
of a full checkpoint with its debug marker/undo, navigation while saving, and
visible storage error/retry behavior. Native iOS/Android process-kill safety
cannot be inferred from desktop/headless browser checks.
