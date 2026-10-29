import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import * as M from '../engine/model.ts';
import {routeSpecs,routeActions,scenarioFor,auditRoute,digest,evidenceRoot,sourceManifest} from './reviewed-routes.ts';
const runtimeSha256=digest(readFileSync(new URL('../engine/model.ts',import.meta.url)));
const selected=new Set(process.argv.slice(2));
for(const spec of routeSpecs.filter(s=>!selected.size||selected.has(s.key))){
 const s=scenarioFor(spec.key),actions=routeActions(spec.source),audit=auditRoute(s,actions);
 if(!audit.game.state.completed||audit.missing.length)throw Error(s.id+' incomplete/disconnected '+audit.missing);
 const report={scenario:s.id,title:s.title,kind:'Current event-local integration replay of documented author witness; not a fresh/human/browser playtest',baseCommit:sourceManifest.scenarioRevisionBases?.[spec.key]??sourceManifest.baseCommit,sourceWitness:spec.source,sourceWitnessSha256:digest(readFileSync(new URL('sources/'+spec.source,evidenceRoot))),sourceScenario:sourceManifest.scenarioSources[spec.key],runtimeSha256,combinations:audit.game.state.metrics.combinations,actions:actions.length,actionsLog:actions,completed:true,metrics:audit.game.state.metrics,recipesTotal:s.recipes.length,stages:s.stages.length,stageEntries:audit.stageEntries,goalContinuity:audit.rows,checkpoints:(s.checkpoints??[]).map(c=>{const g=M.checkpoint(s,c.id);return {id:c.id,actionPrefixLength:c.actions.length,stageIndex:g.state.stage,completed:g.state.completed,stateSha256:digest(JSON.stringify(g.state))};}),limits:['Only these documented routes are replayed; no exhaustive whole-campaign route claim.','Native/browser layout, touch and human enjoyment QA remain pending.',sourceManifest.integrationNotes?.[spec.key]??(spec.key==='purpose'?'Riverside has route-earned scene-entry and complete debug checkpoints; authored candidate fields otherwise exact. Chooser-only presentation override is recorded separately.':'Mars has a recorded carrier presentation-only patch; Atlas has route-earned debug checkpoints added. All other candidate fields are structurally exact.')]};
 writeFileSync(new URL('../evidence/'+s.id+'-route-evidence.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(s.id,report.combinations,'combinations;',audit.rows.length-1,'later goal-connected chapters;',report.checkpoints.length,'authored checkpoints');
}
