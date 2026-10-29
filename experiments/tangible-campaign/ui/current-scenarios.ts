/** Current location successors; every pre-location object and save identity remains registered. */
import type {Scenario} from '../schema/campaign.ts';
import * as previous from './pre-location-scenarios.ts';
import {scenario as mars} from './stories/mars-locations.ts';
import {scenario as elementsV2} from './stories/elements-locations.ts';
import {scenario as elements} from './stories/elements-small-scenes.ts';
import {scenario as kitchen} from './stories/kitchen-locations.ts';
import {scenario as copy} from './stories/copy-workroom-locations.ts';
import {atlasLocations as atlas,divinityLocations as divinity,lightLocations as light} from './stories/intellectual-locations.ts';
export const c85Scenarios=previous.c85Scenarios;
export const intellectualWorldPredecessorScenarios=previous.intellectualWorldPredecessorScenarios;
export const integratedScenarios:Scenario[]=[mars,atlas,elements,kitchen,copy,divinity];
export const optionalIntellectualScenarios:Scenario[]=[light];
export const intellectualWorldScenarios:Scenario[]=[atlas,divinity,light];
export const locationSuccessorScenarios:Scenario[]=[...integratedScenarios,...optionalIntellectualScenarios];
export const scenarios:Scenario[]=[...previous.scenarios,elementsV2,...locationSuccessorScenarios];
export const featuredScenarioIds=integratedScenarios.map(s=>s.id);
const formerCurrent=new Set([...previous.integratedScenarios,...previous.optionalIntellectualScenarios].map(s=>s.id));
/** Chooser labels alone change. Old titles, content, URLs and progress never do. */
export const presentationFor=(s:Scenario):{title:string;premise:string}=>{
 if(s.id===elementsV2.id)return {title:'Snapshot: '+s.title,premise:'The complete eight-location version, with its original progress preserved. The featured opening now visits four distinct river-valley places.'};
 if(formerCurrent.has(s.id))return {title:'Snapshot: '+previous.presentationFor(s).title,premise:'The complete pre-artwork version, with its original progress and chapter layout preserved. The featured location version is a separate journey.'};
 if(s.id===mars.id)return {title:s.title,premise:'Return from Mars through eighteen continuing places. Recover a crew, test the field evidence and build the means to come home.'};
 if(s.id===atlas.id)return {title:s.title,premise:'A journey through instruments, arguments and contested ideas. Work at continuing desks and carry their questions into the next setting.'};
 if(s.id===elements.id)return {title:s.title,premise:'Follow materials through distinct river-valley places. The opening restores a small relevant working set, with earlier creations still in their own places.'};
 if(s.id===kitchen.id)return {title:'From Hearth to Supper · The Kitchen Caravan',premise:'Twenty chapters across ten real workstations. Bring earlier preparations into supper and provisions for the departing train.'};
 if(s.id===copy.id)return {title:'Why This Boat? · The Copy Workroom',premise:'Make a master, then try its forms on the display bench and at the printing press. A short story about purpose and copies.'};
 if(s.id===divinity.id)return {title:'Divinity: Disputed Questions',premise:'Reconstruct arguments through concrete cases at six continuing reading tables. Carry distinctions forward and leave genuine disagreements open.'};
 if(s.id===light.id)return {title:'Divinity-light · Optional experiment: Who Is Still Outside?',premise:'A separate, short Gospel-and-print workshop. Four panels share one exhibition table; their source keeps challenging the headline.'};
 return previous.presentationFor(s);
};
