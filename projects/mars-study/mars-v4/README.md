# Mars v4 — A Place That Can Endure

A playable text-first candidate for steps 2 and 3 of the [story-design process](../../../docs/story-authoring.md#develop-a-story). A solo surveyor makes a locally supplied home, follows an ice layer to a long-dead tiny body, protects the garden and frozen samples through a dust-darkened interval, and prepares to return.

- [Play manuscript](mars.md)
- [Design brief and scientific boundaries](design-brief.md)
- [Project working notes: alternatives, criticism and revisions](../working-notes.md)

The Iteration #4 revision has **124 combinations on its complete legal route**, 125 authored recipes including an alternative ice-collection action, 163 item identities including 39 primitives, and 37 playable chapters plus the ending. Shelter, water and planting precede the scientific investigation; departure goes from the harvest to fuel, the cold sample and leaving Mars. This preserves the output of Iteration #4. Its complete evaluation is [Iteration #5’s initial campaign](../playtests/2026.11.02_23.23.33/report.md), which tested these exact manuscript bytes while the file was still named mars-v3. Later revisions live in separately numbered sibling directories. These counts describe structure, not measured human duration or enjoyment. There are two contextual two-item recipes. Most chapters have at most two hotspots; two chapters have three. No item artwork is required; the neutral background is deliberately plain.

## Preview and checks

From the repository root, use the shared authoring commands:

```sh
npm run lint -- projects/mars-study/mars-v4/mars.md --details
npm run analyze -- projects/mars-study/mars-v4/mars.md
npm run dev
```

Open `/combinations.html?story=projects/mars-study/mars-v4/mars.md` on the address printed by Vite. The story path resolves relative to `combinations.html`, and artwork resolves beside the manuscript. This draft has its own URL and browser saves, without a separate server or catalogue entry.

The [standard authoring workflow](../../../docs/story-authoring.md#check-and-preview-a-draft) covers lint, analysis and preview. The shared linter checks goal reachability and hotspot counts; the analyzer reports structure and a debugger completion route. Add `--json --details` to the analyzer for individual checkpoint arrival and peak board counts. General browser tests own dragging, layout and reload behavior.

Use [story authoring](../../../docs/story-authoring.md) for editorial criteria, [fun and evaluation](../../../docs/fun-and-evaluation.md) for independent reviews and blind readings, and the [canonical rubrics](../../../docs/fun-and-evaluation.md#player-and-grader-rubrics) for chapter playtests. The shared text adventure and AI harness load this external manuscript directly; their commands are documented in the evaluation guide.

This is a separate design candidate for user evaluation. It is not published, does not replace `stories/mars/mars.md`, and does not close the continuing Mars study.
