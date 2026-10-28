# Object lifecycle audit — 27 October 2026

> **Policy correction, 28 October:** The historical last-use cleanup described below is superseded by event-local retirement. Retained outside copies remain physical until a later recipe explicitly consumes them. Current restore never deletes or resurrects tokens. Construction is preserved at the event even when its source remains. See [EVENT_LOCAL_POLICY.md](EVENT_LOCAL_POLICY.md) for changed expectations and bounded legacy recovery.

Reviewed all 731 recipes in the nine active journeys. 384 recipes had missing or incorrect input-incorporation declarations; the nursery also referenced an obsolete tray instead of its current propagator. The five archived scenarios keep their historical authored content, but their routes remain in regression checks.

## Findings and corrections

- Soup pouch → warm soup → filled soup flask is one food/container chain. The pouch and warm soup disappear into their successors; the heater remains reusable. The flask remains while the later crew supper needs it, then becomes part of the supper table.
- Parts and ingredients become part of assemblies/food; predecessors do not remain as spare physical copies without an authored remaining use. Reusable equipment, observation subjects and source records are retained.
- Bearing-map and annotated-map recipes replace the old map, not the bearing instrument or source photograph.
- Seed tray → watered tray → sprouted tray → propagator is one plant-tray chain. The nursery labels the existing propagator, instead of demanding a duplicate of the old sprouted tray. Checkpoints and the authored route use that current object.
- Successive recipe states in cooking, fabrication, specimen packaging, shelters, cabinets, manuscripts and photographic development now declare incorporation explicitly.
- A declared ingredient/part that still has another authored use is retained as a supply. It is reconsidered after each accepted action and disappears after the last remaining use. Current/future objectives are protected.
- Loading old saves performs the same reconciliation on the current state and undo history. Outputs, progress, events, statistics and unrelated tools are preserved; no reset is required. Incorporated provenance follows an output into later products.

## How this is authored

The recipe graph determines *whether an input still has uses*. It cannot determine whether a label means a tool, an ingredient, a finite part, a source document or a renewable supply. Each active recipe now declares a lifecycle role and reason for every object input: `transform` names the existing object changed into the result, `incorporate` names ingredients/parts used in it, and `retain` names reusable equipment, supplies and references. Named locations are retained implicitly. The engine derives incorporation from those declarations, and the transformed object determines the result position in either drag direction. Installation recipes retain the construction and incorporate the component. Legacy retire lists remain supported only for older content. No per-recipe behavior is hard-coded into the engine.

This remains a qualitative, single-token game: shared stocks such as flour, timber or water can serve multiple recipes. The dependency safeguard retains a stock while an untried alternative or future goal still needs it. This audit does not introduce quantities or simulate depletion.

## Scope

| Journey | Recipes reviewed | Recipes corrected |
|---|---:|---:|
| mars-cargo-revision-v2 | 211 | 113 |
| atlas-of-questions-v8-transmission-actions | 224 | 23 |
| elements-observation-revision-v6 | 210 | 190 |
| food | 25 | 25 |
| theology | 12 | 5 |
| literature | 12 | 7 |
| restoration | 14 | 10 |
| shoreline | 12 | 9 |
| causation-purpose-v4 | 11 | 2 |

The complete per-recipe decisions, retained operands and change inventory are in [audit.json](audit.json).

## Verification

Run `node --test tests/tangible-campaign.test.ts`. This covers every authored journey route and checkpoint (including archives), the controller, save codec/autosave and independent engine regressions. Added checks cover the actual soup recipe, old-save cleanup, final-use retirement, instrument/map semantics and complete active-recipe audit coverage. A browser playthrough at the rescue checkpoint confirms the soup pouch disappears on warming and the heater stays. Route evidence action lists were updated for the nursery's current-object dependency; old recorded state hashes are historical evidence, not asserted hashes of this revision.

## Build-time enforcement

`npm run check:content` runs automatically at the start of `npm run build`. It checks every active recipe, including those introduced in future journeys. The build fails for missing input annotations, invalid roles, missing explanations, multiple transformed inputs, annotations for non-inputs, conflicting legacy retirement lists, and inconsistent installation declarations. When an unannotated input has no other recipe uses, the diagnostic identifies it as a possible missed transformation. Intentional retention is allowed with an explicit reason: a reusable tool can remain even when it has no other authored use.

For example, powering a radio with a permanently fitted power unit declares:

```json
"lifecycle": {
  "radio": {"role": "transform", "reason": "The existing radio becomes the powered radio."},
  "power-unit": {"role": "incorporate", "reason": "The unit is fitted inside the radio."}
}
```

The grow-light recipe explicitly marks `grow-light` as `transform`; its solar charger is retained because other equipment uses that common power supply. The data no longer has a separate retirement list for active recipes, so the two lifetime specifications cannot drift apart.

