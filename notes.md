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
