import type { Story, Recipe, Ref, Goal, Condition } from '../story/types.ts';
import type { State, Token, Action } from './types.ts';
import { activeHotspots, goalChains, chapterGoalsSatisfied, chapterNeeds, continuationPossible, indexStory, recipeCandidates } from './analysis.ts';
import { nextEncounter } from './encounters.ts';
export type { State, Token, Action } from './types.ts';

export function label(story: Story, state: State, id: string): string {
  const item = story.items[id]; if (!item) return story.hotspots[id]?.name ?? id;
  let name = item.name;
  for (const rename of item.renames) { const index = story.chapters.findIndex(c => c.name === rename.chapter || c.id === rename.chapter); if (index >= 0 && state.chapter >= index) name = rename.name; }
  return name;
}
export function matches(token: Token | undefined, ref: Ref): boolean { return !!token && token.status === 'available' && ref.slots.every(s => token.slots.includes(s)); }
function conditionMet(state: State, c: Condition): boolean { return matches(state.tokens[c.item.id], c.item) && (!c.hotspot || state.tokens[c.item.id].hotspot === c.hotspot); }
function latch(story: Story, state: State) {
  for (const chapter of story.chapters) for (const goal of chapter.goals) if (!state.achieved.includes(goal.id) && goal.conditions.length && (goal.operator === 'and' ? goal.conditions.every(c => conditionMet(state,c)) : goal.conditions.some(c => conditionMet(state,c)))) state.achieved.push(goal.id);
}
export function chapterComplete(story: Story, state: State, chapter = state.chapter): boolean {
  const c = story.chapters[chapter]; if (!c) return true;
  return chapterGoalsSatisfied(c, g => state.achieved.includes(g.id));
}
export function visibleGoals(story: Story, state: State): Goal[] {
  const goals = story.chapters[state.chapter]?.goals ?? [], visible: Goal[] = [];
  for (const chain of goalChains(goals)) {
    const first = chain.find(g => !state.achieved.includes(g.id)); if (first) visible.push(first);
  }
  return visible;
}
function createToken(id: string, chapter: number, index: number): Token { return { id, chapter, slots: [], status: 'available', x: 18 + (index % 2) * 183, y: 120 + Math.floor(index / 2) * 65 }; }
function enter(story: Story, state: State, start: number) {
  const bridges: string[] = [];
  for (let i = start; i < story.chapters.length; i++) {
    state.chapter = i; const c = story.chapters[i];
    if (c.goals.length && chapterComplete(story, state, i)) { if (c.skipped) bridges.push(c.skipped); continue; }
    const needed = chapterNeeds(story, state, i), inherited = !c.image && i > 0;
    if (inherited) for (const token of availableTokens(state)) if (token.chapter===i-1&&token.hotspot&&activeHotspots(story,i).includes(token.hotspot)) needed.add(token.id);
    const old = Object.values(state.tokens).filter(t => t.status === 'available' && needed.has(t.id));
    state.newItems = []; state.visited.push(i);
    old.forEach(token => {
      token.chapter = i;
      if (!inherited || !activeHotspots(story, i).includes(token.hotspot ?? '')) delete token.hotspot;
      // The browser translates the carried arrangement using measured card sizes.
    });
    const primitives = indexStory(story).primitives;
    for (const id of needed) if (!state.tokens[id] && primitives.has(id) && !state.excluded.includes(id)) {
      state.tokens[id] = { ...createToken(id, i, old.length + state.newItems.length), firstSeen: nextEncounter(state) }; state.newItems.push(id);
      const other = story.items[id].exclusiveWith; if (other && !state.excluded.includes(other)) state.excluded.push(other);
    }
    state.arrivalDivider=old.length>0&&state.newItems.length>0;
    const text = [...bridges, c.intro].filter(Boolean).join('\n\n');
    if (text) state.pending.push({ key: `chapter:${i}`, kind: 'chapter', markdown: text });
    latch(story,state);
    if (i === story.chapters.length - 1 && !c.goals.length) state.completed = true;
    return;
  }
  state.completed = true;
}
export function newGame(story: Story): State {
  const state: State = { version: 1, storyId: story.id, chapter: 0, tokens: {}, achieved: [], excluded: [], visited: [], newItems: [], arrivalDivider: false, seen: [], pending: [], completed: false, actions: [] };
  enter(story,state,0); return state;
}
export function availableTokens(state: State): Token[] { return Object.values(state.tokens).filter(t => t.status === 'available'); }
export function recipeFor(story: Story, state: State, action: Extract<Action,{type:'combine'}>): Recipe | undefined {
  if (action.a === action.b || state.completed) return;
  if (action.hotspot && !state.visited.some(i => activeHotspots(story,i).includes(action.hotspot!))) return;
  if (action.chapter!==undefined && (!state.visited.includes(action.chapter) || !action.hotspot || !activeHotspots(story,action.chapter).includes(action.hotspot))) return;
  const a = state.tokens[action.a], b = action.b ? state.tokens[action.b] : undefined;
  if (!a || a.status !== 'available' || (action.b && (!b || b.status !== 'available'))) return;
  for (const r of recipeCandidates(story, action.a, action.b, action.hotspot)) {
    if (!!r.b !== !!b || state.excluded.includes(r.result.id)) continue;
    const forward = r.a.ref.id === a.id && matches(a,r.a.ref) && (!r.b || (r.b.ref.id === b?.id && matches(b,r.b.ref)));
    const reverse = !!r.b && r.a.ref.id === b?.id && matches(b,r.a.ref) && r.b.ref.id === a.id && matches(a,r.b.ref);
    if (!forward && !reverse) continue;
    if (r.hotspot !== action.hotspot) continue;
    if (r.hotspot && b && b.hotspot !== r.hotspot) continue;
    if (r.installation) {
      const owner = state.tokens[r.result.id]; if (owner?.slots.includes(r.installation)) continue;
    } else if (state.tokens[r.result.id] || Object.values(state.tokens).some(t => t.slots.includes(r.result.id))) continue;
    const excluded=story.items[r.result.id]?.exclusiveWith;
    if(excluded){const candidate={...state,tokens:{...state.tokens,[r.result.id]:{...a,id:r.result.id,slots:r.result.slots}},excluded:[...state.excluded,excluded],achieved:[...state.achieved]};latch(story,candidate);if(!continuationPossible(story,candidate))continue;}
    return r;
  }
}
export function legalActions(story: Story, state: State): Extract<Action,{type:'combine'}>[] {
  const actions: Extract<Action,{type:'combine'}>[] = [];
  for (const r of story.recipes) {
    const candidates: Extract<Action,{type:'combine'}>[] = [{ type:'combine', a:r.a.ref.id, ...(r.b ? { b:r.b.ref.id } : {}), ...(r.hotspot ? { hotspot:r.hotspot } : {}) }];
    if (r.b) candidates.push({ type:'combine', a:r.b.ref.id, b:r.a.ref.id, ...(r.hotspot ? { hotspot:r.hotspot } : {}) });
    for (const action of candidates) if (recipeFor(story,state,action)?.id === r.id) actions.push(action);
  }
  return actions;
}
export function readings(story: Story, state: State, id: string) { const token = state.tokens[id]; return (story.items[id]?.wonders ?? []).filter(w => w.requires.every(s => token?.slots.includes(s))); }
function queueWonders(story: Story, state: State, id: string) {
  for (const w of readings(story,state,id)) {
    const key = `wonder:${id}:${w.source.line}`;
    if (!state.seen.includes(key) && !state.pending.some(n => n.key === key)) state.pending.push({ key, kind:'wonder', item:id, markdown:w.markdown });
  }
}
/** Abstract clients can allow additional retirement possibilities without
 * changing recipe matching, exclusions, goal latching or the player policy. */
