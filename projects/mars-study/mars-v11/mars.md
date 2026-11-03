# Mars: A Place That Can Endure

A hard landing, a home beneath the rock, and a discovery worth bringing back.

> NOTE: Text-first v11. Read design-brief.md for equipment provenance, explicit future/site assumptions and research boundaries. Same spacecraft cabin, farm, crop stands and three specimens retain their physical identities. Fixed equipment may be represented by its later working surface. No new artwork or visual evaluation belongs to this revision.

## The wrong side of the pad

![Working surface](../mars-v8/assets/work-surface.svg)

The ladder stops a metre above the ground. One landing leg has folded; loose rubble has shifted under the low side. Beyond it, a stone has torn the starter habitat's wall. My suit is holding, and the cabin still holds air. The outside emergency rack is within reach, but the main stores are aboard. I need a sealed room—and stable support beneath the lander before I climb back in for supplies.

> NOTE: A recoverable hard landing occurred outside the intended landing area; plume-driven ejecta damaged the starter habitat. The suit and lander cabin allow deliberate work. The lower stage remains on Mars; the same upper crew cabin returns to orbit. The repair kit, tool and expendable cargo braces are accessible from the ground-level emergency rack. Stable temporary cribbing is needed before repeated boarding and heavy unloading; it prevents further settling and protects the same cabin needed for return. It is not an improvised repair to a flight engine or pressure vessel. Ordinary inspection and repair procedures are bundled. Material stocks represent quantities without accounting.

**Goals**
- Seal and refill the habitat -- Breathable habitat
- next: Make the lander safe to board -- Cribbed landing platform

**Hotspots**
- Punctured habitat wall (at 25%, 15%)
- Unstable landing support (at 75%, 15%)

**Items**
- Pressure patch kit

  The cabin repair kit has a reinforced patch, backing plate and seals. Its clamped repair is rated to hold pressure across a small puncture.

- Breathing-gas supply

  The delivered bank of regulated breathing-gas cylinders supplies the habitat and the folded farm enclosure. Different cylinders serve each fill; the farm does not drain the cabin.

- Tool kit

  A compact kit of cutting, drilling, fastening and metal-forming tools. It includes a drill/driver, metal cutter, spanners and forming tools for sheet and tubing. These tools stay separate from food utensils and specimen equipment.

- Shipping braces

  Expendable cargo bracing: straight structural lengths and broad sheet, separate from the spacecraft structure.

- Sealed habitat wall

  The backing plate seats against the inside skin. I tighten the patch against it; the ticking leak stops.

- Breathable habitat

  Air flows through the regulator until the habitat gauge holds. The delivered heater and scrubber are already on emergency power. Inside, I can take off my helmet.

- Steel

  I cut the expendable bracing free of its shipping joints. Straight low-carbon steel lengths and broad sheet lie beside the open kit, with the rough ends trimmed smooth.

- Cribbed landing platform

  I cut short lengths and broad plates, then fasten them into a squat crib beside the folded lower strut. The stacked frame takes the load across its wide base. The low side no longer shifts under load; I can use the ladder without rocking the cabin and bring down the main supplies. At the inspection points, the upper cabin, tanks and engine mounts are intact. The flight manual allows this grounded support to be braced and levelled with the spacecraft’s service equipment. A permanent replacement can follow once shelter and the mission are secure.


**Combinations**
- Pressure patch kit [consume] @ Punctured habitat wall -> Sealed habitat wall (tutorial)
- Breathing-gas supply [consume] + Sealed habitat wall [transform] -> Breathable habitat
- Tool kit + Shipping braces [transform] -> Steel
- Steel [consume] @ Unstable landing support -> Cribbed landing platform


## A voice in the room

![Working surface](../mars-v8/assets/work-surface.svg)

The array's panels survived, but its light transport feet have buckled, pulling the external lead loose. Above the silent radio, the message schedule still shows the first call I missed.

> NOTE: The first pressure fill uses delivered breathing gas; the processor subsequently replenishes oxygen without replacing the required buffer gas. Its protected outdoor package combines selective carbon-dioxide capture/compression and an oxygen-producing electrochemical stage. A separately controlled takeoff upstream of that stage can later supply carbon dioxide without mixing it with the carbon-monoxide exhaust or interrupting the breathing-oxygen branch. This scalable future unit has the capacity stated in the brief. The reserve, heaters, scrubbers and radio belong to the delivered station. The main array supports farm and baseline life support; expansion panels later support industry. No live Earth reply directs the opening emergency.

**Goals**
- Restore power and the reserve -- Charged essential reserve
- next: Replenish the breathing oxygen -- Working atmospheric processor
- next: Hear from Earth -- Surface radio

**Hotspots**
- Reserve charging connection (at 25%, 15%)
- Radio mount (at 75%, 15%)

**Items**
- Delivered solar array

  The unfolded main array and its controllers were delivered for the thirty-square-metre farm, cabin and workshop. Its cells survived; broad new feet and a sound lead will reconnect it.

- Power cable

  Coils of qualified outdoor cable with the mission equipment’s matching connectors, in the sizes required by the designated circuits.

- Atmospheric processor

  The station oxygen unit: a filtered compressor, carbon-dioxide capture stage and oxygen-making cell in one machine. A separate gas connection leads from the capture stage, before the oxygen cell.

- Bent antenna

  A bent support holds the antenna mast against its transport cradle. Its cable is intact, but the hinge cannot open far enough to aim it.

- Standing solar array

  Broad steel feet replace the buckled transport supports. The rack stands square, leaving slack for the cable instead of pulling on its connector.

- `station-power` Station solar supply
  - from chapter "Sun on the floor": Dust-coated solar supply

  I reconnect the lead at the isolated controller and bring the rack online. The charge light comes on inside the habitat.
- Charged essential reserve

  The reserve begins charging from the restored array. Its delivered battery and regenerative fuel-cell system can keep air, reduced heating and laboratory refrigeration running through a planned interruption; industrial work will have to stop.

- Working atmospheric processor

  The compressor starts drawing in the thin outside air. Inside the unit, heat and electricity split carbon dioxide; clean oxygen feeds the habitat reserve while waste carbon monoxide vents outside. The stored breathing gas got me inside. This machine can replenish its oxygen.

- Straightened antenna

  I release the bent support, straighten it and refasten its hinge. The mast swings clear of the cradle and locks upright; I can aim the dish again.

- Surface radio

  “Mara here, surface support. We saw the touchdown trace. That was much closer to the habitat than planned.” It is a recorded message. I send the steady air reading. “I'm inside. I'm all right.”


**Combinations**
- Steel [consume] + Delivered solar array [transform] -> Standing solar array
- Power cable [consume] + Standing solar array [transform] -> `station-power`
- `station-power` @ Reserve charging connection -> Charged essential reserve
- `station-power` + Atmospheric processor [transform] -> Working atmospheric processor
- Tool kit + Bent antenna [transform] -> Straightened antenna
- Straightened antenna [consume] @ Radio mount -> Surface radio


## Water under the plain

![Working surface](../mars-v8/assets/work-surface.svg)

*Mara, Earth — recorded message:*

“The supply ship carries your normal ascent propellant. Stored meals cover commissioning and interruptions; the growing room is meant to supply a substantial share of your food. Establish the well and treatment line first.”

> NOTE: The processor is delivered precision equipment with validated treatment and feed-polishing functions. A cloth or heating alone does not make Martian water potable. The later specimen comes from this raw intake, never the Earth-crop loop. The internal tank provides drinking water during exterior shutdown.

**Goals**
- Bring water through treatment -- Drinking water supply
- next: Protect the exterior run -- Insulated water line

**Hotspots**
- Surveyed ice bore (at 25%, 15%)
- Water processor (at 75%, 15%)

**Items**
- Heated extraction head

  A complete drilling, casing and melt-water unit. Its sealed head controls pressure in the melt cavity and pumps the recovered liquid; the service run has powered trace heating.

- Clean service hose

  Clean liquid-water hose with compatible couplings. It is never used for hot gas, hydrogen, methane or oxygen.

- Packing foil

  Reflective laminate from the cargo packaging. It redirects heat or light; it cannot create either.

- Insulation felt

  Clean rolls of thermal insulation from the cargo. Keep loose fibres outside food, roots and sample containment.

- Sealed melt well

  The head seals into its casing. Beneath the dry cover, the heater opens a small liquid pocket; cloudy water rises inside the closed system.

- Connected well line

  The heated hose joins the well to the processor. Brown grit begins gathering at the raw-water strainer, upstream of every drinking tap and crop bed.

- Drinking water supply

  Treatment removes suspended and dissolved contaminants, then checks the output. I fill the habitat buffer tank. The first cup tastes of almost nothing.

- Reflective insulation

  I fit the reflective laminate over the soft felt, leaving an overlap along the edge. The joined jacket bends around the hose without exposing a bare seam.

- Insulated water line

  The reflective jacket wraps the actual heat-traced hose, leaving its couplings reachable. Insulation slows heat loss; the tracing still supplies the heat.


**Combinations**
- Heated extraction head [consume] @ Surveyed ice bore -> Sealed melt well
- Clean service hose [consume] + Sealed melt well [transform] -> Connected well line
- Connected well line @ Water processor -> Drinking water supply
- Packing foil [consume] + Insulation felt [consume] -> Reflective insulation
- Reflective insulation [consume] + Connected well line [transform] -> Insulated water line
- Insulated water line @ Water processor -> Drinking water supply


## The work of a hundred shovels

![Working surface](../mars-v8/assets/work-surface.svg)

