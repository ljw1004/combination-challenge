import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {StoryLanguageDocument} from '../src/story/language-service.ts';
import {lintStory, lintStoryAnalysis} from '../src/lint/lint.ts';
import {newGame} from '../src/engine/game.ts';
import {chapterSupplies} from '../src/engine/analysis.ts';

const fixture = `# 📻 Radio
## Workshop
![room](room.webp)
**Goals**
- Repair -- Radio
**Items**
- Wire
- Battery
- Radio
**Combinations**
- Wire [preserve] + Battery [preserve] -> Radio (tutorial)
`;
const codes = new Set(['undeclared-item', 'undeclared-id', 'undeclared-hotspot', 'unused-declaration']);
const declarations = (text: string) => lintStory(parseStory(text), {analysis: false}).filter(d => codes.has(d.code));

test('mistyped goals, reagents and results are fast errors even when implicit preview supplies would make them playable', () => {
  assert.deepEqual(lintStory(parseStory(fixture)), []);
  for (const [before, after, name] of [
    ['Repair -- Radio', 'Repair -- Raido', 'Raido'],
    ['Wire [preserve]', 'Wrie [preserve]', 'Wrie'],
    ['-> Radio', '-> Rdaio', 'Rdaio'],
  ]) {
    const text = fixture.replace(before, after).replaceAll('\n', '\r\n');
    const story = parseStory(text), fast = lintStory(story, {analysis: false});
    const errors = fast.filter(d => d.severity === 'error');
    assert.equal(errors.length, 1);
    const diagnostic = errors[0];
    assert.equal(diagnostic.code, 'undeclared-item'); assert.equal(diagnostic.stage, 'fast');
    assert.equal(text.slice(diagnostic.span.from, diagnostic.span.to), name);
    assert.equal(text.split('\r\n')[diagnostic.source.line - 1].slice(diagnostic.source.column! - 1, diagnostic.source.column! - 1 + name.length), name);
    assert.deepEqual(lintStoryAnalysis(story, fast), [], 'do not certify an unresolved draft through deep analysis');
    if (name === 'Raido') assert(newGame(story).achieved.length, 'invalid drafts remain previewable without suppressing the declaration error');
  }
  const repeated = fixture.replace('\n- Radio\n', '\n') + '- Wire [preserve] + Battery [preserve] -> Radio\n';
  assert.equal(parseStory(repeated).recipes.length, 1);
  const errors = declarations(repeated).filter(d => d.severity === 'error');
  assert.deepEqual(errors.map(d => repeated.slice(d.span.from, d.span.to)), ['Radio', 'Radio', 'Radio'], 'deduplicated recipes still diagnose every authored use');
});

test('declarations resolve forwards across chapters, keep named and backtick namespaces separate, and agree with definition navigation', () => {
  const text = `# Names
## First
**Combinations**
- "A + B" + \`part\` -> Result
## Later
**Items**
- **A + B**
- \`part\` Part
- Result
- Result
`;
  assert.deepEqual(declarations(text), []);
  const service = new StoryLanguageDocument(text);
  for (const name of ['A + B', '`part`', 'Result']) assert(service.definition(text.indexOf(name)).length);
  const typo = text.replace('+ `part`', '+ Part');
  assert.equal(declarations(typo).find(d => d.code === 'undeclared-item')?.message.startsWith('Part '), true);
  assert.equal(declarations(text.replace('+ `part`', '+ `prat`')).find(d => d.code === 'undeclared-id')?.severity, 'error');
  const inline = '# Inline\n## Work\n**Items**\n- A\n- B\n**Combinations**\n- A + B -> `result` Result';
  assert.deepEqual(declarations(inline), [], 'an explicit identifier-plus-name site can both declare and use an identity');
});

test('all reference positions require declarations, including placements, slots, readings, exclusions and hotspot IDs', () => {
  const text = `# References
## Work
**Goals**
- Finish -- Box[Goal fitting] @ Ghost
**Hotspots**
- Bench
  - place: Placed[Placed fitting] (at 50%, 50%)
- \`unnamed\`
**Items**
- Box (compound)
  - slot: fitting, accepts Slot fitting

  [Reading fitting] An explanation.

- Choice (exclusive with Excluded)
**Combinations**
- Input @ Bench -> Output
`;
  const diagnostics = declarations(text).filter(d => d.severity === 'error');
  assert.deepEqual(diagnostics.map(d => text.slice(d.span.from, d.span.to)).sort(), [
    'Goal fitting', 'Ghost', 'Placed', 'Placed fitting', '`unnamed`', 'Slot fitting', 'Reading fitting', 'Excluded', 'Input', 'Output',
  ].sort());
  assert(!parseStory(text).items['name:Placed'], 'placement-only typos do not create even preview items');
  assert.equal(diagnostics.find(d => d.message.startsWith('Ghost'))?.code, 'undeclared-hotspot');
  assert.equal(diagnostics.find(d => d.message.includes('unnamed'))?.code, 'undeclared-id');
});

test('unused declarations warn once per identity; metadata, repeated declarations, prose and comments do not count as uses', () => {
  const text = fixture + `
- Unused (compound)
  - slot: fitting, accepts Wire

  Unused is described, not referenced.

- Unused
- \`lonely\` Lonely
> NOTE: Unused + Lonely -> Radio
**Hotspots**
- Unused bench
`;
  const warnings = declarations(text);
  assert(warnings.every(d => d.severity === 'warning' && d.code === 'unused-declaration'));
  assert.deepEqual(warnings.map(d => text.slice(d.span.from, d.span.to)), ['Unused', '`lonely` Lonely', 'Unused bench']);
  assert.equal(warnings[0].related?.length, 1);
  assert(!warnings.some(d => d.message.startsWith('Radio ')), 'a terminal result is used by its producing recipe');
  const shorthand = text.replace('- Unused\n', '- Unused\n  - + Battery -> Radio\n');
  assert.deepEqual(declarations(shorthand).map(d => shorthand.slice(d.span.from, d.span.to)), ['`lonely` Lonely', 'Unused bench'], 'an inherited shorthand operand is a genuine use');
});

test('declaration validation preserves primitive introduction chapters and derived metadata does not supply dependencies', () => {
  const text = fixture + `
## Later
![later](later.webp)
**Items**
- Fresh material
- Optional result
**Combinations**
- Fresh material [preserve] + Battery [preserve] -> Optional result
`;
  const story = parseStory(text);
  assert.deepEqual(declarations(text), []);
  assert.deepEqual(chapterSupplies(story, 0).map(ref => ref.id), ['name:Wire', 'name:Battery']);
  assert.deepEqual(chapterSupplies(story, 1).map(ref => ref.id), ['name:Fresh material']);
  assert(!newGame(story).tokens['name:Fresh material']);
  const earlierMetadata = parseStory(text.replace('\n- Radio\n', '\n- Radio\n- Optional result\n'));
  assert.deepEqual(newGame(earlierMetadata), newGame(story), 'a forward-declared result cannot introduce its later primitive ingredients');
});
