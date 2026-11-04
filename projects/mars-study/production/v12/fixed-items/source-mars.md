# Mars: A Place That Can Endure

A hard landing, a home beneath the rock, and a discovery worth bringing back.

> NOTE: Illustrated v12. Read design-brief.md for equipment provenance, explicit future/site assumptions and research boundaries. Same spacecraft cabin, farm, crop stands and three specimens retain their physical identities. Fixed equipment may be represented by its later working surface. Artwork carries visible construction and scene changes; prose retains causes, voices and evidence limits.

## The wrong side of the pad

![The wrong side of the pad](assets/backgrounds/crash-apron.webp)

My suit is holding, and the cabin still holds air. The emergency rack is within reach, but I need stable support before I climb back aboard for the main supplies.

> NOTE: A recoverable hard landing occurred outside the intended landing area; plume-driven ejecta damaged the starter habitat. The suit and lander cabin allow deliberate work. The lower stage remains on Mars; the same upper crew cabin returns to orbit. The repair kit, tool and expendable cargo braces are accessible from the ground-level emergency rack. Stable temporary cribbing is needed before repeated boarding and heavy unloading; it prevents further settling and protects the same cabin needed for return. It is not an improvised repair to a flight engine or pressure vessel. Ordinary inspection and repair procedures are bundled. Material stocks represent quantities without accounting.

**Goals**
- Seal and refill the habitat -- Breathable habitat
- next: Make the lander safe to board -- Cribbed landing platform

**Hotspots**
- Punctured habitat wall (at 32.5%, 30.5%)
  - icon: ![Punctured habitat wall](assets/hotspots/punctured-habitat-wall.png)
  > NOTE: Mars v12 artwork target: Actual torn cream pressure wall with small rock puncture; repair receives onto this surface. Centre 32.5%, 30.5%; transparent hit area 80 × 80px at 390 × 844.
- Unstable landing support (at 80%, 35%)
  - icon: ![Unstable landing support](assets/hotspots/unstable-landing-support.png)
  > NOTE: Mars v12 artwork target: Folded lower leg and contact area below low side of intact upper cabin. Centre 80%, 35%; transparent hit area 80 × 92px at 390 × 844.

**Items**
- Punctured habitat wall
- Unstable landing support
- Pressure patch kit
  - icon: ![Pressure patch kit](assets/items/pressure-patch-kit.png)

  A clamped repair rated to hold pressure across a small puncture.

- Breathing-gas supply
  - icon: ![Breathing-gas supply](assets/items/breathing-gas-supply.png)

  Separate cylinders fill the habitat and farm; the farm will not drain the cabin.

- Tool kit
  - icon: ![Tool kit](assets/items/tool-kit.png)

  Cutting, drilling, fastening and forming tools for steel and tubing. Kept separate from food utensils and specimen equipment.

- Shipping braces
  - icon: ![Shipping braces](assets/items/shipping-braces.png)

  Expendable cargo bracing, separate from the spacecraft structure.

- Sealed habitat wall
  - icon: ![Sealed habitat wall](assets/items/sealed-habitat-wall.png)

  The ticking leak stops.

- Breathable habitat
  - icon: ![Breathable habitat](assets/items/breathable-habitat.png)

  The pressure holds. The heater and scrubber are on emergency power. I can take off my helmet.

- Steel
  - icon: ![Steel](assets/items/steel.png)

  Low-carbon steel, salvaged from the expendable shipping braces.

- Cribbed landing platform
  - icon: ![Cribbed landing platform](assets/items/cribbed-landing-platform.png)

  The low side no longer shifts beneath me. I can board for the main supplies. Inspection confirms the upper cabin, tanks and engine mounts are intact; the flight manual permits a permanent repair to this grounded support.

**Combinations**
- Pressure patch kit [consume] @ Punctured habitat wall -> Sealed habitat wall (tutorial)
- Breathing-gas supply [consume] + Sealed habitat wall [transform] -> Breathable habitat
- Tool kit + Shipping braces [transform] -> Steel
- Steel [consume] @ Unstable landing support -> Cribbed landing platform


## A voice in the room

![A voice in the room](assets/backgrounds/habitat-power-wall.webp)

The array's cells survived. Above the silent radio, the message schedule shows the first call I missed.

> NOTE: The first pressure fill uses delivered breathing gas; the processor subsequently replenishes oxygen without replacing the required buffer gas. Its protected outdoor package combines selective carbon-dioxide capture/compression and an oxygen-producing electrochemical stage. A separately controlled takeoff upstream of that stage can later supply carbon dioxide without mixing it with the carbon-monoxide exhaust or interrupting the breathing-oxygen branch. This scalable future unit has the capacity stated in the brief. The reserve, heaters, scrubbers and radio belong to the delivered station. The main array supports farm and baseline life support; expansion panels later support industry. No live Earth reply directs the opening emergency.

**Goals**
- Restore power and the reserve -- Charged essential reserve
- next: Replenish the breathing oxygen -- Working atmospheric processor
- next: Hear from Earth -- Surface radio

**Hotspots**
- Reserve charging connection (at 22%, 29%)
  - icon: ![Reserve charging connection](assets/hotspots/reserve-charging-connection.png)
  > NOTE: Mars v12 artwork target: Fixed keyed electrical inlet on delivered essential-power reserve cabinet. Centre 22%, 29%; transparent hit area 80 × 96px at 390 × 844.
- Radio mount (at 75%, 30%)
  - icon: ![Radio mount](assets/hotspots/radio-mount.png)
  > NOTE: Mars v12 artwork target: Empty radio/antenna interface fixed to habitat structure. Centre 75%, 30%; transparent hit area 100 × 78px at 390 × 844.

**Items**
- Reserve charging connection
- Radio mount
- Delivered solar array
  - icon: ![Delivered solar array](assets/items/delivered-solar-array.png)

  The main array was sized for the farm, cabin and workshop. Its cells survived the landing.

- Power cable
  - icon: ![Power cable](assets/items/power-cable.png)

  Qualified outdoor cable with the mission equipment's matching connectors.

- Atmospheric processor
  - icon: ![Atmospheric processor](assets/items/atmospheric-processor.png)

  One unit captures carbon dioxide and makes oxygen. A separate takeoff draws captured gas before it reaches the oxygen cell.

- Bent antenna
  - icon: ![Bent antenna](assets/items/bent-antenna.png)

  The cable survived; the bent support prevents aiming the dish.

- Standing solar array
  - icon: ![Standing solar array](assets/items/standing-solar-array.png)

- `station-power` Station solar supply
  - icon: ![Station solar supply](assets/items/station-power.png)
  - from chapter "Sun on the floor" icon: ![Dust-coated station array](assets/items/station-power-dusty.png)
  - from chapter "Sun on the floor": Dust-coated solar supply

  I bring the rack online. Inside the habitat, the charge light comes on.

- Charged essential reserve
  - icon: ![Charged essential reserve](assets/items/charged-essential-reserve.png)

  The battery and regenerative fuel-cell reserve begins charging. It can carry air handling, reduced heat and laboratory refrigeration through a planned interruption. Industry will have to stop.

- Working atmospheric processor
  - icon: ![Working atmospheric processor](assets/items/working-atmospheric-processor.png)

  Heat and electricity split captured carbon dioxide. Clean oxygen feeds the breathing reserve; waste carbon monoxide vents outside. Stored gas got me inside. This machine can replenish its oxygen.

- Straightened antenna
  - icon: ![Straightened antenna](assets/items/straightened-antenna.png)

- Surface radio
  - icon: ![Surface radio](assets/items/surface-radio.png)

  “Mara here, surface support. We saw the touchdown trace. That was much closer to the habitat than planned.” It is a recorded message. I send the steady air reading. “I'm inside. I'm all right.”


**Combinations**
- Steel [consume] + Delivered solar array [transform] -> Standing solar array
- Power cable [consume] + Standing solar array [transform] -> `station-power`
- `station-power` @ Reserve charging connection -> Charged essential reserve
- `station-power` + Atmospheric processor [transform] -> Working atmospheric processor
- Tool kit + Bent antenna [transform] -> Straightened antenna
- Straightened antenna [consume] @ Radio mount -> Surface radio


## Water under the plain

![Water under the plain](assets/backgrounds/well-treatment.webp)

*Mara, Earth — recorded message:*

“The supply ship carries your normal ascent propellant. Stored meals cover commissioning and interruptions; the growing room is meant to supply a substantial share of your food. Establish the well and treatment line first.”

> NOTE: The processor is delivered precision equipment with validated treatment and feed-polishing functions. A cloth or heating alone does not make Martian water potable. The later specimen comes from this raw intake, never the Earth-crop loop. The internal tank provides drinking water during exterior shutdown.

**Goals**
- Bring water through treatment -- Drinking water supply
- next: Protect the exterior run -- Insulated water line

**Hotspots**
- Surveyed ice bore (at 23%, 39%)
  - icon: ![Surveyed ice bore](assets/hotspots/surveyed-ice-bore.png)
  > NOTE: Mars v12 artwork target: Precursor bore casing on accessible shallow ice deposit, before melt head installation. Centre 23%, 39%; transparent hit area 88 × 58px at 390 × 844.
- Water processor (at 64%, 32%)
  - icon: ![Water processor](assets/hotspots/water-processor.png)
  > NOTE: Mars v12 artwork target: Protected treatment cabinet’s raw-water receiving service connection. Centre 64%, 32%; transparent hit area 130 × 116px at 390 × 844.

**Items**
- Surveyed ice bore
- Water processor
- Heated extraction head
  - icon: ![Heated extraction head](assets/items/heated-extraction-head.png)

  The sealed drilling and melt-water unit controls pressure underground and pumps the recovered liquid. Its service run has powered trace heating.

- Clean service hose
  - icon: ![Clean service hose](assets/items/clean-service-hose.png)

  Clean liquid-water hose. Never used for hot gas or propellants.

- Packing foil
  - icon: ![Packing foil](assets/items/packing-foil.png)

  Reflective cargo laminate redirects heat or light; it cannot create either.

- Insulation felt
  - icon: ![Insulation felt](assets/items/insulation-felt.png)

  Keep its loose fibres outside food, roots and sample containment.

- Sealed melt well
  - icon: ![Sealed melt well](assets/items/sealed-melt-well.png)

  Beneath the sealed cover, the heater opens a liquid pocket. Cloudy water rises through the closed system.

- Connected well line
  - icon: ![Connected well line](assets/items/connected-well-line.png)

  Brown grit gathers at the raw-water strainer, upstream of every drinking tap and crop bed.

- Drinking water supply
  - icon: ![Drinking water supply](assets/items/drinking-water-supply.png)

  Treatment removes suspended and dissolved contaminants and checks its output. I fill the habitat buffer tank. The first cup tastes of almost nothing.

- Reflective insulation
  - icon: ![Reflective insulation](assets/items/reflective-insulation.png)

- Insulated water line
  - icon: ![Insulated water line](assets/items/insulated-water-line.png)

  Insulation slows heat loss. The powered tracing still supplies the heat.

