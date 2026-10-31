# Ideas: Atlas of Questions — research candidate, not a finished game

## What is useful now

- **A 201-recipe candidate bank across 22 local stages**, with an exact **192-combination prerequisite route** through all current goals. Nine recipes are optional. This does **not yet meet a 200–300-combination required-play target**, and count alone does not establish quality or fun.
- A separate **31-recipe Optics → Perspective → Chance pilot** is ready for source-blind logical testing. It emphasizes recognizable tools, an actual painting, and the interrupted-game settlement problem. It is not yet a browser playtest.
- Full author-generated replay passes the shared engine: 192 creations, two catalyst placements, 22 advances, final completion true. This is solvability evidence, **not** independent discovery or human fun evidence.
- A genuine clutter defect in the content policy was found: carrying inputs for *all* unfinished recipes hauled abandoned optional work into every later chapter. First, explicit future-chapter carry reduced the author route from43 to30; the latest current-scene-only rule reduces it further to **23 local things maximum**. Previous collections remain physically available; nothing terminal disappears. These counts are logical-engine counts, not rendered mobile-fit measurements.
- The original uniform 220-recipe bank was **rejected as quota-shaped** after independent narrative review. It remains as `rejected-quota-bank-220.json` to preserve the failed experiment, not as an alternative ready game.

## Files and reproduction

```sh
python ideas/build_campaign.py
python ideas/evaluate.py
node engine/cli.ts validate ideas/scenario.json
node ideas/verify-route.ts
node ideas/measure-engine-load.ts
```

Run from the research directory. `revisions.py` records the pruning; `enrich.py` adds actual discovery explanations, source annotations, setting constraints and current-scene-only carry lists. `evaluation.json` is an exact prerequisite audit for a unique-producer, non-retiring DAG. `goal-route.json` is an author route; `engine-route-evidence.json` is its executable result. `engine-load-before-explicit-carry.json` and `engine-load-evidence.json` preserve the carry-policy comparison.

`pilot-optics-perspective-chance.json` is frozen for independent play at SHA256:
`8ecbfb22c4e26bc9f6ac9160bf532d36284b6431540ced38559e2a478ce22133`.
Do not regenerate it during a frozen trial. `make_pilot.py` is for a future explicitly versioned revision. Initial borrowed experimental protocol is stated in its premise; this is a standalone slice, **not** a main-campaign checkpoint.

## Narrative model

The player assembles a traveling atlas of ways people make and challenge knowledge. Chapters are reconstructed collections and workshops, not literal time-travel invention, not a claim that two ideas necessarily caused one historical event, and not a universal civilization ladder. Fictional curators give requests; their dialogue is not attributed to historical people.

The sequence includes argument, textual criticism, algebra, optics, painting, anatomy, circulation, motion, chance, longitude, deep time, species, waterborne disease, photography, comparative history, communication, inference, commons, model evaluation and two explicitly speculative future chapters. Earlier tools have later uses: field notes, experimental protocol, critical editions, camera obscura, image-forming model, uncertainty statements, causal assessments and revisable agreements.

Sparse mechanical locations currently serve only two genuine context requirements: aperture imaging in a dark room, and timekeeper testing at sea. The many named intellectual centers are **narrative areas**, not twenty-two location tiles. Modern teaching abstractions are explicitly distinguished from historical provenance.

## Authenticity findings that changed the design

