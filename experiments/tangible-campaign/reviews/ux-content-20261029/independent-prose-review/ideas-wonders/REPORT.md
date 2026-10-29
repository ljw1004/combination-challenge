# Independent Atlas wonder review

Frozen inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.

## Coverage

Read every one of the **269 wonder bodies and 269 italic captions** in `atlas-focused-sessions-v6`: 538 distinct visible texts, 8,106 words. The exact texts also occur in 1013 whole-family rows, including reader/caption duplicates; all occurrences are mapped in `all-exact-text-occurrences.json`. Four bounded reading batches are recorded in `coverage.json`. No unread wonder surfaces remain. This is AI editorial review, not human playtesting; no source changes, browser use, or heavy tests.

## Blocking findings

The 16 grouped issues below affect 23 visible fields. `blocking-findings.json` is the machine-readable integration handoff, retaining exact current text and every identical visible occurrence. Suggested replacements are narrow editorial candidates; author/integrator should preserve scientific meaning and validate affected captions/layout. They are not applied changes.

### I1 — milestone-strict-ptolemy-challenged / wonder body
Field: `text`. All exact-text occurrences: 2496.

Current: Venus is observed in both crescent and nearly full phases. That range conflicts with the standard Ptolemaic arrangement of Venus. It rules out that arrangement, not every model in which Earth stays still.

Issue: The wonder names the standard Ptolemaic arrangement without explaining it, so a reader cannot understand why the observed phases challenge it.

Minimal suggested replacement: Ptolemy's standard model keeps Venus on Earth's side of the Sun, so it cannot show nearly full phases. Observing those phases rules out that arrangement, but not every model in which Earth stays still.

### I2 — milestone-industrial-lead-footprint / wonder body
Field: `text`. All exact-text occurrences: 2504.

Current: Lead in blank laboratory tests reveals contamination that interferes with dating ancient material. Comparing older and modern environments turns that measurement problem into evidence of industrial lead pollution.

Issue: “Blank laboratory tests” is unexplained specialist shorthand; the simple no-sample explanation is available in the primitive but missing from the wonder.

Minimal suggested replacement: Lead appears even in laboratory tests without an ancient sample, revealing contamination that interferes with dating. Comparing older and modern environments turns that measurement problem into evidence of industrial lead pollution.

### I3 — plain-atlas-universals-open / wonder body
Field: `text`. All exact-text occurrences: 2624.

Current: A realist account says separate things share a real common nature. A nominalist account groups individuals through names and concepts without such a shared thing outside the mind. Placing them together identifies the disagreement, not a final compromise.

Issue: The first two sentences state the actual disagreement. The final “Placing them together…” sentence is a recipe/author-defense tail and adds no needed uncertainty.

Minimal suggested replacement: A realist account says separate things share a real common nature. A nominalist account groups individuals through names and concepts without such a shared thing outside the mind.

### I4 — plain-atlas-copernican-world / wonder body
Field: `text`. All exact-text occurrences: 1410, 2660.

Current: Earth becomes one moving planet among others. This model offers new explanations for familiar observations rather than discarding those observations.

Issue: The current body calls this a model but never says what Earth moves around or identifies Copernicus. It does not explain the distinct model to a reader who skipped earlier text.

Minimal suggested replacement: In Copernicus's model, Earth and the other planets orbit the Sun. Earth is a moving planet, not the stationary centre of the heavens.

### I5 — plain-atlas-repeatable-wonder / wonder body
Field: `text`. All exact-text occurrences: 1460, 2688.

Current: The optical effect is surprising, but its setup can be examined and repeated. Other people can check whether the same arrangement produces the same result.

Issue: “The optical effect is surprising” never states the effect; the pinhole-box input is required to understand what is being explained.

Minimal suggested replacement: Light passing through a small opening forms an upside-down image inside a dark box. Other people can inspect and repeat the setup to check whether it produces the same image.

### I6 — plain-atlas-newtonian-framework / wonder body
Field: `text`. All exact-text occurrences: 1496, 2706.

Current: Newton joins terrestrial and celestial motion in a common system using absolute space and time. Later theories must explain both its successes and its limits.

Issue: “Absolute space and time” is the core unfamiliar concept but is not explained.

Minimal suggested replacement: Newton describes motion on Earth and in the sky in one system. He assumes space exists independently of the objects in it, and time passes alike everywhere. Later theories must explain both the system's successes and its limits.

### I7a — plain-atlas-lunar-reference / wonder body
Field: `text`. All exact-text occurrences: 1514, 2712.

Current: Observations of the Moon, compared with prepared tables, supply a reference time. This relies on both earlier records and present observations.

Issue: The Moon supplies a reference time, but the current body never explains how its changing position supplies that information.

Minimal suggested replacement: The Moon changes position against the stars as time passes. A navigator can compare its measured position with prepared tables to find the time at a known place.

### I7b — plain-atlas-lunar-longitude / wonder body
Field: `text`. All exact-text occurrences: 1516, 2714.

