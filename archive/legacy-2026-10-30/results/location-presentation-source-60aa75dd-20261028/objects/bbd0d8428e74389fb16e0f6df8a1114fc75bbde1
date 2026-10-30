# Staged playspace UX experiment

This is a **layout/click/functionality prototype with placeholder Mars story, materials and goals**, not a faithful or complete research scenario. Frozen logical engines and the existing Working Materials checkpoint are unchanged.

## Grammar and sequence

1. Crash/orbiter briefing → dismiss → Wire and Power cell only, plus an explicitly separate collapsed debug control. Drag one onto the other, or click/tap one then its partner, to create Rescue beacon immediately.
2. Briefing introduces Landing capsule. Only pieces and one labeled location are present; drag/click Rescue beacon onto the location to deploy.
3. Contact-loss message → dismiss → outstanding-task overlay, High ridge and Antenna. Antenna + Power cell → Relay; deploy Relay at High ridge.
4. Ice field and Ice / Filter appear across the expanded world. Ice + Filter → Water; deploy at Ice field.
5. Habitat and Seeds appear. Water + Seeds → Garden; deploy at Habitat; completion message.

Task buttons scroll to their location. No header, shelf, craft confirmation, recipe list or counters are part of normal play. Hover/focus/click a piece for temporary piece-anchored partner/output hints; compatible partners/locations are outlined. Selected-piece + blank-ground click moves it, enabling offscreen transport without drag autoscroll. Escape clears selection/hints or dismisses a briefing. Pointer/touch drag and native button keyboard activation are supported; no pixel-perfect hit-testing is claimed.

Compatible outlines indicate only results not yet on the playspace; known recipes remain inspectable with an already-produced label. Positions never automatically tidy/reflow. Inputs/designs remain available after use. Deployment installs a copy, named inside the completed location rectangle, without relocating the reusable design. **Deliberate simplification:** one physical token per design; repeating a known combination gives contextual feedback but no duplicate. Newly created output uses a deterministic nearby free position, avoiding other pieces and visible locations without moving them. The default starter pieces, beacon and first capsule fit within a 375px-wide local area; broad horizontal terrain expansion begins after contact loss. Invalid target drops snap back; blank-ground drops move the piece. New materials appear only at deterministic unlock positions.

## Debug and persistence

`Debug / playtest` exposes deterministic clean checkpoint jumps, restart, reopen briefing, session undo, and original `/workshop.html`. Jumps/reset replace **only this UX save**. Separate key: `combination-playspace-ux-v1`; checkpoint storage remains untouched. Piece coordinates, stage, deployments and dismissed briefing persist. Undo is session-local. Browser scroll position is not saved. Unavailable storage falls back to session-only behavior, noted in debug.

## Reproduce

In research checkout, Node >=22.18 and installed pinned dependencies:

```sh
node node_modules/typescript/bin/tsc -p playspace.tsconfig.json
node --test tests/playspace*.test.ts
node node_modules/vite/bin/vite.js build --config playspace.vite.config.ts
```

Output: `dist-playspace/playspace.html` plus assets. Site source retains all checkpoint source, uses staged UX as `index.html`, and original interface as `workshop.html`; ordinary `npm run build` builds both.

## Verification limits

Tests cover valid/invalid combination/deployment, gates/unlocks, checkpoint jumps, repeats, popup dismissal, coordinate persistence/bounds, corrupt saves, and synthetic DOM click/drag/debug/undo flows. Synthetic DOM tests are **not browser visual, native hit-testing, touchscreen or accessibility validation**. TypeScript and production builds are checked. Publishing owner assesses supported browser access without changing the owner-private audience. Source/model checks are not human playtests or browser QA.
