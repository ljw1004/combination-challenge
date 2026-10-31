import { CONCEPTS, RECIPES } from '../src/data.ts';
import { createState, pulseAt, replay, settledForecast, step } from '../src/engine.ts';
import type { Run, State } from '../src/engine.ts';

export interface Evidence {runId:string;turn:number;kind:'measurement'|'prediction'|'evaluator-interpretation';claim:string;}
export interface Card {criterion:string;status:'support'|'concern'|'unknown';evidence:Evidence[];counterevidence:Evidence[];nextTest:string;}
export interface Features {equivalentAlternatives?:number;distinctConsequences?:number;forcedChain?:boolean;repeatedEquivalentRepairs?:number;repeatedChangedContexts?:number;predictionHits?:number;predictionMisses?:number;randomWin?:boolean;discoveryEffects?:number;}
export const GRADER_VERSION='evidence-2';
/** Mechanical flags, deliberately kept separate from semantic judgments and enjoyment. */
export function gradeFeatures(f:Features,runId='fixture',turn=0):Card[]{
  const e=(claim:string,kind:Evidence['kind']='measurement'):Evidence=>({runId,turn,kind,claim});
  const choices=f.forcedChain||((f.equivalentAlternatives??0)>1&&(f.distinctConsequences??0)<2)?'concern':(f.distinctConsequences??0)>=2?'support':'unknown';
  return [
    {criterion:'consequential-choice',status:choices,evidence:choices==='unknown'?[]:[e(`Distinct inspected consequences: ${f.distinctConsequences??'unmeasured'}; equivalent alternatives: ${f.equivalentAlternatives??0}; forced chain: ${!!f.forcedChain}.`)],counterevidence:[],nextTest:'Branch two publicly plausible actions and inspect viable continuations; distinct states alone may be uninteresting.'},
    {criterion:'chore-burden',status:(f.repeatedEquivalentRepairs??0)>1||f.forcedChain?'concern':'unknown',evidence:(f.repeatedEquivalentRepairs??0)>1||f.forcedChain?[e(`Equivalent repair repeats: ${f.repeatedEquivalentRepairs??0}; forced chain: ${!!f.forcedChain}.`)]:[],counterevidence:(f.repeatedChangedContexts??0)>0?[e(`${f.repeatedChangedContexts} repetitions occurred in changed contexts and do not establish chores.`)]:[],nextTest:'Inspect repetitions for changed timing, location and purpose. Ask a person where play became work.'},
    {criterion:'readable-causality',status:(f.predictionMisses??0)>0?'concern':(f.predictionHits??0)>0?'support':'unknown',evidence:(f.predictionMisses??0)>0?[e(`${f.predictionMisses} checked damage predictions disagreed with the response.`,'prediction')]:(f.predictionHits??0)>0?[e(`${f.predictionHits} checked damage predictions matched.`,'prediction')]:[],counterevidence:[],nextTest:'Test a new arrangement without consulting the exact preview; correct preview copying is not demonstrated transfer.'},
    {criterion:'invention-effect',status:(f.discoveryEffects??0)>0?'support':'unknown',evidence:(f.discoveryEffects??0)>0?[e(`${f.discoveryEffects} invention actions immediately changed damage or flow relative to waiting.`)]:[],counterevidence:[],nextTest:'Inspect whether the effect changes a later decision rather than merely changing a number.'},
    {criterion:'skill-transfer',status:'unknown',evidence:[],counterevidence:f.randomWin?[e('A random policy won; mechanical completion alone does not establish skill.')]:[],nextTest:'Run matched fresh and tutorial-exposed players on an unseen encounter.'},
    {criterion:'human-enjoyment',status:'unknown',evidence:[],counterevidence:[],nextTest:'Observe 4–6 actual people, ask about enjoyment, and compare their experiences with these predictions.'},
  ];
}
export function analyzeRun(run:Run){
  const final=replay(run);let s=createState(run.scenario,run.seed,run.rules);let discoveryEffects=0,hits=0,misses=0,repeatedSameContext=0,changed=0;
  const repairs=new Map<string,number>();const contextualExamples:Evidence[]=[];
  const useful=new Set<string>();const discoveries:{id:string;turn:number;inputs:string[]}[]=[];
  let placements=0,instantRelief=0,unplacedDiscoveries=0,destroyed=0,waits=0,trailingWaits=0,manualWaits=0,automatedWaits=0;
  let earliestSafeCompletion:number|null=null;let actionsAfterSafeCompletion=0,nonWaitActionsAfterSafeCompletion=0;
  for(const d of run.decisions){
    const a=d.action;
    if(earliestSafeCompletion===null&&settledForecast(s).settled)earliestSafeCompletion=s.turn;
    if(earliestSafeCompletion!==null){actionsAfterSafeCompletion++;if(a.type!=='wait')nonWaitActionsAfterSafeCompletion++;}
    if(a.type==='wait'){waits++;trailingWaits++;if(d.input==='forecast')automatedWaits++;else manualWaits++;}else trailingWaits=0;
    const wait=s.status==='playing'?step(s,{type:'wait'}):null;const t=step(s,d.action);
    if(d.annotation?.expectedDamage){if(JSON.stringify(d.annotation.expectedDamage)===JSON.stringify(t.damage))hits++;else misses++;}
    if(a.type==='discover'){
      const chosen=RECIPES.find(r=>r.id===a.recipe)!;
      discoveries.push({id:chosen.output,turn:d.turn,inputs:chosen.inputs});
      if(!a.at)unplacedDiscoveries++;
      if(wait&&(JSON.stringify(wait.damage)!==JSON.stringify(t.damage)||JSON.stringify(wait.flow)!==JSON.stringify(t.flow)))discoveryEffects++;
    }
    for(const event of t.events){
      if(event.concept&&(event.amount??0)>0&&['flow','storage'].includes(event.kind))useful.add(event.concept);
      if(event.text.startsWith('Evaporated')&&a.type!=='wait'){
        const concept=a.type==='deploy'?a.concept:RECIPES.find(r=>r.id===a.recipe)!.output;useful.add(concept);
      }
    }
    if(a.type!=='wait'&&a.at){
      placements++;const id=a.type==='deploy'?a.concept:RECIPES.find(r=>r.id===a.recipe)!.output;
      if(CONCEPTS[id].effect==='evaporate')instantRelief++;
      // Candidate repeated repair only: equal command, target, pulse and local structure. Health changes are deliberately reported as a limitation.
      const p=a.at;const c=s.cells.find(c=>c.row===p.row&&c.col===p.col)!;
      const wave=pulseAt(s);
      const key=JSON.stringify({id,p,wave,local:c.structure});
      if(repairs.has(key)){repeatedSameContext++;contextualExamples.push({runId:run.id,turn:d.turn,kind:'evaluator-interpretation',claim:`Repair candidate repeats turn ${repairs.get(key)} with same target, rainfall and local structure; global health and future differ.`});}
      else if(run.decisions.slice(0,d.turn).some(x=>x.action.type==='deploy'&&x.action.concept===id))changed++;
      repairs.set(key,d.turn);
    }
    destroyed+=t.events.filter(e=>e.kind==='destroyed').length;s=t.state;
  }
  for(const discovery of [...discoveries].reverse())if(useful.has(discovery.id))for(const input of discovery.inputs)useful.add(input);
  const unusedDiscoveries=discoveries.filter(d=>!useful.has(d.id)).map(({id,turn})=>({id,turn}));
  const features:Features={predictionHits:hits,predictionMisses:misses,discoveryEffects,randomWin:run.player==='random'&&final.status==='won',repeatedChangedContexts:changed};
  // Repetition candidates do not automatically become a confirmed chore judgment.
  const cards=gradeFeatures(features,run.id);cards.find(c=>c.criterion==='chore-burden')!.counterevidence.push(...contextualExamples.slice(0,3));
  return {runId:run.id,grader:GRADER_VERSION,outcome:final.status,turns:final.turn,health:final.health,discoveries:final.known.length-6,unusedDiscoveries,earliestSafeCompletion,actionsAfterSafeCompletion,nonWaitActionsAfterSafeCompletion,placements,instantRelief,unplacedDiscoveries,destroyed,waits,manualWaits,automatedWaits,trailingWaits,repeatedRepairCandidates:repeatedSameContext,features,cards};
}
export function runGraderFixtures(){
  const fixtures:{name:string;features:Features;criterion:string;expected:Card['status']}[]=[
    {name:'cosmetic diversity',features:{equivalentAlternatives:12,distinctConsequences:1},criterion:'consequential-choice',expected:'concern'},
    {name:'forced chain',features:{forcedChain:true,discoveryEffects:10},criterion:'consequential-choice',expected:'concern'},
    {name:'successful maintenance',features:{repeatedEquivalentRepairs:8},criterion:'chore-burden',expected:'concern'},
    {name:'lucky random win',features:{randomWin:true},criterion:'skill-transfer',expected:'unknown'},
    {name:'eloquent wrong prediction',features:{predictionMisses:1},criterion:'readable-causality',expected:'concern'},
    {name:'unannotated useful invention',features:{discoveryEffects:1},criterion:'invention-effect',expected:'support'},
    {name:'same tool changed contexts',features:{repeatedChangedContexts:6},criterion:'chore-burden',expected:'unknown'},
    {name:'many wins no humans',features:{predictionHits:100,distinctConsequences:20},criterion:'human-enjoyment',expected:'unknown'},
  ];return fixtures.map(f=>{const actual=gradeFeatures(f.features).find(c=>c.criterion===f.criterion)!.status;return {name:f.name,expected:f.expected,actual,pass:actual===f.expected};});
}
