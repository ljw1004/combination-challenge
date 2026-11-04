# Mars: A Light That Answers

A damaged landing strands a small expedition. Recovery becomes a rescue, then a return journey carrying people and evidence. This is an engineering story with recovered qualified systems, not real survival instructions.

> NOTE: Complete Markdown adaptation of `mars-purposeful-fieldwork-v8`, exported from the composed current scenario at source commit `1c95988a4e3771abcf2be28183ce009d38645d2c`. The first six chapters follow the reviewed Markdown example. All combinations are global; goal satisfaction latches. Later visits are new chapter surfaces. This manuscript now runs in the shared Markdown engine. The 30 October 2026 authenticity pass clarifies recovered equipment and evidence roles; legal replays are developer diagnostics, not proof of physical reproducibility or player enjoyment.

## Contact Ridge

![A rocky contact ridge above the Martian landing site](assets/expedition/backgrounds/contact-ridge.webp)

I have landed on Mars, but the radio is damaged. I need to contact the orbiter from the ridge, where a powered radio or a steady light signal can reach it. Wreckage lies below, with the surviving habitat and cargo sled visible in the distance.

[If skipped] The light above the ridge has been answered. Someone knows we are still here.

**Goals**
- Repair radio -- Radio
- next: Place powered radio / beacon
  - either: Solar radio @ Contact ridge
  - or: Signal beacon @ Contact ridge

**Hotspots**
- Contact ridge (at 50%, 17.5%)
  - icon: ![Contact ridge](assets/expedition/hotspots/contact-ridge.png)
  > NOTE: Mars artwork target: Flat top and connected face of the raised contact ridge. Centre 50%, 17.5%; transparent hit area 240 × 80px at the 390 × 844 reference viewport.

**Items**
- Contact ridge
- Broken radio
  - icon: ![Broken radio](assets/expedition/items/broken-radio.png)
- Cable
  - icon: ![Cable](assets/expedition/items/cable.png)
- Solar panel
  - icon: ![Solar panel](assets/expedition/items/solar-panel.png)
- Battery
  - icon: ![Battery](assets/expedition/items/battery.png)
- Lamp
  - icon: ![Lamp](assets/expedition/items/lamp.png)
- Reflective foil
  - icon: ![Reflective foil](assets/expedition/items/reflective-foil.png)
- Support frame
  - icon: ![Support frame](assets/expedition/items/support-frame.png)
- Tripod
  - icon: ![Tripod](assets/expedition/items/tripod.png)
- Toolkit
  - icon: ![Toolkit](assets/expedition/items/toolkit.png)
- Radio
  - icon: ![Radio](assets/expedition/items/radio.png)
- Solar radio
  - icon: ![Solar radio](assets/expedition/items/solar-radio.png)
- Solar lamp
  - icon: ![Solar lamp](assets/expedition/items/solar-lamp.png)
- Reflector
  - icon: ![Reflector](assets/expedition/items/reflector.png)
- Lantern
  - icon: ![Lantern](assets/expedition/items/lantern.png)
- Signal lamp
  - icon: ![Signal lamp](assets/expedition/items/signal-lamp.png)
- Signal beacon
  - icon: ![Signal beacon](assets/expedition/items/signal-beacon.png)

**Combinations**
- Cable [consume] + Broken radio [transform] -> Radio (tutorial)
- Solar panel [transform] + Battery [consume] -> Solar charger
- Radio [transform] + Solar charger -> Solar radio
- Lamp [transform] + Solar charger -> Solar lamp
- Reflective foil [consume] + Support frame [transform] -> Reflector
- Lamp [transform] + Battery [consume] -> Lantern
- Lantern [transform] + Reflector [consume] -> Signal lamp
- Signal lamp [transform] + Tripod [consume] -> Signal beacon

## Habitat entrance

![The damaged outer entrance of the surviving habitat, beside its melt station and signal mast](assets/expedition/backgrounds/habitat-entrance.webp)

The orbiter has answered. The inner cabin survived, but its outer entrance is torn. Outside, I need to collect water from the ice, secure and insulate the entrance, and leave a signal the missing crew can find. The exterior repair locker holds the heater, patching materials, hatch frame, tie downs and insulating blanket.

The intact signal mast has a clear orbiter sightline. Our signal here will mark the refuge rather than only the crash site. Beside it, a fixed electric melt head collects water inside a sealed vessel. The solar charger can power it; a surviving cabin service lead can instead power the portable heater through the vessel's matching connection.

**Goals**
- (three goals are a lot but okay here because water, shelter, and rescue signalling are separate immediate refuge needs; the reviewed signal affordance problem was not resolved by hiding a goal)
- Collect water -- Dirty water
- Secure and insulate vestibule -- Insulated vestibule
- Mark refuge for rescue
  - either: Solar radio @ Refuge signal mast
  - or: Signal beacon @ Refuge signal mast

**Hotspots**
- Refuge signal mast (at 63%, 35.5%)
  - icon: ![Refuge signal mast](assets/expedition/hotspots/refuge-signal-mast.png)
  > NOTE: Mars artwork target: The empty signal platform and its directly attached antenna mast foundation in front of the habitat. Centre 63%, 35.5%; transparent hit area 110 × 74px at the 390 × 844 reference viewport.
- Ice melt station (at 29%, 32.5%)
  - icon: ![Ice melt station](assets/expedition/hotspots/ice-melt-station.png)
  > NOTE: Mars artwork target: The sealed melt vessel and fixed melt-head connection into the ice. Centre 29%, 32.5%; transparent hit area 100 × 90px at the 390 × 844 reference viewport.

**Items**
- Refuge signal mast
- Ice melt station
- Solar charger
  - icon: ![Solar charger](assets/expedition/items/solar-charger.png)
- Heater
  - icon: ![Heater](assets/expedition/items/heater.png)
- Habitat fabric
  - icon: ![Habitat fabric](assets/expedition/items/habitat-fabric.png)
- Sealant
  - icon: ![Sealant](assets/expedition/items/sealant.png)
- Seam roller
  - icon: ![Seam roller](assets/expedition/items/seam-roller.png)
- Tie downs
  - icon: ![Tie downs](assets/expedition/items/tie-downs.png)
- Hatch frame
  - icon: ![Hatch frame](assets/expedition/items/hatch-frame.png)
- Insulating blanket
  - icon: ![Insulating blanket](assets/expedition/items/insulating-blanket.png)
- Patch supplies
  - icon: ![Patch supplies](assets/expedition/items/patch-supplies.png)
- Sealed panel
  - icon: ![Sealed panel](assets/expedition/items/sealed-panel.png)
- Vestibule
  - icon: ![Vestibule](assets/expedition/items/vestibule.png)
- Secured vestibule
  - icon: ![Secured vestibule](assets/expedition/items/secured-vestibule.png)
- Insulated vestibule
  - icon: ![Insulated vestibule](assets/expedition/items/insulated-vestibule.png)
- Wrapped vestibule
  - icon: ![Wrapped vestibule](assets/expedition/items/wrapped-vestibule.png)

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

![The enclosed, surviving habitat cabin](assets/expedition/backgrounds/habitat-cabin.webp)

The entrance is secure and insulated, and our signal marks the refuge. Inside, the cabin is still warm and pressurized. I can filter the water collected outside and plant the seeds in their prepared tray. The cabin stores hold the filter, seeds, planting tray and clear cover.

The mission filter is made for this enclosed water source. Once the growing material is moist, the warm habitat will let the seeds germinate. This part of our work takes time in the sheltered cabin.

**Goals**
- Filter water -- Water
- next: Protect the seedlings -- Propagator

**Hotspots**
- Warm habitat (at 50%, 20.5%)
  - icon: ![Warm habitat](assets/expedition/hotspots/warm-habitat.png)
  > NOTE: Mars artwork target: The illuminated fixed germination shelf beneath the cabin window. Centre 50%, 20.5%; transparent hit area 230 × 70px at the 390 × 844 reference viewport.

**Items**
- Warm habitat
- Dirty water
  - icon: ![Dirty water](assets/expedition/items/dirty-water.png)
- Water filter
  - icon: ![Water filter](assets/expedition/items/water-filter.png)
- Seeds
  - icon: ![Seeds](assets/expedition/items/seeds.png)
- Planting tray
  - icon: ![Planting tray](assets/expedition/items/planting-tray.png)
- Clear cover
  - icon: ![Clear cover](assets/expedition/items/clear-cover.png)
- Water
  - icon: ![Water](assets/expedition/items/water.png)
- Seed tray
  - icon: ![Seed tray](assets/expedition/items/seed-tray.png)
- Wet seeds
  - icon: ![Wet seeds](assets/expedition/items/wet-seeds.png)
- Watered seed tray
  - icon: ![Watered seed tray](assets/expedition/items/watered-seed-tray.png)
- Covered seed tray
  - icon: ![Covered seed tray](assets/expedition/items/covered-seed-tray.png)
- Watered covered tray
  - icon: ![Watered covered tray](assets/expedition/items/watered-covered-tray.png)
