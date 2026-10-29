# Independent current-engine arrival verification — PASS

Completed 2026-10-28T15:24:18.634Z, using Node v24.22.1.

## Scope and outcome

- All **16 recursively discovered route JSON variants × widths 320, 360, 600 = 48 completed runs** passed on both engines.
- **10,428 accepted actions per engine** (20,856 combined); **10,476 exact initial/post-action physical-state comparisons** passed after stripping only optional arrival metadata.
- **960 advances**: 912 chapter transitions (432 workstation changes and 480 same-workstation handoffs), plus 48 final completion advances.
- **2,112 new-supply entries** exactly matched observed newly discovered cache items; **4,986 carried entries** exactly matched observed before/after physical token area transfers.
- All **480 same-workstation handoffs** retained token-array JSON byte identity and unchanged places, areas, discoveries and opened caches, with no new/carried entries or cues.
- Exact save round trips passed after all 960 advances in both engines; the same 960 frozen-baseline saves loaded unchanged in the current engine. Entire physical state, undo histories and events matched after each advance and at completion.
- Cue outputs for every scenario item matched independently observed chapter-entry deltas at all **10,476 initial/post-action observations**.
- All 24 checked source inputs and live HEAD remained unchanged during the run.
- **Blockers: none.**

## Identity

| Input | SHA-256 / Git commit |
|---|---|
| Scenario JSON | `cafffa9f25754d3246c3ad4f2a212a7dd451c432c2927df92757ef1a3149b1c7` |
| Frozen baseline `engine/model.ts` | `793354131dc6b2cf9a5398e0dc163f5d834e62d477b719e7dedcfdcf6a2c8265` |
| Current live `engine/model.ts` | `444c98f60a5650e696bc65d36e2ae6e5f5c1d5b293d388704e4d82929ef16600` |
| Actual live HEAD, before and after | `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c` |

The source identifies itself as `kitchen-caravan-v6` / **The Kitchen Caravan**, with 20 chapters and 10 workstations. This test does not rename or integrate the candidate.

## Evidence and reproduction

- `verify-arrivals.mjs` — independently authored replay/provenance checker; imports the actual two engines directly, not candidate verification scripts.
- `verification.json` — complete identity, source manifest, per-route results and all transition provenance/token-array hashes.
- `summary.json` — same outcome with per-transition detail omitted.
- `run.log` — process output; exit status 0.
- `CHECKSUMS.sha256` — evidence file integrity hashes.

Reproduce with:

```sh
node /workspace/shared/kitchen-v6-arrival-review-20261028/verify-arrivals.mjs
```

All writes are confined to `/workspace/shared/kitchen-v6-arrival-review-20261028`; inputs are read directly from the specified candidate and live-checkout paths. No git mutation or publication was performed.

## Limits

- Source-only deterministic runtime replay at widths 320, 360, 600; no browser/UI tests, no UI-readability inference, no human playtest.
- No full application build, deployment, or integration verification; this remains a local isolated candidate.
- Route coverage is exactly the 16 supplied JSON route variants; no exhaustive arbitrary-action/undo/resizing/fuzz or corrupted-save tests.
- Script writes evidence only under its own review directory; no source edits, git mutations, or publication.
