import type {Scenario} from '../../schema/scenario.ts';
import {scenario as originalAtlas} from './atlas.ts';
/** The complete before-repair Atlas remains exact at its original world/save identity. */
export const milestoneAtlasPredecessorScenarios: Scenario[] = [originalAtlas];