- Sprouted tray
  - icon: ![Sprouted tray](assets/expedition/items/sprouted-tray.png)
- Propagator
  - icon: ![Propagator](assets/expedition/items/propagator.png)

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

![The landed cargo sled and its rover assembly area](assets/expedition/backgrounds/cargo-sled-assembly-area.webp)

The water is filtered and the seedlings have a warm, sheltered home. To reach the missing crew, we need the relay beyond the ice outcrop. The regional map shows these stations, and the landed sled holds the rover parts, camera and viewing equipment. I can match the visible landmarks to the map and prepare the rover to follow the approach.

From the route overlook beside the sled, the outcrop and nearby landmarks are visible. A supported photograph can be compared with the expedition's existing regional map.

**Goals**
- (three goals are a lot but okay here because solar drive, a fitted harness, and an outcrop route express the vehicle and navigation preparations together; the reviewed drive-to-harness staging showed no established benefit)
- Make Rover drive under solar power -- Rover[Drive unit, Solar charger]
- Fit rover harness -- Rover[Drive unit, Solar charger, Seat harness]
- Find route to the outcrop -- Outcrop navchip

**Hotspots**
- Route overlook (at 70%, 13.5%)
  - icon: ![Route overlook](assets/expedition/hotspots/route-overlook.png)
  > NOTE: Mars artwork target: The exposed rocky viewing shoulder beside the cargo lander, looking across the route. Centre 70%, 13.5%; transparent hit area 140 × 90px at the 390 × 844 reference viewport.

**Items**
- Route overlook
- Support frame
- Wheels
  - icon: ![Wheels](assets/expedition/items/wheels.png)
- Drive motor
  - icon: ![Drive motor](assets/expedition/items/drive-motor.png)
- Motor controller
  - icon: ![Motor controller](assets/expedition/items/motor-controller.png)
- Solar charger
- Seat harness
  - icon: ![Seat harness](assets/expedition/items/seat-harness.png)
- Dish antenna
  - icon: ![Dish antenna](assets/expedition/items/dish-antenna.png)
- Long range radio
  - icon: ![Long range radio](assets/expedition/items/long-range-radio.png)
- Camera
  - icon: ![Camera](assets/expedition/items/camera.png)
- Regional map navchip
  - icon: ![Regional map navchip](assets/expedition/items/regional-map-navchip.png)
- Lens
  - icon: ![Lens](assets/expedition/items/lens.png)
- Optical tube
  - icon: ![Optical tube](assets/expedition/items/optical-tube.png)
- Rover (compound)
  - icon: ![Rover](assets/expedition/items/rover.png)
  - slot: drive, accepts Drive unit, icon: ![fitted Drive unit](assets/expedition/slots/rover--drive-unit.png)
  - slot: traction power, accepts Solar charger, icon: ![fitted Solar charger](assets/expedition/slots/rover--solar-charger.png)
  - unnamed slot: accepts Long range radio, icon: ![fitted Long range radio](assets/expedition/slots/rover--long-range-radio.png)
  - unnamed slot: accepts Seat harness, icon: ![fitted Seat harness](assets/expedition/slots/rover--seat-harness.png)
  - unnamed slot: accepts Tow line, icon: ![fitted Tow line](assets/expedition/slots/rover--tow-line.png)
  - unnamed slot: accepts Crew navchip, icon: ![fitted Crew navchip](assets/expedition/slots/rover--crew-navchip.png)

  [Drive unit, Solar charger] The rover now has the drive and solar-power equipment it needs to travel. It can carry the expedition beyond the landing area.
- Drive unit
  - icon: ![Drive unit](assets/expedition/items/drive-unit.png)
- Field camera
  - icon: ![Field camera](assets/expedition/items/field-camera.png)
- Outcrop approach view
  - icon: ![Outcrop approach view](assets/expedition/items/outcrop-approach-view.png)
- Telescope
  - icon: ![Telescope](assets/expedition/items/telescope.png)
- Field telescope
  - icon: ![Field telescope](assets/expedition/items/field-telescope.png)
- Telescope camera
  - icon: ![Telescope camera](assets/expedition/items/telescope-camera.png)

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

![An expedition sampling station beside exposed Martian ice and a layered cliff](assets/expedition/backgrounds/ice-outcrop-field-station.webp)

The rover is ready, and our navchip holds the approach to the outcrop. The route passes exposed ice and a layered cliff. I will label and photograph the samples so that each observation stays connected with the place it came from.

The expedition sampling case holds a scoop, a transparent jar, a core tube and labels, along with a windowed handling enclosure and sealed glove ports. The cliff viewpoint faces the layers across the route; the recovered optics can help record distant details.

**Goals**
- Label the ice sample -- Catalogued ice sample
- next: Photograph the sample -- Ice photograph
- Photograph core layers -- Core layer photograph

**Hotspots**
- Lookout ice (at 30%, 12%)
  - icon: ![Lookout ice](assets/expedition/hotspots/lookout-ice.png)
  > NOTE: Mars artwork target: The accessible blue-white ice exposure. Centre 30%, 12%; transparent hit area 160 × 95px at the 390 × 844 reference viewport.
- Cliff viewpoint (at 73%, 7.5%)
  - icon: ![Cliff viewpoint](assets/expedition/hotspots/cliff-viewpoint.png)
  > NOTE: Mars artwork target: The layered rock face above and beyond the ice. Centre 73%, 7.5%; transparent hit area 100 × 80px at the 390 × 844 reference viewport.

**Items**
- Lookout ice
- Cliff viewpoint
- Rover[Drive unit, Solar charger, Seat harness]
- Outcrop navchip
  - icon: ![Outcrop navchip](assets/expedition/items/outcrop-navchip.png)
- Cliff photograph
  - icon: ![Cliff photograph](assets/expedition/items/cliff-photograph.png)
- Illuminated glovebox
  - icon: ![Illuminated glovebox](assets/expedition/items/illuminated-glovebox.png)
- Sample scoop
  - icon: ![Sample scoop](assets/expedition/items/sample-scoop.png)
- Transparent jar
  - icon: ![Transparent jar](assets/expedition/items/transparent-jar.png)
- Core tube
  - icon: ![Core tube](assets/expedition/items/core-tube.png)
- Sample labels
  - icon: ![Sample labels](assets/expedition/items/sample-labels.png)
- Windowed box
  - icon: ![Windowed box](assets/expedition/items/windowed-box.png)
- Glove ports
  - icon: ![Glove ports](assets/expedition/items/glove-ports.png)
- Ice sample
  - icon: ![Ice sample](assets/expedition/items/ice-sample.png)
- Sealed ice sample
  - icon: ![Sealed ice sample](assets/expedition/items/sealed-ice-sample.png)
- Catalogued ice sample
  - icon: ![Catalogued ice sample](assets/expedition/items/catalogued-ice-sample.png)
- Ice photograph
  - icon: ![Ice photograph](assets/expedition/items/ice-photograph.png)
- Ice core
  - icon: ![Ice core](assets/expedition/items/ice-core.png)
- Core layer photograph
  - icon: ![Core layer photograph](assets/expedition/items/core-layer-photograph.png)
- Glovebox
  - icon: ![Glovebox](assets/expedition/items/glovebox.png)

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

![A disused Martian weather station with an open instrument site and service equipment](assets/expedition/backgrounds/weather-station-apron.webp)

The ice sample is labelled, and the photographs record the specimen and the core's layers. These observations do not yet establish how old the layers are or how they formed. Dust is moving across the route. I can repair this old weather station and use its observations to decide when to travel.

The mothballed station was stored sensibly: its calibrated sensor mast, detached vane and complete logger are here together. A service enclosure and filter material can protect our spare controller. At the open weather site, the restored station can record changing conditions over a period of observation.

**Goals**
- Find a clear interval -- Weather record
- Make protected controller -- Protected controller

**Hotspots**
- Open weather site (at 39%, 19%)
  - icon: ![Open weather site](assets/expedition/hotspots/open-weather-site.png)
  > NOTE: Mars artwork target: The empty instrument plinth and mounting socket, with conduit back to the shelter. Centre 39%, 19%; transparent hit area 130 × 76px at the 390 × 844 reference viewport.

**Items**
- Open weather site
- Rover[Drive unit, Solar charger, Seat harness]
- Solar charger
- Motor controller
- Sensor mast
  - icon: ![Sensor mast](assets/expedition/items/sensor-mast.png)
- Wind vane
  - icon: ![Wind vane](assets/expedition/items/wind-vane.png)
- Sensor logger
  - icon: ![Sensor logger](assets/expedition/items/sensor-logger.png)
- Filter mesh
  - icon: ![Filter mesh](assets/expedition/items/filter-mesh.png)
- Vented enclosure
  - icon: ![Vented enclosure](assets/expedition/items/vented-enclosure.png)
- Weather station (compound)
  - icon: ![Weather station](assets/expedition/items/weather-station.png)
  - slot: recorder, accepts Sensor logger, icon: ![fitted Sensor logger](assets/expedition/slots/weather-station--sensor-logger.png)
  - slot: power, accepts Solar charger, icon: ![fitted Solar charger](assets/expedition/slots/weather-station--solar-charger.png)
