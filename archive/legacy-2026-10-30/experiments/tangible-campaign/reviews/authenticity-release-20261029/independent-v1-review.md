# Informed independent adversarial review — authenticity repairs

29 October 2026. **Independent informed review, not blind playtesting.** The reviewer read the candidate's review packet and rationale before challenging the source. This is a local engineering/content review; no source edits, issue changes or publication were made.

## Decision

**Do not call the combined Elements candidate fully independently accepted yet.** I found one concrete remaining direct-consumer blocker in the bowl family. The other five repair families are defensible local changes: Mars's deletion and Atlas's conjunction are especially clean. The weighted press is not physically impossible or an elaborate processing checklist, but its mill-density cost remains a real design concern, not something green tests erase.

- **B1 — bowl/bell:** Making `bowl` explicitly dried and unfired leaves required `Iron + Formed clay bowl → Bell` as a retained “dry form” consumer. There is no authored metal-forming mechanism establishing that use, and a fired copy with the same basic shape cannot substitute: `Iron + Fired glazed bowl` makes **Cooking pot**. The justification that basket/jar are already made before firing does not cover this later bell.
- **M1 — press:** Mechanically credible and locally intelligible enough to keep as a candidate, but the mill grows from 8/13 to 10/17 arrival/peak. Do not market that as a small-set success. Test whether this one construction earns its space before adding any more processing.
- **M2 — rain wording:** The direct `rain-record` description still says “Written measurements from repeated readings of the rain gauge.” Update that to repeated **relative collector levels** for consistency. It does not currently state millimetres or calibrated amounts, so this is wording polish rather than a false quantitative result.

No additional release blocker emerged from the reviewed repair deltas. Mounted-lamp physical identity is **unresolved, unchanged, and not an implemented repair**. An eventual release still needs its own integration, aggregate and actual visual/native evidence as appropriate.

## Exact source and mechanical evidence

Reviewed source root:
`/workspace/shared/authenticity-repairs-successor-20261029/source`

Manifest:
`/workspace/shared/authenticity-repairs-successor-20261029/evidence/CANDIDATE-SOURCE-MANIFEST.json`

SHA-256: `48ab071ebb25e315ccf546d9af9a0ac381f6bf8f810c03ab3e5a55987477a4f5`.

After reproduction, **all 2,292 manifest files matched**. Receipt: `seal-verification.json` beside this report.

I reproduced the candidate's focused suite in an **independent scratch copy of the test file**, changing only module/root URLs and its output directory so sealed files were never written. The actual imported source remained the sealed candidate. This was not a novel blind test or a whole-repository aggregate.

Command:
`node --test /workspace/shared/review-authenticity-repairs-20261029/focused-readonly.test.ts`

Result: **16 passed, 0 failed, 0 skipped; exit 0; 109.167 seconds.** Log: `focused-readonly.log`; redirected route/label evidence: `reproduced-results/`.

The creature worker yielded the serial test slot before this run; I explicitly returned it at terminal completion. No build or aggregate was run by this reviewer. The candidate author's successful build is reported evidence, not a reviewer rerun.

Coverage reproduced includes all three complete canonical routes with normal combine/drop and ordinary reverse drops, local inputs and partner highlights, duplicate rejection, fixed-panel numeric bounds, changed-route Undo and JSON/v1/CCSP1 restoration, all Mars/Elements checkpoint prefixes, press-before-grain-mill order, two shuffled legal preparation orders, source/schema/lifecycle/goal/construction checks and synthetic label binding. **Not every optional changed consumer is exercised by those canonical routes** (notably `brine`); the consumer review below includes source inspection and must not be represented as exhaustive dynamic branch execution.

## B1: the bowl repair stops one consumer too early

Relevant candidate source: `experiments/tangible-campaign/ui/stories/authenticity-repairs-v1.ts:53–65`.

The new semantic distinction is good: the early object is formed, dried, unfired clay; the later object is fired/glazed at the already-existing kiln. Routing paint, pond sampling, brine, oil-lamp service and washstand through the finished vessel avoids a firing checklist and repairs the original liquid-service mismatch.

The complete direct `bowl` consumers, however, are now:

1. Fiber + formed bowl → Basket (retained form).
2. Clay + formed bowl → Clay jar (retained form).
3. Formed bowl + glaze at kiln → Fired glazed bowl.
4. **Iron + formed bowl → Bell (retained form).**

The fourth remains inherited from `ui/campaigns/elements.ts:3891–3904`. It is required on the canonical route at action index **214**, in `timekeeping`, for `Bell + Rope → Dinner bell` and the visible **Make Dinner bell** goal. It is not merely an unreachable recipe. The reproduced pottery witness also shows **Formed clay bowl and Fired glazed bowl surviving side by side**, with the future bell keeping the former relevant long after the basket and jar have already been made.

