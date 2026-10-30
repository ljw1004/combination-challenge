"""Human-authored Mars candidate. Compiles transparent recipe/stage data; no filler generation."""
from pathlib import Path
import json
stages=[]
def stage(id,title,speaker,text,cache,places,recipes,goals):
    parsed=[]
    for line in recipes.strip().splitlines():
        a,b,out,note=line.split('|',3)
        parsed.append(dict(a=a.strip(),b=b.strip(),result=out.strip(),description=note.strip()))
    stages.append(dict(id=id,title=title,speaker=speaker,motivation=text,cache=cache.split(),locations=places,recipes=parsed,goals=goals))

stage('signal','A voice above the ridge','Mission Control',
 'We lost your signal on landing. Repair the radio and put a powered signal above the ridge. We are listening.',
 'broken-radio cable solar-panel battery lamp reflective-foil support-frame tripod toolkit',
 ['contact-ridge'],'''
broken-radio|cable|radio|Replace the damaged detachable lead; the radio itself is repaired, not duplicated.
solar-panel|battery|solar-charger|Connect the salvaged collector to its compatible storage unit.
radio|solar-charger|solar-radio|Fit an internal power supply to the radio.
reflective-foil|support-frame|reflector|Support the reflective sheet so it directs light.
lamp|battery|lantern|Make a portable powered light.
lantern|reflector|signal-lamp|Direct the light toward the orbiter.
signal-lamp|tripod|signal-beacon|Hold the directed signal steady above the ridge.
''',['radio','place:solar-radio@contact-ridge'])

stage('habitat','Somewhere to come back to','Mission Control',
 'The landing tore the habitat vestibule. The inner cabin still has its certified life-support unit. Make the entry weather-tight, store water, and protect a living tray. The missing survey crew may need this refuge too.',
 'heater water-filter empty-canister seeds planting-tray clear-cover habitat-fabric sealant seam-roller tie-downs hatch-frame insulating-blanket',
 ['sheltered-ice','warm-habitat'],'''
heater|place:sheltered-ice|meltwater|A recovered enclosed melt head collects water; exposed liquid on Mars would not behave like an Earth puddle.
meltwater|water-filter|filtered-water|The mission filter processes this known source inside its enclosed vessel; not real water-safety advice.
filtered-water|empty-canister|water-canister|Seal the water against dust and evaporation.
seeds|planting-tray|seed-tray|The tray contains prepared terrestrial growing medium.
seed-tray|water-canister|watered-seed-tray|Water the prepared tray.
watered-seed-tray|place:warm-habitat|sprouted-tray|Time passes in the warm pressurized cabin; no instant real germination is implied.
sprouted-tray|clear-cover|propagator|Protect the living tray from the disturbed entrance air.
habitat-fabric|sealant|pressure-patch|Prepare a compatible patch for the damaged outer vestibule.
pressure-patch|seam-roller|sealed-panel|Work the compatible seam closed.
sealed-panel|hatch-frame|vestibule|Fit the repaired outer entrance around the existing hatch.
vestibule|tie-downs|anchored-vestibule|Anchor the fabric structure to its prepared footings.
anchored-vestibule|insulating-blanket|insulated-vestibule|Wrap the outer structure; the inner cabin still supplies pressure and life support.
''',['water-canister','propagator','insulated-vestibule'])