- Weather record
  - icon: ![Weather record](assets/expedition/items/weather-record.png)
- Dust screen
  - icon: ![Dust screen](assets/expedition/items/dust-screen.png)
- Protected controller
  - icon: ![Protected controller](assets/expedition/items/protected-controller.png)

**Combinations**
- Sensor mast [transform] + Wind vane [consume] -> Weather station
- Weather station[Sensor logger, Solar charger] @ Open weather site -> Weather record
- Filter mesh [consume] + Vented enclosure [transform] -> Dust screen
- Dust screen [consume] + Motor controller [transform] -> Protected controller
## Relay knoll

![Relay knoll](assets/expedition/backgrounds/relay-knoll.webp)

The relay mast reaches beyond the ridge. I need to contact the missing crew, locate their reported landmark and program a navchip to guide the rover to them.

The relay itself is still here, with its complete antenna and charged powerpack stored beside it. Its service pouch holds a matched fuse; the fault indicator points to the old one.

[If skipped] The missing crew have answered. Their cabin is intact; its drive has failed. We know where they are.

**Goals**
- Set rover course to the crew -- Rover[Drive unit, Solar charger, Crew navchip]

**Hotspots**
- Relay knoll (at 66%, 20%)
  - icon: ![Relay knoll](assets/expedition/hotspots/relay-knoll.png)
  > NOTE: Mars artwork target: The raised rocky approach immediately below the fixed relay infrastructure. Centre 66%, 20%; transparent hit area 170 × 90px at the 390 × 844 reference viewport.

**Items**
- Relay knoll
- Relay transceiver
  - icon: ![Relay transceiver](assets/expedition/items/relay-transceiver.png)
- Spare fuse
  - icon: ![Spare fuse](assets/expedition/items/spare-fuse.png)
- Directional antenna
  - icon: ![Directional antenna](assets/expedition/items/directional-antenna.png)
- Relay powerpack
  - icon: ![Relay powerpack](assets/expedition/items/relay-powerpack.png)
- Relay (compound)
  - icon: ![Relay](assets/expedition/items/relay.png)
  - slot: antenna, accepts Directional antenna, icon: ![fitted Directional antenna](assets/expedition/slots/relay--directional-antenna.png)
  - slot: power, accepts Relay powerpack, icon: ![fitted Relay powerpack](assets/expedition/slots/relay--relay-powerpack.png)
- Distress recording
  - icon: ![Distress recording](assets/expedition/items/distress-recording.png)
- Crew navchip
  - icon: ![Crew navchip](assets/expedition/items/crew-navchip.png)

**Combinations**
- Relay transceiver [transform] + Spare fuse [consume] -> Relay
- Relay[Directional antenna, Relay powerpack] @ Relay knoll -> Distress recording
- Distress recording [preserve] + Outcrop navchip [transform] -> Crew navchip

## Stranded crawler

![Stranded crawler](assets/expedition/backgrounds/stranded-crawler.webp)

The crew answers: their cabin is intact, but the crawler's drive has failed. I can repair the drive or tow the crawler with our rover to help them reach the nearby refuge.

The crew wait in the intact crawler cabin. Its service compartment holds the spare drive and towing equipment.

> NOTE: Crawler names describe equipment only. The crew remain people in the story, never a second item hidden inside a vehicle label. Repairing or towing produces one vehicle; sheltering them later changes only the refuge.

**Goals**
- Bring the crawler to the service refuge
  - either: Crawler
  - or: Recovered crawler

**Items**
- Recovery rope
  - icon: ![Recovery rope](assets/expedition/items/recovery-rope.png)
- Tow eye
  - icon: ![Tow eye](assets/expedition/items/tow-eye.png)
- Spare drive
  - icon: ![Spare drive](assets/expedition/items/spare-drive.png)
- Drive coupling
  - icon: ![Drive coupling](assets/expedition/items/drive-coupling.png)
- Disabled crawler
  - icon: ![Disabled crawler](assets/expedition/items/disabled-crawler.png)
- Toolkit
- Rover
- Serviced drive
  - icon: ![Serviced drive](assets/expedition/items/serviced-drive.png)
- Replacement drive
  - icon: ![Replacement drive](assets/expedition/items/replacement-drive.png)
- Tow line
  - icon: ![Tow line](assets/expedition/items/tow-line.png)
- Recovered crawler
  - icon: ![Recovered crawler](assets/expedition/items/recovered-crawler.png)

**Combinations**
- Spare drive [transform] + Toolkit -> Serviced drive
- Serviced drive [transform] + Drive coupling [consume] -> Replacement drive
- Replacement drive [consume] + Disabled crawler [transform] -> Crawler
- Recovery rope [transform] + Tow eye [consume] -> Tow line
- Rover[Drive unit, Solar charger, Tow line] + Disabled crawler [transform] -> Recovered crawler

## Service refuge

![Service refuge](assets/expedition/backgrounds/service-refuge.webp)

The crew have reached the nearby service refuge. Its shelter and bedding stores are here; first I need to make it warm and welcoming.

The service refuge has bedding, a folding bed, soup and an insulated flask. The shelter needs preparation before the recovered crew can settle inside.

[If skipped] Everyone is sheltered and fed. With the recovered crew beside us, we can prepare together for the scheduled return window.

**Goals**
- Bring crew to shelter -- Occupied refuge
- next: Feed sheltered crew -- Provisioned refuge

**Items**
- Service shelter · torn seam
  - icon: ![Service shelter · torn seam](assets/expedition/items/service-shelter-torn-seam.png)
- Bedding
  - icon: ![Bedding](assets/expedition/items/bedding.png)
- Soup pouch
  - icon: ![Soup pouch](assets/expedition/items/soup-pouch.png)
- Insulated flask
  - icon: ![Insulated flask](assets/expedition/items/insulated-flask.png)
- Folding bed
  - icon: ![Folding bed](assets/expedition/items/folding-bed.png)
- Sealed refuge
  - icon: ![Sealed refuge](assets/expedition/items/sealed-refuge.png)
- Warm refuge
  - icon: ![Warm refuge](assets/expedition/items/warm-refuge.png)
- Prepared bed
  - icon: ![Prepared bed](assets/expedition/items/prepared-bed.png)
- Prepared refuge
  - icon: ![Prepared refuge](assets/expedition/items/prepared-refuge.png)
- Warm soup
  - icon: ![Warm soup](assets/expedition/items/warm-soup.png)
- Hot meal flask
  - icon: ![Hot meal flask](assets/expedition/items/hot-meal-flask.png)
- Occupied refuge
  - icon: ![Occupied refuge](assets/expedition/items/occupied-refuge.png)
- Provisioned refuge
  - icon: ![Provisioned refuge](assets/expedition/items/provisioned-refuge.png)

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

![Sheltered workcourt](assets/expedition/backgrounds/sheltered-workcourt.webp)

The crew is sheltered and fed. In the refuge's workcourt, I can prepare a lit workbench and contact our families.

The camp stores hold a worktop with its folded legs beneath it, a movable lamp bracket, and the crew’s message camera and antenna stand. Our recovered lamp and solar charger can light the bench.

**Goals**
- Make shared lit workbench -- Lit workbench
- Send crew message home -- Message home

**Items**
- Bench legs
  - icon: ![Bench legs](assets/expedition/items/bench-legs.png)
- Worktop
  - icon: ![Worktop](assets/expedition/items/worktop.png)
- Lamp bracket
  - icon: ![Lamp bracket](assets/expedition/items/lamp-bracket.png)
- Message camera
  - icon: ![Message camera](assets/expedition/items/message-camera.png)
- Antenna stand
  - icon: ![Antenna stand](assets/expedition/items/antenna-stand.png)
- Long range radio (compound)
  - unnamed slot: accepts Antenna stand, icon: ![fitted Antenna stand](assets/expedition/slots/long-range-radio--antenna-stand.png)
- Workbench
  - icon: ![Workbench](assets/expedition/items/workbench.png)
- Bench lamp
  - icon: ![Bench lamp](assets/expedition/items/bench-lamp.png)
- Crew message
  - icon: ![Crew message](assets/expedition/items/crew-message.png)
- Message home
  - icon: ![Message home](assets/expedition/items/message-home.png)

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

![Furniture-sled path](assets/expedition/backgrounds/furniture-sled-path.webp)

The crew's furniture sled is a short walk from camp. I will bring back their table and take a photograph of everyone together.

The furniture sled’s belongings locker contains protective padding and the crew’s picture roll.

**Goals**
- Take crew supper portrait -- Crew portrait

**Hotspots**
- Cargo shoulder (at 74%, 15.5%)
  - icon: ![Cargo shoulder](assets/expedition/hotspots/cargo-shoulder.png)
  > NOTE: Mars artwork target: The grounded freight sled and cloth-wrapped mess crate on the path shoulder. Centre 74%, 15.5%; transparent hit area 110 × 80px at the 390 × 844 reference viewport.

