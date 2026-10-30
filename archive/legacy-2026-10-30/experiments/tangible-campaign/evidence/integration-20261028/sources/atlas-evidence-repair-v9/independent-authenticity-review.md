# Atlas evidence-repair: independent authenticity addendum

**28 October 2026 · Result: PASS; no authenticity release blocker**

The corrected candidate resolves **all five HIGH recipe findings in the three authorized clusters**: printing correspondence (three rows), orbital comparison, and logical checking. This is a bounded review of the corrected variant, not a new review of all 263 Atlas recipes or all 1,005 baseline recipes. The original audit and original Atlas snapshot remain unchanged.

## What was checked

Every changed visible payload was read: **24 items, 22 recipes, and three stages**. Both changed printing edges and all **35 direct consumers of changed items** were inspected, including 15 unchanged recipes. Exact ID/field differences were independently compared with the frozen baseline. The candidate retains all original IDs, and its only recipe-graph substitutions are:

- `make-set-page`: **Proof roll**, rather than Circulating arithmetic book, supplies the typeset text.
- `make-diagram-block`: the same **Proof roll**, rather than the courtyard illustration method, supplies the engraved figure.

The earlier roll remains a retained witness. Existing supplies, locations, bibliography, and unrelated stage contracts are unchanged.

## Findings

### Printing — all three HIGH findings resolved

The source, typeset page, figure, corrected proof, printed quire, and final comparison now concern the **same equilateral-triangle construction**. The error is actually present in the supplied content: the trial figure labels the intersection **D**, while its instructions still refer to **AC and BC** and no C appears. This is neither a harmless consistent renaming nor the former symmetric A/B swap.

The earlier critical text genuinely identifies the missing referent C. The final witness is the same roll used to create the page, and the correction record preserves D → C. The roll's abbreviated account inherits the explicitly A/B-centred circles from `circle-definition` and `two-circles`; this is a summary of the completed earlier proof, not a new unsupported construction.

Later publications explicitly reuse a **source-to-copy checking practice for their own new content**, rather than borrowing the triangle's conclusion as evidence. The anatomy, circulation, mortality, lunar-gravity, electromagnetic, and descent records retain their separate subject matter. Quire consumers likewise specify layout/checking reuse. No new content mismatch was found.

### Orbital comparison — HIGH resolved

The supplied dossier visibly contains invented observations, a candidate apparent-position rule, and its predictions. Its label, description, attribution, and stage cache distinguish these **teaching numbers from Tycho's measurements or a historical orbital fit**.

Independent parsing confirmed:

| Elapsed days | Observed direction | Prediction | Residual |
|---:|---:|---:|---:|
| 0 | 30.0° ± 0.1° | 30.0° | 0.0° |
| 10 | 40.2° ± 0.1° | 40.0° | +0.2° |
| 20 | 50.8° ± 0.1° | 50.0° | +0.8° |

The rule is 30.0° + 1.0°/day × elapsed days. The last two predictions fall outside the stated observation intervals. The output rejects only this candidate against these records; it does not infer an ellipse, reject every circular model, or establish a physical cause. Earlier algebra contributes an explicit equal-operation/subtraction method, not a magically repurposed completing-square answer. The arithmetic is supplied, so this adds no required calculation puzzle. Later orbit geometry and nautical interpolation preserve their own stated assumptions.

### Logic — HIGH resolved

Both visible tables contain all eight input cases and the correct outputs **0,0,1,0,1,0,1,0** for `(A OR B) AND NOT C`. These rows were independently parsed and evaluated. The result now **confirms an already-correct specification** instead of claiming an absent error was corrected.

The earlier lamp example contributes a checking principle, not evidence about entry. The later relay still uses the same rule; the allocation and two-input experiment cases explicitly concern their own domains. No justice claim follows from formal consistency.

## Scope and limits

- **Deep-time remains MEDIUM and unchanged**; it is not a fourth repair cluster.
- Existing MEDIUM considerations are not collectively closed or recounted by this addendum. Some downstream wording is clearer, but no blanket claim of universal discoverability is made.
- No required rework remains within this bounded authenticity review.
- This review independently checked source payloads, exact deltas, arithmetic, truth tables, and preservation hashes. It did **not** rerun full-route/runtime/build tests or conduct a new human/UI playtest. The author's separate test results are not represented as independent director testing.
- No game source was edited or published by this review. All 45 files pinned by the prior audit manifest were verified unchanged.

## Pins

- Candidate: `atlas-connected-questions-v9-evidence-repair-research`
- Candidate scenario SHA-256: `161f0eeb59d1ef55d22ef4b8d8427c8b7d918953ae39a9d73a6d4bd55f809e8e`
- Candidate module SHA-256: `6302ad1bc25c802d3d5c54612e5e59488c55095a1c921b9ae3b6ae9dd6454d95`
- Original Atlas snapshot SHA-256: `266423018bd3396c7fef26ae8c6d75310321e46f68ce5963147b4dfdfac71bb3`
- Prior immutable audit-manifest SHA-256: `3b2e9d13eca79c3140a36edfbc4b0a960842d74072ad96db9ad9b6ab2ca7ffae`

`verification.json` contains exact changed IDs, direct-consumer coverage, parsed rows, and preservation results. `delta-review.json` records the individual changed-recipe and unchanged-consumer judgments.
