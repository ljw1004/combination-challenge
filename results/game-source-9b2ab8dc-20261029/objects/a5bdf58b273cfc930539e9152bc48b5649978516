/** One bounded waterworks successor; all 57 published identities remain exact. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-waterworks-scenarios.ts';
import {elements} from './stories/elements-waterworks-v1.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const cadenceSuccessorScenarios=previous.cadenceSuccessorScenarios;
export const authenticitySuccessorScenarios=previous.authenticitySuccessorScenarios;
export const journeyCleanupSuccessorScenarios=previous.journeyCleanupSuccessorScenarios;
export const waterworksSuccessorScenarios:Scenario[]=[elements];
export const integratedScenarios:Scenario[]=previous.integratedScenarios.map(s=>s.id==='elements-journey-cleanup-v8'?elements:s);
export const optionalIntellectualScenarios=previous.optionalIntellectualScenarios;
export const intellectualWorldScenarios=previous.intellectualWorldScenarios;
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const scenarios:Scenario[]=[...previous.scenarios,elements];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(s.id==='elements-journey-cleanup-v8')return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete earlier journey-cleanup edition with its original waterworks, route and saved progress preserved. The featured water-lifting edition is a distinct journey.'};
 if(s.id===elements.id)return {title:s.title,premise:'Thirty river-valley places connect useful creations. Fit earned glazed jars to a waterwheel to lift stream water into the garden basin, without a generic pump detour.'};
 return previous.presentationFor(s);
};
