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

## 30 October 2026 URL-loaded stories and live authoring

Goal: edit a story beside its running game, without risking the text or putting editor concerns into the game core. The working hypothesis is that a durable raw buffer plus a provisional state projection supports quick structural experiments: deleting a chapter while typing must not commit a loss of progress. The user explicitly requested best-effort interpretation of every buffer, background global linting with mapped text spans, and a clear engine boundary.

The player now fetches ordinary Markdown through `combinations.html`, with an optional story-folder selector. Artwork resolves against the manuscript URL. The build keeps JS/CSS separate and copies the player beside each story; the root index is a catalogue. Loading/deployment and editing instructions belong to README.

The browser authoring layer saves every input transaction before scheduling interpretation. Independent per-tab draft records, saved-copy recovery, copy/download, visible failures and a before-unload warning protect buffers. Empty and invalid drafts shadow the original URL. Closing the editor and resetting gameplay retain drafts; deleting one is explicit, retrieves the original first, and cancels if either tab changed the draft during the fetch. Browser storage remains subject to clearing/eviction and is not a server backup.

The engine itself is unchanged. A pure browser adapter reconciles the parsed story with the last game-interaction anchor, preserving surviving constructions, placements and history while reevaluating changed goals. Edits alone do not advance the anchor. Temporary chapter deletion is reversible; subsequent gameplay commits the displayed state. Edited snapshots and Undo use the revised baseline rather than replaying actions against changed rules. Dialog and editor DOM are independent from the game surface, keeping open readings editable without stealing focus or rebuilding images/cards.

All diagnostics have UTF-16 text spans. Fast checks update after a 90 ms preview debounce; one worker handles global continuation/exclusivity analysis. Stale revisions are ignored and only the latest pending buffer is retained. CodeMirror maps existing squiggles and list entries through line insertion/deletion until replacement diagnostics arrive. Measurements on the five current manuscripts put fast checks at roughly 1–6 ms and deep checks at 2–5 ms, so a second worker is unwarranted.

Review exposed and repaired mismatched goal-only references being treated as item renames, Undo replaying obsolete rules, reader dismissal being lost on the next edit, and draft deletion races. A deterministic robustness pass exercised 408 damaged buffers across all five stories without parser/projection failures. A 14-exclusive-pair counterexample exceeded the existing engine analysis limit; the browser now reports that limitation without uncaught pointer-handler exceptions. No story content, archived evidence or engine semantics changed.

Verification: 41 Node tests and 11 Chromium browser tests pass in about 17 seconds combined, including while the build ran concurrently. Type checking, production build and whitespace checks pass. All five stories still have zero lint errors and 64 author-review warnings. A static-server Chromium check mounted the actual build under a website subdirectory and verified the catalogue, selector and adjacent-file routes, shared draft identity, relative images, copied-page navigation, background diagnostics and explicit 404 handling with no page errors. The desktop screenshot was inspected. Native Safari/iOS and human fun evaluation were not run. This implementation is local; no hosted publication was performed. The separate development bundles currently include CodeMirror eagerly (about 221 kB gzipped for the player bundle); Vite reports its size advisory, without a build failure.

## 30 October 2026 actionable, stable diagnostics

Goal: make lint warnings explain their evidence and navigate without disturbing the diagnostics panel. The reported movement came from sorting by the current cursor line: clicking a diagnostic changed the cursor and immediately reordered/rebuilt the list. The list now stays in source order; current-line highlighting changes attributes only. Updated results retain expanded related locations and the visible entry where possible.

Mixed-fate warnings now summarize each actual fate and label every related use, including the primary location, default preservation, explicit annotations and implicit installation behavior. Related locations navigate from both the diagnostics panel and hover explanation, carry their own UTF-16 spans, and move with buffer edits. CLI details show the same labeled locations. The parser records the Goals heading so `many-visible-goals` selects that section instead of the chapter heading. The warning trigger remains unchanged; consume-versus-transform alone does not introduce a new mixed-fate warning.