1. **Vesalius** is almost certainly the intended name behind “viselius.” He both relied on and challenged Galen; “authority was wrong, observation replaced theory” is too crude. The anatomy chapter asks for an evidence-backed correction, not destruction of inherited learning. [NLM](https://www.nlm.nih.gov/exhibition/historicalanatomies/vesalius_bio.html).
2. Harvey's argument was quantitative and experimental **and** analogical/teleological. Later capillary observations are a separate generation of evidence, not something Harvey saw. [OU primary-book exhibit](https://galileo.ou.edu/exhibits/anatomical-exercises-dr-william-harvey.html), [APS historical research](https://journals.physiology.org/doi/full/10.1152/ajpheart.00704.2007).
3. Hutton's unconformity supported a pre-existing account of repeated geological processes. It was not a magical instant invention of deep time. [IUGS](https://iugs-geoheritage.org/geoheritage_sites/siccar-point/).
4. Longitude is richer with **both** timekeepers and lunar-distance methods; the useful payoff is an independently checked position. Manufacturing, cost and repeated trials must not vanish behind a lone-genius story. [Royal Museums Greenwich](https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem).
5. The Snow chapter uses denominators and water-company comparisons, not the myth that one map and removing a handle straightforwardly ended the epidemic. [UCLA's primary-text investigation](https://epi-snow.ph.ucla.edu/Stream3_GrandExperiment_d.html), [outbreak context](https://epi-snow.ph.ucla.edu/Stream2_BSPoutbreak_f.html).
6. Perspective is a chosen representational method, not art's inevitable destination. [National Gallery](https://www.nationalgallery.org.uk/paintings/glossary/perspective).
7. The comparison-of-histories chapter treats sweeping geographical explanations as **rival hypotheses to test**, not as settled lessons from *Guns, Germs, and Steel*. It needs more specific case research before publication.

## Known shortcomings / gates before live integration

- The full candidate remains too abstract and worksheet-like in places. “Annotated correction,” “model card,” and “nested agreement” can be real outputs, but many consecutive administrative upgrades do not automatically make a good game. The future tail especially needs a stronger imaginative payoff and disagreement with consequences.
- 187 contextual primitive supplies across 22 stages are still a warning about insufficient reuse. Each is in an explicit broad collection rather than a magic level grant, but that framing alone is not enough.
- Some chapters still have a repeated ten-recipe shape inherited from the rejected bank. Do not defend these merely to keep the count above 200.
- The 192-action required route is **eight short** of the user's minimum. Add only independently promising content; never an arbitrary checklist or manufactured extra step.
- Historical source coverage is uneven. Source registry entries support bounded facts, not all recipe edges. Introductory argument, generic scientific method, general inference and comparative-history particulars require a closer specialist pass.
- Current plurality is insufficient: Arabic/Persian contributions appear, but the overall tour is still disproportionately European. A Chinese thought chapter cannot be a token name swap; it needs a genuinely different question and primary-text-grounded methods. South Asian mathematical/scientific traditions likewise deserve substantive treatment.
- No retirement is authored yet. This deliberately avoids accidental loss while content evolves; later conceptual incorporations/upgrades should be tested, not terminal deletion.
- No browser layout, touch dragging, animation, golden-objective styling, persistence or human fun test was executed here.

## Next decision, not a promise

Fresh-play the short pilot before expanding the entire bank. If a player enjoys discovering an image, using it to construct a painted courtyard, and settling an interrupted game, retain that recognizable-product grammar. If the card names feel like vocabulary homework, revise the interaction rather than merely writing 100 more names. The logical model can establish reachability and clutter; only play can establish whether this remains compelling.

### Specific pilot hypothesis to test

The dark-room catalyst might be insufficiently motivated: the current request names an optical experiment and model but does not explicitly say why darkness is needed. Do **not** coach a frozen source-blind player or change its file mid-trial. Observe whether the visible location and interaction affordance make this discoverable. If not, a short curator line about stray light washing out the image is a better fix than revealing a recipe or removing the location requirement.

## Pilot v2, preferred next frozen trial

`pilot-optics-perspective-chance-v2.json` leaves v1 untouched. It supplies a concrete fair, independent-round game (first to three wins, stopped at 2–1, four-coin stake) and explains the 3:1 fair division on discovery. Probability, expected value, observed frequency and key painting products now have intellectual payoff descriptions rather than formulaic placeholder prose. It also uses explicit future-area carry. Validation passed; the full main-campaign author route remains 192 combinations. Main-campaign changes do not silently update this frozen copy.

## Next grounded expansion candidate (not implemented)

A short printing workshop could provide a meaningful missing link between textual criticism and wider circulation, rather than eight arbitrary steps to cross a count threshold. Compare recognizable woodblock and movable-type products, use an already made critical edition, and give the goal a concrete audience beyond the archive. Investigate reuse of paper/ink/diagrams with painting and photography. Do not invent a linear China → Korea → Gutenberg transfer story or imply movable type simply superseded block printing.

Sources found for a later pass: [British Library / International Dunhuang Programme: dated Diamond Sutra](https://idp.bl.uk/discover/learning/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra/) and [Rijksmuseum catalog: From Jikji to Gutenberg](https://www.rijksmuseum.nl/nl/collectie/publicatie/From-Jikji-to-Gutenberg-the-origins-of-book-printing-from-moveable-metal-type--20828c83e833104de97d52187ff95af1). These are leads, not a completed recipe-authenticity audit. The former distinguishes an earliest dated complete printed text from the invention of printing itself.


## Latest human-rule revision: current scene only (engine v3)

The incoming stage now explicitly requests only operands useful to its own recipes (including reasonable local optional experiments) and its own objective items. It **does not** carry things merely because a later chapter might need them. The traveling archive narrative says that known tools are collected from accessible earlier collections when needed. Engine v3 transfers the same existing tokens, not clones or grants; all unused things remain in their durable areas.

Verified results: main candidate still completes in192 combinations; peak local things **23**, compared with30 under future-chapter carry and43 under original conservative carry. The identity audit records27 transfers, of which20 collect known things from an earlier area other than the immediately previous scene. Examples: experimental protocol from opening archive to optics; field note from opening archive to anatomy, then later from anatomy to geology. No existing token was lost, cloned or changed kind.

Reproduce with `node ideas/verify-current-scene-carry.ts`; evidence is `current-scene-carry-evidence.json`. Prior scenario and metrics retained as `scenario-future-carry-v2.json`, `engine-route-future-carry-v2.json`, and `engine-load-future-carry-v2.json`. The frozen31-recipe pilotv2 is **unchanged**, SHA256 `7997522aa8e6bb69effae7388b9ba9b43bf8d88522a186781709f2e9c7255a24`; it retains its prior explicit carry policy. Create a new version for any new trial rather than silently treating it as current-scene v3 content.
