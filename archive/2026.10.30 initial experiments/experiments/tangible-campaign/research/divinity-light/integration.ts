import type {Scenario} from '../../schema/scenario.ts';
import {scenario} from '../../ui/campaigns/divinity-light-guide.ts';
/** Additive descriptor for the root integrator. No inherited registry or scenario is mutated. */
export const divinityLightIntegration = {
  scenario,
  worldId: scenario.id,
  route: '/campaign.html?world='+scenario.id,
  presentation: {
    title: 'Divinity-light · Stories, Questions, and Life Together',
    premise: 'Independent educational guide · grades 8–12 · eight connected desks; Gospel reading, history, faith and reason, dialogue, and social action. Not a full course or school-approved material.',
  },
  placement: 'separate-educational-guide',
  replaces: [] as string[],
  inheritedSourceManifestSha256: '97f0c2fc2b1c422b7079980353ba6ea58c77042c2c4a568f8b136d9f8174fe83',
} as const;
export function withDivinityLight(catalog:Scenario[]):Scenario[]{
  if(catalog.some(s=>s.id===scenario.id))throw Error('Divinity-light already registered; do not duplicate or silently replace.');
  return [...catalog,scenario];
}