Verification: 43 Node tests and 12 Chromium tests pass in about 13 seconds combined. The new browser regression checks source ordering, node continuity, panel scrolling, expanded related links, Goals navigation, hover navigation and line insertion. An additional offset check exposed CRLF normalization in CodeMirror; conversion now handles both primary and related spans, and the browser regression also passes with a CRLF manuscript. Type checking, build and whitespace checks pass; the five stories remain at zero lint errors and 64 warnings. No core engine, story or archive changes were required.

## 30 October 2026 compact diagnostics, fate fixes and chapter jumps

Goal: keep editing actions close to the source without expanding the engine's responsibilities. Diagnostic rows now use conventional line/code notation; selecting one shows compact related-location bullets and hides the others. Repeated clicks collapse/reopen the bullets while retaining selection. Removed the redundant review instruction from mixed-fate warnings.

Mixed-fate lightbulbs in the panel and source open the same menu. Choices are limited to fates actually present; implicit slot semantics disable incompatible choices with a reason. A chosen fix updates every authored use, including duplicates and implied shorthand parents, as one isolated undoable editor transaction. It uses normal synchronous draft saving. Fixes are disabled while a buffer change awaits fresh diagnostics. The parser records edit provenance independently of the shared engine's deduplicated recipes.

Chapter headings expose a checkpoint button on hover or keyboard focus. The editor supplies the source line; the browser resolves it against the latest parsed story and uses the same legal checkpoint path as the debug menu. Jumping retains the Markdown draft and editor position. The core engine and archive are unchanged.

The user asked about saved copies. Explained the existing policy: each tab/page editing session retains its latest saved buffer, restoring a copy preserves the current buffer, and older sessions are not pruned. This policy has not been changed by the diagnostics work.

Verification: all 46 Node tests and 13 Chromium tests pass in about 14 seconds combined. Coverage includes compact exclusive selection/collapse, both lightbulb entry points, present-fate choices, whole-fix Undo/autosave, CRLF and shorthand/duplicate provenance, and checkpoint jumps retaining draft and editor scroll. All 83 enabled fixes in the current manuscripts were separately checked to remove their target warning without parser errors; 11 incompatible choices explain slot constraints. Desktop Mars screenshots of the compact panel, source bulbs, fix popup and chapter button were inspected with no page errors. Build/type checking and whitespace checks pass; story lint remains zero errors and 64 warnings.

## 30 October 2026 visible blue fix icons

The user found the lightbulb emoji difficult to see. Both source and diagnostic buttons now share a solid blue SVG mask, with blue hover/focus styling and their existing accessible names. This makes the icon color consistent across operating systems. Type checking, whitespace checks and the existing diagnostic navigation/fix browser test pass. A Chromium screenshot was inspected and both icon locations were verified to render blue; no new tests or game semantics were needed.

## 30 October 2026 contextual fix menus and remembered editor visibility

The user refined the controls: fix popups now name their affected item and offer “always preserve”, “always transform” and “always consume”, restricted to current fates. The linter supplies the item name explicitly rather than requiring the browser to extract it from diagnostic prose. Long headings truncate within the popup and retain their full name in the hover title and accessible text.

Lightbulbs now use the requested bright cyan outline. Source bulbs are positioned over their line, with separate positions for multiple diagnostics, so they do not affect wrapping or line height. Chapter checkpoint buttons use the same outlined bulb and no longer reserve room for a text label; hover and keyboard focus reveal them with an explanatory tooltip.

Remember the editor's open/closed preference separately for each Markdown URL. On desktop, either a saved draft or a last-open preference opens the editor. A closed preference does not override an existing draft. Saving this UI preference never creates a Markdown draft, and preference-storage failures cannot block editing or draft saves. Expanded existing browser coverage checks all three startup cases, popup context and long headings, and equal source-line height with bulbs shown or hidden.

