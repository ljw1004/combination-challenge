# Engineering guide

This document owns implementation boundaries, technical constraints and testing policy. Game semantics belong to the [specification](story-format-spec.md), editorial choices to the [authoring guide](story-authoring.md), and commands to the [README](../README.md#tools).

## Boundaries

- Use one parser/model and one deterministic game core for the browser, linter, checkpoint planner and logical runner. Do not copy transition logic into individual clients.
- Story semantics stay in `src/engine/`; browser code owns geometry, pointer handling, dialogs and local storage.
- Parsing preserves file/line provenance, section headings, declarations, qualifiers and explicit/default fate distinctions. Every diagnostic and related location has a UTF-16 text span into the original buffer, including CRLF offsets, as well as readable source locations. Related locations include explanatory messages, not just addresses.
- Node-only story discovery and file I/O live outside browser modules. The browser fetches ordinary Markdown and artwork files; Vite bundles application code and generates catalogue metadata. See the [loading routes](../README.md#run-the-game).
- Ordinary saves are versioned action histories bound to a story fingerprint. Replay reconstructs logical state; browser positions are presentation metadata. Edited previews need the separate snapshot boundary described below because changed rules cannot replay the old history faithfully.
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

## Live authoring boundary

The core engine accepts a `Story`, a `State` and game actions. It has no editor, storage, worker or text-buffer dependencies. Authoring is a browser adapter around that interface:

- `story-document.ts` resolves URLs and owns draft storage. `authoring.ts` coordinates the buffer, saved copies and explicit deletion. Raw input is written synchronously before parsing, linting or preview updates; neither game reset nor a parser failure can delete it. Independent tab records preserve concurrent copies, and failed writes retain an in-memory exportable buffer.
- `debug-tools.ts` renders game Undo, save export and the recipe inspector from presentation data and callbacks; it has no engine dependency.
- `editor.ts` owns the debug pane and its persistent CodeMirror view, mapped diagnostic decorations/list, selection and scroll. It converts original CRLF offsets to CodeMirror's single-character line breaks before displaying diagnostics or related links. Gameplay rendering never replaces its subtree.
- `live-story.ts` turns partial parsed models into playable previews and reconciles state between manuscripts. It matches chapters and item declarations, preserves surviving placements/constructions, reevaluates changed goals and supplies an empty chapter when necessary. It uses shared engine operations for game semantics.
- `main.ts` keeps the last game-interaction anchor (source, state, chapter entry, reader and scroll position). Every edit projects from that anchor rather than committing the previous provisional preview. Restoring deleted text can therefore restore the corresponding position and constructions. A subsequent game interaction commits the displayed state. Edited snapshots are structurally checked on reload; Undo starts at the current edited baseline and does not replay obsolete rules.
- `live-diagnostics.ts` runs deterministic checks after the short preview debounce and queues global analysis to `lint-worker.ts`. There is one worker and at most one newest pending buffer. Revisions invalidate old results immediately on input, before debouncing. Fast results replace fast diagnostics while retaining mapped deep diagnostics; complete results replace both. CodeMirror maps existing spans through each text transaction, so insertions/deletions do not clear the panel while work is pending.

Lint fixes contain source edits, not engine actions. The parser retains authored fate sites separately from deduplicated recipes so fixes cover duplicate declarations and shorthand inputs without changing recipe identity. Implicit installation semantics constrain which fixes are possible. The editor converts offsets, disables stale actions and applies the complete edit set in one isolated Undo transaction through normal autosave. Source lightbulbs and chapter buttons are CodeMirror decorations; the browser controller resolves a checkpoint's source line and generates it through the shared checkpoint planner.

Draft persistence, diagnostics and preview state have separate failure paths. Keep saving the raw text even when interpretation fails. Browser partner hints report analysis limits without throwing out of pointer handlers. The CLI additionally checks local artwork files on disk; browser lint checks the text and logical model. Avoid accumulating editor-specific exceptions in the deterministic engine. The [README](../README.md#edit-a-story-live) owns user-facing editing and recovery instructions.

## Evidence integrity

Hash the actual played source, not a nearby commit or manuscript-only approximation. Replaying an evaluation must use its frozen runtime. Preserve generated evidence before changing an evaluator. The [README](../README.md#frozen-evidence-and-evaluation) defines run artifacts and retention; [fun and evaluation](fun-and-evaluation.md) defines what claims they support.

Sources: [legacy evaluator audit](../archive/legacy-2026-10-30/docs/fun-evaluator-audit-1.md), [rendering fixes](../archive/legacy-2026-10-30/docs/rendering-and-intertitles-20261029.md), [source/test boundaries](../archive/legacy-2026-10-30/docs/location-hotspot-root-sync-20261028/test-context-map.json), [event-local policy](../archive/legacy-2026-10-30/experiments/tangible-campaign/reviews/lifecycle/EVENT_LOCAL_POLICY.md). These links preserve provenance; current rules are above and in the linked active documents.
