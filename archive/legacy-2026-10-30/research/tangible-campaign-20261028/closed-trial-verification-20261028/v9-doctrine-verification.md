# Doctrine v9 q/r: independent closed-trial verification

**PASS:** both sessions reproduce exactly from the frozen v9 runtime. Full-event replay matches each complete saved game, including state/history/events; independent command-log replay matches every result, reading, hint, player-visible view, transition and stage. Both repaired derived-premise pairs appear in the recorded play, not only in authored route tests.

## Fresh-only metrics

| Session | Authored events excluded | Explicit combines | Accepted / rejected | Reads | Hints | Fresh engine attempts / accepted | Ending |
|---|---:|---:|---:|---:|---:|---:|---|
| `fresh_doctrine_q` | 24 | 5 | 4 / 1 | 7 | 1 | 6 / 5 | Desk 5 → 6; stopped at assigned boundary |
| `fresh_doctrine_r` | 41 | 6 | 6 / 0 | 5 | 0 | 7 / 7 | Final desk completed |

Each engine total includes **one automatic advance**, not another player combination. No undo, move, placement, visit or installation occurs. The 65 authored checkpoint events are excluded, and both authored baselines were independently regenerated and compared byte-hash/object-wise. These are checkpoint trials, not fresh full-campaign completions.

## Targeted repairs actually exercised

- **Q:** `spiritual-baptism + gospel-and-hands` succeeds through `embodied-from-apostolic-claim`, creating `embodied-spiritual-rite`. That unordered pair is absent in the frozen v8 candidate and was rejected in v8 n. Q used it after reading the derived spiritual-baptism claim. Its earlier hint was for a different operand, `acts-hands`, and displayed only `gospel-and-hands`; it did not directly display the repaired pair. Q is therefore **not an entirely unassisted trial**, but the repaired derived pair was not directly supplied by its hint.
- **R:** `body-discipline + free-service` succeeds through `bodily-work-from-free-service`, creating `body-not-discarded`. This is the **reverse operand order** of the recipe's stored `free-service + body-discipline` order and the pair rejected in v8 p. R requested no hints and incurred no rejects. Its free-service argument came through `promise-of-christ + christ-servant → received-and-given`, then `received-and-given + neighbour-in-need → free-service`, rather than the v8 p route.

The verified v9–v8 recipe delta is exactly these two added recipes. The observed uses support the specific derived-premise repair. They do not establish general enjoyment, comprehension, all-order coverage, or freedom from other semantic affordance gaps.

Do not read Q's four accepted combinations versus v8 n's five as a measured efficiency improvement: their traces differ. V8 n also performed the optional `love-not-world + love-enemies` combination; Q did not.

## Q's first rejection: narrower than the old derived-premise failures

Q first reads `ritual-leaf`, `acts-hands` and `gospel-and-hands`, then tries:

`ritual-leaf + acts-hands` → **“No new combination here.”**

Both selected objects are present on the current desk. There is no recipe for that pair, rather than a reversed-order, missing-object or placement failure. The selected cards represent:

- `ritual-leaf`: the scriptural promise of baptism with the Holy Ghost, explicitly described as Acts 1:5 cited by the ritual;
- `acts-hands`: the apostolic laying-on-of-hands precedent, cited by the ritual.

Neither chosen operand is the **concrete Lyon rubric** that the elder lays a Gospel book and hands on this candidate; that is `gospel-and-hands`. The existing accepted pair `acts-hands + gospel-and-hands` connects apostolic precedent to the particular Lyon practice. The repaired next pair then uses that derived claim with the bodily rubric to conclude that the rite is not bodiless.

Thus Q's rejected move is a reasonable association between related scriptural sources, and the generic feedback still cost a hint. However, those two operands alone do not supply the specific local ritual action. Even though Q had already read the rubric, the game does not automatically treat every previously read fact as a premise in every join. This is **not sufficient evidence to add a blanket new edge**, especially one yielding a Lyon-specific conclusion without its rubric. It is a different issue from refusing a derived argument that already preserves the relevant premises. No source or graph change was made here.

This assessment is about the supplied content and graph semantics; no new historical/theological primary-source audit was performed.

## Integrity and limits

- **19/19** entries in v9 `pilot-integrity.json` match.
- Both sessions' candidate and pilot-manifest pins match current frozen bytes.
- Both authored-baseline SHA-256 pins, baseline event prefixes, checkpoint objects and baseline metrics match.
- Recorded and running Node agree: **v24.22.1**.
- **28 original input files** retain their observed hashes throughout verification; current hashes are recorded in the result artifact.
- Local hashes demonstrate current consistency/replayability, not tamper-proof chronology, independent authorship, or proof that source was never viewed. Session/log bytes receive present hashes here, not a retroactive historical seal.
- These are protocol-source-blind simulated logical trials, not human or native/browser tests. Reads and self-reported stopping reasons do not prove understanding or fun. Q's boundary stop is not evidence of voluntary long-session continuation.

No input/source/UI file was changed. Prior ten-trial and gate evidence were not overwritten. No GitHub/site write or UI test occurred. No verification action was blocked or denied.

## Reproduce

```sh
node /workspace/shared/combination-campaign-research-20261028/closed-trial-verification-20261028/verify-v9-doctrine.mjs
```

Separate artifacts: `verify-v9-doctrine.mjs`, `v9-doctrine-results.json`, `v9-doctrine-run.log`, and this report.
