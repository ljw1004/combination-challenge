/** One bounded Elements successor; all 56 published identities remain exact. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-journey-cleanup-scenarios.ts';
import {elements} from './stories/elements-journey-cleanup-v2.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const cadenceSuccessorScenarios=previous.cadenceSuccessorScenarios;
export const authenticitySuccessorScenarios=previous.authenticitySuccessorScenarios;
export const journeyCleanupSuccessorScenarios:Scenario[]=[elements];
export const integratedScenarios:Scenario[]=previous.integratedScenarios.map(s=>s.id==='elements-material-repairs-v6'?elements:s);
export const optionalIntellectualScenarios=previous.optionalIntellectualScenarios;
export const intellectualWorldScenarios=previous.intellectualWorldScenarios;
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const scenarios:Scenario[]=[...previous.scenarios,elements];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(s.id==='elements-material-repairs-v6')return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete earlier material-repair edition with its original route and saved progress preserved. The featured journey cleanup is a distinct edition.'};
 if(s.id===elements.id)return {title:s.title,premise:'Thirty river-valley places connect useful creations without forced map compilations or a chest promotion: build crossings, schedule return boats, observe stars and gather by lantern light.'};
 return previous.presentationFor(s);
};
