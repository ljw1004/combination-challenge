import { createMarsObjects, legalMarsObjectsActions, marsObjectsWorld, observeMarsObjects, stepMarsObjects } from './logical-mars-objects.ts';
import type { Action, State as MarsState } from './logical-mars-objects.ts';

/** New goal wrapper only. The imported Mars Objects 1 engine remains frozen. */
export const MARS_PROGRESSIVE_CAMP_VERSION = 'mars-progressive-camp-1';
export const MARS_PROGRESSIVE_CAMP_GOAL = 'Build a camp with an enclosed, illuminated tray, and let the northern observer locate it. First get the tray enclosed and lit; then finish whatever remains. Your constructions stay here. The project is complete when the tray is enclosed and lit and the observer has located this camp. You may achieve both together.';
export interface ProgressiveState {
  version: typeof MARS_PROGRESSIVE_CAMP_VERSION;
  camp: MarsState;
  milestones: { firstGardenAt: number | null; firstProjectAt: number | null };
}
export type Catalogue = 'ordinary' | 'complete';

export function progressiveCampGoals(state: ProgressiveState) {
  const world = marsObjectsWorld(state.camp);
  const gardenNow = world.camp.enclosed && world.camp.illuminated;
  const located = world.observer.campLocated;
  return { gardenNow, located, projectCompleteNow: gardenNow && located };
}

function recordMilestones(state: ProgressiveState): ProgressiveState {
  const goals = progressiveCampGoals(state);
  if (goals.gardenNow && state.milestones.firstGardenAt === null) state.milestones.firstGardenAt = state.camp.combines;
  if (goals.projectCompleteNow && state.milestones.firstProjectAt === null) state.milestones.firstProjectAt = state.camp.combines;
  return state;
}

export function createProgressiveCamp(catalogue: Catalogue = 'ordinary'): ProgressiveState {
  if (catalogue !== 'ordinary' && catalogue !== 'complete') throw new Error('Unknown progressive camp catalogue.');
  return recordMilestones({ version: MARS_PROGRESSIVE_CAMP_VERSION, camp: createMarsObjects('garden', { catalogue }),
    milestones: { firstGardenAt: null, firstProjectAt: null } });
}

export function stepProgressiveCamp(before: ProgressiveState, action: unknown): ProgressiveState {
  if (before.version !== MARS_PROGRESSIVE_CAMP_VERSION || before.camp.scenarioId !== 'garden') throw new Error('Different progressive camp model or underlying scenario.');
  const state: ProgressiveState = { version: before.version, camp: stepMarsObjects(before.camp, action), milestones: { ...before.milestones } };
  return state.camp.accepted ? recordMilestones(state) : state;
}

export function previewProgressiveCamp(state: ProgressiveState, action: unknown) {
  const next = stepProgressiveCamp(state, action);
  const goals = progressiveCampGoals(next);
  return { accepted: next.camp.accepted, newConcepts: next.camp.known.filter(c => !state.camp.known.includes(c)),
    installations: structuredClone(next.camp.installations), world: marsObjectsWorld(next.camp),
    status: goals.projectCompleteNow ? 'complete' : 'playing', goals, milestones: { ...next.milestones }, response: [...next.camp.response] };
}

export function observeProgressiveCamp(state: ProgressiveState) {
  const { version: engineVersion, scenarioId: _scenarioId, status: _status, goal: _goal, previews: _previews, ...base } = observeMarsObjects(state.camp);
  const goals = progressiveCampGoals(state);
  return { ...base, version: state.version, engineVersion, projectId: 'persistent-camp',
    status: goals.projectCompleteNow ? 'complete' : 'playing', goal: MARS_PROGRESSIVE_CAMP_GOAL,
    goals, milestones: { ...state.milestones },
    rules: [...base.rules,
      'The same physical camp, its installations, known blueprints and earned observer knowledge persist throughout this project. There is no next board or reset checkpoint.',
      'Both objectives are visible now and may be completed by one construction. Milestones record first achievement only; current completion requires the tray to be enclosed and illuminated now, and the observer to have located the camp.',
      'Temporary darkening is allowed and recoverable. It does not erase an earned milestone. Current northward reception is not required once the observer has located the camp.',
    ], previews: legalMarsObjectsActions(state.camp).map(action => ({ action, ...previewProgressiveCamp(state, action) })) };
}

export function replayProgressiveCamp(actions: Action[], catalogue: Catalogue = 'ordinary'): ProgressiveState {
  return actions.reduce((state, action) => stepProgressiveCamp(state, action), createProgressiveCamp(catalogue));
}

const join = (a: string, b: string): Action => ({ type: 'combine', a, b });
export function progressiveCampWitnesses() {
  const incremental = [join('frame', 'clear-sheet'), join('clear-shell', 'world:camp'),
    join('solar-panel', 'cable'), join('solar-lead', 'world:camp'), join('lamp', 'world:lead:2')];
  const repurpose = [...incremental.slice(0, 2), join('reflective-cover', 'world:shell:1'), ...incremental.slice(2)];
  const universal = [join('frame', 'clear-sheet'), join('solar-panel', 'cable'), join('solar-lead', 'lamp'),
    join('clear-shell', 'solar-lamp'), join('lit-clear-shell', 'world:camp')];
  return { incremental, repurpose, universal,
    clearSourceCut: [...incremental, join('reflective-cover', 'world:solar:2')],
    reflectiveSourceCut: [...repurpose, join('reflective-cover', 'world:solar:2')],
    completePrefab: [join('lit-clear-shell', 'world:camp')] };
}
