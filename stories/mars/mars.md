# Mars: A Light That Answers

A damaged landing strands a small expedition. Recovery becomes a rescue, then a return journey carrying people and evidence. This is an engineering story with recovered qualified systems, not real survival instructions.

> NOTE: Complete Markdown adaptation of `mars-purposeful-fieldwork-v8`, exported from the composed current scenario at source commit `1c95988a4e3771abcf2be28183ce009d38645d2c`. The first six chapters follow the reviewed Markdown example. All combinations are global; goal satisfaction latches. Later visits are new chapter surfaces. This manuscript now runs in the shared Markdown engine. The 30 October 2026 authenticity pass clarifies recovered equipment and evidence roles; legal replays are developer diagnostics, not proof of physical reproducibility or player enjoyment.

## Contact Ridge

![A rocky contact ridge above the Martian landing site](assets/M01.webp)

I have landed on Mars, but the radio is damaged. I need to contact the orbiter from the ridge, where a powered radio or a steady light signal can reach it. Wreckage lies below, with the surviving habitat and cargo sled visible in the distance.

[If skipped] The light above the ridge has been answered. Someone knows we are still here.

**Goals**
- Repair radio -- Radio
- next: Place powered radio / beacon
  - either: Solar radio @ Contact ridge
  - or: Signal beacon @ Contact ridge

**Hotspots**
- Contact ridge

**Items**
- Broken radio
- Cable
- Solar panel
- Battery
- Lamp
- Reflective foil
- Support frame
- Tripod
- Toolkit

**Combinations**
- Broken radio [transform] + Cable [consume] -> Radio
- Solar panel [transform] + Battery [consume] -> Solar charger
- Radio [transform] + Solar charger -> Solar radio
- Lamp [transform] + Solar charger -> Solar lamp
- Reflective foil [consume] + Support frame [transform] -> Reflector
- Lamp [transform] + Battery [consume] -> Lantern
- Lantern [transform] + Reflector [consume] -> Signal lamp
- Signal lamp [transform] + Tripod [consume] -> Signal beacon

## Habitat entrance

![The damaged outer entrance of the surviving habitat, beside its melt station and signal mast](assets/M02-entrance.webp)

The orbiter has answered. The inner cabin survived, but its outer entrance is torn. Outside, I need to collect water from the ice, secure and insulate the entrance, and leave a signal the missing crew can find. The exterior repair locker holds the heater, patching materials, hatch frame, tie downs and insulating blanket.

The intact signal mast has a clear orbiter sightline. Our signal here will mark the refuge rather than only the crash site. Beside it, a fixed electric melt head collects water inside a sealed vessel. The solar charger can power it; a surviving cabin service lead can instead power the portable heater through the vessel's matching connection.

**Goals**
- Collect water -- Dirty water
- Secure and insulate vestibule -- Insulated vestibule
- Mark refuge for rescue
  - either: Solar radio @ Refuge signal mast
  - or: Signal beacon @ Refuge signal mast

**Hotspots**
- Refuge signal mast
- Ice melt station

**Items**
- Solar charger
- Heater
- Habitat fabric
- Sealant
- Seam roller
- Tie downs
- Hatch frame
- Insulating blanket

**Combinations**
- Solar charger @ Ice melt station -> Dirty water
- Heater @ Ice melt station -> Dirty water
- Habitat fabric [consume] + Sealant [consume] -> Patch supplies
- Patch supplies [transform] + Seam roller [preserve] -> Sealed panel
- Sealed panel [transform] + Hatch frame [consume] -> Vestibule
- Vestibule [transform] + Tie downs [consume] -> Secured vestibule (exclusive with Wrapped vestibule)
- Secured vestibule [transform] + Insulating blanket [consume] -> Insulated vestibule
- Vestibule [transform] + Insulating blanket [consume] -> Wrapped vestibule (exclusive with Secured vestibule)
- Wrapped vestibule [transform] + Tie downs [consume] -> Insulated vestibule

## Habitat cabin

![The enclosed, surviving habitat cabin](assets/M02.webp)

The entrance is secure and insulated, and our signal marks the refuge. Inside, the cabin is still warm and pressurized. I can filter the water collected outside and plant the seeds in their prepared tray. The cabin stores hold the filter, seeds, planting tray and clear cover.

The mission filter is made for this enclosed water source. Once the growing material is moist, the warm habitat will let the seeds germinate. This part of our work takes time in the sheltered cabin.

**Goals**
- Filter water -- Water
- next: Protect the seedlings -- Propagator

**Hotspots**
- Warm habitat

**Items**
- Dirty water
- Water filter
- Seeds
- Planting tray
- Clear cover

**Combinations**
- Dirty water [transform] + Water filter [preserve] -> Water
- Seeds [consume] + Planting tray [transform] -> Seed tray (exclusive with Wet seeds)
- Water + Seeds [transform] -> Wet seeds (exclusive with Seed tray)
- Wet seeds [consume] + Planting tray [transform] -> Watered seed tray
- Seed tray [transform] + Water -> Watered seed tray (exclusive with Covered seed tray)
- Seed tray [transform] + Clear cover [consume] -> Covered seed tray (exclusive with Watered seed tray)
- Covered seed tray [transform] + Water -> Watered covered tray (exclusive with Sprouted tray)
- Watered seed tray [transform] + Clear cover [consume] -> Watered covered tray
- Watered seed tray [transform] @ Warm habitat -> Sprouted tray (exclusive with Watered covered tray)

  After time in the warm cabin, the seeds have sprouted in their moist tray.