**Items**
- Cargo shoulder
- Sled padding
  - icon: ![Sled padding](assets/expedition/items/sled-padding.png)
- Picture roll
  - icon: ![Picture roll](assets/expedition/items/picture-roll.png)
- Padded sling
  - icon: ![Padded sling](assets/expedition/items/padded-sling.png)
- Recovered mess crate
  - icon: ![Recovered mess crate](assets/expedition/items/recovered-mess-crate.png)
- Mess table
  - icon: ![Mess table](assets/expedition/items/mess-table.png)
- Personal table
  - icon: ![Personal table](assets/expedition/items/personal-table.png)
- Shared supper
  - icon: ![Shared supper](assets/expedition/items/shared-supper.png)
- Crew portrait
  - icon: ![Crew portrait](assets/expedition/items/crew-portrait.png)

**Combinations**
- Recovery rope + Sled padding [transform] -> Padded sling
- Padded sling [preserve] @ Cargo shoulder -> Recovered mess crate
- Recovered mess crate [transform] + Toolkit -> Mess table
- Picture roll [consume] + Mess table [transform] -> Personal table
- Personal table [transform] + Hot meal flask [consume] -> Shared supper
- Message camera + Shared supper [preserve] -> Crew portrait

## Thermal test bay

![Thermal test bay](assets/expedition/backgrounds/thermal-test-bay.webp)

The refuge loses heat at night. In the thermal test bay, I can compare coverings before fitting a screen to its exposed service wall.

The separate camp thermal bay holds its wall sample, measured template and removable screen kit beside the fixed thermal chamber.

The chamber runs matched 20-minute tests. Both samples start at 20°C, with the same sample dimensions and logger position. Its invented example readings compare this covering under these conditions; they do not predict the whole refuge’s temperature.

> NOTE: The thermal readings are fictional comparisons, not measurements taken from NASA or a material qualification.

**Goals**
- Compare wall cooling -- Wrapping slows cooling
- next: Insulate our refuge -- Insulated refuge

**Hotspots**
- Thermal chamber (at 63%, 13%)
  - icon: ![Thermal chamber](assets/expedition/hotspots/thermal-chamber.png)
  > NOTE: Mars artwork target: The open insulated test recess and empty specimen shelf. Centre 63%, 13%; transparent hit area 120 × 110px at the 390 × 844 reference viewport.

**Items**
- Thermal chamber
- Wall sample
  - icon: ![Wall sample](assets/expedition/items/wall-sample.png)
- Temperature logger
  - icon: ![Temperature logger](assets/expedition/items/temperature-logger.png)
- Thermal blanket
  - icon: ![Thermal blanket](assets/expedition/items/thermal-blanket.png)
- Clip frame
  - icon: ![Clip frame](assets/expedition/items/clip-frame.png)
- Measured wall template
  - icon: ![Measured wall template](assets/expedition/items/measured-wall-template.png)
- Insulation swatch
  - icon: ![Insulation swatch](assets/expedition/items/insulation-swatch.png)
- Bare: 20 → 8°C
  - icon: ![Bare: 20 → 8°C](assets/expedition/items/bare-20-8c.png)
- Insulated wall sample
  - icon: ![Insulated wall sample](assets/expedition/items/insulated-wall-sample.png)
- Wrapped: 20 → 16°C
  - icon: ![Wrapped: 20 → 16°C](assets/expedition/items/wrapped-20-16c.png)
- Wrapping slows cooling
  - icon: ![Wrapping slows cooling](assets/expedition/items/wrapping-slows-cooling.png)
- Fitted blanket
  - icon: ![Fitted blanket](assets/expedition/items/fitted-blanket.png)
- Thermal screen
  - icon: ![Thermal screen](assets/expedition/items/thermal-screen.png)
- Insulated refuge
  - icon: ![Insulated refuge](assets/expedition/items/insulated-refuge.png)

**Combinations**
- Temperature logger + Wall sample @ Thermal chamber -> Bare: 20 → 8°C
- Wall sample [transform] + Insulation swatch [consume] -> Insulated wall sample
- Temperature logger + Insulated wall sample [preserve] @ Thermal chamber -> Wrapped: 20 → 16°C
- Bare: 20 → 8°C [preserve] + Wrapped: 20 → 16°C [preserve] -> Wrapping slows cooling
- Measured wall template [preserve] + Thermal blanket [transform] -> Fitted blanket
- Fitted blanket [transform] + Clip frame [consume] -> Thermal screen
- Thermal screen [consume] + Provisioned refuge [transform] -> Insulated refuge

## Enclosed ice works

![Enclosed ice works](assets/expedition/backgrounds/enclosed-ice-works.webp)

Beyond camp is an enclosed ice-processing system with a drained pump loop. The water I saved may let me restart it and supply the camp's growing system.

This is an existing ice-processing pilot site. Its enclosed melter, treatment skid, monitored tank and circulation pump were stored as working appliances. The disconnected return hose is still here.

The exposed service wall is now covered. The test showed that the wrapped sample cooled less than the bare one; the bed and crew remain in the same refuge while we work at the ice system.

**Goals**
- Make camp water system -- Camp water system

**Hotspots**
- Ice works (at 55%, 14.5%)
  - icon: ![Ice works](assets/expedition/hotspots/ice-works.png)
  > NOTE: Mars artwork target: The central service panels beneath the enclosed pipe run. Centre 55%, 14.5%; transparent hit area 180 × 100px at the 390 × 844 reference viewport.

**Items**
- Ice works
- Return hose
  - icon: ![Return hose](assets/expedition/items/return-hose.png)
- Ice melter
  - icon: ![Ice melter](assets/expedition/items/ice-melter.png)
- Treatment skid
  - icon: ![Treatment skid](assets/expedition/items/treatment-skid.png)
- Monitored tank
  - icon: ![Monitored tank](assets/expedition/items/monitored-tank.png)
- Circulation pump
  - icon: ![Circulation pump](assets/expedition/items/circulation-pump.png)
- Camp water system
  - icon: ![Camp water system](assets/expedition/items/camp-water-system.png)

  The protected tank and working pump loop now supply the camp’s enclosed growing system. This process water is for the equipment and growing beds, not drinking.
- Heated melter
  - icon: ![Heated melter](assets/expedition/items/heated-melter.png)
- Collected water
  - icon: ![Collected water](assets/expedition/items/collected-water.png)
- Water reserve
  - icon: ![Water reserve](assets/expedition/items/water-reserve.png)
- Process water
  - icon: ![Process water](assets/expedition/items/process-water.png)
- Dry water loop
  - icon: ![Dry water loop](assets/expedition/items/dry-water-loop.png)
- Primed water loop
  - icon: ![Primed water loop](assets/expedition/items/primed-water-loop.png)

**Combinations**
- Ice melter [transform] + Heater -> Heated melter
- Heated melter [preserve] @ Ice works -> Collected water
- Monitored tank [transform] + Process water [preserve] -> Water reserve
- Primed water loop [transform] + Water reserve [preserve] -> Camp water system
- Collected water [transform] + Treatment skid [preserve] -> Process water
- Circulation pump [transform] + Return hose [consume] -> Dry water loop
- Water + Dry water loop [transform] -> Primed water loop

## Greenhouse growing bed

![Greenhouse growing bed](assets/expedition/backgrounds/greenhouse-growing-bed.webp)

Our mission stores cover the months until the return flight. In the greenhouse, there is time to grow food and prepare the beds for the crews who follow.

The camp greenhouse is mostly intact. Its growing tray, fan, light, brought substrate and seed potatoes were stored here for a later planting. A damaged seam needs the existing patch kit.

The growing beds use the camp’s process-water system. Growing the crop takes several weeks inside the enclosed greenhouse; the mission stores support us while we wait.

[If skipped] After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.

**Goals**
- Grow potatoes; share meal -- Warm potatoes

**Items**
- Greenhouse with torn seam
  - icon: ![Greenhouse with torn seam](assets/expedition/items/greenhouse-with-torn-seam.png)
- Prepared substrate
  - icon: ![Prepared substrate](assets/expedition/items/prepared-substrate.png)
- Drip line
  - icon: ![Drip line](assets/expedition/items/drip-line.png)
- Circulation fan
  - icon: ![Circulation fan](assets/expedition/items/circulation-fan.png)
- Grow light
  - icon: ![Grow light](assets/expedition/items/grow-light.png)
- Seed potato
  - icon: ![Seed potato](assets/expedition/items/seed-potato.png)
- Harvest basket
  - icon: ![Harvest basket](assets/expedition/items/harvest-basket.png)
- Growing bed
  - icon: ![Growing bed](assets/expedition/items/growing-bed.png)
- Greenhouse (compound)
  - icon: ![Greenhouse](assets/expedition/items/greenhouse.png)
  - slot: bed, accepts Watered potatoes, icon: ![fitted Watered potatoes](assets/expedition/slots/greenhouse--watered-potatoes.png)
  - slot: light, accepts Powered grow light, icon: ![fitted Powered grow light](assets/expedition/slots/greenhouse--powered-grow-light.png)
  - slot: air, accepts Circulation fan, icon: ![fitted Circulation fan](assets/expedition/slots/greenhouse--circulation-fan.png)
  - unnamed slot: accepts Positioned diffuser, icon: ![fitted Positioned diffuser](assets/expedition/slots/greenhouse--positioned-diffuser.png)
