# Combination Workshop · Reactive journeys checkpoint

## Current campaign terminology and entry points

**Location** means the whole persistent place/background and its arrangement and ordinary supplies. **Hotspot** means an interactive spot inside it (operand, catalyst setting or placement destination). **Chapter** means a story beat/objectives, possibly at the same location.

`campaign.html` enters the canonical v2 UI/runtime. New campaign work uses `experiments/tangible-campaign/schema/campaign.ts`, `engine/campaign.ts`, `ui/current-scenarios.ts`, `ui/current-campaign.ts`, and `ui/stories/`. Old `schema/scenario.ts`, `engine/model.ts` and `ui/scenarios.ts` are explicitly v1 compatibility contracts/façades; they are not the current authoring API or a second rules engine. Browser save keys and v1 serialized state/history/event fields remain compatible. See the [migration, tests and legacy-exception guide](docs/location-hotspot-terminology.md). The homepage and shared campaign route use this same canonical runtime; older direct routes remain available.


The current homepage opens **Mars: A Light That Answers**. The shared campaign chooser is at `campaign.html`, with six current focuses:

- Mars — connected survival, with carried cargo and the Expedition archive.
- Atlas of Questions — a separately reviewed consistency-repair world for printing, sky evidence and logic. The complete original remains available as **Snapshot: Atlas before evidence repairs**, with its original saved progress.
- Elements — the same opening leads to a House fitted with Window and Sleeping mat, with an optional Hearth. Clay jars and glass bottles are distinct; both can carry cider. Weaving uses dyed thread, the hourglass uses glass, and Nails use the stocked Forge. The canonical route has 197 combinations; earlier versions remain available.
- From Hearth to Supper · The Kitchen Caravan — twenty chapters in ten continuing workstations, ending with supper and provisions aboard the train. The enjoyed earlier Snack Cake journey is retained separately.
- Why This Boat? · The Copy Workroom — a short paired-purpose experiment, not a solved account of causation.
- Doctrine: Grace and Matter · Images and Relics — plainer, shorter text on the opening four desks; the same twelve-desk graph, including the two experimental image/relic cases.

Choose older versions and secondary sketches through the existing chooser. **Atlas · Optional experiment: three disputed desks** is a separate short research branch, not another main focus or a full Atlas replacement. Its normal world route begins with Babylon; the existing Prepared checkpoint control can replay the seven-combination Babylon opening before the three desks. No checkpoint URL feature is added. Exact former Elements and Doctrine worlds stay registered at their original `campaign.html?world=<id>` routes and browser-save keys; new structural content variants use separate identities. Existing saves are not migrated or overwritten. The retained staged playspace and earlier Working Materials checkpoint are still at `playspace.html` and `workshop.html`.

## Playing

Drag or select two things to combine; use normal partner highlighting when useful. Previously made objects carry forward where authored. At a real delivery, existing things stay above a dotted **new items** line and the actual new supplies appear below it. The split follows the objects, not half the screen. Empty vertical gaps compress proportionally only when needed; dense scenes scroll.

The first committed move or successful combination across the line removes it. Cancelled or rejected gestures, reading, reload and resizing do not. Undo restores the earlier split. No fresh delivery means no divider or rearrangement, and old saves are not retroactively relaid out. The former New/Carried badges and arrival list are gone.

Reading a manuscript is optional and deliberate and changes no progress. Undo, local saves, chapter checkpoints and archived direct routes remain available.

This checkpoint has nine meaningful invention celebrations across the active Elements journey: Plant, Wheel, Grain mill, Iron, Sailboat, Printed invitations, Microscope, Soap and Clock. Mars retains its three celebrations for the working Rover, Camp water system and ready Oxygen plant. Cooking has none. The real object stays on the board; Continue resumes play or the next chapter. Pending and acknowledged rewards survive saving, while prepared checkpoints do not replay historical celebrations. The visual treatment uses existing tiles and fitted parts, not new art. Native layout, motion and human enjoyment have not been tested.

Already-earned chapters now react to your progress: routine completed chapters disappear, while a small set of authored story bridges joins the next real task or ending. Partly complete chapters keep their fulfilled goals checked. Real supplies, hotspots, placement witnesses and arrival provenance survive skipped chapters. The same composed scenario and engine rules are available to the UI and logical playtester.

## Reproduce the current checkpoint

Use Node >=22.18 (24+ recommended):

```sh
npm install
node --test tests/tangible-campaign.test.ts tests/reactive-*.test.ts tests/elements-heroes.test.ts tests/atlas-evidence-repair-integration.test.mjs
node --test tests/kitchen-*.test.ts tests/atlas-miniature-*.test.* tests/grouped-arrival-*.test.ts tests/next-*.test.mjs tests/late-*.test.mjs tests/late-mars-content-integration.test.ts
npm run build
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-reactive-heroes-delta.py
```

Tests create their own result directories. The first command covers the full shared-campaign aggregate, including synthetic controller tests. The second adds the current content/grouping integration and retained source tests. No browser server or native browser test is required or claimed. `npm test` additionally runs older unrelated prototype tests; its browser-only Elements test is skipped unless explicitly configured.

`npm run build` performs content validation, strict TypeScript and Vite packaging. Static output is in `dist/`. Source snapshots and prior manifests under `experiments/tangible-campaign/evidence/` are historical evidence, not assertions that old experimental variants are current or proven enjoyable. See [the final integration record](experiments/tangible-campaign/integration/REACTIVE-HEROES-RELEASE-20261028.md) for current selection, shared logical-playtester entry and limits. The milestone prototype record is preserved historical evidence. The [preceding kitchen/Atlas integration record](experiments/tangible-campaign/integration/KITCHEN-ATLAS-20261028.md) remains historical evidence; its original source delta verifier, the milestone-only verifier and the milestone/Atlas verifier apply to earlier frozen batches, not this final successor.

These remain human playtest experiments. Logical completion, source review and computed text sizes do not establish human fun, comprehension, native mobile layout, or historical/philosophical truth. Generic Wheel is storybook craft compression; Doctrine component-row clipping remains a known limitation. No new human or browser validation is claimed.

Known retained-snapshot issue: the independent authenticity audit reports mismatched document payloads in the original Atlas printing chapter. That world remains unchanged as requested; the featured Atlas now uses the separately reviewed corrected world. The optional philosophical branch contains no printing chapter. No whole-catalogue authenticity pass is claimed.
