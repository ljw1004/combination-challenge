# Late Mars: tangible return cargo and truthful cabin record

## Recommendation

**The reported cargo loss is real, not a hidden component tree or an observer-only omission. A small content-only story correction fixes it using the existing engine.** Keep the packed capsule separate while the recovered hauler is prepared, load that actual capsule into the ship mount, preserve the loaded mount through flight, and finish by placing the loaded docked ship at the orbital hatch. Do not manufacture an empty second capsule at the ending.

Use `recommended.candidate.scenario.json` for review, not as an already-integrated change. It combines the separately reviewable cargo correction and cabin/portrait wording, while preserving the four carrier strings already live. Its new research identity is `mars-connected-survival-v4-return-cargo-research`; it is not a migration of old saves.

Independent source-aware review accepts the physical story and ownership on five routes and all 25 checkpoints: see `INDEPENDENT-REVIEW.md`. No actual repository source, runtime, UI, frozen trial input, or closed-session evidence was changed. Nothing was published. No browser or UI tests were run.

## Pinned evidence and independence

- Actual repository HEAD: `c30a7236a0d27ae3e78d83e9e446a2350b8c2662`; git status remained clean.
- Unchanged actual engine SHA-256: `793354131dc6b2cf9a5398e0dc163f5d834e62d477b719e7dedcfdcf6a2c8265`.
- Latest authored Mars input SHA-256: `81d9aee6504bae6cb549b3b70d57de9fbcfe216b6bfe53bd899f0a81da4365ea`.
- `live-versus-authored.json` independently confirms that actual live Mars differs from that authored input in exactly four carrier presentation strings, not in these recipes or ownership declarations.
- Closed source-blind `mars-return-03` stopped after completing 204 cumulative combinations. Its source evidence was read, never rewritten. The current-source witness here is a **source-aware fresh replay of its 238 accepted actions**, excluding its 18 rejected attempts; it is not a new blind trial or the original participant returning.
- `input-manifest.json` records original paths, hashes, copied engine/schema, route inputs, closed-session hash and metrics. `verify.ts` rechecks both originals and copies.

## Where the original cargo goes missing

| Recipe | Actual original state result |
|---|---|
| `departure-pack-ice`, `departure-pack-sediment`, `departure-pack-record`, `expansion-return-comparison`, `expansion-return-comparison-record` | Five actual capsule slots fill. The preserved two-cell case contributes its named ripple impression and gravel chip. |
| `departure-11-specimen-cart` | Incorporates the capsule and preserves both capsule and cart. The resulting cart visibly lists the capsule, five packed compartment items, two comparison specimens, and the hauler's own hardware. This part works. |
| `homebound-5-loaded-capsule-dock` | Retains the loaded specimen cart **unchanged**, transforms only the empty dock, and declares no preservation. The new “Loaded capsule dock” has empty `slots` and no `components`; its bookkeeping `incorporated` list contains only dock, adapter and latch. No capsule transfer occurs. |
| `homebound-6-loaded-ascent-vehicle` | Preserves only `ascent-vehicle`. The ship receives its visible cabin components, not any capsule contents. |
| `homebound-9-flight-ready-vehicle`, `homebound-11-ascending-vehicle`, `homebound-12-docked-vehicle` | Faithfully preserve that already-incomplete vehicle snapshot. They do not recover the stranded payload. |
| `homebound-13-reunited-crew` | Retains `docked-vehicle` and creates `returned-capsule` with empty slots, empty incorporated list and no components. The ending's arrival claim exceeds the represented state. |

Reproducible before/after raw tokens and player views are in `closed-reader.current-source-trace.json`. In the final original view the full cargo is still on `specimen-cart`, `docked-vehicle` lists only cabin fittings, and `returned-capsule` has an empty component list. The same absence is present in raw state.

### What the engine actually represents

These references are to the unchanged local copies, identical to the actual engine/schema hashes in the manifest:

