# Atlas chapter 14: a checkable Earth–Moon comparison

**Isolated content candidate, 2026-10-28. No base/integration modification or publication.**

## Diagnosis and repair

The v5 workshop promises terrestrial/celestial unification but supplies no visible numerical record or law. Its `cross-orbit-check` also claims several tested orbits without supplying any. This patch keeps the entire ten-combination graph and changes the actual labels and optional `Item.reading` so that a specific result survives into the final account:

- Surface fall: approximately **4.90 m in 1 s from rest**.
- Independent orbital dossier: lunar distance approximately **60 Earth radii**, period approximately **27.3 days**, with an explicitly circular, fixed-Earth, short-time construction giving approximately **1.36 mm inward departure from the initial tangent in 1 s**.
- Candidate acceleration rule: **a(r) = a(R) × (R/r)²**.
- Matched-time displacement comparison: **4.90 m ÷ 60² = 0.001361… m ≈ 1.36 mm**.
- The independent geometric calculation is **0.001356… m**, not exactly the same number. Both round to **1.36 mm**; their unrounded relative difference is about **0.38%**. The candidate calls this agreement at the stated precision, not exact equality.
- Acceleration is separately **9.80 m/s²** near the surface and approximately **0.00272 m/s²** at the lunar distance. Distances, accelerations and forces are never substituted for one another.
- Keeping the surface acceleration unchanged at the lunar distance predicts 4.90 m rather than 1.36 mm in one second. This is an explicit mathematical contrast, **not a fabricated historical vortex theory**.
- The bounded result supports shared gravitational scaling in this dossier, not the unique law at every distance, every orbit, or gravity’s ultimate cause.

`cross-orbit-check` retains its contract ID but now reads **“Moon: ≈1.36 mm in 1 s; rule gives 1/3600”**. No false multi-orbit claim survives in that item or its recipe description.

The algebra inheritance performs interval subtraction/division with units, then the motion branch computes acceleration. The geometry inheritance states premises and turns radius/period into departure from a tangent. The optional reading explicitly distinguishes this new modern construction from what the earlier Euclidean triangle proof alone established. The sky-boundary and checked-edition inheritances limit and preserve the resulting argument rather than acting as generic success badges.

## Files and composition

- `scenario.json`: complete motion-only candidate based on the supplied v5.
- `motion-id-patch.json`: **preferred composition artifact**, addressing changes by `collection`, `id`, and `field`, with exact `before` values for replacements. Its single source addition is identified by unique ID `newton-moon-test-primary`.
- `motion-rfc6902-patch.json`: ordinary index-addressed JSON Patch with identity/before tests; applies to the unmodified v5 arrays.
- `scenario.diff`: exact unified diff against v5.
- `visible-motion-surface.json`: only labels, explicit readings and stage motivation/objectives for logical-content review.
- `author-routes.json`: terrestrial-first/lunar-first examples and exact ingredient branches.
- `all-logical-routes.json`: all 35 valid topological recipe orderings.
- `validation.json`: numeric checks, invariant checks, frozen-engine route evidence and limits.
- `primary-citations.json`: verified primary-source locations and explicit adaptation boundaries.
- `build_motion.py`, `verify_motion.mjs`: reproducible authoring/checks.
- `manifest.json`: file SHA-256 hashes.

The patch changes only 16 chapter-14 items, descriptions/source lists for its ten existing recipes, its motivation/cache narrative/objective text, and adds one uniquely named primary-source record. IDs, recipe inputs/outputs, order dependencies, lifecycles, caches’ item sets, carry sets, objective identity, stage title/area/date, all existing sources, and all other 28 stages are preserved. All unrelated item/recipe records are byte-equivalent as JSON values. The root scenario ID remains v5’s identity deliberately so the composing author can assign one integrated identity. Companion `chapters.json` and `connections.json` need no graph or title changes and were not modified.

Apply ID-addressed operations to a copy: locate the collection member by exact ID, verify each `before`, then replace/add its field. Add the unique source only if absent. Do not replace an already-composed scenario wholesale with this single-case candidate.

## Source grounding and historical limits

[Newton, *Principia*, Book III, Proposition IV and scholium, printed pp. 391–393](https://sites.pitt.edu/~jdnorton/teaching/2682_confirmation/2010/Principia_fragments/Principia_Bk3_to_Prop_15.pdf#page=9) compares lunar departure from straight motion with terrestrial gravity using squared distance. The historical presentation uses Paris feet and compares different elapsed times. This candidate instead uses a normalized one-second comparison, modern units and rounded supplied orbital inputs. **None of its numbers is presented as Newton’s exact measured notebook entry.**

[Newton, later *General Scholium*, 1729 English text, printed p. 392](https://www.newtonproject.ox.ac.uk/view/texts/normalized/NATP00056) distinguishes a successful gravitational account from an established cause. The later text supplies a historical boundary for the authored exercise, not an extra document claimed to have existed in 1687. Its actual vortex discussion is not recast as the chapter’s distance-independent numerical contrast.

Both primary texts were opened and read through the web tool on 2026-10-28. Citation locators refer to primary text; this is not a claim of visual browser/UI testing. See `primary-citations.json` for locators.

## Verified, and not verified

Run:

```sh
python build_motion.py
node --experimental-strip-types verify_motion.mjs
```

Passed against the unchanged v5 frozen runtime:

- ID-addressed patch exactly reproduces candidate.
- All 28 unrelated stages and all graph/lifecycle contracts unchanged.
- Scenario, content lifecycle, objective-flow and construction-continuity validators: no errors.
- Existing full author route: **288 actions / 257 combinations**, complete.
- Chapter 14: **35 orderings × both operand directions = 70 successful routes**, visiting **23 distinct logical completion states**; all finish into longitude.
- No read action, new prerequisite, engine change, UI change or mandatory extra step.

These are **author-known logical diagnostics**, not independent discovery, source-blind play, reader discoverability, visual layout, voluntary continuation, retention or enjoyment evidence. No UI/browser playtest was performed. Highlighting remains ordinary designed gameplay; it is neither cheating nor a proxy fun metric. No outstanding blocker.