Current: The Moon can provide the time comparison needed for longitude. This is a genuine alternative to a sea clock, with different demands on weather and observation.

Issue: The wonder relies on earlier explanations of both lunar reference time and longitude; it does not stand alone.

Minimal suggested replacement: A navigator compares the Moon’s measured position with prepared tables to find the time at a known place. Comparing that time with local time gives the east–west position. This is an alternative to carrying a sea clock, but needs a clear view of the sky.

### I8a — plain-atlas-relative-strata / wonder body
Field: `text`. All exact-text occurrences: 1614, 2758.

Current: The layers can be placed in order from earlier to later. This establishes a sequence without yet giving ages in years.

Issue: Neither the current body nor its caption identifies the unspecified layers as rock.

Minimal suggested replacement: Rock layers can be placed in order from earlier to later. This establishes a sequence without yet giving ages in years.

### I8b — plain-atlas-relative-strata / wonder italic caption
Field: `item.label`. All exact-text occurrences: 1613, 2759.

Current: A sequence of deposited worlds

Issue: “A sequence of deposited worlds” obscures the concrete geological meaning with an unnecessary metaphor.

Minimal suggested replacement: Rock layers in order

### I9a — plain-atlas-transforming-species / wonder body
Field: `text`. All exact-text occurrences: 1650, 2776.

Current: Lamarck treats species as changing through use, disuse and inherited acquired changes. His proposed explanation differs from later accounts based on natural selection.

Issue: “Inherited acquired changes” is technical shorthand for the core mechanism and does not explain the contrast with natural selection.

Minimal suggested replacement: Lamarck argues that use and disuse change an organism's body, and those changes can pass to its offspring. This differs from natural selection, which acts on inherited differences already present.

### I9b — plain-atlas-changed-meaning-of-kinds / wonder body
Field: `text`. All exact-text occurrences: 2786.

Current: Lamarck and Darwin–Wallace accounts both allow species to change. Lamarck's use, disuse and inherited acquired changes differ from selection acting on inherited variation. Agreement that species change does not erase disagreement about how.

Issue: This comparison repeats the unexplained “inherited acquired changes” shorthand rather than making the distinct mechanisms intelligible.

Minimal suggested replacement: Lamarck explains species change through bodily changes acquired during life and passed to offspring. Darwin and Wallace's account of natural selection instead concerns inherited differences that affect survival and reproduction. They agree that species change, but differ about how.

### I10 — plain-atlas-electromagnetic-link / wonder body
Field: `text`. All exact-text occurrences: 1738, 2818.

Current: The compass response shows that electricity can have a magnetic effect. Forces need not work through a visible mechanical push.

Issue: “The compass response” never states what the compass does or what was changed in the test.

Minimal suggested replacement: An electric current makes a nearby compass needle turn. This shows that electricity can have a magnetic effect without a visible mechanical push.

### I11a — plain-atlas-frame-dependent-simultaneity / wonder body
Field: `text`. All exact-text occurrences: 2850.

Current: The flashes are simultaneous in the platform frame. In the train frame, equal paths and the same light speed mean their different arrival times imply different emission times. The disagreement concerns simultaneity after accounting for travel time, not just a delayed signal.

Issue: The existing paragraph begins with undefined flashes, a platform frame and a train frame; the central physical setup is absent for the reader who skipped primitives.

Minimal suggested replacement: Two flashes happen at a train's ends at the same time according to platform clocks, but their light reaches a passenger at the train's midpoint at different times. For the passenger, light travels equal distances from the two ends at the same speed. The passenger therefore concludes that the flashes happened at different times.

### I11b — plain-atlas-special-relativity / wonder body
Field: `text`. All exact-text occurrences: 1798, 2852.

Current: Observers moving steadily relative to one another use the same physical laws but need not agree on distant simultaneity. Newton's mechanics remains a useful approximation in everyday conditions.

Issue: “Distant simultaneity” is not defined for the reader; substitute its ordinary meaning.

Minimal suggested replacement: Observers moving steadily past one another use the same physical laws and measure the same speed of light. They can still disagree about whether far-apart events happened at the same time. Newton's mechanics remains a useful approximation at everyday speeds.

### I11c — plain-atlas-special-relativity / wonder italic caption
Field: `item.label`. All exact-text occurrences: 1797, 2853.

Current: No preferred inertial frame or universal distant present

Issue: The original caption stacks “inertial frame” and “universal distant present”; the body does not explain that specialist caption in plain terms.

Minimal suggested replacement: No universal time for distant events

### I11d — plain-atlas-newtonian-limit / wonder body
Field: `text`. All exact-text occurrences: 2854.

Current: Newton's theory uses a common absolute time. Relativity shows that distant simultaneity depends on the reference frame, while Newton's treatment remains a useful approximation in familiar conditions.

Issue: “Absolute time,” “distant simultaneity” and “reference frame” are unexplained here; current comparison depends on prior readings.

