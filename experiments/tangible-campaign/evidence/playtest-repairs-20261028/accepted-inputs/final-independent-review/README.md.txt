# Final integrated graph and composition review

## Verdict

**PASS within the requested bounded semantic/source/model scope.** No unresolved defect found. The exact code, content, delta, inverse and snapshot pins are recorded in `source-pins.json`.

Candidate: `/workspace/shared/combination-playtest-repairs-integration-20261028`.

- Mars: `36d090ae5071c7c56d6d5dd2d7109b7b09501b6767cf6f0b033b9e2094b036c2`
- Elements: `f047ad9471f48769bd48bc25691df88aa9390a9d99edb6a90fa9e218e4a7cb21`
- Model: `0b227ce53a00c9f316117a810d701731f73d1d896e628721c19821c76caee490`
- Campaign main: `af42383049b98908fe5197f09d8d657c06936a909f92a1fd95a4bd46e09800c7`
- Semantic delta: `b221899121339ab07a0d7c9a09c1111bf2fa72eec1b46d1267c016c3616586e9`

The final Mars/Elements text changes after the initial review pins are exactly two and three TypeScript non-null assertions on validated lifecycle maps. Removing only those characters recreates both earlier supplied SHA256 values. There is no runtime semantic change (`non-null-only-delta.json`). The amendment integration receipt was initially stale; the integrator corrected it, and this reviewer verified its final hashes match the files before sealing.

## Four amendments

1. **Lantern asymmetry is preserved.** `signal-5-signal-lamp` exclusively transforms the Lantern because Signal lamp supplies its bench use. `camp-lantern-bracket` is not exclusive: its exact conflict waiver correctly preserves the separate still-unmade Signal lamp → Signal beacon function. Real-recipe subgraph tests exercise both orders and both camp drag directions, preservation, Undo and save/restore. Both independent functions remain reachable.
2. **Mounted telescope is not forced exclusive.** Its scoped waiver is supported by the actual independent `magnifier + telescope → microscope` recipe. Mount-first and microscope-first both retain the loose source while the other construction remains unmade, and mounted optics can still produce Star chart.
3. **Mailboat retains the boat's identity.** Original Mailboat now transforms Sailboat, incorporates Letter and preserves the boat. The invitation alias also transforms Sailboat. Both routes, both drag directions, placed-position inheritance, existing component preservation, expected message retention/removal, Undo and restore pass. Letter has only the original Mailboat consumer.
4. **Waivers remain exact and live.** Combined current six worlds plus Light have exactly 26 warnings: the previously manually reviewed 24 Elements stock/portion warnings plus the Lantern and telescope cases. No unwaived warning or Mailboat contradiction remains. Removing either new waiver fails its exact warning. All 24 baseline warning keys and reasons are unchanged.

## Bounded interaction evidence

`composition.test.mjs`: **8/8 pass** (`composition.log`). This suite does not rerun the full aggregate.

- Strict inverse of the six property changes equals both exact before-snapshot exports. A mismatched successor field is rejected; unrelated fields are not silently stripped.
- Crawler exclusive replacement remains at the predecessor's position and never exposes a retired identity as a reciprocal placement candidate.
- Crew label changes are projection-only and reserve the maximum label footprint. A later visible placement objective appears reciprocally after sheltering; placement makes it gold, and Undo restores the unmet highlight.
- Resizing transforms every saved history width; Undo restores the earlier crew label and valid predecessor state. Querying labels, views or partners does not mutate game data.
- Old saves containing both disabled and repaired crawler remain intact through save-envelope encode/decode and the final restore path. No retroactive deletion is introduced.
- The actual `ensureTops` helper was extracted and exercised as a pure function without a browser or DOM: only visual area offsets change, overlap moves down, scroll remains anchored, repeated calls are idempotent, and model tokens/places/history stay byte-identical. Undo intentionally does not compact the already-expanded visual offsets; model history remains exact. Save-envelope roundtrip retains offsets and game independently.
- Static UI composition review confirms rendered labels use `itemDisplayLabel`, reciprocal highlighting includes `placements`, and commit/Undo clear stale item/location inspection before rerendering.
- All **33 non-current registered historical scenarios remain JSON-identical** to the verified fork baseline. No historical omission or change.

## Limits

No source edits, aggregate-suite run, browser/DOM interaction, native UI/touch testing, build, deployment or publication was performed by this reviewer. The pure offset-helper check is not a visual-layout or scrolling test. Actual-recipe subgraphs challenge alternate ordering and interaction contracts but are not full-story route runs. This review approves the pinned semantic/source/model composition, not unreviewed later changes or external publication readiness.
