# Promotion — 5 November 2026

The user accepted the finished Creation revision and explicitly requested replacement of `stories/creation`, archival of `creation-study`, and GitHub push. Existing hosting and private-access configuration are retained.

The live [manuscript](../../stories/creation/creation.md) is an exact copy of the completed study: SHA-256 `8956853c5fa52815ed877f326d3b1ee8e159c3f53c30abc89492f091a0bc7285`. All 217 locally referenced artwork files were copied byte-for-byte, including conditional hotspot variants. Runtime SVGs embed their image content and need no additional files. The live folder contains only the manuscript, its existing authoritative design brief, and these referenced assets; superseded runtime files were removed.

The complete study was moved to this archive. Before the archive index and this record were added, it held 737 files totalling 156,437,437 bytes (156.4 MB / 149.2 MiB), below the user's 200–300 MB limit. Most bytes are selected artwork masters; retained playtests account for about 3 MB. The largest file is 3.5 MB. No disposable run bundles, checkpoints, screenshots or transcripts were found in the study. The original `2026.11.05 creation study` archive is preserved unchanged.

The repository and archive indexes now point to this completed revision. Backlog and historical-note navigation links were relocated; frozen evidence hashes, embedded source paths and original generation requests retain their historical meaning. Archived commands and runner defaults are labelled as historical. Future Creation edits belong in the live story and its single active brief.

## Final verification

`npm run build` passed catalogue lint, TypeScript and production bundling. Creation retains its seven existing author-review warnings, including the fixed-analysis state limit; the existing Vite advisories remain. All 18 focused site-build, catalogue-description, story-document, story-loading and story-cover tests passed.

Eight Chromium routes through the actual static build passed at 390×664 with emulated touch and 1440×1000 with mouse input: four opening routes cover both ordinary order and early Stars/Asteroids, two cave routes cover all four wall states plus Song and Teaching, and two finale routes reach Song of creation and the ending. Checks include the conditional impact artwork, nested hotspot targeting, item placement and reload persistence. Root routes and a simulated project subdirectory were exercised. The first mobile cave attempt timed out waiting for Start during a parallel run; it passed in isolation without changes, with no page errors. These are focused browser checks, not a fresh full-story human playthrough.

Built catalogue navigation and decoding of all 217 live images passed with no page errors. A separate read-only reviewer confirmed exact manuscript/asset parity, self-contained SVGs, valid navigation links, removal from the active-project index, no runtime dependence on the archive, and no changes to unrelated stories or existing archives. Final retained study size is approximately 156.4 MB; the live story is 24.8 MB. Temporary verification scripts, logs and captures were discarded after these outcomes were recorded.