The surveyed cave mouth is a short walk from the habitat. Its floor lies under loose infill; the excavator has its digging drum but empty mounts where a spoil hopper belongs. Beyond the entrance, the ceiling rises into darkness.

> NOTE: The cave and nearby layered ice are a favorable invented site inspected by precursor robots. This machine moves loose infill and grades ground; no improvised unsupported tunnelling. Excavated regolith later denotes selected material from its actual spoil pile. The chassis's charging connection is part of the assembled machine. The hopper can be fitted before or after the lead is connected; the drum stays stopped during fabrication. Both preparations precede the startup test and digging.

**Goals**
- Put the excavator to work -- Working survey excavator
- next: Clear the surveyed growing bay -- Cleared cavern bay

**Hotspots**
- Surveyed cavern floor (at 25%, 15%)

**Items**
- Survey excavator without a hopper

  The delivered tracked machine folds for transport with its digging drum attached. Motors, control electronics and load limits are part of the same machine.

- Excavator with spoil hopper (exclusive with Powered excavator without a hopper)

  I cut and fold the salvaged sheet into a hopper, then bolt its stiffened edges to the excavator’s existing mounts. The digging drum can now lift loose material into a container carried on the same tracks. Its power lead is still unplugged.

- Powered excavator without a hopper (exclusive with Excavator with spoil hopper)

  I unfold the machine and connect its power lead, leaving the digging drum stopped. The controls light up. Its empty hopper mounts are still bare; the salvaged steel can make the container that will carry the spoil.

- Working survey excavator

  I test the powered machine with its digging drum clear of the ground. The drum turns freely, the tracks answer the controls, and the hopper stays firm on its mounts. I can send the machine onto the surveyed floor.

- Cleared cavern bay

  I mark the route across the surveyed floor. The drum lifts loose infill into the hopper, and the machine carries each load to the spoil pile. A levelable bay opens beneath surveyed sound rock. There is shelter here, but no air I can breathe.


**Combinations**
- Steel [consume] + Survey excavator without a hopper [transform] -> Excavator with spoil hopper
- Power cable [consume] + Excavator with spoil hopper [transform] -> Working survey excavator
- Power cable [consume] + Survey excavator without a hopper [transform] -> Powered excavator without a hopper
- Steel [consume] + Powered excavator without a hopper [transform] -> Working survey excavator
- Working survey excavator @ Surveyed cavern floor -> Cleared cavern bay


## A furnace in the sunlight

![Working surface](../mars-v8/assets/work-surface.svg)

Outside the cave, the workshop crate opens into reflector petals, a tracking drive and a heat receiver. The mission came to test what this ground could become; the loose material is already waiting in the excavator's spoil pile.

> NOTE: The cells, optical surfaces, controls and refractory receiver are imported. Steel supply their mounting structure. Surveyed feedstock performance and the compact workshop's material cycles are declared future capabilities, not demonstrations that arbitrary Martian dust is suitable. The furnace becomes Solar heating bay in later chapters.

**Goals**
- Build the solar furnace -- Assembled solar furnace
- Prepare a formed feedstock -- Unfired regolith blanks

**Hotspots**
- Workshop press (at 25%, 15%)

**Items**
- Reflector petals

  Packable, factory-made mirror segments. Their finished surfaces collect sunlight onto the furnace receiver.

- Furnace receiver

  The compact factory core combines the hot receiver with its tracking base and temperature controller. It accepts the mission retort and has a separate conductive heating connection.

- Fine screening mesh

  Fine wire screen for grading material. It is finer than the structural cargo mesh.

- Excavated regolith

  Selected material from the cave-clearing spoil, matched to the precursor survey's mineral assessment. I take workable batches from the spoil pile.

- Supported reflector

  The petals fasten to a braced steel ring. They hold their curve when I tilt the assembly; their reflected patches move together instead of scattering across the ground.

- Assembled solar furnace

  The petals turn together. A bright point settles inside the receiver and its temperature rises. The red ground has supplied no fuel for this heat; the Sun has.

- Regolith sieve

  I stretch the fine mesh over a rigid rim above a collection tray. It stays taut under a scoop of spoil; the coarse cargo mesh would let these stones fall straight through.

- Screened regolith

  Coarse stones remain above the screen. Below them is an even feedstock the workshop can process consistently.

- Unfired regolith blanks

  The press compacts the graded powder on its reusable furnace carriers. The weak blanks stay supported until firing bonds their grains; pressing has given shape, not finished strength.


**Combinations**
- Steel [consume] + Reflector petals [consume] -> Supported reflector
- Furnace receiver [consume] + Supported reflector [transform] -> Assembled solar furnace
- Fine screening mesh [consume] + Steel [consume] -> Regolith sieve
- Excavated regolith [consume] + Regolith sieve [preserve] -> Screened regolith
- Screened regolith [consume] @ Workshop press -> Unfired regolith blanks


## Air inside the hill

![Working surface](../mars-v8/assets/work-surface.svg)

The farm enclosure is still folded in its crate. Thirty square metres of beds will need a smooth floor under their pressure liner; the rock roof will provide shielding, but the air must come with us.

> NOTE: The imported enclosure contains its attached airlock, pressure-rated service spine, air handling and heater; these are one real deployable assembly. Initial filling uses separate cylinders from the delivered breathing-gas bank. The supporting floor, padding and farm are locally constructed. The supplied furnace carriers support pressed powder blanks until the site-specific firing process makes non-pressure ceramic blocks. Their useful performance remains an explicit material assumption.

**Goals**
- Give the liner a safe floor -- Protected cavern floor
- next: Make an inhabited, illuminated room -- Lit growing room

**Hotspots**
- Solar heating bay (at 25%, 15%)
- Cleared growing bay (at 75%, 15%)

**Items**
- Clean cover fabric

  Folded lengths of clean, absorbent, nonabrasive woven cloth, kept wrapped away from dust. Fresh pieces can cover insulation, wick water, line food baskets or gently lift loose dust. Food pieces never come back from industrial use.

- Folded pressure envelope

  The imported pressure enclosure folds around its attached airlock and service spine. Its pressure seals and regulated air-handling/heating equipment are integral; the structural floor, beds and services must be built on site.

- Grow-light rails

  Factory-made crop lamps and their dimmable drivers. The original solar installation was sized to supply them; no sunlight reaches these beds through the cave roof.

- Ceramic blocks

  The furnace holds the packed blanks through its controlled firing cycle. The sound batch makes non-pressure paving and supports. It will never have to hold an atmosphere.

- Unpadded cavern floor

  The fired blocks cover the irregular ground. I adjust their bedding until the broad floor is level and no block rocks beneath my boot. There are no hollows to bridge, but the hard block edges still need padding before the pressure liner can rest here.

- Padded underlay

  Clean fabric encloses overlapping layers of the packing felt. The broad pad spreads contact and keeps small ceramic edges away from the pressure skin.

- Protected cavern floor

  The level blocks carry the load; the smooth underlay keeps their edges away from the liner.

- Sealed growing room

  I unfold the enclosure over the protected floor and engage its attached airlock and service spine. The imported seals close the room; the local blocks carry its weight.

- Pressurized growing room

  The envelope lifts from its folds. At working pressure its leak check holds, and I step through the airlock into a room broad enough to walk across. Rock fills the view through the outer windows.

- Lit growing room

  The enclosure's service spine starts the air circulation and heater when connected to the station. I mount the lamp rails and plug them into their drivers. Their light runs the length of the room. The original array was sized for this load.


**Combinations**
- Unfired regolith blanks [consume] @ Solar heating bay -> Ceramic blocks
- Ceramic blocks [consume] @ Cleared growing bay -> Unpadded cavern floor
- Insulation felt [consume] + Clean cover fabric [consume] -> Padded underlay
- Padded underlay [consume] + Unpadded cavern floor [transform] -> Protected cavern floor
- Folded pressure envelope [consume] + Protected cavern floor [transform] -> Sealed growing room
- Breathing-gas supply [consume] + Sealed growing room [transform] -> Pressurized growing room
- Grow-light rails [consume] + Pressurized growing room [transform] -> Lit growing room


## A bed under the hill

![Working surface](../mars-v8/assets/work-surface.svg)

The pressure enclosure has a dry alcove behind the growing-room partition. It is a sheltered place to sleep; the laboratory can stay in the repaired starter habitat.

> NOTE: The same starter-habitat mattress moves into a dry occupied alcove of the already pressurized and heated cave enclosure. The alcove has normal ventilation and separation from the future wet growing area. The berth uses the earlier steel, insulation and ordinary joining tools; it does not depend on the later process-heat installation. Mattress-first and insulation-first assembly are equally valid: the open raised frame lets insulation be fitted beneath the deck afterward. The two intermediate states are exclusive routes to the same berth.

**Goals**
- Make a sheltered berth -- Cave berth

**Items**
- Cabin mattress

  The original mattress from the starter habitat, moved with its bedding. No new furniture shipment has arrived.

- Insulated berth frame (exclusive with Uninsulated berth)

  The short steel frame lifts the mattress space clear of the floor. I fit the insulation beneath its deck; my sleeping surface will not lie against the cold paving.

- Uninsulated berth (exclusive with Insulated berth frame)

  I cut and fasten a short steel frame, then set the familiar mattress on its deck. The mattress is raised above the paving; underneath, the open frame still needs its insulating layer.

- Cave berth

  The familiar mattress rests on the raised deck, with insulation fitted beneath it. Warm air from the enclosure’s heater reaches the alcove. I put my boots underneath and stretch out; beyond the partition, the growing lamps shine on an empty floor.