**Combinations**
- Heated extraction head [consume] @ Surveyed ice bore -> Sealed melt well
- Clean service hose [consume] + Sealed melt well [transform] -> Connected well line
- Connected well line @ Water processor -> Drinking water supply
- Packing foil [consume] + Insulation felt [consume] -> Reflective insulation
- Reflective insulation [consume] + Connected well line [transform] -> Insulated water line
- Insulated water line @ Water processor -> Drinking water supply


## The work of a hundred shovels

![The work of a hundred shovels](assets/backgrounds/cavern-infill.webp)

The surveyed cave is a short walk from the habitat. Clearing its loose infill is work for the excavator.

> NOTE: The cave and nearby layered ice are a favorable invented site inspected by precursor robots. This machine moves loose infill and grades ground; no improvised unsupported tunnelling. Excavated regolith later denotes selected material from its actual spoil pile. The chassis's charging connection is part of the assembled machine. The hopper can be fitted before or after the lead is connected; the drum stays stopped during fabrication. Both preparations precede the startup test and digging.

**Goals**
- Put the excavator to work -- Working survey excavator
- next: Clear the surveyed growing bay -- Cleared cavern bay

**Hotspots**
- Surveyed cavern floor (at 50%, 31%)
  - icon: ![Surveyed cavern floor](assets/hotspots/surveyed-cavern-floor.png)
  > NOTE: Mars v12 artwork target: Loose infill covering the surveyed sound-rock bay; not the ceiling or wall. Centre 50%, 31%; transparent hit area 250 × 100px at 390 × 844.

**Items**
- Surveyed cavern floor
- Survey excavator without a hopper
  - icon: ![Survey excavator without a hopper](assets/items/survey-excavator-without-a-hopper.png)

  A delivered machine for loose infill, with motors, controls and tested load limits. It cannot tunnel through solid rock.

- Excavator with spoil hopper (exclusive with Powered excavator without a hopper)
  - icon: ![Excavator with spoil hopper](assets/items/excavator-with-spoil-hopper.png)

- Powered excavator without a hopper (exclusive with Excavator with spoil hopper)
  - icon: ![Powered excavator without a hopper](assets/items/powered-excavator-without-a-hopper.png)

  The drum stays stopped while I work on the hopper mounts.

- Working survey excavator
  - icon: ![Working survey excavator](assets/items/working-survey-excavator.png)

  The unloaded test passes: drum, tracks and hopper are ready for the surveyed floor.

- Cleared cavern bay
  - icon: ![Cleared cavern bay](assets/items/cleared-cavern-bay.png)

  There is shelter here, but no air I can breathe.

**Combinations**
- Steel [consume] + Survey excavator without a hopper [transform] -> Excavator with spoil hopper
- Power cable [consume] + Excavator with spoil hopper [transform] -> Working survey excavator
- Power cable [consume] + Survey excavator without a hopper [transform] -> Powered excavator without a hopper
- Steel [consume] + Powered excavator without a hopper [transform] -> Working survey excavator
- Working survey excavator @ Surveyed cavern floor -> Cleared cavern bay


## A furnace in the sunlight

![A furnace in the sunlight](assets/backgrounds/workshop-commissioning.webp)

The mission came to test what this ground could become. The excavator has already brought the first material to the workshop.

> NOTE: The cells, optical surfaces, controls and refractory receiver are imported. Steel supply their mounting structure. Surveyed feedstock performance and the compact workshop's material cycles are declared future capabilities, not demonstrations that arbitrary Martian dust is suitable. The furnace becomes Solar heating bay in later chapters.

**Goals**
- Build the solar furnace -- Assembled solar furnace
- Prepare a formed feedstock -- Unfired regolith blanks

**Hotspots**
- Workshop press (at 77%, 24%)
  - icon: ![Workshop press](assets/hotspots/workshop-press.png)
  > NOTE: Mars v12 artwork target: Actual fixed workshop press throat and supported work surface. Centre 77%, 24%; transparent hit area 104 × 80px at 390 × 844.

**Items**
- Workshop press
- Reflector petals
  - icon: ![Reflector petals](assets/items/reflector-petals.png)

  Factory-made optical surfaces focus sunlight on the receiver.

- Furnace receiver
  - icon: ![Furnace receiver](assets/items/furnace-receiver.png)

  The factory core includes tracking and temperature control. It accepts the retort and has a separate conductive heating connection.

- Fine screening mesh
  - icon: ![Fine screening mesh](assets/items/fine-screening-mesh.png)

  Finer than the structural cargo mesh.

- Excavated regolith
  - icon: ![Excavated regolith](assets/items/excavated-regolith.png)

  Selected batches from the spoil pile, matched to the precursor mineral survey.

- Supported reflector
  - icon: ![Supported reflector](assets/items/supported-reflector.png)

- Assembled solar furnace
  - icon: ![Assembled solar furnace](assets/items/assembled-solar-furnace.png)

  The temperature rises. The red ground has supplied no fuel for this heat; the Sun has.

- Regolith sieve
  - icon: ![Regolith sieve](assets/items/regolith-sieve.png)

- Screened regolith
  - icon: ![Screened regolith](assets/items/screened-regolith.png)

  Even grain sizes give the workshop a consistent feedstock.

- Unfired regolith blanks
  - icon: ![Unfired regolith blanks](assets/items/unfired-regolith-blanks.png)

  Pressing gives shape, not finished strength. These weak blanks stay on their carriers until firing bonds the grains.

**Combinations**
- Steel [consume] + Reflector petals [consume] -> Supported reflector
- Furnace receiver [consume] + Supported reflector [transform] -> Assembled solar furnace
- Fine screening mesh [consume] + Steel [consume] -> Regolith sieve
- Excavated regolith [consume] + Regolith sieve [preserve] -> Screened regolith
- Screened regolith [consume] @ Workshop press -> Unfired regolith blanks


## Air inside the hill

![Air inside the hill](assets/backgrounds/cavern-threshold.webp)

The rock will shield thirty square metres of farm. The air must come with us.

> NOTE: The imported enclosure contains its attached airlock, pressure-rated service spine, air handling and heater; these are one real deployable assembly. Initial filling uses separate cylinders from the delivered breathing-gas bank. The supporting floor, padding and farm are locally constructed. The supplied furnace carriers support pressed powder blanks until the site-specific firing process makes non-pressure ceramic blocks. Their useful performance remains an explicit material assumption.

**Goals**
- Give the liner a safe floor -- Protected cavern floor
- next: Make an inhabited, illuminated room -- Lit growing room

**Hotspots**
- Solar heating bay (at 27%, 28%)
  - icon: ![Solar heating bay](assets/hotspots/solar-heating-bay.png)
  > NOTE: Mars v12 artwork target: Established receiver/work cradle of the solar furnace, in sunlight. Centre 27%, 28%; transparent hit area 90 × 100px at 390 × 844.
- Cleared growing bay (at 72%, 28%)
  - icon: ![Cleared growing bay](assets/hotspots/cleared-growing-bay.png)
  > NOTE: Mars v12 artwork target: Actual levelled bare cavern floor beneath protective rock roof. Centre 72%, 28%; transparent hit area 118 × 100px at 390 × 844.

**Items**
- Solar heating bay
- Cleared growing bay
- Clean cover fabric
  - icon: ![Clean cover fabric](assets/items/clean-cover-fabric.png)

  Fresh pieces serve each job. Food cloth never returns from industrial work.

- Folded pressure envelope
  - icon: ![Folded pressure envelope](assets/items/folded-pressure-envelope.png)

  An imported pressure boundary with its own airlock, air handling and heater. The floor, beds and services must be built here.

- Grow-light rails
  - icon: ![Grow-light rails](assets/items/grow-light-rails.png)

  The original array was sized for these lamps. No sunlight reaches the beds through the rock.

- Ceramic blocks
  - icon: ![Ceramic blocks](assets/items/ceramic-blocks.png)

  The checked fired batch can make paving and supports. It will never have to hold an atmosphere.

- Unpadded cavern floor
  - icon: ![Unpadded cavern floor](assets/items/unpadded-cavern-floor.png)

  The level floor carries the load. Its hard edges still need padding beneath the pressure skin.

- Padded underlay
  - icon: ![Padded underlay](assets/items/padded-underlay.png)

- Protected cavern floor
  - icon: ![Protected cavern floor](assets/items/protected-cavern-floor.png)

- Sealed growing room
  - icon: ![Sealed growing room](assets/items/sealed-growing-room.png)

  Imported seals hold the air; local blocks carry the weight.

- Pressurized growing room
  - icon: ![Pressurized growing room](assets/items/pressurized-growing-room.png)

  The leak check holds. I step through the airlock into a room broad enough to walk across.

- Lit growing room
  - icon: ![Lit growing room](assets/items/lit-growing-room.png)

  Air circulates, the heater starts, and the lamp drivers come online. The original array was sized for this load.

**Combinations**
- Unfired regolith blanks [consume] @ Solar heating bay -> Ceramic blocks
- Ceramic blocks [consume] @ Cleared growing bay -> Unpadded cavern floor
- Insulation felt [consume] + Clean cover fabric [consume] -> Padded underlay
- Padded underlay [consume] + Unpadded cavern floor [transform] -> Protected cavern floor
- Folded pressure envelope [consume] + Protected cavern floor [transform] -> Sealed growing room
- Breathing-gas supply [consume] + Sealed growing room [transform] -> Pressurized growing room
- Grow-light rails [consume] + Pressurized growing room [transform] -> Lit growing room


## A bed under the hill

![A bed under the hill](assets/backgrounds/growing-room-empty.webp)

I can sleep beneath the rock. The laboratory can stay in the repaired starter habitat.

> NOTE: The same starter-habitat mattress moves into a dry occupied alcove of the already pressurized and heated cave enclosure. The alcove has normal ventilation and separation from the future wet growing area. The berth uses the earlier steel, insulation and ordinary joining tools; it does not depend on the later process-heat installation. Mattress-first and insulation-first assembly are equally valid: the open raised frame lets insulation be fitted beneath the deck afterward. The two intermediate states are exclusive routes to the same berth.

**Goals**
- Make a sheltered berth -- Cave berth

**Items**
- Cabin mattress
  - icon: ![Cabin mattress](assets/items/cabin-mattress.png)

  The original mattress from the starter habitat.

- Insulated berth frame (exclusive with Uninsulated berth)
  - icon: ![Insulated berth frame](assets/items/insulated-berth-frame.png)

- Uninsulated berth (exclusive with Insulated berth frame)
  - icon: ![Uninsulated berth](assets/items/uninsulated-berth.png)

- Cave berth
  - icon: ![Cave berth](assets/items/cave-berth.png)

  Warm air reaches the alcove. I put my boots underneath and stretch out; beyond the partition, the lamps shine on an empty floor.

**Combinations**
- Steel [consume] + Reflective insulation [consume] -> Insulated berth frame
- Cabin mattress [consume] + Insulated berth frame [transform] -> Cave berth
- Steel [consume] + Cabin mattress [consume] -> Uninsulated berth
- Reflective insulation [consume] + Uninsulated berth [transform] -> Cave berth


## One room for roots

![One room for roots](assets/backgrounds/growing-room-empty.webp)

Potatoes and soybeans for substantial meals; a smaller tray of lettuce for something fresh. All three will share one water circuit.

