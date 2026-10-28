# In Our Time — research catalogue and coverage evidence

Snapshot: **28 October 2026**. Prepared for private Atlas inspiration research, not a chapter plan.

## What is retained here

This package contains bibliographic facts, linked subjects, provenance, reproducible catalogue tooling and coverage evidence. **It does not contain the BBC abstract compendium, audio or transcripts.** Every `abstract` field is intentionally null; that is an output/retention decision, not a claim that the episode has no description.

The user's clarified workflow was to examine source material temporarily, extract original ideas and connections, retain those findings and links, then delete the temporary compendium. The separate miner confirmed all source use finished: 1,099 full abstracts computationally analyzed, 56 substantively close-read, all ten source-based supplements read, and 29 original leads retained. **The entire temporary corpus and its derived feature files were deleted and their directory's absence verified on 2026-10-28T17:59:18Z**, after verifying that the original findings persisted. No source compendium is part of this package or any repository upload. See `research_coverage.json` for the bounded workspace-cleanup attestation.

## Exact scope and counts

| Measure | Count |
|---|---:|
| Rows in the pinned Wikipedia catalogue | 1,114 |
| Unique catalogue BBC programme IDs | 1,114 |
| Aired catalogue records | 1,112 |
| Presenter/interview specials within those records | 3 |
| Aired substantive programmes, including documentary miniseries | **1,109** |
| Future scheduled catalogue entries | 2 |
| Official main RSS items / distinct programme IDs | **1,116** |
| Title-matched Archive reissue candidates in that feed | 13 |
| Feed trailer | 1 |
| Canonical substantive descriptions in the RSS research set | **1,099** |
| RSS gaps supplied as labelled, original source-based synopses | **10** |
| Total aired substantive catalogue entries with temporary research material | **1,109** |
| Verbatim source abstracts retained in this package | **0** |

The catalogue starts on **15 October 1998**. Its latest aired programme is **22 October 2026**, with scheduled entries on 29 October and 5 November. It includes the post-Bragg series, rather than silently assuming that the presenter never changed. The three presenter specials and documentary/miniseries formats are separately flagged.

This is full coverage of **this pinned catalogue**, not proof that no programme is absent from every source. The BBC archive page could not be independently enumerated because the web tool reported a robots denial. The unofficial [Braggoscope](https://www.braggoscope.com/) also reported 1,109 excluding repeats, providing a useful count cross-check, not independent proof of completeness.

## Files

- `data/episodes.jsonl`: canonical catalogue, one JSON object per programme. Includes title, first broadcast date, ID, BBC URL, linked subject labels/URLs, contributor names, record type, attribution and exact source revision.
- `data/episodes.csv`: spreadsheet-friendly version. Nested lists are JSON-encoded cells. Blank abstract cells mean intentionally excluded.
- `data/catalogue_scan.txt`: complete chronological title/topic scan for the independent miner.
- `data/rss_bibliographic_inventory.jsonl`: fact-only official feed inventory; no descriptions, images, enclosures, legacy media GUIDs or audio URLs.
- `data/supplementary_source_index.jsonl`: sources and method labels for the ten RSS gaps; **not** their temporary synopses.
- `manifest.json`: catalogue/feed coverage, source hashes, dates and limitations.
- `research_coverage.json`: temporary-research counts, distinct source types and cleanup state.
- `ACCESS_AND_RIGHTS.md`: source/rights findings and actual access outcomes.
- `tests/validation.json`: offline integrity results and data hashes.
- `tests/accuracy_samples.json`: stratified source-to-export spot checks, with their limits.
- `SHA256SUMS`: package hashes; excludes itself.

## Identity, dates and deduplication

**BBC programme ID is the key.** Distinct discussions sharing a title are not merged: both Artificial Intelligence programmes remain. Thirteen later Archive items are linked to likely original programmes by manually checked title correspondence and are not promoted to extra substantive discussions. Their introductions or audio may differ; the mapping is explicitly a candidate match, not audio identity verification. One trailer and three presenter specials are excluded from the substantive research denominator.

**RSS publication date is not first broadcast date.** For example, Particle Accelerators is dated 24 September 2026 in the catalogue but 22 October in the RSS. The 28-day difference explains why an apparently current RSS feed can omit recent broadcasts. Both dates remain available and are never conflated.

The main RSS does not contain Wilberforce (22 February 2007), the five Written World instalments (2–6 January 2012), or four recent broadcasts: Casablanca, Megalosaurus, The Battle of Antietam and Ishtar. These ten have supplemental *original research synopses*, not ten claimed verbatim BBC abstracts. Sources include public BBC distribution descriptions on Apple, ABC rebroadcast listings, the Written World audiobook description and independent historical reviews. The source index preserves that distinction. No subscriber audio, paywalled text, account session or region restriction was bypassed.

The catalogue has linked subjects on 1,092 rows and contributor names on 1,104. Two presenter-special participant lists come from names explicitly stated in the catalogue title; this is labelled separately from the contributor-column extraction. A linked subject is a topic pointer, **not an episode abstract or an assertion about everything discussed**. No per-episode category is invented: `category` is null because the catalogue supplies no controlled category field. Titles are the catalogue's labels, so a few include an anniversary note or differ slightly from the feed title. Both source titles can be compared by ID.

## Reproduction and validation

Python 3.12 and `lxml==6.1.1` were used. The collector makes one identified, robots-checked request for the licensed Wikipedia catalogue; it does **not** crawl BBC programme pages or download the abstract corpus.

```sh
python scripts/collect_catalogue.py --output /tmp/iot-rebuilt
python scripts/validate.py .
```

The default source is [Wikipedia revision 1382152739](https://en.wikipedia.org/wiki/List_of_In_Our_Time_programmes?oldid=1382152739). If network access is unavailable, supply a legitimately retrieved page using `--html PATH`. Source HTML bytes may differ between page renderings; compare parsed IDs and dates as well as byte hashes.

For an RSS file the operator is entitled to process, `scripts/audit_local_rss.py` creates only a local fact-only audit (no network access or descriptive text export). Pass that audit to `collect_catalogue.py --rss-bibliography PATH`. The preserved feed was retrieved on 28 October 2026; a fresh feed is expected to change. The script is not a licence to reuse BBC content. Temporary source collection itself was purpose-limited and is not automatically repeated by these scripts.

The offline validator checks ID uniqueness and syntax, source attribution, future-date treatment, JSONL/CSV parity, complete text-scan rows, explicit abstract exclusion, reissue separation, retention of same-title distinct programmes, feed-versus-broadcast dates and absence of MP3 URLs. It does not claim listening-based verification, historical fact checking of the programme, or an exhaustive BBC archive audit.

## Attribution

Catalogue adaptation: **Wikipedia contributors, “List of In Our Time programmes,” revision 1382152739**, retrieved 28 October 2026, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Changes: table extraction, whitespace/date normalization, contributor-name extraction, record-type flags and separate RSS fact joins. Revision links and attribution are carried on every JSONL row.

The adapted catalogue's protectable text/arrangement is retained under that licence. BBC programme content is **not** relicensed under it. RSS entries here contain only short bibliographic facts; no BBC open-content licence is claimed. All copyright and attribution for independently consulted source material remain with their owners. See `ACCESS_AND_RIGHTS.md`.
