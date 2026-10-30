# Whole-journey narrative and authenticity review

28 October 2026. Independent source-aware review of **Mars v4, Elements v7 and Food v3**, not a new playtest. The frozen candidates, authored routes, continuity evidence, relevant closed logical trials and source-boundary notes were read. No browser/UI testing, live publication or original-candidate editing was done. Exact input hashes and static findings are in `review-evidence.json`.

## Overall judgment

**Keep all three overall arcs. No supported structural rewrite emerged.** Their later work is not merely a sequence of unrelated local puzzles. Existing goal-ancestry evidence reports earlier-created inputs in all **23/23 Mars**, **29/29 Elements** and the Food dependency plan supplies required earlier creations in **19/19 Food** later chapters. I independently read the entire authored recipe sequence and chapter text to distinguish meaningful uses from an inventory token merely being present. This is a narrative assessment alongside existing mechanical evidence, not a fresh exhaustive route proof.

- **Mars:** rescue becomes shared habitation, then an evidence-bearing return. It remains one expedition's continuing survival perspective, even though mission control and named crew roles speak. There is no case for splitting rover and farming into alternating protagonists. The few supported revisions below concern inaccurate or ambiguous text, not a new mission arc.
- **Elements:** tools and infrastructure make a gathering possible; the gathering actually happens, and later navigation/archives serve departing visitors and future travellers. Straightforward making is part of that purpose. Do not turn it into a compulsory strategy/branch-choice game.
- **Food:** one fictional caravan links meals, leftovers, specialist preparations, customers and travel. The station finale is earned through actual cake, filling, preserved-meal and packaging work. **180 goal-route combinations / 195 recipes is already a reasonable “about 200”; no padding is justified.** It explicitly does not claim that this is a historical chronology of invention or documented transmission.

## Mars: whole-story payoff

The continuity is unusually concrete in the revised route:

1. **Ch1–7, contact to rescue:** the `solar-charger` made after landing powers the enclosed melt head (`habitat-0-meltwater`) and the rover (`rover-3-solar-rover`). The actual earlier powered signal is relocated to mark the refuge. `bearing-map → annotated-map → weather-route-map → rescue-route` progressively links observations to finding people, rather than issuing unrelated travel certificates. The old `pressure-patch` repairs the crew refuge (`rescue-0-sealed-refuge`).
2. **Ch8–10, recovery becomes a home:** the occupied/refed refuge is the subject of `camp-message`; the repaired radio sends that personal recording. The rescued crew's hot-meal flask helps make `shared-supper`, and the recovered table becomes the setting of `crew-table-portrait`. Night modifies the **same** restored refuge, with its prepared bed. `night-compare` has explicit matched fictional readings, while `night-fit` uses the actual wall template. The comparison is not a magic ingredient or empty approval badge.
3. **Ch11–14, shared habitation:** the landing `water-canister` primes the process-water loop; the resulting `camp-water-system` waters the greenhouse. The living `propagator` from Ch2, not a freshly granted replacement, enters the nursery. The Ch8 `lit-workbench` receives a real machine, and its capability is used to make the crawler's replacement axle and carrier bracket. These are real uses of earlier work, including non-adjacent reuse.
4. **Ch15–20, exploration and the return route:** the repaired crawler, fitted wheel and earlier map lead into the traverse. The scout's terrain model is checked against local ground observations rather than substituted for them. Ch17 compares the saved ice `core-profile` with a different site's sediment and explicitly withholds shared age/cause. Ch18 revises the basin story using separately sourced views/specimens. Ch19's preserved `weather-record` helps explain misleading tracks; the old `protected-controller` actually runs the depot hauler. That hauler docks the heavy oxygen module in Ch20.
5. **Ch21–24, return with a history:** the serviced oxygen module belongs to the restored ascent cabin; the earlier radio is used for the agreed rendezvous. The original ice specimen, sediment, separate comparison case, field records and supper portrait enter the return package. The final ship carries that package and the crew to the orbiter. Thus the ending pays off rescue, workmanship, observation and personal memory together.

Caches mostly have sensible local ownership and contents: the relay's matched fuse/antenna/powerpack, the camp's stored machine, and the nursery cultivation kit are not implausible fresh deliveries or disassembled parts for their own sake. Generic “recovered … from [chapter title]” descriptions are weaker than those specific explanations, but do not by themselves prove a mechanical problem. Most scientific outputs preserve observable results or actual records; a bland label alone is not an empty badge when its description supplies the result and uncertainty.

### At most three bounded revisions

**M1 — definite story/source inconsistency: remove the unearned radar claim.**