> NOTE: Growing-room floor is the actual protected floor inside the pressure enclosure. All three beds are made together and share one reservoir, dosing pump and aerated return. After lining, the reservoir can be mounted before or after the bed drain hoses are fitted. The same hose lengths complete the return; positioning their outlet above the reservoir waterline provides aeration without a second hose-preparation puzzle. Liners are generic sheet fitted to these structures; ordinary fittings and joining tools are included with their real assemblies. The existing dehumidifier sends condensate through the station processor, not directly onto the roots.

**Goals**
- Line the shared bed structure -- Beds with unconnected drains
- next: Return water through an aerated reservoir -- Empty growing beds

**Hotspots**
- Growing-room floor (at 50%, 43%)
  - icon: ![Growing-room floor](assets/hotspots/growing-room-floor.png)
  > NOTE: Mars v12 artwork target: Protected flat floor inside the inflated, lit pressure enclosure. Centre 50%, 43%; transparent hit area 240 × 92px at 390 × 844.

**Items**
- Growing-room floor
- Food-safe liner sheet
  - icon: ![Food-safe liner sheet](assets/items/food-safe-liner-sheet.png)

  Food-compatible waterproof sheet from the growing supplies.

- Reservoir and irrigation pump
  - icon: ![Reservoir and irrigation pump](assets/items/reservoir-and-irrigation-pump.png)

  One circulation and dosing system serves the three growing zones, with a low-power backup.

- Raised bed frames
  - icon: ![Raised bed frames](assets/items/raised-bed-frames.png)

- Beds with unconnected drains
  - icon: ![Beds with unconnected drains](assets/items/beds-with-unconnected-drains.png)

  The frames carry the load; the liner holds the solution.

- Beds with loose drain hoses (exclusive with Beds with unconnected reservoir)
  - icon: ![Beds with loose drain hoses](assets/items/beds-with-loose-drain-hoses.png)

- Beds with unconnected reservoir (exclusive with Beds with loose drain hoses)
  - icon: ![Beds with unconnected reservoir](assets/items/beds-with-unconnected-reservoir.png)

- Empty growing beds
  - icon: ![Empty growing beds](assets/items/empty-growing-beds.png)

  Returning water falls through air, mixing in oxygen before the pump sends it back to the roots. Each zone keeps its own depth and flow adjustment.

**Combinations**
- Steel [consume] @ Growing-room floor -> Raised bed frames
- Food-safe liner sheet [consume] + Raised bed frames [transform] -> Beds with unconnected drains
- Clean service hose [consume] + Beds with unconnected drains [transform] -> Beds with loose drain hoses
- Reservoir and irrigation pump [consume] + Beds with loose drain hoses [transform] -> Empty growing beds
- Reservoir and irrigation pump [consume] + Beds with unconnected drains [transform] -> Beds with unconnected reservoir
- Clean service hose [consume] + Beds with unconnected reservoir [transform] -> Empty growing beds


## What roots need

![What roots need](assets/backgrounds/farm-service-alcove.webp)

Roots need air as well as water. Local ceramic can leave space for both.

> NOTE: The wash bench is the processor’s horticultural attachment. Washing and leach checks qualify this fictional surveyed batch; untreated regolith is not declared suitable growing soil. Ordinary mineral nutrient provision is implicit in the delivered growing system. Chosen crop varieties share compatible conditions. The fixed thirty-square-metre room supplies a substantial dietary share with the stated light and reserve food, not complete nutritional independence.

**Goals**
- Fill the beds with clean porous medium -- Unwatered growing beds
- next: Water the beds through the shared loop -- Irrigated growing beds

**Hotspots**
- Root-medium wash bench (at 32%, 29.5%)
  - icon: ![Root-medium wash bench](assets/hotspots/root-medium-wash-bench.png)
  > NOTE: Mars v12 artwork target: Fixed horticultural wash trough with drain and leach-check instrument. Centre 32%, 29.5%; transparent hit area 140 × 80px at 390 × 844.

**Items**
- Root-medium wash bench
- Growing medium
  - icon: ![Growing medium](assets/items/growing-medium.png)

  I wash dust and sharp fines from the broken ceramic. The leach check passes for this surveyed material. Gaps between the granules give roots both drainage and air.

- Unwatered growing beds
  - icon: ![Unwatered growing beds](assets/items/unwatered-growing-beds.png)

- Irrigated growing beds
  - icon: ![Irrigated growing beds](assets/items/irrigated-growing-beds.png)

  The deep beds drain back to the reservoir. Water reaches the lettuce inlet below its dry shelf; a wick must draw it upward.

**Combinations**
- Ceramic blocks [consume] @ Root-medium wash bench -> Growing medium
- Growing medium [consume] + Empty growing beds [transform] -> Unwatered growing beds
- Drinking water supply + Unwatered growing beds [transform] -> Irrigated growing beds


## Potatoes, soybeans, lettuce

![Potatoes, soybeans, lettuce](assets/backgrounds/growing-room-unplanted.webp)

Keep the developing potatoes dark and the leaves in the light. The shallow lettuce shelf needs a wick to reach its water.

> NOTE: Unfinished growing beds is the shared construction from the previous chapter: the reservoir and deep root zones have water, while the shallow lettuce shelf still needs its wick. Each planting uses its own existing zone, not a copied array of beds. The deep potato bay and shallow lettuce tray are prepared once; the soybean row already has the appropriate aerated medium. Crop identity persists through tending, storm and harvest. Foliage remains illuminated.

**Goals**
- (three goals are a lot but okay here because each of the three established crop zones has its own planting task)
- Plant the potatoes -- `potato-bed`
- Plant the soybeans -- `soybean-row`
- Plant the early leaves -- `lettuce-tray`

**Hotspots**
- Unfinished growing beds (at 50%, 40%)
  - icon: ![Unfinished growing beds](assets/hotspots/unfinished-growing-beds.png)
  > NOTE: Mars v12 artwork target: One integrated three-zone irrigated bed system, with bare potato root zone and dry lettuce shelf. Centre 50%, 40%; transparent hit area 300 × 140px at 390 × 844.

**Items**
- Unfinished growing beds
- Seed potatoes
  - icon: ![Seed potatoes](assets/items/seed-potatoes.png)

  Certified sprouting tubers, with room for new potatoes beneath the foliage.

- Soybean seeds
  - icon: ![Soybean seeds](assets/items/soybean-seeds.png)

  A compact cultivar suited to this room. The nutrient solution supplies its nitrogen.

- Lettuce seeds
  - icon: ![Lettuce seeds](assets/items/lettuce-seeds.png)

  A quick fresh-leaf crop for the shallow tray.

- Foil-backed cloth
  - icon: ![Foil-backed cloth](assets/items/foil-backed-cloth.png)

  The cloth protects the laminate from tearing at its folds.

- Dark potato bay
  - icon: ![Dark potato bay](assets/items/dark-potato-bay.png)

  Shoots grow in light; developing tubers stay dark.

- `potato-bed` Planted potato bed
  - icon: ![Planted potato bed](assets/items/potato-bed.png)
  - from chapter "Under the leaves" icon: ![Low-sided potato bed with tall stems](assets/items/potato-bed-grown.png)
  - from chapter "Under the leaves": Low-sided potato bed

- `soybean-row` Sown soybean row
  - icon: ![Sown soybean row](assets/items/sown-soybean-row.png)
  - from chapter "Under the leaves" icon: ![Unsupported soybean row with filling pods](assets/items/soybean-row-grown.png)

  The harvest will hang above the medium, inside pods.

- Wicking lettuce bed
  - icon: ![Wicking lettuce bed](assets/items/wicking-lettuce-bed.png)

  The fabric draws solution upward without another pump.

- `lettuce-tray` Sown lettuce tray
  - icon: ![Sown lettuce tray](assets/items/sown-lettuce-tray.png)
  - from chapter "The first green" icon: ![Lettuce tray with broad harvestable leaves](assets/items/lettuce-tray-grown.png)

**Combinations**
- Packing foil [consume] + Clean cover fabric [consume] -> Foil-backed cloth
- Foil-backed cloth [consume] @ Unfinished growing beds -> Dark potato bay
- Seed potatoes [consume] + Dark potato bay [transform] -> `potato-bed`
- Soybean seeds [consume] @ Unfinished growing beds -> `soybean-row`
- Clean cover fabric [consume] @ Unfinished growing beds -> Wicking lettuce bed
- Lettuce seeds [consume] + Wicking lettuce bed [transform] -> `lettuce-tray`


## The first green

![The first green](assets/backgrounds/habitat-kitchen.webp)

Something fresh to add to the stored meals. I need a basket that won't scrape the leaves.

> NOTE: The existing kitchen work surface supplies treated wash water and ordinary clean utensils. This first picking establishes the basket-and-crop action used again at the final harvest hotspots. The rooted lettuce remains alive.

**Goals**
- Make a lined basket for the harvest -- Lined harvest basket
- next: Taste what the growing room can do -- First fresh meal

**Hotspots**
- Clean preparation sink (at 50%, 30%)
  - icon: ![Clean preparation sink](assets/hotspots/clean-preparation-sink.png)
  > NOTE: Mars v12 artwork target: Clean food-preparation sink with treated water tap and adjacent work surface. Centre 50%, 30%; transparent hit area 230 × 72px at 390 × 844.

**Items**
- Clean preparation sink
- Cargo mesh
  - icon: ![Cargo mesh](assets/items/cargo-mesh.png)

  Structural grid for panels and plant supports, too coarse to screen regolith.

- Lined harvest basket
  - icon: ![Lined harvest basket](assets/items/lined-harvest-basket.png)

- Fresh lettuce leaves
  - icon: ![Fresh lettuce leaves](assets/items/fresh-lettuce-leaves.png)

  Their edges break with a crisp snap. I leave the small centre growing.

- First fresh meal
  - icon: ![First fresh meal](assets/items/first-fresh-meal.png)

  I wash the leaves and add them to the stored meal. A sharp green smell rises from the bowl. Beyond the airlock, the landscape has supplied no green at all.

**Combinations**
- Cargo mesh [consume] + Clean cover fabric [consume] -> Lined harvest basket
- Lined harvest basket + `lettuce-tray` [preserve] -> Fresh lettuce leaves
- Fresh lettuce leaves [consume] @ Clean preparation sink -> First fresh meal


## Under the leaves

![Under the leaves](assets/backgrounds/growing-room-empty.webp)

More medium will keep new potatoes out of the light. The filling soybean pods need support.

> NOTE: These are the same planted crop zones, not new beds. Additional washed medium comes from the earlier prepared material. The potato root zone is dark while its foliage remains lit. The chosen soybean cultivar and installation benefit from support; this is not a claim that all soybeans require trellises. No second round of shared substrate or irrigation preparation.

**Goals**
- Keep new tubers dark -- Hilled potato bed
- Support the filling pods -- Supported soybean row

**Items**
- Extended potato bed
  - icon: ![Extended potato bed](assets/items/extended-potato-bed.png)

- Hilled potato bed
  - icon: ![Hilled potato bed](assets/items/hilled-potato-bed.png)

  The added medium keeps new tubers from turning green beneath the lamps.

- Supported soybean row
  - icon: ![Supported soybean row](assets/items/supported-soybean-row.png)

