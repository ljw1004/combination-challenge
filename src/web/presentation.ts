import { markdown } from './markdown.ts';

/** Item readings are authored paragraphs, not paragraphs plus an invented caption. */
export function readingBody(text:string,asset:(path:string)=>string = p=>p):string {
  return `<div class="reading-text">${markdown(text,asset)}</div>`;
}

export interface GoalPresentation { key:string; phase:'goals'|'leaving'|'entering'|'arrow' }
/** Only newly earned readiness animates; a settled reload starts settled. */
export function goalPresentation(previous:GoalPresentation|undefined,key:string,complete:boolean,blocked:boolean,reducedMotion:boolean):GoalPresentation {
  if(!previous||previous.key!==key)return {key,phase:complete&&!blocked?'arrow':'goals'};
  if(!complete)return {key,phase:'goals'};
  if(previous.phase==='arrow')return previous;
  if(blocked)return {key,phase:'goals'};
  if(reducedMotion)return {key,phase:'arrow'};
  if(previous.phase==='leaving'||previous.phase==='entering')return previous;
  return {key,phase:'leaving'};
}
