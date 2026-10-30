# Intentional manuscript reader — 28 October 2026

## Source change

- Optional `Item.reading: {text, attribution}` is validated and exposed only for available source items in `playerView`. Generic descriptions are not displayed or promoted into readings.
- Source fragments remain the same 96px-wide rounded tiles. A small book mark identifies readable text; the key line stays on the tile. Source labels use explicit conservative 12px Arial wrapping, 14px line boxes, and the same calculated height in rendering, packing, arrival spacing, and scroll bounds.
- Selecting a source exposes a separate, at-least-44px **Read [label]** button and focuses it without scrolling. Only activation opens the escaped text and attribution. Close, Escape, and backdrop dismissal remove the reading content and restore the same selection, scroll, and Read-button focus.
- Reading is not a game action or save field. Even selecting a source in an earlier area leaves game history untouched; intentional carrying and dragging still activate its physical area.
- An automatic chapter/ending handoff due while reading is deferred until dismissal, including an immediate reopen. Undo, reset, checkpoint, and newer navigation invalidate stale handoffs.

No scenario contents, routes, or authored quotations were changed by this implementation.

## Verification

These counts record the initial reader revision. The later generalized long-label extension and final counts are recorded in `text-heavy-item-layout-2026-10-28.md`.

- Controller suite: **46 passed**, including nine new reading/escaping/gesture/navigation/completion/sizing tests.
- Tangible campaign aggregate: **126 passed**.
- `npm run build`: **passed**, including content validation and TypeScript. The existing >500 kB bundle warning remains.
- Full `npm test` against final source: **443 passed, 1 skipped, 0 failed** (444 total). The skipped test is the pre-existing native-browser authored-route/touch/scroll suite.
- `git diff --check`: passed.

The 320px/375px sizing assertions are engine geometry plus synthetic DOM/CSS checks, **not native text-layout or physical-touch evidence**. An unsupported ad hoc Chromium attempt failed before browser testing; no screenshots or native-browser claims resulted. Its temporary server and two fixture files were removed. Managed-preview/CUA inspection is left to the integrating parent.

## Integration

Source paths: `schema/scenario.ts`, `engine/model.ts`, `ui/campaign-main.ts`, `ui/campaign.css`, `ui/campaign-controller.test.ts` under `experiments/tangible-campaign/`, plus root `DESIGN_PRINCIPLES.md`. The build regenerated the tracked campaign assets under `dist/`. No commit, push, or deployment was performed by this worker.
