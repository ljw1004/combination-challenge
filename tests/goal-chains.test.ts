import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStory } from '../src/story/parser.ts';
import { act, chapterComplete, newGame, replay, visibleGoals } from '../src/engine/game.ts';
import { continuationPossible } from '../src/engine/analysis.ts';
import { displayedGoals } from '../src/web/chapter-session.ts';
import { reconcileLiveStory } from '../src/web/live-story.ts';
import { observe } from '../src/playtest/observe.ts';
import { checkpoint } from '../src/debug/checkpoint.ts';
import type { Story } from '../src/story/types.ts';
import type { State } from '../src/engine/types.ts';

const parse = (text: string) => parseStory(`# Test\n\n## Start\n\n![room](room.webp)\n\n${text}`, { id: 'chains' });
const move = (s: Story, state: State, item: string, hotspot: string) => act(s, state, { type: 'move', item: `name:${item}`, chapter: state.chapter, x: 50, y: 500, hotspot: `name:${hotspot}` });
const combine = (s: Story, state: State, a: string, b: string) => act(s, state, { type: 'combine', a: `name:${a}`, b: `name:${b}` });
const dismiss = (s: Story, initial: State) => { let state = initial; while (state.pending.length) state = act(s, state, { type: 'dismiss' }); return state; };

test('early final achievement neither hides its predecessor nor completes a next chain', () => {
  const s = parse('**Goals**\n- First -- A @ Bench\n- next: Last -- B @ Shelf\n**Hotspots**\n- Bench\n- Shelf\n\n## End\n\nDone.');
  let state = move(s, newGame(s), 'B', 'Shelf');
  assert(state.achieved.includes(s.chapters[0].goals[1].id), 'later achievements still latch independently');
  assert.equal(chapterComplete(s, state), false);
  assert.deepEqual(visibleGoals(s, state).map(g => g.text), ['First']);
  assert.deepEqual(displayedGoals(s, state).map(r => [r.goal.text, r.done]), [['First', false]]);
  assert.equal(observe(s, state).canAdvance, false);
  assert.throws(() => act(s, state, { type: 'advance' }), /unfinished goals/);
  const projected = reconcileLiveStory(s, s, state).state;
  assert.equal(chapterComplete(s, projected), false);
  assert.deepEqual(visibleGoals(s, projected).map(g => g.text), ['First']);
  state = move(s, state, 'A', 'Bench');
  assert.equal(chapterComplete(s, state), true);
  assert.deepEqual(displayedGoals(s, state).map(r => [r.goal.text, r.done]), [['Last', true]]);
  state = act(s, state, { type: 'advance' });
  assert(state.completed);
  assert.deepEqual(replay(s, state.actions), state);
});

test('future chains retain unfinished predecessor reagents and are skipped only after every stage latches', () => {
  const s = parse('**Goals**\n- Prepare -- Flour\n**Items**\n- Pot\n**Combinations**\n- Grain [transform] + Stone [preserve] -> Flour\n- Grain [transform] + Pot [preserve] -> Porridge\n\n## Dinner\n\n![room](room.webp)\n\n**Goals**\n- Cook -- Porridge\n- next: Ready -- Flour\n\n## End\n\nDone.');
  let state = combine(s, newGame(s), 'Grain', 'Stone');
  assert(state.achieved.includes(s.chapters[1].goals[1].id));
  assert.equal(state.tokens['name:Grain'].status, 'available', 'future predecessor prevents hiding Grain');
  assert.equal(continuationPossible(s, state, new Set(['name:Grain'])), false);
  const entered = act(s, dismiss(s, state), { type: 'advance' });
  assert.equal(entered.chapter, 1, 'an early final achievement cannot skip Dinner');
  assert.deepEqual(visibleGoals(s, entered).map(g => g.text), ['Cook']);
  assert(checkpoint(s, s.chapters.length, entered).completed);
  state = combine(s, state, 'Grain', 'Pot');
  state = act(s, dismiss(s, state), { type: 'advance' });
  assert.equal(state.chapter, 2, 'fully achieved chains may still skip a chapter');
  assert.deepEqual(state.visited, [0, 2]);
  assert.deepEqual(replay(s, state.actions), state);
});

test('OR chooses between complete chains, not between the stages inside a chain', () => {
  const s = parse('**Goals**\n- either: Left first -- A @ Bench\n- next: Left last -- B @ Bench\n- or: Right first -- C @ Bench\n- next: Right last -- D @ Bench\n**Hotspots**\n- Bench');
  assert.equal(s.chapters[0].goalOperator, 'or');
  let state = move(s, newGame(s), 'B', 'Bench');
  state = move(s, state, 'D', 'Bench');
  assert.equal(chapterComplete(s, state), false);
  assert.deepEqual(visibleGoals(s, state).map(g => g.text), ['Left first', 'Right first']);
  state = move(s, state, 'C', 'Bench');
  assert.equal(chapterComplete(s, state), true);
  assert(!state.achieved.includes(s.chapters[0].goals[0].id), 'the other chain is optional');
  assert.equal(continuationPossible(s, state, new Set(['name:A'])), true);
  assert.deepEqual(replay(s, state.actions), state);
});
