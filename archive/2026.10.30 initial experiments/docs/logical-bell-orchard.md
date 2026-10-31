# The Bell Orchard: an intention that changes what comes next

Initial designer hypothesis, written before player testing. Model: `bell-orchard-1`. This is a separate causal/narrative world; [process-1](logical-process.md) remains frozen. No UI work is included.

The desired experience is **authorship that catches the player's attention again**: let an intention become real, notice what that act changed, and want to do something further with the same world. The candidate is not a sequence of score-and-reset vectors. It is one valley with an orchard, a village and the hollow of a drowned city.

## The experiential engine

The first aim is simply to let the flooded orchard breathe. Combining Earth and Water can lead the river into the hollow. That act succeeds and exposes a bell bearing the names of the drowned city. The bell is a capability and a question, not an automatically assigned second score target.

Combining Bell and Air makes its names audible at the village windows. In this world's explicit magical law, water follows a precise name spoken aloud. The river turns toward the listening village. The player may now want to protect the people from a consequence of the public memory they created.

Earth and Chorus can make a bank: the village becomes dry and still hears the voices, but cannot approach the river. Seed and Wall can turn the bank into living arches. Gentle water reconnects the village, while roots take the precise names into a fragmentary reed song. The next intention arises from the former solution, and the combination changes meaning: water shaping, making memory public, building a separation, then transforming that separation into a living boundary.

That is one possible arc, not the required winning script. The exposed bell may instead be sealed in stone, translating a fragile exact record into durable silence. Or Seed and Bell can make a listening grove: roots hold the river in the hollow, and the old names become living patterns that cannot recover their original exact form. Air can carry descendants into a village garden. A player may decide that quiet preservation, public exact voices behind a wall, living transformation, or simply the exposed whispering bell is the world they want to leave.

## Why the setting belongs to the mechanics

The drowned city's names are not decorative points. Their exact public voicing calls water; stone protects them by closing their form; roots translate them into something growing; a porous bank reconnects water by taking the names into reeds. The written responses report those actual state changes. An exact voice, a protected record and a living memory differ in what further transformations can do.

These are invented laws of a small mythic valley, not hydrological or historical claims. All recipes, world-state prerequisites and immediate consequences are public. Revealing the bell does not introduce a secret ontology: its possible relations are listed from the start, and its exposure makes them available in this world.

The historical bell is a world object, not a finite ingredient allowance. All concepts stay known and inexhaustible. Knowing “bell” does not produce another copy of a past historical state after this particular record has become a grove or a sealed archive. There are no material quantities, construction costs, action credits, waiting actions or upkeep ticks.

The world rests after a response. Flooding does not inflict hidden accumulating damage while the player thinks. This means that concern for the village must come from caring about the world, rather than a timer or health counter. That is part of the hypothesis and a possible weakness.

## Optional pursuit and a stopping point

The orchard is the only initial required aim. Once it is clear, `finish` records the world the player chooses to leave and an optional intention sentence. Other invitations are optional and remain causally tied to what happened. A player can finish while the bell quietly whispers in the hollow, or decline further pursuit after any later arrangement. This is not a failed run.

The observation distinguishes a current world, its response and invitations arising from that response. Invitations are possible projects, not hidden mandatory objectives or a scoring checklist. The full recipes and exact previews remain visible, so a player may plan a whole arc before acting. That can still be authored enactment; it does not by itself show an absorbing feedback loop.

## What a critic should test

- After saving the orchard, does the exposed bell actually invite another intention, or merely announce the next authored task?
- Does making the voices public feel like doing something worth trying, despite the disclosed consequence for the village?
- Does the bank's exclusion produce a fresh question, or does the player regard the whole arc as a prewritten four-command chain?
- Does the language make the player care about exact names, living patterns, river contact or public voices? Distinct state flags alone cannot establish that.
- Would a player voluntarily stop early? Preserve that choice rather than nudging them into all optional content.
- Could auto-resolving a known chain remove a valued act of authorship, or would it remove only transcription? Ask about a concrete completed segment.

A useful positive result would be a player's intention changing in response to a world consequence, followed by an informed new combination whose purpose differs from the previous act. A different positive result could be a deliberately chosen whole-world plan that the player values enacting. A negative result would be an indifferent march through every recipe, concern only for a completion flag, or a report that the setting adds no significance to the combinations.

## Pure API

```ts
BELL_VERSION // 'bell-orchard-1'
BELL_SCENARIO_IDS // ['the-bell-orchard']
type State = BellState
type Action = BellAction
createBellOrchard(scenarioId?, seed?)
observeBellOrchard(state)
stepBellOrchard(state, action)
previewBellOrchard(state, action)
legalBellActions(state)
bellWorld(state)
bellOutcome(state)
bellSemanticKey(state)
endingBellOrchard(state)
replayBellOrchard(actions)
screenBellOrchard()
```

Combines use `{type:'combine', a:'earth', b:'water', at:'hollow'}` or the displayed concept pairs. `at` is only used for Earth+Water. Stopping uses `{type:'finish', intention:'optional short chosen intention'}`. `finish` becomes available after the orchard is clear. It is a meta-level stopping action, not a production instruction or waiting turn.

`bellOutcome` returns the semantic key, terminal status and real world properties with nominal higher directions for counterfactual comparison. Only orchard safety is initially required. The other properties are candidate values, not universally desirable score components. There is no aggregate reward. The seed currently does not alter this authored encounter.

State/API/observation semantics should be frozen once a player begins. Later iterations need their own version or module. No agent play or human absorption finding is claimed by this initial design note.
