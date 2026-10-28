# 28 October 2026 — narrow v3 recheck

**Candidate:** `atlas/revision-v3-observation-payoffs/scenario.json`  
**Reviewed SHA-256:** `048950ee0da2457f33df012446ce81167104a661337fbb65a8b37054dd9fcf82`  
**Scope:** independent recalculation of longitude premises, conventions, signs and ranges; independent local-time dependency checks; circulation's replenishment premise; short checks of the previously missing jaw/future payoffs. The original `LATER_STORY_PAYOFFS.md` remains unchanged.

## Verdict

**The earlier longitude causal defect is fixed. The stated central values, signs, worst-case ranges and hazard-meridian comparison are correct under the explicitly fictional premises.** Both longitude methods now require the current local observation, while each can work without the other method's instrument/data. The one-way circulation model now contains the missing replenishment bound. The adult lower-jaw observation is explicit.

No blocking mathematical or causal-content error was found within this narrow recheck. This is not a whole-campaign approval, browser check or fun test.

## Independently recomputed from scenario labels/readings

The numbers below were parsed from the actual input definitions, **not** taken from `case-values.json`, the author's reported outputs, or the output labels as ground truth. Reproducible extraction/calculation and branch evidence are in `v3-narrow-recheck-20261028.mjs` and `.json`.

### Clock method

Inputs:
- `sea-clock`: **14:06 mean** at the common observation instant.
- `equation-time`: **apparent = mean − 2 minutes**, stipulated exact for the exercise.
- `local-noon`: **12:00 apparent ±20 seconds** at the same instant.
- `rough-voyage`: **+6 seconds/day × 20 days**, with **total ±20 seconds residual**, independently estimated rather than fitted to the lunar answer.
- `rotation-card` / `time-angle-rule`: **360°/24 hours = 15°/hour**; reference solar time later than local means west.

Calculations:
1. Before rate correction, 14:06 mean − 2 minutes = **14:04 apparent**.
2. Reference minus local = **124 minutes**; 124 × 15 arcminutes/minute = **1,860′ = 31° W**.
3. The clock gained **120 seconds = 2 minutes**. A fast clock requires subtraction: corrected apparent reference time **14:02**, or subtract **30′** from the uncorrected west longitude.
4. Corrected centre = **30°30′ W**.
5. Worst-case error = 20 seconds clock residual + 20 seconds local observation = **40 seconds**. At 15′ per minute, this is **±10′**.
6. Corrected band = **30°20′–30°40′ W**.

The arithmetic does not mistakenly add the fast-clock error or subtract the equation-of-time adjustment twice.

### Lunar method

Inputs:
- `lunar-distance`: observed **45°20′** before clearing.
- `lunar-clearing`: supplied net **+10′**, residual **±1′**; it explicitly stands for, rather than reconstructs, the full reduction.
- `nautical-table`: apparent reference time **12:00 → 44°29′**, **15:00 → 45°59′**, with **linear interpolation stipulated**.
- The same independent `local-noon` and time-angle conversion.

Calculations:
1. Cleared observation = **45°30′**.
2. Table slope = (45°59′ − 44°29′)/180 minutes = **90′/180 = 0.5′ per minute of time**.
3. Observation exceeds the first row by **61′**; 61/0.5 = **122 minutes**, giving **14:02 apparent reference time**.
4. ±1′ angular error becomes **±2 minutes reference-time error**.
5. Reference minus local = **122 minutes**, hence **1,830′ = 30°30′ W**.
6. Worst-case time bound = 2 minutes + 20 seconds = **140 seconds**, hence **±35′**.
7. Lunar band = **29°55′–31°05′ W**.

The output `lunar-reference-time` explicitly says this is not yet longitude. Neither an uncorrected angle nor reference time alone is now called a position.

### Comparing the answers

`position-comparison` accurately records the shared local-noon observation, so it does not treat the two error bars as fully independent or average them into false extra precision. The wider lunar band contains the narrower clock band.

The fictional `chart` marks **30°45′ W** and explicitly says this is longitude along an already chosen route, not a complete latitude fix. The whole clock band lies east of that meridian; its nearest edge is **5′** east. The uncorrected **31° W** point lies west of it. `navigation-chart` therefore makes a specific supported contrast without claiming a complete real-world safety assessment.

