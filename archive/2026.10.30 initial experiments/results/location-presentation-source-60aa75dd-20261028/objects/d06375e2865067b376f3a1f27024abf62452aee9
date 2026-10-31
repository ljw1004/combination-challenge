# Mars natural-order candidate — 28 October 2026

Base: clean live `86c479746909412d775873d5bb250868ed7bf2d0`. This isolated candidate is not published.

## Bounded changes

- Rename the visible `Sheltered ice` place to **Ice melt station**, keeping its location ID. The solar charger powers the existing fixed enclosed melt head. The alternative portable-heater action uses the same station's enclosed exchanger and surviving cabin service lead. These are equipment/power premises, not electricity-as-heat or an unpowered-heater claim. Both recipes produce the same `meltwater`; both tools remain reusable, and the engine's existing discovered-output guard prevents duplicate water.
- Add **Covered seed tray** and **Watered covered tray**. Covering may happen before watering, after watering but before germination, or after germination. Every path still needs seeds, the original growing tray, water and time in the warm habitat. Each finishes as the same existing `propagator` and continues through the existing nursery-label/support/settle recipes.
- Show the fitted **Clear cover** as a component through the covered tray, propagator and nursery upgrades. The canister remains unchanged; the tray evolves at its own location (at the destination for germination), and the lid is incorporated once.

- Clarify two more visible place names without changing their identities or roles: **Cliff viewpoint** is the local viewing point for a photograph of the far cliff, not a distant destination; **Open weather site** is where the restored station records weather. The weather-area caption and optional descriptive text use the same ordinary name. Location-result placement is owned by the separate UI candidate, not this patch.

## Why a small engine opt-in is required

The existing `needed()` safeguard treats any unused recipe with a not-yet-discovered output as a potential later use. Merely adding alternative orders would therefore leave the original tray and loose lid outside the covered tray. It would permit multiple competing representations of the same tray.

`InputLifecycle.exclusive?: true` is an explicit, per-input declaration for a single physical object's alternative upgrade routes. At the actual output-creation event only, it removes that declared transformed/incorporated input even when an unused alternative recipe exists. It does not change `needed()`, installation rules, ordinary shared supplies, unrelated events, stage advance, restoration, or retrospective deletion. Validation rejects false, `retain`, and installation declarations. Only Mars tray transformations and lid incorporations opt in here.

`preserve` remains the separate visible-construction contract. Removal identity is recorded through the existing `incorporated` ancestry; fitted cover visibility is copied through explicit preservation declarations. No new save fields/version are introduced.

## Identity and compatibility

Keep `mars-connected-survival-v4-return-cargo-research`. These are additive, local alternatives during a user's active playthrough, not a campaign redesign. All prior item/recipe/goal IDs, stage order, caches, checkpoints, and the existing late-cover route remain. Restore does not reset or retrofit version-2 progress. A new world ID would strand the user's current run in the old behavior, so it is not warranted here.

`source-delta.json` records exact before/after scenario entries. `lifecycle-delta.json` records the exact previous/current lifecycle decisions; immutable historic audit files are untouched. Compatibility tests apply or reverse this declared successor rather than accepting arbitrary source drift. The label-only historical test explicitly checks the frozen predecessor, while the new suite checks old-to-current saves and all new orders. `source-successors.json` extends the existing hash chain and pins changed existing files.

## Verification and integration

Run `npm run build`, `node --test tests/mars-natural-orders.test.ts`, `node --test tests/tangible-campaign.test.ts`, plus the late-Mars and reactive suites named in the handoff. Results are source-aware headless evidence, not browser/UI, fresh-player, enjoyment, or real survival/scientific validation.

The parent is concurrently integrating a placement-highlight repair. Merge its `model.ts` partner-highlight edits with this candidate's separate output-creation lifecycle hunk, then regenerate the combined successor hash and rerun the relevant tests. Do not select one entire model file over the other. No actual checkout, commit, push or publication was performed by this candidate worker.