- Exact target: Ch17 `buried-story.motivation`, opening “The radar marks a buried boundary.”
- Exact evidence: `radar-head` exists only as an item and an optional `crawler` slot acceptance. The final v4 has **no recipe using, producing or installing it and no initial/cache grant**. The authored Ch16 route uses `ground-probe + @channel-approach → ground-profile`, not radar. Ch17 uses `lined-core-drill + @layered-basin → sediment-core`.
- Minimal replacement: **“At the layered basin, recover a core with its layers in order and keep a labelled portion. What changes from one layer to the next? Compare it with our saved ice profile without assuming the sites share a history.”**
- This states only an already-established location and task. Do not invent a radar grant, new survey result or extra chapter.

**M2 — definite cache-description inconsistency, plus a separately identified spatial ambiguity: distinguish the orbital destination from surface stores.**

- Exact targets: Ch24 `homebound-cache`; `orbital-cabin.description`; `orbital-hatch.description`; `homebound.area.travelText`.
- `homebound-cache` calls its full list recovered mission stores, including `orbital-cabin`. The item says “Recovered orbital cabin from a light that answers.” But `homebound-12-docked-vehicle` joins `ascending-vehicle + orbital-cabin` at the waiting orbital rendezvous; `homebound-13-reunited-crew` then crosses `@orbital-hatch`. The ascent itself **is already narrated correctly** in `homebound-11-ascending-vehicle`; no flight mechanic is missing.
- Minimal text should call the depot objects surface equipment and the orbital cabin the waiting destination. A candidate with the exact replacement strings and JSON diff is provided separately for parent review. All acquisition lists, item IDs, recipes, objectives, transition semantics and routes remain unchanged; only the specified descriptions/scene prose change.
- **Related ambiguity, not a demonstrated contradiction:** Ch23's `departure-8-camp-handover-beacon` physically leaves a maintenance card at camp, although surrounding chapters concern the ascent depot. Generic departure travel text does not explain the final camp visit or a remote handover. A remote maintenance capability is not established and must not be silently invented. The parent explicitly chose a narrated final camp visit, followed by return to the ascent depot. The new copy candidate makes that trip explicit in Ch23/24, identifies the camp departure stores, and removes Ch24's redundant instruction to complete a handover already required by Ch23. This is an approved narrative clarification, not a claim that the original text already said it.

**M3 — definite low-severity physical-state wording mismatch, already noticed in the fresh Workshop evidence.**

- `workshop-11-mounted-sample-carrier` creates `mounted-sample-carrier` from `sample-carrier + mounting-bracket`; only the next recipe, `workshop-13-science-crawler`, actually installs it on `crawler`.
- Rename the visible pre-install state to **“Bracketed sample carrier”** and describe it as **“The protected carrier with its mounting bracket attached, ready to fit to the crawler.”** Preserve its internal ID and all slot/recipe semantics.
- `workshop-9-sample-carrier` and its output description also mention an “unknown atmosphere inside a food container”, although the actual inputs are a specimen carrier and latch. Replace that stray copy with **“Close the padded specimen carrier with its fitted latch.”** This is one tiny Workshop-copy cleanup, not a new assembly requirement. It is not included in the independently requested M1/M2 copy candidate.

## Elements: whole-story payoff

The opening's stone, pottery, timber, fiber and cloth become everyday equipment, not symbolic prerequisites. The mill introduces powered work; the baker and orchard supply a journey; bridge/landing/lighthouse observations form a continuing geographic record. The greenhouse and irrigation explicitly concern the same garden. Cloth and wood become shade and public performance spaces; the boat becomes a mailboat; lenses lead from pond observation to plant description and eventually a steady telescope. This is a connected storybook world, not a factual technology chronology.

The later six chapters do **not** postpone the gathering indefinitely. Ch22 visitors drink and wash; Ch23 cooks wash at the earlier stand; Ch24 the earlier tiled table holds a shared meal that the player is invited to join. Ch25 preserves visitors' gifts, Ch26 prepares evening lights, and Ch27 calls the homebound boats. Ch28's `harbour-map + star-chart → navigation-chart` gives the late crews an actual route. Ch29 uses earlier pictures for a public gallery. Ch30 joins `navigation-chart + weather-book → river-atlas` and places the earlier floating lantern at the landing. Maps, observations, artifacts and people return in the ending.

The `pond-life-study` is an actual observed swimmer/speck account, not an “observation complete” certificate. The flora compares specimen and drawing. The weather record contains rain and wind rather than granting a prediction from one instrument. The final atlas has content accumulated from the journey.

### One bounded revision

**E1 — definite instruction/goal mismatch: the potter does not require a newly built kiln.**

- Ch8 `pottery.motivation` requests “Build a kiln and finish a glazed bowl and tiled tabletop.” Its actual goals are `glazed-bowl` and `tiled-table`. `glazed-bowl` is gated by the existing `@kiln-yard`, described as the place where the potter controls firing, not by item `kiln`. The authored route first makes `brick + fire → kiln` in Ch9 for `forge`.
- Minimal replacement: **“The gathering needs a table that will survive a thousand suppers. Finish a glazed bowl at the potter’s kiln yard and make a tiled tabletop.”**
- No extra kiln obligation, recipe, step, engine rule or arbitrary choice is warranted. A one-field copy-only candidate is in `elements-copy-correction/`. No second supported high-value revision was found.

