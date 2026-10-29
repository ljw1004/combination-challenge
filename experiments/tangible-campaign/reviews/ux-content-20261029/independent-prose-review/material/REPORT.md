# Independent material-family plain-text review

Frozen inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.

Read all visible texts in assigned three families, with identical repeated text deduplicated and every occurrence mapped in the sibling JSON files. This is independent AI editorial review, not human playtesting. No source edits, browser use or heavy tests.

## Blocking voice/comprehension findings

### M1 — Kitchen chooser author-defense sentence
- Family: `kitchen-caravan-small-sessions-v8`
- Surface / field / owner: `chooser / premise / kitchen-caravan-small-sessions-v8`
- Exact problematic sentence: “This fictional collection is not a chronology of invention; time, proportions and safe handling are compressed, not taught.”
- Why: directly addresses the author's construction and defenses instead of the caravan. This is the sort of meta-author explanation the user prohibited.
- Minimal replacement: delete this sentence. Retain the following concrete pantry-cart/cold-storage explanation. If a safety cue is retained, use “The cooks handle fermentation, storage and food safety.” instead of the author-defense sentence.

### M2 — Kitchen jam reader author-defense tail
- Family: `kitchen-caravan-small-sessions-v8`
- Surface / field / owner: `reader-body / reading.text ?? description / jam`
- Exact text: “The cook heats the fruit into a soft-set jam for immediate use; no shelf-life is claimed.”
- Why: “no shelf-life is claimed” is author/legalistic defense, not concrete information. The immediate-use distinction is already meaningful and should remain.
- Minimal replacement: “The cook heats the fruit into a soft-set jam to serve now.”

### M3 — Copy Workroom unexplained matrix jargon
- Family: `copy-workroom-locations-v2`
- Surface / field / owner: `fixed-place label / label / press`
- Exact text: “Shop press — reflected RIVER matrix”
- Also `completion/ending / completionText / sample`: “The impression reads RIVER →. You take that same thin master sheet to the workroom; the shop keeps its original working matrix.”
- Why: the ordinary player is told what a printing surface does, but “matrix” is never explained. Nothing in this scene needs this specialist label.
- Minimal replacements: “Shop press — reversed RIVER design” and “The impression reads RIVER →. You take that same thin master sheet to the workroom; the shop keeps its original printing surface.”

## Optional polish, not blockers

- Elements `reader-body/torch`: “An oil-soaked fiber head secured to a wooden support; a small portable flame, not loose charcoal balanced on timber.” The final negative image sounds like a technical repair note; could end at “a small portable flame.” This does not prevent comprehension.
- Elements `reader-body/boiled-water`: “Water that has been heated to boiling; this is not a promise to remove every contaminant.” More direct while preserving the safety distinction: “Water that has been heated to boiling. Boiling does not remove every contaminant.”
- Kitchen `reader-body/sugar`: the final clause “it does not describe every place or period that made sugar” reads as a scholarly qualification. The preceding sentence already limits the account to the colonists' perspective; consider dropping that final clause, retaining the historical account and distinction between colonists and enslaved people.

## Verified corrections and limits

- Elements orchard entry and fallback both read exactly: “We have a lot of fruit. Let's preserve it.”
- Elements all completion/ending and skip-bridge bodies were read, including orchard and final gathering. No forced-whimsy regression found there.
- Elements establishes “music and a shared meal” in the village square before later gathering references. Printed invitations and later arrivals repeat the actual event; no unexplained gathering blocker found.
- Kitchen last ending clearly states dishes pass aboard while the trolley stays on the platform.
- Copy Workroom final ending and skip bridge clearly distinguish the readable panel from the reversed printing block.
- This pass makes no global finding for other families and does not validate graphics, flow or game mechanics.
