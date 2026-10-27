# Working home → remote ice camp: complete retained-world design candidate

27 October 2026. **Paper design and authored-route verification, not a game implementation, fresh player, or evidence of fun or 200 decisions.** The deployed named-Mars UI and its 42 things are unchanged. The earlier 76-recipe first-sequence artifact remains intact.

## What is now complete

`results/mars-named-two-mission-candidate/` contains an 82-recipe, 126-kind ontology and 26 ordered objectives across two missions. All four witnesses actually traverse both missions on one retained board. No fresh starting inventory is substituted at the mission boundary. The home’s ten current endpoints remain true alongside ten new camp endpoints. Six objectives are disclosed historical milestones; their current truth can regress without changing history.

The first mission remains contact, water, growth, habitat repair, mobility, survey, workshop, cultivation, food and long-range contact. The second moves to a useful different purpose: **outfit a remote scientific camp and bring back inspectable observations**. “Occupied camp” is motivation, not a claim to simulate inhabitants, breathing, heat budgets or survival. Existing rooms, a sheltered resting berth and cold sample storage are disclosed facilities, not things secretly built by a two-input recipe.

| Remote task | Recognizable outcome | Changed use of retained things |
|---|---|---|
| Icy freight approach | Sled | Frame accepts skis; earlier cart still serves the firm home route |
| Camp weather shelter | Insulated tent | Habitat fabric and frame become a shelter rather than a patch |
| Sheltered rest | Thermal blanket | Foil contributes to personal insulation, not a substitute for the tent |
| Workroom dust | Air cleaner | Fan plus filter; ventilation alone does not claim to filter dust |
| Air exchange | Ventilator | The same fan knowledge serves a separate duct opening |
| Contained imaging | Imaging glovebox | Gloves, a sealed windowed box with glove ports, lamp and actual camera have a coherent apparatus purpose |
| Close observation | Ice photograph | Scoop plus glacier produces the portable sample; sample plus imaging glovebox produces a picture |
| Specimen return | Sealed ice sample | The same sample plus sample jar produces a stored specimen, not a second sample of the same kind |
| Distant observation | Cliff photograph | Telescope, tripod and camera make a telescope camera; camera plus distant lookout makes a portable picture |
| Useful return | Annotated survey map | Cliff photograph contributes an annotation to the retained survey map |
| Way home | Signal beacon | Optical-first players reuse their existing beacon; radio-first players construct one for a different purpose |

The photography bridges are deliberately modest. Neither image magically proves a mineral identity, water purity or extraterrestrial life. `ice-sample + imaging-glovebox → ice-photograph` represents the conventional act of positioning the sample and taking a picture in the already lit, camera-equipped enclosure. `field-telescope + camera → telescope-camera` represents camera attachment to the supported telescope; no camera-free sketch is conjured. `cliff-photograph + survey-map → annotated-survey-map` is a photographic annotation, not an automatic passability guarantee or inferred geological finding.

The photographic finding is the reward itself and remains inspectable as a named portable thing. The present design does not yet give image content, route consequences or player interpretation; if images feel like paperwork rather than discoveries, those missing qualities cannot be cured by counting additional delivery slots.

## Actual whole-route witnesses

Run `python results/mars-named-two-mission-candidate/build_design.py` from the repository root.

| Whole campaign condition | Combines | Placements | Selected operations |
|---|---:|---:|---:|
| Sparse ordinary authored route | 56 | 27 | 83 |
| Sparse optical-first route | 56 | 27 | 83 |
| Sparse simple-tool route | 48 | 28 | 76 |
| Generous intact salvage | 33 | 28 | 61 |

The simple-tool control uses exactly the ordinary starting condition, accepting hand cart, binocular/map comparison, simple hoist, sprayer, soup and long-range radio rather than elaborate versions. It makes the reflector later for the beacon instead of cooking. Its shorter route is legitimate; none of those shortcuts is prohibited to manufacture duration. The generous control has the eleven previously disclosed initial intact inventions and is not a matched normal-play comparison.

The remote segment contributes 30 operations in the ordinary/generous routes, 27 with the optical beacon already available, or 31 after the simple home route. These are segment counts **inside actually executed whole routes**, not additive evidence from separately played demos. None is a lower bound or a player decision count.

## Persistence and board contract

- All kinds remain globally unique. There are no per-mission copies, return-trip copies, hidden inventory resets or simultaneous requirements for the same token in two places.
- Only the broken radio retires. Other ingredients remain; devices do not consume the camera, fan, frame or sample as finite stocks.
- Actual target B placement determines catalyst context. A moves loose; B stays put. Location operands create portable outputs; placements eject old occupants.
- Every route’s home survey map remains on its navigation table when the cliff picture is dragged onto it. The newly annotated map is a distinct result delivered to the field table.
- The imaging glovebox stays at the inspection nook when the sample is dragged onto it. The ice picture and sealed sample can both occupy their own final slots without duplicating the ice-sample kind.
- The home radio contact was a historical milestone. Moving its optical beacon to the camp approach is honest reuse; the final long-range radio/relay remains at its separate home endpoint.
- New base supplies and places appear only for their introduced objective. Existing things remain accessible. Remote goals do not regrant earlier camera, frame, foil or lamp.
- Logical board continuity is verified. Spatial legibility of over a hundred retained things is **not solved**; no collapsing, disposal, secret shelving or new UI is smuggled into this artifact.

