import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createState, newRun, record, branch, step } from '../src/engine.ts';
import type { Action, Run } from '../src/engine.ts';
import { chooseAction } from './policies.ts';

mkdirSync('results/branches',{recursive:true});
const examples:{name:string;cue:string;source:Run;turn:number;alternatives:{name:string;action:Action}[]}[]=[
  {name:'opening-route-or-roots',cue:'Both banks receive rain. A north channel protects immediately but moves its water toward the mill. A grove accepts an initial hit while roots mature.',source:newRun(createState('confluence',4,'rooted'),'branch-opening','privileged evaluator continuations'),turn:0,alternatives:[
    {name:'grow-north',action:{type:'discover',recipe:'grow-grove',at:{row:0,col:0}}},
    {name:'divert-north',action:{type:'discover',recipe:'cut-channel',at:{row:0,col:0}}},
    {name:'reed-north',action:{type:'discover',recipe:'grow-reeds',at:{row:0,col:0}}},
  ]},
  {name:'temporary-or-growing',cue:'The coming north surge can be soaked up immediately by clay; the grove takes one pulse to mature but survives lesser later rain.',source:newRun(createState('cloudburst',7,'rooted'),'branch-temporary','privileged evaluator continuations'),turn:0,alternatives:[
    {name:'clay-relief',action:{type:'discover',recipe:'mix-clay',at:{row:0,col:0}}},
    {name:'grove-development',action:{type:'discover',recipe:'grow-grove',at:{row:0,col:0}}},
    {name:'basin-peak',action:{type:'discover',recipe:'dig-basin',at:{row:0,col:0}}},
  ]},
];
try{const source=JSON.parse(readFileSync('results/players/blind-field-a.json','utf8')) as Run;examples.push({name:'blind-player-turn-two',cue:'Groves are established in each bank; reinforce northern overflow or establish a middle outlet before diverting more water.',source,turn:2,alternatives:[
  {name:'middle-outlet',action:{type:'discover',recipe:'cut-channel',at:{row:1,col:2}}},
  {name:'north-basin',action:{type:'discover',recipe:'dig-basin',at:{row:0,col:1}}},
  {name:'wait-too-early',action:{type:'wait'}},
]});}catch{ /* Optional blind trace may not exist in a fresh checkout. */ }
const results=examples.map(example=>{
  const start=branch(example.source,example.turn);
  return {name:example.name,cue:example.cue,turn:example.turn,initialHealth:start.state.health,alternatives:example.alternatives.map(alt=>{
    let s=start.state;let run={...start.run,id:`${example.name}-${alt.name}`,player:'privileged-branch-solver',condition:'Fixed public-cue alternative followed by informed depth-3 beam; existence witness only.'};
    const first=record(s,run,alt.action);s=first.state;run=first.run;
    while(s.status==='playing'){const t=record(s,run,chooseAction(s,'planner',1701));s=t.state;run=t.run;}
    writeFileSync(`results/branches/${run.id}.json`,JSON.stringify(run,null,2));
    return {name:alt.name,action:alt.action,immediateDamage:first.transition.damage,immediateEvents:first.transition.events,outcome:s.status,health:s.health,discovered:s.known.slice(6),continuation:run.decisions.slice(example.turn+1).map(d=>d.action),runId:run.id};
  })};
});
writeFileSync('results/branches.json',JSON.stringify({access:'privileged evaluator; source and transition search visible',results,limitations:['A found alternative proves mechanical viability, not that people would consider or enjoy it.','Distinct outcomes are candidates for consequential choice, not an automatic depth score.','Continuations are a bounded heuristic; failed search is inconclusive.']},null,2));
console.log(JSON.stringify(results.map(x=>({name:x.name,alternatives:x.alternatives.map(a=>({name:a.name,immediateDamage:a.immediateDamage,outcome:a.outcome,health:a.health,discovered:a.discovered}))})),null,2));
