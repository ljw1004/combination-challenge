# Source access, purpose and retention

## Purpose and output boundary

The owner clarified that this is temporary private personal research to extract ideas, followed by deletion of the compendium. That clarification is recorded as the intended use, **not a legal conclusion that every use is necessarily fair use**. No rights clearance or BBC licence is claimed. The repository package retains original research findings elsewhere, bibliographic facts, links and coverage evidence, not the source compendium.

## BBC reuse evidence

The accessible official [BBC Terms of Use PDF, version 1.82, dated 19 September 2022](https://downloads.bbc.co.uk/usingthebbc/bbc_terms_of_use_19September2022english.pdf), sections 8 and 15, identifies permission requirements for content, metadata, computer analysis and RSS reuse. Section 8 also points to exceptions, open data and permitted personal podcast downloading. The current HTML version was robots-denied to the web tool, so equivalence to the latest terms is not asserted. These are source-stated terms, not an analysis of enforceability, user acceptance or applicable legal exceptions.

The live [official main RSS](https://podcasts.files.bbci.co.uk/b006qykl.rss) has a BBC copyright notice and a header referring users to BBC terms, including a licence condition for business/commercial uses. Availability of the feed is not evidence of an open licence. Bulk verbatim publication has not been authorized. Short original analysis and links, with temporary internal source use, are kept distinct from republishing a source database.

## Actual access outcomes

| Target/action | Observation | Outcome |
|---|---|---|
| Official main RSS, ordinary HTTP | HTTP 200; 4,568,821 bytes; 1,116 distinct item IDs, all with descriptions | Fact-only audit retained; later description copy used only in a temporary directory after purpose clarification |
| Main RSS through web reader | Unsupported `application/rss+xml` content type | A format limitation, not an access denial; ordinary HTTP XML parsing used |
| RSS host robots | Googlebot-specific restrictions; no prohibition for the identified bibliography client | Robots checked before temporary collection; no identity impersonation |
| BBC programme archive through web | Robots denial | No alternate-route archive crawl attempted |
| Current BBC terms HTML through web | Robots denial | Official downloadable dated PDFs inspected; no current-version guarantee |
| Wikipedia via default Python user-agent | HTTP 403 explicitly requested a User-Agent and respect for robots | An honest identifying agent was supplied; robots allowed the article; HTTP 200 |
| Public Apple distribution descriptions | Text visible without login; some items labelled subscriber early access | Only visible descriptions consulted; no audio, subscription or paywall bypass |
| Three individual Apple episode links | Web cache miss | Public show listing supplied visible descriptions; error not represented as an episode-content read |
| ABC / university / historical-review sources | Public text/search-index evidence | Ten supplemental source-based synopses, explicitly not BBC-verbatim abstracts |

No audio or transcripts were downloaded. No account credentials, private endpoints, archive proxies or mirror domains were used to evade the BBC archive denial.

## Other corpus leads checked

- [Braggoscope methodology](https://www.braggoscope.com/about): descriptions derive from BBC pages; no comprehensive abstract republication licence was established. Used as a count/context cross-check, not copied into the corpus.
- [Episode analysis report](https://playground.mleary.idv.hk/public_html/files/in_our_time_analysis_v5.html): described a 1,062-record scrape; no clear comprehensive abstract reuse licence was found.
- [OpenLearn psychology listening list](https://www.open.edu/openlearn/health-sports-psychology/psychology/our-time-on-psychology-openlearn-listening-list): a small topical selection, not a complete corpus; its quoted programme passages are not treated as a blanket licence for BBC descriptions.

## Cleanup contract

The independent miner explicitly confirmed all temporary source use was finished, after processing all 1,099 canonical abstracts, close-reading 56, reading all ten supplements and saving 29 original leads. The collector verified the two original-findings files persisted, then removed the exact temporary compendium directory, including all derived feature files, and verified its absence at **2026-10-28T17:59:18Z**. The deleted directory contained 38 files. Counts, source URLs, hashes, original analysis and the cleanup record remain; the repository package contains no source abstracts.

This is a verified deletion of the identified workspace files, not a claim of erasure from tool/session records, backups or underlying storage blocks. See `research_coverage.json` for scope and retained-findings hashes.
