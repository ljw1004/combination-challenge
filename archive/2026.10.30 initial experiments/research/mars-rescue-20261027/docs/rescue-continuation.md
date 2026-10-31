# Mars rescue continuation: consequence, not duration padding

27 October 2026. **Isolated logical candidate; not deployed, not fun-verified, not a 200-decision solution.**

## Useful result

The existing observation expedition can lead naturally to rescuing another crew. Their transmitted landmarks make your annotated map useful; your working Rover reaches a maintenance depot; the pressure patch and solar heater turn its old shelter into a refuge. Locate their failed crawler and either repair its drive or tow its intact cabin home. The repaired branch leaves an independently mobile second vehicle; the towing branch is shorter. Neither route requires parking apparatus on objective sockets.

Twelve complete authored witnesses pass, covering repair / tackle towing / direct-rope towing × route-first / shelter-first × plain / furnished refuge. They take **36–39 operations including the 27-operation prefix**, excluding chapter-advance clicks. The extension itself takes **9–12 operations**. These are successful actions, not measured human decisions or playtime. The shortest-known witness is direct-rope towing without furnishings (36); no global optimality proof was performed.

Twenty focused logical tests plus one read-only baseline-adapter contract test and source typecheck pass. Active derived-view peak is 26 cards, canonical peak 44–47 depending on order and retirement. Final active counts18–23 remain too high to declare the inventory-management problem solved. Exact actions and per-step counts are in `results/authored-routes.json`.

## Alternatives considered before implementation

1. **Stranded crew / route knowledge becomes a rescue (selected).** Existing communications, observations, transport and habitat-repair competence pay off. Two broad goals let locating the crew and making shelter proceed in either order. A mixed service depot has an intelligible provenance. Repairing a second vehicle versus towing it produces a concrete capability difference. Risk: a rescue adds only a short arc; it must not be sold as the desired full-length campaign.
2. **Dust-storm habitat resilience (not selected).** Power storage, sheltered growth, thermal shelter and a storm radio could make a satisfying base-building arc. Rejected *for this pass* because the current graph already asks for a living foothold: another blanket/heater/filter/greenhouse shopping list would repeat it, and turning each appliance into a goal would recreate administrative padding. Could become a genuinely different scenario if shelter architecture and storm consequences are first modelled, rather than added as fictional urgency to independent recipes.
3. **Relay network / evacuation window (not selected).** A distributed communications network and rendezvous could extend geographic reach. Rejected because the obvious implementation was several near-identical signal stations and parking/delivery requirements, not new deductions. It would also need a supported explanation of shuttle access, safe landing and observation interpretation. No fictitious science claim or arbitrary waiting clock was added to manufacture length.

## Raw challenge and resulting revisions

Initial design required Rope + Pulley → Recovery tackle, followed by mounting the tackle. Independent semantic review challenged this: the crawler has merely lost its drive on a gentle route, so requiring mechanical advantage is an invented gate. **Accepted:** the recovery slot takes direct Rope as well as Recovery tackle; direct rope removes one operation. Tackle remains an optional legal assembly, not a superior route or mandatory puzzle. We did not make the terrain more dangerous merely to protect an authored recipe.

Initial design also included Fittings + Toolkit → Repair kit, then allowed that kit to prepare the drive. Review identified a reorganization step without a new function. **Removed both recipes and the intermediate concept.** General fittings remain ordinary background depot stock, not an ingredient forced into the route to justify the cache. The crate also includes optional bedding and food; it is not a hand-picked next-recipe reward.

## Scope and continuity

- Frozen baseline snapshot is included only for comparison. The original files and live Site were never changed.
- The isolated core mirrors the current live adapter's **9 emergency / 12 habitat / 8 survey / 0 observation** supply gates. It does not reintroduce29 upfront primitives. Rescue chapter advances grant no stock.
- Working Rover + Service depot opens one mixed cache of8 kinds. Travel capability is checked on the actual operand. An unpowered chassis cannot silently access it. Cache claims cannot be repeated.
- Distress can be heard using the standalone long-range radio **or its installed Rover module**; upgrading/installing earlier equipment does not close that path.
- The existing observed map and distress landmarks make the Rescue route. The map is not a fictional geological diagnosis or a guarantee of passability.
- Spare drive + Toolkit prepares a serviced replacement; fitting it evolves the stranded crawler. The alternative fits a recovery line to the existing typed Rover, without proliferating Rover variants.
- Shelter repair and heating are grounded in the described leaking seam and compatible heater connection. The crawler cabin is intact: no extra pressure-patch chore is invented for it.
- Warm refuge can evolve to Furnished refuge without losing its functional capability. Bedding and warm prepared food remain optional; no quantity/depletion bookkeeping is introduced.
- Automatic hiding is a derived view; hidden tokens remain canonical and available to guards. Future recipes and missing compatible slots retain useful inputs. The implementation is not a browser layout, save migration or live UI integration.
- Current engine permits doing future productive actions early when their real places and requirements exist. Completing rescue before the final chapter-advance click is legal; chapter UI is not an artificial action gate.