## Progressive challenge goals and direct transitions

Objectives can declare `intermediate: true` and successors declare `after: ["objective-id"]`. An intermediate counts as achieved when its named item has been created (using persisted discovery history), can then be used up, and is never marked gold. Its successor is hidden until the intermediate is achieved. For example, “Bake bread” is replaced by “Pack a picnic basket”; the bread remains an ordinary ingredient. Independent goals remain visible. Seven Elements milestones and matching sequences elsewhere are explicitly annotated; 24 intermediate goals feed 23 reveal rules across the active content.

The content build rejects final item goals that feed another listed goal without being marked intermediate, intermediates with no successor, and challenges with no final goal. Scenario validation rejects unknown reveal dependencies and cycles. The checklist and mission popup share the same visible goal list.

After a final objective is met, its creation animation finishes and the controller advances directly to the next challenge’s introduction. There is no chapter-complete acknowledgement. The final challenge opens the journey ending. Loading a save left at a completed chapter also advances directly, preserving progress and history.

## Follow-up: construction identity and doctrine replacement

At the historical 61a9b4e checkpoint, the active catalogue had 735 recipes across nine journeys. The original 12-recipe Benedictine journey is archived, with its direct route and saves retained; the new 16-recipe, eight-chapter Doctrine journey has its own identity. Its input decisions are included in audit.json. The original correction counts above describe the earlier audit, not newly claimed fixes.

Ten Mars recipes now explicitly preserve fitted construction contents: eight assembly transformations/joins, plus installations of the long-range radio and comparison case. Visible fitted parts follow a changed assembly into later upgrades. Build validation tracks construction-producing recipes transitively, so a later transformation cannot bypass preservation just because its input definition has no direct slots. Existing save history supplies actual earlier fitted states during migration; the engine does not guess missing components.

See the root DESIGN_PRINCIPLES.md and AGENTS.md for the continuing design contract.


## Reviewed campaign integration candidate — 28 October 2026

The pre-Doctrine integration candidate had **949 active recipes across nine scenarios**: six focus selections (one is the deliberately short Quarry purpose probe) and three undeveloped secondary sketches. Its twenty total scenario records contained 2,302 recipes, including eleven archived identities. Neither count is a claim about natural-route length or enjoyment.

`audit.json` is the current active-row ledger, in exact scenario/recipe order. It incorporates selected author-reviewed Mars, Atlas, Elements and Food rows without changing their lifecycle declarations. Quarry's six rows are explicitly extracted from its reviewed pilot declarations; no nonexistent separate audit packet is claimed. All active recipes, including secondary sketches, retain validation; no new candidate is grandfathered.

The complete earlier audit bytes, including original correction counts and the replaced campaigns' rows, remain in `../../evidence/integration-20261028/historical-lifecycle-audit-61a9b4e.json`. Historical correction counts above are not newly claimed fixes. The current event-local runtime is unchanged; the new Elements test intentionally rejects the old candidate report's deferred bread-removal behavior while preserving that frozen report as historical evidence.

See `../../../../docs/reviewed-campaign-integration-20261028.md` for candidate provenance, bounded presentation/checkpoint additions and verification limits.


## Final Doctrine v9 addition

The combined integration has **1,021 active recipes across nine scenarios**, with **21 records / 2,390 definitions** total and twelve archived identities. Original Doctrine v1 is archived, not mutated or removed. Its new v9 counterpart contributes 88 exact reviewed lifecycle rows in active scenario/recipe order. The source packet names its declaration field `decisions`; tests compare that field exactly to recipe lifecycle metadata. The pre-Doctrine active ledger is retained at `../../evidence/integration-20261028/historical-pre-doctrine-v9-lifecycle-audit.json`. The content-only checkpoint uses the unchanged pre-HUD UI/runtime; the unfinished HUD revision is separately preserved and not included.

## Approved v10 copy-only successor

Doctrine v10 changes no recipes or lifecycle decisions. Its 88 rows retain all reviewed v9 fields except the scenario identity (`world`); the previous complete ledger is preserved at `../../evidence/integration-20261028/copy-revision-20261028/previous-lifecycle-audit.json`. Counts remain 1,021 active recipes/9 scenarios and 2,390 recipes/21 total records. Mars, Elements and Food copy corrections also leave all decisions unchanged. Native/UI testing is deferred by user.


## Morning content successor

The current ledger now includes prior integrated identities as fully validated direct-route content plus the latest approved successor stories. Schema grandfathering is unchanged. Every current row is deterministically derived from that scenario recipe's explicit lifecycle declaration; the previous ledger is preserved under `evidence/integration-20261028/morning-revision-20261028/previous-lifecycle-audit.json`. Recipe totals include these preserved versions and are not a count of required discoveries.
