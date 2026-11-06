# Selected artwork and extraction

This directory records the source selections and mechanical processing behind all 179 accepted exports. The [asset manifest](asset-manifest.json) maps every current final file to its source master, exact source rectangle, transform and SHA-256. Coverage is complete: 145 circular appearances, 21 receivers and 13 backgrounds. The [artwork overview](../README.md) links current acceptance, manuscript identity and historical planning hashes.

| Artwork | Source selection | Exact processing/output record |
|---|---|---|
| Circular appearances | [Portable manifest](portable-extraction-manifest.json) | [Portable record](portable-extraction-record.json) |
| Open fixed receivers | [Receiver manifest](receiver-extraction-manifest.json) | [Receiver record](receiver-extraction-record.json) |
| Chapter backgrounds | [Background manifest](background-extraction-manifest.json) | [Background record](background-extraction-record.json) |

Selected full sources live in [masters](../masters/), preserving their original generated files. Final files live only in [the manuscript's asset directory](../../assets/lights-that-remain/). The [reference-input index](../reference-inputs.json) maps actual generation inputs to identical retained bytes. Rejected or unselected variants do not become accepted merely because they share a master with a selected cell. A source sheet remains necessary while any selected export or generation reference depends on it.

Use the [packaging tools](../tools/README.md#production-updates) to add batches, rebuild deterministic exports and verify the complete file inventory. These tools perform rectangular copying, uniform resizing, transparent padding and comparison-sheet layout; they do not redraw content, force circular outlines or clean up source alpha. Very faint source alpha wisps remain part of the recorded source crop. All exported icon and receiver edges are checked for complete transparency.

The accepted receiver processing reproduces the three tested pilot PNGs exactly, including transparent vertical padding for names and centred drops; all other receivers use the same geometry. The [final continuity review](../../art-review/2026.11.06_09.44.00/report.md) accepted every asset, including composed fixed targets and repaired scenes. Export-time status fields in the original processing records describe that earlier stage, not unresolved current review. Their recorded tool/manifest hashes identify the extraction run; later CLI help and retention edits do not rewrite that history. [Scene registration](../scene-registration.json) records integration independently.

Verification inputs and detailed outputs remain disposable scratch under `runs/`. Retain concise final review outcomes with the project, and use the [engineering retention policy](../../../../docs/engineering.md#verification-records) when cleaning up.
