# Solar lamp continuity: bounded content handoff

## Finding

The private phone screenshot was materialized through the supported Library flow and its actual pixels inspected. It shows Recovery camp (chapter 8), with Solar lamp below the new-items divider. The active registry imports `campaigns/mars-return-cargo.ts`, not the historical `mars.ts` or original named-Mars game. In LIVE86 the lamp is genuinely a finished camp-cache delivery: there is no active recipe that creates it. The opening supplies already contain Lamp, Solar panel and Battery; panel + battery creates the reusable Solar charger. The original named-Mars game did have charger + lamp → solar lamp, but that is a separate world.

No screenshot or private Library payload is included in this handoff or should be copied into the repository.

## Approved bounded change

- Preserve scenario, item, objective, stage and cache IDs; no new item or initial supply.
- Add `signal-solar-lamp`: existing Lamp + existing Solar charger → Solar lamp. Lamp is transformed; charger remains reusable for traction, weather and growing equipment.
- Remove only finished `solar-lamp` from `camp-cache`; adjust its narrative and item description honestly.
- Existing powered constructions may perform the real task, a **lit** workbench: Lantern or Signal lamp + Lamp bracket → Bench lamp, visibly preserving that existing light; intact Signal beacon + Workbench → Lit workbench, visibly preserving the complete beacon beside the bench. No needless downgrade, dismantling or invented battery.
- Give camp explicit carry intent for existing lights and its real radio/refuge prerequisites. Otherwise generic ancestry would drag unused foil, support frame, tripod and battery into camp merely because alternatives now exist. Initial board and other caches are unchanged.
- Add one Lamp + Solar charger action before the canonical first use of Solar lamp, and in corresponding checkpoint prefixes. Main-route delta is **+1 combination**, not +4; recompute counts against the final merged content.
- All existing finished lamps and saved constructed inventories remain untouched on restore. No migration grants or hidden cleanup.

## Files

- `source.patch`: exact patch against LIVE86 source. Passed `git apply --check` on the untouched checkout; do not overwrite an integrated module with a complete stale snapshot.
- `semantic-delta.json`: collection/id/property ledger including exact **before** values for all changed properties, and additions. Use these inverse values for historical-before-Mars-natural-orders/checkpoint preservation fixtures. The checkpoint/action inverse removes only the new Lamp + Solar charger action.
- `probe.mjs`: standalone read-only regression runner. Run `node /workspace/shared/solar-lamp-continuity-20261028/probe.mjs /path/to/integrated/checkout`. It checks applied source when present; otherwise explicitly reports that it is testing only an isolated candidate. It reconstructs original lamp rules from the current scenario without reverting unrelated merged changes.
- `probe-report.json`, `portable-probe-report.json`: logical probe results against LIVE86 plus the isolated candidate. These are not browser or human-playtest claims.

## Verification

Passed schema, input lifecycles, construction continuity and objective flow; fresh canonical route (200 combinations / 231 actions on LIVE86); fresh beacon-first route; all 25 checkpoints; creating the lamp at the opening; actual carried-parts versus cache provenance at camp; either drag direction; Undo/save/restore; duplicate rejection; preservation of the lamp in an old camp save.

The first one-recipe candidate **failed** a real compatibility case: using the old Lamp for glovebox illumination first, then turning it into a Lantern/Signal lamp/Beacon, legitimately consumes the original Lamp before camp. The final candidate explicitly tests all three reachable old constructed-light states, both drag directions, through the entire remaining journey and later guarded-machine fitting. All complete with the chosen light still visibly included. Existing Lantern/Signal lamp source copies remain only because their original later signal-building branch is still unmade, under the existing authored-use safeguard; the final Signal beacon has no remaining consumer at camp and is incorporated without a loose duplicate. No engine-retention behavior was broadened.

Build and full aggregate suite belong to the integrator after composing this with the other approved patches. No full aggregate, Site publication, or user-image publication was performed here.
