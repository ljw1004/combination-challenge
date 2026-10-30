# Engineering guide

This document owns implementation boundaries, technical constraints and testing policy. Game semantics belong to the [specification](story-format-spec.md), editorial choices to the [authoring guide](story-authoring.md), and commands to the [README](../README.md#tools).

## Boundaries

- Use one parser/model and one deterministic game core for the browser, linter, checkpoint planner and logical runner. Do not copy transition logic into individual clients.
- Story semantics stay in `src/engine/`; browser code owns geometry, pointer handling, dialogs and local storage.
- Parsing preserves file/line provenance, declarations, qualifiers and explicit/default fate distinctions. Diagnostics cite source locations rather than only output IDs.
- Node-only story discovery and file I/O live outside browser modules. Vite bundles each story's Markdown and referenced local images.
- Saves are versioned action histories bound to a story fingerprint. Replay reconstructs logical state; browser positions are presentation metadata.
- Logical observations expose only normal player information. Keep developer recipes and checkpoint routes out of fresh-player observations; the [README protocol](../README.md#logical-playtesting) defines the runner's interface.
- Apply the [archive policy](../archive/README.md) when consulting historical implementations.

## State and continuation analysis

Token statuses record visibility and incorporation, while `State.excluded` records permanent exclusive choices. Hidden tokens remain in state. Keep chapter progression, goal latching, slot installation and input hiding in the shared engine so browser and logical play agree.

Assess candidate hidden inputs jointly at the combination event. Do not independently approve two removals that together block progress, or retroactively hide retained inputs on unrelated actions or reload. Include unfinished intermediate goals in continuation checks. These are implementation obligations for the specification's protection rules.

The analysis enumerates unresolved exclusive pairs, then computes reachable constructions with the chosen branch and chronological hotspot availability. It has an explicit limit of 12 unresolved exclusive pairs rather than silently claiming exhaustive analysis after truncation. This is an implementation of the specified retention model, not an independent formal proof of its invariant.

## Tests that earn their cost

The full default suite should finish in about 20 seconds. It includes semantic tests and Chromium interaction checks. Keep cases small and purposeful: parsing ambiguity, jointly hiding inputs, exclusive branches, compound preservation/wrapping, goal latching, hidden-information boundaries, real drag/Undo/reload/reset, and one complete legal witness for each active story.

Do not snapshot whole stories, pin incidental counts or rerun historical tests. A change in wording is not a reason to rebuild a large expected-output fixture. Add a regression case when a real counterexample exposes an important semantic boundary. Compare semantic state rather than string snapshots of large UI markup. Run timing checks when new tests or code make them relevant. Archive hash verification is an occasional preservation check, not part of each development test run.

## Browser implementation

Implement the interaction contract in [UX](ux.md). Preserve connected image and scene DOM nodes rather than replacing the world after each move; do not rewrite unchanged image URLs. Suppress native HTML drag, own pointer timers and capture through completion, cancellation, focus loss and resize, and measure long labels as well as simple physical-item names. Test real pointer events, and distinguish browser touch emulation from a native-device test.

Keep script/test source boundaries explicit so archived snapshots cannot accidentally enter the active build.

## Evidence integrity

Hash the actual played source, not a nearby commit or manuscript-only approximation. Replaying an evaluation must use its frozen runtime. Preserve generated evidence before changing an evaluator. The [README](../README.md#frozen-evidence-and-evaluation) defines run artifacts and retention; [fun and evaluation](fun-and-evaluation.md) defines what claims they support.

Sources: [legacy evaluator audit](../archive/legacy-2026-10-30/docs/fun-evaluator-audit-1.md), [rendering fixes](../archive/legacy-2026-10-30/docs/rendering-and-intertitles-20261029.md), [source/test boundaries](../archive/legacy-2026-10-30/docs/location-hotspot-root-sync-20261028/test-context-map.json), [event-local policy](../archive/legacy-2026-10-30/experiments/tangible-campaign/reviews/lifecycle/EVENT_LOCAL_POLICY.md). These links preserve provenance; current rules are above and in the linked active documents.