stage('rover','The route out','Survey lead',
 'Our survey crawler is overdue. Your cargo sled holds the rover parts. Get moving and map the route before following its last transmission.',
 'wheels drive-motor motor-controller dish-antenna terrain-sheet binoculars camera lens optical-tube compass-module seat-harness',
 ['route-overlook'],'''
support-frame|wheels|rover-chassis|A wheeled chassis is a recognizable rover with unfilled component slots.
drive-motor|motor-controller|drive-unit|Connect the matching controller to the motor.
rover-chassis|drive-unit|motorized-rover|Install the drive component in the same Rover, not a second vehicle.
motorized-rover|solar-charger|solar-rover|Install the traction power module; it is not the radio's internal supply.
solar-radio|dish-antenna|long-range-radio|Fit the directional antenna to the existing radio.
solar-rover|long-range-radio|survey-rover|Install the optional radio module in the same Rover.
survey-rover|seat-harness|belted-rover|Fit the seating restraint to the existing vehicle.
camera|tripod|field-camera|A stable camera can make repeatable wide views.
field-camera|place:route-overlook|panorama|Record the visible route, not a claim that it is safe to cross.
panorama|terrain-sheet|survey-map|Mark the observed landmarks on the map.
binoculars|compass-module|bearing-scope|Read a direction while sighting a landmark.
bearing-scope|survey-map|bearing-map|Add the observed bearings to the existing map.
''',['belted-rover','bearing-map'])

stage('outcrop','What the cliff can tell us','Geologist',
 'The route crosses an exposed ice lens. Keep a sealed specimen and its photograph. A closer view of the layered cliff may tell us which route the crawler took, not what is safe without checking.',
 'sample-scoop transparent-jar core-tube sample-labels caliper scale-card windowed-box glove-ports specimen-rack',
 ['lookout-ice','distant-lookout'],'''
sample-scoop|place:lookout-ice|ice-sample|Collect ice from the exposed outcrop beside the current viewpoint.
ice-sample|transparent-jar|sealed-ice-sample|Seal the actual specimen in its jar.
sealed-ice-sample|sample-labels|catalogued-ice-sample|Retain provenance on the specimen container.
catalogued-ice-sample|camera|ice-photograph|Photograph through the transparent jar.
lens|optical-tube|telescope|Align the recovered optical components.
telescope|tripod|field-telescope|Give the optical tube a stable support.
field-telescope|camera|telescope-camera|Attach the camera to the supported optics.
telescope-camera|place:distant-lookout|cliff-photograph|Record the layered cliff at the route's far side.
cliff-photograph|bearing-map|annotated-map|Add this new observation to the same route map.
windowed-box|glove-ports|glovebox|Fit the matching sealed glove ports to the handling enclosure.
glovebox|lamp|illuminated-glovebox|Light the contained inspection area.
core-tube|place:lookout-ice|ice-core|Recover a short core with its layer order retained.
ice-core|specimen-rack|core-rack|Support the fragile sample for a profile photograph.
core-rack|scale-card|scaled-core|Place a visible scale beside the core without treating the label as a discovery.
scaled-core|camera|core-profile|Record visible structure; the image is evidence, not a proof of ancient life.
''',['catalogued-ice-sample','ice-photograph','annotated-map','core-profile'])

stage('weather','The sky is closing','Weather officer',
 'Visibility is falling, not because a wall of wind will throw the rover over. Dust is cutting the light. Restore this abandoned weather station so we can judge when to move, and protect the equipment we already depend on.',
 'weather-mast wind-vane cup-rotor temperature-probe pressure-sensor logger sensor-cable dust-brush filter-mesh sealed-housing louver-panel',
 ['weather-apron'],'''
weather-mast|wind-vane|wind-direction-mast|Mount the recovered wind-direction instrument.
wind-direction-mast|cup-rotor|anemometer-mast|Fit the companion speed sensor to the mast.
temperature-probe|louver-panel|shielded-thermometer|Shield the sensor from direct sunlight while admitting air.
pressure-sensor|sealed-housing|barometer|Put the compatible pressure sensor in its designed enclosure.
logger|sensor-cable|sensor-logger|Reconnect the station's matching sensor interface.
anemometer-mast|sensor-logger|wind-station|Record wind measurements rather than only seeing the vane move.
wind-station|shielded-thermometer|weather-station|Fit the temperature channel to the station.
weather-station|barometer|instrumented-weather-station|Add the station's pressure channel.
instrumented-weather-station|solar-charger|autonomous-weather-station|Restore its independent power supply.
autonomous-weather-station|place:weather-apron|weather-record|Let the station observe an interval of changing conditions.
dust-brush|solar-panel|clean-solar-panel|Remove deposited dust using the supplied panel-safe brush.
filter-mesh|sealed-housing|dust-screen|Fit a replaceable screen to an equipment inlet.
dust-screen|motor-controller|protected-controller|Protect the compatible electronics enclosure from abrasive dust.
weather-record|annotated-map|weather-route-map|Mark the observed visibility window on the route map; it remains a forecast, not a guarantee.
''',['weather-route-map','autonomous-weather-station','protected-controller'])