**Combinations**
- Foil-backed cloth [consume] + `potato-bed` [transform] -> Extended potato bed
- Growing medium [consume] + Extended potato bed [transform] -> Hilled potato bed
- Cargo mesh [consume] + `soybean-row` [transform] -> Supported soybean row


## What the water carries

![What the water carries](assets/backgrounds/laboratory-intake.webp)

The tap coughs and stops.

> NOTE: The raw intake precedes treatment and all Earth-crop water. Its service assembly includes isolation, backflush, collection and restart controls; these ordinary operations are one complete action, not a jar magically fixing machinery. The microscope and containment are supplied laboratory equipment. The articulated ancient body is the story's extraordinary fictional premise. Morphology alone establishes neither age nor native origin.

**Goals**
- Clear the intake and restore water -- Collected intake residue
- next: Find out what blocked it -- First body on membrane

**Hotspots**
- Clogged raw-water strainer (at 33%, 25%)
  - icon: ![Clogged raw-water strainer](assets/hotspots/clogged-raw-water-strainer.png)
  > NOTE: Mars v12 artwork target: Closed inspection housing visibly clogged with brown particulate before treatment. Centre 33%, 25%; transparent hit area 85 × 105px at 390 × 844.
- Laboratory microscope (at 78%, 25%)
  - icon: ![Laboratory microscope](assets/hotspots/laboratory-microscope.png)
  > NOTE: Mars v12 artwork target: Fixed optical microscope with contained empty specimen holder. Centre 78%, 25%; transparent hit area 96 × 150px at 390 × 844.

**Items**
- Clogged raw-water strainer
- Laboratory microscope
- Laboratory membrane
  - icon: ![Laboratory membrane](assets/items/laboratory-membrane.png)

  Separates suspended particles; it does not remove dissolved salts.

- Collected intake residue
  - icon: ![Collected intake residue](assets/items/collected-intake-residue.png)

  I isolate and backflush the intake into a clean jar, then reseat the strainer and prime the line. Water returns to the tap. A few curled flecks hold their shape in the residue.

- Particle-bearing membrane
  - icon: ![Particle-bearing membrane](assets/items/particle-bearing-membrane.png)

- First body on membrane
  - icon: ![First body on membrane](assets/items/first-body-on-membrane.png)

  ![The sealed membrane under magnification](assets/items/first-body-on-membrane.png)

  I take my hands off the microscope controls. This came through the well beneath my feet. I seal the membrane in its holder and send Earth the record.

**Combinations**
- Clean service hose [consume] @ Clogged raw-water strainer -> Collected intake residue
- Laboratory membrane [consume] + Collected intake residue [transform] -> Particle-bearing membrane
- Particle-bearing membrane [transform] @ Laboratory microscope -> First body on membrane


## The ground we know

![The ground we know](assets/backgrounds/source-core-transfer.webp)

*Mara, NASA surface support — recorded message:*

“I've watched that record six times. Science wants ice that has never passed through the melter. First, a reference core beside your well, beyond the heated cavity. Then the exposed layers beyond the wash—we can choose protected ice there, away from the station.”

“The receiving laboratories can examine internal structure and chemistry that your microscope cannot resolve. Flight is looking at an earlier rendezvous.”

> NOTE: The stable margin is outside the resource well's disturbed volume. The source core preserves a reference to that deposit; the farther exposed face permits choosing material within visible stratigraphy away from station disturbance. Mapping predicts a broad promising deposit, not a microscopic body. These are separate physical specimens.

**Goals**
- Take an unmelted reference from the water source -- Sealed source core
- next: Store it before the farther expedition -- Stored source core

**Hotspots**
- Unheated bank margin (at 31%, 25%)
  - icon: ![Unheated bank margin](assets/hotspots/unheated-bank-margin.png)
  > NOTE: Mars v12 artwork target: Nearby accessible pale ice beyond the well casing and heated disturbed volume. Centre 31%, 25%; transparent hit area 140 × 100px at 390 × 844.
- Laboratory core freezer (at 76%, 25%)
  - icon: ![Laboratory core freezer](assets/hotspots/laboratory-core-freezer.png)
  > NOTE: Mars v12 artwork target: Protected indoor refrigerator’s empty whole-core cradle, not outdoor bare shelf. Centre 76%, 25%; transparent hit area 105 × 132px at 390 × 844.

**Items**
- Unheated bank margin
- Laboratory core freezer
- Core drill
  - icon: ![Core drill](assets/items/core-drill.png)

  The clean chilled barrel takes interior ice without melting it. The liner seals before leaving the barrel.

- Sealed source core
  - icon: ![Sealed source core](assets/items/sealed-source-core.png)

  Beyond the heated cavity, the brown flakes remain where the ice held them.

- Stored source core
  - icon: ![Stored source core](assets/items/stored-source-core.png)

  This core and the membrane stay in the laboratory while I go farther from the well.

**Combinations**
- Core drill @ Unheated bank margin -> Sealed source core
- Sealed source core [transform] @ Laboratory core freezer -> Stored source core


## A box for the road

![A box for the road](assets/backgrounds/rover-loading.webp)

The farther core must come back inside its original liner. Its refrigerator needs protection for the rough crossing.

> NOTE: Steel and insulation form the outer protective enclosure around qualified precision refrigeration. The same physical case remains with the rover, then goes to the laboratory's cold enclosure. This is ordinary expedition preparation, not a sample-cooling emergency.

**Goals**
- Build and mount the refrigerated field case -- Buffered field case

**Hotspots**
- Rover cargo mount (at 43%, 23%)
  - icon: ![Rover cargo mount](assets/hotspots/rover-cargo-mount.png)
  > NOTE: Mars v12 artwork target: The delivered rover’s rear receiving deck, powered socket and tie-down points. Centre 43%, 23%; transparent hit area 180 × 88px at 390 × 844.

**Items**
- Rover cargo mount
- Field refrigeration insert
  - icon: ![Field refrigeration insert](assets/items/field-refrigeration-insert.png)

  Qualified refrigeration with a shock mount and thermal buffer for transfer. Its compressor and heat-rejection face must remain exposed.

- Uninsulated field refrigerator
  - icon: ![Uninsulated field refrigerator](assets/items/uninsulated-field-refrigerator.png)

  The outer shell takes knocks; the shock mount protects the liner inside.

- Insulated field refrigerator
  - icon: ![Insulated field refrigerator](assets/items/insulated-field-refrigerator.png)

  The cold cradle is insulated without trapping the heat the refrigerator must reject.

- Buffered field case
  - icon: ![Buffered field case](assets/items/buffered-field-case.png)

**Combinations**
- Steel [consume] + Field refrigeration insert [consume] -> Uninsulated field refrigerator
- Reflective insulation [consume] + Uninsulated field refrigerator [transform] -> Insulated field refrigerator
- Insulated field refrigerator [transform] @ Rover cargo mount -> Buffered field case


## Across the wash

![Across the wash](assets/backgrounds/wash-crossing.webp)

The survey's safe approach crosses this wash. The soft middle could swallow a wheel.

> NOTE: This is a short supported crossing, not an unsupported mesh bridge. Ground preparation, anchor assessment and ordinary vehicle operation are included. No arbitrary new breakdown is introduced. The rover, power, traction and recovery hardware were delivered; the player makes useful panels from known materials. The actual refrigerated case is already aboard.

**Goals**
- Make a supported crossing -- Supported traction panels
- next: Take the rover across -- Rover beyond the wash

**Hotspots**
- Shallow wash crossing (at 32%, 27%)
  - icon: ![Shallow wash crossing](assets/hotspots/shallow-wash-crossing.png)
  > NOTE: Mars v12 artwork target: Short soft-ground section between firm, supported shallow approaches. Centre 32%, 27%; transparent hit area 160 × 70px at 390 × 844.
- Sound rock anchor (at 72%, 19%)
  - icon: ![Sound rock anchor](assets/hotspots/sound-rock-anchor.png)
  > NOTE: Mars v12 artwork target: Solid rounded outcrop on firm approach, large enough to take existing recovery sling. Centre 72%, 19%; transparent hit area 130 × 100px at 390 × 844.

**Items**
- Shallow wash crossing
- Sound rock anchor
- Rover winch
  - icon: ![Rover winch](assets/items/rover-winch.png)

  The rover's powered recovery assembly, with a rated anchor sling and rock protection.

- Framed traction panels
  - icon: ![Framed traction panels](assets/items/framed-traction-panels.png)

- Supported traction panels
  - icon: ![Supported traction panels](assets/items/supported-traction-panels.png)

  Prepared ground supports the short panels. Their rails spread wheel loads; loose mesh alone would sink.

- Anchored rover winch
  - icon: ![Anchored rover winch](assets/items/anchored-rover-winch.png)

  The assessed rock holds the pull in line with the crossing.

- Rover beyond the wash
  - icon: ![Rover beyond the wash](assets/items/rover-beyond-the-wash.png)

  On the far bank I release the line. The same supported route will carry the return trip.

**Combinations**
- Steel [consume] + Cargo mesh [consume] -> Framed traction panels
- Framed traction panels [transform] @ Shallow wash crossing -> Supported traction panels
- Rover winch [transform] @ Sound rock anchor -> Anchored rover winch
- Anchored rover winch [consume] + Supported traction panels [preserve] -> Rover beyond the wash


## A clean face

![A clean face](assets/backgrounds/layered-ice-bank.webp)

Here I can choose ice within the layer, beyond the weathered surface. The orbital survey could never show this detail.

> NOTE: The bank is low and stable, not an overhang. The supplied corer performs its ordinary surface trimming, chilled coring and containment in one substantial operation. This remote specimen remains distinct from the known-source core and first membrane.

**Goals**
- Bring back ice from within the band -- Case with frozen band core

**Hotspots**
- Sheltered brown band (at 50%, 21.5%)
  - icon: ![Sheltered brown band](assets/hotspots/sheltered-brown-band.png)
  > NOTE: Mars v12 artwork target: Continuous brown layer within low stable ice face, protected by clear ice above. Centre 50%, 21.5%; transparent hit area 290 × 90px at 390 × 844.

**Items**
- Sheltered brown band
- Sealed band core
  - icon: ![Sealed band core](assets/items/sealed-band-core.png)

  The clean head trims the weathered face before taking ice from inside the layer.

- Case with frozen band core
  - icon: ![Case with frozen band core](assets/items/case-with-frozen-band-core.png)

  I secure the case and retrace the crossing to the laboratory. This time the brown material has kept its surroundings.

**Combinations**
- Core drill @ Sheltered brown band -> Sealed band core
- Sealed band core [consume] + Buffered field case [transform] -> Case with frozen band core


## Something folded

![Something folded](assets/backgrounds/cold-laboratory.webp)

The new core is back in the laboratory. On the intake membrane, everything was flattened; here the dark fleck still has its surroundings.

> NOTE: The whole sealed core and case enter the supplied contained cold enclosure. Only an external optical face is prepared; the inclusion and surrounding layers remain intact. The future cold microscope has appropriate transmitted/reflected illumination and stage control. The articulated body is fictional and does not establish age, taxon, DNA or native origin. All sample storage remains qualified and reliable through the later storm.

**Goals**
- Make a clear view into the ice -- Windowed core case
- next: Resolve the folded outline -- Case with an articulated body

