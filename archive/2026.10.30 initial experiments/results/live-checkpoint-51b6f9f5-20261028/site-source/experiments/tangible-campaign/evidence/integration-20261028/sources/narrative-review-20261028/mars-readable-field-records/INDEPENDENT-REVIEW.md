# Independent Mars field-record payoff review

## Verdict: CLEAR after one narrow correction

The five optional field readings and chapter 19 opening expose the interpretation already established by the story, without adding a new discovery, measurement, mechanism, requirement, or recipe. The original proposal contained one premature accomplishment claim; the corrected candidate resolves it. No other substantive correction is warranted.

- **Reviewed original:** `ec0722640f4e57b002938b76051e9effe312110f11108704c5c3b7faa318653a`.
- **Corrected final:** `81d9aee6504bae6cb549b3b70d57de9fbcfe216b6bfe53bd899f0a81da4365ea`.
- **Untouched supply-copy base:** `5d06de23af4833c8bfac6797e59e5ae96d06c9076b93aaaeef876387a4f4ad46`.
- **Runtime:** unmodified checkout `/workspace/shared/combination-fork-recovery-20261028`, HEAD `61a9b4ee8c6235bff07f97eb16d713ec6125c81e`; `engine/model.ts` SHA `793354131dc6b2cf9a5398e0dc163f5d834e62d477b719e7dedcfdcf6a2c8265`.

This is isolated content/logic review, not integration, publication, a new source-blind trial, or evidence that a human will find the payoff satisfying. No active player's packet/session was inspected or modified. No browser, rendered UI, or controller/DOM-interaction tests were run. Headless engine, lifecycle and persistence-unit tests were run.

## The one correction

On the actual authored route, action **167** creates `sleeved-comparison`. At that point the comparison case has **empty slots**; neither the ripple impression nor the logged gravel specimen exists. Their packing occurs at actions 169 and 171. The original reading asserted that the specimens were already separately packed.

Changed only:

- Before: `The separately packed specimens let another team inspect our reasoning.`
- After: `Keeping the specimens separate lets another team inspect our reasoning.`

The final wording describes the benefit without falsely claiming the separate objective is complete. No dependency or objective was added. The original candidate, author, delta and successful pre-review verification are preserved as `pre-review.*`. `author.py` now reproduces the corrected candidate. `review-correction.diff` and `review-correction.json` identify the exact one-sentence delta and both hashes.

The initially guessed author assertion `depot` was corrected to the actual stage ID `depot-way` before the author produced its candidate. It was a generation-script assertion, not a game defect.

## Content and inference audit

| New reading | Already-established support | Review |
|---|---|---|
| `grain-images` | `sediment-core`, `grain-images`, the grain-image recipe, and chapter 17 completion already state a coarse middle band, fine layers above/below, retained order and unresolved transport. | No new grain sizes, dates, cause or biological inference. Concise actual observation, not a fake reading or recipe hint. |
| `basin-field-record` | Existing record/recipe preserve the coarse/fine sequence; `layer-interpretation` distinguishes the earlier ice profile from the sediment site. | “We kept a labelled specimen” is true when this record becomes available. Unique producers require `retained-sediment → mineral-spectrum → sediment-comparison → layer-interpretation → basin-field-record`; none are initial or cache supplies. The retained specimen exists at authored action 158. No shared age/history is inferred. |
| `qualified-basin-story` | Existing `gravel-view` records rounded gravel in its rock matrix and neighbouring layers; a scaled view supplies context; the original qualified-story description and chapter 18 completion already favor water transport over ripple shape alone. | Supports an interpretation, not proof. No numerical size, age, transport speed, river identification or life detection is invented. |
| `comparison-board` | The original board description explicitly keeps source positions separate and uncertainty visible; the prerequisite qualified story already contains the comparison. | Scientifically cautious, coherent synthesis rather than a stronger new claim. |
| `sleeved-comparison` | The original sleeve protects the annotated board; independent specimens belong in the separately labelled case. | Correct after the timing fix. It preserves the interpretation and source separation without asserting that packing has happened. |

The repeated age/life limits are proportionate to optional, independently encountered records. They do not gate progress or turn the notes into procedures. Minor repetition is not a substantive flaw and does not justify broad copyediting. Chapter 19's one opening sentence supplies the prior result without a completion recap or an additional Continue step.

### Scientific grounding versus fictional observations

All five readings explicitly attribute themselves as **fictional expedition field notes, not real mission measurements**. The layer sequence, retained specimen and expedition synthesis are authored fiction already present in the base, not data extracted from NASA. The current change does not introduce numerical grain sizes, dates, a life result, or a new claim that the separated sites have the same history.

