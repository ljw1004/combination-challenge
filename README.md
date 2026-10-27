# Combination Challenge

Active destination: about200 player decisions judged fun across a logical combination campaign. The [Mars Workshop proposal](docs/full-length-campaign-proposal.md) specifies a new42-concept, twelve-job candidate; implementation and independent shortcut checks are underway. The [long-play protocol](docs/long-play-evaluation-protocol.md) defines prospective evaluation. This is not yet a demonstrated full-length game.

Current design criteria: [What is fun? revision 9](docs/what-is-fun.md), including clear progress, comfortable routine and stage-sensitive interpretation. [Doctrine recovery status](docs/doctrine-recovery-2026-10-26.md) distinguishes exact recovered revisions from reconstructed supporting text.

Current continuation: [research checkpoint](docs/research-checkpoint-2026-10-26.md), [recovery and fresh verification](docs/recovery-verification-2026-10-26.md), and [active handoff](handoff.md). The owner has requested continuous autonomous experimentation and publication. Clear progress and comfortable routine are legitimate; not every action needs a dilemma. Historical experiments below retain their original conditions.

Current doctrine: [What is fun?](docs/what-is-fun.md). [The evaluated revision cycle](docs/fun-evaluation-cycle.md) links the plays, independent audits and current hypotheses.

