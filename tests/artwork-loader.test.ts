import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setImmediate} from 'node:timers/promises';
import {ArtworkLoader, type ArtworkSize} from '../src/web/artwork-loader.ts';

test('artwork queue bounds concurrency, prioritizes visible assets and cancels obsolete lookahead', async () => {
  const requests: string[] = [], aborted: string[] = [];
  const finish = new Map<string, (size: ArtworkSize) => void>();
  let active = 0, peak = 0;
  const loader = new ArtworkLoader((url, signal) => {
    requests.push(url); peak = Math.max(peak, ++active);
    return new Promise<ArtworkSize>((resolve, reject) => {
      finish.set(url, resolve);
      signal.addEventListener('abort', () => { aborted.push(url); reject(new Error('aborted')); });
    }).finally(() => { active--; });
  }, 2, []);
  loader.preload(['old-a', 'old-b', 'old-c']);
  const required = loader.prepare(['visible']);
  assert.deepEqual(requests, ['old-a', 'old-b']);
  finish.get('old-a')!({width: 10, height: 20}); await setImmediate();
  assert.deepEqual(requests, ['old-a', 'old-b', 'visible']);
  loader.preload(['next']); await setImmediate();
  assert.deepEqual(aborted, ['old-b']);
  assert.equal(requests.includes('old-c'), false);
  assert.equal(loader.get('old-c'), undefined);
  assert.equal(peak, 2);
  finish.get('visible')!({width: 30, height: 40}); await required;
  assert.deepEqual(loader.get('visible')?.size, {width: 30, height: 40});
  finish.get('next')!({width: 50, height: 60}); await setImmediate();
  assert.equal(loader.prepare(['visible']), undefined, 'decoded artwork is reused');
});

test('transient failures retry, exhausted failures back off and can recover when connectivity returns', async () => {
  let attempts = 0, offline = false;
  const loader = new ArtworkLoader(async () => {
    attempts++;
    if (offline || attempts < 3) throw new Error('intermittent failure');
    return {width: 200, height: 100};
  }, 2, [1, 1]);
  await loader.prepare(['recovering']);
  assert.equal(attempts, 3); assert.equal(loader.get('recovering')?.failed, false);
  offline = true;
  await loader.prepare(['offline']);
  assert.equal(attempts, 6); assert.equal(loader.get('offline')?.failed, true);
  assert.equal(loader.prepare(['offline']), undefined, 'failed files do not cause a tight retry loop');
  offline = false; loader.retryFailures();
  await loader.prepare(['offline']);
  assert.equal(attempts, 7); assert.equal(loader.get('offline')?.failed, false);
});
