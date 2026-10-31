# Independent core prose review

**All assigned text semantically read; blocking issues remain.** This is AI editorial review, not human playtesting.

Inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`. Composed families SHA-256: `5e17777210504ec017ca8c749e42b5b036690d8eb7888dbfd2984b238e7d2b36`.

## Coverage

787 visible-field rows / 598 distinct exact texts / 11,883 words in eight bounded semantic-reading batches. All Divinity final fields and all Ideas chapter/objective/completion/bridge fields. Exact occurrence mapping: `own-entries.json`; source hashes and read batches: `coverage-ledger.json`. No unread assigned text. No source mutations, browser testing, heavy tests or publication.

## Blocking findings

### D1

- `divinity-final-reading-scenes-v7 / source-update arrival fact / prayer-panel-fragment / sourceUpdate.arrivalFact`

Exact text: “The archivist has sent one newly found custody record for this invented fragment case.”

Problem: Explicit author-defense leak on a rendered arrival/bridge field. “invented fragment case” describes the author’s construction, not what the archivist sent. “custody record” also hides a simple meaning.

Minimal suggested replacement: “The archivist has sent a newly found record of who kept the bone.”

### D2

- `divinity-final-reading-scenes-v7 / tile/reader-caption / nature-perfected-line / label`

Exact text: “Aquinas: “grace does not destroy nature, but perfects it” — gloss: God’s help develops human powers rather than erasing them”

Problem: The caption contains the scholarly apparatus marker “— gloss:”. The actual quotation can remain exactly as written; its plain explanation already exists in the reader body.

Minimal suggested replacement: “Aquinas: “grace does not destroy nature, but perfects it””

### D3

- `divinity-final-reading-scenes-v7 / reader-body / ritual-not-cosmology / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-ritual-not-cosmology / text`

Exact text: “Hands and a book show that the rite uses physical objects. They do not establish whether its community believed in one good creator or opposed sources. The Lyon ritual and the Book of Two Principles must not be merged into one universal Cathar doctrine.”

Problem: The explanatory wonder never identifies what the rite does before referring to it, and introduces “Cathar doctrine” without explanation. Its final sentence gives an instruction about combining sources rather than explaining the actual distinction. A reader who skipped primitives needs the ceremony and the separate claims named here.

Minimal suggested replacement: “In the Lyon ritual, ministers lay hands and a Gospel book on a believer while promising forgiveness and God’s Spirit. Using physical objects does not tell us whether this community believed in one good creator or opposed sources of good and evil. The Book of Two Principles argues for opposed sources; the ritual does not state that account.”

### D4

- `divinity-final-reading-scenes-v7 / reader-body / instrumental-baptism / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-instrumental-baptism / text`

Exact text: “For Aquinas, baptism washes the body while God works through the rite to give inward grace. The water is God's instrument, not a second god. This depends on his further belief that God appointed baptism; ordinary water is not automatically a sacrament.”

Problem: The standalone wonder relies on “inward grace” and “sacrament” being explained elsewhere. Its key claim should define the gift in the paragraph, not require opening the primitive.

Minimal suggested replacement: “For Aquinas, baptism washes the body while God works through the water to give grace: a new life within the soul. The water is a tool, not a second god. This depends on his belief that God chose baptism to give that gift.”

### D5

- `divinity-final-reading-scenes-v7 / reader-body / not-sensory-proof / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-not-sensory-proof / text`

Exact text: “Tasting the bread cannot prove the change Aquinas describes, because he says its taste remains. His account rests on faith in divine authority, not on a hidden change detected by the senses.”

Problem: The standalone wonder says “the change Aquinas describes” without saying what the change is. Neither its caption nor the paragraph supplies the missing claim.

Minimal suggested replacement: “Aquinas says the bread becomes Christ’s body while its taste remains. Tasting it therefore cannot prove the change he claims. His account rests on faith in divine authority, not a change detected by the senses.”

### D6

- `divinity-final-reading-scenes-v7 / reader-body / ministry-not-sale / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-ministry-not-sale / text`

Exact text: “A person can serve God without controlling God's gifts. Comparing Luther's limits on church authority with Aquinas's dependent instrument clarifies that distinction without making their doctrines identical.”

Problem: The wonder depends on an unexplained “Aquinas’s dependent instrument” reference and unspecified limits on church authority. The paragraph needs the actual comparison, rather than saying that making a comparison clarifies it.

Minimal suggested replacement: “Luther says church ministers can announce God’s forgiveness but cannot make God forgive for money. Aquinas says baptism’s water acts through God’s power, not its own. Both distinguish serving God from independently controlling God’s gifts, although they address different practices.”

### D7

- `divinity-final-reading-scenes-v7 / reader-body / agency-not-permission / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-agency-not-permission / text`

Exact text: “God’s working through baptism shows a possible role for created means; water is not a person being asked for prayer. That example does not authorize addressing departed saints.

Calvin affirms Christ’s unique, continuing work of bringing people before God. He says asking departed saints lacks biblical permission and obscures that work. He is objecting to the practice, not doubting Christ’s role.”

Problem: The opening presents God’s working through baptism as an unqualified fact rather than Aquinas’s account, and uses the unexplained term “created means”. This obscures which tradition is claiming what.

Minimal suggested replacement: “Aquinas says God can work through baptism’s water. But water is not a person being asked to pray, so this example does not decide whether people should address saints who have died. Calvin rejects those requests: he says they lack biblical permission and obscure Christ’s unique work of bringing people before God.”

### D8

- `divinity-final-reading-scenes-v7 / reader-body / feed-before-letter / reading.text ?? description`
- `divinity-final-reading-scenes-v7 / wonder body / plain-divinity-feed-before-letter / text`

Exact text: “Luther gives household necessities and help for poor neighbours priority over buying an indulgence. With one coin and no supper, the household should buy food first.”

Problem: The wonder’s central contrast depends on “indulgence” without explaining it; a player who did not read the primitive cannot know what the other proposed purchase is.

Minimal suggested replacement: “Luther says a household with one coin and no supper should buy food before an indulgence letter—a grant of relief from penalties for sins already forgiven. Feeding the family and helping poor neighbours come first.”

## Verified corrections and boundaries

- Every Ideas objective is now an open question. All 85-session entry/fallback bodies and every completion/skip bridge were read, not sampled. No blocking voice/comprehension issue found in those Ideas narrative surfaces.
- All Divinity objectives are short open questions. The wound/meal wonder explains enjoying food versus taking what a neighbour is owed, and its italic caption is exactly “The wrong is taking what another is owed”.
- Divinity opposed-origins completion and skip bridge state the actual disagreement between Augustine and the Book of Two Principles. No imaginary-meeting defense remains there. Other ordinary Divinity completions/endings/skip bridges are materially plainer. D1 identifies the additional source-update bridge surface the earlier correction missed.
- All 24 Augustine owned-location label rows omit the prefix only in `divinity-augustine-study` and `divinity-grace-alcove`; their visible location names are “Augustine’s study” and “Augustine’s study — evening”. Default labels restore Augustine elsewhere. Those are two sessions in the same named home study, not unexplained attribution loss in another author’s room.
- All 269 Ideas and 37 Divinity wonders in the composed scenario carry `presentation: explanation`. Current runtime code renders the body `<p>` before the actual item label in `<em>`, with no separate rhetorical heading. This is a read-only markup check, not visual/browser verification. The runtime hash at this later check is `8e7454b1c749705039da002eaa7185f661bfa48426224ff21fa60e117e50fbab`, differing from the initial freeze because the integrator changed arrow wording; story inventory remained frozen.
- The integrator confirmed location travelText, timeLabel, stockBatch narrative/label and chapter travel labels are not rendered in current shared UI. They are outside the inventory; no review coverage claim is made for those hidden fields.
- Genuine philosophical/religious disagreement, uncertainty and historical quotations were not treated as bad prose simply because they reject proof or preserve a distinction. The proposed baptism and faith explanations remain attributed claims, not established religious facts.

## Optional polish only

- Divinity chooser “not a test of faith” and “not a hidden recipe book” may be shortened, but were not treated as blockers because they also frame the player task.
- `plain-divinity-renounce-not-abandon`: “The candidate” could become “In the Lyon ritual, the candidate” to restore context with five words. `plain-divinity-calvin-panel-answer`: “this painting” could become “a chapel painting of Stephen”. These are useful context improvements, not additional semantic blockers.
- `axe-and-water.completionText`: “ordinary water is not automatically a sacrament” could be “ordinary water does not give that gift on its own”, avoiding a technical noun. The preceding belief attribution must remain.
- Reader-only qualifications such as “Nothing here says that the injured person deserves the injury” can be more direct, but preserving the difference between suffering and guilt matters more than deleting every negative sentence.

## Limits

No historical-source verification, graph/reachability certification or visual layout certification is implied. Suggestions are minimal editorial proposals; the source owner must preserve the exact semantic distinctions during implementation and regenerate the inventory before this can be called cleared.
