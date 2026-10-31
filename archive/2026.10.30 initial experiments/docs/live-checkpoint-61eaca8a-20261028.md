# Published playtest repairs — source61 preservation checkpoint

This private versioned checkpoint preserves **already-published** Site source `61eaca8a691db7ab5999211f8cd99df54eabc7e0` (successful private deployment **2026-10-28 21:12:53 UTC**). It is an exact direct overlay over published source `86c479746909412d775873d5bb250868ed7bf2d0`, not a replacement of repository-root source or earlier snapshots.

**350 overlay files** (42 replacements, 308 additions, no removals) plus the preserved 86 baseline reconstruct exactly **1,750 sealed source files**. Seal SHA-256: `34f812b17fc1ec2ba3b4226f5b80107b484a4670e18bc40cee7b2d7403346f86`. Original overlay archive SHA-256: `e70771f18a1e6322aa568649eb077e25a263bc1df4e7c54b025cb4029e641ad5`. Every archive member was compared byte-for-byte with the clean actual published checkout. Exact member bytes and modes are preserved without duplicating full source/build archives.

## Restore independently

```sh
python results/live-checkpoint-61eaca8a-20261028/materialize-source.py . /tmp/combination-source61
cd /tmp/combination-source61
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-playtest-contract-final-delta.py
npm ci
npm run build
```

Recorded Node version: v24.22.1. The materializer restores 86 through its c85, 217 and 51 baselines, verifies each replaced parent hash, applies this direct overlay, then verifies the exact final path set, bytes, hashes and executable modes. Lossless gzip/base64 parts keep supported Git tree requests bounded; `storage-transport.json` verifies originals and parts. The archive-only hosting identity does not overwrite root hosting configuration or authorize deployment.

## Verification: no second full-suite claim

The predecessor source seal `98a6b06c306e10553b6764918db79385ae80d70ce91936083087f55b29fcab56` ran the full applicable **1,275 tests: 1,269 passed and six failed**. Its exact log, commands and summary remain in the 24-file final evidence package. The failures were adjudicated as stale assertions, an audit display-format defect, and omitted evidence-text paths—not runtime/content failures. These failed results are not erased or relabelled green.

The final test/evidence-only successor passed **57 affected/source-contract checks** across 11 complete test files. Exact proofs establish unchanged runtime/content/build inputs and 35 byte-identical built artifacts relative to that predecessor. **No second full aggregate was run or is claimed.** Root's actual publication then passed 37 focused checks, 12 synthetic controller checks, offline build and seals. Available exact commands/logs, final evidence and prior assertions/patches are retained. This checkpoint's independent restoration and focused validation are recorded separately in `preservation-validation.json`; historical results are not called new runs.

## Save behavior and scope

The old-save compatibility path may discard only optional camp `arrival`/`arrivalLayout` provenance that listed the obsolete supplied Solar lamp. Actual objects, coordinates, progress, events and other history remain; no replacement provenance is fabricated. Existing duplicates are **not retroactively deleted**. The retained evidence includes 1,168 old-prefix checks and six consumed-Lamp continuations, with their original scope and limits.

All prior GitHub leaves remain untouched. New Ironquarry naming and later narrative/authenticity work are **not in this freeze**. Raw BBC/RSS material, downloaded books/PDFs, private screenshots/images, credentials, dependencies, caches and generated build output are excluded. No Site deployment, audience change, Clio or other-repository write occurs. Model/logical/synthetic controller checks are not native/browser or human testing; no human enjoyment claim is made. Existing build warnings and negative evidence remain visible.
