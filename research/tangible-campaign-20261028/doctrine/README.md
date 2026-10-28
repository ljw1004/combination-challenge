# Doctrine argument desks — executable candidate, not a released campaign

The recovered v1 has eight chapters, sixteen recipes and thirty-three items. Its continuity is real, but each chapter exposes essentially one predetermined pair followed by another. Important interpretive work has already happened inside the answer-labelled raw cards. The candidate makes that work playable through distinct evidence, objections, replies and manuscripts.

**Current candidate:** `doctrine-argument-desks-v2-candidate.json` — eight chapters, 66 recipes (63 on the authored route, three alternative evidence routes), 117 items. The structure deepens the existing evil–grace–matter journey; it does **not** implement the full history of Christian doctrine.

## Concrete changes

- The healing observation and choice argument are distinct branches on Augustine’s first desk.
- Instruction is a serious proposal that survives Augustine’s objection; infant baptism supplies a different argument about inherited condition.
- The dualist writer has an actual reported opposing analogy: watching someone walk does not make them walk. Its reply distinguishes a creator from a spectator. This is not a generic villain token.
- Aquinas’s use of Augustine is documented in the actual *Summa*; comparison with the Italian dualist treatise is not presented as direct transmission.
- The Lyon ritual is a separate witness with visible bodily practices, not a vignette standing for a universal Cathar creed.
- The instrument analogy, sacramental sign and Eucharistic substantial-change claim are distinct.
- Luther’s 1517 household-and-neighbour priorities are not conflated with his 1520 justification argument. Neither chapter calls its speaker Protestant.
- Each later chapter actually combines at least two earlier creations. This holds on all seven combinations of the three authored alternative routes, not only the main route.
- Key lines are **visible labels**, including short Bible quotations. `Item.reading` gives fuller context and explicit quotation/paraphrase attribution. The reference reader is intentional content, not gameplay instructions or a result preview.

The eight desks arrive with 8–10 cards and reach 10–14 visible tokens on the authored route. This is measured, not a claimed 12–20 quota. Retained source manuscripts and separate interpretations coexist; genuine working revisions still transform. The first desk is intentionally less crowded. Token counts do not prove depth or fun.

## Scope and integration

No recovered source, live Site, remote repository, archived route or existing save was changed. All build/test integration happened inside `validation-copy/`.

Required integration work:
1. Add this scenario under its **new** identity; retain `doctrine-grace-and-matter-v1` and `theology` as direct archived routes.
2. Support optional `Item.reading: {text: string; attribution: string}` and the manuscript reader. Parent is implementing this. Normal hidden descriptions must not substitute for visible readings during testing.
3. Give text-heavy labels enough room; several are 5–12 words. This candidate deliberately does not alter engine geometry.
4. Merge `lifecycle-audit-candidate.json` into the lifecycle audit, and update the active-scenario and active-recipe count assertions when adding a scenario. The three initial aggregate failures (scenario count, missing audit rows, recipe count) are preserved as evidence; they were integration fixture mismatches, not passed tests.
5. Copy route evidence to the matching scenario evidence filename. Re-run full checks after integration and real browser reader/layout QA before publication.

`build_candidate.py` is the reproducible content source; `authoring-manifest.json` records the intended route and alternate output substitutions. Do not run the one-time `refine_candidate.py` again. It records the earlier transformation and is not part of regeneration.

## Verification

- `node --test candidate.test.mjs`: schema, explicit lifecycle, goal flow, component preservation, all checkpoints, reverse drags, narrow/wide model boards, undo/save restore, seven alternate-evidence combinations and forty branch-order permutations.
- `npm run build` in isolated validation copy: content validation, TypeScript and production bundle. This checks **data/schema integration only**; its UI is the recovered labels-only UI, not the parent’s pending manuscript reader.
- `node --test tests/tangible-campaign.test.ts` in that copy: full campaign regression suite after adding reviewed candidate audit rows and count.
- `route-evidence.json` records actual cross-chapter operands and visible token counts.

These are authored mechanical checks. No independent or human play session has been represented as completed. See `EVALUATION.md` for the recipe-blind pilot protocol and known weaknesses. Negative and stopped sessions are retained under `sessions/`.
