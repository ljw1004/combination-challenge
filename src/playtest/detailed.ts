import type {Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';
import {availableTokens,label} from '../engine/game.ts';
import {logicalPlacements,logicalReactions,performLogicalPlacement,performLogicalReaction} from '../engine/logical-actions.ts';
import type {LogicalPlacement,LogicalReaction} from '../engine/logical-actions.ts';
import {resolveName} from './commands.ts';
import type {DetailedChoice,NamedObject} from './commands.ts';
import {itemName} from './names.ts';
import {isFixed,presentHotspots} from '../engine/fixed-items.ts';

type Operation = {reaction:LogicalReaction}|{placement:LogicalPlacement};
export function detailedObjects(story:Story,state:State):NamedObject[] {
  return [...availableTokens(state).filter(t => t.chapter === state.chapter&&!isFixed(story,t)).map(t => ({id:t.id,name:itemName(story,state,t.id),kind:'item' as const})),
    ...presentHotspots(story,state,state.chapter).map(id => ({id,name:itemName(story,state,id),kind:'hotspot' as const}))];
}
function operations(story:Story,state:State):Operation[] {
  const reactions = logicalReactions(story,state);
  const placements = logicalPlacements(story,state).filter(p => !reactions.some(r => r.action.hotspot === p.hotspot && [r.action.a,r.action.b].includes(p.item)));
  return [...reactions.map(reaction => ({reaction})),...placements.map(placement => ({placement}))];
}
export function hasDetailedActions(story:Story,state:State):boolean {return operations(story,state).length > 0;}
function involves(operation:Operation,id:string):boolean {
  if ('placement' in operation) return operation.placement.item === id || operation.placement.hotspot === id;
  const a = operation.reaction.action;
  return [a.a,a.b,a.hotspot].includes(id);
}
function partner(operation:Operation,id:string):string[] {
  if ('placement' in operation) return [operation.placement.item === id ? operation.placement.hotspot : operation.placement.item];
  const a = operation.reaction.action;
  if (id === a.hotspot) return [a.a,...(a.b ? [a.b] : [])];
  return a.hotspot ? [a.hotspot] : [a.a === id ? a.b! : a.a];
}
function hints(story:Story,state:State,id:string,available:Operation[]):string {
  const partners = [...new Set(available.filter(o => involves(o,id)).flatMap(o => partner(o,id)))];
  return `Can combine with:\n${partners.length ? partners.map(id => `- ${itemName(story,state,id)}`).join('\n') : '- (none)'}`;
}
export function detailedChoiceKey(story:Story,state:State,choice:DetailedChoice):string {
  const objects = detailedObjects(story,state);
  if ('inspect' in choice) return JSON.stringify(['inspect',resolveName(choice.inspect,objects).id]);
  const first = resolveName(choice.combine,objects).id, second = resolveName(choice.with,objects).id, ids = [first,second];
  // Only compatible pairs are interchangeable: an incompatible attempt inspects
  // its first operand, so reversing it can reveal or perform a different action.
  if (operations(story,state).some(o => involves(o,first) && partner(o,first).includes(second))) ids.sort();
  return JSON.stringify(['combine',...ids]);
}

export function detailedTurn(story:Story,state:State,choice:DetailedChoice):{state:State;text:string} {
  const objects = detailedObjects(story,state), first = resolveName('inspect' in choice ? choice.inspect : choice.combine,objects);
  const second = 'combine' in choice ? resolveName(choice.with,objects) : undefined;
  const available = operations(story,state), matching = available.filter(o => involves(o,first.id));
  let selected:Operation|undefined;
  if (second) {
    const candidates = matching.filter(o => partner(o,first.id).includes(second.id));
    // Direct station operations precede contextual reactions; each group keeps
    // manuscript order. A placement-only goal follows executable reactions.
    selected = candidates.find(o => 'reaction' in o && !o.reaction.action.b) ?? candidates[0];
  }
  const inspecting = !selected, messages:string[] = [];
  if (!selected) {
    if (second) {
      if (!matching.length) return {state,text:'That cannot be combined with anything'};
      messages.push("That can't be combined like that, but here's how it can:");
    }
    messages.push(hints(story,state,first.id,available));
    if (matching.length !== 1) return {state,text:messages.join('\n')};
    selected = matching[0];
    messages.push(`Combined: with ${itemName(story,state,partner(selected,first.id)[0])}.`);
  }
  if ('placement' in selected) {
    const after = performLogicalPlacement(story,state,selected.placement);
    messages.push(...selected.placement.moves.map(m => `Placed: ${itemName(story,state,m.item)} at ${label(story,state,m.hotspot!)}.`));
    return {state:after,text:messages.join('\n')};
  }
  const reaction = selected.reaction, after = performLogicalReaction(story,state,reaction);
  const a = reaction.action, result = itemName(story,after,reaction.recipe.result.id);
  if (a.hotspot && a.b) {
    const other = first.id === a.b || (!inspecting && second?.id === a.b) ? a.a : a.b;
    messages.push(`Combined this together with: ${itemName(story,state,other)}.`);
  }
  const inputs = [a.a,...(a.b ? [a.b] : []),...(a.hotspot ? [a.hotspot] : [])];
  const consumed = inputs.filter(id => state.tokens[id].status === 'available' && after.tokens[id].status === 'consume');
  if (consumed.length) messages.push(`Consumed: ${consumed.map(id => itemName(story,state,id)).join(', ')}.`);
  if (reaction.recipe.installation) messages.push(`Slotted in: ${result}.`);
  else {
    const transformed = inputs.some(id => after.tokens[id].status === 'transform');
    const empty = story.items[reaction.recipe.result.id].slots.filter(s => !after.tokens[reaction.recipe.result.id].slots.includes(s.accepts) && s.name).map(s => s.name);
    messages.push(`${transformed ? 'Transformed into' : 'Created'}: ${result}.${empty.length ? ` Empty slots: ${empty.join(', ')}.` : ''}`);
  }
  return {state:after,text:messages.join('\n')};
}
