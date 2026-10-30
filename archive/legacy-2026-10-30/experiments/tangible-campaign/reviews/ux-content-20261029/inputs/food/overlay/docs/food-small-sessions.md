# Food: smaller working sessions

The 29 October playtest showed the Orchard farm kitchen with fifteen movable things and five large hotspots on arrival. The actual canonical route reached thirty-one movable things there. The ten-room predecessor was not a small-scene rollback: its busiest room reached thirty-two things. The preserved twenty-chapter v3 was smaller on arrival, but its dairy still reached nineteen things, so restoring its boundaries alone would not solve the problem.

`kitchen-caravan-small-sessions-v8` is a separate save identity. All older files and identities remain unchanged. It keeps all 231 item identities, all 192 current recipes (including the three later supported alternatives), every source reading and the real train supper ending.

## Work areas, not hidden stock

Thirty-five bounded work sessions replace ten overloaded rooms. They follow real divisions of cooking work: dairy table and bakehouse; straining table and cider workbench; soup stove and roasting oven; pasta preparation and cooking; pastry preparation and baking; custard cooking and pudding baking; cake baking and finishing; and the final serving hatch. Explicit later shifts at the fruit ovens, fair cake ovens and station baking bench explain time and a clear workspace. They keep earlier panels intact.

Every station's assigned ordinary ingredients and equipment are present on entry. Shared caravan staples keep their original identity and source: they travel when useful, rather than being re-granted as fresh stock. All 49 primitive sources have exactly one owner. No chapter cache, source-update drip, retrospective removal or shared-runtime edit is used.

The cold salad counter no longer also handles baking: the inn oven prepares its croutons alongside roast roots, and the later counter uses those actual preparations. Cucumber yogurt is made naturally beside the dairy's herb spread. There is no artificial task added merely to hide inventory.

## Measured working sets

Six full current-engine routes cover required work, alternative recipes, the optional catalogue, reversed drops and two independent preparation orders. Across them:

- arrivals have at most **9 movable things**;
- peak working sets are at most **11**;
- **33 of 35 sessions peak at 10 or fewer**;
- pasta preparation and the almond counter reach 11;
- each panel has **0–2 hotspots**.

The formerly overloaded Orchard becomes dairy breakfast (5 → 8 things, 1 hotspot), bread baking (3 → 5, 2), yogurt sides (5 → 8, 0), cider dressing (5 → 8, 1), and the warm harvest lunch (6 → 10, 2). Counts are logical object populations, not evidence of enjoyment.

The approved `weighted-third` layout opt-in was tested separately against the layout worker's exact runtime. All 210 arrivals across those six routes put the movable area-weighted centre at 844/3, with no clipping and no newly introduced overlap pair. Existing carried overlaps remain possible. The runtime itself is not part of this Food delta. Existing kitchen art is reused; no new art was generated.

## Input lifetimes and continuity

Forty-four specifically listed prepared inputs now explicitly transform at the actual recipe event—for example, risen dough becomes bread and custard becomes vanilla custard. The engine's existing independent-future-use safeguard still preserves a usable outside portion when needed. This is not a terminal-item sweep: unused foods and tools remain exactly where the player left them, and changing chapters cannot remove them.

The source exports `foodSmallSessionMapping`, including every new chapter's predecessor chapter, assigned recipe IDs, unique source owners, old-to-new hotspot identity mapping and all changed lifecycle inputs. Binary operands, results, required capabilities and every other lifecycle declaration are unchanged after hotspot normalization.

An early-preparation witness deliberately retrieves butter from an already visited panel and makes herb butter early. At lunch, the prepared butter travels while the unnecessary raw butter and herbs stay at the old table. The full journey still completes. Undo and saves preserve both ownership and positions.

The final trolley remains beside the counter-height service hatch. The crew hand food and provisions through; the text no longer claims that a full-height trolley fits through a countertop opening.

## Verification and limits

- Focused Food suite: 10/10 passes against the approved combined layout runtime.
- Six complete routes collectively exercise all 192 recipes.
- All 36 canonical checkpoints restore; normal partner highlights, reversed drops, bounds, Undo and durable save encoding are checked.
- Every earlier resident and hotspot retains its coordinates when not carried; every travel keeps all existing object identities.
- All sixteen missing-course/loading subsets establish that the final hatch goal needs meal, dessert, juice and sealed provisions.
- Source, lifecycle, objective-flow, construction-continuity and lifecycle-graph validation pass; TypeScript and the worker build pass.
- The worker's unregistered tangible aggregate was deliberately interrupted (exit 130) at the parent's request. It is **not a pass**. The parent owns the required aggregate against the final registered release.

These are source-aware logical and geometry checks. They are not native touch, independent human comprehension or enjoyment evidence. The user’s private screenshot was inspected as reference only and is not included in source, assets or evidence files.
