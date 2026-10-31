# Bell Orchard 2: a question worth carrying forward?

Experience hypothesis before player testing. This separate `bell-orchard-2` wrapper uses the frozen first world's functional laws; it does not modify Bell Orchard1 or its fresh-player report.

## The observed problem

The first fresh player saved the orchard and chose **zero optional combinations**. They valued exact names privately whispering in a safe, connected valley. That quiet ending is meaningful and must remain valid. However, the bell created no further ambition for that player. Making its voices public seemed to add trouble without a valued reason.

The revision asks whether **a specific unresolved relation matters more than a general invitation to preserve or broadcast memory**. This is a designer's speculation to test, not a correction to the player's preference.

## One small story mechanism

Mara was a child of the drowned city and now lives beside the survivors' orchard. When diverting water exposes the bell, she recognizes her mother Anwen's name joined to Rook's. Mara was taught that Rook shut the city gate and abandoned the people behind it. Why are their names joined?

The question is seeded by the initial success in the same world. It is not another required target, a point reward or a forced repair. The player can leave it quietly beside the bell and finish.

The existing transformations become different ways of knowing:

- **Air** reveals people speaking to one another. Rook and Anwen held opposite ends of the ferry line while children, including Mara, crossed. It also makes those voices public, drawing water toward their listeners under the unchanged magical law.
- **Stone** reveals the ordering of the inscribed record: those who held the line and those who crossed. It preserves an exact account while closing the sounding bell.
- **Seed** makes relationships visible as growing branches. Mara recognizes herself sheltered between Anwen and Rook, but the grove supplies no exact transcript of the gate or crossing.

These are not identical plot tickets attached to arbitrary recipes. The type of understanding is tied to how the combination transforms memory. Hearing an exchange, reading an ordered record and recognizing a living relation can support different intentions. The same world consequences remain, including the choice between exact public voices, safe river contact, durable silence and living transformation.

Facts already learned stay learned. If roots later transform the sounding record, neither Mara nor the player is made to forget its story. Preserving an original source and retaining knowledge gained from it are different things. The game does not manufacture a cost by imposing amnesia.

## Preview policy

Bell Orchard1's exact previews printed the passages that commitment would reveal. Bell Orchard2 previews show every functional state change, prerequisite and new concept. They also identify the **kind** of discovery offered—voices, a record or relationships—but reserve exact dialogue and findings for commitment.

This is a change in the information revealed by performing an action, not a return to hidden recipe legality. All combinations and their material consequences remain public. A preview says that public voices will flood the village; it does not spend the new spoken exchange in advance. A reader can still make an informed decision about that consequence.

The narrative hook and this disclosure policy both change. One fresh comparison cannot isolate their causal effects. Do not attribute a changed response to either factor alone.

## What should the next play reveal?

The critic should distinguish:

1. A renewed intention to understand Mara's joined names, followed by a chosen way of learning.
2. An interest only in reading the next passage, with combinations functioning as reveal buttons.
3. A consciously preferred quiet ending, despite understanding the question.
4. A full plan formed before acting that the player still values enacting.

No one must choose Chorus. An archive or grove may be the meaningful continuation, and declining them remains legitimate. The test is whether the initial act gives this player something they want to do next, not whether they consume more content.

Functional forecasts, known story facts and current open questions are separate fields. The observer never labels a player's interest or understanding as measured. Facts are not objectives in the outcome profile.

## Frozen API

```ts
BELL2_VERSION // 'bell-orchard-2'
BELL2_SCENARIO_IDS // ['the-bell-orchard']
type State
type Action // same combine/finish grammar as Bell1
createBellOrchard2(scenarioId?, seed?)
observeBellOrchard2(state)
stepBellOrchard2(state, action)
previewBellOrchard2(state, action)
legalBellActions2(state)
bellOutcome2(state)
bellSemanticKey2(state)
endingBellOrchard2(state)
replayBellOrchard2(actions)
screenBellOrchard2()
```

The state holds a frozen Bell1 world plus learned story facts, a current response and a versioned status. A new version is required for later changes once play starts. No UI work or broad story generator is added.