- Connected drip line
  - icon: ![Connected drip line](assets/expedition/items/connected-drip-line.png)
- Watered potatoes
  - icon: ![Watered potatoes](assets/expedition/items/watered-potatoes.png)
- Powered grow light
  - icon: ![Powered grow light](assets/expedition/items/powered-grow-light.png)
- Warm potatoes
  - icon: ![Warm potatoes](assets/expedition/items/warm-potatoes.png)
- Planting bed
  - icon: ![Planting bed](assets/expedition/items/planting-bed.png)
- Planted potatoes
  - icon: ![Planted potatoes](assets/expedition/items/planted-potatoes.png)
- Potato harvest
  - icon: ![Potato harvest](assets/expedition/items/potato-harvest.png)

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

![Propagation bench](assets/expedition/backgrounds/propagation-bench.webp)

The greenhouse has produced potatoes, and the small tray from landing is still growing. At the nursery bench, I can prepare a lasting place for its seedlings.

A single greenhouse cultivation kit holds the printed grid, original diffuser fitting, soft support lattice and labels. We reuse the landing’s living tray rather than granting another crop.

The growing bed and its fitted equipment remain in the greenhouse. The propagation bench is another working surface in that same structure.

**Goals**
- Camp nursery -- Camp nursery

**Hotspots**
- Nursery test shelf (at 50%, 23.5%)
  - icon: ![Nursery test shelf](assets/expedition/hotspots/nursery-test-shelf.png)
  > NOTE: Mars artwork target: The fixed raised nursery shelf crossed by daylight and structural shadows. Centre 50%, 23.5%; transparent hit area 270 × 66px at the 390 × 844 reference viewport.

**Items**
- Nursery test shelf
- Nursery grid
  - icon: ![Nursery grid](assets/expedition/items/nursery-grid.png)
- Diffuser sheet
  - icon: ![Diffuser sheet](assets/expedition/items/diffuser-sheet.png)
- Diffuser frame
  - icon: ![Diffuser frame](assets/expedition/items/diffuser-frame.png)
- Seedling support
  - icon: ![Seedling support](assets/expedition/items/seedling-support.png)
- Nursery labels
  - icon: ![Nursery labels](assets/expedition/items/nursery-labels.png)
- Shelf shadow view
  - icon: ![Shelf shadow view](assets/expedition/items/shelf-shadow-view.png)
- Shadow layout
  - icon: ![Shadow layout](assets/expedition/items/shadow-layout.png)
- Framed diffuser
  - icon: ![Framed diffuser](assets/expedition/items/framed-diffuser.png)
- Positioned diffuser
  - icon: ![Positioned diffuser](assets/expedition/items/positioned-diffuser.png)
- Identified seedlings
  - icon: ![Identified seedlings](assets/expedition/items/identified-seedlings.png)
- Supported seedlings
  - icon: ![Supported seedlings](assets/expedition/items/supported-seedlings.png)
- Camp nursery
  - icon: ![Camp nursery](assets/expedition/items/camp-nursery.png)

**Combinations**
- Field camera @ Nursery test shelf -> Shelf shadow view
- Shelf shadow view [preserve] + Nursery grid [transform] -> Shadow layout
- Diffuser sheet [consume] + Diffuser frame [transform] -> Framed diffuser
- Framed diffuser [transform] + Shadow layout [preserve] -> Positioned diffuser
- Propagator [transform] + Nursery labels [consume] -> Identified seedlings
- Identified seedlings [transform] + Seedling support [consume] -> Supported seedlings
- Supported seedlings [transform] + Greenhouse[Watered potatoes, Powered grow light, Circulation fan, Positioned diffuser] -> Camp nursery

## Camp machine shop

![Camp machine shop](assets/expedition/backgrounds/camp-machine-shop.webp)

The crawler needs a replacement wheel and a carrier for the samples. The enclosed machine shop has equipment for making and fitting them.

The camp machine-shop cabinet holds the guarded bench-top machine, stock, carrier parts and replacement wheel. Its captive base clamps match the rails on the shared workbench we assembled earlier.

> NOTE: The original crawler also declares radar and suspension slots, but no active recipe installs either component and neither part is stocked. Those unused legacy slots are omitted.

**Goals**
- Fit crawler sample carrier -- Crawler[Bracketed sample carrier]
- Fit replacement wheel -- Crawler[Wheel module]

**Items**
- Machining stock
  - icon: ![Machining stock](assets/expedition/items/machining-stock.png)
- Carrier shell
  - icon: ![Carrier shell](assets/expedition/items/carrier-shell.png)
- Shock foam
  - icon: ![Shock foam](assets/expedition/items/shock-foam.png)
- Latch
  - icon: ![Latch](assets/expedition/items/latch.png)
- Blank bracket
  - icon: ![Blank bracket](assets/expedition/items/blank-bracket.png)
- Guarded bench-top machine
  - icon: ![Guarded bench-top machine](assets/expedition/items/guarded-bench-top-machine.png)
- Replacement wheel
  - icon: ![Replacement wheel](assets/expedition/items/replacement-wheel.png)
- Crawler (compound)
  - icon: ![Crawler](assets/expedition/items/crawler.png)
  - unnamed slot: accepts Wheel module, icon: ![fitted Wheel module](assets/expedition/slots/crawler--wheel-module.png)
  - unnamed slot: accepts Bracketed sample carrier, icon: ![fitted Bracketed sample carrier](assets/expedition/slots/crawler--bracketed-sample-carrier.png)
  - unnamed slot: accepts Marked traverse, icon: ![fitted Marked traverse](assets/expedition/slots/crawler--marked-traverse.png)
- Lit workbench (compound)
  - icon: ![Lit workbench](assets/expedition/items/lit-workbench.png)
  - unnamed slot: accepts Guarded bench-top machine, icon: ![fitted Guarded bench-top machine](assets/expedition/slots/lit-workbench--guarded-bench-top-machine.png)
- Machined axle
  - icon: ![Machined axle](assets/expedition/items/machined-axle.png)
- Wheel module
  - icon: ![Wheel module](assets/expedition/items/wheel-module.png)
- Padded carrier
  - icon: ![Padded carrier](assets/expedition/items/padded-carrier.png)
- Sample carrier
  - icon: ![Sample carrier](assets/expedition/items/sample-carrier.png)
- Mounting bracket
  - icon: ![Mounting bracket](assets/expedition/items/mounting-bracket.png)
- Bracketed sample carrier
  - icon: ![Bracketed sample carrier](assets/expedition/items/bracketed-sample-carrier.png)

**Combinations**
- Lit workbench[Guarded bench-top machine] + Machining stock [transform] -> Machined axle
- Replacement wheel [transform] + Machined axle [consume] -> Wheel module
- Carrier shell [transform] + Shock foam [consume] -> Padded carrier
- Padded carrier [transform] + Latch [consume] -> Sample carrier
- Blank bracket [transform] + Lit workbench[Guarded bench-top machine] -> Mounting bracket
- Sample carrier [transform] + Mounting bracket [consume] -> Bracketed sample carrier
- Replacement drive [consume] + Recovered crawler [transform] -> Crawler

## Lava-rim scout station

![Lava-rim scout station](assets/expedition/backgrounds/lava-rim-scout-station.webp)

The ascent depot lies beyond rough lava. At this scout station, I can use aerial observations to plan the crawler's route.

The geology depot holds a stored Mars scout. Its delicate rotor assembly and battery were packed separately; its flight electronics, camera and legs are already fitted. A route tablet and hazard marker are also here.

**Goals**
- Fit crawler traverse -- Crawler[Marked traverse]

**Hotspots**
- Lava overlook (at 64%, 16%)
  - icon: ![Lava overlook](assets/expedition/hotspots/lava-overlook.png)
  > NOTE: Mars artwork target: The black volcanic rim and open viewing edge beyond the scout clearing. Centre 64%, 16%; transparent hit area 180 × 95px at the 390 × 844 reference viewport.

**Items**
- Lava overlook
- Scout airframe
  - icon: ![Scout airframe](assets/expedition/items/scout-airframe.png)
- Counter rotating rotors
  - icon: ![Counter rotating rotors](assets/expedition/items/counter-rotating-rotors.png)
- Scout battery
  - icon: ![Scout battery](assets/expedition/items/scout-battery.png)
- Route tablet
  - icon: ![Route tablet](assets/expedition/items/route-tablet.png)
- Hazard marker
  - icon: ![Hazard marker](assets/expedition/items/hazard-marker.png)
- Scout (compound)
  - icon: ![Scout](assets/expedition/items/scout.png)
  - slot: battery, accepts Scout battery, icon: ![fitted Scout battery](assets/expedition/slots/scout--scout-battery.png)
