import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {act, newGame, recipeFor, replay} from '../src/engine/game.ts';
import {analyzeOpportunities} from '../src/lint/opportunities.ts';
import {lintStory} from '../src/lint/lint.ts';
import {historyRetirementCheck, inventoryGroupKey, OptionalHistory} from '../src/lint/optional-history.ts';

const parse = (body: string) => parseStory(`# Opportunities\n## Start\n![room](room.webp)\n${body}`, {id: 'opportunities'});
const later = (name: string) => `\n## ${name}\n![room](room.webp)\n`;
const names = (story: ReturnType<typeof parse>, ids: Iterable<string>) => [...ids].map(id => story.items[id].name);

test('derived declarations neither supply ingredients nor prevent future cleanup', () => {
  const text = `**Goals**
- Finish -- Planks
**Combinations**
- Wood [transform] + Saw [preserve] -> Planks
- Wood [preserve] + Cloth [preserve] -> Sail
${later('Flag')}
**Goals**
- Raise flag -- Raised flag
**Combinations**
- Flag [consume] + Pole [preserve] -> Raised flag`;
  const plain = parse(text), declared = parse(text.replace('## Flag', '## Flag\n**Items**\n- Sail\n- Planks'));
  const make = (story: ReturnType<typeof parse>) => act(story, newGame(story), {type: 'combine', a: 'name:Wood', b: 'name:Saw'});
  assert.equal(make(plain).tokens['name:Wood'].status, 'transform');
  assert.equal(make(declared).tokens['name:Wood'].status, 'transform');
  let state = make(declared);
  state = act(declared, state, {type: 'advance'});
  assert(!state.tokens['name:Cloth'], 'a derived metadata entry must not introduce an optional ingredient');
  assert.equal(state.tokens['name:Planks'].chapter, 0, 'a derived metadata entry must not carry an existing result to a new board');
});

test('warns about disconnected primitive chains at their first reference, with producing locations', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Combinations**
- Flag [consume] + Pole [preserve] -> Done (tutorial)
- Missing [consume] + Tool [preserve] -> Decoration
- Flag
- Pole
- Done
- Missing
- Tool
- Decoration`);
  const diagnostics = lintStory(story).filter(d => ['unsupplied-primitive', 'no-item-opportunity'].includes(d.code));
  assert.deepEqual(diagnostics.map(d => d.code).sort(), ['no-item-opportunity', 'unsupplied-primitive', 'unsupplied-primitive']);
  assert(diagnostics.every(d => d.severity === 'warning'), 'content opportunities guide authors without blocking the site build');
  const missing = diagnostics.find(d => d.message.startsWith('Missing'))!;
  assert.equal(missing.span.to - missing.span.from, 'Missing'.length);
  const decoration = diagnostics.find(d => d.code === 'no-item-opportunity')!;
  assert(decoration.related?.some(location => location.message.includes('Producing combination')));
  assert.match(decoration.message, /Missing is not supplied/);
  assert(decoration.related?.some(location => location.span.to - location.span.from === 'Missing'.length));
});

test('optional probes respect cleanup and never turn their target into a protecting goal', () => {
  const body = `**Goals**
- Finish -- Done
**Items**
- Wood
- Saw
**Combinations**
- Wood [transform] + Saw [preserve] -> Planks
- Wood [consume] + Planks [consume] -> Bench
- Flag [consume] + Pole [preserve] -> Done`;
  const story = parse(body), report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Planks'));
  assert(!report.opportunities.has('name:Bench'));
  assert.match(report.explanations.get('name:Bench')!.message, /Wood has already been consumed or transformed/);
  assert(report.explanations.get('name:Bench')!.related.some(location => location.message.includes('when making Planks')));
  const goal = parse(body.replace('- Finish -- Done', '- Finish -- Done\n- Make bench -- Bench'));
  assert(analyzeOpportunities(goal).opportunities.has('name:Bench'));
});

test('exclusive alternatives are individually discoverable but cannot be unioned into one inventory', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Items**
- Raw
- Tool
- Left (exclusive with Right)
- Right (exclusive with Left)
**Combinations**
- Flag [consume] + Pole [preserve] -> Done
- Raw [preserve] + Tool [preserve] -> Left
- Raw [preserve] + Flag [preserve] -> Right
- Left [consume] + Right [consume] -> Impossible`);
  assert(!lintStory(story, {analysis: false}).some(d => d.code === 'exclusive-needs'));
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Left'));
  assert(report.opportunities.has('name:Right'));
  assert(!report.opportunities.has('name:Impossible'));
});

