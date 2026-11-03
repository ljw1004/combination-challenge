import type {ChapterSession} from './chapter-session.ts';
import {evidence,keys,object,references,words} from './protocol.ts';
import type {Evidence} from './protocol.ts';

export interface Grade {
  verdict:string;
  decisions:{step:number;meaningful:boolean;reason:string}[];
  fun:{meaningful:number;total:number;ratio:number|null;explanation:string};
  hook:{score:'high'|'medium'|'low'|null;reason:string;steps:number[]};
  strongest:Evidence;weakest:Evidence;limits:string;
}
/** Call only after frozen replay verification. No model, timing or route metadata. */
export function graderPacket(session:ChapterSession) {
  return {playStyle:session.playStyle,instructions:session.graderRubric,guidance:session.guidance,playerInstructions:session.playerRubric,
    initial:session.initial,turns:session.turns,final:session.final ?? null,
    ...(session.pendingLook ? {unfinishedStep:{step:session.adventure.frame.step,lookedAgain:true,lookView:session.adventure.frame}} : {}),
    protocolIssues:session.requests.filter(r => r.error).map(({step,error,reply}) => ({step,correction:error,...(reply !== undefined ? {reply} : {})})),
    verification:{replayVerified:true,decisions:session.turns.length,looks:session.turns.filter(turn => turn.lookedAgain).length + Number(session.pendingLook),outcome:session.outcome ?? (session.adventure.frame.phase === 'complete' ? 'completed-awaiting-report' : 'unfinished'),protocolRejections:session.requests.filter(r => r.error).length}};
}
export function validateGrade(value:unknown,session:ChapterSession):Grade {
  const grade = object(value,'grade'), steps = session.turns.map(t => t.reply.step);
  keys(grade,['verdict','decisions','fun','hook','strongest','weakest','limits'],'grade');
  words(grade.verdict,'verdict');words(grade.limits,'limits');
  if (!Array.isArray(grade.decisions) || grade.decisions.length !== steps.length) throw new Error('Grade every gameplay step exactly once.');
  const graded:number[] = [];let meaningful=0;
  for (const value of grade.decisions) {
    const decision = object(value,'decision');keys(decision,['step','meaningful','reason'],'decision');
    if (typeof decision.step !== 'number' || !steps.includes(decision.step) || graded.includes(decision.step)) throw new Error('Grade every gameplay step exactly once.');
    if (typeof decision.meaningful !== 'boolean') throw new Error('meaningful must be true or false.');
    words(decision.reason,'decision.reason');graded.push(decision.step);if (decision.meaningful) meaningful++;
  }
  const fun = object(grade.fun,'fun');keys(fun,['meaningful','total','ratio','explanation'],'fun');words(fun.explanation,'fun.explanation');
  const ratio = steps.length ? meaningful / steps.length : null;
  if (fun.meaningful !== meaningful || fun.total !== steps.length || (ratio === null ? fun.ratio !== null : typeof fun.ratio !== 'number' || !Number.isFinite(fun.ratio) || fun.ratio < 0 || fun.ratio > 1 || Math.abs(fun.ratio-ratio) > 0.0005)) throw new Error('Fun counts and ratio must agree with the per-step classifications (ratio 0–1; null for no decisions).');
  const hook = object(grade.hook,'hook');keys(hook,['score','reason','steps'],'hook');words(hook.reason,'hook.reason');references(hook.steps,steps,'hook.steps');
  if (session.final ? !['high','medium','low'].includes(hook.score as string) : hook.score !== null) throw new Error('Hook must be high/medium/low with a final report, or null without one.');
  evidence(grade.strongest,steps,'strongest');evidence(grade.weakest,steps,'weakest');
  return {...structuredClone(grade),fun:{...fun,ratio}} as unknown as Grade;
}
