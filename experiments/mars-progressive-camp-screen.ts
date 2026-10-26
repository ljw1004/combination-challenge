import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { legalMarsObjectsActions, marsObjectsWitnesses, marsObjectsWorld } from './logical-mars-objects.ts';
import { createProgressiveCamp, previewProgressiveCamp, progressiveCampGoals, progressiveCampWitnesses, replayProgressiveCamp, stepProgressiveCamp } from './logical-mars-progressive-camp.ts';
import type { Catalogue } from './logical-mars-progressive-camp.ts';
import { progressiveSourceHashes } from './mars-progressive-camp-play.ts';

export function runProgressiveCampScreen() {
  let checkedPreviews = 0;
  const traces = Object.entries({ ...progressiveCampWitnesses(), buildEverything: marsObjectsWitnesses().buildEverything }).map(([name, actions]) => {
    const catalogue: Catalogue = name === 'completePrefab' ? 'complete' : 'ordinary';
    let state = createProgressiveCamp(catalogue);
    const frames = [{ action: null as typeof actions[number] | null, state: structuredClone(state), goals: progressiveCampGoals(state), world: marsObjectsWorld(state.camp) }];
    for (const action of actions) {
      const before = structuredClone(state);
      for (const legal of legalMarsObjectsActions(state.camp)) {
        const preview = previewProgressiveCamp(state, legal), next = stepProgressiveCamp(state, legal);
        assert.deepEqual(preview.world, marsObjectsWorld(next.camp));
        assert.deepEqual(preview.goals, progressiveCampGoals(next));
        assert.deepEqual(preview.milestones, next.milestones);
        assert.equal(preview.status, progressiveCampGoals(next).projectCompleteNow ? 'complete' : 'playing');
        assert.deepEqual(stepProgressiveCamp(state, { ...legal, a: legal.b, b: legal.a }), next);
        checkedPreviews++;
      }
      assert.deepEqual(state, before);
      state = stepProgressiveCamp(state, action);
      assert.equal(state.camp.accepted, true);
      frames.push({ action, state: structuredClone(state), goals: progressiveCampGoals(state), world: marsObjectsWorld(state.camp) });
    }
    assert.deepEqual(replayProgressiveCamp(actions, catalogue), state);
    return { name, catalogue, actions, combines: state.camp.combines, milestones: state.milestones,
      finalGoals: progressiveCampGoals(state), frames, exactReplay: true };
  });
  const predicted: Record<string, [number, number, boolean]> = { incremental: [2, 5, true], repurpose: [2, 6, true], universal: [5, 5, true],
    clearSourceCut: [2, 5, true], reflectiveSourceCut: [2, 6, false], completePrefab: [1, 1, true], buildEverything: [7, 10, true] };
  for (const trace of traces) assert.deepEqual([trace.milestones.firstGardenAt, trace.milestones.firstProjectAt, trace.finalGoals.projectCompleteNow], predicted[trace.name]);
  const actualFinal = replayProgressiveCamp(progressiveCampWitnesses().incremental);
  const withoutEarlierShell = structuredClone(actualFinal);
  withoutEarlierShell.camp.installations = withoutEarlierShell.camp.installations.filter(a => a.id !== '1');
  assert.equal(progressiveCampGoals(withoutEarlierShell).gardenNow, false);
  return { version: 'mars-progressive-camp-1', at: new Date().toISOString(), sourceHashes: progressiveSourceHashes(),
    evidence: 'Privileged deterministic mechanical screen; no player evidence or enjoyment measurement.', checkedPreviews, traces,
    currentStateCounterfactual: { evidence: 'Analyst deletion, not a legal action or historical replay. Observer knowledge retained.',
      removedInstallationIds: ['1'], actualFinal, counterfactual: withoutEarlierShell, goalsWithoutEarlierShell: progressiveCampGoals(withoutEarlierShell) } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = runProgressiveCampScreen();
  const path = process.argv[2] ?? `results/mars-progressive-camp-preplay/screen-${report.at.replace(/[:.]/g, '-')}.json`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ path, checkedPreviews: report.checkedPreviews, traces: report.traces.map(({ name, combines, milestones, finalGoals }) => ({ name, combines, milestones, finalGoals })) }, null, 2));
}
