import {scenarios as legacyScenarios} from './legacy-scenarios.ts';
import {scenario as mars} from './campaigns/mars-return-cargo.ts';
import {scenario as elements} from './campaigns/elements.ts';
import {scenario as food} from './campaigns/food.ts';
import {scenario as atlas} from './campaigns/atlas.ts';
import {scenario as purpose} from './campaigns/purpose-copy-workroom.ts';
import {scenario as doctrine} from './campaigns/doctrine-images-cases.ts';
import {predecessorScenarios} from './campaigns/predecessors-20261028.ts';
import {checkpointPredecessorScenarios} from './campaigns/checkpoint-predecessors-20261028.ts';
import type {Scenario} from '../schema/scenario.ts';

/** Legacy records are not rewritten or migrated: original direct routes and save keys survive. */
export const integratedScenarios: Scenario[] = [mars, atlas, elements, food, purpose, doctrine];
export const scenarios: Scenario[] = [...legacyScenarios, ...predecessorScenarios, ...checkpointPredecessorScenarios, ...integratedScenarios];
export const featuredScenarioIds = [mars.id, atlas.id, elements.id, food.id, purpose.id, doctrine.id];
/** Chooser-only labels: preserve every prototype's actual title and exact scenario data. */
export const presentationFor = (s: Scenario) => s.id === purpose.id
 ? {title: 'Why This Boat? · The Copy Workroom', premise: 'Short research experiment · make one master, then choose forms for a display and a printing commission.'}
 : s.id === 'causation-accidental-bell-probe-v1'
 ? {title: 'Why This Boat? · The Riverside Workshop', premise: 'Short research prototype · turn an accidental sound into a deliberate call signal.'}
 : s.id === 'causation-fitting-forms-probe-v2'
 ? {title: 'Why This Boat? · Purpose workshop', premise: 'Short research prototype · two scenes, not a full game. Try different forms for carrying stone and separating gravel.'}
 : s.id === doctrine.id
 ? {title: 'Doctrine: Grace and Matter · Images and Relics', premise: 'Human checkpoint · ten continuing desks plus two experimental image and relic cases.'}
 : {title: s.title, premise: s.premise};
