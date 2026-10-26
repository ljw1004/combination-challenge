# Imprints: place and retained history as primitives

Small logical experiment, `imprints-1`. No authored dialogue, chapter queue, named recipient errand or UI implementation. The rejected Far Bank work is historical; this model uses a separate file and does not change Confluence2 or the live story reader.

## Candidate laws before play

The board is nine places, not nine story beats. Cells have soil, clay or stone; a route; an optional root system; an optional retained imprint; and an optional broadcast. Items are inexhaustible capabilities. An action is an inspectable `A+B at P`, where the current place supplies the catalytic condition.

1. Water and marks follow east/south routes. Splitting duplicates pressure rather than spending an inventory. Strong exposed flow floods soft, unrooted ground; stone and fired clay remain passable.
2. Seed+Water at wet soil or unfired wet clay makes reeds. Reeds soften flow, turn exact marks into fragments and emit seeds. Gentle water carrying seeds can establish a descendant on soil without another planting instruction.
3. Heat+Earth fires clay into an imprint-retaining surface. Stone and fired clay retain exact arrivals. The copy persists after rerouting or later fragmentation upstream.
4. Air+Voice makes a marked place broadcast. Any current mark can activate it. A retained exact copy is republished even when the activating arrival is only a fragment. Public exact marks create strong local flow; fragments do not.
5. Two visible walkers seek the other mark, read it at a public exact broadcast, carry it home and leave a persistent imprint. After returning, they seek a quiet shared record away from their original home. Routes and flooded terrain determine where they can travel.

Hooding a broadcast preserves its record. Erasing an imprint removes that particular copy without erasing an original elsewhere. Drying roots changes what future arrivals mean. The complete catalysts, legal pairs and exact previews are public; no location recipe must be guessed.

The two walkers have fixed, explicit local policies. Their movement, deposits and changed purposes are real board events, not dialogue declaring that someone has begun a project. This is a small cooperative behavior model, not a claim about human psychology or autonomous consciousness.

## Executable causal chain

The screen compares two histories on the same board:

- Route water east, fire C1, activate its broadcast, then grow reeds upstream at B1.
- Route water east, grow B1 first, then fire C1 and activate its broadcast.

Both finish with a rooted B1 and a fired, broadcasting C1. In the first history C1 already retained exact A. The later fragment wakes that copy; strong flow persists at C2 and prevents a new descendant there. In the second history C1 never received an exact A, so it broadcasts only the fragment. C2 receives gentle water and roots autonomously. The first history can also attract a walker that the fragment-only history cannot.

This is the proposed experience engine: a previous arrival changes what a later combination at the same place actually does; that local difference changes another place and an avatar's available path or purpose. A player can respond by rerouting, retaining a copy elsewhere, hooding the broadcast, or erasing the local copy while preserving its source. There is no authored extra emergency.

Time is arrival order, retained copies and an autonomous sequence of movement and return. A combination lets the world respond until it rests. No waiting command, scarce turn allowance, ticking damage or maintenance chore is introduced.

## Modest initial aim and open continuation

The initial aim is to bring the two marks into one another's knowledge. Both walkers must return with both marks before finishing becomes available. A three-operation witness achieves this aim, so difficulty or long duration is **not** established. After that, the walkers' quiet-record purpose and the physical consequences remain. A player can voluntarily pursue a quiet common imprint, living routes, controlled publicity, or another construction; they can also stop.

The first public-only test should ask whether those primitive consequences invite a further intention. It must not call a three-step success a180–240-decision game. Nor should it manufacture a long run by toggling routes after the player feels done.

## Place availability and representation

The model exports `compatibleImprintPlaces(state,A,B)` and per-place available pairs. These are suitable for lighting compatible terrain when an item is inspected, and conversely showing compatible pairs when a place is inspected. No UI is implemented. Soil, wetness, fired clay, retained marks, roots and broadcast state are all model-native conditions.

Exact previews include cell configuration changes, retained imprints, per-origin field changes, avatar purpose/path changes and the autonomous trace. A purported revelation never substitutes for an enacted state effect. Observations contain a compact board table and avatars, without narrative passages.

## Frozen API

```ts
IMPRINT_VERSION // 'imprints-1'
IMPRINT_SCENARIOS // ['board']
type State
type Action
createImprints(scenario?, seed?)
observeImprints(state)
stepImprints(state, action)
previewImprints(state, action)
imprintsActions(state)
imprintsRules()
compatibleImprintPlaces(state, itemA, itemB)
imprintsOutcome(state)
imprintsKey(state)
replayImprints(actions)
screenImprints()
```

Examples:

```json
{"type":"combine","a":"earth","b":"water","at":"A1","toward":"east"}
{"type":"combine","a":"heat","b":"earth","at":"C1"}
{"type":"combine","a":"air","b":"voice","at":"C1"}
{"type":"combine","a":"seed","b":"water","at":"B1"}
```

The seed currently does not change the board. The source and scenario are frozen for the first player test; revisions require a separate version. The exact screen is at `results/logical-imprints-screen.json`.

## First actual play

Fresh [fun-imprints-1](../results/logical-players/fun-imprints-1.json) completed the initial aim in three combines, recorded a further intention at a valid checkpoint, then made two elective combines and stopped. No previews were used. A2's planted crossing supported learning, return and later settlement. B2 changed from an old A-only imprint to a quiet shared A+B place. Making A1 public moved amber toward B2 without changing the flood map.

The player valued choosing and seeing the walkers inhabit that ending. The initial challenge was easy; amber could learn A at home, reducing the need for another journey. After both walkers settled together, no immediate further project or same-board replay was wanted. Keep the primitive place/relationship mechanism; the five-combine arc remains far shorter than the owner's long-game target. This is one AI protocol play, not human enjoyment or visual-readability evidence.
