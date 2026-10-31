/** Distinct cadence editions; all 48 published identities remain registered. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-cadence-scenarios.ts';
import {scenario as mars} from './stories/mars-field-scenes.ts';
import {scenario as elements} from './stories/elements-river-scenes.ts';
import {scenario as atlas} from './stories/atlas-civilization-locations.ts';
import {scenario as divinity} from './stories/divinity-final-reading-scenes.ts';
import {scenario as light} from './stories/divinity-light-reading-scenes.ts';
import {scenario as kitchen} from './stories/kitchen-locations.ts';
import {scenario as copy} from './stories/copy-workroom-locations.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const integratedScenarios:Scenario[]=[mars,atlas,elements,kitchen,copy,divinity];
export const optionalIntellectualScenarios:Scenario[]=[light];
export const intellectualWorldScenarios:Scenario[]=[atlas,divinity,light];
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const cadenceSuccessorScenarios:Scenario[]=[mars,atlas,elements,divinity,light];
export const scenarios:Scenario[]=[...previous.scenarios,...cadenceSuccessorScenarios];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
const formerFeatured=new Set([...previous.integratedScenarios,...previous.optionalIntellectualScenarios].filter(s=>!locationSuccessorScenarios.some(n=>n.id===s.id)).map(s=>s.id));
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(formerFeatured.has(s.id))return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete earlier location edition, with its original route and saved progress preserved. The featured cadence edition is a separate journey.'};
 if(s.id===mars.id)return {title:s.title,premise:'A connected survival journey through distinct field-work stations. Useful equipment travels; earlier creations stay in their own places.'};
 if(s.id===elements.id)return {title:s.title,premise:'Thirty river-valley places and later services restore smaller relevant working sets, while earlier inventions remain tangible.'};
 if(s.id===atlas.id)return {title:s.title,premise:'Thirty-four reading stations connect instruments, arguments, civic authority and contested ideas. Their comparisons retain sources, unresolved alternatives and earlier questions.'};
 if(s.id===divinity.id)return {title:'Divinity: Disputed Questions',premise:'Fourteen distinct reading desks use clearer labels and concrete cases, retaining attribution and substantive disagreements.'};
 if(s.id===light.id)return {title:'Divinity-light · Optional experiment: Who Is Still Outside?',premise:'Four reading and production stations in one exhibition workshop. Sources keep challenging the headline.'};
 return previous.presentationFor(s);
};
