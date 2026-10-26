import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { SCENARIOS, RULES } from '../src/data.ts';
import { createState, newRun, record } from '../src/engine.ts';
import type { Run } from '../src/engine.ts';
import { chooseAction } from './policies.ts';
import type { Policy } from './policies.ts';
import { analyzeRun, GRADER_VERSION, runGraderFixtures } from './grader.ts';

const holdout=process.argv.includes('--holdout');
const rulesArg=process.argv.find(x=>x.startsWith('--rules='))?.slice(8);
const seeds=holdout?[101,203,307,409,503,607,709,811,907,1009,1103,1201]:Array.from({length:12},(_,i)=>i+1);
const rules=rulesArg?rulesArg.split(','):Object.keys(RULES);
const policies:Policy[]=['random','greedy','goal','planner'];
const rows:Record<string,unknown>[]=[];mkdirSync('results/runs',{recursive:true});
for(const rule of rules)for(const scenario of SCENARIOS)for(const policy of policies){
  const reports:ReturnType<typeof analyzeRun>[]=[];
  for(const seed of seeds){let s=createState(scenario.id,seed,rule);let run=newRun(s,policy,policy==='planner'?'privileged beam search, width 6 depth 3':'public observation; one-step exact previews for greedy/goal');
    const path=`results/runs/${run.id}.json`;
    if(process.argv.includes('--reuse')&&existsSync(path))run=JSON.parse(readFileSync(path,'utf8')) as Run;
    else while(s.status==='playing'){
      const a=chooseAction(s,policy,seed+10000);const r=record(s,run,a);s=r.state;run=r.run;
    }
    const report=analyzeRun(run);reports.push(report);writeFileSync(path,JSON.stringify(run,null,2));
  }
  const sum=(key:'discoveries'|'instantRelief'|'unplacedDiscoveries'|'repeatedRepairCandidates'|'trailingWaits')=>Number((reports.reduce((n,r)=>n+r[key],0)/reports.length).toFixed(2));
  const row={rule,scenario:scenario.id,policy,n:reports.length,wins:reports.filter(r=>r.outcome==='won').length,meanDiscoveries:sum('discoveries'),meanUnusedDiscoveries:Number((reports.reduce((n,r)=>n+r.unusedDiscoveries.length,0)/reports.length).toFixed(2)),meanInstantRelief:sum('instantRelief'),meanUnplaced:sum('unplacedDiscoveries'),meanRepairCandidates:sum('repeatedRepairCandidates'),meanTrailingWaits:sum('trailingWaits'),healthRange:[Math.min(...reports.map(r=>Math.min(...r.health))),Math.max(...reports.map(r=>Math.min(...r.health)))]};
  rows.push(row);console.log(JSON.stringify(row));
}
const result={build:'0.4.0',grader:GRADER_VERSION,kind:holdout?'holdout':'development',seeds,policies,rows,graderFixtures:runGraderFixtures(),limitations:['These policies are deterministic diagnostics, not AI or human enjoyment judgments.','Planner sees transition internals and future graph; greedy/goal use public state and one-step previews.','Seeds transfer one water unit between adjacent pulses; geometric generalization comes from three scenarios.','Grader fixtures test supplied features, not automatic semantic extraction from arbitrary traces.']};
writeFileSync(`results/${holdout?'holdout':'screen'}.json`,JSON.stringify(result,null,2));
console.log(`Saved ${rows.length*seeds.length} runs; fixtures ${result.graderFixtures.filter(f=>f.pass).length}/${result.graderFixtures.length}.`);
