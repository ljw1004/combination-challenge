/** Three reviewed authenticity editions; all 53 published identities remain exact. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-authenticity-scenarios.ts';
import {mars,atlas,elements,authenticitySuccessors} from './stories/authenticity-repairs-v2.ts';
import {scenario as divinity} from './stories/divinity-final-reading-scenes.ts';
import {scenario as light} from './stories/divinity-light-reading-scenes.ts';
import {scenario as kitchen} from './stories/kitchen-locations.ts';
import {scenario as copy} from './stories/copy-workroom-locations.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const cadenceSuccessorScenarios=previous.cadenceSuccessorScenarios;
export const authenticitySuccessorScenarios:Scenario[]=authenticitySuccessors;
export const integratedScenarios:Scenario[]=[mars,atlas,elements,kitchen,copy,divinity];
export const optionalIntellectualScenarios:Scenario[]=[light];
export const intellectualWorldScenarios:Scenario[]=[atlas,divinity,light];
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const scenarios:Scenario[]=[...previous.scenarios,...authenticitySuccessorScenarios];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
const superseded=new Set<string>(authenticitySuccessorScenarios.map(s=>s.id.startsWith('mars-')?'mars-field-scenes-v6':s.id.startsWith('atlas-')?'atlas-civilization-locations-v4':'elements-river-scenes-v4'));
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(superseded.has(s.id))return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete earlier location edition with its original content, route and saved progress preserved. The featured repair edition is a separate journey.'};
 if(s.id===mars.id)return {title:s.title,premise:'The connected field-work journey now keeps basin observations with their actual evidence. The earlier ice photograph remains a separate return-archive record.'};
 if(s.id===atlas.id)return {title:s.title,premise:'Thirty-four reading stations connect instruments, arguments and civic authority. Inherited variation and limited resources remain distinct from the evidence of reproductive outcomes.'};
 if(s.id===elements.id)return {title:s.title,premise:'Thirty river-valley places connect useful material discoveries: a built seed press, fired liquid-holding bowl, oil-wick light and honest relative rain observations.'};
 return previous.presentationFor(s);
};
