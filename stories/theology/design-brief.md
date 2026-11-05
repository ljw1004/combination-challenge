# Theology: Disputed Questions

An educational combination story for curious high-school and adult readers. Reconstruct theological arguments through concrete examples, understand why someone could find them persuasive, and discover what a reply answers or leaves open. The player need not share any writer’s faith. The [shared authoring guide](../../docs/story-authoring.md) and [evaluation method](../../docs/fun-and-evaluation.md) govern development.

## Let the arguments earn their force

Present the dilemmas as live questions. A reader familiar with a tradition’s conclusions but unfamiliar with its history should be able to find an opposing argument reasonable before encountering a reply. A Catholic reader finding the Cathar argument persuasive, then reconsidering it through Aquinas, would be a meaningful possible outcome. It is a design hypothesis, not an observed result or a requirement that every reader reach the same judgment.

Give each position its intelligible premises and stakes. Let replies expose a particular weakness or make a useful distinction; do not announce a winner through labels, narration or foreknowledge of the next chapter. Aquinas’s fire example challenges the need for a separate evil source without by itself settling a knowing creator’s responsibility. Distinguish reconstructing a belief from proving it, and preserve substantial disagreements among the sources. Identify the Book of Two Principles as a Cathar text without treating it as the creed of everyone called Cathar.

Preserve every combination input. Examples, premises and questions remain available beside the conclusions they support; interpreting a case does not remove its evidence. Each combination adds a distinct result card so the discovery is visible, rather than replacing a similarly worded card in place. Use default preservation, adding `[preserve]` only where the specification's single-use lint requires an explicit fate. Chapter carry selects the next desk's working set.

## Two ways to understand the story

Item titles must communicate in plain English to someone who skips readings. Wonders must communicate to someone who combines blindly and reads only the resulting cards. Neither layer should depend on reading the other. Preserve necessary theological distinctions; explain unfamiliar terms where they contribute something ordinary language cannot convey as accurately.

Every chapter heading and opening begins with person or speakers, place, and year. Use approximate dates and explicit uncertainty where the sources require them. These are reading settings and source contexts, not assertions that compared writers met. The ending returns to the contemporary reader’s desk. The opening orientation line is italic and appears after the background image, because the browser does not generate it from the chapter heading. At the first chapter of a new perspective, briefly introduce who the person is and the relevant historical situation, then give a hook for the question occupying them. Subsequent chapters in the same run keep the orientation line but advance the thought without repeating the biography. A return to a previous voice needs only a brief reminder and its new question. Do not turn illustrative examples supplied during discussion into historical claims.

On a speaker’s own desk, omit that speaker’s name from their claims and examples. Use `Eg.` for examples. When the player moves to another identity, use the specification’s `from chapter` metadata to attribute the earlier items retroactively, such as `Aquinas:` or `Aquinas example:`. A return to the original speaker restores the local wording. Retain names immediately for borrowed quotations and comparisons that need to distinguish speakers. An example’s later attribution identifies the desk where it was considered; invented situations remain invented rather than becoming historical quotations.

Write wonders as natural reasoning at the current desk. State that speaker’s premises directly, credit inherited or opposing ideas fluently, and let the conclusion follow from the argument. This perspective rarely needs first-person narration: avoid autobiographical self-report such as “I read”, “I hold”, “I extend”, “my argument” or a council’s “we affirm”. Do not replace it with a narrator reporting the current speaker’s beliefs back to them. First person is appropriate in attributed quotations and hypothetical human examples, such as “I know I should return my neighbour’s stolen meal”; this is a supposed person, not Augustine recalling his own life. Ordinary inclusive language about human experience is also natural where it is clear. At a joint desk, name the differing positions and state genuine agreement directly. This is an educational reconstruction in modern English, not a quotation or an invented historical meeting.

For each synthesis, normally open with a motivating question in its own paragraph. Restate the essential contribution of each input, then explain the result or remaining disagreement with paragraph breaks. Find the essential work of each part: the question names the problem, the input paragraph supplies the needed premises or observations, and the synthesis explains what follows. Cut repeated framing, commentary about the act of reasoning, and qualifications that add nothing. Keep limits that change what the argument establishes; simplify their wording instead of deleting the distinction. Prefer short, concrete sentences and explain necessary technical terms in plain English. A reader should understand the comparison without opening either ingredient. Primitive readings explain their example or premise without pretending to synthesize two inputs. Finish each reading with the item’s local title in a separate italic paragraph. The authored wonder keeps its original desk’s voice and closing title when a board title later changes; foreign claims retain their attribution within the prose.

## User-supplied format examples

These sketches preserve the user’s specific examples. They illustrate form, not historical geography, chronology or theological claims. The user explicitly described their content as nonsense. The bracketed comments explain authoring intent and are not proposed player text.

### A wonder from the current desk

```markdown
What happens when someone eats Communion bread without trusting Christ's promise?

The metaphysics means A [this is from something that I produced, so I don't qualify who said it]. But Luther says that B. [this came from someone else so I do credit it]

There must be a form of transformation that doesn't affect taste. Let's call this accident and essence.

*Essence vs accident in Communion*
```