export type RetirementCheck = (state: State, removed: Set<string>) => boolean;
export function act(story: Story, original: State, action: Action, retirementCheck?: RetirementCheck): State {
  const state = structuredClone(original);
  if (action.type === 'dismiss') { const notice = state.pending.shift(); if (notice && !state.seen.includes(notice.key)) state.seen.push(notice.key); }
  else if (action.type === 'advance') {
    if (!chapterComplete(story,state)) throw new Error('There are unfinished goals.');
    if (state.pending.length) throw new Error('Close the current story or discovery card first.');
    if (!state.completed) enter(story,state,state.chapter+1);
  } else if (action.type === 'move') {
    const token = state.tokens[action.item]; if (!token || token.status !== 'available') throw new Error('That item is not available.');
    if (!state.visited.includes(action.chapter)) throw new Error('That chapter has not been visited.');
    if (![action.x,action.y].every(Number.isFinite)) throw new Error('Position must be finite.');
    if (action.hotspot && !activeHotspots(story,action.chapter).includes(action.hotspot)) throw new Error('That hotspot is not in this chapter.');
    token.chapter = action.chapter; token.x = Math.max(0,Math.min(230,action.x)); token.y = Math.max(0,Math.min(770,action.y));
    if (action.hotspot) token.hotspot = action.hotspot; else delete token.hotspot;
    if (state.newItems.includes(token.id)) { state.newItems = state.newItems.filter(id => id !== token.id); state.arrivalDivider=false; }
    latch(story,state);
  } else {
    const recipe = recipeFor(story,state,action); if (!recipe) throw new Error('These things do not make a new result here.');
    if (action.b && state.newItems.includes(action.a)!==state.newItems.includes(action.b)) state.arrivalDivider=false;
    const receiver = state.tokens[action.b ?? action.a];
    if (recipe.installation) state.tokens[recipe.result.id].slots.push(recipe.installation);
    else {
      const destination=action.hotspot&&!action.b?(action.chapter??[...state.visited].reverse().find(i=>activeHotspots(story,i).includes(action.hotspot!))!):receiver.chapter;
      const hotspot=action.hotspot&&!action.b?story.hotspots[action.hotspot]:undefined,index=hotspot?activeHotspots(story,destination).indexOf(hotspot.id):0;
      state.tokens[recipe.result.id] = { id:recipe.result.id, firstSeen:nextEncounter(state), status:'available', slots:[...recipe.result.slots], chapter:destination, x:hotspot?(hotspot.x??(.19+(index%3)*.31))*390-56:Math.min(225,receiver.x+12), y:hotspot?(hotspot.y??(.70+Math.floor(index/3)*.13))*844-22:Math.min(730,receiver.y+42), ...(hotspot ? { hotspot:hotspot.id } : {}) };
    }
    const excluded = story.items[recipe.result.id]?.exclusiveWith;
    if (excluded && !state.excluded.includes(excluded)) state.excluded.push(excluded);
    latch(story,state);
    if (excluded && !continuationPossible(story,state)) throw new Error('This exclusive choice would remove every continuation through the remaining story.');
    const expendable = [recipe.a, ...(recipe.b ? [recipe.b] : [])].filter(i => i.fate !== 'preserve' && i.ref.id !== recipe.result.id);
    // Try hiding both inputs first, then each individually. These infinite resources are never depleted.
    const choices = [expendable, ...expendable.map(i => [i]), []];
    const retiring = choices.find(inputs => (retirementCheck ?? ((s, removed) => continuationPossible(story,s,removed)))(state,new Set(inputs.map(i => i.ref.id))));
    if (!retiring) throw new Error('This action would remove every continuation through the remaining story.');
    for (const input of retiring) {
      const token = state.tokens[input.ref.id]; token.status = recipe.installation ? 'installed' : input.fate as 'consume' | 'transform';
      if (input.fate === 'transform' && !recipe.installation && !recipe.hotspot) { const result = state.tokens[recipe.result.id]; result.x = token.x; result.y = token.y; result.chapter = token.chapter; if (token.hotspot) result.hotspot = token.hotspot; }
    }
    state.newItems = state.newItems.filter(id => ![action.a,action.b].includes(id));
    queueWonders(story,state,recipe.result.id); latch(story,state);
  }
  state.actions.push(action); return state;
}
export function replay(story: Story, actions: Action[]): State { return actions.reduce((state,action) => act(story,state,action),newGame(story)); }
export function restore(story: Story, raw: unknown): State {
  const data = raw as Partial<State>; if (data?.version !== 1 || data.storyId !== story.id || !Array.isArray(data.actions)) throw new Error('This save does not belong to the current Markdown story.');
  return replay(story,data.actions);
}
