# Independent lifecycle policy challenge — 28 October 2026

## Verdict

**A genuine tangibility mismatch, implemented deliberately under an older policy.** It is not a new Elements recipe unexpectedly consuming bread, and not merely an untested accidental code path. The existing audit explicitly says retained supplies disappear after their last remaining use; a regression test requires it. However, that policy allows an unrelated action to remove a physical object into an owner in another area, even when the current recipe says `retain`. The stronger project principle — exhaustion is never permission to delete, and removals need an understandable authored action/result — warrants a bounded correction.

Recommended boundary: **authored retirement is local to the actual combining/installing event.** Keep the existing future-use safeguard then, but if it deliberately leaves an outside copy/supply, that copy does not become a pending debt collectible by an old owner. It remains until a later action explicitly transforms/incorporates it. Separately, preserve fitted contents at the event, not when a retained source eventually retires.

No Site/runtime, repository, remote, or user-facing changes were made. All new files are in this isolated review directory. The engine/schema baseline is copied here and hashed in `baseline-sha256.txt`.

## What the runtime actually does

References are to the reviewed `experiments/tangible-campaign/engine/model.ts`:

- `needed` (149–151) protects an input for unused recipes whose output has not been discovered, and current/future objectives. Discovering an output by an alternative recipe disables the other route as a reason to keep its inputs.
- `reconcileIncorporation` (153–170) walks **all previously used recipes**, finds their surviving output/slot owner, and retires now-unneeded outside inputs into that owner. It does not require the owner to be in the current area.
- Every accepted action calls it (251), including advance, visit, move and placement, not only combination.
- Restore applies it to the current state and every undo snapshot (301).
- `preserveConstruction` is called inside the `!needed` retirement guard for both installations (234) and creations (236). Retaining a source therefore also suppresses the new owner's visible descendant components.
- Restore's preservation repair (300) considers only recipes with `out`, not installations. It can add missing construction labels to an output while the source still exists, producing a reload-dependent view.

The intent is explicit in `reviews/lifecycle/AUDIT.md:8,12–13` and `lifecycle.test.ts:35–44`. The latter expects a frame retained after making the first product to disappear into that old product after a second recipe which has no retirement declaration.

## Exact Elements evidence

I read the reports only after analyzing the implementation. I independently replayed every event of frozen `elements_gathering_v7_a`, including rejected attempts. Its full saved game matches replay exactly. The frozen engine and reviewed current engine produce identical states for that session.

| Frozen v7 event | Action and declared lifecycle | Observed removal and owner |
|---|---|---|
| 183 | Seeds + Millstone → Seed oil; Seeds `transform`, Millstone **`retain`** | Seeds retires normally. Millstone also disappears from `area-washday` into **Grain mill in `area-mill`**, under the earlier `grain-mill` recipe. |
| 195 | Compote + Porridge → Feast; only those two inputs declared incorporated | Bread also disappears from `area-kitchen` into **Picnic basket in `area-bakery`**. The unused bread+fruit Feast route has become unavailable because Feast now exists. |

This confirms the reported experience without attributing the disappearing bread to the current Feast recipe. The older owner is Grain mill, not a recipe literally named Windmill.

The earlier `fresh-guests-exact-replay.json` also reports untouched bread disappearing at warm-meal Feast. Both trials are protocol-source-blind AI logical play, **not human or native UI evidence**. My audit independently verifies frozen v7; I read, but did not independently re-run, the earlier report's full underlying session.

## Minimal counterexamples

`repro.test.ts` contains eight passing **characterization** tests: they assert today's behavior, not the desired fix.

1. **Two combines, untouched alternate ingredient.** Bread+Basket → Picnic leaves bread for the alternative Bread+Fruit → Feast. Porridge+Compote → Feast then removes untouched bread into Picnic. Undo restores the previous tokens exactly.
2. **Two combines, current retention contradicted.** Gearing+Stone → Mill retains stone for Seeds+Stone → Oil. The latter explicitly retains stone but reconciliation removes it into Mill.
3. **Advance alone.** A+B → C declares A incorporated, but A is the current finished goal so remains gold. Advance to a C goal removes A from the old area without another combination. This is a synthetic runtime capability, not a claim that an existing authored route currently triggers it.
4. **Fitted source retained on upgrade.** Fit wheel to chassis; upgrade chassis with paint while a later scan still needs chassis. New upgrade has no visible wheel; original chassis still has its wheel. Reload adds the wheel to the upgrade, or doing the unrelated scan later retires chassis and adds it then. All lifecycle/construction validators accept the fixture.
5. **Fitted source retained on installation.** Fit battery to module; install module in chassis while later scan needs the outside module. Chassis displays its module slot but omits battery. Reload does not repair it; eventual retirement does.
6. **Actual Mars optional installation.** Replay the first 75 ordinary route actions, through fitting Antenna stand to Long range radio. Visit the existing Rover area carrying that radio, then install it in Rover (`rover-5-survey-rover`). Rover's radio slot fills, outside radio remains for future uses, but Rover's preserved components omit Antenna stand. Reload still omits it. The original radio retains its stand; **this is a missing new-owner representation, not proven destruction of original slot data**.

The other two tests independently replay frozen v7 and save the evidence JSON. Exact states/actions are in `repro-results.json`.