test('different constructed-item sets remain separate rather than inventing missing alternatives', () => {
  const story = parse(`**Goals**
- First choice
  - either: X
  - or: Y
- Second choice
  - either: U
  - or: V
**Items**
- X (exclusive with Y)
- Y (exclusive with X)
- U (exclusive with V)
- V (exclusive with U)
**Combinations**
- A [preserve] + Tool [preserve] -> X
- A [preserve] + Other [preserve] -> Y
- B [preserve] + Tool [preserve] -> U
- B [preserve] + Other [preserve] -> V
${later('Later')}
**Goals**
- First finish -- Done X
- Second finish -- Done U
**Hotspots**
- Bench
**Combinations**
- X [preserve] + Q [preserve] -> Done X
- Y [preserve] + Q [preserve] -> Done X
- U [preserve] + R [preserve] -> Done U
- V [preserve] + R [preserve] -> Done U
- X [preserve] + U [preserve] @ Bench -> XU
- X [preserve] + V [preserve] @ Bench -> XV
- Y [preserve] + U [preserve] @ Bench -> YU
- Y [preserve] + V [preserve] @ Bench -> YV`);
  const report = analyzeOpportunities(story);
  assert(report.complete, report.limit);
  assert.equal(report.stats.chapters.find(c => c.chapter === 1)?.entries, 4);
  for (const name of ['XU', 'XV', 'YU', 'YV']) {
    assert(report.opportunities.has(`name:${name}`), 'different recipe outcomes remain distinct sets');
  }
});

test('pessimistic retirement rejects an opportunity that relies on a favourable goal order', () => {
  const story = parse(`**Goals**
- Make X -- X
- Make Y -- Y
**Combinations**
- Raw [transform] + Tool [preserve] -> A
- A [preserve] + Tool [preserve] -> X
- A [transform] + Hammer [preserve] -> Y
${later('Later')}
**Goals**
- Finish -- Done
**Items**
- Extra
**Combinations**
- X [preserve] + Q [preserve] -> Done
- A [consume] + Q [preserve] -> Done
- A [consume] + Extra [preserve] -> Surprise`);
  const state = replay(story, [
    {type: 'combine', a: 'name:Raw', b: 'name:Tool'},
    {type: 'combine', a: 'name:A', b: 'name:Hammer'},
    {type: 'combine', a: 'name:A', b: 'name:Tool'},
    {type: 'advance'},
    {type: 'combine', a: 'name:A', b: 'name:Extra'},
  ]);
  assert.equal(state.tokens['name:Surprise'].chapter, 1);
  const pessimistic = analyzeOpportunities(story);
  assert(pessimistic.complete);
  assert(!pessimistic.opportunities.has('name:Surprise'), 'possible retirement is resolved to retired before chapter carry');
});

