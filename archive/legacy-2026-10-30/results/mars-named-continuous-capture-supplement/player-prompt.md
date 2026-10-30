# Mars whole-world logical play

Play this combination prototype through the working-home and remote-observation tasks, using only the supplied player interface. Do not inspect implementation files, recipe tables, authored routes, tests, prior reviews, or other player records. Give your own account of the experience, not what you think the designer expects.

This is one continuously expanding world. Old things remain where you left them, and new supplies and places appear as objectives become relevant. Useful old things may be moved to new places. The whole world has only one thing of each kind: an existing result elsewhere prevents creating another. There is no packing or reset between home and field tasks.

Inspect things, places and objectives; ask which partners currently admit a new combination; combine two things or a thing with a place; place or move a thing, including back to loose workspace. Hints show novel legal partners, not the name of an undiscovered result. Recipes are not secret passwords; use hints whenever helpful.

Ordinary inputs are inexhaustible capabilities and persist, rather than finite stock. The obsolete broken radio is explicitly replaced by its repaired successor. A dragged source moves loose, while a target stays put. A target's actual location can change the result. Combining with a place makes a portable thing. Placing something at an occupied place moves the previous occupant loose. Current goals can regress when their things move; historical achievements remain achieved. The interface reports when all final requirements are satisfied.

This logical interface lists the world rather than rendering a scrolling spatial view. It does not simulate physical drag distance, viewport density or search travel. You may comment on the list/hint experience, but do not infer what a graphical scrolling board would feel like.

Play naturally. Simple solutions, optional construction, exploration, and comfortable progress are welcome. There is no action quota or need to create every possible thing. If stuck or something seems broken, record the attempt, expectation and result and investigate through the player interface rather than source inspection.

Briefly note changes in understanding or enjoyment when they occur, without narrating every gesture. At completion or stopping, report:

- Which tasks you actually completed; why you stopped if incomplete.
- Concrete satisfying constructions, useful choices, or moments of comfortable progress.
- Concrete confusion, guessing, repetitive work or object-search burden.
- Whether old equipment gaining new uses felt rewarding, obvious, or administrative.
- Whether home-building and observations felt meaningfully different, and what consequences drove choices.
- Any interface defect with exact command and observed result where possible.

A critical or uneventful report is useful. Distinguish your actual experience from hypotheses about humans. Do not estimate human play duration.

---

## Your exact player entry point

Working directory: `/workspace/shared/combination-challenge`. Use only this launcher for game interactions:

```sh
python results/mars-named-continuous-capture-publication-20261027T015400Z/snapshot/results/mars-named-continuous-capture-supplement/capture.py --run-dir /tmp/mars-continuous-whole-play-20261027T015300Z --command '{"op":"help"}'
```

Then use the same command with `--command '{"op":"view"}'` to view your starting world. Send subsequent JSON commands through the same launcher and the **same run directory**. The launcher records exact requests, responses, errors and exit status without changing gameplay. Use one invocation at a time. Successful host responses are forwarded unchanged. If the host process fails, you receive a generic operator-error notice; exact diagnostics remain in the private log. Do not invoke the underlying host directly or use source-reading tools.

Persistent state is `/tmp/mars-continuous-whole-play-20261027T015300Z/state.json`; the complete capture log is `/tmp/mars-continuous-whole-play-20261027T015300Z/transcript.jsonl`. Do not edit either file or inspect the private state; resume through the launcher if needed. You do not need to inspect the log to play. Do not read the launcher source, harness source, content files, README, tests, review files or authored routes. Report any entry-point error instead of finding another way to access the game.

The run directory is reserved for this fresh play session and must initially be absent. If it already exists before your first command, stop and ask the operator for a fresh path rather than reuse someone else's state. Finish by giving your observations in chat; the operator will preserve those alongside the captured command/response record.
