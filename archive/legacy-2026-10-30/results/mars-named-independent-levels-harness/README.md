# Independent Mars levels — logical-play harness

Design diagnostic only, not deployed UI. Six independent levels preserve completion and read-only saved boards, not conserved cross-level possessions. No pressure variant. Content has no authored routes. Player responses never expose the recipe table, accepted-output lists, or future results. `partners` returns only currently legal novel target identifiers; `knowledge` contains only combinations actually made.

## Player entry

From repository root (choose a fresh private state path outside this source directory):

```
python results/mars-named-independent-levels-harness/harness.py --state /tmp/mars-play-state.json --command '{"op":"help"}'
python results/mars-named-independent-levels-harness/harness.py --state /tmp/mars-play-state.json --command '{"op":"view"}'
```

`--command` runs one JSON command. Without it, stdin accepts JSON lines and emits one response per line. Full command syntax is available from `help`; no source inspection is needed. `place` with JSON `null` returns a thing to the loose workspace. `next` saves a completed board read-only and explicitly opens the next independent level; at the sixth endpoint it finishes the collection. Each successful mutation is atomically persisted. Rejected commands do not mutate state or rewrite the state file. Queries do not alter the game state. The local state file is a trusted host artifact, not a player editing interface.

Location descriptions explain physical purposes without giving combination formulas. Goal titles can name the requested achievement, as ordinary instructions do; they do not list all accepted output kinds. Historical achievements and current goal truth are shown separately. Prior current goals must still hold before advancing. Initial manifests are shown as declared starting things while the actual visible board honestly includes the first goal's supplies: 2/5/7/6/6/6 things.

Counts include only successful combine and placement gestures, including moving a thing loose. Read/help/partner queries, automatic supply introductions and six explicit `next` transitions are separate, not padded into operation totals. Successful mutation events remain in the host state. An evaluator should separately retain the full command/response transcript if query/rejection behavior matters.

## Developer validation (not player material)

```
python results/mars-named-independent-levels-harness/test_harness.py
```

Tests replay complete ordinary/simple controls against exact saved boards (70/62 operations), replay optical/distillation alternatives, verify context precedence before novelty, actual target orientation, source recoil, portable location output, explicit retirement, displacement, loose movement, current-truth regression and restoration, read-only saved-board independence, nonmutating queries, rejected-command atomicity and CLI persistence. Controls are loaded only by tests from the separate candidate directory. Fresh players must receive the neutral assignment and CLI entry point, not this test code, content JSON, original candidate, or control routes. Independent review and root-owned publication remain required before recruitment.

This CLI is a logical action harness, not a physical drag UI. It does not demonstrate visual legibility of 26 things and seven places, human fun, or a 200-decision experience.
