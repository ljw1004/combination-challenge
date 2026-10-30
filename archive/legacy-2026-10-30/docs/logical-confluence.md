# Confluence: a continuing world with another author

Initial long-game design, frozen as `confluence-2` before player use. [Core](../experiments/logical-confluence.ts), [written world](../experiments/confluence-story.ts), [mechanical screen](../results/logical-confluence-screen.json). Bell Orchard1/2 and the earlier logical models remain unchanged. This prototype contains no UI.

Preflight found a genuine grammar collision: Seed+Memory at a place could mean a garden or a commons. Version2 makes the interpretation selectable: material/process combines omit `mode`; charters explicitly use `mode:'institution'`. Both are in the public recipes and legal actions. Version1 source/story and its diversity screen are preserved under `experiments/snapshots/confluence-preplay-grammar` and `results/logical-confluence-preplay-grammar-screen.json`. No player session existed before this correction; no player capture was rewritten.

## The bold hypothesis

A world becomes absorbing when making one relation changes both what can happen and what the player may want to do next. Earlier creations should acquire new roles: a water course becomes a living route, then a way for a memory to travel, then a conduit for authority. A recipient can eventually do something that the original creator did not specify. Narrative and beauty give those changes something worth caring about; they are not merely new labels on a score vector.

The target is a continuing logical play of approximately180–240 intervention opportunities. This is a provisional design/content target, **not evidence of180 worthwhile decisions or30–40 human minutes**. A privileged diagnostic can demonstrate that the world remains changeable for200 commitments; only actual play can establish whether pursuing those changes remains worthwhile.

The first intention is to let a flooded orchard breathe. The country also contains a spring, listening hollow, village, marsh, kiln, archive and meeting place. Mneme wants continuity, the Judge legibility, and Ilex authorship. The specific continuing question is Ilex's first mark: did he make it, or was his hearth merely where a received intention became fixed? That question arises when a voice actually reaches him, and later world conditions let him begin a garden the player did not assign.

## One world, five meanings of combination

Fourteen neighboring links and eight places persist throughout the arc. The world does not reset between chapters. The phases follow actual causal milestones:

| Phase | What combination means | What opens the next phase |
| --- | --- | --- |
| Matter | Establish a path or material form through which something can pass | A planted form grows. |
| Life | Carry seeds, grow descendants and transform received voices | A native descendant takes root; the awakened bell reaches another place. |
| Memory | Preserve, translate or expose an account and its origin | Mneme has heard, Ilex has made a first mark, and plural origins reach the meeting. |
| Law | Make a continuing rule about custody, publication, origin and authority | The Judge is responsive and at least two places have charters. |
| Purpose | Give an enduring relation a purpose, or offer/impose a purpose on another actor | The player decides what settlement to leave; no further count gate exists. |

These are not independent puzzle targets or a200-step quest list. Each later law changes the earlier network's behavior. All phases can be reached in an eleven-combination witness, which emphatically is not a30-minute arc. The long-game claim depends on self-chosen ambitions and interacting consequences after capabilities open, rather than withholding the final vocabulary for200 turns.

The model supports a broad frontier rather than a mandatory schedule: after that witness,263 legal changes are available. They include route forms, place transformations, institutions, binding or revisable purposes, and invitations or instructions to three actors. Some are useful setup, optimization or expression; their existence does not prove a meaningful decision. The long playtest must identify which interventions actually belong to unresolved intentions.

## The carrier grammar

The spring emits strong exposed water. Water reaching the hollow exposes an exact name-bearing bell. Routes then carry four different things: water, seeds, voices and authority. They do not all travel through the same connections.

- A canal carries exposed water and voices downhill.
- A reed route carries gentle water downhill, seeds in both directions, and voices as living fragments. Authority does not pass.
- A bridge carries quoted voices and authority in both directions, but no water or seeds.
- A covered conduit carries water, voices and authority downhill while withholding water from roots and contact.
- An airway carries seeds and public voices both ways. Exact public names call rain at their listeners.

Groves soften water and translate exact voices. Archives stop the stream and keep silent records. Resonators publish voices and can call dangerous rain. Gardens support descendants. Kilns dry their stream and fix received marks without restoring precision that was already lost. A native descendant can take root where gentle water and seeds meet, without another planting instruction.

Thus a route first made to protect a place can later change who hears an exact memory, where a living continuation grows, or whether authority reaches someone. The same operation can have a new role; repeating it is not automatically a chore or automatically interesting.

Origin labels identify speakers, not proof of independent evidence. Institutions further transform them. Commons make a common chorus but erase distinct origin labels. Custody suppresses outgoing voices and interprets received authority as a mandate. Witness preserves origins, quotes records and rejects imposed authority. Open publication makes voices accessible while potentially calling rain. There is no aggregate best-value score.

## Actors remember what the world did

Earlier exposure, protection and compulsion persist in actor state. At least three memories alter actual later propagation:

- Mneme who has seen exposure withholds exact testimony unless freely invited to listen. His policy is not merely a changed dialogue line.
- The Judge who has experienced compulsion requires an explicit invitation under witness before treating his later judgment as freely adopted authority.
- Ilex who has been compelled withholds his first mark until invited to a free purpose. With gentle water, seeds and an available neighboring place, a freely responsive Ilex can begin an actual descendant garden. The new form changes later carrier propagation.

