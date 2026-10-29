/** Accepted-event ancestry for the two deliberately early-prepared Kitchen witnesses.
 * This is not the canonical per-chapter-use audit: it separately distinguishes
 * already-earned goals from later placement of a genuinely prepared compound.
 * Scope: these exact routes have unique outputs and append-only trolley slots;
 * this accumulated-ID graph is not a general mutable/replaced-slot ancestry proof.
 * Inventory presence and potential (unplayed) recipe graphs are not evidence.
 */
import assert from 'node:assert/strict';
import type {Action,Scenario} from '../schema/scenario.ts';
import * as M from '../engine/model.ts';
export function priorCreatedAncestors(roots:string[],edges:Map<string,Set<string>>,createdAt:Map<string,number>,stage:number){
 const seen=new Set<string>(),found=new Set<string>();
 const visit=(id:string)=>{if(seen.has(id))return;seen.add(id);const at=createdAt.get(id);if(at!==undefined&&at<stage)found.add(id);for(const input of edges.get(id)??[])visit(input);};
 roots.forEach(visit);return [...found];
}
export function acceptedGoalAncestry(s:Scenario,actions:Action[],width=360){
 let g=M.createGame(s,width),entryReady=M.stageComplete(s,g.state),stageActions:Action[]=[];
 const edges=new Map<string,Set<string>>(),createdAt=new Map<string,number>(),events:{index:number;stage:number;recipe:string;out:string;inputs:string[];created:boolean}[]=[],rows:{stage:string;stageIndex:number;readyAtEntry:boolean;roots:string[];priorCreations:string[];actions:Action[];completed:boolean}[]=[];
 const finish=()=>{const objectives=M.objectiveStates(s,g.state);assert(objectives.every(o=>o.satisfied),'Unsatisfied current goal');const roots=objectives.flatMap(o=>o.witnesses.length?o.witnesses:o.intermediate&&o.item?[o.item]:[]);rows.push({stage:s.stages[g.state.stage].id,stageIndex:g.state.stage,readyAtEntry:entryReady,roots,priorCreations:priorCreatedAncestors(roots,edges,createdAt,g.state.stage),actions:stageActions,completed:M.stageComplete(s,g.state)});};
 for(const [index,a]of actions.entries()){
  if(a.type==='advance')finish();
  const before=g,r=M.applyAction(s,g,a);assert(r.accepted,`${s.id} action ${index+1}: ${r.message}`);
  if(a.type==='combine'){
   const out=r.created??r.updated;if(out){const inputs=[a.a,a.b].filter(id=>!id.startsWith('@')),deps=edges.get(out)??new Set<string>();inputs.forEach(id=>deps.add(id));edges.set(out,deps);if(r.created)createdAt.set(r.created,before.state.stage);events.push({index:index+1,stage:before.state.stage,recipe:r.recipe!,out,inputs,created:!!r.created});}
  }
  if(a.type!=='advance')stageActions.push(a);g=r.game;
  if(g.state.stage!==before.state.stage){entryReady=M.stageComplete(s,g.state);stageActions=[];}
 }
 assert(g.state.completed);return {rows,events,createdAt:Object.fromEntries(createdAt),finalState:g.state};
}