- Sprouted tray [transform] + Clear cover [consume] -> Propagator
- Watered covered tray [transform] @ Warm habitat -> Propagator

  After time in the warm cabin, the seeds have sprouted. The clear cover shelters the young plants while they establish.

## Cargo-sled assembly area

![The landed cargo sled and its rover assembly area](assets/M03-sled-build.webp)

The water is filtered and the seedlings have a warm, sheltered home. To reach the missing crew, we need the relay beyond the ice outcrop. The regional map shows these stations, and the landed sled holds the rover parts, camera and viewing equipment. I can match the visible landmarks to the map and prepare the rover to follow the approach.

From the route overlook beside the sled, the outcrop and nearby landmarks are visible. A supported photograph can be compared with the expedition's existing regional map.

**Goals**
- Make Rover drive under solar power -- Rover[Drive unit, Solar charger]
- Fit rover harness -- Rover[Drive unit, Solar charger, Seat harness]
- Find route to the outcrop -- Outcrop navchip

**Hotspots**
- Route overlook

**Items**
- Support frame
- Wheels
- Drive motor
- Motor controller
- Solar charger
- Seat harness
- Dish antenna
- Long range radio
- Camera
- Regional map navchip
- Lens
- Optical tube
- Rover (compound)
  - slot: drive, accepts Drive unit
  - slot: traction power, accepts Solar charger
  - unnamed slot: accepts Long range radio
  - unnamed slot: accepts Seat harness
  - unnamed slot: accepts Tow line
  - unnamed slot: accepts Crew navchip

  [Drive unit, Solar charger] The rover now has the drive and solar-power equipment it needs to travel. It can carry the expedition beyond the landing area.

**Combinations**
- Support frame [transform] + Wheels [consume] -> Rover
- Drive motor [transform] + Motor controller [consume] -> Drive unit
- Solar radio [transform] + Dish antenna [consume] -> Long range radio
- Camera + Tripod [transform] -> Field camera
- Field camera @ Route overlook -> Outcrop approach view
- Telescope camera @ Route overlook -> Outcrop approach view
- Outcrop approach view [preserve] + Regional map navchip [transform] -> Outcrop navchip
- Lens [consume] + Optical tube [transform] -> Telescope
- Telescope [transform] + Tripod [consume] -> Field telescope
- Field telescope [transform] + Camera -> Telescope camera

## Ice-outcrop field station

![An expedition sampling station beside exposed Martian ice and a layered cliff](assets/M04.webp)

The rover is ready, and our navchip holds the approach to the outcrop. The route passes exposed ice and a layered cliff. I will label and photograph the samples so that each observation stays connected with the place it came from.

The expedition sampling case holds a scoop, a transparent jar, a core tube and labels, along with a windowed handling enclosure and sealed glove ports. The cliff viewpoint faces the layers across the route; the recovered optics can help record distant details.

**Goals**
- Label the ice sample -- Catalogued ice sample
- next: Photograph the sample -- Ice photograph
- Photograph core layers -- Core layer photograph

**Hotspots**
- Lookout ice
- Cliff viewpoint

**Items**
- Rover[Drive unit, Solar charger, Seat harness]
- Outcrop navchip
- Cliff photograph
- Illuminated glovebox
- Sample scoop
- Transparent jar
- Core tube
- Sample labels
- Windowed box
- Glove ports

**Combinations**
- Sample scoop @ Lookout ice -> Ice sample
- Ice sample [consume] + Transparent jar [transform] -> Sealed ice sample
- Sealed ice sample [transform] + Sample labels [consume] -> Catalogued ice sample
- Catalogued ice sample + Camera -> Ice photograph
- Catalogued ice sample + Field camera -> Ice photograph
- Core tube [preserve] @ Lookout ice -> Ice core
- Ice core + Camera -> Core layer photograph
- Ice core + Field camera -> Core layer photograph
- Camera @ Cliff viewpoint -> Cliff photograph
- Field camera @ Cliff viewpoint -> Cliff photograph
- Telescope camera @ Cliff viewpoint -> Cliff photograph
- Windowed box [transform] + Glove ports [consume] -> Glovebox
- Glovebox [transform] + Lamp -> Illuminated glovebox

## Weather-station apron

![A disused Martian weather station with an open instrument site and service equipment](assets/M05.webp)

The ice sample is labelled, and the photographs record the specimen and the core's layers. These observations do not yet establish how old the layers are or how they formed. Dust is moving across the route. I can repair this old weather station and use its observations to decide when to travel.

The mothballed station was stored sensibly: its calibrated sensor mast, detached vane and complete logger are here together. A service enclosure and filter material can protect our spare controller. At the open weather site, the restored station can record changing conditions over a period of observation.

**Goals**
- Find a clear interval -- Weather record
- Make protected controller -- Protected controller

**Hotspots**
- Open weather site

**Items**
- Rover[Drive unit, Solar charger, Seat harness]
- Solar charger
- Motor controller
- Sensor mast
- Wind vane
- Sensor logger
- Filter mesh
- Vented enclosure
- Weather station (compound)
  - slot: recorder, accepts Sensor logger
  - slot: power, accepts Solar charger

