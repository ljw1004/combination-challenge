# Make Something Worthwhile

## Philosophy

**Make Something Worthwhile** is part game but part educational toy: playing can leave you with real understanding of how things are made and how ideas work. Treat players as capable of serious learning, from proper culinary technique and practical construction to master's-level theology and intellectual history made approachable to high-schoolers. In the spirit of *Why Don't You?*, invite curiosity, making and discovery through enjoyable play, with knowledge and skills worth carrying into life beyond the game.

## Project

Five combination stories authored in Markdown, with complete artwork for Settlement and Cookbook. The browser game, story linter, checkpoint generator and logical AI playtester share one parser and game engine. The project has three commitments: combination, enjoyable interactive play and an empirical loop that can reject weak ideas.

## Run the game

Use Node.js 22.18 or later.

```sh
npm install
npx playwright install chromium
npm run dev
```

Open the local address printed by Vite. Drag things together; compatible partners are highlighted without revealing the future result. Goals sit at the bottom and become the next-chapter arrow when complete. Reopen the chapter text through its goals for the applicable recovery action; automatic chapter introductions have only **Begin**. The discreet bug icon toggles the debug pane for live story editing and checkpoint jumps. See [UX](docs/ux.md) for the interaction and recovery rules.

Seven icon styles are retained as [reference collections](references/icon-sets/), each with its own description and preview.

**Settlement: A River Worth Returning To** uses rustic coloured woodcuts: `/combinations.html?story=settlement/settlement.md`.

**Cookbook** develops a cookbook through pen-and-wash illustrations: `/combinations.html?story=cookbook/cookbook.md`. The ongoing [Cookbook study](projects/cookbook-study/README.md) brings together the cookbook adaptation, icon research and comparisons, thematic backgrounds, page composition and pencil stations. Its curated collection retains artistic directions and verdicts, inspiration references, selected finished comparisons, production source art and all 35 completed page PNGs.

The player fetches Markdown as an ordinary file. These routes work in development and the production build:

| Player URL | Markdown fetched |
|---|---|
| `/combinations.html?story=settlement/settlement.md` | `/settlement/settlement.md` |
| `/combinations.html?story=cookbook/cookbook.md` | `/cookbook/cookbook.md` |
| `/combinations.html?story=theology/theology.md` | `/theology/theology.md` |
| `/combinations.html?story=mars/mars.md` | `/mars/mars.md` |
| `/mars/combinations.html?story=mars.md` | `/mars/mars.md` |
| `/mars/combinations.html` | `/mars/story.md` (supply this file to use this route) |
| `/combinations.html` | `/story.md` (supply this file to use this route) |

The `story` parameter points to a `.md` file on the same server. Relative paths resolve against the player page, so the same layout works under a website subdirectory; root-relative paths also work. Without the parameter, the player always requests `story.md` beside itself. A missing story displays an error. Relative artwork references resolve against the Markdown file's directory; absolute HTTP(S) image URLs also work. Markdown is rendered without executing embedded HTML or scripts.

`npm run build` runs story lint, TypeScript checking and Vite bundling in sequence. Lint errors stop the command; warnings allow it to continue. This check runs when the build command is invoked; `npm run dev` and ordinary story loading do not run the CLI lint check. The live editor displays its own diagnostics without blocking saving or preview.

Chromium supports the browser tests and measures actual hotspot hit areas for `place:` lint. Only manuscripts containing `place:` entries launch it during lint/build. The [specification](docs/story-format-spec.md) owns placement syntax and validation.

The build produces `dist/` with separate bundled JavaScript/CSS, ordinary story Markdown/artwork files, a catalogue, and a copy of `combinations.html` in each manuscript directory. Deploy the whole directory to a static web server. The HTML currently depends on the shared `assets/` bundles; it is not a standalone file. Editing a deployed Markdown file or its artwork does not require rebuilding JavaScript. The catalogue's entries, titles and descriptions are generated at build time.

## Edit a story live

Click the **bug icon** to toggle the debug pane. On desktop, the game uses its natural 390px width and the Markdown editor fills all remaining window space.

