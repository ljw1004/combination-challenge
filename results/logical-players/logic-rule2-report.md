# Experienced abstract relations revision test

This is an AI play report, not evidence of human enjoyment. I previously completed relations-1 A/B/C, so these are experienced-player observations. For play I used only `node experiments/logical-play.ts`, without reading source, docs, saved sessions, designer material, or evaluator output. I wrote no solver. Every committed action included a prediction. No previews were needed.

| Session | Scenario | Condition | Result | Combinations |
| --- | --- | --- | --- | --- |
| logic-rule-d | complete-coalitions | experienced-after-rule-a-b-c | won | 3 |
| logic-rule-e | essential-anchor | experienced-after-rule-a-b-c | won | 3 |
| logic-rule-f | neighboring-links | experienced-after-rule-a-b-c | won | 4 |

## Do they require a different relation?

Yes. These are different relations, not renamings of the earlier threshold factorization.

- **D:** Only AB and CD are sufficient pairs. Cross-pairs reject. I constructed `(A AND B) OR (C AND D)`. This removes the entire cross-pair branch from my earlier two-of-four construction.
- **E:** Every accepting case contains A. With A present, either B or jointly C,D supplies the other requirement. I constructed `A AND (B OR (C AND D))`. The essential input and unequal alternatives introduce a different, asymmetric relationship.
- **F:** The sufficient pairs are AB, BC, CD, forming a path. I constructed `(B AND (A OR C)) OR (C AND D)`, factoring the two links sharing B.

That structural variety is a real improvement over merely moving echo columns. The old complete plan does not solve these tables unchanged.

## Actual thinking versus execution

All three complete constructions were apparent before my first action. D's title and goal description directly suggest complete coalitions; two accepted pair rows identify the coalitions. E's description supplies the essential-anchor / direct-support / joint-substitute grammar; the accepted rows make A, B, and CD easy to assign to those roles. F's title suggests the path, and the three accepted pair rows confirm it. I then checked the larger cases mentally for consistency.

F offered the clearest concrete construction choice: factor AB and BC around B, or factor BC and CD around C. A third alternative is to build all three pair conjunctions and join them. These produce the same accepted worlds, and there is no game consequence for choosing one over another. I chose factoring to express the relation compactly, not because the rules make it valuable.

The public tables did not feel like arithmetic over sixteen unrelated rows. The task was recognizing the minimal sufficient sets and writing a small AND/OR expression. However, once that method is known, it is a reliable general procedure: combine the inputs in each minimal sufficient set, then combine those branches with EITHER. Factoring can shorten that transcription but is optional. This procedure means a new truth table need not create a new kind of play, even when its relation differs.

There were no mistakes, failed predictions, recovery moments, or occasions to revise a partial plan after feedback. The actions confirmed an already complete answer. All meaningful thinking occurred before the first combination, and execution did not reveal a new decision.

## Comparative judgment

These are better *varied examples* of small Boolean construction puzzles than the echo-remapping sequence. They were also too obvious for this experienced player. This judgment is not based on their smaller action counts: a three-action puzzle with a surprising decomposition could be worthwhile, and seven actions of transcription need not be. Here the descriptions substantially supplied the decomposition, the tables confirmed it, and no unresolved choice remained during construction.

I would inspect one more genuinely different structural puzzle out of curiosity, but would not voluntarily commit to a sequence of these after this pass. Merely adding more minimal sufficient sets or changing which letter is indispensable would likely increase table inspection and transcription. The current evidence supports a repertoire of short logic exercises, not yet a sustained combination game or a demonstrated appetite for another round.
