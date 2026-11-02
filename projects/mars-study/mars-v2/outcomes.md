# Mars v2 review outcomes — 2 November 2026

This records the original v2 review pass. The user subsequently rejected the version and asked to preserve it for rethinking; the illustrated story is restored at the main URL. Positive agent findings below are historical evidence, not user acceptance. **Mars: What the Ice Kept** remains in this directory as a separate experiment. It is a complete, compact solo survey: prepare a station and crop, collect contrasting ice samples, compare them, discover a long-dead animal under microscopy, harvest lettuce and return both cores to the orbiting laboratory. The [v2 design brief](design-brief.md) records this experiment’s intent. The parent [story-design guidance](../story-design.md) owns the user’s current direction.

## Scope and delivered graph

The baseline at `a12ee144` had 28 chapters, 317 item identities and 186 explicit recipes. The replacement has seven chapters including the ending, 20 identities and 12 explicit recipes. Eight primitive identities arrive in two coherent preparations: six at the beginning and two for departure. Four intervening playable chapters use existing equipment and derived objects. The largest observed working set is six opening items; subsequent playable scenes peak at three.

All movable things use text rendering. Two existing backgrounds are reused. No artwork was generated, no binary deliverables were added, and the earlier artwork collection remains available as historical material. Flight hardware, the rover and station infrastructure are supplied context; there are no spacecraft-on-spacecraft combinations, rescue chains, photographs, report tokens or small fitting sequences.

## Review loop and decisions

Four director reviews, three separate sequential blind readers, two fresh logical players, repeated scientific/composition audits, an independent gameplay editor and a phone-screen review informed the work. Detailed responses, packets, frozen sessions and captures were temporary. [Assignments](review-instructions.md) preserve the reviewer instructions; the conclusions here are summaries, not replayable historical evidence.

The initial outline and first playable draft revealed the animal early, then sent the surveyor out for a neighboring core. Readers found the reveal compelling but the return trip's conclusion largely already known. The science editor independently identified the same inference problem. We rejected adding another animal, a disaster or an instrument merely to supply a second climax. The final structure collects both samples for an ordinary stated comparison before discovery. Shared illumination reveals an unusual shape; microscopy answers the resulting question. The clearer sample provides comparison material, not proof of origin or age.

Other adopted fixes give the player ownership of operations instead of narrating their completion in introductions; establish the receiving laboratory in orbit; explicitly bridge growing time; acknowledge communication with the ship; supply the waiting ration at the galley; and remove reviewer-facing certification language. A blind-reader packet in the first round accidentally omitted the Mars title/description. Its resulting location ambiguity was treated as a presentation defect, not independent evidence that the manuscript itself omitted Mars; later packets included the actual parsed title and description.

The final blind reader's continuation ratings were 3, 3, 4, 5, 4, 3, 4. These are attributed reactions, not a validated scale or an average fun score. The unfamiliar outline, anatomy reveal and shared silence earned attention. The reader still wanted more investigative responsibility and found the meal-to-packing stretch quieter. Source-aware gameplay and scientific reviewers accepted the revised operations. They recommended keeping the short harvest as a payoff to planting and the two carrier operations as actual care for the specimens, while retaining the pacing criticism for human evaluation.

## Player-only evidence

Both fresh agents used only ordinary logical observations, goals, partner hints and optional item readings. Completion was optional. Their records were replayed with their frozen runtime before being discarded. Neither participant was given a developer witness. Both reached and chose to stop at the ending.

| Run | Accepted combinations / placements / reads / dismissals / advances | Main outcome |
|---|---|---|
| First playable draft | 13 / 5 / 4 / 13 / 7 | Clear and interesting reveal; repeated coring, abrupt elapsed time and defensive carrier wording weakened the middle/end. One rejected move was an assignment's missing CLI schema, corrected with protocol-only help. |
| Revised survey | 12 / 5 / 2 / 10 / 6 | No rejected actions. Lamp observation motivated microscopy (events 17 → 22); both cores' continuity and the growing timeline were understood. The player wanted more investigation after the reveal and called mandatory supper a slight detour, while valuing its setup and the ending. |

The second report initially used a list instead of the evaluator's criteria map. The same player resubmitted unchanged assessments and references in the required schema; the corrected evaluation replayed successfully. This was a report-format correction, not a new playthrough.