**Combinations**
- Sensor mast [transform] + Wind vane [consume] -> Weather station
- Weather station[Sensor logger, Solar charger] @ Open weather site -> Weather record
- Filter mesh [consume] + Vented enclosure [transform] -> Dust screen
- Dust screen [consume] + Motor controller [transform] -> Protected controller
## Relay knoll

![Relay knoll](assets/M06.webp)

The relay mast reaches beyond the ridge. I need to contact the missing crew, locate their reported landmark and program a navchip to guide the rover to them.

The relay itself is still here, with its complete antenna and charged powerpack stored beside it. Its service pouch holds a matched fuse; the fault indicator points to the old one.

[If skipped] The missing crew have answered. Their cabin is intact; its drive has failed. We know where they are.

**Goals**
- Set rover course to the crew -- Rover[Drive unit, Solar charger, Crew navchip]

**Hotspots**
- Relay knoll

**Items**
- Relay transceiver
- Spare fuse
- Directional antenna
- Relay powerpack
- Relay (compound)
  - slot: antenna, accepts Directional antenna
  - slot: power, accepts Relay powerpack

**Combinations**
- Relay transceiver [transform] + Spare fuse [consume] -> Relay
- Relay[Directional antenna, Relay powerpack] @ Relay knoll -> Distress recording
- Distress recording [preserve] + Outcrop navchip [transform] -> Crew navchip

## Stranded crawler

![Stranded crawler](assets/M07.webp)

The crew answers: their cabin is intact, but the crawler's drive has failed. I can repair the drive or tow the crawler with our rover to help them reach the nearby refuge.

The crew wait in the intact crawler cabin. Its service compartment holds the spare drive and towing equipment.

> NOTE: Crawler names describe equipment only. The crew remain people in the story, never a second item hidden inside a vehicle label. Repairing or towing produces one vehicle; sheltering them later changes only the refuge.

**Goals**
- Bring the crawler to the service refuge
  - either: Crawler
  - or: Recovered crawler

**Items**
- Recovery rope
- Tow eye
- Spare drive
- Drive coupling
- Disabled crawler
- Toolkit
- Rover

**Combinations**
- Spare drive [transform] + Toolkit -> Serviced drive
- Serviced drive [transform] + Drive coupling [consume] -> Replacement drive
- Replacement drive [consume] + Disabled crawler [transform] -> Crawler
- Recovery rope [transform] + Tow eye [consume] -> Tow line
- Rover[Drive unit, Solar charger, Tow line] + Disabled crawler [transform] -> Recovered crawler

## Service refuge

![Service refuge](assets/M08.webp)

The crew have reached the nearby service refuge. Its shelter and bedding stores are here; first I need to make it warm and welcoming.

The service refuge has bedding, a folding bed, soup and an insulated flask. The shelter needs preparation before the recovered crew can settle inside.

[If skipped] Everyone is sheltered and fed. With the recovered crew beside us, we can prepare together for the scheduled return window.

**Goals**
- Bring crew to shelter -- Occupied refuge
- next: Feed sheltered crew -- Provisioned refuge

**Items**
- Service shelter · torn seam
- Bedding
- Soup pouch
- Insulated flask
- Folding bed

**Combinations**
- Service shelter · torn seam [transform] + Patch supplies -> Sealed refuge
- Sealed refuge [transform] + Heater -> Warm refuge
- Folding bed [transform] + Bedding [consume] -> Prepared bed
- Prepared bed [consume] + Warm refuge [transform] -> Prepared refuge
- Soup pouch [transform] + Heater -> Warm soup
- Warm soup [consume] + Insulated flask [transform] -> Hot meal flask
- Crawler + Prepared refuge [transform] -> Occupied refuge
- Recovered crawler + Prepared refuge [transform] -> Occupied refuge
- Occupied refuge [transform] + Hot meal flask -> Provisioned refuge

## Sheltered workcourt

![Sheltered workcourt](assets/M08-workcourt.webp)

The crew is sheltered and fed. In the refuge's workcourt, I can prepare a lit workbench and contact our families.

The camp stores hold a worktop with its folded legs beneath it, a movable lamp bracket, and the crew’s message camera and antenna stand. Our recovered lamp and solar charger can light the bench.

**Goals**
- Make shared lit workbench -- Lit workbench
- Send crew message home -- Message home

**Items**
- Bench legs
- Worktop
- Lamp bracket
- Message camera
- Antenna stand
- Long range radio (compound)
  - unnamed slot: accepts Antenna stand

**Combinations**
- Worktop [transform] + Bench legs [consume] -> Workbench
- Solar lamp [transform] + Lamp bracket [consume] -> Bench lamp
- Workbench [transform] + Bench lamp [consume] -> Lit workbench
- Message camera + Provisioned refuge -> Crew message
- Crew message [preserve] + Long range radio[Antenna stand] -> Message home
- Lantern [consume] + Lamp bracket [transform] -> Bench lamp
- Signal lamp [consume] + Lamp bracket [transform] -> Bench lamp
- Workbench [transform] + Signal beacon [consume] -> Lit workbench

## Furniture-sled path

![Furniture-sled path](assets/M08-sled-path.webp)

The crew's furniture sled is a short walk from camp. I will bring back their table and take a photograph of everyone together.

The furniture sled’s belongings locker contains protective padding and the crew’s picture roll.

**Goals**
- Take crew supper portrait -- Crew portrait

