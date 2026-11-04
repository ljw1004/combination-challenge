import type { Story } from '../story/types.ts';
import type { Action, State } from '../engine/types.ts';
import { act, availableTokens, chapterComplete, label, newGame, recipeFor, visibleGoals } from '../engine/game.ts';
import { checkpoint } from '../debug/checkpoint.ts';
import { observe } from './observe.ts';
import {clearLogicalHotspots} from '../engine/logical-actions.ts';
import {detailedTurn,hasDetailedActions} from './detailed.ts';
import {detailedCommand,isLook} from './commands.ts';
import type {PlayStyle,PlayerChoice} from './commands.ts';
import {itemName} from './names.ts';
export {itemName} from './names.ts';

export interface Message { kind: 'story'|'chapter'|'goals'|'board'|'result'|'wonder'|'goal-changes'|'chapter-completed'|'ending'; text: string }
export type MenuChoice = number | 'L';
export interface Frame {
  playStyle: PlayStyle; lookAvailable:boolean; step: number; phase: 'choose'|'complete'|'blocked'; prompt: string | null;
  messages: Message[]; options: { choice: MenuChoice; text: string; kind: 'action'|'look' }[];
}
export interface Adventure { playStyle:PlayStyle; mode: 'story'|'chapter'; state: State; frame: Frame }
type Choice = Extract<Action, {type:'combine'|'move'}>;
function chapterTitle(story:Story,index:number):string {return `## Chapter ${index+1}. ${story.chapters[index].name}`;}
function chapterSurface(story:Story,state:State) {
  const observation=observe(story,state);
  const items=observation.items.filter(item => item.chapter === state.chapter);
  const hotspots=observation.hotspots.filter(hotspot => hotspot.chapter === state.chapter);
  const present=new Set(items.map(item => item.id)), surfaces=new Set(hotspots.map(hotspot => hotspot.id));
  const partners=observation.partners.filter(action => action.type === 'move'
    ? present.has(action.item) && action.chapter === state.chapter
    : present.has(action.a) && (!action.b || present.has(action.b) || surfaces.has(action.b)) &&
      (!action.hotspot || surfaces.has(action.hotspot)) && (action.chapter === undefined || action.chapter === state.chapter));
  return {items,hotspots,partners};
}

/** One menu choice per recipe, preferring its authored direction when legal.
 * Receiver placement differences are not separate text-adventure decisions. */
export function choices(story: Story, state: State): Choice[] {
  const unique = new Map<string,Choice>();
  const partners = chapterSurface(story,state).partners;
  const present = new Set(partners.map(action => JSON.stringify(action)));
  // A preparation must remain reversible when an occupant hides a different
  // compatible drop. Offer clearing only when it restores an affordance, not
  // arbitrary pixel moves or a pointless move-off/move-back pair.
  const clearings:Choice[] = [];
  for (const token of availableTokens(state).filter(t => t.chapter === state.chapter && t.hotspot)) {
    const move:Choice = {type:'move',item:token.id,chapter:token.chapter,x:0,y:0};
    const cleared = act(story,state,move);
    if (chapterSurface(story,cleared).partners.some(action =>
      !(action.type === 'move' && action.item === token.id && action.chapter === token.chapter && action.hotspot === token.hotspot) &&
      !present.has(JSON.stringify(action)))) clearings.push(move);
  }
  for (const action of [...partners,...clearings]) {
    if (action.type === 'move') unique.set(JSON.stringify(action),action);
    else {
      const recipe = recipeFor(story, state, action)!;
      const key = `recipe:${recipe.id}`;
      if (!unique.has(key) || (action.a === recipe.a.ref.id && action.b === recipe.b?.ref.id)) unique.set(key,action);
    }
  }
  return [...unique.values()];
}
function optionText(story: Story, state: State, action: Choice) {
  const name = (id: string) => itemName(story, state, id);
  if (action.type === 'move') return action.hotspot ? `Place ${name(action.item)} at ${label(story,state,action.hotspot)}` : `Move ${name(action.item)} off ${label(story,state,state.tokens[action.item].hotspot!)}`;
  const hotspot = action.hotspot;
  return `${name(action.a)}${action.b ? ` + ${name(action.b)}` : ''}${hotspot ? ` @ ${label(story,state,hotspot)}` : ''}`;
}
function goalsText(story: Story, state: State): string {
  return `Goals${story.chapters[state.chapter].goalOperator === 'or' ? ' (complete any one)' : ''}:\n${visibleGoals(story,state).map(g => `- ${g.text}`).join('\n') || '(none)'}`;
}
export function board(story: Story, state: State): string {
  const observation = chapterSurface(story, state);
  const items = observation.items.map(item => {
    const slots = item.slots.filter(s => !s.filled && s.name).map(s => s.name);
    return `- ${itemName(story,state,item.id)}${item.hotspot ? ` @ ${label(story,state,item.hotspot)}` : ''}${slots.length ? `; empty slots: ${slots.join(', ')}` : ''}`;
  });
  const hotspots = observation.hotspots.map(h => {
    const token=state.tokens[h.id], slots=story.items[h.id].slots.filter(slot=>slot.name&&!token.slots.includes(slot.accepts)).map(slot=>slot.name);
    return `- ${itemName(story,state,h.id)}${slots.length?`; empty slots: ${slots.join(', ')}`:''}`;
  });
  return `${goalsText(story,state)}${hotspots.length ? `\n\nHotspots:\n${hotspots.join('\n')}` : ''}\n\nItems:\n${items.join('\n') || '(none)'}`;
}
function wonderText(markdown:string):string {return `  ${markdown.replace(/\s+/g,' ').trim()}`;}
function wonderMessages(before: State, after: State): Message[] {
  return after.pending.filter(n => n.kind === 'wonder' && !before.pending.some(old => old.key === n.key)).map(n => ({kind:'wonder',text:wonderText(n.markdown)}));
}
function goalChanges(story: Story, before: State, after: State): Message[] {
  const oldGoals = visibleGoals(story,before), newGoals = visibleGoals(story,after);
  const text = [
    ...oldGoals.filter(g => after.achieved.includes(g.id)).map(g => `Goal completed: ${g.text}`),
    ...newGoals.filter(g => !oldGoals.some(old => old.id === g.id)).map(g => `New goal: ${g.text}`),
  ].join('\n');
  return text ? [{kind:'goal-changes',text}] : [];
}
/** Render only actions actually taken to reach this checkpoint, in their original
 * chapter and order. No model recap, unperformed recipe, or future result. */