stage('relay','A voice in the static','Missing survey crew',
 'We can hear the old relay, but it cannot hear us. Its maintenance cabinet has spare radio parts. Restore a clean signal and tell us what you can see beyond the next rise.',
 'relay-transceiver coaxial-lead bandpass-filter antenna-bracket signal-meter relay-battery charge-regulator timer-module insulation-sleeve antenna-boom spare-fuse',
 ['relay-knoll'],'''
relay-transceiver|spare-fuse|working-transceiver|Replace the identified failed replaceable fuse, not a speculative rewiring puzzle.
coaxial-lead|insulation-sleeve|insulated-feedline|Protect the compatible antenna cable from abrasion.
working-transceiver|bandpass-filter|filtered-transceiver|Fit the recovered front-end filter for the assigned link.
antenna-bracket|antenna-boom|antenna-mount|Assemble the mast's matching mount.
antenna-mount|dish-antenna|relay-antenna|Support the compatible directional antenna.
filtered-transceiver|insulated-feedline|wired-relay|Connect transmitter and feedline.
wired-relay|relay-antenna|directional-relay|Fit the antenna to the restored relay.
relay-battery|charge-regulator|relay-powerpack|Restore the designed battery regulator.
relay-powerpack|solar-panel|relay-charger|Connect the panel to the regulator, not directly to the cells.
directional-relay|relay-charger|powered-relay|Power the complete radio assembly.
powered-relay|signal-meter|tuned-relay|Use the supplied meter to align the antenna on the assigned beacon.
tuned-relay|timer-module|scheduled-relay|Restore the stored relay schedule for the orbiter passes.
scheduled-relay|place:relay-knoll|distress-recording|The restored link receives the missing crew's actual message.
distress-recording|weather-route-map|rescue-route|Their landmarks and your observations locate the crawler without treating a map as magic.
''',['rescue-route','place:scheduled-relay@relay-knoll'])

stage('rescue','Not the only ones stranded','Survey crew',
 'Our cabin is intact, but its drive is not. The service shed has recovery equipment. Bring us into its shelter while you decide how to move the crawler. You do not need to rebuild every broken thing to help us.',
 'recovery-rope tow-eye pulley spare-drive drive-coupling service-shelter damaged-crawler bedding prepared-soup insulated-flask folding-bed traction-mat',
 ['service-depot'],'''
service-shelter|pressure-patch|sealed-refuge|Repair the shelter's documented torn outer seam.
sealed-refuge|heater|warm-refuge|Connect its compatible heating socket; intact life support remains a recovered system.
folding-bed|bedding|prepared-bed|Make a comfortable place for the exhausted crew.
prepared-bed|warm-refuge|rest-refuge|Put the prepared bed inside the heated refuge.
prepared-soup|heater|warm-soup|Warm an existing food pouch; this is not a new recipe from raw chemistry.
warm-soup|insulated-flask|soup-flask|Keep the prepared food warm for the return journey.
spare-drive|toolkit|serviced-drive|Inspect and service the supplied replacement drive.
serviced-drive|drive-coupling|replacement-drive|Fit its matched coupling.
replacement-drive|damaged-crawler|repaired-crawler|Replace the failed drive module in the original crawler.
recovery-rope|tow-eye|tow-line|Fit the rope to the rated recovery eye.
tow-line|belted-rover|recovery-rover|Add a recovery-line component to the existing rover.
recovery-rover|damaged-crawler|towed-crawler|The intact cabin can be towed on this gentle route; repairing its drive is an alternative.
repaired-crawler|rest-refuge|sheltered-crew|Bring the crew into the prepared refuge, leaving their repaired crawler there.
towed-crawler|rest-refuge|sheltered-crew|Tow the intact cabin to the refuge; the same people are rescued, never duplicated.
sheltered-crew|soup-flask|rested-crew|A meal and rest close the rescue beat, rather than becoming another medical minigame.
''',['rested-crew'])