**Combinations**
- Steel [consume] + Reflective insulation [consume] -> Insulated berth frame
- Cabin mattress [consume] + Insulated berth frame [transform] -> Cave berth
- Steel [consume] + Cabin mattress [consume] -> Uninsulated berth
- Reflective insulation [consume] + Uninsulated berth [transform] -> Cave berth


## One room for roots

![Working surface](../mars-v8/assets/work-surface.svg)

The empty room needs beds that drain and a reservoir below their outlets. The food plan depends on potatoes and soybeans for substantial meals, with a smaller tray of fresh lettuce.

> NOTE: Growing-room floor is the actual protected floor inside the pressure enclosure. All three beds are made together and share one reservoir, dosing pump and aerated return. After lining, the reservoir can be mounted before or after the bed drain hoses are fitted. The same hose lengths complete the return; positioning their outlet above the reservoir waterline provides aeration without a second hose-preparation puzzle. Liners are generic sheet fitted to these structures; ordinary fittings and joining tools are included with their real assemblies. The existing dehumidifier sends condensate through the station processor, not directly onto the roots.

**Goals**
- Line the shared bed structure -- Beds with unconnected drains
- next: Return water through an aerated reservoir -- Empty growing beds

**Hotspots**
- Growing-room floor (at 25%, 15%)

**Items**
- Food-safe liner sheet

  A roll of food-compatible waterproof sheet from the growing supplies. It is fitted inside the actual bed frames, not used as a product-shaped former.

- Reservoir and irrigation pump

  A supplied reservoir and circulation pump with a low-power backup. Its pipes distribute water through the three growing zones.

- Raised bed frames

  Steel supports make a deep potato bay, an aerated soybean row and a shallow lettuce tray. Their outlets stand above the place reserved for the common reservoir.

- Beds with unconnected drains

  I fit clean liner sheet inside the frames, sealing it around the supplied drain fittings. The frames carry the load; the liner holds the solution. The drain fittings still end in open stubs beneath the beds; no hose yet reaches the reservoir.

- Beds with loose drain hoses (exclusive with Beds with unconnected reservoir)

  I fit short hoses to the drain stubs and join them beneath the beds. Their common outlet hangs loose; the reservoir still needs to be mounted below it.

- Beds with unconnected reservoir (exclusive with Beds with loose drain hoses)

  I mount the reservoir and pump below the lined beds and attach their distribution line. The bed drains still end in bare stubs above it; they need hoses to carry the return water down.

- Empty growing beds

  The reservoir sits beneath the beds, with their drain hoses joined above its waterline. Returning water will fall through air before the pump sends it back to the roots: the drop mixes in oxygen without another machine. One pump and doser serve the room; each root zone keeps its own depth and flow adjustment.


**Combinations**
- Steel [consume] @ Growing-room floor -> Raised bed frames
- Food-safe liner sheet [consume] + Raised bed frames [transform] -> Beds with unconnected drains
- Clean service hose [consume] + Beds with unconnected drains [transform] -> Beds with loose drain hoses
- Reservoir and irrigation pump [consume] + Beds with loose drain hoses [transform] -> Empty growing beds
- Reservoir and irrigation pump [consume] + Beds with unconnected drains [transform] -> Beds with unconnected reservoir
- Clean service hose [consume] + Beds with unconnected reservoir [transform] -> Empty growing beds


## What roots need

![Working surface](../mars-v8/assets/work-surface.svg)

The frames can hold water, but the roots need gaps full of air as well. Local ceramic can provide that structure. The beds still need clean medium and water.

> NOTE: The wash bench is the processor’s horticultural attachment. Washing and leach checks qualify this fictional surveyed batch; untreated regolith is not declared suitable growing soil. Ordinary mineral nutrient provision is implicit in the delivered growing system. Chosen crop varieties share compatible conditions. The fixed thirty-square-metre room supplies a substantial dietary share with the stated light and reserve food, not complete nutritional independence.

**Goals**
- Fill the beds with clean porous medium -- Unwatered growing beds
- next: Water the beds through the shared loop -- Irrigated growing beds

**Hotspots**
- Root-medium wash bench (at 25%, 15%)

**Items**
- Growing medium

  At the bench I break the ceramic into porous granules, then wash out dust and sharp fines. The leach check passes for this surveyed material. Water can drain between the pieces while air reaches the roots.

- Unwatered growing beds

  Porous granules fill the three connected beds. There is space for air around the roots, but the medium is still dry.

- Irrigated growing beds

  Water darkens the porous granules in the deep potato and soybean beds, then drains back into the shared reservoir. At the shallow lettuce tray, water reaches the inlet below its dry root shelf; that shelf still needs a wick to draw water upward. One circuit will serve all three crops.


**Combinations**
- Ceramic blocks [consume] @ Root-medium wash bench -> Growing medium
- Growing medium [consume] + Empty growing beds [transform] -> Unwatered growing beds
- Drinking water supply + Unwatered growing beds [transform] -> Irrigated growing beds


## Potatoes, soybeans, lettuce

![Working surface](../mars-v8/assets/work-surface.svg)

Three seed packets lie beside the beds. The soybean row is ready to sow. The potato bay still needs a lightproof skirt, and the shallow lettuce shelf is dry above its water inlet: it needs an absorbent wick. The leaves and shoots will stay in the light.

> NOTE: Unfinished growing beds is the shared construction from the previous chapter: the reservoir and deep root zones have water, while the shallow lettuce shelf still needs its wick. Each planting uses its own existing zone, not a copied array of beds. The deep potato bay and shallow lettuce tray are prepared once; the soybean row already has the appropriate aerated medium. Crop identity persists through tending, storm and harvest. Foliage remains illuminated.

**Goals**
- (three goals are a lot but okay here because each of the three established crop zones has its own planting task)
- Plant the potatoes -- `potato-bed`
- Plant the soybeans -- Sown soybean row
- Plant the early leaves -- Sown lettuce tray

**Hotspots**
- Unfinished growing beds (at 25%, 15%)

**Items**
- Seed potatoes

  Certified small sprouting tubers. They go into the deep bay with room for new tubers below the foliage.

- Soybean seeds

  A compact soybean cultivar selected for the shared growing-room conditions. The nutrient solution supplies its nitrogen; no unprovided inoculation is assumed.

- Lettuce seeds

  Small seeds for a quick fresh-leaf crop. The tray is a small part of the planted area.

- Foil-backed cloth

  I back the reflective laminate with clean cloth. Held against a growing lamp, the flexible sheet lets no light through; the cloth protects it from tearing along a folded edge.

- Dark potato bay

  The skirt shades the root space and leaves the top open. New shoots will grow in light; developing tubers will remain dark.

- `potato-bed` Planted potato bed
  - from chapter "Under the leaves": Low-sided potato bed

  I settle the sprouting tubers into the deeper medium. Above the dark skirt, the first shoots will have room to spread.

- Sown soybean row

  The beans disappear into spaced pockets along the aerated row. Their harvest will hang above the medium, inside pods.

- Wicking lettuce bed

  A strip of clean absorbent fabric bridges the shallow tray's reservoir and root mat. It draws solution upward without another pump.

- Sown lettuce tray

  The tiny seeds settle into the damp wick. A shallow bed supplies their roots while the lamps reach the leaves above.


**Combinations**
- Packing foil [consume] + Clean cover fabric [consume] -> Foil-backed cloth
- Foil-backed cloth [consume] @ Unfinished growing beds -> Dark potato bay
- Seed potatoes [consume] + Dark potato bay [transform] -> `potato-bed`
- Soybean seeds [consume] @ Unfinished growing beds -> Sown soybean row
- Clean cover fabric [consume] @ Unfinished growing beds -> Wicking lettuce bed
- Lettuce seeds [consume] + Wicking lettuce bed [transform] -> Sown lettuce tray


## The first green

![Working surface](../mars-v8/assets/work-surface.svg)

Broad lettuce leaves reach over the shallow tray. The room has something fresh to add to the stored meals; a soft-lined basket will carry the harvest to the sink without scraping the leaves against bare cargo mesh.

> NOTE: The existing kitchen work surface supplies treated wash water and ordinary clean utensils. This first picking establishes the basket-and-crop action used again at the final harvest hotspots. The rooted lettuce remains alive.

**Goals**
- Make a lined basket for the harvest -- Lined harvest basket
- next: Taste what the growing room can do -- First fresh meal

**Hotspots**
- Clean preparation sink (at 25%, 15%)

**Items**
- Cargo mesh

  Coarse structural grid from the cargo packing, suitable for stiffened panels and plant supports. It is not fine enough to screen regolith.

- Lined harvest basket

  I bend the cargo mesh into a shallow basket and line it with a fresh clean piece of cloth. Leaves and tubers can rest on the lining without touching bare wire.

- Fresh lettuce leaves

  I pick the broad outer leaves into the lined basket and leave the small centre growing. Their edges break with a crisp snap.

- First fresh meal

  I wash the leaves at the cabin sink and add them to the stored meal. A sharp green smell rises from the bowl. Beyond the airlock, the landscape has supplied no green at all.


**Combinations**
- Cargo mesh [consume] + Clean cover fabric [consume] -> Lined harvest basket
- Lined harvest basket + Sown lettuce tray [preserve] -> Fresh lettuce leaves
- Fresh lettuce leaves [consume] @ Clean preparation sink -> First fresh meal


## Under the leaves

![Working surface](../mars-v8/assets/work-surface.svg)

The potato stems stand above the original skirt; more medium would spill over its low rim. Soybean pods pull against their stems. The same beds now need higher sides around the potatoes and support beside the beans.

> NOTE: These are the same planted crop zones, not new beds. Additional washed medium comes from the earlier prepared material. The potato root zone is dark while its foliage remains lit. The chosen soybean cultivar and installation benefit from support; this is not a claim that all soybeans require trellises. No second round of shared substrate or irrigation preparation.

