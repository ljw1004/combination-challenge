# Mneme and the orchard before its first fruit

Designer proposal and small logical prototype. Constitution-1 remains unchanged. This encounter tests a different experience engine: an invention changes the understanding of a person who opposes you, and its consequence gives you a reason to answer that same person again.

## The experience I want to make

An orchard stands at its perfect first instant. Nothing can become otherwise because Mneme, its keeper, has remembered it completely. He is not collecting power or waiting for a turn counter. He loves the world and mistakes keeping an account of it for keeping it alive.

The player is creating relationships among faculties: Memory, Change, Distance, Forgetting, Doubt, Voice and Seed. These are the things under the player's logical hand. I want a combination to feel like making a concept real, then watching someone understand—or misunderstand—it.

The proposed trajectory is:

1. **Anticipation:** “If I give memory a before and an after, perhaps the orchard can move.”
2. **Intent:** combine Memory with Change to make History.
3. **Opposition and response:** Mneme uses History to preserve every version as another complete gallery. The fruit still cannot fall. This is his old purpose acting through the thing you invented.
4. **Renewed intent:** “Then history needs a future it does not already contain.” Combine the new History with Doubt.
5. **Payoff and a new wound:** the orchard moves. Its first petal ends. Mneme remembers it, but cannot give it that instant back. “I cannot keep it. Will that make it meaningless?”
6. **Optional authorship:** the player may stop with the orchard free, turn the ending into Legacy, or give it the shared voice of an Elegy.

The strongest moment should be the shift from opposing the keeper to deciding how to answer him. The invention is not a token exchanged for the next quest. The same Open History that freed the orchard is now the ingredient through which the player can address loss.

This is deliberately a small authored encounter, not a general conversational agent. It gives the designer room to make one consequential response precise before trying to generate a universe of them.

## Other ways to release this world

The player need not accept a prescribed lesson or solve a hidden word puzzle. All combinations and their immediate effects are inspectable.

| Approach | What becomes real | What changes for Mneme | Optional next pursuit |
| --- | --- | --- | --- |
| Memory + Change; then History + Doubt | A remembered past with an unwritten future | He remains himself and encounters a singular ending | Open History + Seed → Legacy; Open History + Voice → Elegy |
| Memory + Distance | Witness: remembering without occupying | He remains himself but misses the first new fruit; later knowledge cannot make that moment his own experience | Witness + Voice → Correspondence; Witness + Seed → Sanctuary |
| Memory + Forgetting | Renewal without the old account | His old name and vow are lost; an unnamed presence remains | Renewal + Voice → A new name; Renewal + Seed → Wild garden |

These are not three ways to purchase the same optimum. The routes change what the player is authoring: a world that can have an ending, an observer who cannot own every moment, or a beginning that is not obliged to preserve its old self. No scalar ranks these meanings.

The quieter routes are intentional. A player may want to free the orchard without arguing with the keeper, or may value the possibility of beginning again. They can reveal whether the conceptual alternatives attract a player's own intention, rather than only test whether the player discovers the History/Doubt sequence.

The logic is fictional and metaphysical. The model is not making a scientific claim that remembering prevents growth, or that a world can literally change without time. It is making the relation between holding, remembering and caring playable for one encounter.

## Minimal coherent rules

- Initial faculties are inexhaustible concepts. Both parents remain known after every combination.
- A combination establishes its result as a law in the orchard. Mneme responds through his current understanding of keeping the world.
- An unqualified remembered history extends his project: every version is another thing to hold. Doubt makes the future genuinely unrecorded.
- A release changes the keeper's relation permanently. The old preservation argument is then settled. New available combinations use the relationship that actually released him.
- Each optional pursuit enacts one response to that consequence. Legacy does not revive the ended petal. Correspondence does not undo the missed first experience. A new name does not recover Mneme's lost identity.
- Every recipe, its world condition and its immediate consequence is public. No guessing of legal pairs is required.
- There are no materials, production chores, action credits, deadline, score or waiting command.

