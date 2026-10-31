import type { Chapter, Goal, Hotspot, Item, Ref, Story, Wonder } from '../story/types.ts';
import type { Action, Notice, State, Token } from '../engine/types.ts';
import { nextEncounter } from '../engine/encounters.ts';
import { chapterComplete, matches, replay } from '../engine/game.ts';
import { activeHotspots, chapterNeeds, indexStory } from '../engine/analysis.ts';

export interface LiveStoryUpdate {
  story: Story;
  state: State;
  chapters: Map<number, number>;
  items: Map<string, string>;
  hotspots: Map<string, string>;
  goals: Map<string, string>;
  notices: Map<string, string>;
  chapterRemoved: boolean;
}

/** Partial parser output is still playable; an empty buffer has one empty surface. */
export function recoverPreviewStory(parsed: Story): Story {
  let story = parsed;
  for (const [id, hotspot] of Object.entries(parsed.hotspots)) {
    if ([hotspot.x, hotspot.y].some(value => value !== undefined && (!Number.isFinite(value) || value < 0 || value > 1))) {
      if (story === parsed) story = { ...parsed, hotspots: { ...parsed.hotspots } };
      const coordinate = (value: number | undefined) => value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, Math.min(1, value));
      story.hotspots[id] = { ...hotspot, x: coordinate(hotspot.x), y: coordinate(hotspot.y) };
    }
  }
  if (story.chapters.length) return story;
  const empty: Chapter = {
    id: 'chapter:0', name: 'Unfinished story', intro: '', skipped: '', hotspots: [],
    items: [], goals: [], goalOperator: 'and', source: story.source,
  };
  return { ...story, chapters: [empty] };
}

function pairUnique<A, B>(before: A[], after: B[], keyA: (value: A) => string, keyB: (value: B) => string, pair: (a: A, b: B) => void) {
  const left = new Map<string, A[]>(), right = new Map<string, B[]>();
  for (const value of before) { const key = keyA(value); left.set(key, [...left.get(key) ?? [], value]); }
  for (const value of after) { const key = keyB(value); right.set(key, [...right.get(key) ?? [], value]); }
  for (const [key, values] of left) if (key && values.length === 1 && right.get(key)?.length === 1) pair(values[0], right.get(key)![0]);
}