**Hotspots**
- Cold preparation enclosure (at 31%, 26%)
  - icon: ![Cold preparation enclosure](assets/hotspots/cold-preparation-enclosure.png)
  > NOTE: Mars v12 artwork target: Contained chilled preparation chamber with sealed transfer aperture. Centre 31%, 26%; transparent hit area 145 × 120px at 390 × 844.
- Cold microscope (at 75%, 24%)
  - icon: ![Cold microscope](assets/hotspots/cold-microscope.png)
  > NOTE: Mars v12 artwork target: Fixed chilled optical instrument with contained viewing stage. Centre 75%, 24%; transparent hit area 105 × 140px at 390 × 844.

**Items**
- Cold preparation enclosure
- Cold microscope
- Windowed core case
  - icon: ![Windowed core case](assets/items/windowed-core-case.png)

  Only the outer optical face is prepared. The fleck remains untouched beneath it, enclosed in its ice.

- Case with an articulated body
  - icon: ![Case with an articulated body](assets/items/case-with-an-articulated-body.png)

  ![The intact body within the banded core](assets/items/case-with-an-articulated-body.png)

  This one is whole. I keep one hand beside the case, then send the view to Earth. Both cores settle onto essential laboratory cooling; the membrane remains in its own holder.

**Combinations**
- Case with frozen band core [transform] @ Cold preparation enclosure -> Windowed core case
- Windowed core case [transform] @ Cold microscope -> Case with an articulated body


## A different use for the sunlight

![A different use for the sunlight](assets/backgrounds/fuel-fab-clearing.webp)

*Mara, Earth — recorded message:*

“The discovery takes priority over the remaining surface survey. Flight has approved a return plan, but the normal cargo delivery cannot support it. Use the workshop's local-propellant contingency. The receiving laboratories can investigate what the surface instruments cannot.”

> NOTE: This mission demonstrates a partly self-supplying station. Its modular workshop and life-support spares support a reviewed local-propellant contingency, not a supplied complete fuel plant. Normal fuel follows a slower cargo schedule. The orbital transfer vehicle and approved earlier trajectory are declared mission premises; local ascent fuel does not choose interplanetary windows. The damaged ground support is stable and its repair is known. Routine installation uses the established ceramic blocks, steel and qualified cable; these do not require another sequence of empty supports.

**Goals**
- Prepare a stable industrial site -- Fuel-fab footing
- next: Add power for making propellant -- Industrial solar supply

**Hotspots**
- Fuel-fab area (at 50%, 33%)
  - icon: ![Fuel-fab area](assets/hotspots/fuel-fab-area.png)
  > NOTE: Mars v12 artwork target: Marked undeveloped industrial plot well clear of lander, habitat entrance and existing workshop. Centre 50%, 33%; transparent hit area 280 × 110px at 390 × 844.

**Items**
- Fuel-fab area
- Spare solar modules
  - icon: ![Spare solar modules](assets/items/spare-solar-modules.png)

  Delivered for later materials-processing trials. Additional factory-made capacity.

- Fuel-fab footing
  - icon: ![Fuel-fab footing](assets/items/fuel-fab-footing.png)

  I grade the ground and lay the workshop's fired blocks beneath the equipment positions.

- Industrial solar supply
  - icon: ![Industrial solar supply](assets/items/industrial-solar-supply.png)

  The growing room keeps its allotted power. This separate circuit can work for the journey home.

**Combinations**
- Working survey excavator @ Fuel-fab area -> Fuel-fab footing
- Spare solar modules [consume] + Fuel-fab footing [preserve] -> Industrial solar supply


## Two gases from water

![Two gases from water](assets/backgrounds/fuel-fab-water.webp)

The spare electrolyzer was packed for water recovery and materials work. Now it can work for the journey home.

> NOTE: The newly assembled rack has two physically distinct, dedicated gas buffers. Its hydrogen and oxygen outlets become fixed receiving surfaces later. Gas cylinders denote a batch of real compatible clean vessels, not one bottle copied or switched between incompatible duties. Both gases are produced by one water-splitting process.

**Goals**
- Assemble the electrolysis installation -- Fed electrolyzer
- next: Collect its gases in separate circuits -- Buffered electrolysis rack

**Hotspots**
- Processor polishing outlet (at 53%, 38%)
  - icon: ![Processor polishing outlet](assets/hotspots/processor-polishing-outlet.png)
  > NOTE: Mars v12 artwork target: Clean dedicated feed-polishing service connection on the actual water processor. Centre 53%, 38%; transparent hit area 110 × 75px at 390 × 844.

**Items**
- Processor polishing outlet
- Electrolyzer stack
  - icon: ![Electrolyzer stack](assets/items/electrolyzer-stack.png)

  Electricity splits polished water. Dedicated cartridges separate liquid and dry each product gas.

- Gas-control manifold
  - icon: ![Gas-control manifold](assets/items/gas-control-manifold.png)

  Compatible factory valve and control blocks. Separate blocks serve each installation.

- Gas cylinders
  - icon: ![Gas cylinders](assets/items/gas-cylinders.png)

  Each clean cylinder has a keyed connection and stays dedicated to its own gas.

- Unfed electrolysis rack
  - icon: ![Unfed electrolysis rack](assets/items/unfed-electrolysis-rack.png)

  The stack needs the processor's polished water.

- Fed electrolyzer
  - icon: ![Fed electrolyzer](assets/items/fed-electrolyzer.png)

  Feed polishing, power and cooling are connected. The gas outlets remain separate.

- Buffered electrolysis rack
  - icon: ![Buffered electrolysis rack](assets/items/buffered-electrolysis-rack.png)

  Water splits into hydrogen and oxygen. Each gas passes through its own separator, dryer and regulator; the run stops when either buffer is full.

**Combinations**
- Gas-control manifold [consume] + Electrolyzer stack [consume] -> Unfed electrolysis rack
- Unfed electrolysis rack [transform] @ Processor polishing outlet -> Fed electrolyzer
- Gas cylinders [consume] + Fed electrolyzer [transform] -> Buffered electrolysis rack


## Metal from the red ground

![Metal from the red ground](assets/backgrounds/workshop-hydrogen.webp)

*Mara, Earth — recorded message:*

“The lab team has stopped calling it a speck. They want to see inside those folded joints without thawing away their surroundings. Keep the whole core.”

The survey found magnetic iron-bearing minerals in the spoil. Their metal can carry the reactor that will make our return fuel.

> NOTE: Hydrogen reduction and sintering have research precedents; this compact plant, separable assayed feedstock and useful consolidated product are explicit future/site assumptions. The supplied press and retort handle atmosphere, temperature, consolidation and ordinary tests. The retort remains one unique vessel; its removable mineral liner is exchanged for a clean catalyst cartridge later. Local iron is not a catalyst or pressure vessel. The receiving lab's questions maintain the discovery's purpose without an extra comparison assay.

**Goals**
- Make usable iron from the local feedstock -- Consolidated iron
- next: Make the process frame -- Iron process frame

**Hotspots**
- Workshop press (at 77%, 24%)
  - icon: ![Workshop press](assets/hotspots/workshop-press.png)
  > NOTE: Mars v12 artwork target: Actual fixed workshop press throat and supported work surface. Centre 77%, 24%; transparent hit area 104 × 80px at 390 × 844.
- Hydrogen service outlet (at 51%, 20.5%)
  - icon: ![Hydrogen service outlet](assets/hotspots/hydrogen-service-outlet.png)
  > NOTE: Mars v12 artwork target: Dedicated hydrogen regulator/outlet on completed electrolysis rack; oxygen visibly separate. Centre 51%, 20.5%; transparent hit area 90 × 72px at 390 × 844.

**Items**
- Hydrogen service outlet
- Unconnected materials retort
  - icon: ![Unconnected materials retort](assets/items/unconnected-materials-retort.png)

  A supplied pressure vessel with a removable mineral liner. Its protected carrier brings the reduced metal to the heated press.

- Separator electromagnet
  - icon: ![Separator electromagnet](assets/items/separator-electromagnet.png)

  A current-limited low-voltage supply energizes the coil. Switching it off releases the collected grains.

- Iron-rich concentrate
  - icon: ![Iron-rich concentrate](assets/items/iron-rich-concentrate.png)

  The survey assay identified useful iron-bearing minerals. The red colour alone would not tell me that.

- Hydrogen-fed retort
  - icon: ![Hydrogen-fed retort](assets/items/hydrogen-fed-retort.png)

  The sealed retort sits in the solar receiver. Heat and reducing gas now meet in the same vessel; exhaust and condensate stay contained.

- Reduced iron sponge
  - icon: ![Reduced iron sponge](assets/items/reduced-iron-sponge.png)

  Hydrogen takes oxygen from the hot minerals, leaving porous, weak metal.

- Consolidated iron
  - icon: ![Consolidated iron](assets/items/consolidated-iron.png)

  The heated press closes the pores and bonds the particles. Shaping useful parts is a separate operation.

- Iron bars and brackets
  - icon: ![Iron bars and brackets](assets/items/iron-bars-and-brackets.png)

  Non-pressure supports, not flight hardware.

- Iron process frame
  - icon: ![Iron process frame](assets/items/iron-process-frame.png)

  The precision vessel will sit in a frame made from this place.

**Combinations**
- Power cable [consume] + Steel [consume] -> Separator electromagnet
- Separator electromagnet [preserve] + Screened regolith [consume] -> Iron-rich concentrate
- Unconnected materials retort [transform] @ Hydrogen service outlet -> Hydrogen-fed retort
- Iron-rich concentrate [consume] + Hydrogen-fed retort -> Reduced iron sponge
- Reduced iron sponge [transform] @ Workshop press -> Consolidated iron
- Consolidated iron [consume] @ Workshop press -> Iron bars and brackets
- Iron bars and brackets [consume] + Fuel-fab footing [transform] -> Iron process frame


## From the thin air

![From the thin air](assets/backgrounds/atmospheric-service.webp)

The atmospheric processor has been replenishing our oxygen since the first power repair. Its capture stage already gathers the other ingredient the fuel plant needs: carbon dioxide.

> NOTE: This is the same atmospheric processor brought online during the initial power repair. Its selective capture/compression stage feeds a qualified carbon-dioxide takeoff upstream of oxygen production. Separate controlled branches maintain breathing oxygen and process feed under the declared capacity. The receiving surface becomes available for the fuel task here. Rated service plumbing is routine; no second atmospheric machine, homemade gas separator or carbon-monoxide feed is introduced.

**Goals**
- Collect carbon dioxide from the working processor -- Compressed carbon dioxide

**Hotspots**
- Atmospheric carbon-dioxide outlet (at 46%, 39%)
  - icon: ![Atmospheric carbon-dioxide outlet](assets/hotspots/atmospheric-carbon-dioxide-outlet.png)
  > NOTE: Mars v12 artwork target: Upstream carbon-dioxide takeoff on same atmospheric processor; distinct from oxygen and exhaust. Centre 46%, 39%; transparent hit area 86 × 66px at 390 × 844.

