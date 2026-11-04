# Make Something Worthwhile

## Philosophy

**Make Something Worthwhile** is part game but part educational toy: playing can leave you with real understanding of how things are made and how ideas work. Treat players as capable of serious learning, from proper culinary technique and practical construction to master's-level theology and intellectual history made approachable to high-schoolers. In the spirit of *Why Don't You?*, invite curiosity, making and discovery through enjoyable play, with knowledge and skills worth carrying into life beyond the game.

## Project

Five combination stories authored in Markdown, with complete artwork for Settlement, Cookbook and Mars. Cookbook uses Cook’s Pen illustrations, including domestic tea and dinner scenes; Mars uses physical expedition equipment and integrated landscapes. The browser game, story linter, checkpoint generator and logical AI playtester share one parser and game engine. The project has three commitments: combination, enjoyable interactive play and an empirical loop that can reject weak ideas.

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

**Cookbook** teaches practical cooking through pen-and-wash illustrations, from breakfast through afternoon tea to dinner: `/combinations.html?story=cookbook/cookbook.md`. See its [design examples](stories/cookbook/design-examples.png) and lasting [design brief](stories/cookbook/design-brief.md). The completed [Cookbook study](<archive/2026.11.01 cookbook study/README.md>) retains the adaptation research, artistic directions and verdicts, comparisons, production source art and all 35 completed cookbook page PNGs.

**Mission to Mars** follows a solo astronaut from a crash through shelter, farming, an uncertain discovery and a return built with local iron: `/combinations.html?story=mars/mars.md`. The [live story](stories/mars/mars.md), [design brief](stories/mars/design-brief.md) and [three moments of play](stories/mars/design-exxamples.png) preserve its austere physical character. The active [Mars study](projects/mars-study/README.md) retains the unchanged v12 reference, earlier versions, production artwork and review outcomes.

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

