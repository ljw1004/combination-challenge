import type {Scenario} from '../schema/campaign.ts';
import * as current from './current-scenarios.ts';
/** Generic page-level launch data; the canonical controller and engine are shared.
 * Optional entries configure this before dynamically importing campaign-main. */
export type CampaignPageCatalogue={scenarios:readonly Scenario[];featuredScenarioIds:readonly string[];presentationFor:(s:Scenario)=>{title:string;premise:string}};
export let scenarios=current.scenarios;
export let featuredScenarioIds=current.featuredScenarioIds;
export let presentationFor=current.presentationFor;
let configured=false;
export function configureCampaignPage(catalogue:CampaignPageCatalogue):void{
 if(configured)throw Error('Campaign page catalogue is already configured');
 const ids=catalogue.scenarios.map(s=>s.id);
 if(!ids.length||new Set(ids).size!==ids.length||catalogue.featuredScenarioIds.some(id=>!ids.includes(id)))throw Error('Invalid campaign page catalogue');
 scenarios=[...catalogue.scenarios];featuredScenarioIds=[...catalogue.featuredScenarioIds];presentationFor=catalogue.presentationFor;configured=true;
}
