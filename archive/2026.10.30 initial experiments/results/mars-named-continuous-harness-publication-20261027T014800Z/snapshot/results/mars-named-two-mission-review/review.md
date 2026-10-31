# Independent review: retained home → remote ice camp

Review of the candidate JSON and all four authored routes, 27 October 2026. This reviewer did not author the candidate and did not import its builder. `review.py` reconstructs board state independently from JSON actions. This is a mechanical/semantic design review, not fresh play, human enjoyment, or a browser pass.

## Mechanical result

All four whole routes pass independent replay:

| Route | Combines | Places | Total | Final current goals | Tokens / loose |
|---|---:|---:|---:|---:|---:|
| Ordinary | 56 | 27 | 83 | 20 | 102 / 78 |
| Optical-first | 56 | 27 | 83 | 20 | 102 / 79 |
| Intact salvage | 33 | 28 | 61 | 20 | 90 / 65 |
| Sparse simple tools | 48 | 28 | 76 | 20 | 94 / 71 |

Checks cover progressive base-only grants, actual target placement for context, revealed location operands, contextual precedence, global result uniqueness, A recoil, one occupant per slot, preserved ordinary inputs, only broken-radio retirement, every intermediate reported current/historical goal truth, and final token maps. All home current goals coexist with all remote current goals. None of the new objectives requires a second copy of a kind.

The optical route's earlier signal beacon really moves from the old *milestone* contact point to the camp approach. It is not cloned. The common survey map stays at home when the cliff photograph is dragged onto it, creating a portable annotated map. These are actual changed later uses rather than replayed opening constructions.

108 of 126 kinds appear as an operand, result or placement across these routes. Eighteen remain unused. An optimistic closure under all progressively supplied base kinds and places leaves ten unreachable kinds (listed in replay.json). This closure ignores sequencing/slot conflicts, so it is only a necessary-reachability screen, not a full proof for every alternative. The four actual route witnesses provide the stronger route-specific evidence.

## Semantic assessment

No blocking grammar violation found in the new bridges. Their interpretation must remain bounded:

- Camera + illuminated glovebox → imaging glovebox is a comprehensible specialized apparatus if the glovebox is visibly windowed and the camera looks through that window. It is not a magical scanner. A plain sealed opaque box would make the earlier glovebox recipe semantically underspecified; the description should clarify an ordinary windowed glovebox enclosure with glove ports.
- Ice sample + imaging glovebox → ice photograph is a photographic operation, not automatic chemical identification or proof of organisms. The retained image is an ordinary portable result. The camera being explicitly part of the apparatus is materially better than deriving a photograph from illumination alone.
- Ice sample + sample jar → sealed ice sample names an ordinary specimen jar with its sample. The cold-store placement gives its keeping purpose; no hidden clock, depletion, or temperature simulation is established.
- Field telescope + camera → telescope camera can mean an optical camera attached to a tripod-mounted telescope. The name is less familiar than telescope or camera alone, but is not an arbitrary bag. Retain its optical meaning and avoid implying a separate tripod is needed simultaneously.
- Telescope camera + distant lookout → cliff photograph is a defensible place-as-operand observation. The same mechanism already supports camera + overlook → panorama. It represents the act of observation, not automated reasoning about the cliff.
- Cliff photograph + survey map → annotated survey map is defensible as adding photograph annotations. It does **not** establish that a newly safe route has been surveyed, that the fissure is crossable, or that an unknown route is geometrically measured. The final task should remain a photographic field chart, as authored.

Air cleaner and ventilator correctly answer distinct purposes at different slots. A thermal blanket is not falsely accepted in place of a weather shelter. Sled versus wheeled home transport is motivated by the disclosed icy approach. The generous and sparse-simple controls remain valid; do not add artificial locks to invalidate them.

## Remaining risks and publication limits

1. **Board crowding is unresolved, not repaired by these traces.** A hundred persistent kinds and roughly seventy loose tokens demand a legible transition/organization design that preserves unique things. No unapproved generic cleanup retirement, invisible token hiding, or copies should be introduced as an expedient. UI remains frozen.
2. **Occupied camp is a fiction and placement objective, not demonstrated inhabitant behavior.** There is no actor, weather response, actual habitation, or simulated scientific interpretation. Do not publish claims stronger than establishing usable camp gear and returning photographs/specimen.
3. **Remote work is largely a fixed equipment chain.** Eleven later goals produce thirty additional operations in ordinary/simple/intact routes (twenty combines, ten placements); optical reuse reduces this to twenty-seven. The reuse is coherent, but no play demonstrates whether this feels purposeful or administratively repetitive.
4. **Duration remains materially below the requested destination.** 76–83 ordinary-initial-condition selected operations and 61 intact-salvage operations are lawful authored witnesses, not minima and not human decision totals. Adding alternative route lengths or unused catalogue rows cannot establish a 200-decision campaign.
5. **Progression descriptions are still terse.** The new images have concrete delivered purposes, but a future player assignment must disclose why the remote team wants them and make retained-home access understandable. Stronger narrative assertions must not silently add mechanics.

Recommendation: publish as a reviewed two-mission *design candidate* with these limits, not a finished game or validated fun result. Preserve the short controls. Before a player study, resolve the full campaign scope and token-access contract rather than running another tiny isolated ice-camp pilot.

## Per-objective load and obligation follow-up

The independent replay now records the start **after** that objective's supplies/locations/conditional reveals and the end after its actions. All four routes' 26 start/end records exactly match both their route `workspaceLoads` and `workspace-load-audit.json`: 208 load snapshots, each checking things, loose things, revealed places and occupied places. These are retained logical workspace counts, not measured viewport usability or cognitive load. Full independently reconstructed records are in `replay.json`.

The distinction between a persistent token and a persistent obligation matters. Home objectives presently retain ten current checks throughout mission two. A pressure patch at the airlock, long-range contact, a garden, useful irrigation equipment and a lit workbench have plausible continuing purposes even when the player leaves. Prepared transport, field water equipment, lifting equipment and the home navigation table can plausibly remain ready for later use, but that ongoing readiness is a chosen scenario contract—not a mechanically demonstrated need of the ice expedition. None is actually exercised by a remote actor.

The **warm meal is the weakest continuing home obligation**. Its current goal says leave food at the galley forever, but the ordinary interpretation is a completed meal-preparation/delivery episode. No eater, spoilage, replenishment or later home dinner exists. Keeping it current across mission two can feel like preserving a checkbox rather than supporting a continuing function. A future scope revision could honestly make preparing/serving the meal a historical milestone at the home ending, or explicitly describe a meal left for a returning resident. It must not invent food consumption or silently retire the unique food token.

Scenario boundaries can close earlier obligations without deleting kinds or pretending earlier placements still hold. However, that is a declared design change, not a correction to these passing traces. Current publication must report twenty simultaneous endpoints because that is what the present candidate checks. A later scenario-boundary version should explicitly name which current requirements conclude, retain their historical completion, and still preserve all unique accessible tokens. Reducing current-check burden alone will not reduce the hundred-token workspace.