| Experience criterion | Revised player's assessment | Decision and limit |
|---|---|---|
| Intelligibility | Supported | Keep the stated purposes and small working sets. Logical success does not establish touch discoverability. |
| Learning | Supported | Keep the physical comparison, observational escalation and retained context. Fictional anatomy is not evidence about actual Mars. |
| Construction | Mixed | Keep coarse useful operations; do not claim open-ended construction or inflate the count. |
| Pacing | Mixed | Retain the short crop payoff and return. Test the quiet denouement with the user. |
| Continuity | Supported | Keep the growing timeline, planned flight and actual paired samples. |
| Choice | Concerning | Most actions have one productive next use. This is a guided combination story, not a scientific simulation with consequential branches. |

The main counterexplanation remains credible: the novelty of finding an animal and the prose may account for much of the interest, while goals and partner hints make the route easy to follow. No agent report proves human enjoyment. Adding arbitrary dilemmas or another find would not resolve that question. The original next test was the user's ordinary play. Their subsequent rejection takes priority over the favorable agent findings; rethinking remains in the [backlog](../../../projects/backlog.md#mars-story-development).

Frozen manuscript SHA-256 values:

- First playable: `cbf2e9bd3b84e0b977a1b08d7e6a520c431c8e3c49708782222029c498d32512`.
- Revised player/blind version: `58dab509338fe036ff89a3a9a94b13110c64acd4c375b14b63ab383a224d4a26`.
- Delivered manuscript: `a2023bf3ff0cdf87fab403a9656157c5cf6f34ddb95d1244b7d973dbbf04f413`.

Both player runs used runtime `6af29585fe8a0cdbf17db7a6ef40563ec759b4d9c7495f369dbaac9f4195cbef`. The delivered text differs from the second run only in three prose corrections: remove “complete” from an introductory equipment phrase, use a month for the harvest interval, and restore “sample freezer” as the audible callback. Recipes, supplies, goals and placements are unchanged.

## Technical verification

All 166 Node tests and 132 Chromium checks passed. Production build, TypeScript checking and story lint passed; Mars has zero errors and zero warnings. Existing author-review warnings in Cookbook, Ideas and Settlement, and the JavaScript bundle-size warning, remain. Generic browser tests now use a small interaction fixture rather than the retired Mars plot. The former stronger-camera continuation regression retains its semantic boundary in a small synthetic story. No application runtime or UX behavior changed.

Two complete browser routes used real pointer drags, ordinary advancement and saved-state reloads at 390 × 844 and 320 × 844. The narrower run reversed two-input receiver order, including contextual recipes. Each completed 12 combinations and five placements without page errors. Thirty-eight captures were reviewed: text and goals remained readable, boards were uncrowded, and no advance control was blocked. Occupied hotspot labels can be covered by their objects and tutorial arrows cross some labels; these are observed limits, not a claim of ideal native-touch usability. The source-aware planner lists one extra preparatory placement that the browser can combine directly at an occupied bench.

An old completed Mars save was also restored against the replacement manuscript. It opened at the shared ending chapter; the ordinary bug-menu jump to **A place to work**, followed by the chapter's **Restart story** controls, reached the new cover and opening. Existing local drafts still shadow the fetched file. No user browser data was accessed or removed.

During check development, the interaction fixture initially ended its only goal too soon, then displayed two independent goals where the old test expected a sequential goal. Giving it the intended `next:` chain fixed the fixture without weakening the assertion. The browser witness adapter was corrected to recognize occupied-hotspot combinations and already-satisfied reciprocal placements. These were verification-harness issues; no story or engine repair was needed.

The shared tests and production build below now exercise the restored published collection. The two version-local scripts read this preserved manuscript; the browser script uses its separate preview. To run from the repository root:

```sh
npm test
npm run build
node 'projects/mars-study/mars-v2/inspect-story.mjs'
# With the v2 preview config serving port 5174:
node 'projects/mars-study/mars-v2/verify-browser.mjs' runs/mars-rewrite/browser
```

The inspection script is a source-aware legal witness and must not be supplied to fresh players. Optional packet output must stay under `runs/`. The [logical player protocol](../../../README.md#logical-playtesting) discovers published manuscripts under `stories/`; `init ... mars` now selects the illustrated version, not this project draft. A future v2 logical trial must explicitly arrange a temporary isolated manuscript input and verify its hash before making any fresh-player claim. Browser scripts establish interaction coverage, not player experience.
