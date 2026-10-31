import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DraftStore, resolveStoryURL, resolveStoryAsset, loadStoryDocument} from '../src/web/story-document.ts';
import type {DraftStorage} from '../src/web/story-document.ts';

class Storage implements DraftStorage {
  values = new Map<string, string>();
  fail?: (key: string) => boolean;
  get length() { return this.values.size; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { if (this.fail?.(key)) throw new Error('Quota exceeded'); this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
const url = 'https://example.test/work/mars/mars.md';

test('portable story paths and artwork resolve from their own documents, rejecting remote selectors and unsafe schemes', () => {
  assert.equal(resolveStoryURL('https://example.test/work/combinations.html'), 'https://example.test/work/story.md');
  assert.equal(resolveStoryURL('https://example.test/work/mars/combinations.html'), 'https://example.test/work/mars/story.md');
  assert.equal(resolveStoryURL('https://example.test/work/combinations.html?story=mars/mars.md#ignored'), url);
  assert.equal(resolveStoryURL('https://example.test/work/mars/combinations.html?story=mars.md'), url);
  assert.equal(resolveStoryURL('https://example.test/work/player/combinations.html?story=../mars/mars.md'), url);
  assert.equal(resolveStoryURL('https://example.test/work/combinations.html?story=mars%2Fmars.md'), url);
  assert.equal(resolveStoryURL('https://example.test/work/combinations.html?story=/work/mars/mars.md'), url);
  assert.equal(resolveStoryURL('https://example.test/work/combinations.html?story=shared/another%20story.md'), 'https://example.test/work/shared/another%20story.md');
  assert.equal(resolveStoryAsset('assets/scene.webp', url), 'https://example.test/work/mars/assets/scene.webp');
  assert.equal(resolveStoryAsset('https://art.test/scene.webp', url), 'https://art.test/scene.webp');
  for (const selector of ['', 'mars', '../private', 'https://other.test/story.md', '//other.test/story.md', 'javascript:story.md', 'mars%5Cmars.md', 'mars/mars.md%23fragment', 'mars/mars.md%3Fquery', '%2e%2e', 'mars/mars.md&story=kitchen/kitchen.md']) {
    assert.throws(() => resolveStoryURL(`https://example.test/work/combinations.html?story=${selector}`));
  }
  for (const asset of ['javascript:alert(1)', 'data:text/html,hello', 'https://user:secret@example.test/a.webp']) {
    assert.throws(() => resolveStoryAsset(asset, url));
  }
});

test('stories sharing artwork keep independent drafts, while routes to the same file share a draft', () => {
  const storage = new Storage();
  const otherURL = resolveStoryURL('https://example.test/work/combinations.html?story=mars/alternate.md');
  const first = new DraftStore(url, {storage}), second = new DraftStore(otherURL, {storage});
  assert.equal(resolveStoryAsset('assets/scene.webp', url), resolveStoryAsset('assets/scene.webp', otherURL));
  first.save('First manuscript'); second.save('Second manuscript');
  const adjacentURL = resolveStoryURL('https://example.test/work/mars/combinations.html?story=mars.md');
  assert.equal(new DraftStore(adjacentURL, {storage}).read().draft?.text, 'First manuscript');
  first.delete();
  assert.equal(second.read().draft?.text, 'Second manuscript');
});

test('cached invalid and empty drafts override the server without a network request, and explicit deletion removes all branches', async () => {
  const storage = new Storage(), draft = new DraftStore(url, {storage, sessionId: 'tab-one'});
  const forbiddenFetch = (async () => { throw new Error('Must not fetch over a draft'); }) as typeof fetch;
  for (const text of ['# Incomplete\n**Goals**\n- ', '']) {
    assert.equal(draft.save(text).persisted, true);
    const loaded = await loadStoryDocument(url, new DraftStore(url, {storage}), forbiddenFetch);
    assert.equal(loaded.text, text); assert.equal(loaded.edited, true);
  }
  assert.equal(new DraftStore('https://example.test/other/mars/story.md', {storage}).read().draft, undefined);
  assert.equal(draft.delete().deleted, true); assert.equal(draft.read().draft, undefined); assert.equal(storage.length, 0);
});

test('concurrent editors preserve their own latest buffers and recover after a corrupted current record', () => {
  const storage = new Storage();
  const first = new DraftStore(url, {storage, sessionId: 'one', now: () => 1});
  const second = new DraftStore(url, {storage, sessionId: 'two', now: () => 1});
  first.save('First tab'); second.save('Second tab'); first.save('First tab, newer');
  let recovered = new DraftStore(url, {storage}).read();
  assert.equal(recovered.draft?.text, 'First tab, newer');
  assert(recovered.recoveries.some(record => record.text === 'Second tab'));
  storage.setItem(first.key, '{damaged');
  recovered = new DraftStore(url, {storage}).read();
  assert.equal(recovered.draft?.text, 'First tab, newer'); assert.match(recovered.warning!, /recovery/);
  second.save('Second tab, continued');
  assert.equal(storage.getItem(first.key), '{damaged');
  assert.equal(new DraftStore(url, {storage}).read().draft?.text, 'Second tab, continued');
});

test('quota errors retain the buffer in memory and never report it saved; a recovery branch survives a failed current write', () => {
  const storage = new Storage(), draft = new DraftStore(url, {storage, sessionId: 'one'});
  draft.save('Previously saved');
  storage.fail = () => true;
  const failed = draft.save('Unsaved newer edit');
  assert.equal(failed.persisted, false); assert.match(failed.error!, /only in memory/);
  assert.equal(draft.unsaved, true); assert.equal(draft.read().draft?.text, 'Unsaved newer edit');
  assert.equal(new DraftStore(url, {storage}).read().draft?.text, 'Previously saved');
  storage.fail = key => key !== draft.key;
  assert.equal(draft.save('Must not overwrite the shared slot').persisted, false);
  assert.equal(new DraftStore(url, {storage}).read().draft?.text, 'Previously saved');
  storage.fail = key => key === draft.key;
  assert.equal(draft.save('Safely in recovery').persisted, true);
  assert.equal(draft.unsaved, false);
  assert.equal(new DraftStore(url, {storage}).read().draft?.text, 'Safely in recovery');
});

test('network loading handles unavailable files and HTML fallbacks, and retains redirected artwork bases in drafts', async () => {
  const storage = new Storage(), draft = new DraftStore(url, {storage});
  const fetcher = async () => {
    const response = new Response('# Published story', {headers: {'content-type': 'text/markdown'}});
    Object.defineProperty(response, 'url', {value: 'https://example.test/released/mars/story.md'});
    return response;
  };
  const loaded = await loadStoryDocument(url, draft, fetcher);
  assert.equal(loaded.assetBaseURL, 'https://example.test/released/mars/story.md');
  assert.equal(loaded.edited, false);
  draft.save('# Edited story');
  assert.equal((await loadStoryDocument(url, new DraftStore(url, {storage}))).assetBaseURL, loaded.assetBaseURL);
  draft.delete();
  await assert.rejects(loadStoryDocument(url, draft, async () => new Response('', {status: 404})), /HTTP 404/);
  await assert.rejects(loadStoryDocument(url, draft, async () => new Response('<!doctype html>', {headers: {'content-type': 'text/html'}})), /HTML page/);
});

test('restoring a recovery preserves the current buffer even after further edits, and refuses to discard unsaved work', () => {
  const storage = new Storage(), draft = new DraftStore(url, {storage, sessionId: 'editing'});
  draft.save('Current work worth keeping');
  const restored = draft.replace('Earlier recovered version');
  assert.equal(restored.replaced, true); assert.equal(restored.persisted, true);
  draft.save('Earlier recovered version, improved');
  const read = new DraftStore(url, {storage}).read();
  assert.equal(read.draft?.text, 'Earlier recovered version, improved');
  assert(read.recoveries.some(record => record.text === 'Current work worth keeping'));
  storage.fail = () => true;
  draft.save('New work only in memory');
  const blocked = draft.replace('Something else');
  assert.equal(blocked.replaced, false); assert.equal(blocked.persisted, false);
  assert.equal(draft.read().draft?.text, 'New work only in memory');
});
