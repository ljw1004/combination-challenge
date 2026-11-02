export interface ArtworkSize { width: number; height: number }
interface Entry {
  url: string; size?: ArtworkSize; failed: boolean; retryAfter: number;
  status: 'queued' | 'loading' | 'retrying' | 'complete'; required: boolean; attempts: number;
  ready: Promise<void>; resolve(): void; controller?: AbortController; timer?: ReturnType<typeof setTimeout>;
}

/** One bounded queue for visible artwork and replaceable, one-step lookahead. */
export class ArtworkLoader {
  private entries = new Map<string, Entry>();
  private wanted = new Set<string>();
  private active = 0;
  private load: typeof loadArtworkImage;
  private concurrency: number;
  private retryDelays: number[];
  private retryCooldown: number;

  constructor(
    load = loadArtworkImage,
    concurrency = 4,
    retryDelays = [250, 1000],
    retryCooldown = 30_000,
  ) {
    this.load = load; this.concurrency = concurrency; this.retryDelays = retryDelays; this.retryCooldown = retryCooldown;
  }

  get(url: string) { return this.entries.get(url); }

  retryFailures() {
    for (const entry of this.entries.values()) if (entry.failed) entry.retryAfter = 0;
  }

  /** Required images jump ahead of queued speculative work. Successful loads stay cached. */
  prepare(urls: Iterable<string>): Promise<void> | undefined {
    const pending = [...new Set(urls)].flatMap(url => {
      const entry = this.ensure(url, true);
      return entry.status === 'complete' ? [] : [entry.ready];
    });
    this.drain();
    return pending.length ? Promise.all(pending).then(() => {}) : undefined;
  }

  /** Replace the lookahead, cancelling obsolete requests instead of accumulating a story. */
  preload(urls: Iterable<string>) {
    this.wanted = new Set(urls);
    for (const entry of this.entries.values()) {
      if (entry.required || this.wanted.has(entry.url) || entry.status === 'complete') continue;
      this.entries.delete(entry.url);
      clearTimeout(entry.timer); entry.controller?.abort(); entry.resolve();
    }
    for (const url of this.wanted) this.ensure(url, false);
    this.drain();
  }

  private ensure(url: string, required: boolean): Entry {
    const existing = this.entries.get(url);
    if (existing && !(existing.failed && Date.now() >= existing.retryAfter)) {
      if (required && existing.status !== 'complete') existing.required = true;
      return existing;
    }
    let resolve!: () => void;
    const ready = new Promise<void>(done => { resolve = done; });
    const entry: Entry = {url, failed: false, retryAfter: 0, status: 'queued', required, attempts: 0, ready, resolve};
    this.entries.set(url, entry);
    return entry;
  }

  private drain() {
    while (this.active < this.concurrency) {
      const queued = [...this.entries.values()].filter(entry => entry.status === 'queued');
      const entry = queued.find(entry => entry.required) ?? queued[0];
      if (!entry) return;
      entry.status = 'loading'; entry.attempts++; this.active++;
      const controller = entry.controller = new AbortController();
      void this.load(entry.url, controller.signal).then(size => {
        if (this.entries.get(entry.url) !== entry) return;
        entry.size = size; entry.failed = false; entry.status = 'complete'; entry.resolve();
      }, () => {
        if (this.entries.get(entry.url) !== entry) return;
        const delay = this.retryDelays[entry.attempts - 1];
        if (delay !== undefined) {
          entry.status = 'retrying';
          entry.timer = setTimeout(() => { entry.status = 'queued'; this.drain(); }, delay);
        } else {
          entry.failed = true; entry.status = 'complete'; entry.retryAfter = Date.now() + this.retryCooldown; entry.resolve();
        }
      }).finally(() => { this.active--; this.drain(); });
    }
  }
}

/** Decode before revealing a scene; aborts and timeouts release the browser request too. */
export function loadArtworkImage(url: string, signal: AbortSignal): Promise<ArtworkSize> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true; clearTimeout(timeout);
      signal.removeEventListener('abort', abort); image.onload = null; image.onerror = null;
      if (error) { image.removeAttribute('src'); reject(error); }
      else resolve({width: image.naturalWidth, height: image.naturalHeight});
    };
    const abort = () => finish(new Error('Artwork request cancelled'));
    const timeout = setTimeout(() => finish(new Error('Artwork request timed out')), 8000);
    signal.addEventListener('abort', abort, {once: true});
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) { finish(new Error('Empty artwork')); return; }
      void image.decode().then(() => finish(), () => finish(new Error('Artwork could not be decoded')));
    };
    image.onerror = () => finish(new Error('Artwork could not be loaded'));
    if (signal.aborted) abort(); else image.src = url;
  });
}
