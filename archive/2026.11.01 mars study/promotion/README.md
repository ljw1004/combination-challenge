# Mission to Mars promotion

Completed 4 November 2026 at the user's request. The accepted 24-chapter v12 replaces the previous live Mars story in [stories/mars](../../../stories/mars/mars.md). Future story and runtime-art changes belong there. The user deferred archival because further artwork remains; the study stays active at `projects/mars-study`. The [live brief](../../../stories/mars/design-brief.md) carries the adopted survival, story, materials and visual direction; the requested [three-view reference](../../../stories/mars/design-exxamples.png) shows actual gameplay, with its [composition record](design-examples.md).

## Preservation and organization

- All **716 files** in [mars-v12](../mars-v12/) are byte-identical to the accepted directory before promotion. Its manuscript, brief, artwork and historical paths are unchanged.
- The canonical manuscript differs only in its obsolete author-status note. All player prose, game semantics and **200 referenced runtime bitmaps** are unchanged; the copied bitmap hashes match v12. Source-library exports stay in the study.
- The previous illustrated canonical directory is retained byte-for-byte as [illustrated-baseline](../illustrated-baseline/), **405 files**. Earlier study versions remain together with artwork sources, exact requests, registration and review outcomes.
- [promotion.json](../promotion.json) records manuscript and whole-directory hashes. Each directory digest hashes compact JSON of sorted `[relative POSIX path, file SHA-256]` pairs. This is integrity metadata, not a gameplay proof.
- Active navigation and project indexes identify the canonical story and the continuing study. Earlier production scripts and embedded paths retain their original context; adapt them deliberately before using them with the live copy.

## Verification and limits

`npm run check` passed. All **156 Playwright browser tests passed**, including revised canonical Mars opening, reload, independent lander stabilization and phone-target coverage. The unit run passed **264 of 265 tests**. Its only failure was the existing exhaustive fixed-item verification limit in the all-manuscripts lint/replay test. `npm run build` stops at that same lint error before bundling. The checker, its 20,000-state bound and the strict test remain unchanged. Mars otherwise reports four intentional mixed-fate warnings.

A read-only profile reached the bound in chapter 4: 6 Crash states, 32 Air states, 288 Water states and 19,674 Fire states. Ignoring hidden-token locations did not reduce the distinct states. Ignoring all locations would collapse distinctions used by fixed objects, previous boards and continuation; no sound shortcut was established. Further verifier work belongs in the [backlog](../../../projects/backlog.md#mars-follow-up-questions), not in a story-specific exemption.

The accepted [emergency revision record](../production/v12/emergency-revision/README.md) retains the earlier 80 branch continuations, complete 24-chapter actual-browser route, two gas-transfer orders, 200 decoded assets and final visual reviews. Copy integrity preserves the scope of those outcomes; promotion did not repeat that whole campaign. The new design sheet used legal checkpoints and actual pointer actions at 390 × 844 CSS pixels, followed by full-size and reduced-size inspection. Neither technical checks nor the reference sheet establish human enjoyment, unaided recognition, native touch behavior or a sized engineering mission.

Temporary promotion logs, profiles, captures and copied inputs were discarded after recording these outcomes. The shared engine and published build were not changed, and no hosted publication was performed.