**Goals**
- Keep new tubers dark -- Hilled potato bed
- Support the filling pods -- Supported soybean row

**Items**
- Extended potato bed

  I fasten a second strip above the original skirt, raising the dark collar around the lower stems. There is room inside it for more medium without burying the leaves.

- Hilled potato bed

  I raise the medium within the extended collar around the lower stems. New tubers can develop beneath it without turning green in the lamps.

- Supported soybean row

  A light mesh support fixes to the existing row frame. The stems rest against it as their pods begin to fill; the roots remain in the same aerated bed.


**Combinations**
- Foil-backed cloth [consume] + `potato-bed` [transform] -> Extended potato bed
- Growing medium [consume] + Extended potato bed [transform] -> Hilled potato bed
- Cargo mesh [consume] + Sown soybean row [transform] -> Supported soybean row


## What the water carries

![Working surface](../mars-v8/assets/work-surface.svg)

The tap coughs and stops. Brown material covers the raw-water strainer; its downstream pressure has fallen to zero.

> NOTE: The raw intake precedes treatment and all Earth-crop water. Its service assembly includes isolation, backflush, collection and restart controls; these ordinary operations are one complete action, not a jar magically fixing machinery. The microscope and containment are supplied laboratory equipment. The articulated ancient body is the story's extraordinary fictional premise. Morphology alone establishes neither age nor native origin.

**Goals**
- Clear the intake and restore water -- Collected intake residue
- next: Find out what blocked it -- First body on membrane

**Hotspots**
- Clogged raw-water strainer (at 25%, 15%)
- Laboratory microscope (at 75%, 15%)

**Items**
- Laboratory membrane

  Fine clean filtering material for separating suspended particles. It does not remove dissolved salts.

- Collected intake residue

  I connect a fresh clean hose to the housing’s backflush port and isolate the inlet. Brown residue washes into its clean collection jar. I cap the jar, reseat the strainer and prime the line; water returns to the tap. Most of the brown material is fine as flour, but a few curled flecks keep their shape.

- Particle-bearing membrane

  Rinse water passes through the membrane. The curled flecks spread apart; one has a regular row of projections along its edge.

- First body on membrane

  Under the microscope, tiny joints come into focus. The millimetre-scale speck has limbs and a segmented body, flattened against the filter. One side has fallen apart.
  
  I take my hands off the controls. This came through the well beneath my feet. I seal the membrane in its slide holder and send Earth the microscope record.


**Combinations**
- Clean service hose [consume] @ Clogged raw-water strainer -> Collected intake residue
- Laboratory membrane [consume] + Collected intake residue [transform] -> Particle-bearing membrane
- Particle-bearing membrane [transform] @ Laboratory microscope -> First body on membrane


## The ground we know

![Working surface](../mars-v8/assets/work-surface.svg)

*Mara, NASA surface support — recorded message:*

“I've watched that record six times. Science wants ice that has never passed through the melter. First, a reference core beside your well, beyond the heated cavity. Then the exposed layers beyond the wash—we can choose protected ice there, away from the station.”

“The receiving laboratories can examine internal structure and chemistry that your microscope cannot resolve. Flight is looking at an earlier rendezvous.”

> NOTE: The stable margin is outside the resource well's disturbed volume. The source core preserves a reference to that deposit; the farther exposed face permits choosing material within visible stratigraphy away from station disturbance. Mapping predicts a broad promising deposit, not a microscopic body. These are separate physical specimens.

**Goals**
- Take an unmelted reference from the water source -- Sealed source core
- next: Store it before the farther expedition -- Stored source core

**Hotspots**
- Unheated bank margin (at 25%, 15%)
- Laboratory core freezer (at 75%, 15%)

**Items**
- Core drill

  A complete clean coring unit with a trimming head, chilled barrel and transparent sealed liners. It takes interior ice without melting it.

- Sealed source core

  Beyond the heated cavity, pale ice comes up threaded with brown flakes. This time they remain where the ice held them. The liner closes before the core leaves the chilled barrel.

- Stored source core

  The sealed liner slides into its refrigerated cradle in the laboratory. The first membrane has a separate holder. Both stay here while I go farther from the well.


**Combinations**
- Core drill @ Unheated bank margin -> Sealed source core
- Sealed source core [transform] @ Laboratory core freezer -> Stored source core


## A box for the road

![Working surface](../mars-v8/assets/work-surface.svg)

The farther exposure lies beyond the soft wash. Its ice must reach the laboratory inside its original liner, so the field refrigerator needs a shell that can ride over that ground.

> NOTE: Steel and insulation form the outer protective enclosure around qualified precision refrigeration. The same physical case remains with the rover, then goes to the laboratory's cold enclosure. This is ordinary expedition preparation, not a sample-cooling emergency.

**Goals**
- Build and mount the refrigerated field case -- Buffered field case

**Hotspots**
- Rover cargo mount (at 25%, 15%)

**Items**
- Field refrigeration insert

  A supplied refrigerator with its core cradle, seals, shock mount and integral thermal buffer for transfer. Its compressor, controls and heat-rejection face must remain accessible.

- Uninsulated field refrigerator

  I fit the insert inside a shell cut and joined from the steel. A gap surrounds the cold cradle; the compressor and radiator project through their own openings. The shell can take a knock without passing it straight to the liner.

- Insulated field refrigerator

  Reflective insulation fills the space around the cold insert, leaving its shock mounts free to move. The compressor and radiator remain uncovered. The cradle is protected without trapping the heat that refrigeration must reject.

- Buffered field case

  The case locks to the rover's powered cargo mount. Its radiator remains exposed. There is one empty cradle inside, waiting for the farther core.


**Combinations**
- Steel [consume] + Field refrigeration insert [consume] -> Uninsulated field refrigerator
- Reflective insulation [consume] + Uninsulated field refrigerator [transform] -> Insulated field refrigerator
- Insulated field refrigerator [transform] @ Rover cargo mount -> Buffered field case


## Across the wash

![Working surface](../mars-v8/assets/work-surface.svg)

The survey's safe approach crosses a shallow wash. Firm rock shows on both sides, but the middle is soft enough to swallow a wheel; the exposed ice lies beyond it.

> NOTE: This is a short supported crossing, not an unsupported mesh bridge. Ground preparation, anchor assessment and ordinary vehicle operation are included. No arbitrary new breakdown is introduced. The rover, power, traction and recovery hardware were delivered; the player makes useful panels from known materials. The actual refrigerated case is already aboard.

**Goals**
- Make a supported crossing -- Supported traction panels
- next: Take the rover across -- Rover beyond the wash

**Hotspots**
- Shallow wash crossing (at 25%, 15%)
- Sound rock anchor (at 75%, 15%)

**Items**
- Rover winch

  The existing powered recovery winch with its matched line, rated anchor sling and rock protection. These are parts of one recovery assembly.

- Framed traction panels

  Steel rails stiffen the mesh into short wheel-width panels. I press down on a corner: the frame carries the force across the grid instead of letting it fold around my boot.

- Supported traction panels

  The short panels lie on prepared firm approaches and supported ground through the shallow soft section. The rails spread wheel loads; loose mesh alone would sink.

- Anchored rover winch

  The recovery sling seats around the assessed sound rock. I take up the line through the rover's winch. That anchor will keep the pull aligned while the wheels cross the soft ground.

- Rover beyond the wash

  The winch keeps the slow crossing controlled while the wheels stay on the panels. On the far bank I release the line. The same supported route will carry the return trip.


**Combinations**
- Steel [consume] + Cargo mesh [consume] -> Framed traction panels
- Framed traction panels [transform] @ Shallow wash crossing -> Supported traction panels
- Rover winch [transform] @ Sound rock anchor -> Anchored rover winch
- Anchored rover winch [consume] + Supported traction panels [preserve] -> Rover beyond the wash


## A clean face

![Working surface](../mars-v8/assets/work-surface.svg)

Beyond the wash, a brown band crosses the ice below a clear cap. From here I can follow the layer into the protected interior; the orbital survey could never show this fine detail.

> NOTE: The bank is low and stable, not an overhang. The supplied corer performs its ordinary surface trimming, chilled coring and containment in one substantial operation. This remote specimen remains distinct from the known-source core and first membrane.

**Goals**
- Bring back ice from within the band -- Case with frozen band core

**Hotspots**
- Sheltered brown band (at 25%, 15%)

**Items**
- Sealed band core

  The clean head trims the exposed face, then takes interior ice across the brown layer. The transparent liner seals around a cylinder with clear ice above and below the band.

- Case with frozen band core

  The liner settles into the cold cradle. I secure the case, retrace the supported crossing and take it straight to the laboratory. This time the brown material has kept its surroundings.


**Combinations**
- Core drill @ Sheltered brown band -> Sealed band core
- Sealed band core [consume] + Buffered field case [transform] -> Case with frozen band core


## Something folded

![Working surface](../mars-v8/assets/work-surface.svg)

Back at the station, the new core lies beside the freezer holding the first. A dark fleck sits deep inside its brown band; on the intake membrane, everything was flattened.

> NOTE: The whole sealed core and case enter the supplied contained cold enclosure. Only an external optical face is prepared; the inclusion and surrounding layers remain intact. The future cold microscope has appropriate transmitted/reflected illumination and stage control. The articulated body is fictional and does not establish age, taxon, DNA or native origin. All sample storage remains qualified and reliable through the later storm.

**Goals**
- Make a clear view into the ice -- Windowed core case
- next: Resolve the folded outline -- Case with an articulated body

