# Mars, creature and Light: independent current-visible-text review

**Result: blocking issues remain. All assigned prose was semantically read; this is not human playtesting.**

## Scope and evidence

- Inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.
- Frozen composed families SHA-256: `5e17777210504ec017ca8c749e42b5b036690d8eb7888dbfd2984b238e7d2b36`.
- All 2,242 assigned rows, deduplicated to 1,159 exact texts (10,857 words), read in six bounded batches. No unread assigned text.
- Mars main: 1,067 rows / 1,025 family-unique texts. Creature: 1,060 / 1,016. Light: 115 / 109. Family-unique counts overlap between Mars versions.
- The ledger retains exact frozen input hashes, surfaces and reading batches. `review-units.json` maps every read text to original inventory row/family/surface/owner/field/context.
- No source edits, browser testing, heavy tests or publication. Automated scans only supported counts and extraction after semantic reading.

## Blocking findings

### ML-B1: 83 unresolved Mars reader descriptions use chapter titles as recovery locations

The field in every case is `reader-body / reading.text ?? description`, in both `mars-purposeful-fieldwork-v8` and `mars-creature-plain-v4`. There are **83 distinct malformed descriptions / 166 occurrences**. These are not harmless word choices: the chapter title occupies the place of an actual location and often leaves technical objects unexplained.

Exact all-83 ID/text/context/replacement table: `blocking-mars-placeholders.json`. Representative entries:

- `caliper`: “Recovered caliper from what the cliff can tell us.” → “A tool for measuring the width of a sample.”
- `logger`: “Recovered logger from the sky is closing.” → “A recorder for the weather sensors.”
- `intake-compressor`: “Recovered intake compressor from the plant that breathes stone air.” → “A pump that compresses incoming Martian air for the oxygen plant.”

The appendix proposes short object descriptions rather than simply deleting the malformed tail; the implementer should verify each against the intended item role.

### ML-B2: All four Light objectives remain recipes rather than short open questions

- **ML1125**: `divinity-light-reading-scenes-v4 / objective / road / objectives`
  - Current: "Compare the two neighbour questions\nMake the roadside panel"
  - Problem: Two commands name the comparison and final product, rather than asking an open question.
  - Minimal suggestion: "Who acts as a neighbour?"
- **ML1127**: `divinity-light-reading-scenes-v4 / objective / doorway / objectives`
  - Current: "Connect the father’s two trips outside\nMake the doorway panel"
  - Problem: Two commands name the connection and final product, rather than asking an open question.
  - Minimal suggestion: "Who is still outside?"
- **ML1129**: `divinity-light-reading-scenes-v4 / objective / hillside / objectives`
  - Current: "Connect Mark’s compassion, teaching and meal\nMake the two-voices panel"
  - Problem: Two commands dictate the connection and final product, rather than asking an open question.
  - Minimal suggestion: "How do Mark and John describe the feeding?"
- **ML1131**: `divinity-light-reading-scenes-v4 / objective / press-room / objectives`
  - Current: "Print our roadside paraphrase\nFit the four panels into the exhibit"
  - Problem: Printing/assembly instructions remain in the objective rather than a short open question.
  - Minimal suggestion: "Does the headline fit Luther’s words?"

### ML-B3: Light captions expose verse-reference/source-apparatus wording

- **ML1034**: `divinity-light-reading-scenes-v4 / tile/reader-caption / samaritan-leaf / label`
  - Current: "Our Luke 10:33–35 paraphrase: a Samaritan tends the traveller and pays"
  - Problem: The visible item caption includes an editorial “Our” and a verse citation.
  - Minimal suggestion: "A Samaritan tends the traveller and pays for care"
- **ML1118**: `divinity-light-reading-scenes-v4 / tile/reader-caption / proof-sheet / label`
  - Current: "Proof: our Luke 10:33–35 paraphrase"
  - Problem: The visible proof caption includes an editorial “our” and a verse citation.
  - Minimal suggestion: "Proof of the roadside story"
- **ML1119**: `divinity-light-reading-scenes-v4 / tile/reader-caption / printed-passage / label`
  - Current: "Our Luke 10:33–35 paraphrase in print"
  - Problem: The visible printed-item caption includes an editorial “Our” and a verse citation.
  - Minimal suggestion: "The roadside story in print"

### ML-B4: Light still contains explicit author-defense tails