Minimal suggested replacement: Newton treats time as passing the same way for everyone. Relativity says moving observers can disagree about whether distant events happen at the same time. Newton's account still works well at everyday speeds.

### I11e — plain-atlas-unequal-passenger-reception / wonder body
Field: `text`. All exact-text occurrences: 3030.

Current: Flashes simultaneous by platform clocks reach the moving train midpoint at different times. This establishes different arrival times. To infer emission times in the train frame, the equal distances and speed of light there must also be considered.

Issue: The late-added wonder still omits the concrete setup and uses platform-simultaneous/train-frame shorthand; it must be read independently too.

Minimal suggested replacement: Two flashes occur at a train's ends at the same time according to platform clocks. A passenger at the moving train's midpoint travels toward one flash and away from the other, so their light reaches the passenger at different times. These arrival times alone do not yet show when the flashes happened for the passenger.

### I12 — plain-atlas-drift-without-drive / wonder body
Field: `text`. All exact-text occurrences: 1830, 2866.

Current: The patterns support movement, but the proposed driving forces remain inadequate. Evidence for a history can be stronger than its current explanation of how it happened.

Issue: The current wonder never names continents or the evidence; “patterns,” “movement” and “driving forces” all depend on earlier text.

Minimal suggested replacement: Matching fossils and rocks suggest that continents once joined have moved apart, but Wegener did not have a convincing account of the force moving them. Evidence that they moved can be stronger than the current explanation of how.

### I13 — plain-atlas-seafloor-spreading / wonder body
Field: `text`. All exact-text occurrences: 1838, 2872.

Current: New ocean floor forms at ridges and moves away on both sides. This process explains the paired magnetic patterns.

Issue: The unexplained “paired magnetic patterns” are the evidence being interpreted, not incidental jargon. The wonder must state what the bands record.

Minimal suggested replacement: New ocean floor forms at ridges and spreads out on both sides. As its rock cools, it records Earth's magnetic direction. Matching bands on opposite sides of a ridge show that the floor has moved outward.

### I14 — plain-atlas-radiative-warming / wonder body
Field: `text`. All exact-text occurrences: 1966, 2936.

Current: More greenhouse gas changes how heat escapes to space. The warming mechanism depends on the gas's interaction with infrared radiation.

Issue: The current body says the mechanism depends on an interaction with infrared radiation, but does not explain that interaction or the heating mechanism.

Minimal suggested replacement: Earth's surface gives off heat as infrared radiation. Greenhouse gases absorb and re-emit some of it, reducing the heat escaping directly to space. The surface and lower atmosphere warm until outgoing heat again balances incoming sunlight.

### I15 — plain-atlas-civ-unequal-status / wonder body
Field: `text`. All exact-text occurrences: 2070, 2988.

Current: Roman law divides people by legal status in ways different from Greek political participation. Comparing the two systems does not make them identical.

Issue: The current body merely asserts that Roman and Greek systems differ, without saying what the Roman statuses are; it requires the primitive to explain the intended distinction.

Minimal suggested replacement: Roman law distinguishes freeborn, freed and enslaved people. Those legal statuses give people different rights and are not the same as citizenship or participation in government in a Greek city.

### I16 — plain-atlas-civ-freedom-practice / wonder body
Field: `text`. All exact-text occurrences: 3020.

Current: The 1801 constitution rejects slavery while maintaining compulsory plantation work. This exposes a limit on freedom at work without erasing the achievement of emancipation.

Issue: “The 1801 constitution” has no country or other identity in this standalone wonder or caption; reader must have retained the prior wonder.

Minimal suggested replacement: Saint-Domingue's 1801 constitution rejects slavery while maintaining compulsory plantation work. This exposes a limit on freedom at work without erasing the achievement of emancipation.

## Non-blocking observations / preserve

- The corrected A12 sea-clock wonder is self-contained: Harrison’s H4, known-place reference time, local noon, east–west longitude, successful trial and unresolved wider claims are all stated. No A12 blocker found in this scope.
- Keep the fictional concepts in the Borges/branching-fiction/fictional-archive wonders. Here fiction is the subject, not an accidental author disclaimer. The text does not leak actual source apparatus.
- The realist/nominalist paragraph already states an actual disagreement; retain that content while deleting its last recipe-defense sentence (I3).
- Scientific and philosophical uncertainties that matter to the claim should remain: stationary-Earth alternatives, chronology versus duration, interpretation limits, imperfect measurements, incomplete accounts of inheritance, unequal rights and emancipation versus compulsory labour.
- Optional polish only: “Industrial power has a material appetite” could be “Industrial power needs fuel”; “An analytical nuisance exposes industrial pollution” could be “Contaminated tests reveal industrial pollution”. Those caption choices alone were not treated as additional blockers.
- This inventory verifies text and caption identity, not actual rendered font/position. Browser/layout verification is outside this review.
