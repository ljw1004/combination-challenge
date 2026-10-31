# Food v5 — optional Sugar history note

**Isolated, content-only candidate; not integrated, published or deployed.** Prepared for parent review while the existing source-blind `food-long-02` continued on its unchanged v4 packet. No user-facing message or UI/browser test was performed by this task.

## Definite omission corrected

The sugar chapter promised a sugar-trade record beside the dishes, but no such reading object existed. Sugar had only a short description. This candidate adds an optional **75-word reading to the existing Sugar item**, with honest attribution, and replaces the last sentence of the chapter motivation and arrival text with:

> Sugar has an optional historical note about enslaved plantation labour in seventeenth-century Barbados.

No collectible, recipe, goal, source-reading requirement, UI component or engine change is added. The note can be ignored throughout every complete route. Existing culinary goals and the real food carryover remain the activity.

## Historical evidence and limits

The reading is an original paraphrase grounded in [Richard Ligon’s 1657 *A True & Exact History of the Island of Barbados*](https://www.gutenberg.org/cache/epub/70489/pg70489-images.html), printed pp. 22–23 and 113–116, checked directly. It is not a quotation or a fictional ledger. Ligon’s published projected budget is identified as projected, not represented as actual paid estate accounts. The text identifies his colonial perspective and does not pretend to speak in enslaved workers’ voices.

The scope is specifically seventeenth-century Barbados within early-modern Atlantic plantation sugar economies, not all sugar histories. `SOURCE-REVIEW.md` and `source-verification.json` record the evidence mapping. The primary source is attached to Sugar’s optional reading, never silently cited as a culinary method.

## Exact bounded change

Seven semantic paths only:

- `/items/101/reading`: optional attributed Sugar note.
- `/items/101/sources`: its new primary historical reference.
- `/stages/8/motivation` and `/stages/8/area/travelText`: the two inaccurate final sentences.
- `/sources/20`: primary-source record.
- `/id` and `/notes/0`: separate v5 identity and revision provenance.

Every other item field, all 197 recipe alternatives, all 20 scenes and their objectives/caches/carry lists, all locations, initial supplies, all 21 checkpoints, every v4 route file, and the recipe-source ledger are preserved. `scenario.diff` and `semantic-diff.json` contain the exact changes.

## Final verification

- **50/50 content and copied-runtime tests pass.** Strict TypeScript passes.
- **39/39 full logical route×width replays pass** (13 routes at 320, 360 and 600), with **8,649 exact before/after gameplay-state comparisons** against v4. Arrival prose intentionally changes; save identity intentionally changes. This does not claim identical prose or save identity.
- **21/21 checkpoint definitions and their states match v4** at all three logical widths.
- Existing runtime exposes Sugar’s reading at all three widths without mutating game state. No reading action is needed on any full route. This is logical content evidence, not a browser-readability or human-enjoyment claim.
- Recipe/gameplay-graph SHA-256 is identical before and after: `48b7444a8eb729b879461228b6927badc8b0621d72df2cb14f609dfba89eaf76`.
- Goal-route counts remain **178** plain vinaigrette, **179** direct mustard, **180** preserved paste-first route. The catalogue remains 197 alternatives / 194 distinct output kinds plus the existing installation, not 197 required discoveries.
- **359 immutable files remain unchanged:** the complete v4 candidate, its active packet, and the first 300 already-written audit snapshots from the ongoing session. The existing prefixes of all three active logs are also unchanged. New legitimate player commands may append and the active session state may advance; no false claim that the whole active session stayed frozen is made. No session or packet file was written by this task.
- No full application integration/build, browser/touch/UI testing, fresh v5 playtest, or publication was performed.

## Identity and use

Base SHA-256: `008ec2f7c7afd080a7557d8c98f387f3cde7912881d94d7681006405dc13a00a`  
Candidate SHA-256: `96c8ba7854c87b5326d18726d8191401705bb86d6f48a0b175fd1f2a7da57019`

Read `evidence/verification.json`, `evidence/tests.tap`, `evidence/typecheck.log`, `protected-inputs.json`, and `active-session-preservation.json` for the bounded evidence.

```sh
python seal.py --check
python build-candidate.py
npm test
npm run verify
node /workspace/shared/combination-content-final-20261028/node_modules/typescript/bin/tsc -p tsconfig.json
# Reruns change timing logs; review their results before regenerating the artifact seal.
python seal.py
```

The compiler uses the already-installed local toolchain. The five runtime/schema/fixture/test files are copied unchanged from v4. No dependency installation was needed.

**Blocker:** none for this content-only correction. **Pending action/target:** parent review of `food-v5-sugar-reading`; integration/publication remains deferred as requested.
