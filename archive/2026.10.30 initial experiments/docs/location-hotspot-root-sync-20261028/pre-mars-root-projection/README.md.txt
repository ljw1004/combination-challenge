# Combination Challenge

## Authoritative game design principles

**Start with [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)** before changing game content, runtime or validation. It consolidates the user's rules: whole persistent locations, interactive hotspots and story-beat chapters; whole-location-visit carry only on actual travel; subdued artwork and bounded panels; task-and-name-first understanding; natural forward combinations, useful purposes and authenticity; plus the earlier lifecycle, goal and continuity principles.

**Direction is not proof of player experience.** The combined location/artwork successor implements the new scoped campaign described below, with new scenario IDs and preserved pre-location versions. Source/build/logical and synthetic-controller checks do not establish browser, native-touch or human-enjoyment quality. It follows the separately published Iron quarry label-only Site source `f780990cdff4557aeb46dcbf7d0d622e9f6310e2`. The dated sections below remain unchanged historical records; their earlier “current”/“not live” statements apply to those checkpoints. [Documentation provenance and reconciliation](docs/design-principles-history/20261028-authoritative/RECONCILIATION.md).


## Current campaign terminology and entry points

**Location** means the whole persistent place/background and its arrangement and ordinary supplies. **Hotspot** means an interactive spot inside it (operand, catalyst setting or placement destination). **Chapter** means a story beat/objectives, possibly at the same location.

`campaign.html` enters the canonical v2 UI/runtime. New campaign work uses `experiments/tangible-campaign/schema/campaign.ts`, `engine/campaign.ts`, `ui/current-scenarios.ts`, `ui/current-campaign.ts`, and `ui/stories/`. Old `schema/scenario.ts`, `engine/model.ts` and `ui/scenarios.ts` are explicitly v1 compatibility contracts/façades; they are not the current authoring API or a second rules engine. Browser save keys and v1 serialized state/history/event fields remain compatible. See the [migration, tests and legacy-exception guide](docs/location-hotspot-terminology.md). The unrelated original root `src/main.ts` game and its scripts remain separate.

## Reproduce the current root campaign

`npm run campaign:check`, `npm run campaign:test` and `npm run campaign:build` validate the actual root `campaign.html` dependency closure; the separate static output is `dist-campaign/`. The original root `src/main.ts`, `index.html`, package dependencies, lockfile and existing script meanings are unchanged. This combined successor includes 71 decorative location images and fixed-location/story-cue behavior; no browser/native-layout or human-enjoyment validation is claimed.

The scoped root test entry preserves the original root shared-campaign engine/controller/save and registered-route/checkpoint coverage, adds canonical terminology/save parity and actual-root source contracts, and leaves unrelated pre-existing root tests active. Whole-Site checkout assertions are **not** copied into active root tests: their 94 exact final-combined test-entry inputs are retained as dated evidence in `docs/location-hotspot-root-sync-20261028/site-test-inputs/`, with the explicit [active/adapted/archived test map](docs/location-hotspot-root-sync-20261028/test-context-map.json). They are verified against the separately sealed Site source, not passed off as root-app verification.

The complete immutable Site source (1,958 declared inputs plus its manifest) is retained in [`results/location-presentation-source-60aa75dd-20261028/`](results/location-presentation-source-60aa75dd-20261028/README.md), using content-addressed object aliases and exact pre-existing encoded checkpoint parts. `node scripts/verify-campaign-source-archive.mjs` verifies the full archive; add `--materialize /tmp/combination-site-60aa75` to reconstruct readable original paths in a fresh directory. The root keeps every actual runtime/config/test dependency raw; 224 historical-only paths are archival, not active code. No existing root path is deleted.

The site source seal at `experiments/tangible-campaign/integration/source-manifest.json` is preserved as provenance of the isolated source package; its whole-tree verifier is **not** the root repository gate. The root gate is `scripts/check-current-campaign.mjs` with `scripts/current-campaign-manifest.json`. Before-bytes of overwritten root files, including old review artifacts, are preserved under `docs/location-hotspot-root-sync-20261028/before/`. Dated README chronology and existing-only repository paths remain unchanged. This adds the current root campaign source rather than pointing only at an archived snapshot.

## Current shared campaign: persistent places and story artwork

Open [`campaign-start.html`](campaign-start.html) for **Mars: A Light That Answers**, or [`campaign.html`](campaign.html) for the six featured successor worlds and retained snapshots. **The private-root `index.html` still opens the original unrelated root app; it is intentionally not replaced by the Site homepage.** The scoped campaign start page preserves the Site redirect as a separate entry.

