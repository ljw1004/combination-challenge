# Independent authenticity re-review: Ideas v4

**Decision: the six earlier factual/provenance findings and Harvey dimensional error are resolved. The future rewrite has substantive stakes. Fix one localized compression-example mismatch before release; make one small Snow-map wording correction. No wholesale rewrite or extra historical citations for original fiction are required.**

Reviewed `ideas/revision-v4/scenario.json`, README, source-audit and content-audit. Independently computed hash matches `bdfb71b7a945295f1a2de948fc7f55e78993097c75e81400f12a3f0564b90afd`. No scenario edits, no pilot edits, no GitHub writes. Review concerns content, not browser visibility, human enjoyment, or replay certification.

## Independently checked results

- 202 recipes, 202 distinct nonempty discovery descriptions, 394 items with nonempty descriptions, zero instances of the old placeholder phrase.
- 35 unsourced recipes are exactly the opening teaching exercises (10), argument exercises (7), inference exercises (10) and original future-memory fiction (8). That is **not** an authenticity failure: these do not purport to be recovered historical episodes.
- The author reports 193 required combinations and nine optional; this review did not independently replay the route. Reaching 200 by padding is not warranted.

## Prior findings: closed

| Prior finding | Independent inspection | Status |
|---|---|---|
| Velocity integral called distance | motion-07/08 use `displacement-sum`; prose explicitly distinguishes signed velocity from absolute velocity. +6−4=2 m displacement; 6+4=10 m distance. | Resolved |
| Modern line numbers in Alexandria | texts-02 uses `passage-lemma`; texts-03/04 explicitly label modern tentative curatorial reconstruction, including contamination rather than a guaranteed tree. | Resolved |
| Harvey credited with microscopic capillaries | Item `capillary-evidence` and circulation-09/10 cite `capillaries`; discovery names Malpighi and 1661, distinguishes Harvey. | Resolved |
| Lunar comparison against unrelated noon | longitude-09 uses `local-astronomical-time` at the same observation; longitude-08 explicitly assumes corrected angle. Clock example also synchronizes noon and reference reading. | Resolved |
| Fossil correlation attributed to Hutton | rocks-08/09 cite Smith and distinguish later mapping from Hutton's 1788 visit; corresponding narrative is explicit. | Resolved |
| Bayesian update attributed to 1654 letters | chance-09/10 cite modern NIST sources and visibly distinguish this extension. | Resolved |
| Heartbeat count multiplied by time twice | `heart-rate` is now beats/minute. 60×50=3000 mL/min=3 L/min; ×10 min=30 L. Comparison with illustrative standing 5 L is clearly teaching, not Harvey's numbers. | Resolved |

Arithmetic also checks: average velocity 6/3=2 m/s; average acceleration (8−2)/3=2 m/s²; x+5=12 gives x=7; x²+6x+9=(x+3)²; fair-match leader wins three of four equally likely completed sequences, hence 3:1 stake; prior odds 1:4 multiplied by LR 3 yields posterior odds 3:4, **probability 3/7**, not 3/4; reference clock 14:00 at idealized local noon means 30° west. No arithmetic blocker found.

## Exact source support and limits

