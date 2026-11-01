/** Opt-in development diagnostics. No listeners or per-move console output while disabled. */
interface TraceEntry {
  sequence: number;
  receivedAt: number;
  type: string;
  details: unknown;
  state: unknown;
}
interface TraceControls {
  start(): string;
  stop(): string;
  json(): string;
}
declare global {
  interface Window {dragTrace?: TraceControls}
}
const storageKey = 'combination-drag-trace-v1';
const limit = 4000;

function targetName(target: EventTarget | null): string | null {
  if (target === window) return 'window';
  if (target === document) return 'document';
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>('[data-item],[data-hotspot],[data-command]');
  return item?.dataset.item ?? (item?.dataset.hotspot ? `hotspot:${item.dataset.hotspot}` : item?.dataset.command ? `command:${item.dataset.command}` : target.id ? `#${target.id}` : target.tagName.toLowerCase());
}
function eventDetails(event: Event) {
  const details: Record<string, unknown> = {
    timeStamp: event.timeStamp, target: targetName(event.target), trusted: event.isTrusted,
    defaultPrevented: event.defaultPrevented,
  };
  if (event instanceof MouseEvent) Object.assign(details, {
    clientX: event.clientX, clientY: event.clientY, pageX: event.pageX, pageY: event.pageY,
    screenX: event.screenX, screenY: event.screenY, button: event.button, buttons: event.buttons,
    movementX: event.movementX, movementY: event.movementY, detail: event.detail,
    altKey: event.altKey, ctrlKey: event.ctrlKey, metaKey: event.metaKey, shiftKey: event.shiftKey,
    relatedTarget: targetName(event.relatedTarget),
  });
  if (event instanceof PointerEvent) Object.assign(details, {
    pointerId: event.pointerId, pointerType: event.pointerType, isPrimary: event.isPrimary,
    pressure: event.pressure,
    coalesced: event.type === 'pointermove' ? event.getCoalescedEvents?.().map(sample => ({
      timeStamp: sample.timeStamp, clientX: sample.clientX, clientY: sample.clientY, buttons: sample.buttons,
    })) : undefined,
  });
  if (event instanceof FocusEvent) details.relatedTarget = targetName(event.relatedTarget);
  if (event instanceof ErrorEvent) Object.assign(details, {message: event.message, stack: event.error?.stack});
  if (event instanceof PromiseRejectionEvent) details.error = String(event.reason?.stack ?? event.reason);
  return details;
}

export class DragTrace {
  private entries: TraceEntry[] = [];
  private sequence = 0;
  private dropped = 0;
  private listeners?: AbortController;
  private metadata: unknown;
  private recovered?: string;

  constructor(private root: HTMLElement, private snapshot: () => unknown) {
    try { this.recovered = sessionStorage.getItem(storageKey) ?? undefined; } catch { /* Optional diagnostics storage. */ }
    window.dragTrace = {start: () => this.start(), stop: () => this.stop(), json: () => this.json()};
  }

  get enabled() { return !!this.listeners; }

  record(type: string, details?: unknown) {
    if (!this.enabled) return;
    if (this.entries.length === limit) { this.entries.shift(); this.dropped++; }
    // Copy now: developer-tools object inspection must not show later game state.
    this.entries.push({sequence: ++this.sequence, receivedAt: performance.now(), type,
      details: structuredClone(details), state: structuredClone(this.snapshot())});
  }

  private start() {
    this.listeners?.abort();
    this.entries = []; this.sequence = 0; this.dropped = 0; this.recovered = undefined;
    try { sessionStorage.removeItem(storageKey); } catch { /* Recording remains in memory. */ }
    this.metadata = {
      startedAt: new Date().toISOString(), timeOrigin: performance.timeOrigin,
      page: location.pathname, story: new URLSearchParams(location.search).get('story'),
      userAgent: navigator.userAgent, viewport: {width: innerWidth, height: innerHeight, devicePixelRatio},
      game: {width: this.root.clientWidth, height: this.root.clientHeight},
    };
    this.listeners = new AbortController();
    const options = {capture: true, passive: true, signal: this.listeners.signal};
    const input = (event: Event) => this.record(`event:${event.type}`, eventDetails(event));
    for (const type of ['pointerdown','pointermove','pointerup','pointercancel','gotpointercapture','lostpointercapture',
      'pointerover','pointerout','mousedown','mousemove','mouseup','click','dblclick','dragstart','dragend',
      'focus','blur','focusin','focusout','resize','scroll','visibilitychange','error','unhandledrejection']) {
      window.addEventListener(type, input, options);
    }
    window.addEventListener('pagehide', event => {
      this.record('event:pagehide', eventDetails(event));
      // A dev-server reload can itself interrupt a gesture; keep that final trace retrievable.
      try { sessionStorage.setItem(storageKey, this.json()); } catch { /* Optional diagnostics storage. */ }
    }, options);
    this.record('trace:start');
    return 'Recording. Try a fast drag, then a slow drag; run copy(dragTrace.stop()) to copy the trace.';
  }

  private stop() {
    this.record('trace:stop');
    this.listeners?.abort(); this.listeners = undefined;
    return this.json();
  }

  private json() {
    if (!this.entries.length && this.recovered) return this.recovered;
    return JSON.stringify({format: storageKey, metadata: this.metadata, dropped: this.dropped, entries: this.entries}, null, 2);
  }
}