**Hotspots**
- Cold preparation enclosure (at 25%, 15%)
- Cold microscope (at 75%, 15%)

**Items**
- Windowed core case

  The contained preparation head makes a flat optical face in the outer ice through the liner's working port. Its cover closes again. The dark fleck remains untouched beneath it.

- Case with an articulated body

  The stage turns under the microscope's transmitted light. A joint, then another: folded limbs and a segmented body come into view. This one is whole, held inside the brown layer.
  
  I keep one hand beside the case for a moment, then send the view to Earth. Both cores settle onto the laboratory's essential cooling circuit; the first membrane remains in its own holder.


**Combinations**
- Case with frozen band core [transform] @ Cold preparation enclosure -> Windowed core case
- Windowed core case [transform] @ Cold microscope -> Case with an articulated body


## A different use for the sunlight

![Working surface](../mars-v8/assets/work-surface.svg)

*Mara, Earth — recorded message:*

“The discovery takes priority over the remaining surface survey. Flight has approved a return plan, but the normal cargo delivery cannot support it. Use the workshop's local-propellant contingency. The receiving laboratories can investigate what the surface instruments cannot.”

I carry the spare array modules to the marked fuel-fab area. That is what I am building next.

> NOTE: This mission demonstrates a partly self-supplying station. Its modular workshop and life-support spares support a reviewed local-propellant contingency, not a supplied complete fuel plant. Normal fuel follows a slower cargo schedule. The orbital transfer vehicle and approved earlier trajectory are declared mission premises; local ascent fuel does not choose interplanetary windows. The damaged ground support is stable and its repair is known. Routine installation uses the established ceramic blocks, steel and qualified cable; these do not require another sequence of empty supports.

**Goals**
- Prepare a stable industrial site -- Fuel-fab footing
- next: Add power for making propellant -- Industrial solar supply

**Hotspots**
- Fuel-fab area (at 25%, 15%)

**Items**
- Spare solar modules

  Factory-made panels and controllers delivered for the mission's later materials-processing trials. They are additional capacity, not panels manufactured from sand.

- Fuel-fab footing

  The excavator clears and levels the bay. I lay the workshop’s fired blocks over the prepared ground, giving the equipment broad, stable feet clear of the lander and habitat entrances.

- Industrial solar supply

  I fasten the spare modules to steel supports on the prepared site and connect their qualified lead and controller. The new rack feeds a separate industrial circuit. The growing room keeps its allotted power; the added capacity can work for the journey home.


**Combinations**
- Working survey excavator @ Fuel-fab area -> Fuel-fab footing
- Spare solar modules [consume] + Fuel-fab footing [preserve] -> Industrial solar supply


## Two gases from water

![Working surface](../mars-v8/assets/work-surface.svg)

The service crate holds a spare electrolyzer stack and its qualified plumbing. It was packed for the station's water-recovery and materials programme; the new power connection lets it work for the journey home.

> NOTE: The newly assembled rack has two physically distinct, dedicated gas buffers. Its hydrogen and oxygen outlets become fixed receiving surfaces later. Gas cylinders denote a batch of real compatible clean vessels, not one bottle copied or switched between incompatible duties. Both gases are produced by one water-splitting process.

**Goals**
- Assemble the electrolysis installation -- Fed electrolyzer
- next: Collect its gases in separate circuits -- Buffered electrolysis rack

**Hotspots**
- Processor polishing outlet (at 25%, 15%)

**Items**
- Electrolyzer stack

  The complete spare electrochemical core with its dedicated outlet gas/liquid separation and drying cartridges. Electricity splits specially polished water; the separated product gases leave through conditioned dry outlets.

- Gas-control manifold

  Standardized valve and control blocks from the modular workshop. Separate blocks serve the electrolysis and reactor installations, with the supplied profiles and compatible pressure/power interfaces.

- Gas cylinders

  Clean stainless-steel cylinders from the modular process equipment. Each receives its designated keyed connection and stays dedicated to that gas. Distinct cylinders serve hydrogen, oxygen, carbon dioxide and the contained methane test.

- Unfed electrolysis rack

  I fit the stack and control blocks to a steel rack. Two labeled outlet paths remain separate all the way to their shutoff valves. The feed connection is still empty: this stack needs the processor’s polished water.

- Fed electrolyzer

  At the processor outlet, the supply passes through the stack's feed-polishing stage. The power and cooling connections engage with the manifold. Its two gas outlets remain separate.

- Buffered electrolysis rack

  I connect two distinct cylinders to their keyed outlets. The stack splits water, separates entrained liquid and dries each gas through its dedicated conditioning path. Hydrogen collects on one side, dry oxygen on the other. Each has its own regulator and line; the automatic run stops when either buffer is full.


**Combinations**
- Gas-control manifold [consume] + Electrolyzer stack [consume] -> Unfed electrolysis rack
- Unfed electrolysis rack [transform] @ Processor polishing outlet -> Fed electrolyzer
- Gas cylinders [consume] + Fed electrolyzer [transform] -> Buffered electrolysis rack


## Metal from the red ground

![Working surface](../mars-v8/assets/work-surface.svg)

*Mara, Earth — recorded message:*

“The lab team has stopped calling it a speck. They want to see inside those folded joints without thawing away their surroundings. Keep the whole core.”

Outside, the electrolyzer has filled its first buffers. The workshop came to test whether this ground could become useful metal. Its first finished iron will carry the reactor that makes our return fuel; the mineral-processing retort still sits unconnected beside the hydrogen outlet. The survey identifies a magnetic iron-bearing fraction in the spoil; it needs separating before it enters the retort.

> NOTE: Hydrogen reduction and sintering have research precedents; this compact plant, separable assayed feedstock and useful consolidated product are explicit future/site assumptions. The supplied press and retort handle atmosphere, temperature, consolidation and ordinary tests. The retort remains one unique vessel; its removable mineral liner is exchanged for a clean catalyst cartridge later. Local iron is not a catalyst or pressure vessel. The receiving lab's questions maintain the discovery's purpose without an extra comparison assay.

**Goals**
- Make usable iron from the local feedstock -- Consolidated iron
- next: Make the process frame -- Iron process frame

**Hotspots**
- Workshop press (at 75%, 15%)
- Hydrogen service outlet (at 25%, 32%)

**Items**
- Unconnected materials retort

  A supplied sealed process vessel with a removable mineral liner, controlled gas connections and a compatible furnace interface. Its reduction cycle separates porous metal into a protected carrier; the heated press performs the later consolidation.

- Separator electromagnet

  Insulated conductor winds around a piece of the salvaged steel. Connected through the workshop's current-limited low-voltage supply, the coil makes a magnetic separator; switching it off releases the collected grains.

- Iron-rich concentrate

  The magnetic fraction gathers in a dark ridge. The survey assay identifies suitable iron-bearing minerals in this feedstock; the red colour alone would not tell me that.

- Hydrogen-fed retort

  I seat the retort in the existing solar receiver and connect its rated hydrogen line. Its mineral liner is ready for the concentrate; the gas controls keep process exhaust and condensate contained. Heat and reducing gas now meet at the same vessel.

- Reduced iron sponge

  Inside the controlled hot retort, hydrogen takes oxygen from the concentrated minerals. The separated reduced metal is porous and weak. Its protected process carrier brings it to the press.

- Consolidated iron

  The press's heated controlled-atmosphere cycle closes the pores and bonds the reduced particles. A dense billet replaces the crumbly sponge; shaping useful parts is a different operation.

- Iron bars and brackets

  The workshop press shapes the consolidated iron into useful lengths and brackets. These are non-pressure supports, not flight hardware.

- Iron process frame

  Local iron now stands on the fired footings, carrying a frame for the gas installation. The precision vessel will fit inside something made from this place.


**Combinations**
- Power cable [consume] + Steel [consume] -> Separator electromagnet
- Separator electromagnet [preserve] + Screened regolith [consume] -> Iron-rich concentrate
- Unconnected materials retort [transform] @ Hydrogen service outlet -> Hydrogen-fed retort
- Iron-rich concentrate [consume] + Hydrogen-fed retort -> Reduced iron sponge
- Reduced iron sponge [transform] @ Workshop press -> Consolidated iron
- Consolidated iron [consume] @ Workshop press -> Iron bars and brackets
- Iron bars and brackets [consume] + Fuel-fab footing [transform] -> Iron process frame


## From the thin air

![Working surface](../mars-v8/assets/work-surface.svg)

The atmospheric processor has been replenishing our oxygen since the first power repair. Its capture stage already gathers the other ingredient the fuel plant needs: carbon dioxide.

> NOTE: This is the same atmospheric processor brought online during the initial power repair. Its selective capture/compression stage feeds a qualified carbon-dioxide takeoff upstream of oxygen production. Separate controlled branches maintain breathing oxygen and process feed under the declared capacity. The receiving surface becomes available for the fuel task here. Rated service plumbing is routine; no second atmospheric machine, homemade gas separator or carbon-monoxide feed is introduced.

**Goals**
- Collect carbon dioxide from the working processor -- Compressed carbon dioxide

**Hotspots**
- Atmospheric carbon-dioxide outlet (at 25%, 15%)

**Items**
- Compressed carbon dioxide

  I connect a clean cylinder to the processor’s separate takeoff. Captured carbon dioxide fills it before reaching the oxygen-making cell; the breathing-oxygen line keeps running. One ingredient for methane came from the well, the other from the same machine that helps me breathe.


**Combinations**
- Gas cylinders [consume] @ Atmospheric carbon-dioxide outlet -> Compressed carbon dioxide


## The first methane

![Working surface](../mars-v8/assets/work-surface.svg)