**Items**
- Atmospheric carbon-dioxide outlet
- Compressed carbon dioxide
  - icon: ![Compressed carbon dioxide](assets/items/compressed-carbon-dioxide.png)

  The takeoff collects carbon dioxide before the oxygen-making cell; the breathing line keeps running. One methane ingredient came from the well, the other from the machine that helps me breathe.

**Combinations**
- Gas cylinders [consume] @ Atmospheric carbon-dioxide outlet -> Compressed carbon dioxide


## The first methane

![The first methane](assets/backgrounds/process-court.webp)

The retort's mineral liner can be exchanged for a clean catalyst cartridge. The same vessel has another job.

> NOTE: The supplied retort, replaceable liners, catalyst and control head are deliberately compatible future service hardware, rated for these uses. The existing hydrogen connection persists into the reactor; carbon dioxide is its additional feed. This is a small contained commissioning run. Continuous production waits for purification, recycle, storage and full heat rejection. The fixed reactor remains at the process bay.

**Goals**
- Build the controlled reactor -- Controlled methane reactor
- next: Make its first contained methane -- Unpurified methane test cylinder

**Items**
- Sabatier catalyst cartridge
  - icon: ![Sabatier catalyst cartridge](assets/items/sabatier-catalyst-cartridge.png)

  Engineered nickel-based surfaces support the hydrogen–carbon-dioxide reaction. Ordinary iron ore cannot replace them.

- Catalyzed retort
  - icon: ![Catalyzed retort](assets/items/catalyzed-retort.png)

  The mineral insert leaves sealed. Nothing from the ore batch remains in the new gas path.

- Controlled methane reactor
  - icon: ![Controlled methane reactor](assets/items/controlled-methane-reactor.png)

  The controls warm the catalyst, meter both feeds and carry away reaction heat. A hot reaction needs cooling as well as a way to start.

- Unpurified methane test cylinder
  - icon: ![Unpurified methane test cylinder](assets/items/unpurified-methane-test-cylinder.png)

  The contained test stops and isolates itself. Its sensor finds methane, water vapour and unreacted gases. The fuel molecule is here; it is not ready for a rocket tank.

**Combinations**
- Sabatier catalyst cartridge [consume] + Hydrogen-fed retort [transform] -> Catalyzed retort
- Catalyzed retort [consume] + Iron process frame [transform] -> Controlled methane reactor
- Compressed carbon dioxide [preserve] + Controlled methane reactor [preserve] -> Unpurified methane test cylinder


## The water comes back

![The water comes back](assets/backgrounds/process-court.webp)

The reaction makes water as well as methane. Recovering it requires cooling; the engine also needs the other impurities removed.

> NOTE: The imported separator contains the condenser, dryer, purifier and recycle controls. The local panel spreads heat from qualified coolant tubing without becoming a pressure vessel. Its material, surface and area meet the declared workshop design under the story's site/energy assumptions; it does not rely on thin-air convection alone. The water return connects only after cooling and separation exist, and the resulting actual reactor assembly supplies continuous gas after the contained test. Ordinary flow checks are bundled.

**Goals**
- Complete the separation and water return -- Water-recovering methane reactor
- next: Feed clean methane from the actual reactor -- Purified methane supply

**Items**
- Coolant tubing
  - icon: ![Coolant tubing](assets/items/coolant-tubing.png)

  Qualified tubing keeps process coolant separate from gas and drinking water.

- Uncooled gas separator
  - icon: ![Uncooled gas separator](assets/items/uncooled-gas-separator.png)

  Condenses product water, dries and purifies methane, and returns unreacted gas.

- Process cooling panel
  - icon: ![Process cooling panel](assets/items/process-cooling-panel.png)

  Good thermal contact carries heat from the tubing to the panel. Its exposed dark faces radiate it away.

- Cooled separator module
  - icon: ![Cooled separator module](assets/items/cooled-separator-module.png)

- Purifying methane reactor
  - icon: ![Purifying methane reactor](assets/items/purifying-methane-reactor.png)

  The cooled separator condenses water, dries methane and returns unreacted gas through its own line.

- Water-recovering methane reactor
  - icon: ![Water-recovering methane reactor](assets/items/water-recovering-methane-reactor.png)

  Reaction water returns through treatment and electrolysis. It stays separate from the gas outlets.

- Purified methane supply
  - icon: ![Purified methane supply](assets/items/purified-methane-supply.png)

  The test cylinder empties through the completed equipment. The actual reactor now supplies clean methane through the same purification route.

**Combinations**
- Coolant tubing [consume] + Steel [consume] -> Process cooling panel
- Process cooling panel [consume] + Uncooled gas separator [consume] -> Cooled separator module
- Cooled separator module [consume] + Controlled methane reactor [transform] -> Purifying methane reactor
- Clean service hose [consume] + Purifying methane reactor [transform] -> Water-recovering methane reactor
- Unpurified methane test cylinder [consume] + Water-recovering methane reactor [transform] -> Purified methane supply


## Two cold stores

![Two cold stores](assets/backgrounds/workshop-hydrogen.webp)

Both propellants must become liquid. Each needs its own vessel and flow path, even when their controls work together.

> NOTE: A batch of two qualified vessels and two adjustable factory cooling units is prepared together, then its separate members are dedicated to methane and oxygen. The material-stock model does not copy one unique vessel into both roles. Controllers, vacuum jackets, pressures, cleanliness and refrigeration capacity are declared imported capabilities. Local housings and insulation remain outside those boundaries. Common operating controls coordinate the connected installation without joining the gas or liquid paths.

**Goals**
- Collect the two propellants separately
  - both: Tank of liquid methane
  - and: Tank of liquid oxygen
- next: Link the two stores’ operating controls -- Running fuel fab

**Hotspots**
- Oxygen service outlet (at 52%, 29%)
  - icon: ![Oxygen service outlet](assets/hotspots/oxygen-service-outlet.png)
  > NOTE: Mars v12 artwork target: Separate oxygen-clean keyed regulator/outlet on completed electrolysis rack. Centre 52%, 29%; transparent hit area 88 × 72px at 390 × 844.

**Items**
- Oxygen service outlet
- Cryogenic tanks
  - icon: ![Cryogenic tanks](assets/items/cryogenic-tanks.png)

  Two factory pressure-and-vacuum vessels, each with its own clean connections and vent. Each stays dedicated to one propellant.

- Cryogenic cooling units
  - icon: ![Cryogenic cooling units](assets/items/cryogenic-cooling-units.png)

  Two factory refrigerators qualified for their separate liquefaction duties.

- Refrigerated cryogenic tanks
  - icon: ![Refrigerated cryogenic tanks](assets/items/refrigerated-cryogenic-tanks.png)

  The factory walls hold pressure and vacuum. My housings protect them; the keyed liquid fittings cannot cross-connect.

- Tank of liquid methane
  - icon: ![Tank of liquid methane](assets/items/tank-of-liquid-methane.png)

  Dry methane becomes liquid inside its qualified receiver.

- Tank of liquid oxygen
  - icon: ![Tank of liquid oxygen](assets/items/tank-of-liquid-oxygen.png)

  Conditioned oxygen becomes liquid in its own oxygen-clean vessel.

- Running fuel fab
  - icon: ![Running fuel fab](assets/items/running-fuel-fab.png)

  Common controls coordinate production. The propellant circuits stay apart all the way to their separate stores.

**Combinations**
- Cryogenic cooling units [consume] + Cryogenic tanks [consume] -> Refrigerated cryogenic tanks
- Purified methane supply [consume] + Refrigerated cryogenic tanks [consume] -> Tank of liquid methane
- Refrigerated cryogenic tanks [consume] @ Oxygen service outlet -> Tank of liquid oxygen
- Tank of liquid methane [consume] + Tank of liquid oxygen [consume] -> Running fuel fab


## Heat worth keeping

![Heat worth keeping](assets/backgrounds/farm-service-alcove.webp)

The process loop carries warmth the growing room can use. In the pressurized service alcove, a water tank can hold some of that heat after the machinery stops.

> NOTE: The locally formed steel tank stays inside the pressurized farm service alcove. It contains non-potable low-temperature heating water at room pressure; the qualified tubing retains the process coolant. The supplied service spine provides sealed exterior connections. The tank supplements the electric heater, cannot supply cooking heat and does not generate energy. Fit the coil while the tank is empty; after that, filling the tank and attaching its exterior insulation can happen in either order. Both routes reach the same filled, insulated vessel before connection to the heat source. Ordinary cutting, joining and tube forming use the existing tool kit; no dedicated imported drum is supplied. The room-facing insulation is a removable flap. Closing the coil’s outdoor service valves isolates the cooling loop; exposing the tank wall then releases stored heat directly to room air. There is no unprovided secondary heating circuit. The tank is a finite supplement to the continuing electric heater.

**Goals**
- Store useful warmth -- Warm water tank

**Hotspots**
- Indoor heat-recovery connection (at 69%, 23.5%)
  - icon: ![Indoor heat-recovery connection](assets/hotspots/indoor-heat-recovery-connection.png)
  > NOTE: Mars v12 artwork target: Sealed pair of coolant service connections through pressure enclosure spine. Centre 69%, 23.5%; transparent hit area 90 × 66px at 390 × 844.

**Items**
- Indoor heat-recovery connection
- Steel tank without a coil
  - icon: ![Steel tank without a coil](assets/items/steel-tank-without-a-coil.png)

  Vented to room pressure, for non-potable heating water. Process coolant will stay inside its own tubing.

- Unfilled uninsulated tank
  - icon: ![Unfilled uninsulated tank](assets/items/unfilled-uninsulated-tank.png)

- Unfilled insulated tank (exclusive with Uninsulated filled tank)
  - icon: ![Unfilled insulated tank](assets/items/unfilled-insulated-tank.png)

- Uninsulated filled tank (exclusive with Unfilled insulated tank)
  - icon: ![Uninsulated filled tank](assets/items/uninsulated-filled-tank.png)

- Unheated water tank
  - icon: ![Unheated water tank](assets/items/unheated-water-tank.png)

  Tank water surrounds the sealed coolant coil. The two fluids remain separate.

- Warm water tank
  - icon: ![Warm water tank](assets/items/warm-water-tank.png)

  The process loop warms the tank through its sealed coil. Closing the flap holds warmth; folding it back exposes the warm steel to the room. This stores heat—it cannot make more.

**Combinations**
- Steel [consume] + Tool kit -> Steel tank without a coil
- Coolant tubing [consume] + Steel tank without a coil [transform] -> Unfilled uninsulated tank
- Reflective insulation [consume] + Unfilled uninsulated tank [transform] -> Unfilled insulated tank
- Drinking water supply + Unfilled insulated tank [transform] -> Unheated water tank
- Drinking water supply + Unfilled uninsulated tank [transform] -> Uninsulated filled tank
- Reflective insulation [consume] + Uninsulated filled tank [transform] -> Unheated water tank
- Unheated water tank [transform] @ Indoor heat-recovery connection -> Warm water tank


## Amber noon

![Amber noon](assets/backgrounds/habitat-storm.webp)

*Mara, Earth — recorded message:*

“Storm alert. Science advises a major regional dust storm over your site. You may lose most of your solar power. The essential reserve covers the forecast interruption. Stop the industrial loads and protect the growing room.”

