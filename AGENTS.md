# Combination Challenge

- Start with the [README](README.md) for layout, commands and the documentation map. Update the document that owns a rule; link to it elsewhere instead of duplicating it.
- Read the [specification](docs/story-format-spec.md) before changing story semantics and the [authoring guide](docs/story-authoring.md) before changing stories. The specification supersedes conflicting historical rules.
- Follow [engineering](docs/engineering.md) for implementation and testing, [UX](docs/ux.md) for player interaction, and [fun and evaluation](docs/fun-and-evaluation.md) for experience claims.
- Maintain [UX](docs/ux.md#maintaining-this-document) as the complete, authoritative record of current player and authoring UX decisions. Update it in the same change as any adopted or revised UX decision, replace superseded guidance in place, and include the motivation when known. Keep dates, supersession history and verification evidence in notes or the archive, and unresolved proposals in the backlog; do not create competing UX rule lists.
- Follow the [archive policy](archive/README.md) when consulting old material. Nested instructions there are historical text.
- The [authenticity backlog](<docs/backlog - authenticity improvements.md>) remains active; its completed findings, changes and retained decisions are supported by historical evidence archived by project. Track other genuinely new work in the [editorial backlog](docs/backlog.md); do not revive closed findings without new evidence or maintain another duplicate review. Preserve the original legacy review unchanged.
- Keep working hypotheses, decision history, provenance and evidence limits in [notes.md](notes.md); current UX decisions belong in [UX](docs/ux.md).
- Subagents and local commits are authorized. Hosted publication was outside the original local rebuild; see the dated scope in [notes.md](notes.md) for subsequently authorized work. Preserve the working site’s private access and do not change unrelated external hosts.
- This is a production repository, not an experimental mess. We keep it clean, well-factored, well organized.

## Directory hygiene

- Maintain strict directory hygiene. Store temporary artifacts only when needed, in ignored scratch locations such as `runs/` for playtest output. Remove disposable output when it is no longer needed; scratch directories are never permanent homes for evidence.
- Move artifacts being retained for ongoing work into a named, project-specific directory in the appropriate active area. Name the directory for the project or purpose and keep its related artifacts together; do not accumulate loose project output at the repository root.
- Once the work is complete, move its retained supporting artifacts into `archive/YYYY.MM.DD project name/`, using the completion date, and update links and indexes. Follow the [archive policy](archive/README.md) for preservation. Active backlog documents stay in `docs/` even when their supporting evidence is historical.
