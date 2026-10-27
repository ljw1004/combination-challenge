# Mars v3: current-scene packing

## Result

The same complete goal routes now have much smaller local populations, without changing the combinations needed or asking the player to run retrieval errands:

| Witness | Combinations | Earlier v2 peak | Current v3 peak |
|---|---:|---:|---:|
| Repair-first |194|36|25|
| Tow-first |197|35|26|
| Optical-beacon-first |198|36|25|
| Broad current-area sweep |211 (previously214)|37|26|

This is an authored mechanical test, not a fresh-player fun result or browser layout test. Multi-slot tiles are taller than simple objects;25 items does not prove one-screen play.

## Packing rule

The full candidate removes its previous all-future explicit carry lists. Engine v3 derives the **current** scene's objective dependencies, including alternative producer routes and required slots. It stops expanding a branch when the needed existing intermediate is available. It collects those actual known objects from already-visited places during narrative travel. The object's identity, installed components and incorporation history remain unchanged; transfer evidence records source and destination. Future-only supplies stay behind.

The current scene's contextual cache still opens with its broad believable stock, not merely the exact items needed. Optional local activities remain possible where their ingredients are present. Abandoned optional projects are not fetched merely because they exist somewhere in the catalogue. The sweep therefore finds211 rather than214 recipes without manual revisits. No claim is made that every catalogue recipe is surfaced on a single ordinary route.

Examples from the repair witness:
- Weather takes the solar charger and controller from the rover scene, and the annotated map from the outcrop. The old specimens remain behind.
- Relay takes the actual panel from the landing site, dish from the rover scene and weather route map from the station.
- Rescue takes the existing toolkit, heater, patch and rover. The station and relay stay at their established places.
- The later specimen-return chapter collects the real recorded ice/core/sediment evidence from the visited scientific sites; it does not recreate it or require the player to manually hunt it down.

Mars remains a location-based expedition. Automatic collection should be presented as a narrative packing/travel beat with visible source provenance, not an invisible inventory or spontaneous appearance. This engine evaluation does not itself implement that UI presentation.

## Evidence and preservation

`results/verification.json` independently replays repair, tow and beacon routes plus the broad sweep on the same unmodified scenario. Every moved object must have a transfer record from a visited source, preserving kind/slots/incorporated objects. Old fixed locations never move; travel deletes no old objects. All17 stages finish and manual visits remain zero.

Earlier candidate and results are preserved in `comparison-v2/`. Frozen `slice-v2.json` is **unchanged** and its checkpoint is verified against frozen v2 engine, not against new packing behavior. Do not regenerate that pilot while its independent trial runs. `freeze_slice.py` is an authoring utility, not part of the test command for this v3 update.

Current evidence establishes these four witnesses, not every arbitrary action ordering. The remaining late-story authenticity and assembly-density caveats in `RESULTS.md` still apply.
