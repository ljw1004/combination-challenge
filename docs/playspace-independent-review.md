# Staged playspace independent interaction review

Scope: interaction grammar only; no research-scenario or logical-model fidelity claims. Review artifacts are isolated from frozen research.

## Verified so far

`node --test tests/playspace-independent-review.test.ts` — 5/5 pass.

- Arrival briefing prevents world actions. Dismissal exposes two simple pieces and no available locations.
- Direct combination advances to landing briefing once, preserves existing piece coordinates, and yields exactly one available location.
- Self/invalid combination and wrong/unavailable deployment leave model unchanged.
- Contact-loss briefing occurs once; repeated completed deployment cannot retrigger it.
- Debug checkpoints are deterministic at every stage, with unique piece identifiers.
- World expands progressively, move clamps world boundaries, and serialized/restored positions survive stage advancement.

These are model tests, **not browser interaction or layout passes**.

## UI review checklist (pending implementation)

1. Dismiss NASA arrival briefing: only world plus two pieces, with separate collapsed debug affordance; no persistent recipes/tasks/locations.
2. Hover/focus a piece: anchored legal partner + result hints, no output-first action or hidden confirmation.
3. Drag piece to partner: combines on release. Drag onto empty space moves only. Invalid drop gives feedback and does not consume/teleport original pieces.
4. Click/tap piece then partner: same single combination, no extra Confirm. Selection can be canceled.
5. Landing briefing dismissal: one location rectangle, no permanent panels.
6. Beacon placement triggers contact-loss message; dismiss shows task overlay, progressively unlocks later locations, preserves prior piece positions.
7. World is scrollable at mobile and desktop sizes. No forced recenter on move or combine; new unlocks reachable.
8. Debug jumps/reset/undo/repeated messages behave deterministically, clear stale selection/drag state, and do not corrupt saved state.
9. Reload retains state and piece coordinates. Missing/corrupt save recovers safely.
10. Keyboard focus, Enter/Space combination fallback, Escape cancellation/modal semantics, and touch target size are usable.

## Verification limits

No actual browser test has run for this staged implementation. Prior environment restrictions rule out retrying cross-namespace localhost, blocked Chromium launch sockets, and forbidden data/file URL navigation. Private hosted page access must use an officially supported authenticated browser route arranged by the root agent, without exposing credentials or changing audience.

## Source findings and builder fixes

Reported and now fixed in source:
- Invalid drag onto a wrong partner/location previously fell through to movement and overlapped the target. It now snaps back and announces invalidity.
- Initial second piece was entirely outside a 375px viewport. Starter centers now 120/280.
- Output creation could place new pieces beyond world bounds. Creation now clamps coordinates.
- Briefing could clip its dismissal control in a short viewport. It now has viewport-bounded scrolling.
- Save restore accepted inherited object keys as kinds and off-world coordinates. These now reject safely.

Further reported: Undo after a briefing dismissal can loop by restoring the briefing, whose dismissal recreates the history entry; builder is addressing. Landing-location scroll discoverability and focus restoration also reported.

## Synthetic event coverage

`node --test tests/playspace*review.test.ts` — 14/14 pass as of the initial UI review.

Seven tests exercise the actual application event handlers through an intentionally minimal synthetic DOM adapter; seven exercise the model. Synthetic coverage includes direct click combination/deployment, stage-specific tasks, invalid click feedback, Escape, debug jump/reset/repeated briefing, direct pointer combination, invalid drop snapback, empty-ground move, canceled gesture, and full progressive completion.

The adapter does **not** implement CSS layout, native keyboard activation, real event bubbling/capture, touch scrolling, pointer capture behavior, browser hit testing, or browser focus management. Pointer targets are injected. Therefore these are handler-logic tests only, not evidence of successful desktop/mobile physical interaction or layout.

Actual browser route status: root verified the official service-access header route exists for non-user requests, but supported CUA browser APIs do not expose safe request-header configuration. Hosted CUA remains private sign-in gated. No credentials were obtained or injected by reviewer, no audience change, no forbidden routes retried.

## Final regression pass

15/15 tests pass after the briefing-history fix (8 synthetic handler tests + 7 model tests). The undo regression explicitly verifies undo after contact-loss dismissal returns to the pre-deployment stage, and a second undo returns to the pre-combination stage—no briefing loop. Synthetic reload additionally verifies restored stage/coordinates and corrupt-save arrival fallback.

Landing briefing now explicitly mentions scrolling right on small screens, and modal dismissal focuses the focusable playspace. These are source-level accessibility improvements; native keyboard/focus and mobile scrolling remain browser-unverified.

Deployment legibility: root and reviewer requested showing the installed design inside the completed location, not merely “Active”, plus explicit reusable-copy semantics. No finite inventory system is requested or implied.

Deployment label fix verified in both experiment and Site source: completed rectangles now identify the installed design (`✓ Rescue beacon installed`, etc.), and clicking a completed location explains that its reusable design remains on the playspace. Re-ran all 15 independent tests against `/workspace/shared/combination-playtest-site`; all pass. No remaining known blocking handler/model issues identified in this review.

## Additional geometry regressions (pre-publication)

Root identified that the first location still required premature scrolling and two outputs sharing a parent could spawn at identical coordinates. Builder corrected both. Independent regressions now verify:
- Capsule and initial pieces/output fit the 375×667 local area without occluding one another (geometry arithmetic, not rendered-browser evidence).
- New output placement is deterministic, separates checkpoint pieces, and does not reposition existing pieces.
- First output avoids the *imminent* capsule even if the player moved its parent before combining. Reviewer found and builder fixed this additional edge case.

Final Site-checkout results: **18 independent tests pass; 25 total staged-UX tests pass; full `npm test` passes 30/30; `npm run build` passes (TypeScript + Vite).** Final independent tests copied into Site. Browser-verification limits above remain unchanged.
