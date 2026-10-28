# Connected journeys: research and design brief

Research pass: 27 October 2026. The campaign structure is unchanged by this research pass; the UI removal of carried-item narration is recorded separately.

The intended experience is tracing the evolution and cross-fertilisation of ideas. The core mechanical rule is that every chapter after the opening uses at least one element created in any earlier chapter, preferably several. Intertwined narratives can alternate: a rover chapter can resume an older rover thread while a garden thread waits. No explicit carried-items paragraph is needed or desirable. Historical places supply the setting; inherited problems, representations, practices and explanations supply the game structure. A chronological parade of self-contained exhibits does not meet that objective. Food needs the same continuity of purpose and discovery.

## What was collected and checked

The official [BBC In Our Time podcast feed](https://podcasts.files.bbci.co.uk/b006qykl.rss) supplied **1,116 entries with descriptions**, dated 15 October 1998–26 October 2026. Every entry in that retrieved feed was processed. This is not a certification that every original broadcast is included, or that every entry is an original episode: archive repeats and changed titles need deduplication. Episode broadcast dates are distinct from the historical dates of the subjects.

`episode-index.csv` contains titles, dates, programme URLs, matched names and topic families for all entries. `candidate-links.json` contains 250 lexical-similarity leads. Descriptions were analysed locally rather than redistributed. A reproducible script and feed hash are included. The method combines TF–IDF overlap with named-person and topic-family matches; it is a discovery aid, not an influence detector. It can miss an important connection and can propose a false one. A shared mention of Newton, for example, cannot establish which of two subjects influenced the other.

Specific connections were then checked against primary texts, historical research, scholarly editions and institutional collections. `verified-connections.json` records the exact claim, its relationship type, evidence and a separate gameplay proposal. “Supported” applies to that claim, not to every possible arrow between the named subjects.

## The game’s present continuity problem

The earlier inventory audit counted immediately previous goal products. That is too narrow for the clarified design. The strict audit now records whether a **combination in each chapter actually uses an object created in any earlier chapter**. It excludes raw cache supplies, previously created objects that merely sit on screen, and objects first made inside the current chapter. It permits arbitrary gaps between creation and reuse.

On the current authored routes, **18 of 86 non-opening chapters** lack such a reuse: 12 Atlas chapters, four Mars chapters, one theology chapter and one shoreline chapter. Atlas has ten connected chapters out of 22 non-opening chapters. Food already meets the mechanical rule across all three transitions: it reuses dough, then flour/dough, then flour. Further food work should strengthen purpose and useful combinations rather than fabricate links through immediately preceding goal items.

`created-thread-audit.json` lists the passing and failing chapters. The strict `audit_created_threads.ts` command exits nonzero while gaps remain. It is deliberately a separate research/content audit, not silently waived by the release build. The independent inventory audit in `thread-audit.json` remains useful for understanding transfers, but is not the acceptance criterion.

Explicit travel/carried-item paragraphs have been removed from the challenge popup. The connection must be visible in the player’s actions, not in an explanation of what inventory came along.

## Begin before Athens, with evidence rather than a universal origin myth

A strong early thread is Mesopotamian sky records, recurrent events and prediction. Historians document connections between divination, observation and mathematical astronomy, and transmission of Babylonian methods into Greek-speaking contexts. That permits an early puzzle about a recurring sky event whose records later become material for a different mathematical model. [Rochberg][babylon] [Schiefsky][greek-transmission]

The Antikythera mechanism offers a tangible later convergence: modern research connects Babylonian astronomical cycles with Greek geometrical/mechanical modelling. Its reconstruction has uncertainties; particular proposed details should not become unqualified game facts. [Freeth et al.][antikythera]

Do not treat “religion → reason → clockwork → modernity” as a single clean replacement sequence. Newton’s General Scholium places mathematical laws beside an explicit theological account, and Boyle connected mechanism with divine government. Predictive natural explanation and beliefs about ultimate agency can coexist. [Newton][newton] [Boyle][boyle]

Prehistoric objects can support carefully bounded inferences about practices; they do not reveal a single documented prehistoric creed. Fictional ritual scenes should remain clearly distinguished from attested beliefs. Greece can be an important thread without becoming the sole source of Indian, Chinese, Mesopotamian or Islamic achievements.

## Build several threads that meet again

| Thread | What is inherited and changed | A playable return or convergence |
|---|---|---|
| Sky records and models | Observation records, periods and methods of prediction enter different astronomical representations. | The old record must still be explained by the new model. A later mechanism makes an earlier numerical relation tangible. |
| Texts, argument and translation | An argument or distinction survives copying and translation, then changes under criticism. Arabic thinkers contribute new work; later Latin readers debate it. | A translated premise or concept becomes necessary for a later challenge, and a new objection sends the player back to revise it. |
| Mathematics and representations | Numerical procedures, geometrical reasoning and algebra can solve related problems in different ways. | Two previously learned representations meet in a problem neither branch conveniently solves alone. |
| Light and seeing | Optical models are transmitted and revised; instruments produce new reasons to question perception and authority. | Reuse an old ray diagram when a new observation contradicts part of the old account. |
| Population, variation and inference | A population argument from economics meets a naturalist’s observations of variation. | Darwin’s insight becomes a convergence of two earlier branches, not the automatic output of an isolated “evolution kit”. |
| Logic and switching | A formal calculus gains a physical application in relay design. | A logical expression made long before becomes usable in an engineering puzzle. |
| Food craft, observation and mechanism | A useful culture becomes a specimen; spoilage becomes a question; microbial and biochemical explanations develop. | The bread or brewing branch meets the optical-instrument branch, and the player gains a way to diagnose a failure. |

The researched bridges behind these examples are recorded individually below. They differ in kind: a translated text, an acknowledged reading, an engineering application, a contested interpretation and a useful comparison should not all be called “influence”.

### Connections with especially good evidence

- **Greek → Syriac/Arabic → Latin intellectual traditions.** Translation was an active intellectual process involving different languages and religious communities. Medieval Arabic philosophers developed theories which later Latin readers adopted, modified or disputed. [Greek sources][greek-arabic] [Arabic–Latin reception][arabic-latin]
- **Indian, Babylonian and Greek mathematics → work in the early Islamic world.** This is a documented broad crossroads; each proposed recipe-level claim about an individual algorithm still needs specific support. [Programme participant account][mathematics]
- **Ibn al-Haytham → later optics, including Kepler.** This is a researched transmission/revision thread, suitable for making an earlier optical model recur. It does not mean Ibn al-Haytham invented every later optical instrument. [Scholarly edition][optics]
- **Malthus → Darwin.** Darwin explicitly recalled the effect of reading Malthus in 1838 on his thinking about variations and struggle. His existing observations were the other part of the synthesis. [Autobiography][darwin]
- **Boolean algebra → relay design.** Shannon’s 1938 paper explicitly applies the calculus of propositions to switching circuits. It is a particularly clear case of two branches meeting. [Original paper][shannon]
- **Brewing/spoilage → microbial investigation → biochemical revision.** Pasteur’s industrial fermentation investigations connect practical problems and scientific tools. Buchner’s 1897 cell-free fermentation experiments then alter what a mechanism requires, without erasing the usefulness of the earlier microbial findings. [NLM collection][fermentation] [Buchner’s paper][buchner]

## The food journey: keep a purpose and a question alive

The existing four kitchens can be connected without claiming that every technique arose once, in a tidy line, or that the industrial snack is a superior endpoint. A promising continuing purpose is **food for a journey**; a continuing question is **what changes a dense mixture into the texture we want?**

| Existing chapter | Incoming problem and material | What the chapter contributes to what follows |
|---|---|---|
| Roadside hearth | Travellers need a meal from grain and fruit. Grind, mix and bake; press a drink. | Establish the dough, the harvest and a shared purpose. Some dough and fruit go onward; a dense flatbread raises the next question about texture. |
| Dairy and bakehouse | The next baker works with the same dough. A living starter changes its rise; a distinct dairy culture changes milk. | Preserve the culture as practical knowledge. Cream and the dairy’s processing tools lead to butter, while fermentation remains available rather than being discarded as obsolete. |
| Pastry workshop | The cream can become butter; the flour, dough and fruit are familiar. Compare fat mixed through a dough with fat kept in layers. | Material arrangement becomes an idea the player can reuse. Lamination and steam provide a different way to achieve lift from a fermented loaf. |
| Small cake line | The original purpose returns: make something that can be carried. Use the same flour, eggs, whisk, sugar and heating knowledge. | Whipped foam supplies another structure; filling and wrapping solve handling/transport requirements. The snack is a particular design for a job. |

The physical comparison of steam, trapped air and fermentation is supported by food-science teaching material; it is a **mechanistic comparison**, not a claim that puff pastry historically descended from a particular loaf. [IFST][raising]

For a longer food route, add preservation and spoilage problems so an effective inherited craft later meets microscopy, microbial control and enzymes. Useful craft knowledge often precedes an explanation of its mechanism. [Rockefeller University][biochemistry] The claim that a particular ancient person “accidentally invented” a food should not be fabricated from a modern just-so story.

## A requirement on every chapter

In development data, for each non-opening segment record:

1. The inherited item, idea, practical technique or unresolved problem.
2. Its actual earlier source in the player’s journey.
3. Why it is inadequate or useful in the next situation.
4. The historical relationship: transmission, adaptation, critique, synthesis, application, or analogy.
5. A source for a historical claim, and its confidence/qualification.
6. A player action in the next segment that makes the connection matter.

No player-facing paragraph should explain carried items. A notebook being present is not sufficient. A notebook must contribute evidence, a prior idea must acquire a new application, or an unresolved question must shape the next challenge. Cross-links should reach back beyond the immediately preceding chapter so that genuine synthesis is possible.

The future declarative model should represent historical relationships separately from physical ingredient lifecycles. Knowledge is not consumed because a manuscript token changes state. Build checks can reject disconnected segments, missing declared sources, and temporally impossible direct-influence claims, but cannot certify historical scholarship. A thematic analogy must never silently pass as a documented transmission.

## Preserve the gameplay that is working

The graph is development data, not a request for more HUD labels, explanatory toasts, or a compulsory educational overlay. Let a recurring object acquire a new use, let an old prediction constrain a new model, and let two familiar ingredients from distant branches solve a new problem. Keep spoken requests brief. The player should recognise a connection through doing something with it.

The next revision should follow selected, evidenced threads through a branching and rejoining graph. It should not simply reorder the existing episodes or add connecting sentences while their recipes remain independent. Save migration must follow stable stage identities before any reorder is published. The existing pleasant Elements progression is preserved. The connection research does not itself rewrite or reorder the shipped campaign; the small removal of inventory narration is a separate UI change.

## Selected In Our Time entry points

These are programme links from the retrieved official feed; the catalogue contains all 1,116 feed entries. They are research entry points, not proof that adjacent episodes causally connect.

- [Babylon](http://www.bbc.co.uk/programmes/p004y25j) — broadcast 2004-06-03.
- [The Greek Myths](http://www.bbc.co.uk/programmes/b0093z1k) — broadcast 2008-03-13.
- [Ptolemy and Ancient Astronomy](http://www.bbc.co.uk/programmes/b017528d) — broadcast 2011-11-17.
- [The Antikythera Mechanism](http://www.bbc.co.uk/programmes/m0024x0g) — broadcast 2024-12-12.
- [The Translation Movement](http://www.bbc.co.uk/programmes/b00dp4d8) — broadcast 2008-10-02.
- [Al-Kindi](http://www.bbc.co.uk/programmes/b01k2bv8) — broadcast 2012-06-28.
- [Avicenna](http://www.bbc.co.uk/programmes/b00855lt) — broadcast 2007-11-08.
- [Averroes](http://www.bbc.co.uk/programmes/p0038x79) — broadcast 2006-10-05.
- [St Thomas Aquinas](http://www.bbc.co.uk/programmes/b00mkd63) — broadcast 2009-09-17.
- [Indian Mathematics](http://www.bbc.co.uk/programmes/p0038xb0) — broadcast 2006-12-14.
- [Maths in the Early Islamic World](http://www.bbc.co.uk/programmes/b08dr5qt) — broadcast 2017-02-16.
- [Euclid's Elements](http://www.bbc.co.uk/programmes/b07881kn) — broadcast 2016-04-28.
- [Renaissance Maths](http://www.bbc.co.uk/programmes/p003k9hq) — broadcast 2005-06-02.
- [Optics](http://www.bbc.co.uk/programmes/b00774t5) — broadcast 2007-03-01.
- [The Scientific Method](http://www.bbc.co.uk/programmes/b01b1ljm) — broadcast 2012-01-26.
- [Baconian Science](http://www.bbc.co.uk/programmes/b00jdb6c) — broadcast 2009-04-02.
- [Robert Boyle](http://www.bbc.co.uk/programmes/b0460p63) — broadcast 2014-06-12.
- [Alchemy](http://www.bbc.co.uk/programmes/p003k9bn) — broadcast 2005-02-24.
- [The Laws of Motion](http://www.bbc.co.uk/programmes/b009mvj0) — broadcast 2008-04-03.
- [Laws of Nature](http://www.bbc.co.uk/programmes/p00546x5) — broadcast 2000-10-19.
- [Probability](http://www.bbc.co.uk/programmes/b00bqf61) — broadcast 2008-05-29.
- [Malthusianism](http://www.bbc.co.uk/programmes/b011zzh6) — broadcast 2011-06-22.
- [Darwin: On the Origin of Species](http://www.bbc.co.uk/programmes/b00gd3wy) — broadcast 2009-01-07.
- [Logic](http://www.bbc.co.uk/programmes/b00vcqcx) — broadcast 2010-10-21.
- [Alan Turing](http://www.bbc.co.uk/programmes/m000ncmw) — broadcast 2020-10-15.
- [Louis Pasteur](http://www.bbc.co.uk/programmes/b08q317p) — broadcast 2017-05-18.
- [Microbiology](http://www.bbc.co.uk/programmes/b007753d) — broadcast 2007-03-08.
- [Food](http://www.bbc.co.uk/programmes/p00547n1) — broadcast 2001-12-27.

## Sources

[babylon]: https://www.cambridge.org/core/books/cambridge-history-of-science/science-and-ancient-mesopotamia/C48D6E70188ED938863F479B692D465B
[greek-transmission]: https://www.mprl-series.mpg.de/studies/1/12/index.html
[greek-arabic]: https://plato.stanford.edu/entries/arabic-islamic-greek/
[arabic-latin]: https://plato.stanford.edu/entries/arabic-islamic-influence/
[mathematics]: https://research.manchester.ac.uk/en/clippings/bbc-radio-4-in-our-time-maths-in-the-early-islamic-world/
[optics]: https://press.uchicago.edu/ucp/books/book/distributed/O/bo156866715.html
[antikythera]: https://www.nature.com/articles/s41598-021-84310-w
[newton]: https://www.newtonproject.ox.ac.uk/view/texts/normalized/NATP00056
[boyle]: https://plato.stanford.edu/entries/boyle/
[darwin]: https://darwin-online.org.uk/converted/manuscripts/Darwin_C_R_CUL-DAR26.1-121.html
[shannon]: https://tubes.mit.edu/6S917/_static/2025/resources/shannon38.pdf
[fermentation]: https://www.nlm.nih.gov/exhibition/from-dna-to-beer/index.html
[biochemistry]: https://rockedu.rockefeller.edu/component/biochemistry-fermented-foods/
[buchner]: https://web.lemoyne.edu/~giunta/buchner.html
[raising]: https://www.ifst.org/lovefoodlovescience/resources/raising-agents-physical
[preservation]: https://nchfp.uga.edu/resources/entry/historical-origins-of-food-preservation

## Reproduce the index and the game audit

```sh
python index_iot.py --feed /tmp/in-our-time.rss --output-dir .
# Omit --feed to fetch the official RSS; requires scikit-learn.
node audit_handoffs.ts
node audit_created_threads.ts  # Intentionally fails until the 18 recipe gaps are redesigned.
```

Files: `manifest.json` describes retrieval and coverage, `episode-index.csv` is the full metadata index, `candidate-links.json` is an unverified discovery queue, `verified-connections.json` separates supported claims and design proposals, and `thread-audit.json` records the existing game’s transitions. No episode audio or complete BBC descriptions are included.


## Current follow-up

The Doctrine replacement now passes the created-item continuity audit in all seven non-opening chapters. The active catalogue has 91 non-opening chapters with 17 remaining gaps in the other journeys; the earlier 18-gap figure included the archived Benedictine journey. See `created-thread-audit.json` for the current per-chapter result. This change does not repair the unresolved Mars, Atlas or shoreline connections. Doctrine source decisions and its initial eight-chapter scope are documented in `../doctrine/README.md`.
