import type { Session } from './session.ts';
export const experienceCriteria = {
  intelligibility:'Can visible names, goals and partner hints support sensible action without arbitrary guessing?',
  learning:'Did the player learn, discover or transfer a useful understanding?',
  construction:'Was making things or making clear, comfortable progress worthwhile?',
  pacing:'Did curiosity, wonder and a valued ending outweigh unwanted repetition or confusion?',
  continuity:'Did earlier work acquire a useful later role?',
  choice:'Where choices mattered, were they informed and consequential? A dilemma on every move is not required.',
};
export function evaluate(session:Session){
  const accepted=session.entries.filter(e=>!e.error),count=(type:string)=>accepted.filter(e=>e.action.type===type).length;
  const accounts=session.entries.filter(e=>e.account&&Object.values(e.account).some(Boolean)).map(e=>({sequence:e.sequence,...e.account}));
  const reported=session.report?.criteria as Record<string,{assessment?:string;explanation?:string;events?:number[]}>|undefined;
  const profile=Object.entries(experienceCriteria).map(([id,question])=>{
    const claim=reported?.[id],events=Array.isArray(claim?.events)?claim.events:[],valid=events.length>0&&events.every(n=>Number.isInteger(n)&&session.entries.some(e=>e.sequence===n));
    const assessment=valid&&['supported','concerning','mixed'].includes(claim?.assessment??'')?claim!.assessment:'unknown';
    return {id,question,assessment,attribution:'agent/player self-report; not an independent enjoyment measurement',claim:claim??null,evidence:valid?events.map(sequence=>({sequence,action:session.entries[sequence-1].action,account:session.entries[sequence-1].account,error:session.entries[sequence-1].error})):[],...(!valid?{limit:'Missing report or missing/invalid event citations; no supported experience claim.'}:{})};
  });
  return {
    session:session.id,condition:session.condition,assignment:session.assignment,model:session.model??'unrecorded',
    provenance:{story:session.storyHash,runtime:session.runtimeHash},
    outcome:session.outcome??'open',mechanics:{completed:session.state.completed,combinations:count('combine'),placements:count('move'),readingRequests:count('read'),dismissals:count('dismiss'),chapterAdvances:count('advance'),rejectedAttempts:session.entries.filter(e=>e.error).map(e=>({sequence:e.sequence,action:e.action,reason:e.error}))},
    playerEvidence:accounts,playerReport:session.report??null,experienceProfile:profile,
    interpretation:{
      status:session.condition==='diagnostic'?'Diagnostic run: no fresh-player experience claim.':accounts.length||session.report?'Inspect the attributed player evidence; reports are hypotheses about human experience.':'No player experience report; enjoyment is unknown.',
      criteria:experienceCriteria,
      nextExperiment:accounts.findLast(a=>a.hypothesis)?.hypothesis??session.report?.nextExperiment??null,
      limits:['Mechanical completion and action counts do not measure enjoyment.','A logical interface does not test scrolling, touch, visual readability or human comprehension.','Assigned continuation is not voluntary interest.','No scalar fun score is computed; missing evidence remains unknown.'],
    },
  };
}
