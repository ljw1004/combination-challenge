# Mars named things: shared content/model contract

27 October 2026 UTC. Implements the owner's latest human-playtest direction; **not an extension of the previous physical network/assembly research**. Old engines, evidence and saves remain separate. Content owner: campaign researcher (`src/mars-named-content.ts`, this document). Model/UI owner: full-Mars builder (`src/mars-named-*` except content, tests/config). Independent review: full-Mars playability reviewer.

## Atomic named things and novelty

- Every non-location item is one ordinary rounded rectangle. No “actual object,” “design,” infinite-copy button, ingredient inventory or generic assembly bag.
- There is one global board token per concept kind. An accepted A+B or A+place creates C only if **no C exists anywhere on the board**, including a placement slot or another retained level. A slotted/hidden item is not permission to duplicate it.
- A and B normally remain. An explicitly authored, conservatively audited evolved successor may retire its obsolete input only when that input is never needed again. Current exception: broken radio+cable→radio removes **broken radio only**, not cable. No generic dead-end or material-consumption rule applies. The surviving dragged A is moved back away from its partner by the UI, and a genuinely new C appears nearby as a loose portable thing. No automatic compound of more than two operands.
- No new kind is invented for an unlisted pair. Every authored output is recognizable and named: solar radio, seed tray, pressure patch, greenhouse, lit workbench—not “frame+cover+seeds.”
- Moving C away does not erase its existence. Repeating the recipe cannot make another C. A same-token drop is an explicit no-op/rejection, never deletion or an accidental new thing.
- Hover highlights the source and compatible items/locations **only when their result would be new**. Do not display the output name as a hover preview. This is the latest human-requested presentation, not the older result-name-preview policy.

## Exactly three location roles

1. **Target-derived catalyst context:** when A is combined onto B, B’s actual placement determines P. A need not already be parked there. A declared/replayed `at` is only an assertion matching B’s actual location, never a free override. Context never acquires or combines accumulated contents. Exact contextual recipe takes precedence over an ordinary recipe for the same pair; otherwise an existing ordinary recipe may still apply. A context-only recipe fails without its required target placement. One loose object dropped onto an explicitly placed partner is still binary A+B, not automatic place accumulation.
2. **Binary location operand:** A+P creates a named portable result. Example: heater+glacier→meltwater. The original heater remains movable; the meltwater is loose, not tied to the glacier. This is distinct from placement.
3. **Movable goal placement:** placing a thing in a location merely moves that one token and tests its own named goal eligibility. It cannot combine with previous occupants or inherit their properties.

The UI's one visible slot per place is an explicit interaction simplification, not a crafting bag: moving B into A's slot returns A visibly to the loose playspace, preserving its token and kind. Moving a placed item back out is always legal. Moving to the same slot is an explicit no-op. Current goal truth is recalculated after every move; any retained progress/level-unlock history must be labeled separately and must not masquerade as a currently present item.

Accepted synthesis returns the dragged/first-selected A to loose space (clearing any prior placement), retains B at its prior position, and creates loose C. Thus dragging a placed A away can remove current goal satisfaction; the model must not silently keep A sticky. Catalytic synthesis never parks ingredients/result at the catalyst. Location-operand synthesis similarly returns A loose and does not slot its result. Drag and click paths must use the same engine semantics. When a drop could mean a recipe rather than placement, its affordance/action must be unambiguous; ordinary explicit placement remains available without accidentally transmuting the item.

## Content and progression

`src/mars-named-content.ts` exports:

- `NAMED_CONCEPTS`: `{id,label,description}`.
- `NAMED_RECIPES`: `{id,a,b,result,at?,description,retire?,retirementReason?}`; a location operand uses `b:'place:ID'`.
- `NAMED_LOCATIONS`: `{id,label,x,y,description}`.
- `NAMED_GOALS`: `{id,title,requirement,kind:'discover'|'place',concept,location?,requiredLocations,supplies}`.
- `NAMED_LEVELS`: `{id,label,intro,supplies,locations,goals}`.
- `NAMED_WITNESS`: symbolic select/combine/place actions; concept references resolve to the unique actual board token.