### Time convention and historical bounds

`nautical-table` uses **Greenwich apparent time**, not an anachronistic mean-time almanac. `sea-clock` uses mean time and is explicitly converted before comparison with apparent noon. The readings disclose modern midnight-based 00–24-hour notation and an invented day 20 of an imagined 1768 voyage; no actual 1768 ephemeris date is claimed. USNO independently places GMT's appearance in the British almanac in **1834**, supporting the distinction retained here. [US Naval Observatory chronology](https://aa.usno.navy.mil/publications/na_history).

The exact equation-of-time correction, clearing result, linear table and error budgets are **stipulations**, not newly verified historical measurements. That is appropriate to this bounded teaching case. I did not solve a full spherical reduction or assert these are deployable navigation observations.

## Dependency checks, including adversarial cuts

The verification replay first follows **133 accepted authored actions** to the genuine longitude chapter start; it does not invent its earlier-created supplies.

- Complete `lunar-longitude` with `sea-clock` removed from an in-memory test copy: **passes**.
- Complete `corrected-clock-position` with `lunar-distance` and `nautical-table` removed: **passes**.
- Remove `local-noon`: the lunar branch reaches `lunar-reference-time` but is rejected at `make-lunar-time-difference`.
- Remove `local-noon`: the clock branch is rejected at `make-time-difference`.
- An all-recipe reachability closure with `local-noon` excluded reaches lunar reference time but **cannot reach either longitude or the corrected clock position**. There are no alternate producers bypassing those comparisons.

These removals affect only independent in-memory audit copies, not the candidate or a play session. The branch tests use the candidate's frozen runtime; this addendum does not independently certify the newer integrated lifecycle runtime.

## Other exact original findings

### Circulation — missing premise fixed

`blood-stock` now states **5 L initially + at most 1 L newly supplied within the same half-hour**, explicitly for the rival one-way teaching model. Thus its maximum passage is **6 L**. Independently, 5 mL/beat × 60 beats/minute × 30 minutes = **9 L**, exceeding that bound by **3 L**. `replacement-problem` limits the conclusion to that model rather than every conceivable replacement mechanism.

`valve-record`, `directed-vessels` and `circulation-route` now specify venous return/outward arterial delivery and show **heart → arteries → unseen tissue link → veins → heart**. `circulation-limits` combines the route with the quantity problem directly, rather than requiring the old jaw correction as a disclaimer token. The jaw edition's remaining reuse is explicitly its observation-versus-claim recording format, not an alleged vascular map. The previously identified inference gap and mistaken object identity are addressed.

### Anatomy — missing observation fixed

`adult-jaw` visibly says **“one continuous bone across the chin”**; its reading identifies an adult-human united midline. `anatomical-discrepancy`, `corrected-plate` and `anatomical-commentary` retain the actual opposing claims. The C/D manuscript reuse now concretely preserves displaced wording alongside the correction; it supplies no anatomical evidence. This closes the particular missing-observation finding without requiring artwork.

### Futures — short content spot-check, not full re-audit

The previously unspecified results now exist:
- Observatory: row **01** separates light-only and fresh-food models; a later **00** glow defeats both. The next question compares an empty bay under stored-resource versus sensor-echo accounts, using an explicit equal-weight scheduling assumption; the final item supplies the **dark empty-bay result**. The two original models are no longer silently conflated.
- Memory: **Mira's welcome and Tovan's exclusion** are experienced separately; the exchange leads to a two-entrance invitation and a new joint episode. The former naming/recognition tail has become an act that changes the shared experience.
- City: the record now has **12 produced, 8 distributed, 4 stored versus 6 needed**; winter changes **A12/B4 → A10/B7**; repair then changes available harvest to **A7/B7**. The final operation retains the lower harvest and changes the allocation/schedule rather than declaring the old total restored.

These are actual authored answers to the old “what changes?” questions, not a new compliance checklist. Whether they are enjoyable or sufficiently inferable remains untested by this review.

## Remaining limits

