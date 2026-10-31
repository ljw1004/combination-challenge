import type {Scenario} from '../../schema/scenario.ts';
import {scenario as elements} from './elements.ts';
import {scenario as doctrine} from './doctrine-images-cases.ts';
/** Exact live51 worlds retained without route/save migration. */
export const arrivalContentPredecessorScenarios: Scenario[] = [elements, doctrine];
