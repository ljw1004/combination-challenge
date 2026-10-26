/** Reproduce the current doctrine's application to actual player captures. */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { FUN_DESIGNS } from './fun-designs.ts';
import { evaluateFun } from './fun-evaluator.ts';
import type { LogicalRun } from './logical-games.ts';
import { FUN_REVIEWS } from './fun-reviews.ts';
const folder='results/logical-players';
const runs=existsSync(folder)?readdirSync(folder).filter(file=>file.endsWith('.json')).map(file=>JSON.parse(readFileSync(`${folder}/${file}`,'utf8')) as LogicalRun):[];
const selected=runs.filter(run=>run.id.startsWith('fun-')&&FUN_DESIGNS[run.game]);
mkdirSync('results/fun-profiles',{recursive:true});
const profiles=selected.map(run=>{
  const profile=evaluateFun(run,FUN_DESIGNS[run.game],runs,2000,FUN_REVIEWS[run.id]);
  writeFileSync(`results/fun-profiles/${run.id}.json`,JSON.stringify(profile,null,2));
  return {id:run.id,game:run.game,version:run.version,condition:run.condition,decisions:run.decisions.length,reportPresent:!!run.report,
    electiveActions:profile.experienceAcrossTime.continuation.actualElectiveActions,
    interpretation:profile.experienceAcrossTime.provisionalInterpretation,
    profile:`results/fun-profiles/${run.id}.json`};
});
const report={version:'fun-evidence-4',doctrine:'docs/history/what-is-fun/revision-7.md',profiles,
  framing:'Experience across time comes first. F1–F10 audit false positives; they do not establish absorption. No human enjoyment score is computed.',
  methodology:'Fresh and experienced conditions, preview exposure, stopping checkpoints and elective acts remain explicit. Instructed completion and a stated future wish are not actual elective continuation.',
  openQuestions:['Did a narrative revelation or valued relationship create a concrete next intention?','Does a satisfying short ending need expansion, or is the intended renewal mechanism simply unobserved?','Which expectations should the designer revise after the independent evaluator audit?']};
writeFileSync('results/fun-evaluation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
