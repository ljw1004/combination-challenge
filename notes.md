# Working notes

## 30 October 2026 — Markdown rebuild

Goal: a clean, comprehensible repository and three applications sharing one Markdown story model and deterministic game core: linter, browser game/debugger and logical AI playtest/evaluator. Hypothesis: shared semantics and source-located diagnostics prevent the old proliferation of mutually inconsistent experiments.

The user authorized archival-only preservation of all legacy applications, saves and URLs, permanent exclusivity (creating A rules out B), per-story directories/artwork, parallel agents and commits. Preserve the successful old UI styles and handling. Keep the entire default test suite near or below 20 seconds, reviewing the value of expensive tests.

Archived the original working tree at archive/legacy-2026-10-30, retaining 15,871 tracked-file hashes and original internal paths. Original source commit: 1e8567d3. Legacy applications will not be run. The five active manuscripts now have their own directories and 103 image references resolve within their story directories. The authenticity review is copied unchanged and remains future editorial work.

Strategy: reconcile documentation and archive provenance; implement the shared parser, runtime and UI in parallel; add reproducible logical sessions and AI-runner integration; exercise real story routes and browser interactions; fix observed problems and record remaining evidence limits honestly.

Automatic approval review rejected both plain-text subagent spawn requests, claiming their tasks were unreadable. Work proceeded in the root agent without delegation. No independent fresh AI trial is claimed. The standalone agent-command/HTTP harness is implemented and exercised with an explicitly synthetic protocol fixture.

## Implementation and findings

The shared parser reads all five manuscripts, including global rules, nested shorthand, explicit IDs, permanent exclusivity, compounds, inline conditions, goal chains, renames, wonders and author notes. The engine implements needs-based chapter surfaces, latched achievement, event-local joint input retirement, legal installation, inherited hotspots, skip bridges, replay and generated checkpoints. All five complete legal witness routes work. The linter reports zero errors and 64 author-review warnings; those warnings are not silently waived or fixed by changing content.

A complete Elements witness exposed a retention bug: protecting only the final goal allowed Grain to retire even though the preceding next-chain goal still needed Porridge. Intermediate requirements now participate in continuation checks. A real browser drag test exposed native HTML drag stealing the pointer gesture; pointer-down default prevention and dragstart suppression fixed it. Subsequent visual inspection exposed repeated goal labels from nonunique DOM reconciliation keys; positional fallback keys now keep ordinary repeated elements distinct while retaining image and item identity.

The new browser copies the original workshop stylesheet and restores partner-only highlights, square hotspots, compound rows, local animated births, reading/wonders, explicit arrows, Undo, reset/instructions and browser saves. Connected scene/image nodes survive ordinary state updates. Carry arrangement is translated while large gaps are compressed; new items are packed separately using measured label heights. Phone text and touch targets keep their physical size as the reference panel scales.

The archive document inventory covers all 1,082 Markdown paths / 747 distinct contents and records 2,223 candidate guidance passages with source lines. Current docs synthesize the authoritative design/UX/authoring/evaluation decisions, research limits, practical coding lessons and future ideas. The inventory is an exhaustive scan/extraction, not a claim of fresh manual factual verification of every archived line. The 70-card authenticity tracker preserves original priorities and marks lexical manuscript matches as unverified navigation aids.

The logical runner freezes source, story, assignment and model label; exposes player-only observations; retains rejected attempts and optional accounts; and supports a JSON agent process or HTTP service. The evaluator replays with the frozen source, separates mechanics from reports and keeps missing/invalid experience evidence unknown. External AI and human enjoyment remain untested in this rebuild; protocol-fixture success is infrastructure evidence only.

## Verification

Archive verification passed for all 15,871 original tracked files, including an exact comparison of the active authenticity review with its archived original. All 103 story image references resolve locally. TypeScript, linter and production build passed. The measured complete default suite (12 Node tests plus 3 Chromium interaction tests) passed in 7.09 seconds on this workspace, including all five complete legal witnesses and exact replays. Browser checks cover mouse combination/highlights, Undo, reload, reset from instructions, a 320px checkpoint, touch-card movement and empty-space touch scrolling. The touch checks are browser emulation, not a native-device claim.

Final visual inspection of early and later Ideas scenes found and repaired a delivery divider whose position was being removed during reconciliation. Arrival packing now separates colliding carried cards while retaining the relative placement of noncolliding cards, and keeps the working group's centre near one-third of the panel. Ordinary settled boards are not repacked. The game retains warning/backlog work rather than claiming the stories have been editorially repaired or proven fun.

## Infinite resources clarification — 30 October 2026