**Hotspots**
- Cargo shoulder

**Items**
- Sled padding
- Picture roll

**Combinations**
- Recovery rope + Sled padding [transform] -> Padded sling
- Padded sling [preserve] @ Cargo shoulder -> Recovered mess crate
- Recovered mess crate [transform] + Toolkit -> Mess table
- Picture roll [consume] + Mess table [transform] -> Personal table
- Personal table [transform] + Hot meal flask [consume] -> Shared supper
- Message camera + Shared supper [preserve] -> Crew portrait

## Thermal test bay

![Thermal test bay](assets/M08-thermal-bay.webp)

The refuge loses heat at night. In the thermal test bay, I can compare coverings before fitting a screen to its exposed service wall.

The separate camp thermal bay holds its wall sample, measured template and removable screen kit beside the fixed thermal chamber.

The chamber runs matched 20-minute tests. Both samples start at 20°C, with the same sample dimensions and logger position. Its invented example readings compare this covering under these conditions; they do not predict the whole refuge’s temperature.

> NOTE: The thermal readings are fictional comparisons, not measurements taken from NASA or a material qualification.

**Goals**
- Compare wall cooling -- Wrapping slows cooling
- next: Insulate our refuge -- Insulated refuge

**Hotspots**
- Thermal chamber

**Items**
- Wall sample
- Temperature logger
- Thermal blanket
- Clip frame
- Measured wall template
- Insulation swatch

**Combinations**
- Temperature logger + Wall sample @ Thermal chamber -> Bare: 20 → 8°C
- Wall sample [transform] + Insulation swatch [consume] -> Insulated wall sample
- Temperature logger + Insulated wall sample [preserve] @ Thermal chamber -> Wrapped: 20 → 16°C
- Bare: 20 → 8°C [preserve] + Wrapped: 20 → 16°C [preserve] -> Wrapping slows cooling
- Measured wall template [preserve] + Thermal blanket [transform] -> Fitted blanket
- Fitted blanket [transform] + Clip frame [consume] -> Thermal screen
- Thermal screen [consume] + Provisioned refuge [transform] -> Insulated refuge

## Enclosed ice works

![Enclosed ice works](assets/M09.webp)

Beyond camp is an enclosed ice-processing system with a drained pump loop. The water I saved may let me restart it and supply the camp's growing system.

This is an existing ice-processing pilot site. Its enclosed melter, treatment skid, monitored tank and circulation pump were stored as working appliances. The disconnected return hose is still here.

The exposed service wall is now covered. The test showed that the wrapped sample cooled less than the bare one; the bed and crew remain in the same refuge while we work at the ice system.

**Goals**
- Make camp water system -- Camp water system

**Hotspots**
- Ice works

**Items**
- Return hose
- Ice melter
- Treatment skid
- Monitored tank
- Circulation pump
- Camp water system

  The protected tank and working pump loop now supply the camp’s enclosed growing system. This process water is for the equipment and growing beds, not drinking.

**Combinations**
- Ice melter [transform] + Heater -> Heated melter
- Heated melter [preserve] @ Ice works -> Collected water
- Monitored tank [transform] + Process water [preserve] -> Water reserve
- Primed water loop [transform] + Water reserve [preserve] -> Camp water system
- Collected water [transform] + Treatment skid [preserve] -> Process water
- Circulation pump [transform] + Return hose [consume] -> Dry water loop
- Water + Dry water loop [transform] -> Primed water loop

## Greenhouse growing bed

![Greenhouse growing bed](assets/M10.webp)

Our mission stores cover the months until the return flight. In the greenhouse, there is time to grow food and prepare the beds for the crews who follow.

The camp greenhouse is mostly intact. Its growing tray, fan, light, brought substrate and seed potatoes were stored here for a later planting. A damaged seam needs the existing patch kit.

The growing beds use the camp’s process-water system. Growing the crop takes several weeks inside the enclosed greenhouse; the mission stores support us while we wait.

[If skipped] After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.

**Goals**
- Grow potatoes; share meal -- Warm potatoes

**Items**
- Greenhouse with torn seam
- Prepared substrate
- Drip line
- Circulation fan
- Grow light
- Seed potato
- Harvest basket
- Growing bed
- Greenhouse (compound)
  - slot: bed, accepts Watered potatoes
  - slot: light, accepts Powered grow light
  - slot: air, accepts Circulation fan
  - unnamed slot: accepts Positioned diffuser

**Combinations**
- Drip line [transform] + Camp water system [preserve] -> Connected drip line
- Planted potatoes [transform] + Connected drip line [preserve] -> Watered potatoes
- Grow light [transform] + Solar charger -> Powered grow light
- Potato harvest [transform] + Heater -> Warm potatoes
- Growing bed [transform] + Prepared substrate [consume] -> Planting bed
- Planting bed [transform] + Seed potato [consume] -> Planted potatoes
- Greenhouse with torn seam [transform] + Patch supplies -> Greenhouse
- Greenhouse[Watered potatoes, Powered grow light, Circulation fan] + Harvest basket [preserve] -> Potato harvest

## Propagation bench

![Propagation bench](assets/M10-propagation-bench.webp)

The greenhouse has produced potatoes, and the small tray from landing is still growing. At the nursery bench, I can prepare a lasting place for its seedlings.

A single greenhouse cultivation kit holds the printed grid, original diffuser fitting, soft support lattice and labels. We reuse the landing’s living tray rather than granting another crop.

