# Estuary browser checkpoint — 27 October 2026

A human-playable checkpoint, not a finished game or evidence of 200 interesting decisions. It uses the unchanged published binary adapter, signal substrate and v2 public goal contracts (freeze publication c822ad2ece1700f90d5e7c99c76017a1dc08a632). It neither reopens nor reinterprets the old voluntary player capture.

## Run and package

- `npx vite --config estuary-play.vite.config.ts`: `http://127.0.0.1:5186/history-play.html`.
- `npx tsc -p estuary-play.tsconfig.json`.
- `npx vite build --config estuary-play.vite.config.ts` creates `dist-estuary-play`.
- Root can copy `history-play.html` as `history.html` plus its relative assets into the existing private Site. No default Mars entry or save is changed by this build.
- Separate save: `estuary-human-playtest-v2-1`. State reconstructs from actual gestures. Reset discards that save and replays introduction, including from any modal.

## Scope

Rounded reusable things include people, lived memories, scores, methods, pairs and invitations. Only actual sites, living schools and routed mailboxes are hollow location rectangles. Click or pointer-drag combines actual existing operands. Hover/selection shows legal existing partners without future output previews. A valid drop has a distinct highlight. Surviving source stays at its original coordinates; actual new pieces are placed in nearby free space and scrolled into view. Independent consequences, deliveries and handovers are described rather than pretending every gesture collapses into a single new noun.

Friendly inspection explains current behavior and provenance, not a future solution. Six optional public purposes have v2 causal progress reasons and introductory dialogs. Completing a purpose offers the next unseen one; all six can also be selected freely. Location revelation is presentation-only, not an engine prerequisite or earned power. Pieces retain their manually chosen positions in a continuously scrollable board. Things have `touch-action:none`; empty space allows browser pan.

Debug checkpoints (0/5/9/17/21 gestures) replay actual authored combinations. They are visibly labelled source-exposed debugging, not player achievements or independent fun measurements. Browser import graph excludes Node CLI wrappers and the Node routes runner.

## Verification and limits

- Model and synthetic real-handler tests: **9/9 passed**. Includes click/drag equivalence to the frozen engine, surviving source position, invalid transaction, legal drop highlight, second-pointer rejection, empty-space rearrangement, reset inside modal, debug replay, and full visible 21-gesture authored route satisfying all six v2 contracts.
- Strict focused TypeScript: **exit 0**.
- Vite production bundle: **exit 0**.
- Native browser launch attempted with installed `/usr/bin/chromium` through Playwright. It terminated before a page opened: `chrome/browser/process_singleton_posix.cc socket() failed: Operation not permitted`, plus crashpad directory/database errors. Therefore native rendering, browser hit-testing, actual phone touch/scroll, and visual screenshots have **not** been verified by these tests. Synthetic handler tests are not a substitute for native browser QA.
- No full repository aggregate run is claimed in this checkpoint report. Root owns final aggregation/publication and live URL verification.

Evidence is in `results/estuary-browser-checkpoint/`.

## Supported Site source integration

Integrated at Site source base `c7bda357c46980629912bb6239bde8526a4b4083`: added `/history.html` as a fifth Vite entry, exact UI/model/CSS, four frozen pure dependency modules and both focused tests. Existing Mars/default/legacy entries and sources remain unchanged. A normal future Site build now retains the history route.

Site `npm run build` (full TypeScript plus all five Vite entries): **exit 0**. Site full `npm test`: **149/149 passed, exit 0**, terminal duration 110045 ms. Source parity is exact for all nine copied source/test modules and the HTML entry; all four engine/dependency hashes match the frozen v2 publication manifest. Logs, explicit exits, source parity and frozen hashes are under `results/estuary-browser-checkpoint/` in Site source. Publication remains root-owned; this records local verification, not a live deployment claim.

## Bounded input/visual corrections before publication

A final source review corrected five presentation/input details without changing any engine contract: actual locations are fixed targets (click-inspect/combine still works); hover highlights both source and compatible existing partners; legal drag-over highlights both source and target; internal kind badges are no longer shown; and non-passive Touch Events adopt pointer-touch drags with identifier guards, cancellation and duplicate-ending protection. Only a touch beginning on a draggable thing cancels browser scrolling; blank space keeps native pan. This follows the already-tested Mars input strategy without modifying Mars source. Native device verification is still not claimed.

Corrected focused tests: **12/12 passed**, including frozen full-route handler replay and targeted fixed-location, highlight, touch-only/pointer-adopted, unrelated-finger, duplicate-ending and cancellation cases. Corrected isolated typecheck/build and Site full typecheck/build all exit 0. Earlier 149-pass aggregate remains pre-correction evidence; corrected aggregate is recorded separately in `corrected-site-tests.log` and its explicit exit file. Corrected copied source parity and all four frozen hashes pass.

Corrected final Site aggregate reached its terminal result: **152/152 passed, exit 0**, 105667 ms. Evidence: `corrected-site-tests.log` / `corrected-site-tests.exit`. This supersedes the pre-correction 149-test pass for the final source, while preserving that earlier log.
