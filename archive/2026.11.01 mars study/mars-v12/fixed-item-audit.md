# Mars v12 — fixed-item interaction audit

3 November 2026. Requested audit of the proposed model in which a hotspot is a fixed item. This records a design classification, not implemented fixed-item metadata or a new playtest.

The [working revision proposal](fixed-item-plan.md#coverage-of-the-original-audit) now maps all 23 candidates to concrete replacement actions and records the associated scene changes. This audit preserves the original v12 operations and classification; the proposal explicitly revises some equipment roles and installation timing.

## Scope and counting

Read all 36 chapters, their physical notes, the design brief, the existing supply/location audit and the artwork catalogue. Enumerated all 171 item identities and all **135 parsed operations: 131 explicit recipes plus four implicit service-panel fittings**. Each operation was checked for (1) two fixed item operands or (2) a fixed item used on a hotspot. Alternative recipe versions count separately. The two water-line versions and two heat-tank filling orders therefore each count as two operations.

**23 candidate conflicts: 13 item–item and 10 item–hotspot, across 13 chapters. Fourteen concern installed or attached objects under the classification below; nine depend on whether an assembly remains movable. The expanded fixedness review moved Atmospheric processor into the choice group because its first power connection need not follow permanent installation.** These are recipe/slot counts, not 23 compulsory moves on one route.

| Classification | Item + item | Item @ hotspot | Total |
|---|---:|---:|---:|
| Installed systems / fixed working objects | 8 | 6 | 14 |
| Depends on installation timing | 5 | 4 | 9 |
| Total candidates | 13 | 10 | 23 |

## Classification

- A structure, prepared ground, working bed, established utility installation or attached machine stays fixed while being worked on. This includes solar supplies, well lines, plumbed water supply, retort already seated in its receiver with hydrogen connected, established reactor, filled cryogenic stores and wall control panel. The rover winch is attached to its vehicle; its line and hook can move, but the entire winch is not a loose tool.
- Materials, cylinders, folded envelopes, separate fittings, loose instruments, food and specimens remain movable. The water item is the actual treated-water tank/system shown in v12, not a newly substituted jug. The purified-methane item is the completed continuous-production plant, not a portable sample cylinder.
- Installation stage matters. The initially unpowered atmospheric processor, unfed electrolysis rack, cooled separator assembly, prepared cryogenic stores, heat-storage tank and replacement support could be movable during preparation and become fixed when installed. Their nine affected operations are marked **choice** below. Their names alone do not settle mobility.
- The excavator and rover remain movable vehicles. The refrigerated field case, actual sample liners, flight carrier and cooking pot are deliberately carried or transferred in the manuscript; temporarily storing or docking them does not make them permanently fixed. The retort before its hydrogen/receiver installation is a separate supplied vessel.

## Every candidate operation

Expanded at the user's request with chapter titles, exact manuscript names, reasons for treating both operands as fixed, intended actions and products. These are reasons for the proposed staging, not claims that every object is permanently immovable. The winch is attached to a moving rover; the initially unpowered atmospheric package could also be positioned before installation.

**†** marks nine installation-timing choices. Eight were identified originally; the more explicit fixedness review adds the initially unpowered Atmospheric processor. Source lines refer to [mars.md](mars.md). The restored-solar panel fitting is declared in chapter 27 but performed in chapter 29; existing panel states remain recorded. `station-power` and `restored-power` are different identifiers sharing the display name Station solar supply. In chapter 29, `station-power` displays Dust-coated solar supply.

| Chapter | First item: exact name and reason for fixing it | Second item/hotspot: exact name and reason for fixing it | Intended action → actual product | Line |
|---|---|---|---|---:|
| 2 — A voice in the room | **Station solar supply** (`station-power`): the installed array and its distribution equipment remain at their site. | **Reserve charging connection**: a socket on the installed reserve cabinet. | Connect solar output to the reserve charger → **Charged essential reserve**. | 149 |
| 2 — A voice in the room † | **Station solar supply** (`station-power`): the installed array stays on its mounting. | **Atmospheric processor**: treated as the station's outdoor air-processing installation. Its initially unpowered package could instead remain movable until connected. | Supply electrical power and start oxygen production → **Working atmospheric processor**. | 150 |
| 3 — Water under the plain | **Connected well line**: already attached to the well; the complete pipe run stays there. Its free connector could be the movable item. | **Water processor**: installed treatment equipment connected to the habitat's water system. | Connect the well to treatment and establish clean-water output → **Drinking water supply**. | 224 |
| 3 — Water under the plain | **Insulated water line**: the same installed pipe run, now insulated; its connector could move. | **Water processor**: the installed treatment cabinet. | Connect the insulated well line to treatment → **Drinking water supply**. | 227 |
| 9 — What roots need | **Drinking water supply**: currently depicts the plumbed treatment/buffer-tank system, not portable water. | **Unwatered growing beds**: the constructed beds, medium, drains and shared reservoir occupy the growing room. | Fill the reservoir and start irrigation → **Irrigated growing beds**. | 548 |
| 16 — Across the wash | **Rover winch**: its motor and drum are attached to the rover. The cable and hook are the parts taken to the rock. | **Sound rock anchor**: a natural rock assessed as an anchor point. | Secure the winch line and sling to the rock → **Anchored rover winch**. | 877 |
| 16 — Across the wash | **Anchored rover winch**: attached to rover and anchor for this operation, not a loose component fitted to the panels. | **Supported traction panels**: already laid and supported across the wash; they stay beneath the wheels. | Use the anchored winch while driving over the supported route → **Rover beyond the wash**. | 878 |
| 20 — Two gases from water † | **Unfed electrolysis rack**: only fixed if already positioned at its installation site; the assembled rack could still be movable. | **Processor polishing outlet**: a port on the installed water processor. | Connect polished water, power and cooling → **Fed electrolyzer**. | 1041 |
| 23 — The first methane | **Catalyzed retort**: already seated at the solar receiver; its hydrogen connection persists through catalyst fitting. | **Iron process frame**: already constructed on the fuel-fab footing, with supports belonging to that site. | Support the retort in the frame and complete its control/cooling assembly → **Controlled methane reactor**. | 1181 |
| 24 — The water comes back † | **Cooled separator module**: separator and radiator are joined; the assembly could still be movable until installation. | **Controlled methane reactor**: already commissioned with its feeds and controls connected. | Connect purification and recycling equipment to the reactor → **Purifying methane reactor**. | 1234 |
| 25 — Two cold stores † | **Purified methane supply**: depicts the whole reactor, separator, radiator and return circuit supplying gas, not a portable bottle. | **Refrigerated cryogenic tanks**: fixed if positioned for operation; the empty prepared units could still be moved. | Feed clean methane into its dedicated refrigerator/receiver and liquefy it → **Tank of liquid methane**. | 1291 |
| 25 — Two cold stores † | **Refrigerated cryogenic tanks**: fixed only if already placed; an empty receiver could still be brought to its final position. | **Oxygen service outlet**: a port on the installed electrolysis rack. | Feed oxygen into its dedicated refrigerator/receiver and liquefy it → **Tank of liquid oxygen**. | 1292 |
| 25 — Two cold stores | **Tank of liquid methane**: a filled, operating cryogenic store with refrigerator and process connections. | **Tank of liquid oxygen**: the separate filled oxygen store with its own refrigeration and services. | Coordinate the completed systems through common controls, keeping their fluids separate → **Running fuel fab**. | 1293 |
| 26 — Heat worth keeping † | **Drinking water supply**: the installed treated-water and buffer-tank supply. | **Unfilled insulated tank**: fixed if constructed in place in the service alcove; an empty tank could still move for filling. | Fill water around the separate coil after insulation has been fitted → **Unheated water tank**. | 1341 |
| 26 — Heat worth keeping † | **Drinking water supply**: the installed treated-water supply. | **Unfilled uninsulated tank**: the same empty tank before insulation; keeping it fixed is a staging choice. | Fill water around the coil before insulating the tank → **Uninsulated filled tank**. | 1342 |
| 26 — Heat worth keeping † | **Unheated water tank**: now full and insulated; could be treated as in place, but mass and handling are unspecified. | **Indoor heat-recovery connection**: a permanent connection through the enclosure's service spine to the process loop. | Connect the tank's coil to recovered process heat → **Warm water tank**. | 1344 |
| 27 — Amber noon | **Station service panel**: explicitly wall-mounted in the manuscript. Making it handheld would be a redesign. | **Charged essential reserve**: the installed battery/fuel-cell reserve and electrical connections. | Select essential reserve power → **Station service panel**, with **Essential power selected** recorded. | 1364 |
| 27 — Amber noon | **Station service panel**: the existing wall-mounted controls. | **Insulated water line**: the installed outdoor well-water pipe, heating and drainage services. | Command isolation and drainage, then stop trace heating → **Station service panel**, with **Well isolated and drained** recorded. | 1365 |
| 27 — Amber noon | **Station service panel**: the existing wall-mounted controls. | **Running fuel fab**: the installed reactor, purification circuit and cryogenic stores. | Command cooling, isolation and shutdown → **Station service panel**, with **Fuel fab shut down** recorded. | 1366 |
| 29 — Sun on the floor | **Dust-coated solar supply** (`station-power`): the whole array remains mounted; removable sections can be carried. | **Array cleaning bench**: the workshop's established service surface. | Isolate and remove sections, clean them, then refit them → **Station solar supply** (`restored-power`). | 1460 |
| 29 — Sun on the floor | **Station service panel**: the wall-mounted controls remain in the habitat. | **Station solar supply** (`restored-power`): the restored array remains at its outdoor site. | Restore solar operation and run the well/plant restart sequence → **Station service panel**, with **Solar operation restored** recorded. | 1367 |
| 30 — The leg that stays † | **Replacement landing leg**: its current depiction includes the brace and ceramic footing on prepared ground. A separate strut could instead move. | **Tilted lander**: the same grounded spacecraft resting on its temporary supports. | Fit the replacement support and transfer the spacecraft's load → **Level launch platform**. | 1502 |
| 31 — Two tanks, two liquids | **Station service panel**: still wall-mounted in the habitat, with all four control states recorded. | **Lander propellant service connections**: the separate methane and oxygen ports built into the spacecraft. | Command transfer through the two qualified propellant connections → **Fueled ascent tanks**. | 1528 |

## The nine installation choices

- Chapter 2: the unpowered Atmospheric processor could be moved into position and connected as part of bringing it online. Treating it as fixed beforehand is a staging choice, not established by its name. One operation.
- Chapter 20: leave the newly built unfed rack movable until it is connected, or build it in place and connect its water service. One affected operation.
- Chapter 24: move the cooled separator/radiator assembly into the reactor installation, or treat the assembled unit as already fixed and join their services. One operation.
- Chapter 25: prepared empty cryogenic stores could still be positioned at their feeds. If fixed already, both methane filling and oxygen filling need another interaction. Two operations. Coordinating the two filled, operating stores remains a core conflict either way.
- Chapter 26: the small empty tank might be carried for filling; a filled tank might be repositioned for its final connection. If constructed in place in the service alcove, both filling orders and the final heat connection instead join fixed things. Three operations. The text specifies the alcove and fluid separation, but no mass or handling detail that conclusively settles portability.
- Chapter 30: a separate replacement strut can be brought to the spacecraft, while the current result includes the braced support and ceramic footing made on the prepared ground. Keeping the whole result fixed creates one conflict; defining a movable strut requires keeping its fixed footing distinct.

## Existing construction-to-location handoffs

The [authoring guide](../../../docs/story-authoring.md) already permits a completed construction to become a hotspot in a later chapter. The current implementation uses separate authored identities and artwork; the proposed fixed-item model could make their physical continuity explicit. A later fixed role does not imply that every earlier component or preparation state was fixed.

| Earlier construction in v12 | Later fixed receiving surface |
|---|---|
| Assembled solar furnace, chapter 5 | Solar heating bay, chapter 6; Solar cooking connection, chapter 32 |
| Cleared cavern bay, chapter 4 | Cleared growing bay, chapter 6 |
| Protected floor and lit enclosure, chapter 6 | Growing-room floor, chapter 8 |
| Irrigated growing beds, chapter 9 | Unfinished growing beds, chapter 10; shared reservoir/service rail, chapter 28 |
| Working atmospheric processor, chapter 2 | Atmospheric carbon-dioxide outlet, chapter 22 |
| Buffered electrolysis rack, chapter 20 | Hydrogen service outlet, chapter 21; Oxygen service outlet, chapter 25 |
| Established potato, soybean and lettuce zones, chapters 10–12 | The three harvest hotspots, chapter 33 |
| Stabilized/repaired lander, chapters 1 and 30 | Later support, propellant, specimen and flight-console surfaces |

These handoffs are not additional failed gestures. The counted conflicts concern operations that would still require dragging an already fixed object at the time of that action. In the current published Settlement manuscript, Sailboat itself remains an item and is later used to make Mailboat; the general construction-to-hotspot convention nevertheless already exists and is used extensively in Mars.

## Important exclusions and limits

The other **112 operations** avoid both requested patterns under this classification. A movable ingredient can still be dragged onto a fixed receiver: patch kit onto the habitat, gas cylinders onto a sealed room, folded pressure envelope onto its prepared floor, basket onto a crop bed, or beans onto a cooking vessel. A fixed first operand in written recipe order is not by itself a failure: ordinary two-item recipes can be performed by dragging their movable operand onto the fixed one.

If the excavator is made fixed for interaction purposes, add **three** item-to-hotspot cases: working excavator at Surveyed cavern floor (chapter 4, line 276), Fuel-fab area (chapter 19, line 987) and Lander support ground (chapter 30, line 1500). That would make 26 candidates under the broader interpretation. Keeping it movable represents driving a vehicle, rather than carrying it by hand.

Several core conflicts already have sensible physical explanations in the prose: a winch extends its line; solar panels are isolated and removed for cleaning; the panel sends commands to installed systems. They are counted because the current draggable identities still represent the whole winch, array or controlled installation. This audit does not judge those physical procedures impossible.

The recurring issue is using movement of an entire installation to express connecting services, operating controls or coordinating existing equipment. Fixed-item state changes alone do not specify the gesture for those operations. Cross-chapter persistence and scene composition are separate implementation questions; no engine, recipe or art changes were made in this audit.

Manuscript SHA-256: `c001172d19b4f7d99933340f6d5ea439a66fcebd1118a4769cad62037780922f`.
