# Reference archive

`2026.10.30 initial experiments/` contains the previous repository tree at source commit `1e8567d3`, including the working-note assessment written before the rebuild. Its applications, tests, save formats and URLs are retired and will not be run again. It exists only to consult original source and research.

The active Markdown applications have no obligation to preserve old saves, URLs or runtime/schema compatibility. Historical checkpoints, test counts and statements that something is “current” apply only to their original date and source version.

The tree's `SOURCE-MANIFEST.json` records original paths, file sizes and SHA-256 hashes. Original relative links inside the tree still have their original targets. External links and embedded historical absolute paths are historical references, not active commands or deployment instructions.

`document-inventory.json` groups all original Markdown documents by content hash, retaining each original path, title, headings, topic tags, disposition and extracted candidate passages. [The salvage index](salvage-index.md) explains what became current guidance.

Nested AGENTS.md files, skills-like instructions, old “current” status statements and old deployment approvals are historical text. They do not override the active root instructions. Application code must not depend on archived implementations. Explicit read-only verification of the preserved playtest evidence below is separate from running the retired initial-experiments applications.

## Project evidence

The [directory hygiene rules](../AGENTS.md#directory-hygiene) govern moving completed work here. Retain instructions and final outcomes under the [verification policy](../docs/engineering.md#verification-records); detailed verification inputs and outputs are temporary and must not be moved here. Older collections below include historical run bundles retained under an earlier policy. Preserve their historical context when consulting them; do not use them as the pattern for new work. Navigation links and indexes may be updated to reflect relocation.

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

### Cosmic study

[`2026.11.05 cosmic study/`](<2026.11.05 cosmic study/README.md>) preserves the supplied brainstorming, scientific research, successive fast and detailed playtest deliverables, concise editorial and artwork review outcomes, selected production masters, exact generation requests and export geometry. That baseline has 198 combinations, 245 circular icons and 16 backgrounds. Its [unreleased manuscript](../projects/cosmic-study/cosmic.md), single active [design brief](../projects/cosmic-study/design-brief.md) and runtime artwork have returned to the [active study](../projects/cosmic-study/README.md) because the story is not ready for release. Historical playtest source paths/hashes remain unchanged; retained reports are not replayable sessions. All artwork used the built-in image tool.

### Cyberpunk study

[`2026.11.05 cyberpunk study/`](<2026.11.05 cyberpunk study/README.md>) preserves the premise and technical research for **No Fixed Address**, six fast/detailed playtest campaigns, concise independent reviews, selected artwork sources, exact requests and export geometry. Its 219 combinations use 202 circular drawings and nine backgrounds. The [unreleased manuscript](../projects/cyberpunk-study/cyberpunk.md), single active [design brief](../projects/cyberpunk-study/design-brief.md) and runtime artwork have returned to the [active study](../projects/cyberpunk-study/README.md) because the story is not ready for release. Historical playtest source paths/hashes remain unchanged; the 216 chapter-player assignments are not continuous whole-story trials. All artwork used the built-in image tool.

### Creation study

[`2026.11.05 creation study/`](<2026.11.05 creation study/README.md>) preserves scientific and artistic research, five fast campaigns and a full detailed campaign, concise independent review outcomes, selected production masters, exact requests and export geometry. That first edition of [Creation](../stories/creation/creation.md) had 202 combinations, 206 circular illustrations, twelve larger fixed-context exports and 22 backgrounds. Its [single active brief](../stories/creation/design-brief.md) and runtime artwork live beside the manuscript. The 282 chapter-player assignments include three deliberately stopped opening records and three actionless ending assignments; they are not continuous human playthroughs. Historical report paths/hashes remain unchanged. All artwork used the built-in image tool.

### Creation revision

[`2026.11.05 creation revision/`](<2026.11.05 creation revision/README.md>) preserves the subsequent revision accepted after human play and artwork feedback. The promoted [Creation](../stories/creation/creation.md) has 187 combinations, 26 chapters, 182 circular artworks and 22 backgrounds. The archive retains the supplied inspiration, selected art masters and prompts, deterministic export geometry, research, concise reviews, and requested fast/detailed reports and player responses. Its [promotion record](<2026.11.05 creation revision/promotion.md>) records exact-copy verification, size and release checks. The [live design brief](../stories/creation/design-brief.md) remains authoritative; former source paths and evidence hashes inside the archive remain historical. Unresolved work stays in the [backlog](../projects/backlog.md).
