# Mars connected-survival candidate — 28 October 2026

## Status and recommendation

**Candidate, not published and not human-playtested.** Preserve the existing 24-chapter survival/rescue/return arc. The strongest change is insulating the actual refuge the player restored, instead of introducing a fresh sleeping cabin. The narrow power, water and transport connections give earlier work a practical second use. The weakest proposed connection is relocating the opening signal to mark the refuge: its rescue purpose is plausible, but a source-blind player may still experience it as a repeated administrative placement. Keep that judgment open.

The author read the scenario and recipes. Their logical evaluation is not a fresh-player result and cannot establish enjoyment. A source-blind surface and focused questions are in `BLIND-PLAYTEST.md`; no session result is claimed here.

## Exactly what changed

| Chapter | Earlier creation and accepted action | Why the action matters | Change in main combinations |
|---|---|---|---:|
| Habitat | Solar charger powers the fixed enclosed melt head; the existing powered radio **or** beacon is placed at the refuge signal mast | Stored water has an actual power source; the rescue search is directed to shelter rather than the crash ridge | 0 |
| Night | Thermal screen + previously provisioned refuge → insulated refuge | The same people sleep in the same repaired refuge; the prepared bed and screen stay visible | 0 |
| Waterworks | Water canister + assembled dry water loop → primed loop | A little contained water starts the specified drained process loop; the canister survives | +1 |
| Oxygen | Restored cargo shuttle + flight module at loading bay → docked module | The heavy module reaches its designed loading interface before the plant services it; the fitted hauler survives for specimens | +1 |

The charger/melt-head link was added after the beacon-first witness exposed a real **Rover** continuity gap: if the charger was first made in Rover, Rover used no earlier creation. It is now made at Habitat on that alternate route, without adding an extra combination to that route. The separate reusable heater is still used for later refuge/food/waterworks work.

No new narrator, chapter, art, alternate survival storyline, reactor procedure, or count-padding branch was introduced. Existing character-role speaker labels and the one continuous expedition story remain. The initial catalogue contains 211 Mars recipes; the candidate has 213. Main route: **198 → 200 combinations**, coincidentally near the requested scale, not a quota. Beacon-first witness: 204; tow-first witness: 203.

## Identity, carry and lifetime details

- New identity: **`mars-connected-survival-v3`**. Original `mars-cargo-revision-v2` is left unchanged, including all its checkpoints and route evidence. All 15 original scenario objects in the isolated catalogue compare deeply equal to the immutable fork. Do not migrate existing saves to the new identity.
- Habitat explicitly carries already-created contact devices, the charger, or its existing raw prerequisites when beacon-first play needs to assemble it. No previously created device is reissued in a cache. Contact requires a real accepted placement satisfying a current goal; inventory presence does not count.
- Night returns to **`area-camp`**, where the refuge already stands. The new scene no longer conjures a sleeping cabin or transports the refuge to a different workshop. The final transform inherits the refuge’s exact position in either drag direction. Explicit preservation carries the prepared bed/bedding and screen/frame through the result. Undo restores the prior objects.
- Waterworks still permits the original sensible pump + hose assembly **before** priming. The new action transforms that existing assembly in place and retains its return hose. The canister is not incorporated: only a small portion of the contained water is used. The final loop cannot be completed just by leaving the canister on the board.
- Oxygen’s new dependency causes the real fitted cargo shuttle to be collected from the preceding service-route scene. The module must be at the existing ascent-plant receiving location before docking. The module’s successive states inherit that position/location; the shuttle’s controller/platform components remain identical and it remains available for departure.
- The existing `repair-towed-crawler` alternative already accepts the recovered crawler. Its preservation is now explicit; no duplicate repair recipe was added. The old disabled-state alias is still supported by the inherited runtime. A witness that repairs that old alias rather than the recovered body can evade Workshop’s created-item audit; this legacy representational loophole is **not** claimed fixed or exhaustively ruled out. The natural recovered-body route is tested separately.

## Actual verification and limits

`verification.json` contains full accepted-action, goal-ancestry results for three complete routes. All 23 non-opening chapters are goal-connected in each tested witness, including actual goal-relevant placement. This is **not an exhaustive proof of every possible action order or a semantic proof that a step is compelling**.

