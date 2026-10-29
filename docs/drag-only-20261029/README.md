# Drag-only interaction successor — 29 October 2026

## Scope and provenance

Isolated local candidate of the live journey-cleanup source (seal `7629a2f122270c3b08a19a24e6251ae63f2f0178639b7576258b15ae003a4395`). This package changes the shared controller, presentation CSS, an optional story-cue field and controller tests. It does **not** change recipes, supplies, location ownership, carry, engine semantics, save identities, background images or authored narrative. Nothing was published or pushed.

The parent integration combines the separate entry-layout and plain-language authoring work. Its aggregate/build/source-guard verification is still required. The layout worker owns validation of the optional context-heading field alongside its own independent schema changes.

## Interaction contract

- There is no selected-tile game/UI state. Single tap/click never combines, moves, visits or reads. Combining and placement require an owned drag. Partner/placement hints are transient during a press or drag; release, cancel, capture loss, blur, resize and popup interruption clear them.
- Legal partners use dark contrasting rings, an outer light keyline and a dashed shape cue; impending drops use an orange/dark ring. This works on things, gold goal things and hotspot frames without changing their coordinates or hiding labels.
- A completed first tap is remembered for 360 ms. A second press of the same thing within 24 pixels is reserved for double-tap reading. Moving that second press 8 pixels cancels it rather than turning it into a drag/combine. Canceled/moved gestures suppress the associated native `dblclick`. Pointer Events own modern touch; legacy Touch Events remain a fallback with strict finger ownership.
- Double-tap/double-click (Enter/Space for keyboard access) opens `Item.reading.text`, otherwise `Item.description`, otherwise the existing item label. There is no selected Read button and no attribution, source or citation chrome. Research metadata remains unchanged.
- An item associated with an **earned** milestone replays that wonder instead. Replay state is controller-only: opening/closing a replay does not change achievements, acknowledgements, history or saved bytes. A pending automatic wonder remains pending even if manually replayed. Functional wonders cannot appear from an unearned shell. Existing optional discovery illustrations are retained.
- Completing objectives never schedules chapter advancement. A down-arrow button indicates a different next story location; a right-arrow button indicates a same-location beat or finish. Its destination preview uses the same engine advance/skip/bridge cascade without committing it. Only an explicit arrow click commits that advance and immediately scrolls to a new location. Created items can be read first; once-only automatic wonders still appear after the creation cue, before an advance is accepted.
- Reload of a ready chapter retains its readiness arrow rather than advancing. Undo can remove readiness. Existing skip/bridge policy and historical saves remain model-owned.
- Objectives sit at bottom-right inside the board's stacking context, beneath thing hit targets. They are unselectable text, not `[data-target]` game operands. Clicking uncovered objective text opens the current story; overlapping things receive the pointer hit instead.
- Ordinary chapter popups contain plain story text, with no chapter titles. Optional `ChapterEntryCue.contextHeading?: string` adds an italic meaningful era/place heading. No title, speaker or source-caption fallback is inferred. Ending controls remain.
- Existing keyed board/viewport/location/image nodes stay connected. No background-art swap, flash shield or opacity reduction was added.

## Intentional test migration

All 104 tests from the prior shared-controller suite are retained as current-grammar regression tests. Test inputs that once selected two tiles now perform an owned pointer drag; advancement inputs now click the visible arrow rather than firing a timer or calling engine advance. Selection/Read, automatic-handoff, citation-chrome and top-right-overlay expectations were replaced by the explicitly requested contract. Existing engine tests were not edited or disabled.

Three additional controller suites were migrated similarly: location story, connected image lifecycle and the Elements cleanup route controller. Their original bytes are preserved in `evidence/predecessor/` with hashes. This archive is historical evidence, not a second executable UI implementation. New Elements controller evidence is written to `results/drag-only-elements-controller-20261029/`, not over its historical result path.

The new `tests/drag-only-controller.test.ts` covers the input grammar directly, touch-like pointer/fallback ownership, second-tap cancellation, stale input, readiness/reload, arrow direction after skip cascades, ordering of reading and automatic wonders, repeated wonder replay, Undo/save invariance, illustrated replay, optional context heading and persistent image identity. The synthetic DOM now keeps style properties synchronized when a style attribute is patched, allowing cancellation tests to inspect restored geometry rather than stale harness values.

## Evidence and limits

- Strict TypeScript (`tsc --noEmit`) passed before final combined regression execution.
- Focused canonical location/image/new-gesture regression run: 67/67 passed before the additional pending-wonder replay case was added.
- Legacy shared controller migration: 102/104 passed on the first complete migrated run; both remaining cases were corrected for explicit drag/explicit travel and passed in a 3/3 focused run. No case was removed.
- Final combined controller regression: **188/188 passed**, zero failures or skips; 85.2 seconds. Full output is in `evidence/controller-regression.log`. Command: `node --test experiments/tangible-campaign/ui/campaign-controller.test.ts tests/drag-only-controller.test.ts tests/location-story-controller.test.ts tests/location-image-lifecycle.test.ts tests/elements-journey-cleanup-controller.test.ts`.
- Real supported CUA Chrome check: see `evidence/cua-desktop-hit-layer.md`.

Synthetic tests do not prove native mobile layout, touch behavior, historical truth or enjoyment. The narrow Chrome check is not native iOS evidence. No device-emulation, unapproved browser driver or hidden browser scripting was used.