- [OpenStax §5.4, net-change discussion](https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem): velocity integral gives displacement; absolute velocity gives total distance. Verified in the previous independent pass; revised wording now conforms.
- [Schironi, printed pp.55–56](https://sites.lsa.umich.edu/schironi/wp-content/uploads/sites/259/2024/10/43_Textual-Scholarship-in-Alexandria-.pdf): ancient commentary identifies passages through lemmata without modern line/paragraph numeration. Previously inspected directly; revised input and modern-reconstruction distinction conform.
- [APS historical research](https://journals.physiology.org/doi/10.1152/ajpheart.00704.2007): indexed passage describes Malpighi's later microscopic work and 1661 letter. Prior full fetch was 403; do not inflate this to full-article inspection.
- [RMG Harrison collection account](https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem), sections on trials, rival methods and reproducibility; [Smithsonian lunar-time explanation](https://timeandnavigation.si.edu/multimedia-asset/using-lunar-distances-to-find-longitude), indexed text comparing reference and local time. Those bounded claims were checked in the earlier pass; revised simultaneous-readings logic is correct. Idealized solar-time convention is acceptable, not a complete navigation manual.
- [Geological Society Smith map collection](https://www.geolsoc.org.uk/about-us/history/visiting-the-william-smith-map/a-delineation-of-the-strata-of-england-and-wales-with-part-of-scotland/): characteristic fossils and regular sequence support regional correlation, with the 1815 map. Previously verified; attribution repair conforms.
- **Fresh direct check:** [NIST-hosted Lund/Iyer workshop, PDF p.7](https://www.nist.gov/system/files/documents/2020/06/10/05_lund_nist_lr_workshop.pdf), explicitly gives posterior odds = likelihood ratio × prior odds. Page 2 says the speakers' views are not necessarily NIST's; the mathematical identity is the relevant support, not institutional endorsement of every forensic application. [NIST likelihood-ratio glossary](https://www.nist.gov/glossary-term/43066), definition, supports evidence likelihood under alternative hypotheses.
- **Fresh direct check:** [Gysel historical-research abstract, PMID 8209579](https://pubmed.ncbi.nlm.nih.gov/8209579/), abstract opening, explicitly contrasts two mandibular bones in the *Tabulae* with unity in the *Fabrica*. It supports the bounded jaw contrast and Vesalius changing his own account. This is an abstract check, not a new reading of Vesalius's whole original text. No need to import every other claim in that abstract.
- **Fresh indexed check:** [Library of Congress printing collection article](https://blogs.loc.gov/international-collections/2021/06/the-history-of-printing-in-asia-according-to-library-of-congress-asian-collections-part-1/), discussion of block and movable-type technologies and later woodblock examples, supports coexistence. Direct open returned 403, indexed contents were available. It does **not** establish the fictional customer orders or a universal adoption explanation. V4 correctly avoids treating it that way; do not import the source's broad numerical character-count/transfer generalizations into the game.
- **Fresh direct check:** [AAS petition, March 9, 2026, title and opening](https://aas.org/sites/default/files/2026-03/American%20Astronomical%20Society%20-%20Reflect%20Orbital%20Petition%20to%20Deny.pdf), is indeed a stakeholder petition against an orbital-reflector application. It is not evidence that fictional crop gains or mirror performance are feasible. V4's source note and conditional fiction make this boundary explicit. No scientific feasibility certificate is implied.

## Remaining release corrections

### 1. Localized content blocker: `signals-08/09`, `efficient-code`, `alphabet` / `codebook`

The items explicitly define a two-symbol binary source (0 and 1), then the discovery claims that more frequent symbols get shorter decodable codewords and reduce expected message length. For symbol-by-symbol lossless binary coding of two symbols with nonzero probabilities, both codewords need at least one bit. The starting 0/1 code already achieves that minimum. Merely assigning one a longer code cannot produce the stated gain.

**Smallest fix:** explicitly encode **blocks** of source bits with a supplied nonuniform distribution, or introduce a three-or-more-symbol source for compression. Do not change the successful three-bit repetition/error-control example. Example for illustration, not prescribed content: pair probabilities 0.7, 0.1, 0.1, 0.1 and prefix words 0, 10, 110, 111 give expected length 1.5 bits per pair versus 2 uncompressed. This is direct arithmetic and a checkable prefix code, not a historical attribution.

The old Shannon URL returned 502 on this re-review. The defect does not depend on inaccessible authority: it follows from the explicit alphabet and elementary minimum codeword length. A replacement worked example is enough; no added recipe quota needed.

### 2. Small historical copy correction: `water-01` and `case-map`

Both say “dots” locate deaths. If intended as Snow's historical map, use **bars** (or neutral “marks”). [UCLA map-history discussion, opening and later-redrawing paragraph](https://epi-snow.ph.ucla.edu/Stream2_BSPoutbreak_f.html) directly distinguishes Snow's bars from later dot redrawings. Alternatively label it a modern teaching redrawing. This is a narrow wording issue, not a rejection of the chapter's careful causal reasoning.

## Nonblocking caveats / next polish

- Future-memory begins with two former residents' incompatible recollections, then future-memory-04 calls the withdrawing person “the only private witness.” Specify “the only private witness to the decisive disputed act/detail,” or distinguish a witness from another resident's indirect account. This is a local fictional continuity clarification, not a citation deficit.
- Many explanations still emphasize limits. That is intellectually responsible, but a few concrete observations/images would carry the reward more economically than repeated disclaimers. This is a presentation judgment, **not** a factual block or requirement for branching play.
- The source registry is still collection-level in some places. Do not advertise every edge as independently historically verified. The report's limited claim—authored descriptions with bounded sourcing and explicit exercises—is supportable.
- The remaining European weighting is not corrected simply by a printing chapter, but the printing comparison is substantive rather than a token name. Dropping School by the Well does not prohibit other well-introduced non-Western history. No demand to restore that prototype.

## Future stakes and controversy: substantive pass

**Memory:** a new ability (walking a reconstruction of a lost neighborhood) changes who can make restitution claims; vividness can overwhelm evidential weakness; testimony withdrawal leaves a gap rather than recovering truth by software; descendants can contest erasure; unequal resources persist. These are concrete human consequences and power conflicts. The final open case is an honest payoff, not an administrative guarantee of justice. No scholarly citation is required for this labeled original fiction.

**Orbital light:** the same intervention benefits fields conditionally while consuming neighboring dark observing time and raising habitat concerns. Lower light sacrifices benefits; an off switch cannot erase prior consequences. The game now names both beneficiaries and externalized costs. This is materially different from “proposal + oversight = better proposal.” Comfortable linear progress through a demonstration of tradeoffs is acceptable; branching policy choice is not required to make the ideas meaningful.

**Printing:** the unchanged and revised orders supply distinguishable work and local reasons for coexisting methods. The case does not claim a recovered historical controversy or one universal cause of East Asian technology adoption. It meets the intellectual target better than the former nameless “rival explanation” sequence.

**Anatomy, circulation, rocks, longitude:** all now have recognizable evidence/disagreement rather than only Theory + Observation labels. The jaw correction, blood-throughput argument, missing-rock event order, and discrepant navigation fixes make distinct reasoning visible. This is a content improvement, not proof that the discoveries are enjoyable or that their text is visible at the right UI moment.

## Stopping status

Independent content re-review complete. No full-campaign factual catastrophe found; earlier prioritized findings closed. Two narrowly actionable release corrections above, with one optional fiction-continuity polish. No engine/browser/fun test or universal certification claimed. Frozen pilot untouched.
