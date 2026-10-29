# Independent final-player-prose review — frozen baseline

**Full semantic coverage; not a pass. Blocking voice/comprehension issues remain.**

## Exact reviewed input

- Inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.
- Resolved scenarios SHA-256: `5e17777210504ec017ca8c749e42b5b036690d8eb7888dbfd2984b238e7d2b36`.
- Preserved original input: `frozen-input/`. This is post-calibration 135b9f9a, A12 sea-trial and basket-continuity composition.
- All **5,998 visible-field rows / 4,067 exact distinct texts**, all eight families, read semantically in bounded batches. Exact repeats were deduplicated, with every occurrence retained. Union validation finds **zero unread rows and zero overlapping assigned rows**. `COVERAGE.json` contains hashes, family/surface counts and complete row assignments; subledgers hold reading batches.
- This is independent AI editorial review by four reviewers, not human playtesting or a mechanical scan. No source changes, browser testing, heavy tests or publication were performed.

## Confirmed blocker packets

| Scope | Concrete issues | Exact machine-readable packet |
|---|---|---|
| Ideas/Atlas wonders | 16 issue groups / 23 text edits: missing concrete setups, undefined central terms, two opaque captions, one recipe-defense tail | `ideas-wonders/blocking-findings.json` |
| Divinity | 8 issues: invented-fragment arrival bridge; scholarly gloss caption; six wonders relying on missing context/central definitions or unattributed theological premise | `core/findings.json` |
| Mars + creature | 83 distinct malformed reader descriptions repeated in both worlds (166 occurrences); main Mars outcrop completion falsely claims cliff photographs rather than required core photographs | `mars-light/blocking-mars-placeholders.json`, `mars-light/findings.json` |
| Light | All four joined objective rows still recipes; three source-reference captions; three author-defense surfaces | `mars-light/findings.json`; use `mars-light/light-objective-structure-note.json` to preserve all eight objective IDs while replacing text |
| Kitchen | Chooser author-defense sentence; jam reader’s “no shelf-life is claimed” tail | `material/blocking-findings.json` |
| Copy Workroom | Unexplained “matrix” in press caption and completion | `material/blocking-findings.json` |
| Elements | No blocking findings within full covered scope | `material/REPORT.md` |

Each packet retains exact original family, owner/ID, visible field, text, occurrence mapping, reason and minimal proposed correction. The 32 grouped findings are not a demand for broad stylistic rewriting. Fix the actual comprehension/voice defects; optional polish is explicitly separated in subreports.

## What the earlier correction did cover

- Exact orchard sentence present: “We have a lot of fruit. Let's preserve it.” Elements establishes the village-square meal/music event before later gathering references. All endings and bridges were read.
- Ideas objectives are open questions; all 85-session narratives/objectives and every ending/bridge were read. A12’s H4 sea-record explanation is understandable independently and preserves the clock/lunar alternatives.
- Divinity’s wound/meal wonder correctly distinguishes eating from taking what a neighbour is owed; caption is exactly “The wrong is taking what another is owed”. Opposed-origins completion/bridge state actual differing accounts, without an imaginary-meeting defense.
- Augustine defaults name him outside his study. Prefix-free variants apply only to “Augustine’s study” and its evening session, not another author’s place.
- Mars garden ending/bridge now explicitly says several weeks of growth elapsed, without defending the author’s ability to pass time. Creature uncertainty about age/origin/life remains meaningful and was preserved.
- All 306 Ideas/Divinity explanation wonders use the paragraph-first, actual-item-name italic-below markup, no separate rhetorical heading. This is a markup check, not visual QA.
- Borges’s invented-source concepts and historical quotations were intentionally retained. A complementary scan did not count as semantic reading and did not treat “fiction” as automatically bad.

## Important limits and next check

The review is tied to the above frozen inventory, not whatever a later integration produces. The source owner is preparing a narrow successor. Regenerate its visible inventory, diff all fields against this frozen original, and independently re-read every changed field (including paired reader/wonder copies, completions and source-update bridges) before marking the reported blockers resolved.

No historical-source verification, graph/reachability certification, rendering/browser pass, publication readiness or human-fun claim is implied. Integrator confirmed unused location travelText/timeLabel/stockBatch narrative and labels are hidden in the current UI; their presence in source does not expand this visible-text coverage claim.