The question has its own paragraph. Previously made ideas are restated fluently from the current speaker’s perspective, with credit for ideas from another voice. The conclusion is the current speaker’s thought, and its italic item title lets the player recognize the result. Paragraph breaks separate those functions. This is an archetype for synthesizing ideas, not a rigid template for every reading. The illustrative “accident and essence” wording is not a replacement for the manuscript’s sourced account of substance and accidents.

The earlier structure-only sketch was:

```markdown
What is the nature of good?

Augustine said it was this. Aquinas said it was that.

The answer must be that evil inhabits the forest, but only when it's not raining, due to its nature as a vagabond.

*Evil inhabits the forest*
```

It shows motivation, restated inputs, an expanded synthesis and an italic conclusion. The later desk-voice requirement above refines its reporting voice: do not report the current speaker’s own ideas back to them as someone else’s claims.

### The first chapter from a new perspective

```markdown
*Zwingli, Marburg Switzerland, 1521*

Zwingli has been corresponding with Martin Luther, and is interested in the new Protestant theology.

He has been thinking about the role of statues in churches.
```

The italic line supplies name, place and year; the next paragraph introduces the person and relevant context; the last gives a hook for their thinking. Verify the actual person, place, date and situation when writing the story. The user emphasized the insistence on a year with Melvyn Bragg’s question, “but what year?”

For a subsequent chapter from the same person, the user’s example moves straight into the next thought:

```text
Zwingli takes his ideas further: if statues must be destroyed, then maybe all iconography?
```

Keep the orientation line, but do not repeat the person’s introduction.

### Local and inherited item titles

The user’s own-desk example is `Eg. the craftsperson works through it`. After moving to someone else’s desk, it becomes `Aquinas example: the craftsperson works through it` through `from chapter` metadata. The final wording should name the tool where “it” would be unclear; the example establishes when attribution appears, not a requirement to retain an ambiguous pronoun.

## Natural reasoning: the user’s wording examples

Use “But what about the principle that…” instead of “I read that saying alongside…”, and “This extends to sources of good and evil” instead of “I extend the image…”. The thought belongs to the desk without becoming an autobiographical account of thinking. The user’s permitted first-person example, “I know I should return my neighbour's stolen meal”, voices a hypothetical person confronting a duty.

Applied to the tree example, the requested motivation / inputs / synthesis / italic conclusion pattern reads:

```markdown
Does the good tree’s fruit tell us about the source of evil?

Matthew warns against false prophets: “A good tree cannot bring forth evil fruit.” But what about the principle that no evil can come from a wholly good cause?

The image extends from false prophets to the sources of good and evil: evil cannot be the fruit of a wholly good cause.

*A good tree cannot bear evil fruit—nor a good cause produce evil*
```

This is an application of the user’s wording correction, not a historical quotation. The earlier format sketches remain above: occupying a perspective does not require frequent “I” or “we”. Audit every wonder for both voice and unnecessary length, including primitive explanations and readings shared by alternative recipes. Do not impose a word limit that removes an essential input or makes the conclusion harder to follow.

## Editorial process and evidence

Apply the shared [iteration process](../../docs/story-authoring.md#develop-a-story) and [intellectual synthesis and changing perspectives](../../docs/story-authoring.md#intellectual-synthesis-and-changing-perspectives) technique to comprehensive wording passes. The [evaluation method](../../docs/fun-and-evaluation.md#reviewer-independence) owns reviewer independence and the [verification policy](../../docs/engineering.md#verification-records) owns retained evidence. The following choices apply that process to Theology:

- Cover every opening, local/inherited title and reading, including primitives, alternative recipes and returns to an earlier desk. Keep the two reading paths and natural reasoning voice specified above.
- Use fresh **Terra** readers for the separate title-only and card-only assignments. Supply the current speaker context and the layer under test, following the shared protocol; include authored italic conclusions in card packets. Cover the complete inventory, then use fresh isolated probes for remaining ambiguities. Do not lead readers toward a preferred theological verdict.
- Preserve deliberate `Eg.` labels, local italic closing titles and unprefixed current-desk claims. An informed source/argument review checks the actual recipes, inherited attribution and limits of each analogy against the cited primary texts. Neither brevity nor criticism alone justifies deleting a necessary premise or qualification.
- For wording-only changes, preserve parsed gameplay structure, check chapter-dependent names and exact italic closing titles, run lint and complete replay, and inspect affected phone-size boards and reading dialogs. Record the version, supplied context, adopted fixes and limits in the [active Theology study](../../projects/theology-study/README.md); dated outcomes do not belong in this brief.

These wording probes assess understanding, not sustained play or human enjoyment. Run chapter playtests under the shared method when making claims about the playing experience; retain their actual tested versions rather than applying old scores to new prose. Whether players first accept and then reconsider an argument needs a sequential reading or playtest that records their response before revealing the reply. Do not instruct readers to be persuaded, impersonate a religious participant or infer Catholic readers’ reactions from an AI review. Clarity checks and legal completion do not measure that effect.
