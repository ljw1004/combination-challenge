# One workroom, two commissions — isolated paired package

**Local data-only candidate. No reader started; no actual game-source, runtime, UI, integration, Git or publication changes.**

The preserved pre-implementation tradeoff is in `../candidate-v2/PAIRED-HUMAN-CHECKPOINT-PROPOSAL.md`. The coordinator subsequently authorized this separate package. It does not replace the independently matched v1/v2 candidates or merge their evidence.

## What changes—and what does not

- Same **six manufacturing recipes, eight physical kinds, plural supplies, optional proofs and optional method-sheet Read** as matched v2.
- Three short scenes: print the master; deliver a readable panel to the **shop's display frame**; deliver a printing block to the **travelling printer's chest**.
- The chest is revealed only with the printer's commission, in the same workroom. Existing window, tools, master and early creations stay available. No extra travel, new assembly or purpose token.
- **Six core drops:** four combinations and two real deliveries. Optional proofs remain optional.
- If both forms were made early, the second commission requires only one new delivery—not rebuilding. Its newly arrived chest prevents automatic skipping.

This is **within-person transfer**, not two independent matched trials. If a player made the reflected block before the printer arrived, the later brief cannot explain that earlier manufacture; the later action is selection/adoption of an already available artifact. Do not retroactively count it as backward design. Do not forbid early crafting or pad a replacement step to improve the evidence.

## Checks

**47 tests pass**: 19 paired-content/surface/preservation checks plus 28 unchanged runtime tests. Strict TypeScript checking passes. All 12 productive first-commission inventory states enter the second brief incomplete and can finish it. Wrong-for-use deliveries recover; Read is non-mutating; saves, undo, revisit, supported logical widths and reversed item-input order pass.

Independent packaging review: **PASS**, including six targeted source-aware checks (`INDEPENDENT-PACKAGING-REVIEW.md`). Its scope is not a full-suite certification, human test or philosophical-success claim.

**124 original files remain byte-identical:** matched v1/v2 candidates, their sealed packets and the exact closed v1 sessions protected before paired work. The original-matrix ownership explanation and actual earlier-master identity remain intact.

## Reader and earned checkpoints

The sealed neutral reader starts at the **actual beginning**, so its player makes the master personally:

`/workspace/shared/workroom-visit-reader-20261028/PLAYER_TASK.md`

Manifest pin:

`b6d356ea41f5aaa30609583a44fe293f687c7512ca675effca6e73da5dc43ec9`

It was verified by file hashes and a zero-action in-memory opening. No `play.mjs start` was invoked and no reader-session directory was created.

Two scenario checkpoints are also provided for later existing-UI use:

- `workroom-earned`: master already printed; two authored engine actions replayed.
- `printer-arrival-earned`: master printed and display panel delivered; five authored engine actions replayed.

Both labels explicitly disclose authored prior progress. `evidence/earned-checkpoints.json` records their exact action prefixes, histories, state hashes and metrics. The neutral reader wrapper does not silently select either checkpoint. Do not count an authored prefix as actions performed by a future checkpoint player.

## Reproduce

```sh
python author.py
node --test --test-reporter=tap pilot.test.mjs engine/model.test.ts
node verify-packet.mjs
```

`seal_packet.py` is a one-time preparer and refuses to replace an existing packet. The copied player wrapper changes only an obsolete “two-scene session” error to “session”; runtime and adapter behavior are unchanged.

## Evidence limits

Reflection is authored content, not optical simulation; labels are not tested artwork. Existing placement goals are existential, and prior completed commissions are historical achievements. Deliberately moving an earlier delivered panel later does not create a new duty under the unchanged engine; the final narration concerns the printer's use, not a claim that every earlier artifact remains installed.

No paired fresh-controller trial, human playtest, UI/browser test or integration has occurred. A pleasant or easily solved comparison would not by itself establish distinct ultimate final causes, natural teleology or a sustained causality game. Preserve the mirror-puzzle failure criterion when reviewing future play.