Verification: all 46 Node tests and 13 Chromium tests pass in about 14 seconds combined. Type checking and production build pass; the five stories still have zero lint errors and 64 warnings. Inspected desktop screenshots of the Sand fix menu and chapter-heading bulb, with no browser page errors. The existing bundle-size advisory remains. No engine semantics, stories or archives changed.


## 30 October 2026 minimal desktop and mobile debugging

Removed game Undo, save export and the recipe inspector. The desktop game occupies 390px and the editor fills the remaining width. Below 900px, debugging offers only a chapter picker, with the current chapter highlighted. Responsive hiding retains the desktop buffer, editor Undo history and open preference. Drafts still load on mobile.

Verification: 46 Node and 13 Chromium tests pass in about 14 seconds. Build, type checking and whitespace checks pass; story lint remains zero errors and 64 warnings. Inspected desktop and mobile screenshots and confirmed draft retention through a mobile reload and return to desktop. Mobile coverage uses Chromium emulation. The engine, stories and archive are unchanged.

## 30 October 2026 consolidated debug pane

Goal: make the right-hand pane the single home for debugging, primarily live Markdown editing. One game-area button now toggles it directly: a bug for the published story, replaced by the red pencil when a local draft exists. Its icon changes only with draft state, and items retain precedence where they overlap it. Existing draft-or-last-open startup behavior is preserved.

Removed the separate debug dialog, chapter selector/generation button, debug restart and story-switch actions. Checkpoint lightbulbs on the source headings provide jumps, including a fresh start at the first chapter. Game Undo, progress export and a collapsed recipe inspector now live in the pane; presentation data and callbacks keep these controls independent of the engine. The reader's ordinary recovery controls remain part of the player interface.

Removed the pane title, URL, Markdown copy/download actions and routine save-success messages. Exceptional persistence failures and recovery notices remain visible, and the complete text remains available through normal select-and-copy even when storage fails. Draft storage and recovery policies are unchanged. The pane defaults to 840px, can be widened by dragging or keyboard, and shrinks before the game's natural 390px width; the existing phone layout stacks the surfaces.

Verification: all 46 Node and 13 Chromium tests pass in about 16 seconds combined. Existing browser cases now use source chapter bulbs on the actual manuscripts, verify the unified icon/draft lifecycle and responsive widths, check live recipe names, and copy the exact unsaved buffer with keyboard clipboard commands. Type checking, build and whitespace checks pass; story lint is unchanged at zero errors and 64 warnings. Inspected 1600px and 1000px desktop screenshots, exercised game-save export and the recipe inspector, and observed no page errors. Native mobile testing was not run; touch coverage uses Chromium emulation. No engine semantics, story content or archive changes.


## 30 October 2026 lint review and next-chain correction

The review began against user commit `4ef30baff0bc9fe64b85b68066a9d95dece72e92`: all five manuscripts had zero errors and 64 warnings (43 mixed-fate and 21 goal-density warnings). These counts are an authoring signal, not a fun score. Lucian clarified that the purpose is informed meaningful decisions, a simple understandable behavioral model and manageable options; source-review dispositions and story candidates therefore remain provisional until focused player comparisons.

The initial review found that adding `next:` could waive earlier goals in the implementation. Lucian corrected the intended semantics: `next:` is only sequential presentation, and every predecessor remains required. The old `chainEnds` completion check and achieved-final shortcuts in continuation analysis violated that intent. Shared complete-chain logic now checks every member, with chapter-level AND/OR combining complete chains. Visibility, chapter skipping, future retention, checkpoint replay and live-preview completion follow that rule. Goals achieved ahead of display may remain latched, but they cannot bypass an unfinished predecessor. The specification and lint advice have been corrected to match this clarification. Historical review witnesses describe the old implementation only.

Lint messages retain their existing predicates and severity while distinguishing visibility/placement hints from finite-resource semantics, reporting actual goal-chain counts and treating uniform-fate options as author choices. Disabled compound options no longer suggest that a nonexistent slot-fate annotation can normalize implicit owner/component roles. Actual browser review exercised source locations, disabled implicit-role options, an enabled Lamp edit and single-transaction Undo. The diagnostic guidance about `next:` was subsequently aligned with the corrected conjunction semantics.

