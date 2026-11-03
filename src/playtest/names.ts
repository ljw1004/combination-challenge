import type {Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';
import {label} from '../engine/game.ts';

export function itemName(story:Story,state:State,id:string):string {
  const name = label(story,state,id);
  return story.items[id]?.compound ? `${name}[${(state.tokens[id]?.slots ?? []).map(part => label(story,state,part)).join(',')}]` : name;
}