The materials retort is cool and empty. Its mineral liner lifts out as a closed insert; the clean spare catalyst cartridge fits the same vessel.

> NOTE: The supplied retort, replaceable liners, catalyst and control head are deliberately compatible future service hardware, rated for these uses. The existing hydrogen connection persists into the reactor; carbon dioxide is its additional feed. This is a small contained commissioning run. Continuous production waits for purification, recycle, storage and full heat rejection. The fixed reactor remains at the process bay.

**Goals**
- Build the controlled reactor -- Controlled methane reactor
- next: Make its first contained methane -- Unpurified methane test cylinder

**Items**
- Sabatier catalyst cartridge

  A clean spare nickel-based catalyst cartridge from the compatible life-support service kit. Its engineered surfaces support the carbon-dioxide/hydrogen reaction; ordinary iron ore cannot replace it.

- Catalyzed retort

  The sealed mineral insert comes out; the clean catalyst cartridge takes its place. Nothing from the ore batch is left in the new gas path.

- Controlled methane reactor

  I secure the vessel in the local iron frame and fit the workshop’s gas-control blocks. The retained hydrogen line reaches one inlet; the other is marked CO₂. The controls can warm the catalyst, meter both feeds and carry away reaction heat. A hot reaction needs cooling as well as a way to start.

- Unpurified methane test cylinder

  I connect the carbon-dioxide cylinder to the second inlet and a separate clean gas cylinder to the test outlet. The metered commissioning run stops and isolates itself. Its sensor finds methane alongside water vapour and unreacted gases. The fuel molecule is here; it is not yet ready for a rocket tank.


**Combinations**
- Sabatier catalyst cartridge [consume] + Hydrogen-fed retort [transform] -> Catalyzed retort
- Catalyzed retort [consume] + Iron process frame [transform] -> Controlled methane reactor
- Compressed carbon dioxide [preserve] + Controlled methane reactor [preserve] -> Unpurified methane test cylinder


## The water comes back

![Working surface](../mars-v8/assets/work-surface.svg)

A film of moisture gathers inside the test cylinder. The reaction makes water as well as methane; the working plant must recover that water and remove what the engine cannot use. The separator’s condenser has open coolant connections: its heat needs a path to the outside before it can collect the water.

> NOTE: The imported separator contains the condenser, dryer, purifier and recycle controls. The local panel spreads heat from qualified coolant tubing without becoming a pressure vessel. Its material, surface and area meet the declared workshop design under the story's site/energy assumptions; it does not rely on thin-air convection alone. The water return connects only after cooling and separation exist, and the resulting actual reactor assembly supplies continuous gas after the contained test. Ordinary flow checks are bundled.

**Goals**
- Complete the separation and water return -- Water-recovering methane reactor
- next: Feed clean methane from the actual reactor -- Purified methane supply

**Items**
- Coolant tubing

  Qualified coolant tubing for the process loop, with fittings that keep it separate from gas and drinking-water circuits.

- Uncooled gas separator

  The supplied condenser, separator, dryer and purification/recycle core. It removes product water and returns unreacted gas to the reactor.

- Process cooling panel

  The qualified tubing runs against a broad folded metal panel, clamped into good thermal contact. Its dark outer faces radiate away process heat; the panel is sized to the workshop's cooling design and left uncovered.

- Cooled separator module

  I join the panel to the separator’s coolant circuit and leave its dark radiating faces exposed. The condenser has a route for shedding heat; gas must still reach its separate process inlet.

- Purifying methane reactor

  The cooled separator joins the actual reactor outlet. It can condense water, dry and polish methane, and return unreacted gas through its own line.

- Water-recovering methane reactor

  I run the clean hose from the separator’s liquid outlet to the existing water-treatment return. Reaction water has a real route back through polishing and electrolysis, separate from the gas outlets; it no longer ends at an unconnected port.

- Purified methane supply

  The test batch passes through the completed equipment. Its cylinder empties, and the reactor's controlled outlet continues through the same purification route. Clean methane now leaves an actual connected installation; water and recycled reactants follow their own paths.


**Combinations**
- Coolant tubing [consume] + Steel [consume] -> Process cooling panel
- Process cooling panel [consume] + Uncooled gas separator [consume] -> Cooled separator module
- Cooled separator module [consume] + Controlled methane reactor [transform] -> Purifying methane reactor
- Clean service hose [consume] + Purifying methane reactor [transform] -> Water-recovering methane reactor
- Unpurified methane test cylinder [consume] + Water-recovering methane reactor [transform] -> Purified methane supply


## Two cold stores

![Working surface](../mars-v8/assets/work-surface.svg)

The two propellants must become liquid. The workshop uses matched cryogenic vessel and refrigerator types, with separate vessels and flow paths for each gas. Once each liquid has its own store, their controllers can coordinate production without connecting the propellants.

> NOTE: A batch of two qualified vessels and two adjustable factory cooling units is prepared together, then its separate members are dedicated to methane and oxygen. The material-stock model does not copy one unique vessel into both roles. Controllers, vacuum jackets, pressures, cleanliness and refrigeration capacity are declared imported capabilities. Local housings and insulation remain outside those boundaries. Common operating controls coordinate the connected installation without joining the gas or liquid paths.

**Goals**
- Collect the two propellants separately
  - both: Tank of liquid methane
  - and: Tank of liquid oxygen
- next: Link the two stores’ operating controls -- Running fuel fab

**Hotspots**
- Oxygen service outlet (at 25%, 15%)

**Items**
- Cryogenic tanks

  Two separate compatible stainless inner vessels with factory vacuum jackets, oxygen-clean surfaces, individual vents and rated connections. Each is assigned to one propellant and keeps that assignment.

- Cryogenic cooling units

  Two factory refrigerator units from the modular process kit, each qualified for the required liquefaction duty and setpoint. They use separate clean process connections and do not mix the gases.

- Refrigerated cryogenic tanks

  I fit the two vessels into protective steel housings with the known insulation, then attach a refrigerator to each. Each receives its own power and heat-rejection connections. One is labeled methane, the other oxygen; their keyed liquid fittings cannot cross-connect. The factory walls hold pressure and vacuum. My housings protect them.

- Tank of liquid methane

  Dry methane flows through its liquefier. In the qualified receiver, the first liquid collects; its insulated outer shell stays above the cold inner vessel.

- Tank of liquid oxygen

  Conditioned dry oxygen passes from the electrolysis outlet through its dedicated liquefier. The liquid collects in its own oxygen-clean vessel, with separate cooling, vent and transfer connections.

- Running fuel fab

  The two commissioned stores join the installation's coordinated operating controls. They were already powered and cooled separately; their propellant circuits stay apart. Both collect their own output from the complete process. The installation can supply the ascent tanks.


**Combinations**
- Cryogenic cooling units [consume] + Cryogenic tanks [consume] -> Refrigerated cryogenic tanks
- Purified methane supply [consume] + Refrigerated cryogenic tanks [consume] -> Tank of liquid methane
- Refrigerated cryogenic tanks [consume] @ Oxygen service outlet -> Tank of liquid oxygen
- Tank of liquid methane [consume] + Tank of liquid oxygen [consume] -> Running fuel fab


## Heat worth keeping

![Working surface](../mars-v8/assets/work-surface.svg)

The process loop carries warmth the growing room can use. In the pressurized service alcove, a water tank can hold some of that heat after the machinery stops.

> NOTE: The locally formed steel tank stays inside the pressurized farm service alcove. It contains non-potable low-temperature heating water at room pressure; the qualified tubing retains the process coolant. The supplied service spine provides sealed exterior connections. The tank supplements the electric heater, cannot supply cooking heat and does not generate energy. Fit the coil while the tank is empty; after that, filling the tank and attaching its exterior insulation can happen in either order. Both routes reach the same filled, insulated vessel before connection to the heat source. Ordinary cutting, joining and tube forming use the existing tool kit; no dedicated imported drum is supplied. The room-facing insulation is a removable flap. Closing the coil’s outdoor service valves isolates the cooling loop; exposing the tank wall then releases stored heat directly to room air. There is no unprovided secondary heating circuit. The tank is a finite supplement to the continuing electric heater.

**Goals**
- Store useful warmth -- Warm water tank

**Hotspots**
- Indoor heat-recovery connection (at 25%, 15%)

**Items**
- Steel tank without a coil

  I cut and join the sheet into a watertight tank with a vented lid, sized for the indoor service alcove. It will hold non-potable heating water at room pressure, with coolant confined to a separate coil.

- Unfilled uninsulated tank

  I bend the tubing into a coil and fit it inside the tank. Process coolant will stay sealed inside that coil; the separate heating water will surround it.

- Unfilled insulated tank (exclusive with Uninsulated filled tank)

  Reflective insulation wraps the outside, leaving the vent and fittings clear. The room-facing section can fold back to release warmth from the steel. The tank is ready for water.

- Uninsulated filled tank (exclusive with Unfilled insulated tank)

  Water fills the space around the sealed coil. The coolant stays inside its tubing, separate from the tank water. The bare outer wall still needs insulation to hold the stored warmth.

- Unheated water tank

  Water surrounds the sealed coil inside the insulated tank. The two fluids have separate paths; the vent remains open to room air. The coil’s service connections still await the heat source.

- Warm water tank

  I connect the coil through the service spine to the process cooling loop. Warmth spreads into the water around it; the thermostat limits its temperature. The room-facing insulation opens as a flap. Closed, it holds warmth in the water; folded back, it exposes the warm steel to the room.