stage('waterworks','Enough water to stay','Crew engineer',
 'The crew knows an old ice-processing test site ahead. Its equipment is incomplete, not imaginary. Restore its enclosed water loop so the camp can do more than melt one cup at a time.',
 'pump-head pump-motor intake-hose melt-chamber heat-exchanger sediment-cartridge conductivity-meter sterilizer-module insulated-tank level-switch return-hose manifold',
 ['ice-works'],'''
pump-head|pump-motor|water-pump|Assemble the matching electric pump head and motor.
water-pump|intake-hose|intake-pump|Fit the rated intake hose.
melt-chamber|heat-exchanger|ice-melter|Restore the enclosed melting vessel and heat exchange coil.
ice-melter|heater|heated-melter|Connect the compatible heater to the sealed vessel.
heated-melter|place:ice-works|collected-water|The local ice feed and enclosed apparatus produce a collected batch.
collected-water|sediment-cartridge|clarified-water|Remove particles; this alone does not establish drinking safety.
clarified-water|sterilizer-module|treated-water|The recovered mission treatment module handles the known source.
treated-water|conductivity-meter|checked-water|Check the mission's source-specific acceptance measurement; not a universal purity test.
insulated-tank|level-switch|monitored-tank|Fit the compatible fill-level cutoff.
monitored-tank|checked-water|water-reserve|Store the treated batch in the protected tank.
intake-pump|manifold|distribution-pump|Connect the compatible branch manifold.
distribution-pump|return-hose|circulating-water-loop|Close the return path of the enclosed demonstration system.
circulating-water-loop|water-reserve|camp-water-system|Feed the closed camp water circuit from its protected reserve.
''',['camp-water-system'])

stage('garden','A meal that grew here','Crew botanist',
 'We have time to wait for a crop, if we give it the right place to grow. The greenhouse shell survived at the camp. Bring it light, a clean growing bed and a dependable water supply.',
 'greenhouse-shell growing-rack prepared-substrate nutrient-pack drip-line circulation-fan grow-light seed-potato harvest-basket root-tray humidity-sensor vent-actuator',
 ['pressurized-greenhouse'],'''
greenhouse-shell|pressure-patch|repaired-greenhouse|Repair the shell's documented seam with the compatible patch.
growing-rack|root-tray|growing-bed|Fit the tray to its support rack.
growing-bed|prepared-substrate|prepared-bed-medium|Use brought terrestrial substrate, not unprocessed perchlorate-bearing regolith.
prepared-bed-medium|nutrient-pack|fed-growing-bed|Add the mission nutrient pack to the growing bed.
fed-growing-bed|seed-potato|planted-potatoes|Plant brought seed stock in the prepared medium.
drip-line|camp-water-system|irrigation-line|Connect the growing circuit to the enclosed water system.
planted-potatoes|irrigation-line|watered-potatoes|Supply the bed without flooding its roots.
circulation-fan|repaired-greenhouse|ventilated-greenhouse|Circulate the interior cabin air; no outside Mars air is admitted.
grow-light|solar-charger|powered-grow-light|Connect the lighting unit to its compatible power supply.
humidity-sensor|vent-actuator|humidity-controller|Restore the greenhouse's designed humidity controls.
ventilated-greenhouse|humidity-controller|controlled-greenhouse|Fit the recovered climate controller.
watered-potatoes|controlled-greenhouse|greenhouse-crop|Place the crop in the functioning pressurized growing enclosure.
greenhouse-crop|powered-grow-light|growing-potatoes|Provide the required supplementary light; elapsed growth time is compressed.
growing-potatoes|harvest-basket|potato-harvest|After a narrated growing interval, harvest the crop.
potato-harvest|heater|warm-potatoes|Cook the harvest in the supplied food-safe heater attachment.
''',['warm-potatoes','controlled-greenhouse'])