function refKey(ref: Ref, items?: Map<string, string>) {
  return [items?.get(ref.id) ?? ref.id, [...ref.slots].map(id => items?.get(id) ?? id).sort()];
}
function goalKey(goal: Goal, items?: Map<string, string>, hotspots?: Map<string, string>) {
  return JSON.stringify([goal.operator, goal.conditions.map(c => [refKey(c.item, items), c.hotspot ? hotspots?.get(c.hotspot) ?? c.hotspot : '']).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))]);
}
function chapterKey(chapter: Chapter) {
  return chapter.goals.length || chapter.items.length
    ? JSON.stringify([chapter.goals.map(g => goalKey(g)), chapter.items.map(ref => refKey(ref))]) : '';
}
function matchChapters(before: Story, after: Story): Map<number, number> {
  const result = new Map<number, number>(), used = new Set<number>();
  const remainingOld = () => before.chapters.map((_, index) => index).filter(i => !result.has(i));
  const remainingNew = () => after.chapters.map((_, index) => index).filter(i => !used.has(i));
  const pair = (old: number, next: number) => { result.set(old, next); used.add(next); };
  pairUnique(remainingOld(), remainingNew(), i => before.chapters[i].name, i => after.chapters[i].name, pair);
  pairUnique(remainingOld(), remainingNew(), i => chapterKey(before.chapters[i]), i => chapterKey(after.chapters[i]), pair);
  // Equal-size gaps between surviving neighbours are heading edits. Unequal gaps
  // are insertions/deletions, so never match solely by the parser's ordinal IDs.
  const anchors = [[-1, -1], ...[...result].sort((a, b) => a[0] - b[0]), [before.chapters.length, after.chapters.length]];
  for (let i = 1; i < anchors.length; i++) {
    const [oldStart, newStart] = anchors[i - 1], [oldEnd, newEnd] = anchors[i];
    if (newStart >= newEnd) continue;
    const left = remainingOld().filter(n => n > oldStart && n < oldEnd);
    const right = remainingNew().filter(n => n > newStart && n < newEnd);
    if (left.length === right.length) left.forEach((n, j) => pair(n, right[j]));
  }
  return result;
}
function matchEntities<T extends Item | Hotspot>(before: Story, after: Story, old: Record<string, T>, next: Record<string, T>, chapters: Map<number, number>, kind: 'item' | 'hotspot'): Map<string, string> {
  const result = new Map<string, string>(), used = new Set<string>();
  for (const id of Object.keys(old)) if (next[id]) { result.set(id, id); used.add(id); }
  // Infer label edits only from Items/Hotspots declarations. Changing a goal's
  // sole reference from A to B is a changed requirement, not a rename of A.
  for (const [oldChapter, newChapter] of chapters) {
    const declarations = (chapter: Chapter) => kind === 'item' ? chapter.items.map(ref => ref.id) : chapter.hotspots;
    const left = [...new Set(declarations(before.chapters[oldChapter]))].filter(id => id.startsWith('name:') && old[id] && !result.has(id));
    const right = [...new Set(declarations(after.chapters[newChapter]))].filter(id => id.startsWith('name:') && next[id] && !used.has(id));
    if (left.length !== right.length) continue;
    left.forEach((id, i) => { result.set(id, right[i]); used.add(right[i]); });
  }
  return result;
}
function matchGoals(before: Story, after: Story, chapters: Map<number, number>, items: Map<string, string>, hotspots: Map<string, string>): Map<string, string> {
  const result = new Map<string, string>(), used = new Set<string>();
  for (const [oldChapter, newChapter] of chapters) {
    const old = before.chapters[oldChapter].goals, next = after.chapters[newChapter].goals;
    const left = () => old.filter(g => !result.has(g.id)), right = () => next.filter(g => !used.has(g.id));
    const pair = (a: Goal, b: Goal) => { result.set(a.id, b.id); used.add(b.id); };
    pairUnique(left(), right(), g => goalKey(g, items, hotspots), g => goalKey(g), pair);
    pairUnique(left(), right(), g => g.text, g => g.text, pair);
    const a = left(), b = right();
    if (a.length === b.length) a.forEach((goal, i) => pair(goal, b[i]));
  }
  return result;
}
function wonderKey(id: string, wonder: Wonder) { return `wonder:${id}:${wonder.source.line}`; }
function matchNotices(before: Story, after: Story, chapters: Map<number, number>, items: Map<string, string>): Map<string, string> {
  const result = new Map<string, string>();
  for (const [old, next] of chapters) result.set(`chapter:${old}`, `chapter:${next}`);
  for (const [oldId, nextId] of items) {
    const old = before.items[oldId].wonders, next = after.items[nextId].wonders, used = new Set<Wonder>();
    for (const [i, wonder] of old.entries()) {
      const required = JSON.stringify(wonder.requires.map(id => items.get(id) ?? id).sort());
      const candidates = next.filter(w => !used.has(w) && JSON.stringify([...w.requires].sort()) === required);
      const candidate = candidates.find(w => w.markdown === wonder.markdown) ?? (candidates.includes(next[i]) ? next[i] : candidates[0]);
      if (candidate) { used.add(candidate); result.set(wonderKey(oldId, wonder), wonderKey(nextId, candidate)); }
    }
  }
  return result;
}
function chapterText(story: Story, state: State, chapter: number): string {
  const position = state.visited.indexOf(chapter), previous = position > 0 ? state.visited[position - 1] : -1;
  const bridges = story.chapters.slice(previous + 1, chapter).filter((c, i) => !state.visited.includes(previous + i + 1) && c.goals.length && chapterComplete(story, state, previous + i + 1)).map(c => c.skipped);
  return [...bridges, story.chapters[chapter].intro].filter(Boolean).join('\n\n');
}
function newPosition(state: State): { x: number; y: number } {
  const current = Object.values(state.tokens).filter(t => t.chapter === state.chapter && t.status === 'available');
  for (let y = 82; y <= 720; y += 76) for (const x of [14, 139, 264]) {
    if (current.every(t => Math.abs(t.x - x) >= 120 || Math.abs(t.y - y) >= 70)) return { x, y };
  }
  return { x: 14, y: 720 };
}

/** Project a game-interaction anchor into the latest partial text, never into an
 * intermediate keystroke's state. Restoring deleted text then restores identity. */
