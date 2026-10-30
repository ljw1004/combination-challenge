import type {Scenario} from './runtime/schema/scenario.ts';
export const pilot:Scenario = {
  "schemaVersion": 1,
  "id": "causation-good-hole-probe-v1",
  "title": "The Workshop Bucket",
  "premise": "One bucket, two jobs. A short fictional workshop experiment.",
  "items": [
    {
      "id": "staves",
      "label": "Bucket staves",
      "description": "Shaped wooden staves and a fitted bottom, ready for assembly."
    },
    {
      "id": "hoops",
      "label": "Iron hoops",
      "description": "Hoops to hold the staves together."
    },
    {
      "id": "pitch",
      "label": "Pitch pot",
      "description": "A reusable supply for closing seams. Not for food vessels."
    },
    {
      "id": "rag",
      "label": "Rag",
      "description": "A small cloth for applying pitch."
    },
    {
      "id": "shell",
      "label": "Bucket · open seams",
      "description": "The staves are held by their hoops, but the seams let water through."
    },
    {
      "id": "seal-pad",
      "label": "Sealing pad",
      "description": "A reusable rag loaded with pitch."
    },
    {
      "id": "bucket",
      "label": "Bucket · watertight",
      "description": "The same stave bucket, with its seams sealed.",
      "capabilities": [
        "holds-water"
      ]
    },
    {
      "id": "gravel",
      "label": "Gritty gravel",
      "description": "Coarse gravel mixed with fine grit. The mason wants the coarse pieces."
    },
    {
      "id": "drill",
      "label": "Hand drill",
      "description": "For making small holes in wood. The worker provides the skill and effort."
    },
    {
      "id": "pierced-bucket",
      "label": "Bucket · drainage holes",
      "description": "The same bucket. Small holes now let water and fine grit through while holding coarse gravel.",
      "capabilities": [
        "through-flow-sieve"
      ]
    },
    {
      "id": "loaded-bucket",
      "label": "Bucket · gritty gravel",
      "description": "The same pierced bucket, now containing the gravel. Its drainage holes remain.",
      "capabilities": [
        "through-flow-sieve"
      ]
    },
    {
      "id": "washed-bucket",
      "label": "Bucket · washed gravel",
      "description": "The same pierced bucket holds the washed gravel. Its drainage holes remain.",
      "capabilities": [
        "through-flow-sieve",
        "washed-gravel"
      ]
    }
  ],
  "locations": [
    {
      "id": "leak",
      "label": "Roof leak",
      "description": "Runoff drips here. Catch it before it reaches the floor."
    },
    {
      "id": "spring",
      "label": "Spring",
      "description": "Running water for washing fine grit through a sieve. This is a compressed fictional workshop action."
    }
  ],
  "initialItems": [
    "staves",
    "hoops",
    "pitch",
    "rag"
  ],
  "recipes": [
    {
      "id": "assemble",
      "a": "staves",
      "b": "hoops",
      "out": "shell",
      "description": "The worker assembles the bucket.",
      "lifecycle": {
        "staves": {
          "role": "transform",
          "reason": "These staves become the bucket wall and bottom."
        },
        "hoops": {
          "role": "incorporate",
          "reason": "These hoops hold this bucket together."
        }
      }
    },
    {
      "id": "prepare-pad",
      "a": "pitch",
      "b": "rag",
      "out": "seal-pad",
      "description": "The rag is loaded with pitch.",
      "lifecycle": {
        "pitch": {
          "role": "retain",
          "reason": "The pot is a reusable workshop supply."
        },
        "rag": {
          "role": "transform",
          "reason": "The same rag becomes a reusable sealing pad."
        }
      }
    },
    {
      "id": "seal",
      "a": "shell",
      "b": "seal-pad",
      "out": "bucket",
      "description": "The worker closes the seams.",
      "lifecycle": {
        "shell": {
          "role": "transform",
          "reason": "The same bucket shell becomes watertight."
        },
        "seal-pad": {
          "role": "retain",
          "reason": "This applicator is reusable."
        }
      }
    },
    {
      "id": "pierce",
      "a": "bucket",
      "b": "drill",
      "out": "pierced-bucket",
      "description": "The worker adds small drainage holes to the base.",
      "lifecycle": {
        "bucket": {
          "role": "transform",
          "reason": "This same bucket gains holes; it no longer holds a bucketful of water."
        },
        "drill": {
          "role": "retain",
          "reason": "The drill remains a reusable tool."
        }
      }
    },
    {
      "id": "load-gravel",
      "a": "pierced-bucket",
      "b": "gravel",
      "out": "loaded-bucket",
      "description": "The gravel is tipped into the bucket.",
      "lifecycle": {
        "pierced-bucket": {
          "role": "transform",
          "reason": "The same pierced bucket becomes the loaded bucket."
        },
        "gravel": {
          "role": "incorporate",
          "reason": "The finite gravel batch is now inside the bucket."
        }
      }
    },
    {
      "id": "wash",
      "a": "loaded-bucket",
      "b": "@spring",
      "out": "washed-bucket",
      "description": "Water carries fine grit through the holes, leaving the coarse gravel.",
      "lifecycle": {
        "loaded-bucket": {
          "role": "transform",
          "reason": "The same pierced bucket now contains washed gravel. The holes remain."
        }
      }
    }
  ],
  "stages": [
    {
      "id": "catch",
      "title": "Keep the water in",
      "speaker": "The workshop keeper",
      "motivation": "Rain is dripping through the roof. Make something that will catch it.",
      "completionText": "The bucket catches the runoff.",
      "area": {
        "id": "workshop",
        "label": "Workshop",
        "travelText": "Rain drums on the workshop roof."
      },
      "locations": [
        "leak"
      ],
      "caches": [],
      "objectives": [
        {
          "id": "catch-water",
          "text": "Catch the roof leak.",
          "kind": "place",
          "capability": "holds-water",
          "location": "leak"
        }
      ]
    },
    {
      "id": "drain",
      "title": "Let the water through",
      "speaker": "The mason",
      "motivation": "The roof is mended. I need a washing sieve: fine grit and water must pass through, but the gravel must stay.",
      "completionText": "The water and fine grit pass through. The gravel stays in the bucket.",
      "area": {
        "id": "spring-yard",
        "label": "Spring yard",
        "travelText": "We empty and bring the bucket we made to the mason’s spring yard."
      },
      "locations": [
        "spring"
      ],
      "carry": [
        "bucket",
        "seal-pad"
      ],
      "caches": [
        {
          "id": "mason-tools",
          "label": "The mason’s work",
          "narrative": "The mason brings gritty gravel and a hand drill.",
          "items": [
            "gravel",
            "drill"
          ]
        }
      ],
      "objectives": [
        {
          "id": "make-sieve",
          "text": "Make a washing sieve.",
          "kind": "create",
          "item": "pierced-bucket",
          "intermediate": true
        },
        {
          "id": "wash-gravel",
          "text": "Wash out the grit.",
          "kind": "create",
          "item": "washed-bucket",
          "after": [
            "make-sieve"
          ]
        }
      ]
    }
  ],
  "sources": [
    {
      "id": "physics",
      "title": "Aristotle, Physics II.2–3, II.8–9",
      "url": "https://classics.mit.edu/Aristotle/physics.2.ii.html",
      "note": "Explanatory roles, user-directed form, and conditional necessity. The bucket is an invented artifact illustration."
    },
    {
      "id": "metaphysics",
      "title": "Aristotle, Metaphysics VII.7",
      "url": "https://classics.mit.edu/Aristotle/metaphysics.7.vii.html",
      "note": "Reasoning from an end to a practicable intervention; making proceeds from that intervention."
    },
    {
      "id": "sep",
      "title": "Andrea Falcon, Aristotle on Causality",
      "url": "https://plato.stanford.edu/entries/aristotle-causality/",
      "note": "Academic interpretation; not a claim that this game proves natural teleology."
    }
  ],
  "notes": [
    "Conceptual falsification probe, not a tested enjoyable replacement. Linear physical lineage; no meaningful design-choice claim.",
    "The end is conveyed by the scene, never an ingredient. Material and skilled physical action still produce the artifact.",
    "An intentionally drilled bucket is appropriate for this through-flow sieve job, but not for the earlier water-holding job.",
    "Placement and washing are compressed fictional actions, not physical simulation, workshop instructions, or evidence of cleanliness.",
    "A sealed bucket can wash gravel by other methods. This scene specifically requests a through-flow sieve; holes are not claimed necessary for all washing.",
    "Scene two requires the actual bucket created in scene one. The reusable sealing pad also travels, but is not counted as meaningful continuity by itself.",
    "Bucket, hoops and gravel remain in the described physical lineage; no slots or fitted constructions are silently collapsed."
  ],
  "checkpoints": [
    {
      "id": "chapter-1",
      "label": "Keep the water in",
      "actions": []
    },
    {
      "id": "chapter-2",
      "label": "Let the water through",
      "actions": [
        {
          "type": "combine",
          "a": "staves",
          "b": "hoops"
        },
        {
          "type": "combine",
          "a": "pitch",
          "b": "rag"
        },
        {
          "type": "combine",
          "a": "shell",
          "b": "seal-pad"
        },
        {
          "type": "place",
          "item": "bucket",
          "location": "leak"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "complete",
      "label": "Complete probe",
      "actions": [
        {
          "type": "combine",
          "a": "staves",
          "b": "hoops"
        },
        {
          "type": "combine",
          "a": "pitch",
          "b": "rag"
        },
        {
          "type": "combine",
          "a": "shell",
          "b": "seal-pad"
        },
        {
          "type": "place",
          "item": "bucket",
          "location": "leak"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "bucket",
          "b": "drill"
        },
        {
          "type": "combine",
          "a": "pierced-bucket",
          "b": "gravel"
        },
        {
          "type": "combine",
          "a": "loaded-bucket",
          "b": "@spring"
        },
        {
          "type": "advance"
        }
      ]
    }
  ]
};
