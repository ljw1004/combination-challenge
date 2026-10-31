# Narrow chooser regression baseline

Observed by root through the cloud Chromium browser, 2026-10-27 21:06 UTC. Source Site commit 4af8fb7843d680f6a924f6655c60809260fe7917, managed local preview campaign.html. Not a physical iPhone test.

At actual viewport 500 × 761 CSS pixels, chooser top20, height1319.875, bottom1339.875; #app overflow:hidden. The final return link starts at1265.875. A native downward scroll of two pages left chooser top20, app scrollTop0 and document scrollTop0. Lower journey choices cannot be reached through ordinary scrolling. Accessibility still enumerates them, so an AX-only click would obscure this bug.

Controller revision is adding an explicitly scrollable flex child chooser. Retest after integration; no fix verified in this baseline.

## Preliminary fixed-controller verification,21:11 UTC

With the pending v5 controller/worker adapter copied into the Site working tree (not deployed), chooser is761px tall, scrollHeight1075px and overflow-y:auto. Native two-page scroll reaches scrollTop314, placing the last link at658.875px in view. Old Causation and School links are absent from active chooser. This was the five-mini provisional data list, not final nine-game content.

The existing Food legacy-JSON save restored at chapter2 with Bread objective done and Yogurt unfinished. Opening/closing Mission caused the rendered 'Saved on this device.' status. Reload preserved the same chapter, items and objective state, without replaying the instruction popup. This verifies a real browser Worker save/load path for that small save, not yet full-campaign quota/performance or physical iPhone lifecycle behavior.
