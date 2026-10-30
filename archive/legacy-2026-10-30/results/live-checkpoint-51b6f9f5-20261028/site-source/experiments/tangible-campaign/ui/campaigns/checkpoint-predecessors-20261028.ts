import type {Scenario} from '../../schema/scenario.ts';
import {scenario as riverside} from './purpose.ts';
import {scenario as doctrineTenDesks} from './doctrine-ten-desks.ts';

/** Exact live human-checkpoint content retained at its original direct route and save identity. */
export const checkpointPredecessorScenarios: Scenario[] = [doctrineTenDesks, riverside];
