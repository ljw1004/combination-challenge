# Ideas v5 — evidence before synthesis, legitimate shorter routes

## What changed

The opening remains a comfortable experiment rather than being redesigned around one text-only player's reaction. The focused repairs are:

1. **One levy example throughout.** Ten coins are charged to Mira, who has twenty, and Daro, who has two hundred. The very same premise—equal amounts imply equal burdens—passes through the argument and validity demonstration, then meets the50% versus5% counterexample. The unrelated rule-R syllogism is gone. Valid inference is still distinguished from true premises and a just policy.
2. **Actual manuscript evidence is present before combining.** Invented A reads “opened”; B reads “barred”; damaged C has a gap followed by “They waited outside until morning.” Shared copying errors suggest a connection while a consultation note complicates a clean family tree. The conjecture stays marked rather than becoming certain by combination.
3. **A legible ambiguity, not vocabulary labels alone.** “The keeper kept the charge” admits fee/duty/person-in-care readings. “No coins changed hands; the child slept safely…” supplies contextual evidence. This is explicitly an invented English stand-in, not a fake ancient quotation or invented Greek word. Its context is a new case-specific object, not a rewrite of the generic Context tool used elsewhere.
4. **Natural alternatives work.** Observation + Question can suggest the same hypothesis; Question + Prediction can specify the same testable question. The ambiguous passage plus its context can produce the annotated translation directly, without forcing a glossary intermediate. Outputs remain globally unique; alternative recipes do not manufacture duplicate creations.
5. **Brief completion voices.** The first three scenes acknowledge what was achieved and invite the next question. Enginev5 playerView exposes all three completion texts; browser presentation was not tested here.

## Counts and checks

-205 recipes describe **202 unique outputs**. Three recipes are alternative routes, not three additional discoveries.
-There are8 possible producer assignments across the three alternate-output choices. All8 were enumerated and successfully replayed in the engine.
-Required full-route combinations range191–193; the minimum is **191**, down from193. We retain the legitimate shortcuts rather than protect the length target. The campaign is still nine required combinations short of200.
-Shortest author route:191 creations,2 catalyst placements,22 advances; final completion true.
-Peak local things remains23. Current-scene packing and identity audit pass; known things are gathered rather than cloned or secretly granted.
-The existing v4.1 factual corrections and arithmetic tests still pass, together with new continuity/evidence/shortcut checks.

## Files / reproduction

`baseline-v4.1.json` is the immutable local input. `build.py` contains this bounded revision. `scenario.json` is canonical; exact scenario/baseline/engine hashes are in `manifest.json`.

```sh
python ideas/revision-v5/build.py
python ideas/revision-v5/audit.py
python ideas/revision-v5/evaluate.py
node engine/cli.ts validate ideas/revision-v5/scenario.json
node ideas/revision-v5/verify-route.ts
node ideas/revision-v5/verify-alternatives.ts
node ideas/revision-v5/measure-engine-load.ts
node ideas/revision-v5/verify-current-scene-carry.ts
node ideas/revision-v5/verify-completion.ts
```

The evaluator no longer assumes one producer per item. It enumerates all eight assignments, computes their prerequisite unions across all stage goals, and produces executable witnesses. It does not equate raw recipe count with player actions. `alternative-route-evidence.json` contains each executed result; `evaluation.json` records the exact choices and counts.

## Source and interpretation boundaries

No new historical claim is introduced by the levy or keeper cases. Both are plainly authored teaching examples. The historical source on Alexandrian commentary supports lemmata, variants and commentary practices; it does not supply the invented sentences. Modern reconstruction and contamination concerns remain identified as such. See the unchanged bounded source discussion in `../revision-v4/source-audit.md` and independent review at `../../reviews/ideas-authenticity/V4-REVIEW.md`.

There is still no claim that every edge is historically verified or that a successful author route proves fun. The incoming report was a limited fresh text-only trial that stopped after three scenes; this revision preserves what it enjoyed rather than declaring the entire game rejected. Human play is the next meaningful test. Frozen v2, v4.1 and the closed fresh trial were not edited or coached.