Edits save immediately and update the current game view, including open readings, goals, rules and backgrounds. When there are local edits, a red pen replaces the bug icon; both toggle the same pane. The panel opens automatically on desktop if the story URL has a saved draft **or** its editor was last left open; closing it is remembered but does not override a saved draft.

The chapter dropdown above the editor follows your caret. Choose a chapter to generate its starting checkpoint from the current draft; if your caret is elsewhere, the editor scrolls to that chapter and places it at the end of the heading. Choosing the chapter you are already editing preserves your position. Chapter-heading lightbulbs also offer **Jump to checkpoint**. Use the first chapter to start again.

On screens narrower than 900px, the icon opens a compact **Jump to chapter** picker instead. Tap a chapter to generate its checkpoint; the current chapter is highlighted. The Markdown editor is unavailable at that width. Local drafts still power the game and retain their red-pencil indicator. Resizing back to desktop restores the editor session.

Each draft shadows its original story URL in this browser. Closing the editor, restarting the game and reloading keep the draft. **Delete draft…** is a separate, confirmed action that reloads the original file. To export your Markdown, focus the text, select all (Cmd+A or Ctrl+A), and copy (Cmd+C or Ctrl+C) into a file for you to publish yourself. Nothing uploads automatically.

Cmd+F (Ctrl+F on other platforms) opens Find/Replace. The count reads **3 of 15** for a selected match, or **? of 15** after moving the caret elsewhere; previous/next searches from that position. See [UX](docs/ux.md#debug-pane) for the complete search behavior.

Item and hotspot references appear in blue; `> NOTE:` comments appear in muted grey italics. Hover a reference for its descriptions, properties, creating/using combinations and goals, or hover a Markdown image for a preview. Hold Cmd (Ctrl off macOS) to underline a reference, then click to go to its declaration. Clicking a declaration, or a reference with no declaration, opens a live references list beneath the editor. F12 follows the same navigation; Shift+F12 opens references directly. See [UX](docs/ux.md#debug-pane) for declaration, reference-list and keyboard behavior.

Invalid Markdown still produces a best-effort preview. Temporarily deleting the current chapter can move that preview elsewhere; restoring the text returns to the previous game position until you interact with the game. Game actions, deliberate reading/dismissal and scrolling establish a new position. Editing alone does not commit these provisional changes.

Fast diagnostics update shortly after typing; continuation and exclusivity analysis runs in one background worker. Squiggles have hover explanations. The scrollable diagnostics list stays in source order; click an entry to select its text and show its compact related-location bullets. Clicking it again collapses the bullets while keeping it selected. Only the selected diagnostic's related locations are shown. Existing diagnostics and related locations follow insertions/deletions while updated analysis is pending.

Items and hotspots require explicit declarations, including recipe results. Missing declarations are errors; declarations without references produce warnings. Forward references are supported, and incomplete drafts still save and preview. See the [specification](docs/story-format-spec.md#specification) for declaration syntax and the [authoring guide](docs/story-authoring.md#give-chapters-a-purpose-and-a-manageable-working-set) for keeping primitive supplies in their intended chapters.

Every blue lightbulb overlays the bottom-right of its applicable text and toggles a menu, without expanding or collapsing diagnostics. Cmd+. (Ctrl+. on other platforms) opens actions on the caret's row; use arrow keys and Enter to choose, or Escape to dismiss. See [UX](docs/ux.md#debug-pane) for the interaction contract.

Mixed-fate warnings break down preservation, consumption and transformation, including defaults and implicit slot installation. Their popup names the item and offers **always preserve**, **always transform** or **always consume**, limited to fates already present. Long item headings are truncated; hover the heading for the full name. A fix consolidates the authored uses in one saved, undoable edit. Choices incompatible with implicit slot behavior explain the constraint. Fixes wait for current diagnostics after typing. A three-goal warning offers **Suppress warning with an explanation**, inserting the [required acknowledgment](docs/story-format-spec.md) and selecting its reason placeholder.

Drafts use browser local storage, keyed by the full Markdown URL. Two player routes resolving to the same URL share a draft; changing the website origin or story path creates a separate one. Other tabs' versions remain available under **Saved copies**, without replacing your open buffer. Each editing session retains its latest saved buffer; loading a saved copy also preserves the current buffer. Older session copies are currently kept without automatic pruning, and the list shows copies differing from the open text. A failed save produces a visible warning and leaves the text available to select and copy. Browser data clearing, storage eviction and private browsing can remove local drafts; copy the Markdown into a file when you want a backup outside this browser.

## Story layout

The five bundled manuscripts use their story names as filenames:

```text
stories/<slug>/<slug>.md
stories/<slug>/assets/...
```

Multiple manuscripts can share a directory and its artwork: for example, `stories/theology/theology.md` and `stories/theology/alternate.md` can both reference `assets/scene.webp` in `stories/theology/assets/`. The catalogue and CLI tools discover all `.md` files under `stories/`. Keep non-story documentation outside that directory.

CLI tools accept the path relative to `stories/`, such as `theology/theology.md`, or a filename without `.md`, such as `theology`, when that short name is unique. `npm run play -- list` lists the full paths. The browser uses each Markdown URL for independent drafts and saves, including when manuscripts share a directory. Neither the path nor filename is the player-facing title. Vite serves the contents of `stories/` at the site root. Start with the [authoring guide](docs/story-authoring.md) when writing a story and consult the [specification](docs/story-format-spec.md) for syntax and semantics.

Settlement (`settlement`) and Theology (`theology`) were renamed from Elements (`elements`) and Divinity (`divinity`) on 31 October 2026. The old story routes, including the earlier `elements-icons` route, are no longer served. Existing browser saves and drafts remain under their original URLs; the renames do not migrate or delete them.

The manuscripts were subsequently renamed from `story.md` to `<slug>.md`, and folder-only `?story=<slug>` links were replaced by file paths. Saves and drafts for those former Markdown URLs likewise remain at their old keys; they are not migrated to the new filenames.

## Tools

| Tool | Command | Purpose |
|---|---|---|
| Browser game | `npm run dev` | Start the local Vite server. |
| Debug pane | **bug/red pen icon** | Edit a durable local draft on desktop; jump to a chapter on mobile. |
| Story linter | `npm run lint` | Check all stories against the specification; errors fail the command, warnings require author review. |
| Type checker | `npm run check` | Check active TypeScript source. |
| Default tests | `npm test` | Run semantic tests and Chromium interaction checks. |
| Browser tests | `npm run browser-test` | Run just the Chromium checks. |
| Production build | `npm run build` | Run lint and type checking, then bundle the browser game. |
| Checkpoint generator | `npm run checkpoint -- STORY CHAPTER_INDEX [OUTPUT.json]` | Prepare a chapter through a legal replay. |
| Logical player | `npm run play -- list` | List stories and session commands. |
| AI playtester | `npm run playtest -- ...` | Run a JSON agent process or service through the player interface. |
| Evaluator | `npm run evaluate -- SESSION` | Verify frozen replay and write an evidence profile. |

Useful authoring commands:

```sh
npm run lint -- mars --details
npm run lint -- --json
npm run checkpoint -- mars 3 /tmp/mars-chapter-4.json
```

Lint also checks optional content against goal-directed progression using the pessimistic construction-set calculation in the [formal lint catalogue](docs/story-format-spec.md#lint-rules). Opportunity warnings name a blocking chapter/dependency and link to relevant source rules. Fast editor diagnostics remain available while deep checks run in the worker.

Measure construction-set analysis:

```sh
npm run lint -- --analysis-stats
npm run lint -- --json --analysis-stats
```

Analysis stops at the 101st distinct alternative in a construction-set family or merged chapter frontier. Each set has one working state; independent goals do not generate a search over partially completed subsets. Statistics distinguish cumulative construction-set evaluations, engine operations and the largest family of alternatives. JSON adds chapter counts, OPTIONAL item counts and phase/timing details. The [specification](docs/story-format-spec.md#opportunities-for-authored-content) defines the algorithm and its deliberate approximation; [working notes](notes.md#31-october-2026-retained-opportunity-linter) record its acceptance and verification.

Lint details include source lines; JSON includes a UTF-16 text span (`from`, `to`, end-exclusive) for every diagnostic and related locations for contrasting rules. Checkpoints work through preceding goals and their dependencies, preferring preparations whose inputs already exist and avoiding unrelated combinations. Chapter indices are zero-based. These are legal developer witnesses, not fresh player experiences or a claim of globally shortest solutions.

## Logical playtesting

The runner plays the same rules as the browser without pretending to test drag, scroll, visual composition or native touch. It presents currently available things, hotspots, goals, ordinary story/creation cards and compatible partners. It omits recipe outputs, future goals, author notes, hidden slot requirements and checkpoint routes.

### Player commands

```sh
npm run play -- list
npm run play -- init trial-01 mars
npm run play -- view trial-01
npm run play -- act trial-01 '{"type":"dismiss"}'
npm run play -- act trial-01 '{"type":"combine","a":"name:Broken radio","b":"name:Cable"}'
npm run play -- stop trial-01 '{"experience":"Describe concrete moments here","nextExperiment":"A change worth comparing"}'
npm run evaluate -- trial-01
```

`npm run play -- init SESSION STORY` creates a fresh session. `view SESSION` prints its observation. `act SESSION ACTION_JSON [ACCOUNT_JSON]` applies one action. `report SESSION REPORT_JSON` saves a report; `stop SESSION REPORT_JSON` saves a report and closes the session without requiring completion.

Actions:

| Type | Fields | Purpose |
|---|---|---|
| `combine` | `a`, optional `b`, optional `hotspot`, optional receiving `chapter` | Use a listed partner action. A contextual two-item combination requires the receiving `b` already placed at the hotspot. An item/hotspot operation defaults to its latest visited surface; `chapter` can select an older occurrence. |
| `move` | `item`, visited `chapter`, finite `x`, `y`, optional `hotspot` | Ordinary reversible movement/placement. |
| `read` | `item` | Open an available item's applicable explanation. |
| `dismiss` | none | Close the current story/discovery card. |
| `advance` | none | Continue after the current goals and cards are complete. |

Browser saves may also record `resultPlacement: {x, y}` on a combination when a hotspot's authored `place:` destination succeeds. These are unscaled item top-left coordinates after measuring its artwork. Replay applies that placement and hotspot membership in the same action. Logical clients normally use the listed partner actions without this presentation field.

### Agent transport

For an unattended AI trial, connect a JSON agent process or service:

```sh
npm run playtest -- --story mars --session ai-trial-01 --model my-agent \
  --agent '["/absolute/path/to/agent"]' --max-turns 300
```

No provider subscription or secret is built into the project.

The command is executed without a shell in an empty temporary working directory. It receives one JSON request on stdin, closes stdin, and must emit one JSON object on stdout. It is restarted for each turn, so relevant observations/history are included in each request. A configured agent may keep its own conversation context. The runner does not enforce an operating-system sandbox: source isolation is a player-assignment contract, and a source-exposed participant must be labelled diagnostic.

Alternatively, `--endpoint URL` POSTs the same JSON to a user-configured agent service. If `PLAYTEST_API_KEY` is set, it is sent as a bearer credential to that endpoint. The endpoint implements this small agent protocol; it is not assumed to be any particular model provider's raw API. Credentials are not written to run artifacts. Requests time out after 60 seconds. `--max-turns` is an upper bound, never a completion quota.

Example agent reply:

```json
{
  "action": {"type":"combine","a":"name:Broken radio","b":"name:Cable"},
  "account": {"intention":"Restore contact","expected":"The cable may repair the radio"}
}
```

The runner also accepts `{ "stop": true, "report": { ... } }`. Reports should describe specific valued/confusing passages, pacing, learning, optional continuation or stopping, and one next experiment. Accounts are optional; no new strategic dilemma is required for each action. See [the evaluation criteria](docs/fun-and-evaluation.md).

For an evaluable experience profile, `report.criteria` maps the supplied criterion IDs (`intelligibility`, `learning`, `construction`, `pacing`, `continuity`, `choice`) to `{ "assessment": "supported|concerning|mixed|unknown", "explanation": "...", "events": [1, 4] }`. Event references must name actual sequence numbers. Missing or invalid evidence produces an unknown assessment. Trace-linked claims remain attributed self-reports, not independently established enjoyment. The runner requests a final reflection when a completed or budget-limited run lacks one.

### Frozen evidence and evaluation

Run artifacts described below are temporary working files. Keep only instructions and concise final outcomes; discard raw inputs and outputs after evaluation under the [verification retention policy](docs/engineering.md#verification-records).

Each session folder contains `story.md`, a snapshot of active runtime source and package metadata, and `session.json`. The session retains story/runtime hashes, assignment, participant/model label, exact observations, accepted and rejected actions, optional accounts and outcome. Changing the runtime prevents continuing an old session; it does not rewrite the old record. The evaluator uses that session's frozen runtime to verify replay.

`npm run evaluate -- SESSION` writes `evaluation.json`; add `--verify-only` to check the frozen hashes and replay without rewriting the evaluation. Mechanical evidence and player reports remain separate. Counts exclude reading and card dismissal from combinations. An absent report remains absent. The evaluation carries concrete accounts and a next-experiment hypothesis rather than claiming a computed human-fun score.

Use different session IDs for different versions and conditions. Preserve a baseline before editing a story. If a player or author has seen developer recipes, choose a diagnostic condition through the session API and do not relabel it fresh. Checkpoint generation is a separate developer tool.

`runs/` is ignored temporary output, created as needed by the playtesting tools. Record final conclusions, significant failures and limitations in the project's outcome document, then discard the run folder. Do not move complete session folders or compressed run bundles into projects or the archive. `COMBINATION_RUNS_DIR` selects another temporary output or verification directory. Older archived runs remain historical material; see the [archive guide](archive/README.md#project-evidence).

## Documentation map

Each document owns one aspect of working here. Update the owning document and link to it from elsewhere.

| Document | Purpose |
|---|---|
| This README | Project orientation, setup, directory layout, tool catalog and playtesting commands/protocol. |
| [Story format](docs/story-format-spec.md) | Markdown syntax, game semantics and required diagnostics. |
| [Story authoring](docs/story-authoring.md) | How to design, write and revise a compelling story. |
| [Icon guide](docs/icon-guide.md) | How to research, develop, review and produce a story's icon set. |
| [Active projects](projects/README.md) | Work in progress and the editorial/research backlog. |
| [UX](docs/ux.md) | All current player and authoring UX decisions, their known motivations, and maintenance rules; no historical log. |
| [Engineering](docs/engineering.md) | Implementation boundaries, technical constraints and testing policy. |
| [Fun and evaluation](docs/fun-and-evaluation.md) | Research, experience criteria and the experimental method. |
| [Backlog](projects/backlog.md) | Current story directions, unresolved work and future ideas. |
| [Completed authenticity pass](<archive/2026.10.30 authenticity improvements/authenticity-improvements-2026-10-30.md>) | Historical findings, implemented changes, retained decisions and supporting evidence. |
| [Archive](archive/README.md) and [salvage index](archive/salvage-index.md) | Archival policy, preservation and provenance of recovered guidance. |
| [Working notes](notes.md) | Dated hypotheses, decisions, work performed and evidence limits. |
| [Agent instructions](AGENTS.md) | Repository-specific instructions for coding agents. |

## Repository map

Maintain the [strict directory hygiene defined in AGENTS.md](AGENTS.md#directory-hygiene).

- `src/story/`: source-located Markdown model and parser.
- `src/engine/`: deterministic state, actions, needs, exclusivity and retention analysis.
- `src/lint/`: specification diagnostics and CLI.
- `src/web/`: browser presentation, touch/pointer handling, reading and persistence.
- `src/debug/`: legal replay checkpoint planning.
- `src/playtest/`: player observations, frozen sessions, AI transport and evaluation.
- `docs/`: standing specifications, adopted guidance and reusable workflows.
- `projects/`: active project briefs, research, plans and supporting material; see the [project index](projects/README.md).
- `stories/`: active stories and their assets.
- `runs/`: ignored temporary playtest output; retain only instructions and final conclusions in the named project.
- `archive/`: historical source and research; follow its [usage policy](archive/README.md).