The candidate supplies neither a bell-mould state nor an actual forging operation in this recipe. A dried clay bowl is not automatically a reusable metal-forming tool just because its surface is dry. A shape reference is a possible interpretation, but then a fired bowl is at least as capable as that reference. Instead its pair with iron is reserved for Cooking pot (`ui/campaigns/elements.ts:4215ff`). The repair therefore leaves an arbitrary state-sensitive distinction that its own explanation does not earn.

This is a **semantic/consumer acceptance blocker**, not a claim that iron bells cannot exist or that the route fails. The Pitt Rivers Museum documents a real iron bell made by hammering/bending iron sheets; that is counterevidence to any absolute “iron cannot make a bell” objection, but not support for the candidate's unfired reusable bowl mechanism. [Pitt Rivers Museum, clapper bell 1940.7.0339](https://web.prm.ox.ac.uk/southernsudan/details.php-a%3D1940.7.0339%26show%3D1940.7.0339_b.jpg.html).

**Smallest design direction:** remove the dependency on the unfired bowl from this later payoff. Prefer reusing a recognisable existing metalworking mechanism, or simplifying away the separate Bell-making wrapper if the useful hanging/calling-bell result can be expressed more directly. Do **not** respond by adding a mould-making, firing, pouring, cooling and demoulding checklist. Merely adding a fired-bowl alternate is not a drop-in fix because that pair already produces Cooking pot. Any replacement needs a bounded name/task-first review and the two affected downstream goals/routes checked again.

The existing formed-jar/food-storage and Cooking-pot mechanisms are adjacent inherited questions, not established as solved by this batch. I have not expanded B1 into a demand to perfect all pottery and food storage before accepting unrelated repairs.

## Family-by-family challenge

### 1. Oil-bearing seeds and weighted seed press — locally defensible, density concern

Candidate lines 45–49 and 75–77.

**Factual challenge:** Reject the claim that stone pressure cannot release oil. FAO explicitly describes pressure supplied by stones and levers among traditional oil-extraction methods, while distinguishing extraction from preliminary breaking and noting seed/equipment suitability. The candidate supplies a wooden support/draining bed and uses a heavy stone as the weight; that is a reasonable hand-powered mechanism family. The source does not certify the fictional press's yield, exact construction or ability to handle every seed. [FAO, Principles of Oil Extraction](https://www.fao.org/4/X5043E/x5043E03.htm).

**Forward composition:** With the visible **Press seed oil** objective, **Oil-bearing seeds**, **Millstone** and **Planks**, a wooden weighted press is a discoverable candidate through normal highlights. The frame gives the material pair a purpose beyond “two things happen to be nearby.” This is still an informed reviewer judgment, not a measured human discovery result. Selecting oil-bearing seed from the abstract Plant/Fruit material family is consistent with this four-primitives world's existing grain/wood/fiber abstractions; the game is not claiming every juicy fruit's seeds are equally pressable.

**Why not simplify automatically?** The new construction adds one meaningful apparatus identity rather than grinding/filtering/bottling administrative states. Removing its frame would again leave the weight/seed-support/collection mechanism underspecified. I therefore would not delete it solely because it adds a recipe. Equally, FAO support is not evidence the extra click is enjoyable. If play evidence makes this step feel like padding, simplify the oil/lighting branch rather than rationalising an ever longer press chain.

**Consumers/lifecycle:** Seeds still plant seedlings; oil still supplies fiber wick and soap. The press is retained equipment after expression. Millstone is incorporated in the press or grain mill, with the existing non-finite craft-stock/conditional-retention grammar retaining a supply while the independent construction still needs it. Both millstone orders completed in the reproduced tests. This does not justify duplicating an explicitly singular powered lamp elsewhere.

**Density:** The canonical mill finishes with 17 visible things, including the earlier waterwheel/gear/mill/flour work and the seed/press/oil branch. The current goal does point to the remaining seed-oil action; it is not arbitrary clutter removal or a fake chapter boundary. Still, the candidate weakens the recently improved small working-set cue. Keep **10/17** visible in the acceptance record; do not relabel it “within the 5–10 target.” No new delivered machine, stock batch or location was introduced.

### 2. Formed/fired bowl — good core repair, blocked by B1

Candidate lines 53–67.