- `engine/model.ts:4`: `slots` is a map of strings and `components` is a flat string array. There is **no nested component tree**, owner pointer, or stored child token snapshot.
- `engine/model.ts:82-83`: preservation unions the declared input's identity (when incorporated), fitted slot IDs, and existing flat components. It does not select a subassembly or subtract anything from a retained source.
- `engine/model.ts:220-222`: installation/creation preserve declared snapshots and remove eligible whole input tokens at the actual event. `incorporated` is bookkeeping, not a second visible recursive construction model.
- `engine/model.ts:262`: the player view shows slot labels and component labels from that actual state. It is not hiding a correct capsule under the vehicle.
- `schema/scenario.ts:6,9`: there is no transfer/detach/extract action or path to a nested child.
- `schema/lifecycle.ts:65-67`: `preserve` must name an incorporated or transformed input; retaining the cart and merely adding it to `preserve` is invalid content.

### Rejected easy fixes

`verify.ts` runs isolated negative controls, not repair candidates:

1. Add `preserve: ['specimen-cart']` to the original retained-cart loading recipe: the content validator rejects it. If deliberately executed below that validator, the engine copies the entire cart's component list to the dock while the original loaded cart remains unchanged—duplicated cargo, plus hauler hardware.
2. Make those whole-parent preservations syntactically valid by incorporating the cart and ultimately transforming the whole docked vehicle: validators pass, but the returned capsule then contains the hauler platform and ascent cabin. Syntactic validation is not proof of a truthful physical story.
3. Address `cushioned-capsule` after original cart incorporation: the action fails because that capsule is no longer a top-level token. A nested identity cannot be used as an independent operand.

Keeping the original exact story—capsule first inside cart, then extracted from cart, then extracted from docked ship—would require a **generic selective subassembly transfer**: retain a child snapshot/boundary, move that selected child and its contents between owners, remove it from the old owner while preserving the remainder, and support undo/save restoration without duplication. No such capability was implemented. The recommended story avoids needing it.

## Small declarative correction

The complete stable-ID delta is `cargo-alternative.delta.json`.

1. **`departure-11-specimen-cart`: prepare the recovered hauler using the actual filled capsule as a sizing reference.** The recipe explicitly says “Adjust the recovered hauler's restraint to the packed capsule's size.” It transforms/preserves `secured-cart`, retains `cushioned-capsule`, and does not preserve or incorporate the capsule. The one filled capsule remains unchanged alongside the prepared cart. This is the same existing preparation action, not added padding.
2. **`homebound-5-loaded-capsule-dock`: load the actual capsule.** Replace the cart operand with `cushioned-capsule`, require `return-sample-set`, incorporate and preserve it. The real capsule disappears into the dock once. The empty hauler stays independent.
3. **`homebound-6-loaded-ascent-vehicle`: preserve both assemblies.** Add `loaded-capsule-dock` alongside the existing `ascent-vehicle` preservation. Existing subsequent vehicle preservation then carries all eight capsule/payload identifiers to docking.
4. **Homebound carry is explicit.** The restored cabin, its record, agreed rendezvous, prepared cart and actual packed capsule arrive at the depot. The cart's own parts do not enter the flight assembly.
5. **Replace `homebound-13-reunited-crew` with the existing placement-victory grammar.** Remove the synthetic returned-capsule item/recipe; the final objective is “Bring specimens to orbital hatch,” satisfied by placing the actual loaded `docked-vehicle` there. The ending says the crew is through the hatch and the capsule remains secured in the docked ship.
6. **Make the portrait's informational copy explicit.** `departure-5-geology-archive` copies the portrait and basin record; `departure-6-complete-field-archive` keeps a copy of the earlier core profile with them. Retained originals are legitimate informational copying, not a second physical specimen. The ending says “a copy of the picture.”

The final ship visibly retains: Return capsule, Catalogued ice sample, Retained sediment, Two-cell comparison case, Sleeved comparison, Complete field archive, Ripple impression, and Logged gravel chip. The hauler's Protected controller and Hauler platform remain only with its separate cart. There is exactly one capsule owner at each tested event.

Two existing route gestures change, with no new action: load capsule rather than cart; place docked ship rather than create a final badge. One synthetic combination becomes a placement:

| Route | Original combinations | Candidate combinations | Result |
|---|---:|---:|---|
| Authored | 200 | 199 | Complete |
| Beacon | 204 | 203 | Complete |
| Tow | 203 | 202 | Complete |
| Tow, old alias | 203 | 202 | Complete |
| Closed reader accepted route | 204 | 203 | Complete |