stage('workshop','Make what cannot be shipped','Crew engineer',
 'The camp machine shop has stock and tools. Make a reliable replacement wheel and a protected sample carrier. They will let us take the next journey rather than patch this camp forever.',
 'machine-base cutting-head machining-stock spindle-controller guard-panel wheel-hub bearing-set rim-blank tyre-band carrier-shell shock-foam latch blank-bracket',
 ['machine-shop'],'''
machine-base|cutting-head|machine-tool|Fit the recovered tool head to its designed machine base.
machine-tool|spindle-controller|controlled-machine|Connect the matched controller.
controlled-machine|guard-panel|guarded-machine|Restore the supplied safety enclosure.
guarded-machine|machining-stock|machined-axle|Machine the specified replacement axle using the stored design; not freeform precision from hand tools.
wheel-hub|bearing-set|bearing-hub|Fit the designed bearings into the hub.
bearing-hub|rim-blank|wheel-rim|Assemble the replacement wheel structure.
wheel-rim|tyre-band|replacement-wheel|Fit the recovered wheel tread.
replacement-wheel|machined-axle|wheel-module|Make a ready-to-fit wheel and axle module.
carrier-shell|shock-foam|padded-carrier|Protect specimens from vibration.
padded-carrier|latch|sample-carrier|Close the carrier without sealing an unknown atmosphere inside a food container.
blank-bracket|guarded-machine|mounting-bracket|Make the specified carrier bracket from stock.
sample-carrier|mounting-bracket|mounted-sample-carrier|Fit the bracket for a rover-mounted specimen carrier.
wheel-module|repaired-crawler|field-crawler|Fit the replacement wheel to the recovered crawler.
field-crawler|mounted-sample-carrier|science-crawler|Install its protected sample carrier.
''',['science-crawler'])

stage('traverse','Across the dark ground','Survey lead',
 'The route to the old ascent depot crosses rough lava. We can reach it, but not by pretending our first map shows everything. Build a short-range scout and prepare the crawler for the surveyed ground.',
 'scout-airframe counter-rotating-rotors flight-controller navigation-camera landing-legs scout-battery radar-head suspension-damper route-tablet hazard-marker',
 ['lava-overlook'],'''
scout-airframe|counter-rotating-rotors|rotorcraft-frame|Fit purpose-built Mars rotor assemblies, not an Earth toy drone.
rotorcraft-frame|flight-controller|controlled-scout|Install the matching recovered flight controller.
controlled-scout|navigation-camera|navigating-scout|Fit its visual-navigation sensor.
navigating-scout|landing-legs|landing-scout|Restore the landing structure.
landing-scout|scout-battery|powered-scout|Fit the compatible high-rate flight battery.
powered-scout|solar-charger|rechargeable-scout|Restore its ground charging connection.
rechargeable-scout|place:lava-overlook|scout-panorama|Fly a short reconnaissance using the stored flight envelope; thin atmosphere limits performance.
scout-panorama|route-tablet|terrain-model|Turn overlapping calibrated images into a local terrain model using recovered software.
terrain-model|annotated-map|traverse-map|Add the new local terrain observations to the route.
radar-head|science-crawler|sounding-crawler|Fit a recovered ground-sounding instrument to the same crawler.
suspension-damper|sounding-crawler|rough-ground-crawler|Fit the compatible suspension component.
traverse-map|hazard-marker|marked-traverse|Mark the identified route hazards, rather than inventing certainty beyond the surveyed area.
rough-ground-crawler|marked-traverse|traverse-ready-crawler|Load the surveyed route into the crawler's navigation display.
''',['traverse-ready-crawler'])