**Combinations**
- Steel [consume] + Tool kit -> Steel tank without a coil
- Coolant tubing [consume] + Steel tank without a coil [transform] -> Unfilled uninsulated tank
- Reflective insulation [consume] + Unfilled uninsulated tank [transform] -> Unfilled insulated tank
- Drinking water supply + Unfilled insulated tank [transform] -> Unheated water tank
- Drinking water supply + Unfilled uninsulated tank [transform] -> Uninsulated filled tank
- Reflective insulation [consume] + Uninsulated filled tank [transform] -> Unheated water tank
- Unheated water tank [transform] @ Indoor heat-recovery connection -> Warm water tank


## Amber noon

![Working surface](../mars-v8/assets/work-surface.svg)

*Mara, Earth — recorded message:*

“Storm alert. Science advises a major regional dust storm over your site. You may lose most of your solar power. The essential reserve covers the forecast interruption. Stop the industrial loads and protect the growing room.”

Outside, the sunlight has turned brown.

Inside the habitat, the service panel has separate controls for essential power, the well and the fuel fab. Its indicators report the valves and machinery outside.

> NOTE: This compound is a diagram of the existing control panel: fitted system icons record operating the corresponding switches. No reserve, hose or fuel factory is physically put inside the panel. The fourth position is the later solar-restoration command; it cannot be filled until the arrays are cleaned after the storm. All three shutdown states and restored power are required before restart.  The delivered reserve is specified for the forecast interruption at essential loads. Electric heating continues at reduced settings; the water buffer supplements it. Qualified laboratory sample storage already has essential power and requires no rescue or switchover puzzle. The industrial systems shut down through their provided controls, with separate safe cryogenic venting. The atmospheric processor shuts down with the other high-temperature loads; stored breathing gas and the running scrubber carry the oxygen requirement through the forecast interruption. The wall-mounted service panel sends commands to the separate installed electrical, well and fuel-plant controllers; their fluids do not run through a common indoor cabinet. Each local controller finishes its shutdown cycle before that load loses power. The well’s supplied drain circuit clears low points into the raw-water receiver and admits replacement gas; line drainage and plant shutdown may finish in either order.

**Goals**
- Put the station on reserve -- Station service panel[Charged essential reserve]
- next: Leave the exterior circuits safe -- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab]

**Items**
- Station service panel (compound)
  - slot: Essential power selected, accepts Charged essential reserve
  - slot: Well isolated and drained, accepts Insulated water line
  - slot: Fuel fab shut down, accepts Running fuel fab
  - slot: Solar operation restored, accepts `restored-power`

  The habitat’s wall panel has separate controls for the reserve, well and fuel fab. Each indicator reports its own machinery outside. Selecting a system here operates that system’s controls.

- Station service panel

  [Charged essential reserve] I select essential power. Production stops; shutdown controls and cooling remain powered until their sequences finish. Air handling, reduced heat and laboratory refrigeration stay on reserve.

- Station service panel

  [Insulated water line] I select well isolation and line drain. The head closes its inlet, and the service circuit empties the heated hose into the processor’s raw-water receiver. Only then does the trace heating switch off. The well indicator confirms the line is drained.

- Station service panel

  [Running fuel fab] I select the fuel-fab shutdown. Its controller completes cooldown and isolation before the remaining industrial load disconnects. Process feeds close; the two cold tanks retain part of their liquid while their separate outdoor vents release boil-off. The indicator confirms the machinery is safe.

- Station service panel

  [Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`] I select solar operation. The controller warms and checks the well head and empty line, then admits water from the habitat buffer to prime the circuit. Only after the water check passes do the same fuel-fab controls open their feeds and complete the restart. Separate tanks begin replacing what vented during the storm.


## Keep the roots alive

![Working surface](../mars-v8/assets/work-surface.svg)

The fixed beds fill most of the growing room. They need enough warmth, light and circulating water to survive the storm; productive growth can resume when the solar supply recovers.

> NOTE: The supplied reserve connection operates the same established pump system, not a new pump invented for one crop. The cover reduces heat loss without sealing away oxygen. The existing heater and reserve are the continuing energy source; recovered warmth softens initial cooling. Sample cooling is not part of this arc. Stored food supplies this supper; there is no repeated lettuce-meal recipe.

**Goals**
- Reduce heat and light losses -- Screened growing area
- next: Protect the circulating reservoir -- Insulated nutrient reservoir

**Hotspots**
- Growing-room service rail (at 25%, 15%)
- Shared nutrient reservoir (at 75%, 15%)

**Items**
- Farm thermal screen

  Clean cloth encloses the loose insulation, and reflective laminate faces the lamps. I leave an overlap for the service rail and an open lower edge for ventilation; this will divide the warm crop space from the empty aisle.

- Screened growing area

  The screen closes off the unplanted service aisle and directs the dimmed lamps over the actual crop area. It leaves the ventilation route open. The potatoes, soybean pods and lettuce remain in their original beds.

- Covered nutrient reservoir

  Sheet is cut around the actual reservoir's return and aeration fittings. The cover limits evaporation while leaving those openings clear; the roots still need air.

- Insulated nutrient reservoir

  Insulation fits over the new cover. I select low-power circulation, close the heat tank’s outdoor service valves and fold back its room-facing insulation. Warm air rises along the exposed steel; the reserve heaters carry the continuing load.
  
  Mara’s forecast update has a sentence at the end: “It’s raining outside my window.”


**Combinations**
- Reflective insulation [consume] + Clean cover fabric [consume] -> Farm thermal screen
- Farm thermal screen [consume] @ Growing-room service rail -> Screened growing area
- Steel [consume] @ Shared nutrient reservoir -> Covered nutrient reservoir
- Reflective insulation [consume] + Covered nutrient reservoir [transform] -> Insulated nutrient reservoir


## Sun on the floor

![Working surface](../mars-v8/assets/work-surface.svg)

The sky clears. Soybean leaves face the dim lamps; beneath the potato collar, the medium is still damp. Outside, settled grit covers the arrays.

> NOTE: The original array identity changes its displayed name to Dust-coated solar supply on arrival here. The new Station solar supply has a distinct identifier; cleaning transforms and retires the old identity. The delivered arrays use removable panel sections; the workshop cleaning bench is a normal service surface, not a second array. Each section is isolated, cleaned and refitted. The service-panel compound retains the actual reserve, well and fuel-fab control states; its restored-power connection performs the normal sequenced restart, with line warming, priming and checks before process feeds reopen. No extra control hardware, icon work or engine change is implied.

**Goals**
- Clean the dust-coated panel sections -- `restored-power`
- next: Restore the well and fuel fab -- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`]

**Hotspots**
- Array cleaning bench (at 25%, 15%)

**Items**
- `restored-power` Station solar supply

  I isolate the controllers and lift the removable panel sections onto the workshop’s clean service bench. A fresh cloth wrapped around a smooth steel handle lifts the loose grit with light strokes. I refit the sections and reconnect the two racks; useful output returns. The room lamps brighten and the atmospheric processor resumes replenishing the breathing reserve.


**Combinations**
- `station-power` [transform] @ Array cleaning bench -> `restored-power`


## The leg that stays

![Working surface](../mars-v8/assets/work-surface.svg)

The plant is working, and temporary cribbing still carries the spacecraft’s low side. The surviving lower-stage joints can hold a new braced support on a broad footing.

> NOTE: The initial inspection established a repairable grounded lower support. The replacement uses qualified salvaged steel and the checked non-pressure footing blocks; the original upper cabin, tanks and engine remain intact. Ordinary lifting, cribbing, fastening and controlled load transfer belong to the installation procedure, not separate inventory puzzles. The prepared-ground result represents the real site; assembly and fitting happen there, without carrying ground to the spacecraft. These are lower-stage ground supports, not fabricated flight engines or pressure tanks.

**Goals**
- Build the replacement ground support -- Replacement landing leg
- next: Restore a level launch platform -- Level launch platform

**Hotspots**
- Lander support ground (at 25%, 15%)
- Tilted lander (at 75%, 15%)

**Items**
- Prepared support ground

  The excavator clears loose material beside the temporary cribbing, keeping clear of the loaded supports. Firm ground is exposed for the new footing.

- Replacement landing leg

  On the prepared ground I lay checked ceramic blocks beneath broad steel plates and fasten the short braced frame above them. The plates spread its load over the blocks. The finished support matches the ground-support dimensions and the sound lower-stage joints.

- Level launch platform

  Using the spacecraft’s normal service equipment, I unload the damaged support, fit the replacement and ease the weight onto it. The footing holds. From the hatch, the ladder reaches the ground straight.
  
  This leg will stay on Mars when the upper cabin lifts away.


**Combinations**
- Working survey excavator @ Lander support ground -> Prepared support ground
- Steel [consume] + Prepared support ground [transform] -> Replacement landing leg
- Replacement landing leg [consume] @ Tilted lander -> Level launch platform


## Two tanks, two liquids

![Working surface](../mars-v8/assets/work-surface.svg)

The production run is complete. The plant has replaced the storm losses and collected the required propellant; the level spacecraft has separate methane and oxygen filling connections.

> NOTE: The actual repaired staged lander receives the actual plant's two liquids through distinct qualified lines and controls. Production duration and rates are an explicit future mission abstraction. The installed cold stores and flight tank refrigerators maintain their separate systems. The locally braced lower landing platform remains on Mars.

**Goals**
- Fill the separate ascent tanks -- Fueled ascent tanks

**Hotspots**
- Lander propellant service connections (at 25%, 15%)

**Items**
- Fueled ascent tanks

  I connect the methane line to the fuel inlet and the oxygen-clean line to the separate oxidizer inlet. The service controller checks both keyed connections before the two transfers begin. Inside the same cabin I landed in, both level indicators rise to their flight marks. The propellants remain apart until they reach the engine.


