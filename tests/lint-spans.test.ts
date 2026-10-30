import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {sourceMap} from '../src/story/source-map.ts';
import {lintStory, lintStoryAnalysis} from '../src/lint/lint.ts';

test('diagnostic spans address original UTF-16 text across CRLF and source comments', () => {
  const markdown = '# 🪴 Garden\r\n> NOTE: hidden author comment\r\n## Workshop\r\n![room](room.webp)\r\n**Goals**\r\n- next: Finish -- C\r\n**Combinations**\r\n- A + B -> C';
  const story = parseStory(markdown, {file: 'garden/story.md'});
  const diagnostics = lintStory(story, {analysis: false});
  const next = diagnostics.find(diagnostic => diagnostic.code === 'first-next')!;
  assert.equal(markdown.slice(next.span.from, next.span.to), 'next:');
  assert.equal(next.source.line, 6); assert.equal(next.source.column, 3);
  const fate = diagnostics.find(diagnostic => diagnostic.code === 'single-use-fate')!;
  assert.equal(markdown.slice(fate.span.from, fate.span.to), '- A + B -> C');
  for (const diagnostic of diagnostics) {
    assert(diagnostic.span.from >= 0 && diagnostic.span.to <= markdown.length);
    assert(diagnostic.span.from < diagnostic.span.to);
    assert.equal(diagnostic.stage, 'fast');
  }
  assert.deepEqual(sourceMap('', 'empty.md').line(1).span, {from: 0, to: 0});
});

test('fast lint omits global reachability and deep analysis adds separately attributed diagnostics', () => {
  const story = parseStory('# Cycle\n## Workshop\n![room](room.webp)\n**Goals**\n- Make A -- A\n**Combinations**\n- A [preserve] + Tool [preserve] -> B\n- B [preserve] + Tool [preserve] -> A');
  const fast = lintStory(story, {analysis: false});
  assert(!fast.some(diagnostic => diagnostic.code === 'no-continuation'));
  const deep = lintStoryAnalysis(story, fast);
  assert.equal(deep.length, 1); assert.equal(deep[0].code, 'no-continuation');
  assert.equal(deep[0].stage, 'deep'); assert.deepEqual(deep[0].span, {from: 0, to: 7});
  assert.deepEqual(lintStory(story), [...fast, ...deep]);
});

test('mixed fates explain every use, including defaults and implicit slot behavior', () => {
  const markdown = [
    '# Fates', '## Workshop', '![room](room.webp)', '**Items**',
    '- Frame (compound)', '  - slot: Fitting, accepts Part', '**Combinations**',
    '- Part + Tool [preserve] -> First result',
    '- Part [preserve] + Tool [preserve] -> Second result',
    '- Part [consume] + Tool [preserve] -> Third result',
    '- Part [transform] + Tool [preserve] -> Fourth result',
    '- Frame [transform] + Tool [preserve] -> Fifth result',
  ].join('\r\n');
  const diagnostics = lintStory(parseStory(markdown, {file: 'fixture/story.md'}), {analysis: false});
  const part = diagnostics.find(d => d.code === 'mixed-fates' && d.message.startsWith('Part '))!;
  assert.match(part.message, /preserve \(2\), consume \(2\), transform \(1\)/);
  assert.deepEqual(part.related!.map(location => location.message), [
    'preserve (default): Part + Tool → First result',
    'preserve (explicit): Part + Tool → Second result',
    'consume (explicit): Part + Tool → Third result',
    'transform (explicit): Part + Tool → Fourth result',
    'consume (implicit slot installation): Frame + Part → Frame[Part]',
  ]);
  assert.deepEqual(part.related![0].span, part.span, 'the primary use is also explained');
  assert.deepEqual(part.related!.map(location => markdown.slice(location.span.from, location.span.to)), [
    '- Part + Tool [preserve] -> First result',
    '- Part [preserve] + Tool [preserve] -> Second result',
    '- Part [consume] + Tool [preserve] -> Third result',
    '- Part [transform] + Tool [preserve] -> Fourth result',
    '- slot: Fitting, accepts Part',
  ]);
  const frame = diagnostics.find(d => d.code === 'mixed-fates' && d.message.startsWith('Frame '))!;
  assert.match(frame.related![1].message, /^preserve \(implicit slot-owner preservation\):/);
  const hidingOnly = markdown.split('\r\n').filter(line => !line.includes('First result') && !line.includes('Second result')).join('\r\n');
  assert(!lintStory(parseStory(hidingOnly), {analysis: false}).some(d => d.code === 'mixed-fates' && d.message.startsWith('Part ')), 'consume and transform alone do not introduce a new warning');
});

test('many visible goals point at their first Goals heading with original CRLF offsets', () => {
  const markdown = '# 🪴 Garden\r\n## Workshop\r\n![room](room.webp)\r\n\r\n**Goals**\r\n- First -- A\r\n- Second -- B\r\n**Goals**\r\n- Third -- C';
  const story = parseStory(markdown);
  const diagnostic = lintStory(story, {analysis: false}).find(d => d.code === 'many-visible-goals')!;
  assert.equal(diagnostic.source.line, 5);
  assert.equal(diagnostic.span.from, markdown.indexOf('**Goals**'));
  assert.equal(markdown.slice(diagnostic.span.from, diagnostic.span.to), '**Goals**');
  assert.deepEqual(diagnostic.source, story.chapters[0].goalsSource);
});
