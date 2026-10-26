/** Interaction evidence only: direct input, disclosure, continuity and specific failures. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { replayTable } from '../src/workbench-model.ts';
import type { TableCapture } from '../src/workbench-model.ts';

const base='results/gesture-players';
const reports=existsSync(base)?readdirSync(base).filter(id=>id.startsWith('touch-')&&existsSync(`${base}/${id}/run.json`)).map(id=>{
  const capture=JSON.parse(readFileSync(`${base}/${id}/run.json`,'utf8')) as TableCapture;
  const commands=JSON.parse(readFileSync(`${base}/${id}/commands.json`,'utf8')) as {commands:{command:string;visibleText:string}[]};
  const final=replayTable(capture);let previousResult:string|undefined;let reusedResult=0;const mixtures:{decision:number;inputs:string[];output:string;position:{x:number;y:number}}[]=[];
  for(let index=0;index<capture.decisions.length;index++){
    const d=capture.decisions[index];if(d.action.type!=='mix'&&d.action.type!=='mix-from-shelf')continue;
    const before=replayTable({...capture,decisions:capture.decisions.slice(0,index)});
    const after=replayTable({...capture,decisions:capture.decisions.slice(0,index+1)});
    const a=d.action;
    const ids=a.type==='mix'?[a.first,a.second]:[a.target];
    if(previousResult&&ids.includes(previousResult))reusedResult++;
    const inputs=a.type==='mix'?ids.map(piece=>before.pieces.find(p=>p.id===piece)!.concept):[a.concept,before.pieces.find(p=>p.id===a.target)!.concept];
    const result=after.pieces.find(p=>p.id===after.lastResult?.pieceId)!;
    previousResult=result.id;mixtures.push({decision:index,inputs,output:result.concept,position:{x:result.x,y:result.y}});
  }
  const fusionEvents=capture.interactions.filter(e=>e.kind==='fusion');
  const previews=capture.interactions.filter(e=>e.kind==='contact-preview');
  return {id,interface:capture.uiVersion??'contact-1 (inferred from saved screens; original capture lacked interface field)',commands:commands.commands.length,mixes:final.mixes,newConcepts:final.known.length-6,reusedPreviousPhysicalResult:reusedResult,mixtures,recordedFusionEvents:fusionEvents.length,recordedContactPreviews:previews.length,dropOutsideWorkspace:capture.interactions.filter(e=>e.kind==='drop'&&e.inWorkspace===false).length,
    replay:'pass',source:`${base}/${id}/run.json`,screenCommands:`${base}/${id}/commands.json`,
    cards:[{criterion:'player-performed-combination',status:mixtures.length>0&&fusionEvents.length===mixtures.length?'support':'unknown',claim:'Real pointer/key command captures and matching ingredient fusion events; not output-menu selection.',limitation:'Instruction-based isolation. Event counts alone do not prove satisfying handling.'},
      {criterion:'result-can-be-reused',status:reusedResult>0?'support':'unknown',claim:`${reusedResult} mixtures use the preceding actual result object.`,limitation:'Reuse may be rote; the count is continuity evidence, not strategic depth.'},
      {criterion:'surrounding-challenge',status:'unknown',claim:'This table intentionally isolates handling; no completion challenge is currently present.'},
      {criterion:'human-visceral-enjoyment',status:'unknown',claim:'Agents and screenshots cannot establish physical satisfaction for a person.'}],
  };
}):[];
const result={grader:'gesture-evidence-1',reports,
  humanReview:{source:'Direct owner feedback in this conversation after using the new table',people:1,recruitedStudy:false,feedback:[
    {feature:'hover reveals compatible partners and results',judgment:'positive',reportedBenefit:'Removes the low-level search for an authored ontology and makes possibilities available for informed play.'},
    {feature:'results appear on other icons',judgment:'minor confusion',priority:'Owner explicitly deferred small placement details.'},
    {principle:'Every legal combination/result may be inspectable; intellectual or skill challenge belongs above that information.',judgment:'explicit design requirement'},
  ]},
  disagreement:{agentReport:'touch-a found pervasive result labels too directive and later play rote.',humanReport:'Owner found those same hover results enabling and wanted to retain them.',decision:'Preserve hover partner/result disclosure. Cancel its queued removal. Fix specific false affordances separately.',limitation:'One owner review is not a population preference or complete-game enjoyment validation.'},
  nextGate:'With combinations inspectable, test a surrounding challenge that still requires a worthwhile decision or skill. Keep the actual combining gesture as the player action.',
  forbiddenInference:'More fusions, discoveries, pointer motion, model praise or passing browser tests do not establish fun.',
};
writeFileSync('results/gesture-evaluation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({grader:result.grader,reports:reports.map(({id,interface:ui,mixes,recordedFusionEvents,reusedPreviousPhysicalResult,replay})=>({id,ui,mixes,recordedFusionEvents,reusedPreviousPhysicalResult,replay})),humanReviewPeople:1,decision:result.disagreement.decision},null,2));