The NASA/JPL Hottah material grounds the *kind of inference*: rounded gravel embedded in conglomerate, considered with its size and geological context, supports past flowing-water transport. It does not establish the age, a biological origin, or the actual results at this game's invented site. The reading's “supports” language is appropriately limited. [NASA Science, Remnants of Ancient Streambed on Mars](https://science.nasa.gov/resource/remnants-of-ancient-streambed-on-mars/); [JPL, Martian Streambed Evidence Rock in 3-D](https://www.jpl.nasa.gov/images/pia16223-martian-streambed-evidence-rock-in-3-d/).

The USGS publication identifies Martian wind-driven ripples resembling water-worked terrestrial bedforms. This supports withholding a river conclusion from ripple shape alone; it does not identify the origin of the game's particular rippled surface. [USGS, Large wind ripples on Mars: A record of atmospheric evolution](https://www.usgs.gov/publications/large-wind-ripples-mars-a-record-atmospheric-evolution).

The primary pages were inspected on 28 October 2026. Their actual Hottah dimensions, mission dates and other measurements were deliberately not imported into this fictional record.

## Final verification

### Exact content boundary

`verify-byte-contracts.py` reverses only the candidate identity, five new `reading` properties and chapter 19 opening sentence. Serializing that inverse produces the **exact original base bytes**, not merely equivalent JSON. Recipes/lifecycles, source records, all prior item definitions, locations, supplies, stage graph/objectives/caches/travel/completion, and all checkpoint actions remain unchanged. The candidate has 458 items, 23 locations, 9 initial items, 213 recipes, 24 stages and 25 checkpoints.

The one review correction is itself exactly one sentence in both candidate and author. `base-to-final.diff` gives the full bounded change. `byte-contracts.json` records the assertions.

**Presentation caveat:** the existing runtime uses reading markers in tile sizing. Four of the five new readable tiles change from 44 to 50 logical pixels tall; some packing coordinates consequently change. Thus “content-only/no mechanical delta” means unchanged graph, resources, objectives, lifecycle effects and gameplay decisions, not identical pixel coordinates. No visual-layout quality claim is made.

### Candidate on exact61a9 runtime

All four current validators pass: scenario schema, explicit lifecycle, objective progression and construction continuity.

| Route | Width(s) | Actions | Combinations | Result |
|---|---|---:|---:|---|
| Authored | 320, 360, 600 | 230 each | 200 | Complete |
| Beacon | 360 | 234 | 204 | Complete |
| Tow | 360 | 233 | 203 | Complete |
| Tow old alias | 360 | 233 | 203 | Complete |

For every action, the candidate and base have exact event logs and identical state after excluding presentation coordinates. Object identity, areas, location relationships, slots/components, inventories, discoveries, caches, objective completion and metrics are identical. Combine actions were resolved through the actual `dropAction`. All six runs finish without ever requiring a read.

All **25 checkpoints** replay with identical base/candidate events and semantic state. Each round-trips through both `restore` and the actual compressed save codec. The authored 360-width route also round-trips at all 24 advances. All six final saves round-trip. The unchanged base still accepts its own completed save; the new scenario identity rejects cross-identity loading rather than silently migrating it.

The five readings are genuinely accessible via runtime `playerView` at their creation points: actions **152, 158, 165, 166, 167**. Reading/retrieving their text leaves the entire game, history, metrics and events byte-unchanged. Mutating only the returned reading copy does not mutate authored content. Save/load retains the same states. This verifies model-level observational reading, not modal opening/closing, selection/scroll or visual handoff timing.

At action **172**, after a legitimate chapter 18 completion/advance, the actual chapter 19 `playerView.stage.motivation` begins with the ancient-water/not-life payoff. It is available independently of the old completion text.

### Existing logical contracts

Six untouched runtime suites passed **75/75** tests, zero skipped/failing: model, independent engine, lifecycle, objective flow, event-local construction/removal, and headless persistence/autosave. Controller/DOM and native-browser tests were intentionally excluded. See `frozen-runtime-core-tests.log` and exit file `0`.

## Reproduction

From this directory:

```sh
python author.py
python verify-byte-contracts.py
node verify-independent.mjs
sha256sum -c INDEPENDENT-SHA256SUMS
```

The verifier asserts the frozen base and runtime hashes before testing. Candidate results are in `independent-verification.json` and `independent-final.log`.

Headless baseline suites (from the exact runtime checkout):

```sh
node --test \
  experiments/tangible-campaign/engine/model.test.ts \
  experiments/tangible-campaign/tests/independent-engine.test.ts \
  experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts \
  experiments/tangible-campaign/reviews/lifecycle/objective-flow.test.ts \
  experiments/tangible-campaign/reviews/lifecycle/event-local.test.ts \
  experiments/tangible-campaign/reviews/persistence/save-autosave.test.ts
```

No implementation/build/catalog integration or human/UI validation is claimed. The final candidate is clear for the parent's next content iteration under those limits.
