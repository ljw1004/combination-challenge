# Interaction and visual guidance

This document owns player interaction and visual presentation. Preserve the old workshop's successful feel: warm paper palette, outlined cards, square hotspot frames, high-contrast partner/drop states, native reading dialogs and explicit chapter arrows. Game semantics come from the [Markdown specification](story-format-spec.md).

- The work surface is a compact portrait panel with readable labels, vertical scrollback and visible scene artwork. The reference size is 390 × 844. Phone width must not create horizontal scrolling or tiny touch targets.
- Things are rounded cards; hotspots are fixed square frames. Slots live inside a named construction, use compact rows, and show named empty-slot hints only when authored. Installed parts are labelled. No result catalogue or click-to-build menu belongs in player mode.
- Hover or press shows compatible existing partners. Keep those highlights through a drag, including over rich artwork. A creation drop must look different from an ordinary placement. Do not preview the future result name.
- Dragging a thing moves it; dragging empty space scrolls. Distinguish double-tap and long-press reading from movement; pointer cancellation must not commit a move or combination.
- On a successful combination, surviving dragged A returns to its exact source position/placement. B stays put. A retiring transformation is replaced at its source; other new results appear near the receiver. Animate the birth without forcing a wait. Never duplicate an existing result, including an incorporated part.
- Earlier panels remain in scrollback. Carry uses actual existing objects. New arrivals appear below carried things with a dotted divider when both groups exist. Chapter entry can arrange a fresh surface; ordinary creation, resize and reading must not scramble settled cards.
- Center terse goals at the bottom of the screen, without an “Objectives” heading. Reserve space for a checkbox beside each goal so completion does not shift its text. Use a light translucent backing rather than opaque badges, keeping the text and checkboxes readable over artwork. Do not dim the goals while dragging. Items take pointer precedence where they cover a goal. Clicking unobstructed goals reopens the chapter text.
- When all goals are complete, keep them in place while any creation wonders are open. After the last wonder closes (or immediately if none opens), animate the goals away and the chapter arrow into the same bottom-center position. Its entrance should make the change visible, distinct from its ongoing attention animation. Do not replay the entrance on ordinary redraws or when reloading an already-ready chapter. A new background uses a down arrow; an inherited background uses a right arrow. Advance only through that arrow. Reduced-motion users get the state change without movement or a forced wait.
- Reading and wonder popups render only their authored Markdown paragraphs and images. Do not append an item-name caption, title or attribution; an italic name appears only when explicitly authored. Preserve authored paragraph order and emphasis, including on later renamed items. Primitive reading is deliberate. Created-item wonders appear once per applicable configuration/run, can be revisited, and survive saving. Undo must not replay already-dismissed celebrations.
- Save errors must be visible; avoid gameplay toasts for ordinary movement.

## Minimal chapter flow

- Do not include a “How to play” screen or instructions control. The natural flow should not pause to explain the interface or ask the player to choose navigation options.
- A chapter popup appearing automatically at the start of a story or after advancing has exactly one button: **Begin**. It has no reset, restart, story picker or chapter-navigation controls.
- Clicking goals deliberately reopens the chapter popup. This is the place for recovery controls, rather than the automatic chapter introduction:
  - After a real move or combination, offer **Restart this chapter** with the conventional circular-arrow icon. Undo does not remove this option. Reading, pressing Begin, cancelled gestures and moves that change nothing do not make it available.
  - Reset restores the inventory, placements and progress captured after the chapter's arrival layout, retaining progress from earlier chapters. Reset clears its own eligibility; saving and reloading preserve both the arrival snapshot and whether a change has occurred. Older saves without a snapshot, and debug Undo across a chapter boundary, reconstruct a legal entry layout rather than recover historical pixel positions. Normal chapter entry captures the actual arrival layout.
  - If no chapter reset is available and this is not the first chapter, offer **Restart story** instead. Never show both recovery actions together. Both are visually subordinate to Close: quiet text-style buttons without peer-sized boxes, retaining accessible names, focus treatment and usable touch targets.
  - Restarting the story requires a separate confirmation explaining that it discards this story's progress and returns to its beginning. Cancelling leaves the story unchanged. The final confirmation remains an explicit destructive decision, not a quiet recovery link.
- Reading earlier chapters means scrolling upward to their existing panels. Ordinary play does not need a chapter selector or a within-game story menu.
- The intended release model gives each story its own URL, with any directory of stories outside this game. This is a product direction, not a claim that separate story URLs have already been implemented.

## Debugging controls

- The top-right control is solely a debugging aid: a subtly shaded insect/bug glyph, without a large button rectangle. Keep it keyboard accessible and give it an accessible name and a usable touch target even though its visible treatment is discreet.
- Keep story switching, chapter checkpoints, recipes and provenance inside the debugging window. Story switching remains available there during development, not in the natural chapter flow. Mark synthesized checkpoints visibly and do not count them as fresh-play evidence.

Implementation and browser-testing practices are in [engineering](engineering.md#browser-implementation).

Sources: [original stylesheet](../archive/legacy-2026-10-30/experiments/tangible-campaign/ui/campaign.css), [rendering/intertitles](../archive/legacy-2026-10-30/docs/rendering-and-intertitles-20261029.md), [small-scene fixes](../archive/legacy-2026-10-30/docs/small-scene-hotfix-20261029.md), [layout rationale](../archive/legacy-2026-10-30/docs/scene-entry-weighted-layout.md), [human design decisions](../archive/legacy-2026-10-30/DESIGN_PRINCIPLES.md).