- Scout panorama
  - icon: ![Scout panorama](assets/expedition/items/scout-panorama.png)
- Terrain model
  - icon: ![Terrain model](assets/expedition/items/terrain-model.png)
- Traverse map
  - icon: ![Traverse map](assets/expedition/items/traverse-map.png)
- Marked traverse
  - icon: ![Marked traverse](assets/expedition/items/marked-traverse.png)

**Combinations**
- Scout airframe [transform] + Counter rotating rotors [consume] -> Scout
- Scout[Scout battery] @ Lava overlook -> Scout panorama
- Scout panorama [preserve] + Route tablet [preserve] -> Terrain model
- Terrain model + Outcrop navchip [transform] -> Traverse map
- Traverse map [transform] + Hazard marker [consume] -> Marked traverse

## Channel survey station

![Channel survey station](assets/expedition/backgrounds/channel-survey-station.webp)

The aerial view suggested a possible crossing. Here at the channel, I need ground measurements before bringing the crawler onto the approach.

At the channel survey station, the opened field case holds the ground probe, map overlay and crossing marker.

**Goals**
- Mark surveyed channel -- Marked crossing
- Place crawler at channel -- Crawler[Wheel module] @ Channel approach

**Hotspots**
- Channel approach (at 50%, 22%)
  - icon: ![Channel approach](assets/expedition/hotspots/channel-approach.png)
  > NOTE: Mars artwork target: The clear broad approach between the channel banks. Centre 50%, 22%; transparent hit area 220 × 110px at the 390 × 844 reference viewport.

**Items**
- Channel approach
- Ground probe
  - icon: ![Ground probe](assets/expedition/items/ground-probe.png)
- Route overlay
  - icon: ![Route overlay](assets/expedition/items/route-overlay.png)
- Crossing marker
  - icon: ![Crossing marker](assets/expedition/items/crossing-marker.png)
- Ground profile
  - icon: ![Ground profile](assets/expedition/items/ground-profile.png)
- Firm-ground route
  - icon: ![Firm-ground route](assets/expedition/items/firm-ground-route.png)
- Crossing map
  - icon: ![Crossing map](assets/expedition/items/crossing-map.png)
- Marked crossing
  - icon: ![Marked crossing](assets/expedition/items/marked-crossing.png)

**Combinations**
- Ground probe [preserve] @ Channel approach -> Ground profile
- Ground profile [preserve] + Terrain model -> Firm-ground route
- Firm-ground route [preserve] + Route overlay [transform] -> Crossing map
- Crossing map [preserve] + Crossing marker [transform] -> Marked crossing

## Basin coring station

![Basin coring station](assets/expedition/backgrounds/basin-coring-station.webp)

Time to collect a core from this basin, and record its findings against the terrain.

The field laboratory unpacked at the basin core site contains the coring, handling and observation instruments, with its specimen log.

**Goals**
- Store sediment sample -- Retained sediment
- next: Record the basin findings -- Basin field record

**Hotspots**
- Layered basin (at 50%, 23.5%)
  - icon: ![Layered basin](assets/expedition/hotspots/layered-basin.png)
  > NOTE: Mars artwork target: The accessible low stratified bank in front of the basin walls. Centre 50%, 23.5%; transparent hit area 220 × 90px at the 390 × 844 reference viewport.

**Items**
- Layered basin
- Sterile liner
  - icon: ![Sterile liner](assets/expedition/items/sterile-liner.png)
- Core cradle
  - icon: ![Core cradle](assets/expedition/items/core-cradle.png)
- Spectrometer
  - icon: ![Spectrometer](assets/expedition/items/spectrometer.png)
- Calibration target
  - icon: ![Calibration target](assets/expedition/items/calibration-target.png)
- Sample vial
  - icon: ![Sample vial](assets/expedition/items/sample-vial.png)
- Specimen log
  - icon: ![Specimen log](assets/expedition/items/specimen-log.png)
- Core drill
  - icon: ![Core drill](assets/expedition/items/core-drill.png)
- Illuminated microscope
  - icon: ![Illuminated microscope](assets/expedition/items/illuminated-microscope.png)
- Lined core drill
  - icon: ![Lined core drill](assets/expedition/items/lined-core-drill.png)
- Sediment core
  - icon: ![Sediment core](assets/expedition/items/sediment-core.png)
- Supported core
  - icon: ![Supported core](assets/expedition/items/supported-core.png)
- Grain images
  - icon: ![Grain images](assets/expedition/items/grain-images.png)
- Calibrated spectrometer
  - icon: ![Calibrated spectrometer](assets/expedition/items/calibrated-spectrometer.png)
- Retained sediment
  - icon: ![Retained sediment](assets/expedition/items/retained-sediment.png)
- Mineral spectrum
  - icon: ![Mineral spectrum](assets/expedition/items/mineral-spectrum.png)
- Basin field record
  - icon: ![Basin field record](assets/expedition/items/basin-field-record.png)

- `sediment-comparison` "Fine–coarse–fine; spectrum inconclusive"
  - icon: ![Fine–coarse–fine; spectrum inconclusive](assets/expedition/items/finecoarsefine-spectrum-inconclusive.png)

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

![Ripple and gravel edge](assets/expedition/backgrounds/ripple-and-gravel-edge.webp)

The rippled surface and nearby gravel are different sources of evidence. I will mark both photographed sites on the terrain model, compare them with the basin record, and keep the specimens and records separate.

The comparison case is opened at the ripple-and-gravel edge. A loose chip must still be collected visibly from the gravel ledge.

The earlier core has a band of larger grains between two finer layers. Its mineral scan is inconclusive. The record preserves the specimen’s context and the order of its layers, but neither dates them nor tells us what moved the grains. The nearby outcrops give us a chance to investigate that question.

> NOTE: The field observations are fictional expedition notes, not real mission measurements. The photographs are compared without invented calibrated dimensions or evidence of life.

**Goals**
- Compare basin photographs -- Paired terrain photographs
- next: Save basin comparison -- Sleeved comparison
- Keep specimens separate -- Two-cell comparison case[Ripple impression, Logged gravel chip]

**Hotspots**
- Ripple window (at 23%, 24.5%)
  - icon: ![Ripple window](assets/expedition/hotspots/ripple-window.png)
  > NOTE: Mars artwork target: The left low outcrop with visible parallel ripple ridges. Centre 23%, 24.5%; transparent hit area 105 × 80px at the 390 × 844 reference viewport.
- Gravel window (at 77%, 24.5%)
  - icon: ![Gravel window](assets/expedition/hotspots/gravel-window.png)
  > NOTE: Mars artwork target: The right conglomerate ledge with rounded embedded pebbles and loose fragments. Centre 77%, 24.5%; transparent hit area 105 × 80px at the 390 × 844 reference viewport.

**Items**
- Ripple window
- Gravel window
- Context board
  - icon: ![Context board](assets/expedition/items/context-board.png)
- Two-cell comparison case (compound)
  - icon: ![Two-cell comparison case](assets/expedition/items/two-cell-comparison-case.png)
  - slot: ripple, accepts Ripple impression, icon: ![fitted Ripple impression](assets/expedition/slots/two-cell-comparison-case--ripple-impression.png)
  - slot: gravel, accepts Logged gravel chip, icon: ![fitted Logged gravel chip](assets/expedition/slots/two-cell-comparison-case--logged-gravel-chip.png)
- Ripple impression sheet
  - icon: ![Ripple impression sheet](assets/expedition/items/ripple-impression-sheet.png)
- Comparison sleeve
  - icon: ![Comparison sleeve](assets/expedition/items/comparison-sleeve.png)
- Ripple photograph
  - icon: ![Ripple photograph](assets/expedition/items/ripple-photograph.png)
- Gravel photograph
  - icon: ![Gravel photograph](assets/expedition/items/gravel-photograph.png)
- Paired terrain photographs
  - icon: ![Paired terrain photographs](assets/expedition/items/paired-terrain-photographs.png)
- Mapped ripple and gravel sites
  - icon: ![Mapped ripple and gravel sites](assets/expedition/items/mapped-ripple-and-gravel-sites.png)
- Qualified basin story
  - icon: ![Qualified basin story](assets/expedition/items/qualified-basin-story.png)
- Ripple impression
  - icon: ![Ripple impression](assets/expedition/items/ripple-impression.png)
- Logged gravel chip
  - icon: ![Logged gravel chip](assets/expedition/items/logged-gravel-chip.png)
- Comparison board
  - icon: ![Comparison board](assets/expedition/items/comparison-board.png)
- Sleeved comparison
  - icon: ![Sleeved comparison](assets/expedition/items/sleeved-comparison.png)
- Loose gravel chip
  - icon: ![Loose gravel chip](assets/expedition/items/loose-gravel-chip.png)

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

![Depot marker line](assets/expedition/backgrounds/depot-marker-line.webp)

The old depot markers lead toward a stored cargo hauler. The dark surface tracks have changed, so I will follow the fixed markers and use our spare controller to repair the hauler.

One existing depot navigation-and-maintenance locker holds its original survey print, cleaning pad and folding sign. The stored standardized cargo hauler and platform stand beside it. Their compatible controller specification is legible before installation.

