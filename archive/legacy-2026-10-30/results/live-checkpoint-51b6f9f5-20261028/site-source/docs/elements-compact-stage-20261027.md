# Elements compact stage mechanics

Changes based on Lucian's 2026-10-27 playtest:

- The physical board is centered and at most 600 pixels wide, matching Mars. Phone widths remain fitted with vertical-only scrolling.
- Gold is derived only from the current stage's satisfied capability subobjectives. A Window qualifies for the current Light option; Glass alone does not. Historical witness records remain save-compatible but do not color previous-stage objects. Advancing clears old-stage gold, undo restores the previous stage's relevant gold.
- New discoveries choose one of the eight immediately adjacent positions around the target. Diagonal positions have a two-pixel horizontal and vertical gap when unclamped. A clear immediate position wins; otherwise the least overlapping immediate position wins, weighting source operands more heavily. No remote vacancy search and no old-object rearrangement.
- The controller passes actual board width to geometry, so the nearby placement remains nearby on phones and on the capped desktop board. Birth animation is retained and new results are drawn above old objects.
- All surviving objects stay tangible and chapter carries still preserve group arrangement. The warm cellar remains at its original place.

Validation: 34 model, synthetic DOM, mobile-geometry and independent randomized-order checks passed. These include all authored routes, all recipes, 100 shuffled discovery orders, touch-event controller handling, resets/undo, stage gold, and immediate placement at 320/375/390/600 pixels. Native browser rendering and physical phone touch are not established by these tests.

Superseded test expectations were deliberately updated: persistent historical gold and an absolute no-overlap birth guarantee contradict the new requested behavior. Close least-bad overlap is now permitted, but creation never removes or moves surviving inputs.

Final placed-target correction: a mixture drawn 68% down the 70px cellar frame is 12.6px below the stored location center. Birth origin and adjacency use that actual rendered target center. The additional regression passes (5 compact tests total); aggregate post-correction evidence is recorded by the release owner.
