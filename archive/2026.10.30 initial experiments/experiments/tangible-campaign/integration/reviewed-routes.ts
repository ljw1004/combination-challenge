import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as M from '../engine/model.ts';
import type {Action,Scenario} from '../schema/scenario.ts';
import {c85Scenarios} from '../ui/scenarios.ts';
export const evidenceRoot=new URL('../evidence/integration-20261028/',import.meta.url);
export const readSource=(path:string)=>JSON.parse(readFileSync(new URL('sources/'+path,evidenceRoot),'utf8'));
export const digest=(data:string|Uint8Array)=>createHash('sha256').update(data).digest('hex');
export const sourceManifest=JSON.parse(readFileSync(new URL('source-inputs.json',evidenceRoot),'utf8'));
export const routeSpecs:{key:string;source:string;alternatives:{name:string;source:string;witness?:string}[]}[]=[
 {key:'mars',source:'mars/late-return-consistency-20261028/authored.cargo.actions.json',alternatives:['beacon','tow','tow-old-alias','closed-reader.accepted'].map(name=>({name,source:`mars/late-return-consistency-20261028/${name}.cargo.actions.json`}))},
 {key:'atlas',source:'atlas-evidence-repair-v9/author-route.json',alternatives:[]},
 {key:'elements',source:'elements-house-and-craft-v1/scenario.json',alternatives:[]},
 {key:'food',source:'food-v6-ten-kitchens/routes/plain-vinaigrette.json',alternatives:["preserved-v3/canonical", "preserved-v3/all-recipes", "preserved-v3/reverse-ready", "preserved-v3/reverse-directions", "preserved-v3/early-discovery", "preserved-v3/early-opening", "direct-mustard", "catalogue-plain-vinaigrette", "catalogue-direct-mustard", "plain-vinaigrette-reversed", "direct-mustard-reversed", "early-plain-vinaigrette", "chocolate-departure", "early-kitchen-forward", "early-kitchen-reverse"].map(name=>({name,source:`food-v6-ten-kitchens/routes/${name}.json`}))},
 {key:'purpose',source:'causation/next-logic-reconsideration-20261028/paired-v1/author-route.json',alternatives:[]},
 {key:'doctrine',source:'doctrine/images-dispute-research-20261028/candidate-v2-copy1/authoring-manifest.json',alternatives:[]},
];
export function routeActions(source:string,witness?:string):Action[]{const raw=readSource(source);return witness?raw[witness]:Array.isArray(raw)?raw:raw.actionsLog??raw.actions??raw.authoredActions??raw.basket??raw.checkpoints?.find((c:any)=>c.id==='complete')?.actions;}
export function scenarioFor(key:string):Scenario {const id=readSource(sourceManifest.scenarioSources[key]).id;const s=c85Scenarios.find(s=>s.id===id);if(!s)throw Error('Missing historical c85 integration '+id);return s;}
/** Accepted-action, current-goal ancestry audit. It does not mistake inventory presence or optional unrelated actions for reuse.
 * Derived from research28/continuity/audit.ts. This witness diagnostic is not exhaustive semantic proof or human enjoyment evidence. */
export function auditRoute(s:Scenario,actions:Action[],width=360){
 let g=M.createGame(s,width);const createdAt=new Map<string,number>();
 const rows:{stage:string;earlierUsed:string[];goalConnected:string[];completed:boolean}[]=[];
 const stageEntries:{stageIndex:number;stageId:string;actionPrefixLength:number;stateSha256:string}[]=[];
 let edges=new Map<string,Set<string>>(),used=new Set<string>(),placed=new Set<string>();
 const entry=(n:number)=>stageEntries.push({stageIndex:g.state.stage,stageId:s.stages[g.state.stage].id,actionPrefixLength:n,stateSha256:digest(JSON.stringify(g.state))});entry(0);
 const finish=()=>{const connected=new Set<string>(),visited=new Set<string>();
  const walk=(id:string)=>{if(visited.has(id))return;visited.add(id);for(const input of edges.get(id)??[]){if(createdAt.has(input)&&createdAt.get(input)!<g.state.stage)connected.add(input);if(input!==id)walk(input);}};
  for(const o of M.objectiveStates(s,g.state).filter(o=>o.satisfied))for(const id of o.witnesses.length?o.witnesses:o.intermediate&&o.item?[o.item]:[]){walk(id);if(o.kind==='place'&&placed.has(id)&&createdAt.has(id)&&createdAt.get(id)!<g.state.stage)connected.add(id);}
  rows.push({stage:s.stages[g.state.stage].id,earlierUsed:[...used],goalConnected:[...connected],completed:M.stageComplete(s,g.state)});
 };
 for(const [index,a]of actions.entries()){
  const stage=g.state.stage,r=M.applyAction(s,g,a);if(!r.accepted)throw Error(`${s.id} action ${index+1}: ${r.message}`);
  // Current event-local compatibility: unrelated actions/advances never absorb a leftover.
  for(const t of g.state.tokens)if(!M.token(r.game.state,t.id)&&!(a.type==='combine'&&[a.a,a.b].includes(t.id)))throw Error(`${s.id}: unrelated disappearance ${t.id} at ${index+1}`);
  if(a.type==='advance'){finish();edges=new Map();used=new Set();placed=new Set();}
  if(a.type==='combine'){
   const inputs=[a.a,a.b].filter(id=>!id.startsWith('@'));for(const id of inputs)if(createdAt.has(id)&&createdAt.get(id)!<stage)used.add(id);
   const out=r.created??r.updated;if(out){const deps=edges.get(out)??new Set<string>();for(const id of inputs)deps.add(id);edges.set(out,deps);}if(r.created)createdAt.set(r.created,stage);
   const recipe=s.recipes.find(q=>q.id===r.recipe)!;
   for(const id of recipe.preserve??[]){const input=M.token(g.state,id)!,owner=M.token(r.game.state,out!)!;for(const part of [...Object.values(input.slots),...(input.components??[])])if(!owner.components?.includes(part))throw Error(`${s.id}: ${recipe.id} lost visible ${part}`);}
  }
  if(a.type==='place'&&a.location)placed.add(a.item);g=r.game;if(g.state.stage!==stage)entry(index+1);
 }
 if(!g.state.completed)finish();
 return {game:g,rows,stageEntries,missing:rows.filter((r,i)=>i>0&&r.completed&&!r.goalConnected.length).map(r=>r.stage)};
}
