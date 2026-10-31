import type {Scenario} from '../../schema/scenario.ts';
import {scenario} from '../../ui/campaigns/divinity-light-text-workshop.ts';
/** Add only this successor for the proposed human checkpoint; broad v1 remains diagnostic. */
export const divinityLightTextWorkshopIntegration = {
 scenario,
 worldId: scenario.id,
 proposedRoute: '/campaign.html?world='+scenario.id,
 presentation: {title:'Divinity-light · Who Is Still Outside?',premise:'A small Gospel-and-print workshop for curious students. Follow changed questions, repeated gestures, different voices, and a source that challenges a headline. Independent experiment, not school-approved material.'},
 replaces: [] as string[],
 inheritedSourceManifestSha256:'97f0c2fc2b1c422b7079980353ba6ea58c77042c2c4a568f8b136d9f8174fe83',
} as const;
export function withDivinityLightTextWorkshop(catalog:Scenario[]):Scenario[]{if(catalog.some(s=>s.id===scenario.id))throw Error('Already registered: do not duplicate or silently replace.');return [...catalog,scenario];}
