import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {parseStory} from '../src/story/parser.ts';
import {constructionMetrics} from '../src/analysis/construction.ts';
import {measureRoute} from '../src/analysis/route.ts';
import {analyzeStory} from '../src/analysis/analyze.ts';
import {checkpoint} from '../src/debug/checkpoint.ts';
import {summarize} from '../src/analysis/statistics.ts';
import {markdownTable} from '../src/analysis/report.ts';
import type {Action} from '../src/engine/types.ts';

const fixture = (body: string) => parseStory(`# Test\n\n## Start\n\n![room](room.webp)\n\n${body}`, {id: 'test'});
const item = (story: ReturnType<typeof parseStory>, name: string) => constructionMetrics(story).find(i => i.name === name)!;
const combine = (a: string, b: string): Action => ({type: 'combine', a: `name:${a}`, b: `name:${b}`});

test('distributions distinguish empty samples from zero and average even medians', () => {
  assert.deepEqual(summarize([]), {n: 0, min: null, max: null, avg: null, median: null});
  assert.deepEqual(summarize([0]), {n: 1, min: 0, max: 0, avg: 0, median: 0});
  assert.deepEqual(summarize([6, 0, 2, 4]), {n: 4, min: 0, max: 6, avg: 3, median: 3});
  assert.throws(() => summarize([NaN]), /finite/);
});

test('chain lengths follow the longest alternative without adding parallel branches together', () => {
  const s = fixture(`**Items**
- A
- B
- C
- D
- E
- F
**Combinations**
- A [preserve] + B [preserve] -> C
- C [preserve] + A [preserve] -> D
- C [preserve] + B [preserve] -> E
- D [consume] + E [consume] -> F
- A [preserve] + B [preserve] -> F`);
  assert.deepEqual(item(s, 'F'), {id: 'name:F', name: 'F', primitive: false, depth: 3, depthPath: ['A', 'C', 'D', 'F']});
  assert.equal(item(s, 'A').depth, 0);
});

test('compound fitting counts sequential owner versions without inventing new identities or cycles', () => {
  const s = fixture(`**Goals**
- Finish -- Final
**Items**
- A
- B
- Motor
- Battery
- Cover
- Final
- Box (compound)
  - unnamed slot: accepts Motor
  - unnamed slot: accepts Battery
**Combinations**
- A [consume] + B [consume] -> Motor
- Box[Motor,Battery] [transform] + Cover [consume] -> Final`);
  const result = analyzeStory(s);
  assert.deepEqual(result.totals, {primitives: 5, derived: 2, combinations: 4, chapters: 1});
  assert.equal(item(s, 'Box').primitive, true);
  assert.equal(item(s, 'Box').depth, 3);
  assert.equal(item(s, 'Final').depth, 4);
  assert.equal(result.details.route.combinations, 4);
  assert.equal(result.completion.combinations, 4);
});

test('a producer returning an already fitted state does not install that component twice', () => {
  const s = fixture(`**Items**
- Frame
- Tool
- Motor
- Battery
- Cover
- Final
- Box (compound)
  - unnamed slot: accepts Motor
  - unnamed slot: accepts Battery
**Combinations**
- Frame [transform] + Tool [preserve] -> Box[Motor]
- Box[Motor,Battery] [transform] + Cover [consume] -> Final`);
  assert.equal(item(s, 'Final').depth, 3);
});

test('cyclic construction graphs are rejected explicitly, including cycles with an escape recipe', () => {
  const s = fixture(`**Items**
- Seed
- Tool
- A
- B
**Combinations**
- Seed [preserve] + Tool [preserve] -> A
- A [preserve] + Tool [preserve] -> B
- B [preserve] + Tool [preserve] -> A`);
  assert.throws(() => constructionMetrics(s), /does not support dependency cycles/);
});

test('chains exclude gaps, while checkpoint item counts match debugger jumps including skips and the ending', () => {
  const s = fixture(`**Goals**
- Prepare -- C
**Items**
- A
- B
- C
**Combinations**
- A [consume] + B [preserve] -> C
## Already done
**Goals**
- Prepare -- C
## Wait
An intervening quiet chapter.
## Finish
**Goals**
- Finish -- D
**Items**
- D
**Combinations**
- C [transform] + B [preserve] -> D
## Ending
Done.`);
  const result = analyzeStory(s), route = result.details.route;
  assert.deepEqual(route.visitedChapters, [0, 2, 3, 4]);
  assert.deepEqual(route.items.find(i => i.id === 'name:D')?.chapterPath, [0, 3]);
  assert.equal(result.totals.chapters, 5);
  assert.equal(result.chains.acrossChapters, 1);
  assert.equal(result.completion.combinations, 2);
  const counts = s.chapters.map((_, index) => {
    const state = checkpoint(s, index);
    return {requestedChapter: index, chapter: state.chapter, name: s.chapters[state.chapter].name,
      items: Object.values(state.tokens).filter(t => t.status === 'available' && t.chapter === state.chapter).length};
  });
  assert.deepEqual(route.checkpoints.map(({peakItems,...entry})=>entry), counts);
  assert.equal(counts[1].chapter, 2);
  assert.equal(counts.at(-1)?.items, 0);
  assert.equal(result.chapterItems.average, counts.reduce((sum, c) => sum + c.items / counts.length, 0));
});

