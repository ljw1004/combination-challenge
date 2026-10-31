import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {encodeSave, decodeSave, SAVE_PREFIX, MAX_SAVE_CHARACTERS} from '../../ui/save-codec.ts';
import * as M from '../../frozen/v5/engine/model.ts';
import type {Scenario, Action} from '../../frozen/v5/schema/scenario.ts';
const plain = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const wrap = (game: unknown) => ({game, tops: {'a': 0, 'b': 40.5}, seen: [0, 2], debugName: 'Δ 🚀 "test"\n'});
const packed = (length: number, pool: unknown[]) => SAVE_PREFIX + JSON.stringify([length, pool]);
test('JSON values, unusual own keys, legacy compatibility, and independent identities', () => {
 const value = wrap({repeated: Array.from({length: 100}, () => JSON.parse('{"__proto__":{"safe":true},"constructor":"data","prototype":null,"x":[false,0,-1,1.25,"雪",null],"empty":{}}'))});
 const encoded = encodeSave(value); assert(encoded.startsWith(SAVE_PREFIX));
 const result = decodeSave(encoded) as any;
 assert.deepEqual(result, value); assert.deepEqual(decodeSave(JSON.stringify(value)), value);
 const a = result.game.repeated[0], b = result.game.repeated[1];
 assert.notEqual(a, b); assert.notEqual(a.x, b.x); assert.notEqual(a.empty, b.empty);
 assert.equal(Object.getPrototypeOf(a), Object.prototype); assert.equal(({} as any).safe, undefined);
 a.__proto__.safe = false; a.x.push('changed'); assert.equal(b.__proto__.safe, true); assert.equal(b.x.length, 6);
 assert.equal(encodeSave(wrap({a: 1})), JSON.stringify(wrap({a: 1})), 'small save falls back to plain JSON');
 assert.deepEqual(decodeSave(encodeSave(wrap({optional: undefined}))), plain(wrap({optional: undefined})));
});
test('invalid wire shapes, references, tags, duplicate keys, trailing data and expansion bombs reject', () => {
 const invalid = ['', 'null', '{}', '[]', 'CCSP2:[]', SAVE_PREFIX + '{}', packed(1, []), packed(1, [null, null]), packed(2, [['a', 0]]), packed(2, [['a', -1]]), packed(2, [['a', 0.5]]), packed(2, [['z']]), packed(2, [['o', 0]]), packed(20, [3, ['o', 0, 0]]), packed(20, ['x', null, ['o', 0, 1, 0, 1]]), packed(1, [1e308]), packed(100, [null]), packed(MAX_SAVE_CHARACTERS + 1, [null]), JSON.stringify({...wrap({}), seen: [-1]}), JSON.stringify({...wrap({}), extra: true})];
 const bomb: unknown[] = ['a']; for (let i = 1; i < 40; i++) bomb.push(['a', i-1, i-1]);
 invalid.push(packed(1024, bomb));
 const nested: unknown[] = ['a']; for (let i = 1; i < 260; i++) nested.push(['a', i-1]);
 invalid.push(packed(521, nested));
 for (const raw of invalid) assert.throws(() => decodeSave(raw), undefined, raw.slice(0, 100));
 const encoded = encodeSave(wrap({large: Array(100).fill({x: 7})}));
 assert.throws(() => decodeSave(encoded.slice(0, -1))); assert.throws(() => decodeSave(encoded + 'x'));
 const wire = JSON.parse(encoded.slice(SAVE_PREFIX.length)); wire[0]++; assert.throws(() => decodeSave(SAVE_PREFIX + JSON.stringify(wire)));
});
const cases = [
 ['mars', 'mars/story-expansion/scenario.json', 'mars/story-expansion/results/goal-route.json'],
 ['ideas', 'ideas/revision-v6/scenario.json', 'ideas/revision-v6/goal-route.json'],
 ['elements', 'elements/revision-v5/scenario.json', 'elements/revision-v5/solution-actions.json'],
];
const evidence: any[] = [];
for (const [name, scenarioPath, routePath] of cases) test(`${name}: full completed route, restore, resize, every retained undo and size`, () => {
 const root = new URL('../../', import.meta.url);
 const scenario: Scenario = JSON.parse(readFileSync(new URL(scenarioPath, root), 'utf8'));
 const route = JSON.parse(readFileSync(new URL(routePath, root), 'utf8'));
 const actions: Action[] = Array.isArray(route) ? route : route.actions;
 const game = M.replay(scenario, actions, 360); assert(game.state.completed); assert.equal(game.history.length, 100);
 const original = plain(wrap(game)), originalString = JSON.stringify(original);
 const start = performance.now(), encoded = encodeSave(original), encodedAt = performance.now();
 const decoded = decodeSave(encoded), decodedAt = performance.now();
 assert.deepEqual(decoded, original); assert.equal(JSON.stringify(decoded), originalString);
 assert.deepEqual(M.restore(scenario, JSON.stringify(decoded.game)), M.restore(scenario, JSON.stringify(original.game)));
 for (const width of [320, 600, 375]) {
  let expected = M.resizeGame(original.game, width), actual = M.resizeGame(decoded.game as M.Game, width);
  assert.deepEqual(actual, expected);
  let undos = 0;
  while (expected.history.length) { expected = M.undo(expected).game; actual = M.undo(actual).game; assert.deepEqual(actual, expected); undos++; }
  assert.equal(undos, 100); assert.equal(M.undo(actual).accepted, false);
 }
 assert.deepEqual(decoded, original, 'resize/undo must not mutate either source save');
 const result = {name, actions: actions.length, history: game.history.length, plainUtf8Bytes: Buffer.byteLength(originalString), encodedUtf8Bytes: Buffer.byteLength(encoded), encodedUtf16Bytes: encoded.length*2, ratio: +(encoded.length/originalString.length).toFixed(4), encodeMs: +(encodedAt-start).toFixed(2), decodeMs: +(decodedAt-encodedAt).toFixed(2)};
 evidence.push(result); console.log(JSON.stringify(result));
});
test('three completed saves fit conservative combined 5 MiB UTF-16 accounting budget', () => {
 assert.equal(evidence.length, 3);
 const combinedUtf16Bytes = evidence.reduce((n, e) => n + e.encodedUtf16Bytes, 0);
 assert(combinedUtf16Bytes < 5 * 1024 * 1024);
 const report = {engine: 'frozen/v5', cases: evidence, combinedUtf16Bytes, comparisonBudgetBytes: 5*1024*1024, note: 'Size comparison only. Not an actual-device quota guarantee; origin usage and browser policy vary. No browser controller integration or native device testing in this test.'};
 writeFileSync(new URL('./size-evidence.json', import.meta.url), JSON.stringify(report, null, 2)+'\n');
});