> NOTE: This compound is a diagram of the existing control panel: fitted system icons record operating the corresponding switches. No reserve, hose or fuel factory is physically put inside the panel. The fourth position is the later solar-restoration command; it cannot be filled until the arrays are cleaned after the storm. All three shutdown states and restored power are required before restart.  The delivered reserve is specified for the forecast interruption at essential loads. Electric heating continues at reduced settings; the water buffer supplements it. Qualified laboratory sample storage already has essential power and requires no rescue or switchover puzzle. The industrial systems shut down through their provided controls, with separate safe cryogenic venting. The atmospheric processor shuts down with the other high-temperature loads; stored breathing gas and the running scrubber carry the oxygen requirement through the forecast interruption. The wall-mounted service panel sends commands to the separate installed electrical, well and fuel-plant controllers; their fluids do not run through a common indoor cabinet. Each local controller finishes its shutdown cycle before that load loses power. The well’s supplied drain circuit clears low points into the raw-water receiver and admits replacement gas; line drainage and plant shutdown may finish in either order.

**Goals**
- Put the station on reserve -- Station service panel[Charged essential reserve]
- next: Leave the exterior circuits safe -- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab]

**Items**
- Station service panel (compound)
  - icon: ![Station service panel](assets/items/station-service-panel.png)
  - slot: Essential power selected, accepts Charged essential reserve, icon: ![fitted Charged essential reserve](assets/overlays/panel-reserve.png)
  - slot: Well isolated and drained, accepts Insulated water line, icon: ![fitted Insulated water line](assets/overlays/panel-well.png)
  - slot: Fuel fab shut down, accepts Running fuel fab, icon: ![fitted Running fuel fab](assets/overlays/panel-fuel.png)
  - slot: Solar operation restored, accepts `restored-power`, icon: ![fitted Station solar supply](assets/overlays/panel-solar.png)

  Selecting a system operates its controller outside. The panel holds switches, not the machinery itself.

- Station service panel

  [Charged essential reserve] Shutdown controls keep power until their sequences finish. Air handling, reduced heat and laboratory refrigeration stay on reserve.

- Station service panel

  [Insulated water line] The well closes and its service circuit drains the hose into the raw-water receiver. Only then does trace heating switch off.

- Station service panel

  [Running fuel fab] The plant cools and isolates before its power disconnects. The tanks retain part of their liquid; separate outdoor vents release boil-off.

- Station service panel

  [Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`] Solar operation warms, checks and primes the well line from the habitat buffer. Once water returns, the fuel plant restarts and replaces what vented during the storm.


## Keep the roots alive

![Keep the roots alive](assets/backgrounds/farm-storm.webp)

Enough warmth, light and circulating water to keep the roots alive. Productive growth can resume when the solar supply recovers.

> NOTE: The supplied reserve connection operates the same established pump system, not a new pump invented for one crop. The cover reduces heat loss without sealing away oxygen. The existing heater and reserve are the continuing energy source; recovered warmth softens initial cooling. Sample cooling is not part of this arc. Stored food supplies this supper; there is no repeated lettuce-meal recipe.

**Goals**
- Reduce heat and light losses -- Screened growing area
- next: Protect the circulating reservoir -- Insulated nutrient reservoir

**Hotspots**
- Growing-room service rail (at 50%, 16%)
  - icon: ![Growing-room service rail](assets/hotspots/growing-room-service-rail.png)
  > NOTE: Mars v12 artwork target: Overhead rail at boundary of planted crop space and empty aisle. Centre 50%, 16%; transparent hit area 280 × 50px at 390 × 844.
- Shared nutrient reservoir (at 29%, 49%)
  - icon: ![Shared nutrient reservoir](assets/hotspots/shared-nutrient-reservoir.png)
  > NOTE: Mars v12 artwork target: Actual common tank below bed drains; aeration return opening remains clear. Centre 29%, 49%; transparent hit area 130 × 68px at 390 × 844.

**Items**
- Growing-room service rail
- Shared nutrient reservoir
- Farm thermal screen
  - icon: ![Farm thermal screen](assets/items/farm-thermal-screen.png)

- Screened growing area
  - icon: ![Screened growing area](assets/items/screened-growing-area.png)

  The dimmed lamps serve the crop area. The ventilation route stays open.

- Covered nutrient reservoir
  - icon: ![Covered nutrient reservoir](assets/items/covered-nutrient-reservoir.png)

  The cover limits evaporation without closing the aeration openings. Roots still need air.

- Insulated nutrient reservoir
  - icon: ![Insulated nutrient reservoir](assets/items/insulated-nutrient-reservoir.png)

  I select low-power circulation, isolate the heat tank's outdoor coil and fold back its room-facing insulation. Stored warmth helps; the reserve heaters carry the continuing load.
  
  Mara's forecast update has a sentence at the end: “It's raining outside my window.”

**Combinations**
- Reflective insulation [consume] + Clean cover fabric [consume] -> Farm thermal screen
- Farm thermal screen [consume] @ Growing-room service rail -> Screened growing area
- Steel [consume] @ Shared nutrient reservoir -> Covered nutrient reservoir
- Reflective insulation [consume] + Covered nutrient reservoir [transform] -> Insulated nutrient reservoir


## Sun on the floor

![Sun on the floor](assets/backgrounds/workshop-after-storm.webp)

The sky has cleared. The farm has survived; the arrays need cleaning.

> NOTE: The original array identity changes its displayed name to Dust-coated solar supply on arrival here. The new Station solar supply has a distinct identifier; cleaning transforms and retires the old identity. The delivered arrays use removable panel sections; the workshop cleaning bench is a normal service surface, not a second array. Each section is isolated, cleaned and refitted. The service-panel compound retains the actual reserve, well and fuel-fab control states; its restored-power connection performs the normal sequenced restart, with line warming, priming and checks before process feeds reopen. No extra control hardware or engine change is implied.

**Goals**
- Clean the dust-coated panel sections -- `restored-power`
- next: Restore the well and fuel fab -- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`]

**Hotspots**
- Array cleaning bench (at 33%, 31.8%)
  - icon: ![Array cleaning bench](assets/hotspots/array-cleaning-bench.png)
  > NOTE: Mars v12 artwork target: Fixed clean padded service bench for removable array sections, not a second array. Centre 33%, 31.8%; transparent hit area 170 × 66px at 390 × 844.

**Items**
- Array cleaning bench
- `restored-power` Station solar supply
  - icon: ![Station solar supply](assets/items/restored-power.png)

  I isolate, clean and refit the removable panel sections. Useful output returns. The room lamps brighten, and the atmospheric processor resumes replenishing the breathing reserve.

**Combinations**
- `station-power` [transform] @ Array cleaning bench -> `restored-power`


## The leg that stays

![The leg that stays](assets/backgrounds/lander-cribbed.webp)

The plant is working again. Now I can finish the repair that will let this cabin leave.

> NOTE: The initial inspection established a repairable grounded lower support. The replacement uses qualified salvaged steel and the checked non-pressure footing blocks; the original upper cabin, tanks and engine remain intact. Ordinary lifting, cribbing, fastening and controlled load transfer belong to the installation procedure, not separate inventory puzzles. The prepared-ground result represents the real site; assembly and fitting happen there, without carrying ground to the spacecraft. These are lower-stage ground supports, not fabricated flight engines or pressure tanks.

**Goals**
- Build the replacement ground support -- Replacement landing leg
- next: Restore a level launch platform -- Level launch platform

**Hotspots**
- Lander support ground (at 43%, 44%)
  - icon: ![Lander support ground](assets/hotspots/lander-support-ground.png)
  > NOTE: Mars v12 artwork target: Loose terrain beside the existing temporary crib under the same lander. Centre 43%, 44%; transparent hit area 130 × 70px at 390 × 844.
- Tilted lander (at 73%, 34%)
  - icon: ![Tilted lander](assets/hotspots/tilted-lander.png)
  > NOTE: Mars v12 artwork target: Original intact cabin/lower-stage receiving joint above the folded damaged support. Centre 73%, 34%; transparent hit area 106 × 86px at 390 × 844.

**Items**
- Lander support ground
- Tilted lander
- Prepared support ground
  - icon: ![Prepared support ground](assets/items/prepared-support-ground.png)

  I keep the excavator clear of the loaded temporary supports.

- Replacement landing leg
  - icon: ![Replacement landing leg](assets/items/replacement-landing-leg.png)

  Broad plates spread the load over checked ceramic blocks. The braced support matches the sound lower-stage joints.

- Level launch platform
  - icon: ![Level launch platform](assets/items/level-launch-platform.png)

  I transfer the load using the spacecraft's service equipment. The footing holds. This leg will stay on Mars when the upper cabin lifts away.

**Combinations**
- Working survey excavator @ Lander support ground -> Prepared support ground
- Steel [consume] + Prepared support ground [transform] -> Replacement landing leg
- Replacement landing leg [consume] @ Tilted lander -> Level launch platform


## Two tanks, two liquids

![Two tanks, two liquids](assets/backgrounds/lander-level.webp)

The plant has replaced the storm losses and collected the required propellant. Time to fill the spacecraft.

> NOTE: The actual repaired staged lander receives the actual plant's two liquids through distinct qualified lines and controls. Production duration and rates are an explicit future mission abstraction. The installed cold stores and flight tank refrigerators maintain their separate systems. The locally braced lower landing platform remains on Mars.

**Goals**
- Fill the separate ascent tanks -- Fueled ascent tanks

**Hotspots**
- Lander propellant service connections (at 82.5%, 27%)
  - icon: ![Lander propellant service connections](assets/hotspots/lander-propellant-service-connections.png)
  > NOTE: Mars v12 artwork target: Two physically separate keyed methane and oxygen transfer ports on repaired vehicle. Centre 82.5%, 27%; transparent hit area 60 × 68px at 390 × 844.

**Items**
- Lander propellant service connections
- Fueled ascent tanks
  - icon: ![Fueled ascent tanks](assets/items/fueled-ascent-tanks.png)

  The controller checks the keyed connections before transfer. Fuel and oxidizer remain apart until they reach the engine.

