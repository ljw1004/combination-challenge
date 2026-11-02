# Quantitative story analysis

The analyzer compares the scale, construction structure and chapter pacing of manuscripts. These are descriptive measures to guide editorial questions, not targets, a quality score or evidence of enjoyment. Use the [game’s philosophy](../README.md#philosophy) and [experience evaluation](fun-and-evaluation.md) to judge what the constructions mean to a player.

## Run it

```sh
# All published manuscripts, discovered by the shared story loader.
npm run analyze

# All published manuscripts plus the preserved Mars experiment.
npm run analyze -- --include projects/mars-study/mars-v2/mars.md

# Regenerate the retained six-story research report.
npm run analyze -- --include projects/mars-study/mars-v2/mars.md --output projects/mars-study/story-analysis.md

# Compare selected published stories, optionally adding draft paths.
npm run analyze -- settlement cookbook mars

# Machine-readable summaries; add --details for per-item and per-chapter rows.
node src/analysis/cli.ts mars --json
```

Published inputs accept the same slug or `stories/`-relative path as other tools. Repeat `--include PATH` for additional drafts outside the catalogue. Duplicate paths are counted once. Output defaults to Markdown on stdout; `--output PATH` writes a report only after all inputs succeed and refuses to overwrite an input manuscript. Its parent directory must already exist. `--json` emits schema version 1 with unrounded values, manuscript hashes, sample sizes and replay coverage; `--details` adds explanatory rows and chain examples. Use `node src/analysis/cli.ts` directly when piping JSON, to avoid npm’s command banner.

Keep the requested aggregate research report in its active project. Detailed exports used to investigate a result belong in ignored `runs/` space and should be discarded after the conclusion is recorded. The program does not modify manuscripts or run artwork checks.

## The ten measures

| # | Measure | Unit and sample |
|---|---|---|
| 1 | Item inventory | Total distinct item identities per manuscript, broken down into primitives and derived identities. |
| 2 | Combination rules | Total distinct logical rules per manuscript, broken down into explicit rules and implicit slot-fitting rules. |
| 3 | Chapters | Total authored chapters, with non-ending chapters and a final chapter without goals distinguished. |
| 4 | Construction depth | Longest structural dependency path, measured in combination steps, per item identity. |
| 5 | Expanded construction-tree size | Maximum number of item-node occurrences in a construction tree, per identity, including the result and intermediate states. |
| 6 | Primitive leaves | Maximum number of primitive-leaf occurrences in a construction tree, per identity. |
| 7 | Chapters linked by a chain | Greatest number of distinct combination chapters on one dependency path to each encountered identity’s final state in the reference replay. |
| 8 | New primitive supplies per chapter | First arrivals from the engine at chapter entry, per visited non-ending chapter. |
| 9 | Combinations per chapter | Accepted combination actions, including fitting, per visited non-ending chapter. |
| 10 | Peak board size | Maximum available item-token count on the current chapter’s surface, per visited non-ending chapter. |

Every distribution reports **min, max, arithmetic average and median**, with its sample size. The median of an even sample is the mean of its two central values. Empty samples have `null` statistics (shown as an em dash), not invented zeros. Markdown rounds to two decimals. Measures 1–3 are single totals within each story, so their four statistics compare the selected manuscripts. Measures 4–10 have distributions within each story; they are not pooled across differently sized stories.

The primitive/derived and explicit/fitting splits explain totals rather than introducing additional ranked measures. Opening supplies are included in measure 8: a four-item opening followed by thirty chapters with no new supplies has a maximum of four, not zero. A final goal-free ending is excluded from chapter distributions, but a goal-free chapter in the middle is included if visited. Skipped chapters stay in the authored total and are absent from replay samples. JSON includes visited chapter indices, which are zero-based.

## Identity, fitting and structural trees

The shared parser deduplicates recipes and identities. Renames are not new items; hotspots are not items. Primitive means “no explicit recipe produces this identity,” using the engine’s `indexStory` classification. A compound owner can be a primitive even though fitting components into it takes several actions. Installation adds a rule, not a new identity. A two-item operation at a hotspot is still one rule, and an item/hotspot operation has only one item input.

For an unfitted primitive, depth is 0, tree size is 1 and primitive leaves is 1. For an explicit recipe with input constructions `A` and `B`:

- Depth is `1 + max(depth(A), depth(B))`.
- Tree size is `1 + nodes(A) + nodes(B)`.
- Primitive leaves is `leaves(A) + leaves(B)`.

Omit `B` for item/hotspot operations. Reused inputs are unfolded each time. If `A + B → C`, `C + A → D`, `C + B → E`, and `D + E → F`, then F’s expanded tree has **11 nodes and 6 primitive leaves**, despite there being only six distinct identities in the whole example. This measures accumulated construction structure; it does not mean making C twice or supplying six physical objects. Resources in the game are not depleted quantities.

References such as `Box[Motor,Battery]` include preparation of the box and both components, then one fitting step for each missing component. Each fitting step adds another version of the owner to the tree. The deepest component can be fitted first to maximize path depth. Components already present in a recipe’s result are not fitted again. Installation is not represented as an owner-to-itself graph edge.

An identity contributes one sample, using the largest value over its bare form and forms actually referenced by chapter supplies, goals, recipe inputs or recipe outputs. The analyzer does not invent a reference containing every declared slot. Each of the three construction measures independently maximizes across alternative producers; the maximum depth and maximum tree size need not come from the same recipe. Reading conditions and artwork variants do not add construction targets. An unfitted primitive therefore usually contributes a zero to depth, while a primitive owner with a referenced fitted form can contribute a positive depth.

These are **structural maxima**, not a search for the longest legal playthrough. They ignore exclusivity conflicts between different branches, retirement, chronological hotspot availability and consistency of alternative producer choices for a reused identity. They also exclude optional fitting beyond the requested form. A longest-path example names the successive results on one dependency path; the other ingredients still matter. Do not describe it as a complete, executable recipe or a required number of player actions.

The current implementation rejects dependency cycles, including a cycle with an acyclic escape recipe, rather than silently pruning it or reporting infinity. Cyclic story semantics require a different bounded construction-plan analysis. Counts beyond JavaScript’s exact integer range also fail explicitly. These limits do not affect the six manuscripts in the initial comparison. Parse and declaration errors fail analysis; this tool does not replace the complete story linter.

## Reference replay and continuity

The analyzer asks the existing checkpoint planner for a complete witness and replays its actions through the shared engine. The planner prefers preparations whose inputs already exist. It is deterministic for a given manuscript and implementation, but it is neither a globally shortest solver nor exhaustive exploration of optional content. Failure to obtain a complete witness fails the report; it is not proof that no player can finish.

For measure 7, each primitive starts with an empty chapter path. A combination extends each input’s path with the current progression chapter, unless that chapter already ends the path, and retains the longest resulting path. Because progression is monotonic, this counts distinct chapters. Fits extend the owner’s previous history. Recorded histories are immutable: fitting a tool later cannot rewrite the history of something made earlier with that tool. Combining a fitted object uses that object’s actual fitted history, even if the recipe did not require every fitting.

For example, `A → B` in chapter 1 and `B → C` in chapter 5 links **two** combination chapters, not five. Two separate branches built in different chapters are not unioned into one chain. Initial supply arrivals, moving an object, and the source location of a recipe do not count as combination events. Recipes are globally active, so declaration chapters would give misleading continuity figures.

The sample for measure 7 includes all encountered identities, including retired ones and unused primitives with a zero. It excludes unencountered optional content; its sample size is shown beside the result. Its maximum is the longest chapter chain **in this witness**, not the maximum across all legal routes.

For measures 8–10, count entry and every replayed action. Board size includes available tokens at hotspots and fitted owners, but excludes installed components, fixed landscape hotspots and items remaining on earlier chapter surfaces. It is a working-set count, not a measurement of pixels, overlap, screen visibility or perceived clutter. Scrollback remains available in the game.

## Reading a comparison

Deep construction trees suggest that later work builds on earlier work; they can also come from repetitive assembly. Frequent new supplies may explain disconnected episodes, but a new ingredient can be exactly what a story needs. A small board can be focused or empty. Longer chains do not automatically mean better continuity, and higher rule counts do not mean more interesting play.

Use a number to locate an editorial question, then inspect the underlying constructions and play the passage. The [Mars comparison](../projects/mars-study/story-analysis.md) is the first retained application. Its hashes identify the inputs; rerun the command when manuscripts or the engine change.
