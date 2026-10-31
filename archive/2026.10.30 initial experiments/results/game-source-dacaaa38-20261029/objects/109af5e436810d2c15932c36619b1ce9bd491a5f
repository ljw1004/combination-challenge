import {scenario as reviewed} from './atlas-civilization-reviewed.ts';
/** Presentation-only final identity. Frozen original/reviewed modules stay exact. */
export const scenario=structuredClone(reviewed);
scenario.id='atlas-civilization-locations-v4';
scenario.title='Atlas of Questions';
for(const id of ['atlas-civilization-civic-rule','atlas-civilization-law-status','atlas-civilization-consent-rule','atlas-civilization-freedom-empire']){
 const location=scenario.locationPlan!.locations.find(l=>l.id===id)!;
 if(location.background.asset)throw Error('Unexpected pre-existing civic artwork '+id);
 location.background.asset='/assets/locations/'+id+'.webp';
}
scenario.notes!.push('Final distinct location presentation: four individually generated and inspected civic-desk backgrounds. No labels, tasks, recipes, lifecycles, stock, carry, chronology or source references changed from the independently reviewed source successor.');
