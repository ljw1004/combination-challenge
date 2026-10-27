# Elements v5 — accept natural actions and honor the cottage promise

## Result
Both source-aware full routes finish with **196 creations plus one meaningful window installation** (197 successful combinations), **30 stages**, **peak28 current-scene things**, six placements and no manual retrieval trips. There are203 recipe entries but only200 distinct creation outputs: two entries are alternative producers and one is an installation. None of those three entries is misrepresented as an extra discovered object.

The prepared Crossing→Mill→Bakery pilot still needs19 creations and peaks at18 local things. No original shortcut was removed and no arbitrary steps were added to restore a target count.

## Why this revision
The fresh full-v4 player voluntarily stopped after the mill, after50 attempts and40 creations, saying it was enough for a sitting and expressing only mild interest in returning. They enjoyed the brook construction, map and connected mill. That is a mixed, bounded playtest outcome—not a claim the full campaign is compelling or that stopping was necessarily failure.

Concrete natural attempts had been rejected: Fruit+Stone for juice, Water+Wheel for a waterwheel, and fitting a Window to the House after the neighbour asked for it. This revision fixes those mismatches, rather than making familiar actions artificially strategic.

## Changes
1. **Fruit+Stone→Fruit juice** is accepted alongside Fruit+Water. Crushing/pressing and collecting liquid are compressed into the familiar relationship. Both routes make the same existing Juice object; trying the other route afterwards cannot create a duplicate.
2. **Water+Wheel→Waterwheel** is accepted alongside Water+Planks. Adaptation with paddles/support is implicit, as construction was already implicit in the original route. Either order of the ingredients works; there is still only one waterwheel discovery.
3. **Window+House** uses the existing optional-component grammar, fitting a window into the same House object and granting `daylit-shelter`. The cottage objective explicitly requires that capability, not merely a separate Window lying nearby. The sleeping mat remains the other objective. A House without the window does not satisfy the daylight goal. Since Window still has genuine later uses, its reusable copy remains outside, consistent with the component rule. No new bag-like object or item class is introduced.
4. The miller acknowledges that the player already ground a handful by hand. The mill's payoff is relieving the village's grinding work, not inventing flour again. The baker offers a concrete next reward: a loaf with a light interior and a picnic basket for the road. This is an invitation, not a new system of mandatory choices.

The crossing map is deliberately left behind when the next scene does not need it. It remains the same tangible object at its old place and returns through ordinary current-scene packing when relevant. It is not kept in the active board merely to avoid a playtester's initial impression of disappearance.

## Tests and artifacts
- `scenario.json`: full v5 content; `pilot-scenario.json`: bounded pilot.
- `build.py`: deterministic source transformation from untouched v4.
- `evaluate.ts`: legal source-aware route evaluator, including capability objectives.
- `metrics.json` / `solution-actions.json`: route using original recipe alternatives.
- `alternative-metrics.json` / `alternative-actions.json`: route preferring the new natural alternatives.
- `pilot-metrics.json` / `pilot-actions.json`: bounded pilot route.
- `content.test.ts`: validates schema, checks both ingredient orientations, prevents duplicate canonical outputs, verifies House is not complete before installation, checks both installation orientations and the reusable Window copy, replays both full routes and the pilot, and verifies the exact frozen full-v4 source hash remains unchanged.
- `manifest.json` and `evidence-hashes.json`: identities of the content and tested implementation.

Commands:

```
python build.py
node evaluate.ts
node evaluate.ts ./scenario.json ./alternative-metrics.json ./alternative-actions.json alternatives
node evaluate.ts ./pilot-scenario.json ./pilot-metrics.json ./pilot-actions.json
node content.test.ts
```

All checks pass against the recorded shared-engine hash. No v5 source-blind player has tested these changes yet. Complete routes prove legality and counts, not motivation or fun. Existing fabrication/safety caveats from v4 remain; this is not a chemistry, woodworking or water-treatment manual. No live edits or publication were performed by this author.
