# Atlas chapters 5–26: player-visible intellectual payoff

**Read-only audit, 2026-10-28. No UI/browser playtest, implementation, publication, or campaign edits.**

## Finding

The chapter-4 failure recurs. Several chapters award a label for an argument, model, comparison, or result without exposing the argument, model, comparison, or result. The strongest three revision priorities are **5: optics, 14: motion, and 22: natural selection**. These matter especially to the requested history of connected ideas: geometry becomes an account of light, terrestrial and celestial motions become one problem, and population pressure plus geological time become a mechanism of biological change.

This is a **source-supported content/design weakness**, not evidence of a runtime failure and not a measured finding that these chapters are unfun. The fresh player's voluntary stop in chapter 4 is supplied evidence about chapter 4 only. No later chapter was played in this audit.

Crucially, **turning on generic descriptions would not repair the three cases**. Descriptions often promise a record but never supply it: chapter 5 has unspecified source positions; chapter 14 has no timed measurements, force calculation, or orbit values; chapter 22 has no named variation or population frequencies. The player must supply the missing intellectual content, even if the hidden prose were exposed.

Conversely, **no-reading is not automatically a failure**. Familiar making can be satisfying, and concrete labels can expose the payoff efficiently. The printing chain's A/B swap, chance chapter's 3:1 stake division, induction chapter's change/steady/reverse distinction, and water chapter's A8/B1 rates are materially stronger than generic “Checked result” labels. Do not make every intermediate require reading or strategy, and do not add combinations to protect a count.

## Scope and evidence contract

Candidate: `atlas-connected-questions-v4-methods-and-agreement-research`, found in `scenario.json` through the supplied frozen directory's `manifest.json`.

Source root: `/workspace/shared/combination-campaign-research-20261028/atlas/revision-v4-methods-and-agreement/`.

- Scenario SHA-256: `cfe511e808c7f01801177ae47bd50b2071a6cebd9228d929c39f172ab1ded1bb`.
- `scenario.json`, `chapters.json`, and frozen `ui/campaign-main.ts` all match the manifest; details in `manifest-source-validation.json`.
- Audited all 22 chapters numbered 5–26. Excluded chapters 1–4 and 27–29 from revision recommendations.
- Counted **item labels, motivation/objective text, and explicit `Item.reading`** as available intellectual content. Generic item descriptions and recipe prose were not counted as player knowledge.
- Frozen UI source supports this distinction: `campaign-main.ts:86` renders labels; `:87–88` gates the reader on `reading` and displays its text/attribution; `:91` displays motivation and goals. This is source inspection, not a claim about browser rendering or usability.
- `chapter-visible-surface.json` preserves exact visible item payloads, motivations, objectives, and source recipe-edge IDs for every audited chapter. Recipe edges are audit evidence, not a claim that recipe descriptions are shown to the player.

## Three concrete revision priorities

### 1. Chapter 5, `cairo`: make crossing light paths an observed result

**Actual promise.** Motivation: “The bright doorway appears upside down inside the dark room. Make an image and a ray account that can survive moving the lamp.” Goals: `camera-obscura` / “Form the courtyard image”; `optical-model` / “Explain the image”; `optical-question` / “Keep the remaining question open.”

**Actual surface.** All six supplies and all nine results lack `reading`. `source-positions` is only “Two lamp positions.” The explanatory route is:

- `make-ray-diagram`: `lamp + arabic-proof → ray-diagram` (“Ray diagram”).
- `make-crossed-rays`: `ray-diagram + camera-obscura → crossed-rays` (“Crossed rays”).
- `make-predicted-spots`: `source-positions + ray-diagram → predicted-spots` (“Predicted spots”).
- `make-comparison-record`: `predicted-spots + lamp → comparison-record` (“Comparison record”).
- `make-optical-model`: `comparison-record + crossed-rays → optical-model` (“Optical model”).
- `make-optical-question`: `optical-model + underdetermined-case → optical-question` (“Optical question”).