Verification for the core correction: focused legal early-final regressions cover incomplete predecessors, visibility, advance rejection, future retention, chapter skipping, OR between full chains, replay/checkpoints and live projection. The full Node suite, typecheck and build pass; all five manuscripts have legal completion witnesses. Browser/native-device verification of the engine correction and the broader fun comparison are separate and remain pending at this stage.


## 30 October 2026 lint experience review completed

The [completed lint review](archive/lint-review-2026-10-30.md) records all 64 original warning cases, the source review, targeted player evidence and limits. The next-chain correction and diagnostic guidance were committed separately in `5942b7b84abef0e3136d960fd0cc6f1238c2abd7`, retaining all original manuscripts. Actual browser testing then confirmed that producing the final result first did not reveal the advance arrow until the predecessor was achieved.

The final story change is deliberately narrow: Elements Ink uses default preservation for the Letter and Botanical drawing, matching its printing-block role. A baseline player explicitly learned earlier reuse and then noticed the final drawing's unexpected retirement; the tested preservation variant retains one current-panel Ink token and the old Letter option. This is a modest design judgment in favor of a consistent medium role, not a measured human-fun gain. The production default annotation is semantically equivalent to the studied explicit-preserve variant.

All seven provisional Kitchen transform edits were withdrawn. Six produced no immediate visible change on the original legal witnesses; the final Sponge change did alter retirement and surprised the candidate player after earlier persistent reuse. The two provisional Mars goal edits were also withdrawn: the exact cargo variant did not establish a benefit, and the tested packing pairing was not the proposed portrait-to-cart reorder. No other manuscripts changed.

All 21 goal-density cases received paired guided scenes. Results do not establish that a blanket two-track presentation improves the experience, nor that it cannot help human phone users. All 43 mixed-fate cases received actual focal-use probes; 41 included contrasting baseline declared roles and two retained partial role coverage (Lamp and Recovered crawler). Uniform-preserve variants sometimes blurred identity by retaining both original and upgraded objects. The full record includes rejected proposals, route-null cases challenged by player alternatives, and technical confounds and repairs.

Verification: all 183 recorded scenes were replay/hash verified without errors. They are not 183 independent cases or human trials. Both comparison arms used the corrected shared runtime; source isolation was an assignment contract, not an OS sandbox. The logical interface exposes global partners and items from visited panels, and cannot establish visual crowding, touch usability or human enjoyment. Original interface-confounded and wrong-branch records were preserved and excluded from the affected conclusions.

Final production checks: 49 Node tests, type checking and build pass; story lint has zero errors and 63 reviewed warnings. Actual browser checks covered printing at 390px, botany at 320px and reverse Ink drag at 390px; Illustrated flora remained reachable and retained Ink did not cover goals/arrows. Some creation-position overlaps remained manageable with ordinary dragging. These were narrow desktop-browser frames, not native iPhone/iPad/Safari tests or a fun judgment. Automated Playwright was not run.

## 31 October 2026 retained opportunity linter

