# Cosmic playtest runner

This project-local adapter uses the current canonical parser, engine, chapter sessions and rubrics. It is adapted from the completed Creation revision's campaign tooling; it does not run an archived game runtime. Each campaign freezes the current runtime and selected manuscript, then runs fresh three-player chapter cohorts, independent grading and chapter synthesis.

Use the exact SHA-256 of the manuscript being tested:

```sh
node projects/cosmic-study/tools/playtest.mjs --fast \
  --story projects/cosmic-study/galaxies.md \
  --project projects/cosmic-study --chapters all \
  --expect-story-sha HASH
```

Use `--detailed` for the detailed interface, and `--chapters 1,3,5-8` for focused retests. `--preflight` prepares and checks without inference or retained playtest output. The default additional player guidance is the empty string. Players use Terra Medium; independent graders and chapter synthesizers use Astra High, as selected by the [evaluation guide](../../../docs/fun-and-evaluation.md). Each participant receives only its own prescribed evidence. Failed requests are resumable with `resume.mjs CAMPAIGN_SCRATCH`.

The adapter uses the machine-prescribed VS Code Codex binary, empty working directories, ephemeral requests, disabled tools, apps, plugins and memories, and audited structured responses. It preserves the user's environment and credential location. The machine-wide instruction about the CLI executable path is present; the local intercepted-request check verifies that no project instructions, skills, story material or tool definitions enter either selected model's request. This is an instruction/transport isolation method, not an operating-system security boundary.

Checks on 6 November 2026 passed for both playstyles: canonical replay, independent grading, report assembly, distinct assignments, saved checkpoints before dispatch, bounded request retries, and a completed resume making zero requests. The local intercepted-request checks and minimal connectivity checks passed for both selected models with zero tools. These checks concern orchestration only, not game quality.

Run scratch lives under `runs/cosmic-game/`. Retain only requested response arrays and completed chapter/run reports under the project's timestamped `playtests/` directories; concise findings belong in [working notes](../working-notes.md). Discard frozen runtime copies, request packets and transport logs once conclusions are recorded.