Phase conditions are disclosed narrative commitments, not hidden recipe exceptions. Once Mneme no longer imposes a total account, offering another abstract release argument is not the next live relationship. This restriction is part of the tiny encounter's design and should be examined in play; a larger system would need to earn a richer account of how conflicting world-laws interact.

## Stopping points are part of the design

The baseline goal is only to release the orchard. Every release route immediately sets `baselineAchieved: true` and `status: 'won'`. It is a complete success without an epilogue action. The player may stop there.

The observation also gives Mneme's changed desire and two optional combinations tied to the result. Taking either preserves the baseline, produces an ending and ends the available action set. The player should be allowed to decline this invitation. Being required by the experimenter to do an epilogue would not demonstrate wanting to act again.

The optional endings are distinct acts of authorship:

- **Legacy:** create another life from an ending, without declaring it a resurrection.
- **Elegy:** make a loss shareable without reversing it.
- **Correspondence:** let the observed choose what to tell the observer.
- **Sanctuary:** care for lives that need not enter one's account.
- **A new name:** offer a voice that can name itself instead of restoring an old identity.
- **Wild garden:** make room for beginnings with no keeper choosing all their names.

I want these to read as possibilities opened by the player's invention, not as six achievement badges. A player reporting that none of them matters would be a direct failure of this proposed hook.

## A small design revision before play

The initial sketch had Memory + Change directly release the orchard. That made Mneme accept the player's finished concept without doing anything through it. It was a conceptual ending, but provided little opposition or renewed intention.

The implemented version lets him apply his existing purpose to History first. He turns it into a gallery. The player has created something he can use, and answering that response requires combining the invention itself with another faculty. This is a design revision before player testing, not an observed increase in absorption. The easier Distance and Forgetting approaches remain so that this response is not a mandatory ritual on every route.

## Pure API and current state of implementation

The [model](../experiments/logical-mneme.ts) is `mneme-1`, self-contained and import-side-effect-free. The [mechanical screen](../results/logical-mneme-screen.json) is reproducible by running `node experiments/logical-mneme.ts`.

```ts
MNEME_VERSION
SCENARIO_IDS // ['orchard']
createMneme(scenario?, seed?)
observeMneme(state)
stepMneme(state, action)
previewMneme(state, action)
legalActions(state)
semanticKey(state)
outcomeProfile(state)
status(state)
screenMneme()
```

Types `State` and `Action` are exported. Actions are `{type:'combine', a:knownConceptId, b:knownConceptId}`; order is irrelevant. `status` remains `won` during an optional pursuit. `phase: 'finished'` and an empty legal-action list identify a completed optional ending. The seed is accepted for the shared harness but does not pretend to create random story variety.

The finite model has17 semantic states, five release states reached through three conceptual approaches, and six distinct optional endings. Taking History before choosing Distance or Forgetting leaves a gallery in the world; those routes are not counted as extra philosophical approaches merely because their paths are longer.

Exhaustive transition checks verify immutable inputs, retained parent concepts, exact immediate previews, stopping at every baseline win, and preservation of the baseline after every optional action. These are mechanical checks only.

`outcomeProfile` deliberately gives only one numeric dimension: whether the orchard can change. It supplies the full world and keeper consequences separately. Identity, grief, care and voice are not assigned arbitrary point weights to manufacture a Pareto tradeoff or a fun score.

## The first empirical question

Give a fresh logical player the encounter and ask it to form an intention. Do not instruct it to take History or require an optional continuation. After a baseline win, let it stop or choose a pursuit. A short report should identify what it wanted before the action, what Mneme's response changed, and what—if anything—it wanted next.

The strongest proposed evidence would be a concrete renewed intention tied to the same actor: “I freed the orchard, but now I want to give the keeper a way to remember without holding.” Merely selecting a legal epilogue, praising the prose, or reporting that it would continue in general would be weaker evidence.

The key risks are also concrete. A player may treat this as an obvious story menu, find the phase restriction artificial, see Mneme as a scripted explanation rather than an opposing mind, or enjoy reading while finding combination incidental. The world is intentionally too small to demonstrate sustained absorption. It is large enough to find out whether this particular sequence creates one desire to act again.
