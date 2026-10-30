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