The Judge can adopt witness instead of open publication; Mneme can choose silent custody. Actor acts use explicit policies, not an unbounded language-model plot generator. They may be predictable once understood, and that predictability is compatible with valuing what another will is now able to do. Whether the modeled agency feels meaningful remains a player-test question.

Binding promises also act. A sheltering guardian can replace a flooding place with a weir, sacrificing contact or life. A memory guardian preserves an archive under custody. A growth guardian keeps a grove, transforming exact records. A contact guardian opens a garden, and a freedom guardian releases a local bound assignment and keeps publication open. The player can revise the purpose, but earlier disclosure or compulsion is not erased from characters' histories.

## No hidden material or time economy

Concept capabilities are inexhaustible. A place has a current transforming form and a current rule, rather than an inventory of consumable ingredients. Mutually opposed forms cannot occupy the same relation simultaneously: a dry kiln does not also supply an open living stream, and silent custody does not simultaneously publish every voice. Different places and paths can cooperate to compose richer arrangements.

There is no action allowance, production wait, ticking damage, maintenance cost or stockpile. After a combination, carriers and actor policies resolve; the world then rests. Free thought and inaction do not cause unseen damage. Some transformations erase an exact local record; what actors or players already learned remains in their histories.

The player may finish whenever the orchard is safe, at any phase. This leaves a concrete world and intention rather than awarding maximal completion. An early chosen ending is legitimate evidence about the hook. The full arc and later ambitions are available, not mandatory. A long diagnostic instructed to continue is methodologically different from elective interest.

## Observation and interface for logical play

The default observer gives a compact eight-place table, active routes, current actor policies and intentions, the latest response, current questions, known concepts and a contextual shortlist. It never prints a growing200-event journal. Suggestions do not restrict the legal action set.

All rules and recipes are inspectable. `observeConfluence(state,{full:true})` returns the complete legal action list and map; `confluenceRulesObservation()` returns the static full laws and recipe grammar. The root CLI provides corresponding rules/actions queries, so players need no source access. Exact previews show functional field/actor changes, profile differences and newly enabled concepts without printing the exact narrative passages before commitment.

Example combinations:

```json
{"type":"combine","a":"earth","b":"water","at":"spring-hollow"}
{"type":"combine","a":"seed","b":"water","at":"orchard"}
{"type":"combine","a":"memory","b":"judgment","at":"meeting","mode":"institution"}
{"type":"combine","a":"promise","b":"growth","at":"marsh","mode":"binding"}
{"type":"combine","a":"purpose","b":"maker","intent":"free","mode":"invite"}
{"type":"finish","intention":"Leave a world where a received mark can become another beginning."}
```

## What the pre-play screen establishes

The current exact witness reaches the five phases through11 real changes. Preview/step purity, exact replay, and a persistent policy change after binding then freeing Ilex were checked. The full project typechecks.

A **privileged diversity-seeking diagnostic**, after that foundation, makes200 further commitments into distinct semantic states. Every selected commitment changes at least one derived place field, and an ending remains available. This proves capacity for a long intervention trace, not200 interesting decisions.

The strongest warning is in the same trace: the diversity policy frequently reconfigures the same routes, deliberately maximizing world differences. It mainly uses a handful of pairs and can create churn rather than a developing project. Do not present this coverage policy as a human-like playthrough, an absorption finding or the requested long game already validated. Root's mandated long agent run and separate elective-interest run are the next tests.

## Predicted experience and failure evidence

The positive prediction is a sequence of intentions whose significance develops: protect without isolating; make a voice reachable; decide its custody; notice an imposed purpose; create conditions for another author. A prior route or record should become relevant again under a different process or institutional rule. A player may also value enacting a plan already understood.

Counterevidence would include180 commands spent repeatedly toggling a known global effect, a completed world followed by mandated aimless experimentation, characters whose requests do not matter to the player, or many labels supporting one uniform configuration. Finishing after the first safe orchard is not participant failure. Passing the mechanical screen does not answer any of those questions.

## Frozen API

```ts
CONFLUENCE_VERSION // 'confluence-2'
CONFLUENCE_SCENARIO_IDS // ['unfinished-valley']
type State = ConfluenceState
type Action = ConfluenceAction
createConfluence(scenarioId?, seed?)
observeConfluence(state, {full?:boolean}?)
stepConfluence(state, action)
previewConfluence(state, action)
legalConfluenceActions(state)
confluenceRulesObservation()
confluenceRecipes()
confluenceOutcome(state)
confluenceSemanticKey(state)
endingConfluence(state, intention?)
replayConfluence(actions, seed?)
screenConfluence()
```

The seed is recorded but currently does not change this authored world. Semantic keys exclude action logs and prose, but retain actor memories and policies that change future behavior. Outcome dimensions are descriptive candidate values; only orchard safety is initially required. No fun score is emitted.

Core and story observations are frozen before player sessions. Any later revision must preserve this version and its recorded runs.
