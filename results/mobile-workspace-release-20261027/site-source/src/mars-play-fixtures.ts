/** Generated from public materialsWitness() ordinary route. Debug-only, never normal play. */
import type {Action} from "../experiments/working-materials-types.ts";
export const FIXTURE_ACTIONS: ({type:"select";map:string}|Action)[] = [
  {
    "type": "select",
    "map": "landing"
  },
  {
    "type": "combine",
    "a": "greenhouse",
    "b": "place:bed"
  },
  {
    "type": "combine",
    "a": "o:72",
    "b": "lamp"
  },
  {
    "type": "combine",
    "a": "solar-cell",
    "b": "cable"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "heater",
    "context": {
      "at": "ice"
    }
  },
  {
    "type": "combine",
    "a": "o:84",
    "b": "tube"
  },
  {
    "type": "combine",
    "a": "o:84",
    "b": "o:72",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "o:84",
    "b": "o:72",
    "context": {
      "operation": "connect",
      "channel": "water"
    }
  },
  {
    "type": "combine",
    "a": "camera",
    "b": "place:signal-perch"
  },
  {
    "type": "combine",
    "a": "o:93",
    "b": "place:bed",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "combine",
    "a": "o:93",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "select",
    "map": "ice"
  },
  {
    "type": "combine",
    "a": "greenhouse",
    "b": "place:bed"
  },
  {
    "type": "combine",
    "a": "o:98",
    "b": "lamp"
  },
  {
    "type": "combine",
    "a": "solar-heater",
    "b": "place:clean-ice"
  },
  {
    "type": "combine",
    "a": "o:106",
    "b": "tube"
  },
  {
    "type": "combine",
    "a": "o:106",
    "b": "o:98",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "o:106",
    "b": "o:98",
    "context": {
      "operation": "connect",
      "channel": "water"
    }
  },
  {
    "type": "combine",
    "a": "sample-tray",
    "b": "place:table"
  },
  {
    "type": "combine",
    "a": "o:115",
    "b": "place:table",
    "context": {
      "operation": "sample"
    }
  },
  {
    "type": "combine",
    "a": "sample-case",
    "b": "place:alcove"
  },
  {
    "type": "combine",
    "a": "o:119",
    "b": "place:alcove",
    "context": {
      "operation": "sample"
    }
  },
  {
    "type": "select",
    "map": "twin"
  },
  {
    "type": "combine",
    "a": "greenhouse",
    "b": "place:bed"
  },
  {
    "type": "combine",
    "a": "o:126",
    "b": "lamp"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:east-ridge"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:west-ridge"
  },
  {
    "type": "combine",
    "a": "o:138",
    "b": "o:138",
    "context": {
      "operation": "aim",
      "direction": "west"
    }
  },
  {
    "type": "combine",
    "a": "o:134",
    "b": "o:126",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "o:138",
    "b": "o:126",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "frame",
    "b": "clear-film",
    "context": {
      "at": "west-view"
    }
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "camera",
    "context": {
      "operation": "inside"
    }
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "wheels"
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "place:landmark",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "place:east-view"
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "place:landmark",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "combine",
    "a": "o:144",
    "b": "place:alcove"
  },
  {
    "type": "select",
    "map": "arch"
  },
  {
    "type": "combine",
    "a": "o:1",
    "b": "wheels"
  },
  {
    "type": "combine",
    "a": "o:1",
    "b": "hinge"
  },
  {
    "type": "combine",
    "a": "o:1",
    "b": "o:1",
    "context": {
      "operation": "fold"
    }
  },
  {
    "type": "combine",
    "a": "o:1",
    "b": "place:destination"
  },
  {
    "type": "combine",
    "a": "o:1",
    "b": "o:1",
    "context": {
      "operation": "close"
    }
  },
  {
    "type": "combine",
    "a": "frame",
    "b": "wheels",
    "context": {
      "at": "gap-west"
    }
  },
  {
    "type": "combine",
    "a": "o:158",
    "b": "hinge"
  },
  {
    "type": "combine",
    "a": "o:158",
    "b": "place:gap-east",
    "context": {
      "operation": "span"
    }
  },
  {
    "type": "combine",
    "a": "frame",
    "b": "place:gap-west"
  },
  {
    "type": "combine",
    "a": "o:163",
    "b": "place:gap-east",
    "context": {
      "operation": "span"
    }
  },
  {
    "type": "combine",
    "a": "o:158",
    "b": "o:158",
    "context": {
      "operation": "fold"
    }
  },
  {
    "type": "combine",
    "a": "o:158",
    "b": "place:gap-east",
    "context": {
      "via": [
        "lower-west",
        "lower-east"
      ]
    }
  },
  {
    "type": "select",
    "map": "dust"
  },
  {
    "type": "combine",
    "a": "sample-case",
    "b": "place:warm-room"
  },
  {
    "type": "combine",
    "a": "o:165",
    "b": "heater"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:ridge"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:ridge"
  },
  {
    "type": "combine",
    "a": "o:177",
    "b": "o:177",
    "context": {
      "operation": "aim",
      "direction": "west"
    }
  },
  {
    "type": "combine",
    "a": "o:173",
    "b": "o:165",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "o:177",
    "b": "o:165",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "greenhouse",
    "b": "place:bed"
  },
  {
    "type": "combine",
    "a": "sample-case",
    "b": "place:cool-room"
  },
  {
    "type": "combine",
    "a": "sample-case",
    "b": "place:specimen-site"
  },
  {
    "type": "combine",
    "a": "o:197",
    "b": "place:specimen-site",
    "context": {
      "operation": "sample"
    }
  },
  {
    "type": "combine",
    "a": "o:197",
    "b": "wheels"
  },
  {
    "type": "combine",
    "a": "o:197",
    "b": "place:sample-alcove"
  },
  {
    "type": "combine",
    "a": "camera",
    "b": "place:window"
  },
  {
    "type": "combine",
    "a": "o:205",
    "b": "place:landmark",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "select",
    "map": "return"
  },
  {
    "type": "combine",
    "a": "camera",
    "b": "place:junction"
  },
  {
    "type": "combine",
    "a": "o:8",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:8",
    "b": "o:213",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:16",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:16",
    "b": "o:213",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:213",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:24",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:24",
    "b": "place:dock"
  },
  {
    "type": "combine",
    "a": "o:24",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "select",
    "map": "optics"
  },
  {
    "type": "combine",
    "a": "solar-heater",
    "b": "place:survey-window"
  },
  {
    "type": "combine",
    "a": "sand",
    "b": "o:222",
    "context": {
      "operation": "transform",
      "recipe": "fuse"
    }
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "frame"
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "o:29",
    "context": {
      "operation": "inside"
    }
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "place:beacon",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "clear-film"
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "wheels"
  },
  {
    "type": "combine",
    "a": "o:228",
    "b": "place:wet-station"
  },
  {
    "type": "combine",
    "a": "greenhouse",
    "b": "place:shade-bed"
  },
  {
    "type": "combine",
    "a": "clear-cast",
    "b": "place:shade-bed"
  },
  {
    "type": "combine",
    "a": "o:243",
    "b": "mesh",
    "context": {
      "operation": "transform",
      "recipe": "frost"
    }
  },
  {
    "type": "combine",
    "a": "o:236",
    "b": "o:243"
  },
  {
    "type": "combine",
    "a": "frame",
    "b": "foil",
    "context": {
      "at": "mirror-perch"
    }
  },
  {
    "type": "combine",
    "a": "o:246",
    "b": "o:246",
    "context": {
      "operation": "aim",
      "direction": "west"
    }
  },
  {
    "type": "combine",
    "a": "o:246",
    "b": "o:236",
    "context": {
      "operation": "connect",
      "channel": "light"
    }
  },
  {
    "type": "select",
    "map": "forms"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:spring",
    "context": {
      "operation": "transform",
      "recipe": "wet-clay"
    }
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:opening"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:opening",
    "context": {
      "operation": "transform",
      "recipe": "take-form"
    }
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:opening",
    "context": {
      "operation": "fit",
      "part": "p:34"
    }
  },
  {
    "type": "combine",
    "a": "solar-heater",
    "b": "place:opening"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "o:259",
    "context": {
      "operation": "transform",
      "recipe": "fire",
      "part": "p:34"
    }
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:drain"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:drain",
    "context": {
      "operation": "fit",
      "part": "p:34"
    }
  },
  {
    "type": "combine",
    "a": "assembly:26",
    "b": "place:basin"
  },
  {
    "type": "combine",
    "a": "o:267",
    "b": "clear-film",
    "context": {
      "operation": "transform",
      "recipe": "line",
      "part": "p:269"
    }
  },
  {
    "type": "combine",
    "a": "o:267",
    "b": "place:basin",
    "context": {
      "operation": "fit",
      "part": "p:269"
    }
  },
  {
    "type": "combine",
    "a": "assembly:26",
    "b": "place:drain"
  },
  {
    "type": "combine",
    "a": "o:275",
    "b": "place:drain",
    "context": {
      "operation": "fit",
      "part": "p:277"
    }
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "hinge"
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "o:33",
    "context": {
      "operation": "fold"
    }
  },
  {
    "type": "combine",
    "a": "o:33",
    "b": "place:collection",
    "context": {
      "via": [
        "low-mouth",
        "low-exit"
      ]
    }
  },
  {
    "type": "combine",
    "a": "fiber",
    "b": "place:spring",
    "context": {
      "operation": "transform",
      "recipe": "pulp"
    }
  },
  {
    "type": "combine",
    "a": "pulp",
    "b": "place:casting-bay"
  },
  {
    "type": "combine",
    "a": "o:286",
    "b": "o:35",
    "context": {
      "operation": "transform",
      "recipe": "sheet"
    }
  },
  {
    "type": "combine",
    "a": "assembly:31",
    "b": "place:paper-slot"
  },
  {
    "type": "combine",
    "a": "o:289",
    "b": "place:paper-slot",
    "context": {
      "operation": "fit",
      "part": "p:290"
    }
  },
  {
    "type": "combine",
    "a": "o:35",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:35",
    "b": "place:tool-rack"
  },
  {
    "type": "select",
    "map": "archive"
  },
  {
    "type": "combine",
    "a": "record-sheet",
    "b": "place:vault-a"
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "o:37",
    "context": {
      "operation": "transform",
      "recipe": "impress"
    }
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "clear-film",
    "context": {
      "operation": "transform",
      "recipe": "laminate",
      "part": "p:297"
    }
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "place:wet-exhibit"
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:296",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "record-sheet",
    "b": "place:vault-a"
  },
  {
    "type": "combine",
    "a": "o:306",
    "b": "o:37",
    "context": {
      "operation": "transform",
      "recipe": "impress"
    }
  },
  {
    "type": "combine",
    "a": "o:306",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:306",
    "b": "place:press"
  },
  {
    "type": "combine",
    "a": "o:45",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:45",
    "b": "o:53",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:53",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:53",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:53",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:53",
    "b": "place:registry"
  },
  {
    "type": "combine",
    "a": "soft-clay",
    "b": "place:relief"
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "place:relief",
    "context": {
      "operation": "transform",
      "recipe": "take-form"
    }
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "place:relief",
    "context": {
      "operation": "fit",
      "part": "p:320"
    }
  },
  {
    "type": "combine",
    "a": "solar-heater",
    "b": "place:relief"
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "o:324",
    "context": {
      "operation": "transform",
      "recipe": "fire"
    }
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "clear-film",
    "context": {
      "operation": "transform",
      "recipe": "line"
    }
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:319",
    "b": "place:relief-display"
  },
  {
    "type": "select",
    "map": "outpost"
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "wheels"
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "place:bed"
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "clear-cast"
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "camera",
    "context": {
      "operation": "inside"
    }
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "lamp"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:ridge"
  },
  {
    "type": "combine",
    "a": "solar-lead",
    "b": "place:ridge"
  },
  {
    "type": "combine",
    "a": "o:346",
    "b": "o:346",
    "context": {
      "operation": "aim",
      "direction": "west"
    }
  },
  {
    "type": "combine",
    "a": "o:342",
    "b": "o:65",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "o:346",
    "b": "o:65",
    "context": {
      "operation": "connect",
      "channel": "power"
    }
  },
  {
    "type": "combine",
    "a": "tube",
    "b": "place:dirty-spring"
  },
  {
    "type": "combine",
    "a": "tube",
    "b": "mesh",
    "context": {
      "at": "filter-pad"
    }
  },
  {
    "type": "combine",
    "a": "o:352",
    "b": "o:354",
    "context": {
      "operation": "connect",
      "channel": "water"
    }
  },
  {
    "type": "combine",
    "a": "o:354",
    "b": "o:65",
    "context": {
      "operation": "connect",
      "channel": "water"
    }
  },
  {
    "type": "combine",
    "a": "sample-tray",
    "b": "place:table"
  },
  {
    "type": "combine",
    "a": "o:360",
    "b": "place:table",
    "context": {
      "operation": "sample"
    }
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "place:lookout",
    "context": {
      "operation": "observe"
    }
  },
  {
    "type": "combine",
    "a": "o:57",
    "b": "lens"
  },
  {
    "type": "combine",
    "a": "o:57",
    "b": "o:65",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:65",
    "b": "place:receiver",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "soft-clay",
    "b": "place:opening"
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "place:opening",
    "context": {
      "operation": "transform",
      "recipe": "take-form"
    }
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "place:opening",
    "context": {
      "operation": "fit",
      "part": "p:368"
    }
  },
  {
    "type": "combine",
    "a": "solar-heater",
    "b": "place:opening"
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "o:372",
    "context": {
      "operation": "transform",
      "recipe": "fire"
    }
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "camera"
  },
  {
    "type": "combine",
    "a": "o:57",
    "b": "o:367",
    "context": {
      "operation": "transmit"
    }
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "cart"
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "hinge"
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "o:367",
    "context": {
      "operation": "fold"
    }
  },
  {
    "type": "combine",
    "a": "o:367",
    "b": "place:arrival",
    "context": {
      "via": [
        "low-west",
        "low-east"
      ]
    }
  }
];

/** Primitive/material ancestry for normal visits; fixture-specific generic IDs must not be assumed to transfer. */
export const FIXTURE_DESIGN_COMPONENTS:Record<string,string[]>={"assembly:26":["fired-form","frame","wheels"],"assembly:31":["record-sheet"]};
