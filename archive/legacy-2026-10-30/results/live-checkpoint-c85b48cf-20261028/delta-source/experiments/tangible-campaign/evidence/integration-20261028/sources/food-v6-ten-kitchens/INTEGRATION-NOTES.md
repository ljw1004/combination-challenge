# Integration boundary

This directory is a local candidate only. No live source, GitHub branch, current player session, published game or archive was modified by this task. Root separately promoted arrival, Elements and Doctrine changes to 217ce742; Food remained unchanged.

- New scenario ID: `kitchen-caravan-v6`.
- Played predecessor: `hearth-to-twinkie-v5-sugar-reading`, unchanged.
- `candidate.ts` is a standalone typed export; it was not copied into the live application.
- Keep the popular played predecessor available under its existing direct route and preserve its saves when a later authorized integration occurs. Do not silently load old v5 saves into the structurally different v6 campaign.
- The narrative has eight physical facilities and ten active workstations. The station kitchen is one building with tea counter, dessert room and supper bench. `facility-plan.json` records the distinction. The engine still uses ten area IDs; no engine/schema change is required.
- There are ten transitions between chapters on the same active board. Those chapters have `locations:[]`, `caches:[]`, `carry:[]`: no ingredient delivery, object relocation, repacking or board clearing occurs.
- Workstation changes carry the existing preparations needed for that station’s services. Older objects remain in their previous areas; they are neither deleted nor renamed into new deliveries. New stock is introduced once on reaching its owning workstation, with the kitchen’s larger departments established in the narrative.
- The root task owns the separately published new-supply/carried-item arrival-cue UI revision. This content revision has no UI/runtime changes. Check its independent evidence against the final scenario hash before any combined integration.
- No browser/UI test, full-application build, publication or deployment was performed here. Logical width tests are not mobile usability evidence.