## Strongest counterargument

This is a qualitative, one-token-per-kind system, not counted inventory. An `incorporate` declaration already authorizes a material contribution to an earlier product; the outside token can be interpreted as a temporary representation of a reusable stock. Deferred absorption avoids permanently duplicating finite ingredients/parts and keeps optional branches usable. The existing lifecycle reasons explicitly say “retain a supply only while another authored use needs it.” It is therefore not *graph exhaustion alone*: an earlier authored incorporation is also required, and tools with no such earlier declaration remain.

That is internally consistent bookkeeping, but not consistent player-facing tangibility. A visible, movable outside thing has acquired its own physical identity and location. Its distant owner does not change visibly when an unrelated action makes it vanish. Current `retain` is locally false. Bread's last-use dependency is canceled without bread even participating. The runtime also records the same historical absorption on movement/advancement/restore. A generic supply abstraction cannot make those particular timing/location effects an understandable physical action.

The solution is **not blanket retention**: soup pouch → warm soup, consumed ingredients at an actual cooking action, and immediate installation retirement must still behave coherently.

## Bounded policy recommendation

1. **Only the accepted current recipe may retire its declared transform/incorporate inputs (or installation component).** Keep the current `needed(..., currentRecipeId)` protection at that moment to avoid closing remaining branches or goals. A later actual recipe may consume the same retained token if it declares that consumption and no remaining need protects it.
2. **Do not revisit older recipe declarations after ordinary actions.** Advance, move, visit, placement, and alternative-route completion do not create new authority to remove a token.
3. **Snapshot declared fitted construction onto the new owner at creation/installation even when the outside source remains.** Retain original source slots/position intact. Do not conflate visible component preservation with removing the source or claiming its unique token was retired. Preserve current immediate slot installation semantics.
4. **Keep finished leftovers in their existing areas.** `sceneCarry` is already local to the next scene and stops at existing prerequisites; it is the relevant clutter mechanism. Do not replace deferred retirement with last-use hiding, deletion on travel, or a forced tidying action.
5. **Restore should preserve physical decisions, not re-run a new exhaustion policy.** Keep absent already-incorporated tokens absent; do not resurrect items from `discovered`. Keep currently present tokens, their coordinates/slots, and undo snapshots. Preserve event/metric history.
6. **Treat old migration cleanup separately.** The legacy soup cleanup test currently depends on generic reconciliation. Removing only the live sweep but leaving restore's sweep would reintroduce the bug on reload. A known old-format correction needs explicit, bounded migration provenance/fixtures (and, for future changes, a policy/version marker), not a fresh scan of all old recipe graph exhaustion. Current `Game.version:1` does not distinguish every historical lifetime policy, so do not assume an unmarked save proves a still-present object is obsolete. Preserve ambiguity rather than deleting it speculatively. Retain evidence-based fitted-part repair, extending installations if appropriate, without fabricating unknown parts from item definitions.

## Scope, routes, saves and tests

- Baseline `node --test tests/tangible-campaign.test.ts`: **126/126 passed**. Thus the reported mismatch is compatible with the existing green suite.
- Read-only audit replayed **all 15 authored routes to completion**. This is a baseline result, **not proof of a proposed fix**.
- Active Mars has two retirements outside the current recipe declaration: Pressure patch → old Insulated vestibule, and Solar charger → old Rover. Both current recipes explicitly retain the removed item.
- Active Elements has six: Kiln → Forge, Lens → Microscope, Millstone → Grain mill, Bread → Picnic basket, River map → Harbour map, Stone → Axe. Five override current `retain`; Bread is not a current operand at all.
- Stock route scans reveal no missing preservation components. The actual optional Mars radio branch above does. `lifecycle.test.ts:108` explicitly skips retained sources, and canonical route coverage does not exercise that optional radio installation, explaining the gap.
- At minimum, the old last-use-retirement test must be replaced with an event-local test, and legacy soup migration must be consciously preserved or re-scoped, not silently lost. Existing immediate soup transformations, replacement coordinates, required slots, readiness, intermediate achievement, undo, old direct routes and scene packing remain regression obligations.
- Existing saves with already-retired objects need not be reset or replayed. A corrected runtime will legitimately diverge in remaining-token count/coordinates from old frozen evidence; preserve those old records as historical trials instead of presenting them as post-fix runs.
- Test both creation and installation with retained compound sources, both operand directions, current `retain`, nonoperand alternate-route completion, cross-area owners, save/reload, undo/history, and immediate retirement. Assert at least that every newly removed token is justified by the current recipe, and that advance/move/visit/place remove none.
- More retained physical tokens can change packing or capability witness multiplicity. Do not claim a policy patch is layout-neutral or all routes still pass until rerun. No patched runtime was tested here; no build was run because this task is read-only and no runtime implementation changed.

## Files

- `baseline/` + `baseline-sha256.txt`: reviewed engine/schema snapshot.
- `repro.test.ts`, `repro.tap`, `repro-results.json`: eight characterization checks and exact observations.
- `route-audit.ts`, `route-audit-results.json`, `route-audit-stdout.json`: complete baseline route audit.
- `baseline-campaign-tests.tap`: 126 passing existing campaign tests.

No blockers remain for this audit. Implementation and native UI verification are not performed or claimed.
