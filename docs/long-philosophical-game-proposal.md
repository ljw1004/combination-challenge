# A longer game: The Unfinished Atlas

Designer plan after Mneme 2. This is a proposed scalable model and content structure, not a claim that a long game has been built or played. The current small encounter remains a probe of one renewal of intention.

The owner's target is approximately30–40 minutes at one decision opportunity per10 seconds: roughly180–240 opportunities. That is a design target for content and pacing, not an observed conversion from AI commands to human minutes. A long logical playtest must be conducted once the model exists.

## The continuing world

The player creates a world whose inhabitants gradually acquire faculties. Mneme begins as its Memory. A second recurring actor, an exacting Judge, wants the world to be intelligible. A third, a restless Maker, wants to bring something into being that was not already authorized. Their wishes are coherent but cannot all be completed once and for all.

The player is not changing unrelated puzzle boards. The orchard, the first archive, a growing settlement and the unfinished sky remain in one world. A promise made in the orchard may later govern the settlement. A remembered person can dispute the Judge's account. A creation that frees one actor may give another a way to bind it.

The central question changes over the course of play: **what does it mean to create something that can cease to belong to its creator?** This should be a question enacted through causal interactions, not a theme announced above ordinary inventory puzzles.

## A reusable response engine

Each persistent actor has:

- a public current purpose and an observable intended act;
- capacities acquired from inventions;
- commitments and relationships to particular world objects or people;
- memories of the player's consequential acts;
- private personal conclusions that are disclosed through the world's explicit channels rather than omniscient previews.

Each world object has a type and properties: a record can be complete or revisable, a voice can be compelled or independent, a promise can bind a relationship, a living pattern can continue or transform. A combination is a typed relation between two actual concepts or objects. Known functions stay explicit.

After a combination, only actors whose possibilities or commitments changed respond. Their response follows the purpose and capacities they currently have. It may repurpose the invention, refuse an intended use, create another relationship, or expose a conflict. It should not be a generic one-step march triggered by every command.

The implementation should resolve a bounded causal response and stop at a new live question. Deduplicate unchanged intentions/effects so that an already settled response does not demand upkeep. The cap is an engine safeguard against loops, not a resource the player spends.

## Six qualitative movements in one causal history

These are changes in semantics, skill and consequences. They are not six sets of renamed recipe nouns.

| Movement | What combining means | Continuing consequence |
| --- | --- | --- |
| First forms | Give an elemental property a stable form; join forms into something that can act | The orchard and its first keeper come into being; the creator learns that stability can become imprisonment. |
| Before and after | Change the relation between a remembered state and a possible future | Mneme's response creates history, gaps and beginnings; his first private act becomes part of the world's history. |
| Accounts and judgments | Make an observation into a claim, relate claims through proof, doubt or interpretation | The Judge can distinguish things but may turn a person's account into a verdict. Old records and new testimony can conflict. |
| Shared wills | Bind or separate commitments among people and institutions | Cooperation becomes possible; a common purpose can silence a local need. The same actors can consent, resist, or exploit the institutions created. |
| Authors and others | Give capacities whose users can choose a purpose or withhold its content | The Maker begins projects the player did not specify. The question becomes which conditions to create, rather than which outcome to order. |
| An unfinished world | Recombine earlier forms, records, laws and relationships while releasing claims of final control | Earlier inventions return in changed roles. The ending concerns a world capable of continuing, not a catalogue that must be completed. |

## Content needed for a real long logical test

The six movements should each support approximately30–36 consequential world interventions, producing a total capacity of180–216 along a substantial course. This is a work estimate, not a demand that every play perform every intervention. An elegant solution must not be padded to meet a length target.

To make that capacity real, each movement needs several interwoven pursuit cycles involving the recurring actors. A cycle is roughly:

1. a visible, unresolved intention;
2. a player construction or change of relationship;
3. a particular actor's consequential response;
4. a new possibility, difficulty or disagreement caused by that same act;
5. a player follow-through, change of intention or chosen stopping point.

Three isolated three-action puzzles do not satisfy this requirement. Nor does making a player click through more text. The content inventory must name what each intervention can change, which actor will use it and which prior world fact explains the next pursuit. If no such causal link can be specified, the proposed intervention is a candidate for cutting.

The campaign should provide several live intentions at once, so continuing is not just following a new task marker. A player may answer Mneme's private ambition, address the Judge's public mistake, or give the Maker conditions to test a dangerous idea. A choice can leave another relationship unresolved without being a race against a timer or a shortage of action credits.

## What remains familiar and what develops

Established constructions become first-class reusable concepts. Do not require rebuilding History or Voice to use them later. The same combination may change meaning when its subject changes: Memory + Voice first makes a record speak; later it lets a person choose which memory to tell. Distance first detaches an observer from an object; later it gives the created person a boundary from the creator. The functional relation remains coherent while the stakes change.

Irreversibility should arise from actual events: a secret disclosed cannot be undisclosed, a person whose purpose is replaced may not be the same person, a binding promise can outlast the occasion that made it sensible. Inexhaustible access to concepts does not erase those world consequences. No inventory or production system is required.

## Implementation plan for coordination

1. Preserve all small versions and their play records. Do not silently replace their observations with the longer game.
2. Build a new pure world module with actor purposes, typed relations, causal events and persistent objects. Keep the common CLI, hashes, previews and intention annotations.
3. Implement one continuing vertical slice across the first two movements with enough actual interactions to expose whether the response engine renews intention. Keep the actor's behavior inspectable and deterministic before adding hidden personality detail.
4. Extend the same saved world through all six movements. Content should be explicit data and small rule functions, not a single enormous narrative switch.
5. Run an actual long logical course. Preserve every intervention and actor response. Do not count the outline, reachable theoretical branches, or cosmetic renamings as a played long game.

Root should assign world-engine ownership, actor/content ownership and independent critic ownership before parallel implementation, because all three touch the same causal contract. I can implement one actor's continuing purpose/response rules and associated content after that contract is agreed.

## Long-test protocol

Separate two questions. A directed completion run tests whether the game actually supports a coherent course approaching180–240 world interventions. A voluntary-continuation condition tests where a player would choose to stop. Forcing an agent to continue to a count is not evidence of appetite.

At natural chapter boundaries, record a concise current intention and one unresolved question the player cares about. The evaluator should trace it into the next actual action and response. It should inspect stretches that became routine, stale disputes, ignored optional pursuits and moments where the player changed its mind. Do not ask for a new dilemma on every action; an absorbing plan can unfold over several interventions.

The long play must retain one continuing memory of this world. Restarting a fresh agent at each chapter tests onboarding into six fragments, not narrative sweep. Independent fresh agents can play alternate courses or shorter controlled sections, but that evidence is different.

Success would not be merely completing a long script. The desired evidence is a chain of specific intentions renewed by this world's responses: what the player wanted, what it made, what an actor did with it, and what it then wanted to do. Beauty, personification and conceptual resonance matter to this account. Their value must come through the played world rather than be inferred from the designer's aspiration.