Making a recognizable camera obscura is a legitimate object-making payoff. The later explanation/test is different: the player never sees either lamp position, a predicted spot, an observation, or the remaining question. The hidden `comparison-record.description` says observations are recorded, but gives none.

**Concrete revision case: two lamps through one aperture; do crossing paths lose their identity?** Ibn al-Haytham's actual case uses multiple lamps, an aperture, and a dark receiving surface. Screening one lamp removes its corresponding patch while other patches remain; he uses this against the idea that crossing light contributions become an inseparable mixture. See *Optics* I.6, §§85–87, Sabra translation, printed pp. 90–91 ([Warburg primary-text scan, PDF page 50](https://resources.warburg.sas.ac.uk/pdf/ffh360b2205460.pdf#page=50)).

Use a compact **authored two-lamp adaptation**, not a claimed historical notebook:

1. Specify H above and L below the aperture, with the receiving screen on the opposite side. `ray-diagram` or `crossed-rays` must expose **H → lower patch; L → upper patch**, in a label or explicit reading.
2. Make `predicted-spots` an actual prediction: screening H should remove the lower patch only. `comparison-record` must retain the supplied observed pattern; optionally also the complementary L observation in the same record.
3. Make `optical-model` preserve that result: crossing at one opening did not erase source-to-patch correspondence. `optical-question` must name a bounded remaining issue: this arrangement alone does not explain how an eye senses light.

The first three assembly steps can remain comfortable, obvious making. The revision is the **case and its terminal result**, not a demand for extra decision mechanics, a physics simulation, or extra combinations. Adapt the existing comparison ingredients rather than silently representing a multi-lamp experiment with an unchanged single-position dossier.

**Connection earned.** Earlier geometric reasoning now predicts a visible relation; earlier underdetermination keeps a successful light-path test from becoming a complete theory of sight. That result can later be reused in copied diagrams, perspective, telescopes, and photography. Do not claim this one demonstration establishes all of intromission, a modern retinal theory, or an exclusive inventor.

**Source-supported weakness:** no visible prediction or result. **Untested hypothesis:** identifying which patch disappears will make this chapter feel like discovering something rather than receiving an “Optical model” badge.

### 2. Chapter 14, `motion`: let the Moon and a falling body yield the same quantitative account

**Actual promise.** Motivation asks for one mathematical account of a planetary orbit and a falling body without claiming gravity's ultimate cause. The sole goal is `mathematical-treatise` / “Unite the motion accounts.”

**Actual surface.** All six supplies and ten results lack `reading`. “Timed positions,” “Falling-body record,” “Orbit distances,” and “Candidate force rule” specify no times, distances, fall, or rule. The decisive chain is:

- `make-orbit-model`: `orbital-geometry + force-rule → orbit-model` (“Orbit model”).
- `make-cross-orbit-check`: `orbit-model + orbit-distances → cross-orbit-check` (“Cross-orbit check”).
- `make-terrestrial-account`: `fall-record + force-comparison → terrestrial-account` (“Terrestrial account”).
- `make-shared-motion-account`: `terrestrial-account + cross-orbit-check → shared-motion-account` (“Shared motion account”).
- `make-scope-of-law`: `shared-motion-account + bounded-sky-claim → scope-of-law` (“Scope of law”).
- `make-mathematical-treatise`: `scope-of-law + checked-edition → mathematical-treatise` (“Mathematical treatise”).

The hidden `force-rule.description` at least names inverse-square, but players cannot see that. The hidden `orbit-model.description` says orbital behavior is calculated, without presenting any calculation. “Mathematical treatise” is not a recognizable physical invention whose function supplies the missing meaning.

