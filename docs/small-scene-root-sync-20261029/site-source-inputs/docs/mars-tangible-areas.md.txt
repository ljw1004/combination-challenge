# Mars tangible-area revision · 2026-10-27

Supersedes the earlier `mars-mobile-board-policy.md` automatic-hide design following the human's15:00 feedback. **Every surviving token is rendered.** Only authored evolution/incorporation removes physical predecessors; no presentation archive, collection or invisible inventory exists.

## Travel and space
- Advancing a chapter opens a compact adjacent physical board area. The audited future-use predicate is used solely to choose the carried group: all future unmade feasible recipes, future goals (including already-satisfied witnesses), future slots and compatible radio upgrades remain considered.
- Finished pieces stay at their exact old coordinates. Useful pieces carry their horizontal positions and vertical ordering. One shared map translates the group and closes only genuinely empty horizontal bands between card footprints; it never independently regrids or introduces a vertical overlap. New creations use the nearest staggered position that protects surviving central label/hit regions; shallow edge overlap remains allowed. Existing user-arranged overlaps are not silently repacked.
- Carried placed things physically leave the old place and become loose in the new area. Old locations stay in the world. First travel explains “We’re taking what we need with us.” The current-area and earlier-area controls scroll the same world, not an inventory screen.
- Story cache partition remains9 lander /12 habitat and lab /8 cargo and survey /0 final observation. Final science is not a just-in-time delivery.
- Actual cards are96×44px, with compact86/107px Rover cards. The three-column footprint fits320 and375px widths. Empty location frames are96×70px; Rover frames grow to include the real occupant.
- Measured replay arrival extents including card/frame bounds and margins: habitat453px, expedition499px, observations453px. Completed observations509px. These extents are identical at320/375 widths. They are **not** a claim that every phone height fits; tiny screens, deliberately spread arrangements, optional builds and revisiting the earlier glacier may still require vertical scrolling. No horizontal scrolling or extra empty scroll page is added. Rendering gives the current area at most one viewport of minimum framing (`max(actual occupied bottom, area top + viewport height)`), so the browser can top-align a short area instead of clamping and showing old work above it. The framing recalculates after rendering and on resize.

## Goals
Current victory conditions are explicit, individual and persistent rather than flavor-only: three functional requirements have separate To do/Done rows. Mission dialogs repeat the conditions alongside flavor. Actual satisfying pieces and placements glow gold. Earlier chapter witnesses retain gold while they still satisfy those conditions; a vacated place loses its gold rather than presenting stale success. Existing achieved flags continue to drive historical progress.

## Verification and superseded evidence
The unmodified earlier hide/no-travel suite was run first:22 expected contract failures (16 routes assumed no carried placement changes, old Rover sizing, opaque-purpose restriction, place-centered rather than area-centered travel, and3 automatic-hide assertions). These failures were **not** treated as regressions fixed by restoring hiding. Tests now explicitly assert the superseding tangible contracts.

- `tests/mars-expedition-dom.test.ts`:16 complete authored route variants plus pointer/touch/reset/source-return/no-result-preview regressions,320/375 rendered coordinate contracts, explicit conditions, persistent gold and visible prior work. Logical oracle independently replays recipes and accounts explicitly for physical unplacement of carried pieces on travel.
- `tests/mars-expedition-mobile-policy.test.ts`: exact cache manifest, initial fit, future travel usefulness without hiding, tangible content bounds and visible gold final witnesses.
- `tests/mars-expedition-tangible-areas.test.ts`: exact common displacement of a compact group, monotonic empty-gap compression without new overlaps, exact undo/cache restoration, finished work staying behind and gold, measured arrival extents, tall placed/carried Rover bounds,320/375/500px authored Observations center accessibility for every ingredient (including Scoop and Frame), and local births when revisiting the earlier glacier.
- Standalone TypeScript check: `tsc --noEmit -p mars-expedition.tsconfig.json`.

All local DOM evidence is synthetic; native browser layout/hit-testing is the parent publisher's separate QA. No publication or commit was performed by this worker.


### Native feedback correction
The parent’s500px browser pass found an earlier generated Propagator covering Scoop and a Solar charger covering Frame. Carrying was faithfully preserving those problematic birth placements. Birth placement now protects every surviving central hit region rather than solving that problem by regridding travel. The authored Observations fixture is explicitly regression-tested for all item centers at320,375 and500px. This numerical regression supports the parent’s separate native recheck; it does not itself claim native hit-testing.