export function reconcileLiveStory(previous: Story, next: Story, current: State): LiveStoryUpdate {
  previous = recoverPreviewStory(previous);
  next = recoverPreviewStory(next);
  current = structuredClone(current);
  backfillEncounters(previous, current);
  const chapters = matchChapters(previous, next);
  const items = matchEntities(previous, next, previous.items, next.items, chapters, 'item');
  const hotspots = matchEntities(previous, next, previous.hotspots, next.hotspots, chapters, 'hotspot');
  const goals = matchGoals(previous, next, chapters, items, hotspots);
  const notices = matchNotices(previous, next, chapters, items);
  const chapterRemoved = !chapters.has(current.chapter);
  const following = [...chapters].filter(([old]) => old > current.chapter).sort((a, b) => a[0] - b[0])[0];
  const preceding = [...chapters].filter(([old]) => old < current.chapter).sort((a, b) => b[0] - a[0])[0];
  const chapter = chapters.get(current.chapter) ?? following?.[1] ?? preceding?.[1] ?? Math.min(current.chapter, next.chapters.length - 1);
  const state: State = {
    ...structuredClone(current), storyId: next.id, chapter, tokens: {}, achieved: [], excluded: [], actions: [],
    visited: [...new Set([...current.visited.flatMap(i => chapters.has(i) ? [chapters.get(i)!] : []), chapter])],
    newItems: current.newItems.flatMap(id => items.has(id) ? [items.get(id)!] : []),
    seen: current.seen.flatMap(key => notices.has(key) ? [notices.get(key)!] : []), pending: [], completed: false,
  };
  for (const token of Object.values(current.tokens)) {
    const id = items.get(token.id); if (!id) continue;
    const item = next.items[id], tokenChapter = chapters.get(token.chapter) ?? chapter;
    const hotspot = token.hotspot ? hotspots.get(token.hotspot) : undefined;
    state.tokens[id] = {
      ...token, id, chapter: tokenChapter,
      firstSeen: { chapter: token.firstSeen!.chapter === null ? null : chapters.get(token.firstSeen!.chapter) ?? null, order: token.firstSeen!.order },
      slots: token.slots.flatMap(slot => items.has(slot) ? [items.get(slot)!] : []).filter(slot => item.slots.some(s => s.accepts === slot)),
      ...(hotspot && activeHotspots(next, tokenChapter).includes(hotspot) ? { hotspot } : {}),
    };
    if (!hotspot || !activeHotspots(next, tokenChapter).includes(hotspot)) delete state.tokens[id].hotspot;
  }
  const exclusions = new Set<string>();
  for (const old of current.excluded) {
    const id = items.get(old), partner = id ? next.items[id].exclusiveWith : undefined;
    if (id && partner && state.tokens[partner]) exclusions.add(id);
  }
  for (const token of Object.values(state.tokens)) {
    const partner = next.items[token.id].exclusiveWith;
    if (partner && !exclusions.has(token.id)) exclusions.add(partner);
  }
  state.excluded = [...exclusions];
  const oldGoals = new Map(previous.chapters.flatMap(c => c.goals).map(g => [g.id, g]));
  const newGoals = new Map(next.chapters.flatMap(c => c.goals).map(g => [g.id, g]));
  for (const id of current.achieved) {
    const target = goals.get(id), old = oldGoals.get(id), goal = target ? newGoals.get(target) : undefined;
    if (old && goal && goalKey(old, items, hotspots) === goalKey(goal)) state.achieved.push(goal.id);
  }
  const primitives = indexStory(next).primitives;
  for (const id of chapterNeeds(next, state, chapter)) if (primitives.has(id) && !state.tokens[id] && !state.excluded.includes(id)) {
    state.tokens[id] = { id, chapter, firstSeen: nextEncounter(state), slots: [], status: 'available', ...newPosition(state) };
    state.newItems.push(id);
    const partner = next.items[id].exclusiveWith;
    if (partner && !state.excluded.includes(partner)) state.excluded.push(partner);
  }
  for (const goal of newGoals.values()) {
    const conditionMet = (c: Goal['conditions'][number]) => matches(state.tokens[c.item.id], c.item) && (!c.hotspot || state.tokens[c.item.id].hotspot === c.hotspot);
    if (!state.achieved.includes(goal.id) && goal.conditions.length && (goal.operator === 'and' ? goal.conditions.every(conditionMet) : goal.conditions.some(conditionMet))) state.achieved.push(goal.id);
  }
  for (const notice of current.pending) {
    const key = notices.get(notice.key); if (!key) continue;
    if (notice.kind === 'chapter') {
      const index = Number(key.slice('chapter:'.length)), markdown = chapterText(next, state, index);
      if (markdown) state.pending.push({ key, kind: 'chapter', markdown });
    } else {
      const id = notice.item ? items.get(notice.item) : undefined;
      const wonder = id ? next.items[id].wonders.find(w => wonderKey(id, w) === key && w.requires.every(slot => state.tokens[id]?.slots.includes(slot))) : undefined;
      if (id && wonder) state.pending.push({ key, kind: 'wonder', item: id, markdown: wonder.markdown });
    }
  }
  if (chapterRemoved && current.pending.some(n => n.kind === 'chapter') && !state.pending.some(n => n.kind === 'chapter')) {
    const markdown = chapterText(next, state, chapter);
    if (markdown) state.pending.unshift({ key: `chapter:${chapter}`, kind: 'chapter', markdown });
  }
  state.newItems = [...new Set(state.newItems)].filter(id => state.tokens[id]?.status === 'available');
  state.arrivalDivider = current.arrivalDivider && state.newItems.length > 0;
  state.completed = chapter === next.chapters.length - 1 && (!next.chapters[chapter].goals.length || current.completed && chapterComplete(next, state));
  return { story: next, state, chapters, items, hotspots, goals, notices, chapterRemoved };
}

