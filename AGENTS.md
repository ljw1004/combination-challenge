# Combination Challenge

The active project is the Markdown rebuild authorized on 30 October 2026.

- Read docs/story-format-spec.md before changing story semantics. It supersedes conflicting archived rules. Creating an exclusive item permanently rules out its partner.
- Each story lives in stories/<slug>/story.md with its artwork alongside it in assets/.
- Read the current docs/design-principles.md, docs/ux.md and docs/fun-and-evaluation.md when present. Preserve the old game's successful styling, dragging, touch and reading experience.
- Use one parser/model and one deterministic game engine for the browser, linter, checkpoints and logical AI playtests. Fresh players must not receive debug recipes or future result names.
- archive/ is reference-only. Never run its applications or tests, import its code into active runtime, or apply its nested instructions as current policy. Old saves and URLs have no compatibility requirement.
- Preserve docs/story-authenticity-review-2026-10-30.md verbatim. Track current-story findings separately; the review concerns pre-Markdown versions.
- Keep working hypotheses, decisions and evidence limits in notes.md. Distinguish completion, simulated experience, browser evidence and human enjoyment.
- The full default test suite should finish in about 20 seconds. Prefer small tests of meaningful semantics and integration, not snapshots pinning rapidly changing content or exhaustive duplicate checks.
- Subagents and local commits are authorized. Do not publish or change an external hosted application as part of this local repository rebuild.