**Concrete revision case: Newton's Moon test, with the law/cause dispute left open.** Newton's Book III, Proposition IV compares lunar departure from straight motion with terrestrial gravity after scaling by squared distance; the preceding propositions connect orbital behavior to a central inverse-square relation ([primary *Principia* scan, printed pp. 391–393, PDF pp. 9–11](https://sites.pitt.edu/~jdnorton/teaching/2682_confirmation/2010/Principia_fragments/Principia_Bk3_to_Prop_15.pdf#page=9)). His General Scholium also distinguishes an effective gravitational account from an established cause, and explicitly disputes vortex explanations ([primary text](https://www.newtonproject.ox.ac.uk/view/texts/normalized/NATP00056)).

A bounded authored reconstruction can avoid asking the player to derive the *Principia*:

1. Give the mathematical relation **acceleration at distance r is proportional to 1/r²** visibly, and give an independently supplied lunar-distance record of about 60 Earth radii.
2. Supply a rounded modern-unit teaching fall of **4.90 m in 1 s near Earth's surface**, and a separate orbit-derived inward departure from its tangent of **about 1.36 mm in 1 s** at the lunar distance. Clearly mark circular/short-time and low-resistance idealizations; these are not Newton's verbatim measurements.
3. Make the output retain **4.90 m ÷ 60² ≈ 0.00136 m**, matching the lunar quantity. A distance-independent continuation of the surface acceleration would miss this comparison. If retaining “Cross-orbit check,” it also needs its actual additional orbit data/result; otherwise narrow that item/goal rather than pretending one check is several.
4. The final account should say what was unified, and `scope-of-law` should preserve the unresolved question: a common quantitative relation does not itself show the physical cause of attraction. Do not fabricate a decisive numerical “vortex model” without actually specifying one.

**Connection earned.** Astronomical records and geometry are now used to infer a quantity comparable with terrestrial motion; algebra does scaling work. This makes the transition from records of recurrence/positions to a shared physical law inspectable. The mechanical-cause controversy becomes a live boundary of a demonstrated achievement rather than a generic caveat.

**Source-supported weakness:** no exposed law, calculation, or evidence for unification. **Untested hypothesis:** one surprising quantitative agreement will be more rewarding than ten abstract motion-result labels. It need not introduce a difficult calculation input or extra recipe count.

### 3. Chapter 22, `species`: show a population changing, not the name of a mechanism

**Actual promise.** Motivation says variation, geological time, and population pressure suggest a mechanism, without making survival progress or a moral command. Goal: `descent-book` / “Build the argument across generations.”

**Actual surface.** `lyell-volume.reading` conveys that influence need not mean agreement; `wallace-essay.reading` conveys independent contribution. Those are worthwhile visible historical connections. However, the four biological supplies are only “Variation specimens,” “Inheritance observations,” “Offspring and survival record,” and “Generation series”; all ten results have no `reading`.

- `make-heritable-variation`: `documented-variation + inheritance-record → heritable-variation` (“Heritable variation dossier”).
- `make-struggle-condition`: `population-pamphlet + offspring-record → struggle-condition` (“Population constraint”).
- `make-differential-reproduction`: `heritable-variation + struggle-condition → differential-reproduction` (“Differential reproduction”).
- `make-population-change`: `differential-reproduction + generation-series → population-change` (“Population change”).
- `make-selection-account`: `population-change + extended-geological-time → selection-account` (“Selection account”).
- `make-testable-evolution-case`: `parallel-contributions + bounded-water-claim → testable-evolution-case` (“Bounded evolutionary argument”).

No visible trait is inherited, no organism leaves a stated number of descendants, and no population actually changes in the exposed record. Even the hidden `generation-series.description` promises an authored changing-frequency example but supplies none. The source graph contains the desired intellectual connections; the player-facing mechanism does not.

**Concrete revision case: a predator population after prey changes, and the dispute over whether varieties can depart from an original type.** Darwin uses an explicitly imagined wolf/prey example in *Origin*, chapter IV; its selection depends on the changed circumstances and retaining other needed abilities ([1859 primary text, pp. 90–91](https://darwin-online.org.uk/converted/published/1859_Origin_F373/1859_Origin_F373.html)). Wallace's 1858 essay directly contests the inference from domestic reversion to permanently bounded natural varieties ([primary text in the 1858 joint publication](https://darwin-online.org.uk/converted/published/1858_species_F350.html)).

Use a small **authored, stipulated inheritance dossier**, not pseudo-historical animal data or modern genetics:

1. Name the variation and condition. For example, faster/slower members of one predator population face a season in which fleet prey dominates; both groups retain the other abilities required to live.
2. Supply a parental cohort of **10 faster and 10 slower** adults; the fictional record assigns the next 20 breeding recruits to **15 faster and 5 slower** descendants. Give the actual parent/offspring association and recruitment observations, explicitly as stipulated teaching evidence. Do not quietly derive inheritance merely from appearance or assume these counts from the theory.
3. `differential-reproduction` should retain unequal contribution to the next breeding generation; `population-change` should expose **faster: 10/20 = 50% → 15/20 = 75%**. Individuals did not need to transform during their own lifetime in this case.
4. `selection-account` must identify the conjunction: existing differences + transmission + unequal reproduction under these conditions. More offspring alone is insufficient, and geological time alone does not select anything. A short record demonstrates a mechanism and directional change, not proof of all species' histories.
5. Let Wallace's ingredient expose an actual contrasting claim about reversion/stability rather than functioning only as a biographical credit token. Preserve the existing explicit acknowledgment of independent reasoning. Keep the final inference bounded; do not falsely summarize all historical alternatives as “animals tried harder.”

**Connection earned.** Population pressure changes domain, geological time permits accumulation rather than causing it, and the water investigation's evidence discipline limits what this particular dossier establishes. The player can say what those earlier ideas contributed. The case is not a prescription for human institutions.

**Source-supported weakness:** the central biological mechanism has no inspectable example. **Untested hypothesis:** a visible 50% → 75% change will make the cross-disciplinary combination feel earned. Test whether the record is interesting, not merely whether a player can recite the mechanism.

## Whole-scope triage: do not mistake coverage for a reading quota

`R` below counts explicit readings on chapter-created results only. It is diagnostic metadata, not a score. “Thin” does not mean proved unfun.

| Ch. | Subject | R | Source-supported visible payoff / limit |
|---|---|---:|---|
| 5 | Optics | 0/9 | Camera obscura is recognizable making; subsequent prediction, observation, explanation and open question are unspecified. **Priority 1.** |
| 6 | Latin transmission | 1/9 | Merchant manual exposes 18 ÷ 3 = 6 and 5 × 6 = 30; copied-ray objection is concrete. Corrected optical output is less explicit, but the defect is visible. |
| 7 | Perspective | 0/8 | Courtyard painting and fixed/second viewpoint give a recognizable project. No actual grid or changed-view comparison is exposed; conceptual explanation remains thin. Not automatically a failed making chapter. |
| 8 | Printing | 0/9 | A/B swap reading exposes the actual replicated error. Set/type/ink/press/proof/quire are intelligible making. No need to inflate every step with prose. |
| 9 | Anatomy | 9/9 | Strong: old two-bone claim, adult continuous mandible, specimen scope, and corrected printed result remain inspectable. |
| 10 | Astronomy | 1/10 | Venus reading identifies a bounded model conflict but supplies no phase sequence. Lunar-shadow explanation has no observation or geometry. The sky-table result teaches a reusable method, not actual checked positions. Mixed, not a demonstrated full case. |
| 11 | Circulation | 7/7 | Strong: 9 L throughput versus 6 L one-way availability, valve direction, returning model and unseen link are explicit. |
| 12 | Chance | 0/9 | Stronger than its reading count: 2–1 score, AA/AB/BA/BB and A3/B1 expose a checkable split. Backward method/reconciliation and bias condition lack worked result payloads. |
| 13 | Population tables | 0/8 | Weekly-bills reading warns about categories but gives no bills/counts; “Population rates” and “Demographic record” never expose a comparison. Thin. |
| 14 | Motion | 0/10 | No visible numbers, actual force rule, or shared calculation. **Priority 2.** |
| 15 | Longitude | 14/14 | Strong: two calculation chains, correction, separate error bands, shared local-noon dependency, and hazard consequence remain inspectable. |
| 16 | Deep time | 0/8 | Tilted lower beds / overlying beds / truncation suggest a real recognizable puzzle. No explicit event sequence or reason for sequence appears in the outputs; the result is only “Event sequence.” Partial, not empty. |
| 17 | Population pressure | 0/8 | Doubling from 100 versus 100/200/300/400 makes the schematic contrast recoverable. Policy reading identifies a logical gap, but no actual policy or data comparison is supplied. |
| 18 | Fields/induction | 0/9 | Switch-change pulse, steady no-pulse, reverse −pulse convey the essential observation without long result readings. Field-map side remains abstract. |
| 19 | Photography | 0/8 | Sensitive sheet → exposure → stable negative → positive print is recognizable making. Exposure reading exposes limits; archive's actual image/caption comparison is unspecified. |
| 20 | Logic | 0/9 | OR, AND, NOT labels and `(A OR B) AND NOT C` reading expose genuine content. Final “Checked logical specification” does not display all eight A/B/C cases (the opening four-case language concerns the earlier two-variable rule). Thin terminal verification, not absence of all logic. |
| 21 | Water | 0/9 | Stronger than its reading count: A8/B3 with homes A100/B300 becomes A8/B1 per 100. Alternatives are explicit. Final causal/bounded claim remains generic, but a meaningful contrast is visible. |
| 22 | Selection | 0/10 | Lyell/Wallace connections are explicit, but no organism/trait/count/change exemplifies selection. **Priority 3.** |
| 23 | Fermentation | 0/9 | Cell-free extract reading exposes an actual mechanism-changing result. Earlier good/spoiled comparison remains generic; final mechanism only named. The main challenge is nevertheless visible. |
| 24 | Switching | 0/9 | Relay/series/parallel/NOT are recognizable building blocks. “Fault case,” “Duplicated layout” and “Equivalent circuit” expose neither counterexample nor equivalence/savings. Serious terminal gap, not selected over the three foundational history-of-ideas repairs. |
| 25 | Communication | 0/11 | Specific message/code/18 vs 20 bits/54 transmitted bits demonstrate cost tradeoffs. No actual received triplets or decoded string appears. Compression payoff visible; recovery proof asserted. |
| 26 | Commons | 1/9 | Downstream runs dry and the readable revisability principle communicate a concern. No users' needs, available water, allocation, neighbor difference, or revised rule can be inspected. “Agreement” is procedural, not a worked locally viable allocation. This remains a substantive thin-case risk despite the final reading. |

These secondary observations are **not additional revision proposals**. They identify what is and is not currently exposed, so a later author can prioritize with user feedback rather than turn the entire campaign into a textbook.

## What would count as improvement, and what remains untested

A content-level check can be done without a browser: project only labels, motivation/objectives and `reading`; for each revised chapter, ask whether an independent reader can state **the particular observation/calculation, the resulting claim, and one relevant limit**, without access to descriptions or recipes. A claim should not be declared supported just because its output ID exists or an author-route completes.

This check would establish visible intelligibility, **not fun, voluntary continuation, puzzle difficulty, layout fit, reader discoverability, or improved retention**. Those remain untested. In a future logical play pass, let a fresh player choose whether to continue; do not guide them through a forced finish and call that positive evidence.

## Access and completion status

- Read-only chapter audit and source-hash verification: **complete**.
- Browser/UI testing, gameplay mutation, implementation, publication: **not performed, outside this task**.
- Primary-source verification: optics lamp test, Newton Moon comparison/law–cause distinction, Darwin predator example and Wallace stability controversy checked.
- Temporary source-access limits were resolved: web opening the Warburg PDF returned content-too-large; its public PDF was read through the local permitted download/text-extraction route. A Brill optics chapter and ETH page returned HTTP 403, so neither was relied on. **No outstanding blocker.**
- All frozen source data preserved unchanged. Review outputs are separate files under `atlas-visible-review-20261028`.
