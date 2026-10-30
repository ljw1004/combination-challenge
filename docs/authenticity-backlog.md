# Authenticity backlog

Consolidated 30 October 2026. This is the single working record of discoveries and proposed improvements from the original authenticity audit, its contextual follow-up and the Markdown proposal review. It replaces the duplicate active review and the earlier table of unverified lexical matches. The original evidence remains in the [historical review](../archive/legacy-2026-10-30/docs/story-authenticity-review-2026-10-30.md).

**Current work:** implement worthwhile changes, test their affected routes and player experience, and record a decision for every finding. A proposal is not a completed fix. Do not convert optional polish, a material uncertainty or an absent story edition into a compulsory gameplay change merely to clear this document.

**Reconciliation baseline:** [the restructured repository at f512587](https://github.com/ljw1004/combination-challenge/commit/f5125875dc25080e68be63061861426c9129de74). All five manuscripts were compared with the [proposal baseline at 1e8567d](https://github.com/ljw1004/combination-challenge/commit/1e8567d343a36d8280f54cf5e6bc41a98b7fcd47): only image paths changed. The manuscript mappings below are therefore substantive mappings, not the former lexical guesses. Current [format semantics](story-format-spec.md), [authoring guidance](story-authoring.md) and [evaluation method](fun-and-evaluation.md) govern implementation. The earlier proposal's statement that a linter and AI playtester did not exist is now obsolete.

## Scope and decisions

The 70 stable finding IDs currently comprise **28 concrete candidates, 19 optional improvements, 6 investigations, 13 keep decisions and 4 absent-edition findings**. Five user-supplied calibration examples follow separately. These are editorial dispositions, not replacement audit ratings.

- **Candidate:** a concrete current concern and a preferred small change. Implement after coordinating dependencies; record the actual change and checks.
- **Optional:** consider only if it improves clarity without needless steps, new premises or clutter. Choose adopt or retain and explain why.
- **Investigate:** resolve the evidence or authorial choice first. A conservative wording change can remove an overclaim without proving the original strong claim false. Preserve any remaining physical or historical uncertainty.
- **Keep:** no required repair is supported on the stated basis. Preserve the useful interaction; do not reopen rejected objections without new evidence.
- **Absent:** the reviewed secondary edition is not among the five active Markdown stories. Do not transplant its defect or proposed patch into a different story.

For an implemented item, append **Outcome**, **Verification** and **Evidence limits** to its entry, with the exact commit or reproducible run. For an adopted optional change or a closed investigation, record the decision explicitly. Keep and absent entries can close by reviewed disposition without pretending a source change occurred.

## Common implementation and acceptance rules

1. **Keep the contribution visible.** Review inputs forwards, before seeing the answer. Names, goals, components and earned explanations should show what each input contributes. Chapter titles and author `NOTE` blocks are not displayed explanations. Assume primitive wonders are skipped and Divinity's earned explanations are skimmed.
2. **Prefer a genuine gain over another label.** Collapse redundant conversions; distinguish a requirement, a method, an observation and a tested conclusion. Do not replace every historical or philosophical interpretation with a deductive proof puzzle. Ordinary fabrication can join complementary components without a complete manufacturing inventory.
3. **Respect the current model.** Items are infinite resources. `[consume]` and `[transform]` control hiding and placement, not finite stock; only mutual exclusivity encodes finiteness. Preserve meaningful transformation, future-needs protection, compound slots and explicit single-use annotations. Do not keep everything visible or invent extra goals merely to retain ingredients.
4. **Edit the global graph together.** Rename every declaration, recipe, goal, alias and downstream use; deleting a producer alone can accidentally introduce a primitive. Review all alternatives, chapter needs, future-supply warnings, early completion and `[If skipped]` text. Preserve independent assembly order and intentionally unnamed slots.
5. **Verify the final candidate.** Run the repository's lint, type, unit, browser and production-build checks as applicable. Review mixed-fate, future-supply and working-set warnings rather than suppressing them mechanically. Test alternative and repeated routes, relevant skips, compound preservation and earlier-to-later continuity. Use current [logical playtesting](../README.md#logical-playtesting) with fresh, source-unexposed players, frozen versions and replayable observations. Mechanical success, an agent's report and human enjoyment remain different evidence.
6. **Do not overclaim research.** The external references below are carried forward from the proposal research with their stated limits; consolidation did not re-open every source. They support bounded historical or material statements, not proof that a game action is intuitive, fun, safe or a complete real-world procedure. Perform additional research when a stronger factual implementation needs it.

## Shared changes to coordinate

- **Clock and chart:** remove the redundant clock producer and rewire all three consumers, including the later time network. Preserve calendar's own early purpose, the lunar archive callback, both longitude alternatives and separate H4 performance evidence. Coordinate any optional method labels.
- **James and writing:** supply the existing dream-interpretation identity directly, remove only the duplicate Freud conversion, and make continuity's remaining single-use preservation explicit. Preserve James's distinct time comparison and Freud's artistic afterlife.
- **Publication and later evidence:** propagate the chosen publication result through workshops and Snow. Snow's comparison is publicly inspectable, not a randomized trial or a replayed epidemic. The later intervention still needs an explicit proposal-to-measurement link.
- **Grain and elemental origins:** retain the four storybook primitives. Prefer a visible harvest/winnowing role over an unnecessary grain-and-chaff crafting detour; do not make later seeds prerequisites of the opening Plant.
- **Jars and glaze:** coordinate one prepare/coat/fire/fill explanation with the finished-jar input and Covered preserves name. Glaze mixture wording does not certify its formula or food-contact safety. Keep optional pickle/winter consistency changes distinct from the core fix.
- **Press and millstone:** if adopting wheel-as-reusable-guide wording, change its fate consistently but retain the two useful millstone-consuming routes. Do not invent permanent internal component labels inside transformed results.
- **Shelter and greenhouse:** put damage on damaged inputs. If choosing Patch supplies, rename all four references once; review role-dependent fates rather than asserting immediate disappearance.
- **Relay and scout:** retain physical navchips, any-order slots and stable construction history. Do not restore the old runtime's stale reader claims or absorbed component strips.
- **Navigation and depot:** keep timing, sky observations, calibration, ranging and orbit data distinct. Combine depot route-information and surface-track changes in the shared final equation once; old UI overlap is not current UI evidence.
- **Ripple sites and impression:** separate mapped provenance from physical contact technique. Rock-setting wording would be a fictional setting decision requiring image alignment, not proof of a safe or nondestructive impression method.
- **Capsule and recorder:** keep one Return capsule and all slots, including the unnamed Shock mount slot. Clarify removable ground transport versus flight docking without imposing an assembly order. Use a single packing popup if both recorder and restraint cues are adopted.

## Finding entries

The sections below preserve every finding ID and original case binding. Original priorities are historical; the disposition and action describe the current Markdown. Source links to story passages identify the reconciled manuscript; the full historical input/output and version record is retained in the archived review.


## Concrete candidates

### AF-paid-guarantee Separate the dead person from the living buyer

**Candidate · Divinity · original P1.** Cases: `Q1ef3f61ff741`.

**Concern:** Earned seller claim concerns a dead soul, while output invokes an unspecified living person’s changed life.

**Action or decision:** Replace only the existing earned wonder for ‘Luther: a paid guarantee cannot replace a changed life’. Lead with dead person’s release versus living buyer’s repentance: Luther denies guaranteed release for a coin and says purchasing it cannot replace lifelong repentance. Retain seller-versus-official-teaching and not-all-rites/payment qualifications, label, goal and equation.

**Alternatives and limits:** Only after a failed skim test, coordinate goal/result/identifier rewrite explicitly naming dead soul’s release and buyer’s repentance; do not add a second identity or gate.

**Checks:** Keep both preserved reagents and penalty → letter → seller chain, food reuse and baptism comparison. Ask whose repentance is at issue and whether the promise represents official teaching; confirm only wonder changed.

**Evidence limits:** Oxford Taylor English translation inspected, not Latin. Supports Luther’s attributed criticism, not all sellers or official doctrine; old missing-dead-soul context claim overstates baseline.

Passages: [divinity:578–657](../stories/divinity/story.md#L578-L657).

Research: [editions.mml.ox.ac.uk](https://editions.mml.ox.ac.uk/editions/luther-95-theses/luther-95-theses-eng.shtml).

### AF-grain-air Give Air a visible winnowing job

**Candidate · Elements · original P1.** Cases: `Q40ed7b1604eb`.

**Concern:** Grain has use and plant provenance but Air’s role is unclear.

**Action or decision:** Retain Plant + Air → Grain and both supper goals. Add displayed supper context for harvesting/threshing ripe grain and moving air; earned Grain wonder explains lighter chaff blowing aside while grain falls: winnowing. Preserve broad Plant and compressed ordinary work.

**Alternatives and limits:** Only if minimal cue fails and discovery justifies cost, add Threshing floor hotspot: Plant @ floor → Grain and chaff; mixture [transform] + Air → Grain, with distinct wonders and artwork review. Do not combine both designs or remove Air via unary harvest.

**Checks:** Keep Plant fanouts, Grain-to-Flour/both-Porridge routes, starter and bread chains; preferred trial changes no edge/fate. Check item syntax and needs; optional route must preserve late porridge access after early milling. Coordinate AF-plant-starter.

**Evidence limits:** FAO supports threshing versus winnowing, not universal cereal treatment. Grain bin’s unrelated non-consuming gap stays out of scope; no later tools or farming simulation imported.

Passages: [elements:30–58](../stories/elements/story.md#L30-L58).

Research: [fao.org](https://www.fao.org/4/x0039e/x0039e06.htm).

### AF-preserve-jar-stage Use the finished jar consistently

**Candidate · Elements · original P1.** Cases: `Q23395dcb1d50`.

**Concern:** The branch fills shaped Clay jar despite separate coating/firing producing Glazed clay jar.

**Action or decision:** Summer core trial: Jam [consume] + Glazed clay jar [transform] → Preserve jar; Preserve jar [transform] + Jar lid [consume] → Covered preserves. Rename Sealed preserves goal/result together; popup explicitly says coat/fire before filling and fit wooden cover. Keep other summer goals.

**Alternatives and limits:** Separately, use Glazed clay jar for Pickle jar and replace three winter crock steps with Dried fruit [consume] + Covered clay jar [transform] → Fruit crock; remove only unused Crock/Lidded crock identities.

**Checks:** Coordinate AF-glaze-formulation HOLD; retain meaningful consume/transform roles and pottery needs across cider, floats, irrigation, water and winter. Check global names, both cider choices, water/winter order and future retention; optional winter simplification must not silently lose goals.

**Evidence limits:** V&A supports compressed glazing/firing, not generic sand-and-clay glaze or food preservation safety. Adjacent pickle/winter issues remain unresolved by summer-only trial; no permanent reusable vessels.

Passages: [elements:199–214](../stories/elements/story.md#L199-L214), [elements:723–739](../stories/elements/story.md#L723-L739), [current specification](story-format-spec.md).

Research: [vam.ac.uk](https://www.vam.ac.uk/articles/lucy-rie-british-studio-potter/).

### AF-calendar-clock Remove the redundant calendar to clock conversion

**Candidate · Ideas · original P1.** Cases: `N51b515776bb4`, `Q6dd9d1f25c3f`.

**Concern:** Clock already carries reference-meridian time; shared calendar does not explain a new operative contribution. Later longitude method is meaningful.

**Action or decision:** Remove ‘A clock carrying another place’s time’ declaration/producer. Replace all three consumers with ‘A calibrated portable clock set to a reference meridian’: local-noon longitude, H4 sea-trial report, and Time-network desk electrical-signal rule. Merge reference-time versus voyage-performance explanation into surviving clock wonder.

**Alternatives and limits:** Optional longitude-method/route labels remain separate and must propagate through both routes without restoring deleted clock.

**Checks:** Retain calendar’s own early goal, sea-tested alternative, both longitude routes, H4 goal and mandatory earlier planetary archive reuse for lunar work. Find every deleted alias; verify all three consumers, needs no longer importing calendar, chapter skips and report’s distinct contribution. Coordinate AF-train-reception and AF-longitude-method-labels.

**Evidence limits:** RMG catalogue identifies primary 1765 report but full pamphlet was not inspected. Calibration is not sea-proof. Deleting only producer could create an unintended primitive; one distant calendar callback is deliberately lost.

Passages: [ideas:1846–1898](../stories/ideas/story.md#L1846-L1898).

Research: [rmg.co.uk](https://www.rmg.co.uk/collections/objects/rmgc-object-478825); [rmg.co.uk](https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem).

### AF-bearing-chart Make the chart input a requirement rather than a finished chart

**Candidate · Ideas · original P1.** Cases: `N82115f7ddf46`, `Q51a704d5b496`.

**Concern:** The purported design-priority input already describes a flat bearing chart; globe context does not remove state overlap.

**Action or decision:** Replace finished-chart-shaped requirement with ‘A navigator needs constant-bearing routes drawn as straight lines’. Its wonder explicitly describes a desired flat-map property, not an existing chart. Update its declaration and preserved recipe reference; retain ‘An Earth with comparable positions’ + requirement → ‘A chart made for compass bearings’.

**Alternatives and limits:** No projection-formula puzzle or additional manufacturing stages proposed.

**Checks:** Retain chart output, distortion comparison, both longitude branches and voyage chain; replace both global old-label occurrences, preserve single-use requirement. Trace later voyage, geological and map-detail needs; test requirement-versus-result distinction and long-label readability.

**Evidence limits:** USGS supports constant-bearing property/high-latitude distortion, not this exact historical scene. Do not imply such routes are shortest paths or longitude alone gives full position; coordinate clock/longitude bundle.

Passages: [ideas:1298–1341](../stories/ideas/story.md#L1298-L1341).

Research: [usgs.gov](https://www.usgs.gov/faqs/how-are-different-map-projections-used).

### AF-benjamin-copy Give the final copy comparison new evidence

**Candidate · Ideas · original P1.** Cases: `Q4e1f6ae8d5cb`.

**Concern:** Audience/use input substantially states copies changing art’s reach; nuanced political interpretation alone does not give new input work.

**Action or decision:** Keep technical reproduction + artwork’s particular history → changed encounter. Replace only generic mass-copy primitive with rival-photo-captions: one explicitly imagined crowd photo captioned support versus coercion. Preserve inputs to final result ‘Reproduction changes art’s political reach’; amend question to politically contested copied image and wonder to circulation plus editorial framing, neither guaranteeing criticism nor manipulation.

**Alternatives and limits:** Do not collapse useful changed-encounter step or add invented historical evidence.

**Checks:** Replace old primitive’s declaration/use, add stable caption identifier, retain existing earned identities and preserved fates; final result stays local goal. Test each input’s contribution, unchanged needs, and whether fictional captions are mistaken for documented evidence.

**Evidence limits:** Benjamin II/IV–VI supports displaced encounter/political function/caption reading; accessible Zohn transcription not facsimile, German/version variants not collated. Captions are authored example, not Benjamin illustration or proof of viewers’ responses.

Passages: [ideas:3397–3447](../stories/ideas/story.md#L3397-L3447), [ideas:2862–2898](../stories/ideas/story.md#L2862-L2898).

Research: [marxists.org](https://www.marxists.org/reference/subject/philosophy/works/ge/benjamin.htm).

### AF-induction-comparison Make the induction result a comparison

**Candidate · Ideas · original P1.** Cases: `Qf3bf1c02d1d0`.

**Concern:** Faraday input already says changing magnetism induces current; output repeats it without expressing Ørsted’s contrasting contribution. Current Ørsted: magnetic current label obscures current’s magnetic effect.

**Action or decision:** Rename output’s declaration, producer and downstream reagent to ‘Current has magnetic effects; changing flux can induce current’. Wonder contrasts Ørsted current-to-magnetic-effect with Faraday changing-flux/closed-circuit induction, not simple reversal. Narrow Faraday input wonder to flux-change and closed-circuit qualifications; retain following spatial-field synthesis.

**Alternatives and limits:** Do not import absent motor chain or add apparatus busywork.

**Checks:** Retain both goals, input preservation, upstream matter/motion and independent Maxwell/light-to-climate rule. Check three references, needs/fates and early-completion/skips; test difference between effects, change requirement and longer ‘flux’ label.

**Evidence limits:** Old ‘magnetic current’ ambiguity already removed. IOP demonstrations and RI induction-ring object support facts, not Faraday’s exact use of modern wording. Avoid reversible or energy-free generation implication; not a goal collapse.

Passages: [ideas:2763–2822](../stories/ideas/story.md#L2763-L2822).

Research: [spark.iop.org](https://spark.iop.org/oersteds-experiment); [rigb.org](https://www.rigb.org/explore-science/explore/collection/michael-faradays-ring-coil-apparatus); [spark.iop.org](https://spark.iop.org/episode-414-electromagnetic-induction).

### AF-james-freud Remove the redundant James-to-Freud step

**Candidate · Ideas · original P1.** Cases: `Q396427efa870`.

**Concern:** Freud input already states dreams interpreted through wishes/conflict; James adds no discernible result.

**Action or decision:** Supply existing ‘A dream can be read for concealed conflict’ directly with Freud hidden-wish/conflict interpretation and nonmeasurement/nonuniversal qualification. Delete separate Freud declaration/wonder and continuity+Freud producer. Keep artistic-writing recipe unchanged. Add explicit [preserve] to ‘Experience has a moving continuity’ in its now sole reagent use with lived time.

**Alternatives and limits:** AF-automatic-writing’s earned-wonder clarification remains optional under same dream identity; no diagnosis or concrete dream required.

**Checks:** Retain James earlier goal/producer and time comparison; verify dream becomes primitive, continuity leaves this chapter’s ancestry, removed identity disappears and single-use fate is explicit. Keep writing goal produced rather than already-owned, check image-bearing supply timing/skips and whether shortened route feels abrupt.

**Evidence limits:** James IX and Freud II–III support separate attributed claims, not derivation. Freud Eder translation not checked against German; no clinical validity established. Deliberately loses repetitive cross-chapter connection.

Passages: [ideas:2900–2995](../stories/ideas/story.md#L2900-L2995).

Research: [gutenberg.org](https://www.gutenberg.org/cache/epub/57628/pg57628-images.html); [gutenberg.org](https://www.gutenberg.org/cache/epub/15489/pg15489-images.html).

### AF-scone-mix Name the unbaked mixture, not baked crumbs

**Candidate · Kitchen · original P2.** Cases: `Q80df4363dbce`, `Q23d1ac7bf9c9`.

**Concern:** Raw flour-and-butter mixture is sound but its name can imply finished food.

**Action or decision:** Rename Scone crumbs to Rubbed-in scone mix in exactly two rules: Self-raising flour [transform] + Butter → mix; mix [transform] + Milk → Scone dough. Preserve oven baking and Scones → Jam-filled scones → Cream tea plate goal.

**Alternatives and limits:** No separate declaration, mixing stage, extra goal, recipe instructions or absent ‘Plain scones’ identity.

**Checks:** Verify both references and all existing fates/needs; check milk after hot chocolate and shared later muffin/ice-cream uses. Review later-shift flour retention separately; keep jam/cream prerequisites and unbaked-to-dough-to-baked comprehension.

**Evidence limits:** Two old cases map to one present sequence, not separately verified editions. BDA recipe supports breadcrumb-like raw mix distinct from dough/baked food, not complete game formula. Ambiguity is editorial, mitigated by earlier pastry context, not observed failure.

Passages: [kitchen:800–830](../stories/kitchen/story.md#L800-L830).

Research: [bda.uk.com](https://www.bda.uk.com/resource/basic-scones.html).

### AF-starter-hydration Make the starter’s moisture visible

**Candidate · Elements · original P2.** Cases: `Qabfd472cad72`.

**Concern:** Dry flour plus Air produces culture defined as flour and water; Water/Rain present in river scene support ordinary moistening but operation never states it.

**Action or decision:** Keep all recipes/goals. Add Wild starter earned wonder: flour mixed with water and tended over time becomes living culture; microbes can come from flour/surroundings and Air stands for environmental contact, not all microbes arriving on breeze. Add existing item declaration before bakehouse combinations.

**Alternatives and limits:** No extra inventory hydration stage, timer or feeding chore; no air-only microbial-origin claim.

**Checks:** Added declaration is real chapter need, not grant/new primitive; check early discovery, bread/picnic-first and skipped bakehouse. Preserve flour transform, reusable Air/starter, risen dough/Bread/Picnic, cider containers, vinegar/pickles and feast routes. Kitchen yogurt unaffected.

**Evidence limits:** Old explicit flour-water-definition claim absent, but moisture premise still missing. CSU says intentional air capture unnecessary; Reese communities most similar to flour with some skin overlap, not universal source ratios or suitability for every fermentation. Earned cue survives early discovery better than popup-only repair.

Passages: [elements:164–182](../stories/elements/story.md#L164-L182).

Research: [extension.colostate.edu](https://extension.colostate.edu/resource/sourdough-starter-best-practices/); [pubmed.ncbi.nlm.nih.gov](https://pubmed.ncbi.nlm.nih.gov/31941818/).

### AF-branching-analogy Make the branching comparison the reward

**Candidate · Ideas · original P2.** Cases: `Q8d89eb658070`.

**Concern:** Full prose gives a legitimate analogy, but visible result repeats the fiction property and hides Darwin branching.

**Action or decision:** Keep two-input comparison; rename goal/declaration/result to ‘Story paths and ancestry share a branching shape’. Goal asks resemblance. Earned wonder names Darwin ancestry and Borges incompatible continuations, limited by possible convergence: shared shape, not mechanism, influence or physical multiverse.

**Alternatives and limits:** Do not collapse result onto known ancestry or fiction input; no new premise/intermediate needed.

**Checks:** Replace three references, preserve descent default and fiction explicit preserve, existing map/copy work and earlier Lamarck/Darwin use. Result has no later consumers; check unchanged needs, early-crafting/skip histories and ability to identify both shared shape and differences from skimmed board.

**Evidence limits:** Darwin Origin IV supports branching; Borges Spanish third-party transcription has visible OCR defects, English scan not inspected. Proposed English paraphrases rather than verified translation. Existing source already qualifies ancestry-versus-fiction; narrow remaining issue is visible reward.

Passages: [ideas:3397–3447](../stories/ideas/story.md#L3397-L3447), [ideas:2546–2566](../stories/ideas/story.md#L2546-L2566).

Research: [darwin-online.org.uk](https://darwin-online.org.uk/converted/published/1859_Origin_F373/1859_Origin_F373.html); [literatura.us](https://www.literatura.us/borges/jardin.html).

### AF-planetary-record-provenance Supply the new planetary records

**Candidate · Ideas · original P2.** Cases: `Q8c8804c17f57`.

**Concern:** Inherited archive contains dated eclipses; new primitive only says planets wander, while output claims generations of planetary positions.

**Action or decision:** Replace ‘Planets wander against the stars’ declaration/use with ‘Dated sightings of planets against the stars’, explicitly new dated reports. Popup announces separate collection; archive wonder credits earlier date/gap recordkeeping rather than hidden planetary data. Keep earlier eclipse archive unchanged. At lunar chapter add visible distinction: new readings/prepared tables, inherited comparative-recordkeeping practice.

**Alternatives and limits:** No numerical dataset, simulated generations, retroactive expansion of eclipse archive or extra observation gate.

**Checks:** Keep both goals, Ptolemaic chain, archive output, single-use records explicit preserve and inherited archive default preserve. Check two renamed references, supply timing, skips and downstream lunar reuse; coordinate AF-calendar-clock and optional longitude names.

**Evidence limits:** Ptolemy IX.7 indexed translated Mercury passage only, not whole PDF; supports kind of records, not particular collection/transmission. USNO distinguishes prepared lunar almanac data. Player should distinguish newly arrived observations from inherited method.

Passages: [ideas:600–649](../stories/ideas/story.md#L600-L649).

Research: [classicalliberalarts.com](https://classicalliberalarts.com/resources/PTOLEMY_ALMAGEST_ENGLISH.pdf); [aa.usno.navy.mil](https://aa.usno.navy.mil/publications/na_history).

### AF-epicurus-premise Earn an argument, not an achieved emotion

**Candidate · Ideas · original P2.** Cases: `Q6354a7046e19`.

**Concern:** Current safe conclusion overlaps source label, not a literal promise to remove fear.

**Action or decision:** Rename premise to ‘Suffering requires sensation’ and result to ‘Epicurus: an argument against fearing death’. Atomism wonder connects bodily-soul dispersal with sensation ending; premise wonder stops short of conclusion. Earned result explains attributed inference without guaranteeing emotional relief or denying dying/grief. In unchanged sufficiency result, explain reasoning against fear alongside friendship/simple enjoyment.

**Alternatives and limits:** No extra philosophical gate, modern-atomism proof or deletion of Epicurus’s therapeutic aim.

**Checks:** Update both declarations and producer/downstream recipe, retain all preserve annotations, both goals, skepticism and later Luxury and well-being use of sufficiency. Test sensation premise versus conclusion versus actual fear relief; check global rename and downstream reachability.

**Evidence limits:** Menoeceus read in Hicks translation; Herodotus excerpt lacks translator/section identification. Sources support attributed reconstruction, not clinical measurement. Baseline output is stronger achieved-emotion wording than old audit’s safer label.

Passages: [ideas:503–549](../stories/ideas/story.md#L503-L549), [ideas:2095–2125](../stories/ideas/story.md#L2095-L2125).

Research: [classics.mit.edu](https://classics.mit.edu/Epicurus/menoec.html); [contrib.andrew.cmu.edu](https://www.contrib.andrew.cmu.edu/~kk3n/80-300/epicurus-to-herodotus.htm).

### AF-infrared-bridge Make the electromagnetic connection visible

**Candidate · Ideas · original P2.** Cases: `Q33f6fa4c89ee`.

**Concern:** Earned electromagnetic card does not explain infrared heat loss, although climate setting supplies Earth/emissions.

**Action or decision:** Replace only the Climate desk popup, adding that Earth loses heat through infrared radiation, an invisible part of the electromagnetic spectrum. Keep the heat-loss recipe, labels and earned explanations unchanged so the returning light insight has a visible connecting premise before combination.

**Checks:** Preserve both reagents and the heat-loss → warming-pressure → recent-warming chain; add no item, goal, alias, slot or backward dependency. Check popup timing and unchanged needs; ask players why the electromagnetic insight and infrared evidence belong together without reopening wonders.

**Evidence limits:** NASA supports the short electromagnetic/thermal-infrared link, not the entire attribution argument. The existing wonder already explains absorption, re-emission and energy balance; this is a narrow teaching gap, not a false-greenhouse finding. No proposed checks were executed.

Passages: [ideas:2763–2822](../stories/ideas/story.md#L2763-L2822), [ideas:3617–3661](../stories/ideas/story.md#L3617-L3661).

Research: [science.nasa.gov](https://science.nasa.gov/ems/07_infraredwaves/).

### AF-future-trial-link Connect the proposed change to its trial record

**Candidate · Ideas · original P2.** Cases: `Q30aa3d1d33b8`.

**Concern:** Instrument corroboration already supplied; proposal’s changed condition is not connected to the observation.

**Action or decision:** Rewrite the displayed observatory popup and two supplied primitives as an explicitly imagined pointing-away-and-back test and two instruments losing the signal off-target/recovering it on-target. Update their sole recipe uses. Keep result identities but revise their wonders to connect the inspectable plan, measured response and remaining shared-error uncertainty.

**Alternatives and limits:** No named detector, numerical mini-study or extra simulation is needed.

**Checks:** Keep both goals, unfamiliar-case branch and earlier heat-comparison input; preserve records/methods and update each primitive declaration/use together. Check unchanged ancestry and fates; ask players to identify changed condition, observed response and one remaining uncertainty. Coordinate publication/Snow without deleting cross-workshop learning.

**Evidence limits:** Moderate-confidence editorial design, not an actual experiment. Matching records support an association with viewing direction, not causation, a final explanation or elimination of shared pointing errors. Nothing has been implemented or tested.

Passages: [ideas:3733–3782](../stories/ideas/story.md#L3733-L3782), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-publication-payoff Make publication the earned gain

**Candidate · Ideas · original P2.** Cases: `Qa83546f12c23`.

**Concern:** Input/output already promise repeatability; new distribution step is underexpressed.

**Action or decision:** Rename the primitive to Step-by-step trial instructions and earned output to Printed trial instructions for other workshops. Reword the second Heat trials goal around obtaining the method, the popup around circulation, and the two wonders to distinguish an available procedure from actual repetition. Keep the separate publication combination rather than collapsing its result.

**Checks:** Replace five output-name occurrences and two primitive occurrences; retain explicit instruction preservation and separate heat-evidence goal. Preserve the cross-workshop comparison, Hume and future-observatory uses. Coordinate the later Snow reagent name once. Check global references, needs, early crafting and skipped-chapter visibility; ask what publication added.

**Evidence limits:** Source-internal editorial proposal, not new history or a requirement to simulate printing/replication. Publication invites inspection and attempts but establishes neither successful repetition nor resolved trust/permission disputes. No checks have been executed.

Passages: [ideas:1535–1588](../stories/ideas/story.md#L1535-L1588).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-train-reception Remove the repeated reception craft without losing the physics

**Candidate · Ideas · original P2.** Cases: `N26a91fc33db3`, `Q81e3cafb61d1`.

**Concern:** Upstream result repeats much of its flash input while networked-time contribution remains weak. Downstream simultaneity step has distinct geometry/light-speed inputs.

**Action or decision:** Remove unequal-passenger-reception’s declaration, wonder and producer, then combine platform-flashes directly with light-invariance to earn Different frames need not agree on distant simultaneity. Expand the retained primitive paragraph with midpoint motion and the reception/emission distinction; retain the earned final equal-distance/same-speed explanation.

**Alternatives and limits:** Removing a near-duplicate step may reduce useful pacing; do not remove network coordination or the genuine downstream inference.

**Checks:** Remove all three discarded-identifier references. Preserve both surviving single-use inputs, network railway/transmission uses and earlier Universal mechanics in the final comparison. Coordinate calendar-clock. Verify unchanged Newton-limit chain and goal needs; ask players why distance and light-speed premises matter.

**Evidence limits:** Einstein’s teaching account §§8–9 supports the distinction; arrival order alone does not prove different train-frame emission times. This reconstructs a thought experiment, not a new physical measurement. No playtest or mechanical validation is claimed.

Passages: [ideas:2997–3047](../stories/ideas/story.md#L2997-L3047).

Research: [gutenberg.org](https://www.gutenberg.org/files/5001/5001-h/5001-h.htm).

### AF-snow-checkability Make the water comparison publicly checkable

**Candidate · Ideas · original P2.** Cases: `Q351725b6e60b`.

**Concern:** Result repeats water association already in evidence, rather than what the repeatability idea adds.

**Action or decision:** Rename the output to A water-supply comparison others can check in its declaration, producer and both downstream rules. Replace its wonder with publication of deaths, supplier identification, house-count denominators and inspectable mortality rates. Retain the water association and caution about errors/other differences; distinguish checking records from assigning supplies or repeating an outbreak.

**Checks:** Coordinate the upstream publication-result rename; keep its public-method role and both existing local goals. Preserve all fates and four global replacements, exposure/miasma branches and unchanged ancestry. Ask what publication contributed and whether players mistakenly infer randomized assignment.

**Evidence limits:** Snow’s 1855 edition pp.78–80 and Table IX p.86 support verification, counts and rates, not successful independent replication. The connection with earlier workshop practice is editorial synthesis, not documented direct influence. Proposed checks remain unperformed.

Passages: [ideas:2663–2701](../stories/ideas/story.md#L2663-L2701).

Research: [gutenberg.org](https://www.gutenberg.org/files/72894/72894-h/72894-h.htm).

### AF-venus-payoff Earn the phase observation before comparing models

**Candidate · Ideas · original P2.** Cases: `Qa18a38e190cd`.

**Concern:** Input already supplies crescent/nearly-full appearances; result title repeats them although prose adds model constraint.

**Action or decision:** Replace only the supplied Venus primitive and its sole reagent use with Watch Venus over several months, described as repeated viewing of its illuminated shape. Keep A telescope + that instruction → The full range of Venus’s phases, so the existing earned wonder supplies crescent/nearly-full observations for the first time.

**Alternatives and limits:** Do not add elapsed-time simulation or extra observation stages, or rename this result into a premature Ptolemaic refutation.

**Checks:** Keep the crafted Venus goal and later separate Ptolemy/Tycho comparisons, preserving the stationary-Earth alternative. Keep telescope reuse across three observations and all fates. Check two replacements, early crafting and skipped popups; ask what was observed and why phases alone do not prove Earth moves.

**Evidence limits:** Museo Galileo’s institutional accounts support the phase/model distinction and announcement dating; Galileo’s letters were not directly inspected. The observation instruction is authored teaching prose, not new historical evidence. Checks are prospective.

Passages: [ideas:1343–1393](../stories/ideas/story.md#L1343-L1393), [ideas:1405–1439](../stories/ideas/story.md#L1405-L1439).

Research: [catalogue.museogalileo.it](https://catalogue.museogalileo.it/indepth/PhasesVenus.html); [brunelleschi.imss.fi.it](https://brunelleschi.imss.fi.it/esplora/cannocchiale/dswmedia/simula/esimula1_3_st.html).

### AF-cabin-check-role Make the cabin check distinct from fitting the cabin

**Candidate · Mars · original P2.** Cases: `Qb8af145fec3b`.

**Concern:** Fully fitted cabin and pad can generate test observations in action, but pad checking role and limited result are underdescribed.

**Action or decision:** Keep the four-slot cabin/pad recipe. Replace the entry popup’s already-existing-record wording with repairing/fitting the cabin, checking hatch closure and console responses at the pad, and recording observations. Add a Cabin test record wonder describing a limited fictional functional check, not launch clearance; shorten the next recap accordingly while retaining meeting/final-assembly requirements.

**Alternatives and limits:** Do not invent a reader, diagnostic device, prior observation token or new launch-record prerequisite.

**Checks:** Retain shell/seal repair, four implicit slot installations, default cabin preservation at checking and later cabin consumption into final assembly. Inspect creation/transition ordering, global early completion, chapter skips and four-slot qualification. Ask what the record establishes and does not.

**Evidence limits:** Hatch/console scope is a proposed fictional premise, not an observed pass, certification criterion or spacecraft procedure. Record is already a goal need; its declaration adds no requirement. No external testing claim or executed validation.

Passages: [mars:776–842](../stories/mars/story.md#L776-L842), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-archive-device-role Make the recorder visible in its name

**Candidate · Mars · original P2.** Cases: `Qbf8860e6c5f2`.

**Concern:** Two storage-sounding inputs obscure fitting removable medium into compatible device.

**Action or decision:** Rename Data store to Card recorder at its declaration and sole recipe use; keep transformation with consumed Archival card into Archival recorder. Update the packing popup to identify a complete recorder and matching medium and explain saving a portrait copy into the return archive. Use one combined popup if specimen-cart is also selected.

**Alternatives and limits:** Do not add camera, cable, power, filesystem or transfer gates, nor claim visible ejection or recorder installation in the capsule.

**Checks:** Preserve recorder/portrait → Family record → Expedition archive → Complete field archive ancestry and existing fates. Keep all six capsule slots and later transport/docking chain. Verify global rename and slot references; ask what is fitted, saved and packed, including skipped-popup comprehension.

**Evidence limits:** This clarifies fictional device versus saved content, not a particular real recorder or removable-card inventory simulation. No new goal, top-level result or dependency. Implementation and player validation remain to be recorded.

Passages: [mars:844–879](../stories/mars/story.md#L844-L879), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-mapped-sites-label Name the mapped sites, not a depositional conclusion

**Candidate · Mars · original P2.** Cases: `Qdeb97416a2f1`.

**Concern:** Actual recipe marks both photographed sites on the terrain model; the abstract output label hides that useful result.

**Action or decision:** Replace Deposition context in both recipes with Mapped ripple and gravel sites. Add one displayed sentence instructing players to mark both photographed sites on the terrain model, then compare with the basin record. Preserve existing scientific qualifications and the distinct mapping-versus-interpretation sequence.

**Alternatives and limits:** Coordinate any optional rock-setting popup from sandy-impression-method once; mapping does not resolve that physical-contact hold. Do not add surveying equipment or dimensional calibration.

**Checks:** Preserve terrain-model reuse and all photograph, basin-record and mapped-result fates. Check rename and the Qualified basin story → Comparison board → Sleeved comparison chain, parallel complete archive and full capsule-to-rendezvous path. Ask what mapping adds without implying proof of water, age or life.

**Evidence limits:** Mapping is proposed fictional annotation, not an accomplishment demonstrated in this baseline or evidence of a coverage/layout defect. No external geological claim is needed. No goal/slot changes, recipe collapse or executed tests.

Passages: [mars:670–709](../stories/mars/story.md#L670-L709).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-depot-wind-relevance Compare the depot evidence directly

**Candidate · Mars · original P2.** Cases: `Qdcbc4cf35503`.

**Concern:** Current photo/survey mismatch is grounded, but an earlier visibility interval does not clearly contribute evidence for much later depot track changes.

**Action or decision:** Produce Track disagreement directly from preserved Current marker view plus Depot survey print. Remove Registered route views and the old Weather record combination. Add an earned comparison wonder saying tracks changed without establishing when/why. Keep cleaning, photography and sign/hauler work; combine any identifier rename in the final route equation once.

**Checks:** Remove both Registered route views mentions and depot weather need; Weather record remains its earlier travel goal, with no reagent use or new fate needed. Retain Protected controller, camera, explicit information preserves, hauler slots and shuttle oxygen/transport uses. Check orphan names, goal/skip behavior and coordinated depot labels; leave geometry to depot-card-overlap.

**Evidence limits:** The earlier weather record supplies no stated overlapping depot observation or causal evidence. Simplification is an editorial candidate, not compelled by old findings or implemented/linted/fun-tested. Changed appearance does not establish cause or safe-route guarantee.

Passages: [mars:214–246](../stories/mars/story.md#L214-L246), [mars:711–745](../stories/mars/story.md#L711-L745).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-orbiter-table Make the orbital information legible

**Candidate · Mars · original P2.** Cases: `Q842623759c68`.

**Concern:** Timing plus expected orbital position is a meaningful prediction, but card name is jargon.

**Action or decision:** Rename Ephemeris card to Orbiter position table in its declaration, recipe and displayed kit paragraph. Add a short wonder explaining predicted orbiter positions at reference-clock times, compared with received beacon times as one rendezvous input rather than a complete flight plan. Keep the existing timing/prediction recipe.

**Alternatives and limits:** Received beacon times is optional later polish; do not automatically rename Beacon times or replace the observation/ranging branches.

**Checks:** Preserve receiver/clock → Timing station → Beacon times and table fates; retain separate orientation and ranging contributions. Coordinate star-observation-orientation; preserve later Rendezvous program consumption. Check three replacements, needs and radio availability after rover installation; ask pass prediction versus agreed rendezvous.

**Evidence limits:** JPL supports ephemerides as time-related trajectory information, not numerical accuracy or sufficiency of this fictional flight solution. No goals, recipes, slots or needs change. Checks and playtests have not run.

Passages: [mars:806–842](../stories/mars/story.md#L806-L842).

Research: [ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/orbits.html); [ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/horizons/manual.html).

### AF-star-observation-orientation Make the navigation gains legible

**Candidate · Mars · original P2.** Cases: `Q0c1c10beca47`, `Q1560dd84ab86`.

**Concern:** Sky fix and Ground reference obscure observation versus station orientation.

**Action or decision:** Globally rename Sky fix to Star observation and Ground reference to Station orientation across three affected rules. Add displayed context that the tracker records stars and the terminal applies stored station survey/tracker-mount calibration, while pass prediction and ranging remain necessary. Keep the navigation chain and all fates.

**Alternatives and limits:** Do not add components, simulator gates or later top-level declarations merely to force these intermediate labels to remain visible.

**Checks:** Update two occurrences per name, preserving alignment, timing/table, ranging and agreed-rendezvous → program flow. Coordinate orbiter-table. Exercise radio-slot installation and final-program carry-forward; ask the new contribution of each result and whether sky observation is mistaken for locating the orbiter.

**Evidence limits:** Station survey/calibration is a proposed fictional premise, not baseline evidence or verified frame tie/flight readiness. NASA supports orientation versus broader navigation only; real trackers may already compute attitude. Existing radio protection is unchanged, not proven safe. Checks remain unperformed.

Passages: [mars:806–842](../stories/mars/story.md#L806-L842), [mars:899–906](../stories/mars/story.md#L899-L906).

Research: [nasa.gov](https://www.nasa.gov/missions/lasers-stars-and-sensors-will-guide-nasas-orion-spacecraft/).

### AF-shelter-seam Put the damage on the damaged shelter label

**Candidate · Mars · original P2.** Cases: `Q0b32a640c39c`.

**Concern:** Visible mission asks for warmth; torn seam appears only in optional reading.

**Action or decision:** Rename Service shelter to Service shelter · torn seam in its item declaration and repair recipe, retaining all fates. Put damage on the unrepaired object rather than a popup that could become false after early global repair. Keep the entire Sealed → Warm → Prepared → Occupied → Provisioned → Insulated refuge chain.

**Alternatives and limits:** Independently consider Pressure patch → Patch supplies at all four occurrences, coordinated once with greenhouse-repair; do not automatically alter mixed fates to hide repeated use.

**Checks:** Verify both shelter references and any coordinated patch rename. Inspect early-repair chapter entry, later greenhouse need and current future-protection semantics. Retain heater reuse and declared bed consumption; ask whether players identify the seam as the patch target.

**Evidence limits:** Editorial label/context candidate, not a missing-reader repair or inference from unseen artwork. Transformed refuges are not containers exposing every prior part. Longer labels and patch stock interpretation need review; no successful play is demonstrated.

Passages: [mars:308–338](../stories/mars/story.md#L308-L338).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-depot-identifier Name the recovered route information

**Candidate · Mars · original P2.** Cases: `Q379025151297`.

**Concern:** Actual payoff is readable surveyed route marker used in later comparison.

**Action or decision:** Rename Revealed socket mark to Readable route identifier in the cleaning output and its sole combination with Track disagreement. Change nothing else: the existing displayed opening already frames changed tracks and fixed route markers. This names recovered route information rather than suggesting the hauler controller’s hardware socket.

**Checks:** Preserve both information fates, cleaning/camera/survey branch, sign assembly, hauler slots and shuttle oxygen/specimen uses. If depot-wind-relevance is selected, apply the shared final rule once and remove only that card’s weather dependency. Check no stale identity/new primitive; keep depot-card-overlap as separate rendered inspection.

**Evidence limits:** The identifier is not the finished route and route identification is not a safety guarantee. Source-internal fictional-story judgment, not new Mars evidence. No declaration, goal, alias, slot, prerequisite or fate changes. Ask whether players recognize and combine the navigational clue; no lint/playtest executed.

Passages: [mars:711–745](../stories/mars/story.md#L711-L745).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-specimen-cart Make the removable capsule load explicit

**Candidate · Mars · original P2.** Cases: `Q0ad7d8b60735`.

**Concern:** Hardware/cargo conserved, but sizing and separate capsule load relationship are compressed; some fixture strips clipped.

**Action or decision:** Keep every cart/docking recipe and all six capsule slots, including unnamed Shock mount. Update the packing popup to explain matched platform/strap, any-order fitting and transfer of the same removable capsule from ground restraint to flight dock. Add an earned Specimen transport cart wonder saying the cart stays on the ground; combine popup with archive-device-role if selected.

**Alternatives and limits:** Do not restore shell identities, mount-first ordering, dimensions/load calculations or inferred old component strips.

**Checks:** Preserve all capsule cargo prerequisites and separate Family record goal; retain capsule preservation on cart and consumption into Loaded capsule dock. Test mount-first/cargo-first, nested case contents, early docking/future protection and retained capsule display. Inspect six-slot wrapping/full labels at 390px and narrower; ask what leaves the ground.

**Evidence limits:** Compatibility is a fictional premise, not engineering qualification. Earlier strip clipping is unverified in Markdown; the proposal research supplied no layout, lint or playtest evidence. No goal rewrite or new needs.

Passages: [mars:844–879](../stories/mars/story.md#L844-L879), [mars:881–906](../stories/mars/story.md#L881-L906), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

## Optional improvements

### AF-porridge-water Treat the cooking water cue as optional

**Optional · Elements · original P2.** Cases: `Q552b8b6ab5e0`.

**Concern:** Inset pot is in the openable Stove reader, but essential water is supplied only by authored kitchen context.

**Action or decision:** Keep both Grain-with-Stove/Cooking pot routes, goals and fates. Preferred disposition is optional rather than required; existing ordinary kitchen context can suffice.

**Alternatives and limits:** If useful, add only displayed meal-popup cue ‘with water at hand for cooking’. Keeping shorter popup is reasonable; no Water drag, hydration intermediate or pot-filling goal.

**Checks:** Verify unchanged graph, Grain transformations, reusable tools, porridge/compote conjunction and consumed Feast into transforming Tiled table. Check both routes and player need for cue; early global discovery can precede popup.

**Evidence limits:** Old openable Stove reader absent; inset pot exists only in author note and is not visible evidence. Source-internal editorial judgment, not physical impossibility or food-safety claim. Adds no finished water jar, needs or slots and must not make foods permanently reusable.

Passages: [elements:691–721](../stories/elements/story.md#L691-L721).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-seed-press Keep the craft and optionally expose the press mechanism

**Optional · Elements · original P2.** Cases: `N4a4066eaaa19`.

**Concern:** Optional output reader supplies lever/draining bed; exact load path, confinement and preparation are not demonstrated.

**Action or decision:** Keep Millstone [consume] + Planks [consume] → Weighted seed press and transforming seeds + explicitly preserved press → Seed oil; ordinary weight/structure fabrication is coherent.

**Alternatives and limits:** Optionally add earned press wonder: planks form lever/draining bed; millstone provides weight; prepared seeds are squeezed and oil drains. No new lever, fulcrum or preparation ingredients.

**Checks:** Coordinate upstream AF-millstone-wheel-role; preserve construction consumption, seed transformation and ordinary result rather than declared internal compound. Check grain-mill-first/press-first needs and planting, wick, soap, lantern continuations; test whether input roles become clearer or popup interrupts.

**Evidence limits:** Existing mechanism is author-only NOTE. FAO supports traditional stones/levers and material-specific preparation, not exact pressure, load path, yield or safety. Optional cue is not new P1 demand or validated full assembly.

Passages: [elements:125–162](../stories/elements/story.md#L125-L162).

Research: [fao.org](https://www.fao.org/4/X5043E/x5043E03.htm).

### AF-avicenna-distinction Contingency already distinguished

**Optional · Ideas · original P2.** Cases: `Q786b57d142ca`.

**Concern:** Current label loses the contingency-versus-dependence distinction.

**Action or decision:** Keep recipes, labels and fates: current ‘Avicenna: contingent existence’ already differs from ‘A contingent thing depends on another’, and result is attributed/proposed. No required recipe repair.

**Alternatives and limits:** Optional earned first-wonder polish: what a contingent thing is does not make existence necessary; possible existence in itself precedes asking what accounts for existence. Avoid unrestricted alternate-history phrasing.

**Checks:** Keep Arabic natural-philosophy/essence-existence inputs, all explicit preservation and necessary-source chapter goal/later Reason and faith comparison. Verify unchanged references, needs/skips; test distinction between modal contingency and causal principle without assuming primitive readers.

**Evidence limits:** Primary selections are abridged English Marmura/McGinnis-Reisman translations, not checked Arabic critical text or full argument; SEP corroborates. Technical wording may remain difficult. Already substantially resolved, not an uncontested deduction from two tiles.

Passages: [ideas:789–829](../stories/ideas/story.md#L789-L829), [ideas:1108–1109](../stories/ideas/story.md#L1108-L1109).

Research: [wmit-pages-prod.s3.amazonaws.com](https://wmit-pages-prod.s3.amazonaws.com/wp-content/uploads/sites/283/2022/06/12145806/avicenna1.pdf); [plato.stanford.edu](https://plato.stanford.edu/entries/ibn-sina-metaphysics/).

### AF-automatic-writing Give the dream-reading input a visible role

**Optional · Ideas · original P2.** Cases: `Q1b95db276816`.

**Concern:** Output substantially repeats word-association input; artistic use of Freud is hidden.

**Action or decision:** Keep all names, goals and rules. Optional earned-writing wonder clarifies complementary roles: Breton takes inspiration from Freud’s dreams/hidden wishes; associations supply writing practice without planned outline. Explicitly artistic Surrealist experiment, not diagnosis or proof of Freud.

**Alternatives and limits:** Existing popup/wonder already distinguish purposes; retain unchanged if extra exposition proves unnecessary. No extra intermediate or demanded deduction.

**Checks:** Both writing inputs stay explicitly preserved; result only serves this chapter’s goal. Coordinate AF-james-freud retaining identical supplied dream interpretation identity; verify references/fates and ask players what each ingredient contributes.

**Evidence limits:** Substantially addressed baseline, not mandatory. Breton English text attributed to Seaver/Lane 1969, not checked French facsimile; supports inspiration/adaptation, not Freud’s endorsement. Optional earned cue does not change names, ancestry or future protection.

Passages: [ideas:2946–2995](../stories/ideas/story.md#L2946-L2995).

Research: [theanarchistlibrary.org](https://theanarchistlibrary.org/library/andre-breton-manifesto-of-surrealism).

### AF-lamarck-label Keep Lamarck visible in the later comparison

**Optional · Ideas · original P2.** Cases: `Q2fbdfccf4b82`.

**Concern:** Mechanisms are earned but the visible comparison loses their identities.

**Action or decision:** Optional progression alias: retain base ‘Species can have changing histories’, displayed from Descent and inheritance as ‘Lamarck: acquired changes can pass to descendants’. Keep existing wonder and four base-name occurrences; alias changes recognition, not identity.

**Alternatives and limits:** Consider final-wonder qualification that mechanisms are not mutually exclusive complete theories: Darwin accepted inherited use/disuse effects too. Do not rename shared-descent item as exclusive to one author.

**Checks:** Retain explicit preservation in comparison, default shared-descent reuse in branching narrative, separate heredity/Mendel-DNA chain and goals. Check alias recipe/goal identity, retrospective scrolling and long-label layout; test mechanism recall without mutually exclusive textbook camps.

**Evidence limits:** Historical explanation already earned; only later label recognition remains. Lamarck accessed via Johnston English, not French facsimile; Darwin 1859 supports qualification. No new recipes, supplies, slots or prerequisite changes.

Passages: [ideas:2431–2568](../stories/ideas/story.md#L2431-L2568), [current specification](story-format-spec.md).

Research: [web.viu.ca](https://web.viu.ca/johnstoi/lamarck/lamarck7.htm); [darwin-online.org.uk](https://darwin-online.org.uk/converted/published/1859_Origin_F373/1859_Origin_F373.html).

### AF-longitude-method-labels Distinguish a method from a plotted voyage

**Optional · Ideas · original P2.** Cases: `Q3ff11d477535`, `Q45fa7a52c71e`, `Q51a704d5b496`.

**Concern:** Lunar reference and longitude-marked-route labels blur method versus an observed plotted voyage.

**Action or decision:** Keep the current mechanics. If taking this optional wording pass, globally rename Reference time read from the Moon to A lunar method for finding reference time and A sea route marked with longitude to A sea-route sketch using longitude. Explain that the sketch is not plotted voyage readings and still needs latitude; change the popup to sketching longitude’s role.

**Alternatives and limits:** Keeping current wording is defensible; do not introduce numerical gates or a simulated voyage.

**Checks:** Update all seven references; preserve both route alternatives, fates, lunar clear-sky qualification, H4 evidence and later exchange payoff. Coordinate calendar-clock and bearing-chart rewires once. Test distinction among method, sketch, sea-trial evidence and complete position.

**Evidence limits:** USNO supports lunar-distance almanac use, not readings taken by this player. The cited Smithsonian account was not independently verified or relied upon. Principally editorial; no validation performed.

Passages: [ideas:1846–1956](../stories/ideas/story.md#L1846-L1956).

Research: [aa.usno.navy.mil](https://aa.usno.navy.mil/publications/na_history).

### AF-plato-hermes Renaissance interpretation is now explained

**Optional · Ideas · original P2.** Cases: `Q189b82889e7f`.

**Concern:** Visible dating task does not link Plato and Hermes to a shared ancient-wisdom claim.

**Action or decision:** Keep all recipes, goals, names and wonders. Optionally add one displayed Dating desk sentence attributing to some Renaissance readers the treatment of Plato and writings attributed to Hermes as witnesses to one ancient wisdom. The existing earned result already presents an attributed claim rather than established primordial truth.

**Alternatives and limits:** Keep as-is; do not add a premise to force deductive proof or impose reconstruct-then-date order.

**Checks:** Preserve the direct Hermes-plus-language route, global Plato identity, the claim’s explicit preserve, and the c.1450–1614 frame accommodating Casaubon. Check popup rendering and unchanged needs; ask whether players distinguish historical reconstruction from endorsement and redating from refuting all contents.

**Evidence limits:** Ficino’s preface was inspected only in the translation reproduced by SEP, not a complete Latin edition. No particular Greek anachronism was independently checked. Prose option changes no progression; tests remain prospective.

Passages: [ideas:1215–1246](../stories/ideas/story.md#L1215-L1246).

Research: [plato.stanford.edu](https://plato.stanford.edu/entries/ficino/#AnciTheo).

### AF-protection-purpose Keep the now explicit Hobbes purpose framing

**Optional · Ideas · original P2.** Cases: `Ne232c157b527`.

**Concern:** Result gives political purpose, not a full distributive answer about who benefits.

**Action or decision:** Keep the existing Hobbes recipe, purpose intermediate, names, goals and fates: the migrated label already says protection is a purpose of common power. If sharpening the wonder, attribute protection from invasion and mutual violence to Hobbes and clarify that subjects’ security is not a full account of how all governmental benefits are distributed.

**Alternatives and limits:** Keep the current wonder; extra qualification could make an already-clear chapter pedantic.

**Checks:** Preserve purpose → authorization → limits; keep the purpose intermediate explicitly preserved. Keep the interest-judgment need and authorized power available for loss-of-protection and Locke comparisons. Test distinction between Hobbes’s stated purpose and empirical claims about every ruler.

**Evidence limits:** Leviathan XVII/XXI in an accessible English transcription supports the attributed argument and protection/obedience link, not equal distribution or universal success. Concern is already resolved; no required repair or tested improvement is asserted.

Passages: [ideas:1759–1805](../stories/ideas/story.md#L1759-L1805).

Research: [gutenberg.org](https://www.gutenberg.org/files/3207/3207-h/3207-h.htm).

### AF-spherical-model Keep the investigation, clarify the model label optionally

**Optional · Ideas · original P2.** Cases: `Qfa5dd7c583a1`.

**Concern:** Model-building is coherent; generic proof language can overstate achieved result.

**Action or decision:** Keep all three recipes, both earned wonders and the existing investigation goal. Optionally rename A spherical Earth to A spherical model of Earth at its declaration, producer and downstream use so a skimmed label matches the already-qualified wonder. Do not turn the general geometric-proof item into an Earth-specific proof.

**Alternatives and limits:** Keeping current wording is acceptable. Do not add a numerical circumference answer or measurement exercise.

**Checks:** Preserve all fates and the investigation → comparable-positions route supporting bearings, longitude, continental comparison and map usefulness. Coordinate bearing-chart; verify the three names and Printing table’s general-proof dependency. Test supported model versus completed measurement and entry/skip behavior.

**Evidence limits:** Euclid supports starting points/propositions, not an Earth-shape theorem. NOAA is a modern teaching account linking angles and distance, not ancient primary evidence. The original concern is substantially resolved; no validation has occurred.

Passages: [ideas:551–590](../stories/ideas/story.md#L551-L590), [ideas:314–352](../stories/ideas/story.md#L314-L352), [ideas:1124–1162](../stories/ideas/story.md#L1124-L1162), [ideas:1298–1335](../stories/ideas/story.md#L1298-L1335).

Research: [mathcs.clarku.edu](https://mathcs.clarku.edu/~djoyce/elements/bookI/bookI.html); [noaa.gov](https://www.noaa.gov/jetstream/global/learning-lesson-shadow-knows-i).

### AF-connected-drip-line Name the hookup, not a new kind of line

**Optional · Mars · original P2.** Cases: `Q0e0c9d1b4665`.

**Concern:** Authored tank supply is explicit; operation is a hookup, not creation of a separate type of line.

**Action or decision:** Optionally rename Irrigation line to Connected drip line in its two existing rules, keeping the hookup from Drip line plus Camp water system and its subsequent use watering planted potatoes. The current water supply is explicitly established in earned and displayed prose; this names the accomplishment rather than repairing a missing mechanism.

**Alternatives and limits:** Keep current wording; do not add Water, pump actions, connector puzzles or plumbing simulation.

**Checks:** Preserve loose-line and potato transformations, explicit supply/line preservation, and one produced item with one matching use. Keep watered-bed implicit slot consumption and filled-greenhouse harvest/nursery continuity. Coordinate challenge-drip-water; ask whether hookup to existing supply is understood without a separate Water token.

**Evidence limits:** Source-internal readability proposal, not engineering certification or solvability repair. No goal, prerequisite, alias or exclusivity changes, and no promise of permanent visible internal plumbing. No linter or playtest result is claimed.

Passages: [mars:468–506](../stories/mars/story.md#L468-L506), [mars:433–466](../stories/mars/story.md#L433-L466), [current specification](story-format-spec.md), [mars:508–538](../stories/mars/story.md#L508-L538).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-expedition-map Keep the regional identity visible

**Optional · Mars · original P2.** Cases: `Q1e271fc6c15a`, `Qd948b9bb2ec0`.

**Concern:** Route to outcrop is used with terrain model when travelling onward to depot.

**Action or decision:** Keep current physical navchip identity and mechanics. Optionally add only a progression alias on the existing Outcrop navchip declaration: from Lava-rim scout station display Regional navchip: outcrop route. Keep all five underlying identity references and current destination prose; migration already establishes regional coverage.

**Alternatives and limits:** Keep as-is if the longer tile or retroactive history relabeling adds more clutter than clarity. Do not restore old route objects or a contradictory relay reader.

**Checks:** Retain Crew navchip and Traverse map transformations, vehicle-slot consumption and any-order installation. Check alias resolves one identity and future needs protect the outcrop chip for later traverse; exercise relay-to-lava return and multiple fitting orders. Coordinate relay-reader and scout context.

**Evidence limits:** Source-internal clarity hypothesis, not evidence of missing destination, instant rescue or navigation failure. Alias adds no need or early supply. Future protection is specified, not an implemented invariant demonstrated here; checks have not run.

Passages: [mars:120–189](../stories/mars/story.md#L120-L189), [mars:247–275](../stories/mars/story.md#L247-L275), [mars:578–606](../stories/mars/story.md#L578-L606), [current specification](story-format-spec.md), [source passage](https://github.com/ljw1004/combination-challenge/blob/1e8567d343a36d8280f54cf5e6bc41a98b7fcd47/notes.md?plain=1#L470).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-cooking-pot-iron Give iron a visible role, optionally

**Optional · Elements · original P3.** Cases: `Qa9b0d08640bb`.

**Concern:** Iron-fitted ceramic cookware is plausible; output never identifies iron feature.

**Action or decision:** Keep current construction unless a handle is the intended fictional feature; then optionally rename Cooking pot to Iron-handled cooking pot in its producer and both hearth recipes. This gives consumed iron a visible role while retaining the already-fired glazed bowl and ordinary compressed fabrication.

**Alternatives and limits:** Keep current three rules if no handle is intended. Do not add an all-iron redesign, handle-crafting chore or a top-level pot declaration that would create a need on the stove alternative.

**Checks:** Preserve forming/glazing/firing, both cooking alternatives, conjunctive dishes goal and Feast table progression. Check all three references, unchanged fates and future bowl-to-lamp/iron-to-tripod needs. Coordinate porridge-water independently; leave jar/glaze decisions untouched.

**Evidence limits:** Fictional authored cookware, not proof arbitrary glaze tolerates direct heat or food contact, nor a documented historical vessel. Longer label may clutter. Source-internal optional choice, not material certification or tested improvement.

Passages: [elements:691–721](../stories/elements/story.md#L691-L721), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-supported-garden Support without assuming a climbing species

**Optional · Elements · original P3.** Cases: `Q9f3717e2d442`.

**Concern:** Oil-bearing seedlings are neither shown suitable nor unsuitable for upward training. Prior rope-trellis step supplies intent.

**Action or decision:** Optionally rename Climbing garden to Supported garden in its goal, producer and irrigation use. Add an earned description that young plants stand beside the trellis with stems tied where support is needed. Keep broad Plant and Seedlings identities rather than inventing a climbing species-selection task.

**Alternatives and limits:** Current support intent is already supplied by popup/trellis construction; do not add growing stages, species puzzles or a botanical simulation.

**Checks:** Preserve both garden goals, four primitives, oil-seed branch and parallel greenhouse route. Keep seedling reuse for trellis and consumption into garden/greenhouse. Verify three renames, both completion orders, irrigation carry-forward, future-goal protection and early-completion/skip behavior; ask whether support is intelligible without selection.

**Evidence limits:** Optional wording, not a demonstrated biological error: plants are neither established suitable nor unsuitable for upward training. New item listing repeats a goal need, not a primitive. No claim of visible internal plants or executed checks.

Passages: [elements:337–351](../stories/elements/story.md#L337-L351), [elements:353–374](../stories/elements/story.md#L353-L374).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-plant-starter Keep the storybook growth shortcut

**Optional · Elements · original P3.** Cases: `Qf8a937d24eca`.

**Concern:** Vegetated orchard and storybook framing make growth shorthand reasonable despite absent starter lineage.

**Action or decision:** Keep Earth + Rain -> Plant and all recipes. Optional first earned-wonder sentence: “Here, Earth and Rain are a storybook shortcut for growth in a living garden.” Retain the existing explanation of harvested food, fibres, seeds and wood.

**Alternatives and limits:** Keeping current text is reasonable; do not add a Seed primitive or starter-production chore.

**Checks:** Keep Plant broad, default-preserved in all nine outputs, and retain four primitives and every fate. Oil-bearing seeds already depend on Plant/Fruit, so cannot repair an earlier starter without circularity. Coordinate AF-grain-air without cereal-renaming Plant; test early wonder delivery and broad-supply comprehension.

**Evidence limits:** Source-internal genre judgment, not an established biological defect. The menu already promises storybook elements; the author-only alchemy note is not displayed. Extra explanation may be redundant; no checks were run.

Passages: [elements:30–58](../stories/elements/story.md#L30-L58).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-millstone-wheel-role Decide whether the wheel is a guide

**Optional · Elements · original P3.** Cases: `Q1beaedf676d5`.

**Concern:** Wooden wheel is marked incorporated while result describes a stone grinding disk.

**Action or decision:** Optionally explain in the existing Wheel wonder that its circular outline guides shaping a stone disc without becoming part of it; change only Wheel fate in Stone [consume] + Wheel -> Millstone to default preserve.

**Alternatives and limits:** Keep present ambiguity instead; do not invent a wooden grinding assembly or add a Millstone popup/need.

**Checks:** Keep both Millstone-consuming routes into Grain mill and Weighted seed press, names, goals and other fates. Coordinate AF-seed-press. Check mill-first/press-first, pottery, irrigation and clock continuations; distinguish reusable guide from incorporated component, with needs-based carry-forward.

**Evidence limits:** This is a proposed storybook explanation, not a historical millwright claim. Baseline has no Millstone wonder or wheel-template claim; consumption does not prove disappearance under need protection. Ordinary results expose no internal components. No implementation or playtest occurred.

Passages: [elements:100–162](../stories/elements/story.md#L100-L162), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-greek-manuscript Make the shared Aristotle corpus explicit, optionally

**Optional · Ideas · original P3.** Cases: `Q7908d4d84b7a`.

**Concern:** Focused translation scene already makes shared text inferable.

**Action or decision:** Optionally insert “of Aristotle” into “A Greek manuscript brought by Byzantine scholars” at its item listing and sole recipe reference; keep the manuscript/comparison wonders and second comparison rule unchanged.

**Alternatives and limits:** Keep current wording: the popup and “same passage” explanation already support comparison. Do not invent a shelfmark, translator, date or direct lineage to the earlier Latin version.

**Checks:** Rename both global occurrences atomically; preserve the Greek manuscript and parallel-version/translation-choice annotations. Confirm the existing Latin item carries forward, no second manuscript is created, and the translation-choice goal/needs graph remains unchanged; test same-text understanding.

**Evidence limits:** Source-internal clarity improvement, not evidence of a specific historical manuscript pairing or meeting. No slots, new primitives, goal alternatives or skip changes are proposed; longer wording may clutter the label. Checks remain unexecuted.

Passages: [ideas:1172–1213](../stories/ideas/story.md#L1172-L1213), [ideas:986–1021](../stories/ideas/story.md#L986-L1021).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-jaipur-wording Compare particular instruments, not regions

**Optional · Ideas · original P3.** Cases: `Q6358940e7819`.

**Concern:** Educational comparison accepted within setting.

**Action or decision:** Optionally rewrite only the earned masonry-plan wonder: Jaipur’s fixed masonry instruments measure celestial positions unaided and refine tables; the earlier portable lens telescope magnifies distant objects. Explicitly compare designs, not whole regions.

**Alternatives and limits:** Keep the satisfactory existing comparison unchanged; do not add a telescope reagent or accuracy hierarchy.

**Checks:** Keep both recipes, every item name, preserved inputs and observatory-usefulness goal unchanged. Mentioning the earlier telescope is prose, not a carry-forward need; leave longitude/provisions branches alone. Test whether players describe particular instruments rather than Europe-versus-India.

**Evidence limits:** UNESCO supports masonry/naked-eye/table work. Museo Galileo supports the documented small lens telescope; portability is an inference from size/construction. Neither establishes an accuracy ranking or direct transmission to Jai Singh. Telescopes can measure angles too; avoid appearance-only claims. Future checks are unexecuted.

Passages: [ideas:1916–1956](../stories/ideas/story.md#L1916-L1956), [ideas:1343–1403](../stories/ideas/story.md#L1343-L1403).

Research: [whc.unesco.org](https://whc.unesco.org/en/list/1338); [catalogue.museogalileo.it](https://catalogue.museogalileo.it/object/GalileosTelescope_n01.html); [catalogue.museogalileo.it](https://catalogue.museogalileo.it/multimedia/TelescopeBis.html).

### AF-greenhouse-repair Make the damaged seam visible in the item label

**Optional · Mars · original P3.** Cases: `Q6b5098b1cd76`.

**Concern:** Actual fabric/sealant lineage is sound and cache describes damaged seam.

**Action or decision:** Optionally rename Greenhouse shell to Greenhouse with torn seam at its listing and repair rule only; retain usable Greenhouse output, existing arrival cue, four slots, crop goal and nursery continuation.

**Alternatives and limits:** Keeping current wording is defensible: the popup already describes damaged seam and patch kit. If AF-shelter-seam selects Patch supplies, rename all four Pressure patch occurrences together; do not independently rename the repaired output.

**Checks:** Preserve mixed patch fates and review future-needs protection, not blanket preservation. Check both damaged-input references and atomic stock rename; retain installed potatoes/light/fan and later diffuser/camp-nursery reuse. Test repair recognition and label length.

**Evidence limits:** Source-internal usability proposal, weaker than the shelter card; no missing ingredient or duplicated material is demonstrated. Not pressure-vessel repair advice. Actual stock retention and interface clarity were not tested.

Passages: [mars:468–506](../stories/mars/story.md#L468-L506), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-scout-reader Scout assembly history and persistent state

**Optional · Mars · original P3 (optional wording).** Cases: `Q7f78530c6a86`, `Qb8121356eb79`, `Qd2f49cc23d7d`.

**Concern:** Historical removal statement is literally true, not a hard instruction to reinstall fitted components.

**Action or decision:** Keep the arrival paragraph and recipes. If useful, add only a base Scout wonder under its battery slot: “The rotor assembly is now part of the scout. Its battery has a separate slot.”

**Alternatives and limits:** Keep current text unchanged; no charger requirement, flight-certification puzzle, rotor-refitting step or permanent missing-parts warning.

**Checks:** Wonder must remain true before/after battery installation. Preserve observation → Terrain model → Traverse map → Marked traverse → Crawler slot chain and existing Crawler fittings. Check panorama single-use annotation, Outcrop navchip future protection, Terrain model carry-forward and whether players actually attempt refitting.

**Evidence limits:** Historical “were packed separately” is chapter-entry text, not a stale recurring reader. The battery slot already resolves the mechanical concern; Scout battery is separate from shared charger supplies. Source-internal assessment of pinned Markdown only, not old-edition clearance or flight engineering. Extra popup may be unnecessary; checks were not run.

Passages: [mars:578–606](../stories/mars/story.md#L578-L606), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

## Investigations

### AF-depot-card-overlap Keep the route task; defer layout judgment

**Investigate · Mars · original P2.** Cases: `Qefc1338e3bb9`.

**Concern:** One browser test-state overlap prevented direct initial inspection. An ordinary visible-card drag exposed the covered input and normal reader access succeeded.

**Action or decision:** Make no independent Markdown edit. Retain route evidence, marker/comparison task and sign/shuttle payoff; assess actual rendered final labels/inventory later. Coordinate identifier and direct-photograph/survey proposals without preserving obsolete wording or deleting evidence to fix an assumed layout.

**Alternatives and limits:** Do not invent coordinates, shorten labels to an assumed width, split the chapter or remove required clues before current rendered evidence.

**Checks:** Inspect chapter entry and both-input state at narrow/wide and touch sizes, legibility, selection, reader opening/reopening and normal recovery. Distinguish repositioning from combining. Check coordinated names/fates and controller/platform slots; retain shuttle oxygen/transport chain. If wind simplification is chosen, remove weather need only.

**Evidence limits:** One older browser-state overlap was recoverable by ordinary drag; it proved neither recurring inaccessibility nor a successful combine. Current Markdown has no rendered-geometry evidence. Lint cannot substitute for layout inspection, and migration alone does not clear the issue.

Passages: [mars:711–745](../stories/mars/story.md#L711-L745), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-lyon-opposition-source Separate authority claims from demonstrated opposition

**Investigate · Divinity · original hold.** Cases: `Qb9fa6ab95df2`.

**Concern:** Playable comparison has explicit Lyon referent; current disagreement about what God appointed is stronger than earlier differing authority claims.

**Action or decision:** Keep HOLD. Optional conservative rewrite of stable rites-different label: “Both rites use bodies; that does not settle their authority claims.” Earned text should attribute Lyon’s apostolic hands and Aquinas’s divinely appointed water rite, without asserting direct debate or proved exclusion.

**Alternatives and limits:** Do not restore stronger mutual opposition before checking reliable translation; retain approved apostolic intermediate and separate Lyon from Book of Two Principles cosmology.

**Checks:** Keep instrumental-baptism + hands-and-book recipe, next goal, identifiers and preserved fates; do not collapse earned comparison into an owned input. Check downstream Eucharist/Luther/Calvin needs and skimming-player attribution.

**Evidence limits:** Only indexed Harris Occitan IV.3–18 excerpts were inspected, not complete edition or independent scholarly translation. They support hands, Gospel warrants and apostolic claims, not demonstrated rejection of Aquinas’s water rite. Aquinas establishes his own account only; direct route bypasses apostolic explanation. Checks unexecuted.

Passages: [divinity:363–510](../stories/divinity/story.md#L363-L510).

Research: [rialto.unina.it](https://www.rialto.unina.it/prosa_religiosa/cathrit/); [newadvent.org](https://www.newadvent.org/summa/4062.htm).

### AF-glass-slide-role Keep the backing board; cue only if needed

**Investigate · Elements · original hold.** Cases: `Q3c9965910f4d`.

**Concern:** Source supports legitimate shaping/support operation; ordinary first-earned feedback was not captured.

**Action or decision:** Keep recipes, names, goal and fates. Only if observation shows confusion, extend the displayed millpond paragraph to say planks act as backing while glass is shaped, conditionally “If you prepare a separate glass slide.”

**Alternatives and limits:** Do not make Glass slide compulsory, add workshop components or a top-level slide solely for a wonder; retain direct Pond water + Glass -> Pond slide route.

**Checks:** Keep Planks reusable, Glass/Glass slide transformed, Pond water consumed and microscope/pond slide preserved for study. Verify both sample routes still reach the goal without changed needs; test board-role understanding and that the cue does not imply compulsory planks.

**Evidence limits:** An author-only note supplies the support role, but no displayed slide explanation exists. This is a visibility gap, not observed player confusion or a proven manufacturing defect. Source-internal abstraction, not researched glass-working advice. A new top-level item could alter carry-in needs; future checks were not executed.

Passages: [elements:491–530](../stories/elements/story.md#L491-L530), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-saw-tool-capability Keep the metalworking question on hold

**Investigate · Elements · original hold.** Cases: `Qf13eb3ec4da5`.

**Concern:** Iron plus shaping tool has distinct material/tool roles and a useful saw result, but this particular tool’s metalworking capability is not established.

**Action or decision:** Retain HOLD and Iron [transform] + Carving tool -> Saw unchanged. First settle whether Carving tool is intended as a metal-capable workshop implement or wood-only tool.

**Alternatives and limits:** For metal-capable intent, consider a short earned description; for wood-only intent, review a suitable workshop route. Do not assert universal cutting powers, rename every use or impose a metallurgy chain.

**Checks:** Trace actual Saw → Hollow pipe → Water channel → Irrigation channel → Irrigated garden chain; no Gutter exists. Retain reusable Carving tool/Saw, shared Hollow pipe water-filter use, and unfinished-goal protection. Any new top-level wonder item may change needs; test metal/wood role comprehension.

**Evidence limits:** London Museum documents an iron-alloy cold chisel suitable for metal cutting, not this fictional tool’s capability, producer or complete saw manufacture. Wood uses neither prove nor disprove metalworking capability. No repair or validation is established; hidden notes cannot communicate intended capability.

Passages: [elements:243–285](../stories/elements/story.md#L243-L285), [elements:353–374](../stories/elements/story.md#L353-L374).

Research: [londonmuseum.org.uk](https://www.londonmuseum.org.uk/collections/v/object-281229/chisel-iron-cold-chisel/).

### AF-glaze-formulation Clarify the mixture without inventing a formula

**Investigate · Elements · original hold.** Cases: `Q49779f028615`.

**Concern:** Glaze may mean an unfired mixture; some natural clays glaze. Exact generic formulation is not established.

**Action or decision:** Retain material-specific HOLD. Optionally rename Glaze to Glaze mixture in its three rules and append a short displayed prepare/coating/fire cue; preserve jar/bowl identities and all fates.

**Alternatives and limits:** If AF-preserve-jar-stage is also chosen, use one integrated prepare → glaze/fire → fill jam → wooden-cover popup; do not insert that finished-jar cue alone. Do not add flux, later Kiln dependency, chemistry lecture or certify food safety.

**Checks:** Check all three names, four primitives, unchanged needs and no orphaned old Glaze. Keep jar, fired bowl and Glass branches separate; pickle/winter changes remain separately scoped. Test mixture versus fired ceramic/glass comprehension and popup length.

**Evidence limits:** CAMEO’s particular mineral-rich Albany clay refutes a universal added-flux requirement, not arbitrary sand/clay efficacy. V&A supports clay/kiln-specific testing and applied-glaze firing, not the unspecified formula. None certifies food contact, watertightness or cooking suitability; checks unexecuted.

Passages: [elements:186–220](../stories/elements/story.md#L186-L220), [elements:222–241](../stories/elements/story.md#L222-L241).

Research: [cameo.mfa.org](https://cameo.mfa.org/wiki/Albany_slip_clay); [vam.ac.uk](https://www.vam.ac.uk/articles/richard-batterham-methods-of-making); [vam.ac.uk](https://www.vam.ac.uk/articles/lucy-rie-british-studio-potter/).

### AF-sandy-impression-method Keep the material-specific hold

**Investigate · Mars · original hold.** Cases: `Qdc1bd591e34b`.

**Concern:** Shape-copying material and surface compose meaningfully, but dry contact impression assumes cohesion or a suitable substrate/method not specified.

**Action or decision:** Keep the impression-sheet transformation and narrow HOLD until a defensible substrate/method pairing exists. Do not invent a universally safe sheet, adhesive, solvent, consolidant or release procedure.

**Alternatives and limits:** Optional authored setting: ripple marks are preserved in rock rather than loose sand; this requires artwork alignment and does not clear the method HOLD.

**Checks:** Keep identifiers, goals, fates and slots: impression plus logged gravel fill the case; case and separate Sleeved comparison enter distinct Return capsule slots. Trace packing/final wrapping and distinguish copied surface from specimen; coordinate AF-mapped-sites-label without competing rewrites.

**Evidence limits:** Baseline says rippled surface/outcrops, not verified loose sand, dry pressing or nondestructive collection. NASA supports Martian rock ripples, not molding compatibility; NPS/AMNH require stable originals and compatible materials and warn of irreversible alteration. Earth guidance does not qualify a Mars-vacuum procedure. Checks unexecuted.

Passages: [mars:670–709](../stories/mars/story.md#L670-L709).

Research: [nasa.gov](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasas-curiosity-finds-surprise-clues-to-mars-watery-past/); [nps.gov](https://www.nps.gov/subjects/museums/upload/MHIII_Ch5_3DReproductions.pdf); [amnh.org](https://www.amnh.org/research/paleontology/vertebrate/fossil-preparation/studying/molding-casting).

## Keep decisions

### AF-oxygen-controller-reader Controller contradiction already removed

**Keep · Mars · original P1.** Cases: `Q6cb29c13a228`.

**Concern:** Effective source reader contradicts completed controller incorporation, even before later intake service.

**Action or decision:** Keep migrated Oxygen plant compound/intake slot and [Filtered intake]-gated completed wonder. Controller incorporation, intake installation and flight-module servicing are distinct; no reconnect instruction, second controller slot or missing-intake reader.

**Alternatives and limits:** Separately flag plant’s single-use omitted fate for explicit preservation without changing baseline default meaning.

**Checks:** Check before/after-intake reader timing, both service/test goals, shuttle future retention, oxygen-module servicing and cabin-slot carry-forward into ascent. Distinguish depot’s earlier controller from process controller; preserve wrapped stack/controller internals, implicit intake install and cabin test. Inspect history/skips.

**Evidence limits:** Original persistent-reader contradiction is absent. Source-internal inspection, not runtime observation or engineering certification; completed plant is not a carried cabin component and servicing does not prove whole-vehicle commissioning.

Passages: [mars:747–774](../stories/mars/story.md#L747-L774), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-relay-reader Keep the migrated relay because the stale reader is gone

**Keep · Mars · original P1.** Cases: `Qffa040bd7cc8`, `Qd724188f811c`.

**Concern:** Relay reader says antenna/powerpack are missing after they have been fitted.

**Action or decision:** Keep migrated Relay with antenna/power slots, fuse repair and recording requiring both installed. There is no persistent missing-components reader to repair. Retain simpler explicit construction, wrapped fuse/transceiver internals, and physical Outcrop navchip → Crew navchip → Rover chain.

**Alternatives and limits:** If later adding Relay wonder, use timeless wording or completion gating on Directional antenna and Relay powerpack, never persistent ‘needs an antenna’.

**Checks:** Exercise both slot orders and retained filled slots; recording preserves assembled Relay by default. Check equipped-Rover/recording goals and future Traverse map protection of shared Outcrop navchip; coordinate AF-expedition-map without old copy/containment assumptions.

**Evidence limits:** ‘Stored beside it’ is chapter-entry setup, not stale repeatable reader. No new partial-state objects needed; source inspection does not establish renderer behavior or tested runtime correctness.

Passages: [mars:247–275](../stories/mars/story.md#L247-L275).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-eclipse-scope Eclipse scope is already visible

**Keep · Ideas · original P3 (optional wording; weak, non-blocking concern).** Cases: `Q3c0489aebc3f`.

**Concern:** Underlying recording/pattern composition accepted.

**Action or decision:** Keep the archive/calendar -> Recurring eclipse seasons recipe and both earned qualifications, including “A watch, not a promised eclipse.” Do not add exact-date calculation or promise local visibility.

**Checks:** Keep pattern reuse in watch, portent, natural-cause and geared-sky rules and existing default preservation. Treat later planetary/lunar provenance separately under AF-planetary-record-provenance rather than broadening the eclipse archive; check names, needs and player understanding of local visibility.

**Evidence limits:** NASA supports recurring seasons versus geographically limited visibility, not a faithful reconstruction of a particular ancient prediction procedure. Existing player-facing wonders already state clouds/location limitations; remaining risk is skimming, not absent qualification. No names, goals, fates or slots change; runtime/comprehension checks were only proposed.

Passages: [ideas:19–71](../stories/ideas/story.md#L19-L71), [current specification](story-format-spec.md).

Research: [eclipse.gsfc.nasa.gov](https://eclipse.gsfc.nasa.gov/SEsaros/SEperiodicity.html); [science.nasa.gov](https://science.nasa.gov/moon/eclipses/).

### AF-telescope-payoff Keep the shared photograph for now

**Keep · Mars · original P3 (optional payoff improvement).** Cases: `Q1eb339b0e904`.

**Concern:** Ordinary field camera and elaborate telescope-camera branch create same result.

**Action or decision:** Keep Camera, Field camera and explicitly preserved Telescope camera alternatives producing the same Cliff photograph, with existing goals. Reopen only if play observation supports a useful authored distant detail.

**Alternatives and limits:** Do not add an empty close-up label, require both photos, substitute a distant cliff view for sampled-core evidence, or add stock/preservation machinery.

**Checks:** Cliff photograph is top-level, not a goal; its producers affect chapter-needs expansion. Trace three Tripod uses and outcrop needs before any output rename. Preserve field-camera downstream route, nursery, basin and depot uses; test beacon-first/telescope-first protection and whether telescope builders expect a distinct discovery.

**Evidence limits:** The optional branch still has modest payoff, but this is a design preference, not demonstrated inauthenticity. No telescope-specific detail or downstream Cliff photograph use is authored. Assemblies expose no recoverable parts. No optical-performance claim or executed validation supports a mandatory change.

Passages: [mars:120–168](../stories/mars/story.md#L120-L168), [mars:170–212](../stories/mars/story.md#L170-L212).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-radio-power-wording Reusable charger, transformed radio

**Keep · Mars · original P3 (optional upstream wording).** Cases: `Q3ae568ead70f`.

**Concern:** Long-range dish step is coherent; predecessor wording can imply physically fitting the charger rather than recharging a battery.

**Action or decision:** Keep Radio [transform] + Solar charger -> Solar radio and Solar radio [transform] + Dish antenna [consume] -> Long range radio, names, goals and fates unchanged.

**Alternatives and limits:** Only later observed misunderstanding could justify brief displayed clarification; do not add a recharge step, circuitry/battery-slot puzzle or permanent radio preservation.

**Checks:** Keep reusable charging distinct from implicit charger consumption in rover/weather slots; review shared melt-station, lamp and grow-light needs. Exercise both initial signals through later radio/message/ranging uses. Do not add Long range radio to latched contact-goal alternatives, which could pull later equipment forward.

**Evidence limits:** The offending predecessor fitting wording is absent from current popup/recipes. Default charger preservation and radio transformation are coherent abstractions; internals are unmodelled. Source-internal assessment, not hardware proof or runtime result. No new aliases, slots, supplies or carry-forward requirements are proposed; mixed-fate/comprehension checks remain future work.

Passages: [mars:35–43](../stories/mars/story.md#L35-L43), [mars:136–168](../stories/mars/story.md#L136-L168).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-stone-genre-boundary Keep the storybook foundation

**Keep · Elements · original HOLD.** Cases: `Qe23c237a3bf0`.

**Concern:** Visible classical quartet supports symbolic transformation; soil plus fire does not literally produce geological stone. Adjacent realistic clay/brick craft makes the genre boundary genuinely ambiguous.

**Action or decision:** Keep Earth + Fire -> Stone and existing goals, names and fates. Preserve the menu’s “four storybook elements” genre cue rather than literalizing the symbolic opening.

**Alternatives and limits:** Do not rename Stone to Brick, add an opening quarry producer or repeat disclaimers in every craft.

**Checks:** Preserve Stone’s thirteen tool/component uses and mixed fates, including late clock/exhibition needs; no blanket preservation or nested Stone slot. Coordinate AF-plant-starter and AF-grain-air without seed chores or duplicate genre warnings; test whether players distinguish storybook Stone from adjacent fired Brick.

**Evidence limits:** The original HOLD remains a conditional genre qualification, not demonstrated physical repair. Player-visible menu supports abstraction; author-only alchemy detail does not prove reader awareness. This is not literal geological authenticity or proven comprehension. No external geological claim is made, and mixed-fate/late-needs/play checks remain unexecuted.

Passages: [elements:1–28](../stories/elements/story.md#L1-L28), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-challenge-two-sources Let the historical writer own the necessity

**Keep · Divinity · original not a required fix.** Cases: `Q2811223ade67`.

**Concern:** Visible Book of Two Principles writer explicitly advances this argument. Mixed/neutral logical alternatives alone do not establish a gameplay flaw.

**Action or decision:** Keep both routes to “Two Principles: good and evil must have opposed sources,” their attributed explanations and comparison with Augustine unchanged.

**Alternatives and limits:** Do not pre-supply opposed sources as an answer-shaped input, require complete deduction or weaken the historical writer’s “must” merely because rival philosophies exist.

**Checks:** Preserve the visible Augustine alias, both routes, reusable result in Augustine/Aquinas comparisons and explicit origins-dispute preservation into Lyon. Keep Lyon ritual distinct from Two Principles cosmology; test attribution with primitive wonders unread/earned wonders skimmed and preserve existing skip text.

**Evidence limits:** CUHK’s Wakefield/Evans English selections I.2/I.13 support what this writer argues, not logical exclusion of all neutral/mixed alternatives. No full critical edition, manuscript or separate Gnosis transcription was inspected. Source ownership is already visible in labels/popup. No goal, needs, fate or slot change is proposed; checks remain future.

Passages: [divinity:160–226](../stories/divinity/story.md#L160-L226).

Research: [cuhk.edu.hk](https://www.cuhk.edu.hk/crs/tobias/primary_docs_ch11.html).

### AF-challenge-clockwork Keep the useful clockwork

**Keep · Elements · original not a required fix.** Cases: `Qa0a4ffdd74de`.

**Concern:** iconic complementary components can be coupled by the action; no unused input or affirmative contradiction.

**Action or decision:** Keep Stone/Rope -> Pendulum, Pendulum/Wooden gear -> Clockwork, Clockwork/Planks -> Clock and preserved Clock/Paper -> departure schedule, with existing fates and explanations.

**Alternatives and limits:** Do not add axle/fastener checklists, mandatory escapement subchain, or replace the schedule goal with already-owned Clock.

**Checks:** Check shared Wooden gear needs after earlier mill work, mill-first/early-clock orders and later Paper needs. Trace schedule needs through absent Clock producers; preserve standalone Hourglass branch, wrapped internal parts and needs-based carry-forward. Test early schedule completion/skip and understanding of clock versus written schedule.

**Evidence limits:** Science Museum supports pendulum/clock coupling, not sufficiency or reproducibility of this literal wooden two-object recipe. Author-only note compresses power/gearing/escapement; displayed popup, Clock wonder and schedule provide purpose. Editorial craft abstraction leaves physical reproducibility unverified; no linter/playtest result is claimed.

Passages: [elements:758–786](../stories/elements/story.md#L758-L786), [elements:125–162](../stories/elements/story.md#L125-L162), [current specification](story-format-spec.md).

Research: [collection.sciencemuseumgroup.org.uk](https://collection.sciencemuseumgroup.org.uk/objects/co8593065/model-of-a-pendulum-clock-based-on-galileos-design).

### AF-challenge-climate Keep the climate synthesis

**Keep · Ideas · original not a required fix (challenged or withdrawn).** Cases: `Q64f9e5f4f02c`.

**Concern:** Visible human fossil-fuel chain, CO2 heat-loss mechanism and record supply meaningful roles. A full attribution study is not needed for this teaching synthesis.

**Action or decision:** Keep preserved warming-pressure + instrumental-records -> “Human activity drives the recent warming,” with emissions/physics intermediates and uncertainty/other-influences qualifications.

**Alternatives and limits:** Do not add mandatory natural-forcing, isotope, model-comparison or statistical-proof gates. AF-infrared-bridge is a separate short clarity proposal, not a condition on keeping the synthesis.

**Checks:** Check earlier industry/electromagnetic item carry-forward, exact global names, three local primitives and all eight preserve positions. No slots, later ancient-air supply or new skip condition; test emissions/mechanism/observations distinction and intended popup/wonder delivery.

**Evidence limits:** NASA supports fossil-fuel CO₂, greenhouse heat-loss mechanism, human attribution and multi-system long-term records. The game is a teaching synthesis, not an executed attribution study or exhaustive method. Neither ingredient is an unexplained correlation. The final result has no later use; runtime and player-comprehension checks were only planned.

Passages: [ideas:3617–3661](../stories/ideas/story.md#L3617-L3661).

Research: [science.nasa.gov](https://science.nasa.gov/climate-change/causes/); [science.nasa.gov](https://science.nasa.gov/climate-change/evidence/).

### AF-challenge-ockham Keep the nominalist comparison

**Keep · Ideas · original not a required fix.** Cases: `Q46d0cfee00a2`.

**Concern:** Visible scene already asks real common nature versus conceptual unity; attributed rival interpretation is intelligible. Requiring full nominalist proposal first risks redundancy.

**Action or decision:** Keep Aristotle’s particular-form account + shared-name observation -> “Common concepts, not a shared thing outside the mind,” parallel realist branch and joint rival-accounts comparison.

**Alternatives and limits:** Do not add a complete nominalist answer as ingredient or turn the separate explanation-economy goal into proof nominalism wins.

**Checks:** Preserve both reusable inputs, local comparison and much later Relations/institutions reuse of nominalist result; retain realist single-use preserve. Check global identities, fates, carry-forward, early discovery/skip visibility and that players construct a rival account rather than infer Aristotle endorsed nominalism.

**Evidence limits:** The current output is generic, not Ockham-labelled; an author-only bibliography is not visible attribution. The scene already asks real common nature versus concepts/names. Source-internal judgment, not new historical attribution or unique deductive consequence. No compounds, names, goals, needs or fates change; planned tests remain unexecuted.

Passages: [ideas:1029–1070](../stories/ideas/story.md#L1029-L1070).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-challenge-drip-water Authored water supply is explicit

**Keep · Mars · original not a required fix.** Cases: `Q0e0c9d1b4665`.

**Concern:** No demonstrated missing water mechanism; keep narrower Connected drip line recommendation.

**Action or decision:** Keep Drip line [transform] + Camp water system [preserve] -> Irrigation line and Planted potatoes [transform] + Irrigation line [preserve] -> Watered potatoes. Existing displayed supply explanation is sufficient.

**Alternatives and limits:** AF-connected-drip-line may optionally rename Irrigation line to Connected drip line in both rules; do not add Water token, plumbing gate or watering goal.

**Checks:** Trace filtered water/primed loop and process-water reserve into Camp water system, then watered-bed/light/fan greenhouse harvest. Retain implicitly consuming watered-bed installation, filled-greenhouse carry-forward and later diffuser nursery role; check any rename atomically and player understanding of accessing existing supply.

**Evidence limits:** Ice-works wonder/popup and greenhouse popup explicitly establish process-water supply, distinct from drinking water. Missing-water challenge is unsupported by pinned source. Source-internal finding, not hydraulic certification; wrapped transformations do not promise displayed pump/hose internals. Future checks/play observations were not executed.

Passages: [mars:433–506](../stories/mars/story.md#L433-L506), [mars:508–538](../stories/mars/story.md#L508-L538).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-challenge-camera-copy Keep the reusable camera

**Keep · Mars · original not a required fix (challenged/withdrawn).** Cases: `Q18ba1c3508d7`.

**Concern:** Retained handles do not establish duplication; useful mounting remains coherent.

**Action or decision:** Keep Camera + Tripod [transform] -> Field camera: only Tripod transforms; cameras remain reusable equipment. Do not add camera stock counting or generic depletion.

**Checks:** Check Camera’s five uses, field-camera photography, preserved Telescope camera, three shared Tripod routes, and beacon-first/telescope-first orders. Keep nursery, basin and depot marker photo continuity; coordinate AF-depot-wind-relevance without losing camera role. Confirm core photo/archive needs and separate Message camera/Scout equipment; Rover has no camera slot.

**Evidence limits:** Retained handles do not establish physical duplication. Field/Telescope camera are ordinary transformations, not compounds exposing parts; needs follow current producers rather than old renderer containment. Source-internal coherence does not prove UI clarity. No goals/recipes are removed or new skip risks introduced; future checks must test reusable-equipment comprehension without demanding permanent display.

Passages: [mars:120–168](../stories/mars/story.md#L120-L168), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-challenge-feeding-copy A retained flask is not duplicate soup

**Keep · Mars · original not a required fix.** Cases: `Q30d59e050a2a`.

**Concern:** No mandatory material change is established; supplied occupied refuge and hot meal have distinct roles.

**Action or decision:** Keep Occupied refuge [transform] + Hot meal flask -> Provisioned refuge. Retain later flask consumption into Shared supper and refuge progression; do not add stock, leftovers, replenishment, empty-flask or mug bookkeeping.

**Checks:** Review flask preserve/consume and refuge preserve/transform contrasts; trace supper → Crew portrait → Family record/archive and refuge → Crew message → Insulated refuge. Check early-discovery protection, chapter needs and Service refuge skip text; ask whether players understand one rescued crew and continuing meal sequence without requiring flask visibility everywhere.

**Evidence limits:** The story declares flask preservation, not duplicate portions; no mug exists and earlier feeding does not establish emptying. Neither refuge declares food/crew slots. Preserved crawler equipment is not another crew. Source-internal abstraction is not conserved-quantity simulation; repeated meal wording remains a comprehension risk. The proposal research supplied no execution evidence for these checks.

Passages: [mars:308–338](../stories/mars/story.md#L308-L338), [current specification](story-format-spec.md), [mars:371–395](../stories/mars/story.md#L371-L395), [mars:340–366](../stories/mars/story.md#L340-L366), [mars:397–441](../stories/mars/story.md#L397-L441).

Research: Source-internal editorial assessment; no new external factual claim.

## Absent editions

### AF-unanswered-ending Keep the absent secondary ending on hold

**Absent edition · Divinity · original P1.** Cases: `Q3e1e92b50853`.

**Concern:** Reunion and welcome interpretations do not carry the fact that the father receives no reply; it lives in primitive text.

**Action or decision:** Leave current stories unchanged. Target is absent divinity-light-reading-scenes-v4, whereas supplied Divinity is final-reading-scenes-v7; current bone-provenance ending is not the unanswered father’s invitation.

**Alternatives and limits:** If exact secondary manuscript becomes available, inspect upstream earned explanations; add a short no-reply cue or narrow conclusion to supported welcome if still needed.

**Checks:** Do not transplant absent narrative or count absence as repair. For that edition, trace actual global recipes/needs/fates; test unanswered-invitation comprehension with primitive wonders unread and earned prose skimmed.

**Evidence limits:** Current search found no matching recipe or passage across five stories. Original distinction between reunion/welcome and unanswered invitation remains; no present goal, dependency, slot or theological edit is established.

Passages: [divinity:1–9](../stories/divinity/story.md#L1-L9), [divinity:1105–1107](../stories/divinity/story.md#L1105-L1107).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-luther-panel-comparison Hold the secondary-edition comparison

**Absent edition · Divinity · original P2.** Cases: `Q88c3c7912b97`.

**Concern:** Result headline repeats the direct-source Luther correction; legitimate roadside comparison is mainly prose.

**Action or decision:** Leave current Divinity unchanged. Absent dl2-history-panel in light-reading-scenes-v4 is not current household/Luther care-priority comparison, bone custody or recognition chain. Do not relabel feed-before-letter or transplant roadside/Jewish-conversation input.

**Alternatives and limits:** If secondary source supplied, compare direct-source correction, roadside explanation and output; only then consider comparison-focused label if second input remains hidden.

**Checks:** Keep household → care-not-purchase → gift-common-ground goals/fates intact. For absent edition, trace global names/downstream needs/goal-skips and test with unread primitives and skimmed earned prose; avoid unsupported influence claims.

**Evidence limits:** Source gap, not repair or clearance. Preserve original contrary evidence that secondary result’s two-sentence explanation was strong; not newly inspected. Eventual label work is optional framing, not established comprehension failure.

Passages: [divinity:1–9](../stories/divinity/story.md#L1-L9), [divinity:578–657](../stories/divinity/story.md#L578-L657).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-exhibit-completion Four-panel overview: no current counterpart

**Absent edition · Divinity · original P2.** Cases: `Q0ce7235f4e4a`, `Qf650e1bfed6c`.

**Concern:** Exact earlier witness has three earned captions and zero→one mounted; later witness has four earned and zero→one mounted. Reader says four completed panels, not all mounted. The old mounted-count contradiction is withdrawn; only narrower premature/prospective wording and separately clipped caption remain.

**Action or decision:** Leave current stories unchanged; absent secondary light-reading-scenes-v4 exhibit has no matching four-panel/installation target. Retain withdrawal of mounted-count contradiction: earned captions, mounted captions and completed designs are distinct states.

**Alternatives and limits:** If exact secondary source supplied, use prospective ‘four comparison panels’ wording only if overview precedes earning; inspect clipping separately.

**Checks:** Check that edition’s overview, captions, slots, goals and needs in three-earned/four-earned and zero-to-one-mounted states. Use new compound/conditional wonders, latched goals and future protection, not obsolete containment; do not repurpose current stephen-panel or feeding comparison.

**Evidence limits:** Only narrower premature/prospective wording and separately reported clipping remain open; neither established against current Markdown. ‘Completed’ need not mean ‘mounted’; finished-design interpretation remains plausible. No exhibit machinery or validated fix proposed.

Passages: [divinity:1–9](../stories/divinity/story.md#L1-L9), [current specification](story-format-spec.md).

Research: Source-internal editorial assessment; no new external factual claim.

### AF-platform-emission Earlier Atlas platform result is not present

**Absent edition · Ideas · original P2.** Cases: `Qa7acd1f5db9e`.

**Concern:** Platform clocks plus symmetric arrival observation are meaningful, but result does not plainly state simultaneous emission.

**Action or decision:** Leave current Markdown unchanged. Missing make-platform-simultaneity belongs to atlas-intellectual-history-locations-v2; supplied atlas-focused-sessions-v6 instead has passenger reception/light-speed-distance chain governed by AF-train-reception.

**Alternatives and limits:** If exact earlier edition supplied/migrated, consider ‘The flashes were emitted together by platform time’, after confirming its own equal-distance/light-speed premises and short emission-versus-reception cue.

**Checks:** Do not import current chapter’s premises or treat its chain as confirming/clearing absent result. Before any old-edition revision trace global names, dependencies, chapter skips and test emission versus arrival; no present names/goals/fates/slots change.

**Evidence limits:** Source gap rather than physics finding. Search found no matching earlier result across five stories. Conditional label is not executable recipe, authorization to transplant scene, or proof that the earlier formulation is repaired.

Passages: [ideas:1–11](../stories/ideas/story.md#L1-L11), [ideas:2997–3047](../stories/ideas/story.md#L2997-L3047).

Research: Source-internal editorial assessment; no new external factual claim.

## Earlier calibration examples

These five user-supplied examples are not new discoveries and are not part of the 70-card count. The old report supplies their titles, not complete original critiques; do not invent a missing criticism.

### Footbridge map usefulness

`Q791d561f110e` · Old mapping absent; no current repair proposed.

Keep current Planks [consume] + Rope [consume] → Footbridge; current recipe has no map operand. Preserve recognizable building-material relation and bridge goal; do not transplant or count absence as clearance of old edition.

No present repair. Earlier full critique was not supplied.

Passages: [elements:100–123](../stories/elements/story.md#L100-L123).

### Nails + iron hinge

`Qd807b069652c` · Present; keep as a separate calibration question.

Keep Iron [consume] + Nails [consume] → Hinge, with Hinge later supporting Tripod. Conventional fabrication can connect useful metal parts; do not require full smithing sequence. Later comprehension check may ask each input’s contribution; any cue must be displayed rather than author-only NOTE.

Original report supplied title only, not complete critique; no new mandatory repair established.

Passages: [elements:243–285](../stories/elements/story.md#L243-L285), [elements:788–804](../stories/elements/story.md#L788-L804).

### Hinge + chest tool chest

`Qe1bec4044ff9` · Old recipe absent; no current repair proposed.

Keep Planks [consume] + Nails [consume] → Wooden chest for tools. Current manuscript has no Hinge + chest → Tool chest conversion; Hinge has separate Tripod purpose. Do not restore absent intermediate just to recreate calibration.

Absence is not repair or clearance of old edition.

Passages: [elements:243–285](../stories/elements/story.md#L243-L285).

### Clay + planks tile

`Q4dba7358acc3` · Present; calibration retained without a new mandatory recommendation.

Keep Clay [transform] + Planks → Tile; popup establishes firing/glazing facilities. Later player check can ask whether reusable shaping support or mould is understood. Coordinate any pottery cue with AF-preserve-jar-stage and AF-glaze-formulation; no extra craft-stage chores.

Title-only case supplies no full old critique and warrants no invented mandatory repair.

Passages: [elements:222–240](../stories/elements/story.md#L222-L240).

### Tile + table tiled table

`Qf19a301e5d26` · Present; keep.

Keep Table [transform] + Tile [consume] → Tiled table. Transformation incorporates tile into recognizable result; ordinary fixing is compressed fabrication. Preserve actual Tiled table chapter goal and later Feast table transformation; no adhesive inventory or assembly subgame.

Separate calibration, not a new audit discovery or implemented validation.

Passages: [elements:222–240](../stories/elements/story.md#L222-L240), [elements:691–721](../stories/elements/story.md#L691-L721).

## Historical coverage and evidence limits

The original audit contains 1,029 ratings across 1,033 case IDs: 535 scores of 5, 228 of 4, 248 of 3 and 18 of 2. Its 266 low-score flags plus 17 additional checks formed the 283-case contextual queue, all reviewed in at least one version. There were 297 original contextual records, including 14 outside that queue. The separate 39 new/current interaction trials included nine scores of 3 or below; four loss-only replacement trials scored 4, 5, 5 and 5. They are fresh assessments, not recovered original responses. None of these denominators is a score for the current Markdown rebuild or its forthcoming revisions.

The original 70-card report had 11 P1, 35 P2, 11 P3, six Hold and seven Not-required cards. The later Markdown review changed editorial dispositions after inspecting current counterparts; it did not rewrite original ratings. In particular, the exhibit finding is not a contradiction about how many panels were mounted: it was narrower premature wording about four completed captions before the fourth had been earned in one secondary edition. That edition is absent here.

The consolidation incorporates the original review, the restructured repository's authenticity follow-up, and the complete 30 October Markdown proposal review. The proposal review covered all 70 IDs and five calibration examples against commit `1e8567d343a36d8280f54cf5e6bc41a98b7fcd47`; its source document was `story-authenticity-proposals.md` (SHA-256 `767587cdab9b6b62157d14fa7435311ea9c33269614ba9388680420e1b304ea4`). The original review remains [archived byte-for-byte](../archive/legacy-2026-10-30/docs/story-authenticity-review-2026-10-30.md), including old recipe identities, full case/version bindings and confidence limits. The former active follow-up added lexical navigation candidates, not a separate verified finding cohort.

The carried-forward evidence does not certify all current high-scoring interactions, all historical editions, browser dragging, native touch behavior, player comprehension or physical reproducibility. Old browser observations did not test these Markdown source changes. Current runtime tests and fresh play evidence must be recorded beside the changes they actually cover.

## Completion and archiving

When the implementation pass is genuinely complete, move this document into `archive/` with a header stating its purpose, start and completion timestamps, final source commit and evidence locations. Record every adopted, retained, rejected, absent or unresolved disposition. Do not mark an uncertain claim verified or an unexecuted test passed to achieve apparent closure. If a material task remains blocked, leave it active or clearly identify a continuing owner and document rather than burying it as completed work.

Update the README, authoring/backlog links and agent guidance to the archived outcome so this does not become another duplicate active report. Preserve the original historical archive unchanged; its manifest remains the authority for those bytes.