## Evidence limits and next gate

The authored walker checks operand availability, revealed places, actual target context, result novelty, movement, displacement, narrowly explicit retirement, complete objective groups and simultaneous current endpoints. Independent semantic/reconstruction review is stored separately under `results/mars-named-two-mission-review/` when available; a passing self-check alone is not the independent gate.

This is a complete second mission rather than a list of future possibilities. It is still a short campaign relative to the user's roughly 200-decision ambition. The 76-operation sparse-simple witness must remain visible when considering that gap. Additional missions need new useful purposes and actual continuous routes, not quotas of upgraded equipment, repeated specimen errands or all alternative branches made compulsory. A fresh player and experienced shortcut control would be needed after immutable publication to assess whether shared equipment, clear progress and the observations are satisfying in practice. No native browser or human fun claim follows from these files.

## Workspace load and honest scenario boundaries

The full per-objective audit is `workspace-load-audit.json`, with counts both after supply/place introduction and after the authored operations. “Loose” means not occupying a goal/location slot; it is not permission to discard or invisibly archive the thing. A revealed empty location still contributes to the visible workspace. Counts below describe the ordinary route, not a proposed screen layout.

| After objective | Things | Loose things | Revealed places | Occupied places |
|---|---:|---:|---:|---:|
| repair | 2 | 2 | 0 | 0 |
| contact | 10 | 9 | 1 | 1 |
| water | 18 | 16 | 3 | 2 |
| growth | 24 | 21 | 4 | 3 |
| patch | 27 | 22 | 6 | 5 |
| mobility | 32 | 26 | 7 | 6 |
| survey | 38 | 31 | 9 | 7 |
| field-water | 40 | 32 | 10 | 8 |
| lifting | 44 | 35 | 11 | 9 |
| work | 48 | 38 | 12 | 10 |
| garden | 50 | 39 | 13 | 11 |
| irrigation | 54 | 42 | 14 | 12 |
| harvest | 63 | 51 | 15 | 12 |
| meal | 67 | 54 | 17 | 13 |
| relay | 70 | 56 | 18 | 14 |
| ice-haul | 72 | 57 | 19 | 15 |
| camp-shelter | 75 | 59 | 20 | 16 |
| rest | 77 | 60 | 21 | 17 |
| clean-air | 80 | 62 | 22 | 18 |
| ventilation | 82 | 63 | 23 | 19 |
| contained-imaging | 87 | 67 | 24 | 20 |
| ice-image | 90 | 69 | 25 | 21 |
| ice-specimen | 92 | 70 | 26 | 22 |
| cliff-view | 98 | 76 | 27 | 22 |
| field-chart | 99 | 76 | 28 | 23 |
| way-home | 102 | 78 | 29 | 24 |

The ordinary home endpoint already has **70 things (56 loose) and 18 revealed places**. At the second endpoint there are **102 things (78 loose) and 29 places**. Optical-first ends at 102/79/29, sparse-simple at 94/71/28, generous at 90/65/29 (things/loose/places). This is a serious unresolved interaction constraint, not a small layout polish item. The new sample and observation purpose does not make the clutter disappear. No catalogue, automatic retirement, secret shelving or blanket “unused” removal is authorized by this data.

### Which obligations actually persist?

This candidate explicitly retains the first mission’s authored current goals; it does not claim those are automatically necessary in every subsequent scenario. Pressure patch, transport, map, water apparatus, hoist, lit bench, planted shelter, watering apparatus and long-range contact each describe equipment left useful at home while the field camp is outfitted. Some are conveniences, not survival necessities. The warm meal is weaker as an indefinite obligation: retaining a named dish at the galley is a clear endpoint but does not model continuing feeding or freshness. A later campaign revision could honestly make preparing/eating the meal a historical achievement rather than require an untouched dish forever. That policy change is **not implemented here**, so these exact route claims preserve the earlier authored endpoint instead of silently changing it.

The disclosed historical goals are radio repair, initial contact, water delivery, protected germination, harvest delivery and the remote cliff photograph. These are achieved events; their source/result tokens can move on. The newly current camp goals describe equipped shelter, personal warmth, dust filtration, ventilation, the imaging apparatus, stored image and specimen, annotated field map and approach beacon. Stored evidence has ongoing accessibility value, but does not require pretending that a delivery itself is a rich decision.

A reasonable **separate-scenario** alternative would end the home project, then start a declared ice-camp scenario with a small, explicitly selected loadout of named inventions and base salvage. This would reuse ontology without claiming it reuses one continuous board, without counting the two routes as one play, and without secretly deleting unique things. Another possible architecture is an explicit visitable home and field area with every retained token's location accessible, but that requires a designed navigation/access rule and cannot silently bypass the user's uncluttered direct-board requirement. Neither alternative is implemented or assumed in these witnesses. The current complete campaign is the intentionally strict retained-board control against which a future boundary design can be judged.
