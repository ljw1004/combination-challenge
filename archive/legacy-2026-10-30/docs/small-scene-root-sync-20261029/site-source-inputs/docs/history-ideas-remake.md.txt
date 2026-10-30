# A Republic of Ideas — isolated intellectual-history remake

27 October 2026. Implemented source, not a claim of human enjoyment or a 200-decision game. Prior Estuary engine, UI and raw evidence are untouched.

## What changed

The player combines recognizable ideas themselves. No school routing, family machinery, task sidebar or recipe checklist. Rounded things and hollow locations follow the Mars grammar. Hover/selection reveals partners only; results appear after a combination. Surviving sources keep their position/placement, ideas are reusable, identical results are not duplicated, and a result appears near its target. Ordinary movement is reversible. Intro/purpose dialogs use short character invitations; restart is available inside them. Debug checkpoints replay real actions and retain their debug provenance on reload.

Three purposes:

1. The natural philosopher wants a way to test explanations. Scientific method can be reached through Hypothesis + Controlled experiment or Reason + Controlled experiment.
2. The librarian wants knowledge beyond scholarly walls. A Scientific journal or Encyclopedia satisfies the public-library purpose. Peer review is an optional longer route into the Encyclopedia, not a compulsory receipt.
3. Ilen wants a short pressure rendition of a tide. Discover Common pattern, Sensory translation and Temporal translation. Memory + Tidepool records five heights over ten minutes. Transformations preserve the heights/source while changing the channel or reducing duration to two minutes. They commute; Borrowed seasons is an optional fused practice. The listening-room goal checks the actual rendition, not merely the title of a badge.

The shortest authored fixture has **11 combinations, 2 placements and 2 chapter advances**. These are operations, not measured interesting decisions. There are alternative routes and optional discoveries, not an obligation to collect everything.

## Intellectual guardrails

Recipes are original playful abstractions, not assertions that two ideas caused a historical invention. They deliberately are not a universal march of historical progress. The memory transformation is speculative and finite, not a model of subjective experience. This distinction is visible in the About disclosure. The design inherits useful findings from `smac-tech-tree-research.md`, `future-ideas-independent-sketch.md` and `ideas-history-estuary-concept-discovery-proposal.md`: ideas should yield reusable effects; discovery is not compulsory adoption; short composed alternatives should remain valid. No historical attribution or new factual claim has been added.

Only two location roles are needed here: Tidepool is an operand; the library and listening room are reversible destinations. No arbitrary catalyst placement tax is added just to demonstrate a third role. Locations never accumulate ingredients.

## Verification and limits

- `node --test tests/history-ideas-model.test.ts`: 5 focused model tests, passed. Includes alternate inquiry/publication routes, all three transformation routes, source retention, duplicate rejection, unavailable locations and reversible goal placement.
- `npx tsc -p history-ideas.tsconfig.json`: passed.
- `npx vite build --config history-ideas.vite.config.ts`: passed.
- Independent model/controller audit: 14 tests passed. Combined reproducible `node --test tests/history-ideas*.test.ts`: **19 passed**. Raw independent evidence is preserved under `results/history-ideas-20261027/independent/`; repo-relative test copies only adapt import paths. This is not a fresh-play trial. Findings drove closer result placement, persisted debug provenance and one-shot creation animation fixes. Final whole-repository TypeScript and independent `npm run build` also passed.
- Native Playwright launch was attempted once and blocked before gameplay: Chromium `socket() failed: Operation not permitted (1)` in process singleton; crashpad also could not initialize. No launch retry or bypass. `experiments/history-ideas-browser-check.ts` is a prepared authored check, **not passed browser evidence**. No screenshots, real scrolling, native hit testing, touch-device or human-fun result is claimed.
- Pointer/touch handlers and edge-panning exist. Synthetic controller evidence cannot establish physical touch comfort or visual layout; native verification remains required.

## Isolated integration

Entry `history-ideas.html`; implementation `src/history-ideas-{model,main}.ts` and `src/history-ideas.css`; own Vite/TypeScript configs. The current published history route is not changed by this work. Integration/publishing belong to the coordinating agents, not this worker.
