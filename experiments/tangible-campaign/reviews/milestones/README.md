# Rare invention celebrations · local prototype

This is an unshipped prototype for four deliberately rare rewards, not a claim of human-tested delight or native UI correctness. It uses the existing rounded object grammar and fitted-component labels with a brief CSS reveal. No illustrations, icons, browser automation or native UI testing were added.

## Selection and copy

| Story | Actual trigger | Title | Celebration |
| --- | --- | --- | --- |
| Elements | First accepted creation of Plant | The world takes root | Fruits of the orchard, grain of the field, flowers of the meadow. From one green beginning, a world of living possibilities. |
| Mars | Rover first gains `solar-travel`, with required drive and traction-power slots fitted | The horizon opens | Sunlight becomes motion. The ground beyond camp is no longer only something to look at; we can go there. |
| Mars | First accepted creation of Camp water system | Water, on tap | A reserve becomes a working water circuit. What we once carried by hand can now flow through the camp. |
| Mars | Oxygen plant first gains `oxygen-production`, after its filtered intake is fitted | From this world, a way home | The plant is ready to turn the air of Mars into oxygen. What once had to come from Earth can now begin here. |

Plant's orchard, grain and flowers correspond to actual branches, without revealing ingredient pairs. Rover and Oxygen plant are not rewarded at their empty-shell creation. Mars's authored oxygen capability represents restored equipment readiness, not a claim that oxygen was already produced; the later module service remains a distinct action. Camp water describes the finite stored reserve and working circuit, not limitless water. Cooking and the other stories have no milestones. Nothing enforces a uniform story quota.

## State and timing

`Scenario.milestones` is optional declarative metadata. The four active declarations live in the additive `ui/campaign-milestones.ts`, preserving frozen recipe modules. The pure exported `applyMilestones(s)` and `getPlayableScenario(id, catalog)` helpers are shared by UI startup, content validation and logical/headless replays; the feature is not UI-only hidden state. `when: 'created'` requires a real recipe output; `when: 'functional'` requires the named item's actual authored capability. `validateScenario` checks IDs, copy, output references and possible capabilities. Only accepted combine/install transitions record achievements. Supplies, selection, dragging, cancellation, failure, visit, resize and reload do not invent them.

`State.milestones` holds earned facts and the fitted component snapshot at the achievement event. It participates in Undo. `Game.milestonesSeen` holds acknowledged IDs outside undoable state, so an acknowledged triumph never repeats in that run. Pending rewards are the earned entries not yet acknowledged; the normal save codec persists them without a new save identity. Older saves receive no inferred backlog. Reset removes both sets. Prepared checkpoint replays mark already-earned achievements acknowledged, preserving their DEBUG provenance rather than pretending the player just made them.

The creation stays on the board. After the existing 700ms creation cue, a native full-screen `dialog` opens before any automatic chapter transition. Reading, debug controls and active drags defer this flow. Continue or Escape acknowledges only the currently displayed ID; the next queued reward, then the next chapter, follows. Old Continue/cancel handlers cannot acknowledge a different queued reward. Reopening a current challenge, a stationary pointer hold/release and Undo of an unrelated later move must not strand pending work. These interrupted cases have focused synthetic-controller regressions.

The native dialog has labelled/described text, initial focus on Continue, no animation gate, normal overflow for short screens and reduced-motion styles. Focus returns to the real object when it still exists, otherwise to the challenge control. Native focus containment, screen-reader announcements, visual layout and the emotional effect remain unverified until authorized browser/human playtesting.

## Shared logical-playtester entry

```ts
import {scenarios} from '../../ui/scenarios.ts';
import {getPlayableScenario} from '../../ui/campaign-milestones.ts';
import {replay, pendingMilestone} from '../../engine/model.ts';
const world = getPlayableScenario('elements-house-and-craft-v1', scenarios)!;
const game = replay(world, actions);
const nextReward = pendingMilestone(world, game);
```

Use the decorated world consistently for creation, restore, actions, checkpoints and reward acknowledgement. Raw registered worlds intentionally remain the frozen authored graph for historical parity tests. Active IDs are `mars-connected-survival-v4-return-cargo-research` and `elements-house-and-craft-v1`; predecessors do not inherit rewards.

## Reproduce logical checks

```sh
node --test tests/milestones-engine.test.ts
node --test --test-name-pattern='milestone:' experiments/tangible-campaign/ui/campaign-controller.test.ts
node --test tests/tangible-campaign.test.ts
npm run build
```

The full aggregate is required in addition to focused checks. It covers existing saves, grouped arrivals, lifecycle semantics, archived routes and the prior controller suite. Independent review and final result logs are recorded beside this document or in `results/milestones-20261028/`; do not infer native UI validation from passing source/headless tests.
