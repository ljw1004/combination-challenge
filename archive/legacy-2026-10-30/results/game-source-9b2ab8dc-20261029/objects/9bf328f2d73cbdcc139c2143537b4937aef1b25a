# Narrow supported Chrome interaction check

Date: 2026-10-29, approximately 12:28–12:30 UTC.

Method: `sites-preview start` for the isolated candidate, then the supported `mcp__cua_repl` Chrome surface. Preview URL returned by the supported CLI was `http://127.0.0.1:4173/`; the actual page was `campaign.html?world=mars-evidence-repairs-v7`. Viewport was 1180 × 757. This was desktop Chrome, not an iPhone or an emulated mobile browser.

Observed:

1. Dismissed the initial plain story card. The fixed 390-pixel Mars scene retained its rich background art; objectives appeared at the bottom-right and tiles remained readable. The scene's existing top-left stock geometry was unchanged in this interaction-only candidate (the separate layout worker owns its successor).
2. Dragged the Toolkit from its visible tile to the bottom-right objective area. The Toolkit visibly covered the objective, not vice versa.
3. Used read-only DOM inspection at the actual overlap point **(708.515625, 713)**. `document.elementFromPoint` resolved to `data-target="toolkit"`. `document.elementsFromPoint` order was the Toolkit `.thing` button, then `#purpose.objective-overlay`, `.objective-dock`, `.board.fixed-locations`, `.viewport`, and `#app`.
4. Dragged the Toolkit away from that overlapping position successfully. This verifies a real hit-testing case, not just a z-index source assertion.
5. Native double-click on Toolkit opened its explanation with item heading, plain body and a close control, without attribution/source chrome. Closing restored the board. No selected Read control appeared.
6. A native Cable→Broken radio drag created Radio; ordinary pointer input continued working after the explanation and overlap moves.

Screenshots were inspected through the supported tool at these steps. No standalone screenshot file is claimed. Transient highlight contrast was source-reviewed and synthetic-tested; the attempted held-press screenshot did not establish a mid-press visual capture, so it is not counted as visual evidence. Full chapter transitions/wonder replay remain synthetic-controller evidence in this package.

The QA tab was closed and the preview daemon stopped. This check did not publish, change sharing or touch the live Site.
