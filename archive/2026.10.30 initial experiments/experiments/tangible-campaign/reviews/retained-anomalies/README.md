# Retained predecessor / graph review guard

## Confirmed LIVE86 crawler defect

`damaged-crawler` has exactly two consumers: repair (`rescue-8-repaired-crawler`) and tow (`rescue-11-towed-crawler`). It has no objective or later independent use. Both consumers already said `transform`; `needed()` nevertheless retained the original for the unused alternative. The repaired and disabled cabins could therefore coexist. The previous validator checked complete lifecycle annotations, nonempty reasons, objectives and preserved fitted contents, but did not check this graph conflict.

The three state transitions (repair, tow, repair-after-tow) now opt into the existing candidate `exclusive: true` event-local semantics. The latter consumes `towed-crawler`, whose remaining shelter use is also provided by the repaired `crawler`. The working crawler remains available for its real later uses. No unrelated or finished object is deleted.

Crew occupancy is visible in each relevant tile name (`… · crew aboard`). A single declarative `labelAfterCreated: {item: 'occupied-refuge', label: 'Crawler'}`-style rule removes the occupancy wording after the crew reaches shelter. `Bring crew to shelter` is an intermediate objective followed by `Feed sheltered crew`. Labels derive from existing discovered facts; Undo restores the prior label, and loading never rewrites physical identity, history or save version. The board, accessible label, dragged tile, item views, partner captions, arrival summaries, slots, readers and celebration labels share the projection. Layout reserves the larger label footprint, avoiding a state-dependent repack.

## What the graph guard checks

`schema/lifecycle-graph.ts` uses only explicit `transform` / `incorporate` lineage, including installation containment. It does not derive physical identity from item names, English descriptions, terminal status or keyword matching.

1. **Conditional retention:** a transformed/incorporated input can be kept alive by a different-output consumer even though (a) the outputs meet through declared lineage, (b) two alternate transformed states reconverge through further identity transformations, or (c) the output or a later transformed identity successor can perform the old use with the same other operand and output. Installation components are covered too; retaining the installation target itself is normal.
2. **Retained lineage:** an input declared `retain` has another explicit transformation/incorporation path to this same result. This catches inconsistent alternate recipes, including nonterminal upgraded objects.

Same-output alternatives do not cause conditional-retention warnings: discovery of that output already disables them in `needed()`. Ordinary tools, references and independent shared-material branches do not warn merely because they have no later use. Merely meeting in a later assembly is not a pure-identity diamond.

These are static potential-conflict diagnostics, not an exhaustive physical-semantic proof or a route solver. Capabilities, exact action order and every natural-language relationship are not inferred. A legitimate independent use may explain a warning; a unique evolving object may instead need an exclusive transformation or corrected routes. Never delete an input just to satisfy the checker. A missing warning is not proof that arbitrary content semantics are right.

## Explicit, narrow exceptions

A reviewed exception lives on exactly one recipe input:

```ts
lifecycle: {
  wood: {
    role: 'incorporate',
    reason: 'Timber enters the window frame.',
    graphExceptions: [{
      warning: 'conditional-retention:house',
      reason: 'The frame uses some timber; separate lengths are still needed for the house structure. These are two material allocations, not two states of one piece.'
    }]
  }
}
```

The rule/conflicting-recipe ID is not a wildcard. The build rejects unreviewed warnings, blank/very short reasons, reused ordinary lifecycle reasons, unknown/stale warning IDs, duplicate declarations and malformed fields. Adding a new conflict cannot silently inherit an old exception. Human review is still responsible for the reason's truth: string length is only a basic completeness guard, not a semantic judge.

The 24 baseline Elements declarations individually explain actual stock/portion/independent-vessel consumers (wood, boards, pottery, glass, water, lids, fruit, paper). No broad item-kind whitelist or blanket automatic waiver exists. Independent review checked all 24 against the real graph; two paper reasons were corrected to describe alternative records supplemented by instruments, not an invented record-combining recipe.

## Enforcement and preservation

`npm run build` already invokes `check:content`; that command now fails on unreviewed graph warnings in the six current featured worlds and the optional current Divinity-light world. Historical direct-route snapshots are read-only diagnostics and stay byte-equivalent; the new check does not rewrite them. The ordinary existing lifecycle validators still apply to their existing scope.

Old already-duplicated saves retain their tokens verbatim. Removal happens only when the repaired recipe is actually performed; no restore/advance/move sweep culls old copies. Existing IDs, discovered flags, route archives and save versions remain intact. Historical `tow-old-alias` evidence depended on the disabled duplicate; preserve that evidence against its exact predecessor rather than claiming it is a valid new physical route.

## Verification scope and integration

Focused commands:

- `node --test tests/lifecycle-graph-anomalies.test.ts tests/crawler-identity-and-visible-crew.test.ts`
- `node --test experiments/tangible-campaign/ui/campaign-controller.test.ts`
- `npm run check:content`
- `npx tsc --noEmit`

The graph suite includes nonterminal, incorporation and installation mutants; multi-step identity reconvergence and successor replacement; shared-tool and independent-material negatives; scoped/stale/invalid exception tests; and each real crawler flag removed independently. The crawler suite covers both drag directions, exact replacement position, both tow/repair/shelter orders, actual full canonical completion and every checkpoint, Undo, restore, goals and old duplicate saves. Controller evidence is synthetic DOM/controller evidence, not a native-browser pixel or touch claim.

`semantic-delta.json` is the exact reversible current-content change ledger from LIVE86. `lifecycle-delta.json` supplies exact before/after decisions for the current audit successor. Apply these fields, not whole campaign files, over concurrent aliases or Mars natural-order changes. Runtime dependencies use the separately authored `exclusive` schema/runtime. Model/controller diffs change only conditional-label presentation, validation and conservative label sizing; merge them over the separate interaction fixes.

This candidate did not run the full aggregate, push a commit, deploy a Site, alter the user's active checkout, or repair an already-duplicated saved state. Integration owns the final merged checks and source pins.
