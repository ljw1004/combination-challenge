# Atlas later-story payoffs — independent author-aware audit

**Candidate:** `atlas/revision-v2-concrete-opening/scenario.json`  
**SHA-256:** `76c02d0303dff89c9b353274d3d1a31eeb3e352f96fe82d67e107900be5d9d4f`  
**Reviewed:** 28 October 2026. Scope: `anatomy`, `circulation`, `longitude`, `future-observatory`, `future-memory`, `future-city`; upstream creations inspected where needed. Read `BRIEF.md`, the recovered/frozen `DESIGN_PRINCIPLES.md`, candidate README, chapter/connection metadata, recipe chains, items/readings and frozen renderer. No candidate, Site or remote edits. This is not fresh play, a human fun judgment, or a review of every other chapter.

## Bottom line

The later route is mechanically playable and has a promising connected spine. Its central weakness is not chronological disorder or excessive speculative ambition: **it frequently names the result of doing intellectual work without providing the claim, observation, calculation or changed capability that would make that work happen for the player.** The three futures should be kept; their questions are much more interesting than a generic responsible-technology checklist. They need particular fictional events and consequences, not more feasibility disclaimers.

A separate, concrete technical error occurs in the longitude recipe graph: the lunar branch produces longitude without current local time.

### Mechanical evidence and its limits

- Independent author-known replay of the supplied route: **285 accepted actions, 254 combinations, completed journey.** No route-blocking runtime failure found.
- These six chapters contain **53 recipes**. All 53 resulting item definitions lack `reading`. That is not inherently a defect; the important fact is that most result labels also omit their substantive results.
- Frozen `ui/campaign-main.ts:86–89` renders item labels, fitted-component labels and intentional `Item.reading`; it does **not** render item descriptions or recipe explanations. The runner has the same visibility boundary. Author metadata therefore cannot substitute for player-visible evidence.
- Future intermediate objectives correctly advance to their successors. In the replay, the final observatory visibly retains `Living-light imager`, and the final city retains `Metabolic partnership`.
- Evidence: `later-author-replay.mjs` and `later-author-replay.json` in this directory. The replay uses the frozen candidate runtime, **not** the newer integrated lifecycle implementation. No browser/touch or independent-discovery claim is made.

## Ranked findings

### 1. High — the lunar method manufactures longitude before using local time

**Category:** technical/causal recipe defect; mechanically reproducible, not an engine crash.

`make-observed-sky-angle` combines `lunar-distance + predictive-sky-record`; `make-lunar-longitude` then combines `observed-sky-angle + nautical-table → lunar-longitude`. Neither input lineage includes the ship's current `local-noon`. The older astronomy record is not a contemporary local-time measurement. The descriptions promise a checked sky angle and tables/corrections, not a supplied local time hidden inside either input.

I replayed just those two combinations from the longitude chapter start. Both succeed, producing `lunar-longitude`; **no recipe involving `local-noon` has occurred**. See `lunarWithoutLocalTime` in the replay evidence. The final chart later has local-time ancestry through the independent clock branch, but that does not repair the already claimed independent lunar longitude.

Cleared lunar distance compared with a table supplies reference-meridian time. A longitude determination still needs the local-time comparison. The Royal Institute of Navigation article describes the lunar comparison in its modern methods as establishing GMT; Greenwich's institutional history explains the same-instant local/home time comparison. [Romelczyk, methods §2.1 and §2.3](https://www.cambridge.org/core/journals/journal-of-navigation/article/gmt-and-longitude-by-lunar-distance-two-methods-compared-from-a-practitioners-point-of-view/264D429197D6182A7D04193FD95FDD7E), [Royal Museums Greenwich](https://www.rmg.co.uk/stories/space-astronomy/history-royal-observatory?page=1).

**Bounded recommendation:** let the lunar table step produce reference time, then visibly compare it with the relevant local-time record before calling the result longitude. Reuse the inherited arithmetic where the conversion actually occurs. Keep a simplified cleared-angle teaching input rather than adding an entire navigation course. Test the two branches independently, not only the final chart's aggregate ancestry.