- **ML1027**: `divinity-light-reading-scenes-v4 / chooser / divinity-light-reading-scenes-v4 / premise`
  - Current: "A small text workshop for curious students: discover a changed question, a repeated gesture, two voices in one scene, and a headline that a source will not support. Four connected desks, not a curriculum checklist. Catholic perspectives are named; interpretations and historical claims remain distinct. Independent experiment, not school-approved material or a test of personal belief."
  - Problem: The chooser defends the material against an imaginary curriculum checklist, school approval, and a test of belief instead of introducing its story.
  - Minimal suggestion: "Read a roadside story, a family reunion and two accounts of a feeding, then check what Luther says about helping people in need."
- **ML1053**: `divinity-light-reading-scenes-v4 / reader-body / road-panel / reading.text ?? description`
  - Current: "The Samaritan helps across a religious boundary, while Jewish Scripture already teaches care for strangers. These points do not require portraying Judaism as lacking mercy or as a failed version of Christianity."
  - Problem: The second sentence explains what the author is not portraying rather than stating the relationship in plain English.
  - Minimal suggestion: "The Samaritan helps across a religious boundary. Jewish Scripture already teaches care for strangers."
- **ML1051**: `divinity-light-reading-scenes-v4 / reader-body / jewish-mercy / reading.text ?? description`
  - Current: "The Gospel’s discussion of neighbor-love does not start from a Judaism without mercy. The Leviticus passage already connects love of the stranger with Israel’s memory of being foreigners."
  - Problem: The first sentence negates a misconception not introduced by the story, instead of directly giving the relevant continuity.
  - Minimal suggestion: "Leviticus connects love of strangers with Israel’s memory of being foreigners. Jesus and the lawyer discuss neighbour-love within that Jewish tradition."

### ML-B5: Mars main outcrop completion claims a cliff photograph that is not required

- **ML0959**: `mars-purposeful-fieldwork-v8 / completion/ending / outcrop / completionText`
  - Current: "The ice sample is labelled, and the photographs record the specimen and cliff layers. These observations do not yet establish how old the layers are or how they formed."
  - Problem: Completion requires catalogued-ice-sample, ice-photograph and core-profile; cliff-photograph is explicitly optional. The ending therefore claims cliff layers were photographed even when the player only photographed the core.
  - Minimal suggestion: "The ice sample is labelled, and the photographs record the specimen and the core’s layers. These observations do not yet establish how old the layers are or how they formed."

## Rechecked endings, bridges and wonders

- All 25 Mars and 25 creature completions, all five bridges in each, and all three Mars/four creature wonder bodies were read. Apart from the specific main-outcrop contradiction above, no new blocking metaphor/author-defense was found on these surfaces.
- Garden completion and skip bridge now say: “After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.” This is concrete in-world elapsed time, not an author defense.
- Creature final ending and reader/wonder bodies retain the genuine uncertainty about age, origin and whether it is alive. The review does not propose stripping that uncertainty.
- Light’s single ending and single bridge were read and do not contain the objective/source-caption issues. Light has no wonder bodies in this inventory, so no claim is made about a rendered explanatory-wonder layout.
- Historical quotations and distinctions between Jesus/the lawyer, Jewish/Samaritan communities, Mark/John, and Luther were retained in the review. The suggested road-panel rewrite preserves the Jewish-scriptural continuity instead of introducing a false opposition.

## Optional polish, not blockers

- Mars main chooser uses “recovered qualified systems” and a survival-instruction disclaimer; creature chooser uses a not-a-report disclaimer. A short genre description would be plainer, but those boundary labels were not treated as blockers because they may be deliberately retained safety/fiction framing.
- Some Mars reader descriptions remain assembly commands rather than descriptions (for example `shielded-thermometer`, `machine-tool`). This is a consistency opportunity; not counted as a blocking voice error without a stronger requirement on those reader bodies.
- `oxygen` completion’s “proper interface” and “a real place in the waiting vehicle” could be plainer as “The hauler moved the oxygen module onto the plant’s loading connection. The serviced module is ready for the cabin.” This is optional wording polish; the review does not claim the existing line falsely says the module is already installed.

## Limits

This is a semantic review of the supplied frozen visible-field inventory, not a rendering audit, historical-source verification, graph/reachability test, or human playtest. It does not certify hidden source fields or that the inventory generator includes every runtime string. Full hashes are in `coverage-ledger.json`.
