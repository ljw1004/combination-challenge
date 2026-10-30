# Mneme 2: the keeper wants something unassigned

Separate designer iteration, version `mneme-2`. [Mneme 1](logical-mneme.md) and its captured observations remain frozen.

## What the first play changed

The fresh Mneme-1 player chose History and Open History. It appreciated that the keeper used History to extend control, and that the ended instant was not restored. It then stopped at the baseline win. The explicitly described epilogues supplied no new desire. The second combination enacted a value choice the player had already made.

That is narrative appreciation, not evidence of renewed intention. Adding more described endings would answer the wrong problem.

## The one experiential change

Release now gives the keeper an intention of his own. He does not wait to receive Legacy, Elegy or another supplied ending. He takes a blank page from the account, folds it away from the creator, and begins an unrequested experiment.

After Open History he asks:

> You left my future unwritten. What if I choose something you did not want?

The question is no longer only “what beautiful ending shall I make?” It is “has this person ever wanted anything except what he was made for—and what is he trying to choose now?”

The player may stop with the orchard permanently free. If the player wants to approach the question, combining it with Voice gives the keeper his own voice. Its first use is a refusal: **“Not yet.”** Voice is not an instruction to answer the creator. This changes the meaning of giving a faculty: the recipient can use it outside the giver's intention.

The player can then seek Testimony through Memory, learning something of the inherited purpose, or offer Distance, allowing the keeper a private life whose content the creator does not possess. Testimony can combine with Doubt so that an inherited account need not settle a next act. The keeper then attempts a purpose the player did not supply.

The existing release routes give that question different histories. The keeper who missed a fruit can ask whether he too may have a place outside another's account. The unnamed presence can ask whether receiving another purpose from the creator would make it its own. No new materials, countdown or completion reward is involved.

## What is public, and what is not pre-spent

Every legal combination and its functional effect is listed. A voice permits an answer or a refusal. Memory permits an account of an inherited wish. Distance creates a boundary around a private life. Doubt prevents that inherited account from having the last word. These functions remain explicit before commitment.

An unperformed personal revelation is not an output label. The preview does not supply the keeper's exact future words or the content of his chosen purpose. Those are facts revealed when he responds, rather than another secret recipe to discover. The implementation's private intention is deterministic and authored; it is not an autonomous language-model character.

This iteration changes the source of the optional pursuit and stops spending its character revelations in the initial epilogue descriptions. These changes are linked in the design, so a later comparison cannot attribute any renewed curiosity to character agency alone. The independent critic should consider simple information withholding as a rival explanation.

## The small trajectory

1. Player forms an intention about freeing the orchard.
2. An invention changes the keeper's relation to it.
3. The keeper initiates a private question using the freedom that was created.
4. Player may stop, respect the privacy directly, or seek his voice.
5. The voice can refuse, replacing a supplied task with a relationship the player cannot simply command.
6. Further testimony may change how the player understands his question.
7. A final combination permits an own act or leaves its content beyond the creator's account.

The final choice is not a test of getting every answer. A private ending can be complete while the creator does not know its content. The orchard remains free at every optional step. There are no optional actions needed to validate, repair or protect the earlier win.

## Frozen implementation

[Model](../experiments/logical-mneme-2.ts), [mechanical screen](../results/logical-mneme-2-screen.json).

The API mirrors Mneme 1: `MNEME_VERSION`, `SCENARIO_IDS`, `createMneme`, `observeMneme`, `stepMneme`, `previewMneme`, `legalActions`, `semanticKey`, `outcomeProfile`, `status`, and exported `State`/`Action`. The scenario is `orchard`. Actions remain logical combinations with `a` and `b` concept IDs, in either order.

The baseline status is `won`; legal optional actions remain until `phase: 'finished'`. The model has37 semantic states. Twenty finished path states include repeated ways of granting the same private boundary; they must not be described as twenty different endings. Semantic differences in knowledge and approach do not automatically imply different pleasures.

Exhaustive checks pass for input immutability, retained parents, baseline preservation, and not exposing future personal speech in optional previews. TypeScript passes. No UI work was done.

## Proposed test

Do not require the player to follow the keeper's question. A baseline stop is still valid. Ask it to report what it currently wants, then choose whether to stop or make another combination. If it continues, inspect the actual renewed intention: curiosity about the keeper, desire to hear his reason, care for his autonomy, or simple compliance with an exposed branch are different explanations.

One optional action would not establish absorption across a long game. The narrow prediction is that an independently initiated, unanswered intention offers more to pursue than the fully described epilogues did. A player seeing another obvious dialogue tree and stopping again would be useful direct counterevidence.
