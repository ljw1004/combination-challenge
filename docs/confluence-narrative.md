# Confluence: a world learns what its paths can mean

Narrative/content implementation for the long logical game. The [story module](../experiments/confluence-story.ts) supplies places, recurring actors, five movements, one-time scene anchors and state-sensitive event prose. The [core model](../experiments/logical-confluence.ts) owns the rules, propagation, intentions, actions and actual consequences. Earlier Mneme and constitution prototypes remain frozen.

This is not two hundred prompts. It is one country whose old constructions acquire new uses, whose people remember what happened there, and whose central question becomes harder to settle as they acquire more agency.

## The promise

The first spring, unfinished orchard, listening hollow, unnamed village, reed margin, maker's hearth, archive terraces and meeting clearing persist through the whole course. A path first made for water may later conduct a voice or authority. A boundary that protected a place may later decide who can hear it. A construction's history belongs to the world, not merely to a completed level number.

The narrative asks: **when does making a world give way to making room for another author?** The player can pursue a useful physical project, understand a particular person, protect a voice, form a common purpose, or help a purpose become independent. Those ambitions need not all agree.

## Three recurring intentions

**Mneme, at the archive, values continuity.** He begins by wanting an account of the first passage. Living descendants complicate what continuation means. Exact records complicate custody. Earlier exposure or compulsion should make him remember that an account can be used against the person it records. In the final movement he can want to choose something about his own account, rather than only carry out his first purpose.

**The Judge, at the meeting clearing, values legibility.** He first distinguishes protection from isolation. A living continuation requires a distinction between difference and error. A public voice requires identifying the speaker. Authority then confronts him with the difference between a delivered instruction and agreement. His later question is how to recognize a will he did not author and need not share.

**Ilex, at the kiln, values authorship.** He first wants to make a path, then finds that a path invites things he did not specify. Life can outgrow his design. An exact voice fixes a mark at his hearth and gives the long game a specific mystery: **did he author that first mark, or was he only where a received instruction became fixed?** Later compulsion, adoption and self-chosen purpose can change the meaning of that event. The answer should be enacted through the world, not supplied as a paragraph unrelated to play.

These are not three isolated personal quests. Mneme wants to keep the mark's account. The Judge wants to know who spoke through it. Ilex wants to know where his own act begins. The same intervention can therefore matter to all three for different reasons.

## Five qualitative movements

| Movement | Player's possible ambition | New meaning of combining | What continues |
| --- | --- | --- | --- |
| **A bed for the river** | Make a living place possible without destroying a margin | A link conducts matter; a form can protect or exclude | Every later carrier inherits this geography. |
| **What returns changed** | Create conditions for life that need not remain a copy | A living process translates or continues a carried property | The maker's design can acquire descendants he did not specify. |
| **An account of the water** | Let a voice survive, be heard, or remain in chosen custody | An account can be exact, living, silent or public | The first mark becomes a contested origin rather than a new unrelated puzzle. |
| **The word must** | Make cooperation possible without mistaking receipt for agreement | A charter or promise changes a lasting relation | Earlier records and routes become evidence or instruments of authority. |
| **A world with another author** | Help or constrain a purpose that was not chosen for the actor | A familiar faculty can grant agency, preserve a commitment, or carry compulsion | The world can continue through intentions that are no longer only the player's. |

The core's milestones are caused by discovery or contact, not by a move count. These movements must not reset earlier world facts. They change what the persistent world can carry and what its inhabitants can do with it.

## Why these scenes might carry intention

The small Bell-orchard follow-up provides a limited positive signal: a previously satisfied player adopted a particular joined-names mystery and made elective combinations to pursue it, then chose closure. That suggests a concrete unanswered question can motivate action. It does not show that a long sequence of revealed facts will sustain interest.

Confluence therefore does not merely ask the player to uncover Ilex's predetermined biography. The first-mark question can become a player-authored ambition: arrange a route that distinguishes exact instruction from living continuation; protect its custody; let a recipient adopt a purpose without being compelled. Earlier mechanical choices can alter later relationships or revelations. The player is changing the conditions under which an answer could be true.

The recurring questions are specific enough to be remembered: what did the first protective margin exclude; whose voice fixed Ilex's mark; did the village agree to a rule or only receive it; what would Mneme choose outside the account he was made to keep? They should arise from actual events, not be appended after every command.

## Content contract and factual discipline

The story module implements the core's exported interfaces. It exports:

- `CONFLUENCE_PLACES`: eight persistent places.
- `CONFLUENCE_ACTORS`: the three actors, with IDs `mneme`, `judge` and `maker`, their homes, values and initial voices.
- `CONFLUENCE_CHAPTERS`: five phase descriptions and unresolved questions.
- `CONFLUENCE_STORY_SCENES`, also exported as `STORY_SCENES`: one-time narrative anchors.
- `actorIntentFor(actorId, phase, facts)`: public intention text conditioned on the phase and earlier consequences.
- `narrativeFor(event)`: literal event detail plus an applicable character reaction or conceptual consequence.

The core supplies event kind, phase, place, actor, carrier, literal detail and facts. Available facts include protection, exposure, compulsion, exact/living memory and river contact. Earlier exposure and compulsion can change later reactions; the core should also make a remembered consequence alter at least one actual actor policy or willingness. Dialogue alone must not be called autonomous mechanical agency.

When the core reports a literal detail, that detail anchors the prose. The story does not invent flow, permission, damage, consent or a policy change. A character may express a question or intention without that sentence itself changing the world. Exact memory, living memory and compelled adoption produce different responses. Ordinary unchanged events receive their literal result without a manufactured revelation.

One-time scene IDs must be persisted by the core. A single transition should not dump the whole chapter's scenes. The complete table is a repertoire of possible anchors, not a count of experiences that every route will contain. Several possible scene conditions may never occur in a particular play.

## Pacing a long logical course

The target of roughly180–240 opportunities must be supported by actual continuing world interventions. The story data is not evidence that the target has been met. The model must offer enough coupled projects, characteristic actor responses and state-sensitive opportunities for an actual long diagnostic course.

The intended rhythm alternates devising, making, watching, understanding and choosing a next ambition. A large construction can unfold over several familiar combines. A short revelation can make an old route matter differently. Relief and quiet appreciation are part of the rhythm; a success need not always be punished with another emergency.

Several ambitions should remain live rather than forcing one marker after another. A player may pursue the maker's authorship, the archive's custody or the village's relationship to authority. They must have room to author solutions and choose priorities. Unrelated confirmations, repeated deliveries in settled states, and reskinned truth tables do not fill the long-game requirement.

The final movement need not resolve every question. A world capable of continuing is a meaningful endpoint. A player can also choose a sufficient earlier stopping point. A directed long test and a voluntary-continuation test answer different questions and must be recorded separately.

## What the long play must establish

The evaluator should follow particular intentions across time: a prior construction, an actor's response, what the player noticed, and the next actual action. It should look for renewed curiosity about these people and for consequences the player cares to address, not infer absorption from the number of chapter openings printed.

The largest narrative risks are repetitive philosophical commentary, an actor whose personality is only a decorative name, mysteries answered only by reading, and a long routing task carrying insufficiently changed stakes. Earlier causes need to remain visible. Beauty and conceptual resonance should enrich the played relation to the world, not excuse an absence of one.