test('fitting later does not rewrite earlier ancestry; moving an item does not create a chain chapter', () => {
  const s = fixture(`**Goals**
- First -- C
**Items**
- Box (compound)
  - unnamed slot: accepts Motor
- Tool
- C
**Combinations**
- Box [preserve] + Tool [preserve] -> C
## Fit
**Goals**
- Fit -- Box[Motor]
**Items**
- Motor
## Use
**Goals**
- Done -- D
**Items**
- D
**Combinations**
- Box[Motor] [preserve] + C [transform] -> D
## Ending
Done.`);
  const route = measureRoute(s, [
    combine('Box', 'Tool'), {type: 'advance'}, combine('Motor', 'Box'), {type: 'advance'},
    {type: 'move', item: 'name:C', chapter: 0, x: 10, y: 20}, combine('Box', 'C'), {type: 'advance'},
  ]);
  assert.deepEqual(route.items.find(i => i.id === 'name:C')?.chapterPath, [0]);
  assert.deepEqual(route.items.find(i => i.id === 'name:Box')?.chapterPath, [1]);
  assert.equal(route.items.find(i => i.id === 'name:D')?.chapters, 2);
  assert.equal(route.checkpoints[1].items, 2); // owner + loose part; C stayed on the earlier surface
  assert.throws(() => measureRoute(s, []), /did not complete/);
});

test('a hotspot operation adds one construction step, without treating the landscape as a primitive', () => {
  const s = fixture(`**Goals**
- Drill -- Core
**Hotspots**
- Ice
**Items**
- Drill
- Core
**Combinations**
- Drill [preserve] @ Ice -> Core`);
  const result = analyzeStory(s);
  assert.equal(result.totals.primitives, 1);
  assert.equal(result.totals.derived, 1);
  assert.equal(item(s, 'Core').depth, 1);
  assert.equal(result.details.route.combinations, 1);
  assert.equal(result.chapterItems.max, 1); // Drill on entry, not Drill + Core after combining
  assert.equal(result.details.route.checkpoints[0].peakItems,2);
});

test('CLI accepts one file on stdout, includes drafts, deduplicates paths and preserves output on failure', () => {
  const directory = mkdtempSync(join(tmpdir(), 'story-analysis-'));
  const manuscript = join(directory, 'draft.md'), output = join(directory, 'report.json');
  try {
    writeFileSync(manuscript, '# Draft\n\n## Start\n\n**Items**\n- A\n');
    const raw = execFileSync(process.execPath, ['src/analysis/cli.ts', 'theology', '--include', manuscript, '--include', manuscript, '--json'], {encoding: 'utf8'});
    const report = JSON.parse(raw);
    assert.equal(report.schemaVersion, 2);
    assert.equal(report.stories.length, 2);
    assert.equal(report.stories[1].totals.primitives, 1);
    assert.equal(report.stories[1].chapterItems.average, 1); // final goal-free chapter is still a checkpoint
    assert.equal(report.stories[1].completion.combinations, 0);
    assert.equal(report.stories[1].details, undefined);
    const single = JSON.parse(execFileSync(process.execPath, ['src/analysis/cli.ts', manuscript, '--json'], {encoding: 'utf8'}));
    assert.equal(single.stories.length, 1);
    assert.equal(single.stories[0].title, 'Draft');
    const printed = execFileSync(process.execPath, ['src/analysis/cli.ts', manuscript], {encoding: 'utf8'});
    assert.equal(printed, [
      '1. Number of items: total 1, of which primitive 1',
      '2. Number of combinations: total 0, to complete story 0',
      '3. Number of chapters: 1',
      '4. Chain length: avg 0.0, max 0',
      '5. Number of >1 chapter chains: 0',
      '6. Number of items at each chapter start: avg 1.0, max 1',
      '',
    ].join('\n'));
    const table = execFileSync(process.execPath, ['src/analysis/cli.ts', manuscript, '--table'], {encoding: 'utf8'});
    assert.equal(table.trimEnd().split('\n').length, 12);
    assert(table.trimEnd().split('\n').every(line => line.startsWith('| ') && line.endsWith(' |')));
    const overwrite = spawnSync(process.execPath, ['src/analysis/cli.ts', manuscript, '--output', manuscript], {encoding: 'utf8'});
    assert.equal(overwrite.status, 1);
    assert.match(overwrite.stderr, /must not overwrite/);
    writeFileSync(output, 'previous report');
    writeFileSync(manuscript, '# Broken\n\n## Start\n\n**Goals**\n- Missing -- Undeclared\n');
    const failed = spawnSync(process.execPath, ['src/analysis/cli.ts', 'theology', '--include', manuscript, '--table', '--output', output], {encoding: 'utf8'});
    assert.equal(failed.status, 1);
    assert.match(failed.stderr, /Undeclared/);
    assert.equal(readFileSync(output, 'utf8'), 'previous report');
  } finally { rmSync(directory, {recursive: true, force: true}); }
});

test('comparison table aligns column boundaries and indents the secondary measures', () => {
  const a = analyzeStory(fixture('**Items**\n- A')), b = {...a, title: 'A longer story name'};
  const lines = markdownTable([a, b]).trimEnd().split('\n');
  assert.equal(lines.length, 12); // one header, one separator, ten separate numbers
  const boundaries = (line: string) => [...line.matchAll(/\|/g)].map(match => match.index);
  for (const line of lines) assert.deepEqual(boundaries(line), boundaries(lines[0]));
  assert.match(lines[3], /\| \u00a0\u00a0of which primitive/);
  assert.match(lines[5], /\| \u00a0\u00a0to complete story/);
  assert.match(lines[8], /\| \u00a0\u00a0max/);
});