The growing bed and its fitted equipment remain in the greenhouse. The propagation bench is another working surface in that same structure.

**Goals**
- Camp nursery -- Camp nursery

**Hotspots**
- Nursery test shelf

**Items**
- Nursery grid
- Diffuser sheet
- Diffuser frame
- Seedling support
- Nursery labels

**Combinations**
- Field camera @ Nursery test shelf -> Shelf shadow view
- Shelf shadow view [preserve] + Nursery grid [transform] -> Shadow layout
- Diffuser sheet [consume] + Diffuser frame [transform] -> Framed diffuser
- Framed diffuser [transform] + Shadow layout [preserve] -> Positioned diffuser
- Propagator [transform] + Nursery labels [consume] -> Identified seedlings
- Identified seedlings [transform] + Seedling support [consume] -> Supported seedlings
- Supported seedlings [transform] + Greenhouse[Watered potatoes, Powered grow light, Circulation fan, Positioned diffuser] -> Camp nursery

## Camp machine shop

![Camp machine shop](assets/M11.webp)

The crawler needs a replacement wheel and a carrier for the samples. The enclosed machine shop has equipment for making and fitting them.

The camp machine-shop cabinet holds the guarded bench-top machine, stock, carrier parts and replacement wheel. Its captive base clamps match the rails on the shared workbench we assembled earlier.

> NOTE: The original crawler also declares radar and suspension slots, but no active recipe installs either component and neither part is stocked. Those unused legacy slots are omitted.

**Goals**
- Fit crawler sample carrier -- Crawler[Bracketed sample carrier]
- Fit replacement wheel -- Crawler[Wheel module]

**Items**
- Machining stock
- Carrier shell
- Shock foam
- Latch
- Blank bracket
- Guarded bench-top machine
- Replacement wheel
- Crawler (compound)
  - unnamed slot: accepts Wheel module
  - unnamed slot: accepts Bracketed sample carrier
  - unnamed slot: accepts Marked traverse
- Lit workbench (compound)
  - unnamed slot: accepts Guarded bench-top machine

**Combinations**
- Lit workbench[Guarded bench-top machine] + Machining stock [transform] -> Machined axle
- Replacement wheel [transform] + Machined axle [consume] -> Wheel module
- Carrier shell [transform] + Shock foam [consume] -> Padded carrier
- Padded carrier [transform] + Latch [consume] -> Sample carrier
- Blank bracket [transform] + Lit workbench[Guarded bench-top machine] -> Mounting bracket
- Sample carrier [transform] + Mounting bracket [consume] -> Bracketed sample carrier
- Replacement drive [consume] + Recovered crawler [transform] -> Crawler

## Lava-rim scout station

![Lava-rim scout station](assets/M12.webp)

The ascent depot lies beyond rough lava. At this scout station, I can use aerial observations to plan the crawler's route.

The geology depot holds a stored Mars scout. Its delicate rotor assembly and battery were packed separately; its flight electronics, camera and legs are already fitted. A route tablet and hazard marker are also here.

**Goals**
- Fit crawler traverse -- Crawler[Marked traverse]

**Hotspots**
- Lava overlook

**Items**
- Scout airframe
- Counter rotating rotors
- Scout battery
- Route tablet
- Hazard marker
- Scout (compound)
  - slot: battery, accepts Scout battery

**Combinations**
- Scout airframe [transform] + Counter rotating rotors [consume] -> Scout
- Scout[Scout battery] @ Lava overlook -> Scout panorama
- Scout panorama [preserve] + Route tablet [preserve] -> Terrain model
- Terrain model + Outcrop navchip [transform] -> Traverse map
- Traverse map [transform] + Hazard marker [consume] -> Marked traverse

## Channel survey station

![Channel survey station](assets/M13.webp)

The aerial view suggested a possible crossing. Here at the channel, I need ground measurements before bringing the crawler onto the approach.

At the channel survey station, the opened field case holds the ground probe, map overlay and crossing marker.

**Goals**
- Mark surveyed channel -- Marked crossing
- Place crawler at channel -- Crawler[Wheel module] @ Channel approach

**Hotspots**
- Channel approach

**Items**
- Ground probe
- Route overlay
- Crossing marker

**Combinations**
- Ground probe [preserve] @ Channel approach -> Ground profile
- Ground profile [preserve] + Terrain model -> Firm-ground route
- Firm-ground route [preserve] + Route overlay [transform] -> Crossing map
- Crossing map [preserve] + Crossing marker [transform] -> Marked crossing

## Basin coring station

![Basin coring station](assets/M14.webp)

Time to collect a core from this basin, and record its findings against the terrain.

The field laboratory unpacked at the basin core site contains the coring, handling and observation instruments, with its specimen log.

**Goals**
- Store sediment sample -- Retained sediment
- next: Record the basin findings -- Basin field record

**Hotspots**
- Layered basin

**Items**
- Sterile liner
- Core cradle
- Spectrometer
- Calibration target
- Sample vial
- Specimen log
- Core drill
- Illuminated microscope

