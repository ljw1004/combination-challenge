# Mars fixed-item revision — implemented design

The [playable manuscript](mars.md) now implements the fixed-item revision and the subsequent user corrections below. The [original interaction audit](fixed-item-audit.md) preserves the 23 conflicts that prompted it. The chapter proposals here explain the design rationale; the manuscript and [design brief](design-brief.md) own the selected story, and the [format specification](../../../docs/story-format-spec.md) owns runtime semantics. [Production and verification](../production/v12/fixed-items/README.md) record the implemented assets and evidence limits.

Subsequent user corrections are included: independent solar-array footing in chapter 19; outdoor machinery with no workshop shelter; ambiguous fragmented evidence in chapter 13 and the intact reveal in chapter 18; three independent specimen placements inside the cabin in chapter 34; compact Steel and Tool kit symbols.

## Agreed direction

- Retain **Hotspots**. An item listed there is fixed in that chapter, at its authored place, and cannot be dragged away. It remains an ordinary item and can be compound.
- A fixed operand can be consumed or transformed. In `A @ H -> C`, when H retires and C is fixed in this chapter, C replaces H at the same location. Ordinary operations can preserve H and produce a movable result instead.
- An object's role can change between chapters. In particular, a battery can be movable while charged in chapter 2 and fixed in its installed bay in a later chapter, retaining its identity and state. Do not invent an “unfix” notation without a concrete need.
- Keep the existing simple drag-and-drop interaction. The user chose rewriting operations around movable cables, hoses, components and controls. Do not add a general fixed-to-fixed linking gesture or draw a connection following the pointer during a drag.
- A named item such as **Solar power lead** can represent handling the loose end of a lead already attached to its source. Its name, object artwork, starting situation and completed result must establish what the operation means. The icon moves normally.
- Solve each situation individually. An ordinary cable dropped onto one machine must not silently establish an unexplained connection to another. State which end is attached, what moves, what receives it and what the result shows.
- Distinguish symbolic resource supplies from literal objects. **Steel** represents steel in general and should be a compact, readable icon, leaving more room to work. It need not look like a full-sized pile in the landscape. Portable objects retain recognizable physical forms; installed structures belong to the scene. The [icon guide](../../../docs/icon-guide.md#2-catalogue-meanings-and-distinctions) owns the reusable catalogue method. This is an art choice, not another interaction mode.
- Treat the conflicts as physical staging problems, not just drag restrictions. Ask what the astronaut actually moves or operates and whether the result picture shows that action. Cleaning an outdoor solar array must not become moving the array into the habitat or putting it inside a control panel.

## Chapter 2 — A voice in the room

The existing interior background is the wrong setting for the main work. Stage this chapter outside the repaired habitat, with ground-mounted solar panels, the habitat's exterior service connections, the outdoor atmospheric processor and a prominent antenna bracket. Preserve the established habitat's identity. Keep usable foreground space for the battery, tools, cable and unmounted antenna.

### What is fixed, and when

| Object in the proposed chapter | Chapter 2 role | Later continuity |
|---|---|---|
| **Delivered solar array** | Movable equipment/components before deployment. | Retires into the one installed array. |
| **Station solar array** | Fixed as soon as constructed at its outdoor location. Consolidates the current Standing solar array / Station solar supply depictions. | The same array becomes dust-coated and is cleaned in chapter 29. It never becomes a second movable array. |
| **Reserve battery** | Movable while being brought to the panels for charging. | Transforms into the charged version of the same battery. |
| **Charged reserve battery** | Remains movable after charging. | List this same charged identity under Hotspots when it occupies its reserve bay in a later chapter, such as chapter 27. No new battery or “installation certificate” is created. |
| **Atmospheric processor** | Fixed outside, already positioned beside the habitat's service connections. | Its oxygen and later carbon-dioxide functions remain those of the existing supplied machine. |
| **Working atmospheric processor** | Fixed replacement for the unpowered processor at exactly the same location. | Later service-outlet views show the same installation. |
| **Radio mount** | Fixed bracket high on the habitat exterior. | Retires into the completed mounted antenna appearance. |
| **Bent antenna** and **Straightened antenna** | Movable dish/support assembly during repair and fitting. | The installed result becomes fixed. |
| **Mounted antenna** | Fixed result at Radio mount; artwork shows the dish and mounting, without the portable box of dials. | The radio electronics remain part of the habitat; the player hears the message through the existing receiver/headset. |
| **Power cable**, **Solar power lead**, **Tool kit**, **Steel** | Movable. The prepared lead is a normal icon; no tether is drawn during dragging. | The generic Power cable remains available for its other authored uses; it is not globally renamed into a solar-specific item. |

Derived entries under Hotspots must not appear before they are constructed. Listing both Atmospheric processor and Working atmospheric processor describes successive states at one place, not two simultaneously supplied machines. The same applies to Radio mount and Mounted antenna.

### Proposed six operations

These operations are implemented using the fixed-item syntax in the current specification.

| Inputs | Physical work and visible result | Product |
|---|---|---|
| Steel + Delivered solar array | Make the supports and deploy the supplied panel assembly at its outdoor site. The installed panel assembly includes its qualified electrical outlet/charge controller. | **Station solar array**, fixed. |
| Reserve battery @ Station solar array | Bring the battery to the panel assembly's compatible charging connection. Charging is included in the ordinary action's elapsed time; no waiting UI. Preserve the panels. | **Charged reserve battery**, movable. |
| Power cable @ Station solar array | Attach one end to the array's qualified power outlet, leaving the equipment plug available. This prepares a lead; it does not turn sunlight collection on. Preserve the panels. | **Solar power lead**, movable. |
| Solar power lead @ Atmospheric processor | Fit the loose plug and start the processor. The completed fixed illustration shows the cord reaching its established exterior power outlet. Retire the unpowered processor appearance. | **Working atmospheric processor**, fixed at the same position. |
| Tool kit + Bent antenna | Straighten the damaged support while retaining the same dish and surviving cable. | **Straightened antenna**, movable. |
| Straightened antenna @ Radio mount | Mount the repaired dish high on the habitat and make its existing signal connection. Replace the empty bracket appearance. | **Mounted antenna**, fixed; its reading delivers Mara's recorded message. |

This preserves six operations in the chapter. It also preserves a visible power dependency: the processor requires Solar power lead, which cannot be made until the array is deployed. A bare Power cable must not activate the processor before any power source exists. The fixed equipment remains in the scene while the movable objects do the work.

### Artwork required

- A coherent exterior view of the same habitat, with a bare panel installation area, the processor service position and a high antenna mounting point. Draw changing equipment as registered fixed artwork rather than painting one copy into the backdrop and adding another as a result.
- Installed solar-array art that fits its landscape location. The empty charging connection must visibly accept the portable battery; the power socket must visibly accept the cable.
- Distinct depleted/charged appearances of the same carryable battery, without representing the entire reserve machinery as a suitcase.
- Matching inactive/working atmospheric-processor appearances. The working version includes the completed static cable connection and a readable operating indicator. The manuscript already specifies this as an outdoor package, so no location premise needs to be invented.
- Bent, repaired and mounted versions of the same dish. The mounted version shares the background's perspective and bracket position. The radio's receiver electronics stay inside the habitat.
- A readable Power cable / Solar power lead distinction through connector orientation and the prepared connection's depiction, supported by the item name. It must survive normal playing size without a line drawn during the drag.

### Proposed battery continuity in the wider revision

The user has settled its mobility: movable in chapter 2, fixed later where needed. Keep the carryable object as a removable battery module of the existing station reserve. By chapter 27 it sits in that reserve's installed bay. The forecast storm endurance still belongs to the delivered battery and regenerative-fuel-cell system described in v12, rather than to a small battery alone. Show the module alongside that machinery when the reserve is selected. This makes its role explicit without new mobility syntax or a new energy source.

## Chapter 3 — Water under the plain

The user proposes a single outdoor installation scene: the surveyed bore and habitat water processor remain visibly separated, with a route between them for the connecting hose. Its completed artwork shows a real pipe reaching both endpoints. The operation includes laying and connecting that hose; it does not require a second gesture with the completed pipe.

### Fixed items and transitions

| Current manuscript name | Role in this chapter |
|---|---|
| **Surveyed ice bore** | Fixed at the bore position initially. Retires when the extraction head is installed. |
| **Sealed melt well** | Fixed replacement at the same bore position. Remains present when its service hose is connected. |
| **Water processor** | Fixed habitat treatment equipment visible from the start. Its inlet is the other endpoint of the installed hose. |
| **Connected well line** | New fixed pipe laid between Sealed melt well and Water processor. Its receiving area is on the actual hose run, not a second well or floating installation. |
| **Insulated water line** | Fixed replacement for Connected well line along exactly the same route; retain both endpoints and show the insulation around the existing pipe. |

Heated extraction head, Clean service hose, Packing foil, Insulation felt and Reflective insulation remain ordinary movable items/material supplies.

### Proposed operations

| Inputs | Fate and physical result |
|---|---|
| **Heated extraction head @ Surveyed ice bore → Sealed melt well** | Fit the head. Retire the bare bore state and render the completed well at the same location. |
| **Clean service hose @ Sealed melt well → Connected well line** | Preserve the well. Lay hose from its outlet to the processor inlet; open the connection and establish treatment. The new pipe appears at its authored route/position, with both endpoints visibly attached. Hose stock may remain available for later uses. |
| **Packing foil + Insulation felt → Reflective insulation** | Retain the existing preparation of the movable insulating material. |
| **Reflective insulation @ Connected well line → Insulated water line** | Replace the bare installed pipe with its insulated state at the same location. The actual well and processor stay in place. Powered tracing belongs to the established supplied service equipment; insulation does not itself supply heat. |

The first goal, “Bring water through treatment,” can be witnessed by Connected well line. That goal remains latched when the pipe later becomes Insulated water line. The second goal remains protection of the exterior run.

Remove both current whole-installation moves, **Connected well line @ Water processor → Drinking water supply** and **Insulated water line @ Water processor → Drinking water supply**. Their physical work is already included in routing the hose to the processor. This changes six authored recipes to four and removes one action from either completed route.

The later garden, heat-store and food uses of Drinking water supply are revised below. Their water comes from the processor commissioned here. Reuse **Water processor's fixed identity**, with **Drinking water supply** as its later working name/view, rather than retaining the old orphan derived result. A chapter-dependent name after chapter 3 can express that change: completing chapter 3 has already established treatment and protected its feed. Its physical outlet is the receiver for later water operations; no portable copy of the whole treatment system is introduced.

### Consequence for fixed-result placement

This chapter distinguishes two rules needed by the proposal:

- When fixed H retires and fixed C replaces it, C inherits H's location: bore to well, and bare pipe to insulated pipe.
- When H survives and C is a new fixed construction, C uses its own authored location: the pipe is laid between the well and processor, while the well stays at the bore. Do not put the pipe at the well centre merely because the well received the drop.

The pipe's final appearance can include the whole routed length, with an appropriate receiving area for insulation. Nothing needs to follow the cursor while the ordinary hose icon is dragged. Show only one well, one processor and the current version of one installed pipe.

## Chapter 9 — What roots need

The user's proposed hose operation fits the existing growing system: fixed beds receive fresh water from the habitat's fixed drinking-water supply. Chapter 8 already builds one reservoir, pump and aerated return serving the three growing zones. The new hose supplies that reservoir; it does not replace the existing circulation plumbing or add another pump.

### What is fixed, and when

| Current or proposed name | Role and continuity |
|---|---|
| **Raised bed frames** through **Empty growing beds** | Fixed from construction in chapter 8. Lining, drain fitting and reservoir assembly change the installed structure in place. Empty growing beds arrives in chapter 9 at that same installation. Both alternative chapter 8 assembly orders must retain matching geometry. |
| **Root-medium wash bench** | Fixed washing attachment, as in the current chapter. It produces movable Growing medium. |
| **Drinking water supply** | Fixed working outlet of the habitat water system commissioned in chapter 3. Its availability must follow that earlier work; revising chapter 3 must not leave this as an orphan result or create a second treatment plant in the farm. |
| **Prepared growing beds** (proposed replacement name for Unwatered growing beds) | Fixed successor to Empty growing beds after adding the medium. This name remains accurate when water is connected. |
| **Irrigation supply line** (proposed new result) | Fixed hose route from the drinking-water outlet to the beds' shared reservoir. Its completed appearance shows both connections and water entering the reservoir. The source and beds remain in place. |

Clean service hose, Ceramic blocks and Growing medium remain movable. Material icons may represent a usable stock rather than the entire bulk quantity.

### Proposed operations and goals

| Inputs | Physical result |
|---|---|
| **Ceramic blocks @ Root-medium wash bench → Growing medium** | Retain the current preparation and washing operation. The bench remains; the medium is movable. |
| **Growing medium @ Empty growing beds → Prepared growing beds** | Fill the installed beds with the prepared porous medium. Replace the empty state at the same position. |
| **Clean service hose @ Drinking water supply → Irrigation supply line** | Lay and connect the fresh-water feed to the existing reservoir. Preserve the water outlet and beds; render the pipe at its own authored route. Hose stock can remain for later uses. |

Keep the two purposes of the current goals: filling the beds with clean medium and supplying water to the shared loop. Use Prepared growing beds and Irrigation supply line as their respective witnesses. This keeps three operations in the chapter.

The naming change avoids leaving an object called **Unwatered growing beds** after the hose has supplied water. The hose operation has one result—the installed line—rather than secretly producing both a pipe and a second bed state. The current **Irrigated growing beds** result has no later recipe uses; replace its chapter 9 goal/result role in this revision. Chapter 10's working view must depict these same completed beds, medium and reservoir.

Connecting the feed before adding the medium is physically sensible: it fills the reservoir already built in chapter 8. Both goals must be completed before proceeding. Do not use the goals' displayed order as an action gate or let the pipe artwork prematurely paint medium into the beds.

### Artwork required

Show enough of the existing water outlet, reservoir and hose route to make the drop's meaning evident. The habitat and cavern growing room are separate established spaces; choose a view through their service route or a clearly established habitat-fed connection at the growing-room entrance. Do not quietly move the habitat processor into the farm. The exact composition remains an art task.

The new pipe must be visibly distinct from chapter 8's recirculating drain/return loop. Keep the same bed layout and aerated return, and show the fresh-water connection reaching the existing reservoir. Paint the installed line only after the operation. Its appearance and authored position must coexist with either bed preparation state. Nothing follows the cursor during the ordinary hose drag.

## Chapter 16 — Across the wash

The user proposes preparing the crossing, rigging its winch, then dragging the rover onto the prepared route. Adopt that sequence for this proposal. The final operation moves the vehicle already present; it must not conjure a rover from two pieces of recovery equipment. Dragging this vehicle represents driving it.

### Scene and vehicle continuity

Compose one readable route from the foreground, across the shallow soft wash, onto firm ground leading toward the distant ice. Lay the panels lengthwise along that direction, with their wheel tracks and perspective matching the rover. They are short, ground-supported traction surfaces. Keep the existing ground-preparation premise; do not turn them into a freestanding bridge over a ravine.

The rover starts visibly on the near approach, facing toward the ice, as an ordinary movable item. It is the delivered vehicle seen in chapter 15, already carrying the actual Buffered field case. Preserve its chassis, wheel arrangement, seat, roll bar, colours and mounted case across the loading view, starting item and distant result. The current chapter 15 background and Rover beyond the wash icon depict different vehicle designs; revise them as one family.

Author this existing vehicle as **Expedition rover** (proposed name). This makes an already established vehicle explicit in the gameplay, not a newly delivered rover. Chapter 15 currently declares Rover cargo mount as a location, not the rover itself as a fixed item; this proposal does not require an “unfix” declaration. Keep that handoff coherent when revising chapter 15. The case retains its identity for chapter 17's existing sample operation; neither the starting rover nor its crossing result creates another case.

### What the winch represents

Choose a portable recovery winch that is taken to the far bank and secured to the assessed rock using its supplied padded sling. For this proposal, the existing **Rover winch** means that portable powered package, with its power module carried as part of the supplied unit. This revises the audit's tentative rover-mounted interpretation: the motor and drum become part of the fixed crossing installation, rather than staying on the rover while another picture shows them at the rock. Make this equipment premise explicit in the revised brief and artwork; it is not an unexplained power connection or a new fabrication capability.

Place the rock beyond the soft section, aligned with the route and clear of the vehicle's wheels. Installing the winch on **Supported traction panels** means rigging that crossing at its far end. The result must visibly show the sling around the rock and the winch secured there, with its pulling direction along the panels. The panels themselves do not anchor the winch. Sound rock anchor becomes an established feature of this whole crossing, rather than a separate required drop target.

Call the prepared result **Winch-ready crossing** (proposed name). Its picture retains the installed panels and adds the anchored winch. Show the line stowed ready at the winch; the final rover operation includes paying it out, attaching it, making the assisted crossing, then releasing and stowing it again. This lets the fixed crossing remain visually accurate before and after that operation. Do not leave a taut line attached to an empty starting position, or make the line follow the rover icon during dragging.

### Proposed four operations

| Inputs | Fate and visible result |
|---|---|
| **Steel + Cargo mesh → Framed traction panels** | Retain the current construction. The movable drawing represents manageable panels ready to lay. |
| **Framed traction panels @ Shallow wash crossing → Supported traction panels** | Replace the bare crossing target with the fixed installed panels. Their long direction leads from the near approach toward the ice. |
| **Rover winch @ Supported traction panels → Winch-ready crossing** | Install the portable winch and sling at the far-bank rock. Retire the loose winch and replace the supported-panel state in place with the same panels plus the visible recovery setup. |
| **Expedition rover @ Winch-ready crossing → Rover beyond the wash** | Transform the near-side rover into the fixed, more distant appearance of the same vehicle, with its case still aboard. Preserve the prepared crossing. The action includes using and releasing the winch. |

Retain the two existing goals: **Make a supported crossing** witnesses Supported traction panels, and **Take the rover across** witnesses Rover beyond the wash. Rigging the winch is a prerequisite of the second goal. This keeps four operations and removes the current separate Anchored rover winch result and the fixed-to-fixed combination.

### Placement and artwork required

- Redraw the crossing view and registered panel states together. Show the near approach, short supported route, far anchor and a clear far-bank stopping place. Leave room for the starting rover without blocking the installation targets.
- Draw the starting rover separately from the background. Its disappearance after crossing must leave empty foreground, not a second painted rover underneath.
- Give Rover beyond the wash its own authored fixed position on the far bank, smaller with distance and facing along the route. The crossing survives, so this is the already identified case of a new fixed result using its own location, not inheriting the receiving panels' centre.
- Keep the installed panels and rig in the same positions throughout. The far rover must stand on firm ground beyond the soft section, with no wheel intersecting the anchor or winch. The same route remains available for the return described in chapter 17.
- Review the sequence together at playing size: rover waiting, panels installed, crossing rigged, then the same rover across. A detailed standalone vehicle icon does not establish spatial continuity.

## Chapter 20 — Two gases from water

**Original problem:** Unfed electrolysis rack is dragged onto Processor polishing outlet to produce Fed electrolyzer. Once the rack stands in its working position, its water connection is the thing to move.

Place **Electrolyzer stack** at its permanent position at the start. Its imported base and the industrial services established in chapter 19 already provide power and cooling; show those connections from the outset. The water inlet is visibly unconnected. Gas-control manifold, Clean service hose and the batch of Gas cylinders remain movable supplies.

| Proposed operation | Fixed result and physical work |
|---|---|
| **Gas-control manifold @ Electrolyzer stack → Unfed electrolysis rack** | Fit the supplied valve/control blocks to the stack in place. |
| **Clean service hose @ Unfed electrolysis rack → Fed electrolyzer** | Run the hose from the nearby Processor polishing outlet to the stack's water inlet. Both endpoints must be visible in the completed state. The outlet survives; the rack changes in place. |
| **Gas cylinders @ Fed electrolyzer → Buffered electrolysis rack** | Install the separate, correctly dedicated hydrogen and oxygen receivers on the same rack. |

This retains three operations. The hose establishes the missing water feed; it must not also conjure electricity, cooling or a second water processor. One registered rack changes through its states. Its later Hydrogen service outlet and Oxygen service outlet are working ports on this same equipment. The factory separation/drying and safe commissioning sequence remain bundled, as in the existing story.

## Chapters 21 and 23 — The retort and its process frame

**Original chapter 23 problem:** Catalyzed retort is already connected at the solar receiver, while Iron process frame is fixed on the fuel-fab footing. Dragging one complete installation onto the other conceals the actual move.

Keep the **Iron process frame fixed from construction in chapter 21**. Iron bars and brackets are the movable material fitted on the footing. Keep Fuel-fab footing as the prepared site when the frame is built; creating one frame does not remove the ground or the previously installed industrial array.

The retort is a removable supplied vessel, used first in a furnace cradle and later in the process frame. Make that move explicit. Its receiver/tracking base stays behind; the detachable vessel and its handling carrier are the portable part. This needs a credible, manageable vessel design throughout the artwork, not a newly shrunken copy of the current heavy assembly. Retain the existing qualified carrier/handling premise and review it against one person's work.

In chapter 21, change **Unconnected materials retort @ Hydrogen service outlet → Hydrogen-fed retort** to **Unconnected materials retort @ Solar retort cradle → Hydrogen-fed retort**. The cradle is the existing furnace's receiver. Show the dedicated supplied hydrogen feed waiting there, leading back to the already commissioned rack. The drop visibly seats and connects the vessel at the place where reduction happens. Hydrogen-fed retort is then fixed while the mineral work is performed. Workshop press and all the actual iron-making steps remain.

In chapter 23:

| Proposed operation | What moves and what stays |
|---|---|
| **Tool kit @ Hydrogen-fed retort → Disconnected materials retort** | The normal completed cooldown/isolation procedure releases the vessel from its receiver. The connected state retires. The vessel in its supplied carrier is now movable; the empty furnace cradle remains. |
| **Sabatier catalyst cartridge + Disconnected materials retort → Catalyzed retort** | Exchange the removable mineral liner for the clean compatible cartridge. The same detached vessel remains movable. |
| **Catalyzed retort @ Iron process frame → Controlled methane reactor** | Fit the vessel and supplied control head in the fixed frame, reconnecting its qualified gas and service connections. The frame retires into the completed fixed reactor at the same position. |
| **Compressed carbon dioxide @ Controlled methane reactor → Unpurified methane test cylinder** | Retain the contained commissioning operation. The reactor stays; the collected test cylinder is movable. |

This adds one meaningful operation in chapter 23: disconnecting equipment that must actually be moved. It uses transformation into a different movable result, not a new “unfix” annotation. Revise the current statement that the hydrogen connection remains continuously attached through the move. The same dedicated supply is reconnected; no second retort or factory vessel is made from local iron. Draw the empty old receiver, new frame and supplied connection routes consistently across the workshop and process court.

## Chapter 24 — The water comes back

**Original problem:** Cooled separator module is a connected separator-and-radiator assembly, then moves onto the fixed Controlled methane reactor. Avoid having to carry that entire assembly by changing the assembly order.

Fit the compact imported separator to the reactor first. Install manageable cooling-panel sections afterward. The existing **Process cooling panel** becomes **Cooling-panel sections**: a movable batch of locally made flat panels with qualified tubing, depicted compactly like other material stocks. Their installed area must still be shown honestly; a small stock icon does not imply a tiny radiator can do the whole job.

| Proposed operation | Visible result |
|---|---|
| **Coolant tubing + Steel → Cooling-panel sections** | Make manageable metal-and-tube sections, ready to fit. Retain simple local construction and the existing thermal-contact premise. |
| **Uncooled gas separator @ Controlled methane reactor → Reactor with uncooled separator** | Bolt the supplied separator into its receiving position and connect its gas/recycle interfaces. The combined equipment is fixed. Leave its cooling connections visibly unfinished. |
| **Cooling-panel sections @ Reactor with uncooled separator → Purifying methane reactor** | Mount the panels in the adjacent heat-rejection space and connect their qualified coolant circuit to the separator. Replace the reactor state in place. |
| **Clean service hose @ Purifying methane reactor → Water-recovering methane reactor** | Retain the water-return step. Show the cooled product-water return reaching the established treatment inlet, separate from gas and coolant. |
| **Unpurified methane test cylinder @ Water-recovering methane reactor → Purified methane supply** | Retain processing the actual test batch through the completed equipment and commissioning continuous output. The plant remains fixed. |

Five operations remain. Remove the old standalone Cooled separator module result. The separator can be installed before the panels are made, but it cannot produce purified output until cooling and water recovery exist. Prepare one process-court composition with room for the real radiator area; every state keeps the same vessel, frame and ports. Portable imported equipment remains visibly different from the astronaut's simple panel construction.

## Chapter 25 — Two cold stores

**Original problems:** moving Purified methane supply to Refrigerated cryogenic tanks; moving Refrigerated cryogenic tanks to Oxygen service outlet; combining Tank of liquid methane with Tank of liquid oxygen to create Running fuel fab. These are connections and operating states of equipment that should remain in place.

Start with **Cryogenic tanks fixed** as the actual two vessels in their permanent, separate positions. Fit the movable Cryogenic cooling units to produce **Refrigerated cryogenic tanks**, a fixed compound representing that same pair. It has two physically distinct feed positions: methane and oxygen. The common control wiring is part of installing the factory refrigeration equipment; it does not require fusing filled vessels later.

Use the existing Gas-control manifold supply to prepare each gas feed. Its revised brief must explicitly include the matching qualified service tails and connectors that the original story bundles into ordinary gas installation. These are dedicated factory gas fittings, not homemade tubing or the generic water hose. The two prepared lead icons represent their loose receiving ends, already attached to their respective sources.

| Proposed operation | Physical result |
|---|---|
| **Cryogenic cooling units @ Cryogenic tanks → Refrigerated cryogenic tanks** | Fit one refrigerator to each fixed vessel, with separate fluid paths and the supplied common operating controls. |
| **Gas-control manifold @ Purified methane supply → Methane feed lead** | Fit the methane-compatible source connection. Preserve the plant; the free end is movable. |
| **Gas-control manifold @ Oxygen service outlet → Oxygen feed lead** | Fit the separate oxygen-clean source connection. Preserve the electrolyzer; the free end is movable. |
| **Methane feed lead @ Refrigerated cryogenic tanks** | Fill the compound's methane-feed slot. The completed pipe reaches only the methane receiver; its gauge shows liquid collected after the ordinary operation's elapsed time. |
| **Oxygen feed lead @ Refrigerated cryogenic tanks** | Fill the oxygen-feed slot independently, with its own route and receiver. |

The last two operations update the existing fixed compound; each has one result, that same bank with another slot fitted. Each slot accepts only its matching physical lead. Use **Fit the refrigeration** and **Collect both liquid propellants** as the two goals, with the second requiring `Refrigerated cryogenic tanks[Methane feed lead, Oxygen feed lead]`. Either feed can be connected first.

This is five operations, including the two fittings. Remove Tank of liquid methane and Tank of liquid oxygen as separate draggable result identities, and remove their combination into Running fuel fab. Their physical contents are represented by the two filled states of the actual stores. The entire plant's readiness is established by those goals; later chapters use its existing controls and outlets, not a movable Running fuel fab token.

The artwork must contain exactly two storage vessels throughout, never a prepared pair plus two new filled tanks. Keep their source routes, keyed connectors, refrigeration and vents separate. Use distinct connector shapes and placement as well as colour. The gas sources must already exist to prepare their leads, and the receiving stores must already be refrigerated to accept them. Nothing connects to a guessed offscreen source solely because a generic hose was dropped nearby.

## Chapter 26 — Heat worth keeping

**Original problems:** Drinking water supply fills either Unfilled insulated tank or Unfilled uninsulated tank, then the filled Unheated water tank is dragged to Indoor heat-recovery connection. Build the tank in the alcove and bring its connections to it.

All tank states are **fixed from Steel tank without a coil onward**, at one authored position. Retain the steel/tool construction, coil-first requirement, and both valid orders of filling and insulation. Add two real prepared connections:

| Proposed operation | Physical result |
|---|---|
| **Clean service hose @ Drinking water supply → Water filling hose** | Attach the supply end to the established fresh-water outlet. The free filling end is movable; the water system stays fixed. |
| **Water filling hose @ Unfilled insulated tank → Unheated water tank** | Fill the already insulated tank in place. |
| **Water filling hose @ Unfilled uninsulated tank → Uninsulated filled tank** | Fill first; Reflective insulation can still complete Unheated water tank afterward. |
| **Coolant tubing @ Indoor heat-recovery connection → Heat-recovery leads** | Connect the qualified supply/return pair to the provided service ports. Their free tank-end couplings are the movable item. |
| **Heat-recovery leads @ Unheated water tank → Warm water tank** | Join the already fitted coil and admit recovered process heat. The tank remains in the same place. |

The unchanged construction and insulation operations plus these replacements give nine authored recipes, with seven actions on either completed assembly route. Neither filling order requires moving the tank. The filling hose remains available between filling jobs; it is a handling tool, not part of the finished tank.

Compose the alcove so the fresh-water outlet, tank and paired heat ports have understandable positions. Show the filling hose ending above the vented tank opening, without joining the non-potable tank water back into the drinking-water circuit. The heat-recovery leads join the sealed coil, not the tank's water volume. The warm state shows the existing thermometer and closed insulation flap; avoid steam or a boiling tank. At the storm, the same tank's outdoor coil is isolated and the room-facing flap opens, as already described. Its role stays a finite supplement to the existing heater.

## Chapter 27 — Amber noon

**Original problems:** Charged essential reserve, Insulated water line and Running fuel fab are dragged into the wall-mounted Station service panel. They stand for operating switches, but their pictures depict actual installations.

Keep the panel on the wall and give the player a real reusable **Service key**, supplied with it. It fits the three existing control selectors. Each drag represents inserting the key, turning the selector through its prescribed operation and withdrawing the key. The key returns for reuse. This is an explicit proposed revision to the panel hardware: draw matching keyways, not the current bare toggle switches. Do not introduce different coloured keys or a matching puzzle.

Use three fixed controls within the one panel housing, each with a fixed successor at the same position:

| Proposed operation | What changes |
|---|---|
| **Service key @ Reserve power selector → Reserve power selected** | Turn the selector; show the reserve connection selected and essential loads supplied. The already charged battery module stays in its reserve bay. |
| **Service key @ Well isolation control → Well isolated and drained** | Its existing controller closes and drains the exterior line before turning tracing off. The selector and confirmation change; the actual pipe stays outside. |
| **Service key @ Fuel-plant shutdown control → Fuel plant shut down** | The plant completes its cooling/isolation sequence before disconnecting that load. The fixed control confirms completion. |

The two goals remain selecting reserve and making both exterior systems safe. All three results are required before chapter 28. Well drainage and plant shutdown may finish in either order, with their controllers retaining power until their own sequence finishes. The goal display order is not an additional action gate.

These are three operations, replacing the three current implicit slot fittings. The panel housing is scenery; its three working controls are the fixed items. Retire the old compound slots that accepted whole machines, including the later restored-power slot. The spare key is the only movable control object, and it never contains a reserve, pipe or plant.

Use a close enough panel view for three understandable targets and readable changes in the selector positions. Keep short status wording where a picture cannot distinguish safe drainage from merely switching something off. The exterior machinery need not be squeezed into this interior view. The restored state is handled by the actual reconnection in chapter 29, below.

## Chapter 29 — Sun on the floor

**Original problems:** Dust-coated solar supply is dragged onto Array cleaning bench, then the restored Station solar supply is dragged into Station service panel. The panels belong outside for both cleaning and reconnection.

Stage the chapter beside the installed array and the habitat's exterior solar inlet. Retain the same array built in chapter 2, now visibly dusty. Use a soft cleaning tool made from the existing clean cloth and steel stock; the design brief already describes this ordinary tool. Keep the electrical circuit isolated while cleaning.

| Proposed operation | Physical result |
|---|---|
| **Steel + Clean cover fabric → Soft panel brush** | Wrap fresh clean fabric around a smooth simple handle. The portable tool should read as a soft cleaning head, not a wire brush. |
| **Soft panel brush @ Dust-coated solar supply → Cleaned station solar array** | Clean the panels in place. Replace the dusty surface with the same clear cells and frame; the feed remains disconnected. |
| **Power cable @ Station solar inlet → Habitat power lead** | Connect the habitat end of the qualified feeder at its existing inlet. Its free array-end plug is the ordinary movable icon. The inlet stays fixed. |
| **Habitat power lead @ Cleaned station solar array → Station solar supply (`restored-power`)** | Complete the isolated array's normal reconnection and startup procedure. The array stays fixed; its finished artwork shows the cable reaching the established habitat inlet. |

This gives four tangible operations instead of the current cleaning move and panel fitting. Preparing the lead can happen before or after cleaning. Reconnection explicitly requires Cleaned station solar array, so it cannot bypass cleaning through an early control action.

The existing station controller performs the sequenced restart once solar power returns: warming, checking and priming the well before reopening process feeds. All shutdown goals were completed before reaching this chapter. Use Cleaned station solar array for the cleaning goal and `restored-power` for restoring operation. No service-panel token is carried to the array, and no array is carried indoors. The atmospheric processor's replenishment and brighter lamps are consequences of the restored supply, not capabilities created by the cable itself.

Remove Array cleaning bench as the required receiving surface. The previous four-slot panel no longer supplies the restart condition or the chapter 31 transfer input. If earlier control items are shown again, their operating appearances should update only after this chapter has completed—for example from chapter 30—not on arrival at the dirty-array scene.

Art must show the same outdoor panel layout in dusty, clean-but-disconnected and reconnected states. The connection can include ordinary elapsed commissioning; no live tether or extra waiting UI is needed. Retain a concise causal explanation for the restart sequence where hidden controller work cannot be shown.

## Chapter 30 — The leg that stays

**Original problem:** Replacement landing leg already includes its footing and bracing on prepared ground, then moves onto Tilted lander. Finish this construction where it stands and use the tools for the final load transfer.

Use one fixed repair worksite containing the existing lander, crib and the ground directly beneath its damaged support. The current Lander support ground and Tilted lander targets become parts of that one working view. Its successive items can retain **Prepared support ground**, **Replacement landing leg** and **Level launch platform** as findable names, but their art must register the entire changing support/vehicle view. This avoids leaving an unchanged tilted lander behind a newly created level one.

| Proposed operation | Fixed result |
|---|---|
| **Working survey excavator @ Cribbed landing platform → Prepared support ground** | Grade the intended footing clear of the loaded crib. Preserve the movable excavator. Replace the worksite state, retaining the same lander and temporary support. |
| **Steel @ Prepared support ground → Replacement landing leg** | Build and fit the braced replacement at its real joints, on the checked ceramic footing already established by the story. Keep the temporary support carrying the load. |
| **Tool kit @ Replacement landing leg → Level launch platform** | Finish the fastenings and use the spacecraft's existing service lifting equipment for the controlled load transfer. The fixed lander settles level on the completed support. |

Three operations remain. The first goal witnesses the fitted replacement, and the second witnesses the completed load transfer. The tool action cannot happen early because it requires the actual Replacement landing leg result. A tool kit is not an unexplained jack: retain the supplied service equipment in the scene/brief. The temporary crib, new footing and upper-cabin attitude must be consistent through the artwork. No standalone replacement-footing icon travels across the screen, and no second lander appears. The repaired lower stage stays on Mars at launch.

## Chapter 31 — Two tanks, two liquids

**Original problem:** the complete Station service panel, with four recorded states, is dragged onto Lander propellant service connections. The physical work is connecting the plant's two dedicated transfer lines to the spacecraft.

Introduce **Propellant transfer lines**, a supplied matched pair of insulated, keyed lines rated for their separate methane and oxygen duties. This is explicit additional equipment within the already declared qualified propellant-transfer system, not the ordinary water hose. Depict two distinct coils/connectors. The batch convention means separate members of the pair, not one unique line duplicated into both roles.

The actual completed stores have two fixed working outlets, **Methane transfer outlet** and **Oxygen transfer outlet**. These are ports on the bank built in chapter 25, not extra tanks or new supplies. Earlier goals establish production, both stores, safe shutdown, restart and the repaired lander before this chapter.

| Proposed operation | Physical result |
|---|---|
| **Propellant transfer lines @ Methane transfer outlet → Methane transfer hose** | Connect the methane line at the store. Its free spacecraft-end connector is movable. Preserve the store. |
| **Propellant transfer lines @ Oxygen transfer outlet → Oxygen transfer hose** | Prepare the separate oxygen line at its own store. Preserve that store. |
| **Methane transfer hose @ Lander propellant service connections** | Fit the fixed compound's methane connection; the qualified transfer fills that flight tank. Show its distinct hose route and level indication. |
| **Oxygen transfer hose @ Lander propellant service connections** | Fit the other connection and fill the separate oxygen tank. |

Make Lander propellant service connections a fixed compound with two matching hose slots. Completing both replaces the old **Fueled ascent tanks** goal condition. Each fitting has one result, the same receiver with its additional connection/state; it does not produce a spare pair of spacecraft tanks. Either transfer can be prepared first, but both must finish. The panel remains in the habitat, and its old four-slot compound is no longer a recipe operand.

This expands the single abstract command to four ordinary drags that show the two actual transfers. Stage the view so both store ends and the lander's service side can be understood; use the existing safe separation and actual hose routes, not an apparent common junction. Keep methane and oxygen keyed and visibly separate all the way. Show the existing tank gauges, not transparent walls or exterior copies of the internal flight tanks.

The transfer scene can show the connected hoses. The later boarding/launch view must show normal transfer isolation, disconnection and stowage completed, rather than lifting off with hoses attached. Include that routine completion in the transition; it is not another inventory puzzle or a new spacecraft.

## Coverage of the original audit

The original audit remains a record of v12 and its initial staging assumptions. In particular, this proposal makes the recovery winch portable before rigging and deliberately disconnects the retort before moving it. Those changes explain why an originally fixed operand can now move; the classification has not simply been ignored.

| Chapter | Original candidate operations covered | Proposed treatment |
|---|---:|---|
| 2 — A voice in the room | 2 | Portable reserve battery; prepared solar lead to the outdoor processor. |
| 3 — Water under the plain | 2 | Lay and insulate the fixed pipe; remove both moves of the completed line onto the processor. |
| 9 — What roots need | 1 | Hose from the fixed supply to the fixed beds' existing reservoir. |
| 16 — Across the wash | 2 | Rig a portable winch at the crossing, then move the already present rover. |
| 20 — Two gases from water | 1 | Water hose to the fixed rack. |
| 23 — The first methane | 1 | Disconnect the retort, change its insert, then fit the detached vessel to the fixed frame. |
| 24 — The water comes back | 1 | Install the small separator first, then fit manageable cooling-panel sections. |
| 25 — Two cold stores | 3 | Two prepared gas leads into a fixed two-vessel compound; remove the filled-tank merger. |
| 26 — Heat worth keeping | 3 | Filling hose for both valid orders; separate heat-recovery leads to the installed coil. |
| 27 — Amber noon | 3 | Reusable service key operates three fixed selectors. |
| 29 — Sun on the floor | 2 | Brush the outdoor array; reconnect a lead whose other end belongs to the habitat inlet. |
| 30 — The leg that stays | 1 | Build in place, then use tools and existing service equipment to transfer the load. |
| 31 — Two tanks, two liquids | 1 | Two actual dedicated transfer hoses, with their source and spacecraft ends established. |
| **Total** | **23** | Every original candidate has a proposed treatment. |

## Related staging and continuity

These are additional consequences of making the pictures depict the work. They are not extra entries retroactively added to the 23-operation audit.

| Chapter(s) | Fixed and movable roles; required revision |
|---|---|
| **1 — The wrong side of the pad** | Punctured habitat wall → Sealed habitat wall → Breathable habitat are fixed states of the one habitat. Unstable landing support → Cribbed landing platform changes the existing lander's support in place. The initial background must not contain a complete old structure underneath a second result image. Kits, cylinders, tools and steel remain movable. |
| **4 — The work of a hundred shovels** | The excavator and its assembly states remain movable vehicles. Surveyed cavern floor becomes the fixed Cleared cavern bay; the excavator survives that work. Later use of the excavator in chapters 19 and 30 follows the same convention. |
| **5 — A furnace in the sunlight** | Supported reflector is fixed as soon as built; the movable supplied Furnace receiver completes Assembled solar furnace at that site. Later Solar heating bay, Solar retort cradle and Solar cooking connection are parts of that same furnace. Material batches and their carriers remain compact movable icons. |
| **6 — Air inside the hill** | Unpadded cavern floor, Protected cavern floor, Sealed growing room, Pressurized growing room and Lit growing room form one fixed construction sequence inside the established cave. The folded pressure envelope moves before installation. Its deployed result must fit the available cave and retain the same airlock/service spine; it is not a portable second dome. |
| **7 — A bed under the hill** | Insulated berth frame, Uninsulated berth and Cave berth are fixed from their creation in the dry alcove. Mattress-first and insulation-first routes retain the same position and geometry. The mattress and insulating supplies move. |
| **8–10 — Building and planting the beds** | Keep the complete bed structure fixed from chapter 8. In chapter 10, replace the one Unfinished growing beds target with its three existing working zones: **Potato growing bay**, **Soybean growing row** and **Dry lettuce shelf**. **Foil-backed cloth @ Potato growing bay → Dark potato bay**; **Soybean seeds @ Soybean growing row → Sown soybean row**; **Clean cover fabric @ Dry lettuce shelf → Wicking lettuce bed**. The existing potato/lettuce planting steps then follow. Each result replaces only its own fixed zone. The reservoir and other zones survive. |
| **11 — The first green** | Sown lettuce tray remains rooted in the farm; the basket moves to it. The present habitat-kitchen background would relocate the entire bed when it becomes fixed. Stage the chapter in the farm's dry occupied alcove with the established ordinary food bowl/clean utensils as a Clean preparation basin. Fresh wash water comes from the inlet upstream of the nutrient loop. Replace the Clean preparation sink working surface accordingly; do not paint another plumbed kitchen or move the crop to the habitat. The meal and its meaning remain. |
| **12 — Under the leaves** | Low-sided potato bed → Extended potato bed → Hilled potato bed changes the same fixed potato zone. Sown soybean row → Supported soybean row changes the adjacent fixed crop. Medium, cloth and mesh are the movable supplies. The background must already show the planted room, not chapter 8's empty beds. |
| **13–15, 17–18 — Specimen and field-case work** | Keep the actual membrane holder, core liners, refrigeration insert and transferable case movable through their handling steps; microscopes, freezers and preparation enclosures are fixed apparatus. Stored source core must depict the transferable sealed liner/carrier, not the entire laboratory freezer. Temporary storage alone does not require a fixed declaration. Mounting the field case in chapter 15 must show it on the existing rover deck, not beside another empty painted mount. Chapter 16 carries that same case; chapter 17 returns it. |
| **19 and 21 — Footing and industrial equipment** | The left Solar-array footing transforms into Industrial solar supply when modules are dropped on it. The separate right Fuel-fab area becomes Fuel-fab footing, then Iron process frame. Each result stays at its actual receiver. All machines stand outdoors on their individual supports; there is no workshop shelter. |
| **22 — From the thin air** | Gas cylinders are movable and collect carbon dioxide at the fixed takeoff on the same outdoor atmospheric processor. This already has the right physical gesture; preserve the visible distinction between its CO₂ takeoff, breathing oxygen and exhaust. |
| **28 — Keep the roots alive** | Farm thermal screen is movable cloth until fitted; Screened growing area is the fixed installed screen. Shared nutrient reservoir → Covered nutrient reservoir → Insulated nutrient reservoir changes the existing tank under the beds. Show the existing heat tank isolated with its flap open on arrival, as part of routine storm preparation, without creating another tank or blocking the aerated return. |
| **32–33 — Cooking and harvest** | The pot and food remain movable; temporary use of the furnace connection does not permanently fix the pot. The three harvest zones remain the actual fixed plants. Rewrite **Drinking water supply + Dry soybeans → Soaked soybeans** as **Dry soybeans @ Drinking water supply → Soaked soybeans** at the established fresh-water/food-preparation outlet, using the ordinary bowl. The source remains fixed; soaked beans move. Keep food water separate from the nutrient reservoir and non-potable heat tank. |
| **34 — The things we take** | The scene is inside the cabin. Water-source core cradle, Remote-band core cradle and Flight specimen locker each receive their own actual specimen and transform into its fixed stowed state. The three drags work in any order. Qualified cold transfer and refrigeration hookup are included; no carrier assembly or exterior hull-loading step remains. |
| **35–36 — Launch and rendezvous** | Arming plug moves to the fixed Flight console. Replace the floating Rising cabin result with a fixed cockpit/ascent state: the real display and view show departure, while the repaired ground support stays behind. A proposed result name is Ascent underway. The next scene remains the existing orbital rendezvous and handoff. No second portable spacecraft is created inside the cockpit. |

For the chapter 10 zone split, use fixed subregions of the existing structure with matching artwork, not three extra freestanding beds. These are working parts of one construction, just as the two transfer outlets are working parts of one storage bank.

## Supply, dependency and art checks

The new actions need a small number of explicit portable identities. Beyond the original 45 inventory primitives, the proposals introduce Reserve battery, Expedition rover, Service key and Propellant transfer lines as gameplay supplies. On that comparable inventory measure, this gives **49 before reconciling replaced declarations**; the first two make already established equipment explicit, and the latter two expose specified control/transfer hardware. Derived brushes, prepared leads, disconnected retort and cooling sections are not additional primitive supplies.

The unified model will also treat existing terrain and working surfaces as items; v11 counted those separately as hotspots. Its raw primitive-identity count will therefore not be directly comparable to 45. Reconcile that counting rule and recount the actual revised manuscript before claiming compliance with the user's maximum of 50. Keep the delivered inventory explicit, including fixed supplied machines; do not hide new equipment under Hotspots to evade the limit. The figure above is a supply-planning comparison, not a parser result.

The gas-control stock's qualified service tails, the winch's portable power package, the removable retort/carrier and the panel's key-operated selectors are explicit proposed equipment changes or clarifications. Put them in the revised design brief and catalogue before drawing. Do not quietly invent them in images. Distinguish rated gas/cryogenic lines from water hose and heat-recovery tubing; no generic cable may stand for all four.

Before artwork production, draw each affected chapter's start and successive results as one scene plan. Check that every operation has a visible movable input, a physically meaningful receiver, one logical result, an explicit fate for any replaced fixed object, and a place for any new fixed construction. Keep surviving endpoints and neighboring structures. Check especially:

- The solar restart requires the cleaned array; it is not enabled merely by a later goal label.
- The gas leads require their actual commissioned sources, and the two stores cannot complete until both dedicated feeds exist.
- Cooling and water recovery precede purified output; the hydrogen/oxygen circuits and all water/coolant circuits remain distinct.
- Retort disconnection is available after its mineral task and leaves the receiver empty; fitting it elsewhere does not duplicate it.
- Both heat-tank filling orders and both independent cryogenic/transfer orders reach the same completed physical arrangement.
- The final lander load transfer requires the fitted brace; final flight work requires the completed repair and both actual propellants.
- A result that changes a whole structure must replace that structure's artwork. A new pipe or fitted component must not redraw a second surviving endpoint.

The current format's hotspot-count limit needs review as part of implementing the proposed fixed-item model: successive states, visible subparts and installed results are no longer equivalent to separate permanent workstations. Resolve the rule in the specification and authoring guidance, alongside item availability, retirement, compounds and placement. These proposals do not silently override the current linter.

Implementation and current verification are recorded in [fixed-item production](../production/v12/fixed-items/README.md). Historical proposed counts above are not measurements of the current unified item model.