stage('buried-story','What lies beneath','Geologist',
 'The radar shows a boundary, not a buried city. Collect a core, examine its layers, and compare the measurements. Let the evidence decide what this place used to be.',
 'drill-motor drill-bit sterile-liner core-cradle microscope illuminator spectrometer calibration-target balance sample-vial specimen-log',
 ['layered-basin'],'''
drill-motor|drill-bit|core-drill|Assemble the designed low-impact coring tool.
core-drill|sterile-liner|lined-core-drill|Fit the sample liner without claiming perfect sterility.
lined-core-drill|place:layered-basin|sediment-core|Recover the shallow core with layer order retained.
sediment-core|core-cradle|supported-core|Support the layered material for inspection.
microscope|illuminator|lit-microscope|Illuminate the specimen under the recovered microscope.
supported-core|lit-microscope|grain-images|Record grain shapes; an image alone does not establish biology.
spectrometer|calibration-target|calibrated-spectrometer|Use the supplied target to check the instrument's reference response.
sediment-core|sample-vial|retained-sediment|Save a portion with its source identity.
retained-sediment|calibrated-spectrometer|mineral-spectrum|Measure the specimen's spectral response.
retained-sediment|balance|sample-mass|Record a measurement of this specimen, not a new kind of substance.
grain-images|mineral-spectrum|sediment-comparison|Compare independent observations of the same material.
sediment-comparison|core-profile|layer-interpretation|Compare the local sediment with the earlier ice profile, retaining uncertainty.
layer-interpretation|specimen-log|basin-field-record|Write a sourced interpretation that can travel with the actual specimens.
''',['basin-field-record','retained-sediment'])

stage('oxygen','The plant that breathes stone air','Flight engineer',
 'The ascent depot was built to make oxygen here. Its reactor stack is intact, but the air intake and controls were dismantled for storage. Recommission the certified modules; do not improvise a rocket in a kitchen.',
 'intake-compressor dust-separator intake-filter electrolyzer-stack process-controller oxygen-sensor product-cooler gas-dryer buffer-tank pressure-regulator oxygen-line inspection-port',
 ['ascent-plant'],'''
intake-compressor|dust-separator|dust-separated-intake|Protect the process intake from deposited Mars dust.
dust-separated-intake|intake-filter|filtered-intake|Fit the supplied fine-particle cartridge.
electrolyzer-stack|process-controller|controlled-electrolyzer|Restore the recovered solid-oxide oxygen-generation module and its matched controller.
controlled-electrolyzer|filtered-intake|oxygen-generator|Connect the conditioned carbon-dioxide feed to the engineered module.
oxygen-generator|oxygen-sensor|monitored-generator|Restore the product measurement channel.
product-cooler|gas-dryer|oxygen-conditioner|Assemble the depot's compatible product conditioning train.
monitored-generator|oxygen-conditioner|conditioned-generator|Connect the engineered product train; no unsafe process settings are player instructions.
buffer-tank|pressure-regulator|regulated-buffer|Restore the certified storage vessel's regulator.
regulated-buffer|oxygen-line|connected-buffer|Fit the rated oxygen-service line.
conditioned-generator|connected-buffer|oxygen-plant|Reconnect the designed production and buffer systems.
oxygen-plant|inspection-port|inspectable-oxygen-plant|Restore the specified inspection access and instrumentation connection.
inspectable-oxygen-plant|place:ascent-plant|oxygen-production-record|A narrated supervised test produces a traceable production record, not an assumed unlimited gas supply.
oxygen-production-record|process-controller|verified-oxygen-plant|Mission Control accepts the measured test of the restored plant; the plant retains its identity.
''',['verified-oxygen-plant'])