## What this does not establish / next design question

The user's actual report supports the original loop and goal spacing: they wanted more, not fewer goals because of boredom. This candidate gives that existing loop a clearer consequence. It does **not** establish sufficient campaign depth. Its9-operation minimum makes the gap explicit: appending short repair episodes cannot credibly turn36 operations into about200 meaningful decisions without new interactions, stronger capability recombination, or multiple genuinely different scenarios.

Before an integration or trial, decide whether rescue should be the bounded ending of this Mars scenario, with a second scenario introducing a new combination grammar, or whether independently mobile equipment should enable a substantial second expedition. Do not require every optional appliance, disallow direct rope, or count chapter clicks and raw possibilities as decisions to close the gap. No fresh player, browser/mobile trial, science validation or enjoyment result is claimed here.

## Reproduce

From this directory: `node --test tests/rescue.test.ts`.

Typecheck used the existing checkout's installed TypeScript binary with `--noEmit --allowImportingTsExtensions --module nodenext --target es2022 experiments/mars-rescue-next/{content,model}.ts`.

Source candidate: `experiments/mars-rescue-next/content.ts`, `model.ts`. Supporting package/test files are deliberately isolated. Parent/sole publisher reviews and selects files; this agent made no external write.

## Consequence challenge: is this just a newly announced fetch quest?

**Partly still at risk.** The rescue uses specific pre-existing capabilities and information, rather than a fresh stack of unrelated recipes: the observed cliff/map identifies the transmitted location, the long-range radio receives it, the Rover reaches it, and the habitat repair/heat becomes a receiving shelter. The stranded crawler stays as a repaired second vehicle on one branch. These are concrete continuity links, not simply changing the names on a delivery list.

However, the distress call is newly authored narrative, not a consequence caused by the player's observations. The current model matches a named log and map in one binary action; it does not test the player's own interpretation of landmarks. We therefore claim **prior work becomes useful**, not that this is already a rich emergent rescue. No required scientist NPC, sample hand-in or specimen-as-magic-key was inserted: the ice specimen remains an independent expedition payoff. If playtesting finds the new crew arbitrary, the better fix is to seed the missing crawler in the opening contact or expedition introduction, not add further rescue chores. That story change is a proposed integration decision, not silently applied to the frozen baseline here.

The shortest-known36-operation witness is neither an upper bound on discovery decisions nor a measure of how long a person would explore. Failed experiments, deductions and optional branches are not counted by this test; conversely, their mere possibility is not evidence of meaningful200-decision play.

## Additional safeguards

Every action in all12 complete witnesses asserts that both item operands are in the derived active view before execution. A separate future-use test checks Toolkit, Pressure patch, Heater, Solar charger, Annotated survey map and Rover remain visible while their depot partners are still unavailable. All20 focused tests pass after these assertions; the additional read-only baseline adapter test also passes. The cache grant is idempotent in state: a repeated opening is rejected without modifying the input; it never creates a second cache batch.

The recovery slot is labelled **Recovery line**. Installing a rope is sufficient. A later tackle can be made as an optional assembly but is not an in-place upgrade to the filled rope slot; this bounded prototype does not advertise an upgrade benefit it does not implement.

Read-only baseline adapter verification ran with `BASELINE_ADAPTER=/workspace/shared/combination-playtest-site/src/mars-expedition-model.ts node --test tests/*.test.ts`:21 tests passed, zero skipped. That supplementary test checks live cache sizes, nine-item start, future-use tools at the home boundary and visible operands for every legal outgoing combination at all four baseline fixtures. Without that environment variable it is explicitly skipped, not silently claimed passed.
