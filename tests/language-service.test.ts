import {test} from 'node:test';
import assert from 'node:assert/strict';
import {StoryLanguageDocument} from '../src/story/language-service.ts';
import {parseStory} from '../src/story/parser.ts';

const text = `# Reference fixture
## Workshop
Tool in prose is not a reference.
**Goals**
- Tool needs Tool -- Tool @ Bench
**Hotspots**
- Bench (center 195px, 506.4px)
  - place: Box[Tool] (center 195px, 506.4px)
  - Tool + Tool -> Result
**Items**
- Bench
- Tool

  A useful tool.

- Box (compound)
  - slot: fitting, accepts Tool

  [Tool] A fitted box.

- \`quoted\` "A + B"
  - + Tool -> Result
    - + Tool -> Final
- Choice (exclusive with Other)
- Other (exclusive with Choice)
**Combinations**
- Tool + Tool -> Result
- Tool + Tool -> Result
- \`quoted\` + Tool -> Final
> NOTE: Tool + Tool -> Secret
`;

test('language operations resolve grammar occurrences, later declarations and duplicate recipes precisely', () => {
  for (const input of [text, text.replaceAll('\n', '\r\n')]) {
    const document = new StoryLanguageDocument(input);
    const position = input.indexOf('Tool @ Bench');
    const definition = document.definition(position);
    assert.equal(definition.length, 1);
    assert.equal(definition[0].source.span.from, input.indexOf('- Tool', input.indexOf('**Items**')) + 2);
    assert.equal(document.referenceAt(input.indexOf('Tool needs')), undefined);
    assert.equal(document.referenceAt(input.indexOf('Tool in prose')), undefined);
    assert.equal(document.referenceAt(input.indexOf('Tool + Tool -> Secret')), undefined);
    const references = document.references(position, {includeDeclaration: true});
    assert(references.some(reference => reference.role === 'reading'));
    assert(references.some(reference => reference.role === 'slot'));
    assert(references.some(reference => reference.role === 'fitted'));
    assert(references.filter(reference => reference.role === 'reagent').length > document.story.recipes.length);
    for (const reference of references) assert.equal(input.slice(reference.source.span.from, reference.source.span.to), 'Tool');
    assert.equal(document.references(position, {includeDeclaration: false}).length, references.length - 1);
    const hover = document.hover(position)!;
    assert(hover.kind === 'symbol');
    assert.equal(hover.symbol.name, 'Tool');
    assert.deepEqual(hover.descriptions.map(description => description.text), ['A useful tool.']);
    assert(hover.usedBy.some(rule => rule.implicit));
    assert(hover.goals.some(goal => goal.text === 'Tool needs Tool'));
    assert.deepEqual(document.story, parseStory(input));
  }
});

test('definitionless results, inherited operands and hotspots keep their semantic identities', () => {
  const document = new StoryLanguageDocument(text);
  const result = text.indexOf('Result');
  assert.deepEqual(document.definition(result), []);
  assert(document.references(result, {includeDeclaration: true}).some(reference => reference.implicit && reference.role === 'reagent'));
  const resultHover = document.hover(result)!;
  assert(resultHover.kind === 'symbol' && resultHover.createdBy.length > 0);
  const hotspot = text.indexOf('Bench');
  assert.equal(document.definition(hotspot)[0].source.span.from, text.indexOf('- Bench') + 2);
  assert(document.references(hotspot, {includeDeclaration: true}).some(reference => reference.implicit));
  const quoted = text.lastIndexOf('`quoted`');
  const quotedHover = document.hover(quoted)!;
  assert(quotedHover.kind === 'symbol');
  assert.equal(quotedHover.symbol.name, 'A + B');
  assert.equal(text.slice(document.definition(quoted)[0].source.span.from, document.definition(quoted)[0].source.span.to), '`quoted` "A + B"');
});

test('identifiers, quoted punctuation and partial drafts never fall back to text matching', () => {
  const input = '# Story\n## Room\n**Items**\n- `one` Same\n- `two` Same\n- "A + B"\n**Combinations**\n- `one` + "A + B" -> `missing`\n- `two` + Tool ->';
  const document = new StoryLanguageDocument(input);
  assert.equal(document.references(input.indexOf('`one`'), {includeDeclaration: true}).length, 2);
  assert.equal(document.references(input.indexOf('`two`'), {includeDeclaration: true}).length, 2);
  assert.equal(document.references(input.indexOf('A + B'), {includeDeclaration: true}).length, 2);
  assert.deepEqual(document.definition(input.indexOf('`missing`')), []);
  assert.equal(new StoryLanguageDocument('').hover(0), undefined);
});

