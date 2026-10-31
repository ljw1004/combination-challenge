# Mars Objects 1: familiar materials, two useful roles

26 October 2026. Independent bounded logical model. No UI or real Mars survival simulation. Model tests and privileged witness runs are **not player evidence**.

## Useful mechanical result

The same familiar covering changes what an enclosure does. A clear shell encloses the designated tray and admits daylight. Adding a reflective cover to that **existing** shell keeps the enclosure but removes the tray's daylight and redirects sunlight to the northern observer. A real lamp connected to its own exposed exterior solar panel restores interior light. Covering that panel actually stops its lamp; naming a blueprint “lit” cannot override a shaded source.

This is a small functional distinction, not demonstrated strategic depth. A universal solar-lit clear enclosure works on both boards, and complete-catalogue players can place it in **one** combine. That valid easy answer is preserved rather than prohibited. Whether choosing and enacting these uses feels satisfying, obvious, or merely like selecting a labeled answer remains an experience question.

## Exact screen

Run `node experiments/logical-mars-objects.ts`. It writes `results/mars-objects-preplay/mechanical-screen.json` with every action, full state, physical world, first success and exact replay result.

| Construction, ordinary catalogue | Combines | Garden | Signal |
| --- | ---: | --- | --- |
| Clear shell at camp | 2 | Enclosed and sunlit | No northward light |
| Reflective shell at camp | 2 | Enclosed but dark | Receives reflected sunlight |
| Reflective shell with actual powered lamp | 5 | Enclosed and lamp-lit | Receives reflected sunlight |
| Bare solar lamp at camp | 3 | Lit but unenclosed | Receives lamp light |
| Lit clear shell, identical prefab | 5 | Works | Works |
| Establish and install every composite | 12 | Works; first success at 7 | Works; first success at 8 |

The screen checks 14 goal/construction traces and 342 legal-action previews. The build-everything garden temporarily loses its success when its second, reflective shell blocks sunlight, then recovers when an actual powered lamp is installed. Report the whole trace, not only its final win or a selectively chosen failure. The repurposing witness has six combines and garden success at combine 2, loss at 3, and restored success at 6.

The observer permanently retains acquired camp-location knowledge. Source cuts can stop **current reception** without erasing that knowledge. Installing a lead, shading it, then attaching its lamp proves that the same named lamp concept cannot acquire the location without an actual optical event. The receiver policy runs identically on the garden board, not only when signaling is the assigned goal.

Thirteen focused tests cover those causal witnesses, genuine alternatives, unlimited independent copies, source-specific cuts, transmission/opaque layering, all exposed previews on witness prefixes, operand symmetry, malformed input, immutable transitions, full-catalogue/ordinary equivalence and exact replay. At the implementation checkpoint the complete repository suite passed **227 tests**, and TypeScript passed. The independent review and final source freeze are recorded separately; no blind plays were started by the model author.

## Scope and interface

`experiments/logical-mars-objects.ts` exports:
- `MARS_OBJECTS_VERSION = 'mars-objects-1'`, scenario IDs `garden` / `signal`, and the full six-recipe catalogue.
- `createMarsObjects(id, { catalogue?: 'ordinary' | 'complete', known?: Concept[] })`.
- `observeMarsObjects(state)`: all concepts, recipes, public laws, components, optical/power state, legal actions and exact previews.
- `stepMarsObjects(state, unknownAction)`: pure, validated transition. All game actions are `{ type: 'combine', a, b }`, operands unordered.
- `previewMarsObjects`, `legalMarsObjectsActions`, `marsObjectsWorld`, `replayMarsObjects`, `runMarsObjectsScreen`.

Concept combinations establish reusable structural blueprints. Installations make fresh component instances; they do **not** transfer identity from earlier installations. Existing-source and existing-shell operations do target those actual instances. A lit shell retains its panel/cable/lamp structure, not a success flag. There are six base concepts and six composites; no spatial solver, simulation framework, ingredient quantities, time quotas or secret combinations.

The isolated parent-owned adapter is `experiments/mars-objects-play.ts`; it does not modify the historical game registry or evaluator. [The prospective protocol](mars-objects-play-protocol.md) fixes public laws, witness challenges and later ordinary-versus-complete-catalogue conditions. Preserve all frozen sources and captures once exposed. Neither this slice nor its easy solutions justify expanding the ontology before player evidence.