The user clarified that every item is an infinite resource. Consume/transform are presentation hints for hiding inputs and placing results; only mutual exclusivity encodes finiteness. The working hypothesis is that this clarifies the existing retention model: required inputs stay visible, hidden tokens remain in state, and exclusive alternatives are recorded separately. The spec's existing needs rules still exclude hidden tokens from later introduction.

Aligned current principles, authoring/engineering guidance, agent instructions and engine comments with that distinction. Mixed-fate lint warnings now ask about visibility hints; the spec still explicitly requests these author-review warnings. Runtime behaviour and manuscripts remain unchanged.

Verification: TypeScript and diff whitespace checks passed. Lint still reports zero errors and 64 warnings across the five stories. No new tests were added for documentation or diagnostic wording.

## Documentation consolidation — 30 October 2026

Goal: give each document one purpose and one area of authority. The working hypothesis is that linking to a rule's owning document prevents the competing copies that accumulated during the rebuild. Consolidated writing conventions and design advice in the authoring guide; kept grammar, game semantics and diagnostics in the specification. Moved layout, tool usage and the complete playtesting protocol into the README, with a documentation map. Engineering now concentrates on implementation and testing, UX on presentation, and the archive README on historical-source policy. Current story directions and unimplemented format/tool ideas live in the backlog.

Removed the superseded design-principles and playtesting documents after moving their useful content and updating active references. The user's infinite-resource wording is retained in the specification's combinations section. Research provenance and evaluation limits remain in their existing guides; the authenticity review remains untouched.

Verification: 191 local Markdown links across 13 active/index documents resolve, including checked heading anchors. All npm tools are represented in the README. The original authenticity review, story sources and legacy archive are unchanged. Lint still reports zero errors and 64 warnings; diff whitespace checks pass. No runtime changes or new tests were needed for this reorganization.

## Archive index placement — 30 October 2026

Moved the salvage index into `archive/` because it documents the archive and the provenance of recovered guidance. Rebased its outgoing links and updated all active references; checked local targets and heading anchors.


## 30 October 2026 authenticity consolidation and implementation

At 14:43 UTC, after restructuring the repository, Lucian requested one consolidated `docs/authenticity-backlog.md`, a running build on the existing private working site, and then implementation and testing of the justified authenticity improvements. On completion, the backlog is to move into the archive with a dated header explaining its purpose and outcome. This resumes repository work for that task; it does not restore old source over the Markdown rebuild.

At 14:45 UTC Lucian explicitly granted sole control of this repository and permission to check in changes. Use the supported GitHub batch route where possible; if an approval is still required, surface it rather than claiming a push succeeded. The requested private working-site deployment is authorized separately from the original local-only rebuild. Preserve its existing access level; no changes to unto.me are authorized.

The consolidation compares the five current manuscripts at `f5125875dc25080e68be63061861426c9129de74` with the proposal baseline `1e8567d343a36d8280f54cf5e6bc41a98b7fcd47`. Their changes are image-path relocation only. The proposals therefore retain their manuscript counterparts, but their old claim that no new-format linter or playtester exists is obsolete. Current syntax, infinite-resource semantics and verification requirements come from the active specification and tools.

The original pre-Markdown review remains byte-for-byte in `archive/legacy-2026-10-30/docs/story-authenticity-review-2026-10-30.md`. Removing its duplicate active copy does not alter historical grades or evidence. The consolidated backlog records current work and separate keep, absent-edition and unresolved decisions; consolidation itself is not implementation or playtest evidence.


## 30 October 2026 authenticity pass completed

Content and verification work closed at 15:32:24 UTC. The single [completed record](archive/authenticity-improvements-2026-10-30.md) replaces the active authenticity backlog: all 70 original IDs and 82 case bindings are preserved, with 42 changed findings, 24 retained decisions and four absent-edition outcomes, plus five calibration examples. Four separate new repairs and additional clarity observations retain their own evidence; they do not inflate the original audit. The original legacy review remains unchanged.

Final story source is commit `e7c8cce7526ba618ee2f3bfb628edbaf60d8bdd8`. Build, type checking, lint and 13 Node tests pass; 64 warnings remain under reviewable authorial interpretations. Focused and independent legal witnesses, actual browser checks across five stories, and 23 replay-verified logical sessions from 15 fresh participants support the bounded conclusions in the completed record. The trials are short or guided, not whole-story human enjoyment evidence. Automated Playwright and native-device tests were not run in this pass.

Negative intermediate results were retained: the initial Ideas candidate still obscured one input contribution, prompting a final earned bridge; the summer candidate's lid/firing confusion prompted the final finished-jar pattern and earned process cue. Their follow-ups support post-result comprehension within the recorded conditions, not universal forward predictability. The broader original ratings and archived bytes were not rewritten. Publication and hosted deployment are verified separately from this content-completion record.


