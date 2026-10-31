# Elements v4 — causal descriptions and a cleaner navigation chapter

## Result
The full source-aware replay still completes **196 distinct creations**, with **28 things maximum in the current scene**, no manual retrieval trips, and six placements. There are200 authored recipes,204 things and now30 stages. Removing the separate one-combination mapping transition saves one advance, not one creation. The19-recipe prepared pilot also completes, with18 things maximum locally.

These are legal authored routes, not fresh judgments of fun. A previous source-blind player completed the19-creation v1 pilot voluntarily; that is evidence for that small slice, not this full game. This revision responds to their concrete confusion without inventing harder decisions.

## Changes
- Every one of the204 things has a distinct, concrete description of its material, form or function. Wood is rough timber; planks are flat cut boards. Descriptions are available before combining and do not enumerate ingredient pairs or hidden outputs.
- The smooth rim of a Wheel, the teeth of a Wooden gear, Waterwheel's unconnected turning power and Millstone's lack of independent motion establish a readable mechanical relationship. The miller asks the player to get the stream's motion to the grinding stone, not to find a named recipe.
- The old Axle output is named **Wheelset**, accurately describing Wheel+Wood as a wheeled undercarriage. The stable internal identifier remains `axle`; it is not exposed as the displayed name.
- Hinge no longer misleadingly uses that wheeled undercarriage. **Iron+Nails→Hinge** represents metal leaves joined by a pin. This remains a compact fabrication abstraction, not a complete bill of materials.
- **Stone+Water→Hammerstone** replaces Stone+Axe→Hammer. A rounded hand-held pounding stone differs recognizably from an edged axe. Museum evidence supports cobbles used as striking tools; primary abrasion research supports rounding during transport. The recipe explicitly compresses that natural process and selection, rather than claiming water instantly makes any stone into a safe tool. No new intermediate or quota recipe was added.
- The navigation-chart synthesis joins the night-sky chapter. Geographic records still come from the actual earlier crossings/landings; the map is carried, not the bridge or lighthouse. The isolated one-combination mapping stage is gone.

## Files
- `scenario.json`: full v4 campaign.
- `pilot-scenario.json`: revised prepared Crossing→Mill→Bakery trial. Same initial items, recipes and goal conditions as frozen v1; only descriptions, Wheelset label and miller's motivation change.
- `descriptions.txt`, `build.py`: authored source and deterministic generation.
- `evaluate.ts`: source-aware legal engine replay.
- `metrics.json`, `solution-actions.json`: full route evidence.
- `pilot-metrics.json`, `pilot-actions.json`: small-route evidence.
- `content.test.ts`: schema, description coverage/uniqueness, targeted recipe identities, merged objective, full/pilot completion and unchanged pilot starting-material/recipe/goal checks.
- `manifest.json`: content identities; `evidence-hashes.json`: exact tested input/engine hashes.

Run `python build.py`, then `node evaluate.ts`, then `node evaluate.ts ./pilot-scenario.json ./pilot-metrics.json ./pilot-actions.json`, then `node content.test.ts`.

## Explicit limitations
- The parent is repairing CLI item-to-location drop parity in engine v4. Dough dropped on Cellar should place it as the UI does; that pilot failure was not a fermentation content rule. This content revision does not work around the engine bug with a new recipe.
- The full game still contains significant simplified fabrication: Cloth+Air→Bellows omits sealing/support, and optical, ceramic, clockwork and metal recipes compress several operations. Descriptions clarify the intended objects but do not establish physical completeness. Institutional source caveats remain on glass, clocks, soap, plants and water preparation.
- No finite resources, choose-two goals, hidden benches or automatic deletion of finished things were added.
- A computer proving a recipe path is not a player discovering it. The long campaign still needs an independent source-blind v4 trial, allowed to stop when no longer enjoying it.
- The user values comfortable, clear progress. This revision deliberately does not manufacture branching choices or extra difficulty to make every move consequential.

All earlier full-v3, frozen-pilot and failed comparison evidence is untouched. No live site or repository publication was performed by this author.