Our basin comparison keeps the ripple and gravel sites separate. Rounded gravel within its surrounding rock layers supports ancient flowing water more strongly than ripple shape alone. The protected photographs and diagram retain their source labels, and the specimens remain separate so another team can check the interpretation. None of this establishes a date or evidence of life.

**Goals**
- Depot cargo shuttle -- Depot cargo shuttle

**Hotspots**
- Depot marker line (at 31%, 22%)
  - icon: ![Depot marker line](assets/expedition/hotspots/depot-marker-line.png)
  > NOTE: Mars artwork target: The near fixed identification marker and its rock footing; smaller markers continue toward the depot. Centre 31%, 22%; transparent hit area 85 × 112px at the 390 × 844 reference viewport.

**Items**
- Depot marker line
- Depot survey print
  - icon: ![Depot survey print](assets/expedition/items/depot-survey-print.png)
- Marker cleaning pad
  - icon: ![Marker cleaning pad](assets/expedition/items/marker-cleaning-pad.png)
- Folded route sign
  - icon: ![Folded route sign](assets/expedition/items/folded-route-sign.png)
- Sign foot
  - icon: ![Sign foot](assets/expedition/items/sign-foot.png)
- Depot hauler (compound)
  - icon: ![Depot hauler](assets/expedition/items/depot-hauler.png)
  - slot: controller, accepts Protected controller, icon: ![fitted Protected controller](assets/expedition/slots/depot-hauler--protected-controller.png)
  - slot: platform, accepts Hauler platform, icon: ![fitted Hauler platform](assets/expedition/slots/depot-hauler--hauler-platform.png)
- Hauler platform
  - icon: ![Hauler platform](assets/expedition/items/hauler-platform.png)
- Current marker view
  - icon: ![Current marker view](assets/expedition/items/current-marker-view.png)
- Track disagreement
  - icon: ![Track disagreement](assets/expedition/items/track-disagreement.png)
- Readable route identifier
  - icon: ![Readable route identifier](assets/expedition/items/readable-route-identifier.png)
- Identified service route
  - icon: ![Identified service route](assets/expedition/items/identified-service-route.png)
- Standing route sign
  - icon: ![Standing route sign](assets/expedition/items/standing-route-sign.png)
- Depot route sign
  - icon: ![Depot route sign](assets/expedition/items/depot-route-sign.png)
- Depot cargo shuttle
  - icon: ![Depot cargo shuttle](assets/expedition/items/depot-cargo-shuttle.png)

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

![Oxygen-plant service bay](assets/expedition/backgrounds/oxygen-plant-service-bay.webp)

The ascent depot's oxygen plant is still here. In its service bay, I can restore the equipment needed to prepare the vehicle's oxygen module.

The oxygen plant holds its stored processing stack, controller and filtered intake. The heavy flight module waits on its transport cradle.

**Goals**
- Restore plant; service oxygen -- Serviced oxygen module

**Hotspots**
- Ascent plant (at 30%, 11.7%)
  - icon: ![Ascent plant](assets/expedition/hotspots/ascent-plant.png)
  > NOTE: Mars artwork target: The fixed servicing interface and empty receiving cradle inside the open depot bay. Centre 30%, 11.7%; transparent hit area 110 × 85px at the 390 × 844 reference viewport.

**Items**
- Ascent plant
- Electrolyzer stack
  - icon: ![Electrolyzer stack](assets/expedition/items/electrolyzer-stack.png)
- Process controller
  - icon: ![Process controller](assets/expedition/items/process-controller.png)
- Filtered intake
  - icon: ![Filtered intake](assets/expedition/items/filtered-intake.png)
- Flight oxygen module
  - icon: ![Flight oxygen module](assets/expedition/items/flight-oxygen-module.png)
- Oxygen plant (compound)
  - icon: ![Oxygen plant](assets/expedition/items/oxygen-plant.png)
  - slot: intake, accepts Filtered intake, icon: ![fitted Filtered intake](assets/expedition/slots/oxygen-plant--filtered-intake.png)

  [Filtered intake] The restored plant is ready to process the Martian atmosphere into oxygen using its fitted mission equipment. This gives the return expedition a local oxygen source.
- Serviced oxygen module
  - icon: ![Serviced oxygen module](assets/expedition/items/serviced-oxygen-module.png)
- Docked oxygen module
  - icon: ![Docked oxygen module](assets/expedition/items/docked-oxygen-module.png)

**Combinations**
- Electrolyzer stack [transform] + Process controller [consume] -> Oxygen plant
- Oxygen plant[Filtered intake] + Docked oxygen module [transform] @ Ascent plant -> Serviced oxygen module
- Depot cargo shuttle + Flight oxygen module [transform] @ Ascent plant -> Docked oxygen module

## Cabin preparation bay

![Cabin preparation bay](assets/expedition/backgrounds/cabin-preparation-bay.webp)

The oxygen plant is working. Across the depot, I can repair and fit the waiting cabin, then check its hatch closure and console responses at the ascent pad and record what happens.

The cabin shell survived, but its hatch seal is damaged. The depot stores hold the replacement seal, docking ring, flight console and stowed flight seat.

**Goals**
- Make cabin test record -- Cabin test record

**Hotspots**
- Ascent pad (at 50%, 23.8%)
  - icon: ![Ascent pad](assets/expedition/hotspots/ascent-pad.png)
  > NOTE: Mars artwork target: The empty low circular cabin test cradle on the hangar floor. Centre 50%, 23.8%; transparent hit area 300 × 95px at the 390 × 844 reference viewport.

**Items**
- Ascent pad
- Ascent cabin shell
  - icon: ![Ascent cabin shell](assets/expedition/items/ascent-cabin-shell.png)
- Docking ring
  - icon: ![Docking ring](assets/expedition/items/docking-ring.png)
- Hatch seal
  - icon: ![Hatch seal](assets/expedition/items/hatch-seal.png)
- Flight console
  - icon: ![Flight console](assets/expedition/items/flight-console.png)
- Flight seat
  - icon: ![Flight seat](assets/expedition/items/flight-seat.png)
- Ascent cabin (compound)
  - icon: ![Ascent cabin](assets/expedition/items/ascent-cabin.png)
  - slot: dock, accepts Docking ring, icon: ![fitted Docking ring](assets/expedition/slots/ascent-cabin--docking-ring.png)
  - slot: oxygen, accepts Serviced oxygen module, icon: ![fitted Serviced oxygen module](assets/expedition/slots/ascent-cabin--serviced-oxygen-module.png)
  - slot: console, accepts Flight console, icon: ![fitted Flight console](assets/expedition/slots/ascent-cabin--flight-console.png)
  - slot: seat, accepts Flight seat, icon: ![fitted Flight seat](assets/expedition/slots/ascent-cabin--flight-seat.png)
- Cabin test record
  - icon: ![Cabin test record](assets/expedition/items/cabin-test-record.png)

**Combinations**
- Ascent cabin shell [transform] + Hatch seal [consume] -> Ascent cabin
- Ascent cabin[Docking ring, Serviced oxygen module, Flight console, Flight seat] @ Ascent pad -> Cabin test record

  The repaired hatch closes and the fitted console responds during the pad check. This records a limited functional check of the cabin, not clearance to launch. The rendezvous and final vehicle assembly still need preparation.

## Clear-sky station

![Clear-sky station](assets/expedition/backgrounds/clear-sky-station.webp)

At the clear-sky station, I can compare clocks, observations and beacon measurements with the orbiter. We need to agree where and when the ships will meet.

The clear-sky station’s stored navigation kit holds the orbiter position table, terminal and clock, with the tracker, alignment target, timing receiver and range transponder. The tracker records the stars; the terminal relates that observation to its stored station survey and tracker-mount calibration. That establishes the station’s orientation, not the orbiter’s location.

The cabin check is recorded. We still need the orbiter’s pass prediction and a ranging link to agree our rendezvous, then assemble the final vehicle.

