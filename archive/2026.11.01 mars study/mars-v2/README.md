# Mars v2 — preserved experiment

The user rejected this version on 2 November 2026 and asked to retain it beside the illustrated story for rethinking. The manuscript is preserved unchanged from the replaced push `e99a6228`; its [design brief](design-brief.md) describes that experiment, not accepted requirements for the next version. The parent [story-design guidance](../README.md#story-direction) owns the user's current direction.

[Outcomes](outcomes.md) retain the director/redraft loop, blind reads, player-only trials and evidence limits. [Assignments](review-instructions.md) and executable checks remain available. Detailed review and run output was discarded after the original pass.

## Preview beside the illustrated version

From the repository root, run the usual `npm run dev` for the illustrated story on port 5173, and in a separate terminal:

```sh
npx vite --config projects/mars-study/mars-v2/vite.config.ts
```

Open `http://127.0.0.1:5174/combinations.html?story=mars.md` for v2. This isolated local preview uses the shared current game engine and its own catalogue. It has a separate save/draft origin and does not replace the main manuscript or alter the production build. Its two background files are unchanged copies of the existing assets.

The following records the original experiment's intent and hypothesis, which remain subject to the user's negative evaluation.

## Intended experience

A solo surface surveyor discovers the preserved remains of a small, long-dead organism inside an ice core. The discovery changes the meaning of a coherent scientific expedition. Direct investigation, useful construction and a modest living crop should give the player curiosity, capability and a reason to bring the specimen home. Nothing revives; the organism is neither a companion nor a toy. No crewmate rescue or photography progression remains.

Keep a few recurring locations, complete mission equipment and meaningful reuse. New supplies should arrive in occasional coherent kits, with chapters that work entirely with familiar things. An accident is optional and must follow from an established situation; a chain of new failures is not a substitute for narrative drive. Avoid paper/report tokens, miniature fitting chains, arbitrary gates, repeated repairs and physically dubious object combinations. The [authoring guide](../../../docs/story-authoring.md), [format specification](../../../docs/story-format-spec.md) and [evaluation method](../../../docs/fun-and-evaluation.md) govern the work.

## Evaluation hypothesis

Players should understand why the next operation matters, make useful predictions from familiar equipment, and want to continue because the investigation changes their understanding. They should recognize a causal expedition rather than a sequence of unrelated supply caches. This is falsified by repeated fresh-reader expectations of administrative delay, unexplained goals, combinations that require author-only premises, or play reports that describe the scientific payoff as too small for its assembly burden. Counts and successful completion alone cannot establish enjoyment.

Use several director/redraft rounds and separate fresh, sequential blind reads. Review physical combinations forwards for contribution, continuity and authenticity. Freeze playable versions for player-only trials, evaluate actual action records, test counterexplanations and revise concrete failures. Check arrival and peak working sets in the browser. Detailed drafts supplied to reviewers, individual answers, checkpoints, captures and logs stay in ignored `runs/mars-rewrite/`; retain concise instructions, decisions and outcomes here.

The user authorized the original commit and push, then requested replacement of that push while preserving this version. This record does not authorize unrelated hosting or access changes.
