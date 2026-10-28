# In Our Time: cleaned catalogue and original research findings

Read [MINING-FINDINGS.md](analysis/MINING-FINDINGS.md) for the final **29 original research directions**. [CATALOGUE-MINING.md](analysis/CATALOGUE-MINING.md) is the explicitly superseded, provisional title/topic-only first pass—not the later full-text analysis.

This private checkpoint preserves exactly **21 original files**: the 17-file cleaned catalogue/provenance/cleanup package and four author-frozen original analysis files. It contains bibliographic facts, IDs, counts, hashes, URLs, source attribution and original design questions. **No BBC abstract compendium, audio, transcript, private image, document-level derived feature text, still-changing Atlas architecture or game candidate is included.** No game source, Site deployment or audience is changed.

## Coverage and limits

The catalogue contains **1,114 records**: 1,109 aired substantive entries, three presenter specials and two future listings. Its RSS bibliography separately records 1,116 IDs. Every catalogue abstract field is null; topic links are not represented as episode summaries. Coverage means the pinned catalogue, not proof of an exhaustive BBC archive.

The miner reports whole-text computational processing of **1,099 available canonical abstracts**, separate close reading of **56**, and reading **10 original source-based supplements** for gaps. Those counts are not a claim of listening to 1,109 broadcasts or reading all 1,099 closely. The 29 retained leads are original analysis rather than episode summaries or an approved chapter roster.

The cleanup record attests deletion of the exact 38-file temporary source/derived directory at **2026-10-28T17:59:18Z**; its absence was checked without searching, reading or refetching deleted content. This is workspace-file deletion, not erasure of session records, backups or storage blocks. The cleanup-time findings hashes remain historical evidence. The author subsequently added deletion-status annotations and marked Stage 1 superseded; those four final versions have separate frozen hashes in `preservation-manifest.json`. Do not mistake their later hashes for the earlier cleanup-time versions.

No permission to republish BBC abstracts or legal fair-use conclusion is asserted. Retained Wikipedia catalogue attribution and CC BY-SA revision/license details remain intact. See [ACCESS_AND_RIGHTS.md](catalogue/ACCESS_AND_RIGHTS.md) for recorded access and rights limits.

## Restore and verify offline

```sh
python research/in-our-time-20261028/materialize-research.py . /tmp/in-our-time-research
python /tmp/in-our-time-research/catalogue/scripts/validate.py /tmp/in-our-time-research/catalogue
cd /tmp/in-our-time-research/catalogue && sha256sum -c SHA256SUMS
```

The materializer verifies every original file byte. Large metadata files use lossless gzip/base64 transport parts, with original and part hashes in `storage-transport.json`; no new source collection is needed. The 17 offline catalogue checks passed on a disposable exact copy without changing its bytes. Additional preservation checks confirmed all 29 lead IDs/titles/dates/URLs and their reported close-reading coverage, null abstract fields, bibliography-only RSS rows, source-index-only gap records and exact freeze hashes. They do not rerun mining, independently verify historical interpretation, or assert all source links remain accessible.
