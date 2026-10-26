# Working Materials V2: final lens-control refresh

26 October 2026. **Independent source-exposed mechanical audit, not fresh play or enjoyment evidence.** The reviewer did not implement the engine, UI or deduplication repair. This refresh follows the earlier [independent review](working-materials-independent-review.md), whose final engine hash predates the last repair. Earlier evidence is retained unchanged.

## Targeted result

At engine SHA-256 `944e095d14693e9a300bebf7a107e3a33c991739ab9e518e3cb07a269f6110aa`, the new [targeted control](../results/working-materials-independent/lens-refresh-2026-10-26/lens-control.mjs) passes. Its [full trace and state](../results/working-materials-independent/lens-refresh-2026-10-26/lens-control.json) establish:

1. A copied camera inside a rigid clear boundary makes one actual beacon observation. It does not claim the original survey camera's identity.
2. Repeating that unchanged observation is rejected; no record is added.
3. Installing the actual initial camera inside the same boundary does not retroactively change the previous observation or award the original-camera goal.
4. A new observation from the same viewpoint through that unchanged boundary is accepted and records the newly present actual lens. The goal now passes. The first observation's snapshot remains byte-for-byte unchanged.
5. Repeating the now-unchanged observation is again rejected, with no new record.
6. A design copy of the assembled result has no observation history.

There are six accepted operator combines and two rejected duplicate observations in this focused construction. The two observations each produce one record; neither record count nor automatically included lenses are additional decisions. Every submitted action matches its exact preview, the entire trace replays exactly, and the source hashes are unchanged before/after.

## Refreshed regression and public-interface controls

All twelve earlier independent probe cases were rerun at this engine. The [new probe summary](../results/working-materials-independent/lens-refresh-2026-10-26/probes/summary.json) preserves the corrected negative cases and valid alternatives: selected-tool locality, actual record carriers, original camera/root identity, original-source copies, genuine new-plate relays, copied profiles, and nonsealed mesh dust protection. Each probe retains exact replay and preview agreement in its adjacent full evidence.

The [public CLI sample](../results/working-materials-independent/lens-refresh-2026-10-26/public/summary.json) passes: all thirty complete goal cards and twelve processes are exposed; previews match commitment and inspection; queries do not change world state; verification is capture-read-only; undo after navigation preserves the selected board. Its seventeen-event raw capture contains one operator combine, zero player combines, ten queries, two navigation events, one undo, one report and two administrative events. No automatic beats are counted.

## Full-campaign controls

The [refreshed independent broad-assembly campaigns](../results/working-materials-independent/lens-refresh-2026-10-26/campaign/summary.json) again complete all thirty goals in **156 ordinary / 148 complete named catalogue / 135 saved broad assembly combines**. Every campaign has exact preview/transition agreement and deterministic replay. These are unchanged best-found upper bounds from the earlier explicit source-exposed method, not optimality claims or player counts. No short route was forbidden to protect length.

The [manifest](../results/working-materials-independent/lens-refresh-2026-10-26/manifest.json) gives exact SHA-256 hashes for all refreshed artifacts, the review and relevant source files. Reproduce from the repository root by running the three existing independent scripts with fresh output directories and `node results/working-materials-independent/lens-refresh-2026-10-26/lens-control.mjs` (the latter writes its own targeted evidence file).

## Limits

These are sampled correctness and disclosure controls, not an exhaustive state-space proof. Source-exposed construction does not establish player pacing, welcomed repetition, human pleasure, or the roughly-200 target. No engine, content, UI, prior capture or old review was changed by this reviewer. The next evidence remains prospectively frozen fresh public-only play, with every valid shorter completion preserved.
