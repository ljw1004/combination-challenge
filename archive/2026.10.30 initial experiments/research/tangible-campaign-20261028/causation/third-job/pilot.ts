import type {Scenario} from '../runtime/schema/scenario.ts';
export const pilot:Scenario = {
  "schemaVersion": 1,
  "id": "causation-gate-property-candidate-v3",
  "title": "The Quarry Workshop · Gate trial",
  "premise": "An isolated third-job trial: the workshop supplies the village path makers.",
  "items": [
    {
      "id": "fiber",
      "label": "Hemp bundle",
      "description": "Fibres for making a coil of binding rope."
    },
    {
      "id": "twister",
      "label": "Twisting stick",
      "description": "A reusable tool for twisting fibres into rope."
    },
    {
      "id": "rope",
      "label": "Rope coil",
      "description": "The shared coil you made supplies lengths for binding carriers and securing workshop fittings. The remaining coil stays available.",
      "capabilities": [
        "holds-gate-open",
        "tensile-restraint"
      ]
    },
    {
      "id": "boards",
      "label": "Board kit",
      "description": "Prepared boards and their fasteners, enough for one closed crate."
    },
    {
      "id": "willow",
      "label": "Willow bundle",
      "description": "Flexible willow, enough for one open-weave basket."
    },
    {
      "id": "crate",
      "label": "Closed crate",
      "description": "A sturdy carrier with a closed bottom. It holds coarse stones and fine sand.",
      "capabilities": [
        "stone-carrier",
        "retains-fine-sand"
      ]
    },
    {
      "id": "basket",
      "label": "Open-weave basket",
      "description": "A sturdy carrier. Its woven gaps hold coarse stones but let fine sand fall through.",
      "capabilities": [
        "stone-carrier",
        "gravel-sieve"
      ]
    },
    {
      "id": "drill",
      "label": "Hand drill",
      "description": "A reusable tool for making small holes in wood."
    },
    {
      "id": "pierced-crate",
      "label": "Perforated crate",
      "description": "The same crate, now pierced with small holes. Coarse gravel stays; fine sand falls through.",
      "capabilities": [
        "stone-carrier",
        "gravel-sieve"
      ]
    },
    {
      "id": "rough-gravel",
      "label": "Sandy gravel",
      "description": "The load brought back from the quarry: coarse gravel mixed with fine sand."
    },
    {
      "id": "sorted-gravel",
      "label": "Sorted gravel",
      "description": "The coarse gravel remains after sifting. This shared pile supplies the path and small workshop uses; a portion can be used without exhausting it.",
      "capabilities": [
        "path-gravel"
      ]
    },
    {
      "id": "stone-basket",
      "label": "Stone-filled basket",
      "description": "The basket you made, weighted with part of the sorted gravel. Its carrying loop can hang from the gate’s pulley hook.",
      "capabilities": [
        "holds-gate-open",
        "hanging-weight"
      ]
    }
  ],
  "locations": [
    {
      "id": "quarry",
      "label": "Quarry gate",
      "description": "Bring a stone carrier here. The path makers take it on the collection trip and return it with gravel."
    },
    {
      "id": "gate",
      "label": "Parcel gate",
      "description": "A ring in the overhead beam can hold a tie to the raised gate. The other hook runs over a pulley. The walkway must remain clear for wide parcels."
    }
  ],
  "initialItems": [
    "fiber",
    "twister",
    "boards",
    "willow"
  ],
  "recipes": [
    {
      "id": "twist-rope",
      "a": "fiber",
      "b": "twister",
      "out": "rope",
      "description": "The worker twists the fibres into binding rope.",
      "lifecycle": {
        "fiber": {
          "role": "transform",
          "reason": "This hemp becomes a coil of binding rope."
        },
        "twister": {
          "role": "retain",
          "reason": "The twisting stick remains reusable."
        }
      }
    },
    {
      "id": "make-crate",
      "a": "boards",
      "b": "rope",
      "out": "crate",
      "description": "The worker joins and lashes the boards into a closed crate.",
      "lifecycle": {
        "boards": {
          "role": "transform",
          "reason": "The board kit becomes one closed crate."
        },
        "rope": {
          "role": "retain",
          "reason": "This shared coil provides a length of binding rope; enough remains for the other carrier."
        }
      }
    },
    {
      "id": "weave-basket",
      "a": "willow",
      "b": "rope",
      "out": "basket",
      "description": "The worker weaves the willow and binds its rim with rope.",
      "lifecycle": {
        "willow": {
          "role": "transform",
          "reason": "This willow becomes one open-weave basket."
        },
        "rope": {
          "role": "retain",
          "reason": "This shared coil provides a length of binding rope; enough remains for the other carrier."
        }
      }
    },
    {
      "id": "pierce-crate",
      "a": "crate",
      "b": "drill",
      "out": "pierced-crate",
      "description": "The worker pierces the base. The crate now passes fine sand rather than keeping it in.",
      "lifecycle": {
        "crate": {
          "role": "transform",
          "reason": "The same finite crate is perforated; its closed-bottom form is gone."
        },
        "drill": {
          "role": "retain",
          "reason": "The drill remains a reusable tool."
        }
      }
    },
    {
      "id": "sift-with-basket",
      "a": "rough-gravel",
      "b": "basket",
      "out": "sorted-gravel",
      "description": "Fine sand falls through the weave; coarse gravel remains.",
      "lifecycle": {
        "rough-gravel": {
          "role": "transform",
          "reason": "The finite mixed load becomes sorted gravel; separated sand falls below the work area."
        },
        "basket": {
          "role": "retain",
          "reason": "The basket is used as a sieve and remains available."
        }
      }
    },
    {
      "id": "sift-with-crate",
      "a": "rough-gravel",
      "b": "pierced-crate",
      "out": "sorted-gravel",
      "description": "Fine sand falls through the holes; coarse gravel remains.",
      "lifecycle": {
        "rough-gravel": {
          "role": "transform",
          "reason": "The finite mixed load becomes sorted gravel; separated sand falls below the work area."
        },
        "pierced-crate": {
          "role": "retain",
          "reason": "The perforated crate is used as a sieve and remains available."
        }
      }
    },
    {
      "id": "weight-basket",
      "a": "sorted-gravel",
      "b": "basket",
      "out": "stone-basket",
      "description": "Part of the sorted gravel fills the basket, making it a hanging weight.",
      "lifecycle": {
        "basket": {
          "role": "transform",
          "reason": "The same basket becomes the stone-filled basket; there is no separate empty copy."
        },
        "sorted-gravel": {
          "role": "retain",
          "reason": "A portion fills the basket; the shared gravel pile remains for the path. Quantities are not a puzzle or budget."
        }
      }
    }
  ],
  "stages": [
    {
      "id": "carrier",
      "title": "A trip to the quarry",
      "speaker": "The path maker",
      "motivation": "We need a sturdy carrier for coarse stones. Bring one to the quarry gate.",
      "completionText": "The carrier goes to the quarry and comes back with the load.",
      "area": {
        "id": "workshop",
        "label": "Workshop",
        "travelText": "The path makers stop at your workshop."
      },
      "locations": [
        "quarry"
      ],
      "caches": [],
      "objectives": [
        {
          "id": "supply-carrier",
          "text": "Bring a stone carrier.",
          "kind": "place",
          "capability": "stone-carrier",
          "location": "quarry"
        }
      ]
    },
    {
      "id": "sieve",
      "title": "Gravel for the path",
      "speaker": "The mason",
      "motivation": "The load is full of fine sand. I need the coarse gravel: let the sand fall through, but keep the stones.",
      "completionText": "The sand falls away. The gravel is ready for the path.",
      "area": {
        "id": "yard",
        "label": "Mason’s yard",
        "travelText": "The carrier returns with its load. Your rope coil and spare materials come to the mason’s yard too."
      },
      "locations": [],
      "carry": [
        "rope",
        "crate",
        "basket",
        "boards",
        "willow"
      ],
      "caches": [
        {
          "id": "returned-load",
          "label": "Back from the quarry",
          "narrative": "The returned load is tipped out beside a hand drill.",
          "items": [
            "rough-gravel",
            "drill"
          ]
        }
      ],
      "objectives": [
        {
          "id": "separate-gravel",
          "text": "Separate the gravel.",
          "kind": "create",
          "item": "sorted-gravel"
        }
      ]
    },
    {
      "id": "gate",
      "title": "Hands free at the gate",
      "speaker": "The parcel carriers",
      "motivation": "The gate keeps dropping while we carry wide parcels through. Keep the opening clear. There is a ring above the raised gate and a free pulley hook.",
      "completionText": "The gate stops dropping. Two carriers walk through together, each holding a parcel with both hands. Nobody has to stay behind to hold it.",
      "area": {
        "id": "landing",
        "label": "Ferry landing",
        "travelText": "We bring our carriers, binding rope and gravel to the landing."
      },
      "locations": [
        "gate"
      ],
      "carry": [
        "rope",
        "sorted-gravel",
        "crate",
        "pierced-crate",
        "basket",
        "stone-basket",
        "boards",
        "willow"
      ],
      "caches": [],
      "objectives": [
        {
          "id": "hold-gate",
          "text": "Keep the gate open.",
          "kind": "place",
          "capability": "holds-gate-open",
          "location": "gate"
        }
      ]
    }
  ],
  "sources": [
    {
      "id": "physics",
      "title": "Aristotle, Physics II.2–3, II.9",
      "url": "https://classics.mit.edu/Aristotle/physics.2.ii.html",
      "note": "End-directed craft and conditional necessity. Fictional carriers are a design inference, not Aristotle’s examples."
    },
    {
      "id": "metaphysics",
      "title": "Aristotle, Metaphysics VII.7",
      "url": "https://classics.mit.edu/Aristotle/metaphysics.7.vii.html",
      "note": "Reasoning from an end to a practicable intervention; forward making realizes the chosen means."
    }
  ],
  "notes": [
    "Research probe, not a promoted campaign or a human-tested game.",
    "Both initial forms carry stones; both open forms sieve gravel. No quota, cost, or exclusive-choice rule.",
    "The basket route needs no alteration; drilling preserves the same crate but removes its fine-sand containment property.",
    "Every later successful route uses an earlier-made carrier or the earlier-made rope to produce another fitting carrier.",
    "The three crafting steps and quarry trip compress fictional skilled work; this is not construction guidance or simulated physics.",
    "No output flags represent explanations. The end is in the scene, not an ingredient.",
    "Separate third-job candidate. It does not replace v2 or its trial, and is not a promoted full game.",
    "The third job asks for different properties: tensile restraint or a hanging weight, not another perforation or sealing operation.",
    "V2 did not simulate a weight cost in transport. Do not claim the player experienced a burden-to-benefit weight reversal.",
    "Gravel remains an explicitly shared pile; a portion fills the basket. No finite-stock accounting or duplication of the basket.",
    "The gate is a specified-fit fictional fixture. Placement compresses deployment; no force, load, safety, or gate-motion physics are simulated.",
    "Original v2 recipe and stage records are preserved exactly. Candidate-only old item changes give the already-made rope its gate-tying capability and clarify the shared rope/gravel supplies."
  ],
  "checkpoints": [
    {
      "id": "chapter-1",
      "label": "A trip to the quarry",
      "actions": []
    },
    {
      "id": "chapter-2-basket",
      "label": "Gravel for the path · basket",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "willow",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "basket",
          "location": "quarry"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-2-crate",
      "label": "Gravel for the path · crate",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "boards",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "crate",
          "location": "quarry"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3-basket",
      "label": "Gate trial · basket",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "willow",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "basket",
          "location": "quarry"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "rough-gravel",
          "b": "basket"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3-crate",
      "label": "Gate trial · crate",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "boards",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "crate",
          "location": "quarry"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "crate",
          "b": "drill"
        },
        {
          "type": "combine",
          "a": "rough-gravel",
          "b": "pierced-crate"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3-crate-then-new-basket",
      "label": "Gate trial · crate-then-new-basket",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "boards",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "crate",
          "location": "quarry"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "willow",
          "b": "rope"
        },
        {
          "type": "combine",
          "a": "rough-gravel",
          "b": "basket"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3-both-keep-crate",
      "label": "Gate trial · both-keep-crate",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "boards",
          "b": "rope"
        },
        {
          "type": "combine",
          "a": "willow",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "crate",
          "location": "quarry"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "rough-gravel",
          "b": "basket"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3-both-pierce-crate",
      "label": "Gate trial · both-pierce-crate",
      "actions": [
        {
          "type": "combine",
          "a": "fiber",
          "b": "twister"
        },
        {
          "type": "combine",
          "a": "boards",
          "b": "rope"
        },
        {
          "type": "combine",
          "a": "willow",
          "b": "rope"
        },
        {
          "type": "place",
          "item": "basket",
          "location": "quarry"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "crate",
          "b": "drill"
        },
        {
          "type": "combine",
          "a": "rough-gravel",
          "b": "pierced-crate"
        },
        {
          "type": "advance"
        }
      ]
    }
  ]
};
