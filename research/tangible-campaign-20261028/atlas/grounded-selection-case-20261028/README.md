# Atlas chapter 22 — a population changes

**Isolated logical-content candidate. No engine, UI, physics, integration, browser testing or publication.**

## Result

The earlier dossier promised inherited variation and changing frequencies without supplying either. This candidate gives the player a named trait, coherent cohorts, a visible **50% → 75%** calculation, an actual historical counterclaim, and an explicit boundary on inference.

The invented case is intentionally not a realistic wolf population model:

| Record | Faster group | Slower group | Total |
|---|---:|---:|---:|
| First breeding cohort | 10 adults / 5 pairs | 10 adults / 5 pairs | 20 adults |
| Births, 4 per pair | 20 pups | 20 pups | 40 pups |
| Next breeders, 3 vs 1 per pair | 15 recruits | 5 recruits | 20 recruits |
| Share of breeding cohort | 50% → 75% | 50% → 25% | 100% |

Each offspring is assigned once to a parental pair, not counted once for each parent. The second census excludes original adults and migrants. Same-category mating and transmission of the speed category are **supplied simplifying premises**, not inferred from resemblance, photography or the recruitment counts. The speed-related feeding/recruitment advantage under fleet-prey scarcity is also stipulated. The model does not claim that one small real count distinguishes selection from drift.

The final results state what earlier work contributes:

- **Population pressure:** 40 births but 20 breeding recruits poses the constraint; excess offspring alone does not identify a favored trait.
- **Geological time:** permits repetition and accumulation; does not itself select, forecast continuing speed increases, or supply missing historical data.
- **Water investigation:** separates the observed frequency contrast from causal inference and requires independent evidence and alternative checks in a real investigation.
- **Archive / checked edition:** retain identities, running records, denominators, premises and limits; photographs do not measure speed or prove inheritance.
- **Wallace:** independent reasoning matters because the essay disputes a specific inference from domestic reversion to permanently bounded natural varieties. A single 50% → 75% transition does not establish indefinite divergence or rule out later return.

## Exact scope

Base: `../revision-v5-baghdad-calculation/scenario.json`

- Base SHA-256: `af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8`
- Candidate SHA-256: `faf9eced6f9fac51308984bdfa13d0a5860dba40039c8f6f1ba17d05aa597859`
- 15 chapter-local item records changed (Lyell's existing supplied reading remains unchanged).
- 10 chapter-local recipe **description/source** fields aligned with the visible dossier.
- Chapter `species`: motivation, cache narrative and objective wording changed; all IDs, edges, lifecycles, carry lists, objective kinds/items and stage order preserved.
- Two uniquely named primary sources appended: `darwin-origin-wolves-primary`, `wallace-varieties-primary`.
- Every other chapter/item/recipe and every existing source record remains exact. Root scenario ID intentionally remains the base ID; this is an isolated composable patch, not a published new identity.

## Deliverables and composition

- `scenario.json`: whole isolated candidate.
- `id-patch.json`: **recommended composition artifact**, 85 field-level ID-addressed operations with original-value preconditions. Nested stage changes are addressed by stage, cache and objective IDs.
- `apply_id_patch.py`: strict exact-v5 replay by default; `--allow-disjoint` permits independent optics/motion edits while still rejecting any touched-field conflict or duplicate added source ID. It never overwrites its input.
- `scenario.rfc6902.json`: standard JSON Patch with indexed-record ID and old-value tests; source appends are positional. Prefer the ID patch for composition.
- `scenario.diff`: exact unified diff against supplied v5.
- `visible-surface.json`: labels, explicit readings, motivation and objectives only; no hidden description/recipe knowledge required.
- `case-values.json`: machine-checkable invented quantities and assumptions.
- `primary-sources.md`: verified passages and adaptation boundaries.
- `verification.json` / `.log`: author-known logical/content diagnostics.
- `patch-verification.json` / `.log`: independent patch replay and synthetic disjoint/conflict checks.
- `manifest.json`: final package hashes and preserved dependency hashes.

Example (writes a new output, not the input):

```sh
python apply_id_patch.py ../revision-v5-baghdad-calculation/scenario.json selection-only.json
python apply_id_patch.py /path/to/disjoint-optics-motion-candidate.json /path/to/composed.json --allow-disjoint
```

No actual integration candidate was edited. The composition test used only temporary synthetic changes under `/tmp`.

## Verification

All **11 logical/content checks** pass on the final candidate:

- Schema, lifecycle, objective progression and construction continuity.
- Exact local-only scope and unchanged recipe graph/downstream contracts.
- Pair/birth/recruit arithmetic; separate cohorts; 25 percentage-point increase.
- Visible supplied inheritance, contextual recruitment, counterclaim and limitations.
- Real earlier route replay to chapter 22; no fabricated arrival inventory.
- Three independent branch orders in both drag directions.
- Each of the five earlier contributions remains necessary to the final argument in the unchanged graph.
- Ordinary highlight use is available and non-mutating; readings remain separate from descriptions.
- All **20 projected reachable chapter-22 states**, **60 directed drag transitions**, and one terminal state can reach completion. Projection excludes positions/history but includes discoveries, live tokens and incorporated/components state.
- **20 randomized full-campaign author-known routes** finish all downstream chapters.

All **5 patch/provenance checks** pass: independent RFC 6902 replay; byte-exact ID-patch replay; synthetic disjoint field/source additions plus reordered item indices; fail-closed touched-field conflict; preserved original v5 hash.

An initial test-harness mistake placed the unreversed receiving object before a reversed drag in an unrelated earlier chapter. It is preserved in `verification-initial-harness-error.log`; only the harness was corrected, then all final checks passed. No candidate or engine change was needed for that error.

**Not tested:** UI/browser/layout, reader discoverability, independent discovery, voluntary continuation, enjoyment or learning retention. Normal highlight exploration is intended gameplay, not cheating and not an enjoyment metric. No such outcomes are claimed.

**Outstanding blockers:** none for this bounded content/logic handoff.
