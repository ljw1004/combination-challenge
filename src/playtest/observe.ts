import type { Story } from '../story/types.ts';
import type { State, Action } from '../engine/types.ts';
import { availableTokens, label, legalActions, visibleGoals, chapterComplete, readings } from '../engine/game.ts';
import { placementHints } from '../engine/placement-hints.ts';
import { hotspotDrop } from '../engine/hotspot-drop.ts';
import {isFixed, presentHotspots} from '../engine/fixed-items.ts';

type PartnerAction = Extract<Action, {type:'combine'|'move'}>;

/** Ordinary useful drags: the same combinations, preparations and occupied
 * hotspot priority as browser hover/drop, without a recipe result preview. */
function partnerActions(story:Story,state:State):PartnerAction[] {
  const combinations = legalActions(story,state);
  const surfaces = state.visited.flatMap(chapter=>presentHotspots(story,state,chapter).map(hotspot=>({hotspot,chapter})));
  const partners:PartnerAction[] = [];
  for(const action of combinations){
    if(action.b){partners.push(action);continue;}
    for(const surface of surfaces.filter(s=>s.hotspot===action.hotspot)){
      const drop=hotspotDrop(story,state,action.a,surface.hotspot,surface.chapter,combinations);
      // A direct hotspot drop cannot bypass a contextual occupant.
      if(drop.action && !drop.action.b)partners.push(drop.action);
    }
  }
  for(const hint of placementHints(story,state)){
    for(const surface of surfaces.filter(s=>s.hotspot===hint.hotspot)){
      const drop=hotspotDrop(story,state,hint.item,hint.hotspot,surface.chapter,combinations);
      if(drop.action || drop.ambiguous.length)continue;
      // Logical placement records membership; pixel layout belongs to the browser.
      partners.push({type:'move',item:hint.item,hotspot:hint.hotspot,chapter:surface.chapter,x:0,y:0});
    }
  }
  return partners;
}

/** Player surface only. No recipe results, future goals, author notes or solver. */
export function observe(story:Story,state:State) {
  const name=(id:string)=>label(story,state,id);
  return {
    story:story.title,chapterIndex:state.chapter,completed:state.completed,
    card:state.pending[0]?{kind:state.pending[0].kind,text:state.pending[0].markdown,...(state.pending[0].item?{caption:name(state.pending[0].item)}:{})}:null,
    goals:visibleGoals(story,state).map(g=>({id:g.id,text:g.text})),
    items:availableTokens(state).filter(t=>!isFixed(story,t)).map(t=>({id:t.id,name:name(t.id),chapter:t.chapter,hotspot:t.hotspot,canRead:readings(story,state,t.id).length>0,slots:story.items[t.id].slots.map(s=>({name:t.slots.includes(s.accepts)?name(s.accepts):s.name??'',filled:t.slots.includes(s.accepts)}))})),
    hotspots:state.visited.flatMap(chapter=>presentHotspots(story,state,chapter).map(id=>({id,name:name(id),chapter}))),
    partners:partnerActions(story,state),
    canAdvance:!state.completed&&!state.pending.length&&chapterComplete(story,state),
    interaction:'Partners are compatible reagent drags, as revealed by browser hover: combinations, compound fittings, and useful hotspot placements. A move can prepare a location without creating anything yet. Results remain hidden until you combine. You may also move freely, read an available item, dismiss a card, advance when ready, or stop at any time.',
  };
}
export type PlayerAction=Action|{type:'read';item:string};
export function readItem(story:Story,state:State,id:string){
  if(state.tokens[id]?.status!=='available')throw new Error('That item is not available to read.');
  return {item:label(story,state,id),text:readings(story,state,id).map(w=>w.markdown).join('\n\n')||'No further explanation.'};
}
