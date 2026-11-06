# Creation encyclopedia enrichment — 6 November 2026

The [live manuscript](../../stories/creation/creation.md) and its [single design brief](../../stories/creation/design-brief.md) remain in `stories/creation/`. This pass restores optional educational reading while preserving the accepted gameplay. It adds no artwork, combinations or engine semantics.

## Initial enrichment: sources and selection

Compared the current manuscript at `81781b8a` against three files fetched from GitHub:

- [First published Creation](https://github.com/ljw1004/make-something/blob/9e0da0467864490a0b699c2edf6685ab1c9a82e6/stories/creation/creation.md): 206 items, 154 readings.
- [Revised study](https://github.com/ljw1004/make-something/blob/e3c8ffd02098f753fae98bcde2586c81bb9596e4/projects/creation-study/creation.md): 188 items, 170 readings.
- [Promoted revision](https://github.com/ljw1004/make-something/blob/7918d8494f0379872961ec3161538046aabe648e/stories/creation/creation.md): 189 items, 172 readings.

The initial pass retained useful mechanisms, evidence and connections, rewritten for eighth- through twelfth-graders instead of restoring old prose wholesale. It omitted repeated poetic commentary, superseded recipes and abandoned branches. Its explanations of time compression, ancestry versus habitat, myth versus evidence and cultural invention were subsequently revised under the stricter nonfiction direction below.

That first collection had 189 entries, 43 citations to 40 distinct institutional or educational pages, 189 bold titles and 15 date/place subtitles. Median length including title/subtitle was 67 words; the longest was 98 words. Named examples included a Pilbara stromatolite, Canadian banded iron, the Gilboa forest, Tiktaalik, Pakicetus, local bird dialects and a Geissenklösterle flute. The cave's documented Lascaux/Altamira inspiration supplied the painting entry; the approximately 21,000-year Lascaux date described visits dated from bones, not a directly dated painting. Dates refer to their identified example rather than first appearance of a whole lineage.

## Review and verification instructions

Read encyclopedia halves independently of popups, then compare explanations against recipes and linked primary sources. Use separate readability and informed science reviewers; probe revised specific examples and dates again. Parse the baseline and final manuscript to compare all gameplay data and popup text, excluding source locations and encyclopedia fields. Run `npm run lint -- creation` and `node --test tests/wonders.test.ts`. In Chromium at 320×700 and 1440×1000, check an unchanged Void popup, silent Stars creation, direct Stars reading and a sample of index readings, headings, subtitles, links and horizontal bounds. Inspect the phone and desktop presentation.

## Initial enrichment outcomes

Independent readership and science reviews passed after local revisions. Simplified jargon and defensive asides; qualified the grassland chronology; distinguished the Smithsonian flute's object from the displayed cast; attributed the banded-iron mechanism to the museum's interpretation; identified Gilboa and Tiktaalik explicitly in their date subtitles. These are AI editorial checks, not human learning or enjoyment trials.

Parsed comparison passes for all 189 items, 187 recipes, 26 chapters and 107 unchanged popup texts. Lint has zero errors and seven existing warnings, including its 20,000-state fixed-item verification bound. Seven split-reading tests pass. Of 40 linked pages, 32 returned HTTP 200; eight blocked automated retrieval with HTTP 403 but were independently checked through their institutional pages/search extracts. This is not a promise of future link availability.

Chromium passed the original popup/silent-discovery checks and 12 deliberate readings per viewport at 320×700 and 1440×1000. Bold titles, italic subtitles, links and horizontal bounds passed; no page errors occurred. Visual inspection confirmed the phone and desktop presentation. An initial heading check correctly exposed that the existing reader prints `##` literally. The user chose bold titles, which render through existing support; application code remains unchanged. The temporary browser harness also required the desktop book’s existing two-page navigation and waiting for the phone page transition before capture. These were verification-harness corrections, not application changes.

Initial enriched manuscript SHA-256: `f4dd3a11dad84d76a8aba87e51420d4cf0a62a926af4f099bbb6dbf2ec6e95fd`.

Temporary source copies, browser captures and detailed reviewer/check output are discarded after completion. This record preserves instructions and conclusions, not replayable run evidence.

## Nonfiction revision and artwork credits

The user's subsequent direction supersedes the initial pass's explanatory voice. All 189 subjects were audited again. Removed gameplay commentary, recipe explanations, invented observers and narrated ecological events; retained factual causal explanations that stand on their own. Earth, Air, Fire, Water, Waters of the deep and Void now have no encyclopedia entry. The resulting collection has 183 entries and 55 links to 52 distinct sources. Median length including titles and subtitles is 61 words; the longest is 97 words, excluding link URLs.

Language, Story, Teaching, Social group and Shared song lead with explanations of the general practice, with brief documented examples where useful. Removed the overly specific sign-language lead and the borrowed creation-chant entry. The cave entries retain actual Paleolithic evidence and distinguish abstract signs from unsupported astronomical interpretations. Song of creation instead contains the explicitly requested artwork credits: the Pluscarden tapestry's influence on the closing watercolour, and ESO/S. Brunier's photographic Milky Way panorama adapted for the campfire sky, with its CC BY 4.0 licence. The abbey's own account supplies the tapestry quotation's wording, “foundations of the world”.

For this revision, repeat the parsed gameplay/popup comparison and existing lint/split-reading checks above. Read all entries independently of gameplay, review substantive scientific claims against their primary sources, and recheck cultural entries for a general explanation before any example. In the browser, verify the unchanged Void popup, silent Stars discovery, deliberate Stars reading, creation of Shared song and Song of creation, absence of the six empty entries from the index, and ten selected readings including the closing credits. Check 320×700 and 1440×1000 layouts, bold titles, citation targets and horizontal bounds.

Both independent reviewers examined the revised collection; factual and clarity findings were addressed, and the final targeted cultural/credit wording passed the reader's follow-up. Primary evidence supports the revised mammal-survival explanation without inventing a particular refuge or survivor. These are AI editorial reviews, not human learning trials. Parsed gameplay and all 107 popup texts remain identical to the prior baseline across 189 items, 187 recipes and 26 chapters. Final Creation lint returned zero errors and seven existing warnings, including the 20,000-state analysis bound. The seven split-reading tests passed. Both browser sizes passed the popup, silent-discovery, index, ten-reading and credit-link checks with no page errors or horizontal overflow; visual inspection confirmed the phone and desktop presentation. Of fourteen newly introduced source URLs, thirteen returned HTTP 200 and PubMed presented an automated-access challenge; the PubMed study was independently checked through browser-accessible source material. Earlier source checks remain recorded above.

Final revised manuscript SHA-256: `7752274475b1a5b104ba068029d404a74717332288d0e3a744920477d5a9668c`. No application code, gameplay, graphics or hosting configuration changed. Disposable review packets, scripts, logs and captures were removed after recording these outcomes.
