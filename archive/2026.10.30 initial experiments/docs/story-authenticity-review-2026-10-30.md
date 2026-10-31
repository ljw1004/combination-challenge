# Story authenticity review

30 October 2026

This review identifies content edits to consider while migrating the game stories to Markdown. It covers existing pre-Markdown content only: no migrated story files were tested, and no game source edits have been made. These are content recommendations, not migration-format requirements.

The **283-case mandatory contextual review queue is complete across reviewed versions**. This is not certification of all current high-scoring interactions, every legacy or selectable edition, or the Markdown migration itself.

## Review summary

The **70 deduplicated cards are not 70 required fixes**. Priority labels guide editing; they do not replace the original ratings. Optional polish, unresolved questions and conclusions that do not support a required change are kept separate.

| Priority | Cards | Meaning |
| --- | ---: | --- |
| [P1 Resolve first](#p1-resolve-first) | 11 | Composition, contradictory state text or an essential story event hidden from the player |
| [P2 Concrete clarity candidates](#p2-concrete-clarity-candidates) | 35 | Targeted improvements that preserve the useful recipe and expose the inputs’ roles |
| [P3 Optional polish](#p3-optional-polish) | 11 | Non-blocking wording or presentation improvements |
| [Hold Verify before changing](#hold-verify-before-changing) | 6 | Questions to resolve before treating a case as a defect |
| [Not required fixes](#not-required-fixes) | 7 | No mandatory change supported on the stated basis |

Further reference: [Coverage and denominators](#coverage-and-denominators), [Earlier calibration examples](#earlier-calibration-examples), [Limits](#limits).

## Reading the cards

- Each card preserves its finding ID, case IDs, story and world, recipe ID, visible inputs and output, and version limits. A card may cover more than one related recipe or case.
- Resolve-first items concern meaningful composition, contradictory state text, or an essential story event hidden from the player.
- Clarity candidates preserve the useful recipe while exposing each input’s role. Optional polish and unresolved questions are separated below.
- In Divinity, assume primitive wonder text is unread and earned explanations are only skimmed.
- Read the confidence and limits with each recommendation. A meaningful historical, philosophical or artistic synthesis need not be a logically forced deduction.

## P1 Resolve first

### Divinity — Dead-soul premise and changed-life result have different referents
- **divinity-final-reading-scenes-v7 · `no-paid-shortcut`**: A seller cannot guarantee God’s mercy for a coin + repentance means a lifetime of turning away from wrong → a paid guarantee cannot replace a changed life  
  Case `Q1ef3f61ff741`. Version: current featured counterpart.

**Issue:** Earned seller claim concerns a dead soul, while output invokes an unspecified living person’s changed life.

**Smallest correction:** Synthesize the two claims explicitly or use a living-purchaser forgiveness premise.

**Confidence / limits:** Preserve official-teaching distinction; do not remove theme or demand theological proof.

Reference: `AF-paid-guarantee`. New audit candidate, not a supplied calibration example.

### Divinity — Final invitation relies on an unread story ending
- **divinity-light-reading-scenes-v4 · `dl2-open-door-reading`**: The feast is explained as reunion, not a wage calculation + The welcome reaches toward the critics too → The last invitation is still unanswered  
  Case `Q3e1e92b50853`. Version: Exact normally selectable secondary Divinity-light edition; not the featured Divinity story.

**Issue:** Reunion and welcome interpretations do not carry the fact that the father receives no reply; it lives in primitive text.

**Smallest correction:** Add one earned cue: story ends with father pleading, no reply given; or synthesize inclusive welcome instead.

**Confidence / limits:** Strict unread-primitive/skim-earned constraint; no new gate needed.

Reference: `AF-unanswered-ending`. New audit candidate, not a supplied calibration example.

### Elements — Air has no clear operation in Plant → Grain
- **elements-basket-continuity-v10 · `grain`**: Plant + Air → Grain  
  Case `Q40ed7b1604eb`. Version: current featured counterpart.

**Issue:** Grain has use and plant provenance but Air’s role is unclear.

**Smallest correction:** Use harvest, or explicitly winnow harvested grain-and-chaff with Air.

**Confidence / limits:** Not a claim grain cannot come from plants; do not add full agricultural simulation.

Reference: `AF-grain-air`. New audit candidate, not a supplied calibration example.

### Elements — Preserves bypass the world’s authored fired-jar stage
- **elements-basket-continuity-v10 · `sealed-preserves`**: Preserve jar + Jar lid → Sealed preserves  
  Case `Q23395dcb1d50`. Version: current featured counterpart.

**Issue:** The branch fills shaped Clay jar despite separate coating/firing producing Glazed clay jar.

**Smallest correction:** Use existing Glazed clay jar in preserve producer and name wooden-covered result Covered preserves.

**Confidence / limits:** Internal stage inconsistency, not food-safety advice or categorical impossibility; reachability untested.

Reference: `AF-preserve-jar-stage`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Calendar adds no clear function to an already-reference-set clock
- **atlas-focused-sessions-v6 · `civ-direct-reference-clock`**: A publicly shared year + A calibrated portable clock set to a reference meridian → A clock carrying another place’s time  
  Case `N51b515776bb4`. Version: Current content; depth of visual review varies by case.
- **atlas-focused-sessions-v6 · `make-time-longitude`**: A clock carrying another place’s time + Local noon follows the Sun at this place → Longitude from two kinds of time  
  Case `Q6dd9d1f25c3f`. Version: mapped current featured counterpart.

**Issue:** Clock already carries reference-meridian time; shared calendar does not explain a new operative contribution. Later longitude method is meaningful.

**Smallest correction:** Remove redundant conversion and feed reference clock directly into local-noon method, or give calendar a genuinely distinct role.

**Confidence / limits:** Dependency rewiring not tested. Q6dd9 is a downstream rediscovery, not a second issue.

Reference: `AF-calendar-clock`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Chart is already present as its design input
- **atlas-focused-sessions-v6 · `civ-direct-bearing-chart`**: An Earth with comparable positions + A flat chart designed for constant compass bearings → A chart made for compass bearings  
  Case `N82115f7ddf46`. Version: Current content; depth of visual review varies by case.
- **atlas-focused-sessions-v6 · `make-positioned-sea-route`**: A chart made for compass bearings + Longitude from two kinds of time → A sea route marked with longitude  
  Case `Q51a704d5b496`. Version: mapped current featured counterpart.

**Issue:** The purported design-priority input already describes a flat bearing chart; globe context does not remove state overlap.

**Smallest correction:** Use a navigator’s constant-bearing requirement as input, or remove redundant creation and retain the useful distortion comparison.

**Confidence / limits:** Later longitude use is meaningful; do not report false cartography.

Reference: `AF-bearing-chart`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Copy-circulation premise already contains the output
- **atlas-focused-sessions-v6 · `make-politics-of-the-copy`**: Benjamin: copies change the encounter + Mass copies change who encounters and uses art → Benjamin: copies change art’s reach  
  Case `Q4e1f6ae8d5cb`. Version: mapped current featured counterpart.

**Issue:** Audience/use input substantially states copies changing art’s reach; nuanced political interpretation alone does not give new input work.

**Smallest correction:** Use a concrete contrasting use case or collapse last conversion while preserving nuanced account.

**Confidence / limits:** Any named historical illustration needs separate verification.

Reference: `AF-benjamin-copy`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Induction repeats the Faraday input instead of comparing both directions
- **atlas-focused-sessions-v6 · `make-induction`**: Ørsted: magnetic current + Changing magnetism induces a current → Faraday: changing fields induce current  
  Case `Qf3bf1c02d1d0`. Version: mapped current featured counterpart.

**Issue:** Faraday input already says changing magnetism induces current; output repeats it without expressing Ørsted’s contrasting contribution. Current Ørsted: magnetic current label obscures current’s magnetic effect.

**Smallest correction:** Use Ørsted: electric current has a magnetic effect, then make the result compare both current→magnetism and changing magnetism→current.

**Confidence / limits:** No required experiment apparatus, deductive proof, transformer or new input already containing the full comparison; preserve valid historical teaching.

Reference: `AF-induction-comparison`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — James plus Freud produces the Freud claim already supplied
- **atlas-focused-sessions-v6 · `make-interpreted-dream`**: James: thought flows + Freud interprets dreams through wishes and conflicts → Freud: dreams interpreted as conflict  
  Case `Q396427efa870`. Version: current featured counterpart.

**Issue:** Freud input already states dreams interpreted through wishes/conflict; James adds no discernible result.

**Smallest correction:** Connect Freud directly to later artistic experiment or create an explicit comparison using both.

**Confidence / limits:** No concrete dream/diagnosis required; proposed rewiring untested.

Reference: `AF-james-freud`. New audit candidate, not a supplied calibration example.

### Mars — Oxygen plant says installed controller needs reconnecting
- **mars-resident-refuge-v9 · `oxygen-2-controlled-electrolyzer`**: Electrolyzer stack + Process controller → Oxygen plant  
  Case `Q6cb29c13a228`. Version: mapped current featured counterpart.

**Issue:** Effective source reader contradicts completed controller incorporation, even before later intake service.

**Smallest correction:** Describe stack plus matched controller and timeless intake interface; do not replace with another eventually-stale missing-intake statement.

**Confidence / limits:** Keep meaningful restoration and later steps; no whole-system commissioning claim.

Reference: `AF-oxygen-controller-reader`. New audit candidate, not a supplied calibration example.

### Mars — Relay reader still asks for fitted components
- **mars-resident-refuge-v9 · `relay-12-distress-recording`**: Relay + Relay knoll → Distress recording  
  Case `Qffa040bd7cc8`. Version: Earlier visually inspected version; story content and behavior verified unchanged, current appearance not rechecked.
- **mars-resident-refuge-v9 · `relay-6-directional-relay`**: Relay + Directional antenna → Relay  
  Case `Qd724188f811c`. Version: mapped current featured counterpart.

**Issue:** Relay reader says antenna/powerpack are missing after they have been fitted.

**Smallest correction:** Use timeless interface description or state-aware connection text.

**Confidence / limits:** Fresh browser inspection after antenna installation shows filled antenna slot while reader still asks for antenna and powerpack; only power is absent in this witnessed state. This removes the earlier visual-verification limitation only for that partial state. Earlier fully fitted relay case retains its earlier visual inspection with unchanged story semantics; no claim that every state was visually rechecked.

Reference: `AF-relay-reader`. New audit candidate, not a supplied calibration example.

## P2 Concrete clarity candidates

### Cooking — Scone crumbs sounds like already-baked fragments
- **kitchen-caravan-small-sessions-v8 · `scone-crumbs`**: Self-raising flour + Butter → Scone crumbs  
  Case `Q80df4363dbce`. Version: mapped current featured counterpart.
- **kitchen-caravan-stations-v7 · `scone-dough`**: Scone crumbs + Milk → Scone dough  
  Case `Q23d1ac7bf9c9`. Version: not established by this older review alone; mapping/recheck needed.

**Issue:** Raw flour-and-butter mixture is sound but its name can imply finished food.

**Smallest correction:** Use Crumbly scone mix or Rubbed-in scone mix.

**Confidence / limits:** Current content corroborates the earlier finding; one issue, not two.

Reference: `AF-scone-mix`. New audit candidate, not a supplied calibration example.

### Divinity — Comparative result hides the roadside panel contribution
- **divinity-light-reading-scenes-v4 · `dl2-history-panel`**: This passage contradicts the sweeping headline + Mercy crosses the boundary from within a Jewish conversation → A fairer headline: Luther commends practical help  
  Case `Q88c3c7912b97`. Version: Exact normally selectable secondary Divinity-light edition; not the featured Divinity story.

**Issue:** Result headline repeats the direct-source Luther correction; legitimate roadside comparison is mainly prose.

**Smallest correction:** Make the result a practical-care comparison, with no influence claim; alternatively finish headline correction in the source step.

**Confidence / limits:** Existing two-sentence explanation is strong contrary evidence; framing judgment, not observed comprehension failure.

Reference: `AF-luther-panel-comparison`. New audit candidate, not a supplied calibration example.

### Divinity — Exhibit overview prematurely calls three earned captions four completed panels
- **divinity-light-reading-scenes-v4 · `dl2-fit-voices`**: The four-panel exhibit + The same feeding receives distinct emphases → The four-panel exhibit with The same feeding receives distinct emphases installed  
  Case `Q0ce7235f4e4a`. Version: Exact normally selectable secondary Divinity-light edition; not the featured Divinity story.
- **divinity-light-reading-scenes-v4 · `dl2-fit-print`**: The four-panel exhibit + A fairer headline: Luther commends practical help → The four-panel exhibit  
  Case `Qf650e1bfed6c`. Version: Exact normally selectable secondary Divinity-light edition; not the featured Divinity story.

**Issue:** Exact earlier witness has three earned captions and zero→one mounted; later witness has four earned and zero→one mounted. Reader says four completed panels, not all mounted. The old mounted-count contradiction is withdrawn; only narrower premature/prospective wording and separately clipped caption remain.

**Smallest correction:** Prefer prospective wording describing the four comparison panels, or earned-progress-aware text. Inspect the separately clipped installed caption; do not change useful installation semantics.

**Confidence / limits:** Generic finished-design reading is plausible, so this is targeted clarity rather than a definite installation-state contradiction. The earlier three-earned and later four-earned states are different; no human comprehension claim.

Reference: `AF-exhibit-completion`. New audit candidate, not a supplied calibration example.

### Elements — Cooking water is an undisplayed environmental premise
- **elements-basket-continuity-v10 · `porridge-on-stove`**: Grain + Stove → Porridge  
  Case `Q552b8b6ab5e0`. Version: current featured counterpart.

**Issue:** Inset pot is in the openable Stove reader, but essential water is supplied only by authored kitchen context.

**Smallest correction:** Expose water-at-hand in a short truthful kitchen/stove cue; avoid hydration busywork.

**Confidence / limits:** Ordinary kitchen convention makes result plausible, not proven impossible; the strength of this concern remains uncertain.

Reference: `AF-porridge-water`. New audit candidate, not a supplied calibration example.

### Elements — Seed-press construction remains compressed
- **elements-basket-continuity-v10 · `seed-press`**: Millstone + Planks → Weighted seed press  
  Case `N4a4066eaaa19`. Version: Current content; depth of visual review varies by case.

**Issue:** Optional output reader supplies lever/draining bed; exact load path, confinement and preparation are not demonstrated.

**Smallest correction:** Clarify recognizable lever/press assembly and what the operation does; do not add an agricultural simulation or claim physical impossibility.

**Confidence / limits:** Traditional stones/levers supported, exact pressure/yield untested; weaker than clock/chart.

Reference: `AF-seed-press`. New audit candidate, not a supplied calibration example.

### Elements — Wild starter leaves moistening implicit
- **elements-basket-continuity-v10 · `starter`**: Flour + Air → Wild starter  
  Case `Qabfd472cad72`. Version: mapped current featured counterpart.

**Issue:** Dry flour plus Air produces culture defined as flour and water; Water/Rain present in river scene support ordinary moistening but operation never states it.

**Smallest correction:** Make moistening and cultivation explicit within the action/explanation; keep useful starter.

**Confidence / limits:** Not global lack of water or safety allegation; optional Dough+Air route needs progression check and is not required.

Reference: `AF-starter-hydration`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Branching-fiction payoff repeats the story input
- **atlas-focused-sessions-v6 · `make-branching-fiction`**: Darwin: resemblance can record descent + A story explores incompatible continuations → A narrative can keep incompatible paths open  
  Case `Q8d89eb658070`. Version: mapped current featured counterpart.

**Issue:** Full prose gives a legitimate analogy, but visible result repeats the fiction property and hides Darwin branching.

**Smallest correction:** Name Darwin’s shared ancestry branches; make result Stories and ancestry share a branching shape.

**Confidence / limits:** Not common causation, globally unused Darwin, or a demand that fiction inherit biologically.

Reference: `AF-branching-analogy`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Dependent existence overlaps dependence principle
- **atlas-focused-sessions-v6 · `make-necessary-being`**: Avicenna: dependent existence + A contingent thing depends on another → Avicenna: a necessary source of existence  
  Case `Q786b57d142ca`. Version: mapped current featured counterpart.

**Issue:** Current label loses the contingency-versus-dependence distinction.

**Smallest correction:** First tile: Avicenna: a thing could have failed to exist.

**Confidence / limits:** Keep attributed necessary-source argument; no demand to eliminate every regress alternative.

Reference: `AF-avicenna-distinction`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Earlier Atlas result obscures emission versus arrival
- **atlas-intellectual-history-locations-v2 · `make-platform-simultaneity`**: Distant agreement depends on a signal procedure + Train-end flashes reach the platform midpoint together → Together according to the platform clocks  
  Case `Qa7acd1f5db9e`. Version: exact earlier normally selectable edition.

**Issue:** Platform clocks plus symmetric arrival observation are meaningful, but result does not plainly state simultaneous emission.

**Smallest correction:** The flashes were emitted together by platform time, with brief equal-distance explanation.

**Confidence / limits:** Exact normally selectable atlas-intellectual-history-locations-v2 only; not successor clearance or missing-science claim.

Reference: `AF-platform-emission`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Eclipse archive becomes a generational planetary dataset
- **atlas-focused-sessions-v6 · `make-planetary-archive`**: A sky archive with its gaps + Planets wander against the stars → An archive of planetary motion  
  Case `Q8c8804c17f57`. Version: mapped current featured counterpart.

**Issue:** Inherited archive contains dated eclipses; new primitive only says planets wander, while output claims generations of planetary positions.

**Smallest correction:** Use dated sightings of planets against stars as new raw evidence, or frame output as beginning/extending planetary observations.

**Confidence / limits:** Method transfer is reasonable; concern is the stronger supplied-record claim, not a required numerical dataset.

Reference: `AF-planetary-record-provenance`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Epicurus input already states death is not suffering
- **atlas-focused-sessions-v6 · `make-release-from-terror`**: Epicurus: mind and body are made of dispersible atoms + Death is not an experience of suffering → Epicurus: death is not suffering  
  Case `Q6354a7046e19`. Version: mapped current featured counterpart.

**Issue:** Current safe conclusion overlaps source label, not a literal promise to remove fear.

**Smallest correction:** Distinguish suffering requires sensation premise and argument against fearing death result.

**Confidence / limits:** Atomism contributes dispersible mind/body; no psychological achievement gate.

Reference: `AF-epicurus-premise`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Freud’s contribution to writing is too implicit
- **atlas-focused-sessions-v6 · `make-automatic-writing`**: Freud: dreams interpreted as conflict + Words follow associations rather than a planned outline → Writing without the usual planned control  
  Case `Q1b95db276816`. Version: current featured counterpart.

**Issue:** Output substantially repeats word-association input; artistic use of Freud is hidden.

**Smallest correction:** Frame result as a dream-inspired writing experiment and explain inspiration, not diagnosis.

**Confidence / limits:** Keep legitimate artistic synthesis; not required deductive entailment.

Reference: `AF-automatic-writing`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Generic labels lose the Lamarck/Darwin distinction
- **atlas-focused-sessions-v6 · `make-changed-meaning-of-kinds`**: Resemblance can record shared descent + Species can have changing histories → Changing species, different accounts of how  
  Case `Q2fbdfccf4b82`. Version: current featured counterpart.

**Issue:** Mechanisms are earned but the visible comparison loses their identities.

**Smallest correction:** Name the Lamarck input Lamarck: acquired changes pass to descendants.

**Confidence / limits:** Do not erase meaningful historical contrast or demand unique proof.

Reference: `AF-lamarck-label`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Maxwell reuse needs a short heat/infrared bridge
- **atlas-focused-sessions-v6 · `make-radiative-warming`**: Maxwell: light is electromagnetic + Carbon dioxide absorbs outgoing infrared radiation → Added greenhouse gas changes Earth’s heat loss  
  Case `Q33f6fa4c89ee`. Version: current featured counterpart.

**Issue:** Earned electromagnetic card does not explain infrared heat loss, although climate setting supplies Earth/emissions.

**Smallest correction:** Add Earth loses heat through infrared radiation, an invisible part of the electromagnetic spectrum.

**Confidence / limits:** Small teaching improvement, not false-greenhouse or missing-scientific-proof allegation.

Reference: `AF-infrared-bridge`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Method labels can sound like completed measurements
- **atlas-focused-sessions-v6 · `make-lunar-reference`**: An archive of planetary motion + The Moon’s changing sky position can mark reference time → Reference time read from the Moon  
  Case `Q3ff11d477535`. Version: current featured counterpart.
- **atlas-focused-sessions-v6 · `make-lunar-positioned-sea-route`**: A chart made for compass bearings + A lunar route to longitude → A sea route marked with longitude  
  Case `Q45fa7a52c71e`. Version: current featured counterpart.
- **atlas-focused-sessions-v6 · `make-positioned-sea-route`**: A chart made for compass bearings + Longitude from two kinds of time → A sea route marked with longitude  
  Case `Q51a704d5b496`. Version: mapped current featured counterpart.

**Issue:** Lunar reference and longitude-marked-route labels blur method versus an observed plotted voyage.

**Smallest correction:** Use lunar method for finding reference time, and schematic chart application labels where no readings were taken.

**Confidence / limits:** The strength of the concern is uncertain; no numerical gate or claim marine performance.

Reference: `AF-longitude-method-labels`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Primordial-wisdom result lacks the interpretive bridge
- **atlas-focused-sessions-v6 · `make-ancient-wisdom-claim`**: Plato: stable Forms + Dialogues attributed to ancient Hermes → A claim to a primordial wisdom  
  Case `Q189b82889e7f`. Version: current featured counterpart.

**Issue:** Visible dating task does not link Plato and Hermes to a shared ancient-wisdom claim.

**Smallest correction:** Explicitly reconstruct some Renaissance readers’ claim, then test its age.

**Confidence / limits:** No demand to prove the historical claim true or add all conclusions as inputs.

Reference: `AF-plato-hermes`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Proposed intervention is not linked to measured event
- **atlas-focused-sessions-v6 · `make-cross-checked-discovery`**: A model proposes an experiment that people can inspect + Separate instruments detect the same event → A candidate survives distinct checks  
  Case `Q30aa3d1d33b8`. Version: current featured counterpart.

**Issue:** Instrument corroboration already supplied; proposal’s changed condition is not connected to the observation.

**Smallest correction:** Show that the trial was run and result checks that change, or frame pure corroboration.

**Confidence / limits:** Moderate confidence; no named detector or numerical mini-study required.

Reference: `AF-future-trial-link`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Protection only partly answers whose interests rule serves
- **atlas-focused-sessions-v6 · `civ-make-civ-protection-purpose`**: Aristotle: whose interests are served? + Hobbes: rival private powers cannot secure peace → Hobbes: common power protects  
  Case `Ne232c157b527`. Version: Current content; depth of visual review varies by case.

**Issue:** Result gives political purpose, not a full distributive answer about who benefits.

**Smallest correction:** Make the connection to whose security is protected explicit, or frame it as Hobbes’s proposed purpose rather than a complete answer.

**Confidence / limits:** Source interpretation, not visual comprehension testing.

Reference: `AF-protection-purpose`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Public trial hides what publishing adds
- **atlas-focused-sessions-v6 · `make-public-trial`**: Printed knowledge under contention + Instructions let others repeat the trial → A trial another workshop can repeat  
  Case `Qa83546f12c23`. Version: mapped current featured counterpart.

**Issue:** Input/output already promise repeatability; new distribution step is underexpressed.

**Smallest correction:** Printed instructions for other workshops, retaining trust limits; alternatively narrow input to instructions describing each step.

**Confidence / limits:** No required actual replication or new workshop token; current optional prose lost explicit publication cue.

Reference: `AF-publication-payoff`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Reception step repeats flash observation
- **atlas-focused-sessions-v6 · `civ-direct-train-comparison`**: Clock coordination travels over a network + Train-end flashes: platform midpoint together; moving train midpoint apart → The moving midpoint receives platform-simultaneous flashes separately  
  Case `N26a91fc33db3`. Version: Current content; depth of visual review varies by case.
- **atlas-focused-sessions-v6 · `make-frame-dependent-simultaneity`**: The moving midpoint receives platform-simultaneous flashes separately + Equal train-midpoint distances; same light speed in every inertial frame → Different frames need not agree on distant simultaneity  
  Case `Q81e3cafb61d1`. Version: mapped current featured counterpart.

**Issue:** Upstream result repeats much of its flash input while networked-time contribution remains weak. Downstream simultaneity step has distinct geometry/light-speed inputs.

**Smallest correction:** Clarify what clock coordination contributes or collapse redundant reception conversion; preserve reception versus emission distinction.

**Confidence / limits:** Do not allege relativity from arrival order alone.

Reference: `AF-train-reception`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Snow output underexpresses public-method contribution
- **atlas-focused-sessions-v6 · `make-waterborne-pattern`**: A trial another workshop can repeat + More cholera in intermixed homes using sewage-polluted water → Snow: cholera tracks water supply  
  Case `Q351725b6e60b`. Version: current featured counterpart.

**Issue:** Result repeats water association already in evidence, rather than what the repeatability idea adds.

**Smallest correction:** Frame a checkable account of Snow’s water comparison.

**Confidence / limits:** No randomized trial, germ mechanism or claimed replication required.

Reference: `AF-snow-checkability`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Spherical-Earth result should not promise completed proof
- **atlas-focused-sessions-v6 · `make-spherical-earth`**: A connected geometric proof + Different stars and shadows at different places → A spherical Earth  
  Case `Qfa5dd7c583a1`. Version: Earlier visually inspected version; story content and behavior verified unchanged, current appearance not rechecked.

**Issue:** Model-building is coherent; generic proof language can overstate achieved result.

**Smallest correction:** Make model/investigation scope plain.

**Confidence / limits:** Story semantics verified unchanged from earlier visual inspection; not rejecting the scientific conclusion.

Reference: `AF-spherical-model`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Venus phase title repeats an already-stated observation
- **atlas-focused-sessions-v6 · `make-venus-phases`**: A telescope + Venus shows both crescent and nearly full phases → The full range of Venus’s phases  
  Case `Qa18a38e190cd`. Version: mapped current featured counterpart.

**Issue:** Input already supplies crescent/nearly-full appearances; result title repeats them although prose adds model constraint.

**Smallest correction:** Either make input Watch Venus over several months, or title output around the constraint on sky models.

**Confidence / limits:** Alternatives, not extra required steps; telescope has a valid observing role.

Reference: `AF-venus-payoff`. New audit candidate, not a supplied calibration example.

### Mars — Cabin test record lists fittings rather than identifying check
- **mars-resident-refuge-v9 · `ascent-13-cabin-test-record`**: Ascent cabin + Ascent pad → Cabin test record  
  Case `Qb8af145fec3b`. Version: mapped current featured counterpart.

**Issue:** Fully fitted cabin and pad can generate test observations in action, but pad checking role and limited result are underdescribed.

**Smallest correction:** Use Cabin check pad or a short cue stating intended limited check; retain no-launch-clearance caveat.

**Confidence / limits:** Reasonable no-change interpretation; not fabricated test or requirement for prior observations.

Reference: `AF-cabin-check-role`. New audit candidate, not a supplied calibration example.

### Mars — Data store hides the recorder-device role
- **mars-resident-refuge-v9 · `departure-4-archival-recorder`**: Data store + Archival card → Archival recorder  
  Case `Qbf8860e6c5f2`. Version: mapped current featured counterpart.

**Issue:** Two storage-sounding inputs obscure fitting removable medium into compatible device.

**Smallest correction:** Rename base Card recorder or Archive reader/recorder; retain fitting action.

**Confidence / limits:** No invented transfer, camera, connector or filesystem prerequisite.

Reference: `AF-archive-device-role`. New audit candidate, not a supplied calibration example.

### Mars — Deposition context hides the concrete mapped-sites accomplishment
- **mars-resident-refuge-v9 · `contrast-context`**: Paired terrain photographs + Terrain model → Deposition context  
  Case `Qdeb97416a2f1`. Version: mapped current featured counterpart.

**Issue:** Actual recipe marks both photographed sites on the terrain model; the abstract output label hides that useful result.

**Smallest correction:** Use Mapped ripple and gravel sites or another plain label naming both sites.

**Confidence / limits:** No proven model-coverage defect; exact scope unmeasured. Terrain-model label partly overlay-obscured in captured state.

Reference: `AF-mapped-sites-label`. New audit candidate, not a supplied calibration example.

### Mars — Earlier visibility record has no clear role in later track changes
- **mars-resident-refuge-v9 · `depot-wind`**: Registered route views + Weather record → Track disagreement  
  Case `Qdcbc4cf35503`. Version: mapped current featured counterpart.

**Issue:** Current photo/survey mismatch is grounded, but an earlier visibility interval does not clearly contribute evidence for much later depot track changes.

**Smallest correction:** Clarify the bounded analogy or purpose of reusing the old record, or supply genuinely relevant observations.

**Confidence / limits:** Removal not compelled; do not invent current depot wind or require a full causal proof. Resolves the pending upstream question from depot-sign, not a second case review.

Reference: `AF-depot-wind-relevance`. New audit candidate, not a supplied calibration example.

### Mars — Ephemeris obscures the usable orbital information
- **mars-resident-refuge-v9 · `rendezvous-7-orbiter-pass-prediction`**: Beacon times + Ephemeris card → Orbiter pass prediction  
  Case `Q842623759c68`. Version: mapped current featured counterpart.

**Issue:** Timing plus expected orbital position is a meaningful prediction, but card name is jargon.

**Smallest correction:** Use Orbiter position table; Received beacon times optional.

**Confidence / limits:** No numerical trajectory accuracy or full navigation validation established.

Reference: `AF-orbiter-table`. New audit candidate, not a supplied calibration example.

### Mars — Hookup result does not clearly state the connection
- **mars-resident-refuge-v9 · `garden-5-irrigation-line`**: Drip line + Camp water system → Irrigation line  
  Case `Q0e0c9d1b4665`. Version: current featured counterpart.

**Issue:** Authored tank supply is explicit; operation is a hookup, not creation of a separate type of line.

**Smallest correction:** Rename result Connected drip line.

**Confidence / limits:** Missing-water-mechanism claim rejected; distributed-token representation remains bounded.

Reference: `AF-connected-drip-line`. New audit candidate, not a supplied calibration example.

### Mars — Initial depot cards overlap but ordinary repositioning restores access
- **mars-resident-refuge-v9 · `depot-route`**: Revealed socket mark + Track disagreement → Identified service route  
  Case `Qefc1338e3bb9`. Version: mapped current featured counterpart.

**Issue:** One browser test-state overlap prevented direct initial inspection. An ordinary visible-card drag exposed the covered input and normal reader access succeeded.

**Smallest correction:** Inspect initial card placement and avoid overlapping required labels where practical; preserve the useful service-route recipe.

**Confidence / limits:** Recoverable presentation observation, not inaccessible recipe or frequency evidence in natural play. The recorded drag repositions a card; it is not a tested recipe-combine gesture.

Reference: `AF-depot-card-overlap`. New audit candidate, not a supplied calibration example.

### Mars — Navigation labels hide successive information gains
- **mars-resident-refuge-v9 · `rendezvous-5-sky-fix`**: Aligned star tracker + Clear sky station → Sky fix  
  Case `Q0c1c10beca47`. Version: current featured counterpart.
- **mars-resident-refuge-v9 · `rendezvous-8-ground-reference`**: Sky fix + Navigation terminal → Ground reference  
  Case `Q1560dd84ab86`. Version: current featured counterpart.

**Issue:** Sky fix and Ground reference obscure observation versus station orientation.

**Smallest correction:** Use Star observation → Station orientation, preserving later rendezvous steps.

**Confidence / limits:** Does not establish exact frame tie or a complete positional solution.

Reference: `AF-star-observation-orientation`. New audit candidate, not a supplied calibration example.

### Mars — Old destination label hides regional-map reuse
- **mars-resident-refuge-v9 · `traverse-8-traverse-map`**: Terrain model + Route to the outcrop → Traverse map  
  Case `Q1e271fc6c15a`. Version: current featured counterpart.
- **mars-resident-refuge-v9 · `relay-13-rescue-route`**: Distress recording + Route to the outcrop → Route to the crew  
  Case `Qd948b9bb2ec0`. Version: mapped current featured counterpart.

**Issue:** Route to outcrop is used with terrain model when travelling onward to depot.

**Smallest correction:** Rename continuing map Expedition map, Regional map, or Regional map: outcrop route, preserving route history across later reuse.

**Confidence / limits:** Rescue-route reuse corroborates narrow continuing-map identity concern. Actual regional-map lineage and report landmark exist; do not allege missing destination, invalid planning or instant rescue. Practical confusion unmeasured; historical Weather route map not retrospectively invalidated.

Reference: `AF-expedition-map`. New audit candidate, not a supplied calibration example.

### Mars — Shelter repair hides the damage it repairs
- **mars-resident-refuge-v9 · `rescue-0-sealed-refuge`**: Service shelter + Pressure patch → Sealed refuge  
  Case `Q0b32a640c39c`. Version: current featured counterpart.

**Issue:** Visible mission asks for warmth; torn seam appears only in optional reading.

**Smallest correction:** Name Service shelter · torn seam or show it in arrival; name retained stock Patch supplies if repeatable.

**Confidence / limits:** No physical duplication proven; do not consume patch without checking downstream uses.

Reference: `AF-shelter-seam`. New audit candidate, not a supplied calibration example.

### Mars — Socket mark label misidentifies route information
- **mars-resident-refuge-v9 · `depot-clean`**: Marker cleaning pad + Depot marker line → Revealed socket mark  
  Case `Q379025151297`. Version: current featured counterpart.

**Issue:** Actual payoff is readable surveyed route marker used in later comparison.

**Smallest correction:** Use Readable route identifier.

**Confidence / limits:** Cleaning valid; no safety proof claimed.

Reference: `AF-depot-identifier`. New audit candidate, not a supplied calibration example.

### Mars — Specimen-cart restraint/load relationship and strips unclear
- **mars-resident-refuge-v9 · `departure-11-specimen-cart`**: Secured cart + Return capsule → Specimen transport cart  
  Case `Q0ad7d8b60735`. Version: Earlier visually inspected version; story content and behavior verified unchanged, current appearance not rechecked.

**Issue:** Hardware/cargo conserved, but sizing and separate capsule load relationship are compressed; some component strips were clipped.

**Smallest correction:** Clarify restraint/load relation and inspect component-strip layout.

**Confidence / limits:** Observed in a 390px-wide browser test state only, not every play state; not missing actual capsule.

Reference: `AF-specimen-cart`. New audit candidate, not a supplied calibration example.

## P3 Optional polish

### Elements — Ceramic cooking pot does not identify iron’s contribution
- **elements-basket-continuity-v10 · `cooking-pot`**: Iron + Fired glazed bowl → Cooking pot  
  Case `Qa9b0d08640bb`. Version: mapped current featured counterpart.

**Issue:** Iron-fitted ceramic cookware is plausible; output never identifies iron feature.

**Smallest correction:** If intended: ceramic cooking pot with an iron handle and support.

**Confidence / limits:** Conditional ordinary-craft clarification, not failed material composition or required all-iron redesign.

Reference: `AF-cooking-pot-iron`. New audit candidate, not a supplied calibration example.

### Elements — Climbing garden overstates unspecified seedling suitability
- **elements-basket-continuity-v10 · `climbing-garden`**: Seedlings + Trellis → Climbing garden  
  Case `Q9f3717e2d442`. Version: mapped current featured counterpart.

**Issue:** Oil-bearing seedlings are neither shown suitable nor unsuitable for upward training. Prior rope-trellis step supplies intent.

**Smallest correction:** Prefer Supported garden with arranging/tying language, or identify suitable selection if climbing is essential.

**Confidence / limits:** Qualified wording only; training need not mean tendrils. A save warning partly obscured the inspected browser state.

Reference: `AF-supported-garden`. New audit candidate, not a supplied calibration example.

### Elements — Earth/rain growth shorthand has no actual living starter
- **elements-basket-continuity-v10 · `plant`**: Earth + Rain → Plant  
  Case `Qf8a937d24eca`. Version: Earlier visually inspected version; story content and behavior verified unchanged, current appearance not rechecked.

**Issue:** Vegetated orchard and storybook framing make growth shorthand reasonable despite absent starter lineage.

**Smallest correction:** Clarify growth/cultivation scope if editing.

**Confidence / limits:** Not automatic factual rejection or required seed-production chore.

Reference: `AF-plant-starter`. New audit candidate, not a supplied calibration example.

### Elements — Wheel’s template role conflicts with incorporation metadata
- **elements-basket-continuity-v10 · `millstone`**: Stone + Wheel → Millstone  
  Case `Q1beaedf676d5`. Version: current featured counterpart.

**Issue:** Wooden wheel is marked incorporated while result describes a stone grinding disk.

**Smallest correction:** If a template, retain it with that reason; do not invent a wooden grinding structure.

**Confidence / limits:** Authoring ambiguity, not demonstrated player-facing material failure.

Reference: `AF-millstone-wheel-role`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Common Aristotle corpus could be explicit
- **atlas-focused-sessions-v6 · `make-parallel-translations`**: Aristotle in Latin + A Greek manuscript brought by Byzantine scholars → Greek and Latin versions side by side  
  Case `Q7908d4d84b7a`. Version: mapped current featured counterpart.

**Issue:** Focused translation scene already makes shared text inferable.

**Smallest correction:** Optional A Greek manuscript of Aristotle.

**Confidence / limits:** No shelfmark or extra verification gate required.

Reference: `AF-greek-manuscript`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Eclipse label could communicate pattern scope
- **atlas-focused-sessions-v6 · `make-eclipse-pattern`**: A sky archive with its gaps + A calendar of lunar months → Recurring eclipse seasons  
  Case `Q3c0489aebc3f`. Version: current featured counterpart.

**Issue:** Underlying recording/pattern composition accepted.

**Smallest correction:** Clarify recurring seasons if editing, without prediction mini-game.

**Confidence / limits:** Weak non-blocking concern only.

Reference: `AF-eclipse-scope`. New audit candidate, not a supplied calibration example.

### Ideas / Atlas — Jaipur comparison could be more specific
- **atlas-focused-sessions-v6 · `make-jaipur-comparison`**: Ptolemy read critically + Indian and Persian astronomical tables in comparison → Astronomical traditions compared at Jaipur  
  Case `Q6358940e7819`. Version: mapped current featured counterpart.

**Issue:** Educational comparison accepted within setting.

**Smallest correction:** Optional precision only if editing.

**Confidence / limits:** Not an established fabrication or missing historical proof.

Reference: `AF-jaipur-wording`. New audit candidate, not a supplied calibration example.

### Mars — Extra telescope assembly yields the same generic photo
- **mars-resident-refuge-v9 · `outcrop-7-cliff-photograph`**: Telescope camera + Cliff viewpoint → Cliff photograph  
  Case `Q1eb339b0e904`. Version: current featured counterpart.

**Issue:** Ordinary field camera and elaborate telescope-camera branch create same result.

**Smallest correction:** If extra assembly should be rewarded, supply a distinct useful close-up observation.

**Confidence / limits:** Photography is coherent; no whole equipment redesign required.

Reference: `AF-telescope-payoff`. New audit candidate, not a supplied calibration example.

### Mars — Greenhouse damage/supply labels could be clearer
- **mars-resident-refuge-v9 · `garden-repair`**: Greenhouse shell + Pressure patch → Greenhouse  
  Case `Q6b5098b1cd76`. Version: mapped current featured counterpart.

**Issue:** Actual fabric/sealant lineage is sound and cache describes damaged seam.

**Smallest correction:** Consider Greenhouse with torn seam + Patch supplies → Repaired greenhouse.

**Confidence / limits:** Cache arrival not captured; weaker than shelter-seam finding; no duplicated material demonstrated.

Reference: `AF-greenhouse-repair`. New audit candidate, not a supplied calibration example.

### Mars — Reusable solar charger versus fitted internal power supply
- **mars-resident-refuge-v9 · `rover-4-long-range-radio`**: Solar radio + Dish antenna → Long range radio  
  Case `Q3ae568ead70f`. Version: current featured counterpart.

**Issue:** Long-range dish step is coherent; predecessor wording can imply physically fitting the charger rather than recharging a battery.

**Smallest correction:** Clarify recharge/charged-radio wording if intended.

**Confidence / limits:** No retained-token duplication proof or extra circuitry gate.

Reference: `AF-radio-power-wording`. New audit candidate, not a supplied calibration example.

### Mars — Scout transport history could be state-neutral
- **mars-resident-refuge-v9 · `traverse-4-powered-scout`**: Scout + Scout battery → Scout  
  Case `Q7f78530c6a86`. Version: mapped current featured counterpart.
- **mars-resident-refuge-v9 · `traverse-0-rotorcraft-frame`**: Scout airframe + Counter rotating rotors → Scout  
  Case `Qb8121356eb79`. Version: mapped current featured counterpart.
- **mars-resident-refuge-v9 · `traverse-6-scout-panorama`**: Scout + Lava overlook → Scout panorama  
  Case `Qd2f49cc23d7d`. Version: mapped current featured counterpart.

**Issue:** Historical removal statement is literally true, not a hard instruction to reinstall fitted components.

**Smallest correction:** Optional state-neutral fitted-assembly description and battery slot.

**Confidence / limits:** Direct assembly and powered-scout observation corroborate optional history-versus-state wording. Any replacement must work before and after fitting; do not permanently declare missing battery or installed rotors in every state. No mandatory hardware fix or flight certification.

Reference: `AF-scout-reader`. New audit candidate, not a supplied calibration example.

## Hold Verify before changing

### Divinity — Stronger Lyon divine-appointment opposition remains unverified
- **divinity-final-reading-scenes-v7 · `rites-different`**: in baptism, God works through water to give inward grace + Lyon rite: a spiritual gift through hands and a book → Both rites use bodies; they disagree about what God appointed  
  Case `Qb9fa6ab95df2`. Version: mapped current featured counterpart.

**Issue:** Playable comparison has explicit Lyon referent; current disagreement about what God appointed is stronger than earlier differing authority claims.

**Smallest correction:** If stronger historical opposition cannot be supported, use Shared bodily actions do not settle the rites’ authority claims.

**Confidence / limits:** Aquinas source supports its own side, not Lyon exclusion of water or a documented encounter; exact critical text retrieval failed. No universal Cathar-creed inference.

Reference: `AF-lyon-opposition-source`. New audit candidate, not a supplied calibration example.

### Elements — Backing-board role may need discovery cue
- **elements-basket-continuity-v10 · `glass-slide`**: Glass + Planks → Glass slide  
  Case `Q3c9965910f4d`. Version: current featured counterpart.

**Issue:** Source supports legitimate shaping/support operation; ordinary first-earned feedback was not captured.

**Smallest correction:** Only add a cue if normal discovery feedback fails to explain board role.

**Confidence / limits:** Do not import later microscopy mission into opening scene; conditional, not confirmed defect.

Reference: `AF-glass-slide-role`. New audit candidate, not a supplied calibration example.

### Elements — Carving tool’s ability to shape iron is unspecified
- **elements-basket-continuity-v10 · `saw`**: Iron + Carving tool → Saw  
  Case `Qf13eb3ec4da5`. Version: mapped current featured counterpart.

**Issue:** Iron plus shaping tool has distinct material/tool roles and a useful saw result, but this particular tool’s metalworking capability is not established.

**Smallest correction:** If intended, explain metalworking capability or use a suitable workshop route; defer mandatory replacement until capability is resolved.

**Confidence / limits:** Not impossible merely because both tools/material are iron; routine craft need not enumerate every tool. External examples cannot establish this fictional implement’s properties.

Reference: `AF-saw-tool-capability`. New audit candidate, not a supplied calibration example.

### Elements — Elemental Stone is symbolic, not literal geological production
- **elements-basket-continuity-v10 · `stone`**: Earth + Fire → Stone  
  Case `Qe23c237a3bf0`. Version: mapped current featured counterpart.

**Issue:** Visible classical quartet supports symbolic transformation; soil plus fire does not literally produce geological stone. Adjacent realistic clay/brick craft makes the genre boundary genuinely ambiguous.

**Smallest correction:** Make the storybook boundary visible if symbolic play is intended; if literal material authenticity is intended, reconsider the producer.

**Confidence / limits:** A disclaimer is not a physical repair. Conditional contextual acceptance does not reject the original literal-material objection; no human comprehension test.

Reference: `AF-stone-genre-boundary`. New audit candidate, not a supplied calibration example.

### Elements — Generic sand/clay glaze formulation remains uncertain
- **elements-basket-continuity-v10 · `glaze`**: Sand + Clay → Glaze  
  Case `Q49779f028615`. Version: current featured counterpart.

**Issue:** Glaze may mean an unfired mixture; some natural clays glaze. Exact generic formulation is not established.

**Smallest correction:** Recheck formulation only if precise real process matters; do not assert universal missing flux.

**Confidence / limits:** No mandatory replacement or physical impossibility established.

Reference: `AF-glaze-formulation`. New audit candidate, not a supplied calibration example.

### Mars — Dry nondestructive impression of sandy relief remains unverified
- **mars-resident-refuge-v9 · `contrast-impression`**: Ripple impression sheet + Ripple window → Ripple impression  
  Case `Qdc1bd591e34b`. Version: mapped current featured counterpart.

**Issue:** Shape-copying material and surface compose meaningfully, but dry contact impression assumes cohesion or a suitable substrate/method not specified.

**Smallest correction:** If physical fidelity matters, select and describe a justified substrate/impression method.

**Confidence / limits:** Bounded manufacturer method uses solvent; relevant unconsolidated-sand paper inaccessible. Neither validates exact method nor proves impossibility. Preserve original acceptance of the useful shape-copying operation.

Reference: `AF-sandy-impression-method`. New audit candidate, not a supplied calibration example.

## Not required fixes

### Divinity — Historical speaker owns the opposed-sources necessity
- **divinity-final-reading-scenes-v7 · `two-sources-v2-73`**: No evil can come from a wholly good cause + Case: the same world feeds people and destroys them → Good and evil must have opposed sources  
  Case `Q2811223ade67`. Version: current featured counterpart.

**Issue:** Visible Book of Two Principles writer explicitly advances this argument. Mixed/neutral logical alternatives alone do not establish a gameplay flaw.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-two-sources`. Not a required change.

### Elements — Clockwork can create an ordinary coupling during fabrication
- **elements-basket-continuity-v10 · `clockwork`**: Pendulum + Wooden gear → Clockwork  
  Case `Qa0a4ffdd74de`. Version: mapped current featured counterpart.

**Issue:** iconic complementary components can be coupled by the action; no unused input or affirmative contradiction.

**Smallest correction:** Keep useful clockwork; optional explanation of wheel advancing stepwise under pendulum control, not mandated parts downgrade or extra chain.

**Confidence / limits:** Physical reproducibility remains unverified; original assessment unchanged.

Reference: `AF-challenge-clockwork`. Not a required change.

### Ideas / Atlas — Climate synthesis need not recreate full attribution study
- **atlas-focused-sessions-v6 · `make-human-driven-warming`**: The energy system creates a warming pressure + Instrumental records show a warming planet → Human activity drives the recent warming  
  Case `Q64f9e5f4f02c`. Version: mapped current featured counterpart.

**Issue:** Visible human fossil-fuel chain, CO2 heat-loss mechanism and record supply meaningful roles. A full attribution study is not needed for this teaching synthesis.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-climate`. Not a required change.

### Ideas / Atlas — Ockham does not need its conclusion as another input
- **atlas-focused-sessions-v6 · `make-nominal-kinds`**: Aristotle: form in the particular + One name applies to many distinct things → Ockham: shared concepts, separate things  
  Case `Q46d0cfee00a2`. Version: current featured counterpart.

**Issue:** Visible scene already asks real common nature versus conceptual unity; attributed rival interpretation is intelligible. Requiring full nominalist proposal first risks redundancy.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-ockham`. Not a required change.

### Mars — Authored drip supply is explicit
- **mars-resident-refuge-v9 · `garden-5-irrigation-line`**: Drip line + Camp water system → Irrigation line  
  Case `Q0e0c9d1b4665`. Version: current featured counterpart.

**Issue:** No demonstrated missing water mechanism; keep narrower Connected drip line recommendation.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-drip-water`. Not a required change.

### Mars — Retained camera handles do not prove duplication
- **mars-resident-refuge-v9 · `rover-7-field-camera`**: Camera + Tripod → Field camera  
  Case `Q18ba1c3508d7`. Version: current featured counterpart.

**Issue:** Retained handles do not establish duplication; useful mounting remains coherent.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-camera-copy`. Not a required change.

### Mars — Retained flask does not prove duplicate soup
- **mars-resident-refuge-v9 · `rescue-14-rested-crew`**: Occupied refuge + Hot meal flask → Provisioned refuge  
  Case `Q30d59e050a2a`. Version: current featured counterpart.

**Issue:** No mandatory material change is established; supplied occupied refuge and hot meal have distinct roles.

**Smallest correction:** No mandatory repair is supported.

**Confidence / limits:** The original assessment is preserved; this is the narrower content conclusion.

Reference: `AF-challenge-feeding-copy`. Not a required change.

## Coverage and denominators

- **Original ratings: 1,029** — 535 at 5, 228 at 4, 248 at 3 and 18 at 2. The original low-score total is **266**: 248 at 3 plus 18 at 2.
- **Mandatory contextual queue: 283** — those 266 original low-score flags plus 17 additional checks. All 283 have contextual review in at least one version; zero remain in that queue.
- **Original contextual records: 297** — includes 14 records outside the mandatory queue. These do not add extra queue-completion credit.
- **Separate new or current interactions: 39** — nine scored 3 or below. This is a distinct cohort, not part of the original low-score denominator.
- **Separate lost-response replacement trials: four** — grades 4, 5, 5 and 5. These are fresh replacement assessments, not recovered original grades.
- Original grades remain unchanged. Contextual review and editorial priorities are not replacement ratings.

## Earlier calibration examples

These are your earlier calibration examples, not new discoveries.

- Footbridge map usefulness (`Q791d561f110e`).
- Nails + iron hinge (`Qd807b069652c`).
- Hinge + chest tool chest (`Qe1bec4044ff9`).
- Clay + planks tile (`Q4dba7358acc3`).
- Tile + table tiled table (`Qf19a301e5d26`).

## Limits

- No game source edits have been made, and proposed dependency rewiring has not been tested.
- A meaningful historical, philosophical or artistic synthesis need not be a logically forced deduction.
- Normally selectable earlier editions are identified separately; accepting a featured successor does not clear them.
- Browser evidence does not establish recipe-combine dragging, native-device behavior, human comprehension or physical validity. The reported depot card drag tested repositioning and reader access, not a recipe combination.
- Original grades remain unchanged; editorial priorities are not replacement grades.
