import type {Scenario} from '../../schema/scenario.ts';
import {scenario as playedFood} from './food.ts';
import {scenario as priorElements} from './elements-opening-wheel.ts';
import {scenario as atlasMiniature} from './atlas-miniature-research.ts';
/** Exact enjoyed Food predecessor and optional Atlas miniature: neither adds a featured focus. */
export const kitchenAtlasAdditionalScenarios: Scenario[] = [playedFood, priorElements, atlasMiniature];