Five finite stages make a coherent available game, not artificial parity with an earlier concept/checkpoint total:

1. **Be found:** begin with just broken radio+cable and no locations. Reconnecting the lead makes a radio. The next objective introduces panel+battery and the contact ridge; make a solar charger/radio and place it there.
2. **Water and growth:** heater+glacier produces portable water; filter and canister make a useful supply; use the warm habitat as a genuine germination context, then protect the tray.
3. **Reach farther:** reuse charger/radio ideas for a solar rover and long-range link.
4. **Make a home:** the bench's clamping tools help make a portable pressure patch; reuse the propagator/frame for a greenhouse.
5. **A working base:** reuse the charger for a lamp and a lit workbench.

The ordinary and contextual seed-tray recipes intentionally differ: water canister+seed tray normally gives a watered seed tray, while the warm habitat context gives a sprouted tray. Watered tray+warm habitat is also a binary location recipe yielding the same portable sprouted tray. Global result deduplication applies across both routes.

No task needs simultaneous duplicate kinds. The eight placement targets are eight different named things. Later recipes retain their reused operands, so the unique charger, frame or earlier radio is sufficient. The witness deliberately drags the loose seed tray onto the placed water canister for an ordinary watered tray, then combines that portable tray with the warm-habitat location. It does not inject warm context while B remains at the water store. It drags the loose dish onto the earlier placed solar radio, preserving B without falsely keeping a dragged A attached. For the pressure patch, the witness first places sealant at the repair bench and then combines fabric onto that actual target. Reversing a gesture is also legal but may require returning the moved thing afterward. A supplied previously made kind refers to that existing token; it must never generate a copy. It must remain visibly accessible/bringable for reuse even when previously slotted or on an earlier stage. New stage supplies introduce appropriate base things, not unknown finished recipe outputs. Debug checkpoints must replay the actual witness, not assign success flags or grant unknown outputs.

Each objective explicitly declares `supplies` and `requiredLocations` for its catalyst/operand/placement needs. Introduce its things and reveal those places only when that objective is introduced; level-level supply/location lists are supersets, not arrival grants; previously encountered locations may persist, but do not reveal all `level.locations` at arrival. Debug checkpoints reveal only the actually encountered/current prefix. Location coordinates are globally unique and stable; the view must support the larger persistent board rather than overlap prior sites or silently relocate them.

Normal progression may unlock stages from completed milestones, but moving an item must update current truth. The model must state whether a past level's completion is a historical unlock or current satisfaction. Do not lock a token in place merely to protect a green checkmark. Stage filtering must not hide the sole required token with no way to retrieve it.

## Tests and interpretation

Before delivery, mechanically verify every authored recipe/context, base-vs-context branch, A+place portability, no generic merge, duplicate-result rejection across loose/slotted/retained locations, one-slot displacement, free removal, same-slot no-op, input preservation, global kind uniqueness, source/partner-only novelty hover and click/drop equivalence. Replay the whole symbolic route without a global catalogue, copy command or debug-only token identity assumption.

The supplied witness contains19 named combines and9 placements (plus5 stage selections); those are authored interaction counts, not a fresh play, optimality result or duration target. Optional named alternatives remain available. This new human-directed logic experiment does not inherit the old physical campaign's count, fun report or laws. No claim of approximately200 decisions is made.

## Narrow evolved-input retirement update

Explicit `retire` metadata applies only to actual input kinds of that successful recipe. It is not inferred from graph degree, age, lack of further recipes or the fact that a result combines two things. Fire+water→steam would preserve both unless a separately justified evolution rule existed; merely having no later use would not justify retirement. Existing knowledge/history remains; ordinary ingredients do not become stocks. The current authored exception is `repair-radio` retiring `broken-radio` only. Content tests verify no other recipe, goal or later objective supply requires that kind.

Runtime/model owner handles stock suppression after that authored successor exists and preserves old saves without proactively deleting old instances. There is no broad save migration or bulk cleanup. Other possible container/vehicle/bench evolutions remain unapproved in this narrow hotfix; future branches and goals must be audited first.