The firing state change is authentic, and using the already-existing kiln/glaze action is preferable to inserting extra processing. V&A's account distinguishes forming, unfired ware and firing. It does not establish a powered machine hidden inside the game's simple wooden disc, and none is required by the explicitly hand-shaped candidate. [V&A, Richard Batterham: methods of making](https://www.vam.ac.uk/articles/richard-batterham-methods-of-making).

Direct fired-bowl consumers reviewed: paint; pond water and its two slide routes; brine and salt; drinking water; oil lamp and its watch/paper-lantern branches; Cooking pot; washstand. The invalid unfired washstand alternate is removed rather than retained as a false shortcut. Basket and jar already exist before kiln access on the authored route, so adding unreachable stronger-form alternatives solely to inflate coverage would be pointless. The late bell is the exception that must still be resolved.

### 3. Clear relative rain collector — accept, minor terminology cleanup

Candidate lines 68–74, 78–79.

Glass bottle + Paper can supply a visible marked collector under ordinary writing/attachment compression. An intact narrow-neck bottle does **not** become a calibrated rainfall-depth gauge. The candidate correctly narrows its result to same-vessel fill-level comparison; it does not silently add a funnel, cylindrical geometry or calibration. Met Office's actual DIY rainfall gauge uses additional geometry/setup and repeated readings, supporting the distinction rather than certifying the candidate's accuracy. [Met Office, make your own rain gauge](https://weather.metoffice.gov.uk/learn-about/met-office-for-schools/other-content/other-resources/weather-station/rain-gauge).

This serves the visible **Make Weather record** purpose. The candidate's attempted `rain-gauge` goal-text rewrite does not introduce a new task in this version: its weather chapter has only the Weather record goal. Glass-bottle's other consumers (hourglass and bottled cider) remain separate ordinary uses; the marked bottle becomes the filled collector, which remains available as an observational source.

All direct rain-result consumers remain coherent: Paper + collected level → Rain record, Wind record + collected level → Weather record, and the existing windsock/rain-record or both-record alternatives. M2 makes their prose consistent with the honest narrower measurement claim; no new calibration chore is warranted.

### 4. Oil-wick torch — accept as a bounded portable-light composition

Candidate lines 50–52, 84–91.

Fuel-soaked fiber supplies the flame-bearing head and wood its support. Binding/ignition are reasonable compressed operations, not missing principal operands. The Fitzwilliam terminology includes fuel-bearing fiber bundles and carried supports; Milwaukee's collection account separately identifies plant-oil fuel and fibrous wicks. Combining those into this modest fictional torch is an inference, not a historical attribution of the exact design or a burn-duration/safety certification. [Fitzwilliam Museum, torches](https://data.fitzmuseum.cam.ac.uk/id/terminology/term-68417); [Milwaukee Public Museum, oil lamps](https://www.mpm.edu/node/15505).

The existing glass-protected Lantern → Lighthouse branch remains, with no new optical-power claim. Wick's other consumer is the now-fired-bowl Oil lamp, followed by watch/paper lanterns. Oil survives while the soap branch needs supply; fiber remains for its other crafts. Charcoal is not incorrectly banned as combustible; it simply is no longer a loose unbound torch head, and manufacture moves to ink's first real need. This is a much clearer material composition than loose charcoal plus timber.

### 5. Selection conjunction — accept

Candidate lines 36–40.

The output now visibly retains both inherited variation and limited resources instead of merely restating scarcity. It does **not** pretend those two premises identify reproductive winners; **Some inherited differences leave more descendants** remains the next explicit premise. That produces **Unequal reproduction changes a population**, subsequently used with deep time and in the cooperation comparison. Population pressure's separate social-justice comparison and inherited variation's breeder-choice branch remain intact.

This is a reasonable attributed teaching conjunction, not a universal sufficiency proof or moral inference. Darwin's primary text treats inheritance, struggle and preservation/reproduction as related but distinct parts of the account. [Darwin, Origin of Species, 1861](https://darwin-online.org.uk/converted/published/1861_Origin_F381/1861_Origin_F381.html).

No extra object or action was added. The label is longer; synthetic binding verifies text presence, not actual mobile legibility. Atlas's existing evolution working-set density remains inherited and is not improved by this wording change.

### 6. Mars basin comparison deletion — accept; best simplification in the packet

Candidate lines 16–34.

The earlier ice-core photograph contributes no additional observation to the specific fine/coarse/fine sediment finding. Deleting its gate and `layer-interpretation` is preferable to an elaborate story justifying a useless comparison. Grain images plus mineral spectrum can legitimately produce a combined observation with an inconclusive spectral result; learning the specific observation at that action does not require the input labels to announce it in advance.

The result plus specimen log still gives a properly identified Basin field record. That record remains an input to the later qualified interpretation and archive. The log still labels the loose gravel chip. The independent earlier core photo remains required at the outcrop and later archive/capsule path, but no longer gets hauled into the basin. No dating, shared origin, transport agent or life detection is fabricated by the removed comparison.

Canonical basin arrival/peak improves **10/14 → 9/12**, and route length **229 → 228**. This is a meaningful reduction, not merely deleting a recipe while orphaning its later use. Normal, reverse and serialization routes completed in reproduction.

## Limits and release boundary

- Source/authoritative-source review and logical/synthetic replay, **not** browser/native pixels, uninformed human discovery, comprehension or enjoyment evidence.
- The 53 registered worlds are unchanged; these candidate identities remain unregistered. Passing focused tests does not make a release or validate all catalogue branches.
- Four opening primitives, all 30 Elements places and stock batches remain exact. No apparent density gain comes from invisible cleanup, added stock or same-place chapter resets.
- Mounted lamp is not repaired. Its original bench/beacon physical identity issue remains explicitly open; do not count it among accepted implementations.
- No denial/access blocker occurred. The only temporary coordination dependency was the test slot; it was obtained, used and released. All assigned read-only review work is complete.
