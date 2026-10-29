# Independent review of additive bowl correction v2

29 October 2026. Informed independent adversarial review, not blind playtesting.

## Decision: accept the bounded correction; B1 resolved

**Accept this exact v2 delta.** Removing the unsupported Bell → Dinner bell branch is a better repair than inventing a foundry mechanism for a dried, unfired bowl. It removes the problematic dependency instead of disguising it, preserves the timekeeping chapter's useful work and earlier-item continuity, and lets the same formed bowl actually transform into its fired state at the kiln. I found no new blocker in the correction.

The previously accepted five families are not reopened. The press's **10/17** mill density remains the documented concern, not a small-set pass. Mounted-lamp identity remains unresolved and unchanged. Adjacent Cooking-pot and formed-jar food-storage mechanisms are not declared solved. This is local content acceptance, not release/publication approval or a human-comprehension/fun claim.

## Pinned artifact and scope

Source root: `/workspace/shared/authenticity-repairs-bowl-v2-20261029/source`.

- Review packet: `experiments/tangible-campaign/research/authenticity-repairs-bowl-v2-20261029/REVIEW-PACKET.json`.
- Packet SHA-256: `03e591cc143cd293b35f499bf82245df4c15868ae7678f61f0189bad5dd37b6e`.
- Source manifest: `/workspace/shared/authenticity-repairs-bowl-v2-20261029/evidence/CANDIDATE-V2-SOURCE-MANIFEST.json`.
- Manifest SHA-256: `bab7052d4b503b9bd73e80c48cfee0cd09a0ec577f4f78417199a7a983beda53`.
- **All 2,297 manifest files independently verified; zero mismatches.** Receipt: `seal-verification.json` beside this report.

The original v1 remains exact, including its failed-scope candidate and my earlier review. The new module is `ui/stories/authenticity-repairs-v2.ts`, exporting Elements identity `elements-material-repairs-v6` and unchanged Mars/Atlas exports. The registered catalogue remains untouched.

## Adversarial delta check

I compared the fully composed v1 and v2 scenarios, not merely their prose reports. Changes are limited to the successor identity/entry-cue IDs, the two removed items/recipes, the removed terminal goal and its story/milestone references, the bowl lifecycle explanation, relative-rain wording, checkpoint action deletion and a historical note. Locations, stock, initial primitives and hotspots are unchanged. The only surviving whole-word “bell” text in the composed v2 is the explanatory historical note; there is no dangling executable or player-facing bell promise.

### Removal consequence and remaining goal

`Bell` had only the `Dinner bell` consumer; `Dinner bell` terminated at the timekeeping goal. Neither is a prerequisite of the subsequent stargazing, exhibition or final gathering work. The canonical route removes exactly the two v1 actions at indices 214 and 215, preserving all other actions in order: **233 → 231** actions.

The timekeeping chapter still asks **Make ferry timetable**. It makes Pendulum → Clockwork → Clock and combines Clock with the earlier River map. The chapter cue still asks which way to go and when boats leave, so it continues to match the work. The keeper's revised completion calls departures from the recorded timetable rather than conjuring a bell. The existing person reading/calling times is ordinary narrative use, not a hidden crafted mechanism or extra inventory. The iron milestone no longer promises bells.

This is not an empty chapter, a removed journey, or a fake reset to conceal objects. The earlier map remains meaningfully reused. Removing a redundant terminal craft goal is warranted here; there is no need to preserve recipe count by replacing it with another wrapper.

### Remaining formed-bowl consumers and physical state

Exactly three direct consumers remain:

1. Fiber + Formed clay bowl → Basket.
2. Clay + Formed clay bowl → Clay jar.
3. Formed clay bowl + Glaze at kiln → Fired glazed bowl.

The mandatory bakery and orchard work already establishes Basket and Jar before this kiln action on the earned route. The late unsupported metal-forming use is gone, rather than shifted to a different label. The existing event-local `transform` can therefore retire the formed bowl **at firing**. No exclusivity flag, retroactive future-use cleanup, runtime mutation or extra apparatus was added.

Independent reproduction confirmed at widths 320, 375 and 390 that firing removes the loose formed bowl and places the fired bowl at its exact former position/location. Undo restores the earlier state. JSON, legacy-v1 and CCSP1 restoration preserve it. Every later planned visit stops requesting the unfired bowl, and the remaining complete route never resurrects it. This directly resolves the earlier side-by-side formed/fired remnant that was retained for Bell.

Basket and Jar descendants are unchanged. Fired-bowl wet consumers remain the already-reviewed paint, pond sample, brine, drinking-water, oil-lamp, washstand and Cooking-pot branches. The latter's broader mechanism remains expressly outside this correction; v2 neither introduces nor claims to resolve it.

### Carry and the optional brine route

The optional brine apparatus is not silently auto-imported. Reproduction starts from the earned saltshore entry, finds the actual fired bowl in its earlier location, explicitly relocates it, checks the normal tidal-shore partner highlight, drops it to produce Brine, obtains Salt, and rejoins the canonical route to completion. The bowl remains available for later independent uses. Undo and all three save encodings preserve the tested state.

This closes the specific optional branch gap noted in my v1 review without adding stock, pretending a remote object is already local, or broadening carry to make the board larger.

### Rain wording

The narrow wording correction follows the already accepted relative collector semantics through Rain record, Wind record and Weather record. It adds no calibration claim, observation card or action. My minor M2 terminology suggestion is resolved.

## Verification actually reproduced

A scratch copy of the candidate's test file changed only import/root URLs and its results destination. The tested implementation was the sealed v2 source; no candidate file was edited or written.

Command:

`node --test --test-name-pattern='three candidates have|v2 is additive|all formed-bowl consumers|firing replaces|optional brine/salt' /workspace/shared/review-authenticity-bowl-v2-20261029/focused-readonly.test.ts`

**5 selected tests passed; 0 failed; exit 0; 4.292 seconds.** Log: `restricted-tests.log`.

These selected tests cover schema/lifecycle/goal/construction/graph declarations; exact sealed-v1 preservation and distinct save identity; the complete consumer/removal delta; three-width firing/Undo/serialization/later-carry/full-completion behavior; and the optional brine/salt detour with later completion. This was a bounded reproduction of the author's assertions, not a new blind experiment.

The author separately reports **20/20 full focused tests and a successful build**. I inspected those logs but did not rerun the full suite or build while the creature worker owned the heavy-test slot. I communicated the bounded short check and its terminal completion; no test/build process remains from this reviewer.

Numeric bounds, engine replay and synthetic bindings are not native pixels or human discovery evidence. No physical-production, safety or calibrated-measurement claim is made. No source mutation, GitHub, Sites or other publication action occurred. No access/permission blocker occurred.
