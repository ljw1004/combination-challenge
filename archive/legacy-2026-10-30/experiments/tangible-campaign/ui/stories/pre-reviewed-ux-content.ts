/** Explicit composition of the 29 October playtest changes. Frozen authored
 * modules remain intact; graph/session editions have new identities. */
import type {Scenario} from '../../schema/campaign.ts';
import {elements as waterworks} from './elements-waterworks-v1.ts';
import {withElementsBasketContinuity} from './elements-basket-continuity-v1.ts';
import {mars as previousMars} from './authenticity-repairs-v2.ts';
import {scenario as previousCreature} from './mars-creature-field-scenes.ts';
import {withMarsWaterAndVestibule} from './mars-water-vestibule.ts';
import {withMarsHabitatRooms} from './mars-habitat-rooms.ts';
import {withMarsPurposefulSurvey} from './mars-purposeful-survey.ts';
import {scenario as focusedAtlas} from './atlas-focused-sessions.ts';
import {scenario as focusedFood} from './food-small-sessions-v1.ts';
import {scenario as previousDivinity} from './divinity-final-reading-scenes.ts';
import {scenario as previousLight} from './divinity-light-reading-scenes.ts';
import {scenario as previousCopy} from './copy-workroom-locations.ts';
import {withAtlasSeaTrialRecord} from './atlas-sea-trial-record.ts';
import {withPlainCalibration} from './plain-calibration.ts';
import {withPlainLanguage} from './plain-language-content.ts';
/** Opt-in affects fresh location entry, never restored coordinates/history. */
function entryLayout(s:Scenario):Scenario{if(s.locationPlan)s.locationPlan.entryLayout='weighted-third';return s;}
function marsRooms(s:Scenario,id:string):Scenario{
 const next=withMarsPurposefulSurvey(withMarsHabitatRooms(withMarsWaterAndVestibule(s,id),id),id);
 const orbital=next.locationPlan!.locations.find(l=>l.id==='M18');if(!orbital)throw Error('Missing orbital receiving location');
 orbital.background={...orbital.background,stableKey:'M18-orbital-approach-v1',asset:'/assets/locations/M18-orbital-approach-v1.webp',sceneBrief:'Outside an orbital receiving station above Mars: closed receiving collar and hatch, solar wings, open approach space. No approaching or already docked ship, no interior corridor.'};
 return next;
}
export const elements=entryLayout(withPlainCalibration(withPlainLanguage(withElementsBasketContinuity(waterworks),'elements'),'elements'));
export const mars=entryLayout(withPlainCalibration(withPlainLanguage(marsRooms(previousMars,'mars-purposeful-fieldwork-v8'),'mars'),'mars'));
export const creature=entryLayout(withPlainCalibration(withPlainLanguage(marsRooms(previousCreature,'mars-creature-plain-v4'),'creature'),'creature'));
export const atlas=entryLayout(withPlainCalibration(withAtlasSeaTrialRecord(withPlainLanguage(focusedAtlas,'atlas')),'atlas'));
export const kitchen=entryLayout(withPlainCalibration(withPlainLanguage(focusedFood,'kitchen'),'kitchen'));
/** These three preserve save identity: graph, item/recipe/goal/location IDs,
 * carry, stock and checkpoint predicates unchanged. See compatibility tests. */
export const divinity=entryLayout(withPlainCalibration(withPlainLanguage(previousDivinity,'divinity'),'divinity'));
export const light=entryLayout(withPlainCalibration(withPlainLanguage(previousLight,'light'),'light'));
export const copy=entryLayout(withPlainCalibration(withPlainLanguage(previousCopy,'copy'),'copy'));
export const graphSuccessors:Scenario[]=[elements,mars,kitchen,atlas];
export const editorialSuccessors:Scenario[]=[divinity,light,copy];
export const currentFamilies:Scenario[]=[mars,atlas,elements,kitchen,copy,divinity,light,creature];