stage('ascent','A ship with an unfinished job','Flight engineer',
 'The pre-positioned ascent vehicle has waited longer than planned. Its sealed propulsion module survived. Restore the cabin and avionics using the depot parts, then let the built-in tests tell us what still fails.',
 'ascent-cabin docking-ring hatch-seal cabin-fan air-cartridge avionics-rack flight-computer inertial-unit harness-loom display-panel suit-umbilical restraint-frame spare-contact',
 ['ascent-pad'],'''
ascent-cabin|hatch-seal|sealed-ascent-cabin|Replace the documented failed hatch seal.
sealed-ascent-cabin|docking-ring|dockable-cabin|Restore the recovered certified docking interface.
cabin-fan|air-cartridge|cabin-circulator|Assemble the designed air-circulation module.
dockable-cabin|cabin-circulator|ventilated-ascent-cabin|Restore the engineered cabin circulation system.
avionics-rack|flight-computer|flight-rack|Install the recovered computer in its intended rack.
flight-rack|inertial-unit|navigation-rack|Fit the matching inertial reference unit.
harness-loom|spare-contact|repaired-harness|Replace the identified damaged connector contact.
navigation-rack|repaired-harness|wired-avionics|Connect the designed harness to the avionics rack.
wired-avionics|display-panel|flight-console|Restore the cabin's flight interface.
ventilated-ascent-cabin|flight-console|operable-ascent-cabin|Install the restored avionics and display.
restraint-frame|seat-harness|flight-seat|Fit the recovered seating restraint to its frame.
flight-seat|suit-umbilical|suited-flight-seat|Restore the seat's compatible suit service connection.
operable-ascent-cabin|suited-flight-seat|crewed-ascent-cabin|Install the prepared seat in the existing cabin.
crewed-ascent-cabin|place:ascent-pad|cabin-test-record|Run the vehicle's built-in depot test under remote supervision.
''',['cabin-test-record'])

stage('rendezvous','A moving meeting place','Orbital navigator',
 'The orbiter is not above us all the time. We need a common clock and a measured beacon before we agree where to meet. Your old radio and patient observations matter again.',
 'precision-clock star-camera star-catalogue beacon-receiver timing-cable ephemeris-card navigation-terminal alignment-target synchronization-module range-transponder',
 ['clear-sky-station'],'''
precision-clock|synchronization-module|disciplined-clock|Restore the recovered clock synchronization module.
beacon-receiver|timing-cable|timed-receiver|Connect the calibrated timing interface.
timed-receiver|disciplined-clock|timing-station|Record beacon timing against the recovered clock.
star-camera|star-catalogue|star-tracker|Load the matching reference catalogue into the engineered tracker.
star-tracker|alignment-target|aligned-star-tracker|Check its reference alignment using the supplied target.
aligned-star-tracker|place:clear-sky-station|sky-fix|Observe the visible star field; do not navigate by an invented Earth constellation shortcut.
timing-station|place:clear-sky-station|beacon-times|Record the actual received beacon sequence.
beacon-times|ephemeris-card|orbiter-pass-prediction|Compare observations against the transmitted orbital data.
sky-fix|navigation-terminal|ground-reference|Establish the site's observed reference orientation.
ground-reference|orbiter-pass-prediction|rendezvous-solution|The certified navigation software combines measured reference and orbital data.
range-transponder|long-range-radio|ranging-link|Restore the depot's compatible ranging interface.
ranging-link|rendezvous-solution|agreed-rendezvous|Exchange and verify the calculated meeting plan with the orbiter.
''',['agreed-rendezvous'])