**Revision guardrail, independently checked after the author raised it:** do not silently treat an eighteenth-century almanac's time scale as a modern GMT table, or equate local apparent noon with mean clock time without an explicit correction. USNO dates the appearance of GMT in the British almanac to **1834**. The current candidate does not specify its scale, so this is a risk to avoid while adding concrete data, not an additional false assertion already present. [US Naval Observatory, almanac chronology](https://aa.usno.navy.mil/publications/na_history).

### 2. High — the historical chapters conceal the very evidence their motivations promise

**Category:** semantic and player-visible content defect. The resulting frustration is an untested play hypothesis.

**Anatomy:** `galenic-drawing` has a real reading describing the older two-part lower-jaw claim. But `adult-jaw`, `documented-jaw`, `dissection-record`, `anatomical-discrepancy`, `corrected-plate` and `anatomical-commentary` never tell the player the observed adult jaw is one continuous bone. There is no reading or authored diagram providing the opposing observation. Even the descriptions only say that the specimen differs. Thus `make-anatomical-discrepancy` creates the *name of a discrepancy*, not the discrepancy; nine combinations culminate in a commentary whose correction cannot be inspected.

The historical distinction is sound: the cited study contrasts the two-bone account in Vesalius's earlier *Tabulae* with the united mandible in the *Fabrica*. Keeping the comparison adult-human and avoiding a blanket denunciation of Galen is appropriate. [Gysel abstract, PMID 8209579](https://pubmed.ncbi.nlm.nih.gov/8209579/).

**Longitude:** not one of its 16 carried item definitions has a reading. No item contains an actual time, angle, clock drift, east/west direction, numeric table entry, disagreement or final range. `make-time-difference` promises a “stated conversion,” but no player-visible conversion is stated. `make-position-comparison` promises to compare two answers whose answers never exist. `make-navigation-chart` promises an uncertainty range without specifying one. The sea-trial context is real (`make-voyage-clock-record.at = sea-trial`); preserve it, but put an actual changed clock result there.

**Circulation:** here the input readings genuinely contain quantities: 5 mL/beat × 60 beats/minute × 30 minutes = **9 L**, versus a **5 L** stock. But `throughput-estimate` does not show 9 L, and `replacement-problem` does not show the comparison. `valve-record` supplies no readable direction; `circulation-route` supplies no visible route. The game says it has reconciled quantity and anatomy without showing the reconciliation.

There is also a bounded reasoning gap: cumulative flow exceeding instantaneous stock does not alone exclude a one-way system with replenishment. The candidate never specifies the rival replenishment capacity. Harvey's own chapter IX explicitly combines the quantity argument with inadequate food supply and venous return. The toy numbers are correctly attributed as invented, but that attribution does not supply the missing premise. [Harvey, chapter IX and conclusion](https://bertie.ccsu.edu/naturesci/evolution/unit10background/HarveyNine.html).

**Bounded recommendation:** retain these chapters and their ingredients. Put the indispensable observation/calculation on the result tile, and fuller source context in a genuine reading. Examples of the needed *kind* of content: the one-piece adult jaw correction; the actual throughput and stock; venous return direction with the unseen connection marked; the two computed longitudes and drift-adjusted difference. No new artwork or explanatory toasts are required. Do not make the player manufacture another “qualified” document to receive the facts.

### 3. High — counted continuity sometimes substitutes an old document for a transferable idea

**Category:** semantic continuity problem, not missing inventory or fabricated historical lineage.

The six chapters have 22 declared earlier-created inputs in total, and those inputs really occur in recipes. Several reuses are excellent. But graph participation is not enough:

- `make-anatomical-commentary`: `printed-anatomy + critical-text`. The revised `critical-text` is now specifically **“C restored at the intersection; the D reading is recorded.”** Its reading explains the particular Euclid copying error. The new anatomy result does not show which inherited wording is retained, changed or recorded by analogy. The operation presently resembles attaching an old homework answer to a new book.
- `make-directed-vessels`: `anatomical-commentary + valve-record`. The earlier object contains only the jaw correction. Yet the recipe calls it “the anatomical plate” as though it provides vascular structure. Vesalius-to-Harvey as a historical anatomical tradition is sound; this particular jaw plate is not a vessel map. The connection registry's broader tradition claim does not fill in the object's absent content.
- `make-branching-recollection`: `variant-table + conflicting-memories`. The inherited label is specifically **“One copy says C; the other leaves C undefined.”** Collation is a genuinely promising analogy for incompatible memory records, but the new object does not expose the matching operation—two witnesses kept separately with their exact variants—beyond its abstract name.
- `make-next-question`: `anomalous-growth + probability-table`. The earlier probability work concerns a fair interrupted game and its weighted outcomes. The later selection-policy claim supplies no possible outcomes, weights or comparison that makes that earlier work necessary. It currently functions as a generic “probability acquired” key.

The `counterexample` transfer is **less problematic**: its new reading explicitly states the reusable rule about a genuine contrary case defeating an unrestricted universal claim. Do not discard its concrete lamp identity merely to restore an abstract token.

**Bounded recommendation:** make the *application* concrete at the destination rather than replacing vivid early objects with generic skill badges. Let the anatomical edition actually preserve old and corrected claims; do not pretend the jaw plate already contains vessels. Let the two memory voices visibly occupy the earlier collation structure. Let the observatory enumerate the outcomes of a candidate question. Remove a required join if it adds no new application; another real earlier creation can satisfy continuity without an arbitrary extra gate.

### 4. High — the observatory never identifies the test or the next question it supposedly learns to ask

**Category:** fictional causal completeness; not a real-world feasibility objection.

The premise and main assembly are worth preserving: optics, Boolean cases, microbial mechanism and probability return together, and the same instrument evolves. However:

- `growth-rivals` says illumination versus nutrients explains the colony's light pattern “chiefly,” without specifying either prediction.
- `trial-menu` says four light × nutrient comparisons, but `experiment-lattice` never displays their cases.
- `distinguishing-trial` never says which case is chosen or what each rival predicts.
- `surprising-bloom` has an actual event, **“Bloom in the dark,”** but a nutrient-centered rival might predict that. There is no visible adopted model or nutrient condition making this event a falsification rather than confirmation of one of the existing rivals.
- `next-question` never states a question. `make-learning-observatory` announces that the apparatus now chooses a falsifiable next test, but the player cannot identify that test.

The source boundary is good: NASA/JPL describes AEGIS selecting targets against scientists' parameters, not an existing general self-questioning scientist. The candidate labels the extension fictional; no further apology is needed. [NASA/JPL AEGIS](https://ai.jpl.nasa.gov/public/projects/aegis/).

**Bounded recommendation:** author one explicit four-case prediction record, the chosen row, the unexpected observation under named conditions, and the next chosen test. Reuse existing tokens/joins wherever possible. Give the last object a tangible intellectual action, not just “better question.” A living-light mystery can be more imaginative, not less, when its surprise has a precise shape.

### 5. Medium-high — the memory garden's second half largely renames an ability already achieved

**Category:** semantic payoff / mandatory abstract closure.

The first half has a strong capability progression: photograph → revisitable courtyard, variants → two paths, communication → shared spatial memory. `Gate open / gate barred` is a concrete conflict worth keeping.

After `memory-garden`, `make-reciprocal-memory` adds the meaningful possibility of exchanging viewpoints. But `make-collective-self-model` adds a shared “we”; `make-plural-identity` adds `open-atlas` to recognize disagreements; `make-choral-memory` then describes multiple distinguishable voices and competing paths—substantially what `layered-memory` and `memory-garden` already promised. No new first-person experience, consequence of exchange, or collective action is authored. This is the clearest mandatory abstract-paperwork tail in the assigned futures.

