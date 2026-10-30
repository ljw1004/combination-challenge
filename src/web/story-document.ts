/** Story files and editor drafts are independent of game saves and resets. */
export interface DraftStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface DraftRecord {
  version: 1;
  url: string;
  assetBaseURL: string;
  text: string;
  sessionId: string;
  updatedAt: number;
  revision: string;
}

export interface DraftRead {
  draft?: DraftRecord;
  /** Other tabs' latest buffers and earlier editing sessions remain recoverable. */
  recoveries: DraftRecord[];
  /** Damaged records are preserved verbatim, never silently replaced. */
  damaged: {key: string; raw: string}[];
  warning?: string;
}

export interface DraftWrite {
  record: DraftRecord;
  persisted: boolean;
  error?: string;
  warning?: string;
}

export interface StoryDocument {
  url: string;
  assetBaseURL: string;
  text: string;
  edited: boolean;
  warning?: string;
  recoveries: DraftRecord[];
}

function httpURL(input: string | URL): URL {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Story and artwork URLs must use HTTP or HTTPS without embedded credentials.');
  }
  return url;
}

/** Identity includes the full story URL, so equal folder names on different paths cannot collide. */
export function canonicalStoryURL(input: string | URL): string {
  const url = httpURL(input);
  url.hash = '';
  return url.href;
}

export function resolveStoryURL(pageURL: string | URL): string {
  const page = httpURL(pageURL);
  const selectors = page.searchParams.getAll('story');
  if (selectors.length > 1 || (selectors.length === 1 && !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(selectors[0]))) {
    throw new Error('Choose a story folder using letters, numbers, hyphens or underscores, for example ?story=mars.');
  }
  return new URL(selectors.length ? `${selectors[0]}/story.md` : 'story.md', page).href;
}

export function resolveStoryAsset(reference: string, storyURL: string): string {
  return httpURL(new URL(reference, canonicalStoryURL(storyURL))).href;
}

function browserStorage(): DraftStorage | undefined {
  try { return globalThis.localStorage; } catch { return undefined; }
}