stage('departure','What we take with us','Survey crew',
 'We came here to explore, and we leave with more than a survival story. Pack the specimens with their records, leave the camp useful to the next crew, and bring everyone to the ship.',
 'return-capsule shock-mount data-store archival-card specimen-seal cargo-strap crew-manifest camp-beacon maintenance-card transfer-cart',
 ['departure-shelter'],'''
return-capsule|shock-mount|cushioned-capsule|Fit the specimen capsule's vibration protection.
cushioned-capsule|catalogued-ice-sample|ice-return-capsule|Pack the actual labelled ice specimen.
ice-return-capsule|retained-sediment|mixed-specimen-capsule|Add the separately contained sediment without mixing the specimens themselves.
mixed-specimen-capsule|specimen-seal|sealed-return-capsule|Close the traceable return package.
data-store|archival-card|archival-recorder|Fit the compatible archive medium to its reader.
archival-recorder|basin-field-record|geology-archive|Store the recorded observations and explicit uncertainties.
geology-archive|core-profile|complete-field-archive|Keep the earlier profile with the later interpretation.
complete-field-archive|sealed-return-capsule|documented-return-capsule|Attach the archive to the specimen shipment, not into the sample containers.
camp-beacon|maintenance-card|camp-handover-beacon|Leave the next crew a readable status message at the camp.
rested-crew|crew-manifest|accounted-crew|Check the named crew against the actual people being brought aboard.
transfer-cart|cargo-strap|secured-cart|Prepare the depot's cargo cart.
secured-cart|documented-return-capsule|specimen-cart|Secure the return capsule for transfer.
accounted-crew|place:departure-shelter|ready-crew|The crew gathers in the protected staging shelter with its already recovered suits.
''',['ready-crew','specimen-cart','camp-handover-beacon'])

stage('homebound','A light that answers','Mission Control',
 'The ascent system is a recovered flight vehicle, not a collection of improvised parts. We have its cabin tests, oxygen test and agreed rendezvous. Complete the handover, then bring the people and their discoveries home.',
 'certified-ascent-stage flight-release receiver-latch cargo-adapter checklist-terminal telemetry-recorder launch-key orbital-cabin',
 ['ascent-vehicle','orbital-hatch'],'''
certified-ascent-stage|crewed-ascent-cabin|ascent-vehicle|Mate the already qualified vehicle modules at their designed interface.
checklist-terminal|cabin-test-record|cabin-acceptance|Use the actual test record to clear the cabin checks.
cabin-acceptance|verified-oxygen-plant|systems-acceptance|Confirm the depot's oxygen-production test alongside the cabin acceptance; fuel remains a sealed pre-positioned system.
systems-acceptance|flight-release|flight-clearance|Ground control authorizes the recovered vehicle after the documented checks.
cargo-adapter|receiver-latch|capsule-dock|Prepare the designed return-capsule mount.
specimen-cart|capsule-dock|loaded-capsule-dock|Transfer the secured capsule to its ship mount.
ascent-vehicle|loaded-capsule-dock|loaded-ascent-vehicle|Install the specimen cargo without replacing the vehicle.
loaded-ascent-vehicle|ready-crew|boarded-ascent-vehicle|The crew boards the restored cabin.
telemetry-recorder|agreed-rendezvous|rendezvous-program|Load the accepted navigation and telemetry plan into its designed recorder.
boarded-ascent-vehicle|rendezvous-program|flight-ready-vehicle|Load the agreed flight plan into the existing ship.
flight-ready-vehicle|flight-clearance|cleared-ascent-vehicle|Ground control clears this specific prepared vehicle, not an arbitrary checklist token.
cleared-ascent-vehicle|launch-key|ascending-vehicle|A narrated supervised ascent compresses the flight; no real launch procedure is provided.
ascending-vehicle|orbital-cabin|docked-vehicle|The agreed rendezvous meets the waiting orbital cabin.
docked-vehicle|place:orbital-hatch|reunited-crew|Cross the hatch together; the saved specimens and records remain tangible cargo.
''',['reunited-crew'])

ROOT=Path(__file__).parent
(ROOT/'draft.json').write_text(json.dumps({'id':'mars-long-v1','title':'Mars: A Light That Answers','status':'unreviewed authored logical candidate; not live or fun-validated','stages':stages},indent=2)+'\n')
print(len(stages),'stages',sum(len(s['recipes']) for s in stages),'recipes')