**Combinations**
- Core drill [transform] + Sterile liner [consume] -> Lined core drill
- Lined core drill [preserve] @ Layered basin -> Sediment core
- Sediment core + Core cradle [transform] -> Supported core
- Supported core [preserve] + Illuminated microscope [preserve] -> Grain images
- Spectrometer [transform] + Calibration target [preserve] -> Calibrated spectrometer
- Sediment core + Sample vial [transform] -> Retained sediment
- Retained sediment + Calibrated spectrometer [preserve] -> Mineral spectrum
- Grain images [preserve] + Mineral spectrum [preserve] -> `sediment-comparison` "Fine–coarse–fine; spectrum inconclusive"
- `sediment-comparison` [transform] + Terrain model -> Basin field record

## Ripple and gravel edge

![Ripple and gravel edge](assets/M14-gravel-edge.webp)

The rippled surface and nearby gravel are different sources of evidence. I will mark both photographed sites on the terrain model, compare them with the basin record, and keep the specimens and records separate.

The comparison case is opened at the ripple-and-gravel edge. A loose chip must still be collected visibly from the gravel ledge.

The earlier core has a band of larger grains between two finer layers. Its mineral scan is inconclusive. The record preserves the specimen’s context and the order of its layers, but neither dates them nor tells us what moved the grains. The nearby outcrops give us a chance to investigate that question.

> NOTE: The field observations are fictional expedition notes, not real mission measurements. The photographs are compared without invented calibrated dimensions or evidence of life.

**Goals**
- Compare basin photographs -- Paired terrain photographs
- next: Save basin comparison -- Sleeved comparison
- Keep specimens separate -- Two-cell comparison case[Ripple impression, Logged gravel chip]

**Hotspots**
- Ripple window
- Gravel window

**Items**
- Context board
- Two-cell comparison case (compound)
  - slot: ripple, accepts Ripple impression
  - slot: gravel, accepts Logged gravel chip
- Ripple impression sheet
- Comparison sleeve

**Combinations**
- Field camera @ Ripple window -> Ripple photograph
- Field camera @ Gravel window -> Gravel photograph
- Ripple photograph [preserve] + Gravel photograph [preserve] -> Paired terrain photographs
- Paired terrain photographs [preserve] + Terrain model -> Mapped ripple and gravel sites
- Mapped ripple and gravel sites [preserve] + Basin field record -> Qualified basin story
- Ripple impression sheet [transform] @ Ripple window -> Ripple impression
- Loose gravel chip [transform] + Specimen log [preserve] -> Logged gravel chip
- Qualified basin story [preserve] + Context board [transform] -> Comparison board
- Comparison board [transform] + Comparison sleeve [consume] -> Sleeved comparison
- Sample scoop @ Gravel window -> Loose gravel chip

## Depot marker line

![Depot marker line](assets/M15.webp)

The old depot markers lead toward a stored cargo hauler. The dark surface tracks have changed, so I will follow the fixed markers and use our spare controller to repair the hauler.

One existing depot navigation-and-maintenance locker holds its original survey print, cleaning pad and folding sign. The stored standardized cargo hauler and platform stand beside it. Their compatible controller specification is legible before installation.

Our basin comparison keeps the ripple and gravel sites separate. Rounded gravel within its surrounding rock layers supports ancient flowing water more strongly than ripple shape alone. The protected photographs and diagram retain their source labels, and the specimens remain separate so another team can check the interpretation. None of this establishes a date or evidence of life.

**Goals**
- Depot cargo shuttle -- Depot cargo shuttle

**Hotspots**
- Depot marker line

**Items**
- Depot survey print
- Marker cleaning pad
- Folded route sign
- Sign foot
- Depot hauler (compound)
  - slot: controller, accepts Protected controller
  - slot: platform, accepts Hauler platform
- Hauler platform

**Combinations**
- Field camera @ Depot marker line -> Current marker view
- Current marker view [preserve] + Depot survey print [preserve] -> Track disagreement

  The fixed markers line up in the survey print and the new photograph, but the dark surface tracks differ. This comparison shows change, not when it happened or what caused it; the fixed route identifiers remain our guide.

- Marker cleaning pad [preserve] @ Depot marker line -> Readable route identifier
- Readable route identifier [preserve] + Track disagreement [preserve] -> Identified service route
- Folded route sign [transform] + Sign foot [consume] -> Standing route sign
- Standing route sign [transform] + Identified service route [preserve] -> Depot route sign
- Depot hauler[Protected controller, Hauler platform] [transform] + Depot route sign [preserve] -> Depot cargo shuttle

## Oxygen-plant service bay

![Oxygen-plant service bay](assets/M16-oxygen-bay.webp)

The ascent depot's oxygen plant is still here. In its service bay, I can restore the equipment needed to prepare the vehicle's oxygen module.

The oxygen plant holds its stored processing stack, controller and filtered intake. The heavy flight module waits on its transport cradle.

**Goals**
- Restore plant; service oxygen -- Serviced oxygen module

**Hotspots**
- Ascent plant

**Items**
- Electrolyzer stack
- Process controller
- Filtered intake
- Flight oxygen module
- Oxygen plant (compound)
  - slot: intake, accepts Filtered intake

  [Filtered intake] The restored plant is ready to process the Martian atmosphere into oxygen using its fitted mission equipment. This gives the return expedition a local oxygen source.

**Combinations**
- Electrolyzer stack [transform] + Process controller [consume] -> Oxygen plant
- Oxygen plant[Filtered intake] + Docked oxygen module [transform] @ Ascent plant -> Serviced oxygen module
- Depot cargo shuttle + Flight oxygen module [transform] @ Ascent plant -> Docked oxygen module

