/** @deprecated V1 catalogue façade for saved/frozen logical clients only.
 * Current UI, new stories and new tools use current-scenarios.ts. No rules or
 * independently authored current content live in this adapter. */
import * as current from './current-scenarios.ts';
import {fromLegacyScenario,toLegacyScenario} from '../compatibility/v1.ts';
import type {Scenario} from '../schema/scenario.ts';
export const c85Scenarios=current.c85Scenarios.map(toLegacyScenario);
export const intellectualWorldPredecessorScenarios=current.intellectualWorldPredecessorScenarios.map(toLegacyScenario);
export const optionalIntellectualScenarios=current.optionalIntellectualScenarios.map(toLegacyScenario);
export const intellectualWorldScenarios=current.intellectualWorldScenarios.map(toLegacyScenario);
export const integratedScenarios=current.integratedScenarios.map(toLegacyScenario);
export const scenarios=current.scenarios.map(toLegacyScenario);
export const featuredScenarioIds=current.featuredScenarioIds;
export const presentationFor=(s:Scenario)=>current.presentationFor(fromLegacyScenario(s));
