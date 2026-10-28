# Atlas chapter 5: whose patch disappears?

**Isolated logical-content candidate, 2026-10-28. No browser/UI testing, engine work, publication, base mutation, or fresh-player enjoyment claim.**

## Result

The vague moved-lamp dossier is replaced with an explicitly authored two-lamp case: H is above the aperture, L below, and the receiving screen is on the opposite side at the same distance. Geometry produces **H → lower; L → upper**. A prediction says covering H should remove only the lower patch. The supplied trial also covers L and restores each lamp: the corresponding patch disappears and returns while the other remains. The resulting claim is **crossing did not destroy source-to-patch correspondence in this arrangement**. A separate final result names what was not established: **how an eye senses light**.

These facts are in concrete tile labels and deliberate `Item.reading`, not merely descriptions. `chapter5-visible-surface.json` projects exactly that content, including the unchanged earlier inputs, without recipe or description leakage. Eight local objects have readings; the familiar aperture-board/image-box/camera construction does not acquire a reading quota. Camera construction remains the same three combinations and dark-room placement.

## Actual inherited work, not historical overclaim

The corrected proof's equality reasoning is applied to a new stated straight-path model: equal horizontal runs on a straight line have equal vertical changes. H drops one unit to O and one more beyond it; L rises one and one. The text explicitly says the old triangle proof did **not** establish the physical straight-path assumption. The old underdetermined Moon case now distinguishes a test that rejects an inseparable-mixture consequence from a test that decides between complete eye-sensing accounts. The latter accounts could agree on all these patches.

The cited primary text is [Ibn al-Haytham, *Optics* I.6 §§85–87, Sabra translation (1989), printed pp.90–91, PDF page50](https://resources.warburg.sas.ac.uk/pdf/ffh360b2205460.pdf#page=50). It describes multiple lamps facing an aperture, separate patches, selective screening and restoration, and an argument against inseparable mixing. The actual primary scan was checked from the audit's preserved download, rather than relying on the audit's summary. `primary-verification.json` records the source hash and exact location. Web opening failed because the PDF is too large; the readable local PDF resolved that limit. H/L labels, two lamps, equal distances, unit offsets and the supplied observation table are explicitly an authored adaptation, not a surviving notebook. No retinal theory, full theory of sight, universal method or exclusive inventor is inferred.

## Bounded patch

`patch.id-addressed.json` contains **19 exact entity-addressed operations** with complete before/after values:

- 9 existing chapter-local items;
- 7 existing local recipes (3 operand changes, plus matching descriptions/source citations);
- the Cairo stage's motivation and goal text;
- one newly named primary source;
- the Cairo entry's source list in `chapters.json`.

No item or recipe IDs are added or removed. All 28 other chapters, earlier input definitions, every downstream recipe, locations, carry lists, lifecycle engine and UI remain unchanged. `connections.json` is byte-for-byte unchanged. The original campaign ID is deliberately unchanged for clean disjoint composition; this is a hashed content candidate, not a published or resumable play packet. A parent preparing fresh play should assign its own new packet/candidate identity rather than reuse an old session.

The three justified operand changes are:

| Recipe ID | Before | After | Reason |
|---|---|---|---|
| `make-ray-diagram` | lamp + arabic-proof | source-positions + arabic-proof | The geometry uses the actual positions. |
| `make-predicted-spots` | source-positions + ray-diagram | ray-diagram + lamp | Apply the derived mapping to the two lamps and cover. |
| `make-comparison-record` | predicted-spots + lamp | predicted-spots + camera-obscura | The supplied comparison uses the built aperture/screen apparatus; it is not a second single-lamp move. |

The making and prediction branches may be done in either order. There are still nine local combinations because the existing construction, prediction, comparison and bounded account already serve distinct purposes—not because nine was a target.

## Verification

Run `node --test revision.test.mjs` from this directory.

**13/13 tests passed**, including schema, lifecycle, objective flow, scope, immutable base preservation, exact patch reproduction, disjoint composition and conflict rejection, coordinate recomputation, the prediction/observation/conclusion/limit payload, both branch orders and drag directions, normal highlighting, strict-surface leakage, and actual use of both earlier inputs.

- All **18 projected chapter states / 50 directed recipe transitions** reach completion. Projection includes creations/live objects/components, excludes history/spatial placement, and performs the required dark-room placement before that recipe edge. It is not a complete UI state graph.
- **50 randomized full author-known routes** reach the campaign ending, preserving the later copied-optics, lunar-shadow, induction-comparison, photographic-camera and fictional-imager contracts. See `downstream-routes.json` and `author-route.json`.
- Highlighting is tested as normal gameplay; it is not penalized or classified as an outside hint.
- The final eye-sensing label is present in the automatic transition's final visible state. Its full reading remains available by returning to Cairo. This is logical-source evidence, not a discoverability or UI timing claim.
- No new aggregate application build was run: this is a content-only isolated candidate for later disjoint integration. No source-blind fresh trial was performed here. Reachability and intelligible payload do not establish fun, voluntary continuation, reader use, layout or retention.

## Composition

```sh
python apply_patch.py --base ../revision-v5-baghdad-calculation --output /tmp/optics-composed
```

The default verifies all three base-file hashes. With `--compose`, unrelated prior changes are allowed, but every touched entity must still equal its exact pinned before-value; a changed Cairo entity is a conflict, not silently overwritten. Output must be a different directory. `scenario.diff` and `chapters.diff` provide conventional human-readable diffs. `manifest.json` hashes all delivered files except itself.

**Blocker status: none.** The frozen source remains intact. No remote, live integration or shared publication was edited.
