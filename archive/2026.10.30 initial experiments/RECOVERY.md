# Postplay review recovery — historical reports, not a current replay

Recovered 26 October 2026 from retained earlier file-creation tool text and emitted tool output in the reviewer's conversation. No denied session paths, remote reads/writes, or missing-file fabrication were used.

## What is here

- `docs/living-atlas-play-review.md`: complete historical review body, preceded by a new provenance notice.
- `docs/mars-objects-play-review.md`: complete historical review body, preceded by the same notice. This preserves the original postplay interpretation; later doctrine amendments may qualify it.
- `results/living-atlas-review/verify.mjs` and `results/mars-objects-play-review/verify.mjs`: context-reconstructed historical producer scripts with new recovery comments. They retain their original required input paths and output destinations.
- `results/*/historical-summary-reconstructed.json`: **new, explicitly partial historical summaries**, not the original source-verification ledgers. They contain only retained values from old creation text or emitted output.
- `recovery-manifest.json`: new checksums and recovery provenance, including limited current comparisons of separately recovered source files to retained historical source hashes.

No original complete-file SHA-256 for either review or verifier was retained. Their byte identity therefore remains unverified. New recovery hashes identify only these recovered files. The original body word counts (Atlas 2,553; Mars 1,002) match the retained creation-time counts, but that is not cryptographic identity proof. The notices/comments intentionally change the recovered files anyway.

## What is missing

**The original four raw player captures are unavailable. Neither original full play-verification ledger has been recovered.** Their original paths are deliberately not populated with summaries. Atlas raw-file SHA-256 values were retained and are recorded for a future authentic recovery; Mars raw-file SHA-256 values were not retained. Do not replace a missing capture hash with a final-state hash.

Original full logs, the mixed24 archive, mixed26 aggregate/profiles and full state-derived certificates/observations are not recovered here. The historical reviews retain links to those original artifacts, and many links therefore do not resolve in this recovery bundle. This is intentional provenance transparency, not evidence that the linked artifacts have been recovered.

## Verification performed now

- Both reconstructed verifier files pass `node --check` (syntax only).
- Both summary JSON files parse.
- Recovery file checksums are recorded in the manifest.
- Available separately recovered source files were compared with the exact historical source hashes retained in the old verification text. Results appear under `currentRecoveredSourceChecksumChecks`; missing dependencies are labeled unavailable.

**Neither verifier was executed. No original player replay, historical evaluator rerun, or historical test suite was reproduced now.** Correct source recovery or a newly generated author witness cannot establish that the missing original player events, accounts or timestamps are intact.

The scripts require authentic captures, the historical source/adapter/registry and expected freeze records in their original repository locations. If original captures are recovered, compare retained raw hashes where available and resolve every missing dependency before running. A later rerun should be saved with a new provenance record, not presented as the old generated ledger.

## Interpretation of historical claims

Every statement of a pass, exact replay, unchanged capture, timestamp or player behavior inside the historical review bodies refers to the earlier execution. The partial summaries label this explicitly. No new action sequence was invented to stand in for the missing raw play, no missing timestamp was guessed, and no human enjoyment or duration conclusion was added.