The user accepted the pessimistic construction-set algorithm as useful authoring assistance at an acceptable cost. Their new Principles section in the [format specification](docs/story-format-spec.md#principles) makes the intent explicit: allow optional worldbuilding, let the engine manage supply and cleanup, and catch likely fruitless authoring without adding author annotations. The [lint catalogue](docs/story-format-spec.md#lint-rules) owns each rule's motivation and formal definition.

The shared gameplay engine now seeds chapter needs from goals and top-level primitive Items entries, expanding global recipe dependencies. Derived declarations provide metadata without supplying ingredients, carrying existing results or protecting ingredients against cleanup. Implicit slot installation does not make its owner derived. The browser, live preview and checkpoint planner use the shared engine.

The retained linter builds complete construction sets backwards and deduplicates constructed identities and filled slots before combining requirements. Each set has one working state, evaluated through actual engine actions. Earlier chapters contribute goal-directed work only; optional local probes retain the actual goals and never seed later histories. The analyser does not enumerate partial inventories, action permutations or independent OPTIONAL expansions. Its deliberate pessimism can reject a real but fragile gameplay route.

Chapter histories first merge compatible construction histories, collapsing possible retirement and placement. They can also merge identical available/installed inventories that differ only in retired-versus-uncreated intermediates. Possible creation still blocks recreation and supply. Possible noncreation survives separately and relaxes historical records only in retirement queries; otherwise, removing future alternatives can accidentally invent protection for another ingredient. Small regression fixtures cover that counterexample, both merge insertion orders and persistent uncertainty. The cap remains 100 elements per construction-set family or merged frontier, not 100 cumulative evaluations.

Opportunity diagnostics include a blocking chapter and ingredient, with source links to relevant declarations and recipes. These are illustrative blockers from the completed analysis, not unique historical explanations or proof of absolute impossibility. Explanation selection never changes acceptance.

Accepted analysis results (content findings are now warnings; tests and bundling ran concurrently, so timings are not controlled benchmarks):

| Story | Opportunity warnings | Peak alternatives | Construction sets evaluated | Time |
|---|---:|---:|---:|---:|
| Divinity | 0 | 8 | 47 | 0.20 s |
| Elements | 4 | 48 | 406 | 2.95 s |
| Ideas | 0 | 2 | 128 | 1.69 s |
| Kitchen | 5 | 2 | 44 | 0.26 s |
| Mars | 1 | 90 | 906 | 10.11 s |

All five analyses complete within the default limit. Before the identical-inventory merge, an explicitly authorized 10,000-limit Elements trial peaked at 1,152 alternatives and 9,206 evaluations in about 33 seconds. The retained merge finds the same four problems with 48 alternatives and 406 evaluations. Kitchen and Mars findings are also unchanged; the 63 existing warnings remain.

The ten content findings are retained for [editorial review](docs/backlog.md), without editing stories to silence them:

- Elements: Brush encounters retired Plant fiber; Weather book encounters retired Bound book; Salt and Brine need Fired glazed bowl from an earlier board.
- Kitchen: Mustard paste encounters retired Cider vinegar; Glazed fruit tart needs an earlier-board Fruit tart; Buttercream and Vanilla buttercream need earlier-board Butter; Vanilla sandwich cake needs earlier-board Butter, Confectioner's sugar and Vanilla.
- Mars: Illuminated glovebox needs a Lamp left on an earlier board at the field station.

Removed the superseded exhaustive action-search implementation, its CLI flags and state/transition budgets, witness traces and temporary experiment files. Its useful counterexamples remain as small explicit gameplay replays beside their stricter lint expectations. Consolidated the intermediate investigation notes here; the production analyser and its statistics remain available through the documented CLI.

Verification: all 71 Node tests and 13 Chromium tests pass, as do type checking and independent Vite bundling (with the existing bundle-size advisory). Gameplay regressions cover primitive cache protection and arrival, derived declarations not supplying or carrying results, and compound goals carrying their owner while supplying missing components. All five manuscripts retain legal complete gameplay replays. There are no opportunity-analysis-limit errors. No stories, user icon work, archives, deployments or external services were changed.

The user clarified that content-opportunity findings should be author-review warnings. Both `unsupplied-primitive` and `no-item-opportunity` now have warning severity, with the algorithm and explanations unchanged; incomplete analysis remains an error. The existing `npm run build` script runs CLI story lint, TypeScript checking and Vite bundling in sequence, stopping on errors but permitting warnings. It builds the web application and copies ordinary story files; editing or loading Markdown does not require it. The README now explains that boundary. After the severity change, all 20 opportunity tests and the complete production build pass: story lint reports zero errors and 73 warnings (the previous 63 plus these ten).

## 31 October 2026 icon project brief

The [icon project brief](docs/icons.md) records the proposed Elements icon presentation and art-generation experiments; the [art-style references](references/icon-sets/art-styles/index.md) collect six visual directions. The brief remains a design proposal, with implementation and art-style selection pending. Recognition, touch usability and consistency across a complete icon set have not yet been evaluated. This checkpoint preserves the brief and reference assets for the next phase.

## 31 October 2026 encountered-item encyclopedia

Implemented the authorized encyclopedia against main `4d25ff532145b2fa52b96d8de8f98736ad19d492`, preserving the newer construction-set linter and the separate icon project. Entries derive from all current token identities and applicable nonempty readings, including supplied and retired/incorporated resources; no discovery ledger or game-state/schema changes. The manual chapter dialog unlocks the alphabetical reader list at three entries; automatic introductions retain Begin alone. The shared gold-and-paper book is decorative in every wonder and appears on only the pressed/dragged described card through its existing release window, independent of that threshold. It is not an item-icon asset.

Interaction rules and reset behavior are owned by [UX](docs/ux.md). Verification evidence is recorded with the final integration checkpoint; native-device behavior is not implied by browser emulation.

Implementation checks: all 75 Node tests pass (including retention after consume/transform/install, replay/reset derivation, renamed alphabetical labels, empty/conditional readings, and press-versus-hover feedback). TypeScript and the production build pass; the five production manuscripts retain zero lint errors and 73 author-review warnings, with the existing bundle-size advisory. The three new Playwright cases are retained, but this executor cannot launch Chromium because its headless-shell executable is absent; the full browser suite is not claimed as passed. Supported Sites/CUA preview verification is tracked separately from that executable limitation.

## 31 October 2026 encyclopedia refinement

The user's follow-up supersedes the earlier alphabetical/back-navigation/reading-decoration design. The encyclopedia is now a plain text-link list grouped by first-encounter chapter, with one Close returning directly to the game. Each entry reading has one Close returning to that list; Escape follows those same routes. Reading popups no longer have a decorative book. The goals control and pressed-item badge retain it. Long-hold reading has been removed, not delayed: holding can begin a drag; double-tap/double-click and keyboard activation read an item.

The user explicitly authorized small additional state for chronology. Tokens record firstSeen.chapter/order separately from mutable scene placement. Supply/creation stamps the active progression chapter, including creation performed in scrollback. Retirement/incorporation and carry/movement retain history. Ordinary legacy saves recover history through replay; valid edited snapshots preserve it and live chapter edits remap it. When an old edited snapshot has no reconstructible history, or its first chapter is deleted, the list honestly uses “Earlier discoveries” rather than guessing from where the object now sits. Reset restores the corresponding token metadata without a separate discovery ledger. This unavoidable legacy limit does not discard items, positions or progress.

Implementation baseline: main `0e8984d9f615c9e404354eb93fb666f611dfac48`, reread and verified against the current GitHub tree before edits. No unrelated item-icon assets or lint algorithms were changed.

Refinement verification: all 80 Node tests pass. The production build passes lint (zero errors, 73 existing author-review warnings), TypeScript and Vite, retaining the existing bundle-size advisory. Added metadata cases cover moved/carried/retired/installed tokens, progression-versus-placement chapter, legacy replay/backfill, invalid metadata, chapter insertion/deletion/renaming, reset, and unknown-history ordering. Independent review reran the focused history/encyclopedia/live-edit cases without finding a defect. Playwright tests now cover the revised Close/Escape/link UI, hold-then-drag and touch double-tap, but this executor still lacks the Chromium executable, so they did not execute. Supported CUA verified chapter-grouped retired entries, reload/reset, mobile Close/Escape and no popup books; a 900 ms hold did not open a reading and separate drag/double-click worked. That API could not perform one continuous held-pointer-to-drag sequence, which remains an explicit verification limit rather than a claimed pass.

## 31 October 2026 icon study implementation and review

Executed the brief as six copies of a one-chapter comparison story, with 120 generated item pictures, twelve registered House overlays and six matching backgrounds. The [study record](docs/icon-study/README.md) owns exact prompts, style guidance, raw review inputs/answers and remaining distinctions. The original five stories and the user's uncommitted icon-brief edits were preserved. Parser/model and lint now support complete icon stories; the browser renders quarter-size artwork, transient names and fitted layers while retaining ordinary text stories and legal engine behavior.

The user rejected the first woodcut's thick borders and cute game appearance and asked about William Blake. A further style-only proof still drifted; a reference-led monochrome engraving and a flatter three-ink riso were retained. Three recognition rounds included a fresh forty-picture review, a context-aided follow-up, then explicitly repeat-exposure checks across all six styles and the repaired engraving. The first blind round had 36/40 broad object-family matches; Brine and Cider needed context. Later rounds caught and repaired the loose-leaf Botanical drawing and rocky Earth. They cannot establish a new blind recognition rate. Human preference, native touch and recognition speed remain open; the backlog links that decision rather than duplicating the study.

Verification: all 77 Node tests and 19 Chromium tests pass. The production build passes; all six new stories have zero lint warnings and errors, while the original stories retain their 73 reviewed warnings. Browser inspection of every final variant at 390px and 320px confirmed natural quarter sizes, complete assets, two fitted layers, persisted installations, no horizontal overflow and no page/network errors. Touch coverage is Chromium emulation. No claim of human enjoyment or full-Elements icon coverage is made.

Automatic approval review rejected additional fresh reviewer creation, so later rounds reused the original reviewer and are labelled accordingly. It also rejected creation of the existing private working site's repository write credential as outside the icon request. Publication was not attempted through another route; the local build is available and the hosted site's audience and deployment remain unchanged.

## 31 October 2026 coloured woodcut and traditional transparency follow-up

The user clarified that the woodcut should keep the original reference's colour and feel while being earnest rather than cute, and that traditional circles should be 20% black. Added `icon-test-woodcut-color` as a seventh comparison, preserving the monochrome engraving. Two coloured atlas passes used the supplied reference directly; the second favours broader cuts, flatter colour and fewer presentation shadows. A new matching clearing and registered House fittings complete the playable copy. The [study](docs/icon-study/README.md) owns the saved prompts, source atlases and two additional repeat-exposure reviewer reports.

The reviewer found the second coloured pass more earnest and graphic, but still somewhat polished and inventory-like. Its stronger printing treatment also weakened pendulum/weight, feast/workbench and soil/gravel distinctions. This remains a candidate for the user's comparison, not a selected Elements-wide style or an independent recognition result.

Traditional foreground art was isolated through image generation, then composited over exact 51/255-alpha black disks; the artwork's own alpha is preserved. Original opaque atlases and review inputs remain available, and small repainted details in the generated isolation are acknowledged. Pixel checks confirmed 20% backing and transparent exterior pixels in all twenty icons. Both changed stories pass lint and Chromium checks at 390px and 320px, including both fitted layers, reload persistence, complete quarter-size images and no page/network errors or horizontal overflow. Type checking and the production build pass. The existing private hosted deployment remains unchanged; these follow-up previews are available locally.

## 31 October 2026 icon integration onto current main

At the user's request, rebased the working branch onto `origin/main` at `1c1e6b9c`, then restored the icon changes. Resolved the overlapping renderer and notes edits while retaining upstream encounter history, encyclopedia navigation, pressed-item books and double-tap/keyboard reading. Icons retain their intrinsic sizes, overlays and precise drag pickup offsets; holding does not open a reading. A focused regression exercises the described-icon book cue, a held drag and deliberate reading after release. All 86 Node tests and 24 Chromium tests pass on the integrated tree, including the upstream encyclopedia browser checks. Production lint, type checking and bundling pass with the existing 73 author-review warnings and bundle-size advisory. The user explicitly authorized committing and pushing the integrated icon work to the repository; no access settings were changed.
