import {parseStory} from '../story/parser.ts';
import {lintStory, lintStoryAnalysis} from '../lint/lint.ts';
import type {Diagnostic} from '../story/types.ts';
import {lintPlacementGeometry} from '../lint/placement.ts';
import type {HotspotMeasurement} from './hotspot-view.ts';

export interface LintWorkerRequest {
  revision: number;
  text: string;
  id: string;
  file: string;
  hotspotMeasurements?: HotspotMeasurement[];
}

export interface LintWorkerResponse {
  revision: number;
  phase: 'fast' | 'complete';
  diagnostics: Diagnostic[];
}

const scope = globalThis as unknown as {
  onmessage: (event: MessageEvent<LintWorkerRequest>) => void;
  postMessage(message: LintWorkerResponse): void;
};
let pending: LintWorkerRequest | undefined;
let running = false;

async function run(): Promise<void> {
  running = true;
  while (pending) {
    const request = pending;
    pending = undefined;
    try {
      const story = parseStory(request.text, {id: request.id, file: request.file});
      const fast = [...lintStory(story, {analysis: false}), ...lintPlacementGeometry(story, request.hotspotMeasurements ?? [])];
      scope.postMessage({revision: request.revision, phase: 'fast', diagnostics: fast});
      // Let newer buffers replace queued work before starting global analysis.
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      if (pending) continue;
      const diagnostics = [...fast, ...lintStoryAnalysis(story, fast)];
      scope.postMessage({revision: request.revision, phase: 'complete', diagnostics});
    } catch (error) {
      const span = {from: 0, to: request.text.search(/[\r\n]/) < 0 ? request.text.length : request.text.search(/[\r\n]/)};
      scope.postMessage({revision: request.revision, phase: 'complete', diagnostics: [{
        severity: 'error', code: 'lint-failure', message: `Could not finish checking this buffer: ${(error as Error).message}`,
        source: {file: request.file, line: 1, column: 1, span}, span, stage: 'fast',
      }]});
    }
  }
  running = false;
}

scope.onmessage = event => {
  // A single worker keeps only the latest waiting buffer. The main thread also
  // checks revision IDs, since an in-flight analysis can finish after an edit.
  pending = event.data;
  if (!running) void run();
};
