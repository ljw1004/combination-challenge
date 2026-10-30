# Engineering guide

One source format, one game core. The parser produces a source-located model. The linter, browser, checkpoint planner and logical runner consume that model; none translates it back into legacy scenarios. Archive imports are forbidden by project policy.

## Boundaries

- Story semantics stay in `src/engine/`; browser code owns geometry, pointer handling, dialogs and local storage.
- Parsing preserves file/line provenance, declarations, qualifiers and explicit/default fate distinctions. Diagnostics cite source locations rather than only output IDs.
- Node-only story discovery and file I/O live outside browser modules. Vite bundles each story's Markdown and referenced local images.
- Saves are versioned action histories bound to a story fingerprint. Replay reconstructs the logical state; browser positions are presentation metadata. Old runtime saves are deliberately unsupported.
- Checkpoints are ordinary legal-action replays. Label their achievements historical and keep them out of fresh-play observations. A bounded dependency planner need not pretend to prove a global shortest path.

## Retention and exclusivity

Creating an exclusive item permanently rules out its partner. Needs analysis respects that choice and never reintroduces a consumed/transformed item as fresh stock. Existing compound parts satisfy their owner's slot requirements; they do not automatically become independently usable outside tools.

Assess removals jointly at the actual event, then retain a necessary outside input when future work still requires it. Do not retroactively consume it on unrelated actions or reload. Protect unfinished intermediate goals as well as final goals. Apply chapter/goal progression and slot installation in the engine so browser and logical play cannot disagree.

The analysis enumerates unresolved exclusive pairs, then computes reachable constructions with the chosen branch and chronological hotspot availability. It has an explicit limit of 12 unresolved exclusive pairs rather than silently claiming exhaustive analysis after truncation. The current five manuscripts are below that limit. This is an implementation of the specified retention model, not an independent formal proof of the specification's invariant.

## Tests that earn their cost

The user's target is about 20 seconds for the entire default suite. `npm test` includes semantic tests and Chromium interaction checks. Keep cases small and purposeful: parsing ambiguity, joint consumption, exclusive branches, compound preservation/wrapping, goal latching, hidden-information boundaries, real drag/Undo/reload/reset, and one complete legal witness for each active story.

Do not snapshot whole stories, pin incidental counts or rerun every historical test. A change in wording is not a reason to rebuild a large expected-output fixture. Add a regression case when a real counterexample exposes an important semantic boundary. Run performance and timing checks when new tests or code make them relevant.

`npm run check` type-checks active source only. `npm run build` checks and bundles the game. `npm run lint -- --details` exposes author warnings. Archive hash verification is an occasional preservation check, not part of each development test run.

## Practical lessons retained

Use the actual runtime for checkpoints, logical player actions and replay; a copied transition function will diverge. Compare semantic state rather than string snapshots of large UI markup. Preserve generated evidence before revising an evaluator. Hash the actual played source, not a nearby commit or manuscript-only approximation. Distinguish authored routes, replayed observations and fresh experience.

In UI code, use real pointer events, suppress native HTML drag, clean up capture/timers, retain image nodes and unchanged `src` attributes, and measure long labels. Treat touch emulation as browser evidence. Keep script/test source boundaries explicit so archived snapshots cannot accidentally enter the active build.

Sources: [legacy evaluator audit](../archive/legacy-2026-10-30/docs/fun-evaluator-audit-1.md), [rendering fixes](../archive/legacy-2026-10-30/docs/rendering-and-intertitles-20261029.md), [source/test boundaries](../archive/legacy-2026-10-30/docs/location-hotspot-root-sync-20261028/test-context-map.json), [event-local policy](../archive/legacy-2026-10-30/experiments/tangible-campaign/reviews/lifecycle/EVENT_LOCAL_POLICY.md). Their current-app compatibility machinery is retired; their relevant lessons remain.
