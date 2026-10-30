import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import type {Diagnostic} from '../src/story/types.ts';
import {LiveDiagnostics} from '../src/web/live-diagnostics.ts';
import type {DiagnosticWorker} from '../src/web/live-diagnostics.ts';
import type {LintWorkerRequest, LintWorkerResponse} from '../src/web/lint-worker.ts';

class WorkerStub implements DiagnosticWorker {
  requests: LintWorkerRequest[] = [];
  onmessage: DiagnosticWorker['onmessage'] = null;
  onerror: DiagnosticWorker['onerror'] = null;
  terminations = 0;
  postMessage(request: LintWorkerRequest) { this.requests.push(request); }
  terminate() { this.terminations++; }
  reply(revision: number, phase: LintWorkerResponse['phase'], diagnostics: Diagnostic[]) {
    this.onmessage?.({data: {revision, phase, diagnostics}} as MessageEvent<LintWorkerResponse>);
  }
}
const text = '# Test\n## Start\n![room](room.webp)\n**Goals**\n- Make C -- C\n**Combinations**\n- A [preserve] + B [preserve] -> C';
const story = parseStory(text, {id: 'test'});
const deep: Diagnostic = {severity: 'error', code: 'no-continuation', message: 'Old analysis', source: story.source, span: story.source.span!, stage: 'deep'};

test('one worker runs one request at a time and receives only the newest queued buffer', () => {
  const worker = new WorkerStub(), published: LintWorkerResponse[] = [];
  const client = new LiveDiagnostics((diagnostics, phase) => published.push({revision: -1, phase, diagnostics}), assert.fail, worker);
  client.check(story, text);
  assert.equal(worker.requests.length, 1);
  client.invalidate(); client.check(story, `${text}\nfirst edit`);
  client.invalidate(); client.check(story, `${text}\nnewest edit`);
  assert.equal(worker.requests.length, 1);
  const before = published.length;
  worker.reply(0, 'fast', [deep]); worker.reply(0, 'complete', [deep]);
  assert.equal(published.length, before);
  assert.equal(worker.requests.length, 2);
  assert.equal(worker.requests[1].revision, 2);
  assert.equal(worker.requests[1].text, `${text}\nnewest edit`);
  worker.reply(2, 'complete', [deep]);
  assert.equal(published.at(-1)?.phase, 'complete');
  assert.deepEqual(published.at(-1)?.diagnostics, [deep]);
  client.dispose(); assert.equal(worker.terminations, 1);
});

test('typing invalidates stale responses before debounce while preserving already-published diagnostics', () => {
  const worker = new WorkerStub(), published: {phase: string; diagnostics: Diagnostic[]}[] = [];
  const client = new LiveDiagnostics((diagnostics, phase) => published.push({phase, diagnostics}), assert.fail, worker);
  client.check(story, text); worker.reply(0, 'complete', [deep]);
  const latest = published.at(-1), count = published.length;
  client.invalidate();
  assert.equal(published.length, count);
  worker.reply(0, 'fast', []); worker.reply(0, 'complete', []);
  assert.equal(published.length, count); assert.equal(published.at(-1), latest);
  assert.equal(worker.requests.length, 1);
  // This represents the later debounced parse. The editor merges a fast result
  // with its mapped deep marks until this revision's complete result arrives.
  client.check(story, `${text}\nnew text`);
  assert.equal(published.at(-1)?.phase, 'fast');
  assert.equal(worker.requests[1].revision, 1);
  worker.reply(1, 'complete', []);
  assert.equal(published.at(-1)?.phase, 'complete');
  client.dispose();
});

test('unexpected fast-lint failure still supplies a useful span on a single-line buffer', () => {
  const singleLine = '# 🐈 Story', broken = parseStory(singleLine);
  broken.items = null as unknown as typeof broken.items;
  const worker = new WorkerStub();
  let diagnostics: Diagnostic[] = [];
  const client = new LiveDiagnostics(value => { diagnostics = value; }, assert.fail, worker);
  client.check(broken, singleLine);
  const failure = diagnostics.find(diagnostic => diagnostic.code === 'lint-failure');
  assert.deepEqual(failure?.span, {from: 0, to: singleLine.length});
  assert.equal(failure?.stage, 'fast');
  client.dispose();
});