**Combinations**
- Station service panel[Charged essential reserve, Insulated water line, Running fuel fab, `restored-power`] [preserve] @ Lander propellant service connections -> Fueled ascent tanks


## A hearth for the harvest

![Working surface](../mars-v8/assets/work-surface.svg)

The spacecraft is repaired and fueled. Mara confirms that departure must wait for the rendezvous alignment; the specimens remain secure in their laboratory cooling.

The farm survived the storm. I can make a proper meal from it: potato and soybean stew with fresh lettuce.

> NOTE: The food pressure vessel is imported; the conductive jacket and support are made from known materials around the real pot. The existing receiver provides temperature control. This uses high-temperature furnace heat, not the low-grade water buffer. The brief departure hold is an orbital-alignment condition, not a countdown or waiting mechanic. Engineering and fueling are complete before this celebratory pause. The actual specimens board afterward, immediately before the astronaut commands ascent.

**Goals**
- Build a clean cooker around the existing heat source -- Solar cooking pot

**Hotspots**
- Solar cooking connection (at 25%, 15%)

**Items**
- Pressure cooking pot

  A supplied food-safe pressure vessel with its lid, absolute-pressure regulator and handling cradle. It can cook outside the habitat without boiling its contents away into the thin air.

- Jacketed cooking pot

  I form and fit a close-contact metal jacket around the supplied pressure vessel. A quick-release clamp will join it to the furnace's secondary heating block, leaving the pot removable in its handling cradle.

- Solar cooking pot

  The clamp seats the jacket on the receiver's controlled secondary heating block. Heat now has a conductive path into the clean sealed pot. The sunlight that fired the floor can cook supper; industrial material and gases never touch the food.


**Combinations**
- Steel [consume] + Pressure cooking pot [consume] -> Jacketed cooking pot
- Jacketed cooking pot [transform] @ Solar cooking connection -> Solar cooking pot


## Potato and soybean stew

![Working surface](../mars-v8/assets/work-surface.svg)

The potato foliage is dying back and the soybean pods are dry. The lettuce still has fresh outer leaves. The beans need thorough cooking before the potatoes join them in the same pot.

> NOTE: The three harvesting hotspots are the actual previously planted and tended crop zones, now represented in their harvest-ready state. Lettuce tray ready to pick is the same living tray from the first green meal, represented as a working surface here rather than carried as an item. They do not exist as early receiving surfaces, so a player cannot harvest the soybean stand before the storm. The same woven cloth provides fresh food-safe pieces, never reused industrial cloth. The same basket is emptied between crops. Ordinary washing and cutting use the established sink and utensils. The closed pressure vessel comes indoors before opening, and is resealed before outdoor reheating. Mature soybeans receive a complete cooking cycle before potatoes are added. The basket harvests each crop at its own hotspot. The final lettuce result includes washing at the established sink and has its own identity, so leaves from the first meal cannot supply this supper. The rooted tray stays alive; serving joins the fresh greens with the stew. There is no flight-food packing.

**Goals**
- Cook the beans thoroughly -- Pot of cooked soybeans
- next: Serve potato and soybean stew with fresh lettuce -- Stew and lettuce supper

**Hotspots**
- (three hotspots are a lot but okay here because each is a different established crop zone and the same basket harvests all three)
- Potato bed ready to lift (at 25%, 15%)
- Soybean row ready to gather (at 75%, 15%)
- Lettuce tray ready to pick (at 25%, 32%)

**Items**
- Prepared potatoes

  I lift pale, solid potatoes from the original dark bed into the lined basket, then wash and cut them at the cabin sink. The seed pieces I planted have become a substantial harvest.

- Gathered soybean pods

  The dry pods come from the same supported row that endured the storm. I empty the basket onto the clean work surface.

- Dry soybeans

  A fresh cloth catches the beans as I open the dry pods. They rattle together, firm and whole. These are food to cook, not beans to eat raw.

- Soaked soybeans

  The sorted beans swell in clean water. I drain and rinse them when their preparation is complete; the cooking vessel is ready.

- Pot of cooked soybeans

  The soaked beans go into the pot with measured cooking water. I seal the lid, return the pot to its outdoor heating connection and run the full bean-cooking programme. I bring the closed vessel back through the airlock before releasing its pressure. A bean crushes easily beneath the kitchen spoon. The potatoes have not gone in yet.

- Potato and soybean stew

  The prepared potatoes join the tender beans with oil and seasoning from the ordinary food supplies. I reseal the same pot for its second heating outside, then bring it indoors before opening. Potato breaks against the spoon, thickening the broth.

- Washed supper lettuce

  I gather broad outer leaves into the lined basket, leaving the small centre of the same tray growing. At the cabin sink I rinse the fresh picking and let the water drain away. These leaves are ready to serve.

- Stew and lettuce supper

  I serve the crisp washed leaves beside the potato and soybean stew.
  
  At the berth, the first spoonful is hot enough to make me pause. The leaves snap against the warm, soft potato. These are the crops I kept alive beneath the rock. For once, the message I record for Earth is about supper.


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

![Working surface](../mars-v8/assets/work-surface.svg)

The rendezvous clearance has arrived. Outside, the straight ladder leads to the open lander hatch. Beside it, the portable cold-transfer enclosure is ready for the three specimens that are coming with me.

> NOTE: The qualified portable cold-transfer enclosure maintains a cold, clean working volume beside the lander; it is not an open outdoor bench. Its two core liners remain separate and the original membrane retains its sealed holder and its own flight locker. Empty freezer and field-case hardware stay behind. Cold transfer, boarding and connection to flight refrigeration are the final cargo work after the meal. The spacecraft is already repaired and fueled; neither is repeated.

**Goals**
- Bring both actual cores onto flight cooling -- Cores on flight cooling
- Bring the first specimen too -- Flight-stowed membrane

**Hotspots**
- (three hotspots are a lot but okay here because the cold transfer bench, refrigerated core bay and separate membrane locker serve distinct containment jobs)
- Cold transfer bench (at 25%, 15%)
- Refrigerated flight bay (at 75%, 15%)
- Flight specimen locker (at 25%, 32%)

**Items**
- Flight sample carrier

  The qualified carrier has two separate whole-core cradles, containment seals and connections to the spacecraft's isolated sample refrigerator.

- Conditioned flight carrier

  The bench chills the carrier and its transfer buffer. Both cradles have room for the complete liners, including the ice beyond any visible body.

- Carrier with source core

  The water-source liner leaves its freezer cradle and settles into the first compartment. The second is still empty.

- Flight-packed cores

  The remote liner leaves its field case for the second cradle. Through it, I can still see the folded outline. Two places on Mars, kept apart in one real carrier.

- Cores on flight cooling

  The carrier locks into the flight bay and connects to active refrigeration. Its buffer has bridged the transfer; the vehicle's cooling will hold the cores for the journey.

- Flight-stowed membrane

  The original sealed membrane holder clicks into its own padded flight restraint. I close the locker and check its latch. That flattened body from the blocked intake has its own place aboard, separate from the two core cradles.


**Combinations**
- Flight sample carrier [transform] @ Cold transfer bench -> Conditioned flight carrier
- Stored source core [transform] + Conditioned flight carrier [transform] -> Carrier with source core
- Case with an articulated body [transform] + Carrier with source core [transform] -> Flight-packed cores
- Flight-packed cores [transform] @ Refrigerated flight bay -> Cores on flight cooling

- First body on membrane [transform] @ Flight specimen locker -> Flight-stowed membrane


## My hand on the switch

![Working surface](../mars-v8/assets/work-surface.svg)

I climb into the cabin that brought me down and close the hatch. Behind my seat, both core compartments show green; the first membrane is secured beside them. The fuel gauges are full.

The console shows the cleared flight path. I take the lander’s arming plug from my flight pouch. The last command is mine.

> NOTE: The removable arming plug is real physical flight hardware, kept separate during surface operations. Spacecraft arming plugs have actual precedent; this crew-accessible Mars-ascent enable socket is an explicit fictional adaptation, not a claim about an Apollo ignition key. The single combination is the complete deliberate launch operation: insert the plug, confirm arming, then press the existing START control. Insertion alone does not ignite the engine or power the entire cabin. Normal interlocks and ascent checks are bundled. Earlier goals establish repair, separate propellants and all three specimens aboard.

**Goals**
- Fit the arming plug and launch -- Rising cabin

**Hotspots**
- Flight console (at 25%, 15%)

**Items**
- Arming plug

  The lander’s removable flight plug, kept in my flight pouch during surface operations. It enables the launch command circuit. The final launch procedure is to fit it, confirm ARMED, then press START.

- Rising cabin

  I seat the plug and lock its collar. The launch circuit shows ARMED. I lift the guard and press START. The engine pushes me into the seat. The lower stage and its new leg fall away; the cave mouth and the field of panels shrink together beneath the window.


**Combinations**
- Arming plug [consume] @ Flight console -> Rising cabin


## The End

![Working surface](../mars-v8/assets/work-surface.svg)

The orbiter grows in the window until I can see the lights around its docking hatch. The guidance display settles. A dull knock runs through the cabin, and the docking indicator turns green.

At the receiving hatch, another pair of gloved hands accepts the sealed membrane holder and the carrier with its two separate core liners. Behind us, Mars fills half the window.

“Show me where you found it.”

> NOTE: The ending remains in Mars orbit at rendezvous with the waiting return vehicle. The actual three sealed specimens transfer through the receiving containment procedure. No Earth-arrival jump, station closeout or further inventory chores follow the player’s ascent command.

