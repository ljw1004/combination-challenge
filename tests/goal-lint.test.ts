import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {newGame, visibleGoals} from '../src/engine/game.ts';
import type {DiagnosticFix} from '../src/story/types.ts';

const acknowledgment = '- (three goals are a lot but okay here because the three observations share one instrument)';
const manuscript = (count: number, extra = '') => '# 🪴 Test\n## Workshop\n![room](room.webp)\n**Goals**\n'
  + Array.from({length: count}, (_, i) => `- Make ${i} -- Item ${i}\n`).join('') + extra;
const lint = (text: string) => lintStory(parseStory(text), {analysis: false});
function apply(text: string, fix: DiagnosticFix) {
  for (const edit of [...fix.edits].reverse()) text = text.slice(0, edit.span.from) + edit.text + text.slice(edit.span.to);
  return text;
}

test('visible-chain limits allow two, require an explanation for three, and never suppress four', () => {
  assert(!lint(manuscript(2)).some(d => d.code.includes('visible-goals')));
  const warning = lint(manuscript(3)).find(d => d.code === 'many-visible-goals')!;
  assert.equal(warning.severity, 'warning');
  assert.equal(warning.fixes!.length, 1);
  const ordinary = parseStory(manuscript(3));
  const explained = parseStory(manuscript(3, acknowledgment));
  assert.deepEqual(explained.chapters[0].goals, ordinary.chapters[0].goals);
  assert.deepEqual(explained.items, ordinary.items);
  assert.deepEqual(visibleGoals(explained, newGame(explained)), visibleGoals(ordinary, newGame(ordinary)));
  assert(!lint(manuscript(3, acknowledgment)).some(d => d.code.includes('visible-goals')));
  for (const count of [4, 5]) {
    const hard = lint(manuscript(count, acknowledgment)).find(d => d.code === 'too-many-visible-goals')!;
    assert.equal(hard.severity, 'error');
    assert.equal(hard.fixes, undefined);
  }
  const staged = manuscript(3, '- next: Later -- Later item\n' + acknowledgment);
  assert(!lint(staged).some(d => d.code.includes('visible-goals')));
  assert.equal(parseStory(staged).chapters[0].goals.length, 4);
});

test('suppression inserts and selects the required placeholder, preserving original line endings', () => {
  for (const newline of ['\n', '\r\n']) {
    for (const indent of ['', '  ', '\t']) {
      const text = manuscript(3).replace('**Goals**', '**Goals**  ').replaceAll('\n- ', `\n${indent}- `).replaceAll('\n', newline);
      const fix = lint(text).find(d => d.code === 'many-visible-goals')!.fixes![0];
      const fixed = apply(text, fix);
      assert(fixed.includes(`**Goals**  ${newline}${indent}- (three goals are a lot but okay here because <REASON>)${newline}`));
      assert.equal(fix.edits[fix.selection!.edit].text.slice(fix.selection!.from, fix.selection!.to), '<REASON>');
      const diagnostics = lint(fixed);
      const reason = diagnostics.find(d => d.code === 'goal-acknowledgment-reason')!;
      assert.equal(reason.severity, 'error');
      assert.equal(fixed.slice(reason.span.from, reason.span.to), '- (three goals are a lot but okay here because <REASON>)');
      assert.equal(diagnostics.find(d => d.code === 'many-visible-goals')!.fixes, undefined, 'do not insert duplicates while a reason is being edited');
      assert(!lint(fixed.replace('<REASON>', 'one instrument supports three independent observations')).some(d => d.code.includes('goal')));
    }
  }
});

test('acknowledgments require verbatim text and a real reason, with ordinary Markdown bullet whitespace', () => {
  const inline = '- Finish -- A\n- Other -- B\n- Last -- C\n';
  const base = '# Test\n## Workshop\n![room](room.webp)\n**Combinations**\n- X [preserve] + Y [preserve] -> Z (tutorial)\n**Goals**\n';
  for (const bullet of ['- ', '-  ', '-\t', '  -\t ']) {
    const indent = bullet.match(/^ */)![0];
    const text = base + bullet + acknowledgment.slice(2) + '\n' + inline.split('\n').filter(Boolean).map(line => indent + line).join('\n');
    assert.equal(lint(text).filter(d => d.severity === 'error' || d.code === 'many-visible-goals').length, 0, bullet);
  }
  for (const invalid of [
    acknowledgment.replace('three', 'Three'), acknowledgment.replace('goals', 'rules'),
    acknowledgment.replace('okay', 'OK'), acknowledgment + '.', acknowledgment + ' ',
    acknowledgment.replace('are a lot', 'are  a lot'),
    acknowledgment.replace('- ', '* '), acknowledgment.replace('- ', '+ '),
    acknowledgment.slice(2), '- (three goals are a lot but okay here because )',
    '- (three goals are a lot but okay here because   )',
    '- (three goals are a lot but okay here because replace <REASON> later)',
    acknowledgment + '\n  - A', '- Finish\n  ' + acknowledgment,
    'This is not a goal', '- -- A', '- Finish --', '- Finish -- A -- B',
    '- Finish -- A @', '- Finish -- A @ Bench @ Shelf',
  ]) assert(lint(base + inline + invalid).some(d => d.severity === 'error'), invalid);
  assert(lint(base + inline + '> NOTE: An ordinary author note.').every(d => d.severity !== 'error'));
});

test('duplicate and stale acknowledgments cannot silently accumulate', () => {
  const duplicate = lint(manuscript(3, acknowledgment + '\n**Goals**\n' + acknowledgment));
  assert.equal(duplicate.find(d => d.code === 'duplicate-goal-acknowledgment')?.severity, 'error');
  assert(duplicate.some(d => d.code === 'many-visible-goals'));
  for (const newline of ['\n', '\r\n']) {
    const text = manuscript(2, acknowledgment + '\n**Items**\n- Tool\n').replaceAll('\n', newline);
    const stale = lint(text).find(d => d.code === 'stale-goal-acknowledgment')!;
    assert.equal(stale.severity, 'warning');
    assert.equal(apply(text, stale.fixes![0]), manuscript(2, '**Items**\n- Tool\n').replaceAll('\n', newline));
  }
});
