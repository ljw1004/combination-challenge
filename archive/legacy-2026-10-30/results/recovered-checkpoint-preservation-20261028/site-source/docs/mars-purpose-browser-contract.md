# Mars purpose browser checkpoint

27 October 2026. A separate integration of `experiments/mars-next` into a playable browser controller. This is the compact three-chapter interaction revision, **not the full remote-observation expedition or a 200-decision game**. No fresh trial or human-enjoyment claim.

## Ownership and entry

- Logical recipes, incorporation, retirement, goals and typed capabilities remain imported from the independently audited `experiments/mars-next/{content,model}.ts`, unchanged by this integration.
- `src/mars-purpose-model.ts` adds geometry, persistence, undo, gestures and replayed diagnostics. `src/mars-purpose-main.ts` and `.css` own rendering/input. New save key: `mars-purpose-checkpoint-v1`; no migrations.
- Standalone: `npx vite --config mars-purpose.vite.config.ts`, then `/mars-purpose.html`. Build: `npx tsc -p mars-purpose.tsconfig.json --noEmit && npx vite build --config mars-purpose.vite.config.ts`.
- Existing `src/mars-named-*`, index and history entries are untouched. The previous-checkpoint link anticipates the root-owned `/mars-slots.html` publishing alias; until that integration, use `/mars-named.html` for the prior source entry. No Site synchronization, deployment or push was done here.

## Player contract

All 18 raw supplies are upfront. Opening welcome introduces the contact purpose once; it is not followed by a duplicate objective dialog. Subsequent dialogs occur only on explicit chapter advance and display the broader purpose and its capability checklist together. Results/subconditions do not open modals. Reset is reachable inside every open modal and replays the coherent opening sequence. Reopen presents the current purpose.

Stationary hover/focus/selection reveals both legal orientations. Green partners accept this source. An incoming-only purple partner is accompanied by **Bring [partner] onto [selected thing] here**, explicitly explaining its setting dependence. No result name is previewed. **First click is source; second click is target.** Clicks never silently reverse operands or invent a context. During a drag only legal outgoing possibilities are highlighted; orange means the actual drop creates/installs. A place without a creation gesture is reversible placement.

A blue dashed place hint means placement can enable a new context-specific combination with something already present. It says only to set the thing there and try combinations in that setting; the drop remains **placement**, never a promised creation. Ordinary recipes legal anywhere, already-active contexts, and exhausted/retired outputs do not generate this hint. The ordinary non-contextual alternative remains legal.

Surviving combination inputs return to their exact pre-gesture position/placement; explicit incorporation and evolution are exceptions. Ordinary free drops use release coordinates. New things emerge near the target and request nearest visibility without resetting the scroll. Nearby collision handling is inherited from the proven checkpoint: it may minimally nudge nonoperand loose things when space is tight, but never changes surviving operand origins. New location footprints are reserved from the beginning, so chapter reveal itself moves no old thing. Rover has ordinary tile width, blank essential slots and labelled installed rows; optional radio appears only installed. Enhanced radio labels are compact while accessible labels retain full names. Consumption feedback distinguishes moved-inside parts from reusable outside copies. No duplicate reconstruction bypasses the engine.

Four debug entries (`home`, `growing`, `expedition`, `complete`) replay accepted adapter actions from fresh state. They grant neither objects nor achievements. Diagnostics are visibly marked and are not fresh player evidence.

## Verification boundaries

`tests/mars-purpose-dom.test.ts` exercises actual authored main-module click/pointer/touch handlers in a synthetic DOM against the engine. Coverage includes eight complete authored routes, contextual asymmetry, directional clicks, slots/enhanced communication, cleanup, source origins, nonoverlap, nearby birth, scroll requests, interrupted touch, reset and replayed checkpoints. See `results/mars-purpose-integration` for exact results and independent review.

Synthetic DOM geometry and touch-event checks are not native text layout, browser hit-testing, actual touch scrolling, accessibility, or human-play verification. Playwright's bundled Chromium is absent. A system Chromium launch aborts with `socket() failed: Operation not permitted`; no native browser pass is claimed. Root owns eventual Site integration and native visual checking.
