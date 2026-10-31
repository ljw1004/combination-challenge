import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreDialogContext } from '../src/web/dialog-context.ts';

test('legacy manual reading anchors resume as a book detail without changing pending wonders', () => {
  assert.deepEqual(restoreDialogContext({ kind: 'reading', item: 'name:Stone' }), { kind: 'encyclopedia', item: 'name:Stone', detail: true });
  assert.deepEqual(restoreDialogContext({ kind: 'reading', item: 'name:Stone', fromEncyclopedia: true }), { kind: 'encyclopedia', item: 'name:Stone', detail: true });
  assert.deepEqual(restoreDialogContext({ kind: 'pending' }), { kind: 'pending' });
  assert.deepEqual(restoreDialogContext({ kind: 'encyclopedia', item: 'name:Stone', detail: false }), { kind: 'encyclopedia', item: 'name:Stone', detail: false });
});

test('invalid or obsolete dialog anchors do not create unreachable reader modes', () => {
  for (const value of [null, 'reading', {}, { kind: 'debug' }, { kind: 'reading' }, { kind: 'reading', item: 3 }]) assert.equal(restoreDialogContext(value), undefined);
  assert.deepEqual(restoreDialogContext({ kind: 'encyclopedia', item: 3, detail: 'yes' }), { kind: 'encyclopedia', item: undefined, detail: false });
});