The new regression suite tests schema/lifecycles/preservation, whole route and checkpoints, saved-state round trips, separate save identities, required contact placement, actual melt-head power, in-place refuge transformation in both directions, undo, priming and component retention, real shuttle docking and later availability, scene carry without cache duplication, and both legitimate opening/rescue alternatives. Results/logs are in `targeted-tests.log`, `aggregate-tests.log`, and `build.log`; corresponding `*-exit.txt` files record process exits. Build retains the existing large-chunk warning.

Preserved negative diagnostics:

1. `negative-beacon-before-power-link.log`: mechanically complete alternate initially lacked Rover continuity. Corrected by the habitat power chain.
2. `negative-tow-old-alias.log`: the first author-built witness selected the old disabled-state alias. The already-existing recovered-body recipe provides the natural continuous witness; the alias loophole remains documented above.
3. `negative-checkpoint-representation.log`: strict JSON-shape comparison found restored `components: []` versus omitted optional `components`, not lost contents. Round-trip assertion now normalizes only this semantically empty optional field; positions, state, actual component IDs and progress remain compared.
4. `negative-aggregate-fixed-catalog-count.log`: inherited audit test hard-coded nine active worlds/735 recipes. Candidate insertion needed its own audit rows; count assertions now derive from that explicit audited catalogue, while every individual recipe entry remains checked.

Browser/touchscreen layout QA, overall human enjoyment and a completed source-blind playtest are not claimed. No remote write or live-Site change was made.

## Authenticity challenge

- The fixed melt head is a **small, enclosed, already installed mission appliance**, powered over a narrated interval. Do not imply a small panel instantly melts an arbitrary water supply or powers an entire habitat. Its matched electrical outputs are fictional mission engineering, not evidence of a real Mars system’s capacity.
- Priming is justified for the specifically drained process loop, not as a universal fact about every pump. A manufacturer describes filling a drained pump before reuse; the closed compatible Mars ports remain invented mission equipment. [Grundfos FAQ](https://www.grundfos.com/solutions/support/faq/how-can-i-start-the-pump-after-standing-still-)
- The player might reasonably ask why newly treated local water cannot prime the loop instead. The earlier canister supplies the compatible contained transfer; if the source-blind player sees this only as an arbitrary key, redesign this small connection rather than claiming the audit proves it natural.
- The thermal comparison is evidence for this fictional removable screen, not a qualification certificate. NASA treats realistic thermal-vacuum testing as more demanding than an ambient sample test. Keep the existing controlled-cycle framing and do not extrapolate to an entire habitat’s safety. [NASA thermal-testing knowledge base](https://s3vi.ndc.nasa.gov/ssri-kb/topics/59/)
- Real MOXIE demonstrated oxygen production from atmospheric carbon dioxide; it did not establish this fictional full-scale depot, storage/cradle system or instantaneous servicing. Keep the qualified-system abstraction, no chemical or pressure-handling instructions. [NASA MOXIE overview](https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/)
- The existing greenhouse is supplemental food after weeks of growth, not an instant starvation rescue. NASA’s plant work supports engineered water/light/root environments and supplemental crops, not this mission’s precise crop yield. [NASA Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/)

## Integration contract (parent only)

1. Splice `candidate.scenario.json` as a new scenario; **do not replace the full `ui/scenarios.ts` with this worker’s copy**, because other workers are changing other worlds.
2. Retain the old scenario, direct route and save identity. If promoting this candidate after review, update the developed-Mars chooser ID separately; this worker did not change the chooser.
3. Copy `candidate-route-evidence.json` to `experiments/tangible-campaign/evidence/mars-connected-survival-v3-route-evidence.json`.
4. Copy `mars-connected-continuity.test.ts` into `tests/` and import it from `tests/tangible-campaign.test.ts`.
5. Merge only this candidate’s rows/count from the isolated lifecycle `audit.json`, and the small removal of fixed catalogue-size literals in `lifecycle.test.ts`. Regenerate aggregate metadata if integrating other candidates at the same time.
6. Rerun build and aggregate tests after integration. The generic parent audit is at `../continuity/audit.ts`; the worker’s regression uses the same goal-ancestry criterion rather than depending on its scratch path.

`build-candidate.py` and `verify-candidate.ts` reproduce the candidate and complete witnesses from the immutable fork. `changes.json` lists the precise changed/new item, location, recipe and stage IDs. No runtime/schema change is required.
