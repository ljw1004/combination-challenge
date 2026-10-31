import type {Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';
import {legalActions} from '../engine/game.ts';
import {placementHints} from '../engine/placement-hints.ts';

export type HintTarget = {kind:'item'|'hotspot';id:string};

/** A highlighted pair admits a useful drag in at least one direction. */
export function partnerHints(story:Story,state:State,target:HintTarget,direction:'either'|'from'='either') {
  const items=new Set<string>(),hotspots=new Set<string>();
  for(const action of legalActions(story,state)){
    if(action.b){
      if(target.kind==='item' && action.a===target.id)items.add(action.b);
      if(direction==='either' && target.kind==='item' && action.b===target.id)items.add(action.a);
      if(action.hotspot){
        if(target.kind==='item' && action.a===target.id)hotspots.add(action.hotspot);
        if(target.kind==='hotspot' && action.hotspot===target.id)items.add(action.a);
      }
    }else if(action.hotspot){
      if(target.kind==='item' && action.a===target.id)hotspots.add(action.hotspot);
      if(target.kind==='hotspot' && action.hotspot===target.id)items.add(action.a);
    }
  }
  for(const placement of placementHints(story,state)){
    if(target.kind==='item' && placement.item===target.id)hotspots.add(placement.hotspot);
    if(target.kind==='hotspot' && placement.hotspot===target.id)items.add(placement.item);
  }
  return {items,hotspots};
}