function editorSessionId(): string {
  // randomUUID requires a secure context; the portable player also works on an
  // ordinary HTTP development server. This ID is a namespace, not a credential.
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (globalThis.crypto?.getRandomValues) return [...globalThis.crypto.getRandomValues(new Uint32Array(4))].join('-');
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function parseRecord(raw: string, url: string): DraftRecord | undefined {
  try {
    const value = JSON.parse(raw) as Partial<DraftRecord>;
    if (value?.version !== 1 || value.url !== url || typeof value.text !== 'string' ||
      typeof value.sessionId !== 'string' || typeof value.revision !== 'string' ||
      !Number.isFinite(value.updatedAt) || typeof value.assetBaseURL !== 'string') return;
    canonicalStoryURL(value.assetBaseURL);
    return value as DraftRecord;
  } catch { return; }
}

/**
 * Every edit writes synchronously before preview work. Each live editor owns a
 * separate recovery branch, so a second tab cannot destroy its latest buffer.
 * Storage failures leave the newest buffer in memory and are reported explicitly.
 */
export class DraftStore {
  readonly url: string;
  readonly key: string;
  readonly sessionId: string;
  private storage?: DraftStorage;
  private now: () => number;
  private memory?: DraftRecord;
  private lastWrite?: DraftWrite;
  private assetBaseURL: string;
  private sequence = 0;
  private branchKey: string;

  constructor(url: string, options: {storage?: DraftStorage | null; sessionId?: string; now?: () => number} = {}) {
    this.url = canonicalStoryURL(url);
    this.assetBaseURL = this.url;
    this.key = `combination-draft-v1:${encodeURIComponent(this.url)}`;
    this.sessionId = options.sessionId ?? editorSessionId();
    this.branchKey = `${this.key}:session:${this.sessionId}`;
    this.storage = options.storage === null ? undefined : options.storage ?? browserStorage();
    this.now = options.now ?? Date.now;
  }

  get unsaved(): boolean { return this.lastWrite?.persisted === false; }

  affectsStorageKey(key: string | null): boolean {
    return key === null || key === this.key || key.startsWith(`${this.key}:`);
  }

  setAssetBaseURL(url: string): void { this.assetBaseURL = canonicalStoryURL(url); }

  private keys(): string[] {
    if (!this.storage) throw new Error('Browser storage is unavailable.');
    const keys = [this.key];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(`${this.key}:`)) keys.push(key);
    }
    return keys;
  }

  read(): DraftRead {
    const records: DraftRecord[] = [], damaged: DraftRead['damaged'] = [];
    let warning: string | undefined;
    try {
      for (const key of this.keys()) {
        const raw = this.storage!.getItem(key);
        if (raw === null) continue;
        const record = parseRecord(raw, this.url);
        if (record) records.push(record);
        else damaged.push({key, raw});
      }
      if (damaged.length) warning = 'Some saved draft data could not be read. It has been kept for recovery.';
    } catch {
      warning = 'Browser draft storage could not be read. Keep a copy of your Markdown before leaving this page.';
    }
    if (this.memory) records.unshift(this.memory);
    records.sort((a, b) => b.updatedAt - a.updatedAt);
    const unique = records.filter((record, index) => records.findIndex(other => other.revision === record.revision) === index);
    return {draft: unique[0], recoveries: unique.slice(1), damaged, warning};
  }

  /** Returns every other recoverable buffer without changing the active editor. */
  recoveries(): DraftRead { return this.read(); }

  save(text: string): DraftWrite {
    const previous = this.read();
    const record: DraftRecord = {
      version: 1, url: this.url, assetBaseURL: this.assetBaseURL, text,
      sessionId: this.sessionId, updatedAt: Math.max(this.now(), (previous.draft?.updatedAt ?? 0) + 1),
      revision: `${this.sessionId}:${++this.sequence}`,
    };
    // Never make saving depend on parsing, preview rendering or a network request.
    this.memory = record;
    let branchSaved = false;
    if (previous.damaged.some(entry => entry.key === this.branchKey)) {
      this.branchKey = `${this.key}:session:${this.sessionId}:${this.sequence}`;
    }
    try { this.storage?.setItem(this.branchKey, JSON.stringify(record)); branchSaved = !!this.storage; } catch { /* Retain the new buffer in memory. */ }
    // A damaged current record is evidence, not permission to overwrite it.
    const damagedCurrent = previous.damaged.some(entry => entry.key === this.key);
    if (branchSaved && !damagedCurrent) {
      try { this.storage!.setItem(this.key, JSON.stringify(record)); } catch { /* Reload scans the successfully saved branch. */ }
    }
    // Never replace the shared slot without a separate durable copy: another
    // tab could otherwise overwrite the only saved copy of this buffer.
    const persisted = branchSaved;
    this.lastWrite = {
      record, persisted,
      ...(!persisted ? {error: 'This edit is only in memory: browser storage could not save it. Copy or download the Markdown before leaving this page.'} : {}),
      ...(persisted && previous.damaged.length ? {warning: 'Your edit was saved separately; unreadable older draft data has been preserved for recovery.'} : {}),
    };
    return this.lastWrite;
  }

  /** Restore another buffer without overwriting the current tab's only copy. */
  replace(text: string): DraftWrite & {replaced: boolean} {
    const current = this.memory ?? this.read().draft;
    if (current) {
      const preserved = this.save(current.text);
      if (!preserved.persisted) return {...preserved, replaced: false};
      if (current.text === text) return {...preserved, replaced: true};
    }
    // The old branch becomes an immutable recovery point for this editor.
    // Do not prune another tab's branch: it may be changed between reads.
    this.branchKey = `${this.key}:session:${this.sessionId}:restore:${this.sequence + 1}`;
    return {...this.save(text), replaced: true};
  }

  /** Only call after the user explicitly chooses to delete this story's draft. */
  delete(): {deleted: boolean; error?: string} {
    try {
      for (const key of this.keys()) this.storage!.removeItem(key);
      this.memory = undefined;
      this.lastWrite = undefined;
      return {deleted: true};
    } catch {
      return {deleted: false, error: 'The saved draft could not be fully deleted. Browser storage is unavailable.'};
    }
  }
}

/** A stored empty or invalid draft still wins over the published story. */
export async function loadStoryDocument(url: string, drafts: DraftStore, fetcher: typeof fetch = globalThis.fetch): Promise<StoryDocument> {
  const canonical = canonicalStoryURL(url);
  if (drafts.url !== canonical) throw new Error('The draft store belongs to a different story URL.');
  const stored = drafts.read();
  if (stored.draft) {
    drafts.setAssetBaseURL(stored.draft.assetBaseURL);
    return {url: canonical, assetBaseURL: stored.draft.assetBaseURL, text: stored.draft.text, edited: true, warning: stored.warning, recoveries: stored.recoveries};
  }
  let response: Response;
  try { response = await fetcher(canonical, {credentials: 'same-origin', cache: 'no-cache'}); }
  catch { throw new Error(`Could not load the story at ${canonical}. Check that story.md is available on this server.`); }
  if (!response.ok) throw new Error(`Could not load the story at ${canonical} (HTTP ${response.status}).`);
  if (/text\/html/i.test(response.headers.get('content-type') ?? '')) {
    throw new Error(`No Markdown story was found at ${canonical}; the server returned an HTML page.`);
  }
  const assetBaseURL = canonicalStoryURL(response.url || canonical);
  drafts.setAssetBaseURL(assetBaseURL);
  const text = await response.text();
  return {url: canonical, assetBaseURL, text, edited: false, warning: stored.warning, recoveries: stored.recoveries};
}
