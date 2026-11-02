import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {parseStory} from '../src/story/parser.ts';
import {constructionMetrics} from '../src/analysis/construction.ts';
import {measureRoute} from '../src/analysis/route.ts';
import {analyzeStory, corpusSummary} from '../src/analysis/analyze.ts';
import {summarize} from '../src/analysis/statistics.ts';
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

test('construction maxima include alternative recipes and unfold a shared dependency twice', () => {
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
  assert.deepEqual(item(s, 'F'), {id: 'name:F', name: 'F', primitive: false, depth: 3, nodes: 11, leaves: 6, depthPath: ['A', 'C', 'D', 'F']});
  assert.equal(item(s, 'A').depth, 0);
  assert.equal(item(s, 'A').nodes, 1);
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
  assert.deepEqual(result.totals, {items: 7, primitives: 5, derived: 2, rules: 4, explicitRules: 2, installations: 2, chapters: 1, playableChapters: 1});
  assert.equal(item(s, 'Box').primitive, true);
  assert.equal(item(s, 'Box').depth, 3);
  assert.equal(item(s, 'Final').depth, 4);
  assert.equal(item(s, 'Final').nodes, 9);
  assert.equal(item(s, 'Final').leaves, 5);
  assert.equal(result.details.route.combinations, 4);
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
  assert.equal(item(s, 'Final').nodes, 7);
  assert.equal(item(s, 'Final').leaves, 4);
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

test('chain chapters count causal events, excluding gaps, skipped chapters and the ending', () => {
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
  assert.deepEqual(route.chapters.map(c => [c.index, c.combinations]), [[0, 1], [2, 0], [3, 1]]);
  assert.deepEqual(route.items.find(i => i.id === 'name:D')?.chapterPath, [0, 3]);
  assert.equal(result.totals.chapters, 5);
  assert.equal(result.totals.playableChapters, 4);
  assert.equal(result.metrics.combinations.n, 3);
  assert.equal(result.metrics.combinations.min, 0);
  assert.equal(route.chapters[0].newPrimitives, 2);
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
  assert.equal(route.chapters[1].peakBoard, 2); // owner + loose part; C stayed on the earlier surface
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
  assert.equal(result.totals.items, 2);
  assert.equal(item(s, 'Core').nodes, 2);
  assert.equal(item(s, 'Core').leaves, 1);
  assert.equal(result.details.route.combinations, 1);
  assert.equal(result.metrics.peakBoard.max, 2);
  assert.deepEqual(corpusSummary([result]).rules, {n: 1, min: 1, max: 1, avg: 1, median: 1});
});

test('CLI includes drafts, deduplicates input paths and preserves output on analysis failure', () => {
  const directory = mkdtempSync(join(tmpdir(), 'story-analysis-'));
  const manuscript = join(directory, 'draft.md'), output = join(directory, 'report.json');
  try {
    writeFileSync(manuscript, '# Draft\n\n## Start\n\n**Items**\n- A\n');
    const raw = execFileSync(process.execPath, ['src/analysis/cli.ts', 'theology', '--include', manuscript, '--include', manuscript, '--json'], {encoding: 'utf8'});
    const report = JSON.parse(raw);
    assert.equal(report.stories.length, 2);
    assert.equal(report.stories[1].totals.items, 1);
    assert.equal(report.stories[1].metrics.peakBoard.n, 0);
    assert.equal(report.stories[1].metrics.peakBoard.max, null);
    assert.equal(report.stories[1].details, undefined);
    writeFileSync(output, 'previous report');
    writeFileSync(manuscript, '# Broken\n\n## Start\n\n**Goals**\n- Missing -- Undeclared\n');
    const failed = spawnSync(process.execPath, ['src/analysis/cli.ts', 'theology', '--include', manuscript, '--output', output], {encoding: 'utf8'});
    assert.equal(failed.status, 1);
    assert.match(failed.stderr, /Undeclared/);
    assert.equal(readFileSync(output, 'utf8'), 'previous report');
  } finally { rmSync(directory, {recursive: true, force: true}); }
});
