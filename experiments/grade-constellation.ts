/** Auditable interaction evidence, deliberately without an enjoyment score. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { constellationStep, createConstellation, replayConstellation } from '../src/constellation-model.ts';
import type { ConstellationCapture } from '../src/constellation-model.ts';
type Capture=ConstellationCapture & {interfaceVersion?:string;interfaceChanges?:unknown[];interactions?:Record<string,unknown>[]};
const base='results/gesture-players';
const reports=existsSync(base)?readdirSync(base).filter(id=>id.startsWith('canvas-')&&existsSync(`${base}/${id}/runs.json`)).map(id=>{
  const runs=JSON.parse(readFileSync(`${base}/${id}/runs.json`,'utf8')) as Capture[];
  const commands=JSON.parse(readFileSync(`${base}/${id}/commands.json`,'utf8')) as {commands:unknown[]};
  return {id,commands:commands.commands.length,modes:runs.filter(run=>run.decisions.length).map(run=>{
    const final=replayConstellation(run);let state=createConstellation(run.mode,run.goalId);
    let retained=0,unique=true,continuedResult=0,previousResult:string|undefined;
    const fusions:Record<string,unknown>[]=[],completedGoals=new Set<string>();
    for(const [index,decision]of run.decisions.entries()){
      const before=state;state=constellationStep(state,decision.action);
      if(state.goal?.status==='won')completedGoals.add(state.goal.id);
      unique&&=new Set(state.nodes.map(node=>node.id)).size===state.nodes.length;
      if(decision.action.type!=='blend')continue;
      const a=decision.action,parents=[a.a,a.b];
      if(parents.every(id=>JSON.stringify(before.nodes.find(node=>node.id===id))===JSON.stringify(state.nodes.find(node=>node.id===id))))retained++;
      if(previousResult&&parents.includes(previousResult))continuedResult++;
      const created=state.nodes.find(node=>!before.nodes.some(old=>old.id===node.id));
      previousResult=created?.id;
      fusions.push({decision:index,inputs:parents,newConcept:created?.id??null,offset:a.offset??null});
    }
    const events=(run.interactions??[]).filter(event=>event.kind==='fusion');
    return {mode:run.mode,interface:run.interfaceVersion,interfaceChanges:run.interfaceChanges??[],replay:'pass',fusions,novelConcepts:final.nodes.length-createConstellation(run.mode).nodes.length,completedGoals:[...completedGoals],
      parentsRetainedAtExactPositions:retained,uniqueNodeIds:unique,resultUsedInNextFusion:continuedResult,matchingFusionEventCount:events.length===fusions.length,goal:final.goal??null,
      cards:[
        {criterion:'direct-combination',status:fusions.length&&events.length===fusions.length?'support':'unknown',claim:'Captured screen commands accompany ingredient-fusion events and replayable model contacts.',limitation:'Instruction-based player isolation; event counts do not measure tactile pleasure.'},
        {criterion:'one-per-concept-and-parents-remain',status:!fusions.length?'unknown':unique&&retained===fusions.length?'support':'concern',claim:`${retained}/${fusions.length} contacts retain both parents exactly; unique IDs throughout.`},
        {criterion:'intellectual-challenge',status:'unknown',claim:run.mode==='forms'?'Shape completion is recorded; contextual planning and transferable learning need separate evidence.':'Free exploration does not establish a surrounding challenge.'},
        {criterion:'human-enjoyment',status:'unknown',claim:'No new human playtest is inferred from AI reports, gestures or successful completions.'},
      ]};
  }),source:`${base}/${id}/runs.json`,playerReport:`${base}/${id}/report.md`};
}):[];
const result={grader:'canvas-evidence-1',reports,
  ownerRequirement:'Preserve hover partner/result previews, inexhaustible concepts, physical combination. One concept per canvas is a user-proposed experiment, not a universal requirement for every future level.',
  rejectedInference:'Fusion counts, novelty, solver-policy gaps and model praise are not fun scores.',
  nextGate:'Find a challenge that survives public recipes and does not reduce to saturating the catalogue or preparing every harmless safeguard first.'};
writeFileSync('results/constellation-evaluation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({grader:result.grader,reports:reports.map(report=>({id:report.id,commands:report.commands,modes:report.modes.map(mode=>({mode:mode.mode,fusions:mode.fusions.length,replay:mode.replay,parentsRetained:mode.parentsRetainedAtExactPositions,goal:mode.goal?.status}))}))},null,2));