> NOTE: The cabin check, stored station survey and mount calibration are fictional mission premises, not a spacecraft test result or navigation procedure. [JPL’s ephemerides overview](https://ssd.jpl.nasa.gov/orbits.html) and [Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html) support time-related position information; [NASA’s Orion navigation overview](https://www.nasa.gov/missions/lasers-stars-and-sensors-will-guide-nasas-orion-spacecraft/) distinguishes star-tracker orientation from broader navigation. Sources checked 30 October 2026; they do not validate this fictional rendezvous solution.

**Goals**
- Make agreed rendezvous -- Agreed rendezvous

**Hotspots**
- Clear sky station (at 31%, 9%)
  - icon: ![Clear sky station](assets/expedition/hotspots/clear-sky-station.png)
  > NOTE: Mars artwork target: The observatory dome and its entrance terrace, with clear sky above. Centre 31%, 9%; transparent hit area 160 × 110px at the 390 × 844 reference viewport.

**Items**
- Clear sky station
- Orbiter position table
  - icon: ![Orbiter position table](assets/expedition/items/orbiter-position-table.png)

  The table gives predicted orbiter positions at reference-clock times. Comparing it with the received beacon times helps predict a pass; it is one input to the rendezvous, not a complete flight plan.

- Navigation terminal
  - icon: ![Navigation terminal](assets/expedition/items/navigation-terminal.png)
- Alignment target
  - icon: ![Alignment target](assets/expedition/items/alignment-target.png)
- Range transponder
  - icon: ![Range transponder](assets/expedition/items/range-transponder.png)
- Reference clock
  - icon: ![Reference clock](assets/expedition/items/reference-clock.png)
- Timing receiver
  - icon: ![Timing receiver](assets/expedition/items/timing-receiver.png)
- Star tracker
  - icon: ![Star tracker](assets/expedition/items/star-tracker.png)
- Timing station
  - icon: ![Timing station](assets/expedition/items/timing-station.png)
- Aligned star tracker
  - icon: ![Aligned star tracker](assets/expedition/items/aligned-star-tracker.png)
- Star observation
  - icon: ![Star observation](assets/expedition/items/star-observation.png)
- Beacon times
  - icon: ![Beacon times](assets/expedition/items/beacon-times.png)
- Orbiter pass prediction
  - icon: ![Orbiter pass prediction](assets/expedition/items/orbiter-pass-prediction.png)
- Station orientation
  - icon: ![Station orientation](assets/expedition/items/station-orientation.png)
- Rendezvous solution
  - icon: ![Rendezvous solution](assets/expedition/items/rendezvous-solution.png)
- Ranging link
  - icon: ![Ranging link](assets/expedition/items/ranging-link.png)
- Agreed rendezvous
  - icon: ![Agreed rendezvous](assets/expedition/items/agreed-rendezvous.png)

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

![Camp return-packing alcove](assets/expedition/backgrounds/camp-return-packing-alcove.webp)

Back at camp, I will pack the specimens, save the crew portrait and prepare a handover signal for the next crew.

The complete card recorder and its matching archival card can save a copy of the crew portrait alongside our field records. The hauler’s platform and cargo strap match the removable return capsule. Its shock mount and cargo can be fitted in any order; after the ground journey, that same capsule will transfer from the cart’s restraint to the flight dock. The camp handover equipment is ready too.

**Goals**
- (three goals are a lot but okay here because specimen transport, a handover beacon, and the crew portrait have separate return purposes; the reviewed cart-to-handover staging did not resolve the packing repetition)
- Prepare specimen transport cart -- Specimen transport cart
- Make camp handover beacon -- Camp handover beacon
- Archive the crew portrait -- Family record

**Items**
- Shock mount
  - icon: ![Shock mount](assets/expedition/items/shock-mount.png)
- Card recorder
  - icon: ![Card recorder](assets/expedition/items/card-recorder.png)
- Archival card
  - icon: ![Archival card](assets/expedition/items/archival-card.png)
- Cargo strap
  - icon: ![Cargo strap](assets/expedition/items/cargo-strap.png)
- Camp beacon
  - icon: ![Camp beacon](assets/expedition/items/camp-beacon.png)
- Maintenance card
  - icon: ![Maintenance card](assets/expedition/items/maintenance-card.png)
- Return capsule (compound)
  - icon: ![Return capsule](assets/expedition/items/return-capsule.png)
  - unnamed slot: accepts Shock mount, icon: ![fitted Shock mount](assets/expedition/slots/return-capsule--shock-mount.png)
  - slot: ice, accepts Catalogued ice sample, icon: ![fitted Catalogued ice sample](assets/expedition/slots/return-capsule--catalogued-ice-sample.png)
  - slot: sediment, accepts Retained sediment, icon: ![fitted Retained sediment](assets/expedition/slots/return-capsule--retained-sediment.png)
  - slot: archive, accepts Complete field archive, icon: ![fitted Complete field archive](assets/expedition/slots/return-capsule--complete-field-archive.png)
  - slot: comparison, accepts Two-cell comparison case, icon: ![fitted Two-cell comparison case](assets/expedition/slots/return-capsule--two-cell-comparison-case.png)
  - slot: comparison record, accepts Sleeved comparison, icon: ![fitted Sleeved comparison](assets/expedition/slots/return-capsule--sleeved-comparison.png)
- Archival recorder
  - icon: ![Archival recorder](assets/expedition/items/archival-recorder.png)
- Expedition archive
  - icon: ![Expedition archive](assets/expedition/items/expedition-archive.png)
- Complete field archive
  - icon: ![Complete field archive](assets/expedition/items/complete-field-archive.png)
- Camp handover beacon
  - icon: ![Camp handover beacon](assets/expedition/items/camp-handover-beacon.png)
- Secured cart
  - icon: ![Secured cart](assets/expedition/items/secured-cart.png)
- Specimen transport cart
  - icon: ![Specimen transport cart](assets/expedition/items/specimen-transport-cart.png)
- Family record
  - icon: ![Family record](assets/expedition/items/family-record.png)

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

![Final assembly pad](assets/expedition/backgrounds/final-assembly-pad.webp)

At the final assembly pad, the ascent stage and launch equipment are ready for preparation. I will bring the crew, specimens and records to the orbiter at the agreed meeting.

The qualified ascent stage, receiver latch, cargo adapter, telemetry recorder and launch key wait at the depot. The orbiter remains at the remote rendezvous.

**Goals**
- Launch at the agreed rendezvous -- Ascending vehicle

**Items**
- Certified ascent stage
  - icon: ![Certified ascent stage](assets/expedition/items/certified-ascent-stage.png)
- Receiver latch
  - icon: ![Receiver latch](assets/expedition/items/receiver-latch.png)
- Cargo adapter
  - icon: ![Cargo adapter](assets/expedition/items/cargo-adapter.png)
- Telemetry recorder
  - icon: ![Telemetry recorder](assets/expedition/items/telemetry-recorder.png)
- Launch key
  - icon: ![Launch key](assets/expedition/items/launch-key.png)
- Ascent vehicle
  - icon: ![Ascent vehicle](assets/expedition/items/ascent-vehicle.png)
- Capsule dock
  - icon: ![Capsule dock](assets/expedition/items/capsule-dock.png)
- Loaded capsule dock
  - icon: ![Loaded capsule dock](assets/expedition/items/loaded-capsule-dock.png)
- Loaded ascent vehicle
  - icon: ![Loaded ascent vehicle](assets/expedition/items/loaded-ascent-vehicle.png)
- Rendezvous program
  - icon: ![Rendezvous program](assets/expedition/items/rendezvous-program.png)
- Flight ready vehicle
  - icon: ![Flight ready vehicle](assets/expedition/items/flight-ready-vehicle.png)
- Ascending vehicle
  - icon: ![Ascending vehicle](assets/expedition/items/ascending-vehicle.png)

**Combinations**
- Certified ascent stage [transform] + Ascent cabin[Docking ring, Serviced oxygen module, Flight console, Flight seat] [consume] -> Ascent vehicle
- Cargo adapter [consume] + Receiver latch [consume] -> Capsule dock
- Return capsule[Shock mount, Catalogued ice sample, Retained sediment, Complete field archive, Two-cell comparison case, Sleeved comparison] [consume] + Capsule dock [transform] -> Loaded capsule dock
- Ascent vehicle [transform] + Loaded capsule dock [consume] -> Loaded ascent vehicle
- Telemetry recorder [transform] + Agreed rendezvous [preserve] -> Rendezvous program
- Loaded ascent vehicle [transform] + Rendezvous program [consume] -> Flight ready vehicle
- Flight ready vehicle [transform] + Launch key [preserve] -> Ascending vehicle

## Orbital rendezvous

![Orbital rendezvous](assets/expedition/backgrounds/orbital-rendezvous.webp)

The surface falls away. At the agreed rendezvous, the waiting orbiter is finally in front of us.

We have you in sight. Bring your ship alongside; the hatch is waiting.

[If skipped] The crew is safely aboard the orbiter. The docked return ship holds the specimens, their records and our table portrait. The camp is ready for the next crew.

**Goals**
- Bring specimens to orbital hatch -- Docked vehicle @ Orbital hatch

**Hotspots**
- Waiting orbital cabin (at 70%, 39%)
  - icon: ![Waiting orbital cabin](assets/expedition/hotspots/waiting-orbital-cabin.png)
  > NOTE: Mars artwork target: The illuminated upper barrel of the waiting orbital cabin, separate from the front hatch. Centre 70%, 39%; transparent hit area 110 × 90px at the 390 × 844 reference viewport.
- Orbital hatch (at 64%, 60.8%)
  - icon: ![Orbital hatch](assets/expedition/hotspots/orbital-hatch.png)
  > NOTE: Mars artwork target: The large circular forward hatch and illuminated docking rim. Centre 64%, 60.8%; transparent hit area 160 × 160px at the 390 × 844 reference viewport.

**Items**
- Waiting orbital cabin
- Orbital hatch
- Docked vehicle
  - icon: ![Docked vehicle](assets/expedition/items/docked-vehicle.png)

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
