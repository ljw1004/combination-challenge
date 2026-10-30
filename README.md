# Combination Workshop

Five combination stories, authored in Markdown. The browser game, story linter, legal checkpoint generator and logical AI playtester share one parser and game engine.

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Drag things together; compatible partners are highlighted without revealing the future result. Use the game menu for instructions, Undo, reset, save export and generated checkpoints.

## Work on stories

Each story owns its text and artwork:

```text
stories/mars/story.md
stories/mars/assets/...
```

The [format specification](docs/story-format-spec.md) is authoritative. Read the [authoring guide](docs/story-authoring.md), [design principles](docs/design-principles.md), and [UX guidance](docs/ux.md). The [authenticity review](docs/story-authenticity-review-2026-10-30.md) is preserved unchanged; its [follow-up tracker](docs/authenticity-backlog.md) distinguishes old findings from current manuscript work.

```sh
npm run lint                    # All stories; warnings are author-review work
npm run lint -- mars --details  # Full diagnostics with source lines
npm test                        # Semantic tests and real browser interactions
npm run build                   # TypeScript and production browser build
npm run checkpoint -- mars 3 /tmp/mars-chapter-4.json
```

Checkpoints replay legal preparations for preceding goals. They are developer witnesses, not fresh player experiences or a claim of a globally shortest solution. Chapter indices are zero-based.

## Logical play and evaluation

```sh
npm run play -- list
npm run play -- init trial-01 mars
npm run play -- view trial-01
npm run play -- act trial-01 '{"type":"dismiss"}'
npm run play -- act trial-01 '{"type":"combine","a":"name:Broken radio","b":"name:Cable"}'
npm run play -- stop trial-01 '{"experience":"Describe concrete moments here","nextExperiment":"A change worth comparing"}'
npm run evaluate -- trial-01
```

For an unattended AI trial, connect a JSON agent process or service:

```sh
npm run playtest -- --story mars --session ai-trial-01 --model my-agent \
  --agent '["/absolute/path/to/agent"]' --max-turns 300
```

The agent reads a JSON request from stdin and returns one JSON response on stdout. `--endpoint URL` supports the same protocol over HTTP. No provider subscription or secret is built into the project. See [the runner protocol](docs/playtesting.md) and [fun/evaluation criteria](docs/fun-and-evaluation.md).

Runs retain the exact story, runtime source, assignment, observations, attempted actions, optional player accounts and final report. The evaluator verifies replay and produces an attributed evidence profile. It does not turn action counts into an enjoyment score.

## Repository map

- `src/story/`: source-located Markdown model and parser.
- `src/engine/`: deterministic state, actions, needs, exclusivity and retention analysis.
- `src/lint/`: specification diagnostics and CLI.
- `src/web/`: browser presentation, touch/pointer handling, reading and persistence.
- `src/debug/`: legal replay checkpoint planning.
- `src/playtest/`: player observations, frozen sessions, AI transport and evaluation.
- `docs/`: current guidance, specification and editorial backlog.
- `stories/`: the five active stories and their assets.
- `runs/`: version-bound playtest evidence; generated runs are ignored unless deliberately retained.
- `archive/`: old source and research for reference only. Nothing active imports it.

Legacy applications, tests, save formats and URLs are retired. Their original sources are preserved in [the dated archive](archive/README.md). The [salvage index](docs/salvage-index.md) explains what was carried forward and what was superseded. [Working notes](notes.md) record current hypotheses and verification limits.
