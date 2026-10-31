# Doctrine compact opening — ready for isolated integration

**Final candidate SHA-256:** `c80d220eb820865ebe0bf5609d87484852781ae2c480c607255e7fd1ce3b1730`.

The long selective treatment made the argument clearer but produced up to fourteen lines on the existing 96 px tiles. This successor keeps its plain-language explanations while making the 46 opening heads concrete and compact: **8.5 words on average, 5–10 each; at most seven computed lines / 120 px before components**. The earlier selective treatment was 14.3 words on average, up to fourteen lines / 218 px.

## Changed

- Shortened the first four desks’ tile heads without changing item identity or the argument graph. Controversial claims keep named speakers or explicit comparative framing.
- Kept the expanded optional Reads; inserted paragraph breaks between explanation and qualifications using the existing reader behavior.
- Replaced entry-point “remission” with forgiveness; “opposed-maker” with an argument for an evil source; and stage-four “revelation” / “opposed origins” with plain explanations.
- Changed the purported student scene to an objection in Aquinas’s text, including the corresponding attribution.
- Kept the fire example bounded as Aquinas’s historical natural philosophy; no evaporation or other unsourced modern process was invented.

## Independent review

`/root/review_doctrine_readability` reviewed the exact final hash and found no remaining blocking wording correction within its scope. Its independent actual-model measurement confirmed all 46 main-label texts were retained, 391 whitespace-separated words total, max seven lines / 120 px. This is a source/wording and computed-renderer review, **not human comprehension or browser validation**. See `independent-review-receipt.md`.

## Verification

- `node verify.mjs`: **104 paired checkpoint comparisons pass** against both the original live51 content and the preserved selective predecessor (13 checkpoints × two widths × two operand directions × two controls).
- The complete **12-desk, 110-recipe, 61-canonical-combination graph is exact**. Goals, lifecycles, source IDs, Read availability, partner sets, restore, and non-mutating Reads are preserved. State/history/event comparisons exclude intended text differences and text-dependent x/y.
- Proposed TypeScript module passes standalone strict type-check against a byte-copy of the live Scenario type.
- `git apply --check` succeeds against live `51b6f9f5090c99174997793e49affff24fecd814`. **Patch not applied.**
- Five relevant runtime/schema/CSS/content files were read-only compared to commit 51b6f9f; all match. Thirty-five protected input files, including the complete earlier prototype package, remain unchanged.
- The first draft exceeded the author’s seven-line bound because “through Augustine” wrapped differently from the preliminary “via Augustine” measurement. That failure is preserved in `initial-dimension-bound-failure.txt`; the final wording reduces the mediated Pelagius head and passes the unchanged bound. The draft is retained as `compact-before-final-wording-review.json`.

## Integration handoff

- **Data:** `compact-candidate.json`
- **Proposed module:** `doctrine-images-cases.ts`
- **Patch against live51:** `doctrine-compact-against-live51.patch`
- **Tests/evidence:** `verify.mjs`, `logical-evidence.json`, `computed-label-evidence.json`, `module-check-evidence.json`, `live51-source-evidence.json`

The candidate deliberately has a new identity, `doctrine-language-compact-local-20261028`. The one-file proposed replacement does **not** archive or rewire routes. The integrating worker must preserve `doctrine-images-relics-local-v2-copy1` at its existing direct route/save identity before featuring this successor. Historical evidence must remain historical; exact-current-content integration guards need a new bounded successor assertion rather than rewriting old research.

No integrated application build is claimed here. The integrating worker owns route/archive wiring and aggregate build/tests against the combined checkpoint. The module was sent directly to `/root/prepare_next_playtest_checkpoint` for that work.

## Remaining limits

The existing preserved-component rows still use 18 px, nowrap, hidden-overflow styling; shortening heads reduces but does not eliminate their clipping. No UI/CSS implementation change was made. Tile-only arguments sometimes need the optional explanation. No browser, general UX, fresh human, later-desk wording, publication, or live-write claim is made.

## Reproduce

```sh
python build.py
node verify.mjs
```

The builder reads preserved research and live51 source to produce local files only. The verifier imports actual live51 model/schema functions without writing there. The separate type-check copy is under `typecheck/`.
