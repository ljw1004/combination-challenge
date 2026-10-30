# Estuary v2 freeze gate

27 October 2026. Separate consequence-contract/feedback repair, not a changed v1 session and not player evidence. See `ideas-history-estuary-v2-contracts.md` for precise semantics and `ideas-history-estuary-v2-player-protocol.md` for the fresh-run boundary.

## Source boundary

Two new executing modules: `ideas-history-estuary-v2-goals.ts`, `ideas-history-estuary-v2-player.ts`. They import the immutable v1 adapter, substrate and signals. No old executing source or capture is edited. The new wrapper's version and session format are distinct; its underlying mechanics remain accurately labelled v1. No Mars source, Site or UI changes.

The independent review discovered an actual false-positive in the new candidate: equal-trajectory angle output could count for a pressure-only role invitation. It was repaired before freeze by requiring actual output on an invited channel. Review also challenged score-ID equality on both remote receiving and local sending paths; unchanged causal renditions now count without a new ID password. These are source-exposed tests, not player discoveries or fun measurements.

## Verification

Final focused Estuary tests: **95/95, exit 0**. TypeScript and production build: **exit 0**. New independent adversarial tests: **8/8, exit 0**. Implementer-adapted old CLI tests remain explicitly labelled regressions, not new independent review.

All old frozen manifests verified unchanged: substrate29, adapter35, wrapper25 and raw9 entries; see `results/ideas-history-estuary-v2-development/prior-integrity.json`. Original voluntary finish and three-of-six endpoint result remain frozen. Passing new predicates over equivalent history would not be an observed new player achievement.

Full repository aggregate: **655/655 passed, exit 0**, terminal summary recorded after 200.85 seconds. Evidence runner and explicit exit paths are under `results/ideas-history-estuary-v2-development/`. The earlier v1 fresh-validation aggregate was interrupted and is not evidence of a pass.

## Publication and recruitment

Only root publishes and verifies exact remote commit. The publication manifest lists final sources/docs/tests/evidence; after publication, source must remain unchanged throughout a separately authorized fresh no-history wholeplay. Root may recruit only after independent review, completed final checks and exact publication verification. This document itself does not authorize recruiting, reopen the prior player, or assert that correcting opacity creates a longer or more enjoyable game. No action quota, forced completion, artificial novelty lock or redundant proof ceremony is introduced.