test('goal-only frontiers exclude unused alternative constructions', () => {
  const story = parse(`**Goals**
- Choose
  - either: X
  - or: Y
- Also make Z -- Z
**Combinations**
- A [preserve] + Tool [preserve] -> X
- B [preserve] + Tool [preserve] -> Y
- C [preserve] + Tool [preserve] -> Z
${later('Later')}
**Goals**
- Finish -- Done
**Combinations**
- X [preserve] + New [preserve] -> Done
- Y [preserve] + New [preserve] -> Done
- Absent [preserve] + New [preserve] -> Unreachable`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert.equal(report.stats.chapters.find(c => c.chapter === 1)?.entries, 2,
    'there must be an X route and a Y route, without a third route building both before Z');
});

test('optional earlier preparations do not seed later chapter frontiers', () => {
  const story = parse(`**Goals**
- Finish -- Flag
**Items**
- Tool
**Combinations**
- Wood [transform] + Banner [preserve] -> Flag
- Wood [preserve] + Tool [preserve] -> Preparation
${later('Later')}
**Goals**
- Finish later -- Done
**Items**
- Extra
**Combinations**
- X [preserve] + Q [preserve] -> Done
- Preparation [preserve] + Q [preserve] -> Done
- Preparation [preserve] + Extra [preserve] -> Optional sequel`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Preparation'));
  assert(!report.opportunities.has('name:Optional sequel'));
  // The excluded opportunity really is possible with optional preparation in the prefix.
  let state = newGame(story);
  for (const [a, b] of [['Wood', 'Tool'], ['Wood', 'Banner']]) state = act(story, state, {type: 'combine', a: `name:${a}`, b: `name:${b}`});
  state = act(story, state, {type: 'advance'});
  state = act(story, state, {type: 'combine', a: 'name:Preparation', b: 'name:Extra'});
  assert(state.tokens['name:Optional sequel']);
});

test('a goal already achieved at entry cannot justify extra work on another alternative', () => {
  const story = parse(`**Goals**
- Make X -- X
**Combinations**
- Raw [preserve] + Tool [preserve] -> X
${later('Middle')}
**Goals**
- Already satisfied
  - either: X
  - or: Y
- Make Z -- Z
**Items**
- B
**Combinations**
- B [preserve] + Tool [preserve] -> Y
- New [preserve] + Tool [preserve] -> Z
${later('Last')}
**Goals**
- Finish -- Done
**Combinations**
- X [preserve] + Q [preserve] -> Done
- Y [preserve] + Q [preserve] -> Done
- Absent [preserve] + Q [preserve] -> Unreachable`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Y'), 'Y remains a legitimate local optional discovery');
  assert.equal(report.stats.chapters.find(c => c.chapter === 2)?.entries, 1,
    'optional Y must not be carried forward as though required by the already-latched goal');
});

test('probes handle slot installation while gameplay retains its readings', () => {
  const story = parse(`Welcome.
**Goals**
- Finish -- Done
**Items**
- Box (compound)
  - slot: fitting, accepts Part
- Part
- Tool
**Combinations**
- Flag [consume] + Pole [preserve] -> Done
- Box[Part] [preserve] + Tool [preserve] -> Toy

  A working toy.`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Toy'));
  const state = replay(story, [
    {type: 'dismiss'},
    {type: 'combine', a: 'name:Box', b: 'name:Part'},
    {type: 'combine', a: 'name:Box', b: 'name:Tool'},
    {type: 'dismiss'},
  ]);
  assert.equal(state.tokens['name:Toy'].status, 'available');
  assert.deepEqual(state.tokens['name:Box'].slots, ['name:Part']);
  assert.equal(state.pending.length, 0);
});

test('a past hotspot is not a local opportunity on a new chapter board', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Hotspots**
- Old bench
**Combinations**
- Flag [consume] + Pole [preserve] -> Done
${later('Later')}
**Goals**
- Finish later -- Later done
**Items**
- A
**Combinations**
- Q [consume] + Tool [preserve] -> Later done
- A [preserve] @ Old bench -> Requires scrollback`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(!report.opportunities.has('name:Requires scrollback'));
});

test('exceeding the frontier limit reports analysis failure without absent-item conclusions', () => {
  const story = parse(`**Goals**
- Choose
  - either: Left
  - or: Right
**Combinations**
- A [preserve] + Tool [preserve] -> Left (tutorial)
- B [preserve] + Tool [preserve] -> Right
- Missing [preserve] + Tool [preserve] -> Unreachable
- A
- B
- Tool
- Left
- Right
- Missing
- Unreachable`);
  const diagnostics = lintStory(story, {opportunities: {maxFrontier: 1}});
  assert(diagnostics.some(d => d.code === 'opportunity-analysis-limit' && d.severity === 'error' && d.message.includes('1-element construction-set')));
  assert(!diagnostics.some(d => ['unsupplied-primitive', 'no-item-opportunity'].includes(d.code)));
});

test('opportunities do not assume every cyclic dependency is constructible', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Items**
- Tool
**Combinations**
- Flag [consume] + Pole [preserve] -> Done
- A [preserve] + Tool [preserve] -> B
- B [preserve] + Tool [preserve] -> A`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert.deepEqual(names(story, report.opportunities.keys()).sort(), ['Done', 'Flag', 'Pole', 'Tool']);
});

test('OPTIONAL retirement never becomes permission to create the item again', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Items**
- Wood
**Combinations**
- Wood [consume] + Saw [preserve] -> Done`);
  const before = newGame(story);
  const retired = structuredClone(before);
  retired.tokens['name:Wood'].status = 'consume';
  const history = new OptionalHistory(story, before);
  history.add(retired);
  const possibilities = [history.collapse()];
  assert.equal(history.optionalItems, 1);
  assert.deepEqual(possibilities.map(state => state.tokens['name:Wood']?.status), ['consume']);
  assert(possibilities.every(state => !!state.tokens['name:Wood']));
});

test('irrelevant old exclusive branches cannot erase later chapter arrivals', () => {
  const story = parse(`**Goals**
- Finish -- Done
**Combinations**
- Raw [preserve] + Tool [preserve] -> Left (exclusive with Right)
- Raw [preserve] + Other [preserve] -> Right (exclusive with Left)
- Left [transform] + Tool [preserve] -> Done
- Right [transform] + Other [preserve] -> Done
${later('Later')}
**Goals**
- Finish later -- Later done
**Combinations**
- X [preserve] + Y [preserve] -> Later done`);
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert(report.opportunities.has('name:Later done'));
});

test('independent goals form one construction set instead of enumerating partial subsets', () => {
  const goals = Array.from({length: 11}, (_, i) => `- Make ${i} -- Result ${i}`);
  const recipes = Array.from({length: 11}, (_, i) => `- Raw ${i} [preserve] + Tool [preserve] -> Result ${i}`);
  const story = parse(`**Goals**\n${goals.join('\n')}\n**Combinations**\n${recipes.join('\n')}`);
  const report = analyzeOpportunities(story);
  assert(report.complete, report.limit);
  assert.equal(report.opportunities.size, Object.keys(story.items).length);
  assert.equal(report.stats.constructionSets, 1, 'eleven independent constructions do not require 2,048 partial states');
  assert.equal(report.stats.chapters[0].endings, 1);
  assert.equal(report.stats.peakFrontier, 1);
});

test('producer alternatives with identical construction sets merge before combining independent goals', () => {
  const goals = Array.from({length: 11}, (_, i) => `- Make ${i} -- Result ${i}`);
  const recipes = Array.from({length: 11}, (_, i) => `- Left ${i} [consume] + Tool [preserve] -> Result ${i}\n- Right ${i} [consume] + Tool [preserve] -> Result ${i}`);
  const story = parse(`**Goals**\n${goals.join('\n')}\n**Combinations**\n${recipes.join('\n')}`);
  const report = analyzeOpportunities(story);
  assert(report.complete, report.limit);
  assert.equal(report.stats.constructionSets, 1);
  assert.equal(report.stats.peakFrontier, 1);
});

test('genuinely different construction sets still stop at the 101st alternative', () => {
  const goals = Array.from({length: 7}, (_, i) => `- Choose ${i}\n  - either: Left ${i}\n  - or: Right ${i}`);
  const recipes = Array.from({length: 7}, (_, i) => `- Raw ${i} [preserve] + Tool [preserve] -> Left ${i}\n- Raw ${i} [preserve] + Other [preserve] -> Right ${i}`);
  const report = analyzeOpportunities(parse(`**Goals**\n${goals.join('\n')}\n**Combinations**\n${recipes.join('\n')}`));
  assert(!report.complete);
  assert.match(report.limit!, /100-element/);
  assert.equal(report.stats.peakFrontier, 101);
});

test('retired-versus-uncreated histories merge without inventing protection or recreation', () => {
  const story = parse(`**Goals**
- First -- Done
**Combinations**
- Seed [preserve] + Tool [preserve] -> A
- A [transform] + Tool [preserve] -> Done
- Seed [preserve] + Other [preserve] -> Done
${later('Middle')}
**Goals**
- Make D -- D
**Items**
- Late tool
**Combinations**
- X [transform] + Tool [preserve] -> D
- X [preserve] + D [preserve] -> Extra
- A [preserve] + Late tool [preserve] -> Later use
${later('Last')}
**Goals**
- Finish -- C
**Combinations**
- A [preserve] + Tool [preserve] -> C
- X [preserve] + Tool [preserve] -> C`);
  let viaA = newGame(story), direct = newGame(story);
  viaA = act(story, viaA, {type: 'combine', a: 'name:Seed', b: 'name:Tool'});
  viaA = act(story, viaA, {type: 'combine', a: 'name:A', b: 'name:Tool'});
  direct = act(story, direct, {type: 'combine', a: 'name:Seed', b: 'name:Other'});
  assert.equal(inventoryGroupKey(story, viaA), inventoryGroupKey(story, direct));
  // Check both insertion orders: noncreation is not a representative history.
  for (const [first, second] of [[viaA, direct], [direct, viaA]]) {
    const history = new OptionalHistory(story, first); history.add(second);
    const state = act(story, history.collapse(), {type: 'advance'});
    assert(state.tokens['name:A'], 'a possibly retired identity remains blocked');
    assert(history.possiblyUncreated.has('name:A'));
    assert(!recipeFor(story, state, {type: 'combine', a: 'name:Seed', b: 'name:Tool'}));
    const carried = new OptionalHistory(story, state, history.possiblyUncreated);
    assert(carried.possiblyUncreated.has('name:A'), 'retain creation uncertainty across chapter boundaries');
    const action = {type: 'combine', a: 'name:X', b: 'name:Tool'} as const;
    assert.equal(act(story, state, action).tokens['name:X'].status, 'available', 'a naive ordinary-state merge would invent protection');
    const checked = act(story, state, action, historyRetirementCheck(story, carried.possiblyUncreated));
    assert.equal(checked.tokens['name:X'].status, 'transform');
    assert(!recipeFor(story, checked, {type: 'combine', a: 'name:X', b: 'name:D'}));
  }
  const report = analyzeOpportunities(story);
  assert(report.complete);
  assert.equal(report.stats.chapters.find(chapter => chapter.chapter === 1)?.entries, 1);
  assert(report.opportunities.has('name:A'), 'discovery before the merge remains credited');
  assert(!report.opportunities.has('name:Extra'));
  assert.match(report.explanations.get('name:C')!.message, /produces D before C/);
  assert.match(report.explanations.get('name:Later use')!.message, /merged history therefore blocks recreating/);
});

test('opportunity warnings locate an ingredient left on an earlier board', () => {
  const story = parse(`**Goals**
- First -- Done
**Items**
- Decoration
**Combinations**
- Seed [consume] + Tool [preserve] -> Done (tutorial)
${later('Display')}
**Goals**
- Finish -- Finished
**Hotspots**
- Display stand
**Combinations**
- Fresh [consume] + Tool [preserve] -> Finished
- Decoration [preserve] + Tool [preserve] @ Display stand -> Displayed decoration
- Seed
- Tool
- Done
- Fresh
- Finished
- Displayed decoration`);
  const diagnostic = lintStory(story).find(d => d.code === 'no-item-opportunity')!;
  assert.match(diagnostic.message, /Decoration is left on an earlier board/);
  const location = diagnostic.related!.find(location => location.message.startsWith('Decoration is left'))!;
  assert.equal(location.span.to - location.span.from, 'Decoration'.length);
});
