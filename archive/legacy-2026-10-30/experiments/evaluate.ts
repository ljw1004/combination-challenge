/** Frozen diagnostic rubric. No enjoyment total, rankings, or automatic expansion gate. */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { DEFAULT_RULES } from '../src/data.ts';
import type { Run } from '../src/engine.ts';
import { analyzeRun, GRADER_VERSION, runGraderFixtures } from './grader.ts';

const paths=['results/runs','results/players'].flatMap(dir=>existsSync(dir)?readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>`${dir}/${f}`):[]);
const reports=paths.map(path=>{const run=JSON.parse(readFileSync(path,'utf8')) as Run;return {run,report:analyzeRun(run),path};});
mkdirSync('results/profiles',{recursive:true});
for(const r of reports)writeFileSync(`results/profiles/${r.run.id}.json`,JSON.stringify(r.report,null,2));
const groups=[...new Set(reports.map(r=>r.run.rules))].map(rules=>{
  const rs=reports.filter(r=>r.run.rules===rules);const planner=rs.filter(r=>r.run.player==='planner');const greedy=rs.filter(r=>r.run.player==='greedy');
  const mean=(items:typeof rs,key:'discoveries'|'trailingWaits')=>items.length?Number((items.reduce((n,r)=>n+r.report[key],0)/items.length).toFixed(2)):null;
  return {rules,n:rs.length,planner:{wins:planner.filter(r=>r.run.outcome==='won').length,n:planner.length,meanDiscoveries:mean(planner,'discoveries'),meanTrailingWaits:mean(planner,'trailingWaits')},greedy:{wins:greedy.filter(r=>r.run.outcome==='won').length,n:greedy.length},
    inventionUse:planner.length&&planner.every(r=>r.report.discoveries===0)?'concern: informed solutions bypass all invention':'inspect practical consequences; discovery counts alone are not support',
    pressureDiscrimination:planner.length&&greedy.length&&planner.every(r=>r.run.outcome==='won')&&greedy.every(r=>r.run.outcome==='won')?'concern: greedy and bounded planner both saturate; inspect optional goals and shallow strategies':'inspect failure and recovery traces',
    representativeFailure:rs.find(r=>r.run.outcome==='lost')?.path??null,
  };
});
const blind=reports.filter(r=>r.path.startsWith('results/players/'));
const checked=blind.reduce((n,r)=>n+(r.report.features.predictionHits??0)+(r.report.features.predictionMisses??0),0);
const misses=blind.reduce((n,r)=>n+(r.report.features.predictionMisses??0),0);
const waiting=blind.filter(r=>r.report.trailingWaits>=3).map(r=>({runId:r.run.id,fromTurn:r.run.decisions.length-r.report.trailingWaits,waits:r.report.trailingWaits}));
const branchResults=existsSync('results/branches.json')?JSON.parse(readFileSync('results/branches.json','utf8')):null;
type BranchAlternative={runId:string;outcome:string;immediateDamage:[number,number];health:[number,number];discovered:string[]};
const branchEvidence=(branchResults?.results??[]).map((r:{name:string;alternatives:BranchAlternative[]})=>{
  const winners=r.alternatives.filter(a=>a.outcome==='won');
  const differences=new Set(winners.map(a=>JSON.stringify({immediateDamage:a.immediateDamage,health:a.health,discovered:a.discovered}))).size;
  return {name:r.name,winningBranches:winners.map(a=>a.runId),distinctMeasuredConsequences:differences,hasDistinctViableAlternatives:winners.length>=2&&differences>=2};
});
const result={grader:GRADER_VERSION,selectedRules:DEFAULT_RULES,access:'evaluator has implementation and replays; policy/planner access recorded per run',groups,
  blindCoverage:blind.map(r=>({path:r.path,id:r.run.id,condition:r.run.condition,order:r.run.offerOrder,scenario:r.run.scenario,seed:r.run.seed,rules:r.run.rules,outcome:r.run.outcome,turns:r.report.turns,health:r.report.health,discoveries:r.report.discoveries,waits:r.report.waits,trailingWaits:r.report.trailingWaits,predictions:r.report.features})),
  cards:[
    {criterion:'readable-causality',status:checked?(misses?'concern':'support'):'unknown',measurement:{checked,misses},evidence:blind.filter(r=>(r.report.features.predictionHits??0)+(r.report.features.predictionMisses??0)>0).map(r=>({runId:r.run.id,hits:r.report.features.predictionHits,misses:r.report.features.predictionMisses})),limitation:'CLI rules literacy and damage predictions do not establish human UI clarity or learning.'},
    {criterion:'viable-alternatives',status:branchEvidence.some((b:{hasDistinctViableAlternatives:boolean})=>b.hasDistinctViableAlternatives)?'support':'unknown',evidence:branchEvidence,limitation:'Compared actual immediate damage, final health and established capabilities on winning continuations. These differences alone do not demonstrate a worthwhile choice.'},
    {criterion:'consequential-choice',status:'unknown',evidence:branchEvidence,limitation:'A reviewer must assess public plausibility, costs, dominance and salience. File existence and distinct states cannot establish worthwhile choices.'},
    {criterion:'settled-waiting',status:waiting.length?'concern':'unknown',evidence:waiting,nextChange:'Offer optional acceleration only after simulating all remaining pulses with zero damage; record each actual transition.',limitation:'This is repeated input after a settled plan, distinct from repair loops. Current traces predate optional acceleration.'},
    {criterion:'activity-after-solved-survival',status:reports.some(r=>r.report.nonWaitActionsAfterSafeCompletion>=2)?'concern':'unknown',evidence:reports.filter(r=>r.report.nonWaitActionsAfterSafeCompletion>=2).slice(0,5).map(r=>({runId:r.run.id,turn:r.report.earliestSafeCompletion,additionalActions:r.report.nonWaitActionsAfterSafeCompletion,unusedDiscoveries:r.report.unusedDiscoveries})),limitation:'Further invention may express play or optimize health, but cannot be counted as necessary survival decisions. The solver rewards novelty/stability, so its activity is confounded.'},
    {criterion:'human-enjoyment',status:'unknown',participants:0,nextTest:'Compare prewritten grader predictions with 4–6 formative human sessions.'},
  ],
  graderFixtures:runGraderFixtures(),
  recommendation:'Revise within this small slice. Preserve revealed recipes, permanent access, immediate invention, and exact flow feedback. Challenge dominant grove openings and the weak role of deeper recipes before adding encounters. Human enjoyment remains unknown.',
  nextExperiment:{hypothesis:'A single announced shift in flood timing or a route obstacle changes which established invention is worth using, without requiring recurring repairs.',falsifier:'The same grove-first script wins every arrangement with no revised decision, or new exceptions cause prediction errors.',requiredEvidence:'Two defensible openings, one failure with a plausible recovery, and an actual human account of a worthwhile decision.'},
};
writeFileSync('results/evaluation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({profiles:reports.length,blindRuns:blind.length,predictions:checked,misses,settledWaitExamples:waiting.length,groups,recommendation:result.recommendation},null,2));
