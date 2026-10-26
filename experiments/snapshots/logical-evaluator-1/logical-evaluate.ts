/** Replay evidence and explicit design judgments. No UI metrics or fun total. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { LOGICAL_GAMES, replayLogical } from './logical-games.ts';
import type { LogicalRun } from './logical-games.ts';
const folder='results/logical-players';
const runs=existsSync(folder)?readdirSync(folder).filter(file=>file.endsWith('.json')).map(file=>{
  const run=JSON.parse(readFileSync(`${folder}/${file}`,'utf8')) as LogicalRun,game=LOGICAL_GAMES[run.game],state=replayLogical(run);
  const statusPredictions=run.decisions.flatMap(decision=>{
    const prediction=decision.prediction as {expectedStatus?:string}|undefined;
    const observation=decision.observation as {status?:string};
    return prediction?.expectedStatus?[{decision:decision.index,predicted:prediction.expectedStatus,actual:observation.status,correct:prediction.expectedStatus===observation.status}]:[];
  });
  return {id:run.id,game:run.game,version:run.version,scenario:run.scenario,condition:run.condition,status:game.status(state),decisions:run.decisions.length,invalidAttempts:run.attempts.length,replay:'pass',statusPredictions,previewTelemetry:run.previews?{recorded:run.previews.length}:'Not recorded in logical-cli-1; only player reports are available.',
    annotatedDecisions:run.decisions.filter(decision=>decision.prediction!==undefined).length,
    source:`${folder}/${file}`};
}):[];
const result={version:'logical-evidence-1',scope:'Abstract game structure only. No interface or gesture metric is included.',runs,
  findings:[
    {candidate:'forms',status:'revise',evidence:['logic-shape-a','logic-shape-b'],claim:'One fresh-then-experienced player solves both in3 combinations, following the same5→7→10 construction template.',counterevidence:'Relative geometry differs and decomposition is still a real spatial inference. Fast formal AI performance does not establish human triviality.',decision:'Do not expand these same target-family levels. Retain as a small composition baseline.',report:'results/logical-players/logic-shape-report.md'},
    {candidate:'relations-1',status:'revise',evidence:['logic-rule-a','logic-rule-b','logic-rule-c'],claim:'Initial factorization gives an actual inference. Echo relocation reuses identical intermediate truth patterns; stricter support needs a small adaptation.',counterevidence:'Brute saturation is157–158 actions versus7 deliberate actions, so eventual closure is not a short winning shortcut. A fixed expression cannot satisfy conflicting contexts.',decision:'Test a structurally different relation, rather than more echo placements or more variables.',report:'results/logical-players/logic-rule-report.md'},
    {candidate:'relations-2',status:'revise',evidence:['logic-rule-d','logic-rule-e','logic-rule-f'],claim:'Changed relations require3/3/4 combinations and are genuinely different, but an experienced player found each complete construction before acting. Goal prose supplied substantial decomposition hints.',counterevidence:'A short intended insight can be worthwhile. General DNF construction is an adaptive method, not a single context-blind answer; no extra resources were added.',decision:'Do not expand this as a sequence of worksheets. Separate explicit case constraints from supplied target decompositions, and test useful persistence.',report:'results/logical-players/logic-rule2-report.md'},
    {candidate:'progression',status:'retain-narrowly',evidence:['logic-progress-a'],claim:'A fresh player completes three public-case stages in6 combinations, reusing the entire first-stage judgment as a later ingredient. It reports that reuse as the strongest moment.',counterevidence:'Player reports one preview; preview calls were not instrumented in these original runs. No mistakes or recovery; most construction is routine after recognizing minimal accepted pairs. Source expertise and observation conditions differ from the earlier experienced run.',decision:'Retain reusable constructed relationships as a logical hypothesis. This is one short puzzle sequence, not sustained fun or a completed civilization game.',report:'results/logical-players/logic-progress-report.md'},
    {candidate:'laboratory',status:'tutorial-only',evidence:['results/logical-laboratory-screen.json'],claim:'One shared routine identifies all12 toy worlds with at most4 combinations.',counterevidence:'Choosing the distinguishing observation is real inference; joint condition is useful in4/12 worlds. No fresh agent run for this candidate.',decision:'Do not promote to a full game or add query credits to rescue it.'},
  ],
  methodology:{blindness:'Instruction-based CLI restriction; fresh/experienced conditions recorded. No source or multi-step search allowed for agent players.',predictionCoding:'Only explicitly structured expectedStatus fields are automatically scored. Other predictions remain recorded but unscored; confidence and eloquence earn no credit.',limits:'One model/player per candidate family; prior formal expertise may make these puzzles unusually easy. No claim of human enjoyment or validated fun prediction.',counterexampleRule:'Short shared solutions can expose routine play. Generic exhaustive solvability alone cannot reject a finite construction puzzle.'},
};
writeFileSync('results/logical-evaluation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({version:result.version,runs:result.runs,decisions:result.findings.map(({candidate,decision})=>({candidate,decision}))},null,2));
