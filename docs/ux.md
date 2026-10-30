# Interaction and visual guidance

This document owns player interaction and visual presentation. Preserve the old workshop's successful feel: warm paper palette, outlined cards, square hotspot frames, high-contrast partner/drop states, native reading dialogs and explicit chapter arrows. Game semantics come from the [Markdown specification](story-format-spec.md).

- The work surface is a compact portrait panel with readable labels, vertical scrollback and visible scene artwork. The reference size is 390 × 844. Phone width must not create horizontal scrolling or tiny touch targets.
- Things are rounded cards; hotspots are fixed square frames. Slots live inside a named construction, use compact rows, and show named empty-slot hints only when authored. Installed parts are labelled. No result catalogue or click-to-build menu belongs in player mode.
- Hover or press shows compatible existing partners. Keep those highlights through a drag, including over rich artwork. A creation drop must look different from an ordinary placement. Do not preview the future result name.
- Dragging a thing moves it; dragging empty space scrolls. Distinguish double-tap and long-press reading from movement; pointer cancellation must not commit a move or combination.
- On a successful combination, surviving dragged A returns to its exact source position/placement. B stays put. A retiring transformation is replaced at its source; other new results appear near the receiver. Animate the birth without forcing a wait. Never duplicate an existing result, including an incorporated part.
- Earlier panels remain in scrollback. Carry uses actual existing objects. New arrivals appear below carried things with a dotted divider when both groups exist. Chapter entry can arrange a fresh surface; ordinary creation, resize and reading must not scramble settled cards.
- Keep terse goals at the lower right, without an “Objectives” heading. They remain readable at full opacity while dragging. Items take pointer precedence where they cover a goal. Clicking unobstructed goals reopens the chapter text.
- When goals are complete, let the result and its wonder remain available. Advance only through the chapter arrow. A new background uses a down arrow; an inherited background uses a right arrow. Respect reduced-motion preferences.
- Reading presents the explanation body before its italic current-name caption. Primitive reading is deliberate. Created-item wonders appear once per applicable configuration/run, can be revisited, and survive saving. Undo must not replay already-dismissed celebrations.
- Keep reset and instructions reachable from each other. Reset fully restarts the instructions and story. Save errors must be visible; avoid gameplay toasts for ordinary movement.
- Keep developer checkpoints, recipes and provenance behind the game menu. Mark synthesized checkpoints visibly. Do not count them as fresh-play evidence.

Implementation and browser-testing practices are in [engineering](engineering.md#browser-implementation).

Sources: [original stylesheet](../archive/legacy-2026-10-30/experiments/tangible-campaign/ui/campaign.css), [rendering/intertitles](../archive/legacy-2026-10-30/docs/rendering-and-intertitles-20261029.md), [small-scene fixes](../archive/legacy-2026-10-30/docs/small-scene-hotfix-20261029.md), [layout rationale](../archive/legacy-2026-10-30/docs/scene-entry-weighted-layout.md), [human design decisions](../archive/legacy-2026-10-30/DESIGN_PRINCIPLES.md).