Mars now uses the accepted 24-chapter v12 story at the main route. Future edits belong in `stories/mars`; the v12 reference stays unchanged. The study remains active for the remaining artwork. The [promotion record](projects/mars-study/promotion/README.md) records copy integrity, checks and the existing exhaustive-lint limit. Project drafts for ongoing work stay outside the published catalogue and build; use the [authoring workflow](docs/story-authoring.md#check-and-preview-a-draft) to preview them.

`npm run build` runs story lint, TypeScript checking and Vite bundling in sequence. Lint errors stop the command; warnings allow it to continue. This check runs when the build command is invoked; `npm run dev` and ordinary story loading do not run the CLI lint check. The live editor displays its own diagnostics without blocking saving or preview.

Chromium supports the browser tests and measures actual hotspot hit areas for `place:` lint. Only manuscripts containing `place:` entries launch it during lint/build. The [specification](docs/story-format-spec.md) owns placement syntax and validation.

The build produces `dist/` with separate bundled JavaScript/CSS, ordinary story Markdown/artwork files, a catalogue, and a copy of `combinations.html` in each manuscript directory. Deploy the whole directory to a static web server; see [GitHub Pages publication](#github-pages-publication) for this repository's setup. The HTML currently depends on the shared `assets/` bundles; it is not a standalone file. Editing a deployed Markdown file or its artwork does not require rebuilding JavaScript. The catalogue's entries, titles and descriptions are generated at build time.

### GitHub Pages publication

Keep `dist/` in Git alongside the source. Configure GitHub **Settings → Pages → Build and deployment → Deploy from a branch**, selecting **main** and **/(root)**. Once published, the game is served at `https://ljw1004.github.io/combination-challenge/dist/`.

The root [`_config.yml`](_config.yml) excludes everything except `dist/`, including documentation, source, tests, archives and project artwork. Add any new root files or directories to its exclusion list. It also disables Jekyll's theme and automatic Markdown-page generation, preserving the raw stories. Do not add a root `.nojekyll`: that would bypass the exclusions and publish the rest of the repository. The website root has no landing page; use the `/dist/` address.

Before publishing an update, run `npm run build`, then commit the matching source changes and all `dist/` changes (including removed bundles), and push to `main`. The build runs lint and type checking before bundling. GitHub handles publication of the committed output; there is no custom Actions workflow or separate publishing branch. Treat `dist/` as generated output: edit the source and rebuild instead of editing it directly.

## Edit a story live

Click the **bug icon** to toggle the debug pane. On desktop, the game uses its natural 390px width and the Markdown editor fills all remaining window space. Opening it aligns the caret, editor scroll and chapter dropdown with the current gameplay chapter; see the [debug-pane contract](docs/ux.md#debug-pane).

Edits save immediately and update the current game view, including open readings, goals, rules and backgrounds. When there are local edits, a red pen replaces the bug icon; both toggle the same pane. The panel opens automatically on desktop if the story URL has a saved draft **or** its editor was last left open; closing it is remembered but does not override a saved draft.

The chapter dropdown above the editor normally follows your caret; [gameplay chapter arrivals](docs/ux.md#debug-pane) also update its title and scroll the editor while preserving the caret. Choose a chapter to generate its starting checkpoint from the current draft; if your caret is elsewhere, the editor scrolls to that chapter and places it at the end of the heading. Choosing the chapter you are already editing preserves your position. Chapter-heading lightbulbs also offer **Jump to checkpoint**. Use the first chapter to start again.

On screens narrower than 900px, the icon opens a compact **Jump to chapter** picker instead. Tap a chapter to generate its checkpoint; the current chapter is highlighted. The Markdown editor is unavailable at that width. Local drafts still power the game and retain their red-pencil indicator. Resizing back to desktop restores the editor session.

Each draft shadows its original story URL in this browser. Closing the editor, restarting the game and reloading keep the draft. **Delete draft…** is a separate, confirmed action that reloads the original file. To export your Markdown, focus the text, select all (Cmd+A or Ctrl+A), and copy (Cmd+C or Ctrl+C) into a file for you to publish yourself. Nothing uploads automatically.

Cmd+F (Ctrl+F on other platforms) opens Find/Replace. The count reads **3 of 15** for a selected match, or **? of 15** after moving the caret elsewhere; previous/next searches from that position. See [UX](docs/ux.md#debug-pane) for the complete search behavior.

Item, hotspot and chapter references appear in blue; `> NOTE:` comments appear in muted grey italics. Hover a reference for its descriptions, properties, creating/using combinations and goals; chapter hover shows its introduction, position and goals. Hover a Markdown image for a preview. Hold Cmd (Ctrl off macOS) to underline a reference, then click to go to its declaration. Clicking a declaration, or a reference with no declaration, opens a live references list beneath the editor. F12 follows the same navigation; Shift+F12 opens references directly. See [UX](docs/ux.md#debug-pane) for declaration, reference-list and keyboard behavior.

Invalid Markdown still produces a best-effort preview. Temporarily deleting the current chapter can move that preview elsewhere; restoring the text returns to the previous game position until you interact with the game. Game actions, deliberate reading/dismissal and scrolling establish a new position. Editing alone does not commit these provisional changes.

Fast diagnostics update shortly after typing; continuation and exclusivity analysis runs in one background worker. Squiggles have hover explanations. The scrollable diagnostics list stays in source order; click an entry to select its text and show its compact related-location bullets. Clicking it again collapses the bullets while keeping it selected. Only the selected diagnostic's related locations are shown. Existing diagnostics and related locations follow insertions/deletions while updated analysis is pending.

Items and hotspots require explicit declarations, including recipe results. Missing declarations are errors; declarations without references produce warnings. Forward references are supported, and incomplete drafts still save and preview. See the [specification](docs/story-format-spec.md#specification) for declaration syntax and the [authoring guide](docs/story-authoring.md#give-chapters-a-purpose-and-a-manageable-working-set) for keeping primitive supplies in their intended chapters.

Every blue lightbulb overlays the bottom-right of its applicable text and toggles a menu, without expanding or collapsing diagnostics. Cmd+. (Ctrl+. on other platforms) opens actions on the caret's row; use arrow keys and Enter to choose, or Escape to dismiss. See [UX](docs/ux.md#debug-pane) for the interaction contract.

Mixed-fate warnings break down preservation, consumption and transformation, including defaults and implicit slot installation. Their popup names the item and offers **always preserve**, **always transform** or **always consume**, limited to fates already present. Long item headings are truncated; hover the heading for the full name. A fix consolidates the authored uses in one saved, undoable edit. Choices incompatible with implicit slot behavior explain the constraint. Fixes wait for current diagnostics after typing. Three-goal and three-hotspot warnings offer **Suppress warning with an explanation**, inserting the [required acknowledgment](docs/story-format-spec.md) and selecting its reason placeholder.

Drafts use browser local storage, keyed by the full Markdown URL. Two player routes resolving to the same URL share a draft; changing the website origin or story path creates a separate one. Other tabs' versions remain available under **Saved copies**, without replacing your open buffer. Each editing session retains its latest saved buffer; loading a saved copy also preserves the current buffer. Older session copies are currently kept without automatic pruning, and the list shows copies differing from the open text. A failed save produces a visible warning and leaves the text available to select and copy. Browser data clearing, storage eviction and private browsing can remove local drafts; copy the Markdown into a file when you want a backup outside this browser.

## Story layout

The five bundled manuscripts use their story names as filenames:

```text
stories/<slug>/<slug>.md
stories/<slug>/assets/...
```

Multiple manuscripts can share a directory and its artwork: for example, `stories/theology/theology.md` and `stories/theology/alternate.md` can both reference `assets/scene.webp` in `stories/theology/assets/`. Catalogue discovery finds `.md` manuscripts under `stories/`, excluding the reserved filename `design-brief.md` (case-insensitive). A story may keep its durable editorial and visual intent in that companion brief. Keep research, iteration notes and other non-story documentation in its project directory.

The linter, checkpoint and playtesting tools accept the path relative to `stories/`, such as `theology/theology.md`, or a filename without `.md`, such as `theology`, when that short name is unique. `npm run play -- list` lists the full paths. The [analyzer](#story-analysis) takes explicit file paths relative to the current directory or absolute paths, and recognizes stories by content. The browser uses each Markdown URL for independent drafts and saves, including when manuscripts share a directory. Neither the path nor filename is the player-facing title. Vite serves the contents of `stories/` at the site root. Start with the [authoring guide](docs/story-authoring.md) when writing a story and consult the [specification](docs/story-format-spec.md) for syntax and semantics.

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
| Logical player | `npm run play -- list` | List stories; start human play with `npm run play -- --fast STORY` or `--detailed STORY`. |
| AI playtester | `npm run playtest -- --fast ...` or `--detailed ...` | Run a JSON agent process or service through the selected player interface. |
| Evaluator | `npm run evaluate -- SESSION` | Verify frozen replay and write an evidence profile. |
| Story analyzer | `npm run analyze -- FILE` | Print six plain-text answers, or use `--table FILE ...` for a comparison; [counting guide](docs/story-authoring.md#analyze-combination-structure). |

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

### Story analysis

Run `npm run analyze -- path/to/story.md` for the six-line structural summary. See [combination structure and analysis](docs/story-authoring.md#analyze-combination-structure) for when to use it, counting definitions, comparison tables and detailed checkpoint measurements.

## Logical playtesting

See [fun playtests and command-line play](docs/fun-and-evaluation.md#logical-playtesting) for human play, AI sessions, retained run files and independent grading.

## Documentation map

Each document owns one aspect of working here. Update the owning document and link to it from elsewhere.

| Document | Purpose |
|---|---|
| This README | Project orientation, setup, directory layout, tool catalog. |
| [Story format](docs/story-format-spec.md) | Markdown syntax, game semantics and required diagnostics. |
| [Story authoring](docs/story-authoring.md) | The iteration process, active-brief ownership, review assignments, reusable physical/intellectual story techniques, analysis and draft checks. |
| [Icon guide](docs/icon-guide.md) | Detailed graphics production, recognition review, scene registration and artwork integration. |
| [Active projects](projects/README.md) | Work in progress and the editorial/research backlog. |
| [UX](docs/ux.md) | All current player and authoring UX decisions, their known motivations, and maintenance rules; no historical log. |
| [Engineering](docs/engineering.md) | Implementation boundaries, technical constraints and testing policy. |
| [Fun and evaluation](docs/fun-and-evaluation.md) | Experience criteria, playtest workflow and canonical player/grader rubrics. |
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
- `src/analysis/`: structural story statistics and measurements of a legal reference replay.
- `src/playtest/`: player observations, frozen sessions, AI transport and evaluation.
- `docs/`: standing specifications, adopted guidance and reusable workflows.
- `projects/`: active project briefs, research, plans and supporting material; see the [project index](projects/README.md).
- `stories/`: active stories and their assets.
- `runs/`: ignored trial generations, intermediate artwork, review sheets and verification output; see the [retention policy](docs/engineering.md#verification-records) for selected production and requested deliverables.
- `archive/`: historical source and research; follow its [usage policy](archive/README.md).