- **No remaining blocking issue found in the requested calculations or dependency premises.** This conclusion is scoped to the SHA above.
- The broader campaign, alternative discovery experience, prose burden, layouts, actual reading interactions, and full current-policy engine behavior were not newly audited here.
- Smithsonian's linked page returned a request-rejection page, and ESO's linked page returned a server error during this pass. I did not treat those failed fetches as verified source contents. The prior audit's accessed primary/authoritative navigation sources and the independently accessed USNO chronology support the relevant method/time distinctions.
- Candidate, old report, old evidence, Site and remote state were not modified.

---

## Final-hash rerun — 28 October 2026, 04:13 UTC

After the author completed the announced worksheet/draft lifecycle refinements, I reran the **same independent input extraction, calculations, graph cuts and four runtime branch tests** against final scenario:

`4ab40e93a67338b48189459b97a4b2ce730e22fccae76e26febb64e5fe93af52`

**Results unchanged and passing:** raw clock 31° W; corrected clock 30°30′ W ±10′; lunar 30°30′ W ±35′; whole clock band east of the fictional hazard. Each branch works without the other's instrument/data. With `local-noon` removed, both longitude results remain unreachable and their explicit local-time combination is rejected. Lunar reference time remains correctly obtainable before that comparison. Circulation remains 9 L passage versus a 6 L one-way maximum; the adult-jaw observation remains explicit.

I also inspected the final `corrected-clock-position` and `lunar-longitude` readings: their completed worksheets retain the actual time/angle calculations despite intermediate drafts transforming. `local-noon` is retained in both comparisons, so the same observation remains available to the other method.

The earlier `.json` evidence is preserved. Final-hash evidence is `v3-narrow-recheck-20261028-4ab40e93a673.json`; the exact reviewed final scenario is copied read-only as an audit input to `v3-scenario-4ab40e93a673.json`. The script now writes hash-specific evidence rather than replacing prior runs.

**No additional blocking issue found.** This final-hash statement covers the same narrow scope and frozen-runtime branch tests, not a fresh fun trial, full lifecycle regression audit, or whole-campaign endorsement.

---

## Repinned data recheck — 28 October 2026, 04:21 UTC

**Current reviewed data SHA:** `32bf92361c06ddc5b8984775e7e129b44a8427a9f5486090586712a5daa91df9`. This supersedes the preceding “final-hash” section as the current candidate identity; earlier snapshots and evidence remain preserved.

I independently diffed the exact saved `4ab40e93…` scenario against these bytes. The change is confined to the reported longitude refactor: remove `observed-sky-angle` and its producer; add `lunar-time-scale` and its producer from `nautical-table + predictive-sky-record`; make raw `lunar-distance + lunar-clearing` directly produce `cleared-lunar-angle`; feed that cleared angle and the new scale into reference time. The corresponding lifecycle/reference text and longitude carry list change. **No other chapter, numerical premise, output range or local-time comparison changed.** Exact ID-level delta: `v3-delta-4ab40e93a673-to-32bf92361c06.json`.

The independent arithmetic, reachability cuts and four branch tests all **pass again**. Results remain **31° W raw**, **30°30′ W ±10′ corrected clock**, and **30°30′ W ±35′ lunar**. Each method still works without the other method's instrument/data; removing current `local-noon` blocks both longitude results while leaving lunar reference time reachable. The new scale correctly derives **90′/180 minutes = 0.5′/minute**, with the actual baseline rows retained in its reading.

I additionally tested raw angle + clearing as the **first operation on entering longitude**, before creating the scale or any observation-row wrapper: accepted, creating `cleared-lunar-angle`, with both raw sources retained. Thus the reported direct-clearing affordance exists mechanically, not only in the recipe description.

Evidence/input snapshot: `v3-narrow-recheck-20261028-32bf92361c06.json`, `v3-direct-clearing-32bf92361c06.json`, and `v3-scenario-32bf92361c06.json`.

**No new blocking issue found in scope.** These results certify scenario-data arithmetic and the frozen-runtime branches only. A separate session-hash-lock change to the player harness is not tested or certified by this data recheck. No fun test or broad new audit was performed.
