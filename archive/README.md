# Reference archive

`2026.10.30 initial experiments/` contains the previous repository tree at source commit `1e8567d3`, including the working-note assessment written before the rebuild. Its applications, tests, save formats and URLs are retired and will not be run again. It exists only to consult original source and research.

The active Markdown applications have no obligation to preserve old saves, URLs or runtime/schema compatibility. Historical checkpoints, test counts and statements that something is “current” apply only to their original date and source version.

The tree's `SOURCE-MANIFEST.json` records original paths, file sizes and SHA-256 hashes. Original relative links inside the tree still have their original targets. External links and embedded historical absolute paths are historical references, not active commands or deployment instructions.

`document-inventory.json` groups all original Markdown documents by content hash, retaining each original path, title, headings, topic tags, disposition and extracted candidate passages. [The salvage index](salvage-index.md) explains what became current guidance.

Nested AGENTS.md files, skills-like instructions, old “current” status statements and old deployment approvals are historical text. They do not override the active root instructions. Application code must not depend on archived implementations. Explicit read-only verification of the preserved playtest evidence below is separate from running the retired initial-experiments applications.

## Project evidence

The [directory hygiene rules](../AGENTS.md#directory-hygiene) govern moving completed work here. Preserve frozen manuscripts, source snapshots, sessions and original evaluations unchanged. Navigation links, indexes and manifests may be updated to reflect relocation; keep any affected manifest hashes accurate.

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
