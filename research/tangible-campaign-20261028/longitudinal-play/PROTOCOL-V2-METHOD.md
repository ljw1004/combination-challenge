# Protocol v2: normal partner-highlight exploration

## Why the instructions changed

The previous PLAYER_TASK said highlighting should be selective and prohibited “systematically harvesting every highlight.” That instruction underrepresented the intended game mechanic: hover/select/drag freely reveals currently possible partners, while discovering their outputs is part of play. It could discourage normal exploration or misclassify it as a hint or concession.

Protocol v2 explicitly treats highlighting as ordinary interaction. A player may scan every visible item and try highlighted combinations out of curiosity, without supplying a prior physical explanation or guessing an output. The unchanged harness still records pre-action intent, but “highlight shows a possibility; curious what emerges” is sufficient. Notes are optional at natural pauses, not mandatory after every surprising result. There is no minimum/maximum count, chapter stop, or completion pressure.

The remaining restrictions concern hidden source access, checkpoints/baseline jumps, erasing evidence, and scripted exhaustive impossible-pair/all-pairs enumeration—not normal use of visible partner information.

## Immutable identities and task hashes

The four new paths are:

- `mars-v4-cue-protocol-v2/PLAYER_TASK.md`
- `elements-v7-cue-protocol-v2/PLAYER_TASK.md`
- `atlas-v5-protocol-v2/PLAYER_TASK.md`
- `food-v4-protocol-v2/PLAYER_TASK.md`

`packet-index.json` records each path, exact scenario SHA, core manifest pin, separately computed PLAYER_TASK SHA, runtime/harness hashes and protocol version.

For **Mars and Elements**, every file except PLAYER_TASK is byte-identical to its prior cue packet, including the manifest. Their core pins are intentionally unchanged: a pin identifies sealed content/runtime/harness, not the separately hashed protocol. Copied provenance retains the original creation identity. New packet paths/session directories and separate task hashes distinguish the protocol-v2 runs. No scenario, recipe, runtime, schema, harness or other sealed metadata was edited in these two copies.

For **Atlas v5 and Food v4**, the exact parent-approved new scenarios were copied unchanged and their source manifests/artifact seals fully verified. All packet recipe definitions exactly match those approved candidates. Runtime, both schemas, play.mjs and surface.mjs match the same 61a9 frozen implementations. Atlas's source strict-surface also matches the packet surface byte-for-byte. Food preserves every prior recipe, item, location, initial item, stage and checkpoint, adding only the two already-approved culinary recipe alternatives (not an authoring change made by this preparation).

## Interpretation limits

These are sequential simulated logical trials, not controlled A/B tests and not human enjoyment evidence. For Mars/Elements, the protocol changes while scenario/runtime/harness stay fixed; different simulated participants, earlier context and sequential trial conditions still prevent a controlled causal claim. For Atlas/Food, both scenario and protocol differ from the prior longitudinal trials, adding a direct content confound. A later longer run or better impression is not proof that the protocol or candidate is an improvement.

Old negative sessions, old PLAYER_TASK instructions and old packets remain intact. Their observations remain evidence under their actual protocol; do not erase them, silently relabel them, or dismiss every failure as a protocol artifact. Prior protocol restrictions should instead be disclosed when interpreting comparisons.

Food's authored goal-route counts remain **180** for the preserved route, **178** for plain vinaigrette, and **179** for direct mustard. They are route-regression counts, not instructions or player targets. Alternatives share existing outputs, so catalogue coverage across runs is not one-run combination coverage.

## Checks and evidence

- Exact parent-approved scenarios: Mars `5b5c88eae671fdef517426ffba16aac826f5058413aac46f8f818c1d7285240c`; Elements `abf039bf300981f38e796e905cef69556f3439c8ccba7f834edb16c500ec234d`; Atlas `af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8`; Food `008ec2f7c7afd080a7557d8c98f387f3cde7912881d94d7681006405dc13a00a`.
- Same runtime model SHA: `793354131dc6b2cf9a5398e0dc163f5d834e62d477b719e7dedcfdcf6a2c8265`.
- Same play.mjs SHA: `972b6cdb209b2f3a048b605318f1af6ba8f4ea1a04324ada44c069837c69b83a`.
- Same surface.mjs SHA: `313d17076c7684f944085520542bfac21d72bd928970b7a995c3b22a098b03d3`.
- All four source-aware preparer smokes begin at real stage 1 with zero combinations and pass real drop/automatic-transition, rejection retention, expectation capture, undo→mission, stop and full compressed-audit checks. Atlas also verifies intentional reading without progress mutation. These sessions are never fresh-player or human evidence.
- `evidence/protocol-v2-preservation-before.json` and `protocol-v2-preservation-after.json` record prior frozen files, old instructions, and already-stopped sessions without changing them.
- No UI/browser tests, scenario edits, feature changes, integration or publication occurred.