Seven new scenario IDs introduce continuing locations, fixed 390 × 844 reference panels, one authored cue for unfinished chapter entry, and 71 subdued background images. All 40 pre-location versions retain separate URLs/save identities; the active catalogue contains 47 worlds. See [implementation and limits](docs/persistent-locations-and-artwork.md). Location means the whole setting; hotspot means an interactive point; chapter means a story beat. Same-location chapters retain tangible stock and arrangement; real travel plans carry across the visit rather than silently importing ingredients at later chapter boundaries.

This is a source/build/test package, not evidence of native touch usability, browser layout, human comprehension or enjoyment. The root scoped build emits `dist-campaign/`; artwork uses root-relative `/assets/locations/` URLs and must be served from that output's web root. Original root sources/scripts remain separate.

## Current live shared runtime — 28 October 2026

The owner-private [Combination Workshop](https://combination-workshop-playtest.stonysun25.chatgpt.site/campaign.html) is live from exact Site Git **`61a9b4ee8c6235bff07f97eb16d713ec6125c81e`** (existing publication at 03:22:08 UTC). This checkpoint preserves that source; it does **not** deploy or change the Site audience. The prior immutable `6204` source/evidence checkpoint remains intact.

Shared improvements now live: intentional attributed manuscript reading, generalized long-text tile sizing, **event-local** retirement, and immediate visible preservation of fitted components even when the original outside source remains useful. Unrelated later actions, travel or loading no longer absorb an earlier retained input into an old product. Legacy save migration adds only evidence-backed visible construction metadata; it does not invent/resurrect parts or silently delete old leftovers.

The six priorities remain **Mars, Atlas of Questions, Elements, From Hearth to Snack Cake, Why This Boat, and Doctrine: Grace and Matter**. All scenario bytes are unchanged from 6204. Story overhauls, including revised Atlas, Doctrine and Food-v2, are **IN PROGRESS / NOT LIVE**. Reader support is released; its availability is not acceptance of unreleased Doctrine content.

Independent preservation replay of the exact final Site snapshot: **455 tests passed, 0 failed, 1 intentional skip**, plus content validation, TypeScript and Vite build passed (existing large-chunk advisory). Retained release evidence includes 138 campaign checks, 112 policy differential route/width runs, and actual cloud Chromium reader checks at 1180 and 502 CSS-pixel widths. The native check used a temporary Doctrine fixture removed afterward; no physical iPhone/touch, every-scene coverage, native lifecycle-moment check or proof of full-game human fun is claimed.

[Source, policy review, evidence and limitations](docs/live-reading-policy-20261028.md). This newer status supersedes older reader/policy-not-live statements below; older evidence and candidate limitations remain historical, unchanged.


## Intermediate source checkpoint — 28 October 2026

This preserves recovered fork `3d3dbf36c7be473b30e09384f8a279b2fa2d9918` plus the six-focus chooser at exact Site Git commit **`6204f3bb6160eb6549fbaa98bdc8e43483cb6de1`**. Focus: **Mars, Atlas of Questions, Elements, From Hearth to Snack Cake, Why This Boat, and Doctrine: Grace and Matter**. Other sketches and archived direct routes remain available.

**This is not the latest live release.** While this immutable checkpoint was uploading, the parent published newer owner-private Site source `61a9b4ee8c6235bff07f97eb16d713ec6125c81e` at 2026-10-28T03:22:08.568732Z, adding the manuscript reader, long-label layout and reviewed event-local lifecycle behavior. Those later source changes are **not included here**. This preservation task makes no Site deployment or audience change. New story/campaign overhauls remain **IN PROGRESS / NOT LIVE**; closed candidates in this repository are research, not claims of deployed improvements.

The exact 6204 source was independently reconstructed from Git objects, not mutable working files: **434 tests passed, 0 failed, 1 intentional native-browser skip**, and content validation, TypeScript and Vite build passed (existing large-chunk advisory). Five closed logical sessions replay exactly: Food pastry, Elements guests and gathering v7, and Mars refuge and night. Negative attempts, stopped play and author-vs-fresh distinctions are retained. These are simulated logical-play and mechanical findings, **not proof that full games are fun**, human enjoyment, physical iPhone/Safari, touch or new native layout coverage.

[Checkpoint scope, source hashes, replay instructions and limitations](docs/recovered-six-focus-checkpoint-20261028.md). Earlier entries below remain historical and are superseded only on explicitly newer status/direction.


## Current status — 27 October 2026, live owner-private full drafts

The [Combination Workshop playtest](https://combination-workshop-playtest.stonysun25.chatgpt.site/campaign.html) is LIVE for Lucian only from Site commit `9db3c2c132bb7d038d29c59b516e4db084f18f1a`. It now offers three full-length **drafts** plus six smaller journeys. Authored witnesses contain Mars **202**, Ideas **199**, and Elements **197** combinations: roughly 200, not mandatory quotas or proof of full-length fun. This status supersedes older UI-freeze, seven-small-theme, and preservation-pending summaries below; those entries remain historical evidence.

Release verification records **398 Site tests passed, 0 failed, 1 intentional native-browser skip**, **95 integration tests passed**, and **540 mechanical branch runs**. Separate actual cloud Chromium checks used a 500 × 761 CSS-pixel viewport; they are not physical iPhone/Safari tests, every-scene visual coverage, or human enjoyment evidence. [Live release and preservation details](docs/live-full-campaign-20261027.md) distinguish the tested source, limits, raw evidence, and replay instructions.

Three later-checkpoint logical trials are closed and replay exactly: Mars stopped after 4 fresh combinations at an opaque cargo-recovery rule; Ideas stopped after 20 with induction rewards but causal-order concerns; Elements stopped after 24 with enjoyable botany/food making but no microscope-use payoff. Authored baselines are excluded. These are targeted agent observations, not full-campaign human playtests. [Round-two report](research/tangible-campaign-20261027/trials/round-two/REPORT.md) retains the negative findings unchanged. New Mars cargo, Ideas v7, Elements v6, narrative-director-v2, and round-three work is **not** included in this release or preservation checkpoint.


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

## Mars useful-things checkpoint (27 October 2026)

The separate `mars-purpose.html` checkpoint imports the audited compact Mars core and tests broader functional purposes, explicit evolution/incorporation and setting-aware discovery without result previews. Run `npx vite --config mars-purpose.vite.config.ts`; see [browser contract](docs/mars-purpose-browser-contract.md) and [release preservation](results/mars-purpose-release-20261027/README.md). Prior named Mars, history and other checkpoints remain intact. The deployed private default uses this revision, with the previous named checkpoint at `/mars-slots.html`. Final Site tests: 174 passed; focused controller tests: 22 passed. Native mobile/human enjoyment is not established.

## Three discovery worlds (27 October 2026)

- **Mars expedition:** `mars-expedition.html` continues contact → home → expedition → remote observations, with short Mission Control invitations and a fixed expanding playspace.
- **A Republic of Ideas:** `history-ideas.html` explores shareable ideas through thing-and-place combinations; old Estuary remains preserved.
- **Elements:** `elements-discovery.html` begins with simple elements and opens a fermentation setting.

Each has an isolated Vite config. See [release preservation](results/three-worlds-release-20261027/README.md) for complete tested Site source/aliases and exact final evidence. Combined Site tests:236 passed,0 failed,1 optional native-browser test skipped. This is not a native-mobile or human-enjoyment claim.

## Mobile active workspaces (27 October 2026)

Mars, Ideas and Elements now fit a viewport-width vertical workspace, surface newly useful places/results and automatically hide no-further-use work without deleting canonical progress or creating a collection screen. Mars introduces supplies through named story caches. See [mobile release preservation](results/mobile-workspace-release-20261027/README.md) and each scenario's mobile policy.

Final release:267 tests passed,0 failed,1 optional browser test skipped; TypeScript/build passed. Parent-operated cloud Chromium500px routes are documented separately from synthetic320/375/390px checks. This is not physical-phone/touch validation or proof of enjoyment.

## Tangible creations and story areas (27 October 2026)

The current Mars/Ideas/Elements policy supersedes automatic hiding: surviving finished creations remain physical; only coherent upgrades/incorporation remove objects. Useful pieces travel together into compact story areas while finished work stays behind. Explicit goals and permanent golden contribution markers show progress. See [tangibility release preservation](results/tangible-workspace-release-20261027/README.md), including exact prior-policy evidence.

Final release:297 tests passed,0 failed,1 optional browser test skipped; TypeScript/all11-route build passed. Specific parent cloud Chromium500px routes are documented separately from model/synthetic phone-width and touch checks. Logical scenario expansion is on hold.


## Compact local stages (27 October 2026)

Ideas and Elements now use Mars's600px maximum worktable. New creations stay directly beside their target, and gold marks only satisfied objectives in the current stage, including required placement. Gold clears at advancement; finished things remain tangible. Mars's final area has a distinct local ice outcrop instead of requiring a return to the old Glacier. This supersedes the previous persistent-gold policy without expanding the scenarios.

See [release preservation](results/compact-stage-workspace-release-20261027/README.md). Final checks:317passed,0failed,1intentional skip (318total); TypeScript/all11routes build. Actual cloud Chromium1188/500px evidence is separated from synthetic narrower-width tests and unexecuted physical-phone/touch checks.



## 27 October 2026 · Full campaign research resumed

The owner has now completed and praised all three short human-played games, especially Mars's small unfolding local challenges. The prior content-expansion hold is lifted. Continue developing and evaluating full Mars, Ideas and Elements campaigns toward200–300 combinations each using the current tangible interaction grammar. Preserve understandable stages, durable place, compact workspaces, adjacent creation and current-objective-only gold. Avoid arbitrary choose-two-of-four quotas; the listening-room device was judged contrived. These observations apply to the human-played short versions, not proof that any new long campaign is fun.

A prospective evaluation protocol and versioned common engine are frozen in research/tangible-campaign-20261027/. Seven short new-world candidates are included for falsifiable theme trials, not presented as full-length games. Their14-engine-test/TypeScript validation and authored legal routes establish execution only; no fresh source-blind fun finding exists at this freeze. Longer Mars/Ideas/Elements drafts and mutable sessions/UI are intentionally excluded. The live Site is unchanged. Fresh play must use frozen/v1 inputs, preserve exact command/output/state evidence, permit voluntary stopping and distinguish catalogue size, authored-route length and actual fresh combinations. Any runtime revision needs a new frozen version.



## 27 October 2026 · Current-scene packing and first fresh trial

The newest human rule is to bring only the things needed for the current scene, rather than carrying everything with any eventual use. Engine v3 collects the actual existing objects from visited areas, retains identities/components and records transfers; it does not clone supplies or impose manual retrieval errands. Explicit carry lists remain authoritative. Same-area progression preserves arrangement and placement. This is the current research grammar, not a live Site deployment.

The first frozen Food v1 fresh player stopped voluntarily after10creations, finding the meal mildly satisfying but repeated catalyst staging and unsupported pleasurable combinations discouraging. The exact27-command transcript/state and independent replay are retained; this is agent diagnostic evidence, not human-fun proof. Versioned engine hints and Food revisions address those hypotheses prospectively; they are not yet established improvements.

Frozen long drafts remain below the200–300combination target: Mars's legal goal witnesses194/197/198 with25–26local items, Ideas192 with23, Elements196 with28. Catalogue sizes are not route-length evidence. Three bounded pilots and seven revised mini candidates are preserved for fresh evaluation; no new pilot or second-Food fresh result is claimed here. Earlier failed banks, broad-carry peaks, horizon/retrieval experiments, v1/v2 freezes and reviews remain intact. See research/tangible-campaign-20261027/CHECKPOINT-V3.md. The existing live Site is unchanged.



## 27 October 2026 · Seven small playable theme experiments

The owner-private Site now includes campaign.html with seven short scenarios sharing one tangible engine/browser grammar: Food, Theology, Restoration, Shoreline, Causation, Literature and Chinese thought. This is a separate playable checkpoint, not replacement of the original Mars/Ideas/Elements or a completed200–300combination game. Current-scene packing, explicit goals, current-stage gold, local births, descriptions, mobile-compatible input, undo/reset and legal replay checkpoints use the shared engine. Full-length campaign research continues separately.

See results/shared-campaign-ui-preservation-20261027/README.md for exact deployed source and evidence. Final aggregate358passed,0failed,1intentional skip; TypeScript and12routes build;41focused checks passed. Native cloud Chromium500px checks cover Food and Literature, including real mouse combination and receiving-target fermentation. Physical iPhone/touch and human enjoyment remain unverified. The stopped Food v1 logical trial remains historical evidence, not retroactively improved.

## 2026-10-27: immutable round-one evidence and next campaign candidates

Overnight continuation remains authorized. This research checkpoint preserves ten CLOSED fresh logical-play sessions with exact command/output/state captures, voluntary stop reports, and independent replay/baseline deductions under `research/tangible-campaign-20261027/reviews/play/`. Negative and stopped outcomes are retained, not replaced by success summaries. These are agent logical-play observations, not human playtests or proof of fun.

Frozen v5 engine and source-aware candidates now have mechanically witnessed routes around 200 combinations: Mars 202–206, Ideas 199–203, Elements 197. These counts are not full human-fun evidence and some paths remain short of 200. Chinese thought as a standalone scenario is retired per the user's direction (historical evidence retained); causation is rethought as a purpose-led boat problem. Ideas incorporates a narrow source-reviewed field chapter. All previous records remain; this update supersedes earlier candidate-status summaries only.

This is research preservation, not a Site release. Mutable integration and UI save-codec work, including release-v1 completion patches, are excluded. No new browser or live deployment claim is made here.

