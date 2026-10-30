import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import type {DiagnosticFix, Fate} from '../src/story/types.ts';

function warning(text: string, name: string) {
  return lintStory(parseStory(text), {analysis: false}).find(d => d.code === 'mixed-fates' && d.message.startsWith(`${name} has mixed fates:`))!;
}
function apply(text: string, fix: DiagnosticFix) {
  assert.equal(fix.disabledReason, undefined);
  for (let i = 1; i < fix.edits.length; i++) assert(fix.edits[i].span.from >= fix.edits[i - 1].span.to);
  for (const edit of [...fix.edits].reverse()) text = text.slice(0, edit.span.from) + edit.text + text.slice(edit.span.to);
  return text;
}

test('fate fixes preserve unrelated source and consolidate every authored duplicate, inline goal and CRLF span', () => {
  const text = [
    '# 🪴 Fixes', '## Workshop', '![room](room.webp)', '**Goals**',
    '- Reach the result -- `part` [consume] + Tool [preserve] -> Shared',
    '**Items**', '- `part` Widget', '**Combinations**',
    '- `part` [transform] + "Tool + spare" [preserve] -> Reworked',
    '- `part`   + Tool [preserve] -> Joined',
    '- `part`   + Tool [preserve] -> Joined',
    '> NOTE: `part` [transform] + Tool -> This comment is not a recipe.',
  ].join('\r\n');
  const story = parseStory(text);
  assert.equal(story.recipes.length, 3, 'source metadata must not defeat logical recipe deduplication');
  assert.equal(story.fateSites!.filter(site => site.item === 'id:part').length, 4);
  const diagnostic = warning(text, 'Widget');
  for (const fate of ['preserve', 'consume', 'transform'] as const) {
    const fixed = apply(text, diagnostic.fixes!.find(fix => fix.label === fate)!);
    const parsed = parseStory(fixed);
    assert(parsed.fateSites!.filter(site => site.item === 'id:part').every(site => site.fate === fate));
    assert(parsed.fateSites!.filter(site => site.item !== 'id:part').every(site => site.fate === 'preserve'));
    assert.equal(warning(fixed, 'Widget'), undefined);
    assert(fixed.includes('> NOTE: `part` [transform] + Tool -> This comment is not a recipe.'));
    assert.equal(fixed.replaceAll('\r\n', '').includes('\n'), false);
    assert(fixed.includes(fate === 'preserve' ? '- `part`   + Tool' : `- \`part\` [${fate}]   + Tool`));
  }
});

test('fate fixes expand implied parents safely and leave quoted punctuation and fitted references intact', () => {
  const text = [
    '# Fixes', '## Workshop', '![room](room.webp)', '**Hotspots**', '- Bench', '**Items**',
    '- "Fruit + stone"', '  - + Tool [preserve] -> Crushed', '  - @ Bench -> Pulp',
    '- `fruit` Fruit', '  - + Tool [preserve] -> Juice',
    '- Case (compound)', '  - slot: Fitting, accepts Part',
    '**Combinations**',
    '- "Fruit + stone" [consume] + Pot [preserve] -> Broth',
    '- `fruit` [consume] + Pot [preserve] -> Jam',
    '- Case[Part] [preserve] + Stone -> Balanced',
    '- Stone [transform] + Tool [preserve] -> Polished',
    '- Seed [preserve] + Water [preserve] -> Food + water',
    '  - + Heat [preserve] -> Soup',
    '- "Food + water" [consume] + Bowl [preserve] -> Served',
  ].join('\n');
  const fix = (source: string, name: string, fate: Fate) => apply(source, warning(source, name).fixes!.find(fix => fix.label === fate)!);
  const first = fix(text, 'Fruit + stone', 'consume');
  assert(first.includes('  - "Fruit + stone" [consume] + Tool [preserve] -> Crushed'));
  assert(first.includes('  - "Fruit + stone" [consume] @ Bench -> Pulp'));
  assert.equal(warning(first, 'Fruit + stone'), undefined);
  assert.deepEqual(warning(first, 'Fruit').fixes!.map(fix => fix.label), ['preserve', 'consume']);
  const second = fix(first, 'Fruit', 'consume');
  assert(second.includes('  - `fruit` [consume] + Tool [preserve] -> Juice'));
  assert.equal(warning(second, 'Fruit'), undefined);
  assert.deepEqual(warning(second, 'Stone').fixes!.map(fix => fix.label), ['preserve', 'transform']);
  const third = fix(second, 'Stone', 'transform');
  assert(third.includes('- Case[Part] [preserve] + Stone [transform] -> Balanced'));
  assert.equal(warning(third, 'Stone'), undefined);
  const last = fix(third, 'Food + water', 'consume');
  assert(last.includes('  - "Food + water" [consume] + Heat [preserve] -> Soup'));
  assert.equal(warning(last, 'Food + water'), undefined);
  assert.equal(parseStory(last).diagnostics.length, 0);
});

test('slot-imposed fates constrain fixes without rewriting construction semantics', () => {
  const text = [
    '# Fixes', '## Workshop', '![room](room.webp)', '**Items**',
    '- Frame (compound)', '  - slot: Fitting, accepts Part', '**Combinations**',
    '- Part [preserve] + Tool [preserve] -> Decorated',
    '- Frame [consume] + Tool [preserve] -> Crate',
  ].join('\n');
  const component = warning(text, 'Part');
  assert.deepEqual(component.fixes!.filter(fix => !fix.disabledReason).map(fix => fix.label), ['consume']);
  const fixedComponent = apply(text, component.fixes!.find(fix => fix.label === 'consume')!);
  assert.equal(warning(fixedComponent, 'Part'), undefined);
  assert(fixedComponent.includes('  - slot: Fitting, accepts Part'));
  const owner = warning(text, 'Frame');
  assert.deepEqual(owner.fixes!.filter(fix => !fix.disabledReason).map(fix => fix.label), ['preserve']);
  assert.equal(warning(apply(text, owner.fixes![0]), 'Frame'), undefined);
  const bothRoles = text + '\n**Items**\n- Carrier (compound)\n  - slot: Frame, accepts Frame';
  const conflicting = warning(bothRoles, 'Frame');
  assert(conflicting.fixes!.every(fix => fix.disabledReason?.includes('preserve and consume') && fix.edits.length === 0));
});
