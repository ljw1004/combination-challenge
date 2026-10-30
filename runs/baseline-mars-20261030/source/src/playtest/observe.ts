import type { Story } from '../story/types.ts';
import type { State, Action } from '../engine/types.ts';
import { availableTokens, label, legalActions, visibleGoals, chapterComplete, readings } from '../engine/game.ts';
import { activeHotspots } from '../engine/analysis.ts';

/** Player surface only. No recipe results, future goals, author notes or solver. */
export function observe(story:Story,state:State) {
  const name=(id:string)=>label(story,state,id);
  return {
    story:story.title,chapterIndex:state.chapter,completed:state.completed,
    card:state.pending[0]?{kind:state.pending[0].kind,text:state.pending[0].markdown,...(state.pending[0].item?{caption:name(state.pending[0].item)}:{})}:null,
    goals:visibleGoals(story,state).map(g=>({id:g.id,text:g.text})),
    items:availableTokens(state).map(t=>({id:t.id,name:name(t.id),chapter:t.chapter,hotspot:t.hotspot,canRead:readings(story,state,t.id).length>0,slots:story.items[t.id].slots.map(s=>({name:t.slots.includes(s.accepts)?name(s.accepts):s.name??'',filled:t.slots.includes(s.accepts)}))})),
    hotspots:state.visited.flatMap(chapter=>activeHotspots(story,chapter).map(id=>({id,name:name(id),chapter}))),
    partners:legalActions(story,state),
    canAdvance:!state.completed&&!state.pending.length&&chapterComplete(story,state),
    interaction:'Choose a partner action, move an item to a visited hotspot or chapter, read an available item, dismiss a card, or advance when ready. You may stop at any time. No result preview is available.',
  };
}
export type PlayerAction=Action|{type:'read';item:string};
export function readItem(story:Story,state:State,id:string){
  if(state.tokens[id]?.status!=='available')throw new Error('That item is not available to read.');
  return {item:label(story,state,id),text:readings(story,state,id).map(w=>w.markdown).join('\n\n')||'No further explanation.'};
}
