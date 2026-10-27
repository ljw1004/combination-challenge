import type {Scenario} from '../schema/scenario.ts';
export const scenarios: Scenario[] = [
  {
    "schemaVersion": 1,
    "id": "causation",
    "title": "Why This Boat?",
    "premise": "A fictional boatbuilder and philosopher distinguish what a thing is made from, its pattern, its maker and its purpose. Aristotle’s four explanations are not four kinds of physical push.",
    "items": [
      {
        "id": "adze",
        "label": "Adze"
      },
      {
        "id": "boat-plan",
        "label": "Boat plan"
      },
      {
        "id": "brush",
        "label": "Brush"
      },
      {
        "id": "builder-testimony",
        "label": "Builder testimony"
      },
      {
        "id": "caulking-brush",
        "label": "Caulking brush"
      },
      {
        "id": "cloth",
        "label": "Cloth"
      },
      {
        "id": "ferry-design",
        "label": "Ferry design"
      },
      {
        "id": "ferry-request",
        "label": "Ferry request"
      },
      {
        "id": "form-exhibit",
        "label": "Form exhibit",
        "description": "The hull’s organized structure: what makes these parts a boat of this kind. The drawn plan represents that form; it is not the entire explanation."
      },
      {
        "id": "hull-frame",
        "label": "Hull frame"
      },
      {
        "id": "maker-card",
        "label": "Maker card"
      },
      {
        "id": "maker-exhibit",
        "label": "Maker exhibit",
        "description": "The builder’s skilled making: the source of the boat’s coming-to-be."
      },
      {
        "id": "material-card",
        "label": "Material card"
      },
      {
        "id": "material-exhibit",
        "label": "Material exhibit",
        "description": "Timber: what this boat is made from."
      },
      {
        "id": "needle",
        "label": "Needle"
      },
      {
        "id": "pattern-card",
        "label": "Pattern card"
      },
      {
        "id": "pitch",
        "label": "Pitch"
      },
      {
        "id": "planks",
        "label": "Planks"
      },
      {
        "id": "purpose-card",
        "label": "Purpose card"
      },
      {
        "id": "purpose-exhibit",
        "label": "Purpose exhibit",
        "description": "Ferrying people across the water: the end for which this boat was made. A purpose explains its design; it does not physically push the timber."
      },
      {
        "id": "rigged-boat",
        "label": "Rigged boat"
      },
      {
        "id": "rigging",
        "label": "Rigging"
      },
      {
        "id": "rope",
        "label": "Rope"
      },
      {
        "id": "sail",
        "label": "Sail"
      },
      {
        "id": "sailing-boat",
        "label": "Sailing boat"
      },
      {
        "id": "saw",
        "label": "Saw"
      },
      {
        "id": "sealed-hull",
        "label": "Sealed hull"
      },
      {
        "id": "shaped-hull",
        "label": "Shaped hull"
      },
      {
        "id": "spar",
        "label": "Spar"
      },
      {
        "id": "timber",
        "label": "Timber"
      },
      {
        "id": "timber-sample",
        "label": "Timber sample"
      }
    ],
    "locations": [],
    "initialItems": [
      "timber",
      "saw",
      "boat-plan",
      "adze",
      "pitch",
      "brush"
    ],
    "recipes": [
      {
        "id": "planks",
        "a": "timber",
        "b": "saw",
        "out": "planks"
      },
      {
        "id": "hull-frame",
        "a": "planks",
        "b": "boat-plan",
        "out": "hull-frame"
      },
      {
        "id": "shaped-hull",
        "a": "hull-frame",
        "b": "adze",
        "out": "shaped-hull",
        "retire": [
          {
            "item": "hull-frame",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "caulking-brush",
        "a": "pitch",
        "b": "brush",
        "out": "caulking-brush"
      },
      {
        "id": "sealed-hull",
        "a": "shaped-hull",
        "b": "caulking-brush",
        "out": "sealed-hull",
        "retire": [
          {
            "item": "shaped-hull",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "sail",
        "a": "cloth",
        "b": "needle",
        "out": "sail"
      },
      {
        "id": "rigging",
        "a": "spar",
        "b": "rope",
        "out": "rigging"
      },
      {
        "id": "rigged-boat",
        "a": "sealed-hull",
        "b": "rigging",
        "out": "rigged-boat",
        "retire": [
          {
            "item": "sealed-hull",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "sailing-boat",
        "a": "rigged-boat",
        "b": "sail",
        "out": "sailing-boat",
        "retire": [
          {
            "item": "rigged-boat",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "material-exhibit",
        "a": "timber-sample",
        "b": "material-card",
        "out": "material-exhibit",
        "sources": [
          "physics"
        ]
      },
      {
        "id": "form-exhibit",
        "a": "boat-plan",
        "b": "pattern-card",
        "out": "form-exhibit",
        "sources": [
          "physics"
        ]
      },
      {
        "id": "maker-exhibit",
        "a": "builder-testimony",
        "b": "maker-card",
        "out": "maker-exhibit",
        "sources": [
          "physics"
        ]
      },
      {
        "id": "purpose-exhibit",
        "a": "ferry-request",
        "b": "purpose-card",
        "out": "purpose-exhibit",
        "sources": [
          "physics"
        ]
      },
      {
        "id": "ferry-design",
        "a": "purpose-exhibit",
        "b": "sailing-boat",
        "out": "ferry-design",
        "description": "A labelled design explains the boat in relation to its intended work; a request alone does not physically change the hull."
      }
    ],
    "stages": [
      {
        "id": "yard",
        "title": "At the boatyard",
        "speaker": "The boatbuilder",
        "motivation": "The island needs a boat. First make a sealed hull that will keep the water out.",
        "area": {
          "id": "yard-area",
          "label": "At the boatyard",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [],
        "objectives": [
          {
            "id": "sealed-hull-goal",
            "text": "Make sealed hull.",
            "kind": "create",
            "item": "sealed-hull"
          }
        ]
      },
      {
        "id": "rig",
        "title": "Wind and work",
        "speaker": "The ferryman",
        "motivation": "We can spare cloth, rope and a spar. Make a sailing boat for the crossing.",
        "area": {
          "id": "rig-area",
          "label": "Wind and work",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "rig-store",
            "label": "Rigging store",
            "narrative": "The store holds sails to be sewn and lines to be rigged.",
            "items": [
              "cloth",
              "needle",
              "spar",
              "rope"
            ]
          }
        ],
        "objectives": [
          {
            "id": "sailing-boat-goal",
            "text": "Make sailing boat.",
            "kind": "create",
            "item": "sailing-boat"
          }
        ]
      },
      {
        "id": "why",
        "title": "Four questions at the quay",
        "speaker": "The philosopher",
        "motivation": "Our visitors ask four different questions: what is it made of, what pattern does it follow, who made it, and what is it for? Prepare the four exhibits.",
        "area": {
          "id": "why-area",
          "label": "Four questions at the quay",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "display",
            "label": "Exhibition materials",
            "narrative": "The teacher brings labelled question cards, a timber offcut, the builder’s testimony and the ferryman’s request.",
            "items": [
              "timber-sample",
              "material-card",
              "pattern-card",
              "builder-testimony",
              "maker-card",
              "ferry-request",
              "purpose-card"
            ]
          }
        ],
        "objectives": [
          {
            "id": "material-exhibit-goal",
            "text": "Make the material exhibit.",
            "kind": "create",
            "item": "material-exhibit"
          },
          {
            "id": "form-exhibit-goal",
            "text": "Make the form exhibit.",
            "kind": "create",
            "item": "form-exhibit"
          },
          {
            "id": "maker-exhibit-goal",
            "text": "Make the maker exhibit.",
            "kind": "create",
            "item": "maker-exhibit"
          },
          {
            "id": "purpose-exhibit-goal",
            "text": "Make the purpose exhibit.",
            "kind": "create",
            "item": "purpose-exhibit"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "physics",
        "title": "Aristotle, Physics Book II",
        "url": "https://classics.mit.edu/Aristotle/physics.2.ii.html",
        "note": "Primary translation; four explanations with different explanatory roles."
      }
    ],
    "notes": [
      "Construction is compressed and not a boatbuilding manual. The fourth stage is intentionally absent: test whether distinguishing explanations is engaging, not whether a longer chain can be padded.",
      "Risk: exhibit objectives may feel like homework; no claim of validated fun.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "At the boatyard",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "Wind and work",
        "actions": [
          {
            "type": "combine",
            "a": "timber",
            "b": "saw"
          },
          {
            "type": "combine",
            "a": "planks",
            "b": "boat-plan"
          },
          {
            "type": "combine",
            "a": "hull-frame",
            "b": "adze"
          },
          {
            "type": "combine",
            "a": "pitch",
            "b": "brush"
          },
          {
            "type": "combine",
            "a": "shaped-hull",
            "b": "caulking-brush"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "Four questions at the quay",
        "actions": [
          {
            "type": "combine",
            "a": "timber",
            "b": "saw"
          },
          {
            "type": "combine",
            "a": "planks",
            "b": "boat-plan"
          },
          {
            "type": "combine",
            "a": "hull-frame",
            "b": "adze"
          },
          {
            "type": "combine",
            "a": "pitch",
            "b": "brush"
          },
          {
            "type": "combine",
            "a": "shaped-hull",
            "b": "caulking-brush"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "spar",
            "b": "rope"
          },
          {
            "type": "combine",
            "a": "sealed-hull",
            "b": "rigging"
          },
          {
            "type": "combine",
            "a": "cloth",
            "b": "needle"
          },
          {
            "type": "combine",
            "a": "rigged-boat",
            "b": "sail"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "chinese-thought",
    "title": "The School by the Well",
    "premise": "A fictional Warring States school explores two distinct accounts of moral cultivation. Mencius and Xunzi are not fused into one correct answer or treated as representatives of all Chinese thought.",
    "items": [
      {
        "id": "bamboo-slips",
        "label": "Bamboo slips"
      },
      {
        "id": "binding-cord",
        "label": "Binding cord"
      },
      {
        "id": "brush",
        "label": "Brush"
      },
      {
        "id": "comparison-sheet",
        "label": "Comparison sheet",
        "description": "Compare the source of concern, the work of practice, and what each account would say when conduct falls short."
      },
      {
        "id": "comparison-table",
        "label": "Comparison table",
        "description": "Mencian emphasis: nurture beginnings of concern. Xunzian emphasis: form conduct through learned practice. Neither says improvement happens without effort."
      },
      {
        "id": "compassion-notes",
        "label": "Compassion notes",
        "description": "Concern can appear before calculation. Does it need cultivation to become dependable care?"
      },
      {
        "id": "compassion-question",
        "label": "Compassion question",
        "description": "Why feel concern for a child you do not know, before calculating any advantage?"
      },
      {
        "id": "counterexample",
        "label": "Counterexample",
        "description": "Our fictional pupil feels alarm at the well but freezes. Another has no strong feeling yet follows a practised rescue procedure. What does either case tell us about moral cultivation?"
      },
      {
        "id": "cultivation-reading",
        "label": "Cultivation reading",
        "description": "A Xunzian reading: teachers, ritual and deliberate effort form better habits. Good conduct is cultivated, not secured by following every impulse."
      },
      {
        "id": "mencius-reading",
        "label": "Mencius reading",
        "description": "A Mencian reading: an incipient concern can be cultivated, like a sprout. A beginning is not finished virtue; practice still matters."
      },
      {
        "id": "mourning-account",
        "label": "Mourning account"
      },
      {
        "id": "mourning-commentary",
        "label": "Mourning commentary",
        "description": "In the Xunzi tradition, ritual gives grief a shaped expression. This does not claim every person or culture must grieve through the same forms."
      },
      {
        "id": "music-example",
        "label": "Music example",
        "description": "A shared musical practice asks each participant to listen and adjust to others."
      },
      {
        "id": "open-question",
        "label": "Open question",
        "description": "A feeling can fail to become action; trained conduct can occur without a strong feeling. Which account better explains what these pupils need next?"
      },
      {
        "id": "paired-readings",
        "label": "Paired readings",
        "description": "Both accounts require cultivation. They differ over how to understand its beginnings and the role of learned forms."
      },
      {
        "id": "practice-record",
        "label": "Practice record",
        "description": "A fictional pupil learns to wait, take turns and attend to others through repeated practice—not a claim that manners alone make a person good."
      },
      {
        "id": "question-card",
        "label": "Question card",
        "description": "Where might moral concern begin: a feeling already stirring in us, or conduct learned through practice?"
      },
      {
        "id": "ritual-notes",
        "label": "Ritual notes",
        "description": "Practice can reshape habits rather than merely express whatever impulse arrives first."
      },
      {
        "id": "ritual-text",
        "label": "Ritual text",
        "description": "A Xunzian question: how do taught forms and deliberate practice shape conduct?"
      },
      {
        "id": "school-manuscript",
        "label": "School manuscript",
        "description": "Two accounts of cultivation, one difficult case. A sudden feeling and a learned action can come apart. The school leaves that tension visible for its next discussion."
      },
      {
        "id": "seminar-record",
        "label": "Seminar record",
        "description": "The question remains open: what must be nurtured, what must be learned, and how would we tell? The comparison is preserved rather than blended into a third doctrine."
      },
      {
        "id": "teacher-response",
        "label": "Teacher response",
        "description": "Our fictional teacher: do not declare a winner from two imagined cases. Ask what would make concern and considerate action more dependable over time."
      },
      {
        "id": "well-account",
        "label": "Well account",
        "description": "Imagine suddenly seeing a child about to fall into a well. Mencius asks about the immediate alarm and concern, apart from seeking a reward. Concern is not a guarantee of rescue."
      }
    ],
    "locations": [],
    "initialItems": [
      "well-account",
      "question-card",
      "bamboo-slips",
      "brush"
    ],
    "recipes": [
      {
        "id": "compassion-question",
        "a": "well-account",
        "b": "question-card",
        "out": "compassion-question",
        "description": "A child near a well invites Mencius’s question about immediate concern, not a literal experiment on a child.",
        "sources": [
          "mencius"
        ]
      },
      {
        "id": "compassion-notes",
        "a": "compassion-question",
        "b": "bamboo-slips",
        "out": "compassion-notes"
      },
      {
        "id": "mencius-reading",
        "a": "compassion-notes",
        "b": "brush",
        "out": "mencius-reading"
      },
      {
        "id": "ritual-notes",
        "a": "ritual-text",
        "b": "practice-record",
        "out": "ritual-notes",
        "sources": [
          "xunzi"
        ]
      },
      {
        "id": "cultivation-reading",
        "a": "ritual-notes",
        "b": "music-example",
        "out": "cultivation-reading",
        "sources": [
          "xunzi"
        ]
      },
      {
        "id": "paired-readings",
        "a": "cultivation-reading",
        "b": "mencius-reading",
        "out": "paired-readings"
      },
      {
        "id": "comparison-table",
        "a": "paired-readings",
        "b": "comparison-sheet",
        "out": "comparison-table"
      },
      {
        "id": "open-question",
        "a": "comparison-table",
        "b": "counterexample",
        "out": "open-question"
      },
      {
        "id": "seminar-record",
        "a": "open-question",
        "b": "teacher-response",
        "out": "seminar-record"
      },
      {
        "id": "school-manuscript",
        "a": "seminar-record",
        "b": "binding-cord",
        "out": "school-manuscript"
      },
      {
        "id": "mourning-commentary",
        "a": "mourning-account",
        "b": "ritual-text",
        "out": "mourning-commentary",
        "description": "Xunzi’s ritual discussion gives expression to grief within a specific social account; this is not a claim that grief requires a ritual everywhere.",
        "sources": [
          "xunzi"
        ]
      }
    ],
    "stages": [
      {
        "id": "well",
        "title": "The question by the well",
        "speaker": "The teacher",
        "motivation": "Why might someone feel concern before thinking of a reward? Make a reading of the well story.",
        "area": {
          "id": "well-area",
          "label": "The question by the well",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [],
        "objectives": [
          {
            "id": "mencius-reading-goal",
            "text": "Make the Mencius reading.",
            "kind": "create",
            "item": "mencius-reading"
          }
        ]
      },
      {
        "id": "practice",
        "title": "In the practice hall",
        "speaker": "The second teacher",
        "motivation": "Another account asks what deliberate practice and ritual make possible. Prepare a cultivation reading beside the first.",
        "area": {
          "id": "practice-area",
          "label": "In the practice hall",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "school-texts",
            "label": "The school’s second shelf",
            "narrative": "The school holds a ritual text, practice records, a musical example and an account of mourning. These represent selected Xunzi themes.",
            "items": [
              "ritual-text",
              "practice-record",
              "music-example",
              "mourning-account"
            ]
          }
        ],
        "objectives": [
          {
            "id": "paired-readings-goal",
            "text": "Make paired readings.",
            "kind": "create",
            "item": "paired-readings"
          }
        ]
      },
      {
        "id": "seminar",
        "title": "An unfinished argument",
        "speaker": "The students",
        "motivation": "One pupil feels alarm but freezes; another follows a practised rescue procedure without strong feeling. Preserve the difficult question in a school manuscript. We need not settle it today.",
        "area": {
          "id": "seminar-area",
          "label": "An unfinished argument",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "seminar-kit",
            "label": "Seminar materials",
            "narrative": "The teacher brings a comparison sheet, a counterexample and a response; binding cord holds the final record.",
            "items": [
              "comparison-sheet",
              "counterexample",
              "teacher-response",
              "binding-cord"
            ]
          }
        ],
        "objectives": [
          {
            "id": "school-manuscript-goal",
            "text": "Make school manuscript.",
            "kind": "create",
            "item": "school-manuscript"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "mencius",
        "title": "Mencius, Gong Sun Chou I",
        "url": "https://ctext.org/mengzi/gong-sun-chou-i/zh",
        "note": "Primary text; child-near-well example."
      },
      {
        "id": "xunzi",
        "title": "Xunzi, Treatise on Ritual",
        "url": "https://ctext.org/xunzi/li-lun/ens",
        "note": "Primary text in translation; selected ritual themes."
      },
      {
        "id": "xunzi-context",
        "title": "Stanford Encyclopedia of Philosophy: Xunzi",
        "url": "https://plato.stanford.edu/entries/xunzi/",
        "note": ""
      },
      {
        "id": "mencius-context",
        "title": "Stanford Encyclopedia of Philosophy: Mencius",
        "url": "https://plato.stanford.edu/entries/mencius/",
        "note": "Independent authenticity reviewer checked the 2A6 context; direct reader fetch failed during v2 editing. No historical rescue incident is asserted."
      }
    ],
    "notes": [
      "The characters and encounter are fiction; Mencius and Xunzi were not conducting this seminar together.",
      "Risk: document assembly can become a named checklist. This candidate needs a domain reader and human playtest before expansion.",
      "The freezing pupil and trained responder are original hypothetical examples, not examples attributed to Mencius or Xunzi. This comparison is intentionally selective, not a comprehensive account of either thinker.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "The question by the well",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "In the practice hall",
        "actions": [
          {
            "type": "combine",
            "a": "well-account",
            "b": "question-card"
          },
          {
            "type": "combine",
            "a": "compassion-question",
            "b": "bamboo-slips"
          },
          {
            "type": "combine",
            "a": "compassion-notes",
            "b": "brush"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "An unfinished argument",
        "actions": [
          {
            "type": "combine",
            "a": "well-account",
            "b": "question-card"
          },
          {
            "type": "combine",
            "a": "compassion-question",
            "b": "bamboo-slips"
          },
          {
            "type": "combine",
            "a": "compassion-notes",
            "b": "brush"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "ritual-text",
            "b": "practice-record"
          },
          {
            "type": "combine",
            "a": "ritual-notes",
            "b": "music-example"
          },
          {
            "type": "combine",
            "a": "cultivation-reading",
            "b": "mencius-reading"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "food",
    "title": "From Hearth to Snack Cake",
    "premise": "A playful journey through kitchens: make recognizable food, discover what living cultures and skilled processing change. Time is compressed; these are not complete cooking instructions.",
    "items": [
      {
        "id": "annotated-menu",
        "label": "Annotated menu"
      },
      {
        "id": "bread",
        "label": "Bread"
      },
      {
        "id": "butter",
        "label": "Butter"
      },
      {
        "id": "churn",
        "label": "Churn"
      },
      {
        "id": "cream",
        "label": "Cream"
      },
      {
        "id": "creme-filling",
        "label": "Creme filling"
      },
      {
        "id": "dough",
        "label": "Dough"
      },
      {
        "id": "egg-foam",
        "label": "Egg foam"
      },
      {
        "id": "eggs",
        "label": "Eggs"
      },
      {
        "id": "filled-sponge",
        "label": "Filled sponge"
      },
      {
        "id": "flatbread",
        "label": "Flatbread"
      },
      {
        "id": "flour",
        "label": "Flour"
      },
      {
        "id": "fruit",
        "label": "Fruit"
      },
      {
        "id": "fruit-tart",
        "label": "Fruit tart"
      },
      {
        "id": "grain",
        "label": "Grain"
      },
      {
        "id": "humoral-book",
        "label": "Humoral book"
      },
      {
        "id": "humoral-menu",
        "label": "Humoral menu"
      },
      {
        "id": "juice",
        "label": "Juice"
      },
      {
        "id": "lactic-culture",
        "label": "Yogurt starter"
      },
      {
        "id": "laminated-dough",
        "label": "Laminated dough"
      },
      {
        "id": "leavened-dough",
        "label": "Leavened dough"
      },
      {
        "id": "menu-card",
        "label": "Menu card"
      },
      {
        "id": "milk",
        "label": "Milk"
      },
      {
        "id": "millstone",
        "label": "Millstone"
      },
      {
        "id": "modern-nutrition-note",
        "label": "Modern nutrition note"
      },
      {
        "id": "press",
        "label": "Press"
      },
      {
        "id": "puff-pastry",
        "label": "Puff pastry"
      },
      {
        "id": "shortcrust",
        "label": "Shortcrust"
      },
      {
        "id": "shortening",
        "label": "Shortening"
      },
      {
        "id": "sponge-batter",
        "label": "Sponge batter"
      },
      {
        "id": "sponge-cake",
        "label": "Sponge cake"
      },
      {
        "id": "sugar",
        "label": "Sugar"
      },
      {
        "id": "sweet-egg-foam",
        "label": "Sweet egg foam"
      },
      {
        "id": "twinkie",
        "label": "Twinkie-style snack cake"
      },
      {
        "id": "unbaked-fruit-tart",
        "label": "Unbaked fruit tart"
      },
      {
        "id": "vanilla",
        "label": "Vanilla"
      },
      {
        "id": "vanilla-filling",
        "label": "Vanilla filling"
      },
      {
        "id": "water",
        "label": "Water"
      },
      {
        "id": "whisk",
        "label": "Whisk"
      },
      {
        "id": "wrapper",
        "label": "Wrapper"
      },
      {
        "id": "yeast-culture",
        "label": "Yeast culture"
      },
      {
        "id": "yogurt",
        "label": "Yogurt"
      },
      {
        "id": "fruit-yogurt",
        "label": "Fruit yogurt",
        "description": "Fruit stirred into yogurt. A familiar snack, not a required step toward pastry."
      },
      {
        "id": "bread-and-butter",
        "label": "Bread and butter",
        "description": "A slice of risen bread spread with butter. Simple food is a worthwhile result too."
      }
    ],
    "locations": [
      {
        "id": "bakehouse-oven",
        "label": "Bakehouse oven"
      },
      {
        "id": "pilot-oven",
        "label": "Pilot oven"
      },
      {
        "id": "hearth",
        "label": "Hearth"
      },
      {
        "id": "fermentation-room",
        "label": "Fermentation room"
      },
      {
        "id": "pastry-bench",
        "label": "Cool pastry bench"
      },
      {
        "id": "oven",
        "label": "Pastry oven"
      },
      {
        "id": "filling-line",
        "label": "Filling line"
      }
    ],
    "initialItems": [
      "grain",
      "millstone",
      "water",
      "fruit",
      "press"
    ],
    "recipes": [
      {
        "id": "flour",
        "a": "grain",
        "b": "millstone",
        "out": "flour"
      },
      {
        "id": "dough",
        "a": "flour",
        "b": "water",
        "out": "dough"
      },
      {
        "id": "flatbread",
        "a": "dough",
        "b": "@hearth",
        "out": "flatbread"
      },
      {
        "id": "juice",
        "a": "fruit",
        "b": "press",
        "out": "juice"
      },
      {
        "id": "leavened-dough",
        "a": "dough",
        "b": "yeast-culture",
        "out": "leavened-dough",
        "at": "fermentation-room",
        "description": "Yeast changes the dough over time; the game compresses fermentation.",
        "sources": [
          "fermentation"
        ]
      },
      {
        "id": "bread",
        "a": "leavened-dough",
        "b": "@bakehouse-oven",
        "out": "bread"
      },
      {
        "id": "yogurt",
        "a": "milk",
        "b": "lactic-culture",
        "out": "yogurt",
        "at": "fermentation-room",
        "description": "A suitable bacterial culture transforms milk; it is not the same culture as bread yeast.",
        "sources": [
          "fermentation"
        ]
      },
      {
        "id": "butter",
        "a": "cream",
        "b": "churn",
        "out": "butter"
      },
      {
        "id": "shortcrust",
        "a": "flour",
        "b": "butter",
        "out": "shortcrust",
        "at": "pastry-bench",
        "description": "Rubbing fat into flour makes a short pastry; water and handling are compressed here.",
        "sources": [
          "pastry"
        ]
      },
      {
        "id": "unbaked-fruit-tart",
        "a": "shortcrust",
        "b": "fruit",
        "out": "unbaked-fruit-tart"
      },
      {
        "id": "fruit-tart",
        "a": "unbaked-fruit-tart",
        "b": "@oven",
        "out": "fruit-tart"
      },
      {
        "id": "laminated-dough",
        "a": "dough",
        "b": "butter",
        "out": "laminated-dough",
        "at": "pastry-bench",
        "description": "Cold butter is folded through dough in separate layers; this is not simply stirred together.",
        "sources": [
          "pastry"
        ]
      },
      {
        "id": "puff-pastry",
        "a": "laminated-dough",
        "b": "@oven",
        "out": "puff-pastry"
      },
      {
        "id": "egg-foam",
        "a": "eggs",
        "b": "whisk",
        "out": "egg-foam"
      },
      {
        "id": "sweet-egg-foam",
        "a": "egg-foam",
        "b": "sugar",
        "out": "sweet-egg-foam"
      },
      {
        "id": "sponge-batter",
        "a": "sweet-egg-foam",
        "b": "flour",
        "out": "sponge-batter"
      },
      {
        "id": "sponge-cake",
        "a": "sponge-batter",
        "b": "@pilot-oven",
        "out": "sponge-cake"
      },
      {
        "id": "creme-filling",
        "a": "shortening",
        "b": "sugar",
        "out": "creme-filling"
      },
      {
        "id": "vanilla-filling",
        "a": "creme-filling",
        "b": "vanilla",
        "out": "vanilla-filling"
      },
      {
        "id": "filled-sponge",
        "a": "sponge-cake",
        "b": "vanilla-filling",
        "out": "filled-sponge",
        "at": "filling-line",
        "description": "A filling is injected into a sponge cake. This is a broad snack-cake model, not a commercial formula."
      },
      {
        "id": "twinkie",
        "a": "filled-sponge",
        "b": "wrapper",
        "out": "twinkie",
        "at": "filling-line",
        "description": "A Twinkie-inspired endpoint: a wrapped golden sponge cake with a creamy filling. The brand formula and its industrial process are not reproduced."
      },
      {
        "id": "humoral-menu",
        "a": "menu-card",
        "b": "humoral-book",
        "out": "humoral-menu",
        "description": "A period menu organized through hot/cold and wet/dry qualities. This records a historical belief, not a medically effective diet.",
        "sources": [
          "humors"
        ]
      },
      {
        "id": "annotated-menu",
        "a": "humoral-menu",
        "b": "modern-nutrition-note",
        "out": "annotated-menu",
        "description": "A museum annotation distinguishes a historical explanatory system from present-day nutrition; neither is a literal ingredient."
      },
      {
        "id": "fruit-yogurt",
        "a": "fruit",
        "b": "yogurt",
        "out": "fruit-yogurt",
        "description": "Stir fruit into the yogurt. Neither ingredient is retired: both still have other uses."
      },
      {
        "id": "bread-and-butter",
        "a": "bread",
        "b": "butter",
        "out": "bread-and-butter",
        "description": "Spread butter on the bread. This optional discovery is not a quota or a gate."
      }
    ],
    "stages": [
      {
        "id": "hearth",
        "title": "The roadside hearth",
        "speaker": "The traveller",
        "motivation": "We have grain and fruit. Make flatbread and press a drink before the caravan leaves.",
        "area": {
          "id": "hearth-area",
          "label": "The roadside hearth",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [
          "hearth"
        ],
        "caches": [],
        "objectives": [
          {
            "id": "flatbread-goal",
            "text": "Make flatbread.",
            "kind": "create",
            "item": "flatbread"
          },
          {
            "id": "juice-goal",
            "text": "Make fruit juice.",
            "kind": "create",
            "item": "juice"
          }
        ]
      },
      {
        "id": "cultures",
        "title": "The dairy and bakehouse",
        "speaker": "The baker",
        "motivation": "Our neighbours keep living cultures. Give us a risen loaf and a bowl of yogurt.",
        "area": {
          "id": "cultures-area",
          "label": "The dairy and bakehouse",
          "travelText": "We take our dough and fruit to the dairy and bakehouse. The pressed juice and flatbread remain at the roadside hearth."
        },
        "locations": [
          "fermentation-room",
          "bakehouse-oven"
        ],
        "caches": [
          {
            "id": "dairy-stores",
            "label": "Dairy shelves",
            "narrative": "The dairy keeps milk, cream, a churn and separate cultures for its bread and milk.",
            "items": [
              "milk",
              "cream",
              "churn",
              "yeast-culture",
              "lactic-culture"
            ]
          }
        ],
        "objectives": [
          {
            "id": "bread-goal",
            "text": "Bake a risen loaf.",
            "kind": "create",
            "item": "bread"
          },
          {
            "id": "yogurt-goal",
            "text": "Make yogurt.",
            "kind": "create",
            "item": "yogurt"
          }
        ],
        "carry": [
          "dough",
          "fruit",
          "bread",
          "yogurt",
          "fruit-yogurt",
          "milk",
          "lactic-culture",
          "yeast-culture"
        ]
      },
      {
        "id": "pastry",
        "title": "The pastry workshop",
        "speaker": "The pastry cook",
        "motivation": "Butter can crumble through flour or lie in thin sheets. Bring me a fruit tart and a puff pastry.",
        "area": {
          "id": "pastry-area",
          "label": "The pastry workshop",
          "travelText": "We bring the pastry ingredients and a loaf to the workshop. Cream and the churn come from the dairy; yogurt stays there unless we return for it."
        },
        "locations": [
          "pastry-bench",
          "oven"
        ],
        "caches": [
          {
            "id": "pastry-cupboard",
            "label": "Pastry cupboard",
            "narrative": "A working pastry kitchen holds eggs, sugar, whisks and old menu records as well as its ovens.",
            "items": [
              "eggs",
              "sugar",
              "whisk",
              "menu-card",
              "humoral-book",
              "modern-nutrition-note"
            ]
          }
        ],
        "objectives": [
          {
            "id": "fruit-tart-goal",
            "text": "Bake a fruit tart.",
            "kind": "create",
            "item": "fruit-tart"
          },
          {
            "id": "puff-pastry-goal",
            "text": "Bake puff pastry.",
            "kind": "create",
            "item": "puff-pastry"
          }
        ],
        "carry": [
          "flour",
          "dough",
          "fruit",
          "cream",
          "churn",
          "butter",
          "shortcrust",
          "unbaked-fruit-tart",
          "laminated-dough",
          "fruit-tart",
          "puff-pastry",
          "bread",
          "bread-and-butter"
        ]
      },
      {
        "id": "snack",
        "title": "The small cake line",
        "speaker": "The food historian",
        "motivation": "Now a bakery wants its little sponge cake to travel. Make the filled, wrapped snack cake. Our last stop is a Twinkie-style cake, not a verdict that later food is better.",
        "area": {
          "id": "snack-area",
          "label": "The small cake line",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [
          "filling-line",
          "pilot-oven"
        ],
        "caches": [
          {
            "id": "cake-line",
            "label": "Cake-line stores",
            "narrative": "The pilot line keeps filling ingredients and wrappers; the sponge-making tools came with us.",
            "items": [
              "shortening",
              "vanilla",
              "wrapper"
            ]
          }
        ],
        "objectives": [
          {
            "id": "twinkie-goal",
            "text": "Make the wrapped Twinkie-style snack cake.",
            "kind": "create",
            "item": "twinkie"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "fermentation",
        "title": "OpenStax: What Our Ancestors Knew",
        "url": "https://openstax.org/books/microbiology/pages/1-1-what-our-ancestors-knew",
        "note": ""
      },
      {
        "id": "pastry",
        "title": "King Arthur bakery: puff pastry lamination",
        "url": "https://www.kingarthurbaking.com/blog/2013/08/02/puff-pastry-layer-it-like-the-pros",
        "note": ""
      },
      {
        "id": "humors",
        "title": "NLM: The Four Humors",
        "url": "https://www.nlm.nih.gov/exhibition/shakespeare-and-the-four-humors/index.html",
        "note": "Historical interpretation only; not health advice."
      }
    ],
    "notes": [
      "Prototype target: test whether tangible food transformations remain engaging across a shift to industrial production.",
      "The branded final output is a fictional approximation. Hostess official page was unavailable to web reader; exact formula not asserted.",
      "Humoral menu is an optional historical side discovery, never a nutrition recommendation. No medical efficacy mechanic.",
      "Not a universal food chronology: fermentation and pastry have multiple regional histories. A Paris-style workshop does not claim France invented layered pastry.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 adds two optional familiar discoveries requested by a fresh player: fruit yogurt and bread with butter. Explicit scene carry brings their ingredients without carrying every future-use thing. No new objective quota."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "The roadside hearth",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "The dairy and bakehouse",
        "actions": [
          {
            "type": "combine",
            "a": "grain",
            "b": "millstone"
          },
          {
            "type": "combine",
            "a": "flour",
            "b": "water"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "@hearth"
          },
          {
            "type": "combine",
            "a": "fruit",
            "b": "press"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "The pastry workshop",
        "actions": [
          {
            "type": "combine",
            "a": "grain",
            "b": "millstone"
          },
          {
            "type": "combine",
            "a": "flour",
            "b": "water"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "@hearth"
          },
          {
            "type": "combine",
            "a": "fruit",
            "b": "press"
          },
          {
            "type": "advance"
          },
          {
            "type": "place",
            "item": "yeast-culture",
            "location": "fermentation-room"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "yeast-culture"
          },
          {
            "type": "combine",
            "a": "leavened-dough",
            "b": "@bakehouse-oven"
          },
          {
            "type": "place",
            "item": "lactic-culture",
            "location": "fermentation-room"
          },
          {
            "type": "combine",
            "a": "milk",
            "b": "lactic-culture"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-4",
        "label": "The small cake line",
        "actions": [
          {
            "type": "combine",
            "a": "grain",
            "b": "millstone"
          },
          {
            "type": "combine",
            "a": "flour",
            "b": "water"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "@hearth"
          },
          {
            "type": "combine",
            "a": "fruit",
            "b": "press"
          },
          {
            "type": "advance"
          },
          {
            "type": "place",
            "item": "yeast-culture",
            "location": "fermentation-room"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "yeast-culture"
          },
          {
            "type": "combine",
            "a": "leavened-dough",
            "b": "@bakehouse-oven"
          },
          {
            "type": "place",
            "item": "lactic-culture",
            "location": "fermentation-room"
          },
          {
            "type": "combine",
            "a": "milk",
            "b": "lactic-culture"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "cream",
            "b": "churn"
          },
          {
            "type": "place",
            "item": "butter",
            "location": "pastry-bench"
          },
          {
            "type": "combine",
            "a": "flour",
            "b": "butter"
          },
          {
            "type": "combine",
            "a": "shortcrust",
            "b": "fruit"
          },
          {
            "type": "combine",
            "a": "unbaked-fruit-tart",
            "b": "@oven"
          },
          {
            "type": "place",
            "item": "butter",
            "location": "pastry-bench"
          },
          {
            "type": "combine",
            "a": "dough",
            "b": "butter"
          },
          {
            "type": "combine",
            "a": "laminated-dough",
            "b": "@oven"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "literature",
    "title": "The Last Train",
    "premise": "A fictional writer observes a station, shapes a poem, then makes a small book. Combinations produce drafts and forms, not a claim that literary value has a recipe.",
    "items": [
      {
        "id": "booklet",
        "label": "Booklet"
      },
      {
        "id": "chapbook",
        "label": "Chapbook",
        "description": "Your station poem, stitched into a small book.\n\nThe rails hum after you\nhave gone. Stay a while.\nThe platform holds your name.\nStay a while."
      },
      {
        "id": "departure-board",
        "label": "Departure board",
        "description": "The last destination blinks away. One unlit row remains."
      },
      {
        "id": "departure-sketch",
        "label": "Departure sketch",
        "description": "An empty platform, with one name written below it."
      },
      {
        "id": "enjambed-poem",
        "label": "Enjambed poem",
        "description": "The rails hum after you\nhave gone. The empty platform\nkeeps your name."
      },
      {
        "id": "first-draft",
        "label": "First draft",
        "description": "The train is gone. I listen to the station. I remember a goodbye."
      },
      {
        "id": "fold",
        "label": "Fold"
      },
      {
        "id": "ink",
        "label": "Ink"
      },
      {
        "id": "inked-form",
        "label": "Inked form",
        "description": "Ink touches the raised letters, ready to leave their mirror image on paper."
      },
      {
        "id": "line-break",
        "label": "Line break",
        "description": "Try ending the first line after “you”, before the sentence is finished."
      },
      {
        "id": "memory",
        "label": "Memory",
        "description": "Someone has gone. You find yourself asking them to stay."
      },
      {
        "id": "notebook",
        "label": "Notebook"
      },
      {
        "id": "paper",
        "label": "Paper"
      },
      {
        "id": "pencil",
        "label": "Pencil"
      },
      {
        "id": "printed-booklet",
        "label": "Printed booklet",
        "description": "The printer presses the poem onto sheets, then folds them into this little book.\n\nThe rails hum after you\nhave gone. Stay a while.\nThe platform holds your name.\nStay a while."
      },
      {
        "id": "printing-type",
        "label": "Printing type"
      },
      {
        "id": "reading-aloud",
        "label": "Reading aloud",
        "description": "Reading aloud, the editor catches the long third line. Try “The platform holds your name.”"
      },
      {
        "id": "refrain",
        "label": "Refrain",
        "description": "Let “Stay a while” return twice: once addressed to the traveller, once to the memory."
      },
      {
        "id": "refrain-poem",
        "label": "Refrain poem",
        "description": "The rails hum after you\nhave gone. Stay a while.\nThe empty platform keeps your name.\nStay a while."
      },
      {
        "id": "revised-poem",
        "label": "Revised poem",
        "description": "The rails hum after you\nhave gone. Stay a while.\nThe platform holds your name.\nStay a while."
      },
      {
        "id": "sound-notes",
        "label": "Sound notes",
        "description": "An observation: the rails keep humming after the train has gone."
      },
      {
        "id": "station-poem",
        "label": "Station poem",
        "description": "The rails hum after you have gone.\nThe empty platform keeps your name."
      },
      {
        "id": "station-sounds",
        "label": "Station sounds",
        "description": "Wheels click over a joint; after the train leaves, a low note lingers in the rails."
      },
      {
        "id": "thread",
        "label": "Thread"
      },
      {
        "id": "type-form",
        "label": "Type form",
        "description": "The revised poem is set in movable type, ready for ink."
      }
    ],
    "locations": [],
    "initialItems": [
      "notebook",
      "station-sounds",
      "departure-board",
      "pencil",
      "memory"
    ],
    "recipes": [
      {
        "id": "sound-notes",
        "a": "notebook",
        "b": "station-sounds",
        "out": "sound-notes"
      },
      {
        "id": "departure-sketch",
        "a": "departure-board",
        "b": "pencil",
        "out": "departure-sketch"
      },
      {
        "id": "first-draft",
        "a": "sound-notes",
        "b": "memory",
        "out": "first-draft"
      },
      {
        "id": "station-poem",
        "a": "first-draft",
        "b": "departure-sketch",
        "out": "station-poem",
        "retire": [
          {
            "item": "first-draft",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "enjambed-poem",
        "a": "station-poem",
        "b": "line-break",
        "out": "enjambed-poem",
        "description": "The sentence now continues beyond “you” and “platform” across line endings. The change delays what follows; it need not be better.",
        "sources": [
          "enjambment"
        ]
      },
      {
        "id": "refrain-poem",
        "a": "enjambed-poem",
        "b": "refrain",
        "out": "refrain-poem",
        "description": "“Stay a while” returns, turning a request into a refrain."
      },
      {
        "id": "revised-poem",
        "a": "refrain-poem",
        "b": "reading-aloud",
        "out": "revised-poem",
        "description": "The spoken test shortens the third line. This is one editorial choice, not the correct poem."
      },
      {
        "id": "booklet",
        "a": "paper",
        "b": "fold",
        "out": "booklet"
      },
      {
        "id": "type-form",
        "a": "revised-poem",
        "b": "printing-type",
        "out": "type-form"
      },
      {
        "id": "inked-form",
        "a": "type-form",
        "b": "ink",
        "out": "inked-form"
      },
      {
        "id": "printed-booklet",
        "a": "inked-form",
        "b": "booklet",
        "out": "printed-booklet",
        "description": "The printer inks and presses the type onto sheets before folding the printed sheets. These workshop steps are compressed into this action."
      },
      {
        "id": "chapbook",
        "a": "printed-booklet",
        "b": "thread",
        "out": "chapbook",
        "retire": [
          {
            "item": "printed-booklet",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      }
    ],
    "stages": [
      {
        "id": "platform",
        "title": "The last train",
        "speaker": "The writer",
        "motivation": "Everyone is leaving, and the station has its own music. Make a station poem from what you notice.",
        "area": {
          "id": "platform-area",
          "label": "The last train",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [],
        "objectives": [
          {
            "id": "station-poem-goal",
            "text": "Make station poem.",
            "kind": "create",
            "item": "station-poem"
          }
        ]
      },
      {
        "id": "reading",
        "title": "At the reading table",
        "speaker": "The editor",
        "motivation": "Try holding the sentence over a line ending, then let “Stay a while” return. Read each version; make the revised poem for our little press.",
        "area": {
          "id": "reading-area",
          "label": "At the reading table",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "editor-notes",
            "label": "The editor’s marked examples",
            "narrative": "Examples demonstrate a line break, a returning refrain and reading aloud. They are techniques, not mandatory steps in all poems.",
            "items": [
              "line-break",
              "refrain",
              "reading-aloud"
            ]
          }
        ],
        "objectives": [
          {
            "id": "revised-poem-goal",
            "text": "Make revised poem.",
            "kind": "create",
            "item": "revised-poem"
          }
        ]
      },
      {
        "id": "press",
        "title": "The little press",
        "speaker": "The printer",
        "motivation": "Let the poem leave this room. Make a stitched chapbook.",
        "area": {
          "id": "press-area",
          "label": "The little press",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "press-store",
            "label": "The printer’s supplies",
            "narrative": "The small press has paper, folding instructions, type, ink and binding thread.",
            "items": [
              "paper",
              "fold",
              "printing-type",
              "ink",
              "thread"
            ]
          }
        ],
        "objectives": [
          {
            "id": "chapbook-goal",
            "text": "Make chapbook.",
            "kind": "create",
            "item": "chapbook"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "enjambment",
        "title": "Poetry Foundation: Enjambment",
        "url": "https://www.poetryfoundation.org/education/glossary/enjambment",
        "note": ""
      },
      {
        "id": "enjambment-poets",
        "title": "Academy of American Poets: Enjambment",
        "url": "https://poets.org/glossary/enjambment",
        "note": "Definition checked. All verse in this scenario is original, not drawn from the examples on this page."
      }
    ],
    "notes": [
      "All poem and narrative content is original fiction. No canonical poem is reproduced.",
      "Strong risk: technique tokens are less tangible than food. Human playtest should compare this directly rather than declaring literature successful from reachability.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "The last train",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "At the reading table",
        "actions": [
          {
            "type": "combine",
            "a": "notebook",
            "b": "station-sounds"
          },
          {
            "type": "combine",
            "a": "sound-notes",
            "b": "memory"
          },
          {
            "type": "combine",
            "a": "departure-board",
            "b": "pencil"
          },
          {
            "type": "combine",
            "a": "first-draft",
            "b": "departure-sketch"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "The little press",
        "actions": [
          {
            "type": "combine",
            "a": "notebook",
            "b": "station-sounds"
          },
          {
            "type": "combine",
            "a": "sound-notes",
            "b": "memory"
          },
          {
            "type": "combine",
            "a": "departure-board",
            "b": "pencil"
          },
          {
            "type": "combine",
            "a": "first-draft",
            "b": "departure-sketch"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "station-poem",
            "b": "line-break"
          },
          {
            "type": "combine",
            "a": "enjambed-poem",
            "b": "refrain"
          },
          {
            "type": "combine",
            "a": "refrain-poem",
            "b": "reading-aloud"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "restoration",
    "title": "After the Flood",
    "premise": "An original museum story: a conservator has already dried and stabilized a flood-damaged map. Document it, protect it, and tell its story without erasing the damage. Not instructions for treating a real collection.",
    "items": [
      {
        "id": "acid-free-board",
        "label": "Acid free board"
      },
      {
        "id": "archive-letter",
        "label": "Archive letter",
        "description": "A fictional letter says its writer carried a map on this journey. It is a clue, not conclusive proof that this is that map."
      },
      {
        "id": "camera",
        "label": "Camera"
      },
      {
        "id": "condition-form",
        "label": "Condition form"
      },
      {
        "id": "condition-notes",
        "label": "Condition notes"
      },
      {
        "id": "condition-record",
        "label": "Condition record"
      },
      {
        "id": "damaged-map",
        "label": "Damaged map",
        "description": "The same dry, stabilized map will stay with us through housing and display. Its old water marks remain part of its history."
      },
      {
        "id": "documented-map",
        "label": "Documented map",
        "description": "The map with its condition record. Recording the damage has not repaired or replaced it."
      },
      {
        "id": "exhibition-label",
        "label": "Exhibition label",
        "description": "This flood-marked map may have travelled with the letter’s writer. The association remains uncertain."
      },
      {
        "id": "folder",
        "label": "Folder"
      },
      {
        "id": "housed-map",
        "label": "Housed map",
        "description": "The supported map has a protective enclosure. It was dry and stabilized before housing."
      },
      {
        "id": "knife",
        "label": "Knife"
      },
      {
        "id": "label-card",
        "label": "Label card"
      },
      {
        "id": "low-light-case",
        "label": "Low light case"
      },
      {
        "id": "map-exhibit",
        "label": "Map exhibit",
        "description": "A map, its scars and an honestly qualified story. The label preserves uncertainty as well as provenance."
      },
      {
        "id": "map-measurements",
        "label": "Map measurements",
        "description": "Dimensions recorded beside the supported map, without pressing a ruler onto its fragile surface."
      },
      {
        "id": "pencil",
        "label": "Pencil"
      },
      {
        "id": "protected-display",
        "label": "Protected display",
        "description": "The same supported map is displayed under controlled low light; preservation does not make its past disappear."
      },
      {
        "id": "protective-folder",
        "label": "Protective folder"
      },
      {
        "id": "provenance-note",
        "label": "Provenance note",
        "description": "The letter may connect this map with a journey. The note records that attribution and its uncertainty, not a proven chain of ownership."
      },
      {
        "id": "record-photograph",
        "label": "Record photograph"
      },
      {
        "id": "record-template",
        "label": "Record template"
      },
      {
        "id": "ruler",
        "label": "Ruler"
      },
      {
        "id": "support-board",
        "label": "Support board"
      },
      {
        "id": "supported-map",
        "label": "Supported map",
        "description": "The same map rests on a suitable rigid support, reducing the need to handle the sheet itself."
      },
      {
        "id": "tissue",
        "label": "Tissue"
      }
    ],
    "locations": [],
    "initialItems": [
      "camera",
      "damaged-map",
      "pencil",
      "condition-form",
      "ruler"
    ],
    "recipes": [
      {
        "id": "record-photograph",
        "a": "camera",
        "b": "damaged-map",
        "out": "record-photograph"
      },
      {
        "id": "map-measurements",
        "a": "damaged-map",
        "b": "ruler",
        "out": "map-measurements",
        "description": "The conservator records dimensions beside the supported sheet without pressing the ruler onto its surface."
      },
      {
        "id": "record-template",
        "a": "condition-form",
        "b": "pencil",
        "out": "record-template"
      },
      {
        "id": "condition-notes",
        "a": "record-template",
        "b": "map-measurements",
        "out": "condition-notes"
      },
      {
        "id": "condition-record",
        "a": "condition-notes",
        "b": "record-photograph",
        "out": "condition-record"
      },
      {
        "id": "documented-map",
        "a": "damaged-map",
        "b": "condition-record",
        "out": "documented-map",
        "retire": [
          {
            "item": "damaged-map",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "support-board",
        "a": "acid-free-board",
        "b": "knife",
        "out": "support-board"
      },
      {
        "id": "supported-map",
        "a": "support-board",
        "b": "documented-map",
        "out": "supported-map",
        "sources": [
          "cci"
        ],
        "retire": [
          {
            "item": "documented-map",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "protective-folder",
        "a": "tissue",
        "b": "folder",
        "out": "protective-folder"
      },
      {
        "id": "housed-map",
        "a": "supported-map",
        "b": "protective-folder",
        "out": "housed-map",
        "sources": [
          "cci"
        ],
        "retire": [
          {
            "item": "supported-map",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "provenance-note",
        "a": "record-photograph",
        "b": "archive-letter",
        "out": "provenance-note"
      },
      {
        "id": "exhibition-label",
        "a": "provenance-note",
        "b": "label-card",
        "out": "exhibition-label"
      },
      {
        "id": "protected-display",
        "a": "housed-map",
        "b": "low-light-case",
        "out": "protected-display",
        "sources": [
          "cci"
        ],
        "retire": [
          {
            "item": "housed-map",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "map-exhibit",
        "a": "protected-display",
        "b": "exhibition-label",
        "out": "map-exhibit",
        "retire": [
          {
            "item": "protected-display",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      }
    ],
    "stages": [
      {
        "id": "intake",
        "title": "The salvage table",
        "speaker": "The conservator",
        "motivation": "Our conservator has dried and stabilized this map. Before we display it, make a record of its condition.",
        "area": {
          "id": "intake-area",
          "label": "The salvage table",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [],
        "objectives": [
          {
            "id": "documented-map-goal",
            "text": "Make documented map.",
            "kind": "create",
            "item": "documented-map"
          }
        ]
      },
      {
        "id": "housing",
        "title": "The paper store",
        "speaker": "The conservator",
        "motivation": "We will not make the tears disappear. Give the map a protective housing.",
        "area": {
          "id": "housing-area",
          "label": "The paper store",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "housing-supplies",
            "label": "Conservation supplies",
            "narrative": "The store provides suitable board, tissue, folders and a cutting tool. Treatment decisions belong to a trained conservator.",
            "items": [
              "acid-free-board",
              "knife",
              "tissue",
              "folder"
            ]
          }
        ],
        "objectives": [
          {
            "id": "housed-map-goal",
            "text": "Make housed map.",
            "kind": "create",
            "item": "housed-map"
          }
        ]
      },
      {
        "id": "display",
        "title": "The quiet gallery",
        "speaker": "The curator",
        "motivation": "A letter tells us who carried the map. Make a protected exhibit that keeps that history visible.",
        "area": {
          "id": "display-area",
          "label": "The quiet gallery",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "archive-case",
            "label": "Archive and display store",
            "narrative": "The archive supplies a related letter; the gallery provides a label and a low-light case.",
            "items": [
              "archive-letter",
              "label-card",
              "low-light-case"
            ]
          }
        ],
        "objectives": [
          {
            "id": "map-exhibit-goal",
            "text": "Make map exhibit.",
            "kind": "create",
            "item": "map-exhibit"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "cci",
        "title": "Canadian Conservation Institute: Care of paper objects",
        "url": "https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/paper-objects.html",
        "note": "Primary preventive conservation guidance; fiction abstracts safe housing, not wet-object treatment."
      }
    ],
    "notes": [
      "Original scenario candidate. It tests preservation as progress rather than every output becoming a more powerful version.",
      "No recipe adds water, heat, adhesive or cleaning chemicals to a damaged artifact.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "The salvage table",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "The paper store",
        "actions": [
          {
            "type": "combine",
            "a": "condition-form",
            "b": "pencil"
          },
          {
            "type": "combine",
            "a": "damaged-map",
            "b": "ruler"
          },
          {
            "type": "combine",
            "a": "record-template",
            "b": "map-measurements"
          },
          {
            "type": "combine",
            "a": "camera",
            "b": "damaged-map"
          },
          {
            "type": "combine",
            "a": "condition-notes",
            "b": "record-photograph"
          },
          {
            "type": "combine",
            "a": "damaged-map",
            "b": "condition-record"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "The quiet gallery",
        "actions": [
          {
            "type": "combine",
            "a": "condition-form",
            "b": "pencil"
          },
          {
            "type": "combine",
            "a": "damaged-map",
            "b": "ruler"
          },
          {
            "type": "combine",
            "a": "record-template",
            "b": "map-measurements"
          },
          {
            "type": "combine",
            "a": "camera",
            "b": "damaged-map"
          },
          {
            "type": "combine",
            "a": "condition-notes",
            "b": "record-photograph"
          },
          {
            "type": "combine",
            "a": "damaged-map",
            "b": "condition-record"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "acid-free-board",
            "b": "knife"
          },
          {
            "type": "combine",
            "a": "support-board",
            "b": "documented-map"
          },
          {
            "type": "combine",
            "a": "tissue",
            "b": "folder"
          },
          {
            "type": "combine",
            "a": "supported-map",
            "b": "protective-folder"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "shoreline",
    "title": "The Sheltered Shore",
    "premise": "An original restoration-planning fiction for a sheltered estuary. Local surveys determine what belongs here; a living shoreline is not a universal answer to coastal hazards.",
    "items": [
      {
        "id": "coir",
        "label": "Coir"
      },
      {
        "id": "coir-roll",
        "label": "Coir roll",
        "description": "A bounded coir roll prepared for this sheltered-bank project."
      },
      {
        "id": "erosion-map",
        "label": "Erosion map"
      },
      {
        "id": "marsh-plugs",
        "label": "Marsh plugs",
        "description": "Native marsh seedlings grown in nursery trays. Several weeks of nursery care pass in this fictional step."
      },
      {
        "id": "mesh-bag",
        "label": "Mesh bag"
      },
      {
        "id": "monitoring-layout",
        "label": "Monitoring layout"
      },
      {
        "id": "monitoring-poles",
        "label": "Monitoring poles"
      },
      {
        "id": "monitoring-record",
        "label": "Monitoring record"
      },
      {
        "id": "native-seed",
        "label": "Native seed"
      },
      {
        "id": "notebook",
        "label": "Notebook"
      },
      {
        "id": "nursery-tray",
        "label": "Nursery tray"
      },
      {
        "id": "planted-edge",
        "label": "Planted coir module",
        "description": "A small planted coir module that can be carried to the bank. It is not a portable shoreline."
      },
      {
        "id": "reef-module",
        "label": "Reef module"
      },
      {
        "id": "reef-plan",
        "label": "Reef plan"
      },
      {
        "id": "season-report",
        "label": "Season report",
        "description": "A record for continued assessment, not a certificate that the shoreline is restored."
      },
      {
        "id": "seasonal-photos",
        "label": "Seasonal photos",
        "description": "Photographs from a later season document what happened; the act of making a report does not establish that the intervention succeeded."
      },
      {
        "id": "sediment-sample",
        "label": "Sediment sample"
      },
      {
        "id": "shell",
        "label": "Shell"
      },
      {
        "id": "shell-bag",
        "label": "Shell bag"
      },
      {
        "id": "shore-map",
        "label": "Shore map"
      },
      {
        "id": "shoreline-plan",
        "label": "Shoreline plan"
      },
      {
        "id": "site-survey",
        "label": "Site survey"
      },
      {
        "id": "stakes",
        "label": "Stakes"
      },
      {
        "id": "survey-photos",
        "label": "Survey photos"
      },
      {
        "id": "tide-gauge",
        "label": "Tide gauge"
      },
      {
        "id": "tide-record",
        "label": "Tide record"
      }
    ],
    "locations": [
      {
        "id": "bank",
        "label": "Sheltered bank"
      }
    ],
    "initialItems": [
      "tide-gauge",
      "notebook",
      "shore-map",
      "survey-photos",
      "sediment-sample"
    ],
    "recipes": [
      {
        "id": "tide-record",
        "a": "tide-gauge",
        "b": "notebook",
        "out": "tide-record"
      },
      {
        "id": "erosion-map",
        "a": "shore-map",
        "b": "survey-photos",
        "out": "erosion-map"
      },
      {
        "id": "site-survey",
        "a": "erosion-map",
        "b": "sediment-sample",
        "out": "site-survey"
      },
      {
        "id": "shoreline-plan",
        "a": "site-survey",
        "b": "tide-record",
        "out": "shoreline-plan"
      },
      {
        "id": "coir-roll",
        "a": "coir",
        "b": "stakes",
        "out": "coir-roll"
      },
      {
        "id": "marsh-plugs",
        "a": "native-seed",
        "b": "nursery-tray",
        "out": "marsh-plugs",
        "description": "Nursery time passes as the native seedlings establish. Biological growth is compressed, not instantaneous."
      },
      {
        "id": "planted-edge",
        "a": "marsh-plugs",
        "b": "coir-roll",
        "out": "planted-edge",
        "description": "Nursery-grown marsh plugs are established in a bounded coir module. Placement installs that same module at the sheltered bank."
      },
      {
        "id": "shell-bag",
        "a": "shell",
        "b": "mesh-bag",
        "out": "shell-bag"
      },
      {
        "id": "reef-module",
        "a": "shell-bag",
        "b": "reef-plan",
        "out": "reef-module"
      },
      {
        "id": "monitoring-layout",
        "a": "shoreline-plan",
        "b": "monitoring-poles",
        "out": "monitoring-layout"
      },
      {
        "id": "monitoring-record",
        "a": "monitoring-layout",
        "b": "seasonal-photos",
        "out": "monitoring-record"
      },
      {
        "id": "season-report",
        "a": "monitoring-record",
        "b": "tide-record",
        "out": "season-report"
      }
    ],
    "stages": [
      {
        "id": "survey",
        "title": "Survey the estuary",
        "speaker": "The coastal ecologist",
        "motivation": "This bank is sheltered, but it is retreating. Make a shoreline plan from the tide and site records.",
        "area": {
          "id": "survey-area",
          "label": "Survey the estuary",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [],
        "objectives": [
          {
            "id": "shoreline-plan-goal",
            "text": "Make shoreline plan.",
            "kind": "create",
            "item": "shoreline-plan"
          }
        ]
      },
      {
        "id": "bank",
        "title": "Plant the sheltered bank",
        "speaker": "The nursery keeper",
        "motivation": "Our survey supports native marsh plants here. Set the planted coir module at the Sheltered bank.",
        "area": {
          "id": "bank-area",
          "label": "Plant the sheltered bank",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [
          "bank"
        ],
        "caches": [
          {
            "id": "nursery",
            "label": "The restoration nursery",
            "narrative": "The nursery carries locally appropriate plants, coir, stakes, shell and reef materials—not every coast needs all of them.",
            "items": [
              "coir",
              "stakes",
              "native-seed",
              "nursery-tray",
              "shell",
              "mesh-bag",
              "reef-plan"
            ]
          }
        ],
        "objectives": [
          {
            "id": "planted-edge-goal",
            "text": "Place the planted coir module at the Sheltered bank.",
            "kind": "place",
            "item": "planted-edge",
            "location": "bank"
          }
        ]
      },
      {
        "id": "seasons",
        "title": "A season of watching",
        "speaker": "The coastal ecologist",
        "motivation": "Installing a project is not the same as proving it works. Make a season report from the monitoring record.",
        "area": {
          "id": "seasons-area",
          "label": "A season of watching",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "monitoring",
            "label": "The field team returns",
            "narrative": "Survey poles and photographs from a later season arrive with the field team. Time has passed in the story.",
            "items": [
              "monitoring-poles",
              "seasonal-photos"
            ]
          }
        ],
        "objectives": [
          {
            "id": "season-report-goal",
            "text": "Make season report.",
            "kind": "create",
            "item": "season-report"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "noaa",
        "title": "NOAA: What is a living shoreline?",
        "url": "https://oceanservice.noaa.gov/facts/living-shoreline.html",
        "note": ""
      }
    ],
    "notes": [
      "NOAA supports the general restoration approach, not this fictional engineering design.",
      "Reef module is optional discovery, not forced into every site. No claim that plants prevent every storm or that survey photos alone prove causal success.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "Survey the estuary",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "Plant the sheltered bank",
        "actions": [
          {
            "type": "combine",
            "a": "shore-map",
            "b": "survey-photos"
          },
          {
            "type": "combine",
            "a": "erosion-map",
            "b": "sediment-sample"
          },
          {
            "type": "combine",
            "a": "tide-gauge",
            "b": "notebook"
          },
          {
            "type": "combine",
            "a": "site-survey",
            "b": "tide-record"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "A season of watching",
        "actions": [
          {
            "type": "combine",
            "a": "shore-map",
            "b": "survey-photos"
          },
          {
            "type": "combine",
            "a": "erosion-map",
            "b": "sediment-sample"
          },
          {
            "type": "combine",
            "a": "tide-gauge",
            "b": "notebook"
          },
          {
            "type": "combine",
            "a": "site-survey",
            "b": "tide-record"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "native-seed",
            "b": "nursery-tray"
          },
          {
            "type": "combine",
            "a": "coir",
            "b": "stakes"
          },
          {
            "type": "combine",
            "a": "marsh-plugs",
            "b": "coir-roll"
          },
          {
            "type": "place",
            "item": "planted-edge",
            "location": "bank"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  },
  {
    "schemaVersion": 1,
    "id": "theology",
    "title": "The Guest and the Fast",
    "premise": "A fictional medieval Benedictine guesthouse asks how hospitality and fasting can coexist. This is one Latin-Christian rule and a particular case, not a universal religion or a proof of doctrine.",
    "items": [
      {
        "id": "basin",
        "label": "Basin"
      },
      {
        "id": "basket",
        "label": "Basket"
      },
      {
        "id": "bread",
        "label": "Bread"
      },
      {
        "id": "brothers-timetable",
        "label": "Brothers timetable"
      },
      {
        "id": "calendar",
        "label": "Calendar"
      },
      {
        "id": "chapter-53",
        "label": "Chapter 53"
      },
      {
        "id": "community-fast-note",
        "label": "Community fast note",
        "description": "The guest exception does not require every brother to break the fast. The note preserves the other part of the rule."
      },
      {
        "id": "fasting-rule",
        "label": "Fasting rule"
      },
      {
        "id": "guest-account",
        "label": "Guest account"
      },
      {
        "id": "guest-meal",
        "label": "Guest meal"
      },
      {
        "id": "guest-table",
        "label": "Guest table"
      },
      {
        "id": "guest-washstand",
        "label": "Guest washstand"
      },
      {
        "id": "hospitality-passage",
        "label": "Hospitality passage"
      },
      {
        "id": "hospitality-question",
        "label": "Hospitality question",
        "description": "Must receiving a guest mean abandoning the fast for the whole community? The question exposes a tension, not a contradiction proved by the game."
      },
      {
        "id": "host-exception",
        "label": "Host exception",
        "description": "Chapter53 distinguishes the superior receiving a guest from the other brothers, and ordinary fasts from principal fasts. The exception is limited, not a repeal."
      },
      {
        "id": "host-permission",
        "label": "Host permission",
        "description": "For this ordinary fast, the superior may eat with the guest. The other brothers keep their usual fasting practice."
      },
      {
        "id": "laid-table",
        "label": "Laid table"
      },
      {
        "id": "linen",
        "label": "Linen"
      },
      {
        "id": "ordinary-fast-day",
        "label": "Ordinary fast day",
        "description": "In this fictional case the calendar identifies an ordinary fast, not an unbreakable principal fast."
      },
      {
        "id": "shared-table",
        "label": "Shared table",
        "description": "The prepared table now bears the host’s place as well as the guest’s; this represents the chosen hospitality arrangement, not an extra created meal."
      },
      {
        "id": "table",
        "label": "Table"
      },
      {
        "id": "washing-basin",
        "label": "Washing basin"
      },
      {
        "id": "water",
        "label": "Water"
      },
      {
        "id": "welcome-reading",
        "label": "Welcome reading",
        "description": "The guest is received with care, not treated as an interruption to erase."
      }
    ],
    "locations": [
      {
        "id": "guesthouse",
        "label": "Guesthouse"
      }
    ],
    "initialItems": [
      "bread",
      "basket",
      "water",
      "basin",
      "linen"
    ],
    "recipes": [
      {
        "id": "guest-meal",
        "a": "bread",
        "b": "basket",
        "out": "guest-meal"
      },
      {
        "id": "washing-basin",
        "a": "water",
        "b": "basin",
        "out": "washing-basin"
      },
      {
        "id": "guest-washstand",
        "a": "washing-basin",
        "b": "linen",
        "out": "guest-washstand",
        "retire": [
          {
            "item": "washing-basin",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "welcome-reading",
        "a": "guest-account",
        "b": "hospitality-passage",
        "out": "welcome-reading",
        "description": "The guest is received with care, not treated as an interruption to erase.",
        "sources": [
          "benedict"
        ]
      },
      {
        "id": "ordinary-fast-day",
        "a": "fasting-rule",
        "b": "calendar",
        "out": "ordinary-fast-day",
        "description": "In this fictional case the calendar identifies an ordinary fast, not an unbreakable principal fast.",
        "sources": [
          "benedict"
        ]
      },
      {
        "id": "hospitality-question",
        "a": "welcome-reading",
        "b": "fasting-rule",
        "out": "hospitality-question",
        "description": "Must receiving a guest mean abandoning the fast for the whole community? The question exposes a tension, not a contradiction proved by the game.",
        "sources": [
          "benedict"
        ]
      },
      {
        "id": "host-exception",
        "a": "hospitality-question",
        "b": "chapter-53",
        "out": "host-exception",
        "description": "Chapter53 distinguishes the superior receiving a guest from the other brothers, and ordinary fasts from principal fasts. The exception is limited, not a repeal.",
        "sources": [
          "benedict"
        ]
      },
      {
        "id": "host-permission",
        "a": "host-exception",
        "b": "ordinary-fast-day",
        "out": "host-permission",
        "description": "For this ordinary fast, the superior may eat with the guest. The other brothers keep their usual fasting practice.",
        "sources": [
          "benedict"
        ]
      },
      {
        "id": "laid-table",
        "a": "table",
        "b": "linen",
        "out": "laid-table"
      },
      {
        "id": "guest-table",
        "a": "laid-table",
        "b": "guest-meal",
        "out": "guest-table",
        "retire": [
          {
            "item": "laid-table",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "shared-table",
        "a": "host-permission",
        "b": "guest-table",
        "out": "shared-table",
        "description": "The prepared table now bears the host’s place as well as the guest’s; this represents the chosen hospitality arrangement, not an extra created meal.",
        "sources": [
          "benedict"
        ],
        "retire": [
          {
            "item": "guest-table",
            "reason": "The original is incorporated into this recognizable derived thing."
          }
        ]
      },
      {
        "id": "community-fast-note",
        "a": "host-exception",
        "b": "brothers-timetable",
        "out": "community-fast-note",
        "description": "The guest exception does not require every brother to break the fast. The note preserves the other part of the rule.",
        "sources": [
          "benedict"
        ]
      }
    ],
    "stages": [
      {
        "id": "gate",
        "title": "At the guesthouse gate",
        "speaker": "The guestmaster",
        "motivation": "A traveller has arrived tired and hungry. Prepare a washstand, and put a meal in the guesthouse.",
        "area": {
          "id": "gate-area",
          "label": "At the guesthouse gate",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [
          "guesthouse"
        ],
        "caches": [],
        "objectives": [
          {
            "id": "guest-meal-goal",
            "text": "Put the guest meal in the Guesthouse.",
            "kind": "place",
            "item": "guest-meal",
            "location": "guesthouse"
          },
          {
            "id": "guest-washstand-goal",
            "text": "Make a guest washstand.",
            "kind": "create",
            "item": "guest-washstand"
          }
        ]
      },
      {
        "id": "question",
        "title": "A guest on a fast day",
        "speaker": "The novice",
        "motivation": "Today is a fast. Can our superior eat with the traveller while the brothers keep it? Find the host’s permission, and make a note of the community’s fast.",
        "area": {
          "id": "question-area",
          "label": "A guest on a fast day",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "rule-desk",
            "label": "The guestmaster’s desk",
            "narrative": "The desk holds the Rule, a fasting schedule, today’s calendar and the traveller’s account. We are considering an ordinary fast, not a principal fast.",
            "items": [
              "guest-account",
              "hospitality-passage",
              "fasting-rule",
              "calendar",
              "chapter-53",
              "brothers-timetable"
            ]
          }
        ],
        "objectives": [
          {
            "id": "host-permission-goal",
            "text": "Establish the host’s permission for this day.",
            "kind": "create",
            "item": "host-permission"
          },
          {
            "id": "community-fast-note-goal",
            "text": "Make the note preserving the community’s fast.",
            "kind": "create",
            "item": "community-fast-note"
          }
        ]
      },
      {
        "id": "table",
        "title": "Room at the table",
        "speaker": "The guestmaster",
        "motivation": "The rule makes room for our guest without asking the whole community to stop its practice. Prepare the shared table.",
        "area": {
          "id": "table-area",
          "label": "Room at the table",
          "travelText": "We are taking the useful things with us. Earlier creations remain where we made them."
        },
        "locations": [],
        "caches": [
          {
            "id": "guest-dining",
            "label": "The guest dining room",
            "narrative": "The adjoining room has a table. The meal and linen come with us.",
            "items": [
              "table"
            ]
          }
        ],
        "objectives": [
          {
            "id": "shared-table-goal",
            "text": "Prepare the shared host-and-guest table.",
            "kind": "create",
            "item": "shared-table"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "benedict",
        "title": "Rule of Benedict, chapter53, especially verses10–11 and16",
        "url": "https://pressbooks.palni.org/ruleofbenedict/chapter/rb-53/",
        "note": "Primary translation. Host exception, principal-fast limitation and other brothers’ continued practice distinguish this case."
      }
    ],
    "notes": [
      "Explicitly a fictional Benedictine case grounded in one primary text, not all Christian practice or all religions.",
      "An ordinary fast is a stipulated story fact; the recipe does not calculate a real liturgical calendar.",
      "The rule makes distinct roles and conditions matter. Gameplay still risks document assembly; test before expanding.",
      "The meal is carried from the former guesthouse area into its adjoining dining room, not conjured by the argument.",
      "Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.",
      "v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2."
    ],
    "checkpoints": [
      {
        "id": "chapter-1",
        "label": "At the guesthouse gate",
        "actions": []
      },
      {
        "id": "chapter-2",
        "label": "A guest on a fast day",
        "actions": [
          {
            "type": "combine",
            "a": "bread",
            "b": "basket"
          },
          {
            "type": "place",
            "item": "guest-meal",
            "location": "guesthouse"
          },
          {
            "type": "combine",
            "a": "water",
            "b": "basin"
          },
          {
            "type": "combine",
            "a": "washing-basin",
            "b": "linen"
          },
          {
            "type": "advance"
          }
        ]
      },
      {
        "id": "chapter-3",
        "label": "Room at the table",
        "actions": [
          {
            "type": "combine",
            "a": "bread",
            "b": "basket"
          },
          {
            "type": "place",
            "item": "guest-meal",
            "location": "guesthouse"
          },
          {
            "type": "combine",
            "a": "water",
            "b": "basin"
          },
          {
            "type": "combine",
            "a": "washing-basin",
            "b": "linen"
          },
          {
            "type": "advance"
          },
          {
            "type": "combine",
            "a": "guest-account",
            "b": "hospitality-passage"
          },
          {
            "type": "combine",
            "a": "welcome-reading",
            "b": "fasting-rule"
          },
          {
            "type": "combine",
            "a": "hospitality-question",
            "b": "chapter-53"
          },
          {
            "type": "combine",
            "a": "fasting-rule",
            "b": "calendar"
          },
          {
            "type": "combine",
            "a": "host-exception",
            "b": "ordinary-fast-day"
          },
          {
            "type": "combine",
            "a": "host-exception",
            "b": "brothers-timetable"
          },
          {
            "type": "advance"
          }
        ]
      }
    ]
  }
];