function completedHistory(story: Story, target: State): Message[] {
  const chapters = new Map<number,{start:State;messages:Message[];step:number}>();
  let state = newGame(story);
  for (const action of target.actions) {
    const before = state;
    if (before.chapter < target.chapter && !chapters.has(before.chapter)) chapters.set(before.chapter,{start:before,messages:[],step:1});
    state = act(story,before,action);
    if (before.chapter >= target.chapter || (action.type !== 'combine' && action.type !== 'move')) continue;
    const group = chapters.get(before.chapter)!, events = group.messages, step = group.step++;
    if (action.type === 'combine') {
      const recipe = recipeFor(story,before,action)!;
      events.push({kind:'result',text:`Step ${step} combination: ${optionText(story,before,action)} -> ${itemName(story,state,recipe.result.id)}`},...wonderMessages(before,state));
    } else events.push({kind:'result',text:`Step ${step} preparation: ${optionText(story,before,action)}`});
    events.push(...goalChanges(story,before,state));
  }
  const messages:Message[] = [];
  for (let index=0;index<target.chapter;index++) {
    const chapter = story.chapters[index], group = chapters.get(index);
    // Skip bridges belong to the actual next arrival notice. Replaying those
    // notices preserves them once, without inventing an unplayed normal intro.
    const intro = group ? group.start.pending.find(notice => notice.kind === 'chapter')?.markdown ?? chapter.intro : '';
    messages.push({kind:'chapter',text:`${chapterTitle(story,index)}${intro ? `\n\n${intro}` : ''}`});
    if (group) messages.push({kind:'board',text:board(story,group.start)},...group.messages);
    else {
      // A skipped chapter has no actual arrival board; do not invent supplies.
      messages.push({kind:'board',text:`Goals:\n${chapter.goals.map(g => `- ${g.text}`).join('\n') || '(none)'}\n\nItems:\n(chapter skipped)`});
      for (const goal of chapter.goals.filter(g => target.achieved.includes(g.id))) messages.push({kind:'goal-changes',text:`Goal completed: ${goal.text}`});
    }
    messages.push({kind:'chapter-completed',text:'All goals completed'});
  }
  return messages;
}
function drain(story: Story, initial: State, messages: Message[]): State {
  let state = initial;
  while (state.pending.length) {
    const notice = state.pending[0];
    messages.push({kind: notice.kind, text: notice.kind === 'chapter' ? `${chapterTitle(story,state.chapter)}\n\n${notice.markdown}` : wonderText(notice.markdown)});
    state = act(story, state, {type:'dismiss'});
  }
  return state;
}
function arrival(story: Story, initial: State, messages: Message[], playStyle:PlayStyle) {
  if (!initial.pending.some(n => n.kind === 'chapter')) messages.push({kind:'chapter', text:chapterTitle(story,initial.chapter)});
  const state = drain(story, playStyle === 'detailed' ? clearLogicalHotspots(story,initial) : initial, messages);
  messages.push({kind:'board', text:board(story, state)});
  return state;
}
function finishFrame(story: Story, initial: State, mode: Adventure['mode'], step: number, messages: Message[], offerLook=false, playStyle:PlayStyle='fast'): Adventure {
  let state = initial;
  while (chapterComplete(story, state)) {
    messages.push({kind:'chapter-completed', text:'All goals completed'});
    if (mode === 'chapter' || state.completed) break;
    const previous = state.chapter;offerLook=false;
    state = act(story, state, {type:'advance'});
    if (state.chapter !== previous) {step=1;state = arrival(story, state, messages,playStyle);}
    else break;
  }
  const complete = state.completed || (mode === 'chapter' && chapterComplete(story, state));
  if (state.completed) messages.push({kind:'ending', text:'Story completed'});
  const options = complete || playStyle === 'detailed' ? [] : choices(story, state).map((action, index) => ({choice:index + 1, text:optionText(story, state, action),kind:'action' as const}));
  const playable = playStyle === 'detailed' ? hasDetailedActions(story,state) : options.length > 0;
  if (!complete && !playable) messages.push({kind:'ending', text:'No available combinations. The chapter has unfinished goals.'});
  const phase = complete ? 'complete' : playable ? 'choose' : 'blocked';
  const menu:Frame['options'] = [...options,...(phase === 'choose' && offerLook && playStyle === 'fast' ? [{choice:'L' as const,text: "[Look again at what's available]",kind:'look' as const}] : [])];
  return {playStyle,mode,state,frame:{playStyle,lookAvailable:phase === 'choose' && offerLook,step,phase,prompt:phase === 'choose' ? (playStyle === 'fast' ? `What combination will you make for step number ${step}?` : `What will you inspect or combine for step number ${step}?`) : null,messages,options:menu}};
}
export function startAdventure(story: Story, options: {chapter?:number; mode?:Adventure['mode'];playStyle?:PlayStyle} = {}): Adventure {
  const chapter = options.chapter ?? 1, mode = options.mode ?? 'story', playStyle = options.playStyle ?? 'fast';
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > story.chapters.length) throw new Error(`Chapter must be between 1 and ${story.chapters.length}.`);
  const initial = checkpoint(story, chapter - 1);
  const messages: Message[] = [{kind:'story', text:`${story.title}${story.description ? `\n${story.description}` : ''}`}];
  messages.push(...completedHistory(story,initial));
  return finishFrame(story, arrival(story, initial, messages,playStyle), mode, 1, messages,false,playStyle);
}
function changes(story: Story, before: State, after: State): string[] {
  const result: string[] = [];
  for (const token of availableTokens(after)) {
    const old = before.tokens[token.id], name = itemName(story, after, token.id);
    if (!old) {
      const empty = story.items[token.id].slots.filter(s => !token.slots.includes(s.accepts) && s.name).map(s => s.name);
      result.push(`Created: ${name}.${empty.length ? ` Empty slots: ${empty.join(', ')}.` : ''}`);
    }
    else {
      const added = token.slots.filter(id => !old.slots.includes(id));
      if (added.length) result.push(`Fitted ${added.map(id => label(story, after, id)).join(', ')} into ${name}.`);
      if (old.hotspot !== token.hotspot || old.chapter !== token.chapter) result.push(`${name} is now ${token.hotspot ? `at ${label(story,after,token.hotspot)}` : 'off the hotspot'}.`);
    }
  }
  return result;
}
export function choose(story: Story, adventure: Adventure, step: number, selection: PlayerChoice): Adventure {
  if (adventure.frame.phase !== 'choose') throw new Error('There is no next choice; submit the final report.');
  if (step !== adventure.frame.step) throw new Error(`Stale step. Respond to step ${adventure.frame.step}.`);
  if (adventure.playStyle === 'detailed') {
    const command = detailedCommand(selection);
    if (!isLook(command)) {
      const before = adventure.state, result = detailedTurn(story,before,command);
      const messages:Message[] = [{kind:'result',text:result.text}];
      const state = drain(story,result.state,messages);
      messages.push(...goalChanges(story,before,state));
      return finishFrame(story,state,adventure.mode,step+1,messages,true,adventure.playStyle);
    }
  } else if (typeof selection === 'object') throw new Error('Choose an option from the current menu.');
  if (isLook(selection)) {
    if (!adventure.frame.lookAvailable) throw new Error('Choose an option from the current menu; look is not available at this step.');
    return {...adventure,frame:{...adventure.frame,lookAvailable:false,messages:[{kind:'board',text:board(story,adventure.state)}],options:adventure.frame.options.filter(option => option.kind !== 'look')}};
  }
  if (typeof selection !== 'number' || !adventure.frame.options.some(option => option.choice === selection)) throw new Error('Choose an option from the current menu.');
  const menu = choices(story, adventure.state);
  const before = adventure.state, combined = act(story, before, menu[selection - 1]);
  const messages: Message[] = [{kind:'result', text:changes(story, before, combined).join('\n') || 'The preparation is complete.'}];
  const state = drain(story, combined, messages);
  messages.push(...goalChanges(story,before,state));
  return finishFrame(story, state, adventure.mode, step + 1, messages, true,adventure.playStyle);
}
export function renderFrame(frame: Frame): string {
  const text = frame.messages.map((message,index) => `${index ? message.kind === 'wonder' ? '\n' : '\n\n' : ''}${message.text}`).join('');
  return text + (frame.prompt ? `\n\n${frame.prompt}\n${frame.playStyle === 'fast' ? frame.options.map(o => `${o.choice}. ${o.text}`).join('\n') : ''}` : '');
}
