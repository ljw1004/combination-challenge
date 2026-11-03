import type {Story,Recipe} from '../story/types.ts';
import type {State,Action} from './types.ts';
import {act,availableTokens,matches,recipeFor,visibleGoals} from './game.ts';
import {activeHotspots} from './analysis.ts';

type Combination = Extract<Action,{type:'combine'}>;
type Move = Extract<Action,{type:'move'}>;
export interface LogicalReaction {recipe:Recipe;action:Combination;preparation?:Move}
export interface LogicalPlacement {item:string;hotspot:string;moves:Move[]}
const move = (state:State,item:string,hotspot?:string):Move => ({type:'move',item,chapter:state.tokens[item].chapter,x:state.tokens[item].x,y:state.tokens[item].y,...(hotspot ? {hotspot} : {})});

/** Text play treats an available station reaction as one operation. The shared
 * engine still validates and records its preparation, reaction and cleanup. */
export function logicalReactions(story:Story,state:State):LogicalReaction[] {
  const hotspots = new Set(activeHotspots(story,state.chapter));
  const present = (id:string) => state.tokens[id]?.status === 'available' && state.tokens[id].chapter === state.chapter;
  const reactions:LogicalReaction[] = [];
  for (const recipe of story.recipes) {
    if (!present(recipe.a.ref.id) || (recipe.b && !present(recipe.b.ref.id)) || (recipe.hotspot && !hotspots.has(recipe.hotspot))) continue;
    if (!matches(state.tokens[recipe.a.ref.id],recipe.a.ref) || (recipe.b && !matches(state.tokens[recipe.b.ref.id],recipe.b.ref))) continue;
    const action:Combination = {type:'combine',a:recipe.a.ref.id,...(recipe.b ? {b:recipe.b.ref.id} : {}),...(recipe.hotspot ? {hotspot:recipe.hotspot,chapter:state.chapter} : {})};
    const preparation = recipe.hotspot && recipe.b ? move(state,recipe.b.ref.id,recipe.hotspot) : undefined;
    const prepared = preparation ? act(story,state,preparation) : state;
    if (recipeFor(story,prepared,action)?.id === recipe.id) reactions.push({recipe,action,...(preparation ? {preparation} : {})});
  }
  return reactions;
}

/** Placement-only goals remain playable without persistent station occupancy.
 * A conjunction is one placement task; its available witnesses move together. */
export function logicalPlacements(story:Story,state:State):LogicalPlacement[] {
  const hotspots = new Set(activeHotspots(story,state.chapter)), placements = new Map<string,LogicalPlacement>();
  for (const goal of visibleGoals(story,state)) {
    const available = goal.conditions.filter(c => matches(state.tokens[c.item.id],c.item) && state.tokens[c.item.id].chapter === state.chapter && (!c.hotspot || hotspots.has(c.hotspot)));
    if (goal.operator === 'and' && available.length !== goal.conditions.length) continue;
    for (const condition of available.filter(c => c.hotspot)) {
      const conditions = goal.operator === 'and' ? available.filter(c => c.hotspot) : [condition];
      const moves = conditions.map(c => move(state,c.item.id,c.hotspot));
      const after = moves.reduce((s,m) => act(story,s,m),state);
      if (after.achieved.includes(goal.id)) placements.set(`${condition.item.id}\0${condition.hotspot}`,{item:condition.item.id,hotspot:condition.hotspot!,moves});
    }
  }
  return [...placements.values()];
}

export function clearLogicalHotspots(story:Story,initial:State):State {
  return availableTokens(initial).filter(t => t.hotspot).reduce((state,token) => act(story,state,move(state,token.id)),initial);
}

export function performLogicalReaction(story:Story,state:State,reaction:LogicalReaction):State {
  const prepared = reaction.preparation ? act(story,state,reaction.preparation) : state;
  return clearLogicalHotspots(story,act(story,prepared,reaction.action));
}

export function performLogicalPlacement(story:Story,state:State,placement:LogicalPlacement):State {
  return clearLogicalHotspots(story,placement.moves.reduce((s,m) => act(story,s,m),state));
}