**Combinations**
- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`] [preserve] @ Lander propellant service connections -> Fueled ascent tanks


## A hearth for the harvest

![A hearth for the harvest](assets/backgrounds/furnace-clean-heat.webp)

Mara confirms a hold for rendezvous alignment. The spacecraft is ready, the specimens are safe, and the farm has survived. I can make a proper meal: potato and soybean stew with fresh lettuce.

> NOTE: The food pressure vessel is imported; the conductive jacket and support are made from known materials around the real pot. The existing receiver provides temperature control. This uses high-temperature furnace heat, not the low-grade water buffer. The brief departure hold is an orbital-alignment condition, not a countdown or waiting mechanic. Engineering and fueling are complete before this celebratory pause. The actual specimens board afterward, immediately before the astronaut commands ascent.

**Goals**
- Build a clean cooker around the existing heat source -- Solar cooking pot

**Hotspots**
- Solar cooking connection (at 50%, 47%)
  - icon: ![Solar cooking connection](assets/hotspots/solar-cooking-connection.png)
  > NOTE: Mars v12 artwork target: Clean secondary conductive heating block on established solar furnace receiver. Centre 50%, 47%; transparent hit area 145 × 70px at 390 × 844.

**Items**
- Solar cooking connection
- Pressure cooking pot
  - icon: ![Pressure cooking pot](assets/items/pressure-cooking-pot.png)

  Its absolute-pressure regulator permits cooking outside without boiling the contents away into the thin air.

- Jacketed cooking pot
  - icon: ![Jacketed cooking pot](assets/items/jacketed-cooking-pot.png)

- Solar cooking pot
  - icon: ![Solar cooking pot](assets/items/solar-cooking-pot.png)

  The sunlight that fired the floor can cook supper. Its separate clean heating connection keeps industrial material and gas away from the food.

**Combinations**
- Steel [consume] + Pressure cooking pot [consume] -> Jacketed cooking pot
- Jacketed cooking pot [transform] @ Solar cooking connection -> Solar cooking pot


## Potato and soybean stew

![Potato and soybean stew](assets/backgrounds/farm-harvest.webp)

The beans need thorough cooking before the potatoes join them in the same pot.

> NOTE: The three harvesting hotspots are the actual previously planted and tended crop zones, now represented in their harvest-ready state. Lettuce tray ready to pick is the same living tray from the first green meal, represented as a working surface here rather than carried as an item. They do not exist as early receiving surfaces, so a player cannot harvest the soybean stand before the storm. The same woven cloth provides fresh food-safe pieces, never reused industrial cloth. The same basket is emptied between crops. Ordinary washing and cutting use the established sink and utensils. The closed pressure vessel comes indoors before opening, and is resealed before outdoor reheating. Mature soybeans receive a complete cooking cycle before potatoes are added. The basket harvests each crop at its own hotspot. The final lettuce result includes washing at the established sink and has its own identity, so leaves from the first meal cannot supply this supper. The rooted tray stays alive; serving joins the fresh greens with the stew. There is no flight-food packing.

**Goals**
- Cook the beans thoroughly -- Pot of cooked soybeans
- next: Serve potato and soybean stew with fresh lettuce -- Stew and lettuce supper

**Hotspots**
- (three hotspots are a lot but okay here because each is a different established crop zone and the same basket harvests all three)
- Potato bed ready to lift (at 22%, 35%)
  - icon: ![Potato bed ready to lift](assets/hotspots/potato-bed-ready-to-lift.png)
  > NOTE: Mars v12 artwork target: Same deep dark skirted bed, foliage now dying back over tubers. Centre 22%, 35%; transparent hit area 95 × 95px at 390 × 844.
- Soybean row ready to gather (at 67%, 32%)
  - icon: ![Soybean row ready to gather](assets/hotspots/soybean-row-ready-to-gather.png)
  > NOTE: Mars v12 artwork target: Same supported aerated row, dry pods hanging on mature stems. Centre 67%, 32%; transparent hit area 128 × 78px at 390 × 844.
- Lettuce tray ready to pick (at 72%, 41%)
  - icon: ![Lettuce tray ready to pick](assets/hotspots/lettuce-tray-ready-to-pick.png)
  > NOTE: Mars v12 artwork target: Same shallow wick-fed living tray, broad outer leaves around small growing centres. Centre 72%, 41%; transparent hit area 120 × 65px at 390 × 844.

**Items**
- Potato bed ready to lift
- Soybean row ready to gather
- Lettuce tray ready to pick
- Prepared potatoes
  - icon: ![Prepared potatoes](assets/items/prepared-potatoes.png)

  Washed and cut at the cabin sink. The seed pieces became a substantial harvest.

- Gathered soybean pods
  - icon: ![Gathered soybean pods](assets/items/gathered-soybean-pods.png)

  From the same row that endured the storm.

- Dry soybeans
  - icon: ![Dry soybeans](assets/items/dry-soybeans.png)

  Food to cook, not beans to eat raw.

- Soaked soybeans
  - icon: ![Soaked soybeans](assets/items/soaked-soybeans.png)

  After soaking, I drain and rinse the beans.

- Pot of cooked soybeans
  - icon: ![Pot of cooked soybeans](assets/items/pot-of-cooked-soybeans.png)

  The sealed pot completes its bean-cooking programme outside. I bring it through the airlock before releasing pressure. A bean crushes beneath the spoon. The potatoes have not gone in yet.

- Potato and soybean stew
  - icon: ![Potato and soybean stew](assets/items/potato-and-soybean-stew.png)

  I add the potatoes, oil and seasoning, reseal the pot for its second heating outside, then bring it indoors before opening. Potato breaks against the spoon, thickening the broth.

- Washed supper lettuce
  - icon: ![Washed supper lettuce](assets/items/washed-supper-lettuce.png)

  Freshly picked and rinsed at the sink. The small centre stays growing.

- Stew and lettuce supper
  - icon: ![Stew and lettuce supper](assets/items/stew-and-lettuce-supper.png)

  At the berth, the first spoonful is hot enough to make me pause. Crisp leaves snap against the warm, soft potato. These are the crops I kept alive beneath the rock. For once, the message I record for Earth is about supper.

**Combinations**
- Lined harvest basket @ Potato bed ready to lift -> Prepared potatoes
- Lined harvest basket @ Soybean row ready to gather -> Gathered soybean pods
- Lined harvest basket @ Lettuce tray ready to pick -> Washed supper lettuce
- Clean cover fabric [consume] + Gathered soybean pods [transform] -> Dry soybeans
- Drinking water supply + Dry soybeans [transform] -> Soaked soybeans
- Soaked soybeans [consume] + Solar cooking pot [transform] -> Pot of cooked soybeans
- Prepared potatoes [consume] + Pot of cooked soybeans [transform] -> Potato and soybean stew
- Washed supper lettuce [consume] + Potato and soybean stew [preserve] -> Stew and lettuce supper


## The things we take

![The things we take](assets/backgrounds/lander-sample-transfer.webp)

Rendezvous clearance. Three specimens are coming with me.

> NOTE: The qualified portable cold-transfer enclosure maintains a cold, clean working volume beside the lander; it is not an open outdoor bench. Its two core liners remain separate and the original membrane retains its sealed holder and its own flight locker. Empty freezer and field-case hardware stay behind. Cold transfer, boarding and connection to flight refrigeration are the final cargo work after the meal. The spacecraft is already repaired and fueled; neither is repeated.

**Goals**
- Bring both actual cores onto flight cooling -- Cores on flight cooling
- Bring the first specimen too -- Flight-stowed membrane

**Hotspots**
- (three hotspots are a lot but okay here because the cold transfer bench, refrigerated core bay and separate membrane locker serve distinct containment jobs)
- Cold transfer bench (at 27%, 35.3%)
  - icon: ![Cold transfer bench](assets/hotspots/cold-transfer-bench.png)
  > NOTE: Mars v12 artwork target: Working shelf inside sealed portable refrigerated transfer enclosure. Centre 27%, 35.3%; transparent hit area 130 × 82px at 390 × 844.
- Refrigerated flight bay (at 79%, 30%)
  - icon: ![Refrigerated flight bay](assets/hotspots/refrigerated-flight-bay.png)
  > NOTE: Mars v12 artwork target: Empty receiving mount/socket for two-core flight carrier inside protected vehicle bay. Centre 79%, 30%; transparent hit area 88 × 125px at 390 × 844.
- Flight specimen locker (at 47%, 26%)
  - icon: ![Flight specimen locker](assets/hotspots/flight-specimen-locker.png)
  > NOTE: Mars v12 artwork target: Separate padded membrane-holder restraint recessed into the departing upper cabin, immediately left of the round hatch; never the ground-based transfer unit. Centre 47%, 26%; transparent hit area 68 × 64px at 390 × 844.

**Items**
- Cold transfer bench
- Refrigerated flight bay
- Flight specimen locker
- Flight sample carrier
  - icon: ![Flight sample carrier](assets/items/flight-sample-carrier.png)

  Qualified whole-core containment with connections to the spacecraft's isolated sample refrigerator.

- Conditioned flight carrier
  - icon: ![Conditioned flight carrier](assets/items/conditioned-flight-carrier.png)

  The bench chills the carrier and its transfer buffer. Both complete liners will travel with all their surrounding ice.

- Carrier with source core
  - icon: ![Carrier with source core](assets/items/carrier-with-source-core.png)

  The actual water-source liner leaves its laboratory freezer for the first cradle.

- Flight-packed cores
  - icon: ![Flight-packed cores](assets/items/flight-packed-cores.png)

  The remote liner leaves its field case for the second cradle. Two places on Mars, kept apart in one carrier.

- Cores on flight cooling
  - icon: ![Cores on flight cooling](assets/items/cores-on-flight-cooling.png)

  The transfer buffer has bridged the move. Active flight refrigeration takes over.

- Flight-stowed membrane
  - icon: ![Flight-stowed membrane](assets/items/flight-stowed-membrane.png)

  The original membrane holder has its own place aboard, separate from the cores.

**Combinations**
- Flight sample carrier [transform] @ Cold transfer bench -> Conditioned flight carrier
- Stored source core [transform] + Conditioned flight carrier [transform] -> Carrier with source core
- Case with an articulated body [transform] + Carrier with source core [transform] -> Flight-packed cores
- Flight-packed cores [transform] @ Refrigerated flight bay -> Cores on flight cooling

- First body on membrane [transform] @ Flight specimen locker -> Flight-stowed membrane


## My hand on the switch

![My hand on the switch](assets/backgrounds/flight-cabin.webp)

I climb into the cabin that brought me down and close the hatch. The last command is mine.

> NOTE: The removable arming plug is real physical flight hardware, kept separate during surface operations. Spacecraft arming plugs have actual precedent; this crew-accessible Mars-ascent enable socket is an explicit fictional adaptation, not a claim about an Apollo ignition key. The single combination is the complete deliberate launch operation: insert the plug, confirm arming, then press the existing START control. Insertion alone does not ignite the engine or power the entire cabin. Normal interlocks and ascent checks are bundled. Earlier goals establish repair, separate propellants and all three specimens aboard.

**Goals**
- Fit the arming plug and launch -- Rising cabin

**Hotspots**
- Flight console (at 50%, 33%)
  - icon: ![Flight console](assets/hotspots/flight-console.png)
  > NOTE: Mars v12 artwork target: Powered flight control panel with empty enable-plug socket and separate guarded START button. Centre 50%, 33%; transparent hit area 280 × 110px at 390 × 844.

**Items**
- Flight console
- Arming plug
  - icon: ![Arming plug](assets/items/arming-plug.png)

  Enables the launch command circuit. Fit it, confirm ARMED, then press START.

- Rising cabin
  - icon: ![Rising cabin](assets/items/rising-cabin.png)

  I lock the plug's collar. ARMED. I lift the guard and press START. The engine pushes me into the seat; the lower stage and its new leg stay behind.

**Combinations**
- Arming plug [consume] @ Flight console -> Rising cabin


## The End

![The End](assets/backgrounds/orbital-rendezvous.webp)

A dull knock runs through the cabin. Docked.

At the receiving hatch, another pair of gloved hands accepts the sealed membrane holder and the two cores.

“Show me where you found it.”

> NOTE: The ending remains in Mars orbit at rendezvous with the waiting return vehicle. The actual three sealed specimens transfer through the receiving containment procedure. No Earth-arrival jump, station closeout or further inventory chores follow the player’s ascent command.

