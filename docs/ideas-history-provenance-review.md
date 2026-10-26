# Ideas & Witnesses 2: independent pre-freeze audit

26 October 2026. Implementation-aware reviewer, separate from the engine author; **not a fresh player**. Reviewed `logical-ideas-history-provenance.ts` and its public CLI. Final engine inspected at SHA-256 `2994d2b2bc7aa28bb0ad76ec6760a85b4a97ffbf377fadb4c52526036bc4cd10`. The author corrected the two initial findings below; this reviewer did not edit the engine. Subsequent hashes must be checked rather than assuming this audit covers later changes.

## Decision

**Go for a small diagnostic fresh play after freezing and publication, not for a full-game or enjoyment claim.** V2 fixes the central V1 problem: provenance now changes legal consequences and goal satisfaction. Equal membership can retain different proofs; a useful copy is not automatically an independent witness; two institutions can use the same data for distinct faithful-preservation and independent-comparison goals. The interaction is no longer only arbitrary membership matching.

The candidate remains a compact provenance/classification puzzle, not a simulation of Bologna/Oxford competition or historical discovery. Its final board has a directly executed **seven-combine** broad-aggregation solution. Keep it valid. No claim about roughly 200 decisions is supported.

## Initial blockers, author repairs and verification

1. **Clinic subject mismatch.** Initially collection roots referred to `s1`, `s2`, etc., while practice roots referred to `reed`, `stone`, etc. Comparison required equality, so the intended independently supported core account could not be built from these sources. The author added public canonical subject identities to the collection roots. The review test now translates collection, compares it with practice, filters to core and verifies goal satisfaction. This is an explicit fictional identity assertion; naming alone must not be described as establishing historical/scientific identity.
2. **Translation-order overclaim.** V2 retained original roots through generalization, so translate-before-compare and compare-before-translate yielded the same `thin` account. That is sound anti-forgery behavior but contradicted the initial description inherited from V1. The author revised the purpose/goals to describe provenance surviving generalization, without requiring a specific order. A direct equality test protects both valid routes. This is **not** evidence of the V1 noncommutativity phenomenon persisting.

## Verification performed

`node --test tests/ideas-history-provenance-review.test.ts`: **10 passed, 0 failed**. TypeScript (`npx tsc --noEmit`) passed during this review. This is focused verification, not a claim that every repository test or whole-campaign shortest-path search was run.

The tests establish:

- Self-comparison and comparison with a copy do not create independent support.
- Collection keeps singleton proofs as alternatives; it does not silently join them into a certificate.
- Comparison of genuinely disjoint roots creates joined support.
- Compound proofs sharing a root cannot corroborate each other.
- `goalSatisfied`'s conditional precedence behaves correctly for `any`, `independent` and `faithful`; a scope cannot stand in for an evidence-bearing account.
- Extensional equality does not collapse consequential provenance.
- Generalization preserves roots and does not manufacture agreement between different specimens.
- The repaired clinic correspondence permits the intended comparison.
- Preview matches the accepted transition and preserves parents.
- Collecting all initial accounts alone does not satisfy independent-support goals.
- Comparing an aggregate with itself can legitimately join **different disjoint alternatives**. The operation must not be banned just because its two operand IDs are equal.

## Stronger shortcut baseline: collect, compare, filter

A more informative baseline than raw union is:

1. Collect Field and Garden.
2. Collect that result with Bench.
3. Compare the aggregate with itself.
4. Apply Structural questions.
5. Apply Portable observations to the maximal compared account.
6. Translate that portable account into teaching lessons.
7. Apply Portable observations to the original Field account.

This actually completes all three final-board goals in seven accepted combines. The aggregate contains disjoint sufficient alternatives for all six objects; self-comparison does not create new roots. The faithful goal still needs the original single-root account, while the other two use the compared result. That is a genuine distinction of purpose, not a reason to require the player to take a longer recipe.

This is not a demonstrated universal fixed script for every board. It is a strong general construction pattern that could make later play routine. The fresh player should not receive this witness. A retrospective/reviewer should check whether broad aggregation plus a few filters carries the whole experience, and whether the resulting routine was welcome, neutral or unwanted. Do not infer unwanted work merely from repetition.

## Scope and method caveats

- Root identity, support alternatives, subject identity, origin and account-versus-scope kinds affect computation. Most natural-language method labels remain descriptions, not different operating laws.
- “Independent” means disjoint declared root observations of the same declared subject in this toy. It does not establish statistical independence, unbiased methods or truth. The existing public disclaimer is important.
- Copy labels and shared roots are represented; a full copied-from chain between every record is not. Do not claim reconstruction of a detailed transmission genealogy from this version.
- The archive and comparison room have distinct goal predicates, not autonomous institutions competing or responding. This is a legitimate finite-goal experiment but not yet an institutional history simulator.
- All initial data and roots are public. Exact previews and typed legal offers remain available; recipes are not hidden. The account/scope typing is explained in public laws. No stock, score, time allowance or minimum action count was found.
- The CLI records actions, previews, inspections and before/after states, and rejects source changes during a session. The prospective manifest should hash both engine and CLI; the session's internal check hashes the engine only.

## Fresh-play question

Does combining and retaining distinct kinds of evidence make the player feel they constructed a useful explanation or connection, rather than merely performing table operations? Can they articulate why an archive may value a faithful copy while a comparison room needs a different support relation? Those reports remain unknown before play. Success and this mechanical audit do not supply them.

Use neutral finite-goal prompts, retain shortcuts, and count only actual selected interventions. If the result is a short appreciated provenance puzzle, preserve that limited success and test a substantive next expansion. If it reads as a worksheet, change the interaction rather than adding historical names or multiplying boards to imitate a long campaign.
