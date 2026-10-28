import type {Action, Recipe, Scenario} from '../../schema/scenario.ts';
import {scenario as openingWheel} from './elements-opening-wheel.ts';

/** Structural successor: earlier routes and save identities stay untouched. */
export const scenario: Scenario = structuredClone(openingWheel);
scenario.id = 'elements-house-components-v1';

const house = scenario.items.find(item => item.id === 'house')!;
house.description = 'A small weatherproof home with solid walls and a timber roof. A window admits daylight; a sleeping mat makes a place to rest. A stone hearth can warm the room.';
house.capabilities = ['furnished-shelter'];
house.slots = [
  {id: 'window', accepts: ['window'], required: true, grants: {window: ['daylit-shelter']}},
  {id: 'sleeping-mat', accepts: ['sleeping-mat'], required: true, grants: {'sleeping-mat': ['restful-shelter']}},
  {id: 'hearth', accepts: ['hearth'], required: false, grants: {hearth: ['warm-shelter']}},
];
scenario.items.push({
  id: 'hearth', label: 'Hearth',
  description: 'A stone-lined place for a small warming fire.',
  caveat: 'Storybook craft compression, not instructions for building or using an indoor fire.',
});

const install = (component: string, description: string): Recipe => ({
  id: `fit-house-${component}`, a: component, b: 'house',
  install: {target: 'house', slot: component, component}, description,
  lifecycle: {
    [component]: {role: 'incorporate', reason: 'This component is fitted into the same house; keep an outside supply only if another authored use still needs it.'},
    house: {role: 'retain', reason: 'Fitting the component keeps the same house and every part already installed.'},
  },
});
scenario.recipes.push(
  install('sleeping-mat', 'The sleeping mat lies inside the house, ready for the night.'),
  {
    id: 'hearth', a: 'stone', b: 'fire', out: 'hearth',
    description: 'Stone contains a small warming fire.',
    lifecycle: {
      stone: {role: 'incorporate', reason: 'Stone lines the hearth; retain an outside supply while other authored building and grinding uses need it.'},
      fire: {role: 'retain', reason: 'The continuing source of heat remains available for cooking and firing.'},
    },
  },
  install('hearth', 'The hearth warms the house without replacing its window or sleeping mat.'),
);

const shelter = scenario.stages.find(stage => stage.id === 'shelter')!;
shelter.motivation = 'The orchard path ends at my cottage site. Build a house and fit it with a window and sleeping mat before nightfall. A stone hearth would make it warmer, too.';
shelter.objectives = [
  {id: 'shelter-house', text: 'Build a house', kind: 'create', item: 'house', intermediate: true},
  {id: 'shelter-furnished', text: 'Fit window and sleeping mat', kind: 'create', capability: 'furnished-shelter', after: ['shelter-house']},
];
shelter.completionText = 'Daylight through the window, and a mat inside for the night: thank you, the cottage feels like a home now. The brook is just beyond the orchard.';

// Every old checkpoint remains an earned prefix, with the new installation
// inserted immediately after the mat is made. The hearth is never required.
for (const checkpoint of scenario.checkpoints ?? []) {
  checkpoint.actions = checkpoint.actions.flatMap((action): Action[] => {
    const makesMat = action.type === 'combine' && [action.a, action.b].sort().join('|') === 'cloth|fiber';
    return makesMat ? [action, {type: 'combine', a: 'sleeping-mat', b: 'house'}] : [action];
  });
}
scenario.notes = [...scenario.notes ?? [],
  'House-components v1: the same House has two required unlabelled component slots (Window and Sleeping mat), with an optional Hearth from the previously unused Stone + Fire pair. The Window supply remains for Tower, Greenhouse and Curtain; the Sleeping mat and Hearth have no outside future use and are incorporated at installation. No global engine, UI, old route, old save identity or first-ten canonical recipe change. Logical validation is not human or browser playtest evidence.',
];