The philosophical boundary is defensible: copying narrative, group identity and personal persistence are distinct questions, and the SEP source does not settle them. That boundary should permit a vivid fiction, not require three certification steps. [SEP, Personal Identity, §1–2](https://plato.stanford.edu/entries/identity-personal/).

**Bounded recommendation:** preserve the unresolved gate conflict and viewpoint exchange. Give the two contributors one particular experience each and make the post-exchange result do something the first garden could not. Either merge the naming/recognition steps into that result, or give them a concrete consequence. Do not require uploading, consciousness or a single official historical verdict to make the future ambitious.

### 6. Medium-high — the city has a genuine synthesis, but its adaptation is only asserted

**Category:** semantic outcome gap; the fun/scale of the ending remains untested.

This is the best structural convergence: `learning-observatory` informs resource control, `choral-memory` makes unequal effects experiential, microbes supply a productive living surface, and commons work supplies revisable allocation. `Food here, shade next door` is a real conflict rather than an abstract ethics token.

Yet `day-night-record` contains no sequence to inspect; `adaptive-cycle` names no chosen observation; `seasonal-city-rule` names no production/shade change; `symbiont-change` says only that a partner changes behavior. `make-evolving-city` takes that change and immediately awards the final city without a defined changed output or response. Governance belongs here because it changes the infrastructure's operation, but the actual operation never changes in the authored evidence.

**Bounded recommendation:** supply one day/night resource conflict, one concrete seasonal adjustment involving the shaded district, and one changed-partner event with an observable response. Keep the final living installation and its components. Avoid either removing governance as “paperwork” or substituting a new compliance checklist for the ecological/civic consequence.

## Strengths to preserve

1. **Chronological spine and nonadjacent returns.** In the reviewed span, Vesalius 1543 precedes Harvey 1628; longitude follows the mathematical/astronomical work; futures are explicitly undated fiction. Nothing here requires reordering the campaign.
2. **Art/printing/anatomy is a legitimate braid.** `illustration-method` is an explicitly generalizable construction/viewpoint practice; the printing connection is historically substantive. NLM confirms the *Fabrica* both drew on and corrected Galen and that its artistic renderings were central. Do not replace it with a simplistic “observation defeats every old book” story. [NLM Vesalius](https://www.nlm.nih.gov/exhibition/historicalanatomies/vesalius_bio.html).
3. **Harvey's quantity-versus-anatomy convergence.** It is a much better concept than adding “blood + heart.” The inherited arithmetic can do actual work when the result is visible. The supplied OU exhibit correctly emphasizes multiple kinds of argument; its particular displayed English edition is **1653**, whereas the chapter's **1628** is the original-work setting, not that edition's date. No present false identification was found. [OU Harvey exhibit](https://galileo.ou.edu/exhibits/anatomical-exercises-dr-william-harvey.html).
4. **Two navigation methods, not Harrison as solitary conqueror.** The coexistence is supported, and the 1760–1770 setting contains the almanac for 1767. Keep the sea-trial context. [Royal Museums Greenwich](https://www.rmg.co.uk/stories/space-astronomy/history-royal-observatory?page=1).
5. **The future arc has a purpose beyond extrapolated gadgets.** It asks how instruments choose questions, how shared experience changes identity, and how living infrastructure reshapes collective life. Those are credible SMAC-like intellectual ambitions. The audit does not recommend cutting them down to currently existing products.
6. **Source relationships are mostly honestly bounded.** The registry distinguishes pedagogical analogy from transmission and future synthesis. The problem is often that those boundaries and the historical substance live only in metadata, not that the author has falsely claimed direct transmission.

## Smallest useful validation after changes

- Recheck each navigation method independently; require the local/reference-time distinction before either longitude result.
- Ask a source-blind observer to state the actual jaw correction, the circulation calculation and route, and the two navigation answers using only visible labels/readings. Failure to name them is stronger evidence than success at clicking the route.
- In the futures, ask what experiment was selected and why, what changed after exchanging viewpoints, and what the city did differently after the ecological change. Do not supply these answers in the test prompt.
- Measure whether the observer anticipates the new combinations and wishes to continue; **do not call this audit proof of fun**. Preserve stopped or negative sessions.

## Source-check limitations

The Becker *Fabrica* production page timed out twice, and the Ostrom Nobel lecture endpoint returned 403. I did not independently re-verify those pages or rely on their inaccessible details for a new finding. The specific woodblock transport claim is therefore not newly endorsed here. Verified sources above support the narrower claims used in this report. No assertion that all source-registry entries were re-audited is intended.