/** Edited sessions start from a snapshot: old recipes cannot replay that history.
 * Validate this browser-local state without inventing a new route or moving cards. */
export function restoreLiveState(story: Story, raw: unknown): State | undefined {
  try {
    story = recoverPreviewStory(story);
    if (!raw || typeof raw !== 'object') return;
    const state = structuredClone(raw) as State, strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(v => typeof v === 'string');
    const chapter = (value: unknown): value is number => Number.isInteger(value) && typeof value === 'number' && value >= 0 && value < story.chapters.length;
    if (state.version !== 1 || state.storyId !== story.id || !chapter(state.chapter) || !state.tokens || typeof state.tokens !== 'object' || Array.isArray(state.tokens)) return;
    if (!strings(state.achieved) || !strings(state.excluded) || !strings(state.newItems) || !strings(state.seen) || !Array.isArray(state.visited) || !state.visited.every(chapter) || !state.visited.includes(state.chapter)) return;
    if (typeof state.completed !== 'boolean' || typeof state.arrivalDivider !== 'boolean' || !Array.isArray(state.pending) || !Array.isArray(state.actions)) return;
    const goalIds = new Set(story.chapters.flatMap(c => c.goals.map(g => g.id)));
    if (state.achieved.some(id => !goalIds.has(id)) || state.excluded.some(id => !story.items[id])) return;
    const encounterOrders = new Set<number>();
    for (const [id, token] of Object.entries(state.tokens)) {
      if (!token || !story.items[id] || token.id !== id || !chapter(token.chapter) || !state.visited.includes(token.chapter) || ![token.x, token.y].every(Number.isFinite) || !['available', 'consume', 'transform', 'installed'].includes(token.status) || !strings(token.slots)) return;
      if (token.firstSeen !== undefined) {
        const seen = token.firstSeen;
        if (!seen || typeof seen !== 'object' || (seen.chapter !== null && !chapter(seen.chapter)) || !Number.isSafeInteger(seen.order) || seen.order < 0 || encounterOrders.has(seen.order)) return;
        encounterOrders.add(seen.order);
      }
      if (token.slots.some(slot => !story.items[id].slots.some(s => s.accepts === slot)) || token.hotspot !== undefined && (typeof token.hotspot !== 'string' || !activeHotspots(story, token.chapter).includes(token.hotspot))) return;
    }
    if (state.newItems.some(id => !state.tokens[id])) return;
    if (!state.pending.every((notice: Notice) => notice && typeof notice.key === 'string' && typeof notice.markdown === 'string' && ['chapter', 'wonder'].includes(notice.kind) && (notice.item === undefined || !!story.items[notice.item]))) return;
    if (!state.actions.every((action: Action) => {
      if (!action || typeof action !== 'object') return false;
      if (action.type === 'dismiss' || action.type === 'advance') return true;
      if (action.type === 'move') return typeof action.item === 'string' && !!story.items[action.item] && chapter(action.chapter) && [action.x, action.y].every(Number.isFinite) && (action.hotspot === undefined || !!story.hotspots[action.hotspot]);
      return action.type === 'combine' && typeof action.a === 'string' && !!story.items[action.a] && (action.b === undefined || !!story.items[action.b]) && (action.hotspot === undefined || !!story.hotspots[action.hotspot]) && (action.chapter === undefined || chapter(action.chapter));
    })) return;
    backfillEncounters(story, state);
    return state;
  } catch { return; }
}

/** Old ordinary saves have replayable action histories; old edited snapshots may
 * not. Never pretend their current placement is a historical encounter chapter. */
function backfillEncounters(story: Story, state: State): void {
  const missing = Object.values(state.tokens).filter(token => !token.firstSeen);
  if (!missing.length) return;
  let reconstructed: State | undefined;
  try {
    const candidate = replay(story, state.actions);
    const logical = (value: State) => JSON.stringify({
      chapter: value.chapter, visited: value.visited, achieved: [...value.achieved].sort(), excluded: [...value.excluded].sort(),
      tokens: Object.values(value.tokens).map(t => [t.id, t.chapter, t.status, [...t.slots].sort()]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
    });
    if (logical(candidate) === logical(state)) reconstructed = candidate;
  } catch { /* Edited recipes cannot necessarily replay the original history. */ }
  const used = new Set(Object.values(state.tokens).flatMap(token => token.firstSeen ? [token.firstSeen.order] : []));
  for (const token of missing) {
    const known = reconstructed?.tokens[token.id]?.firstSeen;
    token.firstSeen = known && !used.has(known.order) ? { ...known } : { ...nextEncounter(state), chapter: null };
    used.add(token.firstSeen.order);
  }
}
