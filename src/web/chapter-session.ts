import type { Story, Goal } from '../story/types.ts';
import type { State, Action } from '../engine/types.ts';
import { act, newGame, restore } from '../engine/game.ts';

/** Browser-only arrival snapshot: geometry is not part of the logical replay. */
export interface ChapterSession { entry: State; changed: boolean }
export function captureChapter(state: State): ChapterSession {
  return {entry:structuredClone(state),changed:false};
}
export function chapterEntry(story: Story, current: State): State {
  let entry=newGame(story);
  if(entry.chapter===current.chapter)return entry;
  for(const action of current.actions){entry=act(story,entry,action);if(entry.chapter===current.chapter)return entry;}
  throw new Error('The current chapter has no arrival in this run.');
}
export function restorePresentation(story: Story, raw: State): State {
  const state=restore(story,raw);
  state.seen=[...new Set([...state.seen,...(raw.seen??[])])];
  state.pending=state.pending.filter(n=>!state.seen.includes(n.key));
  for(const token of Object.values(state.tokens)){
    const saved=raw.tokens?.[token.id];
    if(saved&&[saved.x,saved.y].every(Number.isFinite)){token.x=Math.max(0,Math.min(278,saved.x));token.y=Math.max(0,Math.min(800,saved.y));}
  }
  return state;
}
export function restoreChapterSession(story: Story, state: State, raw: unknown): ChapterSession | undefined {
  try {
    const saved=raw as ChapterSession;
    if(!saved?.entry||typeof saved.changed!=='boolean')return;
    const entry=restorePresentation(story,saved.entry),boundary=chapterEntry(story,state);
    if(entry.chapter!==state.chapter||JSON.stringify(entry.actions)!==JSON.stringify(boundary.actions))return;
    return {entry,changed:saved.changed};
  } catch { return; }
}
export function isNoopMove(state: State, action: Action): boolean {
  if(action.type!=='move')return false;
  const token=state.tokens[action.item];
  return !!token&&token.chapter===action.chapter&&token.hotspot===action.hotspot&&token.x===Math.max(0,Math.min(230,action.x))&&token.y===Math.max(0,Math.min(770,action.y));
}
export function noteChapterAction(session: ChapterSession, before: State, action: Action): void {
  if(action.type==='combine'||(action.type==='move'&&!isNoopMove(before,action)))session.changed=true;
}
export function chapterRecovery(session: ChapterSession, state: State): 'chapter'|'story'|undefined {
  return session.changed?'chapter':state.chapter>0?'story':undefined;
}
/** Show one stage per goal chain, retaining finished chains as checked rows. */
export function displayedGoals(story: Story, state: State): {goal:Goal;done:boolean}[] {
  const goals=story.chapters[state.chapter]?.goals??[],rows:{goal:Goal;done:boolean}[]=[];
  for(let start=0;start<goals.length;){
    let end=start;while(goals[end+1]?.next)end++;
    const done=state.achieved.includes(goals[end].id);
    rows.push({goal:done?goals[end]:goals.slice(start,end+1).find(g=>!state.achieved.includes(g.id))!,done});
    start=end+1;
  }
  return rows;
}