## Cabin preparation bay

![Cabin preparation bay](assets/M16-cabin-bay.webp)

The oxygen plant is working. Across the depot, I can repair and fit the waiting cabin, then check its hatch closure and console responses at the ascent pad and record what happens.

The cabin shell survived, but its hatch seal is damaged. The depot stores hold the replacement seal, docking ring, flight console and stowed flight seat.

**Goals**
- Make cabin test record -- Cabin test record

**Hotspots**
- Ascent pad

**Items**
- Ascent cabin shell
- Docking ring
- Hatch seal
- Flight console
- Flight seat
- Ascent cabin (compound)
  - slot: dock, accepts Docking ring
  - slot: oxygen, accepts Serviced oxygen module
  - slot: console, accepts Flight console
  - slot: seat, accepts Flight seat

**Combinations**
- Ascent cabin shell [transform] + Hatch seal [consume] -> Ascent cabin
- Ascent cabin[Docking ring, Serviced oxygen module, Flight console, Flight seat] @ Ascent pad -> Cabin test record

  The repaired hatch closes and the fitted console responds during the pad check. This records a limited functional check of the cabin, not clearance to launch. The rendezvous and final vehicle assembly still need preparation.

## Clear-sky station

![Clear-sky station](assets/M17.webp)

At the clear-sky station, I can compare clocks, observations and beacon measurements with the orbiter. We need to agree where and when the ships will meet.

The clear-sky station’s stored navigation kit holds the orbiter position table, terminal and clock, with the tracker, alignment target, timing receiver and range transponder. The tracker records the stars; the terminal relates that observation to its stored station survey and tracker-mount calibration. That establishes the station’s orientation, not the orbiter’s location.

The cabin check is recorded. We still need the orbiter’s pass prediction and a ranging link to agree our rendezvous, then assemble the final vehicle.