To revisit the short written prototypes, run `npm run story`, then open [The Bell Orchard](http://127.0.0.1:5180/bell) or [Mneme](http://127.0.0.1:5180/mneme). These are minimal text readers for frozen logical experiments, rather than the selected game direction or30–40-minute games.

The owner has now clarified that narrative should emerge from game primitives, with little written story. The current lead is combining on terrain, with places as possible catalysts and the same availability highlights as items. The Bell/Mneme links remain available as historical text experiments. The prose-led [Far Bank proposal](docs/confluence-continuation-proposal.md) is superseded as the current direction.

The first long Confluence tests ended after20 and42 constructive interventions: [what worked and exhausted](docs/confluence-play-review.md). Its spatial consequences remain promising; its privileged200-step walk was coverage, not evidence of the requested180–240 meaningful opportunities.

New primitive-only logical slices are [Imprints](docs/logical-imprints.md) and [Resonance](docs/logical-resonance.md). Both have actual fresh-agent plays. Imprints produced a chosen meeting place through terrain and walker behavior; Resonance's quiet construction did not invite further play. Use the CLI with `imprints board` or `resonance shared-garden`; these remain small research slices rather than the requested long game.

[Frontier](docs/logical-frontier.md), `frontier crossings`, adds an active counterpart under the same public combination laws. Its [two actual plays](docs/frontier-play-review.md) produced changed roles for crossings and boundaries, but the long diagnostic ended at49 commands (36 combines) after a coexistence project settled. [New-scale proposals](docs/next-scale-proposal.md) investigate whole creations and learned faculties becoming operands, while preserving the valued earlier endings.

**Current research: logical game structure only. UI work is frozen.** Use `node experiments/logical-play.ts list` for the abstract-action candidates and `init`, `view`, `act` to play. Models, policy counterexamples and agent decision traces are the current loop; the browser prototypes below are retained experiments, not a selected game design.

[Current logical experiments and source revisit](docs/logical-first.md) record the hypotheses, actual play and decisions. To try the small progression candidate:

```sh
npm run play-logic -- init my-game progression sequence 0 manual-logical-play
npm run play-logic -- view my-game
npm run play-logic -- act my-game '{"type":"combine","op":"all","a":"A","b":"B"}'
npm run evaluate-logic
```

The command shows current concepts, full case constraints and action syntax. No browser is involved. Other candidates are `forms`, `relations`, `relations2` and `laboratory`; `list` shows their scenarios. The progression is a short test of reusing constructed relationships, not a selected full game.

A TypeScript + HTML experiment in doing the combining yourself. The default is one shared, movable canvas: one object per concept, both ingredients remain, and a combination introduces its child nearby. Earlier surfaces remain available for comparison.

## Play locally

Tested with Node **25.2.1** and npm **11.6.2**. Node 22.18+ supports the scripts' TypeScript stripping; Node 25 is recommended for the reproduced environment.

```sh
npm install
npm run dev
```

Open the printed local URL, normally **http://127.0.0.1:5173/**. No account or API key is required. The game itself has no network service.

**Hover a thing to discover its possible combinations. Drag it onto a compatible thing to combine them.** Ingredients remain in place; the new result can enter the next combination. Completed pairs stop inviting discovery. Drag empty space to pan, scroll to zoom, or use Fit. Undo restores arrangement while discoveries remain. There are no finite materials or stockpiles.

The **Elements** tab isolates exploration. **Forms** tests spatial combination: join literal edges, press R to rotate a selected/held shape, and build three target outlines. Clicking a shape selects it; you choose the joining geometry yourself. **Ideas** is a small interdisciplinary sketch, distinguishing proof search/checking and prediction/experimentation. Each tab preserves its own board across switching and reloads.

The design constraint is now explicit: **the challenge must remain worthwhile when every legal combination and its result can be inspected.** The user directly praised hover discovery as removing the search for the author's intended ontology. The next challenge should depend on informed choice, sequence, arrangement, timing or consequences. [Current design contract](docs/design-contract.md).

The shared canvas is an interaction substrate, with Forms as a bounded puzzle probe. A broader universe-creation challenge is still open. [Current experiment and evidence](docs/shared-canvas.md), [interdisciplinary research and rejected challenges](docs/interdisciplinary-ideas.md), [nine combination systems with expanded chains](docs/combination-systems.md), and [materials, processes and ideas research](docs/transformations-and-ideas.md) record the direction. Existing rules and content remain candidates rather than fixed givens.

## Decision package

The initial research/playtest package is preserved at [the earlier decision and evidence](docs/decision.md). The flood dashboard failed the user's readability and direct-combination test, despite successful headless predictions and browser control tests. It is no longer the default.

| Local route | Experiment |
| --- | --- |
| `/` or `?experiment=constellation` | Current shared canvas; optional `&mode=forms` or `&mode=ideas` |
| `?experiment=hands` | Previous tabletop/shelf handling comparison |
| `?experiment=joinery` | Unlimited-copy shape comparison |
| `?experiment=flood` | Historical flood/dashboard baseline |

The finite-supply shape model was rejected and is archived under `results/rejected-finite-joinery`; it is not a playable recommendation.

| Artifact | Contents |
| --- | --- |
| [Research](docs/research.md) | Competing designer accounts, original links, actual claims, limitations and predictions |
| [Research revisit](docs/research-revisit.md) | What rereading the original sources changed after the experiments |
| [Three concepts](docs/concepts.md) | Opponent, environment and reverse-shooter sketches; two cheap screens and selection |
| [Evaluation contract](docs/evaluation.md) | Evidence rubric, blindness, counterexamples and human validation protocol |
| [Iterations](docs/iterations.md) | Hypothesis, change, evidence, counterevidence and decision for four cycles |
| [Playtest record](docs/playtests.md) | Actual policies, seeds, agent conditions, counts, decision examples and limitations |
| [Independent review](docs/decision-review.md) | Critical inspection of the grader and real replays |
| [Working notes](notes.md) | Development reasoning and evolving strategy |

The earlier screen had no recruited human participants. Subsequent direct owner feedback—including rejection of the dashboard and praise for hover discoverability—is recorded in the current experiment. It is not a multi-person formative study. AI reports and mechanical checks remain distinct from that feedback.

## Reproduce the work

```sh
npm test                           # engine and adversarial grader tests
npm run build                      # TypeScript check + static dist/
npx playwright install chromium    # once, for browser QA
npm run browser-test               # starts/reuses local preview
node experiments/gesture-server.ts # browser-only fresh-player bridge
node experiments/gesture-player.ts SESSION view # public screenshots + real gestures
npm run grade-gestures             # contact/reuse evidence + preserved human/AI disagreement
npm run grade-canvas               # unique nodes, permanent parents, replayable real gestures
npm run screen-canvas              # actual unique-concept witnesses for all three shape goals
node experiments/ideas-challenge-screen.ts # catalogue saturation, diagnosis, safeguards counterexamples
node experiments/god-world-screen.ts # separate consequence probes and their limitations
npm run candidates                 # two cheap candidate models
npm run screen                     # 576 policy games, development seeds 1–12
npm run screen -- --rules=rooted --holdout  # 144 games on the reserved timing seeds
npm run branches                   # replay plausible alternative decisions
npm run evaluate                   # evidence cards/profiles; no fun total
npm run --silent verify > results/verification.json # invariants + winning witnesses
```

`npm run screen -- --reuse` replays existing captures and rebuilds the summary without running policies again. Add `--rules=rooted --holdout --reuse` for the holdout summary. Holdout seeds are now exposed; reserve new seeds for any future tuning. Development and holdout results remain separate in [screen.json](results/screen.json) and [holdout.json](results/holdout.json).

The screen includes random legal choice, greedy relief, a public-rule heuristic, and a **privileged** bounded beam solver. All traces live in `results/runs/`; seven instructed blind-agent traces live in `results/players/`. `evaluate` writes per-run profiles and [evaluation.json](results/evaluation.json). These are diagnostics of this game and this grader, not measures of human pleasure.

## Edit the rules

- [src/data.ts](src/data.ts): concepts, explicit recipes, scenarios, storms and frozen variants.
- [src/engine.ts](src/engine.ts): pure deterministic transitions, offers, exact previews, recording, replay and branching.
- [src/main.ts](src/main.ts): selects the shared canvas or earlier experiments.
- [src/constellation-model.ts](src/constellation-model.ts): unique concepts, retained parents, geometric combinations and deterministic replay.
- [src/constellation.ts](src/constellation.ts): separate persistent boards and browser recording.
- [src/constellation-view.ts](src/constellation-view.ts), [src/constellation.css](src/constellation.css): actual contact, shape rotation, partner previews, pan/zoom and visible-region rendering.
- [src/workbench-model.ts](src/workbench-model.ts), [src/workbench.ts](src/workbench.ts): physical instances, permanent shelf access, recording/replay and browser adapter.
- [src/workbench-view.ts](src/workbench-view.ts), [src/workbench.css](src/workbench.css): actual pointer/contact/fusion handling and appearance.
- [src/flood-main.ts](src/flood-main.ts), [src/ui.ts](src/ui.ts), [src/style.css](src/style.css): archived flood adapter, interface and appearance.
- [experiments/policies.ts](experiments/policies.ts), [grader.ts](experiments/grader.ts), [evaluate.ts](experiments/evaluate.ts): diagnostic policies and evidence extraction.
- [PLAYER_PROTOCOL.md](experiments/PLAYER_PROTOCOL.md): reproducible fresh-agent instructions.

Preserve a baseline variant when testing one change. Bump the data/build version when changing replay semantics; old replays deliberately fail validation rather than silently adopting new rules. A clean TypeScript build produces a static `dist/` folder suitable for a local HTTP server. No deployment was requested.

## Full Mars playspace (stable Working Materials V2)

The isolated `mars-play.html` adapter uses the unchanged stable V2 engine: 58 named concepts, 30 source goals, ten compact sites and real contextual operations. Normal onboarding starts with two pieces; actual solar-lead creation introduces its deployment task in a persisted modal. Sites and verified debug checkpoints present relevant working pieces directly—there is no global catalogue picker. Older research interfaces and their browser saves are separate.

Requires Node **22.18+** and the versions pinned in `package-lock.json`:

```sh
npm ci
npx tsc -p mars-play.tsconfig.json
npx vite --config mars-play.vite.config.ts       # open /mars-play.html
npx vite build --config mars-play.vite.config.ts # ignored dist-mars-play/
node --test tests/mars-play-*.test.ts
```

The Mars-specific config does not replace `npm run build` for the older research entry point. In the private hosted Site, `index.html` serves Mars, `ux-lab.html` retains the earlier staged experiment, and `workshop.html` retains the original workshop. Those two debug-link aliases are deployment entry names, not new research-root pages; local equivalents remain `playspace.html` and `checkpoint.html` with their respective Vite configs.

See [coverage and interaction inventory](docs/mars-play-coverage.md) and [independent review and verification limits](docs/mars-play-independent-review.md). Engine/model and synthetic DOM tests are not a native-browser layout, input or accessibility pass. Historical test logs must be interpreted with their recorded UI-version limitations; publication manifests pin exact file hashes rather than treating an old pass as evidence for changed code. No hosting identity or credentials belong in the research publication snapshot.

## Named Mars grammar checkpoint (October 27)

`mars-named.html` is a separate named-binary model: 42 things, 26 authored recipes, five progression areas and nine objectives. It is not a relabeling of Working Materials V2 or a claim of 58/30 parity. Things are retained and globally unique; locations provide meaningful target-derived context, portable transmutation or reversible single-item placement. Objectives reveal their supplies/places progressively.

With Node 22.18+ and the existing pinned dependencies:

```sh
npm ci
npx tsc -p mars-named.tsconfig.json
npx vite --config mars-named.vite.config.ts # open /mars-named.html
npx vite build --config mars-named.vite.config.ts
node --test tests/mars-named-*.test.ts
```

The research default entry is not replaced. The owner-private hosted Site now uses named Mars at `/`; its previous full Mars remains `/mars-v2.html`, alongside `/ux-lab.html` and `/workshop.html`. All older saves remain separate from `mars-named-portable-v1`. Narrow screens use an explicit 760×620 minimum scrollable board rather than unreadably tiny labels. See [contract](docs/mars-named-contract.md), [implementation](docs/mars-named-implementation.md) and [independent review](docs/mars-named-independent-review.md). Evidence is model, synthetic controller and source-derived geometry verification, not native-browser QA or measured fun/duration. The larger named-ontology expansion remains design-only.

## Estuary intellectual-history human checkpoint

`history-play.html` is a separate browser surface over the frozen Estuary binary engine and v2 consequence contracts. It preserves Mars and older research interfaces/saves. The private hosted build integrates `/history.html` as a fifth source entry, not a copied-asset overlay.

```sh
npx tsc -p estuary-play.tsconfig.json
npx vite --config estuary-play.vite.config.ts       # open /history-play.html
npx vite build --config estuary-play.vite.config.ts # ignored dist-estuary-play/
node --test tests/estuary-play-*.test.ts
```

See [checkpoint scope and verification](docs/estuary-browser-checkpoint.md). Final focused tests passed 12/12; the source-integrated Site aggregate passed 152/152. Native browser/device rendering and touch behavior remain unverified; synthetic handler coverage is not a device pass. Debug checkpoints are real authored replays, not player/fun evidence.
