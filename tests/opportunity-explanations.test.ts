import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseStory} from '../src/story/parser.ts';
import {newGame} from '../src/engine/game.ts';
import {OpportunityExplanations} from '../src/lint/opportunity-explanations.ts';

const manuscript = (body: string) => `# Explanations\n## Start\n**Items**\n- Tool\n${body}`;
const parse = (body: string) => parseStory(manuscript(body));

test('convergent dependencies retain one blocker without expanding every ancestry path', () => {
  const recipes = ['- Missing [preserve] + Tool [preserve] -> Node0', '- Node0 [preserve] + Tool [preserve] -> Node1'];
  for (let i = 2; i < 45; i++) recipes.push(`- Node${i - 1} [preserve] + Node${i - 2} [preserve] -> Node${i}`);
  const text = manuscript(`**Combinations**\n- Missing\n${recipes.join('\n')}\n- Node44 [preserve] + Tool [preserve] -> Target`);
  // Bound a regression in a subprocess: the old traversal expands billions of
  // repeated blockers, so an in-process timeout cannot interrupt it safely.
  const result = spawnSync(process.execPath, ['--max-old-space-size=128', '--input-type=module', '-e', `
    import {parseStory} from './src/story/parser.ts';
    import {newGame} from './src/engine/game.ts';
    import {OpportunityExplanations} from './src/lint/opportunity-explanations.ts';
    const story = parseStory(${JSON.stringify(text)}), explanations = new OpportunityExplanations(story);
    explanations.consider(newGame(story), new Set(), ['name:Target']);
    console.log(JSON.stringify(explanations.get('name:Target')));
  `], {cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8', timeout: 5000});
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const explanation = JSON.parse(result.stdout);
  assert.equal(explanation.related.length, 1);
  assert.match(explanation.message, /Missing is not supplied/);
});

test('producer ranking counts repeated blockers before deduplicating the final explanation', () => {
  const story = parse(`**Combinations**
- Missing [preserve] + Tool [preserve] -> Shared
- Shared [preserve] + Tool [preserve] -> Left
- Shared [preserve] + Left [preserve] -> Right
- Left [preserve] + Right [preserve] -> Choice
- Other [preserve] + Third [preserve] -> Choice
- Choice [preserve] + Tool [preserve] -> Target`);
  const explanations = new OpportunityExplanations(story);
  explanations.consider(newGame(story), new Set(), ['name:Target']);
  const explanation = explanations.get('name:Target')!;
  assert.deepEqual(explanation.related.map(location => location.message), [
    'Other is not supplied on this board by its goals or primitive Items entries.',
    'Third is not supplied on this board by its goals or primitive Items entries.',
  ]);
});

test('cycle explanations retain the current ancestor even with a noncyclic escape recipe', () => {
  const story = parse(`**Combinations**
- B [preserve] + Tool [preserve] -> A
- Missing [preserve] + Tool [preserve] -> A
- A [preserve] + Tool [preserve] -> B`);
  for (const targets of [['name:A', 'name:B'], ['name:B', 'name:A']]) {
    const explanations = new OpportunityExplanations(story);
    explanations.consider(newGame(story), new Set(), targets);
    assert.match(explanations.get('name:A')!.message, /A depends on a construction cycle/);
    assert.match(explanations.get('name:B')!.message, /B depends on a construction cycle/);
  }
});

test('memoized compound requirements retain their own missing slots and slot order', () => {
  const story = parse(`**Items**
- Owner (compound)
  - slot: First, accepts First
  - slot: Second, accepts Second
**Combinations**
- Owner[First] [preserve] + Tool [preserve] -> One
- Owner[Second] [preserve] + Tool [preserve] -> Two
- Owner[Second,First] [preserve] + Tool [preserve] -> Both`);
  const explanations = new OpportunityExplanations(story), state = newGame(story);
  explanations.consider(state, new Set(), ['name:One', 'name:Two', 'name:Both']);
  assert.match(explanations.get('name:One')!.message, /First is not supplied/);
  assert.doesNotMatch(explanations.get('name:One')!.message, /Second is not supplied/);
  assert.match(explanations.get('name:Two')!.message, /Second is not supplied/);
  assert.doesNotMatch(explanations.get('name:Two')!.message, /First is not supplied/);
  assert.deepEqual(explanations.get('name:Both')!.related.map(location => location.message.split(' ')[0]), ['Second', 'First']);
});