The fact that an early creation is sometimes a prepared material, such as `cloth` or `planks`, does not make its use meaningless: these were made by the player and their properties carry into later objects. Conversely, ancestry alone does not prove pacing or pleasure. Ch5's sack uses previously prepared flour rather than requiring a second milling gesture; that abstraction is not sufficient evidence to add a compulsory “operate the mill” token. Likewise, do not add a grain-bin-filling chore just to literalize a completion sentence.

## Food: whole-story payoff and historical honesty

The required earlier preparations matter in all nineteen later kitchens. Bread becomes toast, soup, crumbs and pudding; the same earlier butter/stock/pastry/fruit preparations take materially different roles. Ch7 distinguishes cold pastry crumbs and laminated dough from Ch8's hot roux. Ch10's almond/sugar mixture later enters macarons; Ch11's pouring custard and starch-thickened pastry cream have different uses; Ch12's hollow choux takes fillings, then chocolate; Ch13's sponge/egg foam reaches both elaborate desserts and the small-cake batch. These are recognizable preparations, not names for arbitrary bags of ingredients.

In particular, **Ch18–20 now has an actual sequence of needs and consequences**:

- `filled-stew-tin + @controlled-stew-line → processed-stew-tin` preserves the old bean supper for the delayed-food-cart problem.
- At the station, `processed-stew-tin + opener → opened-stew`; `opened-stew + soda-bread → canned-lunch` feeds the bakery crew. The story does not immediately open every preserved product before travel, and the fruit tasting has a separately stated local purpose.
- `sweet-egg-foam + sifted-flour → line-batter`; `line-batter + oblong-mould → moulded-batter`; baking produces the matching `golden-sponge` batch. The earlier preparation supports a new useful scale/shape, not a “precision approved” badge.
- Actual `vanilla-filling` is fitted into `injector`, which fills the earlier sponges. A printed wrapper finishes `twinkie`. V3's portable finish avoids inventing a fixed-location requirement for a hand-held operation.

The kitchen caravan is a deliberate fictional co-location of techniques, with acknowledged compressed time and managed portions. It is **not** a claim that a single cream/foam batch safely persists through real elapsed weeks. The source notes explicitly separate contextual history, 29 method-supported recipes and 166 authored reconstructions; no invented proof of historical transmission is used as a success condition. Evelyn's lettuce claim is optional attributed reading, not a required humoral “truth” token. Sugar's exploitative production history is visible without making it a crafting reward. The endpoint is explicitly a Twinkie-inspired model, not the branded formula. No new public source claim was necessary to diagnose the internal-copy findings, so no private content was sent to web search.

### One bounded copy revision; no supported gameplay revision

**F1 — definite cache-copy mismatch: the whisk arrives in Ch12, not Ch11.**

- Ch11 `custard-stocks.narrative` promises vanilla, starch “and a whisk”; the cache grants `egg-yolks`, `vanilla`, `starch`, `egg-whites` only. `whisk` is first granted by Ch12 `choux-stocks`, whose narrative currently omits it.
- Ch11 replacement: **“The cook has separated eggs into yolks and whites and supplies vanilla and starch.”**
- Ch12 replacement: **“The pastry cook supplies a whisk, with a saucepan and oven ready; eggs and cream are already in the collection.”**
- Keep acquisition timing and recipes unchanged. A two-field copy-only candidate is in `food-copy-correction/`. The pudding cook's ordinary offstage whisking does not itself need another player tool action. No second supported high-value revision was found.

## What this evidence cannot establish

The reviewed logical-trial files corroborate narrow practical effects: Mars Night and Workshop completed with the retained refuge/bench objects; the Elements v7 participant stopped satisfied at the shared meal; the Food v2 later-kitchen participant carried the tin and reached the cake after two now-removed location-gate rejections. V3's correction is a source-aware counterfactual replay, **not a fresh v3 human trial**. The Elements record also preserves its real invalid guesses and historical lifecycle surprises; this review does not erase them.

These records do not establish whole-game human enjoyment, strategic depth, ideal length, mobile readability or native UI usability. Comfortable straightforward making can be enjoyable; an author-route pass cannot prove it is. The supported result is narrower: **whole-journey continuity and recognizable payoffs are present, with a small set of concrete text corrections rather than a case for broad redesign.**

## Stopping condition

All 74 chapters and complete authored creation chains were inspected. Findings are bounded to three Mars, one Elements and one Food revision clusters. Original bytes remain unchanged. No external process is pending for this review; the three new copy-only candidates are explicitly awaiting the parent's adoption decision, not deployed or integrated. `copy-candidate-summary.json` records the exact old/new hashes, and `verify-review.py` independently checks each exact diff and original integrity.