> NOTE: The cabin check, stored station survey and mount calibration are fictional mission premises, not a spacecraft test result or navigation procedure. [JPL’s ephemerides overview](https://ssd.jpl.nasa.gov/orbits.html) and [Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html) support time-related position information; [NASA’s Orion navigation overview](https://www.nasa.gov/missions/lasers-stars-and-sensors-will-guide-nasas-orion-spacecraft/) distinguishes star-tracker orientation from broader navigation. Sources checked 30 October 2026; they do not validate this fictional rendezvous solution.

**Goals**
- Make agreed rendezvous -- Agreed rendezvous

**Hotspots**
- Clear sky station

**Items**
- Orbiter position table

  The table gives predicted orbiter positions at reference-clock times. Comparing it with the received beacon times helps predict a pass; it is one input to the rendezvous, not a complete flight plan.

- Navigation terminal
- Alignment target
- Range transponder
- Reference clock
- Timing receiver
- Star tracker

**Combinations**
- Timing receiver [transform] + Reference clock [consume] -> Timing station
- Star tracker [transform] + Alignment target [preserve] -> Aligned star tracker
- Aligned star tracker [preserve] @ Clear sky station -> Star observation
- Timing station [preserve] @ Clear sky station -> Beacon times
- Beacon times [preserve] + Orbiter position table [preserve] -> Orbiter pass prediction
- Star observation [preserve] + Navigation terminal [preserve] -> Station orientation
- Station orientation [preserve] + Orbiter pass prediction [preserve] -> Rendezvous solution
- Range transponder [transform] + Long range radio -> Ranging link
- Ranging link [preserve] + Rendezvous solution [preserve] -> Agreed rendezvous

## Camp return-packing alcove

![Camp return-packing alcove](assets/M08-packing-bay.webp)

Back at camp, I will pack the specimens, save the crew portrait and prepare a handover signal for the next crew.

The complete card recorder and its matching archival card can save a copy of the crew portrait alongside our field records. The hauler’s platform and cargo strap match the removable return capsule. Its shock mount and cargo can be fitted in any order; after the ground journey, that same capsule will transfer from the cart’s restraint to the flight dock. The camp handover equipment is ready too.

**Goals**
- Prepare specimen transport cart -- Specimen transport cart
- Make camp handover beacon -- Camp handover beacon
- Archive the crew portrait -- Family record

**Items**
- Shock mount
- Card recorder
- Archival card
- Cargo strap
- Camp beacon
- Maintenance card
- Return capsule (compound)
  - unnamed slot: accepts Shock mount
  - slot: ice, accepts Catalogued ice sample
  - slot: sediment, accepts Retained sediment
  - slot: archive, accepts Complete field archive
  - slot: comparison, accepts Two-cell comparison case
  - slot: comparison record, accepts Sleeved comparison

**Combinations**
- Card recorder [transform] + Archival card [consume] -> Archival recorder
- Family record [preserve] + Basin field record -> Expedition archive
- Expedition archive [transform] + Core layer photograph [preserve] -> Complete field archive
- Camp beacon [transform] + Maintenance card [consume] -> Camp handover beacon
- Depot cargo shuttle [transform] + Cargo strap [consume] -> Secured cart
- Secured cart [transform] + Return capsule[Shock mount, Catalogued ice sample, Retained sediment, Complete field archive, Two-cell comparison case, Sleeved comparison] -> Specimen transport cart

  The cart carries the packed return capsule to the ascent pad. The cart stays on the ground; the same removable capsule, with its specimens and records, will go into the flight dock.

- Crew portrait [preserve] + Archival recorder [preserve] -> Family record

## Final assembly pad

![Final assembly pad](assets/M16-launchpad.webp)

At the final assembly pad, the ascent stage and launch equipment are ready for preparation. I will bring the crew, specimens and records to the orbiter at the agreed meeting.

The qualified ascent stage, receiver latch, cargo adapter, telemetry recorder and launch key wait at the depot. The orbiter remains at the remote rendezvous.

**Goals**
- Launch at the agreed rendezvous -- Ascending vehicle

**Items**
- Certified ascent stage
- Receiver latch
- Cargo adapter
- Telemetry recorder
- Launch key

**Combinations**
- Certified ascent stage [transform] + Ascent cabin[Docking ring, Serviced oxygen module, Flight console, Flight seat] [consume] -> Ascent vehicle
- Cargo adapter [consume] + Receiver latch [consume] -> Capsule dock
- Return capsule[Shock mount, Catalogued ice sample, Retained sediment, Complete field archive, Two-cell comparison case, Sleeved comparison] [consume] + Capsule dock [transform] -> Loaded capsule dock
- Ascent vehicle [transform] + Loaded capsule dock [consume] -> Loaded ascent vehicle
- Telemetry recorder [transform] + Agreed rendezvous [preserve] -> Rendezvous program
- Loaded ascent vehicle [transform] + Rendezvous program [consume] -> Flight ready vehicle
- Flight ready vehicle [transform] + Launch key [preserve] -> Ascending vehicle

## Orbital rendezvous

![Orbital rendezvous](assets/M18-orbital-approach-v1.webp)

The surface falls away. At the agreed rendezvous, the waiting orbiter is finally in front of us.

We have you in sight. Bring your ship alongside; the hatch is waiting.

[If skipped] The crew is safely aboard the orbiter. The docked return ship holds the specimens, their records and our table portrait. The camp is ready for the next crew.

**Goals**
- Bring specimens to orbital hatch -- Docked vehicle @ Orbital hatch

**Hotspots**
- Waiting orbital cabin
- Orbital hatch

**Combinations**
- Ascending vehicle [transform] @ Waiting orbital cabin -> Docked vehicle

> NOTE: Source context retained from the source scenario; these links were not freshly researched for the format conversion.
>
> [The Fact and Fiction of Martian Dust Storms](https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/). Dust reduces sunlight and adheres to equipment; Mars winds are not Earth-hurricane force at the same speed.
>
> [Mars Oxygen In-Situ Resource Utilization Experiment](https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/). A demonstrated engineered process, not an improvised household chemical combination.
>
> [Where Should Future Astronauts Land on Mars? Follow the Water](https://www.nasa.gov/centers-and-facilities/jpl/where-should-future-astronauts-land-on-mars-follow-the-water/). Near-surface ice is a candidate resource; accessibility varies.
>
> [Ingenuity mission](https://www.jpl.nasa.gov/missions/ingenuity/). Thin atmosphere demands purpose-built flight hardware; recovered scout modules are fictional mission equipment.
>
> [NASA thermal testing](https://s3vi.ndc.nasa.gov/ssri-kb/topics/59/). Controlled thermal testing of spacecraft and subsystems grounds the test-chamber setting; this fictional field comparison is not a qualification procedure. The v4 matched 20-minute example readings (20→8°C bare; 20→16°C wrapped) are invented for comparison, not taken from NASA or a qualification report.
>
> [JPL rover navigation](https://robotics.jpl.nasa.gov/what-we-do/flight-projects/mars-science-laboratory/surface-system-software-and-rover-navigation/). Terrain assessment and route selection matter for mobility. The field ground-probe interpretation remains a simplified fictional crewed-mission technique.
>
> [USGS: Large wind ripples on Mars](https://www.usgs.gov/publications/large-wind-ripples-mars-a-record-atmospheric-evolution). Mars wind ripples can resemble water-worked ripples; shape alone is not sufficient evidence of water.
>
> [JPL: Martian Streambed Evidence Rock](https://www.jpl.nasa.gov/images/pia16223-martian-streambed-evidence-rock-in-3-d/). Size and rounded form of embedded gravel support ancient stream interpretation. Fictional field synthesis compresses expert interpretation.
>
> [USGS: Eolian erasure of Mars rover tracks](https://www.usgs.gov/publications/gone-wind-eolian-erasure-mars-rover-tracks). Wind alters rover tracks. Our depot navigation uses permanent engineering markers, not an asserted safe route inferred from dark marks.
>
> [NASA: Dust Devil Dance](https://science.nasa.gov/photojournal/dust-devil-dance/). Dust devil tracks can loop and overprint one another. Weather correlation does not uniquely diagnose each fictional track.
>
> [NASA: Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/). Engineered growing systems and crew well-being ground gardening. Nursery optics, compatible fittings and crewed Mars logistics are fictional abstractions.
>
> [Grundfos: starting a drained pump after standing still](https://www.grundfos.com/solutions/support/faq/how-can-i-start-the-pump-after-standing-still-). Supports the limited idea that a drained pump may need filling before use. The closed Mars process-loop fittings and compatible stored water are fictional; this is not a commissioning procedure.

## The End

The crew is safely aboard the orbiter. The docked return ship holds the specimens, their records and our table portrait. The camp is ready for the next crew.
