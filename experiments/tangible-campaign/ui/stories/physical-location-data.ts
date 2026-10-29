/** Reviewed location/beat overlay. Original recipe graphs and source snapshots are untouched.
 * Based on the frozen physical plan; scene/popup copy revised for actual initial state. */
export const physicalLocationData = {
  "mars": {
    "locations": [
      {
        "id": "M01",
        "name": "Landing ridge",
        "sceneDescription": "Wreckage lies below a low ridge, with the surviving habitat and cargo sled visible in the distance."
      },
      {
        "id": "M02",
        "name": "Landing habitat",
        "sceneDescription": "The inner cabin is intact, but its outer vestibule is torn beside the sheltered ice and signal mast."
      },
      {
        "id": "M03",
        "name": "Landing cargo yard",
        "sceneDescription": "The cargo sled holds the landed vehicle parts and expedition field equipment beside a clear view of the route ahead."
      },
      {
        "id": "M04",
        "name": "Ice outcrop",
        "sceneDescription": "Exposed ice and layered cliffs interrupt the route; the only equipment here is the field kit we brought."
      },
      {
        "id": "M05",
        "name": "Weather station",
        "sceneDescription": "A disused instrument station stands on its apron with its service equipment still beside it."
      },
      {
        "id": "M06",
        "name": "Northern relay",
        "sceneDescription": "The relay mast stands on a rocky knoll with its antenna, powerpack and maintenance parts."
      },
      {
        "id": "M07",
        "name": "Disabled crawler",
        "sceneDescription": "The crew wait inside their intact crawler, with its recovery equipment and personal belongings aboard."
      },
      {
        "id": "M08",
        "name": "Recovery camp",
        "sceneDescription": "A service refuge, sheltered workcourt and thermal test station share the camp beside the short furniture-sled path."
      },
      {
        "id": "M09",
        "name": "Ice-processing site",
        "sceneDescription": "The enclosed ice plant contains a melter, treatment skid, monitored tank and drained circulation loop."
      },
      {
        "id": "M10",
        "name": "Camp greenhouse",
        "sceneDescription": "The greenhouse contains the growing bed and nursery shelf, with all its cultivation equipment already stored inside."
      },
      {
        "id": "M11",
        "name": "Camp machine shop",
        "sceneDescription": "The enclosed machine shop holds its guarded machine, stock and crawler parts, with space for our portable workbench."
      },
      {
        "id": "M12",
        "name": "Lava-rim field station",
        "sceneDescription": "The geology field station holds the scout and the reusable survey, coring and comparison kits for the traverse."
      },
      {
        "id": "M13",
        "name": "Channel approach",
        "sceneDescription": "The shallow channel lies beyond the scout’s route, with ground that still needs a close inspection."
      },
      {
        "id": "M14",
        "name": "Layered basin",
        "sceneDescription": "The core site, rippled surface and gravel ledge occupy one basin, worked with the field equipment we brought."
      },
      {
        "id": "M15",
        "name": "Depot approach",
        "sceneDescription": "Permanent route markers lead past a stored cargo hauler and its maintenance equipment toward the ascent depot."
      },
      {
        "id": "M16",
        "name": "Ascent depot",
        "sceneDescription": "The oxygen plant, waiting ascent vehicle modules and return-cargo stores occupy the same working pad."
      },
      {
        "id": "M17",
        "name": "Clear-sky station",
        "sceneDescription": "A separate observation station holds the navigation instruments needed to agree a meeting with the orbiter."
      },
      {
        "id": "M18",
        "name": "Orbital rendezvous",
        "sceneDescription": "The waiting orbiter’s hatch comes into view only after our completed ascent reaches the rendezvous."
      }
    ],
    "chapters": [
      {
        "currentChapterId": "signal",
        "locationPhases": [
          "M01"
        ],
        "popupType": "Radio · orbital control",
        "popupScript": "We lost your signal on landing. If you can make yourself heard, we are listening."
      },
      {
        "currentChapterId": "habitat",
        "locationPhases": [
          "M02"
        ],
        "popupType": "Narration",
        "popupScript": "The inner cabin survived. I need somewhere we can come back to, and a signal the missing survey crew can find."
      },
      {
        "currentChapterId": "rover",
        "locationPhases": [
          "M03"
        ],
        "popupType": "Narration",
        "popupScript": "The survey crawler is overdue. Our landed equipment can take us beyond the ridge; first I need a route worth following."
      },
      {
        "currentChapterId": "outcrop",
        "locationPhases": [
          "M04"
        ],
        "popupType": "Narration",
        "popupScript": "The route crosses exposed ice and a layered cliff. I will keep what I find separate from what I only suspect."
      },
      {
        "currentChapterId": "weather",
        "locationPhases": [
          "M05"
        ],
        "popupType": "Narration",
        "popupScript": "Dust is closing over the route. This old station may show us when to move, if I can bring it back to work."
      },
      {
        "currentChapterId": "relay",
        "locationPhases": [
          "M06"
        ],
        "popupType": "Radio · orbital control",
        "popupScript": "The survey crew missed their check-in. This relay reaches beyond the ridge; see whether anyone answers."
      },
      {
        "currentChapterId": "rescue",
        "locationPhases": [
          "M07",
          "M08"
        ],
        "popupType": "Crew radio, then arrival card",
        "popupScript": "Our cabin is intact, but the drive has failed. We can reach the nearby refuge if you can get the crawler moving."
      },
      {
        "currentChapterId": "camp",
        "locationPhases": [
          "M08"
        ],
        "popupType": "Narration",
        "popupScript": "Everyone is warm and fed. I can finally make us a place to work—and let our families hear us."
      },
      {
        "currentChapterId": "cargo-return",
        "locationPhases": [
          "M08"
        ],
        "popupType": "Crew voice",
        "popupScript": "Our table is still on the sled just along the path. Let’s bring it home and take a picture of everyone together."
      },
      {
        "currentChapterId": "night",
        "locationPhases": [
          "M08"
        ],
        "popupType": "Narration",
        "popupScript": "The refuge loses heat after dark. I want a reason for the screen I fit, not just a hopeful extra layer."
      },
      {
        "currentChapterId": "waterworks",
        "locationPhases": [
          "M09"
        ],
        "popupType": "Narration",
        "popupScript": "The crew know an ice-processing site. Our saved water may be enough to restart its loop and make the camp easier to live in."
      },
      {
        "currentChapterId": "garden",
        "locationPhases": [
          "M10"
        ],
        "popupType": "Radio · orbital control",
        "popupScript": "The return window is months away, and the mission stores are secure. You have time to make something grow for the crews who follow."
      },
      {
        "currentChapterId": "nursery",
        "locationPhases": [
          "M10"
        ],
        "popupType": "Narration",
        "popupScript": "The potatoes fed us. The little tray from landing is still alive too; I want the next crew to find more than an empty camp."
      },
      {
        "currentChapterId": "workshop",
        "locationPhases": [
          "M11"
        ],
        "popupType": "Narration",
        "popupScript": "The crawler needs a wheel and a way to carry our samples. Our lit bench belongs beside the shop’s waiting machine."
      },
      {
        "currentChapterId": "traverse",
        "locationPhases": [
          "M12"
        ],
        "popupType": "Narration",
        "popupScript": "The old ascent depot lies beyond rough lava. The geology station’s scout and field kit can help us choose where to go."
      },
      {
        "currentChapterId": "crossing",
        "locationPhases": [
          "M13"
        ],
        "popupType": "Narration",
        "popupScript": "From above, this was a possible crossing. On the ground, I still have to find what will carry the crawler."
      },
      {
        "currentChapterId": "buried-story",
        "locationPhases": [
          "M14"
        ],
        "popupType": "Narration",
        "popupScript": "The basin has kept its layers. I will bring out a core without turning their order into a story I have not earned."
      },
      {
        "currentChapterId": "contrast",
        "locationPhases": [
          "M14"
        ],
        "popupType": "Narration",
        "popupScript": "Those nearby ripples are not the whole story. The gravel gives us another view, and I need to keep the two sources apart."
      },
      {
        "currentChapterId": "depot-way",
        "locationPhases": [
          "M15"
        ],
        "popupType": "Narration",
        "popupScript": "The dark tracks have shifted, but the old depot markers should still be here. Our spare controller may make its hauler useful again."
      },
      {
        "currentChapterId": "oxygen",
        "locationPhases": [
          "M16"
        ],
        "popupType": "Narration",
        "popupScript": "The ascent depot is still standing. Its oxygen plant, vehicle and return equipment are here; I can start putting them back to work."
      },
      {
        "currentChapterId": "ascent",
        "locationPhases": [
          "M16"
        ],
        "popupType": "Narration",
        "popupScript": "The oxygen plant is working. I can turn to the waiting cabin and prepare a ship that will bring the crew home."
      },
      {
        "currentChapterId": "rendezvous",
        "locationPhases": [
          "M17"
        ],
        "popupType": "Radio · orbital control",
        "popupScript": "We will not be overhead all the time. Let’s agree on the same clock and the same meeting place before you launch."
      },
      {
        "currentChapterId": "departure",
        "locationPhases": [
          "M08"
        ],
        "popupType": "Narration",
        "popupScript": "Before we leave, I want the samples protected, the portrait saved and this camp useful to whoever follows us."
      },
      {
        "currentChapterId": "homebound",
        "locationPhases": [
          "M16",
          "M18"
        ],
        "popupType": "Radio · orbital control, then arrival card",
        "popupScript": "We have the rendezvous. Bring everyone and the records home; we will be waiting at the hatch."
      }
    ],
    "sourceAssignments": {
      "broken-radio": "M01",
      "cable": "M01",
      "solar-panel": "M01",
      "battery": "M01",
      "lamp": "M01",
      "reflective-foil": "M01",
      "support-frame": "M01",
      "tripod": "M01",
      "toolkit": "M01",
      "heater": "M02",
      "water-filter": "M02",
      "empty-canister": "M02",
      "seeds": "M02",
      "planting-tray": "M02",
      "clear-cover": "M02",
      "habitat-fabric": "M02",
      "sealant": "M02",
      "seam-roller": "M02",
      "tie-downs": "M02",
      "hatch-frame": "M02",
      "insulating-blanket": "M02",
      "wheels": "M03",
      "drive-motor": "M03",
      "motor-controller": "M03",
      "dish-antenna": "M03",
      "terrain-sheet": "M03",
      "binoculars": "M03",
      "camera": "M03",
      "lens": "M03",
      "optical-tube": "M03",
      "compass-module": "M03",
      "seat-harness": "M03",
      "sample-scoop": "M03",
      "transparent-jar": "M03",
      "core-tube": "M03",
      "sample-labels": "M03",
      "scale-card": "M03",
      "windowed-box": "M03",
      "glove-ports": "M03",
      "specimen-rack": "M03",
      "weather-mast": "M05",
      "wind-vane": "M05",
      "sensor-logger": "M05",
      "filter-mesh": "M05",
      "sealed-housing": "M05",
      "relay-transceiver": "M06",
      "spare-fuse": "M06",
      "relay-antenna": "M06",
      "relay-powerpack": "M06",
      "recovery-rope": "M07",
      "tow-eye": "M07",
      "spare-drive": "M07",
      "drive-coupling": "M07",
      "service-shelter": "M08",
      "damaged-crawler": "M07",
      "bedding": "M08",
      "prepared-soup": "M08",
      "insulated-flask": "M08",
      "folding-bed": "M08",
      "bench-legs": "M08",
      "worktop": "M08",
      "lamp-bracket": "M08",
      "solar-lamp": "M08",
      "message-camera": "M08",
      "antenna-stand": "M08",
      "sled-padding": "M07",
      "picture-roll": "M07",
      "wall-coupon": "M08",
      "temperature-logger": "M08",
      "thermal-blanket": "M08",
      "clip-frame": "M08",
      "wall-template": "M08",
      "insulation-swatch": "M08",
      "return-hose": "M09",
      "ice-melter": "M09",
      "treatment-skid": "M09",
      "monitored-tank": "M09",
      "circulation-pump": "M09",
      "greenhouse-shell": "M10",
      "prepared-substrate": "M10",
      "drip-line": "M10",
      "circulation-fan": "M10",
      "grow-light": "M10",
      "seed-potato": "M10",
      "harvest-basket": "M10",
      "growing-bed": "M10",
      "nursery-grid": "M10",
      "diffuser-sheet": "M10",
      "diffuser-frame": "M10",
      "seedling-support": "M10",
      "nursery-labels": "M10",
      "machining-stock": "M11",
      "carrier-shell": "M11",
      "shock-foam": "M11",
      "latch": "M11",
      "blank-bracket": "M11",
      "guarded-machine": "M11",
      "replacement-wheel": "M11",
      "scout-airframe": "M12",
      "counter-rotating-rotors": "M12",
      "scout-battery": "M12",
      "route-tablet": "M12",
      "hazard-marker": "M12",
      "ground-probe": "M12",
      "route-overlay": "M12",
      "crossing-marker": "M12",
      "sterile-liner": "M12",
      "core-cradle": "M12",
      "spectrometer": "M12",
      "calibration-target": "M12",
      "balance": "M12",
      "sample-vial": "M12",
      "specimen-log": "M12",
      "core-drill": "M12",
      "lit-microscope": "M12",
      "context-board": "M12",
      "two-cell-case": "M12",
      "ripple-cast-sheet": "M12",
      "loose-gravel-chip": "EARNED at M14 Gravel window",
      "comparison-sleeve": "M12",
      "depot-survey-print": "M15",
      "marker-cleaning-pad": "M15",
      "folded-route-sign": "M15",
      "sign-foot": "M15",
      "depot-hauler": "M15",
      "hauler-platform": "M15",
      "electrolyzer-stack": "M16",
      "process-controller": "M16",
      "filtered-intake": "M16",
      "flight-oxygen-module": "M16",
      "damaged-ascent-cabin": "M16",
      "docking-ring": "M16",
      "hatch-seal": "M16",
      "flight-console": "M16",
      "suited-flight-seat": "M16",
      "ephemeris-card": "M17",
      "navigation-terminal": "M17",
      "alignment-target": "M17",
      "range-transponder": "M17",
      "disciplined-clock": "M17",
      "timed-receiver": "M17",
      "star-tracker": "M17",
      "return-capsule": "M16",
      "shock-mount": "M16",
      "data-store": "M16",
      "archival-card": "M16",
      "cargo-strap": "M16",
      "camp-beacon": "M16",
      "maintenance-card": "M16",
      "certified-ascent-stage": "M16",
      "receiver-latch": "M16",
      "cargo-adapter": "M16",
      "telemetry-recorder": "M16",
      "launch-key": "M16",
      "orbital-cabin": "INFRASTRUCTURE at M18, not an inventory grant"
    }
  },
  "elements": {
    "locations": [
      {
        "id": "E01",
        "name": "River clearing",
        "sceneDescription": "An open riverbank holds the four beginnings, an orchard edge, a shallow brook and room for a first home."
      },
      {
        "id": "E02",
        "name": "Mill bend",
        "sceneDescription": "The stream bends around a millpond, with a cleared mill yard and baking place beside the water."
      },
      {
        "id": "E03",
        "name": "Orchard garden",
        "sceneDescription": "Fruit trees surround an open garden where preserving, growing and observing plants can continue together."
      },
      {
        "id": "E04",
        "name": "Potter’s yard",
        "sceneDescription": "A waiting kiln and a sheltered clay workyard stand beside the river path."
      },
      {
        "id": "E05",
        "name": "Quarry workshop",
        "sceneDescription": "An iron quarry and a rough workbench offer one place for making and using stoneworking tools."
      },
      {
        "id": "E06",
        "name": "River landing",
        "sceneDescription": "The broad river opens beyond a landing where boats, passengers and messages can come and go."
      },
      {
        "id": "E07",
        "name": "Harbour headland",
        "sceneDescription": "A high coastal viewpoint overlooks the harbour approach, the tidal shore and a wide night sky."
      },
      {
        "id": "E08",
        "name": "Village square",
        "sceneDescription": "An open square surrounds the shared table, kitchen hearth and sheltered spaces for music, stories and pictures."
      }
    ],
    "chapters": [
      {
        "currentChapterId": "beginnings",
        "locationPhases": [
          "E01"
        ],
        "popupType": "Story card",
        "popupScript": "Four beginnings lie beside the river. There is room here to see what they can become."
      },
      {
        "currentChapterId": "supper",
        "locationPhases": [
          "E01"
        ],
        "popupType": "Story card",
        "popupScript": "The same riverbank would be a good place for supper. A little food makes staying here feel possible."
      },
      {
        "currentChapterId": "shelter",
        "locationPhases": [
          "E01"
        ],
        "popupType": "Story card",
        "popupScript": "There is food beside the river, but no roof for the night. Let’s make somewhere worth waking up."
      },
      {
        "currentChapterId": "crossing",
        "locationPhases": [
          "E01"
        ],
        "popupType": "Story card",
        "popupScript": "The brook still divides the clearing. A bridge and a cart would make everyday journeys easier."
      },
      {
        "currentChapterId": "mill",
        "locationPhases": [
          "E02"
        ],
        "popupType": "Arrival story card",
        "popupScript": "At the bend, the stream keeps doing work whether anyone is watching or not. We could let it help with the grain."
      },
      {
        "currentChapterId": "bakery",
        "locationPhases": [
          "E02"
        ],
        "popupType": "Story card",
        "popupScript": "The mill has given us flour. The baker wants to turn it into something light enough to carry on the road."
      },
      {
        "currentChapterId": "orchard",
        "locationPhases": [
          "E03"
        ],
        "popupType": "Arrival story card",
        "popupScript": "The orchard gives more fruit than today can hold. Some of this summer should last beyond the gathering."
      },
      {
        "currentChapterId": "pottery",
        "locationPhases": [
          "E04"
        ],
        "popupType": "Arrival story card",
        "popupScript": "The kiln is warm. A bowl and a table made here should still be useful after a thousand suppers."
      },
      {
        "currentChapterId": "workshop",
        "locationPhases": [
          "E05"
        ],
        "popupType": "Arrival story card",
        "popupScript": "The quarry can give more than loose stones. A useful tool left here will help the next pair of hands too."
      },
      {
        "currentChapterId": "ferry",
        "locationPhases": [
          "E06"
        ],
        "popupType": "Arrival story card",
        "popupScript": "The river is wider here. A landing and a sail can turn the far bank from a view into a place to go."
      },
      {
        "currentChapterId": "harbour",
        "locationPhases": [
          "E07"
        ],
        "popupType": "Arrival story card",
        "popupScript": "From the headland, the river and harbour make one broad view. Visitors will need to find this way back after dark."
      },
      {
        "currentChapterId": "garden",
        "locationPhases": [
          "E03"
        ],
        "popupType": "Return story card",
        "popupScript": "Back in the orchard, there is room for more than trees. The young plants could have a place of their own."
      },
      {
        "currentChapterId": "waterworks",
        "locationPhases": [
          "E03"
        ],
        "popupType": "Story card",
        "popupScript": "The beds are uphill from the water. We could make the climb once in a channel instead of once for every bucket."
      },
      {
        "currentChapterId": "weavers",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Arrival story card",
        "popupScript": "The square is beginning to look like somewhere people might stay. Shade and colour would make the welcome visible."
      },
      {
        "currentChapterId": "letters",
        "locationPhases": [
          "E06"
        ],
        "popupType": "Return story card",
        "popupScript": "The landing is ready, but distant neighbours do not know it yet. News can travel by the boats we have made possible."
      },
      {
        "currentChapterId": "music",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Return story card",
        "popupScript": "The square has shade. Now it needs something people can hear from the next street."
      },
      {
        "currentChapterId": "theatre",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Story card",
        "popupScript": "After the music, the children want a story. We already have a river full of things worth remembering."
      },
      {
        "currentChapterId": "optics",
        "locationPhases": [
          "E02"
        ],
        "popupType": "Return story card",
        "popupScript": "The millpond looks still from here. A closer view may reveal a much busier place."
      },
      {
        "currentChapterId": "botany",
        "locationPhases": [
          "E03"
        ],
        "popupType": "Return story card",
        "popupScript": "Visitors keep asking about the plants. We could give them something they can compare with what grows here."
      },
      {
        "currentChapterId": "weather",
        "locationPhases": [
          "E07"
        ],
        "popupType": "Return story card",
        "popupScript": "From the headland, the boatbuilder watches the sky as well as the water. A record would help tomorrow’s crews compare what changed."
      },
      {
        "currentChapterId": "saltshore",
        "locationPhases": [
          "E07"
        ],
        "popupType": "Story card",
        "popupScript": "The tidal shore is below us, and the crossing has no hearth. Food for the boats should travel better than a hot supper."
      },
      {
        "currentChapterId": "cleanwater",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Return story card",
        "popupScript": "The first guests have reached the square. One asks for a drink; another would like to wash before helping."
      },
      {
        "currentChapterId": "washday",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Story card",
        "popupScript": "The visiting cooks would rather join in than wait. Let’s make the washing place ready for their hands."
      },
      {
        "currentChapterId": "kitchen",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Story card",
        "popupScript": "The cooks are beside us, and the guests are here. It is time for the table to be more than a thing we made."
      },
      {
        "currentChapterId": "stores",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Story card",
        "popupScript": "Some of what we have prepared can outlast the feast. Let’s leave the square with stores for another day."
      },
      {
        "currentChapterId": "lanterns",
        "locationPhases": [
          "E06"
        ],
        "popupType": "Return story card",
        "popupScript": "The water is darkening around the landing. A light can welcome a boat without turning the whole evening into work."
      },
      {
        "currentChapterId": "timekeeping",
        "locationPhases": [
          "E06"
        ],
        "popupType": "Story card",
        "popupScript": "People are asking which way to go and when the boats leave. Let’s make the landing easy to understand."
      },
      {
        "currentChapterId": "stars",
        "locationPhases": [
          "E07"
        ],
        "popupType": "Return story card",
        "popupScript": "Some visitors will stay for the stars. The headland can offer them a steady view before the last boats go."
      },
      {
        "currentChapterId": "gallery",
        "locationPhases": [
          "E08"
        ],
        "popupType": "Return story card",
        "popupScript": "A small crowd has gathered around the pictures. We could leave the stories on view instead of putting them away."
      },
      {
        "currentChapterId": "gathering",
        "locationPhases": [
          "E06"
        ],
        "popupType": "Return / ending card",
        "popupScript": "The last boats are gathering at the lit landing. What we made stays here—for our neighbours, and for the day we return."
      }
    ],
    "sourceAssignments": {
      "earth": "E01",
      "water": "E01",
      "air": "E01",
      "fire": "E01"
    }
  },
  "kitchen": {
    "locations": [
      {
        "id": "K01",
        "name": "Roadside hearth",
        "sceneDescription": "The caravan’s grain, apples and everyday equipment stand beside a roadside hearth."
      },
      {
        "id": "K02",
        "name": "Orchard farm kitchen",
        "sceneDescription": "The farm kitchen joins its dairy and bakehouse, with their ordinary stores available throughout the stay."
      },
      {
        "id": "K03",
        "name": "Market inn kitchen",
        "sceneDescription": "The inn’s kitchen shelters the rainbound caravan beside its vegetable pantry, stove and oven."
      },
      {
        "id": "K04",
        "name": "Market cookshop",
        "sceneDescription": "One market kitchen holds its dough bench, hot-food equipment and preserving supplies for the day’s services."
      },
      {
        "id": "K05",
        "name": "Fair bakery",
        "sceneDescription": "The fair’s working bakery holds confectionery, custard and baking equipment around one continuing service."
      },
      {
        "id": "K06",
        "name": "Station kitchen",
        "sceneDescription": "The station kitchen contains the tea service, freezing equipment, preserving lines and supper trolley before the train departs."
      }
    ],
    "chapters": [
      {
        "currentChapterId": "hearth",
        "locationPhases": [
          "K01"
        ],
        "popupType": "Arrival card",
        "popupScript": "The caravan has stopped before the road grows busy. The children want breakfast before the carts move again."
      },
      {
        "currentChapterId": "dairy",
        "locationPhases": [
          "K02"
        ],
        "popupType": "Arrival / keeper dialogue",
        "popupScript": "You may use the farm kitchen while you stay. Breakfast first; the harvest crew will be hungry again at lunch."
      },
      {
        "currentChapterId": "orchard",
        "locationPhases": [
          "K02"
        ],
        "popupType": "Story card",
        "popupScript": "The harvest crew is coming in. The farm kitchen and our breakfast preparations can help with a different meal."
      },
      {
        "currentChapterId": "soup",
        "locationPhases": [
          "K03"
        ],
        "popupType": "Arrival card",
        "popupScript": "Rain has held the caravan at the inn. Our bread can still give the guests a warm supper."
      },
      {
        "currentChapterId": "salads",
        "locationPhases": [
          "K03"
        ],
        "popupType": "Cook dialogue",
        "popupScript": "After that rich supper, something lighter would be welcome. The pantry and our earlier preparations are still here."
      },
      {
        "currentChapterId": "noodles",
        "locationPhases": [
          "K04"
        ],
        "popupType": "Arrival / cook dialogue",
        "popupScript": "The market kitchen has more guests than expected. Stay through the evening; we have food to stretch and fruit to save."
      },
      {
        "currentChapterId": "pastry",
        "locationPhases": [
          "K04"
        ],
        "popupType": "Story card",
        "popupScript": "The stall needs something savoury and something sweet. Our earlier fillings and the dough bench are ready for another service."
      },
      {
        "currentChapterId": "sauce",
        "locationPhases": [
          "K04"
        ],
        "popupType": "Story card",
        "popupScript": "The stalls are closing, but their keepers have not eaten. The same kitchen can give them a hot supper."
      },
      {
        "currentChapterId": "sugar",
        "locationPhases": [
          "K04"
        ],
        "popupType": "Story card",
        "popupScript": "There is more ripe fruit than tonight can use. Save some of it, and let the rest finish the meal."
      },
      {
        "currentChapterId": "confection",
        "locationPhases": [
          "K05"
        ],
        "popupType": "Arrival / baker dialogue",
        "popupScript": "The fair will keep this bakery busy all day. We have the sweet stores and baking tools; your earlier preparations will help."
      },
      {
        "currentChapterId": "custard",
        "locationPhases": [
          "K05"
        ],
        "popupType": "Story card",
        "popupScript": "There is bread left for pudding, and fruit for the counter. Keep some custard for the cold desserts still to come."
      },
      {
        "currentChapterId": "choux",
        "locationPhases": [
          "K05"
        ],
        "popupType": "Story card",
        "popupScript": "The counter is empty again. Our custard and cream are ready for something light enough to hold them."
      },
      {
        "currentChapterId": "sponge",
        "locationPhases": [
          "K05"
        ],
        "popupType": "Story card",
        "popupScript": "A birthday party has joined the fair. The same batter can give the table several kinds of celebration."
      },
      {
        "currentChapterId": "chocolate",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Arrival / station cook dialogue",
        "popupScript": "The family’s train leaves this evening. Use the station kitchen while they wait; the cold service and departure stores are here too."
      },
      {
        "currentChapterId": "quickbread",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Story card",
        "popupScript": "More passengers are waiting for tea. We can feed them now without waiting for another yeast dough."
      },
      {
        "currentChapterId": "ice",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Story card",
        "popupScript": "The platform is still hot. Our earlier custard and fruit can make the wait a little kinder."
      },
      {
        "currentChapterId": "meringue",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Story card",
        "popupScript": "The saved whites are still useful. Let’s make something for the passengers without forgetting the work that produced them."
      },
      {
        "currentChapterId": "cannery",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Guard dialogue",
        "popupScript": "The train’s catering cart has been delayed. Can this kitchen send supper now and a sealed reserve for later?"
      },
      {
        "currentChapterId": "precision",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Story card",
        "popupScript": "The sealed reserve is ready. Our fresh stew, loaf and a finished cake can feed the passengers tonight."
      },
      {
        "currentChapterId": "snack",
        "locationPhases": [
          "K06"
        ],
        "popupType": "Guard / ending dialogue",
        "popupScript": "The dining-car hatch is open. Send the meal and provisions aboard, and we can leave ready to feed everyone."
      }
    ],
    "sourceAssignments": {
      "grain": "K01",
      "millstone": "K01",
      "water": "K01",
      "fruit": "K01",
      "press": "K01",
      "yeast-culture": "K02",
      "milk": "K02",
      "yogurt-culture": "K02",
      "cream": "K02",
      "churn": "K02",
      "cloth": "K02",
      "herbs": "K02",
      "cider-yeast": "K02",
      "vinegar-culture": "K02",
      "olive-oil": "K02",
      "salad-leaves": "K02",
      "roots": "K03",
      "onions": "K03",
      "cooked-beans": "K03",
      "ground-mustard": "K03",
      "cucumber": "K03",
      "evelyn-lettuce": "K03",
      "bread-knife": "K04",
      "eggs": "K04",
      "rolling-pin": "K04",
      "cutting-wheel": "K04",
      "grated-cheese": "K04",
      "cauliflower": "K04",
      "sugar": "K04",
      "citrus": "K04",
      "almonds": "K05",
      "mortar": "K05",
      "dates": "K05",
      "egg-yolks": "K05",
      "vanilla": "K05",
      "starch": "K05",
      "egg-whites": "K05",
      "sugar-mill": "K05",
      "whisk": "K05",
      "cocoa": "K05",
      "cacao-nibs": "K06",
      "cocoa-butter": "K06",
      "baking-powder": "K06",
      "baking-soda": "K06",
      "freezing-churn": "K06",
      "empty-jar": "K06",
      "opener": "K06",
      "empty-tin": "K06",
      "supper-trolley": "K06"
    }
  },
  "copy": {
    "locations": [
      {
        "id": "P01",
        "name": "Print shop",
        "sceneDescription": "Paper, ink and a roller wait beside the shop’s press and its reflected RIVER matrix."
      },
      {
        "id": "P02",
        "name": "Carving workroom",
        "sceneDescription": "Blank blocks and tools share the workroom with a tracing window, display frame and completed-orders chest."
      }
    ],
    "chapters": [
      {
        "currentChapterId": "sample",
        "locationPhases": [
          "P01"
        ],
        "popupType": "Shop dialogue",
        "popupScript": "We need a new wooden copy of our RIVER design. Take a paper impression to the carving workroom."
      },
      {
        "currentChapterId": "commission",
        "locationPhases": [
          "P02"
        ],
        "popupType": "Customer dialogue",
        "popupScript": "This panel will hang in the frame. People will read the wooden face itself, like your paper master."
      },
      {
        "currentChapterId": "printer-commission",
        "locationPhases": [
          "P02"
        ],
        "popupType": "Printer dialogue",
        "popupScript": "I need a block for printing that same design. This time people will read the paper impression, not the wooden face."
      }
    ],
    "sourceAssignments": {
      "papers": "P01",
      "stock": "P02"
    }
  }
} as const;
