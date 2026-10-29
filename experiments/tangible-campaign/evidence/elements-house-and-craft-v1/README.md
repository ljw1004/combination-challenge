# Elements: house and craft successor

Local candidate over live commit `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c` and the separately frozen House candidate.

**Identity:** `elements-house-and-craft-v1` — 30 chapters, 211 items, 224 recipes; 197 canonical combinations. No new starting supply. No runtime, renderer, stylesheet, registry, old scenario or saved-game identity is overwritten.

## What changed

1. **House:** the same House has two required, unlabelled slots for Window and Sleeping mat. Hearth is optional, made from the previously free Stone + Fire pair. Window's outside supply stays for later uses; Mat and Hearth incorporate at their installation. The build goal becomes the furnishing goal, and an incomplete House is not gold. See the frozen House evidence for the source-blind logical check and its automatic-handoff limitation.
2. **Ceramic identity:** Clay jar remains a Glazed clay jar after coating and firing. It does not become a narrow-necked bottle. The recipe explicitly includes the potter's firing, with no trip to a later kiln location. Covered and filled water jars keep their ceramic identity. Pouring from the prepared-water serving bowl retains that bowl outside the jar.
3. **Glass choice:** Glass + Air makes a Glass bottle through explicitly compressed glassblowing. Cider can fill that bottle **without making Glaze or a glazed jar in the orchard**. Ceramic and glass fillings produce separate, honestly named Cider jar / Cider bottle objects, both satisfying the `portable-cider` goal. No downstream consumer needed rewriting because the former cider container had none.
4. **Hourglass:** the optional timer uses the glass vessel, reshaped into connected clear bulbs, instead of opaque glazed ceramic. Its heating, shaping, joining and calibration remain explicit craft compression, not a complete manufacturing procedure.
5. **Mining:** Stone hammer is the familiar name for the same hand-held rounded stone, with no invented handle. Its quarry recipe chips an exposed seam. A direct Stone + Quarry alternative removes the requirement to wet a stone before obtaining ore; the selected stone hammer remains useful for driving posts.
6. **Weaving:** Thread + Dye makes Dyed thread; Loom + Dyed thread makes Patterned cloth. This replaces the two former mandatory actions at the same count, instead of pretending finished cloth can be rewoven. Whole-cloth dyeing remains an optional valid craft.
7. **Nails:** Iron + the existing Forge replaces Iron + Stone hammer. Heat, hammer, anvil and heading tool are explicit in the stocked-forge context. The Forge is already made before nailmaking in chapter 9; there is no new hot-iron item, extra step or backtracking. Brick + Window → Tower is deliberately unchanged, as the user's later question asked for consideration rather than necessarily removal.

The first ten canonical creations are unchanged. The structural changes use a new identity, and all 31 new checkpoints are earned route prefixes. Opening-wheel and frozen House content are untouched.

## Review and evidence

The independent authenticity director reviewed the exact 224-recipe successor delta and found that both HIGH findings in the original 217-recipe Elements ledger were substantively resolved: opaque-ceramic Hourglass and finished-cloth reweaving. Two review corrections were then applied: precise “glazed clay jar” challenge wording and retaining the serving bowl when pouring into the covered jar. This is **not** a claim that every inherited MEDIUM concern has been fixed.

The focused suite covers 384 complete variants of the existing 96 alternate families × two cider vessels × two mining paths, plus 16 House warm/cold/reversed/vessel/mining routes. All later chapters use an earlier creation in actual goal ancestry. It also checks canonical first ten, all 31 new checkpoints and old-save isolation, both filling directions, exact undo/save state, optional Hourglass order, unglazed-Jar rejection, no-glaze orchard completion, direct mining before a Stone hammer exists, optional whole-cloth dyeing, and retained water-serving bowl.

No browser, native UI, human or visual playtest was performed. The frozen House source-blind reviewer used only the public logical player surface; its result does not certify UI layout or enjoyment. The production registry is intentionally unchanged here, so the build's normal content gate does not yet register this new world; the focused suite separately validates it. The integrator must rerun content/build checks after registration.

## Integration

Required new source modules:

- `experiments/tangible-campaign/ui/campaigns/elements-house-components.ts`
- `experiments/tangible-campaign/ui/campaigns/elements-house-and-craft.ts`

The first imports the unchanged `elements-opening-wheel.ts`; the second clones the first. Exported value is `scenario` in both. Register/feature only as directed by the parent. Keep the old opening-wheel route/save available. Include the two focused test files and both evidence directories when preserving provenance.

```sh
node --test tests/elements-house-components.test.ts tests/elements-house-and-craft.test.ts
node --test tests/tangible-campaign.test.ts
npm run build
```

## Primary sources and limits

- [Corning Museum of Glass FAQ](https://info.cmog.org/frequently-asked-questions) describes air forming a bubble in heated glass. This supports the material relationship, not a claim that room-temperature glass plus air suffices.
- [V&A: Lucie Rie](https://www.vam.ac.uk/articles/lucy-rie-british-studio-potter/) distinguishes glazing from firing and discusses firing clay and glaze together. The candidate names both actions rather than letting coating alone fire the pot.
- [Timberlake and Craddock, prehistoric British mining tools](https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0717-73562013000100002) documents cobble tools and handheld/hafted variants. The game keeps the tool explicitly handheld and the action quarry-side percussion.
- [V&A: What is tapestry?](https://www.vam.ac.uk/articles/what-is-tapestry) explains coloured thread interlacing on a loom, supporting the corrected weaving input.
- [Science Museum Group: dismantled sandglass](https://collection.sciencemuseumgroup.org.uk/objects/co769) records two glass bulbs and a diaphragm. It supports the output construction, not a literal one-step bottle conversion.
- [Auckland Museum: For the Want of a Nail](https://www.aucklandmuseum.com/discover/stories/blog/2025/roman-nails) describes reheating iron at a forge and making a point/head with smithing tools. This supports explicit hot-working context; it does not prove that a generic handheld stone alone makes finished nails.

All routes remain storybook craft abstractions, not instructions for real indoor fires, glasswork, mining, food preservation or drinking-water safety.