test('reference spans disambiguate repeated operands and grammar words inside names', () => {
  const input = '# 🧰 Story\r\n## Room\r\n**Goals**\r\n- A + A -> A -- A + A -> A\r\n**Hotspots**\r\n- Spot\r\n  - place: place (center 195px, 422px)\r\n**Items**\r\n- Spot\n- A (exclusive with with)\r\n- with (exclusive with A)\r\n- `undeclared`\r\n';
  const document = new StoryLanguageDocument(input);
  const ruleStart = input.lastIndexOf('A + A -> A');
  const occurrences = document.references(ruleStart, {includeDeclaration: true}).filter(reference => reference.source.line === 4);
  assert.deepEqual(occurrences.map(reference => reference.source.span.from), [ruleStart, ruleStart + 4, ruleStart + 9]);
  const exclusive = document.references(input.indexOf('- with') + 2, {includeDeclaration: true}).find(reference => reference.role === 'exclusion')!;
  assert.equal(exclusive.source.span.from, input.indexOf('with)'));
  const placement = document.references(input.indexOf('place (center'), {includeDeclaration: true})[0];
  assert.equal(placement.source.span.from, input.indexOf('place (center'));
  const missing = document.referenceAt(input.indexOf('`undeclared`'))!;
  assert.equal(missing.declaration, false); assert.equal(missing.role, 'reference');
});

test('semantic tokens cover authored references and note blocks, and image hover returns a typed preview', () => {
  const input = '# Story\r\n## Room\r\nAn image ![Map](assets/map.svg) in prose.\r\n**Items**\r\n- `frame` Frame\r\n  - + Tool -> Kit\r\n  > NOTE: `frame` is a comment here.\r\n  > **Still a comment.**\r\n\r\n> An ordinary quotation.\r\n';
  const document = new StoryLanguageDocument(input);
  const tokens = document.semanticTokens();
  assert.deepEqual(tokens.filter(token => token.kind === 'item').map(token => input.slice(token.range.from, token.range.to)), ['`frame` Frame', 'Tool', 'Kit']);
  assert.deepEqual(tokens.filter(token => token.kind === 'comment').map(token => input.slice(token.range.from, token.range.to)), ['> NOTE: `frame` is a comment here.', '> **Still a comment.**']);
  const preview = document.hover(input.indexOf('assets/map.svg'))!;
  assert.equal(preview.kind, 'image');
  assert(preview.kind === 'image');
  assert.equal(preview.url, 'assets/map.svg'); assert.equal(preview.alt, 'Map');
  assert.equal(input.slice(preview.range.from, preview.range.to), '![Map](assets/map.svg)');
  assert.equal(document.hover(input.indexOf('An image')), undefined);
});

test('chapter ID and wrapped-title references share hover, definitions and references with precise spans', () => {
  const manuscript = '# Chapters\n## First\n**Items**\n- `array` Array\n  - from chapter `storm`: Dusty array\n  - from chapter **Amber: Dawn** icon: ![dust](dust.svg)\n## `storm` Amber: Dawn\nDust is falling.\n**Goals**\n- Protect the array -- `array`\n## Unused\n';
  for (const input of [manuscript, manuscript.replaceAll('\n', '\r\n')]) {
    const document = new StoryLanguageDocument(input);
    const id = input.indexOf('`storm`'), title = input.indexOf('**Amber: Dawn**'), declaration = input.indexOf('## `storm`') + 3;
    const definition = document.definition(id);
    assert.equal(definition.length, 1);
    assert.equal(definition[0].source.span.from, declaration);
    assert.equal(input.slice(definition[0].source.span.from, definition[0].source.span.to), '`storm` Amber: Dawn');
    assert.deepEqual(document.definition(title), definition);
    assert.equal(document.references(declaration, {includeDeclaration: false}).length, 2);
    const hover = document.hover(declaration)!;
    assert(hover.kind === 'symbol' && hover.symbol.kind === 'chapter');
    assert.equal(hover.symbol.name, 'Amber: Dawn');
    assert.deepEqual(hover.properties, ['Chapter 2 of 3']);
    assert.deepEqual(hover.descriptions.map(d => d.text), ['Dust is falling.']);
    assert.equal(hover.goals[0].text, 'Protect the array');
    assert.equal(hover.referenceCount, 3);
    assert.deepEqual(document.semanticTokens().filter(token => token.kind === 'chapter').map(token => input.slice(token.range.from, token.range.to)), ['First', '`storm`', '**Amber: Dawn**', '`storm` Amber: Dawn', 'Unused']);
    assert.equal(document.hover(input.indexOf('dust.svg'))?.kind, 'image');
  }
});

test('title-only chapter symbols remain stable when chapters move and unknown references stay navigable', () => {
  const manuscript = '# Chapters\n## First\n**Items**\n- `a` A\n  - from chapter "Later": Later A\n  - from chapter `missing`: Missing A\n## Later\n';
  const original = new StoryLanguageDocument(manuscript), position = manuscript.indexOf('"Later"');
  const symbol = original.symbolAt(position)!;
  const moved = new StoryLanguageDocument(manuscript.replace('## First', '## Inserted\n## First'));
  assert.equal(moved.references(symbol, {includeDeclaration: true}).length, 2);
  assert.deepEqual(original.definition(manuscript.indexOf('`missing`')), []);
  assert.equal(original.references(manuscript.indexOf('`missing`'), {includeDeclaration: false}).length, 1);
});