Every non-opening chapter retains a goal-connected use of an earlier creation on all five routes. The homebound complete checkpoint was adapted to the same two gesture changes; all 25 checkpoints replay.

## Separate narrative-only payoff

`narrative-only.patch.json` contains just four field edits and no recipe, lifecycle, objective dependency, or route change. `narrative-only.candidate.scenario.json` is its full comparison candidate.

- **Cabin promise:** the ascent motivation no longer promises that tests will disclose “what still fails.” Actual `ascent-13-cabin-test-record` is gated on all four required cabin fittings; it has no diagnosis or subsequent failure-repair branch. Missing-slot negative controls confirm the record cannot be made with any one fitting absent. The new motivation promises a record of the restored cabin instead.
- **Cabin record:** an optional attributed fictional reading records the already-established replacement hatch seal, docking ring, serviced oxygen module, flight console and seat. It explicitly does not diagnose another fault or clear the final assembled vehicle for launch; rendezvous and final assembly remain ahead. It supplies no fabricated real spacecraft measurements, test thresholds or engineering procedure.
- **Portrait goal:** change `departure-family` from “Keep crew portrait” to **“Archive the crew portrait.”** The existing `expansion-family-archive` already combines `crew-table-portrait` with `archival-recorder` to create the required `family-record`. The goal now names that exact action without adding a step.

## Verification and limits

- `verify.ts`: **11 diagnostic/narrative checks passed**, including fresh reproduction of the original 204-combination result, raw-versus-visible lineage, invalid/counterfactual preservation controls, narrative graph invariance across five routes, and pinned input hashes.
- `verify-cargo.ts`: **11 cargo checks passed** for both cargo-only and final combined recommendation: all five routes, 25 checkpoints, single capsule ownership, every packed leaf through flight, no hauler inside ship, readiness rejection for each missing compartment in both drag directions, direction-equivalent transfers, final tangible placement, undo and JSON restore.
- `verify-continuity.ts`: both candidates pass all five route witness audits; all 23 non-opening chapters have goal-connected earlier creations.
- `isolated-build.log`: **passed** content validation, TypeScript and Vite build for the final recommended bytes in `validation-copy`. Normal existing bundle-size warning remains. This was build validation only, not UI testing or publication.
- `frozen-logical-core-tests.log`: **58/59 pass on untouched actual source**. The sole failure is the pre-existing `reviews/lifecycle/lifecycle.test.ts:52` hard-coded catalog assertion, expected 9 active scenarios versus actual 15. No unrelated test was edited. This is not a full aggregate pass. The aggregate entry point includes UI tests and was not run under the no-UI-testing scope.
- The independent reviewer caught an initial action-fixture omission: the first generated cargo route files still used the old cart operand at loading. All five action files and the embedded complete checkpoint were corrected and independently replayed before acceptance. No source mechanics were changed to accommodate the test.
- Flat membership is repaired, **not** converted into a nested component display. The ending deliberately leaves the capsule in the docked ship rather than extracting it.
- Depot and orbit remain one narrated chapter-area, as in the existing compressed ascent. The cart remains separately visible in that chapter; component ownership proves it did not fly inside the ship, while text states that it stays at the depot. A distinct spatial flight scene is outside this correction.
- No newly recruited blind-reader evidence, browser/UI validation, real spacecraft procedure validation, save migration, external publication, or main-branch modification is claimed.
- No permission block remains. One build launch initially could not start because its intended isolated working directory had not yet been created; verified absence, created it from the existing parent directory, then completed the build normally.

## Reproduce

From this output directory, using the bundled unchanged engine/schema and pinned inputs:

```sh
node verify.ts
node verify-cargo.ts
node verify-cargo.ts recommended.candidate.scenario.json
node verify-continuity.ts
(cd validation-copy && npm run build)
```

The continuity audit uses the existing research auditor and unchanged live engine; original-source hashes are rechecked by `verify.ts`. `SHA256SUMS` records the final standalone candidate/evidence files. `recommended-composition.json` records how the separable changes and pre-existing live carrier text were combined.
