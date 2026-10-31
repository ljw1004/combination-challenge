import type { Diagnostic, Story } from '../story/types.ts';
import { lintStory } from '../lint/lint.ts';
import type { LintWorkerRequest, LintWorkerResponse } from './lint-worker.ts';
import {lintPlacementGeometry} from '../lint/placement.ts';
import type {HotspotMeasurement} from './hotspot-view.ts';

export interface DiagnosticWorker {
  postMessage(request: LintWorkerRequest): void;
  onmessage: ((event: MessageEvent<LintWorkerResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => unknown) | null;
  terminate(): void;
}

/** One background analysis at a time; only the newest queued buffer matters. */
export class LiveDiagnostics {
  private revision = 0;
  private busy = false;
  private pending?: LintWorkerRequest;
  private publish: (diagnostics: Diagnostic[], phase: 'fast' | 'complete') => void;
  private failure: (message: string) => void;
  private worker: DiagnosticWorker;

  constructor(
    publish: (diagnostics: Diagnostic[], phase: 'fast' | 'complete') => void,
    failure: (message: string) => void,
    worker: DiagnosticWorker = new Worker(new URL('./lint-worker.ts', import.meta.url), { type: 'module' }),
  ) {
    this.publish = publish;
    this.failure = failure;
    this.worker = worker;
    worker.onmessage = event => {
      const result = event.data;
      if (result.revision === this.revision) this.publish(result.diagnostics, result.phase);
      if (result.phase === 'complete') { this.busy = false; this.send(); }
    };
    worker.onerror = () => {
      this.busy = false;
      this.failure('Background analysis failed. Your draft and fast diagnostics are still available.');
    };
  }

  /** Invalidate immediately on input, before the short preview debounce expires. */
  invalidate() { this.revision++; this.pending = undefined; }

  check(story: Story, text: string, hotspotMeasurements: HotspotMeasurement[] = []) {
    try { this.publish([...lintStory(story, { analysis: false }), ...lintPlacementGeometry(story, hotspotMeasurements)], 'fast'); }
    catch (error) {
      const endOfLine = text.search(/[\r\n]/);
      this.publish([...story.diagnostics, {
        severity: 'error', code: 'lint-failure', message: (error as Error).message,
        source: story.source, span: { from: 0, to: endOfLine < 0 ? text.length : endOfLine }, stage: 'fast',
      }], 'fast');
    }
    this.pending = { revision: this.revision, text, id: story.id, file: story.source.file, hotspotMeasurements };
    this.send();
  }

  private send() {
    if (!this.busy && this.pending) {
      this.busy = true;
      this.worker.postMessage(this.pending);
      this.pending = undefined;
    }
  }

  dispose() { this.pending = undefined; this.worker.terminate(); }
}
