/** 57 published identities retained; four structural successors. Three proven
 * editorial replacements preserve identity and saved positions, not raw prose. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-waterworks-scenarios.ts';
import {elements as stagedWaterworks} from './stories/elements-waterworks-v1.ts';
import {mars,atlas,elements,kitchen,copy,divinity,light,graphSuccessors,editorialSuccessors} from './stories/current-ux-content.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const cadenceSuccessorScenarios=previous.cadenceSuccessorScenarios;
export const authenticitySuccessorScenarios=previous.authenticitySuccessorScenarios;
export const journeyCleanupSuccessorScenarios=previous.journeyCleanupSuccessorScenarios;
/** Retained unpublished source/evidence, not an additional chooser edition. */
export const waterworksSuccessorScenarios:Scenario[]=[stagedWaterworks];
export const uxContentSuccessorScenarios=graphSuccessors;
export const editorialScenarioUpdates=editorialSuccessors;
export const expectedCurrentScenario=(s:Scenario):Scenario=>editorialSuccessors.find(n=>n.id===s.id)??s;
export const integratedScenarios:Scenario[]=[mars,atlas,elements,kitchen,copy,divinity];
export const optionalIntellectualScenarios:Scenario[]=[light];
export const intellectualWorldScenarios:Scenario[]=[atlas,divinity,light];
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const scenarios:Scenario[]=[...previous.scenarios.map(expectedCurrentScenario),...graphSuccessors];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
const superseded=new Set(previous.integratedScenarios.filter(s=>!featuredScenarioIds.includes(s.id)).map(s=>s.id));
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(superseded.has(s.id))return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete earlier edition, with its route and saved progress preserved. The featured smaller-session journey has a separate save.'};
 if(locationSuccessorScenarios.some(n=>n.id===s.id))return {title:s.title,premise:s.premise};
 return previous.presentationFor(s);
};
