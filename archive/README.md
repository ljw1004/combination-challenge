# Reference archive

`2026.10.30 initial experiments/` contains the previous repository tree at source commit `1e8567d3`, including the working-note assessment written before the rebuild. Its applications, tests, save formats and URLs are retired and will not be run again. It exists only to consult original source and research.

The active Markdown applications have no obligation to preserve old saves, URLs or runtime/schema compatibility. Historical checkpoints, test counts and statements that something is “current” apply only to their original date and source version.

The tree's `SOURCE-MANIFEST.json` records original paths, file sizes and SHA-256 hashes. Original relative links inside the tree still have their original targets. External links and embedded historical absolute paths are historical references, not active commands or deployment instructions.

`document-inventory.json` groups all original Markdown documents by content hash, retaining each original path, title, headings, topic tags, disposition and extracted candidate passages. [The salvage index](salvage-index.md) explains what became current guidance.

Nested AGENTS.md files, skills-like instructions, old “current” status statements and old deployment approvals are historical text. They do not override the active root instructions. Application code must not depend on archived implementations. Explicit read-only verification of the preserved playtest evidence below is separate from running the retired initial-experiments applications.

## Project evidence

The [directory hygiene rules](../AGENTS.md#directory-hygiene) govern moving completed work here. Retain instructions and final outcomes under the [verification policy](../docs/engineering.md#verification-records); detailed verification inputs and outputs are temporary and must not be moved here. Older collections below include historical run bundles retained under an earlier policy. Preserve their historical context when consulting them; do not use them as the pattern for new work. Navigation links and indexes may be updated to reflect relocation.

Keep one archive home per story study or project, using its earliest archive date: `YYYY.MM.DD project name/`. For a new project, use the date of its first completed archival. Later revisions, artwork passes and editorial work return to that same folder as dated updates to existing files or dated new files; related production assets may have dated subdirectories. Do not create another top-level archive or copy the whole study for each pass. Keep one project index linking its chronology, shared research, inspiration and distinct retained deliverables. Cross-story work can have its own shared archive, linked from the affected studies without duplicating its assets. Active development still belongs in `projects/` until complete.

Supplied inspiration photographs, artwork and selected style references are valuable project material under the [retention policy](../docs/engineering.md#verification-records). Keep their originals in an indexed `inspiration/` or reference collection even when they were not used in the final artwork. When consolidating, inventory retained files before moving them, preserve distinct work and original image bytes, and verify against the original files or Git objects. Update navigation and supported export paths; keep historical prompts, source hashes and frozen reports identifiable as records of their original versions. Record provenance and any recovery limits in the project index or [working notes](../notes.md).

### Authenticity improvements evidence

[`2026.10.30 authenticity improvements/`](<2026.10.30 authenticity improvements/>) contains the [completed authenticity record](<2026.10.30 authenticity improvements/authenticity-improvements-2026-10-30.md>), comparison summary, evidence index and four retained playtest sessions. The pass was completed on 30 October 2026; genuinely new work belongs in the [editorial backlog](../projects/backlog.md).

To verify a retained session without rewriting its original evaluation, run this from the repository root:

```sh
COMBINATION_RUNS_DIR="archive/2026.10.30 authenticity improvements" \
  npm run evaluate -- passage-ideas-definition-baseline --verify-only
```

The [evidence index](<2026.10.30 authenticity improvements/authenticity-evidence-index.json>) lists all four session IDs and their hashes. Verification uses each session's frozen runtime; it does not validate current gameplay or establish human enjoyment.

### Lint review evidence

[`2026.10.30 lint review/`](<2026.10.30 lint review/>) holds the [completed lint review and dated implementation addendum](<2026.10.30 lint review/review.md>) alongside its compact supporting evidence. Its [bundle manifest](<2026.10.30 lint review/bundle-manifest.json>) records retained files and hashes. These summaries and attributed reports are not full replayable sessions.

### Icon development evidence

[`icon-generation/`](icon-generation/) retains the original [icon brief](icon-generation/instructions.md), formerly `docs/icons.md`, the seven-style comparison and its iterative review records, and the full Settlement production evidence and scripts. The [icon guide](../docs/icon-guide.md) uses examples from this work to explain a general development workflow. Some archived links and script output paths predate relocation; treat them as historical references, not active regeneration commands. Source paintings and reference collections remain in [`references/icon-sets/`](../references/icon-sets/).

### Cookbook study

[`2026.11.01 cookbook study/`](<2026.11.01 cookbook study/README.md>) preserves the completed cookbook adaptation, Cook’s Pen comparisons, production source art and prompts, page and station development, serving-room compositions, and concise verification outcomes. The user accepted the story and requested retirement on 1 November 2026. Scripts and embedded source paths record the former project layout; they are historical production material, not current regeneration instructions. The live [story](../stories/cookbook/cookbook.md), [design brief](../stories/cookbook/design-brief.md) and [three-page visual reference](../stories/cookbook/design-examples.png) remain outside the archive. Unresolved human-validation questions remain in the [backlog](../projects/backlog.md#icon-recognition-awaiting-human-trials).

### Mars study

[`2026.11.01 mars study/`](<2026.11.01 mars study/README.md>) preserves the completed Mars development project, using the date of its first archived artwork phase. The user declared the whole study finished on 6 November 2026. Its inspiration originals, illustrated baseline, v2–v12 iterations, scientific consultations, selected production artwork and exact requests, dated playtest deliverables and concise review outcomes remain together. The accepted v12 and earlier illustrated reference are unchanged. [Mission to Mars](../stories/mars/mars.md), its runtime artwork and [single active design brief](../stories/mars/design-brief.md) remain the live editing locations; the archive's historical commands and status statements describe their original versions.

### Cosmic study

[`2026.11.05 cosmic study/`](<2026.11.05 cosmic study/README.md>) preserves the entire abandoned project: **A Sea Beneath the Moon**, **The Lights That Remain**, supplied brainstorming, alternative narratives, research, manuscripts and briefs, runtime artwork, production sources, playtests and concise review outcomes. The user retired both versions on 6 November 2026 because the constructions did not feel worthwhile; the latest rewrite had not answered the problem. The [authoring cautionary tale](../docs/story-authoring.md#cautionary-tale-cosmic-and-cyberpunk) records the lesson. Earlier positive judgments retain their original scope and do not imply pending redevelopment. Historical playtest source paths/hashes remain unchanged; retained reports are not replayable sessions.

### Cyberpunk study

[`2026.11.05 cyberpunk study/`](<2026.11.05 cyberpunk study/README.md>) preserves the entire abandoned project: **No Fixed Address**, **The Travelling Harbour**, premise exploration, research, manuscripts and briefs, runtime artwork, both production families, playtests and concise review outcomes. The user retired both versions on 6 November 2026 because the many arbitrary game objects and insufficiently worthwhile fiction did not earn their attention. The [authoring cautionary tale](../docs/story-authoring.md#cautionary-tale-cosmic-and-cyberpunk) records the lesson. Earlier positive judgments retain their original scope and do not imply pending redevelopment. Historical playtest source paths/hashes remain unchanged; chapter-player assignments are not continuous whole-story trials.

### Creation study

[`2026.11.05 creation study/`](<2026.11.05 creation study/README.md>) is the single archive for Creation, beginning with its first completed study on 5 November. Its [supplied inspiration collection](<2026.11.05 creation study/inspiration/README.md>) contains all eleven original images, verified against the earlier checkout. The study index brings together the first edition, accepted revision, combined dated playtests and reviews, production masters and prompts, and subsequent night-sky, encyclopedia, glacier and catalogue-icon work. Distinct production passes remain dated within this folder; historical reports and source hashes describe their original versions. The [live manuscript](../stories/creation/creation.md) and [single active brief](../stories/creation/design-brief.md) remain authoritative, and unresolved work stays in the [backlog](../projects/backlog.md).

### Story catalogue icons

[`2026.11.06 story icons/`](<2026.11.06 story icons/README.md>) retains eight selected catalogue-icon masters, exact generation requests, necessary edit references, export paths and concise verification outcomes. The six published stories and the subsequently archived Cosmic and Harbour manuscripts retain their transparent 256px PNGs; export paths follow those locations. Creation uses a luminous mosaic following the user's art references and further sacred-art research; Settlement keeps its tree in front of the house, and Theology retains the book with an illuminated cross. The [UX contract](../docs/ux.md#catalogue-and-story-identity) owns baseline alignment and sizing; the [specification](../docs/story-format-spec.md#specification) owns square-image validation. Temporary verification output was discarded.

### App icon

[`2026.11.06 app icon/`](<2026.11.06 app icon/README.md>) retains the selected mosaic-sun master, exact generation request, export command and concise verification outcome. The root [icon.png](../icon.png) is the transparent 256px favicon shared by the catalogue and player; the [UX identity contract](../docs/ux.md#catalogue-and-story-identity) owns its current use.