## 30 October 2026 minimal chapter controls

Lucian requested and authorized these UX changes at 16:46 UTC. The interaction contract lives in [UX](docs/ux.md): bottom-centered checkbox goals give way to the chapter arrow, automatic introductions have only Begin, and instructions are removed. The discreet bug glyph opens developer tools. Story switching and generated chapter navigation remain development aids; separate release URLs remain the intended distribution model.

Deliberately reopening the goals offers a chapter restart after an actual move or combination, including after Undo, or a confirmed story restart on an untouched later chapter. Browser-only arrival snapshots preserve inventory, progress and measured placements across reset and reload. Legacy saves and debug Undo across a chapter boundary reconstruct a legal arrival layout when original measurements do not exist. No manuscript or shared game semantics changed.

Verification: 18 Node tests, lint (zero errors; the existing 64 author-review warnings), TypeScript and production build pass. Independent review caught and corrected immediate save-error reporting and reset viewport positioning. Actual Chromium interaction checks covered 390px and 320px layouts and desktop, first and later introductions, goals/arrow replacement, move/Undo/reload/reset, story-restart Cancel/Escape/confirmation and scrollback. A settled card overlapping the centered goals initially lost pointer precedence; native paint/hit-area clipping now preserves the card and uncovered goal targets, with an actual drag and scroll retest. Source-level tests cover the overlap union, snapshot boundaries, skipped chapters, dirty state and storage-result reporting. Automated Playwright specifications were updated but not executed in the managed browser environment. Native iPhone/iPad/Safari were not tested. These checks establish interface behavior, not human enjoyment.


## 30 October 2026 quieter goals, recovery links and authored readings

At 17:07 UTC Lucian requested subtler goals and recovery actions, an explicit goals-to-arrow entrance after the final wonder, and removal of duplicated item captions. The [UX contract](docs/ux.md) now gives Markdown sole authority over reading paragraphs: automatic wonders and manual item readings no longer append an item-name caption. Authored italic names remain untouched. The supplied Plant example now has its explanation and single authored italic Plant paragraph. No story text changed.

Goal rows use a 55% cream backing with a light text shadow; recovery actions are subordinate text-style controls beneath Close, while the final destructive confirmation stays explicit. Readiness waits for pending notices, then fades goals for 220 ms and introduces the arrow over 400 ms. A ready reloaded chapter is already settled. Redraws preserve the transition; navigation/reset cancel stale timers, modal interruptions settle safely, and reduced-motion switches without the movement/wait. Departing goals are disabled as well as hidden from assistive navigation.

Verification: 21 Node tests, TypeScript, production build and lint pass (zero errors and the existing 64 author-review warnings). Independent source review covered timer lifecycle, interruption, reset/reload and authored-only readings. Actual Chromium checks observed single-caption Plant in automatic and manual readings, subordinate recovery styling, goals retained behind the final wonder, down/right arrow entrance, settled reload, and Undo/recompletion. Reduced-motion behavior is covered by pure transition tests and CSS/source review, not an actual browser setting in this environment. Native iPhone/iPad/Safari and automated Playwright were not run.


## 30 October 2026 long-hold reading and release feedback

Lucian reported from iOS at 17:17 UTC that releasing a long hold dismissed its newly opened reader, and that compatible-partner highlights flickered between double-click taps. The release/cancellation path was rerendering the application and removing the dialog. Gesture cleanup now restores card geometry directly and leaves an opened reader intact. A trailing release click cannot activate the reader; the next deliberate pointer press or keyboard action remains usable. The duplicate native double-click reader path was removed in favor of one pointer-based double-tap recognizer.

Partner highlighting shares the recognizer's 400 ms release interval, survives pointer-out, and also lingers after ordinary or rejected drag drops when the source remains available. A new item press, reader, navigation or cancellation clears the old feedback and timers. Resize cleanup restores the gesture before updating board geometry, without reconciling away an open reader. Goal clipping is refreshed after restoring canceled or rejected gesture positions.

Verification: 24 Node tests, TypeScript, production build and lint pass (zero errors, 64 existing author-review warnings). Deterministic clock tests cover the 400 ms window, timeout, second press, movement release and cancellation. Independent review covered click suppression, capture cleanup, resizing and clipping. Actual Chromium held-mouse input reproduced the original disappearing Plant reader and verified that the same hold/release now leaves it open; deliberate Close works and double-click opens a single reader without reopening after dismissal. Browser checks also caught an intermediate unbound-timer invocation error in the new feedback helper; binding browser timers to their global receiver fixed it, and a later drag-release observation confirmed expiry. The iOS report is not a native-device verification: native iPhone/iPad/Safari and automated Playwright were not run.
